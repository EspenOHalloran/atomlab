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

- **18 planer** (`docs/plan-*.md`, 6-59 KB, i alt ca. 375 KB) og **3 prompter**, der venter (23 brugte i arkivet, med prompten til E0).
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

## 5. Testene
- **42 tests** i `node tests/koer-alle.mjs` (Playwright-scripts, ét pr. emne, ikke et testframework). Testen `hentning` ligger ved siden af og køres for sig (den fejler også på `main` i miljøet, se Åbne punkter). Testene tjekker logik, tal og tekster med testadgangen `?test` (`window.atomlabTest`), ikke pixel.
- **Hele samlingen 11. november 2026:** alle 42 bestod på **30,9 minutter** (to tests ad gangen, 4 CPU-kerner, uden grafikkort). **3.089 tjek** (plus 21.556 i `henfaldsregler`, der gennemløber alle kerner i data). De langsomste: `mars` 585 s, `grafik` 349 s, `guide` 146 s, `solsystem` 145 s, `kosmos` 138 s, `karrusel` 135 s og `jupiter` 129 s. Den samme samling tog ca. 10 minutter med 18 tests (oktober).
- **`--ændret` (tre typiske eksempler,** skønnet ud fra tiderne ovenfor, to ad gangen): en ændring i `js/liv-protein.js` kører `roeg` og `liv` (ca. 1 minut). En ændring i `js/fusion.js` kører 9 tests (ca. 5 minutter). En ændring i `js/kosmos/venus.js` kører 12 tests, også `mars` (ca. 10-12 minutter). En ændring i et fælles modul som `js/lag.js` kører 38 af de 42 (næsten hele samlingen). Røgtesten tager ca. 30 sekunder.
- **Fejl, der kun kom under belastning:** 10 af de 16 punkter i `docs/lige-nu/aabne-punkter.md` er tests, der fejlede én gang, mens to kørte samtidig, og bestod alene. Ingen af dem fejlede i kørslen 11. november.

## 6. Målingerne (download, grafik og hukommelse)
Målt 11. november 2026 med `tests/vaerktoejer/maal-eftersyn.mjs` på en lokal server (Python, uden komprimering) i testbrowseren med fuld grafik, men uden grafikkort. Hver række er et første besøg med tom cache: siden åbnes, menuen er klar, og så skiftes der til skærmen. Rådata i [maalinger.json](maalinger.json). Jorden er målt igen samme dag (første kørsel valgte Solen ved en fejl i værktøjet).

**Sådan læses tabellerne:**
- **Hentet:** Ved starten hentes **al koden på én gang** (149 filer, 4,4 MB: Three.js 2,1 MB og egen kode 2,1 MB, `js/main.js` importerer alle skærme). Derfor henter skærmene uden store billeder intet, når man går ind. Kun kloderne i Solsystemet henter billeder. GitHub Pages komprimerer tekstfiler, så JavaScript fylder mindre over nettet end her. Billederne (JPG og PNG) er allerede komprimerede.
- **Solsystemet åbner ved Solen,** og det henter Jordens kort med det samme (pc 10,1 MB, tablet 3,3 MB, Jordens dag-, nat-, sky- og højdekort i 2k og 4k). Rækkerne for kloderne er målt fra menuen, så det tal er med i hver af dem. Mars alene er altså ca. 15 MB på pc (fx `mars-8k.jpg` 3,4 MB, `mars-hoejde-4k.png` 7,4 MB og kortene til Olympus Mons og månerne). Stå på Mars henter mere (landskaberne er 5-18 MB pr. fil) og er ikke målt her.
- **Sek. til alt er hentet:** fra skiftet til den sidste fil, på en lokal server. Over nettet afhænger det af forbindelsen (fx 25 MB på 50 Mbit/s er ca. 4 sekunder).
- **Kald, trekanter og punkter:** for ét helt billede med alle trin (også gløden). Punkterne er fx stjernehimlen og partikler.
- **Teksturer i scenen, MB:** et skøn over grafikhukommelsen til teksturerne i scenen (bredde × højde × 4 byte, + 1/3 for mipmaps). Billeder, der er hentet, men ikke er i scenen, og glødens buffere er ikke med. De 35 MB (pc) og 21 MB (tablet) uden kloder er stjernehimlen og omgivelserne.
- **Heap:** JavaScript-hukommelsen efter oprydning (garbage collection). Billederne ligger ikke i heapen, så den siger kun noget om koden og data.
- **Geometrier og teksturer efter:** i menuen igen, efter man har forladt skærmen. Tallene stiger lidt efter et besøg (fx efter Solsystemet fra 23-24 til 35 geometrier). Om det er en lækage, eller om noget bevidst bliver liggende til næste besøg, er ikke undersøgt.

**Pc (1440 × 900)**

| Skærm | Hentet MB (Three/kode/billeder/andet) | Filer | Sek. til alt er hentet | Kald pr. billede | Trekanter / punkter | Geometrier / teksturer | Teksturer i scenen, MB (skøn) | Heap MB før → på → efter | Geometrier / teksturer efter |
|---|---|---|---|---|---|---|---|---|---|
| Starten (menuen) | 4,4 (2,1/2,1/0,0/0,2) | 149 | 5,3 | 31 | 15984 / 5664 | 26 / 23 | 35 | 12,4 |  |
| Atomværkstedet | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 25 | 24 / 2880 | 30 / 27 | 35 | 12,5 → 12,6 → 12,7 | 30 / 27 |
| Byg et molekyle | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 22 | 18 / 2880 | 37 / 28 | 35 | 12,5 → 13,5 → 13,5 | 37 / 28 |
| Det periodiske system | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 256 | 1670 / 2880 | 28 / 141 | 35 | 12,5 → 13,1 → 13,1 | 28 / 141 |
| Stjerneovnen | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 24 | 15860 / 3280 | 29 / 26 | 35 | 12,4 → 12,6 → 12,7 | 30 / 26 |
| Reaktoren | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 27 | 207764 / 4068 | 30 / 27 | 35 | 12,6 → 12,7 → 12,8 | 31 / 27 |
| Batteriet | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 43 | 135442 / 3060 | 43 / 32 | 35 | 12,5 → 12,8 → 12,9 | 44 / 32 |
| Liv | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 37 | 10778 / 4242 | 33 / 25 | 35 | 12,5 → 12,5 → 12,6 | 34 / 25 |
| Ordbogen | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 20 | 18 / 2880 | 26 / 23 | 35 | 12,6 → 12,6 → 12,7 | 44 / 41 |
| Solsystemet (åbner ved Solen) | 10,1 (0,0/0,0/10,1/0,0) | 28 | 6,6 | 19 | 5520 / 2520 | 27 / 24 | 227 | 12,4 → 12,8 → 12,9 | 35 / 24 |
| Kosmos (åbner ved Big Bang) | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 27 | 32 / 2880 | 26 / 24 | 35 | 12,4 → 12,7 → 12,7 | 35 / 24 |
| Mars | 25,4 (0,0/0,0/25,4/0,0) | 46 | 10,5 | 35 | 1062686 / 2520 | 30 / 36 | 329 | 12,6 → 13,6 → 13,6 | 35 / 30 |
| Jupiter | 17,7 (0,0/0,0/17,7/0,0) | 36 | 4,5 | 21 | 49104 / 2520 | 29 / 31 | 593 | 12,5 → 13,2 → 13,4 | 35 / 28 |
| Saturn | 22,6 (0,0/0,0/22,6/0,0) | 38 | 4,6 | 35 | 65048 / 18520 | 42 / 37 | 633 | 12,5 → 13,3 → 13,4 | 35 / 31 |
| Venus | 24,1 (0,0/0,0/24,1/0,0) | 38 | 2,5 | 19 | 52622 / 2520 | 27 / 26 | 291 | 12,5 → 13,0 → 13,1 | 35 / 25 |
| Jorden | 17,5 (0,0/0,0/17,5/0,0) | 34 | 6,5 | 22 | 24210 / 2520 | 29 / 30 | 400 | 12,6 → 12,9 → 13,1 | 35 / 30 |
| Sort hul | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 32 | 37 / 2520 | 29 / 33 | 41 | 12,5 → 12,7 → 12,8 | 35 / 24 |
| Hvorfor går tiden langsommere? | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 20 | 18 / 2880 | 26 / 24 | 35 | 12,4 → 12,7 → 12,7 | 35 / 24 |

**Tablet (1280 × 800, touch, så `LAV_KVALITET` er slået til)**

| Skærm | Hentet MB (Three/kode/billeder/andet) | Filer | Sek. til alt er hentet | Kald pr. billede | Trekanter / punkter | Geometrier / teksturer | Teksturer i scenen, MB (skøn) | Heap MB før → på → efter | Geometrier / teksturer efter |
|---|---|---|---|---|---|---|---|---|---|
| Starten (menuen) | 4,4 (2,1/2,1/0,0/0,2) | 149 | 3,3 | 31 | 6720 / 2711 | 26 / 23 | 21 | 11,0 |  |
| Atomværkstedet | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 25 | 24 / 1420 | 30 / 27 | 21 | 11,2 → 11,3 → 11,4 | 30 / 27 |
| Byg et molekyle | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 22 | 18 / 1420 | 37 / 28 | 21 | 11,2 → 12,2 → 12,3 | 37 / 28 |
| Det periodiske system | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 256 | 1670 / 1420 | 28 / 141 | 21 | 11,2 → 11,8 → 11,9 | 28 / 141 |
| Stjerneovnen | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 24 | 6740 / 1620 | 29 / 26 | 21 | 11,1 → 11,4 → 11,5 | 30 / 26 |
| Reaktoren | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 27 | 59244 / 2618 | 30 / 27 | 21 | 11,0 → 11,3 → 11,4 | 31 / 27 |
| Batteriet | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 43 | 117282 / 1600 | 43 / 32 | 21 | 11,2 → 11,4 → 11,5 | 44 / 32 |
| Liv | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 37 | 10778 / 2047 | 33 / 25 | 21 | 11,3 → 11,3 → 11,5 | 34 / 25 |
| Ordbogen | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 20 | 18 / 1420 | 26 / 23 | 21 | 11,1 → 11,2 → 11,4 | 38 / 35 |
| Solsystemet (åbner ved Solen) | 3,3 (0,0/0,0/3,3/0,0) | 16 | 0,2 | 19 | 2176 / 1260 | 27 / 24 | 85 | 11,2 → 11,4 → 11,6 | 35 / 24 |
| Kosmos (åbner ved Big Bang) | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 27 | 32 / 1420 | 26 / 24 | 21 | 11,1 → 11,4 → 11,5 | 35 / 24 |
| Mars | 18,6 (0,0/0,0/18,6/0,0) | 34 | 5,9 | 36 | 604448 / 1260 | 30 / 36 | 315 | 11,2 → 12,2 → 12,2 | 35 / 30 |
| Jupiter | 8,4 (0,0/0,0/8,4/0,0) | 28 | 1,9 | 21 | 22032 / 1260 | 29 / 32 | 206 | 11,7 → 11,9 → 12,0 | 35 / 29 |
| Saturn | 13,4 (0,0/0,0/13,4/0,0) | 32 | 3,3 | 35 | 65048 / 7260 | 42 / 39 | 320 | 11,3 → 12,0 → 11,9 | 35 / 32 |
| Venus | 13,2 (0,0/0,0/13,2/0,0) | 26 | 1,5 | 19 | 32270 / 1260 | 27 / 26 | 117 | 11,1 → 11,7 → 11,8 | 35 / 25 |
| Jorden | 6,2 (0,0/0,0/6,2/0,0) | 22 | 1,4 | 22 | 24210 / 1260 | 29 / 30 | 131 | 11,1 → 11,6 → 11,6 | 35 / 30 |
| Sort hul | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 32 | 37 / 1260 | 29 / 33 | 23 | 11,1 → 11,4 → 11,5 | 35 / 24 |
| Hvorfor går tiden langsommere? | 0,0 (0,0/0,0/0,0/0,0) | 0 | 0,0 | 20 | 18 / 1420 | 26 / 24 | 21 | 11,2 → 11,4 → 11,5 | 35 / 24 |

## 7. Hvad testbrowseren ikke kan måle
- **Billeder i sekundet og om det hakker:** Testbrowseren tegner med CPU'en (3-6 billeder i sekundet med fuld grafik, uanset skærm), så den siger intet om en rigtig tablet. Farens oplevelse: "Det kører flot og flydende" på Samsung Galaxy Tab A11+ (oktober), og Mars kører fint med 8k-kortet (24. oktober).
- **Varme og batteri** på en tablet.
- **Den rigtige grafikhukommelse:** Skønnet ovenfor er en øvre grænse for teksturerne i scenen. Hvad driveren faktisk bruger, og hvornår en tablet løber tør, kan kun ses på en rigtig enhed.
- **Hvor lang tid det tager over nettet** fra GitHub Pages, og hvordan det føles med fingrene.
- **Opstarten** her er 5,3 sekunder (pc) og 3,3 sekunder (tablet), til menuen er klar på en lokal server uden grafikkort. Det er kun til sammenligning mellem målinger, ikke det, en bruger oplever.
