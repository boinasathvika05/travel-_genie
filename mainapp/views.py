from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from .models import ContactMessage

def home(request):
    return render(request, 'mainapp/index.html')

def about(request):
    return render(request, 'mainapp/about.html')

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        if name and email and subject and message:
            ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            messages.success(request, "Your message has been sent successfully! We'll get back to you soon.")
            return redirect('mainapp:contact')
        else:
            messages.error(request, "Please fill out all required fields.")
            
    return render(request, 'mainapp/contact.html')
def dashboard(request):

    hour = datetime.now().hour

    if hour < 12:
        greeting = "Good Morning"
    elif hour < 17:
        greeting = "Good Afternoon"
    else:
        greeting = "Good Evening"

    return render(request, "mainapp/dashboard.html", {
        "greeting": greeting
    })

@login_required(login_url='mainapp:login')
def trip_planner(request):
    return render(request, 'mainapp/trip_planner.html')


def budget(request):
    return render(request, 'mainapp/budget.html')


def hotels(request):
    return render(request, 'mainapp/hotels.html')


def sightseeing(request):
    return render(request, 'mainapp/sightseeing.html')


def translator(request):
    return render(request, 'mainapp/translator.html')


def emergency_guide(request):
    return render(request, 'mainapp/emergency_guide.html')


def profile(request):
    return render(request, 'mainapp/profile.html')

def notifications(request):
    return render(request, 'mainapp/notifications.html')

def messages_page(request):
    return render(request, 'mainapp/messages_page.html')

def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect('mainapp:home')

def login_page(request):
    return render(request, 'mainapp/login.html')



def register(request):

    if request.method == "POST":

        full_name = request.POST["full_name"]
        email = request.POST["email"]
        username = request.POST["username"]
        password = request.POST["password"]
        confirm_password = request.POST["confirm_password"]

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect("mainapp:register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect("mainapp:register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect("mainapp:register")

        first_name = full_name.split()[0]
        last_name = " ".join(full_name.split()[1:])

        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        messages.success(request, "Registration successful! Please login.")

        return redirect("mainapp:login")

    return render(request, "mainapp/register.html")

def forgot_password(request):
    return render(request, "mainapp/forgot_password.html")

def user_login(request):

    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        login_mode = request.POST.get("login_mode", "user")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            # ===========================
            # ADMIN LOGIN
            # ===========================

            if login_mode == "admin":

                if user.is_staff:

                    login(request, user)

                    return redirect("adminapp:admin_dashboard")

                else:

                    return render(request, "mainapp/login.html", {
                        "error": "You are not authorized as an administrator.",
                        "login_mode": login_mode
                    })

            # ===========================
            # USER LOGIN
            # ===========================

            login(request, user)

            return redirect("mainapp:dashboard")

        else:
            return render(request, "mainapp/login.html", {
                "error": "Invalid username or password.",
                "login_mode": login_mode
            })

    return render(request, "mainapp/login.html")

import json
import os
from django.http import JsonResponse
from groq import Groq

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")
            
            if not user_message:
                return JsonResponse({"error": "No message provided"}, status=400)
                
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return JsonResponse({"error": "API key not configured"}, status=500)
                
            client = Groq(api_key=api_key)
            
            system_prompt = (
                "You are TravelGenie Assistant, a helpful and friendly travel planning AI. "
                "Keep your answers concise, helpful, and formatted well. You help with finding hotels, budgeting, and planning itineraries. "
                "If the user asks for a navigation path, route, or directions from one location to another, provide clear, step-by-step navigation instructions, including typical modes of transport, estimated times, and distances. "
                "IMPORTANT: If the user asks for an image of a hostel, food, or any destination, you MUST include a markdown image link in your response. "
                "Use this exact format: ![Image Description](https://loremflickr.com/600/400/keyword) where keyword is the subject (e.g. hostel, food, paris). "
                "Note: Popular tourist destinations in Andhra Pradesh include Tirumala Venkateswara Temple (Tirupati), Borra Caves (Araku Valley), Undavalli Caves (Vijayawada), Rushikonda Beach (Visakhapatnam), and Belum Caves (Kurnool). "
                "Also note that Ooty is a famous tourist destination."
            )
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_message,
                    }
                ],
                model=os.environ.get("GROQ_AI_MODEL", "openai/gpt-oss-20b"),
                temperature=0.3
            )
            
            bot_response = chat_completion.choices[0].message.content
            return JsonResponse({"response": bot_response})
            
        except Exception as e:
            print(f"Chatbot API Error: {str(e)}") # Add server-side logging
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def generate_itinerary(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            from_loc = data.get("from", "")
            to_loc = data.get("to", "")
            departure_date = data.get("departure_date", "")
            return_date = data.get("return_date", "")
            travelers = data.get("travelers", "")
            budget = data.get("budget", "")
            travel_style = data.get("travel_style", "")
            interests = data.get("interests", "")
            user_prompt = data.get("prompt", "")
            
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return JsonResponse({"error": "API key not configured"}, status=500)
                
            client = Groq(api_key=api_key)
            
            system_prompt = (
                "You are TravelGenie Assistant, an expert travel planner. "
                "Generate a detailed, day-by-day itinerary based on the user's criteria. "
                "Format the response beautifully in HTML, using <h3> for days, <ul> for activities, and <p> for descriptions. "
                "Do NOT include markdown blockquotes (```html). Just output raw HTML. Include placeholder images if relevant using <img src='https://loremflickr.com/600/400/destination'> style tags."
            )
            
            user_message = f"Please plan a trip from {from_loc} to {to_loc}. Dates: {departure_date} to {return_date}. Travelers: {travelers}. Budget: {budget}. Style: {travel_style}. Interests: {interests}. Additional details: {user_prompt}"
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model=os.environ.get("GROQ_AI_MODEL", "openai/gpt-oss-20b"),
                temperature=0.3
            )
            
            itinerary_html = chat_completion.choices[0].message.content
            return JsonResponse({"itinerary": itinerary_html})
            
        except Exception as e:
            print(f"Itinerary API Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def generate_budget_insights(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            destination = data.get("destination", "your destination")
            total = data.get("total", 0)
            travelers = data.get("travelers", 1)
            duration = data.get("duration", 1)
            duration_unit = data.get("duration_unit", "week")
            
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return JsonResponse({"error": "API key not configured"}, status=500)
                
            client = Groq(api_key=api_key)
            
            system_prompt = (
                "You are TravelGenie Assistant, an expert financial travel planner. "
                "The user has calculated a budget for their trip. Provide a brief, encouraging 2-paragraph analysis of their budget. "
                "Tell them if it's realistic, and give 3 bullet points of money-saving tips specific to their destination. "
                "Format the response beautifully in HTML. Just output raw HTML."
            )
            
            user_message = f"I am planning a trip to {destination} for {travelers} people for {duration} {duration_unit}. My calculated total budget is ${total}. Can you give me an analysis and 3 specific saving tips for this destination?"
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model=os.environ.get("GROQ_AI_MODEL", "openai/gpt-oss-20b"),
                temperature=0.3
            )
            
            insights_html = chat_completion.choices[0].message.content
            return JsonResponse({"insights": insights_html})
            
        except Exception as e:
            print(f"Budget API Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)