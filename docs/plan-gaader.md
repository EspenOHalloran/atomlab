# Plan: Gåderne i en tynd udgave (fem kort i Biblioteket)

*Trin 0, skrevet 12. november 2026 af Opus efter [prompt-gaader.md](prompt-gaader.md). Faktagrundlaget står i [fakta-gaader.md](fakta-gaader.md). Status står i Småting ([lige-nu/smaating.md](lige-nu/smaating.md)). **Valgene nedenfor er mine anbefalinger:** I bad mig køre videre med dem i stedet for at spørge (12. november 2026). De kan ændres, før G1 bygges. Hver delopgave får sit eget go og en ny session.*

## Kernesætningen (jeres valg 12. november 2026)
"Efter fem minutter kan brugeren sige: **Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.**"

Udvælgelsen: Kan brugeren sige sætningen uden denne ting? Hvis ja, hører den til i "For nørder" eller i faktagrundlaget, ikke på kortet.

## De fem kort (og nr. 6 bagefter)
| Nr. | Id | Spørgsmålet på kortet | "Se det selv" | Nye fagord på kortet |
|---|---|---|---|---|
| 1 | `sorthul` | Hvad er der inde i et sort hul? | Kosmos → Sort hul ("Send en astronaut ind") | singularitet (ny i Ordbogen), horisont (findes) |
| 2 | `liv` | Er der liv andre steder? | Solsystemet → Mars → Neretva Vallis (Cheyava Falls) | biospor (findes) |
| 3 | `begyndelsen` | Hvordan begyndte livet? | Liv → "Fra opskrift til protein" | RNA (findes) |
| 4 | `antistof` | Hvor blev antistoffet af? | Kosmos → Big Bang | antistof (findes) |
| 5 | `moerktstof` | Hvad er mørkt stof? | Kosmos → Rumtid (lysbøjningen), til fænomenet Mørkt stof findes | mørkt stof (ny i Ordbogen) |
| 6 | `moerkenergi` | (bagefter) Hvad får Universet til at udvide sig hurtigere? | Kosmos → Hvid dværg | – |

Sort hul står først, fordi det har det stærkeste sted i programmet (kortet tager over dér, hvor astronauten forsvinder), og fordi det er det første, der bygges (G1). De to kort om liv står ikke ved siden af hinanden, så "hvor" og "hvordan" ikke flyder sammen (fakta-gaader.md, "Ærligt om de fem").

## Hvor Gåderne ligger
- **En ny del `gaader` i verdenen Biblioteket**, efter Ordbogen (`SKÆRME` i `js/skaerme.js`, `status: 'prøve'`). Biblioteket får dermed to dele i ringen. Adressen er `#gaader`, og et kort åbnes med `#gaader` og `data-gaa="gaader:sorthul"`.
- **En side uden 3D**, som Ordbogen: Stjernehimlen står bag, og siden er HTML og CSS. Ingen Three.js, så den er let at hente.
- **Først en oversigt** med de fem kort (spørgsmålet og en linje). Første gang står "Start her" på Sort hul. Et kort, man har gjort færdigt, får et lille ✓ (gemt i `atomlabGaader`, skrives i `docs/kode/gemte-data.md`). Ingen stjerner og ingen point. Biblioteket får ikke "Din fremgang" i menuen.
- **Afvigelse fra Retningen, sagt ærligt:** Retningen siger, at en ny del starter med et forløb under scenen (Forløb-klodsen). Gåderne har ingen scene. Hvert kort *er* derfor et lille forløb på tre trin (ca. to minutter) med de samme felter som skabelonen (Spørg, Gæt, Så), og oversigten er "laboratoriet". Forløb-klodsen bruges ikke. Er I uenige, er alternativet at gøre hvert kort til et rigtigt forløb i den del, kortet peger på (fx i Sort hul), men så er Gåderne ikke længere ét samlet sted.

## Sådan ser et kort ud (bygget af klodser, der findes)
Et kort fylder midten af siden (højst ca. 640 px bredt). Øverst: "‹ Alle gåder", spørgsmålet som overskrift og **datoen** ("Sådan stod det i november 2026"). Så tre trin, ét ad gangen, med prikker som forløbets linje:

| Trin | Spørg (højst ca. 15 ord) | Gæt (det, man gør) | Så (højst to sætninger) |
|---|---|---|---|
| 1. Hvad ved vi? | Et spørgsmål, der undrer | 2-3 svar at trykke på. Alle får et svar bagefter, ingen er "dumme" | Det, der er målt |
| 2. Hvad ved vi ikke? | **"Målt eller gæt?"** og ét udsagn | Knapperne "Målt" og "Gæt" | Det, ingen ved, og hvorfor |
| 3. Hvordan finder vi ud af det? | Hvordan kan man undersøge det? | 2-3 måder at trykke på | Det, forskerne gør nu (med årstal fra kilden, aldrig "snart") |

Bagefter **"Det så du"** med højst tre veje: "Se det selv ›" (ind til stedet), "Næste gåde ›" og, hvor det passer, "Hvorfor?"-kortet "Hvornår er noget opdaget?". Under trinene to lukkede foldebokse: **"For nørder"** (tal, navne på forsøg og kilder) og, hvor det trænger, **"Ærligt talt"**.

**Klodserne:** Teksterne er data i `js/data/gaader.js` med samme form som et forløb (`{ id, spørgsmål, dato, trin: [{ spørg, gæt: { valg: [{ tekst, efter }] }, så }], seDet, nørd, ærligt, ord }`), så de kan testes i Node. Gættets knapper ser ud som forløbets. "For nørder" og "Ærligt talt" er de fælles foldebokse (`lag-boks` i `js/lag.js`), "Hvornår er noget opdaget?" er et "Hvorfor?"-kort (`js/data/hvorfor.js`), og "Se det selv" er en `data-gaa`-knap (`gå()` fra `js/sideknap.js`). **Det eneste nye i koden** er, at `js/gaa.js` skal kende `gaader:id` (som `system:55`), og at siden viser ét trin ad gangen.

**"Målt eller gæt?"** i trin 2 er det, der tjener kernesætningen bedst: Man øver forskellen på det, der er målt, og det, der er en idé. Det er et gæt med to valg, ikke en ny slags klods (sortering af flere udsagn er valgt fra, se nedenfor).

### Eksempel: Sort hul (udkast, ikke faktatjekket)
1. *Spørg:* Findes sorte huller, eller er de bare en idé? *Gæt:* "De er målt" / "Kun en idé". *Så:* De er målt. I 2015 hørte forskerne to sorte huller smelte sammen, og i 2019 så de skyggen af et.
2. *Spørg:* Målt eller gæt? "I midten er alt presset sammen i ét punkt." *Efter "Gæt":* Rigtigt. Einsteins teori siger det, men den giver "uendelig", og det betyder, at teorien holder op med at virke. Det kaldes en singularitet. *Så:* Ingen ved, hvad der er i midten. For astronauten går der højst ca. et minut, før turen ender dér.
3. *Spørg:* Intet slipper ud. Hvordan kan man så undersøge det? *Gæt:* "Send en sonde ind" / "Lyt til tyngdebølger" / "Find en ny teori". *Så:* En sonde kan aldrig sende noget tilbage. Forskerne lytter til, hvordan et nyt sort hul "ringer", og leder efter en teori, der forener tyngdekraft og kvantefysik. Måske får vi aldrig et svar, vi kan måle.

*For nørder:* τ = πGM/c³ (ca. 67 sekunder for Mælkevejens sorte hul og ca. 28 timer for M87*), GW250114 og Hawkings sætning om arealet, Kerr-hullet med en ring, Hawking-strålingen på ca. 0,00000006 K for én solmasse, LISA (efter planen 2035).

## Fagord (højst to nye pr. kort)
- **Nye i Ordbogen:** singularitet, mørkt stof og sigma (sigma står kun i "Hvorfor?"-kortet og i Ordbogen, ikke på kortene).
- **Findes allerede:** biospor, horisont, RNA og antistof. Positron, exoplanet, WIMP, axion, CP-brud og Kerr står kun i "For nørder" og forklares dér i en halv sætning, eller lades ude.

## Det fælles "Hvorfor?"-kort: "Hvornår er noget opdaget?"
- *Spørgsmål:* Hvornår må forskerne sige "opdaget"?
- *Svar (forslag, skal faktatjekkes):* Små tilfældige udsving ligner tit et fund. Derfor regner forskerne ud, hvor sandsynligt det er, at det bare er tilfældigt, og det måles i "sigma". Først ved 5 sigma siger man "opdaget". Det svarer til at slå plat ca. 22 gange i træk med en ærlig mønt (én ud af ca. 3,5 millioner). Ved 3 sigma hedder det kun "tegn på".
- *Næste lag:* Lige nu er der tre signaler under grænsen: LZ's ene hændelse (2,6 sigma), gassen DMS på K2-18b (3 sigma, ikke bekræftet) og mørk energi, der måske ændrer sig (2,8-4,2 sigma). De fleste små signaler forsvinder igen, når der måles mere.
- *For nørder:* LIGO's første måling var over 5,1 sigma (arXiv:1602.03837). Tallene for mønten er mine udregninger (5 sigma ensidet: ca. 2,9 × 10⁻⁷, og 2²² ≈ 4,2 millioner) og skal tjekkes i G3.
- Bruges af kortene om mørkt stof og liv (og senere mørk energi).

## "Se også": fra stederne ind til Gåderne
| Sted | Hvordan | Træk fra |
|---|---|---|
| Kosmos → Sort hul | En knap i teksten, der hvor astronauten forsvinder: "Gåden: Hvad er der inde? ›" | `videre` er fuld (Kvasar, Rumtid, Ormehul), så linket står i teksten, ikke som en fjerde knap |
| Solsystemet → Mars → Neretva Vallis | `videre` får "Gåden: Er der liv andre steder? ›" | `videre` har to knapper i dag. Højst tre |
| Solsystemet → Saturn → Enceladus | Samme kort, en knap i teksten | Ingen ny knap i bjælken |
| Liv → "Fra opskrift til protein" | En af vejene i "Det så du" (højst tre) eller "Næste skridt" | Ved tre veje går den svageste ud (G2 vælger) |
| Kosmos → Big Bang | `videre` eller en knap i teksten | Højst tre i `videre` |
| Kosmos → Rumtid | En knap i teksten om lysbøjning: "Sådan vejer man det, man ikke kan se" | Ingen ny knap i bjælken |
| Ordbogen | `LINKS` for singularitet, horisont, biospor, RNA, antistof, mørkt stof og sigma | Ingen (Ordbogen ruller) |

**Værkstedet får ingen link** i den tynde udgave: Infopanelet må ikke få en rullebjælke, og positronen er allerede forklaret dér. Kortet om antistof peger ind til Værkstedet i "For nørder" (byg kulstof-11 eller fluor-18).

## Valgt fra (og hvor det bor)
- **Sortering af 3-4 udsagn i "målt" og "gæt"** på hvert kort: én "Målt eller gæt?" pr. kort er nok til kernesætningen. Flere udsagn kan komme som udfordring, hvis prøven viser, at det virker.
- **Billeder og 3D på kortene:** ingen i den tynde udgave. Ikoner skal være tegnede (Retningen), og et tegnet motiv pr. kort kan komme senere.
- **Hubble-spændingen, neutrinoens masse, Planet 9 og kvantetyngdekraft** som egne kort: i "For nørder" eller som nr. 6-7 (fakta-gaader.md, tabellen).
- **Forløb-klodsen** under en scene: se "Afvigelse fra Retningen" ovenfor.

## Før teksterne skrives
- **Slå datoerne op** i afsnittet "Tjek igen" i fakta-gaader.md for de kort, delopgaven skriver (stoffet flytter sig), og ret datoen på kortet til den dag, de er tjekket.
- **`/faktatjek`** mod fakta-gaader.md (og fakta-liv/ for de to kort om liv). Påstande mærket **Ret sikker** eller **Usikker** skrives forsigtigt. Fælderne i fakta-gaader.md læses, før teksten skrives.
- **Mørkt stof** peger på lysbøjningen ved Rumtid, til fænomenet Mørkt stof er bygget. Så flyttes "Se det selv".

## Delopgaverne (hver med et go og en ny session)
- [ ] **G1: Siden og det første kort (Sort hul).** Delen `gaader` i `SKÆRME`, sektionen i `index.html`, `js/gaader.js` (oversigten, kortet med tre trin, "Det så du", ✓ i `atomlabGaader`), `js/data/gaader.js`, `gaader:id` i `js/gaa.js`, Ordbogens ord "singularitet" og linket fra Sort hul. Datoerne for kortet tjekkes (LISA, GW250114), og teksten faktatjekkes. 5-8 tjek (se nedenfor). Skærmbilleder på pc, tablet på højkant og telefon. Opus, høj.
- [ ] **G2: De to kort om liv** (liv andre steder og livets begyndelse) med "Se også" fra Mars, Enceladus og Liv. Datoerne (exoplaneter, Rosalind Franklin, Tianwen-3, Europa Clipper, Dragonfly, ELT, QT45) og `/faktatjek` mod fakta-liv/. Opus, høj.
- [ ] **G3: Antistof, mørkt stof og "Hvornår er noget opdaget?"** med "Se også" fra Big Bang og Rumtid, Ordbogens "mørkt stof" og "sigma". Datoerne (LZ og XENONnT, Euclid DR1, Hyper-Kamiokande, DUNE, Nobelpriserne) og `/faktatjek`. Kortet om liv får linket til "Hvorfor?"-kortet. Til sidst "Ikke afprøvet" (hvad I skal kigge efter på tabletten) og prøven med jeres søn. Opus, høj.
- [ ] **Senere:** nr. 6 mørk energi (efter prøven), og "Se det selv" for mørkt stof, når fænomenet Mørkt stof findes.

**Tests (G1, udvidet i G2 og G3):** i Node: hvert kort har tre trin, Spørg er højst ca. 15 ord, hvert gæt har 2-3 valg med `efter`, hvert kort har en dato og et `seDet`, der peger på et fænomen eller en del, der findes, og højst to nye fagord. I browseren: `#gaader` åbner oversigten, `gaader:sorthul` åbner kortet (også som den første skærm), et gæt viser sit svar, "Se det selv" åbner Sort hul, ✓ huskes, ingen fejl i konsollen og ingen vandret rullebjælke på telefon.

## Prompt til G1 (kopiér)
> Du bygger G1 i Gåderne i AtomLab: siden `#gaader` i Biblioteket og det første kort (Sort hul). Spor: Småting. Læs først (kun dette): `docs/lige-nu/smaating.md`, `DESIGN.md`, hele `docs/plan-gaader.md`, afsnit 2 ("Hvad er der inde i et sort hul?"), "Fælles for alle kortene", "Fælder" og "Tjek igen" i `docs/fakta-gaader.md`, `docs/kode/forloeb.md` og linjerne om `gaa.js`, `lag.js` og `hvorfor.js` i `docs/kode/faelles.md`, Ordbogen i `docs/kode/skaerme.md`, tjekliste D og F og `docs/erfaringer/fakta-faelder.md`. Tjek først i `origin/main`, at G1 ikke er bygget. Slå datoerne for kortet op, skriv teksten ud fra eksemplet i planen, og kør `/faktatjek`, før koden bygges færdig. Spørg med valgmuligheder, hvis noget er uklart, og vent på et go. Til sidst `/faerdig`, PR og merge med det samme.
