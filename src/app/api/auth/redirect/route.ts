import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ redirect: "/login" });
  }

  if (session.user.role === "CUSTOMER") {
    return Response.json({ redirect: "/portal" });
  }

  return Response.json({ redirect: "/dashboard" });
}
