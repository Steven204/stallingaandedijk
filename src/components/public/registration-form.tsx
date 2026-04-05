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
import { Separator } from "@/components/ui/separator";
import { registerCustomer } from "@/app/actions/registration";
import { AlertCircle } from "lucide-react";

const vehicleTypes = [
  { value: "CARAVAN", label: "Caravan" },
  { value: "CAMPER", label: "Camper" },
  { value: "BOAT", label: "Boot" },
  { value: "OLDTIMER", label: "Oldtimer" },
  { value: "CAR", label: "Auto" },
];

export function RegistrationForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await registerCustomer(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Persoonlijke gegevens</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Naam *</Label>
              <Input id="name" name="name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres *</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer *</Label>
            <Input id="phone" name="phone" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input id="address" name="address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postcode</Label>
              <Input id="postalCode" name="postalCode" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Plaats</Label>
              <Input id="city" name="city" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kies een wachtwoord *</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
            <p className="text-xs text-muted-foreground">Minimaal 6 tekens</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Voertuiggegevens</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Type voertuig *</Label>
            <Select name="vehicleType" required>
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
            <Label htmlFor="licensePlate">Kenteken *</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              placeholder="AB-123-CD"
              required
              className="uppercase font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Merk</Label>
              <Input id="vehicleBrand" name="vehicleBrand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Model</Label>
              <Input id="vehicleModel" name="vehicleModel" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lengthInMeters">Lengte in meters *</Label>
            <Input
              id="lengthInMeters"
              name="lengthInMeters"
              type="number"
              step="0.1"
              min="1"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        Aanmelden
      </Button>
    </form>
  );
}
