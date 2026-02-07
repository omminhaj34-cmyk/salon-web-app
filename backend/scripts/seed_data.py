import os
import sys
import json
import django
from datetime import datetime, timezone

# Add backend to path to import models
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qcrew_backend.settings')
django.setup()

from core.models import User, Barbershop, Service, QueueEntry, Appointment

def seed():
    data_path = os.path.join(os.path.dirname(__file__), '../../data.json')
    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}")
        return

    with open(data_path, 'r') as f:
        data = json.load(f)

    print("Seeding Bathershops...")
    for shop_data in data.get('barbershops', []):
        Barbershop.objects.update_or_create(
            name=shop_data['name'],
            defaults={
                'address': shop_data['address'],
                'phone': shop_data['phone'],
                'hours': shop_data['hours']
            }
        )

    shop = Barbershop.objects.first()

    print("Seeding Users...")
    for user_data in data.get('users', []):
        if not User.objects.filter(username=user_data['name']).exists(): # Use name as username for simplicity
            user = User.objects.create_user(
                username=user_data['name'],
                email=user_data['email'],
                password='password123', # Default password
                role=user_data['role']
            )
            if user_data['role'] == 'ADMIN':
                user.is_staff = True
                user.is_superuser = True
                user.save()

    print("Seeding Services...")
    for service_data in data.get('services', []):
        Service.objects.update_or_create(
            name=service_data['name'],
            defaults={
                'barbershop': shop,
                'duration': service_data['duration'],
                'price': service_data['price']
            }
        )

    print("Seeding Queue...")
    for q_data in data.get('queue', []):
        try:
            service = Service.objects.get(name='Classic Haircut') # Fallback or match by ID if possible, but IDs changed
            # In real migration we map IDs, here we just assume basic matching or create new
             # Since IDs in json are "service-1", we can't match directly to DB IDs which are auto-increment.
             # We'll just pick the first service for now or try to match names if available in source.
             # The mock data has serviceId "service-1".
            
            QueueEntry.objects.create(
                guest_name=q_data['guestName'],
                service=service,
                barbershop=shop,
                status=q_data['status'],
                ticket_number=q_data['ticketNumber']
            )
        except Exception as e:
            print(f"Skipping queue entry: {e}")

    print("Seeding done.")

if __name__ == '__main__':
    seed()
