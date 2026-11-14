# AtomLab: koden fil for fil

*Opslagsbog til den, der arbejder i koden. CLAUDE.md har kun reglerne og en kort oversigt. Delt op i mindre filer 6. november 2026 (før ca. 70 KB i én fil, ca. 30.000 tokens). Intet er slettet. Denne fil er nu kun en oversigt.*

**Sådan bruges den:** Læs den fil nedenfor, der beskriver de filer, du skal arbejde i, før du går i gang, og hold den opdateret, når du ændrer noget. Rører du flere områder, så læs flere. Er du i tvivl om, hvor en fil er beskrevet, så søg efter filnavnet i `docs/kode/` (`grep`), i stedet for at læse det hele.

**Rammer du en merge-konflikt i denne fil** (en anden session har skrevet i den gamle, store udgave): Flyt din nye tekst over i den rigtige fil nedenfor, og behold denne oversigt.

| Fil | Beskriver |
|---|---|
| [kode/faelles.md](kode/faelles.md) | `index.html`, `LICENSE`, `style.css`, `skaerme.js` (listen over delene og hentningen efter behov), `gaa.js`, `main.js`, `scene3d.js`, `atom.js` (og udgaverne af atomet), `guide.js`, `lag.js`, `paneler.js`, `pause.js`, `kontakt.js`, `ordforklaring.js`, `effekter.js`, `fremgang.js`, `forfra.js`, `lyd.js`, `beskeder.js`, `fuldskaerm.js`, `maaler.js` (måleren, `?maal`), `js/data/hvorfor.js`. |
| [kode/forloeb.md](kode/forloeb.md) | Forløb-klodsen (`js/forloeb.js`): linjen under scenen, faserne, hvad delen leverer, og hvornår et forløb starter af sig selv. |
| [kode/menu.md](kode/menu.md) | Menuen som en ring af verdenerne (`karrusel.js`, "Din fremgang" med forløbenes ✓) og baggrunden bag den (`menubaggrund.js`). |
| [kode/molekyler.md](kode/molekyler.md) | Molekyler ("Byg et molekyle": "Giv elektroner" i `molekyler.js`, "Del elektroner" i `molekyler-byg.js`, knaldgassen i `knaldgas.js`, tegningen i `molekyle3d.js`). |
| [kode/liv.md](kode/liv.md) | Liv i verdenen "Ild og liv" (`liv.js`, `liv-protein.js`, `liv-ordene.js` (forløb 2), `js/liv/stige.js`, `js/liv/celle.js`, `js/liv/protein.js` og `js/liv/kodehjul.js`, data i `js/data/liv/` med atompladserne fra 1BNA, værktøjet `lav-dna-atomer.mjs`, koden, genet HBB og teksterne til L2). |
| [kode/skaerme.md](kode/skaerme.md) | Værkstedet (`vaerksted.js`, `stabilitetskort.js`), Det periodiske system (`system.js`, `kategorikort.js`, `js/data/kategorier.js`), Stjerneovnen (`fusion.js`), Reaktoren (`reaktor.js`), Batteriet (`batteri.js`), Ordbogen (`ordbog.js`, `js/data/ordbogliste.js`, `js/data/ordbog.js`). |
| [kode/gaader.md](kode/gaader.md) | Gåderne (`gaader.js`, scenerne i 3D i `js/gaader/`: `scene.js`, `antistof.js`, `streg.js` og `lys.js`, og `js/data/gaader.js`). |
| [kode/data.md](kode/data.md) | `js/data/`: opgaver, faenomener, molekyler, molekyler-byg, knaldgas, orbitaler, fakta, grundstoffer, himmel, solbane, skygge, landkort, kerne, citater, isotoper. |
| [kode/kosmos.md](kode/kosmos.md) | Den fælles skal (`faenomenskaerm.js`: siden, bjælken, Styr-boksen, tidsknappen), `kosmos.js`, `js/kosmos/*.js`, det sorte hul, `sideknap.js`, `js/kosmos/faelles.js`, Formørkelser, `js/kosmos/jorden.js`, "Nyt fænomen". |
| [kode/tid.md](kode/tid.md) | Tid og rum: Rejsen i tid (`js/kosmos/tid.js`, `js/data/tid.js`), "Hvorfor går tiden langsommere?" (`js/kosmos/tidhvorfor.js`), det fælles lysur (`js/kosmos/lysur.js`), forløbet "Rejsen i tid" (`js/data/forloeb/tid.js`) og figurerne (`js/kosmos/tidfigur.js`). |
| [kode/solsystem.md](kode/solsystem.md) | `solsystem.js`, Saturn (træ, flyby, kort), Solen, Jorden, `js/solsystem/` (hent, shadere, planet, ringe, nordlys, rejse, flyby, navne …), `js/data/sider/`, `js/data/ringe.js`. |
| [kode/jupiter.md](kode/jupiter.md) | Jupiter (`js/kosmos/jupiter.js`): kortet, vindene, pletten, månerne, flybyen, polerne, nordlyset og ringene, `js/data/vinde-jupiter.js`, `poler-jupiter.js` og `ringe-jupiter.js`. |
| [kode/isgiganter.md](kode/isgiganter.md) | Uranus og Neptun (`js/solsystem/isgigant.js`, `js/kosmos/uranus.js` og `neptun.js`): aksen fra polens retning, Solen for dagens dato, vindene, `js/data/isgiganter.js` og `vinde-isgiganter.js`, Uranus' ringe og årstider (UN2) og Neptuns vejr og ringbuer (`vejr-neptun.js`, `ringe-neptun.js`, UN3), Uranus' måner (UN4) og stederne og flybyerne (UN5). |
| [kode/venus.md](kode/venus.md) | Venus (`js/kosmos/venus.js`): Magellans radarkort og højder (`lav_venus.py`), aksen og drejningen efter datoen (`js/data/venus.js`), skyerne fra Akatsuki og vindene (`lav_venus_skyer.py`, `js/data/vinde-venus.js`) og siden (`js/data/sider/venus.js`). |
| [kode/mars.md](kode/mars.md) | Mars (`js/kosmos/mars.js`), Phobos og Deimos, flybyen ved månerne og billederne til Mars. |
| [kode/staa-paa-mars.md](kode/staa-paa-mars.md) | Stå på Mars (`landskab.js`, `panorama.js`) og billederne i `billeder/solsystem/landskab/`. |
| [kode/gemte-data.md](kode/gemte-data.md) | Alt, der gemmes i localStorage. Nye gemte data skrives her. |
| [kode/testadgang.md](kode/testadgang.md) | `window.atomlabTest` (`?test`): listen over, hvad testene kan spole, fryse og læse. |
