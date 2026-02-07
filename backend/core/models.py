from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('BARBER', 'Barber'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')

class Barbershop(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    hours = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Service(models.Model):
    barbershop = models.ForeignKey(Barbershop, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=100)
    duration = models.IntegerField(help_text="Duration in minutes")
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class QueueEntry(models.Model):
    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('IN_SERVICE', 'In Service'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    # Allows guest users (no user account)
    guest_name = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='queue_entries')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    barbershop = models.ForeignKey(Barbershop, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    ticket_number = models.IntegerField()
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.ticket_number} - {self.guest_name or self.user.username}"

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('NOSHOW', 'No Show'),
    )
    # Allows guest booking
    guest_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    barbershop = models.ForeignKey(Barbershop, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.guest_name or self.user.username} - {self.start_time}"
