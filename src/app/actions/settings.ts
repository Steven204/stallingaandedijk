"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function updatePrice(formData: FormData) {
  await requireRole("ADMIN");

  const vehicleType = formData.get("vehicleType") as string;
  const pricePerMeter = parseFloat(formData.get("pricePerMeter") as string);

  await prisma.priceConfig.create({
    data: {
      vehicleType: vehicleType as "CARAVAN" | "CAMPER" | "BOAT" | "OLDTIMER" | "CAR",
      pricePerMeter,
    },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateSeason(formData: FormData) {
  await requireRole("ADMIN");

  const name = formData.get("name") as string;
  const startMonth = parseInt(formData.get("startMonth") as string);
  const startDay = parseInt(formData.get("startDay") as string);
  const endMonth = parseInt(formData.get("endMonth") as string);
  const endDay = parseInt(formData.get("endDay") as string);
  const isClosedForPickup = formData.get("isClosedForPickup") === "true";

  await prisma.seasonConfig.create({
    data: { name, startMonth, startDay, endMonth, endDay, isClosedForPickup },
  });

  revalidatePath("/dashboard/settings");
}
