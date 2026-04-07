"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const bulkLocationSchema = z.object({
  section: z.string().max(50).optional(),
  prefix: z.string().min(1, { error: "Prefix is verplicht" }).max(10),
  count: z.number().int().positive().max(100),
  isIndoor: z.boolean(),
});

const locationSchema = z.object({
  code: z.string().min(1, { error: "Code is verplicht" }).max(10),
  section: z.string().max(50).optional(),
  isIndoor: z.boolean(),
});

const renameSectionSchema = z.object({
  oldName: z.string().min(1),
  newName: z.string().min(1).max(50),
});

export async function createBulkLocations(formData: FormData) {
  await requireRole("ADMIN");

  const data = bulkLocationSchema.parse({
    section: formData.get("section") || undefined,
    prefix: formData.get("prefix"),
    count: parseInt(formData.get("count") as string),
    isIndoor: formData.get("isIndoor") === "true",
  });

  const section = data.section;
  const prefix = data.prefix;
  const count = data.count;
  const isIndoor = data.isIndoor;

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

  const locData = locationSchema.parse({
    code: formData.get("code"),
    section: formData.get("section") || undefined,
    isIndoor: formData.get("isIndoor") === "true",
  });

  const code = locData.code;
  const section = locData.section;
  const isIndoor = locData.isIndoor;

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

  const locData = locationSchema.parse({
    code: formData.get("code"),
    section: formData.get("section") || undefined,
    isIndoor: formData.get("isIndoor") === "true",
  });

  const code = locData.code;
  const section = locData.section;
  const isIndoor = locData.isIndoor;

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

  const data = renameSectionSchema.parse({ oldName, newName });

  await prisma.storageLocation.updateMany({
    where: { section: data.oldName },
    data: { section: data.newName },
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
