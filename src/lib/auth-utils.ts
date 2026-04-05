import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";

export async function getSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!roles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}
