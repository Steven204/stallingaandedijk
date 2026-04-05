export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { FileText, User, Car, Receipt } from "lucide-react";

const statusLabels: Record<string, string> = {
  ACTIVE: "Actief",
  EXPIRED: "Verlopen",
  CANCELLED: "Opgezegd",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  EXPIRED: "secondary",
  CANCELLED: "destructive",
};

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

const invoiceStatusLabels: Record<string, string> = {
  PENDING: "Openstaand",
  PAID: "Betaald",
  OVERDUE: "Achterstallig",
};

const invoiceStatusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  OVERDUE: "destructive",
};

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true, address: true, city: true, postalCode: true },
      },
      vehicle: {
        select: { id: true, licensePlate: true, type: true, brand: true, model: true, lengthInMeters: true },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contract) notFound();

  const daysRemaining = Math.ceil(
    (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Contract
          </h1>
          <p className="text-sm text-muted-foreground font-mono">{contract.id}</p>
        </div>
        <Badge variant={statusVariants[contract.status]} className="text-sm px-3 py-1">
          {statusLabels[contract.status]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contract details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contractgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Startdatum</span>
              <span className="font-medium">{contract.startDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Einddatum</span>
              <span className="font-medium">{contract.endDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resterend</span>
              <span className={`font-medium ${daysRemaining < 30 ? "text-orange-600" : ""}`}>
                {daysRemaining > 0 ? `${daysRemaining} dagen` : "Verlopen"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prijs per meter</span>
              <span className="font-medium">&euro; {contract.pricePerMeter.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lengte voertuig</span>
              <span className="font-medium">{contract.vehicle.lengthInMeters}m</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Totaal per jaar</span>
              <span className="text-lg font-bold">&euro; {contract.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Automatische verlenging</span>
              <span className="font-medium">{contract.autoRenew ? "Ja" : "Nee"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer + Vehicle */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Klant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link href={`/dashboard/customers/${contract.customer.id}`} className="text-lg font-medium hover:underline">
                {contract.customer.name}
              </Link>
              <p className="text-muted-foreground">{contract.customer.email}</p>
              {contract.customer.phone && <p className="text-muted-foreground">{contract.customer.phone}</p>}
              {contract.customer.address && (
                <p className="text-muted-foreground">
                  {contract.customer.address}, {contract.customer.postalCode} {contract.customer.city}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car className="h-4 w-4" />
                Voertuig
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link href={`/dashboard/vehicles/${contract.vehicle.id}`} className="font-mono text-lg font-bold hover:underline">
                {contract.vehicle.licensePlate}
              </Link>
              <p>
                {vehicleTypeLabels[contract.vehicle.type]}
                {contract.vehicle.brand && ` — ${contract.vehicle.brand}`}
                {contract.vehicle.model && ` ${contract.vehicle.model}`}
              </p>
              <p className="text-muted-foreground">{contract.vehicle.lengthInMeters} strekkende meter</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Facturen ({contract.invoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen facturen</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bedrag</TableHead>
                  <TableHead>Vervaldatum</TableHead>
                  <TableHead>Betaald op</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.invoices.map((inv: typeof contract.invoices[number]) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">&euro; {inv.amount.toFixed(2)}</TableCell>
                    <TableCell>{inv.dueDate.toLocaleDateString("nl-NL")}</TableCell>
                    <TableCell>{inv.paidAt ? inv.paidAt.toLocaleDateString("nl-NL") : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={invoiceStatusVariants[inv.status]}>
                        {invoiceStatusLabels[inv.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
