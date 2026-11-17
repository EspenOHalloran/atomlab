# Prompt: Batteriet får to nye "Hvorfor?" (jeres spørgsmål 17. november 2026)

*Skrevet 17. november 2026 i Småting efter jeres gennemgang. Kopiér teksten nedenfor ind i en ny session. Model: Opus, effort høj (fysik og fakta med tal, der skal holde).*

---

> Spor: Småting. Navngiv chatten "Småting · Batteriet: lade hurtigt og spændingen, der falder". Læs `docs/lige-nu/smaating.md`, `docs/prompt-batteri-hvorfor.md` (denne fil, afsnittet "Indhold"), `docs/kode/` om Batteriet (`grep -n batteri docs/kode/*.md`), `docs/stilguide.md` (A5: spørgsmål er en gul pille, der åbner et kort) og tjekliste C og E. Læs `docs/erfaringer/fakta-faelder.md`, før teksterne skrives.
>
> Opgaven: Batteriet (`js/batteri.js`, `js/data/hvorfor.js`) får to nye "Hvorfor?"-kort og en lille ændring i simuleringen, så den anden kan ses:
> 1. **"Hvorfor kan man ikke lade lige så hurtigt, som man bruger strømmen?"** med et "For nørder" om, hvad der er sket med opladningen af elbiler de seneste år.
> 2. **"Hvorfor falder spændingen, når batteriet arbejder?"** (på engelsk "voltage sag"): spændingen falder under belastning og kommer langsomt tilbage, når batteriet hviler.
>
> Skriv først teksterne og en kort plan (hvor kortene står, og hvad der ændres i simuleringen), og få et go. Faktatjek med `/faktatjek` (op til ca. 15 påstande selv). Afslut med `/faerdig`. Træk fra, når I lægger til: Batteriets panel må ikke vokse, så kortene kommer i "Hvorfor?"-laget.

## Indhold (Opus' udkast til fysikken, 17. november 2026, skal faktatjekkes)
**1. Lade langsommere end aflade.**
- Ved opladning skal lithium-ionerne ind mellem lagene i grafitten (den negative side). Det tager tid, fordi de skal sive ind i små korn. Skubber laderen hurtigere, end ionerne kan nå ind, hober de sig op på overfladen og sætter sig som metallisk lithium ("lithium plating"). Det slider batteriet og kan i værste fald give nåle (dendritter), som batteriet allerede nævner under "Pas på".
- Ved afladning skal ionerne ud af grafitten. Det har ikke samme fare, så et batteri kan levere store strømme (fx en elbil, der accelererer).
- Derfor lader man hurtigt, mens batteriet er tomt, og langsommere til sidst (konstant strøm, så konstant spænding). De sidste ca. 20 % tager derfor lang tid.
- Kulde gør det værre (ionerne bevæger sig langsommere), og derfor varmer bilen batteriet op, før den lynlader.
- Ærligt: I en elbil går opladningen ved en lynlader faktisk hurtigere end almindelig kørsel bruger strømmen. Det er kun den korte, kraftige afladning (acceleration), der er hurtigere.

**For nørder: hvad er sket de seneste år?** (alle tal skal tjekkes, og årstal og firmanavne kun, hvis de holder)
- Spænding: 800 V-systemer i stedet for 400 V giver samme effekt med halv strøm og dermed meget mindre varme i kabler og batteri (P = U · I, varmen er I² · R, som Batteriet allerede siger).
- Bedre køling af batteriet og af stikket, og batteriet varmes op inden ladningen.
- Elektroderne er tyndere, og grafitkornene er mindre eller får tilsat silicium, så ionerne har kortere vej.
- Ladekurver, der styres af batteriets egen computer.
- Tal at tjekke: tidlige lynladere ca. 50 kW (omkring 2015), mange nye biler 250-350 kW, og kinesiske fabrikanter har vist omkring 1.000 kW (BYD, marts 2025) og celler til 10-12C (CATL Shenxing). "Mangedoblet" holder sikkert, men skriv kun de tal, der kan findes i en god kilde.

**2. Spændingen falder og kommer igen.**
- Straks: Batteriet har en indre modstand. Strømmen gennem den koster spænding (U = I · R). Det har simuleringen allerede (`MODSTAND` i `js/batteri.js`), men spændingen springer straks tilbage, når strømmen stopper.
- Langsomt: Under afladningen bliver ionerne brugt op tæt ved overfladen af kornene, mens der stadig er mange inde i midten. Spændingen afhænger af overfladen, så den falder mere. Når batteriet hviler, siver ionerne ud, så de fordeler sig jævnt igen (diffusion), og spændingen kryber op igen over minutter.
- **Simuleringen:** Læg en lille, langsom del til spændingen (en "træghed", der vokser med strømmen og falder igen med en tidskonstant på få sekunder i spillets tid), så man kan se spændingen krybe op efter "Pause". Skriv i nørd-teksten, at tiden er trykket sammen (i virkeligheden minutter til timer). Testene for Batteriet skal tjekke, at spændingen stiger efter pause, ikke præcise tal.
