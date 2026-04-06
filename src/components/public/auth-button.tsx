"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button size="sm" disabled>Laden...</Button>;
  }

  if (session?.user) {
    const role = (session.user as { role?: string }).role;
    const href = role === "CUSTOMER" ? "/portal" : "/dashboard";
    return (
      <Link href={href}>
        <Button size="sm">Mijn omgeving</Button>
      </Link>
    );
  }

  return (
    <Link href="/login">
      <Button size="sm">Inloggen</Button>
    </Link>
  );
}
