# AtomLab: indhold og plan

AtomLab skal lære en 13-årig om protoner, neutroner og elektroner, om grundstofferne og om kernereaktioner (fusion og fission). Det er et **laboratorium med opgaver**: man kan eksperimentere frit, men der er også opgaver, som giver stjerner og låser ting op. Alt er i 3D med glød og partikler.

## Lige nu
**Status til næste session står i [docs/lige-nu.md](docs/lige-nu.md)** (flyttet hertil fra DESIGN.md 6. november 2026, så en ny session kan læse den uden resten). Rammer du en merge-konflikt her, fordi en anden session har skrevet i det gamle "Lige nu", så flyt teksten over i `docs/lige-nu.md`.

Resten af planen i andre filer: [Ikke afprøvet](docs/ikke-afproevet.md) (til jeres runde på tabletten), [Idéer til senere](docs/ideer.md) og [Før vi deler AtomLab med andre](docs/foer-vi-deler.md).

## Sådan arbejder vi (jeres svar)
- Få et "go", før et større stykke arbejde går i gang, og spørg, når noget er uklart. I vil have ærlige svar, ikke at blive talt efter munden.
- Én PR for hvert færdigt punkt. Opus merger den selv til `main`, når testene er grønne (se nedenfor), så det kommer på GitHub Pages med det samme (https://espenohalloran.github.io/atomlab/). Bagefter startes arbejdsgrenen forfra fra `main`.
- Beslutninger og jeres svar skrives ind her med det samme, ikke kun i chatten.
- Det er kun jer, der bruger AtomLab indtil videre. Prototyper må derfor gerne ligge i den almindelige udgave (24. oktober 2026).
- Tabletten bruges lige meget på langs og på højkant. Lyd: ingen baggrundsmusik, de små lyde bliver.
- **Tests (jeres svar 24. oktober 2026):** Test, når det giver mening i forhold til prisen. I tester selv på den rigtige tablet. Derfor:
  - Mens der arbejdes: kun `node tests/koer-alle.mjs --ændret`. Før merge køres `node tests/koer-alle.mjs --ændret`. Vælger den selv alle tests (fordi fx `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret), køres alle. Hele samlingen køres kun eksplicit, når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål (fx at dele AtomLab med andre). Jeres ønske 29. oktober 2026: ikke vente på tests af ting, der næsten sikkert ikke er rørt. `main` er det, jeres søn bruger. Den koster få tokens, når den er grøn (én linje pr. test).
  - Skærmbilleder koster flest tokens. Tag kun billeder af det, der er ændret, og se kun de størrelser, hvor layoutet kan gå galt (fx pc og tablet på højkant).
  - Hvordan det føles med fingre, om det kører glat, og hvordan det ser ud på den rigtige skærm, tester I selv. Skriv i "Ikke afprøvet" ([docs/ikke-afproevet.md](docs/ikke-afproevet.md)), hvad I skal kigge efter.
  - Nye tests tjekker logik og tal (fx retninger, pladser og tekster), ikke hvert billede.
- **Tokens bruges med omhu (jeres svar 24. oktober 2026):** Sig det med det samme, når noget koster unødigt mange tokens (fx sider, miljøet ikke kan åbne, eller en hjælpeagent, der må søge mange gange). Ofte kan I let løse det, fx ved at tilføje et domæne under miljøets Network access.
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

- [x] **Trin 1: Grundskelet og Atomværkstedet**
- [x] **Trin 1b: Neutronernes rolle og ioner**
- [x] **Trin 1c: Flottere grafik og citater**
- [x] **Trin 1d: Nørd-fanen**
- [x] **Trin 2: Det periodiske system**
- [x] **Trin 3: Stjerneovnen (fusion)**
- [x] **Trin 4: Reaktoren (fission)**
- [x] **Trin 5: Batteriet**
- [x] **Trin 1d: Overskueligt værksted**
- [x] **Trin 6: Kosmos**
- [x] **Trin 7: Telefon, tablet og et samlet UI-review**
- [x] **Trin 8: Forbedringer efter det store review**
- [x] **Trin 9: Stjerneovnen lettere og med baggrund**
- [x] **Trin 10: Ting fra Stjerneovnen, der kan bruges andre steder**
- [ ] **Trin 11: Rettelser efter den store gennemgang**
- [x] **Trin 12: Ordforklaringer og fire nye fænomener i Kosmos**
- [x] **Trin 13: Årstiderne i Kosmos**
- [x] **Trin 14: Formørkelser i Kosmos**
- [x] **Trin 15: Forbedringer af Årstiderne og Formørkelser efter review**
- [x] **Trin 16: Kvasarens stråler, flere citater og kategorierne i Det periodiske system**
- [x] **Trin 17: Flot Jord og Måne med rigtige billeder fra NASA**
- [x] **Trin 18: Forbedringer efter F1**
- [x] **Trin 19: Saturn med måner og flyby, en sort himmel og små ønsker** (24. oktober 2026, PR #10-#14)
- [x] **Trin 20: Ny opbygning af Solsystemet og Kosmos (UX)** (U1-U4)
- [ ] **Molekyler:** M1a (Byttebørsen med Na + Cl) ✅ 7. november 2026, M1b (krystallen og de andre par) venter ([docs/plan-molekyler.md](docs/plan-molekyler.md))
- [ ] **Solsystemet:** Mars (M1-M8b lavet, M8c del 1 tilbage, [docs/plan-mars.md](docs/plan-mars.md)), så planeterne og overblikket ([docs/plan-solsystemet.md](docs/plan-solsystemet.md))

**Ikke lavet fra de gamle trin** (fra Trin 11, delvist lavet senere, tjekkes, før de tages op):
- Links mellem delene ("Se også"). Fremgangen i menuen er lavet (Trin 18).
- En kort guide i værkstedet. Batteriet har fået guide, "Næste skridt" og "Vis mig" (Trin 18).
- Tilgængelighed og app: dialoger, tastatur, en app på hjemmeskærmen og mindre download.
