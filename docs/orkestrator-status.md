# Orkestratoren: status

*Opdateret af orkestratoren session_01YQoBWJHjboVRT37tHFPvrZ 19. november 2026 kl. ca. 22 UTC (overtog efter skift 7, startet af jer i en ny chat). Skemaet: trig_01NdpeL6XTDT4mpUiFyE1uCL (hver time) og vækningen trig_01Nt3SschkHXCDqUK4uTmZeN (20. november 03:32 dansk tid). Det gamle timeskema trig_01QbBJpjnC4M1PQJMBj3XpRB er slået fra (sletning blev afvist af tilladelsessystemet). Gamle sessioner er arkiveret 19. november, undtagen "Småting · Prøverunde med jer" (venter på jeres Venus-svar).*

## Ved næste skift
Slet eller slå mine skemaer fra, opret dine egne (cron `0 * * * *` "Orkestrator: tjek nu"), send dit id til de kørende sessioner, og skriv til brugeren.

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen. Skift orkestrator ved ca. 250.000 tokens (`get_session` uden id, `context_usage`).
- Når en session stopper ved grænsen, får den "Fortsæt, hvor du slap." ved første tjek efter nulstillingen.
- Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden jer.
- **Start altid sessioner med `source_url: https://github.com/EspenOHalloran/atomlab`.**
- Orkestratoren må selv oprette og slette sit skema og sine påmindelser (PR #350).
- **De tre forslag til optimering** (røgtest på GitHub Actions, `/proeveliste`, `/ny-session`): Orkestratoren anbefalede at lade dem ligge, fordi gevinsten er lille. I har ikke sagt go. Byg dem ikke.
- **Rækkefølgen (jeres go 19. november 2026):** T3 og Einsteins faktagrundlag, så overblikket, så Planet 9, så Kvantefysik forløb 1 før Lys og farver (står i `docs/koereplan.md`).
- **S3b:** I henter selv de fire formmodeller (Mimas, Tethys, Dione, Rhea) fra sbn.psi.edu i en browser 20. november. Spejlene er tjekket: SBN-UMD og NAIF har dem ikke (NAIF har kun Enceladus).

## Kører
- **Solsystemet · Saturn S3: Enceladus** (session_01YQoBWL2njdQoQB6hh17JPR, Opus høj): tests kører, så PR og merge.
- **Småting · Fund fra telefonen i Gåderne** (session_01YQoBWLduMBWBGtkyjfbde1, Opus høj): alle fire lavet, venter på `--ændret`, så PR og merge.

## Køen (i denne rækkefølge)
1. **Videnskabsfolkene · Tycho T3** (prompten i `docs/lige-nu/videnskabsfolkene.md`, Opus høj), når en af de to er færdig. Bed den tjekke Tychos navn på hylden i telefonstørrelse.
2. **Videnskabsfolkene · Faktagrundlag til Einsteins bog** (Opus **xhigh**, kun dokumenter, "lavet af Opus xhigh i stedet for Fable" + linje i `docs/plan-fable.md`), når den anden er færdig. Grundlag: `docs/plan-videnskabsfolk.md` (Einsteins bog, afsnit 2 og 8).
3. **Småting · Overblikket opdateres** med alt fra 19. november og den lange plan.
4. **Småting · Gåden Planet 9** (`docs/plan-gaader-3d.md`, `docs/fakta-gaader.md`), Opus høj, `/faktatjek`.
5. **Kvantefysik · forløb 1: dobbeltspalten og "Hvor stopper kvanteverdenen?"** (`docs/drejebog-kvantefysik.md`), Opus høj, faktagrundlag for svære påstande med xhigh.
6. Orkestratoren skriver selv oversigten over grafikplanen (`docs/plan-grafik.md`: lavet og tilbage) til jer.
- Venter på jer: G4c (målingen `?maal#gaader` på Tab A11), Mars ekstra 4 (jeres pc), Ild 2 (prøven med sønnen), S3b (filerne).

## Andet
- Kendte røde tests: `venus` (også alene), `batteri` (også alene på main), `frigiv` og `overblik` (kun under belastning).
- Ugegrænsen er tæt på (advarsel). Den nulstilles 25. november kl. 01:00 dansk tid.
