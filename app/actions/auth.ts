"use server"

import { db } from "@/lib/db"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function signup(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!name || !email || !password) {
        return { error: "Missing fields" }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "CUSTOMER",
        },
    })

    await createSession(user.id, user.role)
    redirect("/")
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Missing fields" }
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user || user.password.startsWith("$2a$") === false) {
        // Handle legacy users or invalid password format if any, though we seeded correctly
        // For now, if no password or invalid format, we can't login easily unless we handle plain text migration
        // but we seeded with hash, so strict check is fine.
        if (!user || !user.password) {
            return { error: "Invalid credentials" }
        }
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return { error: "Invalid credentials" }
    }

    await createSession(user.id, user.role)
    redirect("/")
}

export async function logout() {
    await deleteSession()
    revalidatePath("/")
    redirect("/login")
}
