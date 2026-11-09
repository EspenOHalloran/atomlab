# Prompt: Tid og rum, T5 Trin 0 (drejebogen og skitserne til "Hvorfor går tiden langsommere?")

*Skrevet 8. november 2026. Start en ny session med "Læs docs/prompt-tid-t5.md". **Model: Opus. Effort: høj** (svær fysik, der skal forklares enkelt, faktatjek og danske tekster). Jeres go og svar er givet 8. november 2026 (se T5 i `docs/plan-tid.md`).*

---

Lav **T5 Trin 0**: drejebogen og skitserne til et nyt fænomen i Kosmos, "Hvorfor går tiden langsommere?". Der bygges intet i AtomLab i Trin 0. Målet er en forklaring, som en 13-årig forstår, og som I har prøvet af med jeres søn, før den bygges.

**Jeres ønske** (jeres ord): "Tidsudvidelse er et uhyre interessant begreb og utrolig svært at forstå. Kan vi bruge lidt flere ressourcer på at forklare det, gerne med illustrationer eller animationer. Jeg ved det er svært. Men det kunne være vildt fedt, hvis vi kunne forklare hvorfor tiden 'går langsommere' når man flyver rigtig hurtigt."

**Jeres svar (8. november 2026):** et nyt fænomen i Kosmos ved siden af Rejsen i tid, og de to henviser til hinanden. Alle fem scener skal med: 1 bolden og lyset, 2 lysuret med trekanten, 3 myonernes kapløb, 4 "nu" er ikke det samme for alle og 5 rumtidskortet. Trin 0 laver også skitserne som små animationer i et artefakt.

**Afklarende spørgsmål** (jeres ord): "Afklarende spørgsmål stilles ved at du forklarer problem, giver din anbefaling og lader mig vælge." Brug spørgsmål med valgmuligheder og anbefalingen først (som "Når I skal beslutte noget" i DESIGN.md). Saml spørgsmålene tidligt i stedet for at stille dem ét ad gangen undervejs.

**Læs først (kun disse dele):**
- `docs/lige-nu/tid.md` og DESIGN.md.
- I `docs/plan-tid.md`: "Forklaringen", "Flere idéer til tid og rum" (idé 1, 3 og 9), T5 og "Fælder, vi skal undgå".
- I `docs/fakta-tid.md`: afsnit 1, 2, 3, 7, 9, 10 og "Kilderne" (med `offset`/`limit` eller `grep`).
- `docs/erfaringer/fakta-faelder.md` (det om tid og relativitet), `docs/tjeklister/b-fakta.md` og `/faktatjek`.
- I koden kun `LYS_TRIN` og `tegnLysur` i `js/kosmos/tid.js` (lysurets trin, farver og stil, så skitserne ligner) og afsnittet om Rejsen i tid i `docs/kode/kosmos.md`.
- Skillen `artifact-design`, før artefaktet laves.

**Trin 0 (forslag, ret det, hvis du finder noget bedre):**
1. **Afklar først** det, der er uklart, fx navnet på fænomenet, om scenerne er én rejse med "Næste" eller emner, man vælger frit, og hvor meget scene 4 (samtidighed) skal forklare.
2. **Faktagrundlaget:** et nyt afsnit 15 i `docs/fakta-tid.md` (14 er holdt fri til T4) med kilder til det nye: Michelson og Morley (1887, og hvad de faktisk målte), Einstein som 16-årig og lysstrålen (hans egne erindringer, med kilde), bolden i toget (150 km/t er næsten præcist, og den rigtige regel for, hvordan farter lægges sammen, er til nørderne), lampen i togvognen (samtidighed), rumtidskortet (egentid: den lige vej giver mest tid) og myonerne (afsnit 10 findes. Brug kun tal, der kan bekræftes, for Frisch og Smiths tal blev ikke bekræftet i T3). Regn tallene efter i `docs/fakta-tid/regn.py`. Kommer `docs/fakta-tid.md` over ca. 30 KB, så del den op efter emne i `docs/fakta-tid/` (som `docs/fakta-solsystemet/`). Wikipedia og arxiv.org var nok før. Skal der bruges et domæne, der ikke er åbent, så spørg først.
3. **Drejebogen** i en ny fil `docs/plan-tid-t5.md`. For hver scene: spørgsmålet, den svarer på, hvad animationen viser, og hvad man selv kan gøre (skydere, kontakter, fingeren), de en til to sætninger, der altid står fremme, "Hvorfor?" og "For nørder" (dybde i lag), hvad animationen snyder med ("Ærligt talt") og overgangen til næste scene. Tjek teksterne mod fælderne (fx at du ikke mærker noget selv, og at billedet "man bevæger sig altid gennem rumtiden med lysets fart" kun bruges med forbehold). Skriv også, hvor fænomenet står i Kosmos' liste (se punkt 7 i `docs/koereplan.md` om grupperne), hvordan det og Rejsen i tid henviser til hinanden, og hvordan scenerne virker på telefon og tablet på højkant.
4. **Skitserne:** én HTML-side med de fem scener som små, rigtige animationer (2D-lærred, ingen biblioteker) og de samme sætninger som i drejebogen, så I kan prøve forklaringen af med jeres søn på tabletten. Den skal virke med fingre og på højkant, og fysikken skal passe (fx den samme lysets fart i begge billeder og γ regnet rigtigt). Gem kilden i `docs/skitser/tid-t5.html`, så T5a-T5c kan genbruge tegnekoden, og udgiv den som artefakt.
5. **Jeres runde med jeres søn:** Spørg bagefter, hvad han forstod, og hvad ikke (det kan tage et par dage, og I kan fortsætte i samme session). Skriv svarene ind i `docs/plan-tid-t5.md`, og ret drejebogen og skitserne, til I er tilfredse.
6. **Prompterne til byggeriet:** Når I har godkendt drejebogen, skriv prompterne til byggeriet, fx `docs/prompt-tid-t5a.md` (selve fænomenet og scene 1-2), `t5b` (scene 3) og `t5c` (scene 4-5), hver med læseliste, filer, tests (5-10 tjek, tjekliste F) og model og effort.

**Andre sessioner kører samtidig** (se "Parallelle sessioner" i CLAUDE.md). Dit spor er **Tid og rum** (`docs/lige-nu/tid.md`). Du ejer `docs/plan-tid.md`, `docs/plan-tid-t5.md`, `docs/fakta-tid.md`, `docs/fakta-tid/`, `docs/skitser/tid-t5.html`, `docs/prompt-tid-t5*.md` og `docs/lige-nu/tid.md`. Rør ikke koden i Trin 0. Merge `main` ind, når du starter, og igen lige før dokumenterne rettes og PR'en laves.

**Når Trin 0 er færdig** (først når I har godkendt drejebogen): Ret `docs/lige-nu/tid.md` ("Senest lavet" og "Næste"), og skriv, hvordan T5a startes (DESIGN.md, "Når et punkt er færdigt").
