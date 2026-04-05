import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewAppointmentForm } from "@/components/portal/new-appointment-form";
import { getClosedSeasons } from "@/lib/seasons";

const typeLabels: Record<string, string> = { PICKUP: "Ophalen", DROPOFF: "Wegbrengen" };
const statusLabels: Record<string, string> = {
  REQUESTED: "Aangevraagd",
  CONFIRMED: "Bevestigd",
  REJECTED: "Afgewezen",
  COMPLETED: "Afgerond",
};

export default async function MyAppointmentsPage() {
  const session = await getSession();

  const [appointments, vehicles, closedSeasons] = await Promise.all([
    prisma.appointment.findMany({
      where: { customerId: session.user.id },
      include: { vehicle: { select: { licensePlate: true } } },
      orderBy: { requestedDate: "desc" },
    }),
    prisma.vehicle.findMany({
      where: { customerId: session.user.id },
      select: { id: true, licensePlate: true },
    }),
    getClosedSeasons(),
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Mijn afspraken</h2>

      <Card>
        <CardHeader>
          <CardTitle>Nieuwe afspraak maken</CardTitle>
        </CardHeader>
        <CardContent>
          <NewAppointmentForm vehicles={vehicles} closedSeasons={closedSeasons} />
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Kenteken</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt: typeof appointments[number]) => (
              <TableRow key={apt.id}>
                <TableCell>
                  {apt.requestedDate.toLocaleDateString("nl-NL", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
                <TableCell>{typeLabels[apt.type]}</TableCell>
                <TableCell className="font-mono">
                  {apt.vehicle.licensePlate}
                </TableCell>
                <TableCell>
                  <Badge>{statusLabels[apt.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
