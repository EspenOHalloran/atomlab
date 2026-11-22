# Prompt: kvalitetstrinnet "Ultra" på stærke telefoner og tablets

*Skrevet 22. november 2026 efter jeres målinger på Samsung A56 (Xclipse 540, 120 Hz) og jeres ønske: "Stadig meget luft. Er der et gear mere for grafikken?" og jeres valg "Sort hul + plan for Ultra". **Model: Opus. Effort: høj.** Sporet er Småting (grafikken bor dér). Kopiér teksten under stregen til en ny session.*

---

Spor: Småting. Navngiv chatten "Småting · Ultra: plan". Tjek først i `origin/main`, at det ikke er lavet (CLAUDE.md, "Parallelle sessioner").

**Læs først:** `docs/lige-nu/smaating.md`, DESIGN.md, `docs/kode/kvalitet.md` (hele), `docs/plan-kvalitetstrin.md` (afsnit 2-4), `docs/retning.md` (budgettet for ydelse og teksturer), tjekliste E (de sidste fem punkter) og `docs/erfaringer/rodaarsager.md` (linjen om værn, der måler billeder i sekundet). Målingerne på A56 står i `docs/ikke-afproevet.md` (Grafik G2 og "Det sorte hul skarpt på touch") og på Tab A11 i `docs/maalinger/tab-a11-2026-11-22.md`.

**Det, målingerne siger:** A56 kører 113-120 billeder/s med Høj overalt, hvor det er målt (Værkstedet, Mars, Stå på Mars, Supernova, Gåderne med det skarpe sorte hul), median 8 ms. Tab A11 er meget svagere (loft 60 uden fingre, 90 med) og må ikke få det dårligere.

**Opgaven: Lav først en plan** (`docs/plan-ultra.md`), og få jeres go, før noget bygges. Planen skal svare på:
1. **Hvad Ultra skruer op for**, med en pris for hvert (ms eller MB) og hvor meget man kan se det på en 6,6" skærm. Kandidater: skarpheden (`pixelRatio`) op til `devicePixelRatio` (A56: 2,625 i stedet for 2, ca. 70 % flere pixel), gløden i fuld opløsning (Høj: halv), Gådernes kantudglatning (MSAA, tjek antal prøver på touch i `js/gaader/kanter.js`), partikler og felter, der i dag følger `LAV_KVALITET` (fx stjernehimlens antal i `scene3d.js`), og teksturer i højere opløsning. Vær ærlig om dem, der næsten ikke kan ses.
2. **Hvordan man kommer op og ned:** samme værn som Høj (`vogtTrin`, `trinGrænser`, `skærmLoft()`, `nyeShadere()`), et trin ad gangen, og et fald, der huskes. Skal Ultra kunne huskes mellem besøg (localStorage, som `atomlabLinseSkarp` i `js/gaader/lys.js`)?
3. **Hvilke skærme** må få Ultra (en ny værdi af `høj` i `SKÆRME`), og om de tunge skærme skal have det.
4. **Hukommelsen:** teksturer og lærred ved 2,625 (A56 brugte op til 577 MB ved Mars).
5. **Målingen bagefter** med `?maal` på A56 og Tab A11 (Tab A11 må aldrig komme i Ultra ved en fejl), og hvilke tests der skal til (5-10 tjek i `tests/grafik.mjs`).

**Rør ikke:** de andre spors filer. `js/scene3d.js` er fælles: Skriv kun i blokken for kvalitetstrinnet, og kør hele samlingen før merge (CLAUDE.md, "Automatiske tests"). Afslut med `/faerdig`.
