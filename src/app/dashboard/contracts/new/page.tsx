export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { ContractForm } from "@/components/forms/contract-form";

export default async function NewContractPage() {
  await requireRole("ADMIN");

  const [customers, prices] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        vehicles: { select: { id: true, licensePlate: true, type: true, lengthInMeters: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.priceConfig.findMany({ orderBy: { effectiveFrom: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nieuw contract</h1>
      <ContractForm customers={customers} prices={prices} />
    </div>
  );
}
