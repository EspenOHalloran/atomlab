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

**Regel for hele planen:** Hvert trin måles før og efter på pc og tablet (tjekliste F i `docs/tjeklister/f-tests.md`), og vi tager kun billeder af det, der er ændret. Er et trin for dyrt på tabletten, får tabletten en billigere udgave, ikke en dårligere oplevelse uden at sige det.

## 5. Beslutninger til jer
1. Hvilken skærm føles mest flad lige nu? (Afgør G3.)
2. Vil I have G1 først, som anbefalet?
3. Må jeg bede om værktøjet `basisu` (kun køres én gang, ikke et byggetrin), hvis G5 bliver aktuel?
4. Skal der være et valg i hjælpen til Lav / Middel / Høj, eller skal det vælges automatisk uden en menu?

## 6. Status
Trin 1 af G1 (måleren og hakkene på Mars) er lavet 13. november 2026, se nedenfor. Resten venter på jeres måling og go.
- **12. november 2026:** Go til trin 1 af G1: måleren `?maal` og en gennemgang af hakkene på Mars (Mars hakker lidt, også på pc). Prompten står i [prompt-maaler.md](prompt-maaler.md).
- **Jeres svar 13. november 2026:** Det hakker, **når kameraet flyver** til et nyt sted, og **første gang et sted besøges** (ikke hele tiden). Pc'en er en **bærbar uden særskilt grafikkort**. Derfor ledes der først efter kort, der lægges i grafikkortet, og shadere, der laves første gang.
- **Trin 1 lavet 13. november 2026: måleren `?maal` og gennemgangen af Mars.** Måleren står i [kode/faelles.md](kode/faelles.md) (`js/maaler.js`). Gennemgangen er målt med måleren i testbrowseren (en rejse til flybyens 8 steder med `gåTil`). Testbrowseren tegner uden grafikkort (6-9 billeder i sekundet, så alle billeder er "ryk"), og den kan ikke oversætte shadere i baggrunden. **Tallene kan bruges** til at se, hvad der sker på hovedtråden, og til at sammenligne før og efter (store forskelle). **De kan ikke bruges** til billeder i sekundet på jeres pc, til grafikkortets tid eller til store kort med fuld grafik (det samme 2k-kort tog 19 ms ét sted og 2,8 s et andet, fordi det software-grafikkort, testbrowseren tegner med, var optaget).
  - **Fundet 1, shadere første gang (den største årsag):** De lokale net (to udgaver), Mars med huller og månerne fik først deres shader, når kameraet fløj derhen: 200-500 ms hver (Olympus Mons 342 ms, ved Gale 262 ms, Tharsis 202 ms). **Rettet:** `lavShadereFørst` (`js/solsystem/shadere.js`) laver dem alle, når Mars åbnes. Efter: ingen nye shadere under flyvningerne, heller ikke med fuld grafik (så det er de rigtige udgaver). I Chrome på pc og tablet (med `KHR_parallel_shader_compile`) sker det i baggrunden. I testbrowseren sker det i de første ca. 4 sekunder, mens Mars' kort hentes. Landskabet i Stå på Mars (3 shadere, ca. 620 ms ved landingen i testbrowseren) laves kun på forhånd, når browseren kan gøre det i baggrunden.
  - **Fundet 2, kort lagt i grafikkortet under flyvningen:** De lokale kort blev lagt i grafikkortet, første gang nettet blev tegnet, midt i flyvningen (67-98 ms pr. sted med testens kort på 1k, ca. 4 gange mere med de rigtige på 2k). Et `<img>` pakkes nemlig ud igen på hovedtråden, når det lægges i grafikkortet. **Rettet:** De lokale kort og månernes kort pakkes ud uden for hovedtråden (`hent(…, { vendt: true })`, et vendt `ImageBitmap`). Målt alene: 2k-højdekort 79-109 → 14-25 ms, 1k-farvekort 17-21 → 3-4 ms, Phobos 4k 130-140 → 21 ms. Kortene til næste stop lægges i grafikkortet, når kameraet står stille (ét pr. billede), ikke midt i næste flyvning. Efter: 3-26 ms pr. sted under flyvningerne.
  - **Fundet 3, nye objekter i hvert billede:** Ingen af betydning. Mars genbruger sine vektorer (kun en lille liste med to sole pr. billede). `zoomMod` og `svingKamera` i `scene3d.js` laver en vektor pr. billede, mens de kører. Ikke rettet (det er småting, og `scene3d.js` vælger alle tests).
  - **Fundet 4, opløsningen:** `pixelRatio` op til 2 på pc. På en bærbar med skalering 125-150 % er lærredet 1,25-1,5 gange så bredt og højt som vinduet, og gløden regnes i fuld opløsning. Det koster i hvert billede (ikke ryk). Ikke rettet (ændrer udseendet), se forslag C og D.
  - **Fundet 5, trekanter og lag:** Mars' kugle er 1024 × 512 felter (ca. 1,05 mio. trekanter), plus højst to lokale net på 512 × 512 (ca. 0,5 mio. hver) og luften og skyerne oven på. Det koster i hvert billede. Ikke rettet, se forslag E.
  - **Fundet 6, det, der ikke ses:** Ved Mars tegnes kun Mars' egne ting (13 kald i testbrowseren). Ingen fundet.
  - **Tilbage:** Når Mars åbnes første gang, er der stadig hak, mens kortene hentes (8k-farvekortet og 4k-højdekortet lægges i grafikkortet, og shaderne laves). Det sker bag bjælken "Henter Mars …" og toningen.
  - **Forslag til trin 3** (venter på jeres måling og go, pris og gevinst er skøn): **A.** Mars' store kort (8k og 4k-højden) også `vendt` (lille, mindre hak, når Mars åbnes. Kunne ikke måles med fuld grafik her). **B.** Store kort lagt i grafikkortet i strimler over flere billeder (mellem, fjerner hakket ved store kort helt). **C.** Dynamisk opløsning i Solsystemet som ved det sorte hul (lille-mellem, mindre skarpt, når det går langsomt; kun hvis måleren viser, at grafikkortet er flaskehalsen). **D.** Gløden i halv opløsning på pc med et svagt grafikkort (lille, gløden en anelse blødere). **E.** Færre trekanter i Mars' kugle på svage pc'er, fx 768 × 384 som på tablet (lille, kan ses i kanten helt tæt på). **F.** De samme rettelser for Jupiter, Saturn, Venus og Uranus/Neptun, hvis måleren viser hak dér (lille hver).
- **Jeres målinger 13. november 2026 (trin 2, ikke færdigt):** Iris Xe (to kørsler, den første på en presset pc) og RTX 4060. Teksten og et foreløbigt billede står i [maalinger/mars-g1.md](maalinger/mars-g1.md). Kort: Under flyvningerne er der næsten ingen ryk mere. Tilbage er de store kort, når Mars åbnes, og især ved landingen i Stå på Mars (ca. 1,8 s på Iris Xe, 0,9 s på RTX 4060). Grafikkortet har luft (ca. 9-10 ms pr. billede). Fanen døde én gang ved Jezero (Ved randen) i første kørsel, ikke forklaret. Måleren viser forkerte kald og trekanter (kun gløden sidste trin). **Jeres ønske: flere målinger, før vi konkluderer.** Tabletten mangler.
