import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
