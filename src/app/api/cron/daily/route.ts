import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return true; // Allow in dev without secret
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    overdueInvoices: 0,
    renewedContracts: 0,
    upcomingReminders: 0,
    errors: [] as string[],
  };

  // 1. Mark overdue invoices
  try {
    const now = new Date();
    const overdue = await prisma.invoice.updateMany({
      where: {
        status: "PENDING",
        dueDate: { lt: now },
      },
      data: { status: "OVERDUE" },
    });
    results.overdueInvoices = overdue.count;
  } catch (e) {
    results.errors.push(`Overdue invoices: ${e instanceof Error ? e.message : "unknown"}`);
  }

  // 2. Auto-renew expiring contracts
  try {
    const today = new Date();
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        autoRenew: true,
        endDate: { lte: today },
      },
      include: {
        customer: { select: { id: true, email: true, name: true } },
        vehicle: { select: { id: true, licensePlate: true, type: true, lengthInMeters: true } },
      },
    });

    for (const contract of expiringContracts) {
      try {
        // Get latest price for this vehicle type
        const priceConfig = await prisma.priceConfig.findFirst({
          where: { vehicleType: contract.vehicle.type },
          orderBy: { effectiveFrom: "desc" },
        });

        if (!priceConfig) continue;

        const newStart = new Date(contract.endDate);
        const newEnd = new Date(contract.endDate);
        newEnd.setFullYear(newEnd.getFullYear() + 1);
        const totalPrice = priceConfig.pricePerMeter * contract.vehicle.lengthInMeters;

        // Mark old contract as expired
        await prisma.contract.update({
          where: { id: contract.id },
          data: { status: "EXPIRED" },
        });

        // Create new contract
        const newContract = await prisma.contract.create({
          data: {
            customerId: contract.customer.id,
            vehicleId: contract.vehicle.id,
            startDate: newStart,
            endDate: newEnd,
            autoRenew: true,
            pricePerMeter: priceConfig.pricePerMeter,
            totalPrice,
          },
        });

        // Create invoice for new contract
        const dueDate = new Date(newStart);
        dueDate.setDate(dueDate.getDate() + 7);

        await prisma.invoice.create({
          data: {
            contractId: newContract.id,
            customerId: contract.customer.id,
            amount: totalPrice,
            dueDate,
          },
        });

        // Send renewal email
        try {
          await sendEmail({
            to: contract.customer.email,
            subject: "Uw stallingscontract is verlengd - Stalling aan de Dijk",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1c1c1c;">Contract verlengd</h1>
                <p>Beste ${contract.customer.name},</p>
                <p>Uw stallingscontract voor voertuig <strong>${contract.vehicle.licensePlate}</strong> is automatisch verlengd.</p>
                <div style="background: #f7f4ed; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Nieuwe periode:</strong> ${newStart.toLocaleDateString("nl-NL")} t/m ${newEnd.toLocaleDateString("nl-NL")}</p>
                  <p><strong>Jaarbedrag:</strong> &euro; ${totalPrice.toFixed(2)}</p>
                </div>
                <p>De factuur is beschikbaar in uw klantportaal.</p>
                <hr style="border: none; border-top: 1px solid #eceae4; margin: 20px 0;" />
                <p style="color: #5f5f5d; font-size: 14px;">Stalling aan de Dijk — Gageldijk 204, 3566 MJ Utrecht</p>
              </div>
            `,
          });
        } catch {
          // Email failure shouldn't block renewal
        }

        results.renewedContracts++;
      } catch (e) {
        results.errors.push(`Contract ${contract.id}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
  } catch (e) {
    results.errors.push(`Contract renewal: ${e instanceof Error ? e.message : "unknown"}`);
  }

  // 3. Send pickup reminders (2 days before)
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const startOfDay = new Date(twoDaysFromNow);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(twoDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        pickupDate: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        customer: { select: { email: true, name: true } },
        vehicle: { select: { licensePlate: true } },
      },
    });

    for (const apt of upcomingAppointments) {
      try {
        await sendEmail({
          to: apt.customer.email,
          subject: "Herinnering: ophaalafspraak overmorgen - Stalling aan de Dijk",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1c1c1c;">Herinnering ophaalafspraak</h1>
              <p>Beste ${apt.customer.name},</p>
              <p>Dit is een herinnering dat u overmorgen uw voertuig <strong>${apt.vehicle.licensePlate}</strong> komt ophalen.</p>
              <p>Datum: <strong>${apt.pickupDate?.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}</strong></p>
              <hr style="border: none; border-top: 1px solid #eceae4; margin: 20px 0;" />
              <p style="color: #5f5f5d; font-size: 14px;">Stalling aan de Dijk — Gageldijk 204, 3566 MJ Utrecht</p>
            </div>
          `,
        });
        results.upcomingReminders++;
      } catch {
        // Email failure shouldn't block other reminders
      }
    }
  } catch (e) {
    results.errors.push(`Reminders: ${e instanceof Error ? e.message : "unknown"}`);
  }

  console.log("[CRON] Daily job completed:", results);

  return Response.json({
    success: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
