"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button size="sm" disabled>Laden...</Button>;
  }

  if (session?.user) {
    const role = (session.user as { role?: string }).role;
    const href = role === "CUSTOMER" ? "/portal" : "/dashboard";
    return (
      <div className="flex items-center gap-1">
        <Link href={href}>
          <Button size="sm">Mijn omgeving</Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link href="/aanmelden">
        <Button variant="ghost" size="sm">Aanmelden</Button>
      </Link>
      <Link href="/login">
        <Button size="sm">Inloggen</Button>
      </Link>
    </>
  );
}
