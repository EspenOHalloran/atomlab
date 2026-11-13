# Prompt: Fable tjekker drejebogen til Solsystemets overblik

*Skrevet 13. november 2026 efter jeres valg ("Opus' udkast nu, før G1"). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Næste gang Fable bruges", punkt 4). Hører til sporet Solsystemet og Kosmos og er nr. 1 under "Nyt indhold" i [koereplan.md](koereplan.md). Opus har skrevet udkastet ([drejebog-overblik.md](drejebog-overblik.md)). Fable tjekker det kritisk, før I giver go, og før det bygges (efter G1 trin 3). Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 5-8 $. Fable læser ca. 100 KB og skriver højst ca. 10 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-overblik.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med G1 trin 3 (Fable skriver kun i `docs/fable/`), men ikke samtidig med en anden session, der skriver i `docs/lige-nu/solsystemet.md`.

---

## Prompten

Du skal tjekke **Opus' udkast til drejebogen for Solsystemets overblik** ([docs/drejebog-overblik.md](drejebog-overblik.md)), før det bygges. Du foreslog selv i eftersynet, at overblikket rykkes frem og bliver Solsystemets forside (nr. 12 i [docs/fable/E1-eftersyn.md](fable/E1-eftersyn.md)), og du har skrevet skabelonen for et forløb ([docs/fable/E3-forloeb.md](fable/E3-forloeb.md)). Opus bygger bagefter, og du kan ikke spørges igen efter 16. november 2026.

### Målet
Overblikket er indgangen til alle planeterne. Giver det en 13-årig en ægte følelse af, hvor stort og tomt Solsystemet er, og lyst til at besøge planeterne? Kan han tage forløbet alene på fem minutter og bagefter sige kernesætningen med egne ord? Er det ærligt om de to skalaer? Sig det, når noget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [E3-forloeb.md](fable/E3-forloeb.md). "Jeres mål for Solsystemet" og "Himlen i Solsystemet" i DESIGN.md (`grep -n -A2 "Jeres mål for Solsystemet\|Himlen i Solsystemet" DESIGN.md`).
2. Udkastet: [docs/drejebog-overblik.md](drejebog-overblik.md). Og den færdige [drejebog-foerste-atom.md](drejebog-foerste-atom.md) som eksempel på niveauet.
3. Planen: afsnit 1 ("Overblikket") og punkt 2 og 4 under "Jeres svar (5. november 2026)" i afsnit 9 i [docs/plan-solsystemet.md](plan-solsystemet.md) (`grep -n "^## " docs/plan-solsystemet.md`, og læs kun de afsnit).
4. Det, der findes: `rejse.js`, `navne.js` og `hent.js` i [docs/kode/solsystem.md](kode/solsystem.md) (`grep`), `plads` i `js/data/isgiganter.js` og Solens retning i `js/kosmos/mars.js`, `jupiter.js` og `saturn.js` (`grep -n "const sol ="`).
5. Fælderne: [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -n -i "bane\|afstand\|skala\|planet"`) og "Reserven" om Planet 9 i [docs/fakta-gaader.md](fakta-gaader.md).

### Hvad du skal levere
Én fil: **`docs/fable/E9-overblik.md`**, højst ca. 10 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Kan det bygges, som det står? Hvad skal ændres først?
2. **Kernesætningen:** holder anbefalingen (A), eller er B eller C bedre? Er den for lang?
3. **Trinene:** for hvert trin, der skal ændres: hvad, hvorfor og et forslag til ny tekst (kort dansk, til en 13-årig). Tjek reglerne i skabelonen (3-6 trin, gæt i mindst to trin, én handling, højst ca. 15 og 20 ord, højst to ord pr. trin). Er wow-øjeblikket (trin 3 og 4) stærkt nok, og er trin 5 et rigtigt "Det så du"?
4. **Laboratoriet og overgangen:** Holder lag-budgettet? Er overgangen gennem mørke den rigtige løsning på, at Mars, Jupiter og Saturn har en fast årstid? Er "Forstørret" med kvadratroden ærlig nok?
5. **Fakta:** de påstande i afsnit 4 i udkastet, der er forkerte, upræcise eller for sikre, med kilde. Skriv ikke det, der holder, op én for én.
6. **Opus' seks spørgsmål** (afsnit 6 i udkastet): Står "Jeres svar" i udkastet, så skriv kun, hvor du er uenig, og hvorfor. Ellers din anbefaling til hvert.
7. **Det, der mangler,** fx en bedre første handling, et bedre gæt eller noget, der vil få barnet til at gå i stå.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, udkastet eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder (NASA, NSSDC, JPL, IAU). Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/solsystemet.md](lige-nu/solsystemet.md) under "Næste": "Fables tjek af drejebogen til overblikket er skrevet, se `docs/fable/E9-overblik.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E9-overblik-noter.md` (hvad der er nyt, og hvor Opus er uenig) og retter drejebogen. Fables fil rettes ikke.
2. I svarer på det, der er åbent, og giver go. Så bygges overblikket (Opus, høj effort), efter G1 trin 3.
