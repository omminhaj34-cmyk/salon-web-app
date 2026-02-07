from django.contrib import admin
from .models import User, Barbershop, Service, QueueEntry, Appointment

admin.site.register(User)
admin.site.register(Barbershop)
admin.site.register(Service)
admin.site.register(QueueEntry)
admin.site.register(Appointment)
