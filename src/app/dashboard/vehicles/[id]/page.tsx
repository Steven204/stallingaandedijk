export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/forms/vehicle-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true } },
      photos: {
        orderBy: { takenAt: "desc" },
        take: 10,
        include: {
          location: true,
          takenBy: { select: { name: true } },
        },
      },
      placements: {
        orderBy: { placedAt: "desc" },
        take: 5,
        include: { location: true },
      },
    },
  });

  if (!vehicle) notFound();

  const customers =
    session.user.role === "ADMIN"
      ? await prisma.user.findMany({
          where: { role: "CUSTOMER" },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [{ id: vehicle.customer.id, name: vehicle.customer.name }];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Voertuig: {vehicle.licensePlate}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {session.user.role === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle>Gegevens bewerken</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleForm vehicle={vehicle} customers={customers} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Foto&apos;s ({vehicle.photos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.photos.length === 0 ? (
              <p className="text-muted-foreground">Nog geen foto&apos;s</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {vehicle.photos.map((photo: typeof vehicle.photos[number]) => (
                  <div key={photo.id} className="relative aspect-video rounded-md overflow-hidden border">
                    <Image
                      src={photo.photoUrl}
                      alt={`Foto bij ${photo.location.code}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                      {photo.location.code} - {photo.takenAt.toLocaleDateString("nl-NL")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
