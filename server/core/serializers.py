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
    cv_url = serializers.SerializerMethodField()
    id_doc_url = serializers.SerializerMethodField()
    qualification_doc_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = "__all__"
        extra_fields = ["course_name", "cv_url", "id_doc_url", "qualification_doc_url"]

    def get_presigned_url(self, file_field):
        if not file_field:
            return None
        try:
            import boto3
            from django.conf import settings
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=getattr(settings, "AWS_ACCESS_KEY_ID", None),
                aws_secret_access_key=getattr(settings, "AWS_SECRET_ACCESS_KEY", None),
                region_name=getattr(settings, "AWS_S3_REGION_NAME", None),
            )
            bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", None)
            url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": file_field.name},
                ExpiresIn=3600,
            )
            return url
        except Exception:
            return None

    def get_cv_url(self, obj):
        return self.get_presigned_url(obj.cv)

    def get_id_doc_url(self, obj):
        return self.get_presigned_url(obj.id_doc)

    def get_qualification_doc_url(self, obj):
        return self.get_presigned_url(obj.qualification_doc)

class StudentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source="program.name", read_only=True)
    enrolled_courses = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )
    qualification_file_url = serializers.SerializerMethodField()
    id_file_url = serializers.SerializerMethodField()
    cv_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"
        extra_fields = ["program_name", "qualification_file_url", "id_file_url", "cv_file_url"]

    def get_presigned_url(self, file_field):
        if not file_field:
            return None
        try:
            import boto3
            from django.conf import settings
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=getattr(settings, "AWS_ACCESS_KEY_ID", None),
                aws_secret_access_key=getattr(settings, "AWS_SECRET_ACCESS_KEY", None),
                region_name=getattr(settings, "AWS_S3_REGION_NAME", None),
            )
            bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", None)
            url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": file_field.name},
                ExpiresIn=3600,
            )
            return url
        except Exception:
            return None

    def get_qualification_file_url(self, obj):
        return self.get_presigned_url(obj.qualification_file)

    def get_id_file_url(self, obj):
        return self.get_presigned_url(obj.id_file)

    def get_cv_file_url(self, obj):
        return self.get_presigned_url(obj.cv_file)
