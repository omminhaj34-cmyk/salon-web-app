from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Service, QueueEntry, Appointment, Barbershop
from .serializers import ServiceSerializer, QueueEntrySerializer, AppointmentSerializer, BarbershopSerializer

class BarbershopViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Barbershop.objects.all()
    serializer_class = BarbershopSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class QueueViewSet(viewsets.ModelViewSet):
    queryset = QueueEntry.objects.all().order_by('joined_at')
    serializer_class = QueueEntrySerializer

    def perform_create(self, serializer):
        # Auto-generate ticket number logic
        last_entry = QueueEntry.objects.order_by('-ticket_number').first()
        next_ticket = (last_entry.ticket_number + 1) if last_entry else 1
        serializer.save(ticket_number=next_ticket)

    @action(detail=False, methods=['GET'])
    def status(self, request):
        # Custom endpoint for live status if needed, or just use list
        waiting = self.queryset.filter(status='WAITING').count()
        serving = self.queryset.filter(status='IN_SERVICE').first()
        return Response({
            'waitingCount': waiting,
            'currentServing': QueueEntrySerializer(serving).data if serving else None
        })

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('start_time')
    serializer_class = AppointmentSerializer
