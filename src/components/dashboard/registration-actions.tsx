"use client";

import { Button } from "@/components/ui/button";
import { approveRegistration, rejectRegistration } from "@/app/actions/registrations";
import { Check, X } from "lucide-react";

interface Props {
  userId: string;
  userName: string;
}

export function RegistrationActions({ userId, userName }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          if (confirm(`Weet je zeker dat je de aanmelding van ${userName} wilt afwijzen? Het account en voertuig worden verwijderd.`)) {
            await rejectRegistration(userId);
          }
        }}
      >
        <X className="mr-1 h-4 w-4" />
        Afwijzen
      </Button>
      <Button
        size="sm"
        onClick={async () => {
          await approveRegistration(userId);
        }}
      >
        <Check className="mr-1 h-4 w-4" />
        Goedkeuren
      </Button>
    </div>
  );
}
