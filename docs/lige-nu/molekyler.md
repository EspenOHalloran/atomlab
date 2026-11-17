# Lige nu: Molekyler

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/molekyler.md](../arkiv/historik/molekyler.md). Højst ca. 5 KB. Sidst opdateret: 17. november 2026 (Liv L3, turen "Kopien").*

**Senest lavet (17. november 2026): Liv L3, turen "Kopien".** Tur 3 i Liv efter [drejebog-liv.md](../drejebog-liv.md), afsnit 2: Træk lynlåsen (eller "Lyn op ›"), sæt det første bogstav på hver halvdel (cellen bygger resten), find det forkerte bogstav (cellen klipper det af), og kopiér igen, til en fejl bliver siddende (altid tredje gang). Skiltet "Her: ca. 1 fejl pr. 30 bogstaver. I dig: under 1 pr. milliard." står fra trin 3. "Det så du" har vejene "Leg frit: Kopien" og kortene 3 og 2. **Leg frit: Kopien** (foldeboksen "Kopien" i venstre panel) med to tal fremme og resten i "For nørder", og ★-opgaven "Find en mutation, der blev" (`liv-mutation`). **Kort 1-3:** "Hvem fandt stigen?" ved Stigen, "Hvorfor ligner jeg mine forældre, men ikke helt?" ved Cellekernen (med "Hvordan kan det blive til 70?" under "For nørder", antallet af delinger uden tal, fordi det kun kunne ses via Wikipedia) og "Hvordan ved vi …?" ved Kopien. Tur 2 slutter nu med "Næste tur: Kopien ›" (i stedet for "Tilbage til menuen"). Testen `liv-kopien` (12 tjek). Koden står i [kode/liv.md](../kode/liv.md).

**Til sessionen med forløbet som sti (nr. 1, ejer `js/forloeb.js`):** Kopien behøvede ingen ændring i klodsen. Det, B i stilguiden skal tage med for Liv: (1) Tryk i 3D i Liv tæller kun i fasen `gør` (`tryk` i `js/liv.js`), også i Kopiens trin 3. Skal scenen virke under gættet (B1), skal den betingelse fjernes dér. Lynlåsen kan allerede trækkes under gættet i trin 1. (2) Alle fire trin i Kopien har en `visMig`, der gør hele trinet (trin 2 sætter begge bogstaver, trin 4 springer til den kopi, hvor fejlen bliver), så "Næste ›" uden handling (B2) kan kalde den og vente på `færdig()`. Trin 3 og 4 tager ca. 2-4 sekunder bagefter (animationen). (3) Gættenes `efter` er ens i alle tre ture i Liv. B4 ("hvert gæt får sit eget korte svar") kræver et nyt felt i dataene, fx `svar` pr. gæt.

**Status "prøve":** "Når atomer mødes" og Livs ture 1, 2 og 3 ("Kopien", 17. november 2026) venter på prøven med sønnen (drejebogernes "Prøven", linjerne i [ikke-afproevet.md](../ikke-afproevet.md)).

**Jeres svar (9. november 2026):** Skærmbilledet af stigen blev godkendt: udseendet som nu, basernes farver A grøn, T rød, G gul og C blå, og resten af L1 blev lavet i samme session.

**Næste (venter på jeres go):**
- **Molekyler (Serie 1 nr. 3) er bygget** (14. november 2026). Det næste er prøven med sønnen. Idéen om et kort forløb "Vand af en gnist" (knaldgassen) og et om vandets form står i drejebogens afsnit 3.
1. **L4, turen "Fejlen, der hjalp"** ([drejebog-liv.md](../drejebog-liv.md), afsnit 3, og kort 4 og 5): pladen med bakterierne og antibiotika. Ny session med Opus, høj effort, efter jeres go: "Læs docs/prompt-liv-l4.md". Derefter L5 delen "Begyndelsen" og L6 kortet på Mars, hver med sit eget go ([plan-liv.md](../plan-liv.md), afsnit 7).
2. **Ild** (køreplanen nr. 6) efter L3-L6: først forløb 1 "Hvad brænder egentlig?" med laboratoriet og prøven ([drejebog-ild.md](../drejebog-ild.md) med rettelserne i [noterne](../fable/E17-ild-noter.md)). Opus, høj effort. Prompten skrives, når Ild står for tur.
3. Idéen "Rumfærgens blanding" (for meget hydrogen) i knaldgassen står i [ideer.md](../ideer.md).

**Åbent:** Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) skal vise, at Molekyler M1-M4 er færdige. 8. november 2026 (M3) kunne det læses, men det er delt fra en anden organisation, så sessionen kan ikke rette i det. Det skal opdateres fra den konto, der ejer det.

**Jeres svar om testene (8. november 2026):** Testreglen bliver, som den er (`--ændret` vælger stadig alle tests, når en fælles fil er ændret). M2b blev merget, da de berørte tests var grønne efter den sidste merge af main (`byg-molekyler`, `vaerksted`, `byttebors`, `lag`, `ordbog`, `karrusel` og `molekyler`), uden at vente på en fjerde fuld kørsel.

Prøv gerne knaldgassen og "Del elektroner" på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).

Prøv gerne Liv (også L2) på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).
