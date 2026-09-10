from django.contrib import admin
from .models import Hotel, Destination, Booking, Report, ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('subject', 'name', 'email', 'message')

admin.site.register(Hotel)
admin.site.register(Destination)
admin.site.register(Booking)
admin.site.register(Report)
