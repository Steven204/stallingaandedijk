import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/public/auth-button";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="font-bold text-lg">
            Stalling aan de Dijk
          </Link>
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            <Link href="/prijzen">
              <Button variant="ghost" size="sm">Prijzen</Button>
            </Link>
            <Link href="/faq">
              <Button variant="ghost" size="sm">FAQ</Button>
            </Link>
            <Link href="/voorwaarden">
              <Button variant="ghost" size="sm">Voorwaarden</Button>
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 flex-1 w-full">{children}</main>
      <footer className="border-t bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Stalling aan de Dijk</p>
              <p>Gageldijk 204, 3566 MJ Utrecht</p>
              <p>Tel: 06 51 60 54 67</p>
              <p>Email: stallingaandedijk@gmail.com</p>
            </div>
            <div>
              <p>Bij de afritten van de A2 en A27</p>
              <p>7 dagen per week bereikbaar</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
