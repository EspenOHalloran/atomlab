# Prompt: Mars åbner langsomt anden gang (Solsystemet)

*Skrevet ind 18. november 2026 af sessionen "Solsystemet · Mars åbner langsomt anden gang" (prompten fra orkestratoren). Model: Opus, effort høj.*

Spor: Solsystemet. Navngiv chatten "Solsystemet · Mars åbner langsomt anden gang". Tjek først i origin/main, at det ikke er lavet (CLAUDE.md, "Parallelle sessioner").

**Jeres beslutning (18. november 2026, brugerens go via orkestratoren):** Mars gøres færdig nu, før Månen og ønskerne fra 17. november. Først denne rettelse, så en samlet plan for "Mars ekstra" med et go pr. del i rækkefølgen: nordpolen tæt på (M7b-pol), sten og terræn i Stå på Mars (M8c del 3), Curiosity som 3D-model (M8c del 2) og til sidst lyset (L2, kræver en session på brugerens pc). Skriv beslutningen i `docs/lige-nu/solsystemet.md` og `docs/koereplan.md` med datoen og "jeres ønske". Skriv også denne prompt ind som `docs/prompt-mars-anden-gang.md`.

**Problemet:** Brugeren på Tab A11 (Mali-G615): Det føles langsomt at åbne Mars eller Stå på Mars anden gang, "som om den stoppede, inden den hentede kortet". Målingen med `?maal`: lange opgaver på 80-160 ms, og kortene lægges ind i grafikkortet igen ved hver åbning, 127-162 ms pr. kort, lige efter hinanden. Årsagen er sandsynligvis forslag G fra 13. november 2026 (billederne frigives, når man forlader en planet, så hukommelsen holder budgettet; prisen var, at en planet åbner langsommere anden gang). Se `docs/lige-nu/smaating.md` (afsnittet om Mars på Tab A11), `docs/plan-grafik.md` (Status og forslag G), `docs/maalinger/mars-g1.md`, `docs/kode/` for `js/solsystem/hent.js` og `docs/retning.md` (budgettet for hukommelse).

**Opgaven:** Find, hvad der koster ved åbning nr. 2 (afkodning af billedet, upload til grafikkortet, nye shadere), og gør det glat uden at bryde hukommelsesbudgettet. Muligheder at vurdere: behold den sidst besøgte planets kort (eller kun Mars' kort) i grafikkortet, afkod med `createImageBitmap` uden for hovedtråden, læg kortene ind ét ad gangen over flere billeder (som efter flyvningen ned), og vis bjælken "Henter …" fra `js/hentning.js`, så ventetiden ses i stedet for at føles som et stop. Lav først en kort plan med trin, og få et go. Mål før og efter i testbrowseren med fuld grafik (ikke `TEST_HURTIG`), og skriv tallene i `docs/maalinger/mars-g1.md`. Linje i "Ikke afprøvet": brugeren måler på Tab A11 igen. Tests: `--ændret` og 3-5 tjek (fx at anden åbning ikke lægger alle kort ind i ét billede, og at hukommelsen stadig falder i menuen, `tests/frigiv.mjs`). Afslut med `/faerdig`.

**Bagefter (i samme session, hvis der er plads, ellers skriv prompten til en ny):** Skriv planen for Mars ekstra i `docs/plan-mars.md` (eller en ny `docs/prompt-mars-ekstra.md`) med de fire dele og en prompt pr. del, og send den til orkestratoren.

**Rør ikke:** andre spors filer (Liv, Tid, Småting kører samtidig), og i de fælles filer kun Solsystemets blok.
