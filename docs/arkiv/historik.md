# Historik: "Lige nu" fra DESIGN.md (arkiv)

*Flyttet hertil ordret 5. november 2026, da "Lige nu" blev gjort kort igen. Nyeste øverst. Fremover flyttes det forrige "Senest lavet" hertil (øverst under denne linje), når noget nyt er lavet. Detaljerne om hver delopgave står også i planerne (`docs/plan-*.md` og `docs/arkiv/`).*

## "Senest lavet" 5. november 2026 (småtingspakken, før planen for Jupiter)
**Senest lavet (5. november 2026): småtingspakken, punkt 4 (prikkerne på himlen ved Olympus Mons).** Jeres go: "go, tag punkt 4 og ryd grenene op". Hermed er småtingspakken færdig (punkt 1-3 kom med i #69 og #71).
- **Den blålige prik var rumstøvet** fra `scene3d.js`, der hører til atomet (bevist med billeder med og uden). Det er nu skjult i alle fænomener med en sort himmel (`tåger: false`), dvs. hele Solsystemet og fx Årstiderne i Kosmos, og kommer igen i resten.
- **Den hvide prik med skær var efter alt at dømme Phobos eller Deimos.** De blev tegnet 3-14 gange for store (0,26° i radius, så de kan ses ude fra rummet). Ved et sted på Mars tegnes de nu i deres rigtige størrelse: Phobos ca. 0,2° bred og Deimos som en klar stjerne. Ikke set på et billede, for i vores kørsler stod månerne ikke på himlen ved Olympus Mons.
- **Tests:** nye tjek i `mars` og `saturn` (rumstøvet og månernes størrelse ude fra rummet og ved Olympus Mons). Alle 29 bestod (`--ændret` valgte alle, 34 minutter), `mars` efter en rettelse, som det nye tjek fangede. `guide` fejlede én gang under belastning (timeout på telefon i trin 4) og bestod alene, ligesom `stjerneovn-mus` sidst (se "Åbne punkter"). Billeder af Olympus-stoppet på pc og tablet på højkant: kun hvide stjerner på himlen.
- **Oprydning:** PR #45 er lukket uden merge. De fem gamle grene er ikke slettet, for sletningen blev afvist af miljøets sikkerhedstjek (se "Åbne punkter").

## "Senest lavet" 5. november 2026 (M8c del 1, før småtingspakken)
**Senest lavet (5. november 2026): M8c del 1, roverens foto.** Mars er hermed færdig (resten er "Mars ekstra"). Detaljerne står i [docs/plan-mars.md](docs/plan-mars.md) under "M8c del 1: rovernes panoramaer, målingerne" og "Status efter M8c del 1". Jeres svar ved go: "Ja, tag 1 og 2 med".
- **Kontakten "📷 Roverens foto"** står i Styr-boksen ved Naukluft og ved landingsstedet ved Jezero. Roverens eget 360°-foto fra samme sted toner ind over landskabet, og man drejer og zoomer som før. Fotoet er drejet, så Mount Sharp og kraterets rand står samme sted som i det tegnede, og klokken stilles til den tid, fotoet blev taget.
- **Afvigelse fra planen:** Planen sagde en knap i bjælken, der skifter frem og tilbage. Efter U4 er en til/fra-knap en kontakt i Styr-boksen, så det blev en kontakt, og teksten på stedets side har en knap til den. Navnet er "Roverens foto" (ental), for der er én rover ved hvert sted.
- **Vinklerne er målt** mod 3D-horisonten fra vores egne højdekort, mod Curiositys egen skygge og ved Perseverance mod kameraernes egne retninger fra NASA's data. Perseverances foto hælder ca. 1° med roveren, og det er der taget højde for.
- **Fotos:** Curiositys Mastcam-foto fra 4. april 2016 (PIA20332, farverne justeret til dagslys på Jorden, siger NASA) og Perseverances Mastcam-Z-foto fra 21. februar 2021 (PIA24264, NASA skriver ikke, hvordan farverne er justeret). 8k på pc (ca. 3,5 MB hver) og 4k på tablet (ca. 1 MB), hentet først, når kontakten slås til. Tekster faktatjekket ("Faktatjek M8c del 1" i `docs/fakta-solsystemet.md`).
- **Også lavet:** Hjælpen og "Om AtomLab" nævner nu Jezero og rovernes fotos, og testkøreren giver hver test 15 minutter (før 10).
- **Tests:** alle 29 bestod (21,8 minutter). `stjerneovn-mus` fejlede én gang sammen med en anden test og bestod alene (se "Åbne punkter").
- **Bagefter (egen lille PR):** Nitrogens "Vidste du?" er skrevet om uden ordet "bundet" (se "Idéer til senere"). Ikke afprøvet: Er den let at forstå for jeres søn?

## "Senest lavet" 5. november 2026 (før M8c del 1)
**Senest lavet (5. november 2026): oprydning i dokumenterne og planen efter Mars.**
- **Dokumenterne er gjort kortere,** fordi hver session læser dem (jeres go til alle fire punkter). CLAUDE.md har kun reglerne og en kort oversigt, og detaljerne om hver fil står i [docs/kode.md](../kode.md). Den gamle "Lige nu" står ordret i [docs/arkiv/historik.md](../arkiv/historik.md), og listerne "Ikke afprøvet" er samlet herunder. Det færdige i plan-mars.md og de færdige trin står i `docs/arkiv/`. erfaringer.md er sorteret efter emne. Intet er slettet.
- **Planeterne efter Mars er besluttet** ([docs/plan-solsystemet.md](../plan-solsystemet.md), afsnit 9): Mars slutter med M8c del 1. Så Jupiter → Venus → Merkur → Uranus og Neptun → Pluto (med Charon) → overblikket med en filmisk overgang. De store måner står som små kugler med rigtige kort fra start.
- **Ni nye idéer** er vurderet under "Idéer til senere". Alle undtagen Hjernen og AI står i planen (punkt 10 nedenfor).


## "Lige nu", som det stod 5. november 2026
*Opdateres, hver gang et stykke arbejde slutter (se `/faerdig`). Læs det først i en ny session. Sidst opdateret: 5. november 2026 (ni nye idéer er noteret under "Idéer til senere", og planeterne efter Mars er besluttet ([docs/plan-solsystemet.md](../plan-solsystemet.md), afsnit 9): Mars slutter med M8c del 1, så Jupiter først. Idéerne undtagen Hjernen og AI står i planen under "Venter på et go" (punkt 9 og 10). Næste: M8c del 1 og planen for Jupiter, begge venter på et go. Før det, 31. oktober 2026: M8b er færdig: Stå på Mars ved Jezero, og samme dag blev U4 færdig i en anden session: den samme tidsknap og de samme kontakter i resten af AtomLab. Næste er M8c del 1, rovernes panoramaer, og den venter på jeres go).*

**Sådan arbejder vi (jeres svar):**
- Få et "go", før et større stykke arbejde går i gang, og spørg, når noget er uklart. I vil have ærlige svar, ikke at blive talt efter munden.
- Én PR for hvert færdigt punkt. Opus merger den selv til `main`, når hele testsamlingen er grøn, så det kommer på GitHub Pages med det samme (https://espenohalloran.github.io/atomlab/). Bagefter startes arbejdsgrenen forfra fra `main`.
- Beslutninger og jeres svar skrives ind her med det samme, ikke kun i chatten.
- Det er kun jer, der bruger AtomLab indtil videre. Prototyper må derfor gerne ligge i den almindelige udgave (24. oktober 2026).
- Tabletten bruges lige meget på langs og på højkant. Lyd: ingen baggrundsmusik, de små lyde bliver.
- **Tests (jeres svar 24. oktober 2026):** Test, når det giver mening i forhold til prisen. I tester selv på den rigtige tablet. Derfor:
  - Mens der arbejdes: kun `node tests/koer-alle.mjs --ændret`. Før merge køres `node tests/koer-alle.mjs --ændret`. Vælger den selv alle tests (fordi fx `index.html`, `style.css`, `main.js` eller `scene3d.js` er ændret), køres alle. Hele samlingen køres kun eksplicit, når en ændring rører fælles moduler eller data, og `--ændret` ser ud til at vælge for lidt, som afslutning på en serie af opgaver og før et større mål (fx at dele AtomLab med andre). Jeres ønske 29. oktober 2026: ikke vente på tests af ting, der næsten sikkert ikke er rørt. `main` er det, jeres søn bruger. Den koster få tokens, når den er grøn (én linje pr. test).
  - Skærmbilleder koster flest tokens. Tag kun billeder af det, der er ændret, og se kun de størrelser, hvor layoutet kan gå galt (fx pc og tablet på højkant).
  - Hvordan det føles med fingre, om det kører glat, og hvordan det ser ud på den rigtige skærm, tester I selv. Skriv i "Ikke afprøvet", hvad I skal kigge efter.
  - Nye tests tjekker logik og tal (fx retninger, pladser og tekster), ikke hvert billede.

**Jeres mål for Solsystemet** (jeres ord): Man skal få oplevelsen af at besøge planeterne, også deres måner. Flybyen ved Saturn er første skridt og skal senere bruges ved alle planeter.

**Mars (besluttet 24. oktober 2026):** Mars bygges som Saturn med Phobos og Deimos og en flyby, der også besøger steder på planeten (Olympus Mons, Tharsis, Valles Marineris, Hellas, nordpolen, Gale og Jezero). Jeres svar: Saturn og flybyen kører helt flydende på tabletten, så vi giver den gas med grafikken. "Det hele skal med. Det skal være så flot og imponerende som muligt": detaljer helt tæt på, "Stå på Mars" og månerne i den rigtige form. Opgaven er delt i otte delopgaver (M1-M8), og I siger go mellem hver. Planen står i [docs/plan-mars.md](../plan-mars.md). I M4 flyttes Mars og Saturn til deres egen skærm, "Solsystemet". Overblikket med Solen og planeterne (trin 2) venter. Mars får et 8k-kort.
- **Tokens bruges med omhu (jeres svar 24. oktober 2026):** Sig det med det samme, når noget koster unødigt mange tokens (fx sider, miljøet ikke kan åbne, eller en hjælpeagent, der må søge mange gange). Ofte kan I let løse det, fx ved at tilføje et domæne under miljøets Network access.
- **Spørg om adgang først (jeres svar 29. oktober 2026):** Skal en opgave bruge et domæne, der ikke står på listen over åbne domæner, så spørg om adgang, *før* arbejdet går i gang, ikke først når siden viser sig at være blokeret. I åbnede library.si.edu og archive.org til citatet til Saturn.
- **Blokeret adgang (jeres svar 24. oktober 2026):** Er en netside eller et værktøj blokeret i miljøet, så sæt udviklingen på pause, og bed jer om adgang (navngiv domænet). Gå ikke videre med en nødløsning uden at spørge først.
- **Værktøjer (jeres svar 24. oktober 2026):** Billedværktøjerne må bruge Python-pakker (fx `rasterio`). Bed altid om værktøjer (eller adgang til netsider), når noget kan gøre arbejdet hurtigere, billigere eller bedre.

**Mars M5 er færdig (30. oktober 2026).** Næste kan være M6 (Phobos og Deimos), M7b (meget skarpe kort ved Gale og Jezero) eller M8 (Stå på Mars). Det venter på jeres valg og go. Planen står i [docs/plan-mars.md](../plan-mars.md).
- ~~**Knappen "Navne"**~~ ✅ Lavet 30. oktober 2026 (se nedenfor).
- **M6 (Phobos og Deimos): Planen er klar og venter på jeres go** ([docs/plan-mars.md](../plan-mars.md) under "Plan for M6", syv beslutninger til jer til sidst, billederne i `docs/m6/`). Formen er afgjort: Phobos' højdekort vender rigtigt, og Deimos' formmodel har vestlig længde (ellers ville Deimos blive spejlvendt). Anbefalingen er to dele: M6a (formen, kortene og banerne) og M6b (flybyen og teksterne). **Jeres svar (30. oktober 2026): "Go herfra. Vi følger dine anbefalinger."** Alle syv anbefalinger gælder. M6a bygges nu, og M6b venter på et go efter M6a (anbefaling 7). **Jeres svar (30. oktober 2026):** JAXA var blokeret. Lav planen nu, og I åbner `*.jaxa.jp`. Samme dag virkede www.mmx.jaxa.jp, global.jaxa.jp og www.jaxa.jp (isas.jaxa.jp svarede 502 fra siden selv).

**Senest lavet (31. oktober 2026): M8b, Stå på Mars ved Jezero.** Detaljerne står i [docs/plan-mars.md](../plan-mars.md) under "Status efter M8b". Jeres besked ved go: U4 bygges samtidig i en anden session, så Stjerneovnen, Reaktoren, pause.js, style.css og index.html er ikke rørt. I vurderer det hele til sidst.
- **To nye steder ved Jezero** (i træet under Jezero og med "🧍 Stå på Mars" ved stoppet):
  - **"Ved randen":** hvor Perseverance holdt i oktober 2024 på vej op ad randen, ca. 500 m over landingsstedet. Man kigger ud over deltaet og hele krateret. Man lander kl. 16:30 med Solen i ryggen, for om morgenen kigger man lige mod Solen.
  - **"Landingsstedet":** Octavia E. Butler Landing. Man kigger mod vest mod deltaets front, ca. 2-3 km væk, kl. 7:30.
- **Kortene:** Mars 2020's landingskort fra USGS (højder med 1 m og foto med 25 cm) og et højdekort over hele krateret (CTX, 20 m). Teknikken og lyset er de samme som ved Gale (L1 uændret).
- **Skarpere kort i kredsløb (resten af M7b):** Mellemlaget fra Stå på Mars (64 × 64 km) ligger nu som detaljekort på kloden ved Gale- og Jezero-stoppet, med ca. 32 m mellem højderne i stedet for ca. 170 m. Ved Jezero dækker det hele krateret og deltaet.
- **Tekster:** sider til begge steder (randen, Cheyava Falls og landingen med himmelkranen og Ingenuity). Faktatjekket med kilderne læst (`docs/fakta-solsystemet.md`, "Faktatjek M8b"). Rettet bl.a.: "et nedslag" i stedet for "en asteroide", og at roveren fandt et sikkert sted ud fra et kort, der var tegnet på forhånd.
- **Tests:** `--ændret` valgte 9 tests (system, kosmos-nye, aarstider, formoerkelser, saturn, mars, landskab, solsystem og jorden), og alle bestod (31. oktober 2026, 12,3 minutter). Nye tjek i `landskab`: Jezero (knappen, træet, begge steder med NASA's højder og retningen) og detaljekortene ved Gale og Jezero. **Risiko:** `mars` tog 591 s af de 600 s, en test må tage (alene 469 s). Første gang fejlede den, mens tunge beregninger kørte ved siden af. Grænsen i `tests/koer-alle.mjs` bør hæves, næste gang en fælles fil alligevel ændres.
- **Kendt fejl i kilden:** Højdekortet over hele krateret er sat sammen af striber. To steder ses det som tynde, lige streger hen over kraterbunden ved Jezero-stoppet. Fire forsøg på at fjerne dem fjernede enten for lidt eller ændrede det rigtige landskab, så kortet er uændret, og teksten siger det. En idé til senere står i plan-mars.md.
- **Ikke lavet:** Hjælpen og "Om AtomLab" i index.html nævner kun Gale (index.html blev ikke rørt, mens U4 blev bygget). U4 er nu merget, så de to sætninger kan rettes i næste session.
- **Størrelse:** Lagene fylder 84 MB i repoet, og første gang, man står ved et af stederne, hentes ca. 48-55 MB på pc og 42-47 MB på tablet (mellemlaget deles af begge steder). Mellemlagets højdekort er 18,8 MB, for en grovere højde kunne give striber i lyset på den flade kraterbund.
- **Ikke afprøvet (på pc og tablet):**
  1. Ved randen: Er udsigten flot nok kl. 16:30, eller vil I hellere have sidelys (fx kl. 10 eller 14)? Det er ét tal (`tid` i `LANDSKAB`).
  2. Ved randen: Kan I se deltaet og randen på den anden side i disen? Østranden er lav og ligger lavere end jer, så den er svag.
  3. Ved landingsstedet: Kan I se deltaets front (50-100 m høj, 2-3 km væk)? Zoom ind med kikkerten.
  4. Hentetid og hastighed på tabletten første gang ved Jezero (ca. 42-47 MB på tablet). I testbrowseren er det lige så hurtigt som ved Gale (0,39 billeder i sekundet mod 0,37-0,49).
  5. Gale- og Jezero-stoppet på flybyen: Ser kraterne skarpere ud, og er der en synlig kant, hvor detaljekortet slutter (overgangen er 6 km bred)? Hvor meget forstyrrer stregerne fra sømmene på Jezeros kraterbund?
  6. Flyvningen ned til Stå på Mars: Passer kloden og landskabet bedre sammen i overgangen nu?
- **Rettet efter M8b (jeres fund 31. oktober 2026: "Når man går fra flyby ned til Mars, kan det være svært at komme tilbage igen", jeres svar: "Ja lav den nu"):** "🧍 Stå på Mars" stoppede ikke flybyen. Mens man stod, viste bjælken stadig flybyens "Næste: Jezero ›", og et tryk flyttede kameraet usynligt, mens man stadig stod ved Gale. Der var ingen knap tilbage. Nu sættes flybyen på pause, og bjælken viser "↑ Tilbage til flybyen" (eller "↑ Op i kredsløb", hvis man ikke kom fra flybyen), også mens kameraet flyver ned. Kameraet letter til kraterets stop, og flybyen fortsætter med "Næste: … ›". Testen `landskab` gennemgår netop det forløb, og `--ændret` (9 tests) bestod. **Ikke afprøvet:** Er knappen let at finde på tabletten, og føles det naturligt at komme tilbage på flybyen?
- **Næste:** M8c del 1 (rovernes panoramaer). Prompten står i [docs/plan-mars.md](../plan-mars.md) under "Prompter til de næste skridt". Venter på jeres go.

**Samtidig (31. oktober 2026, i en anden session): U4, tidsknappen og kontakterne i resten af AtomLab.** Detaljerne og grunden til valget står i [docs/plan-ux.md](../plan-ux.md) under "Status for U4". Jeres svar: "Go", og I vurderer selv til sidst.
- **Tidsknappen** fra Kosmos står nu også nederst til højre i 3D-billedet i Stjerneovnen og Reaktoren. "⏸ Pause" og Stjerneovnens tempoknapper (Langsom, Normal og Hurtig) er væk fra venstre panel.
- **Stjerneovnen har fire knapper: ⏸ · ▷ langsom · ▶ normal · ⏩ hurtig** (0,3, 0,6 og 3 som før). Valget: Langsom blev en tilstand mere på tidsknappen, så alle tre tempoer står ét sted, og mellemrum går tilbage til det tempo, man havde. Batteriet beholder sin "Pause" (ingen strøm).
- **Knapper, der starter noget, lader tiden gå:** et skud og "Vis mig" i Stjerneovnen og "Skyd neutron", "Start reaktoren" og "Vis mig" i Reaktoren. "Vis mig" er stadig i slowmotion.
- **Kontakter ligner kontakter** (fyldt med ✓, når de er tændt): "Elektronsky" i Værkstedet og på grundstofkortet (før skiftede knappen mellem "Elektronsky" og "Ringe"), "Vand (moderator)" i Reaktoren og "Snyd laderen (farligt!)" i Batteriet (rød, når den er tændt).
- **Tests:** Nye tjek står i "Status for U4". Hele samlingen (31. oktober 2026): alle 29 bestod. `mars` fejlede én gang sammen med en anden test ("Modlys slået fra", en fast ventetid på 300 ms) og bestod alene. Tjekket venter nu på Solen i stedet for en fast tid, og `mars` bestod igen (153 OK). Det er ikke vist, at det gamle tjek fejler under kunstig belastning.
- **Ikke afprøvet (på tabletten):**
  1. Forstår I ▷ (langsom) i Stjerneovnen? Den er en tom trekant mellem ⏸ og ▶. Ellers kan den blive til en snegl eller "½".
  2. Er tidsknappens fire små knapper lette at ramme med en finger (de er lige så store som i Kosmos)?
  3. Er det tydeligt, at "Elektronsky" med ✓ betyder, at skyen vises (og uden ✓ ringene)?
  4. Skifter Stjerneovnen og Reaktoren rigtigt, når I trykker mellemrum på pc (pause og tilbage til det tempo, I havde)?
  5. Savner I tempoknapperne i panelet, eller er det fint, at alt om tiden står i billedet?

**Før det (31. oktober 2026): S2, Saturns ringe fra Cassinis måling.** Detaljerne står i [docs/plan-saturn-kvalitet.md](../plan-saturn-kvalitet.md) under "Status efter S2". Jeres svar ved valget af kilde: "Go" (til alle tre forslag).
- **Tætheden i ringene er målt:** Cassini så stjernen β Centauri skinne gennem ringene 28. juli 2008 (UVIS). Ringene har nu 8.192 målte punkter (ca. 9 km pr. punkt) i stedet for de ringe, programmet lavede. Kanterne, Huygens-ringen i Cassini-delingen, B-ringens tætte kerne og de mange tynde ringe i C-ringen er de rigtige.
- **Det, målingen ikke viser:** D-ringen er for tynd og er stadig tegnet. F-ringen er flyttet til sin middelafstand (den er skæv). Farvebilledets falske striber er fjernet, og kun farvetonen er tilbage.
- **Tekster:** Nørd-teksten, "Billederne" og "Ærligt talt" ved Ringene siger, hvor tallene kommer fra. "Optisk dybde" er kommet i Ordbogen. Faktatjekket mod dataene og deres etiket (`docs/fakta-solsystemet.md`, "Faktatjek S2").
- **Testkøreren:** `tests/koer-alle.mjs` gik ned i Node 22.23 (fetch), før den kørte en eneste test. Rettet. Testen `ordbog` stod ikke i dens liste (`ALLE`) og blev aldrig kørt med hele samlingen. Nu er den med.
- **Tests:** Hele samlingen (fordi testkøreren var ændret): alle 28 bestod (23 minutter), og `ordbog` bestod bagefter (35 OK). `guide` fejlede én gang sammen med en anden test ("tlf: måleren i 3D-billedet") og bestod alene. Den rører ikke ringene. Nye tjek i `saturn` (kanterne, B-ringens kerne, Huygens-ringen og F-ringen).
- **Ikke afprøvet (på pc og tablet):**
  1. Ringene forfra: B- og A-ringen er nu næsten ensartet lyse (rigtigt for tætte ringe, men før gav de falske striber mere mønster). Synes I, det er kedeligere? Så kan B-ringens lysstyrke tages fra et Cassini-foto.
  2. Modlys og "Hen over ringene" på flybyen: Ser de mange tynde ringe flotte ud, og flimrer de, når kameraet glider?
  3. Langt væk (hele systemet): Flimrer ringene, når I drejer? Teksturen har mipmaps, men det er ikke set på en rigtig skærm.
  4. Saturns skygge fra ringene på planeten bruger de samme målte tal. Ser skyggen rigtig ud?
- **Næste:** M8b (Jezero), lavet 31. oktober 2026 (se ovenfor).

**Før det (31. oktober 2026): L1, lyset i Stå på Mars (den billige del).** Rækkefølgen og arbejdsgangen for resten af Mars står i [docs/plan-mars.md](../plan-mars.md) under "Plan for resten af Mars" (jeres svar: "Du skal bare lave alt det, du kan fra listen, i din rækkefølge. Go mellem hvert skridt", og I vurderer det hele til sidst). Status, målinger og "Ikke afprøvet" står dér under "Status efter L1".
- **Mere kontrast:** Mindre himmellys i skyggerne (`HIMMELLYS` 0,55 → 0,18), lidt mindre sollys, en himmel, der bliver lysere, jo højere Solen står, og mørkere og mere mættet opad. Disen (`TAU` 0,4) er uændret. Justeret efter tal fra NASA's panorama fra Naukluft (PIA20332), ikke efter jeres øjne.
- **Mens man står:** ingen glød (Solens skær står i himlens shader), og eksponeringen tilpasser sig lyset, så middag ikke er meget lysere end morgen. Sættes tilbage, når man letter. Man lander kl. 07:30 (Solen 22°, lange skygger).
- **Tests:** `--ændret` valgte 9 tests (mars, landskab, solsystem, saturn, jorden, system, kosmos-nye, aarstider og formoerkelser), og alle bestod (31. oktober 2026). Nye tjek i `landskab`: gløden og eksponeringen, mens man står, og efter at man er lettet.
- **Ikke afprøvet:** fem punkter i plan-mars.md under "Status efter L1" (er det for mørkt nu, pumper eksponeringen, er Solen for lille uden glød, forgrunden er stadig flad tæt på, kører det glat).

**Før det (31. oktober 2026): U3, siden i lag i Solsystemet og Kosmos.** Planen, stedernes tal og det, der blev afgjort undervejs, står i [docs/plan-ux.md](../plan-ux.md) under "U3: Stedernes tal" og "Status for U3". Jeres svar ved go: "Go til dine anbefalinger". **Næste:** U4 (tidsknappen og kontakterne i resten af AtomLab) eller M8b/M8c. Det venter på jeres valg og go. Valgfrit: Fable kan lave et eftersyn efter U3 (F4 i [docs/plan-fable.md](../plan-fable.md)).
- **Fanerne "Kort fortalt" og "For nørder" er væk.** Højre panel er én side fra let til dybt: tallene, "Lige nu", Kort (fremme), emnerne som foldebokse med et spørgsmål som overskrift, "Gå videre", For nørder, Billederne og Ærligt talt (altid sidst i sin egen boks) og citatet.
- **Hvert sted har sin egen side** med 2-4 tal (fx Olympus Mons: ca. 22 km høj, ca. 600 km bred, ca. 7 × Danmark). Mars' side handler om Mars som helhed og peger videre til stederne. Det, der handlede om et sted (Olympus Mons, Tharsis, månerne, Stå på Mars …), står nu på stedets side, også stedets egne "Billederne" og "Ærligt talt". Det gælder også Saturn, Jorden og Månen.
- **"Tryk X" er blevet til knapper i teksten:** et sted ("Calderaen ›"), en kontakt (viser, om den er tændt), en handling (grå, når den ikke kan bruges lige nu), tidsknappen og andre dele. Solens fremtid peger nu på "Hvid dværg i Kosmos ›".
- **En kontakt folder sit emne ud:** Slår man fx "Modlys" til, folder emnet om modlys sig ud, og emner, siden selv har foldet ud, folder sig sammen.
- **Faktatjek:** 26 nye tal tjekket mod JPL, NSSDC og Wikipedia. Tigerstriberne på Enceladus er rettet fra 135 til ca. 130 km. Iapetus, Saturns tredjestørste måne, er ikke med i programmet. Det står nu i "Ærligt talt" ved Saturns måner.
- **Ordbogen** peger nu på Olympus Mons og Calderaen ("skjoldvulkan" og "caldera"), hvor ordene står.
- **Tests:** Nye tjek i `kosmos`, `solsystem` (alle steder i træet), `lag`, `ordforklaring`, `mars`, `saturn` og `jorden`. Hele samlingen: alle 28 tests bestod (31. oktober 2026).
- **Ikke afprøvet (på tabletten):**
  1. Er siden let at læse, og er det tydeligt, at overskrifterne med ▸ kan foldes ud?
  2. Er siden for lang på pc, når flere emner er foldet ud?
  3. Folder emnet sig ud, når I slår en kontakt til (fx "Modlys" ved Mars), og kan I se det på tablet på højkant, hvor panelet står under billedet?
  4. Er knapperne i teksten lette at ramme med en finger, og ligner en kontakt i teksten en kontakt?
  5. Mangler I noget fra de gamle tekster? Mars' og Saturns tekster er delt ud på stederne og skrevet om.

**Før det (31. oktober 2026): U2, styringen på billedet i Solsystemet og Kosmos.** Planen og det, der blev afgjort undervejs, står i [docs/plan-ux.md](../plan-ux.md) under "Status for U2".
- **"Prøv selv" er væk.** Alt, der styrer billedet, står nu i billedet:
  - **Bjælken forneden:** trinene med "‹", "Næste: … ›", til sidst "↺ Forfra" og på flybyen ✕, og scenens handlinger (fx "▶ Start flyby", "🧍 Stå på Mars", "💥 Send en solstorm"). Man kan trykke på prikkerne i underteksten og springe til et trin. Bjælken står der også med "Kun grafik".
  - **Styr-boksen øverst til højre:** kontakterne (tændt er fyldt med ✓) og skyderne. Åben på pc og tablet på langs, foldet sammen til "Styr" på tablet på højkant og telefon.
  - **Tidsknappen nederst til højre:** ⏸ ▶ og ved Jorden ⏩. Den afløser Pause, "Drej Mars", "Drej Jorden" og "Jorden drejer". Mellemrum virker som før. Ved et sted på Mars står tiden stille fra start, og når man står på Mars, lader ▶ dagen gå.
- **Flybyen** står øverst i træet ("▶ Flyby · 13 stop"), og man kan gå et stop tilbage.
- **Kameraet flyver også, når tiden står stille** (det gjorde det allerede, men nu slår et tryk i træet ikke pausen fra).
- **Tests:** Knapperne findes nu ud fra teksten. Nye tjek for bjælken, Styr-boksen og tidsknappen. Hele samlingen: alle 28 tests bestod (31. oktober 2026).
- **Ikke afprøvet (på tabletten):**
  1. Er Styr-boksen let at finde på højkant, og dækker den for meget, når den er foldet ud?
  2. Er "Næste" og "‹" i bjælken lette at ramme? Kan I ramme prikkerne i underteksten med fingeren (de er små)?
  3. Forstår I tidsknappen, og at tiden står stille ved et sted på Mars (tryk ▶ for at lade lyset gå rundt)?
  4. Føles det rigtigt, at "🌅 Solnedgang" lader dagen gå videre, så Solen går ned?
  5. Ser kontakterne ud som kontakter (fyldt med ✓, når de er tændt)?

**Stå på Mars: lys og kvalitet (31. oktober 2026, noteret, den billige del er nu lavet i L1).** Fund, muligheder og en aftale om at bede om adgang til jeres pc, når grafikken skal måles, står i [docs/plan-mars.md](../plan-mars.md) under "Stå på Mars: lyset og kvaliteten". Kort: Himlen og jorden er næsten lige lyse, disen er kraftig, og sol og himmellys er skaleret frit, så kontrasten mangler. Venter på jeres prioritering. U3 kører i en anden session.

**Før det (30. oktober 2026): U1, træet i Solsystemet.** Planen står i [docs/plan-ux.md](../plan-ux.md) (status for U1 nederst).
- **Venstre panel er nu navigation:** Kloderne står på én række, og under dem et træ med den valgte klode, dens steder og måner og dens forsøg. Mars har alle 12 steder og måner (Calderaen og Skrænten under Olympus Mons, "Mars set fra Phobos" under Phobos), Saturn har Ringene og alle seks måner, og Jorden har Månen. Før kunne Calderaen, Ringene og udsigten fra Phobos kun nås med flybyen.
- **Fjernet fra "Prøv selv":** "Hele Mars", "Månerne", "Saturn", "Enceladus", "Titan" og Jordens "Månen". Resten (kontakterne, flybyen og Pause) flytter i U2.
- **Højre panel viser stedet:** navnet, teksten om det, man ser ("Lige nu", før den lille boks nederst til venstre, også i Kosmos), og kloden under "Om Mars". Toplinjen viser vejen (› Mars › Olympus Mons).
- **Flybyen markerer stedet i træet**, og et tryk i træet stopper den.
- **Tests:** `solsystem`, `jorden`, `mars` og `saturn` bruger træet og tjekker, at alle steder står der, at et tryk flyver derhen, at panelet og vejen følger med, og at "Mars set fra Phobos" kan nås direkte fra hele Mars (ca. 300 m over Phobos).
- **Flettet med Mars M8a** (fra den anden session): De to steder, man kan stå ved Gale ("🧍 Naukluft" og "🧍 Hos Curiosity"), står i træet under "Gale og Curiosity". "↑ Tilbage i kredsløb" og "Gå til …" er fjernet fra "Prøv selv": Et tryk på Gale i træet letter og flyver op igen, og et tryk på det andet sted hopper derhen. Fra landskabet kan man også trykke på et hvilket som helst andet sted i træet. "🧍 Stå på Mars" bliver under "Prøv selv" ved Gale.
- **Ikke afprøvet (på tabletten):**
  1. Kan I ramme punkterne i træet med fingeren?
  2. Er det tydeligt, hvor I er (den lyse streg og vejen øverst)?
  3. Er træet ved Mars for langt på højkant, så "Prøv selv" kommer for langt ned?
  4. Glider Phobos pænt hen i banen, når I vælger den i træet?
  5. Føles det naturligt, at "Mars set fra Phobos" først flyver til Phobos?

**Før det (30. oktober 2026): Mars M8a, "Stå på Mars" ved Gale.** Planen og jeres svar står i [docs/plan-mars.md](../plan-mars.md) under "Plan for M8" og "Status efter M8a". Jeres svar ved go: "Generelt går vi med dine anbefalinger." Størrelse er ikke et problem, så længe det kører godt, for kvaliteten er det vigtigste. I åbnede `assets.science.nasa.gov`. **Næste: M8b (Jezero) og M8c (rovernes fotos og Curiosity som 3D-model)** havde go. Men UX-planen nedenfor (lavet samme aften i en anden session) anbefaler U1 og U2 før M8, så de nye knapper ikke skal flyttes bagefter. M8a's knapper ligger i det gamle "Prøv selv". **Jeres valg:** M8b og M8c først, eller U1 og U2 først.
- **Sådan:** Ved Gale-stoppet trykker man "🧍 Stå på Mars". Kameraet flyver ned, billedet toner over, og man lander i øjenhøjde ved **Naukluft**, hvor Curiosity tog sit 360°-billede i april 2016. Mount Sharp rejser sig mod sydøst, og mod nord ses kraterranden i disen. "Gå til Curiosity nu" hopper til roverens plads i midten af oktober 2026. Den står i en dal, så toppen af Mount Sharp er skjult.
- **Drej hovedet** med fingeren eller musen (man tager fat i landskabet), knib eller rul for at zoome som med en kikkert, skub "Klokken på Mars", tryk "Lad dagen gå" eller "Solnedgang". Efter solnedgang kommer en blå glød i vest og så stjernerne. Phobos står op i vest og Deimos i øst.
- **Landskabet** er bygget af USGS' kort til Curiosity (højder med 1 m mellem dem og billeder fra HiRISE med 25 cm pr. pixel) i fire lag ud til ca. 150 km. Fotoene er grå, så farverne er sat på af programmet. Småsten helt tæt på er tegnet af programmet. Det står i "Ærligt talt".
- **Fylder:** ca. 45 MB på pc og ca. 36 MB på tablet, første gang man trykker (hentes, mens kameraet flyver ned).
- **Målt i testbrowseren:** stående ca. 56 % af billederne i sekundet ved hele Mars på tablet, som ved Jezero-stoppet. Ingen flimmer.
- **Faktatjekket** af en hjælpeagent med kilderne læst (`docs/fakta-solsystemet.md`, "Faktatjek M8a").
- **Ikke afprøvet (på tabletten):**
  1. Kører det glat, når I står og drejer hovedet, både på langs og på højkant?
  2. Føles det naturligt at dreje (man tager fat i landskabet og trækker det)? Er farten god?
  3. Virker det at knibe for at zoome?
  4. Hvor længe tager det første gang fra "Stå på Mars" til landingen (ca. 36 MB skal hentes)? Hakker det, når billedet toner over?
  5. Kan I se kanter i landskabet, hvor lagene mødes (ca. 1 km og 4 km væk og ude ved 32 km), eller striber i det fjerne?
  6. Ser stenene og gruset tæt ved fødderne pæne ud, eller kunstige?
  7. Farverne, disen og himlen: For blege, for røde, for disede? Solnedgangen og natten?

**Før det (30. oktober 2026): Planen for Mars M8.** Udsigterne fra syv steder er tegnet ud fra højdekortene (`docs/m8/`).

**Før det (30. oktober 2026): Plan for en ny opbygning af Solsystemet og Kosmos (UX).** Planen står i [docs/plan-ux.md](../plan-ux.md).
- **Hvorfor:** Jeres eftersyn: Især "Prøv selv" var for rodet. Panelerne er bygget op efter koden (én fil er ét punkt i listen), så ca. 20 steder og måner ved Mars, Saturn og Jorden står ikke i listen. Man når dem med knapper, der ligner kontakterne. Teksten om stedet står i den lille boks nederst til venstre, mens det store panel gentager planetens tekst.
- **Den nye opbygning, "Alt er et sted":**
  - **Venstre:** et træ med kloderne øverst og under dem Steder, Måner og Forsøg.
  - **Billedet:** en bjælke med turen og "Næste", en Styr-boks med kontakter og skydere og én tidsknap.
  - **Højre:** siden om det sted, man er ved, i lag: Kort, emner, For nørder og Ærligt talt.
- **Jeres svar (30. oktober 2026):**
  - Kontakterne står på billedet.
  - Pause, "Drej Mars" og "Drej Jorden" bliver én tidsknap.
  - Ingen skitse først.
  - Hvilke steder man har set, skal ikke tælles.
  - Frie tøjler: Alle anbefalingerne i planen gælder, også én side med foldebokse i stedet for fanerne og "Ærligt talt" i sin egen boks.
- **Trinene:** U1 (træet og stedets side), U2 (styringen på billedet), U3 (siden i lag med faktatjek af stedernes tal) og U4 (tidsknappen og kontakterne i resten af AtomLab). Hvert trin får et go og sin egen PR.
- **Anbefaling:** U1 og U2 før Mars M8. Ellers kommer M8's nye steder og knapper ind i det gamle "Prøv selv" og skal flyttes bagefter.
- **Model:** Opus bygger det hele med høj effort til U1 og U2. En billigere model ville ikke spare meget og kunne give fejl i den fælles skal (begrundelsen står i planen). Haiku bruges kun til lange testlogs.
- ~~**Lille fejl fundet:** Solens fremtid slutter med "Prøv Hvid dværg i listen", men siden flytningen står Hvid dværg i Kosmos. Rettes i U3.~~ Rettet i U3.

**Før det (30. oktober 2026): Mars M6b, flybyen ud til Phobos og Deimos. M6 er færdig.** **Jeres valg (30. oktober 2026): M8 (Stå på Mars) kommer før M7b.** Prompten til planen står i [docs/plan-mars.md](../plan-mars.md) under "Prompt til M8". Planen laves først, og bygningen venter på jeres go.
- **Flybyen har nu 13 stop:** Efter Nordpolen går turen ud til **Phobos** (Stickney ude ved kanten i lav sol, Mars i baggrunden), **"Mars set fra Phobos"** (kameraet står 300 m over Phobos og kigger op: Mars er 42,5° bred og drejer, og man kan dreje hovedet og kigge ned på Phobos) og **Deimos** (Mars er en kugle på 16,6° ved siden af).
- **Ærligt om billedet ved Phobos:** Stickney i fuld sol og Mars i baggrunden kan ikke ses på samme tid. Stickney ligger på den side, der vender halvt mod Mars, og når Solen lyser Stickney op, er den side af Mars, man ser bag Phobos, i mørke. Valget blev: Solen fra siden og lidt bagfra, så Mars bag Phobos er lyst op, og Stickney ligger ude ved kanten i lav sol. Kameraet kigger lidt ved siden af Phobos mod Mars, så begge kan ses.
- **Jeres fejl (30. oktober 2026):** "Månerne" og et tryk på Phobos viste ingenting. Årsagen var, at Phobos stod i Mars' skygge: Så var både Phobos og den side af Mars, man ser bag den, helt sorte. Nu glider månen frem i banen og ud af skyggen, mens kameraet flyver derhen, og teksten siger det ærligt ("Ud af skyggen"). Testen `mars` tjekker det.
- **Flimmer:** Kameraets near er 0,005 som ved resten af Mars. Systemet er skaleret ca. 59 gange, så det svarer til ca. 85 m. Et billede med 10 gange bedre dybdeopløsning var ens med billedet i programmet (målt). Derfor står kameraet 300 m over Phobos, ikke 2-3 km.
- **Faktatjekket** (to hjælpeagenter, NASA, JAXA, ESA, JPL og Wikipedia læst direkte). Rettet bl.a.:
  - Stickney er ca. 9 km på en måne, der er ca. 26 km lang, ikke "halvdelen af Phobos".
  - Phobos er i Mars' skygge på næsten hver omgang (ikke omkring solhverv), Deimos kun omkring jævndøgn.
  - Hall brugte verdens største *linsekikkert*.
  - Deimos' kratere er kun *delvist* fyldt op.
  - MMX' status er slået op hos JAXA i dag: sonden var sund og på vej mod Mars sidst i oktober 2026.
  - Nye fagord: bundet rotation, regolit og tidevandskraft.
  - Kilderne står i `docs/fakta-solsystemet.md` under "Faktatjek M6b".
- **Billeder i sekundet** (testbrowseren, fuld grafik, én ad gangen): pc: hele Mars 1,1, Phobos 1,1, Mars set fra Phobos 1,0 og Deimos 1,1. Tablet på højkant: 2,3, 1,5, 2,3 og 1,4. Maskinen var langsommere end i tidligere sessioner, så tallene kan kun sammenlignes indbyrdes.
- **Ikke afprøvet (på tabletten):**
  1. Ser I Mars i baggrunden ved Phobos, både på langs og på højkant? (På højkant står Phobos tæt på underteksten.)
  2. Flimrer luften eller skyerne på Mars ved "Mars set fra Phobos", når Mars drejer, eller når I drejer hovedet?
  3. Føles det naturligt at dreje rundt ved "Mars set fra Phobos" (man drejer om et punkt lige foran kameraet), og kan I kigge ned og se Phobos' overflade?
  4. Føles flyvningen rundt om Phobos (til og fra overfladen) for hurtig eller for lav?
  5. "Månerne" → tryk på Phobos, når den står bag Mars: Ser I den glide ud af skyggen?
  6. Er teksterne ved de tre stop for lange?

**Før det (30. oktober 2026): Mars M6a, Phobos og Deimos i den rigtige form.**
- **Månerne kredser om Mars** i den rigtige afstand og i det rigtige forhold til Mars' døgn: Phobos runder Mars ca. 3,2 gange, mens Mars drejer én gang (ca. 32 sekunder i programmet), så den står op i vest. Deimos er ca. 2 minutter om en omgang. Begge vender samme side mod Mars, og de bliver mørke i Mars' skygge.
- **Knappen "Månerne"** viser begge baner med navnene. Et tryk på en måne flyver derhen (også når navnene er slået fra). Langt væk er månerne tegnet større, og det står i "Ærligt talt".
- **Formen:** Phobos af USGS' højdekort fra Mars Express, Deimos af Thomas' formmodel (vendt fra vestlig til østlig længde). Set fra samme side som HiRISE-fotoene passer silhuetterne (overlap 0,92 og 0,93), og ved Phobos sidder kraterparret forneden samme sted (`docs/m6/programmet-mod-fotos.jpg`).
- **Rettet i kilderne:** Phobos' højdekort har kopierede søjler ved 180°, og mosaikken har et hul dér. Det så ud som en streg fra pol til pol og er rettet i billedværktøjet (`lav_maaner.py`).
- **Kilder og licenser** står i `KILDER.md`, `LICENSE` og "Om AtomLab" (Phobos CC BY-SA 3.0 IGO).
- **Billeder i sekundet:** ingen målbar forskel ved hele Mars med og uden månerne (testbrowseren).
- **Ikke afprøvet (på tabletten):** 1) Kan man ramme månerne med fingeren i "Månerne"? 2) Er Phobos og Deimos for lyse eller for mørke ved siden af Mars? 3) Kan I se en kant ved 180° på Phobos (bagsiden, væk fra Mars)? 4) Ved Deimos' nordpol er en lys kam med en mørk skråning under. Ser det mærkeligt ud? 5) Hakker det, når Phobos' kort (ca. 1 MB) hentes, kort efter Mars er åbnet?

**Før det (30. oktober 2026): Knappen "Navne" ved Mars og Saturn (del 1 af opgaven med navneknappen og M6).**
- Under "Prøv selv" ved Mars og Saturn står en til/fra-knap **"Navne"**, slået til fra start. Slået fra forsvinder navnene og prikkerne på Mars (og et tryk på kloden flyver ingen steder hen) og månernes navne ved Saturn (man kan stadig trykke på selve månerne).
- Valget er fælles for alle planeterne og huskes (`atomlabNavne`). Det er en lille fælles hjælper (`js/solsystem/navne.js`), som Phobos og Deimos og de kommende planeter også skal bruge.
- Testene `mars` og `saturn` tjekker, at navnene forsvinder, at et tryk på kloden ikke flyver nogen steder hen, og at valget huskes efter genindlæsning.
- **Ikke afprøvet (på tabletten):** Er knappen let at finde blandt de andre? Ser Mars pænere ud at se dreje uden navne?

**Senest lavet (30. oktober 2026): Mars M5b (Gale, Jezero, Nordpolen og navnene på kloden).**
- **Flybyen har nu 10 stop.** **Gale og Curiosity:** krateret og Mount Sharp set fra nord. **Jezero og Perseverance:** krateret, der engang var en sø, i lav morgensol (ellers kunne det næsten ikke ses). **Nordpolen:** iskappen med spiralkløfterne set fra højt oppe.
- **Navnene på kloden:** Når man ser hele Mars, står Olympus Mons, Tharsis, Valles Marineris, Hellas, Gale, Jezero og Nordpolen på kloden. Et tryk på et navn flyver direkte derhen. Navnene skjules på bagsiden og tæt på.
- **Sommer ved polen:** På vejen til nordpolen drejer programmet Mars' akse til midt på sommeren i nord, så Solen står 22-28° oppe hele døgnet (midnatssol). Det står ærligt i teksten og i "Ærligt talt". Tryk "Drej Mars" ved polen, så går lyset rundt, uden at det bliver nat.
- **Skarpe kort ved Gale og Jezero:** HRSC+MOLA var tydeligt skarpere end MOLA (billederne i chatten). Kortene er lige så skarpe som kilden (ca. 0,17 km pr. pixel), så et detaljekort ville ikke give mere. Roverne og deltaet (kun ca. 40 m højt) kan ikke ses: Det kommer med M7b.
- **Faktatjekket** (to hjælpeagenter, kilderne læst: NASA, USGS, UT Austin, ASU og MSSS). Rovernes status er slået op i dag: Curiosity har kørt ca. 38 km og er 1 km oppe ad Mount Sharp. Perseverance har kørt over 45 km (rekord), er uden for krateret og har fyldt 30 rør. NASA skriver om Mars Sample Return i datid. Rettet bl.a.: Gales alder, Ingenuitys sidste flyvning, de organiske stoffer (ikke afgjort, ny NASA-undersøgelse fra februar 2026), kappens tykkelse og "en fjerdedel af luften" (mest ved sydpolen). Nye fagord: rover, delta og biospor. Kilderne: `docs/fakta-solsystemet.md` under "Faktatjek M5b".
- **Billeder i sekundet** i testbrowseren: De nye stop koster ikke mere end Olympus Mons og Valles Marineris (tal i `docs/plan-mars.md` under "Status efter M5b").
- **Ikke afprøvet (på tabletten):** 1) Kan man ramme navnene på kloden med fingeren, og er de store nok på højkant? 2) Ser man Mount Sharp tydeligt ved Gale, og Jezero-krateret i den lave morgensol? 3) Føles flyvningen til nordpolen og drejningen af aksen naturlig (Mars vipper under flyvningen)? 4) Hakker det, når kortene til Gale og Jezero hentes ved stoppet før? 5) Kan man se kanten af nettene ved Gale og Jezero? 6) Hvor længe er "Start flyby" grå, og er hakket ved Saturn væk (del 1)?

**Før det (30. oktober 2026): Første stop på flybyen hentes på forhånd (del 1 af jeres opgave med M5b).**
- **Saturn:** Hakket, I så, når flybyen startede, havde en klar årsag: "Start flyby" hentede alle seks månekort på én gang (ca. 23 MB på pc), og de blev lagt i grafikkortet midt i den første flyvning. I testbrowseren tog ét billede 4 sekunder. Nu hentes månernes kort, når Saturn åbnes (efter Saturns egne kort), ét ad gangen, og de lægges i grafikkortet med det samme. Bagefter var der ingen overførsler under flybyen.
- **Mars:** Kortene til Olympus Mons (ca. 2,9 MB) hentes, når Mars åbnes, efter Mars' egne kort.
- **Knappen:** Indtil kortene er klar, står der "▶ Start flyby (henter kort …)", og knappen er grå. Kan kortene ikke hentes, eller tager det for lang tid, bliver den aktiv efter 8 sekunder alligevel. "Næste: …"-knapperne er ikke ændret.
- Billederne afkodes nu, før de bruges (`image.decode()`), så overførslen til grafikkortet går ca. 3 gange hurtigere.
- **Domænerne:** www.jsg.utexas.edu, marsed.asu.edu og www.dlr.de virker nu. De var ikke blokeret: Containeren manglede et rodcertifikat, og dlr.de sender ikke sit mellemcertifikat. Løst uden at slå tjekket fra (Mozillas rodliste og mellemcertifikatet fra crt.harica.gr, som I åbnede). Fremgangsmåden står i `docs/erfaringer.md`.
- **Ikke afprøvet:** Hvor længe "Start flyby" er grå på tabletten (Saturn ca. 10 MB, Mars ca. 2,9 MB efter planetens egne kort). Hakker det én gang pr. måne, mens kortene lægges i grafikkortet, kort efter Saturn er åbnet? Er hakket væk, når flybyen starter?

**Før det (30. oktober 2026): Mars M5a (Tharsis, Valles Marineris og Hellas).**
- Flybyen har nu 7 stop. **Tharsis:** de tre vulkaner set langs rækken fra sydvest i morgenlys, med Arsia Mons forrest. **Valles Marineris:** midten af kløfterne fra syd, med et skarpt detaljekort, så man kan zoome ned i kløfterne. **Hellas:** det kæmpe krater fra højt oppe.
- **Flyvningen mellem to steder** går nu langs overfladen og højt op, så man kan se begge steder fra toppen. Før strøg den lavt hen over Mars på 3 sekunder. Lange hop tager op til 10 sekunder.
- Kun nettene ved stedet og det sted, man flyver hen til, tegnes, så billeder i sekundet er de samme som ved Olympus Mons. Kortene hentes ved stoppet før.
- **Faktatjekket** (hjælpeagent, kilderne åbnet med curl: ESA, NASA, USGS, NTRS og Wikipedia) rettede Tharsis' størrelse (ca. 5.000 km), toppenes højde (Pavonis ca. 14 km, de andre ca. 18 km, ikke 20), dybden (op til ca. 10 km) og de yngste lavastrømme (måske kun få millioner år gamle). To nye fagord: nedslagskrater og sprækkedal. Kilderne står i `docs/fakta-solsystemet.md` under "Faktatjek M5a".
- **Fundet:** Koordinaterne til Olympus Mons er fra USGS' ældre kortsæt (ca. 15 km forskel). Ikke rettet (stoppet er valgt ud fra højdekortet).
- **Ikke afprøvet:** Hvordan føles de lange flyvninger på tabletten (for lange eller for høje)? Er der et hak, når kortene hentes? Kan man se kanten af nettene ved Tharsis og Valles Marineris?
- Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M5a".

**Før det (30. oktober 2026): Mars M7a+ (detaljekort ved calderaen og skrænten).**
- **Jeres spørgsmål:** Calderaen og skrænten var "lidt grumsede". Svaret: Det lokale højdekort brugte kun ca. 0,5 km pr. pixel, kilden har 200 m. **Jeres go:** Lav det skarpere først. Jeres idé (almindelige kort under flyvningen, det skarpeste kort ved stoppet) er sådan, det er lavet.
- Et detaljekort i ca. 0,22 km pr. pixel over calderaen og skrænten (ca. 445 × 445 km, 2,2 MB). Det hentes, når flybyen når Olympus Mons, så det er klar ved calderaen. Calderaens bund viser nu rynker og kanter, og skrænten flere kløfter. Helt nede ved jorden er det stadig blødt, for kilden er ikke skarpere (HRSC's egne højdekort på ca. 50 m kan komme i M7b). Farverne er de samme.
- Billeder i sekundet: højst ca. 10 % lavere ved de to stop i testbrowseren (målestøjen er lige så stor). Testen `mars` tjekker detaljekortet.
- Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M7a+".
- **Ikke afprøvet:** Ser I en kant eller et skift i lyset, hvor detaljekortet slutter (ca. 200 km fra calderaen)? Er der et hak, når det hentes ved Olympus Mons? Ses fine skrå striber på vulkanens sider (fejl i HRSC-målingerne)?

**Før det (30. oktober 2026): Mars, M7a (lokale detaljer ved Olympus Mons).**
- **Jeres go (29. oktober 2026):** de tre anbefalinger i planen: HRSC+MOLA, hvis den er tydeligt skarpere, de to nye stop med `/faktatjek` og én PR for hele M7a. Højderne er rigtige som standard (jeres beslutning).
- **Et fint net over Olympus Mons** (ca. 1.000 × 1.000 km, ca. 2 km mellem punkterne på pc og 2,6 km på tablet, før ca. 21 km) med sit eget højdekort (ca. 0,5 km pr. pixel, før ca. 5 km). Kortene hentes først, når flybyen starter (ca. 2,9 MB). Ved kanten glider nettet over i resten af Mars uden synlige sprækker.
- **Højderne er fra HRSC+MOLA** (Mars Express og MOLA, lagt sammen af USGS). I spillets opløsning var den tydeligt skarpere end MOLA alene (billedet i chatten). Den har licensen CC BY-SA 3.0 IGO, som står i `KILDER.md`, `LICENSE` og "Om AtomLab". Et par kasseformede fejl i HRSC+MOLA er erstattet af MOLA.
- **Farverne er ikke skarpere end ca. 1 km:** Den skarpere Viking-mosaik (232 m) har skygger fra Solen malet ind, som ville modsige programmets eget lys. Detaljerne kommer derfor fra højderne. Det er en afvigelse fra planen.
- **Flybyen har fire stop:** hele Mars, Olympus Mons (lavere og tættere på, kl. 7), **Calderaen** (skråt ned i de seks kratere) og **Skrænten** (ved foden mod nordvest, hvor den falder ca. 8 km, i morgenlys med Solen bag skrænten). Man kan zoome ned til 3 km fra stedet (kameraet holdes stadig 2 km over jorden), og helt nede drejer og zoomer det langsommere.
- **Luften tæt på jorden:** Støvet slører nu kun efter den luft, der er mellem stedet og kameraet, så landskabet ikke bliver mælket ud tæt på. Himlen lyser lidt ind i skyggerne. Kloden ser næsten ud som før, men de høje vulkaner er lidt mindre slørede.
- **Faktatjekket** (hjælpeagent med kilderne åbnet: USGS SIM 3470, ESA, NSSDC, Wikipedia og Taylor m.fl. 2020) rettede kraternes alder (ca. 100-400 mio. år), kantens højde (ca. 20-21 km), lufttrykket (ca. 10-15 %) og at kraterne "overlapper hinanden". nature.com og lpi.usra.edu gav 403, så Neukum 2004 og Robbins 2011 er kun læst gennem USGS.
- **Billeder i sekundet i testbrowseren** ved Olympus Mons: pc ca. 2,3 → 1,6 og tablet ca. 3,7 → 2,5 (hele Mars uændret). Det koster at tegne det fine net. Et rigtigt grafikkort klarer det meget lettere, men det skal I prøve.
- **Tests:** Hele samlingen bestod (27 af 27, 15 minutter). Testen `mars` har fået tjek af det lokale kort, de nye stop og højderne.
- Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M7a".

**Citatet til Saturn (opgave 3):** Huygens' sætning om ringen er bekræftet i hans egen bog (*Systema Saturnium*, 1659, McGill-eksemplaret på archive.org). I åbnede library.si.edu og *.archive.org. **Lavet 29. oktober 2026: fire små opgaver med go** (jeres besked): 1) kategorien som link, 2) fotoner i Stjerneovnen (med faktatjek), 3) et citat til Saturn (kun med en sikker kilde, ellers intet) og 4) Ordbogen som egen del (spørg om kort i menuen eller kun fra hjælpen, med en skitse, før der bygges). I den rækkefølge og én PR pr. opgave, som Opus selv merger, når `--ændret` er grøn. Hele samlingen køres én gang til sidst. Testene `batteri` og `beskeder` bestod to runder i træk på den nye `main`.

**Før det (29. oktober 2026): Ordbogen (opgave 4).**
- Menuen har et ottende kort, **Ordbogen** (4 + 4 på pc, jeres valg). Det viser antallet af fagord (49). Værkstedets hjælp har et link under "Ordforklaringer". Adressen er `#ordbog`.
- Alle fagordene står i alfabetisk rækkefølge (dansk sortering, æ, ø og å til sidst) med bogstaver at hoppe til og en søgning. Ord, hvor navnet passer, kommer først, derefter ord, hvor teksten nævner det. Esc tømmer søgningen. Teksterne er de samme som i ordforklaringerne, så intet er skrevet om.
- 29 ord har et link til et sted, hvor de bruges: tre "Hvorfor?"-kort (tunneleffekt, den stærke kernekraft, bindingsenergi), Stjerneovnen, Reaktoren eller Batteriet, eller et fænomen i Kosmos eller Solsystemet. Et link må kun pege på et sted, hvor ordet står i teksten. Fire, der ikke gjorde det, blev fjernet (fx radioaktiv → "Hvorfor er nogle kerner ustabile?"). De andre 20 ord har intet link.
- Skifter man skærm, lukker hjælpen nu af sig selv (før kunne den blive stående over den nye skærm).
- Ny test `ordbog`.

**Før det (29. oktober 2026): Et citat til Saturn (opgave 3).**
- Saturn har nu et citat af Christiaan Huygens fra *Systema Saturnium* (1659): "Den er omgivet af en tynd, flad ring, der ingen steder hænger fast i den og hælder i forhold til Jordens baneplan." Den latinske ordlyd står, når man holder musen over, og kommentaren fortæller om anagrammet fra 1656 og Galilei.
- Ordlyden er læst i bogen selv (archive.org, som I åbnede). Wikipedia staver ét ord forkert, og bogstaverne i anagrammet viser den rigtige stavning. Kilderne står i `docs/fakta-solsystemet.md` til sidst.

**Før det (29. oktober 2026): Fotoner i Stjerneovnen (opgave 2).**
- Nyt fagord **foton** (en lyspartikel) i ordbogen. Trin 2 i "Fra brint til carbon, trin for trin" siger nu, at energien kommer ud som en foton af gammastråling, og at gassen i Solen sluger den og sender nye ud med lidt mindre energi igen og igen, så energien er titusinder af år om at nå overfladen. Hjælpens "Lys og neutrinoer" siger "Fotonerne af gammastråling".
- Faktatjekket (kilderne i `docs/fakta-hvorfor.md` til sidst) rettede to ting: Fotoner flyver kun "altid" med lysets fart i tomt rum, og de bliver til svagere lys undervejs. Der står ikke et præcist tal for tiden, kun "titusinder af år" som de andre steder.

**Før det (29. oktober 2026): Kategorien som link (opgave 1).**
- Kategorien under grundstoffets navn (fx "Overgangsmetal") er nu en knap i Atomværkstedet og på grundstofkortet i Det periodiske system. Et tryk viser et "Hvorfor?"-kort ved ordet med det, kategorien har til fælles, og hvorfor (de eksisterende tekster fra `js/data/kategorier.js`). Esc og et tryk udenfor lukker det, og på telefon på højkant kommer det nedefra.
- Nederst står "Se hele kategorien ›". Det lukker grundstoffet og viser kategorikortet på væggen med forsøget og medlemmerne. Fra værkstedet skifter det først til Det periodiske system.
- Nye tjek i testen `kategorier` (kortet, Esc, linket fra begge steder, ingen rullebjælke i infopanelet, telefon).

**Før det (29. oktober 2026): Mars, M4c (den fælles flyby og rejsen ned til Olympus Mons).**
- **Mars har "▶ Start flyby"** med to stop: hele Mars og Olympus Mons. Kameraet flyver i en bue ned over Mars og ser skråt hen over vulkanen mod horisonten, hvor den tynde luft lyser. Kameraets "op" følger den lodrette retning på stedet, så man drejer rundt om vulkanen med fingeren. Mars står stille, og klokken er 8 om morgenen ved vulkanen (lange skygger og ingen skyer). "Hele Mars" flyver tilbage. "Bjergene 10 gange højere" og "Modlys" virker også ved stedet (i modlys står Solen lige under horisonten foran kameraet).
- **Kameraet kommer aldrig ind under bjergene.** Det holdes mindst 2 km over jorden: under flyvningen (også fra bagsiden af Mars), når man selv drejer og zoomer, og med de høje bjerge.
- **Flybyen er et fælles modul** (`js/solsystem/flyby.js`), som Saturn og Mars bruger. Saturns flyby er den samme som før: Kameraets tal er helt ens ved alle ni stop, og billederne afviger ikke mere end mellem to kørsler før ændringen.
- **Teksten om Olympus Mons** er faktatjekket (Wikipedia, USGS og en artikel fra UCL, alle åbnet med curl). Faktatjekket rettede skråningen (ca. 3°, ikke 5°) og koordinaterne (USGS' navneliste). To nye fagord: skjoldvulkan og caldera.
- **Jeres svar ved go:** Flybyen med to stop (anbefalingen), og jeg valgte formiddag, fordi skyerne om eftermiddagen dækkede vulkanen. I åbnede `discovery.ucl.ac.uk` og `planetarynames.wr.usgs.gov`, og begge virker.
- Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M4c".

**Før det (29. oktober 2026): Testene `batteri` og `beskeder` holder under belastning.**
- **Jeres opgave (29. oktober 2026):** Ret de to tests (del 1, egen PR), og lav derefter Mars M4c (del 2, egen PR, planen skal godkendes først).
- Begge fejlede, når de kørte sammen på en travl maskine. Genskabt med fire travle CPU-løkker ved siden af. `batteri` åbnede "Vis mig"-siden, mens den første side stadig tegnede batteriet, og indlæsningen nåede ikke at blive færdig på 30 sekunder. Nu lukkes den første side først, og testen venter på, at skærmen er klar. I `beskeder` forsvandt pillerne (4,5 sekunder i rigtig tid), før testen nåede at trykke. Nu fryser testen pillernes tid og lader den selv løbe ud (ny testadgang `atomlabTest.beskeder`), og den tjekker også, at den næste pille i køen kommer frem.
- Med rettelsen bestod begge tre runder i træk med samme belastning. Selve spillet er ikke ændret (kun en testadgang i `js/beskeder.js`).

**Før det (26. oktober 2026): Mars, M4b (Solen og Jorden får egne visninger).**
- Et tryk på **Solen** og **Jorden** i listen åbner nu deres egen visning. Solsystemet har 8 fænomener, og menuen viser "x/8 set". Første gang åbner Solsystemet på Solen.
- **Jorden** er en klode med Månen i den rigtige størrelse og afstand (1 enhed = 1.000 km). Den bruger `lavJorden` og `lavMånen`, som de var. Lyset passer med datoen og klokken lige nu: Solens retning, Jordens drejning og Månens plads (og dermed månefasen) regnes ud fra tidspunktet (`js/data/himmel.js`). Danmark er en gul prik. Et ur nederst i 3D-billedet viser tiden i Danmark, om Solen er oppe, og månefasen og afstanden til Månen. "Drej Jorden" lader tiden gå ca. 800 gange hurtigere (mod øst), og "Månen" flyver ud til Månen og tilbage. En tynd linje viser Månens bane.
- **Solen** har den kogende overflade fra Kosmos, tal, et link til Stjerneovnen og knappen "Jorden ved siden af" (Jorden i den rigtige størrelse, 109 gange mindre).
- **Jeres svar ved go:** "Enig i dine anbefalinger": Månen står, hvor den er i dag, Jorden starter drejet efter klokken, og Solen får knappen "Jorden ved siden af".
- **Faktatjekket** (NSSDC og NASA, siderne åbnet med curl, `docs/fakta-solsystemet.md` del 4) rettede fem ting: lyset er 8 min 19 s (ikke 20 s), overfladen "bobler" (det er konvektion, ikke kogning), helium er ca. en fjerdedel af vægten, granulerne er ca. 4 mio. og ca. 1.500 km brede, og skyerne på Jorden er fra nogle få dage. Månens afstand står med yderværdierne (356.000-407.000 km), som erfaringer.md siger.
- **Formlerne** er testet mod Meeus' eksempel (0,1°), formørkelserne i 2026 (nymåne og fuldmåne), solopgang i København og tidsjævningen (ny test `jorden`).
- **Netsider:** earthobservatory.nasa.gov blev afvist af miljøets proxy (hjælpeagenten prøvede). Det er kun brugt til at tjekke, om skyerne er fra én dag, så teksten er skrevet forsigtigt i stedet.

**Før det (26. oktober 2026): Mars, M4a (skærmen Solsystemet).**
- Et nyt kort i menuen, **Solsystemet**, lige før Kosmos. Menuen har nu 4 + 3 kort på pc og tablet på langs (den sidste række i midten), 2 kolonner på tablet på højkant, 1 på telefon på højkant og 4 på telefon på langs.
- Skærmen `#solsystem` har en liste efter afstanden til Solen: Solen (Solstorm, Solens fremtid), Jorden (Årstiderne, Formørkelser), Mars og Saturn. På telefon på højkant står de fire kloder på én række, og underpunkterne kommer i en række under dem. Indtil M4b åbner et tryk på Solen eller Jorden det første underpunkt.
- Kosmos har nu 11 fænomener i samme rækkefølge som før og et link til Solsystemet under listen. "Solens fremtid" i Hvid dværg er et link, og grundstofkortet (carbon og nitrogen) linker til "Solsystemet: Solens fremtid".
- Det, man har set, og det sidst valgte flytter med fra Kosmos, så prikkerne ikke kommer igen.
- Skallen om fænomenerne (listen, panelet, knapperne, underteksterne, pausen og "Kun grafik") er fælles for Kosmos og Solsystemet (`js/faenomenskaerm.js`). Saturn, Mars og de andre virker som før. Kun Saturns første linje er ændret ("Et besøg hos Saturn og dens måner" i stedet for "En prøve på …").
- Ny test `solsystem`. Testene for Saturn, Mars, Årstiderne og Formørkelser åbner nu `#solsystem`.

**Før det (25. oktober 2026): Mars, M3 (atmosfæren og lyset).**
- Mars har nu en tynd, støvet luft i kanten med den rigtige skalahøjde (11 km) og et tusmørke, der lyser svagt rødbrunt ind på natsiden.
- Polkapperne fra Viking-kortet er gjort hvidere.
- Skyer af is kommer over Olympus Mons, Tharsis-vulkanerne, Alba Mons og Elysium Mons om eftermiddagen på Mars, mens den drejer. De kaster en svag skygge.
- Knappen "Modlys" sætter Solen lige bag kanten af Mars, så luften lyser som en bue (langt væk som en ring hele vejen rundt) og er lidt blå tæt ved Solen.
- Teksterne er faktatjekket mod NSSDC, NASA (PIA02049, PIA07997, PIA19400), ESA og Wikipedia (`docs/fakta-solsystemet.md`, del 3, afsnit 11). Der er to nye fagord i ordbogen: tøris og skalahøjde.
- **Jeres svar ved go:** Polkapperne kommer fra kortet (ingen vinterkappe af tøris). Skyerne tegnes af programmet på de rigtige steder og kun om eftermiddagen. Årstiden er nordlig forårsjævndøgn.
- **Faktatjekket ændrede én ting:** Den lange sky ved Arsia Mons kommer i det sydlige forår, så den nævnes kun i nørd-teksten.
- **Netsider:** I åbnede msss.com, agupubs, nature.com og pubs.usgs.gov. pubs.usgs.gov virkede med det samme og msss.com sidst i sessionen (MARCI's vejrrapporter bekræftede skyerne over vulkanerne om eftermiddagen i det nordlige forår, også over Elysium Mons, som derfor kom med). nature.com blev stadig afvist af miljøets proxy, og agupubs (Wiley) svarer selv 403.
- Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M3".

**Før det (24. oktober 2026): Saturn, S1 (skarpere kort).** Tablet og telefon henter nu 4k-kort af Saturn og månerne (før 2k). Pc henter 8k af Enceladus, Tethys, Dione og Rhea. Saturn bliver på 4k, for kildens "8k"-fil er kun 4096 × 2048. Mimas og Titan bliver også på 4k, for deres kilder er ikke skarpere. Månernes kort ligger med én kanal i grafikkortet og fylder en fjerdedel. Enceladus' kort havde en tom række ved sydpolen, og den er skåret væk. Jeres svar ved go: Telefonen må også få 4k, og effort var medium. **Jeres svar bagefter (24. oktober 2026):** Det kører fint på mobil og tablet. Enceladus var overstrålet i fuldt dagslys, så den er dæmpet lidt (kortet ganges med 1,5 i stedet for 1,85 og klippes ikke længere, og lyset er ca. 10 % svagere). Nu ses kraterne og sprækkerne, og den er stadig den lyseste måne. Detaljer i [docs/plan-saturn-kvalitet.md](../plan-saturn-kvalitet.md) under "Status efter S1".

**Før det (24. oktober 2026): Mars, M2 (Mars-kloden).** Mars står i Kosmos mellem Solstorm og Saturn: en klode med de rigtige højder fra MOLA (bjergene er et net, der løftes efter højdekortet) og farverne fra Viking i 8k. Mars drejer mod øst og står stille helt tæt på, og knappen "Bjergene 10 gange højere" viser landskabet tydeligt. Teksterne er faktatjekket mod NSSDC, NASA og ESA (`docs/fakta-solsystemet.md`, del 3 afsnit 10). KTX2 kunne ikke prøves (GitHub er blokeret), så kortene er JPG. Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Status efter M2".

**Før det (24. oktober 2026): Mars, M1.** Planen ([docs/plan-mars.md](../plan-mars.md)) og faktagrundlaget med kilder (`docs/fakta-solsystemet.md`, del 3).

**Før det (24. oktober 2026, Trin 19 nedenfor):**
- **Saturn i Kosmos** (prototypen til Solsystemet) står nu i den almindelige liste efter Solstorm. Der skal ikke længere skrives en særlig adresse. Saturn, ringene og de seks store måner har den rigtige størrelse og afstand, og kameraet flyver mellem dem uden spring. "▶ Start flyby" har ni stop med en kort tekst og "Næste": oversigten, Saturn, hen over ringene, Mimas, Enceladus, Tethys, Dione, Rhea og Titan. Et tryk på en måne besøger den. Alle månerne har Cassinis kort. Teksterne er faktatjekket (`docs/fakta-solsystemet.md` afsnit 4b).
- **Himlen:** Der er ingen farvede tågeskyer i vores eget solsystem (Saturn, Årstiderne, Formørkelser, Solstorm og Solens fremtid). Ved Saturn er Solen en lille, skarp prik. Tågerne er stadig ved atomerne og i fx Big Bang.
- **Ringe eller sky i Det periodiske system:** knappen "Elektronsky" øverst på grundstofkortet. Valget deles med Værkstedet og huskes.
- **"Start forfra"** i Værkstedet, Stjerneovnen, Reaktoren og Batteriet: en knap nederst i opgavelisten. Den kræver to tryk og nulstiller kun den del.
- **Piletasterne** drejer kameraet i hele Kosmos, og Saturn lyser ca. 12 % svagere end før (jeres bemærkninger).
- **Atomet:** B (orbitalernes former) er standard for alle.

**Næste i gang (26. oktober 2026):** **Mars M4** er delt i M4a (skærmen Solsystemet, den fælles skal og flytningen, ✅ lavet), M4b (Solen og Jorden får egne visninger, ✅ lavet) og M4c (den fælles flyby og rejsen ned til overfladen, høj effort). M4c (den fælles flyby og rejsen ned til overfladen, ✅ lavet 29. oktober 2026).
- **Ny rækkefølge (jeres svar 29. oktober 2026):** Olympus Mons var "ikke for imponerende". Det skyldes mest, at Mars' net er groft (ca. 21 km mellem punkterne). Derfor kommer **M7a** (lokale detaljer, prøvet på Olympus Mons) før M5: M7a → M5 → M6 → M7b → M8. Højderne forbliver rigtige som standard. **M7a er lavet (30. oktober 2026), og M7a+ (detaljekortet ved calderaen og skrænten) også. M5 har go (alle syv anbefalinger), M5a er lavet, og M5b er næste. Planen står i `docs/plan-mars.md` under "Plan for M5".** Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Detaljer før flere stop".
- **Jorden og Solen i Solsystemet (jeres svar 26. oktober 2026):** Med i M4. Jorden bliver en klode som Mars (man kan dreje den, og Månen er med), og Årstiderne og Formørkelser ligger under Jorden. Solstorm og Solens fremtid flytter med under "Solen". Jorden bruger de billeder og modeller, vi har nu, og kan gøres flottere senere, når Mars er færdig. Detaljer i [docs/plan-mars.md](../plan-mars.md) under "Jorden i Solsystemet". S2 (ringene fra Cassinis målinger) og S3 (højder på månerne) venter, til Mars er færdig.
- **Mars på tabletten (jeres svar 24. oktober 2026):** kører fint med 8k-kortet og ser super ud. KTX2 er derfor ikke nødvendigt lige nu.
- **GitHub-adgang:** I har åbnet for GitHub under Network access, men github.com gav stadig 403, også i en ny session (tjekket 24. oktober 2026 i S1). Det er ikke brugt i S1. Skal KTX2 (`basisu`) prøves, så tjek miljøets indstilling for Network access igen.

**Venter på et go** (ikke startet, størrelsen står i parentes):
1. **Det sorte hul** er ikke imponerende nok (jeres billede): Den hvide ring ligner ikke bøjet lys, skiven foran hullet ligner et beige låg, og den ene side er ikke lysere end den anden. **Forslag:** Byg det om med rigtig lysbøjning (en shader, der regner lysets baner som i Interstellar), så skivens bagside bøjes op over og ned under skyggen, med en tynd fotonring og Doppler-lys (stor, **Opus med xhigh**: sværeste fysik og matematik på listen).
2. ~~**Ordbogen**, **kategorien som link** og **fotoner i Stjerneovnen**~~ ✅ Lavet 29. oktober 2026.
3. **Orbitalerne i store atomer** (fx jern) er svære at læse, fordi de mange former ligger oven i hinanden og ligner en blomst. **Jeres svar:** behold som nu, men tag det op igen. Forslaget er én underskal ad gangen (fx "4s" og "3d") med en kort tekst, som i fysikbøgerne (mellem).
4. **Molekyler, M1 (Byttebørsen):** Planen og jeres svar ligger klar i [docs/plan-molekyler.md](../plan-molekyler.md) (stor). Faktagrundlaget til M2 laves med xhigh.
5. **Solsystemet, trin 2:** overblikket med Solen og planeterne, hvor de står i dag. Derefter kan planeterne ses på himlen fra Saturn, og der kan komme en knap "Find Jorden" (se [planen](../plan-solsystemet.md) under "Himlen") (stor).
6. **Fotos af grundstofferne** fra Wikimedia Commons med navn og licens (mellem).
7. ~~**Et citat til Saturn**~~ ✅ Lavet 29. oktober 2026 (Huygens).
8. **Tjernobyl og Liv** venter på Fable (se [docs/plan-fable.md](../plan-fable.md)). Kører Opus dem før Fable 5.5, så med xhigh til faktagrundlaget.
9. **Planeterne efter Mars (besluttet 5. november 2026):** Mars slutter med M8c del 1. Så Jupiter → Venus → Merkur → Uranus og Neptun → Pluto → overblikket med en filmisk overgang. De store måner står som små kugler med rigtige kort fra start. Detaljer og jeres svar i [docs/plan-solsystemet.md](../plan-solsystemet.md), afsnit 9. Næste: planen for Jupiter (Opus, høj effort), venter på et go.
10. **Planen efter planeterne (jeres svar 5. november 2026, rækkefølgen er Opus' forslag og kan ændres):** Hver får sin egen plan og sit eget go. Vurderingerne står under "Idéer til senere".
    1. **Ild** sammen med Molekyler ([docs/plan-molekyler.md](../plan-molekyler.md)): forbrænding, kædereaktionen med radikaler og flammefarverne.
    2. **Kvantefysik** med kvantecomputeren som sidste kapitel.
    3. **Antistof** og **Mørkt stof** som fænomener i Kosmos.
    4. **Gåderne:** 5-10 uløste gåder med links ud i programmet (også Planet X). Fable tjekker listen.
    5. **Månerne og "Land på måner"** i Solsystemet (Titan med Huygens, Europa, Enceladus og evt. Månen ved Apollo 11), se plan-solsystemet.md afsnit 9.
    6. **DNA** i delen Liv.
    - Hjernen og AI venter (jeres svar). Nye dele kræver en beslutning om menuen (i dag 8 kort).

**Åbne spørgsmål til jer:**
- **Domæner (25. oktober 2026):** Listen over de domæner, der skal tilføjes under Network access, står i [docs/plan-mars.md](../plan-mars.md) under "Domæner, der skal på listen". Tjek dem med `curl`, når I har tilføjet dem.
- **Atomet B:** I har ikke set det på tabletten endnu. Sig til, hvis det skal ændres.
- **Faktatjek, der mangler:** Hjælpeagenterne kunne ikke åbne kildesiderne (kun søgeresultater). Det, der skal tjekkes mod kilderne, står i `docs/fakta-grundstofkort.md`, `docs/fakta-molekyler.md` og `docs/fakta-solsystemet.md` (især del 2 om Voyager og afsnit 4b om flybyen).

**Ikke afprøvet endnu:**
- **Olympus Mons (M7a) på tabletten:** Kører det glat ved Olympus Mons, calderaen og skrænten (det fine net koster mest dér)? Er der et hak, når kortene hentes ved flybyens start? Kan I se en kant eller flimmer, hvor det fine net går over i resten af Mars (ca. 500 km fra toppen)? Hvordan føles det at zoome helt ned til et par km over jorden? Er den støvede himmel ved skrænten for brun eller for lys? Hakker det, er første skridt et grovere net på tabletten (256 × 256).
- **Ordbogen på tabletten:** Er bogstaverne og linkene lette at ramme? Ruller listen glat med fingeren? Ser menuen med 8 kort godt ud på langs og på højkant? Kommer tastaturet op, når man trykker i søgefeltet, og dækker det listen?
- **Kategorien som link på tabletten:** Er ordet let at ramme med fingeren, og ser man, at det kan trykkes på (en tynd streg under)? Står kortet godt ved ordet på tablet på langs og på højkant?
- **Olympus Mons (M4c) på tabletten:** Hvordan føles det at dreje rundt om vulkanen med fingeren og zoome ind (drejningen er lidt langsommere ved stedet)? Kører flyvningen ned glat? Et lille hak, første gang Mars åbnes, mens højdetabellen bliver lavet? Ser vulkanen for flad ud med de rigtige højder, og er udsigten mod horisonten flot?
- **Jorden og Solen (M4b) på tabletten:** Passer dag og nat med det, I ser udenfor? Kan man finde Danmark-prikken og Månen? Er uret nederst i vejen på tablet på højkant? Kan man se den lille Jord ved "Jorden ved siden af" (zoom ind)? I testbrowseren er den kun et par pixel.
- **Solsystemet (M4a) på tabletten:** Er listen let at bruge med fingre på langs og på højkant? Ser menuen med 7 kort godt ud? På telefon på langs fylder underpunkterne en linje hver.
- **Mars M3 på tabletten:** Kører det stadig flydende med luften og skyerne? Er skyerne for tydelige eller for svage, og ser "Modlys" godt ud tæt på og langt væk? Er tusmørket for kraftigt?
- **Saturns måner (S1):** Den dæmpede Enceladus og 8k på pc er ikke set på en rigtig skærm endnu. 4k kører fint på mobil og tablet (jeres svar).
- **Mars:** Hvordan føles det at zoome helt ind og dreje tæt på overfladen, og drejer Mars for hurtigt (en omgang på ca. 1¾ minut)? (Den kører fint på tabletten med 8k.)
- Saturn på tablet på højkant: Ved Titan står Saturn bag panelerne, men man kan selv dreje. (Saturn og flybyen kører helt flydende på jeres tablet, og I synes, flybyen er super flot, 24. oktober 2026.)
- Stoppet over ringene: De mange tynde ringe er lavet af programmet og ser lidt "børstede" ud helt tæt på.
- NASA-billederne på en telefon. De er set på jeres tablet.
- Lyden og hvordan det føles med fingre.
- Det nye sorte hul (fra 23. oktober) på en rigtig tablet.

**Tidligere (23. oktober 2026):** De ni punkter efter F1-overblikket ([docs/fable/F1-overblik.md](../fable/F1-overblik.md)) er lavet. Se Trin 18 nedenfor og listen herunder. Noterne fra afprøvningen med jeres søn ligger i `docs/fable/soen-og-espens-noter.md`, og 14 skærmbilleder fra en rigtig tablet i `docs/fable/tablet/`. Jeres svar dengang, som stadig gælder:
- **Fotos af grundstofferne:** Ja, men efter teksterne i lag (punkt 7 er lavet). Fra Wikimedia Commons med navn og licens.
- **"Er det farligt?":** Kortet kommer der, hvor spørgsmålet opstår, med et dybere lag om, hvad strålingen gør ved cellerne og DNA, og hvor meget der skal til (lavet som "Hvorfor?"-kort).
- **Solsystemet:** Spørgsmål 1-5 i planen følger planens forslag, indtil I siger andet.

**Punkterne fra 23. oktober 2026 (alle lavet):**
1. ✅ **Hurtige rettelser:** Det sorte hul er sort (en større skygge uden glød), og "For nørder" står øverst igen i Kosmos på højkant.
2. ✅ **En kort UI-plan for lagene:** [docs/plan-lag.md](../plan-lag.md), godkendt med jeres svar (kortet åbner ved knappen, opgaverne foldes sammen, citaterne bliver, og underteksten er kort med "Hvorfor?").
3. ✅ **Vis eller skjul panelerne** og "Kun grafik".
4. ✅ **"Hvorfor?"-kort** (20 kort, faktatjekket).
5. ✅ **Et grafisk løft af atomet:** B (orbitalernes former) er standard fra 24. oktober 2026.
6. ✅ **Batteriet:** grafik, start og navnet "lithium-ion-batteri".
7. ✅ **Grundstofkortet i lag** og **fremgang i menuen**.
8. ✅ **Copyright** i README, hjælpen og `LICENSE`.
9. ✅ **De store dele:** plan og faktagrundlag til Molekyler, trin 0 i Solsystemet og prototypen med Saturn (siden 24. oktober med alle seks måner og flyby).

