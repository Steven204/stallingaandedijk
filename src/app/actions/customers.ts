"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const customerSchema = z.object({
  name: z.string().min(2, { error: "Naam moet minimaal 2 tekens zijn" }),
  email: z.string().email({ error: "Ongeldig e-mailadres" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  password: z.string().optional(),
});

export async function createCustomer(formData: FormData) {
  await requireRole("ADMIN");

  const data = customerSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    password: formData.get("password") || undefined,
  });

  const password = data.password || "welkom123";
  const hashedPassword = await hash(password, 12);

  const customer = await prisma.user.create({
    data: {
      email: data.email,
      hashedPassword,
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      role: "CUSTOMER",
    },
  });

  // Create vehicle if provided
  const licensePlate = (formData.get("licensePlate") as string)?.toUpperCase().trim();
  const vehicleType = formData.get("vehicleType") as string;
  const lengthInMeters = parseFloat(formData.get("lengthInMeters") as string);

  if (licensePlate && vehicleType && lengthInMeters > 0) {
    await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        type: vehicleType as "CARAVAN" | "CAMPER" | "BOAT" | "OLDTIMER" | "CAR",
        licensePlate,
        brand: (formData.get("vehicleBrand") as string) || undefined,
        model: (formData.get("vehicleModel") as string) || undefined,
        lengthInMeters,
      },
    });
  }

  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
  await requireRole("ADMIN");

  const data = customerSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    postalCode: formData.get("postalCode") || undefined,
  });

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
    },
  });

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  await requireRole("ADMIN");

  await prisma.user.delete({ where: { id } });

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
