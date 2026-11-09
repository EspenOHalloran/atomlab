# Lige nu: Solsystemet og Kosmos

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/solsystemet.md](../arkiv/historik/solsystemet.md). Højst ca. 5 KB. Sidst opdateret: 9. november 2026.*

**Senest lavet (9. november 2026): Venus V1, jorden og skelettet.** Jeres go: "Læs docs/prompt-venus.md og kør V1."
- **Venus står i Solsystemet** mellem Solen og Jorden (halvfærdig, som aftalt): Magellans radarkort med højderne (`klippeplanet.js` som Mars), tonet orange, for radaren ser ikke farver. "Bjergene 10 gange højere" og "Modlys". En kort side, der siger ærligt, at skyerne kommer snart.
- **Venus står, som den gør i dag:** Aksen peger mod IAU's nordpol, drejningen følger IAU's formel, og Solen følger banen. Punktet under Solen passer med JPL Horizons inden for 0,02°. Venus drejer baglæns, og Solen står op i vest (prøv ⏩: et døgn i sekundet).
- **Kortene:** `lav_venus.py` (radar 8k/4k/2k, højder 4k/2k). Ca. 3 % af overfladen mangler (mest ved sydpolen) og er fyldt blødt. Mørke sømme mellem Magellans strimler og et spring på ca. 120 m ved 180° i højderne er rettet.
- **Tests:** `tests/venus.mjs` (26 tjek). Koden står i [kode/venus.md](../kode/venus.md), erfaringerne i [erfaringer/venus.md](../erfaringer/venus.md).
- **Spørgsmål til jer:** Ingen. `darts.isas.jaxa.jp` svarede i dag, så Akatsukis kort kan nok bruges i V2.

**Før det:** Planen for Venus, Uranus lukket for nu, Uranus og Neptun UN5, UN4, UN3, UN2 og UN1, planen, tre ønsker fra jer og Jupiter J1-J5. Se [historikken](../arkiv/historik/solsystemet.md).

**Næste (venter på jeres go):**
1. **Venus V2** (skyerne og superrotationen, [plan-venus.md](../plan-venus.md)). Venter på jeres go. Start en ny session (Opus, høj effort) med teksten: "Læs docs/prompt-venus.md og kør V2." Bagefter V3-V5, og så Merkur → Pluto → overblikket.
2. **Mars ekstra** (efter planeterne eller når I vil, kan samles i én plan med et go pr. del): Curiosity som 3D-model (M8c del 2), Nordpolen tæt på (M7b-pol, jeres fund 7. november 2026: nordpolen er ikke skarp), stenene og terrænet i Stå på Mars (M8c del 3, jeres fund 3. november 2026: stenene ser ens ud) og lyset, den dyre del (L2, kræver en session på jeres pc). Se [plan-mars.md](../plan-mars.md).
3. **Månen (jeres spørgsmål 7. november 2026):** Man kan dreje rundt om Månen, men lyset følger fasen, så bagsiden kan være mørk. Forslag: en kontakt "Lys på hele Månen" eller "Se bagsiden" (lille). Højdekortet er kun 1k (LOLA findes i højere opløsning, mellem). **Saturn S3** (højder på månerne, [plan-saturn-kvalitet.md](../plan-saturn-kvalitet.md)) og **Jorden og Månen flottere** (se [ideer.md](../ideer.md)).
4. **Tabletrunden** (6. november 2026): Fund 2-4 hører til G1 i [plan-grafik.md](../plan-grafik.md), M8c del 3 og L2 i [plan-mars.md](../plan-mars.md).
