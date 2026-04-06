import { PublicShell } from "@/components/public/public-shell";

export default function VoorwaardenPage() {
  return (
    <PublicShell>
    <div className="max-w-none space-y-6">
      <h1 className="lovable-heading text-3xl">Stallingsvoorwaarden</h1>
      <p className="lovable-text-muted">
        Caravanstalling Aandedijk - Gageldijk 204, 3566 MJ Utrecht
      </p>

      <h2 className="font-semibold text-lg mt-8">Artikel 1 - Gebruik en eigendom</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>
          De stallingsgebruiker maakt gebruik van een plaats in de stalling,
          welke door de stallingshouder wordt bepaald.
        </li>
        <li>
          Er is geen sprake van een vaste plaats. De stallingshouder is te allen
          tijde gerechtigd het object een andere plaats toe te wijzen.
        </li>
        <li>Onderverhuur is verboden.</li>
        <li>
          De beheerder kan voertuigen op het buitenterrein plaatsen (tot 1 week
          van tevoren in drukke periodes).
        </li>
      </ul>

      <h2 className="font-semibold text-lg mt-8">Artikel 2 - Betaling en huur</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>De huurperiode bedraagt 12 maanden.</li>
        <li>
          Betaling van de stallingshuur dient per vooruitbetaling plaats te
          vinden.
        </li>
        <li>
          Het eerste jaar geschiedt de betaling contant; daarna binnen 1 week na
          factuurdatum.
        </li>
        <li>
          Bij betalingsachterstand kunnen voertuigen niet worden opgehaald.
        </li>
        <li>
          De huurprijs kan te allen tijde worden aangepast.
        </li>
      </ul>

      <h2 className="font-semibold text-lg mt-8">Artikel 3 - Ophalen en brengen</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>
          De stallingsgebruiker dient zich minstens 4 dagen van tevoren aan te
          melden via de website.
        </li>
        <li>
          Ophalen en brengen geschiedt in overleg met de beheerder, 7 dagen per
          week.
        </li>
        <li>
          Plaatsen en ophalen geschiedt uitsluitend door of onder toezicht van
          de beheerder.
        </li>
        <li>
          Tijdens de winterperiode (half november tot half maart) kunnen
          voertuigen niet worden opgehaald.
        </li>
      </ul>

      <h2 className="font-semibold text-lg mt-8">Artikel 4 - Verantwoordelijkheden</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>Gasflessen moeten worden verwijderd.</li>
        <li>
          De stallingshouder is nimmer aansprakelijk voor schade aan het
          gestalde object, tenzij deze schade het gevolg is van opzet of grove
          nalatigheid van de stallingshouder.
        </li>
        <li>Restitutie van stallingsgeld is niet mogelijk.</li>
      </ul>

      <h2 className="font-semibold text-lg mt-8">Artikel 5 - Opzegging</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>
          Opzegging dient minstens een maand voor het einde van de lopende
          contractduur te geschieden.
        </li>
        <li>Beide partijen kunnen het contract opzeggen.</li>
        <li>
          Bij niet-opzegging wordt het contract automatisch verlengd voor
          dezelfde periode.
        </li>
      </ul>

      <h2 className="font-semibold text-lg mt-8">Artikel 6 - Overig</h2>
      <ul className="list-disc pl-6 space-y-1 lovable-text-muted">
        <li>
          Op deze voorwaarden is het Nederlands recht van toepassing.
        </li>
        <li>
          In gevallen waarin deze voorwaarden niet voorzien, beslist de
          stallingshouder.
        </li>
      </ul>
    </div>
    </PublicShell>
  );
}
