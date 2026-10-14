# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Grundregler
- Dansk tekst i et enkelt sprog. Fagord forklares.
- Tæt på den rigtige fysik. Forenklinger siges ærligt.
- Virker på pc (mus og tastatur) og tablet (fingre).
- Man åbner det via et link (GitHub Pages).

## Trin

- [x] **Trin 1: Grundskelet og Atomværkstedet**
  - Menu med fire dele. De tre sidste står som "kommer snart".
  - Knap til fuld skærm i menuen og i værkstedet (skjules, hvor browseren ikke kan).
  - 3D-scene med stjernehimmel og glød. Man drejer og zoomer med mus eller fingre.
  - Byg et atom: protoner, neutroner og elektroner flyver ind. Hold knappen inde for at tilføje mange. Tasterne P, N og E virker også, og med Shift fjerner de.
  - Infopanel: grundstof, isotop, massetal, ladning (ion), elektronskaller og om kernen er stabil (med halveringstid og grunden til, at den er ustabil).
  - Kernen ryster og lyser grønt, når den er ustabil, og blinker rødt, når den slet ikke kan hænge sammen.
  - Skift mellem ringe (Bohrs model) og elektronsky, med en ærlig forklaring.
  - Lille periodisk system. Grundstoffer bliver "opdaget", når man har bygget dem, og så kan man hoppe direkte til dem.
  - 16 opgaver: hydrogen, to protoner uden neutroner, helium-4, deuterium, tritium, se et henfald, carbon-12, den tungeste stabile carbon, oxygen-16, neon-20, Na⁺, Cl⁻, carbon-14, jern-56, uran-235 og uran-238-kæden ned til bly-206. Man kan starte forfra med opgaverne (opdagede grundstoffer beholdes).
- [x] **Trin 1b: Neutronernes rolle og ioner**
  - Stabilitetskort: protoner op ad, neutroner hen ad. De stabile kerner danner et bånd, der bøjer mod flere neutroner, og ens egen kerne er en lysende prik. Teksten under viser neutroner pr. proton og hvor mange neutroner, stabile kerner af grundstoffet har.
  - "Se den henfalde": kernen ryster, og så sker henfaldet som animation (betahenfald, beta-plus, alfa, dobbelt beta, neutron eller proton ud) med lysglimt og partikler med hale. Atomet bliver til det nye grundstof og er en ion et øjeblik, før det bliver neutralt igen. Uran-238-kæden følger den rigtige rækkefølge (8 alfa, 6 beta).
  - Hjælpen forklarer "Hvad er en ion?", "Hvorfor neutroner?" og "Hvad er radioaktivitet, og hvorfor er det farligt?", og der er links fra infopanelet. Ved ustabile kerner står, hvilken stråling de sender ud, og hvad der stopper den.
- [x] **Trin 1c: Flottere grafik og citater**
  - Elektroner med lysende haler, kuglerne har kantlys, og protonerne pulserer svagt. Gyldne lyspunkter viser kernekraftens "lim" (det siges ærligt, at det er en tegning). Rumstøv driver forbi. Chokbølge ved henfald.
  - Kameraet flyver ind, når man åbner en del, og svinger blødt, når man skifter grundstof.
  - Citater fra Feynman, Rutherford, Bohr, Sagan og Einstein i menuen, i hjælpen og nederst i infopanelet. Kun citater med en sikker kilde (de står i `js/data/citater.js`). Brug dem også i de kommende dele (fx Einsteins E = mc² i Stjerneovnen og Reaktoren, Sagans "stjernestof" ved supernovaer).
- [ ] **Trin 2: Det periodiske system**
  - En 3D-væg med 118 felter, farvet efter kategori. Kameraet flyver ind, når man vælger et felt.
  - Kort med et 3D-atom, der drejer, 2-4 sætninger fakta, hvor stoffet findes, og hvad det bruges til. Knap: "Byg det i værkstedet".
  - Filtre: kategori, tilstand (fast, flydende, gas) og opdaget.
- [ ] **Trin 3: Stjerneovnen (fusion)**
  - Solens kerne: brintkerner suser rundt. En temperaturskyder viser, at de frastøder hinanden, når det er for koldt.
  - pp-kæden trin for trin: p + p → deuterium + positron + neutrino, d + p → helium-3 + gammastråling, ³He + ³He → helium-4 + 2 p.
  - Energi i MeV og forklaring af massetabet (E = mc²). Ærlig note om, at det i virkeligheden tager milliarder af år for én proton.
  - Opgaver, og som bonus tre-alfa-processen (3 helium-4 → carbon-12).
- [ ] **Trin 4: Reaktoren (fission)**
  - Spalt én kerne: en langsom neutron rammer uran-235, som spalter i et af tre rigtige par (Ba-141 + Kr-92 + 3 n, Xe-140 + Sr-94 + 2 n, Te-137 + Zr-97 + 2 n).
  - Kædereaktion med kontrolstave og moderator. Opgave: hold reaktoren stabil i 30 sekunder.

- [ ] **Trin 5: Batteriet**
  - Et LiPo-batteri i 3D: grafit på minussiden, metaloxid på plussiden, elektrolyt og skillevæg imellem.
  - Opladning: laderen pumper elektroner gennem ledningen over i grafitten, og Li⁺-ioner svømmer gennem elektrolytten efter dem. Afladning: det modsatte, og elektronerne laver arbejde i motoren på vejen.
  - Målere for spænding (ca. 3,0–4,2 V pr. celle) og opladning. Vis hvad der sker ved overopladning (lithium-nåle, der kan stikke hul i skillevæggen) og ved alt for dyb afladning.

## Idéer til senere
- Supernova-generator (fx Betelgeuse): en stor stjernes liv med skaller af fusion (som et løg), en jernkerne der styrter sammen, og eksplosionen der spreder grundstofferne ud i rummet.
- Kilonova-generator: to neutronstjerner, der kredser om hinanden og smelter sammen. Hurtig neutronindfangning (r-processen) laver guld, platin og uran. Kan vises på stabilitetskortet: kernerne skubbes langt ud til højre og henfalder tilbage til båndet.
- Tidslinje over, hvornår grundstofferne blev opdaget.
- Molekyler: sæt atomer sammen (H₂O, CO₂, NaCl).
