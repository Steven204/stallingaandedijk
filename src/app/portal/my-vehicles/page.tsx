import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MaintenanceForm } from "@/components/portal/maintenance-form";

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

const statusLabels: Record<string, string> = {
  STORED: "Gestald",
  RETRIEVED: "Opgehaald",
  IN_TRANSIT: "Onderweg",
};

export default async function MyVehiclesPage() {
  const session = await getSession();

  const vehicles = await prisma.vehicle.findMany({
    where: { customerId: session.user.id },
    include: {
      placements: {
        where: { removedAt: null },
        include: { location: true },
        take: 1,
      },
      photos: {
        orderBy: { takenAt: "desc" },
        take: 1,
        include: { location: true },
      },
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mijn voertuigen</h2>
      {vehicles.length === 0 ? (
        <p className="text-muted-foreground">Nog geen voertuigen geregistreerd.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle: typeof vehicles[number]) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-mono">{vehicle.licensePlate}</span>
                  <Badge>{statusLabels[vehicle.status]}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-end">
                  <MaintenanceForm
                    vehicleId={vehicle.id}
                    licensePlate={vehicle.licensePlate}
                  />
                </div>
                <p className="text-sm">
                  <strong>Type:</strong> {vehicleTypeLabels[vehicle.type]}
                </p>
                {vehicle.brand && (
                  <p className="text-sm">
                    <strong>Merk:</strong> {vehicle.brand} {vehicle.model}
                  </p>
                )}
                {vehicle.placements[0] && (
                  <p className="text-sm">
                    <strong>Locatie:</strong>{" "}
                    <span className="font-mono">
                      {vehicle.placements[0].location.code}
                    </span>
                  </p>
                )}
                {vehicle.photos[0] && (
                  <div className="relative aspect-video rounded-md overflow-hidden border mt-2">
                    <Image
                      src={vehicle.photos[0].photoUrl}
                      alt="Laatste foto"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                      {vehicle.photos[0].location.code} -{" "}
                      {vehicle.photos[0].takenAt.toLocaleDateString("nl-NL")}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
