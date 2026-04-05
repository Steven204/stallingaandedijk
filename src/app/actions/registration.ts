"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import * as z from "zod";

const registrationSchema = z.object({
  name: z.string().min(2, { error: "Naam moet minimaal 2 tekens zijn" }),
  email: z.string().email({ error: "Ongeldig e-mailadres" }),
  phone: z.string().min(6, { error: "Telefoonnummer is verplicht" }),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  password: z.string().min(6, { error: "Wachtwoord moet minimaal 6 tekens zijn" }),
  vehicleType: z.enum(["CARAVAN", "CAMPER", "BOAT", "OLDTIMER", "CAR"]),
  licensePlate: z.string().min(1, { error: "Kenteken is verplicht" }),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  lengthInMeters: z.number().positive({ error: "Lengte moet positief zijn" }),
});

export async function registerCustomer(formData: FormData) {
  const data = registrationSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    password: formData.get("password"),
    vehicleType: formData.get("vehicleType"),
    licensePlate: formData.get("licensePlate"),
    vehicleBrand: formData.get("vehicleBrand") || undefined,
    vehicleModel: formData.get("vehicleModel") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
  });

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new Error("Er bestaat al een account met dit e-mailadres");
  }

  // Check if license plate already exists
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { licensePlate: data.licensePlate.toUpperCase().trim() },
  });
  if (existingVehicle) {
    throw new Error("Dit kenteken is al geregistreerd");
  }

  const hashedPassword = await hash(data.password, 12);

  // Create customer
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
      isApproved: false,
    },
  });

  // Create vehicle
  await prisma.vehicle.create({
    data: {
      customerId: customer.id,
      type: data.vehicleType,
      licensePlate: data.licensePlate.toUpperCase().trim(),
      brand: data.vehicleBrand,
      model: data.vehicleModel,
      lengthInMeters: data.lengthInMeters,
    },
  });

  redirect("/aanmelden/succes");
}
