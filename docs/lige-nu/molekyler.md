# Lige nu: Molekyler

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/molekyler.md](../arkiv/historik/molekyler.md). Højst ca. 5 KB. Sidst opdateret: 17. november 2026 (Liv L4, turen "Fejlen, der hjalp").*

**Senest lavet (17. november 2026): Liv L4, turen "Fejlen, der hjalp".** Tur 4 i Liv efter [drejebog-liv.md](../drejebog-liv.md), afsnit 3: Sæt en bakterie på pladen (den fylder feltet uden medicin: "over en milliard" på 10 timer), find det sted, hvor de få med en fejl bryder ind i det første bånd med antibiotika, find hver ny gren gennem båndene med ×30, ×300 og ×3.000, og find en bakterie med fejlen i feltet uden medicin (naturligt udvalg). Pladen er den ene halvdel af Bayms (2016), en model med fast frø (`js/data/liv/plade.js`) og én InstancedMesh. **Leg frit: pladen** med to tal fremme og kontakten "Uden mellemtrin" (artiklens fig. 2) med ★-opgaven "Spring båndene over" (`liv-spring`). **Kort 4 og 5:** "Sker det også hos mennesker?" (seglcellen og malaria, `livSegl` linker dertil, og sætningen om malaria flyttede med) og "Hvorfor kan de fleste danskere tåle mælk?". Ordene antibiotika og naturligt udvalg. Tur 3 slutter med "Næste tur: Fejlen, der hjalp ›" (kortet om forældrene står kun ved Cellekernen). Ændret fra drejebogen: trin 2 siger "de få" i stedet for "én" (pladen og forsøget har ofte flere grene). Testen `liv-fejlen` (12 tjek). Koden står i [kode/liv-ture.md](../kode/liv-ture.md).

**Til sessionen med forløbet som sti (nr. 1, ejer `js/forloeb.js`):** Kopien og Fejlen behøvede ingen ændring i klodsen. Fejlen tæller også tryk i scenen kun i `gæt` og `gør` (`forløbVenter()`). Det, B i stilguiden skal tage med for Liv: (1) Tryk i 3D i Liv tæller kun i fasen `gør` (`tryk` i `js/liv.js`), også i Kopiens trin 3. Skal scenen virke under gættet (B1), skal den betingelse fjernes dér. Lynlåsen kan allerede trækkes under gættet i trin 1. (2) Alle fire trin i Kopien har en `visMig`, der gør hele trinet (trin 2 sætter begge bogstaver, trin 4 springer til den kopi, hvor fejlen bliver), så "Næste ›" uden handling (B2) kan kalde den og vente på `færdig()`. Trin 3 og 4 tager ca. 2-4 sekunder bagefter (animationen). (3) Gættenes `efter` er ens i alle tre ture i Liv. B4 ("hvert gæt får sit eget korte svar") kræver et nyt felt i dataene, fx `svar` pr. gæt.

**Status "prøve":** "Når atomer mødes" og Livs ture 1, 2, 3 ("Kopien") og 4 ("Fejlen, der hjalp", 17. november 2026) venter på prøven med sønnen (drejebogernes "Prøven", linjerne i [ikke-afproevet.md](../ikke-afproevet.md)).

**Jeres svar (9. november 2026):** Skærmbilledet af stigen blev godkendt: udseendet som nu, basernes farver A grøn, T rød, G gul og C blå, og resten af L1 blev lavet i samme session.

**Næste (venter på jeres go):**
- **Molekyler (Serie 1 nr. 3) er bygget** (14. november 2026). Det næste er prøven med sønnen. Idéen om et kort forløb "Vand af en gnist" (knaldgassen) og et om vandets form står i drejebogens afsnit 3.
1. **L5, delen "Begyndelsen"** ([drejebog-liv.md](../drejebog-liv.md), afsnit 4): Millers kolbe, hinden, RNA'et og trappen, en egen del i Liv (stor opgave). Ny session med Opus, høj effort, efter jeres go: "Læs docs/prompt-liv-l5.md". Derefter L6 kortet på Mars med sit eget go ([plan-liv.md](../plan-liv.md), afsnit 7).
2. **Ild** (køreplanen nr. 6) efter L3-L6: først forløb 1 "Hvad brænder egentlig?" med laboratoriet og prøven ([drejebog-ild.md](../drejebog-ild.md) med rettelserne i [noterne](../fable/E17-ild-noter.md)). Opus, høj effort. Prompten skrives, når Ild står for tur.
3. Idéen "Rumfærgens blanding" (for meget hydrogen) i knaldgassen står i [ideer.md](../ideer.md).

**Åbent:** Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) skal vise, at Molekyler M1-M4 er færdige. 8. november 2026 (M3) kunne det læses, men det er delt fra en anden organisation, så sessionen kan ikke rette i det. Det skal opdateres fra den konto, der ejer det.

**Jeres svar om testene (8. november 2026):** Testreglen bliver, som den er (`--ændret` vælger stadig alle tests, når en fælles fil er ændret). M2b blev merget, da de berørte tests var grønne efter den sidste merge af main (`byg-molekyler`, `vaerksted`, `byttebors`, `lag`, `ordbog`, `karrusel` og `molekyler`), uden at vente på en fjerde fuld kørsel.

Prøv gerne knaldgassen og "Del elektroner" på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).

Prøv gerne Liv (også L2) på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).
