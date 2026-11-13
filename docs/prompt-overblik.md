# Prompt: Drejebogen til Solsystemets overblik (Opus' udkast, som Fable tjekker)

*Skrevet 13. november 2026 efter jeres valg ("Opus' udkast nu, før G1"). Hører til sporet Solsystemet og Kosmos og er nr. 1 under "Nyt indhold" i [koereplan.md](koereplan.md). **Fable kan kun bruges til og med 16. november 2026**, så udkastet skal skrives nu, før G1 trin 3 (hakkene på Mars). Kun dokumenter, ingen kode.*

## Sådan startes den
- **Ny session, Opus, høj effort.** Første besked: "Læs `docs/prompt-overblik.md`, og gør det, der står under 'Prompten'."
- Kør den ikke samtidig med G1 trin 3 (samme spor).

---

## Prompten

Du hører til sporet Solsystemet og Kosmos. Skriv **Opus' udkast til drejebogen for Solsystemets overblik**: Solen, planeterne og deres baner som Solsystemets forside, hvor et tryk på en planet flyver ind til den. Fable 5.2 tjekker udkastet før 16. november 2026, og Opus bygger bagefter.

### Målet
Overblikket er indgangen til alle planeterne, så det skal give en ægte følelse af, hvor stort og tomt Solsystemet er, og lyst til at besøge planeterne ("Man skal få oplevelsen af at besøge planeterne", brugerens mål i DESIGN.md). Det skal fødes med én kernesætning og sit forløb (Retningen).

### Hvad du skal læse (kun afsnittene)
1. [docs/retning.md](retning.md) og skabelonen for et forløb [docs/fable/E3-forloeb.md](fable/E3-forloeb.md). [docs/drejebog-foerste-atom.md](drejebog-foerste-atom.md) som eksempel på niveauet.
2. [docs/plan-solsystemet.md](plan-solsystemet.md): afsnit 1 ("Overblikket"), afsnit 6 (trin 2) og punkt 4 i afsnit 9 (overblikket som egen visning med en filmisk overgang).
3. "Jeres mål for Solsystemet" og "Himlen i Solsystemet" i DESIGN.md (står i samtalen, hvis CLAUDE.md er indlæst, ellers `grep`).
4. Det, der findes: [docs/kode/solsystem.md](kode/solsystem.md) (rejse.js, flyby.js, navne.js og hent.js), `js/data/solbane.js` og `js/data/himmel.js` (`grep -n "^export"`), og [docs/lige-nu/solsystemet.md](lige-nu/solsystemet.md).
5. Fælderne om Solsystemet i [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -n -i "bane\|afstand\|skala\|planet"`) og ydelsen i [docs/erfaringer/planeter-og-maaner.md](erfaringer/planeter-og-maaner.md) (`grep` efter det, du skal bruge).
6. Hvor Planet 9 hører til: "Reserven" i [docs/fakta-gaader.md](fakta-gaader.md). Gåden kommer sammen med overblikket ([plan-gaader-3d.md](plan-gaader-3d.md)).

### Hvad du skal skrive
**`docs/drejebog-overblik.md`**, højst ca. 12 KB:
1. **Kernesætningen** ("Efter fem minutter kan brugeren sige: …") med 2-3 alternativer og din anbefaling.
2. **Forløbet** (3-6 trin efter skabelonen): Spørg, Gæt, handlingen og Så for hvert trin. Ét wow-øjeblik, som han vil vise til en ven (fx "Rigtig størrelse og afstand").
3. **Laboratoriet bagefter:** hvad der er fremme (budgettet for lagene), tidsskyderen, de to skalaer, og hvordan man flyver ind til en planet og ud igen (også til de planeter, der ikke er bygget endnu: Merkur og Pluto).
4. **Fakta med kilde** (højst ca. 15 påstande, mærket Sikker, Ret sikker eller Usikker). Tjek dem med `/faktatjek`.
5. **Ydelse:** hvad der hentes ved start, og hvad der hentes, når man flyver ind (budgettet i Retningen). Hvad er dyrt, og hvad kan genbruges?
6. **Spørgsmål til brugeren** med din anbefaling først.

Skriv derefter **`docs/prompt-fable-overblik.md`** efter samme form som [prompt-fable-molekyler.md](prompt-fable-molekyler.md) (Fable 5.2, `high`, svaret i `docs/fable/E9-overblik.md`). Den skal sige, at Fable kun kan bruges til og med 16. november 2026.

### Til sidst
- Skriv en linje i [lige-nu/solsystemet.md](lige-nu/solsystemet.md) under "Næste" med Fable-prompten, og sæt linjen i [plan-fable.md](plan-fable.md) ("Næste gang Fable bruges", punkt 4) til "udkastet er skrevet".
- Commit, push, PR og merge med det samme (CLAUDE.md). Sig til brugeren, at Fable-sessionen skal startes før 16. november, og at G1 trin 3 kan starte nu.
