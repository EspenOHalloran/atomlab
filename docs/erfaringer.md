# Erfaringer: det, der virker, og det, der ikke virker

Denne fil skal gøre os mere præcise og hurtigere. Den har tre dele:
1. **Tjeklister**, som bruges, mens man arbejder.
2. **Rodårsager:** hvorfor fejlene opstod.
3. **Konkrete erfaringer:** det, der virker, og faldgruberne.

Når noget går galt eller virker særlig godt, skrives det ind med det samme: kort, konkret og med det, vi gjorde ved det. Får en fejl en ny rodårsag, skal den også ind i en tjekliste.

---

## 1. Tjeklister

### A. Før et stykke arbejde er færdigt (commit og push)
- [ ] Hele testsamlingen er kørt (`node tests/koer-alle.mjs`) og bestået. En fejl er undersøgt, før den kaldes "ustabil".
- [ ] Nye funktioner har fået nye tjek i en test.
- [ ] Ved ændringer i layout eller kamera: skærmbilleder på pc, tablet og telefon (`node tests/vaerktoejer/skaermbilleder.mjs <skærm>`), og de er set igennem.
- [ ] Egen ændring er læst kritisk igennem: ubrugt kode, ting der sker to gange, lyde, timere.
- [ ] Er et tal eller en tekst ændret, så søg efter alle andre steder, hvor det samme står (`grep`). Det samme tal må ikke stå forskelligt to steder.
- [ ] CLAUDE.md, DESIGN.md og denne fil er opdateret.

### B. Ny eller ændret tekst med fakta
- [ ] Hvert tal er regnet efter eller slået op. Udregningen står i en kommentar eller i commit-beskeden.
- [ ] Kilden er primær eller pålidelig (fagbøger, NIST, IUPAC, NUBASE, NASA, forskningsartikler). Populærvidenskab og "alle siger det" er ikke nok. Se fælderne i afsnit 2.
- [ ] Citater: præcis ordlyd fra den oprindelige kilde (bog, afsnit, år). Er ordlyden usikker, så skriv det, eller lad citatet være.
- [ ] Er det spillets eget tal (fx 80 mio. °C eller 6-16 spaltninger), så skriv "i spillet" og det rigtige tal ved siden af.
- [ ] Brug "ca.", "typisk" eller "de fleste", når virkeligheden har undtagelser.
- [ ] Tekster, der sættes sammen af data (fx "opdaget 1868 af …"), er læst i den færdige form for alle tilfælde (lav et lille script, der skriver dem alle ud).

### C. Ny regel, beregning eller spillogik
- [ ] Reglen er testet mod en tabel med kendte tilfælde, også de "kedelige" og grænsetilfældene, ikke kun et enkelt eksempel (fx alle kendte isotoper, ikke kun uran-238-kæden).
- [ ] Alle kombinationer af valg er gennemtænkt (fx 2 kerner × 2 neutronfarter). Ingen `if`-kæde må falde igennem til en forkert standard.
- [ ] Tilfældighed: målt med mange forsøg (fx 60). En sjælden fejl er stadig en fejl.
- [ ] Ting, som brugeren kan ændre undervejs (fx neutronens fart), gemmes, når handlingen starter.

### D. Ny del (skærm), eller ændring i start og stop
- [ ] Stop-funktionen rydder **alt**: timere, kameraets mål, kamerabegrænsninger, pause, guide, beskeder og cursor.
- [ ] Alle `setTimeout` tjekker `aktiv` eller bliver ryddet i stop.
- [ ] Opgavelister og tal bygges, når delen startes, så de passer efter "Start forfra" og nulstilling.
- [ ] Paneler opdateres højst 4 gange i sekundet og kun, når noget har ændret sig, ikke hvert billede.
- [ ] Brug de fælles byggeklodser (beskeder, guide, pause, "Næste skridt") i stedet for at kopiere.

### E. Ny animation, effekt eller fælles funktion
- [ ] "Reducer bevægelse" (`ROLIG`) er respekteret: kamerature, lysglimt og blød rulning.
- [ ] Pause: alt bevægeligt bruger `dt` og `tid`, som det får, og ikke `performance.now()`. Søg efter `performance.now`, når noget skal kunne sættes på pause.
- [ ] Grafik, der laves under brug (geometri, materiale, tekstur), bliver frigivet eller genbrugt.
- [ ] Ingen nye `Vector3`, `Color` eller `Quaternion` i løkker, der kører hvert billede.
- [ ] Klikbare ting er knapper (`<button>`), så de kan bruges med tastatur.

### F. Tests
- [ ] En kort tilstand (fx "ion i 1,6 sekunder") holdes der øje med hele tiden (`waitForFunction` med `polling`), i stedet for at kigge én gang.
- [ ] Tjek noget, der altid gælder (fx antal kernepartikler), i stedet for et præcist antal, når der er tilfældighed.
- [ ] Tilstanden nulstilles mellem forsøg, og mål vælges i et frit område (ikke under paneler).
- [ ] Tekst søges uden forskel på store og små bogstaver.

---

## 2. Rodårsager: hvorfor fejlene opstod
Fra den store gennemgang i oktober 2026 (se [gennemgang-2026-10.md](gennemgang-2026-10.md)). Fejlene falder i få grupper. Hver gruppe har fået en regel i tjeklisterne ovenfor.

| Rodårsag | Eksempler | Regel |
|---|---|---|
| **Fakta skrevet efter hukommelsen eller populærvidenskab** | Supernovaen "lyser mere end en galakse". Tjernobyl "kølingen svigtede". Supernovaens lag i forkert rækkefølge. Astronaut som spaghetti ved Mælkevejens store hul. "Meteoren" i stedet for asteroiden. Zirkonia som "kunstige diamanter". | B: regn efter, primær kilde, kend fælderne. |
| **Citater fra en kendt, men ændret udgave** | Sagan ("universe" i stedet for "cosmos"), Einstein ("existing" i stedet for "existence"), Faraday "fandt på" ord, som Whewell foreslog. | B: oprindelig kilde, ellers forbehold. |
| **En regel, der kun er tjekket på ét eksempel** | Henfaldsreglen var tjekket på uran-238-kæden, men vælger forkert retning for fx cobalt-58 og alfa i stedet for beta for thorium-231. | C: test mod en tabel med kendte tilfælde. |
| **`if`-kæde, der falder igennem** | Reaktoren: Uran-238 + hurtig neutron endte i 10 % af tilfældene i spaltningen af uran-235. | C: alle kombinationer gennemtænkt og testet. |
| **Samme fakta flere steder, der ikke passer sammen** | 7,27 og 7,37 MeV for carbon. 80 og 100 mio. °C. "10 gange" og "7 gange". | A: søg efter alle steder ved ændringer. |
| **Spillets tal præsenteret som virkelighed** | "Det kræver mindst 80 mio. °C" (spillets grænse, ikke stjernernes). | B: skriv "i spillet". |
| **Tekst sat sammen af data uden at blive læst** | "1868 af Fundet i Solens lys …", "af Danskeren …". | B: skriv alle sammensatte tekster ud, og læs dem. |
| **Hver del rydder kun sit eget op** | Kameraets mål efter Det periodiske system. Timere, der virker på den næste skærm. Opgavelister, der ikke opdateres efter "Start forfra". | D: én fælles nulstilling og ryddede timere. |
| **En ny fælles funktion, der ikke er tjekket alle steder** | Pausen: Stjernernes overflade koger videre, fordi den bruger `performance.now()`. "Reducer bevægelse" virker kun delvist. | E: søg efter alle steder, der skal følge med. |
| **Arbejde hvert billede, som ikke behøves** | Reaktorens panel skrives hvert billede, også når reaktoren er slukket. | D: højst 4 gange i sekundet, og kun ved ændring. |
| **Tests, der kigger på det forkerte tidspunkt eller forventer et præcist tilfældigt tal** | `henfald` (ion i 1,6 sekunder), `stjerneovn` (præcis 40 protoner). | F. |

### Kendte fælder i fakta (populære påstande, der er forkerte eller for skarpe)
- "En supernova lyser mere end en hel galakse." Det passer kun nogenlunde for type Ia. En kollaps-supernova lyser som ca. 0,2-1 milliard sole, og galaksen er 40-100 gange stærkere.
- "Tjernobyl skyldtes, at kølingen svigtede." Reaktoren løb løbsk under et forsøg. Fukushima var kølesvigt.
- "Stjernens lag: C, O, Ne, Si." Brændingen sker i rækkefølgen C, Ne, O, Si, så udefra og ind er det H, He, C, Ne, O, Si, Fe.
- "Man bliver til spaghetti ved et sort hul." Kun ved små sorte huller. Ved de kæmpe sorte huller mærker man næsten intet ved horisonten.
- "Meteoren, der udryddede dinosaurerne." Det var en asteroide. En meteor er lysstriben.
- "Halveringstiden er den tid, det tager for en kerne at henfalde." Det er den tid, hvor halvdelen af mange kerner er henfaldet.
- "Beta-plus = en positron skydes ud." Ofte fanger kernen i stedet en elektron.
- "Første gang set …" Tjek, om det var "første gang set tydeligt" eller "første direkte måling".
- Citater, der citeres i mange udgaver (Sagan, Einstein), har ofte en ændret ordlyd.

---

## 3. Konkrete erfaringer

### Arbejdsmåde, der virker
- **Mål i stedet for at gætte.** Når et tal på skærmen beskriver spillets egen simulering, så mål det i simuleringen. Eksempler: kontrolstavene i Reaktoren (stabil ved ca. 50 %), frastødningens "bakke" i Stjerneovnens graf og hvor tit man rammer en kerne med musen (målt med 40 forsøg).
- **Regn fakta efter, og skriv udregningen ned.** Fx "1 gram brint → helium svarer til over 20 ton kul" (0,7 % af mc² ≈ 6,4·10¹¹ J, kul 24-30 MJ/kg). Vis spændet, når kilderne er uenige, og vælg en forsigtig formulering ("over 20 ton").
- **Faktatjek med flere agenter på hver sit område** (oktober 2026) fandt ca. 15 klare fejl og mange upræcise formuleringer i ca. 850 påstande.
  - Agenterne må kun læse.
  - Deres vigtigste fund tjekkes efter i koden eller mod kilder, før de bliver rettet.
  - En regel tjekkes ved at køre selve funktionen over kendte tilfælde.
  - Gentag faktatjekket efter hver større ny del.
- **En kodegennemgang med en agent** fandt fejl, som testene ikke fanger: oprydning ved skærmskift, timere, arbejde hvert billede og tilgængelighed. Gentag også den efter større ændringer.
- **Testadgangen (`?test`)** gør det muligt at spole frem, fryse tiden og læse tilstanden direkte. Brug den i stedet for at vente på animationer.
- **Udregninger inde i siden:** Statistik (fx ramme-procent) laves i én `page.evaluate`, så tiden ikke går imens.
- **Frys tiden til skærmbilleder** (fx `atomlabTest.fusion.rejseTid(t)`). Testbrowseren tegner kun 3-4 billeder i sekundet, og et skærmbillede tager ca. et sekund.
- **Skærmbilleder i alle størrelser** samlet i ét billede pr. skærm (pc, tablet på højkant, telefon begge veje) gør det hurtigt at se forskelle og ting, der overlapper.
- **Kør testene én ad gangen.** Kører flere browsere på én gang, fejler testene tilfældigt.
- **Små fælles byggeklodser** frem for kopier: beskeder (`visBesked`), guiden (`startGuide`) og pausen (`lavPause`) bruges flere steder, så de opfører sig ens.
- **"Næste skridt" og "Vis mig"** hjælper meget med at komme i gang. "Vis mig" må ikke klare opgaver for en.
- **Vent på testene inden for samme tur** (vent på resultatet i stedet for at afslutte), så der ikke bliver pushet utestet kode.

### Faldgruber: kamera og layout
- **Kamerastyringen har en skjult grænse.** `styring.maxDistance` (250) holder kameraet tæt på, også når styringen er slået fra. En planlagt kameratur skal hæve grænsen og sætte den tilbage bagefter.
- **Smalle skærme giver en anden kameraafstand.** På en telefon på højkant står kameraet længere væk (`passerTil` regner ud fra hullet). Rejsen ind i Solen sluttede derfor uden for Solen. Afstande skal regnes ud fra `verden.målAfstand`, og telefon på højkant skal altid testes.
- **Ting i 3D-vinduet, der overlapper.** Brug `bundIVindue()` til ting nederst (over underteksterne). Et lag oven på hele vinduet skal have z-index 1, ellers dækker det underteksterne (z-index 2). 3D-etiketter kan stikke op over overskriften (Batteriet på tablet).
- **Skærmbilleder af "hele siden"** (`fullPage`) viser kun det synlige, fordi panelerne ruller hver for sig. Rul elementet frem (`scrollIntoViewIfNeeded`), og tag billedet bagefter.

### Faldgruber: tid, timere og tilstand
- **Gættede tal i grafer.** Bakken i Stjerneovnens graf var først gættet og gav ca. 2 % i stedet for ca. 30 % ved 15 mio. °C. Rettet ved at måle i spillets fysik. Ændres fysikken (`FRASTØD`, `RN`, `termiskFart`), skal `BAKKE` måles igen.
- **Fænomener, der bruger det fælles ur**, kan ikke sættes på pause. Kosmos fik derfor sit eget ur (`kosmosTid`).
- **Kø med forsinkelse:** Pillerne (beskeder) gav en fejl, når køen blev tømt imens. Tjek køen igen inde i `setTimeout`.
- **Lyde før man har trykket på siden** gav advarsler i browseren. Lyde springes nu over, indtil siden er brugt (`navigator.userActivation`).
- **"Vis mig" lavede ingen reaktion i 4 af 60 forsøg.** En tredje kerne skubbede skuddet af kurs. Rettet, så de to kerner går igennem de andre: 0 af 60.
- **Beskeder kunne skubbe rejsens undertekster væk.** Nu venter ovnens beskeder, til rejsen er slut.

### Faldgruber: tests og værktøjer
- **Test, der lyver:** En statistik viste for gode tal, fordi en valgt kerne ikke blev nulstillet mellem forsøgene.
- **En sjælden testfejl kan være en ægte fejl** ("Vis mig" ovenfor). Men den kan også være testens egen timing (`henfald`). Find årsagen, før den afvises.
- **Push før testene er færdige:** En automatisk regel kræver push, når en tur slutter. Vent derfor på testene inden for samme tur. Hvis der alligevel pushes før, så sig det.
- **Tests i en midlertidig mappe** ville være forsvundet, da sessionen sluttede. De ligger nu i `tests/`.
- **Konsolfejl talte ikke med** i de ældste tests. Nu giver de fejl i alle tests.
- **Ting skrevet efter hukommelsen var forkerte** (tabellen over testene). Tjek altid i filerne.
- **`pkill` med et mønster**, der også passer på ens egen kommando, lukker ens egen terminal. Brug process-id i stedet.
- **Netadgang:** WebSearch virker herfra, men WebFetch kan ikke slå de fleste sider op (DNS). Kilder findes derfor via søgeresultater. Skriv det, når en kilde ikke kunne læses direkte.

---

## Testsamlingen
Testene ligger i [tests/](../tests/README.md). Kør dem med `node tests/koer-alle.mjs`. Se README'en for, hvad hver test tjekker.

## Åbne punkter
- **Rettelserne fra gennemgangen** i oktober 2026 venter: se [gennemgang-2026-10.md](gennemgang-2026-10.md) og trin 11 i DESIGN.md.
- Ikke testet med rigtig mus og rigtige fingre: hvordan det føles at sigte i Stjerneovnen, og hvor glat rejsen ind i Solen kører. Det skal prøves af jer.
