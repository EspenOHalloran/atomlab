# AtomLab

Et interaktivt 3D-program i browseren om atomer og grundstoffer for en 13-årig.
Ren HTML, CSS og JavaScript (ES-moduler) med Three.js. Der er intet byggetrin, ingen npm og ingen `package.json`.

## Hvad læses hvornår (læsekort)
Dokumenterne er delt op i små filer (6. november 2026), så en ny session ikke bruger det meste af sin plads på at læse alt. Kvaliteten afhænger af, at det rigtige stykke læses **før** arbejdet går i gang. Læs derfor hellere én lille fil for meget end én for lidt.

| Hvornår | Læs |
|---|---|
| **Altid, før det første svar** | Denne fil, [docs/lige-nu.md](docs/lige-nu.md) (hvad der senest er lavet, hvad der venter på et go, og hvad der er åbent) og [DESIGN.md](DESIGN.md) (sådan arbejder vi, grundregler, trin). Byg ét trin ad gangen, få et "go" før hvert trin, og sæt kryds, når et trin er færdigt. |
| Før du arbejder i koden | Oversigten [docs/kode.md](docs/kode.md) og den fil i `docs/kode/`, der beskriver de filer, du skal røre. Hold den opdateret. |
| Før arbejdet går i gang | Den tjekliste i [docs/tjeklister/](docs/tjeklister/), der passer: **C** ny regel eller spillogik, **D** ny del, skærm, knapper eller kontakter, **E** animation, grafik, shader, kort, kamera eller fælles funktion, **F** tests. Og emnet i [docs/erfaringer/](docs/erfaringer/) (oversigt i [docs/erfaringer.md](docs/erfaringer.md)), du arbejder med, fx Mars, flybyen eller tests. |
| Tekster med fakta | `/faktatjek` (tjekliste **B** og [de kendte fælder](docs/erfaringer/fakta-faelder.md)). Læs fælderne, før teksten skrives, ikke først bagefter. |
| Før arbejdet er færdigt | `/faerdig` (tjekliste **A** og de andre, der passer). |
| Når opgaven nævner dem | Planen i `docs/plan-*.md` eller prompten i `docs/prompt-*.md`, [Ikke afprøvet](docs/ikke-afproevet.md), [Idéer til senere](docs/ideer.md) og [Før vi deler](docs/foer-vi-deler.md). |

- **Søg i stedet for at læse alt:** Lange filer (planerne, `docs/fakta-*.md`, `docs/arkiv/`) læses med `grep` eller i det afsnit, der skal bruges. Store opslag på tværs af mange filer kan en Haiku-hjælpeagent lave.
- **Skriv nye erfaringer ind løbende** i den rigtige fil i `docs/erfaringer/`, både når noget virker godt, og når noget gik galt. Får en fejl en ny rodårsag, skal den også ind i [rodårsagerne](docs/erfaringer/rodaarsager.md) og en tjekliste.
- **Merge-konflikt i DESIGN.md, docs/erfaringer.md eller docs/kode.md** med en session, der startede før opdelingen: Flyt den nye tekst over i den nye fil (`docs/lige-nu.md`, `docs/erfaringer/*.md` eller `docs/kode/*.md`), og behold oversigterne.

**Hukommelse mellem sessioner:** Kun det, der står i repoet, huskes. En ny session kan ikke se tidligere samtaler. Skriv derfor beslutninger, idéer og brugerens svar ind i DESIGN.md, `docs/lige-nu.md`, `docs/ideer.md` eller en plan i `docs/` med det samme og ikke kun i chatten.

**Hold dokumenterne korte** (besluttet 5. november 2026, fordi hver session læser dem): Denne fil er regler og en kort oversigt (højst ca. 15 KB), og detaljerne står i `docs/kode/`. DESIGN.md holdes på ca. 10 KB (aftaler, regler og trin, ikke idéer eller status). "Lige nu" (`docs/lige-nu.md`) er højst ca. 10 KB, og listen "Ikke afprøvet" står for sig selv. Ingen fil i `docs/kode/`, `docs/erfaringer/` eller `docs/tjeklister/` bør vokse over ca. 20 KB. Bliver den det, så del den op efter emne, og ret oversigten. Når noget nyt er lavet, flyttes det forrige "Senest lavet" fra `docs/lige-nu.md` til [docs/arkiv/historik.md](docs/arkiv/historik.md). Færdige planer og status for færdige delopgaver flyttes til `docs/arkiv/`. Intet slettes, det flyttes.

**Skills:** `/faerdig` (før et stykke arbejde er færdigt) og `/faktatjek` (nye tekster med fakta) ligger i `.claude/skills/`.

**Valg af model:** Sig til, før en opgave går i gang, hvis en anden model vil løse den bedre eller lige så godt, men billigere. Begrund det kort. Kvaliteten må ikke blive dårligere.
- **Opus** (standard): kode, der kommer med i programmet, fysik og fakta, faktatjek, danske tekster og eftersyn.
- **Billigere hjælpeagenter**, når det ikke koster kvalitet: **Haiku** til at finde ting i filerne og opsummere lange testlogs, **Sonnet** til at læse kode og svare på spørgsmål om den og til rutinetjek.
- **Effort** (hvor grundigt modellen tænker): Sig til, hvis en anden indstilling passer bedre til opgaven. Lav effort til opslag, simple rettelser og hjælpeagenter, der søger eller læser. Medium eller høj til almindelig kode og tekster. Høj til svær fysik, svære fejl og faktatjek, hvor en fejl koster meget. **Xhigh (ekstra høj)** kun der, hvor en fejl er dyr, eller hvor problemet er svært at ramme første gang: det sorte hul (lysbøjning i en shader), faktagrundlaget for Molekyler M2 og Liv (Opus laver Liv nu, lige efter Molekyler) og for Tjernobyl, hvis Opus laver den før Fable 5.5. Ikke til små opgaver. Effort sættes kun på hjælpeagenter, når det står her, eller brugeren beder om det. Sessionens egen effort skifter brugeren selv.
- **Fable 5.1:** Hvad Fable skal lave, med hvilken effort og hvad det koster, står i [docs/plan-fable.md](docs/plan-fable.md). Fable køres som hjælpeagent med den effort, der står dér. Kort sagt: Opus forbereder, Fable vurderer, og Opus bygger. Fable laver faktagrundlaget (med kilder i en fil i `docs/`) og planen for Tjernobyl og eftersynet til sidst. Ved Molekyler, Solsystemet og Liv laver Opus udkastet, og Fable tjekker det. Små og mellemstore opgaver laver Opus selv.

## Hvem bruger det
- Programmet laves af en far til hans 13-årige søn. Sønnen bruger det, han koder det ikke selv.
- Al tekst i programmet er på dansk, i et sprog en 13-årig forstår. Fagord forklares første gang.
- Fysikken skal være **tæt på virkeligheden, men enkelt forklaret**. Forenklinger skal siges ærligt (fx at elektronringene er en forenklet model).
- Fakta skal være korrekte. Er du i tvivl om et tal eller en påstand, så lad det være eller skriv det mere forsigtigt.

## Kode
- Danske navne og korte danske kommentarer, som i resten af koden.
- Three.js 0.186.1 ligger i `lib/three/` (kun de filer, vi bruger) og indlæses via `importmap` i `index.html`. Skal der bruges en ny addon, kopieres filen fra npm-pakken `three@0.186.1` (`examples/jsm/...`) til `lib/three/addons/...`, sammen med de filer den selv importerer.
- Tilføj ikke frameworks, npm-pakker eller byggetrin uden at spørge først.
- Det skal virke på pc og tablet. Brug `LAV_KVALITET` (fra `scene3d.js`) til at skrue ned for effekter på touch-enheder.


## Filer (kort oversigt, detaljer i docs/kode/)
- `index.html` (alle skærme, dialoger, importmap, hjælpen med "Om AtomLab"), `style.css` (mørkt rum-tema, layout ved 1150, 820 og 560 px bredde og under 500 px højde), `LICENSE`.
- **Fælles:** `js/main.js` (skærmskift efter `#`, menuen), `js/scene3d.js` (renderer, kamera, glød, `LAV_KVALITET`, `ROLIG`, `TEST_HURTIG`, `nulstilStyring`), `js/atom.js` (klassen `Atom`), `js/effekter.js`, `js/lyd.js`, `js/beskeder.js` (undertekster, piller og loggen), `js/guide.js`, `js/lag.js` (foldebokse, "Hvorfor?"-kort, "Næste skridt"), `js/paneler.js`, `js/pause.js` (tidsknappen), `js/kontakt.js`, `js/ordforklaring.js`, `js/fremgang.js`, `js/forfra.js`, `js/fuldskaerm.js`, `js/hentning.js` (store billeder med bjælken "Henter …" og toningen).
- **Skærmene:** `js/vaerksted.js` (Atomværkstedet), `js/system.js` og `js/kategorikort.js` (Det periodiske system), `js/fusion.js` (Stjerneovnen), `js/reaktor.js` (Reaktoren), `js/batteri.js` (Batteriet), `js/ordbog.js` (Ordbogen), `js/kosmos.js` og `js/solsystem.js` (begge bygget på `js/faenomenskaerm.js`, med knapper i teksten fra `js/sideknap.js`).
- **Fænomenerne:** `js/kosmos/*.js`, én fil pr. fænomen i Kosmos og Solsystemet (Mars, Saturn, Jupiter, Jorden og Solen er de store). Fælles byggeklodser i `js/kosmos/faelles.js` og `js/kosmos/jorden.js`.
- **Grafikken til Solsystemet:** `js/solsystem/` (`hent.js` henter billederne for alle planeterne, klippeplanet, gasplanet, ringe, atmosfære, skyer, måner, landskabet til Stå på Mars og rovernes fotos (`panorama.js`), kameraets rejse, flybyen og navnene).
- **Data uden Three.js** (kan testes i Node): `js/data/` (grundstoffer, isotoper, kerne, orbitaler, fakta, ordbog, hvorfor, kategorier, citater, grundstoflag, himmel, solbane, skygge, ringe, landkort, vinde-jupiter og siderne i `js/data/sider/`).
- **Billeder:** `billeder/solsystem/` med `KILDER.md` (kilde og licens for hvert billede) og Python-værktøjerne, der laver dem (`lav_*.py`).
- **Nyt fænomen:** lav en fil i `js/kosmos/`, og sæt den ind i listen i `js/kosmos.js` eller `js/solsystem.js`. Hold tallene korrekte, og skriv i nørd-teksten, hvad animationen snyder med.

## Regler, der gælder på tværs
- Infopanelet i Værkstedet må ikke få en scrollbar. Nyt indhold skal ind i en af fanerne (Atom, Kerne, Fakta, Nørd) og være kort, eller ind i hjælpen.
- Et grundstof bliver "opdaget", når man har bygget et neutralt atom af det, og kernen kan hænge sammen. Først derefter kan man hoppe direkte til det i det lille periodiske system.
- Test altid i telefon- og tabletstørrelse, når layoutet ændres. Paneler, der kan rulles, får klassen `mere`.
- Fænomenerne bruger `dt` og `tid` fra `opdater(dt, tid)`, ikke `performance.now()`, så de står stille under pause.
- Navne i shaderkode må kun have ASCII-tegn (ikke æ, ø og å).
- Nye planeter og måner bruger kontakten "Navne" fra `js/solsystem/navne.js`, kameraets rejse (`rejse.js`) og flybyen (`flyby.js`).
- Konstanter, der hænger sammen med noget andet, står i `docs/kode/` (fx `BAKKE` i Stjerneovnen, stavene i Reaktoren og Mars' højder i `lav_mars.py`). Ændres de, skal det andet også ændres eller måles igen.
- Nye gemte data (localStorage) skrives i `docs/kode/gemte-data.md`.
- Billeder og netsider: Et domæne, der ikke er åbent i miljøet, spørges der om, før arbejdet går i gang (se "Sådan arbejder vi" i DESIGN.md).

## Automatiske tests
Testene ligger i `tests/` (Playwright-scripts, se [tests/README.md](tests/README.md)).
- Mens man arbejder og før merge: `node tests/koer-alle.mjs --ændret` (kun de tests, de ændrede filer kan påvirke, og alle, hvis en fælles fil er ændret).
- Hele samlingen (`node tests/koer-alle.mjs`, to ad gangen) kun, når en ændring rører fælles moduler eller data, som afslutning på en serie af opgaver og før et større mål.
- Lav en ny test eller nye tjek til nye funktioner. Skærmbilleder i alle størrelser: `node tests/vaerktoejer/skaermbilleder.mjs <skærm>`.
- Med `?test` i adressen findes `window.atomlabTest` med adgang til simuleringerne (listen står i `docs/kode/testadgang.md`). Testene tegner hurtigt uden glød og i lav opløsning (`TEST_HURTIG`). Forløb skal spoles frem eller holdes øje med (`waitForFunction`) i stedet for at ventes på.

## Afprøv
Moduler virker ikke ved dobbeltklik på `index.html`. Start en lille server i mappen:

```
python -m http.server 8000
```

og åbn http://localhost:8000. Den rigtige udgave ligger på GitHub Pages (se README).

