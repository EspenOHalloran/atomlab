*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

## Del 4. Solen og Jorden i Solsystemet (Mars M4b, 26. oktober 2026)
Teksterne i `js/kosmos/solen.js` og `js/kosmos/jordkloden.js`. Tallene er slået op af Opus på kildesiderne, og en hjælpeagent (Opus, høj effort) har tjekket alle påstande igen. Siderne er åbnet direkte med curl.

**Kilder:** (A) NSSDC Sun Fact Sheet, (B) Earth Fact Sheet og (C) Moon Fact Sheet (https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html, earthfact.html, moonfact.html), (D) NASA "Sun: Facts" (https://science.nasa.gov/sun/facts/), (E) NASA "Earth: Facts" (https://science.nasa.gov/earth/facts/), (F) Wikipedia "Granule (solar physics)". earthobservatory.nasa.gov blev afvist af miljøets proxy.

| Påstand | Resultat | Kilde og udregning |
|---|---|---|
| Solens bredde ca. 1,39 mio. km, 109 Jorder på række | OK | A: radius 695.700 km, 695.700 / 6.371 = 109,2 |
| ca. 1,3 mio. Jorder inden i Solen | OK | A: rumfangsforhold 1.304.000 |
| Massen ca. 333.000 Jorder, ca. 2 · 10³⁰ kg | OK | A: 1.988.400 / 5,9722 · 10²⁴ kg = 332.900 |
| Overfladen ca. 5.500 °C (5.772 K) | OK | A og D |
| Midten ca. 15 mio. °C (15,7 mio. K) | OK | A: 1,571 · 10⁷ K. D: "15 million degrees Celsius". Samme tal som i Stjerneovnen |
| Ca. 9 ud af 10 atomer i overfladen er brint, resten mest helium. Efter vægt er ca. en fjerdedel helium | OK | A: H 90,965 %, He 8,889 % (af atomerne). 8,9 · 4 / (91 + 8,9 · 4) ≈ 28 % |
| Ca. 4 mio. ton masse bliver til energi hvert sekund | OK | A: 3,828 · 10²⁶ W / c² = 4,26 · 10⁹ kg/s. Samme tal som i Stjerneovnen |
| Højst ca. 0,03 % af massen på 4,6 mia. år | OK | 4,26 · 10⁹ kg/s · 1,45 · 10¹⁷ s = 6,2 · 10²⁶ kg = 0,031 %. Den unge Sol lyste svagere |
| 4,6 mia. år og nogenlunde halvvejs gennem livet | OK | D: "a little less than halfway" |
| Ækvator drejer på ca. 25 døgn, polerne på ca. 36 | OK | D (ordret) |
| Lyset er 499 s (8 min 19 s) om at nå Jorden | **Rettet** (stod 8 min 20 s) | 149.597.871 km / 299.792 km/s = 499,0 s |
| Overfladen "bobler" (konvektion), som suppe der simrer | **Rettet** (stod "koger") | D: "convection zone". Samme fælde som "Jordens ydre kerne koger" |
| Ca. 4 mio. granuler på én gang, ca. 1.500 km brede | **Præciseret** (stod "millioner") | F |
| Jorden ca. 107 Solbredder fra Solen | OK | 149,6 / 1,391 = 107,5 |
| Jordens bredde ca. 12.740 km, 12.756 km ved ækvator og 12.714 km fra pol til pol | OK | B: 2 · 6.371, 2 · 6.378,137 og 2 · 6.356,752 |
| Døgnet 24 t, i forhold til stjernerne 23 t 56 min | OK | B: 24,0000 og 23,9345 t |
| Den eneste planet, vi kender, med liv | OK | E: "the only place we know of inhabited by living things" |
| Månens bredde ca. 3.470 km, lidt over ¼ af Jordens | OK | C: 2 · 1.737,4 = 3.475. 3.475 / 12.742 = 0,27 |
| Månen i snit 384.400 km væk, ca. 30 Jorder på række | OK | C: 384.400 / 12.742 = 30,2 |
| Afstanden svinger mellem ca. 356.000 og 407.000 km | **Rettet** (stod 363.000-406.000, som er gennemsnittet for tættest og længst væk, se erfaringer.md) | C og formlen i himmel.js (357.400-406.000 km i 2026) |
| Kredser på ca. 27 døgn og drejer lige så hurtigt | OK | C: 27,3217 døgn og 655,72 t |
| Fra fuldmåne til fuldmåne ca. 29½ døgn | OK | C: 29,53. Formlen giver 29,56 i snit i 2026 |
| Banen hælder ca. 5,1° | OK | C: 5,145° |
| Skyerne på Jorden er fra nogle få dage | **Forsigtigere** (stod "én dag") | Earth Observatory kunne ikke åbnes. Efter agentens hukommelse er de sat sammen af flere dages billeder |
| Månens plads inden for ca. 0,3° | OK (målt) | Meeus' eksempel 47.a: 0,09° i længde, 0,08° i bredde og 333 km. Formørkelserne i 2026 falder på nymåne og fuldmåne (`tests/jorden.mjs`). Almanakkens egen grænse er ikke læst i en kilde |
| Dag og nat passer inden for få minutter | OK (målt) | Solopgang i København 21. december: 7:38 verdenstid som sunrisesunsettime.org |

**Spillets egne tal:** "Drej Jorden" lader tiden gå 823 gange hurtigere (et døgn på ca. 105 sekunder). I teksten står "ca. 800 gange" og "under 2 minutter". Ved "Jorden ved siden af" har Jorden den rigtige størrelse, men står alt for tæt på Solen (det står i "Ærligt talt").

## Citatet til Saturn (Huygens), 29. oktober 2026
Citatet `huygensSaturn` i `js/data/citater.js`, vist ved Saturn i Solsystemet.

| Påstand | Resultat | Kilde |
|---|---|---|
| Ordlyden "Annulo cingitur, tenui, plano, nusquam cohaerente, ad eclipticam inclinato." | OK, læst i bogen | Huygens, *Systema Saturnium* (1659), McGill-eksemplaret på archive.org (OCR af skanningen; "cohærente" læses som "cobarente"). Wikipedia (Rings of Saturn) skriver "coherente", men anagrammet har 7 a'er, og det passer kun med "cohaerente". |
| Først offentliggjort som anagram i 1656 | OK | Samme side i bogen ("1656 die 25 Martij permixtis literis … edidimus") |
| Afsløret i 1659 | OK | *Systema Saturnium* (1659); Wikipedia: Rings of Saturn ("Three years later, he revealed …") |
| Anagrammer var en måde at gøre krav på en opdagelse før udgivelsen | OK | Wikipedia: Anagram ("In this way they laid claim to new discoveries before their results were ready for publication") |
| Galilei så ringen i 1610 og troede, at Saturn bestod af tre | OK | Wikipedia: Rings of Saturn (brevet til hertugen af Toscana: "composed of three") |

Oversættelse: "ad eclipticam inclinato" er oversat til "hælder i forhold til Jordens baneplan" (ekliptika er planet for Jordens bane), så en 13-årig kan forstå det. "nusquam cohaerente" er "ingen steder hænger fast i den".

## Faktatjek U3: stedernes tal (31. oktober 2026)
Siden i lag (U3 i [plan-ux.md](../plan-ux.md)) giver hvert sted 2-4 tal. Næsten alle stod allerede i faktatjekkede tekster. De nye blev tjekket af en hjælpeagent (Opus, høj effort), der læste kilderne direkte med curl: JPL (https://ssd.jpl.nasa.gov/sats/elem/ og /sats/phys_par/), NSSDC (saturniansatfact.html, earthfact.html, moonfact.html og marsfact.html) og Wikipedia. 25 af 26 tal var OK.

| Tal | Resultat | Kilde |
|---|---|---|
| Titan ca. 5.150 km bred, en omgang ca. 16 døgn, ca. 1,22 mio. km fra Saturn | OK | JPL: R = 2.574,76 km. NSSDC: 15,945 d og 1.221,87 · 10³ km |
| Mimas: en omgang ca. 22½ timer, ca. 185.500 km fra Saturn | OK | NSSDC: 0,9424 d (22 t 37 min) og 185,52 · 10³ km (JPL afrunder til 186.000) |
| Enceladus ca. 238.000 km fra Saturn, 4 tigerstriber | OK | NSSDC: 238,02 · 10³ km. Wikipedia "Tiger stripes (Enceladus)" |
| Tigerstriberne "hver ca. 135 km" | **Rettet til ca. 130 km** | Wikipedia: "On average, each tiger stripe depression is 130 kilometers long". 135 km (afsnit 2 ovenfor, PIA10352 som søgeuddrag) kunne ikke bekræftes |
| Dione: en omgang ca. 2¾ døgn, ca. 377.400 km, 1.123 km | OK | NSSDC: 2,7369 d og 377,40 · 10³ km. JPL: R = 561,4 km |
| Rhea ca. 1.530 km, ca. 4½ døgn, ca. 527.000 km | OK | JPL: R = 763,5 km. NSSDC: 4,5175 d og 527,04 · 10³ km |
| Tethys 1.062 km, Odysseus 445 km | OK | JPL: R = 531,1 km. Wikipedia "Odysseus (crater)" (fra USGS' navneliste) |
| Jorden: et år ca. 365¼ døgn, aksen hælder ca. 23,4° | OK | NSSDC: 365,256 d (siderisk), 23,44° |
| Månen: ca. 3.470 km, ca. 384.400 km, en omgang ca. 27 døgn, ca. 29½ døgn fra fuldmåne til fuldmåne | OK | NSSDC: R = 1.737,4 km, 0,3844 · 10⁶ km, 27,32 d og 29,53 d |
| Phobos 7 t 39 min og ca. 6.000 km over Mars, Deimos ca. 30 timer og ca. 23.500 km fra Mars' midte, begge fundet af Asaph Hall i august 1877 | OK | NSSDC: 0,31891 d, a = 9.378 km − R 3.389,5 km = 5.988 km, 1,26244 d og 23.459 km. Wikipedia (Deimos 12. august, Phobos 18. august 1877) |
| Curiosity landede 6. august 2012, Gale 154 km bred | OK | Wikipedia "Curiosity (rover)" (05:17:57 UTC, 5. august i USA) og "Gale (crater)" |
| Iapetus, Saturns tredjestørste måne, ca. 1.470 km bred og ca. 3,6 mio. km fra Saturn (nævnt i "Ærligt talt" ved Saturns måner) | OK | NSSDC: 746 × 746 × 712 km og 3.560,85 · 10³ km. Titan (5.150 km) og Rhea (1.527 km) er større |

Tallene i programmet: `SIDER` i `js/data/sider/mars.js`, `saturn.js` og `jorden.js`.

## Faktatjek S2: Saturns ringe fra Cassinis måling (31. oktober 2026)
Teksterne: nørd-teksten, "Billederne" og "Ærligt talt" ved Ringene (`js/data/sider/saturn.js`) og "Optisk dybde" i Ordbogen. Tallene er tjekket direkte i dataene og etiketten (`.LBL`) fra PDS Ring-Moon Systems Node (`COUVIS_8001`, læst), ikke i populære kilder.

| Påstand | Resultat | Kilde |
|---|---|---|
| Målt 28. juli 2008 | OK (dag 210 i 2008, `RING_EVENT_START_TIME` 2008-210T05:21) | etiketten |
| Stjernen β Centauri, instrumentet UVIS, i ultraviolet lys | OK (110-190 nm) | etiketten |
| Lagt sammen i stykker på 10 km, 8.192 punkter, ca. 9 km pr. punkt | OK (74.100 km / 8.192 = 9,05 km) | etiketten, `lav_ringe.py` |
| τ = 1: ca. 37 % slipper lige igennem, τ = 5: under 1 % | OK (e⁻¹ = 36,8 %, e⁻⁵ = 0,67 %) | regnet |
| C-ringen og Cassini-delingen τ ca. 0,1 | OK (median 0,08 og 0,09, halvdelen af punkterne 0,05-0,10 og 0,04-0,15) | dataene |
| A-ringen τ ca. 0,5-1 | OK (80 % af punkterne mellem 0,54 og 1,09) | dataene |
| Midt i B-ringen er τ mange steder over 5 | OK (99.000-108.000 km: 58 % af punkterne over 5) | dataene |
| Set fra ca. 67° over ringene | OK (`OBSERVED_RING_ELEVATION` 66,7°) | etiketten |
| D-ringen er for tynd til målingen | OK (`LOWEST_DETECTABLE_OPACITY` 0,01, og i D-ringen er der kun støj) | etiketten, dataene |
| Nogle kanter bølger frem og tilbage, F-ringen er skæv og klumpet | OK (B-ringens yderkant er excentrisk, A-ringens yderkant styres af 7:6-resonansen med Janus og Epimetheus, F-ringen har "knobs, kinks and lumps") | Wikipedia "Rings of Saturn" (læst) |
| Kreditering NASA/JPL/University of Colorado | OK (UVIS er bygget af LASP, University of Colorado, og datasættet er lavet af Colwell m.fl.) | `dataset.cat` og `uvisinst.cat` i `COUVIS_8001` |

**Rettet undervejs:** Værktøjets henvisning til metoden stod som "Icarus 206" (skrevet efter hukommelsen). Den rigtige er Colwell m.fl. 2010, Astronomical Journal 140, 1569-1578 (`ref.cat` i `COUVIS_8001`). Og γ Crucis blev set fra 62,3°, ikke fra en lav vinkel: Den stopper ved τ ≈ 2,5, fordi den er en rød kæmpe, der er svag i ultraviolet.
**Ingen hjælpeagent:** Alle tal står i den primære kilde (dataene og etiketten), som kunne læses direkte. ADS, IOP og LASP var ikke åbne fra miljøet, men behøvedes ikke.


---

