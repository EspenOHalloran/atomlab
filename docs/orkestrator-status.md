# Orkestratoren: status ved skiftet

*Skrevet af orkestratoren 19. november 2026 kl. ca. 01:40 UTC (skift 4, orkestratoren session_01YQoBWMxa3emPhNTfbKN1b1 havde ca. 306.000 tokens). Den nye orkestrator læser denne fil og [prompt-orkestrator.md](prompt-orkestrator.md). Den forrige status ligger i [arkiv/historik/smaating.md](arkiv/historik/smaating.md).*

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen, fordi grænsen på 5 timer deles. Orkestratoren skifter ved ca. 250.000 tokens.
- **Natten til 19. november:** Arbejdet skal fortsætte. Orkestratoren vælger selv (det forsigtige ved fakta) og skriver valgene som "valgt af orkestratoren 2026-11-18/19, kan ændres af jer". Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke. Mangler der arbejde: Gåderne G4c/G4d (plan-gaader-3d.md) eller Opdagelserne (den næste videnskabsmand efter Huygens, plan og drejebog først).
- Når en session stopper ved grænsen for de 5 timer, får den "Fortsæt, hvor du slap." ved næste tjek efter nulstillingen.

## Kører (begge stoppede ved grænsen 21:52-22:18 UTC og fik "Fortsæt" kl. 01:37 UTC)
- **Molekyler · Ild 1: Hvad brænder egentlig?** (session_01YQoBWLj6Pp4rgKvdD1Mjg3, Opus høj). PR 1 (verdenen Kemi, delen Ild, `js/flamme.js`, hele laboratoriet) er pushet på `claude/ild-1`, hele testsamlingen kørte. Derefter PR 2 (forløbet) og PR 3 (knaldgassen flytter fra Del elektroner til Ild). **Valgt af orkestratoren 2026-11-18:** 3 PR'er, hele laboratoriet nu, ingen ★ før prøven, NASA's rumflamme først i forløb 2, og go til PR 2 og 3 uden nyt go, når den forrige er merget og grøn.
- **Solsystemet · Mars ekstra 2: Stenene i Stå på Mars** (session_01YQoBWN3icHBhfboB6xwKTe, Opus høj, gren `claude/mars-sten`). **Valgt af orkestratoren 2026-11-18:** trin 1 (variation, farve, klynger, skygger) → trin 3 som "3D-sten i shaderen" (strålen gennem celler, ingen geometri) → trin 2 (AO pr. lag), højst ca. +15 % pr. trin i staa-tid på tablet, go på forhånd til næste trin, når det forrige holder.
- **Småting · Prøverunden med jer** (session_01YQoBWLXCmupFKqMe2vhn6b, Sonnet): E20 B er klaret (#334). Venter på jer: Venus "Ned gennem skyerne", prikken på "↻ Tur", målinger på pc og A56, prøven med sønnen.

## Merget i aften
Liv L6 (#333), E20 B tilbage-knappen virker (#334), Gåderne skarpere og det sorte hul (#335).

## Køen (højst to tunge)
1. **Solsystemet · Mars ekstra 3: Curiosity i 3D** (prompt-mars-ekstra.md afsnit 3, Opus høj), når Mars ekstra 2 er merget. **Valgt af orkestratoren 2026-11-18:** ja til `gltf-transform` med `npx`, kørt én gang (ingen `package.json`, intet byggetrin).
2. **Solsystemet · Månen: "Se bagsiden" og LOLA-højder** (solsystemet.md, Næste nr. 3), efter Mars ekstra 3.
3. Bliver en plads fri, før Mars-køen kan bruge den (Ild er færdig): Gåderne G4d/G4e/G4c eller Opdagelserne (næste videnskabsmand, plan og drejebog først).
- Ikke i nat: Mars ekstra 4 (kræver jeres pc), BepiColombo (efter 21. november), jeres ønsker fra 17. november.

## Venter på jer (i morgen)
Se Gåderne på tabletten (skarphed, det sorte hul, `?maal#gaader`), prøverundens resterende punkter, mål Nordpolen og Mars på Tab A11, Huygens' tavle på den ultrabrede skærm, prøven med sønnen (Huygens' bog, Liv tur 4-5, Tid), en session på pc'en til Lyset (L2), og et ja eller nej til orkestratorens valg herover.

## Andet
- Artefaktet "AtomLab Overblik" er opdateret kl. 21:40 UTC (runde 11, nøgler r11a-r11d).
- Grænsen for 7 dage har givet en advarsel (nulstilles 20. november kl. ca. 05:00 UTC). Stopper arbejdet ved den, så skriv det til brugeren.
- Kendte røde tests: `venus` (gløden om natten, også alene), `batteri` og `frigiv` (kun under belastning).
