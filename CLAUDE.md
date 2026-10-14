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
- `style.css`: mørkt rum-tema. Layoutet tilpasser sig ved 1150 px og 820 px bredde.
- `js/main.js`: starter 3D-verdenen og skifter skærm efter `#` i adressen (`#vaerksted`, `#system`, `#fusion`, `#reaktor`, `#batteri`, `#kosmos`). Hver skærm har en start- og en stopfunktion. Ved skærmskift stoppes kamerabevægelser (`stopKamera`).
- `js/scene3d.js`: fælles renderer, kamera, lys, stjernehimmel og glød (bloom). `sætVindue(el)` centrerer 3D-billedet i et HTML-element (hullet mellem panelerne), og `passerTil(radius)` zoomer kameraet. Funktioner i `verden.opdateringer` kaldes hvert billede.
- `js/atom.js`: klassen `Atom`, som tegner kernen (protoner og neutroner som InstancedMesh med enkel fysik), elektronskaller som ringe eller elektronsky, et skær om kernen (farven viser stabilitet), festfyrværkeri (`fejr()`) og henfald (`henfald(måde, færdig)`). `sætMål(p, n, e)` får partiklerne til at flyve ind eller ud.
- `js/vaerksted.js`: Atomværkstedet: knapper, infopanel, det lille periodiske system og `OPGAVER`. `åbnGrundstof(nr)` bruges fra Det periodiske system.
- `js/system.js`: Det periodiske system (`#system`): den buede væg, filtre og detaljevisning med et `Atom`
- `js/fusion.js`: Stjerneovnen (`#fusion`): kernetyper (`TYPER`), reaktioner (`REAKTIONER`), opgaver (`OPGAVER_FUSION`), fysik i små delskridt (frastødning, sammenstød) og klik-for-at-skyde
- `js/reaktor.js`: Reaktoren (`#reaktor`): del 1 "Spalt én kerne" (to genbrugte `Atom` til stumperne) og del 2 "Kædereaktion" (2D-simulering i små skridt). Konstanterne `BRUGT_TID`, `SPALT_LANGSOM`, `FELT` og `NØDSTOP_GRÆNSE` bestemmer, hvor stavene skal stå (nu ca. 50 % for stabil). Mål igen med testadgangen, hvis de ændres.
- `js/batteri.js`: Batteriet (`#batteri`): ioner, pladser i grafit og metaloxid, elektroner langs ledningen, spændingskurven `SPÆNDING`, varme, lithium-nåle og kortslutning
- `js/kosmos.js`: Kosmos (`#kosmos`): listen over fænomener (`FÆNOMENER`), knapperne under "Prøv selv", panelet til højre og kameraet. Det valgte fænomen huskes i `localStorage` under `atomlabKosmos`. Når man skifter fænomen, bliver det gamle ryddet helt væk (`ryd`).
- `js/kosmos/*.js`: ét fænomen pr. fil (solstorm, supernova, pulsar, kilonova, rumtid, tyngdebolger, sorthul, kvasar, ormehul). Hver fil eksporterer `{ id, navn, ikon, undertitel, citat, kamera, tal, kort, nørd, lav(gruppe, ctx) }`. `lav` bygger fænomenet i `gruppe` og giver `{ styring, opdater(dt, tid) }` tilbage. `styring` er knapper (`{ tekst, handling, deaktiv }`), til/fra-knapper (`{ tekst, til, skift }`) og skydere (`{ skyder: true, navn, min, max, værdi, vis, ændring }`). `ctx` har `effekter`, `lyd`, `verden`, `fase(titel, tekst)`, `kamera({ retning, radius, mål, drej, flyv })`, `opdaterKnapper()`, `forklaring(html)` og `overlag()` (et sted oven på 3D-billedet, fx til en graf).
- `js/kosmos/faelles.js`: fælles byggeklodser: `stjerne` (kogende overflade lavet med en lille shader), `glød`, `prikSky`, `gitterDug` (rumtidens gummidug), `dipolLinjer` (magnetfelt), `skilt`, `hale`, `ringPulje`, `rullendeGraf`, `toningTekstur` og `ryd`.
- Nyt fænomen: lav en fil i `js/kosmos/`, og sæt den ind i `FÆNOMENER` i `js/kosmos.js`. Hold tallene korrekte, og skriv i nørd-teksten, hvad animationen snyder med.
- `js/effekter.js`: fælles effekter (`Effekter`: glimt, bølge, skyd, tekst), som også bruges af Reaktoren
- `js/data/fakta.js`: `FAKTA` for alle 118 grundstoffer (findes, bruges, opdaget, af, navn)
- `js/fremgang.js`: løste opgaver og opdagede grundstoffer
- `js/lyd.js`: små lyde lavet med Web Audio (ingen lydfiler)
- `js/beskeder.js`: beskeder øverst på skærmen
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

Infopanelet må ikke få en scrollbar. Nyt indhold skal ind i en af fanerne (Atom, Kerne, Fakta, Nørd) og være kort, eller ind i hjælpen.

Et grundstof bliver "opdaget", når man har bygget et neutralt atom af det, og kernen kan hænge sammen. Først derefter kan man hoppe direkte til det i det lille periodiske system.

## Automatiske tests
Åbnes siden med `?test` i adressen (fx `index.html?test#fusion`), findes `window.atomlabTest` med adgang til simuleringerne (fx `atomlabTest.fusion.spol(60)` spoler 60 sekunder frem uden at tegne). Det bruges kun af tests.

## Afprøv
Moduler virker ikke ved dobbeltklik på `index.html`. Start en lille server i mappen:

```
python -m http.server 8000
```

og åbn http://localhost:8000. Den rigtige udgave ligger på GitHub Pages (se README).
