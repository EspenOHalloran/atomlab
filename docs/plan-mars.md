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
I M2 og M3 som Saturn: et fænomen i Kosmos (`js/kosmos/mars.js`), der hedder "Mars" i listen, før Saturn (efter Solstorm), fordi Mars er tættere på Solen. I M4 flytter Mars og Saturn til deres egen skærm, "Solsystemet".

## Delopgaverne
Hver delopgave slutter med `/faerdig` (tests, billeder, dokumentation og en PR, der merges, når hele testsamlingen er grøn). Så kan I se den på GitHub Pages, før I siger go til den næste.

| Del | Hvad | Størrelse |
|---|---|---|
| M1 | ✅ **Planen og faktagrundlaget** (denne fil, tal med kilder, billedkilder og licenser). Lavet 24. oktober 2026. | lille til mellem |
| M2 | ✅ **Mars-kloden** (lavet 24. oktober 2026, se "Status efter M2" nedenfor): billederne (farvekort og højdekort), kuglen med rigtige højder (bjergene rager op i kanten), døgn, hældning og Solen. Mars står i Kosmos med panelet og "Kort fortalt". | mellem til stor |
| M3 | ✅ **Atmosfæren og lyset** (lavet 25. oktober 2026, se "Status efter M3" nedenfor): den tynde, støvede luft i kanten (rigtig skalahøjde), tusmørket, polkapperne og skyer af is over vulkanerne. Knappen "Modlys". | mellem |
| M4 | **Fælles flyby, egen skærm og rejsen ned til overfladen** (plus Solen og Jorden, se "Jorden i Solsystemet" nedenfor): Flybyen flyttes ud af `saturn.js` til et fælles modul, og kameraets rejse (`rejse.js`) lærer at flyve til et sted på kuglen og se skråt ned mod horisonten. Mars og Saturn flyttes fra Kosmos til en egen skærm, "Solsystemet" (`#solsystem`, et nyt kort i menuen med en liste over planeterne). Skallen om fænomenerne i `kosmos.js` gøres fælles, så den ikke kopieres. Saturn skal virke præcis som før. Jorden (en klode som Mars med Årstiderne og Formørkelser under sig) og Solen (Solstorm og Solens fremtid) flytter også til Solsystemet (jeres svar 26. oktober 2026). Overblikket med Solen og planeternes baner (trin 2 i plan-solsystemet.md) venter, til Mars er færdig (jeres svar 24. oktober 2026). | stor |
| M5 | ✅ (M5a og M5b lavet 30. oktober 2026, se "Status efter M5a" og "Status efter M5b") **Flybyen over Mars:** stoppene med tekster (faktatjekket): oversigten, Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance). "For nørder", "Ærligt talt" og nye fagord i ordbogen. | mellem |
| M6 | **Phobos og Deimos i den rigtige form:** formmodeller og kort, banerne med den rigtige fart (Phobos står op i vest), stop i flybyen og "Mars set fra Phobos". | mellem til stor |
| M7 | (M7a ✅ lavet 30. oktober 2026, se "Status efter M7a") **Skarpe detaljer ved stederne:** billeder og højder i høj opløsning lige der, hvor flybyen stopper, så man kan flyve helt ned til Olympus Mons' krater på toppen, ned i Valles Marineris og hen over Gale og Jezero. | stor |
| M8 | **Stå på Mars:** et landskab i 3D ved Gale (med Mount Sharp) og ved Jezero (med deltaet), bygget af rovernes højdekort og fotos fra kredsløb. Kameraet står, hvor roveren står. Måske også de rigtige panoramafotos fra roverne. | stor |

Rækkefølgen er valgt, så der er noget at se efter hver del: Efter M2 kan man dreje Mars, efter M5 er flybyen færdig i grove træk, og M6-M8 gør den rigere.

**Ny rækkefølge (jeres svar 29. oktober 2026):** M7 deles i **M7a** (teknikken til lokale detaljer, prøvet på Olympus Mons) og **M7b** (de meget skarpe kort ved Gale og Jezero). Rækkefølgen bliver **M7a → M5 → M6 → M7b → M8**. Se "Detaljer før flere stop" nedenfor.

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
