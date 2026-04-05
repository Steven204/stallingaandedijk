# Testscenario's - Stalling aan de Dijk Beheersysteem

## Epic 1: Klantbeheer

### TS-1.1: Nieuwe klant registreren
**User Story:** Als beheerder wil ik nieuwe klanten kunnen registreren
**Precondities:** Ingelogd als admin (`admin@stallingaandedijk.nl`)
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Dashboard > Klanten | Klantenoverzicht wordt getoond |
| 2 | Klik op "Nieuwe klant" | Formulier wordt getoond |
| 3 | Vul in: Naam="Test Klant", Email="test@test.nl", Telefoon="06 11111111", Adres="Teststraat 1", Postcode="1234 AB", Plaats="Utrecht" | Velden worden ingevuld |
| 4 | Laat wachtwoord leeg | Standaard wachtwoord "welkom123" wordt gebruikt |
| 5 | Klik "Klant aanmaken" | Redirect naar klantenoverzicht, nieuwe klant is zichtbaar |
| 6 | Log uit en log in als test@test.nl / welkom123 | Klant kan inloggen en komt in klantportaal |

**Negatief scenario:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Probeer klant aan te maken met bestaand e-mailadres | Foutmelding: e-mail bestaat al |
| 2 | Laat verplichte velden leeg (naam, e-mail) | Formulier validatie voorkomt verzending |

---

### TS-1.2: Klantgegevens bewerken en verwijderen
**User Story:** Als beheerder wil ik klantgegevens kunnen bewerken en verwijderen
**Precondities:** Ingelogd als admin, minstens 1 klant aanwezig
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Klanten > klik op klantnaam | Klantdetailpagina met bewerkformulier |
| 2 | Wijzig naam naar "Gewijzigde Naam" | Veld wordt aangepast |
| 3 | Klik "Opslaan" | Redirect naar overzicht, naam is gewijzigd |
| 4 | Ga terug naar klantdetail | Gewijzigde gegevens worden getoond |
| 5 | Klik "Verwijderen" | Bevestigingsdialoog verschijnt |
| 6 | Bevestig verwijdering | Klant is verwijderd uit overzicht |

---

### TS-1.3: Klantenoverzicht met zoek- en filterfunctie
**User Story:** Als beheerder wil ik een overzicht van alle klanten kunnen zien
**Precondities:** Ingelogd als admin, meerdere klanten aanwezig
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Dashboard > Klanten | Tabel met alle klanten wordt getoond |
| 2 | Controleer kolommen | Naam, E-mail, Telefoon, Plaats, Voertuigen (aantal), Contracten (aantal) zichtbaar |
| 3 | Controleer sortering | Klanten zijn alfabetisch gesorteerd op naam |

---

### TS-1.4: Klant bekijkt eigen gegevens
**User Story:** Als klant wil ik online mijn gegevens kunnen inzien
**Precondities:** Ingelogd als klant (`klant@voorbeeld.nl`)
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Log in als klant | Redirect naar klantportaal |
| 2 | Klik op "Mijn gegevens" | Profielpagina met huidige gegevens |
| 3 | Wijzig telefoon naar "06 99999999" | Veld wordt aangepast |
| 4 | Klik "Opslaan" | Melding "Gegevens opgeslagen!" verschijnt |
| 5 | Herlaad pagina | Gewijzigd telefoonnummer wordt getoond |
| 6 | Vul nieuw wachtwoord in "nieuwww123" | Veld wordt ingevuld |
| 7 | Klik "Opslaan", log uit, log in met nieuw wachtwoord | Login succesvol met nieuw wachtwoord |

---

## Epic 2: Voertuigbeheer

### TS-2.1: Voertuig registreren
**User Story:** Als beheerder wil ik voertuigen kunnen registreren
**Precondities:** Ingelogd als admin, minstens 1 klant aanwezig
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Voertuigen > "Nieuw voertuig" | Formulier wordt getoond |
| 2 | Selecteer klant "Piet de Vries" | Klant geselecteerd |
| 3 | Selecteer type "Camper" | Type geselecteerd |
| 4 | Vul kenteken "EF-456-GH" in | Kenteken ingevuld |
| 5 | Vul merk "Volkswagen", model "California", lengte "6.0" in | Gegevens ingevuld |
| 6 | Klik "Voertuig registreren" | Redirect naar overzicht, voertuig is zichtbaar |

**Negatief scenario:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Probeer voertuig met bestaand kenteken "AB-123-CD" | Foutmelding: kenteken bestaat al |
| 2 | Vul lengte "0" of negatief in | Validatiefout |

---

### TS-2.2: Stallingsplaats vastleggen
**User Story:** Als beheerder wil ik de stallingsplaats van een voertuig kunnen vastleggen
**Precondities:** Voertuig en locaties bestaan
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Gebruik check-in flow (zie TS-9.3/9.4/9.5) om voertuig te plaatsen | Voertuig wordt gekoppeld aan locatie |
| 2 | Ga naar Voertuigen overzicht | Kolom "Locatie" toont de toegewezen plek (bijv. A01) |
| 3 | Ga naar Locaties overzicht | Plek is rood (bezet) met kenteken en klantnaam |

---

### TS-2.3: Voertuigstatus bekijken
**User Story:** Als beheerder wil ik de status van een voertuig kunnen zien
**Precondities:** Voertuigen met verschillende statussen
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Voertuigen overzicht | Statuskolom toont badges: "Gestald", "Opgehaald", "Onderweg" |
| 2 | Filter op status | Juiste voertuigen worden getoond per status |

---

### TS-2.4: Voertuigenoverzicht met filters
**User Story:** Als beheerder wil ik een overzicht van alle gestalde voertuigen
**Precondities:** Meerdere voertuigen aanwezig
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Voertuigen | Tabel met kolommen: Kenteken, Type, Merk/Model, Eigenaar, Lengte, Locatie, Status |
| 2 | Controleer dat alle voertuigen zichtbaar zijn | Lijst is compleet |
| 3 | Klik op kenteken | Navigeert naar voertuigdetailpagina |

---

## Epic 3: Ophalen & Wegbrengen (Afspraken)

### TS-3.1: Klant plant ophaalafspraak online
**User Story:** Als klant wil ik online een ophaalafspraak kunnen inplannen
**Precondities:** Ingelogd als klant, minstens 1 voertuig geregistreerd
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Afspraken in klantportaal | Afsprakenpagina met formulier en lijst |
| 2 | Selecteer voertuig "AB-123-CD" | Voertuig geselecteerd |
| 3 | Selecteer type "Ophalen" | Type geselecteerd |
| 4 | Kies datum 5+ dagen in de toekomst | Datum ingevuld |
| 5 | Vul notitie in "Graag voor 10:00" | Notitie ingevuld |
| 6 | Klik "Afspraak aanvragen" | Afspraak verschijnt in lijst met status "Aangevraagd" |

**Negatief scenario:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Kies datum minder dan 4 dagen in de toekomst | Datumveld blokkeert selectie (min-attribuut) |

---

### TS-3.2: Klant plant wegbrengafspraak online
**User Story:** Als klant wil ik online een wegbrengafspraak kunnen inplannen
**Precondities:** Ingelogd als klant
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Afspraken in klantportaal | Formulier wordt getoond |
| 2 | Selecteer voertuig, type "Wegbrengen", datum 5+ dagen vooruit | Gegevens ingevuld |
| 3 | Klik "Afspraak aanvragen" | Afspraak verschijnt met status "Aangevraagd" |

---

### TS-3.3: Beheerder bekijkt afsprakenplanning
**User Story:** Als beheerder wil ik een agenda/planning zien van afspraken
**Precondities:** Ingelogd als admin, afspraken bestaan
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Dashboard > Afspraken | Tabel met alle afspraken gesorteerd op datum |
| 2 | Controleer kolommen | Datum, Type, Klant, Kenteken, Status, Notities, Acties zichtbaar |
| 3 | Controleer dashboard | "Open afspraken" teller klopt |

---

### TS-3.4: Beheerder bevestigt/weigert afspraak
**User Story:** Als beheerder wil ik afspraken kunnen bevestigen, weigeren of verplaatsen
**Precondities:** Afspraak met status "Aangevraagd" bestaat
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Afspraken | Afspraak zichtbaar met vinkje en kruisje knoppen |
| 2 | Klik op vinkje (bevestigen) | Status wijzigt naar "Bevestigd", afrond-knop verschijnt |
| 3 | Klik op afrond-knop | Status wijzigt naar "Afgerond", geen knoppen meer |

**Weiger-scenario:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Bij een aangevraagde afspraak, klik kruisje | Status wijzigt naar "Afgewezen", geen knoppen meer |

---

### TS-3.5: Beheerder ontvangt notificatie bij nieuwe afspraak
**User Story:** Als beheerder wil ik een notificatie ontvangen bij nieuwe afspraken
**Precondities:** -
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Klant maakt een afspraak aan | Dashboard toont verhoogde "Open afspraken" teller |
| 2 | Beheerder opent Afspraken | Nieuwe afspraak is zichtbaar bovenaan |

> **Opmerking:** E-mail notificaties zijn nog niet geimplementeerd. Momenteel via dashboard teller.

---

### TS-3.6: Voertuig klaargemaakt registreren
**User Story:** Als beheerder wil ik bij ophalen kunnen registreren dat het voertuig klaargemaakt is
**Precondities:** Bevestigde ophaalafspraak
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Afspraken, zoek bevestigde ophaalafspraak | Afspraak zichtbaar met afrond-knop |
| 2 | Klik afrond-knop | Status wijzigt naar "Afgerond" |

> **Opmerking:** Gedetailleerde checklist (accu, banden) is nog niet geimplementeerd als apart veld.

---

## Epic 4: Contracten & Facturatie

### TS-4.1: Stallingscontract aanmaken
**User Story:** Als beheerder wil ik stallingscontracten kunnen aanmaken
**Precondities:** Ingelogd als admin, klant met voertuig en prijsconfiguratie bestaan
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Contracten > "Nieuw contract" | Formulier wordt getoond |
| 2 | Selecteer klant "Piet de Vries" | Voertuigen van klant worden getoond |
| 3 | Selecteer voertuig "AB-123-CD (7.5m)" | Prijsberekening verschijnt |
| 4 | Controleer berekening | Prijs/meter: €55.00, Lengte: 7.5m, Totaal: €412.50 |
| 5 | Vul startdatum in | Einddatum = startdatum + 1 jaar (automatisch) |
| 6 | Selecteer auto-verlenging "Ja" | Optie geselecteerd |
| 7 | Klik "Contract aanmaken" | Redirect naar overzicht, contract zichtbaar met status "Actief" |
| 8 | Ga naar Facturen | Automatisch aangemaakte factuur zichtbaar (€412.50, vervaldatum = startdatum + 7 dagen) |

---

### TS-4.2: Facturen genereren
**User Story:** Als beheerder wil ik facturen kunnen genereren
**Precondities:** Contract bestaat
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Maak een nieuw contract aan (zie TS-4.1) | Factuur wordt automatisch gegenereerd |
| 2 | Ga naar Facturen | Factuur zichtbaar met: Klant, Kenteken, Bedrag, Vervaldatum, Status "Openstaand" |

---

### TS-4.3: Betalingen registreren
**User Story:** Als beheerder wil ik betalingen kunnen registreren
**Precondities:** Openstaande factuur bestaat
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Facturen | Openstaande factuur zichtbaar |
| 2 | Klik op vinkje (betaald markeren) | Status wijzigt naar "Betaald", betaaldatum wordt ingevuld |
| 3 | Controleer dat betaald-knop verdwijnt | Geen acties meer bij betaalde factuur |

---

### TS-4.4: Waarschuwing bij betalingsachterstand
**User Story:** Als beheerder wil ik een waarschuwing bij betalingsachterstand
**Precondities:** Openstaande factuur voorbij vervaldatum
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Facturen, zoek openstaande factuur | Factuur zichtbaar |
| 2 | Klik op driehoek-icoon (achterstallig markeren) | Status wijzigt naar "Achterstallig" met rode badge |

---

### TS-4.5: Automatische contractverlenging
**User Story:** Als beheerder wil ik contracten automatisch laten verlengen
**Precondities:** Contract met auto-verlenging
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Contracten | Contract toont "Auto-verlenging: Ja" |

> **Opmerking:** Automatische verlenging bij afloopdatum is nog niet als achtergrondtaak geimplementeerd. Momenteel handmatig.

---

### TS-4.6: Verschillende tarieven per voertuigtype
**User Story:** Als beheerder wil ik verschillende tarieven per voertuigtype instellen
**Precondities:** Ingelogd als admin
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Instellingen | Prijstabel zichtbaar: Caravan €55, Camper €70, Boot €55, Oldtimer €70, Auto €70 |
| 2 | Voeg nieuwe prijs toe: type "Camper", prijs €75.00 | Nieuwe regel verschijnt in tabel |
| 3 | Maak nieuw contract voor camper | Berekening gebruikt de nieuwste prijs (€75.00) |

---

## Epic 5: Seizoens- & Terreinbeheer

### TS-5.1: Winterperiode configureren
**User Story:** Als beheerder wil ik de winterperiode kunnen configureren
**Precondities:** Ingelogd als admin
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Instellingen | Seizoenen sectie toont "Winterperiode: 15/11 t/m 15/3, Gesloten voor ophalen" |
| 2 | Klik "Seizoen toevoegen" | Dialoog verschijnt |
| 3 | Vul "Zomerperiode", 15/3 t/m 15/11, "Open voor ophalen" in | Gegevens ingevuld |
| 4 | Klik "Opslaan" | Nieuw seizoen verschijnt in lijst |

---

### TS-5.2: Capaciteit terrein beheren
**User Story:** Als beheerder wil ik de capaciteit van het terrein beheren
**Precondities:** Ingelogd als admin
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Locaties | Visueel overzicht met groene (vrij) en rode (bezet) plekken |
| 2 | Controleer dashboard | "Bezetting" toont bijv. "1/30" |
| 3 | Klik "Locaties toevoegen" | Dialoog voor bulk-aanmaken |
| 4 | Vul sectie "D", prefix "D", aantal 5, type "Buiten" in | Gegevens ingevuld |
| 5 | Klik "Aanmaken" | 5 nieuwe plekken D01-D05 verschijnen in sectie D |

---

### TS-5.3: Binnen vs. buiten terrein
**User Story:** Als beheerder wil ik kunnen zien welke voertuigen binnen/buiten staan
**Precondities:** Locaties met binnen en buiten plekken
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Locaties | Elke plek toont badge "Binnen" of "Buiten" |
| 2 | Sectie A en B tonen "Binnen" | Klopt met seed data |
| 3 | Sectie C toont "Buiten" | Klopt met seed data (buitenterrein) |

---

## Epic 6: Communicatie

### TS-6.1 t/m TS-6.3: E-mail communicatie
> **Status:** Nog niet geimplementeerd. E-mail functionaliteit (berichten versturen, bevestigingsmails, herinneringen) is gepland als toekomstige uitbreiding.

---

## Epic 7: Klantportaal

### TS-7.1: Prijzen inzien
**User Story:** Als bezoeker wil ik prijzen kunnen inzien
> **Status:** Prijzen zijn momenteel alleen zichtbaar in het beheerdersdashboard (Instellingen). Publieke prijspagina is nog niet gebouwd.

---

### TS-7.2: Online aanmelden als nieuwe klant
**User Story:** Als bezoeker wil ik me online kunnen aanmelden
> **Status:** Nog niet geimplementeerd. Klanten worden momenteel door de beheerder aangemaakt.

---

### TS-7.3: FAQ en stallingsvoorwaarden
**User Story:** Als bezoeker wil ik de FAQ en stallingsvoorwaarden kunnen lezen
> **Status:** Nog niet geimplementeerd als pagina's. Dit betreft content-pagina's.

---

### TS-7.4: Klant inloggen en gegevens bekijken
**User Story:** Als klant wil ik kunnen inloggen om mijn afspraken, facturen en voertuiggegevens te bekijken
**Precondities:** Klantaccount bestaat
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar /login | Loginpagina wordt getoond |
| 2 | Log in als klant@voorbeeld.nl / klant123 | Redirect naar klantportaal (/portal) |
| 3 | Klik "Mijn voertuigen" | Overzicht met voertuig AB-123-CD, status, locatie en eventueel foto |
| 4 | Klik "Afspraken" | Overzicht eigen afspraken + formulier voor nieuwe afspraak |
| 5 | Klik "Facturen" | Overzicht eigen facturen met status |
| 6 | Klik "Mijn gegevens" | Profielpagina met bewerkbare gegevens |

---

## Epic 8: Onderhoud & Extra diensten

### TS-8.1 en TS-8.2: Onderhoudsverzoeken
> **Status:** Nog niet geimplementeerd. Onderhoudsregistratie per voertuig is gepland als toekomstige uitbreiding.

---

## Epic 9: QR-code Locatiebeheer & Foto-registratie

### TS-9.1: Stallingslocaties aanmaken
**User Story:** Als beheerder wil ik stallingslocaties kunnen aanmaken
**Precondities:** Ingelogd als admin
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Locaties | Bestaande locaties A01-C10 worden getoond |
| 2 | Klik "Locaties toevoegen" | Dialoog opent |
| 3 | Vul in: Sectie="D", Prefix="D", Aantal=5, Type="Buiten" | Gegevens ingevuld |
| 4 | Klik "Aanmaken" | 5 plekken D01-D05 verschijnen in nieuwe sectie D |

---

### TS-9.2: QR-code genereren en printen
**User Story:** Als beheerder wil ik per locatie een QR-code kunnen genereren en printen
**Precondities:** Ingelogd als admin/medewerker, locaties bestaan
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar QR Codes | Grid met alle locaties per sectie |
| 2 | Klik op "A01" | Dialoog opent met QR-code afbeelding |
| 3 | Controleer QR-code | URL bevat /checkin?loc=A01 |
| 4 | Klik "Printen" | Printvenster opent met QR-code, locatiecode en label |
| 5 | Sluit dialoog, klik op andere locatie | Nieuwe QR-code wordt gegenereerd |

---

### TS-9.3: QR-code scannen
**User Story:** Als medewerker wil ik een QR-code kunnen scannen waardoor de locatie automatisch wordt ingevuld
**Precondities:** QR-code geprint en opgehangen bij plek A01
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Scan QR-code met telefoon camera | Browser opent /checkin?loc=A01 |
| 2 | Controleer pagina | Locatie "A01" is automatisch ingevuld en getoond |
| 3 | Titel toont "Voertuig Inchecken" | Pagina is mobiel-vriendelijk |

**Zonder QR-code:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar /checkin zonder loc parameter | Foutmelding: "Geen locatie opgegeven. Scan een QR-code." |

---

### TS-9.4: Kenteken invoeren na scan
**User Story:** Als medewerker wil ik na het scannen het kenteken kunnen invoeren
**Precondities:** Check-in pagina geopend via QR-code
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Vul kenteken "AB-123-CD" in | Kenteken wordt getoond in hoofdletters |
| 2 | Kenteken wordt automatisch naar uppercase omgezet | Correct |

**Negatief scenario:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Vul onbekend kenteken "ZZ-999-ZZ" in, maak foto, klik inchecken | Foutmelding: "Voertuig met dit kenteken niet gevonden" |

---

### TS-9.5: Foto maken en uploaden bij check-in
**User Story:** Als medewerker wil ik een foto kunnen maken en uploaden
**Precondities:** Check-in pagina geopend, kenteken ingevuld
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Klik "Camera" knop | Telefoon camera opent |
| 2 | Maak foto van voertuig | Preview van foto wordt getoond |
| 3 | Optioneel: klik "Opnieuw" | Foto wordt gewist, camera knoppen verschijnen weer |
| 4 | Klik "Inchecken" | Laadstatus "Bezig met opslaan..." |
| 5 | Wacht op resultaat | Succesmelding: "Voertuig ingecheckt!" met kenteken en locatie |
| 6 | Klik "Nog een voertuig inchecken" | Formulier wordt gereset |

**Alternatief: foto uploaden:**
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Klik "Uploaden" knop | Bestandskiezer opent |
| 2 | Selecteer foto uit galerij | Preview wordt getoond |

> **Let op:** Foto-upload vereist geconfigureerde Supabase Storage. Zonder configuratie verschijnt een serverfout.

---

### TS-9.6: Fotohistorie per voertuig
**User Story:** Als beheerder wil ik per voertuig de fotohistorie kunnen inzien
**Precondities:** Voertuig met minstens 1 foto
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Voertuigen > klik op kenteken | Voertuigdetailpagina |
| 2 | Bekijk "Foto's" sectie | Grid met foto's, elk met locatiecode en datum |
| 3 | Meest recente foto's staan bovenaan | Correcte sortering |

---

### TS-9.7: Plattegrond/overzicht locaties
**User Story:** Als beheerder wil ik een plattegrond van alle locaties kunnen zien
**Precondities:** Ingelogd als admin/medewerker
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar Locaties | Visueel grid per sectie |
| 2 | Vrije plekken zijn groen met groene rand | Klopt |
| 3 | Bezette plekken zijn rood met kenteken en klantnaam | Klopt |
| 4 | Elke plek toont badge "Binnen" of "Buiten" | Klopt |
| 5 | Legenda is zichtbaar bovenaan | Groen=Vrij, Rood=Bezet, Binnen/Buiten badges |

---

### TS-9.8: Klant bekijkt instelfoto
**User Story:** Als klant wil ik de instelfoto van mijn voertuig kunnen bekijken
**Precondities:** Ingelogd als klant, voertuig met foto
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Ga naar "Mijn voertuigen" in klantportaal | Voertuigkaarten worden getoond |
| 2 | Kaart toont locatiecode (bijv. "A01") | Klant weet waar voertuig staat |
| 3 | Meest recente foto wordt getoond op de kaart | Foto zichtbaar met datum en locatie |

---

## Rolgebaseerde toegangscontrole

### TS-ROL-1: Admin heeft volledige toegang
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Log in als admin | Sidebar toont: Dashboard, Klanten, Voertuigen, Locaties, Afspraken, Contracten, Facturen, QR Codes, Instellingen |
| 2 | Bezoek alle pagina's | Alle pagina's zijn toegankelijk |

### TS-ROL-2: Medewerker heeft beperkte toegang
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Log in als medewerker | Sidebar toont: Dashboard, Voertuigen, Locaties, Afspraken, QR Codes |
| 2 | Probeer /dashboard/customers te bezoeken | Redirect naar /dashboard (geen toegang) |
| 3 | Probeer /dashboard/contracts te bezoeken | Redirect naar /dashboard |
| 4 | Probeer /dashboard/invoices te bezoeken | Redirect naar /dashboard |
| 5 | Probeer /dashboard/settings te bezoeken | Redirect naar /dashboard |

### TS-ROL-3: Klant heeft alleen toegang tot portaal
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Log in als klant | Redirect naar /portal |
| 2 | Probeer /dashboard te bezoeken | Redirect naar /portal |
| 3 | Navigatie toont: Mijn voertuigen, Afspraken, Facturen, Mijn gegevens | Correct |

### TS-ROL-4: Niet-ingelogde gebruiker
| Stap | Actie | Verwacht resultaat |
|------|-------|-------------------|
| 1 | Bezoek /dashboard | Redirect naar /login |
| 2 | Bezoek /portal | Redirect naar /login |
| 3 | Bezoek /checkin?loc=A01 | Pagina is toegankelijk (publiek) |
| 4 | Bezoek /login | Loginpagina wordt getoond |

---

## Samenvatting implementatiestatus

| Epic | Geimplementeerd | Nog te doen |
|------|----------------|-------------|
| 1. Klantbeheer | CRUD + profielbeheer klant | - |
| 2. Voertuigbeheer | CRUD + foto's + locatiekoppeling | - |
| 3. Afspraken | Aanvragen + bevestigen/weigeren/afronden | E-mail notificaties, winterperiode blokkering in formulier |
| 4. Contracten & Facturatie | Contracten + auto-factuur + betaalstatus | Automatische verlenging (cron), PDF facturen |
| 5. Seizoensbeheer | Configuratie + locatiebeheer | Winterblokkering in afspraakformulier |
| 6. Communicatie | - | E-mail berichten, bevestigingsmails, herinneringen |
| 7. Klantportaal | Inloggen + voertuigen + afspraken + facturen + profiel | Publieke prijspagina, online registratie, FAQ/voorwaarden |
| 8. Onderhoud | - | Onderhoudsverzoeken per voertuig |
| 9. QR & Foto's | QR generatie + check-in pagina + foto upload + plattegrond | Supabase Storage configuratie |
