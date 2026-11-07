# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Lige nu
**Status til næste session står i [docs/lige-nu.md](docs/lige-nu.md)** (en kort oversigt) og i én fil pr. spor i `docs/lige-nu/` (7. november 2026). Rammer du en merge-konflikt i `docs/lige-nu.md`, fordi en session, der startede før opdelingen, har skrevet i det gamle "Lige nu", så flyt teksten over i filen for sporet.

Resten af planen i andre filer: [Ikke afprøvet](docs/ikke-afproevet.md) (til jeres runde på tabletten), [Køreplanen](docs/koereplan.md) (det besluttede i rækkefølge), [Idéer til senere](docs/ideer.md) (det løse) og [Før vi deler AtomLab med andre](docs/foer-vi-deler.md).

## Sådan arbejder vi (jeres svar)
- Få et "go", før et større stykke arbejde går i gang, og spørg, når noget er uklart. I vil have ærlige svar, ikke at blive talt efter munden.
- Én PR for hvert færdigt punkt. Opus merger den selv til `main`, når testene er grønne (se nedenfor), så det kommer på GitHub Pages med det samme (https://espenohalloran.github.io/atomlab/). Bagefter startes arbejdsgrenen forfra fra `main`.
- Beslutninger og jeres svar skrives ind her med det samme, ikke kun i chatten.
- **Når et punkt er færdigt (jeres ønske 7. november 2026):** Skriv altid, hvordan næste punkt bedst startes: ny session eller samme, hvilken prompt (en fil i `docs/prompt-*.md` eller en tekst til at kopiere), og hvilken model og effort. Standard er en ny session til hver delopgave (se "Tokens" i CLAUDE.md).
- **Når I skal beslutte noget (jeres ønske 7. november 2026, gælder altid):** Præsentér sagen kort, giv min anbefaling, og lad jer vælge mellem et par muligheder (gerne som spørgsmål med valgmuligheder, anbefalingen først). Skriv ikke bare et åbent spørgsmål.
- **Parallelle sessioner (jeres svar 7. november 2026):** I kører ofte flere sessioner samtidig. Hver session hører til ét spor og skriver sin status i sporets egen fil i `docs/lige-nu/`. Reglerne står under "Parallelle sessioner" i CLAUDE.md.
- **Artefaktet "AtomLab Overblik" (jeres svar 7. november 2026):** opdateres, når en serie er færdig (fx hele Jupiter), ikke efter hver delopgave.
- Det er kun jer, der bruger AtomLab indtil videre. Prototyper må derfor gerne ligge i den almindelige udgave (24. oktober 2026).
- Tabletten bruges lige meget på langs og på højkant. Lyd: ingen baggrundsmusik, de små lyde bliver.
- **Tests (jeres svar 24. oktober 2026):** Test, når det giver mening i forhold til prisen. I tester selv på den rigtige tablet. Derfor:
  - Mens der arbejdes: kun `node tests/koer-alle.mjs --ændret`. Før merge køres `node tests/koer-alle.mjs --ændret`. Vælger den selv alle tests (fordi fx `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret), køres alle. Hele samlingen køres kun eksplicit, når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål (fx at dele AtomLab med andre). Jeres ønske 29. oktober 2026: ikke vente på tests af ting, der næsten sikkert ikke er rørt. `main` er det, jeres søn bruger. Den koster få tokens, når den er grøn (én linje pr. test).
  - Skærmbilleder koster flest tokens. Tag kun billeder af det, der er ændret, og se kun de størrelser, hvor layoutet kan gå galt (fx pc og tablet på højkant).
  - Hvordan det føles med fingre, om det kører glat, og hvordan det ser ud på den rigtige skærm, tester I selv. Skriv i "Ikke afprøvet" ([docs/ikke-afproevet.md](docs/ikke-afproevet.md)), hvad I skal kigge efter.
  - Nye tests tjekker logik og tal (fx retninger, pladser og tekster), ikke hvert billede.
- **Tokens bruges med omhu (jeres svar 24. oktober 2026, faste regler 7. november 2026 under "Tokens" i CLAUDE.md):** Samme eller bedre kvalitet for færre tokens. Sig det med det samme, når noget koster unødigt mange tokens (fx sider, miljøet ikke kan åbne, eller en hjælpeagent, der må søge mange gange). Ofte kan I let løse det, fx ved at tilføje et domæne under miljøets Network access.
- **Spørg om adgang først (jeres svar 29. oktober 2026):** Skal en opgave bruge et domæne, der ikke står på listen over åbne domæner, så spørg om adgang, *før* arbejdet går i gang, ikke først når siden viser sig at være blokeret. I åbnede library.si.edu og archive.org til citatet til Saturn.
- **Blokeret adgang (jeres svar 24. oktober 2026):** Er en netside eller et værktøj blokeret i miljøet, så sæt udviklingen på pause, og bed jer om adgang (navngiv domænet). Gå ikke videre med en nødløsning uden at spørge først.
- **Værktøjer (jeres svar 24. oktober 2026):** Billedværktøjerne må bruge Python-pakker (fx `rasterio`). Bed altid om værktøjer (eller adgang til netsider), når noget kan gøre arbejdet hurtigere, billigere eller bedre.
- **Mars på tabletten (jeres svar 24. oktober 2026):** kører fint med 8k-kortet. KTX2 er derfor ikke nødvendigt lige nu.

**Jeres mål for Solsystemet** (jeres ord): Man skal få oplevelsen af at besøge planeterne, også deres måner. Kvaliteten og oplevelsen skal være så flot og imponerende som muligt ("Det hele skal med", om Mars 24. oktober 2026).

**Himlen i Solsystemet (jeres ord 5. november 2026):** "Helt generelt skal baggrundene (det ydre rum) se realistiske ud, dog uden at det behøver decideret modelleres op." Der var prikker, der bevægede sig hurtigt, alle steder i Solsystemet. De var efter alt at dømme rumstøvet, som nu er skjult i hele Solsystemet.

**Svar fra 23. oktober 2026, som stadig gælder:** Fotos af grundstofferne kommer efter teksterne i lag, fra Wikimedia Commons med navn og licens. Solsystemets spørgsmål 1-5 følger planens forslag, indtil I siger andet. Noterne fra afprøvningen med jeres søn ligger i `docs/fable/soen-og-espens-noter.md`.

## Grundregler
- Dansk tekst i et enkelt sprog. Fagord forklares.
- Tæt på den rigtige fysik. Forenklinger siges ærligt.
- **Dybde i lag** (jeres princip, 23. oktober 2026): Brugeroplevelsen skal være i top, med flot UI og gode informationer de rigtige steder. Man skal ikke bombarderes med informationer, men de skal være lette at nå for den nysgerrige, fx med et klik. AtomLab skal have stor dybde og tyngde, men føles let, og man bestemmer selv, hvor dybt man vil bore. F1 foreslår, hvordan det kan gøres: Hver oplysning står ét sted ad gangen, og der er tre lag (altid fremme, "Hvorfor?" og "For nørder").
- Virker på pc (mus og tastatur) og tablet (fingre).
- Man åbner det via et link (GitHub Pages).

## Trin
*Alle trin med detaljer står i [docs/arkiv/trin.md](docs/arkiv/trin.md). Nye trin skrives her med et kryds, når de er færdige, og flyttes til arkivet, når de er gamle.*

- [x] **Trin 1-20** (Atomværkstedet, Det periodiske system, Stjerneovnen, Reaktoren, Batteriet, Kosmos, telefon og tablet, Saturn og den nye opbygning af Solsystemet og Kosmos). Trin 11 (rettelser efter den store gennemgang) er kun delvist lavet, se nedenfor.
- [ ] **Solsystemet:** Mars og Jupiter er færdige. Så de andre planeter og overblikket ([docs/plan-solsystemet.md](docs/plan-solsystemet.md), status i [docs/lige-nu/solsystemet.md](docs/lige-nu/solsystemet.md)).

**Ikke lavet fra de gamle trin** (fra Trin 11, delvist lavet senere, tjekkes, før de tages op):
- Links mellem delene ("Se også"). Fremgangen i menuen er lavet (Trin 18).
- En kort guide i værkstedet. Batteriet har fået guide, "Næste skridt" og "Vis mig" (Trin 18).
- Tilgængelighed og app: dialoger, tastatur, en app på hjemmeskærmen og mindre download.
