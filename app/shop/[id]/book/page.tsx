import { BookAppointmentForm } from "@/components/book-appointment-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mb-8">
                <Link href={`/shop/${id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Queue Status
                </Link>
            </div>
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Book an Appointment</h1>
                <BookAppointmentForm barbershopId={id} />
            </div>
        </div>
    )
}
