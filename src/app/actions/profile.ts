"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(1, { error: "Naam is verplicht" }).max(100),
  phone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  newPassword: z.string().min(6).max(128).optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();

  const data = profileSchema.parse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    newPassword: formData.get("newPassword") || undefined,
  });

  const { name, phone, address, city, postalCode, newPassword } = data;

  const updateData: Record<string, unknown> = {
    name,
    phone,
    address,
    city,
    postalCode,
  };

  if (newPassword && newPassword.length >= 6) {
    updateData.hashedPassword = await hash(newPassword, 12);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/portal/my-profile");
}
