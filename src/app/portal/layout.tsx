import { getSession } from "@/lib/auth-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Car, CalendarDays, Receipt, UserCog } from "lucide-react";
import { PortalLogout } from "@/components/portal/portal-logout";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold">Stalling aan de Dijk</h1>
            <p className="text-xs text-muted-foreground">
              Welkom, {session.user.name}
            </p>
          </div>
          <PortalLogout />
        </div>
        <nav className="max-w-4xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
          <Link href="/portal">
            <Button variant="ghost" size="sm">
              <Home className="mr-1 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/portal/my-vehicles">
            <Button variant="ghost" size="sm">
              <Car className="mr-1 h-4 w-4" />
              Mijn voertuigen
            </Button>
          </Link>
          <Link href="/portal/my-appointments">
            <Button variant="ghost" size="sm">
              <CalendarDays className="mr-1 h-4 w-4" />
              Afspraken
            </Button>
          </Link>
          <Link href="/portal/my-invoices">
            <Button variant="ghost" size="sm">
              <Receipt className="mr-1 h-4 w-4" />
              Facturen
            </Button>
          </Link>
          <Link href="/portal/my-profile">
            <Button variant="ghost" size="sm">
              <UserCog className="mr-1 h-4 w-4" />
              Mijn gegevens
            </Button>
          </Link>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
