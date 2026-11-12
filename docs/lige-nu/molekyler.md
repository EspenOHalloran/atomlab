# Lige nu: Molekyler

*Spor i [oversigten](../lige-nu.md). Kun én session ad gangen skriver her. Det forrige "Senest lavet" flyttes øverst i [arkiv/historik/molekyler.md](../arkiv/historik/molekyler.md). Højst ca. 5 KB. Sidst opdateret: 10. november 2026 (Liv L2).*

**Senest lavet (10. november 2026): Liv L2, fra opskrift til protein.** Boksen **"Fra opskrift til protein"** i venstre panel har tre knapper. **"Se genet blive læst"**: RNA-polymerasen åbner DNA'et og bygger en RNA-kopi af hele den kodende del af HBB (444 baser, U i stedet for T), RNA'et kommer ud af kernen, og ribosomet læser tre bogstaver ad gangen, mens budbringerne (tRNA) kommer med aminosyrerne. Kæden på 147 aminosyrer folder sig til sidst (de vandskyende inderst). Tidsknappen styrer farten (⏩ 4 gange). **"Læs selv"**: Man er ribosomet og finder de 9 første ord i **kodehjulet** (SVG, en kontakt i panelet) og vælger aminosyren blandt fire svar. **"Skift et bogstav"**: de 10 første ord kan ændres, og panelet og 3D-billedet viser proteinet (seglcellen, skift der ikke gør noget, stop for tidligt og "Skriv LIV"). Seks nye opgaver (9 i alt i Liv), "Hvorfor?"-kortet "Hvorfor kan ét forkert bogstav give en sygdom?", otte nye ord i Ordbogen (gen, protein, aminosyre, kodon, RNA, ribosom, mutation og enzym) og 16 nye tjek i `tests/liv.mjs`. Hele HBB er hentet fra NCBI og giver præcis NCBI's protein. Faktatjekket (OpenStax 3-4, 15-2, 15-3, 15-5, 39-4) står i [fakta-liv.md](../fakta-liv.md), "L2". Hvor det afviger fra forslaget, står i [plan-liv.md](../plan-liv.md) under "Bygget i L2". Koden står i [kode/liv.md](../kode/liv.md).

**Jeres svar (9. november 2026):** Skærmbilledet af stigen blev godkendt: udseendet som nu, basernes farver A grøn, T rød, G gul og C blå, og resten af L1 blev lavet i samme session.

**Næste (venter på jeres go):**
0. **Fables faktatjek af Liv og månerne er skrevet (12. november 2026), se `docs/fable/E5-liv.md`.** Faktagrundlaget holder, og programmet har ingen grove fejl, men 12 små ting skal rettes. Næste: Opus skriver `docs/fable/E5-noter.md`, retter fejlene i programmet med `/faktatjek` og viser jer Fables fem spørgsmål (nr. 2, kernesætningen for månerne, er besvaret 12. november 2026: forslag 1 med Fables nye slutning, se afsnit 9 i [fakta-maaner-liv.md](../fakta-maaner-liv.md)) (se "Efter Fables svar" i [prompt-fable-liv.md](../prompt-fable-liv.md)). Ny session med Opus, høj effort.
1. **L3:** kopien ("Lyn op og kopiér"), fejlene og "Hvorfor?"-kortene om DNA. Ny session med Opus, høj effort: "Læs docs/prompt-liv-l3.md". Det store eftersyn med Fable (E0) bør komme først, hvis I vil have det før flere store dele (køreplanen).
2. Idéen "Rumfærgens blanding" (for meget hydrogen) i knaldgassen står i [ideer.md](../ideer.md).

**Åbent:** Artefaktet "AtomLab Overblik" (https://claude.ai/artifact/XvHst1oGt3vZJ5ijsh8mpe) skal vise, at Molekyler M1-M4 er færdige. 8. november 2026 (M3) kunne det læses, men det er delt fra en anden organisation, så sessionen kan ikke rette i det. Det skal opdateres fra den konto, der ejer det.

**Jeres svar om testene (8. november 2026):** Testreglen bliver, som den er (`--ændret` vælger stadig alle tests, når en fælles fil er ændret). M2b blev merget, da de berørte tests var grønne efter den sidste merge af main (`byg-molekyler`, `vaerksted`, `byttebors`, `lag`, `ordbog`, `karrusel` og `molekyler`), uden at vente på en fjerde fuld kørsel.

Prøv gerne knaldgassen og "Del elektroner" på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).

Prøv gerne Liv (også L2) på tabletten (listen i [ikke-afproevet.md](../ikke-afproevet.md)).
