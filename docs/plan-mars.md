# Plan: Mars med Phobos og Deimos og en flyby

*Lavet 24. oktober 2026 af Opus. Den bygger på prototypen med Saturn (trin 1b i [plan-solsystemet.md](plan-solsystemet.md)) og bruger den samme teknik. Tallene står med kilder i [fakta-solsystemet.md](fakta-solsystemet.md), del 3. Hver delopgave får et go, før den går i gang.*

## Jeres ønsker og svar (24. oktober 2026)
- Mars skal laves som Saturn: med måner og en flyby. Ved Mars skal flybyen også besøge steder på selve planeten, fx Olympus Mons. Planeten fylder mere end månerne.
- **"Det hele skal med. Det skal være så flot og imponerende som muligt."** Saturn og flybyen kører helt flydende på tabletten, så vi kan godt give den gas med grafikken.
- **Tharsis** kommer med, fordi det er en lille opgave: Det er højlandet med de store vulkaner lige ved siden af Olympus Mons.
- **Phobos og Deimos** skal have deres rigtige form (de er ikke runde).
- **Detaljer helt tæt på** og **"Stå på Mars"** skal med.
- Opgaven deles op i delopgaver, og I siger go mellem dem, så forbruget af tokens kan styres.
- **Svar ved go til M2 (24. oktober 2026):** Bjergene har rigtige højder som standard. Kan Olympus Mons slet ikke ses fra kredsløb, må de gøres fx 3 gange højere, og det siges ærligt i nørd-teksten. Kan `basisu` (til KTX2) ikke hentes i miljøet, bruges JPG i M2, og det siges, i stedet for at bruge tid på at finde en vej udenom. M2 køres med høj effort.

## Hvor Mars kommer til at stå
I M2 og M3 stod Mars som et fænomen i Kosmos (`js/kosmos/mars.js`). **Siden M4 (26. oktober 2026) står Mars på sin egen skærm, Solsystemet** (`#solsystem`, `js/solsystem.js`), mellem Jorden og Saturn i rækken af kloder (efter afstanden til Solen). Filen ligger stadig i `js/kosmos/`.

## Delopgaverne
Hver delopgave slutter med `/faerdig` (tests, billeder, dokumentation og en PR, der merges, når hele testsamlingen er grøn). Så kan I se den på GitHub Pages, før I siger go til den næste.

| Del | Hvad | Størrelse |
|---|---|---|
| M1 | ✅ **Planen og faktagrundlaget** (denne fil, tal med kilder, billedkilder og licenser). Lavet 24. oktober 2026. | lille til mellem |
| M2 | ✅ **Mars-kloden** (lavet 24. oktober 2026, se "Status efter M2" nedenfor): billederne (farvekort og højdekort), kuglen med rigtige højder (bjergene rager op i kanten), døgn, hældning og Solen. Mars står i Kosmos med panelet og "Kort fortalt". | mellem til stor |
| M3 | ✅ **Atmosfæren og lyset** (lavet 25. oktober 2026, se "Status efter M3" nedenfor): den tynde, støvede luft i kanten (rigtig skalahøjde), tusmørket, polkapperne og skyer af is over vulkanerne. Knappen "Modlys". | mellem |
| M4 | ✅ (M4a-M4c lavet 26.-29. oktober 2026, se "Status efter M4c") **Fælles flyby, egen skærm og rejsen ned til overfladen** (plus Solen og Jorden, se "Jorden i Solsystemet" nedenfor): Flybyen flyttes ud af `saturn.js` til et fælles modul, og kameraets rejse (`rejse.js`) lærer at flyve til et sted på kuglen og se skråt ned mod horisonten. Mars og Saturn flyttes fra Kosmos til en egen skærm, "Solsystemet" (`#solsystem`, et nyt kort i menuen med en liste over planeterne). Skallen om fænomenerne i `kosmos.js` gøres fælles, så den ikke kopieres. Saturn skal virke præcis som før. Jorden (en klode som Mars med Årstiderne og Formørkelser under sig) og Solen (Solstorm og Solens fremtid) flytter også til Solsystemet (jeres svar 26. oktober 2026). Overblikket med Solen og planeternes baner (trin 2 i plan-solsystemet.md) venter, til Mars er færdig (jeres svar 24. oktober 2026). | stor |
| M5 | ✅ (M5a og M5b lavet 30. oktober 2026, se "Status efter M5a" og "Status efter M5b") **Flybyen over Mars:** stoppene med tekster (faktatjekket): oversigten, Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance). "For nørder", "Ærligt talt" og nye fagord i ordbogen. | mellem |
| M6 | ✅ (M6a og M6b lavet 30. oktober 2026, se "Status efter M6a" og "Status efter M6b") **Phobos og Deimos i den rigtige form:** formmodeller og kort, banerne med den rigtige fart (Phobos står op i vest), stop i flybyen og "Mars set fra Phobos". | mellem til stor |
| M7 | (M7a ✅ lavet 30. oktober 2026, se "Status efter M7a". M7b er ikke bygget) **Skarpe detaljer ved stederne:** billeder og højder i høj opløsning lige der, hvor flybyen stopper, så man kan flyve helt ned til Olympus Mons' krater på toppen, ned i Valles Marineris og hen over Gale og Jezero. | stor |
| M8 | (planen er klar 30. oktober 2026, se "Plan for M8". M8a ✅ Gale lavet 30. oktober 2026, se "Status efter M8a". M8b og M8c er ikke bygget) **Stå på Mars:** et landskab i 3D ved Gale (med Mount Sharp) og ved Jezero (med deltaet), bygget af rovernes højdekort og fotos fra kredsløb. Kameraet står, hvor roveren står. Måske også de rigtige panoramafotos fra roverne. | stor |

Rækkefølgen er valgt, så der er noget at se efter hver del: Efter M2 kan man dreje Mars, efter M5 er flybyen færdig i grove træk, og M6-M8 gør den rigere.

**Ny rækkefølge (jeres svar 29. oktober 2026):** M7 deles i **M7a** (teknikken til lokale detaljer, prøvet på Olympus Mons) og **M7b** (de meget skarpe kort ved Gale og Jezero). Rækkefølgen bliver **M7a → M5 → M6 → M7b → M8**. Se "Detaljer før flere stop" nedenfor.

**Resten af Mars (plan 31. oktober 2026):** Af M7b bliver kun Nordpolen tæt på (M7b-pol) og en lille rest i M8b. Rækkefølgen bliver L1 (lyset) → S2 → M8b → M8c → M7b-pol → U4 → L2. Se "Plan for resten af Mars" nedenfor.

## Status efter M2 (24. oktober 2026)
- **Lavet:** `js/kosmos/mars.js` (fænomenet i Kosmos mellem Solstorm og Saturn), `js/solsystem/klippeplanet.js` (kuglen med rigtige højder, kan genbruges til andre klippeplaneter og måner) og `billeder/solsystem/lav_mars.py`. Farvekortet er Viking MDIM 2.1 (8k, 3,7 MB), og højderne er MOLA (4k, 7,7 MB, 16 bit). Skalaen er 1 enhed = 1.000 km.
- **Højderne:** rigtige som standard (jeres svar). Olympus Mons kan ses fra kredsløb på skyggerne, men rager kun ca. 2 pixel op over kanten, når hele kloden ses. Knappen "Bjergene 10 gange højere" gør landskabet tydeligt (det står ærligt i teksten).
- **KTX2 blev ikke prøvet:** GitHub-udgivelser er blokeret i miljøet (403), så `basisu` kunne ikke hentes. Som aftalt bruges JPG. 8k-kortet fylder ca. 170 MB i grafikkortet (med mipmaps). Vil I prøve KTX2 senere, så åbn `github.com` og `objects.githubusercontent.com` under Network access (eller brug en encoder fra npm-registret, som kan bruges).
- **8k på tabletten:** Tabletten henter også 8k, hvis grafikkortet kan klare billeder på 8192 pixel. **Jeres svar (24. oktober 2026): Det kører fint og ser super ud.** KTX2 er derfor ikke nødvendigt lige nu.
- **Til M4:** Kameraet kigger altid på Mars' midte, så man kan ikke se horisonten tæt på. Rejsen ned til et sted, hvor man ser skråt mod horisonten, kommer i M4.

## Jorden i Solsystemet (jeres ønske 26. oktober 2026)
**Jeres ord:** "Jorden skal have sin plads i menupunktet Solsystemet, hvor vi indtil videre har planlagt Mars og Saturn. Formørkelser og Årstider skal ligge under Jorden her."

**Jeres svar (26. oktober 2026):**
1. **Solen:** Solstorm og Solens fremtid flytter også til Solsystemet under et punkt "Solen".
2. **Jorden er som Mars:** en klode, man kan dreje, med Månen. Årstiderne og Formørkelser ligger under Jorden. I første omgang bruges de billeder og modeller, vi har nu (`js/kosmos/jorden.js`). Jorden og Månen kan gøres flottere senere, når Mars er færdig, hvis I vælger at prioritere det.
3. **Med i M4**, så skærmen bygges én gang. M4 bliver derfor "stor".

**Pas på i M4:** gemte data (`atomlabKosmos`, `atomlabKosmosSet`), links til `aarstider`, `formoerkelser`, `solstorm` og `solensfremtid` (fx i `js/data/kategorier.js` og `js/data/hvorfor.js`), rækkefølgen og historien i Kosmos (Big Bang, stjerner, døde stjerner og det mærkeligste), "x af 17 set" og testene `aarstider`, `formoerkelser` og `kosmos`, som åbner `#kosmos`.

## Status efter M3 (25. oktober 2026)
- **Lavet:** `lavLuft` i `js/solsystem/atmosfaere.js` (luften i kanten med skalahøjden 11 km, tusmørket og blåt lys tæt ved Solen), `js/solsystem/skyer.js` (skyer af is over Olympus Mons, Ascraeus, Pavonis, Arsia, Alba Mons og Elysium Mons om eftermiddagen, med skygge på jorden), og i `klippeplanet.js` tusmørket på jorden, et slør af støv mod kanten og hvidere polkapper. Knappen "Modlys". Elysium Mons kom med, da msss.com blev åbnet og bekræftede skyerne dér (MARCI, nordligt forår 2019).
- **Modlys:** Solen står lige bag Mars' øverste kant set fra kameraet. Først stod den midt bag Mars som ved Saturn, men tæt på lå luften i kanten så i Mars' skygge, og ringen forsvandt (det er rigtig fysik). Langt væk lyser ringen hele vejen rundt.
- **Skyerne** ligger 22 km over kuglen. Lavere skar vulkanernes toppe hårde, mørke huller i dem.
- **Til M4:** Luften er bygget, så den også virker, når kameraet er helt nede ved overfladen og ser mod horisonten (strålen regnes fra kameraet og ikke bagved).

## Svar ved go til M3 (25. oktober 2026)
I sagde ja til forslagene:
- **Polkapperne** kommer fra Viking-kortet, som allerede har begge de faste kapper (nordkappen med spiralkløfterne og sydkappen lidt ved siden af polen). Shaderen gør isen hvidere og lysere. Der tegnes ikke en vinterkappe af tøris. Nørd-teksten siger ærligt, at kapperne er vist, som de ser ud om sommeren.
- **Skyerne** tegnes af programmet, men på de rigtige steder (Olympus Mons, Tharsis-vulkanerne og Alba Mons), og kun om eftermiddagen på Mars, som NASA beskriver dem (PIA02049).
- **Årstiden** er nordlig forårsjævndøgn, så skyerne over vulkanerne passer (de kommer i nordens forår og sommer).
- **Netsider:** I åbnede msss.com, agupubs, nature.com og pubs.usgs.gov. pubs.usgs.gov virkede med det samme og msss.com sidst i sessionen. nature.com afvises stadig af miljøets proxy, og agupubs (Wiley) svarer selv 403. Teksterne bygger på NASA, ESA, NSSDC, MSSS og Wikipedia.
- **Faktatjekket ændrede én ting:** Den lange sky over Arsia Mons (1.800 km) kommer i det sydlige forår og sommer og om morgenen (ESA 2021), ikke i det nordlige forår. Den tegnes derfor ikke, men nævnes i nørd-teksten.

## Svar ved go til M4 (26. oktober 2026)
M4 er delt i tre dele med et go imellem. Hver del får sin egen PR, der merges, når hele testsamlingen er grøn.

| Del | Hvad | Effort |
|---|---|---|
| M4a | ✅ (lavet 26. oktober 2026) Den fælles skal (`js/faenomenskaerm.js`), skærmen `#solsystem`, menukortet og listen. Solstorm, Solens fremtid, Årstiderne, Formørkelser, Mars og Saturn flyttes fra Kosmos. Gemte data, links, hjælpen og testene rettes til. Intet nyt indhold. | medium |
| M4b | ✅ (lavet 26. oktober 2026) Solen og Jorden får hver deres visning: Jorden-kloden med Månen i rigtig størrelse og afstand (de billeder og modeller, vi har nu), lyset efter dagens dato, og Solen med den kogende overflade, tal og et link til Stjerneovnen. Tekster og faktatjek. | medium |
| M4c | ✅ (lavet 29. oktober 2026, se "Status efter M4c") Den fælles flyby (ud af `saturn.js`), rejsen ned til et sted på kuglen med udsyn mod horisonten, og Mars over på `rejse.js` (Mars styrer i dag kameraet selv) med ét stop at prøve, fx Olympus Mons. Kameraets "op" skal følge den lodrette retning på stedet, og kameraet må ikke komme ind under bjergene. Saturns flyby skal give de samme billeder før og efter. | høj |

**Jeres svar (26. oktober 2026): "Generelt går vi med dine anbefalinger", og Solen får sin egen visning (A).** Det betyder:
- **Menuen:** Kortet "Solsystemet" står lige før Kosmos med "x/8 set". 4 + 3 kort på pc og tablet på langs (den sidste række i midten), 2 kolonner på tablet på højkant, 1 på telefon på højkant og 4 på telefon på langs.
- **Listen** står efter afstanden til Solen: Solen (Solstorm, Solens fremtid), Jorden (Årstiderne, Formørkelser), Mars og Saturn. Underpunkterne står altid fremme, undtagen på telefon på højkant, hvor de kommer i en række under de fire kloder. Indtil M4b åbner et tryk på "Solen" og "Jorden" det første underpunkt.
- **Gemt fremgang flytter med:** De sete fænomener og det sidst valgte flyttes fra `atomlabKosmos`/`atomlabKosmosSet` til `atomlabSolsystem`/`atomlabSolsystemSet`. Var det sidst valgte et af de flyttede, starter Kosmos på Big Bang. Nulstilles fremgangen, nulstilles begge.
- **Kosmos** beholder de 11 andre i samme rækkefølge (Big Bang, Stjernefødsel, Hvid dværg, Supernova, Pulsar, Kilonova, Rumtid, Tyngdebølger, Sort hul, Kvasar og Ormehul). "Solens fremtid" i Hvid dværg bliver et link til Solsystemet, og nederst i listen står et link: "Solen, Jorden, Mars og Saturn finder du i Solsystemet".
- **Månen** står i den rigtige afstand fra Jorden (ca. 30 gange Jordens bredde).

**Jeres svar ved go til M4b (26. oktober 2026): "enig i dine anbefalinger".** Det betyder:
- **Jorden** (`js/kosmos/jordkloden.js`, 1 enhed = 1.000 km): `lavJorden` og `lavMånen` bruges, som de er. Lyset følger dagens dato og klokken: Solens retning og Jordens drejning regnes ud fra tidspunktet, så dag og nat passer med lige nu (fx mørkt i Danmark om aftenen). Månen står, hvor den er i dag (en enkel formel, præcis inden for under 1°), så månefasen passer. Knapperne er "Drej Jorden" (mod øst, meget hurtigere end i virkeligheden) og "Månen" (kameraet flyver ud til Månen og tilbage). En tynd linje viser Månens bane.
- **Solen** (`js/kosmos/solen.js`): den kogende overflade, tal og et link til Stjerneovnen. Knappen "Jorden ved siden af" viser en lille Jord i den rigtige størrelse til sammenligning.
- Et tryk på "Solen" og "Jorden" i listen åbner deres egen visning. Menuen viser "x/8 set".
- Tal og tekster faktatjekkes mod NSSDC (alle tre faktaark kunne åbnes med curl).
- Fænomenfilerne bliver i `js/kosmos/`, for de har det samme format.

## Status efter M4c (29. oktober 2026)
- **Lavet:** `js/solsystem/flyby.js` (den fælles flyby, Saturn bruger den), `rejse.js` drejer systemet, så stedets lodrette retning peger op (stjernehimlen drejer med, `drejHimmel`), flyver ned til et sted i en bue hen over planeten og holder kameraet over bjergene (`bund`). Mars er et system på rejsen med "▶ Start flyby": hele Mars og Olympus Mons. `klippeplanet.js` har fået en højdetabel i JS (`overflade`, `sted`, `punkt`).
- **Olympus Mons:** Kameraet står 18° over horisonten, kigger fra syd, og klokken er 8 på stedet (formiddag: lange skygger og ingen skyer). Om eftermiddagen dækkede skyerne fra M3 det meste af vulkanen. Afstanden følger 3D-vinduets størrelse (`passer`).
- **Saturn uændret:** Kameraets plads, drejning og systemets skala er helt ens ved alle ni stop før og efter. Billederne uden stjerner afviger højst 0,04 % (to kørsler før ændringen afveg op til 0,07 % indbyrdes). Stoppet over ringene glider i rigtig tid og afviger mere i begge tilfælde. Stjernerne drejer langsomt i rigtig tid, så de flytter sig lidt fra kørsel til kørsel.
- **Ikke under bjergene:** Kameraet er mindst 2 km over jorden. Uden kollisionen kom det 120 km ned under jorden i testen. Den første udgave af flyvningen ned (van Wijk og Nuijs vej) gik gennem Mars, når man startede på bagsiden (skubbet op til ca. 100 km). Nu går den i en bue over planeten, og kameraet skubbes aldrig op under flyvningen.
- **Faktatjekket** (kilderne åbnet med curl) rettede skråningen (5 %, ca. 3°, ikke 5°) og koordinaterne (USGS' navneliste: 18,40° N, 226,00° Ø). To nye fagord: skjoldvulkan og caldera.
- **Til M5:** Flyvninger mellem to steder bruger samme bue. Stoppenes tekster faktatjekkes, og nettet med højderne er groft tæt på (ca. 21 km mellem punkterne på pc).

## Detaljer før flere stop (jeres svar 29. oktober 2026)
**Jeres ord:** Flybyen til Olympus Mons er "ikke for imponerende". I spurgte, hvordan billedet kan blive bedre, og om kameraet kan komme tættere på overfladen, så man ser, hvor høj vulkanen er.

**Hvorfor den ser flad ud:**
- **Nettet er flaskehalsen.** Hele Mars er ét net på 1024 × 512 felter (pc), altså ca. 21 km mellem punkterne ved ækvator. Olympus Mons (ca. 600 km bred) er kun ca. 29 punkter på tværs, og calderaen 3-4. Skyggerne regnes i hver pixel ud fra højdekortet (4k, ca. 5 km pr. pixel), men omridset og alt, der rager op, følger det grove net.
- **Skrænten ved foden** (op til 6-8 km, `fakta-solsystemet.md` del 3 afsnit 2) bliver med 21 km mellem punkterne til en skråning på ca. 20° i stedet for en mur.
- **Vulkanen er flad i virkeligheden:** Skråningen er kun ca. 3°, og fra sletten ved foden kan man ikke se toppen, fordi Mars krummer væk. Den imponerer, når man ser skrænten, calderaen og størrelsen skråt oppefra, og det kræver skarp geometri.

**Jeres svar:**
1. **M7 deles, og den første del kommer før M5** (ja). Rækkefølgen bliver M7a → M5 → M6 → M7b → M8.
2. **Højderne forbliver rigtige som standard** (enig). Det er skarpheden, kameraet og lyset, der skal gøre indtrykket. "Bjergene 10 gange højere" bliver som knap.

**M7a: lokale detaljer, prøvet på Olympus Mons (forslag, planen godkendes før go):**
- Et lokalt net kun over Olympus Mons (fx ca. 800 × 800 km med 1-3 km mellem punkterne) med sit eget højdekort fra MOLA i fuld opløsning (463 m pr. pixel, CC0, ingen HRSC nødvendig her) og et farvekort skåret ud af Viking-mosaikken (232 eller 925 m pr. pixel). Laves med `lav_mars.py` (rasterio).
- Det svære: overgangen til kloden (det globale net må ikke stikke igennem), `bund()` og højdetabellen bruger de lokale højder, og "Bjergene 10 gange højere" virker på begge.
- Kameraet stilles om efter den skarpe geometri: lavere vinkel og tættere på, evt. et stop ved skrænten. Solen lavere (længere skygger). Billeder i sekundet måles før og efter (tjekliste F), og filernes størrelse på GitHub Pages holdes nede (måske 1-3 MB pr. sted).
- Høj effort. Opus laver det selv (Mars er ikke en Fable-opgave i `plan-fable.md`).

Den fulde plan står i "Plan for M7a" nedenfor.

**Bagefter:** I M5 får hvert nyt stop sit eget lokale kort med den samme teknik (fx Valles Marineris, hvor de smalle dele forsvinder i det grove net), så kameraet kun skal stilles én gang. M7b (CTX og HiRISE ved Gale og Jezero) og M8 ("Stå på Mars") bygger videre på samme teknik med finere kort.

## Plan for M7a: lokale detaljer ved Olympus Mons (29. oktober 2026, godkendt)
**Jeres go (29. oktober 2026):** De tre anbefalinger nedenfor (HRSC+MOLA, hvis den er tydeligt skarpere, de to nye stop med `/faktatjek` og én PR). Højderne er rigtige som standard.
**Højdekilden (valgt 29. oktober 2026): HRSC+MOLA.** I spillets opløsning (ca. 0,5 km pr. pixel) er den tydeligt skarpere: MOLA har et ternet mønster mellem målesporene, et takket kraterrand og udtværede striber ved skrænten. HRSC+MOLA har et par kasseformede fejl på sletterne (op til 1,2 km fra MOLA i snit over ca. 7 km, hvor landet er fladt). Dér bruges MOLA (ca. 0,5 % af området, se `lav_steder.py`). Billedet blev vist i chatten.

**Målet:** Ved Olympus Mons skal man kunne se, at vulkanen er enorm: den stejle skrænt ved foden, calderaen på toppen og lavastrømmene. Højderne er rigtige (jeres svar). Skarpheden, kameraet og lyset gør indtrykket. Teknikken skal kunne genbruges ved de andre stop i M5.

**Hvad der begrænser i dag (målt i koden):**
- Nettet: 1024 × 512 felter på pc (`mars.js:129`), ca. 21 km mellem punkterne ved ækvator (ca. 28 km på tablet).
- Højdekortet: 4k, ca. 5,2 km pr. pixel. Skyggerne regnes i hver pixel ud fra det (`klippeplanet.js:73-81`), så de er heller ikke skarpere end 5 km.
- Farvekortet: 8k, ca. 2,6 km pr. pixel.
- Kameraet ved stoppet: `min: 0.02` (20 km) i `besøg()`, så det kan ikke komme tæt på.

### 1. Data (billedværktøjet)
- **Område:** ca. 1.000 × 1.000 km om Olympus Mons (ca. 9,5-27,5° N og ca. 143,5-124,5° V). Det dækker vulkanen, skrænten og en kant, hvor det lokale kort glider over i kloden. Lavastrømmene uden for skrænten (840 × 640 km i alt) kommer med det meste.
- **Højder:** Der prøves to kilder, og den skarpeste vælges ud fra billeder:
  - MOLA (463 m pr. pixel, CC0), samme fil som nu. Mellem MOLA's målespor er der fyldt ud, så de fine detaljer kan være udtværede. Det skal ses.
  - HRSC og MOLA lagt sammen (`mosaic/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif`, 200 m pr. pixel, 11,4 GB, CC BY-SA 3.0 IGO). Kun vinduet om Olympus læses (`rasterio` med et vindue). Bruges den, mærkes billedet CC BY-SA i `KILDER.md` (tilladt for M7 i "Licenserne").
  - Begge filer kan hentes i miljøet (tjekket med en liste fra USGS' S3-arkiv 29. oktober 2026).
- **Farver:** Viking MDIM 2.1 i 232 m pr. pixel (`mosaic/Mars_Viking_MDIM21_ClrMosaic_global_232m.tif`, 12,7 GB, kun vinduet læses). Den samme farverettelse som i `lav_mars.py` (de mørke egne bliver gråbrune), så det lokale kort har samme farver og lysstyrke som kloden. Det tjekkes ved kanten.
- **Størrelser (forslag):** Højden 2048 × 2048 (ca. 490 m pr. pixel, anslået 3-5 MB som PNG med 16 bit i rød og grøn). Farverne 4096 × 4096 på pc og tablet, hvis `maxTextureSize` ≥ 4096 (ca. 245 m pr. pixel, anslået 3-5 MB som JPG), ellers 2048, og 1024 i tests. Filerne hentes først, når man besøger Olympus Mons, og bliver i grafikkortet (`lager`).
- **Værktøjet:** `lav_mars.py` får en del til lokale kort (eller en ny fil `lav_steder.py`), så M5 kan lave de andre steder på samme måde. Stedets grænser står ét sted i JS og læses ikke af Python. Tallene skrives ind begge steder med en kommentar, ligesom `HØJDE_MIN` og `HØJDE_MAX`.

### 2. Det lokale net (`js/solsystem/klippeplanet.js`)
- **Et nyt net over stedet**, fx `lokalt({ bredde: [a, b], længde: [c, d], kort, højde, net })`. Det er et gitter i bredde og længde med fx 512 × 512 punkter på pc (ca. 2 km mellem punkterne), 384 × 384 på tablet og 128 × 128 i tests. Nettet hænger på samme gruppe som kuglen, så det drejer, skaleres og får overdriv på samme måde.
- **Samme lys og luft:** Det lokale net bruger samme fragment-shader som kuglen (lyset, tusmørket, sløret, isen og skyernes skygge). Shaderen skal derfor kende kortets strækning pr. pixel mod øst og nord som uniforms i stedet for at regne den ud fra et kort over hele kloden. Skyggerne bliver skarpe ned til ca. 0,5 km, fordi de regnes fra det lokale højdekort.
- **Overgangen til kloden (det sværeste):**
  - Inderst skjules kuglen (`discard` i kuglens fragment-shader inden for et rektangel i bredde og længde, sat med uniforms).
  - I en kant på fx 40 km glider højderne og farverne fra det lokale kort over i klodens (`mix` med en blød vægt), så de mødes nøjagtigt ved kanten.
  - Uden for det skjulte område tegnes begge. Det lokale net sænkes lidt i den yderste kant (en "skørt"-kant), så kuglen ligger øverst, og der ikke kommer sprækker eller flimmer (z-fighting).
  - Det tjekkes ved at flyve langs kanten i lavt lys.
- **Dybden:** Kameraet kan komme ned til få km over jorden, mens Mars er 3.400 km i radius. Det tjekkes, om dybdebufferen er præcis nok (flimmer mellem de to net og i bjergene langt væk), og om `kamera.near` skal følge højden over jorden. Er det ikke nok, prøves `logarithmicDepthBuffer` kun for Mars, men det koster lidt og skal måles.

### 3. Kollision, steder og overdriv
- **Højdetabellen** får en lokal del (højst 512 × 512, den højeste værdi i hvert felt, lavet i strimler som nu). `overflade()`, `punkt()` og `sted()` bruger den lokale tabel inden for området (med samme bløde overgang som shaderen) og ellers den globale. Så holdes kameraet 2 km over den rigtige jord (`bund`), og fokus ligger på den rigtige top.
- **"Bjergene 10 gange højere"** virker på begge net og begge tabeller.
- **Kameraet må komme tættere på:** `min` i `besøg()` sænkes (fx til 3-5 km), og zoom og drejning bliver langsommere helt nede (som ved hele Mars).

### 4. Kameraet, lyset og stoppene
- **Olympus Mons** stilles om efter den skarpe geometri. Udgangspunkt: lavere vinkel (ca. 8-12° i stedet for 18°) og tættere på, med horisonten i billedet. Solen lavere (fx kl. 7 i stedet for 8), så skyggerne bliver længere. Det endelige valg sker ud fra billeder.
- **To nye stop ved Olympus Mons (anbefales):**
  - **"Calderaen":** kameraet ca. 30-50 km over toppen, skråt ned i de seks kratere (ca. 65 × 80 km, op til ca. 3 km dybe).
  - **"Skrænten":** lavt ved foden af den stejleste del af skrænten (op til 6-8 km), så den står som en mur.

  Tallene er faktatjekket i forvejen (`fakta-solsystemet.md`, del 3 afsnit 2). Hvilken side af skrænten der er højest, skal findes i højdekortet og tjekkes mod en kilde. Teksterne er korte og faktatjekkes med `/faktatjek`. Flybyen har så fire stop: hele Mars, Olympus Mons, Calderaen og Skrænten.
- **Nørd-teksten ("Ærligt talt")** rettes: Nettet er fint ved Olympus Mons (ca. 2 km mellem punkterne), og kilden til højderne og farverne nævnes.

### 5. Tjek
- **Testen `mars`:**
  - Det lokale kort hentes ved stoppet.
  - Højden er den samme på begge sider af overgangen (forskel under fx 100 m langs hele kanten).
  - Calderaens bund ligger ca. 2-3 km under kanten.
  - Toppen er ca. 21 km over nulpunktet (MOLA).
  - Skrænten falder flere km på en kort strækning.
  - Kameraet er mindst 2 km over jorden ved alle stop, når man drejer og zoomer ned og med bjergene 10 gange højere.
  - Alt sættes tilbage i `stop`.
- **Saturn og Jorden er uændrede:** testene `saturn` og `jorden` og hele samlingen.
- **Billeder med fuld grafik** (`node tests/vaerktoejer/mars.mjs`) ved alle fire stop på pc og tablet på højkant, før og efter. Kun de nye billeder ses.
- **Billeder i sekundet** måles før og efter i testbrowseren (tjekliste F). Tabletten tester I selv. Skriv i "Ikke afprøvet", hvad I skal kigge efter: kanten mellem nettene, flimmer, hak, når kortene hentes, og hvordan det føles at komme helt ned.
- **Dokumentation:** `CLAUDE.md` (klippeplanet og mars), `KILDER.md`, "Status efter M7a" her, "Lige nu" i DESIGN.md og erfaringer.

### Hvis det bliver for tungt på tabletten
Først et grovere lokalt net (256 × 256), derefter 2048-farvekort. Tabletten klarede 8k-kortet på hele Mars fint, så det forventes ikke.

### Beslutninger, der bekræftes ved go (anbefalingerne står først)
1. **Højdekilden:** HRSC+MOLA, hvis den er tydeligt skarpere end MOLA på billederne (med CC BY-SA i `KILDER.md`), ellers MOLA.
2. **De to nye stop** (Calderaen og Skrænten) kommer med i M7a.
3. **Én PR for hele M7a.** Efter data-delen (afsnit 1) vises et billede, der sammenligner de to højdekilder, i chatten, men arbejdet fortsætter uden at vente på et nyt go, medmindre noget er uklart.

**Model og effort:** Opus med høj effort. Koden er det sværeste i Mars-planen indtil nu (to net, der skal mødes uden sprækker, shaderen og kollisionen), og `CLAUDE.md` siger Opus til kode og faktatjek. Xhigh er ikke nødvendig. M4c gik godt med høj. Hjælpeagenter: Haiku med lav effort til at opsummere lange testlogs.

## Status efter M7a (30. oktober 2026)
- **Lavet:** `billeder/solsystem/lav_steder.py` (læser kun vinduet om stedet hos USGS), de lokale kort `mars-olympus-hoejde-2k/1k.png` (2,8 MB og 0,9 MB) og `mars-olympus-farve.jpg` (86 kB), `lokalt()` i `klippeplanet.js` (det lokale net, overgangen til kuglen, den lokale højdetabel) og flybyen med fire stop: hele Mars, Olympus Mons (10° over horisonten, kl. 7), Calderaen (30°, kl. 8) og Skrænten (mod nordvest, 10°, kl. 8). Kameraet må komme ned til 3 km fra fokus og holdes 2 km over jorden.
- **Højderne:** HRSC+MOLA (valgt ud fra billedet i chatten). Kasseformede fejl i HRSC+MOLA på sletterne (op til 1,2 km) er erstattet af MOLA (ca. 0,5 % af området). Toppen er 21,2 km, calderaens bund ca. 3,3 km under kanten, og skrænten mod nordvest falder 7,8 km på ca. 20 km.
- **Farverne:** 925 m-mosaikken (som kloden), ikke 232 m-mosaikken, for den har skygger fra Solen malet ind (fx mørke skygger i calderaen). Afvigelse fra planen, se `KILDER.md`.
- **Lyset og luften:** Sløret af støv følger nu luften mellem stedet og kameraet (skalahøjden), så landskabet ikke bliver mælket ud tæt på jorden, og himlen lyser lidt ind i skyggerne. Det ændrer kloden lidt ved kanten og på de høje vulkaner (de er mindre slørede).
- **Overgangen:** Nettet ligger præcis på kuglens trekanter helt ude ved kanten og glider over i de lokale højder på 40 km. Kuglens trekanter under nettet tegnes ikke, og kun trekanterne på kanten har et hul (`discard`). En revne på en pixel, når man kiggede hen over kanten i lav vinkel, skyldtes `sin` og `cos` i shaderen (fejl på flere hundrede meter). Nu regnes kuglens punkter i JS.
- **Faktatjekket** (30. oktober 2026, `docs/fakta-solsystemet.md`, del 3, afsnit 2) rettede kraternes alder (ca. 100-400 mio. år), kantens højde (ca. 20-21 km), lufttrykket (ca. 10-15 %) og "overlapper hinanden".
- **Billeder i sekundet** i testbrowseren: se `docs/erfaringer.md` ("Lokale detaljer ved et sted"). Hvis tabletten hakker: først et grovere lokalt net (256 × 256 i stedet for 384 × 384), derefter mindre kort.
- **Til M5:** Hvert nyt sted får sin linje i `STEDER` i `lav_steder.py` og `LOKALE` i `mars.js`. Nettet kan have op til flere lokale net (et hul pr. net i kuglens shader).

## Plan for M6: Phobos og Deimos (30. oktober 2026, go givet)
*Lavet af Opus. Kilderne er tjekket med curl samme dag: USGS' arkiv, raw.githubusercontent.com, planetarynames (også navnelisternes shapefiler), science.nasa.gov, www.esa.int, photojournal, hirise.lpl.arizona.edu og JAXA (www.mmx.jaxa.jp, global.jaxa.jp og www.jaxa.jp, som I åbnede i dag). Blokeret: uahirise.org og static.uahirise.org (HiRISE' egne billeder), assets.science.nasa.gov (NASA's billedfiler) og naif.jpl.nasa.gov. De to fotos nedenfor er derfor hentet som små udgaver fra Wikimedia Commons. Billederne til planen ligger i `docs/m6/`.*

### 1. Formen og kortene
**Phobos:** USGS' højdekort fra Mars Express (`Phobos_ME_HRSC_DEM_Global_2ppd.tif`, 699 × 349, 100 m pr. pixel, højde over en kugle på 11,1 km, østlig længde).
- **Den vender rigtigt (tjekket):** Kraterne i USGS' navneliste passer med højdekortet, når længden er østlig: Stickney ligger 443 m dybere end ringen omkring (spejlvendt 4 m), Drunlo 295 m (9 m) og Todd 232 m (7 m). **Fælde:** Shapefilens metadata siger "Positive West", men tallene er østlige (Stickney 311° Ø = 49° V). Det skrives i erfaringer.md.
- **Fælde i kortet:** 699 pixel × 100 m er lidt mere end en omgang (kortet starter ved −180,14°). Kanten skal skæres efter kortets geografiske felter (tjekliste E).
- **Overfladen:** SRC-mosaikken fra Mars Express (`Phobos_ME_SRC_Mosaic_Global_16ppd.tif`, 5760 × 2880 gråtoner, ca. 12 m pr. pixel, 16,6 MB). Den passer på højdekortet (Stickney ligger samme sted, `docs/m6/phobos-kort-src.jpg`). Den er meget skarpere end højdekortet, så rillerne og de små kratere kommer fra kortet. **Problem:** Den er lavet af fotos, så skyggerne er malet ind, og der er sorte pletter ved polerne (skygge eller ingen data). **Forslag:** Dæmp de store forskelle i lyset (divider med en kraftigt sløret udgave af kortet), fyld de sorte pletter ud, og lad programmet regne lyset ud fra højdekortet. Farven er Phobos' egen mørke, rødbrune grå (ca. 7 % af lyset kastes tilbage) som en fast farve. HRSC' farvemosaik findes kun i 100 m pr. pixel.
- **Opløsning:** 4k (4096 × 2048, ca. 17 m pr. pixel) på pc og tablet, 2k i tests. Højderne som 16 bit (rød og grøn) i 1024 × 512.

**Deimos:** Thomas' formmodel (1993, `m2deimos.tab`, et gitter på 5°, kontrolsummen passer med originalen).
- **Længden er vestlig (tjekket):** Thomas' formmodel af Phobos fra samme datasæt (`Phobos.tab` fra samme spejl, samme format) passer kun med USGS' højdekort, når længden læses som vestlig: korrelation 0,96 (rms 0,33 km) mod 0,85 (0,64 km) for østlig. Deimos-filen er derfor også vestlig. Den skal vendes til østlig, ellers bliver Deimos spejlvendt. Tilpasningen til HiRISE-fotoet peger samme vej, men svagt (0,915 mod 0,905), for Deimos er rund og blød.
- **Overfladen:** `deimoscyl4.jpg` (3600 × 1800 gråtoner, 0,1° pr. pixel, østlig længde ifølge USGS). Den er sløret som en airbrush-tegning, og det er usikkert, hvem der har lavet den (Stooke alene eller Hamiltons blanding, faktagrundlaget del 3B). **Forslag:** Brug den dæmpet som i Phobos, men kun hvis kraterne passer med HiRISE-fotoet, når den sidder på formen (tjekkes som det første i M6a). Ellers kun formen med en fin, kornet overflade lavet af programmet. Det står ærligt i "Ærligt talt". 2k er nok (kortet er ikke skarpere).
- **Formen er grov** (ca. 500 m mellem punkterne). Det passer faktisk med Deimos, som er glat af støv. Formen forfines med en blød kurve (ikke kanter).

**Billederne** (lavet med et lille Python-script, lyset er fladere end i programmet):
- `docs/m6/formen-mod-fotos.jpg`: HiRISE-fotoet (2008 og 2009) ved siden af formen og den spejlvendte form, tilpasset samme kamera, sol og drejning. Ved Phobos står Stickney til højre som i fotoet, og kraterparret forneden passer. Spejlvendt passer det dårligere (0,882 mod 0,860).
- `docs/m6/former-fra-seks-sider.jpg`: begge måner fra seks sider (mod Mars, forfra, bag, bagfra, nordpolen og sydpolen), og Deimos både østlig (forkert) og vestlig (rigtig).
- I M6a laves billederne igen i programmet med kortene på, og de sammenlignes med fotoet (som `tests/vaerktoejer/mars.mjs`).

**Teknik:** Begge månerne bliver en kugle med 512 × 256 punkter (Deimos 256 × 128), der skubbes ud til radius i JS én gang (ingen vertex-shader: de er små og står stille). Lyset bruger normaler fra formen og kortet som detalje. En ny fil `js/solsystem/maane-form.js` (`lavFormmåne`), så andre små måner kan bruge den senere. Kropsretninger: længde 0 mod Mars, nord op, og banen mod uret set fra nord. Testen tjekker, at punktet, der vender mod Mars, er længde 0, og at Stickney ligger på den side, hvor den skal (længde 311° Ø).

### 2. Banerne og farten
| | Phobos | Deimos |
|---|---|---|
| Afstand fra Mars' midte | ca. 9.376 km (ca. 6.000 km over overfladen) | ca. 23.460 km |
| Omløbstid | 7 t 39 min | 30 t 18 min |
| I programmet (Mars drejer ca. 847 gange hurtigere: en omgang på 1¾ minut) | ca. 32,5 sekunder | ca. 2 min 9 s |
| Går over himlen (set fra Mars' ækvator) | hver ca. 11 t, i programmet hvert ca. 47. sekund, fra vest mod øst | hver ca. 5,4 døgn, i programmet ca. 9 minutter |

**Anbefaling: samme forhold som Mars' døgn.** Kun sådan ses det, der er særligt: Phobos runder Mars hurtigere, end Mars drejer, så den står op i vest og går ned i øst, og Deimos står næsten stille over et sted. Månerne følger Mars' ur: Står Mars stille ("Drej Mars" slået fra eller helt tæt på), står de også stille. Under besøg ved en måne og på flybyen står månen stille (som Saturns måner), men Mars drejer videre. Banerne ligger i Mars' ækvatorplan (de hælder kun ca. 1-2°) og hælder med Mars' akse (også ved Nordpolens sommer).

**Begge vender samme side mod Mars** (bundet rotation, længde 0 mod Mars). **Mars' skygge:** Ved jævndøgn går Phobos gennem Mars' skygge på hver omgang (ca. en time i virkeligheden, ca. 4 sekunder i programmet). Forslag: en enkel skygge (en cylinder bag Mars) i månernes shader, så de bliver mørke. Lille opgave, og den er rigtig.

**Når man ser hele Mars:** Phobos (ca. 22 km bred) ville være under én pixel, når man ser hele Mars. **Anbefaling: som Saturns måner:** Langt væk tegnes de større (højst få pixel), banerne ses som tynde linjer, når kameraet er langt nok væk, og navnene "Phobos" og "Deimos" står over dem. En ny knap **"Månerne"** flyver ud, så begge baner kan ses (Deimos' bane er ca. 7 gange Mars' radius, inden for kameraets grænse på 15 radier). Det står ærligt i "For nørder", at de er tegnet større.

**Navnene:** Månernes navne følger knappen "Navne" (`navneTil()`). Et tryk på en måne besøger den, også når navnene er slået fra (som ved Saturn).

### 3. Flybyen
**Anbefaling: Turen fortsætter fra Nordpolen ud til månerne (13 stop):** … Nordpolen → **Phobos** → **Mars set fra Phobos** → **Deimos**. Det er én historie fra planeten og ud, som ved Saturn, og overgangen er god: Fra Nordpolen kan man aldrig se Phobos (den er under horisonten nord for ca. 70° bredde). Alternativet er en egen tur ("▶ Flyby: månerne"), men så skal man finde to knapper. Man kan stoppe turen, når man vil, og besøge månerne med et tryk.
- **Phobos:** set på skrå fra siden med Stickney i solen og Mars i baggrunden.
- **Mars set fra Phobos:** Kameraet står ca. 300 m over Phobos' side, der vender mod Mars, og ser op. Mars fylder ca. 42° af himlen (ca. 80 gange så bredt som Månen på vores himmel), dvs. det meste af skærmen (synsvinklen er 40° lodret). Mars drejer under en. **Risiko:** Kameraets near skal ned på ca. 0,0001 enheder (100 m), mens Mars er ca. 6 enheder væk. Det kan give flimmer i Mars' lag (luften og nettene). Måles som det første i M6b. Hjælper det ikke at flytte near, står kameraet 2-3 km over Phobos i stedet.
- **Deimos:** tæt på, og man ser Mars som en lille kugle (ca. 17° bred).
- Rækkefølgen og stoppene bruger det fælles `flyby.js`. Kortene til månerne hentes, når Mars åbnes, efter kortene til Olympus Mons (de er små, ca. 2-3 MB).

### 4. Tekster (udkast, faktatjekkes med `/faktatjek` i M6b)
Undertekster (højst ca. 160 tegn):
- **Phobos:** "Phobos er kun ca. 26 km lang og kredser kun ca. 6.000 km over Mars. Den runder Mars på 7 timer og 39 minutter, hurtigere end Mars drejer."
- **Mars set fra Phobos:** "Herfra fylder Mars ca. 42° af himlen, ca. 80 gange så bredt som Månen på vores himmel. Phobos vender altid samme side mod Mars."
- **Deimos:** "Deimos er kun ca. 16 km lang og kredser ca. 23.500 km fra Mars' midte. Den er glattere end Phobos, fordi støv har fyldt kraterne op."

Panelet ved hvert stop: Stickney (ca. 9 km, næsten halvdelen af Phobos, opkaldt efter Angeline Stickney Hall), rillerne (man er ikke enige om, hvorfor), at Phobos står op i vest to gange om dagen og ikke kan ses fra polerne, at Phobos kommer nærmere med nogle få cm om året og om nogle titals millioner år bliver revet i stykker til en ring eller styrter ned, opdagelsen (Asaph Hall, august 1877) og navnene (Frygt og Rædsel), hvor månerne kommer fra (ikke afgjort: indfangede asteroider eller stumper fra et kæmpe nedslag) og **MMX** (JAXA. Opsendt 20. oktober 2026 kl. 04:41 japansk tid og har sendt de første signaler hjem. Den skal hente mindst 10 g fra Phobos og komme hjem i 2031. Slås op igen samme dag, som teksten skrives, og skrives med måned og år).

"For nørder": tallene (akser, tæthed ca. 1,9 og 1,5 g/cm³, albedo ca. 0,07), bundet rotation og den synkrone bane (Phobos er inden for, Deimos uden for), formmodellerne og kortene (hvem der har lavet dem).

"Ærligt talt": tiden går ca. 850 gange hurtigere, månerne står stille under besøg, de er tegnet større langt væk, banerne ligger præcis i ækvatorplanet, Deimos' form er målt på Viking-billeder fra 1970'erne (grov), og kortene har skygger malet ind, som er dæmpet.

**Nye fagord:** bundet rotation, regolit og evt. tidevandskraft (ingen af dem står i ordbogen).

### 5. Hvad det koster
- **Filer:** Phobos' kort 4k ca. 2 MB (2k ca. 0,6 MB) og højder ca. 0,7 MB. Deimos' kort 2k ca. 0,3 MB og formen ca. 20 kB. I alt ca. 3 MB ekstra på pc (Mars' egne kort og Olympus er ca. 14 MB).
- **Grafikkortet:** Phobos' kort som én kanal (`RedFormat`) 8 MB + mipmaps ≈ 11 MB, Deimos ≈ 3 MB, nettene ca. 5 MB. I alt ca. 20 MB (Mars' 8k-kort fylder ca. 170 MB).
- **Billeder i sekundet:** Ved hele Mars er månerne nogle få pixel og koster næsten intet. Ved "Mars set fra Phobos" tegnes hele Mars med nettene, så det koster som hele Mars (testbrowseren: pc ca. 2,6, tablet ca. 4,5). Måles før og efter (tjekliste F).

### 6. Opdeling
**Anbefaling: to dele, hver med sin PR.**
- **M6a: formen, kortene og banerne:** billedværktøjet (`billeder/solsystem/lav_maaner.py`), `lavFormmåne`, banerne med den rigtige fart, Mars' skygge, navnene, et tryk på en måne, knappen "Månerne" og billederne mod fotoene. Grafik og fysik, som kan tjekkes på billeder og tal, før der skrives tekster.
- **M6b: flybyen og teksterne:** de tre nye stop, "Mars set fra Phobos" (near og flimmer), teksterne med `/faktatjek`, "For nørder", "Ærligt talt", fagord og billeder i sekundet.
Grunden: Teksterne ved stoppene afhænger af, hvordan stoppene ser ud, og hver del er mellem stor. Det svære i M6a (spejlvending og banernes retning) er løst eller kan tjekkes med tal.

### 7. Model og effort
Opus med høj effort til begge dele (kode, fysik og fakta, som `CLAUDE.md` siger). Xhigh er ikke nødvendig: Det sværeste (om Deimos er spejlvendt) er afgjort ovenfor. Faktatjekket i M6b: højst 2 hjælpeagenter med Opus og høj effort. Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs.

### Beslutninger, der bekræftes ved go (anbefalingerne står først)
**Jeres svar (30. oktober 2026): "Go herfra. Vi følger dine anbefalinger."** Alle syv gælder (den første mulighed i hvert punkt). M6a først, og et go før M6b.

1. **Farten:** Månerne følger Mars' ur i det rigtige forhold (Phobos ca. 32 sekunder om en omgang), og de står stille under besøg. *Eller:* langsommere end Mars, så de er lettere at følge (men så står Phobos ikke op i vest).
2. **Phobos' overflade:** SRC-mosaikken i 4k med dæmpede skygger. *Eller:* kun højdekortet og en fast farve (blødere, ingen riller).
3. **Deimos' overflade:** `deimoscyl4.jpg`, hvis kraterne passer med fotoet, ellers kun formen. *Eller:* kun formen.
4. **Flybyen:** fortsætter fra Nordpolen (13 stop). *Eller:* en egen tur for månerne.
5. **"Mars set fra Phobos"** som et eget stop med kameraet tæt på Phobos' overflade. *Eller:* kun et stop ved Phobos, hvor Mars ses bagved.
6. **Mars' skygge på månerne** kommer med i M6a.
7. **Opdeling:** M6a og M6b med hver sin PR og et go imellem. *Eller:* én PR for hele M6.

## Prompt til navneknappen og M6: Phobos og Deimos (skrevet 30. oktober 2026)
**Model og effort:** Opus med høj effort. Navneknappen er lille kode i programmet. M6 er kode, fysik (banerne og farten), formmodeller og fakta (`CLAUDE.md`). Xhigh er ikke nødvendig: Teknikken (rejsen, flybyen og månerne ved Saturn) findes. Det sværeste er at få Deimos' formmodel til at vende rigtigt (længdegraderne kan være østlige eller vestlige), og det tjekkes med billeder. Fable bruges ikke: I har besluttet at vente på Fable 5.5 (`docs/plan-fable.md`). Hjælpeagenter: Opus med høj effort til `/faktatjek` (højst 2), Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs. Start en ny session fra `main`.

**Prompten (kopiér den):**

> Lav to ting i AtomLab. Læs først "Lige nu" i DESIGN.md, `docs/plan-mars.md` (Delopgaverne, "Status efter M5b", "Formen på månerne (M6)" under Teknik og licenserne), `docs/fakta-solsystemet.md`, del 3B (Phobos, Deimos, MMX, formmodeller og licenser), og tjeklisterne i `docs/erfaringer.md`.
>
> **Del 1: Navneknappen (har go, egen PR, som du selv merger, når testene er grønne).**
> - En til/fra-knap "Navne" under "Prøv selv" ved Mars (navnene og prikkerne på kloden, `NAVNE` i `js/kosmos/mars.js`) og ved Saturn (månernes navne, `etiket` i `js/kosmos/saturn.js`). Slået til fra start.
> - Fra: navnene og prikkerne skjules, og et tryk på Mars flyver ingen steder hen. Ved Saturn kan man stadig trykke på selve månerne.
> - Valget deles af alle planeterne og huskes (`localStorage`, `atomlabNavne`: `'til'` eller `'fra'`). Lav det som en lille fælles hjælper i `js/solsystem/`, så Phobos og Deimos (og senere planeter og måner) kan bruge den.
> - Tjek i testene `mars` og `saturn`: Navnene forsvinder, et tryk på kloden gør intet, og valget huskes efter genindlæsning. Kør `--ændret`, og opdater CLAUDE.md (også "Gemte data").
>
> **Del 2: Planen for M6 (Phobos og Deimos). Vent på mit go, før du bygger.** Tjek først med curl, at kilderne kan åbnes: USGS' arkiv `asc-pds-services.s3.us-west-2.amazonaws.com`, `raw.githubusercontent.com`, `planetarynames.wr.usgs.gov`, `science.nasa.gov`, `www.esa.int` og JAXA's sider om MMX. Giver curl "unable to get local issuer certificate", er siden ikke blokeret (se "Certifikater" i erfaringer.md). Spørg mig, hvis noget er blokeret, før arbejdet går i gang. Planen skal stå i `docs/plan-mars.md` under "Plan for M6" og svare på:
> 1. **Formen:** Phobos af USGS' højdekort fra Mars Express og Deimos af Thomas' formmodel (1993). Hvilke kort (farver eller gråtoner) og hvilken opløsning? Vis billeder af begge måner fra flere sider ved siden af rigtige fotos (fx fra HiRISE eller Mars Express), så vi kan se, at de vender rigtigt og ikke er spejlvendte.
> 2. **Banerne og farten:** den rigtige afstand og omløbstid i forhold til Mars' døgn (Mars drejer meget hurtigere i programmet: Skal månerne følge med i samme forhold?). Phobos står op i vest og går ned i øst. Begge vender samme side mod Mars. Hvordan ses de, når man ser hele Mars (de er meget små: tegnes de større langt væk som Saturns måner, og står det ærligt)?
> 3. **Flybyen:** Fortsætter turen fra Nordpolen ud til Phobos og Deimos (12 stop), eller skal de have deres egen tur? "Mars set fra Phobos" (Mars fylder ca. 42° af himlen). Navnene og navneknappen fra del 1 skal også gælde månerne.
> 4. **Tekster:** undertekster (højst ca. 160 tegn) og tekster i panelet ved hvert stop, "For nørder", "Ærligt talt" og nye fagord. Alt med `/faktatjek`. Det, der ændrer sig (MMX' opsendelse og status), slås op samme dag og skrives med måned og år.
> 5. **Hvad det koster:** filernes størrelse, grafikkortets hukommelse og billeder i sekundet.
> 6. **Opdeling:** Skal M6 deles (fx M6a: formen og banerne, M6b: flybyen og teksterne)? Giv en anbefaling.
>
> Giv anbefalinger med begrundelse, sæt beslutningerne op som spørgsmål til mig, og sig, hvis en anden model eller effort passer bedre til en del. Når du har fået go: Byg det, én PR pr. del, som du selv merger, når testene er grønne. Giv mig "Ikke afprøvet" til sidst (det, jeg skal prøve på tabletten).

## Prompt til M5b (skrevet 30. oktober 2026)
**Model og effort:** Opus med høj effort (kode i programmet, fakta og danske tekster, som `CLAUDE.md` siger). Xhigh er ikke nødvendig: teknikken fra M7a og M5a genbruges. Hjælpeagenter: Opus med høj effort til `/faktatjek`, Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs. Start en ny session fra `main`.

**Prompten (kopiér den):**

> Lav to ting i AtomLab. Begge har go. Læs først "Lige nu" i DESIGN.md, `docs/plan-mars.md` ("Plan for M5", "Status efter M5a" og "Status efter M7a+") og tjeklisterne i `docs/erfaringer.md`. Tjek først med curl, at `www.dlr.de`, `www.jsg.utexas.edu` og `marsed.asu.edu` kan åbnes (de var blokeret i sidste session, selv om de står på listen). Spørg mig, hvis de stadig er blokeret, før faktatjekket går i gang. Én PR for hver del. Du merger den selv, når testene er grønne.
>
> **Del 1 (lille): Hent første stop på forhånd.**
> - Mars: Kortene til Olympus Mons (det lokale net, ca. 2,9 MB) begynder at hentes, når Mars åbnes, efter Mars' egne kort. "▶ Start flyby" står der hele tiden, men er grå med "Henter kort …", indtil de er hentet. Fejler hentningen eller tager den for lang tid, bliver knappen aktiv efter ca. 8 sekunder alligevel.
> - Saturn: Jeg har oplevet et hak, når flybyen startede ved Saturn. Find årsagen først (fx at månernes billeder hentes eller lægges i grafikkortet, når flybyen starter), og hent det, første stop skal bruge, på forhånd på samme måde. Måske er det allerede løst. Gør det ikke til et større projekt.
> - "Næste: …"-knapperne ændres ikke: Kortene til næste stop har været klar, når man har været ved et stop et par sekunder.
> - Tjek det i testene `mars` og `saturn`.
>
> **Del 2: Mars M5b** som i planen: Gale (Curiosity), Jezero (Perseverance), nordpolen og navnene på kloden.
> - Navnene på kloden: Når man ser hele Mars, kan man trykke på Olympus Mons, Tharsis, Valles Marineris, Hellas, Gale, Jezero og Nordpolen og flyve direkte derhen, ligesom månerne ved Saturn. Navnene skjules på bagsiden.
> - Lokale net ved Gale og Jezero: Sammenlign først HRSC+MOLA og MOLA i billeder i spillets opløsning, som i M5a. Brug et detaljekort, hvor kameraet kommer tæt på og ellers bliver grumset (regn skærmpixel pr. højdepixel, tjekliste E). Intet net ved polen.
> - Nordpolen: nordlig sommer med midnatssol ved polstoppet. Sig det ærligt i teksten.
> - Koordinaterne fra USGS' navneliste i MDIM 2.1.
> - Tekster med `/faktatjek`. Rovernes status (hvor de er, prøverør, Mars Sample Return) slås op samme dag og skrives med måned og år. Nye fagord: rover, delta og biospor.
> - Til sidst: billeder i sekundet ved de nye stop, billeder på pc og tablet på højkant og hele testsamlingen (M5 er færdig).
>
> Giv mig "Ikke afprøvet" til sidst: det, jeg skal prøve på tabletten.

## Status efter M5b (30. oktober 2026): Gale, Jezero, Nordpolen og navnene på kloden. M5 er færdig.
- **Flybyen har 10 stop:** hele Mars, Olympus Mons, Calderaen, Skrænten, Tharsis, Valles Marineris, Hellas, **Gale og Curiosity** (kl. 9, fra nord mod Mount Sharp), **Jezero og Perseverance** (kl. 7½, fra syd: Krateret er så lavt, at det først kunne ses med lav sol) og **Nordpolen** (højt over kappen).
- **Koordinaterne** er fra USGS' navneliste i MDIM 2.1 (shapefilen, ikke sidevisningen, som har et ældre sæt for Gale og Planum Boreum): Gale 5,367° S, 137,811° Ø, Jezero 18,408° N, 77,687° Ø og Planum Boreum 87,32° N, 54,96° Ø.
- **Lokale net ved Gale og Jezero:** HRSC+MOLA var tydeligt skarpere end MOLA begge steder (billederne i chatten: Mount Sharp, kraterranden og kløfterne, MOLA har det ternede mønster). Kortene dækker ca. 356 × 356 km i 2048 × 2048 (ca. 0,17 km pr. pixel, lige så skarpt som kilden). **Intet detaljekort:** Ved Gale fylder én højdepixel ca. 0,6 skærmpixel og ved Jezero ca. 1,7 (tjekliste E siger ca. 3 som grænse), og kortet er allerede så skarpt som kilden. Ca. 2,1-2,2 MB pr. højdekort (tests 0,8 MB) og 60 kB farver. Farverne har ingen skygger malet ind (den mørke ring i Gale er sandklitter).
- **Nordpolen:** intet net. Under flyvningen derhen drejer aksen til nordligt sommersolhverv (nordpolen præcis 64,81° fra Solen), så Solen står 22,5-27,9° oppe hele døgnet: midnatssol. Programmets "jævndøgn" har Solen 2,9° over ækvator (et gammelt valg), så en drejning på 25,19° mod Solen gav 30,8° (testen fangede det). Tilbage ved et andet sted eller hele Mars er det jævndøgn igen. "Drej Mars" viser lyset gå rundt.
- **Navnene på kloden:** syv navne med en prik, som man kan trykke på, når man ser hele Mars. De har samme størrelse på skærmen, skjules på bagsiden, tæt på (under ca. 1,25 radier), under flyvninger og på flybyen. Et tryk flyver derhen og viser stedets undertekst og tekst.
- **Faktatjek** (to hjælpeagenter, rovernes status slået op samme dag i NASA's egne kortdata og blogs): `docs/fakta-solsystemet.md` under "Faktatjek M5b". Nye fagord: rover, delta og biospor (også "biosignatur").
- **Billeder i sekundet** (testbrowseren, fuld grafik, målt én ad gangen): pc: hele Mars 2,6, Valles Marineris 1,5, Hellas 2,3, Gale 2,2, Jezero 1,8, Nordpolen 1,8. Tablet på højkant (touch, `LAV_KVALITET`): 4,5, 3,4, 3,4, 2,8, 2,6, 2,6. Gale og Jezero er ca. 20 % under Valles Marineris på tablet, men på niveau med Olympus Mons i M7a.
- **Ikke afprøvet:** se "Lige nu" i DESIGN.md.
- **Næste:** M6 (Phobos og Deimos), M7b (de meget skarpe kort ved Gale og Jezero) og M8 (Stå på Mars). Rækkefølgen er jeres valg.
- **Jeres ønske efter M5b (30. oktober 2026), med i næste opgave:** En knap, så man kan slå navnene til og fra, når man ser Mars dreje. Det gælder også andre planeter og måner. Forslag til, hvordan det laves:
  - En til/fra-knap "Navne" under "Prøv selv" ved Mars og Saturn (Saturns månenavne, `etiket` i `saturn.js`) og ved alle kommende planeter og måner (fx Phobos og Deimos i M6). Slået til fra start.
  - Fra: Navnene og prikkerne skjules, og tryk på kloden flyver ingen steder hen (man kan stadig trykke på selve månerne ved Saturn). Til: som nu.
  - Valget deles af alle planeterne (en fælles hjælper, fx i `js/solsystem/`), så det ikke skal slås fra igen ved hver planet.
  - **Jeres svar (30. oktober 2026): Husk valget** (`localStorage`, `atomlabNavne`: `'til'` eller `'fra'`).
  - Tjek: testene `mars` og `saturn` (navnene forsvinder, og et tryk på kloden gør intet, når knappen er slået fra).

## Prompt til M8: Stå på Mars (skrevet 30. oktober 2026)
**Jeres valg (30. oktober 2026):** M8 kommer før M7b. Det ændrer rækkefølgen fra M7b → M8. M8 må derfor selv skaffe de skarpe kort ved de steder, man står (se spørgsmål 3 i prompten).

**Model og effort:** Opus med høj effort. M8 er stor og ny: et landskab helt nede ved jorden, data i meget høj opløsning, himmel, lys og kamera i øjenhøjde. Først en plan, så et go. Xhigh er ikke nødvendig til planen. Det svære er valg af data og teknik, og det kan tjekkes med billeder og tal. Overvej xhigh, når det svære stykke bygges (overgangen fra kredsløb til jorden og dybdeopløsningen), hvis planen viser, at det bliver nyt og svært. Fable bruges ikke (I venter på Fable 5.5, `docs/plan-fable.md`). Hjælpeagenter: Opus med høj effort til `/faktatjek` (højst 2), Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs. Start en ny session fra `main`.

**Prompten (kopiér den):**

> Lav en plan for Mars M8, "Stå på Mars", i AtomLab. **Byg ikke endnu: Vent på mit go.** Læs først "Lige nu" i DESIGN.md, `docs/plan-mars.md` (Delopgaverne, "Teknik" med billederne, licenserne og panoramaerne, "Plan for M7a", "Status efter M5b" og "Status efter M6b") og `docs/fakta-solsystemet.md` (del 3: Gale og Curiosity, Jezero og Perseverance, del 3B afsnit 8-9: licenser og 360°-panoramaer) og tjeklisterne i `docs/erfaringer.md`.
>
> Tjek først med curl, at kilderne kan åbnes: `asc-pds-services.s3.us-west-2.amazonaws.com` (USGS: `mosaic/Mars/MSL/` og `mosaic/Mars/MSR_TRN_HiRISE_soc_003_USGS_release_aug2024/`), `astrogeology.usgs.gov`, `science.nasa.gov`, `photojournal.jpl.nasa.gov`, `upload.wikimedia.org`, `hirise.lpl.arizona.edu` og `www.uahirise.org`. Giver curl "unable to get local issuer certificate", er siden ikke blokeret (se "Certifikater" i erfaringer.md). Spørg mig, hvis noget er blokeret, før planen går i gang.
>
> **Målet (mine ord fra starten):** Man skal få oplevelsen af at besøge planeterne. "Det hele skal med. Det skal være så flot og imponerende som muligt." M8: Man står på Mars ved Gale (med Mount Sharp) og ved Jezero (med deltaet), der hvor roverne kører, og kigger rundt.
>
> Planen skal stå i `docs/plan-mars.md` under "Plan for M8" og svare på:
> 1. **Hvor står man?** Ved landingsstedet, der hvor roveren er nu (oktober 2026), eller et sted med en særlig god udsigt (fx Mount Sharp set fra kraterbunden, og deltaets kant i Jezero)? Giv koordinaterne og kilden, og vis billeder af udsigten fra hvert forslag.
> 2. **Data:** Hvilke højdekort og fotos (rovernes kort fra USGS: Gale-højdekortet med 1 m og ortofotoet med 25 cm, Jezeros HiRISE-kort med 1 m, CTX), og hvor stort et område? Kan rasterio læse et lille vindue direkte over nettet (også i zip-filerne til Jezero)? Hvor store bliver filerne (de skal ligge på GitHub Pages), og hvor meget fylder de i grafikkortet på tabletten? Har fotoene skygger malet ind, og er de i farver eller gråtoner? Tjek licenserne og hvordan de skal krediteres.
> 3. **M8 før M7b:** Hvordan kommer man fra kredsløb ned på jorden, når de meget skarpe kort fra M7b ikke findes endnu? Skal M8 selv have flere lag (fx et mellemlag med CTX og et skarpt lag lige omkring stedet), eller skal man "lande" med en overgang? Hvad af M7b bliver lavet undervejs, og hvad venter?
> 4. **Teknik:** et eget landskab (et fladt eller let krummet net omkring stedet) eller endnu et `lokalt` net på kloden? Kameraet i øjenhøjde (ca. 1,7 m), horisonten ca. 3,4 km væk, Mount Sharp ca. 20-30 km væk, kameraets near og far og dybdeopløsningen (mål flimmer ved at sammenligne med en større near, se erfaringer.md under M6b). Hvordan drejer man rundt med fingeren og musen (som at dreje hovedet, som ved "Mars set fra Phobos")?
> 5. **Himlen og lyset:** Mars' himmel er gulbrun om dagen og blålig omkring Solen ved solnedgang. Skal der være tid på dagen (en skyder eller knapper), støv i luften, der gør det fjerne landskab disset, og Solens størrelse set fra Mars? Kan Phobos ses på himlen, og må den være med?
> 6. **Panoramaerne:** Kan rovernes rigtige 360°-panoramaer bruges (fx Curiositys PIA20332 og Perseverances PIA24422, de er kun striber)? Som en egen visning ("Se rovernes billede") ved siden af landskabet i 3D, eller slet ikke? Giv en anbefaling.
> 7. **Roveren:** Skal roveren stå i billedet (en 3D-model fra NASA, hvis licensen og størrelsen tillader det), eller kun sporene?
> 8. **Hvordan kommer man derhen?** En knap "Stå på Mars" ved Gale og Jezero (flybyen og et tryk på navnet), en flyvning ned og en knap tilbage.
> 9. **Tekster:** hvad man ser fra stedet, roverens fund og "Ærligt talt" (hvad er målt, og hvad er tegnet). Alt med `/faktatjek` i byggefasen. Det, der ændrer sig (rovernes plads og status), slås op samme dag og skrives med måned og år.
> 10. **Hvad det koster:** filernes størrelse, grafikkortets hukommelse og billeder i sekundet (pc og tablet). Hvad gør vi, hvis det bliver for tungt på tabletten?
> 11. **Opdeling:** Skal M8 deles (fx M8a: Gale, M8b: Jezero og panoramaerne)? Giv en anbefaling.
>
> Giv anbefalinger med begrundelse, sæt beslutningerne op som spørgsmål til mig med anbefalingen først, og sig, hvis en anden model eller effort passer bedre til en del. Skriv mine svar ind i planen med det samme. Når jeg har sagt go: Byg det, én PR pr. del, som du selv merger, når testene er grønne. Giv mig "Ikke afprøvet" til sidst (det, jeg skal prøve på tabletten).

## Status efter M8a (30. oktober 2026): Stå på Mars ved Gale
- **Lavet:** `js/solsystem/landskab.js` (landskabet), `billeder/solsystem/lav_landskab.py` og lagene i `billeder/solsystem/landskab/`, knappen "🧍 Stå på Mars" ved Gale i `js/kosmos/mars.js`, testen `landskab` og værktøjerne `tests/vaerktoejer/landskab.mjs` og `landskab-lille.mjs`.
- **To steder:** Naukluft (sol 1301, hvor panoramaet PIA20332 er taget, 4,678° S, 137,359° Ø, −4.429 m) og "Hos Curiosity nu" (sol 5045, 4,825° S, 137,388° Ø, −3.488 m). Højden under kameraet passer med NASA's kortdata inden for 1 m.
- **Lagene:** lag 0 (2 × 2 km, højder 1 m, foto 25 cm på pc i 8k og 50 cm på tablet), lag 1 (8 × 8 km, 4 m og 2 m), lag 2 (64 × 64 km, 16 m) og lag 3 (stedets kort fra M5b, ca. 0,17 km, med CTX-fotoet ca. 87 m). Uden for Gale-kortet (det dækker ca. 33 × 57 km) er huller fyldt med HRSC+MOLA. Fotoenes skygger fra skråningerne er fjernet (regression mod hældningen i firkanter). Et forsøg på at fjerne striberne mellem satellitbillederne hjalp ikke og blev droppet: Striberne ses lidt i det fjerne lag.
- **Hentes, når man trykker:** ca. 45 MB på pc og ca. 36 MB på tablet første gang (i baggrunden, mens kameraet flyver ned, 5-8 sekunder). Billederne fylder 82 MB i repoet (testudgaver 3,6 MB).
- **Teknik:** et net i ringe om stedet (1024 × 900 på pc, 640 × 640 på touch). Normalen regnes i nettets punkter: Med normalen pr. pixel (4 opslag i højderne) var det 6 gange langsommere. Skyggekortene stopper, når strålen er over det højeste sted (`hMaks`, 1.963 m ved Gale).
- **Flimmer målt:** near 0,3 m og near 3 m gav samme billede over horisonten (0 pixel forskel). Kun det tætte ved fødderne skiftede.
- **Billeder i sekundet** (testbrowseren, fuld grafik, én ad gangen): pc hele Mars 2,85-3,18 og stående 1,29-1,35 (ca. 45 %), tablet på højkant 3,98 og 2,22 (56 %). Det svarer til de tungeste stop, vi har (Jezero 58 % i M5b).
- **Himlen:** gulbrun om dagen, blålig omkring Solen, en blå glød i vest efter solnedgang og stjerner om natten. Solen er 0,35°, Phobos ca. 0,2° og står op i vest, Deimos står op i øst (testet). Månernes plads i dag er ikke slået op.
- **Faktatjek** (hjælpeagent, kilderne læst): `docs/fakta-solsystemet.md` under "Faktatjek M8a". Rettet: Naukluft er et plateau på Mount Sharps nederste skråninger (sandsten af gamle klitter), CTX ca. 6 m pr. pixel, hvem der lavede højdekortet (Parker og Calef, JPL, udgivet af USGS), "mindre end nogle få meter".
- **Ikke med endnu:** Jezero (M8b), rovernes fotos og Curiosity som 3D-model (M8c), navne på det, man ser.

## Plan for resten af Mars (31. oktober 2026, skrevet ind efter jeres go)
*Lavet af Opus ud fra CLAUDE.md, "Lige nu" i DESIGN.md, denne fil, `docs/erfaringer.md`, `docs/plan-fable.md`, `docs/plan-ux.md` og `docs/plan-saturn-kvalitet.md`. Hvert trin får stadig sit eget go. De åbne spørgsmål står til sidst.*

**Udgangspunktet:** M1-M6, M7a og M8a er færdige, og det samme er U1 og U2. U3 kører i en anden session (`ccr-1dbfe8b3-phtbvs`, indtil videre kun `docs/plan-ux.md`). M5b, M7a, M8a, U1 og U2 er ikke set på den rigtige tablet. Stå på Mars kører med ca. 45 % (pc) og 56 % (tablet) af hastigheden ved hele Mars i testbrowseren. På et rigtigt grafikkort er det ikke målt.

### 1. M7b: kun Nordpolen tæt på og én lille rest (jeres valg 31. oktober 2026: B)
Da M7b blev planlagt, fandtes Stå på Mars ikke. Det meste af det, M7b skulle give, har M8a nu givet bedre:
- **Skarpere farver fra CTX med Solen sat som på fotoet:** CTX er i gråtoner, så farven kommer stadig fra Viking. Hvis Solen skal stå som på fotoet, er hvert stop låst til ét klokkeslæt. Meget arbejde for lidt.
- **HRSC' egne højder (ca. 50 m):** Fra den højde, flybyen ser stederne fra, ligner de næsten de 0,17 km, vi har.
- **Nordpolen tæt på: kommer med som sit eget skridt, M7b-pol** (jeres valg B). Det er den eneste del, der giver noget helt nyt at se. Se nedenfor.
- **En flyvning helt ned uden overgang:** Det kræver kort ned til 1 m på kloden. Overgangen i 1,2 km højde virker.
- **M7b-pol, Nordpolen tæt på (mellem til stor):** Et net i bredde og længde virker ikke ved polen (alle længdegrader mødes), så der skal et nyt net til: et lokalt net i polarstereografisk projektion over kappen (ca. 1.000 km bred), der glider over i kuglen ved kanten som de andre lokale net (`lokalt()` i `klippeplanet.js`), og et hul i kuglen omkring polen. Så kan man flyve ned over spiralkløfterne og Chasma Boreale i midnatssolen.
  - **Data, ikke tjekket endnu:** MOLA har polarstereografiske højdekort, der er skarpere end det globale kort. Hvor skarpe og hvor langt ned mod ækvator de går, tjekkes med curl, før noget loves. Farverne: Viking (ca. 1 km) eller noget skarpere med en fri licens, hvis det findes.
  - **Højdetabellen** (`overflade`, `bund`) skal også kunne bruge det nye net, så kameraet holdes over isen.
  - **Faktatjek:** kappens tal (tykkelse, bredde), spiralkløfterne og Chasma Boreale.
- **Resten, der kommer med i M8b:** Mellemlaget fra Stå på Mars (16 m over ca. 32 km) bruges som detaljekort (`detalje` i `LOKALE`) ved Gale- og Jezero-stoppene, når Jezeros mellemlag findes. **Ikke tjekket:** Mellemlaget regnes i meter fra kraterets nulpunkt og `detalje` i bredde og længde. Om det kan bruges direkte, eller om billedværktøjet skal lave et kort mere, tjekkes, før det loves.

### 2. Rækkefølgen
| Nr. | Del | Hvorfor her |
|---|---|---|
| 1 | **L1: lyset i Stå på Mars, den billige del** | Mest synligt for prisen, og M8b bruger den samme shader, så det justeres kun én gang. Rører `landskab.js` og måske `scene3d.js`, ikke U3's filer, så den kan laves nu. |
| 2 | ✅ **Saturn S2** (lavet 31. oktober 2026, ringene fra Cassinis målinger, `plan-saturn-kvalitet.md`) | Udfylder ventetiden på U3: Data og shader rører ikke U3's filer (kun nørd-teksten i `saturn.js` kan give en lille konflikt). Shaderen læser allerede τ fra et billede på én linje (`ringTekstur`), så kun kilden og antallet af punkter skiftes. `pds-rings.seti.org` svarer (curl 31. oktober 2026, også `CORSS_8001` og `COUVIS_8001`). |
| 3 | ✅ **M8b: Jezero** (lavet 31. oktober 2026, se "Status efter M8b") (J2 Randens inderside og J1 Landingsstedet) + resten af M7b | Teknikken findes, så det er mest data og tekster. **Venter, til U3 er merget:** U3 flytter stedernes tekster i `mars.js`, og M8b skriver nye tekster dér. |
| 4 | **M8c del 1: rovernes panoramaer** ("📷 Rovernes foto" ved Naukluft og landingsstedet) | Den bedste "Ærligt talt": man skifter mellem det tegnede og det fotograferede fra samme sted. |
| 5 | **M8c del 2: Curiosity som 3D-model** ved "Hos Curiosity nu" | Modellen er 11,9 MB (over grænsen på ca. 10 MB i afsnit 7 under "Plan for M8"). Hvad den koster på tabletten, ved vi ikke endnu. |
| 6 | **M7b-pol: Nordpolen tæt på** | Et nyt polarnet over kappen (se afsnit 1). Nyt arbejde i `klippeplanet.js` og `lav_steder.py`, så det kommer efter M8, hvor resten af Mars er på plads. |
| 7 | **U4** (tidsknappen og kontakterne i resten af AtomLab) | Når U3 er merget. Rører ikke Mars-filerne. |
| 8 | **L2: lyset, den dyre del** | Kun det, der holder, når det er målt. Kræver en lokal session på jeres pc (Windows, så Remote Control fra skyen virker ikke). |
| 9 | **Solsystemets overblik** (trin 2 i `plan-solsystemet.md`) | Stort og svært (et flydende nulpunkt), så det får sin egen plan først. |
| 10 | **Saturn S3** og Saturn i 8k | Venter. Kun Enceladus har et højdekort over hele månen, og det er groft. Til Saturn findes intet frit kort over 4k, og en gasplanet vinder næsten intet ved 8k. |

### 3. Lyset og kvaliteten
**L1, det, der ikke koster hastighed** (konstanter og et par uniforms):
- `sollys()` (2,4) og `himmellys()` (0,55) sænkes, så skyggerne bliver mørkere og relieffet står frem. Prøv fx 1,6-1,8.
- Himlen mørkere og mere mættet opad, så himmel og jord ikke er lige lyse.
- Lidt mindre dis. `TAU` 0,4 er rigtig for årstiden. Ændres den, skal "Ærligt talt" sige det.
- Starttiden sænkes fra 8,5 (37°) til en lav sol (15-25°, fx 07:30), så skyggerne bliver lange.
- Eksponering og glød kun, mens man står: Tonemappingen beholdes (ACES), og kun `toneMappingExposure` ændres. Et skift af tonemapping får Three.js til at oversætte shaderne igen, og det giver et hak. Måske kan gløden slås helt fra, mens man står. Det sparer også tid. **Tjekkes først:** Kommer Solens skær på himlen fra gløden? Så skal det laves i himlens shader i stedet.
- **Facit:** NASA's panorama PIA20332 fra Naukluft (taget dér, hvor man står) hentes og bruges som sammenligning. Kun som billede, det kommer ikke med i programmet før M8c. Husk, at fotoet er hvidbalanceret (mindre rødt end i virkeligheden).
- **Hvor:** i skyen (jeres pc er Windows, og en cloud-session kan kun bruge en Mac eller Linux med Remote Control). Farverne er de samme som på en rigtig skærm, men et billede tager minutter, så tag få og små billeder. I bedømmer det selv på pc og tablet til sidst.

**L2, det, der skal måles først:**

| Forbedring | Pris | Vurdering |
|---|---|---|
| Ambient occlusion (mørkere i sprækker og lavninger), regnet én gang pr. lag som skyggekortene | ét opslag i et kort mere pr. pixel | Den bedste af de dyre. Prøves først. |
| Blødere skygger | Kanten er allerede blød (`landskab.js`, ved `regnSkygge`) | Se L1's billeder først. Måske er det ikke nødvendigt. |
| Farvefoto fra HiRISE | dækker kun smalle striber, klitterne bliver blågrå | Frarådes: Farverne er ikke ægte. |
| Flere sten og riller helt tæt på | pr. pixel helt tæt på | Først hvis I synes, at stenene ser kunstige ud (punkt 6 under "Ikke afprøvet" for M8a). |

### 4. Model, effort, afhængigheder og faktatjek
Fable venter på Fable 5.5 (`plan-fable.md`). Ingen af delene kræver xhigh. Hjælpeagenter: Haiku med lav effort til testlogs og Sonnet med lav effort til at finde ting i koden.

| Del | Model og effort | Omfang | Afhængigheder | Faktatjek |
|---|---|---|---|---|
| L1 | Opus, medium | lille | ingen (i skyen) | kun hvis "Ærligt talt" om disen ændres |
| M8b | Opus, høj | mellem | `planetarymaps.usgs.gov` (tjekkes med curl), U3 merget | Perseverances plads og tal (med dato), deltaet, Cheyava Falls |
| M8c del 1 | Opus, høj | mellem | `assets.science.nasa.gov` (åben 31. oktober 2026) | fotoenes dato, kamera og hvidbalance |
| M8c del 2 | Opus, høj | mellem | jeres ja til at gøre modellen mindre (`gltf-transform`, et værktøj, der køres én gang, ikke et byggetrin), `GLTFLoader` fra `three@0.186.1`, måling på tabletten | rovernes retning og plads i oktober 2026 |
| M7b-pol | Opus, høj | mellem til stor | MOLA's polarkort (domænet tjekkes med curl), M8 færdig | kappens tal, spiralkløfterne, Chasma Boreale |
| L2 | Opus, høj | mellem | en lokal session på jeres pc (Claude Code installeret, Node.js og Playwright) | – |
| U4 | Opus, medium | lille-mellem | U3 merget | – |
| S2 | Opus, høj | mellem | `pds-rings.seti.org` | ringenes tal og kilde i nørd-teksten |

### 5. Arbejdsgangen (jeres svar 31. oktober 2026)
- **"Du skal bare lave alt det, du kan fra listen, i din rækkefølge. Go mellem hvert skridt."** Rækkefølgen i afsnit 2 gælder. Af M7b kommer kun Nordpolen tæt på (M7b-pol) og resten i M8b med (jeres valg B, 31. oktober 2026).
- **I laver jeres vurdering til sidst**, ikke efter hvert skridt. Hvert skridt skriver derfor sin egen liste "Ikke afprøvet" (hvad I skal kigge efter på pc og tablet), og listerne samles til jeres runde til sidst. Det betyder, at lyset i L1 justeres efter Opus' billeder og NASA's foto, ikke efter jeres øjne. Det kan kræve en rettelse efter jeres runde.
- **Nye sessioner, hvor det giver mening**, for at spare tokens, men ikke på bekostning af kvaliteten. Hvert skridt slutter med at skrive prompten til det næste skridt ind under "Prompter til de næste skridt" nedenfor. I starter den nye session med prompten og siger go.
- **Sessionerne:** L1, S2, M8b, M8c (begge dele i én session, med go imellem), M7b-pol, U4, L2 (lokal på jeres pc) og planen for trin 2 får hver sin session.
- **DESIGN.md og `docs/plan-ux.md` røres ikke, før U3 er merget.** (U3 blev merget 31. oktober 2026.) Indtil da skrives status her i filen. Den første session efter U3 skriver status ind i "Lige nu" i DESIGN.md.

### Åbne spørgsmål
1. Må Curiositys model gøres mindre med `gltf-transform` (en npm-pakke, der kun køres én gang som værktøj)? Spørges ved M8c del 2.
2. L2: Vil I installere Claude Code på pc'en (`irm https://claude.ai/install.ps1 | iex` i PowerShell) eller bruge Claude Code i Claude-appen? Spørges, når vi når dertil.

### Prompter til de næste skridt
**L1 (skrevet 31. oktober 2026, brugt: se "Status efter L1" nedenfor):**
> Lav L1: lyset i Stå på Mars, den billige del. Læs CLAUDE.md, `docs/erfaringer.md` og i `docs/plan-mars.md` afsnittene "Plan for resten af Mars" (især 3 og 5) og "Stå på Mars: lyset og kvaliteten". Tjek først, om U3 (`ccr-1dbfe8b3-phtbvs`) er merget. Er den ikke, så rør ikke DESIGN.md og `docs/plan-ux.md`.
>
> **Mål:** mere kontrast og relief, når man står på Mars. I dag er himmel og jord næsten lige lyse, og disen er kraftig. Ingen ændring må koste hastighed: kun konstanter og uniforms i `js/solsystem/landskab.js` (`sollys`, `himmellys`, himlen, disen) og starttiden i `LANDSKAB` i `js/kosmos/mars.js`. Eksponering og glød ændres kun, mens man står, og sættes tilbage, når man letter. Behold ACES, for et skift af tonemapping oversætter shaderne igen. Tjek, om Solens skær på himlen kommer fra gløden, før gløden dæmpes eller slås fra.
>
> **Facit:** Hent NASA's panorama PIA20332 fra Naukluft (`science.nasa.gov`/`assets.science.nasa.gov`, begge åbne), og sammenlign med det. Fotoet er hvidbalanceret (mindre rødt end i virkeligheden). Hold Mars rødlig, og tag ikke fotoets farver blindt. Fysikken skal stadig holde (`TAU` 0,4 passer med årstiden). Ændres disen eller lyset, så "Ærligt talt" ikke længere passer, så ret teksten og faktatjek den.
>
> **Billeder:** Skyen har intet grafikkort (ca. 1,3 billede i sekundet). Brug `tests/vaerktoejer/landskab-lille.mjs` med få billeder (fx kl. 7:30, 12 og 17 mod Mount Sharp, før og efter). Start den i baggrunden, og vent med en overvågning (se erfaringer.md under "Lyset i Stå på Mars"). Mål billeder i sekundet i testbrowseren før og efter, så intet er blevet langsommere.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv status under "Status efter L1" her i filen med listen "Ikke afprøvet" til jeres runde til sidst. Skriv så prompten til S2 under "Prompter til de næste skridt" (Saturns ringe fra Cassinis målinger, se `docs/plan-saturn-kvalitet.md` under S2 og afsnit 2 her). Model: Opus. Effort: medium (I sætter den selv).

**S2 (skrevet 31. oktober 2026 efter L1, brugt: se "Status efter S2" i `docs/plan-saturn-kvalitet.md`):**
> Lav S2: Saturns ringe fra Cassinis målinger. Læs CLAUDE.md, `docs/erfaringer.md`, `docs/plan-saturn-kvalitet.md` under "S2" og i `docs/plan-mars.md` "Plan for resten af Mars" (afsnit 2 og 5). U3 er merget, så status skrives i "Lige nu" i DESIGN.md.
>
> **Først:** Tjek med `curl`, at `pds-rings.seti.org` kan åbnes (også `CORSS_8001` og `COUVIS_8001`). Er den blokeret, så stop og bed om adgang. Find en stjerneokkultation (UVIS eller VIMS) eller radiookkultationen (RSS), der dækker hele ringsystemet fra ca. 66.900 til 141.000 km, og sig kort, hvilken du vælger og hvorfor, før du bygger.
>
> **Mål:** τ langs radius som en tekstur (fx 8.192 punkter, ca. 9 km pr. punkt) i stedet for de ringe, `ringTekstur` i `js/solsystem/ringe.js` laver i dag. Shaderen læser allerede τ fra et billede på én linje, så kun kilden og antallet af punkter skiftes. Grænserne i `js/data/ringe.js` og tjekkene i `tests/saturn.mjs` skal stadig passe (Cassini-delingen ca. 4.600 km bred, Encke-mellemrummet tomt). Lav dataen med et lille værktøj i `billeder/solsystem/` (Python er fint), og skriv kilden og licensen i `billeder/solsystem/KILDER.md`.
>
> **Tekster:** Ret nørd-teksten om ringene, så den siger, hvor tallene kommer fra, og faktatjek med `/faktatjek`.
>
> **Billeder:** Skyen har intet grafikkort. Tag få billeder med `node tests/vaerktoejer/saturn.mjs` i baggrunden, og vent med en overvågning. Tjek ringene tæt på ("Hen over ringene" på flybyen), i modlys og langt væk.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv "Ikke afprøvet" i "Lige nu" i DESIGN.md, og skriv prompten til M8b under "Prompter til de næste skridt" her i filen (Jezero, se afsnit 2 og 4 her og "Plan for M8"). Model: Opus. Effort: høj (I sætter den selv).

**M8b (skrevet 31. oktober 2026 efter S2, brugt: se "Status efter M8b" nedenfor):**
> Lav M8b: Stå på Mars ved Jezero. Læs CLAUDE.md, "Lige nu" i DESIGN.md, `docs/erfaringer.md` og i `docs/plan-mars.md` afsnittene "Plan for resten af Mars" (afsnit 1-5), "Plan for M8" (stederne J1 og J2, dataene, overgangen) og "Status efter M8a" og "Status efter L1". U3 og S2 er merget.
>
> **Først:** Tjek med `curl`, at `planetarymaps.usgs.gov` og `asc-pds-services.s3.us-west-2.amazonaws.com` kan åbnes, og at rasterio kan læse et lille vindue fra Mars 2020's landingskort (`mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_DTM_…_1m_….tif` og ortofotoet med 25 cm) og CTX-kortene ved Jezero (5 m foto, 20 m højder). Er noget blokeret, så stop og bed om adgang. Tjek også, om mellemlaget (16 m over ca. 32 km, i meter fra kraterets nulpunkt) kan bruges som `detalje` i `LOKALE` ved Gale- og Jezero-stoppene (bredde og længde), før det loves (resten af M7b, afsnit 1).
>
> **Mål:** de to steder ved Jezero fra "Plan for M8": J2 Randens inderside (18,4695° N, 77,2931° Ø, udsigten over deltaet) og J1 Landingsstedet (18,4446° N, 77,4509° Ø, deltaets front mod vest), med samme teknik som Gale (`lav_landskab.py`, `js/solsystem/landskab.js`, `LANDSKAB` i `js/kosmos/mars.js`, "🧍 Stå på Mars" ved Jezero-stoppet og stederne i træet under Jezero). Brug L1's lys uændret. Lav tal og tekster til stedernes sider (U3: `js/data/sider/mars.js`, 2-4 tal) og faktatjek med `/faktatjek` (Perseverances plads og tal med dato, deltaet, Cheyava Falls). Mål billeder i sekundet som i M8a (pc og tablet på højkant, én ad gangen).
>
> **Billeder:** Skyen har intet grafikkort. Tag få, små billeder i baggrunden (`tests/vaerktoejer/landskab-lille.mjs`), og sammenlign med NASA's panoramaer fra landingsstedet (PIA24422, PIA24264) som facit.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv "Ikke afprøvet" i "Lige nu" i DESIGN.md, og skriv prompten til M8c del 1 (rovernes panoramaer) under "Prompter til de næste skridt" her i filen. Model: Opus. Effort: høj (I sætter den selv).

**M8c del 1 (skrevet 31. oktober 2026 efter M8b):**
> Lav M8c del 1: rovernes panoramaer. Læs CLAUDE.md, "Lige nu" i DESIGN.md, `docs/erfaringer.md` og i `docs/plan-mars.md` afsnittene "Plan for resten af Mars" (afsnit 2, 4 og 5), "Plan for M8" (afsnit 6 "Panoramaerne" og 9) og "Status efter M8b". M8b er merget.
>
> **Først:** Tjek med `curl`, at `assets.science.nasa.gov` og `science.nasa.gov` kan åbnes, og hent PIA20332 (Naukluft, Mastcam) og PIA24264 (landingsstedet ved Jezero, Mastcam-Z) i fuld størrelse (og PIA24422, Navcam, hvis PIA24264 ikke dækker 360°). Er noget blokeret, så stop og bed om adgang. Tjek panoramaernes vinkler (hvor meget over og under vandret, og hvilken retning midten vender), før noget bygges.
>
> **Mål:** knappen "📷 Rovernes foto" i bjælken, mens man står ved Naukluft og ved landingsstedet ved Jezero. Fotoet lægges på en cylinder om kameraet, så man drejer og zoomer som i landskabet, og det drejes, så horisonten (Mount Sharp, deltaets front) står samme sted som i 3D (mål det ved at sammenligne horisonten). Over og under fotoet toner himmel og jord ud. Et tryk igen går tilbage til det tegnede. Fotoet hentes, når man trykker (ca. 8192 pixel bredt på pc og 4096 på tablet, `LAV_KVALITET`, tests små). Fotoerne er hvidbalancerede: sig det i teksten. Kilden og licensen i `billeder/solsystem/KILDER.md`, `LICENSE` og (når U4 er merget) "Om AtomLab" i index.html.
>
> **Tekster:** en kort tekst om, hvem der tog fotoet, hvornår og med hvilket kamera, og "Ærligt talt" om forskellen mellem det tegnede og fotoet. Faktatjek med `/faktatjek` (fotoenes dato, sol, kamera og hvidbalance).
>
> **Billeder:** Skyen har intet grafikkort. Tag få, små billeder i baggrunden (`tests/vaerktoejer/landskab-lille.mjs`), og sammenlign det tegnede og fotoet fra samme retning.
>
> **Til sidst:** `/faerdig` (tests med `--ændret`, PR og merge). Skriv "Ikke afprøvet" i "Lige nu" i DESIGN.md, og skriv prompten til M8c del 2 (Curiosity som 3D-model, spørg først om `gltf-transform`, åbent spørgsmål 1) under "Prompter til de næste skridt" her i filen. Model: Opus. Effort: høj (I sætter den selv).

## Status efter M8b (31. oktober 2026): Stå på Mars ved Jezero
- **Lavet:** To steder ved Jezero (`LANDSKAB.jezero` i `js/kosmos/mars.js`): "Ved randen" (Perseverances stop på sol 1301, 17. oktober 2024, 18,4695° N, 77,2930° Ø, −2.056 m, kigger mod øst-sydøst (95°) ud over deltaet og krateret, lander kl. 16:30 med Solen i ryggen) og "Landingsstedet" (Octavia E. Butler Landing, 18,4446° N, 77,4509° Ø, −2.570 m, kigger mod vest mod deltaets front, lander kl. 7:30). Knappen "🧍 Stå på Mars" ved Jezero-stoppet går til randen. Stederne står i træet under Jezero. Siderne `stå-randen` og `stå-landing` i `js/data/sider/mars.js` med 3 tal hver.
- **Data:** Mars 2020's landingskort (HiRISE 1 m og 25 cm, USGS) tæt på og i mellemlaget, hvor det dækker (ca. 7 %), ellers CTX-højdekortet over hele krateret (20 m) og helt ude HRSC+MOLA. Kortene ligger i striber på én række, så de blev hentet hele først (9,2 GB, `orig=` i `lav_landskab.py`). Lagene fylder 84 MB (testudgaver 3,7 MB). Mellemlagets højdekort er 18,8 MB (Gale 10,7 MB). Det kunne gøres ca. 40 % mindre med en grovere højde, men på den flade kraterbund kunne det give striber i lyset, så det er ikke gjort.
- **Resten af M7b:** Mellemlaget bruges nu som detaljekort på kloden ved Gale- og Jezero-stoppet (`detalje` i `LOKALE`, 64 × 64 km, ca. 32 m pr. pixel i 2k, overgang på 6 km). Det kunne bruges direkte, fordi meterne fra kraterets nulpunkt er en lige skalering af bredde og længde: Kun højderne skulle kodes om (`gem_detalje` i `lav_landskab.py`, ved Gale `python3 lav_landskab.py landskab gale detalje`, så Gales lag ikke laves om). Det hentes også, mens kameraet flyver ned til Stå på Mars.
- **Billeder (testbrowseren, fuld grafik):** Fra randen kl. 16:30 ses skråningen, kraterbunden og landet bag den lave østrand i disen. Kl. 7:30 kigger man lige mod Solen, og relieffet forsvinder, derfor eftermiddagen. Fra landingsstedet kl. 7:30 ses deltaets front med bakkerne foran, som i udsigten i planen. Billeder i sekundet: 0,39 begge steder (Naukluft i L1: 0,37-0,49), så ikke langsommere.
- **Faktatjek:** `docs/fakta-solsystemet.md` under "Faktatjek M8b". Rettet: randen (et nedslag, "måske også ældre nedslag", ikke "en asteroide"), hvordan roveren fandt et sikkert sted (farerne stod på et kort, tegnet på forhånd), CTX-højdekortet (lavet bagefter af holdet, ikke til landingen), afstanden til deltaets front (2-3 km) og at Octavia E. Butler Landing er holdets kaldenavn.
- **Kendt fejl i kilden: sømme i CTX-højdekortet.** JPL's mosaik over hele krateret er sat sammen af striber, og to steder mødes de med ca. 20-25 m forskel, blandet ud over ca. 500 m og med et lille trin (ca. 4 m) til sidst. Det ses som tynde, lige streger nord-syd hen over kraterbunden ved Jezero-stoppet (ca. 77,8° Ø) og vest for randen (ca. 77,05° Ø). Fire forsøg på at fjerne dem i `lav_landskab.py` blev droppet: Et medianfilter mod HRSC fjernede dem ikke, et filter langs sømmen gav nye striber over det hele, og en rettelse, der kun tager lange, lige spring, var ren, men for svag (op til 6,5 m). Højdekortet er derfor uændret, og "Billederne" siger det. Idé til senere: lav selv mosaikken af USGS' CTX-striber (`mars2020_trn/CTX/DTM_…_Jezero_F05X/J03X/J21_J22X`, de overlapper med 20-30 km, så de kan blandes blødt) og brug JPL's kun øst for 77,9° Ø.
- **Ikke lavet:** Hjælpen og "Om AtomLab" i index.html nævner kun Gale. index.html blev ikke rørt, mens U4 blev bygget (jeres besked). U4 er nu merget, så de to sætninger kan rettes i næste session.

## Status efter L1 (31. oktober 2026): lyset i Stå på Mars, den billige del
**Facit:** NASA's panorama PIA20332 (hentet fra `assets.science.nasa.gov`, 29.163 × 6.702 pixel, kun brugt som sammenligning, ikke i programmet). Målt i fotoet (sRGB 0-255): himlen ved horisonten ca. 230, jorden ca. 100, de mørkeste 5 % af jorden 15-30. Fotoet er hvidbalanceret (himlen er blågrå), så farverne er ikke taget derfra, kun forholdet mellem lys og mørkt.

**Rodårsagerne (målt i billederne før):**
1. **Himlen blev ikke lysere, når Solen steg over 30°, men det gjorde jorden.** Kl. 12 var jorden lysere end himlen øverst i billedet (153 mod 147), og på fotoet er horisonten det lyseste.
2. **For meget himmellys i skyggerne.** Ved lav sol kom omtrent halvdelen af lyset på jorden fra himlen, så skyggerne kun var ca. 3 gange mørkere end det belyste. Derfor var relieffet væk.
3. **Gløden** gav Solens store skær. Det stod ikke i himlens shader (kun en strålekrans på ca. 1°).

**Ændret (kun konstanter, ét led i himlens shader og eksponeringen, intet koster mere pr. pixel):**
- `SOLLYS` 2,4 → 2,2 og `HIMMELLYS` 0,55 → 0,18 (`js/solsystem/landskab.js`).
- Himlen: Lysstyrken følger Solen helt op til zenit (`HIMMEL_STYRKE` 1,5), og den er mørkere og mere mættet opad. `TAU` er uændret (0,4), så disen er fysisk den samme, og "Ærligt talt" ("en enkel model") passer stadig. Ingen ny tekst, så intet faktatjek.
- **Mens man står:** Gløden er slået fra (det sparer et trin i efterbehandlingen), og Solens skær står i himlens shader. Eksponeringen tilpasser sig delvis lyset på jorden (`eksponering(solY)`, 0,85 ved Solen 22°, mellem 0,55 og 1,5), som et kamera eller øjet. Tonemappingen er stadig ACES. Begge dele sættes tilbage, når man letter eller skifter skærm (`forladLandskab`, tjekket i testen `landskab`).
- Starttiden: kl. 07:30 (Solen 22°) begge steder, før 08:30 og 09:00.
- `tests/vaerktoejer/landskab-lille.mjs` venter nu, til landingen er færdig. Før blev blikket i det første billede overskrevet af landingen.

**Målt efter (samme billeder, mod Mount Sharp):** Himlen ved horisonten er lysere end jorden på alle tidspunkter, også kl. 12 (set i billederne, for målefeltet ramte også Mount Sharp), og jorden kl. 17 går fra 42 til 134 (de mørkeste og lyseste 5 %, før 56 til 128). Solnedgangen kl. 17:30: en lille skarp skive med et blåligt skær omkring, og efter solnedgang den blå glød. Billeder i sekundet i testbrowseren uden grafikkort: 0,37 før og 0,38-0,49 efter (ikke langsommere).

**Ikke afprøvet (til jeres runde til sidst, på pc og tablet):**
1. Er det for mørkt nu? Lyset er justeret efter tal og NASA's foto, ikke efter jeres øjne. Er det for mørkt eller for kontrastrigt, rettes `EKSPONERING`, `SOLLYS` eller `HIMMELLYS` (ét tal hver).
2. Kør dagen med ▶: Føles det naturligt, at billedet bliver lidt mørkere ved middag og lysere ved morgen og aften (eksponeringen tilpasser sig)? Pumper det mærkbart?
3. Solen uden glød: Er den for lille eller for svag på tabletten? Skæret omkring den står nu i himlens shader.
4. Forgrunden er stadig ret flad tæt på. Det skyldes mest højdekortet (reelt 2-3 m), ikke lyset. Det er L2 (ambient occlusion).
5. Kører det mindst lige så glat som før på tabletten (gløden er slået fra, mens man står)?

## Stå på Mars: lyset og kvaliteten (31. oktober 2026, fund og muligheder, intet er ændret endnu)
**Anledning:** Jeres iagttagelse: "Det ser ret lyst ud, når man står der." Der er kun læst kode og taget prøvebilleder. Intet er justeret, og der er ikke målt på rigtigt grafikkort.

**Prøvebilleder** (`node tests/vaerktoejer/landskab-lille.mjs naukluft 135,8,8.5 135,8,12 135,8,16.5 0,8,12`, fuld grafik uden grafikkort, 900 × 560, kamera mod Mount Sharp, billederne ligger i `tests/billeder/landskab/` og er ikke med i repoet):

| Klokken | Solens højde | Hvad billedet viser |
|---|---|---|
| 08:30 (**startværdien**, `tid: 8.5`) | 37° | Pæne skygger af klitterne, men himlen og jorden har næsten samme lysstyrke og farve. |
| 12:00 | 82,7° | Næsten ingen skygger (Solen næsten i zenit), fladt og lyst. Det værste billede. |
| 16:30 | 22° | Lidt mere relief end kl. 12, men stadig lys himmel og kraftig dis. |

**Kørslen:** Ingen fejl. Træk med musen mod højre drejer kompasset fra 0° til 333° (rigtig retning). Billeder i sekundet: 0,39 uden grafikkort (værdiløst, se nedenfor om pc).

**Fund (det, billederne og koden peger på, i den rækkefølge jeg tror på dem):**
1. **Himmel og jord er lige lyse.** Himlen (`himmel()`) er en gulbrun flade, og jorden er gulbrun i næsten samme lysstyrke. Dermed mangler den kontrast, der får landskabet til at stå frem. Det er det, der får det til at se "lyst" ud, mere end selve jorden.
2. **Disen er kraftig.** Det fjerne landskab (Mount Sharp) blandes ind i horisontens farve (`ud * T + himmel * (1 - T)`), og himlens horisont er det lyseste sted. `TAU` er 0,4 (klar tid, rigtigt for april 2016), så det er kun delvis en fejl: Rigtige fotos har også dis, men fotoene fra roverne virker mørkere, fordi de er hvidbalanceret og eksponeret efter jorden.
3. **Solens lys er skaleret frit.** `sollys()` giver 2,4 og `himmellys()` ca. 0,55 × farve + himlens bidrag ovenfra (0,55 + 0,45 · n.y). Skyggerne bliver derfor aldrig rigtig mørke, og det sparer relieffet.
4. **Efterbehandlingen er fælles for hele programmet** (`scene3d.js`): ACES-tonemapping, eksponering 1,05 og glød (UnrealBloom, styrke 0,9, tærskel 0,82). Den er sat til rum og stjerner. Her løfter ACES mellemtonerne, og gløden lægger et skær over lyse flader. Ikke målt hver for sig endnu (se "Næste måling").
5. **Standardtiden** er 08:30 (37°). Det er ikke middag, så det er ikke dér, det går galt, men 37° er højt nok til, at skyggerne er korte. Lav sol (15-25°) giver mere relief.
6. **Fysik:** Rigtige Mars-fotos er faktisk ret lyse og flade ved høj sol, fordi himlen er tæt og støvet. "Realistisk" og "flot" er ikke det samme, og I har sagt, at kvaliteten og æstetikken er det vigtigste.

**Muligheder for at gøre det bedre** (ikke besluttet, ingen er gjort):
- **Billig, meget synlig:** Sænk `sollys` og `himmellys` (fx 1,6-1,8), gør himlen lidt mørkere og mere mættet over for horisonten, dæmp disen en smule, dæmp gløden og tonemappingen kun mens man står (ikke i resten af programmet), og start på en lavere sol (morgen 07:00-08:00 eller sen eftermiddag).
- **Mellem:** Blødere skygger fra skyggekortene, ambient occlusion i sprækker og lavninger, rigtigt farvefoto fra HiRISE/CTX i stedet for gråtone med rust-forløb (HiRISE-farve dækker kun smalle striber), flere slags sten, riller og sand tæt på, dis og støv i lag.
- **Dyrt eller stort:** Rovernes panoramafotos som reference ved siden af (M8c), Curiosity som 3D-model (M8c, `assets.science.nasa.gov` er åben siden 31. oktober 2026), skarpere højder end 1 m findes ikke.
- **Pas på prisen:** Stå på Mars kører allerede på ca. 45 % af hastigheden ved hele Mars på pc og 56 % på tablet (testbrowseren, se M8a). Alt, der koster pr. pixel (AO, bløde skygger, volumetrisk dis), skal måles på tabletten.
- **Et lysbord til tabletten** (`?lys` med skydere for sollys, himmellys, bloom og eksponering) blev foreslået, men **er ikke bestilt**. Jeres svar (31. oktober 2026): "Nej, du skal bare dokumentere dine findings."

**Næste måling (når I siger go):** Tag de samme billeder med gløden og tonemappingen slået fra og med lavere `sollys`/`himmellys`, så vi kan se, hvad hver del betyder. Kun billeder, ingen ændring i programmet.

**At teste på jeres egen pc (jeres svar 31. oktober 2026, noteret):** Skyen har ikke noget grafikkort, så hastighed, flimmer og "føles det rigtigt" kan ikke måles her (ca. 1,3 billede i sekundet, ét prøvebillede tager minutter). Farver og lys er de samme som på jeres skærm, for det er den samme shader. **Aftale:** Når en opgave kræver rigtig grafik (billeder i sekundet, finjustering af lys og farver, skærmbilleder i fuld opløsning, AO og bløde skygger), så bed jer om adgang til pc'en *før* arbejdet går i gang (`list_computer_folders` og `request_computer_folder`, kræver at I har sat Remote Control op: Claude-appen, Indstillinger, Claude Code, Remote Control, eller `claude remote-control` i mappen). I godkender selv forbindelsen. Tablet og telefon kan ikke styres derfra. Dem prøver I selv: kør `python -m http.server 8000` på pc'en og åbn `http://<pc'ens IP>:8000` på tabletten på samme wifi, så ses ændringerne uden at vente på en merge.

## Plan for M8: Stå på Mars (30. oktober 2026, go givet)
**Jeres svar (30. oktober 2026): "Generelt går vi med dine anbefalinger. Go."** Alle syv anbefalinger gælder: de fire steder (Naukluft og Curiosity nu ved Gale, randens inderside og landingsstedet ved Jezero), et eget landskab i ringe, skyder og "Lad dagen gå", Phobos og Deimos på himlen, rovernes fotos og 3D-modellen, tre dele (M8a, M8b, M8c) og domænet. I har åbnet `assets.science.nasa.gov` (virker: `Curiosity_static.glb` er 11,9 MB).
- **Størrelse og kvalitet (jeres ord):** "Størrelse i sig selv er ikke et problem. Så længe det kan køre godt, må det gerne fylde, medmindre du advarer imod det. Det vigtigste er kvaliteten. Jeg er æstetiker." Lagene må derfor gerne være større og skarpere end i forslaget, så længe tabletten kører godt (målt).
- Én PR pr. del, som Opus selv merger, når testene er grønne. M8b og M8c bygges efter hinanden uden nyt go, medmindre noget er uklart (go til hele M8).

*Lavet af Opus. Billederne til planen ligger i `docs/m8/`. Udsigterne er tegnet af et lille værktøj ud fra de rigtige højdekort (Mars' krumning, dis med afstanden og en lav morgensol fra øst). De viser kun formen på landskabet, ikke fotos, farver eller himlen, som programmet vil tegne dem. Rovernes pladser er fra NASA's egne kortdata (`mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` og `…/M20/…/M20_waypoints.json`, hentet i dag).*

**Kilderne er tjekket med curl i dag:**
- **Kan åbnes:** USGS' arkiv (`asc-pds-services…`, både `mosaic/Mars/MSL/` og `MSR_TRN_HiRISE…`), `planetarymaps.usgs.gov` (nyt fund: Mars 2020-landingens kort), søgesiderne på `astrogeology.usgs.gov/search/map/…`, `science.nasa.gov` (også Photojournal-siderne), `mars.nasa.gov` (rovernes kortdata), `hirise.lpl.arizona.edu`, `www.uahirise.org`, `static.uahirise.org` og `raw.githubusercontent.com`.
- **Blokeret af miljøet (403 fra proxyen):** `assets.science.nasa.gov` (NASA's billedfiler: panoramaerne i fuld størrelse og roverens 3D-model), `www.usgs.gov` (`astrogeology.usgs.gov/` sender videre dertil, men søgesiderne virker), `hirise-pds.lpl.arizona.edu` (HiRISE' egne højdekort, ikke nødvendige, for USGS har dem), `stac.astrogeology.usgs.gov` og `nasa3d.arc.nasa.gov`.
- **Siden afviser selv:** `upload.wikimedia.org` svarer 429 (for mange forespørgsler) på panoramaerne i dag. `github.com` giver 403 (sessionens egen adgang).
- **Kun `assets.science.nasa.gov` betyder noget for M8** (panoramaerne og roveren, spørgsmål 6 og 7). Resten af planen kan bygges uden.
- **Tjekket igen 31. oktober 2026: `assets.science.nasa.gov` er åben.** Curl giver 200, og `…/psd/mars/resources/gltf_files/24584_Curiosity_static.glb` er 11.860.016 byte (11,9 MB).

### 1. Hvor står man?
Udsigterne er i `docs/m8/gale-udsigt.jpg` og `docs/m8/jezero-udsigt.jpg` (hvert billede er 140° bredt og går fra 6° under til 12° over vandret).

| | Sted | Bredde, længde (højde over nulpunktet) | Hvad man ser |
|---|---|---|---|
| G1 | **Bradbury Landing**, Curiositys landingssted (august 2012) | 4,5895° S, 137,4417° Ø (−4.501 m) | Hele Mount Sharp mod syd og sydøst, lag på lag, og kraterranden i disen mod nord. Det klassiske billede, men forgrunden er flad. |
| G2 | **Naukluft** (sol 1301, 3.-4. april 2016), hvor panoramaet PIA20332 er taget | 4,6784° S, 137,3594° Ø (−4.429 m) | Mount Sharp tættere på, med de mørke klitter (Bagnold-klitterne) og lyse buttes foran. **Den flotteste udsigt** i billederne, og NASA's rigtige 360°-foto er taget præcis her. |
| G3 | **Curiosity nu** (sol 5045, ca. 15. oktober 2026, 38,16 km kørt) | 4,8247° S, 137,3876° Ø (−3.488 m, ca. 1 km over landingsstedet) | Roveren står i en sænkning mellem bakker på Mount Sharps skråning. **Toppen af Mount Sharp er skjult** af bakkerne tæt på. Mod nord er der et hul i bakkerne med udsigt ud over kraterbunden til randen. Ægte, men indelukket. |
| J1 | **Octavia E. Butler Landing**, Perseverances landingssted (februar 2021) | 18,4446° N, 77,4509° Ø (−2.570 m) | Flad kraterbund. Mod vest deltaets front (ca. 2 km væk) og randen bag den. Her er panoramaerne PIA24422 og PIA24264 taget. |
| J2 | **Randens inderside** (sol 1301, ca. 17. oktober 2024) | 18,4695° N, 77,2931° Ø (−2.056 m, ca. 500 m over kraterbunden) | **Udsigt ned over deltaet og hele krateret** til den anden side af randen i disen, 40-45 km væk. Fundet ved at regne udsynet ud fra alle roverens stop på randen (det bedste var sol 1293-1302). |
| J3 | Toppen af randen (sol 1358, ca. 15. december 2024) | 18,4589° N, 77,2673° Ø (−1.794 m) | Krateret er skjult af randens egne bakker. Fravalgt. |
| J4 | **Perseverance nu** (sol 2022, ca. 28. oktober 2026, 45,25 km kørt) | 18,4356° N, 77,2332° Ø (−1.936 m) | Uden for krateret mellem bakker. Krateret kan ikke ses. Ægte, men ikke en udsigt. |

**Anbefaling:** To steder ved hvert krater: ét med **udsigten** og ét, hvor **roveren er eller var**.
- **Gale:** G2 Naukluft (udsigten og NASA's foto fra samme sted) og G3 "Hos Curiosity nu" (roveren som 3D-model, hvis den kan hentes, spørgsmål 7). G1 er flottere end G3, men den er kun et sted, roveren har været.
- **Jezero:** J2 Randens inderside (udsigten) og J1 Landingsstedet (NASA's fotos fra samme sted og deltaets front). Perseverance nu (J4) nævnes i teksten med et lille kort, men man står der ikke: Udsigten er bakker.
- Mellem de to steder ved samme krater skifter man med en knap ("Gå til Curiosity nu", ca. 16 km væk, og "Gå til landingsstedet", ca. 17 km væk). Det er et hop med en kort overgang, ikke en gåtur.
- **Billigere udgave:** ét sted pr. krater (G2 og J2). Det sparer ca. 6 MB pr. sted og en del arbejde.

### 2. Data
**Kortene (alle læst eller åbnet i dag):**

| Kort | Fil og sted | Område | Skarphed | Bemærkninger |
|---|---|---|---|---|
| Gale, højder | `mosaic/Mars/MSL/MSL_Gale_DEM_Mosaic_1m_v3.tif` (3,9 GB, USGS) | ca. 33 × 57 km (137,13-137,68° Ø, 4,13-5,10° S): landingsstedet, ruten og Mount Sharps nederste skråninger | 1 m (reelt nærmere 2-3 m: små klitter i fotoet ses ikke i højderne, og nogle steder er der kasseformede fejl, `docs/m8/gale-data.jpg`) | Toppen af Mount Sharp er **ikke** med. Den tages fra HRSC+MOLA (0,17 km), som vi allerede har. |
| Gale, foto | `MSL_Gale_Orthophoto_Mosaic_25cm_v3.tif` (24 GB) | ca. 45 × 70 km | 25 cm, **gråt, med skygger malet ind** (taget ca. kl. 15) | Klitter og sten ses tydeligt. |
| Gale, foto i farver | `MSL_Gale_HiRISE-LRGB_78quads_sharp_cog.tif` (1 GB) | kun ca. 9 × 19 km (Bradbury, Naukluft og Curiosity nu er med) | 25 cm, farver fra HiRISE, gjort skarpere i GIMP | Farverne er HiRISE' (ikke helt ægte, blågrå klitter). Bruges højst som en blød farvetone. |
| Jezero, højder (nyt fund) | `planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_DTM_…_1m_….tif` (1,8 GB), Mars 2020's landingskort | ca. 21 × 21 km (77,22-77,58° Ø, 18,31-18,67° N): landingsstedet, deltaet og randens inderside (J1 og J2) | 1 m | Ukomprimeret GeoTIFF, så et vindue læses direkte. |
| Jezero, foto | `…/JEZ_hirise_soc_006_orthoMosaic_25cm_…_first.tif` | samme | 25 cm, gråt, skygger malet ind | |
| Jezero, randen og roveren nu | `MSR_TRN_HiRISE_soc_003…_mosaics.zip` (5,5 GB) | ca. 19 × 27 km vest for krateret (77,06-77,38° Ø) | 1 m og 25 cm | Kun nødvendig for J4 (og randens yderside). |
| Mellemlag | CTX-mosaikkerne `mosaic/Mars/CTX_EZs/Gale_CTX_BlockAdj_dd.tif` og `Jezero_…` (5 m, gråt) og Mars 2020's CTX-højdekort (20 m, `…/CTX/JEZ_ctx_B_soc_008_DTM_…_20m…tif`) | hele Gale (135,2-139,2° Ø) og 75,2-78,9° Ø ved Jezero | 5 m (foto), 20 m (højder ved Jezero) | Ved Gale findes intet CTX-højdekort hos USGS: Mellemlaget bruger 1 m-kortet (nedskaleret), og uden for det HRSC+MOLA. |

- **Kan rasterio læse et lille vindue direkte over nettet? Ja.** Et vindue på 3 × 3 km fra Gales 1 m-kort (3,9 GB) tog ca. 20 sekunder, og fotoene (i firkanter) går endnu hurtigere. **I zip-filerne til Jezero: også ja** (`/vsizip/{/vsicurl/…}`), men filerne i zip'en er pakket (deflate), så GDAL må pakke ud fra starten af filen: Et 8 m-overblik og to vinduer fra 1 m-kortet (676 MB i zip'en) tog ca. 2 minutter. Fotoet i zip'en er 4,6 GB og vil tage længere. Det gør ikke noget, for Mars 2020's landingskort på `planetarymaps.usgs.gov` dækker J1 og J2 og kan læses direkte.
- **Lagene (forslag):**

| Lag | Område | Højder | Foto | Fil (anslået) |
|---|---|---|---|---|
| Tæt på | 2 × 2 km om stedet | 1 m, 2048 × 2048 (16 bit i rød og grøn, trin på 5 cm) | 0,5 m, 4096 × 4096, gråt | ca. 2,4 MB + 3,5-4 MB (målt på Gale-dataene) |
| Mellem | ca. 32 × 32 km (begge steder ved samme krater) | 16 m, 2048 × 2048 | 8 m, 4096 × 4096 (CTX) | ca. 2-3 MB + 3,5 MB |
| Langt væk | 356 × 356 km | HRSC+MOLA, som vi har (`mars-gale-hoejde-2k.png`) | Viking, som vi har | 0 (hentet allerede ved stoppet) |

- **Filerne på GitHub Pages:** ca. 6 MB pr. sted og ca. 6 MB pr. krater til mellemlaget: ca. 18 MB pr. krater med to steder, ca. 36 MB i alt (testudgaver i halv størrelse ca. +9 MB). Billederne fylder 85 MB i dag. Ingen fil er over 5 MB.
- **Grafikkortet:** Højder tæt på ca. 11 MB, foto tæt på ca. 22 MB, mellemlaget ca. 33 MB (med mipmaps): ca. 65 MB pr. krater. Tabletten klarer Mars' 8k-kort (ca. 170 MB), så det bør gå. Kun lagene ved det sted, man står, ligger i grafikkortet. Går man tilbage i kredsløb, frigives de.
- **Skygger i fotoene:** Alle fotos fra kredsløb (HiRISE og CTX) har skygger malet ind (taget om eftermiddagen). Programmet regner selv lyset ud fra højderne. **Forslag:** Fotoet deles med programmets eget skyggebillede for fotoets sol (regnet fra højdekortet), så de store skygger forsvinder, og kun detaljerne under højdekortets skarphed (sten, ribber i sandet) bliver tilbage. Det tjekkes på billeder, før det bruges. Virker det ikke, bruges fotoet kun som små detaljer oven på programmets lys.
- **Farver:** Fotoene er grå. Farven tages fra Viking-kortet (ca. 1 km), som vi har, og en farvetone fra HiRISE' farvefoto ved Gale tæt på. "Ærligt talt" siger det.
- **Licenser (tjekket på USGS' sider i dag):**
  - Mars 2020's landingskort (HiRISE og CTX): "Access Constraints: None", "Use Constraints: Please cite authors", udgivet af USGS (amerikansk offentligt værk). Kreditering: "USGS Astrogeology (Mars 2020 Terrain Relative Navigation), HiRISE: NASA/JPL-Caltech/University of Arizona, CTX: NASA/JPL-Caltech/MSSS".
  - MSR-kortene (zip): som ovenfor, doi:10.5066/P13CPYYU (Bland m.fl. 2024).
  - Gale-kortene (Calef og Parker, JPL): intet licensfelt, bygget af HRSC, CTX og HiRISE (`fakta-solsystemet.md` del 3B afsnit 8). For en sikkerheds skyld mærkes de som CC BY-SA 3.0 IGO (som de andre filer med HRSC). Farvefotoet: Parker og Calef.
  - CTX-mosaikkerne: offentlige, "NASA/JPL/MSSS".
  - Alt kommer i `KILDER.md`, `LICENSE` og "Om AtomLab".

### 3. M8 før M7b: ned fra kredsløb
- **Landskabet bliver sin egen verden** (afsnit 4), med sine egne lag. Det har ikke brug for M7b's kort.
- **Overgangen (anbefales):** "🧍 Stå på Mars" ved Gale (eller Jezero). Rejsen flyver ned mod stedet til ca. 15 km over jorden med kloden og det lokale net, vi har (0,17 km). Så glider billedet over (ca. 0,8 sekunder) til landskabet set fra ca. 1,5 km over stedet, hvor alle tre lag er med, og kameraet "lander" i ca. 4 sekunder ned til 1,7 m, mens det drejer op mod horisonten. Tilbage: det samme baglæns. Med "reducer bevægelse" klippes der direkte.
- **Hvorfor ikke flyve hele vejen uden overgang:** Så skulle kloden have kort ned til 1 m, og det er netop M7b. Overgangen sker højt oppe, hvor det skarpe lag og kloden ser næsten ens ud (begge har HRSC+MOLA langt væk).
- **Med fra M7b undervejs:** billedværktøjet, der læser Gale- og Jezero-kortene i vinduer (`lav_landskab.py`), og mellemlaget (16 m over ca. 32 km). M7b kan senere bruge mellemlaget som detaljekort (`detalje` i `LOKALE`) ved Gale- og Jezero-stoppene. Det er ikke med i M8.
- **Venter til M7b:** skarpere kort i kredsløb ved stoppene, en flyvning helt ned uden overgang og Nordpolen tæt på.

### 4. Teknik
- **Et eget landskab, ikke endnu et lokalt net på kloden (anbefales).** Kloden regner i enheder på 1.000 km. Ved 1,7 m over jorden er tal med 32 bit i grafikkortet for unøjagtige (ca. 0,2 m ved Mars' radius), så jorden ville ryste, når man drejer. Landskabet får sin egen nulpunkt lige under kameraet og regner i meter. Mars-kloden skjules (men bliver i grafikkortet).
- **Et net i ringe om stedet (anbefales):** Kameraet står stille og drejer kun hovedet. Derfor er et net i ringe omkring stedet det billigste: tæt ved fødderne og grovere længere væk, så hvert stykke fylder lige meget på skærmen (fx 1024 retninger × 512 ringe fra 1 m til 180 km, ca. 0,5 mio. punkter, ligesom kloden i dag). Højderne læses i vertex-shaderen fra det skarpeste lag, der dækker punktet, og lagene glider over i hinanden ved kanten. Mars' krumning trækkes fra (1,7 m ved 3,4 km og ca. 130 m ved 40 km). Lyset regnes for hver pixel ud fra højdekortene.
- **Kameraet:** 1,7 m over jorden (en voksen. Rovernes kameraer sidder ca. 2 m oppe, så det siges i "Ærligt talt"). Horisonten på fladt land er ca. 3,4 km væk, men fra en skråning ses meget længere. Mount Sharps top er ca. 45-50 km fra G2 (den nærmeste fod 5-10 km).
- **Near, far og dybden:** Near ca. 0,3 m og far ca. 400 km. Med almindelig dybde er der ca. 30 m mellem dybderne 10 km væk og ca. 270 m 30 km væk. **Det måles som i M6b** (billedet med near 0,3 sammenlignes med near 3, hvor det tætte er skåret fra). Flimrer bjergkammene, tegnes landskabet i to omgange: alt over ca. 2 km væk først med sin egen near, så det tætte (nettet i ringe deles let). `logarithmicDepthBuffer` er sidste udvej (den koster på tabletten).
- **Dreje hovedet:** Kameraets styring drejer om et punkt få cm foran kameraet (ikke 50 m som ved Phobos, så ville man flytte sig 50 m). En finger eller musen drejer, piletasterne også. At kniber eller rulle zoomer med synsvinklen (som en kikkert, fx 20-75°), ikke ved at flytte kameraet. Man kan kigge lige ned på jorden og næsten lige op.

### 5. Himlen og lyset
- **Himlen (anbefales):** en shader på en kuppel med en enkel model af støvet: gulbrun (butterscotch) om dagen, mørkere opad, og blålig omkring Solen, når den står lavt (støvet sender blåt lys fremad). Efter solnedgang en blå glød over stedet, hvor Solen gik ned, og et langt tusmørke. Farverne tjekkes mod NASA's fotos (fx Curiositys blå solnedgang i Gale, PIA19400).
- **Dis (anbefales):** Det fjerne landskab blandes med himlens farve efter afstanden og højden (skalahøjden 11 km, som vi har). Det gør Mount Sharp og randen 40 km væk blege, som på rovernes fotos.
- **Solen:** i den rigtige størrelse (ca. 0,35°, ca. to tredjedele af det, vi ser fra Jorden) med en glød.
- **Tid på dagen (anbefales):** en skyder "Klokken på Mars" (lokal soltid) og knappen "▶ Lad dagen gå" (hurtigt, fx en dag på 2 minutter). Plus "Solnedgang" som genvej. Starttidspunktet er morgen (lange skygger, som ved de andre stop).
- **Skygger i landskabet:** Bjerge og bakker kaster skygger, når Solen står lavt. De regnes på grafikkortet i et kort over hvert lag, når Solen har flyttet sig lidt (ikke i hvert billede).
- **Phobos og Deimos (anbefales: ja):** Phobos ses fra både Gale og Jezero. Den er ca. 0,21° bred lige over hovedet (ca. 40 % af Månen set fra Jorden) og mindre ved horisonten, står op i vest og går ned i øst og krydser himlen på ca. 4 timer. Deimos er som en klar stjerne. De står, hvor de skal stå til klokken, med samme baner som i M6. Om natten stjernerne. Jorden som en klar "aftenstjerne" kan komme senere (kræver Jordens plads set fra Mars).
- **Årstiden:** som resten af Mars (nordlig forårsjævndøgn).

### 6. Panoramaerne
- **Kan bruges:** ja, licensen er fri (NASA/JPL-Caltech/MSSS og NASA/JPL-Caltech/ASU/MSSS). Filerne ligger på `assets.science.nasa.gov`. Den var blokeret, da planen blev skrevet, men er åben siden (tjekket 31. oktober 2026). Wikimedia svarede 429.
- **Anbefaling: en egen visning, "📷 Rovernes foto",** ved de steder, hvor fotoet er taget: G2 Naukluft (PIA20332, Mastcam i farver, april 2016) og J1 Landingsstedet (PIA24264, Mastcam-Z i farver, 142 billeder, eller PIA24422, Navcam). Fotoet lægges på en cylinder om kameraet, så man drejer på samme måde og ser i samme retning som i 3D (fotoet drejes, så Mount Sharp og randen står samme sted som i landskabet, målt ved at sammenligne horisonten). Over og under fotoet fyldes med himmel og jord, der toner ud. Det er den bedste "Ærligt talt": Man kan skifte mellem det tegnede og det fotograferede fra præcis samme sted.
- **Ærligt:** Fotoene er hvidbalancerede (som om de var taget på Jorden), så de er mindre røde end Mars i virkeligheden. Det står i teksten.
- **Størrelse:** ca. 8192 pixel bredt på pc (ca. 3-4 MB) og 4096 på tablet.

### 7. Roveren
- **Anbefaling: roveren som 3D-model ved G3 "Hos Curiosity nu"** med den rigtige retning og hældning fra NASA's kortdata (sol 5045: retning 161,5°, hældning 13,5° op ad bakken). Ved G2 og J1 står i stedet et lille skilt: "Her stod Curiosity i april 2016" og "Her landede Perseverance".
- **Modellen:** NASA's `Curiosity_static.glb` (fra science.nasa.gov/resource/curiosity-rover-3d-model) ligger på `assets.science.nasa.gov` (blokeret, da planen blev skrevet, åben 31. oktober 2026: 11,9 MB). NASA's 3D-modeller er frie (ingen ophavsret), men man må ikke antyde, at NASA anbefaler noget. Kræver `GLTFLoader` fra `three@0.186.1` (en addon-fil). Er filen over ca. 10 MB, spørger jeg, om den må gøres mindre med et værktøj (fx `gltf-transform`, ikke et byggetrin).
- **Spor:** Hjulsporene ses ikke i fotoene fra kredsløb ved roverens plads nu. Programmet kan tegne svage spor efter den rigtige rute (fra kortdataene) de sidste ca. 100 m. Det står i "Ærligt talt", at de er tegnet.

### 8. Hvordan kommer man derhen?
- Ved Gale- og Jezero-stoppet (både på flybyen og efter et tryk på navnet) kommer knappen **"🧍 Stå på Mars"** under "Prøv selv". Flybyen får ikke et ekstra stop (den har 13). Teksten ved stoppet nævner knappen.
- I landskabet: knapperne "↑ Tilbage i kredsløb", "Gå til …" (det andet sted ved samme krater), "📷 Rovernes foto" (der, hvor det findes), skyderen "Klokken på Mars", "▶ Lad dagen gå", "Solnedgang" og "Navne" (små navne på det, man ser: Mount Sharp, randen, deltaet, roveren. Følger den fælles knap, `navne.js`).
- Panelet til højre viser stedets tekst, mens man står der. Pause stopper dagen og månerne.

### 9. Tekster (udkast, alt faktatjekkes med `/faktatjek` i byggefasen)
- **Hvad man ser:** Ved Gale: Mount Sharp, lagene, klitterne, kraterranden mod nord, hvor langt der er til tingene (målt i programmet). Ved Jezero: deltaet under én, kraterbunden, hvor Perseverance landede, og randen på den anden side.
- **Roverens fund:** Gale: søer med vand, mikrober kunne have levet i, organiske stoffer (ikke afgjort), roverens rute op ad bjerget. Jezero: deltaet, prøverne i rør, Cheyava Falls (muligt biospor), Ingenuity.
- **Det, der ændrer sig** (rovernes plads, km, prøver og Mars Sample Return), slås op samme dag, som teksten låses, og skrives med måned og år ("i oktober 2026").
- **"Ærligt talt":** Højderne er målt fra kredsløb (HiRISE i stereo, ca. 1 m mellem højderne, reelt lidt grovere), så sten under ca. 1-2 m er der ikke. Fotoene fra kredsløb er grå, og farverne er sat på af programmet. Himlens farve og disen er en enkel model. Solens og månernes pladser er regnet, men årstiden er valgt. Øjenhøjden er en voksens. Rovernes plads er fra NASA's kort på en bestemt dato. Ved Phobos og Deimos (fra jorden) er de i den rigtige størrelse.
- **Fagord (forslag):** klit, butte (et lille bjerg med flad top), sol (et døgn på Mars) og måske ortofoto. Findes allerede: rover, delta, biospor, nedslagskrater.

### 10. Hvad det koster
- **Filer:** ca. 36 MB i alt (afsnit 2), hentet først, når man trykker "Stå på Mars" (det tætte lag måske allerede ved stoppet, som `hentNæste`).
- **Grafikkort:** ca. 65 MB pr. krater oven i Mars.
- **Billeder i sekundet:** Landskabet erstatter kloden (som skjules), så antallet af punkter er som i dag. Himlen og skyggekortet er nye. Måles i testbrowseren på pc og tablet før og efter (én ad gangen).
- **Hvis det bliver for tungt på tabletten:** først færre ringe og retninger (768 × 384), så skyggekortet sjældnere og i lavere opløsning, så 2048-fotos i stedet for 4096 og til sidst det tætte lag på 1 × 1 km.

### 11. Opdeling
**Anbefaling: tre dele med et go imellem:**

| Del | Hvad | Hvorfor |
|---|---|---|
| **M8a** | **Gale** med al teknikken: billedværktøjet, landskabet i ringe, lagene, himlen, disen, Solen, skyggerne, tid på dagen, Phobos og Deimos, kameraet, overgangen fra kredsløb, G2 Naukluft og G3 Curiosity nu (uden 3D-model), tekster og faktatjek. | Det svære løses ét sted. Gale har den flotteste udsigt. |
| **M8b** | **Jezero:** J2 Randens inderside og J1 Landingsstedet, data fra Mars 2020's kort, tekster og faktatjek. | Genbruger M8a. Rovernes tal slås op tæt på, at teksten kommer ud. |
| **M8c** | **Rovernes fotos og roveren:** "📷 Rovernes foto" ved G2 og J1, Curiosity som 3D-model ved G3 og sporene. | Kræver, at `assets.science.nasa.gov` åbnes. Kan springes over, hvis I ikke vil. |

### 12. Model og effort
- **Opus med høj effort** til alle tre dele. Det svære er dybden, overgangen og skyggerne, og det kan tjekkes med billeder og tal. Xhigh er ikke nødvendig: ingen svær fysik, og fejl kan ses med det samme. Fable bruges ikke (`plan-fable.md`).
- **Hjælpeagenter:** Opus med høj effort til `/faktatjek` (højst 2), Sonnet med lav effort til at finde ting i koden og Haiku med lav effort til lange testlogs.

### Beslutninger, der bekræftes ved go (anbefalingerne står først)
1. **Stederne:** To ved hvert krater: G2 Naukluft og G3 Curiosity nu ved Gale, J2 Randens inderside og J1 Landingsstedet ved Jezero. (Eller kun G2 og J2. Eller G1 Bradbury Landing i stedet for G2 eller G3.)
2. **Landskabet:** et eget landskab i ringe om stedet med tre lag og en overgang fra kredsløb (A). Eller endnu et lokalt net på kloden (B, ryster helt tæt på).
3. **Tid på dagen:** skyder, "▶ Lad dagen gå" og "Solnedgang" (A). Eller kun tre knapper: Morgen, Middag og Solnedgang (B).
4. **Phobos og Deimos på himlen:** ja, i den rigtige størrelse og på den rigtige plads (A). Eller nej (B).
5. **Panoramaerne og roveren:** med i M8c, hvis I åbner `assets.science.nasa.gov` (A). Eller kun panoramaerne (B), kun roveren (C) eller ingen af dem (D).
6. **Opdelingen:** M8a (Gale og teknikken), M8b (Jezero), M8c (fotos og roveren). Eller to dele (M8a Gale, M8b Jezero, fotos og roveren).
7. **Domænet:** Åbn `assets.science.nasa.gov` under Network access, hvis I vælger A, B eller C i spørgsmål 5. Det skal være åbent, før M8c går i gang (gerne før M8a, så modellens størrelse kan tjekkes tidligt).

## Status efter M6b (30. oktober 2026): flybyen ud til Phobos og Deimos. M6 er færdig.
- **13 stop:** … Nordpolen → **Phobos** → **Mars set fra Phobos** → **Deimos**. Ved Phobos stiller programmet månerne i banen (`stilMånerOp`), så Solen står ved `stop.sol` set fra månen. Ingen af dem står i Mars' skygge ved stoppene (testet). Månerne står stille ved stoppene, og Mars drejer.
- **Phobos-stoppet er et kompromis:**
  - Stickney (49° V) ligger på den side, der vender halvt mod Mars. Hvis Mars skal ses i baggrunden, må kameraet stå på den modsatte side, og så er Stickney mindst ca. 105° væk fra kameraet, altså ude ved kanten.
  - Står Solen, så Stickney ligger i fuld sol (mod −90°), er den side af Mars, man ser bag Phobos, i mørke (første forsøg: Mars kunne slet ikke ses).
  - Valg: Solen fra −125°. Mars er mere end halvt lyst op bag Phobos, og Stickney ude ved kanten ligger i lav sol (ca. 14°).
  - 3D-billedet er kun ca. 32-35° bredt på pc med panelerne. Derfor kigger kameraet lidt ved siden af månen mod Mars (`blik` gange halvdelen af billedets mindste side, så det også virker på højkant).
- **Mars set fra Phobos:**
  - 0,3 km over Phobos (30° S, 55° V). Mars er 42,5° bred og står ca. 30° over horisonten, og Solen står ca. 17° oppe.
  - Man drejer rundt om et punkt 50 m foran kameraet, og Phobos' lodrette retning peger op.
  - **Flimmer målt:** near 0,005 (som ved Mars, ca. 85 m, fordi systemet er skaleret ca. 59 gange) og near 0,05 gav samme billede (ca. 100 pixel forskel, lige så meget som mellem to billeder med samme near, dvs. stjernerne). Ingen grund til 2-3 km.
- **Flyvningen rundt om Phobos** (`baneOmMåne`, `bane` i `rejse.flyv`): rundt om månens midte, og højden over overfladen ændrer sig jævnt i log. Den bruges til og fra overfladen. Testen måler i hvert billede, at kameraet aldrig er under 100 m over en måne og aldrig skubbes ud (`udenom`, 50 m).
- **Fejl fundet under arbejdet:** Kollisionen brugte månens forstørrede størrelse (langt væk tegnes den større). Efter et hop fra langt væk skubbede den kameraet 9 km ud. Nu bruges den rigtige størrelse.
- **Jeres fejl:** En måne i Mars' skygge var usynlig ved et besøg. Nu glider den ud af skyggen (`udAfSkygge`).
- **Billeder i sekundet** (fuld grafik, én ad gangen, maskinen var langsommere i dag): pc 1,12 / 1,11 / 0,96 / 1,07 (hele Mars / Phobos / Mars set fra Phobos / Deimos), tablet på højkant 2,28 / 1,50 / 2,25 / 1,38. Ved Phobos og Deimos er tablet ca. 35 % lavere end ved hele Mars. Det er ikke undersøgt nærmere (målestøjen er stor, og månerne er små).
- **Faktatjek:** `docs/fakta-solsystemet.md`, "Faktatjek M6b".
- **Ikke afprøvet:** se "Lige nu" i DESIGN.md.

## Status efter M6a (30. oktober 2026): Phobos og Deimos i den rigtige form
- **Formen:** `billeder/solsystem/lav_maaner.py` laver formkortene (radius i meter, 16 bit i rød og grøn) og kortene over overfladen. `js/solsystem/maane-form.js` (`lavFormmåne`) skubber en kugle ud til formen én gang i JS (Phobos 512 × 256 felter, Deimos 256 × 128, halvt i tests).
- **Fejl i kilderne, der er rettet:** Phobos' højdekort har kopierede søjler i begge kanter (0 = 1 og 696 = 697), og de passer ikke med naboerne: et trin på ca. 200 m ved 180°, som så ud som en rende fra pol til pol. Kun søjle 2 til 695 bruges, og trinnet er fordelt over ca. 10°. SRC-mosaikken har huller i de sidste ca. 40 søjler og er mørkere omkring 180°: Et bånd på ca. 6° er fyldt med spejlede stykker fra begge sider (en lige linje gav vandrette striber). Ved polerne glider kortene over i rækkens gennemsnit (ellers en stjerne af striber).
- **Retningen er tjekket i programmet:** Set fra samme side som HiRISE-fotoene overlapper silhuetterne 0,92 (Phobos) og 0,93 (Deimos), og ved Phobos sidder kraterparret forneden samme sted som i fotoet (`docs/m6/programmet-mod-fotos.jpg`, `node tests/vaerktoejer/maaner-fotos.mjs`). Testen `mars` tjekker, at Stickney er en fordybning (744 m under ringen omkring, spejlvendt 83 m over), og at Deimos' form er vendt til østlig længde.
- **Banerne og farten:** i Mars' ækvatorplan, mod uret set fra nord, i det rigtige forhold til Mars' døgn (Phobos 3,217 og Deimos 0,813 gange Mars' drejning, testet). De følger Mars' ur og står stille, mens man besøger dem. Længde 0° vender mod Mars, og 90° V er forsiden (testet).
- **Mars' skygge** gør månerne mørke bag Mars (Deimos stod først lige bag Mars og var helt sort. Startpladserne er flyttet).
- **Knappen "Månerne"** viser begge baner med navnene, og et tryk på en måne besøger den (også uden navne). Langt væk er månerne tegnet større, og det står i "Ærligt talt".
- **Billeder i sekundet** (testbrowseren, fuld grafik, pc, målt alene i 10 sekunder ad gangen): hele Mars ca. 1,8-1,9 både med og uden månerne (ingen målbar forskel), ved Phobos ca. 1,8. Den første måling i en kørsel er altid højere og tæller ikke.
- **Ikke med endnu (M6b):** flybyens stop, "Mars set fra Phobos", de lange tekster med faktatjek og fagordene. Ved et besøg kan en måne stå i Mars' skygge og være mørk (en sætning om det kommer i M6b).

## Status efter navneknappen (30. oktober 2026)
- Knappen "Navne" under "Prøv selv" ved Mars og Saturn, slået til fra start. Fra: Navnene og prikkerne på Mars skjules, og et tryk på kloden flyver ingen steder hen. Ved Saturn skjules månernes navne, men man kan stadig trykke på månerne. Teksten om hele Mars nævner kun "Tryk på et navn", når navnene er slået til.
- Fælles hjælper `js/solsystem/navne.js` (`navneKnap`, `navneTil`), valget huskes i `atomlabNavne`. Phobos og Deimos (M6) skal bruge den.
- Testene `mars` og `saturn` tjekker det. Den nye test ved Saturn fejlede én gang under belastning (ventede kun 200 ms på næste billede). Nu venter den på, at navnene kommer frem.

## Status efter del 1: første stop hentes på forhånd (30. oktober 2026)
- **Saturn, årsagen til hakket:** `startTur` hentede alle seks månekort (pc: Mimas og Titan 4k, de andre 8k, ca. 23 MB), og de blev lagt i grafikkortet i de første sekunder af flybyen (målt: 6 overførsler på 90-1.600 ms, ét billede på 4 s i testbrowseren). **Rettet:** Kortene hentes efter Saturns egne kort, én ad gangen, og lægges i grafikkortet med `initTexture`. Efter "Start flyby" er der ingen overførsler.
- **Mars:** Olympus' kort hentes efter Mars' egne kort og lægges i grafikkortet. Ved hele Mars tegnes ingen lokale net.
- "▶ Start flyby (henter kort …)" er grå, indtil kortene er klar, højst 8 sekunder (`FORHÅND_TID`). Billederne afkodes før brug (`image.decode()`).
- Testene `mars` og `saturn` tjekker den grå knap, at kortene er hentet før flybyen, at nettet ikke tegnes før, og at knappen bliver aktiv efter ca. 8 sekunder uden kortene.

## Status efter M5a (30. oktober 2026): Tharsis, Valles Marineris og Hellas
- **Flybyen har 7 stop:** hele Mars, Olympus Mons, Calderaen, Skrænten, **Tharsis** (kl. 7, set langs rækken fra sydvest: Arsia Mons forrest), **Valles Marineris** (kl. 9, fra syd over Melas og Candor Chasma) og **Hellas** (kl. 9, fra højt oppe over nordranden).
- **Lokale net:** Tharsis med MOLA (ca. 0,9 km pr. pixel, HRSC+MOLA var ikke skarpere), Valles Marineris med HRSC+MOLA (2048 × 1024, ca. 0,7-0,9 km) og et detaljekort over Melas, Candor og Ophir (ca. 0,28 km). Hellas har intet net. Kortene til Tharsis fylder ca. 2,6 MB og til Valles Marineris ca. 5,3 MB. De hentes ved stoppet før.
- **Højst to net ad gangen** (stedets og det, man flyver hen til). Billeder i sekundet i testbrowseren på pc: 1,4-1,8 ved alle stop, som ved Olympus Mons før.
- **Flyvningen mellem to steder** går langs overfladen og højt op (se `rejse.js`), og den tager 4-10 sekunder. Mars drejer under flyvningen, så klokken passer, når man lander. Det står i "Ærligt talt".
- **Faktatjek:** `docs/fakta-solsystemet.md` under "Faktatjek M5a". Rettet bl.a. Tharsis' størrelse, toppenes højde, dybden og de yngste lavastrømme. Nye fagord: nedslagskrater og sprækkedal.
- **Fundet undervejs:** Programmets koordinater for Olympus Mons er fra USGS' ældre kortsæt (MDIM 2.0, ca. 15 km fra MDIM 2.1). Ikke rettet, for stoppet er valgt ud fra højdekortet.
- **Ikke afprøvet:** de lange flyvninger på tabletten (føles de for lange eller for høje?), et hak, når kortene hentes ved stoppet før, og om kanten af nettene ved Tharsis og Valles Marineris kan ses.
- **Næste: M5b** (Gale, Jezero, nordpolen og navnene på kloden). Prompten står ovenfor under "Prompt til M5b".
- **Jeres svar efter M5a (30. oktober 2026):** Første stop på flybyen skal hentes på forhånd ("Start flyby" er grå, indtil kortene er klar). I har oplevet et hak, da flybyen startede ved Saturn. "Næste"-knapperne skal ikke ændres, for de andre stop har været klar efter et par sekunder. Det laves sammen med M5b i en ny session, og det skal ikke gøres til et større problem.
- **Til M7b (jeres idé, 30. oktober 2026):** Under flyvningen bruges de kort, vi har, og ved selve stoppet hentes det skarpest mulige kort. Det skal kun dække det, man kan se fra stoppet, når man drejer og zoomer (fx ca. 100 × 100 km). Så kan det være meget skarpt uden at fylde meget: HRSC's egne højdekort (ca. 50 m) giver ca. 2000 × 2000 pixel og ca. 3-4 MB, og ved Gale og Jezero kan CTX (ca. 20 m) eller HiRISE (1 m) bruges i små pletter. Tjek, at dataene dækker hvert stop.

## Status efter M7a+ (30. oktober 2026): detaljekort ved calderaen og skrænten
- **Jeres spørgsmål:** Calderaen og skrænten var "lidt grumsede". Er det noget, vi må leve med? **Jeres svar:** Lav anbefalingen (et detaljekort med kildens fulde opløsning) først, og brug samme metode i M5, hvor kameraet kommer tæt på. Jeres idé: brug de almindelige kort under flyvningen, og hent det skarpeste kort til stoppet. Det er sådan, det er lavet.
- **Hvorfor det var grumset:** Det lokale højdekort har 0,52 km pr. pixel, og kilden (HRSC+MOLA) har 200 m. Ved calderaen fyldte én højdepixel ca. 5 skærmpixel, tæt på over 10.
- **Lavet:** Et detaljekort i ca. 0,22 km pr. pixel over 24° N-16,5° N og 139,5° V-131,5° V (ca. 445 × 445 km, `mars-olympus-detalje-hoejde-2k.png`, 2,2 MB, tests 1k). Det lokale net læser det, hvor det findes (`detalje` i `lokalt`), og det glider over i det lokale kort på 15 km. Det hentes, når flybyen når Olympus Mons, så det er klar ved calderaen (`hentNæste`: ved et stop hentes det næste stops kort). Højdetabellen bruger det også, så kameraet holdes over de skarpe bjerge.
- **Resultat:** Calderaens bund viser rynker og kanter, og skrænten flere kløfter (skarphed målt i billederne +35-85 %). Helt nede ved jorden er det stadig blødt: Kilden er ikke skarpere. HRSC's egne højdekort (ca. 50 m) kan komme i M7b.
- **Billeder i sekundet** (testbrowseren, fuld grafik): ved calderaen og skrænten 1,35-1,57 på pc og 2,0-2,5 på tablet, før 1,5-1,9 og 2,25-3,0. Målestøjen er lige så stor som forskellen, så prisen er højst ca. 10 %.
- **Farverne** er de samme (ca. 1 km). Skarpere farver kræver fotos med skygger malet ind (se M7a). En mulighed til M7b: CTX' fotos (taget ca. kl. 15) med programmets sol sat som da billedet blev taget.
- **Til M5:** Stop, hvor kameraet kommer tæt på (Valles Marineris, Gale og Jezero), får et detaljekort, hvis billedet ellers bliver grumset (regn skærmpixel pr. højdepixel, tjekliste E).

## Prompt til M5 (skrevet 30. oktober 2026, brugt: planen står i "Plan for M5" nedenfor)
**Model og effort:** Opus med høj effort, både til planen og til at bygge. `CLAUDE.md` siger Opus til kode, fakta og danske tekster, og Mars er ikke en opgave for Fable (`docs/plan-fable.md`). Xhigh er ikke nødvendig: Teknikken fra M7a genbruges, og det nye (fx et net over polen) er mindre svært end M7a. Hjælpeagenter: Opus med høj effort til faktatjekket (`/faktatjek`), Haiku med lav effort til at opsummere lange testlogs og Sonnet med lav effort til at finde ting i koden. Start en ny session fra `main`.

**Prompten (kopiér den):**

> Lav planen for Mars M5 (flybyen over Mars) og vent på mit go, før du bygger. Læs først "Lige nu" i DESIGN.md, `docs/plan-mars.md` (især "Status efter M4c", "Detaljer før flere stop" og "Status efter M7a") og tjeklisterne i `docs/erfaringer.md`. Planen skal stå i `docs/plan-mars.md` under "Plan for M5" og svare på:
> 1. **Stoppene og rækkefølgen:** Olympus Mons, calderaen og skrænten er lavet. Hvilke af Tharsis-vulkanerne, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance) kommer med, og i hvilken rækkefølge? Hvor mange stop kan flybyen have, før den bliver for lang? Skal man kunne vælge et sted direkte (fx en liste eller et tryk på kloden)?
> 2. **Lokale kort ved hvert stop** (teknikken fra M7a, `lokalt()` og `lav_steder.py`): Hvilke steder har brug for et? Tharsis og Hellas er større end et net på 1.000 km, Valles Marineris er ca. 4.000 km lang (hvilket stykke?), og nær polen virker et net i bredde og længde ikke (alle længdegrader mødes). Gale og Jezero får de meget skarpe kort i M7b, så her er spørgsmålet, om HRSC+MOLA er nok i M5. Tjek med billeder, at HRSC+MOLA dækker stedet og er skarpere end MOLA, som i M7a, og at farverne ikke har skygger malet ind.
> 3. **Hvad det koster:** Hvert lokalt kort er ca. 3 MB på GitHub Pages (billederne fylder ca. 65 MB nu), og det fine net koster billeder i sekundet. Hvor mange lokale net kan der være på én gang (et hul pr. net i kuglens shader)? Hentes kortene kun ved det stop, de hører til?
> 4. **Flyvningen mellem to steder** på overfladen (buen fra M4c bruges også mellem to steder), og tidspunktet på dagen ved hvert sted (lys og skyer).
> 5. **Tekster:** korte undertekster (højst ca. 160 tegn) og en tekst i panelet ved hvert stop, "For nørder", "Ærligt talt" og nye fagord i ordbogen. Faktagrundlaget står i `docs/fakta-solsystemet.md`, del 3, afsnit 3-8, men det bygger mest på søgeuddrag, så alt skal slås op i kilden med `/faktatjek`, før det kommer med. Tjek med curl, at kildesiderne kan åbnes, og spørg om adgang først, hvis de er blokeret.
> 6. **Opdeling:** Skal M5 deles (fx M5a: stoppene og teksterne, M5b: de lokale kort), så der er noget at se undervejs? Giv en anbefaling.
>
> Giv anbefalinger med begrundelse, sæt beslutningerne op som spørgsmål til mig, og sig, hvis en anden model eller effort passer bedre til en del.

## Plan for M5: flybyen over Mars (30. oktober 2026, go givet)
**Jeres svar (30. oktober 2026): "go til alle - vi følger dine anbefalinger"** (alle syv beslutninger nedenfor). Først laves M7a+ (detaljekortet ved calderaen og skrænten), og samme metode bruges i M5, hvor kameraet kommer tæt på. Domænerne `www.dlr.de`, `www.jsg.utexas.edu` og `marsed.asu.edu` står på jeres liste, men var stadig blokeret i sessionen, der startede før (proxyen afviste dem). De bruges kun til faktatjekket: Det, der kun står dér, skrives forsigtigt eller udelades.

*Lavet af Opus (høj effort) ud fra "Lige nu", "Status efter M4c", "Detaljer før flere stop", "Status efter M7a", tjeklisterne og koden (`mars.js`, `klippeplanet.js`, `rejse.js`, `flyby.js`, `lav_steder.py`). Anbefalingerne står først. Beslutningerne står som spørgsmål til sidst.*

**To ting kunne ikke tjekkes i den session, der lavede planen** (den kørte i Claude-appen og ikke i jeres sædvanlige miljø):
- **Billederne af HRSC+MOLA, MOLA og farverne:** USGS' arkiv (`asc-pds-services.s3.us-west-2.amazonaws.com`) svarede 403 fra skallen. Tallene for områderne nedenfor er derfor regnet, ikke set. Billederne laves som første skridt efter go (se afsnit 2).
- **Kildesiderne med curl:** Alle gav 403 fra skallen (også Wikipedia og NSSDC). WebFetch kunne åbne Wikipedia. I jeres sædvanlige miljø var siderne åbne 24.-30. oktober (se "Netsider i miljøet"), undtagen `www.jpl.nasa.gov`, `sbnarchive.psi.edu` og `agupubs`. Mange kilder i del 3, afsnit 3-8, ligger netop på `www.jpl.nasa.gov`, så faktatjekket bruger `science.nasa.gov` og `photojournal.jpl.nasa.gov` i stedet. Nye domæner, der skal åbnes før M5: `www.dlr.de`, `www.jsg.utexas.edu`, `marsed.asu.edu` (eller `marsed.mars.asu.edu`), `svs.gsfc.nasa.gov`, `hirise.lpl.arizona.edu` (står allerede under "Senere") og `www.planetary.org` (står under "Faktatjek"). Tjekkes med curl ved start, og jeg spørger, før arbejdet går videre, hvis noget er lukket.

### 1. Stoppene og rækkefølgen
**Anbefaling: Alle seks steder kommer med, så flybyen får 10 stop.** Rækkefølgen fortæller en historie (vulkaner → kløften, de skabte → et kæmpe nedslag → søer, hvor der måske var liv → is i dag) og holder flyvningerne nogenlunde korte:

| # | Stop | Midte (skal tjekkes mod USGS' navneliste) | Hop fra forrige | Lokalt net |
|---|---|---|---|---|
| 1 | Mars | | | |
| 2-4 | Olympus Mons, Calderaen, Skrænten (lavet) | 18,4° N, 226,0° Ø | | ✅ findes |
| 5 | **Tharsis-vulkanerne** (Ascraeus, Pavonis og Arsia Mons på en række) | ca. 1° N, 247° Ø | ca. 30° | ja |
| 6 | **Valles Marineris** (midten, hvor kløfterne er bredest) | ca. 8° S, 293° Ø (midten af området) | ca. 45° | ja |
| 7 | **Hellas** | ca. 42° S, 70° Ø | ca. 115° | nej |
| 8 | **Gale og Curiosity** (med Mount Sharp) | ca. 5° S, 138° Ø | ca. 70° | ja |
| 9 | **Jezero og Perseverance** | ca. 18° N, 78° Ø | ca. 65° | ja |
| 10 | **Nordpolen** | 90° N | ca. 70° | nej |

- **Gale før Jezero:** Det er både kortere at flyve (ca. 206° i alt mod 219° for Jezero før Gale) og i den rigtige tidsfølge (Curiosity 2012, Perseverance 2021).
- **Nordpolen til sidst:** En god afslutning (vand som is i dag), og i M6 kan turen fortsætte derfra ud til Phobos og Deimos.
- **Hvor lang må den være?** Saturn har 9 stop. Med ca. 30-45 sekunder pr. stop og 5-9 sekunders flyvning tager 10 stop ca. 6-9 minutter. Det er i den lange ende, men man trykker selv "Næste" og kan stoppe når som helst. Med Phobos og Deimos (M6) bliver det 12. Bliver det for langt, er det nemmeste at slå Calderaen og Skrænten sammen med Olympus Mons i turen (de kan stadig besøges direkte).
- **Vælg et sted direkte (anbefales):** Navne på kloden, når man ser hele Mars: Olympus Mons, Tharsis, Valles Marineris, Hellas, Gale, Jezero og Nordpolen. Et tryk på et navn flyver derhen og viser stedets tekst, ligesom et tryk på en måne ved Saturn. Navnene skjules på bagsiden og tæt på (erfaringer: "Navne på en kugle"). Det lærer også, hvor stederne ligger. Billigere alternativ: en knap pr. sted i "Prøv selv", men 7 ekstra knapper fylder meget på telefon.

### 2. Lokale kort ved stoppene
Nettet over hele Mars har ca. 21 km mellem punkterne. Et sted får brug for et lokalt net, når det, kameraet skal vise, er under ca. 50 punkter bredt i det grove net (Olympus Mons var 29 og så flad ud).

| Sted | Område (forslag) | Højdekort | Net (pc) | Hvorfor |
|---|---|---|---|---|
| Tharsis | 15° S-16° N, 124°-97° V (ca. 1.840 × 1.600 km) | 2048 × 2048, ca. 0,8-0,9 km pr. pixel | 512 × 512, ca. 3,5 km | Hver vulkan er ca. 400 km bred = ca. 19 punkter i det grove net. Vestkanten holder 0,5° (ca. 30 km) fra Olympus' net, så de to ikke overlapper. Arsias vestflanke ligger i overgangen og skal ses på billeder. |
| Valles Marineris | 16° S-0°, 80°-55° V (ca. 1.470 × 950 km) | 2048 × 1024, ca. 0,7-0,9 km | 512 × 256, ca. 3 km | **Stykket i midten:** Melas, Candor og Ophir Chasma, hvor kløfterne er bredest og dybest, og starten af Coprates Chasma mod øst. Kløfterne er 50-200 km brede og forsvinder næsten i det grove net. Noctis Labyrinthus mod vest og udløbet mod øst er med i det grove net. |
| Hellas | intet | | | Bassinet er ca. 2.200 km bredt og skråner jævnt. Kameraet skal se det hele fra højt oppe, og så er det grove net ca. 100 punkter bredt. Det er nok. |
| Nordpolen | intet | | | Et net i bredde og længde virker ikke ved polen. Kappen er ca. 1.000 km bred og ses fra højt oppe. Spiralkløfterne står i farvekortet (2,6 km pr. pixel). Et rigtigt polarnet (et andet gitter, hvor hullet i kuglen er en "kalot" øverst i kortet) er muligt, men nyt arbejde. Det kan komme i M7b, hvis I vil helt ned i kløfterne. |
| Gale | 8,4°-2,4° S, 134,8°-140,8° Ø (ca. 355 × 355 km) | 1536 × 1536, ca. 0,23 km | 512 × 512, ca. 0,7 km | Krateret er 154 km = ca. 7 punkter i det grove net. Uden et lokalt net kan man ikke se Mount Sharp. |
| Jezero | 16,3°-20,5° N, 75,4°-79,8° Ø (ca. 250 × 250 km) | 1024 × 1024, ca. 0,24 km | 512 × 512, ca. 0,5 km | Krateret er 45 km = ca. 2 punkter i det grove net. |

**Er HRSC+MOLA nok ved Gale og Jezero i M5? Anbefaling: ja.** Med 200 m pr. pixel ses Gale-krateret og Mount Sharp (ca. 5 km høj) tydeligt, og Jezero bliver et skarpt krater med sin rand. Deltaet i Jezero er kun nogle få snese meter højt og vil næppe kunne ses. Det siges ærligt i teksten ("det skarpe kort kommer senere"), og i M7b udskiftes kortene med CTX og HiRISE (måske i et mindre område). Farverne er Viking i 925 m (Jezero bliver kun ca. 50 pixel bred i farver). CTX er i gråtoner, så farverne kommer også i M7b fra Viking.

**Tjekket med billeder (første skridt efter go), som i M7a:**
- For hvert sted et billede med HRSC+MOLA og MOLA side om side i spillets opløsning og et kort over, hvor de afviger (de kasseformede fejl fra Olympus). HRSC+MOLA har ingen huller, men den er kun skarpere end MOLA, hvor Mars Express har lavet højdemodeller. Det skal ses for hvert sted, ikke antages. Er den ikke tydeligt skarpere et sted, bruges MOLA (CC0).
- Farverne fra 925 m-mosaikken med højdernes skygger ved siden af, så man kan se, om der er skygger malet ind (mørke vægge i Valles Marineris og Mount Sharp er de mest oplagte steder).
- Billederne vises i chatten, og arbejdet fortsætter uden et nyt go, medmindre et sted ser forkert ud.
- `lav_steder.py` skal kunne lave kort, der ikke er kvadratiske (Valles Marineris), og vælge højdekortets størrelse pr. sted.

### 3. Hvad det koster
| | Nu | Efter M5 (anslået) |
|---|---|---|
| Billeder i repoet | ca. 65 MB | ca. 76 MB (4 nye steder: ca. 8 MB, der hentes, og ca. 3 MB testkort) |
| Hentet ved hvert stop | Olympus ca. 2,9 MB | Tharsis ca. 3 MB, Valles Marineris ca. 2 MB, Gale ca. 2 MB, Jezero ca. 1 MB |
| Grafikkortets hukommelse | 8k-kortet ca. 170 MB, Olympus ca. 17 MB | ca. +70 MB, hvis alle steder er besøgt (de bliver i `lager`) |

- **Hentes kun ved stoppet:** Ja, som nu (`hentLokalt`). Nyt: Når man er ved et stop, hentes det **næste** stops kort i baggrunden, så det ikke hakker, når man trykker "Næste". Vælger man et sted direkte, hentes det med det samme (som nu).
- **Hvor mange net på én gang:** Hullerne i kuglens shader koster næsten intet (løkken køres kun for trekanterne på kanterne, og der er højst 5 huller). Det, der koster, er nettene selv: Hvert net er ca. 260.000 punkter og tegnes, også når det er på bagsiden af Mars. **Anbefaling:** Kun nettet ved stoppet og det, man flyver hen til, tegnes. De andre skjules, og kuglen tegnes igen dér (samme mekanik som "klar" i `opdaterHuller`). Så er der højst 2 net på skærmen ad gangen. Alle 5 net laves, når Mars åbnes (så shaderen kun bygges én gang), men uden kort.
- **Billeder i sekundet** måles før og efter ved hvert nyt stop og på hele Mars, med alle steder besøgt (tjekliste F). I M7a kostede Olympus' net pc 2,3 → 1,6 i testbrowseren. Med "kun 2 net" bør ingen stop koste mere end Olympus. Hakker tabletten: først 384 × 384 og 256 × 256 net, derefter frigives kortene ved steder langt væk.

### 4. Flyvningen mellem to steder og tidspunktet på dagen
**Problemet i dag (læst i `rejse.js`):** Buen fra M4c bruges også mellem to steder, men ved lange hop går den for lavt og for hurtigt. Fra Valles Marineris til Hellas (ca. 115°) går kameraet kun ca. 20 % af Mars' radius op (ca. 650 km), flyvningen tager kun ca. 3 sekunder (tiden regnes ud fra vinklen i radianer og holdes mellem 3 og 8 sekunder), og fokus glider i en lige linje gennem Mars' indre. Det bliver et hurtigt, forvirrende strøg hen over overfladen.

**Forslag:**
- **Korte hop** (under ca. 10°, fx Calderaen → Skrænten): som nu.
- **Lange hop:** Kameraet stiger, så man på toppen af buen kan se både stedet, man kommer fra, og stedet, man skal hen til (ca. R/cos(vinklen/2), fx ca. 1,5 R ved 95°). Fokus glider langs overfladen (en storcirkel) i stedet for gennem Mars. Flyvetiden vokser med vinklen, fx 4-10 sekunder.
- **Mars drejer under flyvningen,** så klokken passer, når man lander (`drejHen`). Det betyder, at dag og nat står næsten stille i forhold til kameraet, og Mars drejer under det. Det står i "Ærligt talt".
- **Tjek:** Kameraet skubbes aldrig op under flyvningen (`skubbet` = 0) mellem alle par af stop i turen og ved direkte valg fra og til hvert sted, også fra bagsiden. "Reducer bevægelse" hopper som nu.

**Tidspunktet på dagen (forslag, det endelige valg sker ud fra billeder):**

| Stop | Klokken | Kameraet | Hvorfor |
|---|---|---|---|
| Tharsis-vulkanerne | ca. 8 | fra sydøst, højt nok til at se alle tre | Morgen: klart vejr og lange skygger. Om eftermiddagen dækker skyerne toppene (se spørgsmål 4). |
| Valles Marineris | ca. 8-9 | fra syd eller langs kløften mod øst | Lavt sollys fra siden viser væggene. Prøves begge veje. |
| Hellas | ca. 8-9 | højt over nordranden, mod syd | Lav sol viser randen og bunden. |
| Gale | ca. 9 | fra nord (Bradbury Landing), mod syd mod Mount Sharp | Solen fra øst giver lys fra siden på bjerget. |
| Jezero | ca. 9 | fra sydøst mod vestranden, hvor deltaet ligger | Lys fra siden, ikke bagfra. |
| Nordpolen | se nedenfor | højt over kappen | |

**Nordpolen og årstiden:** På tegningen er det forårsjævndøgn i nord (for skyerne over vulkanerne). Så står Solen lige i horisonten ved nordpolen, og kappen ligger i halvmørke. Kappen er desuden tegnet, som den ser ud om sommeren. **Anbefaling:** Under flyvningen til nordpolen drejes Mars' akse, så det bliver nordlig sommer (Solen ca. 25° over horisonten hele døgnet: midnatssol). Teksten siger det ("Vi har spolet frem til sommer i nord"), og det passer med kappen, som den er tegnet. Når man forlader polen, drejes den tilbage. Det rører Solens retning i systemet, så luften, skyerne og "Modlys" skal tjekkes ved polen.

### 5. Tekster
Ved hvert nyt stop: en undertekst (højst ca. 160 tegn, pointen i første sætning) og en tekst i panelet (2-3 korte afsnit, som ved Olympus Mons). Indholdet bygger på `fakta-solsystemet.md`, del 3, afsnit 3-8, men **alt slås op i kilden med `/faktatjek`, før det kommer med**, for faktagrundlaget er mest søgeuddrag.

| Stop | Pointen (udkast, ikke tjekket) | Det, der skal tjekkes særligt |
|---|---|---|
| Tharsis | Tre kæmpevulkaner på en række på et højland på størrelse med Nordamerika. Skyerne om eftermiddagen ("W"-skyen, man så fra Jorden). | Arsia Mons' højde (kilderne er uenige: skriv intet præcist tal), afstanden mellem vulkanerne, plateauets størrelse og højde. |
| Valles Marineris | Ca. 4.000 km, lige så langt som fra Lissabon til Moskva, og op til 7-10 km dyb. Skorpen revnede og sank ned. Den er ikke gravet af en flod. | Dybden (7, 8, 10 eller 11 km efter kilden), alderen (ca. 3,5 mia. år), navnene og koordinaterne på kløfterne i området. |
| Hellas | Et kæmpe nedslag for ca. 4 mia. år siden. Bunden er Mars' laveste sted, og trykket er ca. dobbelt så højt. Vand kunne i teorien være flydende et kort øjeblik. | Alderen (ikke tjekket), "laveste sted" (bunden ca. 7 km, det laveste punkt ca. 8,2 km: hold dem adskilt). |
| Gale | Mount Sharp, ca. 5 km høj, lag på lag af gammelt mudder. Curiosity landede i 2012 og har vist, at her var en sø, mikrober kunne have levet i. | Hvad Curiosity laver **nu** (ændrer sig hver måned: slå op ved bygningen, og skriv "i efteråret 2026"). Organiske stoffer: "kan være dannet uden liv". |
| Jezero | En sø med et delta for ca. 3,5 mia. år siden. Perseverance landede i 2021, Ingenuity fløj 72 gange, og roveren har fyldt rør med prøver. | Antal rør og hvor roveren er nu, Sapphire Canyon (kun et **muligt** biospor), Mars Sample Return (status i 2026, ændrer sig). |
| Nordpolen | En kappe af vandis, ca. 1.000 km bred og 2-3 km tyk, med spiralkløfter formet af vinden. Om vinteren fryser ca. en fjerdedel af luften til tøris. | Spiralkløfternes kilde (Nature 465 er ikke bekræftet), Chasma Boreale (kun Wikipedia), midnatssolen (regnes efter med aksens hældning). |

- **"Kort fortalt"** nævner flybyens nye stop og navnene på kloden.
- **"For nørder":** de nye lokale net (hvor, hvor skarpe, fra hvilke sonder), hvorfor Hellas og polen ikke har et, og at Gale og Jezero får skarpere kort senere.
- **"Ærligt talt":** klokken er valgt ved hvert stop, Mars drejer hurtigt under flyvningen, årstiden skiftes ved polen, deltaet i Jezero kan ikke ses i denne opløsning, og farverne er ca. 1 km pr. pixel.
- **Nye fagord i ordbogen (forslag):** nedslagskrater, sprækkedal (eller gravsænkning), delta, rover og biospor. "Tøris", "skjoldvulkan", "caldera", "skalahøjde" og "midnatssol" findes allerede.
- **Kilder til faktatjekket:** NSSDC, `science.nasa.gov`, `photojournal.jpl.nasa.gov`, ESA, USGS (navnelisten for alle koordinater), DLR, UT Austin, ASU og Wikipedia, hvor intet bedre findes. Det, der ændrer sig (roverne, Mars Sample Return), slås op samme dag og skrives med måned og år.

### 6. Opdeling
**Anbefaling: M5 deles efter steder, så hver del giver færdige stop:**

| Del | Hvad | Hvorfor |
|---|---|---|
| **M5a** | Tharsis-vulkanerne, Valles Marineris og Hellas: billederne af kilderne, de to lokale net, den nye flyvning mellem stederne, kun 2 net på skærmen ad gangen, kortene til næste stop i baggrunden, tekster og faktatjek, 2 fagord (sprækkedal eller gravsænkning, og nedslagskrater). | Det tekniske nye (flere net, flyvningen) løses her med to net. Kameraet stilles én gang ved hvert stop på det skarpe net. |
| **M5b** | Gale, Jezero og Nordpolen: de to små lokale net, sommer ved polen, navnene på kloden (vælg et sted direkte), rovernes tekster (slås op samme dag) og 3 fagord (rover, delta og biospor). | Genbruger M5a. Teksterne om roverne ændrer sig mest, så de tjekkes tæt på, at de kommer ud. |

Jeres eget forslag (M5a: stoppene og teksterne, M5b: de lokale kort) giver noget at se hurtigere, men kameraet skal så stilles to gange ved 4 stop (først på det grove net, så på det fine), og Gale og Jezero ser grødede ud i mellemtiden. Det er ikke dyrt, men opdelingen efter steder spilder mindre.

Hver del slutter med `/faerdig`: tests (`--ændret`, og hele samlingen efter M5b), billeder med fuld grafik ved de nye stop på pc og tablet på højkant, billeder i sekundet før og efter og "Ikke afprøvet" (kanterne mellem nettene, hak ved hentning, flyvningerne på tabletten). Testen `mars` får tjek af: de nye lokale kort og højder (fx Mount Sharp ca. 5 km over bunden, Hellas' bund under −7 km), at højst 2 net tegnes, at kameraet er 2 km over jorden ved alle stop og ingen skub under flyvningerne, klokken ved hvert stop, årstiden ved polen, og at alt sættes tilbage.

### 7. Model og effort
- **Opus med høj effort** til begge dele, som M7a: kode i programmet, data, danske tekster og faktatjek (`CLAUDE.md`). Xhigh er ikke nødvendig: teknikken fra M7a genbruges. Mars er ikke en Fable-opgave (`docs/plan-fable.md`).
- **Hjælpeagenter:** Opus med høj effort til `/faktatjek` (højst 2 ad gangen, og først når curl har vist, at kilderne kan åbnes), Haiku med lav effort til lange testlogs, Sonnet med lav effort til at finde ting i koden.
- **Miljøet:** Start M5a i jeres sædvanlige miljø fra `main`, hvor USGS' arkiv og kildesiderne er åbne, og hvor der kan pushes.

### Beslutninger, der bekræftes ved go (anbefalingerne står først)
1. **Stoppene:** Alle seks, 10 stop i alt, i rækkefølgen Tharsis → Valles Marineris → Hellas → Gale → Jezero → Nordpolen. (Eller færre: hvilke skal ud?)
2. **Vælg et sted direkte:** Navne på kloden, man kan trykke på (A). Eller en knap pr. sted i "Prøv selv" (B), eller ingen i M5 (C).
3. **Lokale net:** Tharsis, Valles Marineris (stykket i midten), Gale og Jezero. Ingen ved Hellas og polen. HRSC+MOLA ved Gale og Jezero nu, og de meget skarpe kort i M7b.
4. **Tharsis og skyerne:** Morgen uden skyer (anbefales, vulkanerne skal ses). Eller en ekstra knap "Se skyerne komme", der drejer Mars frem til eftermiddag ved stoppet.
5. **Nordpolen:** Sommer i nord ved polstoppet (midnatssol), sagt ærligt i teksten. Eller beholde forårsjævndøgn, hvor kappen ligger i halvmørke.
6. **Opdelingen:** M5a (Tharsis, Valles Marineris, Hellas og den nye flyvning) og M5b (Gale, Jezero, Nordpolen og navnene på kloden). Eller jeres forslag (stop og tekster først, lokale kort bagefter), eller én PR.
7. **Domænerne:** Åbn `www.dlr.de`, `www.jsg.utexas.edu`, `marsed.asu.edu`, `svs.gsfc.nasa.gov` og `hirise.lpl.arizona.edu` i miljøet før start (og tjek, at `www.planetary.org` er åben).

## Forslag til M4c (29. oktober 2026, godkendt)
**Jeres svar (29. oktober 2026): go.** (1) Mars får "▶ Start flyby" med to stop (hele Mars og Olympus Mons) gennem det fælles modul. De andre stop kommer i M5. (2) Tidspunktet på dagen ved Olympus Mons: Jeg prøver formiddag (klart vejr) og eftermiddag (med skyerne) og vælger det, der viser vulkanen tydeligst. I åbnede `discovery.ucl.ac.uk` og `planetarynames.wr.usgs.gov`, og begge virker nu (tjekket med curl).

I bad om planen, før M4c går i gang. Forslaget:
1. **Den fælles flyby** (`js/solsystem/flyby.js`): tælleren, underteksten med prikker, teksten i panelet, "Næste: … ›" og "■ Stop flyby". Planeten giver kun stoppene og flyver selv kameraet til hvert stop. Saturn bruger modulet uden at ændre noget, man kan se.
2. **Rejsen ned til et sted** (`js/solsystem/rejse.js`): I dag skaleres og flyttes systemet, så fokus står i midten. Nu kan det også drejes, så den lodrette retning på stedet peger lige op på skærmen. Kameraets styring (OrbitControls) kan kun have én fast "op"-retning, så det er nemmere at dreje planeten end kameraet. Så følger "op" stedet af sig selv, og man drejer rundt om stedet om den lodrette akse. Kameraets plads angives på stedet: kompasretning, vinkel over horisonten og afstand. Stjernehimlen og Solens retning drejer med, så de står fast i forhold til Mars. Uden et sted (Saturn, Jorden og hele Mars) er drejningen nul, så alt er som før.
   - **Ikke under bjergene:** Højdekortet læses én gang ind i en tabel (den højeste værdi i hvert felt). Hvert billede tjekker rejsen, om kameraet er under jorden plus en margen, og skubber det op. Det gælder under flyvningen, når man selv drejer og zoomer, og når "Bjergene 10 gange højere" slås til.
3. **Mars over på rejse.js** med ét stop: **Olympus Mons**. Kameraet flyver ned og ser skråt hen over vulkanen mod horisonten, hvor den tynde luft lyser i kanten. Mars holder op med at dreje, når man besøger stedet. "Modlys" og zoom-farten tæt på følger med.
4. **Tekst** til stoppet: kort undertekst og en tekst i panelet ud fra tallene i `docs/fakta-solsystemet.md` (del 3, afsnit 2), faktatjekket med `/faktatjek` og kilder åbnet med `curl`.

**Tjek:** Saturns flyby fotograferes ved hvert stop før og efter (to gange før, så man kan se, hvor meget billederne skifter af sig selv, fx Enceladus' fontæner), og kameraets plads og systemets skala sammenlignes som tal. Nye tjek i testen `mars`: kameraet når Olympus Mons, "op" er den lodrette retning på stedet, kameraet ser skråt ned, og horisonten er i billedet, kameraet er over jorden under hele flyvningen og når man prøver at dreje eller zoome det ned (også med bjergene 10 gange højere), drejningen er nul igen ved hele Mars, og alt sættes tilbage. Billeder med fuld grafik på pc og tablet på højkant. Hele samlingen.

## Teknik
**Det, der genbruges:** kameraets rejse (`js/solsystem/rejse.js`), flybyens stop med undertekst og "Næste" (fra `saturn.js`), højdekort med 16 bit og relief fra Jorden (`js/kosmos/jorden.js`), atmosfæren med skalahøjde (`js/solsystem/atmosfaere.js`) og billedværktøjet (som `billeder/solsystem/lav_saturn.py`).

**Skalaen:** 1 enhed = 1.000 km (forslag). Mars har en radius på ca. 3.390 km, Deimos kredser ca. 23.460 km fra Mars' midte, og Phobos er kun ca. 11 km i radius. Rejsen skalerer systemet, så små ting kan ses tæt på, ligesom ved Saturn.

**Højderne:** Olympus Mons er ca. 22 km høj, og det er kun ca. 0,6 % af Mars' radius. Set fra kredsløb er det næsten fladt, men skråt fra siden og tæt på kan det ses. Kuglen får rigtige højder i geometrien (et net, der løftes efter højdekortet i vertex-shaderen), så bjergene rager op over horisonten. Gør vi bjergene højere end i virkeligheden for at se dem langt væk fra, så siges det ærligt i nørd-teksten. Det afgøres i M2, når vi kan se det.

**Detaljerne:** Et kort på 4096 × 2048 giver ca. 5 km pr. pixel ved ækvator. Det er flot på afstand, men udvisket tæt på (Jezero er kun ca. 45 km bred). I M7 får hvert sted sit eget lille kort med billede og højde i høj opløsning, som glider ind, når kameraet kommer tæt på. CTX-billederne er i gråtoner, så farven tages fra det store kort. Det siges i nørd-teksten.

**Billederne (fundet 24. oktober 2026 hos USGS, `asc-pds-services.s3.us-west-2.amazonaws.com`, som kan hentes i miljøet):**
- Mars i farver: Viking MDIM 2.1 (`mosaic/Mars_Viking_ClrMosaic_global_925m.tif`, 0,8 GB, og en udgave med 232 m pr. pixel på 12,7 GB).
- Højder: MOLA (`mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif`, 2,1 GB) og HRSC og MOLA lagt sammen (`mosaic/Mars/HRSC_MOLA_Blend/…_200mp_v2.tif`, 200 m pr. pixel, 11 GB).
- Skarpe billeder: CTX-mosaikker (`mosaic/Mars/Mars_MRO_CTX_Equi_Mosaics_Robbins/`, 6 og 100 m pr. pixel) og CTX ved mange landingssteder (`mosaic/Mars/CTX_EZs/`).
- Gale: ortofoto (25 cm pr. pixel) og højdekort (1 m pr. pixel) til Curiosity (`mosaic/Mars/MSL/`).
- Jezero: HiRISE-mosaikker og højdekort til Mars Sample Return (`mosaic/Mars/MSR_TRN_HiRISE_soc_003_USGS_release_aug2024/`).
- Phobos: farvemosaik og højdekort fra Mars Express (HRSC), SRC-mosaik og Viking-mosaik (`mosaic/Phobos_*`).
- Deimos: et kort fra Viking (`wms_basemaps/Deimos/deimoscyl4.jpg`). Formmodellen mangler (se faktagrundlaget).

**Licenserne (faktagrundlaget, del 3B):**
- Højder over hele Mars tages fra MOLA (CC0, frit). HRSC-MOLA-blandingen er CC BY-SA 3.0 IGO (HRSC er ESA/DLR/FU Berlin), så billeder lavet af den skal mærkes CC BY-SA i `KILDER.md`. Den bruges kun til de skarpe kort ved stederne (M7), hvor den gør en forskel.
- Viking, CTX, HiRISE og NASA/JPL's billeder må bruges, når kilden nævnes. Phobos' kort og højder er fra Mars Express (ESA/DLR/FU Berlin) og krediteres som CC BY-SA for en sikkerheds skyld.

**Formen på månerne (M6):** Phobos laves af USGS' højdekort fra Mars Express (`Phobos_ME_HRSC_DEM_Global_2ppd.tif`, 0,5 MB, højde over en kugle på 11.100 m). Deimos laves af Thomas' formmodel fra 1993 (et gitter på 5°, hentet fra et GitHub-spejl med den rigtige kontrolsum). For Deimos er det usikkert, om længdegraderne er østlige eller vestlige, så det tjekkes mod kortet, ellers bliver Deimos spejlvendt.

**Panoramaerne (M8):** Der er fundet to brugbare 360°-striber (Curiositys Naukluft-panorama, PIA20332, og Perseverances panorama fra landingsstedet, PIA24422), men ingen er en hel kugle, så himlen og jorden skal fyldes ud. Derfor er landskabet i 3D af højdekort og fotos fra kredsløb stadig hovedforslaget.

**Netsider i miljøet (tjekket 24. oktober 2026, efter I åbnede domænerne):** nssdc.gsfc.nasa.gov, science.nasa.gov, mars.nasa.gov, photojournal.jpl.nasa.gov, en.wikipedia.org, commons.wikimedia.org, www.esa.int, pds-geosciences.wustl.edu, astrogeology.usgs.gov (søgesiden), USGS' S3-arkiv, raw.githubusercontent.com og pypi kan åbnes. www.jpl.nasa.gov (CloudFront) og sbnarchive.psi.edu (Cloudflare) afviser selv automatiske forespørgsler. Det kan miljøet ikke ændre, så brug science.nasa.gov og photojournal i stedet, og forsøg ikke at snyde dem. Tjek med `curl`, før hjælpeagenter sættes til at søge.

**Domæner, der skal på listen (gennemgået 25. oktober 2026, jeres svar: skriv det ind):** I har bedt om en liste over de domæner, planerne får brug for ud over jeres liste. Tjekket med `curl` samme dag:
- **Snart:** `asc-pds-services.s3.us-west-2.amazonaws.com` (USGS' arkiv: M6-M8 og S3. Virker, men står ikke på listen), `raw.githubusercontent.com` (Deimos' formmodel i M6. Virker, men står ikke på listen), `pds-rings.seti.org` (S2, blokeret), `ssd.jpl.nasa.gov` og `ssd-api.jpl.nasa.gov` (JPL Horizons til Solsystemet trin 2, blokeret).
- **Faktatjek:** `www.nasa.gov`, `ntrs.nasa.gov`, `sci.esa.int`, `www.planetary.org`, `arxiv.org` og `doi.org` (alle blokeret).
- **Senere:** `hirise.lpl.arizona.edu` (M7-M8, hvis USGS' HiRISE ikke er nok), `www.iaea.org` og `www.nrc.gov` (Tjernobyl).
- **GitHub:** `github.com` står på jeres liste, men en udgivelse gav stadig 403. Det betyder kun noget for KTX2 (`basisu`).
- **Tjekket igen 25. oktober 2026, efter I tilføjede dem:** Alle kan nu åbnes undtagen fire. `www.jpl.nasa.gov` (CloudFront), `sbnarchive.psi.edu`, `www.iaea.org` og `agupubs.onlinelibrary.wiley.com` (Cloudflare) afviser selv automatiske forespørgsler, så det kan listen ikke ændre. `msss.com` svarer ikke, men `www.msss.com` virker. GitHub afvises af sessionens egen adgang til repoer ("brug add_repo") og ikke af listen. En udgivelse fra et andet repo (fx `basisu`) kræver derfor, at repoet tilføjes til sessionen med `add_repo`.

**Store filer:** De fleste filer er for store til at hente hele. Forslag: Python-pakken `rasterio` læser kun det stykke af en stor GeoTIFF, der skal bruges, direkte over nettet. Den bruges kun af billedværktøjet (`lav_mars.py`), ikke af programmet, så det er ikke et byggetrin. I har sagt ja (24. oktober 2026), og I må gerne få forslag til andre værktøjer, der gør arbejdet hurtigere eller kvaliteten bedre.

**Skarpheden (jeres svar 24. oktober 2026):** Mars får et kort på 8k (8192 × 4096, ca. 2,6 km pr. pixel) på pc, og 8k prøves også på tabletten i M2 (ellers 4k). De skarpe kort ved stederne kommer i M7. Hele Mars i høj opløsning overalt (kort i firkanter, der hentes efter behov) fylder mange GB og passer ikke på GitHub Pages.

**Hvad det koster for tabletten:** Månernes kort er 4k på pc og 2k på tablet og telefon som ved Saturn. Nettet med højder og de lokale kort i M7 er nyt, så billeder i sekundet måles før og efter (tjekliste F).

**Komprimerede teksturer (forslag til M2):** KTX2 (Basis Universal) bliver i grafikkortet komprimeret og fylder 4-8 gange mindre end et almindeligt billede. Et 8k-kort fylder ellers ca. 170 MB i grafikkortet (med mipmaps). Det kræver addon-filen `KTX2Loader` og transcoderen (en lille wasm-fil) fra `three@0.186.1` i `lib/three/` og værktøjet `basisu` til at lave filerne. Intet byggetrin. Det prøves og måles i M2, og der bruges JPG, hvis det ikke ser lige så godt ud.
