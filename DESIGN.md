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
- [x] **Trin 2: Det periodiske system**
  - En buet 3D-væg med 118 felter, farvet efter kategori. Feltet under musen løfter sig og lyser op, og en etiket viser navnet. Opdagede grundstoffer har en gul stjerne.
  - Klik på et felt: væggen trækker sig tilbage, og grundstoffet vises som et atom i 3D. Kortet til højre viser fakta, hvor det findes, hvad det bruges til, hvornår og af hvem det blev opdaget, hvor navnet kommer fra, elektronskaller og stabile isotoper. Pilene (eller piletasterne) skifter grundstof.
  - "Byg det i værkstedet": er grundstoffet opdaget, åbnes det i værkstedet. Ellers får man en opgave om selv at bygge det (så "opdaget" stadig betyder, at man har bygget det).
  - Filtre: kategori, tilstand (fast, væske, gas) og opdagede.
- [x] **Trin 3: Stjerneovnen (fusion)**
  - Solens kerne i 3D: brintkerner suser rundt i et glødende plasma med frie elektroner (små blå gnister). Temperaturskyder fra 1 til 120 mio. °C og to tempi.
  - Plusladede kerner frastøder hinanden synligt (de bøjer af). Kun hvis de er hurtige nok, når de sammen. Er det for koldt, bliver en skudt proton skubbet væk.
  - Klik på en kerne og derefter på en anden for at skyde den første mod den anden (lige så hurtigt som temperaturen tillader). Målet bremser lidt, så det er til at ramme.
  - pp-kæden med rigtige energier: p + p → D + e⁺ + ν (1,44 MeV, lykkes kun nogle gange, fordi en proton skal laves om til en neutron), D + p → ³He + γ (5,49 MeV), ³He + ³He → ⁴He + 2 p (12,86 MeV). Bonus ved mindst 80 mio. °C: ⁴He + ⁴He → ⁸Be, som skal rammes af en tredje ⁴He, før den falder fra hinanden → ¹²C.
  - Lysglimt, chokbølge, "+MeV" der svæver op, positroner, neutrinoer og gammastråling med hale. Panel med frigjort energi, Solens opskrift (med tællere), seneste reaktion og E = mc².
  - Hjælpen siger ærligt, at det i virkeligheden kræver tunneleffekt, og at første skridt tager milliarder af år for én proton.
  - 7 opgaver (fx "for koldt", deuterium, helium-3, helium-4, 5 helium, 100 MeV og carbon).
- [x] **Trin 4: Reaktoren (fission)**
  - **Spalt én kerne:** Vælg uran-235 eller uran-238 og en langsom eller hurtig neutron. Uran-235 + langsom neutron: kernen vrider sig som en dråbe og spalter i et af tre rigtige par (Ba-141 + Kr-92 + 3 n, Xe-140 + Sr-94 + 2 n, Te-137 + Zr-97 + 2 n), med regnskab for protoner (92) og nukleoner (236) og ca. 200 MeV. Ca. 1 ud af 7 gange bliver neutronen bare fanget (uran-236). Hurtige neutroner preller oftest af. Uran-238 fanger neutronen og bliver til uran-239 (på vej mod plutonium-239).
  - **Kædereaktion:** 112 brændselskugler i vand med 6 kontrolstave. Neutroner (hvide = hurtige, blå = langsomme) bremses af vandet, spalter uran-235 og giver 2-3 nye. Effektmåler med grønt felt (6-16 spaltninger pr. sekund), nødstop over 28, blåt Tjerenkov-lys. Uden vand dør reaktionen ud. Stabil omkring 50 % stave.
  - Ærlig hjælp: hvorfor en reaktor ikke kan eksplodere som en bombe, men kan nedsmelte (Tjernobyl, Fukushima), og at brugt brændsel i spillet bliver frisk igen efter få sekunder.
  - 7 opgaver.

- [x] **Trin 5: Batteriet**
  - Et LiPo-batteri skåret igennem i 3D: kobberfolie og grafit (minus), elektrolyt med en porøs skillevæg, metaloxid (kobolt og oxygen) og aluminiumsfolie (plus). En ledning over toppen med en lader eller en lampe.
  - Opladning: Li⁺-ioner svømmer gennem elektrolytten (gennem hullerne i skillevæggen) og lægger sig mellem grafitlagene, mens elektroner (blå prikker) løber gennem ledningen. Konstant strøm, og ved 85 % konstant spænding, hvor strømmen falder. Fuld = 4,2 V.
  - Afladning: det modsatte, og lampen lyser. Beskyttelsen slår fra ved 3,0 V.
  - Hastighed (langsom, normal, hurtig) med varmemåler. "Snyd laderen": lithium-nåle vokser fra grafitten, stikker hul i skillevæggen og giver kortslutning med glimt, alarm og røg.
  - 24 lithium-ioner vises (det står ærligt i hjælpen). 5 opgaver.

- [x] **Trin 1d: Overskueligt værksted**
  - Opgaven står som en pille i toplinjen og kan foldes sammen (huskes).
  - Infopanelet har ingen scrollbar: et kompakt hoved (symbol, navn, gruppe), en statuslinje (isotop, ladning, stabilitet og knappen "Henfald") og tre faneblade: **Atom** (isotop, massetal, ladning, skaller), **Kerne** (stabilitet, stråling, seneste henfald og stabilitetskortet) og **Fakta** (fakta, gruppe, tilstand, placering, citat). Der er en blinkende prik på Kerne-fanen, når kernen er ustabil.
  - Efter et henfald skifter panelet til Kerne-fanen, og forklaringen bliver stående der. Beskeden øverst er kort.
  - Kraftigere henfaldslyd med geigerklik, brag og sus.
  - Hjælpen forklarer, hvad det betyder, at kernen "skyder en elektron ud", og hvor elektronen bliver af.

## Idéer til senere
- Supernova-generator (fx Betelgeuse): en stor stjernes liv med skaller af fusion (som et løg), en jernkerne der styrter sammen, og eksplosionen der spreder grundstofferne ud i rummet.
- Kilonova-generator: to neutronstjerner, der kredser om hinanden og smelter sammen. Hurtig neutronindfangning (r-processen) laver guld, platin og uran. Kan vises på stabilitetskortet: kernerne skubbes langt ud til højre og henfalder tilbage til båndet.
- Tidslinje over, hvornår grundstofferne blev opdaget.
- Molekyler: sæt atomer sammen (H₂O, CO₂, NaCl).
