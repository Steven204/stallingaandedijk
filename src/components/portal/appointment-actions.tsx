"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAppointmentPortal, cancelAppointmentPortal } from "@/app/actions/portal-appointments";
import { Pencil, X, AlertCircle, Check, Loader2 } from "lucide-react";
import { useSubmitState } from "@/components/ui/submit-button";

interface Props {
  appointmentId: string;
  status: string;
  pickupDate: string | null;
  returnDate: string | null;
  notes: string | null;
}

export function PortalAppointmentActions({ appointmentId, status, pickupDate, returnDate, notes }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, handleAction } = useSubmitState();

  const canEdit = status === "REQUESTED";
  const canCancel = status === "REQUESTED" || status === "CONFIRMED";

  if (!canEdit && !canCancel) return null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleUpdate(formData: FormData) {
    setError(null);
    try {
      await handleAction(async () => {
        await updateAppointmentPortal(appointmentId, formData);
      });
      setEditOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  async function handleCancel() {
    if (!confirm("Weet u zeker dat u deze afspraak wilt annuleren?")) return;
    try {
      await cancelAppointmentPortal(appointmentId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden");
    }
  }

  return (
    <div className="flex gap-1">
      {canEdit && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Pencil className="h-3 w-3" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Afspraak wijzigen</DialogTitle>
            </DialogHeader>
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Ophalen op</Label>
                <Input name="pickupDate" type="date" min={minDateStr} defaultValue={pickupDate ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label>Terugbrengen op (optioneel)</Label>
                <Input name="returnDate" type="date" min={minDateStr} defaultValue={returnDate ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Notities</Label>
                <Textarea name="notes" defaultValue={notes ?? ""} placeholder="Extra informatie..." />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <Button type="submit" disabled={state === "loading"} className={`w-full ${state === "success" ? "bg-green-600 hover:bg-green-600 text-white" : ""}`}>
                {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {state === "success" && <Check className="mr-2 h-4 w-4" />}
                {state === "success" ? "Opgeslagen!" : state === "loading" ? "Opslaan..." : "Opslaan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {canCancel && (
        <Button variant="outline" size="sm" onClick={handleCancel} className="text-red-600 hover:text-red-700">
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
