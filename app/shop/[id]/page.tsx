import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ShopPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const shop = await db.getBarbershopById(id);

    if (!shop) {
        notFound();
    }

    const queue = await db.getQueue(shop.id);
    const services = await db.getServices(shop.id);

    const waitingCount = queue.filter(q => q.status === 'WAITING').length;
    const currentServing = queue.find(q => q.status === 'IN_SERVICE');

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tighter text-primary">Qcrew</h1>
                    </div>
                    <nav className="space-x-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary">Staff Login</Link>
                    </nav>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Left Column: Shop Info & Actions */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                                {shop.name}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Premium grooming services. Join the queue from anywhere, show up when it's your turn.
                            </p>

                            <div className="flex flex-col space-y-3 mb-8">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                                    {shop.address}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-2 h-4 w-4 text-primary" />
                                    {shop.hours || "Open Daily"}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link href={`/shop/${shop.id}/join`}>
                                    <Button size="lg" className="w-full sm:w-auto font-semibold">
                                        Join Queue
                                    </Button>
                                </Link>
                                <Link href={`/shop/${shop.id}/book`}>
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                        Book Appointment
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Our Services</CardTitle>
                                <CardDescription>Select a service to see estimated time</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {services.map(service => (
                                    <div key={service.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                        <span className="font-medium">{service.name}</span>
                                        <div className="text-right">
                                            <div className="font-bold text-primary">₹{service.price}</div>
                                            <div className="text-xs text-muted-foreground">{service.duration} min</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Queue Status */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-card/50 backdrop-blur">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl text-primary">Live Queue Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-center">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-background border">
                                        <div className="text-4xl font-bold mb-1">{waitingCount}</div>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                                            <Users className="mr-1 h-3 w-3" /> Waiting
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background border">
                                        <div className="text-4xl font-bold mb-1">
                                            {waitingCount * 15} <span className="text-base font-normal text-muted-foreground">min</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">Est. Wait</div>
                                    </div>
                                </div>

                                {currentServing ? (
                                    <div className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20 animate-pulse">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Now Serving</h3>
                                        <div className="text-3xl font-bold">Ticket #{currentServing.ticketNumber}</div>
                                        <div className="text-muted-foreground">{currentServing.guestName}</div>
                                    </div>
                                ) : (
                                    <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                                        <div className="text-xl font-medium">All chairs available</div>
                                        <div className="text-muted-foreground">Next customer will be served immediately</div>
                                    </div>
                                )}

                                <div className="text-left mt-8">
                                    <h4 className="font-semibold mb-3">Up Next:</h4>
                                    <div className="space-y-2">
                                        {queue.filter(q => q.status === 'WAITING').slice(0, 5).map((entry, i) => (
                                            <div key={entry.id} className="flex justify-between items-center p-3 rounded-md bg-secondary/50">
                                                <div className="flex items-center">
                                                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-3">
                                                        {i + 1}
                                                    </span>
                                                    <span>{entry.guestName}</span>
                                                </div>
                                                <span className="font-mono text-sm text-muted-foreground">#{entry.ticketNumber}</span>
                                            </div>
                                        ))}
                                        {waitingCount === 0 && (
                                            <div className="text-center text-muted-foreground py-4">Queue is empty</div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
