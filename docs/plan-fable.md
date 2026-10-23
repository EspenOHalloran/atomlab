# Plan: Hvad Fable skal hjælpe med

*Lavet 21. oktober 2026 sammen med jer. Hvert trin får et go, før det starter. Skønnene over prisen er usikre og rettes, når vi har målt, hvad F1 kostede.*

## Hvad det går ud på
I synes, at AtomLab er godt, men I vil have Fables øjne på, hvor det kan blive bedre, så det kommer op på et professionelt niveau. Fable skal:
1. lave et eftersyn af teknikken, UI, grafikken og indholdet,
2. hjælpe med at planlægge de store dele, der venter.

Fable må ikke bruges på noget, Opus kan lave lige så godt.

**Jeres svar:**
- "Professionelt niveau" betyder i første omgang: lige så gennemført som et godt spil eller en god app, til jeres søn. At dele med skoler kommer senere (se tjeklisten i DESIGN.md).
- Budget: 10-20 $ til at starte med. I har ikke brugt Fable før.
- Fable skal hjælpe med at planlægge Solsystemet, Tjernobyl, Liv, Molekyler og måske andre idéer, men ikke den engelske udgave.
- I tager skærmbilleder på tabletten (se F0).

## Grundidéen: Opus forbereder, Fable vurderer, Opus bygger
- Fable koster 2,5 gange så meget som Opus. Anthropics priser pr. million tokens er 10 $ ind og 50 $ ud for Fable 5.1 og 4 $ og 20 $ for Opus 5.5. Det, Fable skriver og tænker, koster altså 5 gange så meget som det, den læser. Fable skal derfor læse meget og skrive kort.
- Ifølge Anthropics vejledning er Fables forspring størst ved kodeeftersyn, ved at bedømme billeder, ved uklare opgaver og ved lange, svære opgaver. Ved rutinearbejde er forskellen lille.
- Fable arbejder bedst, når den får målet, grunden og rammerne, og ikke en lang tjekliste. Den skal også have at vide, hvad der allerede er fundet, så vi ikke betaler for at finde det igen.

**Fable laver:**
- vurderinger: hvad der løfter AtomLab mest, og hvad der allerede er godt nok
- kodeeftersyn og bedømmelse af skærmbilleder
- faktagrundlag og plan for de store, svære dele (Tjernobyl og Liv)
- et kritisk tjek af Opus' udkast (Molekyler og Solsystemet)
- eftersyn, når en stor del er bygget

**Fable laver ikke** (Opus gør det lige så godt og billigere):
- tage skærmbilleder, køre tests og samle materiale
- skrive kode ud fra en færdig plan
- skrive danske tekster i den stil, AtomLab har
- små og mellemstore planer (fx panelerne og copyright)
- faktatjek af korte tekster (det gør `/faktatjek` med Opus)
- skrive forslagene ind i DESIGN.md og holde styr på trinnene

## Sådan bliver Fable kørt
Besluttet 21. oktober 2026: I starter selv en session med Fable (ikke som hjælpeagent i en Opus-session). Så kan I tale direkte med Fable, men alt i sessionen koster Fable-pris.
- **Opus laver F0 i en separat session** og lægger alt i `docs/fable/`, som pushes til `main`. Fables session starter på en frisk klon, så det, der ikke ligger i git, findes ikke for Fable. Mappen `tests/billeder/` kommer ikke med i git, så skærmbillederne skal kopieres til `docs/fable/`.
- **Første besked til Fable:** "Læs `docs/fable/brief.md` og lav F1." Briefen siger resten.
- **Effort:** `high` som standard (skiftes i sessionen). `xhigh` kun til faktagrundlaget for Tjernobyl og Liv, hvis budgettet rækker.
- Fable skriver kun i `docs/fable/` og ændrer ikke kode. Når F1 er skrevet, stopper den og går ikke videre til F2 af sig selv. Sessionen lukkes bagefter, og Opus bygger i en ny session.
- Opus skriver sine kommentarer til Fables svar i en fil ved siden af (`…-noter.md`), fx hvilke fund der er nye, og hvilke der allerede stod i eftersynet fra oktober. Fables egen fil rettes ikke.
- Hold sessionen kort: kun spørgsmål om overblikket. Tjek saldoen før og efter.
- Briefen siger, hvem AtomLab er til, hvad målet er, hvilke rammer der gælder (se nedenfor), hvad der allerede er kendt, og hvordan svaret skal se ud. For hvert fund skal Fable pege på en fil og en linje eller et skærmbillede, og den skal sige det, når den er i tvivl.

**Rammer, som Fable skal kende** (fra CLAUDE.md):
- Ren HTML, CSS og JavaScript med Three.js. Intet byggetrin, ingen npm og ingen frameworks uden at spørge.
- Al tekst er på dansk til en 13-årig. Fysikken er tæt på virkeligheden, og forenklinger siges ærligt.
- Det skal virke på pc, tablet og telefon. `LAV_KVALITET` skruer ned for effekterne på touch-enheder.
- Infopanelet i værkstedet må ikke få en rullebjælke.

## Trinnene

### F0: Materialet (Opus, ca. 2-5 $)
Opus samler materialet i `docs/fable/`. Billederne kopieres til `docs/fable/`, fordi `tests/billeder/` ikke kommer med i git.
- **`brief.md`:** briefen til F1 (se ovenfor).
- **Skærmbilleder fra testbrowseren** (`tests/vaerktoejer/skaermbilleder.mjs`), ca. 40-50 billeder:
  - menuen og alle seks skærme på pc og på tablet på højkant
  - Værkstedet, Stjerneovnen og Kosmos på telefon
  - de 15 fænomener i Kosmos på pc
  - 3-4 billeder i træk af de vigtigste animationer: et henfald, en fusion, en kædereaktion, en supernova og Big Bang

  Testbrowseren har intet rigtigt grafikkort, så gløden og farverne kan se lidt anderledes ud end på en rigtig skærm.
- **Jeres skærmbilleder fra tabletten** (5-10 stk.). Skriv også, hvilken tablet og browser det er, og om noget hakker. Forslag:
  1. menuen
  2. Atomværkstedet med et atom vist som elektronsky
  3. Stjerneovnen, lige når to kerner smelter sammen
  4. Reaktoren under en kædereaktion
  5. Det periodiske system (væggen)
  6. Kosmos: Supernova, Sort hul og Årstiderne (Jorden tæt på)
  7. Batteriet, mens det lader op
  8. **det sted, I synes ser mindst flot eller mest kedeligt ud.** Det er måske det vigtigste billede.

  Den sikre vej er at lægge dem på GitHub (Add file → Upload files) i mappen `docs/fable/tablet/`. Opus gør dem mindre, før Fable ser dem.
- **Det, der allerede er kendt:** eftersynet fra oktober (`docs/gennemgang-2026-10.md`), "Åbne punkter" i `docs/erfaringer.md` og idélisten i DESIGN.md.
- **Lidt tal:** hvor meget hver skærm skal hente, antal linjer pr. fil, og om alle tests er grønne.

### F1: Samlet overblik (Fable, `high`, ca. 5-10 $)
Fable læser briefen, CLAUDE.md (som kort over koden), DESIGN.md, eftersynet fra oktober og skærmbillederne. Den kigger i koden, hvor den har brug for det, men læser ikke alle 17.000 linjer.

Svaret står i `docs/fable/F1-overblik.md` og fylder højst ca. 3 sider:
1. **Det vigtigste først:** 3-5 linjer.
2. **Det, der er godt, og som ikke skal røres.**
3. **De 10 forbedringer, der løfter AtomLab mest** for jeres søn, på tværs af teknik, UI, grafik og indhold. For hver: hvad, hvorfor, et forslag, størrelsen (lille, mellem eller stor), og om Opus kan bygge det direkte, eller om det kræver en plan fra Fable.
4. **Idélisten:** en kort vurdering af hver idé (værdi og sværhed), og om den kræver Fable for at blive planlagt godt. Gerne 1-3 nye idéer.
5. **Hvor det betaler sig at gå i dybden** (F2), og hvorfor.
6. **Spørgsmål til jer.**

**Efter F1:**
- I tjekker saldoen før og efter, så vi ved, hvad det rigtigt kostede. Skønnene i denne plan bliver rettet.
- Opus skriver `docs/fable/F1-noter.md` om, hvilke fund der er nye, og hvilke der allerede stod i eftersynet fra oktober.
- **Stopregel (forslag):** Er færre end 4 af de 10 forbedringer nye og værdifulde, bruger vi ikke flere credits på eftersyn. Så bruges Fable kun til faktagrundlaget for Tjernobyl og Liv.
- I vælger, hvad der skal ske. Forslagene bliver til trin i DESIGN.md, og Opus bygger dem.

### F2: Dybde i 1-3 områder (Fable, `high`, ca. 5-15 $ pr. område)
Kun i de områder, I vælger efter F1. Opus samler først materialet til området.
- **Teknik:** et kodeeftersyn af opbygningen, robustheden, ydelsen på tablet og hvor let det er at bygge videre på.
- **UI:** forløbet, navigationen, sammenhængen mellem delene, touch og hvor let teksten er at læse.
- **Grafik:** lys, farver, effekter, ensartethed og det, der ser billigt ud.
- **Indhold:** hvad man lærer, rækkefølgen, teksterne og hvad der mangler, før det bliver rigtig fedt.

Svaret står i `docs/fable/F2-<område>.md` i samme form som F1.

### F3: De store dele, der venter
| Del | Udkast | Fables rolle | Skøn |
|---|---|---|---|
| Molekyler | Opus: plan og faktagrundlag med kilder | tjekker fakta og fælder og kommenterer planen | 2-5 $ |
| Solsystemet (trin 0) | Opus: faktagrundlag med kilder (planen findes) | gennemgår planen og tjekker faktagrundlaget kritisk | 5-10 $ |
| Tjernobyl | Fable fra bunden | laver faktagrundlag med kilder og en plan | 10-20 $ |
| Liv | Fable fra bunden | laver faktagrundlag med kilder og en plan | 10-20 $ |
| Andre idéer | Opus | kun hvis F1 siger, at de er svære | |

Når Opus laver udkastet, og Fable tjekker det, bliver prisen omtrent halveret. Ulempen er, at Fable bliver præget af udkastet og fanger lidt mindre. Ved Tjernobyl og Liv koster en fejl mest, så dér starter Fable forfra. Faktagrundlaget skrives i `docs/fakta-<del>.md`. Rækkefølgen bestemmes efter F1.

### F4: Eftersyn, når en stor del er bygget (Fable, ca. 5-10 $ pr. del)
Som i CLAUDE.md: test, faktatjek og et sidste kig, før delen kaldes færdig.

## Budget
| Trin | Skøn |
|---|---|
| F0: materialet (Opus) | 2-5 $ |
| F1: overblik | 5-10 $ |
| F2: dybde | 5-15 $ pr. område |
| F3: de store dele | 2-20 $ pr. del (se tabellen) |
| F4: eftersyn | 5-10 $ pr. del |
| **Det hele** | **ca. 50-150 $**, alt efter hvor mange områder og dele der kommer med |

- 10-20 $ rækker til F1 og én ting mere. Det første budget går derfor til F0 og F1, og resten bliver afgjort efter F1.
- Skønnene er usikre og kan være 2 gange forkert begge veje. Det skyldes, at Fable tænker, før den svarer, og at tænkningen betales som tekst, den skriver.
- Priserne er Anthropics API-priser. Opus kan ikke se, hvordan jeres konto trækker credits. Derfor måles F1.

## Det kan Fable ikke
- Den kan ikke mærke, hvordan det føles med fingre og mus, eller om det hakker på tabletten. Det skal I stadig prøve af.
- Testbrowseren har intet grafikkort, så grafikken skal især bedømmes ud fra jeres skærmbilleder fra tabletten.
- Fables forslag er forslag. I bestemmer, og hvert trin får et go.

## Status
- [x] Planen er skrevet (21. oktober 2026).
- [x] F0 er lavet (22. oktober 2026): `docs/fable/brief.md` og 53 billeder i `docs/fable/billeder/` (taget med `tests/vaerktoejer/fable-billeder.mjs`).
- [ ] Jeres skærmbilleder fra tabletten i `docs/fable/tablet/`.
- [ ] **Besluttet 23. oktober 2026: Fable venter, til Fable 5.5 kommer.** I mener, at Fable 5.1 ligger for tæt på Opus 5.5 til at være pengene værd. Opus laver F1 i stedet i en ny session med høj effort ud fra den samme brief (som nu ikke nævner, hvilken model der læser den). Tjernobyl og Liv venter også, til Fable 5.5 kommer (Molekyler og Solsystemet laver Opus med høj effort og `/faktatjek`). Når Fable 5.5 kommer, vurderer vi igen, om den skal lave F2-F4 eller faktagrundlaget for Tjernobyl og Liv.
