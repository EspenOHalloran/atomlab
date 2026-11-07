*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

# Del 3: Mars, Phobos og Deimos (til [plan-mars.md](../plan-mars.md))

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
| Skråninger | i middel 5 % (ca. 3°) ifølge Wikipedia (meget fladt, så står man på toppen, kan man ikke se, at det er et bjerg). Var først noteret som "ca. 5°" (søgeuddrag af Plescia 2004) | Wikipedia (åbnet 29. oktober 2026) | RS ("nogle få grader") |
| Calderaen (krateret på toppen) | 6 indfaldskratere, der overlapper, i alt ca. 65 × 80 km | USGS SIM 3470, Mouginis-Mark 2021 https://pubs.usgs.gov/publication/sim3470 (søgeuddrag) | RS |
| Calderaens dybde | ca. 3 km (Plescia 2004: 3,2 km; ældre: 2,5 km; NASA: "næsten 3 km") | Plescia via søgeuddrag; NASA Goddard (søgeuddrag) | RS ("ca. 3 km") |
| Skrænten ved foden | 6 km (Milkovich 2003), op til 8 km (McGovern 2007), op til 9 km nogle steder (Borgia 2015) | oversigt over Olympus Mons og litosfæren, UCL https://discovery.ucl.ac.uk/id/eprint/10158477/1/OlympusMons_Lithosphere.pdf (søgeuddrag) | RS ("op til 6–8 km") |
| Koordinater (midten) | 18,40° N, 226,00° Ø (= 134,0° V), "Diameter" 648 km. Wikipedia skriver 18,65° N, 226,2° Ø (ældre værdi) | USGS' navneliste https://planetarynames.wr.usgs.gov/Feature/4453 (åbnet 29. oktober 2026) | S |
| Opdaget som vulkan | Schiaparelli kaldte det lyse sted "Nix Olympica" ("Olympens sne") i 1879, fordi det var lyst i kikkerten. Mariner 9 viste i 1971–72, at det er en kæmpe skjoldvulkan, og navnet blev Olympus Mons | USGS-geologisk kort I-2327 https://pubs.usgs.gov/publication/i2327 (søgeuddrag); Linda Hall Library (søgeuddrag) | S |

**Faktatjek af stoppet ved Olympus Mons (Mars M4c, 29. oktober 2026).** Kilderne er åbnet med curl (ikke kun søgeuddrag):
- Wikipedia "Olympus Mons" (https://en.wikipedia.org/wiki/Olympus_Mons): skjoldvulkan af "many thousands of highly fluid, basaltic lava flows" som på Hawaii, "about 600 km wide", seks calderaer "60 × 80 km across" og "up to 3.2 km deep", dannet ved "roof collapse following depletion and withdrawal of the subsurface magma chamber", skrænten "up to 8 km tall", "The average slope on the volcano's flanks is only 5%" (5 % ≈ 3°), og "an observer near the summit would be unaware of standing on a very high mountain, as the slope of the volcano would extend far beyond the horizon, a mere 3 kilometers away".
- Taylor m.fl. 2020, "What can Olympus Mons tell us about the Martian lithosphere?", J. Volcanol. Geotherm. Res. 402, 106981 (https://discovery.ucl.ac.uk/id/eprint/10158477/1/OlympusMons_Lithosphere.pdf): "the largest known volcano in the solar system", "a basal radius of around 300 km", "22 km above the surrounding plains (Plescia, 2004)" og skrænten "up to 10 km high that surrounds the majority of the edifice".
- USGS SIM 3470 (Mouginis-Mark 2021, https://pubs.usgs.gov/publication/sim3470): "six overlapping collapse pits that collectively measure ~65 x ~80 kilometers".
- Plescia 2004 (resuméet på https://pubs.usgs.gov/publication/70026910): "relief varies from 1.0 km to almost 22 km" og "Average flank slopes are in the range of <1° to ∼10°" (for alle vulkanerne).
- Egen udregning: Horisonten for et øje 1,7 m over jorden: √(2 · 3.396 km · 0,0017 km) ≈ 3,4 km ("ca. 3 km").
- **Rettet:** Skråningen var noteret som "ca. 5°" (søgeuddrag). Wikipedia skriver 5 % (ca. 3°). Teksten siger derfor "nogle få grader". Skrænten er "op til ca. 8 km" (Wikipedia), og Taylor 2020 skriver op til 10 km, så teksten siger "nogle steder op til ca. 8 km høj". Koordinaterne er nu USGS' (se tabellen).

**Faktatjek af stoppene ved calderaen og skrænten (Mars M7a, 30. oktober 2026).** En hjælpeagent (Opus, høj effort) tjekkede teksterne. Åbnet direkte: USGS SIM 3470 (siden og pamfletten https://pubs.usgs.gov/sim/3470/sim3470_pamphlet.pdf), ESA "Olympus Mons – the caldera in close-up", USGS' side om Viking-mosaikken i 232 m og NSSDC. Wikipedia og Taylor m.fl. 2020 er læst fra kopier hentet med curl. Blokeret: nature.com (Neukum 2004) og lpi.usra.edu (Robbins 2011) gav 403, og AGU/Wiley (Plescia 2004) svarer selv 403, så deres tal er kun læst, som SIM 3470 gengiver dem.

| Påstand | Resultat | Kilde |
|---|---|---|
| Seks kratere, ca. 65 × 80 km, op til ca. 3 km dybe | OK. **Rettet sproget:** kraterne "overlapper hinanden" (ikke "inden i hinanden", de ligger mest side om side) | SIM 3470: "six nested paterae … collectively measure ~65 x ~80 km"; ESA: "depth of about 3 km" |
| Taget sank ned over det tømte kammer, mindst seks gange, de yngste skærer sig ind i de ældre | OK. "Hvert krater (en caldera)" i stedet for "Calderaen" | ESA; Wikipedia |
| Kraternes alder | **Rettet:** "nogle hundrede millioner år, skønnene går fra ca. 100 til 400 millioner år" (var 150-350). Neukum 2004: ca. 100-200 mio. år; Robbins 2011: ca. 140-420 mio. år. Kratertællingerne passer ikke helt med rækkefølgen | SIM 3470 |
| Kanten over nulpunktet | **Rettet:** "ca. 20-21 km" (kanten ligger 19,38-21,08 km; det højeste punkt, 21,29 km, ligger ca. 11 km syd for calderaen) | SIM 3470 |
| Lufttrykket ved kanten | **Rettet:** "ca. 10-15 %" (var 12 %). Wikipedias 72 Pa hviler på en svag kilde. Egen udregning: exp(−20,5 / 11) ≈ 13 %, og skalahøjden 9,5-11 km giver 11-15 %. NSSDC: skalahøjde 11,0 km | NSSDC; egen udregning |
| Skrænten rundt om det meste, op til ca. 8 km | OK (Taylor 2020 skriver op til 10 km; teksten bruger 8 km som de andre tekster) | Wikipedia; Taylor 2020 |
| Mod nordvest: ca. 8 km fald på ca. 20 km | OK som egen måling ("i kortet"): 7,8 km fald på ca. 20 km ved ca. 22° N, 137,3° V i HRSC+MOLA. Ingen kilde siger direkte, at skrænten er højest mod nordvest, men Plescia måler relieffet fra "the foot of the cliffs which form its northwest margin" | Wikipedia; højdekortet |
| Ingen andre skjoldvulkaner på Mars har sådan en kant | OK: "a feature unique among the shield volcanoes of Mars" | Wikipedia (Lopes m.fl. 1982) |
| Dannelsen er usikker: glidning under egen vægt eller kæmpe skred | OK | Wikipedia; Taylor 2020 ("gravity-driven spreading") |
| Det rillede landskab mod nordvest (aureolen, Lycus Sulci) op til ca. 750 km ud, måske rester af skred | OK | Wikipedia |
| Ca. 300.000 km², ca. 7 gange Danmark | OK: 300.000 / 43.000 ≈ 7; 600 km i diameter giver ca. 283.000 km² | Wikipedia; SIM 3470 |
| HRSC regner højder ud fra billeder fra forskellige vinkler | OK: "derived from the stereo channels" | ESA |
| Skarpere Viking-billeder har skygger fra Solen | OK: "Images were obtained with a wide range of solar incidence angles" | USGS' side om 232 m-mosaikken |

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

