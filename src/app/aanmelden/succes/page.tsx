import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";

export default function RegistratieSuccesPage() {
  return (
    <PublicShell>
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Aanmelding ontvangen!</h1>
          <p className="text-muted-foreground mb-4">
            Bedankt voor uw aanmelding. Uw account wordt beoordeeld door de beheerder.
          </p>
          <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm text-orange-800 mb-6">
            U ontvangt bericht zodra uw account is goedgekeurd.
            Daarna kunt u inloggen met uw e-mailadres en wachtwoord.
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full">Terug naar homepagina</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
    </PublicShell>
  );
}
