"use client"

import { Barbershop, Service, Staff, User } from "@/lib/db"
import { AdminServiceManager } from "@/components/admin-service-manager"
import { AdminStaffManager } from "@/components/admin-staff-manager"
import { AdminShopForm } from "@/components/admin-shop-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminShopSettingsProps {
    shop: Barbershop
    services: Service[]
    staff: (Staff & { user: User })[]
    users: User[]
}

export function AdminShopSettings({ shop, services, staff, users }: AdminShopSettingsProps) {
    const shopServices = services.filter(s => s.barbershopId === shop.id)
    const shopStaff = staff.filter(s => s.barbershopId === shop.id)

    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <Card>
                    <CardHeader>
                        <CardTitle>Shop Details</CardTitle>
                        <CardDescription>
                            Update contact information and opening hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminShopForm shop={shop} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="services">
                <Card>
                    <CardHeader>
                        <CardTitle>Services Menu</CardTitle>
                        <CardDescription>
                            Configure the services offered at {shop.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminServiceManager
                            initialServices={shopServices}
                            barbershopId={shop.id}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="staff">
                <Card>
                    <CardHeader>
                        <CardTitle>Staff Management</CardTitle>
                        <CardDescription>
                            Manage access for barbers and staff members.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminStaffManager
                            initialStaff={shopStaff}
                            users={users}
                            barbershopId={shop.id}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
