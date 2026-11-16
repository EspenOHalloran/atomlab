# Prompt: "For nørder" bliver til "Vil du vide mere?" (Småting)

*Forberedt 16. november 2026 efter brugerens feedback: "For nørder" lyder lidt off. Brugeren vil helst have **"Vil du vide mere?"** ("Gå dybere" var nummer to). Kør som en ny session i sporet Småting med Opus og medium effort.*

## Prompt (kopiér)

> Spor: Småting · "Vil du vide mere?" i stedet for "For nørder".
> Læs CLAUDE.md, docs/lige-nu/smaating.md, DESIGN.md, docs/prompt-vil-du-vide-mere.md og tjekliste D. Tjek først i origin/main, at det ikke er lavet.
> Skift navnet alle steder, og byg den nye præsentation som beskrevet i prompt-filen. Få et go til trin 2, før det bygges.

## Hvad og hvorfor
- "For nørder" sætter en mærkat på den, der læser. "Vil du vide mere?" er en invitation, og den siger, hvad man får.
- Mærkaten bruges på ca. 20 steder: `index.html` (Molekyler: `byg-nørd`, `knald-nørd`, `bytte-nørd`), `js/faenomenskaerm.js` (`side.nørd` i `sideHTML`, alle fænomener i Kosmos og Solsystemet), `js/lag.js`, `js/liv.js`, `js/molekyler.js`, `js/gaader.js`, `js/data/opdagelser/huygens.js`, `js/data/liv/*.js`, `js/data/sider/*.js`, `js/data/forloeb/ordene.js` og nogle `js/kosmos/*.js`. Find dem alle med `git grep -n "For nørder"`.
- Værkstedets fane **"Nørd"** (`index.html:247`) er for smal til en lang tekst. Forslag: **"Mere"** med titlen "Vil du vide mere?".

## Trin
1. **Navnet:** "For nørder" → "Vil du vide mere?" overalt, også i hjælpen og i de tekster, der henviser til boksen (fx "læs mere under For nørder"). Fanen "Nørd" → "Mere". Klasser og id'er (`nørd`, `side-nørd`, `data-lag="…-nørd"`) bliver som de er, så gemte data (`docs/kode/gemte-data.md`, foldeboksenes tilstand) og testene virker. Ret tekster i testene, der leder efter teksten.
2. **Præsentationen (anbefaling, skal have et go):** Boksen står i dag med samme vægt som de andre emner. Gør den i stedet til en lille, lysere linje nederst: "Vil du vide mere? ›", der folder det dybere stof ud. Den står altid sidst, med lidt luft over, og uden kort tekst ved siden af (`lag-kort`), så den ikke ligner endnu et emne. "Ærligt talt" (hvad animationen snyder med) er allerede sin egen boks og bliver, som den er.
3. Skærmbilleder af Molekyler, en planet og Værkstedets fane i telefon- og pc-størrelse. `node tests/koer-alle.mjs --ændret`, og hele samlingen, fordi fælles moduler ændres.

## Må ikke røres
Faktateksterne selv (kun overskriften skifter). Ingen nye ord i ordbogen.
