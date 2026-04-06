export const revalidate = 300; // Cache 5 minuten
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCodeGrid } from "@/components/qr/qr-code-grid";

export default async function QrCodesPage() {
  await getSession();

  const locations = await prisma.storageLocation.findMany({
    orderBy: { code: "asc" },
    select: { id: true, code: true, label: true, section: true },
  });

  const sections: string[] = [...new Set(locations.map((l: typeof locations[number]) => l.section ?? "Overig"))];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">QR Codes</h1>
      <p className="text-muted-foreground mb-6">
        Genereer en print QR-codes voor stallingslocaties. Medewerkers scannen deze
        codes met hun telefoon om voertuigen in te checken met een foto.
      </p>

      {sections.map((section: string) => (
        <Card key={section} className="mb-6">
          <CardHeader>
            <CardTitle>Sectie {section}</CardTitle>
          </CardHeader>
          <CardContent>
            <QrCodeGrid
              locations={locations.filter(
                (l: typeof locations[number]) => (l.section ?? "Overig") === section
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
