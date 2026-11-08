# Lige nu: Småting

*Spor i [oversigten](../lige-nu.md) til små rettelser på tværs, tests, dokumenterne og arbejdsgangen. Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/smaating.md](../arkiv/historik/smaating.md). Højst ca. 5 KB. Sidst opdateret: 8. november 2026.*

**Senest lavet (8. november 2026): Mindre test for pengene.** Jeres spørgsmål: finder testene noget, eller er de spild? Svaret: De har fundet ægte fejl (Reaktorens kædereaktion, henfaldsreglen, Uranus-apostroffen, Batteriets lampe), men meget af arbejdet gik til at holde testene selv stabile, og mange af de store fejl fandt I eller skærmbillederne. Jeres go til alle seks forslag:
- **Røgtesten `tests/roeg.mjs`** (ca. 20 sekunder): alle datafiler kan indlæses, og alle skærme og 23 fænomener åbner uden fejl i konsollen. Den køres altid af `--ændret` og fangede Uranus-fejlen igen, da den blev sat ind for sjov.
- **`--ændret` er smallere:** `index.html` og `style.css` giver kun testene for de skærme, de ændrede linjer hører til (alle, hvis linjen er fælles). Den sammenligner med `main` (merge-base), så den også virker efter push. Kun dokumenter ændret: ingen tests.
- **Nye regler** i DESIGN.md, CLAUDE.md, tjekliste A og F, `/faerdig` og `tests/README.md`: 5-10 tjek pr. ny funktion, ingen præcise kameravinkler og pixel, medmindre de er fakta, og et loft over jagten på sjældne fejl (en test, der består alene, skrives under Åbne punkter).

**Næste:** Trin 2 i forslaget: faktatjek af `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md`, én ny session pr. fil med `/faktatjek`. Først skal I godkende de domæner, der mangler (fx NASA, se "Miljøet" i [aabne-punkter.md](aabne-punkter.md)).
