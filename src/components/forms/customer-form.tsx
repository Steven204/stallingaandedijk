"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomer, updateCustomer, deleteCustomer } from "@/app/actions/customers";
import type { User } from "@/generated/prisma";

interface CustomerFormProps {
  customer?: User;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const isEditing = !!customer;

  async function handleSubmit(formData: FormData) {
    if (isEditing) {
      await updateCustomer(customer.id, formData);
    } else {
      await createCustomer(formData);
    }
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
            placeholder="Standaard: welkom123"
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

      <div className="flex gap-2">
        <Button type="submit">
          {isEditing ? "Opslaan" : "Klant aanmaken"}
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
