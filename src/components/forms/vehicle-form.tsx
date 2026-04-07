"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicle, updateVehicle, deleteVehicle } from "@/app/actions/vehicles";
import { BrandCombobox } from "@/components/forms/brand-combobox";
import type { Vehicle } from "@/generated/prisma";

interface VehicleFormProps {
  vehicle?: Vehicle;
  customers: { id: string; name: string }[];
}

const vehicleTypes = [
  { value: "CARAVAN", label: "Caravan" },
  { value: "CAMPER", label: "Camper" },
  { value: "BOAT", label: "Boot" },
  { value: "OLDTIMER", label: "Oldtimer" },
  { value: "CAR", label: "Auto" },
];

export function VehicleForm({ vehicle, customers }: VehicleFormProps) {
  const isEditing = !!vehicle;
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSaved(false);
    try {
      if (isEditing) {
        await updateVehicle(vehicle.id, formData);
      } else {
        await createVehicle(formData);
      }
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  const state = saved ? "success" : loading ? "loading" : "idle";

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="customerId">Klant *</Label>
        <Select name="customerId" defaultValue={vehicle?.customerId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecteer een klant" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select name="type" defaultValue={vehicle?.type ?? "CARAVAN"} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licensePlate">Kenteken *</Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          defaultValue={vehicle?.licensePlate}
          placeholder="AB-123-CD"
          required
          className="uppercase font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label>Merk</Label>
        <BrandCombobox name="brand" defaultValue={vehicle?.brand ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          name="model"
          defaultValue={vehicle?.model ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lengthInMeters">Lengte (strekkende meters) *</Label>
        <Input
          id="lengthInMeters"
          name="lengthInMeters"
          type="number"
          step="0.1"
          min="1"
          defaultValue={vehicle?.lengthInMeters}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notities</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={vehicle?.notes ?? ""}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={state === "loading"} className={state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}>
          {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {state === "success" && <Check className="mr-2 h-4 w-4" />}
          {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : isEditing ? "Opslaan" : "Voertuig registreren"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (confirm("Weet je zeker dat je dit voertuig wilt verwijderen?")) {
                await deleteVehicle(vehicle.id);
              }
            }}
          >
            Verwijderen
          </Button>
        )}
      </div>
    </form>
  );
}
