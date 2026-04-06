"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="lovable min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-semibold text-red-600 mb-4">Fout</h1>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1c1c1c" }}>Er is iets misgegaan</h2>
        <p className="lovable-text-muted mb-8">
          {error.message || "Er is een onverwachte fout opgetreden. Probeer het opnieuw."}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="lovable-btn-primary">Opnieuw proberen</button>
          <button onClick={() => window.location.href = "/"} className="lovable-btn-ghost">
            Naar homepagina
          </button>
        </div>
      </div>
    </div>
  );
}
