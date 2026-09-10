from django.urls import path
from . import views

app_name = "mainapp"

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.user_login, name='login'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('trip-planner/', views.trip_planner, name='trip_planner'),
    path('budget/', views.budget, name='budget'),
    path('hotels/', views.hotels, name='hotels'),
    path('sightseeing/', views.sightseeing, name='sightseeing'),
    path('translator/', views.translator, name='translator'),
    path('emergency_guide/', views.emergency_guide, name='emergency_guide'),
    path('profile/', views.profile, name='profile'),
    path('notifications/', views.notifications, name='notifications'),
    path('messages/', views.messages_page, name='messages_page'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/',views.forgot_password,name='forgot_password'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('api/itinerary/', views.generate_itinerary, name='generate_itinerary'),
    path('api/budget_insights/', views.generate_budget_insights, name='generate_budget_insights'),
]
