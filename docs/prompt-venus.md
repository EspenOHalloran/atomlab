# Prompt: Venus bygges (V1-V5)

*Skrevet 9. november 2026 efter jeres svar på planens spørgsmål ("Vi følger dine anbefalinger"). Kopiér teksten nedenfor ind i en **ny session** i sporet Solsystemet. Model: Opus, høj effort. Én session til hele serien: Den bygger én delopgave ad gangen og venter på jeres go mellem hver. Bliver samtalen lang, så start en ny session med samme prompt efter en delopgave (den læser selv status i planen).*

---

Byg Venus efter planen i `docs/plan-venus.md`. Du hører til sporet **Solsystemet og Kosmos** og skriver kun status i `docs/lige-nu/solsystemet.md`. Jeres go er givet til **V1**. Efter hver delopgave stopper du, fortæller kort, hvad der er lavet, og venter på jeres go til den næste (V2, V3, V4, V5). Se under "Status" i planen, hvor langt serien er nået.

**Læs først** (kun det, opgaven bruger, se "Tokens" i CLAUDE.md):
- `docs/lige-nu.md` og `docs/lige-nu/solsystemet.md`.
- Hele `docs/plan-venus.md`, især "Jeres svar" i afsnit 8. **Svarene gælder over resten af planen, hvis de er uenige.**
- `docs/fakta-solsystemet/del7-venus.md` (tallene, kilderne og fælderne).
- Tjekliste E i `docs/tjeklister/` (og C, D eller F, når delopgaven passer).
- Erfaringerne `docs/erfaringer/planeter-og-maaner.md`, `docs/erfaringer/kamera-rejse-flyby.md`, `docs/erfaringer/jupiter.md` (vindene og hentningen) og `docs/erfaringer/staa-paa-mars.md` (kun til V4). `docs/erfaringer/netsider-og-arbejdsgang.md` under "Kilderne til Venus".
- `docs/kode/solsystem.md` og `docs/kode/mars.md`. Venus skal genbruge så meget som muligt: jorden fra Mars (`js/kosmos/mars.js`, `klippeplanet.js` med `lokalt`, "Bjergene 10 gange højere"), skyerne fra Jupiter (`planet.js` med `vind`), disen fra Titan (`atmosfaere.js`) og resten fra de andre planeter (`rejse.js`, `flyby.js`, `navne.js`, `hent.js`, `rejseskilt.js`, og i V4 `panorama.js`).

Er du i tvivl om noget, så spørg, før du bygger det.

**Jeres svar (kort):**
1. **Skyernes kort:** Brugeren åbner `darts.isas.jaxa.jp` før V2, så Akatsukis kort over skyerne i UV kan bruges. Tjek det, når V2 starter, og spørg, hvis det stadig er lukket.
2. **Først ser man Venus, som den ser ud** (lyst gullig hvid og næsten glat). "Ultraviolet (som Akatsuki)" og "Under skyerne" er kontakter.
3. **Under skyerne:** radarens gråtoner tonet orange som lyset dernede, med teksten om, at radaren ikke ser farver.
4. **Stå ved Venera 13:** kun Veneras foto om kameraet, uden et tegnet landskab.
5. **Ned gennem skyerne:** sidste stop på flybyen og en knap ved Venera 13 i træet.
6. **Rækkefølgen:** V1 → V2 → V3 → V4 → V5. V6 (polhvirvlen) kun, hvis brugeren vil.
7. **Venus ligger i Solsystemet fra V1** (før Jorden), selvom den er halvfærdig. Hver delopgave merges til `main` for sig, når testene er grønne (DESIGN.md).

**Andre sessioner kører samtidig** (fx Molekyler, Menuen og Tid og rum). Derfor:
- Ret kun i de filer, delopgaven skal bruge. I fælles kodefiler (`index.html`, `style.css`, `js/main.js`, `js/data/ordbog.js`) skrives kun i jeres egen blok eller dér, hvor linjen hører til.
- Ændringer i fælles moduler (`klippeplanet.js`, `planet.js`, `atmosfaere.js`, `rejse.js`, `flyby.js`, `panorama.js`) skal være valgfrie, så Mars, Jupiter, Saturn og isgiganterne ikke ændres. Kør deres tests (`mars`, `jupiter`, `saturn`, `isgiganter`) bagefter.
- Merge `main` ind, når en delopgave starter, og igen før PR'en. Ret de fælles dokumenter til sidst (CLAUDE.md, "Parallelle sessioner").

**Data:** Domænerne i planen (afsnit 0) var åbne 9. november 2026. Tjek dem med en curl-løkke, før du går i gang. Miljøet kan være lavet om af en anden session. Er et domæne lukket, så spørg, før du arbejder videre. Magellans kort hentes fra USGS' S3-spand (`asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/`), og 225 m-kortet kun i udsnit med `Range` (se erfaringerne). Billedværktøjerne må bruge Python-pakker som `rasterio` eller `tifffile` (pypi er åben). Hent fra Solar System Scope med en ærlig User-Agent. Kilde og licens for hvert billede skrives i `billeder/solsystem/KILDER.md`.

**Fælder at holde øje med** (står i faktagrundlaget, afsnit 9): de to døgn (stjernedøgnet 243,0 døgn, soldøgnet 116,75 døgn, og NSSDC's 243,690 er et forhold), drejningen baglæns (Solen står op i vest), radius 6.051,0 km i USGS' kort mod 6.051,8 km hos NSSDC (højderne regnes fra kortets radius), skyerne kører samme vej som planeten, radarens lys er ruhed og ikke farve, og NASA's kendte Maat Mons-billede er overdrevet 22,5 gange.

**Tests:** `node tests/koer-alle.mjs --ændret` i baggrunden, mens du arbejder og før hver merge, og de tests, der står ved hver delopgave i planen (afsnit 7). Mål billeder i sekundet som i planen (afsnit 6). Skærmbilleder kun af det, der er ændret. Hele testsamlingen og skærmbilleder i alle størrelser efter V5. Brug `/faktatjek` til alle tekster (især V5) og `/faerdig` ved slutningen af hver delopgave.

**Efter hver delopgave:** Opdater `docs/lige-nu/solsystemet.md` (flyt det forrige "Senest lavet" til `docs/arkiv/historik/solsystemet.md`), sæt ✅ ved delopgaven og en kort status i `docs/plan-venus.md`, skriv nye erfaringer i en ny `docs/erfaringer/venus.md` (og en linje i `docs/erfaringer.md`), lav `docs/kode/venus.md` (og sæt den ind i `docs/kode.md`), og skriv det, vi skal prøve på tabletten, i `docs/ikke-afproevet.md`. Skriv til sidst, hvordan næste delopgave bedst startes (DESIGN.md, "Når et punkt er færdigt"). **Når V5 er færdig:** Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket), og flyt denne prompt til `docs/arkiv/`.
