from django.contrib import admin
from .models import Application, Course

class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "middle_name",
        "surname",
        "email",
        "phone",
        "course",
        "submitted_at",
    )
    list_filter = ("course", "highest_qualification", "gender", "submitted_at")
    search_fields = ("first_name", "surname", "email", "phone")

admin.site.register(Application, ApplicationAdmin)
admin.site.register(Course)
