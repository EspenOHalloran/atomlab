# AtomLab

Et interaktivt 3D-program i browseren om atomer og grundstoffer for en 13-årig.
Ren HTML, CSS og JavaScript (ES-moduler) med Three.js. Der er intet byggetrin, ingen npm og ingen `package.json`.

**Læs først "Lige nu" øverst i [DESIGN.md](DESIGN.md).** Den siger, hvad der senest er lavet, hvad der venter på et go, og hvad der er åbent. Resten af DESIGN.md beskriver indholdet, trinene og idéerne. Byg ét trin ad gangen, få et "go" før hvert trin, og sæt kryds, når et trin er færdigt.

**Læs tjeklisterne i [docs/erfaringer.md](docs/erfaringer.md)** (afsnit 1 og 2). De skal bruges før et stykke arbejde er færdigt, ved nye tekster med fakta, ved nye regler eller ny spillogik, ved en ny del og ved nye animationer. Afsnit 3 har konkrete erfaringer sorteret efter emne. Læs det emne, du arbejder med. Skriv nye erfaringer ind løbende, både når noget virker godt, og når noget gik galt. Får en fejl en ny rodårsag, skal den også ind i en tjekliste.

**Læs [docs/kode.md](docs/kode.md), før du arbejder i koden.** Den beskriver hver fil, de gemte data og testadgangen i detaljer. Læs afsnittet om de filer, du skal røre, og hold det opdateret.

**Hukommelse mellem sessioner:** Kun det, der står i repoet, huskes. En ny session kan ikke se tidligere samtaler. Skriv derfor beslutninger, idéer og brugerens svar ind i DESIGN.md eller en plan i `docs/` med det samme og ikke kun i chatten.

**Hold dokumenterne korte** (besluttet 5. november 2026, fordi hver session læser dem): Denne fil er regler og en kort oversigt (højst ca. 15 KB), og detaljerne står i `docs/kode.md`. "Lige nu" er højst ca. 10 KB: Når noget nyt er lavet, flyttes det forrige "Senest lavet" til [docs/arkiv/historik.md](docs/arkiv/historik.md). Færdige planer og status for færdige delopgaver flyttes til `docs/arkiv/`. Intet slettes, det flyttes.

**Skills:** `/faerdig` (før et stykke arbejde er færdigt) og `/faktatjek` (nye tekster med fakta) ligger i `.claude/skills/`.

**Valg af model:** Sig til, før en opgave går i gang, hvis en anden model vil løse den bedre eller lige så godt, men billigere. Begrund det kort. Kvaliteten må ikke blive dårligere.
- **Opus** (standard): kode, der kommer med i programmet, fysik og fakta, faktatjek, danske tekster og eftersyn.
- **Billigere hjælpeagenter**, når det ikke koster kvalitet: **Haiku** til at finde ting i filerne og opsummere lange testlogs, **Sonnet** til at læse kode og svare på spørgsmål om den og til rutinetjek.
- **Effort** (hvor grundigt modellen tænker): Sig til, hvis en anden indstilling passer bedre til opgaven. Lav effort til opslag, simple rettelser og hjælpeagenter, der søger eller læser. Medium eller høj til almindelig kode og tekster. Høj til svær fysik, svære fejl og faktatjek, hvor en fejl koster meget. **Xhigh (ekstra høj)** kun der, hvor en fejl er dyr, eller hvor problemet er svært at ramme første gang: det sorte hul (lysbøjning i en shader), faktagrundlaget for Molekyler M2 og Liv (Opus laver Liv nu, lige efter Molekyler) og for Tjernobyl, hvis Opus laver den før Fable 5.5. Ikke til små opgaver. Effort sættes kun på hjælpeagenter, når det står her, eller brugeren beder om det. Sessionens egen effort skifter brugeren selv.
- **Fable 5.1:** Hvad Fable skal lave, med hvilken effort og hvad det koster, står i [docs/plan-fable.md](docs/plan-fable.md). Fable køres som hjælpeagent med den effort, der står dér. Kort sagt: Opus forbereder, Fable vurderer, og Opus bygger. Fable laver faktagrundlaget (med kilder i en fil i `docs/`) og planen for Tjernobyl og eftersynet til sidst. Ved Molekyler, Solsystemet og Liv laver Opus udkastet, og Fable tjekker det. Små og mellemstore opgaver laver Opus selv.

## Hvem bruger det
- Programmet laves af en far til hans 13-årige søn. Sønnen bruger det, han koder det ikke selv.
- Al tekst i programmet er på dansk, i et sprog en 13-årig forstår. Fagord forklares første gang.
- Fysikken skal være **tæt på virkeligheden, men enkelt forklaret**. Forenklinger skal siges ærligt (fx at elektronringene er en forenklet model).
- Fakta skal være korrekte. Er du i tvivl om et tal eller en påstand, så lad det være eller skriv det mere forsigtigt.

## Kode
- Danske navne og korte danske kommentarer, som i resten af koden.
- Three.js 0.186.1 ligger i `lib/three/` (kun de filer, vi bruger) og indlæses via `importmap` i `index.html`. Skal der bruges en ny addon, kopieres filen fra npm-pakken `three@0.186.1` (`examples/jsm/...`) til `lib/three/addons/...`, sammen med de filer den selv importerer.
- Tilføj ikke frameworks, npm-pakker eller byggetrin uden at spørge først.
- Det skal virke på pc og tablet. Brug `LAV_KVALITET` (fra `scene3d.js`) til at skrue ned for effekter på touch-enheder.


## Filer (kort oversigt, detaljer i docs/kode.md)
- `index.html` (alle skærme, dialoger, importmap, hjælpen med "Om AtomLab"), `style.css` (mørkt rum-tema, layout ved 1150, 820 og 560 px bredde og under 500 px højde), `LICENSE`.
- **Fælles:** `js/main.js` (skærmskift efter `#`, menuen), `js/scene3d.js` (renderer, kamera, glød, `LAV_KVALITET`, `ROLIG`, `TEST_HURTIG`, `nulstilStyring`), `js/atom.js` (klassen `Atom`), `js/effekter.js`, `js/lyd.js`, `js/beskeder.js` (undertekster, piller og loggen), `js/guide.js`, `js/lag.js` (foldebokse, "Hvorfor?"-kort, "Næste skridt"), `js/paneler.js`, `js/pause.js` (tidsknappen), `js/kontakt.js`, `js/ordforklaring.js`, `js/fremgang.js`, `js/forfra.js`, `js/fuldskaerm.js`, `js/hentning.js` (store billeder med bjælken "Henter …" og toningen).
- **Skærmene:** `js/vaerksted.js` (Atomværkstedet), `js/system.js` og `js/kategorikort.js` (Det periodiske system), `js/fusion.js` (Stjerneovnen), `js/reaktor.js` (Reaktoren), `js/batteri.js` (Batteriet), `js/ordbog.js` (Ordbogen), `js/kosmos.js` og `js/solsystem.js` (begge bygget på `js/faenomenskaerm.js`, med knapper i teksten fra `js/sideknap.js`).
- **Fænomenerne:** `js/kosmos/*.js`, én fil pr. fænomen i Kosmos og Solsystemet (Mars, Saturn, Jorden og Solen er de store). Fælles byggeklodser i `js/kosmos/faelles.js` og `js/kosmos/jorden.js`.
- **Grafikken til Solsystemet:** `js/solsystem/` (klippeplanet, gasplanet, ringe, atmosfære, skyer, måner, landskabet til Stå på Mars og rovernes fotos (`panorama.js`), kameraets rejse, flybyen og navnene).
- **Data uden Three.js** (kan testes i Node): `js/data/` (grundstoffer, isotoper, kerne, orbitaler, fakta, ordbog, hvorfor, kategorier, citater, grundstoflag, himmel, solbane, skygge, ringe, landkort og siderne i `js/data/sider/`).
- **Billeder:** `billeder/solsystem/` med `KILDER.md` (kilde og licens for hvert billede) og Python-værktøjerne, der laver dem (`lav_*.py`).
- **Nyt fænomen:** lav en fil i `js/kosmos/`, og sæt den ind i listen i `js/kosmos.js` eller `js/solsystem.js`. Hold tallene korrekte, og skriv i nørd-teksten, hvad animationen snyder med.

## Regler, der gælder på tværs
- Infopanelet i Værkstedet må ikke få en scrollbar. Nyt indhold skal ind i en af fanerne (Atom, Kerne, Fakta, Nørd) og være kort, eller ind i hjælpen.
- Et grundstof bliver "opdaget", når man har bygget et neutralt atom af det, og kernen kan hænge sammen. Først derefter kan man hoppe direkte til det i det lille periodiske system.
- Test altid i telefon- og tabletstørrelse, når layoutet ændres. Paneler, der kan rulles, får klassen `mere`.
- Fænomenerne bruger `dt` og `tid` fra `opdater(dt, tid)`, ikke `performance.now()`, så de står stille under pause.
- Navne i shaderkode må kun have ASCII-tegn (ikke æ, ø og å).
- Nye planeter og måner bruger kontakten "Navne" fra `js/solsystem/navne.js`, kameraets rejse (`rejse.js`) og flybyen (`flyby.js`).
- Konstanter, der hænger sammen med noget andet, står i docs/kode.md (fx `BAKKE` i Stjerneovnen, stavene i Reaktoren og Mars' højder i `lav_mars.py`). Ændres de, skal det andet også ændres eller måles igen.
- Nye gemte data (localStorage) skrives i docs/kode.md under "Gemte data".
- Billeder og netsider: Et domæne, der ikke er åbent i miljøet, spørges der om, før arbejdet går i gang (se "Sådan arbejder vi" i DESIGN.md).

## Automatiske tests
Testene ligger i `tests/` (Playwright-scripts, se [tests/README.md](tests/README.md)).
- Mens man arbejder og før merge: `node tests/koer-alle.mjs --ændret` (kun de tests, de ændrede filer kan påvirke, og alle, hvis en fælles fil er ændret).
- Hele samlingen (`node tests/koer-alle.mjs`, to ad gangen) kun, når en ændring rører fælles moduler eller data, som afslutning på en serie af opgaver og før et større mål.
- Lav en ny test eller nye tjek til nye funktioner. Skærmbilleder i alle størrelser: `node tests/vaerktoejer/skaermbilleder.mjs <skærm>`.
- Med `?test` i adressen findes `window.atomlabTest` med adgang til simuleringerne (listen står i docs/kode.md). Testene tegner hurtigt uden glød og i lav opløsning (`TEST_HURTIG`). Forløb skal spoles frem eller holdes øje med (`waitForFunction`) i stedet for at ventes på.

## Afprøv
Moduler virker ikke ved dobbeltklik på `index.html`. Start en lille server i mappen:

```
python -m http.server 8000
```

og åbn http://localhost:8000. Den rigtige udgave ligger på GitHub Pages (se README).

