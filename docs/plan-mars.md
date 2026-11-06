# Plan: Mars med Phobos og Deimos og en flyby

*Lavet 24. oktober 2026 af Opus. Den bygger på prototypen med Saturn (trin 1b i [plan-solsystemet.md](plan-solsystemet.md)) og bruger den samme teknik. Tallene står med kilder i [fakta-solsystemet.md](fakta-solsystemet.md), del 3. Hver delopgave får et go, før den går i gang.*

**Færdige delopgaver** (planer, prompter, svar ved go og status for M2-M8a, M5, M6 og M7a) er flyttet ordret til [arkiv/plan-mars-faerdigt.md](arkiv/plan-mars-faerdigt.md) (5. november 2026). Henviser en tekst til et afsnit, der ikke står her (fx "Status efter M6b" eller "Plan for M5"), så står det dér. Tilbage af Mars: M8c del 1 (besluttet som det sidste, før planeterne) og "Mars ekstra" (M8c del 2, M7b-pol og L2, se "Plan for resten af Mars").

## Jeres ønsker og svar (24. oktober 2026)
- Mars skal laves som Saturn: med måner og en flyby. Ved Mars skal flybyen også besøge steder på selve planeten, fx Olympus Mons. Planeten fylder mere end månerne.
- **"Det hele skal med. Det skal være så flot og imponerende som muligt."** Saturn og flybyen kører helt flydende på tabletten, så vi kan godt give den gas med grafikken.
- **Tharsis** kommer med, fordi det er en lille opgave: Det er højlandet med de store vulkaner lige ved siden af Olympus Mons.
- **Phobos og Deimos** skal have deres rigtige form (de er ikke runde).
- **Detaljer helt tæt på** og **"Stå på Mars"** skal med.
- Opgaven deles op i delopgaver, og I siger go mellem dem, så forbruget af tokens kan styres.
- **Svar ved go til M2 (24. oktober 2026):** Bjergene har rigtige højder som standard. Kan Olympus Mons slet ikke ses fra kredsløb, må de gøres fx 3 gange højere, og det siges ærligt i nørd-teksten. Kan `basisu` (til KTX2) ikke hentes i miljøet, bruges JPG i M2, og det siges, i stedet for at bruge tid på at finde en vej udenom. M2 køres med høj effort.

## Hvor Mars kommer til at stå
I M2 og M3 stod Mars som et fænomen i Kosmos (`js/kosmos/mars.js`). **Siden M4 (26. oktober 2026) står Mars på sin egen skærm, Solsystemet** (`#solsystem`, `js/solsystem.js`), mellem Jorden og Saturn i rækken af kloder (efter afstanden til Solen). Filen ligger stadig i `js/kosmos/`.

## Delopgaverne
Hver delopgave slutter med `/faerdig` (tests, billeder, dokumentation og en PR, der merges, når hele testsamlingen er grøn). Så kan I se den på GitHub Pages, før I siger go til den næste.

| Del | Hvad | Størrelse |
|---|---|---|
| M1 | ✅ **Planen og faktagrundlaget** (denne fil, tal med kilder, billedkilder og licenser). Lavet 24. oktober 2026. | lille til mellem |
| M2 | ✅ **Mars-kloden** (lavet 24. oktober 2026, se "Status efter M2" nedenfor): billederne (farvekort og højdekort), kuglen med rigtige højder (bjergene rager op i kanten), døgn, hældning og Solen. Mars står i Kosmos med panelet og "Kort fortalt". | mellem til stor |
| M3 | ✅ **Atmosfæren og lyset** (lavet 25. oktober 2026, se "Status efter M3" nedenfor): den tynde, støvede luft i kanten (rigtig skalahøjde), tusmørket, polkapperne og skyer af is over vulkanerne. Knappen "Modlys". | mellem |
| M4 | ✅ (M4a-M4c lavet 26.-29. oktober 2026, se "Status efter M4c") **Fælles flyby, egen skærm og rejsen ned til overfladen** (plus Solen og Jorden, se "Jorden i Solsystemet" nedenfor): Flybyen flyttes ud af `saturn.js` til et fælles modul, og kameraets rejse (`rejse.js`) lærer at flyve til et sted på kuglen og se skråt ned mod horisonten. Mars og Saturn flyttes fra Kosmos til en egen skærm, "Solsystemet" (`#solsystem`, et nyt kort i menuen med en liste over planeterne). Skallen om fænomenerne i `kosmos.js` gøres fælles, så den ikke kopieres. Saturn skal virke præcis som før. Jorden (en klode som Mars med Årstiderne og Formørkelser under sig) og Solen (Solstorm og Solens fremtid) flytter også til Solsystemet (jeres svar 26. oktober 2026). Overblikket med Solen og planeternes baner (trin 2 i plan-solsystemet.md) venter, til Mars er færdig (jeres svar 24. oktober 2026). | stor |
| M5 | ✅ (M5a og M5b lavet 30. oktober 2026, se "Status efter M5a" og "Status efter M5b") **Flybyen over Mars:** stoppene med tekster (faktatjekket): oversigten, Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance). "For nørder", "Ærligt talt" og nye fagord i ordbogen. | mellem |
| M6 | ✅ (M6a og M6b lavet 30. oktober 2026, se "Status efter M6a" og "Status efter M6b") **Phobos og Deimos i den rigtige form:** formmodeller og kort, banerne med den rigtige fart (Phobos står op i vest), stop i flybyen og "Mars set fra Phobos". | mellem til stor |
| M7 | (M7a ✅ lavet 30. oktober 2026, se "Status efter M7a". M7b er ikke bygget) **Skarpe detaljer ved stederne:** billeder og højder i høj opløsning lige der, hvor flybyen stopper, så man kan flyve helt ned til Olympus Mons' krater på toppen, ned i Valles Marineris og hen over Gale og Jezero. | stor |
| M8 | (planen er klar 30. oktober 2026, se "Plan for M8". M8a ✅ Gale lavet 30. oktober 2026, M8b ✅ Jezero lavet 31. oktober 2026. M8c del 1 er det sidste før planeterne, og M8c del 2 er "Mars ekstra") **Stå på Mars:** et landskab i 3D ved Gale (med Mount Sharp) og ved Jezero (med deltaet), bygget af rovernes højdekort og fotos fra kredsløb. Kameraet står, hvor roveren står. Måske også de rigtige panoramafotos fra roverne. | stor |

Rækkefølgen er valgt, så der er noget at se efter hver del: Efter M2 kan man dreje Mars, efter M5 er flybyen færdig i grove træk, og M6-M8 gør den rigere.

**Ny rækkefølge (jeres svar 29. oktober 2026):** M7 deles i **M7a** (teknikken til lokale detaljer, prøvet på Olympus Mons) og **M7b** (de meget skarpe kort ved Gale og Jezero). Rækkefølgen bliver **M7a → M5 → M6 → M7b → M8**. Se "Detaljer før flere stop" nedenfor.

**Resten af Mars (plan 31. oktober 2026):** Af M7b bliver kun Nordpolen tæt på (M7b-pol) og en lille rest i M8b. Rækkefølgen bliver L1 (lyset) → S2 → M8b → M8c → M7b-pol → U4 → L2. Se "Plan for resten af Mars" nedenfor.

## Plan for resten af Mars (31. oktober 2026, skrevet ind efter jeres go)
*Lavet af Opus ud fra CLAUDE.md, "Lige nu" (`docs/lige-nu.md`), denne fil, `docs/erfaringer.md`, `docs/plan-fable.md`, `docs/plan-ux.md` og `docs/plan-saturn-kvalitet.md`. Hvert trin får stadig sit eget go. De åbne spørgsmål står til sidst.*

**Udgangspunktet:** M1-M6, M7a og M8a er færdige, og det samme er U1 og U2. U3 kører i en anden session (`ccr-1dbfe8b3-phtbvs`, indtil videre kun `docs/plan-ux.md`). M5b, M7a, M8a, U1 og U2 er ikke set på den rigtige tablet. Stå på Mars kører med ca. 45 % (pc) og 56 % (tablet) af hastigheden ved hele Mars i testbrowseren. På et rigtigt grafikkort er det ikke målt.

### 1. M7b: kun Nordpolen tæt på og én lille rest (jeres valg 31. oktober 2026: B)
Da M7b blev planlagt, fandtes Stå på Mars ikke. Det meste af det, M7b skulle give, har M8a nu givet bedre:
- **Skarpere farver fra CTX med Solen sat som på fotoet:** CTX er i gråtoner, så farven kommer stadig fra Viking. Hvis Solen skal stå som på fotoet, er hvert stop låst til ét klokkeslæt. Meget arbejde for lidt.
- **HRSC' egne højder (ca. 50 m):** Fra den højde, flybyen ser stederne fra, ligner de næsten de 0,17 km, vi har.
- **Nordpolen tæt på: kommer med som sit eget skridt, M7b-pol** (jeres valg B). Det er den eneste del, der giver noget helt nyt at se. Se nedenfor.
- **En flyvning helt ned uden overgang:** Det kræver kort ned til 1 m på kloden. Overgangen i 1,2 km højde virker.
- **M7b-pol, Nordpolen tæt på (mellem til stor):** Et net i bredde og længde virker ikke ved polen (alle længdegrader mødes), så der skal et nyt net til: et lokalt net i polarstereografisk projektion over kappen (ca. 1.000 km bred), der glider over i kuglen ved kanten som de andre lokale net (`lokalt()` i `klippeplanet.js`), og et hul i kuglen omkring polen. Så kan man flyve ned over spiralkløfterne og Chasma Boreale i midnatssolen.
  - **Data, ikke tjekket endnu:** MOLA har polarstereografiske højdekort, der er skarpere end det globale kort. Hvor skarpe og hvor langt ned mod ækvator de går, tjekkes med curl, før noget loves. Farverne: Viking (ca. 1 km) eller noget skarpere med en fri licens, hvis det findes.
  - **Højdetabellen** (`overflade`, `bund`) skal også kunne bruge det nye net, så kameraet holdes over isen.
  - **Faktatjek:** kappens tal (tykkelse, bredde), spiralkløfterne og Chasma Boreale.
- **Resten, der kommer med i M8b:** Mellemlaget fra Stå på Mars (16 m over ca. 32 km) bruges som detaljekort (`detalje` i `LOKALE`) ved Gale- og Jezero-stoppene, når Jezeros mellemlag findes. **Ikke tjekket:** Mellemlaget regnes i meter fra kraterets nulpunkt og `detalje` i bredde og længde. Om det kan bruges direkte, eller om billedværktøjet skal lave et kort mere, tjekkes, før det loves.

### 2. Rækkefølgen
| Nr. | Del | Hvorfor her |
|---|---|---|
| 1 | ✅ **L1: lyset i Stå på Mars, den billige del** (lavet 31. oktober 2026) | Mest synligt for prisen, og M8b bruger den samme shader, så det justeres kun én gang. Rører `landskab.js` og måske `scene3d.js`, ikke U3's filer, så den kan laves nu. |
| 2 | ✅ **Saturn S2** (lavet 31. oktober 2026, ringene fra Cassinis målinger, `plan-saturn-kvalitet.md`) | Udfylder ventetiden på U3: Data og shader rører ikke U3's filer (kun nørd-teksten i `saturn.js` kan give en lille konflikt). Shaderen læser allerede τ fra et billede på én linje (`ringTekstur`), så kun kilden og antallet af punkter skiftes. `pds-rings.seti.org` svarer (curl 31. oktober 2026, også `CORSS_8001` og `COUVIS_8001`). |
| 3 | ✅ **M8b: Jezero** (lavet 31. oktober 2026, se "Status efter M8b") (J2 Randens inderside og J1 Landingsstedet) + resten af M7b | Teknikken findes, så det er mest data og tekster. **Venter, til U3 er merget:** U3 flytter stedernes tekster i `mars.js`, og M8b skriver nye tekster dér. |
| 4 | **M8c del 1: rovernes panoramaer** ("📷 Rovernes foto" ved Naukluft og landingsstedet) | Den bedste "Ærligt talt": man skifter mellem det tegnede og det fotograferede fra samme sted. |
| 5 | **M8c del 2: Curiosity som 3D-model** ved "Hos Curiosity nu" | Modellen er 11,9 MB (over grænsen på ca. 10 MB i afsnit 7 under "Plan for M8"). Hvad den koster på tabletten, ved vi ikke endnu. |
| 5b | **M8c del 3: stenene og terrænet (tilføjet 3. november 2026 efter jeres fund)** | Jeres fund: "Stenene ser meget ensartede ud", mest helt tæt på, men også længere væk. Se "M8c del 3" sidst i filen. Kommer efter del 1, for panoramaerne er facit for, hvordan stenene skal se ud. |
| 6 | **M7b-pol: Nordpolen tæt på** | Et nyt polarnet over kappen (se afsnit 1). Nyt arbejde i `klippeplanet.js` og `lav_steder.py`, så det kommer efter M8, hvor resten af Mars er på plads. |
| 7 | ✅ **U4** (lavet 31. oktober 2026, tidsknappen og kontakterne i resten af AtomLab) | Når U3 er merget. Rører ikke Mars-filerne. |
| 8 | **L2: lyset, den dyre del** | Kun det, der holder, når det er målt. Kræver en lokal session på jeres pc (Windows, så Remote Control fra skyen virker ikke). |

**Besluttet 5. november 2026:** Efter nr. 4 (M8c del 1) kommer planeterne (Jupiter først). Nr. 5, 6 og 8 er "Mars ekstra" til senere.
| 9 | **Solsystemets overblik** (trin 2 i `plan-solsystemet.md`) | Stort og svært (et flydende nulpunkt), så det får sin egen plan først. |
| 10 | **Saturn S3** og Saturn i 8k | Venter. Kun Enceladus har et højdekort over hele månen, og det er groft. Til Saturn findes intet frit kort over 4k, og en gasplanet vinder næsten intet ved 8k. |

### 3. Lyset og kvaliteten
**L1, det, der ikke koster hastighed** (konstanter og et par uniforms):
- `sollys()` (2,4) og `himmellys()` (0,55) sænkes, så skyggerne bliver mørkere og relieffet står frem. Prøv fx 1,6-1,8.
- Himlen mørkere og mere mættet opad, så himmel og jord ikke er lige lyse.
- Lidt mindre dis. `TAU` 0,4 er rigtig for årstiden. Ændres den, skal "Ærligt talt" sige det.
- Starttiden sænkes fra 8,5 (37°) til en lav sol (15-25°, fx 07:30), så skyggerne bliver lange.
- Eksponering og glød kun, mens man står: Tonemappingen beholdes (ACES), og kun `toneMappingExposure` ændres. Et skift af tonemapping får Three.js til at oversætte shaderne igen, og det giver et hak. Måske kan gløden slås helt fra, mens man står. Det sparer også tid. **Tjekkes først:** Kommer Solens skær på himlen fra gløden? Så skal det laves i himlens shader i stedet.
- **Facit:** NASA's panorama PIA20332 fra Naukluft (taget dér, hvor man står) hentes og bruges som sammenligning. Kun som billede, det kommer ikke med i programmet før M8c. Husk, at fotoet er hvidbalanceret (mindre rødt end i virkeligheden).
- **Hvor:** i skyen (jeres pc er Windows, og en cloud-session kan kun bruge en Mac eller Linux med Remote Control). Farverne er de samme som på en rigtig skærm, men et billede tager minutter, så tag få og små billeder. I bedømmer det selv på pc og tablet til sidst.

**L2, det, der skal måles først:**

| Forbedring | Pris | Vurdering |
|---|---|---|
| Ambient occlusion (mørkere i sprækker og lavninger), regnet én gang pr. lag som skyggekortene | ét opslag i et kort mere pr. pixel | Den bedste af de dyre. Prøves først. |
| Blødere skygger | Kanten er allerede blød (`landskab.js`, ved `regnSkygge`) | Se L1's billeder først. Måske er det ikke nødvendigt. |
| Farvefoto fra HiRISE | dækker kun smalle striber, klitterne bliver blågrå | Frarådes: Farverne er ikke ægte. |
| Flere sten og riller helt tæt på | pr. pixel helt tæt på | Først hvis I synes, at stenene ser kunstige ud (punkt 6 under "Ikke afprøvet" for M8a). |

### 4. Model, effort, afhængigheder og faktatjek
Fable venter på Fable 5.5 (`plan-fable.md`). Ingen af delene kræver xhigh. Hjælpeagenter: Haiku med lav effort til testlogs og Sonnet med lav effort til at finde ting i koden.

| Del | Model og effort | Omfang | Afhængigheder | Faktatjek |
|---|---|---|---|---|
| L1 | Opus, medium | lille | ingen (i skyen) | kun hvis "Ærligt talt" om disen ændres |
| M8b | Opus, høj | mellem | `planetarymaps.usgs.gov` (tjekkes med curl), U3 merget | Perseverances plads og tal (med dato), deltaet, Cheyava Falls |
| M8c del 1 | Opus, høj | mellem | `assets.science.nasa.gov` (åben 31. oktober 2026) | fotoenes dato, kamera og hvidbalance |
| M8c del 2 | Opus, høj | mellem | jeres ja til at gøre modellen mindre (`gltf-transform`, et værktøj, der køres én gang, ikke et byggetrin), `GLTFLoader` fra `three@0.186.1`, måling på tabletten | rovernes retning og plads i oktober 2026 |
| M7b-pol | Opus, høj | mellem til stor | MOLA's polarkort (domænet tjekkes med curl), M8 færdig | kappens tal, spiralkløfterne, Chasma Boreale |
| L2 | Opus, høj | mellem | en lokal session på jeres pc (Claude Code installeret, Node.js og Playwright) | – |
| U4 | Opus, medium | lille-mellem | U3 merget | – |
| S2 | Opus, høj | mellem | `pds-rings.seti.org` | ringenes tal og kilde i nørd-teksten |

### 5. Arbejdsgangen (jeres svar 31. oktober 2026)
- **"Du skal bare lave alt det, du kan fra listen, i din rækkefølge. Go mellem hvert skridt."** Rækkefølgen i afsnit 2 gælder. Af M7b kommer kun Nordpolen tæt på (M7b-pol) og resten i M8b med (jeres valg B, 31. oktober 2026).
- **I laver jeres vurdering til sidst**, ikke efter hvert skridt. Hvert skridt skriver derfor sin egen liste "Ikke afprøvet" (hvad I skal kigge efter på pc og tablet), og listerne samles til jeres runde til sidst. Det betyder, at lyset i L1 justeres efter Opus' billeder og NASA's foto, ikke efter jeres øjne. Det kan kræve en rettelse efter jeres runde.
- **Nye sessioner, hvor det giver mening**, for at spare tokens, men ikke på bekostning af kvaliteten. Hvert skridt slutter med at skrive prompten til det næste skridt ind under "Prompter til de næste skridt" nedenfor. I starter den nye session med prompten og siger go.
- **Sessionerne:** L1, S2, M8b, M8c (begge dele i én session, med go imellem), M7b-pol, U4, L2 (lokal på jeres pc) og planen for trin 2 får hver sin session.
- **DESIGN.md og `docs/plan-ux.md` røres ikke, før U3 er merget.** (U3 blev merget 31. oktober 2026.) Indtil da skrives status her i filen. Den første session efter U3 skriver status ind i "Lige nu" (`docs/lige-nu.md`).

### Åbne spørgsmål
1. Må Curiositys model gøres mindre med `gltf-transform` (en npm-pakke, der kun køres én gang som værktøj)? Spørges ved M8c del 2.
2. L2: Vil I installere Claude Code på pc'en (`irm https://claude.ai/install.ps1 | iex` i PowerShell) eller bruge Claude Code i Claude-appen? Spørges, når vi når dertil.

### Prompter til de næste skridt
*De brugte prompter (L1, S2 og M8b) står i [arkiv/plan-mars-faerdigt.md](arkiv/plan-mars-faerdigt.md).*

**M8c del 1 (skrevet 31. oktober 2026 efter M8b, brugt: se "Status efter M8c del 1" nedenfor):**
> Lav M8c del 1: rovernes panoramaer. Læs CLAUDE.md, "Lige nu" (`docs/lige-nu.md`), `docs/erfaringer.md` og i `docs/plan-mars.md` afsnittene "Plan for resten af Mars" (afsnit 2, 4 og 5), "Plan for M8" (afsnit 6 "Panoramaerne" og 9) og "Status efter M8b". M8b er merget.
>
> **Først:** Tjek med `curl`, at `assets.science.nasa.gov` og `science.nasa.gov` kan åbnes, og hent PIA20332 (Naukluft, Mastcam) og PIA24264 (landingsstedet ved Jezero, Mastcam-Z) i fuld størrelse (og PIA24422, Navcam, hvis PIA24264 ikke dækker 360°). Er noget blokeret, så stop og bed om adgang. Tjek panoramaernes vinkler (hvor meget over og under vandret, og hvilken retning midten vender), før noget bygges.
>
> **Mål:** knappen "📷 Rovernes foto" i bjælken, mens man står ved Naukluft og ved landingsstedet ved Jezero. Fotoet lægges på en cylinder om kameraet, så man drejer og zoomer som i landskabet, og det drejes, så horisonten (Mount Sharp, deltaets front) står samme sted som i 3D (mål det ved at sammenligne horisonten). Over og under fotoet toner himmel og jord ud. Et tryk igen går tilbage til det tegnede. Fotoet hentes, når man trykker (ca. 8192 pixel bredt på pc og 4096 på tablet, `LAV_KVALITET`, tests små). Fotoerne er hvidbalancerede: sig det i teksten. Kilden og licensen i `billeder/solsystem/KILDER.md`, `LICENSE` og (når U4 er merget) "Om AtomLab" i index.html.
>
> **Tekster:** en kort tekst om, hvem der tog fotoet, hvornår og med hvilket kamera, og "Ærligt talt" om forskellen mellem det tegnede og fotoet. Faktatjek med `/faktatjek` (fotoenes dato, sol, kamera og hvidbalance).
>
> **Billeder:** Skyen har intet grafikkort. Tag få, små billeder i baggrunden (`tests/vaerktoejer/landskab-lille.mjs`), og sammenlign det tegnede og fotoet fra samme retning.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv det, der ikke er afprøvet, i `docs/ikke-afproevet.md`, og markér, at Mars er færdig (besluttet 5. november 2026: M8c del 2, M7b-pol og L2 er "Mars ekstra" til senere, og næste er planen for Jupiter i `docs/plan-solsystemet.md`, afsnit 9). Model: Opus. Effort: høj (I sætter den selv).

## M8c del 1: rovernes panoramaer, målingerne (5. november 2026)
Jeres svar: "Ja, tag 1 og 2 med" (M8c del 1, testens tidsgrænse og nitrogens "Vidste du?").

**Fotoene (hentet fra `assets.science.nasa.gov`):**
- **PIA20332 (Naukluft):** 29.163 × 6.702 pixel (JPEG 105 MB). Curiosity, Mastcam (venstre kamera), sol 1302, "mid-afternoon", hvidbalanceret ("approximates white balancing"). Billederne er taget 5. april 2016 kl. 00:25-01:03 UTC (4. april i USA), lokal soltid (LMST) ca. 15:07-15:44 (NASA's API over rå billeder, `mars.nasa.gov/api/v1/raw_image_items`, og Mars24-formlerne). Kredit: NASA/JPL-Caltech/MSSS.
- **PIA24264 (landingsstedet):** 9.238 × 2.451 pixel (TIFF 47 MB, det store er 36.952 × 11.570). Perseverance, Mastcam-Z, sol 3 (21. februar 2021), 142 billeder, LMST ca. 15:17-16:40. Kredit på siden: NASA/JPL-Caltech/MSSS/ASU. Siden siger intet om hvidbalance (se faktatjekket).
- **PIA24422 (Navcam):** ikke brugt, for PIA24264 dækker 360°.

**Vinklerne (målt):**
- **Begge har lige mange pixel pr. grad vandret og lodret** (en ligevinklet cylinder, 81,01 og 25,66 pixel pr. grad). Ved Naukluft passer Curiositys egen skygge (kameraets skygge står i −Solens højde, 26,7° ifølge Mars24) med lige vinkler og ikke med en perspektivisk cylinder (30 mod 140 pixel forskel). Ved Jezero passer Mastcam-Z-billedernes egne retninger (CAHVOR-modellen i NASA's API) ned til ca. −47° inden for ca. 1°.
- **Naukluft:** Venstre kant vender mod 180,75° (syd), retningen vokser med uret, og vandret ligger i række 1.157 (+14,3° til −68,4°). Kanten mellem himmel og land passer med 3D-horisonten fra højdekortet inden for ca. 0,1° (Mount Sharp og kraterets rand mod øst og nord). Mod vest er randen skjult i dis i fotoet. Skyggen står ved 113,9° (med venstre kant ved 180,75°), og Solen stod ved 293,3°, så skyggen burde pege mod 113,3° (forskel 0,6°, skyggens plads er aflæst med ca. ±1°). Fotoet er vandret (ingen målbar hældning).
- **Landingsstedet:** Fotoet følger roverens ramme. Venstre kant er 0,52° i roverens retninger, vandret i roverens ramme ligger i række 239,9 (ca. +9,3° til −86°), og roveren hælder ca. 1,2° (kvaternionen (0,415617; −0,00408664; −0,00947025; 0,909481) fra roverens ramme til nord-øst-ned). Venstre kant vender derfor mod ca. 131,4° (sydøst). Himlen er lysest ved 255-260°, og Solen stod ved 254°. Randen passer med 3D-horisonten.
- Værktøjerne til målingen (Mars24, horisonten fra lagene, krydskorrelation) lå i sessionens kladdemappe og er ikke med i repoet. Tallene står i `FOTOS` i `billeder/solsystem/lav_panorama.py` og i `pano-<id>.json`.

**M8c del 2 (skrevet 5. november 2026 efter M8c del 1, "Mars ekstra" til senere: næste er planen for Jupiter, besluttet 5. november 2026):**
> Lav M8c del 2: Curiosity som 3D-model ved "Hos Curiosity nu". Læs CLAUDE.md, "Lige nu" (`docs/lige-nu.md`), `docs/erfaringer.md` og i `docs/plan-mars.md` afsnittene "Plan for resten af Mars" (afsnit 2, 4 og 5), "Plan for M8" (afsnit 7 "Roveren" og 10), "Status efter M8a" og "Status efter M8c del 1". M8c del 1 er merget.
>
> **Først:** Spørg om åbent spørgsmål 1: Må `Curiosity_static.glb` (11,9 MB, `assets.science.nasa.gov/…/gltf_files/24584_Curiosity_static.glb`) gøres mindre med `gltf-transform` (en npm-pakke, der kun køres én gang som værktøj, ikke et byggetrin)? Byg intet, før I har svaret. Tjek med `curl`, at filen kan hentes, og se, hvor meget af størrelsen der er teksturer og hvor meget geometri.
>
> **Mål:** Curiosity står ved "Hos Curiosity nu" med den rigtige retning og hældning fra NASA's kortdata (sol 5045: retning 161,5°, hældning 13,5° op ad bakken) på jorden i landskabet (`js/solsystem/landskab.js`). Kopiér `GLTFLoader` (og de filer, den importerer) fra `three@0.186.1` til `lib/three/addons/`. Lyset på modellen skal passe med landskabets Sol og himmel (`sollys`, `himmellys`), og modellen kaster en skygge, der passer med Solen. Ved Naukluft og landingsstedet: et lille skilt i stedet ("Her stod Curiosity i april 2016" og "Her landede Perseverance"), hvis det ikke fylder for meget. Mål billeder i sekundet før og efter (pc og tablet på højkant, én ad gangen), og spørg om adgang til en rigtig pc, hvis følelsen skal måles.
>
> **Tekster:** en kort tekst om roveren (størrelse, vægt, hvor længe den har kørt), faktatjekket med `/faktatjek`, og "Ærligt talt" om modellen (NASA's model, forenklet).
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv det, der ikke er afprøvet, i `docs/ikke-afproevet.md`, og skriv prompten til det næste skridt under "Prompter til de næste skridt" her i filen (M7b-pol eller L2, se "Plan for resten af Mars"). Model: Opus. Effort: høj (I sætter den selv).

## Status efter M8c del 1 (5. november 2026): roverens foto
- **Lavet:** Kontakten "📷 Roverens foto" i Styr-boksen ved Naukluft og landingsstedet (`foto` i `LANDSKAB`, `visFoto`). Roverens 360°-panorama (PIA20332 og PIA24264) ligger på en kugle om kameraet (`js/solsystem/panorama.js`), drejet efter de målte vinkler (se "M8c del 1: rovernes panoramaer, målingerne" ovenfor), og toner ind over landskabet på 0,6 s. Over og under fotoet og i hullerne uden data ses det tegnede landskab (en blød maske). Klokken stilles til den tid, fotoet blev taget (15:42 ved Naukluft og 14:45 ved landingsstedet, lokal soltid). Teksten på stedets side har et emne om fotoet, der folder sig ud, når kontakten slås til.
- **Afvigelse fra prompten:** Prompten sagde en knap i bjælken, der skifter frem og tilbage. Erfaringerne (U4) siger, at en til/fra-knap er en kontakt med et fast navn i Styr-boksen, så det blev en kontakt, og teksten på siden har en knap til den. Navnet er "Roverens foto" (ental), for der er kun én rover ved hvert sted.
- **Farverne:** Efterbehandlingen (ACES og eksponeringen, der følger lyset) ville ændre fotoets farver. Shaderen sender derfor fotoet gennem den omvendte ACES-kurve, så det vises med NASA's farver.
- **Filer:** 8k på pc (3,5-3,6 MB pr. foto), 4k på touch og hvis grafikkortet ikke kan klare 8k (ca. 1 MB), testudgaver 60 KB og masker 70-160 KB. I alt ca. 10 MB i repoet. Hentes først, når kontakten slås til.
- **Rettet undervejs:** Den første maske talte dybe skygger mellem klipperne og under roveren som "uden data", så det tegnede landskab skinnede igennem som orange pletter, og den gav en stribe i sømmen ved landingsstedet. Nu er kun sorte områder, der rører fotoets øverste eller nederste kant, uden data, og masken regnes rundt om sømmen.
- **Hjælpen og "Om AtomLab"** nævner nu også Jezero og rovernes fotos (det manglede efter M8b).
- **Testkøreren:** 15 minutter pr. test i stedet for 10 (`mars` tog 591 af 600 s efter M8b).
- **Prøvebilleder (fuld grafik i testbrowseren, `landskab-lille.mjs … ,foto`):** Ved Naukluft står Mount Sharp samme sted og har samme form i det tegnede og i fotoet (ingen synlig forskel). Ved landingsstedet passer randens form og bakken foran deltaet, men fotoets rand står 1-2° over den tegnede. Mod højdekortet passede fotoet inden for ca. 0,5°, og den tegnede rand er svag i disen, så det er ikke afgjort, om forskellen er rigtig. Fotoets lyse himmel ved Solen giver et lyst bånd, hvor det toner over i den tegnede himmel. Billeder i sekundet (fotoet slået fra): 0,39-0,41 som før (L1: 0,37-0,49).

## Status efter M8b (31. oktober 2026): Stå på Mars ved Jezero
- **Lavet:** To steder ved Jezero (`LANDSKAB.jezero` i `js/kosmos/mars.js`): "Ved randen" (Perseverances stop på sol 1301, 17. oktober 2024, 18,4695° N, 77,2930° Ø, −2.056 m, kigger mod øst-sydøst (95°) ud over deltaet og krateret, lander kl. 16:30 med Solen i ryggen) og "Landingsstedet" (Octavia E. Butler Landing, 18,4446° N, 77,4509° Ø, −2.570 m, kigger mod vest mod deltaets front, lander kl. 7:30). Knappen "🧍 Stå på Mars" ved Jezero-stoppet går til randen. Stederne står i træet under Jezero. Siderne `stå-randen` og `stå-landing` i `js/data/sider/mars.js` med 3 tal hver.
- **Data:** Mars 2020's landingskort (HiRISE 1 m og 25 cm, USGS) tæt på og i mellemlaget, hvor det dækker (ca. 7 %), ellers CTX-højdekortet over hele krateret (20 m) og helt ude HRSC+MOLA. Kortene ligger i striber på én række, så de blev hentet hele først (9,2 GB, `orig=` i `lav_landskab.py`). Lagene fylder 84 MB (testudgaver 3,7 MB). Mellemlagets højdekort er 18,8 MB (Gale 10,7 MB). Det kunne gøres ca. 40 % mindre med en grovere højde, men på den flade kraterbund kunne det give striber i lyset, så det er ikke gjort.
- **Resten af M7b:** Mellemlaget bruges nu som detaljekort på kloden ved Gale- og Jezero-stoppet (`detalje` i `LOKALE`, 64 × 64 km, ca. 32 m pr. pixel i 2k, overgang på 6 km). Det kunne bruges direkte, fordi meterne fra kraterets nulpunkt er en lige skalering af bredde og længde: Kun højderne skulle kodes om (`gem_detalje` i `lav_landskab.py`, ved Gale `python3 lav_landskab.py landskab gale detalje`, så Gales lag ikke laves om). Det hentes også, mens kameraet flyver ned til Stå på Mars.
- **Billeder (testbrowseren, fuld grafik):** Fra randen kl. 16:30 ses skråningen, kraterbunden og landet bag den lave østrand i disen. Kl. 7:30 kigger man lige mod Solen, og relieffet forsvinder, derfor eftermiddagen. Fra landingsstedet kl. 7:30 ses deltaets front med bakkerne foran, som i udsigten i planen. Billeder i sekundet: 0,39 begge steder (Naukluft i L1: 0,37-0,49), så ikke langsommere.
- **Faktatjek:** `docs/fakta-solsystemet.md` under "Faktatjek M8b". Rettet: randen (et nedslag, "måske også ældre nedslag", ikke "en asteroide"), hvordan roveren fandt et sikkert sted (farerne stod på et kort, tegnet på forhånd), CTX-højdekortet (lavet bagefter af holdet, ikke til landingen), afstanden til deltaets front (2-3 km) og at Octavia E. Butler Landing er holdets kaldenavn.
- **Kendt fejl i kilden: sømme i CTX-højdekortet.** JPL's mosaik over hele krateret er sat sammen af striber, og to steder mødes de med ca. 20-25 m forskel, blandet ud over ca. 500 m og med et lille trin (ca. 4 m) til sidst. Det ses som tynde, lige streger nord-syd hen over kraterbunden ved Jezero-stoppet (ca. 77,8° Ø) og vest for randen (ca. 77,05° Ø). Fire forsøg på at fjerne dem i `lav_landskab.py` blev droppet: Et medianfilter mod HRSC fjernede dem ikke, et filter langs sømmen gav nye striber over det hele, og en rettelse, der kun tager lange, lige spring, var ren, men for svag (op til 6,5 m). Højdekortet er derfor uændret, og "Billederne" siger det. Idé til senere: lav selv mosaikken af USGS' CTX-striber (`mars2020_trn/CTX/DTM_…_Jezero_F05X/J03X/J21_J22X`, de overlapper med 20-30 km, så de kan blandes blødt) og brug JPL's kun øst for 77,9° Ø.
- **Ikke lavet:** Hjælpen og "Om AtomLab" i index.html nævner kun Gale. index.html blev ikke rørt, mens U4 blev bygget (jeres besked). U4 er nu merget, så de to sætninger kan rettes i næste session.

## Status efter L1 (31. oktober 2026): lyset i Stå på Mars, den billige del
**Facit:** NASA's panorama PIA20332 (hentet fra `assets.science.nasa.gov`, 29.163 × 6.702 pixel, kun brugt som sammenligning, ikke i programmet). Målt i fotoet (sRGB 0-255): himlen ved horisonten ca. 230, jorden ca. 100, de mørkeste 5 % af jorden 15-30. Fotoet er hvidbalanceret (himlen er blågrå), så farverne er ikke taget derfra, kun forholdet mellem lys og mørkt.

**Rodårsagerne (målt i billederne før):**
1. **Himlen blev ikke lysere, når Solen steg over 30°, men det gjorde jorden.** Kl. 12 var jorden lysere end himlen øverst i billedet (153 mod 147), og på fotoet er horisonten det lyseste.
2. **For meget himmellys i skyggerne.** Ved lav sol kom omtrent halvdelen af lyset på jorden fra himlen, så skyggerne kun var ca. 3 gange mørkere end det belyste. Derfor var relieffet væk.
3. **Gløden** gav Solens store skær. Det stod ikke i himlens shader (kun en strålekrans på ca. 1°).

**Ændret (kun konstanter, ét led i himlens shader og eksponeringen, intet koster mere pr. pixel):**
- `SOLLYS` 2,4 → 2,2 og `HIMMELLYS` 0,55 → 0,18 (`js/solsystem/landskab.js`).
- Himlen: Lysstyrken følger Solen helt op til zenit (`HIMMEL_STYRKE` 1,5), og den er mørkere og mere mættet opad. `TAU` er uændret (0,4), så disen er fysisk den samme, og "Ærligt talt" ("en enkel model") passer stadig. Ingen ny tekst, så intet faktatjek.
- **Mens man står:** Gløden er slået fra (det sparer et trin i efterbehandlingen), og Solens skær står i himlens shader. Eksponeringen tilpasser sig delvis lyset på jorden (`eksponering(solY)`, 0,85 ved Solen 22°, mellem 0,55 og 1,5), som et kamera eller øjet. Tonemappingen er stadig ACES. Begge dele sættes tilbage, når man letter eller skifter skærm (`forladLandskab`, tjekket i testen `landskab`).
- Starttiden: kl. 07:30 (Solen 22°) begge steder, før 08:30 og 09:00.
- `tests/vaerktoejer/landskab-lille.mjs` venter nu, til landingen er færdig. Før blev blikket i det første billede overskrevet af landingen.

**Målt efter (samme billeder, mod Mount Sharp):** Himlen ved horisonten er lysere end jorden på alle tidspunkter, også kl. 12 (set i billederne, for målefeltet ramte også Mount Sharp), og jorden kl. 17 går fra 42 til 134 (de mørkeste og lyseste 5 %, før 56 til 128). Solnedgangen kl. 17:30: en lille skarp skive med et blåligt skær omkring, og efter solnedgang den blå glød. Billeder i sekundet i testbrowseren uden grafikkort: 0,37 før og 0,38-0,49 efter (ikke langsommere).

**Ikke afprøvet (til jeres runde til sidst, på pc og tablet):**
1. Er det for mørkt nu? Lyset er justeret efter tal og NASA's foto, ikke efter jeres øjne. Er det for mørkt eller for kontrastrigt, rettes `EKSPONERING`, `SOLLYS` eller `HIMMELLYS` (ét tal hver).
2. Kør dagen med ▶: Føles det naturligt, at billedet bliver lidt mørkere ved middag og lysere ved morgen og aften (eksponeringen tilpasser sig)? Pumper det mærkbart?
3. Solen uden glød: Er den for lille eller for svag på tabletten? Skæret omkring den står nu i himlens shader.
4. Forgrunden er stadig ret flad tæt på. Det skyldes mest højdekortet (reelt 2-3 m), ikke lyset. Det er L2 (ambient occlusion).
5. Kører det mindst lige så glat som før på tabletten (gløden er slået fra, mens man står)?

## Stå på Mars: lyset og kvaliteten (31. oktober 2026, fund og muligheder, intet er ændret endnu)
**Anledning:** Jeres iagttagelse: "Det ser ret lyst ud, når man står der." Der er kun læst kode og taget prøvebilleder. Intet er justeret, og der er ikke målt på rigtigt grafikkort.

**Prøvebilleder** (`node tests/vaerktoejer/landskab-lille.mjs naukluft 135,8,8.5 135,8,12 135,8,16.5 0,8,12`, fuld grafik uden grafikkort, 900 × 560, kamera mod Mount Sharp, billederne ligger i `tests/billeder/landskab/` og er ikke med i repoet):

| Klokken | Solens højde | Hvad billedet viser |
|---|---|---|
| 08:30 (**startværdien**, `tid: 8.5`) | 37° | Pæne skygger af klitterne, men himlen og jorden har næsten samme lysstyrke og farve. |
| 12:00 | 82,7° | Næsten ingen skygger (Solen næsten i zenit), fladt og lyst. Det værste billede. |
| 16:30 | 22° | Lidt mere relief end kl. 12, men stadig lys himmel og kraftig dis. |

**Kørslen:** Ingen fejl. Træk med musen mod højre drejer kompasset fra 0° til 333° (rigtig retning). Billeder i sekundet: 0,39 uden grafikkort (værdiløst, se nedenfor om pc).

**Fund (det, billederne og koden peger på, i den rækkefølge jeg tror på dem):**
1. **Himmel og jord er lige lyse.** Himlen (`himmel()`) er en gulbrun flade, og jorden er gulbrun i næsten samme lysstyrke. Dermed mangler den kontrast, der får landskabet til at stå frem. Det er det, der får det til at se "lyst" ud, mere end selve jorden.
2. **Disen er kraftig.** Det fjerne landskab (Mount Sharp) blandes ind i horisontens farve (`ud * T + himmel * (1 - T)`), og himlens horisont er det lyseste sted. `TAU` er 0,4 (klar tid, rigtigt for april 2016), så det er kun delvis en fejl: Rigtige fotos har også dis, men fotoene fra roverne virker mørkere, fordi de er hvidbalanceret og eksponeret efter jorden.
3. **Solens lys er skaleret frit.** `sollys()` giver 2,4 og `himmellys()` ca. 0,55 × farve + himlens bidrag ovenfra (0,55 + 0,45 · n.y). Skyggerne bliver derfor aldrig rigtig mørke, og det sparer relieffet.
4. **Efterbehandlingen er fælles for hele programmet** (`scene3d.js`): ACES-tonemapping, eksponering 1,05 og glød (UnrealBloom, styrke 0,9, tærskel 0,82). Den er sat til rum og stjerner. Her løfter ACES mellemtonerne, og gløden lægger et skær over lyse flader. Ikke målt hver for sig endnu (se "Næste måling").
5. **Standardtiden** er 08:30 (37°). Det er ikke middag, så det er ikke dér, det går galt, men 37° er højt nok til, at skyggerne er korte. Lav sol (15-25°) giver mere relief.
6. **Fysik:** Rigtige Mars-fotos er faktisk ret lyse og flade ved høj sol, fordi himlen er tæt og støvet. "Realistisk" og "flot" er ikke det samme, og I har sagt, at kvaliteten og æstetikken er det vigtigste.

**Muligheder for at gøre det bedre** (ikke besluttet, ingen er gjort):
- **Billig, meget synlig:** Sænk `sollys` og `himmellys` (fx 1,6-1,8), gør himlen lidt mørkere og mere mættet over for horisonten, dæmp disen en smule, dæmp gløden og tonemappingen kun mens man står (ikke i resten af programmet), og start på en lavere sol (morgen 07:00-08:00 eller sen eftermiddag).
- **Mellem:** Blødere skygger fra skyggekortene, ambient occlusion i sprækker og lavninger, rigtigt farvefoto fra HiRISE/CTX i stedet for gråtone med rust-forløb (HiRISE-farve dækker kun smalle striber), flere slags sten, riller og sand tæt på, dis og støv i lag.
- **Dyrt eller stort:** Rovernes panoramafotos som reference ved siden af (M8c), Curiosity som 3D-model (M8c, `assets.science.nasa.gov` er åben siden 31. oktober 2026), skarpere højder end 1 m findes ikke.
- **Pas på prisen:** Stå på Mars kører allerede på ca. 45 % af hastigheden ved hele Mars på pc og 56 % på tablet (testbrowseren, se M8a). Alt, der koster pr. pixel (AO, bløde skygger, volumetrisk dis), skal måles på tabletten.
- **Et lysbord til tabletten** (`?lys` med skydere for sollys, himmellys, bloom og eksponering) blev foreslået, men **er ikke bestilt**. Jeres svar (31. oktober 2026): "Nej, du skal bare dokumentere dine findings."

**Næste måling (når I siger go):** Tag de samme billeder med gløden og tonemappingen slået fra og med lavere `sollys`/`himmellys`, så vi kan se, hvad hver del betyder. Kun billeder, ingen ændring i programmet.

**At teste på jeres egen pc (jeres svar 31. oktober 2026, noteret):** Skyen har ikke noget grafikkort, så hastighed, flimmer og "føles det rigtigt" kan ikke måles her (ca. 1,3 billede i sekundet, ét prøvebillede tager minutter). Farver og lys er de samme som på jeres skærm, for det er den samme shader. **Aftale:** Når en opgave kræver rigtig grafik (billeder i sekundet, finjustering af lys og farver, skærmbilleder i fuld opløsning, AO og bløde skygger), så bed jer om adgang til pc'en *før* arbejdet går i gang (`list_computer_folders` og `request_computer_folder`, kræver at I har sat Remote Control op: Claude-appen, Indstillinger, Claude Code, Remote Control, eller `claude remote-control` i mappen). I godkender selv forbindelsen. Tablet og telefon kan ikke styres derfra. Dem prøver I selv: kør `python -m http.server 8000` på pc'en og åbn `http://<pc'ens IP>:8000` på tabletten på samme wifi, så ses ændringerne uden at vente på en merge.

## Plan for M8: Stå på Mars (30. oktober 2026, go givet)
*M8a og M8b er bygget. Afsnit 1-5 og 8 (stederne, dataene, overgangen, teknikken, himlen og vejen derhen) står i [arkiv/plan-mars-faerdigt.md](arkiv/plan-mars-faerdigt.md) under "Plan for M8, afsnit 1-5 og 8". Her står det, M8c bruger.*
**Jeres svar (30. oktober 2026): "Generelt går vi med dine anbefalinger. Go."** Alle syv anbefalinger gælder: de fire steder (Naukluft og Curiosity nu ved Gale, randens inderside og landingsstedet ved Jezero), et eget landskab i ringe, skyder og "Lad dagen gå", Phobos og Deimos på himlen, rovernes fotos og 3D-modellen, tre dele (M8a, M8b, M8c) og domænet. I har åbnet `assets.science.nasa.gov` (virker: `Curiosity_static.glb` er 11,9 MB).
- **Størrelse og kvalitet (jeres ord):** "Størrelse i sig selv er ikke et problem. Så længe det kan køre godt, må det gerne fylde, medmindre du advarer imod det. Det vigtigste er kvaliteten. Jeg er æstetiker." Lagene må derfor gerne være større og skarpere end i forslaget, så længe tabletten kører godt (målt).
- Én PR pr. del, som Opus selv merger, når testene er grønne. M8b og M8c bygges efter hinanden uden nyt go, medmindre noget er uklart (go til hele M8).

*Lavet af Opus. Billederne til planen ligger i `docs/m8/`. Udsigterne er tegnet af et lille værktøj ud fra de rigtige højdekort (Mars' krumning, dis med afstanden og en lav morgensol fra øst). De viser kun formen på landskabet, ikke fotos, farver eller himlen, som programmet vil tegne dem. Rovernes pladser er fra NASA's egne kortdata (`mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` og `…/M20/…/M20_waypoints.json`, hentet i dag).*

**Kilderne er tjekket med curl i dag:**
- **Kan åbnes:** USGS' arkiv (`asc-pds-services…`, både `mosaic/Mars/MSL/` og `MSR_TRN_HiRISE…`), `planetarymaps.usgs.gov` (nyt fund: Mars 2020-landingens kort), søgesiderne på `astrogeology.usgs.gov/search/map/…`, `science.nasa.gov` (også Photojournal-siderne), `mars.nasa.gov` (rovernes kortdata), `hirise.lpl.arizona.edu`, `www.uahirise.org`, `static.uahirise.org` og `raw.githubusercontent.com`.
- **Blokeret af miljøet (403 fra proxyen):** `assets.science.nasa.gov` (NASA's billedfiler: panoramaerne i fuld størrelse og roverens 3D-model), `www.usgs.gov` (`astrogeology.usgs.gov/` sender videre dertil, men søgesiderne virker), `hirise-pds.lpl.arizona.edu` (HiRISE' egne højdekort, ikke nødvendige, for USGS har dem), `stac.astrogeology.usgs.gov` og `nasa3d.arc.nasa.gov`.
- **Siden afviser selv:** `upload.wikimedia.org` svarer 429 (for mange forespørgsler) på panoramaerne i dag. `github.com` giver 403 (sessionens egen adgang).
- **Kun `assets.science.nasa.gov` betyder noget for M8** (panoramaerne og roveren, spørgsmål 6 og 7). Resten af planen kan bygges uden.
- **Tjekket igen 31. oktober 2026: `assets.science.nasa.gov` er åben.** Curl giver 200, og `…/psd/mars/resources/gltf_files/24584_Curiosity_static.glb` er 11.860.016 byte (11,9 MB).

### 6. Panoramaerne
- **Kan bruges:** ja, licensen er fri (NASA/JPL-Caltech/MSSS og NASA/JPL-Caltech/ASU/MSSS). Filerne ligger på `assets.science.nasa.gov`. Den var blokeret, da planen blev skrevet, men er åben siden (tjekket 31. oktober 2026). Wikimedia svarede 429.
- **Anbefaling: en egen visning, "📷 Rovernes foto",** ved de steder, hvor fotoet er taget: G2 Naukluft (PIA20332, Mastcam i farver, april 2016) og J1 Landingsstedet (PIA24264, Mastcam-Z i farver, 142 billeder, eller PIA24422, Navcam). Fotoet lægges på en cylinder om kameraet, så man drejer på samme måde og ser i samme retning som i 3D (fotoet drejes, så Mount Sharp og randen står samme sted som i landskabet, målt ved at sammenligne horisonten). Over og under fotoet fyldes med himmel og jord, der toner ud. Det er den bedste "Ærligt talt": Man kan skifte mellem det tegnede og det fotograferede fra præcis samme sted.
- **Ærligt:** Fotoene er hvidbalancerede (som om de var taget på Jorden), så de er mindre røde end Mars i virkeligheden. Det står i teksten.
- **Størrelse:** ca. 8192 pixel bredt på pc (ca. 3-4 MB) og 4096 på tablet.

### 7. Roveren
- **Anbefaling: roveren som 3D-model ved G3 "Hos Curiosity nu"** med den rigtige retning og hældning fra NASA's kortdata (sol 5045: retning 161,5°, hældning 13,5° op ad bakken). Ved G2 og J1 står i stedet et lille skilt: "Her stod Curiosity i april 2016" og "Her landede Perseverance".
- **Modellen:** NASA's `Curiosity_static.glb` (fra science.nasa.gov/resource/curiosity-rover-3d-model) ligger på `assets.science.nasa.gov` (blokeret, da planen blev skrevet, åben 31. oktober 2026: 11,9 MB). NASA's 3D-modeller er frie (ingen ophavsret), men man må ikke antyde, at NASA anbefaler noget. Kræver `GLTFLoader` fra `three@0.186.1` (en addon-fil). Er filen over ca. 10 MB, spørger jeg, om den må gøres mindre med et værktøj (fx `gltf-transform`, ikke et byggetrin).
- **Spor:** Hjulsporene ses ikke i fotoene fra kredsløb ved roverens plads nu. Programmet kan tegne svage spor efter den rigtige rute (fra kortdataene) de sidste ca. 100 m. Det står i "Ærligt talt", at de er tegnet.

### 9. Tekster (udkast, alt faktatjekkes med `/faktatjek` i byggefasen)
- **Hvad man ser:** Ved Gale: Mount Sharp, lagene, klitterne, kraterranden mod nord, hvor langt der er til tingene (målt i programmet). Ved Jezero: deltaet under én, kraterbunden, hvor Perseverance landede, og randen på den anden side.
- **Roverens fund:** Gale: søer med vand, mikrober kunne have levet i, organiske stoffer (ikke afgjort), roverens rute op ad bjerget. Jezero: deltaet, prøverne i rør, Cheyava Falls (muligt biospor), Ingenuity.
- **Det, der ændrer sig** (rovernes plads, km, prøver og Mars Sample Return), slås op samme dag, som teksten låses, og skrives med måned og år ("i oktober 2026").
- **"Ærligt talt":** Højderne er målt fra kredsløb (HiRISE i stereo, ca. 1 m mellem højderne, reelt lidt grovere), så sten under ca. 1-2 m er der ikke. Fotoene fra kredsløb er grå, og farverne er sat på af programmet. Himlens farve og disen er en enkel model. Solens og månernes pladser er regnet, men årstiden er valgt. Øjenhøjden er en voksens. Rovernes plads er fra NASA's kort på en bestemt dato. Ved Phobos og Deimos (fra jorden) er de i den rigtige størrelse.
- **Fagord (forslag):** klit, butte (et lille bjerg med flad top), sol (et døgn på Mars) og måske ortofoto. Findes allerede: rover, delta, biospor, nedslagskrater.

### 10. Hvad det koster
- **Filer:** ca. 36 MB i alt (afsnit 2), hentet først, når man trykker "Stå på Mars" (det tætte lag måske allerede ved stoppet, som `hentNæste`).
- **Grafikkort:** ca. 65 MB pr. krater oven i Mars.
- **Billeder i sekundet:** Landskabet erstatter kloden (som skjules), så antallet af punkter er som i dag. Himlen og skyggekortet er nye. Måles i testbrowseren på pc og tablet før og efter (én ad gangen).
- **Hvis det bliver for tungt på tabletten:** først færre ringe og retninger (768 × 384), så skyggekortet sjældnere og i lavere opløsning, så 2048-fotos i stedet for 4096 og til sidst det tætte lag på 1 × 1 km.

### 11. Opdeling
**Anbefaling: tre dele med et go imellem:**

| Del | Hvad | Hvorfor |
|---|---|---|
| **M8a** | **Gale** med al teknikken: billedværktøjet, landskabet i ringe, lagene, himlen, disen, Solen, skyggerne, tid på dagen, Phobos og Deimos, kameraet, overgangen fra kredsløb, G2 Naukluft og G3 Curiosity nu (uden 3D-model), tekster og faktatjek. | Det svære løses ét sted. Gale har den flotteste udsigt. |
| **M8b** | **Jezero:** J2 Randens inderside og J1 Landingsstedet, data fra Mars 2020's kort, tekster og faktatjek. | Genbruger M8a. Rovernes tal slås op tæt på, at teksten kommer ud. |
| **M8c** | **Rovernes fotos og roveren:** "📷 Rovernes foto" ved G2 og J1, Curiosity som 3D-model ved G3 og sporene. | Kræver, at `assets.science.nasa.gov` åbnes. Kan springes over, hvis I ikke vil. |

### 12. Model og effort
- **Opus med høj effort** til alle tre dele. Det svære er dybden, overgangen og skyggerne, og det kan tjekkes med billeder og tal. Xhigh er ikke nødvendig: ingen svær fysik, og fejl kan ses med det samme. Fable bruges ikke (`plan-fable.md`).
- **Hjælpeagenter:** Opus med høj effort til `/faktatjek` (højst 2), Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs.

### Beslutninger, der bekræftes ved go (anbefalingerne står først)
1. **Stederne:** To ved hvert krater: G2 Naukluft og G3 Curiosity nu ved Gale, J2 Randens inderside og J1 Landingsstedet ved Jezero. (Eller kun G2 og J2. Eller G1 Bradbury Landing i stedet for G2 eller G3.)
2. **Landskabet:** et eget landskab i ringe om stedet med tre lag og en overgang fra kredsløb (A). Eller endnu et lokalt net på kloden (B, ryster helt tæt på).
3. **Tid på dagen:** skyder, "▶ Lad dagen gå" og "Solnedgang" (A). Eller kun tre knapper: Morgen, Middag og Solnedgang (B).
4. **Phobos og Deimos på himlen:** ja, i den rigtige størrelse og på den rigtige plads (A). Eller nej (B).
5. **Panoramaerne og roveren:** med i M8c, hvis I åbner `assets.science.nasa.gov` (A). Eller kun panoramaerne (B), kun roveren (C) eller ingen af dem (D).
6. **Opdelingen:** M8a (Gale og teknikken), M8b (Jezero), M8c (fotos og roveren). Eller to dele (M8a Gale, M8b Jezero, fotos og roveren).
7. **Domænet:** Åbn `assets.science.nasa.gov` under Network access, hvis I vælger A, B eller C i spørgsmål 5. Det skal være åbent, før M8c går i gang (gerne før M8a, så modellens størrelse kan tjekkes tidligt).

## Teknik
**Det, der genbruges:** kameraets rejse (`js/solsystem/rejse.js`), flybyens stop med undertekst og "Næste" (fra `saturn.js`), højdekort med 16 bit og relief fra Jorden (`js/kosmos/jorden.js`), atmosfæren med skalahøjde (`js/solsystem/atmosfaere.js`) og billedværktøjet (som `billeder/solsystem/lav_saturn.py`).

**Skalaen:** 1 enhed = 1.000 km (forslag). Mars har en radius på ca. 3.390 km, Deimos kredser ca. 23.460 km fra Mars' midte, og Phobos er kun ca. 11 km i radius. Rejsen skalerer systemet, så små ting kan ses tæt på, ligesom ved Saturn.

**Højderne:** Olympus Mons er ca. 22 km høj, og det er kun ca. 0,6 % af Mars' radius. Set fra kredsløb er det næsten fladt, men skråt fra siden og tæt på kan det ses. Kuglen får rigtige højder i geometrien (et net, der løftes efter højdekortet i vertex-shaderen), så bjergene rager op over horisonten. Gør vi bjergene højere end i virkeligheden for at se dem langt væk fra, så siges det ærligt i nørd-teksten. Det afgøres i M2, når vi kan se det.

**Detaljerne:** Et kort på 4096 × 2048 giver ca. 5 km pr. pixel ved ækvator. Det er flot på afstand, men udvisket tæt på (Jezero er kun ca. 45 km bred). I M7 får hvert sted sit eget lille kort med billede og højde i høj opløsning, som glider ind, når kameraet kommer tæt på. CTX-billederne er i gråtoner, så farven tages fra det store kort. Det siges i nørd-teksten.

**Billederne (fundet 24. oktober 2026 hos USGS, `asc-pds-services.s3.us-west-2.amazonaws.com`, som kan hentes i miljøet):**
- Mars i farver: Viking MDIM 2.1 (`mosaic/Mars_Viking_ClrMosaic_global_925m.tif`, 0,8 GB, og en udgave med 232 m pr. pixel på 12,7 GB).
- Højder: MOLA (`mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif`, 2,1 GB) og HRSC og MOLA lagt sammen (`mosaic/Mars/HRSC_MOLA_Blend/…_200mp_v2.tif`, 200 m pr. pixel, 11 GB).
- Skarpe billeder: CTX-mosaikker (`mosaic/Mars/Mars_MRO_CTX_Equi_Mosaics_Robbins/`, 6 og 100 m pr. pixel) og CTX ved mange landingssteder (`mosaic/Mars/CTX_EZs/`).
- Gale: ortofoto (25 cm pr. pixel) og højdekort (1 m pr. pixel) til Curiosity (`mosaic/Mars/MSL/`).
- Jezero: HiRISE-mosaikker og højdekort til Mars Sample Return (`mosaic/Mars/MSR_TRN_HiRISE_soc_003_USGS_release_aug2024/`).
- Phobos: farvemosaik og højdekort fra Mars Express (HRSC), SRC-mosaik og Viking-mosaik (`mosaic/Phobos_*`).
- Deimos: et kort fra Viking (`wms_basemaps/Deimos/deimoscyl4.jpg`). Formmodellen mangler (se faktagrundlaget).

**Licenserne (faktagrundlaget, del 3B):**
- Højder over hele Mars tages fra MOLA (CC0, frit). HRSC-MOLA-blandingen er CC BY-SA 3.0 IGO (HRSC er ESA/DLR/FU Berlin), så billeder lavet af den skal mærkes CC BY-SA i `KILDER.md`. Den bruges kun til de skarpe kort ved stederne (M7), hvor den gør en forskel.
- Viking, CTX, HiRISE og NASA/JPL's billeder må bruges, når kilden nævnes. Phobos' kort og højder er fra Mars Express (ESA/DLR/FU Berlin) og krediteres som CC BY-SA for en sikkerheds skyld.

**Formen på månerne (M6):** Phobos laves af USGS' højdekort fra Mars Express (`Phobos_ME_HRSC_DEM_Global_2ppd.tif`, 0,5 MB, højde over en kugle på 11.100 m). Deimos laves af Thomas' formmodel fra 1993 (et gitter på 5°, hentet fra et GitHub-spejl med den rigtige kontrolsum). For Deimos er det usikkert, om længdegraderne er østlige eller vestlige, så det tjekkes mod kortet, ellers bliver Deimos spejlvendt.

**Panoramaerne (M8):** Der er fundet to brugbare 360°-striber (Curiositys Naukluft-panorama, PIA20332, og Perseverances panorama fra landingsstedet, PIA24422), men ingen er en hel kugle, så himlen og jorden skal fyldes ud. Derfor er landskabet i 3D af højdekort og fotos fra kredsløb stadig hovedforslaget.

**Netsider i miljøet (tjekket 24. oktober 2026, efter I åbnede domænerne):** nssdc.gsfc.nasa.gov, science.nasa.gov, mars.nasa.gov, photojournal.jpl.nasa.gov, en.wikipedia.org, commons.wikimedia.org, www.esa.int, pds-geosciences.wustl.edu, astrogeology.usgs.gov (søgesiden), USGS' S3-arkiv, raw.githubusercontent.com og pypi kan åbnes. www.jpl.nasa.gov (CloudFront) og sbnarchive.psi.edu (Cloudflare) afviser selv automatiske forespørgsler. Det kan miljøet ikke ændre, så brug science.nasa.gov og photojournal i stedet, og forsøg ikke at snyde dem. Tjek med `curl`, før hjælpeagenter sættes til at søge.

**Domæner, der skal på listen (gennemgået 25. oktober 2026, jeres svar: skriv det ind):** I har bedt om en liste over de domæner, planerne får brug for ud over jeres liste. Tjekket med `curl` samme dag:
- **Snart:** `asc-pds-services.s3.us-west-2.amazonaws.com` (USGS' arkiv: M6-M8 og S3. Virker, men står ikke på listen), `raw.githubusercontent.com` (Deimos' formmodel i M6. Virker, men står ikke på listen), `pds-rings.seti.org` (S2, blokeret), `ssd.jpl.nasa.gov` og `ssd-api.jpl.nasa.gov` (JPL Horizons til Solsystemet trin 2, blokeret).
- **Faktatjek:** `www.nasa.gov`, `ntrs.nasa.gov`, `sci.esa.int`, `www.planetary.org`, `arxiv.org` og `doi.org` (alle blokeret).
- **Senere:** `hirise.lpl.arizona.edu` (M7-M8, hvis USGS' HiRISE ikke er nok), `www.iaea.org` og `www.nrc.gov` (Tjernobyl).
- **GitHub:** `github.com` står på jeres liste, men en udgivelse gav stadig 403. Det betyder kun noget for KTX2 (`basisu`).
- **Tjekket igen 25. oktober 2026, efter I tilføjede dem:** Alle kan nu åbnes undtagen fire. `www.jpl.nasa.gov` (CloudFront), `sbnarchive.psi.edu`, `www.iaea.org` og `agupubs.onlinelibrary.wiley.com` (Cloudflare) afviser selv automatiske forespørgsler, så det kan listen ikke ændre. `msss.com` svarer ikke, men `www.msss.com` virker. GitHub afvises af sessionens egen adgang til repoer ("brug add_repo") og ikke af listen. En udgivelse fra et andet repo (fx `basisu`) kræver derfor, at repoet tilføjes til sessionen med `add_repo`.
- **Jupiter (tjekket 6. november 2026, I åbnede dem samme dag):** `archive.stsci.edu` (Hubbles OPAL-kort, virker kun med Mozillas rodliste, se erfaringer.md under "Certifikater"), `www.missionjuno.swri.edu` (JunoCam), `ui.adsabs.harvard.edu`, `export.arxiv.org` (søgning i arXiv), `hubblesite.org` og `www.solarsystemscope.com`. `assets.science.nasa.gov` er nu åben (NASA's Photojournal). Stadig lukket: `www.sciencedirect.com` og `agupubs.onlinelibrary.wiley.com` (Cloudflare afviser selv), `esahubble.org` (svarer ikke), `api.adsabs.harvard.edu`, `authors.library.caltech.edu`, `www.jpl.nasa.gov` (403), `images-assets.nasa.gov`, `mast.stsci.edu`, `iau.org` og `britannica.com`. Ingen af dem er nødvendige for at bygge Jupiter.

**Store filer:** De fleste filer er for store til at hente hele. Forslag: Python-pakken `rasterio` læser kun det stykke af en stor GeoTIFF, der skal bruges, direkte over nettet. Den bruges kun af billedværktøjet (`lav_mars.py`), ikke af programmet, så det er ikke et byggetrin. I har sagt ja (24. oktober 2026), og I må gerne få forslag til andre værktøjer, der gør arbejdet hurtigere eller kvaliteten bedre.

**Skarpheden (jeres svar 24. oktober 2026):** Mars får et kort på 8k (8192 × 4096, ca. 2,6 km pr. pixel) på pc, og 8k prøves også på tabletten i M2 (ellers 4k). De skarpe kort ved stederne kommer i M7. Hele Mars i høj opløsning overalt (kort i firkanter, der hentes efter behov) fylder mange GB og passer ikke på GitHub Pages.

**Hvad det koster for tabletten:** Månernes kort er 4k på pc og 2k på tablet og telefon som ved Saturn. Nettet med højder og de lokale kort i M7 er nyt, så billeder i sekundet måles før og efter (tjekliste F).

**Komprimerede teksturer (forslag til M2):** KTX2 (Basis Universal) bliver i grafikkortet komprimeret og fylder 4-8 gange mindre end et almindeligt billede. Et 8k-kort fylder ellers ca. 170 MB i grafikkortet (med mipmaps). Det kræver addon-filen `KTX2Loader` og transcoderen (en lille wasm-fil) fra `three@0.186.1` i `lib/three/` og værktøjet `basisu` til at lave filerne. Intet byggetrin. Det prøves og måles i M2, og der bruges JPG, hvis det ikke ser lige så godt ud.

## M8c del 3: stenene og terrænet (jeres fund 3. november 2026)
*Hentet 5. november 2026 fra grenen `claude/relaxed-cori-h0yxvd`, som ikke blev merget.*
**Jeres fund:** "Når man står på Mars, ser stenene meget ensartede ud." Jeres svar på hvor: "Mest dem helt tæt på, men også længere væk." Jeres besked: "Skriv det ind i M8c." Der er ikke sagt go til at bygge det endnu.

**Årsagen (læst i `js/solsystem/landskab.js`, linje ca. 196-226):** Stenene er ikke modeller, men tegnes i shaderen i to lag af tilfældige celler (0,32 m og 0,11 m). Alle har næsten samme form og højst ca. en halv meters størrelse. De tegnes kun inden for ca. 1,2-9 m fra kameraet (`fod`, `naer`). Længere væk er der kun fotoet med 25 cm pr. pixel, så der er ingen enkeltsten, og der er et hul mellem de små sten og de store former.

**Mulighederne, billigste først (min anbefaling er trin 1-3, derefter 5):**
1. **Mere variation i den eksisterende shader:** flere størrelser (småsten til blokke på 1-2 m), flere former (flade plader, runde), forskellig farve pr. sten, klynger styret af støj og sand, der samler sig på den ene side af stenene. Næsten gratis.
2. **Ambient occlusion (L2 i "Resten af Mars", afsnit 3):** mørkere i sprækker, lavninger og ved stenenes fod, regnet én gang pr. lag som skyggekortene. Ét opslag mere pr. pixel.
3. **Et mellemlag af sten på ca. 0,5-3 m**, der fades ind mellem de små sten og fotoet. Det løser "også længere væk". Måles på tabletten.
4. **Rigtige 3D-sten som instanser** (`InstancedMesh`, 3-5 former, nogle tusinde stk., skrues ned med `LAV_KVALITET`), hvis det stadig er fladt efter 1-3. Skyggekortene skal tage dem med. Dyrest på tabletten.
5. **Rigtige data:** Fordelingen af sten (størrelse og tæthed) ved Naukluft og landingsstedet tages fra panoramaerne i del 1 (PIA20332 og PIA24264) og fra NASA's data om stenene (kilder skal findes og faktatjekkes), i stedet for at gætte. Sig i "Ærligt talt", hvad der er målt, og hvad der er tegnet.
6. **Bedre materiale** (normalkort for rifler og revner, lag i de store sten) og **støv og stemning** (støv i luften, sandkorn): kun hvis det stadig mangler.

**Prompt (til når I siger go, skrevet 3. november 2026):**
> Lav M8c del 3: stenene og terrænet i Stå på Mars. Læs CLAUDE.md, "Lige nu" (`docs/lige-nu.md`), `docs/erfaringer.md`, "M8c del 3" og L2 i `docs/plan-mars.md` og stenkoden i `js/solsystem/landskab.js` (ca. linje 196-226). M8c del 1 er merget, så panoramaerne kan bruges som facit.
>
> **Først:** Tag få, små billeder af Naukluft og landingsstedet fra samme retning som panoramaerne (`tests/vaerktoejer/landskab-lille.mjs`), og sammenlign stenenes størrelse, form, farve og tæthed med fotoerne. Skriv, hvad der er forkert, før noget ændres. Mål billeder i sekundet på pc og tablet før og efter (tjekliste F i `docs/erfaringer.md`).
>
> **Mål:** Stenene skal ikke se ens ud, hverken helt tæt på eller 10-100 m væk. Byg trin 1, 3 og 2 (i den rækkefølge). Hold shaderen under det antal opslag, tabletten kan klare. Kom først med 3D-instanser (trin 4), hvis jeg siger det efter billederne.
>
> **Tekster:** Opdater "Ærligt talt" ved stederne, så den siger, at stenene er tegnet af programmet efter fotoerne og ikke er hver enkelt sten fra Mars. Faktatjek tal om stenene med `/faktatjek`.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv det, der ikke er afprøvet, i `docs/ikke-afproevet.md` (er stenene nu forskellige nok, flimrer noget langt væk, kører det glat på tabletten). Model: Opus. Effort: høj (I sætter den selv).
