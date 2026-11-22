# Plan: "Er elektronen to steder på én gang?" (Kvantefysik)

*Skrevet 22. november 2026 af Opus (xhigh) efter jeres ønske 21. november 2026: "Ja, det skal med. Lad os få det med snart. Tænk også gerne over andre ting, der kan hjælpe med forståelsen her. Det må gerne koste lidt. Det skal være en fed sektion." Brugeren sov, så **valgene er taget af sessionen og kan ændres af jer**. Læst før planen: [drejebogen](drejebog-kvantefysik.md) (afsnit 1-3, 5-7 og jeres svar), [E7-noterne](fable/E7-kvantefysik-noter.md), [kode/kvante.md](kode/kvante.md), [faktagrundlaget](fakta-kvantefysik.md) (afsnit 1, 6-8), fælderne og [stilguiden](stilguide.md).*

## Målet
Jeres søn skal kunne sige forskellen på to ting, der ofte blandes sammen:
- **Superposition** (målt, men kun indirekte): Bølgen går gennem begge sprækker. Det ser man på striberne, som kræver begge veje.
- **"Fundet to steder"** (aldrig målt): Hver gang man kigger, finder man én hel elektron ét sted. Måler man vejen, forsvinder striberne.

**Delens kernesætning er uændret:** "En elektron breder sig som en bølge, men bliver altid fundet ét sted som en hel partikel. Bølgen bestemmer chancen for hvor." Det nye viser netop den sætning. Turens kernesætning er også uændret.

## Idéerne: pris og gevinst
| | Idé | Pris | Gevinst | Valg |
|---|---|---|---|---|
| a | "Hvorfor?"-kortet "Er elektronen så to steder på én gang?" | lille (data og faktatjek) | stor: siger det rigtige svar med ord og forsøg | **PR 1** |
| c | "Vis bølgen" viser hver elektrons bølge gå gennem begge sprækker, bagvæggen lyser i striber (chancen), og så tændes én prik | mellem (shaderen får en bølgepakke) | stor: *billedet* af kernesætningen, bølgen og prikken på samme tid | **PR 1** |
| d | Tælleren ved måleren: "Venstre · Højre · Begge på én gang: 0" | lille | stor: et tal, der aldrig bliver mere end 0 | **PR 1** |
| f | Trin 6 i turen, "Bølgen og prikken" (6 trin er inden for skabelonens 3-6) | lille til mellem | stor: alle får det, ikke kun den, der leger | **PR 1** |
| g (ny) | Et tredje gæt i trin 5: "En hel ved begge på én gang" | meget lille | stor: det var netop jeres forventning | **PR 1** |
| h (ny) | Ordet "superposition" i Ordbogen, skrevet ud fra fælden (passer også til qubits i forløb 4) | lille | mellem: ordet, han møder i videoer, får den rigtige betydning | **PR 1** |
| b | Skyderen "Målerens lys" (Feynmans tankeforsøg): Svagt lys ser kun nogle af elektronerne. Dem, måleren så, giver ingen striber, de andre gør, og striberne toner gradvist ud | mellem | mellem til stor: noget man selv finder (stilguiden C3) | **PR 2** |
| e | Schrödingers kat som tegnet kort | mellem (en tegning) | lille, og en tegning af en kat, der er "både levende og død", lærer netop det forkerte billede | **Ikke bygget.** Katten står allerede i Gåde-kortets "For nørder", og én linje kommer i det nye kort |
| – | En egen tur "To steder?" | mellem (fremgang, test, tur-liste) | som trin 6, men længere vej | Ikke bygget: trin 6 gør det samme |
| – | Kvanteviskelæder og forsinket valg | stor | lille her | Ikke med (drejebogen afsnit 5) |

## PR 1: "Bølgen og prikken" (valgt af sessionen) ✅ lavet 22. november 2026
1. **Trin 5** får et tredje gæt, "En hel ved begge på én gang" (svar: "Nej. Lamperne blinker aldrig begge på én gang."), og Så siger "… ved én sprække, aldrig ved begge."
2. **Tælleren** står i scenen over væggen, når måleren er tændt: "Venstre 503 · Højre 497" og under den "Begge på én gang: 0". I lab og i trin 5.
3. **"Vis bølgen"** (under "Flere indstillinger") viser nu en bølgepakke for hver elektron: Den går fra kilden, gennem begge sprækker og breder sig. Når den når bagvæggen, lyser væggen i striber (der, hvor chancen er stor), og én prik tændes. (Bygget sådan: Lyset toner ud, og prikken glimter lidt efter, så den ene prik ses tydeligt.) Holdes "Skyd" nede, vises bølgen for én elektron ad gangen. At slå "Vis bølgen" til skyder én elektron, så man ser det med det samme. Med måler er "Vis bølgen" stadig slået fra (hvad der sker med bølgen ved en måling, er fortolkning).
4. **Trin 6 "Bølgen og prikken":** Spørg: "Nu kan du se elektronens bølge. Hvad finder bagvæggen, når bølgen når frem?" Gæt: "En udtværet elektron" / "Én hel prik ét sted" / "To prikker, én fra hver sprække". Gør: "Skyd én elektron ad gangen." (3 elektroner). Så: "Bølgen går gennem begge sprækker og breder sig ud. Men elektronen bliver fundet ét sted, oftest hvor bølgen er stærk."
5. **Kortet `kvanteToSteder`:** Svaret: Det siges tit, men ingen har fundet en elektron to steder. Det, der går gennem begge, er bølgen, og den ses kun på striberne. Fysikerne kalder det en superposition. Forsøget fra 1986 (Grangier, Roger og Aspect): én foton ad gangen, to målere, og de giver (næsten) aldrig udslag samtidig, men de samme fotoner giver striber. "For nørder": Wineland og Haroche (Nobelprisen 2012), atomer i to "stykker" ca. 54 cm fra hinanden (Kasevich' hold, Nature 2015), og Schrödinger 1935. Om elektronen "er" begge steder, før man kigger, er fortolkning (Gåde-kortet). "Og hvorfor det?" går til `kvanteKigger`.
6. **Hvor kortet står:** først i højre panel (4 spørgsmål, budgettet er højst fire) og som vej efter turen i stedet for "Ved elektronen, at vi kigger?" (som nås fra det nye kort).
7. **"Ærligt talt":** bølgepakken er en tegning af chancen, ikke noget, man kan se, og man viser kun én bølge ad gangen. "Begge på én gang: 0": I rigtige forsøg sker det en sjælden gang, fordi kilden af og til sender to, eller en måler tæller forkert.
8. **Prøvespørgsmålene** i drejebogen afsnit 7 (forløb 1) får et fjerde: "Er elektronen to steder på én gang? Hvad har man målt, og hvad har man aldrig målt?"

## PR 2: "Målerens lys" (valgt af sessionen)
- En skyder under "Flere indstillinger" (venstre panel har allerede fem valg fremme): "Målerens lys", svagt til stærkt, standard stærkt. Den virker kun, når måleren er tændt.
- Hver elektron bliver set med en chance, der følger skyderen. Bliver den set, blinker én lampe, og den lander som uden striber. Ellers lander den med striber. Prikkerne, måleren så, får lampens farve, så man kan se de to mønstre hver for sig. Tælleren får "Ikke set: n".
- Kilden er Feynmans forelæsninger (bind III, kapitel 1, "Watching the electrons"), som et tankeforsøg. Det siges i "Ærligt talt".

## Faktatjek
Alle navne, årstal og tal tjekkes mod primærkilderne og skrives i [fakta-kvantefysik/faktatjek-to-steder.md](fakta-kvantefysik/faktatjek-to-steder.md) (lavet af Opus xhigh i stedet for Fable).
