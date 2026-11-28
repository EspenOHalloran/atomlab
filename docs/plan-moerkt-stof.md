# Plan: Mørkt stof i Kosmos og oversigten "Mørkt, anti og ukendt"

*Køreplanen nr. 8. Skrevet 28. november 2026 af Opus (effort high) i sporet Solsystemet og Kosmos, startet af orkestratoren. Kun dokumenter, intet er bygget. **Bygningen venter på jeres go efter prøven med jeres søn.** Faktagrundlaget er [fakta-moerkt-anti-ukendt.md](fakta-moerkt-anti-ukendt.md), og **jeres svar 28. november 2026 var A til alle fire** (filens "Jeres svar"). Teksterne herunder er udkast, der er tjekket mod faktagrundlaget (afsnit "Faktatjek" nederst). Hver session tjekker "Tjek igen" før sine tekster.*

## Kernesætning og wow
- **Efter fem minutter kan brugeren sige:** "Det meste af universet kan vi ikke se. Vi ved, at det er der, fordi det trækker i galakserne og bøjer lyset."
- **Det første wow er:** Man slår "Kun det synlige trækker" til, og galaksen flyver fra hinanden (findes i gåden G4d).
- **Noget, man selv finder (C3):** Kontakten "Da universet var 380.000 år" i Styr-boksen bytter de 100 klodser om: Dengang var mørk energi næsten ingenting.
- **Pladsen:** Kosmos, gruppen Universet efter Big Bang ([plan-verdener.md](plan-verdener.md), allerede planlagt dér). Kosmos tæller så 15 fænomener.

## De tre dele og hvor de bor
| Del | Hvad | Hvor |
|---|---|---|
| (a) Kortet "Mørkt, anti og ukendt" | Et "Hvorfor?"-kort med tre begreber fremme med et mærke og en lukket foldeboks "Forveksles ofte med" | `js/data/hvorfor.js` (id `moerktAnti`) og den fælles klods `js/lag.js` |
| (b) "Ikke det samme som …" | Én linje i Ordbogen ved hvert af de syv begreber | `js/data/ordbog.js` (nyt felt `ikke`) og `js/ordbog.js` |
| (c) Fænomenet Mørkt stof | Tre steder: Galaksen, Lysbøjningen og "Hvad er universet lavet af?" (100 klodser), og en kort tur | `js/kosmos/moerktstof.js`, galaksen og lysbøjningen fra gåden i et fælles modul |

## (a) Kortet "Mørkt, anti og ukendt"
**Klodsen udvides, der laves ikke en ny** (Retningen: "Én udgave af hver klods"). Et "Hvorfor?"-kort kan i dag kun vise afsnit af tekst. Kortet får to valgfrie felter, som alle kort kan bruge:
- `rækker: [{ navn, mærke, tekst }]`: en kort liste under svaret. `mærke` er `'fundet'`, `'maalt'` eller `'ide'` og vises som tekst med en tegnet prik foran og **uden kant** (stilguiden A4: det, der kun oplyser, har ingen kant). Prikken skifter **form**, ikke farve (fyldt, halvt fyldt, tom og stiplet), så farveregel A7 holdes, og det kan ses af farveblinde.
- `forveksles: { titel, rækker }`: en lukket `<details>` i kortet, før "Vil du vide mere?", med samme slags rækker.

**Teksterne (udkast):**
- `spørgsmål`: "Mørkt stof, mørk energi og antistof: Hvad er forskellen?"
- `rækker` (står fremme, én sætning hver):
  - **Antistof** · *Fundet*: "Tvillinger til de almindelige partikler, som bliver til et glimt af stråling, når de møder stof."
  - **Mørkt stof** · *Virkningen er målt*: "Usynligt stof, der trækker i galakserne, men ingen ved, hvad det er."
  - **Mørk energi** · *Virkningen er målt*: "Noget ukendt, der får universet til at udvide sig hurtigere og hurtigere."
- `svar` (under rækkerne): "Mørkt stof trækker, og mørk energi skubber, men kun i det allerstørste. Antistof vejer og falder som almindeligt stof."
- `forveksles` ("Forveksles ofte med", lukket):
  - **Sort hul** · *Fundet*: "Også mørkt, og det trækker, men det er lavet af almindeligt stof."
  - **Neutrino** · *Fundet*: "En rigtig, næsten vægtløs partikel. Den er en lille smule af det mørke stof, men slet ikke det hele."
  - **Negativ masse** · *Kun en idé*: "Tænkt stof, der ville skubbe i stedet for at trække. Ingen har fundet det, og antistof er det ikke."
- `nørd`: "Fundet betyder, at man har set det eller fanget det. Virkningen er målt betyder, at man har målt, hvad det gør, på flere måder, der ikke afhænger af hinanden, men ikke, hvad det er. Kun en idé betyder, at det står i regnestykkerne, men aldrig er set. Sådan stod det i november 2026."
- `næste: 'opdaget'` ("Hvornår er noget opdaget?" findes): Det forklarer, hvornår noget tæller som fundet.

**Budget:** 5 sætninger fremme (3 rækker og 2 i svaret), Retningen siger 3-5 for et "Hvorfor?"-kort. Ingen nye fagord fremme: antistof, mørkt stof og mørk energi står i Ordbogen. Sort hul og negativ masse får et opslag (b), fordi de står i foldeboksen. Mørketid kommer ikke på kortet (jeres svar 1A).

**Hvor kortet kan åbnes fra** (det, køreplanen nævner, og intet nyt spørgsmål i et panel):
| Sted | Hvordan | Budget |
|---|---|---|
| Gåden "Hvad er mørkt stof?" | `hvorfor: 'moerktAnti'` på trin 1 ("Hvad ved vi?", har intet kort i dag) i `js/data/gaader.js` | uændret, trin 2 har stadig `opdaget` |
| Gåden "Hvor blev antistoffet af?" | `hvorfor: 'moerktAnti'` på trin 1 | uændret |
| Big Bang | `hvorfor: ['moerktAnti']` på emnet "Hvor blev antistoffet af?" i `js/kosmos/bigbang.js` | stadig fire spørgsmål |
| Hvid dværg | En knap `<button class="hvorfor" data-hvorfor="moerktAnti">` i nørd-afsnittet om mørk energi (`js/kosmos/hviddvaerg.js`) | intet nyt fremme |
| Ordbogen | `hvorfor: 'moerktAnti'` i `LINKS` for `antistof`, `moerktstof` og `moerkenergi` (`js/data/ordbogliste.js`, de to første beholder deres `gaa`) | |
| Fænomenet Mørkt stof | `hvorfor` på emnet "Hvad er universet lavet af?" og som vej efter turen | |

## (b) "Ikke det samme som …" i Ordbogen
Et nyt, valgfrit felt `ikke` i opslagene i `js/data/ordbog.js`. Det står **kun i Ordbogen** som en linje under forklaringen (med klassen `ordbog-ikke`), ikke i boblerne. Grunden: `antistof` er allerede ca. 250 tegn, og boblerne må højst have 260 (tjekliste B). `moerktstof` beholder sin sætning "Det er ikke det samme som mørk energi." i boblen, så det vigtigste stadig står dér. `ikke` er højst ca. 120 tegn.

| Opslag | `ikke` (udkast) |
|---|---|
| `antistof` | "Ikke det samme som negativ masse: Antistof vejer det samme som stof og falder nedad." |
| `moerktstof` | "Heller ikke det samme som sorte huller eller antistof." |
| `moerkenergi` | "Ikke det samme som mørkt stof: Mørkt stof trækker, mørk energi skubber." |
| `neutrino` | "Ikke det samme som mørkt stof: Neutrinoerne er en lille smule af det, men slet ikke det hele." |
| `moerketid` | "Har intet med mørkt stof eller mørk energi at gøre." |
| `sorthul` (nyt opslag) | tekst: "Et sted, hvor stof er presset så tæt sammen, at intet slipper ud, ikke engang lys." `ikke`: "Ikke det samme som mørkt stof: Sorte huller fra døde stjerner er lavet af almindeligt stof." |
| `negativmasse` (nyt opslag) | tekst: "Tænkt stof med »minus masse«, som ville skubbe til andre ting i stedet for at trække. Det bruges i nogle regnestykker om ormehuller, men ingen har fundet det." `ikke`: "Ikke det samme som antistof, som vejer det samme som stof og falder nedad." |

**Pas på med `sorthul`:** "sort hul" står i mange tekster (Kosmos, Gåderne, Rumtid). Et nyt opslag giver en prik første gang i hver tekst. Det er meningen (fagord forklares), men kør testene `ordforklaring`, `ordbog`, `sorthul`, `gaader` og `kosmos`, og se et par sider. `former`: `['sort hul', 'sorte hul', 'sorte huller']` uden "sorthul" i ét ord. Ordet `horisont` findes allerede og nævnes ikke i teksten.

## (c) Fænomenet Mørkt stof i Kosmos
**Genbrug, ikke en kopi (jeres svar 2A):** `lavGalakse` og `lavFelt` (og deres konstanter) flyttes uændret fra `js/gaader/moerktstof.js` til et nyt fælles modul `js/kosmos/galakse.js`, som både gåden og fænomenet importerer (som `skygge-sort.js`, der blev flyttet fra Sort hul til fælles brug 22. november 2026). Gåden er uændret, bortset fra importen og at `seDet` peger på `kosmos:moerktstof` ("Se det selv: Kosmos, Mørkt stof") i stedet for Rumtid. **Gåden beholder det, vi ikke ved** (LZ, Euclid og "Målt eller gæt?"), og Kosmos viser det, vi har målt. Gådens trin 1 viser stadig galaksen, men det er den samme klods med en kortere tekst.

**Opbygningen** (som "Hvorfor går tiden langsommere?": tre scener med `trin()` og "Næste ›" og steder med `gåTil`, så `gå('kosmos:moerktstof:universet')` virker):
| Trin | Sted (`gåTil`) | Scenen | Styring |
|---|---|---|---|
| 1 | `galakse` | Gådens galakse (1.100 stjerner på tablet, 2.000 på pc). Kameraet kan drejes | Kontakten "Kun det synlige trækker" i Styr-boksen |
| 2 | `lys` | Gådens felt af små galakser bagved og den usynlige klump, man trækker (kun en tynd ring om fingeren). Kameraet står lige på og drejes ikke | Træk i billedet (`pointerdown` med `capture`, `verden.styring.enabled = false` under trækket), og klumpen glider af sig selv, til man rører den (ikke med `ROLIG`) |
| 3 | `universet` | "Hvad er universet lavet af?": 100 klodser i en blok på 10 × 10 | Handlingen "Vis det usynlige" i bjælken, kontakten "Da universet var 380.000 år" i Styr-boksen |

**Trin 3, de 100 klodser** (jeres svar 3A og 4A):
- Først ses kun **5 lyse klodser** i en mørk, tom blok: det, vi kan se. "Vis det usynlige" tegner **27 mørke klodser, der kun ses som en kant** (`EdgesGeometry`), og **68 klodser af mørk energi** som et svagt, jævnt skær uden kant. Antistof er ingen klods, men et lille glimt, der kommer og forsvinder ved blokken (næsten 0).
- Én klods har en bitte prik af stjerner. Linjen siger: "Kun en lille bid af én klods er stjerner. Resten af det almindelige stof er mest tynd gas mellem galakserne." (Fælde 8: stjernerne er under en tiendedel af de 5 %.)
- En **tegnforklaring** i `overlag()` med de fire navne, de runde tal og **mærket** fra kortet (a) som samme CSS: Almindeligt stof *Fundet* ca. 5, Mørkt stof *Virkningen er målt* ca. 27, Mørk energi *Virkningen er målt* ca. 68, Antistof *Fundet* næsten 0.
- Et tryk på en klods skriver dens linje i "Lige nu" (`forklaring()`).
- Kontakten **"Da universet var 380.000 år"**: 63 mørkt stof, 15 lys, 12 atomer og 10 neutrinoer, og mørk energi næsten ingenting (WMAP 2008). Klodserne glider til deres nye plads (0,3 s, med det samme med `ROLIG`). Tegnforklaringen skifter. Lys og neutrinoer står kun dér, så de to ekstra navne ikke er fremme hele tiden.
- Tallene står i en datafil uden Three.js, `js/data/moerktstof.js` (`ANDELE_NU`, `ANDELE_380000`, `PLANCK_2018`), så testen kan regne på dem i Node. Summen af klodserne skal være 100 i begge.
- **Ydelse:** 100 klodser i et `InstancedMesh` pr. slags (3 net og én kant-geometri), bygget én gang. Intet regnes hvert billede, undtagen når de glider.

**Siden i højre panel (udkast, budgettet: højst to tal, tre sætninger, fire spørgsmål):**
- `navn` "Mørkt stof", `undertitel` "Det usynlige, der holder på galakserne", `ikon` 🌀 (A7: Kosmos' liste bruger emoji for alle fænomener i dag, bruddet står i stilguidens liste. Et tegnet ikon til listen er en sag for hele listen, ikke for dette fænomen).
- `tal`: ["Af alt i universet", "ca. 27 %"] og ["I forhold til almindeligt stof", "ca. 5 gange så meget"].
- `kort`: "Stjernerne yderst i galakserne kredser så hurtigt, at de burde flyve væk. Noget usynligt holder på dem, og det bøjer også lyset fra galakser bagved. Forskerne kalder det mørkt stof, men ingen ved, hvad det er."
- `emner` (fire):
  1. "Hvorfor flyver galakserne ikke fra hinanden?" (`kontakt: 'Kun det synlige trækker'`): "Stjernerne langt ude i Mælkevejen kredser ca. dobbelt så hurtigt, som det synlige stof kan forklare. Uden noget mere ville de flyve væk. Vera Rubin og Kent Ford målte i 1970, at stjernerne yderst i Andromeda kredser lige så hurtigt som dem tættere på midten."
  2. "Hvordan kan man se noget usynligt?": "Tyngdekraft bøjer lyset, ligesom Einstein regnede ud. Bag en tung klump bliver galakserne til buer og ringe. Ud fra buerne kan forskerne tegne et kort over, hvor det mørke stof er." (med `gå('kosmos:rumtid', 'Rumtid')`)
  3. "Hvad er universet lavet af?" (`hvorfor: ['moerktAnti']`): "Kun ca. 5 % er almindeligt stof, altså atomer som dem, du og stjernerne er lavet af. Ca. 27 % er mørkt stof, og ca. 68 % er mørk energi. Antistof er der næsten ikke noget af."
  4. "Kan tyngdeloven være forkert i stedet?": "Det tror et lille mindretal af forskerne. Deres idé passer godt med, hvordan enkelte galakser drejer. Men den har svært ved at forklare hobe af galakser og mønstret i lyset fra Big Bang, så næsten alle forskere tror på mørkt stof."
- `videre`: Gåden: Hvad er mørkt stof?, Big Bang, Rumtid.
- `nørd` (Vil du vide mere?): Planck 2018 (4,9 % almindeligt stof, 26,4 % mørkt stof og 68,5 % mørk energi, så "ca. 27" er Planck 2013's og NASA's runde tal, og forskellen ligger inden for usikkerheden), mørkt stof er ca. 5,4 gange så meget som almindeligt stof, Zwicky 1933, Bullet-hoben (Clowe m.fl. 2006), MOND (Milgrom 1983) og striden om dobbeltstjernerne (2023 og 2024, uden sigma-tal), og hvad animationen snyder med. "Sådan stod det i november 2026."
- `ærligt`: "Galaksen har kun få tusind stjerner, og den drejer millioner af gange hurtigere end en rigtig (en omgang tager ca. 225 millioner år). Armene er et mønster, stjernerne lyser op i. Den usynlige klump bøjer lyset meget mere end en rigtig. Mørkt stof og mørk energi er tegnet som klodser, så man kan se dem. I virkeligheden er de usynlige, og mørk energi fylder hele rummet jævnt."

**Turen "Det usynlige, der trækker"** (Forløb-klodsen, `js/data/forloeb/moerktstof.js`, `fænomen: 'moerktstof'`, tre trin, højst fem minutter):
| Trin | Spørg | Gæt | Gør | Så | Ord |
|---|---|---|---|---|---|
| 1 Galaksen | "Stjernerne yderst kredser lige så hurtigt som dem inde ved midten. Hvad sker der, hvis kun det synlige stof trækker?" | "De bliver" / "De flyver væk" | Slå "Kun det synlige trækker" til | "De yderste stjerner er for hurtige. Noget usynligt må trække i dem. Det kaldes mørkt stof." | `moerktstof` |
| 2 Lyset | "Hvordan kan man finde noget, der er usynligt?" | ingen gæt | Træk den usynlige klump hen over galakserne bagved | "Klumpens tyngdekraft bøjer lyset til buer. Sådan tegner forskerne kort over det mørke stof." | |
| 3 Universet | "Hvor meget af universet er lavet af atomer som dem i dig og stjernerne?" | "Det meste" / "Cirka halvdelen" / "En lille del" | Tryk "Vis det usynlige" | "Kun ca. 5 af 100 klodser er almindeligt stof. Ca. 27 er mørkt stof, og ca. 68 er mørk energi." | `moerkenergi` |
- **Det så du:** kernesætningen. **Veje** (højst tre): "Mørkt stof, mørk energi og antistof: Hvad er forskellen?" (`hvorfor: 'moerktAnti'`), "Gåden: Hvad er mørkt stof?" og "Big Bang".
- Stilguiden B: Scenen virker i alle faser, "Næste ›" står der altid (`visMig`: slår kontakten til, flytter klumpen hen over feltet, trykker "Vis det usynlige"), og målet i trin 2 er rundt (klumpen tæller, når buerne er over en grænse, `felt.test().buer`).
- Undertekster under ca. 160 tegn, pointen først (tjekliste B).

## Stilguiden og Retningen (tjekliste D)
- **A1 Én stemme:** Linjen er fænomenets egen undertekst eller turens linje, aldrig begge. **A2:** Kosmos' sti (findes). **A3:** "Vis det usynlige" er den ene vigtige knap i trin 3. **A4:** Mærkerne har ingen kant. **A5:** Kortet bruger den fælles klods. **A6:** Scenen er alene, til man rører den (skallen). **A7:** Emoji-ikonet, se ovenfor. **A10:** Skiftet mellem trinene tones (som Tid).
- **B1-B8:** Forløb-klodsen sørger for det meste. Kontakten og trækket virker i alle faser.
- **C1-C3:** wow, belønning (glimtet, når turen er taget) og 380.000 år (står øverst).
- **Træk fra, når I lægger til:** Intet panel får et nyt emne. Big Bang og Gåderne får kun en knap til et kort, ingen ny tekst fremme.

## Trinene (én session pr. trin, ét go pr. trin)
| Trin | Indhold | Filer | Tests | Skærmbilleder | Størrelse |
|---|---|---|---|---|---|
| **MS1** | (a) kortet og (b) Ordbogen | `js/lag.js`, `style.css` (sin egen blok efter `.hvorfor-kort`), `js/data/hvorfor.js`, `docs/fakta-hvorfor.md`, `js/data/ordbog.js`, `js/ordbog.js`, `js/data/ordbogliste.js`, `js/data/gaader.js` (to `hvorfor`), `js/kosmos/bigbang.js`, `js/kosmos/hviddvaerg.js` | `lag` (rækker, mærker og foldeboksen), `ordbog` (`ikke` og de to nye opslag under 260 tegn), `ordforklaring`, `gaader`, `kosmos`, `sorthul` | Kortet på pc, tablet på højkant og telefon på højkant (som ark), og Ordbogen ved antistof | lille-mellem |
| **MS2** | Galaksen og lysbøjningen i `js/kosmos/galakse.js`, fænomenet med trin 1-2 | `js/kosmos/galakse.js` (ny), `js/gaader/moerktstof.js`, `js/kosmos/moerktstof.js` (ny), `js/kosmos.js`, `js/data/faenomener.js`, `js/data/gaader.js` (`seDet`), `docs/kode/kosmos.md`, `docs/kode/gaader-scener.md` | Ny `tests/kosmos-moerktstof.mjs` (5-10 tjek), `gaader` (uændret efter flytningen), `kosmos` (15 fænomener), `skaermliste`, `karrusel` | Trin 1 og 2 på pc og tablet på langs og på højkant | mellem |
| **MS3** | Trin 3: de 100 klodser, kontakten 380.000 år, siden færdig | `js/kosmos/moerktstof.js`, `js/data/moerktstof.js` (ny), `style.css` (mærket genbruges) | `kosmos-moerktstof` (summen er 100 i begge, 5/27/68, mærkerne, Planck i nørd, ingen konsolfejl) | Trin 3 i begge tilstande på pc, tablet på højkant og telefon | mellem |
| **MS4** | Turen "Det usynlige, der trækker", dokumenterne og "Ikke afprøvet" | `js/data/forloeb/moerktstof.js` (ny), `js/data/forloeb/liste.js`, `js/kosmos/moerktstof.js`, `docs/kode/forloeb.md`, `docs/ikke-afproevet.md`, [plan-verdener.md](plan-verdener.md) | `kosmos-moerktstof` (turen kan tages med "Næste ›" alene og med handlingerne), `forloeb` | Turens linje på tablet på højkant og telefon på langs (under 500 px høj) | lille-mellem |

**Ydelse på tablet (alle trin):** Galaksen kører allerede i gåden med 1.100 stjerner på tablet og regnes på processoren hvert billede. Feltet regnes kun, når klumpen flytter sig (46 × 40 prikker på tablet). Klodserne bygges én gang. Mål med `?maal` på Tab A11 efter MS2 og MS3 (skrives i "Ikke afprøvet"). Ingen billeder hentes, så fænomenet henter langt under 1 MB (Retningen: "En skærm uden kloder"). Når man forlader fænomenet, frigives net, materialer og prik-teksturen (tjekliste E). Alt bevægeligt bruger `dt` fra `opdater(dt, tid)`.

**Model og effort:** Opus, effort high for alle fire (kode og danske tekster med fakta). Ingen hjælpeagenter er nødvendige.

## Prompterne (kopiér én til en ny session)

### MS1: Kortet "Mørkt, anti og ukendt" og Ordbogen
```
Spor Solsystemet og Kosmos · Mørkt stof MS1: kortet "Mørkt, anti og ukendt" og "Ikke det samme som …" i Ordbogen.
Opus, effort high. Læs docs/lige-nu/solsystemet.md og docs/plan-moerkt-stof.md (afsnit (a), (b) og MS1),
docs/fakta-moerkt-anti-ukendt.md afsnit 2 og 5, docs/kode/faelles.md om js/lag.js og js/data/hvorfor.js,
docs/kode/skaerme.md om Ordbogen og tjekliste D. Tjek først i origin/main, at det ikke er lavet
(git grep "moerktAnti" origin/main).
Byg: rækker med mærke og foldeboksen "Forveksles ofte med" i den fælles klods (js/lag.js, valgfrie felter),
kortet moerktAnti, feltet ikke i Ordbogen (kun i Ordbogen), de nye opslag sorthul og negativmasse og knapperne
til kortet i de to gåder, Big Bang, Hvid dværg og Ordbogens LINKS. /faktatjek på teksterne mod
fakta-moerkt-anti-ukendt.md. Tests: node tests/koer-alle.mjs --ændret (og lag, ordbog, ordforklaring, gaader).
Skærmbilleder af kortet på pc, tablet på højkant og telefon. Skriv i docs/kode/faelles.md, fakta-hvorfor.md og
sporets fil. /faerdig, PR og merge.
```

### MS2: Fænomenet Mørkt stof, Galaksen og Lysbøjningen
```
Spor Solsystemet og Kosmos · Mørkt stof MS2: fænomenet Mørkt stof i Kosmos med galaksen og lysbøjningen.
Opus, effort high. Læs docs/lige-nu/solsystemet.md, docs/plan-moerkt-stof.md (afsnit (c) og MS2),
docs/kode/kosmos.md (skallen, trin og gåTil), docs/kode/gaader-scener.md (js/gaader/moerktstof.js),
docs/kode/tid.md om tidhvorfor.js (trin og steder) og tjekliste D og E. Tjek først i origin/main, at det ikke er
lavet (git grep "kosmos:moerktstof" origin/main), og at MS1 er merget.
Byg: Flyt lavGalakse og lavFelt uændret til js/kosmos/galakse.js (gåden importerer derfra og må ikke ændre sig),
lav js/kosmos/moerktstof.js med trin 1 (galaksen, kontakten "Kun det synlige trækker") og trin 2 (lysbøjningen,
træk klumpen), gåTil('galakse' | 'lys'), siden med emne 1, 2 og 4, sæt fænomenet ind efter Big Bang i Universet
(js/kosmos.js og FÆNOMEN_IDER), og lad gådens seDet pege på kosmos:moerktstof. /faktatjek på siden.
Ny test tests/kosmos-moerktstof.mjs med 5-10 tjek. Ret kosmos.mjs (15 fænomener).
Skærmbilleder af trin 1 og 2 på pc og tablet på langs og på højkant. Skriv i docs/kode/kosmos.md,
gaader-scener.md og sporets fil, og målingen på Tab A11 i "Ikke afprøvet". /faerdig, PR og merge.
```

### MS3: "Hvad er universet lavet af?"
```
Spor Solsystemet og Kosmos · Mørkt stof MS3: "Hvad er universet lavet af?" med 100 klodser.
Opus, effort high. Læs docs/lige-nu/solsystemet.md, docs/plan-moerkt-stof.md (trin 3 under (c) og MS3),
docs/fakta-moerkt-anti-ukendt.md afsnit 1 og 4 og "Tjek igen", og docs/kode/kosmos.md om moerktstof.js.
Tjek først i origin/main, at det ikke er lavet, og at MS2 er merget.
Byg: trin 3 med 5 lyse klodser, "Vis det usynlige" (27 med kant, 68 som skær, glimtet af antistof),
tegnforklaringen med mærkerne fra MS1, et tryk på en klods i "Lige nu", kontakten "Da universet var 380.000 år"
(WMAP 2008: 63, 15, 12 og 10), tallene i js/data/moerktstof.js og siden færdig (emne 3, nørd med Planck 2018,
ærligt). Slå "Tjek igen" op (NASA 5/27/68, WMAP-figuren, LZ, DESI). /faktatjek. Udvid
tests/kosmos-moerktstof.mjs. Skærmbilleder af trin 3 i begge tilstande på pc, tablet på højkant og telefon.
/faerdig, PR og merge.
```

### MS4: Turen "Det usynlige, der trækker"
```
Spor Solsystemet og Kosmos · Mørkt stof MS4: turen "Det usynlige, der trækker".
Opus, effort high. Læs docs/lige-nu/solsystemet.md, docs/plan-moerkt-stof.md (turen under (c) og MS4),
docs/kode/forloeb.md og docs/kode/tid.md om turene i Kosmos. Tjek først i origin/main, at det ikke er lavet, og
at MS3 er merget.
Byg: js/data/forloeb/moerktstof.js med tre trin, visMig og runde mål, linjen i js/data/forloeb/liste.js,
og fænomenet starter og stopper turen. /faktatjek på teksterne. Udvid tests/kosmos-moerktstof.mjs
(turen med "Næste ›" alene og med handlingerne), og kør forloeb. Skærmbilleder af turens linje på tablet på
højkant og telefon på langs. Skriv i "Ikke afprøvet" (prøven med jeres søn: kan han sige kernesætningen?),
plan-verdener.md og sporets fil, og sæt status "prøve". /faerdig, PR og merge.
```

## Valgt i planen (kan ændres af jer)
1. `ikke` står kun i Ordbogen, ikke i boblerne (antistofs boble er allerede ved grænsen på 260 tegn).
2. Mærkerne skelnes på formen af prikken, ikke på farven.
3. Gådens trin 1 beholder galaksen (samme klods), og kun `seDet` ændres.
4. "Da universet var 380.000 år" er en kontakt i Styr-boksen, ikke et trin i turen, så lys og neutrinoer ikke står fremme.
5. Fænomenet får et emoji-ikon som de andre i Kosmos' liste.

## Spørgsmål til jer
Ingen nye retningsvalg. Planen følger jeres svar A til alle fire (28. november 2026).

## Faktatjek (28. november 2026, Opus)
Teksterne ovenfor er tjekket mod [fakta-moerkt-anti-ukendt.md](fakta-moerkt-anti-ukendt.md) og de kendte fælder i [fakta-faelder.md](erfaringer/fakta-faelder.md). Tre ting er slået op igen i dag:
| Påstand | Resultat | Kilde |
|---|---|---|
| NASA's runde tal 5, 27 og 68 % | OK. Står på NASA Goddards side med lagkagen ("normal or visible matter (5%), dark matter (27%), and dark energy (68%)"), kun læst som søgeresultat | svs.gsfc.nasa.gov/12307 |
| Ved 380.000 år: 63 % mørkt stof, 15 % lys, 12 % atomer, 10 % neutrinoer, mørk energi næsten intet | OK (WMAP's femårsresultater, marts 2008), kun læst som søgeresultat | map.gsfc.nasa.gov/news/5yr_release.html, Princeton 7. marts 2008 |
| LZ: stadig kun den ene hændelse (2,6 sigma) | OK, intet nyt fundet efter 1. september 2026 (søgning 28. november 2026) | energy.gov 1. september 2026 |

Rettet undervejs i forhold til faktagrundlagets udkast:
- "antistof ligner stof, bare med modsat ladning" er fjernet (fælde: neutronen og neutrinoen har ingen ladning, men har en antitvilling). I stedet: "Antistof vejer og falder som almindeligt stof" (ALPHA-g 2023).
- "mørk energi skubber" står med "men kun i det allerstørste" (fælde fra Rumtid: atomer, Jorden og Mælkevejen vokser ikke med).
- "Under én af de 5 klodser er stjerner" er blevet "Kun en lille bid af én klods er stjerner" (7 % af 4,9 % = ca. 0,3 klods, fælde 8).

**Tjek igen, før teksterne kommer i programmet** (står også i prompterne): LZ og XENONnT, DESI (alle fem år, ventet 2027), Euclid DR1 (midt i 2027), NASA-siden og WMAP-figuren læst direkte, hvis siderne kan åbnes.
