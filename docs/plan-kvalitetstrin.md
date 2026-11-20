# Plan: automatisk kvalitetstrin på touch (G1 del 2)

*Skrevet 20. november 2026 efter jeres spørgsmål "Er der steder, vi kan skrue op for grafikken på mobil og tablet? Hvad siger målingerne?" og jeres valg "Byg automatisk trin nu" (kun planen, intet bygges før jeres go). Spor Småting. Rækken "Kvalitetstrin" i [plan-grafik.md](plan-grafik.md) (afsnit 3A og G1).*

## 1. Hvad målingerne siger (de rigtige enheder)
| Enhed | Hvor | Billeder/s |
|---|---|---|
| Tab A11+ (Mali-G615, **90 Hz-skærm** ifølge Samsung) | Hele Solsystemet, 13. nov. | 62 i gennemsnit, 99 % under 50 ms |
| Tab A11+ | Stå på Mars efter H, 14. nov. | 60, mens man står, og 11-20, mens Solen flytter sig (strimlerne er lavet bagefter, ikke målt igen) |
| Tab A11+ | Gåden om det sorte hul, 20. nov. | 74 |
| Telefonen A56 (Xclipse 540, 120 Hz) | Solsystemet og Stå på Mars | 108, median 8 ms, 99 % under 20 ms |
| Pc med Iris Xe / RTX 4060 | Mars | 58 / 98 |

Kilder: [maalinger/mars-g1.md](maalinger/mars-g1.md), [orkestrator-status.md](orkestrator-status.md) og Samsungs side for Tab A11+ (90 Hz).

**Det betyder:**
- **Telefonen har tydeligt luft**, men den får den samme grafik som tabletten, fordi `LAV_KVALITET` kun ser på, om man har fingre (`pointer: coarse`).
- **Tabletten ligger under sin skærms loft i Solsystemet** (62 af 90). Dér skrues der ikke op.
- **De lette skærme** (Værkstedet, Det periodiske system, Stjerneovnen, Kosmos og menuen) **er ikke målt på tabletten.** Det er dér, der formentlig er luft.

## 2. Hvad touch mister i dag, og hvad der kan skrues på, mens programmet kører
| Knap | Pc | Touch i dag | Kan skiftes, mens man er på en skærm? |
|---|---|---|---|
| Skarphed (`pixelRatio`) | højst 2 | højst 1,5 | ja |
| Kantudglatning | SMAA | FXAA (lidt blødere) | ja (`skiftKanter` findes fra G2) |
| Gløden | halv opløsning | en fjerdedel | ja (`glød.setSize`) |
| Partikler, kuglernes felter, teksturer, stjerner | fuld | ca. det halve | **nej**: `LAV_KVALITET` er fastlagt ved start og bruges i 47 filer, når tingene bygges |

**Ærligt om gevinsten:**
- **Tab A11** tegner allerede i skærmens egen opløsning (1920 × 1200 ved 1,5). Højere skarphed giver intet dér. Gevinsten er kun SMAA (skarpere kanter, mindre sløret tekst på Mars' navne) og en glød i halv opløsning (blødere, flimrer mindre ved små lyse prikker). Den er synlig, men ikke stor.
- **Telefonen A56** tegner kun ca. 57 % af skærmens opløsning (1,5 mod ca. 2,6). Med skarphed 2 bliver billedet tydeligt skarpere. **Det er den største gevinst.**

## 3. Forslaget: trinnet "Høj på touch", hvis enheden kan klare det
1. **To trin på touch:** *Basis* (som i dag) og *Høj* (skarphed op til 2, SMAA og gløden i halv opløsning, altså de samme tre knapper som på pc). Pc'en er uændret.
2. **Automatisk, som i det sorte hul (`js/kosmos/linse.js`) og værnet for kantudglatningen på pc (`vogtKanter`):** Hver skærm starter i Basis. Er der mindst ca. 58 billeder/s i 3 sekunder i træk, skiftes der til Høj. Falder det under ca. 45 i 2 sekunder, skiftes der tilbage, og så bliver skærmen i Basis resten af besøget (ingen vippen frem og tilbage). Det dækker også, at en tablet bliver varm og langsommere efter nogle minutter.
3. **Kun på de skærme, der vælger det:** først Værkstedet, Det periodiske system, Molekyler, Stjerneovnen, Reaktoren, Batteriet, Ild, Liv, Kvantefysik, Opdagelserne, Ordbogen og menuen. **Solsystemet, Stå på Mars, Kosmos og Gåderne bliver i Basis**, indtil de er målt. Det sorte hul har sin egen dynamiske opløsning.
4. **Måleren `?maal`** skriver trinnet og hvert skift (som "Kantudglatning: SMAA → FXAA" i dag), så I kan se det på tabletten.
5. **Ikke i testene** (`?test`), medmindre en test slår det til. En testadgang `sætTrin('høj' | 'basis')` gør det muligt at tjekke skarpheden, gløden og kantudglatningen.
6. **Gemmes ikke** (ingen localStorage i denne del).

**Hvor:** `js/scene3d.js` (trinnet, målingen og de tre knapper) og én linje pr. skærm, der vælger det (fx i `SKÆRME` i `js/skaerme.js`). Fordi `scene3d.js` røres, vælger `--ændret` alle tests.

**Tests (5-10 tjek):** Basis er som i dag. `sætTrin('høj')` giver skarphed 2 (højst `devicePixelRatio`), SMAA og en glød i halv opløsning. `sætTrin('basis')` giver det tilbage. En skærm, der ikke har valgt det, bliver i Basis. Konsollen er uden fejl. Pc er uændret.

**Risiko:**
- Et lille ryk i det øjeblik, trinnet skifter (lærredet og gløden laves i ny størrelse), og billedet bliver synligt skarpere. Det sker én gang pr. skærm.
- SMAA på Mali er ikke målt. Er den for dyr, falder trinnet bare tilbage.
- Telefonen bliver lidt varmere og bruger lidt mere strøm.

**Størrelse:** mellem, én PR. Opus, effort medium-høj.

## 4. Bagefter (ikke i denne del)
- **Jeres måling** med `?maal` på Tab A11 og A56 på de lette skærme: Går trinnet op, og bliver det der? Er SMAA pænere på tabletten?
- **Kosmos og Solsystemet** kan vælge trinnet, hvis målingen viser luft (A56 ser ud til at have det allerede).
- **Lag 2: huske enhedens resultat** (localStorage), så de ting, der bygges ved start (partikler, kuglernes felter, stjerner), også kan få mere på en enhed, der har klaret Høj før. Det kræver, at `LAV_KVALITET` bliver til et trin i de 47 filer. Det er stort og venter på målingerne.
- Trinnet "Let" til svage enheder ([retning.md](retning.md), køreplanen nr. 9) kan bygges på den samme mekanisme.

## 5. Status
- 20. november 2026: Planen er skrevet og venter på jeres go.
