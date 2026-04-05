"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { sendEmail, approvalEmailHtml } from "@/lib/email";

export async function approveRegistration(userId: string) {
  await requireRole("ADMIN");

  // Get user with vehicles
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vehicles: true },
  });

  if (!user) throw new Error("Gebruiker niet gevonden");

  // Approve user
  await prisma.user.update({
    where: { id: userId },
    data: { isApproved: true },
  });

  // Create contracts + invoices for each vehicle
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let totalAmount = 0;
  let firstPlate = "";

  for (const vehicle of user.vehicles) {
    // Get latest price for vehicle type
    const priceConfig = await prisma.priceConfig.findFirst({
      where: { vehicleType: vehicle.type },
      orderBy: { effectiveFrom: "desc" },
    });

    if (!priceConfig) continue;

    const contractTotal = priceConfig.pricePerMeter * vehicle.lengthInMeters;
    totalAmount += contractTotal;
    if (!firstPlate) firstPlate = vehicle.licensePlate;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        customerId: userId,
        vehicleId: vehicle.id,
        startDate,
        endDate,
        autoRenew: true,
        pricePerMeter: priceConfig.pricePerMeter,
        totalPrice: contractTotal,
      },
    });

    // Create invoice (due in 7 days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await prisma.invoice.create({
      data: {
        contractId: contract.id,
        customerId: userId,
        amount: contractTotal,
        dueDate,
      },
    });
  }

  // Send approval email
  try {
    await sendEmail({
      to: user.email,
      subject: "Uw aanmelding is goedgekeurd - Stalling aan de Dijk",
      html: approvalEmailHtml({
        name: user.name,
        loginUrl: `${appUrl}/login`,
        vehiclePlate: user.vehicles.map((v) => v.licensePlate).join(", "),
        contractTotal: totalAmount.toFixed(2),
      }),
    });
  } catch (e) {
    console.error("Fout bij verzenden e-mail:", e);
  }

  revalidatePath("/dashboard/registrations");
  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function rejectRegistration(userId: string) {
  await requireRole("ADMIN");

  // Get user for email
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Delete vehicle(s) first, then user
  await prisma.vehicle.deleteMany({ where: { customerId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  // Send rejection email
  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Uw aanmelding - Stalling aan de Dijk",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #111;">Stalling aan de Dijk</h1>
            <p>Beste ${user.name},</p>
            <p>Helaas kunnen wij uw aanmelding op dit moment niet goedkeuren.</p>
            <p>Neem gerust contact met ons op voor meer informatie:</p>
            <p>Tel: 06 51 60 54 67<br/>Email: stallingaandedijk@gmail.com</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Fout bij verzenden e-mail:", e);
    }
  }

  revalidatePath("/dashboard/registrations");
  revalidatePath("/dashboard");
}
