export const dynamic = "force-dynamic";
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
import { AppointmentActions } from "@/components/dashboard/appointment-actions";

const typeLabels: Record<string, string> = {
  PICKUP: "Ophalen",
  DROPOFF: "Wegbrengen",
};

const statusLabels: Record<string, string> = {
  REQUESTED: "Aangevraagd",
  CONFIRMED: "Bevestigd",
  REJECTED: "Afgewezen",
  COMPLETED: "Afgerond",
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  REQUESTED: "outline",
  CONFIRMED: "default",
  REJECTED: "destructive",
  COMPLETED: "secondary",
};

export default async function AppointmentsPage() {
  await getSession();

  const appointments = await prisma.appointment.findMany({
    include: {
      customer: { select: { name: true } },
      vehicle: { select: { licensePlate: true, type: true } },
    },
    orderBy: { requestedDate: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Afspraken</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Kenteken</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notities</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Geen afspraken
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt: typeof appointments[number]) => (
                <TableRow key={apt.id}>
                  <TableCell>
                    {apt.requestedDate.toLocaleDateString("nl-NL", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{typeLabels[apt.type]}</TableCell>
                  <TableCell>{apt.customer.name}</TableCell>
                  <TableCell className="font-mono">
                    {apt.vehicle.licensePlate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[apt.status]}>
                      {statusLabels[apt.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {apt.notes ?? "-"}
                  </TableCell>
                  <TableCell>
                    <AppointmentActions
                      appointmentId={apt.id}
                      currentStatus={apt.status}
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
