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

const statusLabels: Record<string, string> = {
  PENDING: "Openstaand",
  PAID: "Betaald",
  OVERDUE: "Achterstallig",
};

export default async function MyInvoicesPage() {
  const session = await getSession();

  const invoices = await prisma.invoice.findMany({
    where: { customerId: session.user.id },
    include: {
      contract: {
        include: {
          vehicle: { select: { licensePlate: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mijn facturen</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kenteken</TableHead>
              <TableHead>Bedrag</TableHead>
              <TableHead>Vervaldatum</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Geen facturen
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice: typeof invoices[number]) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono">
                    {invoice.contract.vehicle.licensePlate}
                  </TableCell>
                  <TableCell>&euro; {invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {invoice.dueDate.toLocaleDateString("nl-NL")}
                  </TableCell>
                  <TableCell>
                    <Badge>{statusLabels[invoice.status]}</Badge>
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
