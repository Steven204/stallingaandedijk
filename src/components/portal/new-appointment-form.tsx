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
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { useSubmitState } from "@/components/ui/submit-button";

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
  const [success, setSuccess] = useState(false);
  const { state, handleAction } = useSubmitState();

  // Minimum date = 4 days from now
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    try {
      await handleAction(async () => {
        await createAppointment(formData);
      });
      setSuccess(true);
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
        <div className="space-y-2">
          <Label>Voertuig *</Label>
          <Select name="vehicleId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer voertuig" />
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

        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-sm font-medium">Wanneer wilt u uw voertuig gebruiken?</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div className="space-y-2">
              <Label>Ophalen op *</Label>
              <Input name="pickupDate" type="date" min={minDateStr} required />
            </div>
            <div className="hidden sm:flex items-center justify-center pb-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>Terugbrengen op</Label>
              <Input name="returnDate" type="date" min={minDateStr} />
              <p className="text-xs text-muted-foreground">Optioneel — vul in als u al weet wanneer</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notities (optioneel)</Label>
          <Textarea name="notes" placeholder="Bijv. graag voor 10:00, of specifieke wensen..." />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm rounded-lg border border-green-300 bg-green-50 p-3">
            Afspraak succesvol aangevraagd! De beheerder neemt contact op ter bevestiging.
          </div>
        )}

        <Button type="submit" disabled={state === "loading"} className={state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}>
          {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {state === "success" && <Check className="mr-2 h-4 w-4" />}
          {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : "Afspraak aanvragen"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Minimaal 4 dagen van tevoren aanvragen. U ontvangt een bevestiging.
        </p>
      </form>
    </div>
  );
}
