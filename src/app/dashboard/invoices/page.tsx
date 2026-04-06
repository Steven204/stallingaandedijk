export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceActions } from "@/components/dashboard/invoice-actions";
import { getPaginationParams, PAGE_SIZE } from "@/lib/pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

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

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("ADMIN");

  const { skip, take } = getPaginationParams(await searchParams);

  const [invoices, count] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        customer: { select: { id: true, name: true } },
        contract: {
          select: {
            id: true,
            contractNumber: true,
            vehicle: { select: { licensePlate: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.invoice.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facturen</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factuur</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Kenteken</TableHead>
              <TableHead>Bedrag</TableHead>
              <TableHead>Vervaldatum</TableHead>
              <TableHead>Betaald op</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Geen facturen
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice: typeof invoices[number]) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="font-mono font-medium hover:underline text-primary">
                      {String(invoice.invoiceNumber).padStart(5, "0")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/contracts/${invoice.contract.id}`} className="font-mono text-sm hover:underline">
                      #{String(invoice.contract.contractNumber).padStart(5, "0")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/customers/${invoice.customer.id}`} className="font-medium hover:underline">
                      {invoice.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono">
                    {invoice.contract.vehicle.licensePlate}
                  </TableCell>
                  <TableCell>&euro; {invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.dueDate.toLocaleDateString("nl-NL")}</TableCell>
                  <TableCell>
                    {invoice.paidAt ? invoice.paidAt.toLocaleDateString("nl-NL") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[invoice.status]}>
                      {statusLabels[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <InvoiceActions
                      invoiceId={invoice.id}
                      currentStatus={invoice.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Suspense>
        <PaginationControls totalCount={count} pageSize={PAGE_SIZE} />
      </Suspense>
    </div>
  );
}
