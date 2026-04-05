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
import { createBulkLocations } from "@/app/actions/locations";
import { Plus } from "lucide-react";

export function LocationActions() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createBulkLocations(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Locaties toevoegen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Locaties in bulk aanmaken</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section">Sectie</Label>
            <Input id="section" name="section" placeholder="bijv. A, B, C" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prefix">Prefix</Label>
            <Input id="prefix" name="prefix" placeholder="bijv. A" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Aantal plekken</Label>
            <Input id="count" name="count" type="number" min="1" max="50" defaultValue="10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isIndoor">Locatietype</Label>
            <Select name="isIndoor" defaultValue="true">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Binnen (kas)</SelectItem>
                <SelectItem value="false">Buiten (terrein)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Aanmaken
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
