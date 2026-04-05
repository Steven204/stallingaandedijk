"use client";

import { Button } from "@/components/ui/button";
import { updateAppointmentStatus } from "@/app/actions/appointments";
import { Check, X, CheckCircle2 } from "lucide-react";

interface AppointmentActionsProps {
  appointmentId: string;
  currentStatus: string;
}

export function AppointmentActions({
  appointmentId,
  currentStatus,
}: AppointmentActionsProps) {
  if (currentStatus === "COMPLETED" || currentStatus === "REJECTED") {
    return null;
  }

  return (
    <div className="flex gap-1">
      {currentStatus === "REQUESTED" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateAppointmentStatus(appointmentId, "CONFIRMED")}
            title="Bevestigen"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateAppointmentStatus(appointmentId, "REJECTED")}
            title="Afwijzen"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      {currentStatus === "CONFIRMED" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateAppointmentStatus(appointmentId, "COMPLETED")}
          title="Afronden"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
