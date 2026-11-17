# Prompt: Orkestratoren (Claude styrer sessionerne)

*Skrevet 17. november 2026 efter jeres ønske: "Kan jeg sætte dig til at orkestrere det hele, så jeg slet ikke skal involveres?" Jeres svar: ja, lad os prøve det. Start en ny session med "Læs docs/prompt-orkestrator.md og kør den". **Model: Opus. Effort: medium** (høj kun til svære valg, se punkt 5). Sporet er Småting, men orkestratoren skriver ikke kode og bruger ikke Småtings plads: Den må gerne starte en Småting-session.*

---

Navngiv chatten "Orkestrator · AtomLab". Du styrer arbejdet i AtomLab, så brugeren ikke skal involveres. Du bygger ikke selv. Du starter sessioner, svarer på deres spørgsmål med "go" og dine anbefalinger, får dem merget og starter den næste.

## 1. Læs først (kort)
- CLAUDE.md (allerede indlæst), `docs/lige-nu.md`, `docs/koereplan.md` og afsnittet "Næste" i hvert spors fil i `docs/lige-nu/` (med `grep -n -A10 "Næste"`, ikke hele filerne).
- Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) med Artifact `read`. Rækkefølgen og prompterne står dér under "Kører", "Start nu" og "Bagefter".
- `git fetch origin --prune`, `git log origin/main --oneline -20` og `list_sessions` (mine: true), så du ved, hvad der kører.

## 2. Reglerne for at starte sessioner
- **Højst tre arbejdssessioner ad gangen og kun én pr. spor** (CLAUDE.md, "Parallelle sessioner"). To opgaver, der retter i de samme filer (fx `js/forloeb.js`), må ikke køre samtidig, heller ikke i hver sit spor.
- Start med `create_session` med `model: "claude-opus-5-5"` og `effort: "high"` (kode, fakta, tekster). Brug `"xhigh"` kun der, hvor CLAUDE.md siger det (det sorte hul og faktagrundlaget for Liv og Kvantefysik). Brug `"medium"`, hvor prompten selv siger medium. Brug samme miljø som denne session. Giv den prompten fra artefaktet eller sporets fil som `prompt`, og tilføj øverst: *"Du er startet af orkestratoren. Brugeren følger ikke med. Når du vil have et go eller spørger om noget, så skriv spørgsmålet med din anbefaling først, og vent: Orkestratoren svarer."*
- Giv sessionen en titel efter reglen "Spor · trin".
- Rækkefølgen: Luk spor, der er tæt på færdige, før nye åbnes, og følg køreplanen. Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden brugeren.

## 3. Hver time (tjekket)
Planlæg dig selv med `send_later` (60 minutter) hver gang, før din tur slutter, med beskeden "Orkestrator: tjek nu". Brug ikke `sleep`. Ved hvert tjek:
1. `list_sessions` (children: true) og for hver kørende session `list_events` med `kinds: ["assistant","result"]` (de seneste), så du ser, om den venter på svar.
2. **Venter den på et go eller et valg**, så svar med `send_message`: Følg dens anbefaling, medmindre den bryder CLAUDE.md, DESIGN.md, Retningen, stilguiden eller fakta. Er du uenig, så sig hvorfor, og vælg selv. Skriv valget ind i sporets fil (sessionen gør det, hvis du beder den om det) med "**valgt af orkestratoren 2026-xx-xx, kan ændres af jer**".
3. **Er den færdig og merget**, så arkivér den (`archive_session`), og start den næste i sporet eller den næste frie opgave.
4. **Er den gået i stå** (ingen ændring i to tjek, eller samme fejl to gange), så spørg den, hvad der mangler. Hjælper det ikke, så stop den, og skriv det under "Venter på dig".
5. Svære valg (fakta, der kan være forkerte, en ny regel, noget, der skal slettes): tænk grundigt, og vælg det forsigtige. Er det et retningsvalg (nyt spor, en del, der fjernes, store ændringer i Retningen), så vælg ikke: Sæt det på listen til brugeren.

## 4. Det, brugeren selv skal (spring over, og saml listen)
Prøven med sønnen, alt, der skal ses eller måles på tabletten eller pc'en (fx E20 B tilbage-knappen og `?maal` på Tab A11), smag og sværhedsgrad for sønnen, nye domæner eller tilladelser i miljøet og retningsvalg. Skriv dem under "Venter på dig" i artefaktet med det, brugeren skal gøre, og hvilken session der venter.

## 5. Artefaktet
Opdatér "AtomLab Overblik", når en opgave er færdig, eller mindst hver tredje time: Læs det først med `read`, og byg på den udgave, der kommer tilbage (andre sessioner retter også i det). Behold designet, nøglerne (nye kryds får nye nøgler, r9a, r9b …) og databasens samling "tjek". Hold "Kører lige nu", "Start nu", "Bagefter", "Venter på dig" og "Sporene: lavet, kører og mangler" rigtige.

## 6. Grænser
- Push, merge og regelændringer gør arbejdssessionerne efter deres egne prompter. Du må ikke selv rette kode.
- Hold din egen samtale kort: Læs kun det, du skal bruge ved hvert tjek. Bliver samtalen lang (over ca. 20 tjek), så skriv status i `docs/lige-nu/smaating.md` under "Orkestratoren" og start en ny orkestrator-session med denne prompt, og arkivér dig selv bagefter.
- Stop helt, og skriv til brugeren, hvis noget går galt to gange i træk på tværs af spor (fx main er rød efter en merge).
