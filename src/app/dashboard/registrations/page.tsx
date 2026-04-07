export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
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
import { RegistrationActions } from "@/components/dashboard/registration-actions";
import { UserPlus } from "lucide-react";

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

export default async function RegistrationsPage() {
  await requireRole("ADMIN");

  const pendingUsers = await prisma.user.findMany({
    where: { role: "CUSTOMER", isApproved: false },
    include: {
      vehicles: {
        select: { licensePlate: true, type: true, brand: true, model: true, lengthInMeters: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const approvedToday = await prisma.user.count({
    where: {
      role: "CUSTOMER",
      isApproved: true,
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Aanmeldingen</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-lg border bg-orange-50 border-orange-200 p-3 flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-2xl font-semibold text-orange-700">{pendingUsers.length}</p>
            <p className="text-xs text-orange-600">Wacht op goedkeuring</p>
          </div>
        </div>
        <div className="rounded-lg border bg-green-50 border-green-200 p-3 flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-2xl font-semibold text-green-700">{approvedToday}</p>
            <p className="text-xs text-green-600">Vandaag goedgekeurd</p>
          </div>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Geen openstaande aanmeldingen
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user: typeof pendingUsers[number]) => (
            <Card key={user.id} className="border-orange-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Wacht op goedkeuring
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">E-mail:</span> {user.email}</p>
                    <p><span className="text-muted-foreground">Telefoon:</span> {user.phone ?? "-"}</p>
                    <p><span className="text-muted-foreground">Adres:</span> {user.address ?? "-"}</p>
                    <p><span className="text-muted-foreground">Plaats:</span> {[user.postalCode, user.city].filter(Boolean).join(" ") || "-"}</p>
                    <p><span className="text-muted-foreground">Aangemeld:</span> {user.createdAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Voertuig(en):</p>
                    {user.vehicles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Geen voertuig opgegeven</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kenteken</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Merk</TableHead>
                            <TableHead>Lengte</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.vehicles.map((v: typeof user.vehicles[number]) => (
                            <TableRow key={v.licensePlate}>
                              <TableCell className="font-mono">{v.licensePlate}</TableCell>
                              <TableCell>{vehicleTypeLabels[v.type]}</TableCell>
                              <TableCell>{[v.brand, v.model].filter(Boolean).join(" ") || "-"}</TableCell>
                              <TableCell>{v.lengthInMeters}m</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <RegistrationActions userId={user.id} userName={user.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
