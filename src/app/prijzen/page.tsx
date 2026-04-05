export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

const vehicleTypeIcons: Record<string, string> = {
  CARAVAN: "🏕️",
  CAMPER: "🚐",
  BOAT: "⛵",
  OLDTIMER: "🚗",
  CAR: "🚘",
};

export default async function PrijzenPage() {
  // Get latest price per vehicle type
  const allPrices = await prisma.priceConfig.findMany({
    orderBy: { effectiveFrom: "desc" },
  });

  const latestPrices = new Map<string, typeof allPrices[number]>();
  for (const price of allPrices) {
    if (!latestPrices.has(price.vehicleType)) {
      latestPrices.set(price.vehicleType, price);
    }
  }

  const prices = Array.from(latestPrices.values());

  return (
    <PublicShell>
      <h1 className="text-3xl font-bold mb-2">Prijzen 2026</h1>
      <p className="text-muted-foreground mb-6">
        Alle prijzen zijn per strekkende meter per jaar, inclusief BTW.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Stallingsprijzen</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type voertuig</TableHead>
                <TableHead className="text-right">Prijs per strekkende meter / jaar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price: typeof prices[number]) => (
                <TableRow key={price.id}>
                  <TableCell className="text-lg">
                    {vehicleTypeIcons[price.vehicleType]}{" "}
                    {vehicleTypeLabels[price.vehicleType]}
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold">
                    &euro; {price.pricePerMeter.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inclusief</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>Beveiligd en verhard terrein</li>
              <li>Lichtbescherming (kas)</li>
              <li>Voertuig rijklaar maken (accu laden, banden oppompen)</li>
              <li>Hulp bij koppelen caravan</li>
              <li>7 dagen per week ophalen en wegbrengen</li>
              <li>Auto stallen tijdens uw vakantie</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekenvoorbeeld</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Caravan van 7 meter:</strong>
            </p>
            <p>7m x &euro; 55,00 = <strong>&euro; 385,00 per jaar</strong></p>
            <p className="text-muted-foreground mt-4">
              <strong>Camper van 6,5 meter:</strong>
            </p>
            <p>6,5m x &euro; 70,00 = <strong>&euro; 455,00 per jaar</strong></p>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
