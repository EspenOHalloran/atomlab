# Prompt: Fable laver faktagrundlag og drejebog til Ild (E17)

*Skrevet 15. november 2026 af sessionen "Småting · Overblik og de næste fem sessioner" efter jeres valg (E på listen over ekstra Fable-opgaver, [prompt-naeste-fem.md](prompt-naeste-fem.md)). **Fable kan kun bruges til og med 16. november 2026.** Hører til sporet Molekyler (nr. 6 under "Nyt indhold" i [koereplan.md](koereplan.md): "Ild sammen med knaldgassen, og verdenen Stof og kemi kommer"). Fable skriver udkastet selv, fordi Fable ikke kan bruges senere, og Opus skriver noterne. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**. **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 8-15 $. Gratis 15. november.
- **Første besked:** "Læs `docs/prompt-fable-ild.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med "Molekyler · Højre panel i Liv" (du skriver kun nye filer og retter ikke `docs/lige-nu/molekyler.md`).

---

## Prompten

Ild er den mest naturlige udvidelse af AtomLab: Kemi mangler, forbrænding hører til fysik/kemi i udskolingen, og den kobler til tre dele, der findes: knaldgassen i Molekyler (2 H₂ + O₂ → 2 H₂O), kædereaktionen i Reaktoren og elektronerne, der hopper mellem skallerne i Værkstedet (flammefarverne). Når Ild bygges, kommer verdenen **Stof og kemi** i menuen, og Molekyler flytter dertil.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md), din skabelon [docs/fable/E3-forloeb.md](fable/E3-forloeb.md) og Molekylers drejebog som eksempel på niveauet ([docs/drejebog-molekyler.md](drejebog-molekyler.md)).
2. Idéen: "Ild, hvad er det egentlig?" under "Planen efter planeterne" i [docs/koereplan.md](koereplan.md) og Ild i [docs/ideer.md](ideer.md) (`grep -n -i "ild\|flamme\|rumfærge"`). Verdenen: linjerne om Stof og kemi i [docs/plan-verdener.md](plan-verdener.md).
3. Det, der findes at bygge på: knaldgassen ([docs/kode/](kode/), `grep -l knaldgas`, og `js/data/knaldgas.js`), Reaktorens kædereaktion og Værkstedets skaller. Afsnit 4 (Knaldgas) og 6 (Fælder) i [docs/fakta-molekyler.md](fakta-molekyler.md) og "Gruppernes navne og plasma" i [docs/fakta-grundstofkort.md](fakta-grundstofkort.md).
4. Fælderne: [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`grep -i "plasma\|flamme\|ild\|ilt\|oxygen"`).

### Hvad du skal levere
**To filer.**

**`docs/fakta-ild.md`** (højst ca. 25 KB): ildtrekanten, forbrænding som en reaktion (med energi i kJ/mol fra NIST), kædereaktionen med radikaler, flammens dele og temperaturer, hvorfor flammen er gul (glødende sod) eller blå, flammefarverne fra metallerne med bølgelængder (NIST Atomic Spectra), om en flamme er plasma (et stearinlys er næsten ikke ioniseret), slukning (hvorfor vand, skum og CO₂ virker, og hvorfor man ikke slukker en fedtbrand med vand) og ild i rummet (kugleflammer på ISS). Pr. påstand: kilde, og hvor sikker den er. Fælderne, også som nye linjer i bunden af fakta-fælderne (`merge=union`). Sikkerheden: Hvad må et forløb ikke få et barn til at prøve derhjemme?

**`docs/drejebog-ild.md`** efter skabelonen:
1. **Kernesætningen** for delen (A, B og C, din anbefaling først).
2. **Hvor mange forløb**, og hvad er laboratoriet? Hvad er den første handling, og hvad er wow-øjeblikket?
3. **Trinene for det første forløb** helt udfyldt (Spørg, Gæt, Gør, Så og Ord, og hvad scenen viser). For de andre forløb: kernesætningen og en kort liste over trinene.
4. **Det, der er valgt fra,** og hvor det bor. **Ordene** (og hvilke der står i `js/data/ordbog.js`). **Ærligt talt** og **For nørder**.
5. **Links begge veje** (Molekyler, Reaktoren, Værkstedet, Stjerneovnen, og senere Lys og Kvantefysik).
6. **Prøven:** tre spørgsmål. **Spørgsmål til jer:** højst fem, med din anbefaling først (fx navnet på verdenen: "Stof og kemi", "Molekyler og ild" eller "Kemi", som sønnen vælger).

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet eller planerne. Skriv kun de to nye filer (og nye linjer i fælderne). Når de er skrevet, **stopper du**.
- Primære kilder (NIST, lærebøger som OpenStax og LibreTexts, NASA om ild i rummet, fagfællebedømte artikler, beredskabets egne sider om slukning). Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push, PR til `main`, og merge den med det samme (CLAUDE.md).

## Efter Fables svar
Opus skriver noterne (`docs/fable/E17-ild-noter.md`), og I svarer på spørgsmålene. Ild bygges efter Liv L3-L6 i køreplanens rækkefølge, med sit eget go.
