"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Fout</h1>
        <h2 className="text-xl font-medium mb-2">Er is iets misgegaan</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "Er is een onverwachte fout opgetreden. Probeer het opnieuw."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Opnieuw proberen</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Naar homepagina
          </Button>
        </div>
      </div>
    </div>
  );
}
