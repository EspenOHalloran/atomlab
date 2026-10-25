# Faktagrundlag: Solsystemet

*Trin 0 i [planen for Solsystemet](plan-solsystemet.md). Lavet 23. oktober 2026 af hjælpeagenter (Opus, høj effort). Fable venter på version 5.5, så det er ikke tjekket af Fable. Gennemgangen af planen står i afsnittet "Gennemgang af planen" nederst.*

**Status:** Tallene er tjekket mod søgeresultater og deres uddrag. Ingen kildesider kunne åbnes i miljøet (kun NASA SVS, NASA Earth Observatory og billederne på upload.wikimedia.org kan hentes). Før en tekst kommer med i programmet, skal tallet bag den slås op i kilden med `/faktatjek`, især de punkter, der er mærket RS, U eller "egen viden".

# Del 1: Saturn, Enceladus og Titan (prototypen), Europa, Ganymedes, Mars og billederne

**Hvordan det blev tjekket:** Jeg kunne ikke åbne en eneste kildeside. WebFetch fik DNS-fejl på alle værter (nasa.gov, esa.int, wikipedia, nature.com, usgs.gov), og curl blev afvist af proxyen (403) på alle undtagen svs/eoimages.gsfc.nasa.gov. Alt nedenfor bygger derfor på **søgeresultater** (uddrag og resuméer) plus egen viden. Hvor kun egen viden ligger bag, står der **(egen viden)**. Søgegrænsen for turen (200 søgninger, delt mellem alle agenter) blev nået til sidst, så nogle punkter kunne ikke krydstjekkes. Det gælder JUICE' jordpassage i sept. 2026, Saturns 134 K og hældning og Huygens' 1467 hPa. Før teksterne bruges, bør nogen åbne NSSDC-arkene direkte.

Sikkerhed: **S** = sikker, **RS** = ret sikker, **U** = usikker.

---

## 1. Saturn

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Radius ved ækvator (1 bar) | 60.268 km | NSSDC Saturn Fact Sheet https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html (søgeuddrag) | S |
| Radius ved polen (1 bar) | 54.364 km (ca. 10 % fladere) | samme | S |
| Masse | 568,32 × 10²⁴ kg (ca. 95 Jordmasser) | samme | S |
| Middeltæthed | 687 kg/m³ (vand 1000) | samme | S |
| Døgn (System III, Voyager) | 10,656 t = 10 t 39 min | NSSDC (via Universe Today-uddrag) | RS |
| Døgn (ringseismologi) | 10 t 33 min 38 s (+1 min 52 s / −1 min 19 s) | Mankovich m.fl. 2019, ApJ, https://arxiv.org/abs/1805.10286 | S |
| Døgn (ny analyse) | ca. 634,7 min ≈ 10 t 34,7 min | Mankovich, Dewberry & Fuller 2023, https://arxiv.org/abs/2303.16219 | RS |
| Aksens hældning | 26,73° | NSSDC (egen viden, ikke bekræftet i søgning) | RS |
| Middelafstand til Solen | 9,537 AU ≈ 1.432 mio. km | NSSDC (9,53707 AU i uddrag) | S |
| Omløbstid (år) | 10.759 døgn ≈ 29,4 år (NSSDC's samletabel siger 10.747 døgn) | NSSDC | RS |
| Temperatur ved 1 bar | 134 K ≈ −139 °C (NASA's populærside siger −178 °C som "gennemsnit") | NSSDC (egen viden) | RS |
| Antal kendte måner | **285** (MPC, MPEC 2026-F14, 16. marts 2026: 11 nye fra Ashton-holdet) | IAU: https://www.iau.org/IAU/IAU/News/Ann2026/MPC-New-Moons-Saturn-Jupiter.aspx (søgeuddrag) | RS |

**Døgnet er svært at måle:** Saturn har ingen fast overflade, og magnetfeltet ligger næsten præcis langs aksen, så radiosignalet (SKR) giver ingen sikker rytme. Cassini målte endda, at radioperioden skiftede (ca. 10 t 45-47 min). Det bedste tal kommer nu fra bølger i ringene, som planetens indre sætter i gang (ringseismologi): ca. 10 t 33-35 min. **Forslag:** "ca. 10½ time".

**Månerne:** NASA's side viser måske stadig 274 (marts 2025). Wikipedia siger 293 (juni 2026), men jeg fandt ingen MPC-kilde til det. **Forslag:** "over 280 kendte måner (marts 2026)".

**Sekskanten:** Den sidder ved ca. 77-78° N, er "bredere end to Jordkloder" og er en jetstrøm, der bugter sig (ca. 100 m/s). Voyager opdagede den i 1980-81, og Cassini så den i lys fra 2009. Kilde: NASA/JPL 2009 og Universe Today. Sikkerhed RS. Sidelængden er ca. 13.800-14.500 km (U). Skriv "bredere end to Jordkloder" og ikke et præcist tal.

### Ringene (radius fra Saturns centrum)
Kilder: PDS Ring-Moon Systems Node https://pds-rings.seti.org/saturn/saturn_rings_table.html, NSSDC Ring Fact Sheet https://nssdc.gsfc.nasa.gov/planetary/factsheet/satringfact.html, Britannica og Space Science Reviews-oversigten https://link.springer.com/article/10.1007/s11214-024-01104-y (alle som søgeuddrag).

| Del | Indre kant | Ydre kant | Sikkerhed |
|---|---|---|---|
| D | ca. 66.900-67.000 km | 74.490 km | RS |
| C | 74.490 | 91.975 | S |
| B | 91.975 | 117.570 | S |
| Cassini-delingen | 117.570 | 122.170 (ca. 4.600 km bred, ikke tom) | S |
| A | 122.170 | 136.775 | S |
| Encke-mellemrummet (i A) | 133.423 | 133.745 (ca. 325 km bredt, månen Pan kredser i det) | S |
| F (smal) | ca. 140.200 (centrum) | bredde fra ca. 30 til nogle hundrede km | RS |
| G | 166.000 | 173.000-175.000 | RS |
| E (støv fra Enceladus) | ca. 180.000 | ca. 480.000 (svag, fra Mimas' bane til Dione og længere) | RS |

- **Tykkelse:** NASA skriver, at hovedringene typisk er ca. 10 m høje. Andre skøn siger fra 10 til ca. 100 m. Ved jævndøgn i 2009 så Cassini "bjerge" på op til ca. 2,5-4 km ved B-ringens yderkant. F-ringen er ca. 13 ± 7 km (fra en ringkrydsning i 1995). Sikkerhed RS. Tallet "op til 1 km" er gammelt og hører ikke til hovedringene.
- **Bredde:** Hovedringene (D-A) er ca. 70.000 km brede, og F-ringen ligger ca. 140.000 km fra centrum. Med E-ringen når ringene ca. 480.000 km ud. Forholdet mellem bredde og tykkelse er ca. 10 m mod 70.000 km, altså tyndere end et ark papir i forhold til dets bredde. Sikkerhed S.
- **Stof:** Ringene er over 95 % vandis (måske op til 99 %), med lidt stenstøv og organisk stof. Kilde: Cuzzi m.fl. 2023 og 2024, https://arxiv.org/abs/2311.17344. Sikkerhed S/RS.
- **Partikelstørrelse:** fra støv og centimeter op til flere meter. Middelradius er ca. 1 m i A-ringen, 25-60 cm i B og 10-20 cm i C. Kilde: arXiv 2311.17344. Sikkerhed RS.
- **Masse:** 0,41 ± 0,13 Mimas-masser ≈ 1,5 × 10¹⁹ kg. Kilde: Iess m.fl. 2019, Science (målt af Cassini i Grand Finale). Sikkerhed S.
- **Alder:**
  - Kempf m.fl. 2023 (Science Advances, doi 10.1126/sciadv.adf8537) mener ud fra rumstøv, der falder ned på ringene, at de højst er et par hundrede millioner år gamle (ca. 100-400 mio. år). Kilde: https://www.sciencenews.org/article/saturn-rings-400-million-years-age.
  - Hyodo m.fl. (Nature Geoscience, dec. 2024 / 2025) svarer, at isen ikke bliver beskidt. Når støvet rammer, fordamper det mest og forsvinder, så ringene kan godt være gamle, selvom de ser unge ud. Kilde: https://www.nature.com/articles/s41561-024-01598-9.
  - En ny artikel på arXiv (2603.04102, 2026, ikke fagfællebedømt) giver 0,5-2 mia. år.
  - **Debatten er ikke afgjort.** Sikkerhed S for, at debatten findes.
- **Skygger:** Ringene kaster skygge på Saturn (et mørkt bånd), og Saturn kaster skygge på ringene. Cassini har mange billeder af begge dele. Vinklen afhænger af årstiden på Saturn. Ved jævndøgn (sidst i 2009 og i maj 2025) står Solen i ringenes plan, så ringenes skygge bliver en tynd streg. Sikkerhed S (egen viden).
- **Ringenes bagside:** Fin støvet lys spredes fremad, så C-ringen, Cassini-delingen og F/G/E lyser i modlys. A og B er tætte og ser mørke ud fra den side, der ikke er belyst. Kilde: NASA, søgeuddrag. Sikkerhed S. Det er vigtigt for shaderen.

---

## 2. Enceladus

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Middelradius | 252 km (diameter ca. 504 km) | Wikipedia/NSSDC (søgeuddrag) | S |
| Afstand til Saturn | 238.000 km (238.037) | samme | S |
| Omløbstid | 1,370 døgn (ca. 32,9 t), bunden rotation | samme | S |
| Overfladetemperatur | ca. 75 K ≈ −198 °C i snit (33-145 K). Varmere ved tigerstriberne (op mod ca. 200 K, egen viden) | Wikipedia (søgeuddrag) | RS |
| Albedo | geometrisk ca. 1,38 (højeste i solsystemet), Bond-albedo ca. 0,8 | Verbiscer m.fl. 2005 via Wikipedia | RS |

- **Lysende:** Det er rigtigt at kalde Enceladus "den mest lysende/hvide krop i solsystemet". En geometrisk albedo over 1 er mulig på grund af modstillingseffekten, så skriv **ikke** "reflekterer over 100 %". Skriv i stedet "kaster ca. 80 % af sollyset tilbage", hvilket er Bond-albedoen.
- **Opdagelsen af fontænerne (2005):** I februar og marts 2005 så Cassinis magnetometer (Dougherty-holdet), at Saturns magnetfelt bøjede uden om Enceladus. Ved forbiflyvningen 14. juli 2005 (i 168-175 km afstand) fandt UVIS og INMS en sky af vand over sydpolen. ISS-billederne fra nov. 2005 viste fontænerne direkte. Artiklerne kom i Science 2006 (Porco m.fl. og Dougherty m.fl.). Kilder: https://space.com/38559-how-cassini-discovered-enceladus-plumes.html og https://www.boulder.swri.edu/~spencer/enceladus_jpl_public.pdf. Sikkerhed S.
- **Tigerstriberne:** **4** sprækker, hver ca. **135 km** lang: Alexandria, Cairo, Baghdad og Damascus. Kanterne er 75-200 m høje, og furerne 150-300 m dybe. Porco m.fl. 2014 talte **101 gejsere**. Kilde: NASA PIA10352 (via pds-rings-spejl). Sikkerhed S.
- **Det, Cassini fandt:**
  - vand og salt (natriumsalte i iskornene, Postberg 2009/2011, egen viden)
  - **kiselsyre-nanopartikler** (Hsu m.fl. 2015, Nature), som tyder på vand på mindst ca. 90 °C ved havbunden, altså varme kilder (hydrotermisk aktivitet)
  - **H₂** (Waite m.fl. 2017, Science, fra den dybe passage i okt. 2015)
  - **store organiske molekyler** (Postberg m.fl. 2018, Nature, brudstykker op til ca. 200 u)
  - nye organiske stoffer i friske iskorn (Khawaja m.fl. 2025, Nature Astronomy)
  - **fosfat** (Postberg m.fl. 2023, *Nature* 618, doi 10.1038/s41586-023-05987-9): natriumfosfat i iskorn fra E-ringen og en koncentration "mindst 100 gange" højere end i Jordens have (et skøn ud fra laboratorieforsøg)

  Kilder: https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/news/Postberg_Phosphates_Enceladus.html, https://www.esa.int/Science_Exploration/Space_Science/Cassini_proves_complex_chemistry_in_Enceladus_ocean og https://www.nasaspaceflight.com/2025/10/cassini-new-molecules-enceladus/. Sikkerhed S.
- **E-ringen fodres af fontænerne:** Sikkerhed S (Spahn m.fl. 2006, egen viden, plus søgeuddrag). Fosfatet blev netop fundet i E-ringens korn.
- **Isen og havet:**
  - Čadek m.fl. 2016 (GRL): isen er i snit 18-22 km, men **under 5 km ved sydpolen**. Havet er ca. 45 km dybt, og stenkernens radius er ca. 185 km. Kilde: https://www.centauri-dreams.org/2016/06/23/revisiting-enceladus-ocean/.
  - Thomas m.fl. 2016 (svingninger, libration): isen er 21-26 km og havet 26-31 km (egen viden).
  - **Skriv:** "is på ca. 20 km (tynd ved sydpolen), et globalt hav på ca. 25-45 km". Sikkerhed RS.
- **Cassinis afslutning:** Den styrtede ned i Saturn **15. september 2017** efter 22 baner mellem planeten og ringene (Grand Finale). Brændstoffet var ved at slippe op, og uden styring kunne sonden en dag ramme Enceladus eller Titan og forurene dem med jordiske bakteriesporer (planetbeskyttelse). Kilde: https://www.sciencenews.org/blog/science-ticker/grand-finale-cassini-spacecraft-sets-collision-course-saturn. Sikkerhed S.

---

## 3. Titan

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Middelradius | 2.574,7 km (Merkur 2.439,7 km), men kun ca. 40 % af Merkurs masse | Wikipedia (søgeuddrag) | S |
| Afstand til Saturn | ca. 1,22 mio. km, omløb 15,95 døgn | (egen viden) | S |
| Tryk ved overfladen | ca. **1,5 bar** (Huygens målte 1467 hPa) | søgeuddrag 1,45-1,47 bar, Fulchignoni m.fl. 2005, Nature (egen viden) | S |
| Temperatur ved overfladen | ca. 94 K ≈ −179 °C (Huygens 93,7 K) | samme | S |
| Luftens sammensætning | ca. 95 % N₂, ca. 5 % CH₄ nær overfladen (mindre højere oppe), spor af ethan, acetylen, HCN m.m. | samme | S |

- **Søer og have:** Kraken Mare er størst, ca. 400.000 km² (mere end Det Kaspiske Hav). Ligeia Mare er ca. 160 m dyb i midten (Mastrogiuseppe 2014) og består mest af metan. Kraken er mindst ca. 100 m dyb (måske ca. 300 m) og består af ca. 70 % metan, 16 % N₂ og 14 % ethan (Poggiali 2021). Havene ligger mest ved nordpolen. Kilder: https://www.sciencenews.org/article/cassini-maps-depths-titan's-seas og https://astronomynow.com/2014/11/10/cassini-sounds-the-depths-of-kraken-mare-titans-largest-sea/. Sikkerhed RS. **Fælde:** "Ligeia er af ethan" er forkert, for den er mest metan.
- **Regn af metan:** Der er et kredsløb af metan som Jordens vandkredsløb. Cassini så store skysystemer i sept.-okt. 2010, og bagefter blev jorden mørk, som om den var våd (Turtle m.fl. 2011, Science). Sikkerhed RS.
- **Det orange dis:** Sollys og elektroner fra Saturns magnetfelt bryder metan og nitrogen op i højden. Så dannes støvkorn af kulbrinter og nitriler, der giver det orange dis. "Tholiner" er laboratoriets navn for den slags stof, og ordet er populært, men de rigtige korn er ikke det samme som laboratoriets tholiner. Skriv "orange smog af organiske støvkorn (kaldes ofte tholiner)". Sikkerhed RS.
- **Havet dybt inde:** Det er **nu omstridt.**
  - Iess m.fl. 2012 (Science) fandt, at Titan bøjer meget under Saturns tidevand (k₂ ≈ 0,6), og det blev tolket som et hav af vand under en isskal på ca. 50-100 km.
  - **Petricca m.fl., *Nature* 648 (dec. 2025), "Titan's strong tidal dissipation precludes a subsurface ocean":** Titan bliver varmet for meget af tidevandet (Q ≈ 5), til at der kan være et globalt hav. I stedet foreslår de et lag af sjapis under højt tryk med lommer af vand (måske lige så meget vand som Atlanterhavet). Downey & Nimmo 2025 (Science Advances) fandt også Q ≈ 5.
  - Kilder: https://physicstoday.aip.org/news/data-reanalysis-throws-existence-of-an-ocean-on-titan-into-question og https://astrobiology.com/2025/12/17/titan-may-not-have-a-global-ocean/.
  - **Forslag til teksten:** "Man troede længe, at der var et hav dybt inde. En ny analyse (2025) tyder på sjap med lommer af vand i stedet. Det diskuteres stadig." **Planen og tværsnittet skal rettes.**
- **Huygens:**
  - landede **14. januar 2005** efter en nedstigning på **2 t 27 min 50 s** i faldskærm (ESA https://sci.esa.int/web/cassini-huygens/-/36280-titan-surface-landing). Sikkerhed S.
  - Cassini tog imod data fra overfladen i ca. **72 min** (ESA/JPL-konferenceartikel). NASA og ESA skrev i 2006 "71 min", og så forsvandt Cassini under horisonten. Sikkerhed RS. Skriv "godt en time".
  - Radioteleskoper på Jorden (fx Green Bank) hørte bærebølgen. Hvor længe efter landingen er U, så lad det være.
  - Huygens så flodlejer og afrundede "sten" af is på ca. 10-15 cm på en fugtig, sandagtig flade (egen viden). Sikkerhed RS.
- **Dragonfly:**
  - NASA's side siger **opsendelse tidligst juli 2028** (vindue 5.-25. juli 2028, Falcon Heavy) og **ankomst sidst i 2034**. Kilder: https://science.nasa.gov/mission/dragonfly/, APL sept. 2025 og Forbes aug. 2026. Sikkerhed S.
  - "Juni 2027" og "2026" er forældede datoer.

---

## 4. Kort om de andre

**Europa**
- NASA: isskal ca. 15-25 km, hav ca. 60-150 km dybt, "ca. dobbelt så meget vand som alle Jordens have". Kilde: https://europa.nasa.gov/in-depth. Sikkerhed RS.
- **Nyt:** Junos mikrobølgeradiometer målte i 2022 en isskal på **ca. 29 km** i det område, den så. Det er det kolde, stive lag, og hele skallen kan være tykkere (Levin m.fl., dec. 2025, NASA/JPL 28. jan. 2026, https://www.jpl.nasa.gov/news/nasas-juno-measures-thickness-of-europas-ice-shell). Sikkerhed RS. **Planens "15-25 km" bør blive til "ca. 15-30 km eller mere".**
- **Europa Clipper:** opsendt **14. okt. 2024** (Falcon Heavy), forbi Mars **1. marts 2025**, **forbi Jorden 2.-7. dec. 2026 (lige om lidt)**, ankomst til Jupiter **11. april 2030**. Kilde: https://jpl.nasa.gov/press-kits/europa-clipper/mission. Sikkerhed S.

**Ganymedes**
- Største måne, radius 2.634 km (større end Merkur). Sikkerhed S.
- **Eget magnetfelt** som den eneste måne, opdaget af Galileo i 1996 (Kivelson m.fl., Nature 1996). Sikkerhed RS (egen viden).
- Hav: polarlysets vuggen målt med Hubble (Saur m.fl. 2015) viser et saltvandshav. NASA skrev ca. 100 km dybt under ca. 150 km is (egen viden af pressemeddelelsen). Kilde: https://spaceflightnow.com/2015/03/13/hubble-observations-reveal-ocean-on-ganymede/. Sikkerhed RS.
- **JUICE** (ESA):
  - opsendt **14. april 2023** (Ariane 5)
  - forbi Månen og Jorden aug. 2024 (S), forbi Venus aug. 2025 (RS, at det skete), forbi Jorden sept. 2026 (U, at det skete), forbi Jorden igen jan. 2029
  - ankomst til Jupiter **juli 2031** (S)
  - i bane om Ganymedes **2034** (RS, december egen viden)

  Kilde: https://www.esa.int/Science_Exploration/Space_Science/Juice/Juice_rerouted_to_Venus_in_world_s_first_lunar-Earth_flyby.

**Mars: Cheyava Falls**
- Perseverance tog prøven "Sapphire Canyon" i juli 2024 i Bright Angel-lagene i Neretva Vallis (Jezero). NASA fortalte om den i juli 2024. Sikkerhed RS.
- Artiklen i *Nature* udkom 10. sept. 2025 (Hurowitz m.fl., "Redox-driven mineral and organic associations…", forfatter og titel er egen viden).
- **Fundet:**
  - organisk kulstof
  - "leopardpletter" med mørke kanter med **vivianit** (jernfosfat), også i de små "valmuefrø"-prikker
  - **greigit** (jernsulfid) inde i pletterne
  - mønsteret passer med kemiske reaktioner, som mikrober kan få energi fra
- **Ikke bevist:** Mineralerne kan også dannes uden liv. NASA kalder det en "**potentiel biosignatur**" (et muligt spor af liv), ikke et bevis. Det kræver, at prøven kommer til Jorden. Kilder: https://www.planetary.org/articles/a-biosignature-on-mars-unpacking-perseverances-cheyava-falls-find og https://www.jpl.nasa.gov/images/pia26640-perseverances-pixl-finds-vivianite-greigite-in-cheyava-falls-sample/. Sikkerhed S.

---

## 4b. Flybyen ved Saturn: de andre store måner (faktatjek 24. oktober 2026)

Teksterne til flybyen i `js/kosmos/saturn.js` er tjekket af en hjælpeagent (Opus, høj effort). **Alle kilder er kun set som søgeresultater** (WebFetch kunne ikke nå siderne). Tjek de vigtigste tal på JPL SSD (https://ssd.jpl.nasa.gov/sats/phys_par/ og /sats/elem/), NSSDC og USGS Gazetteer (Herschel Feature/2478, Odysseus Feature/4406, Ithaca Chasma Feature/2751). Længdegrader for Saturns måner er i Gazetteer målt mod **vest** (øst = 360° − vest).

| Påstand | Vurdering | Kilde | Brugt i teksten |
|---|---|---|---|
| Saturn er 120.536 km bred, ca. 9½ Jorder | rettet (ikke "ni") | NSSDC, NASA/JPL | "Ca. 9½ Jorder kan ligge på række" |
| Ringene: D til A ca. 70.000 km, mange steder ca. 10 m tykke, over 95 % is, fra støvkorn til "as big as a house" | OK med "mange steder" og "over 95 %" | NASA PIA14943, Hsu m.fl. 2018 (Science) | ja |
| Cassini-delingen | ringtabellen giver 117.580-122.170 km ≈ 4.600 km, NASA skriver 4.800 km | PDS-ringtabel, NASA Photojournal | "ca. 4.600 km" (som ringdataene i `js/data/ringe.js`) |
| Mimas: 396 km, 0,942 døgn (22,6 t), 185.540 km | OK | JPL, NSSDC | ja |
| Herschel: **139 km** (NASA's oversigtsside siger 130), 1,38° S, 111,76° V | rettet | Gazetteer, NASA Photojournal 2017 | "ca. 140 km, cirka en tredjedel" |
| Herschel blev først set af Voyager 1 i november 1980, Star Wars kom i 1977 | OK | NSSDC, DLR | ja |
| Slaget var "probably close to breaking the moon apart" | OK med "måske" | NASA | "var måske tæt på at slå Mimas i stykker" |
| Mimas' hav: 20-30 km under overfladen, yngre end 25 mio. år (pressemeddelelsen: 5-15 mio.), ikke afgjort | præciseret | Lainey m.fl., Nature 626:280 (7. feb. 2024) | "kan være et hav … forskerne er ikke helt enige" |
| Enceladus' fontæner er vanddamp og iskorn (ikke flydende vand) | rettet | Thomas m.fl. 2016 og afsnit 2 | "vanddamp og iskorn" |
| Tethys: 1.062 km, 294.620 km, tæthed ca. 0,98 | OK | JPL | ja |
| Odysseus: 445 km, 32,82° N, 128,89° V, ca. 2/5 af månen | OK | Gazetteer | ja |
| Ithaca Chasma: Gazetteer 1.219 km, NASA "more than 1,000 km", ca. 100 km bred, 3-5 km dyb. "Tre fjerdedele rundt" stammer fra Voyager-tidens "mindst 270°" og passer ikke med 2.000 km | rettet | Gazetteer, NASA, NTRS 19920001547 | "over 1.000 km lang og op til ca. 100 km bred" |
| Dione: 1.123 km, 377.400 km, isklipper på flere hundrede meter på den bagerste halvkugle | OK | JPL, NASA/JPL | ja |
| Diones hav: en model ud fra tyngdemålinger, ca. 100 km under overfladen | OK med "måske" | Beuthe m.fl. 2016 (GRL) | "måske et hav ca. 100 km under isen, men det er ikke sikkert" |
| Rhea: næststørst, 1.527 km, 527.100 km, måske ca. ¾ is | OK med "måske" | JPL, NASA | ja |
| Titan: større end Merkur, men kun ca. 40 % af massen. Søerne ligger mest ved nordpolen | OK | IMCCE, ESA/NASA | ja |
| Antal måner: 285 i marts 2026. 293 i juni 2026 ifølge søgeresultater (APOD, Wikipedia) | usikkert tal | MPC/IAU | "over 280 (2026)" |
| Geometrisk albedo (Verbiscer m.fl. 2007): Mimas 0,96, Enceladus 1,38, Tethys 1,23, Dione 1,0, Rhea 0,95, Titan 0,22. NSSDC har ældre, lavere tal | kun til lysstyrken i tegningen | Science 315:815 | `lys` i `MÅNER` (forholdet mellem månerne) |

**Hvor turen kigger hen** (østlig længde, som på kortene): Herschel ved ca. −112° (248° Ø), Odysseus ved ca. −129° og 33° N, Diones isklipper omkring 60-110° Ø.

---

## 5. Billeder til prototypen

| Hvad | Kilde / URL | Licens | Opløsning |
|---|---|---|---|
| **Enceladus** | USGS "Enceladus Cassini ISS Global Mosaic 110m" https://astrogeology.usgs.gov/search/map/enceladus_cassini_global_mosaic_110m (også en udgave med højpasfilter) og en nyere fra Schenk på 100 m (2024) https://astrogeology.usgs.gov/search/map/enceladus-cassini-global-mosaic-100m-schenk | NASA/JPL/SSI/USGS, normalt public domain (U, ikke læst på siden) | 14401 × 7201 px, ét gråt bånd, cylindrisk (S). Skal skaleres ned til 4k/2k |
| **Titan (overflade)** | USGS "Titan Cassini ISS Global Mosaic 4005m" https://astrogeology.usgs.gov/search/map/titan_cassini_iss_global_mosaic_4005m (2015, data til T100) og 450 m-udgaven (+45° til −65°). NASA PIA22770 (VIMS-farvemosaik i infrarødt, https://photojournal.jpl.nasa.gov/catalog/PIA22770) | public domain (RS) | 4 km/px ≈ ca. 4000 × 2000 px (RS). Det orange dis dækker alligevel det meste, så overfladen ses kun svagt eller i "infrarød"-tilstand |
| **Saturn (planeten)** | Solar System Scope `8k_saturn.jpg` / `2k_saturn.jpg`, https://www.solarsystemscope.com/textures/ | **CC BY 4.0** (skal krediteres). Bekræftet via Qt's licensside https://doc.qt.io/qt-6/qt3d-attribution-solar-system-scope.html | 8192 × 4096 / 2048 × 1024 (RS) |
| **Ringene** | Solar System Scope `8k_saturn_ring_alpha.png` / `2k_saturn_ring_alpha.png` (farve plus gennemsigtighed i én linje) | CC BY 4.0 | ca. 8192 × 500 og 2048 × 125 (fra en genudgivelse, RS) |
| Ringene, alternativ | Björn Jónsson (https://bjj.mmedia.is/data/saturn/), kort over Saturn og ringe med gennemsigtighed og forskellig lysstyrke for belyst og ubelyst side | Ifølge citater "ingen særlig tilladelse, men nævn ophavet". FlatPlanet kalder det dog "non-redistributable" | U. Skriv til ham før brug |
| Ringene, selv lavet (anbefales) | Cassini UVIS-okkultationer: optisk dybde τ efter radius, 1 og 10 km opløsning, PDS Ring-Moon Systems Node https://pds-rings.seti.org/ | NASA PDS-data, public domain | Gennemsigtighed = e^(−τ/μ) giver de **rigtige** mellemrum og kan ses forfra og bagfra. Beregnes som `lav_billeder.py` |
| Steve Albers | stevealbers.net / laps.noaa.gov/albers/sos (kort over Enceladus på 8k m.fl.) | ukendt | U. Siderne kunne ikke tjekkes, og hans kort er drejet 180° i længde |

**Anbefaling:**
- Enceladus og Titan fra USGS.
- Saturn fra Solar System Scope (CC BY 4.0) med kreditering i LICENSE og "Om AtomLab".
- Ringene regnes selv ud fra PDS-okkultationsprofiler, eller man bruger Solar System Scopes ringbillede som en hurtig første udgave.

---

## Fælder (populære påstande, der er forkerte eller for skarpe)

- **"Saturn ville flyde i et badekar."** Middeltætheden (687 kg/m³) er lavere end vands, men Saturn er ikke ens hele vejen igennem. Den har en tæt kerne og bliver trykket sammen indefra, så en gaskugle ville ikke "flyde". Skriv: "Saturn er i gennemsnit lettere end vand. Det er den eneste planet, der er det."
- **"Ringene er op til 1 km tykke."** Hovedringene er typisk ca. 10 m (højst ca. 100 m). Kun enkelte bølger ved kanterne er nogle km høje.
- **"Ringene er massive" eller "skiver".** De er milliarder af isklumper, der hver kredser for sig.
- **"Cassini-delingen er tom."** Der er stof i den, bare mindre end i A og B.
- **"Ringene er 4,5 mia. år gamle" eller "unge (100 mio. år)".** Begge dele er omstridte. Skriv "måske kun et par hundrede millioner år, men det diskuteres".
- **"Saturns døgn er 10 t 39 min."** Det er Voyagers radiotal. Det bedste nuværende skøn er ca. 10 t 33-35 min.
- **"Saturn har 146 / 274 måner."** Tallet ændrer sig. Skriv altid datoen.
- **"Titan har en atmosfære som den tidlige Jord."** For skarpt. Den tidlige Jords luft var ca. 200 K varmere og havde meget CO₂ og vanddamp. Titan har kun nitrogen som fælles træk, plus kemi, der måske ligner. Skriv: "Kemien i Titans luft minder måske om noget af det, der skete på den unge Jord."
- **"Titan har et hav af vand dybt inde"** som fakta. Det er omstridt siden dec. 2025 (se ovenfor).
- **"Søerne på Titan er af ethan."** De er mest metan (Kraken har også ethan og opløst nitrogen).
- **"Titan er større end Merkur, så den er tungere."** Den har kun ca. 40 % af Merkurs masse.
- **"Enceladus reflekterer mere end 100 % af lyset."** Geometrisk albedo ≠ andel af lyset. Den kaster ca. 80 % tilbage.
- **"Cassini fandt liv eller tegn på liv på Enceladus."** Den fandt ingredienser (vand, energi, organiske stoffer og fosfat), ikke liv.
- **"Cassini opdagede fontænerne på et billede i 2005."** Magnetometeret opdagede dem først (feb.-marts), og bekræftelsen kom med flere instrumenter i juli 2005.
- **"Cassini styrtede ned, fordi den gik i stykker."** Det var med vilje, for at beskytte månerne.
- **"Europa har dobbelt så meget vand som Jorden."** Det er dobbelt så meget som Jordens **have**. Det er et skøn.
- **"Europas is er 15-25 km."** Juno målte ca. 29 km i ét område, så tallet er mere usikkert, end planen siger.
- **"Der er fundet liv på Mars" (Cheyava Falls).** Det er en *potentiel* biosignatur. Mineralerne kan også dannes uden liv.
- **"Dragonfly opsendes i 2027."** Det er forældet. Nu juli 2028 med ankomst i 2034.
- **"Saturn har en sekskantet sky."** Det er en jetstrøm (vind), der bugter sig. Skyerne følger den.

---

## Mindst sikre påstande (bør tjekkes på kildesiden)

1. **Antal måner:** 285 (MPC marts 2026) mod Wikipedias 293 (juni 2026). Jeg kunne ikke se MPEC'en selv.
2. **Titans hav:** Petricca 2025 er en enkelt (dog stærk) analyse, og forskerne har ikke afgjort sagen. Formuler det forsigtigt.
3. **Saturns temperatur ved 1 bar (134 K) og hældning (26,73°):** fra hukommelsen om NSSDC. Søgningen kunne ikke bekræfte dem, før grænsen blev nået.
4. **JUICE' jordpassage i sept. 2026 og Venus-passagen i aug. 2025:** Jeg fandt ingen bekræftelse af, at de er sket. Datoen for banen om Ganymedes ("dec. 2034") er egen viden.
5. **Huygens på overfladen:** 71 eller 72 min (begge står i officielle kilder). Hvor længe radioteleskoperne hørte den, er ukendt.
6. **Sekskantens mål:** sidelængde og bredde. Brug "bredere end to Jordkloder".
7. **Ringenes ydre kanter (G 173.000 eller 175.000 km, E ca. 480.000 km) og D-ringens indre kant:** Kilderne er lidt uenige.
8. **Licenserne:** Björn Jónssons kort er uklare. Licenstekst og opløsning for USGS-mosaikkerne og Solar System Scope er ikke læst direkte på siderne.
9. **Enceladus' havdybde:** 26-31 km (Thomas 2016, egen viden) mod ca. 45 km (Čadek 2016). Brug et interval.
10. **Ganymedes' hav:** "ca. 100 km dybt under 150 km is" er egen viden af NASA's pressemeddelelse fra 2015.

Ingen filer er ændret.

# Del 2: Voyager, Den store tur og slyngfysikken (til Rumrejsen)

**Status: IKKE tjekket på nettet.** Grænsen for websøgninger var brugt op, da denne del blev lavet (23. oktober 2026), så alt herunder er fra hjælpeagentens hukommelse. URL'erne er der, hvor tallene skal slås op. Sikkerheden gælder hukommelsen, ikke en tjekket kilde. Hele afsnittet skal tjekkes med `/faktatjek`, før Rumrejsen bygges (trin 5-6). Prototypen (trin 1b) bruger det ikke.

## 1. Voyager 1 og 2

**Opsendelser:** Voyager 2 blev opsendt 20. august 1977 og Voyager 1 den 5. september 1977, begge med Titan IIIE/Centaur fra Cape Canaveral. *Sikker.*
- Voyager 1 fik en hurtigere og kortere bane og nåede Jupiter først. Numrene følger, hvem der ankom først, ikke hvem der blev sendt op først. *Ret sikker* på forklaringen.
- Fælde: "Voyager 2 hedder 2, fordi den blev sendt op som nummer to" er forkert.
- Missionen hed oprindelig "Mariner Jupiter-Saturn". Uranus og Neptun kom først til som en forlængelse af missionen. *Ret sikker.*
- Kilde: https://science.nasa.gov/mission/voyager/

**Forbiflyvninger** (pas på: kilderne angiver afstanden enten over skyerne eller fra planetens centrum, så skriv altid hvilken):

| Sonde | Mål | Dato | Nærmeste afstand | Sikkerhed |
|---|---|---|---|---|
| V1 | Jupiter | 5. marts 1979 | ca. 349.000 km fra centrum | ret sikker |
| V2 | Jupiter | 9. juli 1979 | ca. 570.000 km (NASA, "over skyerne") eller ca. 720.000 km fra centrum, kilderne er uenige | usikker |
| V1 | Titan | 12. nov. 1980 | ca. 6.490 km fra centrum, ca. 3.900-4.000 km over overfladen | ret sikker |
| V1 | Saturn | 12. nov. 1980 | ca. 124.000 km over skyerne (ca. 184.000 km fra centrum) | ret sikker |
| V2 | Saturn | 26. aug. 1981 | ca. 101.000 km over skyerne (ca. 161.000 km fra centrum) | ret sikker |
| V2 | Uranus | 24. jan. 1986 | ca. 81.500 km over skyerne (ca. 107.000 km fra centrum) | ret sikker |
| V2 | Neptun | 25. aug. 1989 | ca. 4.950 km over skyerne ved nordpolen (ca. 29.200 km fra centrum) | ret sikker |

Kilder: https://science.nasa.gov/mission/voyager/voyager-1/ og https://science.nasa.gov/mission/voyager/voyager-2/. Den virkelige bane kan hentes i JPL Horizons (Voyager 1 = -31, Voyager 2 = -32): https://ssd.jpl.nasa.gov/horizons/

**Titan i stedet for Uranus:** Voyager 1 valgte at flyve tæt forbi Titan. Tyngdekraften fra Saturn og Titan bøjede banen op og ud af planeternes plan, så Voyager 1 ikke kunne nå andre planeter. *Ret sikker.*
- Var Titan-forbiflyvningen mislykkedes, skulle Voyager 2 have prøvet i stedet, og så havde den ikke nået Uranus og Neptun. *Ret sikker.*
- En bane mod Pluto var også en mulighed for Voyager 1. *Ret sikker.*

**Ud af heliosfæren:** Voyager 1 passerede heliopausen 25. august 2012 ved ca. 121-122 AU, og Voyager 2 den 5. november 2018 ved ca. 119 AU. *Sikker.*
- Fagfællebedømte artikler: Gurnett m.fl., Science 341, 1489 (2013), og Stone m.fl., Science 341, 150 (2013), om Voyager 1. Fem artikler i Nature Astronomy (november 2019) om Voyager 2.

**Fart nu (i forhold til Solen):** Voyager 1 ca. 17,0 km/s (ca. 61.000 km/t, ca. 3,6 AU om året). Voyager 2 ca. 15,4 km/s (ca. 55.000 km/t). *Ret sikker.*
- De aktuelle tal står her: https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/ (eller på voyager.jpl.nasa.gov under "mission status").

**1 lysdøgn:** Et lysdøgn er 299.792,458 km/s × 86.400 s ≈ 25,90 milliarder km ≈ 173,1 AU. *Sikker* (udregning).
- NASA's udmelding om "november 2026" og datoen 18. november har jeg *ikke* set. *Usikker* på den præcise dato.
- Min egen overslagsregning giver midt i november 2026, så det passer:
  - Ca. 121,6 AU i august 2012 plus 3,58 AU om året giver ca. 172,5 AU fra Solen omkring 18. november.
  - I november står Jorden på den anden side af Solen end Voyager 1, hvilket lægger ca. 0,75 AU til.
- Vigtig detalje til teksten: Afstanden fra *Jorden* stiger ikke hele tiden.
  - Fra ca. januar til maj bevæger Jorden sig mod Voyager 1 med op til ca. 24 km/s, og det er mere end sondens 17 km/s. Så falder afstanden i nogle måneder hvert år. *Ret sikker* på fysikken.
  - Ifølge min regning falder den dog ikke under 1 lysdøgn igen efter november 2026. *Ret sikker.*

**Strømmen:** Hver sonde har tre RTG'er med plutonium-238 (halveringstid 87,7 år), som gav ca. 470 W tilsammen ved opsendelsen. *Ret sikker.*
- De mister ca. 4 W om året, fordi plutoniet henfalder, og fordi termoelementerne slides. *Ret sikker.*
- NASA har slukket instrumenter undervejs (fx i 2024-2025). *Ret sikker.*
- NASA regner med, at måske et enkelt instrument kan køre ind i 2030'erne. *Ret sikker* på "2030'erne", *usikker* på et bestemt år.

## 2. Den lyseblå prik

- **Dato:** 14. februar 1990. *Sikker.*
- **Afstand:** ca. 6 milliarder km (ca. 40 AU). *Ret sikker.*
- **Billedet:** Det blev taget med Voyager 1's smalvinkelkamera som del af "familieportrættet", 60 billeder af seks planeter (Venus, Jorden, Jupiter, Saturn, Uranus og Neptun). *Ret sikker.*
- **Jordens størrelse:** ca. 0,12 pixel. *Ret sikker.*
- **Bagefter:** Kameraerne blev slukket kort efter for at spare strøm, så det var blandt de sidste billeder, sonden tog. Billederne blev sendt hjem over flere måneder og offentliggjort i juni 1990. *Ret sikker.*
- **Carl Sagan** foreslog og pressede på for billedet. Der var modstand, fordi kameraet skulle pege tæt på Solen. *Sikker.*
- Fælde: Den lyse "solstråle", Jorden ligger i, er spredt lys inde i kameraet, ikke en rigtig solstråle. *Ret sikker.*
- **Her står Sagans tekst:** *Pale Blue Dot: A Vision of the Human Future in Space*, Random House, New York 1994, kapitel 1 "You Are Here", omkring side 6-7 i første udgave (*usikker* på siden). Han læste den også op i en tale på Cornell i 1996.
  - Repoets citat `saganScene` i `js/data/citater.js` er fra samme afsnit.
- **Kilder:** NASA/JPL's billede PIA00452 ("Solar System Portrait – Earth as Pale Blue Dot") og den nye behandling fra 2020, PIA23645. Se https://photojournal.jpl.nasa.gov/catalog/PIA00452

## 3. Den store tur

- **Hvor tit:** Jupiter, Saturn, Uranus og Neptun står gunstigt ca. hvert 175. år (nogle skriver 176). Sidst før 1977 var omkring 1801-02. *Ret sikker.*
- **Hvem:** Gary Flandro regnede det ud som sommerelev på JPL i 1965. Han byggede på Michael Minovichs arbejde om slyng fra 1961-62. *Sikker.*
- **Artikel:** G. A. Flandro, "Fast reconnaissance missions to the outer solar system utilizing energy derived from the gravitational field of Jupiter", *Astronautica Acta* 12 (1966), s. 329-337. *Ret sikker.*
- NASA's oprindelige "Grand Tour"-program blev skåret væk i 1972, fordi det var for dyrt. Voyager var den billigere udgave. *Ret sikker.*
- Fælde: Planeterne behøver ikke stå "på en lige linje". De skal bare stå i en gunstig spiral, så hver forbiflyvning sender sonden videre til den næste.

## 4. Slyngfysik

**Planetens ramme:** Farten er den samme før og efter (v∞ ind = v∞ ud), og kun retningen drejer. *Sikker.*
- Vinklen δ, som retningen drejer, findes af sin(δ/2) = 1 / (1 + r_p·v∞²/GM), hvor r_p er den nærmeste afstand.

**Solens ramme:** Man lægger planetens fart til, og så kan sondens fart stige eller falde med op til 2·v∞·sin(δ/2). *Sikker.*
- Flyver sonden bag om planeten (på den side, planeten kommer fra), får den mere fart. Flyver den foran planeten, bremses den. *Sikker.*
- Voyager 2 blev *bremset* ved Neptun, da den dykkede over nordpolen mod Triton. *Ret sikker.*

**Voyager 2 ved Jupiter:** omtrent fra ca. 10 km/s til ca. 20 km/s i forhold til Solen. Flugthastigheden fra Solen ved 5,2 AU er ca. 18,5 km/s, så efter Jupiter var sonden hurtig nok til at forlade Solen. *Usikker* på de præcise tal.
- Tallene er mit eget overslag med energibevarelse mellem forbiflyvningerne. De skal aflæses på den kendte graf "Voyager 2 heliocentric velocity vs. distance from Sun" (JPL, ofte tilskrevet Steve Matousek, findes på Wikimedia Commons og i NASA's "Basics of Space Flight").
- Grafen viser farten hoppe ved Jupiter, Saturn og Uranus og falde ved Neptun, med flugthastigheden som en kurve, der falder udad.
- Kilde: https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/

**Hvor meget Jupiter bremses** (regneeksempel):
- Bevægelsesmængden er bevaret: ΔvJupiter = m·Δv / M.
- Med m ≈ 722 kg (sonden), Δv ≈ 10 km/s og M = 1,898·10²⁷ kg: 722 × 10⁴ / 1,9·10²⁷ ≈ 3,8·10⁻²¹ m/s.
- Det svarer til, at Jupiter er ca. 1,2·10⁻¹³ m efter på et år, altså under en tusindedel af et atoms bredde, og ca. 0,1 mm på en milliard år.
- *Sikker* på metoden, *ret sikker* på tallene. Det passer godt til AtomLab.

**Sonder til Merkur bremser:** En sonde, der falder ind mod Solen, får meget fart, og Merkur bevæger sig 47 km/s mod Jordens 30 km/s. For at kunne gå i bane om Merkur skal sonden af med meget fart i forhold til planeten. Det ville kræve en urealistisk mængde brændstof. *Sikker.*
- **MESSENGER:** opsendt 2004, forbi Jorden én gang, Venus to gange og Merkur tre gange, i bane 18. marts 2011. *Ret sikker.* Kilde: https://messenger.jhuapl.edu/
- **BepiColombo:** opsendt 20. oktober 2018, forbi Jorden én gang, Venus to gange og Merkur seks gange (sidst januar 2025). *Ret sikker.*
  - Ankomsten til Merkur blev udskudt til november 2026 på grund af problemer med motorerne. *Usikker*, og det kan have ændret sig. Tjek på https://www.esa.int/Science_Exploration/Space_Science/BepiColombo
- Mariner 10 (Venus, 1974) var det første slyng mellem planeterne. *Ret sikker.*

**Størst mulige fartændring:** Formlen 2·v∞/(1 + r_p·v∞²/GM) er størst, når v∞ = √(GM/r_p). Så er fartændringen √(GM/r_p), altså farten i en cirkelbane lige over planeten. *Sikker* (udregning).
- For Jupiter lige over skyerne giver det ca. 42 km/s. Det kan ikke lade sig gøre i praksis på grund af strålingen.
- I Solens ramme kan farten højst stige med ca. 2 × planetens banefart (Jupiter 13,1 km/s).

## 5. Baneelementer (Standish)

**Kilden:** E. M. Standish, "Keplerian Elements for Approximate Positions of the Major Planets", JPL SSD. Se https://ssd.jpl.nasa.gov/planets/approx_pos.html og datafilerne `p_elem_t1.txt` og `p_elem_t2.txt`. *Sikker.*
- Tabel 1 gælder 1800-2050.
- Tabel 2a/2b gælder 3000 f.Kr.-3000 e.Kr. og har ekstra led (b, c, s, f) for Jupiter til Pluto.
- Koordinaterne går ud fra Solen i ekliptika for J2000. "Jorden" er tyngdepunktet for Jorden og Månen.

**Præcision (1800-2050), fra hukommelsen:** fra ca. 10-50 buesekunder for de indre planeter til ca. 400-600 buesekunder for Jupiter og Saturn. Afstanden kan være op til ca. 0,6 mio. km forkert for Jupiter og ca. 1,5 mio. km for Saturn. *Usikker* på de enkelte tal (de står i en tabel på siden).

**Følge for spillet:** Fejlene på Saturns plads er meget større end Voyagers nærmeste afstande (fx 4.950 km over Neptuns skyer). Den virkelige Voyager-rute kan derfor ikke regnes frem præcist med disse elementer.
- "Spøgelset" bør hentes fra Horizons og tegnes i forhold til planeterne.
- Simuleringen bør sigte i forhold til planeten.

## 6. Fælder (forkerte populære påstande)

- **"Slyngen giver gratis energi."** Energien tages fra planetens bevægelse om Solen. Energien er bevaret i alt, og planeten bremses (umærkeligt).
- **"Voyager har forladt solsystemet."** Den har forladt *heliosfæren* (solvindens boble). Den er stadig langt fra Oortskyen, og Solens tyngdekraft styrer stadig. NASA siger ca. 300 år til den indre Oortsky og ca. 30.000 år igennem den. *Ret sikker.*
- **"Voyager 1 er det hurtigste, vi har bygget."** Parker Solar Probe er meget hurtigere (ca. 190 km/s tæt på Solen). New Horizons var hurtigst ved opsendelsen. Voyager 1 er det hurtigste, der er på vej *ud* af solsystemet.
- **"Voyager 1 kommer hele tiden længere væk fra Jorden."** Afstanden falder i nogle måneder hvert år (se punkt 1).
- **"Solstrålen i den lyseblå prik er sollys."** Den er spredt lys inde i kameraet.
- **"Voyager 2 blev opsendt efter Voyager 1."** Den blev opsendt først.
- **"Planeterne stod på linje."** De stod i en gunstig spiral, ikke på en linje.
- **"Slyngen virker ved at hive i sonden og give mere fart i planetens ramme."** Nej, i planetens ramme drejer kun retningen.
- **Sagan-citatet** findes i mange ændrede udgaver. Brug kun ordlyden fra bogen.

## Mindst sikre påstande (tjek dem først)

1. Datoen 18. november 2026 for 1 lysdøgn, og NASA's udmelding om den. Jeg har kun mit eget overslag, som rammer midt i november.
2. Voyager 2's fart ved Jupiter før og efter (ca. 10 → ca. 20 km/s). Det er et overslag, som skal aflæses på grafen.
3. Voyager 2's nærmeste afstand til Jupiter (570.000 km eller ca. 720.000 km).
4. Fejltabellen for Standish' elementer.
5. Sidetallet for Sagans tekst (kapitel 1 "You Are Here" er ret sikkert).
6. BepiColombos ankomst i november 2026.
7. Hvornår RTG'erne ikke kan holde noget instrument i gang (kun "2030'erne").

Når der er netadgang igen, kan opgaven sendes igen, og så kan disse punkter tjekkes mod kilderne.

---

# Del 3: Mars, Phobos og Deimos (til [plan-mars.md](plan-mars.md))

*Lavet 24. oktober 2026 af to hjælpeagenter (Opus, høj effort) til M1 i Mars-planen. Kildesiderne hos NASA, ESA og Wikipedia kunne ikke åbnes i miljøet (kun søgeuddrag). USGS (S3-spejlet og astrogeology.usgs.gov) og raw.githubusercontent.com kunne åbnes. Før en tekst kommer med i programmet, skal tallet bag den slås op i kilden med `/faktatjek`, især punkterne mærket RS og U.*

## A. Mars og stederne

Lavet 24. oktober 2026. Faktagrundlag til tekster i AtomLab. Teksterne skrives senere, og tallene her skal tjekkes mod kilden, før de kommer med.

### Sådan blev der tjekket

- **Ingen kildesider kunne åbnes direkte.** WebFetch gav `ENOTFOUND` for nssdc.gsfc.nasa.gov, science.nasa.gov, esa.int, pubs.usgs.gov og agupubs.onlinelibrary.wiley.com. curl gennem proxyen fik `403` (proxyen afviser bl.a. nssdc.gsfc.nasa.gov, science.nasa.gov, mars.nasa.gov og en.wikipedia.org).
- Alt nedenfor bygger derfor på **søgeuddrag** fra WebSearch. Uddragene er opsummeret af søgeværktøjet, så de er ikke ordrette citater fra siden. Det står ved hver kilde: "(søgeuddrag)". Står der "(søgeuddrag, ordret)", indeholdt uddraget sidens tabeltekst ordret (fx NSSDC-tabellen).
- Primære kilder er brugt, hvor de dukkede op i uddragene: NSSDC, NASA/JPL, ESA, USGS og fagfællebedømte artikler (Plescia 2004, Plaut m.fl. 2007, Bibring m.fl. 2004, Hernández-Bernal m.fl. 2021, Haberle m.fl. 2001). Wikipedia er kun brugt, hvor intet bedre fandtes, og det står så.
- Afstande på Jorden (fx New York–Los Angeles) er **regnet af mig** som storcirkelafstande ud fra byernes koordinater. De er markeret "egen udregning".
- Sikkerhed: **S** = sikker (primær kilde, flere kilder enige), **RS** = ret sikker, **U** = usikker (kilder uenige, kun sekundær kilde eller ikke bekræftet).
- Længdegrader er planetocentriske og østlige (0–360° Ø), som NASA og IAU bruger nu. Vestlige længder er regnet om (360° − V).

---

### 1. Mars som planet

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Radius ved ækvator | 3.396,2 km | NSSDC Mars Fact Sheet https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html (søgeuddrag, ordret) | S |
| Radius ved polerne | 3.376,2 km | NSSDC (søgeuddrag, ordret) | S |
| Middelradius (samme rumfang) | 3.389,5 km (ca. 0,53 × Jordens) | NSSDC (søgeuddrag, ordret) | S |
| Fladtrykning | ca. 0,6 % (20 km forskel) | egen udregning ud fra NSSDC | S |
| Masse | 0,64169 × 10²⁴ kg (ca. 0,107 × Jordens, dvs. ca. 1/9) | NSSDC (søgeuddrag, ordret; en ældre kopi af siden har 0,64185) | S |
| Tyngdeacceleration (middel) | 3,73 m/s², 0,380 × Jordens (9,82 m/s²) = **38 %** | NSSDC (søgeuddrag, ordret) | S |
| Siderisk rotationstid | 24,6229 timer = 24 t 37 min 23 s | NSSDC (søgeuddrag, ordret); LCO Space Book https://lco.global/spacebook/mars/ (søgeuddrag) | S |
| Soldøgn ("sol") | 24,6597 timer = 24 t 39 min 35 s | NSSDC (søgeuddrag, ordret); Wikipedia "Timekeeping on Mars" (søgeuddrag) | S |
| Aksehældning | 25,19° (Jorden 23,44°) | NSSDC (søgeuddrag, ordret) | S |
| Middelafstand til Solen (halve storakse) | 227,956 mio. km = 1,524 AE | NSSDC (søgeuddrag, ordret) | S |
| Perihel (tættest på Solen) | 206,650 mio. km | NSSDC (søgeuddrag, ordret) | S |
| Aphel (længst fra Solen) | 249,261 mio. km | NSSDC (søgeuddrag, ordret) | S |
| År (siderisk omløbstid) | 686,980 dage ≈ 687 dage ≈ 1,88 jordår ≈ 668,6 sol | NSSDC (søgeuddrag, ordret); JPL "Mars in a Minute" https://www.jpl.nasa.gov/edu/resources/video/mars-in-a-minute-how-long-is-a-year-on-mars/ (søgeuddrag) | S |
| Lufttryk ved overfladen (middel) | 6,36 mbar (= 636 Pa) ved middelradius | NSSDC (søgeuddrag) | S |
| Lufttryk i forhold til Jorden | ca. 0,6 % (6,36/1.014 mbar) | egen udregning ud fra NSSDC | S |
| Lufttryk varierer | Viking 1's landingssted: ca. 6,9–9 mbar gennem året | ældre udgave af NSSDC-siden (søgeuddrag); MSSS "Seasons on Mars" https://www.msss.com/http/ps/seasons/seasons.html (søgeuddrag) | RS |
| Skalahøjde | 11,0 km (ældre udgaver: 11,1 km) | NSSDC (søgeuddrag) | RS |
| Atmosfæren (NSSDC) | CO₂ 95,1 %, N₂ 2,59 %, Ar 1,94 %, resten O₂, CO, vanddamp m.m. | NSSDC (søgeuddrag) | RS |
| Atmosfæren (andre målinger) | Curiosity (Mahaffy m.fl. 2013, Science 341, 263) målte de fem vigtigste gasser. Tallene blev ikke fundet i uddragene. Wikipedia: CO₂ 95 %, N₂ 2,85 %, Ar 2 % | astrobiology.com 2013 (søgeuddrag); Wikipedia "Atmosphere of Mars" (søgeuddrag) | U (decimalerne) |
| Middeltemperatur | ca. −60 °C (NASA: ca. −80 °F ≈ −62 °C; NASA-faktaark: −81 °F ≈ −63 °C; andet NASA-ark: ca. 214 K ≈ −59 °C) | space.com med NASA som kilde https://www.space.com/16907-what-is-the-temperature-of-mars.html (søgeuddrag); NASA "allaboutmars facts" (kopi som pdf, søgeuddrag) | RS (skriv "ca. −60 °C") |
| Typisk spænd | Viking 1 de første døgn: ca. 188 K til 244 K (−85 °C til −29 °C) på et døgn. Sommerdag ved ækvator op til ca. +20 °C. Om vinteren ved polerne ned til ca. −125 °C (ifølge nogle kilder −153 °C) | NTRS 1976 (Viking 1, søgeuddrag) https://ntrs.nasa.gov/citations/19760058641; space.com (søgeuddrag) | RS (spændet), U (laveste tal) |
| Himlen om dagen | gullig-brun til rosa ("butterscotch"), fordi fint, jernholdigt støv i luften spreder lyset | NBC News om Viking og Pathfinder (søgeuddrag) https://www.nbcnews.com/id/wbna3077395; Mark Lemmon, NASA 2015 (søgeuddrag) | RS |
| Blå solnedgang | Curiosity fotograferede solnedgangen i farver i Gale-krateret 15. april 2015 (sol 956) med Mastcam. Det fine støv lader blåt lys slippe lettere igennem, så der er blåt omkring Solen, mens resten af himlen er gul til orange | NASA/JPL "Sunset at Mars' Gale Crater" https://science.nasa.gov/resource/sunset-at-mars-gale-crater-curiosity (søgeuddrag); space.com 2015 (søgeuddrag) | S |
| Støvstorme | Lokale støvstorme er almindelige. Med års mellemrum bliver en storm global (dækker hele planeten) | flere kilder (søgeuddrag) | S |
| Den globale støvstorm i 2018 | Opdaget 30. maj 2018, dækkede hele planeten i juni. Opportunity (solceller) mistede strømmen og blev hørt sidste gang 10. juni 2018. NASA erklærede missionen slut 13. februar 2019. Curiosity (atombatteri) arbejdede videre | JPL "Six things about Opportunity's recovery efforts" https://www.jpl.nasa.gov/news/six-things-about-opportunitys-recovery-efforts/ (søgeuddrag); Scientific American (søgeuddrag); UCL 2019 (søgeuddrag) | S |
| Global støvstorm ved Mariner 9's ankomst | Da Mariner 9 nåede Mars i november 1971, var hele planeten dækket af en støvstorm. Kortlægningen begyndte først i januar 1972 | Linda Hall Library om Mariner 9 (søgeuddrag) https://www.lindahall.org/about/news/scientist-of-the-day/mariner-9/ | RS |
| Nulpunkt for højder (areoiden) | Mars har intet hav. Højde 0 er en flade med samme tyngdepotentiale (tyngde + rotation) overalt, "areoiden" fra MOLA. Den er valgt, så den ved ækvator i middel har radius 3.396 km | PDS MOLA-katalog https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-iegdr-l3-v2/mgsl_2xxx/catalog/pedrds.cat (søgeuddrag); USGS-kort (3.396,19 km) (søgeuddrag) | S |
| Lufttryk ved nulpunktet | middeltrykket 6,1 mbar ligger ca. 1,6 km under MOLA-areoiden (gammel definition på "nul" var 6,1 mbar) | PDS MOLA-katalog (søgeuddrag) | RS |
| Højdeforskel på hele Mars | ca. 30 km fra Olympus Mons til bunden af Hellas (ca. 1,5 gange Jordens) | David Smith (MOLA) i MIT News 1999 https://news.mit.edu/1999/marsmap (søgeuddrag) | S |
| Syd og nord | Sydhalvkuglen ligger i gennemsnit ca. 5 km højere end nordhalvkuglen | MIT News 1999 (søgeuddrag) | RS |
| Nulmeridianen | Går gennem det lille krater Airy-0 (ca. 0,5 km bredt) i Sinus Meridiani. Foreslået af Mariner 9's kortlægningsgruppe i 1972. IAU har senere fastlagt længderne ud fra Viking 1-landerens plads (47,95137° V), valgt så 0° stadig går gennem Airy-0 | Wikipedia "Areography" (søgeuddrag); USGS-kort (søgeuddrag) https://astropedia.astrogeology.usgs.gov/download/Mars/Topography/year-2000/ancillary/Mars-Topographic-and-Color-Coded-Contour-Maps-2.pdf; Duxbury m.fl. 2014, JGR Planets (søgeuddrag) | RS |

Punkter:
- Tyngden: "38 % af Jordens", "lidt over en tredjedel". En 13-årig på 45 kg ville føle sig som ca. 17 kg.
- En sol er ca. 40 minutter længere end et jorddøgn. Ordet "sol" blev indført under Viking-missionerne (1976).
- Lufttrykket svarer til, hvad man har ca. 35 km oppe i Jordens atmosfære. **Det har jeg ikke en kilde på, så brug det ikke.** Brug "under 1 % af trykket på Jorden".
- Ca. 25–30 % af atmosfæren fryser til CO₂-rim ved den pol, hvor det er vinter. Derfor svinger lufttrykket i løbet af året (se afsnit 6).

---

### 2. Olympus Mons

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Toppen over nulpunktet (MOLA) | 21,287 km (højeste MOLA-punkt). Plescia 2004 skriver "summit elevations range from 21.1 km" (hans målte top for Olympus Mons) | Wikipedia "Olympus Mons" (søgeuddrag); Plescia 2004, JGR 109, E03003, https://doi.org/10.1029/2002JE002031, resumé via USGS https://pubs.usgs.gov/publication/70026910 (søgeuddrag) | RS (ca. 21 km) |
| Højde over omgivelserne (relief) | ca. 21,9 km ("almost 22 km") målt fra foden af skrænten | Plescia 2004 (søgeuddrag af resuméet: "relief varies from 1.0 km to almost 22 km"); Mars Odyssey/NASA: 21,9 km (søgeuddrag) | S (ca. 22 km) |
| Ældre tal (Viking-tiden) | 25–27 km. USGS Prof. Paper 1534 (1994) har en top på 26 km. NASA-sider skriver stadig 25–27 km | NASA Goddard "How big is Olympus Mons?" https://core2.gsfc.nasa.gov/research/volc/olympus.html (søgeuddrag); science.nasa.gov Olympus Mons (søgeuddrag) | brug ikke |
| Bredde | ca. 600 km (med lavastrømmene over skrænten 840 × 640 km) | Wikipedia (søgeuddrag); Plescia 2004 citeret i en artikel fra 2016 (søgeuddrag) | RS |
| Areal | omtrent som delstaten Arizona (USA). NASA: "bredere end Arizona", ca. 585 km | NASA-billedtekst (søgeuddrag) | RS |
| Skråninger | i middel ca. 5° (meget fladt, så står man på den, kan man ikke se, at det er et bjerg) | Plescia 2004 citeret (søgeuddrag) | RS |
| Calderaen (krateret på toppen) | 6 indfaldskratere, der overlapper, i alt ca. 65 × 80 km | USGS SIM 3470, Mouginis-Mark 2021 https://pubs.usgs.gov/publication/sim3470 (søgeuddrag) | RS |
| Calderaens dybde | ca. 3 km (Plescia 2004: 3,2 km; ældre: 2,5 km; NASA: "næsten 3 km") | Plescia via søgeuddrag; NASA Goddard (søgeuddrag) | RS ("ca. 3 km") |
| Skrænten ved foden | 6 km (Milkovich 2003), op til 8 km (McGovern 2007), op til 9 km nogle steder (Borgia 2015) | oversigt over Olympus Mons og litosfæren, UCL https://discovery.ucl.ac.uk/id/eprint/10158477/1/OlympusMons_Lithosphere.pdf (søgeuddrag) | RS ("op til 6–8 km") |
| Koordinater (midten) | 18,65° N, 226,2° Ø (= 133,8° V) | Wikipedia (søgeuddrag) | RS |
| Opdaget som vulkan | Schiaparelli kaldte det lyse sted "Nix Olympica" ("Olympens sne") i 1879, fordi det var lyst i kikkerten. Mariner 9 viste i 1971–72, at det er en kæmpe skjoldvulkan, og navnet blev Olympus Mons | USGS-geologisk kort I-2327 https://pubs.usgs.gov/publication/i2327 (søgeuddrag); Linda Hall Library (søgeuddrag) | S |

**Det højeste bjerg i solsystemet?**

| Bjerg | Højde | Kilde | Sikkerhed |
|---|---|---|---|
| Olympus Mons (Mars) | ca. 21,9 km over omgivelserne, ca. 21,3 km over nulpunktet | se ovenfor | S |
| Rheasilvia's centrale bjerg (asteroiden Vesta) | ca. 20 km fra foden (JPL). Andre: 19–22 km, 20–25 km (Schenk m.fl. 2012), 22,5 km | JPL PIA15322 https://www.jpl.nasa.gov/images/pia15322-3-d-image-of-the-central-complex-in-vestas-rheasilvia-impact-basin/ (søgeuddrag); Wikipedia "Rheasilvia" (søgeuddrag); Science Focus (søgeuddrag) | RS (ca. 20 km), U (hvem der vinder) |

- Det er ikke afgjort, hvilket bjerg der er højest. Det afhænger af, hvor man sætter foden.
- Forslag til teksten: "Olympus Mons er et af de højeste bjerge i solsystemet og den største vulkan, vi kender. Kun et bjerg på asteroiden Vesta er måske lige så højt."

**Sammenligning med Jorden**

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Mount Everest over havet | 8.848,86 m (Nepal og Kina, 2020) | Guinness/flere (søgeuddrag) | S |
| Mauna Kea fra havbunden | ca. 10.200 m (NOAA: over 10.210 m, Guinness: ca. 10.205 m). Over havet ca. 4.207 m | Guinness World Records https://www.guinnessworldrecords.com/world-records/tallest-mountain.html (søgeuddrag) | RS |
| Olympus Mons / Everest | 21,9 / 8,85 ≈ **2,5 gange** | egen udregning | S |
| Olympus Mons / Mauna Kea (fra havbunden) | 21,9 / 10,2 ≈ **ca. 2 gange** | egen udregning | S |

- Forslag: "Olympus Mons rejser sig ca. 22 km over landskabet omkring den, ca. 2½ gange så højt som Mount Everest over havet. Selv Mauna Kea på Hawaii, der er ca. 10 km høj målt fra havbunden, er kun halvt så høj."

---

### 3. Tharsis og Tharsis Montes

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Tharsis-plateauets størrelse | ca. 4.000–5.000 km på tværs (Britannica: 8.000 km). Omtrent på størrelse med Nordamerika (DLR). Dækker 10–30 mio. km² afhængigt af, hvor grænsen sættes | Wikipedia "Tharsis" (søgeuddrag); Britannica (søgeuddrag); DLR 2024 https://www.dlr.de/en/latest/news/2024/the-perfect-image-from-martian-orbit-25-000/the-topography-of-the-tharsis-region (søgeuddrag) | U (tallet), RS ("på størrelse med Nordamerika") |
| Plateauets højde (uden vulkanerne) | op til ca. 7 km (Wikipedia), 8 km i midten (Britannica). DLR: "mere end 4 km" | samme | U ("flere km højt") |
| Ascraeus Mons (nordligst) | top ca. 18,2 km over nulpunktet (artiklens tekst 18,1 km). Ca. 15 km over omgivelserne | Wikipedia "Ascraeus Mons" (søgeuddrag) | RS |
| Ascraeus Mons, koordinater | 11,92° N, 255,92° Ø | Wikipedia (søgeuddrag) | RS |
| Pavonis Mons (midten) | top ca. 14 km over middelniveauet | THEMIS/ASU og JPL PIA24223 https://www.jpl.nasa.gov/images/pia24223-pavonis-mons-summit/ (søgeuddrag) | RS |
| Pavonis Mons, koordinater | 1,48° N, 247,04° Ø (lige ved ækvator) | Wikipedia (søgeuddrag) | RS |
| Pavonis Mons, caldera | 47 km bred, næsten 5 km dyb | Wikipedia (søgeuddrag) | U |
| Arsia Mons (sydligst) | top ca. 17,7–17,8 km over nulpunktet (MOLA-tal, som jeg husker fra Plescia 2004, men **ikke fundet i søgningerne**). JPL/Mars Odyssey: "ca. 20 km høj". Wikipedia: "næsten 20 km", mere end 9 km over sletterne | JPL "NASA Mars Orbiter Captures Volcano Peeking Above Morning Cloud Tops" https://www.jpl.nasa.gov/news/nasa-mars-orbiter-captures-volcano-peeking-above-morning-cloud-tops/ (søgeuddrag); Wikipedia (søgeuddrag) | U (skriv "ca. 18–20 km" eller "næsten lige så høj som Ascraeus") |
| Arsia Mons, koordinater | 8,35° S, 239,91° Ø (= 120,09° V) | Wikipedia (søgeuddrag) | RS |
| Arsia Mons, caldera | ca. 110–120 km bred | Wikipedia (110 km), THEMIS/ASU (120 km) (søgeuddrag) | RS ("over 100 km") |
| Afstand mellem de tre | ca. 700 km fra top til top på en linje fra sydvest til nordøst (andre sider: 400–500 km) | Wikipedia "Tharsis Montes" (søgeuddrag) | U |
| Skyen ved Arsia Mons (AMEC) | En lang, smal sky af **vandis** (ikke røg fra vulkanen). ESA's Mars Express fulgte den fra 13. september 2018, og 10. oktober 2018 var den ca. 1.500 km lang. Kommer igen hvert år omkring sydlig sommer (set 2009, 2012, 2015, 2018) | ESA "Mars Express keeps an eye on curious cloud" (2018) https://www.esa.int/Our_Activities/Space_Science/Mars_Express/Mars_Express_keeps_an_eye_on_curious_cloud (søgeuddrag) | S |
| Skyens døgn | Begynder før solopgang på vulkanens vestside, vokser mod vest i ca. 2,5 timer (ca. 170 m/s, ca. 45 km oppe), river sig løs og er væk før eftermiddagen. Op til 1.800 km lang | Hernández-Bernal m.fl. 2021, JGR Planets 126, e2020JE006517 (søgeuddrag af resuméet) | S |

- Skyer af vandis over de store vulkaner om eftermiddagen ("orografiske skyer") er almindelige på Mars. Skyen ved Arsia Mons er den mest kendte.
- Forslag: "Arsia Mons får hvert år en sky, der kan blive op til 1.800 km lang, næsten så lang som fra København til Madrid. Den er af små iskrystaller og varer kun nogle timer om morgenen."
  (København–Madrid er ca. 2.070 km, egen udregning.)

---

### 4. Valles Marineris

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Længde | over 4.000 km (fransk kilde: 3.770 km) | ESA "The Solar System's grandest canyon" https://esa.int/Science_Exploration/Space_Science/The_Solar_System_s_grandest_canyon (søgeuddrag); hypertextbook (søgeuddrag) | S ("ca. 4.000 km") |
| Del af vejen rundt om Mars | ca. 1/5 (4.000 / 21.340 km) | egen udregning (ækvatorens omkreds 2π × 3.396 km) | S |
| Bredde | op til ca. 200 km (ESA). I midten, hvor flere kløfter mødes, op til ca. 600 km | ESA (søgeuddrag); Macmillan-lærebog "Universe" (søgeuddrag) | RS |
| Dybde | ESA: op til 10 km. Andre: op til 7 km eller 8 km. Det dybeste sted ca. 11 km under plateauet omkring (ved ca. 60° V, i Coprates/Melas-området) | ESA (søgeuddrag); Wikipedia "Coprates Chasma" (søgeuddrag) | U (tallet), RS ("op til 7–10 km dyb") |
| Koordinater, midten | ca. 13,9° S, 300,8° Ø (= 59,2° V). Fransk kilde: 13,7° S, 300,8° Ø | Wikipedia / techno-science.net (søgeuddrag) | RS |
| Sammenlignet med Grand Canyon | ca. 10 gange længere og 5 gange dybere (ESA) | ESA (søgeuddrag) | RS |
| Dannelse | **Ikke** gravet af en flod. Den er en kæmpe sprækkedal: Skorpen blev revet over og sank ned mellem forkastninger (gravsænkning, "graben"), sandsynligvis i forbindelse med Tharsis. Den begyndte at åbne sig for ca. 3,5 mia. år siden. Bagefter blev den udvidet af jordskred, sammenstyrtninger og noget vand (søer på bunden, grundvand) | NASA/JPL "The Grand Canyon of Mars" https://science.nasa.gov/resource/the-grand-canyon-of-mars-valles-marineris-13-mar-2006/ (søgeuddrag); NTRS https://ntrs.nasa.gov/citations/19940007672 (søgeuddrag); ASU Mars Education https://marsed.mars.asu.edu/mep/tectonics/canyons (søgeuddrag); ESA (søgeuddrag) | S (sprækker, ikke flod), RS (detaljerne) |
| Opkaldt efter | Mariner 9, der opdagede den (1971–72) | almen viden, ikke tjekket her | RS |

Sammenligninger (egne udregninger af storcirkelafstande):
- New York–Los Angeles: ca. 3.940 km. NASA siger, at kløften ville nå "tværs over USA fra østkyst til vestkyst". Det passer, når man går fra New York til Los Angeles.
- Lissabon–Moskva: ca. 3.900 km. Det er en god sammenligning for Europa.
- København–Kairo: ca. 3.200 km (kløften er længere).
- Forslag: "Valles Marineris er ca. 4.000 km lang, lige så langt som fra Lissabon til Moskva. Den er op til 7–10 km dyb, mere end Mount Everest er høj."

---

### 5. Hellas Planitia

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Diameter | ca. 2.200–2.300 km (DLR: ca. 2.200 km; Wikipedia: ca. 2.300 km) | DLR 2014 (søgeuddrag) https://www.dlr.de/en/images/2014/3/topographic-context-map-of-the-northwest-of-hellas-planitia_16092; Wikipedia (søgeuddrag) | RS ("over 2.000 km") |
| Dybde | Bunden ligger ca. 7 km under nulpunktet (Wikipedia: 7.152 m). Fra randen (højlandet) ned til de dybeste steder ca. 8–9 km (DLR: 8.000 m under højlandet). MIT 1999: "6 miles" (ca. 9 km) dyb | Wikipedia; DLR 2014 (søgeuddrag); MIT News 1999 (søgeuddrag) | RS ("ca. 7–9 km dyb") |
| Laveste punkt på Mars | ca. 8,2 km under nulpunktet (MOLA-data: −8.201 m; NASA SVS: ca. 8.200 m under middelværdien ved ækvator) | NASA SVS https://svs.gsfc.nasa.gov/770 (søgeuddrag); geology.com (søgeuddrag) | RS |
| Lufttryk på bunden | op til ca. 12,4 mbar om vinteren, ca. dobbelt så meget som ved nulpunktet (6,1 mbar). DLR: "næsten dobbelt så meget som i højlandet omkring" | Wikipedia (søgeuddrag); DLR 2014 (søgeuddrag) | RS ("ca. dobbelt så højt tryk") |
| Koordinater | 42,4° S, 70,5° Ø | Wikipedia (søgeuddrag) | RS |
| Dannelse | Et af de største nedslagsbassiner i solsystemet, dannet af et stort nedslag for ca. 4 mia. år siden | almen viden; alderen er ikke tjekket her | U (alderen) |

- Vand i Hellas: Trykket i bunden er over vands tripelpunkt (6,1 mbar). En model (Haberle m.fl. 2001, NTRS https://ntrs.nasa.gov/citations/20010084314, søgeuddrag af resuméet) fandt, at vand i kort tid kunne være flydende nogle steder (bl.a. i Hellas og Argyre) på varme dage, men at det fordamper hurtigt, så det sker "sjældent eller aldrig". Lobitz m.fl. 2001 (PNAS) nåede et lignende resultat. Kogepunktet er lavt (ca. +10 °C, ifølge et citat fra Haberle i et forum, U).
- Forslag: "I bunden af Hellas er lufttrykket ca. dobbelt så højt som gennemsnittet. Det er det sted på Mars, hvor vand bedst kunne være flydende, men kun lidt og i kort tid, før det fordamper."

---

### 6. Polkapperne

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Nordpolens faste kappe | vandis (under 3 % støv), ca. 1.000 km på tværs, næsten midt på polen | Wikipedia "Martian polar ice caps" (søgeuddrag); ASU Mars Education "Planum Boreum" https://marsed.asu.edu/mep/ice/polar-caps/planum-boreum (søgeuddrag) | RS |
| De lagdelte aflejringer i nord | op til ca. 2 km tykke (med den nederste, mørkere del i alt ca. 3 km) | ASU Mars Education (søgeuddrag); UT Austin (søgeuddrag) | RS ("2–3 km tyk") |
| Vand under nordpolen | Begravede islag fundet med radaren SHARAD: smeltet ville de dække hele Mars med ca. 1,5 m vand | UT Austin Jackson School 2019 https://www.jsg.utexas.edu/news/2019/05/massive-martian-ice-discovery-opens-a-window-into-red-planets-history/ (søgeuddrag) | RS |
| Spiralkløfterne | Kappen har kløfter, der snor sig ud fra polen som en spiral. De er formet af kolde, tunge vinde, der falder ned ad iskappen (katabatiske vinde), og som Mars' rotation (corioliskraften) bøjer til siden | Smith & Holt 2010 og Holt m.fl. 2010 (UT Austin; tidsskriftet var efter min hukommelse Nature 465, ikke bekræftet) https://www.jsg.utexas.edu/news/?p=196 (søgeuddrag); Universe Today (søgeuddrag) | RS |
| Chasma Boreale | En stor kløft i nordkappen, ca. 570 km lang og ca. 100 km bred. Også formet af vinden | Wikipedia (søgeuddrag); UT Austin 2010 (søgeuddrag) | U (tallene), RS (vinden) |
| Sydpolens faste kappe | Et tyndt lag CO₂-is (tøris) på ca. 1–10 m (nogle steder "flere meter", MARSIS-model 8–15 m) **oven på** vandis | Nature Astronomy 2020 https://link.springer.com/article/10.1038/s41550-019-0976-8 (søgeuddrag); HiRISE https://hirise.lpl.arizona.edu/ESP_014261_0930 (søgeuddrag) | RS |
| Sydkappens blanding | Kappens overflade ca. 85 % CO₂-is og 15 % vandis. Skrænterne ved kanten er næsten ren vandis | ESA "Water at Martian south pole" (2004) https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Water_at_Martian_south_pole (søgeuddrag); Bibring m.fl. 2004, Nature 428, 627–630 | S |
| Sydkappens størrelse | ca. 350–400 km på tværs, og den ligger lidt ved siden af polen | Wikipedia (350 km, søgeuddrag); Murray & Malin 1973 (forskudt fra polen, søgeuddrag) | U |
| De lagdelte aflejringer i syd | over 3,7 km tykke, næsten ren vandis, i alt ca. 1,6 mio. km³. Smeltet svarer det til et lag vand på ca. 11 m over hele Mars | Plaut m.fl. 2007, Science 316, 92–95 (MARSIS); NASA/ESA-billede "Thickness of Mars South Polar Layered Deposits" (søgeuddrag) | S |
| Rim om vinteren (årstiderne) | Om vinteren fryser CO₂ fra luften til rim (tøris) over store områder omkring polen. Det fordamper igen om foråret. Lufttrykket på hele Mars falder derfor ca. 25 % (målt 26 % fra top til bund ved Viking). Smith & Zuber 2018: ca. 30 % af atmosfæren flytter fra pol til pol | MSSS "Seasons on Mars" (søgeuddrag); Hess m.fl. 1979, JGR (Viking-tryk, søgeuddrag); Smith & Zuber, EPSC 2018 (søgeuddrag) https://meetingorganizer.copernicus.org/EPSC2018/EPSC2018-429.pdf | RS ("ca. en fjerdedel af luften") |

- Forslag: "Om vinteren fryser omkring en fjerdedel af Mars' luft til tøris ved polen. Om foråret bliver den til luft igen."
- Den faste nordkappe er vandis. Den faste sydkappe er vandis med et tyndt låg af tøris.

---

### 7. Gale-krateret og Curiosity

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Gale-kraterets diameter | 154 km | Wikipedia "Gale (crater)" (søgeuddrag) | RS |
| Gale, alder | ca. 3,5–3,8 mia. år | Wikipedia (søgeuddrag) | U |
| Gale, midten | ca. 5,4° S, 137,8° Ø | Wikipedia (søgeuddrag) | RS |
| Mount Sharp (Aeolis Mons), højde | ca. 5,5 km over kraterbunden (NASA: "18.000 ft (5.500 m) from the crater floor"). Fra den sydlige del af bunden ca. 4,5 km | NASA/JPL PIA24085 https://photojournal.jpl.nasa.gov/catalog/PIA24085 (søgeuddrag); worldatlas (søgeuddrag) | S ("ca. 5 km") |
| Mount Sharp, koordinater | ca. 5,08° S, 137,85° Ø | Wikipedia "Mount Sharp" (søgeuddrag) | RS |
| Landing (på Mars) | 6. august 2012 kl. 05:17:57 UTC (5. august kl. 22:17:57 PDT). Signalet nåede Jorden ca. 13 min 48 s senere, kl. ca. 05:31 UTC | JPL "Timeline of major mission events during Curiosity's landing" https://www.jpl.nasa.gov/news/timeline-of-major-mission-events-during-curiositys-landing/ (søgeuddrag) | S |
| Landingssted | Bradbury Landing, 4,5895° S, 137,4417° Ø (nord for Mount Sharp). Opkaldt efter forfatteren Ray Bradbury 22. august 2012 | Planetary Society, noter fra pressemødet 2012 https://www.planetary.org/articles/08061740-curiosity-press-briefing-notes (søgeuddrag); Vasavada m.fl. 2014, JGR Planets; Wikipedia (søgeuddrag) | S |
| Status oktober 2026 | Stadig aktiv. Nåede sol 5.000 i september 2026 (ca. sol 5.050 nu). Kører op ad Mount Sharps skråninger, efter at have undersøgt "boxwork"-området (net af mineralårer fra gammelt grundvand) i 2025–26. Har boret 48 huller (oktober 2026) | NASA Curiosity-blog, sol 4995–5001 og sol 5022–5028 https://science.nasa.gov/blog/curiosity-blog-sols-4995-5001-5000-martian-days-on-mars/ (søgeuddrag); sol 4838–4844 (søgeuddrag) | RS |
| Gammel sø (2013) | Første borehul, "John Klein" i Yellowknife Bay (8. februar 2013): ler (20–30 % smektit), som dannes i vand. Vandet var hverken surt eller meget salt. NASA (marts 2013): Gale var engang et **beboeligt miljø**, dvs. mikrober kunne have levet der. Det er ikke fundet liv | Sky & Telescope 2013 https://skyandtelescope.org/astronomy-news/habitable-oasis-on-mars/ (søgeuddrag); National Geographic 2013 (søgeuddrag) | S |
| Organiske stoffer (2018) | Organiske molekyler i ca. 3,5 mia. år gammel mudsten (Eigenbrode m.fl. 2018, Science). Kan også være dannet uden liv | JPL "NASA finds ancient organic material, mysterious methane on Mars" https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars (søgeuddrag) | S |
| Største organiske molekyler (2025) | Dekan, undekan og dodekan (kæder med 10–12 carbonatomer) i prøven "Cumberland". Måske rester af fedtsyrer, men kilden er usikker (Freissinet m.fl. 2025, PNAS) | NASA Goddard via Mars Daily (søgeuddrag); astrobiology.com 2025 (søgeuddrag) | S (fundet), U (oprindelsen) |
| Metan | Curiosity måler meget lidt metan, der svinger med årstiderne og har kortvarige toppe (Webster m.fl. 2018, Science). ESA's Trace Gas Orbiter ser næsten ingen metan højere oppe (under ca. 0,05 ppb). Det er et uløst mysterium. Metan kan dannes både af liv og af kemi mellem vand og sten | JPL 2018 (søgeuddrag); ESA "Mars orbiters did not see latest Curiosity methane burst" (2020) https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ESA_s_Mars_orbiters_did_not_see_latest_Curiosity_methane_burst (søgeuddrag) | RS (skriv det forsigtigt) |

- Forslag: "Curiosity har vist, at der engang var en sø i Gale-krateret med vand, som mikrober kunne have levet i. Den har også fundet organiske stoffer, men de kan være dannet uden liv."

---

### 8. Jezero-krateret og Perseverance

| Størrelse | Værdi | Kilde | Sikkerhed |
|---|---|---|---|
| Jezero, diameter | 45 km (28 miles) | NASA Mars 2020 https://www.nasa.gov/perseverance (søgeuddrag); JPL presse-kit (søgeuddrag) | S |
| Jezero, beliggenhed | Vestkanten af Isidis Planitia (et stort nedslagsbassin), ca. 18° N, 77° Ø. Midten ca. 18,38° N, 77,58° Ø | JPL presse-kit "Landing Site" https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/landing_site (søgeuddrag); Wikipedia (midten, søgeuddrag) | RS |
| Den gamle sø og deltaet | For ca. 3,5 mia. år siden var krateret en sø (flere hundrede fod dyb), som en flod løb ud i. Floden lagde et delta (vifte af ler og sand) ved vestkanten. Derfor valgt til at lede efter spor af gammelt liv | JPL (søgeuddrag); Live Science (søgeuddrag) | RS |
| Landing | 18. februar 2021. Signalet om landingen nåede Jorden kl. 20:55 UTC (15:55 EST). Selve landingen på Mars var ca. 11 minutter før (lysets tid). **Det præcise tidspunkt på Mars er ikke fundet** | Live Science / EarthSky (søgeuddrag) | S (dato), RS (20:55 UTC modtaget) |
| Landingssted | Octavia E. Butler Landing, 18,4447° N, 77,4508° Ø. Navngivet 5. marts 2021 | Wikipedia "Octavia E. Butler Landing" (søgeuddrag) | RS |
| Ingenuity | Den første helikopter på en anden planet. 72 flyvninger i ca. 3 år (første 19. april 2021). Sidste flyvning 18. januar 2024, hvor mindst ét rotorblad blev ødelagt. NASA meddelte 25. januar 2024, at missionen var slut. I alt over 2 timer i luften og 14 gange længere end planlagt. Samlet strækning ca. 17–18 km (kun sekundære kilder) | NASA-meddelelser via Aviation Today og NASASpaceflight https://nasaspaceflight.com/2024/01/ingenuity-final-flight (søgeuddrag) | S (72 flyvninger og datoerne), U (km) |
| Prøverne | 43 rør i alt. 33 rør fyldt (juli 2025: 27 stenkerner, 2 med løst jord/støv, 1 med luft, 3 kontrolrør). 10 rør blev lagt i et depot ved "Three Forks" i januar 2023 som reserve | NASA (juli 2025) via astrobiology.com https://astrobiology.com/2025/07/the-33-sample-tubes-collected-by-mars-perseverance.html (søgeuddrag); CNN 12. oktober 2026 (søgeuddrag) | RS |
| "Sapphire Canyon" | Prøve fra stenen "Cheyava Falls" (juli 2024) med "leopardpletter" af mineralerne vivianit og greigit. Hurowitz m.fl. 2025 (Nature, 10. september 2025) kalder det et **muligt** biospor: det kan skyldes liv, men også kemi uden liv | ScienceDaily 2025 (søgeuddrag); NPR/KUNC 2025 (søgeuddrag) | S (fundet), skriv forsigtigt |
| Mars Sample Return, status 2026 | Kongressen ville ikke betale for det nuværende MSR-program i finansloven for 2026 (underskrevet 23. januar 2026). I stedet 110 mio. dollar til "Mars Future Missions". Prøverne ligger stadig på Mars, og det er uvist, om og hvornår de kommer til Jorden | Planetary Society https://www.planetary.org/articles/advocacy-success-fy2026-nasa-budget (søgeuddrag); CNN 12. oktober 2026 https://edition.cnn.com/2026/10/12/science/nasa-mars-sample-return-sapphire-canyon-china (søgeuddrag); Scientific American (søgeuddrag) | RS |
| Hvor er roveren i 2026? | Uden for krateret på eller bag Jezeros rand (nåede toppen af randen i december 2024). I 2026 i den 5. kampagne, "Northern Rim". Har kørt ca. 45 km (august 2026, kun Wikipedia) | JPL "Perseverance reaches top of Jezero Crater rim" https://www.jpl.nasa.gov/news/nasas-perseverance-rover-reaches-top-of-jezero-crater-rim/ (søgeuddrag); JPL PIA26754 (søgeuddrag); Wikipedia (søgeuddrag) | RS (på randen), U (km) |

- Forslag: "Perseverance har samlet prøver i rør, som en dag skal bringes til Jorden. Men i 2026 er det uvist, hvornår det sker."

---

### 9. Fælder: populære påstande, der er forkerte eller for skarpe

| Påstand | Hvad der er rigtigt | Kilde | Forslag |
|---|---|---|---|
| "Olympus Mons er tre gange så høj som Mount Everest" | Kommer fra gamle tal (25–27 km fra Viking-tiden, som NASA's egne sider stadig bruger). Med MOLA: ca. 22 km over omgivelserne = ca. 2,5 gange Everest over havet | Plescia 2004; NASA Goddard (søgeuddrag) | "ca. 2½ gange så høj som Mount Everest" |
| "Olympus Mons er det højeste bjerg i solsystemet" | Måske. Rheasilvia's bjerg på Vesta er omtrent lige så højt (ca. 20–22 km). Det afhænger af, hvor man sætter foden | JPL PIA15322 (søgeuddrag) | "et af de højeste bjerge i solsystemet" og "den største vulkan, vi kender" |
| "Mars er rød af rust" | Groft rigtigt: Det røde er støv med jernoxid. Men det er kun et tyndt lag støv, og stenen nedenunder er mørk basalt. En undersøgelse fra 2025 (Valantinas m.fl., Nature Communications) peger på ferrihydrit, et jernoxid med vand, frem for hæmatit | Brown University 25. februar 2025 (søgeuddrag) | "Mars er rød, fordi støvet indeholder jernoxid, et stof der ligner rust" |
| "Valles Marineris er lige så lang som USA" | Ca. 4.000 km. New York–Los Angeles er ca. 3.940 km (egen udregning), så det passer omtrent med New York til Los Angeles. USA's bredeste sted er mere | ESA; egen udregning | "lige så langt som fra Lissabon til Moskva" eller "fra New York til Los Angeles" |
| "Valles Marineris er gravet af en flod" | Nej. Den er en sprækkedal (forkastninger og sammenstyrtning), udvidet bagefter af jordskred og noget vand | NASA/JPL; ASU (søgeuddrag) | "Skorpen revnede og sank ned" |
| "Der er ingen atmosfære på Mars" | Der er en tynd atmosfære (under 1 % af Jordens tryk), mest CO₂. Den giver vind, skyer af is, støvstorme og blå solnedgange | NSSDC | "Mars har en meget tynd luft, mest CO₂" |
| "Støvstorme på Mars kan vælte raketter og rive udstyr i stykker" (som i filmen "The Martian") | Vinden kan være hurtig, men luften er så tynd, at den skubber meget svagt. Det farlige er støvet, der tager sollyset fra solceller (Opportunity 2018) | JPL om Opportunity (søgeuddrag); fysikken ud fra trykket | "Stormene er farlige, fordi støvet skygger for Solen" (påstanden om svagt skub er ikke kildetjekket, så skriv den forsigtigt) |
| "Ansigtet på Mars" | Viking 1 fotograferede 25. juli 1976 en ca. 2 km lang bakke i Cydonia, som lignede et ansigt i skrå belysning. Mars Global Surveyor tog skarpere billeder (1998 og 2001), og de viser en naturlig bakke. Hjernen ser ansigter i tilfældige mønstre (pareidoli) | Universe Today (søgeuddrag); Wikipedia "Cydonia" (søgeuddrag). **NASA's egen side ikke fundet** | "Det var lys og skygge på en naturlig bakke" |
| "Vand kan være flydende i Hellas" | Trykket i bunden er over tripelpunktet, så i teorien kan vand være flydende i kort tid på varme dage. Men det fordamper hurtigt, og ingen har set flydende vand der | Haberle m.fl. 2001 (søgeuddrag af resuméet) | "Her kunne vand i teorien være flydende et kort øjeblik" |
| "Metan på Mars betyder liv" | Metan kan dannes uden liv (kemi mellem vand og sten), og målingerne er uenige (Curiosity ser det, TGO ser næsten intet) | JPL 2018; ESA 2020 (søgeuddrag) | "et uløst mysterium" |
| "Perseverance har fundet liv" | Et **muligt** biospor (Sapphire Canyon, 2025), ikke bevis | Nature 2025 via NPR (søgeuddrag) | "måske et spor efter liv, men det kan også være kemi" |
| "Et døgn på Mars er 24 timer" | Et soldøgn er 24 t 39 min 35 s | NSSDC | "ca. 24 timer og 40 minutter" |
| "Tyngden er en tredjedel af Jordens" | 38 %, lidt mere end en tredjedel | NSSDC | "lidt over en tredjedel" |

---

### Mindst sikre påstande

1. **Arsia Mons' højde**: 17,7–17,8 km over nulpunktet (Plescia 2004) blev ikke fundet i søgningerne. JPL siger "ca. 20 km". Skriv ikke et præcist tal.
2. **Valles Marineris' dybde**: 7, 8, 10 eller 11 km afhænger af kilden og af, hvor man måler fra. Skriv "op til 7–10 km".
3. **Tharsis' størrelse og højde**: 4.000–8.000 km og 4–8 km afhænger af, hvor man sætter grænsen. Brug "på størrelse med Nordamerika" og "flere km højt".
4. **Hvem er højest, Olympus Mons eller Rheasilvia?** Ikke afgjort.
5. **Middeltemperaturen**: −59 °C til −65 °C i forskellige NASA-kilder. Skriv "ca. −60 °C". NSSDC's tal for middeltemperatur og døgnspænd kunne ikke ses.
6. **Ingenuitys samlede strækning** (ca. 17–18 km) har kun sekundære kilder.
7. **Perseverances position og kørte km i 2026** bygger på Wikipedia og ældre NASA-meddelelser. Antallet af fyldte rør (33) er fra juli 2025 og CNN i oktober 2026.
8. **Chasma Boreale** (570 × 100 km) og **sydkappens størrelse** (350–400 km) har kun Wikipedia som kilde.
9. **Hellas' dybde**: Bunden er ca. 7 km under nulpunktet, men det laveste punkt er ca. 8,2 km under. Hold de to tal adskilt.
10. **Perseverances landingstidspunkt på Mars**: Kun tidspunktet for, hvornår signalet nåede Jorden (20:55 UTC), er fundet.
11. **Spiralkløfternes artikler**: At de står i Nature 465 (2010), er efter min hukommelse og ikke bekræftet.
12. **Atmosfærens decimaler**: NSSDC (95,1 / 2,59 / 1,94 %) og Curiosity (Mahaffy 2013) er ikke helt ens. Skriv "ca. 95 % CO₂, lidt nitrogen og argon".
13. Ingen side kunne åbnes direkte. Alle tal bygger på søgeuddrag og bør tjekkes på kildesiden, hvis der senere er adgang.


### 10. Faktatjek af teksterne til Mars-kloden (M2, 24. oktober 2026)
Siderne kunne nu åbnes direkte (efter at domænerne blev åbnet), så tallene er slået op på selve kildesiden af Opus:
- **NSSDC Mars Fact Sheet** (https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html, åbnet): radius 3.396,2 km ved ækvator og 3.376,2 km ved polerne (forskel 20 km), middelradius 3.389,5 km (0,532 × Jordens), tyngde 3,73 m/s² = 0,380 × Jordens, siderisk omdrejning 24,6229 t, døgn 24,6597 t (= 24 t 39,6 min, "ca. 40 minutter"), aksehældning 25,19° (Jorden 23,44°), år 686,980 døgn, højdeforskel ("topographic range") 30 km, tryk 6,36 mbar (0,63 % af 1.013 mbar), CO₂ 95,1 %, middeltemperatur ca. 214 K (−59 °C).
- **NASA "Mars: Facts"** (https://science.nasa.gov/mars/facts/, åbnet): "about half the size of Earth", rød på grund af jern, der oxiderer (ruster), i sten, jord og støv, Olympus Mons "the largest volcano in the solar system". Siden skriver også, at Olympus Mons er "more than 25 miles (… 40 kilometers) tall from base to summit". Det passer ikke med MOLA (ca. 22 km over omgivelserne, Plescia 2004) og bruges ikke.
- **ESA "The Solar System's grandest canyon"** (åbnet): Valles Marineris "over 4000 km long and 200 km wide, and with a dizzying depth of 10 km".
- **Egne udregninger:** Lissabon–Moskva 3.906 km (storcirkel). Olympus Mons 21,9 / 8,849 = 2,47 gange Mount Everest ("næsten 2½ gange"). 21,3 km / 3.396 km = 0,63 % af radius ("ca. 0,6 %"). 45 kg × 0,38 = 17 kg. 687 / 365 = 1,88 ("i snit næsten dobbelt så lang"). Kortets pixel: 21.339 km / 8.192 = 2,6 km. Mars-kortenes egne højder: Olympus Mons' top 21,2 km og Hellas' bund −8,2 km (MOLA-mosaikken), i alt 29,4 km ("ca. 30 km"). Middelhøjden (vægtet efter areal) er ca. −2,2 km på den nordlige og ca. +1,1 km på den sydlige halvkugle, altså ca. 3,3 km forskel. Påstanden "sydhalvkuglen ligger ca. 5 km højere" passer derfor ikke for halvkuglerne (den gælder højlandet i forhold til lavlandet), og teksten siger "flere km højere".

### 11. Faktatjek af teksterne til luften, skyerne og polkapperne (M3, 25. oktober 2026)
Kildesiderne er åbnet direkte af Opus (ikke hjælpeagenter, fordi siderne kunne åbnes). msss.com, nature.com, agupubs (Wiley), sciencedirect, adsabs og NIST kunne ikke åbnes i denne session.

| Påstand i teksten | Resultat | Kilde |
|---|---|---|
| Skalahøjden er 11 km på Mars og ca. 8,5 km på Jorden | OK | NSSDC Mars Fact Sheet ("Scale height: 11.0 km") og Earth Fact Sheet ("Scale height: 8.5 km"), åbnet |
| Luften bliver ca. 2,7 gange tyndere for hver skalahøjde | OK | definitionen: tætheden falder med faktoren e ≈ 2,718 |
| Tusmørket varer op til ca. 2 timer, fordi støv højt oppe spreder sollys ind på natsiden | OK | NASA/JPL PIA07997 (Spirit, 19. maj 2005): "the twilight glow remains visible, but increasingly fainter, for up to two hours before sunrise or after sunset … caused by sunlight scattered around to the night side of the planet by abundant high altitude dust", åbnet |
| Det fine støv lader blåt lys slippe lettere igennem, så himlen er blå omkring Solen ved solnedgang. Curiosity så det i 2015 | OK | NASA/JPL PIA19400 (sol 956, 15. april 2015), åbnet |
| Skyerne over vulkanerne er af is og kommer om eftermiddagen. Luft stiger op ad vulkanens sider, bliver kold, og vanddampen fryser til iskrystaller | OK | NASA/JPL PIA02049 (MGS, 2000): "Clouds are common over the larger Tharsis volcanoes in mid-afternoon … warm air containing water vapor rises up the slopes of each volcano, cools … freeze and form a cloud of ice crystals", åbnet |
| "W"-skyen set i kikkerter fra Jorden var skyerne over fire vulkaner | OK | PIA02049 (Ascraeus, Pavonis, Arsia og Olympus), åbnet |
| Skyerne kommer især om foråret og sommeren på den nordlige halvkugle (også ved Alba Mons) | RS | Wikipedia "Climate of Mars", som citerer Benson m.fl. 2006, Icarus 184, 365-371 (artiklen kunne ikke åbnes) |
| Den lange sky ved Arsia Mons: ca. 1.800 km, i det sydlige forår og sommer, om morgenen | OK | ESA "Mars Express unlocks the secrets of curious cloud" (9. marts 2021): "When spring arrives in southern Mars … 1 800 km in length and 150 km across … repeats every morning", åbnet. **Rettet:** I forslaget skulle den tegnes, men den passer ikke med det nordlige forår, så den nævnes kun i nørd-teksten |
| Nordpolens kappe er ca. 1.000 km bred og mest vandis | OK (afrundet) | Wikipedia "Martian polar ice caps" (1.100 km, vandis), åbnet; ASU (ca. 1.000 km, afsnit 6) |
| Sydpolens kappe er ca. 400 km og har et tyndt lag tøris ovenpå. Den ligger lidt ved siden af polen | OK | Wikipedia "Martian polar ice caps" (400 km, forskudt), åbnet; ESA "Water at Martian south pole" (2004): overfladen er 85 % CO₂-is og 15 % vandis, åbnet; HiRISE (et lag på 1-10 m, afsnit 6) |
| Om vinteren dækker et tyndt lag tøris et meget større område | OK | Wikipedia "Martian polar ice caps" (hver vinter kommer 1,5-2 m tøris til), afsnit 6 |
| Tøris er ca. −78 °C ved Jordens lufttryk og bliver til gas uden at smelte | OK | Wikipedia "Dry ice": sublimerer ved 194,7 K (= −78,5 °C), åbnet |
| Støvet spreder lyset mest fremad (modlys) | OK | almindelig fysik for støv med korn, der er større end lysets bølgelængde. PIA19400 viser det samme tæt ved Solen |
| Skyerne ligger ved Olympus Mons (18,65° N, 226,2° Ø), Ascraeus Mons (11,92° N, 255,92° Ø), Pavonis Mons (1,48° N, 247,04° Ø), Arsia Mons (8,35° S, 239,91° Ø) og Alba Mons (40,47° N, 250,4° Ø) | OK | USGS' navneliste (Gazetteer of Planetary Nomenclature) via Wikipedia |

**Spillets egne tal (står ikke som fakta i teksten):** Skyerne er tegnet 22 km over kuglen, så vulkanernes toppe ikke skærer huller i dem. Tusmørket når 10° ind på natsiden. Det svarer til, at støvet i ca. 52 km højde stadig er i sollys (R · (1/cos 10° − 1)), men tallet er valgt efter billederne og ikke målt. Hvor kraftigt luften lyser, er gættet (det står i "Ærligt talt").

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
| Bevægelse på himlen | Står op i øst og går ned i vest, men meget langsomt: Den er over horisonten i ca. 2,5–2,7 sol ad gangen og kommer igen hver ~5,3 sol | Egen udregning: 1/(1/24,623 t − 1/30,30 t) ≈ 131 t | RS |
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
