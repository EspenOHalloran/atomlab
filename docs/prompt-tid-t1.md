# Prompt: Tid og rum, T1 (lysuret og rejsen til Alpha Centauri)

*Skrevet 7. november 2026 efter jeres svar ("Go. Følg dine anbefalinger"). Start en ny session med "Læs docs/prompt-tid-t1.md". **Model: Opus. Effort: høj.** Go til T1 er givet. Spørg kun, hvis noget er uklart.*

---

Byg T1 i "Rejsen i tid" efter planen i `docs/plan-tid.md`.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- I `docs/plan-tid.md`: "Hovedidéen", "Trinene" (Rammen og T1), "Fælder, vi skal undgå" og "Spørgsmål til jer efter Trin 0" (jeres svar).
- I `docs/fakta-tid.md`: afsnit 2 (gammafaktoren), 3 (lysuret), 4 (afstandene), 5 (fast fart), 6 (kun den sidste linje om de ca. 11.500 g) og 9 (tvillingeparadokset, til "Ærligt talt"). Brug **kun** tal fra fakta-tid.md. Alpha Centauri er ca. 4,3 lysår væk (4,344), ikke 4,4.
- `docs/kode/kosmos.md` og `docs/kode/testadgang.md` (afsnittet om Kosmos), tjekliste C, D, E og F i `docs/tjeklister/` og `docs/erfaringer/fakta-faelder.md`. Læs også de erfaringer i `docs/erfaringer/`, der passer (fx tests og skærme). Brug `grep`, og læs ikke hele filer, du ikke skal bruge.
- I koden: `js/kosmos/rumtid.js` (et lille fænomen fra start til slut) og de dele af `js/faenomenskaerm.js`, du skal bruge (kommentaren øverst, faserne med `fase`, styringen med skydere og kontakter, `trin()` og testadgangen `fænomen()`). Kig i et fænomen med faser og en skyder (fx `js/kosmos/hviddvaerg.js` eller `aarstider.js`), og brug byggeklodserne i `js/kosmos/faelles.js`.

**Jeres svar (7. november 2026, de gælder over planen):**
1. **Skyderen** giver fast fart (vi springer over, hvordan man kommer op i fart). Det skal siges ærligt i underteksten eller panelet: Det ville kræve en knusende acceleration, og med 1 g tager turen år. Kontakten "1 g hele vejen" kommer først i T2.
2. **Urene:** To store digitale ure, "Dit ur" (dage og år siden afgang) og "Jordens ur" (som årstal, fra år 2026). Under dem står begges alder. Jordens ur får også en lille urskive, hvor viseren drøner rundt.
3. **Tvillingen:** I er begge 13 år ved afgang. Op til ca. 100 år står tvillingens alder ("Du er 13 år og 45 dage. Din tvilling er 21."). Derover står årstallet og en sammenligning med fortiden og kun en kort, rolig linje om tvillingen ("Din tvilling levede et langt liv, mens du var væk"). I T1 (kun Alpha Centauri) bliver det aldrig over 100 år, men lav regningen, så den virker i T2.
4. Skyderen går op til 14 ni-taller i T2. I T1 går den fra 90 % til 99,9999 % (1-6 ni-taller).
5. Listen over sammenligninger med fortiden (fakta-tid.md, afsnit 13) bruges, som den er, fra T2.

**T1 (se tjeklisten i planen):**
- `js/data/tid.js` uden Three.js: gammafaktoren ud fra antallet af 9-taller (γ = 1/√(ε(2 − ε)), ε = 10⁻ⁿ), rejsen med fast fart ud og hjem (tiden på Jorden og i skibet) og teksten ved hjemkomsten. Tallene skal give det samme som tabellerne i fakta-tid.md (90 % → γ 2,294, 99,9999 % → 707,1; Alpha Centauri ved 99,99 % ud og hjem: ca. 45 dage i skibet og 8,7 år på Jorden).
- `js/kosmos/tid.js`, "Rejsen i tid" (ikon ⏳), med Jorden, skibet og Alpha Centauri under stjernehimlen, skyderen "Fart" og rejsen i faser (afgang, ude ved målet, vende om og hjemkomst). Urene står i et HTML-lag oven på 3D-billedet. Tiden kan spoles med ⏩, og pausen virker (brug `dt` og `tid` fra `opdater`).
- Handlingen "⏱ Vis lysuret": to lysure side om side, i skibet (lyset hopper lige op og ned) og set fra Jorden (zigzag, spejlene flytter sig). Farten følger skyderen. Ved høje farter bliver zigzaggen meget flad. Vis det, så det stadig kan ses (fx ved at lade spejlene glide forbi), og skriv i "For nørder" eller "Ærligt talt", hvad animationen snyder med.
- Teksten "kort", to emner og et første "Ærligt talt" (skyderen springer accelerationen over, og du mærker intet om bord). Undertekster under ca. 160 tegn med pointen først (tjekliste B). Fagord forklares første gang (fx *lysår*, der findes i Ordbogen, og *tidsforlængelse*, der kommer i Ordbogen i T3).
- Indsæt fænomenet i listen i `js/kosmos.js` lige efter `rumtid`. Det er kun den ene linje og importen, for filen hører til sporet Solsystemet og Kosmos.
- **Tests:** En ny `tests/tid.mjs` med Node-tjek af `js/data/tid.js` (tallene ovenfor) og en Playwright-del: Fænomenet åbner uden konsolfejl, skyderen ændrer urene, "Vis lysuret" virker, og en rejse spolet frem ender ved hjemkomsten med den rigtige tekst. Sæt den ind i listen og i opslaget i `tests/koer-alle.mjs` (`js/kosmos/tid.js` og `js/data/tid.js` → `tid`). Testadgang under `atomlabTest.kosmos.fænomen()`, skrevet i `docs/kode/testadgang.md`. Kør `node tests/koer-alle.mjs --ændret` (`js/kosmos.js` kan få den til at vælge `kosmos` og `kosmos-nye` med, og de skal bestå). Skærmbilleder af det nye fænomen på pc, tablet på højkant og på langs og telefon.
- `/faktatjek` på alle tekster med tal, mod fakta-tid.md. `/faerdig` til sidst.
- **"Ikke afprøvet"** (`docs/ikke-afproevet.md`): Kan urene læses på tabletten begge veje, rammer man skyderens trin med fingeren, kører lysuret glat, og forstår man zigzaggen?

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `js/kosmos/tid.js`, `js/data/tid.js`, `tests/tid.mjs`, `docs/plan-tid.md`, `docs/fakta-tid.md` og `docs/lige-nu/tid.md`. Du deler `js/kosmos.js`, `tests/koer-alle.mjs`, `style.css` (kun en ny blok for urene, hvis de ikke kan laves med det, der findes), `docs/kode/kosmos.md` og `docs/kode/testadgang.md`: Rør kun dine egne linjer. Rør ikke `js/faenomenskaerm.js` uden at spørge først, og rør ikke de andre fænomener eller de andre spors filer i `docs/lige-nu/`. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves. Kør `--ændret` igen bagefter.

**Når T1 er færdig:** Skriv prompten til T2 (`docs/prompt-tid-t2.md`) og hvordan næste session startes (DESIGN.md, "Når et punkt er færdigt").
