import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegistrationForm } from "@/components/public/registration-form";
import { PublicShell } from "@/components/public/public-shell";

export default function AanmeldenPage() {
  return (
    <PublicShell>
      <h1 className="text-3xl font-bold mb-2">Aanmelden</h1>
      <p className="text-muted-foreground mb-6">
        Meld u en uw voertuig aan voor een stallingsplek bij Stalling aan de Dijk.
        Na aanmelding ontvangt u inloggegevens voor het klantportaal.
      </p>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Registratieformulier</CardTitle>
          <CardDescription>
            Vul uw gegevens en voertuiginformatie in. We nemen zo snel mogelijk contact met u op.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </PublicShell>
  );
}
