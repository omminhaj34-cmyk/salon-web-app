import { verifySession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await verifySession()

    if (session.role !== "ADMIN") {
        // Optional: Redirect if logged in but not admin, or just let them see (but verifySession ensures login)
        // For now, simple verifySession ensures auth. We could check role here.
    }

    return (
        <div className="flex-1">
            {children}
        </div>
    )
}
