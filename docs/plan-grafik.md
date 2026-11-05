# Plan: mere grafik og flere detaljer i hele AtomLab

*Skrevet 3. november 2026 efter jeres spørgsmål: "Hvilke muligheder har vi for at skrue op for grafikken og detaljerne i hele løsningen, dvs. planeter, atomer og alle effekter?" Der er ikke sagt go til at bygge noget. Det her er en plan og en liste over muligheder, ikke et løfte.*

## 1. Jeres svar og hvad de betyder
- **"Tablet og pc er lige vigtige" (3. november 2026).** Derfor kan vi ikke skrue op på pc og lade tabletten være. Alt nyt skal have et trin, der virker på tabletten, og et trin, der udnytter pc'en. Idéer, der kun virker på pc (dyr kantudglatning, tung ambient occlusion), skal have en billig udgave til tabletten, ellers skal de vente.
- **Åbent:** Hvilken skærm føles mest flad lige nu (bortset fra stenene i Stå på Mars, som står i `plan-mars.md` under "M8c del 3")? Svaret afgør, hvad der kommer først i del 3.
- **Ærlig begrænsning:** Ingen af mulighederne herunder er målt i denne session. Skyen har intet grafikkort, og farver og hastighed ser anderledes ud på jeres skærme. Derfor måler vi på jeres tablet og pc, før vi vælger (se del 1 nedenfor).

## 2. Udgangspunktet (fra CLAUDE.md)
- Three.js 0.186.1 (WebGL), ingen kantudglatning på lærredet, glød (bloom) som efterbehandling, og gløden kører i halv opløsning på touch.
- `LAV_KVALITET` i `scene3d.js` er i dag en kontakt med to tilstande (touch eller ikke). `TEST_HURTIG` er kun til tests.
- Billeder i sekundet er målt kun i testbrowseren uden grafikkort, så tallene siger noget om forskel før og efter, ikke om den rigtige tablet.
- Det er en regel, at vi ikke tilføjer frameworks, npm-pakker eller byggetrin uden at spørge først.

## 3. Mulighederne
### A. Fælles for alle skærme
| Idé | Effekt | Pris og risiko |
|---|---|---|
| **Kvalitetstrin** (Lav / Middel / Høj) i stedet for kun `LAV_KVALITET`, valgt automatisk efter en måling af billeder i sekundet, og med et valg i hjælpen | Hver enhed får det bedste, den kan klare. Forudsætningen for resten. | Lav. Rører `scene3d.js`, så alle tests vælges med `--ændret`. |
| **Måling på de rigtige enheder** (en `?fps` i adressen, der viser billeder i sekundet og tid pr. billede) | Vi vælger efter tal, ikke gætterier. | Lav. |
| **Kantudglatning** (SMAA eller FXAA som efterbehandling, evt. MSAA på pc) | Pænere kanter på kerner, ringe og planeter. | FXAA er billig nok til tabletten. MSAA er dyr, kun pc. |
| **Bedre glød og tonemapping** (blødere haler, lysere kerne, evt. let linsestøv) | Mere filmisk. | Lav til middel. Gløden er allerede sat til halv opløsning på touch. |
| **Ambient occlusion på skærmen** (GTAO/SSAO i halv opløsning) | Dybde og tyngde i kerne, krystaller og planeter. | Middel til høj. Tabletten kræver halv opløsning eller en billigere variant. |
| **Højere pixeltæthed** | Skarpere billede. | Direkte tab af billeder i sekundet. Kun efter måling. |
| **Komprimerede teksturer (KTX2/Basis)** | Mindre filer og mindre hukommelse, så højere kortopløsning kan køre på tabletten. | Kræver et værktøj (`basisu`), som ikke kunne hentes i miljøet før. Spørg først. |

### B. Atomer og kerner (Værksted, periodisk system, Stjerneovn)
- Nukleoner med rigtigere materiale: blød gennemsigtighed (underjordisk spredning), fint relief og mere kantlys. Kernen har allerede skygge og kantlys (`tilføjKantlys`).
- Elektronsky som volumen (raymarching) i stedet for glødende overflader. Flottere, men tungt. Kun på pc, tabletten beholder overfladerne.
- Flere partikler og haler i fusion, henfald og festfyrværkeri.
- Stjerneovnen: plasma som strømme og buer, bølgefronter ved sammensmeltning.
- Reaktoren og batteriet: mere detaljeret krystalgitter og grafit, blåt Cherenkov-lys i vandet, glødende elektroner i ledningen.

### C. Planeter og Kosmos
- **Jorden:** volumetriske skyer og bedre atmosfære (Rayleigh/Mie-spredning) i stedet for en skal.
- **Mars:** flere lokale net, støvstorme og bevægelige skyer. Ambient occlusion er L2 i `plan-mars.md`.
- **Saturn:** fine partikler i ringene tæt på, skygger af ringene i atmosfæren (findes delvist).
- **Solen:** granulation, solpletter som animation, koronastråler.
- **Kosmos:** tåger som volumen, flere stjerner med rigtige farver, sort hul med mere præcis lysbøjning.
- **Stå på Mars:** se "M8c del 3" i `plan-mars.md` (variation i stenene, et mellemlag, ambient occlusion, evt. 3D-sten).

### D. Teknik, der låser op for meget
- **LOD og instansering** overalt, hvor der er mange ens ting.
- **WebGPU:** Three.js kan det, men det er et stort skifte i alle shadere og virker ikke overalt (iPad og Safari er blandet). Anbefales ikke nu.

### E. Det, jeg ikke anbefaler
- Nye frameworks eller et byggetrin (strider mod CLAUDE.md).
- At skrue op overalt på én gang: Så ved vi ikke, hvad der koster hvad, og tabletten kan trække hele oplevelsen ned.

## 4. Anbefalet rækkefølge
| Del | Hvad | Hvorfor her | Model og effort (forslag) |
|---|---|---|---|
| G1 | **Måling og kvalitetstrin** (A, de to første rækker) | Billig, fælles og nødvendig for alt andet. Giver jer en måde at se billeder i sekundet på tabletten. | Opus, medium |
| G2 | **Kantudglatning og bedre glød** | Synligt overalt for få tokens. Billig udgave på tablet. | Opus, medium |
| G3 | **Ét sted ad gangen**, efter jeres valg: Stå på Mars (M8c del 3), atomet og kernen (B), Jorden og atmosfæren (C) eller Kosmos | Hvor det mangler mest. | Opus, høj |
| G4 | **Ambient occlusion** (skærm og landskab) | Dyr. Først når G1 viser, hvor meget der er plads til. | Opus, høj |
| G5 | **Komprimerede teksturer** | Kun hvis hukommelsen på tabletten er flaskehalsen. Spørg om værktøjet først. | Opus, medium |

**Regel for hele planen:** Hvert trin måles før og efter på pc og tablet (tjekliste F i `docs/erfaringer.md`), og vi tager kun billeder af det, der er ændret. Er et trin for dyrt på tabletten, får tabletten en billigere udgave, ikke en dårligere oplevelse uden at sige det.

## 5. Beslutninger til jer
1. Hvilken skærm føles mest flad lige nu? (Afgør G3.)
2. Vil I have G1 først, som anbefalet?
3. Må jeg bede om værktøjet `basisu` (kun køres én gang, ikke et byggetrin), hvis G5 bliver aktuel?
4. Skal der være et valg i hjælpen til Lav / Middel / Høj, eller skal det vælges automatisk uden en menu?

## 6. Status
Intet er bygget. Venter på jeres svar og go.
