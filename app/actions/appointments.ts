'use server'

import { db, Appointment } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Since db.ts uses data.json, we don't need Prisma client here yet.
// If we had Prisma, we would use it here.


export async function updateAppointmentStatusAction(id: string, status: Appointment['status']) {
    try {
        const updated = db.updateAppointment(id, { status });
        revalidatePath('/admin');
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update appointment status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteAppointmentAction(id: string) {
    try {
        const deleted = db.deleteAppointment(id);
        revalidatePath('/admin');
        return { success: true, data: deleted };
    } catch (error) {
        console.error("Failed to delete appointment:", error);
        return { success: false, error: "Failed to delete appointment" };
    }
}
