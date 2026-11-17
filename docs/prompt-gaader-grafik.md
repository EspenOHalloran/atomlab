# Prompt: Gåderne skal se skarpere og flottere ud

*Skrevet af orkestratoren 17. november 2026 efter jeres fund: "Når man går ind i Gåder, synes jeg, det er uimponerende rent grafisk. Det ser lidt low res ud nogle steder, og menupunkternes tekst i skinnen. Og hvorfor er det sorte hul så grimt i Gåder, når vi har brugt en del krudt på at lave et flot sort hul i Kosmos?" **Model: Opus. Effort: høj.** Sporet er Småting (Gåderne bor dér).*

---

Spor: Småting. Navngiv chatten "Småting · Gåderne skarpere og det sorte hul". Tjek først i `origin/main`, at det ikke er lavet (CLAUDE.md, "Parallelle sessioner").

**Læs først:** `docs/lige-nu/smaating.md` (afsnittet om Gåderne), DESIGN.md, `docs/kode/` for Gåderne og Kosmos' sorte hul (grep efter `gaader` og `linse`), `docs/plan-gaader-3d.md` (det, der står om lamperne på skinnen og G4c), `docs/stilguide.md`, tjekliste D og E og `docs/erfaringer/` om grafik og ydelse.

**Det, brugeren så (tre ting):**
1. **Lav opløsning nogle steder.** Find de steder, hvor det ser grynet eller udtværet ud på pc og tablet: teksturer lavet på et lærred (fx `stempel()` i `js/gaader/streg.js` er 256 × 112 px), prikker og glød, der er for små eller for få, og opløsningen i rendereren (`scene3d.js` sætter højst 2, og 1,5 med `LAV_KVALITET`). Tag skærmbilleder med fuld grafik (ikke `TEST_HURTIG`) i pc- og tabletstørrelse før og efter.
2. **Teksten på skinnen** (navnene på gåderne) er utydelig. Gør den skarp: tegn den i høj nok opløsning efter `devicePixelRatio`, eller brug HTML-tekst ovenpå, hvis det er det, resten af programmet gør. Den skal stadig kunne læses på telefonen.
3. **Det sorte hul i Gåderne** er i dag en sort skive med en orange torus (`sorthul()` i `js/gaader/lys.js`). Kosmos har et flot sort hul med lysbøjning i en shader (`js/kosmos/linse.js`, `lavLinse`, `LINSE_KVALITET`). Genbrug det (eller en mindre udgave af det) til lampen på skinnen, så de to ligner hinanden. Pas på ydelsen: Skinnen viser flere lamper ad gangen, og tabletten (Mali-G615) er svag. Kan linsen ikke køre på skinnen, så lav en stillestående udgave (fx et billede tegnet én gang af linsen) med `LAV_KVALITET`. Hele scenen G4c (Sort hul) er ikke en del af denne opgave (den venter efter jeres ønske på G4d).

**Lav først en kort plan med trin, og få et go pr. trin.** Mål med `?maal` før og efter i Gåderne (billeder i sekundet og ryk) og skriv tallene i sporets fil. Tests: `--ændret` og et par tjek af det nye (fx at skinnens tekst har den rigtige opløsning, og at det sorte hul bruger linsen eller billedet). Linjer i "Ikke afprøvet" (se det på tabletten). Afslut med `/faerdig`.

**Rør ikke:** Kosmos' sorte hul (kun genbrug, ændr ikke `linse.js` uden at sige det), de andre spors filer, og i de fælles filer kun Gådernes blok.
