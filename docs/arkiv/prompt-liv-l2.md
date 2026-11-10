# Prompt: Liv L2 (fra opskrift til protein)

*Skrevet 9. november 2026, da L1 var færdig. Start en ny session med "Læs docs/prompt-liv-l2.md". **Model: Opus. Effort: høj** (plan-liv.md, afsnit 10). L2 har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Byg L2 i Liv efter `docs/plan-liv.md`: fra opskrift til protein (aflæsningen, ribosomet, kodehjulet og "Læs selv" med genet HBB og mutationerne).

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- I `docs/plan-liv.md`: afsnit 2 ("Fra opskrift til protein" og "Ærligt talt"), 6, 7, 8 og 9.
- I `docs/fakta-liv.md`: "Opus' egne opslag" (HBB med de første ti kodoner og seglcellen, bogstaverne til "Skriv LIV"). I `docs/fakta-liv/dna-opskriften.md`: afsnittene om koden, aflæsningen, ribosomet og mutationerne.
- `docs/kode/liv.md` (hele, den er kort), tjekliste B, C, D og F og `docs/erfaringer/fakta-faelder.md`.
- I koden: `js/liv.js` (hvordan trinene, panelet og opgaverne er bygget) og `js/data/liv/opskriften.js`. `js/liv/stige.js` kun, hvis RNA'et skal tegnes som en halv stige (`sætBygget` viser, hvordan kun den ene streng tegnes).

**L2 (forslag, ret det i planen, hvis du finder noget bedre):**
1. **Data uden Three.js:** `js/data/liv/kode.js` (de 64 kodoner: 61 aminosyrer og 3 stop, AUG er methionin) og `js/data/liv/gener.js` (stykket af HBB med kilden NM_000518.5). Tests: 64 kodoner med 3 stop, de ni første kodoner giver MVHLTPEEK, og GAG → GTG i kodon 7 giver V.
2. **Hvor det står:** Liv har kun fanen Opskriften (ingen faner endnu). L2 kan blive et nyt trin efter Atomerne eller en knap "Læs genet" ved Stigen. Det skal passe med fanerne Begyndelsen og Liv i rummet, som kommer i L4-L6.
3. **Aflæsningen og ribosomet** i 3D: RNA-kopien (U i stedet for T), ribosomet, der læser tre bogstaver ad gangen, og kæden, der vokser. Tidsknappen (`lavTidsknap`) styrer farten. `ROLIG` respekteres.
4. **Kodehjulet** og **"Læs selv"** med opgaverne med ★ (de første 9 ord, seglcellen, et skift, der ikke gør noget, og et stop for tidligt). "Skriv LIV med aminosyrer" som ekstra.
5. **Tekster:** `/faktatjek` mod faktagrundlaget, nye ord i Ordbogen (fx gen, protein, aminosyre, kodon, RNA, ribosom, mutation), linjer i "Ikke afprøvet" og "Ærligt talt" (RNA'et klippes til før det forlader kernen, ribosomet er forenklet).
6. Til sidst: skriv `docs/prompt-liv-l3.md` (kopien).
