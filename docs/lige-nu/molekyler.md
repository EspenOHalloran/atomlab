# Lige nu: Molekyler

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/molekyler.md](../arkiv/historik/molekyler.md). Højst ca. 5 KB. Sidst opdateret: 9. november 2026 (Liv L0).*

**Senest lavet (9. november 2026): Liv L0, planen og faktagrundlaget.** [plan-liv.md](../plan-liv.md) beskriver delen Liv i den nye verden "Ild og liv": tre faner (**Opskriften** med DNA-stigen i 3D, kopien og vejen fra DNA til protein med et rigtigt gen for hæmoglobin og seglcelle-mutationen, **Begyndelsen** med Millers kolbe, "Trappen til liv" og Jordens døgn, og **Liv i rummet** med korte kort og links til Mars, Enceladus, Europa og Titan), teknikken, testene, delopgaverne L1-L6 og 7 spørgsmål til jer. Faktagrundlaget ([fakta-liv.md](../fakta-liv.md) med fire filer i `docs/fakta-liv/`) blev slået op af tre hjælpeagenter (Opus, effort xhigh) og vurderet af Opus med stikprøver i kilderne. Rettelser, der ændrede planen: 6,1 (ikke 6,2) milliarder basepar i en celle, DNA-kopien hos mennesker ca. 25 baser i sekundet, ler giver kæder på op til 55 led kun med "aktiverede" byggesten, et lille RNA (QT45, februar 2026) kan lave en kopi af sig selv, og "det bedste spor af liv" siger kilderne kun om Mars. Ti biologiske kildedomæner blev åbnet på miljøet "atomlab".

**Jeres svar (9. november 2026):** anbefalingen på alle spørgsmålene i planen: én del "Liv" med tre faner, DNA først, zoom helt ind til atomerne og Millers kolbe med "Trappen til liv" (afsnit 9 i planen).

**I gang (9. november 2026): Liv L1.** Domænet `files.rcsb.org` er åbnet, og 1BNA er hentet (`js/data/liv/1BNA.pdb`). Værktøjet `js/data/liv/lav-dna-atomer.mjs` laver fire målte basepar (A–T, T–A, G–C, C–G) med H regnet ud og én fælles målt rygrad (så kæden O3'–P er 1,60 Å i den ideelle stige), i `js/data/liv/dna-atomer.js`. Stigen (`js/data/liv/stige.js` og `js/liv/stige.js`) har 10,5 basepar pr. omgang, 3,38 Å pr. trin og en diameter på 19,9 Å, atomerne tæt på og båndene længere væk, der toner over i hinanden. En foreløbig skærm `#liv` (ikke i menuen endnu). Skærmbilledet af stigen er vist til jer, og resten af L1 venter på jeres svar.

**Næste (venter på jeres go):**
1. **L1:** skærmen, verdenen "Ild og liv" i menuen og stigen i 3D, zoomet helt ind til atomerne (Opus, høj effort, ny session). Domænet `files.rcsb.org` (atompladserne fra Protein Data Bank) skal åbnes før L1. Teksten til at starte sessionen står i [plan-liv.md](../plan-liv.md), afsnit 11.
2. Idéen "Rumfærgens blanding" (for meget hydrogen) i knaldgassen står i [ideer.md](../ideer.md).

**Åbent:** Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) skal vise, at Molekyler M1-M4 er færdige. 8. november 2026 (M3) kunne det læses, men det er delt fra en anden organisation, så sessionen kan ikke rette i det. Det skal opdateres fra den konto, der ejer det.

**Jeres svar om testene (8. november 2026):** Testreglen bliver, som den er (`--ændret` vælger stadig alle tests, når en fælles fil er ændret). M2b blev merget, da de berørte tests var grønne efter den sidste merge af main (`byg-molekyler`, `vaerksted`, `byttebors`, `lag`, `ordbog`, `karrusel` og `molekyler`), uden at vente på en fjerde fuld kørsel.

Prøv gerne knaldgassen og "Del elektroner" på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).
