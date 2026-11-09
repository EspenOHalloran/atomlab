# Plan: Venus

*Skrevet 9. november 2026 efter jeres go til planen ("Skriv planen for Venus efter mønstret fra plan-uranus-neptun.md"). Der er ikke sagt go til at bygge. Tallene og kilderne står i [fakta-solsystemet/del7-venus.md](fakta-solsystemet/del7-venus.md). Rammen er jeres beslutninger fra 5. november 2026 ([plan-solsystemet.md](plan-solsystemet.md), afsnit 9): en fast pakke pr. planet, filmisk overgang, ingen fælles verden og "Stå på" kun dér, hvor der findes rigtige data. Skabelonen er [plan-uranus-neptun.md](plan-uranus-neptun.md).*

## Kort fortalt
- **Venus har to lag:** Udefra ser man kun **skyerne** (svovlsyre, næsten uden mønster i synligt lys). Selve **jorden** under dem kender vi fra Magellans radar (1990-1994) og fra Veneras landere. Kloden bygges derfor af to dele: en klippeplanet med Magellans radarkort og højder (som Mars, `klippeplanet.js`) og et skylag udenom, der glider med vindene (som Jupiter, `planet.js`).
- **Wow 1, skyerne løber om kap:** Skyerne suser rundt på ca. 4 døgn, mens planeten selv er 243 døgn om én omgang og drejer baglæns. Med ⏩ ser man skyerne glide hen over en jord, der står stille.
- **Wow 2, under skyerne:** En skyder tager skyerne væk, og Maxwell Montes, vulkanen Maat Mons (med spor af udbrud i 1991), kratere og pandekagekupler kommer frem.
- **Wow 3, natsiden gløder:** Jorden er 464 °C, så natsiden gløder svagt gennem skyerne. Højlandene er køligere og ses som mørke pletter, som på Parker Solar Probes billeder.
- **Wow 4, ned til Venera 13:** Kameraet daler ned gennem skyerne med en måler for højde, tryk og temperatur og lander, hvor Venera 13 tog farvebilleder i 1982.
- **Ingen måner og ingen ringe,** så pakken bliver mindre end Uranus og Neptun på de punkter, men større på kloden.
- **Delopgaver:** V1-V5, hver med sit eget go (V6 er valgfri). Ca. 5-7 sessioner. Opus med høj effort.
- **Seks spørgsmål til jer** står sidst. Et af dem er et domæne, der skal åbnes.

## 0. Kilderne (tjekket med curl 9. november 2026)
| Hvad | Kilde | Status | Licens |
|---|---|---|---|
| **Jorden (radar)** | USGS: Magellan C3-MDIR, hele kloden, 2.025 m pr. pixel (18.775 × 9.388, 176 MB) | Åben (`planetarymaps.usgs.gov` sender videre til S3-spanden `asc-pds-services`) | Public domain (NASA/JPL/USGS) |
| **Skarpere radar ved stederne** | Magellans venstrekig, 225 m pr. pixel (13 GB) og 75 m. Ukomprimeret med én linje pr. strimmel, så et udsnit kan hentes med `Range` uden at hente det hele | Åben | Public domain |
| **Højderne** | Magellan GTDR, 4.641 m pr. pixel (8.192 × 4.096, 16 bit, version 2) | Åben | Public domain |
| Andre radarlag | Emissivitet, reflektivitet og hældning (4.641 m). Emissiviteten viser "metalsneen" på bjergtoppene | Åben | Public domain |
| **Skyerne, kort** | Akatsuki (JAXA) UVI, kort over hele kloden i ultraviolet lys (niveau L3) i DARTS | `darts.isas.jaxa.jp` er **lukket**. Se spørgsmål 1 | Japans regerings standardvilkår 2.0 (som CC BY 4.0), "ISAS/JAXA" |
| Skyerne, enkeltbilleder | Akatsuki-billeder på Wikimedia Commons, Venus Express (ESA) på `esa.int` | Åben | ISAS/JAXA, ESA (tjekkes for hvert billede) |
| Solar System Scope | `4k_venus_atmosphere.jpg` (skyerne, tegnet efter UV-billeder) og `8k_venus_surface.jpg` | Åben med en ærlig User-Agent | CC BY 4.0. Kun som reference, ikke som kort |
| **Venera 13** | Farvepanoramaet (VG00261/262, 170°, 1.000 × 252 punkter) i NSSDC's billedkatalog og på Commons | Åben | Public domain (USSR/NASA, Commons: PD-RU-exempt). Don Mitchells kendte behandlinger har egen ophavsret, og hans side er lukket |
| Parker Solar Probe | WISPR's billeder af natsiden (2020 og 2021) på Commons | Åben | Public domain (NASA/Johns Hopkins APL/NRL) |
| **Tal** | NSSDC's faktaark (11. januar 2024), JPL Horizons (Solens plads over Venus), Wikipedias wikitekst | Åben | |
| **Vindene** | Venus Express og Akatsuki (Hueso m.fl. 2015, Khatuntsev m.fl. 2013, Horinouchi m.fl. 2018) | arXiv er åben. Tidsskrifterne tjekkes | |
| **Luften i hver højde** | VIRA (Seiff m.fl. 1985) og Venera 13's målinger | Tjekkes i V4 | |
| Lukket | `darts.isas.jaxa.jp`, `psa.esa.int` (Venus Express' arkiv), `www.jpl.nasa.gov`, `images-assets.nasa.gov`, `mentallandscape.com` | Kun DARTS er vigtig (spørgsmål 1) | |

## 1. Kloden: skyerne udenpå og jorden indeni
**Hvorfor ikke bare et foto?** Venus i synligt lys er en næsten glat, lyst gullig hvid kugle. Det er ærligt, men kedeligt i længden. Det spændende er bevægelsen i skyerne (som ses i UV) og det, der gemmer sig under dem. Derfor to lag, man kan skifte mellem.

**Jorden (`lav_venus.py`, efter mønstret fra `lav_mars.py`):**
1. **Radarkortet:** Magellans C3-MDIR skaleres til 8k, 4k og 2k i gråtoner (én kanal, `RedFormat`, så det fylder en fjerdedel). Huller i dækningen udfyldes blødt (hvor store de er, måles i V1), og det siges ærligt.
2. **Højderne:** GTDR (version 2) som højdekort i to kanaler som Mars. Radius og nulpunkt tjekkes i etiketten (USGS regner med 6.051,0 km, NSSDC med 6.051,8 km, se fælde 13).
3. **Farven:** Radaren ser ikke farver. Lyst betyder ru eller skrå. Gråtonerne tones orange efter Venera 13's fotos, sådan som lyset er dernede (spørgsmål 3).
4. **Lokale net (V3):** Udsnit af 225 m-kortet (fx 4096 × 4096 punkter) ved Maat Mons og Maxwell Montes med `lokalt()` fra `klippeplanet.js`. Højderne er stadig kun 4,6 km pr. pixel, så det giver en skarpere overflade, ikke skarpere bjerge. Det siges ærligt.

**Skyerne (V2):** et lag ca. 70 km over jorden, lavet med `lavGasplanet` fra `planet.js` (kortet glider med vindene, randformørkelsen og kanten i modlys findes allerede).
- **Synligt lys (standard):** lyst gullig hvid med svage striber (spørgsmål 2).
- **"Ultraviolet (som Akatsuki)":** de mørke striber og det store "Y". Fra Akatsukis kort, hvis DARTS åbnes (spørgsmål 1). Ellers tegnet af shaderen ud fra enkeltbilleder.
- **Vindene:** en målt profil for hver breddegrad (ca. 100 m/s ved ækvator, nul ved polerne) i `js/data/vinde-venus.js`, uden Three.js, så den kan testes i Node.
- **Nyt (valgfrit, så Jupiter og isgiganterne ikke ændres):** skylaget kan gøres gennemsigtigt (skyderen "Under skyerne"), og en tynd, lys dis over skyerne i modlys.

**Form og drejning (NSSDC):** radius 6.051,8 km (ikke fladtrykt). Drejer baglæns på 243,0 døgn (−5.832,6 t). Soldøgnet er 116,75 døgn. Aksen hælder 177,36°, altså næsten lige op. Polens retning: RA 272,76°, Dec 67,16°. Solens plads over Venus regnes efter datoen og tjekkes mod Horizons.

**Lyset under skyerne:** "Under skyerne" viser jorden, som om luften var væk, med Solens lys oven på radaren. Radaren lyser selv fra siden, så skråninger mod radaren er lyse to gange. Det siges under For nørder.

## 2. Signatur-effekter (pris og hvad der er ægte)
| Effekt | Hvad man ser | Ægte data | Tegnet | Pris | Forslag |
|---|---|---|---|---|---|
| **V-A. Skyerne løber om kap** | Skyerne kredser på ca. 4 døgn, ca. 360 km/t ved ækvator og langsommere mod polerne. Samme vej som planeten, men ca. 60 gange hurtigere. Med ⏩ og "Under skyerne" halvt ser man skyerne glide over Maat Mons, der står stille | Vindprofilen (Venus Express, Akatsuki), drejningen (NSSDC) | Skyernes mønster, hvis DARTS ikke åbnes | Lille-mellem. Vindene fra Jupiter J2 genbruges | **Med (kernen)** |
| **V-B. Ultraviolet (som Akatsuki)** | Kontakten viser striberne og det store "Y". I synligt lys er Venus næsten glat | Akatsukis kort (spørgsmål 1) | Uden DARTS: mønstret | Lille med kort, mellem uden | **Med** |
| **V-C. Under skyerne** | Skyderen toner skyerne væk. Magellans radarkort med højderne, Ishtar Terra og Maxwell Montes, Aphrodite Terra, kratere og coronae. "Bjergene 10 gange højere" som ved Mars | Magellan (radar og højder) | Farven (tonet orange) | Mellem. `klippeplanet.js` genbruges | **Med (kernen)** |
| **V-D. Natsiden gløder** | Kontakten "Infrarødt (som Parker)": natsiden gløder svagt mørkerødt gennem skyerne. Højlandene er køligere (fx Maxwell Montes ca. 380 °C mod 464 °C) og ses som mørke pletter, som Aphrodite Terra på Parkers billeder | Højderne, temperaturen i hver højde (VIRA), Parker WISPR (2020-2021) | Hvor sløret gløden er gennem skyerne | Lille-mellem. Gløden regnes ud fra højdekortet i shaderen | **Med** |
| **V-E. Ned gennem skyerne** | Kameraet daler fra ca. 70 km til jorden ved Venera 13. En måler viser højde, tryk og temperatur (ca. 1 bar og stuetemperatur ved 50-55 km, 89 bar og 457 °C nede). Lyset bliver orange og svagt, og skyerne er tåge omkring kameraet | VIRA, Venera 13 (NSSDC) | Tågen og lyset | Mellem | **Med** |
| **V-F. Stå ved Venera 13** | På jorden: Veneras farvepanorama om kameraet med `panorama.js`, en orange, diset himmel og et skilt "127 minutter" | Venera 13's fotos (1982) | Det, der er uden for fotoet | Mellem (kun fotoet) eller stor (med et tegnet landskab) | Se spørgsmål 4 |
| **V-G. Ringen i modlys** | Med Solen bag Venus lyser disen over skyerne som en tynd ring (som ved Venuspassagerne) | Disens højde (Venus Express) | Lysstyrken | Lille. `atmosfaere.js` (Titans ring) genbruges | **Med** |
| **V-H. Vulkaner i live** | Ved Maat Mons: stedets side fortæller om krateret, der voksede i 1991 (Herrick og Hensley 2023), og lavastrømmene ved Sif Mons og Niobe Planitia (Sulcanese m.fl. 2024) | Magellans billeder | Intet | Lille (tekst og sted). Billederne fra artiklerne kun, hvis licensen tillader det | **Med (sted og emne)** |
| V-I. Polhvirvlen | Et S-formet øje over sydpolen, der skifter form (Venus Express i infrarødt) | VIRTIS' billeder | Næsten det hele | Lille-mellem | Valgfri (V6) |
| Drivhuseffekten | En animation af varmen, der ikke slipper ud | Tallene (NSSDC) | Det hele | Mellem | Senere (et "Hvorfor?"-kort nu) |

**Ikke med:** Lyn (omstridt), "det askegrå lys" (omstridt), Venus' indre (ingen målinger, kan nævnes under For nørder) og liv i skyerne som andet end et ærligt emne.

## 3. Ingen måner
Venus har ingen måner og ingen ringe. Asteroiden Zoozve (2002 VE68) følger Venus som en "kvasimåne" og nævnes under For nørder. Træet får derfor ingen gruppe "Måner", men en gruppe "Under skyerne".

## 4. Flybyen, stederne og lagene
**Træet:**
```
[Solen] [VENUS] [Jorden] [Mars] [Jupiter] …
▶ Flyby · 6 stop
Venus
UNDER SKYERNE
  Maxwell Montes
  Maat Mons
  Aphrodite Terra
  Pandekagekuplerne (Alpha Regio)
  Venera 13
    🧍 Stå ved Venera 13 (se spørgsmål 4)
```
- **Venus i rækken af kloder** står efter afstanden til Solen: Solen, Venus, Jorden, Mars … (Merkur kommer foran Venus senere).
- **Et sted under skyerne** slår "Under skyerne" til, og det står i toplinjen.
- **Styr-boksen:** "Navne" (stedernes navne på kloden), "Modlys", skyderen "Under skyerne", "Ultraviolet (som Akatsuki)", "Infrarødt (som Parker)" og "Bjergene 10 gange højere" (kun under skyerne).
- **Tiden:** tidsknappen. ⏩ får skyerne til at køre en omgang på under et minut (tempoet sættes i V2).

**Flybyen (6 stop).** Underteksterne er forslag (under ca. 160 tegn) og faktatjekkes i V5.
1. **Venus** (oversigten, synligt lys, Solen fra siden). *"Venus er næsten lige så stor som Jorden. Men det, vi ser, er ikke jorden. Det er et tykt lag af skyer af svovlsyre."*
2. **Skyerne løber om kap** (tæt på skyerne, "Ultraviolet" slås til, ⏩). *"Skyerne suser rundt om Venus på ca. 4 døgn. Selve planeten er 243 døgn om at dreje én gang, og den drejer baglæns."*
3. **Under skyerne** (skyerne toner væk over Ishtar Terra). *"Radar kan se gennem skyerne. Magellan kortlagde næsten hele Venus fra 1990 til 1994. Maxwell Montes er ca. 11 km højt."*
4. **Maat Mons** (lavt over vulkanen, "Bjergene 10 gange højere" foreslås). *"Maat Mons er en vulkan på ca. 8 km. På Magellans billeder voksede et krater i 1991, så der er nok stadig udbrud på Venus."*
5. **Natsiden gløder** (natsiden, "Infrarødt" slås til). *"Jorden på Venus er 464 °C, så natsiden gløder svagt gennem skyerne. De høje bjerge er køligere og ses som mørke pletter."*
6. **Ned til Venera 13** (ned gennem skyerne med måleren, spørgsmål 5). *"I 1982 landede Venera 13 her og tog farvebilleder. Den holdt i 127 minutter i 457 °C og 89 gange Jordens lufttryk."*

**Lagene** (Kort, emner, For nørder, Billederne og Ærligt talt):
- **Emner:** "Hvorfor er Venus så varm?" (drivhuseffekten i CO₂-luften, varmere end Merkur), "Et døgn, der er længere end et år?" (stjernedøgnet og soldøgnet, og Solen står op i vest), "Skyer af syre" (og regnen, der aldrig når jorden), "Vulkaner i live?", "Liv i skyerne?" (de jordlignende lag 50-65 km oppe og fosfinen fra 2020, som ikke er bekræftet), "Hvordan ser man gennem skyer?" (radar) og "Alle navnene er kvinder".
- **"Hvorfor?"-kort:** "Hvorfor er Venus varmere end Merkur?" og "Hvorfor drejer Venus baglæns?" (det ved man ikke: et sammenstød eller Solens tidevand i den tykke luft).
- **For nørder:** de to døgn med NSSDC's tal (og fælden med 243,690), aksen 177,36° (eller "2,64° og baglæns"), superrotationen (hvorfor er ikke helt forstået), gløden med Plancks lov (regnes i V3), radaren (lys = ru, lyser fra siden), "metalsneen" på bjergtoppene, radius 6.051,0 eller 6.051,8 km, 92 bar som ca. 900 m under havet, Zoozve og de kommende sonder (DAVINCI 2030, VERITAS og EnVision 2032, med dato).
- **Ærligt talt:** Under skyerne viser Venus uden luft og set med radar, tonet orange. Højderne har kun 4,6 km pr. pixel. Skyernes mønster er målt eller tegnet (afhænger af spørgsmål 1). Veneras farver er lyset dernede, ikke stenenes farve.
- **Billederne:** Magellan (NASA/JPL/USGS), Venera 13 (USSR, NSSDC), Akatsuki (ISAS/JAXA), Parker Solar Probe (NASA/Johns Hopkins APL/NRL) og Venus Express (ESA).
- **Ordbogen:** fx radar, drivhuseffekt og superrotation (ingen af dem findes endnu), hver højst 260 tegn.

## 5. Himlen fra hvert stop
Reglen fra jer: realistisk, og ingen prikker, der ikke findes.
| | Over skyerne | Under skyerne og på jorden |
|---|---|---|
| **Solen** | 1,38 gange så bred som fra Jorden (ca. 44 bueminutter) og 1,91 gange så meget lys. Blændende | Kan ikke ses. Lyset er dæmpet og orange |
| **Himlen** | Sort med stjerner | Orange og diset, ingen stjerner |
| **Planeterne** | Jorden og Månen er de klareste "stjerner", men de kommer først med overblikket (som ved de andre planeter) | Ingen |
| **Måner** | Ingen | Ingen |

- **Tjek ved hvert stop** (tjekliste E): Slå én ting fra ad gangen, og se, om der står noget på himlen, der ikke findes.
- **Lyset er stærkt:** Venus kaster ca. tre fjerdedele af lyset tilbage, så eksponeringen skal skrues ned over skyerne (det modsatte af Uranus og Neptun), og det siges ærligt, hvis billedet tilpasses.

## 6. Tablet og ydelse
| | Pc | Tablet og telefon (`LAV_KVALITET`) | Tests (`TEST_HURTIG`) |
|---|---|---|---|
| Radarkortet | 8192 × 4096, én kanal | 4096 × 2048 (8k som Mars, hvis det kører fint) | 2048 |
| Højderne | som Mars | som Mars | som Mars |
| Skyerne | 4096 × 2048 | 2048 × 1024 | 1024 |
| Lokale net (Maat Mons, Maxwell Montes) | 4096 × 4096 af 225 m-kortet | 2048 × 2048 | fra |
| Venera 13's foto | lille (ca. 1.000 punkter bredt) | samme | samme |

- **Hentes på forhånd** som ved Mars og Jupiter: skyerne først (det, man ser), så radarkortet og højderne, mens man ser på skyerne. Rejseskiltet (`rejseskilt.js`) bruges ved skift.
- **Mål billeder i sekundet** (tjekliste F) ved stop 2 og 4, før og efter V2 og V3. Sammenlign med Mars.

## 7. Delopgaver
Hver får sit eget go. Model: Opus. Effort: høj (faktatjekket i V5 kræver det, og V1-V4 er ny grafik). Fable kan tjekke planerne for alle planeterne samlet senere ([plan-fable.md](plan-fable.md)).

| Del | Hvad | Genbruger | Tests | Størrelse |
|---|---|---|---|---|
| ✅ **V1: Jorden og skelettet** | `billeder/solsystem/lav_venus.py` (Magellans radar og højder → 8k/4k/2k, huller, radius tjekket i etiketterne), `KILDER.md`. `js/kosmos/venus.js` efter mønstret fra `mars.js`, i `js/solsystem.js` før Jorden. Aksen fra polens RA og Dec, drejningen baglæns, Solen efter datoen (tjekket mod Horizons). Kun "Modlys" og "Bjergene 10 gange højere" i Styr-boksen | `klippeplanet.js`, `rejse.js`, `navne.js`, `hent.js` | Ny `tests/venus.mjs`: starter, henter kortene, drejer baglæns, Solen står op i vest, står stille i pause, ingen konsolfejl. Node: soldøgnet regnet ud fra stjernedøgnet og året er 116,75 døgn | Mellem-stor |
| **V2: Skyerne og superrotationen** | Skylaget med `lavGasplanet` (synligt lys og "Ultraviolet"), `js/data/vinde-venus.js` (målt profil), skyderen "Under skyerne", disen og ringen i modlys, tempoet med ⏩ | `planet.js`, `atmosfaere.js` | Skyerne kører en omgang på ca. 4 døgn ved ækvator og samme vej som planeten, vindene er nul ved polerne, skyderen gør skyerne gennemsigtige, står stille i pause | Mellem |
| **V3: Natsiden og stederne** | "Infrarødt (som Parker)" (gløden regnet ud fra højderne), lokale net af 225 m-kortet ved Maat Mons og Maxwell Montes, "Under skyerne" i træet med stedernes sider og "Navne" | `klippeplanet.js` (`lokalt`), `navne.js` | Højlandene er mørkere end lavlandet i infrarødt, gløden kun på natsiden, stederne ligger de rigtige steder (bredde og længde) | Mellem |
| **V4: Ned til Venera 13** | Turen ned gennem skyerne med måleren (`js/data/luft-venus.js` fra VIRA), lyset og tågen. Efter jeres svar 4 også `lav_venera.py` og "Stå ved Venera 13" med `panorama.js` | `rejse.js`, `panorama.js`, `landskab.js` (eksponeringen) | Trykket og temperaturen passer med VIRA i 3-4 højder, måleren går den rigtige vej, landingen ender ved 7,5° S og 303° Ø, fotoet vender rigtigt | Mellem-stor |
| **V5: Flybyen, træet og siderne** | `TUR` med 6 stop, `js/data/sider/venus.js`, Ordbogen, "Hvorfor?"-kortene og faktatjek af alle tekster (`/faktatjek` med fælderne i del 7) | `flyby.js`, `sideknap.js` | Flybyen igennem alle stop, underteksterne under 160 tegn, knapperne findes ud fra teksten, skærmbilleder af alle stop | Mellem-stor |
| V6: Polhvirvlen | Valgfri, efter V5 | `planet.js` (cykloner fra Jupiter J5) | | Lille-mellem |

**Til sidst:** hele testsamlingen, billeder i sekundet, "Ikke afprøvet" til jeres runde på tabletten, artefaktet "AtomLab Overblik" og `/faerdig`.

## 8. Spørgsmål til jer (med Opus' anbefaling først)
1. **Skyernes kort (et domæne):** Det bedste kort over skyerne i UV er Akatsukis kort over hele kloden i JAXA's arkiv DARTS (`darts.isas.jaxa.jp`, lukket i miljøet). **Anbefaling: Åbn `darts.isas.jaxa.jp` i miljøets Network access før V2,** så skyernes mønster er målt. Eller skal shaderen tegne mønstret ud fra enkeltbilleder (billigere, men tegnet)?
2. **Hvad man ser først:** **Venus, som den ser ud (lyst gullig hvid og næsten glat), med kontakterne "Ultraviolet" og "Under skyerne"** (anbefalet: ærligt, og flybyen viser det spændende). Eller UV som standard, fordi det er mere at se på?
3. **Farven under skyerne:** **Radarens gråtoner tonet orange, som lyset er dernede** (anbefalet, med teksten om, at radaren ikke ser farver). Eller rene gråtoner? Eller højderne i farver som på NASA's kort?
4. **Stå ved Venera 13:** **Kun Veneras foto om kameraet, uden et tegnet landskab** (anbefalet: fotoet er ægte, men lille, og der findes ingen højder i den skala, så et landskab ville være tegnet). Eller et tegnet landskab bag fotoet som Stå på Mars (dyrere og mest tegnet)? Eller ikke med nu?
5. **Ned gennem skyerne:** **Som sidste stop på flybyen og som en knap ved Venera 13 i træet** (anbefalet). Eller kun som knap?
6. **Rækkefølgen:** **V1 → V2 → V3 → V4 → V5** (anbefalet), og V6 kun hvis I vil. Eller V5 før V4, så Venus er færdig hurtigere og V4 kommer bagefter?

### Jeres svar (9. november 2026)
"Vi følger dine anbefalinger."
1. **Skyernes kort:** `darts.isas.jaxa.jp` åbnes i miljøets Network access før V2, så skyernes mønster i UV er målt (Akatsukis kort). Er det ikke åbent, når V2 starter, så spørg igen.
2. **Hvad man ser først:** Venus, som den ser ud (lyst gullig hvid og næsten glat), med kontakterne "Ultraviolet (som Akatsuki)" og "Under skyerne".
3. **Farven under skyerne:** radarens gråtoner tonet orange som lyset dernede, med teksten om, at radaren ikke ser farver.
4. **Stå ved Venera 13:** kun Veneras foto om kameraet, uden et tegnet landskab.
5. **Ned gennem skyerne:** sidste stop på flybyen og en knap ved Venera 13 i træet.
6. **Rækkefølgen:** V1 → V2 → V3 → V4 → V5. V6 (polhvirvlen) kun, hvis I vil.

## Status
*Prompten er [prompt-venus.md](prompt-venus.md).*

- ✅ **V1 (9. november 2026):** `lav_venus.py` (radaren 8k/4k/2k i gråtoner, højderne 4k/2k, huller fyldt blødt, mørke sømme og springet ved 180° rettet), `js/kosmos/venus.js` mellem Solen og Jorden, `js/data/venus.js` (aksen fra IAU's pol, W efter datoen, Solen efter banen, tjekket mod Horizons inden for 0,02°), "Bjergene 10 gange højere" og "Modlys", en kort side og `tests/venus.mjs`. Radius 6.051,0 km som kortene (fælde 13). Tempoet er foreløbigt (▶ en time i sekundet, ⏩ et døgn i sekundet) og sættes i V2. Koden: [kode/venus.md](kode/venus.md).
- **Næste: V2** (skyerne og superrotationen). Tjek først, at `darts.isas.jaxa.jp` er åben (den svarede 9. november 2026).
