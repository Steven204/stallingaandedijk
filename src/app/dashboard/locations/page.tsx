export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { LocationActions } from "@/components/dashboard/location-actions";
import { LocationMap } from "@/components/dashboard/location-map";

export default async function LocationsPage() {
  const session = await getSession();
  const isAdmin = session.user.role === "ADMIN";

  // Two separate queries instead of nested N+1
  const [locations, activePlacements] = await Promise.all([
    prisma.storageLocation.findMany({
      orderBy: { code: "asc" },
    }),
    prisma.vehiclePlacement.findMany({
      where: { removedAt: null },
      select: {
        locationId: true,
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            type: true,
            brand: true,
            model: true,
            customer: { select: { name: true, phone: true } },
          },
        },
      },
    }),
  ]);

  // Build lookup map: locationId -> vehicle
  const placementMap = new Map(
    activePlacements.map((p: typeof activePlacements[number]) => [p.locationId, p.vehicle])
  );

  const sections: string[] = [...new Set(locations.map((l: typeof locations[number]) => l.section ?? "Overig"))];

  const serializedLocations = locations.map((l: typeof locations[number]) => {
    const vehicle = placementMap.get(l.id);
    return {
      id: l.id,
      code: l.code,
      label: l.label,
      section: l.section ?? "Overig",
      isIndoor: l.isIndoor,
      isOccupied: !!vehicle,
      vehicle: vehicle
        ? {
            id: vehicle.id,
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            customerName: vehicle.customer.name,
            customerPhone: vehicle.customer.phone,
          }
        : null,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Locaties</h1>
        {isAdmin && <LocationActions sections={sections} />}
      </div>
      <LocationMap locations={serializedLocations} isAdmin={isAdmin} />
    </div>
  );
}
