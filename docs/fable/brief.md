# Brief: F1, et samlet overblik over AtomLab

*Skrevet af Opus 22. oktober 2026 som trin F0 i [docs/plan-fable.md](../plan-fable.md). Svaret skrives i `docs/fable/F1-overblik.md`.*

## Hvem og hvorfor
AtomLab er et interaktivt 3D-program i browseren om atomer, grundstoffer, kernereaktioner og rummet. En far laver det til sin søn på 13 år. Sønnen bruger det, men koder ikke selv. Det meste er bygget af Opus over mange sessioner, trin for trin.

Faren synes, at AtomLab er godt, men vil have dine øjne på, hvor det kan blive bedre. Målet er, at det bliver **lige så gennemført som et godt spil eller en god app**, set fra sønnens side. At dele det med skoler kommer senere og er ikke målet nu.

Du skal se på det med friske øjne og være kritisk. Du har ikke bygget det, så du skal ikke forsvare det. Brug kræfterne på vurderingen. Bagefter bygges det, I bliver enige om, i en anden session. Budgettet er lille, så læs målrettet: det, der skal til for at vurdere, og ikke alt.

## Opgaven (F1)
Giv et samlet overblik på tværs af fire områder: **teknik, UI, grafik og indhold**. Svar på to spørgsmål:
1. Hvad vil løfte AtomLab mest for sønnen?
2. Hvor betaler det sig at gå i dybden bagefter (F2)?

Du skal også vurdere idélisten (se nedenfor).

## Rammer, som ikke ændres
- Ren HTML, CSS og JavaScript (ES-moduler) med Three.js 0.186.1. Intet byggetrin, ingen npm og ingen frameworks. Foreslå kun det, hvis gevinsten er meget stor, og sig hvorfor.
- Al tekst er på dansk, i et sprog en 13-årig forstår, og fagord forklares. Fysikken skal være tæt på virkeligheden, og forenklinger siges ærligt.
- Det skal virke på pc, tablet og telefon. `LAV_KVALITET` skruer ned for effekterne på touch-enheder.
- Infopanelet i Atomværkstedet må ikke få en rullebjælke.

## Hvad du skal læse
1. **`CLAUDE.md`:** et kort over koden (hvad hver fil gør) og reglerne. Brug det i stedet for at læse alle filerne.
2. **`DESIGN.md`:** "Lige nu" øverst, alle trin, der er lavet, og "Idéer til senere".
3. **`docs/fable/billeder/LISTE.md` og billederne:** 53 skærmbilleder af alle skærme, de 15 fænomener i Kosmos og fem forløb i træk (et henfald, en fusion, en kædereaktion, en supernova og Big Bang).
   - Billederne er taget i en testbrowser uden grafikkort. Gløden og farverne kan derfor se lidt anderledes ud end på en rigtig skærm.
   - **`docs/fable/tablet/`** har 14 billeder taget af faren på en rigtig tablet (Samsung Galaxy Tab A11+, Chrome), med en liste (`LISTE.md`). Grafikken skal især bedømmes ud fra disse, da testbrowseren ikke har et rigtigt grafikkort. Et fund derfra: på billedet af Sort hul dækker tablettens egen systemboble (batteri/Bluetooth) en del af 3D-billedet øverst til højre — ikke en fejl i AtomLab, men værd at nævne, hvis noget vigtigt kan blive dækket af systemets overlay dér.
4. **`docs/fable/soen-og-espens-noter.md`:** Far og søn har prøvet AtomLab sammen og skrevet noter ned. **Læs dem grundigt og vægt dem højt** — det er den direkte stemme fra brugeren, det hele handler om. Kort opsummeret: ønske om at kunne skjule panelerne, for mange tekstbokse fremme på samme tid, et "hvorfor" mere i nogle forklaringer (magnetisme, hvorfor radioaktivitet er farligt), mere fakta om grundstofferne i Det periodiske system (hvor de findes, hvad de bruges til), et grafisk løft af Batteriet og af atomerne (forsiden og værkstedet), og et spørgsmål om LiPo vs. Li-ion-navngivningen (Opus har skrevet et foreløbigt svar dernede, som skal vurderes, ikke tages for givet).
5. **Det, der allerede er kendt.** Du skal ikke bruge tid på at finde det igen:
   - `docs/gennemgang-2026-10.md`: Opus' eftersyn fra oktober. Faktafejlene (A1-A3) og de fleste kodefejl (D1-D7, D10) er rettet. Afsnit B (helheden) og D8, D9, D11 og D12 venter. Det står i "Status for rettelserne" nederst.
   - `docs/erfaringer.md`: tjeklister, rodårsager, kendte fælder i fakta og "Åbne punkter".

   Du må gerne tage et kendt punkt med i din top 10, hvis det hører til dér, men skriv, at det er kendt. Sig også til, hvis du er uenig i et af de kendte fund eller i, hvor vigtigt det er.
6. **Koden:** Kig i de filer, hvor du har brug for belæg. Du behøver ikke læse alle 17.000 linjer. De største filer er `js/fusion.js`, `style.css`, `js/reaktor.js`, `js/vaerksted.js`, `js/atom.js` og `index.html`.
7. **Programmet selv:** Hvis et billede ikke er nok, kan du åbne programmet med Playwright (se `tests/README.md` og testadgangen `?test` i CLAUDE.md). Det er dyrt, så gør det kun, når det er nødvendigt.

## Tal, som Opus har målt
- **Kode:** ca. 16.900 linjer i `index.html`, `style.css` og `js/`. De største filer er `js/fusion.js` (1.257 linjer), `style.css` (1.204), `js/reaktor.js` (1.029), `js/vaerksted.js` (968), `js/atom.js` (714) og `index.html` (714).
- **Download:** Ved start henter programmet ca. 3,1 MB i 62 filer, uanset hvilken skærm man åbner, fordi alle moduler indlæses med det samme. Heraf er 2,2 MB Three.js (`three.core.js` og `three.module.js`, som ikke er gjort mindre), og 0,8 MB er AtomLabs egen kode. Jorden og Månen (Årstiderne og Formørkelser) henter desuden NASA-billeder: ca. 5 MB på tablet og telefon og ca. 11 MB på pc.
- **Tests:** 21 Playwright-tests (`node tests/koer-alle.mjs`). Resultatet af den seneste kørsel står nederst.
- **Ingen fejl i konsollen,** mens billederne blev taget.
- **Ikke målt:** hvor glat det kører på en rigtig tablet. Testbrowseren tegner kun 3-8 billeder i sekundet uden grafikkort, så tallet siger intet om en rigtig enhed.

## Idélisten (fra "Idéer til senere" i DESIGN.md)
Vurder kort hver idé: Hvor meget værdi giver den sønnen, hvor svær er den, og kræver den en plan fra dig, eller kan Opus planlægge den selv?
- "Test dig selv" (små spørgsmål til sidst i hver del)
- En chat, hvor man kan stille spørgsmål
- Tidslinje over, hvornår grundstofferne blev opdaget
- Molekyler i Atomværkstedet (Byttebørsen, byg molekyler, se vand blive til, hvor Jordens vand kommer fra)
- Tjernobyl i Reaktoren
- Ny del: Solsystemet med Rumrejsen (der er en plan i `docs/plan-solsystemet.md`, men du skal ikke gennemgå den nu)
- Vis eller skjul panelerne ("Kun grafik")
- Ny del: Liv

Den engelske udgave skal ikke vurderes. Du må gerne foreslå 1-3 nye idéer, hvis du ser noget, der mangler.

## Sådan skal svaret se ud
Skriv `docs/fable/F1-overblik.md` på dansk til faren. Brug et klart og enkelt sprog med korte sætninger og ingen fagjargon uden forklaring. Svaret må højst fylde ca. 3 sider. Udvælg hellere end at komprimere.

1. **Det vigtigste først:** 3-5 linjer om, hvad du fandt.
2. **Det, der er godt, og som ikke skal røres.**
3. **De 10 forbedringer, der løfter AtomLab mest** for sønnen, med den vigtigste først. For hver:
   - område (teknik, UI, grafik eller indhold)
   - hvad, og hvorfor det betyder noget for sønnen
   - et konkret forslag
   - størrelse (lille, mellem eller stor)
   - om Opus kan bygge det direkte, eller om det kræver en plan fra dig
   - nyt eller kendt (fra eftersynet i oktober)
   - belæg: en fil og en linje, et billede fra listen eller noget, du selv har set i programmet
4. **Idélisten:** din vurdering af hver idé og eventuelle nye idéer.
5. **Hvor det betaler sig at gå i dybden (F2),** og hvorfor. Hvis det ikke betaler sig, så sig det.
6. **Spørgsmål til faren.**

## Grænser
- Skriv kun `docs/fable/F1-overblik.md`. Ret ikke kode eller andre filer. Opus bygger bagefter.
- Commit og push kun din egen fil. Commitbeskeden skal være på dansk og må ikke nævne modelnavne.
- Har du ikke selv tjekket noget, så skriv det. Gæt ikke på tal eller fakta.
- Når filen er skrevet, er du færdig. Gå ikke videre til F2 af dig selv. Faren beslutter, hvad der skal ske bagefter.
- Spørg kun undervejs, hvis du er gået i stå. Ellers skal spørgsmålene stå til sidst i filen.

## Testresultat
Kørt 22. oktober 2026 med `node tests/koer-alle.mjs`: **alle 21 tests bestod** (14,4 minutter, to ad gangen). De største er `henfaldsregler` (21.556 tjek af henfaldsreglerne), `ordforklaring` (216 tjek) og `system-mobil` (142 tjek).
