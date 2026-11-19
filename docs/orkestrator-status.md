# Orkestratoren: status ved skiftet

*Skrevet af orkestratoren 19. november 2026 kl. ca. 12:00 UTC (skift 5, orkestratoren session_01YQoBWLt5Q4SCaavE8JUW4J havde ca. 523.000 tokens). Den nye orkestrator læser denne fil og [prompt-orkestrator.md](prompt-orkestrator.md).*

## Jeres beslutninger (gælder stadig)
- Højst **to tunge sessioner** (Opus) ad gangen, fordi grænsen på 5 timer deles. Orkestratoren skifter ved ca. 250.000 tokens (tjek `get_session` uden id, `context_usage`, ved hvert tjek).
- Når en session stopper ved grænsen for de 5 timer eller ugegrænsen, får den "Fortsæt, hvor du slap." ved næste tjek efter nulstillingen (se tidspunktet i sessionens sidste `result`).
- Nye spor (Lys og farver, Strøm og magneter, Kvantefysik) startes ikke uden jer.
- **Start altid sessioner med `source_url: https://github.com/EspenOHalloran/atomlab`**, ellers kan de ikke pushe (fejl i nat).

## Kører
- **Solsystemet · Mars ekstra 3: Curiosity** (session_01YQoBWMQPYBgGdZnk6zF2N7, Opus høj). **Valgt af orkestratoren 2026-11-19:** Python-værktøjet `lav_curiosity.py` i stedet for `gltf-transform` (npx blev afvist), WebP med reserve, stedet "Hos Curiosity nu" flyttet til sol 5073.
- **Videnskabsfolkene · V1 Tycho Brahe: drejebogen** (session_01YQoBWLzTcgzTynZycoDr5J, Opus høj, startet 11:50). Kun drejebog og faktatjek, ingen kode. Sender spørgsmål til jer via orkestratoren. **Byggeriet venter på jeres go.**
- Småting · Prøverunden (session_01YQoBWLXCmupFKqMe2vhn6b, Sonnet) venter på jer.

## Merget 19. november
Ild 1 (#337-#339), Mars ekstra 2 stenene (#340, tablet uden mellemlag og små sten: konstanten `STEN_FULD`), Gåderne G4d Mørkt stof (#341) og Liv andre steder (#343), G4e (#344), exoplaneternes rigtige pladser fra NASA's arkiv (#345).

## Køen
1. **Solsystemet · Månen: "Se bagsiden" og LOLA-højder** (solsystemet.md, Næste nr. 3), når Mars ekstra 3 er merget.
2. **Gåderne G4c: Sort hul**, når I har målt `?maal#gaader` på Tab A11.
3. **Tycho Brahe T1-T3** (byggeriet), når I har givet go til drejebogen.
- Ikke uden jer: Mars ekstra 4 (kræver jeres pc), Ild 2 (efter prøven med sønnen), BepiColombo (efter 21. november).

## Venter på jer
- Mål på Tab A11: `?maal#gaader` (hele G4) og stenene i Stå på Mars ved Naukluft (holder den 60, kan `STEN_FULD` slås til på tablet).
- Prøven med sønnen: Ild 1, Huygens' bog, Liv tur 4-5, Tid.
- Et ja eller nej til orkestratorens valg i nat (står i sporenes filer).
- Arkivér de færdige sessioner (orkestratoren må ikke): de gamle orkestratorer (session_01YQoBWMxa3emPhNTfbKN1b1 og denne), den første G4d (session_01YQoBWJmtmbSD8GbHBRLD8B), G4d, G4e, Ild 1 og Mars ekstra 2.

## Andet
- Kendte røde tests: `venus` (også alene), `batteri`, `frigiv` og `overblik` (kun under belastning).
- Artefaktet "AtomLab Overblik" er ikke opdateret siden 18. november kl. 21:40 UTC. Opdatér det (Gåderne G4d-G4e og Ild 1 er færdige serier).
