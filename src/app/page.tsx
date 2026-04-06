export const revalidate = 60; // Cache 1 minuut

import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Clock,
  Wrench,
  Car,
  CaravanIcon,
  Sailboat,
  CarFront,
} from "lucide-react";

export default async function HomePage() {
  const [vehicleCount, locationCount] = await Promise.all([
    prisma.vehicle.count({ where: { status: "STORED" } }),
    prisma.storageLocation.count(),
  ]);

  const features = [
    {
      icon: Shield,
      title: "Beveiligd terrein",
      description:
        "Goed beveiligd terrein met verharde vloer en lichtbescherming in onze kas.",
    },
    {
      icon: MapPin,
      title: "Toplocatie",
      description:
        "Gelegen bij de afritten van de A2 en A27, aan de rand van Utrecht.",
    },
    {
      icon: Clock,
      title: "7 dagen per week",
      description:
        "Ophalen en wegbrengen op uw gewenste moment, in overleg met de beheerder.",
    },
    {
      icon: Wrench,
      title: "Voertuig rijklaar",
      description:
        "Wij maken uw voertuig rijklaar: accu laden, banden oppompen en hulp bij koppelen.",
    },
  ];

  const vehicleTypes = [
    { icon: CaravanIcon, label: "Caravans" },
    { icon: Car, label: "Campers" },
    { icon: Sailboat, label: "Boten" },
    { icon: CarFront, label: "Oldtimers & Auto's" },
  ];

  return (
    <PublicShell>
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Uw voertuig veilig gestald
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Stalling aan de Dijk biedt veilige en betaalbare stallingsplek voor
          caravans, campers, boten en oldtimers bij de afritten van de A2 en A27
          in Utrecht.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/aanmelden">
            <Button size="lg" className="text-base px-8">
              Aanmelden
            </Button>
          </Link>
          <Link href="/prijzen">
            <Button variant="outline" size="lg" className="text-base px-8">
              Bekijk prijzen
            </Button>
          </Link>
        </div>
      </section>

      {/* Voertuigtypes */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vehicleTypes.map((type) => (
            <div
              key={type.label}
              className="flex flex-col items-center gap-2 rounded-xl border bg-white p-6 text-center"
            >
              <type.icon className="h-10 w-10 text-primary" />
              <span className="font-medium">{type.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Waarom Stalling aan de Dijk?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-3xl font-bold">{locationCount}</p>
            <p className="text-sm text-muted-foreground">Stallingsplekken</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-3xl font-bold">7/7</p>
            <p className="text-sm text-muted-foreground">Dagen bereikbaar</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-3xl font-bold">A2/A27</p>
            <p className="text-sm text-muted-foreground">Direct aan de afrit</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Stallingsplek nodig?
            </h2>
            <p className="mb-6 opacity-90">
              Meld u vandaag nog aan en wij zorgen voor een veilige plek voor uw
              voertuig.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/aanmelden">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-base px-8"
                >
                  Nu aanmelden
                </Button>
              </Link>
              <Link href="/faq">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Veelgestelde vragen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Locatie */}
      <section className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Locatie</h2>
        <p className="text-muted-foreground mb-1">
          Gageldijk 204, 3566 MJ Utrecht
        </p>
        <p className="text-muted-foreground mb-1">
          Tel: 06 51 60 54 67
        </p>
        <p className="text-muted-foreground">
          Email: stallingaandedijk@gmail.com
        </p>
      </section>
    </PublicShell>
  );
}
