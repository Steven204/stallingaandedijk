"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function PortalLogout() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="mr-1 h-4 w-4" />
      Uitloggen
    </Button>
  );
}
