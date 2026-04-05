"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile";
import type { User } from "@/generated/prisma";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Naam *</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={user.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">
          E-mail kan niet gewijzigd worden. Neem contact op met de beheerder.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefoon</Label>
        <Input id="phone" name="phone" defaultValue={user.phone ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Input id="address" name="address" defaultValue={user.address ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postcode</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={user.postalCode ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Plaats</Label>
          <Input id="city" name="city" defaultValue={user.city ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Laat leeg om niet te wijzigen"
          minLength={6}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Opslaan</Button>
        {saved && (
          <span className="text-sm text-green-600">Gegevens opgeslagen!</span>
        )}
      </div>
    </form>
  );
}
