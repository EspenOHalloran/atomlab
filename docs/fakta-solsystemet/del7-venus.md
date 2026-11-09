*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

# Del 7: Venus (til [plan-venus.md](../plan-venus.md), 9. november 2026)

*Lavet af Opus (høj effort) uden hjælpeagenter: Tallene er slået op direkte i kilderne. Ikke tjekket af Fable. Teksterne til programmet faktatjekkes igen med `/faktatjek`, når de skrives (V5).*

**Sådan blev der tjekket:** Åbnet direkte: NSSDC's faktaark om Venus (opdateret 11. januar 2024), NSSDC's billedkatalog (Venera 13), USGS' kortarkiv (`planetarymaps.usgs.gov`, som sender videre til S3-spanden `asc-pds-services`, med PDS-etiketterne for hvert kort), Solar System Scope, Wikimedia Commons (licenserne i filernes wikitekst) og Wikipedias wikitekst (`index.php?action=raw`, med 4 sekunder mellem opslagene, så den ikke svarer 429) for Venus, Atmosphere of Venus, Maat Mons, Maxwell Montes, Venera 13, Akatsuki, VERITAS, DAVINCI, EnVision, Life on Venus, Volcanism on Venus og Geology of Venus. Lukket (proxyen svarede 403): `darts.isas.jaxa.jp` (Akatsuki), `psa.esa.int` (Venus Express), `www.jpl.nasa.gov`, `images-assets.nasa.gov`, `mentallandscape.com`. Horizons og arXiv er åbne, men ikke brugt endnu.

**Sikkerhed:** **S** = læst i kilden, **RS** = ret sikker (min egen viden eller en sekundær kilde som Wikipedia, tjekkes i V5), **U** = usikker, skal slås op, før den bruges.

## 1. Planeten (NSSDC, opdateret 11. januar 2024)
Kilde: https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html

| | Venus | Jorden | Sikkerhed |
|---|---|---|---|
| Radius | 6.051,8 km (ikke fladtrykt) | 6.371,0 km (middel) | S |
| Masse | 4,8673 × 10²⁴ kg = 0,815 Jordmasser | | S |
| Tæthed | 5.243 kg/m³ | 5.513 kg/m³ | S |
| Tyngdekraft | 8,87 m/s² (0,90 af Jordens) | 9,82 m/s² | S |
| Afstand til Solen | 108,21 mio. km = 0,723 AU (107,48-108,94) | 149,6 mio. km | S |
| Omløbstid (året) | 224,701 døgn | 365,256 døgn | S |
| Drejningen (stjernedøgnet) | −5.832,6 timer = **243,0 døgn, baglæns** (minus i tabellen) | 23,93 timer | S (regnet: 5.832,6 / 24 = 243,03) |
| Soldøgnet (fra solopgang til solopgang) | 2.802,0 timer = **116,75 døgn** | 24 timer | S |
| Aksens hældning | 177,36° (ækvator hælder 2,64° mod banen, altså næsten lige op, men drejer baglæns) | 23,44° | S |
| Nordpolens retning | RA 272,76°, Dec 67,16° (J2000) | | S |
| Sollys | 2.601 W/m² (1,91 gange Jordens) | 1.361 W/m² | S |
| Albedo | 0,77 (Bond), 0,689 (geometrisk). Venus kaster ca. tre fjerdedele af sollyset tilbage | 0,294 | S |
| Højdeforskel | 13 km fra det laveste til det højeste | 20 km | S |
| Måner og ringe | Ingen | 1 måne | S |
| Afstand til Jorden | 38,2-261,0 mio. km | | S |
| Tilsyneladende størrelse fra Jorden | 9,7-66,1 buesekunder | | S |

**Luften (NSSDC):**
| | | Sikkerhed |
|---|---|---|
| Tryk ved jorden | 92 bar | S |
| Temperatur | 737 K (464 °C) i middel, næsten ingen forskel på dag og nat | S |
| Tæthed ved jorden | ca. 65 kg/m³ (ca. 1/15 af vand) | S |
| Skalahøjde | 15,9 km | S |
| Indhold | 96,5 % CO₂, 3,5 % N₂. Spor: SO₂ 150 ppm, Ar 70, H₂O 20, CO 17, He 12, Ne 7 | S |
| Vind ved jorden | 0,3-1,0 m/s | S |
| 92 bar svarer til | ca. 900 m under havets overflade på Jorden | S (regnet: 91 bar / (1.025 kg/m³ · 9,81 m/s²) = 905 m) |

## 2. Døgnet, året og Solen
- **Stjernedøgnet (243,0 døgn) er længere end året (224,7 døgn),** men **soldøgnet er kortere (116,75 døgn).** Fra jorden går der altså ca. 117 døgn fra én solopgang til den næste, og et år har knap 2 soldøgn. *S (regnet ud fra NSSDC).*
- **Solen står op i vest og går ned i øst,** fordi Venus drejer baglæns. *S (følger af tegnet i NSSDC).* Ca. 58 døgn med lys og 58 med mørke. *S (regnet).*
- **Hvorfor Venus drejer baglæns** vides ikke. Forslag: et stort sammenstød, eller at Solens tidevand i den tykke luft har bremset og vendt drejningen. *RS, siges som "man ved det ikke".*
- **Solen set over skyerne:** ca. 1,38 gange så bred som fra Jorden (ca. 44 bueminutter) og 1,91 gange så meget lys. *S (regnet: 1 / 0,723).* Fra jorden kan Solen ikke ses gennem skyerne. *RS.*
- **Venus' faser** (Galileo 1610) var et af beviserne for, at Venus kredser om Solen. *RS.*
- **Venuspassager:** 2004 og 2012, de næste i december 2117 og december 2125. *S (Wikipedia, Espenak 2004).*

## 3. Skyerne og vindene
- **Superrotationen:** Luften øverst i skyerne kredser om planeten på ca. **4 jorddøgn** med ca. **100 m/s (ca. 360 km/t)** ved ækvator. Vindene blæser samme vej, som planeten drejer (baglæns, mod vest), men op til ca. 60 gange hurtigere. Vindene aftager mod polerne og er nul ved polerne. *S (Wikipedia, Svedhem m.fl. 2007, Markiewicz m.fl. 2007).* Regnet: 2π · 6.122 km / (4 · 86.400 s) = 111 m/s. Jorden ved ækvator drejer med 1,8 m/s, så 100 m/s er ca. 55 gange. *S (regnet).*
- **Hvorfor** luften superroterer, er ikke helt forstået (tidevandsbølger fra Solens varme spiller en rolle). *RS.*
- **Vindprofilen** (hastigheden for hver breddegrad) skal tages fra Venus Express og Akatsuki: fx Hueso m.fl. 2015 (VIRTIS), Khatuntsev m.fl. 2013 (VMC, vindene blev hurtigere fra ca. 300 til 400 km/t i 2006-2012) og Horinouchi m.fl. 2018 (Akatsuki). *U, slås op i V2 (arXiv er åben).*
  - **V2 (9. november 2026):** Målt selv i Akatsukis billeder (365 nm, 13.-19. august 2017): ca. −103 m/s ved ækvator, −95 ved 42° S og −85 ved 42° N (`js/data/vinde-venus.js`). Hueso m.fl. 2015 (arXiv:2401.17046, læst): "The mean zonal wind in the latitude range from 0º to 45º S is constant and decreases linearly with latitude to null values at the South Pole", og −105 ± 12 m/s ved 0-45° i UV. *S.*
- **Skyernes højde:** Hovedlaget ca. 45-70 km over jorden, dis over og under. Under ca. 45-48 km er luften klar, men tæt. *RS, tjekkes i V2.*
- **Skyerne er dråber af svovlsyre.** Regnen fordamper i varmen, før den når jorden (virga). *S (Wikipedia, BBC).*
- **Farven:** I synligt lys er skyerne næsten uden mønster, lyst gullig hvide. I ultraviolet lys (UV) ses mørke striber og et stort "Y", fordi et ukendt stof ("den ukendte UV-absorber") opsuger UV. Ved 365 nm og 283 nm (Akatsuki UVI) ses også SO₂. *S (Commons, Akatsukis beskrivelse) og RS (det ukendte stof).*
- **Polhvirvlerne:** Over hver pol er der en hvirvel med et dobbelt øje, der skifter form (Venus Express' VIRTIS i infrarødt). *S (Wikipedia).*
- **Det mest jordlignende sted i Solsystemet:** Ca. 50-65 km oppe er tryk og temperatur næsten som ved Jordens overflade (ca. 1 bar og 0-50 °C). *S (Wikipedia), tallene tjekkes i VIRA i V4.*
- **Tryk og temperatur for hver højde:** Venus International Reference Atmosphere (VIRA, Seiff m.fl. 1985). Temperaturen falder ca. 8 °C pr. km nær jorden. *U, slås op i V4.*
- **Lyset ved jorden:** dæmpet og orange, fordi luften og skyerne tager det blå. Hvor lyst der er (fx "som en overskyet dag"), er ikke slået op. *U.*
- **Lyn på Venus:** omstridt. Ikke med. *RS.*

## 4. Overfladen (Magellan)
- **Magellan** (NASA) kortlagde Venus med radar 1990-1994, ca. 98 % af overfladen. *RS.* Radaren ser gennem skyerne. Lyse steder i radarkortet er ru eller skrå, mørke er glatte. Det er ikke farver. *RS.*
- **Kortene hos USGS** (tjekket 9. november 2026): C3-MDIR (2.025 m pr. pixel, 18.775 × 9.388, 8 bit), venstre- og højrekig (225 og 75 m pr. pixel), højderne (GTDR, 4.641 m pr. pixel, 8.192 × 4.096, 16 bit, version 2) og emissivitet, Fresnel-reflektivitet og hældning (4.641 m). Etiketterne regner med radius **6.051,0 km**, NSSDC med 6.051,8 km. *S (etiketterne).*
- **Overfladens alder:** ca. 300-600 mio. år, for der er få kratere. *S (Wikipedia, Nimmo 1998, Strom 1994).* Hvordan overfladen blev ny (på én gang eller lidt ad gangen), er omstridt. *RS.*
- **Maxwell Montes:** det højeste bjerg, ca. 11 km over middelradius, på Ishtar Terra. Ca. 853 × 700 km. På toppen ca. 380 °C og 45 bar. *S (Wikipedia, Jones og Stofan 2008, Basilevsky 2003), RS indtil kilden er læst.*
- **Maat Mons:** den højeste vulkan, ca. 8 km over middelradius og ca. 5 km over sletterne, ved 0,5° N og 194,6° Ø, ca. 395 km bred. *S (Wikipedia, NASA Photojournal).*
- **NASA's kendte 3D-billede af Maat Mons** (1991, PIA00254) er overdrevet **22,5 gange** i højden, og farverne er lagt på efter Veneras fotos. *S (Wikipedia, Photojournal).*
- **Navnene:** Næsten alle steder på Venus er opkaldt efter kvinder fra historien og myterne. Undtagelserne er Maxwell Montes, Alpha Regio, Beta Regio og Ovda Regio, som fik navn før reglen. *S (Wikipedia), RS for listen over undtagelser.*
- **Pandekagekupler** ("farra"): flade, runde kupler af lava, fx ved Alpha Regio. *S (Wikipedia), stederne slås op i V3.*
- **Andre steder:** Aphrodite Terra (højlandet ved ækvator), Ishtar Terra, kratere (Mead er det største, ca. 270 km, RS), coronae (store ringe) og tesserae (foldede højland). *RS, slås op i USGS' navneliste i V3.*
- **"Metalsne":** Bjergtoppe over ca. 2,5 km er lyse i radaren. Måske et lag af et metalholdigt stof, der er fordampet i varmen og sætter sig, hvor det er koldere. Stoffet er omstridt. *U.*

## 5. Vulkaner, der er i live
- **Maat Mons, 1991:** Herrick og Hensley (Science, marts 2023) fandt et hul (et vulkansk krater), der voksede og ændrede form på 8 måneder mellem to af Magellans billeder. Det første direkte spor af et udbrud i vores tid. *S (Wikipedia), artiklen læses i V5.*
- **Sif Mons og Niobe Planitia:** Sulcanese m.fl. (Nature Astronomy, 27. maj 2024) fandt nye lavastrømme mellem to af Magellans omgange. *S (Wikipedia).*
- Ingen har set et udbrud. Det er stærke spor, ikke et bevis. *RS.*

## 6. Sonderne
- **Mariner 2** (1962): den første sonde, der fløj forbi en anden planet. *RS.*
- **Venera 7** (1970): den første landing, der sendte data fra jorden på en anden planet. **Venera 9** (1975): de første fotos fra jorden. *RS.*
- **Venera 13** (NSSDC og Wikipedia): landede **1. marts 1982** ved **7,5° S og 303° Ø**, øst for Phoebe Regio. Holdt i mindst **127 minutter** (bygget til 32), i **457 °C** og **89 atmosfærers tryk** (9,0 MPa). Tog 14 billeder. Farvepanoramaet (VG00261/262) dækker 170° og er lavet med mørkeblåt, grønt og rødt filter. Kameraet: 252 × 1.000 punkter, 9 bit. NSSDC: "The true color is difficult to judge because the Venerian atmosphere filters out blue light." Jorden ligner basalt. *S.*
- **Venera 14** (marts 1982): landede ca. 900 km fra Venera 13. *RS.*
- **Magellan** (1990-1994), **Venus Express** (ESA, 2006-2014), **Akatsuki** (JAXA, i bane fra december 2015, kontakten mistet i april 2024). *S for Akatsuki (Wikipedia), RS for resten.*
- **Parker Solar Probe** (WISPR, 2020 og 2021): billeder af natsiden i synligt og nær-infrarødt lys, hvor den varme jord gløder svagt gennem skyerne, og Aphrodite Terra ses som en stor mørk plet (højlandet er køligere). *S (Wikipedia, Wood m.fl. 2022, og Commons: NASA/Johns Hopkins APL/NRL, public domain).*
- **Kommende sonder** (Wikipedia, med henvisning til Ars Technica 10. september og 14. oktober 2026): **DAVINCI** (NASA, sonde, der daler ned gennem luften, opsendelse december 2030), **VERITAS** (NASA, radar i bane, november 2032) og **EnVision** (ESA, 2032. NASA trak sin radar, så den bygges nu i Europa). Begge NASA-missioner var truet af nedskæringer, men er "back on track" (oktober 2026). *S for datoerne i Wikipedia, RS (tallene ændrer sig), skrives med dato.*

## 7. Liv i skyerne?
- **Fosfin (2020):** Greaves m.fl. (Nature Astronomy, 14. september 2020) mente at have fundet fosfin i skyerne, som på Jorden mest laves af liv. Flere senere analyser fandt fejl i behandlingen af dataene og intet tydeligt spor (fx Snellen m.fl. 2020, Villanueva m.fl. 2021). Det er ikke bekræftet. *S (Wikipedia).*
- **Mikrober i skyerne** er en idé, ikke et fund. *RS.*
- **Havde Venus engang hav?** Det vides ikke. Nogle modeller siger ja, andre (fx 2024) at Venus altid har været tør. *U, slås op, før det skrives.*

## 8. Himlen
| Hvor | Hvad man ser | Sikkerhed |
|---|---|---|
| Over skyerne, dagsiden | Solen ca. 44 bueminutter bred og blændende. Sort himmel med stjerner (fra rummet) | S (regnet) |
| Over skyerne, natsiden | Stjerner. Jorden og Månen er de klareste "stjerner" (kommer med overblikket, som de andre planeter) | RS |
| Under skyerne | Ingen sol, ingen stjerner. En orange, diset himmel. Lyset er dæmpet | RS |
| Måner | Ingen. Asteroiden Zoozve (2002 VE68) følger Venus som en "kvasimåne", men kredser om Solen | S (Wikipedia) |

## 9. Fælder (populære påstande, der er forkerte eller for skarpe)
1. **"Et døgn på Venus er længere end et år":** Det gælder kun stjernedøgnet (243 døgn). Soldøgnet (116,75 døgn) er kortere end året. Sig hvilket døgn.
2. **NSSDC's 243,690:** I kolonnen "Ratio" er det forholdet til Jordens stjernedøgn, ikke antallet af døgn. Drejningen er −5.832,6 timer = 243,0 døgn. Wikipedia skriver soldøgnet som 116,5 døgn ét sted. Brug NSSDC's 116,75.
3. **"Det regner syre på Venus":** Regnen af svovlsyre når aldrig jorden.
4. **Maat Mons' kendte billede:** overdrevet 22,5 gange i højden og med Veneras farver. Ved vores eget "Bjergene 10 gange højere" skal det siges.
5. **"Maat Mons er det højeste bjerg":** Maxwell Montes (ca. 11 km) er højest. Maat Mons (ca. 8 km) er den højeste vulkan.
6. **Radarkortet er ikke et foto:** Lyst betyder ru eller skrå, ikke lys sten.
7. **"Venus er gulbrun":** De kendte gule og brune billeder er ofte UV-billeder i falske farver eller stærkt forstærkede. I synligt lys er Venus lyst gullig hvid og næsten uden mønster.
8. **"Veneras farver er de ægte":** Lyset på jorden er orange, fordi luften tager det blå. Stenene er nok mørkegrå som basalt.
9. **"Fosfin betyder liv":** Ikke bekræftet og stærkt omstridt.
10. **"Venus er varmest, fordi den er tættest på Solen":** Merkur er tættere. Det er drivhuseffekten i den tykke CO₂-luft.
11. **"Skyerne kører den modsatte vej af planeten":** De kører samme vej (baglæns), bare ca. 60 gange hurtigere.
12. **"Aktive vulkaner er bevist":** Stærke spor fra Magellans billeder, ingen har set et udbrud.
13. **Radius 6.051,0 eller 6.051,8 km:** USGS' kort regner med 6.051,0 km, NSSDC med 6.051,8 km. Højderne skal regnes fra samme radius som kortet (tjekkes i V1).
14. **"Venus er Jordens tvilling":** Kun i størrelse og masse. Alt andet er forskelligt.

## 10. Billeder og data (tjekket med curl 9. november 2026)
| Hvad | Hvor | Størrelse | Licens |
|---|---|---|---|
| Magellan C3-MDIR, hele kloden | `planetarymaps.usgs.gov/mosaic/Venus_Magellan_C3-MDIR_Global_Mosaic_2025m.tif` (S3: `asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/`) | 176 MB, 18.775 × 9.388, 8 bit | Public domain (NASA/JPL/USGS) |
| Magellan, venstrekig 225 m | samme sted, `..._LeftLook_mosaic_global_225m.tif` | 13 GB, 168.976 × 76.983, BigTIFF uden komprimering, én linje pr. strimmel, så et udsnit kan hentes med `Range` | Public domain |
| Magellan, 75 m (også som JPEG-TIFF) | samme sted | 7-117 GB | Public domain |
| Højderne (GTDR v02) | `..._Topography_Global_4641m_v02.tif` | 67 MB, 8.192 × 4.096, 16 bit | Public domain |
| Emissivitet, reflektivitet, hældning | `..._MicrowaveEmissivity_Global_4641m.tif` m.fl. | 34-68 MB | Public domain |
| Solar System Scope | `4k_venus_atmosphere.jpg` (1,5 MB), `2k_venus_atmosphere.jpg`, `8k_venus_surface.jpg` (12,5 MB) | Kræver en ærlig User-Agent (403 uden) | CC BY 4.0 |
| Venera 13, farvepanoramaet | NSSDC: `nssdc.gsfc.nasa.gov/imgcat/html/object_page/v13_vg261_262.html` (TIFF 3,0 MB) og Commons `File:V13_vg261_262.tif` (960 × 208) | lille | Commons: PD-RU-exempt. NSSDC: USSR/NASA |
| Akatsuki UVI | Enkelte billeder på Commons (fx `Global view uvi Venus (Akatsuki).jpg`), kort over hele kloden i DARTS (lukket) | | Japans regerings standardvilkår 2.0 (som CC BY 4.0), "ISAS/JAXA" |
| Parker Solar Probe, natsiden | Commons `File:Wispr_4thflyby.gif` | lille | Public domain (NASA/Johns Hopkins APL/NRL) |
| NASA Photojournal | `photojournal.jpl.nasa.gov` sender videre til `science.nasa.gov/photojournal/` (åben) | | Public domain |
