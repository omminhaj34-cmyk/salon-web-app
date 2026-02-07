"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { type Service } from "@/lib/db"
import { format } from "date-fns"

interface BookAppointmentFormProps {
    barbershopId: string
}

export function BookAppointmentForm({ barbershopId }: BookAppointmentFormProps) {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        serviceId: "",
    })

    // Mock time slots for now
    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    ]
    const [selectedTime, setSelectedTime] = useState("")

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to load services", err))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !selectedTime) return

        setLoading(true)

        // Combine date and time
        const [hours, minutes] = selectedTime.split(":").map(Number)
        const startTime = new Date(date)
        startTime.setHours(hours, minutes)

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    startTime: startTime.toISOString(),
                    barbershopId: barbershopId,
                }),
            })

            if (res.ok) {
                router.push("/book/success")
            } else {
                console.error("Failed to book appointment")
            }
        } catch (error) {
            console.error("Error booking appointment", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>Choose a slot that works for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border mx-auto"
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    />
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                            <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Details</CardTitle>
                    <CardDescription>Tell us who you are.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                        {date && selectedTime && (
                            <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                                <p className="font-semibold">Summary:</p>
                                <p>Date: {format(date, "PPP")}</p>
                                <p>Time: {selectedTime}</p>
                            </div>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading || !date || !selectedTime || !formData.serviceId}>
                            {loading ? "Booking..." : "Confirm Booking"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
