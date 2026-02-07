"use server"

import { db, Service, Staff } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Service Actions
export async function createServiceAction(data: { name: string; duration: number; price: number; barbershopId: string }) {
    try {
        await db.addService(data)
        revalidatePath("/admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to create service:", error)
        return { success: false, error: "Failed to create service" }
    }
}

export async function updateServiceAction(id: string, data: Partial<Service>) {
    try {
        await db.updateService(id, data)
        revalidatePath("/admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to update service:", error)
        return { success: false, error: "Failed to update service" }
    }
}

export async function deleteServiceAction(id: string) {
    try {
        await db.deleteService(id)
        revalidatePath("/admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete service:", error)
        return { success: false, error: "Failed to delete service" }
    }
}

// Staff Actions
export async function addStaffAction(userId: string, barbershopId: string) {
    try {
        await db.addStaff(userId, barbershopId)
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to add staff:", error)
        return { success: false, error: "Failed to add staff" }
    }
}

export async function removeStaffAction(id: string) {
    try {
        await db.deleteStaff(id)
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to remove staff:", error)
        return { success: false, error: "Failed to remove staff" }
    }
}

export async function toggleStaffStatusAction(id: string, isActive: boolean) {
    try {
        await db.updateStaff(id, { isActive })
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to update staff status:", error)
        return { success: false, error: "Failed to update staff status" }
    }
}

// Shop Actions
export async function updateShopAction(id: string, data: { name: string; address: string; phone: string; hours: string }) {
    try {
        await db.updateBarbershop(id, data)
        revalidatePath("/admin/settings")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to update shop:", error)
        return { success: false, error: "Failed to update shop" }
    }
}

export async function createShopAction(data: { name: string; address: string; phone: string; hours?: string }) {
    try {
        await db.createBarbershop(data)
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to create shop:", error)
        return { success: false, error: "Failed to create shop" }
    }
}
