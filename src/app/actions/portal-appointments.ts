"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { isDateInClosedSeason } from "@/lib/seasons";
import * as z from "zod";

const appointmentSchema = z.object({
  vehicleId: z.string().min(1, { error: "Voertuig is verplicht" }),
  pickupDate: z.string().min(1, { error: "Ophaaldatum is verplicht" }).refine(
    (val) => !isNaN(Date.parse(val)),
    { error: "Ongeldige ophaaldatum" }
  ),
  returnDate: z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { error: "Ongeldige terugbrengdatum" }
  ).optional(),
  notes: z.string().max(500).optional(),
});

export async function createAppointment(formData: FormData) {
  const session = await getSession();

  const data = appointmentSchema.parse({
    vehicleId: formData.get("vehicleId"),
    pickupDate: formData.get("pickupDate"),
    returnDate: formData.get("returnDate") || undefined,
    notes: formData.get("notes") || undefined,
  });

  const vehicleId = data.vehicleId;

  // Verify vehicle belongs to this customer
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.customerId !== session.user.id) {
    throw new Error("Voertuig niet gevonden of behoort niet tot uw account");
  }

  const pickupDate = new Date(data.pickupDate);
  const returnDate = data.returnDate ? new Date(data.returnDate) : null;
  const notes = data.notes;

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
