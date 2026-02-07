"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Barbershop } from "@/lib/db"
import { updateShopAction } from "@/app/actions/settings"
import { Save, Loader2 } from "lucide-react"

interface AdminShopFormProps {
    shop: Barbershop
}

export function AdminShopForm({ shop }: AdminShopFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        hours: shop.hours || "",
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await updateShopAction(shop.id, formData)
            if (!result.success) {
                alert("Failed to update shop details")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input
                        id="shop-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="shop-phone">Phone</Label>
                    <Input
                        id="shop-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="shop-address">Address</Label>
                    <Input
                        id="shop-address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="shop-hours">Opening Hours</Label>
                    <Input
                        id="shop-hours"
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                        placeholder="e.g. Mon-Fri 9am-6pm"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
