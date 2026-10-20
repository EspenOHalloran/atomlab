---
name: faktatjek
description: Faktatjek nye eller ændrede tekster i AtomLab med tal, datoer, forklaringer eller citater, før de kommer med. Brug den ved nye tekster i fænomener, kategorier, hjælp, ordbog og citater, eller når brugeren skriver /faktatjek.
---

# Faktatjek

1. **Find teksterne** i diffet eller i de filer, brugeren nævner. Del dem op i påstande, så hvert tal, hver dato, hver årsag og hvert citat står for sig.
2. **Læs fælderne:** tjekliste B og "Kendte fælder i fakta" i `docs/erfaringer.md`.
3. **Tjek med kilder:** Lad 1-3 hjælpeagenter tjekke påstandene med websøgning (Opus med høj effort, som `CLAUDE.md` siger om faktatjek). Hver påstand skal have en kilde, helst NASA, ESA, IUPAC, NIST, en lærebog eller en fagfællebedømt artikel.
   - Citater skal have den præcise ordlyd og den oprindelige kilde. Står citatet oversat, skal det siges. Kan ordlyden ikke bekræftes, droppes citatet.
   - Kan en kilde ikke læses direkte (kun et søgeresultat), så sig det.
4. **Saml resultatet** i en tabel: påstand, OK, ret eller fjern, kilde og forslag til ny tekst.
5. **Ret teksterne.** Er du i tvivl, så skriv mere forsigtigt eller fjern det. Forenklinger skal siges ærligt (fx i "Ærligt talt" eller under "For nørder").
6. **Sproget:** Teksten skal stadig være let at læse for en 13-årig, med korte sætninger. Nye fagord skal i `js/data/ordbog.js`.
7. **Skriv nye fælder** ind i `docs/erfaringer.md`, så de ikke sker igen.
