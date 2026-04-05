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
import { AppointmentActions } from "@/components/dashboard/appointment-actions";
import { AlertCircle, CalendarDays, CheckCircle2, Clock } from "lucide-react";

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

function AppointmentTable({ appointments, emptyMessage }: {
  appointments: Array<{
    id: string;
    requestedDate: Date;
    type: string;
    status: string;
    notes: string | null;
    customer: { name: string };
    vehicle: { licensePlate: string; type: string };
  }>;
  emptyMessage: string;
}) {
  if (appointments.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">{emptyMessage}</p>;
  }

  return (
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
          {appointments.map((apt) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function AppointmentsPage() {
  await getSession();

  const appointments = await prisma.appointment.findMany({
    include: {
      customer: { select: { name: true } },
      vehicle: { select: { licensePlate: true, type: true } },
    },
    orderBy: { requestedDate: "asc" },
  });

  const pending = appointments.filter((a: typeof appointments[number]) => a.status === "REQUESTED");
  const confirmed = appointments.filter((a: typeof appointments[number]) => a.status === "CONFIRMED");
  const completed = appointments.filter((a: typeof appointments[number]) => a.status === "COMPLETED" || a.status === "REJECTED");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Afspraken</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border bg-orange-50 border-orange-200 p-3 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-2xl font-bold text-orange-700">{pending.length}</p>
            <p className="text-xs text-orange-600">Wacht op goedkeuring</p>
          </div>
        </div>
        <div className="rounded-lg border bg-blue-50 border-blue-200 p-3 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-blue-700">{confirmed.length}</p>
            <p className="text-xs text-blue-600">Ingepland</p>
          </div>
        </div>
        <div className="rounded-lg border bg-gray-50 border-gray-200 p-3 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-2xl font-bold text-gray-600">{completed.length}</p>
            <p className="text-xs text-gray-500">Afgerond / afgewezen</p>
          </div>
        </div>
      </div>

      {/* Pending - needs attention */}
      {pending.length > 0 && (
        <Card className="mb-6 border-orange-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Wacht op goedkeuring ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentTable appointments={pending} emptyMessage="" />
          </CardContent>
        </Card>
      )}

      {/* Confirmed - upcoming */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Ingeplande afspraken ({confirmed.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentTable appointments={confirmed} emptyMessage="Geen ingeplande afspraken" />
        </CardContent>
      </Card>

      {/* History */}
      {completed.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5" />
              Afgerond / afgewezen ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentTable appointments={completed} emptyMessage="" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
