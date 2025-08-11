from django.contrib.auth import authenticate, get_user_model
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Program, Application, Student
from .serializers import ProgramSerializer, ApplicationSerializer, StudentSerializer
from django.utils.decorators import method_decorator

class ProgramListView(generics.ListCreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplyView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def perform_update(self, serializer):
        app = serializer.save()
        if app.status == "Accepted":
            app.applicant.is_student = True
            app.applicant.save()

class EnrollApplicationView(APIView):
    def post(self, request, pk):
        try:
            app = Application.objects.get(pk=pk)
            user, created = User.objects.get_or_create(
                username=app.email or app.reference_number,
                defaults={
                    "first_name": app.first_name,
                    "last_name": app.last_name,
                    "email": app.email,
                    "user_type": "student",
                    "student_number": app.reference_number,
                }
            )
            Student.objects.get_or_create(
                user=user,
                defaults={
                    "student_number": app.reference_number,
                    "first_name": app.first_name,
                    "last_name": app.last_name,
                    "email": app.email,
                    "enrolled_program": app.program,
                    "qualification_file": app.qualification_file,
                    "id_file": app.id_file,
                    "cv_file": app.cv_file,
                }
            )
            app.delete()
            return Response({"message": "Applicant enrolled and application deleted."}, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

class RejectApplicationView(APIView):
    def post(self, request, pk):
        try:
            app = Application.objects.get(pk=pk)
            app.status = "rejected"
            app.save()
            return Response({"message": "Application rejected."}, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

class ProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user and user.is_superuser:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials or not a superuser"}, status=status.HTTP_403_FORBIDDEN)
