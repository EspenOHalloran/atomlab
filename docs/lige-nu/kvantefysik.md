# Spor: Kvantefysik (ny del i verdenen Atomer)

*Startet 20. november 2026 (jeres go 19. november 2026: Kvantefysik forløb 1 rykkes frem før Lys og farver, [koereplan.md](../koereplan.md) punkt 7). Drejebogen er [drejebog-kvantefysik.md](../drejebog-kvantefysik.md) med [Opus' noter (E7)](../fable/E7-kvantefysik-noter.md). Koden står i [kode/kvante.md](../kode/kvante.md). Højst ca. 5 KB.*

**Kernesætningen (delen):** "En elektron breder sig som en bølge, men bliver altid fundet ét sted som en hel partikel. Bølgen bestemmer chancen for hvor." **Det første wow:** striberne, der kommer frem af prikker, der lander tilfældigt. **Noget, man selv finder:** fodbolden i "Større …" giver kun to striber (PR 3).

## Planen for forløb 1 (tre PR'er, et go før hver)
1. ✅ **PR 1, delen og bænken med laboratoriet** (20. november 2026, status "prøve"): kilden, væggen med de to sprækker (et tryk lukker en sprække), bagvæggen med prikkerne, måleren med to lamper og vandet med bølgerne. Venstre panel med fem valg (Skyd med, Sprækker, Afstand, Fart og Måler), og under "Flere indstillinger" bredden og "Vis bølgen". Tre "Hvorfor?"-kort og tre nye ord. Faktatjekket står i [fakta-kvantefysik/faktatjek-baenk.md](../fakta-kvantefysik/faktatjek-baenk.md).
2. **PR 2, turen "Prikker bliver til striber"**: de fem trin og "Det så du" med Forløb-klodsen (ringen med "Her: n" i trin 4, lamperne i trin 5), "↻ Tur", at turen starter selv første gang, "Din fremgang" (fjern `kvante` fra `UDEN_FREMGANG` i testen `karrusel`) og tre veje.
3. **PR 3, "Større …" og Gåde-kortet "Hvor stopper kvanteverdenen?"**: molekylet med 2.000 atomer, klumpen med over 7.000 atomer (januar 2026, kilde og dato tjekkes ekstra grundigt) og fodbolden. Kortet med fortolkningerne kun under "For nørder", lyset på skinnen og en knap til bænken. Links: "Se det selv" under `HVORFOR.orbitaler` og fotonen i Ordbogen.

## Valgene (valgt af orkestratoren 2026-11-20, kan ændres af jer)
- Id `kvante`, titlen "Kvantefysik", tredje del i Atomer efter Det periodiske system, status "prøve", et tegnet ikon (prikker i striber).
- "Skyd" virker, mens knappen holdes nede, og det går hurtigere og hurtigere. Et kort tryk skyder ét skud (tastaturet fem).
- Modellen er cos²·sinc² med d = 4a (7 striber i den brede bunke), og prikkerne trækkes med et fast frø, så testen kan regne på mønstret.
- Gåde-kortet får ingen egen 3D-scene: lyset på skinnen og en knap til bænken, som Livets begyndelse (G4e).
- Sammenfiltring venter på forløb 4 (jeres svar 5 i drejebogen og E7 punkt 6), ikke et kort i forløb 1.
- Et go før hver PR (DESIGN.md), og orkestratoren får en kort besked efter hver.

## Senest lavet
**PR 1 (20. november 2026):** Delen Kvantefysik med bænken og laboratoriet. Testen `kvante` (12 tjek). Ikke afprøvet: [ikke-afproevet.md](../ikke-afproevet.md) (Kvantefysik).

## Næste
PR 2 (turen) og så PR 3 ("Større …" og Gåde-kortet). **Venter på et nyt go fra jer** (20. november 2026: De kørende sessioner gøres færdige, og der startes ikke nyt). Start en ny session (Opus, høj effort) med prompten:

> Spor: Kvantefysik (ny del i Atomer). Læs docs/lige-nu/kvantefysik.md, docs/kode/kvante.md, docs/drejebog-kvantefysik.md (afsnit 3, 5, 8 og "Jeres svar"), docs/fable/E7-kvantefysik-noter.md (afsnit 3), docs/kode/forloeb.md, tjekliste B, C, D og F og kvante-fælderne i docs/erfaringer/fakta-faelder.md. Byg PR 2: turen "Prikker bliver til striber" med Forløb-klodsen (teksterne i js/data/forloeb/kvante.js, de fem trin og "Det så du" som i drejebogen afsnit 3 med E7-rettelserne: trin 5 giver ÉN bred bunke, ikke "som kuglerne", og højst to sætninger pr. tekst). Brug `kø` og `køFart` i js/kvante.js til "elektronerne fortsætter af sig selv", ringen med "Her: n" ved `mørktSted()` i trin 4 og lamperne i trin 5. "↻ Tur" (`lavTurKnap`), turen starter selv første gang, "Din fremgang" (`ud.kvante` med `slags: 'ture'` i js/main.js, og fjern `kvante` fra `UDEN_FREMGANG` i tests/karrusel.mjs), tre veje (Leg frit, fotonen i Ordbogen og kortet `kvanteKigger`). Testen kvante-forloeb (5-10 tjek), /faktatjek, --ændret i baggrunden, skærmbilleder på telefon og tablet, /faerdig, PR og merge. Bagefter, med et nyt go: PR 3, "Større …" (2.000 atomer, klumpen med over 7.000 atomer fra januar 2026 med kilde og dato tjekket ekstra grundigt, og fodbolden) og Gåde-kortet "Hvor stopper kvanteverdenen?" i js/data/gaader.js (fortolkningerne kun under "For nørder", lyset på skinnen i js/gaader/lys.js, ingen egen scene, seDet til bænken) og links fra `HVORFOR.orbitaler` og fotonen i Ordbogen.

## Spørgsmål til jer
Ingen lige nu.
