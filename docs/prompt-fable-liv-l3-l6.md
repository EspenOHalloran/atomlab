# Prompt: Fable skriver drejebogen til Liv L3-L6

*Skrevet 14. november 2026 efter jeres go ("Liv L3-L6 drejebog"). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Status"). Hører til sporet Molekyler (Liv). Fable har skrevet drejebogen til Livs to første forløb ([E3-liv-drejebog.md](fable/E3-liv-drejebog.md)) og faktatjekket Liv ([E5-liv.md](fable/E5-liv.md)). Nu skriver Fable drejebogen til resten, så Opus kan bygge L3-L6 efter 16. november. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Fable læser ca. 150 KB (mest med `grep`) og skriver højst ca. 15 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-liv-l3-l6.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med de andre Fable-sessioner (den skriver kun i `docs/fable/`), men ikke samtidig med en anden session i sporet Molekyler, der retter `docs/lige-nu/molekyler.md`.

---

## Prompten

Liv har to forløb i dag ("Opskriften i dig" og "Hvad står der i opskriften?", status "prøve"). Resten af planen ([plan-liv.md](plan-liv.md), afsnit 7) er bygget som dele af et laboratorium, før Retningen sagde "forløbet først": **L3** kopien ("Lyn op og kopiér", fejlene, "Hvorfor?"-kortene om DNA og naturligt udvalg), **L4** Millers kolbe, **L5** trappen til liv og "Har nogen lavet liv?" og **L6** liv i rummet. Skriv drejebogen, så de bliver forløb efter din skabelon. Opus bygger bagefter med høj effort, og du kan ikke spørges igen efter 16. november 2026.

### Målet
Hvad skal en 13-årig, der er alene med en tablet, kunne sige efter hvert forløb? Hvor mange forløb bliver det (ét pr. L-trin, eller færre og stærkere)? Hvad er det ene øjeblik i hvert forløb, han vil vise til en ven? Livets begyndelse er omstridt stof: Det skal være ærligt om, hvad ingen ved, uden at blive vagt, og evolution er en kendsgerning (jeres valg efter E5).

Sig det, når noget i planen ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [E3-forloeb.md](fable/E3-forloeb.md).
2. **Det, der findes:** din drejebog [E3-liv-drejebog.md](fable/E3-liv-drejebog.md), [docs/lige-nu/molekyler.md](lige-nu/molekyler.md) og [docs/kode/liv.md](kode/liv.md) (hvad scenen kan i dag: stigen, aflæsningen, ribosomet og forløbene).
3. **Planen:** [docs/plan-liv.md](plan-liv.md), afsnit 2-4 og 7-9. Og [docs/prompt-liv-l3.md](prompt-liv-l3.md) (Opus' forslag til L3 med tal, før det var et forløb).
4. **Dit faktatjek og jeres svar:** [E5-liv.md](fable/E5-liv.md) og [E5-noter.md](fable/E5-noter.md) (især det, der skal med før L3 og før L5).
5. **Faktagrundlaget** (læs med `grep` og kun de afsnit, du bruger): [fakta-liv/dna-opskriften.md](fakta-liv/dna-opskriften.md) (kopien, historien og fælderne), [fakta-liv/begyndelsen.md](fakta-liv/begyndelsen.md), [fakta-liv/rummet.md](fakta-liv/rummet.md) og [fakta-liv/dna-stigen.md](fakta-liv/dna-stigen.md). Fælderne i [erfaringer/fakta-faelder-liv-og-videnskabsfolk.md](erfaringer/fakta-faelder-liv-og-videnskabsfolk.md).
6. **Overlap, der skal undgås:** Gåderne har allerede kortene "Hvordan begyndte livet?" og "Er der liv andre steder?" (`grep -n "spørgsmål\|spørg:\|så:" js/data/gaader.js`), og Solsystemet får månerne med mulige betingelser for liv ([fakta-maaner-liv.md](fakta-maaner-liv.md), afsnit 9). Sig, hvad L5 og L6 skal gøre, som de ikke gør, eller om noget skal slås sammen.
7. **Billeder af Liv i dag:** `docs/fable/E1-billeder/` og `docs/fable/E4-billeder/` (`ls`, og se dem, der viser Liv).

### Hvad du skal levere
Én fil: **`docs/fable/E10-liv-drejebog.md`**, højst ca. 15 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Hvor mange forløb, i hvilken rækkefølge, og hvad skal bygges først?
2. **For hvert forløb:** kernesætningen, 3-6 trin efter skabelonen (Spørg højst ca. 15 ord, Gæt i mindst to trin, én handling pr. trin, Så højst ca. 20 ord, højst to nye fagord pr. trin), wow-øjeblikket, "Det så du" med højst tre veje, og hvad der flytter ned i "For nørder" eller ud (budgettet i Retningen).
3. **"Hvorfor?"-kortene om DNA og naturligt udvalg:** hvilke 3-5 der kommer med, og spørgsmålet og svaret i kort dansk.
4. **Fakta:** de påstande, forløbene bygger på, mærket Sikker, Ret sikker eller Usikker, med kilde. Slå de tal op, E5 bad om (fx Patel m.fl. 2015, Lane og Martin 2012 og menneskets alder på døgnuret). Står en kilde kun i din hukommelse, så skriv det.
5. **Det, der skal skæres fra planen** (L3-L6), og hvorfor.
6. **Spørgsmål til brugeren** (højst fire) med din anbefaling først.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, planen eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/molekyler.md](lige-nu/molekyler.md): "Fables drejebog til Liv L3-L6 er skrevet, se `docs/fable/E10-liv-drejebog.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E10-liv-noter.md` (hvad der er nyt, og hvor Opus er uenig) og retter [plan-liv.md](plan-liv.md) og [prompt-liv-l3.md](prompt-liv-l3.md). Fables fil rettes ikke.
2. I svarer på spørgsmålene og giver go. Molekyler bygges først (jeres valg 13. november 2026), så Liv L3 (Opus, høj).
