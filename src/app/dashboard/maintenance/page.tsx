import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MaintenanceActions } from "@/components/dashboard/maintenance-actions";

const typeLabels: Record<string, string> = {
  APK: "APK",
  BATTERY: "Accu",
  TIRES: "Banden",
  GENERAL: "Algemeen onderhoud",
  OTHER: "Overig",
};

const statusLabels: Record<string, string> = {
  REQUESTED: "Aangevraagd",
  IN_PROGRESS: "In behandeling",
  COMPLETED: "Afgerond",
  CANCELLED: "Geannuleerd",
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  REQUESTED: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default async function MaintenancePage() {
  await getSession();

  const requests = await prisma.maintenanceRequest.findMany({
    include: {
      customer: { select: { name: true } },
      vehicle: { select: { licensePlate: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Onderhoudsverzoeken</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Kenteken</TableHead>
              <TableHead>Omschrijving</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Geen onderhoudsverzoeken
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req: typeof requests[number]) => (
                <TableRow key={req.id}>
                  <TableCell>
                    {req.createdAt.toLocaleDateString("nl-NL")}
                  </TableCell>
                  <TableCell>{typeLabels[req.type]}</TableCell>
                  <TableCell>{req.customer.name}</TableCell>
                  <TableCell className="font-mono">
                    {req.vehicle.licensePlate}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {req.description ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[req.status]}>
                      {statusLabels[req.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MaintenanceActions
                      requestId={req.id}
                      currentStatus={req.status}
                    />
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
