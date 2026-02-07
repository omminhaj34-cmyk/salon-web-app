import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const appointments = await db.getAppointments();
    return NextResponse.json(appointments);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, serviceId, barbershopId, startTime } = body;

        if (!name || !email || !serviceId || !barbershopId || !startTime) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newAppointment: any = {
            // id and createdAt are handled by DB default/cuid
            userId: null,
            guestName: name,
            email,
            serviceId,
            barbershopId,
            startTime,
            endTime: new Date(new Date(startTime).getTime() + 30 * 60000).toISOString(), // Mock 30 min duration
            status: 'SCHEDULED',
        };

        const data = await db.addAppointment(newAppointment);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to book appointment' },
            { status: 500 }
        );
    }
}
