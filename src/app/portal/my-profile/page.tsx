export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/portal/profile-form";

export default async function MyProfilePage() {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mijn gegevens</h2>
      <Card>
        <CardHeader>
          <CardTitle>Profiel bewerken</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
