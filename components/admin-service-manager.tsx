"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/db"
import { createServiceAction, deleteServiceAction, updateServiceAction } from "@/app/actions/settings"
import { Trash2, Edit2, Plus, Save, X } from "lucide-react"

interface AdminServiceManagerProps {
    initialServices: Service[]
    barbershopId: string
}

export function AdminServiceManager({ initialServices, barbershopId }: AdminServiceManagerProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        duration: 30,
        price: 0
    })

    const resetForm = () => {
        setFormData({ name: "", duration: 30, price: 0 })
        setIsAdding(false)
        setEditingId(null)
    }

    const handleCreate = async () => {
        setLoading(true)
        try {
            await createServiceAction({ ...formData, barbershopId })
            resetForm()
        } catch (error) {
            console.error(error)
            alert("Failed to create service")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (id: string) => {
        setLoading(true)
        try {
            await updateServiceAction(id, formData)
            resetForm()
        } catch (error) {
            console.error(error)
            alert("Failed to update service")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this service?")) return
        setLoading(true)
        try {
            await deleteServiceAction(id)
        } catch (error) {
            console.error(error)
            alert("Failed to delete service")
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (service: Service) => {
        setFormData({
            name: service.name,
            duration: service.duration,
            price: service.price
        })
        setEditingId(service.id)
        setIsAdding(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Services List</h3>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding || !!editingId}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            {isAdding && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                    <h4 className="font-semibold">New Service</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Buzz Cut"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (min)</Label>
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price (₹)</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={resetForm} disabled={loading}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={loading}>Save</Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {initialServices.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        {editingId === service.id ? (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mr-4">
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                />
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        ) : (
                            <div className="flex-1">
                                <div className="font-semibold">{service.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {service.duration} mins • ₹{service.price}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {editingId === service.id ? (
                                <>
                                    <Button size="icon" variant="ghost" onClick={resetForm} disabled={loading}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" onClick={() => handleUpdate(service.id)} disabled={loading}>
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="icon" variant="ghost" onClick={() => startEdit(service)} disabled={loading || !!editingId || isAdding}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(service.id)} disabled={loading || !!editingId || isAdding}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
