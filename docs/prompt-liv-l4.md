# Prompt: Liv L4, turen "Fejlen, der hjalp"

*Skrevet 17. november 2026, da L3 ("Kopien") var færdig. Start en ny session med "Læs docs/prompt-liv-l4.md". **Model: Opus. Effort: høj** (plan-liv.md, afsnit 10). L4 har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Liv L4: turen Fejlen, der hjalp". Byg forløb 4, "Fejlen, der hjalp", i Liv efter `docs/drejebog-liv.md`, afsnit 3 og kort 4 og 5 i afsnit 5. Tjek først i `origin/main`, at det ikke er bygget (CLAUDE.md, "Parallelle sessioner"). Ud mod brugeren hedder et forløb "tur" (i koden og dokumenterne stadig "forløb").

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- `docs/drejebog-liv.md`: afsnit 1, 3, 5 (kort 4 og 5) og 8. Noterne `docs/fable/E10-liv-noter.md`, afsnit 3, punkt 6-9 og 13.
- `docs/retning.md` (budgettet for lagene), `docs/stilguide.md` (B) og skabelonen `docs/fable/E3-forloeb.md`.
- `docs/kode/liv.md` (især turene 2 og 3, "Kopien") og `docs/kode/forloeb.md` (Forløb-klodsen, også det, sessionen med forløbet som sti har lagt til).
- Faktagrundlaget: `docs/fakta-liv/dna-opskriften.md`, afsnit 4 og 6 (fælde 10 og 11), og Fables tabel i `docs/fable/E10-liv-drejebog.md`, afsnit 4. **Før L4 skal slås op:** Baym m.fl. 2016 (pladen, 3.000 gange og ca. 10 dage) og Luria og Delbrück 1943 (kun via Wikipedia). Fælderne i `docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md` (linjerne fra E10).
- Tjekliste B, C, D, E og F.
- I koden: `js/liv-kopien.js` og `js/data/forloeb/kopien.js` (sådan er tur 3 bygget: delen, trinene, tryk og træk i 3D, "Vis mig", der gør hele trinet, og laboratoriet med panelet), og i `js/liv.js` kun `o3`, `startKopien`, `visForfra`, `efterTur`, `opdaterPanel` og turlisten.

**Det, der skal bygges:**
1. **Turen "Fejlen, der hjalp"** med fire trin og "Det så du" (drejebogen, afsnit 3). Teksterne i `js/data/forloeb/fejlen.js`, delen i `js/liv-fejlen.js` og pladen som en ny tegning (fx `js/liv/plade.js`): én InstancedMesh eller et 2D-lærred, en fast tilfældighed (stabile tests) og færre prikker med `LAV_KVALITET`. Bakterierne med fejlen har en anden farve, også i feltet uden medicin (trin 4). `ROLIG` respekteres.
2. **Hvor det står:** en fjerde tur i `.liv-forløb-liste` med ✓, i `FORLØB` i `js/data/forloeb/liste.js` (efter `KOPIEN`), i hjælpen og i "Din fremgang". **Tur 3's veje:** "Næste tur: Fejlen, der hjalp ›" bliver den første vej, og kortet "Hvorfor ligner jeg mine forældre?" går ud af vejene (det står stadig ved Cellekernen). Der må højst være tre veje.
3. **"Leg frit: pladen"** med højst to tal og tre sætninger fremme, resten i "For nørder". Én ★-opgave, hvis den giver mening (spørg, før der kommer flere).
4. **Kort 4 og 5** i `js/data/hvorfor.js` ("Sker det også hos mennesker?" og "Hvorfor kan de fleste danskere tåle mælk?"). **Træk fra:** Den sidste sætning under "For nørder" i `livSegl` ("Derfor er genet almindeligt …") flyttes til kort 4, og `livSegl` linker til kortet (`næste`).
5. **To nye ord i Ordbogen:** antibiotika og naturligt udvalg (`js/data/ordbog.js`, kun på stedet efter alfabetet).
6. **Træk fra:** Panelet i Liv må ikke få mere fremme end budgettet. Siger noget nyt sig, så sig, hvad der flytter ned.
7. **Tests** i en ny `tests/liv-fejlen.mjs` (5-10 tjek: turen starter og når "Det så du", et tryk ved kanten tæller, fejlen findes i feltet uden medicin, laboratoriet åbner med panelet, skærmskift rydder op, ingen rullebjælke ved 1150, 820 og 560 px) og i `ALLE` i `tests/koer-alle.mjs`. `/faktatjek` af alle nye tekster. Linjer i "Ikke afprøvet". Skærmbilleder af pladen på pc og tablet på højkant.
8. **Til sidst:** Status "prøve" i `docs/lige-nu/molekyler.md`, og skriv `docs/prompt-liv-l5.md` (delen "Begyndelsen", drejebogen afsnit 4).

**Rør ikke:** Gådernes filer, Mars, `js/forloeb.js` (hvis en anden session ejer den, så skriv det, der mangler, i `docs/lige-nu/molekyler.md`) og de andre spors filer. I de fælles kodefiler (`index.html`, `style.css`, `js/main.js`, `js/data/ordbog.js`) kun i Livs blok eller på det sted, hvor linjen hører til.
