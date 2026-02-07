import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const queue = await db.getQueue();
    // Sort queue by joinedAt or ticketNumber if needed
    return NextResponse.json(queue);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { guestName, serviceId, barbershopId } = body;

        if (!guestName || !serviceId || !barbershopId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newEntry = await db.addToQueue({
            guestName, // Assuming walk-in/guest for now
            userId: null,
            serviceId,
            barbershopId,
            status: 'WAITING',
        });

        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to join queue' },
            { status: 500 }
        );
    }
}
