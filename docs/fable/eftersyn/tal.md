# Tallene til eftersynet (E0, 11. november 2026)

*Samlet af Opus til [briefen](../brief-eftersyn.md). Kun fakta og målinger, ingen vurderinger. Målingerne kan tages igen med `node tests/vaerktoejer/maal-eftersyn.mjs` (rådata i [maalinger.json](maalinger.json)).*

## 1. Siden sidste overblik (F1 og de nye dele)
**F1's ti punkter** (`docs/fable/F1-overblik.md`, 23. oktober 2026), status 11. november 2026. Alle undtagen nr. 7 blev lavet 23.-24. oktober (Trin 18, `docs/arkiv/historik.md`):
1. Ro på skærmen, dybde i tre lag: **lavet** som plan ([plan-lag.md](../plan-lag.md)) og bygget (`js/lag.js`).
2. Skjul panelerne og "Kun grafik": **lavet** (`js/paneler.js`).
3. "Hvorfor?" der, hvor spørgsmålet opstår: **lavet**, 20 kort dengang, 38 nu (`js/data/hvorfor.js`).
4. Grafisk løft af atomet: **lavet** (orbitalernes former er standard fra 24. oktober).
5. Batteriet (grafik, start og navnet "lithium-ion-batteri"): **lavet**, med guide, "Næste skridt" og "Vis mig".
6. Mere om grundstofferne i lag: **lavet** (grundstofkortet med "I din hverdag", "I din krop" og "I universet" og "Mere").
7. Fremgang og sammenhæng: **delvist**. Fremgangen er lavet (i dag "★ Din fremgang" i menuen og ✓ på dele og verdener). "Se også" mellem delene og "næste eventyr" er ikke lavet (DESIGN.md, "Ikke lavet fra de gamle trin").
8. Gør det sorte hul sort: **lavet** 23. oktober, og 6. november bygget helt om med rigtig lysbøjning (en shader).
9. "For nørder" nederst i Kosmos på højkant: **lavet**.
10. Én fælles byggeklods til lagene og "Næste skridt": **lavet** (`js/lag.js`).

**Store dele siden 23. oktober** (alle med Opus, høj effort):
- Saturn med seks måner og flyby (24. oktober) og i samme kvalitet som Mars (S1-S2).
- Solsystemet blev sin egen skærm, skilt fra Kosmos, med en ny opbygning (U1-U4, 26.-31. oktober).
- Mars M1-M8c: kloden med rigtige højder, atmosfæren, Phobos og Deimos, flybyen, Stå på Mars ved Gale og Jezero og rovernes fotos (24. oktober-5. november).
- Ordbogen (29. oktober), citater og kategorier, hentebjælken for store billeder (6. november).
- Det sorte hul med rigtig lysbøjning (6. november).
- Jupiter J1-J5 (6.-7. november), Uranus og Neptun UN1-UN5 (8.-9. november), Venus V1-V2 (9. november).
- Menuen som en ring af verdener (K1-K4, 7.-8. november).
- Molekyler M1-M4: "Giv elektroner", "Del elektroner", knaldgassen og Jordens vand (7.-8. november).
- Tid og rum: "Rejsen i tid" (T1-T3, 7.-8. november) og "Hvorfor går tiden langsommere?" med fem scener (T5, 9. november).
- Liv L0-L2: plan og faktagrundlag, zoom fra cellen til atomerne, stigen og "Fra opskrift til protein" (9.-10. november).
- Arbejdsgangen: dokumenterne delt op i små filer med et læsekort (6. november), spor og parallelle sessioner (7. november), PR'er merges straks (8. november).

## 2. Koden
- **JavaScript:** 133 moduler med 40.618 linjer (11. november 2026). Ved F1 (23. oktober) var der ca. 17.000.

| Mappe | Filer | Linjer |
|---|---|---|
| `js/` (skærmene og det fælles) | 37 | 15.663 |
| `js/kosmos/` (et fænomen pr. fil, og de store planeter) | 29 | 12.097 |
| `js/data/` med `sider/` og `liv/` (data uden Three.js, kan testes i Node) | 46 | 6.927 |
| `js/solsystem/` (grafikken til Solsystemet) | 17 | 4.593 |
| `js/liv/` | 4 | 1.338 |
| `index.html` / `style.css` | 1 / 1 | 1.100 / 1.834 |
| `tests/` (Playwright-scripts) og `tests/vaerktoejer/` | 45 + 19 | 8.854 + 991 (før E0) |
| Python-værktøjer, der laver billederne (`billeder/solsystem/lav_*.py`) | 14 | 2.530 |

- **De 15 største filer** (linjer): `js/kosmos/mars.js` 1.599, `js/fusion.js` 1.271, `js/molekyler.js` 1.210, `js/vaerksted.js` 1.146, `js/reaktor.js` 1.062, `js/kosmos/tidhvorfor.js` 1.052, `js/molekyler-byg.js` 965, `js/solsystem/isgigant.js` 952, `js/atom.js` 926, `js/faenomenskaerm.js` 900, `js/kosmos/jupiter.js` 862, `js/batteri.js` 832, `js/system.js` 785, `js/solsystem/klippeplanet.js` 739, `js/kosmos/tid.js` 728.
- **Three.js 0.186.1** ligger i `lib/three/` (2,2 MB, 14 filer: kernen og 7 addons). Ingen andre biblioteker.

## 3. Billederne
- `billeder/` fylder **309 MB** i repoet: 159 billeder (103 i `billeder/solsystem/` og 56 i `billeder/solsystem/landskab/`, som alene er 175 MB) og ikonerne. Hver klode findes i flere størrelser (fx `mars-2k`, `-4k` og `-8k`), og kun én hentes ad gangen. De største filer er højdekortene og farvekortene til Stå på Mars (op til 18 MB pr. fil).
- Hvad der faktisk hentes pr. skærm, står i afsnit 5. Kilderne og licenserne står i `billeder/solsystem/KILDER.md`.
- Git-historikken (`.git`) fylder ca. 345 MB, fordi billederne også ligger i de gamle commits.

## 4. Dokumenterne og arbejdsgangen
- **148 Markdown-filer i `docs/`, i alt ca. 1,9 MB:**

| Mappe | Filer | KB |
|---|---|---|
| `docs/` (planer, prompter, fakta, køreplan, idéer m.m.) | 39 | 616 |
| `docs/arkiv/` (historik, færdige planer og brugte prompter) | 33 | 419 |
| `docs/fakta-solsystemet/` (faktagrundlag med kilder) | 13 | 267 |
| `docs/erfaringer/` (17 emner) | 17 | 171 |
| `docs/kode/` (beskrivelse af koden) | 14 | 159 |
| `docs/fable/` | 9 | 48 |
| `docs/tjeklister/` (A-F) | 6 | 22 |
| `docs/lige-nu/` (7 spor) | 7 | 19 |

- **18 planer** (`docs/plan-*.md`, 6-59 KB, i alt ca. 375 KB) og **4 prompter**, der venter (22 brugte i arkivet).
- **Det, en ny session mindst læser** efter læsekortet i CLAUDE.md: CLAUDE.md (15,6 KB), `docs/lige-nu.md` (2,4 KB), sporets fil (1,2-5,2 KB) og DESIGN.md (8,1 KB), i alt **ca. 29 KB**. Før arbejde i koden kommer `docs/kode.md` (4,1 KB), en fil i `docs/kode/` (2-19 KB), en tjekliste (1-8 KB) og et emne i `docs/erfaringer/` (2-19 KB) til, typisk **ca. 55-60 KB** i alt. Dertil prompten og de afsnit af planen, der hører til delopgaven, og skills (`/faerdig` 4,6 KB, `/faktatjek` 1,9 KB).
- **Git:** første commit 14. oktober 2026. 572 commits på `main` (365 uden merges) og 136 merge-commits fra PR'er (PR-numrene går til #156).

| Uge (2026) | Commits uden merges | PR'er merget |
|---|---|---|
| 42 (12.-18. okt.) | 37 | 0 |
| 43 (19.-25. okt.) | 53 | 7 |
| 44 (26. okt.-1. nov.) | 70 | 39 |
| 45 (2.-8. nov.) | 171 | 76 |
| 46 (9.-11. nov., tre dage) | 34 | 14 |

- **Spor:** 7 (Solsystemet og Kosmos, Molekyler, Tid og rum, Menuen, Ordbogen og Det periodiske system, Småting, Åbne punkter). **Åbne punkter:** 16 (de fleste er tests, der fejlede én gang under belastning og bestod alene). **"Ikke afprøvet"** (til runden på tabletten): 47 punkter.

