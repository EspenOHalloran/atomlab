# Prompt: Menuen, K4 (verdenerne i ringen)

*Skrevet 7. november 2026 efter jeres svar i drøftelsen af idéerne. Trin 0 er lavet (7. november 2026). Start K4 med en ny session: "Læs docs/prompt-menu-k4.md. Lav K4." **Model: Opus. Effort: høj** (som ringen, fordi det skal være lækkert at se på). Trin 0 og byggeriet har hver sit go.*

---

Byg verdenerne i menuens ring efter `docs/plan-verdener.md`.

**Læs først (kun disse dele):**
- `docs/lige-nu/menuen.md` (hvad K2 har lavet) og DESIGN.md.
- `docs/plan-verdener.md` (hele, den er kort) og i `docs/plan-menu.md` afsnittene "Jeres svar", "Ringen på en elektronbane" og K2 under "Trin".
- I `docs/kode/faelles.md` afsnittene om `js/main.js` og `js/karrusel.js`, `docs/kode/gemte-data.md` (`atomlabSidsteDel`) og `docs/kode/testadgang.md` (menuen).
- Tjekliste D og E og `docs/erfaringer/` om menuen, hvis der er en fil.
- I koden: `js/karrusel.js` (hele), de dele af `js/main.js`, der viser menuen og fremgangen (`fremgangPrDel`, `visSkærm`), og `tests/karrusel.mjs`.

**Trin 0 (eget go):**
1. Svar på punkterne under "Åbent" i `plan-verdener.md`. **Sådan spørger du (jeres regel i DESIGN.md):** Præsentér hvert punkt kort, giv din anbefaling, og lad brugeren vælge mellem mulighederne (fx med spørgsmål med valgmuligheder).
2. Lav et billede af idéen (verdenen forrest med dens dele som små kort under, på pc og tablet på højkant), før grafikken bygges.
3. Skriv svarene ind i `plan-verdener.md` under "Jeres svar".

**K4 (eget go):** Byg udgave B fra "Jeres svar" i `plan-verdener.md` (delene som knapper inde i verdenens kort, ét baggrundsmotiv pr. verden, docken med verdenerne, ✓ på delen og verdenen, start med den sidste del fremhævet).
- Ringen viser verdenerne. Delene i den forreste verden er knapper i kortet, man trykker direkte på. En verden med kun én del åbner delen direkte.
- Molekylerne ligger i Værkstedet (fanen "Byg et molekyle", sporet Molekyler). Verdenen "Atomer og molekyler" har derfor delene Atomværkstedet og Det periodiske system. Rør ikke `js/vaerksted.js`.
- Bevægelsen (fjederen, kastet, svæven) og den billige udgave på tabletten skal være som i K1/K2.
- Udvid `tests/karrusel.mjs`. Kør `node tests/koer-alle.mjs --ændret`. Skærmbilleder på pc, tablet begge veje og telefon.
- "Ikke afprøvet": Finder man delene i verdenens kort? Er det tydeligt, at man skal trykke på den lille knap og ikke på verdenen? (Spørgsmålet om navnene står der allerede.)
- `/faerdig` til sidst.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Menuen** (`docs/lige-nu/menuen.md`). Du ejer `js/karrusel.js`, `tests/karrusel.mjs`, `docs/plan-menu.md`, `docs/plan-verdener.md` og menuens blok i `js/main.js`, `index.html` og `style.css` (sidst i filen). Rør ikke de andre skærmes filer. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.
