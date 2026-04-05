"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function markInvoicePaid(invoiceId: string) {
  await requireRole("ADMIN");

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/dashboard/invoices");
}

export async function markInvoiceOverdue(invoiceId: string) {
  await requireRole("ADMIN");

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "OVERDUE" },
  });

  revalidatePath("/dashboard/invoices");
}
