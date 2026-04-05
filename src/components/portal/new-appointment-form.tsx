"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment } from "@/app/actions/portal-appointments";
import { AlertCircle } from "lucide-react";

interface ClosedSeason {
  id: string;
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

interface Props {
  vehicles: { id: string; licensePlate: string }[];
  closedSeasons: ClosedSeason[];
}

const monthNames = [
  "", "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

export function NewAppointmentForm({ vehicles, closedSeasons }: Props) {
  const [error, setError] = useState<string | null>(null);

  // Minimum date = 4 days from now
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await createAppointment(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <div>
      {closedSeasons.length > 0 && (
        <div className="mb-4 rounded-lg border border-orange-300 bg-orange-50 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium text-orange-800">
            <AlertCircle className="h-4 w-4" />
            Let op: gesloten periodes voor ophalen
          </div>
          <ul className="mt-1 text-orange-700">
            {closedSeasons.map((s) => (
              <li key={s.id}>
                {s.name}: {s.startDay} {monthNames[s.startMonth]} t/m{" "}
                {s.endDay} {monthNames[s.endMonth]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Voertuig</Label>
            <Select name="vehicleId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PICKUP">Ophalen</SelectItem>
                <SelectItem value="DROPOFF">Wegbrengen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gewenste datum</Label>
            <Input name="requestedDate" type="date" min={minDateStr} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notities (optioneel)</Label>
          <Textarea name="notes" placeholder="Extra informatie..." />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit">Afspraak aanvragen</Button>
        <p className="text-xs text-muted-foreground">
          Minimaal 4 dagen van tevoren aanvragen. U ontvangt een bevestiging.
        </p>
      </form>
    </div>
  );
}
