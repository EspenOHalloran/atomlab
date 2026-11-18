*Del af [faktagrundlaget for Solsystemet](../fakta-solsystemet.md). Faktatjekket af teksterne til Merkur og Pluto (MP2-MP4). Faktagrundlaget står i [del 8](del8-merkur-og-pluto.md), og afsnittene har de samme numre som før (11 og 12 stod i del 8 til 18. november 2026).*

# Del 8b: Faktatjek af Merkur og Pluto

## 11. Faktatjek MP2 (Merkurs tekster, 17. november 2026, Opus)
Teksterne i `js/data/sider/merkur.js` og Ordbogens "Soldøgn" og "Sublimation". Tjekket mod afsnit 1-7 ovenfor og (markeret) nye kilder.

| Påstand | Resultat | Kilde |
|---|---|---|
| Over 400 °C i solen, ca. −180 °C om natten | OK | NSSDC, NASA (afsnit 1) |
| Aksen hælder 0,034°, Solen altid ved horisonten ved polerne | OK | NSSDC (afsnit 1, fælde 5) |
| 59, 176 og 88 jorddøgn, tre omgange på to år, opdaget med radar 1965 | OK | NSSDC, Wikipedia (afsnit 2) |
| "Solens tidevandskraft holder den fast i den takt" | OK som forenkling | Wikipedia ("Mercury": 3:2 holdes af tidevandet i den aflange bane) |
| Solen bakker ca. 8 døgn og 1,1°, skiven 1,73° (3,25 gange Jordens) | OK, regnet igen i programmet (8,13 døgn, 1,115°) | `js/data/merkur-sol.js`, `tests/merkur.mjs` |
| Merkur løber ca. 6,4° om Solen pr. døgn ved perihel, drejer 6,1° | OK (6,35 og 6,14) | Regnet: n · (1 + e)² / (1 − e²)^1,5 |
| Grænsen mellem dag og nat flytter sig ca. 47 km baglæns | OK (1,115° af 15.329 km) | Regnet |
| Radar 1991, MESSENGER målte brint 2012, fotograferede kraterbunde | OK | Afsnit 3, NASA PIA19411 (læst 17. november 2026: "imaging within the permanently shaded interiors of some of the craters, such as Prokofiev and Fuller") |
| Isen under et mørkt lag, i Prokofiev måske fri | OK, skrevet "nok" og "måske" | Afsnit 3 (RS), Paige m.fl. 2012 (søgeresultat: lyse pletter er is på overfladen, ellers op til en meter nede) |
| "Under −170 °C" | **Fjernet** (Opus' note). Paige m.fl. 2012 er fundet, men tallet kunne ikke læses. Teksten siger "så kold, at isen ikke fordamper" | Søgning 17. november 2026 |
| Kernen over fire femtedele af vejen ud, Merkur skrumpet nogle km, klinter op til ca. 1.000 km og 3 km | OK | Afsnit 3 (NASA, Wikipedia) |
| Caloris ca. 1.500 km, fundet 1974 af Mariner 10, "varme", Solen ca. 54° over midten, når den står over 180° | OK | Navnelisten, fælde 21 (regnet) |
| "Weird terrain" på den modsatte side, en hypotese | OK | Afsnit 3 (Wikipedia) |
| Raditladi ca. 260 km, hullerne 18 m-1,6 km brede og 18-37 m dybe, opdaget 2011, måske sublimation, stoffet ukendt | OK | Afsnit 3 (navnelisten, NASA "Hollows on Mercury") og PIA15366 (læst: "may have been formed by the loss of volatile materials", 47 m pr. pixel, 2. januar 2012, 73 km) |
| Prokofiev ca. 112 km, Solen højst ca. 4° oppe | OK (90° − 85,77° = 4,2°) | Navnelisten, regnet, testen (4,2° i 3D-billedet) |
| Isen kom måske med kometer og asteroider | OK, skrevet som "måske" og "ved man ikke sikkert" | RS (almindelig forklaring, Wikipedia "Mercury") |
| Magnetfelt ca. 1 %, midten lidt nord for midten, exosfære med natrium, magnesium, ilt og brint | OK | Afsnit 1 |
| Højeste 4,5 km over middel, laveste 5,4 km under i Rachmaninoff (305 km) | OK | Afsnit 3 (NASA 2016) |
| Mariner 10 1974-1975 under halvdelen, MESSENGER i bane 18. marts 2011, styrtede 30. april 2015 | OK | Afsnit 5 |
| BepiColombo "skal efter planen" i bane 21. november 2026 og dele sig 9.-10. december | OK som plan, **tjekkes igen efter 21. november** | ESA's side "Latest updates" (søgeresultat 17. november 2026) |
| Merkur kaster ca. en tiendedel af lyset tilbage | OK (Bond 0,068, geometrisk 0,142) | Afsnit 1 |
| Hokusai: ungt krater med lyse stråler | OK som RS, uden tal | Afsnit 3 |

## 12. Faktatjek MP3 (Plutos og Charons tekster, 17. november 2026, Opus)
Teksterne i `js/data/sider/pluto.js` og tallene i `js/kosmos/pluto.js` og `js/data/pluto.js`. Kilderne er afsnit 1-4 ovenfor, JPL Horizons og én websøgning.

| Påstand | Vurdering | Kilde |
|---|---|---|
| Pluto er mindre end vores måne, ca. 2.380 km bred | OK (2.376 km mod 3.475 km) | NSSDC, afsnit 1 |
| Ca. −230 °C | OK (fælde 15) | NSSDC, NASA |
| Vandis er hård som sten og danner bjerge, kvælstof ligger som en gletsjer, der bevæger sig | OK | NASA, afsnit 4 |
| Charon er halvt så bred og ca. otte Pluto-bredder væk | OK (1.212 km, 19.596 / 2.376 = 8,2) | NSSDC |
| Bundet begge veje, en omgang på 6,4 jorddøgn | OK (6,387 døgn) | NSSDC |
| Tyngdepunktet ca. 940 km over overfladen, 2.126 km fra midten, Charon ca. 12 % af Plutos masse | OK, regnet (1,586 / 13,03 = 12,2 %) | NSSDC |
| Charon ca. 3,8° bred på Plutos himmel, ca. syv gange så bred som vores måne | OK, regnet (Månen ca. 0,52°) | Afsnit 2 |
| Luften mest kvælstof, ca. 100.000 gange tyndere end Jordens | OK (ca. 10 mikrobar, 99 % N₂) | NSSDC |
| Dis i mange tynde lag, blå ring set bagfra efter forbiflyvningen | OK | Photojournal PIA19948, Wikipedia (afsnit 4) |
| Aksen hælder ca. 120°, drejer baglæns | OK | NSSDC, IAU |
| Punktet under Solen passer med Horizons inden for ca. 0,1° | OK (målt 0,04° på fire datoer, `tests/pluto.mjs`) | JPL Horizons (PLU060), 17. november 2026 |
| Længde 0° vender mod Charon | OK (Horizons: punktet under Charon ved ca. 1,5° Ø) | USGS' navneliste, Horizons |
| Charons røde nordpol: gas fra Pluto fryser fast **i polarnatten**, og **ultraviolet lys** laver den om til et rødbrunt stof | **Rettet** (stod "i sollyset") | Grundy m.fl. 2016 (Nature), kun læst i omtaler (Washington University, Scientific American). Senere arbejde (SwRI) mener, at årstidernes luft og solvinden også spiller ind, så teksten siger "nok" |
| Området ved nordpolen fik i 2026 navnet Neverland Regio | OK (skrevet uden "Mordor") | USGS' navneliste, 2. februar 2026 |
| Charon er lidt mørkere end Pluto (kun i en kommentar) | Skøn, ikke i teksten | NSSDC (Pluto 0,52) |

## 13. Faktatjek MP4 (Plutos steder, flybyen og spørgsmålene, 18. november 2026, Opus)
Teksterne i `js/data/sider/pluto.js` (fire spørgsmål, siderne hjertet, bjerge, wright, burney, belton og tartarus, flybyens 5 stop og slutteksten) og Ordbogens "Isvulkan". Kilderne er afsnit 1-7 i del 8 (Fables opslag, *S*) og Wikipedias wikitekst, hentet 17.-18. november 2026 ("Sputnik Planitia", "Tenzing Montes", "Wright Mons", "Belton Regio", "Burney (crater)", "Geology of Pluto"). Opus har selv læst kilderne (ca. 25 påstande, de fleste stod allerede i del 8 som *S*).

| Påstand | Vurdering | Kilde |
|---|---|---|
| Sollyset er ca. fem timer om at nå Pluto (stop 1) | OK (4,9 timer i 2026, regnet) | Horizons, `tests/pluto.mjs` |
| Hjertets venstre halvdel er en slette af frossent kvælstof, ca. 1.000 km bred | OK (fælde 18 og 19, med lidt kulilte og metan) | NASA, Wikipedia |
| Ingen kratere, overfladen under ca. 10 millioner år | OK ("less than 10 million years old", Trilling 2016) | Wikipedia "Sputnik Planitia" |
| Cellerne ca. 33 km, isen stiger op i midten og synker ved kanten, højst nogle cm om året | OK (højst ca. 7 cm om året i modellerne, andre måler ca. 10) | Wikipedia "Sputnik Planitia" |
| **Man tror**, at varme inde fra Pluto driver cellerne | OK med "man tror" (den første forklaring, andre foreslår sublimation ved overfladen) | Wikipedia "Sputnik Planitia" |
| Sletten ligger næsten modsat Charon, den tunge is kan have drejet Pluto | OK med "måske" og "kan" | Del 8, afsnit 4 |
| Vandis er hård som klippe ved ca. −230 °C, kvælstof-is for blød til at bære et bjerg | OK | NASA, Wikipedia ("much less rigid than water ice") |
| Små bakker af vandis flyder som isbjerge, for vandis er lettere end kvælstof-is | OK (kvælstof- og kulilte-is er "denser" end vandis, bakkerne "may represent floating chunks") | Wikipedia "Sputnik Planitia", NASA "Pluto's Mysterious, Floating Hills" |
| Tenzing Montes op til ca. 6 km, de højeste bjerge på Pluto, ved hjertets sydvestlige kant | OK (6,2 km, fælde 12: "op til ca. 6 km") | Wikipedia "Tenzing Montes" (Schenk m.fl. 2018) |
| Opkaldt efter Tenzing Norgay, der med Edmund Hillary som de første stod på Everest i 1953. Hillary Montes lidt mod nordvest | OK (Hillary Montes 3,26° N, 169,58° Ø) | Navnelisten, almen viden |
| Wright Mons lige sydvest for bjergene, ca. 150 km bred, 4-5 km høj, hul i midten, få kratere, nok en isvulkan, intet udbrud set | OK (4,7 ± 1 km, ca. 150 km, navnelisten 165 km). Del 8 skrev "ca. 4 km" | Wikipedia "Wright Mons" (Singer m.fl. 2022) |
| Brødrene Wright byggede og fløj det første motorfly | OK | Almen viden |
| Tombaugh Regio efter Clyde Tombaugh, der fandt Pluto i 1930. Lidt af hans aske er med på New Horizons | OK (ca. 30 g) | NASA, del 8 afsnit 5 |
| Den højre halvdel er højland, gletsjere af kvælstof-is flyder derfra ned på sletten | OK ("valley-type glaciers flowing down into the basin from adjacent eastern highlands") | Wikipedia "Sputnik Planitia" |
| Burney: et gammelt nedslagsbassin med flere ringe, stærkt slidt, opkaldt efter Venetia Burney (11 år, 1930), navnet efter underverdenens gud | OK ("the only identified multi-ringed impact basin on Pluto", "heavily eroded") | Wikipedia "Burney (crater)", NASA |
| Belton Regio ca. 3.000 km langs ækvator, mørk, nok tholiner af metan og kvælstof med ultraviolet lys | OK (Wikipedia 1.860 mi = ca. 2.990 km, navnelisten 3.255 km, "speculated") | Wikipedia "Belton Regio" |
| Tartarus Dorsa: kamme af is, flere hundrede meter høje ("knivene") | OK (ca. 500 m, penitentes af metan-is) | Wikipedia "Geology of Pluto" (Moores m.fl. 2017) |
| Kun én sonde, over ni år undervejs, forbi 14. juli 2015 med ca. 50.000 km/t, 12.500 km over overfladen, data hjemme efter over 15 måneder | OK (19. januar 2006, 49.600 km/t, 25. oktober 2016) | NASA, del 8 afsnit 5 |
| Fra den ene side af Pluto hænger Charon stille på himlen, fra den anden (med hjertet) ses den aldrig | OK (Opus' rettelse i E16) | Del 8, afsnit 4 og 6 |
| Isvulkan (Ordbogen): vand, blød is eller andre kolde stoffer kommer op nedefra | OK | Wikipedia "Cryovolcano" (almen definition) |
| Ved stederne står Solen mod nordvest som på New Horizons' fotos (i 2015 over 127,8° Ø, 51,6° N) | OK, regnet (programmet bruger 145° Ø, Solen står længere mod nord i dag). Skyggerne i kortet ved Tenzing Montes falder mod sydøst | Horizons, kortet |
