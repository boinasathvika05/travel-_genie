from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.contrib import messages
from mainapp.models import Hotel, Destination, Booking, Report



@login_required(login_url="mainapp:login")
def admin_dashboard(request):

    if not request.user.is_staff:
        return redirect("mainapp:dashboard")

    recent_bookings = Booking.objects.order_by("-date_added")[:5]
    
    # Mock data for reviews since model doesn't exist yet
    recent_reviews = [
        {"user": "Sarah M.", "hotel": "Grand Hotel Paris", "rating": 5, "status": "published"},
        {"user": "John D.", "hotel": "Tokyo Resort", "rating": 4, "status": "published"},
        {"user": "Emma W.", "hotel": "London Inn", "rating": 5, "status": "pending"},
        {"user": "Michael T.", "hotel": "Rome Villas", "rating": 3, "status": "published"},
    ]

    context = {
        "recent_bookings": recent_bookings,
        "recent_reviews": recent_reviews,
        "total_confirmed": Booking.objects.filter(status="confirmed").count(),
        "total_pending": Booking.objects.filter(status="pending").count(),
        "total_cancelled": Booking.objects.filter(status="cancelled").count(),
    }

    return render(request, "adminapp/admin_dashboard.html", context)


from django.db.models import Q
import csv
from django.http import HttpResponse

@login_required(login_url="mainapp:login")
def users(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    query = request.GET.get("q", "")
    role_filter = request.GET.get("role", "")
    status_filter = request.GET.get("status", "")

    users_list = User.objects.all().order_by("-date_joined")

    if query:
        users_list = users_list.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        )

    if role_filter:
        if role_filter == "admin":
            users_list = users_list.filter(is_superuser=True)
        elif role_filter == "manager":
            users_list = users_list.filter(is_staff=True, is_superuser=False)
        elif role_filter == "user":
            users_list = users_list.filter(is_staff=False, is_superuser=False)

    if status_filter:
        if status_filter == "active":
            users_list = users_list.filter(is_active=True)
        elif status_filter == "inactive" or status_filter == "suspended":
            users_list = users_list.filter(is_active=False)

    context = {
        "users": users_list,
        "q": query,
        "role_filter": role_filter,
        "status_filter": status_filter
    }
    return render(request, "adminapp/users.html", context)


@login_required(login_url="mainapp:login")
def export_users(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    query = request.GET.get("q", "")
    role_filter = request.GET.get("role", "")
    status_filter = request.GET.get("status", "")

    users_list = User.objects.all().order_by("-date_joined")

    if query:
        users_list = users_list.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        )

    if role_filter:
        if role_filter == "admin":
            users_list = users_list.filter(is_superuser=True)
        elif role_filter == "manager":
            users_list = users_list.filter(is_staff=True, is_superuser=False)
        elif role_filter == "user":
            users_list = users_list.filter(is_staff=False, is_superuser=False)

    if status_filter:
        if status_filter == "active":
            users_list = users_list.filter(is_active=True)
        elif status_filter == "inactive" or status_filter == "suspended":
            users_list = users_list.filter(is_active=False)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'

    writer = csv.writer(response)
    writer.writerow(['Username', 'First Name', 'Last Name', 'Email', 'Role', 'Status', 'Date Joined'])

    for u in users_list:
        if u.is_superuser:
            role = "Admin"
        elif u.is_staff:
            role = "Manager"
        else:
            role = "User"
            
        status = "Active" if u.is_active else "Inactive"
        
        writer.writerow([u.username, u.first_name, u.last_name, u.email, role, status, u.date_joined.strftime("%Y-%m-%d")])

    return response


@login_required(login_url="mainapp:login")
def add_user(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")

    if request.method == "POST":
        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        username = request.POST.get("username")
        password = request.POST.get("password")
        role = request.POST.get("role")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect("adminapp:users")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect("adminapp:users")

        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Split full name into first and last name if possible
        if full_name:
            name_parts = full_name.split(" ", 1)
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = name_parts[1]

        if role == "admin" or role == "manager":
            user.is_staff = True
            if role == "admin":
                user.is_superuser = True

        user.save()
        messages.success(request, f"User {username} successfully added.")
        return redirect("adminapp:users")

    return redirect("adminapp:users")


@login_required(login_url="mainapp:login")
def hotels(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    hotels_list = Hotel.objects.all().order_by("-date_added")
    context = {
        "hotels": hotels_list
    }
    return render(request, "adminapp/hotels.html", context)

@login_required(login_url="mainapp:login")
def add_hotel(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    if request.method == "POST":
        name = request.POST.get("name")
        city = request.POST.get("city")
        category = request.POST.get("category")
        rating = request.POST.get("rating", 1)
        status = request.POST.get("status", "pending")
        rooms = request.POST.get("rooms", 0)
        
        hotel = Hotel(
            name=name,
            city=city,
            category=category,
            rating=rating,
            status=status,
            rooms=rooms
        )
        hotel.save()
        messages.success(request, f"Hotel '{name}' added successfully.")
        return redirect("adminapp:hotels")
        
    return redirect("adminapp:hotels")


@login_required(login_url="mainapp:login")
def destinations(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    destinations_list = Destination.objects.all().order_by("-date_added")
    context = {
        "destinations": destinations_list
    }
    return render(request, "adminapp/destinations.html", context)


@login_required(login_url="mainapp:login")
def add_destination(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    if request.method == "POST":
        name = request.POST.get("name")
        country = request.POST.get("country")
        category = request.POST.get("category")
        popularity = request.POST.get("popularity", 1)
        status = request.POST.get("status", "active")
        
        destination = Destination(
            name=name,
            country=country,
            category=category,
            popularity=popularity,
            status=status
        )
        destination.save()
        messages.success(request, f"Destination '{name}' added successfully.")
        return redirect("adminapp:destinations")
        
    return redirect("adminapp:destinations")


@login_required(login_url="mainapp:login")
def bookings(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    bookings_list = Booking.objects.all().order_by("-date_added")
    
    # Calculate stats
    total_bookings = bookings_list.count()
    confirmed_bookings = bookings_list.filter(status='confirmed').count()
    pending_bookings = bookings_list.filter(status='pending').count()
    cancelled_bookings = bookings_list.filter(status='cancelled').count()
    
    context = {
        "bookings": bookings_list,
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "pending_bookings": pending_bookings,
        "cancelled_bookings": cancelled_bookings,
    }
    return render(request, "adminapp/bookings.html", context)


@login_required(login_url="mainapp:login")
def add_booking(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    if request.method == "POST":
        booking_id = request.POST.get("booking_id")
        guest_name = request.POST.get("guest_name")
        hotel_name = request.POST.get("hotel_name")
        check_in = request.POST.get("check_in")
        check_out = request.POST.get("check_out")
        guests = request.POST.get("guests", 1)
        amount = request.POST.get("amount", 0)
        status = request.POST.get("status", "pending")
        
        # Simple validation
        if Booking.objects.filter(booking_id=booking_id).exists():
            messages.error(request, f"Booking ID '{booking_id}' already exists.")
            return redirect("adminapp:bookings")
            
        booking = Booking(
            booking_id=booking_id,
            guest_name=guest_name,
            hotel_name=hotel_name,
            check_in=check_in,
            check_out=check_out,
            guests=guests,
            amount=amount,
            status=status
        )
        booking.save()
        messages.success(request, f"Booking '{booking_id}' added successfully.")
        return redirect("adminapp:bookings")
        
    return redirect("adminapp:bookings")


def reviews(request):
    return render(request, "adminapp/reviews.html")


def contacts(request):
    return render(request, "adminapp/contacts.html")


@login_required(login_url="mainapp:login")
def reports(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    reports_list = Report.objects.all().order_by("-date_added")
    
    total_reports = reports_list.count()
    
    context = {
        "reports": reports_list,
        "total_reports": total_reports,
    }
    return render(request, "adminapp/reports.html", context)

@login_required(login_url="mainapp:login")
def generate_report(request):
    if not request.user.is_staff:
        return redirect("mainapp:dashboard")
        
    if request.method == "POST":
        name = request.POST.get("name")
        category = request.POST.get("category")
        format = request.POST.get("format", "pdf")
        
        report = Report(
            name=name,
            category=category,
            format=format,
            status="ready"
        )
        report.save()
        messages.success(request, f"Report '{name}' generated successfully.")
        return redirect("adminapp:reports")
        
    return redirect("adminapp:reports")


def analytics(request):
    return render(request, "adminapp/analytics.html")


def settings(request):
    return render(request, "adminapp/settings.html")


def admin_logout(request):
    logout(request)
    return redirect("mainapp:login")