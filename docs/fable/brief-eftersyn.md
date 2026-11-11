# Brief: Det store eftersyn af AtomLab (E1)

*Skrevet af Opus 9. november 2026 ([plan-fable-eftersyn.md](../plan-fable-eftersyn.md)). Afsnittene med beslutningerne, det planlagte og tallene er fyldt ud i E0 (11. november 2026), og detaljerne står i `docs/fable/eftersyn/`. Dit svar skrives i `docs/fable/E1-eftersyn.md`, `docs/fable/E1-verdener.md` og `docs/fable/E1-retning.md`.*

## Hvem og hvorfor
AtomLab er et interaktivt 3D-program i browseren om atomer, molekyler, kernereaktioner, liv, tid og rummet. En far startede det til sin søn på 13 år. Sønnen bruger det, men koder ikke. Faren koder heller ikke selv: Alt er bygget af Opus over mange sessioner, ofte flere ad gangen, i spor, med en plan og et "go" før hvert trin.

**Målet er blevet større** (farens svar 11. november 2026, se `docs/fable/eftersyn/noter.md`): Om et år skal AtomLab helst være så godt, at det kan **frigives og bruges i skoler og af helt almindelige mennesker** med interesse for emnet, fra ca. 12 år og op, også nysgerrige voksne. En 12-årig eller en nysgerrig voksen skal kunne sætte sig med det og få en **let forståelig og blid indføring i svære koncepter**. Faren synes selv, at programmet er blevet for komplekst i UI og UX, og at de nye dele (Tid, Molekyler og Liv) er svære at forstå, også for ham. Vurder alt ud fra den målgruppe, ikke kun ud fra én dreng.

Det er vokset meget. Ved det sidste overblik (oktober 2026) var der ca. 17.000 linjer. Nu er der ca. 40.600 linjer JavaScript i 133 moduler og 148 dokumenter, bygget på knap fire uger (fra 14. oktober). Faren vil nu have en ekspert ind, før det vokser videre. Med hans ord: en konsulent eller arkitekt, der ser på det fra helikopteren, tager stilling til, om det giver mening, sådan som det er sat sammen, og som sikrer en professionel løsning.

**Det, du skriver, bliver grundlaget for den videre udvikling.** Opus 5.5 bygger bagefter, i mange sessioner, ud fra dine anbefalinger og farens valg. Du bygger ikke selv. Brug derfor kræfterne på det, der kræver dømmekraft: at se helheden, vurdere og vælge. Lad være med at bruge dem på det, Opus kan finde eller lave selv.

## Opgaven
Vurder AtomLab som helhed, og giv faren en klar retning. Han vil især høre din mening om:
1. **Helheden:** Hænger det sammen som ét produkt eller som mange gode dele ved siden af hinanden? Er verdenerne og delene skåret rigtigt? Hvad mangler, hvad står dobbelt, og hvad bør samles eller skæres væk?
2. **Indholdet:** Er det det rigtige indhold for en nysgerrig 12-årig (og en nysgerrig voksen) i hver verden? Hvor kommer "aha"-oplevelserne, og hvor bliver det tungt, tyndt eller for meget? Målet er nysgerrighed og forståelse, ikke pensum, men det er en fordel, når det rammer fysik/kemi i udskolingen.
3. **UI og UX:** det første minut, navigationen, motivationen (opgaver, stjerner og fremgang), sammenhængen mellem skærme bygget af forskellige sessioner, touch og hvor let teksten er at læse.
4. **Grafikken og udtrykket:** Ser det ud som ét gennemført spil? Hvad ser billigt eller uens ud?
5. **Ydelse og teknik:** download, opstart og hukommelse på en almindelig tablet. Opbygningen uden byggetrin: kan den bære dobbelt så meget indhold, og hvad bliver svært først?
6. **Arbejdsgangen:** dokumenterne, sporene, prompterne, testene og valget af model og effort. Hvad koster mest for mindst værdi? Hvad ville en erfaren leder af et lille udviklingshold ændre?
7. **Fremtiden:** Køreplanen og idéerne. Er rækkefølgen rigtig? Hvad skal ske de næste par måneder, hvad senere, og hvad aldrig? Og hvilke muligheder har ingen tænkt på (indholdet eller indpakningen)?
8. **Kortet over AtomLab: verdenerne i ringen** (farens ønske 9. november 2026). Menuen er en ring af verdener (`VERDENER` i `js/karrusel.js` og `docs/plan-verdener.md`), sat fra det mindste til det største, med Biblioteket som opslagsværk til sidst. Tag stilling til, hvor tingene skal ligge, og om der skal nye verdener ind. **Tænk de planlagte ting med ind**, ikke kun det, der findes i dag: fx de store videnskabsfolk, Gåderne, Mørkt stof, Kvantefysik med kvantecomputeren, Antistof, Ild, Tjernobyl og månerne. Listen over alt det planlagte står i "Det planlagte" nedenfor. Målet er en plan for, hvor hver ting skal være, hvad der logisk hører sammen, og hvad der giver den bedste oplevelse for brugerne, også når AtomLab er dobbelt så stort. Sig også, hvad der skal flyttes i dag, og hvad det koster.
9. **Guidede forløb** (farens ekstra opgave 11. november 2026): Kan vi lave forløb, hvor brugeren ledes igennem og tages i hånden, så man ved, hvor man skal starte, og får forståelsen? Der findes allerede noget i den stil (fx "Næste skridt", "Vis mig", opgaverne og de fem scener i "Hvorfor går tiden langsommere?"), men det kan måske styrkes. Det hænger tæt sammen med den blide indføring ovenfor. Sig, om og hvordan, og hvor man skal starte.

Faren beder også om to ting mere (noterne, punkt 3 og 4): en vurdering af, om arbejdsgangen kan gøres endnu mere effektiv, og en skitse af, hvad der kan nås for hvilke midler (han bruger mange ressourcer nu, og svaret er "lad os bare klø på").

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
2. **Brugerens stemme, og vægt den højt:** `docs/fable/eftersyn/noter.md` (farens svar 11. november 2026; sønnens nye runde kommer ikke før eftersynet, så du må vurdere uden hans stemme), farens kommentarer til tabletbillederne i `docs/fable/eftersyn/tablet/LISTE.md` og de gamle noter fra oktober i `docs/fable/soen-og-espens-noter.md`.
3. **Beslutningerne og tallene** nedenfor.
4. **Først til sidst** de tidligere vurderinger, så de ikke præger dig: `docs/fable/F1-overblik.md` (oktober) med status nedenfor, `docs/gennemgang-2026-10.md`, `docs/koereplan.md`, `docs/ideer.md` og `docs/lige-nu/aabne-punkter.md`. Brug dem til at sige, hvad der er nyt i dit svar.

## Siden sidste overblik
F1's ti punkter fra 23. oktober er lavet, undtagen nr. 7 (delvist: fremgangen findes, men ikke "Se også" mellem delene). Siden er Saturn, Mars med Stå på Mars, Jupiter, Uranus, Neptun og Venus (halvt) kommet til i Solsystemet, Solsystemet er blevet sin egen skærm, menuen er en ring af verdener, og Molekyler, Liv (L0-L2), Ordbogen, Rejsen i tid og "Hvorfor går tiden langsommere?" er nye. Hvert punkt med en linje står i `docs/fable/eftersyn/tal.md`, afsnit 1.

## Beslutningerne
De vigtigste med dato og den grund, der blev givet dengang (fra CLAUDE.md, DESIGN.md, køreplanen, planerne og historikken). Står der ingen grund, blev den ikke skrevet ned.

**Produktet**
1. Dansk til en 13-årig, fysik tæt på virkeligheden, forenklinger siges ærligt ("Ærligt talt") (14. oktober). Grund: sønnen er brugeren.
2. Et laboratorium med opgaver, stjerner og grundstoffer, man "opdager" ved at bygge dem (14. oktober).
3. Dybde i tre lag: altid fremme, "Hvorfor?" og "For nørder", hver oplysning ét sted (23. oktober). Grund: for mange tekstbokse på én gang, og farens princip "stor dybde, men føles let".
4. Infopanelet i Værkstedet får aldrig en rullebjælke (oktober).
5. Solsystemet er sin egen skærm (26. oktober) og bygget, så "alt er et sted": navigation til venstre, oplevelsen i midten, siden i lag til højre (30.-31. oktober). Grund: listen fulgte koden og ikke rejsen, og "Prøv selv" var rodet.
6. "Det hele skal med" i Solsystemet, så flot og imponerende som muligt med rigtige kort fra rumorganisationerne (24. oktober). Planeterne kommer før overblikket og Rumrejsen (5. november).
7. Menuen er en ring af verdener fra det mindste til det største, Biblioteket sidst, og delene er knapper i verdenens kort (7.-8. november). Grund: 8 dele, og 12-15 på vej.
8. Molekylerne ligger i Værkstedet, Tid og rum i Kosmos og Antistof under Kernerne (7. november).
9. Liv rykket op lige efter Molekyler, med DNA (5. november). Tjernobyl rykket ned og venter (23. oktober og 5. november). Grund: en ulykke med døde, og spillets reaktor virker modsat Tjernobyls.
10. Prototyper må ligge i den almindelige udgave (24. oktober). Grund: Kun familien bruger AtomLab.

**Teknikken**
11. Ren HTML, CSS og JavaScript (ES-moduler), Three.js kopieret ind i `lib/three/`, intet byggetrin, ingen npm og ingen frameworks uden at spørge (14. oktober). Python-pakker må bruges i billedværktøjerne (24. oktober).
12. GitHub Pages, ingen server og ingen løbende udgifter (14. oktober).
13. `LAV_KVALITET` skruer ned for effekter på touch-enheder (oktober). Grund: tablet og pc er lige vigtige.
14. Store kort hentes, når man går ind til en klode (op til 8k, efter grafikkortet og `LAV_KVALITET`), med bjælken "Henter …" (6. november). Komprimerede teksturer (KTX2) er ikke nødvendige nu (24. oktober). Grund: Mars kørte fint med 8k på farens tablet.

**Arbejdsgangen**
15. Et "go" før hvert trin, og beslutninger lægges frem som valg med anbefalingen først (oktober og 7. november). Grund: ikke spilde tid og penge.
16. Én PR pr. færdigt punkt, merget straks af Opus uden review (8. november). Grund: faren er den eneste i repoet.
17. Spor: én session pr. spor med sin egen statusfil, fælles dokumenter rettes til sidst (7. november). Grund: merge-konflikterne lå i de fælles dokumenter.
18. Dokumenterne er delt i små filer med et læsekort og grænser for størrelsen (6. november). Grund: nye sessioner brugte næsten 100.000 tokens, før de svarede.
19. En ny session til hver delopgave, startet med en prompt i `docs/prompt-*.md` (7. november). Grund: lange samtaler er dyre.
20. Tests: kun de berørte (`--ændret`) under arbejdet, 5-10 tjek pr. ny funktion, og en test, der kun fejler under belastning, noteres og springes over (24. oktober-8. november). Grund: værdi for prisen, og faren tester selv på tabletten.
21. Opus bygger alt, Fable vurderer. Fable ventede på 5.5 (23. oktober, 5.1 lå for tæt på Opus til prisen). Eftersynet laves nu med Fable 5.2 (9. november).
22. Domæner og værktøjer spørges om, før arbejdet går i gang (24. og 29. oktober).

## Det planlagte
Ringen, som den er nu (verdenerne med deres dele og fænomener), og alt det planlagte, én linje hver med indhold, størrelse og den plads, det er tænkt til i dag, står i **`docs/fable/eftersyn/planlagt.md`**. Kort fortalt: 6 verdener i ringen (Atomer og molekyler, Kernerne, Ild og liv, Elektricitet, Rummet og Biblioteket) med 10 dele. Elektricitet, Ild og liv og Biblioteket har kun én del hver. Kosmos har 13 fænomener på én liste, og Solsystemet har 8 kloder med underpunkter. Besluttet, men ikke bygget: bl.a. Liv L3-L6, Ild, Kvantefysik, Antistof, Mørkt stof, Gåderne, månerne, Tjernobyl, resten af planeterne, overblikket og Rumrejsen.

## Tallene
Alt står i **`docs/fable/eftersyn/tal.md`** (målt 11. november 2026). Det vigtigste:
- **Kode:** 40.618 linjer JavaScript i 133 moduler. Største fil: `js/kosmos/mars.js` (1.599 linjer). `billeder/` fylder 309 MB i repoet, men kun én størrelse af hvert kort hentes.
- **Start:** Al koden hentes ved start (149 filer, 4,4 MB ukomprimeret). Skærmene uden kloder henter derefter intet. En klode i Solsystemet henter 10-25 MB på pc og 3-19 MB på tablet. Teksturerne i scenen er skønnet til op til ca. 630 MB på pc (Saturn) og 320 MB på tablet.
- **Tests:** 42 tests med 3.089 tjek, alle grønne, 30,9 minutter for hele samlingen. Et typisk `--ændret` tager 1-12 minutter.
- **Dokumenter:** 148 filer (1,9 MB). En ny session læser mindst ca. 29 KB, og ca. 55-60 KB før arbejde i koden.
- **Tempo:** 572 commits og 136 merget PR'er på fire uger, flest i uge 45 (171 commits og 76 PR'er).
- **Kan ikke måles her:** billeder i sekundet, varme og den rigtige grafikhukommelse på en tablet. Brug farens billeder og ord for det.

## Sådan skal svaret se ud
Skriv på dansk til faren, i et klart og enkelt sprog med korte sætninger. Forklar fagord. **Udvælg hellere end at komprimere:** Det vigtigste skal stå tydeligt, og resten må gerne udelades.

**`docs/fable/E1-eftersyn.md`** (højst ca. 8 sider):
1. **Kort fortalt:** 5 linjer med din samlede vurdering.
2. **Det, der er stærkt, og som ikke må gå tabt.**
3. **Helheden:** dit billede af, hvordan AtomLab bør hænge sammen, og hvor det afviger i dag.
4. **De 10-15 anbefalinger, der løfter AtomLab mest,** med den vigtigste først. For hver:
   - område, hvad og hvorfor (set fra brugerens side, en 12-årig eller en nysgerrig voksen, når det er muligt)
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
