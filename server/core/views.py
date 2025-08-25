from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, parser_classes, permission_classes, action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Application, Student
from .serializers import CourseSerializer, ApplicationSerializer, StudentSerializer

# Admin-only ViewSets
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAdminUser]

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        application = self.get_object()
        # Create Student from Application
        student = Student.objects.create(
            first_name=application.first_name,
            last_name=application.surname,
            email=application.email,
            program=application.course,
            id_number=application.id_number,
            qualification_file=application.qualification_doc,
            id_file=application.id_doc,
            cv_file=application.cv,
            enrollment_month=getattr(application, 'enrollment_month', None),
        )
        # Optionally set student_number or enrolled_courses here
        student.enrolled_courses.add(application.course)
        student.save()
        # Delete the application after enrolling
        application.delete()
        return Response({'message': 'Application enrolled as student!'}, status=status.HTTP_200_OK)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAdminUser]

# Public endpoint for anonymous application submission
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_application(request):
    data = {
        "first_name": request.data.get("first_name"),
        "middle_name": request.data.get("middle_name"),
        "surname": request.data.get("last_name"),
        "gender": request.data.get("gender"),
        "email": request.data.get("email"),
        "phone": request.data.get("phone"),
        "highest_qualification": request.data.get("qualification"),
        "motivation": request.data.get("motivation"),
        "course": request.data.get("course"),
        "id_number": request.data.get("id_number"),
        "qualification_doc": request.FILES.get("qualification_doc"),
        "id_doc": request.FILES.get("id_doc"),
        "cv": request.FILES.get("cv"),
    }

    serializer = ApplicationSerializer(data=data)
    if serializer.is_valid():
        application = serializer.save()

        # Email notification
        from django.core.mail import send_mail
        from django.conf import settings
        subject = "New Application Submitted"
        message = f"A new application has been submitted.\n\nName: {application.first_name} {application.middle_name} {application.surname}\nEmail: {application.email}\nPhone: {application.phone}\nCourse: {application.course}\nEnrollment Month: {getattr(application, 'enrollment_month', '')}"
        recipient_list = ["miyelaniclimate@gmail.com"]  # Send notification to your personal email
        print("Sending notification email to", recipient_list)
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list, fail_silently=False)

        return Response({"message": "Application submitted successfully"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 👇 Public read-only courses for frontend
class PublicCourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        "username": user.username,
        "is_superuser": user.is_superuser,
        "is_staff": user.is_staff,
        "email": user.email,
    })
