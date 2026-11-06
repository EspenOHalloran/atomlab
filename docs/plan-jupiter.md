# Plan: Jupiter (den første planet efter Mars)

*Skrevet 6. november 2026 efter jeres go til planen ("Læs prompt-jupiter-plan.md og lav planen"). Der er ikke sagt go til at bygge. Bygges efter jeres runde på tabletten. Tallene og kilderne står i [fakta-solsystemet.md](fakta-solsystemet.md) under "Del 5: Jupiter". Prompten ligger i [arkiv/prompt-jupiter-plan.md](arkiv/prompt-jupiter-plan.md). Rammen er jeres beslutninger 5. november 2026 ([plan-solsystemet.md](plan-solsystemet.md), afsnit 9): en fast pakke pr. planet, filmisk overgang og ingen fælles verden, de store måner som små kugler med rigtige kort fra start.*

## Kort fortalt
- **Kloden:** Hubbles kort fra december 2025 (OPAL), så Den Store Røde Plet har den størrelse, den har nu. Farverne stemmes af efter Cassinis kort, og polerne kommer fra Cassini. Jupiter er fladtrykt (6,5 %) og drejer på 9 t 56 min.
- **Wow:** Skybåndene glider mod øst og vest med den fart, vi selv måler i Hubbles to omgange, og pletten drejer. Dertil Junos cykloner ved polerne, nordlyset (med en kontakt til ultraviolet lys), ringene i modlys og evt. Io's vulkaner.
- **Månerne:** Io, Europa, Ganymedes og Callisto med USGS' kort i resonansen 1 : 2 : 4. De er større langt væk, men har den rigtige størrelse tæt på, ligesom ved Mars. De kaster skygger på Jupiter.
- **Flybyen:** 6 stop. Ingen "Stå på", for Jupiter har ingen overflade.
- **Delopgaver:** J1-J6, hver med sit eget go. Opus med høj effort. Ca. 5-7 sessioner i alt.
- **Fem spørgsmål til jer** står sidst.

## 0. Kilderne (trin 0, tjekket med curl 6. november 2026)
| Hvad | Kilde | Status | Licens |
|---|---|---|---|
| **Jupiters kort, nu** | Hubble OPAL, cyklus 32 (11.-12. dec. 2025), `archive.stsci.edu/hlsp/opal`. Farvebilledet `..._jupiter-2025a_f395n-f502n-f631n_v1_globalmap.tif` (19 MB), 3600 × 1800 (10 pixel pr. grad) | Åben efter jeres ændring. curl kræver Mozillas rodliste (`certifi`), for containeren mangler emSign-roden | CC BY 4.0 (står på siden). Kreditering: NASA/ESA/A. Simon (OPAL) |
| **Jupiters kort, ægte farver** | Cassini, 11.-12. dec. 2000, PIA07782 (3601 × 1801, 19 MB TIFF) og polkortene PIA07783/84 (2250 × 2250), `assets.science.nasa.gov` | Åben | NASA (fri). Kreditering: NASA/JPL/Space Science Institute |
| Solar System Scope | `8k_jupiter.jpg` er kun 4096 × 2048, og farverne er gjort mættede med vilje | Åben | CC BY 4.0, men bruges ikke (giver intet ud over Cassini) |
| **Månerne** | USGS' globale mosaikker (Voyager og Galileo): Io 1 km (gråt og i farver), Europa 500 m, Ganymedes 1 km, Callisto 1 km, `planetarymaps.usgs.gov/mosaic/` og `asc-pds-services` | Åben, 65-197 MB pr. fil (hentes kun til værktøjet) | Public domain |
| Junos billeder af polerne | JIRAM (infrarødt) og JunoCam i Photojournal og på `www.missionjuno.swri.edu` | Åben | Se faktagrundlaget |
| **Tal** | NSSDC's faktaark (Jupiter og månerne), JPL SSD (månernes baner og radier) | Åben | |
| **Vindene** | Ingen fri tabel fundet (Tollefson m.fl. 2017 og Porcos tillæg er lukket). **Vi måler dem selv** fra OPAL's to omgange (ca. 9½ time imellem), sådan som Tollefson gjorde. Prøven i den lille udgave gav ca. 147 m/s ved 24° N, og Simon m.fl. 2015 målte 153 m/s | Åben | CC BY 4.0 |
| Artikler | `ui.adsabs.harvard.edu`, `export.arxiv.org`, `arxiv.org`, `doi.org` | Åben | |
| Lukket | `www.sciencedirect.com` og `agupubs.onlinelibrary.wiley.com` (Cloudflare afviser selv), `esahubble.org` (svarer ikke), `www.jpl.nasa.gov` (403) | Kan ikke ændres med listen | |

**Ingen nye domæner er nødvendige til byggeriet.** Domænerne står også i [plan-mars.md](plan-mars.md) under "Domæner, der skal på listen".

### Kortet: OPAL eller Cassini?
Set i små udgaver ved siden af hinanden:
- **OPAL 2025:** Pletten er mindre og rundere end i 2000, og der er lige så mange detaljer i båndene. Kortet dækker kun fra ca. 81° S til 85° N. Det er lavet i planetografisk bredde, og randformørkelsen er trukket fra (Minnaert). Farverne er "arbitrarily scaled" (fra tre smalle filtre), så de skal stemmes af.
- **Cassini 2000:** Farverne er "tæt på det, øjet ville se" (NASA), og kortet går helt til polerne (men uskarpt og i dis). Bredden er planetocentrisk. De mindste detaljer er ca. 120 km. Pletten har størrelsen fra 2000.

**Anbefaling:** OPAL 2025 som kort. Farverne stemmes af bånd for bånd efter Cassini (samme gennemsnitsfarve pr. breddegrad), og fra ca. 75° og op til polen glider OPAL over i Cassinis polkort. Polerne er alligevel skjult under det tegnede lag med cyklonerne (J5). Ærligt talt: "Kortet er Hubbles foto fra december 2025. Farverne er justeret efter Cassinis foto fra 2000."

**Fælder til værktøjet (`lav_jupiter.py`):**
- **Breddegraden:** Kloden er en kugle, der er trykket sammen (`scale.y` = 0,935), så kortets række skal følge den parametriske bredde β: tan β = (b/a) · tan φ for planetografisk bredde (OPAL) og (a/b) · tan φ for planetocentrisk (Cassini). Ved 45° er forskellen mellem dem 3,8°, og ved pletten (ca. 22° S) er den ca. 2,8°. Uden omregning står pletten forkert, og bånd fra to kort passer ikke sammen.
- **Længdegraden:** OPAL har 0° System III vest i venstre kant, og længden falder mod højre. Cassinis opsætning tjekkes mod pletten, som står begge steder. Begge vendes, så øst er til højre, som i alle andre kort i AtomLab.
- **Kanterne:** Cassini har 3601 søjler, så den sidste er sandsynligvis en kopi af den første (måles, tjekliste E). OPAL har tomme rækker ved polerne, og sømmene mellem de enkelte billeder er glattet af OPAL (README), så de tjekkes på et billede.

## 1. Kloden
- **Form:** Ækvatorradius 71.492 km og polradius 66.854 km, altså fladtrykt 6,5 %, så det kan ses (NSSDC). `lavGasplanet` i `js/solsystem/planet.js` kan det allerede (`polRadius`, normalen regnes rigtigt).
- **Drejning:** 9,925 t (System III), mod uret set fra nord. Aksen hælder 3,13°, så Jupiter har næsten ingen årstider, og månerne og ringene ligger næsten i samme plan som banen.
- **Kortets opløsning:** OPAL har 3600 pixel rundt, altså ca. 125 km pr. pixel ved ækvator. Det skaleres til 4096 × 2048 på pc og 2048 × 1024 på tablet og telefon (tests 1024). Et 8k-kort giver ingen nye detaljer.
- **Tæt på bliver kortet grumset:** Når billedet er 30.000 km bredt (pletten tæt på), fylder én kortpixel ca. 6 skærmpixel (grænsen er ca. 3, tjekliste E). Derfor tegner shaderen fine skyer oven i kortet tæt på (støj, der følger vindene). Det er tegnet og siges i "Ærligt talt".
- **Hvad shaderen laver, og hvad kortet laver:**
  - Kortet: båndene, pletten, de hvide ovaler, farverne og de mørke "hot spots".
  - Shaderen: at båndene glider (vindene, J2), at pletten drejer (J2), de fine skyer tæt på, randformørkelsen, månernes skygger, kanten i modlys og cyklonerne ved polerne (J5).
- **Genbrug af `planet.js`:** Næsten det hele (kuglen, fladtrykningen, lyset, kanten i modlys og randformørkelsen). Det skal udvides med valgfrie dele, så Saturn ikke ændres:
  - Ringenes skygge skal kunne slås fra (Jupiters ringe er for tynde til at kaste en skygge, man kan se).
  - Vindene og pletten (J2).
  - Skygger fra op til fire måner (en kugle mellem punktet og Solen, med en blød kant, for Solen er 0,1° bred).
  - Et lag ved polerne (J5).
- **Skyggerne fra månerne** er rigtige og billige: Io, Europa og Ganymedes kaster en sort plet på Jupiter på hver omgang. Callisto gør det kun i perioder på nogle år (lige nu ca. fra maj 2025 til aug. 2028, kun set som søgeresultat). Med programmets ur ses det tit.
- **Jupiters skygge på månerne:** Månerne går ind i Jupiters skygge på (næsten) hver omgang. `lavIsmåne` i `maane.js` får planetens skygge som `maane-form.js` (Mars).

## 2. Signatur-effekter (pris og hvad der er ægte)
| Effekt | Hvad man ser | Ægte data | Tegnet | Pris | Forslag |
|---|---|---|---|---|---|
| **A. Båndene glider, og pletten drejer** | Båndene glider mod øst og vest ved siden af hinanden, og pletten drejer mod uret | Vindprofilen (målt af os i OPAL's to omgange) og pletten fra OPAL | Hvordan skyerne strækkes og ændrer sig. Kortet "glider" i en strømning, der tones over hvert stykke tid (to faser, som vand i spil) | Mellem (J2). To opslag i kortet ekstra pr. pixel | **Med (kernen)** |
| **B. Junos cykloner ved polerne** | Over polerne: en ring af cykloner om en i midten (ved nordpolen 8 om 1, ved sydpolen 5 om 1) | Antallet, placeringen og størrelsen (ca. 4.000-4.600 km) fra Juno (JIRAM) | Selve skyerne i hver cyklon (spiraler i en shader). Junos billeder er infrarøde eller i stærkt forstærkede farver, så der findes intet foto i ægte farver, der kan lægges på | Mellem (J5) | **Med** |
| **C. Nordlyset** | En ring om hver pol og Io's "fodspor". Med kontakten "Ultraviolet" lyser den klart | Ringens placering og Io's fodspor (Hubble og Juno) | Farven: I ultraviolet lys har den ingen farve, vi kan se, så den vises i en falsk farve (lilla, som NASA's billeder). Uden kontakten er den meget svag | Lille-mellem (J5). Et lag med lys, der lægges til | **Med** |
| **D. Ringene i modlys** | Fra Jupiters skygge lyser en tynd ring op, når Solen står bag Jupiter. Forfra kan den næsten ikke ses | Ringenes grænser og tæthed (NSSDC) | Hvordan støvet spreder lyset (en enkel formel for lys, der spredes fremad) | Lille (J5). `ringe.js` med en ny profil og spredning fremad | **Med** |
| **E. Io's vulkaner** | Skyer af svovl over Pele og Tvashtar (ca. 300-400 km høje) i kanten af Io | Stederne og højderne (Galileo, New Horizons) | Partiklerne og formen | Lille-mellem (J6). Partiklerne fra Enceladus' fontæner (`fontaener.js`) | Valgfri, se spørgsmål 2 |
| F. Lyn på natsiden | Glimt i skyerne | Juno har set lyn | Hvor og hvornår | Lille | Senere |

**Ikke med:** pletten i "rigtig" 3D (højden), JunoCams fotos som kort og magnetfeltet (fylder meget og kan ikke ses).

## 3. Månerne
- **Fire måner som små kugler med rigtige kort** (USGS, public domain). De vender samme side mod Jupiter, ligesom Saturns måner (længdegrad 0° mod Jupiter, tjek med kortenes længde: Alle fire kort har vestlig længde, Io har 0° i midten, og de andre tre har 180° i midten).
  - **Io:** USGS' farvekort er forstærket (violet, grøn og nær-infrarød, "de ægte farver er meget mere dæmpede", USGS). Brug det grå kort med en dæmpet gul tone, der følger farvekortet svagt, og sig det.
  - **Europa:** Der mangler data syd for 83° S. Fyld hullet med spejlede stykker (erfaringen fra Phobos), ikke en lige linje.
  - **Ganymedes og Callisto:** grå med en svag tone.
  - Opløsning: 4k på pc og 2k på tablet og telefon (2k i tests). Alle originalerne er over 8k rundt, så 8k kan komme med besøgene senere.
- **Banerne:** Afstand fra JPL (421.800, 671.100, 1.070.400 og 1.882.700 km) og omløbstid fra NSSDC (1,769, 3,551, 7,155 og 16,689 døgn). Brug ikke kolonnen "P" i JPL's tabel. Den er ikke den rigtige omløbstid, og med den passer resonansen ikke. Resonansen 1 : 2 : 4 kommer så af sig selv (Io 4,04 omgange på én af Ganymedes'). Alle kredser mod uret set fra nord og ligger næsten i Jupiters ækvatorplan (under 0,5°).
- **Farten:** Jupiter og månerne følger det samme ur, så de passer sammen (Io går rundt på knap 4,3 Jupiter-døgn). I oversigten kan det spoles med tidsknappen (⏩), og så ses resonansen.
- **Størrelsen** (samme regel som Mars, `PRIK` i `mars.js`): Langt væk tegnes de mindst 0,26° i radius, så de kan ses og trykkes på. Tæt på Jupiter (stop 2-4) og ved en anden måne tegnes de i deres rigtige størrelse. Set fra skyerne er Io 0,6° bred (lidt større end vores Måne), Europa og Ganymedes ca. 0,3° og Callisto 0,15°. Fra Io er Europa op til 0,7°. Reglen flyttes ud i en fælles funktion (fx `js/solsystem/maanestr.js`), som Mars og Jupiter bruger.
- **De små måner** (Amalthea, Thebe, Metis, Adrastea og over 100 andre) tegnes ikke. Siden siger, at der er 115 kendte måner (april 2026), og at vi viser de fire store.
- **Tryk på en måne:** Ja, som ved Saturn (flyv derhen, en kort side). Besøg i dybden og "Land på" kommer med månerne senere. Se spørgsmål 3.

## 4. Flybyen, stederne og lagene
**Træet** (efter [plan-ux.md](plan-ux.md), "Fire slags indhold, fire faste pladser"):
```
[Sol] [Jord] [Mars] [JUPITER] [Saturn]
▶ Flyby · 6 stop
Jupiter
STEDER
  Den Store Røde Plet
  Sydpolen (Junos cykloner)
  Nordpolen
  Ringene
MÅNER
  Io
  Europa
  Ganymedes
  Callisto
```
- **Steder:** pletten, polerne og ringene. Kameraet flyver derhen.
- **Styr-boksen:** "Navne", "Modlys", "Ultraviolet (nordlyset)" og "Vindene" (pile over båndene, hvis længde er den målte fart). "Vindene" er en kontakt som "Bjergene 10 gange højere" ved Mars, ikke en tidsknap.
- **Tiden:** kun tidsknappen. Ingen egne knapper.
- **Forsøg:** ingen i denne omgang (se "Senere" nedenfor).

**Flybyen (6 stop).** Hvert stop har en undertekst på under ca. 160 tegn (tjekliste B) og en side. Teksterne er forslag og bliver faktatjekket i J4.
1. **Jupiter og de fire store måner** (oversigten, månerne i deres baner). *"Jupiter vejer næsten 2½ gange så meget som alle de andre planeter tilsammen. De fire store måner fandt Galileo Galilei i januar 1610."* Ærligt talt: Månerne er tegnet større herude, så de kan ses.
2. **Båndene og vindene** (hele kloden, kontakten "Vindene" foreslås). *"De lyse og mørke bånd er skyer, som vindene trækker hver sin vej, mod øst og mod vest. Den hurtigste blæser ca. 550 km/t."* Ærligt talt: Båndene glider med den målte fart, men skyerne i dem ændrer sig ikke, som de gør i virkeligheden.
3. **Den Store Røde Plet** (tæt på, kameraet følger pletten, mens Jupiter drejer). *"En storm, der er omtrent lige så bred som Jorden. Den drejer rundt på ca. 4½ døgn og er set sikkert siden 1831."* Ærligt talt: De fine skyer tæt på er tegnet af programmet. Fælden "350 år" undgås, og "Den var tre gange så bred i 1800-tallet" kan stå på siden.
4. **Sydpolen** (oppefra med lav sol, kontakten "Ultraviolet" foreslås). *"Fem cykloner står i en ring om en sjette lige over polen. Juno så dem, da den kom frem i 2016."* Ærligt talt: Cyklonerne er tegnet efter Junos infrarøde målinger.
5. **Io** (Io foran og Jupiter stor bagved, 19,5° bred). *"Det mest vulkanske sted i solsystemet. Jupiter og de andre måner hiver og trækker i Io, så den bliver varm indeni."* Ærligt talt: Farverne er dæmpet, for USGS' farvekort er forstærket.
6. **I Jupiters skygge** (Solen bag Jupiter: en tynd lysende kant om planeten, og ringene lyser op i modlys, nordlyset på natsiden, Europa i baggrunden). *"Her bag Jupiter er Solen skjult. Nu ses ringene af støv, som forfra er næsten usynlige."*

Europa, Ganymedes og Callisto er i træet og kan trykkes på. Europa er også med i baggrunden ved stop 6. Se spørgsmål 4.

**"Stå på":** Jupiter har ingen overflade, man kan stå på. Gassen bliver bare tættere og varmere nedad. Der kommer ingen "Stå på" og ingen knap, der ligner den. **Senere (idé, ikke i J):** "Galileos sonde" som forsøg. Sonden dykkede ned i skyerne i 1995 og sendte målinger, indtil den holdt op (tallene er ikke tjekket endnu). Det kræver skyer i 3D og et faktatjek.

**Lagene** (efter U3: Kort, emner, For nørder, Billederne og Ærligt talt):
- **Jupiters side, emner:** "Hvorfor har Jupiter bånd?" (zoner og bælter, vindene), "Er Jupiter en mislykket stjerne?" (nej: der skulle ca. 80 gange så meget masse til, se fælden), "Hvad er inden i?" (brint, der bliver til metal, og en kerne, der ikke har en skarp kant), "Beskytter Jupiter Jorden?" (forsigtigt: det er ikke så enkelt, se fælden) og "Hvorfor står månerne i takt?" (resonansen).
- **"Hvorfor?"-kort:** "Hvorfor er Jupiter fladtrykt?" (den drejer hurtigt) og "Hvorfor er Io varm?" (tidevandet).
- **For nørder:** vindprofilen (tal), System III (døgnet målt efter radiobølgerne fra magnetfeltet), Laplace-relationen (n₁ − 3n₂ + 2n₃ = 0), planetografisk og planetocentrisk bredde.
- **Billederne:** OPAL (Hubble, 2025), Cassini (2000), USGS (Voyager og Galileo) og Juno (JIRAM).
- **Ordbogen:** zone, bælte, jetstrøm, antikyklon (højtryk), cyklon, resonans og nordlys (ingen af dem findes i dag), hver højst 260 tegn.

## 5. Himlen fra hvert stop
Reglen fra jer: realistisk, ingen prikker, der ikke findes, og månerne har den rigtige størrelse tæt på.
| Stop | Solen | Månerne | Andet |
|---|---|---|---|
| 1. Oversigten | En lille, skarp prik. Den er 0,10° bred (ca. 1/5 af det, vi ser), men lyset er kun 1/27, så Solen er stadig blændende (ca. 15.000 gange så lys som fuldmånen) | Tegnet større (mindst 0,26° i radius) med navne | Stjerner. Ingen små måner, ingen andre planeter som prikker |
| 2. Båndene | samme | Rigtig størrelse, tit som små skiver ved kanten. Deres skygger på skyerne | |
| 3. Pletten | Lavere sol, så skyerne får skygge | Rigtig størrelse (Io 0,6°) | |
| 4. Sydpolen | Lav sol ved kanten (aksen hælder kun 3°) | Rigtig størrelse | Nordlyset med kontakten |
| 5. Io | samme | Europa op til 0,7° og Ganymedes op til ca. 0,5°, som små skiver | Jupiter 19,5° bred, altid samme sted på Io's himmel. Halvt i skygge, når Io står ved siden af |
| 6. Skyggen | Skjult bag Jupiter. Kun en tynd lys kant om planeten | Månerne lyser i sollys | Ringene i modlys og nordlyset på natsiden |

- **Jorden og Saturn:** Jorden står højst 11° fra Solen (som en klar stjerne) og vises ikke. Det er et "mangler", ikke en falsk prik, og det kan nævnes under For nørder.
- **Tjek ved hvert stop** (tjekliste E): Slå én ting fra ad gangen, og se, om der står noget på himlen, der ikke findes.

## 6. Tablet og ydelse
| | Pc | Tablet og telefon (`LAV_KVALITET`) | Tests (`TEST_HURTIG`) |
|---|---|---|---|
| Jupiters kort | 4096 × 2048 (ca. 45 MB i grafikkortet med mipmaps) | 2048 × 1024 (ca. 11 MB) | 1024 |
| Månernes kort (én kanal) | 4 × 4k (ca. 4 × 22 MB) | 4 × 2k (ca. 4 × 6 MB) | 2k |
| Kuglen | 192 × 96 felter | 128 × 64 | 64 × 32 |
| Vindene | to faser, fine skyer tæt på | to faser, ingen fine skyer | to faser |
| Cyklonerne og nordlyset | fuld | færre spiraler | fra |
| Io's vulkaner (hvis med) | fuld | halvt så mange partikler | få |

- **Hentes på forhånd** som ved Saturn: Jupiters kort først, så månernes ét ad gangen med `image.decode()` og `renderer.initTexture`. "▶ Start flyby" er grå, indtil de er klar (højst `FORHÅND_TID`).
- **Mål billeder i sekundet** (tjekliste F, én browser ad gangen): Jupiter hele (stop 2), pletten tæt på (stop 3) og Io med Jupiter bagved (stop 5), på pc og tablet i testbrowseren, før og efter J2 og J5. Sammenlign med Saturn (pc 4,6 og tablet 12,6 i testbrowseren). På den rigtige tablet efter J5 (jeres runde). Bliver G1 (måling i [plan-grafik.md](plan-grafik.md)) lavet først, kan I selv se tallet med `?fps`.

## 7. Delopgaver
Hver får sit eget go. Model: Opus. Effort: høj, undtagen J3 (medium er nok, det er mest genbrug). Fable kan tjekke planerne for alle planeterne samlet senere ([plan-fable.md](plan-fable.md), F3), ikke Jupiter alene.

| Del | Hvad | Genbruger | Tests | Størrelse |
|---|---|---|---|---|
| **J1: Kloden og skelettet** | `billeder/solsystem/lav_jupiter.py` (OPAL + Cassini, farver, poler, bredde, kanter, 4k/2k/1k) og `KILDER.md`. `js/kosmos/jupiter.js` efter mønstret fra `saturn.js` (systemet, rejsen, træet med Jupiter alene, Solen 0,1°). Jupiter i `js/solsystem.js` mellem Mars og Saturn. `planet.js` med valgfri ringskygge. `hent` (findes to gange i saturn.js og mars.js) flyttes til en fælles fil | `planet.js`, `rejse.js`, `navne.js`, skallen | Ny `tests/jupiter.mjs`: starter, henter kortet, fladtrykt, drejer mod uret, står stille i pause, ingen konsolfejl. `saturn` og `mars` (fælles `hent`). Kort set i `kloder.html` | Mellem-stor |
| **J2: Vindene og pletten** | Vindprofilen måles i `lav_jupiter.py` ved at sammenligne hver række i OPAL's to omgange (krydskorrelation, i den fulde opløsning og for flere filtre, med tiderne fra README'en). Den tjekkes mod de tal, der er åbnet (Simon m.fl. 2015: 153 m/s ved 24° N) og gemmes i `js/data/vinde-jupiter.js` (testes i Node). Derefter strømningen i `planet.js` (to faser), pletten som en hvirvel, fine skyer tæt på, kontakten "Vindene" og stoppet ved pletten (kameraet følger pletten) | `planet.js`, `rejse.js` (`op`, et sted, der drejer) | Node: retningen ved ækvator og den stærkeste jet. Browser: et punkt ved en given bredde flytter den rigtige vej og står stille i pause. Billeder i sekundet før og efter | Mellem |
| **J3: Månerne** | Kortene i `lav_jupiter.py`, `lavIsmåne` med planetens skygge og tone, banerne (NSSDC), størrelsesreglen som fælles funktion (Mars bruger den også), skygger på Jupiter, tryk og besøg, "Måner" i træet | `maane.js`, `maane-form.js` (skyggen), Saturns tryk og besøg, `mars.js` (`PRIK`) | Forholdet mellem omløbene (1 : 2 : 4 og Laplace), mod uret, rigtig størrelse tæt på (målt i grader), tryk på en måne, skyggen på Jupiter findes. `mars` (fælles størrelsesregel) | Mellem |
| **J4: Flybyen, træet og siderne** | `TUR` med 6 stop, træet, `js/data/sider/jupiter.js`, nye ord i Ordbogen, faktatjek af alle tekster (`/faktatjek`). Evt. et citat fra Galilei (kun med den præcise ordlyd fra Sidereus Nuncius) | `flyby.js`, skallen, `sideknap.js` | Flybyen igennem alle stop (`hop`, vent på `!tur().flyver`), knapperne findes ud fra teksten, underteksterne er under 160 tegn, skærmbilleder af alle stop i alle størrelser, et billedværktøj `tests/vaerktoejer/jupiter.mjs` med fuld grafik | Mellem-stor |
| **J5: Polerne, nordlyset og ringene** | Cyklonerne (ved nord og syd), nordlyset med kontakten "Ultraviolet" og ringene med `js/data/ringe-jupiter.js` og spredning fremad | `ringe.js`, `planet.js` | Cyklonerne står de rigtige steder (antal og bredde), nordlyset kun med kontakten (målt i billedet), ringene næsten usynlige forfra og synlige i modlys. Himlen ved hvert stop (tjekliste E). Billeder i sekundet | Mellem |
| **J6: Io's vulkaner** (hvis I vil) | Skyerne over Pele og Tvashtar som partikler og Io's dæmpede farver | `fontaener.js` | Partiklerne står stille i pause, og antallet er under loftet | Lille-mellem |

**Til sidst (efter J5 eller J6):** hele testsamlingen, billeder i sekundet, "Ikke afprøvet" til jeres runde på tabletten og `/faerdig`.

## 8. Spørgsmål til jer (med Opus' anbefaling først)
1. **Kortet:** **Hubble 2025 (OPAL)** med farverne stemt af efter Cassini og Cassinis poler, så pletten har sin størrelse fra i dag (anbefalet), eller Cassini 2000 med de ægte farver, men pletten fra dengang?
2. **Signatur-effekterne:** **Båndene og pletten (A), cyklonerne (B), nordlyset (C) og ringene i modlys (D)** (anbefalet). Skal Io's vulkaner (E, J6) med nu, eller vente til månerne får besøg?
3. **Månerne:** **Kan trykkes på og besøges kort, som Saturns måner** (anbefalet, billigt, for det er genbrug), eller kun stå som kugler, indtil månerne-runden kommer?
4. **Flybyens 6 stop:** **Oversigten, båndene, pletten, sydpolen, Io og skyggen** (anbefalet), eller skal Europa have sit eget stop i stedet for skyggen (så kommer ringene og nordlyset i modlys kun med kontakterne)?
5. **Vindene:** **Den rigtige fart i forhold til Jupiters døgn** (anbefalet: Båndene glider ca. 1-4° pr. omgang, og med ⏩ ses det tydeligt), eller en kontakt, der gør vindene 10 gange hurtigere (som "Bjergene 10 gange højere" ved Mars)?

## Status
Planen er skrevet (6. november 2026). Faktagrundlaget står i `fakta-solsystemet.md`, "Del 5: Jupiter". Intet er bygget. Venter på jeres svar og go, efter jeres runde på tabletten.
