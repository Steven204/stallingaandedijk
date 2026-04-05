"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "CONFIRMED" | "REJECTED" | "COMPLETED"
) {
  const session = await getSession();
  if (!["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status,
      confirmedDate: status === "CONFIRMED" ? new Date() : undefined,
    },
  });

  revalidatePath("/dashboard/appointments");
}
