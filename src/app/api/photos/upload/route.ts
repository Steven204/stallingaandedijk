import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { savePhoto } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const photo = formData.get("photo") as File | null;
  const licensePlate = formData.get("licensePlate") as string;
  const locationCode = formData.get("locationCode") as string;

  if (!photo || !licensePlate || !locationCode) {
    return Response.json(
      { error: "photo, licensePlate, and locationCode are required" },
      { status: 400 }
    );
  }

  // Find vehicle by license plate
  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate: licensePlate.toUpperCase().trim() },
  });

  if (!vehicle) {
    return Response.json(
      { error: "Voertuig met dit kenteken niet gevonden" },
      { status: 404 }
    );
  }

  // Find location by code
  const location = await prisma.storageLocation.findUnique({
    where: { code: locationCode },
  });

  if (!location) {
    return Response.json(
      { error: "Locatie niet gevonden" },
      { status: 404 }
    );
  }

  // Save photo locally
  const buffer = Buffer.from(await photo.arrayBuffer());
  const fileName = `${vehicle.licensePlate}/${Date.now()}-${locationCode}.jpg`;
  const photoUrl = await savePhoto(buffer, fileName);

  // Create photo record
  await prisma.storagePhoto.create({
    data: {
      vehicleId: vehicle.id,
      locationId: location.id,
      photoUrl,
      takenById: session.user.id,
    },
  });

  // Update or create vehicle placement
  // First, remove any existing active placement for this vehicle
  await prisma.vehiclePlacement.updateMany({
    where: { vehicleId: vehicle.id, removedAt: null },
    data: { removedAt: new Date() },
  });

  // Create new placement
  await prisma.vehiclePlacement.create({
    data: {
      vehicleId: vehicle.id,
      locationId: location.id,
      placedById: session.user.id,
    },
  });

  // Update location and vehicle status
  await prisma.storageLocation.update({
    where: { id: location.id },
    data: { isOccupied: true },
  });

  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: { status: "STORED" },
  });

  return Response.json({ success: true, photoUrl });
}
