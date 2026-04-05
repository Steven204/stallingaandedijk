import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, CalendarDays, QrCode } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  const [vehicleCount, customerCount, locationStats, appointmentCount] =
    await Promise.all([
      prisma.vehicle.count({ where: { status: "STORED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.storageLocation.groupBy({
        by: ["isOccupied"],
        _count: true,
      }),
      prisma.appointment.count({
        where: {
          status: { in: ["REQUESTED", "CONFIRMED"] },
        },
      }),
    ]);

  const totalLocations = locationStats.reduce((sum: number, g: typeof locationStats[number]) => sum + g._count, 0);
  const occupiedLocations =
    locationStats.find((g: typeof locationStats[number]) => g.isOccupied)?._count ?? 0;

  const stats = [
    {
      title: "Gestalde voertuigen",
      value: vehicleCount,
      icon: Car,
    },
    {
      title: "Klanten",
      value: customerCount,
      icon: Users,
    },
    {
      title: "Bezetting",
      value: `${occupiedLocations}/${totalLocations}`,
      icon: MapPin,
    },
    {
      title: "Open afspraken",
      value: appointmentCount,
      icon: CalendarDays,
    },
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
