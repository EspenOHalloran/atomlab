# Spor: Måner (Land på måner og månerne med mulige betingelser for liv)

*Startet 20. november 2026 (jeres ønske i gennemgangen i Småting: "Land på måner" får sit eget spor, så vi får taget hul på den). Et eget spor, fordi Solsystemet-sporet har Venus, S3b og Mars L2 i kø, og kun én session ad gangen må arbejde i et spor. Sporet læser fra Solsystemet (`js/solsystem/`, `js/kosmos/`), men ejer sine egne filer (`js/maaner*.js`, `js/maaner/`, `js/data/maaner/`) og rører kun Solsystemets filer med et go. Højst ca. 5 KB.*

**Grundlaget:** [fakta-maaner-liv.md](../fakta-maaner-liv.md) (Europa, Enceladus, Titan og Huygens' landing) og koereplanens afsnit "Planen efter planeterne" (Land på måner). **Jeres svar 12. november 2026 (Ja til anbefalingerne, afsnit 9 i faktafilen) gælder stadig:** Kernesætningen er forslag 1 ("Under isen på Europa og Enceladus er der et hav …, men ingen har endnu kunnet se efter, om der er liv"). Første handling er **snittet gennem Europa og Enceladus med tavlen med de tre ting** (vand, energi og stoffer, grøn = målt, gul = regnet eller gættet, grå = ukendt). **"Land med Huygens"** (nedstigningen spolet frem, ESA's billeder med credit) er det næste lille trin bagefter. Flyveturen gennem fontænen er trin 2 af første handling.

## Planen (et go før hvert trin)
1. ✓ **Drejebogen** (lavet 20. november 2026, [drejebog-maaner.md](../drejebog-maaner.md)): ét forløb "Under isen" (Europa og Enceladus, snit og tavle) og ét lille "Land med Huygens" (Titan), efter skabelonen fra [drejebog-tycho.md](../drejebog-tycho.md) og [drejebog-kvantefysik.md](../drejebog-kvantefysik.md), med den røde tråd, Forløb-klodsen og "Hvordan ved vi det?".
2. **Byg "Under isen"** i to trin: ✓ M2 (snittet, lupen, magnetfeltet, trin 1-2, 20. november 2026) og M3 (fontænerne, tavlen, trin 3-5, links).
3. **Flyveturen gennem fontænen** (M4, Cassini, trin 2 af første handling).
4. **Byg "Land med Huygens"** (den lille udgave) i to trin: M5a (nedstigningen og billederne fra luften) og M5b (landingen, kanal A og B).
5. Senere: Europa og Enceladus' overflade at stå på (kun tegnet ud fra fotos fra kredsløb, sig det ærligt) og Titans søer. Ikke planlagt.

## Senest lavet
**20. november 2026: M2, "Under isen" del 1** (Opus høj, status **prøve**, til jeres søn har prøvet). Fænomenet `underisen` i Solsystemet under Saturn ("Forsøg", så kloderne er de samme): Europa og Enceladus side om side i rigtig størrelse, snittet gennem Europa (træk på månen, "✂️ Skær igennem" eller skyderen "Snit": over halvvejs glider det selv) med is, hav, sten og jern i rigtig skala, lupen ved snittets kant (Jordens dybeste sted, 11 km, som en søjle ved havet) og magnetfeltet med kontakten "Hav" og Galileos måler. Forløbets trin 1-2 og "Det så du" med en **midlertidig kernesætning** (kun Europa, M3 sætter den valgte ind). Ordet `magnetfelt` i Ordbogen. Koden står i [kode/maaner.md](../kode/maaner.md), testen er `tests/maaner-underisen.mjs` (19 tjek). Skærmbilleder på telefon og tablet (begge retninger) er set. Det forrige står i [historikken](../arkiv/historik/maaner.md).

## Næste
**M3 ("Under isen", del 2) venter på jeres go.** Prompten (Opus, **høj**, kopiér):

> Spor: Måner. Navngiv chatten "Måner · M3: Under isen del 2". Tjek først i origin/main, at M3 ikke er lavet, og at sporet ikke har en aktiv session. Læs docs/lige-nu/maaner.md, docs/kode/maaner.md, docs/drejebog-maaner.md (afsnit 1, 3-6, 9-11, 14, 16-18), docs/kode/saturn.md (Enceladus) og tjekliste D og E. Byg M3: fontænerne i modlys og snittet gennem Enceladus (trin 3, `lavEnceladus` fra `js/solsystem/fontaener.js` bruges, ændres ikke), tavlen med kortene (`js/maaner/tavle.js`, data i `js/data/maaner/tavle.js`, testet i Node), Cassini i buen (trin 4), trin 5, drejebogens kernesætning i stedet for M2's midlertidige, "Det så du" med vejene, laboratoriets valg Europa / Enceladus / Begge, "Hvordan ved vi det?", ordet `fontæne` og linkene ved Europa og Enceladus (kun med Solsystemets go). `/faktatjek`, udvid `tests/maaner-underisen.mjs`, skærmbilleder på telefon og tablet (tavlen under scenen), docs/kode/maaner.md, og afslut med /faerdig.

## Spørgsmål til jer
Ingen lige nu (de seks er besvaret 20. november 2026).
