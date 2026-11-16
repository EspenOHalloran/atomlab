# Prompt: Fables brede eftersyn af UI og UX (E20)

*Skrevet 16. november 2026 efter jeres prøve af Gåderne på tabletten ("Måske vi skal have fable til at lave et tjek på ui/ux generelt på gåder og de andre nye dele"). **Gjort bredere samme dag efter jeres ønske:** "Det skal være logisk, intuitivt, elegant og flot. Det ligger mig meget på sinde, at løsningen er nem at navigere i og 'sparker' joy og wonder." Eftersynet gælder derfor hele programmet og ikke kun det nye. Opus og to Sonnet-hjælpeagenter har forberedt materialet (se "Det er forberedt"), så Fable kan bruge sin tid på at vurdere. Hører til sporet Småting. **Fable kan kun bruges til og med 16. november 2026.** Kun dokumenter, ingen kode.*

## Sådan startes den
- Egen session med Fable 5.2 i miljøet "Default". Effort: `high`. Svaret skrives i `docs/fable/E20-ux-nyt.md`. Opus skriver noter bagefter (`E20-ux-nyt-noter.md`).
- Første besked: "Læs `docs/prompt-fable-ux-nyt.md`, og gør det, der står under 'Opgaven'."

## Hvem og hvad
AtomLab bruges af en 13-årig dreng på en tablet (Samsung Galaxy Tab A11+, Chrome, mest på langs). Han bruger det, han koder ikke. Faren laver det. Kernen er [retning.md](retning.md): "forløb først", dybde i lag, og kernesætningen for hver del.

## Opgaven
Vurdér brugeroplevelsen af **hele programmet** (UI og UX, ikke fakta) set med en 13-årigs øjne på en tablet. Mål det med jeres fem ord:

| Ord | Hvad det betyder her |
|---|---|
| **Logisk** | Rækkefølgen giver mening. Det samme hedder det samme og ser ens ud overalt. Man ved altid, hvor man er. |
| **Intuitivt** | Man kan se uden at læse, hvad der kan trykkes på. Næste skridt er tydeligt. Vejen tilbage sidder samme sted overalt. |
| **Elegant** | Så lidt på skærmen ad gangen som muligt. Hver ting står ét sted. Overgangene er bløde. |
| **Flot** | Billedet i sig selv, og ét visuelt sprog på tværs af delene (farver, skrift, paneler, ikoner, knapper). |
| **Glæde og undring** | Øjeblikke, hvor han siger "wow" eller "hvad?!", og hvor nysgerrigheden trækker ham videre af sig selv. |

**Svar på:**
1. **De første fem minutter:** Fra han åbner programmet til den første "wow". Hvad sker der, hvor lang tid tager det, og hvor kan man miste ham?
2. **At finde rundt:** Er vejen fra ringen til en verden, til en del og hjem igen logisk? Hvor er der blindgyder, to veje til det samme, ting man ikke finder, eller forskellige måder at gå tilbage på? Brug [navigationskortet](fable/E20-forberedelse/navigation.md).
3. **Ét program:** Ser delene ud, som om de hører til det samme program? Skriv en lille **stilguide** (højst 10 regler), som alle delene skal følge, og nævn de dele, der bryder den.
4. **Næste skridt:** Er det altid tydeligt, hvad man kan gøre nu? Forstår man vinkene, "Spol frem", "Næste skridt" og Forløb-linjen?
5. **Glæde og undring:** Nævn de fem stærkeste "wow"-øjeblikke i dag og de steder, hvor der mangler et. Foreslå 3-5 små greb (overgang, lyd, belønning, overraskelse, noget man selv opdager), der giver mest undring for mindst kode.
6. **Hvad ville en 13-årig opgive**, og hvor keder han sig?
7. **Jeres fire fund fra prøven af Gåderne** (16. november 2026). Tag stilling til hvert:
   1. Kernesætningen virker: Efter Antistof kunne sønnen sige den uden hjælp.
   2. "Fra mindre til større" er ikke tydeligt. Det betyder den skala, gåden hører til (fra de mindste ting til hele Universet, [plan-gaader-3d.md](plan-gaader-3d.md)), ikke størrelsen på gåden. Skal skinnen sorteres sådan, og hvordan vises det, så en 13-årig forstår det uden forklaring (en skala under stien, ord i enderne)?
   3. Man "tvinges" ind i Antistof, før man ser de andre (med vilje). Føles det som en lås eller som undring? Hvad er det mindste, der bevarer undringen?
   4. Skinnen så hakket ud på tabletten. Det er rettet 16. november 2026 (blød kant, 30 % bredere, `js/gaader/streg.js`), men hele renderen kører uden kantudglatning (`antialias: false`). Er det værd at tage op for hele programmet?

**Svar med:**
- **De ti vigtigste fund**, sorteret efter, hvor meget de gør programmet nemmere at finde rundt i og mere fuldt af undring. For hvert fund: hvad, hvor, hvorfor, hvad man gør ved det, og størrelsen (lille: under en time, mellem: en session, stor: flere sessioner).
- **Stilguiden** (punkt 3).
- **Listen over "wow"-øjeblikke** og grebene (punkt 5).
- En kort liste over resten.
- **Det, der virker, og som ikke må ændres.**
- Højst ca. 20 KB. Skriv på dansk.

## Det er forberedt (læs dette først)
- [fable/E20-forberedelse/kendte-fund.md](fable/E20-forberedelse/kendte-fund.md): de kendte UI/UX-fund fra F1, E14, jeres noter og "Ikke afprøvet", med status. **Gentag dem ikke.** Du må gerne give dem en anden vægt (fx "det her er det vigtigste af det hele") eller sige, at et fund er forkert.
- [fable/E20-forberedelse/navigation.md](fable/E20-forberedelse/navigation.md): kortet over navigationen, lavet ud fra koden. Det fortæller det, et billede ikke viser: hvordan man kommer ind og ud af hver del, hvilke fælles mønstre hver del bruger, og hvad der er uens.
- **Nye skærmbilleder** (16. november 2026) i tablet på langs, tablet på højkant og telefon: [fable/E20-billeder/LISTE.md](fable/E20-billeder/LISTE.md). Menuen med verdenerne forrest, alle tolv dele, og Gåderne og Opdagelserne indefra (Antistof, skinnen efter Antistof og bogen om Huygens).
- **Ældre skærmbilleder**, der stadig gælder: [fable/eftersyn/billeder/LISTE.md](fable/eftersyn/billeder/LISTE.md) (14. november 2026: fænomenerne i Solsystemet og Kosmos, forløbene i træk og lagene "Hvorfor?" og "For nørder"), `docs/fable/E14-billeder/` (forløbene trin for trin) og [fable/tablet/LISTE.md](fable/tablet/LISTE.md) (fra en rigtig tablet, 23. oktober 2026, ældre udgave).
- Billederne fra testbrowseren er tegnet uden grafikkort. Gløden og farverne kan derfor se lidt anderledes ud end på tabletten, og animationerne er spolet frem.

## Hvad der ellers skal læses (kort)
CLAUDE.md (står i samtalen), [retning.md](retning.md) og [DESIGN.md](../DESIGN.md) (kun "Sådan arbejder vi" og grundreglerne). Læs ikke [fable/E14-forloeb-eftersyn.md](fable/E14-forloeb-eftersyn.md) og [fable/F1-overblik.md](fable/F1-overblik.md) igen: det vigtigste står i `kendte-fund.md`. Slå dem kun op, hvis et fund skal tjekkes. Kør ikke kode.

## Hvad der ikke skal ske
Ingen kode og ingen ændringer i `js/`, `index.html` eller `style.css`. Ingen faktatjek. Opus bygger bagefter, når I har sagt go til fundene.
