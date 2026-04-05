"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { QrScanner } from "@/components/qr/qr-scanner";
import Link from "next/link";

function CheckinForm() {
  const searchParams = useSearchParams();
  const locFromUrl = searchParams.get("loc") ?? "";

  const [locationCode, setLocationCode] = useState(locFromUrl);
  const [licensePlate, setLicensePlate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!licensePlate || !locationCode) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: licensePlate.toUpperCase().trim(),
          locationCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Er is een fout opgetreden");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Netwerkfout. Probeer het opnieuw.");
    }
  }

  // Step 1: No location → QR scanner / location picker
  if (!locationCode) {
    return <QrScanner onScanned={(code) => setLocationCode(code)} />;
  }

  // Step 3: Success
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-bold">Voertuig ingecheckt!</p>
            <p className="text-muted-foreground mt-2">
              <span className="font-mono font-bold">{licensePlate.toUpperCase()}</span> is
              geregistreerd op locatie{" "}
              <span className="font-mono font-bold">{locationCode}</span>
            </p>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                setStatus("idle");
                setLocationCode("");
                setLicensePlate("");
              }}
            >
              Nog een voertuig inchecken
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="mt-2 w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Location set → kenteken invoeren
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Voertuig Inchecken</CardTitle>
          <CardDescription>
            Locatie:{" "}
            <span className="font-mono font-bold text-foreground text-lg">
              {locationCode}
            </span>
            {!locFromUrl && (
              <Button
                variant="link"
                size="sm"
                className="ml-2 text-xs"
                onClick={() => setLocationCode("")}
              >
                Andere plek
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Kenteken</Label>
              <Input
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="AB-123-CD"
                required
                className="text-center text-lg font-mono uppercase tracking-wider"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-300 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={!licensePlate || status === "loading"}
            >
              {status === "loading" ? "Bezig met opslaan..." : "Inchecken"}
            </Button>
          </form>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full mt-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Laden...
        </div>
      }
    >
      <CheckinForm />
    </Suspense>
  );
}
