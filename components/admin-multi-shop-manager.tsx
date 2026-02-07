"use client"

import { useState } from "react"
import { Barbershop, Service, Staff, User } from "@/lib/db"
import { AdminShopSettings } from "@/components/admin-shop-settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Store } from "lucide-react"
import { createShopAction } from "@/app/actions/settings"

interface AdminMultiShopManagerProps {
    initialShops: Barbershop[]
    services: Service[]
    staff: (Staff & { user: User })[]
    users: User[]
}

export function AdminMultiShopManager({ initialShops, services, staff, users }: AdminMultiShopManagerProps) {
    const [selectedShopId, setSelectedShopId] = useState<string | null>(initialShops[0]?.id || null)
    const [isCreating, setIsCreating] = useState(false)
    const [newShopData, setNewShopData] = useState({ name: "", address: "", phone: "", hours: "" })
    const [loading, setLoading] = useState(false)

    const selectedShop = initialShops.find(s => s.id === selectedShopId)

    const handleCreateShop = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await createShopAction(newShopData)
            if (result.success) {
                setIsCreating(false)
                setNewShopData({ name: "", address: "", phone: "", hours: "" })
                // The page will revalidate, but we might need to wait or rely on the parent to pass new props.
                // For now, let's just alert success implies data refresh on next server render.
            } else {
                alert("Failed to create shop")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating shop")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar List */}
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Salons</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {initialShops.map(shop => (
                            <Button
                                key={shop.id}
                                variant={selectedShopId === shop.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => {
                                    setSelectedShopId(shop.id)
                                    setIsCreating(false)
                                }}
                            >
                                <Store className="mr-2 h-4 w-4" />
                                <span className="truncate">{shop.name}</span>
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            className="w-full justify-start border-dashed"
                            onClick={() => setIsCreating(true)}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Salon
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
                {isCreating ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Salon</CardTitle>
                            <CardDescription>Enter details for the new location.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateShop} className="space-y-4 max-w-lg">
                                <div className="space-y-2">
                                    <Label>Shop Name</Label>
                                    <Input required value={newShopData.name} onChange={e => setNewShopData({ ...newShopData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input required value={newShopData.address} onChange={e => setNewShopData({ ...newShopData, address: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input required value={newShopData.phone} onChange={e => setNewShopData({ ...newShopData, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hours (Optional)</Label>
                                    <Input value={newShopData.hours} onChange={e => setNewShopData({ ...newShopData, hours: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Salon"}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : selectedShop ? (
                    <AdminShopSettings
                        key={selectedShop.id} // Reset state when shop changes
                        shop={selectedShop}
                        services={services}
                        staff={staff}
                        users={users}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        Select a salon to manage or create a new one.
                    </div>
                )}
            </div>
        </div>
    )
}
