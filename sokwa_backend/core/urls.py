from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, PublicCourseViewSet, submit_application, user_info, ApplicationViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'public-courses', PublicCourseViewSet, basename='public-course')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('application/', submit_application, name='submit_application'),
    path('user/', user_info, name='user_info'),
]
