"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function PortalLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-opacity hover:opacity-75"
      style={{ color: "#5f5f5d" }}
    >
      <LogOut className="h-4 w-4" />
      Uitloggen
    </button>
  );
}
