# Prompt: Uranus og Neptun bygges (UN1-UN5)

*Skrevet 7. november 2026 efter jeres svar på planens spørgsmål ("For øvrige spørgsmål følger vi dine anbefalinger. Skriv prompten."). Kopiér teksten nedenfor ind i en **ny session** i sporet Solsystemet. Model: Opus, høj effort (UN4 kan klares med medium). Én session til hele serien: Den bygger én delopgave ad gangen og venter på jeres go mellem hver. Bliver samtalen lang, så start en ny session med samme prompt efter en delopgave (den læser selv status i planen).*

---

Byg Uranus og Neptun efter planen i `docs/plan-uranus-neptun.md`. Du hører til sporet **Solsystemet og Kosmos** og skriver kun status i `docs/lige-nu/solsystemet.md`. Jeres go er givet til **UN1**. Efter hver delopgave stopper du, fortæller kort, hvad der er lavet, og venter på jeres go til den næste (UN2, UN3, UN4, UN5). Se under "Status" i planen, hvor langt serien er nået.

**Læs først** (kun det, opgaven bruger, se "Tokens" i CLAUDE.md):
- `docs/lige-nu.md` og `docs/lige-nu/solsystemet.md`.
- Hele `docs/plan-uranus-neptun.md`, især "Jeres svar" og "Måner, der kan støde sammen" i afsnit 8. **Svarene gælder over resten af planen, hvis de er uenige.**
- `docs/fakta-solsystemet/del6-uranus-og-neptun.md` (tallene, kilderne og fælderne).
- Tjekliste E i `docs/tjeklister/` (og C, D eller F, når delopgaven passer).
- Erfaringerne `docs/erfaringer/uranus-neptun.md`, `docs/erfaringer/jupiter.md`, `docs/erfaringer/planeter-og-maaner.md` og `docs/erfaringer/kamera-rejse-flyby.md`.
- `docs/kode/solsystem.md` og `docs/kode/jupiter.md`. Uranus og Neptun skal genbruge så meget som muligt fra Jupiter og Saturn (`js/kosmos/jupiter.js`, `planet.js`, `ringe.js`, `maane.js`, `maanestr.js`, `rejse.js`, `flyby.js`, `navne.js`, `hent.js`, `rejseskilt.js`).

Er du i tvivl om noget, så spørg, før du bygger det.

**Jeres svar (kort):**
1. **Rækkefølgen:** UN1 laver begge kloder og skelettet, så Uranus' årstider og ringe (UN2), Neptuns vejr og ringbuer (UN3), Uranus' måner (UN4) og flybyerne, træet og siderne (UN5).
2. **Farverne:** de ægte farver (regnet fra OPAL's FITS og tjekket mod Irwin m.fl. 2024) som standard og kontakten "Voyagers farver (1989)".
3. **Neptun:** som i 2025, og kontakten "Neptun i 1989" med Den Store Mørke Plet.
4. **Uranus' måner:** "Lav Uranus' måner, hvis du kan." Led først efter færdige globale kort med fri licens. Skal det bruge et domæne, der ikke er åbent (fx `commons.wikimedia.org` eller `www.lpi.usra.edu`), så spørg først. Findes der ingen, så lav kortene af Voyagers fotos (PDS Rings, `VGISS_7xxx`, eller Photojournal), og lad den nordlige halvdel være en blød grå flade, som siden kalder "aldrig fotograferet". Cressida, Desdemona, Cupid og Belinda kommer med som små klumper (jeres spørgsmål om måner, der kan støde sammen).
5. **Neptuns måner venter** til månerne-runden. Ingen Triton nu. Neptuns stop 4 er ringbuerne i modlys.
6. **Skyderen "År"** ved Uranus fra 1986 til 2070, som kun flytter Solen.
7. **Planeterne ligger i Solsystemet fra UN1** (efter Saturn), selvom de er halvfærdige. Hver delopgave merges til `main` for sig, når testene er grønne (DESIGN.md).

**Andre sessioner kører samtidig** (fx Molekyler, Menuen og Tid og rum). Derfor:
- Ret kun i de filer, delopgaven skal bruge. I fælles kodefiler (`index.html`, `style.css`, `js/main.js`, `js/data/ordbog.js`) skrives kun i jeres egen blok eller dér, hvor linjen hører til.
- Ændringer i fælles moduler (`planet.js`, `ringe.js`, `rejse.js`, `flyby.js`) skal være valgfrie, så Saturn og Jupiter ikke ændres. Kør deres tests (`saturn`, `jupiter`) bagefter.
- Merge `main` ind, når en delopgave starter, og igen før PR'en. Ret de fælles dokumenter til sidst (CLAUDE.md, "Parallelle sessioner").

**Data:** Domænerne i planen (afsnit 0) var åbne 7. november 2026. Tjek dem med en curl-løkke, før du går i gang. Miljøet kan være lavet om af en anden session. Er et domæne lukket, så spørg, før du arbejder videre. `archive.stsci.edu` kræver emSign-roden fra en ældre `certifi` (se `docs/erfaringer/netsider-og-arbejdsgang.md`). Spørg brugeren, før du gør det, for den automatiske sikkerhedskontrol stopper det ellers. Hent fra Solar System Scope med en ærlig User-Agent. Kilde og licens for hvert billede skrives i `billeder/solsystem/KILDER.md`.

**Fælder at holde øje med** (står i faktagrundlaget): retningen af Uranus' vinde (IAU's "vest" er "med drejningen"), OPAL's længdegrader (Uranus har 0° øst i højre kant, Neptun 360° vest i venstre kant), planetografisk bredde på en fladtrykt kugle (se fælden fra Jupiter i `plan-jupiter.md`), Uranus' solhverv (2030 ifølge Horizons) og antallet af måner (29 og 16 med dato).

**Tests:** `node tests/koer-alle.mjs --ændret` i baggrunden, mens du arbejder og før hver merge, og de tests, der står ved hver delopgave i planen (afsnit 7). Mål billeder i sekundet som i planen (afsnit 6). Skærmbilleder kun af det, der er ændret. Hele testsamlingen og skærmbilleder i alle størrelser efter UN5. Brug `/faktatjek` til alle tekster (især UN5) og `/faerdig` ved slutningen af hver delopgave.

**Efter hver delopgave:** Opdater `docs/lige-nu/solsystemet.md` (flyt det forrige "Senest lavet" til `docs/arkiv/historik/solsystemet.md`), sæt ✅ ved delopgaven og en kort status i `docs/plan-uranus-neptun.md`, skriv nye erfaringer i `docs/erfaringer/uranus-neptun.md`, hold `docs/kode/solsystem.md` opdateret (eller lav `docs/kode/isgiganter.md`, og sæt den ind i `docs/kode.md`), og skriv det, vi skal prøve på tabletten, i `docs/ikke-afproevet.md`. Skriv til sidst, hvordan næste delopgave bedst startes (DESIGN.md, "Når et punkt er færdigt"). **Når UN5 er færdig:** Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket), og flyt denne prompt til `docs/arkiv/`.
