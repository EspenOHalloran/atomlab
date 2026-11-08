# AtomLab: koden fil for fil

*Opslagsbog til den, der arbejder i koden. CLAUDE.md har kun reglerne og en kort oversigt. Delt op i mindre filer 6. november 2026 (før ca. 70 KB i én fil, ca. 30.000 tokens). Intet er slettet. Denne fil er nu kun en oversigt.*

**Sådan bruges den:** Læs den fil nedenfor, der beskriver de filer, du skal arbejde i, før du går i gang, og hold den opdateret, når du ændrer noget. Rører du flere områder, så læs flere. Er du i tvivl om, hvor en fil er beskrevet, så søg efter filnavnet i `docs/kode/` (`grep`), i stedet for at læse det hele.

**Rammer du en merge-konflikt i denne fil** (en anden session har skrevet i den gamle, store udgave): Flyt din nye tekst over i den rigtige fil nedenfor, og behold denne oversigt.

| Fil | Beskriver |
|---|---|
| [kode/faelles.md](kode/faelles.md) | `index.html`, `LICENSE`, `style.css`, `main.js`, `scene3d.js`, `atom.js` (og udgaverne af atomet), `guide.js`, `lag.js`, `paneler.js`, `pause.js`, `kontakt.js`, `ordforklaring.js`, `effekter.js`, `fremgang.js`, `karrusel.js`, `menubaggrund.js`, `forfra.js`, `lyd.js`, `beskeder.js`, `fuldskaerm.js`, `js/data/hvorfor.js`. |
| [kode/molekyler.md](kode/molekyler.md) | Molekyler ("Byg et molekyle": "Giv elektroner" i `molekyler.js`, "Del elektroner" i `molekyler-byg.js`, knaldgassen i `knaldgas.js`, tegningen i `molekyle3d.js`). |
| [kode/skaerme.md](kode/skaerme.md) | Værkstedet (`vaerksted.js`, `stabilitetskort.js`), Det periodiske system (`system.js`, `kategorikort.js`, `js/data/kategorier.js`), Stjerneovnen (`fusion.js`), Reaktoren (`reaktor.js`), Batteriet (`batteri.js`) og Ordbogen (`ordbog.js`, `js/data/ordbogliste.js`, `js/data/ordbog.js`). |
| [kode/data.md](kode/data.md) | `js/data/`: molekyler, molekyler-byg, knaldgas, orbitaler, fakta, grundstoffer, himmel, solbane, skygge, landkort, kerne, citater, isotoper. |
| [kode/kosmos.md](kode/kosmos.md) | Den fælles skal (`faenomenskaerm.js`: siden, bjælken, Styr-boksen, tidsknappen), `kosmos.js`, `js/kosmos/*.js`, det sorte hul, `sideknap.js`, `js/kosmos/faelles.js`, Formørkelser, `js/kosmos/jorden.js`, "Nyt fænomen". |
| [kode/solsystem.md](kode/solsystem.md) | `solsystem.js`, Saturn (træ, flyby, kort), Solen, Jorden, `js/solsystem/` (hent, planet, ringe, nordlys, rejse, flyby, navne …), `js/data/sider/`, `js/data/ringe.js`. |
| [kode/jupiter.md](kode/jupiter.md) | Jupiter (`js/kosmos/jupiter.js`): kortet, vindene, pletten, månerne, flybyen, polerne, nordlyset og ringene, `js/data/vinde-jupiter.js`, `poler-jupiter.js` og `ringe-jupiter.js`. |
| [kode/isgiganter.md](kode/isgiganter.md) | Uranus og Neptun (`js/solsystem/isgigant.js`, `js/kosmos/uranus.js` og `neptun.js`): aksen fra polens retning, Solen for dagens dato, vindene, `js/data/isgiganter.js` og `vinde-isgiganter.js`, Uranus' ringe og årstider (UN2) og Neptuns vejr og ringbuer (`vejr-neptun.js`, `ringe-neptun.js`, UN3), Uranus' måner (UN4) og stederne og flybyerne (UN5). |
| [kode/mars.md](kode/mars.md) | Mars (`js/kosmos/mars.js`), Phobos og Deimos, flybyen ved månerne, Stå på Mars (`landskab.js`, `panorama.js`) og billederne i `billeder/solsystem/landskab/`. |
| [kode/gemte-data.md](kode/gemte-data.md) | Alt, der gemmes i localStorage. Nye gemte data skrives her. |
| [kode/testadgang.md](kode/testadgang.md) | `window.atomlabTest` (`?test`): listen over, hvad testene kan spole, fryse og læse. |
