"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const locationSchema = z.object({
  code: z.string().min(1, { error: "Code is verplicht" }),
  label: z.string().min(1, { error: "Label is verplicht" }),
  section: z.string().optional(),
  isIndoor: z.boolean(),
});

export async function createLocation(formData: FormData) {
  await requireRole("ADMIN");

  const data = locationSchema.parse({
    code: formData.get("code"),
    label: formData.get("label"),
    section: formData.get("section") || undefined,
    isIndoor: formData.get("isIndoor") === "true",
  });

  await prisma.storageLocation.create({ data });

  revalidatePath("/dashboard/locations");
}

export async function deleteLocation(id: string) {
  await requireRole("ADMIN");

  await prisma.storageLocation.delete({ where: { id } });

  revalidatePath("/dashboard/locations");
}

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
