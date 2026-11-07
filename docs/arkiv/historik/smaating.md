# Historik: Småting

*Det forrige "Senest lavet" fra [lige-nu/smaating.md](../../lige-nu/smaating.md) flyttes hertil ordret, nyeste øverst (fra 7. november 2026). Det, der er ældre, står i den lukkede [historik.md](../historik.md).*

**Senest lavet (7. november 2026): Arbejdsgangen gjort billigere i tokens og sikker for parallelle sessioner.** Jeres go: "go - men vent til de nævnte sessioner er færdige" (svar: 1 ja til én statusfil pr. spor, 2 artefaktet "AtomLab Overblik" opdateres efter en serie, 3 Sonnet deler faktafilen op).
- **Status pr. spor:** `docs/lige-nu.md` er en kort oversigt, og hvert spor har sin egen fil i `docs/lige-nu/` og sin egen historik i `docs/arkiv/historik/`. Den gamle historik er lukket.
- **`.gitattributes`** med `merge=union` for filer, man kun tilføjer linjer til (Ikke afprøvet, Åbne punkter og erfaringerne). Afprøvet i et lille test-repo: To sessioners nye linjer øverst i samme liste blev begge beholdt uden konflikt.
- **Nye regler** i CLAUDE.md ("Parallelle sessioner" og "Tokens"), DESIGN.md, `/faerdig`, `/faktatjek` og tjekliste A (som sagde "hele testsamlingen" i strid med reglen om `--ændret`).
- **`docs/fakta-solsystemet.md`** (230 KB) er delt op i 11 filer på 10-31 KB i `docs/fakta-solsystemet/`, og den gamle fil er nu et indeks (4 KB). Tjekket: Delene samlet igen er identiske med originalen (bortset fra 3 rettede links).
- **Ryddet op:** De færdige trin i DESIGN.md og den brugte prompt til Småtingspakken er flyttet til `docs/arkiv/`.
