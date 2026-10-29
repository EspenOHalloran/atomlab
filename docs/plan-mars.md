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
| M5 | **Flybyen over Mars:** stoppene med tekster (faktatjekket): oversigten, Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance). "For nørder", "Ærligt talt" og nye fagord i ordbogen. | mellem |
| M6 | **Phobos og Deimos i den rigtige form:** formmodeller og kort, banerne med den rigtige fart (Phobos står op i vest), stop i flybyen og "Mars set fra Phobos". | mellem til stor |
| M7 | **Skarpe detaljer ved stederne:** billeder og højder i høj opløsning lige der, hvor flybyen stopper, så man kan flyve helt ned til Olympus Mons' krater på toppen, ned i Valles Marineris og hen over Gale og Jezero. | stor |
| M8 | **Stå på Mars:** et landskab i 3D ved Gale (med Mount Sharp) og ved Jezero (med deltaet), bygget af rovernes højdekort og fotos fra kredsløb. Kameraet står, hvor roveren står. Måske også de rigtige panoramafotos fra roverne. | stor |

Rækkefølgen er valgt, så der er noget at se efter hver del: Efter M2 kan man dreje Mars, efter M5 er flybyen færdig i grove træk, og M6-M8 gør den rigere.

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
| M4c | Den fælles flyby (ud af `saturn.js`), rejsen ned til et sted på kuglen med udsyn mod horisonten, og Mars over på `rejse.js` (Mars styrer i dag kameraet selv) med ét stop at prøve, fx Olympus Mons. Kameraets "op" skal følge den lodrette retning på stedet, og kameraet må ikke komme ind under bjergene. Saturns flyby skal give de samme billeder før og efter. | høj |

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

## Forslag til M4c (29. oktober 2026, venter på jeres go)
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
