from django.urls import path
from .views import (
    ApplicationListCreateView, ApplicationUpdateView,
    EnrollApplicationView, RejectApplicationView, ProgramListView, ProgramDetailView,
    StudentListView, StudentDetailView, AdminLoginView
)

urlpatterns = [
    path('programs/', ProgramListView.as_view(), name='program-list'),
    path('programs/<int:pk>/', ProgramDetailView.as_view(), name='program-detail'),
    path('application/', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('application/<int:pk>/', ApplicationUpdateView.as_view(), name='application-update'),
    path('application/<int:pk>/enroll/', EnrollApplicationView.as_view(), name='application-enroll'),
    path('application/<int:pk>/reject/', RejectApplicationView.as_view(), name='application-reject'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),
    path('auth/admin-login/', AdminLoginView.as_view(), name='admin-login'),
]
