"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, Camera, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Location {
  id: string;
  code: string;
  label: string;
  section: string | null;
  isOccupied: boolean;
  isIndoor: boolean;
}

interface QrScannerProps {
  onScanned: (locationCode: string) => void;
}

export function QrScanner({ onScanned }: QrScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  async function startScanning() {
    setError(null);
    setScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!scannerRef.current) return;

      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const loc = url.searchParams.get("loc");
            if (loc) {
              scanner.stop().catch(() => {});
              onScanned(loc);
              return;
            }
          } catch {
            // Not a URL
          }
          if (/^[A-Z]\d{2}$/.test(decodedText.trim())) {
            scanner.stop().catch(() => {});
            onScanned(decodedText.trim());
          }
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      if (err instanceof Error && err.message.includes("Permission")) {
        setError("Camera toegang geweigerd. Sta cameratoegang toe in je browser.");
      } else {
        setError("Kan de camera niet openen. Probeer het opnieuw.");
      }
    }
  }

  async function loadLocations() {
    setLoadingLocations(true);
    setShowPicker(true);
    try {
      const res = await fetch("/api/locations/available");
      if (res.ok) {
        setLocations(await res.json());
      }
    } finally {
      setLoadingLocations(false);
    }
  }

  useEffect(() => {
    return () => {
      html5QrCodeRef.current?.stop().catch(() => {});
    };
  }, []);

  // Location picker view
  if (showPicker) {
    const sections = [...new Set(locations.map((l) => l.section ?? "Overig"))];

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Kies een stallingsplek</h1>
            <Button variant="outline" size="sm" onClick={() => setShowPicker(false)}>
              Terug
            </Button>
          </div>

          {loadingLocations ? (
            <p className="text-center text-muted-foreground py-12">Laden...</p>
          ) : (
            sections.map((section) => (
              <div key={section} className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Sectie {section}
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {locations
                    .filter((l) => (l.section ?? "Overig") === section)
                    .map((location) => (
                      <button
                        key={location.id}
                        onClick={() => onScanned(location.code)}
                        className={`rounded-lg border-2 p-3 text-center transition-colors ${
                          location.isOccupied
                            ? "border-red-300 bg-red-50 hover:bg-red-100"
                            : "border-green-300 bg-green-50 hover:bg-green-100"
                        }`}
                      >
                        <span className="font-mono font-bold text-sm">
                          {location.code}
                        </span>
                        <span className="block text-[10px] text-muted-foreground mt-0.5">
                          {location.isOccupied ? "Bezet" : "Vrij"} · {location.isIndoor ? "Binnen" : "Buiten"}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Default: scanner + picker buttons
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <QrCode className="h-12 w-12 mx-auto mb-2 text-primary" />
          <CardTitle className="text-xl">Voertuig Inchecken</CardTitle>
          <CardDescription>
            Scan een QR-code of kies een locatie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scanning ? (
            <div>
              <div
                id="qr-reader"
                ref={scannerRef}
                className="w-full rounded-lg overflow-hidden"
              />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  html5QrCodeRef.current?.stop().catch(() => {});
                  setScanning(false);
                }}
              >
                Annuleren
              </Button>
            </div>
          ) : (
            <>
              <Button
                className="w-full h-14 text-base"
                onClick={startScanning}
              >
                <Camera className="mr-2 h-5 w-5" />
                QR-code scannen
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 text-base"
                onClick={loadLocations}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Locatie kiezen
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar dashboard
                </Button>
              </Link>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
