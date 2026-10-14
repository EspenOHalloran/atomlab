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
- `js/main.js`: starter 3D-verdenen og skifter skærm efter `#` i adressen (`#vaerksted`)
- `js/scene3d.js`: fælles renderer, kamera, lys, stjernehimmel og glød (bloom). `sætVindue(el)` centrerer 3D-billedet i et HTML-element (hullet mellem panelerne), og `passerTil(radius)` zoomer kameraet. Funktioner i `verden.opdateringer` kaldes hvert billede.
- `js/atom.js`: klassen `Atom`, som tegner kernen (protoner og neutroner som InstancedMesh med enkel fysik), elektronskaller som ringe eller elektronsky, et skær om kernen (farven viser stabilitet) og festfyrværkeri (`fejr()`). `sætMål(p, n, e)` får partiklerne til at flyve ind eller ud.
- `js/vaerksted.js`: Atomværkstedet: knapper, infopanel, det lille periodiske system og `OPGAVER`
- `js/fremgang.js`: løste opgaver og opdagede grundstoffer
- `js/lyd.js`: små lyde lavet med Web Audio (ingen lydfiler)
- `js/beskeder.js`: beskeder øverst på skærmen
- `js/fuldskaerm.js`: knapperne til fuld skærm (klassen `knap-fuldskaerm`). De skjules, hvis browseren ikke kan vise fuld skærm (fx iPhone).
- `js/data/grundstoffer.js`: alle 118 grundstoffer (navn, symbol, masse, kategori, tilstand), korte fakta, elektronskaller (`skaller`, `skallerForIon`) og placering i tabellen (`placering`)
- `js/data/isotoper.js`: stabile isotoper, næsten stabile, kendte radioaktive med halveringstid og `stabilitet(z, n)`

## Gemte data (localStorage)
- `atomlabFremgang`: `{ opgaver: { id: tidspunkt }, opdaget: [atomnumre] }`
- `atomlabLyd`: `'til'` eller `'fra'`

Et grundstof bliver "opdaget", når man har bygget et neutralt atom af det, og kernen kan hænge sammen. Først derefter kan man hoppe direkte til det i det lille periodiske system.

## Afprøv
Moduler virker ikke ved dobbeltklik på `index.html`. Start en lille server i mappen:

```
python -m http.server 8000
```

og åbn http://localhost:8000. Den rigtige udgave ligger på GitHub Pages (se README).
