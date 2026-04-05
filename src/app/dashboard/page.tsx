export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, CalendarDays, QrCode, UserPlus, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  const [
    vehicleCount,
    customerCount,
    locationStats,
    openAppointments,
    pendingRegistrations,
    pendingAppointments,
    pendingVehicles,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: "STORED", isApproved: true } }),
    prisma.user.count({ where: { role: "CUSTOMER", isApproved: true } }),
    prisma.storageLocation.groupBy({
      by: ["isOccupied"],
      _count: true,
    }),
    prisma.appointment.count({
      where: { status: { in: ["REQUESTED", "CONFIRMED"] } },
    }),
    prisma.user.count({ where: { role: "CUSTOMER", isApproved: false } }),
    prisma.appointment.count({ where: { status: "REQUESTED" } }),
    prisma.vehicle.count({ where: { isApproved: false } }),
  ]);

  const totalLocations = locationStats.reduce((sum: number, g: typeof locationStats[number]) => sum + g._count, 0);
  const occupiedLocations =
    locationStats.find((g: typeof locationStats[number]) => g.isOccupied)?._count ?? 0;

  const stats = [
    { title: "Gestalde voertuigen", value: vehicleCount, icon: Car },
    { title: "Klanten", value: customerCount, icon: Users },
    { title: "Bezetting", value: `${occupiedLocations}/${totalLocations}`, icon: MapPin },
    { title: "Open afspraken", value: openAppointments, icon: CalendarDays },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Welkom, {session.user.name}
        </h1>
        <Link href="/checkin">
          <Button size="lg">
            <QrCode className="mr-2 h-5 w-5" />
            Voertuig inchecken
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Aanmeldingen",
            count: pendingRegistrations,
            icon: UserPlus,
            href: "/dashboard/registrations",
            label: "aanmelding",
            labelPlural: "aanmeldingen",
          },
          {
            title: "Voertuig aanvragen",
            count: pendingVehicles,
            icon: Car,
            href: "/dashboard/vehicle-requests",
            label: "aanvraag",
            labelPlural: "aanvragen",
          },
          {
            title: "Afspraken",
            count: pendingAppointments,
            icon: Clock,
            href: "/dashboard/appointments",
            label: "afspraak",
            labelPlural: "afspraken",
          },
        ].map((card) => (
          <Card key={card.title} className={card.count > 0 ? "border-orange-300" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <card.icon className={`h-5 w-5 ${card.count > 0 ? "text-orange-600" : "text-muted-foreground"}`} />
                {card.title}
              </CardTitle>
              <Link href={card.href}>
                <Button variant="ghost" size="sm">
                  Bekijken <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {card.count > 0 ? (
                <p className="text-orange-700">
                  <span className="text-3xl font-bold">{card.count}</span>
                  <span className="text-sm ml-2">
                    {card.count === 1 ? card.label : card.labelPlural} wacht{card.count === 1 ? "" : "en"} op goedkeuring
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Geen openstaande {card.labelPlural}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
