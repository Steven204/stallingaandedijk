import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return Response.json([]);
  }

  // Search locations with active placements + vehicle + customer
  const locations = await prisma.storageLocation.findMany({
    where: {
      OR: [
        { code: { contains: q, mode: "insensitive" } },
        {
          placements: {
            some: {
              removedAt: null,
              vehicle: {
                OR: [
                  { licensePlate: { contains: q, mode: "insensitive" } },
                  { brand: { contains: q, mode: "insensitive" } },
                  { model: { contains: q, mode: "insensitive" } },
                  { customer: { name: { contains: q, mode: "insensitive" } } },
                ],
              },
            },
          },
        },
      ],
    },
    include: {
      placements: {
        where: { removedAt: null },
        include: {
          vehicle: {
            select: {
              id: true,
              licensePlate: true,
              type: true,
              brand: true,
              model: true,
              customer: { select: { name: true, phone: true } },
            },
          },
        },
        take: 1,
      },
    },
    orderBy: { code: "asc" },
    take: 20,
  });

  const results = locations.map((l) => ({
    id: l.id,
    code: l.code,
    section: l.section,
    isIndoor: l.isIndoor,
    isOccupied: l.placements.length > 0,
    vehicle: l.placements[0]?.vehicle
      ? {
          id: l.placements[0].vehicle.id,
          licensePlate: l.placements[0].vehicle.licensePlate,
          type: l.placements[0].vehicle.type,
          brand: l.placements[0].vehicle.brand,
          model: l.placements[0].vehicle.model,
          customerName: l.placements[0].vehicle.customer.name,
          customerPhone: l.placements[0].vehicle.customer.phone,
        }
      : null,
  }));

  return Response.json(results);
}
