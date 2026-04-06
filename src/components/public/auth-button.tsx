"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="lovable-btn-primary opacity-50 text-sm">Laden...</span>;
  }

  if (session?.user) {
    const role = (session.user as { role?: string }).role;
    const href = role === "CUSTOMER" ? "/portal" : "/dashboard";
    return (
      <div className="flex items-center gap-1">
        <Link href={href} className="lovable-btn-primary text-sm">
          Mijn omgeving
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="lovable-btn-ghost p-2"
          title="Uitloggen"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <Link href="/aanmelden" className="lovable-btn-ghost hidden sm:inline-flex">
        Aanmelden
      </Link>
      <Link href="/login" className="lovable-btn-primary text-sm">
        Inloggen
      </Link>
    </>
  );
}
