import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const key = new TextEncoder().encode(process.env.JWT_SECRET || "secret_key_change_me")

const cookie = {
    name: "session",
    options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" },
    duration: 24 * 60 * 60 * 1000,
}

export async function encryptSession(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1day")
        .sign(key)
}

export async function decryptSession(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function createSession(userId: string, role: string) {
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encryptSession({ userId, role, expires })

    const cookieStore = await cookies()
    cookieStore.set(cookie.name, session, { ...cookie.options, expires })
}

export async function verifySession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(cookie.name)?.value
    const payload = await decryptSession(session)

    if (!payload?.userId) {
        redirect("/login")
    }

    return { userId: payload.userId as string, role: payload.role as string }
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(cookie.name)?.value
    const payload = await decryptSession(session)
    return payload ? { userId: payload.userId as string, role: payload.role as string } : null
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(cookie.name)
}
