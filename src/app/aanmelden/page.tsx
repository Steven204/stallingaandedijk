import { RegistrationForm } from "@/components/public/registration-form";
import { PublicShell } from "@/components/public/public-shell";

export default function AanmeldenPage() {
  return (
    <PublicShell>
      <h1 className="lovable-heading text-3xl mb-2">Aanmelden</h1>
      <p className="lovable-text-muted mb-6">
        Meld u en uw voertuig aan voor een stallingsplek bij Stalling aan de Dijk.
        Na aanmelding ontvangt u inloggegevens voor het klantportaal.
      </p>

      <div className="lovable-card max-w-2xl">
        <div className="p-6 pb-2">
          <h2 className="lovable-heading text-xl">Registratieformulier</h2>
          <p className="lovable-text-muted text-sm mt-1">
            Vul uw gegevens en voertuiginformatie in. We nemen zo snel mogelijk contact met u op.
          </p>
        </div>
        <div className="p-6">
          <RegistrationForm />
        </div>
      </div>
    </PublicShell>
  );
}
