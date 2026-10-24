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
