import { prisma } from './prisma';
import { QueueEntry as PrismaQueueEntry, Appointment as PrismaAppointment, User as PrismaUser, Barbershop as PrismaBarbershop, Service as PrismaService, Staff as PrismaStaff } from '../generated/prisma';

// Re-export types for compatibility
export type User = PrismaUser;
export type Barbershop = PrismaBarbershop;
export type Service = PrismaService;
export type Staff = PrismaStaff;
export type QueueEntry = PrismaQueueEntry;
export type Appointment = PrismaAppointment;

export const db = {
  getUsers: async () => {
    return await prisma.user.findMany();
  },
  getBarbershop: async () => {
    return await prisma.barbershop.findFirst();
  },
  getBarbershopById: async (id: string) => {
    return await prisma.barbershop.findUnique({ where: { id } });
  },
  getBarbershops: async () => {
    return await prisma.barbershop.findMany();
  },
  updateBarbershop: async (id: string, data: Partial<Barbershop>) => {
    return await prisma.barbershop.update({
      where: { id },
      data,
    });
  },
  createBarbershop: async (data: { name: string; address: string; phone: string; hours?: string }) => {
    return await prisma.barbershop.create({ data });
  },
  getServices: async (barbershopId?: string) => {
    if (barbershopId) {
      return await prisma.service.findMany({ where: { barbershopId } });
    }
    return await prisma.service.findMany();
  },
  getQueue: async (barbershopId?: string) => {
    try {
      const where = barbershopId ? { barbershopId } : {};
      return await prisma.queueEntry.findMany({
        where,
        orderBy: { ticketNumber: 'asc' },
        include: { user: true, service: true },
      });
    } catch (error) {
      console.error("Database Error in getQueue:", error);
      throw error;
    }
  },
  addToQueue: async (entry: Omit<QueueEntry, 'id' | 'joinedAt' | 'ticketNumber' | 'completedAt' | 'startTime'>) => {
    // Ticket number is no longer autoincrement in schema (SQLite limit workaround), so we must calculate it manually.
    // In a real app with high concurrency, this needs a transaction or a better ID strategy.
    // For this app, finding max ticketNumber is acceptable.
    const lastEntry = await prisma.queueEntry.findFirst({
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true }
    });
    const nextTicketNumber = (lastEntry?.ticketNumber || 0) + 1;

    return await prisma.queueEntry.create({
      data: {
        ...entry,
        ticketNumber: nextTicketNumber,
        status: 'WAITING',
      },
    });
  },
  updateQueueStatus: async (id: string, status: QueueEntry['status']) => {
    return await prisma.queueEntry.update({
      where: { id },
      data: { status },
    });
  },
  deleteQueueEntry: async (id: string) => {
    return await prisma.queueEntry.delete({
      where: { id },
    });
  },
  getAppointments: async () => {
    return await prisma.appointment.findMany({
      orderBy: { startTime: 'asc' },
    });
  },
  addAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.appointment.create({
      data: appointment,
    });
  },
  updateAppointment: async (id: string, updates: Partial<Appointment>) => {
    return await prisma.appointment.update({
      where: { id },
      data: updates,
    });
  },
  deleteAppointment: async (id: string) => {
    return await prisma.appointment.delete({
      where: { id },
    });
  },
  // Service Management
  addService: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.service.create({
      data: service,
    });
  },
  updateService: async (id: string, updates: Partial<Service>) => {
    return await prisma.service.update({
      where: { id },
      data: updates,
    });
  },
  deleteService: async (id: string) => {
    return await prisma.service.delete({
      where: { id },
    });
  },
  // Staff Management
  getStaff: async () => {
    return await prisma.staff.findMany({
      include: { user: true },
    });
  },
  addStaff: async (userId: string, barbershopId: string) => {
    const existingStaff = await prisma.staff.findFirst({
      where: { userId }
    });
    if (existingStaff) return existingStaff;

    // Also update user role to BARBER
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'BARBER' }
    });

    return await prisma.staff.create({
      data: {
        userId,
        barbershopId,
      },
    });
  },
  updateStaff: async (id: string, updates: Partial<Staff>) => {
    return await prisma.staff.update({
      where: { id },
      data: updates,
    });
  },
  deleteStaff: async (id: string) => {
    const staff = await prisma.staff.delete({
      where: { id },
    });
    // Revert user role to CUSTOMER (optional, but good for cleanup)
    await prisma.user.update({
      where: { id: staff.userId },
      data: { role: 'CUSTOMER' }
    });
    return staff;
  }
};
