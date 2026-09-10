from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    rating = models.IntegerField(default=1) # 1 to 5
    status = models.CharField(max_length=20, default='pending') # active, pending, inactive
    rooms = models.IntegerField(default=0)
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Destination(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    popularity = models.IntegerField(default=1) # 1 to 100
    status = models.CharField(max_length=20, default='active') # active, inactive
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Booking(models.Model):
    booking_id = models.CharField(max_length=50, unique=True)
    guest_name = models.CharField(max_length=255)
    hotel_name = models.CharField(max_length=255)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField(default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending') # confirmed, pending, cancelled
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_id} - {self.guest_name}"

class Report(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    format = models.CharField(max_length=20, default='pdf')
    status = models.CharField(max_length=20, default='ready') # ready, processing, failed
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} - {self.name}"
