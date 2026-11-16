# Prompt: Solen som en bedre tegning (feedback nr. 3, 16. november 2026)

**Model: Opus, høj effort.** Kode, der kommer med i programmet (en shader), og et par fakta i teksten. Fable er ikke nødvendig.

Spor: **Solsystemet og Kosmos** ([lige-nu/solsystemet.md](lige-nu/solsystemet.md), "Næste" nr. 00). Kun denne session skriver i sporets fil.

## Jeres beslutning (16. november 2026)
Solen i Solsystemet skal være en bedre *tegning*, ikke et foto. Et foto fra NASA SDO/HMI blev fravalgt: Det viser kun den side, der vender mod os, i ét øjeblik (bagsiden er tom, når man drejer), og det koster 2-4 MB og ca. 70 MB i grafikkortet.

## Læs først
1. [lige-nu.md](lige-nu.md), [lige-nu/solsystemet.md](lige-nu/solsystemet.md) og [DESIGN.md](../DESIGN.md).
2. [kode/solsystem.md](kode/solsystem.md) (afsnittet om Solen) og [kode/kosmos.md](kode/kosmos.md) om `stjerne()` i `js/kosmos/faelles.js`. Tjekliste **E** (shader, ydelse) og **B** (fakta), [erfaringer/shadere.md](erfaringer/shadere.md) og [de kendte fælder](erfaringer/fakta-faelder.md).
3. Koden: `js/kosmos/solen.js` og `stjerne()` med `STJERNE_FRAGMENT` i `js/kosmos/faelles.js`.
4. Før du bygger: `git fetch origin`, og se i `origin/main` og åbne PR'er, om det allerede er lavet.

## Opgaven
Lav først et skærmbillede af Solen i dag (fuld grafik, pc og tablet), og en kort plan. **Få et go**, før der bygges.

- **En egen shader til Solen i `js/kosmos/solen.js`.** `stjerne()` bruges også i Kosmos og Stjerneovnen og røres ikke. Navne i shaderen skal være ASCII.
- **Den mørke rand (limb darkening):** I synligt lys er kanten ca. 40 % så lys som midten og mere orange (fx I(μ) = 1 − u(1 − μ) med u ≈ 0,6). I dag er overfladen overbelyst og skyet (gløden gør den næsten hvid).
- **Granuler:** fine celler med lyse midter og mørke render (fx cellestøj), der langsomt ændrer sig. Brug `tid` fra `opdater` (står stille i pause).
- **Solpletter:** nogle få, med en mørk kerne og en lysere kant, nær ±5-35° bredde, der drejer hurtigst ved ækvator (ca. 25 døgn ved ækvator, ca. 36 ved polerne, står allerede i siden).
- **Billigere på tabletten:** færre lag støj med `LAV_KVALITET`.
- **Teksten:** "Ærligt talt" siger i dag "der er ingen solpletter her". Ret den, så den passer (fx at pletterne er pynt, og at deres antal skifter med Solens 11-årige cyklus). Faktatjek med `/faktatjek`.
- Tjek gløden (`glød`) og efterbehandlingen, så kanten ikke brænder ud igen.

## Rammer
- Tests: `node tests/koer-alle.mjs --ændret` (i baggrunden). Højst 5-10 nye tjek (fx at Solens shader bruges, og at Kosmos' stjerner er uændrede).
- Skærmbilleder kun af Solen, pc og tablet. Ydelsen måles af jer med `?maal` på Tab A11 og skrives i [ikke-afproevet.md](ikke-afproevet.md).
- Dokumenterne til sidst (`/faerdig`). PR'en merges med det samme.
- Navngiv chatten "Solsystemet · Solen bedre tegnet" med `set_session_title`.
