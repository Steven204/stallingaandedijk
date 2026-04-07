import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { success } = rateLimit(`qr-generate:${ip}`, 60, 60 * 1000);
  if (!success) {
    return Response.json({ error: "Te veel verzoeken. Probeer het later opnieuw." }, { status: 429 });
  }

  const locationId = request.nextUrl.searchParams.get("locationId");

  if (!locationId) {
    return Response.json({ error: "locationId is required" }, { status: 400 });
  }

  const location = await prisma.storageLocation.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    return Response.json({ error: "Location not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const checkinUrl = `${appUrl}/checkin?loc=${location.code}`;

  const qrDataUrl = await QRCode.toDataURL(checkinUrl, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return Response.json({
    qrDataUrl,
    checkinUrl,
    locationCode: location.code,
    locationLabel: location.label,
  });
}
