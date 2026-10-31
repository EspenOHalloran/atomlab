# Plan: Saturn og månerne i samme kvalitet som Mars (S1-S3)

*Lavet 24. oktober 2026 af Opus efter Mars M2. Hver del får et go, før den går i gang. I vil starte med S1 i en ny session. Mars M3 kommer bagefter.*

## Hvorfor Mars ser så godt ud, og hvad det betyder for Saturn
Mars har to ting: **rigtige højder over hele planeten** (MOLA), som giver skygger, der flytter sig med Solen, og **et skarpt farvekort** (8k). Saturns måner har kun det ene. Der findes skarpere kort, men for de fleste måner ikke højder. Saturn har ingen overflade, og den største gevinst er ringene.

**Jeres svar (24. oktober 2026):** Mars kører fint på tabletten med 8k-kortet, og det ser super ud. Tabletten kan altså klare store kort, og KTX2 er ikke nødvendigt lige nu.

## Delene

| Del | Hvad | Størrelse |
|---|---|---|
| S1 | **Skarpere kort:** tabletten 4k i stedet for 2k, pc 8k, hvor kilden er skarp nok | lille |
| S2 | **Ringene fra Cassinis målinger** i stedet for de tynde ringe, programmet laver | mellem |
| S3 | **Højder på månerne:** Enceladus først, de andre, hvis højdekortene findes | mellem til stor (afhænger af data) |

### S1: Skarpere kort (lille)
I dag (`js/kosmos/saturn.js`, `STØRRELSE`) får pc 4k og tablet, telefon og tests 2k.
- **Tabletten får 4k** for Saturn og alle månerne (som pc i dag). Testene beholder 2k.
- **Pc får 8k, hvor kilden giver noget.** Hvor mange pixel kilden har hele vejen rundt (omkreds / opløsning):

| Klode | Kilde nu | Pixel rundt i kilden | 8k på pc? |
|---|---|---|---|
| Saturn | Solar System Scope 8k (vi bruger 4k) | 8.192 | ja |
| Mimas | DLR, 216 m | ca. 5.800 | nej, 4k er nok |
| Enceladus | USGS, 110 m (der findes også en nyere med 100 m, `mosaic/Enceladus/Cassini/Enceladus_Cassini_ISS_Global_Mosaic_100m_HPF.tif`, 126 MB. "HPF" betyder højpasfiltreret, så se den, før den bruges) | ca. 15.800 | ja |
| Tethys | USGS, 293 m | ca. 11.400 | ja |
| Dione | USGS, 154 m | ca. 22.900 | ja |
| Rhea | USGS, 417 m | ca. 11.500 | ja |
| Titan | infrarødt kort, 4 km | ca. 4.000 | nej (der findes ikke et bedre kort over hele Titan) |

- **Månernes kort er gråtoner**, men lægges i dag i grafikkortet med fire kanaler. Med `RedFormat` (som Jordens skyer) fylder de en fjerdedel. Med 8k fylder Saturn ca. 170 MB og hver måne ca. 45 MB (med mipmaps), i alt ca. 350 MB på pc. Tabletten får ca. 110 MB med 4k.
- Tjek `maxTextureSize` som i `mars.js` (4k, hvis grafikkortet ikke kan klare 8k).
- `billeder/solsystem/lav_saturn.py` laver også `-8k.jpg`. Originalerne skal hentes igen (adresserne står i filen). Ret `KILDER.md`, og tjek for tomme søjler og rækker (tjekliste E).
- Tests: `tests/saturn.mjs` skal stadig bestå. Tag billeder med `node tests/vaerktoejer/saturn.mjs` (fuld grafik), og tjek, at Enceladus' fontæner og Titans dis ser ud som før.

**Status efter S1 (lavet 24. oktober 2026):**
- Tablet og telefon henter 4k, tests 2k. Pc henter 8k for Enceladus, Tethys, Dione og Rhea, hvis `maxTextureSize` ≥ 8192 (ellers 4k).
- **Saturn fik ikke 8k:** Solar System Scopes fil hedder "8k", men er kun 4096 × 2048. Andre kort af Saturn med en fri licens er ikke undersøgt endnu.
- Enceladus bruger stadig kortet på 110 m. Kortet på 100 m ("HPF") er kun 10 % skarpere, og højpasfiltret fjerner de store forskelle i lysstyrke.
- Enceladus' original har en ekstra søjle og en tom nederste række (sydpolen). De skæres nu væk.
- Månernes kort ligger med én kanal (`RedFormat`). På pc fylder de fire 8k-kort ca. 45 MB hver i grafikkortet (med mipmaps), og 8k-filerne er 3,7-6,6 MB at hente.
- `tests/vaerktoejer/saturn.mjs` tegnede ikke med fuld grafik (rettet).
- Enceladus er dæmpet lidt, så den ikke er overstrålet i fuldt dagslys (jeres ønske). 4k kører fint på mobil og tablet (jeres svar).

### S2: Ringene fra Cassinis målinger (mellem)
I dag bygges ringene af grænserne og en omtrentlig tæthed (τ) i `js/data/ringe.js`, og de mange tynde ringe laves af programmet (`ringTekstur` i `js/solsystem/ringe.js`). Helt tæt på ser de "børstede" ud.
- Cassini målte ringenes tæthed meget fint, når den så en stjerne skinne gennem ringene (stjerneokkultationer med UVIS og VIMS). Profilerne ligger hos NASA's PDS Ring-Moon Systems Node (`pds-rings.seti.org`). **Tjek med `curl`, om siden kan åbnes, før arbejdet går i gang. Er den blokeret, så stop og bed jer om adgang.**
- Profilen bliver en tekstur med τ langs radius (fx 8.192 punkter fra 66.900 til 141.000 km, ca. 9 km pr. punkt), som shaderen bruger i stedet for de lavede ringe. Grænserne i `js/data/ringe.js` og tjekkene i `tests/saturn.mjs` skal stadig passe (fx Cassini-delingen ca. 4.600 km bred, Encke-mellemrummet tomt).
- Nørd-teksten om ringene skal rettes, så den siger, hvor tallene kommer fra.

### S3: Højder på månerne (mellem til stor)
- **Enceladus:** USGS har en højdemodel over hele månen (Bland m.fl. 2019): `mosaic/Enceladus/enceladus_cassini_iss_shapemodel_bland_2019/enceladus_2019pm_topography.tif` og `_radius.tif` (ca. 1 MB hver, altså ret grove) på `asc-pds-services.s3.us-west-2.amazonaws.com`. Der er også egne filer for polerne (`_nps_` og `_sps_` under `ancillary/`), som kan gøre tigerstriberne ved sydpolen skarpere.
- **Mimas, Tethys, Dione og Rhea:** Hos USGS findes ingen højdemodeller over hele månen (tjekket 24. oktober 2026). Paul Schenk (LPI) har måske lavet højdekort over Saturns måner, men det er **ikke tjekket**. Start S3 med et kort opslag, og sig, hvad der findes, før der loves noget.
- **Titan:** Overfladen ligger under disen, og højderne fra radaren dækker kun striber. Ikke med i S3.
- **Teknikken:** `js/solsystem/klippeplanet.js` kan genbruges. Den skal kunne bruge et gråtonekort og månernes lys (som `lavIsmåne` i `js/solsystem/maane.js`: Lommel-Seeliger blandet med Lambert). Den regner i kuglens egne enheder, så den virker, når rejsen skalerer systemet. Cassinis billeder har allerede skygger i kratrene, så skyggerne fra højdekortet skal ikke gøre dem dobbelt så mørke. Se det i lav sol og i modlys.
- Enceladus' fontæner og tigerstriber (`js/solsystem/fontaener.js`) skal blive ved med at sidde det rigtige sted.

## Rækkefølgen (forslag)
**31. oktober 2026:** S2 kommer lige efter L1 (lyset i Stå på Mars), mens U3 kører. S3 og Saturn i 8k venter. Se "Plan for resten af Mars" i [plan-mars.md](plan-mars.md), afsnit 2.

S1 nu, fordi den er lille og synlig, især på tabletten. Derefter Mars M3-M8, og så S2 og S3.
