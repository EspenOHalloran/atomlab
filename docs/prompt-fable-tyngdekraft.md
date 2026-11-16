# Prompt: Fable og tyngdekraften som gåde

*Skrevet 16. november 2026 efter jeres spørgsmål under prøven af Gåderne: "Bør tyngdekraft ikke være en gåde? Den er velbeskrevet i form af, hvor meget den trækker, men ingen ved vel *hvorfor* den trækker?" **Jeres svar:** Ideen skal arbejdes mere, og Fable skal gøre det. Det må gerne prioriteres. Hører til sporet Småting. **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Status"), så tag den først i køen, hvis den skal nå det. Kun dokumenter, ingen kode.*

## Sådan startes den
- Egen session med Fable 5.2 i miljøet "Default". Effort: `high` (omstridt stof, og det er nemt at skrive for sikkert).
- Første besked: "Læs `docs/prompt-fable-tyngdekraft.md`, og gør det, der står under 'Opgaven'."
- Svaret skrives i `docs/fable/E19-tyngdekraft.md`. Opus skriver noter bagefter, som ved de andre (`E19-tyngdekraft-noter.md`).

## Opgaven
Afgør, om og hvordan **tyngdekraften** kan blive en gåde i Gåderne ([plan-gaader-3d.md](plan-gaader-3d.md)), og lav faktagrundlaget, hvis den kan.

**Opus' første vurdering (ikke faktatjekket, skal prøves af):**
- Newton beskriver *hvor meget* tyngden trækker. Einstein giver et slags hvorfor (masse krummer rumtiden, og tingene følger den krumme vej), og det er målt mange gange. "Ingen ved, hvorfor den trækker" er derfor **for groft**, og kortet må ikke lære det.
- Den rigtige åbne del er snævrere: (a) Der er ingen teori om tyngdekraft, der passer sammen med kvantefysikken, og gravitonen er aldrig set (tyngdebølger er målt, LIGO 2015, arXiv:1602.03837). (b) Tyngdekraften er utroligt meget svagere end de andre kræfter, og ingen ved hvorfor. (c) Mørkt stof og mørk energi kan i en lille mindretalsversion være tyngdekraft, der skal ændres (MOND, Milgrom 1983), men det hører til de andre kort.
- I [fakta-gaader.md](fakta-gaader.md) står kvantetyngdekraft som "ikke et kort", fordi den var svaret på "Hvordan finder vi ud af det?" ved det sorte hul. Brugeren vil nu have den i overvejelse som egen gåde. Vurdér, om det kan stå sammen med kortet om Sort hul uden at gentage det, og med "Hvor stopper kvanteverdenen?" (det mindste lys på skinnen, senere med Kvantefysik forløb 1).

**Svar på:**
1. Er der en gåde om tyngdekraften, som en 13-årig kan forstå, og som holder for kernesætningen ("Videnskaben er ikke færdig. Jeg kan nævne en gåde, ingen har løst, og sige, hvordan forskerne prøver at løse den.")? Hvilken formulering af spørgsmålet (fx "Kan tyngdekraft være kvante?" eller "Hvorfor er tyngdekraften så svag?"), og hvorfor den og ikke de andre?
2. Hvis ja: faktagrundlag i samme form som [fakta-gaader.md](fakta-gaader.md) (sikkert, usikkert, fælder, hvad der er målt, hvad der er et bud, hvad ingen har et bud på, og hvilke forsøg og årstal der findes, med kilder). Skriv, hvad en 13-årig må høre, og hvad der ville være for sikkert.
3. Hvor ligger den på skinnen (fra det mindste til det største), og hvad er "det ene øjeblik" i scenen? Hvilket sted i programmet kan "Se det selv" pege på (Rumtid i Kosmos, Solsystemets overblik, Tid og rum)?
4. Hvis nej: Skal den være et "Hvorfor?"-kort i Tid og rum i stedet? Skriv så udkastet til kortet.
5. Er der andre gåder, der ligner (fx tidens pil, hvorfor naturkonstanterne har de værdier), som skal med eller fra, så listen på 10 ikke bliver for tung på tyngdekraften og kvantefysikken?

## Hvad der skal læses (kort)
1. CLAUDE.md (står i samtalen) og [retning.md](retning.md).
2. [plan-gaader-3d.md](plan-gaader-3d.md): kernesætningen, de tre slags streg, tabellen over gåderne og "Ikke egne kort".
3. [fakta-gaader.md](fakta-gaader.md): `grep -n -i "tyngde\|kvantetyngde\|MOND\|singularitet"`, og afsnittet "Hvilke fem bør med?".
4. [fable/E8-gaader-3d.md](fable/E8-gaader-3d.md) (afsnit 4, fakta og fælder for 6-10) og [fakta-kvantefysik.md](fakta-kvantefysik.md) (`grep -n -i "gåde\|tyngde"`).
5. [erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md): læs fælderne, før du skriver.

## Hvad der ikke skal ske
Ingen kode og ingen ændringer i `js/`. Ingen nye kort i programmet. Opus bygger bagefter, når I har sagt go.
