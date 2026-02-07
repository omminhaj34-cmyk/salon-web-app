"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { type Service } from "@/lib/db"

interface JoinQueueFormProps {
    barbershopId: string
}

export function JoinQueueForm({ barbershopId }: JoinQueueFormProps) {
    const router = useRouter()
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        guestName: "",
        serviceId: "",
    })

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to load services", err))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Hardcoding barbershopId for now as per mock data
            const res = await fetch("/api/queue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    barbershopId: barbershopId,
                }),
            })

            if (res.ok) {
                router.push("/")
                router.refresh()
            } else {
                console.error("Failed to join queue")
            }
        } catch (error) {
            console.error("Error joining queue", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Join the Queue</CardTitle>
                <CardDescription>Enter your details to get in line.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Your Name"
                            required
                            value={formData.guestName}
                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <Select
                            required
                            onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name} ({service.duration} min - ₹{service.price})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Joining..." : "Get Ticket"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
