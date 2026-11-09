# Brief: Det store eftersyn af AtomLab (E1)

*Skrevet af Opus 9. november 2026 ([plan-fable-eftersyn.md](../plan-fable-eftersyn.md)). Afsnittene med ⟨E0⟩ fyldes ud i E0, lige før du starter. Dit svar skrives i `docs/fable/E1-eftersyn.md`, `docs/fable/E1-verdener.md` og `docs/fable/E1-retning.md`.*

## Hvem og hvorfor
AtomLab er et interaktivt 3D-program i browseren om atomer, molekyler, kernereaktioner, liv, tid og rummet. En far laver det til sin søn på 13 år. Sønnen bruger det, men koder ikke. Faren koder heller ikke selv: Alt er bygget af Opus over mange sessioner, ofte flere ad gangen, i spor, med en plan og et "go" før hvert trin.

Det er vokset meget. Ved det sidste overblik (oktober 2026) var der ca. 17.000 linjer. Nu er der ca. 41.000 i 125 moduler og ca. 140 dokumenter. Faren vil nu have en ekspert ind, før det vokser videre. Med hans ord: en konsulent eller arkitekt, der ser på det fra helikopteren, tager stilling til, om det giver mening, sådan som det er sat sammen, og som sikrer en professionel løsning.

**Det, du skriver, bliver grundlaget for den videre udvikling.** Opus 5.5 bygger bagefter, i mange sessioner, ud fra dine anbefalinger og farens valg. Du bygger ikke selv. Brug derfor kræfterne på det, der kræver dømmekraft: at se helheden, vurdere og vælge. Lad være med at bruge dem på det, Opus kan finde eller lave selv.

## Opgaven
Vurder AtomLab som helhed, og giv faren en klar retning. Han vil især høre din mening om:
1. **Helheden:** Hænger det sammen som ét produkt eller som mange gode dele ved siden af hinanden? Er verdenerne og delene skåret rigtigt? Hvad mangler, hvad står dobbelt, og hvad bør samles eller skæres væk?
2. **Indholdet:** Er det det rigtige indhold for en nysgerrig 13-årig i hver verden? Hvor kommer "aha"-oplevelserne, og hvor bliver det tungt, tyndt eller for meget? Målet er nysgerrighed og forståelse, ikke pensum, men det er en fordel, når det rammer fysik/kemi i udskolingen.
3. **UI og UX:** det første minut, navigationen, motivationen (opgaver, stjerner og fremgang), sammenhængen mellem skærme bygget af forskellige sessioner, touch og hvor let teksten er at læse.
4. **Grafikken og udtrykket:** Ser det ud som ét gennemført spil? Hvad ser billigt eller uens ud?
5. **Ydelse og teknik:** download, opstart og hukommelse på en almindelig tablet. Opbygningen uden byggetrin: kan den bære dobbelt så meget indhold, og hvad bliver svært først?
6. **Arbejdsgangen:** dokumenterne, sporene, prompterne, testene og valget af model og effort. Hvad koster mest for mindst værdi? Hvad ville en erfaren leder af et lille udviklingshold ændre?
7. **Fremtiden:** Køreplanen og idéerne. Er rækkefølgen rigtig? Hvad skal ske de næste par måneder, hvad senere, og hvad aldrig? Og hvilke muligheder har ingen tænkt på (indholdet eller indpakningen)?
8. **Kortet over AtomLab: verdenerne i ringen** (farens ønske 9. november 2026). Menuen er en ring af verdener (`VERDENER` i `js/karrusel.js` og `docs/plan-verdener.md`), sat fra det mindste til det største, med Biblioteket som opslagsværk til sidst. Tag stilling til, hvor tingene skal ligge, og om der skal nye verdener ind. **Tænk de planlagte ting med ind**, ikke kun det, der findes i dag: fx de store videnskabsfolk, Gåderne, Mørkt stof, Kvantefysik med kvantecomputeren, Antistof, Ild, Tjernobyl og månerne. Listen over alt det planlagte står i "Det planlagte" nedenfor. Målet er en plan for, hvor hver ting skal være, hvad der logisk hører sammen, og hvad der giver den bedste oplevelse for sønnen, også når AtomLab er dobbelt så stort. Sig også, hvad der skal flyttes i dag, og hvad det koster.

**Du må gerne udfordre beslutninger, der allerede er taget,** også dem nedenfor. Sig, hvad det koster at skifte, og om det er det værd. Vær ærlig: Faren vil ikke tales efter munden, og du har ikke bygget det, så du skal ikke forsvare det.

## Rammer
**Faste** (udfordr dem kun, hvis du mener, de skader projektet):
- Al tekst er på dansk, i et sprog en 13-årig forstår, og fagord forklares. Fysikken er tæt på virkeligheden, og forenklinger siges ærligt ("Ærligt talt").
- Det skal virke på pc, tablet (lige meget på langs og på højkant) og telefon. Det åbnes via et link (GitHub Pages).
- Der er ingen server og ingen løbende udgifter.

**Valgt, men gerne til diskussion:** ren HTML, CSS og JavaScript (ES-moduler) med Three.js 0.186.1, intet byggetrin, ingen npm og ingen frameworks. Resten står i beslutningslisten (se nedenfor).

## Sådan læser du (i denne rækkefølge)
At læse er billigt for dig, at skrive er dyrt. Læs og se derfor bredt, og skriv kort.
1. **Se først selv, før du læser andres vurderinger:**
   - `CLAUDE.md` er kortet over koden og reglerne. `DESIGN.md` er aftalerne.
   - Skærmbillederne i `docs/fable/eftersyn/billeder/` (listen står i `LISTE.md`). De er taget i en testbrowser uden grafikkort, så gløden og farverne kan se anderledes ud.
   - Farens billeder fra tabletten i `docs/fable/eftersyn/tablet/`. Grafikken skal især bedømmes ud fra dem.
   - Programmet selv, hvis billederne ikke er nok: start en server (`python -m http.server 8000`) og åbn det med Playwright (se `tests/README.md` og `?test` i `docs/kode/testadgang.md`).
   - Koden der, hvor du har brug for belæg. Du behøver ikke læse det hele. Brug gerne en Haiku- eller Sonnet-hjælpeagent til at tælle og søge, men læs selv det, du vurderer.
2. **Brugerens stemme, og vægt den højt:** `docs/fable/eftersyn/noter.md` (den nye runde med sønnen og farens svar) og de gamle noter i `docs/fable/soen-og-espens-noter.md`.
3. **Beslutningerne og tallene** nedenfor.
4. **Først til sidst** de tidligere vurderinger, så de ikke præger dig: `docs/fable/F1-overblik.md` (oktober) med status nedenfor, `docs/gennemgang-2026-10.md`, `docs/koereplan.md`, `docs/ideer.md` og `docs/lige-nu/aabne-punkter.md`. Brug dem til at sige, hvad der er nyt i dit svar.

## Siden sidste overblik ⟨E0⟩
*Opus skriver her, hvad der er sket med F1's ti punkter (én linje hver: lavet, delvist eller ikke lavet) og de store dele, der er kommet til siden oktober.*

## Beslutningerne ⟨E0⟩
*Opus skriver her de 15-25 vigtigste beslutninger med dato og grund (én linje hver), fx ingen byggetrin, verdenerne i en ring, dybde i lag, `LAV_KVALITET`, store billeder fra NASA, spor og parallelle sessioner, reglerne for tests og Fables og Opus' roller.*

## Det planlagte ⟨E0⟩
*Opus skriver her alt det, der er besluttet eller foreslået, men ikke bygget (fra `docs/koereplan.md`, `docs/ideer.md` og planerne), én linje hver: navnet, en halv linje om indholdet, størrelsen, og hvor det er tænkt at ligge i dag (verden og del), eller "ikke afgjort". Og ringen, som den er nu: verdenerne i rækkefølge med deres dele.*

## Tallene ⟨E0⟩
*Opus skriver her det, der er målt: download, opstart og hukommelse pr. skærm, koden pr. mappe, dokumenterne (og hvad en ny session mindst læser), testene og arbejdsgangen. Og hvad der ikke kan måles i testbrowseren.*

## Sådan skal svaret se ud
Skriv på dansk til faren, i et klart og enkelt sprog med korte sætninger. Forklar fagord. **Udvælg hellere end at komprimere:** Det vigtigste skal stå tydeligt, og resten må gerne udelades.

**`docs/fable/E1-eftersyn.md`** (højst ca. 8 sider):
1. **Kort fortalt:** 5 linjer med din samlede vurdering.
2. **Det, der er stærkt, og som ikke må gå tabt.**
3. **Helheden:** dit billede af, hvordan AtomLab bør hænge sammen, og hvor det afviger i dag.
4. **De 10-15 anbefalinger, der løfter AtomLab mest,** med den vigtigste først. For hver:
   - område, hvad og hvorfor (set fra sønnens side, når det er muligt)
   - et konkret forslag
   - størrelse (lille, mellem eller stor) og hvad den hænger sammen med (fx "efter nr. 3")
   - hvem der skal i gang: Opus direkte, Opus med en plan først, eller dybde fra dig (E3)
   - belæg (en fil og en linje, et billede eller noget, du har set i programmet), og hvor sikker du er (sikker, sandsynlig eller et gæt)
   - nyt eller kendt (fra F1 eller eftersynet i oktober)
5. **Beslutninger, du vil udfordre:** beslutningen, hvorfor, hvad du foreslår i stedet, og hvad det koster at skifte. Sig også, hvis du mener, at en beslutning holder.
6. **Arbejdsgangen:** hvad der virker, og 3-5 konkrete justeringer.
7. **Køreplanen, som du ville lægge den:** de næste 2-3 serier, så "senere" og "ikke nu". Brug punkterne i `docs/koereplan.md`, og sig, hvad du flytter, og hvorfor.
8. **Hvor du (Fable) klart vil gøre det bedre end Opus fremover, og hvor det ikke betaler sig.**
9. **Spørgsmål til faren.**

**`docs/fable/E1-verdener.md`** (højst ca. 6 KB): kortet over AtomLab (opgave 8). Verdenerne i ringens rækkefølge, med de dele, der findes, og de planlagte ting på deres plads (også det, der først kommer om lang tid). For hver verden: hvad den handler om, og hvorfor tingene hører sammen dér. Derefter det, der skal flyttes i dag, og hvad det koster, og hvordan ringen skal vokse, så den ikke bliver uoverskuelig. Sig, hvor du er i tvivl, og giv gerne to muligheder med din anbefaling først. Opus bruger filen til at rette `docs/plan-verdener.md` i E2.

**`docs/fable/E1-retning.md`** (højst ca. 5 KB): et udkast til "Retningen", som Opus skal læse, før en ny del eller skærm bygges. Kun det, der skal gælde i lang tid: hvad AtomLab er, og hvad det ikke er, principperne for indhold og UI, kvalitetskravene (det, en ny del skal leve op til for at være "færdig"), og grænserne for ydelsen (fx hvor meget en skærm må hente på en tablet). Skriv det som korte regler, som Opus kan følge uden at spørge.

## Grænser
- Skriv kun i `docs/fable/`. Ret ikke kode eller andre filer. Opus bygger bagefter.
- Commit og push kun dine egne filer til `main`. Commitbeskeden skal være på dansk og må ikke nævne modelnavne.
- Har du ikke selv tjekket noget, så skriv det. Gæt ikke på tal eller fakta. Fakta om fysik og kemi tjekkes senere af Opus med `/faktatjek`. Du skal kun sige, hvor du ser en risiko.
- Når filerne er skrevet, så stop og sig til. Faren læser dem og taler med dig bagefter. Gå ikke videre til planer eller dybde af dig selv.
- Spørg kun undervejs, hvis du er gået i stå. Ellers skal spørgsmålene stå til sidst i filen.
