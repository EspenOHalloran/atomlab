*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

## Faktatjek J2: vindene og Den Store Røde Plet (6. november 2026)

*Opus (høj effort) med `/faktatjek`. Teksterne i `js/data/sider/jupiter.js` (emnet "Hvor hurtigt blæser det?", "Vindene er målt af os" under For nørder, Ærligt talt og siden `plet`) og underteksten ved pletten (`PLET_STOP` i `js/kosmos/jupiter.js`). Næsten alt stod allerede i del 5 ovenfor med kilder. Kun én påstand var ny, og den blev tjekket uden hjælpeagent.*

| Påstand | Resultat | Kilde |
|---|---|---|
| Ca. 150 m/s (ca. 540 km/t) mod øst ved 24° N | OK. Vores måling: ca. 149 m/s (OPAL, december 2025, `js/data/vinde-jupiter.js`). 150 × 3,6 = 540 | Egen måling, Simon m.fl. 2015 (del 5, punkt 5) |
| Skyerne flytter sig højst ca. 5° på ét Jupiter-døgn | OK (regnet): 149 m/s × 35.730 s = 5.300 km. Breddekredsen ved 24° N er ca. 415.000 km, altså ca. 4,6° | Regnet |
| 9 t 25 min mellem Hubbles to omgange | OK: 9 t 24 min 54 s ved begge ender af omgangene | OPAL's README for cyklus 32 (åbnet) |
| 153 m/s (Hubble 2015), 138 (Cassini 2000), 184 (Voyager 1979) | OK | Simon, Wong & Orton 2015 (del 5, punkt 5, åbnet) |
| "Vindene ændrer sig lidt fra år til år" | OK: toppene ændrer sig 10-20 m/s | Samme |
| Pletten: ca. 13.000-14.000 km bred, ca. 23° S | OK (egen måling i Hubbles kort): 10,8° langs breddekredsen, hvor den er tydeligt rød, og ca. 12° til den røde kant. 1° = ca. 1.160 km ved pletten. Midten ved 23,1° S planetografisk | Egen måling (`lav_jupiter.py`, `mål_plet`), del 5 punkt 1 |
| Vind mod vest på nordsiden og mod øst på sydsiden | OK: −56 m/s ved 20° S, +30-40 m/s ved 26-29° S (vores måling) | Egen måling |
| "Derfor drejer den rundt, som en bold mellem to hænder" | **Rettet:** Årsagen er ikke så enkel (pletten opstod nok ved en forstyrrelse mellem de to jetstrømme, del 5 punkt 2). Nu: "Den drejer samme vej, som en bold mellem to hænder, der gnider mod hinanden" | – |
| Kanten drejer hurtigst, og midten er roligere | OK: "The GRS's high-speed collar and quiescent interior" (Shetty, Asay-Davis & Marcus 2007, arXiv 0707.4193). Galileo: "high-velocity collar", op til ca. 170 m/s, og tegn på en kerne, der drejer den anden vej (Choi m.fl. 2007, Icarus 188, 35, arXiv 1301.6119) | Begge abstracts åbnet på export.arxiv.org |
| Hubbles kort: ca. 125 km pr. pixel | OK (regnet): 0,1° ved ækvator = 2π · 71.492 km / 3.600 = 125 km | Regnet |
| Undertekst, alder, 1600-tallet, 41.000 km, rundere, højtryk, 640 km/t, 350-500 km | OK | Del 5, punkt 1 og 2 |

**Ny fælde:** Pletten drejer ikke som en stiv skive. Kanten er hurtigst, og midten er næsten stille (måske drejer den endda lidt den anden vej). Programmet drejer den som en skive, og det står i "Ærligt talt".

## Faktatjek J3: månerne (7. november 2026)

Teksterne i `js/data/sider/jupiter.js` (Månerne, Io, Europa, Ganymedes og Callisto) og underteksterne i `MÅNER` i `js/kosmos/jupiter.js`. Alle påstande er tjekket mod del 5 (punkt B1-B9, kilderne er åbnet dér). Der er ikke kørt en ny søgning på nettet, for der kom ingen nye påstande uden for faktagrundlaget. Tallene er fra NSSDC's Jovian Satellite Fact Sheet (åbnet igen 7. november 2026: radier 1.821,5, 1.560,8, 2.631,2 og 2.410,3 km, albedo 0,62, 0,68, 0,44 og 0,19).

| Påstand | Resultat | Kilde |
|---|---|---|
| Bredderne ca. 3.640, 3.120, 5.260 og 4.820 km | OK (2 × NSSDC-radius) | NSSDC |
| Io lidt større end Månen, Europa lidt mindre | OK: 1.821,5 og 1.560,8 mod Månens 1.737,4 km | NSSDC |
| Omgange: ca. 42½ t, 3½ d, 7 d og 16,7 d. Afstande 421.800, 671.100, 1,07 mio. og 1,88 mio. km | OK | Del 5, B1 og plan afsnit 3 (JPL) |
| "Næsten præcis" 4 : 2 : 1, Laplace = 180°, aldrig alle tre på linje | OK | B1 |
| Galilei 7. januar 1610 tre prikker, 13. januar fire, de første måner om en anden planet | OK | B6 |
| 115 kendte måner (april 2026) | OK | A11 |
| Io: over 150 set i udbrud, ca. 400 i alt (skøn), lava 1.300-1.600 K af sten, svovl giver farverne, Pele ca. 300 km, Voyager 1 1979, æltet op til ca. 100 m | OK (ikke "400 aktive", fælden) | B2, B1 |
| Europa: is 15-25 km (NASA), Juno ca. 29 km i ét område i 2022, kun yderlaget, hav 60-150 km, dobbelt så meget vand, induceret magnetfelt, striber over 1.000 km, en af de glatteste, intet liv fundet, Clipper april 2030 og ca. 50 forbiflyvninger | OK ("efter planen" om Clipper) | B3 |
| Ganymedes: størst, ca. 8 % bredere end Merkur, under halvt så tung (45 %), magnetfelt 1996, hav (Hubble 2015) ca. 100 km under ca. 150 km is, mere vand end Jordens have, ca. 1/3 mørk, JUICE op 2023 og frem 2031 | OK. Bane om Ganymedes er skrevet uden årstal (2034 er kun et søgeresultat) | B4 |
| Callisto: ældste overflade med flest kratere, ca. 4 mia. år, mættet, Valhalla ca. 3.800 km med ringene, svag stråling, NASA's undersøgelse af en base (HOPE), måske et hav ca. 250 km nede, ikke i resonansen | OK. Valhallas centrum er udeladt (fælden) | B5 |
| Albedoen (kun til lysstyrken i tegningen) | Io er tegnet lidt mørkere (0,46 i stedet for 0,53 gange albedoen), så tonen kan ses | NSSDC |

## Faktatjek J4: flybyen, Jupiters side, Ordbogen og citatet (7. november 2026)

Opus (høj effort) med `/faktatjek`. Teksterne: underteksterne i `TUR` i `js/kosmos/jupiter.js`, emnerne og "For nørder" på Jupiters side i `js/data/sider/jupiter.js`, syv nye ord i `js/data/ordbog.js` og citatet `galileiJupiter` i `js/data/citater.js`. Næsten alt står i del 5 med åbnede kilder, så der blev ikke sat hjælpeagenter i gang. De nye påstande er slået op direkte (NASA "Jupiter Facts" åbnet igen 7. november 2026, Wikipedia som rå wikitekst og førsteudgaven af Sidereus Nuncius på archive.org).

| Påstand | Resultat | Kilde |
|---|---|---|
| Jupiter vejer næsten 2½ gange så meget som alle de andre planeter tilsammen | OK (regnet): 317,83 Jordmasser mod 0,055 + 0,815 + 1 + 0,107 + 95,16 + 14,54 + 17,15 = 128,8. Forholdet er 2,47 | NSSDC (del 5) |
| De fire store måner fandt Galilei i januar 1610 | OK | Del 5, B6 |
| Båndene er skyer af ammoniak og vand. Lyse zoner, mørke orange bælter, der blæser hver sin vej | OK: "clouds of ammonia and water", "dark orange stripes are called belts, while the lighter bands are called zones" | NASA Jupiter Facts (åbnet) |
| Jetstrømmene holder båndene adskilt og går ca. 3.000 km ned | OK: "Strong east-west winds ... separate the bands", "about 2,000 miles (roughly 3,200 kilometers)". Juno-siden siger ca. 3.000 km | NASA Jupiter Facts (åbnet), del 5 punkt 5 |
| Den hurtigste vind ca. 540 km/t | OK: vores måling 149 m/s = 536 km/t. NASA skriver 539 km/t ved ækvator, men vi måler ca. 72 m/s ved ækvator og den hurtigste ved 24° N. Teksten siger "den hurtigste" uden at nævne ækvator | Egen måling, del 5 |
| Brinten bliver flydende under skyerne, måske halvvejs inde leder den strøm som et metal, og det laver nok magnetfeltet | OK ("Scientists think", "is thought to drive", derfor "Forskerne mener") | NASA Jupiter Facts (åbnet) |
| Kernen er større end ventet, delvis opløst og uden skarp kant (Juno) | OK: "much larger than expected, and not solid ... partially dissolved, with no clear separation" | NASA Jupiter Facts (åbnet) |
| Ca. 80 gange Jupiters masse til en stjerne, ca. 13 til en brun dværg | OK: 78,5 (Chabrier m.fl. 2023), 13,0 ± 0,8 (Spiegel m.fl. 2011) | Del 5 punkt 3 |
| Sender ca. dobbelt så meget varme ud, som den suger til sig af sollyset. Rester fra dannelsen | OK: 1,7 (gamle tal) og ca. 2,2 (regnet med Li m.fl. 2018) giver begge "ca. dobbelt". Wikipedia: "radiates more heat than it receives ... Kelvin-Helmholtz mechanism" | Del 5 punkt 3, Wikipedia "Jupiter" (rå wikitekst) |
| Li m.fl. 2018 (nørd) | **Skrevet forsigtigere:** Artiklen kunne ikke åbnes (nature.com og pubmed lukket). Tallet 7,5 W/m² er fjernet. Nu: "tyder på ... nærmere 2" | Del 5 punkt 3 (søgeresultat), Wikipedia (henvisning) |
| Jupiter er ikke det store skjold mod kometer | OK, som forslaget i del 5 | Horner & Jones 2008-2012 (del 5 punkt 4) |
| Antikyklon: med uret på den nordlige halvkugle, mod uret på den sydlige. Cyklon omvendt | OK: "High-pressure systems rotate clockwise in the Northern Hemisphere and counterclockwise in the Southern Hemisphere" | Wikipedia "High-pressure area" (rå wikitekst) |
| Ved Jupiters poler står cykloner i en ring om en i midten | OK: 8 om 1 ved nordpolen, 5 om 1 ved sydpolen. Antallet er ikke skrevet (fælden "seks ved sydpolen") | Del 5 punkt 6 |
| Over et dusin jetstrømme, den hurtigste ca. 150 m/s | OK: "over a dozen prevailing winds" | NASA Jupiter Facts, egen måling |
| Jupiters nordlys hundredvis af gange kraftigere end Jordens | OK ("hundreds of times brighter") | Del 5 punkt 7 |
| Io : Ganymedes = 4 : 1 omgange | OK (4,04) | Del 5, B1 |
| **Citatet:** "Die itaque septima Ianuarij ... tres illi adstare stellulas, exiguas quidem, veruntamen clarissimas, cognoui" | OK: læst i skanningen af førsteudgaven (Venedig 1610, side 17, Smithsonian Libraries, archive.org `Sidereusnuncius00Gali`). Det lange s er skrevet som s, ellers som i bogen. En parentes er udeladt ("(…)"), og det står som "forkortet". Den danske oversættelse er Opus' egen | Archive.org (skanningen set) |
| 13. januar så han fire, og snart forstod han, at de kredser om Jupiter | OK: "On January 13, he saw all four at once", "By January 15, Galileo concluded ... orbiting Jupiter" | Wikipedia "Galilean moons" (rå wikitekst), del 5 B6 |
| De mediceiske stjerner efter Medici i Firenze. Navnene kom senere | OK: titelbladet ("Medicea sidera"), Galilei var fra Firenze ("patritio Florentino"), Cosimo II de' Medici. Navnene valgte Simon Marius (fælden: skriv bare "senere") | Titelbladet (archive.org), Wikipedia "Galilean moons" |

**Ny fælde:** NASA skriver "up to 539 km/h at the equator", men ifølge Hubbles målinger (og vores) blæser det hurtigste ved 24° N, ikke ved ækvator.

## Faktatjek J5: polerne, nordlyset og ringene (7. november 2026)

Opus (høj effort) med `/faktatjek`. Teksterne: `POL_STOP`, `RINGE_STOP`, `POL_NU` og `RINGE_NU` i `js/kosmos/jupiter.js`, siderne `sydpol`, `nordpol` og `ringe` og de nye emner på Jupiters side i `js/data/sider/jupiter.js` og ordet "Ultraviolet lys" i `js/data/ordbog.js`. De fleste påstande stod i del 5 med åbnede kilder. Nyt: Gavriel og Kaspi 2021 (Nature Geoscience 14, 559-563, arXiv 2110.09422) og 2023 (GRL 50, doi:10.1029/2023GL103635, arXiv 2311.11917), begge åbnet som PDF på arXiv. Ingen hjælpeagenter.

| Påstand | Resultat | Kilde |
|---|---|---|
| 8 cykloner om 1 ved nordpolen, 5 om 1 ved sydpolen | OK | NASA Jupiter Facts (del 5, A6), Gavriel og Kaspi 2021 (abstract) |
| Ringene af cykloner ligger ved ca. 84° N og S | OK: "both circumpolar rings positioned along latitude ∼ 84° N/S" | Gavriel og Kaspi 2021 (åbnet) |
| Cyklonerne er ca. 4.000-7.000 km brede, størst ved sydpolen | OK: "observable diameters ... between 4,000 and 6,000 km" (Gavriel 2021). Adriani m.fl. 2018: syd 5.600-7.000, nord 4.000-4.600 (søgeresultat, del 5). "Flere tusind km" i underteksten | Gavriel 2021 (åbnet), del 5 |
| Vinden i dem op til ca. 100 m/s | OK: "velocities inside the cyclones reach up to 100 m/s" | Gavriel 2021 (åbnet), efter Grassi m.fl. 2018 |
| Én omgang på ca. 20 timer | Regnet: 2π · 900 km / 80 m/s = 19,6 t (nord), 2π · 1.100 km / 85 m/s = 22,6 t (syd), med de tal, Gavriel 2021 bruger for cyklonen i midten. Står kun i "Ærligt talt" med "regnet ud fra den målte vind" | Gavriel 2021 (åbnet) |
| Ringens cykloner vil mod polen, cyklonen i midten skubber dem tilbage | OK | NASA Jupiter Facts (del 5, A6) |
| Antallet afhænger af, hvor store cyklonerne i midten er, og hvor hurtigt de drejer | OK: "according to the size and spin of the respective polar cyclone" | Gavriel 2021 (åbnet) |
| De flytter sig nogle grader om året mod vest, og mønsteret holder i flere år | OK: "drift in the westward direction a few degrees per year", "stable over the next five years" | Gavriel og Kaspi 2023 (åbnet) |
| En sjette cyklon ved sydpolen i 2019, igen fem i 2021 | RS (som del 5: 2019 fra en søgning, 2021 åbnet) | Del 5, A6 |
| Fra Jorden ser vi Jupiter fra siden, for aksen hælder kun ca. 3°. Juno har en bane hen over polerne | OK | NSSDC (3,13°), NASA Juno |
| JIRAM ser i infrarødt (ca. 5 µm) 50-70 km ned | OK | Del 5, A6 og A9 |
| Nordlyset er hundredvis af gange kraftigere end Jordens, lyser mest i ultraviolet og infrarødt | OK | Del 5, A7 |
| En del af partiklerne kommer fra vulkanerne på Io | OK ("particles thrown into space by ... Io") | Hubble 2016 (del 5, A7) |
| Io's fodspor: der rammer magnetfeltets linjer fra Io Jupiter, og det flytter sig med Io | OK (fysikken). At alle fire store måner har et fodspor: Juno (del 5, A7) | Del 5, A7 |
| Lilla som på billederne fra Hubble | Forsigtigt: Farven er valgt (fælden i del 5, A7), og teksten siger "falsk farve" | Del 5, A7 |
| Ringene: glorie, hovedring og to svage ringe, hovedringen 123.000-128.940 km, under ca. 100 km tyk, glorien ca. 10.000 km tyk, τ ca. 5 · 10⁻⁶, 3 · 10⁻⁶ og 10⁻⁷ | OK | NSSDC (del 5, A8) |
| Opdaget af Voyager 1 i 1979, fint mørkt støv, ses næsten kun i modlys | OK | NASA Jupiter Facts (del 5, A8) |
| Støvet slås løs fra de små måner, når meteoroider rammer dem. De yderste ringe er nok lavet af Amalthea og Thebe | OK med "nok" | NASA Jupiter Facts, Juno 2026 om Thebe (del 5, A8) |
| Kun ca. 5 af hver million lysstråler rammer et støvkorn i hovedringen | Regnet: 1 − e^(−5 · 10⁻⁶) ≈ 5 · 10⁻⁶ (lodret gennem ringen) | NSSDC |
| Ultraviolet lys har kortere bølgelængde end violet, ses ikke af øjet, giver solskoldning | OK (almen fysik) | – |
| Magnetfeltets akse hælder 9,4° | OK (NSSDC). Retningen (ca. 200° V), ringens 16° og fodsporets 22° er tegnet og står kun i koden og "Ærligt talt" (forenklet ring) | NSSDC (del 5) |

**Ny fælde:** Skriv ikke en "ægte" farve på nordlyset, og skriv ikke, at Jupiters ringe kan ses med det blotte øje. Selv i modlys er de ca. 1.000 gange svagere end skyerne.
