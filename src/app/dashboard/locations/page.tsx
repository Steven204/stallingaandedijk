import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationActions } from "@/components/dashboard/location-actions";

export default async function LocationsPage() {
  const session = await getSession();

  const locations = await prisma.storageLocation.findMany({
    include: {
      placements: {
        where: { removedAt: null },
        include: {
          vehicle: {
            select: { licensePlate: true, type: true, customer: { select: { name: true } } },
          },
        },
        take: 1,
      },
    },
    orderBy: { code: "asc" },
  });

  const sections: string[] = [...new Set(locations.map((l: typeof locations[number]) => l.section ?? "Overig"))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Locaties</h1>
        {session.user.role === "ADMIN" && <LocationActions />}
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          Vrij
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          Bezet
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Binnen</Badge>
          <Badge variant="secondary">Buiten</Badge>
        </div>
      </div>

      {sections.map((section: string) => (
        <Card key={section} className="mb-6">
          <CardHeader>
            <CardTitle>Sectie {section}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {locations
                .filter((l: typeof locations[number]) => (l.section ?? "Overig") === section)
                .map((location: typeof locations[number]) => {
                  const placement = location.placements[0];
                  const isOccupied = !!placement;

                  return (
                    <div
                      key={location.id}
                      className={`relative rounded-lg border-2 p-3 text-center transition-colors ${
                        isOccupied
                          ? "border-red-300 bg-red-50"
                          : "border-green-300 bg-green-50"
                      }`}
                    >
                      <div className="font-mono font-bold text-lg">
                        {location.code}
                      </div>
                      <Badge
                        variant={location.isIndoor ? "outline" : "secondary"}
                        className="mt-1 text-xs"
                      >
                        {location.isIndoor ? "Binnen" : "Buiten"}
                      </Badge>
                      {isOccupied && placement.vehicle && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="font-mono font-medium">
                            {placement.vehicle.licensePlate}
                          </div>
                          <div>{placement.vehicle.customer.name}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
