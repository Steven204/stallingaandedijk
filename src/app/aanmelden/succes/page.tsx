import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";

export default function RegistratieSuccesPage() {
  return (
    <PublicShell>
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Aanmelding ontvangen!</h1>
          <p className="text-muted-foreground mb-6">
            Bedankt voor uw aanmelding. U kunt nu inloggen op het klantportaal
            met uw e-mailadres en het door u gekozen wachtwoord.
          </p>
          <p className="text-muted-foreground mb-6 text-sm">
            We nemen zo snel mogelijk contact met u op om de stallingsovereenkomst
            af te ronden.
          </p>
          <Link href="/login">
            <Button className="w-full">Naar inloggen</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
    </PublicShell>
  );
}
