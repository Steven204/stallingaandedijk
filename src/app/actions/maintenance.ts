"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const maintenanceRequestSchema = z.object({
  vehicleId: z.string().min(1, { error: "Voertuig is verplicht" }),
  type: z.enum(["APK", "BATTERY", "TIRES", "GENERAL", "OTHER"]),
  description: z.string().max(500).optional(),
});

const maintenanceStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().max(500).optional(),
});

export async function createMaintenanceRequest(formData: FormData) {
  const session = await getSession();

  const { vehicleId, type, description } = maintenanceRequestSchema.parse({
    vehicleId: formData.get("vehicleId"),
    type: formData.get("type"),
    description: formData.get("description") || undefined,
  });

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

  const data = maintenanceStatusSchema.parse({
    id,
    status,
    notes: notes || undefined,
  });

  await prisma.maintenanceRequest.update({
    where: { id: data.id },
    data: { status: data.status, notes: data.notes },
  });

  revalidatePath("/dashboard/maintenance");
}
