# Fakta: Gåden "Er der en planet mere i Solsystemet?" (Planet 9)

*Faktatjek 20. november 2026 (Opus, sessionen "Småting · Gåden Planet 9"). Hører til [fakta-gaader.md](fakta-gaader.md) ("Reserven"), som blev for stor til at få mere. Teksterne står i `js/data/gaader.js` (kortet `planet9`) og `js/data/sider/overblik.js` ("Hvor tomt er her egentlig?"). Omstridt stof: Kan tjekkes af Fable senere (linjen står i [plan-fable.md](plan-fable.md)).*

## Påstandene
| # | Påstand i teksten | Vurdering | Kilde |
|---|---|---|---|
| 1 | Ingen har set Planet 9 (pr. november 2026) | OK | arXiv-søgning "Planet Nine" (intet fund 2025-2026), Wikipedia "Planet Nine" ("existence remains purely conjectural") |
| 2 | Pluto var planet nr. 9 indtil 2006, nu en dværgplanet | OK | IAU 2006 (står allerede i overblikket og Ordbogen) |
| 3 | Batygin og Brown 2016: seks småkloder (Sedna, 2012 VP113, Alicanto, 2010 GB174, 2007 TG422, 2013 RF98) peger samme vej og hælder omtrent ens | OK | Batygin og Brown, AJ 151:22 (arXiv:1601.05438, abstract læst), Wikipedia (listen over de seks) |
| 4 | Kun 0,007 % chance for et tilfælde | OK | Samme abstract: "only a probability of 0.007% to be due to chance" |
| 5 | Planeten skulle være over ca. 10 jordmasser, med perihelium 180° modsat småklodernes | OK | Samme abstract: "mass greater than ~10 Earth masses", "perihelion is 180 degrees away" |
| 6 | 2021: ca. 6 jordmasser og ca. 380 AU, mønstret 99,6 % | OK | Brown og Batygin, AJ 162:219 (arXiv:2108.09868, abstract læst): 6,2 (+2,2/−1,3) M⊕, 380 (+140/−80) AU |
| 7 | 2025: Siraj, Chyba og Tremaine: ca. 3 sigma, 4,4 ± 1,1 jordmasser, 290 ± 30 AU, og deres planet er ikke den samme som Brown og Batygins | OK | ApJ 978:139, januar 2025 (arXiv:2410.18170, abstract læst: "~3σ", "only 0.06% of the Brown & Batygin (2021) Planet Nine reference population"). Bemærk: artiklen hedder "Orbit of a Possible Planet X" |
| 8 | Siraj m.fl.: planeten står sandsynligvis i en del af himlen, Rubin måler, og er lys nok | OK | Artiklens tekst (arxiv.org/html/2410.18170v2): 60 % på nordlig himmel lavt ved ekliptika, som LSST dækker, "all planets are brighter than the LSST flux limit" |
| 9 | OSSOS og Dark Energy Survey fandt i 2020 ingen tegn på, at banerne peger samme vej, når man regner med, hvor de ledte | OK | Wikipedia: "Both surveys adjusted for observational bias and concluded that … there was no evidence for clustering" (kilden ikke læst direkte) |
| 10 | 2017 OF201: meldt maj 2025, ca. 700 km, peger en anden vej | OK | Cheng, Li og Yang (arXiv:2505.15806, 21. maj 2025): "diameter about 700 km" (med albedo 0,13), "longitude of perihelion … lies outside the clustering" |
| 11 | 2023 KQ14 (meldt 2025) peger en anden vej | OK | Wikipedia: "its longitude of perihelion lies opposite that of previously known sednoids" (kilden ikke læst direkte) |
| 12 | Rubin begyndte sin tiårige måling (LSST) 30. juni 2026 | OK | Wikipedia (fakta-faelder.md) og nyheder 1. juli 2026 (Tech Times, "Rubin Observatory Begins LSST") |
| 13 | Rubins teleskop er 8,4 m, verdens største digitale kamera til astronomi, hele himlen hvert par nætter | OK | NSF og NOIRLab (nyheder 2024-2025, kun søgeresultater læst) |
| 14 | Voyager 1 har fløjet i 49 år og er ca. 170 AU ude | OK | Opsendt 1977. 25,9 mia. km 18. november 2026 ([drejebog-overblik.md](drejebog-overblik.md) nr. 18) / 149,6 mio. km = 173 AU |
| 15 | Planet X: Lowell ledte fra 1906, Tombaugh fandt Pluto i 1930, som var for lille | OK | Wikipedia "Planet Nine", afsnit History |
| 16 | Nogle forskere vil hellere sige Planet X | OK | Alan Stern 2018 (Wikipedia, citat ikke brugt) |
| 17 | Hvis den findes, kommer den aldrig nærmere Solen end ca. 200 AU | OK | Siraj m.fl.: perihelium 200 ± 50 AU. Brown og Batygin 2021: 300 AU |
| 18 | Man kan kun se de fjerne småkloder tæt på Solen | OK | Alle 31 i JPL's liste har middelanomali nær 0° (de er tæt på perihelium nu). Lyset falder med afstanden i fjerde potens (lærebog) |
| 19 | Banerne (a, e, i, Ω, ω, M) | OK | JPL Small-Body Database, `sbdb_query.api`, 20. november 2026, a > 250 AU, q > 30 AU, målt over mindst et år og condition code ≤ 5: 31 baner. Værktøjet: `tests/vaerktoejer/lav_planet9.py` |

## Det, scenen snyder med (står i "Ærligt talt")
- Banerne er set lige oppefra, så hældningen ses ikke.
- Tiden: ét sekund er ca. 200 år.
- Planet 9's stiplede bane: størrelsen fra Siraj m.fl. 2025 (a = 290 AU, e = 0,29), men retningen (perihelium modsat de seks) er Batygin og Brown 2016's idé. Siraj m.fl. giver ikke en retning i abstractet. Kloden er tegnet ved det fjerneste punkt og alt for stor.
- Rubins felter er en tegning, ikke de rigtige felter.

## Ikke brugt
- 2026-fundene i JPL's liste (fx 2026 BT17, 2026 HP19) har kun få ugers målinger (condition code 6-9) og er ikke med. Mange af dem peger andre veje, men ingen artikel har regnet på dem endnu. Tjek igen, når Rubins første resultater om fjerne småkloder kommer.
- Andre forklaringer (en skive af små kloder, et lille sort hul, MOND): står på Wikipedia, men er ikke med for at holde kortet kort.

## Tjek igen, før teksten ændres
- Har Rubin fundet planeten, eller meldt om mønstret? (arXiv "Planet Nine", "LSST distant TNO").
- Nye skøn efter 2025, og om 2017 OF201 og 2023 KQ14 stadig står som modstrid.
