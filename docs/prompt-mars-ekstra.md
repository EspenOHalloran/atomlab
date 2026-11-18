# Plan og prompter: Mars ekstra (fire dele, et go pr. del)

*Skrevet 18. november 2026 af sessionen "Solsystemet · Mars åbner langsomt anden gang". **Jeres beslutning (18. november 2026, jeres ønske via orkestratoren):** Mars gøres færdig nu, før Månen og ønskerne fra 17. november. Rækkefølgen er jeres: 1) Nordpolen tæt på (M7b-pol), 2) sten og terræn i Stå på Mars (M8c del 3), 3) Curiosity som 3D-model (M8c del 2) og 4) lyset (L2, kræver en session på jeres pc). Hver del får sin egen session og sit eget go. Baggrunden står i [plan-mars.md](plan-mars.md) under "Plan for resten af Mars" (afsnit 1-5) og "M8c del 3". De gamle prompter dér er afløst af dem her.*

**Fælles for alle fire:** Spor Solsystemet. Tjek først i `origin/main`, at delen ikke er lavet (CLAUDE.md, "Parallelle sessioner"). Læs CLAUDE.md, `docs/lige-nu.md`, `docs/lige-nu/solsystemet.md`, DESIGN.md, [retning.md](retning.md) (budgettet: en klode højst ca. 20 MB på tablet, teksturer højst ca. 350 MB på tablet) og [stilguide.md](stilguide.md). Tjekliste **E** (grafik og shader), **C** ved ny logik og **F** (tests). Læs [erfaringer/staa-paa-mars.md](erfaringer/staa-paa-mars.md) og [erfaringer/planeter-og-maaner.md](erfaringer/planeter-og-maaner.md). Store kort hentes med `hent` (`vendt: true`), så kortkøen lægger dem ind i strimler (`js/solsystem/kortkoe.js`). Mål med `?maal` før og efter (fuld grafik i testbrowseren, tablet-udgaven), og skriv en linje i "Ikke afprøvet" om, hvad I skal se efter på Tab A11. Rør kun Solsystemets filer og blokke. Afslut med `/faerdig` (PR og merge), og send orkestratoren "færdig: …".

| Del | Hvad | Størrelse | Model og effort | Før der bygges |
|---|---|---|---|---|
| 1. M7b-pol | Nordpolen tæt på: et polarnet over kappen | mellem til stor | Opus, høj | Data tjekkes med curl (MOLA's polarkort og farverne), faktatjek af kappen |
| 2. M8c del 3 | Stenene og terrænet i Stå på Mars | mellem | Opus, høj | Billeder fra panoramaernes retning som facit |
| 3. M8c del 2 | Curiosity som 3D-model ved "Hos Curiosity nu" | mellem | Opus, høj | Jeres ja til `gltf-transform` (værktøj, der køres én gang) |
| 4. L2 | Lyset, den dyre del (ambient occlusion først) | mellem | Opus, høj | En session på jeres pc (Claude Code, Node.js og Playwright) |

## 1. Nordpolen tæt på (M7b-pol)
**Kernesætning:** Efter fem minutter kan brugeren sige: "Nordpolen på Mars er en kappe af is, som er flere kilometer tyk, og kløfterne i den snor sig som en spiral (formentlig skåret af vinden)." (Tallene faktatjekkes, før teksten skrives.)

> Spor Solsystemet. Navngiv chatten "Solsystemet · Mars ekstra 1: Nordpolen tæt på". Læs det fælles afsnit øverst i `docs/prompt-mars-ekstra.md` og i `docs/plan-mars.md` afsnit 1 ("M7b-pol") og 4. Læs `docs/kode/mars.md` om de lokale net (`lokalt()` i `js/solsystem/klippeplanet.js`) og `billeder/solsystem/lav_steder.py`.
>
> **Først (intet bygges før jeres go):** Tjek med curl, hvilke af MOLA's polarstereografiske højdekort (PDS Geosciences) der kan hentes, hvor skarpe de er, og hvor langt mod ækvator de går. Find farver med fri licens (Viking ca. 1 km, eller skarpere). Bed om adgang til domænet med `update_environment`, før arbejdet går i gang, hvis det er lukket. Faktatjek med `/faktatjek` (læs fælderne først): kappens tykkelse og bredde, spiralkløfterne og Chasma Boreale. Skriv en kort plan med trin og pris (MB på tablet, trekanter, hukommelse) og få et go.
>
> **Mål:** Et lokalt net i polarstereografisk projektion over kappen (ca. 1.000 km bred), der glider over i kuglen ved kanten som de andre lokale net, et hul i kuglen omkring polen og højdetabellen (`overflade`, `bund`), så kameraet holdes over isen. Stedet "Nordpolen" i træet flyver ned over spiralkløfterne og Chasma Boreale i midnatssolen. Kortene hentes først ved stedet. Siden: 2-4 tal og "Ærligt talt" (hvad der er målt, og hvad der er tegnet). 5-10 tjek (nettet slutter tæt til kuglen, kameraet er over isen, kortene frigives, når man forlader Mars).
>
> **Til sidst:** `/faerdig`, en linje i "Ikke afprøvet" (er polen skarp nu, kant ved nettets rand, glat på tabletten), og send orkestratoren "færdig: Mars ekstra 1, PR #…". Model: Opus. Effort: høj.

## 2. Stenene og terrænet i Stå på Mars (M8c del 3)
**Kernesætning:** Efter fem minutter kan brugeren sige: "Jorden ved Gale og Jezero er dækket af sten i alle størrelser, fra grus til blokke på et par meter, og de ligger ikke jævnt."

> Spor Solsystemet. Navngiv chatten "Solsystemet · Mars ekstra 2: Stenene i Stå på Mars". Læs det fælles afsnit øverst i `docs/prompt-mars-ekstra.md`, "M8c del 3" sidst i `docs/plan-mars.md`, `docs/kode/staa-paa-mars.md` og stenkoden i `js/solsystem/landskab.js` (find den med `grep -n "sten" js/solsystem/landskab.js`).
>
> **Først:** Tag få, små billeder af Naukluft og landingsstedet fra samme retning som rovernes panoramaer (`tests/vaerktoejer/landskab-lille.mjs`), og sammenlign stenenes størrelse, form, farve og tæthed med fotoerne. Skriv, hvad der er forkert, før noget ændres, og få et go til trinene.
>
> **Mål:** Stenene må ikke se ens ud, hverken helt tæt på eller 10-100 m væk. Byg trin 1 (mere variation i shaderen: størrelser, former, farve og klynger), 3 (et mellemlag af sten på ca. 0,5-3 m mellem de små sten og fotoet) og 2 (ambient occlusion pr. lag, regnet én gang som skyggekortene) i den rækkefølge, med et go imellem. Hold shaderen under det antal opslag, tabletten kan klare (mål med `?maal`). 3D-sten som instanser (trin 4) kun, hvis I siger det efter billederne.
>
> **Tekster:** "Ærligt talt" ved stederne siger, at stenene er tegnet af programmet efter fotoerne og ikke er hver enkelt sten fra Mars. Tal om stenene faktatjekkes med `/faktatjek`.
>
> **Til sidst:** `/faerdig`, en linje i "Ikke afprøvet" (er stenene forskellige nok, flimrer noget langt væk, kører det glat, mens dagen går), og send orkestratoren "færdig: Mars ekstra 2, PR #…". Model: Opus. Effort: høj.

## 3. Curiosity som 3D-model (M8c del 2)
**Kernesætning:** Efter fem minutter kan brugeren sige: "Curiosity er en rover på størrelse med en lille bil, og den står lige nu på skråningen af Mount Sharp."

> Spor Solsystemet. Navngiv chatten "Solsystemet · Mars ekstra 3: Curiosity". Læs det fælles afsnit øverst i `docs/prompt-mars-ekstra.md` og i `docs/plan-mars.md` "Plan for M8" (afsnit 7 "Roveren" og 10) og "Status efter M8c del 1". Læs `docs/kode/staa-paa-mars.md`.
>
> **Først (intet bygges før jeres svar):** Spørg om åbent spørgsmål 1 i plan-mars.md: Må NASA's `Curiosity_static.glb` (11,9 MB) gøres mindre med `gltf-transform` (en npm-pakke, der kun køres én gang som værktøj, ikke et byggetrin)? Tjek med curl, at filen kan hentes, og hvor meget af størrelsen der er teksturer og geometri. Tjek også, om NASA's kortdata for Curiositys plads er nyere end sol 5045 (retning 161,5°, hældning 13,5°), og ret stedet "Hos Curiosity nu", hvis roveren er kørt.
>
> **Mål:** Curiosity står ved "Hos Curiosity nu" med den rigtige retning og hældning på jorden i landskabet (`js/solsystem/landskab.js`). Kopiér `GLTFLoader` (og de filer, den importerer) fra `three@0.186.1` til `lib/three/addons/`. Modellen hentes først ved stedet (højst ca. 3-4 MB efter `gltf-transform`), lyset passer med landskabets Sol og himmel, og den kaster en skygge, der passer med Solen. Den frigives med Stå på Mars' ejer, når man letter. Ved Naukluft og landingsstedet kun et lille skilt, hvis det ikke fylder for meget.
>
> **Tekster:** en kort tekst om roveren (størrelse, vægt, hvor længe den har kørt), faktatjekket med `/faktatjek`, og "Ærligt talt" om modellen (NASA's model, forenklet).
>
> **Til sidst:** `/faerdig`, en linje i "Ikke afprøvet" (står roveren rigtigt på jorden, passer skyggen, glat på tabletten), og send orkestratoren "færdig: Mars ekstra 3, PR #…". Model: Opus. Effort: høj.

## 4. Lyset, den dyre del (L2)
**Kernesætning:** (ingen ny, det er kvalitet) Stå på Mars ser mere virkeligt ud: mørkere i sprækker og lavninger, uden at det hakker på tabletten.

> Spor Solsystemet. Denne session skal køre **på jeres pc** (Windows med Claude Code, Node.js og Playwright), ikke i skyen, for lyset skal ses og måles på en rigtig skærm og et rigtigt grafikkort. Navngiv chatten "Solsystemet · Mars ekstra 4: Lyset (L2)". Læs det fælles afsnit øverst i `docs/prompt-mars-ekstra.md`, i `docs/plan-mars.md` afsnit 3 ("L2, det, der skal måles først") og "Status efter L1", og `docs/kode/staa-paa-mars.md`. Er ambient occlusion allerede lavet i del 2 (M8c del 3, trin 2), så start med det, der er tilbage.
>
> **Først:** Mål med `?maal` på pc'en (Iris Xe) ved Naukluft og Ved randen: billeder i sekundet, mens man står, og mens dagen går. Tag billeder fra de samme retninger som rovernes panoramaer, og sammenlign med fotoerne. Skriv en kort plan og få et go.
>
> **Mål:** Ambient occlusion først (regnet én gang pr. lag som skyggekortene, ét opslag mere pr. pixel). Blødere skygger og flere sten og riller helt tæt på kun, hvis I synes, at det mangler efter billederne. Farvefoto fra HiRISE fravælges (farverne er ikke ægte). Hold Tab A11 på 60 billeder i sekundet, mens man står (`LAV_KVALITET` kan skrue ned).
>
> **Til sidst:** `/faerdig`, en linje i "Ikke afprøvet" (ser det mere virkeligt ud, for mørkt, glat på tabletten), og send orkestratoren "færdig: Mars ekstra 4, PR #…". Når alle fire dele er lavet, er Mars færdig: Skriv det i `docs/lige-nu/solsystemet.md` og `docs/koereplan.md`, og opdatér artefaktet "AtomLab Overblik". Model: Opus. Effort: høj.
