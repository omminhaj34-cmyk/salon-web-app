"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QueueEntry } from "@/lib/db"
import { Play, CheckCheck, XCircle, Loader2 } from "lucide-react"
import { updateQueueStatusAction, deleteQueueEntryAction } from "@/app/actions/queue"

interface AdminQueueManagerProps {
    initialQueue: QueueEntry[]
}

export function AdminQueueManager({ initialQueue }: AdminQueueManagerProps) {
    // We use props for initial render, but Server Actions + revalidatePath will refresh the page prop.
    // However, for immediate feedback in a client component, we might want to use optimistic updates or just rely on the router refresh.
    // Since we are using revalidatePath in the action, the page data will update. 
    // But this component receives `initialQueue` from the parent Server Component.
    // When the Server Action finishes and revalidates, the Server Component re-renders and passes new `initialQueue`.
    // So we should sync state with props or just use props directly if we don't need optimistic UI (state is simpler).

    // Actually, simply using `initialQueue` directly is fine if we trust Next.js to re-render the server component.
    // But to show loading states, we need local state.

    const [loading, setLoading] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, newStatus: QueueEntry['status']) => {
        setLoading(id)
        try {
            const result = await updateQueueStatusAction(id, newStatus)
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
        if (!confirm("Are you sure you want to remove this entry?")) return;
        setLoading(id)
        try {
            const result = await deleteQueueEntryAction(id)
            if (!result.success) {
                alert("Failed to delete entry")
            }
        } catch (error) {
            console.error("Failed to delete entry", error)
            alert("An error occurred")
        } finally {
            setLoading(null)
        }
    }

    const waitingQueue = initialQueue.filter(q => q.status === 'WAITING')
    const servingQueue = initialQueue.filter(q => q.status === 'IN_SERVICE')

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Currently Serving</h3>
                {servingQueue.length === 0 ? (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                        No one is currently in the chair.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {servingQueue.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg bg-primary/10 border-primary/20">
                                <div>
                                    <div className="font-bold text-lg">{entry.guestName}</div>
                                    <div className="text-sm text-muted-foreground">Ticket #{entry.ticketNumber}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleStatusUpdate(entry.id, 'COMPLETED')}
                                        disabled={loading === entry.id}
                                    >
                                        {loading === entry.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
                                        Done
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Up Next</h3>
                {waitingQueue.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">Queue is empty.</div>
                ) : (
                    <div className="space-y-2">
                        {waitingQueue.map((entry, index) => (
                            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium">{entry.guestName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Ticket #{entry.ticketNumber} • {new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleStatusUpdate(entry.id, 'IN_SERVICE')}
                                        disabled={loading === entry.id}
                                        title="Call to chair"
                                    >
                                        {loading === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleStatusUpdate(entry.id, 'CANCELLED')}
                                        disabled={loading === entry.id}
                                        title="Cancel"
                                    >
                                        {loading === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
