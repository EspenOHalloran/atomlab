# Spor: Måner (Land på måner og månerne med mulige betingelser for liv)

*Startet 20. november 2026 (jeres ønske i gennemgangen i Småting: "Land på måner" får sit eget spor, så vi får taget hul på den). Et eget spor, fordi Solsystemet-sporet har Venus, S3b og Mars L2 i kø, og kun én session ad gangen må arbejde i et spor. Sporet læser fra Solsystemet (`js/solsystem/`, `js/kosmos/`), men ejer sine egne filer (`js/maaner*.js`, `js/maaner/`, `js/data/maaner/`) og rører kun Solsystemets filer med et go. Højst ca. 5 KB.*

**Grundlaget:** [fakta-maaner-liv.md](../fakta-maaner-liv.md) (Europa, Enceladus, Titan og Huygens' landing) og koereplanens afsnit "Planen efter planeterne" (Land på måner). **Jeres svar 12. november 2026 (Ja til anbefalingerne, afsnit 9 i faktafilen) gælder stadig:** Kernesætningen er forslag 1 ("Under isen på Europa og Enceladus er der et hav …, men ingen har endnu kunnet se efter, om der er liv"). Første handling er **snittet gennem Europa og Enceladus med tavlen med de tre ting** (vand, energi og stoffer, grøn = målt, gul = regnet eller gættet, grå = ukendt). **"Land med Huygens"** (nedstigningen spolet frem, ESA's billeder med credit) er det næste lille trin bagefter. Flyveturen gennem fontænen er trin 2 af første handling.

## Planen (et go før hvert trin)
1. ✓ **Drejebogen** (lavet 20. november 2026, [drejebog-maaner.md](../drejebog-maaner.md)): ét forløb "Under isen" (Europa og Enceladus, snit og tavle) og ét lille "Land med Huygens" (Titan), efter skabelonen fra [drejebog-tycho.md](../drejebog-tycho.md) og [drejebog-kvantefysik.md](../drejebog-kvantefysik.md), med den røde tråd, Forløb-klodsen og "Hvordan ved vi det?".
2. **Byg "Under isen"** i to trin: M2 (snittet, lupen, magnetfeltet, trin 1-2) og M3 (fontænerne, tavlen, trin 3-5, links).
3. **Flyveturen gennem fontænen** (M4, Cassini, trin 2 af første handling).
4. **Byg "Land med Huygens"** (den lille udgave) i to trin: M5a (nedstigningen og billederne fra luften) og M5b (landingen, kanal A og B).
5. Senere: Europa og Enceladus' overflade at stå på (kun tegnet ud fra fotos fra kredsløb, sig det ærligt) og Titans søer. Ikke planlagt.

## Senest lavet
**20. november 2026: Drejebogen** ([drejebog-maaner.md](../drejebog-maaner.md), kun dokumenter, Opus høj). To forløb: "Under isen" (fem trin: snittet gennem Europa med lupen, magnetfeltet med kontakten "Hav", fontænerne i modlys, Cassini og tavlen med de tre ting, "Er der liv?") og "Land med Huygens" (fire trin: slip Huygens, gennem disen med Huygens' kamera, landingen med stenene, halvdelen gik tabt). Den røde tråd, "Hvordan ved vi det?", Gør det selv, links begge veje, tre ord (magnetfelt, fontæne, metan), prøven, billedernes licens i KILDER-stil, hvilke af Solsystemets filer sporet læser og ændrer (afsnit 17) og byggetrinnene M2-M5b. De nye påstande er faktatjekket af Opus (høj) i stedet for Fable (afsnit 16, linjen i [plan-fable.md](../plan-fable.md)). En ny fælde om disen på Titan står i [fakta-faelder-liv.md](../erfaringer/fakta-faelder-liv.md).

## Næste
**M2 ("Under isen", del 1) venter på jeres go.** Jeres svar 20. november 2026: "Ja til anbefalinger" (står i drejebogens afsnit 19). Titan ("Land med Huygens") bygges stadig, i sine egne sessioner (M5a og M5b). Prompten (Opus, **høj**, kopiér):

> Spor: Måner. Navngiv chatten "Måner · M2: Under isen del 1". Tjek først i origin/main, at M2 ikke er lavet, og at sporet ikke har en aktiv session. Læs docs/lige-nu/maaner.md, docs/drejebog-maaner.md (afsnit 1-6, 10, 13-14, 17-19 med jeres svar), docs/kode/kosmos.md (den fælles skal og "Nyt fænomen"), docs/kode/forloeb.md, docs/kode/saturn.md og docs/kode/jupiter.md (kun månerne), tjekliste D og E og docs/erfaringer/planeter-og-maaner.md. Byg M2: fænomenet `underisen` i Solsystemet lige efter Saturn (jeres svar 1), Europa og Enceladus side om side, snittet med lagene og lupen i `js/maaner/snit.js`, magnetfeltet med kontakten "Hav", forløbets trin 1-2 i `js/data/forloeb/under-isen.js` og linjerne i `js/solsystem.js`, `js/data/faenomener.js` og `js/data/forloeb/liste.js`. Rør ikke Solsystemets filer ud over de linjer (afsnit 17) og ikke Grafik G2's filer. `/faktatjek` for teksterne, 5-10 tests, skærmbilleder i telefon- og tabletstørrelse, docs/kode/maaner.md, og afslut med /faerdig.

## Spørgsmål til jer
Ingen lige nu (de seks er besvaret 20. november 2026).
