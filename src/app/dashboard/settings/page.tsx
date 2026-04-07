export const revalidate = 300; // Cache 5 minuten
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceForm } from "@/components/forms/price-form";
import { SeasonForm } from "@/components/forms/season-form";

const vehicleTypeLabels: Record<string, string> = {
  CARAVAN: "Caravan",
  CAMPER: "Camper",
  BOAT: "Boot",
  OLDTIMER: "Oldtimer",
  CAR: "Auto",
};

export default async function SettingsPage() {
  await requireRole("ADMIN");

  const [prices, seasons] = await Promise.all([
    prisma.priceConfig.findMany({ orderBy: { vehicleType: "asc" } }),
    prisma.seasonConfig.findMany(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Instellingen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Prijzen per strekkende meter (per jaar)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type voertuig</TableHead>
                <TableHead>Prijs / meter</TableHead>
                <TableHead>Geldig vanaf</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price: typeof prices[number]) => (
                <TableRow key={price.id}>
                  <TableCell>{vehicleTypeLabels[price.vehicleType]}</TableCell>
                  <TableCell>&euro; {price.pricePerMeter.toFixed(2)}</TableCell>
                  <TableCell>
                    {price.effectiveFrom.toLocaleDateString("nl-NL")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <PriceForm />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seizoenen</CardTitle>
        </CardHeader>
        <CardContent>
          {seasons.map((season: typeof seasons[number]) => (
            <div key={season.id} className="mb-4 p-4 border rounded-lg">
              <h3 className="font-medium">{season.name}</h3>
              <p className="text-sm text-muted-foreground">
                {season.startDay}/{season.startMonth} t/m {season.endDay}/{season.endMonth}
              </p>
              <p className="text-sm">
                {season.isClosedForPickup
                  ? "Gesloten voor ophalen"
                  : "Open voor ophalen"}
              </p>
            </div>
          ))}
          <SeasonForm />
        </CardContent>
      </Card>
    </div>
  );
}
