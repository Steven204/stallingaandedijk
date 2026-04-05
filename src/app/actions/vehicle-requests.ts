"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function approveVehicle(vehicleId: string) {
  await requireRole("ADMIN");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { customer: true },
  });

  if (!vehicle) throw new Error("Voertuig niet gevonden");

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { isApproved: true },
  });

  // Auto-create contract + invoice
  const priceConfig = await prisma.priceConfig.findFirst({
    where: { vehicleType: vehicle.type },
    orderBy: { effectiveFrom: "desc" },
  });

  if (priceConfig) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const totalPrice = priceConfig.pricePerMeter * vehicle.lengthInMeters;

    const contract = await prisma.contract.create({
      data: {
        customerId: vehicle.customerId,
        vehicleId: vehicle.id,
        startDate,
        endDate,
        autoRenew: true,
        pricePerMeter: priceConfig.pricePerMeter,
        totalPrice,
      },
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await prisma.invoice.create({
      data: {
        contractId: contract.id,
        customerId: vehicle.customerId,
        amount: totalPrice,
        dueDate,
      },
    });
  }

  revalidatePath("/dashboard/vehicle-requests");
  revalidatePath("/dashboard/vehicles");
  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function rejectVehicle(vehicleId: string) {
  await requireRole("ADMIN");

  await prisma.vehicle.delete({ where: { id: vehicleId } });

  revalidatePath("/dashboard/vehicle-requests");
  revalidatePath("/dashboard");
}
