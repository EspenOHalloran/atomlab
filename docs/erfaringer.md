# Erfaringer: det, der virker, og det, der ikke virker

Denne fil opdateres løbende, så vi kan arbejde hurtigere og med færre fejl. Skriv nye erfaringer ind, når noget virker godt, eller når noget gik galt (og hvad vi gjorde ved det). Kort og konkret.

## Arbejdsmåde, der virker
- **Mål i stedet for at gætte.** Når et tal på skærmen beskriver spillets egen simulering, så mål det i simuleringen. Eksempler: kontrolstavene i Reaktoren (stabil ved ca. 50 %), frastødningens "bakke" i Stjerneovnens graf (regnet efter med spillets egne tal) og hvor tit man rammer en kerne med musen (målt med 40 forsøg).
- **Regn fakta efter, og skriv udregningen ned.** Fx "1 gram brint → helium svarer til over 20 ton kul" (0,7 % af mc² ≈ 6,4·10¹¹ J, kul 24-30 MJ/kg). Vis spændet, når kilderne er uenige (fx kul 24-30 MJ/kg), og vælg en forsigtig formulering ("over 20 ton").
- **Testadgangen (`?test`)** gør det muligt at spole frem, fryse tiden og læse tilstanden direkte. Brug den i stedet for at vente på animationer.
- **Udregninger inde i siden:** Statistik (fx ramme-procent) laves i én `page.evaluate`, så tiden ikke går imens.
- **Frys tiden til skærmbilleder** (fx `atomlabTest.fusion.rejseTid(t)`). Testbrowseren tegner kun 3-4 billeder i sekundet, og et skærmbillede tager ca. et sekund, så billeder taget mens noget bevæger sig viser det forkerte øjeblik.
- **Skærmbilleder på pc, tablet og telefon (begge veje)**, hver gang layout eller kamera ændres: pc 1280×800, tablet 1024×768 og 768×1024, telefon 390×844 og 844×390. Brug `node tests/vaerktoejer/skaermbilleder.mjs <skærm>`, kig på billederne, og led efter ting, der overlapper.
- **Kør testene én ad gangen.** Kører flere browsere på én gang, fejler testene tilfældigt.
- **Læs sin egen ændring igennem kritisk før commit.** Det har fundet ubrugt kode, en tast, der virkede to gange, og en lyd, der spillede, når man forlod en skærm.
- **Små fælles byggeklodser** frem for kopier: beskeder (`visBesked`), guiden (`startGuide`) og pausen (`lavPause`) bruges flere steder, så de opfører sig ens.
- **Faktatjek med flere agenter på hver sit område** (oktober 2026) fandt ca. 15 klare fejl og mange upræcise formuleringer i ca. 850 påstande. Agenterne må kun læse. Deres vigtigste fund skal tjekkes efter i koden eller mod kilder, før de bliver rettet. Når en regel skal tjekkes (fx henfaldsmåder), så kør selve funktionen over kendte tilfælde i stedet for at læse koden.
- **Ny funktion, der rører fælles ting, skal tjekkes alle steder, den virker.** Pausen fryser Kosmos' ur, men stjernernes overflade bruger `performance.now()` og koger videre. Søg efter `performance.now` og lignende, når noget skal kunne sættes på pause.
- **"Næste skridt" og "Vis mig"** hjælper meget med at komme i gang. "Vis mig" må ikke klare opgaver for en.

## Faldgruber (det, der ikke virkede, og hvad vi gjorde)
- **Gættede tal i grafer.** Bakken i Stjerneovnens graf var først gættet og gav ca. 2 % i stedet for ca. 30 % ved 15 mio. °C. Rettet ved at måle i spillets fysik. Ændres fysikken (`FRASTØD`, `RN`, `termiskFart`), skal `BAKKE` måles igen.
- **Kamerastyringen har en skjult grænse.** `styring.maxDistance` (250) holder kameraet tæt på, også når styringen er slået fra. En planlagt kameratur skal hæve grænsen og sætte den tilbage bagefter.
- **Smalle skærme giver en anden kameraafstand.** På en telefon på højkant står kameraet længere væk (`passerTil` regner ud fra hullet). Rejsen ind i Solen sluttede derfor uden for Solen. Afstande skal regnes ud fra `verden.målAfstand`, og telefon på højkant skal altid testes.
- **Ting i 3D-vinduet, der overlapper.** Et mærke midt for oven stødte ind i "Næste skridt"-kortet. Brug `bundIVindue()` til ting nederst (over underteksterne). Et lag oven på hele vinduet skal have z-index 1, ellers dækker det underteksterne (z-index 2).
- **Lyde før man har trykket på siden** gav advarsler i browseren. Lyde springes nu over, indtil siden er brugt (`navigator.userActivation`).
- **Kø med forsinkelse:** Pillerne (beskeder) gav en fejl, når køen blev tømt imens. Tjek køen igen inde i `setTimeout`.
- **Test, der lyver:** En statistik viste for gode tal, fordi en valgt kerne ikke blev nulstillet mellem forsøgene. En test valgte et mål, der lå under "Næste skridt"-kortet. Vælg mål i frit område, og nulstil tilstanden mellem forsøg.
- **Push før testene er færdige:** En automatisk regel kræver push, når en tur slutter. Derfor: Kør hele testsamlingen, før arbejdet afsluttes. Hvis der alligevel pushes før, så sig det.
- **`pkill` med et mønster**, der også passer på ens egen kommando, lukker ens egen terminal. Brug process-id i stedet.
- **Fænomener, der bruger det fælles ur**, kan ikke sættes på pause. Kosmos fik derfor sit eget ur (`kosmosTid`). Ny kode skal bruge `dt` og `tid`, som den får, og ikke `performance.now()`.
- **Skærmbilleder af "hele siden"** (`fullPage`) viser kun det synlige, fordi panelerne ruller hver for sig. Rul elementet frem (`scrollIntoViewIfNeeded`), og tag billedet bagefter.
- **Tests, der lå i en midlertidig mappe**, ville være forsvundet, når sessionen sluttede. De ligger nu i `tests/`.
- **Konsolfejl talte ikke med** i de ældste tests (de blev kun skrevet ud). Nu giver de fejl i alle tests.
- **Tabellen over testene var forkert** (skrevet efter hukommelsen). Tjek altid i filerne.
- **Tilfældighed i tests:** Testen af Stjerneovnen forventede præcis 40 protoner efter 7 sekunder, men to protoner kan smelte sammen af sig selv. Tjek noget, der altid gælder (fx at der er 40 kernepartikler i alt), i stedet for et præcist antal. Fejlen afslørede også, at ovnens beskeder kunne skubbe rejsens undertekster væk. Nu venter de, til rejsen er slut.
- **En sjælden testfejl kan være en ægte fejl.** Testen `guide` fejlede én gang, fordi "Vis mig" i Stjerneovnen ikke lavede nogen reaktion. Målt med 60 forsøg skete det i 4 af dem: En tredje kerne skubbede skuddet af kurs, eller en af de to smeltede sammen med en anden først. Rettet, så de to kerner går igennem de andre, og skuddet styrer hele vejen. Bagefter: 0 af 60. Afvis ikke en fejl som "ustabil test", før årsagen er fundet. Målescriptet er nemt at lave med testadgangen.
- **Tekst i tests:** Søg uden forskel på store og små bogstaver (fx `/eksplod/i`). Knappen hed "Lad stjernen eksplodere", ikke "Eksplodér".

## Testsamlingen
Testene ligger i [tests/](../tests/README.md). Kør dem med `node tests/koer-alle.mjs`. Se README'en for, hvad hver test tjekker.

## Åbne punkter
- **Testen `henfald` er ustabil ved "ion lige efter henfald":** Den fejlede én gang i hele samlingen, men bestod to gange alene. Atomet er kun en ion i et par sekunder efter henfaldet, og testen læser det i rigtig tid. Den bør laves om, så den bruger testadgangen i stedet for at vente. Undersøg samtidig, om der også er en ægte fejl bagved (se "Vis mig" ovenfor).
- Ikke testet med rigtig mus og rigtige fingre: hvordan det føles at sigte i Stjerneovnen, og hvor glat rejsen ind i Solen kører. Det skal prøves af jer.
