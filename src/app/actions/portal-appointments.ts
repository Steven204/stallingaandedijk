"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { isDateInClosedSeason } from "@/lib/seasons";

export async function createAppointment(formData: FormData) {
  const session = await getSession();

  const vehicleId = formData.get("vehicleId") as string;
  const pickupDate = new Date(formData.get("pickupDate") as string);
  const returnDateStr = formData.get("returnDate") as string;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;
  const notes = (formData.get("notes") as string) || undefined;

  // Check minimum 4 days in advance
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  if (pickupDate < minDate) {
    throw new Error("Afspraak moet minimaal 4 dagen van tevoren worden gemaakt");
  }

  // Validate return date is after pickup date
  if (returnDate && returnDate <= pickupDate) {
    throw new Error("Terugbrengdatum moet na de ophaaldatum liggen");
  }

  // Check winter period for pickup
  const { closed, seasonName } = await isDateInClosedSeason(pickupDate);
  if (closed) {
    throw new Error(
      `Ophalen is niet mogelijk tijdens de ${seasonName}. Kies een datum buiten deze periode.`
    );
  }

  await prisma.appointment.create({
    data: {
      customerId: session.user.id,
      vehicleId,
      type: "PICKUP",
      pickupDate,
      returnDate,
      notes,
    },
  });

  revalidatePath("/portal/my-appointments");
  revalidatePath("/dashboard/appointments");
}
