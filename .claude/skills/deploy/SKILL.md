---
name: deploy
description: Type check, commit en push naar Vercel
---

Voer de volgende stappen uit om te deployen:

1. **Type check**: Run `npx tsc --noEmit` - stop als er fouten zijn en fix ze
2. **Prisma generate**: Run `npx prisma generate && echo 'export * from "./client";' > src/generated/prisma/index.ts`
3. **Git status**: Toon gewijzigde bestanden
4. **Commit**: Maak een commit met een beschrijvende Nederlandse commit message
5. **Push**: Push naar origin main
6. **Bevestig**: Meld dat Vercel automatisch bouwt en geef de URL: https://stallingaandedijk.vercel.app
