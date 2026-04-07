"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BrandCombobox } from "@/components/forms/brand-combobox";
import { updateVehiclePortal, deleteVehiclePortal } from "@/app/actions/portal-vehicles";
import { Pencil, Trash2, AlertCircle } from "lucide-react";

interface Props {
  vehicleId: string;
  licensePlate: string;
  brand: string | null;
  model: string | null;
  lengthInMeters: number;
  canDelete: boolean;
}

export function EditVehicleForm({ vehicleId, licensePlate, brand, model, lengthInMeters, canDelete }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleUpdate(formData: FormData) {
    setError(null);
    try {
      await updateVehiclePortal(vehicleId, formData);
      setEditOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    if (!confirm(`Weet u zeker dat u voertuig ${licensePlate} wilt verwijderen?`)) return;
    try {
      await deleteVehiclePortal(vehicleId);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <div className="flex gap-1">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <Pencil className="mr-1 h-4 w-4" />
          Bewerken
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voertuig {licensePlate} bewerken</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Kenteken</Label>
              <Input value={licensePlate} disabled className="bg-muted font-mono" />
              <p className="text-xs text-muted-foreground">Kenteken kan niet gewijzigd worden</p>
            </div>
            <div className="space-y-2">
              <Label>Merk</Label>
              <BrandCombobox name="brand" defaultValue={brand ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input name="model" defaultValue={model ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Lengte (strekkende meters)</Label>
              <Input name="lengthInMeters" type="number" step="0.1" min="1" max="30" defaultValue={lengthInMeters} required />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Opslaan</Button>
          </form>
        </DialogContent>
      </Dialog>

      {canDelete && (
        <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {deleteError && (
        <p className="text-xs text-red-600 mt-1">{deleteError}</p>
      )}
    </div>
  );
}
