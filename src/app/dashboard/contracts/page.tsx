export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
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

export default async function ContractsPage() {
  await requireRole("ADMIN");

  const contracts = await prisma.contract.findMany({
    include: {
      customer: { select: { id: true, name: true } },
      vehicle: { select: { licensePlate: true, type: true, lengthInMeters: true } },
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contracten</h1>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuw contract
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Kenteken</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Prijs/m</TableHead>
              <TableHead>Totaal</TableHead>
              <TableHead>Auto-verlenging</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nog geen contracten
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract: typeof contracts[number]) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <Link href={`/dashboard/contracts/${contract.id}`} className="font-mono font-medium hover:underline text-primary">
                      {String(contract.contractNumber).padStart(5, "0")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/customers/${contract.customer.id}`} className="font-medium hover:underline">
                      {contract.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono">
                    {contract.vehicle.licensePlate}
                  </TableCell>
                  <TableCell>
                    {contract.startDate.toLocaleDateString("nl-NL")} -{" "}
                    {contract.endDate.toLocaleDateString("nl-NL")}
                  </TableCell>
                  <TableCell>&euro; {contract.pricePerMeter.toFixed(2)}</TableCell>
                  <TableCell>&euro; {contract.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{contract.autoRenew ? "Ja" : "Nee"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[contract.status]}>
                      {statusLabels[contract.status]}
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
