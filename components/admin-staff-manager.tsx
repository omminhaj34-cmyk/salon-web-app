"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Keep for fallback or search
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Staff, User } from "@/lib/db"
import { addStaffAction, removeStaffAction, toggleStaffStatusAction } from "@/app/actions/settings"
import { Trash2, UserPlus, Power, CheckCircle2, XCircle } from "lucide-react"

interface AdminStaffManagerProps {
    initialStaff: (Staff & { user: User })[]
    users: User[]
    barbershopId: string
}

export function AdminStaffManager({ initialStaff, users, barbershopId }: AdminStaffManagerProps) {
    const [selectedUserId, setSelectedUserId] = useState<string>("")
    const [loading, setLoading] = useState(false)

    // Filter out users who are already staff
    const staffUserIds = new Set(initialStaff.map(s => s.userId))
    const eligibleUsers = users.filter(u => !staffUserIds.has(u.id))

    const handleAddStaff = async () => {
        if (!selectedUserId) return
        setLoading(true)
        try {
            await addStaffAction(selectedUserId, barbershopId)
            setSelectedUserId("")
        } catch (error) {
            console.error(error)
            alert("Failed to add staff")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveStaff = async (id: string) => {
        if (!confirm("Remove this staff member? This will revoke their Barber access.")) return
        setLoading(true)
        try {
            await removeStaffAction(id)
        } catch (error) {
            console.error(error)
            alert("Failed to remove staff")
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setLoading(true)
        try {
            await toggleStaffStatusAction(id, !currentStatus)
        } catch (error) {
            console.error(error)
            alert("Failed to update staff status")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                    <UserPlus className="h-4 w-4" /> Add Staff Member
                </h4>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a user to promote" />
                            </SelectTrigger>
                            <SelectContent>
                                {eligibleUsers.length === 0 ? (
                                    <SelectItem value="none" disabled>No eligible users found</SelectItem>
                                ) : (
                                    eligibleUsers.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAddStaff} disabled={!selectedUserId || loading}>
                        Add Staff
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {initialStaff.map(staff => (
                    <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <div className="font-semibold flex items-center gap-2">
                                {staff.user.name}
                                {staff.isActive ? (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Active
                                    </span>
                                ) : (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <XCircle className="h-3 w-3" /> Inactive
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">{staff.user.email}</div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={staff.isActive ? "outline" : "default"}
                                onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                                disabled={loading}
                            >
                                <Power className="mr-2 h-3 w-3" />
                                {staff.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveStaff(staff.id)}
                                disabled={loading}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
