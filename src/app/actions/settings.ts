"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const priceSchema = z.object({
  vehicleType: z.enum(["CARAVAN", "CAMPER", "BOAT", "OLDTIMER", "CAR"]),
  pricePerMeter: z.number().positive({ error: "Prijs moet positief zijn" }),
});

const seasonSchema = z.object({
  name: z.string().min(1, { error: "Naam is verplicht" }).max(100),
  startMonth: z.number().int().min(1).max(12),
  startDay: z.number().int().min(1).max(31),
  endMonth: z.number().int().min(1).max(12),
  endDay: z.number().int().min(1).max(31),
  isClosedForPickup: z.boolean(),
});

export async function updatePrice(formData: FormData) {
  await requireRole("ADMIN");

  const data = priceSchema.parse({
    vehicleType: formData.get("vehicleType"),
    pricePerMeter: parseFloat(formData.get("pricePerMeter") as string),
  });

  await prisma.priceConfig.create({
    data: {
      vehicleType: data.vehicleType,
      pricePerMeter: data.pricePerMeter,
    },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateSeason(formData: FormData) {
  await requireRole("ADMIN");

  const data = seasonSchema.parse({
    name: formData.get("name"),
    startMonth: parseInt(formData.get("startMonth") as string),
    startDay: parseInt(formData.get("startDay") as string),
    endMonth: parseInt(formData.get("endMonth") as string),
    endDay: parseInt(formData.get("endDay") as string),
    isClosedForPickup: formData.get("isClosedForPickup") === "true",
  });

  await prisma.seasonConfig.create({
    data: {
      name: data.name,
      startMonth: data.startMonth,
      startDay: data.startDay,
      endMonth: data.endMonth,
      endDay: data.endDay,
      isClosedForPickup: data.isClosedForPickup,
    },
  });

  revalidatePath("/dashboard/settings");
}
