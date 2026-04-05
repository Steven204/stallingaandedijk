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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateLocation, deleteLocation } from "@/app/actions/locations";
import { MoreVertical, Pencil, Trash2, AlertCircle } from "lucide-react";

interface LocationItemActionsProps {
  locationId: string;
  locationCode: string;
  section: string;
  isIndoor: boolean;
}

export function LocationItemActions({
  locationId,
  locationCode,
  section,
  isIndoor,
}: LocationItemActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(formData: FormData) {
    try {
      await updateLocation(locationId, formData);
      setEditOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fout bij opslaan");
    }
  }

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je locatie ${locationCode} wilt verwijderen?`)) return;
    try {
      await deleteLocation(locationId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fout bij verwijderen");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-6 w-6 p-0" />}>
          <MoreVertical className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Bewerken
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Verwijderen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Locatie {locationCode} bewerken</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input name="code" defaultValue={locationCode} required className="uppercase font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Sectie</Label>
              <Input name="section" defaultValue={section} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select name="isIndoor" defaultValue={isIndoor ? "true" : "false"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Binnen (kas)</SelectItem>
                  <SelectItem value="false">Buiten (terrein)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Opslaan</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
