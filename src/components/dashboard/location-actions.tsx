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
import { createBulkLocations, addLocationToSection } from "@/app/actions/locations";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationActionsProps {
  sections: string[];
}

export function LocationActions({ sections }: LocationActionsProps) {
  const [open, setOpen] = useState(false);

  async function handleBulkSubmit(formData: FormData) {
    await createBulkLocations(formData);
    setOpen(false);
  }

  async function handleSingleSubmit(formData: FormData) {
    await addLocationToSection(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Locatie toevoegen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Locatie toevoegen</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="single">
          <TabsList className="w-full">
            <TabsTrigger value="single" className="flex-1">Enkele locatie</TabsTrigger>
            <TabsTrigger value="bulk" className="flex-1">Nieuwe sectie</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form action={handleSingleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Sectie</Label>
                {sections.length > 0 ? (
                  <Select name="section" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Kies sectie" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((s) => (
                        <SelectItem key={s} value={s}>
                          Sectie {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input name="section" placeholder="bijv. A" required />
                )}
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input name="code" placeholder="bijv. A11" required className="uppercase font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
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
              <Button type="submit" className="w-full">Toevoegen</Button>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <form action={handleBulkSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Sectienaam</Label>
                <Input name="section" placeholder="bijv. D" required />
              </div>
              <div className="space-y-2">
                <Label>Prefix (voor nummering)</Label>
                <Input name="prefix" placeholder="bijv. D" required className="uppercase font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Aantal plekken</Label>
                <Input name="count" type="number" min="1" max="50" defaultValue="10" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
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
              <Button type="submit" className="w-full">Sectie aanmaken</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
