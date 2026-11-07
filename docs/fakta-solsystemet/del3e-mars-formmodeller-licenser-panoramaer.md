*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

### 7. Formmodeller

#### Phobos – USGS/DLR-højdekortet (anbefales)

- **Fil:** `mosaic/Phobos_ME_HRSC_DEM_Global_2ppd.tif` (489 113 bytes), plus `.lbl`, `_pds3.lbl` og `.tif.xml`. **(direkte)**
- **Hvad det er:** Et globalt kort i simpel cylinderprojektion, 699 × 349 pixel, 16-bit heltal (LSB), ca. 100 m/pixel, planetocentrisk bredde og **østlig** længde, −180…180°. Lavet af DLR (Konrad Willner, HRSC-teamet) ud fra HRSC-billeder og Viking-billeder, hvor HRSC manglede. Reference: Willner m.fl. 2010, *EPSL* 294 ("Phobos control point network, rotation, and shape").
- **Radius eller højde?** `.tif.xml` siger: **"Height (Elevation m) = DN; Planetary Radius = DN + 11100.0 m"**. Værdierne er altså **højde i meter over en kugle med radius 11 100 m**, ikke over en ellipsoide. Radius = værdi + 11 100 m. Intervallet er −2 940 … +2 917 m, og der er ingen huller (NoData −32768 bruges ikke).
- **Selvtjek (egen udregning):** Rumfang 5 703 km³ → middelradius 11,08 km. Tilpasset ellipsoide 12,95 × 11,32 × 9,09 km. Det passer med Ernst 2023 (5 695 km³; 12,95 × 11,30 × 9,16 km). **Det er altså den rigtige form.**
- **Teknisk:** Billeddata starter ved byte **1211** (TIFF-strips à 6 990 bytes, ukomprimeret). PIL kunne ikke læse filen ("truncated"), men en rå indlæsning af int16 LE fra offset 1211 virker. Formen er "stjerneformet" (én radius pr. retning), så den kan bruges direkte til en kugle-mesh, hvor hvert punkt skubbes ud til sin radius. Phobos har ingen overhæng af betydning ved 100 m.
- **Overflade/tekstur:** `Phobos_ME_SRC_Mosaic_Global_16ppd.tif` (5 760 × 2 880, 8 bit, 16,6 MB) er en gråtonemosaik af 26 SRC-billeder fra Mars Express og 8 Viking-billeder (Willner m.fl. 2008, A&A 488). Samme kugle-reference (11 100 m) og samme projektion, så den passer på højdekortet. `Phobos_Viking_Mosaic_40ppd_DLRcontrol.tif` (14 400 × 7 200, 104 MB, for stor) er Phil Stookes Viking-mosaik med DLR's kontrolnet. `wms_basemaps/Phobos/phobos-cylindrical_dd360.tif` (1 800 × 900) er et ældre skyggerelief (USGS; kontrol: Peter Thomas; rektificering: Phil Stooke). **(direkte)**
- **Bedre modeller findes, men kan ikke hentes herfra:** Gaskell `phobos_ver64q.tab` (PDS SBN, 49 152 flader) og Ernst m.fl. 2023 (SPC, ~100 m detaljer; kun i Small Body Mapping Tool, "vil blive arkiveret i PDS" (uddrag)). Højdekortet fra USGS er godt nok til skærmen.

#### Deimos – Thomas 1993 (anbefales; den eneste hentbare)

- **Fil:** `m2deimos.tab` fra PDS SBN-bundtet "Small Body Optical Shape Models V1.0" (`urn:nasa:pds:ast-sat.thomas.shape-models`, Thomas m.fl. 2021, doi:10.26033/g5e0-kh52; tidligere PDS3 `EAR-A-5-DDR-SHAPE-MODELS-V2.1`). Metoden: Thomas 1993, *Icarus* 105, 326, doi:10.1006/icar.1993.1130.
- **Hentet fra et GitHub-spejl:** https://raw.githubusercontent.com/andre6226/sistema-solare-opengl/53114a2cf9f266d968e7e475215e5c1985bc2ce3/resources/models/Deimos.tab (86 432 bytes). Dens **SHA-256 er 9a4dbc132c7546acb2ef26a386d306f155519f0988c8052acb2276ddeb7ca2fd**. Det er præcis den kontrolsum, et andet, uafhængigt projekt (BrunoFarfan/masseffect, `docs/deimos-sources.md`) har noteret for originalen på sbnarchive.psi.edu. Filen er altså uændret. **(direkte)**
- **Hvad det er:** 37 × 73 linjer (bredde −90…90°, længde 0…360° i trin på 5°) med radius i km. 3,58–8,71 km. Rumfang 1 018 km³ → middelradius 6,24 km; udstrækning 16,0 × 12,7 × 11,1 km (egen udregning).
- **Licens:** PDS-arkivdata er offentlige (amerikanske offentlige data). Kildeangivelse ønskes: "P. C. Thomas (Cornell), Small Body Optical Shape Models V1.0, NASA PDS". **RS** (PDS-licensen er ikke læst direkte; flere projekter skriver "public domain").
- **Usikkert:** Om længden er østlig eller vestlig. PDS-etiketten siger "planetocentric", men ikke retningen. Et projekt bruger vestlig (som Thomas 1993), et andet østlig. Vælges forkert, bliver Deimos spejlvendt. Den lange akse ligger langs længde 0/180 (mod Mars) i begge tilfælde, så det ses næsten ikke. **U** – tjek mod et billede af Deimos (fx MRO/HiRISE 2009) eller Ernst' kort, før kratrene placeres. Etiketten nævner også ca. 400 m usikkerhed ved længde 200–355°.
- **Hvad den snyder med:** Den er grov (5°-gitter, ~500 m ved ækvator) og bygger kun på Viking-billeder. Deimos ser "blød" ud, og det passer faktisk med, at overfladen er glat af støv. Kratre som Swift og Voltaire er for små til at ses i formen og skal komme fra teksturen.
- **Ernst m.fl. 2023 (SPC):** Bedre, men ikke fundet på nogen af de tilgængelige værter. Forslag: brug Thomas, og skriv i nørd-teksten "Formen er målt på Viking-billeder fra 1970'erne (Thomas 1993). En nyere model fra 2023 er ca. 2 % større."
- **Andre spejle (ikke brugt):** Stellarium (`models/m2deimos.obj.gz`, GPL-projekt, men selve dataene er fra PDS) og VTS/Celestia `Deimos.obj` (samme gitter, radius 3,9545 ved sydpolen).

#### Deimos – kortet `wms_basemaps/Deimos/deimoscyl4.jpg`

- 3 600 × 1 800 gråtoner, 0,1°/pixel, −180…180° (fra `.jgw`/`.vrt`). VRT-filen kalder referencen "Deimos (2015) – Sphere, 6200 m, Ocentric, Longitude EAST". **Ingen etiket med ophav.** **(direkte)**
- Filnavnet svarer til Calvin J. Hamiltons sider på solarviews.com: `deimoscyl1` (USGS' kort, 2001, "copyright-free"), `deimoscyl3` (Phil Stookes kort, kontrol fra Thomas' form og mosaik) og en blanding af de to, som Hamilton selv siger "ikke skal bruges til videnskab", men til pænere 3D-billeder. Det er **uklart, om `deimoscyl4` er Stookes kort eller blandingen** (søgeuddragene modsiger hinanden). **U**
- Billedet ser blødt ud (luftpensel-agtigt). Det ligner en blanding.
- Licens: Viking-billederne er NASA (offentlige). Stookes kort i PDS er "public domain, men kreditér ophavsmanden" (uddrag). Kreditér "NASA/JPL (Viking), Phil Stooke / USGS, samlet af Calvin J. Hamilton". **U**
- Bedre: Thomas' Viking-mosaik `m2deimosm.fit` (1 440 × 720) fra samme PDS-bundt eller Stookes kort fra PDS (`MULTI_SA_MULTI_6_STOOKEMAPS_V3_0/.../deimos_cyl_viking_mro.jpg`). De ligger på sbnarchive.psi.edu, som ikke kan nås herfra.

---

### 8. Licenser

AtomLab er gratis, til undervisning, på GitHub Pages og ikke-kommercielt. Det er tilladt for alle nedenstående. Kolonnen "Kreditering" er teksten til "Om AtomLab" og LICENSE.

| Data | Licens (hvad står der) | Kreditering | Sikkerhed og kilde |
|---|---|---|---|
| Viking-farvemosaik 925 m (`Mars_Viking_ClrMosaic_global_925m`) | Intet licensfelt på USGS-siden. Amerikansk offentligt værk (NASA/USGS) → public domain | "NASA/JPL/USGS (Viking Orbiter)" | RS. USGS-siden (direkte) siger "Originators: Planetary Data System" |
| Viking MDIM 2.1, farvelagt 232 m (`Mars_Viking_MDIM21_ClrMosaic_global_232m`, 12,7 GB) | Som ovenfor; farvelagt af NASA Ames over USGS' MDIM 2.1 | "NASA/JPL/USGS, farvelagt af NASA Ames" | RS (USGS-siden direkte: "Originators NASA AMES") |
| MOLA DEM 463 m | USGS' blandingsside siger **"MOLA (CC0)"** | "NASA/GSFC, MOLA Science Team; USGS" | S (direkte) |
| HRSC-MOLA-blanding 200 m v2 (`Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2`, 11 GB) | USGS-siden: **"Access Constraints: MOLA (CC0) and HRSC (CC BY-SA 3.0 IGO)"**, "Please cite authors" | "ESA/DLR/FU Berlin (HRSC), NASA/GSFC (MOLA), USGS: Fergason, Hare & Laura 2018, CC BY-SA 3.0 IGO" | S (direkte). **Ja, CC BY-SA 3.0 IGO gælder for den afledte fil** (ifølge USGS selv). Konsekvens: Teksturer/højdekort lavet ud fra den skal også deles under CC BY-SA 3.0 IGO og mærkes sådan. Programkoden påvirkes ikke, men LICENSE skal sige, at netop de filer er CC BY-SA. Alternativ: Brug kun MOLA (CC0) og slip for share-alike |
| HRSC generelt | ESA/DLR 2014: HRSC-billeder er CC BY-SA 3.0 IGO, med tilbagevirkende kraft. ESA's arkiv (PSA) siger generelt CC BY-NC 3.0 IGO | "ESA/DLR/FU Berlin, CC BY-SA 3.0 IGO" | RS (uddrag, dlr.de-blog og cosmos.esa.int). Uoverensstemmelsen BY-SA/BY-NC betyder intet for AtomLab, der er ikke-kommercielt |
| CTX-mosaikker (Robbins, `Mars_MRO_CTX_Equi_Mosaics_Robbins`) | USGS-siden: **"Use Constraints: public domain", "please cite authors"** | "NASA/JPL/MSSS (CTX); Robbins, Kirchoff & Hoover 2023, USGS" | S (direkte). MSSS' egen politik: undervisning uden tilladelse, kreditering "NASA/JPL/MSSS" (uddrag) |
| HiRISE | University of Arizona: public domain, "ingen ophavsretlige begrænsninger", kreditering ønskes | "NASA/JPL-Caltech/University of Arizona" | RS (uddrag af uahirise.org/media/usage.php) |
| MSL Gale ortofoto 25 cm og DEM 1 m (`mosaic/Mars/MSL/`, 24 GB / 3,9 GB) | Intet licensfelt på USGS-siderne. Ophavsmænd: Fred J. Calef III og Timothy Parker (JPL); "Originators: JPL-Caltech, NASA, USGS, University of Arizona". **Bygget af HRSC + CTX + HiRISE** | "NASA/JPL-Caltech/University of Arizona/MSSS, ESA/DLR/FU Berlin; Calef & Parker 2016, USGS" | RS. HRSC-delen kan i princippet trække CC BY-SA med sig. Brug derfor samme mærkning som HRSC-MOLA, eller brug kun inderste HiRISE-område. `MSL_Gale_HiRISE-LRGB_78quads_sharp_cog.tif` (1 GB, farve, Parker & Calef) er en bedre farvekilde |
| MSR TRN HiRISE, Jezero (`MSR_TRN_HiRISE_soc_003_USGS_release_aug2024`) | README.md har **ingen licenslinje** (direkte). USGS-siden: "Access Constraints: None", "Use Constraints: Please cite authors". USGS-dataudgivelse → amerikansk public domain | "Bland, Galuszka, Hare, Mayer, Redding & Wheeler 2024, USGS, doi:10.5066/P13CPYYU; HiRISE: NASA/JPL-Caltech/University of Arizona" | S (direkte for felterne). **Bemærk:** kun som zip-filer på 5,5 GB (mosaikker) og 13,6 GB (enkeltbilleder). For store til at hente her. Højder er over Mars' geoide (DeltaGeoid), 1 m/pixel; ortofoto 0,25 m |
| Phobos HRSC/SRC (USGS) | USGS-siderne: **"Access Constraints: public domain", "Please cite authors"**. Men dataene er ESA/DLR (HRSC), som ESA selv mærker CC BY-SA 3.0 IGO | "ESA/DLR/FU Berlin (HRSC/SRC), K. Willner m.fl., DLR; via USGS" | RS. Den sikre vej: kreditér som CC BY-SA 3.0 IGO |
| Phobos Viking 40 ppd (Stooke, DLR-kontrol) | USGS: "public domain", "Please cite authors" | "NASA/JPL (Viking), Phil Stooke (University of Western Ontario), DLR; via USGS" | S (direkte) |
| Deimos-formen `m2deimos.tab` | PDS-data, offentlige | "P. C. Thomas, NASA PDS Small Bodies Node (Thomas m.fl. 2021, doi:10.26033/g5e0-kh52)" | RS |
| Deimos-kortet `deimoscyl4.jpg` | Ingen etiket | Se afsnit 7 | U |
| NASA/JPL-Caltech-panoramaer (Curiosity, Perseverance) | JPL's billedpolitik: "may be used for any purpose without prior permission", undtagen NASA-/JPL-logoer, og man må ikke antyde, at NASA anbefaler noget. Til undervisning udtrykkeligt uden tilladelse | Curiosity Mastcam: "NASA/JPL-Caltech/MSSS". Navcam: "NASA/JPL-Caltech". Perseverance Mastcam-Z: "NASA/JPL-Caltech/ASU/MSSS" | RS (uddrag af jpl.nasa.gov/jpl-image-use-policy og SPDX "JPL-image"). En tredjepart (EurekAlert) skriver CC BY-NC-SA på PIA24264. Det er ikke NASA's licens; Wikimedia Commons mærker NASA-billeder PD-USGov-NASA |

### 9. 360°-panoramaer som himmelkugle

**Vigtigt:** NASA's "360°-panoramaer" er **cylindriske striber**: 360° rundt, men kun ca. 60–90° op og ned. Der er sorte hjørner, og roveren selv er med. Til en himmelkugle skal himlen over og jorden under fyldes ud (fx med en ensfarvet Mars-himmel og en sløret jord), og roveren skal måske beskæres væk. Det skal stå i nørd-teksten.

| Fil på Wikimedia Commons | Hvad | Opløsning | Status | Licens/kreditering |
|---|---|---|---|---|
| `PIA20332-fig1-MarsCuriosityRover-NaukluftPlateau-20160404.jpg` – https://upload.wikimedia.org/wikipedia/commons/5/53/PIA20332-fig1-MarsCuriosityRover-NaukluftPlateau-20160404.jpg | Curiosity Mastcam, 360° fra Naukluft Plateau i Gale (4. april 2016), hvidbalanceret, Mount Sharp i baggrunden | Billedformat ca. 4,35:1 (thumbnail 1 280 × 294 hentet); originalens størrelse ikke målt | **Findes** (thumbnail 1 280 px: 200 OK). Originalen gav 429 | NASA/JPL-Caltech/MSSS, public domain (PD-USGov-NASA) |
| `PIA24422-c1-3000-MarsPerseveranceRover-LandingSiteView-20210218.jpg` – https://upload.wikimedia.org/wikipedia/commons/e/e4/PIA24422-c1-3000-MarsPerseveranceRover-LandingSiteView-20210218.jpg | Perseverance Navcam, 360° på landingsstedet i Jezero (20. februar 2021) | ca. 3,4:1 (thumbnail 3 840 × 1 133 hentet); "c1-3000" tyder på en 3 000 px bred udgave | **Findes** (3 840 px thumbnail: 200 OK, 646 KB). Originalen gav 429 | NASA/JPL-Caltech |
| `PIA23727-MarsPerseveranceRover-Panorama-20210222.png` – https://upload.wikimedia.org/wikipedia/commons/1/17/PIA23727-MarsPerseveranceRover-Panorama-20210222.png | Perseverance-panorama (følger af et GitHub-projekt: 93 355 × 2 127 px, sandsynligvis over 50 MB) | ikke målt | Sandsynligvis findes (429, ikke 404). Ikke hentet | NASA/JPL-Caltech |
| `Panorama_of_Jezero_crater_on_Mars,_sol_44_of_Perseverance_mission.png` | Jezero sol 44 med Ingenuity. **Ikke 360°** | thumbnail 3 840 × 1 290 | Findes (200) | NASA/JPL-Caltech (tjek siden) |

- **Det bedste Perseverance-panorama** er PIA24264 ("Mastcam-Z's First 360-Degree Panorama", sol 3, 142 billeder, 36 952 × 11 570 px, TIFF 640 MB på Photojournal) (uddrag). Det **blev ikke fundet på Commons** under de prøvede navne (`PIA24264.jpg` og tre varianter: 404). NASA har en mindre JPG på assets.science.nasa.gov, men den vært kan ikke nås herfra.
- **Curiosity-alternativer** (kun Photojournal, ikke fundet på Commons): PIA16074 (Navcam, 7 703 × 1 678, cylindrisk), PIA24269/PIA24626 (Mont Mercou, 29 163 × 7 195), PIA23042 (Rock Hall). (uddrag)
- **Om hentning:** upload.wikimedia.org svarede 429 på alle originalfiler fra dette miljø. Thumbnails i standardstørrelser (fx 1 280 og 3 840 px) virkede af og til. Til en himmelkugle på pc er 3 840 px bredt nok på telefon og tablet, men tyndt på en stor skærm. Prøv igen fra et andet netværk, eller brug thumbnail-adressen `.../thumb/<h>/<hh>/<navn>/3840px-<navn>`.

---

### Mindst sikre påstande

1. **Hvor hurtigt Phobos falder** (1,8 cm/år eller ca. 4 cm/år). Kilderne er uenige, og omregningen afhænger af, om "acceleration" betyder dn/dt eller ½·dn/dt. Skriv "nogle få centimeter om året".
2. **Hvornår Phobos går i stykker/styrter ned** (20–50 mio. år). Skøn.
3. **Om Deimos-formens længdegrader er østlige eller vestlige** (spejlvending). Tjek mod et billede.
4. **Hvem der lavede `deimoscyl4.jpg`** (Stooke alene eller Hamiltons blanding), og hvilken licens den har.
5. **Hvornår MMX lander på Phobos** (tidligst dec. 2028 eller 2029–2030). Opsendelsen den 20. okt. 2026 er sikker. Ankomst (aug. 2027) og hjemkomst (2031) er planer.
6. **Størrelsen på kratrene Swift og Voltaire** (kilderne er uenige).
7. **Licensen for Phobos-HRSC-filerne hos USGS** ("public domain") over for ESA's CC BY-SA 3.0 IGO. Kreditér som CC BY-SA for en sikkerheds skyld.
8. **MSL Gale-mosaikken** har intet licensfelt og indeholder HRSC-data.
9. **Henry Madan som navnegiver** og banernes hældning/excentricitet er ikke tjekket (kun hukommelse).
10. Alt, der kun er læst som **søgeuddrag** (NASA, JPL, ESA, JAXA, Wikipedia, artikler), bør tjekkes en gang til i den fulde kilde, før teksten låses.

### Faktatjek M6a: tal i koden og de korte tekster (30. oktober 2026)
- **JPL's middelelementer** (https://ssd.jpl.nasa.gov/sats/elem/sep.html, åbnet med curl samme dag, MAR099, i forhold til de lokale Laplace-planer): Phobos a = 9.375 km, e = 0,015, i = 1,1°, P = 0,3187 døgn. Deimos a = 23.457 km, e = 0,000, i = 1,8°, P = 1,2625 døgn, Laplace-planet hælder 0,9°. Programmet bruger 9.376 km og 0,31891 døgn (Phobos) og 23.460 km og 1,26244 døgn (Deimos) fra del 3B. Forskellen er under 0,1 %. "Banerne hælder 1-2°" passer.
- **Mars' stjernedøgn:** 1,025957 døgn (24 t 37 min 22,7 s, NSSDC). Forholdet i programmet: Phobos 1,025957 / 0,31891 = 3,217 og Deimos 0,8127.
- **De korte tekster** (panelet ved Phobos, Deimos og "Månerne") bruger kun tal fra del 3B, som er sikre (S): ca. 26 km lang, Stickney ca. 9 km, ca. 6.000 km over Mars, 7 t 39 min, Deimos ca. 16 km lang, glattere af løst støv, ca. 23.500 km og ca. 30 timer. Den fulde tekst til flybyen faktatjekkes i M6b.
- **Retningen** (spejlvending): se `docs/plan-mars.md`, "Plan for M6" og "Status efter M6a".

### Faktatjek M6b: teksterne til flybyen ved Phobos og Deimos (30. oktober 2026)
To hjælpeagenter (Opus, høj effort). Læst direkte med curl: science.nasa.gov (Phobos, Deimos), nasa.gov (Perseverance' formørkelse), global.jaxa.jp (pressemeddelelserne 20. og 21. oktober 2026), www.mmx.jaxa.jp (forsiden, mission og science), www.esa.int (MMX lifts off) og Wikipedia (Phobos, Deimos, Moons of Mars, Stickney, Asaph Hall, Tidal acceleration, Solar eclipses on Mars, Micromégas). Kun søgeuddrag: Universe Today og Spaceflight Now.

| Påstand | Resultat | Kilde |
|---|---|---|
| Mars set fra Phobos er ca. 42° bred, ca. 80 gange Månen | 2 · arcsin(3.396 / 9.363) = 42,5°, Månen 0,518° → ca. 82. Programmet måler 42,5° | Egen udregning, testet |
| Mars set fra Deimos | 16,6° | Egen udregning, testet |
| Stickney "næsten halvdelen af Phobos" | **Rettet:** ca. 9 km på en måne, der er ca. 26 km lang (35-40 % af bredden, få procent af overfladen). NASA's "takes up about half the moon's surface" er forkert | Wikipedia Stickney, NASA |
| Nedslaget slog næsten Phobos i stykker | OK (modelberegning, Syal m.fl. 2016: hulrummene tog stødet) | NASA, Wikipedia Stickney |
| Angeline Stickney Hall opmuntrede Hall | OK (Hall 1878: "I might have abandoned the search had it not been for the encouragement of my wife"). Hun var matematiker | Wikipedia Asaph Hall, NASA |
| Rillerne: ikke enige | OK (rullende sten fra Stickney, revner fra tidevand, kraterkæder fra udkast fra Mars og revner fra selve nedslaget) | Wikipedia Phobos og Stickney |
| Står op i vest ca. hver 11. time, ses ikke over ca. 70° bredde | OK (11 t 6 min, 70,4°) | Wikipedia Phobos |
| Bundet rotation, Mars næsten stille på Phobos' himmel | OK (vugger 1-2°) | Wikipedia, egen udregning |
| Tidevandsbulen halter bagefter og bremser Phobos, nogle få cm om året, ring eller nedstyrtning om nogle titals millioner år | OK. Bulen halter, fordi Mars' indre er sejt. At Phobos er hurtigere, betyder at bulen ligger bagved og bremser | Wikipedia Tidal acceleration og Phobos |
| Phobos set fra Mars ca. ⅓ af fuldmånen | OK ("højst" fjernet: 0,35-0,42) | Wikipedia Phobos |
| Perseverance filmede Phobos foran Solen 2. april 2022, lidt over 40 s | OK | NASA (direkte) |
| Synkron bane ca. 20.400 km | OK (20.428 km for stjernedøgnet 24 t 37 min, ikke soldøgnet) | Egen udregning |
| Æ1: Fra Phobos drejer Mars den anden vej, én gang på ca. 11 t | OK (1/(1/7,654 − 1/24,623) = 11,1 t) | Egen udregning |
| I skygge | **Rettet:** Phobos på næsten hver omgang undtagen omkring solhverv (Solen mere end ca. 21° fra ækvator), højst ca. 52 min. Deimos kun omkring jævndøgn (ca. 8°), højst ca. 82 min | Egen udregning (kerneskygge 3.368 km ved Phobos, 2,14 km/s) |
| Tæthed og "lidt over halvdelen af sten" | **Rettet:** Sten ca. 2,7-3 g/cm³, Phobos ca. 1,9 (⅔), Deimos ca. 1,5 (½). Hulrum 25-35 % (Andert 2010) | Wikipedia Phobos, JPL |
| Deimos glat | **Rettet:** kraterne er *delvist* fyldt op ("partial filling of some of its craters") | NASA Deimos (direkte) |
| Swift og Voltaire | OK (de eneste navngivne, 1973, Swift 1726, Voltaire 1752) | Wikipedia |
| Deimos oppe ca. 2½ døgn | OK (2,48 jorddøgn = 2,41 sol. Del 3B sagde 2,5-2,7 sol: rettet) | Wikipedia, egen udregning |
| Hall, august 1877, Phobos 6 dage senere, verdens største kikkert | **Rettet:** verdens største *linsekikkert* (66 cm). Spejlkikkerter var større | Wikipedia Asaph Hall |
| Ares' sønner, frygt og rædsel | OK | Wikipedia, NASA |
| Indfangede asteroider: banerne ville være aflange og hælde | OK (banerne er næsten runde og ligger over ækvator) | Wikipedia Moons of Mars, JAXA |
| **MMX' status (slået op 30. oktober 2026)** | Opsendt 20. oktober 2026 kl. 04:41:03 japansk tid. Sund 21. oktober (solpaneler foldet ud). En nyhed 26. oktober om første signal. Ankomst sommeren 2027, to bløde landinger 2027-2030, mindst 10 g, forsøg på at flyve forbi Deimos, hjem 2031 (Australien). IDEFIX (CNES og DLR) lander først | global.jaxa.jp/press/2026/10/20261020-1_e.html og 20261021-1_e.html, www.mmx.jaxa.jp/en/ (direkte) |
| Fagordene bundet rotation, regolit, tidevandskraft | Rettet: "præcis" fjernet, regolit på Mars også af vind og vejr, tidevandskraft kommer fra et *andet* legeme, og Solen giver ca. ⅓ af tidevandet | Wikipedia, NASA |

**Nye fælder:** se "Kendte fælder i fakta" i `docs/erfaringer.md`.

