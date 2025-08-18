from rest_framework import serializers
from .models import Course, Application, Student

class CourseSerializer(serializers.ModelSerializer):
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = "__all__"  # or list fields + 'enrolled_count'

    def get_enrolled_count(self, obj):
        return obj.students.count()  # assumes related_name="students" in Student.enrolled_courses

class ApplicationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    
    class Meta:
        model = Application
        fields = "__all__"
        extra_fields = ["course_name"]

class StudentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source="program.name", read_only=True)
    enrolled_courses = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )

    class Meta:
        model = Student
        fields = "__all__"
