# Lige nu: Molekyler

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/molekyler.md](../arkiv/historik/molekyler.md). Højst ca. 5 KB. Sidst opdateret: 14. november 2026 (Molekyler som egen del).*

**Senest lavet (14. november 2026): Molekyler som egen del** (Serie 1 nr. 3, PR 1 af 2, [drejebogen](../drejebog-molekyler.md), koden i [kode/molekyler.md](../kode/molekyler.md)). "Del elektroner", "Giv elektroner" og knaldgassen er flyttet fra Værkstedets fane "Byg et molekyle" til delen **Molekyler** (`#molekyler`, `js/molekyler-skaerm.js`) i verdenen Atomer, uden nyt indhold. Den har sin egen toplinje, en kort hjælp med "↺ Start forfra" og sin egen tæller i menuen (13 opgaver). Værkstedet tæller kun atom-opgaverne. Knappen i Værkstedets hjælp ("Hvad er en ion?") åbner Molekyler med "Giv elektroner" (`data-gaa="molekyler:bytte"`). Testene `byttebors` og `byg-molekyler` bruger nu `atomlabTest.molekyler`. **Jeres svar (14. november 2026):** Molekyler står efter Atomværkstedet, fanen "Byg et molekyle" er fjernet, og molekylernes opgaver er flyttet ud af Værkstedets opgaveliste.

**Lige nu:** PR 2, forløbet "Når atomer mødes" (drejebogens afsnit 2), bygges i samme session efter jeres go.

**Status "prøve":** Livs forløb 1 og 2 venter på prøven med sønnen (spørgsmål 1-4 i drejebogens "Prøven", linjerne i [ikke-afproevet.md](../ikke-afproevet.md)).

**Jeres svar (9. november 2026):** Skærmbilledet af stigen blev godkendt: udseendet som nu, basernes farver A grøn, T rød, G gul og C blå, og resten af L1 blev lavet i samme session.

**Næste (venter på jeres go):**
- **Fables drejebog til Liv L3-L6 er skrevet (14. november 2026), se `docs/fable/E10-liv-drejebog.md`.** Tre nye forløb ("Kopien", "Fejlen, der hjalp" og "Begyndelsen") og intet om liv i rummet. **Jeres svar 14. november 2026: anbefalingerne (a) i alle fire spørgsmål** (står under "Efter Fables svar" i prompten). Næste: ny session med Opus, "Læs `docs/prompt-fable-liv-l3-l6.md`, og gør punkt 1 under 'Efter Fables svar'". L3 bygges efter Molekyler.
- **Molekyler, forløbet** (Serie 1 nr. 3, PR 2): Drejebogen ([drejebog-molekyler.md](../drejebog-molekyler.md)) er **rettet 14. november 2026** efter Fables tjek ([fable/E6-molekyler.md](../fable/E6-molekyler.md)) og Opus' noter ([fable/E6-molekyler-noter.md](../fable/E6-molekyler-noter.md)): fire trin og "Det så du", den rigtige rækkefølge (træk natrium hen til chlor, så hopper elektronen), ny kernesætning, ordene molekyle, ion og krystal. De to fakta fra Fables hukommelse er tjekket (harpunen hopper tit ikke for Na + Cl, flagesalt er ikke terninger) og giver rettelser i laboratoriets tekster (noterne, afsnit 5). **Jeres svar 14. november 2026: anbefalingerne** (træk natrium, "én og syv yderst", den nye kernesætning, to PR'er). Næste, når I giver go: ny session med Opus, høj effort, "Læs `docs/prompt-molekyler-forloeb.md`, og gør det, der står under 'Prompten'".
0. **Højre panel i Liv efter budgettet** (rest fra forløb 2, ikke lavet): højst to tal og tre sætninger fremme, resten under "Flere tal" eller "For nørder". Teksterne i `NIVEAUER` og `TRIN_PROTEIN` har 3-4 tal og skal kortes og faktatjekkes. Drejebogen vil også flytte "enzym" og "RNA-polymerase" fra filmens første tekst til "For nørder". Lille opgave, Opus medium, kan tages efter prøven.
1. **L3:** kopien ("Lyn op og kopiér"), fejlene og "Hvorfor?"-kortene om DNA, nu også kortet om naturligt udvalg (punkt 5b i prompten). Ny session med Opus, høj effort: "Læs docs/prompt-liv-l3.md". Det store eftersyn med Fable (E0) bør komme først, hvis I vil have det før flere store dele (køreplanen).
2. Idéen "Rumfærgens blanding" (for meget hydrogen) i knaldgassen står i [ideer.md](../ideer.md).

**Åbent:** Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) skal vise, at Molekyler M1-M4 er færdige. 8. november 2026 (M3) kunne det læses, men det er delt fra en anden organisation, så sessionen kan ikke rette i det. Det skal opdateres fra den konto, der ejer det.

**Jeres svar om testene (8. november 2026):** Testreglen bliver, som den er (`--ændret` vælger stadig alle tests, når en fælles fil er ændret). M2b blev merget, da de berørte tests var grønne efter den sidste merge af main (`byg-molekyler`, `vaerksted`, `byttebors`, `lag`, `ordbog`, `karrusel` og `molekyler`), uden at vente på en fjerde fuld kørsel.

Prøv gerne knaldgassen og "Del elektroner" på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).

Prøv gerne Liv (også L2) på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).
