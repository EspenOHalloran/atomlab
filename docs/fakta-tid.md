# Faktagrundlag: Tid og rum ("Rejsen i tid")

*Trin 0, 7. november 2026 (Opus, høj effort). Planen står i [plan-tid.md](plan-tid.md). Alle tal er regnet efter med [fakta-tid/regn.py](fakta-tid/regn.py) (kør `python3 docs/fakta-tid/regn.py`). Kilderne står ved hvert afsnit, og hvordan de er læst, står under "Kilderne". Konstanter: c = 299.792.458 m/s (eksakt), 1 g = 9,80665 m/s², 1 lysår = c × 365,25 døgn.*

## 1. Den ene mærkelige regel
- Lysets fart i tomt rum er den samme for alle, uanset hvor hurtigt de selv bevæger sig. Einstein byggede den særlige relativitetsteori på det i 1905. Det er testet igen og igen (fra Michelson og Morley 1887 til moderne forsøg med lasere og atomure). Kilde: Wikipedia "Special relativity" og "Tests of special relativity".
- Alt det andet (tidsforlængelse, længdeforkortelse og E = mc²) følger af den regel, og af at fysikkens love er de samme for alle, der bevæger sig jævnt.

## 2. Gammafaktoren (tidsforlængelsen)
**Formel:** γ = 1/√(1 − v²/c²). Et ur, der farer forbi med farten v, går γ gange langsommere set fra os. Med ε = 1 − v/c er γ = 1/√(ε(2 − ε)) ≈ 1/√(2ε), når ε er lille. Derfor gør hvert ekstra 9-tal γ ca. √10 ≈ 3,16 gange større.

| Fart (af lysets) | γ | 1 dag i skibet = på Jorden |
|---|---|---|
| 50 % | 1,155 | 1,15 dage |
| 90 % | 2,294 | 2,3 dage |
| 99 % | 7,089 | 7,1 dage |
| 99,9 % | 22,37 | 22 dage |
| 99,99 % | 70,71 | 71 dage |
| 99,999 % | 223,6 | 224 dage |
| 99,9999 % | 707,1 | 707 dage (knap 2 år) |
| 99,99999 % (7 ni-taller) | 2.236 | 6,1 år |
| 8 ni-taller | 7.071 | 19 år |
| 9 ni-taller | 22.361 | 61 år |
| 10 ni-taller | 70.711 | 194 år |
| 11 ni-taller | 223.607 | 612 år |
| 12 ni-taller | 707.107 | 1.936 år |

- **"Et par dage mod tusinder af år"**, fx 2 dage mod 2.000 år: γ = 365.250, og det kræver 1 − v/c ≈ 3,75 · 10⁻¹², altså ca. 99,9999999996 % af lysets fart (elleve 9-taller og så en 6'er). Planens tal passer.
- **Ingen mærker noget:** Den rejsendes eget ur går 1 sekund pr. sekund. Det er en sammenligning mellem to ure, der har taget hver sin vej gennem rumtiden (fælden "tiden går langsommere for dig").

## 3. Lysuret (hvorfor det sker)
- To spejle med afstanden L, og et lysglimt hopper op og ned. Ét tik (op og ned) tager 2L/c. Ved L = 1,5 m er det ca. 10 nanosekunder.
- Set fra Jorden flytter spejlene sig, mens lyset er undervejs, så lyset går skråt. Halvdelen af et tik: lyset går c·t/2 på skrå, mens spejlet flytter sig v·t/2 til siden, og højden er L. Pythagoras: (c·t/2)² = L² + (v·t/2)², så t = (2L/c)/√(1 − v²/c²) = γ · (2L/c).
- Lyset kan ikke gå hurtigere for at nå det, fordi lysets fart er den samme for alle (afsnit 1). Derfor tager hvert tik længere tid set fra Jorden.
- Alt om bord følger med (hjertet, tankerne og atomurene). Ellers kunne den rejsende se forskel på at stå stille og at bevæge sig jævnt, og det kan man ikke.
- **Ærligt:** Lysuret er et tankeeksperiment, som står i de fleste lærebøger (Wikipedia "Time dilation"). Man kan ikke se lysglimtet undervejs. Animationen viser, hvad man ville regne sig frem til. Fælden: Tidsforlængelsen gælder ikke kun lysure, men alle ure (også atomure, hjerter og myoner, afsnit 10).

## 4. Afstandene til målene
| Mål | Afstand | Kilde |
|---|---|---|
| Alpha Centauri A og B | **ca. 4,3 lysår** (4,344 lysår). Proxima Centauri, den lille tredje stjerne, er ca. 4,25 lysår væk og er den nærmeste stjerne. | Wikipedia "Alpha Centauri": parallakse 750,81 mas (Akeson m.fl. 2021, ApJ). 1/0,75081 = 1,3319 pc = 4,344 lysår. Wikipedia "Proxima Centauri": 4,2465 lysår (Gaia DR3). |
| Mælkevejens centrum (Sgr A*) | **ca. 27.000 lysår** | GRAVITY 2021 (A&A 647, A59, arXiv:2101.12098): 8.275 pc = 26.989 lysår. Wikipedia "Sagittarius A*" bruger GRAVITY 2023 (A&A 677, L10): 8.277 pc = 26.996 lysår. |
| Andromedagalaksen | **ca. 2,5 mio. lysår** | Wikipedia "Andromeda Galaxy": 765 kpc (Riess m.fl. 2012, ApJ 745, 156), "around 2.5 million light-years". Den nærmer sig Mælkevejen med ca. 110 km/s. Det flytter den kun ca. 900 lysår på 2,5 mio. år, så det kan vi se bort fra. |

- **Fælde:** "4,37 lysår" er et ældre tal for Alpha Centauri A og B. Brug "ca. 4,3 lysår" (eller 4,34).

## 5. Rejsen med fast fart (ud og hjem, ingen tid til at speede op eller bremse)
**Formel:** Jordens tid = 2d/v. Skibets tid = Jordens tid/γ. Afstanden set fra skibet = d/γ.

| Mål | Fart | På Jorden | I skibet | Afstand set fra skibet |
|---|---|---|---|---|
| Alpha Centauri | 90 % | 9,7 år | 4,2 år | 1,9 lysår |
| | 99 % | 8,8 år | 1,2 år (452 dage) | 0,61 lysår |
| | 99,9 % | 8,7 år | 142 dage | 0,19 lysår |
| | 99,99 % | 8,7 år | 45 dage | 0,061 lysår |
| | 99,999 % | 8,7 år | 14 dage | 0,019 lysår |
| | 99,9999 % | 8,7 år | 4,5 dage | 0,0061 lysår |
| Mælkevejens centrum | 99 % | 54.500 år | 7.700 år | 3.800 lysår |
| | 99,9999 % | 54.000 år | 76 år | 38 lysår |
| | 12 ni-taller | 54.000 år | 28 dage | 0,038 lysår |
| Andromeda | 99,9999 % | 5,0 mio. år | 7.071 år | 3.536 lysår |
| | 12 ni-taller | 5,0 mio. år | 7,1 år | 3,5 lysår |

- Én vej til Alpha Centauri ved 99,99 %: ca. 22 dage i skibet og ca. 4,3 år på Jorden. Planen skrev 23 dage og 4,4 år (med det gamle tal 4,37 lysår).
- Over ca. 99 % er tiden på Jorden næsten bare afstanden i lysår (gange 2 for ud og hjem). Det er kun tiden i skibet, der falder.

## 6. "1 g hele vejen" (speed op med 1 g til midtvejs, brems med 1 g resten)
**Formler** (a = 1 g, c/a = 0,9687 år, c²/a = 0,9687 lysår; én vej over afstanden d):
- Skibets tid: τ = 2(c/a) · arcosh(1 + a·d/(2c²))
- Jordens tid: t = 2(c/a) · √((1 + a·d/(2c²))² − 1)
- Største γ (midtvejs): 1 + a·d/(2c²)

| Mål | I skibet, én vej | På Jorden, én vej | Ud og hjem (skib / Jorden) | Største γ |
|---|---|---|---|---|
| Alpha Centauri | 3,6 år | 6,0 år | 7,1 år / 12,0 år | 3,2 (ca. 95 % af lysets fart) |
| Mælkevejens centrum | 19,8 år | ca. 27.000 år | 39,7 år / ca. 54.000 år | ca. 13.900 |
| Andromeda | 28,6 år | ca. 2,5 mio. år | 57,2 år / ca. 5,0 mio. år | ca. 1,3 mio. |

- Planens tal ("ca. 20 år" og "ca. 29 år") passer. Formlerne står i Wikipedia "Space travel under constant acceleration", som også giver ca. 3,6 år til den nærmeste stjerne med nedbremsning. Tallene til Mælkevejens centrum og Andromeda er vores egne udregninger med de formler. Jordens tid er ca. afstanden i lysår plus knap 1 år pr. vej (samme kilde: "plus 1 year").
- **Brændstoffet (ærligt talt):** Selv en perfekt raket, der skyder lys ud bagud (en fotonraket), skal ved start veje e^(2·arcosh(1 + a·d/(2c²))) gange så meget som ved målet: ca. 40 gange til Alpha Centauri (én vej), ca. 780 millioner gange til Mælkevejens centrum og ca. 7 billioner gange til Andromeda. Ud og hjem skal tallet ganges med sig selv (ca. 1.600 gange til Alpha Centauri). Vi kender ingen måde at bygge sådan en raket.
- **"Et par dage" kræver en knusende acceleration:** Skal turen tage 2 dage i skibet og 2.000 år på Jorden (ud og hjem, fire faser med samme acceleration), skal man speede op med ca. 11.500 g. Med 1 g tager det ca. 13 år i skibet bare at nå den fart. Ved 1 g bliver det altså år i skibet, ikke dage. Skyderen med fast fart springer det over, og det skal siges ærligt.

## 7. Længdeforkortelsen (set fra skibet)
- En afstand langs bevægelsen er γ gange kortere set fra skibet: d' = d/γ. Ved 99,99 % er Alpha Centauri ca. 0,061 lysår væk (ca. 3.900 gange afstanden til Solen), og skibet er ca. 22 dage om at nå derhen set fra skibet. Det giver samme tid i skibet som tidsforlængelsen set fra Jorden. Begge forklaringer er rigtige, og derfor taler man om rumtiden.
- **Ærligt:** Man ville ikke *se* stjernerne trykket sammen. Lysets forsinkelse og aberrationen gør, at det, man ser, er noget andet (det hører til cockpitudsigten i T4).

## 8. Energien og støvkornet
**Formel:** Bevægelsesenergien er E = (γ − 1)·m·c².
- **Ét ton ved γ = 365.250** (2 dage mod 2.000 år): ca. 3,3 · 10²⁵ J. Hele verdens energiforbrug var ca. 592 EJ (5,92 · 10²⁰ J) i 2024 (Energy Institute, Statistical Review 2025, læst via Wikipedia "World energy supply and consumption", summen af tabellen). Altså **ca. 55.000 års energiforbrug for hele verden** (skriv "over 50.000 år"). Planens 620 EJ var et ældre tal. Det svarer også til alt det lys, Solen sender ud på ca. 0,09 sekund (Solens udstråling 3,828 · 10²⁶ W, IAU 2015).
- Ét ton ved 99,99 %: ca. 6,3 · 10²¹ J. Ved 99 %: ca. 5,5 · 10²⁰ J.
- **Et støvkorn på 1 mikrogram** (ca. 0,09 mm bredt, hvis det vejer 3 g/cm³ som sten) rammer ved γ = 365.250 med ca. 3,3 · 10¹³ J, ca. 7,8 kiloton TNT. Ved 99,99 % er det ca. 1,5 ton TNT, og ved 99 % ca. 130 kg TNT. (1 kiloton TNT = 4,184 · 10¹² J.)
- **Gassen i rummet:** Omkring Solen er der ca. 0,3 atomer pr. cm³ (Wikipedia "Local Interstellar Cloud"). Hvert brintatom rammer skibet ved γ = 365.250 med ca. 3,4 · 10¹⁴ eV. Det er ca. 50 gange mere end protonerne i CERN's LHC, verdens største partikelaccelerator (6,8 TeV pr. proton, Wikipedia "Large Hadron Collider"), og det kommer som en tæt byge: ca. 0,3 · 3 · 10¹⁰ = 9 milliarder pr. cm² pr. sekund på Jordens ur, og γ gange flere (ca. 3 · 10¹⁵) pr. sekund på skibets ur. Skibet ville blive bombarderet med dræbende stråling.
- **Fælde:** Et typisk støvkorn i rummet er meget mindre, ca. 0,1 µm (arXiv:1110.4180). Kornet på 1 µg er et stort korn, valgt for at tallet er let at forstå. Sig "et lille gruskorn" eller "et sandkorn", ikke "et typisk støvkorn".
- **Fælden "man bliver tungere":** Sig "det kræver mere og mere energi og uendelig meget at nå lysets fart", ikke "massen vokser".

## 9. Tvillingeparadokset
- Set fra skibet er det Jorden, der farer af sted. Hvorfor er det så ikke tvillingen derhjemme, der er yngst? Fordi de to ikke er ligestillede: Den rejsende vender om (og mærker det, når motoren speeder op og bremser), og den hjemmeblevne gør ikke.
- Den præcise forklaring: Hver tvilling har sin vej gennem rumtiden, og hvert ur måler længden af sin egen vej (egentiden). I rumtiden giver den lige vej (at blive hjemme) **den længste tid**, og en omvej giver mindre. Det skyldes minusset i rumtidens "Pythagoras": τ² = t² − (x/c)². Det er det modsatte af et landkort.
- Når den rejsende vender om, skifter den rejsende syn på, hvad der sker "nu" derhjemme (samtidighed er ikke det samme for alle). Det er dér, de mange år derhjemme "forsvinder" set fra skibet.
- **Fælden "det er accelerationen":** Accelerationen er ikke årsagen. Man kan lave forsøg, hvor begge ure accelererer lige meget, og de alligevel kommer forskelligt hjem. Det er vejens længde, der tæller. Kilde: Wikipedia "Twin paradox".

## 10. Det er målt (ikke science fiction)
- **Myonerne** (en tung fætter til elektronen) dannes, når den kosmiske stråling rammer luften, typisk ca. 15 km oppe (arXiv:1906.03934: "most atmospheric muons are produced at a height of around 15 km"). Myonens middellevetid er 2,197 µs (Wikipedia "Muon", fra PDG), og massen er 105,66 MeV/c² (NIST CODATA, physics.nist.gov).
  - **Frisch og Smith** (Am. J. Phys. 31, 342-355, 1963) talte ca. 563 myoner i timen på toppen af Mount Washington (1.917 m) og ca. 412 i timen ved havet. Uden tidsforlængelse skulle der kun være kommet ca. 27. Myonernes ure gik ca. 8,8 gange langsommere (Wikipedia "Experimental testing of time dilation"). Rossi og Hall gjorde det første, mere grove forsøg i 1940 (Phys. Rev. 59, 223, 1941). **⚠️ T3 (8. november 2026):** Tallene 563, 412 og 27 kunne ikke bekræftes (de står ikke i Wikipedia "Experimental testing of time dilation", og en websøgning fandt dem ikke). Wikipedia giver i dag faktoren 8,4 ± 2 (ikke 8,8) og året 1962 for målingerne (artiklen kom i 1963). Teksten i fænomenet nævner derfor ingen tal fra forsøget.
  - **CERN 1977** (Bailey m.fl., Nature 268, 301-305): Myoner, der kørte rundt i en ring med γ = 29,33, levede 64,4 µs i stedet for 2,2 µs. Det passede med Einstein inden for ca. 1 promille (Wikipedia "Time dilation"). *Det tydeligste forsøg: 29 gange længere liv.*
- **Ives og Stilwell** (J. Opt. Soc. Am. 28, 215, 1938) målte tidsforlængelsen første gang direkte i laboratoriet, i lyset fra hurtige brintioner (Wikipedia "Ives–Stilwell experiment").
- **Hafele og Keating** (oktober 1971, Science 177, 166, 1972) fløj fire cæsiumure jorden rundt i passagerfly, først mod øst og så mod vest, og sammenlignede dem med urene på jorden. Mod øst var forudsigelsen −40 ± 23 ns, og målingen −59 ± 10 ns. Mod vest var forudsigelsen +275 ± 21 ns, og målingen +273 ± 7 ns (Wikipedia "Hafele–Keating experiment"). Både farten og højden (tyngden) talte med. *Fælde:* Urene i flyet mod øst tabte tid, og dem mod vest vandt tid, fordi Jorden selv drejer mod øst. Det er sammenlignet med et ur, der står stille i forhold til Jordens centrum.
- **GPS:** står allerede i Rumtid (tallene er regnet efter nedenfor og passer).
- **Astronauterne:** Rekorden for mest tid i rummet har Oleg Kononenko med 1.111 døgn (han slog Gennady Padalkas 878 døgn 4. februar 2024, Wikipedia "Oleg Kononenko"). ISS kredser ca. 410-420 km oppe med ca. 7,7 km/s (Wikipedia "International Space Station"). Udregnet nedenfor: Kononenko er ca. 27 tusindedele sekund (ca. 3 hundrededele) yngre, end han ellers ville have været. *Overslaget gælder ISS. Kononenko var også på ISS hele tiden.* (Planens "Padalka, ca. 879 døgn" er forældet.)
- **Ure i forskellig højde:** NIST målte i 2010, at et aluminiumur går hurtigere, når det løftes 33 cm (Chou m.fl., "Optical Clocks and Relativity", Science 329, 1630-1633, læst via Wikipedia "Hafele–Keating experiment"). JILA målte i 2022 forskellen mellem toppen og bunden af en sky af strontiumatomer, der kun var ca. 1 mm høj (Bothwell m.fl., Nature 602, 420-424, arXiv:2109.12238).

Udregnet:
- Myonens levetid er ca. 2,2 µs, så uden tidsforlængelse ville en myon med næsten lysets fart i gennemsnit nå ca. 660 m (c·τ = 658,6 m). Fra 15 km højde ville kun ca. 1 ud af 8 milliarder nå ned. En myon med 4 GeV (en typisk energi ved jorden) har γ ≈ 38 og når i gennemsnit ca. 25 km.
- ISS (regnet med 420 km og banefarten 7,66 km/s): Farten gør uret ca. 3,3 · 10⁻¹⁰ langsommere, og højden gør det ca. 0,4 · 10⁻¹⁰ hurtigere. Samlet går uret ca. 2,8 · 10⁻¹⁰ langsommere: ca. 25 mikrosekunder pr. døgn. 878 døgn giver ca. 22 ms og 1.111 døgn ca. 27 ms.
- GPS: højden giver ca. +45,7 µs/døgn, farten ca. −7,2 µs/døgn, samlet ca. +38,5 µs/døgn. Ganget med lysets fart giver det ca. 11,5 km. Tallene i `rumtid.js` ("ca. 45", "ca. 7", "ca. 38" og "omkring 10 km") passer.
- Ure i forskellig højde: Et ur, der løftes h, går g·h/c² hurtigere. Ved 33 cm er det 3,6 · 10⁻¹⁷ (ca. 1 nanosekund pr. år), og ved 1 mm ca. 1 · 10⁻¹⁹. På toppen af Mount Everest er det ca. 1 · 10⁻¹² (ca. 30 µs pr. år).

## 11. Lysets forsinkelse (den billige idé)
| Til | Afstand | Lyset er |
|---|---|---|
| Månen | 384.400 km (middel) | 1,28 s |
| Solen | 1 AU = 149.597.870,7 km | 499 s = **8 min 19 s** (ikke 8 min 20 s, se fælderne) |
| Mars | 54,6-401 mio. km (NSSDC). Tættest i praksis: 55,76 mio. km i 2003 | ca. 3-22 min |
| Voyager 1 | én lysdag = 173 AU (ca. 26 mia. km) | 1 døgn. NASA: Voyager 1 når en lysdag fra Jorden **18. november 2026** (science.nasa.gov, "Voyager 1: What is a light-day?"). Skriv "i november 2026", og før den dato "snart". |
| Alpha Centauri | 4,3 lysår | 4,3 år |
| Andromeda | 2,5 mio. lysår | 2,5 mio. år |

## 12. Cæsiumuret (den anden billige idé)
- Et sekund er defineret som 9.192.631.770 svingninger i den stråling, der hører til en bestemt overgang i et cæsium-133-atom (mellem de to "hyperfine" niveauer i grundtilstanden). Sådan har det været siden 1967. Én svingning er altså ca. 0,11 nanosekunder. Kilde: Wikipedia "Second" ("Since 1967 …"). BIPM er lukket i miljøet, så SI-brochuren er ikke læst direkte.
- **Fælde:** De mest præcise ure i dag (fx i JILA-forsøget 2022) er strontium- og aluminiumure, ikke cæsium. Cæsium definerer sekundet, men er ikke længere det mest præcise ur.

## 13. Sammenligninger med fortiden (til hjemkomsten)
*Til teksten ved hjemkomsten ("På Jorden er der gået lige så lang tid som siden …"). "År siden" er regnet fra 2026 (der er intet år 0). Brug "ca.", for de fleste er skøn. Alle er fra engelsk Wikipedia (natmus.dk og da.wikipedia.org er lukket i miljøet).*

| Hvad | Hvornår | Ca. år siden (2026) | Kilde og forbehold |
|---|---|---|---|
| Angrebet på Lindisfarne, som ofte regnes som vikingetidens start | 793 | 1.230 | "Lindisfarne": "often taken as the beginning of the Viking Age" |
| Jellingstenen (den store, rejst af Harald Blåtand) | 960'erne | ca. 1.060 | "Jelling stones" giver kun "10th century". Skriv "for over 1.000 år siden" |
| Tollundmanden døde | 405-384 f.Kr. | ca. 2.400 | "Tollund Man" (ikke 405-380) |
| Egtvedpigen blev begravet | sommeren 1370 f.Kr. | ca. 3.400 | "Egtved Girl": årringe i egekisten |
| Solvognen blev lavet | ca. 1400 f.Kr. | ca. 3.400 | "Trundholm sun chariot": "about 1400 BC" (1500-1300 f.Kr.) |
| Den store pyramide i Giza | ca. 2600 f.Kr. | ca. 4.600 | "Great Pyramid of Giza": "c. 2600 BC" (ikke 2560) |
| Den sidste istid slutter (Holocæn begynder) | | ca. 11.700 | "Holocene" |
| Hulemalerierne i Lascaux | | ca. 17.000-22.000 | "Lascaux" |
| De sidste neandertalere i det meste af Europa | | ca. 40.000 | "Neanderthal": usikker, måske senere i Spanien |
| De ældste kendte fossiler af mennesket (Homo sapiens), Jebel Irhoud i Marokko | | ca. 300.000 (315.000) | "Jebel Irhoud" |
| Lucy (Australopithecus afarensis) | | ca. 3,2 mio. | "Lucy (hominid)" |

- **Hvad passer til hvad:** Alpha Centauri ud og hjem giver ca. 9-12 år på Jorden (et menneskeliv: "din tvilling går nu i gymnasiet"). Mælkevejens centrum ud og hjem giver ca. 54.000 år (før de sidste neandertalere). Andromeda ud og hjem giver ca. 5 mio. år (før Lucy).
- **Fælde:** "Lige så lang tid som siden Solvognen" passer kun med ca. 3.400 år. Planens eksempel ("6 dage mod 3.400 år") kræver γ ≈ 207.000 (ca. 11 ni-taller) og et mål ca. 1.700 lysår væk. Det findes ikke blandt de tre mål, så hjemkomstens tekst må vælge den sammenligning, der passer bedst til tallet (en tabel som ovenfor), i stedet for et fast eksempel.
- **Interstellar** (filmen): På Millers planet svarer 1 time til 7 år på Jorden (en faktor ca. 60.000). Det kræver et sort hul, der drejer næsten så hurtigt, som det overhovedet kan (a/M ≈ 1 − 10⁻¹⁴), og en planet meget tæt på horisonten (arXiv:1910.00940, og James m.fl. 2015, Class. Quantum Grav. 32, 065001, arXiv:1502.03808, hvor billederne i filmen bruger a/M = 0,6). Nævnes kun med det forbehold.

## Faktatjek af T3 (8. november 2026)
*Teksterne i `js/kosmos/tid.js` (siden), `lysfart` i `js/data/hvorfor.js` og ordene tidsforlængelse, længdeforkortelse og myon. Ca. 35 påstande: Dem, der står ovenfor med kilde (tallene i afsnit 2-10 og 12), er tjekket mod denne fil og regn.py af Opus. De 17 påstande, der var nye eller skrevet med nye ord, fandt en Sonnet-hjælpeagent kilderne til (Wikipedias wikitekst, physics.nist.gov og arXiv), og Opus vurderede dem.*

| Påstand | Resultat | Kilde |
|---|---|---|
| Myonen er minusladet som elektronen og ca. 200 gange tungere | OK (206,77) | NIST CODATA (mμ/me), Wikipedia "Muon" |
| Kononenko: 1.111 døgn, mere end nogen anden | OK (ingen over ham i kilderne, artiklen går til september 2026) | Wikipedia "List of spaceflight records" |
| Sekundet siden 1967: 9.192.631.770 svingninger i cæsium-133 | OK | Wikipedia "Second" |
| Strontium- og aluminiumure er mere præcise end cæsiumure | OK | Wikipedia "Atomic clock" |
| Forsøg, hvor begge ure accelererer lige meget og alligevel kommer forskelligt hjem | OK ("the issue is how long the world-lines are, not how bent") | Wikipedia "Twin paradox", "Role of acceleration" |
| Lyset har ikke sit eget ur | OK ("for lightlike paths, there exists no concept of proper time") | Wikipedia "Proper time" |
| Fjerne galakser fjerner sig hurtigere end lyset, fordi rummet udvider sig | OK | Wikipedia "Expansion of the universe" |
| Interstellar: 1 time = 7 år, kræver et sort hul, der drejer næsten maksimalt | OK | arXiv:1910.00940 (og afsnit 13 ovenfor) |
| "Man bliver tungere" er gammeldags | Ret: "som de fleste fysikere undgår i dag" (kilden siger "often avoided", ikke "alle") | Wikipedia "Mass in special relativity" |
| Lysets fart er den samme for alle | OK | Wikipedia "Speed of light" |
| Uendelig energi for at nå lysets fart | OK (følger af E = (γ − 1)mc², afsnit 8) | Afsnit 8 |
| Gassen omkring Solen er mest brint | OK (91 % af atomerne) | Wikipedia "Interstellar medium" |
| Ure tæt på noget tungt går langsommere | OK | Wikipedia "Gravitational time dilation" |
| Frisch og Smith: 563 og 412 i timen mod ca. 27 | **Fjernet** (ikke bekræftet, se afsnit 10). Nu: "de fleste nåede ned" | APS og Mount Washington Observatory (kun forsøget, ikke tallene) |
| Hafele og Keating: −59 ns mod øst og +273 ns mod vest | OK | Wikipedia "Hafele–Keating experiment" |
| Chou m.fl. 2010: et ur løftet 33 cm går hurtigere | OK | Wikipedia "Hafele–Keating experiment" |
| CERN 1977: γ = 29,3, 64,4 µs, ca. 29 gange længere | OK | Wikipedia "Time dilation" |

## Kilderne
**Sådan er kilderne læst:** Op til ca. 15 påstande tjekkes af hovedsessionen. Her var der ca. 35, så en Sonnet-hjælpeagent fandt kilderne og ordlyden (7. november 2026), og Opus vurderede dem og læste selv de vigtigste efter (Alpha Centauris parallakse, energitabellen, tvillingeparadokset om accelerationen og LHC's energi). De fleste er læst i Wikipedias wikitekst (`action=raw`), som har henvisningerne til de oprindelige artikler. Primærkilderne er læst direkte på arxiv.org (GRAVITY 2021, Bothwell 2022, James 2015 og "Life on Miller's planet"), physics.nist.gov (myonens masse), science.nasa.gov (Voyager 1) og nssdc.gsfc.nasa.gov (Mars og Månen). Lukkede domæner: www.nist.gov, pdg.lbl.gov, energyinst.org, natmus.dk, da.wikipedia.org, www.bipm.org, hyperphysics og math.ucr.edu. Ingen af dem var nødvendige, for tallene findes i de åbne kilder.

**Rettelser til plan-tid.md** (afsnittet "Forklaringen" og idéerne):
1. Alpha Centauri er ca. 4,3 lysår væk (ikke 4,4). Ved 99,99 % tager turen ca. 22 dage (ikke 23).
2. Verdens energiforbrug er ca. 592 EJ (2024), så ét ton ved γ = 365.250 svarer til ca. 55.000 år (ikke 50.000 med 620 EJ). Skriv "over 50.000 år".
3. Astronautrekorden er Kononenko med 1.111 døgn (ikke Padalka med 879).
4. Solen: 8 min 19 s (ikke 8 min 20 s).
5. Voyager 1: 18. november 2026 (bekræftet).
6. Solvognen: ca. 1400 f.Kr. (bekræftet), men eksemplet "6 dage mod 3.400 år" passer ikke til nogen af de tre mål (se afsnit 13).
7. Resten af planens tal passer: gammatabellen, "elleve 9-taller" og 3,75 · 10⁻¹², 1 g (20 og 29 år), støvkornet (ca. 8 kiloton og 1,5 ton TNT), myonerne (ca. 660 m) og GPS.

**Nye fælder** (flyttes til `docs/erfaringer/fakta-faelder.md`, når teksterne skrives i T3, sammen med fælderne i planen):
- "Alpha Centauri er 4,37 lysår væk" er et ældre tal. Det er ca. 4,34 for A og B (parallakse 750,81 mas, Akeson 2021).
- "Et par dage i skibet mod tusinder af år på Jorden" kan kun lade sig gøre, hvis man springer over, hvordan man kommer op i fart. Med 1 g bliver det årtier i skibet. "Et par dage" kræver ca. 11.500 g.
- "De mest præcise ure er cæsiumure." Cæsium definerer sekundet, men strontium- og aluminiumure er mere præcise i dag.
- "Ved γ = 365.250 rammer gassen som de kraftigste partikler i den kosmiske stråling." Forkert (det stod i Opus' første udkast): De kraftigste er ca. en million gange stærkere (ca. 10²⁰ eV). Sammenlign med LHC i stedet (ca. 50 gange LHC).
- "Hafele og Keating: Urene i flyene gik langsommere." Kun mod øst. Mod vest gik de hurtigere.
