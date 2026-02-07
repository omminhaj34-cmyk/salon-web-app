import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Missing status' },
                { status: 400 }
            );
        }

        const updatedEntry = db.updateQueueStatus(id, status);

        if (!updatedEntry) {
            return NextResponse.json(
                { error: 'Entry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedEntry);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update queue entry' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deletedEntry = db.deleteQueueEntry(id);

        if (!deletedEntry) {
            return NextResponse.json(
                { error: 'Entry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(deletedEntry);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete queue entry' },
            { status: 500 }
        );
    }
}
