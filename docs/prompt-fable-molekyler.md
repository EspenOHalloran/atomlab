# Prompt: Fable tjekker drejebogen til Molekyler

*Skrevet 13. november 2026 efter jeres go ("også drejebog til molekyler"). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Status"). Hører til sporet Molekyler og Serie 1 nr. 3 i [koereplan.md](koereplan.md). Opus har skrevet udkastet ([drejebog-molekyler.md](drejebog-molekyler.md)). Fable tjekker det kritisk, før I giver go, og før det bygges. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 5-8 $. Fable læser ca. 100 KB og skriver højst ca. 10 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-molekyler.md`, og gør det, der står under 'Prompten'."

---

## Prompten

Du skal tjekke **Opus' udkast til drejebogen til Molekyler** ([docs/drejebog-molekyler.md](drejebog-molekyler.md)), før det bygges. Du har selv foreslået, at Molekyler bliver sin egen del med et forløb og energiregnskabet i lag 2 (nr. 5 i [docs/fable/E1-eftersyn.md](fable/E1-eftersyn.md)), og du har skrevet skabelonen ([docs/fable/E3-forloeb.md](fable/E3-forloeb.md)). Opus bygger bagefter, og du kan ikke spørges igen efter 16. november 2026.

### Målet
Bliver det et forløb, en 13-årig kan tage alene på fem minutter og bagefter sige kernesætningen med egne ord? Er det ærligt (især fælden "atomer vil have en fuld skal" og rækkefølgen i trin 3-4, hvor harpunen vises omvendt)? Sig det, når noget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [E3-forloeb.md](fable/E3-forloeb.md).
2. Udkastet: [docs/drejebog-molekyler.md](drejebog-molekyler.md). Og den færdige [drejebog-foerste-atom.md](drejebog-foerste-atom.md) som eksempel på niveauet.
3. Fælderne: [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -n -i "skal\|salt\|ion\|molekyl"`) og afsnit 6 "Fælder" i [docs/fakta-molekyler.md](fakta-molekyler.md).
4. Det, der findes i dag: afsnit 2-4 i [docs/plan-molekyler.md](plan-molekyler.md) (især "M1 i dag", "M2 i dag" og "Bygget i ..."), og teksterne i `js/data/molekyler.js` og `js/data/molekyler-byg.js` (`grep` efter de tekster, forløbet genbruger).
5. Billedet af Molekyler i dag: `docs/fable/E1-billeder/` (`ls`, og se de billeder, der viser Værkstedets molekyler).

### Hvad du skal levere
Én fil: **`docs/fable/E6-molekyler.md`**, højst ca. 10 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Kan det bygges, som det står? Hvad skal ændres først?
2. **Kernesætningen:** holder den, og er den for lang?
3. **Trinene:** for hvert trin, der skal ændres: hvad, hvorfor og et forslag til ny tekst (kort dansk, til en 13-årig). Tjek reglerne i skabelonen (3-6 trin, gæt i mindst to trin, én handling, højst ca. 15 og 20 ord, højst to ord pr. trin).
4. **Fakta:** de påstande i afsnit 6 i udkastet, der er forkerte, upræcise eller for sikre, med kilde. Skriv ikke det, der holder, op én for én.
5. **Opus' fire spørgsmål til jer** (afsnit 7 i udkastet): din anbefaling til hvert, kort.
6. **Det, der mangler,** fx en bedre første handling, et bedre gæt eller noget, der vil få barnet til at gå i stå.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, udkastet eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder. Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/molekyler.md](lige-nu/molekyler.md): "Fables tjek af drejebogen til Molekyler er skrevet, se `docs/fable/E6-molekyler.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E6-molekyler-noter.md` (hvad der er nyt, og hvor Opus er uenig) og retter drejebogen. Fables fil rettes ikke.
2. I svarer på spørgsmålene og giver go. Så bygges forløbet (Opus, høj effort).
