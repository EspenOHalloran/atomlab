# Spor: Måner (Land på måner og månerne med mulige betingelser for liv)

*Startet 20. november 2026 (jeres ønske i gennemgangen i Småting: "Land på måner" får sit eget spor, så vi får taget hul på den). Et eget spor, fordi Solsystemet-sporet har Venus, S3b og Mars L2 i kø, og kun én session ad gangen må arbejde i et spor. Sporet læser fra Solsystemet (`js/solsystem/`, `js/kosmos/`), men ejer sine egne filer (`js/maaner*.js`, `js/maaner/`, `js/data/maaner/`) og rører kun Solsystemets filer med et go. Højst ca. 5 KB.*

**Grundlaget:** [fakta-maaner-liv.md](../fakta-maaner-liv.md) (Europa, Enceladus, Titan og Huygens' landing) og koereplanens afsnit "Planen efter planeterne" (Land på måner). **Jeres svar 12. november 2026 (Ja til anbefalingerne, afsnit 9 i faktafilen) gælder stadig:** Kernesætningen er forslag 1 ("Under isen på Europa og Enceladus er der et hav …, men ingen har endnu kunnet se efter, om der er liv"). Første handling er **snittet gennem Europa og Enceladus med tavlen med de tre ting** (vand, energi og stoffer, grøn = målt, gul = regnet eller gættet, grå = ukendt). **"Land med Huygens"** (nedstigningen spolet frem, ESA's billeder med credit) er det næste lille trin bagefter. Flyveturen gennem fontænen er trin 2 af første handling.

## Planen (et go før hvert trin)
1. ✓ **Drejebogen** (lavet 20. november 2026, [drejebog-maaner.md](../drejebog-maaner.md)): ét forløb "Under isen" (Europa og Enceladus, snit og tavle) og ét lille "Land med Huygens" (Titan), efter skabelonen fra [drejebog-tycho.md](../drejebog-tycho.md) og [drejebog-kvantefysik.md](../drejebog-kvantefysik.md), med den røde tråd, Forløb-klodsen og "Hvordan ved vi det?".
2. **Byg "Under isen"** i to trin: ✓ M2 (snittet, lupen, magnetfeltet, trin 1-2, 20. november 2026) og ✓ M3 (fontænerne, tavlen, trin 3-5, links, 20. november 2026).
3. **Flyveturen gennem fontænen** (M4, Cassini, trin 2 af første handling).
4. **Byg "Land med Huygens"** (den lille udgave) i to trin: M5a (nedstigningen og billederne fra luften) og M5b (landingen, kanal A og B).
5. Senere: Europa og Enceladus' overflade at stå på (kun tegnet ud fra fotos fra kredsløb, sig det ærligt) og Titans søer. Ikke planlagt.

## Senest lavet
**20. november 2026: M3, "Under isen" del 2** (Opus høj, status **prøve**, til jeres søn har prøvet). Forløbet har nu alle fem trin: fontænerne på Enceladus i modlys (man drejer om bag månen), og bagefter åbner snittet sig selv gennem Enceladus (isen er under 5 km ved sydpolen), Cassini i en bue gennem sprøjtet, tavlen med de tre ting (`js/maaner/tavle.js`, data i `js/data/maaner/tavle.js`: man trækker fire kort på plads, og et kort på en forkert række glider selv videre med et vink), Europas søjle, der fylder sig selv, og Liv ("Ikke fundet. Ingen har endnu kunnet se efter."). Drejebogens kernesætning, tre veje i "Det så du", fire "Hvordan ved vi det?"-spørgsmål i panelet, ordet `fontæne` og linkene "Se under isen ›" ved Europa og Enceladus (jeres go). Laboratoriet: kontakten "Modlys", "Europa", "Enceladus" og "Begge" i bjælken (jeres valg), et tryk på en måne og tavlen, der kan foldes ud. Koden står i [kode/maaner.md](../kode/maaner.md), testen `tests/maaner-underisen.mjs` har 29 tjek. Skærmbilleder på pc, tablet (begge retninger) og telefon (begge retninger) er set. Det forrige står i [historikken](../arkiv/historik/maaner.md).

## Næste
**Prøven** af hele "Under isen" med jeres søn (punktet står i [ikke-afproevet.md](../ikke-afproevet.md)). Næste byggetrin er **M4: Flyv gennem fontænen** (valgt af orkestratoren 20. november 2026, kan ændres af jer; M5a "Land med Huygens" kommer bagefter). Prompten (Opus, **høj**, kopiér):

> Spor: Måner. Navngiv chatten "Måner · M4: Flyv gennem fontænen". Tjek først i origin/main, at M4 ikke er lavet, og at sporet ikke har en aktiv session. Læs docs/lige-nu/maaner.md, docs/kode/maaner.md, docs/drejebog-maaner.md (afsnit 1, 4-6, 10, 16-19), docs/kode/saturn.md (Enceladus og flybyen) og tjekliste D og E. Skriv først et kort afsnit i drejebogen om M4 (hvad man gør, hvad man ser, hvad der er ærligt talt, og hvordan trin 4's Gør bliver flyveturen, i stedet for Cassini i buen), og få et go. Byg så M4: Man sidder i Cassini og flyver gennem sprøjtet over sydpolen (fontaener.js læses og bruges, ændres ikke), fanger korn og gas og ser, hvad de indeholder (de fire kort fra `js/data/maaner/tavle.js` falder ud dér), og vejen "Flyv gennem fontænen ›" i "Det så du". `/faktatjek` (fx Cassinis laveste passage, ca. 49 km i oktober 2015, er ikke slået op endnu), udvid tests/maaner-underisen.mjs, skærmbilleder på telefon og tablet, docs/kode/maaner.md, og afslut med /faerdig.

Bagefter: **M5a: "Land med Huygens", nedstigningen** (drejebogens afsnit 7-8 og 18).

## Spørgsmål til jer
Ingen lige nu (de seks er besvaret 20. november 2026).
