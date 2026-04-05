import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-xl font-medium mb-2">Pagina niet gevonden</h2>
        <p className="text-muted-foreground mb-6">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Naar homepagina</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Inloggen</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
