export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Car,
  CalendarDays,
  Receipt,
  UserCog,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";

export default async function PortalDashboardPage() {
  const session = await getSession();

  const [vehicles, appointments, invoices] = await Promise.all([
    prisma.vehicle.findMany({
      where: { customerId: session.user.id },
      include: {
        placements: {
          where: { removedAt: null },
          include: { location: true },
          take: 1,
        },
      },
    }),
    prisma.appointment.findMany({
      where: { customerId: session.user.id, status: { in: ["REQUESTED", "CONFIRMED"] } },
      include: { vehicle: { select: { licensePlate: true } } },
      orderBy: { pickupDate: "asc" },
      take: 3,
    }),
    prisma.invoice.findMany({
      where: { customerId: session.user.id, status: { in: ["PENDING", "OVERDUE"] } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const openInvoiceTotal = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Welkom, {session.user.name}
      </h2>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link href="/portal/my-vehicles">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Mijn voertuigen</span>
              <Badge variant="secondary">{vehicles.length}</Badge>
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/my-appointments">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <CalendarDays className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Afspraken</span>
              <Badge variant="secondary">{appointments.length} open</Badge>
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/my-invoices">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <Receipt className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Facturen</span>
              {invoices.length > 0 ? (
                <Badge variant="destructive">{invoices.length} open</Badge>
              ) : (
                <Badge variant="secondary">Geen openstaand</Badge>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/my-profile">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <UserCog className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Mijn gegevens</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicles summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Mijn voertuigen</CardTitle>
            <Link href="/portal/my-vehicles">
              <Button variant="ghost" size="sm">
                Bekijk alle <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nog geen voertuigen geregistreerd.</p>
            ) : (
              <div className="space-y-3">
                {vehicles.map((v: typeof vehicles[number]) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <span className="font-mono font-bold">{v.licensePlate}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {v.brand} {v.model}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.placements[0] && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {v.placements[0].location.code}
                        </span>
                      )}
                      <Badge variant={v.status === "STORED" ? "default" : "secondary"}>
                        {v.status === "STORED" ? "Gestald" : v.status === "RETRIEVED" ? "Opgehaald" : "Onderweg"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Komende afspraken</CardTitle>
            <Link href="/portal/my-appointments">
              <Button variant="ghost" size="sm">
                Bekijk alle <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">Geen openstaande afspraken</p>
                <Link href="/portal/my-appointments">
                  <Button variant="outline" size="sm">Afspraak maken</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt: typeof appointments[number]) => (
                  <div key={apt.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-mono text-sm">{apt.vehicle.licensePlate}</span>
                        <p className="text-xs text-muted-foreground">
                          Ophalen: {apt.pickupDate?.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) ?? "-"}
                          {apt.returnDate && (
                            <> — Terug: {apt.returnDate.toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge variant={apt.status === "CONFIRMED" ? "default" : "outline"}>
                      {apt.status === "CONFIRMED" ? "Bevestigd" : "Aangevraagd"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Open invoices */}
        {invoices.length > 0 && (
          <Card className="md:col-span-2 border-orange-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base text-orange-700">Openstaande facturen</CardTitle>
              <Link href="/portal/my-invoices">
                <Button variant="ghost" size="sm">
                  Bekijk alle <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-700 mb-1">
                &euro; {openInvoiceTotal.toFixed(2)}
              </p>
              <p className="text-sm text-orange-600">
                {invoices.length} openstaande factuur{invoices.length !== 1 ? "en" : ""}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
