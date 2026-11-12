# Prompt: Måleren og hakkene på Mars (G1, trin 1)

*Skrevet 12. november 2026 efter jeres spørgsmål: "Mars kan stadig hakke lidt, også på pc. Kunne det give mening med en gennemgang for at se, om noget kunne optimeres?" Jeres go er givet til **trin 1**. Kopiér teksten nedenfor ind i en **ny session** i sporet Solsystemet. Model: Opus, høj effort.*

*Hele forløbet: (1) Opus laver måleren og gennemgår koden til Mars og retter de billige årsager, (2) I måler på pc og tablet og sender tallene, (3) Opus retter de dyre årsager ud fra målingen, (4) eventuelt et eftersyn af grafikken med Fable ud fra jeres egne billeder. Hvert trin kræver et go.*

---

Lav trin 1 af G1 i `docs/plan-grafik.md`: en måler for billeder i sekundet og en gennemgang af hakkene på Mars. Du hører til sporet **Solsystemet og Kosmos** og skriver kun status i `docs/lige-nu/solsystemet.md`. Jeres go gælder kun trin 1. Når det er lavet, stopper du og fortæller, hvordan måleren bruges.

**Baggrund:** Mars kan stadig hakke lidt, også på pc. Fables eftersyn 11. november 2026 målte kun det, der hentes, hukommelsen, kaldene og trekanterne (`docs/fable/eftersyn/tal.md`: Mars på pc ca. 1,06 mio. trekanter, 35 kald og ca. 330 MB teksturer). Det målte ikke, om det hakker, for testbrowseren har intet grafikkort. Hakkene er altså ikke undersøgt før.

**Spørg først** (I har ikke svaret endnu): (1) Hakker det hele tiden, eller er det ryk i bestemte øjeblikke (når man zoomer tæt på, når kameraet flyver til et nyt sted, første gang et sted besøges, i Stå på Mars)? (2) Hvilken pc (grafikkort eller bærbar uden særskilt grafikkort, browser, og er skærmen i 4K)? Måleren afhænger ikke af svarene, så gå i gang med den, mens I venter. Gennemgangen bruger svarene til at vælge, hvor der skal ledes først.

**Læs først** (kun det, opgaven bruger, se "Tokens" i CLAUDE.md):
- `docs/lige-nu.md` og `docs/lige-nu/solsystemet.md`.
- `docs/plan-grafik.md`, afsnit 1, 3A, 4 og 6.
- `docs/retning.md`, afsnittet "Ydelse".
- Rækkerne for Mars og forklaringen af kolonnerne i `docs/fable/eftersyn/tal.md` (brug `grep`).
- `docs/kode/mars.md` og de afsnit i `docs/kode/faelles.md`, der handler om `scene3d.js` og `hentning.js`.
- Tjekliste E og F i `docs/tjeklister/`, og erfaringerne `docs/erfaringer/staa-paa-mars.md`, `planeter-og-maaner.md`, `shadere.md` og `tests-og-vaerktoejer.md` (brug `grep` efter hentning, initTexture, hak og net).
- `js/kosmos/linse.js` øverst: det sorte hul skruer allerede selv ned for opløsningen, når der tegnes under 45 billeder i sekundet. Se, hvordan den måler, og genbrug det, hvis det passer.

Er du i tvivl om noget, så spørg, før du bygger det.

**Del 1: Måleren (`?maal` i adressen)**
- Et lille felt i et hjørne, kun med `?maal` (kan kombineres med `#solsystem` osv.). Det skal ikke vises i almindelig brug og ikke gøre starten større: Modulet hentes med `import()`, kun når `?maal` står i adressen.
- Det viser billeder i sekundet (gennemsnit), tid pr. billede, det værste billede de sidste 5 sekunder og antallet af ryk over 50 ms. Desuden `renderer.info` (kald, trekanter, geometrier, teksturer, shaderprogrammer), lærredets størrelse i pixel og `pixelRatio`.
- **En liste over ryk:** For hvert ryk over ca. 50 ms skrives et klokkeslæt, og hvad der skete lige før: nye shaderprogrammer, et kort, der blev lagt i grafikkortet, eller hentet færdigt, og en kamerarejse, der startede. Det er den vigtigste del, for den fortæller, *hvorfor* det hakker.
- En knap "Kopiér", så I kan sætte tallene ind i chatten. Den korte tekst er på dansk.
- Måleren skal virke under pause og på alle skærme, ikke kun Mars.
- Hæng helst måleren på uden at ændre `scene3d.js`. Ændres den, kører `--ændret` næsten alle tests. En linje i `js/main.js` er i orden (i jeres egen blok).

**Del 2: Gennemgang af Mars (og Stå på Mars) for hak.** Led efter de typiske årsager og skriv for hver, hvad du fandt, og hvor meget det sandsynligvis koster:
- Store kort (8k), der lægges i grafikkortet på én gang (`initTexture` i `mars.js` linje ca. 328 og 507, og hvor billederne pakkes ud: på hovedtråden eller med `createImageBitmap`).
- Shadere, der først laves, når man ser noget nyt (fx de lokale net, atmosfæren, skyerne og Stå på Mars). Kan de laves på forhånd med `renderer.compileAsync`?
- Kode, der laver nye objekter (`new Vector3` osv.) eller nye geometrier i hvert billede i `opdater`.
- Opløsningen: `pixelRatio` op til 2 på pc (`scene3d.js` linje ca. 47) giver et meget stort lærred på en 4K-skærm, og gløden kører i fuld opløsning på pc.
- De ca. 1 mio. trekanter, de lokale net ved stederne og gennemsigtige lag oven på hinanden (atmosfæren, skyerne og disen).
- Noget, der tegnes, selvom man ikke kan se det (fx Jorden, månerne eller andre planeter bag Mars).

Testbrowseren kan ikke vise rigtige billeder i sekundet. Men den kan godt måle det, der sker på CPU'en: hvor lang tid `opdater` tager, hvor lang tid det tager at lægge et kort i grafikkortet og at lave en shader, og hvor mange objekter der laves. Mål før og efter, og sig ærligt, hvad tallene kan og ikke kan bruges til.

**Del 3: Ret de billige årsager.** Ret kun det, der ikke ændrer, hvordan noget ser ud eller opfører sig (fx genbrugte objekter, kort pakket ud uden for hovedtråden og shadere lavet på forhånd). Grafikken må ikke blive dårligere, og intet må blive grimmere. Alt det, der ændrer udseendet (lavere opløsning, færre trekanter eller dynamisk opløsning som ved det sorte hul) eller er stort, skrives som forslag med pris og gevinst. Det venter på jeres måling og jeres go (trin 3).

**Når du er færdig:**
- Skriv fundene og det, der er rettet, under "Status" i `docs/plan-grafik.md`, og måleren i den fil i `docs/kode/`, der passer. Sæt en linje i `docs/ikke-afproevet.md`: "Mål Mars med `?maal` på pc og tablet".
- Tests: `node tests/koer-alle.mjs --ændret` i baggrunden (`mars` tager ca. 10 minutter). Lav 3-5 tjek af måleren (den vises kun med `?maal`, tallene opdateres, og "Kopiér" virker).
- Kør `/faerdig`, og merge PR'en med det samme (se CLAUDE.md).
- Skriv til sidst en kort vejledning til jer: hvilken adresse der skal åbnes, hvad der skal gøres på Mars (rejs mellem stederne, zoom ned til Olympus Mons, flyby, Stå på Mars ved Gale) på pc og tablet, og at I skal sende teksten fra "Kopiér" tilbage. Skriv også prompten til trin 3 i denne fil, så næste session kan starte med tallene.
