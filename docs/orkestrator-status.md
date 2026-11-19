# Orkestratoren: status ved skiftet

*Skrevet af orkestratoren 19. november 2026 kl. ca. 16:40 UTC (skift 6, orkestratoren session_01YQoBWMtTVqv7FUysAsvLBc havde ca. 220.000 tokens). Den nye orkestrator læser denne fil og [prompt-orkestrator.md](prompt-orkestrator.md).*

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen, fordi grænsen på 5 timer deles. Orkestratoren skifter ved ca. 250.000 tokens (`get_session` uden id, `context_usage`, ved hvert tjek).
- Når en session stopper ved grænsen for de 5 timer eller ugegrænsen, får den "Fortsæt, hvor du slap." ved første tjek efter nulstillingen.
- Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden jer.
- **Start altid sessioner med `source_url: https://github.com/EspenOHalloran/atomlab`.**
- **Orkestratoren må selv oprette sit skema og sine påmindelser** (jeres tilladelse 19. november 2026, PR #350, `.claude/settings.json`).
- Tychos drejebog: "Gå med dine anbefalinger. 4: spørg ikke KB" (kernesætning A, de Gheyns stik, siderne A, B1b, brevet og D2, Toronto-skanningen, citatet `tycho` til Hvid dværg i T3).

## Kører
- **Videnskabsfolkene · T1: Tychos forside og bog** (session_01YQoBWKxmeVosB2nEbSEjyo, Opus høj). Stoppede ved grænsen kl. 13:21, fik "Fortsæt, hvor du slap." kl. 16:34. Bagefter T2 og T3 med prompten i `docs/lige-nu/videnskabsfolkene.md`.
- **Småting · Undertitel i Gåderne og paneler, der kan swipes ned på mobilen** (session_01YQoBWJWATzsxdQkEWnbum4, Opus høj, startet 16:34). Jeres ønske 19. november. Del 1 undertitlen (forslag "Ved kanten af det, vi ved"), del 2 paneler på telefonen, der minimeres med et swipe ned. Den viser planen til del 2 og venter på go.

## Merget 19. november (efter skift 5)
Mars ekstra 3 Curiosity (#342), Tychos drejebog (#347), fakta-fælderne delt op (#348), Månen "Lys på hele Månen" og LOLA 2k/4k (#349), orkestratorens tilladelser (#350). Overblikket er opdateret til version 67 (til og med #348).

## Køen
1. **Tycho T2 og T3** efter T1.
2. **Solsystemet · Saturn S3** (højder på månerne, `plan-saturn-kvalitet.md`, solsystemet.md Næste nr. 3), når der er plads til en tung session.
3. **Gåderne G4c: Sort hul**, når I har målt `?maal#gaader` på Tab A11.
- Ikke uden jer: Mars ekstra 4 (L2, jeres pc), Ild 2 (efter prøven med sønnen), BepiColombo (efter 21. november).

## Venter på jer
- Mål og prøv på Tab A11: `?maal#gaader`, stenene ved Naukluft, Curiosity, Månens kontakt og (pc) om 4k-højdekortet hakker.
- Prøven med sønnen: Ild 1, Huygens' bog, Liv tur 4-5, Tid.
- Arkivér gamle sessioner, der står tilbage (fx den første G4d session_01YQoBWJmtmbSD8GbHBRLD8B, G4d, G4e, Ild 1, Mars ekstra 2, de gamle orkestratorer).

## Andet
- Kendte røde tests: `venus` (også alene), `batteri`, `frigiv` og `overblik` (kun under belastning).
