# Spor: Kvantefysik (ny del i verdenen Atomer)

*Startet 20. november 2026 (jeres go 19. november 2026: Kvantefysik forløb 1 rykkes frem før Lys og farver, [koereplan.md](../koereplan.md) punkt 7). Drejebogen er [drejebog-kvantefysik.md](../drejebog-kvantefysik.md) med [Opus' noter (E7)](../fable/E7-kvantefysik-noter.md). Koden står i [kode/kvante.md](../kode/kvante.md). Højst ca. 5 KB.*

**Kernesætningen (delen):** "En elektron breder sig som en bølge, men bliver altid fundet ét sted som en hel partikel. Bølgen bestemmer chancen for hvor." **Det første wow:** striberne, der kommer frem af prikker, der lander tilfældigt. **Noget, man selv finder:** fodbolden i "Større …" giver kun to striber (PR 3).

## Planen for forløb 1 (tre PR'er, et go før hver)
1. ✅ **PR 1, delen og bænken med laboratoriet** (20. november 2026, status "prøve"): kilden, væggen med de to sprækker (et tryk lukker en sprække), bagvæggen med prikkerne, måleren med to lamper og vandet med bølgerne. Venstre panel med fem valg (Skyd med, Sprækker, Afstand, Fart og Måler), og under "Flere indstillinger" bredden og "Vis bølgen". Tre "Hvorfor?"-kort og tre nye ord. Faktatjekket står i [fakta-kvantefysik/faktatjek-baenk.md](../fakta-kvantefysik/faktatjek-baenk.md).
2. ✅ **PR 2, turen "Prikker bliver til striber"** (20. november 2026): de fem trin og "Det så du" med Forløb-klodsen (ringen med "Her: n" i trin 4, lamperne i trin 5), "↻ Tur", at turen starter selv første gang, "Din fremgang" (fjern `kvante` fra `UDEN_FREMGANG` i testen `karrusel`) og tre veje.
3. **PR 3, "Større …" og Gåde-kortet "Hvor stopper kvanteverdenen?"**: molekylet med 2.000 atomer, klumpen med over 7.000 atomer (januar 2026, kilde og dato tjekkes ekstra grundigt) og fodbolden. Kortet med fortolkningerne kun under "For nørder", lyset på skinnen og en knap til bænken. Links: "Se det selv" under `HVORFOR.orbitaler` og fotonen i Ordbogen.

## Valgene (valgt af orkestratoren 2026-11-20, kan ændres af jer)
- Id `kvante`, titlen "Kvantefysik", tredje del i Atomer efter Det periodiske system, status "prøve", et tegnet ikon (prikker i striber).
- "Skyd" virker, mens knappen holdes nede, og det går hurtigere og hurtigere. Et kort tryk skyder ét skud (tastaturet fem).
- Modellen er cos²·sinc² med d = 4a (7 striber i den brede bunke), og prikkerne trækkes med et fast frø, så testen kan regne på mønstret.
- Gåde-kortet får ingen egen 3D-scene: lyset på skinnen og en knap til bænken, som Livets begyndelse (G4e).
- Sammenfiltring venter på forløb 4 (jeres svar 5 i drejebogen og E7 punkt 6), ikke et kort i forløb 1.
- Et go før hver PR (DESIGN.md), og orkestratoren får en kort besked efter hver.

## Senest lavet
**PR 2 (20. november 2026):** Turen "Prikker bliver til striber" med Forløb-klodsen (teksterne i `js/data/forloeb/kvante.js`, faktatjek i [faktatjek-forloeb1.md](../fakta-kvantefysik/faktatjek-forloeb1.md)): kuglerne, vandet, 1.000 elektroner, ringen med "Her: n" (ca. 9 før og 85 efter, når en sprække lukkes) og måleren med lamperne. "Skyd" holdes nede i turens linje. "↻ Tur", turen starter selv første gang, "Din fremgang" og tre veje (Leg frit, fotonen i Ordbogen og `kvanteKigger`). Testen `kvante-forloeb` (11 tjek). Ikke afprøvet: [ikke-afproevet.md](../ikke-afproevet.md) (Kvantefysik).

## Næste
PR 3 ("Større …" og Gåde-kortet). **Go givet** (jeres gennemgang 20. november 2026, "Jeres go" i [orkestrator-status.md](../orkestrator-status.md)): Orkestratoren starter den. Ny session (Opus, høj effort) med prompten:

> Spor: Kvantefysik (ny del i Atomer). Læs docs/lige-nu/kvantefysik.md, docs/kode/kvante.md, docs/drejebog-kvantefysik.md (afsnit 2, 5, 8 og "Jeres svar"), docs/fable/E7-kvantefysik-noter.md (afsnit 3 og 4), docs/fakta-kvantefysik.md (afsnit 1, 6 og 7), docs/kode/gaader.md, tjekliste B, D og F og kvante-fælderne i docs/erfaringer/fakta-faelder.md. Byg PR 3: "Større …" under Skyd med (molekylet med 2.000 atomer, klumpen med over 7.000 atomer fra januar 2026 med kilde og dato tjekket ekstra grundigt, og fodbolden, der kun giver to striber) og Gåde-kortet "Hvor stopper kvanteverdenen?" i js/data/gaader.js (fortolkningerne kun under "For nørder", lyset på skinnen i js/gaader/lys.js, ingen egen scene, seDet til bænken) og links fra `HVORFOR.orbitaler` ("Se det selv") og fotonen i Ordbogen. 5-10 nye tjek, /faktatjek, --ændret i baggrunden, skærmbilleder på telefon og tablet, /faerdig, PR og merge.

## Spørgsmål til jer
Ingen lige nu.
