export const dynamic = "force-dynamic";
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
import { PortalAppointmentActions } from "@/components/portal/appointment-actions";
import { getClosedSeasons } from "@/lib/seasons";

const statusLabels: Record<string, string> = {
  REQUESTED: "Aangevraagd",
  CONFIRMED: "Bevestigd",
  REJECTED: "Afgewezen",
  COMPLETED: "Afgerond",
};

function formatDate(date: Date | null) {
  if (!date) return "-";
  return date.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function MyAppointmentsPage() {
  const session = await getSession();

  const [appointments, vehicles, closedSeasons] = await Promise.all([
    prisma.appointment.findMany({
      where: { customerId: session.user.id },
      include: { vehicle: { select: { licensePlate: true } } },
      orderBy: { pickupDate: "desc" },
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
          {vehicles.length === 0 ? (
            <div className="rounded-lg border border-orange-300 bg-orange-50 p-4 text-sm">
              <p className="font-medium text-orange-800">Geen voertuigen geregistreerd</p>
              <p className="text-orange-700 mt-1">
                U heeft nog geen voertuig gekoppeld aan uw account.
                Neem contact op met de beheerder of registreer een voertuig via{" "}
                <a href="/portal/my-vehicles" className="underline font-medium">Mijn voertuigen</a>.
              </p>
            </div>
          ) : (
            <NewAppointmentForm vehicles={vehicles} closedSeasons={closedSeasons} />
          )}
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kenteken</TableHead>
              <TableHead>Ophalen</TableHead>
              <TableHead>Terugbrengen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nog geen afspraken
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt: typeof appointments[number]) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono">
                    {apt.vehicle.licensePlate}
                  </TableCell>
                  <TableCell>{formatDate(apt.pickupDate)}</TableCell>
                  <TableCell>{formatDate(apt.returnDate)}</TableCell>
                  <TableCell>
                    <Badge>{statusLabels[apt.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <PortalAppointmentActions
                      appointmentId={apt.id}
                      status={apt.status}
                      pickupDate={apt.pickupDate?.toISOString().split("T")[0] ?? null}
                      returnDate={apt.returnDate?.toISOString().split("T")[0] ?? null}
                      notes={apt.notes}
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
