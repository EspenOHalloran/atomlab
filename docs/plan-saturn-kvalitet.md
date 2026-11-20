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

**Status efter S2 (lavet 31. oktober 2026):**
- **Kilden:** Cassini UVIS' okkultation af β Centauri, Rev 78, 28. juli 2008 (`UVIS_HSP_2008_210_BETCEN_E_TAU10KM`, 10 km). Valgt, fordi stjernen blev set 66,7° over ringplanet og er klar i ultraviolet: Målingen ser gennem B-ringen (højst målbare τ ca. 6-10, kun 8 af 2.559 punkter i B-ringen ved grænsen). γ Crucis (62,3°, en rød kæmpe) stopper ved τ ≈ 2,5 (447 punkter ved grænsen). Den anden β Centauri-måling (2008, dag 313) var næsten lige så god.
- **Dataene:** `billeder/solsystem/lav_ringe.py` laver `js/data/ringe-tau.js` (8.192 punkter, ca. 9 km pr. punkt, 22 KB). Støj under τ = 0,006 bliver 0, τ over 6,5 bliver 6,5. D-ringen (under det, UVIS kan se) er tegnet som før, F-ringens top (τ ca. 0,2, målt ved 140.556 km) er flyttet til middelafstanden 140.200 km, og Encke og Keeler er 0.
- **Kanterne i målingen** passer med grænserne i `js/data/ringe.js` inden for få tiere km: C-ringen 74.506, B-ringen 92.059-117.553, A-ringen 122.054-136.796 og Encke 133.435-133.735 km.
- **Teksturen** har selv lavede mipmaps (gennemsnit af to og to), så de tynde ringe ikke flimrer, når en pixel dækker mange punkter. Halve float, så `generateMipmap` ikke bruges (RGBA16F kan ikke altid tegnes i).
- **Farverne:** `saturn-ringe.png` har kun farvetonen nu (glattet inden for hver ring). Billedets egne striber passede ikke med de målte og er fjernet.
- **Billeder (fuld grafik):** Bagfra (modlys) viser de målte ringe meget: B-ringens kerne er mørk, og C-ringen og Cassini-delingen lyser med mange tynde ringe. Forfra er B- og A-ringen næsten ensartet lyse, fordi lyset, der kastes tilbage, næsten ikke ændrer sig, når τ er over ca. 1. Før gav billedets falske striber mere mønster forfra.
- **Mulig næste skridt (ikke lavet):** B-ringen er lysere end A-ringen på Cassinis fotos forfra (partiklerne kaster forskelligt meget lys tilbage). Det kunne komme fra et Cassini-foto af ringene (lysstyrken langs radius), ikke fra okkultationen.

### S3: Højder på månerne (mellem til stor)
- **Enceladus:** USGS har en højdemodel over hele månen (Bland m.fl. 2019): `mosaic/Enceladus/enceladus_cassini_iss_shapemodel_bland_2019/enceladus_2019pm_topography.tif` og `_radius.tif` (ca. 1 MB hver, altså ret grove) på `asc-pds-services.s3.us-west-2.amazonaws.com`. Der er også egne filer for polerne (`_nps_` og `_sps_` under `ancillary/`), som kan gøre tigerstriberne ved sydpolen skarpere.
- **Mimas, Tethys, Dione og Rhea:** Hos USGS findes ingen højdemodeller over hele månen (tjekket 24. oktober 2026). Paul Schenk (LPI) har måske lavet højdekort over Saturns måner, men det er **ikke tjekket**. Start S3 med et kort opslag, og sig, hvad der findes, før der loves noget.
- **Titan:** Overfladen ligger under disen, og højderne fra radaren dækker kun striber. Ikke med i S3.
- **Teknikken:** `js/solsystem/klippeplanet.js` kan genbruges. Den skal kunne bruge et gråtonekort og månernes lys (som `lavIsmåne` i `js/solsystem/maane.js`: Lommel-Seeliger blandet med Lambert). Den regner i kuglens egne enheder, så den virker, når rejsen skalerer systemet. Cassinis billeder har allerede skygger i kratrene, så skyggerne fra højdekortet skal ikke gøre dem dobbelt så mørke. Se det i lav sol og i modlys.
- Enceladus' fontæner og tigerstriber (`js/solsystem/fontaener.js`) skal blive ved med at sidde det rigtige sted.

**Opslaget (19. november 2026) retter to ting ovenfor:** Polfilerne (`_nps_`, `_sps_`) har også 2,2 km pr. pixel og er ikke skarpere end det globale kort. Schenks højdekort over Mimas, Tethys, Dione og Rhea står som "unreleased" (semi-globale) i USGS' oversigt (fdp.astrogeology.usgs.gov/fdp/saturn/) og kan ikke bruges. Det, der findes: Robert Gaskells formmodeller af Mimas, Tethys og Dione (PDS Small Bodies Node, 2012-2013, ICQ-format) og en SPC-model af Rhea på 2,15 km (PDS4, `satellite-rhea.cassini.shape-models-maps`). Nyere modeller (Mimas 0,6, Tethys 1,5, Dione 1,6 og Rhea 2,2 km pr. punkt) var til gennemsyn i PDS ifølge Weirich m.fl., EPSC-DPS 2025.

**Valget (19. november 2026, valgt af orkestratoren efter min anbefaling, kan ændres af jer):** Ikke `klippeplanet.js`, men som Phobos og Deimos (`maane-form.js`): Et kort over radius skubber kuglen ud én gang i JS, og lyset regnes ud fra formen. Det er lettere for tabletten, og månerne har ingen steder at lande, hvor et fint net i shaderen ville være værd at betale for.

**Status efter S3 (Enceladus, 19. november 2026):**
- `lav_saturn_former.py` laver `enceladus-form.png` (720 × 360, 16 bit regnet fra 252 km). Den bedste ellipsoide er 256,3 × 251,3 × 248,4 km (IAU: 256,6 × 251,4 × 248,3 km), og den lange akse peger mod Saturn, så kortet vender rigtigt. Kilden har 180° Ø i midten (se `.xml`), farvekortet 0° (USGS' etiket: PositiveWest, men øst til højre). Retningen kunne ikke tjekkes ved at sammenligne med fotoet: Højdemodellen er for grov (korrelationen var ca. 0 for alle retninger), så etiketterne afgør det.
- Hullerne fyldes jævnt uden ellipsoiden, og punktskyens støj glattes ca. 2 km. Ellers blev skyggegrænsen kornet.
- `formNet`, `læsForm`, `formRadius`, `formRetning` og `formBreddeLængde` i `maane-form.js` er fælles (Phobos, Deimos og Enceladus). `lavEnceladus` har `sætForm(billede, net)`, og fontænerne flyttes ned på overfladen (sydpolen er ca. 4 km under kuglen på 252 km). Nettet: pc 512 × 256, `LAV_KVALITET` 256 × 128 og tests 128 × 64.
- Billeder (fuld grafik): Forfra er Enceladus næsten som før. Ved skyggegrænsen og i lav sol er grænsen nu ujævn med bakker og dale, og der er ingen korn eller sømme. Tigerstriberne (ca. 0,5 km dybe) er for små til modellen.
- **Tilbage: S3b** (Mimas, Tethys, Dione og Rhea): sbn.psi.edu og sbnarchive.psi.edu er åbne i miljøet, men PSI ligger bag Cloudflares robottjek ("Just a moment …", 403), så filerne kan ikke hentes automatisk. Mulige veje: I henter filerne i en browser og lægger dem i repoet (fx under `billeder/solsystem/original/`, eller sender dem), Spejlene er tjekket af orkestratoren (19. november 2026): SBN's afdeling på University of Maryland (`pds-smallbodies.astro.umd.edu`) linker tilbage til PSI, og NAIF (`naif.jpl.nasa.gov`) har kun Phobos og Enceladus. Den eneste vej er altså, at I henter filerne fra sbn.psi.edu i en browser. **Idé:** NAIFs Enceladus-model (`cas_enceladus_ssd_spc_*.bds` i Cassinis SPICE-arkiv, en SPC-model i SPICE' DSK-format) kan være skarpere end Blands 2,2 km. Ikke undersøgt. `lavIsmåne` skal så have `sætForm` som `lavEnceladus`, og `lav_saturn_former.py` skal kunne læse ICQ (et gitter af punkter på en terning).

**Status efter S3b (Mimas, Tethys, Dione og Rhea, 20. november 2026):**
- I hentede filerne i en browser (de ligger nu på grenen `kilder-saturn-s3b`, og `billeder/solsystem/kilder/` er i `.gitignore`). Mimas: Gaskells ICQ med q = 256 (ca. 1,2 km). Tethys og Dione: Gaskells trekanter fra q = 128 (ca. 6,5-7 km). Rhea: Weirich m.fl. 2025 (SPC), men kun udgaven med q = 128 (ca. 8,6 km). Den skarpere udgave (ca. 2,2 km) blev ikke hentet.
- `lav_saturn_former.py` laver `mimas-`, `tethys-`, `dione-` og `rhea-form.png` (720 × 360, nul = radius i saturn.js): en stråle fra midten pr. pixel (2 × 2) rammer trekanterne i det konvekse hylster om punkternes retninger. Ellipsoiderne passer med IAU (Mimas 207,8 × 196,3 × 191,5 km mod 207,8 × 196,7 × 190,6). Retningen er tjekket: Herschel er den laveste egn ved ca. 111° V, Odysseus ved ca. 35-39° N, 123-129° V.
- `lavIsmåne` har fået `km` og `sætForm(billede, net)` (som Enceladus). Testen tjekker formen for alle fire og kratrene for Mimas og Tethys.
- Billeder (fuld grafik): Skyggegrænsen er ujævn med kratere på alle fire, mest på Mimas. Ingen sømme eller spidser ved polerne.
- **Kan blive bedre:** Rhea i ca. 2,2 km (en større fil i samme mappe hos PSI) og de nyere modeller af Weirich m.fl. (Mimas 0,6 km), hvis de kommer i PDS.

## Rækkefølgen (forslag)
**31. oktober 2026:** S2 kommer lige efter L1 (lyset i Stå på Mars), mens U3 kører. S3 og Saturn i 8k venter. Se "Plan for resten af Mars" i [plan-mars.md](plan-mars.md), afsnit 2.

S1 nu, fordi den er lille og synlig, især på tabletten. Derefter Mars M3-M8, og så S2 og S3.
