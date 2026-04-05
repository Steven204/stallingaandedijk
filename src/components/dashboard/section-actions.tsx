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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { renameSection, deleteSection } from "@/app/actions/locations";
import { MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react";

interface SectionActionsProps {
  sectionName: string;
  locationCount: number;
  occupiedCount: number;
}

export function SectionActions({ sectionName, locationCount, occupiedCount }: SectionActionsProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRename(formData: FormData) {
    const newName = formData.get("newName") as string;
    if (newName && newName !== sectionName) {
      await renameSection(sectionName, newName);
      setRenameOpen(false);
    }
  }

  async function handleDelete() {
    if (occupiedCount > 0) {
      setError("Kan sectie niet verwijderen: er staan nog voertuigen");
      return;
    }
    if (!confirm(`Weet je zeker dat je sectie ${sectionName} met ${locationCount} locaties wilt verwijderen?`)) {
      return;
    }
    try {
      await deleteSection(sectionName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Sectie hernoemen
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600"
            disabled={occupiedCount > 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sectie verwijderen
            {occupiedCount > 0 && (
              <span className="ml-1 text-xs">({occupiedCount} bezet)</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sectie {sectionName} hernoemen</DialogTitle>
          </DialogHeader>
          <form action={handleRename} className="space-y-4">
            <div className="space-y-2">
              <Label>Nieuwe naam</Label>
              <Input name="newName" defaultValue={sectionName} required autoFocus />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Hernoemen</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
