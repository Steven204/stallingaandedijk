export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MaintenanceForm } from "@/components/portal/maintenance-form";
import { AddVehicleForm } from "@/components/portal/add-vehicle-form";
import { EditVehicleForm } from "@/components/portal/edit-vehicle-form";

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
      contracts: {
        where: { status: "ACTIVE" },
        select: { id: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Mijn voertuigen</h2>
        <AddVehicleForm />
      </div>
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium mb-2">Geen voertuigen geregistreerd</p>
            <p className="text-muted-foreground mb-4">
              Er zijn nog geen voertuigen aan uw account gekoppeld.
              Neem contact op met de beheerder om uw voertuig te registreren.
            </p>
            <div className="rounded-lg border bg-muted p-4 text-sm text-left">
              <p className="font-medium mb-1">Contact beheerder:</p>
              <p>Tel: 06 51 60 54 67</p>
              <p>Email: stallingaandedijk@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle: typeof vehicles[number]) => (
            <Card key={vehicle.id} className={!vehicle.isApproved ? "border-orange-300 opacity-75" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-mono">{vehicle.licensePlate}</span>
                  {!vehicle.isApproved ? (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">Wacht op goedkeuring</Badge>
                  ) : (
                    <Badge>{statusLabels[vehicle.status]}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-end gap-1">
                  <EditVehicleForm
                    vehicleId={vehicle.id}
                    licensePlate={vehicle.licensePlate}
                    brand={vehicle.brand}
                    model={vehicle.model}
                    lengthInMeters={vehicle.lengthInMeters}
                    canDelete={vehicle.status !== "STORED" && vehicle.contracts.length === 0}
                  />
                  {vehicle.isApproved && (
                    <MaintenanceForm
                      vehicleId={vehicle.id}
                      licensePlate={vehicle.licensePlate}
                    />
                  )}
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
