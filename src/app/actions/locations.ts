"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createBulkLocations(formData: FormData) {
  await requireRole("ADMIN");

  const section = formData.get("section") as string;
  const prefix = formData.get("prefix") as string;
  const count = parseInt(formData.get("count") as string);
  const isIndoor = formData.get("isIndoor") === "true";

  const locations = Array.from({ length: count }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    const code = `${prefix}${num}`;
    return {
      code,
      label: `Plek ${code}`,
      section: section || undefined,
      isIndoor,
    };
  });

  await prisma.storageLocation.createMany({
    data: locations,
    skipDuplicates: true,
  });

  revalidatePath("/dashboard/locations");
}

export async function addLocationToSection(formData: FormData) {
  await requireRole("ADMIN");

  const code = formData.get("code") as string;
  const section = formData.get("section") as string;
  const isIndoor = formData.get("isIndoor") === "true";

  await prisma.storageLocation.create({
    data: {
      code: code.toUpperCase().trim(),
      label: `Plek ${code.toUpperCase().trim()}`,
      section,
      isIndoor,
    },
  });

  revalidatePath("/dashboard/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  await requireRole("ADMIN");

  const code = formData.get("code") as string;
  const section = formData.get("section") as string;
  const isIndoor = formData.get("isIndoor") === "true";

  await prisma.storageLocation.update({
    where: { id },
    data: {
      code: code.toUpperCase().trim(),
      label: `Plek ${code.toUpperCase().trim()}`,
      section,
      isIndoor,
    },
  });

  revalidatePath("/dashboard/locations");
}

export async function deleteLocation(id: string) {
  await requireRole("ADMIN");

  // Check if location has active placements
  const activePlacements = await prisma.vehiclePlacement.count({
    where: { locationId: id, removedAt: null },
  });

  if (activePlacements > 0) {
    throw new Error("Kan locatie niet verwijderen: er staat een voertuig op deze plek");
  }

  await prisma.storageLocation.delete({ where: { id } });

  revalidatePath("/dashboard/locations");
}

export async function renameSection(oldName: string, newName: string) {
  await requireRole("ADMIN");

  await prisma.storageLocation.updateMany({
    where: { section: oldName },
    data: { section: newName },
  });

  revalidatePath("/dashboard/locations");
}

export async function deleteSection(sectionName: string) {
  await requireRole("ADMIN");

  // Check if any location in this section has active placements
  const activePlacements = await prisma.vehiclePlacement.count({
    where: {
      location: { section: sectionName },
      removedAt: null,
    },
  });

  if (activePlacements > 0) {
    throw new Error("Kan sectie niet verwijderen: er staan nog voertuigen in deze sectie");
  }

  await prisma.storageLocation.deleteMany({
    where: { section: sectionName },
  });

  revalidatePath("/dashboard/locations");
}

export async function updateLocationIndoor(id: string, isIndoor: boolean) {
  await requireRole("ADMIN");

  await prisma.storageLocation.update({
    where: { id },
    data: { isIndoor },
  });

  revalidatePath("/dashboard/locations");
}
