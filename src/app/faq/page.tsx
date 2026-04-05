import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicShell } from "@/components/public/public-shell";

const faqItems = [
  {
    question: "Wat voor soort stalling is het?",
    answer:
      "De stalling is een kas, lichtdicht gemaakt door middel van een kunststof scherm dat eventuele glasschade voorkomt. De vloer bestaat uit een stofvrije en vloeistofdichte vloer.",
  },
  {
    question: "Hoe vindt de betaling plaats?",
    answer:
      "Het eerste jaar geschiedt de betaling vooruit en contant, de daaropvolgende jaren moet de betaling 1 week na factuurdatum worden voldaan.",
  },
  {
    question: "Wanneer kan ik mijn caravan/camper ophalen?",
    answer:
      "U kunt uw voertuig ophalen of brengen op uw gewenste moment, bij voorkeur met vier dagen vooraf overleg. U kunt online een ophaal- of wegbrengafspraak inplannen via het klantportaal.",
  },
  {
    question: "Welke voertuigen kunnen gestald worden?",
    answer:
      "Er is plaats voor caravans, campers, oldtimers, boten en auto's.",
  },
  {
    question: "Is het terrein beveiligd?",
    answer:
      "Ja, het terrein is zeer goed beveiligd met een verharde vloer en lichtbescherming.",
  },
  {
    question: "Wat wordt er gedaan bij het klaarmaken van mijn voertuig?",
    answer:
      "Uw voertuig wordt rijklaar gemaakt: de accu wordt geladen en de banden worden op druk gebracht. Bij een caravan helpen we u ook bij het koppelen.",
  },
  {
    question: "Kan mijn auto gestald worden tijdens vakantie?",
    answer:
      "Ja, uw auto kan droog en veilig worden gestald tijdens uw afwezigheid.",
  },
  {
    question: "Is de stalling in de winter geopend?",
    answer:
      "De stalling is gesloten voor ophalen tijdens de winterperiode van half november tot half maart. Wegbrengen is wel mogelijk.",
  },
  {
    question: "Kan onderhoud worden verzorgd?",
    answer:
      "Ja, wij kunnen onderhoud en APK van uw caravan en/of camper verzorgen als u dat wenst.",
  },
  {
    question: "Waar is de stalling gevestigd?",
    answer:
      "Stalling aan de Dijk is gevestigd op een toplocatie bij de afritten van de A2 en A27, aan de rand van Utrecht. Adres: Gageldijk 204, 3566 MJ Utrecht.",
  },
];

export default function FaqPage() {
  return (
    <PublicShell>
      <h1 className="text-3xl font-bold mb-2">Veelgestelde vragen</h1>
      <p className="text-muted-foreground mb-6">
        Hieronder vindt u antwoorden op veelgestelde vragen over onze stalling.
      </p>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicShell>
  );
}
