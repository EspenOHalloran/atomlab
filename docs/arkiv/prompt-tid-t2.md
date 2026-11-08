# Prompt: Tid og rum, T2 (alle mål, "1 g hele vejen" og afstanden, der skrumper)

*Skrevet 7. november 2026, da T1 var færdig. Start en ny session med "Læs docs/prompt-tid-t2.md". **Model: Opus. Effort: høj.** T2 har brug for sit eget go (se "Trinene" i plan-tid.md). Spørg kun, hvis noget er uklart.*

---

Byg T2 i "Rejsen i tid" efter planen i `docs/plan-tid.md`.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- I `docs/plan-tid.md`: "Trinene" (Rammen og T2), "Fælder, vi skal undgå" og "Spørgsmål til jer efter Trin 0" (jeres svar).
- I `docs/fakta-tid.md`: afsnit 4 (afstandene), 5 (fast fart), 6 (1 g hele vejen, også brændstoffet), 7 (længdeforkortelsen), 11 (kun linjen om Alpha Centauri: en besked hjem tager 4,3 år) og 13 (sammenligningerne med fortiden og "Hvad passer til hvad"). Brug **kun** tal fra fakta-tid.md, og regn efter med `docs/fakta-tid/regn.py`.
- `docs/kode/kosmos.md` (afsnittet om Rejsen i tid), `docs/kode/testadgang.md` (Kosmos), tjekliste C, D, E og F og `docs/erfaringer/fakta-faelder.md`.
- I koden: `js/data/tid.js` og `js/kosmos/tid.js` (hele, de er dine), `tests/tid.mjs` og de dele af `js/faenomenskaerm.js`, du skal bruge (styringen med kontakter og skydere).

**Det, T1 har lavet (7. november 2026):**
- `js/data/tid.js`: γ ud fra antallet af 9-taller (`gamma(n)`, ε = 10⁻ⁿ), `rejse(lysår, n)` med fast fart (giver også `afstandFraSkibet`), tekster (`varighed`, `alderTekst`, `ditUr`, `jordÅrstal`, `dagePåJorden`) og `hjemkomst(skibÅr, jordÅr, startÅr)`. Over 100 år står årstallet og "Din tvilling levede et langt liv" allerede, men sammenligningen med fortiden mangler. `MÅL` har kun `alpha` (4,344 lysår), og `FLEST_NI` er 6.
- `js/kosmos/tid.js`: Scenen (Jorden fra `lavJorden`, Alpha Centauri A og B, skibet og en stiplet vej), skyderen "Fart" (kan skiftes undervejs: urene lægger tiden sammen bid for bid i `rejs`), de to ure i overlaget (`.tid-ure`, CSS-blokken "Rejsen i tid" i style.css), urskiven (én omgang pr. år på Jorden) og lysuret (et 2D-lærred, `tegnLysur`). Skærmens tid følger Jordens tid: `ÅR_PR_SEKUND` = 0,36 år pr. sekund (⏩ 6 gange mere). **Det skal ændres i T2:** Med Mælkevejens centrum (54.000 år) og Andromeda (5 mio. år) kan skærmen ikke følge Jordens tid med samme tempo. Lad fx hver tur tage en fast tid på skærmen (ca. 25 sekunder ud og hjem) uanset målet, og skriv det i "For nørder".

**T2 (se tjeklisten i planen):**
1. **Målene:** Mælkevejens centrum (ca. 27.000 lysår) og Andromedagalaksen (ca. 2,5 mio. lysår) i `MÅL`. Vælg målet, fx med en skyder "Mål" eller tre kontakter (tjek tjekliste D: et sted, man flyver hen til, er ikke en kontakt; spørg, hvis det er uklart). Scenen viser målet (en galakse kan laves med `prikSky`). Skyderen "Fart" går op til 14 ni-taller (γ ≈ 7,1 mio.). Rammer skyderens trin stadig med fingeren med 14 trin (tabletten)? Overvej at vise farten som "99,9…9 % (12 ni-taller)", når den bliver lang.
2. **"1 g hele vejen"** som en kontakt i Styr-boksen: speed op med 1 g til midtvejs og brems med 1 g resten (formlerne i afsnit 6). Så er skyderen "Fart" grå eller skjult. Tiderne: ca. 3,6 år i skibet til Alpha Centauri, ca. 20 år til Mælkevejens centrum og ca. 29 år til Andromeda (én vej). Med 1 g ændrer farten sig undervejs: Vis den største fart midtvejs. Brændstoffet (ca. 40 gange skibets vægt til Alpha Centauri, én vej) kan stå i "Ærligt talt" (det er ellers T3).
3. **"Set fra skibet":** afstanden til målet med to tal (set fra Jorden og set fra skibet, d/γ), og målet rykker tættere i scenen, når farten stiger. Ærligt: Man ville ikke *se* det sådan (afsnit 7).
4. **Hjemkomsten** sammenligner med fortiden (listen i afsnit 13, som den er), når der er gået mere end ca. 100 år, og viser årstallet (fx "år 56.026"). Vælg den nærmeste sammenligning, der er *mindre* end tiden (eller skriv "længere end siden …"). Linjen om tvillingen findes allerede. Én linje ved målet: "En besked hjem tager 4,3 år" (lysets forsinkelse, kan stå i "Lige nu").
5. **Tests:** tallene for 1 g mod tabellen i afsnit 6 og for de nye mål mod afsnit 5, og et lille script (fx `tests/vaerktoejer/tid-tekster.mjs`), der skriver alle hjemkomstteksterne ud (alle mål, farter og 1 g), så de kan læses igennem (tjekliste B). Udvid `tests/tid.mjs`. Kør `node tests/koer-alle.mjs --ændret`. Skærmbilleder på pc, tablet begge veje og telefon (især de store tal i urene: "år 2.502.026").
6. `/faktatjek` på alle nye tekster mod fakta-tid.md, og `/faerdig` til sidst.
7. **"Ikke afprøvet":** Forstår man forskellen på skyderen og 1 g? Er de store tal til at læse? Rammer man skyderens trin?

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `js/kosmos/tid.js`, `js/data/tid.js`, `tests/tid.mjs`, `docs/plan-tid.md`, `docs/fakta-tid.md` og `docs/lige-nu/tid.md`. Du deler `style.css` (kun blokken "Rejsen i tid"), `docs/kode/kosmos.md`, `docs/kode/testadgang.md` og `tests/README.md`: Rør kun dine egne linjer. Rør ikke `js/faenomenskaerm.js` uden at spørge først. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.

**Når T2 er færdig:** Skriv prompten til T3 (`docs/prompt-tid-t3.md`) og hvordan næste session startes (DESIGN.md, "Når et punkt er færdigt").
