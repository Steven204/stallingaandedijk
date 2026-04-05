"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Printer } from "lucide-react";

interface Location {
  id: string;
  code: string;
  label: string;
  section: string | null;
}

interface QrData {
  qrDataUrl: string;
  checkinUrl: string;
  locationCode: string;
  locationLabel: string;
}

export function QrCodeGrid({ locations }: { locations: Location[] }) {
  const [selectedQr, setSelectedQr] = useState<QrData | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function generateQr(location: Location) {
    setLoading(location.id);
    try {
      const res = await fetch(`/api/qr/generate?locationId=${location.id}`);
      const data = await res.json();
      setSelectedQr(data);
    } finally {
      setLoading(null);
    }
  }

  function printQr() {
    if (!selectedQr) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${selectedQr.locationCode}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; margin: 0; }
            h1 { font-size: 48px; margin-bottom: 16px; }
            h2 { font-size: 24px; color: #666; margin-bottom: 32px; }
            img { width: 300px; height: 300px; }
            p { margin-top: 16px; font-size: 14px; color: #999; }
          </style>
        </head>
        <body>
          <h1>${selectedQr.locationCode}</h1>
          <h2>${selectedQr.locationLabel}</h2>
          <img src="${selectedQr.qrDataUrl}" alt="QR Code" />
          <p>Stalling aan de Dijk</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {locations.map((location) => (
          <Button
            key={location.id}
            variant="outline"
            className="h-20 flex-col gap-1"
            disabled={loading === location.id}
            onClick={() => generateQr(location)}
          >
            <QrCode className="h-6 w-6" />
            <span className="font-mono font-bold">{location.code}</span>
          </Button>
        ))}
      </div>

      <Dialog open={!!selectedQr} onOpenChange={() => setSelectedQr(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              QR Code - {selectedQr?.locationCode}
            </DialogTitle>
          </DialogHeader>
          {selectedQr && (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedQr.qrDataUrl}
                alt={`QR Code voor ${selectedQr.locationCode}`}
                className="w-64 h-64"
              />
              <p className="text-sm text-muted-foreground text-center">
                {selectedQr.locationLabel}
              </p>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {selectedQr.checkinUrl}
              </p>
              <Button onClick={printQr} className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Printen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
