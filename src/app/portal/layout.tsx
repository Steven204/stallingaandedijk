import { getSession } from "@/lib/auth-utils";
import Link from "next/link";
import { Home, Car, CalendarDays, Receipt, UserCog } from "lucide-react";
import { PortalLogout } from "@/components/portal/portal-logout";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/portal/my-vehicles", icon: Car, label: "Mijn voertuigen" },
  { href: "/portal/my-appointments", icon: CalendarDays, label: "Afspraken" },
  { href: "/portal/my-invoices", icon: Receipt, label: "Facturen" },
  { href: "/portal/my-profile", icon: UserCog, label: "Mijn gegevens" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f4ed" }}>
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#f7f4ed", borderBottom: "1px solid #eceae4" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/portal">
            <h1 className="font-semibold tracking-tight hover:opacity-75 transition-opacity" style={{ color: "#1c1c1c" }}>
              Stalling aan de Dijk
            </h1>
            <p className="text-xs" style={{ color: "#5f5f5d" }}>
              Welkom, {session.user.name}
            </p>
          </Link>
          <PortalLogout />
        </div>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 pb-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-opacity hover:opacity-75"
              style={{ color: "#1c1c1c" }}
            >
              <item.icon className="h-4 w-4" style={{ color: "#5f5f5d" }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
