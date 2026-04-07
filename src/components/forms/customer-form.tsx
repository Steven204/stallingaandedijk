"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSubmitState } from "@/components/ui/submit-button";
import { Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCustomer, updateCustomer, deleteCustomer } from "@/app/actions/customers";
import { BrandCombobox } from "@/components/forms/brand-combobox";
import type { User } from "@/generated/prisma";

interface CustomerFormProps {
  customer?: User;
}

const vehicleTypes = [
  { value: "CARAVAN", label: "Caravan" },
  { value: "CAMPER", label: "Camper" },
  { value: "BOAT", label: "Boot" },
  { value: "OLDTIMER", label: "Oldtimer" },
  { value: "CAR", label: "Auto" },
];

export function CustomerForm({ customer }: CustomerFormProps) {
  const isEditing = !!customer;
  const { state, handleAction } = useSubmitState();

  async function handleSubmit(formData: FormData) {
    await handleAction(async () => {
      if (isEditing) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Naam *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={customer?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={customer?.email}
          required
        />
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="password">Wachtwoord</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Wordt random gegenereerd als leeg"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phone">Telefoon</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={customer?.phone ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Input
          id="address"
          name="address"
          defaultValue={customer?.address ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postcode</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={customer?.postalCode ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Plaats</Label>
          <Input
            id="city"
            name="city"
            defaultValue={customer?.city ?? ""}
          />
        </div>
      </div>

      {!isEditing && (
        <>
          <Separator />
          <h3 className="font-medium">Voertuig toevoegen</h3>
          <p className="text-sm text-muted-foreground">Optioneel — je kunt later ook een voertuig toevoegen.</p>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Type voertuig</Label>
            <Select name="vehicleType">
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
            <Label htmlFor="licensePlate">Kenteken</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              placeholder="AB-123-CD"
              className="uppercase font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Merk</Label>
            <BrandCombobox name="vehicleBrand" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Model</Label>
            <Input id="vehicleModel" name="vehicleModel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lengthInMeters">Lengte (strekkende meters)</Label>
            <Input
              id="lengthInMeters"
              name="lengthInMeters"
              type="number"
              step="0.1"
              min="1"
            />
          </div>
        </>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={state === "loading"} className={state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}>
          {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {state === "success" && <Check className="mr-2 h-4 w-4" />}
          {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : isEditing ? "Opslaan" : "Klant aanmaken"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (confirm("Weet je zeker dat je deze klant wilt verwijderen?")) {
                await deleteCustomer(customer.id);
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
