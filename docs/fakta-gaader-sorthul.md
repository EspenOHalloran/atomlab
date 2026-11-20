# Fakta: Scenen til "Hvad er der inde i et sort hul?" (G4c)

*Faktatjek 20. november 2026 (Opus, sessionen "Småting · Gåderne G4c: Sort hul"). Hører til [fakta-gaader.md](fakta-gaader.md) (afsnit 2), som er tæt på 30 KB. Teksterne står i `js/data/gaader.js` (kortet `sorthul`: `ven` og `scene`), og scenen i `js/gaader/sorthul.js`. Kortets egne tekster (trin, nørd, ærligt) er ikke ændret. 13 påstande, tjekket af hovedsessionen selv (under 15).*

## Påstandene
| # | Påstand i teksten | Vurdering | Kilde |
|---|---|---|---|
| 1 | LIGO målte 14. september 2015 en tyngdebølge fra to sorte huller, der smeltede sammen | OK | Abbott m.fl., PRL 116, 061102 (arXiv:1602.03837, abstract læst): "On September 14, 2015 … observed a transient gravitational-wave signal … inspiral and merger of a pair of black holes" |
| 2 | Signalet steg fra 35 til 250 svingninger i sekundet | OK | Samme abstract: "sweeps upwards in frequency from 35 to 250 Hz" |
| 3 | … på ca. 0,2 sekunder | OK | Samme artikel (PDF læst): "Over 0.2 s, the signal increases in frequency and amplitude in about 8 cycles from 35 to 150 Hz". Hele signalet med udringningen er lidt længere, derfor "ca." |
| 4 | Tonen er lagt to oktaver op og spillet fire gange så langsomt | Programmets eget valg, står i "Ærligt talt" | Plan og Fables noter (E8: 35 Hz høres næsten ikke i en tablets højttaler) |
| 5 | Kurven er tegnet efter en enkel formel, ikke måledata | OK (ærligt) | Lærebogens chirp for to kredsende masser: f ∝ (tc − t)^(−3/8), styrken ∝ f^(2/3) (Peters og Mathews). Formlen giver ca. 10 svingninger fra 35 til 150 Hz, artiklen ca. 8, så den siges at være en tegning. Udringningen (ca. 4 ms ved ca. 250 Hz) er et skøn i koden, ikke slået op, og står ikke i teksten |
| 6 | Tyngdebølger er ikke lyd: Det er rummet selv, der strækkes og trykkes | OK | Wikipedia "Laser Interferometer Space Antenna": "slight ripples in the fabric of spacetime", lærebogsviden |
| 7 | Hullet er regnet med Einsteins teori for et sort hul, der ikke drejer | OK | `js/kosmos/linse.js` (Schwarzschild), Kosmos' "Ærligt talt" |
| 8 | Lys udefra falder stadig ind bag horisonten (det er ikke "mørkt derinde") | OK | [fakta-faelder.md](erfaringer/fakta-faelder.md) (billeder, der lærer noget forkert), Fable E8 |
| 9 | Højst ca. 67 sekunder til midten i Mælkevejens sorte hul (for den, der falder ind, hul der ikke drejer) | OK | Står allerede i kortets nørd-tekst: τ = πGM/c³ (Lewis og Kwan, arXiv:0705.1029) for 4,30 mio. sole (GRAVITY) = 66,5 s |
| 10 | LISA er tre satellitter i en trekant med 2,5 millioner km imellem | OK | Wikipedia "Laser Interferometer Space Antenna" (læst 20. november 2026): "three spacecraft arranged in an equilateral triangle with each side 2.5 million kilometres long" |
| 11 | LISA sendes efter planen op i 2035 | OK | Samme side: "launch planned for approximately 2035 aboard an Ariane 6" (vedtaget 25. januar 2024, byggeriet begyndt 2025) |
| 12 | LISA skal lytte efter kæmpestore sorte huller, der smelter sammen | OK | Samme side: "low-frequency gravitational waves from sources such as merging supermassive black holes" |
| 13 | LISA følger efter Jorden på dens vej om Solen (tegnet ca. 20° bag), og skal kunne måle ændringer, der er mindre end et atom | OK | Samme side: "trailing the Earth by 20 degrees" (fra eLISA-beskrivelsen) og "a resolution of 20 picometres — less than the diameter of a helium atom" (om "a LISA-like instrument") |

## Rettet undervejs
- "Armene bliver i virkeligheden kun en brøkdel af et atom længere og kortere" er fjernet: Det er LISA's følsomhed (ca. 20 picometer), ikke hvor meget de kraftigste bølger flytter armene. Kæmpestore sorte huller, der smelter sammen, kan give mere. Nu: "LISA skal kunne måle ændringer, der er mindre end et atom."

## Ny fælde (står også i fakta-faelder.md)
- "Sådan lød tyngdebølgen" og "tyngdebølger er lyd": De er ikke lyd, og den rigtige tone (35-250 Hz på ca. 0,2 s) er for dyb til en tablet. Sig, at målingen er lavet om til en tone, og hvor meget den er flyttet op og strakt ud.
