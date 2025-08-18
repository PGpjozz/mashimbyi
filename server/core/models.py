from django.db import models

QUALIFICATIONS = [
    ("Grade 11", "Grade 11"),
    ("Grade 12", "Grade 12"),
    ("Certificate", "Certificate"),
    ("Diploma", "Diploma"),
    ("Other", "Other"),
]

GENDERS = [
    ("Male", "Male"),
    ("Female", "Female"),
    ("Other", "Other"),
    ("Prefer not to say", "Prefer not to say"),
]

class Course(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Application(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    surname = models.CharField(max_length=100)
    gender = models.CharField(max_length=20, choices=GENDERS)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    highest_qualification = models.CharField(max_length=50, choices=QUALIFICATIONS)
    motivation = models.TextField()
    id_number = models.CharField(max_length=13)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    qualification_doc = models.FileField(upload_to="qualifications/")
    id_doc = models.FileField(upload_to="ids/")
    cv = models.FileField(upload_to="cvs/")
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.surname}"


class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    program = models.ForeignKey(Course, on_delete=models.CASCADE)
    id_number = models.CharField(max_length=13)
    enrolled_courses = models.ManyToManyField(Course, related_name="students")
    qualification_file = models.FileField(upload_to="qualifications/", blank=True, null=True)
    id_file = models.FileField(upload_to="ids/", blank=True, null=True)
    cv_file = models.FileField(upload_to="cvs/", blank=True, null=True)
    student_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
