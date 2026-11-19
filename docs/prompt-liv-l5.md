# Prompt: Liv L5, delen "Begyndelsen"

*Skrevet 17. november 2026, da L4 ("Fejlen, der hjalp") var færdig. Start en ny session med "Læs docs/prompt-liv-l5.md". **Model: Opus. Effort: høj** (plan-liv.md, afsnit 10). L5 er en stor opgave (en ny del) og har brug for sit eget go. Spørg kun, hvis noget er uklart.*

---

Spor: Molekyler. Navngiv chatten "Molekyler · Liv L5: delen Begyndelsen". Byg delen "Begyndelsen" i verdenen Liv med forløb 5 efter `docs/drejebog-liv.md`, afsnit 4. Tjek først i `origin/main`, at det ikke er bygget (CLAUDE.md, "Parallelle sessioner"). Ud mod brugeren hedder et forløb "tur" (i koden og dokumenterne stadig "forløb").

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- `docs/drejebog-liv.md`: afsnit 1, 4, 6 og 8. Noterne `docs/fable/E10-liv-noter.md`, afsnit 3, punkt 10-12 og 14.
- `docs/retning.md` (budgettet for lagene og "En ny del er færdig, når"), `docs/stilguide.md` (A og B), `docs/plan-verdener.md` (Livs plads) og skabelonen `docs/fable/E3-forloeb.md`.
- `docs/kode/liv-ture.md` (især L4: hvordan en tur med en ny tegning og et laboratorium er bygget) og `docs/kode/forloeb.md`. "Ny del" i CLAUDE.md (`SKÆRME`, en sektion og et link i `.menukort`, et modul med `lav`, `start`, `stop` og `testAdgang`).
- Faktagrundlaget: `docs/fakta-liv/begyndelsen.md` (Miller, luften, Bennu, hinderne, QT45, døgnuret) og Fables tabel i `docs/fable/E10-liv-drejebog.md`, afsnit 4. **Før L5 skal slås op** (drejebogen, afsnit 8): Cleaves m.fl. 2008 og Parker m.fl. 2011 (trin 2: "Ja, men det afhænger af, hvad der ellers er i vandet"), Lane og Martin 2012 (kun resuméet), Gibson 2010 (en bakterie, der levede i forvejen) og QT45-artiklen fra februar 2026 (trin 4, plan-liv.md, afsnit 7). Fælderne i `docs/erfaringer/fakta-faelder-liv.md`. Wikipedia svarer 429: brug `index.php?title=…&action=raw`.
- Tjekliste B, C, D, E og F.
- I koden: `js/liv-fejlen.js`, `js/liv/plade.js` og `js/data/liv/plade.js` (den nyeste tur i Liv: en model uden Three.js med fast frø, en tegning, trin, der bygger videre på hinanden, og et laboratorium), og molekylerne fra `js/molekyle3d.js` (metan, ammoniak og hydrogen i kolben).

**Det, der skal bygges:**
1. **En ny del "Begyndelsen"** i verdenen Liv (en linje i `SKÆRME`, en knap i verdenens kort i menuen og sit eget modul, fx `js/begyndelsen.js`), så Liv har to dele. Forløb 5 med fem trin og "Det så du" (drejebogen, afsnit 4): Millers kolbe med lynet, luften skiftet til CO₂ og nitrogen, fedtstof, der bliver til bobler (hinde), et RNA, der næsten kopierer sig selv, og trappen med fem trin, hvor det øverste ikke kan trykkes færdigt. Teksterne i `js/data/forloeb/begyndelsen.js`.
2. **Hvor det står:** i `FORLØB` i `js/data/forloeb/liste.js`, i hjælpen, i "Din fremgang" og "↻ Tur". Tur 4's veje i `js/liv-fejlen.js` får "Næste: Begyndelsen ›" først (højst tre veje: så går et af kortene ud af vejene, det står stadig i panelet).
3. **Leg frit: kolben og trappen** med ét rigtigt forsøg pr. trin (årstal og kilde), intet "bland ingredienserne". Højst to tal og tre sætninger fremme. Spørg, før der kommer en ★-opgave.
4. **Fire kort** (højst fire fremme ad gangen): "Har nogen lavet liv?", "Kom livet fra rummet?", "Skete det i en dam eller på havbunden?" og "Hvornår skete det?" (døgnuret). Gåden "Hvordan begyndte livet?" får en knap til Begyndelsen (som `liv:protein` i dag, `data-gaa`), men Gådernes tekster rettes kun i den ene linje.
5. **To nye ord i Ordbogen:** hinde og RNA (RNA findes: tjek, at forklaringen passer). Kun på stedet i Livs blok.
6. **Træk fra:** Siger noget nyt sig, så sig, hvad der flytter ned.
7. **Tests** i en ny `tests/begyndelsen.mjs` (5-10 tjek: delen åbner fra menuen, turen starter første gang og når "Det så du", lynet giver farve, det øverste trin kan ikke gøres færdigt, laboratoriet åbner, skærmskift rydder op, ingen rullebjælke ved 1150, 820 og 560 px) og i `ALLE` i `tests/koer-alle.mjs`. Hele samlingen køres til sidst (en ny del rører `js/skaerme.js` og menuen). `/faktatjek` af alle nye tekster. Linjer i "Ikke afprøvet". Skærmbilleder af kolben og trappen på pc og tablet på højkant.
8. **Til sidst:** Status "prøve" i `docs/lige-nu/molekyler.md`, en plads i `docs/plan-verdener.md`, og skriv `docs/prompt-liv-l6.md` (kortet "Hvor sikkert er et spor?" ved Cheyava Falls, drejebogen afsnit 6, en lille opgave).

**Rør ikke:** Mars (L6 skriver senere kun i Cheyava Falls-blokken), Gådernes filer (ud over den ene knap), `js/forloeb.js` (hvis en anden session ejer den, så skriv det, der mangler, i `docs/lige-nu/molekyler.md`) og de andre spors filer. I de fælles kodefiler (`index.html`, `style.css`, `js/main.js`, `js/skaerme.js`, `js/data/ordbog.js`) kun i Livs blok eller på det sted, hvor linjen hører til.
