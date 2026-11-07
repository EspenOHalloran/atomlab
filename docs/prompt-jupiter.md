# Prompt: Jupiter bygges (J1-J5)

*Skrevet 6. november 2026. Kopiér teksten nedenfor ind i en ny session. Model: Opus, høj effort (J3 kan klares med medium, hvis I vil skifte). Det sorte hul ([arkiv/prompt-sorthul.md](arkiv/prompt-sorthul.md)) er færdigt. Rettelsespakken ([arkiv/prompt-rettelsespakken.md](arkiv/prompt-rettelsespakken.md)) er færdig og har ændret `rejse.flyv`: Grænserne for zoom udvides nu selv, så stoppets afstand ligger inden for (ellers hopper kameraet). Én session til hele Jupiter: Den bygger én delopgave ad gangen og venter på jeres go mellem hver.*

---

Byg Jupiter efter planen i `docs/plan-jupiter.md`. Jeres go er givet til **J1**. Efter hver delopgave stopper du, fortæller kort, hvad der er lavet, og venter på jeres go til den næste (J2, J3, J4, J5). Læs først CLAUDE.md, "Lige nu" (`docs/lige-nu.md`), hele `docs/plan-jupiter.md` (især "Jeres svar" under afsnit 8), "Del 5: Jupiter" i `docs/fakta-solsystemet.md`, tjekliste E i `docs/tjeklister/` (og C, D eller F, når delopgaven passer), erfaringerne `docs/erfaringer/planeter-og-maaner.md`, `docs/erfaringer/jupiter.md` og `docs/erfaringer/kamera-rejse-flyby.md` og `docs/kode/solsystem.md` (Saturn, Jupiter og `js/solsystem/`). Jupiter skal genbruge så meget som muligt fra Saturn (`js/kosmos/saturn.js`, `planet.js`, `ringe.js`, `maane.js`, `rejse.js`, `flyby.js`, `navne.js`). Er du i tvivl om noget, så spørg, før du bygger det.

**Jeres svar (de gælder over planen, hvis de to er uenige):**
1. **Kortet:** "Brug det bedste billede, der giver den flotteste repræsentation af planeten. Som udgangspunkt din anbefaling." Altså OPAL 2025 med farverne stemt af efter Cassini og Cassinis poler. Lav i J1 et billede med OPAL og Cassini side om side (hele kloden og pletten tæt på). Er Cassini tydeligt flottest, så vis os billedet og spørg.
2. **Effekterne:** båndene og pletten, cyklonerne, nordlyset og ringene i modlys. **Io's vulkaner (J6) venter** til månerne-runden.
3. **Månerne:** Io, Europa, Ganymedes og Callisto står som kugler med rigtige kort i deres baner. Tryk og et kort besøg kommer kun med, hvis det er en lille opgave (genbrug fra Saturn), og så i samme kvalitet som Saturns måner. Vurder det ved starten af J3, og spørg, hvis det ikke er lille.
4. **Flybyen har 5 stop:** oversigten, båndene, pletten, sydpolen og "I Jupiters skygge". Stoppet ved Io er udskudt. Månerne kommer med i flybyen, når de er bygget færdige. **J4 byggede de 3 første stop, og J5 tilføjer sydpolen og skyggen** sammen med effekterne (jeres svar 7. november 2026).
5. **Vindene:** den rigtige fart i forhold til Jupiters døgn.
6. **Jupiter ligger i Solsystemet fra J1** (mellem Mars og Saturn), selvom den er halvfærdig. Hver delopgave merges til `main` for sig, når testene er grønne.

**Andre sessioner kører samtidig:** Rettelsespakken retter i `js/kosmos/mars.js` (stoppene ved Tharsis og Hellas og `tilbageFraLandskab`), `js/kosmos/jordkloden.js`, `style.css` og måske `js/solsystem/rejse.js` og `flyby.js`. Det sorte hul retter i `js/kosmos/sorthul.js`. Derfor:
- Ret ikke i `rejse.js` og `flyby.js` i J1. Skal J2 eller J4 ændre dem, så hent `main` først, og byg oven på den nyeste udgave.
- Når du flytter `hent` ud af `mars.js` og `saturn.js` (J1), så rør kun de linjer, der skal ændres i `mars.js`.
- Før hver merge: `git fetch origin main` og flet `main` ind. Løs konflikter (især i "Lige nu", `docs/lige-nu.md`, hvor alle sessioner skriver), og kør `node tests/koer-alle.mjs --ændret` igen bagefter.

**Data:** `archive.stsci.edu` (OPAL) og `assets.science.nasa.gov` (Cassini) er åbne. curl til STScI kræver Mozillas rodliste (`certifi`), se fælderne i planen. Er et domæne lukket, så spørg, før du arbejder videre. Kilde og licens for hvert billede skrives i `billeder/solsystem/KILDER.md`.

**Tests:** `node tests/koer-alle.mjs --ændret`, mens du arbejder og før hver merge, og de tests, der står ved hver delopgave i planen (afsnit 7). Mål billeder i sekundet som i planen (afsnit 6). Hele testsamlingen og skærmbilleder i alle størrelser efter J5. Brug `/faktatjek` til alle tekster (J4) og `/faerdig` ved slutningen af hver delopgave.

**Efter hver delopgave:** Opdater "Lige nu" (`docs/lige-nu.md`) (flyt det forrige "Senest lavet" til docs/arkiv/historik.md), sæt ✅ ved delopgaven i `docs/plan-jupiter.md`, skriv nye erfaringer i den rigtige fil i `docs/erfaringer/`, hold `docs/kode/solsystem.md` opdateret, og skriv det, vi skal prøve på tabletten, i `docs/ikke-afproevet.md`. Opdater artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe, læs det først, og behold linket). Når J5 er færdig, flyttes denne prompt til `docs/arkiv/`.
