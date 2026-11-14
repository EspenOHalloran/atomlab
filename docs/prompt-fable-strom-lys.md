# Prompt: Fable skriver drejebøgerne til Strøm og magneter og til Lys og farver

*Skrevet 14. november 2026 efter jeres go ("Strøm og Lys drejebøger"). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Status"). Hører til nr. 7 under "Nyt indhold" i [koereplan.md](koereplan.md): Strøm og magneter, så Lys, så Kvantefysik. Faktagrundlaget er skrevet ([fakta-strom-og-lys.md](fakta-strom-og-lys.md)), og jeres svar står nederst i det. Nu skriver Fable drejebøgerne, så Opus kan bygge efter 16. november. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Fable læser ca. 120 KB (mest med `grep`) og skriver højst ca. 15 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-strom-lys.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med de andre Fable-sessioner (den skriver kun i `docs/fable/`).

---

## Prompten

Skriv drejebøgerne til **to nye dele** i verdenen Elektricitet ved siden af Batteriet: **Strøm og magneter** og **Lys og farver**. Brugeren har valgt (12. november 2026): to dele med hver sin kernesætning (forslag 1 og 2 i faktagrundlaget), første handling er Ørsteds bord og flammeprøven, og bølgerne (Del C) kommer senere, når de to første er prøvet. Opus bygger bagefter med høj effort, og du kan ikke spørges igen efter 16. november 2026.

### Målet
Hvad skal en 13-årig, der er alene med en tablet, *gøre* i hver del de første fem minutter, så han bagefter kan sige kernesætningen med egne ord? Hvad er wow-øjeblikket (det, han vil vise til en ven)? Hvordan bliver det en 3D-scene, man rører ved, og ikke en tegning fra en lærebog? Sig det, når noget i faktagrundlaget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [E3-forloeb.md](fable/E3-forloeb.md). [docs/drejebog-foerste-atom.md](drejebog-foerste-atom.md) som eksempel på niveauet.
2. **Faktagrundlaget:** [docs/fakta-strom-og-lys.md](fakta-strom-og-lys.md): "Kernesætning", afsnit 1 (Fælles Mål), 9 ("Hvad man kan gøre i programmet"), 10 (fælderne), 11 og "Jeres svar". Afsnit 2-8 kun med `grep` efter det, du bruger.
3. **Overlap, der skal undgås:** Kvantefysik forløb 2 handler om energitrin og spektrallinjer ([drejebog-kvantefysik.md](drejebog-kvantefysik.md), `grep -n -i "spektral\|forløb 2\|flamme" docs/drejebog-kvantefysik.md`). Lys og farver kommer før og må ikke tage dens wow-øjeblik. Sig, hvad hver af dem viser, og hvordan de peger på hinanden. Ørsted står også i [fakta-videnskabsfolk.md](fakta-videnskabsfolk.md) (`grep -n -i "ørsted\|faraday"`).
4. **Det, der findes:** Batteriet (`grep -n -i "batteri" docs/kode/*.md`, og den del af [plan-verdener.md](plan-verdener.md), der handler om Elektricitet), flammefarverne og elektronskallerne i Værkstedet (`grep -n -i "flamme\|skal" docs/kode/data.md`), og Solen i Kosmos og Solsystemet (spektret, hvis det findes: `grep -rn -i "spektr" js/kosmos/solen.js js/data/*.js | head`).
5. **Fælderne:** [erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -n -i "strøm\|magnet\|lys\|farve\|plasma\|elektron"`).
6. **Billeder af AtomLab:** `docs/fable/E1-billeder/` (`ls`, og se Batteriet og Værkstedet).

### Hvad du skal levere
Én fil: **`docs/fable/E11-strom-lys-drejebog.md`**, højst ca. 15 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Hvilken del bygges først, og hvad er det sværeste?
2. **For hver af de to dele:** kernesætningen (ret den, hvis den er for lang), scenen i 3D (hvad man ser og rører ved), forløbet på 3-6 trin efter skabelonen (Spørg højst ca. 15 ord, Gæt i mindst to trin, én handling pr. trin, Så højst ca. 20 ord, højst to nye fagord pr. trin), wow-øjeblikket, "Det så du" med højst tre veje, og laboratoriet bagefter (budgettet for lagene i Retningen: hvad er fremme, og hvad står i "For nørder").
3. **Links begge veje:** hvor hver del peger hen (Batteriet, Værkstedet, Solen, Kvantefysik, Ordbogen), og hvad der peger ind på den.
4. **Fakta:** de påstande, forløbene bygger på, som ikke allerede er tjekket i faktagrundlaget, mærket Sikker, Ret sikker eller Usikker, med kilde.
5. **Spørgsmål til brugeren** (højst fire) med din anbefaling først.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, faktagrundlaget eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/smaating.md](lige-nu/smaating.md): "Fables drejebøger til Strøm og magneter og Lys og farver er skrevet, se `docs/fable/E11-strom-lys-drejebog.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E11-strom-lys-noter.md` (hvad der er nyt, og hvor Opus er uenig) og flytter drejebøgerne til `docs/drejebog-strom.md` og `docs/drejebog-lys.md` med jeres svar. Fables fil rettes ikke.
2. I svarer på spørgsmålene og giver go, når delene står for tur i køreplanen (efter Serie 1 og højst én ny stor del ad gangen).
