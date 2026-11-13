# Prompt: Fable vurderer Gåderne i 3D og vælger gåderne 6-10

*Skrevet 13. november 2026 efter jeres go ("Koncept + liste før G4a"). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Status"). Hører til sporet Småting. Opus har skrevet planen ([plan-gaader-3d.md](plan-gaader-3d.md)). Fable vurderer konceptet og vælger gåderne 6-10, før G4a bygges. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 5-10 $. Fable læser ca. 100 KB og skriver højst ca. 12 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-gaader-3d.md`, og gør det, der står under 'Prompten'."

---

## Prompten

Gåderne er fem kort i Biblioteket om det, videnskaben ikke ved endnu (sort hul, liv andre steder, livets begyndelse, antistof og mørkt stof). I dag er de en side med tekst. Brugeren vil have dem i **fuld 3D med "sense of wonder"** (deres ord står øverst i planen): ét univers, hvor gåderne svæver, og et tryk flyver ind. Der skal være plads til 10 gåder. Opus har skrevet planen, og Opus bygger bagefter i fire sessioner (G4a-G4d). Du kan ikke spørges igen efter 16. november 2026.

### Målet
To ting:
1. **Konceptet:** Vil det her give en 13-årig, der er alene med en tablet, en ægte følelse af undren, og vil det samtidig få ham til at sige kernesætningen? ("Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.") Hvor er planen for tam, for pyntet, for dyr eller for kompliceret? Hvad er det ene øjeblik i hver gåde, han vil vise til en ven?
2. **Gåderne 6-10:** Hvilke fem gåder skal fylde pladserne, og hvad er det sikre, det usikre og fælderne i hver?

Sig det, når noget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen) og [docs/retning.md](retning.md).
2. **Planen:** [docs/plan-gaader-3d.md](plan-gaader-3d.md) (hele) og afsnittene "Kernesætningen", "Hvor Gåderne ligger" og "Valgt fra" i [docs/plan-gaader.md](plan-gaader.md).
3. **Teksterne på de fem kort:** `js/data/gaader.js` (`grep -n "spørgsmål\|spørg:\|så:" js/data/gaader.js`, så du ser trinene uden at læse det hele).
4. **Faktagrundlaget:** [docs/fakta-gaader.md](fakta-gaader.md), afsnittene "Hvilke fem bør med?", "Reserven" og "Fælder". Og "Hvor stopper kvanteverdenen?" i [docs/drejebog-kvantefysik.md](drejebog-kvantefysik.md) (`grep -n -i "gåde" docs/drejebog-kvantefysik.md`).
5. **Det, der kan genbruges i 3D:** de første 40 linjer af `js/kosmos/linse.js` (lysbøjningen) og listen over funktioner i `js/kosmos/faelles.js` (`grep -n "^export" js/kosmos/faelles.js`). Fænomenerne i Kosmos står i `js/kosmos/` (`ls`).
6. **Billeder af AtomLab:** `docs/fable/E1-billeder/` (`ls`, og se et par billeder fra Kosmos og Biblioteket), så du ved, hvordan programmet ser ud.

### Hvad du skal levere
Én fil: **`docs/fable/E8-gaader-3d.md`**, højst ca. 12 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Skal G4a bygges, som planen står? Hvad skal ændres først?
2. **Universet (oversigten):** Virker ét rum med en sti fra det mindste til det største? Hvad skal det første, man ser, være, og hvad er det første, man gør (Retningen: "Gør før læs")? Hvad med de slørede pladser, der ikke er bygget?
3. **De fem scener:** For hver gåde: wow-øjeblikket (det, han vil vise en ven), og om scenen i trin 2 viser grænsen for det, vi ved, ærligt. Foreslå det, der er stærkere, kort og konkret (hvad man ser, og hvad man gør). Påpeg scener, der kan lære ham noget forkert (fx et punkt i midten af det sorte hul eller mørkt stof som noget sort).
4. **Gåderne 6-10:** Fem gåder i rækkefølge med spørgsmålet (som barnet ville stille det), én linje om det sikre og det usikre, de vigtigste fælder, hvor den hører til i programmet ("Se det selv") og wow-øjeblikket i 3D. Kandidaterne i planen er mørk energi, Planet 9, "Hvor stopper kvanteverdenen?", "Hvorfor går tiden kun fremad?", neutrinoens masse, Hubble-spændingen og "Hvad var der før Big Bang?". Du må gerne foreslå andre. Sig, hvilke der ikke egner sig til en 13-årig, og hvorfor.
5. **Det, der mangler eller er for meget,** fx lyd, en måde at komme tilbage på, eller noget, der vil få ham til at gå i stå eller kede sig.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, planen eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af [fakta-fælderne](erfaringer/fakta-faelder.md), hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder til de nye gåder. Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/smaating.md](lige-nu/smaating.md): "Fables vurdering af Gåderne i 3D er skrevet, se `docs/fable/E8-gaader-3d.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E8-gaader-3d-noter.md` (hvad der er nyt, og hvor Opus er uenig) og retter [plan-gaader-3d.md](plan-gaader-3d.md). Fables fil rettes ikke.
2. I svarer på spørgsmålene og giver go til G4a (Opus, høj).
