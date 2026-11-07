# Skærme og UI

- **Bjælken "Henter AtomLab"** (6. november 2026): Forsiden henter ca. 95 JavaScript-filer (ca. 3,5 MB), før noget virker, og uden bjælke lignede siden en frossen side. Moduler kan ikke melde, hvor langt de er, så bjælken tæller hentede filer med `PerformanceObserver` mod et skøn (`FORVENTET` i index.html). Testen `henter` fanger, når skønnet ikke passer længere. Med `waitUntil: 'commit'` og forsinkede filer (`page.route`) kan bjælken ses i en test.

## En ny skærm med samme skal som en anden (Solsystemet, M4a, oktober 2026)
- **Del skallen i stedet for at kopiere den.** Kosmos' skal blev til `lavFænomenSkærm` (js/faenomenskaerm.js). Elementerne får skærmens navn foran (`kosmosListe`, `solsystemListe`) og beholder de samme klasser, så CSS'en kun skulle have `:is(#kosmos, #solsystem)` de steder, hvor der stod `#kosmos`. Alle `querySelectorAll` i skallen er afgrænset til skærmens sektion.
- **Den nye skærm skal stå efter den gamle i index.html.** Testene bruger fx `page.click('[data-kosmos-fane="nørd"]')` uden at afgrænse, og Playwright tager den første, der passer. Står den skjulte skærm først, venter klikket forgæves.
- **Gemte data, når noget flytter:** De sete og det sidst valgte flyttes én gang (`flytGemt`), før skærmene bygges. Tælleren "x af N set" tæller kun de id'er, der hører til skærmen. Før talte den alt i den gemte liste, så den ville have vist "8 af 11".
- **Tælling med `replace` i Python:** `'#kosmos {'` passede også på `#kosmos { grid-template-columns …`. Tjek antallet (`assert s.count(a) == n`), før en tekst skiftes ud mange steder.
- **En sidste række med færre kort i midten:** Et CSS-gitter kan ikke centrere en halv række. Menuen bruger derfor `flex-wrap` med `justify-content: center` og en bredde ud fra `--kol`.

## Eftersyn af UX i Solsystemet (30. oktober 2026)
- **Genbrugt skal, genbrugt model:** Solsystemet fik Kosmos' skal (M4a), og med den Kosmos' flade liste, hvor én fil er ét punkt. Kosmos er en række fænomener, men Solsystemet er steder inde i steder. Derfor havnede stederne og månerne som knapper under "Prøv selv". Når en skal genbruges, så spørg, om indholdet har samme form.
- **Tekst, der flytter med en skal, kan gå i stykker:** Solens fremtid sagde stadig "Prøv Hvid dværg i listen", efter fænomenet var flyttet fra Kosmos til Solsystemet. Henvisninger skal være knapper med `data-gaa`, ikke tekst om, hvor noget står.
- **U1, træet:** Mars og Saturn havde allerede funktioner til hvert sted (`vælgSted`, `besøgMåne`, `vælg`, `besøg`). Træet skulle kun bruge dem (`gåTil`) og vide, hvor man er (`sted()`, tjekket fire gange i sekundet i skallen). Det gjorde det let, også fordi et sted kan vælges tre steder fra (træet, kloden og flybyen).
- **Et sted, der kræver en bestemt opstilling** ("Mars set fra Phobos" kræver, at Phobos står som på flybyen): Lad månen glide derhen under flyvningen i stedet for at hoppe. Kameraets mål er en funktion, så kameraet følger med. Kræver det to flyvninger, så tjek med et tæller (`gåNr`), at der ikke er valgt noget andet imens.
- **`node tests/koer-alle.mjs --help` kører hele samlingen** (den kender ikke `--help`). Læs kommentaren øverst i filen i stedet.
- **Se på, hvad der står samme sted på skærmen:** Det, der afslørede rodet, var skærmbilleder af flybyen på tablet på højkant ("Næste" langt nede under listen og stoppets tekst uden for skærmen) og ved Saturn, hvor en knap, der ikke kan bruges, og en kontakt, der er slået fra, så ens ud.

## Styringen på billedet (U2, 31. oktober 2026)
- **Tjek koden, før en advarsel i en plan bygges om:** Planen sagde, at kameraets flyvninger stod stille under pause. Det passede ikke: Rejsen kørte allerede i sin egen opdatering hvert billede (`verden.opdateringer`), kun skallen slog pausen fra ved et tryk i træet. Et nyt tjek (flyv under pause uden at spole) viser det nu.
- **Trin, der bygger oven på hinanden** (Big Bang, Solens fremtid): Et spring kan ikke bare sætte `trin = nr`. Noget sker kun i `opdater` undervejs (fx tågen i Solens fremtid i trin 5). Spring tilbage = forfra og frem igen, og spol de sprungne trin igennem.
- **Fælles regel i stedet for at flytte knapper én for én:** Skallen sorterer selv `styring` (handling → bjælken, kontakt og skyder → Styr-boksen). Derfor skulle de 11 fænomener i Kosmos næsten ikke ændres. Kun "↺ Forfra" fik `skjul`, så bjælken ikke fyldes med grå knapper.
- **En fælles byggeklods, der kan vokse, i stedet for to (U4):** Stjerneovnens tre tempoer passede ikke i tidsknappen (⏸ ▶ ⏩). I stedet for en særlig knap til Stjerneovnen fik `lavTidsknap` en valgfri tilstand mere (▷ langsom, `langsom(titel)`, ligesom `hurtig(titel)`), og `lavPause` kunne slettes. Mellemrum, "Vis mig" og et skud går tilbage til det tempo, man havde valgt (`fortsæt`), så intet tempo går tabt efter en pause.
- **En til/fra-knap, der viser det, man kan skifte til** ("Elektronsky", når atomet har ringe), er svær at læse: Man kan ikke se, hvad der er valgt nu. En kontakt med et fast navn og ✓ viser det (U4, `js/kontakt.js`). Find dem med grep efter knapper, der skifter tekst (`textContent = … ?`) eller "til"/"fra" i teksten.
- **Et nyt sted for en knap viser fejl i tilstande, ingen havde set:** "▶ Start flyby" stod pludselig i bjælken, mens man stod på Mars (før lå den i "Prøv selv", hvor den blev skiftet ud). Testen `landskab` fangede det.
- **Tegn ikoner i små knapper** (SVG) i stedet for tegn som ⏸: Nogle skrifttyper viser ⏸ meget lille, mens ▶ bliver en emoji.

## Siden i lag (U3, 31. oktober 2026)
- **Tekster, der deles op, skal skrives, ikke flyttes:** Hvert sted fik et nyt Kort, fordi stedets gamle tekst var den samme som underteksten. En test tjekker nu på hvert sted og i hvert fænomen, at underteksten ikke står på siden (`fase()` mod `side().tekst`).
- **Et link i en ordbog eller tekst skal pege på det sted, ordet står:** Da teksterne om Olympus Mons flyttede fra Mars' side til stedets, pegede Ordbogens "skjoldvulkan" og "caldera" stadig på Mars. Testen `ordbog` læste hele mars.js og så det ikke. Derfor kan `data-gaa` nu pege på et sted (`solsystem:mars:olympus`).
- **Testens egne lister skal følge med koden:** `ordforklaring.mjs` har sin egen kopi af `ZONER`, og `ordbog.mjs` og `ordforklaring.mjs` læser filer fra bestemte mapper. Begge fejlede først, da teksterne flyttede til `js/data/sider/` og boksene fik `.side-del`.
- **En kontakt, der kun findes i nogle tilstande** (fx "Uden hældning" efter Formørkelsernes trin, "Vis lagene" er en kontakt og ikke en handling): Knappen i teksten er grå, indtil den findes, og testen går derhen først. Tjek, om et punkt er en kontakt eller en handling, før det bliver en knap i teksten.
- **Faktatjek finder også det, der mangler:** "De seks store måner" ved Saturn passer ikke helt: Iapetus (ca. 1.470 km) er den tredjestørste og ikke med. Det står nu i "Ærligt talt".
- **Menuen som en ring (`js/karrusel.js`, 7. november 2026):**
  - **Glød bliver klippet af et rullefelt:** Et element med `overflow-x: auto` klipper også lodret, så kortenes `box-shadow` stod som et firkantet bånd (den første, lige karrusel). Giv rullefeltet luft (`padding`) og træk det ind igen med negativ `margin`, eller gør gløden mindre.
  - **Et absolut lag med `inset: 0` blev 0 px bredt** midt i en grid-celle (laget med kortene i ringen). `left: 0; top: 0; width: 100%; height: 100%` virkede. Mål laget (`getBoundingClientRect`), når kort står forkert.
  - **En ResizeObserver fyrer, når et skjult element vises igen.** I den lige karrusel centrerede den igen og afbrød et tryk på en pil, der var i gang. Reagér kun, når bredden faktisk ændrer sig.
  - **Atomets størrelse styres af vinduet:** `passerTil` passer atomet ind i det mindste af vinduets bredde og højde. Ringen giver derfor `#menuVindue` en kvadratisk størrelse og plads (`position: absolute`) og kalder `centrerVindue` og `passerTil`.
  - **CSS-filtre, der ændres hvert billede, tegner elementet om.** Lysstyrken på kortene skrives kun, når den ændrer sig synligt (afrundet). Den lette svæven er kun `transform`.
  - **Et træk på et link** starter browserens eget træk af linket: `draggable = false` og `-webkit-user-drag: none`. Et klik lige efter et træk skal ikke åbne delen.
- **`hidden` virker ikke, når CSS sætter `display`:** `.sys-lag { display: flex }` vandt over `hidden`, så linjerne fra det forrige grundstof (plutonium) stod på kortet for copernicium. Fundet af brugeren 7. november 2026. Giv elementet en regel `.x[hidden] { display: none; }`, og test med et grundstof uden data lige efter et med.

## Byttebørsen (Molekyler M1a, 7. november 2026)
- **Træk i 3D uden at dreje kameraet:** Elektronen fanges i `pointerdown` med `capture` på lærredet, før kameraets styring hører det (`stopImmediatePropagation`), og styringen er slået fra, til fingeren slipper. Testen trækker med `page.mouse` fra skærmpladsen i testadgangen (`elektronPå()`), og et træk et andet sted drejer stadig kameraet.
- **En vælger uden afgrænsning i en anden skærm:** Reaktoren finder sine del-knapper med `.del-knap[data-del]` i hele dokumentet. Værkstedets knapper har derfor `data-vaerksted-del`. Tjek altid med `grep`, om en klasse eller data-attribut allerede bruges uafgrænset et andet sted.
- **En stejl frastødning kræver små skridt:** Born-Mayer-formlen, der skal få parret til at stoppe ved 2,36 Å med 4,26 eV, har ρ ≈ 0,12 Å. Med ét skridt pr. billede ville ionerne skyde igennem hinanden. Skridt på højst 2 ms holder det stabilt. Tempoet blev valgt ved at simulere i Node først (ankommer efter ca. 1,7 s), ikke ved at prøve i browseren.
- **Ingen rullebjælke med foldebokse:** To foldebokse, der begge er åbne, gav en rullebjælke på pc (921 mod 724 px). `name` på `<details>` gør dem til en harmonika, så kun én er åben ad gangen, og testen åbner hver af dem på pc og tablet på langs.
- **Tal, der skrives om, når de ændrer sig:** Tallene i panelet blev kun skrevet, når summen ændrede sig. Den sidste linje (+5,78) passede så ikke med summen, efter at ionerne var landet (+5,79). Skriv hele teksten og sammenlign den, ikke kun ét tal.


## Ventetid ved skift af klode (7. november 2026)
- **Mål først, hvad ventetiden er:** Brugeren så 4-5 sekunder uden noget, når man skiftede fra Jupiter til Mars. Bjælken "Henter …" kom ikke, for tiden gik ikke med at hente billeder, men med JS, der låste browseren (målt med en CPU-profil). Efter rettelsen tager klikket ca. 0,6 s i testbrowseren.
- **En ventebesked kan kun bevæge sig, mens browseren er låst, hvis den er en CSS-animation af transform eller opacity,** og den skal være tegnet, før arbejdet starter. Rejseskiltet venter derfor på et billede (`requestAnimationFrame` og så `setTimeout`), før kloden bygges, og toner først ind efter 0,2 s, så hurtige skift ikke blinker.
- **En kontakt, som fænomenet selv slår fra:** `opdaterKnapper()` bygger hele Styr-boksen om, også en skyder, man trækker i. Brug `sætKontakt(navn, til)`, når det sker midt i et træk (roverens foto, der slukkes, når klokken flyttes).
