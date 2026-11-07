*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

## B. Månerne og himlen (hjælpeagent)

Sikkerhed: **S** = sikker (officiel kilde åbnet), **RS** = rimelig sikker (én god kilde, Wikipedia eller søgeresultat), **U** = usikker (eget skøn, uenige kilder).
Alle udregninger står skrevet ud. (Scriptet blev ikke gemt i repoet.)

Fælles konstanter (alle åbnet i dag): AU = 149.597.870,7 km, Solens radius 695.700 km, Solens tilsyneladende størrelsesklasse fra Jorden −26,74 (NSSDC Sun Fact Sheet), fuldmånen −12,74 (NSSDC Moon Fact Sheet), Jupiter: ækvatorradius 71.492 km, polradius 66.854 km, hældning af aksen 3,13°, perihel 740,595 og aphel 816,363 mio. km (= 4,951 og 5,457 AU), sollys 50,26 W/m² (NSSDC Jupiter Fact Sheet). Banetal for månerne: tabellen fra JPL plus NSSDC's perioder fra koordinatoren.

---

### 1. Resonansen 1 : 2 : 4 (Laplace-resonansen)

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Sideriske omløbstider | Io 1,769138, Europa 3,551181, Ganymedes 7,154553, Callisto 16,689017 døgn | NSSDC Jovian Satellite Fact Sheet (via koordinator) | S | åbnet af koordinator |
| Middelbevægelse n = 360°/P | Io 203,4889, Europa 101,3747, Ganymedes 50,3176, Callisto 21,5711 °/døgn | udregnet | S | – |
| P_E/P_Io | 3,551181/1,769138 = **2,007** | udregnet | S | – |
| P_G/P_E | 7,154553/3,551181 = **2,015** | udregnet | S | – |
| P_G/P_Io | 7,154553/1,769138 = **4,044** | udregnet | S | – |
| P_C/P_G | 16,689017/7,154553 = 2,333 (Callisto er **ikke** med i resonansen) | udregnet | S | – |
| Laplace-relationen | n_Io − 3·n_E + 2·n_G = 203,4889 − 304,1242 + 100,6352 = **−0,00003 °/døgn ≈ 0** | udregnet | S | – |
| Synodiske perioder (tid mellem to møder) | Io–Europa 3,5255 d, Europa–Ganymedes 7,0509 d, Io–Ganymedes 2,3503 d. Bemærk: 7,0509 = 2 × 3,5255 = 3 × 2,3503 | udregnet: 1/(1/P1 − 1/P2) | S | – |
| Hvad resonansen gør | "the resonance produces a forced eccentricity since the satellites line up with each other at the same points in their orbits over and over, giving each other a small gravitational tug that keeps their orbits from becoming circular" | NASA, science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/ | S | åbnet |
| Følgen for Io | Afstanden til Jupiter skifter, så Io klemmes; overfladen hæver og sænker sig op til ca. 100 m | NASA Io Facts (science.nasa.gov/jupiter/jupiter-moons/io/facts/) | S | åbnet |

**Hvorfor de tre aldrig står på linje på samme side:** Laplace-vinklen φ = λ_Io − 3·λ_E + 2·λ_G (λ = månens position i banen) svinger kun lidt omkring 180° (det er derfor, at hastighederne opfylder relationen ovenfor). Udregnet:
- Når Io og Europa er på linje (λ_Io = λ_E = λ): φ = 2·(λ_G − λ) = 180°, så Ganymedes står **90°** væk.
- Når Europa og Ganymedes er på linje (λ_E = λ_G = λ): φ = λ_Io − λ = 180°, så Io står på **den modsatte side** af Jupiter.
- Alle tre på samme side (λ_Io = λ_E = λ_G) ville give φ = 0°. Det sker aldrig.
(Amplituden for svingningen omkring 180° har jeg ikke slået op, så den er udeladt.)

Forslag: "Hver gang Ganymedes går én tur om Jupiter, går Europa to og Io fire. De giver hinanden små ryk med tyngdekraften igen og igen på de samme steder, og derfor kan banerne ikke blive helt runde. Io bliver æltet som en dej og bliver varm indeni."
Ny fælde: JPL's kolonne "P" i sats/elem er ikke omløbstiden (Io 1,762732 ≠ 1,769138). Forholdene er ca. 2 (2,007 og 2,015), ikke præcis 2, og "4 omgange" er 4,04. Skriv "næsten præcis".

---

### 2. Io

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Mest vulkanske sted | "the most volcanically active world in the solar system, with hundreds of volcanoes" | NASA Io-side og Io Facts | S | åbnet |
| Antal vulkaner i alt | "the estimated 400 volcanoes" (skøn) | NASA-nyhed om Juno, www.nasa.gov/?p=813301 (jan. 2025) | S (som skøn) | åbnet |
| Aktive vulkaner set | "more than 150 active volcanoes" set af rumsonder og fra Jorden. "up to 400 such volcanoes are predicted" | Wikipedia "Volcanism on Io" | RS | åbnet |
| Junos JIRAM-kort | 242 varme pletter (hot spots), heraf 23 nye (Zambon m.fl. 2023, GRL). Et konferenceresumé fra 2022 siger 24 nye. Over halvdelen af de nye ligger over 70° bredde | INAF/DOAJ (søgeresultat) | RS | kun søgeresultat |
| Første tegn på vulkaner | Voyager 1, 1979 (Linda Morabito så Pele-skyen) | NASA Io-side, Wikipedia | S | åbnet |
| Loki Patera | Største vulkanske lavning, **202 km** i diameter, med en lavasø. Søens areal ca. **20.000 km²** | Wikipedia "Loki Patera" (diameter), NASA-nyhed (areal) | RS/S | åbnet |
| Loki, Juno 2023-24 | Juno fløj forbi 30. dec. 2023 og 3. feb. 2024 (ca. 1.500 km). JIRAM så en bølge, der fornyer skorpen med 2-3 km/døgn, og mindst 20 små øer (ca. 3 km) | Wikipedia (Volcanism on Io, Loki), NASA-nyhed (1.500 km) | RS | åbnet |
| Pele-skyen | ca. **300 km** høj og 1.200 km bred (Voyager 1, 1979). Galileo målte 300-426 km (1996 og 2000) | Wikipedia "Pele (volcano)" | RS | åbnet |
| Tvashtar | Sky på 385 km (Galileo, 2000). New Horizons så en sky på **330 km** den 26. feb. 2007 | Wikipedia "Tvashtar Paterae" | RS | åbnet |
| Udbruddet i dec. 2024 | Set af JIRAM den **27. dec. 2024** (afstand 74.400 km) nær sydpolen. "larger than Earth's Lake Superior", ca. **100.000 km²**, over **80 billioner watt** (80 TW), "six times the total energy of all the world's power plants", "the most powerful volcanic event ever recorded" på Io. Ikke navngivet | NASA-nyhed www.nasa.gov/?p=813301 og photojournal "Massive Hot Spot on Io" | S | åbnet |
| Samme udbrud, senere analyse | ca. 73° S, 140° Ø, ca. **65.000 km²** og **140-260 TW** | Wikipedia (citerer en senere artikel, ikke åbnet) | U | åbnet (Wikipedia) |
| Lavaens temperatur | 1.300-1.600 K, mest silikatlava (basalt), ikke svovl | Wikipedia "Volcanism on Io" | RS | åbnet |
| Farverne | gul, rød, hvid, sort og grøn, "largely due to allotropes and compounds of sulfur". Overfladen er domineret af svovl og frost af svovldioxid | Wikipedia "Io (moon)" | RS | åbnet |
| Skyer fra vulkaner | Kun et par dusin af de ca. 150 aktive vulkaner har haft en sky | Wikipedia "Volcanism on Io" | RS | åbnet |
| USGS' farvemosaik (ClrMerge) | **Forstærkede, ikke ægte farver.** Farven kommer fra Galileo-billeder i violet, grøn og nær-infrarød (756 nm): "false color mosaic … The true colors that would be visible to the eye are similar but much more muted than shown here." Den sammensatte mosaik lægger Galileos farveforhold oven på det skarpere sort-hvide kort, så hvor overfladen ændrede sig mellem Voyager og Galileo (fx Kanehekili), passer farven ikke | astrogeology.usgs.gov/search/map/io_galileo_ssi_global_color_merge_mosaic_1km og …/io_galileo_ssi_voyager_color_merged_global_mosaic_1km | S | åbnet |

Forslag: "Io er det sted i solsystemet med flest udbrud. Man kender omkring 150 vulkaner, der har været i udbrud, og forskerne regner med, at der er omkring 400 i alt. Den gule og røde farve kommer fra svovl. På kortet er farverne gjort stærkere, end øjet ville se dem."
Nye fælder: (a) Wikipedias Io-artikel skriver "over 400 active volcanoes". Det blander de kendte og de aktive sammen, så brug ikke tallet. (b) Varme pletter (242) er ikke det samme som vulkaner. (c) Lavaen er mest smeltet sten, ikke smeltet svovl. Svovl giver farverne. (d) Udbruddet i 2024 var på ca. 100.000 km² ifølge NASA og ca. 65.000 km² ifølge en senere analyse. Skriv "større end Lake Superior" eller "større end Danmark" (Danmark er ca. 43.000 km², ikke slået op i dag).

---

### 3. Europa

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Isskorpen (NASA's skøn) | "10 to 15 miles (15 to 25 kilometers) thick" | NASA Europa Facts (europa-facts) og "Europa: A World of Ice…" | S | åbnet |
| Isskorpen (Juno) | ca. **29 km** (18 miles) i gennemsnit i det område, der blev målt. Målt med mikrobølgeradiometeret (MWR) ved forbiflyvningen **29. sep. 2022** (360 km over overfladen, ca. halvdelen af månen set). Offentliggjort 17. dec. 2025 i Nature Astronomy (Levin m.fl.). NASA-nyhed 27. jan. 2026. Gælder det kolde, stive yderlag. Med et varmere lag under kan skorpen være tykkere, og med lidt salt ca. 5 km (3 miles) tyndere | www.nasa.gov/missions/juno/nasas-juno-measures-thickness-of-europas-ice-shell/ | S | åbnet |
| Havets dybde | "40 to 100 miles (60 to 150 kilometers)" | NASA Europa Facts | S | åbnet |
| Mængden af vand | "twice as much water as Earth's global ocean". Wikipedia skriver "two or three times" | NASA Europa-side og "Why Europa" | S | åbnet |
| Beviset for havet | Galileo målte et induceret magnetfelt, "still the best evidence" | NASA Europa Facts | S | åbnet |
| Linjerne (lineae) | Mørke, rødlige striber, nogle over 1.000 km lange. Kanterne er flyttet i forhold til hinanden. De største bånd er over 20 km brede | NASA Europa Facts, Wikipedia | S/RS | åbnet |
| Kaosområder | Opbrudte isflager i mørkt materiale, "like icebergs in a frozen sea" (fx Conamara Chaos). Om de dannes, når havet smelter op, er omdiskuteret | Wikipedia "Europa (moon)" | RS | åbnet |
| Fontæner (plumes) | Hubble: "tentative detections" i 2013, 2016 og 2017. Webb fandt intet (2023), men det udelukker dem ikke | NASA Webb-nyhed om kulstof på Europa | S (at det er usikkert) | åbnet |
| Glat overflade | Ingen store bjerge eller kratere, "the smoothest known solid object" | Wikipedia, NASA Facts ("smoothest body") | RS | åbnet |
| Liv | Ikke fundet. NASA: "one of the most promising places … to look for life" | NASA | S | åbnet |
| Europa Clipper | Opsendt **14. okt. 2024** (Falcon Heavy), forbi Mars **1. marts 2025**, forbi Jorden **3. dec. 2026**, i bane om Jupiter **11. april 2030**. Ca. 50 forbiflyvninger af Europa, helt ned til 25 km | NASA photojournal "Europa Clipper's Trajectory to Jupiter", Mission Overview | S | åbnet |
| USGS-mosaikken (500 m) | Billeder fra "20 km/pixel for gap fill to as high as 200 meters per pixel". **Hul ved sydpolen syd for −83°.** Kun ca. 20 km/pixel ved nordpolen og mange høje bredder. USGS giver ingen procent for, hvor meget der er skarpt | astrogeology.usgs.gov/search/map/europa_voyager_galileo_ssi_global_mosaic_500m | S | åbnet |
| Hvor meget Galileo så skarpt | "less than 10% … imaged at better than 250 m/pixel" (Greeley m.fl. 2009). Clippers krav: mindst 80 % ved 100 m/pixel eller bedre | Space Science Reviews-tillæg (Springer) | RS | kun søgeresultat (Springer er lukket) |

Forslag: "Under isen på Europa er der et hav med salt vand, og der er nok dobbelt så meget vand som i alle Jordens have. Isen er mindst 15-25 km tyk, og Juno målte ca. 29 km et sted. Ingen ved endnu, om der er liv."
Nye fælder: (a) Junos 29 km gælder ét område og det kolde yderlag, ikke hele skorpen. (b) Fontænerne er ikke bekræftet. (c) Clipper ankommer 11. april 2030, ikke "april 2030 = 1. april".

---

### 4. Ganymedes

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Største måne | "the largest moon in our solar system, bigger than the planet Mercury and dwarf planet Pluto" | NASA Ganymede Facts | S | åbnet |
| Større end Merkur | Radius 2.631,2 km mod 2.439,7 km: 2.631,2/2.439,7 = 1,078, så **ca. 8 % større** i diameter (5.262 mod 4.879 km). Men kun 45 % af Merkurs masse | udregnet, Wikipedia (masse) | S/RS | åbnet |
| Titan | Titan er også større end Merkur, men Ganymedes er størst (Voyager viste det i 1979) og lidt tungere | Wikipedia "Ganymede (moon)" | RS | åbnet |
| Eget magnetfelt | Eneste måne med eget magnetfelt, opdaget af Galileo i **1996**. Giver nordlys | NASA Ganymede Facts | S | åbnet |
| Havet | Hubble så nordlyset vugge (hold ledet af Joachim Saur, Köln) og fandt et hav. Offentliggjort i marts 2015. Havet er ca. 100 km dybt under ca. 150 km is, "more water than all the water on Earth's surface" | NASA Ganymede Facts, Wikipedia (marts 2015) | S/RS | åbnet |
| Mørke og lyse egne | Mørkt, gammelt land med mange kratere (ca. 1/3 af overfladen) og lysere, yngre land med riller og rygge. Galileo Regio er et stort mørkt område | Wikipedia | RS | åbnet |
| Juno | Forbiflyvning **7. juni 2021** (Junos 34. tur tæt på Jupiter) | NASA Ganymede Facts | S | åbnet |
| JUICE | Opsendt **14. april 2023**, ankommer til Jupiter **juli 2031**, i bane om Ganymedes **december 2034**, slut sept. 2035 | ESA Juice-side og faktaark (2031, åbnet). ESA's "Juice mission milestones" (2034, søgeresultat) | S (2031)/RS (2034) | åbnet/søgeresultat |

Forslag: "Ganymedes er den største måne i solsystemet. Den er større end planeten Merkur, men vejer mindre, fordi den for en stor del er is. Som den eneste måne har den sit eget magnetfelt."
Ny fælde: "Større end Merkur" gælder størrelsen, ikke massen. ESA siger "orbital tour of Ganymede" og nævner ikke 2034 på faktaarket.

---

### 5. Callisto

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Ældste overflade og flest kratere | "the oldest and most heavily cratered in our solar system", ca. 4 mia. år | NASA Callisto Facts | S | åbnet |
| Mætning | Kraterne ligger så tæt, at et nyt krater sletter et gammelt | Wikipedia "Callisto (moon)" | RS | åbnet |
| Valhalla | Største bassin med ringe på Callisto og i solsystemet, **op til ca. 3.800 km** i diameter. Lyst centrum på ca. 360 km (Wikipedia om Callisto skriver 600 km). Ringene når ud til ca. 1.800-1.900 km fra centrum. Ligger ca. 18° N, 57° V på den side, der vender frem i banen. Opdaget af Voyager 1 i 1979 | Wikipedia "Valhalla (crater)" | RS | åbnet |
| Muligt hav | Måske ca. 250 km under overfladen, "or may not exist at all" | NASA Callisto Facts | S | åbnet |
| Stråling | Ligger lige uden for Jupiters stærkeste strålingsbælte. Ca. 300 gange mindre partikelstråling end ved Europa, ca. 0,01 rem (0,1 mSv) pr. døgn | Wikipedia | RS | åbnet |
| Base | NASA's undersøgelse HOPE (2003) valgte Callisto til en mulig base for mennesker | Wikipedia | RS | åbnet |
| Bunden rotation | "the same side of Callisto is always facing Jupiter" | NASA Callisto Facts | S | åbnet |

Forslag: "Callisto er fuld af kratere, og overfladen har næsten ikke ændret sig i 4 milliarder år. Strålingen er meget svagere end ved de andre måner, så forskere har foreslået Callisto som et sted, hvor mennesker en dag kunne bygge en base."
Ny fælde: Wikipedias to artikler er uenige om Valhallas lyse centrum (360 eller 600 km). Brug "ca. 3.800 km med ringene" og drop tallet for centrum.

---

### 6. Opdagelsen

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Første observation | **7. januar 1610** så Galilei tre "stjerner" ved Jupiter: Ganymedes, Callisto og Io og Europa som én prik. **8. januar** kunne han skille Io fra Europa | NASA Io Facts, Ganymede Facts, Callisto Facts, Wikipedia "Galilean moons" | S | åbnet |
| De følgende nætter | **13. januar** så han alle fire på én gang. **15. januar** konkluderede han, at de kredser om Jupiter | Wikipedia "Galilean moons" | RS | åbnet |
| Sidereus Nuncius | Udgivet **13. marts 1610** (dedikationsbrevet er dateret 12. marts). Kaldte månerne de mediceiske stjerner | Wikipedia "Sidereus Nuncius" og "Galilean moons" | RS | åbnet |
| Simon Marius' krav | Mundus Iovialis (1614): påstod at have set dem først (første notat 29. dec. 1609). Han brugte den julianske kalender, så datoen svarer til **8. jan. 1610** i den gregorianske, dagen efter Galilei. En hollandsk komité gav ham i 1903 ret i, at han fandt dem uafhængigt | Wikipedia "Galilean moons", "Simon Marius" | RS | åbnet |
| Navnene | Foreslået af Marius i Mundus Iovialis (1614) efter et forslag fra **Kepler** (de mødtes i Regensburg i okt. 1613). Galilei brugte numrene I-IV. Navnene blev almindelige i 1800-tallet (NASA) eller i 1900-tallet (Wikipedia) | Wikipedia, NASA Io Facts | RS | åbnet |

Forslag: "Den 7. januar 1610 så Galileo Galilei tre små prikker ved Jupiter gennem sin kikkert. Nætterne efter flyttede de sig, og den 13. januar så han fire. Det var de første måner, man fandt om en anden planet end Jorden."
Ny fælde: "Io blev opdaget 8. januar" (NASA) og "alle fire 7. januar" (NASA om Ganymedes og Callisto) er begge rigtige: den 7. var Io og Europa én prik. Hvornår navnene blev almindelige, er de to kilder uenige om, så skriv bare "senere".

---

### 7. Himlen fra hvert stop

Månerne har næsten ingen atmosfære, så himlen er sort, også om dagen.

#### 7a. Solen set fra Jupiter

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Vinkeldiameter | 2·asin(695.700 / (5,204 · 149.597.871)) = **0,102°** (fra Jorden 0,533°). Varierer 0,098-0,108° (aphel/perihel) | udregnet | S | – |
| Lysstyrke | 1/5,204² = 1/27,1 = **3,7 %** af lyset ved Jorden (4,1 % i perihel, 3,4 % i aphel). 1.361 W/m² / 27,1 = **50,3 W/m²** (NSSDC: 50,26) | udregnet, NSSDC | S | åbnet |
| Størrelsesklasse | −26,74 + 5·log₁₀(5,204) = −26,74 + 3,58 = **−23,16** | udregnet | S | – |
| I forhold til fuldmånen | −12,74 − (−23,16) = 10,42 klasser → 10^(0,4·10,42) ≈ **14.700 gange lysere** end fuldmånen set fra Jorden | udregnet | S | – |

Forslag: "Fra Jupiter er Solen kun en femtedel så bred som hjemmefra, en lille skarp skive. Lyset er 27 gange svagere, men Solen lyser stadig næsten 15.000 gange stærkere end fuldmånen."
Fælde: Skriv ikke, at der er mørkt som om natten. Det svarer nok til en overskyet dag (U, ikke målt i lux).

#### 7b. Jupiter set fra månerne

Udregning: vinkel = 2·asin(R_J / a). Polen: R = 66.854 km. Månen 0,52°.

| Måne | Jupiter (ækvator) | (pol) | Fra punktet lige under Jupiter | Svinger pga. aflang bane | × Månen | Kilde | Sikkerhed |
|---|---|---|---|---|---|---|---|
| Io | **19,5°** | 18,2° | 19,6° | 19,4-19,6° | 38 | udregnet | S |
| Europa | **12,2°** | 11,4° | 12,3° | 12,1-12,3° | 24 | udregnet | S |
| Ganymedes | **7,7°** | 7,2° | 7,7° | 7,65-7,67° | 15 | udregnet | S |
| Callisto | **4,35°** | 4,07° | 4,36° | 4,32-4,38° | 8 | udregnet | S |

(× Månen er i bredden. I areal er det i anden potens: fra Io fylder Jupiter ca. 38² ≈ 1.400 gange så meget af himlen som Månen.)

**Bunden rotation:** Alle fire vender altid samme side mod Jupiter (NASA: Io "always points the same side toward Jupiter", Callisto "tidally locked", NSSDC markerer alle fire med "S" for synkron). Derfor står Jupiter **næsten stille** på himlen. Den vugger lidt frem og tilbage, fordi banen er en smule aflang: ca. ±2e radianer = Io ±0,46°, Europa ±1,0°, Ganymedes ±0,1°, Callisto ±0,8° (RS, en forenklet formel for libration i længde). Fra bagsiden ses Jupiter aldrig. Jupiter har faser: Den er "fuld", når månen står mellem Solen og Jupiter, og "ny", når månen er bag Jupiter. Én fase-runde varer et soldøgn på månen.

Soldøgn (bunden rotation): 1/(1/P − 1/P_Jupiter), P_Jupiter = 4.332,59 d: Io **42,5 t**, Europa **85,3 t**, Ganymedes **172 t** (7,2 d), Callisto **402 t** (16,8 d). NASA bekræfter Ios 42,5 t.

**Solformørkelse hver omgang:** Jupiters kerneskygge er R_J/(R_Sol − R_J) · 778,5 mio. km ≈ 89 mio. km lang, så den er næsten lige så bred som Jupiter ved alle månerne. Varighed (midt igennem) = 2·R_J / v, v = 2πa/P: Io ca. **2,3 t**, Europa 2,9 t, Ganymedes 3,6 t, Callisto 4,8 t (Callisto slipper i nogle år, se punkt 8). Fra punktet under Jupiter forsvinder Solen bag Jupiter én gang hver omgang.

Forslag: "Fra Io fylder Jupiter 19 grader af himlen. Det er 38 gange så bredt som Månen hos os. Jupiter flytter sig næsten ikke, fordi Io altid vender samme side mod den."
Fælde: Det med "38 gange" er bredden, ikke arealet.

#### 7c. Månerne set fra hinanden og fra Jupiter

Udregning: 2·atan(r / afstand). Nærmeste afstand = forskellen i a (cirkelbaner), fjerneste = summen.

| Set fra → ses | Nærmest | Fjernest | Kilde | Sikkerhed |
|---|---|---|---|---|
| Io → Europa | 249.300 km → **0,72°** | 0,16° (9,8′) | udregnet | S |
| Io → Ganymedes | 648.600 km → 0,47° | 0,20° | udregnet | S |
| Io → Callisto | 1.460.900 km → 0,19° | 0,12° | udregnet | S |
| Europa → Io | 249.300 km → **0,84°** (større end Månen hos os) | 0,19° | udregnet | S |
| Europa → Ganymedes | 399.300 km → **0,76°** | 0,17° | udregnet | S |
| Europa → Callisto | 1.211.600 km → 0,23° | 0,11° | udregnet | S |
| Ganymedes → Io | 0,32° | 0,14° | udregnet | S |
| Ganymedes → Europa | 0,45° | 0,10° | udregnet | S |
| Ganymedes → Callisto | 812.300 km → 0,34° | 0,09° | udregnet | S |
| Callisto → Io / Europa / Ganymedes | 0,14° / 0,15° / 0,37° | 0,09° / 0,07° / 0,10° | udregnet | S |
| Fra Jupiters skytoppe (månen lige over hovedet, afstand a − R_J) | Io **0,60°** (1,15 × Månen), Europa 0,30°, Ganymedes 0,30°, Callisto 0,15° | – | udregnet | S |

Konklusion: Selv på det fjerneste er hver måne mindst 4-12 bueminutter (0,07-0,20°) bred set fra de andre. Det er **små skiver, ikke prikker** (øjet kan skelne ca. 1 bueminut, RS). På det nærmeste er de på størrelse med eller større end Månen hos os. De har også faser.

Forslag: "Fra Europa kan Io se større ud end Månen hjemmefra, og den har faser ligesom Månen."
Fælde: Afstandene gælder cirkelbaner i samme plan. Den nærmeste afstand nås kun, når de to måner er på linje på samme side.

#### 7d. Jorden og Saturn set fra Jupiter

| Størrelse | Værdi | Kilde | Sikkerhed | Åbnet/søgeresultat |
|---|---|---|---|---|
| Jordens største afstand fra Solen på himlen | asin(1/5,204) = **11,1°** (10,6° i aphel, 11,7° i perihel) | udregnet | S | – |
| Jordens lysstyrke ved største afstand fra Solen | Afstand √(5,204² − 1) = 5,11 AU, halv fase. V ≈ −3,99 (NSSDC V(1,0)) + 5·log₁₀(5,11) + 2,5·log₁₀(π) ≈ −3,99 + 3,54 + 1,24 ≈ **+0,8** (som en ret lys stjerne) | udregnet med en forenklet fasefunktion | U | NSSDC åbnet |
| Ses Jorden? | En lys prik meget tæt på Solen (højst 11°). I teorien synlig på den sorte himmel, når Solen er under horisonten eller skjult, men den er aldrig højt på nattehimlen. Den ses aldrig som en blå skive | eget skøn | RS | – |
| Saturn | Afstand 9,537 − 5,204 = 4,33 AU (nærmest) til 14,74 AU (fjernest). V ≈ −8,91 + 5·log₁₀(9,537·4,333) ≈ **−0,8** nærmest og ca. +1,8 fjernest (uden ringene, som gør den lysere) | udregnet, NSSDC Saturn V(1,0) = −8,91 | RS | åbnet |

Forslag: "Fra Jupiter er Jorden en lille lysende prik, der altid står tæt på Solen. Saturn ser du tydeligt som en af de klareste 'stjerner' på himlen."
Fælde: Undgå at skrive "man kan se Jorden som en blå prik". Den er svær at se så tæt på Solen.

---

### 8. Månernes skygger på Jupiter og formørkelser

Princip: Skyggen rammer Jupiter, hvis den nord-syd-forskydning, der kommer af Solens hældning set fra Jupiter (abs(B) ≤ 3,13° + banens hældning), er mindre end Jupiters polradius plus månens radius. Udregnet a·sin(3,13° + i):

| Måne | Største forskydning | Grænse (R_pol + r) | Skygge på Jupiter | Kilde | Sikkerhed |
|---|---|---|---|---|---|
| Io (i = 0,04°) | 421.800·sin 3,17° = 23.300 km | 68.700 km | **hver omgang** (hver 42,5 t). Muligt op til abs(B) < 9,4° | udregnet | S |
| Europa (i = 0,47°) | 42.100 km | 68.400 km | hver omgang (3,55 d) | udregnet | S |
| Ganymedes (i = 0,18°) | 61.800 km | 69.500 km | hver omgang, men nær polen, når abs(B) er størst | udregnet | S |
| Callisto (i = 0,19°) | 109.000 km | 69.300 km | **kun når abs(B) < ca. 2,1°** | udregnet | S |

Callisto: Andelen af tiden med abs(B) < 2,1° er 4·asin(2,11/3,13)/360° ≈ 0,47. Det giver to perioder på ca. 2,8 år med skygger pr. Jupiter-år (11,86 år) og pauser på ca. 3,1 år. Søgeresultater (Universe Today, Sky & Telescope, ikke åbnet): skiftevis ca. 3 år med og 3 år uden. Den nuværende periode varer fra 20. maj 2025 til 5. aug. 2028 (RS). Det samme gælder, når Callisto går ind i Jupiters skygge (formørkelse): I pauserne går den over eller under skyggen.

Skyggernes størrelse på Jupiter (kerneskygge ≈ 2r − 2·(a − R_J)·tan 0,051°, halvskygge = 2r + det samme): Io ca. 3.000 km kerne / 4.300 km i alt, Europa ca. 2.050 / 4.200 km, Ganymedes ca. 3.500 / 7.000 km, Callisto ca. 1.600 / 8.100 km. **Callistos skygge er den mest uskarpe.** Ios er den skarpeste (U-RS, enkel geometri).

Forslag: "Næsten hver gang Io går rundt om Jupiter, ses dens skygge som en sort prik på skyerne. Callisto er så langt ude, at dens skygge i nogle år går forbi Jupiter."
Ny fælde: En søgekilde siger, at Callisto misser, fordi dens bane hælder anderledes. Det er forkert. Den egentlige grund er afstanden kombineret med Jupiters akse på 3,1°, så Solen står lidt nord eller syd for månernes baneplan. To eller tre skygger på samme tid er sjældne.

---

### 9. Billederne fra USGS

Alle beskrivelser er åbnet på astrogeology.usgs.gov (de gamle adresser med store bogstaver giver 404, så brug navnene nedenfor). Projektion: Simple Cylindrical (ækvidistant, breddegrad −90 til 90 lineært). Længdegraden er i alle fem **"Positive West"**, dvs. vestlig længde, der vokser mod venstre i billedet (PDS3-label: WESTERNMOST til venstre, EASTERNMOST til højre).

| Mosaik (side på astrogeology.usgs.gov/search/map/…) | Fil (planetarymaps.usgs.gov/mosaic/) | Størrelse | Opløsning | Længdegrad | Midten | Huller og svage egne | Licens | Sikkerhed |
|---|---|---|---|---|---|---|---|---|
| io_voyager_galileo_ssi_global_mosaic_1km | Io_GalileoSSI-Voyager_Global_Mosaic_1km.tif | 65,5 MB, 11.445 × 5.723, 8 bit, 1 bånd (gråtoner) | 1 km/px. Billederne er 1-10 km/px ved ækvator, dårligst omkring 50° V | Positive West, −180 til 180 | **0°** (punktet under Jupiter). Venstre kant 180° V, højre kant 180° Ø | Siden mod Jupiter er dårligst set af Galileo, men Voyager 1 dækker 240° V-40° V. Små huller ved polerne | public domain, brug "None" | S |
| io_galileo_ssi_voyager_color_merged_global_mosaic_1km (ClrMerge) | Io_GalileoSSI-Voyager_Global_Mosaic_ClrMerge_1km.tif | 196,6 MB, 11.445 × 5.723, 3 bånd | 1 km/px (farven er grovere: 1,3-21 km/px) | Positive West, −180 til 180 | **0°** | Farven mangler inden for ca. 5° af polerne (fyldt ud ved interpolation). Farve fra Galileo oven på Voyager-detaljer, så den passer ikke, hvor overfladen har ændret sig (Kanehekili). Forstærkede farver | public domain | S |
| (io_galileo_ssi_global_color_merge_mosaic_1km) | Io_Galileo_SSI_Global_Mosaic_ClrMerge_1km.tif | samme byte-størrelse 196.637.696 (måske samme fil) | – | −180 til 180 | 0° | "false color … true colors … much more muted" | public domain | S |
| europa_voyager_galileo_ssi_global_mosaic_500m | Europa_Voyager_GalileoSSI_global_mosaic_500m.tif | 192,8 MB, 19.631 × 9.816, 8 bit, gråtoner | 500 m/px (billederne er 200 m-20 km/px) | Positive West, 0 til 360 | **180° V** (siden væk fra Jupiter). Venstre kant 360° V, højre kant 0° | **Ingen data syd for −83°.** Kun ca. 20 km/px ved nordpolen og mange høje bredder. Kugle med r = 1.562,09 km | "Access Constraints: None" | S |
| ganymede_voyager_galileo_ssi_global_mosaic_1km | Ganymede_Voyager_GalileoSSI_global_mosaic_1km.tif | 136,8 MB, 16.539 × 8.270, gråtoner | 1 km/px (billederne er 180-400 m til 20 km/px) | Positive West, 0 til 360 | **180° V** | Grove dele fyldt ud med 20 km/px. Ingen procent opgivet. (Der findes også en farvemosaik på 1,4 km/px, og dens "color … was enhanced using commercial software") | public domain | S |
| callisto_galileo_voyager_global_mosaic_1km | Callisto_Voyager_GalileoSSI_global_mosaic_1km.tif | 114,6 MB, 15.138 × 7.569, gråtoner | 1 km/px i snit (billederne er 150-400 m til **60 km/px**) | Positive West, 0 til 360 | **180° V** | Huller er fyldt ud med op til 60 km/px, så nogle egne er meget slørede. "enhanced using commercial software" | public domain | S |

Credit: Siderne nævner "USGS Astrogeology Science Center" som forfatter og "Planetary Data System" eller RAND/USGS-forskere som ophav. Data fra NASA's Galileo og Voyager. Forslag til credit i KILDER.md: "NASA/JPL/USGS Astrogeology Science Center (Galileo SSI og Voyager)" (RS: formuleringen er ikke angivet på siderne, men alle er public domain eller uden begrænsninger).

For koden: Ved bunden rotation ligger længde 0° midt på den side, der vender mod Jupiter, og 180° V på bagsiden. 90° V er forsiden (den vender frem i banen) og 270° V bagsiden i bevægelsesretningen (RS, IAU-konvention, ikke åbnet i dag). For Europa, Ganymedes og Callisto er midten af billedet altså bagsiden (væk fra Jupiter). For Io er midten den side, der vender mod Jupiter. Kortene skal måske flyttes 180° i forhold til hinanden, når de lægges på en kugle.

Ny fælde: Positive West betyder, at længdegraden **falder** mod højre i billedet. Lægger man det på en kugle, der drejer mod øst, skal kortet ikke spejlvendes, men 0° skal pege mod Jupiter. Tjek det med et kendt punkt (fx Valhalla ca. 18° N, 57° V på Callisto, Pele på Io).

---

### Mindst sikre påstande

1. Udbruddet på Io i dec. 2024: NASA siger 100.000 km² og over 80 TW. En senere analyse (via Wikipedia, ikke åbnet) siger 65.000 km² og 140-260 TW. Brug "større end Lake Superior" og "det kraftigste set på Io".
2. Antal aktive vulkaner: "over 150 set" (Wikipedia) og "ca. 400 i alt" (NASA's skøn). JIRAM: 242 varme pletter (søgeresultat). Bland dem ikke sammen.
3. Jordens lysstyrke set fra Jupiter (ca. +0,8) og Saturns (ca. −0,8): eget skøn med en enkel fasefunktion.
4. Libration (±0,1-1°) og skyggernes størrelse på Jupiter: enkle formler, ikke slået op.
5. JUICE i bane om Ganymedes i dec. 2034: kun søgeresultat fra ESA (2031 er åbnet).
6. Under 10 % af Europa skarpere end 250 m/px: kun søgeresultat (Springer er lukket).
7. Valhallas lyse centrum: 360 eller 600 km (Wikipedia er uenig med sig selv). Hele bassinet "op til ca. 3.800 km" er RS.
8. Hvornår månernes navne blev almindelige (1800-tallet hos NASA, 1900-tallet hos Wikipedia).
9. Callistos skyggeperiode 20. maj 2025 til 5. aug. 2028: kun søgeresultat (Universe Today).
10. Junos isskorpe på 29 km gælder det kolde yderlag i ét område. Den samlede skorpe kan være tykkere.

### Kilder, der ikke kunne åbnes eller ikke blev forsøgt

- www.jpl.nasa.gov (403 ifølge koordinatoren). Juno-nyheden er i stedet læst på www.nasa.gov/?p=813301.
- Space Science Reviews-tillægget (media.springernature.com) om Europa-dækningen: kun søgeresultat.
- Zambon m.fl. 2023 (GRL, Wiley lukket) og openaccess.inaf.it: kun søgeresultat.
- Universe Today og Sky & Telescope om Callistos skygger: kun søgeresultat.
- ESA's "Juice mission milestones" (2034): kun søgeresultat.
- Wikipedia-API'et afviste først kald, fordi der blev sendt for mange for hurtigt. Det lykkedes med pauser.
- De gamle USGS-adresser (`/search/map/Io_GalileoSSI-Voyager_Global_Mosaic_1km` osv.) giver 404. De rigtige sider har små bogstaver (se tabellen i punkt 9).
- Ingen store TIF-filer blev hentet (kun `curl -sI` for størrelsen).

