# Plan: Uranus og Neptun (isgiganterne)

*Skrevet 7. november 2026 efter jeres go ("fortsæt") til planen. Der er ikke sagt go til at bygge. Tallene og kilderne står i [fakta-solsystemet/del6-uranus-og-neptun.md](fakta-solsystemet/del6-uranus-og-neptun.md). Rammen er jeres beslutninger fra 5. november 2026 ([plan-solsystemet.md](plan-solsystemet.md), afsnit 9): en fast pakke pr. planet, filmisk overgang, ingen fælles verden og de store måner som små kugler med rigtige kort. Skabelonen er [plan-jupiter.md](plan-jupiter.md). Domænerne blev åbnet samme dag.*

## Kort fortalt
- **De to planeter ligner hinanden** (samme størrelse, samme farve, samme slags ringe og luft), så de deler værktøj, shader og ringkode. De bygges som to visninger efter hinanden, ligesom Saturn og Jupiter.
- **Der findes ingen skarpe kort.** Hubbles kort har 2 pixel pr. grad (720 rundt), og Voyager 2 er den eneste sonde, der har været der. Overfladen bygges derfor af **målte bånd** (lysstyrke og farve for hver breddegrad fra Hubble) og **målte vinde**. Detaljerne er tegnet af shaderen, og det siges ærligt.
- **Uranus' wow:** Den ligger på siden. En skyder for årene viser, hvordan hver pol har sol i 42 år og mørke i 42 år. Ringene og månerne kredser om Uranus som en skydeskive, og ringene er mørke som kul.
- **Neptuns wow:** Solsystemets hurtigste vinde, hvide skyer, der kaster skygge, Den Store Mørke Plet fra 1989, de mærkelige ringbuer og Triton, der kredser baglæns.
- **Farverne:** de ægte farver (næsten ens for de to) og en kontakt med "Voyagers blå" fra 1989, så man kan se myten.
- **Delopgaver:** UN1-UN6, hver med sit eget go. Ca. 6-8 sessioner. Opus med høj effort.
- **Seks spørgsmål til jer** står sidst.

## 0. Kilderne (tjekket med curl 7. november 2026)
| Hvad | Kilde | Status | Licens |
|---|---|---|---|
| **Kortene, nu** | Hubble OPAL: Uranus cyklus 33 (23.-24. okt. 2025, to omgange), Neptun cyklus 32 (24.-25. aug. 2025). Farvebillede og FITS i 7-8 filtre, 721 × 361 | Åben (curl kræver emSign-roden, se erfaringerne) | CC BY 4.0, NASA/ESA/A. Simon (OPAL) |
| **Kortene, år for år** | OPAL fra 2014 (cyklus 22) og frem for begge planeter | Åben | CC BY 4.0 |
| Solar System Scope | Uranus er helt glat. Neptun er Voyagers forstærkede farver med Den Store Mørke Plet (1989) | Åben (med en ærlig User-Agent) | CC BY 4.0. Kun som kilde til pletten fra 1989, se spørgsmål 3 |
| **Triton** | USGS, farver, hele kloden med udfyldte huller, 600 m pr. pixel (299 MB) | Åben | Public domain |
| **Uranus' fem måner** | Ingen globale kort hos USGS. Voyagers rå billeder i PDS Rings (`VGISS_7xxx`) | Åben | Public domain. Se spørgsmål 4 |
| **Tal** | NSSDC (planeterne, månerne og ringene), JPL SSD (antal måner), JPL Horizons (Solens højde over planeterne) | Åben | |
| **Vindene** | Neptun: Voyagers formel (Sromovsky 1993). Uranus: Sromovsky og Fry 2005 (arXiv) | Åben | |
| **Farverne** | Irwin m.fl. 2024 (MNRAS, fri adgang), læst gennem Wikipedia. OPAL's FITS giver den rigtige lysstyrke i tre farver | `academic.oup.com` er lukket | |
| JWST | Uranus og ringene i infrarødt lys (`esawebb.org`) | Åben | CC BY 4.0 |
| Lukket | `academic.oup.com`, `commons.wikimedia.org`. Wikipedias API svarer 429 efter få opslag | Spørg kun, hvis det bliver nødvendigt | |

## 1. Kloderne
**Hvorfor ikke bare et foto?** Hubbles kort (se billedet i UN1) er grumsede (ca. 220 km pr. pixel ved ækvator), farverne er forstærkede, og Uranus' kort fra 2025 har kun den nordlige halvdel, fordi resten var i mørke. Solar System Scopes Uranus er helt glat. Lægger man dem bare på en kugle, bliver det en kedelig, sløret kugle.

**Planen: kloden bygges af målinger** i `lav_isgiganter.py`:
1. **Båndene:** Gennemsnittet af hver breddegrad i FITS-filerne (den rigtige lysstyrke I/F i blåt, grønt og rødt lys: F467M, F547M og F657N). Det giver lysstyrken og farven for hver breddegrad. Uranus' sydlige halvdel tages fra ældre OPAL-kort (fx 2014-2016, hvor Solen stod lavere over nordpolen). Hvad der ikke er målt, glattes ud, og det siges ærligt.
2. **Farven:** De tre lysstyrker regnes om til en farve på skærmen og tjekkes mod Irwin m.fl. 2024 (begge lyst grønlig blå, Neptun lidt mere blå). Én omregning til begge planeter, så forskellen mellem dem er ægte.
3. **Plettene og skyerne:** De store ting i Hubbles kort (kappen over Uranus' nordpol, mørke pletter og lyse skyer på Neptun) lægges på som et svagt lag. Fine skyer og striber langs breddegraderne tegnes af shaderen, og de følger vindene.
4. **Kortet bliver lille:** 2048 × 1024 på pc og 1024 × 512 på tablet og i tests (der er ikke flere detaljer at hente). Det er billigt.

**Form og drejning (NSSDC):**
- Uranus: 25.559 / 24.973 km (fladtrykt 2,3 %), døgn 17 t 14 min, aksen hælder 97,8°. Den drejer "baglæns" i forhold til banen.
- Neptun: 24.764 / 24.341 km (fladtrykt 1,7 %), døgn 16 t 7 min, aksen hælder 28,3°.
- `lavGasplanet` i `planet.js` kan allerede fladtrykningen. Aksens retning skal komme fra polens retning (RA og Dec fra NSSDC), så hældningen og årstiden passer med datoen.

**Hvad shaderen laver, og hvad kortet laver:**
- Kortet: båndene, farven, de store pletter og kappen over polen.
- Shaderen: vindene (som Jupiter J2), fine skyer langs båndene, randformørkelsen, ringenes skygge, månernes skygger og kanten i modlys. Ved Neptun også de høje, hvide skyer med skygge (UN3).

**Genbrug af `planet.js`:** næsten det hele. Nyt (valgfrit, så Saturn og Jupiter ikke ændres): aksen i en vilkårlig retning, et kort med kun bånd plus et lag med pletter, og høje skyer med skygge.

## 2. Signatur-effekter (pris og hvad der er ægte)
| Effekt | Hvad man ser | Ægte data | Tegnet | Pris | Forslag |
|---|---|---|---|---|---|
| **U-A. Årene på Uranus** | En skyder "År" (1986-2070). Solen vandrer fra sydpolen (1986, da Voyager kom) over ækvator (2007) til nordpolen (omkring 2030) og tilbage. Kappen over polen bliver lys | Solens højde fra JPL Horizons, Uranus' bane og akse (NSSDC). Kappen ses i Hubbles kort fra 2025 | Hvor hurtigt kappen kommer og går | Lille-mellem | **Med (kernen)** |
| **U-B. Systemet på siden** | Ringene og månerne kredser i Uranus' ækvatorplan, altså på tværs af banen, som en skydeskive, når en pol vender mod Solen | NSSDC (ringenes og månernes baner) | Intet | Lille (følger af aksen) | **Med** |
| **U-C. De mørke ringe** | 13 smalle ringe, mørke som kul (de sender 1,5 % af lyset tilbage). Epsilon-ringen er den tydelige. Kontakten "Infrarødt (som JWST)" får dem til at lyse | Radius, bredde og tæthed (NSSDC). JWST's billede som reference | Støvet mellem ringene | Lille-mellem. `ringe.js` med en ny profil | **Med** |
| **N-A. De hurtigste vinde** | Båndene glider mod vest ved ækvator med ca. 1.400 km/t og mod øst nær polerne. Hvide skyer glider forbi | Voyagers formel (Sromovsky 1993) | Skyerne og hvordan de ændrer sig | Lille. Vindene fra Jupiter J2 genbruges | **Med (kernen)** |
| **N-B. Høje skyer med skygge** | Lange hvide striber af metan-is højt oppe, der kaster skygger på skylaget under dem (som på Voyagers berømte foto) | At de findes og deres bredder (Voyager, Hubble) | Hvor de står, og deres højde | Mellem | **Med** |
| **N-C. Den Store Mørke Plet (1989)** | Med kontakten "Neptun i 1989" kommer pletten og "Scooter" frem, som Voyager så dem | Voyagers billeder (Solar System Scopes kort bygger på dem) | Hvordan pletten drejer | Lille-mellem | **Med** (se spørgsmål 3) |
| **N-D. Ringbuerne** | En tynd ring med fem klumper (Courage, Liberté, Egalité 1 og 2 og Fraternité). Tydelige i modlys | NSSDC (radius, bredde og tæthed) | Buernes nøjagtige længder | Lille | **Med** |
| **N-E. Tritons gejsere** | Mørke skyer over Tritons sydpol | Voyager 2 | Partiklerne | Lille-mellem. `fontaener.js` | Valgfri (UN6) |
| **Fælles: Voyagers blå** | Kontakten "Voyagers farver (1989)" gør Neptun dybblå som på de gamle billeder. Uden den vises de ægte farver | Irwin m.fl. 2024 | Intet | Lille | **Med** |
| Nordlys | Uranus' svage nordlys | Hubble | Det meste | Lille | Senere |

**Ikke med:** Det indre (diamantregn er en hypotese, se fælderne), magnetfelterne (kan ikke ses, men kan nævnes under For nørder) og lyn.

## 3. Månerne
**Uranus' fem store** (Miranda, Ariel, Umbriel, Titania og Oberon) som små kugler. De kredser i Uranus' ækvatorplan og vender samme side mod Uranus.
- **Kortene er problemet:** Voyager 2 så kun den sydlige halvdel af månerne (Solen stod over deres sydpoler i 1986), og USGS har ingen globale kort over dem. Det er den halvdel, der har sol nu. Se spørgsmål 4.
- **Banerne** (NSSDC): 129.900 km og 1,41 døgn for Miranda ud til 583.500 km og 13,46 døgn for Oberon. Miranda hælder 4,3°.
- **Størrelsen:** Reglen fra `maanestr.js` (store langt væk, rigtige tæt på). Set fra Uranus' skyer er Ariel 0,40° og Miranda 0,26°. Fra Miranda fylder Uranus 22° af himlen.
- **De små måner** (24 andre, i alt 29 i august 2026) tegnes ikke. Siden nævner tallet med datoen.

**Neptuns Triton** (radius 1.353 km, afstand 354.760 km, omløb 5,88 døgn baglæns, hældning 157°).
- **Kortet:** USGS' farvekort med udfyldte huller (600 m pr. pixel). Det skaleres til 4k på pc og 2k på tablet (som Jupiters måner). Hullerne er udfyldt af USGS, og det siges ærligt.
- **Set fra Neptuns skyer er Triton 0,47° bred**, næsten som vores Måne. Neptun set fra Triton er 8° bred.
- **Proteus og Nereid** tegnes ikke (Nereids aflange bane kan nævnes under For nørder). Siden nævner 16 måner.

**Tryk på en måne:** som ved Jupiter (flyv derhen og en kort side), hvis det er lille. Besøg i dybden kommer med månerne-runden.

## 4. Flybyen, stederne og lagene
**Træet:**
```
[... Jupiter] [Saturn] [URANUS] [Neptun]
▶ Flyby · 4 stop
Uranus
STEDER
  Nordpolen (kappen)
  Ringene
MÅNER
  Miranda · Ariel · Umbriel · Titania · Oberon
```
```
▶ Flyby · 4 stop
Neptun
STEDER
  Den Store Mørke Plet (1989)
  Ringbuerne
MÅNER
  Triton
```
- **Styr-boksen:** "Navne", "Modlys", "Voyagers farver (1989)". Ved Uranus også skyderen "År" og "Infrarødt (som JWST)". Ved Neptun også "Neptun i 1989" og "Vindene" (pile som ved Jupiter).
- **Tiden:** kun tidsknappen. Skyderen "År" flytter kun Solens retning, ikke månerne.

**Uranus' flyby (4 stop).** Underteksterne er forslag (under ca. 160 tegn) og faktatjekkes i UN5.
1. **Uranus og månerne** (oversigten, ringene og månerne som en skydeskive). *"Uranus ligger på siden. Ringene og månerne kredser om den på tværs, som en skydeskive."* Ærligt talt: Månerne er tegnet større herude.
2. **Et år er 84 år** (set fra Solen, skyderen "År" kører fra 1986 til 2030). *"Hver pol har sol i 42 år og mørke i 42 år. Da Voyager 2 kom i 1986, pegede sydpolen mod Solen."*
3. **De mørke ringe** (tæt på epsilon-ringen, kontakten "Infrarødt" foreslås). *"Ringene er mørke som kul. De blev først opdaget i 1977, da Uranus gik foran en stjerne."*
4. **I Uranus' skygge** (Solen bag Uranus, støvet mellem ringene lyser op, som Voyager så det). *"Bag Uranus ses støvet mellem ringene, som forfra er usynligt."*

**Neptuns flyby (4 stop):**
1. **Neptun og Triton** (oversigten). *"Den yderste planet. Lyset fra Solen er over 4 timer om at nå herud, og Solen er kun en lille skarp prik."*
2. **De hurtigste vinde** (hele kloden, kontakten "Vindene" foreslås). *"Ved ækvator blæser det ca. 1.400 km/t mod vest. Ingen anden planet har så hurtige vinde."*
3. **Neptun i 1989** (Den Store Mørke Plet og høje skyer med skygge, kontakten "Voyagers farver" kan prøves). *"Voyager 2 så en mørk storm på størrelse med Jorden. Få år senere var den væk."*
4. **Triton** (Triton foran og Neptun bagved, eller ringbuerne i modlys, se spørgsmål 5). *"Triton kredser baglæns om Neptun. Den er nok en indfanget dværgplanet."*

**"Stå på":** Ingen af planeterne har en overflade. Ingen "Stå på" og ingen knap, der ligner den.

**Lagene** (Kort, emner, For nørder, Billederne og Ærligt talt):
- **Emner (Uranus):** "Hvorfor ligger Uranus på siden?" (man tror et sammenstød, ikke bevist), "Hvad er en isgigant?" ("is" er vand, ammoniak og metan, som inde i planeten er varme væsker), "Hvorfor er den blå?" (metan opsuger rødt lys) og "Hvordan blev den opdaget?" (Herschel 1781, den første planet, man fandt med en kikkert).
- **Emner (Neptun):** "Fundet med matematik" (Le Verrier og Adams regnede, Galle så den 23. september 1846), "Hvorfor blæser det så meget?" (varme indefra), "Er Neptun dybblå?" (Voyagers blå og de ægte farver) og "Triton, den baglæns måne".
- **"Hvorfor?"-kort:** "Hvorfor får Uranus' poler sol i 42 år?" og "Hvorfor kan man ikke stå på Neptun?" (genbrug fra Jupiter, hvis det findes).
- **For nørder:** vindformlerne, "baglæns eller tippet 82°", magnetfelterne (tippet 59° og 47° og flyttet væk fra centrum), planetografisk bredde og at Neptuns døgn måske er 15,97 t (Karkoschka 2011).
- **Billederne:** OPAL (Hubble, 2025), Voyager 2 (1986 og 1989), USGS (Triton) og JWST.
- **Ordbogen:** fx isgigant, ringbue og jævndøgn (tjekkes i `js/data/ordbog.js`, om de findes), hver højst 260 tegn.

## 5. Himlen fra hvert stop
Reglen fra jer: realistisk, ingen prikker, der ikke findes, og månerne har den rigtige størrelse tæt på.
| | Uranus | Neptun |
|---|---|---|
| **Solen** | 1,7 bueminutter bred (en skarp prik), 1/369 af lyset hos os, men stadig ca. 1.100 gange så lys som fuldmånen | 1,1 bueminutter, 1/903 af lyset, ca. 440 gange så lys som fuldmånen |
| **Månerne** | Tæt på i den rigtige størrelse (Ariel 0,40°, Miranda 0,26° fra skyerne). Langt væk tegnet større med navne | Triton 0,47° fra skyerne |
| **Planeten fra månen** | Fra Miranda 22°, fra Oberon 5° | Fra Triton 8° |
| **Andet** | Stjerner. Ingen andre planeter som prikker (Jorden står højst 3° fra Solen) | Samme |

- **Tjek ved hvert stop** (tjekliste E): Slå én ting fra ad gangen, og se, om der står noget på himlen, der ikke findes.
- **Lyset er svagt:** Hvis billedet bliver for mørkt med det rigtige lys, skrues lysstyrken op som en kameraeksponering, og det siges ærligt (samme valg som ved Jupiter og Saturn).

## 6. Tablet og ydelse
| | Pc | Tablet og telefon (`LAV_KVALITET`) | Tests (`TEST_HURTIG`) |
|---|---|---|---|
| Planetens kort | 2048 × 1024 | 1024 × 512 | 1024 |
| Ringene | profil med 8.192 punkter (ca. 1,7 km pr. punkt ved Uranus) | 4.096 | 2.048 |
| Månernes kort | Triton 4k, Uranus' fem 2k | Triton 2k, de fem 1k | 1k |
| Høje skyer med skygge | fuld | færre | fra |

- **Hentes på forhånd** som ved Jupiter: planeten først, så månerne én ad gangen. Rejseskiltet (`rejseskilt.js`) bruges ved skift.
- **Mål billeder i sekundet** (tjekliste F) ved stop 1 og 3 på begge planeter, før og efter UN2 og UN3. Sammenlign med Jupiter.

## 7. Delopgaver
Hver får sit eget go. Model: Opus. Effort: høj, undtagen UN4 (medium, mest genbrug). Fable kan tjekke planerne for alle planeterne samlet senere ([plan-fable.md](plan-fable.md)).

| Del | Hvad | Genbruger | Tests | Størrelse |
|---|---|---|---|---|
| **UN1: Kloderne og skelettet** | `billeder/solsystem/lav_isgiganter.py` (OPAL FITS → bånd, farve, pletlag, 2k/1k, sammenligning med Irwins farver), `KILDER.md`. `js/kosmos/uranus.js` og `neptun.js` efter mønstret fra `jupiter.js`, i `js/solsystem.js` efter Saturn. Aksen fra polens RA og Dec. Vindene fra Jupiter J2 med de nye formler i `js/data/vinde-isgiganter.js` | `planet.js`, `rejse.js`, `navne.js`, `hent.js` | Ny `tests/isgiganter.mjs`: starter, henter kortene, fladtrykt, aksen hælder 97,8° og 28,3°, drejer den rigtige vej, står stille i pause, ingen konsolfejl. Node: vindformlerne (fortegn ved ækvator og ved ±60°) | Mellem-stor |
| **UN2: Uranus' årstider og ringe** | Skyderen "År" (Solens retning fra banen og aksen, tjekket mod Horizons), kappen over polen, `js/data/ringe-uranus.js` (NSSDC), mørke ringe, "Infrarødt", støvet i modlys | `ringe.js`, `planet.js` | Solens bredde passer med Horizons (1986: −82,5°, 2007: 0°, 2026: +74°), ringenes radier, ringene næsten usynlige forfra og synlige i modlys | Mellem |
| **UN3: Neptuns vejr og ringbuer** | Høje skyer med skygge, "Neptun i 1989" (pletten og Scooter), "Voyagers farver", ringbuerne i `js/data/ringe-neptun.js` | `planet.js`, `ringe.js` | Pletten kun med kontakten, buerne de rigtige steder, skyerne flytter sig den rigtige vej og står stille i pause | Mellem |
| **UN4: Månerne** | Triton (USGS) og Uranus' fem (efter jeres svar på spørgsmål 4), baner (NSSDC), Triton baglæns, størrelsesreglen, skygger, tryk og "Måner" i træet | `maane.js`, `maanestr.js`, Jupiters tryk og besøg | Omløbstider, retning (Triton baglæns), rigtig størrelse tæt på (målt i grader), skyggerne findes | Mellem |
| **UN5: Flybyerne, træet og siderne** | To `TUR` med 4 stop, `js/data/sider/uranus.js` og `neptun.js`, Ordbogen, faktatjek af alle tekster (`/faktatjek`, med fælderne i del 6) | `flyby.js`, `sideknap.js` | Flybyerne igennem alle stop, underteksterne under 160 tegn, knapperne findes ud fra teksten, skærmbilleder af alle stop | Mellem-stor |
| **UN6: Tritons gejsere** (hvis I vil) | Partikler over sydpolen | `fontaener.js` | Står stille i pause, antallet under loftet | Lille |

**Til sidst:** hele testsamlingen, billeder i sekundet, "Ikke afprøvet" til jeres runde på tabletten, artefaktet "AtomLab Overblik" og `/faerdig`.

## 8. Spørgsmål til jer (med Opus' anbefaling først)
1. **Rækkefølgen:** **UN1 laver begge kloder samtidig** (fælles værktøj og shader), og så Uranus (UN2) før Neptun (UN3) (anbefalet). Eller hele Uranus færdig først, og så hele Neptun?
2. **Farverne:** **De ægte farver som standard og en kontakt med "Voyagers farver (1989)"** (anbefalet). Eller Voyagers blå som standard, fordi det er det billede, folk kender?
3. **Neptuns plet:** **Neptun som i 2025 som standard og kontakten "Neptun i 1989"** med Den Store Mørke Plet (anbefalet). Eller altid 1989, fordi pletten er det mest kendte?
4. **Uranus' måner:** Der findes ingen færdige kort hos USGS, og Voyager så kun den sydlige halvdel. **Anbefaling: Opus leder først i UN4 efter færdige kort med fri licens** (fx fra Lunar and Planetary Institute eller Wikimedia Commons, og I bliver spurgt om domænet). Findes der ingen, laver vi kortene af Voyagers fotos (PDS), og den nordlige halvdel bliver en blød grå flade med teksten "aldrig fotograferet". Eller skal de fem måner vente til månerne-runden?
5. **Neptuns stop 4:** **Triton med Neptun bagved** (anbefalet: Triton er halvdelen af historien om Neptun, og der er kun én stor måne). Eller ringbuerne i modlys, og Triton først med månerne-runden?
6. **Skyderen "År" ved Uranus:** **En skyder fra 1986 til 2070, der kun flytter Solen** (anbefalet). Eller knapper med faste år (1986, 2007, 2030)?

### Jeres svar
*(Venter.)*

## Status
*(Intet bygget endnu.)*
