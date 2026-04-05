"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { createMaintenanceRequest } from "@/app/actions/maintenance";
import { Wrench } from "lucide-react";

const maintenanceTypes = [
  { value: "APK", label: "APK keuring" },
  { value: "BATTERY", label: "Accu laden/vervangen" },
  { value: "TIRES", label: "Banden controleren/vervangen" },
  { value: "GENERAL", label: "Algemeen onderhoud" },
  { value: "OTHER", label: "Overig" },
];

interface Props {
  vehicleId: string;
  licensePlate: string;
}

export function MaintenanceForm({ vehicleId, licensePlate }: Props) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    formData.append("vehicleId", vehicleId);
    await createMaintenanceRequest(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Wrench className="mr-1 h-4 w-4" />
        Onderhoud aanvragen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Onderhoud aanvragen - {licensePlate}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type onderhoud</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer type" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Omschrijving (optioneel)</Label>
            <Textarea
              name="description"
              placeholder="Beschrijf wat er gedaan moet worden..."
            />
          </div>
          <Button type="submit" className="w-full">
            Verzoek indienen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
