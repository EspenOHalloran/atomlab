# Prompt: De næste fem sessioner (runde 5)

*Skrevet 14. november 2026 sent om aftenen af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres svar (nederst). Prompterne står også i artefaktet "AtomLab Overblik" med en kopiknap. Når en runde er færdig, skrives den næste her, og den gamle flyttes til `docs/arkiv/` (runde 4: [arkiv/prompt-naeste-fem-runde4.md](arkiv/prompt-naeste-fem-runde4.md)).*

## Rækkefølgen
I aften kun Opus-opgaver. 1-4 kan starte nu, samtidig, fordi de hører til hvert sit spor. 5 venter på, at G1 trin 3 del 3 (kører nu) er merget, fordi de hører til samme spor. Huygens tages i morgen (15. november), først Opus' plan og drejebog og så Fables tjek, der skal være færdigt senest **16. november 2026**.

### 1. Molekyler · Liv-planen efter Fables drejebog (Opus, høj, nu)
> Spor: Molekyler. Navngiv chatten "Molekyler · Liv-planen efter Fables drejebog (E10)". Tjek først i origin/main, at `docs/fable/E10-liv-noter.md` ikke findes. Læs `docs/lige-nu/molekyler.md` og `docs/prompt-fable-liv-l3-l6.md`, og gør punkt 1 under "Efter Fables svar" (vores svar står i punkt 2): skriv E10-noterne (hvad er nyt, og hvor er du uenig), og ret `docs/plan-liv.md` og `docs/prompt-liv-l3.md`, så L3 "Kopien" kan bygges som et forløb i en ny session. Kun dokumenter, Fables fil rettes ikke. Stil mig spørgsmålene som en dialog med din anbefaling først, skriv svarene ind, og afslut med /faerdig.

### 2. Åbne punkter · De ustabile tests (Opus, høj, nu)
> Spor: Åbne punkter. Navngiv chatten "Åbne punkter · De ustabile tests". Læs `docs/lige-nu/aabne-punkter.md` (linjerne om tests, der fejler under belastning), `tests/README.md`, tjekliste F, `docs/erfaringer/rodaarsager.md` og erfaringerne om tests. Undersøg disse, der fejler af og til og består alene: `isgiganter` (Neptuns Sol −18,8° giver 0,00, tre gange), `ordforklaring` ("klik igen lukker den", tre gange), `tidhvorfor` ("▶ Spil rejsen", måler i rigtig tid, fejler også på main) og `jupiter` ("ringene: næsten usynlige forfra", to gange), og hvis der er tid `aarstider`, `fuldskaerm` og `byg-molekyler`. Genskab hver under belastning (fx tre tests samtidig eller CPU-drosling i Playwright), find rodårsagen, og ret testen (vent på tilstanden med `waitForFunction`, ikke på tiden) eller koden, hvis det er en rigtig fejl. Rør ikke `mars`, `landskab`, `hentning` og `henter`, for Solsystemet-sessionen (G1 trin 3 del 3) arbejder med dem. Ret helst kun i `tests/` og testadgangen. Skal en skærms kode rettes, så kun den linje, fejlen sidder i. En test kaldes løst, når den består 5 gange i træk under belastning. Skriv hvert fund i `aabne-punkter.md` (løst eller ej), nye rodårsager i `rodaarsager.md` og tjekliste F, og afslut med /faerdig.

### 3. Småting · Gåderne G4b, skinnen (Opus, høj, nu)
> Spor: Småting. Navngiv chatten "Småting · Gåderne 3D G4b: skinnen". Tjek først i origin/main, at G4b ikke er lavet. Gør det, der står i "Prompt til G4b" nederst i `docs/plan-gaader-3d.md`. Mine fund fra Antistof på tabletten: [ingen endnu / skriv dem her].

### 4. Menuen · Ringen, og sporet lukkes (Opus, medium, nu)
> Spor: Menuen. Navngiv chatten "Menuen · Ringen, og sporet lukkes". Tjek først i origin/main, at det ikke er lavet. Læs `docs/lige-nu/menuen.md`, linjen "Ringen" i tabellen i `docs/plan-verdener.md` og filen i `docs/kode/` om `js/karrusel.js` og `js/skaerme.js`. Min runde på tabletten: Menuen ser fin ud, intet skal rettes. Gør det, planen siger (vores svar 14. november 2026: anbefalingen): Kernerne først i ringen (fra det mindste til det største), "Atomer og molekyler" bliver "Atomer", og "Ild og liv" bliver "Liv" (navn, ikon og tekst), i `VERDENER` i `js/skaerme.js`, motivet i `js/menubaggrund.js` og testen `karrusel`. Find de gamle navne andre steder med `git grep` (fx hjælpen), og ret dem. Kør tests med --ændret, tag skærmbilleder i telefon- og tabletstørrelse, skriv i `docs/lige-nu/menuen.md` og i tabellen i `docs/lige-nu.md`, at sporet er lukket (Serie 2 nr. 6 i køreplanen er lavet), og afslut med /faerdig.

### 5. Solsystemet · Overblikket (Opus, høj, når G1 trin 3 del 3 er merget)
> Spor: Solsystemet og Kosmos. Navngiv chatten "Solsystemet · Overblikket". Tjek først i `origin/main`, at G1 trin 3 del 3 er merget, og at overblikket ikke er i gang. Læs `docs/drejebog-overblik.md` (med vores svar 14. november 2026), `docs/fable/E9-overblik-noter.md`, `docs/retning.md` og `docs/kode/solsystem.md`, og byg overblikket som Solsystemets forside. Merkur og Pluto står som en lille kugle med et kort panel, til de bygges. Lav først en kort plan med trin, og få et go pr. trin. Brug tjeklisterne D og E, `/faktatjek` på nye tekster, og afslut med `/faerdig`.

## I morgen (15. november): Huygens og Fable
### 6. ✓ Videnskabsfolkene · Plan og drejebog til Huygens (Opus, høj, først i morgen) (lavet 15. november 2026)
> Læs `docs/prompt-videnskabsfolk.md`, og gør det, der står under "Prompten". To ting mere (vores svar 14. november 2026, står i `docs/koereplan.md`): (1) Huygens bygges også nu, ved siden af Gåderne 3D, så planens trin H1 skal kunne startes lige efter Fables tjek. (2) Fable skal tjekke drejebogen senest 16. november: Skriv til sidst `docs/prompt-fable-huygens.md` (Fable 5.2, effort high, svaret i `docs/fable/E12-huygens.md`) efter mønstret i `docs/prompt-fable-overblik.md`, og merge den med det samme, så Fable-sessionen kan starte samme dag.

### 7. Fable · Tjek af drejebogen til Huygens (Fable 5.2, high, efter 6, senest 16. november)
> Læs `docs/prompt-fable-huygens.md`, og gør det, der står under "Prompten".

### 8. Videnskabsfolkene · Fables noter og H1 (Opus, høj, når 7 er færdig)
> Spor: Videnskabsfolkene. Læs `docs/fable/E12-huygens.md`, `docs/plan-videnskabsfolk.md` og `docs/drejebog-huygens.md`. Skriv Opus' noter i `docs/fable/E12-huygens-noter.md` (hvad er nyt, og hvor er du uenig, som i `docs/fable/E9-overblik-noter.md`), ret drejebogen, og stil mig spørgsmålene som en dialog med din anbefaling først. Byg derefter H1 efter planen, når jeg har givet go.

## Bagefter
Venus V3 → V4 → V5, så Merkur og Pluto i en lille udgave. Så er Solsystemet færdigt, og nye spor kan starte (Lys og farver først). Liv L3 "Kopien", når nr. 1 er lavet og Molekyler er prøvet. **Uden for sessionerne:** prøven med jeres søn ([guide-proeven.md](guide-proeven.md)). Der ligger nu 7 ting med status "prøve".

## Jeres svar (14. november 2026, runde 5)
- **Kun Opus i aften.** Fable-arbejdet (Huygens) tages i morgen, og Opus' plan og drejebog til Huygens laves i morgen lige før.
- **De fem:** som foreslået, undtagen Huygens.
- **G4b:** start nu. Fund fra Antistof på tabletten tages med, hvis I når det.
- **De ustabile tests:** ja, en session.
- **De to gamle grene** (`claude/relaxed-cori-h0yxvd` og `ccr-8c5ddb9a-ts9r17`): slettes (indholdet står i en nyere udgave på main). Sessionen fik ikke lov til at slette dem (miljøets sikkerhedstjek), så de slettes under Branches på GitHub.
- **Menuen:** Runden på tabletten er taget, og menuen ser fin ud. Anbefalingen: Kernerne først, "Atomer" og "Liv" (nr. 4).

## Prompten til næste runde (står også nederst i artefaktet)
> Spor: Småting. Navngiv chatten "Småting · Overblik og de næste fem sessioner". Jeg har brug for overblik: (1) Kør git fetch origin --prune, og læs docs/lige-nu.md, alle filerne i docs/lige-nu/, docs/koereplan.md og docs/prompt-naeste-fem.md (den forrige runde og vores svar). (2) Gå sessionerne igennem med list_sessions, og se, hvilke grene der ikke er merget (git branch -r --no-merged origin/main) og hvilke PR'er der er åbne. Arkivér de sessioner, der er færdige og merget. Rør ikke dem, der stadig kører. (3) Sig, hvilke af den forrige rundes sessioner der er lavet, hvad der kører, og hvad der venter på mig. (4) Foreslå de næste fem sessioner i rækkefølge, med spor, model og effort, hvad de venter på, og hvad der kan køre samtidig. Prioritér at lukke spor, der er tæt på færdige, før nye åbnes, og følg vores beslutninger i køreplanen. Sig til, hvis der mangler forberedende arbejde (fx en prompt, et faktagrundlag eller et domæne). (5) Stil mig spørgsmålene som en dialog med din anbefaling først, før du skriver noget. (6) Skriv derefter de fem prompter i docs/prompt-naeste-fem.md (den forrige runde flyttes til docs/arkiv/), og ret køreplanen, hvis vi har besluttet noget nyt. Fælles dokumenter til sidst: merge main ind, PR og merge med det samme. (7) Opdatér artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe): læs det først med Artifact read, og behold det slanke design og denne sektion. Nye kryds får nye nøgler (r6a, r6b … for runde 6), og databasens samling "tjek" beholdes. Giv mig linket og den næste session til sidst.
