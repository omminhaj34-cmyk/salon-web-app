import { JoinQueueForm } from "@/components/join-queue-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function JoinPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-8">
                <Link href={`/shop/${id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Queue Status
                </Link>
            </div>
            <JoinQueueForm barbershopId={id} />
        </div>
    )
}
