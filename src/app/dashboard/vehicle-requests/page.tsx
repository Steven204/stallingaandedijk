export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleRequestActions } from "@/components/dashboard/vehicle-request-actions";
import { Car } from "lucide-react";
import Link from "next/link";

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

export default async function VehicleRequestsPage() {
  await requireRole("ADMIN");

  const pendingVehicles = await prisma.vehicle.findMany({
    where: { isApproved: false },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Voertuig aanvragen</h1>

      <div className="rounded-lg border bg-orange-50 border-orange-200 p-3 flex items-center gap-3 mb-6">
        <Car className="h-5 w-5 text-orange-600" />
        <div>
          <p className="text-2xl font-bold text-orange-700">{pendingVehicles.length}</p>
          <p className="text-xs text-orange-600">Wacht{pendingVehicles.length === 1 ? "" : "en"} op goedkeuring</p>
        </div>
      </div>

      {pendingVehicles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Geen openstaande voertuig aanvragen
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingVehicles.map((vehicle: typeof pendingVehicles[number]) => (
            <Card key={vehicle.id} className="border-orange-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">{vehicle.licensePlate}</CardTitle>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Wacht op goedkeuring
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Type:</span> {vehicleTypeLabels[vehicle.type]}</p>
                    <p><span className="text-muted-foreground">Merk:</span> {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "-"}</p>
                    <p><span className="text-muted-foreground">Lengte:</span> {vehicle.lengthInMeters}m</p>
                    <p><span className="text-muted-foreground">Aangevraagd:</span> {vehicle.createdAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Klant:</p>
                    <p>
                      <Link href={`/dashboard/customers/${vehicle.customer.id}`} className="hover:underline">
                        {vehicle.customer.name}
                      </Link>
                    </p>
                    <p className="text-muted-foreground">{vehicle.customer.email}</p>
                    {vehicle.customer.phone && <p className="text-muted-foreground">{vehicle.customer.phone}</p>}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <VehicleRequestActions vehicleId={vehicle.id} licensePlate={vehicle.licensePlate} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
