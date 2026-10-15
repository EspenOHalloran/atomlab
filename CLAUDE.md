# AtomLab

Et interaktivt 3D-program i browseren om atomer og grundstoffer for en 13-årig.
Ren HTML, CSS og JavaScript (ES-moduler) med Three.js. Der er intet byggetrin, ingen npm og ingen `package.json`.

**Læs [DESIGN.md](DESIGN.md) først.** Den beskriver indholdet og de trin, vi bygger i. Byg ét trin ad gangen, få et "go" før hvert trin, og sæt kryds i listen, når et trin er færdigt.

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

## Filer
- `index.html`: alle skærme (menu, Atomværkstedet), dialoger og importmap
- `style.css`: mørkt rum-tema. Layoutet tilpasser sig ved 1150 px bredde (tablet på langs), 820 px (tablet på højkant: 3D øverst og panelerne side om side), 560 px (telefon på højkant: alt under hinanden, og hele skærmen ruller) og ved en højde under 500 px (telefon på langs: tre smalle kolonner). Paneler, der kan rulles, får klassen `mere` og toner ud forneden (rullebjælkerne er skjult). Test altid i telefon- og tabletstørrelse, når layoutet ændres.
- `js/main.js`: starter 3D-verdenen og skifter skærm efter `#` i adressen (`#vaerksted`, `#system`, `#fusion`, `#reaktor`, `#batteri`, `#kosmos`). Hver skærm har en start- og en stopfunktion. Ved skærmskift stoppes kamerabevægelser (`stopKamera`).
- `js/scene3d.js`: fælles renderer, kamera, lys, stjernehimmel og glød (bloom). `sætVindue(el)` centrerer 3D-billedet i et HTML-element (hullet mellem panelerne), `centrerVindue()` flytter det igen (fx når en skærm bliver rullet), og `passerTil(radius)` zoomer kameraet. Funktioner i `verden.opdateringer` kaldes hvert billede. `ROLIG` er sand, hvis man har slået "reducer bevægelse" til i styresystemet. Så drejer kameraet ikke af sig selv, og lysglimt dæmpes.
- `js/atom.js`: klassen `Atom`, som tegner kernen (protoner og neutroner som InstancedMesh med enkel fysik), elektronskaller som ringe eller elektronsky, et skær om kernen (farven viser stabilitet), festfyrværkeri (`fejr()`) og henfald (`henfald(måde, færdig)`). `sætMål(p, n, e)` får partiklerne til at flyve ind eller ud.
- `js/vaerksted.js`: Atomværkstedet: knapper, infopanel, det lille periodiske system og `OPGAVER`. `åbnGrundstof(nr)` bruges fra Det periodiske system.
- `js/system.js`: Det periodiske system (`#system`): den buede væg, søgning, filtre og detaljevisning med et `Atom`.
  - Med mus åbner et klik feltet. Med fingre løfter første tryk det nærmeste felt og viser navnet over det (`forhånd`, `#systemForhånd`), og andet tryk (eller et tryk på etiketten) åbner det.
  - På væggen flytter én finger væggen, og man kniber for at zoome (`vægStyring`). `holdPåVæggen` holder kameraets mål på væggens buede overflade. Ved atomet drejer én finger som alle andre steder.
  - Søgefeltet i toplinjen finder navn, kaldenavn, symbol og nummer og dæmper de andre felter. Enter åbner det første forslag.
  - På telefoner er filtrene foldet sammen bag knappen "Filtre".
  - Kortet har ‹ › og Luk øverst og kan rulles. Når kortet åbnes, lægges et trin i historikken (`history.pushState`), så telefonens tilbage-knap lukker kortet i stedet for at forlade siden.
- `js/fusion.js`: Stjerneovnen (`#fusion`): kernetyper (`TYPER`), reaktioner (`REAKTIONER`), opgaver (`OPGAVER_FUSION`), fysik i små delskridt (frastødning, sammenstød) og klik-for-at-skyde. Opgaverne om at lave D, ³He og ⁴He tæller kun, når man selv har skudt en af kernerne (`kastet`).
  - Et klik eller tryk vælger den kerne, der er nærmest på skærmen (`kerneVed`: inden for 28 px med mus og 34 px med fingre, og kerner, som den valgte kan smelte sammen med, får 16 px ekstra). Med mus viser en ring, et navn og en stiplet sigtelinje, hvad man peger på (`tegnSigte`, `#fusSigte`). Når en kerne er valgt, blinker de kerner, den kan smelte sammen med (`partnerTyper`), og tiden går langsomt (`SIGTE_TEMPO`, 15 %).
  - Mellemrum eller "⏸ Pause" stopper tiden (`pause`, mærket `#fusPauseMærke` står over underteksterne), og Esc fortryder valget. Et klik i kernelisten eller på en linje i opskriften vælger en kerne af den slags nær midten (`vælgType`).
  - Grafen under temperaturen (`tegnGraf`, `#fusGraf`) viser protonernes fart (Maxwell-Boltzmann, samme antal ved alle temperaturer) og frastødningens bakke (`BAKKE`). Bakken er målt i spillet, så andelen (`andelOverBakken(T)`) passer med ovnen inden for få procent. Ændres `FRASTØD`, `RN` eller `termiskFart`, skal `BAKKE` måles igen.
  - Første gang flyver kameraet fra Solen udefra og ind i kernen (`startRejse`, ca. 10 sekunder med tre undertekster), og bagefter starter guiden. Rejsen huskes som `fusion-rejse` i `atomlabGuide`, kan springes over og ses igen fra hjælpen. Den vises ikke med "reducer bevægelse" (`ROLIG`).
  - Kortet "Næste skridt" (`#fusMission`, `næsteSkridt()`) står øverst til venstre i 3D-billedet. "Vis mig" (`visMig`) vælger selv to kerner og skyder i slowmotion (`tempo` 0,3). Skuddet rammer altid (`sikker`: ingen frastødning mellem de to), og det tæller ikke som en opgave (`demo`).
- `js/reaktor.js`: Reaktoren (`#reaktor`): del 1 "Spalt én kerne" (to genbrugte `Atom` til stumperne) og del 2 "Kædereaktion" (2D-simulering i små skridt). Konstanterne `BRUGT_TID`, `SPALT_LANGSOM`, `FELT` og `NØDSTOP_GRÆNSE` bestemmer, hvor stavene skal stå (nu ca. 50 % for stabil, og stavene starter der). Mål igen med testadgangen, hvis de ændres.
  - Kortet "Næste skridt" (`#reaktorMission`, `næsteSkridt()`) står øverst til venstre i 3D-billedet. I kædereaktionen viser det også effekten, et levende tip (`effektTip`) og en lille graf over de sidste 20 sekunder (`#reaktorHud`).
  - "Vis mig" kører i slowmotion (`tidsFaktor`). I del 1 skydes neutronen for en. I del 2 starter én neutron en kædereaktion med stavene trukket op, og kortet tæller neutronerne i hver generation (1 → 3 → 8 …). De to første generationer spalter altid, når de rammer frisk brændsel. Bagefter sænkes stavene til 50 %. "Vis mig" klarer ikke opgaver (`løs` gør intet imens).
- `js/batteri.js`: Batteriet (`#batteri`): ioner, pladser i grafit og metaloxid, spændingskurven `SPÆNDING` (hvilespænding), varme, lithium-nåle og kortslutning.
  - Ledningen er halvgennemsigtig og fuld af elektroner (elektron-kæden). Hele kæden flytter sig sammen, med én elektron pr. ion, der flytter sig (`kædeVej`, `KÆDE_AFSTAND`).
  - Når en ion forlader en plads, hopper en elektron ud i metalfolien, og lige før en ion lander, hopper en elektron ind og møder den (`elektronHop`).
  - Midt på ledningen sidder laderen (oplad), lampen (aflad) eller en slukket afbryder (pause og efter kortslutning).
  - Strømmen følger en enkel model for konstant strøm og konstant spænding (`beregnStrøm`): ladestrømmen er `hastighed` ampere, og klemspændingen er hvilespændingen ± `MODSTAND` × strømmen. Når den når `MAX_SPÆNDING` (4,2 V), holder laderen spændingen, og strømmen falder af sig selv. Ionerne flytter sig med `IONER_PR_AMPERE` pr. ampere.
- `js/kosmos.js`: Kosmos (`#kosmos`): listen over fænomener (`FÆNOMENER`), knapperne under "Prøv selv", panelet til højre og kameraet. Det valgte fænomen huskes i `localStorage` under `atomlabKosmos`. Når man skifter fænomen, bliver det gamle ryddet helt væk (`ryd`).
- `js/kosmos/*.js`: ét fænomen pr. fil (solstorm, supernova, pulsar, kilonova, rumtid, tyngdebolger, sorthul, kvasar, ormehul). Hver fil eksporterer `{ id, navn, ikon, undertitel, citat, kamera, tal, kort, nørd, lav(gruppe, ctx) }`. `lav` bygger fænomenet i `gruppe` og giver `{ styring, opdater(dt, tid) }` tilbage. `styring` er knapper (`{ tekst, handling, deaktiv }`), til/fra-knapper (`{ tekst, til, skift }`) og skydere (`{ skyder: true, navn, min, max, værdi, vis, ændring }`). `ctx` har `effekter`, `lyd`, `verden`, `fase(titel, tekst, [trin, ialt])` (en undertekst med prikker for trinnene, `fase(null)` fjerner den), `kamera({ retning, radius, mål, drej, flyv })`, `opdaterKnapper()`, `forklaring(html)` og `overlag()` (et sted oven på 3D-billedet, fx til en graf).
- `js/kosmos/faelles.js`: fælles byggeklodser: `stjerne` (kogende overflade lavet med en lille shader), `glød`, `prikSky`, `gitterDug` (rumtidens gummidug), `dipolLinjer` (magnetfelt), `skilt`, `hale`, `ringPulje`, `rullendeGraf`, `toningTekstur` og `ryd`.
- Nyt fænomen: lav en fil i `js/kosmos/`, og sæt den ind i `FÆNOMENER` i `js/kosmos.js`. Hold tallene korrekte, og skriv i nørd-teksten, hvad animationen snyder med.
- `js/guide.js`: kom i gang-guiden: `startGuide(id, trin, { igen })` viser korte trin første gang (en lysende ring om målet og en boble med "Næste" og "Spring over"). Et trin er `{ mål, titel, tekst, knap, vent, start }`, hvor `mål` er en CSS-vælger eller en funktion, der giver `{ x, y, r }` på skærmen (fx en kerne i 3D). Uden `knap` går guiden videre, når `vent()` giver true. Guiderne `fusion`, `reaktor-kerne` og `reaktor-kæde` ligger i fusion.js og reaktor.js, og man kan se dem igen fra hjælpen. `stopGuide()` kaldes ved skærmskift. `markérSet(id)` husker andet, der kun skal vises første gang (rejsen ind i Solen).
- `js/effekter.js`: fælles effekter (`Effekter`: glimt, bølge, skyd, tekst), som også bruges af Reaktoren
- `js/data/fakta.js`: `FAKTA` for alle 118 grundstoffer (findes, bruges, opdaget, af, navn)
- `js/fremgang.js`: løste opgaver og opdagede grundstoffer
- `js/lyd.js`: små lyde lavet med Web Audio (ingen lydfiler). Der er stille, indtil man har trykket eller klikket på siden (browserne tillader ikke lyd før).
- `js/beskeder.js`: beskeder med faste pladser, så de ikke dækker animationerne. `visBesked({ titel, tekst, type, varighed, forsinkelse, fast, trin, log })`:
  - Typerne `info`, `reaktion`, `henfald`, `advarsel` og `fase` bliver en **undertekst** nederst i 3D-billedet (én ad gangen, højst tre linjer og to på telefoner, med "Mere"). Tiden regnes ud fra tekstens længde. `varighed: 0` betyder, at den bliver stående, til noget nyt kommer.
  - `klaret` og `opdaget` bliver en lille **pille** øverst til højre i 3D-billedet (højst to ad gangen, resten venter). Tryk for at læse mere.
  - `fast: true` (fx nødstop og kortslutning) bliver stående, til man lukker den, og almindelige beskeder venter imens. `forsinkelse` venter lidt, så man når at se det, der sker.
  - Alt undtagen faser gemmes i loggen, som åbnes med 🔔 i 3D-billedet. Klokken findes kun i vinduer med `data-log`.
  - `rydBeskeder()` kaldes ved skærmskift. Kan 3D-billedet ikke ses (fx rullet væk på en telefon), står beskeden nederst på skærmen (`#beskeder`).
  - `bundIVindue(v)` giver et fast sted nederst i et 3D-vindue, lige over underteksterne (fx Stjerneovnens pausemærke).
- `js/stabilitetskort.js`: klassen `Stabilitetskort`, som tegner kortet over stabile kerner (2D-canvas) i infopanelet
- `js/fuldskaerm.js`: knapperne til fuld skærm (klassen `knap-fuldskaerm`). De skjules, hvis browseren ikke kan vise fuld skærm (fx iPhone).
- `js/data/grundstoffer.js`: alle 118 grundstoffer (navn, symbol, masse, kategori, tilstand), korte fakta, elektronskaller (`skaller`, `skallerForIon`), elektronkonfiguration (`konfiguration`, `konfigurationTekst`, med de kendte undtagelser i `KONFIG_UNDTAGELSER`) og placering i tabellen (`placering`)
- `js/data/kerne.js`: bindingsenergi (`bindingsenergi(z, n)`: målte værdier i `MÅLT`, ellers dråbemodellen) og kernens radius (`kerneRadiusFm`) til Nørd-fanen
- `js/data/citater.js`: `CITATER` (kun citater med en sikker kilde) og `MENU_CITATER`. Sæt et citat ind med `data-citat="navn"` på et element i index.html
- `js/data/isotoper.js`: stabile isotoper, næsten stabile, kendte radioaktive med halveringstid, `stabilitet(z, n)` og `henfaldsmåde(z, n)`. Henfaldsmåden findes ud fra kendte data og reglen "bliv til en (næsten) stabil nabo med samme massetal". Ændres reglerne, så tjek at alle kombinationer ender i en stabil kerne uden løkker, og at uran-238 ender som bly-206 efter 8 alfa- og 6 betahenfald.

## Gemte data (localStorage)
- `atomlabFremgang`: `{ opgaver: { id: tidspunkt }, opdaget: [atomnumre] }`
- `atomlabLyd`: `'til'` eller `'fra'`
- `atomlabFane`: den valgte fane i infopanelet (`atom`, `kerne`, `fakta` eller `nørd`)
- `atomlabOpgaveFoldet`: `'ja'` hvis opgavepillen i toplinjen er foldet sammen
- `atomlabKosmos`: id på det sidst valgte fænomen i Kosmos (fx `'sorthul'`)
- `atomlabKosmosSet`: liste med id på de fænomener, man har kigget på (de andre har en lille prik)
- `atomlabGuide`: `{ id: tidspunkt }` for de guider, man har set eller sprunget over (`fusion`, `reaktor-kerne`, `reaktor-kæde`) og `fusion-rejse` (rejsen ind i Solen)
- `atomlabLog`: `{ sidstSet, beskeder: [{ t, titel, tekst, type, skærm, vigtig, gange }] }`, de sidste 40 beskeder til loggen (🔔). Tallet på klokken er de vigtige (piller og store advarsler), der er kommet siden `sidstSet`.

Infopanelet må ikke få en scrollbar. Nyt indhold skal ind i en af fanerne (Atom, Kerne, Fakta, Nørd) og være kort, eller ind i hjælpen.

Et grundstof bliver "opdaget", når man har bygget et neutralt atom af det, og kernen kan hænge sammen. Først derefter kan man hoppe direkte til det i det lille periodiske system.

## Automatiske tests
Åbnes siden med `?test` i adressen (fx `index.html?test#fusion`), findes `window.atomlabTest` med adgang til simuleringerne (fx `atomlabTest.fusion.spol(60)` spoler 60 sekunder frem uden at tegne, og `atomlabTest.fusion.spolAlt(…)` og `atomlabTest.reaktor.spol(…)` spoler alt frem, også "Vis mig"). `atomlabTest.system` giver felternes plads på skærmen og søgningen. `atomlabTest.fusion.kerneVed(x, y)` giver den kerne, et klik ville vælge, og `rejseTid(t)` fryser rejsen ind i Solen, så man kan tage billeder. Det bruges kun af tests. Testbrowseren tegner kun 3-4 billeder i sekundet, så forløb skal spoles frem i stedet for at ventes på.

## Afprøv
Moduler virker ikke ved dobbeltklik på `index.html`. Start en lille server i mappen:

```
python -m http.server 8000
```

og åbn http://localhost:8000. Den rigtige udgave ligger på GitHub Pages (se README).
