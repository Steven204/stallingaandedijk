---
name: check-env
description: Controleer of alle environment variables correct zijn ingesteld
---

Controleer de volgende environment variables:

1. Lees het `.env` bestand (NIET afdrukken van wachtwoorden/secrets)
2. Check of deze variabelen aanwezig zijn:
   - `DATABASE_URL` (moet beginnen met `postgresql://`)
   - `DIRECT_URL` (moet beginnen met `postgresql://`, poort 5432)
   - `NEXT_PUBLIC_SUPABASE_URL` (moet beginnen met `https://`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (moet aanwezig zijn)
   - `SUPABASE_SERVICE_ROLE_KEY` (moet aanwezig zijn)
   - `NEXTAUTH_SECRET` (moet aanwezig zijn)
   - `NEXTAUTH_URL` (optioneel op Vercel)
   - `NEXT_PUBLIC_APP_URL` (optioneel)
3. Test database connectie: `npx prisma db pull --print 2>&1 | head -3`
4. Rapporteer welke variabelen ontbreken of fout zijn
