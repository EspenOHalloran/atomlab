*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

## B. Phobos, Deimos, formmodeller, licenser og panoramaer

Lavet 24. oktober 2026 til AtomLab (Solsystemet: Mars' måner i 3D).

### Sådan blev der tjekket

- **Læst direkte (curl):** USGS' S3-spejl (`asc-pds-services.s3.us-west-2.amazonaws.com`): mappelister, `.lbl`, `_pds3.lbl`, `.tif.xml`, `.vrt`, `.txt` og README. Desuden kunne **astrogeology.usgs.gov** (produktsiderne i Astropedia) åbnes direkte. Det havde vi ikke regnet med, og licensfelterne ("Access/Use Constraints") er læst dér. Fra **raw.githubusercontent.com** er Thomas' formmodel af Deimos (`m2deimos.tab`) hentet fra et spejl og tjekket med SHA-256 (se afsnit 7).
- **Hentet og målt selv:** Phobos-højdekortet `Phobos_ME_HRSC_DEM_Global_2ppd.tif` (0,5 MB) og Deimos-kortet `deimoscyl4.jpg` (0,6 MB). Volumen, akser og radier er regnet ud med numpy (afsnit 7).
- **Kun søgeuddrag (WebSearch):** NASA, JPL, ESA, JAXA, Wikipedia, Springer og PMC. De kunne ikke åbnes, heller ikke med WebFetch (DNS-fejl). Står der **(uddrag)**, er påstanden kun læst i et søgeuddrag. **(direkte)** betyder, at kilden er læst i sin helhed. **(egen udregning)** betyder, at tallet er regnet ud her.
- **upload.wikimedia.org:** Thumbnails kunne hentes, men originalfilerne svarede **429 Too Many Requests** (hastighedsgrænse for denne IP). Om en fil findes, er tjekket med thumbnail-adresser (404 = findes ikke).
- Sikkerhed: **S** = sikker, **RS** = ret sikker, **U** = usikker.

---

### 1. Phobos

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Akser (bedste ellipsoide), radier | 12,95 × 11,30 × 9,16 km (diameter ca. 26 × 22,6 × 18,3 km) | Ernst m.fl. 2023, *Earth, Planets and Space* 75, doi:10.1186/s40623-023-01814-7 (uddrag) | S |
| Samme, fra USGS/DLR-højdekortet | 12,95 × 11,32 × 9,09 km (ellipsoide tilpasset); største udstrækning 26,0 × 23,3 × 19,6 km | Egen udregning på `Phobos_ME_HRSC_DEM_Global_2ppd.tif` (Willner m.fl. 2010) | S |
| Middelradius | 11,08 ± 0,04 km | JPL SSD, Planetary Satellite Physical Parameters, https://ssd.jpl.nasa.gov/sats/phys_par/ (uddrag); Ernst 2023 (uddrag); egen udregning 11,08 km | S |
| Rumfang | 5 742 ± 35 km³ (Willner m.fl. 2014), 5 695 ± 32 km³ (Ernst 2023); højdekortet giver 5 703 km³ | Uddrag fra A&A 2024 og arXiv 2508.07910; egen udregning | S |
| GM | 0,0007087 km³/s² | JPL SSD (uddrag) | S |
| Masse | 1,06 × 10¹⁶ kg (GM/G) | Egen udregning ud fra JPL's GM | S |
| Tæthed | ca. 1,86 g/cm³ (JPL 1,872 ± 0,076; Ernst 1,861; Willner 2014 1,867, med nyere GM 1,846) | JPL SSD, Ernst 2023, Willner 2014 (alle uddrag) | S (skriv "ca. 1,9 g/cm³ – lidt over halvdelen af almindelig sten") |
| Geometrisk albedo | ca. 0,07 (0,071 ± 0,012) | Zellner & Capen 1974 via tabel i EPS 2021 og NAP-rapport (uddrag) | RS (skriv "kun ca. 7 % af lyset kastes tilbage – mørk som asfalt") |
| Banens radius (fra Mars' centrum) | ca. 9 376 km (kilderne siger 9 375–9 378 km) | JPL SSD mean elements (uddrag via tabeller), USGS .tif.xml "9375 km" (direkte) | S |
| Højde over overfladen | ca. 5 980 km over ækvator (9 376 − 3 396) | Egen udregning; USGS .tif.xml: "approximately 6000 km" (direkte) | S |
| Omløbstid | 0,3189 døgn = 7 t 39 min | JPL SSD (uddrag), Princeton-tabel (uddrag) | S |
| Banens hældning og excentricitet | ca. 1,1° og 0,015 | Hukommelse, ikke tjekket | U (udelad eller tjek) |
| Står op i vest, går ned i øst | Ja, fordi den kredser hurtigere, end Mars drejer (under den synkrone bane) | Mange kilder (uddrag) | S |
| Hvor tit | Phobos går over himlen for hvert ~11 t 6 min (egen udregning: 1/(1/7,654 t − 1/24,623 t)). Det er ca. 2,2 gange pr. sol, altså "som regel to gange om dagen". Hver passage varer højst ca. 4 t 15 min | Egen udregning; Wikipedia (uddrag) | S (selve tallet), RS (4 t 15 min) |
| Kan ikke ses fra polerne | Kun fra ca. under 70° bredde; "over horisonten fra under en tredjedel af overfladen ad gangen" | JPL-nyhed (uddrag) | RS |
| Bundet rotation | Vender samme side mod Mars. Den lange akse peger mod Mars, og den svinger (librerer) ca. 1,1–1,2° | arXiv 2410.21707 og A&A (uddrag) | S |
| Spiraler indad | Mange kilder siger 1,8 cm/år (≈ 1,8–2 m pr. 100 år). Den målte acceleration (Bills m.fl. 2005: s = ½·dn/dt = 1,367·10⁻³ °/år²) giver omregnet ca. 4 cm/år (egen udregning), og arXiv 1003.4961 skriver 3,8 cm/år | Uddrag + egen udregning | **U** – skriv "nogle få centimeter om året" |
| Hvornår det ender | Revet i stykker til en ring om ca. 20–40 mio. år (Black & Mittal 2015, *Nature Geoscience*); ældre skøn: styrter ned om 30–50 mio. år | space.com, livescience (uddrag); egen kontrol: ~4 cm/år giver ca. 40 mio. år til overfladen | RS for "om nogle tit millioner år"; U for præcise tal |
| Stickney-krateret | ca. 9 km i diameter, næsten halvdelen af Phobos' bredde. Opkaldt (1973) efter Angeline Stickney Hall, Asaph Halls kone | Wikipedia, APOD (uddrag) | S (størrelse RS: 8–9 km afhængigt af kilde) |
| Rillerne (grooves) | Lange parallelle riller. Forklaringerne er omstridte: (1) kampesten fra Stickney, der rullede og hoppede (Wilson & Head 1970'erne; Ramsley & Head 2018), (2) revner fra tidevandskræfter, mens Phobos falder indad (NASA-ledet studie, Hurford m.fl. 2016), (3) kæder af kratere fra stumper, der blev slynget op fra Mars (Murray & Heggie) | brown.edu, space.com, sciencedaily (uddrag) | S for "man er ikke enige" |
| Mars set fra Phobos | Ca. 42° bred (2·arcsin(3 390/9 376)), altså ca. 80 gange Månens bredde på vores himmel | Egen udregning | S |
| Phobos set fra Mars | 8′ (ved horisonten) til ca. 12′ (lige over hovedet) fra ækvator. Det er ca. 1/3 af fuldmånens 31′ | Wikipedia/Astronomy (uddrag); egen udregning 12–13′ | S |
| Phobos foran Solen | Perseverance (Mastcam-Z) filmede den 2. april 2022 (sol 397) en passage, der varede lidt over 40 sekunder. Phobos dækker aldrig hele Solen (ringformet/delvis formørkelse) | JPL-nyhed "NASA's Perseverance Rover Captures Video of Solar Eclipse on Mars" (uddrag) | S |

### 2. Deimos

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Akser (bedste ellipsoide), radier | 8,04 × 5,89 × 5,11 km (diameter ca. 16 × 12 × 10 km) | Ernst m.fl. 2023 (uddrag) | S |
| Udstrækning i Thomas' formmodel | 16,0 × 12,7 × 11,1 km | Egen udregning på `m2deimos.tab` | S |
| Middelradius | 6,2 km (JPL: 6,2 ± 0,24); Ernst 2023: 6,27 ± 0,07 km | JPL SSD, Ernst 2023 (uddrag) | S |
| Rumfang | ca. 1 018 km³ (Thomas 1993-modellen); Ernst' model er ca. 2 % større | Egen udregning; Ernst 2023 (uddrag) | S |
| GM / masse | 0,0000962 ± 0,0000028 km³/s² → 1,44 × 10¹⁵ kg (ca. 1/7 af Phobos) | JPL SSD (uddrag); egen udregning | S (±3 %) |
| Tæthed | 1,47 ± 0,17 g/cm³ | JPL SSD (uddrag) | RS |
| Albedo | ca. 0,07 (0,068 ± 0,007) | Thomas m.fl. 1996 via tabel (uddrag) | RS |
| Banens radius | ca. 23 460 km (kilderne siger 23 458–23 463 km) | JPL via tabeller (uddrag) | S |
| Omløbstid | 1,263 døgn = 30 t 18 min | JPL/Universe Today (uddrag) | S |
| Bevægelse på himlen | Står op i øst og går ned i vest, men meget langsomt: Den er over horisonten i ca. 2,4 sol (2,48 jorddøgn) ad gangen (rettet i "Faktatjek M6b") og kommer igen hver ~5,3 sol | Egen udregning: 1/(1/24,623 t − 1/30,30 t) ≈ 131 t | RS |
| Fjerner sig langsomt | Ligger lige uden for den synkrone bane (ca. 20 400 km), så tidevandet skubber den meget langsomt udad. Ingen sikker hastighed fundet | arXiv, JAXA MMX-news (uddrag) | RS for retningen, U for tempoet |
| Glat overflade | Glattere end Phobos, fordi kratrene er delvist fyldt op med løst støv og grus (regolit) | Wikipedia (uddrag) | S |
| Kratere med navne | Kun to: Swift og Voltaire, opkaldt efter Jonathan Swift (Gullivers rejser, 1726) og Voltaire (Micromégas, 1752), der "gættede" på to Mars-måner. Størrelser: Swift ca. 1–3 km, Voltaire ca. 1,9 km (kilderne er uenige) | Wikipedia (uddrag) | S for navnene, U for størrelserne (udelad) |
| Set fra Mars | Ca. 2′ bred (12 km på ~20 000 km afstand), altså under 1/10 af Månens bredde. Ser ud som en klar stjerne | Egen udregning | RS |

### 3. Opdagelsen

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Opdager | Asaph Hall, US Naval Observatory, Washington, med 26-tommers (66 cm) linsekikkert, dengang verdens største | Wikipedia, Astronomy.com (uddrag) | S |
| Deimos | 12. august 1877 ca. 07:48 UTC (= aftenen den 11. august lokal tid) | Wikipedia "Moons of Mars" (uddrag) | S |
| Phobos | 18. august 1877 ca. 09:14 UTC (= aftenen den 17. august lokal tid). Begge meldt den 18. august | Wikipedia, space.com (uddrag) | S |
| Konen | Angeline Stickney opmuntrede ham til at blive ved | Astronomy.com (uddrag) | S |
| Navnene | Fra Ares' (Mars') sønner i græsk mytologi, der fulgte ham i krig. Phobos (φόβος) = frygt, panik, flugt; Deimos (δεῖμος) = rædsel, skræk. På dansk: **Phobos = Frygt**, **Deimos = Rædsel** | theoi.com, olympioi (uddrag) | S (ESA bytter dem om, se fælder) |
| Hvem foreslog navnene | Henry Madan (Eton) ud fra Iliaden, bog 15 | Hukommelse, ikke tjekket | U (udelad) |

### 4. Hvor kommer månerne fra?

- **To hovedidéer:** (a) indfangede asteroider (farven og spektret ligner mørke C/D-asteroider), (b) samlet af stumper fra et kæmpenedslag på Mars (næsten cirkulære baner tæt ved ækvator passer bedre). Rosenblatt m.fl. 2016 (*Nature Geoscience*) og Canup & Salmon 2018 (*Science Advances*) støtter (b). (uddrag) **S** for, at sagen ikke er afgjort.
- **Problemet med (a):** En indfanget asteroide ville typisk have en skæv og hældende bane, og det er svært at få den til at blive cirkulær og ligge over ækvator. **RS**
- **MMX' hovedopgave** er at afgøre det ud fra prøvens mineraler og isotoper. (uddrag, JpGU-abstract) **S**
- Til teksten: "Forskerne ved det ikke endnu. Måske er de indfangede asteroider, måske er de lavet af stumper fra et kæmpe nedslag på Mars."

### 5. JAXA's MMX (Martian Moons eXploration), status oktober 2026

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Opsendt | **20. oktober 2026 kl. 04:41:03 JST** (19. oktober kl. 19:41 UTC) med H3 (flyvning nr. 10, H3-24L) fra Tanegashima | JAXA-pressemeddelelse global.jaxa.jp/press/2026/10/20261020-1_e.html, NASASpaceFlight, SpacePolicyOnline, ESA (uddrag) | S |
| Status | Rumsonden var sund efter opsendelsen (JAXA 21. okt.) | Uddrag fra sekundære kilder | RS |
| Ankomst til Mars | ca. august 2027 | NASASpaceFlight, SpacePolicyOnline (uddrag) | RS |
| Landing på Phobos | Tidligst december 2028 (SpacePolicyOnline); ESA nævnte tidligere 2029–2030 | Uddrag | U |
| Prøve | Mindst 10 g fra Phobos, taget med en kerneprøvetager (C-SMP, ca. 2 cm dyb) og en pneumatisk prøvetager (P-SMP, NASA/Honeybee) | ESA MMX factsheet, Presse-Citron (uddrag) | RS |
| Hjem | 2031, landing i Australien | SpacePolicyOnline, Wikipedia (uddrag) | RS (plan) |
| Med om bord | Roveren IDEFIX (CNES og DLR, ca. 25 kg, ca. 100 dage) og NASA's MEGANE (gamma- og neutronspektrometer). Flyver også forbi Deimos | CNES, DLR (uddrag) | RS |

### 6. Fælder (populære påstande, der er forkerte eller for skarpe)

1. **"Phobos kommer 1,8 m nærmere hvert århundrede"** – Tallet går igen mange steder, men omregnet fra den målte acceleration bliver det ca. 4 cm/år (3,8 cm/år i arXiv 1003.4961). Skriv "nogle få centimeter om året".
2. **"Phobos styrter ned på Mars om 50 mio. år"** – Den bliver nok revet i stykker til en ring først (Black & Mittal 2015), og tallene er skøn (20–50 mio. år).
3. **"Phobos står op i vest to gange om dagen"** – Rigtigt nok ("som regel to gange pr. sol", hver ~11 t), men ikke fra polområderne, hvor den aldrig ses.
4. **"Der er totale solformørkelser på Mars"** – Nej. Phobos er for lille, og Deimos er en prik foran Solen.
5. **"Phobos ser ud som vores Måne"** – Kun ca. 1/3 så bred og ofte kun en tynd skive. Deimos ligner en stjerne.
6. **ESA's side om 17. august bytter navnene om** ("Phobos = fear, Deimos = panic"). Begge betyder frygt-agtige ting, men Phobos er frygt/panik/flugt, og Deimos er rædsel.
7. **"Begge er indfangede asteroider"** – Ikke afgjort (afsnit 4).
8. **"Phobos er det mørkeste i solsystemet"** – Mørk (albedo ~0,07), men fx kometkerner er mørkere.
9. **"Månerne er hule/kunstige" (Shklovskij 1959)** – Byggede på forkerte målinger af, hvor hurtigt banen skrumper (ca. 5 cm/år, senere rettet).
10. **"Swift forudsagde Mars' måner"** – Et heldigt gæt (Swift 1726, Voltaire 1752), og hans tal passer ikke.
11. **"Deimos' regolit har en radartæthed på 1,471 g/cm³"** (Wikipedia) – 1,471 er JPL's tæthed for hele Deimos (masse/rumfang).
12. **"Rillerne skyldes tidevandet"** – Kun én af flere forklaringer.
13. **"Deimos flygter fra Mars"** – Den fjerner sig meget langsomt. Sig ikke, at den "forsvinder snart".
14. **Phobos' "højde over Mars" er ca. 6 000 km fra overfladen, ikke 9 376 km**, som er fra centrum. Hold de to tal adskilt.

---

