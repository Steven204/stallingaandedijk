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
import { updateSeason } from "@/app/actions/settings";
import { Plus } from "lucide-react";

export function SeasonForm() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateSeason(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Plus className="mr-2 h-4 w-4" />
        Seizoen toevoegen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seizoen toevoegen</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Naam</Label>
            <Input name="name" required placeholder="bijv. Winterperiode" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start dag</Label>
              <Input name="startDay" type="number" min="1" max="31" required />
            </div>
            <div className="space-y-2">
              <Label>Start maand</Label>
              <Input name="startMonth" type="number" min="1" max="12" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Eind dag</Label>
              <Input name="endDay" type="number" min="1" max="31" required />
            </div>
            <div className="space-y-2">
              <Label>Eind maand</Label>
              <Input name="endMonth" type="number" min="1" max="12" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ophalen geblokkeerd?</Label>
            <Select name="isClosedForPickup" defaultValue="true">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ja, gesloten voor ophalen</SelectItem>
                <SelectItem value="false">Nee, open voor ophalen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Opslaan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
