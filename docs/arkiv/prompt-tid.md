# Prompt: Tid og rum, Trin 0 (faktagrundlag og plan)

*Skrevet 7. november 2026 efter jeres go ("Go til prompt til begge"). Kopiér teksten nedenfor ind i en ny session. **Model: Opus. Effort: høj.** Trin 0 bygger ingen kode. Den laver faktagrundlaget og planen og venter så på jeres go. Byggeriet får sin egen session og prompt bagefter (de nye regler under "Tokens" i CLAUDE.md).*

---

Læs `docs/lige-nu.md`, `docs/lige-nu/tid.md`, DESIGN.md og hele `docs/plan-tid.md` (14 KB, især "Hovedidéen", "Hvor skal det ligge?", "Fælder" og "Jeres svar"). Læs også `docs/erfaringer/fakta-faelder.md`, tjekliste B og `/faktatjek`. Læs `js/kosmos/rumtid.js` og `js/faenomenskaerm.js` kun i de dele, der viser, hvordan et fænomen i Kosmos er bygget (faser, handlinger, "Hvorfor?"-kort, "For nørder" og "Ærligt talt"). Læs ikke koden i øvrigt.

**Jeres svar (7. november 2026):**
1. **Placeringen (A, B eller C):** se "Jeres svar" i `docs/plan-tid.md`. Står der intet, så spørg først, med Opus' anbefaling A (et nyt fænomen i Kosmos, "Rejsen i tid", der senere kan vokse til B).
2. **Køen:** Tid kommer nu, som det første af de tre store ønsker (Tid, Uranus og Neptun, Liv), fordi det er det mindste og trækker mest. Molekyler M1b kan køre samtidig i sit eget spor.
3. **Hvem bliver hjemme:** en **tvilling**.

**Trin 0 (stop bagefter, og vent på go):**
1. **Faktagrundlaget** i en ny fil `docs/fakta-tid.md` med kilder: tidsforlængelsen (gammafaktoren) for 90 %, 99 %, 99,9 %, 99,99 % … af lysets fart, rejsen med "1 g hele vejen" (formlerne og egentiden til Alpha Centauri, Mælkevejens centrum og Andromeda, også med nedbremsning og hjemrejse), afstandene til målene, lysuret, længdeforkortelsen, energien (og støvkornet ved høj fart) og tvillingeparadokset. Regn tallene efter med et lille script (fx Python), og skriv både formlen og resultatet. Tjek også sammenligningerne med fortiden (fx Solvognen) og fælderne i planen. Brug `/faktatjek`.
2. **Planen:** Skriv trin i `docs/plan-tid.md` (fx T1: lysuret og ét mål, T2: alle mål, skyderen og "1 g", T3: lagene og teksterne), hver med størrelse, tests og hvad der skal prøves på tabletten. Cockpitudsigten (shaderen) er et senere, eget trin. Vurder, hvilke af de billige idéer (lysets forsinkelse og cæsiumuret) der kan komme med, og hvor.
3. **Spørgsmål til os** med din anbefaling først (fx hvordan urene vises, og hvad der står ved hjemkomsten).

**Domæner** (tjekket 7. november 2026 med curl): `en.wikipedia.org`, `physics.nist.gov` og `science.nasa.gov` er åbne. `www.bipm.org`, `da.wikipedia.org`, `hyperphysics.phy-astr.gsu.edu` og `math.ucr.edu` (Baez' FAQ om relativitet) var lukket. Spørg, før du arbejder videre, hvis en kilde, du har brug for, er lukket.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `docs/plan-tid.md`, `docs/fakta-tid.md` og `docs/lige-nu/tid.md`. Rør ikke kode og ikke de andre spors filer i `docs/lige-nu/`. Merge `main` ind, når du starter, og igen før PR'en.
