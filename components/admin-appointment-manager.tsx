"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Appointment } from "@/lib/db"
import { CheckCheck, XCircle, Loader2, Clock, Calendar } from "lucide-react"
import { updateAppointmentStatusAction, deleteAppointmentAction } from "@/app/actions/appointments"

interface AdminAppointmentManagerProps {
    initialAppointments: Appointment[]
}

export function AdminAppointmentManager({ initialAppointments }: AdminAppointmentManagerProps) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
        setLoading(id)
        try {
            const result = await updateAppointmentStatusAction(id, newStatus)
            if (!result.success) {
                alert("Failed to update status")
            }
        } catch (error) {
            console.error("Failed to update status", error)
            alert("An error occurred")
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to cancel and remove this appointment?")) return;
        setLoading(id)
        try {
            const result = await deleteAppointmentAction(id)
            if (!result.success) {
                alert("Failed to delete appointment")
            }
        } catch (error) {
            console.error("Failed to delete appointment", error)
            alert("An error occurred")
        } finally {
            setLoading(null)
        }
    }

    const scheduled = initialAppointments.filter(a => a.status === 'SCHEDULED')
    const others = initialAppointments.filter(a => a.status !== 'SCHEDULED')

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Upcoming Appointments</h3>
                {scheduled.length === 0 ? (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                        No scheduled appointments.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {scheduled.map((ppt) => (
                            <div key={ppt.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div>
                                    <div className="font-bold text-lg">{ppt.guestName}</div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(ppt.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(ppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(ppt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {ppt.email && <div className="text-xs text-muted-foreground mt-1">{ppt.email}</div>}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleStatusUpdate(ppt.id, 'COMPLETED')}
                                        disabled={loading === ppt.id}
                                    >
                                        {loading === ppt.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
                                        Complete
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleStatusUpdate(ppt.id, 'CANCELLED')}
                                        disabled={loading === ppt.id}
                                    >
                                        {loading === ppt.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {others.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg text-muted-foreground">Recent History</h3>
                    <div className="space-y-2 opacity-70">
                        {others.slice(0, 5).map((ppt) => (
                            <div key={ppt.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                <div>
                                    <div className="font-medium">{ppt.guestName}</div>
                                    <div className="text-xs text-muted-foreground">{new Date(ppt.startTime).toLocaleDateString()} {new Date(ppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div className="text-xs font-semibold px-2 py-1 rounded bg-secondary text-secondary-foreground">
                                    {ppt.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
