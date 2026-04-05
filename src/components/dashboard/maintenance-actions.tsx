"use client";

import { Button } from "@/components/ui/button";
import { updateMaintenanceStatus } from "@/app/actions/maintenance";
import { Play, Check, X } from "lucide-react";

interface Props {
  requestId: string;
  currentStatus: string;
}

export function MaintenanceActions({ requestId, currentStatus }: Props) {
  if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
    return null;
  }

  return (
    <div className="flex gap-1">
      {currentStatus === "REQUESTED" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateMaintenanceStatus(requestId, "IN_PROGRESS")}
            title="Start behandeling"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateMaintenanceStatus(requestId, "CANCELLED")}
            title="Annuleren"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      {currentStatus === "IN_PROGRESS" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateMaintenanceStatus(requestId, "COMPLETED")}
          title="Afronden"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
