'use server'

import { db, QueueEntry } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateQueueStatusAction(id: string, status: QueueEntry['status']) {
    try {
        const updated = await db.updateQueueStatus(id, status);
        revalidatePath('/admin');
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update queue status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteQueueEntryAction(id: string) {
    try {
        const deleted = await db.deleteQueueEntry(id);
        revalidatePath('/admin');
        return { success: true, data: deleted };
    } catch (error) {
        console.error("Failed to delete queue entry:", error);
        return { success: false, error: "Failed to delete entry" };
    }
}
