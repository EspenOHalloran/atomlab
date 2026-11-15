# Prompt: Fable gennemgår forløbene, før sønnen prøver dem (E14)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (B på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Forløb ([lige-nu/forloeb.md](lige-nu/forloeb.md)). Jeres valg 15. november: Der bygges videre, mens prøven med sønnen venter. Derfor er et kritisk blik på det byggede nu ekstra værd. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-forloeb-eftersyn.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med alle andre sessioner (Fable skriver kun i `docs/fable/`). Sporet Molekyler retter samtidig højre panel i Liv, så tag Livs panel med et forbehold.

---

## Prompten

Du skrev skabelonen for et forløb ([docs/fable/E3-forloeb.md](fable/E3-forloeb.md)). Nu er seks forløb og tre andre ting bygget efter den, og ingen af dem er prøvet af et barn endnu. Du skal gennemgå det, der faktisk er bygget (ikke drejebøgerne), som en kritisk læser, der tænker som en 13-årig.

### Det, der er bygget (status "prøve")
| Hvad | Teksterne | Drejebogen |
|---|---|---|
| Dit første atom (Værkstedet) | `js/data/forloeb/foerste-atom.js` | [drejebog-foerste-atom.md](drejebog-foerste-atom.md) |
| Når atomer mødes (Molekyler) | `js/data/forloeb/molekyler.js` | [drejebog-molekyler.md](drejebog-molekyler.md) |
| Opskriften i dig og Hvad står der i opskriften? (Liv) | `js/data/forloeb/opskriften.js`, `ordene.js` | [fable/E3-liv-drejebog.md](fable/E3-liv-drejebog.md) |
| Rejsen i tid og Hvordan kan det ske? (Tid) | `js/data/forloeb/tid.js` | [fable/E4-tid.md](fable/E4-tid.md) |
| Kosmos i fire grupper | `js/kosmos.js` (`grep` efter grupperne) | [lige-nu/tid.md](lige-nu/tid.md) |
| Antistof og skinnen (Gåderne) | `js/data/gaader.js` | [plan-gaader-3d.md](plan-gaader-3d.md) |
| Overblikket trin 1-3 (Solsystemet) | `js/data/sider/overblik.js` | [drejebog-overblik.md](drejebog-overblik.md) |

**Se det med egne øjne:** Start `python -m http.server 8000` i repoet, og tag skærmbilleder med Playwright (Chromium er installeret, se `tests/README.md` og `tests/vaerktoejer/`) i tabletstørrelse (1280 × 800) af hvert trin. Forløbene startes med `?forloeb=<id>#<skærm>` (fx `?forloeb=foerste-atom#vaerksted`, id'erne står i `js/data/forloeb/`). Læs også [docs/retning.md](retning.md) (budgettet for lagene) og [docs/guide-proeven.md](guide-proeven.md).

### Hvad du skal levere
Én fil: **`docs/fable/E14-forloeb-eftersyn.md`**, højst ca. 15 KB:
1. **Det vigtigste først** (højst 5 linjer): Hvilket forløb er stærkest, hvilket er svagest, og hvad skal rettes, før sønnen prøver dem?
2. **Pr. forløb** (kun det, der skal ændres): det trin, hvor en 13-årig vil gå i stå eller miste lysten, ord, der ikke er forklaret, sætninger over skabelonens grænser, fakta, der er forkerte eller for sikre (med kilde), og om kernesætningen kan siges bagefter. Giv et forslag til ny tekst.
3. **På tværs:** Er forløbene ens nok (samme knapper, samme rytme, samme "Det så du")? Er der et mønster, der går galt flere steder? Hvad skal byggeklodserne (Serie 2 nr. 5) tage med?
4. **Prøven:** Er spørgsmålene i drejebøgerne de rigtige? Hvilke tre forløb skal sønnen prøve først?

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet eller drejebøgerne. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Skærmbillederne må ligge i `docs/fable/E14-billeder/` (højst ca. 15, i lav kvalitet). Når filen er skrevet, **stopper du**.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
Opus skriver noterne (`docs/fable/E14-noter.md`, hvad er nyt, og hvor Opus er uenig), og rettelserne laves i hvert spor med jeres go.
