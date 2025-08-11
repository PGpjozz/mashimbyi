from django.db import models
from django.contrib.auth.models import AbstractUser

def generate_student_number():
    import random
    while True:
        number = str(random.randint(100000, 999999))
        if not Student.objects.filter(student_number=number).exists():
            return number

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    student_number = models.CharField(max_length=6, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.user_type == 'student' and not self.student_number:
            self.student_number = generate_student_number()
        super().save(*args, **kwargs)

class Student(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='student_profile')
    student_number = models.CharField(max_length=6, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    enrolled_program = models.ForeignKey('Program', on_delete=models.SET_NULL, null=True, blank=True)
    enrolled_on = models.DateTimeField(auto_now_add=True)
    qualification_file = models.FileField(upload_to='qualifications/', blank=True, null=True)
    id_file = models.FileField(upload_to='ids/', blank=True, null=True)
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)

    def __str__(self):
        return f"{self.student_number} - {self.first_name} {self.last_name}"

class Program(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Application(models.Model):
    reference_number = models.CharField(max_length=6, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, default="")
    middle_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    gender = models.CharField(max_length=30, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=30, blank=True, default="")
    qualification = models.CharField(max_length=50, blank=True, default="")
    motivation = models.TextField(blank=True, default="")
    qualification_file = models.FileField(upload_to='qualifications/', blank=True, null=True)
    id_file = models.FileField(upload_to='ids/', blank=True, null=True)
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=10, choices=(('pending', 'Pending'), ('enrolled', 'Enrolled'), ('rejected', 'Rejected')), default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            import random
            while True:
                ref = str(random.randint(100000, 999999))
                if not Application.objects.filter(reference_number=ref).exists():
                    self.reference_number = ref
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_number} - {self.first_name} {self.last_name} - {self.program.name}"
