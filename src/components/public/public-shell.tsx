import Link from "next/link";
import { AuthButton } from "@/components/public/auth-button";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="lovable min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#f7f4ed", borderColor: "#eceae4" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: "#1c1c1c" }}>
            Stalling aan de Dijk
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Link href="/prijzen" className="lovable-btn-ghost hidden sm:inline-flex">
              Prijzen
            </Link>
            <Link href="/faq" className="lovable-btn-ghost hidden sm:inline-flex">
              FAQ
            </Link>
            <Link href="/voorwaarden" className="lovable-btn-ghost hidden sm:inline-flex">
              Voorwaarden
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
        {children}
      </main>

      <footer style={{ borderColor: "#eceae4" }} className="border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="font-semibold text-base mb-3" style={{ color: "#1c1c1c" }}>
                Stalling aan de Dijk
              </p>
              <p className="lovable-text-muted text-sm">
                Veilige stalling voor caravans, campers, boten en oldtimers bij de afritten van de A2 en A27.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "#1c1c1c" }}>Contact</p>
              <div className="space-y-1 text-sm lovable-text-muted">
                <p>Gageldijk 204</p>
                <p>3566 MJ Utrecht</p>
                <p>Tel: 06 51 60 54 67</p>
                <p>stallingaandedijk@gmail.com</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "#1c1c1c" }}>Navigatie</p>
              <div className="space-y-1 text-sm">
                <p><Link href="/prijzen" className="lovable-text-muted hover:underline">Prijzen</Link></p>
                <p><Link href="/aanmelden" className="lovable-text-muted hover:underline">Aanmelden</Link></p>
                <p><Link href="/faq" className="lovable-text-muted hover:underline">FAQ</Link></p>
                <p><Link href="/voorwaarden" className="lovable-text-muted hover:underline">Voorwaarden</Link></p>
              </div>
            </div>
          </div>
          <div className="lovable-divider border-t mt-8 pt-6 text-center">
            <p className="text-xs lovable-text-muted">
              &copy; 2026 Stalling aan de Dijk. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
