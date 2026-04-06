---
name: db
description: Prisma database operaties (push, generate, studio)
---

Database management skill. Gebruik als volgt:

- `/db push` — Push schema naar Supabase: `npx prisma db push`
- `/db generate` — Regenereer client: `npx prisma generate && echo 'export * from "./client";' > src/generated/prisma/index.ts`
- `/db studio` — Open Prisma Studio: `npx prisma studio`
- `/db seed` — Seed data laden: `npx tsx prisma/seed.ts`
- `/db status` — Toon of schema in sync is

Na elke schema wijziging:
1. Run `npx prisma db push` (gebruikt DIRECT_URL voor Supabase)
2. Run `npx prisma generate`
3. Maak index.ts aan: `echo 'export * from "./client";' > src/generated/prisma/index.ts`

Belangrijk: Prisma v7 met `prisma-client` generator vereist het index.ts bestand.
