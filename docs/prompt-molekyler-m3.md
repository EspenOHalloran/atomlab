# Prompt: Molekyler M3 (Se vand blive til, knaldgas)

*Skrevet 8. november 2026, da M2b var færdig. **Model: Opus, effort høj.** Start en ny session med "Læs docs/prompt-molekyler-m3.md. Lav M3." M3 er én session med én PR. Stop først efter trin 1 (spørgsmålene), og vent på et go.*

---

Byg Molekyler M3 ("Se vand blive til") efter planen i `docs/plan-molekyler.md`, afsnit 4. Er du i tvivl om noget, så spørg, før du bygger det, med din anbefaling først (DESIGN.md, "Når I skal beslutte noget").

**Læs først (kun disse dele, store filer med `grep` eller i det afsnit, du skal bruge):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- I `docs/plan-molekyler.md`: "Hvad det går ud på" (punkt 4 om energien), afsnit 4 (knaldgas), "M2 i dag" (hvordan "Del elektroner" er bygget) og "Trin".
- I `docs/fakta-molekyler.md`: afsnit 4 (knaldgas) og 6 (fælderne). I `docs/fakta-molekyler/m2.md`: afsnit 1 og 5.
- `docs/kode/skaerme.md` (`js/molekyler-byg.js`), `docs/kode/data.md` (`js/data/molekyler-byg.js`), `docs/kode/testadgang.md` ("Del elektroner") og `docs/kode/faelles.md` (`lag.js`, `pause.js` og `kontakt.js`).
- Hvordan Stjerneovnen viser "bakken" (aktiveringsenergien) og kæden i Reaktoren: kun de linjer, der tegner bakken og tæller kæden (`grep -n "BAKKE\|bakke" js/fusion.js` og `grep -n "kæde" js/reaktor.js`), så M3 kan låne idéen, ikke koden.
- Tjekliste C, D, E og F i `docs/tjeklister/`, `docs/erfaringer/fakta-faelder.md` og afsnittene om Byttebørsen og Byg molekyler i `docs/erfaringer/skaerme-og-ui.md`.

**Det, der allerede er besluttet (planen og jeres svar):**
- Knaldgas hører til "Byg et molekyle" → "Del elektroner" som en knap ("Knaldgas"). Der kommer intet nyt kort og ingen ny linje i menuen. Opgaverne tæller på Værkstedets kort, som opgaverne i M2b (`OPGAVER_BYG` i `js/data/molekyler-byg.js`, id'er med `byg-` foran, og de samme 3 linjer i `js/main.js`, der allerede tæller `OPGAVER_BYG`, skal ikke røres).
- En lille 3D-boks med 4 H₂ og 2 O₂, der flyver rundt og støder sammen. Uden gnist sker der ingenting (bindingerne er for stærke). "Gnist" bryder de første bindinger, og en kæde af frie atomer og OH (radikaler) laver vand. Til sidst 4 H₂O og intet tilbage.
- En måler viser, hvad det koster at bryde bindingerne, og hvad man får, når de nye laves. Energien skal være bevaret (test). Forskellen bliver til varme (molekylerne flyver hurtigere, og boksen gløder).
- "Ærligt talt": Reaktionen går gennem ca. 20 mellemtrin. Spillet viser en forenklet kæde.

## Trin 1: tallene og spørgsmålene (stop bagefter, og vent på go)
1. **Domæner:** Tjek med curl, at `webbook.nist.gov`, `openstax.org`, `chem.libretexts.org` og `en.wikipedia.org` kan åbnes. Er en kilde lukket, så spørg, før du arbejder videre.
2. **Tallene:** Afsnit 4 i `docs/fakta-molekyler.md` skriver, at dannelsesvarmerne (−241,8 og −285,8 kJ/mol) kun er bekræftet i uddrag fra svage kilder. Slå dem op i NIST Webbook, og slå bindingsenergierne (H–H 436, O=O 498 og O–H 463 kJ/mol) op i OpenStax (tabel 7.2 eller 7.3). Skriv kilden ved hvert tal i et nyt afsnit i `docs/fakta-molekyler/m3.md` (den gamle fil er allerede ca. 27 KB). Forklar også, hvorfor 2·436 + 498 − 4·463 ≈ −480 kJ ikke giver præcis −483,6 kJ (bindingsenergierne er gennemsnit).
3. **Spørgsmål til jer**, med din anbefaling først, fx: Hvor står boksen (i stedet for det, man har bygget, eller ved siden af)? Hvor mange molekyler (planen siger 6-30, 4 H₂ + 2 O₂ er det enkleste)? Skal man selv kunne lave en blanding (fx for meget hydrogen, som i rumfærgens motor)? Hvilke opgaver (fx "Tænd knaldgassen" og "Find ud af, hvorfor intet sker uden gnist")?

## Trin 2: byg det (efter jeres go)
- **Kode:** Egen fil til knaldgassen (fx `js/knaldgas.js`, `js/molekyler-byg.js` er allerede ca. 30 KB), og reglerne og energien i en datafil uden Three.js (fx et afsnit i `js/data/molekyler-byg.js` eller `js/data/knaldgas.js`), så de kan testes i Node. Genbrug `MolekyleTegning` fra `js/molekyle3d.js` (kernerne, pindene og prikkerne). Brug `dt` og `tid` fra opdateringen. Tidsknappen virker, og "reducer bevægelse" (`ROLIG`) er respekteret. Testadgang under `window.atomlabTest.vaerksted.byg` eller en ny `knaldgas` (skrives i `docs/kode/testadgang.md`).
- **Tekster:** Dansk til en 13-årig, pointen først, fagord forklaret første gang (aktiveringsenergi, radikal, kædereaktion). Nye ord i Ordbogen. Infopanelet får ingen rullebjælke. `/faktatjek` på alle tekster med tal, og tjekket skrives i `docs/fakta-molekyler/faktatjek-m3.md`.
- **Tests:** Udvid `tests/molekyler.mjs` (Node): energien er bevaret i hvert stød og i hver reaktion, der ender altid med 4 H₂O og 0 H₂ og O₂ (mange forsøg, fx 60, tjekliste C), og uden gnist sker der ingenting. Udvid `tests/byg-molekyler.mjs`: knappen, gnisten, måleren, ingen konsolfejl og panelet uden rullebjælke på pc og tablet. Kør `node tests/koer-alle.mjs --ændret` i baggrunden. Skærmbilleder på pc, tablet på højkant og telefon.
- **"Ikke afprøvet":** Kan man se kæden og varmen på tabletten, og er det tydeligt, at intet sker uden gnist?

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Molekyler** (`docs/lige-nu/molekyler.md`). Du ejer `js/molekyler-byg.js`, `js/molekyle3d.js`, `js/data/molekyler-byg.js`, nye filer til knaldgassen, `tests/molekyler.mjs`, `tests/byg-molekyler.mjs`, `docs/plan-molekyler.md`, `docs/fakta-molekyler.md` og `docs/fakta-molekyler/`. Du deler `index.html`, `style.css`, `js/vaerksted.js`, `js/data/ordbog.js`, `js/data/hvorfor.js`, `tests/koer-alle.mjs` og `docs/kode/*.md`: Rør kun de linjer, du skal bruge. Rør ikke menuen (`js/main.js` og `js/karrusel.js`), `js/kosmos/`, `js/solsystem/` eller de andre spors filer i `docs/lige-nu/`. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.

**Når M3 er færdig:** `/faerdig`. Opdater `docs/lige-nu/molekyler.md` (flyt det forrige "Senest lavet" til `docs/arkiv/historik/molekyler.md`), sæt ✅ i planens trin-tabel, skriv erfaringer i `docs/erfaringer/`, beskriv de nye filer i `docs/kode/`, flyt denne prompt til `docs/arkiv/`, og skriv, hvordan M4 (Jordens vand, et "Hvorfor?"-kort, lille) startes. M4 er så lille, at den kan laves i samme session som M3, hvis I giver go til det.
