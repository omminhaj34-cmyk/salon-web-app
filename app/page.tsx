import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { verifySession, getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const barbershops = await db.getBarbershops();
  const session = await getSession();

  console.log(`[Home] Fetched ${barbershops.length} barbershops`);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter text-primary">Qcrew</h1>
          <nav className="flex items-center space-x-4">
            {session ? (
              <form action={logout}>
                <Button variant="ghost" className="text-sm font-medium hover:text-primary">
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
            )}
            {(session?.role === 'ADMIN' || session?.role === 'BARBER') && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Find Your Barbershop
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover premium grooming services near you. Select a shop to join the queue or book an appointment.
          </p>
        </div>

        {barbershops.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted">
            <p className="text-muted-foreground">No salons found. Please verify database seeding.</p>
            <p className="text-xs text-muted-foreground mt-2">Debug: {barbershops.length} fetched.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbershops.map((shop) => (
              <Card key={shop.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{shop.name}</CardTitle>
                  <CardDescription>Premium Grooming</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {shop.address}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4 text-primary shrink-0" />
                    {shop.hours || "Open Daily"}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/shop/${shop.id}`} className="w-full">
                    <Button className="w-full group">
                      Visit Shop
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2024 Qcrew. All rights reserved.
      </footer>
    </main>
  );
}
