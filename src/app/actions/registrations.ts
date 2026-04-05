"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function approveRegistration(userId: string) {
  await requireRole("ADMIN");

  await prisma.user.update({
    where: { id: userId },
    data: { isApproved: true },
  });

  revalidatePath("/dashboard/registrations");
  revalidatePath("/dashboard");
}

export async function rejectRegistration(userId: string) {
  await requireRole("ADMIN");

  // Delete vehicle(s) first, then user
  await prisma.vehicle.deleteMany({ where: { customerId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/dashboard/registrations");
  revalidatePath("/dashboard");
}
