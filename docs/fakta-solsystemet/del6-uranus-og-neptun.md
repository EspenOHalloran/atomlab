*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md).*

# Del 6: Uranus og Neptun (til [plan-uranus-neptun.md](../plan-uranus-neptun.md), 7. november 2026)

*Lavet af Opus (høj effort) uden hjælpeagenter: Tallene er slået op direkte i kilderne. Ikke tjekket af Fable. Teksterne til programmet faktatjekkes igen med `/faktatjek`, når de skrives (UN5).*

**Sådan blev der tjekket:** Åbnet direkte: NSSDC's faktaark (planeterne, månerne og ringene), JPL Horizons (Solens højde over planeterne, regnet 7. november 2026), JPL SSD (listen over månerne), science.nasa.gov, Hubbles OPAL (`archive.stsci.edu`, kun med emSign-roden, se [erfaringerne](../erfaringer/netsider-og-arbejdsgang.md)), USGS, PDS Rings, ESA/Hubble, arXiv og Wikipedias wikitekst. Lukket eller ikke prøvet: `academic.oup.com` (Irwin m.fl. 2024 er derfor læst gennem Wikipedias henvisning), `research-collection.ethz.ch`, `commons.wikimedia.org`. Wikipedias API svarede 429 efter få opslag.

**Sikkerhed:** **S** = læst i kilden, **RS** = ret sikker (min egen viden eller en sekundær kilde, tjekkes i UN5), **U** = usikker, skal slås op, før den bruges.

## 1. Planeterne (NSSDC, opdateret 2.-3. oktober 2024)
Kilder: https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html og `neptunefact.html`.

| | Uranus | Neptun | Sikkerhed |
|---|---|---|---|
| Radius ved ækvator / polen (1 bar) | 25.559 / 24.973 km (fladtrykt 2,29 %) | 24.764 / 24.341 km (fladtrykt 1,71 %) | S |
| Masse | 86,811 × 10²⁴ kg = 14,5 Jordmasser | 102,409 × 10²⁴ kg = 17,1 Jordmasser | S |
| Tæthed | 1.270 kg/m³ | 1.638 kg/m³ | S |
| Tyngdekraft (1 bar, middel) | 9,01 m/s² (lidt under Jordens) | 11,27 m/s² | S |
| Afstand til Solen | 2.867 mio. km = 19,2 AU (18,6-19,7) | 4.515 mio. km = 30,2 AU (29,8-30,5) | S |
| Omløbstid | 84,01 år | 164,79 år | S |
| Døgn | 17,24 t, "baglæns" (−17,24 t i NSSDC's tabel) | 16,11 t (Voyagers radiomåling) | S |
| Aksens hældning | 97,77° (ækvator hælder 82,23°) | 28,32° | S |
| Sollys | 3,69 W/m² (1/369 af Jordens) | 1,508 W/m² (1/903) | S |
| Temperatur ved 1 bar | 76 K (−197 °C) | 72 K (−201 °C) | S |
| Luften | 82,5 % brint, 15,2 % helium, 2,3 % metan | 80 % brint, 19 % helium, 1,5 % metan | S |
| Vind (NSSDC) | 0-250 m/s | 0-580 m/s | S |
| Magnetfeltets akse | hælder 58,6°, flyttet 0,352 radier fra centrum | hælder 46,9°, flyttet 0,485 radier | S |
| Opdaget | 13. marts 1781 af William Herschel | 23. september 1846 af Johann Gottfried Galle (ud fra Le Verriers og Adams' beregninger) | S |
| Lyset er undervejs (regnet) | 2,7 timer | 4,2 timer | S (regnet) |

- **"Baglæns" eller tippet 82°?** Begge dele beskriver det samme. NSSDC skriver 97,77° og et negativt døgn. Man kan også sige, at Uranus drejer den almindelige vej, men med aksen tippet 82° den anden vej. Til en 13-årig: "Uranus ligger på siden." **S** (NSSDC har begge tal).
- **Neptuns døgn:** Karkoschka (2011) fandt 15,9663 t ud fra to skyformationer ved sydpolen, der holdt takten i over 20 år. Det er ikke officielt (NSSDC bruger 16,11 t). **S** (Chavez m.fl. 2023, arXiv:2307.06462).

## 2. Årstiderne (regnet med JPL Horizons 7. november 2026)
Solens bredde på planeten (kolonne 15 i Horizons, set fra Jorden, `CENTER=500@399`). Positiv = IAU's nordpol får sol. **S** (regnet).

| Planet | Dato | Solens bredde | Hvad |
|---|---|---|---|
| Uranus | okt. 1985 | −82,6° | Sydpolen peger næsten mod Solen (Voyager 2 kom 24. jan. 1986, −82,5°) |
| Uranus | 8. dec. 2007 | 0° | Jævndøgn: ringene står på kant mod Solen |
| Uranus | 7. nov. 2026 | +74,3° | Nordpolen har sol nu |
| Uranus | mar.-apr. 2030 | +82,6° | Solhverv i nord (højeste værdi i Horizons) |
| Neptun | juni 2005 | −29,2° | Solhverv i syd |
| Neptun | 7. nov. 2026 | −19,5° | |
| Neptun | apr. 2046 | 0° | Jævndøgn |

- **Fælde: "Solhverv på Uranus i 2028."** Mange skriver 2028, men Horizons har den højeste solhøjde i marts-april 2030. Siden siger "omkring 2030", indtil kilden er fundet. **U** (tjek i UN5). Horizons regner muligvis i planetodetisk bredde (82,6° er over 180° − 97,77° = 82,2°), men det ændrer ikke tidspunktet.
- **Hver pol har sol i ca. 42 år og mørke i ca. 42 år** (halvdelen af 84 år). Tæt på polen er der "midnatssol" i flere årtier. **S** (følger af omløbstiden og hældningen).

## 3. Farverne
- **Uranus og Neptun har næsten samme farve: en lys grønlig blå.** Neptun er en smule mere blå. Voyager 2's billeder af Neptun fra 1989 var forstærket "to better reveal the clouds, bands and winds", og det gav myten om en dybblå Neptun. Kilde: Irwin m.fl. 2024, MNRAS 527(4): 11521-11538, doi:10.1093/mnras/stad3761 (fri adgang), læst gennem Wikipedias artikel "Neptune" (wikitekst 7. november 2026). **RS** (selve artiklen var lukket, `academic.oup.com`).
- **Uranus' farve skifter med årstiden:** Den er mere grønlig ved solhverv, når den lyse kappe over polen vender mod Solen, og mere blå ved jævndøgn. Samme kilde. **RS**.
- **Hvorfor de er blå:** Metan opsuger rødt lys. Uranus er lysere end Neptun, fordi der er et tykkere lag dis i Uranus' rolige luft. Kilde: ESA/Hubble, 31. maj 2022 ("Hubble Helps Explain Why Uranus and Neptune Are Different Colours"), og Irwin m.fl. 2022 (arXiv:2201.04516). **S**.
- **Hubbles kort har ikke de ægte farver:** OPAL's farvebilleder er "arbitrarily scaled" med "slight contrast enhancement" (README). FITS-filerne kan regnes om til den rigtige lysstyrke (I/F) med tabellens faktorer, og så kan farven regnes ud. **S** (OPAL's README, cyklus 32 og 33).

## 4. Vindene
- **Neptun** (Voyager 2, Sromovsky m.fl. 1993): u(φ) = −398 + 0,188 φ² − 1,2 × 10⁻⁵ φ⁴ m/s, φ i grader (planetografisk), negativ = mod vest. Ved ækvator −398 m/s (ca. 1.430 km/t mod vest), 0 ved ca. ±50°, +235 m/s ved 70°. Kilde: Fitzpatrick m.fl. 2014, tabel 1 (arXiv:1312.2676), som gengiver Sromovsky 1993. **S**.
- **Uranus** (symmetrisk tilpasning, Sromovsky og Fry 2005): u(φ) = 27,46 + 36,568 cos φ − 175,486 cos 3φ m/s, positiv = med planetens drejning ("prograde"). Ved ækvator −111 m/s (mod drejningen), +221 m/s ved 60°. Der findes også en tilpasning, der ikke er symmetrisk (samme artikel), for nord og syd er forskellige. Kilde: arXiv:1503.03714, figur 6. **S**.
- **Fælde om retningen:** Ved Uranus er IAU's "vestlig" det samme som "med drejningen", fordi Uranus drejer baglæns i IAU's system (artiklen siger det selv). I koden: Brug fortegnet "med drejningen", og tjek retningen på et billede.
- **Fælde: "Neptuns vind er 2.100 km/t."** Voyagers tilpasning giver ca. 400 m/s (1.400 km/t). NSSDC skriver op til 580 m/s, og Wikipedia skriver "almost 600 m/s" for enkelte målinger. Sikker formulering: "de hurtigste vinde på nogen planet, ca. 1.400 km/t ved ækvator". **S**.
- **Hvorfor så hurtigt, når der er så lidt sollys?** Neptun får kun ca. 40 % af Uranus' sollys, men har varme indefra, som er nok til de hurtigste vinde. Kilde: Wikipedia "Neptune" (wikitekst). **RS**.

## 5. Plettene og skyerne
- **Den Store Mørke Plet** blev set af Voyager 2 i 1989 på den sydlige halvkugle. Kilde: Wikipedia "Neptune". **S** (wikitekst). Den var væk på Hubbles billeder i 1994. **RS**. Størrelsen (ca. 13.000 × 6.600 km) **U**.
- **Nye mørke pletter** er set af Hubble siden (fx i 2018). **S** (Wikipedia). Hubbles kort fra august 2025 (OPAL) bruges i UN3 til at se, hvad der er nu.
- **"Scooter"** var en hvid sky, som Voyager så bevæge sig hurtigere end Den Store Mørke Plet (PIA01142). **RS**.
- **Hvide skyer af metan-is ligger højt og kaster skygger** på skylaget under dem (Voyager-foto af skystriber med skygger). **RS**, højden **U**.
- **Den sydpolare bølge** på Neptun ved ca. 60° S er set siden Voyager og flytter sig 4,866°/døgn (2019-2021). **S** (arXiv:2307.06462).
- **Uranus' kappe over nordpolen** er lys i Hubbles kort fra oktober 2025. **S** (set i OPAL's kort, cyklus 33).

## 6. Ringene (NSSDC, opdateret 14. oktober 2015)
**Uranus:** 13 ringe. Radius fra centrum i km (bredde):
6: 41.837 (1,5), 5: 42.234 (2), 4: 42.571 (2), Alfa: 44.718 (4-10), Beta: 45.661 (5-11), Eta: 47.176 (1,6), Gamma: 47.627 (1-4), Delta: 48.300 (3-7), Lambda: 50.024 (2), **Epsilon: 51.149 (20-96)**, R/2003 U 2 (ν): 67.300 (3.800 bred, meget svag), R/2003 U 1 (μ): 97.700 (17.000 bred, meget svag). Ringene er meget mørke: albedo ca. 0,015 (1,5 % af lyset sendes tilbage). Epsilon-ringen er ikke cirkulær (excentricitet 0,0079). **S**.
- Opdaget 10. marts 1977, da Uranus gik foran en stjerne, og stjernen blinkede før og efter planeten. **RS**.

**Neptun:** Galle (ca. 41.900 km, ca. 2.000 km bred), Le Verrier (ca. 53.200 km, under 100 km), Lassell (ca. 53.200 km, ca. 4.000 km bred), Arago (ca. 57.200 km) og **Adams** (62.933 km, ca. 15 km bred) med fem **ringbuer**: Courage, Liberté, Egalité 1 og 2 og Fraternité. Buerne er tættere (optisk dybde 0,12) end resten af ringen (0,01-0,1). **S** (NSSDC).
- Buerne ændrer sig: Keck-billeder fra 2002-2003 viste, at de var svagere end hos Voyager, og Liberté kan forsvinde inden for ca. 100 år. Kilde: Wikipedia "Neptune" (henviser til en nyhed fra 2005). **RS**.
- Ringenes navne kommer fra astronomer, der havde med Neptuns opdagelse at gøre. **RS**.

## 7. Månerne
**Antal:** Uranus har 29 kendte måner (NASA, "as of August 2026", https://science.nasa.gov/uranus/moons/, og JPL SSD's liste med S/2025 U1, fundet af JWST). Neptun har 16 (JPL SSD, https://ssd.jpl.nasa.gov/sats/discovery.html). NSSDC's 28 for Uranus er forældet. **S**.

**Uranus' fem store** (NSSDC, opdateret 11. marts 2023). Radius, middelafstand, omløbstid. Alle vender samme side mod Uranus og kredser i Uranus' ækvatorplan:
| Måne | Radius | Afstand | Omløb | Opdaget | Set fra skyerne (regnet) | Uranus set fra månen (regnet) |
|---|---|---|---|---|---|---|
| Miranda | 235,8 km (240 × 234 × 233) | 129.900 km | 1,413 døgn | 1948, Kuiper | 0,26° | 22° |
| Ariel | 579 km | 190.900 km | 2,520 døgn | 1851, Lassell | 0,40° | 15° |
| Umbriel | 584,7 km | 266.000 km | 4,144 døgn | 1851, Lassell | 0,28° | 11° |
| Titania | 788,9 km | 436.300 km | 8,706 døgn | 1787, Herschel | 0,22° | 6,7° |
| Oberon | 761,4 km | 583.500 km | 13,463 døgn | 1787, Herschel | 0,16° | 5,0° |

(Opdagelserne: NASA's liste på science.nasa.gov, **S**. Miranda hælder 4,34° i forhold til ækvator, de andre under 0,2°, **S**.)
- **Voyager 2 så kun den sydlige halvdel af månerne**, for Solen stod over deres sydpoler i 1986 (−82° på Uranus). **S** (følger af tabellen i afsnit 2). Den nordlige halvdel er aldrig fotograferet tæt på. **RS**.
- **Mirandas klippe Verona Rupes** er ca. 20 km høj, en af de højeste i solsystemet. **U**.
- **Navnene** kommer fra Shakespeare og Alexander Pope. **RS**.

**De små indre måner, der kan støde sammen** (jeres spørgsmål 7. november 2026). Radius og afstand fra NSSDC (**S**):
| Måne | Radius | Afstand | Omløb |
|---|---|---|---|
| Cressida | 41 km | 61.800 km | 0,4636 døgn |
| Desdemona | 35 km | 62.700 km | 0,4737 døgn |
| Cupid | 9 km | 74.390 km | 0,613 døgn |
| Belinda | 45 km | 75.300 km | 0,6235 døgn |
| Perdita | 13 km | 76.420 km | 0,638 døgn |
- **Cressida og Desdemona** støder sandsynligvis sammen inden for 100 millioner år: Duncan og Lissauer (1997) fandt sammenstød mellem de indre måner på 4-100 millioner år, French og Showalter (2012) fandt det samme med Cressida og Desdemona som de første, og Ćuk m.fl. (2022) bekræfter det. **S** (Ćuk m.fl. 2022, "Cupid Is Not Doomed Yet: On the Stability of the Inner Moons of Uranus", arXiv:2205.14272, resumé og indledning).
- **Cupid og Belinda:** French og Showalter (2012) fandt, at Belinda-gruppen (Cupid, Belinda og Perdita) bliver ustabil på ca. 100.000 år, oftest med et sammenstød mellem Belinda og Cupid. Ćuk m.fl. (2022) fandt med nyere baner, at en resonans 44 : 43 mellem Belinda og Perdita kan holde gruppen stabil i 50-100 millioner år. **S** (samme).
- **Tidligere sammenstød:** Ćuk m.fl. foreslår, at de indre måner er samlet igen efter tidligere sammenstød og opløsning, "possibly hundreds of Myr ago". Det er et forslag, ikke bevist. **S** (samme).
- **Cressida overhaler Desdemona** ca. hver 21,8. døgn (regnet: 1/(1/0,4636 − 1/0,4737)). **S** (regnet).
- **Fælde:** "To af Uranus' måner støder snart sammen." "Snart" betyder her millioner af år, og det er de små indre måner, ikke de fem store. Og for Cupid er det ikke længere sikkert.

**Triton** (NSSDC): radius 1.353,4 km, tæthed 2.050 kg/m³, afstand 354.760 km, omløb 5,877 døgn **baglæns** (hældning 157,3°), vender samme side mod Neptun. Den eneste store måne i solsystemet, der kredser baglæns. Opdaget 1846 af Lassell (17 dage efter Neptun, **RS**). **S**.
- **Set fra Neptuns skyer er Triton 0,47° bred**, næsten som Månen set fra Jorden (0,53°). Neptun set fra Triton: 8,0°. **S** (regnet).
- **Gejsere:** Voyager 2 så mørke skyer, der steg ca. 8 km op fra Tritons sydpolare kappe. **RS** (højden **U**).
- **Triton er nok indfanget** fra Kuiperbæltet (fordi den kredser baglæns). Det er den mest udbredte forklaring, ikke bevist. **RS**.
- **Triton nærmer sig langsomt Neptun** og bliver revet i stykker om mange milliarder år. **U** (tallet skal slås op).
- **Nereid** har den mest aflange bane af månerne (excentricitet 0,75). **S** (NSSDC).

## 8. Voyager 2 og fremtiden
- Voyager 2 fløj forbi Uranus 24. januar 1986 og Neptun 25. august 1989, og den er stadig den eneste rumsonde, der har besøgt dem. **S** ([del 2](del2-voyager.md) og Wikipedia).
- **Uranus Orbiter and Probe** var den højest prioriterede nye store mission i den amerikanske Decadal Survey 2022. **RS**. Status i 2026 (om den er godkendt) **U**.

## 9. Fælder (populære påstande, der er forkerte eller for skarpe)
1. **"Uranus blev væltet af et kæmpe sammenstød."** Det er den mest udbredte forklaring, men den er ikke bevist. Skriv "man tror".
2. **"Isgiganterne er lavet af is."** "Is" betyder her stoffer som vand, ammoniak og metan. Inde i planeterne er de varme og tætte væsker, ikke frossen is.
3. **"Det regner med diamanter."** Det er en hypotese, som forsøg i laboratorier støtter, men det er ikke set. Skriv det forsigtigt eller lad være.
4. **"Neptun er dybblå, Uranus er grønlig-hvid."** Se afsnit 3.
5. **"Neptuns vind er 2.100 km/t"** og **"solhverv på Uranus i 2028"**: se afsnit 2 og 4.
6. **"Den Store Mørke Plet er Neptuns Røde Plet."** Den var væk efter få år. Pletterne på Neptun kommer og går.
7. **"Uranus har 27 (eller 28) måner"** og **"Neptun har 14"**: forældet. Brug 29 og 16 med datoen.
8. **"Uranus er den koldeste planet."** Den har den laveste målte temperatur i den øvre luft (ca. 49 K), selvom Neptun er længere væk. **RS**, tallet **U**.
9. **Hubbles kort:** Uranus-kortet har 0° øst i højre kant (længden vokser mod venstre), og Neptun-kortet har 360° vest i venstre kant. Begge er planetografiske og har 2 pixel pr. grad (721 × 361). Uranus-kortet fra 2025 har kun den nordlige halvdel (resten var i mørke). **S** (README).

## 10. Billeder og data (tjekket med curl 7. november 2026)
| Hvad | Kilde | Licens |
|---|---|---|
| Hubbles kort over Uranus (23.-24. okt. 2025) og Neptun (24.-25. aug. 2025), 721 × 361, farve og 7-8 filtre (TIF og FITS), og ældre kort år for år fra 2014 | OPAL, `archive.stsci.edu/missions/hlsp/opal/cycle33/uranus/` og `cycle32/neptune/` | CC BY 4.0 (står på OPAL's side). NASA/ESA/A. Simon (OPAL) |
| Solar System Scope `2k_uranus.jpg` (helt glat) og `2k_neptune.jpg` (Voyagers forstærkede farver, med Den Store Mørke Plet) | `www.solarsystemscope.com/textures/download/` (hentes med en ærlig User-Agent) | CC BY 4.0 |
| Triton i farver, hele kloden (huller udfyldt), 600 m pr. pixel, 299 MB | USGS, `planetarymaps.usgs.gov/mosaic/Triton_Voyager2_ClrMosaic_GlobalFill_600m.tif` | Public domain |
| Uranus' fem store måner | **Ingen globale kort hos USGS** (kun kontrolnet og navne). Voyagers rå billeder ligger i PDS Rings (`pds-rings.seti.org/holdings/volumes/VGISS_7xxx/`, Neptun i `VGISS_8xxx`) | Public domain (NASA) |
| JWST's billeder af Uranus og ringene | `esawebb.org` | CC BY 4.0 |
