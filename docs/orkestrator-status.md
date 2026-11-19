# Orkestratoren: status ved skiftet

*Skrevet af orkestratoren 19. november 2026 kl. ca. 21:40 UTC (skift 7, orkestratoren session_01YQoBWKTBfPTH3S5iiJYQcA havde ca. 195.000 tokens). Den nye orkestrator er startet af jer i en ny chat, fordi kæden af sessioner var nået sin grænse (dybde 7 af 8). Læs denne fil og [prompt-orkestrator.md](prompt-orkestrator.md).*

## Det første, den nye orkestrator gør
1. **Slet den gamle orkestrators skemaer** med `delete_trigger`: `trig_01QbBJpjnC4M1PQJMBj3XpRB` (hver time) og `trig_01BGVquKMiEVfK3P5Rqa6h4C` (vækningen kl. 03:32 dansk tid). Tjek med `list_triggers`.
2. **Opret dit eget skema:** cron `0 * * * *`, beskeden "Orkestrator: tjek nu", og en vækning (`send_later`) 20. november 2026 kl. 03:32 `[Europe/Copenhagen]`: "Grænsen for de 5 timer er nulstillet. Tjek alle sessioner, og send 'Fortsæt, hvor du slap.' til dem, der er stoppet ved grænsen. Start den næste i køen, hvis der er plads." (jeres ønske: vækninger efter 22:30 og 5 timer senere).
3. **Send dit id** til de kørende sessioner (herunder), så de melder til dig.
4. Skriv kort til brugeren, at du har overtaget.

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen. Skift orkestrator ved ca. 250.000 tokens (`get_session` uden id, `context_usage`).
- Når en session stopper ved grænsen, får den "Fortsæt, hvor du slap." ved første tjek efter nulstillingen.
- Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden jer.
- **Start altid sessioner med `source_url: https://github.com/EspenOHalloran/atomlab`.**
- Orkestratoren må selv oprette og slette sit skema og sine påmindelser (PR #350).
- **De tre forslag til optimering** (røgtest på GitHub Actions, `/proeveliste`, `/ny-session`): Orkestratoren anbefalede at lade dem ligge, fordi gevinsten er lille. I har ikke sagt go. Byg dem ikke.

## Kører
- **Småting · Gåderne: jeres fund fra telefonen** (session_01YQoBWLduMBWBGtkyjfbde1, Opus høj, startet 21:39 UTC): de fire punkter under Åbne punkter.
- **T2 er færdig** (PR #358, merget, arkiveret). Det er ikke bekræftet, at Tychos navn på hylden (står oven i 1572 på telefonen) blev rettet: Tjek det i T3.
- **Solsystemet · Saturn S3: højder på månerne** (session_01YQoBWL2njdQoQB6hh17JPR, Opus høj). Valgt af orkestratoren: A, som `maane-form.js`. Bygger Enceladus. Har bedt miljøet om domænet til Gaskells formmodeller (sandsynligvis `sbn.psi.edu`), som venter på jeres godkendelse. Er det ikke godkendt, merges Enceladus alene, og de fire andre måner bliver S3b. Stoppede ved grænsen, fik "Fortsæt" kl. 21:31 UTC.

## Merget 19. november (efter skift 6)
Undertitlen i Gåderne (#352), Tychos forside T1 (#353), paneler, der kan swipes ned på telefonen (#354), jeres fund fra telefonen under Åbne punkter (#355), jeres ønsker i køreplanen (#356). Overblikket er ikke opdateret siden version 67.

## Køen
1. **Tycho T3** (prompten i `docs/lige-nu/videnskabsfolkene.md`, Opus høj), når S3 eller Småting er færdig. Bed den tjekke Tychos navn på hylden i telefonstørrelse.
3. **Overblikket opdateres** (Småting) med den lange plan (jeres ønske, se `docs/koereplan.md`), når en af de næste er færdig.
4. **Grafikken genbesøges** (jeres ønske, `docs/plan-grafik.md`): Vis jer først, hvad der er lavet, og hvad der er tilbage. Byg ikke uden jeres valg.
5. **Gåderne G4c: Sort hul**, når I har målt `?maal#gaader` på Tab A11.
- Ikke uden jer: Mars ekstra 4 (L2, jeres pc), Ild 2 (efter prøven med sønnen), BepiColombo (efter 21. november).

## Venter på jer
- Godkend domænet til Saturns måner (anmodningen fra S3).
- Prøv swipet på en rigtig telefon, og mål og prøv på Tab A11: `?maal#gaader`, stenene ved Naukluft, Curiosity, Månens kontakt og (pc) om 4k-højdekortet hakker.
- Prøven med sønnen: Ild 1, Huygens' bog, Liv tur 4-5, Tid.
- Arkivér gamle sessioner (de gamle orkestratorer, G4d, G4e, Ild 1, Mars ekstra 2, og orkestratoren session_01YQoBWKTBfPTH3S5iiJYQcA).

## Andet
- Kendte røde tests: `venus` (også alene), `batteri` (også alene på main), `frigiv` og `overblik` (kun under belastning).
- Ugegrænsen er tæt på (advarsel). Den nulstilles 25. november kl. 01:00 dansk tid.
