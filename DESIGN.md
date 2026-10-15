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
  - Citater fra Feynman, Rutherford, Bohr, Sagan, Einstein, Hawking, Eddington, Faraday, Wheeler og Marie Curie i menuen, i hjælpen, i infopanelet og i Stjerneovnen, Reaktoren, Batteriet og opgavelisten. Kun citater med en sikker kilde (de står i `js/data/citater.js`). Brug dem også i de kommende dele (fx Einsteins E = mc² i Stjerneovnen og Reaktoren, Sagans "stjernestof" ved supernovaer).
- [x] **Trin 1d: Nørd-fanen**
  - En fjerde fane i infopanelet til dem, der vil vide mere: elektronkonfiguration (fx [Ar] 3d⁶ 4s², med de rigtige undtagelser som chrom og kobber), kernens radius, bindingsenergi i alt og pr. nukleon (målt, eller beregnet med dråbemodellen) med en bjælke, hvor jern og nikkel er toppen, og kernestoffets tæthed.
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
  - **Hvad løber i ledningen?** Ledningen er halvgennemsigtig og fuld af elektroner, der flytter sig sammen som en kæde, når der løber strøm, og står stille ellers. Når en ion går, hopper en elektron ud i metalfolien, og når den lander, hopper en elektron ind og møder den. Ved pause er en afbryder slukket. Hjælpen forklarer, at elektronerne kryber langsommere end en snegl, mens skubbet når frem næsten med lysets fart.
  - Panelet viser strømmen i ampere (en celle på 1.000 mAh: 0,5, 1 eller 2 A). Laderen lader med konstant strøm, til klemspændingen når 4,2 V, og holder så spændingen, mens strømmen falder. Lader man hurtigt, sker skiftet tidligere.

- [x] **Trin 1d: Overskueligt værksted**
  - Opgaven står som en pille i toplinjen og kan foldes sammen (huskes).
  - Infopanelet har ingen scrollbar: et kompakt hoved (symbol, navn, gruppe), en statuslinje (isotop, ladning, stabilitet og knappen "Henfald") og tre faneblade: **Atom** (isotop, massetal, ladning, skaller), **Kerne** (stabilitet, stråling, seneste henfald og stabilitetskortet) og **Fakta** (fakta, gruppe, tilstand, placering, citat). Der er en blinkende prik på Kerne-fanen, når kernen er ustabil.
  - Efter et henfald skifter panelet til Kerne-fanen, og forklaringen bliver stående der. Beskeden øverst er kort.
  - Kraftigere henfaldslyd med geigerklik, brag og sus.
  - Hjælpen forklarer, hvad det betyder, at kernen "skyder en elektron ud", og hvor elektronen bliver af.

- [x] **Trin 6: Kosmos**
  - En ny del med animationer af vilde fænomener i rummet. Til venstre vælger man et fænomen og har knapperne "Prøv selv". Til højre står nøgletal, "Kort fortalt", "For nørder" (med en ærlig "Ærligt talt"-note om, hvad animationen snyder med) og et citat. En undertekst nederst i animationen fortæller, hvad der sker lige nu, med prikker for trinnene.
  - **Solstorm:** Solen (med kogende overflade) sender solvind ud. En solstorm (CME) trykker Jordens magnetfelt sammen, partiklerne glider uden om, og nogle bliver fanget i halen og laver grønne og røde nordlysgardiner ved polerne. Zoom ind på Jorden.
  - **Supernova:** Betelgeuse som rød kæmpe. "Vis lagene" skærer stjernen op (hydrogen, helium, carbon, oxygen, neon, silicium, jern). Jernkernen falder sammen, neutrinoer og en chokbølge, eksplosion, en tåge i lagenes farver og en neutronstjerne i midten.
  - **Pulsar:** en neutronstjerne med to stråler, der fejer forbi Jorden. En graf viser blinkene, som et radioteleskop måler dem. Man kan høre Vela- og Krabbe-pulsaren og den hurtigste kendte pulsar i deres rigtige tempo.
  - **Kilonova:** to neutronstjerner spiraler ind (tyngdebølger som ringe), støder sammen, gammaglimt og en sky, der går fra blå til rød, mens navnene på de nye grundstoffer (guld, platin, uran ...) dukker op.
  - **Rumtid:** gummidugen. Læg stjerner og sorte huller, skyd planeter ind, og send lys forbi.
  - **Tyngdebølger:** to sorte huller på dugen sender spiralbølger ud og smelter sammen. En detektor (som LIGO) ude ved kanten bliver strakt og presset, og grafen viser "chirpet", som også kan høres.
  - **Sort hul:** skygge, en gas-skive (lysest på den side, der kommer mod os), en bue af bøjet lys, en astronaut, der bliver strakt som spaghetti og ser ud til at gå i stå, og en stjerne, der bliver revet over.
  - **Kvasar:** en spiralgalakse med en blændende kerne og to jetstråler. Tænd og sluk, giv det sorte hul mad, og zoom ind i kernen.
  - **Ormehul:** universet tegnet som foldet papir med en tunnel. Kapløb mellem lyset (den lange vej) og et rumskib (genvejen). Det siges tydeligt, at ingen har set et ormehul.

- [x] **Trin 7: Telefon, tablet og et samlet UI-review**
  - Tablet på højkant: 3D-billedet øverst (næsten halvdelen af skærmen) og de to paneler side om side nedenunder.
  - Telefon på højkant: 3D-billedet øverst og panelerne under hinanden. Hele skærmen ruller, og 3D-billedet følger med. I Kosmos er fænomenerne en vandret række, så knapperne kommer lige under animationen.
  - Telefon på langs: tre smalle kolonner og en kompakt menu, hvor alle seks kort kan ses.
  - Menuen kan rulle på små skærme (før kunne man ikke nå de nederste kort på en telefon).
  - Paneler, der kan rulles, toner ud forneden, så man kan se, at der er mere.
  - "Start her" på Atomværkstedet, når man er helt ny. I Kosmos har fænomener, man ikke har set, en lille prik, og der står, hvor mange man har set.
  - To nye citater (Sagan og Feynman), så citaterne i Kosmos ikke bliver gentaget.

- [x] **Trin 8: Forbedringer efter det store review**
  - [x] **Hurtige rettelser:** Luk og ‹ › står øverst i grundstofkortet, kortet kan rulles, og telefonens tilbage-knap lukker det. I Stjerneovnen tæller opgaverne kun egne skud. "Genstart reaktoren". Dæmpede lysglimt i supernova og kilonova, og hensyn til "reducer bevægelse".
  - [x] **Nyt beskedsystem:** Undertekster nederst i 3D-billedet (én ad gangen, højst to linjer på telefoner og "Mere"). Belønninger som små piller i hjørnet, som man kan trykke på. Store advarsler (nødstop, kortslutning) kommer lidt efter hændelsen og bliver stående. En log (🔔), hvor man kan læse beskederne igen. Beskederne ryddes, når man skifter del. I Stjerneovnen står den valgte kerne med en lille etiket i stedet for en besked.
  - [x] **Det periodiske system på telefon:** Første tryk løfter det nærmeste felt og viser navnet, andet tryk åbner det. Træk med én finger for at flytte væggen, og knib for at zoome. Et søgefelt (navn, kaldenavn, symbol eller nummer). Filtrene er samlet bag én knap på telefoner. Et tip første gang.
  - [x] **Kom i gang-guide** i Stjerneovnen og Reaktoren: korte trin første gang med en lysende ring om det, man skal trykke på (kan ses igen fra hjælpen). Et kort med "Næste skridt" i 3D-billedet og knappen "Vis mig", som viser det næste skridt i slowmotion. I Stjerneovnen blinker de kerner, man kan smelte sammen med, og et tryk vælger den nærmeste kerne. I Reaktoren viser kortet effekten med et levende tip og en lille graf, og "Vis mig" viser en kædereaktion, hvor man kan tælle neutronerne i hver generation. Stavene starter ved 50 %, hvor reaktoren er tæt på stabil.
- [x] **Trin 9: Stjerneovnen lettere og med baggrund**
  - [x] **Lettere at ramme:** Musen vælger den nærmeste kerne (ligesom fingre), og en ring, et navn og en stiplet sigtelinje viser, hvad man peger på. Mens man sigter, går tiden langsomt. Pause med mellemrum eller knappen, og Esc fortryder.
  - [x] **Find kernerne:** Et klik i kernelisten eller i opskriften vælger en kerne af den slags. Opskriften har farveprikker som kuglerne i 3D.
  - [x] **Hvorfor så varmt?** En graf over protonernes fart og frastødningens "bakke", som flytter sig med temperaturen, med en ærlig note om tunneleffekten. 1 gram brint giver lige så meget energi som over 20 ton kul.
  - [x] **Rejsen ind i Solen:** Første gang flyver kameraet fra Solen udefra og ind i kernen med tre korte undertekster. Boksen "Solen i tal".

## Idéer til senere
- En engelsk udgave med en sprogvælger. Planen ligger i [docs/plan-engelsk.md](docs/plan-engelsk.md).
- En chat, hvor man kan stille spørgsmål (skal diskuteres: hvor den kører, hvem der betaler, og hvordan den holdes til emnet).
- Tidslinje over, hvornår grundstofferne blev opdaget.
- Molekyler: sæt atomer sammen (H₂O, CO₂, NaCl).
