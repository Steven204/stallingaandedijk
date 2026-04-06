import Link from "next/link";
import { Clock } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";

export default function RegistratieSuccesPage() {
  return (
    <PublicShell>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="lovable-card max-w-md w-full">
        <div className="p-6 text-center">
          <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="lovable-heading text-2xl mb-2">Aanmelding ontvangen!</h1>
          <p className="lovable-text-muted mb-4">
            Bedankt voor uw aanmelding. Uw account wordt beoordeeld door de beheerder.
          </p>
          <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm text-orange-800 mb-6">
            U ontvangt bericht zodra uw account is goedgekeurd.
            Daarna kunt u inloggen met uw e-mailadres en wachtwoord.
          </div>
          <Link href="/" className="inline-flex items-center justify-center w-full rounded-xl border border-[#eceae4] bg-[#f7f4ed] px-4 py-2 text-sm font-medium hover:bg-[#eceae4] transition-colors">
            Terug naar homepagina
          </Link>
        </div>
      </div>
    </div>
    </PublicShell>
  );
}
