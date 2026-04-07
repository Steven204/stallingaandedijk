export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/forms/customer-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

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

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    include: {
      vehicles: true,
      contracts: { include: { vehicle: true } },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Klant: {customer.name}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gegevens bewerken</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm customer={customer} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voertuigen ({customer.vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kenteken</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Merk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.vehicles.map((vehicle: typeof customer.vehicles[number]) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/vehicles/${vehicle.id}`}
                        className="font-medium hover:underline"
                      >
                        {vehicle.licensePlate}
                      </Link>
                    </TableCell>
                    <TableCell>{vehicleTypeLabels[vehicle.type]}</TableCell>
                    <TableCell>{vehicle.brand ?? "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.status === "STORED" ? "default" : "secondary"
                        }
                      >
                        {statusLabels[vehicle.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
