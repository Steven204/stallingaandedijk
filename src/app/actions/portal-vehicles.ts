"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const portalVehicleSchema = z.object({
  type: z.enum(["CARAVAN", "CAMPER", "BOAT", "OLDTIMER", "CAR"]),
  licensePlate: z.string().min(1, { error: "Kenteken is verplicht" }).max(15),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  lengthInMeters: z.number().positive({ error: "Lengte moet positief zijn" }).max(30),
});

export async function addVehicle(formData: FormData) {
  const session = await getSession();

  const data = portalVehicleSchema.parse({
    type: formData.get("type"),
    licensePlate: formData.get("licensePlate"),
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
  });

  const type = data.type;
  const licensePlate = data.licensePlate.toUpperCase().trim();
  const brand = data.brand;
  const model = data.model;
  const lengthInMeters = data.lengthInMeters;

  const existing = await prisma.vehicle.findUnique({ where: { licensePlate } });
  if (existing) {
    throw new Error("Dit kenteken is al geregistreerd");
  }

  await prisma.vehicle.create({
    data: {
      customerId: session.user.id,
      type,
      licensePlate,
      brand,
      model,
      lengthInMeters,
      isApproved: false,
    },
  });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/portal");
  revalidatePath("/dashboard/vehicle-requests");
}

const editVehicleSchema = z.object({
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  lengthInMeters: z.number().positive().max(30),
});

export async function updateVehiclePortal(vehicleId: string, formData: FormData) {
  const session = await getSession();

  // Verify ownership
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.customerId !== session.user.id) {
    throw new Error("Voertuig niet gevonden of behoort niet tot uw account");
  }

  const data = editVehicleSchema.parse({
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    lengthInMeters: parseFloat(formData.get("lengthInMeters") as string),
  });

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      brand: data.brand,
      model: data.model,
      lengthInMeters: data.lengthInMeters,
    },
  });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/portal");
}

export async function deleteVehiclePortal(vehicleId: string) {
  const session = await getSession();

  // Verify ownership
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      contracts: { where: { status: "ACTIVE" } },
      placements: { where: { removedAt: null } },
    },
  });

  if (!vehicle || vehicle.customerId !== session.user.id) {
    throw new Error("Voertuig niet gevonden of behoort niet tot uw account");
  }

  if (vehicle.placements.length > 0) {
    throw new Error("Dit voertuig is momenteel gestald en kan niet verwijderd worden");
  }

  if (vehicle.contracts.length > 0) {
    throw new Error("Dit voertuig heeft een actief contract en kan niet verwijderd worden");
  }

  // Delete related records first
  await prisma.maintenanceRequest.deleteMany({ where: { vehicleId } });
  await prisma.appointment.deleteMany({ where: { vehicleId } });
  await prisma.storagePhoto.deleteMany({ where: { vehicleId } });
  await prisma.vehiclePlacement.deleteMany({ where: { vehicleId } });
  await prisma.invoice.deleteMany({ where: { contract: { vehicleId } } });
  await prisma.contract.deleteMany({ where: { vehicleId } });
  await prisma.vehicle.delete({ where: { id: vehicleId } });

  revalidatePath("/portal/my-vehicles");
  revalidatePath("/portal");
}
