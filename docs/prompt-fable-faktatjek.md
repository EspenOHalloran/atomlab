# Prompt: Fable faktatjekker det, der allerede står i programmet (E13)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (A på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Åbne punkter ("Faktatjek, der mangler" i [lige-nu/aabne-punkter.md](lige-nu/aabne-punkter.md)). Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $ (Fable læser ca. 150 KB og åbner mange kilder). Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-faktatjek.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med alle andre sessioner (Fable skriver kun i `docs/fable/` og nye linjer i fælderne).

---

## Prompten

Faktafilerne fra oktober og starten af november blev skrevet af hjælpeagenter, der **ikke kunne åbne en eneste kildeside** (kun søgeresultater og uddrag). Teksterne derfra står nu i programmet, som en 13-årig bruger. Du skal tjekke dem mod de rigtige kilder, nu hvor domænerne er åbne.

### Hvad du skal tjekke (i denne rækkefølge, stop når tiden eller pladsen slipper op)
1. **Grundstofkortene:** [docs/fakta-grundstofkort.md](fakta-grundstofkort.md), afsnittene "De påstande, jeg er mindst sikker på", "Mindst sikre påstande" og alt markeret (H). Sammenlign med teksterne, der faktisk står i programmet (`js/data/grundstoflag.js`, `js/data/grundstoffer.js`, `js/data/kategorier.js`, `grep` efter grundstoffet).
2. **Molekyler:** [docs/fakta-molekyler.md](fakta-molekyler.md), afsnit 1-5 og "Det, jeg er mindst sikker på". Tallene (bindingsvinkler, energier, elektronegativitet) mod NIST CCCBDB og WebBook. Teksterne i programmet: `js/data/molekyler.js`, `js/data/molekyler-byg.js`, `js/data/knaldgas.js` og `js/data/forloeb/molekyler.js`.
3. **Saturns flyby:** afsnit 4b i [docs/fakta-solsystemet/del1-saturn-og-maanerne.md](fakta-solsystemet/del1-saturn-og-maanerne.md) og "Mindst sikre påstande" samme sted, mod JPL SSD og USGS Gazetteer. Teksterne: `js/kosmos/saturn.js` og `js/data/sider/saturn.js`.
4. **Jupiter:** "Mindst sikre påstande" i [del5a](fakta-solsystemet/del5a-jupiter-opslag-og-jupiter-selv.md) og [del5b](fakta-solsystemet/del5b-jupiter-maanerne-og-himlen.md). Teksterne: `js/data/sider/jupiter.js` og `js/kosmos/jupiter.js`.
5. Kun hvis der er tid: "Mindst sikre påstande" i [del2-voyager.md](fakta-solsystemet/del2-voyager.md) (Rumrejsen er ikke bygget, så det haster mindst).

Læs først CLAUDE.md (står i samtalen) og [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep` efter emnet).

### Hvad du skal levere
Én fil: **`docs/fable/E13-faktatjek.md`**, højst ca. 15 KB:
1. **Det vigtigste først** (højst 5 linjer): Står der noget forkert i programmet lige nu?
2. **En tabel pr. emne** med kun det, der skal rettes: fil og linje (eller nøgle), hvad der står, hvad der er rigtigt, kilden (åbnet af dig, med adresse) og et forslag til ny dansk tekst til en 13-årig (samme længde som den gamle).
3. **Det, der nu er bekræftet:** én linje pr. faktafil ("afsnit X: alle tal bekræftet mod Y"), så de gamle advarsler kan fjernes. Ikke påstand for påstand.
4. **Det, du ikke kunne tjekke,** og hvorfor (domæne, betalingsmur).

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet eller faktafilerne. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder (NIST, JPL, NASA, USGS, IUPAC, RSC, fagfællebedømte artikler). Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
En Opus-session (medium) retter teksterne i programmet efter tabellen, kører `--ændret` og fjerner de gamle advarsler i faktafilerne (sporet Åbne punkter).
