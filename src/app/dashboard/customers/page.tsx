export const dynamic = "force-dynamic";
import { Suspense } from "react";
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
import { getPaginationParams, PAGE_SIZE } from "@/lib/pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("ADMIN");

  const { skip, take } = getPaginationParams(await searchParams);

  const [customers, count] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER", isApproved: true },
      include: {
        _count: { select: { vehicles: true, contracts: true } },
      },
      orderBy: { name: "asc" },
      skip,
      take,
    }),
    prisma.user.count({ where: { role: "CUSTOMER", isApproved: true } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Klanten</h1>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe klant
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefoon</TableHead>
              <TableHead>Plaats</TableHead>
              <TableHead>Voertuigen</TableHead>
              <TableHead>Contracten</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nog geen klanten geregistreerd
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer: typeof customers[number]) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone ?? "-"}</TableCell>
                  <TableCell>{customer.city ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {customer._count.vehicles}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {customer._count.contracts}
                    </Badge>
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
