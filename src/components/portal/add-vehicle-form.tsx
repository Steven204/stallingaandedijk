"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BrandCombobox } from "@/components/forms/brand-combobox";
import { addVehicle } from "@/app/actions/portal-vehicles";
import { Plus, AlertCircle } from "lucide-react";

const vehicleTypes = [
  { value: "CARAVAN", label: "Caravan" },
  { value: "CAMPER", label: "Camper" },
  { value: "BOAT", label: "Boot" },
  { value: "OLDTIMER", label: "Oldtimer" },
  { value: "CAR", label: "Auto" },
];

export function AddVehicleForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await addVehicle(formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Voertuig toevoegen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voertuig toevoegen</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type voertuig *</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer type" />
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
            <Label>Kenteken *</Label>
            <Input name="licensePlate" placeholder="AB-123-CD" required className="uppercase font-mono" />
          </div>
          <div className="space-y-2">
            <Label>Merk</Label>
            <BrandCombobox name="brand" />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input name="model" />
          </div>
          <div className="space-y-2">
            <Label>Lengte in meters *</Label>
            <Input name="lengthInMeters" type="number" step="0.1" min="1" required />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full">Toevoegen</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
