# Prompt: Liv L3, forløbet "Kopien"

*Skrevet 10. november 2026, da L2 var færdig. **Skrevet om 14. november 2026** efter Fables drejebog (E10) og Opus' noter: L3 er nu et forløb, ikke en fjerde knap i laboratoriet. Start en ny session med "Læs docs/prompt-liv-l3.md". **Model: Opus. Effort: høj** (plan-liv.md, afsnit 10). L3 har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Liv L3: forløbet Kopien". Byg forløb 3, "Kopien", i Liv efter `docs/drejebog-liv.md`, afsnit 2 og kort 1-3 i afsnit 5. Tjek først i `origin/main`, at det ikke er bygget (CLAUDE.md, "Parallelle sessioner").

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- `docs/drejebog-liv.md`: afsnit 1, 2 og 5 (kort 1-3) og 8. Noterne `docs/fable/E10-liv-noter.md`, afsnit 3, punkt 1-5.
- `docs/retning.md` (budgettet for lagene) og skabelonen `docs/fable/E3-forloeb.md`.
- `docs/kode/liv.md` (hele, især de to forløb og tegningerne) og `docs/kode/forloeb.md` (Forløb-klodsen).
- I `docs/fakta-liv/dna-opskriften.md`: afsnit 4 (kopien), 5 (historien, til kort 1) og 6 (fælderne). Fælderne i `docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md` (de sidste linjer er fra E10).
- Tjekliste B, C, D, E og F.
- I koden: `js/liv-ordene.js` og `js/data/forloeb/ordene.js` (sådan er forløb 2 bygget: delen, trinene, tryk i 3D og `vis`), `js/liv/protein.js` (tilstanden `'ord'`: stigen lige ud med `dnaKugler` og `dnaPinde`) og i `js/liv.js` kun `o2`, `startOrdene` og forløbslisten.

**Det, der skal bygges:**
1. **Forløbet "Kopien"** med fire trin og "Det så du" (drejebogen, afsnit 2). Teksterne i `js/data/forloeb/kopien.js`, delen i `js/liv-kopien.js` (som `js/liv-ordene.js`), og en ny tilstand i `js/liv/protein.js` (fx `'kopi'`): stigen lige ud med 12 trin, en lynlås, man trækker, gamle sider i én farve og nye i en lysere, og skiltet "Her: ca. 1 fejl pr. 30 bogstaver. I dig: under 1 pr. milliard." fra trin 3. Trin 2 er ét bogstav på hver halvdel, og cellen bygger resten. Trin 4: Fejlen bliver siddende senest tredje gang (fast, så testen er stabil). `ROLIG` respekteres.
2. **Hvor det står:** et tredje forløb i `.liv-forløb-liste` med ✓, i `FORLØB` i `js/data/forloeb/liste.js` (efter `ORDENE`), i hjælpen og i "Din fremgang" (som forløb 2). "Næste forløb: Fejlen, der hjalp ›" vises først, når L4 findes.
3. **"Leg frit: Kopien":** lynlåsen og "Kopiér igen" uden trin, med to tal i panelet (farten ca. 25 bogstaver i sekundet ét sted, og ca. 8 år med én lynlås, derfor titusindvis på én gang). Resten af tallene og fagordene helikase, DNA-polymerase og kopigaffel står i "For nørder". **Én ★-opgave:** "Find en mutation, der blev" (`liv-mutation`, jeres valg). Den løses ikke i forløbet.
4. **Kort 1-3** i `js/data/hvorfor.js` (Hvem fandt stigen?, Hvorfor ligner jeg mine forældre, men ikke helt? med "Hvordan kan det blive til 70?" under "For nørder", og Hvordan ved vi, at hver kopi har en gammel og en ny side?). Franklin fortælles ærligt (fælde 7 og 14).
5. **Rettelsen i "Ærligt talt"** i Liv (`index.html`, linje 820: "buler" og "en af de almindeligste fejl") og kommentaren i `js/data/forloeb/opskriften.js` (linje 48), se drejebogen, afsnit 2.
6. **Træk fra:** Panelet i Liv må ikke få mere fremme end budgettet (højst to tal og tre sætninger). Siger noget nyt sig, så sig, hvad der flytter ned.
7. **Tests** i `tests/liv.mjs` eller en ny `tests/liv-kopien.mjs` (5-10 tjek: forløbet starter og når "Det så du", de to sider passer A–T og G–C efter kopien, fejlen bliver siddende senest tredje gang, ★-opgaven kan løses i Leg frit, skærmskift rydder op, ingen rullebjælke ved 1150, 820 og 560 px). `/faktatjek` af alle nye tekster mod faktagrundlaget (antallet af delinger bag de ca. 70 slås op eller skrives uden tal). Linjer i "Ikke afprøvet". Skærmbilleder af scenen på pc og tablet på højkant.
8. **Til sidst:** Status "prøve" i `docs/lige-nu/molekyler.md`, og skriv `docs/prompt-liv-l4.md` (forløbet "Fejlen, der hjalp", drejebogen afsnit 3 og kort 4 og 5).

**Rør ikke:** Gådernes filer, Mars og de andre spors filer. I de fælles kodefiler (`index.html`, `style.css`, `js/main.js`, `js/data/ordbog.js`) kun i Livs blok eller på det sted, hvor linjen hører til.
