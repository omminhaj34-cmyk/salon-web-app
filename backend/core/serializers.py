from rest_framework import serializers
from .models import User, Barbershop, Service, QueueEntry, Appointment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class BarbershopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barbershop
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class QueueEntrySerializer(serializers.ModelSerializer):
    # Nested serializers for read operations? Or just IDs? 
    # For now, let's include depth or nested serializers for better frontend consumption
    # But read/write might need different serializers. simpler to just use generic or primary keys for write.
    # Let's add read_only fields for expanded data
    service_details = ServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = QueueEntry
        fields = '__all__'
        read_only_fields = ['joined_at', 'ticket_number']

class AppointmentSerializer(serializers.ModelSerializer):
    service_details = ServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['created_at']
