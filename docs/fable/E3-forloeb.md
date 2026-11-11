# E3: Skabelonen for et forløb

*Skrevet 11. november 2026 efter jeres go til E3. Hører til [E1-eftersyn.md](E1-eftersyn.md), anbefaling nr. 1. Opus bygger klodsen ud fra denne fil. Drejebogen til Liv står i [E3-liv-drejebog.md](E3-liv-drejebog.md). Hvor der står "forslag", må Opus vælge en anden løsning, hvis koden taler for det. Reglerne må kun ændres med jeres go.*

## Hvad et forløb er
Et forløb fører brugeren gennem **én idé** på 3-5 minutter. Man gør noget i hvert trin og får én sætning om, hvad man lige så. Bagefter åbner laboratoriet, og man leger frit.

Et forløb er **ikke** en rundvisning i knapperne (det er guiden i dag), ikke en film, man ser på, og ikke en prøve, man kan dumpe.

## Kernesætningen
Hvert forløb starter med én sætning: *"Efter forløbet kan brugeren sige: …"*. Den skrives først og står til sidst i forløbet. **Udvælgelsen sker med ét spørgsmål:** Kan brugeren sige kernesætningen uden denne ting? Hvis ja, hører tingen til i "Hvorfor?", "For nørder" eller laboratoriet, ikke i forløbet.

## Et trin har fem felter
| Felt | Hvad | Grænse |
|---|---|---|
| **Spørg** | Det, man skal undre sig over. Står øverst i forløbets linje | højst ca. 15 ord |
| **Gæt** (valgfrit) | To eller tre svar at trykke på, før man prøver. Ingen svar er "dumme", og alle må gerne vise sig at være rigtige | mindst to trin pr. forløb har et gæt |
| **Gør** | Én handling i scenen. Trinet går videre, når den er gjort | præcis én |
| **Så** | Sætningen bagefter: hvad du lige så | højst ca. 20 ord |
| **Ord** | De nye fagord i trinet, hver med ordforklaring | højst to |

## Reglerne
1. **3-6 trin, højst fem minutter.** Er der mere at sige, bliver det to forløb.
2. **Én ny idé pr. trin.**
3. **Højst to sætninger på skærmen ad gangen** (Spørg før handlingen, Så efter).
4. **Man gør noget i hvert trin.** At se på en animation tæller højst én gang pr. forløb.
5. **Man kan ikke fejle.** En forkert handling giver et vink, ikke rødt. Efter ca. 20 sekunder uden noget tilbydes "Vis mig".
6. **Tal kun, når de kan sammenlignes med noget kendt.** Ingen enheder som µm, nm, eV og MeV.
7. **Teksten handler om idéen, ikke om knapperne.** "Tryk på ⏩" er ikke et trin.
8. **Kun det, trinet bruger, er fremme.** Panelerne er skjult. Den ene knap eller det ene sted, man skal bruge, er lyst op.
9. **Man kan gå tilbage, springe over og tage forløbet igen.**
10. **Det sidste trin er "Det så du"**: kernesætningen og højst tre veje videre (næste forløb, leg frit, og én ting dybere).

## Sådan ser det ud
- **Mens forløbet kører:** kun scenen og **forløbets linje** nederst (prikker for trinene, Spørg eller Så, gættets knapper, "‹" og "Næste ›" og et lille "Spring over"). Linjen er den samme som underteksten med prikker i Tid og flybyen i dag. Panelerne, "Næste skridt", opgaverne, klokken og tidsknappen er skjult.
- **Første gang i en del** starter forløbet af sig selv. Senere findes det under en knap "Forløb" i delen, med ✓ ved dem, man har taget.
- **Efter forløbet** åbner panelerne, og opgaverne hedder "Udfordringer".
- **På højkant og telefon** står linjen under scenen. Den må ikke dække det, man skal trykke på.
- **Hvert forløb har sit eget link** (fx til en lærer). Åbnes linket, starter forløbet, også selvom man har taget det.

## Det, der findes, og hvad der sker med det
| I dag | Fremover |
|---|---|
| Guidebobler (`js/guide.js`) i Stjerneovnen, Reaktoren og Batteriet | Ringen om et mål genbruges til "kun det, trinet bruger". Guiderne laves om til forløb, én del ad gangen |
| "Næste skridt" med "Vis mig" (`js/lag.js:211`) | Skjult under forløbet. "Vis mig" genbruges som hjælp i et trin. Bagefter som i dag |
| Opgaver med stjerner | "Udfordringer" efter forløbet. Et forløb giver sin egen ✓ i "Din fremgang" |
| Undertekst med prikker (`js/beskeder.js`), scenerne i Tid og flybyen | Bliver forløbets linje. Tid og flybyen flyttes over senere, ikke nu |
| Skjul panelerne (`js/paneler.js`) | Bruges af forløbet. **Liv står ikke i `SKÆRME` i dag** og skal med |

## Forslag til opbygningen (til Opus)
- **Teksterne som data uden Three.js** (`js/data/forloeb/<del>.js`), så de kan testes i Node og oversættes senere: `{ id, titel, kernesætning, trin: [{ id, spørg, gæt: { valg, efter }, gør, så, ord }] }`.
- **Delen leverer det, der rører scenen,** pr. trin-id: `start()` (sæt scenen op, og skjul resten), `mål` (det, der lyses op), `færdig()` (er handlingen gjort?) og `visMig()`.
- **Klodsen** (`js/forloeb.js`) står for linjen, prikkerne, gættet, frem og tilbage, "Spring over", at skjule panelerne, at huske hvor langt man er, og linket. Nye gemte data skrives i `docs/kode/gemte-data.md`.
- **Tests (5-8 tjek):** starter første gang og ikke anden gang, "Spring over", hvert trins handling gennem testadgangen, panelerne er skjult imens, kernesætningen står til sidst, og linket åbner forløbet.

## Skemaet til en drejebog
Fyld det ud, før noget bygges. Det er dette, I siger go til.
1. **Kernesætningen.**
2. **Trinene** med de fem felter, og hvad scenen viser i hvert trin.
3. **Det, der er valgt fra,** og hvor det bor i stedet (lag 2, lag 3 eller laboratoriet).
4. **Ordene:** en liste over alle fagord i forløbet. Flere end ca. otte er for mange.
5. **Prøven:** de tre spørgsmål, barnet skal kunne svare på bagefter.
6. **Fakta:** hvad der er nyt og skal faktatjekkes.

## Prøven med et barn
Ti minutter, uden hjælp. Sig ikke noget undervejs. Bagefter: *Hvad gjorde du først? Hvor gik du i stå? Hvad handlede det om?* Og spørgsmålene fra drejebogens punkt 5. Kan barnet ikke sige kernesætningen med egne ord, er det forløbet, der skal rettes, ikke barnet.

## De fejl, jeg så i Liv, Tid og Molekyler
- Mekanismen får navn, før idéen er forstået (RNA-polymerase før "tre bogstaver er ét ord").
- To billeder, man skal sammenligne på samme tid, og kontakter med tre stillinger.
- Rigtige data i fuld størrelse (444 bogstaver, 147 aminosyrer), før man har set tre.
- Et trin, hvor man kun kan trykke "Næste".
- Tre steder at læse på én gang: underteksten, panelet og mærkaterne i scenen.

## Eksempel: "Dit første atom" (Værkstedet)
*Kernesætning: "Et atom har en kerne med protoner og neutroner og elektroner udenom. Antallet af protoner bestemmer, hvilket grundstof det er."*
| Trin | Spørg | Gør | Så | Ord |
|---|---|---|---|---|
| 1 | Alt, du kan røre ved, er bygget af atomer. Lad os bygge det mindste. | Læg én proton i midten | Det er kernen. Den er plusladet. | proton, kerne |
| 2 | *Gæt:* Hvad mangler, før det er et helt atom? (en proton mere / en elektron) | Giv den en elektron | Plus trækker i minus. Nu har du hydrogen, det mest almindelige grundstof i universet. | elektron, grundstof |
| 3 | *Gæt:* Hvad sker der, hvis du lægger en proton mere i kernen? (det bliver et nyt grundstof / kernen går i stykker) | Læg en proton mere i | Begge dele. To protoner er helium, men de skubber hinanden væk, for de er begge plus. | – |
| 4 | Kernen mangler noget, der kan holde den sammen. | Læg to neutroner i, og giv atomet en elektron mere | Nu holder kernen. Neutronerne er limen. Du har bygget helium. | neutron |
| 5 | **Det så du:** kernesætningen. | Tryk på et af de lysende felter i det lille periodiske system | Du har opdaget to af 118. Resten kan du bygge selv. | – |

Valgt fra: isotoper, henfald, skaller, elektronsky, ioner og fanerne. De kommer som udfordringer og i senere forløb. Opus tjekker, at Værkstedet opfører sig sådan i trin 3 (udfordringen "Prøv to protoner uden neutroner" findes i dag), og at begge grundstoffer tæller som opdaget efter trin 4.
