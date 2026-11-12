# Prompt: Liv L3 (kopien)

*Skrevet 10. november 2026, da L2 var færdig. Start en ny session med "Læs docs/prompt-liv-l3.md". **Model: Opus. Effort: høj** (plan-liv.md, afsnit 10). L3 har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Byg L3 i Liv efter `docs/plan-liv.md`: kopien ("Lyn op og kopiér"), fejlene og "Hvorfor?"-kortene om DNA.

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- I `docs/plan-liv.md`: afsnit 2 ("Kopien", "Hvorfor?"-kortene og "Ærligt talt"), 6, 7 (med "Bygget i L2"), 8 og 9.
- I `docs/fakta-liv/dna-opskriften.md`: afsnit 4 (kopien), 5 (historien, til "Hvem fandt stigen?") og 6 (fælderne). I `docs/fakta-liv/dna-stigen.md` kun det, kortene bruger (fx "skrald", gener og chimpanser), med `grep`.
- `docs/kode/liv.md` (hele), tjekliste B, C, D, E og F og `docs/erfaringer/fakta-faelder.md`.
- I koden: `js/liv.js` (trinet `'protein'` og `opdaterPanel`), `js/liv-protein.js` (sådan er en tilstand med tidsknap, kodehjul og opgaver bygget) og `js/liv/protein.js` (aflæsningen tegner allerede en åben stige med en polymerase: den kan bruges som skabelon). `js/liv/stige.js` kun, hvis kopien skal ske på atomstigen.

**L3 (forslag, ret det i planen, hvis du finder noget bedre):**
1. **Hvor det står:** en fjerde knap i boksen "Fra opskrift til protein" (eller en egen boks "Kopien"), så det stadig passer med fanerne i L4-L6.
2. **Lyn op og kopiér** i 3D: Stigen åbner sig som en lynlås (helikase), nye baser sætter sig på begge halvdele, og der bliver to ens stiger (hver med én gammel og én ny streng). Tidsknappen styrer farten, `ROLIG` respekteres.
3. **Fejlene:** Hver gang man trykker, er der en lille chance for en fejl (gjort meget større end i virkeligheden, og det siges). Polymerasen retter de fleste selv. En fejl, der bliver, er en mutation (link til "Skift et bogstav").
4. **Panelet:** farten (ca. 25 baser i sekundet pr. gaffel hos mennesker, ca. 1.000 hos bakterier), under ca. 1 fejl pr. milliard, ca. 8 år for én gaffel alene, 30.000-50.000 startsteder ("nogle timer", ikke "8 timer") og ca. 70 nye "stavefejl" pr. barn.
5. **"Hvorfor?"-kortene om DNA** (planen, afsnit 2): vælg 3-5 af dem (fx "Hvad er et gen?", "Er det meste af DNA'et skrald?", "Er DNA en tegning af kroppen?", "Hvorfor ligner jeg mine forældre?" og "Hvem fandt stigen?"). Franklin skal fortælles ærligt (fælde 7).
5b. **Naturligt udvalg (jeres valg 12. november 2026 efter Fables E5):** et "Hvorfor?"-kort om, hvordan mutationer og udvalg sammen får livet til at udvikle sig, med seglcellen og malaria som eksempel (findes allerede i `livSegl`), og et kort afsnit i `docs/fakta-liv/dna-opskriften.md` med kilder først. Evolution er en kendsgerning og skrives uden "måske". Mennesker og chimpanser: intet tal i lag 1 (se `dna-stigen.md`, "Fable E5"). Fejlene: G og T kan danne et skævt par ("wobble"), som er en af de almindeligste kopifejl (står i "Ærligt talt" i dag). Læs også afsnit 6 i `docs/fable/E5-liv.md` (rettelser til drejebogen), hvis kopien bliver en del af et forløb.
6. **Opgaver med ★** (fx "Kopiér en stige", "Se en fejl blive rettet" og "Find en mutation, der blev"), tests i `tests/liv.mjs` (5-10 tjek), `/faktatjek` mod faktagrundlaget, nye ord i Ordbogen (fx helikase, DNA-polymerase, kopigaffel), linjer i "Ikke afprøvet" og "Ærligt talt".
7. Til sidst: skriv `docs/prompt-liv-l4.md` (Millers kolbe). Husk, at fanerne Begyndelsen og Liv i rummet kommer i L4-L6.
