export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Receipt, User, Car, FileText } from "lucide-react";
import { InvoiceActions } from "@/components/dashboard/invoice-actions";

const statusLabels: Record<string, string> = {
  PENDING: "Openstaand",
  PAID: "Betaald",
  OVERDUE: "Achterstallig",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  OVERDUE: "destructive",
};

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true, address: true, city: true, postalCode: true },
      },
      contract: {
        select: {
          id: true,
          contractNumber: true,
          startDate: true,
          endDate: true,
          pricePerMeter: true,
          totalPrice: true,
          vehicle: { select: { id: true, licensePlate: true, type: true, brand: true, model: true, lengthInMeters: true } },
        },
      },
    },
  });

  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Factuur #{String(invoice.invoiceNumber).padStart(5, "0")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <InvoiceActions invoiceId={invoice.id} currentStatus={invoice.status} />
          <Badge variant={statusVariants[invoice.status]} className="text-sm px-3 py-1">
            {statusLabels[invoice.status]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Factuurgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Factuurnummer</span>
              <span className="font-mono font-medium">{String(invoice.invoiceNumber).padStart(5, "0")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aangemaakt</span>
              <span>{invoice.createdAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vervaldatum</span>
              <span className={invoice.status === "OVERDUE" ? "text-red-600 font-medium" : ""}>
                {invoice.dueDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Betaald op</span>
              <span>{invoice.paidAt ? invoice.paidAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Bedrag</span>
              <span className="text-lg font-bold">&euro; {invoice.amount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Linked contract */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gekoppeld contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract</span>
              <Link href={`/dashboard/contracts/${invoice.contract.id}`} className="font-mono font-medium hover:underline text-primary">
                #{String(invoice.contract.contractNumber).padStart(5, "0")}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Periode</span>
              <span>
                {invoice.contract.startDate.toLocaleDateString("nl-NL")} - {invoice.contract.endDate.toLocaleDateString("nl-NL")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prijs/meter</span>
              <span>&euro; {invoice.contract.pricePerMeter.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract totaal</span>
              <span>&euro; {invoice.contract.totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Klant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link href={`/dashboard/customers/${invoice.customer.id}`} className="text-lg font-medium hover:underline">
              {invoice.customer.name}
            </Link>
            <p className="text-muted-foreground">{invoice.customer.email}</p>
            {invoice.customer.phone && <p className="text-muted-foreground">{invoice.customer.phone}</p>}
            {invoice.customer.address && (
              <p className="text-muted-foreground">
                {invoice.customer.address}, {invoice.customer.postalCode} {invoice.customer.city}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Vehicle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4" />
              Voertuig
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link href={`/dashboard/vehicles/${invoice.contract.vehicle.id}`} className="font-mono text-lg font-bold hover:underline">
              {invoice.contract.vehicle.licensePlate}
            </Link>
            <p>
              {vehicleTypeLabels[invoice.contract.vehicle.type]}
              {invoice.contract.vehicle.brand && ` — ${invoice.contract.vehicle.brand}`}
              {invoice.contract.vehicle.model && ` ${invoice.contract.vehicle.model}`}
            </p>
            <p className="text-muted-foreground">{invoice.contract.vehicle.lengthInMeters} strekkende meter</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
