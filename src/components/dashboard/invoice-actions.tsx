"use client";

import { Button } from "@/components/ui/button";
import { markInvoicePaid, markInvoiceOverdue } from "@/app/actions/invoices";
import { Check, AlertTriangle } from "lucide-react";

interface InvoiceActionsProps {
  invoiceId: string;
  currentStatus: string;
}

export function InvoiceActions({ invoiceId, currentStatus }: InvoiceActionsProps) {
  if (currentStatus === "PAID") return null;

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => markInvoicePaid(invoiceId)}
        title="Markeer als betaald"
      >
        <Check className="h-4 w-4" />
      </Button>
      {currentStatus === "PENDING" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => markInvoiceOverdue(invoiceId)}
          title="Markeer als achterstallig"
        >
          <AlertTriangle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
