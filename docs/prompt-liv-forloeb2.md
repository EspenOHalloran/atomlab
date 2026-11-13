# Prompt: Liv som to forløb, forløb 2 ("Hvad står der i opskriften?")

*Skrevet 13. november 2026, da forløb 1 ("Opskriften i dig") var færdigt. Start en ny session med "Læs docs/prompt-liv-forloeb2.md". **Model: Opus. Effort: høj.** Sporet er Molekyler (Serie 1 nr. 2 i [koereplan.md](koereplan.md)). Få et go, før du bygger, og spørg med valgmuligheder, hvis noget er uklart.*

---

Byg forløb 2 i Liv, **"Hvad står der i opskriften?"**, efter drejebogen. Forløb 1 og klodsen findes allerede.

**Læs først (kun disse dele):**
- `docs/lige-nu/molekyler.md` og DESIGN.md.
- `docs/fable/E3-liv-drejebog.md`: "Forløb 2", "Det, der er valgt fra", "Laboratoriet bagefter", "Tre ting" (punkt 3) og "Fakta".
- `docs/fable/E5-liv.md`, afsnit 6 (Fables rettelser til forløb 2: "61 af ordene betyder en byggesten, og 3 betyder stop", "en af de fire kæder i hæmoglobin", "hvis man har ændringen fra både sin mor og sin far" og "er en mutation").
- `docs/kode/liv.md` (afsnittene "L2" og "Forløbet 'Opskriften i dig'") og `docs/kode/forloeb.md`.
- Tjekliste C, D, E og F og `docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md`.
- I koden: `js/liv.js` (`OPSKRIFT_DEL` er skabelonen for et forløb i Liv), `js/data/forloeb/opskriften.js`, `js/liv-protein.js` (tilstanden `'ret'`, "Skift et bogstav") og i `js/liv/protein.js` kun `visRet` og tilstanden `'ret'` (med `grep`).

**Det, der skal tages stilling til (stil spørgsmålene med valgmuligheder før bygningen):**
1. **DNA eller RNA i scenen:** Scenen i "Skift et bogstav" viser i dag RNA'et (med U og den lyserøde farve). Drejebogen bruger DNA-ordene (ATG GTG CAT …), og forløbet skal ikke vise RNA. Forslag: en indstilling i `visRet`, så forløbet viser DNA-bogstaverne (T i stedet for U, basernes farver), og RNA'et kommer kun i filmen.
2. **Kuglerne én ad gangen** (drejebogen, "Tre ting" nr. 3): Dæmp de kugler, hvis ord ikke er læst endnu.
3. **Den lille ordbog med fire ord** (GTG valin, CAT histidin, CTG leucin, ACT threonin, tjekket af Fable) i stedet for kodehjulet.
4. **Laboratoriet bagefter:** Venstre panel får forløb 2 under forløb 1 (i dag én knap på én linje, `#livForløbOpskriften`, så panelet passer på tablet på højkant: 478 af 485 px). Med to forløb bliver der ikke plads. Forslag: Gruppen "Forløb" bliver én foldeboks eller én række med to små knapper, og budgettet i Retningen (højst fem valg synlige) holdes ved at folde "Fra opskrift til protein" sammen. Højre panel: højst to tal og tre sætninger fremme.
5. **Vejene efter forløb 1:** I dag "Leg frit", "Zoom helt ind til atomerne" og "Hvad holder stigen sammen?". Drejebogen vil have "Næste forløb: Hvad står der i opskriften? ›" som den første. Vejene efter forløb 2: "▶ Se, hvordan cellen gør det (film)", "Leg frit" og "Tilbage til menuen".

**Når det er bygget:** `/faktatjek` (de nye tekster og linjen "Ærligt talt" efter forløbet), nye ord i Ordbogen (aminosyre, protein og mutation findes), 5-10 tjek i `tests/liv-forloeb.mjs`, skærmbilleder af Liv (pc og tablet på højkant), `/faerdig`. Status "prøve" i sporets fil og i "Ikke afprøvet" (spørgsmål 3 og 4 i drejebogens "Prøven").
