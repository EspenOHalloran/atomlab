# Prompt: Molekyler M2 (Byg molekyler)

*Skrevet 7. november 2026 efter jeres go og jeres svar (Trin 0 i sin egen session, M2a og M2b, og fremgangen på Værkstedets kort). **Model: Opus.** M2 laves i tre sessioner, hver startet forfra (se "Tokens" i CLAUDE.md):*

| Session | Start med | Effort |
|---|---|---|
| 1. Trin 0 | "Læs docs/prompt-molekyler-m2.md. Lav Trin 0." | **xhigh** (faktagrundlaget, CLAUDE.md) |
| 2. M2a | "Læs docs/prompt-molekyler-m2.md. Go til M2a." | **høj** |
| 3. M2b | "Læs docs/prompt-molekyler-m2.md. Go til M2b." | **høj** |

*Hver session stopper, når dens trin er færdigt, og skriver i `docs/lige-nu/molekyler.md`, hvordan den næste startes.*

---

Byg Molekyler M2 ("Byg molekyler") efter planen i `docs/plan-molekyler.md`. Er du i tvivl om noget, så spørg, før du bygger det, med din anbefaling først.

**Læs først (kun disse dele, store filer med `grep` eller i det afsnit, du skal bruge):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- I `docs/plan-molekyler.md`: "Hvad det går ud på", afsnit 1, "M1 i dag", afsnit 3 (Byg molekyler), afsnit 6 (Teknik), "Trin" og afsnit 7 (jeres svar, også "Jeres svar til M2").
- I `docs/fakta-molekyler.md`: afsnit 2 (elektronegativitet), 3 (form og tal), 6 (fælderne) og "Forslag til Ærligt talt-linjer". Fra M2a også det nye faktagrundlag `docs/fakta-molekyler/m2.md` (laves i Trin 0).
- `docs/kode/skaerme.md` (Værkstedet og Byttebørsen), `docs/kode/data.md` (`js/data/molekyler.js`), `docs/kode/testadgang.md` (Byttebørsen) og `docs/kode/faelles.md` (`lag.js`, `fremgang.js`, `pause.js` og `kontakt.js`).
- Tjekliste C, D, E og F i `docs/tjeklister/`, `docs/erfaringer/fakta-faelder.md`, `docs/erfaringer/skaerme-og-ui.md` og `docs/erfaringer/tid-timere-tilstand.md`.
- I koden: `js/molekyle3d.js` (hele, den er lille og skal genbruges), og i `js/molekyler.js` og `js/vaerksted.js` kun de dele, der skifter mellem delene, bygger panelerne og trækker med musen.

**Jeres svar (gælder over planen):**
- Fra 23. oktober 2026: Molekylerne ligger i Atomværkstedet med knapper øverst. Atomerne trækkes med fingeren eller musen. Elektronerne vises som prikker. Infopanelet må ikke få en rullebjælke.
- Fra 7. november 2026: Trin 0 laves i sin egen session med xhigh. Byggeriet deles i **M2a** og **M2b** med hver sit go og sin egen PR. Opgaverne tæller med på **Værkstedets kort** i menuen og i Værkstedets "Opgaver forfra" (som Byttebørsens). Der kommer intet nyt kort og ingen ny linje i menuen.
- Fra 7. november 2026 (drøftelsen af menuen): **Fanerne øverst i Værkstedet bliver "Byg et atom | Byg et molekyle".** Inde i "Byg et molekyle" vælger man mellem to måder: **"Del elektroner"** (Byg molekyler, M2, standard, når den findes) og **"Giv elektroner"** (det, der hed Byttebørsen). Navnet Byttebørsen forsvinder fra programmet (fanen, hjælpens knap "Prøv det i Byttebørsen", overskrifter og tests). Teksten i "Giv elektroner" siger ærligt, at salt ender som en krystal (et gitter) og ikke som separate molekyler. Id'erne i koden (`bytte`, `bytte-` i fremgangen) må blive, så de gemte stjerner ikke går tabt. Omdøbningen laves i M2a sammen med den nye fane (eller før, hvis I giver et go til den alene). "M2 i dag" i Trin 0 skal beskrive, hvordan de to måder deler fanen.

## Trin 0: faktagrundlag og "M2 i dag" (xhigh, stop bagefter og vent på go)
1. **Domæner:** Tjek med curl, hvilke kilder der er åbne (`cccbdb.nist.gov`, `webbook.nist.gov`, `physics.nist.gov`, `openstax.org`, `chem.libretexts.org` og `en.wikipedia.org`). NIST og OpenStax virkede i M1. CCCBDB (målte vinkler, bindingslængder og dipolmomenter) er den vigtigste kilde her. Er en kilde, du har brug for, lukket, så spørg, før du arbejder videre (DESIGN.md).
2. **Faktagrundlaget i en ny fil `docs/fakta-molekyler/m2.md`** (`docs/fakta-molekyler.md` er allerede ca. 27 KB). Slå alt op i kilden, og skriv kilden ved hvert tal. Afsnit 3 i den gamle fil er "fra min viden" og skal tjekkes.
   - **Tallene for alle de kendte molekyler** i planen (afsnit 3): form, vinkler, bindingslængder (relative er nok til tegningen) og dipolmoment. Elektronegativiteten (Pauling) for H, C, N, O og Cl.
   - **Kortet om hvert molekyle:** hvor man møder det, i 1-2 korte linjer, som en 13-årig forstår (fx metan i naturgas, ammoniak i gødning og rengøring, ethen, der får frugt til at modne). Pas på med giftighed og farlige påstande (methanol, HCN og CO), og skriv dem ærligt, men roligt.
   - **Hvor modellen ikke passer (fælder, der kan ramme spillets regler):** Prik- og stregmodellen skal give det rigtige, når man bygger. Tjek især **CO** (kan ikke bygges med "to elektroner uden partner mødes", og dipolen peger den "forkerte" vej: C-enden er svagt minus), **O₂** (to elektroner uden makker, allerede i fælde 8), **HCN**, **H₂O₂** (formen er ikke flad) og de svage C–H-bindinger (skal de have δ+ og δ− eller ej, når forskellen i elektronegativitet er ca. 0,35?). Foreslå for hver, hvad spillet gør, og hvad "Ærligt talt" siger.
   - **Formen:** Vis, at en enkel model med elektronpar, der skubber hinanden, kan ramme vinklerne i H₂O, NH₃, CH₄ og CO₂ inden for ca. 1°, og hvad modellen snyder med (de frie par skal skubbe mere end bindingerne).
   - **"Det, jeg er mindst sikker på"** til sidst, som i den gamle fil.
3. **"M2 i dag" i planen** (et kort afsnit efter afsnit 3, som "M1 i dag"): hvordan Byg molekyler passer ind i det, der findes nu. Svar kort på:
   - Den tredje del-knap ("Byg molekyler", `data-vaerksted-del`) og hvad der skjules og vises, også på telefon og tablet på højkant.
   - **Elektronerne i 3D:** I `molekyle3d.js` ligger ringene fladt mod kameraet, men molekylerne har en 3D-form (tetraederen i metan). Foreslå, hvordan prikkerne og elektronparrene vises omkring et atom i et molekyle, hvordan man trækker et atom ind i 3D-billedet med fingeren, og hvordan man drejer molekylet. Lav gerne en lille prøve og et skærmbillede, før I skal vælge.
   - **Reglerne for byggeriet:** hvornår to atomer binder (afstand og elektroner uden partner), hvornår et molekyle er færdigt, højst hvor mange atomer, hvad der sker med ukendte, men lovlige molekyler, og hvad der sker ved det ulovlige (H med to bindinger).
   - **Filerne:** `js/molekyler.js` er allerede ca. 53 KB. Foreslå, om Byg molekyler skal have sin egen fil (fx `js/molekyler-byg.js`) og egne data (fx et afsnit i `js/data/molekyler.js` eller en ny fil).
   - Opgavernes id'er (fx `byg-` foran) og hvordan de kommer ind i `fremgang.js` uden at ændre modulet.
4. **Spørgsmål til jer** med din anbefaling først: fx paletten (kun H, C, N, O og Cl, eller også F, S og P), listen over kendte molekyler (planens ca. 17, eller færre i M2a), og hvordan CO håndteres.

## M2a: byg molekylerne (høj, eget go og egen PR)
Den tredje del-knap, paletten, at trække atomer ind, bindingerne (enkelt, dobbelt og tripel), formen, der kommer af sig selv, det ulovlige (atomet skubbes væk, og der står hvorfor), og navnet, når et kendt molekyle er færdigt ("Vand (H₂O)") eller "Det er et rigtigt molekyle, men det har ikke noget kendt navn her". "Næste skridt" siger, hvad man skal gøre nu. Tidsknappen virker. "For nørder" siger, at prikkerne og stregerne er en model (Lewis-strukturer og VSEPR), og at formen kommer fra en enkel model med fjedre og frastødning, ikke fra en kvanteudregning.

## M2b: ladninger, kort og opgaver (høj, eget go og egen PR)
Ladningerne (skyen bliver skæv, og enderne farves svagt blå δ+ og røde δ−), kortene om de kendte molekyler, de seks opgaver fra planen (H₂, vand og den bøjede form, hvorfor CO₂ ikke er polær, metan og tetraederen, en tripelbinding og ethanol) med ★ og fremgangen på Værkstedets kort. "Hvor kom Jordens vand fra?" er M4, ikke her.

## For både M2a og M2b
- **Kode:** Genbrug `molekyle3d.js` (farver og glød), men ikke `Atom`-klassens kerne. Brug `dt` og `tid` fra opdateringen (ikke `performance.now()`). Formen regnes i en datafil uden Three.js, så den kan testes i Node. Testadgang under `window.atomlabTest.vaerksted` (skrives i `docs/kode/testadgang.md`). Nye gemte data i `docs/kode/gemte-data.md`.
- **Tekster:** Dansk til en 13-årig, pointen først, fagord forklaret første gang (kovalent binding, elektronpar, frit elektronpar, dobbeltbinding, polær, δ+ og δ−). Nye ord i Ordbogen. Infopanelet får ingen rullebjælke: Det, der ikke kan være, går ind bag "Hvorfor?" eller i en foldeboks. `/faktatjek` på alle tekster med tal eller fakta, mod `docs/fakta-molekyler/m2.md`. Læs fælderne, før teksten skrives. Faktatjekket skrives i `docs/fakta-molekyler/faktatjek-m2.md`.
- **Tests:** Udvid `tests/molekyler.mjs` (Node): vinklerne i H₂O, NH₃, CH₄ og CO₂ inden for ca. 1°, et H får aldrig to bindinger, C ender altid med fire, alle kendte molekyler kan bygges og får det rigtige navn, og (M2b) δ-fortegnene passer med elektronegativiteten og faktagrundlaget. En ny Playwright-test af Byg molekyler (fx `tests/byg-molekyler.mjs`): del-knappen, træk et atom ind, et molekyle bliver færdigt og får sit navn, ingen konsolfejl og panelet uden rullebjælke. Sæt den ind i `tests/koer-alle.mjs`. `vaerksted` og `byttebors` skal stadig bestå. Kør `node tests/koer-alle.mjs --ændret` i baggrunden, mens du arbejder og før merge. Skærmbilleder af Byg molekyler på pc, tablet på højkant og på langs og telefon.
- **"Ikke afprøvet"** (`docs/ikke-afproevet.md`): Kan man ramme og trække atomerne med fingeren, kan man dreje molekylet, ses formen tydeligt, og kan man læse δ-farverne på tabletten?

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Molekyler** (`docs/lige-nu/molekyler.md`). Du ejer `js/molekyler.js`, `js/molekyle3d.js`, `js/data/molekyler.js`, nye filer til Byg molekyler, `tests/molekyler.mjs`, `tests/byttebors.mjs`, den nye test, `docs/plan-molekyler.md`, `docs/fakta-molekyler.md` og `docs/fakta-molekyler/`. Du deler `index.html`, `style.css`, `js/vaerksted.js`, `js/fremgang.js`, `js/data/ordbog.js`, `tests/koer-alle.mjs` og `docs/kode/*.md`: Rør kun de linjer, du skal bruge. Rør ikke menuen (`js/main.js` og `js/karrusel.js`, sporet Menuen), `js/kosmos/`, `js/solsystem/` eller de andre spors filer i `docs/lige-nu/`. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves. Kør `--ændret` igen bagefter.

**Efter hvert trin:** `/faerdig`. Opdater `docs/lige-nu/molekyler.md` (flyt det forrige "Senest lavet" til `docs/arkiv/historik/molekyler.md`), sæt ✅ i planens trin-tabel, skriv erfaringer i `docs/erfaringer/`, beskriv de nye filer i `docs/kode/`, og skriv, hvordan næste session startes (DESIGN.md, "Når et punkt er færdigt"). Når M2b er færdig: Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket), skriv prompten til M3 (knaldgas, `docs/prompt-molekyler-m3.md`), og flyt denne prompt til `docs/arkiv/`.
