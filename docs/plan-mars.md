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
| M3 | **Atmosfæren og lyset:** den tynde, støvede luft i kanten (rigtig skalahøjde), tusmørket, polkapperne og skyer af is over vulkanerne. Knappen "Modlys". | mellem |
| M4 | **Fælles flyby, egen skærm og rejsen ned til overfladen:** Flybyen flyttes ud af `saturn.js` til et fælles modul, og kameraets rejse (`rejse.js`) lærer at flyve til et sted på kuglen og se skråt ned mod horisonten. Mars og Saturn flyttes fra Kosmos til en egen skærm, "Solsystemet" (`#solsystem`, et nyt kort i menuen med en liste over planeterne). Skallen om fænomenerne i `kosmos.js` gøres fælles, så den ikke kopieres. Saturn skal virke præcis som før. Overblikket med Solen og planeternes baner (trin 2 i plan-solsystemet.md) venter, til Mars er færdig (jeres svar 24. oktober 2026). | mellem til stor |
| M5 | **Flybyen over Mars:** stoppene med tekster (faktatjekket): oversigten, Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale (Curiosity) og Jezero (Perseverance). "For nørder", "Ærligt talt" og nye fagord i ordbogen. | mellem |
| M6 | **Phobos og Deimos i den rigtige form:** formmodeller og kort, banerne med den rigtige fart (Phobos står op i vest), stop i flybyen og "Mars set fra Phobos". | mellem til stor |
| M7 | **Skarpe detaljer ved stederne:** billeder og højder i høj opløsning lige der, hvor flybyen stopper, så man kan flyve helt ned til Olympus Mons' krater på toppen, ned i Valles Marineris og hen over Gale og Jezero. | stor |
| M8 | **Stå på Mars:** et landskab i 3D ved Gale (med Mount Sharp) og ved Jezero (med deltaet), bygget af rovernes højdekort og fotos fra kredsløb. Kameraet står, hvor roveren står. Måske også de rigtige panoramafotos fra roverne. | stor |

Rækkefølgen er valgt, så der er noget at se efter hver del: Efter M2 kan man dreje Mars, efter M5 er flybyen færdig i grove træk, og M6-M8 gør den rigere.

## Status efter M2 (24. oktober 2026)
- **Lavet:** `js/kosmos/mars.js` (fænomenet i Kosmos mellem Solstorm og Saturn), `js/solsystem/klippeplanet.js` (kuglen med rigtige højder, kan genbruges til andre klippeplaneter og måner) og `billeder/solsystem/lav_mars.py`. Farvekortet er Viking MDIM 2.1 (8k, 3,7 MB), og højderne er MOLA (4k, 7,7 MB, 16 bit). Skalaen er 1 enhed = 1.000 km.
- **Højderne:** rigtige som standard (jeres svar). Olympus Mons kan ses fra kredsløb på skyggerne, men rager kun ca. 2 pixel op over kanten, når hele kloden ses. Knappen "Bjergene 10 gange højere" gør landskabet tydeligt (det står ærligt i teksten).
- **KTX2 blev ikke prøvet:** GitHub-udgivelser er blokeret i miljøet (403), så `basisu` kunne ikke hentes. Som aftalt bruges JPG. 8k-kortet fylder ca. 170 MB i grafikkortet (med mipmaps). Vil I prøve KTX2 senere, så åbn `github.com` og `objects.githubusercontent.com` under Network access (eller brug en encoder fra npm-registret, som kan bruges).
- **8k på tabletten:** Tabletten henter også 8k, hvis grafikkortet kan klare billeder på 8192 pixel. Går det galt (siden genstarter, eller det hakker), skifter vi tabletten til 4k.
- **Til M4:** Kameraet kigger altid på Mars' midte, så man kan ikke se horisonten tæt på. Rejsen ned til et sted, hvor man ser skråt mod horisonten, kommer i M4.

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

**Store filer:** De fleste filer er for store til at hente hele. Forslag: Python-pakken `rasterio` læser kun det stykke af en stor GeoTIFF, der skal bruges, direkte over nettet. Den bruges kun af billedværktøjet (`lav_mars.py`), ikke af programmet, så det er ikke et byggetrin. I har sagt ja (24. oktober 2026), og I må gerne få forslag til andre værktøjer, der gør arbejdet hurtigere eller kvaliteten bedre.

**Skarpheden (jeres svar 24. oktober 2026):** Mars får et kort på 8k (8192 × 4096, ca. 2,6 km pr. pixel) på pc, og 8k prøves også på tabletten i M2 (ellers 4k). De skarpe kort ved stederne kommer i M7. Hele Mars i høj opløsning overalt (kort i firkanter, der hentes efter behov) fylder mange GB og passer ikke på GitHub Pages.

**Hvad det koster for tabletten:** Månernes kort er 4k på pc og 2k på tablet og telefon som ved Saturn. Nettet med højder og de lokale kort i M7 er nyt, så billeder i sekundet måles før og efter (tjekliste F).

**Komprimerede teksturer (forslag til M2):** KTX2 (Basis Universal) bliver i grafikkortet komprimeret og fylder 4-8 gange mindre end et almindeligt billede. Et 8k-kort fylder ellers ca. 170 MB i grafikkortet (med mipmaps). Det kræver addon-filen `KTX2Loader` og transcoderen (en lille wasm-fil) fra `three@0.186.1` i `lib/three/` og værktøjet `basisu` til at lave filerne. Intet byggetrin. Det prøves og måles i M2, og der bruges JPG, hvis det ikke ser lige så godt ud.
