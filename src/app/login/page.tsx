"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === "CUSTOMER") {
        router.push("/portal");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes("PENDING_APPROVAL") || result.code === "PENDING_APPROVAL") {
        setError("Uw account wacht nog op goedkeuring door de beheerder. U ontvangt bericht zodra uw account is geactiveerd.");
      } else {
        setError("Ongeldige e-mail of wachtwoord");
      }
    } else {
      // Haal de juiste redirect op basis van rol
      const res = await fetch("/api/auth/redirect");
      const { redirect } = await res.json();
      router.push(redirect);
      router.refresh();
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <div className="lovable min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold tracking-tight" style={{ color: "#1c1c1c" }}>
            Stalling aan de Dijk
          </Link>
          <p className="lovable-text-muted text-sm mt-2">
            Log in op uw account
          </p>
        </div>
        <div className="lovable-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: "#1c1c1c" }}>
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="naam@voorbeeld.nl"
                required
                className="w-full px-3 py-2.5 text-sm rounded-md outline-none transition-all"
                style={{
                  backgroundColor: "#f7f4ed",
                  border: "1px solid #eceae4",
                  color: "#1c1c1c",
                }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "#1c1c1c" }}>
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2.5 text-sm rounded-md outline-none transition-all"
                style={{
                  backgroundColor: "#f7f4ed",
                  border: "1px solid #eceae4",
                  color: "#1c1c1c",
                }}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="lovable-btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? "Bezig met inloggen..." : "Inloggen"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm lovable-text-muted mt-6">
          Nog geen account?{" "}
          <Link href="/aanmelden" className="underline" style={{ color: "#1c1c1c" }}>
            Aanmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
