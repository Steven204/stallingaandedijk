import Link from "next/link";

export default function NotFound() {
  return (
    <div className="lovable min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold mb-4" style={{ color: "rgba(28, 28, 28, 0.2)" }}>404</h1>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1c1c1c" }}>Pagina niet gevonden</h2>
        <p className="lovable-text-muted mb-8">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="lovable-btn-primary">Naar homepagina</Link>
          <Link href="/login" className="lovable-btn-ghost">Inloggen</Link>
        </div>
      </div>
    </div>
  );
}
