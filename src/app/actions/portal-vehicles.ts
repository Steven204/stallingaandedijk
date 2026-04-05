"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function addVehicle(formData: FormData) {
  const session = await getSession();

  const type = formData.get("type") as "CARAVAN" | "CAMPER" | "BOAT" | "OLDTIMER" | "CAR";
  const licensePlate = (formData.get("licensePlate") as string).toUpperCase().trim();
  const brand = (formData.get("brand") as string) || undefined;
  const model = (formData.get("model") as string) || undefined;
  const lengthInMeters = parseFloat(formData.get("lengthInMeters") as string);

  if (!type || !licensePlate || !lengthInMeters) {
    throw new Error("Vul alle verplichte velden in");
  }

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
    },
  });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/portal");
}
