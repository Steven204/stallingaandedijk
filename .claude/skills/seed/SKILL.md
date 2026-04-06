---
name: seed
description: Database seeden met testdata
---

Seed de database met testdata:

1. Run `npx tsx prisma/seed.ts`
2. Toon de aangemaakte testaccounts:
   - Admin: admin@stallingaandedijk.nl / admin123
   - Medewerker: medewerker@stallingaandedijk.nl / medewerker123
   - Klant: klant@voorbeeld.nl / klant123
3. Bevestig dat 30 stallingslocaties zijn aangemaakt (A01-C10)

Let op: Dit wist eerst ALLE bestaande data voordat het nieuwe testdata aanmaakt.
