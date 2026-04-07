"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile";
import { Check, Loader2 } from "lucide-react";
import type { User } from "@/generated/prisma";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
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
      await updateProfile(formData);
      setSaved(true);
    } finally {
      setLoading(false);
    }
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
        <Button
          type="submit"
          disabled={loading}
          className={saved ? "bg-green-600 hover:bg-green-600 text-white" : ""}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saved && <Check className="mr-2 h-4 w-4" />}
          {saved ? "Opgeslagen!" : loading ? "Opslaan..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}
