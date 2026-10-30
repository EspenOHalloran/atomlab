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
- [ ] Før hjælpeagenter sættes i gang med at søge: tjek med `curl`, at kildesiderne kan åbnes. Er de blokeret, så bed brugeren om at tilføje domænerne under miljøets Network access først. Giver curl "unable to get local issuer certificate" eller "unable to verify the first certificate", er siden ikke blokeret: Der mangler et certifikat i containeren (se afsnit 3, "Certifikater").
- [ ] Planlæg kilderne, før opgaven går i gang: Står et domæne ikke på listen over åbne domæner, så spørg brugeren om adgang først (brugerens svar 29. oktober 2026, da library.si.edu og archive.org var lukket under citatet til Saturn).
- [ ] Er en netside eller et værktøj blokeret (fx GitHub-udgivelser til `basisu` i Mars M2), så stop og bed brugeren om adgang, før arbejdet fortsætter med en nødløsning (brugerens svar 24. oktober 2026). Adgang, der åbnes midt i sessionen, virker ikke altid med det samme (GitHub gav stadig 403 i S1). I Mars M3 virkede msss.com først ca. en halv time senere, så prøv igen, før du giver op, og ellers i en ny session.
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
- [ ] `document.querySelectorAll` er afgrænset til delen (`#reaktor .del-knap`) eller bruger en data-attribut, som kun findes der. Får to skærme den samme skal (Kosmos og Solsystemet), står den nye skærm efter den gamle i index.html, så tests uden afgrænsning stadig finder den gamle. En klasse kan bruges på flere skærme. Det samme gælder CSS-regler, også dem i `@media` (fx `order`).
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
- [ ] Kort fra USGS og andre mosaikker: Tjek for kopierede søjler i kanterne (springet mellem nabosøjler, Phobos' højdekort, M6a) og for helt tomme søjler og rækker (Viking-mosaikken over Mars har en tom første søjle, som gav en sort streg ved 180°), og at kanten ligger præcis på ±180° (skær ud efter kortets geografiske felter). Sæt den øverste og nederste række til samme værdi i et højdekort, ellers bliver polen takket, når nettet løftes. Tjek også billedets rigtige størrelse og en søjle for meget (Enceladus' kort er 14401 × 7201: Den sidste søjle er den første igen, og den nederste række er tom). Stol ikke på filnavnet: Solar System Scopes `8k_saturn.jpg` er kun 4096 × 2048.
- [ ] "Modlys" er set både tæt på og langt væk. Tæt på ligger en tynd luft i kanten i skygge, hvis Solen står midt bag planeten (Mars M3).
- [ ] Shadere, der regner med en radius, en højde eller en punktstørrelse, virker også, når gruppen er skaleret (gang med `getWorldScale()`). Kameraets faste stop (fx på en flyby) er set på pc, tablet og telefon, både på langs og på højkant.
- [ ] Kameraet ved et sted på en planet kan ikke komme under jorden: Test det under flyvningen (også fra den modsatte side af planeten), når man selv drejer og zoomer det ned, og med højere bjerge. Drejes systemet, skal Solens retning og stjernehimlen drejes med.
- [ ] Punkter på en planet regnes ikke med `sin` og `cos` i en shader. De er for unøjagtige: Mars M7a fik fejl på flere hundrede meter (radius 3.396 km), så der kom en revne mellem to net. Regn punkterne i JS, og send dem som attributter.
- [ ] `discard` i en shader, der dækker meget af skærmen, gør den langsommere (grafikkortet kan ikke springe skjulte punkter over). Giv kun de trekanter, der har brug for det, et materiale med `discard`.
- [ ] Store billeder (fx 4k-8k), der skal bruges under en flyvning eller en animation, hentes og lægges i grafikkortet på forhånd (`image.decode()` og `renderer.initTexture`), ikke i det øjeblik, de skal vises. Ellers hakker det (Saturns flyby, oktober 2026). Find årsagen til et hak ved at måle WebGL-kaldene, ikke ved at gætte.
- [ ] Et stop ved et lavt landskab (fx et krater, der kun er få hundrede meter dybt) har lav sol, så skyggerne viser formen. En årstid stilles som en vinkel mellem polen og Solen, og Solens højde over stedet tjekkes i en test.
- [ ] Billeder fra mosaikker af rigtige fotos (fx Viking MDIM 2.1 i 232 m) kan have skygger fra Solen "malet ind". Brug dem ikke som farver, når programmet selv regner lyset ud fra højderne.
- [ ] Koordinater fra USGS' navneliste: Brug MDIM 2.1 (standarden, passer med MOLA), og skriv, hvilket sæt der er brugt. MDIM 2.0 kan ligge 15 km ved siden af.
- [ ] Kommer kameraet tæt på et landskab (fx et stop på en flyby): Regn ud, hvor mange skærmpixel én pixel i højdekortet fylder ved stoppet (billedets bredde i km delt med kortets km pr. pixel og skærmens bredde i pixel). Er det mere end ca. 3, ser det grumset ud. Brug kildens fulde opløsning i et detaljekort lige der (`detalje` i `lokalt`), og sammenlign kilderne i den opløsning først (Mars M7a+).
- [ ] Et stop, der skal vise flere ting på én gang (fx en måne, et krater i sol og planeten bagved), er regnet igennem med vinkler først: kameraets, Solens og planetens retning, og hvor bredt 3D-billedet er (ca. 32-35° på pc med panelerne, mindre på højkant). Står en måne eller den side af planeten, man ser, i skygge, ser den ud, som om den mangler (Mars M6b).
- [ ] 3D-billedet er set fra flere vinkler og helt tæt på. Gennemsigtige hjælpeflader (fx et baneplan) og kegler kan skære streger eller takker hen over kugler, og en kegle kan vende forkert. Ting, der ikke ændrer sig, bygges én gang og ikke i hvert billede.

### F. Tests
- [ ] En kort tilstand (fx "ion i 1,6 sekunder") holdes der øje med hele tiden (`waitForFunction` med `polling`), i stedet for at kigge én gang.
- [ ] Tjek noget, der altid gælder (fx antal kernepartikler), i stedet for et præcist antal, når der er tilfældighed.
- [ ] Tilstanden nulstilles mellem forsøg, og mål vælges i et frit område (ikke under paneler).
- [ ] Tekst søges uden forskel på store og små bogstaver.
- [ ] En test af en rettet fejl skal først fejle uden rettelsen. Ellers ved vi ikke, om den tester noget.
- [ ] Fejl, der kun sker ved mange billeder i sekundet (fx mange kugler på kort tid), testes ved at spole frem i små skridt (fx `atomlabTest.vaerksted.spol`). Testbrowseren tegner kun 3-6 billeder i sekundet.
- [ ] Billedværktøjer, der skal vise fuld grafik, starter browseren med `fuldGrafik: true` (`tests/vaerktoejer/saturn.mjs` manglede det, så billederne var uden glød og med 2k-kort, uden at nogen så det). Tjek, hvilke filer siden faktisk henter (`side.on('request')`), når billeders størrelse eller kvalitet er det, der testes.
- [ ] Skærmbilleder tages først, når kameraet er færdigt med at zoome. Ellers ser layoutet forkert ud (`skaermbilleder.mjs` venter 7 sekunder).
- [ ] Ved ændringer i tegningen (renderer, efterbehandling): mål billeder i sekundet før og efter. Mål én browser ad gangen (to samtidig halverer tallene).
- [ ] Brug `node tests/koer-alle.mjs --ændret`, mens du arbejder, og hele samlingen før push. Vent på en tilstand (`waitForFunction`) eller spol frem i stedet for at vente en fast tid.
- [ ] Efter `hop()` (eller anden spoling af en flyvning) ventes der på, at flyvningen er slut (`!tur().flyver`), før næste flyvning startes. Ellers starter den midt i den gamle (Mars M6b).
- [ ] Forløb, der styres af uret (fx rejsen ind i Solen), fryses i testen på faste tidspunkter. Tryk på noget, der bevæger sig, prøves igen, hvis det ikke ramte.
- [ ] Ting, der kun står et stykke tid i rigtig tid (fx pillerne), fryses i testen, og testen lader selv tiden løbe ud (`atomlabTest.beskeder.frysPiller` og `spolPiller`). Et nyt forsøg hjælper ikke, når hvert skridt er langsommere end tingens levetid.
- [ ] En test åbner ikke en ny side, mens en anden side i samme test stadig tegner 3D. Luk den første først, og vent på, at skærmen er klar (`waitForFunction`), ikke på sidens load-hændelse (`page.goto` giver op efter 30 sekunder).
- [ ] En rettelse af en test, der fejler under belastning, vises først at fejle uden rettelsen (fx med fire travle CPU-løkker ved siden af), og bestå med den flere gange i træk.

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
| **Tokens brugt på at gå uden om en blokering** | Faktatjekket af Mars (24. oktober 2026) kostede ca. 190.000 tokens, fordi kildesiderne (nasa.gov, wikipedia, esa.int) var blokeret i miljøet, så agenten måtte søge mange gange og kun fik uddrag. Brugeren kunne have åbnet domænerne på et minut. | Sig det til brugeren med det samme, når noget er blokeret eller koster unødigt mange tokens, før en hjælpeagent sættes i gang. |
| **Skærmbilleder taget, før kameraet var færdigt** | To forkerte fund i gennemgangen: Batteriets etiketter "skåret af" på tablet og væggen i Det periodiske system "kun 40 % af bredden". Begge var billeder midt i zoomet. | F: vent på kameraet. |
| **Fagord uden forklaring** | "Neutrino" i supernovaen, "alfapartikel" ved henfald, "6-16" i Reaktoren. Fundet af brugeren. | B: forklar første gang. |
| **Grafik med fast plads, der løber over et øjeblik** | "Ryd" og straks uran: op til 179 protoner, men plads til 158. Sker kun ved mange billeder i sekundet, så testbrowseren så det ikke. | E og F: loft over antallet, test med små tidsskridt. |
| **To veje til den samme ting, der ikke kender hinanden** | Ordforklaringer: To hurtige klik på et ord lukkede forklaringen, men musens timer (0,3 sekunder) viste den igen bagefter. | E: hver vej stopper den andens timer. |
| **En ændring af tempo eller tid, der rammer tidsgrænser andre steder** | Stjerneovnens nye tempo fik egne skud til at flyve længere, så "Vis mig" kunne vælge et skud, der stadig fløj. | C: søg efter alt, der har en flyvetid eller tidsgrænse, når tempoet ændres. |
| **Regnet med for lav præcision** | Mars M7a: Kanten af det lokale net blev regnet med `sin` og `cos` i shaderen og lå flere hundrede meter for lavt, så der var en revne på en pixel, når man kiggede hen over kanten. | E: punkter regnes i JS. |
| **En indstilling, der ikke virker** | Kantudglatning (`antialias`) på lærredet virker ikke, når gløden tegner billedet. Den kostede bare hukommelse. | F: mål før og efter. |

### Kendte fælder i fakta (populære påstande, der er forkerte eller for skarpe)
- "Stickney fylder halvdelen af Phobos" (NASA's egen side). Krateret er ca. 9 km på en måne, der er ca. 26 km lang, og dækker kun få procent af overfladen.
- "Phobos er kun i Mars' skygge omkring jævndøgn." Det er Deimos. Phobos er i skygge på næsten hver omgang, undtagen omkring solhverv.
- "Hall brugte verdens største kikkert." Det var verdens største *linsekikkert*. Spejlkikkerter var større.
- "MMX kommer hjem i 2029" (Wikipedia i oktober 2026). Det er den gamle plan. JAXA siger 2031. Og opsendelsen var 20. oktober i Japan, men 19. oktober i Danmark: Skriv måned og år.
- "Den synkrone bane er en omgang på et døgn." Den gælder stjernedøgnet (Mars' 24 t 37 min), ikke soldøgnet.
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
- "Solens overflade koger." Det er også konvektion: Varm gas stiger op og kold synker ned (Solen i M4b). Skriv "bobler" eller "simrer".
- "Lyset er 8 minutter og 20 sekunder om at nå Jorden." Det er 499 sekunder, altså 8 min 19 s. Regn afrundinger efter, før de står med sekunder.
- "Olympus Mons' sider skråner ca. 5°." Wikipedia skriver 5 % (ca. 3°). Procent og grader er ikke det samme. Skriv "nogle få grader".
- Koordinater fra Wikipedia kan være ældre end USGS' navneliste (Olympus Mons: 18,65° N, 226,2° Ø mod 18,40° N, 226,00° Ø). Brug navnelisten (planetarynames.wr.usgs.gov).
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
- **`batteri` og `beskeder` fejler sammen i en travl session** (Mars M4b, 26. oktober 2026). Hele samlingen tog 28 minutter i stedet for ca. 10 (load ca. 6 på 4 kerner). `batteri` fik en TimeoutError, og i `beskeder` nåede testen ikke at åbne pillen. Begge bestod alene, og det samme skete på `main` uden ændringerne. Det er altså ikke nyt, men rigtig tid på en travl maskine. Min egen nye test (`jorden`) ventede 15 sekunder på, at uret gik en time frem, og fejlede af samme grund. Nu spoler den frem (`atomlabTest.solsystem.spol`).
  - **Rettet 29. oktober 2026.** Genskabt ved at køre de to sammen med fire travle CPU-løkker ved siden af: begge fejlede i første runde.
  - `batteri`: TimeoutError i `page.goto` til "Vis mig"-siden. Den første side tegnede stadig batteriet, og med to sider, der tegner 3D, tog det 13 sekunder at indlæse den nye side uden belastning og over 30 med (1,5 sekunder alene). Nu tjekkes hjælpen først, den første side lukkes, og den nye side venter på, at skærmen er klar (`waitForFunction`), ikke på load-hændelsen.
  - `beskeder`: Pillerne står 4,5 sekunder i rigtig tid, og under belastning tog hvert skridt i testen længere tid end det, så heller ikke tre forsøg hjalp. Nu fryser testen pillernes tid og lader den selv løbe ud (`atomlabTest.beskeder`), og den tjekker også, at den næste pille i køen kommer frem. Den venter på belønningerne og advarslen i stedet for faste tider.
  - Bagefter bestod begge tre runder i træk med samme belastning.
- **En pille, der forsvinder, før testen trykker** (`beskeder`, oktober 2026). Pillerne står i 4,5 sekunder. Mens en ekstra browser kørte ved siden af testsamlingen, nåede testen ikke at trykke i tide. Testen prøvede derefter igen på den næste pille (op til tre gange), men det var ikke nok på en travl maskine. Siden 29. oktober 2026 fryser testen pillernes tid (se ovenfor). Det er samme slags fejl som rejsen ind i Solen: rigtig tid på en travl maskine.
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
- **Skarpere kort (S1, 24. oktober 2026):** Månernes gråtonekort ligger nu med én kanal (`RedFormat`, som Jordens skyer) og fylder en fjerdedel. Det virker, fordi alle shaderne kun læser `.r`. Pc får 8k for Enceladus, Tethys, Dione og Rhea, hvor originalen har mindst 8.192 pixel rundt. Saturn bliver på 4k, for kildens "8k"-fil er kun 4096 × 2048. Wikimedia svarer 429, hvis forespørgslen ikke har en User-Agent.
- **Enceladus var overstrålet med glød:** Kortet blev ganget med 1,85 og klippet ved 1,05, så de lyse egne blev helt hvide, og gløden lagde en glorie om månen. Nu ganges det med 1,5 uden at blive klippet, og lyset er ca. 10 % svagere (`fontaener.js`). Et lyst kort skal ikke ramme loftet, ellers forsvinder detaljerne. Se det med fuld grafik, for testene tegner uden glød.

---

### Mars med rigtige højder (M2, oktober 2026)
- **Store GeoTIFF-filer hos USGS** er ukomprimerede og uden små udgaver (oversigter), så `rasterio` kan ikke læse en lille udgave billigt over nettet. Det gik hurtigere at hente hele filerne (0,8 og 2,1 GB på 1-3 minutter) til scratchpad og lave billederne lokalt.
- **Viking-mosaikkens blå kanal er næsten den samme overalt** (ca. 68-70), så de mørke egne som Syrtis Major blev blålige. På billeder i naturlige farver er de mørk gråbrune. `lav_mars.py` giver dem en gråbrun farve med samme lysstyrke, og det står i `KILDER.md`.
- **Rigtige højder ses som skygger, ikke som bjerge over kanten:** Set på hele kloden er Olympus Mons kun ca. 2 pixel høj ude ved kanten. Men skyggerne fra bjergenes skrå sider gør Olympus Mons, Tharsis og Valles Marineris tydelige, så de rigtige højder blev standard (jeres svar), og "Bjergene 10 gange højere" er en knap. Kameraet kigger altid på Mars' midte, så man kan ikke se horisonten tæt på. Det kommer i M4.
- **Et net, der løftes i vertex-shaderen,** (1024 × 512 felter på pc) gav ingen synlige problemer ved sømmen (kuglens kopierede punkter ved 180° henter samme højde). Kuglens `boundingSphere` skal gøres større, ellers kan bjerge skæres væk ude ved kanten af billedet.
- **Værktøjer:** GitHub-udgivelser er blokeret i miljøet (403), så `basisu` (KTX2) kunne ikke hentes. npm-registret og pypi kan bruges.
- **Billeder i sekundet i testbrowseren** (software-tegning, fuld grafik): pc Saturn 4,6 og Mars 2,6, tablet Saturn 12,6 og Mars 4,4. Med et grovere net på tablet (512 × 256 i stedet for 768 × 384) blev det kun 5,2, så det er ikke nettet, der koster, men pixlerne (Mars fylder meget af skærmen, og hver pixel henter fem gange i kortene). Et rigtigt grafikkort klarer det let, men det skal prøves på tabletten.

### Mars' luft, skyer og modlys (M3, oktober 2026)
- **Modlys med Solen midt bag planeten virker kun langt væk.** Set tæt på ligger kantens tangentpunkt på natsiden (en brøkdel R/afstand mod kameraet), så luften i kanten er i planetens skygge, og ringen forsvandt helt ved 2,9 radier. Det er rigtig fysik. Løsningen: Sæt Solen lige bag kanten (ca. 3° inden for), så lyser kanten på den side som en solopgang set fra rummet. Langt væk lyser ringen hele vejen rundt.
- **En skal, der skærer gennem bjergene, laver hårde huller:** Skyerne lå først 16 km oppe, og vulkanernes toppe stak op som mørke, skarpe pletter. Læg skallen over de højeste toppe, eller tegn skyerne i overfladens shader.
- **Skyer med en rund vægt rundt om et sted blev til runde, hvide pletter.** Lad støjen bestemme formen (tærsklen falder tæt ved stedet), og træk støjen ud mod øst og vest (vinden), så kanten bliver laset.
- **Polkapperne fandtes allerede i Viking-kortet**, bare lyserøde. En maske (forholdet blå/rød over ca. 0,6, lys, og tæt ved polen) skiller isen fra det orange støv (blå/rød ca. 0,4-0,5) uden nye billeder.
- **Fælde i fakta:** Den 1.800 km lange sky ved Arsia Mons (ESA) kommer i det sydlige forår og sommer og om morgenen. De almindelige skyer over Tharsis kommer om eftermiddagen i det nordlige forår og sommer (NASA PIA02049). Bland dem ikke sammen.
- **Billeder i sekundet** (testbrowseren uden grafikkort, fuld grafik, Mars 2,2 radier væk): pc 1,8-2,1 før M3 og 1,4-1,8 efter, tablet 3,0 før og 3,4 efter (inden for målestøjen). Det meste kostede skyernes skygge for hver pixel. `acos` blev skiftet ud med kordens længde, og skyggen og skallen springes over, når der ingen skyer er (`skyAktiv`).
- **Mål "før" mod den rigtige udgave:** Den lokale `origin/main` var forældet (fra før M2), så den første "før"-måling var slet ikke af Mars og gav et alt for højt tal. Mål mod grenens udgangspunkt (`git merge-base`), eller hent `main` først (`git fetch origin main`).
- **Tal, der regnes om:** Et tusmørke, der når 12° ind på natsiden, svarer til støv i ca. 76 km højde (R · (1/cos θ − 1)), ikke 50 km. Regn det efter, før det skrives.

### En ny skærm med samme skal som en anden (Solsystemet, M4a, oktober 2026)
- **Del skallen i stedet for at kopiere den.** Kosmos' skal blev til `lavFænomenSkærm` (js/faenomenskaerm.js). Elementerne får skærmens navn foran (`kosmosListe`, `solsystemListe`) og beholder de samme klasser, så CSS'en kun skulle have `:is(#kosmos, #solsystem)` de steder, hvor der stod `#kosmos`. Alle `querySelectorAll` i skallen er afgrænset til skærmens sektion.
- **Den nye skærm skal stå efter den gamle i index.html.** Testene bruger fx `page.click('[data-kosmos-fane="nørd"]')` uden at afgrænse, og Playwright tager den første, der passer. Står den skjulte skærm først, venter klikket forgæves.
- **Gemte data, når noget flytter:** De sete og det sidst valgte flyttes én gang (`flytGemt`), før skærmene bygges. Tælleren "x af N set" tæller kun de id'er, der hører til skærmen. Før talte den alt i den gemte liste, så den ville have vist "8 af 11".
- **Tælling med `replace` i Python:** `'#kosmos {'` passede også på `#kosmos { grid-template-columns …`. Tjek antallet (`assert s.count(a) == n`), før en tekst skiftes ud mange steder.
- **En sidste række med færre kort i midten:** Et CSS-gitter kan ikke centrere en halv række. Menuen bruger derfor `flex-wrap` med `justify-content: center` og en bredde ud fra `--kol`.

### Kameraet ned til et sted på en planet (Mars M4c, oktober 2026)
- **Kameraets styring (OrbitControls) kan kun have én fast op-retning** (den regnes ud, når styringen laves). I stedet for at ændre `camera.up` drejes hele planetsystemet, så stedets lodrette retning peger op i verden. Så virker drejning, zoom og piletaster af sig selv. Solens retning og stjernehimlen skal drejes med (`drejHimmel`), ellers står stjernerne stille, mens planeten drejer.
- **van Wijk og Nuijs vej går gennem planeten,** når fokus flytter fra midten ud til et sted på den anden side: Kameraet drejer rundt om fokus, som ligger inde i planeten. Kollisionen skubbede kameraet op, så det strøg hen over jorden i 2 km højde. Ned til et sted flyver kameraet derfor i en bue rundt om planetens midte, og testen måler skubbet under flyvningen (`skubbet`), også fra bagsiden.
- **Kollision med terrænet:** Nettet kan ligge højere end kortet mellem to punkter, så tabellen gemmer den højeste værdi i hvert felt, og kameraet holdes over den højeste i 3 × 3 felter plus en margen. Tabellen laves i strimler (ca. 10 ms ad gangen), for hele 4k-billedet tog ca. 340 ms i testbrowseren.
- **Samme billeder før og efter:** Gør `Math.random` ens fra gang til gang (stjernerne og fontænerne), tag billeder to gange før ændringen for at kende støjen, sammenlign kameraets tal (de skal være helt ens) og billederne uden stjernerne (som drejer i rigtig tid).
- **To kvaternioner i samme variabel:** `ud.setFromUnitVectors(...).multiply(fra)` med `ud === fra` overskriver `fra`, før der ganges. Brug en hjælpevariabel.
- **Formiddag eller eftermiddag:** Skyerne fra M3 kommer om eftermiddagen og dækkede næsten hele Olympus Mons. Kl. 8 er der klart vejr, og Solen står lavt, så de lange skygger viser formen.
- **Tæt på bestemmer nettet skarpheden, ikke billederne:** Skyggerne regnes i hver pixel fra højdekortet, men omridset følger nettet (ca. 21 km mellem punkterne på hele Mars). Olympus Mons blev derfor blød og flad tæt på, og en stejl skrænt bliver til en blød skråning. Regn afstanden mellem nettets punkter ud mod det, kameraet skal vise, før et stop planlægges. Overdriv ikke højderne for at skjule det, for så bliver det udtværede bare højere.

### Lokale detaljer ved et sted (Mars M7a, oktober 2026)
- **Sammenlign kilderne i spillets opløsning:** HRSC+MOLA (200 m) og MOLA (463 m) så næsten ens ud i 1 km pr. pixel, men i 0,5 km pr. pixel (det spillet bruger) var HRSC+MOLA tydeligt skarpere (MOLA har et ternet mønster mellem målesporene). HRSC+MOLA havde kasseformede fejl på op til 1,2 km på sletterne. De blev fundet ved at sammenligne med MOLA i snit over ca. 7 km: Hvor landet er fladt, må forskellen kun være lille.
- **Store ukomprimerede GeoTIFF-filer kan læses i vinduer over nettet** (`/vsicurl/` i rasterio): Vinduet om Olympus Mons (18° × 19°) tog ca. 3 minutter fra den 11 GB store HRSC+MOLA-fil. Det er ikke nødvendigt at hente hele filen.
- **Farver med skygger:** Viking MDIM 2.1 i 232 m har mørke skygger i calderaen og lyse skrænter fra Solen, da billederne blev taget. 925 m-mosaikken (den samme som kloden) blev brugt i stedet, og detaljerne kommer fra højdekortet.
- **Støvet i luften tæt på jorden:** Sløret mod kanten var regnet, som om man kigger fra rummet gennem hele luften, så alt blev mælket ud, når kameraet var få km oppe. Nu følger det luften mellem stedet og kameraet (skalahøjden), og høje steder er mindre slørede. Den støvede himmel lyser også lidt ind i skyggerne, ellers var de helt sorte.
- **Morgenlys viser skrænten bedst:** Om eftermiddagen lyste Solen lige på skrænten mod nordvest, så den så flad ud. Kl. 8 ligger den i skygge, og luften lyser omkring Solen bag den.
- **To net, der skal mødes:** Det lokale net ligger præcis på kuglens trekanter helt ude ved kanten (samme punkter og højder som `THREE.SphereGeometry`, tjekket mod geometrien i JS), glider over i de skarpe højder på 40 km og har et skørt. Kuglens hul er 1,5 km mindre end nettet, så de overlapper lidt. Revnen blev fundet ved at kigge hen over kanten i 4° fra ca. 9 km højde.
- **Fejlsøgning med farver:** Gløden og tonekurven ændrer farverne (ren grøn blev (152, 229, 93)), så test for "grøn" med en bred grænse. En ren farve pr. net og `renderOrder` viste, hvilket net der lå forrest.
- **To sessioner på samme tid:** Mens M7a blev lavet, mergede en anden session fire PR'er til `main` (Ordbogen m.m.). Hent `main` (`git fetch origin main`) og merge den ind i grenen før PR'en, løs konflikterne i DESIGN.md (begge "Senest lavet" bevares, den nyeste øverst), og kør testene igen på resultatet. En force-push af arbejdsgrenen bagefter blev afvist af miljøet. En fast-forward til `main` (`git merge --ff-only origin/main`) virker, når grenen allerede er merget.
- **Billeder i sekundet** (testbrowseren uden grafikkort, fuld grafik): pc ved Olympus Mons 2,3 → ca. 1,6, tablet 3,7 → ca. 2,5. Hele Mars er uændret (målestøjen er stor, 4,5-7,5). Prisen er det fine net (flere trekanter og lys i de samme pixel). Først kostede `discard` i hele kuglen også meget. Mål "før" med `git worktree` på `main` og en server på en anden port, skiftevis før og efter, for tallene svinger med maskinens belastning.

### Flybyen over Mars, M5a (30. oktober 2026)
- **Sammenlign kilderne for hvert sted:** Ved Tharsis (0,9 km pr. pixel) var HRSC+MOLA ikke skarpere end MOLA, så der bruges kun MOLA (CC0). Ved Valles Marineris (0,7-0,9 km) havde MOLA et ternet mønster i kløfterne, og HRSC+MOLA var tydeligt skarpere. Det skal ses på billeder for hvert sted.
- **Kameraets vinkel afgør, om et sted ser imponerende ud:** Tharsis-vulkanerne set fra siden af rækken (sydøst) lå som flade pletter ved horisonten, og Noctis Labyrinthus fyldte forgrunden. Set langs rækken fra sydvest står Arsia Mons forrest med calderaen og de andre bag den, i morgenlys fra siden. Det virker også på tablet på højkant, hvor en bred række ikke kan være i billedet.
- **Skjoldvulkaner er flade i virkeligheden:** 14-18 km høje og flere hundrede km brede. Teksten siger det og peger på "Bjergene 10 gange højere" i stedet for at snyde med højderne.
- **Flyvningen mellem to steder gik gennem Mars:** Fokus gled i en lige linje mellem stederne, og kameraet gik kun ca. 650 km op på 3 sekunder ved et hop på 115°. Nu glider fokus langs overfladen, og kameraet stiger, så begge steder kan ses fra toppen (radius / cos(halvdelen af vinklen), højst 2,2 radier). Testen måler, at det går over 2.000 km op mellem Valles Marineris og Hellas.
- **Højst to net ad gangen:** Hvert lokalt net tegnes, også på bagsiden af Mars. Nu tegnes kun nettet ved stedet og det, man flyver hen til (`aktiv`). Billeder i sekundet var ens ved alle stop (1,4-1,8 i testbrowseren).
- **Blokerede domæner, der står på listen:** www.dlr.de, www.jsg.utexas.edu og marsed.asu.edu blev afvist af proxyen, selv om de stod under Network access. Ændringen gælder sandsynligvis først i en ny session. Faktatjekket brugte ESA, NASA, USGS og Wikipedia i stedet.

### Detaljekort ved calderaen og skrænten (Mars M7a+, 30. oktober 2026)
- **Hvorfor det var grumset:** Det lokale højdekort over Olympus Mons har 0,52 km pr. pixel (2048 pixel over ca. 1.070 km), og kilden har 200 m. Ved calderaen er billedet ca. 135 km bredt, så én højdepixel fyldte ca. 5 skærmpixel, og tæt på mere end 10. Farverne (ca. 1 km) fylder endnu mere, men landet er næsten ensfarvet, så det er lyset fra højderne, der viser formerne.
- **Detaljekort i stedet for et nyt net:** Et højdekort i 0,22 km over ca. 445 × 445 km (calderaen og skrænten), som det lokale net læser, hvor det findes, og som glider over i det lokale kort på 15 km. Der kom ingen ny geometri og intet nyt hul. Lyset regnes for hver pixel ud fra kortet, så kanterne bliver skarpere, selv om nettet stadig har ca. 2 km mellem punkterne. Nettets punkter læser kortet på et grovere niveau i mipmaps (`detaljeLod`), ellers får de tilfældige toppe fra det skarpe kort.
- **Billederne viste forskellen:** Calderaens bund fik rynker og kanter, og skrænten flere kløfter. Det målte skarphed (forskel mellem nabopixel) steg 35-85 %. Helt nede ved jorden (ca. 15 km væk) er det stadig blødt, for kilden er ikke skarpere. Det næste skridt er HRSC's egne højdekort (ca. 50 m) i M7b.
- **Fejlene i HRSC+MOLA skal findes i km, ikke i pixel:** Vinduerne i `lav_steder.py` (ca. 7 og 13 km) er nu regnet i km, så detaljekortet bruger de samme. Med samme antal pixel var de blevet 2,4 gange mindre. MOLA blev brugt i 2,3 % af området (flade steder, ikke kanterne).
- **Testens kant krydsede skrænten:** Et tjek af overgangen med et skridt på 0,6 km fejlede, fordi vestkanten krydser skrænten, så forskellen var skråningen selv. Med 60 m bestod det. Tjek et spring med et skridt, der er meget mindre end landskabets egne skråninger.
- **Billeder i sekundet svinger meget i testbrowseren:** To kørsler af den samme udgave gav 1,5 og 1,7-1,9 ved calderaen og skrænten på pc. Med detaljekortet lå tallene i den nederste del (1,35-1,57). Prisen er højst ca. 10 %. Mål flere gange, før en forskel kaldes rigtig.

### Gale, Jezero, Nordpolen og navnene på kloden (Mars M5b, 30. oktober 2026)
- **USGS' koordinater i MDIM 2.1** står i shapefilen `MARS_nomenclature_center_pts.zip` (fra planetarynames.wr.usgs.gov/GIS_Downloads, læst med en lille DBF-læser i Python). Sidevisningen af et sted kan vise et ældre sæt uden net (Gale og Planum Boreum). Tjek mod et sted, hvor siden skriver "MDIM 2.1" (Aeolis Mons).
- **En årstid er en vinkel til Solen, ikke en drejning:** Programmets "jævndøgn" har Solen 2,9° over Mars' ækvator. At dreje aksen 25,19° mod Solen gav derfor 30,8° sol ved polen i stedet for 22,5-27,9°. Stil nordpolen præcis 90° − hældningen fra Solen. Testen `mars` fangede det, fordi den regner Solens højde over stedet ud (`solHøjde`), ikke bare drejningen.
- **Lave landskaber kræver lav sol:** Jezeros rand er kun 0,5-1,4 km over en 45 km bred bund. Kl. 9 (Solen ca. 40° oppe) kunne krateret næsten ikke ses. Kl. 7½ (ca. 22°) ses randen tydeligt. Vælg klokken ud fra, hvor høje tingene er, og se billedet med fuld grafik (testgrafikken er for mørk til at bedømme).
- **Sammenligningsbilleder af højder** skal have strakt kontrast: Et skyggebillede af næsten fladt land blev helt gråt. Stræk efter 1- og 99-percentilen af begge billeder sammen.
- **Navne på en kugle:** `Sprite.center` (fx `(0.5, -0.3)`) sætter teksten lige over stedet. `depthTest = false`, så bjergene ikke skærer i navnet, og et tjek af stedets retning mod kameraet skjuler det på bagsiden. Samme størrelse på skærmen: skaler med afstanden og del med systemets skala. Et tryk rammer tekstens kasse på skærmen plus 12 px.
- **Billeder i sekundet måles én browser ad gangen:** Pc og tablet samtidig gav 0,9 i stedet for 1,8 ved Jezero.

### Planen for Phobos og Deimos (Mars M6, 30. oktober 2026)
- **Spejlvending afgøres med tal, ikke med øjnene:** Et højdekort eller en formmodel, hvor længden kan være østlig eller vestlig, tjekkes mod noget med kendt retning. Phobos: kraterne i USGS' navneliste skal ligge i fordybninger i højdekortet (Stickney 443 m dybere end ringen omkring, spejlvendt 4 m). Deimos: Thomas' formmodel af Phobos fra samme datasæt passede kun med USGS' højdekort som vestlig (korrelation 0,96 mod 0,85), så Deimos-filen er også vestlig. Tilpasning af silhuetten til et foto var for svag (0,915 mod 0,905), for små måner er runde og bløde.
- **USGS' navneliste for Phobos og Deimos:** Shapefilens metadata siger "Positive West", men tallene i `center_lon` er østlige (Stickney 311 = 49° V). Tjek det mod kortet, før tallene bruges.
- **Fotos fra NASA og HiRISE:** assets.science.nasa.gov, uahirise.org og naif.jpl.nasa.gov er blokeret. Små udgaver fra Wikimedia Commons virker med en thumb-adresse i en standardbredde (fx 960px, regnet med md5 af filnavnet), men API'et svarer tit 429.
- **Send aldrig brugerens e-mail med** i en User-Agent eller anden forespørgsel til fremmede tjenester (sket én gang ved et forsøg mod Wikimedia, 30. oktober 2026). Brug fx "AtomLab-billedvaerktoej/1.0".

### Flybyen ud til Phobos og Deimos (Mars M6b, 30. oktober 2026)
- **Regn ønskerne til et billede igennem, før du bygger det.** "Stickney i solen og Mars i baggrunden" kunne ikke lade sig gøre samtidig: Stickney ligger halvt mod Mars, og når Solen lyser Stickney op, er den side af Mars, man ser bag Phobos, i mørke. Første billede viste ingen Mars. Tjek med vinkler (kameraets retning, Solens retning, Mars' retning og 3D-billedets bredde på ca. 32-35° på pc med panelerne), og skriv kompromiset til brugeren. Tjekliste E er udvidet.
- **En måne i planetens skygge er usynlig, og det er planeten bag den også** (natsiden). Brugeren troede, at Phobos manglede. Et besøg flytter nu månen ud af skyggen og siger det i teksten.
- **Kollision skal bruge den rigtige størrelse.** Månerne tegnes større langt væk. Kollisionen brugte den forstørrede størrelse og skubbede kameraet 9 km ud efter et hop fra langt væk.
- **`hop()` gør flyvningen færdig i *næste* billede.** Trykker et script "Næste" lige efter `hop()`, starter den nye flyvning midt i den gamle. Det gav forkerte målinger og et falsk fund. Vent på `!tur().flyver` efter `hop()` (tjekliste F).
- **Mål flimmer ved at sammenligne med en større near**, ikke ved at gætte ud fra formlen for dybdeopløsning. Ved "Mars set fra Phobos" så formlen farlig ud (ca. 25 km mellem dybderne ved Mars), men billedet med near 0,05 var ens med near 0,005. Hvad der flimrer, afhænger af, hvad der faktisk overlapper.
- **Kør ikke en test med fuld grafik samtidig med en anden test.** Billederne tog over 30 sekunder, og skærmbilledet gav op. En fast ventetid på 300 ms i testen `mars` ("Modlys") fejlede af samme grund og venter nu på tilstanden.
- **Pas på med `pkill -f`:** Et mønster, der også står i den kommando, man selv kører, dræber ens egen skal (og her den lokale server).

### Phobos og Deimos i den rigtige form (Mars M6a, 30. oktober 2026)
- **Kanterne i et globalt kort kan være kopier:** Phobos' højdekort fra USGS har dobbelte søjler i begge kanter (0 = 1 og 696 = 697), og de passer ikke med naboerne. Det så ud som en rende ved 180°. Find dem ved at måle springet mellem nabosøjler (typisk 10 m, ved kanten 50-180 m). Tjekliste E er udvidet.
- **En streg på en klode: slå kortet fra, før du leder.** Med kortet slået fra (`uHarKort = 0` i browseren) forsvandt stregen. Den lå altså i mosaikken, ikke i formen, og en ny streg i formen var allerede rettet. Et billede med og uden kort sparer mange forsøg.
- **Huller i en mosaik:** Fyld dem ikke med en lige linje mellem kanterne (det giver striber). Spejlede stykker fra begge sider, der glider over i hinanden, ligner overfladen.
- **Planetens skygge:** En måne, der står lige bag planeten set fra Solen, er helt sort og ser ud, som om den mangler. Vælg startpladser uden for skyggen, og tjek billedet.
- **Synlighed med det samme:** Testen "et tryk på Gale … navnene forsvinder" fejlede under belastning, fordi navnene først blev skjult i næste billede. Nu kaldes `opdaterNavne()` med det samme (tjekliste E).

### Hent første stop på forhånd (Mars og Saturn, 30. oktober 2026)
- **Hakket ved Saturn:** "Start flyby" hentede alle seks månekort på én gang (ca. 23 MB på pc, fire i 8k). Når de kom, blev de lagt i grafikkortet midt i den første flyvning: Målt i testbrowseren med fuld grafik tog hver overførsel 90-1.600 ms, og ét billede tog 4 sekunder. Målt ved at pakke `texSubImage2D`, `linkProgram` osv. ind med tidtagning (`side.addInitScript`) og trykke på knappen. Det er sådan, man finder årsagen til et hak, i stedet for at gætte.
- **Det hjalp:** `image.decode()`, før teksturen bruges (billedet afkodes uden for hovedtråden, ca. 3 gange hurtigere overførsel), og `renderer.initTexture(t)` på forhånd, så overførslen sker, mens man kigger på planeten, og ikke under flyvningen. Én ad gangen, så hakkene ikke kommer samtidig. Bagefter var der ingen overførsler efter "Start flyby".
- **Faldgrube:** De lokale net var aktive fra start og blev kun ikke tegnet, fordi kortene manglede. Da kortene kom på forhånd, blev Olympus' net tegnet over hele Mars (også på bagsiden). Testen fangede det (`klar` før flybyen). Når noget hentes tidligere end før, så tjek, hvad der skjulte det indtil da.
- **Knappen venter højst 8 sekunder** (`FORHÅND_TID`), også hvis kortene ikke kan hentes (`fejl` i `hent`). Testen `mars` tjekker det med `side.route(…, abort)`.
- **Callbacks, der kan komme med det samme:** Ligger et billede allerede i `lager`, kaldes `færdig` straks, midt i `lav()`, før variablerne længere nede findes (TDZ-fejl). Derfor `queueMicrotask`.

### Planen for "Stå på Mars" (Mars M8, 30. oktober 2026)
- **Der, hvor roveren står, er ikke altid en udsigt.** Curiosity står nu i en sænkning, så Mount Sharps top er skjult, og Perseverance står uden for Jezero mellem bakker. Toppen af Jezeros rand (sol 1358) skjulte også krateret. Tegn udsigten ud fra højdekortet, før et sted vælges, og regn udsynet ud for alle roverens stop (det bedste ved Jezero var randens inderside, sol 1293-1302).
- **Rovernes stop med koordinater og dato** står i NASA's kortdata (`mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` og `M20`). Sol regnes om til dato med 1,0275 døgn pr. sol fra landingen.
- **Zip-filer over nettet:** GDAL kan læse inde i en zip-fil over nettet (`/vsizip/{/vsicurl/…}`), men er filerne pakket (deflate), skal alt fra filens start pakkes ud. Find hellere den samme fil ukomprimeret (Mars 2020's landingskort lå på `planetarymaps.usgs.gov`, fundet via links på USGS' søgesider).
- **Et lille værktøj i numpy, der tegner 360°-udsigten** (højeste vinkel langs hver retning, Mars' krumning, dis), er billigt og viser, om et sted er godt, før noget bygges. Pas på med at kopiere hele højdekortet i hvert skridt (`np.nan_to_num` på 30 mio. punkter gjorde det 40 gange langsommere).

### Stå på Mars ved Gale (Mars M8a, 30. oktober 2026)
- **Normalen pr. pixel var den store pris:** Fire opslag i højderne (op til to lag hver) for hver pixel gjorde landskabet 6 gange langsommere (0,22 mod 1,29 billeder i sekundet i testbrowseren). Nettet i ringe har punkter tættere end højdekortet tæt på og ca. 7 skærmpixel imellem langt væk, så normalen regnes nu i punkterne. Mål, før du optimerer: billeder i sekundet med og uden.
- **Et tidligt stop kræver det rigtige loft:** Skyggekortene stopper, når strålen er over det højeste sted. Loftet var Mars' højeste højde (21,5 km), så de stoppede aldrig, og et billede tog minutter. Nu er det det højeste sted i stedets kort (`hMaks`).
- **Tid, der kører i ring, skal tælle døgnene:** Månerne blev regnet ud fra klokken (0-24), så de hoppede ved midnat, og Deimos (ca. 131 timer om en tur set fra jorden) kom aldrig rundt. Testen fangede det. Brug døgn + klokken.
- **Skift alt på én gang:** Ved "Gå til Curiosity" skiftede stedet, før lagene var hentet, så jorden kunne hoppe. Saml teksturerne, og skift dem sammen, når alle er hentet.
- **Flimmer målt igen (som i M6b):** near 0,3 m og 3 m gav samme billede langt væk. Med nulpunktet under kameraet og 1 enhed = 1 km holder 24 bit dybde.
- **Fotos med skygger fra Solen:** I firkanter regnes log(foto) mod hældningen øst og nord fra højdekortet, og den del, der følger hældningen, trækkes fra (`uden_skygger` i `lav_landskab.py`). Det fjernede de store skygger. Et forsøg på at fjerne striberne mellem satellitbilleder (højpas på tværs) hjalp ikke.
- **Ventesløjfer med `pgrep -f`:** `until ! pgrep -f "landskab.mjs"` finder sin egen kommandolinje og venter for evigt. Brug et mønster, der ikke står i kommandoen, eller vent på en fil.
- **Små sten tegnet af programmet:** Med normalen vendt forkert lignede de huller (som kratere). Tjek retningen på en bule: Normalen skal pege væk fra midten.

### Certifikater: "unable to get local issuer certificate" (30. oktober 2026)
- `www.dlr.de`, `www.jsg.utexas.edu` og `marsed.asu.edu` var ikke blokeret af proxyen (tunnelen svarede 200). Containeren manglede rodcertifikatet "emSign Root CA - G1" (utexas og asu), og dlr.de sender ikke sit mellemcertifikat (GEANT TLS RSA 1).
- **Løsning uden at slå tjekket fra:** Mozillas rodliste fra `certifi` (`pip download certifi`, pypi er åben) og mellemcertifikatet fra `http://crt.harica.gr/HARICA-GEANT-TLS-R1.cer` (kun http: hent det gennem proxyens tunnel med `curl -p --proxy "$HTTPS_PROXY"`, og tjek det med `openssl verify` mod containerens rødder). Læg dem sammen med `/etc/ssl/certs/ca-certificates.crt` i én fil, og brug `curl --cacert`. Brugeren åbnede `crt.harica.gr`.

### Fire små opgaver i træk (29. oktober 2026)
- **Et link skal pege på et sted, hvor ordet står.** Ordbogens links blev tjekket i kildeteksterne med et lille script, før de kom med. Fire "Hvorfor?"-kort, der virkede passende ("radioaktiv" → "Hvorfor er nogle kerner ustabile?"), nævnte slet ikke ordet og blev fjernet. Tjekket er nu en del af testen `ordbog`.
- **Dansk sortering med `Intl.Collator('da')`** sætter æ, ø og å efter z, også inde i ordet ("Stjerne" før "stærke"). Min egen forventning i testen var forkert, ikke sorteringen.
- **Moduler med Three.js kan ikke testes i Node** (igen): Ordbogens liste, søgning og links ligger derfor i `js/data/ordbogliste.js`.
- **Et citat kan bekræftes med en uafhængig kontrol:** Huygens' anagram har 7 a'er, og det passer kun med "cohaerente". Wikipedia skriver "coherente". OCR'en af den gamle bog læste ordet forkert ("cobarente"), så tælling af bogstaver var det, der afgjorde det.
- **Dataservere skifter navn:** archive.org sender filerne videre til `ia….us.archive.org` eller `dn….eu.archive.org`. Bed om `*.archive.org` på én gang.
- **Søg efter faste tal i testene, når noget fælles ændres:** Testen `kosmos` tjekkede "7 kort i menuen", så det ottende kort fik den til at fejle. Søg efter tallet (`grep`) i `tests/`, før hele samlingen køres.
- **Giv en lang testkørsel tid nok:** `koer-alle.mjs` med alle tests tog 26-27 minutter i denne session. En baggrundskørsel med 10 minutters grænse blev stoppet midt i og skulle køres forfra.

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
- **`stjerneovn-mus` (rejsen starter) og `guide` ("pc: måleren i 3D-billedet") fejlede sammen med andre** (29. oktober 2026, kategorien som link, samlingen tog 27 minutter i stedet for ca. 10). Begge bestod alene, og ændringen rørte ingen af dem. I næste kørsel samme dag (fotonerne, kun tekst) fejlede `stjerneovn-mus` igen og `mars` ("Modlys": Solen står bag Mars) én gang, og begge bestod alene. I kørslen af Ordbogen fejlede `mars` igen under belastning ("Modlys" slået fra: Solen er tilbage) og bestod alene. `stjerneovn-mus` fejler altså tit under belastning. Ikke undersøgt endnu. Genskab det med fire travle CPU-løkker (som `batteri` og `beskeder`) og find den faste ventetid.
- **`fuldskaerm` ("pc: fuld skærm efter klik") fejlede én gang under belastning** i kørslen af Mars M8a (30. oktober 2026) og bestod alene. Ændringen rørte ikke fuld skærm. Hold øje med den.
- **`docs/fable/tablet/LISTE.md` passer ikke med filerne:** 08 er Pulsar, 09 Kilonova, 10 Rumtid, 11 Tyngdebølger, 12 Ormehul, og 14 er menuen i Chrome. Billedet af teksten i Formørkelser mangler.
