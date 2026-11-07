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
- **Ærligt:** Lysuret er et tankeeksperiment (Einstein brugte det ikke selv i 1905, men det står i de fleste lærebøger). Man kan ikke se lysglimtet undervejs. Animationen viser, hvad man ville regne sig frem til.

## 4. Afstandene til målene
| Mål | Afstand | Kilde |
|---|---|---|
| Alpha Centauri A og B | ca. 4,37 lysår (Proxima ca. 4,25) | *udfyldes* |
| Mælkevejens centrum (Sgr A*) | ca. 27.000 lysår (8,275 kpc = 26.989 lysår) | *udfyldes* |
| Andromedagalaksen | ca. 2,5 mio. lysår | *udfyldes* |

## 5. Rejsen med fast fart (ud og hjem, ingen tid til at speede op eller bremse)
**Formel:** Jordens tid = 2d/v. Skibets tid = Jordens tid/γ. Afstanden set fra skibet = d/γ.

| Mål | Fart | På Jorden | I skibet | Afstand set fra skibet |
|---|---|---|---|---|
| Alpha Centauri | 90 % | 9,7 år | 4,2 år | 1,9 lysår |
| | 99 % | 8,8 år | 1,2 år (455 dage) | 0,62 lysår |
| | 99,9 % | 8,7 år | 143 dage | 0,20 lysår |
| | 99,99 % | 8,7 år | 45 dage | 0,062 lysår |
| | 99,999 % | 8,7 år | 14 dage | 0,020 lysår |
| | 99,9999 % | 8,7 år | 4,5 dage | 0,0062 lysår |
| Mælkevejens centrum | 99 % | 54.500 år | 7.700 år | 3.800 lysår |
| | 99,9999 % | 54.000 år | 76 år | 38 lysår |
| | 12 ni-taller | 54.000 år | 28 dage | 0,038 lysår |
| Andromeda | 99,9999 % | 5,0 mio. år | 7.071 år | 3.536 lysår |
| | 12 ni-taller | 5,0 mio. år | 7,1 år | 3,5 lysår |

- Én vej til Alpha Centauri ved 99,99 %: ca. 23 dage i skibet og ca. 4,4 år på Jorden. Planens tal passer.
- Over ca. 99 % er tiden på Jorden næsten bare afstanden i lysår (gange 2 for ud og hjem). Det er kun tiden i skibet, der falder.

## 6. "1 g hele vejen" (speed op med 1 g til midtvejs, brems med 1 g resten)
**Formler** (a = 1 g, c/a = 0,9687 år, c²/a = 0,9687 lysår; én vej over afstanden d):
- Skibets tid: τ = 2(c/a) · arcosh(1 + a·d/(2c²))
- Jordens tid: t = 2(c/a) · √((1 + a·d/(2c²))² − 1)
- Største γ (midtvejs): 1 + a·d/(2c²)

| Mål | I skibet, én vej | På Jorden, én vej | Ud og hjem (skib / Jorden) | Største γ |
|---|---|---|---|---|
| Alpha Centauri | 3,6 år | 6,0 år | 7,2 år / 12,0 år | 3,3 (ca. 95 % af lysets fart) |
| Mælkevejens centrum | 19,8 år | ca. 27.000 år | 39,7 år / ca. 54.000 år | ca. 13.900 |
| Andromeda | 28,6 år | ca. 2,5 mio. år | 57,2 år / ca. 5,0 mio. år | ca. 1,3 mio. |

- Planens tal ("ca. 20 år" og "ca. 29 år") passer.
- **Brændstoffet (ærligt talt):** Selv en perfekt raket, der skyder lys ud bagud (en fotonraket), skal ved start veje e^(2·arcosh(1 + a·d/(2c²))) gange så meget som ved målet: ca. 40 gange til Alpha Centauri (én vej), ca. 780 millioner gange til Mælkevejens centrum og ca. 7 billioner gange til Andromeda. Ud og hjem skal tallet ganges med sig selv (ca. 1.600 gange til Alpha Centauri). Vi kender ingen måde at bygge sådan en raket.
- **"Et par dage" kræver en knusende acceleration:** Skal turen tage 2 dage i skibet og 2.000 år på Jorden (ud og hjem, fire faser med samme acceleration), skal man speede op med ca. 11.500 g. Med 1 g tager det ca. 13 år i skibet bare at nå den fart. Ved 1 g bliver det altså år i skibet, ikke dage. Skyderen med fast fart springer det over, og det skal siges ærligt.

## 7. Længdeforkortelsen (set fra skibet)
- En afstand langs bevægelsen er γ gange kortere set fra skibet: d' = d/γ. Ved 99,99 % er Alpha Centauri ca. 0,062 lysår væk (ca. 3.900 gange afstanden til Solen), og lyset er ca. 23 dage om at nå så langt set fra skibet. Det giver samme tid i skibet som tidsforlængelsen set fra Jorden. Begge forklaringer er rigtige, og derfor taler man om rumtiden.
- **Ærligt:** Man ville ikke *se* stjernerne trykket sammen. Lysets forsinkelse og aberrationen gør, at det, man ser, er noget andet (det hører til cockpitudsigten i T4).

## 8. Energien og støvkornet
**Formel:** Bevægelsesenergien er E = (γ − 1)·m·c².
- **Ét ton ved γ = 365.250** (2 dage mod 2.000 år): ca. 3,3 · 10²⁵ J. *Sammenligningen med verdens energiforbrug udfyldes, når tallet er tjekket.* Det svarer også til alt det lys, Solen sender ud på ca. 0,09 sekund (Solens udstråling 3,828 · 10²⁶ W, IAU 2015).
- Ét ton ved 99,99 %: ca. 6,3 · 10²¹ J. Ved 99 %: ca. 5,5 · 10²⁰ J.
- **Et støvkorn på 1 mikrogram** (ca. 0,09 mm bredt, hvis det vejer 3 g/cm³ som sten) rammer ved γ = 365.250 med ca. 3,3 · 10¹³ J, ca. 7,8 kiloton TNT. Ved 99,99 % er det ca. 1,5 ton TNT, og ved 99 % ca. 130 kg TNT. (1 kiloton TNT = 4,184 · 10¹² J.)
- **Gassen i rummet:** Hvert brintatom i rummet rammer skibet ved γ = 365.250 med ca. 3,4 · 10¹⁴ eV, lige så meget som de kraftigste partikler i den kosmiske stråling. *Gassens tæthed udfyldes.*
- **Fælden "man bliver tungere":** Sig "det kræver mere og mere energi og uendelig meget at nå lysets fart", ikke "massen vokser".

## 9. Tvillingeparadokset
- Set fra skibet er det Jorden, der farer af sted. Hvorfor er det så ikke tvillingen derhjemme, der er yngst? Fordi de to ikke er ligestillede: Den rejsende vender om (og mærker det, når motoren speeder op og bremser), og den hjemmeblevne gør ikke.
- Den præcise forklaring: Hver tvilling har sin vej gennem rumtiden, og hvert ur måler længden af sin egen vej (egentiden). I rumtiden giver den lige vej (at blive hjemme) **den længste tid**, og en omvej giver mindre. Det skyldes minusset i rumtidens "Pythagoras": τ² = t² − (x/c)². Det er det modsatte af et landkort.
- Når den rejsende vender om, skifter den rejsende syn på, hvad der sker "nu" derhjemme (samtidighed er ikke det samme for alle). Det er dér, de mange år derhjemme "forsvinder" set fra skibet.
- **Fælden "det er accelerationen":** Accelerationen er ikke årsagen. Man kan lave forsøg, hvor begge ure accelererer lige meget, og de alligevel kommer forskelligt hjem. Det er vejens længde, der tæller. Kilde: Wikipedia "Twin paradox".

## 10. Det er målt (ikke science fiction)
*Udfyldes med kilderne (myonerne, Bailey 1977, Hafele og Keating 1971, GPS, astronauterne, urene i forskellig højde og cæsiumuret).*

Udregnet:
- Myonens levetid er ca. 2,2 µs, så uden tidsforlængelse ville en myon med næsten lysets fart i gennemsnit nå ca. 660 m (c·τ = 658,6 m). Fra 15 km højde ville kun ca. 1 ud af 8 milliarder nå ned. En myon med 4 GeV (en typisk energi ved jorden) har γ ≈ 38 og når i gennemsnit ca. 25 km.
- ISS (ca. 420 km, 7,66 km/s): Farten gør uret ca. 3,3 · 10⁻¹⁰ langsommere, og højden gør det ca. 0,4 · 10⁻¹⁰ hurtigere. Samlet går uret ca. 2,8 · 10⁻¹⁰ langsommere: ca. 25 mikrosekunder pr. døgn. 878 døgn giver ca. 22 ms og 1.111 døgn ca. 27 ms.
- GPS: højden giver ca. +45,7 µs/døgn, farten ca. −7,2 µs/døgn, samlet ca. +38,5 µs/døgn. Ganget med lysets fart giver det ca. 11,5 km. Tallene i `rumtid.js` ("ca. 45", "ca. 7", "ca. 38" og "omkring 10 km") passer.
- Ure i forskellig højde: Et ur, der løftes h, går g·h/c² hurtigere. Ved 33 cm er det 3,6 · 10⁻¹⁷ (ca. 1 nanosekund pr. år), og ved 1 mm ca. 1 · 10⁻¹⁹. På toppen af Mount Everest er det ca. 1 · 10⁻¹² (ca. 30 µs pr. år).

## 11. Lysets forsinkelse (den billige idé)
| Til | Afstand | Lyset er |
|---|---|---|
| Månen | 384.400 km (middel) | 1,28 s |
| Solen | 1 AU = 149.597.870,7 km | 499 s = **8 min 19 s** (ikke 8 min 20 s, se fælderne) |
| Mars | 54,6-401 mio. km | ca. 3-22 min |
| Voyager 1 | én lysdag = 173 AU | 1 døgn |
| Alpha Centauri | 4,37 lysår | 4,4 år |
| Andromeda | 2,5 mio. lysår | 2,5 mio. år |

## 12. Cæsiumuret (den anden billige idé)
- Et sekund er defineret som 9.192.631.770 svingninger i den stråling, et cæsium-133-atom sender ud ved en bestemt overgang. Én svingning er altså ca. 0,11 nanosekunder. *Kilden udfyldes.*

## 13. Sammenligninger med fortiden (til hjemkomsten)
*Udfyldes med kilderne.*

## Kilderne
*Udfyldes.*
