# Prompt: Fable laver faktagrundlag og drejebog til Kvantefysik

*Skrevet 13. november 2026 efter jeres go ("også kvantecomputer"). **Fable kan kun bruges til og med 16. november 2026**, så denne opgave kommer først ([plan-fable.md](plan-fable.md), "Status"). Kvantefysik står som nr. 7 i "Nyt indhold" i [koereplan.md](koereplan.md) og som egen del i verdenen Atomer i [plan-verdener.md](plan-verdener.md). Faktagrundlag må laves på forhånd (køreplanen). Fable skriver kun dokumenter, så den kan køre samtidig med andre sessioner.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"** (de fleste kildedomæner er åbne dér, fx `en.wikipedia.org`, `arxiv.org` og `www.nobelprize.org`, hvis de er på listen).
- **Effort: `xhigh`** (CLAUDE.md: faktagrundlaget for Kvantefysik er et af de steder, hvor en fejl er dyr). Bliver budgettet for stramt, så `high` for kvantecomputeren.
- **Pris (usikkert skøn):** ca. 15-25 $ (Fable 5.2: 8 $ ind og 40 $ ud pr. million tokens). Fable læser ca. 150 KB og skriver højst ca. 40 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-kvantefysik.md`, og gør det, der står under 'Prompten'."

---

## Prompten

Du skal lave **faktagrundlaget og drejebogen til Kvantefysik**, en ny del i AtomLab. Den er ikke planlagt eller bygget endnu. Opus bygger den senere ud fra det, du skriver, og du kan ikke spørges bagefter (Fable er ikke til rådighed efter 16. november 2026). Skriv derfor, så Opus kan bygge uden at gætte, og sig tydeligt, hvor du er i tvivl.

### Målet
En 13-årig skal kunne gøre noget i programmet og bagefter sige én sætning om kvantefysik, som er **rigtig og ikke mystisk**. Kvantefysik er det emne, hvor det er nemmest at skrive noget, der lyder dybt, men er forkert ("partiklen er to steder på én gang", "observatøren er en bevidsthed", "sammenfiltring sender beskeder hurtigere end lyset", "kvantecomputeren prøver alle svar på én gang"). Det er også nemt at blive så forsigtig, at det bliver kedeligt. Find vejen imellem.

### Hvem det er til, og rammerne
Læs CLAUDE.md (står i samtalen), især "Hvem bruger det". Læs [docs/retning.md](retning.md) helt (kort), og [docs/fable/E3-forloeb.md](fable/E3-forloeb.md) (din egen skabelon for forløb). Dansk til en 13-årig, gør før læs, højst to nye fagord pr. trin, ingen enheder som eV i lag 1, og forenklinger siges ærligt. Ren HTML, CSS og JavaScript med Three.js og intet byggetrin. Det skal virke på tablet. Du ændrer **ikke kode og ikke tekster i programmet**.

### Indholdet (jeres valg)
Køreplanen nævner, og I har bekræftet 13. november 2026:
1. **Dobbeltspalten:** elektroner, der lander én ad gangen og bygger et mønster op.
2. **Energitrin og spektrallinjer:** hvorfor elektronen ikke falder ind i kernen, og hvorfor hvert grundstof har sine egne farver (flammefarver kobler til Ild og Lys).
3. **Tunneleffekten:** kobler til Stjerneovnen (Solen fusionerer kun på grund af den).
4. **Orbitalerne i store atomer:** Værkstedets elektronsky er allerede |ψ|². Hvad mangler for de store atomer?
5. **Kvantecomputeren** som **sidste kapitel**, ikke en del for sig: qubitten som en pil på en kugle, superposition og interferens. Feltet ændrer sig hurtigt, så alle tal får en dato.

Fælderne fra køreplanen (`grep -n -i "kvant" docs/koereplan.md`) skal med.

### Hvad du skal læse
Læs de små filer helt og de store med `grep` eller i afsnit.
1. **Reglerne for fakta:** [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) og skillen `/faktatjek` (tjekliste B). **Før** du skriver.
2. **Det, der findes i dag og kobler til:**
   - Elektronskyen og orbitalerne: `js/data/orbitaler.js` og det, der står om "Elektronsky" i `js/atom.js` (`grep -n -i "sky\|orbital"`).
   - Tunneleffekten i Stjerneovnen og "Hvorfor?"-kortene: `grep -n -i "tunnel\|kvante\|bølge" js/data/hvorfor.js js/data/ordbog.js js/data/fakta.js`.
   - Spektrallinjer og flammefarver i faktagrundlaget for Lys: [docs/fakta-strom-og-lys.md](fakta-strom-og-lys.md) (`grep -n -i "spektr\|flamme\|foton\|kvante"`). Gentag ikke det, der står dér. Henvis og byg videre.
   - Faktagrundlagets form: se, hvordan [docs/fakta-liv.md](fakta-liv.md) og [docs/fakta-gaader.md](fakta-gaader.md) (din egen) er bygget op.
   - Pladsen i ringen: [docs/plan-verdener.md](plan-verdener.md) (verdenen Atomer).
   - En færdig drejebog som eksempel: [docs/drejebog-foerste-atom.md](drejebog-foerste-atom.md).

### Hvad du skal levere
**To filer.**

**`docs/fakta-kvantefysik.md`** (højst ca. 30 KB, del den op i `docs/fakta-kvantefysik/`, hvis den bliver større):
1. **Det vigtigste først** (højst 5 linjer).
2. **Pr. emne (de fem ovenfor):** påstandene med tal, kilde (helst primær: artikler, Nobel-siderne, lærebøger) og hvor sikre de er (sikker, ret sikker, usikker). Hvad der er målt, og hvad der er fortolkning. Hvad man kan **gøre** i programmet, og hvad der allerede findes at bygge på.
3. **Fælderne:** det, der ofte siges forkert, og hvad man skriver i stedet. Hver fælde skrives også som en ny linje i bunden af [docs/erfaringer/fakta-faelder.md](erfaringer/fakta-faelder.md) (`merge=union`, ret ikke i de gamle).
4. **Fortolkningerne:** hvad man ærligt kan sige til en 13-årig om, at fysikerne er uenige om, hvad det *betyder*, uden at det bliver mystisk. Det hører måske til Gåderne (et sjette kort?). Sig din mening.
5. **Kvantecomputeren:** hvad der er rigtigt nu (dato), hvad den er god til, og hvad den ikke kan. Tal med dato og kilde.
6. **Ærligt talt-linjer:** hvad animationerne vil snyde med (fx elektroner som kugler, der lander), og hvordan det siges.

**`docs/drejebog-kvantefysik.md`** efter skemaet i E3-forloeb.md:
1. **Kernesætningen for delen** og for hvert forløb.
2. **Hvor mange forløb**, og i hvilken rækkefølge. Fem emner er for meget til ét forløb på fem minutter. Foreslå en opdeling (fx 2-3 forløb) og hvad der er laboratoriet.
3. **Trinene for det første forløb** helt udfyldt (Spørg, Gæt, Gør, Så og Ord, og hvad scenen viser). For de andre forløb: kernesætningen og en kort liste over trinene.
4. **Det, der er valgt fra,** og hvor det bor (lag 2, lag 3, laboratoriet, Gåderne).
5. **Ordene** (højst ca. otte pr. forløb), og hvilke der står i `js/data/ordbog.js` i dag.
6. **Prøven:** tre spørgsmål pr. forløb.
7. **Links begge veje:** hvor i programmet der skal pege på Kvantefysik (Værkstedet, Stjerneovnen, Lys), og hvor Kvantefysik peger hen.
8. **Spørgsmål til jer:** højst fem, hver med to eller tre valgmuligheder og din anbefaling først.

### Regler for dig
- **Kilder:** Primære kilder og de åbne domæner. Står en kilde kun i din hukommelse, så skriv det. **Er et domæne, du har brug for, lukket, så bed om at få det åbnet med en anmodning til miljøet (værktøjet til at ændre miljøet), som brugeren kan godkende.** Navngiv domænet og hvorfor. Gå ikke videre med en nødløsning.
- Du **bygger ikke** og ændrer hverken kode, tekster i programmet eller regler. Når de to filer er skrevet, **stopper du**.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje under "Næste" i [lige-nu/smaating.md](lige-nu/smaating.md): "Fables faktagrundlag og drejebog til Kvantefysik er skrevet (`docs/fakta-kvantefysik.md`, `docs/drejebog-kvantefysik.md`)".

## Efter Fables svar
1. Opus skriver `docs/fable/E7-kvantefysik-noter.md` (hvad der er nyt, og hvor Opus er uenig). Fables filer rettes ikke.
2. Jeres svar på spørgsmålene skrives ind i drejebogen. Linjen i køreplanen peger på drejebogen.
