import { db } from "@/lib/db"
import { AdminMultiShopManager } from "@/components/admin-multi-shop-manager"

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const shops = await db.getBarbershops()
    const services = await db.getServices()
    const staff = await db.getStaff()
    const users = await db.getUsers()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
                <p className="text-muted-foreground">Manage your salons, services, and staff.</p>
            </div>

            <AdminMultiShopManager
                initialShops={shops}
                services={services}
                staff={staff}
                users={users}
            />
        </div>
    )
}
