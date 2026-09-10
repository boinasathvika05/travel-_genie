# adminapp/urls.py

from django.urls import path
from . import views

app_name = "adminapp"

urlpatterns = [

    path("dashboard/", views.admin_dashboard, name="admin_dashboard"),

    path("users/", views.users, name="users"),
    path("users/add/", views.add_user, name="add_user"),
    path("users/export/", views.export_users, name="export_users"),
    path("hotels/", views.hotels, name="hotels"),
    path("hotels/add/", views.add_hotel, name="add_hotel"),
    path("destinations/", views.destinations, name="destinations"),
    path("destinations/add/", views.add_destination, name="add_destination"),
    path("bookings/", views.bookings, name="bookings"),
    path("bookings/add/", views.add_booking, name="add_booking"),
    path("reviews/", views.reviews, name="reviews"),
    path("contacts/", views.contacts, name="contacts"),
    path("reports/", views.reports, name="reports"),
    path("reports/generate/", views.generate_report, name="generate_report"),
    path("analytics/", views.analytics, name="analytics"),
    path("settings/", views.settings, name="settings"),

    path("logout/", views.admin_logout, name="admin_logout"),   # create later if needed
]