# Spor: Kvantefysik (ny del i verdenen Atomer)

*Startet 20. november 2026 (jeres go 19. november 2026: Kvantefysik forløb 1 rykkes frem før Lys og farver, [koereplan.md](../koereplan.md) punkt 7). Drejebogen er [drejebog-kvantefysik.md](../drejebog-kvantefysik.md) med [Opus' noter (E7)](../fable/E7-kvantefysik-noter.md). Koden står i [kode/kvante.md](../kode/kvante.md). Højst ca. 5 KB.*

**Kernesætningen (delen):** "En elektron breder sig som en bølge, men bliver altid fundet ét sted som en hel partikel. Bølgen bestemmer chancen for hvor." **Det første wow:** striberne, der kommer frem af prikker, der lander tilfældigt. **Noget, man selv finder:** fodbolden i "Større …" giver kun to striber (PR 3).

## Planen for forløb 1 (tre PR'er, et go før hver)
1. ✅ **PR 1, delen og bænken med laboratoriet** (20. november 2026, status "prøve"): kilden, væggen med de to sprækker (et tryk lukker en sprække), bagvæggen med prikkerne, måleren med to lamper og vandet med bølgerne. Venstre panel med fem valg (Skyd med, Sprækker, Afstand, Fart og Måler), og under "Flere indstillinger" bredden og "Vis bølgen". Tre "Hvorfor?"-kort og tre nye ord. Faktatjekket står i [fakta-kvantefysik/faktatjek-baenk.md](../fakta-kvantefysik/faktatjek-baenk.md).
2. ✅ **PR 2, turen "Prikker bliver til striber"** (20. november 2026): de fem trin og "Det så du" med Forløb-klodsen (ringen med "Her: n" i trin 4, lamperne i trin 5), "↻ Tur", at turen starter selv første gang, "Din fremgang" (fjern `kvante` fra `UDEN_FREMGANG` i testen `karrusel`) og tre veje.
3. ✅ **PR 3, "Større …" og Gåde-kortet "Hvor stopper kvanteverdenen?"** (20. november 2026): molekylet med 2.000 atomer, klumpen med over 7.000 atomer (januar 2026, kilde og dato tjekkes ekstra grundigt) og fodbolden. Kortet med fortolkningerne kun under "For nørder", lyset på skinnen og en knap til bænken. Links: "Se det selv" under `HVORFOR.orbitaler` og fotonen i Ordbogen.

## Valgene (valgt af orkestratoren 2026-11-20, kan ændres af jer)
- Id `kvante`, titlen "Kvantefysik", tredje del i Atomer efter Det periodiske system, status "prøve", et tegnet ikon (prikker i striber).
- "Skyd" virker, mens knappen holdes nede, og det går hurtigere og hurtigere. Et kort tryk skyder ét skud (tastaturet fem).
- Modellen er cos²·sinc² med d = 4a (7 striber i den brede bunke), og prikkerne trækkes med et fast frø, så testen kan regne på mønstret.
- Gåde-kortet får ingen egen 3D-scene: lyset på skinnen og en knap til bænken, som Livets begyndelse (G4e).
- Sammenfiltring venter på forløb 4 (jeres svar 5 i drejebogen og E7 punkt 6), ikke et kort i forløb 1.
- Et go før hver PR (DESIGN.md), og orkestratoren får en kort besked efter hver.

## "Er elektronen to steder på én gang?" (jeres ønske 21. november 2026)
Planen er [plan-kvante-to-steder.md](../plan-kvante-to-steder.md) (valgt af sessionen 22. november 2026, kan ændres af jer). To PR'er:
1. ✅ **PR 1 "Bølgen og prikken"** (22. november 2026): se "Senest lavet".
2. **PR 2 "Målerens lys"** (Feynmans tankeforsøg): næste, se "Næste".

## Senest lavet
**To steder, PR 1 (22. november 2026, Opus xhigh):** "Vis bølgen" viser nu hver elektrons bølgepakke: Den går fra kilden gennem begge sprækker, bagvæggen lyser i striber (chancen), og så glimter én prik ét sted. Holdes "Skyd" nede, tegnes én pakke ad gangen. Over væggen står en tæller, når måleren er tændt: "Venstre: n · Højre: m" og "Begge på én gang: 0". Turen fik et tredje gæt i trin 5 ("En hel ved begge på én gang") og trin 6 "Bølgen og prikken" ("Skyd én" tre gange). Kortet "Er elektronen så to steder på én gang?" (1986 i svaret, 2005, Wineland og Haroche, Nobelprisen 2012, Kasevich' 54 cm med kritikken og Schrödinger 1935 i "For nørder") står først i panelet og som vej efter turen, og ordet superposition står i Ordbogen. Faktatjekket står i [faktatjek-to-steder.md](../fakta-kvantefysik/faktatjek-to-steder.md) (to nye fælder). Testene: `kvante` 20 tjek og `kvante-forloeb` 13 tjek.

## Næste
**PR 2 "Målerens lys"** (valgt af sessionen, kan ændres af jer). **Prompt (ny session, kopiér):** "Spor Kvantefysik: 'To steder' PR 2, 'Målerens lys'. Læs docs/lige-nu/kvantefysik.md, docs/plan-kvante-to-steder.md (PR 2), docs/kode/kvante.md, docs/fakta-kvantefysik/faktatjek-to-steder.md (sidste afsnit) og fælderne i docs/erfaringer/fakta-faelder.md om kvantefysik. Byg skyderen 'Målerens lys' under 'Flere indstillinger' (svagt til stærkt, standard stærkt, virker kun med måleren): Hver elektron bliver set med en chance, der følger skyderen. Set: én lampe blinker, og den lander uden striber. Ikke set: den lander med striber. Prikkerne, måleren så, får lampens farve, og tælleren får 'Ikke set: n'. Slå først Feynmans forelæsninger bind III kapitel 1 ('Watching the electrons', det svage lys) op i en kilde, der kan læses (feynmanlectures.caltech.edu afviser automatiske opslag), og skriv i 'Ærligt talt', at det er et tankeforsøg. Tests (5 tjek: striberne toner gradvist ud, de sete prikker har ingen mørke striber, de usete har), skærmbilleder på telefon og tablet, --ændret i baggrunden, /faerdig, PR og merge." Model: Opus, høj effort.

**Prøven med jeres søn** (forløb 1, status prøve, [guide-proeven.md](../guide-proeven.md)), og så et go til forløb 2 og 3 (drejebogen afsnit 2 og 4, med E7-noterne afsnit 3 punkt 4 og 5). Spørg også det nye prøvespørgsmål i drejebogen afsnit 7 ("Er elektronen to steder på én gang?"). Forløb 2 venter også på Lys' "Hvorfor?"-kort om elektronens trin (jeres svar 3).

## Spørgsmål til jer
Ingen lige nu.
