"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const vehicleSchema = z.object({
  customerId: z.string().min(1, { error: "Klant is verplicht" }),
  type: z.enum(["CARAVAN", "CAMPER", "BOAT", "OLDTIMER", "CAR"]),
  licensePlate: z.string().min(1, { error: "Kenteken is verplicht" }),
  brand: z.string().optional(),
  model: z.string().optional(),
  lengthInMeters: z.number().positive({ error: "Lengte moet positief zijn" }),
  notes: z.string().optional(),
});

export async function createVehicle(formData: FormData) {
  await requireRole("ADMIN");

  const data = vehicleSchema.parse({
    customerId: formData.get("customerId"),
    type: formData.get("type"),
    licensePlate: formData.get("licensePlate"),
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
    notes: formData.get("notes") || undefined,
  });

  await prisma.vehicle.create({ data });

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

export async function updateVehicle(id: string, formData: FormData) {
  await requireRole("ADMIN");

  const data = vehicleSchema.parse({
    customerId: formData.get("customerId"),
    type: formData.get("type"),
    licensePlate: formData.get("licensePlate"),
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
    notes: formData.get("notes") || undefined,
  });

  await prisma.vehicle.update({ where: { id }, data });

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

export async function deleteVehicle(id: string) {
  await requireRole("ADMIN");

  await prisma.vehicle.delete({ where: { id } });

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}
