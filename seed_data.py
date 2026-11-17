import os
import django
import random
from datetime import timedelta, date

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TravelGenie.settings")
django.setup()

from mainapp.models import Booking, Hotel, Destination

def seed_data():
    from django.contrib.auth.models import User

    # Ensure admin user exists
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@travelgenie.com", "admin123")
        print("Created default admin user: admin / admin123")

    if not Booking.objects.exists():

        print("Creating mock bookings...")
        names = ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Ethan Hunt"]
        destinations = ["Paris, France", "Tokyo, Japan", "New York, USA", "London, UK", "Rome, Italy"]
        statuses = ["confirmed", "pending", "cancelled"]
        
        for i in range(5):
            Booking.objects.create(
                booking_id=f"BKG-{1000+i}",
                guest_name=names[i],
                hotel_name=f"Grand Hotel {i+1}",
                check_in=date.today() + timedelta(days=i),
                check_out=date.today() + timedelta(days=i+3),
                guests=random.randint(1, 4),
                amount=random.uniform(200.0, 1500.0),
                status=random.choice(statuses)
            )

    print("Data seeding complete.")

if __name__ == "__main__":
    seed_data()
