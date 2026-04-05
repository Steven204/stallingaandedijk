"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createContract(formData: FormData) {
  await requireRole("ADMIN");

  const customerId = formData.get("customerId") as string;
  const vehicleId = formData.get("vehicleId") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const pricePerMeter = parseFloat(formData.get("pricePerMeter") as string);
  const lengthInMeters = parseFloat(formData.get("lengthInMeters") as string);
  const autoRenew = formData.get("autoRenew") === "true";

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const totalPrice = pricePerMeter * lengthInMeters;

  const contract = await prisma.contract.create({
    data: {
      customerId,
      vehicleId,
      startDate,
      endDate,
      autoRenew,
      pricePerMeter,
      totalPrice,
    },
  });

  // Auto-generate invoice
  await prisma.invoice.create({
    data: {
      contractId: contract.id,
      customerId,
      amount: totalPrice,
      dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
    },
  });

  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/contracts");
}
