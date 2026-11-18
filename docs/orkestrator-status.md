# Orkestratoren: status ved skiftet

*Skrevet af orkestratoren 18. november 2026 kl. ca. 17:50 UTC (skift 3). Den nye orkestrator læser denne fil og [prompt-orkestrator.md](prompt-orkestrator.md). Den forrige status ligger i [arkiv/historik/smaating.md](arkiv/historik/smaating.md).*

## Jeres beslutninger 18. november 2026
- Højst **to tunge sessioner** (Opus) ad gangen, fordi grænsen på 5 timer deles. Store opgaver får en ny session pr. delopgave. Orkestratoren skifter ved ca. 250.000 tokens.
- **Natten til 19. november (jeres ønske):** "Sørg for, at arbejdet fortsætter i nat. Jeg sover, så du må selv træffe beslutninger og vende det med mig i morgen. Det vigtigste er, at udviklingen ikke går i stå." Orkestratoren vælger selv (det forsigtige ved fakta) og skriver hvert valg som "valgt af orkestratoren 2026-11-18/19, kan ændres af jer". Retningsvalg og nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes stadig ikke.
- Sessionerne må sende beskeder til orkestratoren (`.claude/settings.json`, PR #331).
- Gåderne må køre i sporet Småting ved siden af prøverunden (jeres go 18. november), fordi prøverunden kun venter på jer.

## Kører
- **Småting · Gåderne skarpere og det sorte hul** (session_01YQoBWHs53M6hHFF46P98gY, Opus høj): go til fem trin (navnene som HTML-tekst, linsen fra Kosmos med én linje i `linse.js`, MSAA kun i Gåderne, Antistof efter læsetid med "Næste" til at springe frem, måling).
- **Molekyler · Liv L6** (session_01YQoBWMhds52GXAfGxVBmXQ, Opus høj): bygget og pushet til `claude/liv-l6-spor`, tests kører, så PR og merge. Den har skrevet `docs/prompt-ild-1.md` på sin gren.
- **Småting · Prøverunden med jer** (session_01YQoBWLXCmupFKqMe2vhn6b, Sonnet): venter på jer (E20 B, tilbage-knappen).

## Køen i nat (i rækkefølge, højst to tunge)
1. **Solsystemet · Mars ekstra 2: Stenene i Stå på Mars** ([prompt-mars-ekstra.md](prompt-mars-ekstra.md), afsnit 2, Opus høj), når Gåderne eller L6 er færdig.
2. **Molekyler · Ild forløb 1** ("Læs docs/prompt-ild-1.md", Opus høj), når L6 er merget.
3. **Solsystemet · Mars ekstra 3: Curiosity** efter del 2. **Valgt af orkestratoren 2026-11-18, kan ændres af jer:** ja til `gltf-transform` som et værktøj, der køres én gang med `npx` (ingen `package.json`, intet byggetrin, kun den mindre `.glb` committes). Sig nej i morgen, så laves det om.
4. **Solsystemet · Månen: "Se bagsiden" og LOLA-højder** (solsystemet.md, Næste nr. 3), efter Mars ekstra 3.
- Ikke i nat: Mars ekstra 4 (kræver jeres pc), BepiColombo (efter 21. november), jeres ønsker fra 17. november (kræver rækkefølge fra jer).

## Venter på jer (i morgen)
Prøverunden (E20 B), mål Nordpolen og Mars på Tab A11, Huygens' tavle på den ultrabrede skærm, prøven med sønnen (Huygens' bog, Liv tur 4-5, Tid), en session på pc'en til Lyset (L2), og et ja eller nej til valgene herover.

## Kendte røde tests på main
`venus` (gløden om natten, fejler også alene) og `frigiv` (kun under belastning).
