"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const portalVehicleSchema = z.object({
  type: z.enum(["CARAVAN", "CAMPER", "BOAT", "OLDTIMER", "CAR"]),
  licensePlate: z.string().min(1, { error: "Kenteken is verplicht" }).max(15),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  lengthInMeters: z.number().positive({ error: "Lengte moet positief zijn" }).max(30),
});

export async function addVehicle(formData: FormData) {
  const session = await getSession();

  const data = portalVehicleSchema.parse({
    type: formData.get("type"),
    licensePlate: formData.get("licensePlate"),
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
  });

  const type = data.type;
  const licensePlate = data.licensePlate.toUpperCase().trim();
  const brand = data.brand;
  const model = data.model;
  const lengthInMeters = data.lengthInMeters;

  const existing = await prisma.vehicle.findUnique({ where: { licensePlate } });
  if (existing) {
    throw new Error("Dit kenteken is al geregistreerd");
  }

  await prisma.vehicle.create({
    data: {
      customerId: session.user.id,
      type,
      licensePlate,
      brand,
      model,
      lengthInMeters,
      isApproved: false,
    },
  });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/portal");
  revalidatePath("/dashboard/vehicle-requests");
}
