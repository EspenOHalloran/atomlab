# Prompt: Fable tjekker drejebogen til Huygens

*Skrevet 15. november 2026 efter jeres svar 14. november 2026 ([koereplan.md](koereplan.md), nr. 3 under "Nyt indhold", og nr. 6-8 i [runde 5](arkiv/prompt-naeste-fem-runde5.md)). **Fable kan kun bruges til og med 16. november 2026** ([plan-fable.md](plan-fable.md), "Næste gang Fable bruges"). Hører til sporet Videnskabsfolkene ([lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md)). Opus har skrevet planen ([plan-videnskabsfolk.md](plan-videnskabsfolk.md)), drejebogen ([drejebog-huygens.md](drejebog-huygens.md)) og faktagrundlaget ([fakta-videnskabsfolk/huygens.md](fakta-videnskabsfolk/huygens.md)). Fable tjekker drejebogen kritisk, før I giver go, og før H1 bygges. Kun dokumenter.*

## Sådan startes den
- **Egen session med Fable 5.2** i miljøet **"Default"**.
- **Effort: `high`.**
- **Pris (usikkert skøn):** ca. 5-8 $. Fable læser ca. 90 KB og skriver højst ca. 10 KB. Tjek saldoen før og efter.
- **Første besked til Fable:** "Læs `docs/prompt-fable-huygens.md`, og gør det, der står under 'Prompten'."
- Kan køre samtidig med andre spor (Fable skriver kun i `docs/fable/` og én linje i sporets fil), men ikke samtidig med en anden session i sporet Videnskabsfolkene.

---

## Prompten

Du skal tjekke **Opus' udkast til drejebogen for Huygens** ([docs/drejebog-huygens.md](drejebog-huygens.md)), før det bygges. Det er den første af ti bøger i Opdagelserne (Biblioteket) og prøven på formen for dem alle, så det, du finder her, gælder også de ni andre. Opus bygger bagefter (H1-H4 i planen), og du kan ikke spørges igen efter 16. november 2026.

### Målet
Bogen skal være flot og engagerende for en 12-13-årig og indholdsrig nok til nørderne. Kan en 13-årig tage fortællingen alene på fem minutter og bagefter sige kernesætningen med egne ord? Er gåden (anagrammet) sjov og til at løse, også på en telefon? Holder latinen og oversættelsen? Er den ærlig om, hvad Huygens tog fejl af? Sig det, når noget ikke holder, og sig hvorfor. Er du i tvivl, så sig det.

### Hvad du skal læse
1. CLAUDE.md (står i samtalen), [docs/retning.md](retning.md) og din skabelon [docs/fable/E3-forloeb.md](fable/E3-forloeb.md).
2. Udkastet: [docs/drejebog-huygens.md](drejebog-huygens.md) (hele). Planen: afsnit 1, 3, 4 og 6 og "Jeres svar" i [docs/plan-videnskabsfolk.md](plan-videnskabsfolk.md) (`grep -n "^## " docs/plan-videnskabsfolk.md`, og læs kun de afsnit).
3. Faktagrundlaget: [docs/fakta-videnskabsfolk/huygens.md](fakta-videnskabsfolk/huygens.md) (hele) og afsnit 3 (Huygens) og "Forslag til kernesætning" i [docs/fakta-videnskabsfolk.md](fakta-videnskabsfolk.md).
4. **Bogen selv:** *Systema Saturnium* (1659) på archive.org, id `CristianiHugeni00HuygA`. Siderne som billeder: `https://archive.org/download/CristianiHugeni00HuygA/page/n65_w1200.jpg` (s. 46), `n66` (s. 47), `n67` (s. 48) og tavlen `n51` (ved s. 35). OCR-teksten er `CristianiHugeni00HuygA_djvu.txt` (`grep`). Læs s. 46-48 på billederne, ikke kun i OCR'en (den mister bogstavrækken).
5. Det, der findes ved Saturn: citatet `huygensSaturn` i `js/data/citater.js` og kortet "Hvor tynde er ringene?" i `js/data/sider/saturn.js` (`grep -n "huygens\|tynde" ...`).
6. Fælderne: [docs/erfaringer/fakta-faelder-liv-og-videnskabsfolk.md](erfaringer/fakta-faelder-liv-og-videnskabsfolk.md) (afsnittet om videnskabsfolkene og linjerne om Huygens).

### Hvad du skal levere
Én fil: **`docs/fable/E12-huygens.md`**, højst ca. 10 KB. I denne rækkefølge:
1. **Det vigtigste først** (højst 5 linjer): Kan H1 startes, som det står? Hvad skal ændres først?
2. **Kernesætningen:** holder anbefalingen (A), eller er B eller C bedre? Er den for lang?
3. **Trinene:** for hvert trin, der skal ændres: hvad, hvorfor og et forslag til ny tekst (kort dansk, til en 13-årig). Tjek reglerne i skabelonen (3-6 trin, gæt i mindst to trin, én handling, højst ca. 15 og 20 ord, højst to ord pr. trin). Er trin 3 et stærkt nok wow-øjeblik? Er det rigtigt at gemme anagrammet til trin 4, og kan ANNULO findes på en telefon?
4. **Formen for alle ti:** Er de fem lag (forsiden, fortællingen, gåden, Gør det selv og bogen selv) den rigtige form, og holder de Retningens budget? Er en bog i 2D med en fortæller den rigtige indpakning for en 12-13-årig? Hvad er den største risiko for, at det bliver en lærebog i stedet for noget, man gør?
5. **Latinen og oversættelsen** (drejebogen afsnit 6): ret de steder, hvor Opus' danske oversættelse er forkert eller for fri. Tjek også, at latinen i tabellen står som i bogen.
6. **Fakta:** de påstande i drejebogen og faktafilen, der er forkerte, upræcise eller for sikre, med kilde. Især: "ca. 50 gange" (Wikipedia siger 43), 1847 for navnet Titan, "første måne fundet ved Saturn", at Titan og anagrammet er præcis ét år fra hinanden (25. marts 1655 og 1656), og forklaringen på Galileis tre kugler. Skriv ikke det, der holder, op én for én.
7. **Opus' spørgsmål** (drejebogen afsnit 12 og planen afsnit 9): Står "Jeres svar", så skriv kun, hvor du er uenig, og hvorfor. Ellers din anbefaling til hvert.
8. **Det, der mangler,** fx en bedre gåde, et bedre gæt eller noget, der vil få barnet til at gå i stå.

### Regler for dig
- Du ændrer **ikke** kode, tekster i programmet, udkastet, planen eller regler. Skriv kun i `docs/fable/` (og nye linjer i bunden af fakta-fælderne, hvis du finder en ny fælde). Når filen er skrevet, **stopper du**.
- Primære kilder (bogen selv, NASA, ESA, JPL og fagfællebedømte artikler). Står en kilde kun i din hukommelse, så skriv det. Mangler et domæne, så bed om det med en anmodning til miljøet.
- Commit, push og lav en PR til `main`, og merge den med det samme (CLAUDE.md). Skriv en linje i [lige-nu/videnskabsfolkene.md](lige-nu/videnskabsfolkene.md) under "Næste": "Fables tjek af drejebogen til Huygens er skrevet, se `docs/fable/E12-huygens.md`".

## Efter Fables svar
1. Opus skriver `docs/fable/E12-huygens-noter.md` (hvad der er nyt, og hvor Opus er uenig, som i `docs/fable/E9-overblik-noter.md`) og retter drejebogen. Fables fil rettes ikke.
2. I svarer på det, der er åbent (kernesætningen og Gør det selv), og giver go. Så bygges H1 (Opus, høj effort), ved siden af Gåderne 3D.
