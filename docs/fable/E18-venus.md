# E18: Fable tjekker Venus V3-V5

*16. november 2026, Fable 5.2 (høj effort), efter [prompt-fable-venus.md](../prompt-fable-venus.md). Tjekket: [plan-venus.md](../plan-venus.md), [del 7](../fakta-solsystemet/del7-venus.md) og `js/data/sider/venus.js`. Kode, plan og faktafil er ikke ændret. **K** = læst i kilden i dag, **R** = regnet her, **H** = fra min hukommelse (slås op, før det skrives i programmet).*

## 1. Det vigtigste først
- **Ja, V3 kan bygges.** Fysikken bag gløden holder, og NSSDC's tal og stedernes pladser passer med kilderne.
- **Ret tre ting først:** Kontakten skal ikke hedde "Infrarødt (som Parker)", for Parker så gløden i rødt lys (afsnit 2). Pandekagekuplerne ligger ca. 1.100 km fra Alpha Regios midte og kræver et lokalt net (afsnit 3). Og "1 bar og stuetemperatur" findes ikke i samme højde (afsnit 5).
- **Venus lukkes ikke efter V3,** men efter V3 og ét V5 med nedturen som sidste stop. "Stå ved Venera 13" og V6 udgår: to sessioner i stedet for tre-fire (afsnit 4).

## 2. Gløden på natsiden (V3)
**Det holder:**
- Jorden er 737 K. Efter Plancks lov stråler den mest ved ca. 3,9 µm (**R**), men dér er luften helt tæt. Kun i smalle "vinduer" fra ca. 0,8 til 1,2 µm slipper lidt ud, og dér ser man kun den korte ende af strålingen. Den ende ændrer sig meget med temperaturen, så effekten er stor.
- Luften bliver ca. 7,7 °C koldere pr. km opad (VIRA: 462 °C ved 0 km, 385 °C ved 10 km, **K**). Lysstyrken ved 1,0 µm i forhold til middelhøjden (**R**, T = 737 − 7,7 · h):

| Højde over 6.051,8 km | −2 km | 0 | 2 km | 4 km | 8 km (Maat) | 11 km (Maxwell) |
|---|---|---|---|---|---|---|
| Temperatur | 479 °C | 464 °C | 449 °C | 433 °C | 402 °C | 379 °C |
| Lysstyrke | 1,5 | 1 | 0,66 | 0,43 | 0,17 | 0,08 |

- Intet skal overdrives: Maxwell er over ti gange mørkere end sletterne. NASA skriver, at højlandene på Parkers billeder er ca. 47 °C køligere (**K**). Det svarer til ca. 6 km i højden (**R**), som fra sletterne op til Aphrodite.
- **Parker Solar Probe (WISPR):** forbiflyvningerne i juli 2020 og februar 2021. Kameraet ser 0,48-0,80 µm, altså synligt lys og en smule nær-infrarødt. NASA's egen overskrift er "first images of Venus' surface in visible light" (**K**). Man så Aphrodite Terra, Tellus Regio og Aino Planitia og en lys kant af ilt, der lyser højt oppe (**K**, Wood m.fl. 2022 og arXiv:2311.03190).
- **Venus Express (VIRTIS)** så jordens glød ved 1,02 µm over den sydlige halvkugle (Mueller m.fl. 2008, **H**). Steder, der lyste mere, end højden kan forklare, blev tolket som ung lava, bl.a. ved Idunn Mons (Smrekar m.fl. 2010, ESA's omtale **K**). Et godt "Hvordan ved vi det?" til vulkanerne.
- **Fælde:** De kendte infrarøde billeder af natsiden (Akatsuki og VIRTIS ved 1,74 og 2,3 µm) viser *skyerne* 44-48 km oppe som silhuetter, ikke jorden (**K**, arXiv:2003.00228). Brug dem ikke som forlæg.

**Det skal ændres i planen:**
1. **Navnet:** "Gløden på natsiden". Teksten: Parker så den i det dybeste røde lys, på grænsen til infrarødt. Venus Express og Akatsuki så den i infrarødt.
2. **Jorden gløder lige meget dag og nat.** På dagsiden drukner gløden i sollyset fra skyerne (**K**, NASA). Ingen tekst må sige, at kun natsiden er varm.
3. **Skyerne slører.** De spreder lyset, så alt under ca. 50-100 km er udvisket (**K**, Lustig-Yaeger). Slør højdekortet ca. 1° (106 km), før gløden regnes, når skyerne er på. Sløringen er altså målt, ikke "tegnet". Uden skyer er gløden skarp.
4. **Regn med den rigtige højde.** Temperaturen må ikke følge "Bjergene 10 gange højere". Og kortets nul er 6.051,0 km, mens 737 K gælder ved 6.051,8 km: T = 737 − 7,7 · (h − 0,8).
5. **Sig ikke, at øjet kunne se gløden.** Ting gløder først synligt rødt ved ca. 525 °C (**H**). NASA's "visibly glowing" handler om kameraet.

**"Ærligt talt" skal sige:** Farven er valgt, for næsten al gløden er infrarød. Lyset er skruet mange tusind gange op (ved 1 µm er natsiden ca. 3.000 gange svagere end dagsiden, **R**). Jorden gløder også på dagsiden. På rigtige billeder giver tykke og tynde skyer også pletter, og kanten lyser af ilt. Det er ikke med.

## 3. Stederne under skyerne
Bredde og længde fra USGS' navneliste (planetarynames.wr.usgs.gov, **K**, østlig længde 0-360°):

| Sted | Bredde | Længde | Størrelse | Bemærkning |
|---|---|---|---|---|
| Maxwell Montes | 65,2° N | 3,3° Ø | 797 km | Rigtigt valg. Krateret Cleopatra (65,8° N, 7,1° Ø, 105 km) på siden kan ses i 8k |
| Maat Mons | 0,5° N | 194,6° Ø | 395 km | Rigtigt valg. Åbningen fra 1991 er på vulkanens side, ikke i toppen |
| Aphrodite Terra | 5,8° S | 104,8° Ø | 10.000 km | Et kontinent, ikke et sted. Se nedenfor |
| Pandekagekuplerne (Seoritsu Farra) | 30,0° S | 11,0° Ø | 230 km | **Ikke Alpha Regios midte** (25,5° S, 0,3° Ø), som ligger ca. 1.100 km væk (**R**) |
| Venera 13 | 7,5° S | 303° Ø | | NSSDC (**K**). Kendt inden for ca. 150 km (**H**) |

- **Fire steder, ikke fem** (Retningen). **Aphrodite Terra udgår som sted** og bliver flybyens stop om gløden: den store mørke plet. Kameraet peger på Ovda Regio (2,8° S, 85,6° Ø).
- **Pandekagekuplerne er det rigtige fjerde sted** for en 13-årig: et sjovt navn og et spørgsmål at gætte på (hvorfor er lavaen ikke løbet ud?). Men hver kuppel er ca. 25 km bred og 750 m høj (**H**, NASA PIA00215), altså 5 pixel i 8k-kortet (**R**). De kræver et lille lokalt net af 225 m-kortet (ca. 300 × 300 km) og skal ses lige ovenfra, for højderne kan ikke vise dem. Skriv "tyk, sej lava", ikke en bjergart. Den kender man ikke.
- **Lokale net:** Maat Mons og pandekagekuplerne. Maxwell klarer sig med 8k-kortet.
- **Venera 13:** Ingen har fundet landeren på Magellans billeder. Skriv "her omkring".

**Teksterne (flybyens udkast i planens afsnit 4):**
- Stop 1: "Men det, vi ser, er ikke jorden" lige efter "Jorden" kan forveksles. Skriv "overfladen".
- Stop 3: Magellan kortlagde 98 % med radar **fra 1990 til 1992** (**K**, NASA). Sonden blev ved til 1994.
- Stop 4: Det var "en åbning i vulkanens side", der blev dobbelt så stor på otte måneder i 1991 (fra under 2,2 km², **K**). "Nok stadig udbrud" er passende forsigtigt.
- Stop 5 og 6 holder. Skriv "jorddøgn" i stop 2.

## 4. V4 og V5
**Min mening: Luk Venus efter V3 og ét samlet V5.**
- **V5 kan ikke undværes.** Uden flyby og stedernes sider er Venus en klode med kontakter, og kernesætningen bliver aldrig sagt.
- **Nedturen beholdes, men lille, og bygges i V5** som flybyens sidste stop og en knap ved Venera 13: kameraets rejse, en måler og et lys, der bliver orange. Måleren er det eneste sted, hvor man *mærker* luften: 0,04 bar og −43 °C ved 70 km, 1 bar og 75 °C ved 50 km, 92 bar og 462 °C nede (**K**). Det er kernesætningen som noget, man gør.
- **"Stå ved Venera 13" udgår.** Fotoet er 1.000 × 252 punkter og dækker en stribe på 170°. Kameraet kiggede skråt ned og svingede fra side til side, så horisonten står i billedets hjørner (**H**). Lagt rundt om kameraet bliver det en uskarp, bøjet stribe i tomhed. Vis det fladt som nedturens sidste billede og på stedets side.
- **V6 (polhvirvlen)** flyttes til idéerne.
- **Skyerne er dis, ikke tæt tåge:** Man kan se flere km (**H**, Knollenberg og Hunten 1980). Ved jorden målte Venera 9 ca. 14.000 lux, som en overskyet dag (**K**, Wikipedia efter Science News 1976).

## 5. Fakta, der skal rettes
1. **"Ca. 1 bar og stuetemperatur ved 50-55 km"** (planen, V-E) og **"50-65 km: ca. 1 bar og 0-50 °C"** (del 7, afsnit 3): VIRA siger 50 km: 75 °C og 1,07 bar. 55 km: 27 °C og 0,53 bar. 60 km: −10 °C og 0,24 bar. 65 km: −30 °C og 0,10 bar (**K**). Skriv: "Ca. 55 km oppe er der stuetemperatur og halvt så højt tryk som ved havet."
2. **Navnene:** Ovda Regio er *ikke* en undtagelse. USGS: "Marijian; Titaness" (**K**). Undtagelserne er Maxwell Montes, Alpha Regio og Beta Regio.
3. **Fosfin er ikke afgjort.** Holdet bag står ved fundet og finder ca. 1 ppb i de data, hvor andre finder under 0,8 ppb (Cordiner m.fl. 2022, Greaves m.fl. 2023, **K** Wikipedia). Skriv "striden er ikke slut". Fosfin findes også på Jupiter og Saturn uden liv (**H**).
4. **"De jordlignende lag":** Dråberne er stærk svovlsyre og ca. hundrede gange for tørre til alt liv, vi kender (**K**, Wikipedia efter Hallsworth m.fl. 2021). Det skal med.
5. **"Regnen, der aldrig når jorden":** Kilden er BBC gennem Wikipedia, og ingen sonde har set regn (**H**). Skriv, at dråber, der falder, fordamper.
6. **Venera 14** landede ca. 950 km fra Venera 13, ikke 900 (**K**). "Den første lyd fra en anden planet" er omstridt (måske Venera 11, **K**).
7. **Akatsuki:** Kontakten forsvandt i april 2024, og missionen blev afsluttet 18. september 2025 (**K**).
8. **"Ca. 55 gange hurtigere"** (siden i programmet) mod **"ca. 60 gange"** (planen og fælde 11): Vælg ét tal. 243 / 4 er ca. 60, og de to tal har læseren fået.
9. **De kommende sonder** (DAVINCI december 2030, VERITAS november 2032, EnVision 2032) står sådan på Wikipedia i dag (**K**). Jeg kan ikke selv bekræfte dem. Skriv "i 2030'erne".

Teksterne i `js/data/sider/venus.js` holder ellers.

## 6. Kernesætningen og overblikkets panel
**Efter fem minutter kan brugeren sige:** "Venus er lige så stor som Jorden, men den tykke luft holder så godt på varmen, at jorden er 464 °C dag og nat. Den er så varm, at den gløder i mørket."
- Den samler skyerne og luften (V2), gløden som det synlige bevis på varmen (V3) og måleren på vej ned (V5).
- **Spørgsmålet før svaret:** "Hvilken planet er varmest: Merkur, der er tættest på Solen, eller Venus?" Og i V3: "Hvorfor er de høje bjerge mørke?"
- **Til "Hvorfor er Venus så varm?":** Skyerne kaster så meget lys tilbage, at Venus optager *mindre* solvarme end Jorden (ca. 600 mod 960 W/m², **R** fra NSSDC). Uden drivhuseffekt ville den være ca. −47 °C (NSSDC: 226,6 K, **K**). Hele varmen skyldes luften.
- Fravalgt: "Det, vi ser, er skyer, og under dem ligger vulkaner, som kun radar kan se." Den beskriver en kontakt, ikke noget, man forstår.

**Overblikkets panel:** Venus har intet panel i dag (et tryk flyver til besøget). Får de byggede planeter et, så:
- To tal: "På jorden: 464 °C" og "Lufttryk: 92 gange Jordens".
- Tekst: "Venus er næsten lige så stor som Jorden, men den er den varmeste planet, varmere end Merkur. Den tykke luft af kuldioxid holder på varmen, og skyerne skjuler jorden. Besøg Venus, og se den gløde i mørket."

## Spørgsmål til jer (min anbefaling først)
1. **Omfanget:** V3 og ét V5 med nedturen, uden "Stå ved Venera 13" og V6. Eller planen, som den står.
2. **Kernesætningen:** den i afsnit 6. Eller jeres egen.
3. **Stederne:** de fire i afsnit 3, med Aphrodite som flybyens stop om gløden. Eller alle fem.
