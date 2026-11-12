# Plan: Skærmlisten og hentning efter behov (10a)

*Skrevet 12. november 2026 i sporet Småting efter [prompt-skaermliste.md](prompt-skaermliste.md). Venter på et go.*

**Én sætning:** Menuen henter kun det, menuen bruger, og en skærm hentes og bygges første gang, den åbnes.

## Listen: `js/skaerme.js` (ny, ingen Three.js)
```js
export const SKÆRME = [
  { id: 'vaerksted', verden: 'atomer', titel: 'Atomværkstedet', modul: './vaerksted.js', status: 'færdig' },
  // system, fusion, reaktor, liv, batteri, solsystem, kosmos, ordbog
];
export const VERDENER = [ /* flyttet fra karrusel.js; dele udledes af SKÆRME */ ];
export async function hentSkærm(id) { /* import(), lav() én gang, samme løfte ved to kald */ }
```
- Hvert skærmmodul eksporterer de samme navne: `lav`, `start`, `stop`, `testAdgang` (de gamle navne beholdes ved siden af, så intet andet går i stykker).
- Felterne `html` og `css` er tomme nu og bruges i 10b.
- `VERDENER` flytter fra `karrusel.js`. Karrusellen, "Din fremgang" og `fremgangPrDel()` bruger listen.

## Det, menuen skal bruge uden skærmene
- **Opgaverne** (ren data, ingen funktioner) flytter fra `vaerksted.js`, `fusion.js`, `reaktor.js` og `batteri.js` til `js/data/opgaver.js`. Modulerne importerer dem derfra. Livs ligger allerede i `js/data/liv/`.
- **Fænomenernes id'er** for Kosmos og Solsystemet (til "x af y set") og `NØGLER` kommer i `js/data/faenomener.js`. En test tjekker, at listen passer med skærmenes egen liste.
- **`flytGemt()`** (det gemte fra før 26. oktober) køres ved start ud fra de samme id'er.
- **Knapper med `data-gaa` og `åbnFænomen`** flytter fra `faenomenskaerm.js` til et lille fælles modul. I dag virker de kun, fordi Kosmos altid er hentet.
- **"Mere i Ordbogen ›"** sender en begivenhed, før Ordbogen findes. `main.js` gemmer den sidste og giver den videre, når Ordbogen er bygget.
- **Hoppet fra Det periodiske system til Værkstedet** (`åbnGrundstof`): henter Værkstedet først og skifter så skærm.

## Skærmskiftet
1. `#` skifter. Er skærmen ikke hentet, bliver den gamle skærm stående, og "Henter …" vises (`js/hentning.js`, først efter 1 s).
2. Når skærmen er bygget: Tjek, at `#` stadig peger på den (man kan have trykket tilbage). Så stop den gamle og start den nye som i dag.
3. Fejler hentningen (fx intet net): en kort besked og tilbage til menuen.
4. Bjælken "Henter AtomLab" ved start venter på den første skærm (fx et link direkte til `#solsystem`). `FORVENTET` i `index.html` sættes til det nye antal filer for menuen.

## Testene
- `window.atomlabTest` sættes først, når den første skærm er vist (som i dag, hvor alt er bygget før). Det gør testene med `waitForFunction(() => window.atomlabTest && …)` uændret gyldige.
- Skærmenes adgang (`atomlabTest.fusion` osv.) bliver getters, der giver skærmens `testAdgang`, når den er hentet. Ellers kommer en tydelig fejl ("skærmen er ikke hentet, brug skiftSkærm").
- En ny hjælper `skiftSkærm(page, id)` i `tests/hjaelp.mjs` sætter `#` og venter, til skærmen er vist. Ca. 25 steder i testene, der sætter `location.hash` og straks bruger skærmen, skal bruge den. Testene kører altså den rigtige hentning efter behov, ikke en særlig testudgave.
- Ny test `skaermliste.mjs` (6-8 tjek): Menuen henter ingen skærmmoduler og ingen Three.js-addons fra skærmene, fremgangen og ✓ passer uden at hente, hver skærm åbner fra `#`, hoppet System → Værksted, Ordbogens link og `data-gaa` til et sted i Solsystemet, tilbage under hentning og listen over fænomener.

## Rækkefølgen (én skærm ad gangen, `--ændret` efter hver)
0. Måling før (`maal-eftersyn.mjs`, kun menuen). `skaerme.js`, `js/data/opgaver.js`, `js/data/faenomener.js`, `data-gaa`, hentning og testadgangen i `main.js`, men alle skærme bygges stadig ved start.
1. Ordbogen (mindst, ingen 3D-afhængighed), så Batteriet, Reaktoren og Stjerneovnen.
2. Liv.
3. Det periodiske system og Værkstedet (hænger sammen: `kategoriKnap`, `åbnGrundstof`).
4. Solsystemet og Kosmos (de tungeste, `flytGemt`, `ventSted`).
5. Hele testsamlingen, måling efter og dokumenterne (`docs/kode/faelles.md`, `testadgang.md`, CLAUDE.md "Nyt fænomen" og "Filer").

## Risici
- En skærm, der i dag regner med, at en anden er bygget, ses først, når den åbnes alene. Derfor åbner den nye test hver skærm som den første.
- Tests, der kun venter med `waitForTimeout`, kan blive ustabile. De rettes til at vente på skærmen.
- Status "prøve" vises ikke anderledes endnu (det er nr. 13 med `?lab`).

## Jeres svar (12. november 2026)
Go til planen med Opus' anbefalinger: Fable læser den ikke igennem. Liv har status "prøve" (L1-L2 er ikke prøvet af et barn), og resten er "færdig".
