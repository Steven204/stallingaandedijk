@AGENTS.md

# Stalling aan de Dijk - Beheersysteem

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Prisma v7 met `prisma-client` generator + `@prisma/adapter-pg`
- PostgreSQL via Supabase (connection pooling op poort 6543, direct op 5432)
- NextAuth v5 beta (credentials provider, JWT sessions)
- shadcn/ui v4 met @base-ui/react (GEEN `asChild` prop, gebruik `render` prop)
- Tailwind CSS v4
- TypeScript strict mode

## Belangrijke gotchas
- **Prisma generate**: Na `prisma generate` ALTIJD `echo 'export * from "./client";' > src/generated/prisma/index.ts` draaien
- **Next.js 16**: `middleware.ts` is deprecated, gebruik `proxy.ts` met `export function proxy()`
- **shadcn/ui v4**: Geen `asChild` op Button/DialogTrigger/etc. Gebruik `render` prop
- **Database migratie**: Gebruik `npx prisma db push` (niet `migrate`), want Supabase pooler vereist DIRECT_URL

## Project structuur
- `src/app/` - Pages (dashboard, portal, publiek, checkin)
- `src/app/actions/` - Server actions
- `src/app/api/` - API routes (auth, checkin, photos, qr, locations)
- `src/components/` - UI componenten (dashboard, forms, portal, public, qr, ui)
- `src/lib/` - Utilities (auth, prisma, storage, email, seasons)
- `prisma/` - Schema + seed

## Gebruikersrollen
- ADMIN: Volledige toegang
- EMPLOYEE: Operationeel (inchecken, locaties, voertuigen, afspraken, onderhoud, QR)
- CUSTOMER: Klantportaal (voertuigen, afspraken, facturen, profiel)

## Deployment
- Vercel: automatisch bij push naar main
- URL: https://stallingaandedijk.vercel.app
- Database: Supabase (EU-central-1)
