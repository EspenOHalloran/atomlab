# Erfaringer: det, der virker, og det, der ikke virker

Denne fil skal gøre os mere præcise og hurtigere. Den har tre dele:
1. **Tjeklister**, som bruges, mens man arbejder.
2. **Rodårsager:** hvorfor fejlene opstod.
3. **Konkrete erfaringer:** det, der virker, og faldgruberne.

Når noget går galt eller virker særlig godt, skrives det ind med det samme: kort, konkret og med det, vi gjorde ved det. Får en fejl en ny rodårsag, skal den også ind i en tjekliste.

---

## 1. Tjeklister

### A. Før et stykke arbejde er færdigt (commit og push)
- [ ] Hele testsamlingen er kørt (`node tests/koer-alle.mjs`) og bestået. En fejl er undersøgt, før den kaldes "ustabil".
- [ ] Nye funktioner har fået nye tjek i en test.
- [ ] Ved ændringer i layout eller kamera: skærmbilleder på pc, tablet og telefon (`node tests/vaerktoejer/skaermbilleder.mjs <skærm>`), og de er set igennem.
- [ ] Egen ændring er læst kritisk igennem: ubrugt kode, ting der sker to gange, lyde, timere.
- [ ] Er et tal eller en tekst ændret, så søg efter alle andre steder, hvor det samme står (`grep`). Det samme tal må ikke stå forskelligt to steder.
- [ ] CLAUDE.md, DESIGN.md og denne fil er opdateret.

### B. Ny eller ændret tekst med fakta
- [ ] Hvert tal er regnet efter eller slået op. Udregningen står i en kommentar eller i commit-beskeden.
- [ ] Kilden er primær eller pålidelig (fagbøger, NIST, IUPAC, NUBASE, NASA, forskningsartikler). Populærvidenskab og "alle siger det" er ikke nok. Se fælderne i afsnit 2.
- [ ] Citater: præcis ordlyd fra den oprindelige kilde (bog, afsnit, år). Er ordlyden usikker, så skriv det, eller lad citatet være.
- [ ] Er det spillets eget tal (fx 80 mio. °C eller 6-16 spaltninger), så skriv "i spillet" og det rigtige tal ved siden af.
- [ ] Brug "ca.", "typisk" eller "de fleste", når virkeligheden har undtagelser.
- [ ] Tekster, der sættes sammen af data (fx "opdaget 1868 af …"), er læst i den færdige form for alle tilfælde (lav et lille script, der skriver dem alle ud).
- [ ] Fagord forklares med få ord første gang, de bruges i en tekst (fx "en neutrino (en næsten usynlig partikel)", "en alfapartikel (en heliumkerne)"). Læs teksten, som om du ikke kan fysik.
- [ ] Står der et tal fra spillet (fx "6-16"), så sig også, hvad det tæller ("spaltninger i sekundet i det grønne felt").
- [ ] Nye fagord kommer i ordbogen (`js/data/ordbog.js`), så de kan trykkes på. Forklaringen er højst 260 tegn.
- [ ] Undertekster (trin og faser): Pointen står i første sætning, og teksten er under ca. 160 tegn. På tablet og telefon ses kun to linjer, og man trykker sjældent på "Mere". Detaljer hører til i panelet eller "For nørder".

### C. Ny regel, beregning eller spillogik
- [ ] Reglen er testet mod en tabel med kendte tilfælde, også de "kedelige" og grænsetilfældene, ikke kun et enkelt eksempel (fx alle kendte isotoper, ikke kun uran-238-kæden).
- [ ] Alle kombinationer af valg er gennemtænkt (fx 2 kerner × 2 neutronfarter). Ingen `if`-kæde må falde igennem til en forkert standard.
- [ ] Tilfældighed: målt med mange forsøg (fx 60). En sjælden fejl er stadig en fejl.
- [ ] Ting, som brugeren kan ændre undervejs (fx neutronens fart), gemmes, når handlingen starter.
- [ ] Ændres et tempo eller en hastighed: find alt med en flyvetid, en tidsgrænse eller en "Vis mig", og tjek det igen.
- [ ] "Vis mig" og andre automatiske handlinger vælger kun ting, som brugeren ikke allerede er i gang med (fx en kerne, der flyver).
- [ ] Et guidetrin, der venter på noget, kan ikke gå i stå: Tjek, hvad der sker, hvis det, ringen peger på, forsvinder (et tryk ved siden af, en kerne, der smelter sammen af sig selv).

### D. Ny del (skærm), eller ændring i start og stop
- [ ] Stop-funktionen rydder **alt**: timere, kameraets mål, kamerabegrænsninger, pause, guide, beskeder og cursor.
- [ ] Alle `setTimeout` tjekker `aktiv` eller bliver ryddet i stop.
- [ ] Opgavelister og tal bygges, når delen startes, så de passer efter "Start forfra" og nulstilling.
- [ ] Paneler opdateres højst 4 gange i sekundet og kun, når noget har ændret sig, ikke hvert billede.
- [ ] Brug de fælles byggeklodser (beskeder, guide, pause, "Næste skridt") i stedet for at kopiere.
- [ ] En CSS-regel, der skal vinde over en regel med et id (fx `#fusion .vindue { grid-area: vindue }`), skal selv have et id, fx `:is(#fusion, #reaktor).skjul-venstre > .vindue`. Ellers sker der ingenting (panelerne i oktober 2026).
- [ ] `document.querySelectorAll` er afgrænset til delen (`#reaktor .del-knap`) eller bruger en data-attribut, som kun findes der. En klasse kan bruges på flere skærme. Det samme gælder CSS-regler, også dem i `@media` (fx `order`).
- [ ] Værdier, der styrer tilstanden (fx `tilstand = 'kerne' | 'kæde'`), tjekkes, så en ukendt værdi ikke giver en tom skærm.
- [ ] Kameraets fælles indstillinger nulstilles af `nulstilStyring()` i main.js. En del, der ændrer andre indstillinger, skal også nulstille dem der.

### E. Ny animation, effekt eller fælles funktion
- [ ] "Reducer bevægelse" (`ROLIG`) er respekteret: kamerature, lysglimt og blød rulning.
- [ ] Pause: alt bevægeligt bruger `dt` og `tid`, som det får, og ikke `performance.now()`. Søg efter `performance.now`, når noget skal kunne sættes på pause.
- [ ] Grafik, der laves under brug (geometri, materiale, tekstur), bliver frigivet eller genbrugt.
- [ ] Ingen nye `Vector3`, `Color` eller `Quaternion` i løkker, der kører hvert billede.
- [ ] Klikbare ting er knapper (`<button>`), så de kan bruges med tastatur.
- [ ] Grafik med en fast størrelse (fx `InstancedMesh` med plads til et bestemt antal) kan ikke løbe over, heller ikke et kort øjeblik, når nogle kugler er på vej ud og andre på vej ind.
- [ ] Kan det samme vises på to måder (fx klik og musen over et ord), så skal hver af dem stoppe den andens timer.
- [ ] Tekst, der skrives med `innerHTML`, skrives kun om, når den ændrer sig. Ellers forsvinder ordforklaringerne (og fokus) hver gang.
- [ ] Bevægelser i rummet går den rigtige vej: Planeter og måner kredser mod uret set fra nord, og Jorden drejer samme vej. Tjek det med et tal i testen, for det kan ikke ses på et stillbillede.
- [ ] Synlighed og andet, der følger en tilstand, sættes, når tilstanden skifter, og ikke kun i opdateringen hvert billede. Ellers er det forkert, indtil første billede er tegnet.
- [ ] Billeder fra andre (fx NASA) står i `billeder/solsystem/KILDER.md` med kilde og licens, kilden nævnes i spillet, og kun filer, der findes, bliver hentet (ellers giver det konsolfejl). Kloder ses i `tests/vaerktoejer/kloder.html` i dagslys, i lav sol, om natten og i modlys.
- [ ] Shadere, der regner med en radius, en højde eller en punktstørrelse, virker også, når gruppen er skaleret (gang med `getWorldScale()`). Kameraets faste stop (fx på en flyby) er set på pc, tablet og telefon, både på langs og på højkant.
- [ ] 3D-billedet er set fra flere vinkler og helt tæt på. Gennemsigtige hjælpeflader (fx et baneplan) og kegler kan skære streger eller takker hen over kugler, og en kegle kan vende forkert. Ting, der ikke ændrer sig, bygges én gang og ikke i hvert billede.

### F. Tests
- [ ] En kort tilstand (fx "ion i 1,6 sekunder") holdes der øje med hele tiden (`waitForFunction` med `polling`), i stedet for at kigge én gang.
- [ ] Tjek noget, der altid gælder (fx antal kernepartikler), i stedet for et præcist antal, når der er tilfældighed.
- [ ] Tilstanden nulstilles mellem forsøg, og mål vælges i et frit område (ikke under paneler).
- [ ] Tekst søges uden forskel på store og små bogstaver.
- [ ] En test af en rettet fejl skal først fejle uden rettelsen. Ellers ved vi ikke, om den tester noget.
- [ ] Fejl, der kun sker ved mange billeder i sekundet (fx mange kugler på kort tid), testes ved at spole frem i små skridt (fx `atomlabTest.vaerksted.spol`). Testbrowseren tegner kun 3-6 billeder i sekundet.
- [ ] Skærmbilleder tages først, når kameraet er færdigt med at zoome. Ellers ser layoutet forkert ud (`skaermbilleder.mjs` venter 7 sekunder).
- [ ] Ved ændringer i tegningen (renderer, efterbehandling): mål billeder i sekundet før og efter.
- [ ] Brug `node tests/koer-alle.mjs --ændret`, mens du arbejder, og hele samlingen før push. Vent på en tilstand (`waitForFunction`) eller spol frem i stedet for at vente en fast tid.
- [ ] Forløb, der styres af uret (fx rejsen ind i Solen), fryses i testen på faste tidspunkter. Tryk på noget, der bevæger sig, prøves igen, hvis det ikke ramte.

---

## 2. Rodårsager: hvorfor fejlene opstod
Fra den store gennemgang i oktober 2026 (se [gennemgang-2026-10.md](gennemgang-2026-10.md)). Fejlene falder i få grupper. Hver gruppe har fået en regel i tjeklisterne ovenfor.

| Rodårsag | Eksempler | Regel |
|---|---|---|
| **Fakta skrevet efter hukommelsen eller populærvidenskab** | Supernovaen "lyser mere end en galakse". Tjernobyl "kølingen svigtede". Supernovaens lag i forkert rækkefølge. Astronaut som spaghetti ved Mælkevejens store hul. "Meteoren" i stedet for asteroiden. Zirkonia som "kunstige diamanter". | B: regn efter, primær kilde, kend fælderne. |
| **Citater fra en kendt, men ændret udgave** | Sagan ("universe" i stedet for "cosmos"), Einstein ("existing" i stedet for "existence"), Faraday "fandt på" ord, som Whewell foreslog. | B: oprindelig kilde, ellers forbehold. |
| **En regel, der kun er tjekket på ét eksempel** | Henfaldsreglen var tjekket på uran-238-kæden, men vælger forkert retning for fx cobalt-58 og alfa i stedet for beta for thorium-231. | C: test mod en tabel med kendte tilfælde. |
| **`if`-kæde, der falder igennem** | Reaktoren: Uran-238 + hurtig neutron endte i 10 % af tilfældene i spaltningen af uran-235. | C: alle kombinationer gennemtænkt og testet. |
| **Samme fakta flere steder, der ikke passer sammen** | 7,27 og 7,37 MeV for carbon. 80 og 100 mio. °C. "10 gange" og "7 gange". | A: søg efter alle steder ved ændringer. |
| **Spillets tal præsenteret som virkelighed** | "Det kræver mindst 80 mio. °C" (spillets grænse, ikke stjernernes). | B: skriv "i spillet". |
| **Tekst sat sammen af data uden at blive læst** | "1868 af Fundet i Solens lys …", "af Danskeren …". | B: skriv alle sammensatte tekster ud, og læs dem. |
| **Hver del rydder kun sit eget op** | Kameraets mål efter Det periodiske system. Timere, der virker på den næste skærm. Opgavelister, der ikke opdateres efter "Start forfra". | D: én fælles nulstilling og ryddede timere. |
| **En ny fælles funktion, der ikke er tjekket alle steder** | Pausen: Stjernernes overflade koger videre, fordi den bruger `performance.now()`. "Reducer bevægelse" virker kun delvist. | E: søg efter alle steder, der skal følge med. |
| **Arbejde hvert billede, som ikke behøves** | Reaktorens panel skrives hvert billede, også når reaktoren er slukket. | D: højst 4 gange i sekundet, og kun ved ændring. |
| **Tests, der kigger på det forkerte tidspunkt eller forventer et præcist tilfældigt tal** | `henfald` (ion i 1,6 sekunder), `stjerneovn` (præcis 40 protoner). | F. |
| **En CSS-klasse, der bruges på flere skærme** | Reaktoren lyttede på alle `.del-knap`, også Kosmos' "Kort fortalt" og "For nørder". Et klik der gjorde Reaktoren tom (ingen del valgt), og "Vis en kædereaktion" viste ingenting. Fundet af brugeren. Igen i F1: `.del-vælger { order: 3 }` (højst 820 px, `style.css:1081`) er ment for Reaktorens toplinje, men flyttede Kosmos' "For nørder" ned under citatet. Rettet til `#reaktor .del-vælger`, og testen `kosmos` tjekker det på højkant. | D: afgræns vælgere og CSS-regler, og tjek tilstandens værdi. |
| **Skærmbilleder taget, før kameraet var færdigt** | To forkerte fund i gennemgangen: Batteriets etiketter "skåret af" på tablet og væggen i Det periodiske system "kun 40 % af bredden". Begge var billeder midt i zoomet. | F: vent på kameraet. |
| **Fagord uden forklaring** | "Neutrino" i supernovaen, "alfapartikel" ved henfald, "6-16" i Reaktoren. Fundet af brugeren. | B: forklar første gang. |
| **Grafik med fast plads, der løber over et øjeblik** | "Ryd" og straks uran: op til 179 protoner, men plads til 158. Sker kun ved mange billeder i sekundet, så testbrowseren så det ikke. | E og F: loft over antallet, test med små tidsskridt. |
| **To veje til den samme ting, der ikke kender hinanden** | Ordforklaringer: To hurtige klik på et ord lukkede forklaringen, men musens timer (0,3 sekunder) viste den igen bagefter. | E: hver vej stopper den andens timer. |
| **En ændring af tempo eller tid, der rammer tidsgrænser andre steder** | Stjerneovnens nye tempo fik egne skud til at flyve længere, så "Vis mig" kunne vælge et skud, der stadig fløj. | C: søg efter alt, der har en flyvetid eller tidsgrænse, når tempoet ændres. |
| **En indstilling, der ikke virker** | Kantudglatning (`antialias`) på lærredet virker ikke, når gløden tegner billedet. Den kostede bare hukommelse. | F: mål før og efter. |

### Kendte fælder i fakta (populære påstande, der er forkerte eller for skarpe)
- "En supernova lyser mere end en hel galakse." Det passer kun nogenlunde for type Ia. En kollaps-supernova lyser som ca. 0,2-1 milliard sole, og galaksen er 40-100 gange stærkere.
- "Tjernobyl skyldtes, at kølingen svigtede." Reaktoren løb løbsk under et forsøg. Fukushima var kølesvigt.
- "Stjernens lag: C, O, Ne, Si." Brændingen sker i rækkefølgen C, Ne, O, Si, så udefra og ind er det H, He, C, Ne, O, Si, Fe.
- "Man bliver til spaghetti ved et sort hul." Kun ved små sorte huller. Ved de kæmpe sorte huller mærker man næsten intet ved horisonten.
- "Meteoren, der udryddede dinosaurerne." Det var en asteroide. En meteor er lysstriben.
- "Halveringstiden er den tid, det tager for en kerne at henfalde." Det er den tid, hvor halvdelen af mange kerner er henfaldet.
- "Beta-plus = en positron skydes ud." Ofte fanger kernen i stedet en elektron.
- "Første gang set …" Tjek, om det var "første gang set tydeligt" eller "første direkte måling".
- Citater, der citeres i mange udgaver (Sagan, Einstein), har ofte en ændret ordlyd.
- "Nøgne kerner" og "ioner": et frit atom kan højst holde på én ekstra elektron (O²⁻ findes kun i krystaller).
- "Natrium giver sin elektron til chlor, fordi begge vil have en fuld skal." For to frie atomer koster det energi: Det kræver ca. 5,1 eV at tage elektronen fra natrium, og chlor giver kun ca. 3,6 eV tilbage. Gevinsten kommer, når Na⁺ og Cl⁻ trækker i hinanden (i saltkrystallen eller som et par).
- Supertunge grundstoffer: Halveringstiden spænder fra under et millisekund (Og) til over et døgn (Db-268). Skriv ikke "henfalder med det samme" om dem alle.
- "Zirkonia er kunstige diamanter." Det er en efterligning af diamant, ikke diamant.
- "Antistof har den modsatte ladning." Også partikler uden ladning (neutronen, neutrinoen) har en antitvilling.
- "Protoner og neutroner blev dannet efter en milliontedel af et sekund." Nærmere 10-20 milliontedele (en hundredtusindedel).
- "Big Bang lavede kun hydrogen og helium" og "alle tungere grundstoffer kommer fra stjerner". Der kom også lidt lithium, og meget guld kommer fra neutronstjerner, der støder sammen.
- "Penzias og Wilson troede, at støjen kom fra duer." Duerne (og deres klatter) var én af flere mistanker.
- "Solen bliver en rød kæmpe om 5 milliarder år." Den begynder om ca. 5 og er størst om ca. 7,6 milliarder år. Helium tænder først, når den er størst.
- "Røde dværge lever i billioner af år." Kun de mindste. En på en halv solmasse lever "kun" ca. 100 milliarder år.
- "Type Ia-supernovaer lyser præcis lige stærkt." De varierer 2-3 gange og bliver først et standardlys efter en rettelse (de stærkeste falder langsomst).
- "Grænsen på 1,4 sole gælder også jernkernen." Det er samme slags grænse, men jernkernen falder sammen ved ca. 1,2-2 sole.
- "Årstiderne skyldes afstanden til Solen." Nej: Jorden er tættest på Solen omkring 3. januar. Det er aksens hældning, der giver årstiderne.
- "I Grønland er der midnatssol og mørketid." Kun nord for polarcirklen (fx Ilulissat). Sydgrønland (Nuuk) har ingen af delene. Og lige ved polarcirklen kan man skimte Solen ved vintersolhverv, fordi luften bøjer lyset.
- "Jorden drejer 365 gange om sig selv på et år." Der er ca. 365 døgn, men set mod stjernerne drejer Jorden ca. 366 gange.
- "Brænder" om stjerner: Astronomer siger det, men det er fusion, ikke ild. Forklar det, eller skriv "smelter sammen".
- "Ved en ringformørkelse er Månen for lille." Den *ser* for lille ud, fordi den er længere væk.
- "Månens afstand svinger mellem 363.000 og 406.000 km." Det er gennemsnittet for, hvornår den er tættest på og længst væk. Yderværdierne er ca. 356.400 og 406.700 km.
- "Månen i Jordens kerneskygge = total måneformørkelse." Kun når *hele* Månen er inde i kerneskyggen.
- "Den yderste skal har højst 8 elektroner." Næsten altid, men palladium har skallerne 2, 8, 18, 18. Og grænsen skyldes rækkefølgen af energierne (den næste skal begynder at fylde), ikke Pauli-princippet.
- "Jordens ydre kerne koger." Det flydende metal strømmer rundt (konvektion) som suppe i en gryde, drevet af varme og af lette stoffer fra den faste indre kerne. Det koger ikke.
- "Den dødelige stråledosis er 4-5 Sv." Kilderne siger ca. 3,5-4,5 Gy for halvdelen uden behandling. Skriv "omkring 4 Sv", og at behandling hjælper. En CT-skanning er ca. 2-10 mSv (hovedet ca. 1-2), ikke 5-10.
- "En bombe bruger rent uran-235." Typisk ca. 90 %. Brændslet i et kraftværk har typisk 3-5 %.

---

## 3. Konkrete erfaringer

### Arbejdsmåde, der virker
- **Mål i stedet for at gætte.** Når et tal på skærmen beskriver spillets egen simulering, så mål det i simuleringen. Eksempler: kontrolstavene i Reaktoren (stabil ved ca. 50 %), frastødningens "bakke" i Stjerneovnens graf og hvor tit man rammer en kerne med musen (målt med 40 forsøg).
- **Regn fakta efter, og skriv udregningen ned.** Fx "1 gram brint → helium svarer til over 20 ton kul" (0,7 % af mc² ≈ 6,4·10¹¹ J, kul 24-30 MJ/kg). Vis spændet, når kilderne er uenige, og vælg en forsigtig formulering ("over 20 ton").
- **Faktatjek med flere agenter på hver sit område** (oktober 2026) fandt ca. 15 klare fejl og mange upræcise formuleringer i ca. 850 påstande.
  - Agenterne må kun læse.
  - Deres vigtigste fund tjekkes efter i koden eller mod kilder, før de bliver rettet.
  - En regel tjekkes ved at køre selve funktionen over kendte tilfælde.
  - Gentag faktatjekket efter hver større ny del.
- **En kodegennemgang med en agent** fandt fejl, som testene ikke fanger: oprydning ved skærmskift, timere, arbejde hvert billede og tilgængelighed. Gentag også den efter større ændringer.
- **Testadgangen (`?test`)** gør det muligt at spole frem, fryse tiden og læse tilstanden direkte. Brug den i stedet for at vente på animationer.
- **Udregninger inde i siden:** Statistik (fx ramme-procent) laves i én `page.evaluate`, så tiden ikke går imens.
- **Frys tiden til skærmbilleder** (fx `atomlabTest.fusion.rejseTid(t)`). Testbrowseren tegner kun 3-4 billeder i sekundet, og et skærmbillede tager ca. et sekund.
- **Skærmbilleder i alle størrelser** samlet i ét billede pr. skærm (pc, tablet på højkant, telefon begge veje) gør det hurtigt at se forskelle og ting, der overlapper.
- **Højst to tests ad gangen.** Før fejlede testene tilfældigt, når flere browsere kørte på én gang. Med hurtig tegning og færre faste ventetider bestod alle 18 tests i to hele kørsler med to ad gangen (10,3 og 10,2 minutter mod 14,8 med én ad gangen). Fejler en test sammen med en anden, kører `koer-alle.mjs` den igen alene og skriver "OBS".
- **Små fælles byggeklodser** frem for kopier: beskeder (`visBesked`), guiden (`startGuide`) og pausen (`lavPause`) bruges flere steder, så de opfører sig ens.
- **"Næste skridt" og "Vis mig"** hjælper meget med at komme i gang. "Vis mig" må ikke klare opgaver for en.
- **Vent på testene inden for samme tur** (vent på resultatet i stedet for at afslutte), så der ikke bliver pushet utestet kode.
- **Genskab fejlen, før den rettes.** Reaktorens tomme skærm blev genskabt med et skript (Kosmos → "For nørder" → Reaktoren), før den blev rettet. Testen for "Ryd og straks uran" bestod først også uden rettelsen. Først da den spolede i små skridt, fejlede den uden rettelsen (168 af 158) og bestod med den.
- **Brugerens egne indtryk finder andet end testene og agenterne:** fagord uden forklaring, et tempo, der er for hurtigt, og tal uden enhed. Læs teksterne, som om du ikke kan fysik.
- **Billeder i sekundet målt i testbrowseren** (software-tegning) kan bruges til at sammenligne før og efter. Fx tablet 3,9 → 6,7 og pc 5,1 → 5,5, da gløden blev halveret på tablets, og den virkningsløse kantudglatning blev fjernet. Kantudglatning i gløden (`samples: 4`) kostede ca. 40 % og gjorde testene langsommere, så den blev ikke slået til.
- **Tal regnet i koden og tjekket mod to uafhængige kilder** (Årstiderne): Formlen for dagens længde blev sammenlignet med opslag af kendte værdier. Det afslørede, at NOAA's korte formel for et "gennemsnitsår" ramte forårsjævndøgn i 2026 ca. et døgn forkert (5 minutter i København). Nu regnes Solens plads for netop 2026, og testen `aarstider` tjekker mod kilderne. Også kilderne kan afvige: én side gav 17 t 37 min for den længste dag i København, timeanddate.com giver 17 t 32 min.
- **Billige hjælpeagenter til opslag:** En Sonnet-agent med lav effort fandt kendte værdier med kilder og skrev ærligt "not found", hvor den ikke fandt noget. Faktatjekket af teksterne laver Opus.
- **Trin for trin med "Næste"** (Big Bang og Solens fremtid i Kosmos): Man bestemmer selv tempoet, og hvert trin har én kort tekst. Trykker man "Næste" før tid, gøres trinnet færdigt med det samme (`gørFærdig`), så tallene i panelet altid passer.
- **En historie i listen:** Kosmos-fænomenerne står i en rækkefølge, der fortæller en historie (Big Bang → stjerner fødes → Solen → døde stjerner → det mærkeligste), og det sidste trin peger videre til det næste fænomen.
- **Fysik regnet i koden i stedet for skrevet fast:** Den hvide dværgs supernova regner nikkel-56 → cobalt-56 → jern-56 ud med de rigtige halveringstider (6,1 og 77,2 dage), og testen tjekker tallene efter 100 dage. Så kan teksten ikke komme ud af trit med grafen.
- **Skaleret, men konsistent** (Formørkelser): Afstandene kan ikke være målfaste. I stedet er Solens størrelse valgt, så Solen og Månen ser lige så store ud på himlen som i virkeligheden. Så kan de samme formler (`js/data/skygge.js`) bruges til panelet, himlen og shaderne, og testen kan regne med rigtige afstande og få total ved 363.300 km og ring ved 405.500 km.
- **Faste etiketter skal fortjene pladsen.** "Tættest på Solen" og "Længst væk" i Årstiderne fyldte meget og blev stående, men var ikke spændende nok. De blev fjernet efter jeres feedback. Spørg: Skal det stå hele tiden, eller kun når det er vigtigt?
- **Kodereviewet af Formørkelser** (Opus) fandt en fejl, som hverken testene, billederne eller faktatjekket fandt: Månen kredsede den forkerte vej (`L = π + e` i stedet for `π - e`). Det fandt også, at kameraet hoppede langt væk ved hvert "Næste" (`kamera()` uden `flyv: false`), og at resultatet i "Prøv selv" lå under kanten af skærmen. Lav et kodereview af hver ny del, før den er færdig.
- **Citater fundet i to trin:** En Sonnet-agent søgte kandidater med kilder, og en Opus-agent tjekkede ordlyd, kilde og oversættelse. Uden WebFetch kunne ingen af dem åbne kildesiderne, så ordlyden blev sammenlignet i flere uafhængige søgeresultater. To kilder var forkert angivet (Bell Burnells tale hed "Petit Four" i 1977, og Paynes citat stammer ikke fra hendes erindringer). Paynes citat blev droppet, fordi ordlyden findes i flere udgaver. Et citat må ikke forkortes, så en forsigtig mistanke bliver til en påstand (Haldane).
- **Et kort skal læses samlet:** Faktatjekket af kategorikortet fandt, at "ikkemetaller leder ikke strøm" stod på samme kort som grafit, der leder strøm. Tjek, om teksterne på samme side modsiger hinanden.
- **Kontaktark til animationer:** De 11 forsøg i kategorikortet blev spolet frem (`spol`) og samlet i ét billede på tre tidspunkter. Så var det hurtigt at se, hvad der ikke virkede (fx lignede en "hånd" en tallerken og blev til en galliumske i te).
- **Faktatjekket af Formørkelser** (Opus) fandt fire upræcise ting, og ingen alvorlige fejl: Månens afstand (gennemsnit i stedet for yderværdier), at totaliteten 12. august 2026 også ramte Rusland og Portugal, ordbogens "kerneskygge" og "Månen er for lille" (se fælderne ovenfor).
- **Et spørgsmål fra brugeren kan handle om, hvor svaret står** (F1, oktober 2026). Jeres søn spurgte, hvorfor radioaktivitet er farligt. Svaret stod i hjælpen, og Kerne-fanen havde et link "Er det farligt?". Tjek derfor først, om svaret findes, og hvor man møder det, før der skrives mere tekst. Svaret skal stå der, hvor spørgsmålet opstår (se "Dybde i lag" i DESIGN.md).
- **Den samme tekst to steder på én gang** (F1): Stjerneovnen skriver reaktionens forklaring både i panelet og i underteksten (`fusion.js:1059` og `:1062`). Reaktorens guide og panel siger næsten det samme (`reaktor.js:541` og `:631`). Når en tekst tilføjes, så tjek, hvad der ellers står fremme samtidig.
- **En agent, der løber tør ("session limit"),** kan fortsætte senere med en besked (SendMessage), så det, den allerede har fundet, ikke går tabt. Start ikke en ny.

### Faldgruber: kamera og layout
- **Gløden lyser sorte ting op** (Sort hul, F1 punkt 8, oktober 2026). Skyggen var sort uden glød, men grå med glød, også ved halv styrke, fordi gassen omkring er meget lys. At skrue ned for gløden hjalp ikke. Løsningen: Gem billedet før gløden (`GemPass`), og brug det dér, hvor noget skal være sort (`SkyggePass`). Så kan ting foran skyggen stadig ses. Første forsøg med en maske, hvor tingene foran skulle tegnes sorte, gav en grå plade med skarpe kanter. Mål lyset i et skærmbillede med fuld grafik (testen `grafik`), for de andre tests tegner uden glød.
- **Æ, ø og å i shaderkode** gav en shaderfejl og en helt sort skærm (`'?' : syntax error`). GLSL tåler kun ASCII i navne. Skriv `oe`, som i `jorden.js`.
- **En regel med klasser taber til en regel med et id.** Panelerne blev skjult, men 3D-billedet blev ikke bredere, fordi `#fusion .vindue { grid-area: vindue }` vandt over `.skærm.skjul-venstre > .vindue`. Testen `lag` måler bredden, og det fangede det. Løsning: `:is(#vaerksted, #fusion, …)` i vælgeren.
- **"toggle" på `<details>` kommer lidt efter klikket.** En test, der genindlæser siden lige efter et klik, når ikke at gemme valget. Vent et øjeblik i testen.
- **To flader tæt på hinanden flimrer** (z-fighting). Skæret i midten af det sorte hul og navnet inde i skyggen lå 0,1 fra skyggen, og så blev halvdelen af dem skjult på skrå. Med 1 i afstand forsvandt det. Hold mindst 1 i afstand mellem flader, der vender mod kameraet.
- **Kamerastyringen har en skjult grænse.** `styring.maxDistance` (250) holder kameraet tæt på, også når styringen er slået fra. En planlagt kameratur skal hæve grænsen og sætte den tilbage bagefter.
- **Smalle skærme giver en anden kameraafstand.** På en telefon på højkant står kameraet længere væk (`passerTil` regner ud fra hullet). Rejsen ind i Solen sluttede derfor uden for Solen. Afstande skal regnes ud fra `verden.målAfstand`, og telefon på højkant skal altid testes.
- **Etiketter i 3D ved kanten af en kasse** kan få kassens kantlinje lige gennem teksten. Sæt dem foran kassen (større z) og under kanten, og tegn dem oven på alt (`depthTest = false`).
- **Ting i 3D-vinduet, der overlapper.** Brug `bundIVindue()` til ting nederst (over underteksterne). Et lag oven på hele vinduet skal have z-index 1, ellers dækker det underteksterne (z-index 2). 3D-etiketter kan stikke op over overskriften (Batteriet på tablet).
- **Det øverste lag i 3D-vinduet (`.vindue-top`) bliver skrevet om af beskeder.js** (pillerne og klokken). Egne elementer dér forsvinder. Kosmos har derfor sit eget lag øverst til venstre (`toplag()`, `#kosmosToplag`).
- **Skærmbilleder af "hele siden"** (`fullPage`) viser kun det synlige, fordi panelerne ruller hver for sig. Rul elementet frem (`scrollIntoViewIfNeeded`), og tag billedet bagefter.
- **Noget, der "mangler" på et billede, kan bare være uden for synet.** Månens skygge på Jorden så ud til at mangle. Set fra Solens side var den der: Kameraet så pletten helt ude ved kanten af Jorden. Kig fra lysets retning, før shaderen fejlsøges, og vælg kameraet, så det vigtige er midt i billedet.
- **Gennemsigtige flader skærer streger:** Jordens baneplan (en svag skive) lavede en skarp streg hen over Jorden i nærbilledet. Skyggekegler oven på kuglerne gav en takket kam. Skjul hjælpeflader tæt på, og gør kegler 1-2 % større end kuglen.
- **Navne på en kugle** (fx stederne på Jorden) bliver skåret af ved kanten, fordi kuglen dækker dem. Tegn dem oven på (`depthTest = false`), og skjul dem, når stedet er på bagsiden.
- **Retningen til noget uden for billedet** (Solen i Årstidernes nærbilleder, Månen på himmelkortet) skal vises, når pointen afhænger af den: stråler med pile og et skilt, eller en halv måne ude ved kanten.
- **Lange navne i et gitter** (Kosmos-listen med "Tyngdebølger" og "Solens fremtid") gjorde kolonnerne bredere end panelet, fordi `1fr` ikke kan blive smallere end det længste ord. Brug `minmax(0, 1fr)`, lad navnene bryde, og giv lange ord en blød bindestreg (`\u00ad`).

- **Orbitaler som prikker bliver en klat** (atomets udgaver, oktober 2026). Tre fyldte p-orbitaler giver tilsammen en kugle, og de inderste skaller lægger sig oven i. Det er rigtig fysik, men man kan ikke se formerne. Det hjalp at dæmpe de inderste orbitaler og skalere skyen efter, hvor 85 % af elektronen er (ikke middelafstanden). Formerne som overflader (B) blev helt hvide for jern og uran, fordi alle de inderste lå oven i hinanden med additiv blanding. Nu vises kun de yderste, og de toner ud tæt på kernen.
- **Samme kode i `onBeforeCompile` til to slags materialer:** Three.js genbruger programmet, når koden (toString) er den samme, også selvom den laver noget forskelligt. Kantlyset med og uden skygge har derfor hver sin `customProgramCacheKey`.

### Faldgruber: tid, timere og tilstand
- **Gættede tal i grafer.** Bakken i Stjerneovnens graf var først gættet og gav ca. 2 % i stedet for ca. 30 % ved 15 mio. °C. Rettet ved at måle i spillets fysik. Ændres fysikken (`FRASTØD`, `RN`, `termiskFart`), skal `BAKKE` måles igen.
- **Fænomener, der bruger det fælles ur**, kan ikke sættes på pause. Kosmos fik derfor sit eget ur (`kosmosTid`).
- **Kø med forsinkelse:** Pillerne (beskeder) gav en fejl, når køen blev tømt imens. Tjek køen igen inde i `setTimeout`.
- **Lyde før man har trykket på siden** gav advarsler i browseren. Lyde springes nu over, indtil siden er brugt (`navigator.userActivation`).
- **"Vis mig" lavede ingen reaktion i 4 af 60 forsøg.** En tredje kerne skubbede skuddet af kurs. Rettet, så de to kerner går igennem de andre: 0 af 60.
- **"Vis mig" i kædereaktionen døde ud i ca. 1,3 % af gangene.** Den første neutron skal altid spalte, men reglen "vandet sluger nu og da en neutron" gjaldt også den. Fundet, fordi testen `guide` fejlede én gang i hele samlingen og bestod alene. Målt med 300 forsøg (4 døde), rettet, og målt igen (0 af 300). Reaktor-testen kører nu 200 forsøg. Lær: Når en særregel ("altid"), så gennemgå **alle** de andre regler, der kan fjerne eller ændre den samme ting.
- **Et langsommere tempo afslørede en gammel fejl.** Stjerneovnens "Vis mig" kunne vælge en kerne, der selv var skudt af sted og stadig fløj. Når den kernes flyvetid løb ud, stoppede "Vis mig" uden reaktion. Det nye tempo (Normal 0,6 i stedet for 1) holdt egne skud længere i luften, så det skete i testen `guide`. Genskabt med 80 forsøg (2 uden reaktion), rettet (`vælgPar` springer optagne kerner over), 0 af 80, og testen `stjerneovn` kører nu 120 forsøg. Lær: Når en hastighed eller et tempo ændres, så tænk over alt, der varer en vis tid (flyvetider, tidsgrænser, "Vis mig").
- **Beskeder kunne skubbe rejsens undertekster væk.** Nu venter ovnens beskeder, til rejsen er slut.
- **Et henfald midt i et skærmskift** fryser, når værkstedet stopper (animationen kører kun, mens værkstedet vises), og låste værkstedet, så Det periodiske system ikke kunne åbne et grundstof der. Nu bliver det gjort færdigt med det samme (`atom.afslutHenfald()`), og ionen bliver neutral, når man kommer tilbage.
- **Tempo ganges på tiden, ikke på farten.** Stjerneovnens nye tempoer (0,3 / 0,6 / 3) ændrer ikke fysikken, så grafen og `BAKKE` passer stadig. `termiskFart` må ikke ændres for at gøre det langsommere.
- **Tekst, der skrives om 4 gange i sekundet,** fjerner ordforklaringerne lige så tit (Batteriets forklaring). Nu skrives den kun om, når tilstanden skifter (`forklaringVist`). Det samme gælder panelet i Kosmos (`forklaring()` springer over, når teksten er den samme).
- **En liste, der bygges om:** Formørkelsernes knapper blev bygget om ved at sætte `styring.length`. Det gav huller (`undefined`) i listen og en fejl i Kosmos. Brug `splice(0, styring.length, ...nye)`.
- **Guiden i Stjerneovnen kunne gå i stå.** Ved "Skyd den mod en anden" pegede ringen på en partner til den valgte proton. Forsvandt valget (et tryk ved siden af, eller protonen smeltede sammen af sig selv), forsvandt ringen også, og guiden ventede for evigt på et skud. Fundet, fordi testen `guide` fejlede nu og da i hele samlingen (også én gang alene). Fejlsøgning i testen ("hvad ligger der, hvor der trykkes?") viste "ingen ring". Genskabt under belastning (1 af 2 runder), rettet, så ringen peger på en proton, man kan vælge igen, og testen fjerner nu valget med vilje.
- **Faste ventetider i tests holder ikke under belastning.** Batteriets test ventede 4 sekunder på guiden og fik en TimeoutError, da hele samlingen kørte (to tests ad gangen). Alene bestod den. Rettet ved at vente på selve boblen (`waitForSelector`). Vent altid på det, der skal ske, og ikke på et antal sekunder.
- **Hjælpeagenter kunne ikke åbne kildesider** (23. oktober 2026). WebFetch gav DNS-fejl, og curl blev afvist for næsten alle adresser. De kunne kun se søgeresultater, og grænsen på 200 søgninger pr. tur (fælles for alle agenter) blev nået, så den sidste agent (Voyager) intet kunne tjekke. Derfor: Skriv i faktagrundlaget, hvad der kun er set i et uddrag, fjern påstande uden kilde, og lad færre agenter søge ad gangen.
- **Moduler, der importerer Three.js, kan ikke testes i Node.** Saturns ringe blev derfor delt i tal (`js/data/ringe.js`) og grafik (`js/solsystem/ringe.js`), ligesom de andre `js/data/`-filer.
- **Ringe set fra kanten.** Saturn i baggrunden ved Enceladus er rykket tættere på. Så kom kameraet ud af ringenes plan, og ringene blev en tyk, mørk streg foran fontænerne. Rettet ved at dreje ringenes plan, så den går gennem kameraet.
- **Kort fra USGS (ISIS-etiketter).** `LongitudeDirection = PositiveWest` ændrer kun tallene, ikke billedet (øst er stadig til højre). Men midten kan være forskellig: Enceladus-mosaikken har 0° i midten, Titans kort 180°, og højdekortet over Enceladus har 180° i midten. Læs `CenterLongitude` og `UpperLeftCornerX` i `.lbl`-filen, og rul kortet, så 0° står i midten (ligesom Jordens kort). Så vender siden mod Saturn rigtigt, når +x peger mod Saturn.
- **Et ringbillede passer ikke nødvendigvis med de rigtige afstande.** I Solar System Scopes ringbillede er Cassini-delingen for smal. Derfor bruges kun farverne, og de lægges stykke for stykke på de målte grænser (`lav_saturn.py`). Tjek altid et billedes skala mod kendte afstande, før det bruges som data.
- **Gråtonekort er målinger, ikke farvefotos.** Indlæst som sRGB blev Enceladus mørkegrå (sRGB-afkodningen gjorde det mørkere). Med `NoColorSpace` og en fast faktor blev den hvid, som den er.
- **`stjerneovn-mus` fejlede én gang uden forklaring** (24. oktober 2026): "rejsen starter første gang" i hele samlingen og 5 fejl, da den blev kørt igen alene. Bagefter bestod den 4 gange (3 alene og 1 sammen med `kosmos`), og ændringen rørte ikke Stjerneovnen. Rejsen skal starte inden for 5 sekunder efter en genindlæsning. Sker det igen, så log hvilke tjek der fejler, og giv rejsen længere tid.
- **Ting, der skal blive væk:** Merkur og Venus kom tilbage, når Solen skrumpede til en hvid dværg, fordi "slugt" blev regnet ud fra Solens størrelse lige nu. Nu huskes det (`slugt`).

### Faldgruber: tests og værktøjer
- **Test, der lyver:** En statistik viste for gode tal, fordi en valgt kerne ikke blev nulstillet mellem forsøgene.
- **En sjælden testfejl kan være en ægte fejl** ("Vis mig" ovenfor, to gange). Men den kan også være testens egen timing (`henfald`, og `pause`, der ventede præcis 1,5 sekunder på stavene). Find årsagen, før den afvises: Kør det, der fejler, mange gange inde i siden og tæl.
- **Forløb, der styres af uret (rigtig tid), og tryk på mål, der bevæger sig,** fejler, når maskinen er travl (load ca. 4): Rejsen ind i Solen var nået til fase 2, før testen kiggede, og en proton flyttede sig mellem målingen og trykket. Nu fryser testen rejsen på bestemte tidspunkter (`rejseTid`), og trykket prøves op til tre gange.
- **Testene kørte i slowmotion.** Spillet regner højst 0,05 sekund frem pr. billede (så det ikke hopper efter en pause). Testbrowseren tegnede kun 3-6 billeder i sekundet, så animationerne gik 3-6 gange langsommere end i virkeligheden, og testene ventede tilsvarende længe. Uden glød og i halv opløsning (`TEST_HURTIG`) tegner den 3-8 gange flere billeder (Kosmos 3,3 → 14,2, Stjerneovnen 2,8 → 9,8 og værkstedet på tablet 4,3 → 34,9). Hele samlingen gik fra 23 til 17,7 minutter alene af det. Faste ventetider blev skiftet ud med spoling og `waitForFunction` i de langsomste tests (fx Stjerneovn-testen 85 → 21 sekunder, henfald 103 → 60 og kosmos 100 → 52), så samlingen tog 14,8 minutter, og 10,2 med to ad gangen. Én test (`grafik`) tegner stadig med fuld grafik, så gløden også bliver afprøvet.
- **Hurtigere tests afslørede en svaghed i spillet.** "Vis en kædereaktion" døde nu og da ud i guide-testen, og bagefter gik reaktoren i stå i ca. 15 % af gangene (målt med 150 forsøg). Kun de to første generationer var sikret. Nu er tre sikret: 0 døde ud, og ca. 1 % går i stå bagefter. Testen `reaktor` kører 100 forsøg og fejlede med den gamle kode (18 af 100).
- **Arbejde, der venter på næste billede** (`requestAnimationFrame`), er langsomt i testbrowseren: Ordforklaringerne blev markeret 40-240 ms efter et klik, og over 400 ms, når maskinen var travl. Testen kiggede efter præcis 400 ms og fejlede 1 gang i hele samlingen. Nu markeres ordene med det samme (i MutationObserveren, 7-11 ms), og testen holder øje med ordet (`waitForSelector`).
- **En ny maskine kan være langsommere.** Efter en genstart tegnede testbrowseren færre billeder i sekundet, og en test med en fast ventetid fejlede. Hold øje med en tilstand (`waitForFunction`) i stedet for at vente en fast tid.
- **En pille, der forsvinder, før testen trykker** (`beskeder`, oktober 2026). Pillerne står i 4,5 sekunder. Mens en ekstra browser kørte ved siden af testsamlingen, nåede testen ikke at trykke i tide. Nu prøver testen igen på den næste pille (op til tre gange). Det er samme slags fejl som rejsen ind i Solen: rigtig tid på en travl maskine.
- **Agenter, der kører browsere samtidig med testsamlingen,** gør maskinen langsom. To tests fejlede kun under den belastning (batteri og guide). Batteri-fejlen var ægte: Lampen blev først skjult i det første billede. Kør helst ikke hele samlingen, mens agenter tager skærmbilleder.
- **Push før testene er færdige:** En automatisk regel kræver push, når en tur slutter. Vent derfor på testene inden for samme tur. Hvis der alligevel pushes før, så sig det.
- **Tests i en midlertidig mappe** ville være forsvundet, da sessionen sluttede. De ligger nu i `tests/`.
- **Konsolfejl talte ikke med** i de ældste tests. Nu giver de fejl i alle tests.
- **Ting skrevet efter hukommelsen var forkerte** (tabellen over testene). Tjek altid i filerne.
- **`pkill` med et mønster**, der også passer på ens egen kommando, lukker ens egen terminal. Brug process-id i stedet. Det skete igen i F1 med `pkill -f "http.server 8765"`.
- **Netadgang:** WebSearch virker herfra, men WebFetch kan ikke slå de fleste sider op (DNS). Kilder findes derfor via søgeresultater. Skriv det, når en kilde ikke kunne læses direkte.

### Grafik med rigtige billeder (Jorden og Månen, oktober 2026)
- **NASA's servere var blokeret** i Claude-miljøet. De blev tilladt under miljøets Network access. `visibleearth.nasa.gov` sender nu videre til `science.nasa.gov` (blokeret), men filerne kan hentes direkte fra `eoimages.gsfc.nasa.gov` og `svs.gsfc.nasa.gov`. Adresserne står i `billeder/solsystem/lav_billeder.py`.
- **Black Marble viser landet svagt blåt** (i måneskin). Lagt oven på natsiden blev hele natten lilla. Den blå baggrund trækkes fra, så kun byernes lys er tilbage.
- **Højdekort med 8 bit giver trapper**, når bjergene gøres højere. Højden gemmes med 16 bit i rød og grøn. Det tåler udglatning i grafikkortet, fordi højden er en ret linje af de to (r · 65280/65535 + g · 255/65535).
- **Gløden gjorde de lyseste skyer til hvide klatter** midt på dagsiden. Skyerne må højst være ca. 0,8 lyse.
- **Kameraet inde i Kosmos er svært at styre i tests:** Fænomenet flytter selv kameraet, og Jorden glider langs banen. Siden `kloder.html` viser Jorden og Månen alene med fast lys og kamera.
- **En "fejl" kan være rigtig fysik:** En rød plet på Månen i et testbillede var Jordens skygge, der lige strejfede den. Regn efter, før det rettes.
- **Billeder med én eller to kanaler** kan lægges i grafikkortet som `RedFormat` og `RGFormat` (sparer 50-75 %). Billederne frigives ikke, når et fænomen ryddes, for så skulle de lægges op igen, hver gang man skifter mellem Årstiderne og Formørkelser.

### Saturn i rigtig skala og flybyen (oktober 2026)
- **Store forskelle i skala:** Fra hele Saturn-systemet (Titans bane er 1,2 mio. km) og helt ind til Mimas (198 km) passer ikke med kameraets faste grænser (stjernehimlen begynder 700 enheder ude, og dybden på skærmen bliver for grov). Løsningen er at skalere og flytte hele systemet, så fokus står i midten, og kameraet altid er tæt på (`js/solsystem/rejse.js`). Det ser ud præcis som et kamera, der flyver. Shadere, der regner med radier eller højder (Enceladus' skygge og partikler, Titans dis, ringenes og planetens skygger), skal gange med `getWorldScale()`.
- **Glat flyvning mellem meget store og meget små ting:** van Wijk og Nuijs "glatte zoom og panorering" (2003). Skriv formlerne om med `asinh` og `sinh(ρs)/cosh(ρs + r0)`, ellers går store tal ud med hinanden.
- **Solens retning bestemmer, hvad man kan se:** Med Saturns nordpol mod Solen lå Enceladus' sydpol (fontænerne og tigerstriberne) i mørke. Nu hælder aksen væk fra Solen (sydlig sommer, som omkring 2004).
- **Rammen virker ikke ens på alle skærme:** Ved Titan står Saturn ved siden af Titan på pc, men bag panelerne på tablet og telefon på højkant. Tjek kameraets stop i alle størrelser.
- **Et navn, der bruges to gange i samme funktion** (`const { styring } = verden` og `const styring = []`), gav "Identifier has already been declared", og hele siden stoppede. Kald kameraets styring noget andet (`orbit`) i fænomener, der også har knapper i `styring`.
- **Billeder fra USGS:** GeoTIFF-felterne (`ModelTiepoint` og projektionens midte) siger, hvilken længdegrad der står i midten. Øst er altid til højre i billedet, også når etiketten siger "PositiveWest".
- **Faktatjek:** "Herschel er 130 km" (NASA's oversigtsside) og "Ithaca Chasma går tre fjerdedele rundt om Tethys" passer ikke med de nyeste opmålinger (139 km og ca. 1.200 km). Se fælderne i `docs/fakta-solsystemet.md` afsnit 4b.

---

## Testsamlingen
Testene ligger i [tests/](../tests/README.md). Kør dem med `node tests/koer-alle.mjs`. Se README'en for, hvad hver test tjekker.

## Åbne punkter
- **Fra gennemgangen** i oktober 2026 mangler stadig: forslagene i afsnit B (fremgang i menuen, links mellem delene, guide i Batteriet, app på hjemmeskærmen, "Test dig selv"), tilgængelighed (D8), fælles kode (D9), mindre download (D11) og ubrugt kode (D12). Se [gennemgang-2026-10.md](gennemgang-2026-10.md).
- Ikke testet med rigtig mus og rigtige fingre: hvordan det føles at sigte i Stjerneovnen, og hvor glat rejsen ind i Solen kører. Det skal prøves af jer. Det samme gælder ordforklaringerne og de fire nye Kosmos-fænomener.
- **Uopklaret:** Hvorfor "Vis en kædereaktion" døde ud netop i guide-testen (2 gange i ca. 14), men aldrig i 400 forsøg uden for den. Med tre sikre generationer er det ikke set siden. Dukker det op igen, så log reaktorens tilstand lige før "Vis mig".
- **To tests ad gangen** er kun målt stabilt i to hele kørsler. Hold øje med "OBS"-linjerne fra `koer-alle.mjs`.
- **Kædereaktionen efter "Vis mig" går oftere i stå end "ca. 1 %"** (målt i F1, 23. oktober 2026, med 100 forsøg og stavene på 50 %):
  - 6 gik i stå inden for 15 sekunder, og 11 inden for 2 minutter.
  - Testen `reaktor` tillader højst 6 af 100, så den er på grænsen og kan begynde at fejle.
  - Testbillede 45 i `docs/fable/billeder/` er et af tilfældene.
- **`docs/fable/tablet/LISTE.md` passer ikke med filerne:** 08 er Pulsar, 09 Kilonova, 10 Rumtid, 11 Tyngdebølger, 12 Ormehul, og 14 er menuen i Chrome. Billedet af teksten i Formørkelser mangler.
