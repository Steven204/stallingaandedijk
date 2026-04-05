"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function updateProfile(formData: FormData) {
  const session = await getSession();

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const address = (formData.get("address") as string) || undefined;
  const city = (formData.get("city") as string) || undefined;
  const postalCode = (formData.get("postalCode") as string) || undefined;
  const newPassword = formData.get("newPassword") as string;

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
