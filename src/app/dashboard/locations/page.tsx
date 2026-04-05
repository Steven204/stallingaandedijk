export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { LocationActions } from "@/components/dashboard/location-actions";
import { LocationMap } from "@/components/dashboard/location-map";

export default async function LocationsPage() {
  const session = await getSession();
  const isAdmin = session.user.role === "ADMIN";

  const locations = await prisma.storageLocation.findMany({
    include: {
      placements: {
        where: { removedAt: null },
        include: {
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
        take: 1,
      },
    },
    orderBy: { code: "asc" },
  });

  const sections: string[] = [...new Set(locations.map((l: typeof locations[number]) => l.section ?? "Overig"))];

  // Serialize for client component
  const serializedLocations = locations.map((l: typeof locations[number]) => ({
    id: l.id,
    code: l.code,
    label: l.label,
    section: l.section ?? "Overig",
    isIndoor: l.isIndoor,
    isOccupied: l.placements.length > 0,
    vehicle: l.placements[0]?.vehicle
      ? {
          id: l.placements[0].vehicle.id,
          licensePlate: l.placements[0].vehicle.licensePlate,
          type: l.placements[0].vehicle.type,
          brand: l.placements[0].vehicle.brand,
          model: l.placements[0].vehicle.model,
          customerName: l.placements[0].vehicle.customer.name,
          customerPhone: l.placements[0].vehicle.customer.phone,
        }
      : null,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Locaties</h1>
        {isAdmin && <LocationActions sections={sections} />}
      </div>
      <LocationMap locations={serializedLocations} isAdmin={isAdmin} />
    </div>
  );
}
