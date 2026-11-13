# Lige nu: Solsystemet og Kosmos

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/solsystemet.md](../arkiv/historik/solsystemet.md). Højst ca. 5 KB. Sidst opdateret: 13. november 2026.*

**Senest lavet (13. november 2026): Måleren og hakkene på Mars (G1 trin 1).** Jeres go: "Læs docs/prompt-maaler.md og lav trin 1." Jeres svar: Det hakker, når kameraet flyver, og første gang et sted besøges, på en bærbar uden særskilt grafikkort.
- **Måleren:** `?maal` i adressen (fx `…/atomlab/?maal#solsystem`) viser billeder i sekundet, det værste billede, ryk over 50 ms og en liste over rykkene med det, der skete lige før (nye shadere, kort lagt i grafikkortet, hentede billeder, kamerarejser, tryk). "Kopiér" giver teksten til chatten. Den hentes kun med `?maal` (`js/maaler.js`).
- **Rettet på Mars (ingen ændring af udseendet):** Shaderne laves, når Mars åbnes, og ikke første gang kameraet flyver til et sted (før 200-500 ms pr. shader i testbrowseren, nu ingen under flyvningerne). De lokale kort og månernes kort pakkes ud uden for hovedtråden (4-6 gange hurtigere at lægge i grafikkortet), og kortene til næste stop lægges i grafikkortet, når kameraet står stille.
- **Fundene og forslag A-F** (det, der ændrer udseendet, venter på jeres måling): "Status" i [plan-grafik.md](../plan-grafik.md). Tests: `tests/maaler.mjs`.
- **Spørgsmål til jer:** Mål med `?maal` på pc og tablet (vejledningen står under "Trin 2" i [prompt-maaler.md](../prompt-maaler.md)), og send teksten fra "Kopiér".

**Før det:** Venus V2, Venus V1, planen for Venus, Uranus lukket for nu, Uranus og Neptun UN5, UN4, UN3, UN2 og UN1, planen, tre ønsker fra jer og Jupiter J1-J5. Se [historikken](../arkiv/historik/solsystemet.md).

**Næste (venter på jeres go):**
0. **Hakkene på Mars, trin 2 og 3 (G1):** I måler med `?maal` på pc og tablet (vejledningen under "Trin 2" i [prompt-maaler.md](../prompt-maaler.md)). Derefter en ny session (Opus, høj effort) med prompten til trin 3 i samme fil og jeres tekst fra "Kopiér".
1. **Venus V3** (natsiden gløder og stederne under skyerne, [plan-venus.md](../plan-venus.md)). Venter på jeres go. Start en ny session (Opus, høj effort) med teksten: "Læs docs/prompt-venus.md og kør V3." Bagefter V4-V5, og så Merkur → Pluto → overblikket.
2. **Mars ekstra** (efter planeterne eller når I vil, kan samles i én plan med et go pr. del): Curiosity som 3D-model (M8c del 2), Nordpolen tæt på (M7b-pol, jeres fund 7. november 2026: nordpolen er ikke skarp), stenene og terrænet i Stå på Mars (M8c del 3, jeres fund 3. november 2026: stenene ser ens ud) og lyset, den dyre del (L2, kræver en session på jeres pc). Se [plan-mars.md](../plan-mars.md).
3. **Månen (jeres spørgsmål 7. november 2026):** Man kan dreje rundt om Månen, men lyset følger fasen, så bagsiden kan være mørk. Forslag: en kontakt "Lys på hele Månen" eller "Se bagsiden" (lille). Højdekortet er kun 1k (LOLA findes i højere opløsning, mellem). **Saturn S3** (højder på månerne, [plan-saturn-kvalitet.md](../plan-saturn-kvalitet.md)) og **Jorden og Månen flottere** (se [ideer.md](../ideer.md)).
4. **Tabletrunden** (6. november 2026): Fund 2-4 hører til G1 i [plan-grafik.md](../plan-grafik.md), M8c del 3 og L2 i [plan-mars.md](../plan-mars.md).
