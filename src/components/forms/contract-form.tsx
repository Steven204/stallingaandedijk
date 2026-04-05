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
import { createContract } from "@/app/actions/contracts";
import type { PriceConfig } from "@/generated/prisma";

interface Customer {
  id: string;
  name: string;
  vehicles: {
    id: string;
    licensePlate: string;
    type: string;
    lengthInMeters: number;
  }[];
}

interface ContractFormProps {
  customers: Customer[];
  prices: PriceConfig[];
}

export function ContractForm({ customers, prices }: ContractFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedVehicle = selectedCustomer?.vehicles.find(
    (v) => v.id === selectedVehicleId
  );

  const latestPrice = selectedVehicle
    ? prices.find((p) => p.vehicleType === selectedVehicle.type)
    : null;

  const totalPrice =
    latestPrice && selectedVehicle
      ? latestPrice.pricePerMeter * selectedVehicle.lengthInMeters
      : 0;

  return (
    <form action={createContract} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Klant *</Label>
        <Select
          name="customerId"
          required
          onValueChange={(v: unknown) => {
            if (v) setSelectedCustomerId(v as string);
            setSelectedVehicleId("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer klant" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCustomer && (
        <div className="space-y-2">
          <Label>Voertuig *</Label>
          <Select
            name="vehicleId"
            required
            onValueChange={(v: unknown) => { if (v) setSelectedVehicleId(v as string); }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer voertuig" />
            </SelectTrigger>
            <SelectContent>
              {selectedCustomer.vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.licensePlate} ({v.lengthInMeters}m)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Startdatum *</Label>
        <Input name="startDate" type="date" required />
      </div>

      {selectedVehicle && latestPrice && (
        <>
          <input type="hidden" name="pricePerMeter" value={latestPrice.pricePerMeter} />
          <input type="hidden" name="lengthInMeters" value={selectedVehicle.lengthInMeters} />
          <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
            <p>
              Prijs per meter: <strong>&euro; {latestPrice.pricePerMeter.toFixed(2)}</strong>
            </p>
            <p>
              Lengte: <strong>{selectedVehicle.lengthInMeters}m</strong>
            </p>
            <p className="text-lg font-bold">
              Totaal per jaar: &euro; {totalPrice.toFixed(2)}
            </p>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Automatisch verlengen</Label>
        <Select name="autoRenew" defaultValue="true">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Ja</SelectItem>
            <SelectItem value="false">Nee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!selectedVehicle || !latestPrice}>
        Contract aanmaken
      </Button>
    </form>
  );
}
