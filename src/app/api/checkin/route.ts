import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { licensePlate, locationCode } = await request.json();

  if (!licensePlate || !locationCode) {
    return Response.json(
      { error: "Kenteken en locatie zijn verplicht" },
      { status: 400 }
    );
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate: licensePlate.toUpperCase().trim() },
  });

  if (!vehicle) {
    return Response.json(
      { error: "Voertuig met dit kenteken niet gevonden" },
      { status: 404 }
    );
  }

  const location = await prisma.storageLocation.findUnique({
    where: { code: locationCode },
  });

  if (!location) {
    return Response.json(
      { error: "Locatie niet gevonden" },
      { status: 404 }
    );
  }

  // Close any existing active placement for this vehicle
  await prisma.vehiclePlacement.updateMany({
    where: { vehicleId: vehicle.id, removedAt: null },
    data: { removedAt: new Date() },
  });

  // Free up previously occupied location (if vehicle was elsewhere)
  const previousPlacement = await prisma.vehiclePlacement.findFirst({
    where: { vehicleId: vehicle.id, removedAt: { not: null } },
    orderBy: { removedAt: "desc" },
  });
  if (previousPlacement && previousPlacement.locationId !== location.id) {
    await prisma.storageLocation.update({
      where: { id: previousPlacement.locationId },
      data: { isOccupied: false },
    });
  }

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

  return Response.json({ success: true });
}
