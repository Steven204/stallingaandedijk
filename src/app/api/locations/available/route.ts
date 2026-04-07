import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { success } = rateLimit(`locations-available:${ip}`, 60, 60 * 1000);
  if (!success) {
    return Response.json({ error: "Te veel verzoeken. Probeer het later opnieuw." }, { status: 429 });
  }

  const locations = await prisma.storageLocation.findMany({
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      label: true,
      section: true,
      isOccupied: true,
      isIndoor: true,
    },
  });

  return Response.json(locations);
}
