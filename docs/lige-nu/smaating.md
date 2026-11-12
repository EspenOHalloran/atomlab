# Lige nu: Småting

*Spor i [oversigten](../lige-nu.md) til små rettelser på tværs, tests, dokumenterne og arbejdsgangen. Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/smaating.md](../arkiv/historik/smaating.md). Højst ca. 5 KB. Sidst opdateret: 12. november 2026.*

**Senest lavet (12. november 2026): 10a, skærmlisten og hentning efter behov** ([plan](../arkiv/plan-skaermliste.md), jeres go: "go med dine anbefalinger", ingen gennemlæsning af Fable, Liv har status "prøve").
- `js/skaerme.js`: listen over delene (id, verden, titel, modul, status) og verdenerne. Hver skærm hentes med `import()` og bygges første gang, den åbnes. "Henter Kosmos …" efter 1 sekund, og en hentning, der fejler, beder om at genindlæse siden (browseren husker en mislykket `import()`).
- Det, menuen bruger, står i `js/data/opgaver.js` og `js/data/faenomener.js`. Fem ting virkede kun, fordi alt blev bygget ved start, og er rettet: knapperne med `data-gaa` (nu `js/gaa.js`, også `system:55`), "Mere i Ordbogen ›", hoppet System → Værksted, det gemte fra Kosmos og panelerne, der kan rulles.
- **Menuen før → efter** (`maal-eftersyn.mjs`, lokal server uden komprimering): 4,4 → 2,7 MB (egen kode 2,1 → 0,4 MB, Three.js er de 2,1), 149 → 48 filer, 6,7 → 0,9 s på pc, heap 12,5 → 5,6 MB. `FORVENTET` i index.html er 46.
- Testene: `tests/hjaelp.mjs` venter selv på skærmen efter `goto`, `reload`, `evaluate` og `click` (`atomlabTest.klar()`). Ny test `skaermliste` (17 tjek). Hele samlingen består. `aarstider` fejlede én gang under belastning (Åbne punkter).
- Afvigelse fra planen: Alle skærme blev gjort "dovne" på én gang (fundamentet gjorde det), ikke én ad gangen. Hele samlingen dækkede det.

**Også lavet (12. november 2026):** Faktagrundlaget for månerne med mulige betingelser for liv (emne 2 i prompt-faktagrundlag): [fakta-maaner-liv.md](../fakta-maaner-liv.md) med Europa, Enceladus, Titan, Huygens' landing, kortene og licenserne, hvad der er målt og gættet, fælderne og fire spørgsmål til jer til sidst.

**Også lavet (12. november 2026):** Faktagrundlaget for Strøm og magneter og Lys (emne 3): [fakta-strom-og-lys.md](../fakta-strom-og-lys.md) med Fælles Mål tjekket i kilderne (bekendtgørelsen og udkastet til fagplanen fra juni 2026), strøm, magneter, Ørsted, induktion, lys, spektrallinjer, flammefarver, radiobølger, tre dele at gøre med hænderne, fælderne og fire spørgsmål til jer til sidst. uvm.dk, emu.dk og www.bipm.org er åbnet i miljøet "Default".

**Næste:** 10a er færdig, så parallelle sessioner er billigere igen (de rører ikke længere skærmenes start i `main.js`). 10b (egen HTML og CSS pr. skærm) sker gradvist, først med Molekyler. Faktagrundlagene kan køre parallelt ([prompt-faktagrundlag.md](../prompt-faktagrundlag.md), én session pr. emne).

**Lille opgave (kan tages når som helst):** Citatet `tycho` i `js/data/citater.js` har en engelsk oversættelse som `original`. Prompt til en ny session (Opus, effort medium): *"Spor: Småting. Læs docs/fakta-videnskabsfolk.md (afsnit 1, Tycho Brahe, punktet om citatet `tycho`). Ret citatet `tycho` i js/data/citater.js, så `original` er Tychos latin fra De nova stella (faksimilen 1901, archive.org `operumprimitiasd00brahuoft`), og så den danske `tekst` er vores egen oversættelse af netop det latin. Kør /faktatjek på citatet og /faerdig."*

Desuden i Småting: "Ikke afprøvet" ned under ca. 10 punkter (resten flyttes til arkivet, Retningen), testen `mars` (585 sekunder) delt i to, og faktatjekket af `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` fra før (én session pr. fil med `/faktatjek`, startet i miljøet "Default", hvor domænerne nu er åbne, se "Miljøet" i [aabne-punkter.md](aabne-punkter.md)).
