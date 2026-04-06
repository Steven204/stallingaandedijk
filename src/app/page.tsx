export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/public/public-shell";
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
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  const locationCount = await prisma.storageLocation.count();

  const features = [
    {
      icon: Shield,
      title: "Beveiligd terrein",
      description: "Goed beveiligd terrein met verharde vloer en lichtbescherming in onze kas.",
    },
    {
      icon: MapPin,
      title: "Toplocatie",
      description: "Gelegen bij de afritten van de A2 en A27, aan de rand van Utrecht.",
    },
    {
      icon: Clock,
      title: "7 dagen per week",
      description: "Ophalen en wegbrengen op uw gewenste moment, in overleg met de beheerder.",
    },
    {
      icon: Wrench,
      title: "Voertuig rijklaar",
      description: "Wij maken uw voertuig rijklaar: accu laden, banden oppompen en hulp bij koppelen.",
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
      <section className="text-center py-8 sm:py-16">
        <h1
          className="lovable-heading text-4xl sm:text-5xl md:text-6xl mb-6"
          style={{ letterSpacing: "-1.5px" }}
        >
          Uw voertuig veilig gestald
        </h1>
        <p className="text-lg lovable-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Stalling aan de Dijk biedt veilige en betaalbare stallingsplek voor
          caravans, campers, boten en oldtimers bij de afritten van de A2 en A27
          in Utrecht.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/aanmelden" className="lovable-btn-primary text-base px-8 py-3 inline-flex items-center justify-center gap-2">
            Aanmelden
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/prijzen" className="lovable-btn-ghost text-base px-8 py-3 inline-flex items-center justify-center">
            Bekijk prijzen
          </Link>
        </div>
      </section>

      {/* Vehicle types */}
      <section className="py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vehicleTypes.map((type) => (
            <div
              key={type.label}
              className="lovable-card flex flex-col items-center gap-3 p-6 text-center"
            >
              <type.icon className="h-10 w-10" style={{ color: "#1c1c1c", opacity: 0.7 }} />
              <span className="font-medium text-sm">{type.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-10">
        <h2 className="lovable-heading text-3xl sm:text-4xl text-center mb-10" style={{ letterSpacing: "-1.2px" }}>
          Waarom Stalling aan de Dijk?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="lovable-card p-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(28, 28, 28, 0.04)" }}
                >
                  <feature.icon className="h-5 w-5" style={{ color: "#1c1c1c" }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm lovable-text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-10">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: `${locationCount}`, label: "Stallingsplekken" },
            { value: "7/7", label: "Dagen bereikbaar" },
            { value: "A2/A27", label: "Direct aan de afrit" },
          ].map((stat) => (
            <div key={stat.label} className="lovable-card p-6">
              <p className="lovable-heading text-3xl mb-1" style={{ letterSpacing: "-1.2px" }}>{stat.value}</p>
              <p className="text-sm lovable-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center"
          style={{ backgroundColor: "#1c1c1c", color: "#fcfbf8" }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ letterSpacing: "-0.9px" }}>
            Stallingsplek nodig?
          </h2>
          <p className="mb-8 opacity-80 max-w-lg mx-auto">
            Meld u vandaag nog aan en wij zorgen voor een veilige plek voor uw voertuig.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/aanmelden"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md text-base font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#f7f4ed", color: "#1c1c1c" }}
            >
              Nu aanmelden
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-base font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(252, 251, 248, 0.3)", color: "#fcfbf8" }}
            >
              Veelgestelde vragen
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
