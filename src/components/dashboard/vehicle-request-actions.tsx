"use client";

import { Button } from "@/components/ui/button";
import { approveVehicle, rejectVehicle } from "@/app/actions/vehicle-requests";
import { Check, X } from "lucide-react";

interface Props {
  vehicleId: string;
  licensePlate: string;
}

export function VehicleRequestActions({ vehicleId, licensePlate }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          if (confirm(`Weet je zeker dat je ${licensePlate} wilt afwijzen? Het voertuig wordt verwijderd.`)) {
            await rejectVehicle(vehicleId);
          }
        }}
      >
        <X className="mr-1 h-4 w-4" />
        Afwijzen
      </Button>
      <Button
        size="sm"
        onClick={() => approveVehicle(vehicleId)}
      >
        <Check className="mr-1 h-4 w-4" />
        Goedkeuren
      </Button>
    </div>
  );
}
