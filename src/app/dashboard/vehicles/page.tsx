export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

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

const statusVariants: Record<string, "default" | "secondary" | "outline"> = {
  STORED: "default",
  RETRIEVED: "secondary",
  IN_TRANSIT: "outline",
};

export default async function VehiclesPage() {
  const session = await getSession();

  const vehicles = await prisma.vehicle.findMany({
    where: { isApproved: true },
    include: {
      customer: { select: { name: true } },
      placements: {
        where: { removedAt: null },
        include: { location: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Voertuigen</h1>
        {session.user.role === "ADMIN" && (
          <Link href="/dashboard/vehicles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuw voertuig
            </Button>
          </Link>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kenteken</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Merk / Model</TableHead>
              <TableHead>Eigenaar</TableHead>
              <TableHead>Lengte (m)</TableHead>
              <TableHead>Locatie</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nog geen voertuigen geregistreerd
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle: typeof vehicles[number]) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/vehicles/${vehicle.id}`}
                      className="font-medium hover:underline font-mono"
                    >
                      {vehicle.licensePlate}
                    </Link>
                  </TableCell>
                  <TableCell>{vehicleTypeLabels[vehicle.type]}</TableCell>
                  <TableCell>
                    {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "-"}
                  </TableCell>
                  <TableCell>{vehicle.customer.name}</TableCell>
                  <TableCell>{vehicle.lengthInMeters}</TableCell>
                  <TableCell>
                    {vehicle.placements[0]?.location.code ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[vehicle.status]}>
                      {statusLabels[vehicle.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
