export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { VehicleForm } from "@/components/forms/vehicle-form";

export default async function NewVehiclePage() {
  await requireRole("ADMIN");

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Nieuw voertuig</h1>
      <VehicleForm customers={customers} />
    </div>
  );
}
