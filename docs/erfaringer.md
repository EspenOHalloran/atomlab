# Erfaringer: det, der virker, og det, der ikke virker

Denne fil opdateres løbende, så vi kan arbejde hurtigere og med færre fejl. Skriv nye erfaringer ind, når noget virker godt, eller når noget gik galt (og hvad vi gjorde ved det). Kort og konkret.

## Arbejdsmåde, der virker
- **Mål i stedet for at gætte.** Når et tal på skærmen beskriver spillets egen simulering, så mål det i simuleringen. Eksempler: kontrolstavene i Reaktoren (stabil ved ca. 50 %), frastødningens "bakke" i Stjerneovnens graf (regnet efter med spillets egne tal) og hvor tit man rammer en kerne med musen (målt med 40 forsøg).
- **Regn fakta efter, og skriv udregningen ned.** Fx "1 gram brint → helium svarer til over 20 ton kul" (0,7 % af mc² ≈ 6,4·10¹¹ J, kul 24-30 MJ/kg). Vis spændet, når kilderne er uenige (fx kul 24-30 MJ/kg), og vælg en forsigtig formulering ("over 20 ton").
- **Testadgangen (`?test`)** gør det muligt at spole frem, fryse tiden og læse tilstanden direkte. Brug den i stedet for at vente på animationer.
- **Udregninger inde i siden:** Statistik (fx ramme-procent) laves i én `page.evaluate`, så tiden ikke går imens.
- **Frys tiden til skærmbilleder** (fx `atomlabTest.fusion.rejseTid(t)`). Testbrowseren tegner kun 3-4 billeder i sekundet, og et skærmbillede tager ca. et sekund, så billeder taget mens noget bevæger sig viser det forkerte øjeblik.
- **Skærmbilleder i fire størrelser**, hver gang layout eller kamera ændres: pc 1280×800, tablet 1024×768 og 768×1024, telefon 390×844 og 844×390. Kig på dem, og led efter ting, der overlapper.
- **Kør testene én ad gangen.** Kører flere browsere på én gang, fejler testene tilfældigt.
- **Læs sin egen ændring igennem kritisk før commit.** Det har fundet ubrugt kode, en tast, der virkede to gange, og en lyd, der spillede, når man forlod en skærm.
- **Små fælles byggeklodser** frem for kopier: beskeder (`visBesked`), guiden (`startGuide`) og pausen (`lavPause`) bruges flere steder, så de opfører sig ens.
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
- **Tekst i tests:** Søg uden forskel på store og små bogstaver (fx `/eksplod/i`). Knappen hed "Lad stjernen eksplodere", ikke "Eksplodér".

## Testsamlingen
Testene er små Playwright-scripts, som kører med den Chromium, der er i udviklingsmiljøet (ingen npm i projektet). **De ligger ikke i repoet**, men i en midlertidig mappe, så de forsvinder, når sessionen slutter. Se "Åbne punkter".

| Test | Hvad den tjekker |
|---|---|
| test, test2, test3 | Atomværkstedet, opgaver, henfald, ioner |
| test4 | Stjerneovnen (opgaver, koldt, carbon) |
| test5, test6 | Reaktoren (spaltning, kædereaktion, nødstop) |
| test7 | Batteriet |
| fuld | Alle skærme på pc og tablet |
| kosmos | Alle 9 fænomener |
| besked, besked2 | Beskedsystemet (undertekster, piller, log) |
| system-mobil | Det periodiske system på telefon, tablet og pc |
| guide | Kom i gang-guiderne og "Vis mig" |
| fusion-mus | Stjerneovnen med mus: ramme-procent, slowmotion, pause, liste, graf og rejsen |
| pause | Pause i Reaktoren, Kosmos og Stjerneovnen (også at knapper som "Skyd neutron" slår den fra) og sammenligningerne |

## Åbne punkter
- **Testene bør gemmes i repoet** (fx i en mappe `tests/`), så de ikke skal skrives igen næste gang. Det kræver ingen npm i selve spillet, men testene bruger Playwright fra udviklingsmiljøet. Skal aftales.
- **test2 er ustabil ved "ion lige efter henfald":** Den fejlede én gang i hele samlingen, men bestod to gange alene. Atomet er kun en ion i et par sekunder efter henfaldet, og testen læser det i rigtig tid. Den bør laves om, så den bruger testadgangen i stedet for at vente.
- Ikke testet med rigtig mus og rigtige fingre: hvordan det føles at sigte i Stjerneovnen, og hvor glat rejsen ind i Solen kører. Det skal prøves af jer.
