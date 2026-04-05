"use client";

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
import { updatePrice } from "@/app/actions/settings";

export function PriceForm() {
  return (
    <form action={updatePrice} className="flex items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="vehicleType" className="text-xs">Type</Label>
        <Select name="vehicleType" required>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CARAVAN">Caravan</SelectItem>
            <SelectItem value="CAMPER">Camper</SelectItem>
            <SelectItem value="BOAT">Boot</SelectItem>
            <SelectItem value="OLDTIMER">Oldtimer</SelectItem>
            <SelectItem value="CAR">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="pricePerMeter" className="text-xs">Prijs / meter</Label>
        <Input
          id="pricePerMeter"
          name="pricePerMeter"
          type="number"
          step="0.01"
          min="0"
          className="w-[120px]"
          required
        />
      </div>
      <Button type="submit" size="sm">
        Toevoegen
      </Button>
    </form>
  );
}
