"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createMaintenanceRequest(formData: FormData) {
  const session = await getSession();

  const vehicleId = formData.get("vehicleId") as string;
  const type = formData.get("type") as "APK" | "BATTERY" | "TIRES" | "GENERAL" | "OTHER";
  const description = (formData.get("description") as string) || undefined;

  // Verify vehicle belongs to this customer
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.customerId !== session.user.id) {
    throw new Error("Voertuig niet gevonden of behoort niet tot uw account");
  }

  await prisma.maintenanceRequest.create({
    data: {
      vehicleId,
      customerId: session.user.id,
      type,
      description,
    },
  });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/dashboard/maintenance");
}

export async function updateMaintenanceStatus(
  id: string,
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  notes?: string
) {
  const session = await getSession();
  if (!["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.maintenanceRequest.update({
    where: { id },
    data: { status, notes: notes || undefined },
  });

  revalidatePath("/dashboard/maintenance");
}
