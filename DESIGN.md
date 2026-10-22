# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Lige nu (status til næste session)
*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session. Sidst opdateret: 22. oktober 2026.*

**Senest lavet:**
- F0 i planen for Fable (22. oktober 2026): briefen `docs/fable/brief.md` og 53 skærmbilleder i `docs/fable/billeder/` (nyt værktøj: `tests/vaerktoejer/fable-billeder.mjs`).
- Planen for, hvad Fable skal hjælpe med ([docs/plan-fable.md](docs/plan-fable.md)): et eftersyn af teknik, UI, grafik og indhold og hjælp til at planlægge de store dele, med jeres svar og et skøn over prisen.
- Idéen "Molekyler i Atomværkstedet" (med Byttebørsen og hvor Jordens vand kommer fra) under "Idéer til senere".
- Trin 17: Jorden og Månen med rigtige billeder fra NASA (Årstiderne og Formørkelser).
- Skills: `/faerdig` og `/faktatjek` i `.claude/skills/`.

**Venter på et go (i den rækkefølge, jeg vil foreslå):**
0. **Fable, F1:** et samlet overblik over, hvor AtomLab kan blive bedre ([docs/plan-fable.md](docs/plan-fable.md)). Materialet (F0) er klar. Venter på credits (10-20 $) og jeres skærmbilleder fra tabletten i `docs/fable/tablet/`. I starter selv en session med Fable og skriver: "Læs `docs/fable/brief.md` og lav F1." Overblikket kan ændre rækkefølgen nedenfor.
1. **Copyright:** forslaget under "Før vi deler AtomLab med andre" ("© 2026 Espen O'Halloran. Alle rettigheder forbeholdes" og at man gerne må bruge det i undervisningen). Lille opgave.
2. **Vis eller skjul panelerne:** begge dele (foldbare paneler og "Kun grafik"). Se "Idéer til senere". Mellemstor.
3. **Solsystemet, trin 0:** gennemgang af planen og faktagrundlaget ([docs/plan-solsystemet.md](docs/plan-solsystemet.md)). Opus laver udkastet til faktagrundlaget, og Fable tjekker det (se planen for Fable).
4. **Solsystemet, trin 1b:** prototypen med Saturn, Enceladus og Titan i topkvalitet.

**Åbne spørgsmål:** Spørgsmål 1-5 om Solsystemet i planen (afsnit 7), taget ét ad gangen. Molekylerne skal bare stå i idéerne (ingen fast plads i rækkefølgen).

**Ikke afprøvet endnu:** NASA-billederne på en rigtig tablet og telefon (kun i testbrowseren). Skills er ikke prøvet på en rigtig opgave.

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
- [x] **Trin 10: Ting fra Stjerneovnen, der kan bruges andre steder**
  - [x] **Pause med mellemrum** i Stjerneovnen, Reaktoren og Kosmos (samme knap og samme tast alle steder). Under pausen kan man dreje kameraet og flytte kontrolstavene.
  - [x] **Sammenligninger med hverdagen:** 1 gram uran-235 svarer til ca. 3 ton kul. En stor reaktor bruger ca. 3 kg uran-235 om dagen, mens et kulkraftværk brænder ca. 10.000 ton kul. Batteriet: cellen, en mobil og et elbil-batteri, og hvor lidt energi et batteri gemmer pr. kilo.
  - [x] **Erfaringer** samles i [docs/erfaringer.md](docs/erfaringer.md).
- [ ] **Trin 11: Rettelser efter den store gennemgang** (se [docs/gennemgang-2026-10.md](docs/gennemgang-2026-10.md))
  - [x] **Faglige rettelser:** faktafejlene (A1), henfaldsreglerne (A2) og de vigtigste upræcise formuleringer (A3), med en ny test af henfaldsreglerne mod kendte kerner.
  - [x] **Fejlrettelser og små UI-rettelser:**
    - én fælles nulstilling ved skærmskift og timere, der ryddes
    - "Start forfra" i alle dele
    - Reaktorens panel og gløden på tablets
    - den fulde ovn
    - "Reducer bevægelse"
    - menuen på tablet, etiketten i Batteriet, zoom på væggen og ionen i 3 sekunder
    - stjernerne under pause
  - [x] **Jeres punkter efter afprøvning:** fagord forklaret (neutrino, alfapartikel, beryllium-8), batteriets ioner og elektroner, Reaktoren efter Kosmos, neutronkilden og "6-16", tempo og trin for trin i Stjerneovnen, pulsarens 716 blink og batteriets etiketter på pc.
  - [ ] **Sammenhæng:** fremgang pr. del i menuen og links mellem delene ("Se også").
  - [ ] **Fælles "Næste skridt"-modul**, og "Næste skridt", "Vis mig" og en guide i Batteriet og en kort guide i værkstedet.
  - [ ] **Tilgængelighed og app:** dialoger, tastatur, en app på hjemmeskærmen og mindre download.
- [x] **Trin 12: Ordforklaringer og fire nye fænomener i Kosmos**
  - [x] **Ordforklaringer:** 32 fagord (neutrino, positron, isotop, ion, MeV, plasma, halveringstid …) har prikker under første gang, de står i en tekst. Et tryk eller klik viser en kort forklaring, og med mus vises den også, når man holder musen over ordet. Virker i hjælpen, panelerne, Kosmos, grundstofkortet, underteksterne og loggen.
  - [x] **Big Bang:** fra en suppe af protoner og neutroner til 75 % hydrogen og 25 % helium efter ca. 20 minutter, de første atomer og de første stjerner. Man går frem trin for trin med "Næste".
  - [x] **Ny stjerne:** En sky af gas falder sammen. Skyderen vælger massen, og resultatet bliver en brun dværg, en rød dværg, en stjerne som Solen eller en kæmpestjerne.
  - [x] **Solens fremtid:** Solen bliver lysere, en rød kæmpe sluger Merkur og Venus, helium tænder, en planetarisk tåge og en hvid dværg.
  - [x] **Hvid dværg:** En hvid dværg suger gas fra en nabostjerne, når grænsen på ca. 1,4 sole og eksploderer (type Ia-supernova). En graf viser lyset, og panelet viser nikkel-56 → cobalt-56 → jern-56.
  - [x] Listen i Kosmos fortæller en historie: Big Bang først, så stjernernes liv og til sidst de mærkeligste ting.
- [x] **Trin 13: Årstiderne i Kosmos**
  - [x] Jorden på sin bane om Solen med den skrå akse (ca. 23,4°), der peger samme vej hele året. Kloden har land og hav, grænsen mellem dag og nat, ækvator, polarcirklerne og de fire steder.
  - [x] Trin for trin: forårsjævndøgn, sommer i nord, efterårsjævndøgn og vinter i nord, og bagefter vælger man selv datoen med en skyder.
  - [x] En lille tabel i 3D-billedet med dagens længde og Solens højde ved middag i Danmark, Australien, ved ækvator og i Grønland. Tallene regnes ud for de rigtige steder og passer med almanakkerne inden for få minutter.
  - [x] Fælden: Jorden er tættest på Solen i starten af januar. Nye ordforklaringer: jævndøgn, solhverv, polarcirkel, midnatssol og mørketid.
- [x] **Trin 14: Formørkelser i Kosmos**
  - [x] Sol, Jord og Måne med den samme Jord som Årstiderne (`js/kosmos/jorden.js`). Trin for trin: Månen kredser, hvorfor det ikke sker hver måned (banen hælder), total solformørkelse, ringformørkelse og måneformørkelse, og bagefter "Prøv selv" med skydere for Månens fase, tid på året og Månens afstand og knappen "Uden hældning".
  - [x] Skyggerne er regnet: Månens skygge på Jorden (kerneskygge og halvskygge) og Jordens skygge på Månen, som bliver kobberrød. Solens og Månens størrelse på himlen passer i forhold til hinanden, så det bliver total, når Månen er tæt på, og en ring, når den er langt væk.
  - [x] "Solen set fra Jorden" og "Månen set fra Jorden" i et lille rundt kort i 3D-billedet (med koronaen ved total solformørkelse). Sikkerhed: Kig aldrig direkte på Solen. Nye ordforklaringer: baneplan, korona, kerneskygge og halvskygge.
- [x] **Trin 15: Forbedringer af Årstiderne og Formørkelser efter review**
  - [x] Korte undertekster med pointen først (under ca. 160 tegn), så den ikke bliver skåret af på tablet og telefon.
  - [x] Årstiderne: stråler med "Lys fra Solen" i nærbillederne. Trinnet om sommer siger, hvorfor høj sol varmer, og trinnet om vinter, at det ikke er afstanden. Navnene på Jorden står ikke oven i hinanden og skjules på bagsiden. Tabellen viser årstiden, og Jorden kører rundt om Solen i første trin.
  - [x] Formørkelser: Solformørkelsen kommer nu før "Hvorfor ikke hver måned?". Et skilt "Månens skygge" og en ring om kerneskyggen i nærbilledet, "nymåne" og "fuldmåne" på banen. Himmelkortet viser Månen ude ved kanten, når den går over eller under Solen, og Jordens skygge på Månen ved en delvis måneformørkelse. Skyderen "Tid på året" siger, når det er en formørkelsesperiode. Nyt afsnit under "For nørder": Hvorfor rød?
- [x] **Trin 16: Kvasarens stråler, flere citater og kategorierne i Det periodiske system**
  - [x] Kvasaren: "Hvorfor stråler?" (magnetfeltet bliver vredet op som en proptrækker, og plasma bliver slynget ud) med en ærlig note om, hvad man ikke ved. Knappen "🧲 Vis magnetfeltet" viser de snoede feltlinjer tæt på.
  - [x] Citater: Hvert fænomen i Kosmos har sit eget citat. Nye: Carrington (solstorm), Tycho Brahe (supernova), Jocelyn Bell Burnell (pulsar), David Reitze (tyngdebølger), Einstein (kvasar), Haldane (ormehul) og Meitner og Frisch (Reaktorens hjælp). Alle er faktatjekket. Paynes citat blev droppet, fordi ordlyden ikke kunne bekræftes.
  - [x] Kategorierne: Vælger man en kategori i filtrene, kommer et kort med hvad de har til fælles, et lille atom, der viser hvorfor (de yderste elektroner), et animeret signaturforsøg (fx alkalimetal i vand, salt af natrium og chlor, lys i ædelgasrør), en tendens, kendte medlemmer og links til resten af AtomLab. Væggen laver en bølge, og kategoriens felter glider frem.
- [x] **Trin 17: Flot Jord og Måne med rigtige billeder fra NASA** (trin 1a i [planen for Solsystemet](docs/plan-solsystemet.md))
  - [x] Jorden: Blue Marble for januar, april, juli og oktober, der glider over i hinanden efter datoen (sne om vinteren), byernes lys om natten (Black Marble), skyer med skygge, bjerge, der får skygger i lav sol, og Solens glimt i havet.
  - [x] Luften: et blåt skær mod kanten, rødligt lys i tusmørket og en tynd atmosfære, der lyser kraftigt i modlys.
  - [x] Månen: kort og højder fra Lunar Reconnaissance Orbiter. Fuldmånen er næsten lige lys over hele skiven, som den rigtige.
  - [x] 4k på pc og 2k på tablet og telefon. Kilder og licenser i `billeder/solsystem/KILDER.md`, og en ærlig note under "For nørder" om, hvad der er gjort større.

## Idéer til senere
- "Test dig selv": 3-5 små spørgsmål til sidst i hver del, så man husker det, man har set.
- En engelsk udgave med en sprogvælger. Planen ligger i [docs/plan-engelsk.md](docs/plan-engelsk.md).
- En chat, hvor man kan stille spørgsmål (skal diskuteres: hvor den kører, hvem der betaler, og hvordan den holdes til emnet).
- Tidslinje over, hvornår grundstofferne blev opdaget.
- **Molekyler i Atomværkstedet** (jeres ønske, 21. oktober 2026): se, hvordan atomer giver og tager elektroner, og byg molekyler, fx vand.
  - **Give og tage elektroner (ionbinding):** Man ser en elektron hoppe fra et atom til et andet, fx fra natrium til chlor. Så bliver de til Na⁺ og Cl⁻, som trækker i hinanden (køkkensalt). Det bygger videre på opgaverne Na⁺ og Cl⁻ og på "Hvad er en ion?" i hjælpen.
  - **Dele elektroner (molekyler):** Man sætter atomer sammen, fx H₂, O₂, H₂O og CO₂. I vand giver atomerne ikke elektroner væk. De deler dem i par. Oxygen trækker mest i de delte elektroner, så oxygen-enden bliver lidt minus og hydrogen-enderne lidt plus. Vandmolekylet er bøjet (ca. 104,5°).
  - Navn: Delen, hvor atomerne giver og tager elektroner, kan hedde noget i stil med **Byttebørsen** (jeres forslag).
  - **Se, hvordan vand bliver til:** Besluttet: først den kemiske reaktion, fx 2 H₂ + O₂ → 2 H₂O. Molekylerne går i stykker, atomerne sætter sig sammen på en ny måde, og der bliver frigjort energi (knaldgas, som i en raketmotor).
  - **Hvor og hvordan blev Jordens vand dannet?** (jeres ønske). Det ved man ikke helt, og det skal siges ærligt. Foreløbig, og ikke faktatjekket: Meget af vandet blev nok dannet ude i rummet, før Solen fandtes. Det skete i kolde skyer af gas og støv, hvor hydrogen og oxygen mødes på små iskolde støvkorn. Vandet kom til Jorden med de sten, Jorden blev bygget af, med asteroider og nok kun lidt med kometer. Det blev ikke dannet som knaldgas, for ude i rummet er der næsten ingen O₂. Skal faktatjekkes grundigt (fx forholdet mellem tungt og almindeligt hydrogen og prøverne fra asteroiderne Ryugu og Bennu).
  - Besluttet: både frit byggeri og trin for trin med opgaver.
  - Ærligt (se fælden i docs/erfaringer.md): "Atomer vil gerne have en fuld skal" er en forenkling. Hvis natrium giver sin elektron til chlor, og de to atomer er langt fra hinanden, koster det energi. Gevinsten kommer først, når plus og minus trækker i hinanden. Teksterne om salt i hjælpen og i kategorikortet skal tjekkes samtidig.
  - Plads: Infopanelet må ikke få en rullebjælke. Derfor skal molekylerne nok være en ny del i værkstedet med knapper øverst, som "Spalt én kerne" og "Kædereaktion" i Reaktoren.
- **Tjernobyl i Reaktoren** (foreslået af jer): forstå, hvad der skete i 1986, trin for trin. Kræver en anden slags reaktor i spillet: I Tjernobyl bremsede grafit neutronerne, og vandet slugte dem mest, så damp gav flere spaltninger. I spillets reaktor er det omvendt. Se fælden om Tjernobyl i docs/erfaringer.md. En alvorlig ulykke med døde. Besluttet: Den skal behandles med respekt, og formålet er oplysning og læring (forstå, hvad der skete, og hvorfor), ikke at "vinde".
- **Ny del: Solsystemet med Rumrejsen** (jeres ønske): Udforsk planeterne og månerne (især Europa, Enceladus og Titan, hvor der måske er betingelser for liv), og Voyager-spillet, hvor man bruger planeternes tyngdekraft. Foreløbig plan i [docs/plan-solsystemet.md](docs/plan-solsystemet.md). Fable skal gennemgå den, før vi går i gang.
- **Vis eller skjul panelerne** (jeres ønske, især til Årstiderne og Formørkelser), så man bedre kan nyde grafikken. Forslag (venter):
  - Hvert sidepanel kan foldes væk med en fane på kanten (‹ og ›), og 3D-billedet glider ud og fylder pladsen (`centrerVindue`). Fx kan teksten til højre foldes væk, mens "Næste" og datoen bliver til venstre.
  - Knappen "Kun grafik" i toplinjen (ved siden af fuld skærm) og tasten G folder begge væk. Esc eller knappen igen henter dem tilbage.
  - Tilbage bliver underteksterne, pause (mellemrum), tabellen og himmelkortet i 3D-billedet og en lille "Næste ›" i underteksten i fænomener, der går trin for trin.
  - Valget huskes for hver skærm, men første gang er panelerne fremme. På tablet og telefon på højkant viser "Kun grafik" 3D-billedet på hele skærmen.
  - Gælder de fem skærme med panel, 3D og panel (Værkstedet, Stjerneovnen, Reaktoren, Batteriet og Kosmos). Det periodiske system har sit eget layout og kommer ikke med i første omgang.
  - Mellemstor opgave. Risikoen er layoutet på de mange skærmstørrelser, så det skal testes på pc, tablet og telefon begge veje. Besluttet: begge dele (foldbare paneler og "Kun grafik"). Venter på et go.
- [x] **Skills til udviklingen** (lavet i oktober 2026): `/faerdig` (tests, skærmbilleder, dokumentation, commit og push) og `/faktatjek` (påstande, kilder og fælderne) i `.claude/skills/`. De peger på tjeklisterne i `docs/erfaringer.md` og kopierer dem ikke.
- **Rækkefølge** (aftalt): Årstiderne (Trin 13) og formørkelserne (Trin 14) er lavet. Så Tjernobyl og til sidst Liv.
- **Ny del: Liv** (foreslået af jer): et laboratorium, hvor man blander livets ingredienser og ser, hvor langt man kan komme (fx Miller-Urey-forsøget, byggesten, hinder, RNA). Vigtigt at sige ærligt, at ingen endnu har lavet liv fra bunden, og at det er uvist, hvordan det opstod. Med de nyeste fund på Mars (Perseverance, "leopardpletterne" i klippen Cheyava Falls). Besluttet: Forklar, hvad der er fundet, hvorfor det er så interessant, og hvorfor det er det bedste spor af liv på andre planeter indtil nu, men også ærligt, at det ikke er bevist. Teksten skal faktatjekkes grundigt. Molekyle-idéen ovenfor kan være første skridt.

## Før vi deler AtomLab med andre (tjekliste)
AtomLab ligger allerede på GitHub Pages. Før vi deler det bredere:
- [ ] **Fagligt tjek:** En fysik/kemi-lærer eller en anden fagperson gennemgår indholdet.
- [ ] **Afprøvning:** 3-5 børn og en lærer prøver det. Vi skriver ned, hvor de går i stå, og retter det.
- [ ] **Skolernes enheder:** afprøvet på ældre iPads og Chromebooks (hastighed og glød).
- [ ] **"Om AtomLab"-side:** hvem der har lavet det og hvorfor, at der ikke indsamles data (kun det, der gemmes i ens egen browser), hvordan man melder fejl, og at det er lavet med hjælp fra AI.
- [ ] **Licens og kilder:** vælg en licens, og tjek, at citater og kilder er i orden. Drøftet i oktober 2026:
  - En linje med "© 2026 [navn]" i README og i hjælpen og en licensfil. Ophavsret opstår af sig selv i Danmark og EU, men linjen viser tydeligt, hvem der ejer det.
  - Vælg enten "Alle rettigheder forbeholdes" eller en åben licens, fx CC BY-NC (andre må dele med kildeangivelse, men ikke tjene penge på det). Den sidste passer godt, hvis lærere skal kunne bruge det.
  - Et afsnit "Kilder og licenser" i hjælpen: Three.js (MIT), landkortet fra global-land-mask (MIT), citaterne og de kommende billeder fra NASA m.fl.
  - Ærligt om AI: Meget af koden er skrevet med AI, og i nogle lande er det juridisk uafklaret, hvor meget ophavsret der er på den. Idéerne, valgene og teksterne er tydeligt jeres. (Ikke juridisk rådgivning.)
  - Navnet er Espen O'Halloran. Mit forslag (venter på et ja): "© 2026 Espen O'Halloran. Alle rettigheder forbeholdes" i README og hjælpen og en licensfil, plus en linje om, at man gerne må bruge AtomLab i undervisningen og dele linket. Man kan altid åbne mere op senere, men en åben licens kan ikke trækkes tilbage. Three.js, landkortet og NASA's billeder bevarer deres egne licenser.
- [ ] **Til lærere:** en kort lærervejledning, en kobling til fagets mål i 7.-9. klasse og nogle opgaver.
- [ ] **Del i det små først:** først med en lærer og en klasse, derefter i faglige netværk for fysik/kemi-lærere.
