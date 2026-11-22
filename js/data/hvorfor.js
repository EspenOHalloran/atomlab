// "Hvorfor?"-kortene (se docs/plan-lag.md). Et kort svarer på ét spørgsmål i 3-5 korte sætninger.
// næste: id på kortet, som "Og hvorfor det?" åbner. nørd: en ekstra bid til de nysgerrige.
// Teksterne er faktatjekket (kilderne står i docs/fakta-hvorfor.md). Ret dem dér først, og hold dem ens.
// Bruges med <button class="hvorfor" data-hvorfor="id">…</button> eller visHvorfor(id) fra js/lag.js.

export const HVORFOR = {
  farligt: {
    spørgsmål: 'Er det farligt?',
    svar: 'Strålingen fra et henfald har så meget energi, at den kan slå elektroner løs fra atomerne i din krop. Så kan molekylerne gå i stykker, også DNA\'et i dine celler. Lidt stråling får du hele tiden fra naturen, og kroppen reparerer det meste. Det farlige er meget stråling på kort tid, eller radioaktive stoffer, der kommer ind i kroppen. Det kommer an på, hvor meget, hvor længe og hvilken slags.',
    næste: 'dna',
  },
  dna: {
    spørgsmål: 'Hvad gør strålingen ved DNA\'et?',
    svar: 'Strålingen kan knække DNA-strengen direkte. Den kan også splitte vandmolekyler i cellen, så der dannes meget reaktive stumper (frie radikaler), som skader DNA\'et. Et brud i den ene streng reparerer cellen let. Brud i begge strenge er sværere, og bliver det repareret forkert, kan cellen ændre sig (en mutation). Nogle få af dem kan mange år senere blive til kræft. Meget stråling på én gang dræber celler, især dem, der deler sig hurtigt (i tarmen, knoglemarven og huden). Det giver strålesyge.',
    næste: 'dosis',
  },
  dosis: {
    spørgsmål: 'Hvor meget skal der til?',
    svar: 'Stråling i kroppen måles i sievert (Sv). En dansker får ca. 4 millisievert (mSv) om året fra naturen og fra røntgen og skanninger på hospitalet. Radon i luften giver ca. halvdelen. En flyvetur til USA og tilbage giver ca. 0,1 mSv, og en CT-skanning ca. 2-10 mSv, alt efter hvor man bliver skannet. Strålesyge kommer først ved ca. 1 Sv (1.000 mSv) på kort tid. Omkring 4 Sv på én gang slår ca. halvdelen ihjel uden behandling. Med god behandling kan flere overleve.',
    nørd: 'Ved strålesyge bruger fagfolk egentlig enheden gray (Gy), der måler den energi, kroppen får. For gamma- og røntgenstråling giver det næsten samme tal som sievert.',
  },
  kernen: {
    spørgsmål: 'Hvorfor holder kernen sammen?',
    svar: 'Protonerne er plusladede og skubber hinanden væk. Men den stærke kernekraft trækker i alle protoner og neutroner, og tæt på er den mange gange stærkere end frastødningen. Den virker kun mellem nære naboer i kernen, ca. 1-2 milliontedele af en milliardtedel af en meter væk. Neutronerne giver ekstra "lim" uden selv at skubbe.',
    næste: 'ustabil',
    nørd: 'Kernekraften er en "rest" af den stærke kraft, der limer kvarkerne sammen inde i protonerne og neutronerne. Helt tæt på (under ca. ½ femtometer) skubber den i stedet, så kernen ikke klapper sammen.',
  },
  ustabil: {
    spørgsmål: 'Hvorfor er nogle kerner ustabile?',
    svar: 'Frastødningen virker over hele kernen, men limen virker kun mellem naboer. Store kerner har derfor brug for flere neutroner end protoner. Med for mange eller for få neutroner (eller når kernen bare er for stor) kan den komme ned i en lavere energi ved at henfalde, og før eller siden gør den det.',
  },
  skaller: {
    spørgsmål: 'Hvorfor har atomet skaller?',
    svar: 'I et atom kan en elektron kun have bestemte energier. Det minder lidt om en guitarstreng, der kun kan svinge med bestemte toner. Og to elektroner kan aldrig være i præcis samme tilstand. Derfor er der kun plads til 2 elektroner i den inderste skal og 8 i den næste. Når de inderste pladser er fyldt, må de næste elektroner længere ud.',
    næste: 'orbitaler',
    nørd: 'Udelukkelsesprincippet (Pauli): To elektroner kan ikke have de samme fire kvantetal. En skal nr. n har plads til 2n² elektroner. Den yderste skal har næsten altid højst 8, fordi den næste skal begynder at fylde, før den forrige er helt fuld. Palladium er en undtagelse med skallerne 2, 8, 18, 18.',
  },
  orbitaler: {
    spørgsmål: 'Er elektronerne virkelig små kugler?',
    svar: 'Nej. En elektron opfører sig som en bølge omkring kernen, og man kan kun sige, hvor den sandsynligvis er. De områder hedder orbitaler. Nogle er runde (s), andre ligner dobbeltdråber (p) eller firkløvere (d). Skallerne og ringene i spillet er en forenklet tegning af det.',
    // Drejebogen for Kvantefysik afsnit 8: turen "Prikker bliver til striber" (forløb 1)
    link: { tekst: 'Se det selv: Kvantefysik ›', handling: () => import('../gaa.js').then((m) => m.åbnForløb('kvante', 'striber')) },
  },
  varmt: {
    spørgsmål: 'Hvorfor skal det være så varmt?',
    svar: 'Alle kernerne er plusladede og skubber hinanden væk. For at smelte sammen skal de så tæt på hinanden, at kernekraften kan tage over, og det kræver stor fart. Varme er fart: Jo varmere, jo hurtigere suser kernerne rundt. I Solens kerne er det ca. 15 mio. °C.',
    næste: 'tunnel',
  },
  tunnel: {
    spørgsmål: 'Er 15 mio. °C så nok?',
    svar: 'Nej, faktisk ikke. Selv ved 15 mio. °C er protonerne i Solen langt fra hurtige nok til at komme over frastødningen. Men i kvantemekanikken kan en partikel en gang imellem slippe igennem "bakken", som gennem en tunnel. Det kaldes tunneleffekten. Uden den ville Solen ikke lyse.',
  },
  energi: {
    spørgsmål: 'Hvor kommer energien fra?',
    svar: 'De nye kerner vejer en lille smule mindre end dem, de blev lavet af. Den forsvundne masse er blevet til energi, ligesom Einstein forudsagde: E = mc². Fordi c (lysets fart) er så stort, giver en lillebitte smule masse enormt meget energi. Når brint bliver til helium, forsvinder ca. 0,7 % af massen. Når uran spalter, forsvinder knap 0,1 %.',
    næste: 'binding',
  },
  binding: {
    spørgsmål: 'Hvorfor vejer heliumkernen mindre?',
    svar: 'Det kræver energi at skille en kerne ad. Den energi kaldes bindingsenergien. Da kernen blev lavet, slap den samme mængde energi ud, og den mangler nu som masse. Jern og nikkel har den største bindingsenergi pr. nukleon. Derfor giver det energi at smelte lette kerner sammen og at spalte tunge kerner.',
  },
  uran: {
    spørgsmål: 'Hvorfor spalter uran-235, men ikke uran-238?',
    svar: 'Neutroner vil gerne være i par. Uran-235 har et ulige antal neutroner (143). Når det fanger én mere, får den nye neutron en partner, og der slipper ekstra meget energi fri. Det er nok til, at kernen dirrer og flækker, også med en langsom neutron. Uran-238 har allerede et lige antal (146). Den ekstra neutron får ingen partner og giver for lidt energi, så kernen holder bare på den og bliver til uran-239.',
    nørd: 'Uran-236 får ca. 6,5 MeV, når det fanger neutronen, og det er mere end de ca. 5-6 MeV, der skal til for at spalte det. Uran-239 får kun ca. 4,8 MeV og skal bruge mindst lige så meget. Uran-238 kan spaltes af hurtige neutroner (over ca. 1-2 MeV).',
  },
  bombe: {
    spørgsmål: 'Kan en reaktor eksplodere som en bombe?',
    svar: 'Nej. En bombe bruger uran med typisk ca. 90 % uran-235, eller plutonium, som presses sammen på en brøkdel af et sekund. Brændslet i et kraftværk har typisk kun 3-5 % uran-235. Men der kan ske alvorlige ulykker. I Tjernobyl i 1986 løb reaktoren løbsk under et forsøg, og en dampeksplosion sprængte den. Bagefter brændte grafitten i reaktoren i mange dage. I Fukushima i 2011 slog et jordskælv og en tsunami strømmen ud. Så svigtede kølingen, og brændslet smeltede i tre reaktorer. Eksplosionerne dér var brint, ikke atombomber.',
  },
  magnetfelt: {
    spørgsmål: 'Hvad er et magnetfelt?',
    svar: 'Et magnetfelt er området omkring en magnet, hvor den kan trække og skubbe i andre magneter, i jern og i ladede partikler, der bevæger sig. Man kan se det med jernfilspåner, som lægger sig langs feltlinjerne. Magnetfelter bliver lavet af elektrisk strøm og af elektronerne selv, som er bittesmå magneter. En ladet partikel, der flyver ind i et magnetfelt, bliver bøjet af og snor sig langs feltlinjerne. Derfor kan Jordens magnetfelt lede solvinden udenom.',
    næste: 'jordmagnet',
  },
  jordmagnet: {
    spørgsmål: 'Hvorfor er Jorden en magnet?',
    svar: 'Ca. 2.900 km nede er Jordens ydre kerne flydende jern og nikkel. Det glohede metal strømmer rundt ligesom suppe i en gryde, fordi varmen indefra og lette stoffer fra den faste indre kerne driver det. Jordens rotation vrider strømmene. Metal, der strømmer i et magnetfelt, laver elektriske strømme, og strømmene holder magnetfeltet i gang. Det kaldes en dynamo. Nogle gange vender feltet, så nord og syd bytter plads. Det skete sidst for ca. 770.000-780.000 år siden.',
    næste: 'magnetisk',
  },
  magnetisk: {
    spørgsmål: 'Hvorfor er nogle ting magnetiske?',
    svar: 'Hver elektron er en lillebitte magnet. I de fleste stoffer peger de i alle retninger eller er parret, så de ophæver hinanden. I fx jern, nikkel og kobolt får en kvanteeffekt naboerne til at pege samme vej i små områder. Peger mange af områderne samme vej, er stykket en magnet. Hvorfor elektronen selv er en magnet, kan man ikke forklare med en hverdagsforklaring. Det er en grundlæggende egenskab ved elektronen, ligesom dens ladning.',
  },
  ledning: {
    spørgsmål: 'Hvorfor går strømmen gennem ledningen?',
    svar: 'Batteriet gemmer energi ved at flytte lithium fra den ene side til den anden. Men elektrolytten i midten lukker kun ioner igennem, ikke elektroner. Derfor må lithium dele sig: Ionen tager den korte vej gennem elektrolytten, og elektronen tager den lange vej gennem ledningen. Det er elektronernes omvej, vi bruger som strøm.',
  },
  batterivarme: {
    spørgsmål: 'Hvorfor bliver batteriet varmt?',
    svar: 'Batteriet har en lille indre modstand. Når strømmen løber igennem, bliver en del af energien til varme, ligesom i en elkedel. Varmen vokser hurtigt med strømmen: Dobbelt så stor strøm giver ca. fire gange så meget varme. Derfor bliver det varmere, når man lader hurtigt. Bliver det alt for varmt, kan stofferne indeni begynde at gå i stykker og give endnu mere varme. Så kan batteriet gå i brand.',
    nørd: 'Varmen er P = I² · R (Joules lov). Over ca. 100 °C begynder lagene inde i batteriet at gå i stykker. Det giver mere varme og så endnu mere. Det kaldes "thermal runaway" (løbsk opvarmning). Ærligt talt: I et rigtigt batteri kommer der også lidt varme fra kemien, ikke kun fra modstanden.',
  },
  sorthul: {
    spørgsmål: 'Hvorfor er et sort hul sort?',
    svar: 'Inden for horisonten er tyngdekraften så stærk, at intet kan komme ud, ikke engang lys. Uden lys derfra kan vi ikke se noget: Det er sort. Det, der lyser omkring hullet, er varm gas uden for horisonten. Den sorte plet (skyggen) er større end selve horisonten, fordi lys, der kommer tæt forbi, bliver bøjet ind i hullet.',
  },
  stjerner: {
    spørgsmål: 'Hvorfor lyser stjernerne?',
    svar: 'Inde i midten af stjernen smelter brintkerner sammen til helium, og det frigør energi (fusion). Energien varmer hele stjernen op, og den varme overflade lyser, ligesom glødende jern. I Solen tager det titusinder af år, måske over 100.000 år, før energien fra midten når ud til overfladen. Energien i det sollys, du ser, blev altså frigjort i midten for længe siden, selvom lyset kun bruger ca. 8 minutter fra Solens overflade til Jorden.',
  },
  // Uranus og Neptun (UN5, 8. november 2026). Kilder: docs/fakta-solsystemet/del6-uranus-og-neptun.md, "Faktatjek UN5".
  uranusSol: {
    spørgsmål: 'Hvorfor får Uranus\' poler sol i 42 år?',
    svar: 'Uranus ligger på siden, og aksen peger hele tiden samme vej ud i rummet, mens Uranus kredser om Solen. På den ene side af banen peger nordpolen mod Solen, og et halvt omløb senere er det sydpolen. Et omløb tager 84 år, så hver pol har sol i ca. 42 år og mørke i ca. 42 år.',
    nørd: 'På Jorden sker det samme, men aksen hælder kun ca. 23°. Derfor er det kun egnene tæt på polerne, der får midnatssol og mørketid.',
  },
  neptunStaa: {
    spørgsmål: 'Hvorfor kan man ikke stå på Neptun?',
    svar: 'Neptun har ingen fast overflade. Yderst er der luft af brint og helium. Jo dybere man kommer, jo tættere og varmere bliver den, og den går langsomt over i en varm, tæt væske af vand, ammoniak og metan. Der er intet sted at lande, og længe før ville trykket knuse et rumskib.',
  },
  // Venus (V5, 17. november 2026). Kilder: docs/fakta-solsystemet/del7-venus.md, afsnit 12, og Fables tjek E18 (afsnit
  // 5 og 6). Merkur: NASA (op til 430 °C om dagen, ca. −180 °C om natten, del 8). Drejningen: Wikipedia "Venus" (Solens
  // tidevand og varmen i den tykke luft, døgnet svinger op til 20 minutter). Livet: Hallsworth m.fl. 2021 (dråberne er
  // ca. 100 gange for tørre), fosfinen Greaves m.fl. 2020 mod Cordiner m.fl. 2022 (ikke afgjort, E18)
  venusMerkur: {
    spørgsmål: 'Hvorfor er Venus varmere end Merkur?',
    svar: 'Merkur har næsten ingen luft. Solsiden bliver op til ca. 430 °C, men varmen stråler lige ud i rummet igen, så natsiden falder til ca. −180 °C. Venus har en tyk luft af kuldioxid, der holder på varmen og fører den rundt om hele planeten. Derfor er der ca. 464 °C overalt, både dag og nat.',
  },
  venusBaglaens: {
    spørgsmål: 'Hvorfor drejer Venus baglæns?',
    svar: 'Det ved man ikke sikkert. Måske fik Venus et stort stød, da den var ung. Mange forskere tror, at Solens tyngde og Solens varme i den tykke luft har bremset og ændret drejningen gennem milliarder af år, til den blev, som den er nu.',
    nørd: 'Luften skubber stadig: Et døgn på Venus kan blive op til ca. 20 minutter længere eller kortere.',
  },
  venusLiv: {
    spørgsmål: 'Kan der være liv i skyerne?',
    svar: 'Ca. 50-60 km oppe er temperaturen og trykket ikke langt fra Jordens. Derfor har nogle forskere spurgt, om mikrober kunne leve i skydråberne. Men dråberne er stærk svovlsyre og ca. hundrede gange for tørre til alt liv, vi kender. I 2020 mente et hold at have fundet gassen fosfin, som på Jorden mest laves af liv. Andre fandt den ikke i de samme målinger, og striden er ikke slut.',
    nørd: 'Fosfin findes også i Jupiters og Saturns luft, hvor den laves uden liv dybt nede i den varme luft. Et fund af en gas er derfor ikke et bevis for liv.',
  },
  // Rejsen i tid (T3). Kilder: docs/fakta-tid.md, afsnit 1, 2 og 8 (ét ton: 5,5·10²⁰ J ved 99 % og 6,3·10²¹ J ved 99,99 %,
  // verdens energiforbrug 592 EJ om året)
  lysfart: {
    spørgsmål: 'Hvorfor kan et rumskib aldrig nå lysets fart?',
    svar: 'Lysets fart er den samme for alle. Uanset hvor hurtigt du flyver, farer lyset stadig væk fra dig med lysets fart, så du kommer aldrig tættere på at indhente det. Og jo hurtigere du flyver, jo mere energi kræver det at komme bare lidt hurtigere. At få ét ton op på 99 % af lysets fart kræver næsten et års energi for hele verden, og 99,99 % ca. 10 år. For at nå helt op på lysets fart skulle der bruges uendelig meget energi.',
    nørd: 'Bevægelsesenergien er E = (γ − 1) · m · c². Når farten nærmer sig lysets, vokser γ uden grænse. Man hører tit, at man bliver tungere, jo hurtigere man flyver. Det er en gammeldags måde at sige det på, som de fleste fysikere undgår i dag. De siger i stedet, at massen er den samme, og at det er energien, der vokser.',
  },
  // Forløbet "Rejsen i tid" (vejen "Er det målt?", 13. november 2026). Fra emnet "Er det målt?" i js/kosmos/tid.js, som er
  // tjekket mod docs/fakta-tid.md (afsnit 11 og 12), og GPS fra Rumtid (ca. +45 og −7 µs pr. døgn, ca. 11,5 km).
  // Fælden: Hafele og Keatings ure mod vest gik hurtigere (docs/erfaringer/fakta-faelder.md).
  tidMaalt: {
    spørgsmål: 'Er det målt, at tiden går langsommere?',
    svar: 'Ja, mange gange. Myoner er små partikler, der bliver lavet ca. 15 km oppe i luften. De lever kun ca. 2 milliontedele sekund og burde gå i stykker højt oppe. Alligevel når mange af dem helt ned til jorden, fordi deres ure går langsommere set fra os.\n\nI 1971 fløj forskere fire atomure jorden rundt i passagerfly. Bagefter viste de en lidt anden tid end urene på jorden, næsten som regnet ud. Og GPS-satellitternes ure skal rettes, fordi tiden går anderledes deroppe. Ellers ville GPS\'en tage ca. 10 km fejl om dagen.',
    nørd: 'Frisch og Smith talte myonerne på toppen af et bjerg i USA og ved havet i begyndelsen af 1960\'erne. Hafele og Keating fløj urene først mod øst og så mod vest. Urene mod øst tabte ca. 59 milliardtedele sekund, og dem mod vest vandt ca. 273, fordi Jorden selv drejer mod øst. I GPS\'en går urene hurtigere på grund af højden (tyngden er svagere deroppe) og langsommere på grund af farten. Mere står under "Er det målt?" i panelet.',
  },
  // Byttebørsen (Molekyler M1). Kilder: docs/fakta-molekyler.md, afsnit 1, 6 og 7.
  bytteKoster: {
    spørgsmål: 'Hvorfor koster det at flytte elektronen?',
    svar: 'Natriums kerne trækker i sin yderste elektron, så det koster energi at rive den løs. Chlor trækker også, så det giver energi tilbage, når det får elektronen. Men chlor giver kun godt to tredjedele tilbage af det, det kostede. To frie atomer taber altså ved at bytte. Gevinsten kommer bagefter, når Na⁺ og Cl⁻ trækker i hinanden.\n\nDerfor passer "atomer vil gerne have en fuld skal" ikke alene. Den fulde skal forklarer, hvilke ioner der bliver (Na⁺ og Cl⁻), men ikke hvorfor det sker.',
    næste: 'bytteBetaler',
    nørd: 'At rive elektronen løs koster 5,14 eV (elektronvolt). Det hedder ioniseringsenergien (NIST). Chlor giver 3,61 eV tilbage, og det hedder chlors elektronaffinitet. Forskellen er 1,53 eV. En elektronvolt er den energi, en elektron får af 1 volt. Det passer til atomer: Synligt lys har ca. 2-3 eV pr. lysglimt (foton).',
  },
  bytteBetaler: {
    spørgsmål: 'Hvad betaler så?',
    svar: 'Plus og minus trækker i hinanden. Jo tættere Na⁺ og Cl⁻ kommer, jo mere energi bliver frigjort. Når de ligger helt inde ved hinanden, har tiltrækningen givet næsten fire gange så meget, som der manglede. I et saltkorn har hver ion seks naboer med modsat ladning, så der bliver frigjort endnu mere.',
    nørd: 'Der manglede 1,53 eV. Ved ca. 9,4 Å har tiltrækningen betalt dem, og ved 2,36 Å, hvor parret ligger, har den givet ca. 5,8 eV. Så er parret 4,26 eV bedre stillet end de to frie atomer. I krystallen giver hvert par 8,15 eV (gitterenergien). Og parret kan kun blive sammen, hvis det kommer af med energien, fx ved at støde ind i et tredje atom.',
  },
  bytteIon: {
    spørgsmål: 'Hvad er en ion?',
    svar: 'Et atom har normalt lige mange protoner (plus) og elektroner (minus), så det er neutralt. Mister det en elektron, bliver det plusladet, og får det en ekstra, bliver det minusladet. Et atom med for få eller for mange elektroner hedder en ion. Natrium, der har mistet sin yderste elektron, skrives Na⁺, og chlor med en ekstra skrives Cl⁻. Protonerne i kernen ændrer sig ikke, så det er stadig natrium og chlor.',
  },
  // Byg et molekyle → "Del elektroner" (Molekyler M2a). Kilder: docs/fakta-molekyler/m2.md, afsnit 2-4.
  bygBinder: {
    spørgsmål: 'Hvorfor holder atomerne sammen?',
    svar: 'To atomer deler et par elektroner. Parret sidder mellem de to kerner, og begge kerner trækker i det. Derfor holder atomerne sammen. Det kaldes en kovalent binding.\n\nEt atom kan lave lige så mange bindinger, som det har elektroner uden partner: H én, O to, N tre og C fire. Deler to atomer to eller tre par, er det en dobbelt- eller tripelbinding.',
    nørd: 'Atomer i 2. række af det periodiske system (C, N og O) ender med 8 elektroner omkring sig, når man tæller de delte par med (oktetreglen). Hydrogen ender med 2. Det er en tommelfingerregel. Den passer på alle molekylerne her, men den kan ikke se, at oxygen-molekylet O₂ i virkeligheden har to elektroner uden partner. Og to H-atomer binder kun, når deres elektroner har modsat spin (en slags indbygget drejning). I ca. tre ud af fire møder skubber de hinanden væk.',
  },
  bygForm: {
    spørgsmål: 'Hvorfor er vand bøjet?',
    svar: 'Elektronparrene omkring et atom skubber hinanden så langt væk som muligt. Oxygen i vand har fire par: to bindinger til H og to frie par. Fire par stiller sig som hjørnerne i en tetraeder (en pyramide med trekanter på alle sider). De frie par skubber lidt hårdere end bindingerne, så vinklen mellem de to H bliver ca. 104,5° i stedet for 109,5°.\n\nI CO₂ har kulstof ingen frie par. De to bindinger skubber hinanden ud til hver sin side, så molekylet er lige.',
    nørd: 'Modellen hedder VSEPR (Valence Shell Electron Pair Repulsion: elektronpar i den yderste skal skubber hinanden). Den forklarer formen godt, men elektronparrene er ikke rigtige kugler. Den præcise forklaring kræver kvantemekanik.',
  },
  bygPolær: {
    spørgsmål: 'Hvorfor er nogle ender plus og andre minus?',
    svar: 'Nogle atomer trækker hårdere i de delte elektroner end andre. Det kaldes elektronegativitet. Oxygen trækker hårdere end hydrogen, så i vand ligger de delte par tættest på oxygen. Oxygen-enden bliver lidt minus (δ−, sig "delta minus"), og H-enderne bliver lidt plus (δ+).\n\nEt molekyle er polært, når det har en plus-ende og en minus-ende. I CO₂ trækker de to oxygen lige hårdt, men hver sin vej, så trækkene ophæver hinanden, og CO₂ er ikke polært. Slå "Pile" til for at se trækket.',
    nørd: 'Spillet bruger Paulings tal for elektronegativiteten: H 2,20, C 2,55, N 3,04, O 3,44 og Cl 3,16. Er forskellen mellem to atomer mindst 0,4, får bindingen farver og en pil. C–H har kun 0,35, så den regnes som upolær. Pilene er længere, jo større forskellen er, og molekylets pil er bindingernes pile lagt sammen.',
  },
  // Oxygens elektroner (8. november 2026). Kilder: docs/fakta-hvorfor.md, afsnit 17-19.
  bygUdenPartner: {
    spørgsmål: 'Hvorfor har oxygen to elektroner uden partner?',
    svar: 'Oxygen har 6 elektroner i sin yderste skal. Skallen har 4 pladser, og hver plads kan rumme 2 elektroner. Elektronerne sætter sig først én på hver plads og deler kun plads, når der ikke er flere tomme. Så bliver de 6 til 2 par og 2 alene, og det er de 2 alene, der kan lave par med elektroner fra andre atomer.\n\nDe 2 uden partner er altså en del af de 6, ikke nogen ekstra. Nitrogen har 5 (1 par og 3 alene), chlor har 7 (3 par og 1 alene), og hydrogen har 1.',
    næste: 'bygOxygenAndre',
    nørd: 'Sådan har atomet mindst energi (Hunds regel). Lærebøger forklarede det længe med, at elektronerne skubber mindre til hinanden, når de sidder hver for sig. Udregninger siden 1970\'erne viser, at grunden mest er en anden: Elektroner hver for sig skygger mindre for kernen, så den trækker hårdere i dem. Kulstof snyder lidt på tegningen: Alene har det kun 2 uden partner, men når det binder, bruger det også sin tomme plads, så det kan lave 4 bindinger.',
  },
  bygOxygenAndre: {
    spørgsmål: 'Har oxygen altid 6 elektroner yderst?',
    svar: 'Et neutralt oxygen-atom har altid 6. I et molekyle som vand deler det 2 par med andre atomer, så det har 8 omkring sig, når man tæller de delte med. Sammen med et metal tager oxygen i stedet 2 elektroner og bliver til ionen O²⁻ med 8 helt for sig selv, fx i magnesiumoxid, det hvide pulver, der bliver tilbage, når magnesium brænder.\n\nFærre end 6 får det kun med meget energi, fx højt oppe i luften, hvor solens UV-lys river elektroner af. Et oxygen-atom helt alene finder man næsten ikke ved jorden, for det binder sig med det samme. Men over ca. 200 km\'s højde er enlige O-atomer det almindeligste, fordi UV-lyset deler O₂ i to, og det grønne og røde nordlys kommer fra dem.',
    næste: 'bygO2',
  },
  bygO2: {
    spørgsmål: 'Hvad sker der med elektronerne i O₂?',
    svar: 'I prik-modellen lægger hvert oxygen sine 2 elektroner uden partner ind i midten. Så deler de 2 par, og det er en dobbeltbinding. Hvert oxygen har nu 2 frie par og 2 delte par, altså 8 elektroner omkring sig.\n\nMen her snyder modellen: Det rigtige O₂ har stadig 2 elektroner uden makker. De hører til hele molekylet, ikke til ét af atomerne. Man kan se det, fordi flydende oxygen (−183 °C koldt) hænger fast mellem polerne på en stærk magnet. Bindingen er alligevel lige så stærk som en dobbeltbinding.',
    nørd: 'Den rigtige forklaring bruger molekyleorbitaler: pladser til elektronerne, der hører til hele molekylet. De 2 sidste elektroner skal i to pladser, der er lige gode, og ligesom i atomet sætter de sig én på hver (Hunds regel). Giver man O₂ ca. 1 eV energi, kan de 2 lægge sig i par på samme plads. Det hedder singlet-oxygen, og det er meget mere reaktivt end almindeligt oxygen.',
  },
  // Knaldgas (Molekyler M3). Kilder: docs/fakta-molekyler/m3.md og docs/fakta-molekyler.md, afsnit 4.
  knaldBakke: {
    spørgsmål: 'Hvorfor sker der ingenting uden gnist?',
    svar: 'Før der kan blive vand, skal nogle bindinger i stykker, og det koster energi. Ved stuetemperatur har et molekyle kun ca. 0,04 eV fart-energi, men det koster 4,5 eV at bryde H₂ og 5,2 eV at bryde O₂. De fleste stød er over 100 gange for svage, så molekylerne hopper bare fra hinanden.\n\nDet ligner bakken i Stjerneovnen: Protonerne skal være hurtige nok til at komme over bakken, før de kan smelte sammen. Her hedder bakken aktiveringsenergi. Derfor kan knaldgas stå i årevis uden at brænde, men en lille gnist er nok til at starte den.',
    nørd: 'Den mindste gnist, der kan tænde knaldgas, har kun ca. 0,007 millijoule (hydrogen i luft ca. 0,02). Den varmer en bitte lille sky af gas så meget op, at nogle bindinger går i stykker. Resten klarer kæden selv, for de næste trin har meget lavere bakker.',
  },
  knaldKæde: {
    spørgsmål: 'Hvorfor bliver det til en kædereaktion?',
    svar: 'Gnisten river et H₂ over i to frie H-atomer. De er radikaler: De har en elektron uden partner (den blinker), og de river let andre molekyler over. Når et radikal reagerer, kommer der et nyt radikal ud. Ved H + O₂ → OH + O kommer der endda to ud, for O har to elektroner uden partner. Så vokser antallet som en lavine, og derfor eksploderer knaldgas.\n\nDet ligner kædereaktionen i Reaktoren, hvor én neutron kan give flere nye. Her er det radikaler i stedet for neutroner.',
    nørd: 'Kæden i spillet: H + O₂ → OH + O, O + H₂ → OH + H og OH + H₂ → H₂O + H. Til sidst sætter H og OH sig sammen til vand. Lægger man trinene sammen (det sidste to gange), bliver ét H-atom til tre, og der dannes to vandmolekyler. Den rigtige reaktion har ca. 20 trin, fx også med HO₂ og H₂O₂.',
  },
  knaldVarme: {
    spørgsmål: 'Hvor kommer varmen fra?',
    svar: 'Det koster energi at bryde en binding, og man får energi, når en ny bliver lavet. Bindingerne i vand er stærkere end dem i H₂ og O₂, så man får mere tilbage, end man betalte: 10,0 eV for de fire vandmolekyler, ca. 2,5 eV for hvert. Det bliver til fart, og fart er varme.\n\nMange tror, at energien sidder i bindingerne og kommer ud, når de går i stykker. Det er omvendt: At bryde en binding koster altid. Energien kommer, når de nye, stærkere bindinger bliver lavet.',
    nørd: 'Kemikere regner i kJ pr. mol (et mol er ca. 6 · 10²³ molekyler): 2 H₂ + O₂ → 2 H₂O giver 483,6 kJ, når vandet er damp. Regner man med en tabel over bindinger, får man ca. 480-486 kJ, fordi tabellens tal er gennemsnit over mange molekyler. Uanset hvilken vej kæden går, ender forskellen på det samme (Hess\' lov).',
  },
  // Hvor kom Jordens vand fra? (Molekyler M4). Kilder: docs/fakta-molekyler.md, afsnit 5.
  bygJordensVand: {
    spørgsmål: 'Hvor kom Jordens vand fra?',
    svar: 'Det ved man ikke helt sikkert, men der er gode spor.\n\nMeget af vandet blev nok lavet, før Solen fandtes. I kolde skyer af gas og støv i rummet (ca. −260 °C) sætter H-atomer sig på O-atomer på små iskolde støvkorn, og de bliver til vand. En udregning tyder på, at op til halvdelen af havenes vand kan være ældre end Solen.\n\nVandet kom nok mest til Jorden med de sten, den blev bygget af, og med asteroider. Kometer bidrog nok mindre, men hvor meget, er forskerne stadig uenige om.',
    nørd: 'Forskerne sammenligner, hvor meget tungt hydrogen (deuterium, med en neutron i kernen) der er i vandet. I havet er det ca. 1 ud af 6.400 H-atomer. Prøver fra asteroiden Ryugu ligner havet. Kometen 67P så først ud til at have ca. 3 gange så meget, men en ny gennemregning i 2024 fandt, at støv havde trukket tallet op. Prøven fra asteroiden Bennu indeholdt endda køkkensalt fra fordampet saltvand.',
    link: { tekst: 'Se en stjerne blive født i Kosmos ›', handling: () => import('../faenomenskaerm.js').then((m) => m.åbnFænomen('kosmos', 'stjernefoedsel')) },
  },
  // Hvad holder DNA-stigen sammen? (Liv L1). Kilder: docs/fakta-liv/dna-stigen.md, afsnit 1 (Yakovchuk m.fl. 2006, OpenStax 2-1 og 14-2).
  livSammen: {
    spørgsmål: 'Hvad holder stigen sammen?',
    svar: 'Man skulle tro, det var hydrogenbindingerne. Men baserne ligger stablet som mønter, og hver base klæber mest til dem over og under sig. Det er stablingen, der holder stigen sammen.\n\nHydrogenbindingerne afgør, hvem der passer sammen: A med T og G med C. De er svage, så stigen kan lynes op, når cellen skal kopiere den.',
    nørd: 'Et forsøg fra 2006 målte, hvor meget hvert par og hver stabling betyder. Stablingen giver næsten det hele. G–C-parret giver næsten intet ekstra, og A–T endda en lille smule minus, fordi baserne ellers ville binde sig til vandet omkring dem i stedet (Yakovchuk, Protozanova og Frank-Kamenetskii 2006).',
  },
  // Liv L2. Kilder: OpenStax Biology 2e 3-4 (formen, 147 aminosyrer, de lange tråde og seglen) og
  // docs/fakta-liv/dna-opskriften.md (GAG → GTG, malaria: Hedrick 2011)
  livSegl: {
    spørgsmål: 'Hvorfor kan ét forkert bogstav give en sygdom?',
    svar: 'Rækkefølgen af aminosyrerne bestemmer, hvordan kæden folder sig, og formen bestemmer, hvad proteinet kan. Ved seglcelleanæmi er kun ét bogstav i genet HBB skiftet: GAG er blevet til GTG. Så sidder der valin, der skyr vand, i stedet for glutaminsyre, der er minusladet.\n\nHar man ændringen fra både sin mor og sin far, klumper hæmoglobinet sammen i lange tråde, når det har afleveret ilten. De røde blodlegemer bliver krumme som en segl og kan sætte sig fast i de små blodårer.',
    nørd: 'Har man det ændrede gen kun fra den ene forælder, er man bærer og bliver normalt ikke syg (genome.gov). Bærere får sjældnere den farlige form af malaria (Hedrick 2011), men de kan godt få malaria.',
    næste: 'livMenneske', // L4: "Derfor er genet almindeligt, hvor der er meget malaria" står nu i kort 4
  },
  // Liv L4, kort 4 og 5 (docs/drejebog-liv.md, afsnit 5). Kort 4: Hedrick 2011, Heredity 107:283-304, PMC3182497
  // ("provides resistance to malaria in AS heterozygotes", "the classic example of heterozygote advantage"), Wikipedia
  // "Sickle cell disease" (bærere "less likely to suffer from severe symptoms"). Fælde 11: ikke "får ikke malaria".
  livMenneske: {
    spørgsmål: 'Sker det også hos mennesker?',
    svar: 'Ja. Ét skiftet bogstav i genet HBB (ord 7) giver seglcelleanæmi, hvis man har det fra begge forældre. Har man det kun fra den ene, bliver man sjældnere alvorligt syg af malaria.\n\nHvor der er meget malaria, har bærerne derfor fået flere børn, der overlevede, og ændringen er blevet almindelig dér. Det er naturligt udvalg.',
    nørd: 'Det er det kendteste eksempel på, at det er en fordel at have en ændring fra kun den ene forælder (Hedrick 2011). Derfor bliver den hverken væk eller almindelig hos alle: Fordelen hos bærerne og sygdommen hos dem, der har den dobbelt, holder hinanden i balance.',
  },
  // Kort 5: Juhl m.fl. 2018, Nutrients 10:1041, PMC6115808 (20.416 voksne danskere, LCT-13910 i MCM6, 6 % kan ikke tåle
  // mælk som voksne). Itan m.fl. 2009 og Evershed m.fl. 2022, PMC7615474 (den ældste kendte bærer ca. 4.700-4.600 f.Kr.,
  // almindelig ca. 2.000 f.Kr., "only weakly associated with milk consumption"). Fælde 10: ikke "for 7.500-10.000 år siden".
  livMaelk: {
    spørgsmål: 'Hvorfor kan de fleste danskere tåle mælk?',
    svar: 'Næsten alle små børn kan fordøje sukkeret i mælk. Hos mange mennesker slukker genet for det, når de bliver større. Ca. 94 af 100 voksne danskere har en ændring i en "kontakt" ved genet, så det bliver ved med at være tændt.\n\nDen ældste kendte person med ændringen levede for ca. 6.700 år siden, og den blev almindelig i Europa for ca. 4.000 år siden. Forskerne er uenige om, hvorfor den hjalp så meget.',
    nørd: 'Genet hedder LCT og laver enzymet laktase, der klipper mælkesukker over. Kontakten sidder 13.910 bogstaver før genet, inde i nabogenet MCM6 (Juhl og kolleger 2018, 20.416 voksne danskere). At folk drak mælk, forklarer ikke alene, hvorfor ændringen bredte sig: I en stor undersøgelse fra Storbritannien hang den kun svagt sammen med, hvor meget mælk folk drikker (Evershed og kolleger 2022).',
  },
  // Liv L5, de fire kort i delen Begyndelsen (docs/drejebog-liv.md, afsnit 4). Kilder: docs/fakta-liv/begyndelsen.md.
  // Kort 1: Gibson m.fl., Science 329:52-56 (2010), "an existing cell" (Wikipedia "Mycoplasma laboratorium", læst 18.
  // november 2026). Skriv "en bakterie, der levede i forvejen", ikke "en tømt celle" (Fable E5). JCVI-syn3.0: Hutchison m.fl.
  // 2016, 473 gener, 149 ukendte. Pasteur "omkring 1860". Fælde 1: ikke "kunstigt liv".
  begLavet: {
    spørgsmål: 'Har nogen lavet liv?',
    svar: 'Nej. Ingen har lavet noget levende af stoffer uden liv.\n\nI 2010 byggede forskere hele DNA\'et til en bakterie, en kopi af en rigtig bakteries DNA, og satte det ind i en bakterie, der levede i forvejen. Den levede videre og delte sig med det byggede DNA. Det var en stor bedrift, men opskriften var kopieret, og cellen fandtes allerede.',
    nørd: 'Forskerne var Daniel Gibson, Craig Venter og kolleger. I 2016 lavede de en bakterie med kun 473 gener, og om 149 af dem vidste ingen, hvad de gjorde. Omkring 1860 viste Louis Pasteur, at der ikke opstår liv af sig selv i en kolbe med kogt suppe. Han viste ikke, at det aldrig er sket.',
  },
  // Kort 2: NASA 29. januar 2025 ("14 of the 20", "all five nucleobases", "do not show evidence for life itself") og 2.
  // december 2025 (ribose). Murchison ca. 70 aminosyrer (Schmitt-Kopplin 2010), Deamer 1985. 67P: ESA 2016 (glycin). Fælde 9.
  begRummet: {
    spørgsmål: 'Kom livet fra rummet?',
    svar: 'Måske nogle af byggestenene. I prøverne fra asteroiden Bennu, som en rumsonde hentede til Jorden, har forskerne fundet 14 af de 20 aminosyrer, livet bruger, og alle fem baser fra DNA og RNA.\n\nMen der er ingen tegn på liv i prøverne. Og kom selve livet fra rummet, flytter spørgsmålet bare: Hvordan begyndte det så dér?',
    nørd: 'Meteoritten Murchison, der faldt i Australien i 1969, har ca. 70 slags aminosyrer, og fedtagtige stoffer fra den laver bobler i vand (Deamer 1985). Bennu har også sukkeret ribose, som RNA er bygget af. Rumsonden Rosetta fandt glycin, den enkleste aminosyre, ved kometen 67P (2016). NASA: Det viser, at livets byggesten fandtes mange steder i det unge solsystem. Hvor meget de betød for livet, ved ingen.',
    næste: 'livSpor', // L6: kortet ved Cheyava Falls på Mars
  },
  // Kort 3: Herschy m.fl. 2014 (PMC4247476, "Chemiosmotic coupling is universal", vældet pH 10-11, havet pH 5-7), Russell 1997
  // og Martin og Russell 2003 (via Wikipedia). Patel m.fl. 2015 ("driven by ultraviolet light"), tørring og
  // vædning (Wikipedia "Abiogenesis"), fortynding i havet ("strong dilution by seawater"). Darwin 1871. Alvin 1977.
  begHvor: {
    spørgsmål: 'Skete det i en dam eller på havbunden?',
    svar: 'Det ved ingen. Nogle forskere tror på varme kilder på havbunden: Her møder varmt vand fra undergrunden havvandet, og forskellen i surhed mellem dem ligner den, alle celler bruger til at få energi.\n\nAndre tror på damme på land, der tørrer ud og bliver våde igen. Her kan sollys drive den kemi, der laver RNA\'s byggesten, og stofferne bliver ikke fortyndet i et helt hav.',
    nørd: 'Charles Darwin skrev i et brev i 1871 om en "lille varm dam". Varme kilder på havbunden blev først set i 1977 fra ubåden Alvin. Idéen om kilderne er bl.a. Michael Russells og William Martins (fra 1997), og forsøget med sollys er fra John Sutherlands gruppe (Patel og kolleger 2015).',
  },
  // Kort 4, døgnuret: Jorden 4,54 mia. år (USGS). De ældste spor, de fleste godtager: Dresser-formationen, ca. 3,48 mia. år
  // (Wikipedia "Earliest known life forms"). (4,54 − 3,48) / 4,54 × 24 t = 5,60 t = kl. 5.36. Mennesket: 315.000 år
  // (Richter m.fl. 2017) / 4,54 mia. × 86.400 s = 6,0 s. Isua omstridt (Allwood 2018), LUCA 3,94-4,52 (Moody 2024).
  begHvornaar: {
    spørgsmål: 'Hvornår skete det?',
    svar: 'Forestil dig, at Jordens historie er ét døgn, og at Jorden bliver dannet ved midnat. Senest kl. 5.36 om morgenen er der liv: Så gamle er de ældste spor, de fleste forskere godtager, ca. 3,5 milliarder år.\n\nMennesket kommer ca. 6 sekunder før midnat. Måske begyndte livet meget før kl. 5.36, men der er næsten ingen sten tilbage fra den første tid.',
    nørd: 'Jorden er ca. 4,54 milliarder år. Sporene er lag, som mikrober har bygget (stromatolitter), i ca. 3,48 milliarder år gamle sten i Australien. Ældre spor fra Grønland (ca. 3,7 milliarder år) er omstridte. Den fælles forfader til alt liv i dag levede måske for ca. 4,2 milliarder år siden, men skønnene spænder fra ca. 3,9 til 4,5, og den var allerede en rigtig celle. De ældste kendte mennesker af vores art er ca. 315.000 år gamle.',
  },
  // Liv L6, kortet ved Cheyava Falls på Mars (docs/drejebog-liv.md, afsnit 6). Kilder: docs/fakta-liv/rummet.md, afsnit 1 og 2.
  // CoLD: Green m.fl., Nature 598:575-579 (2021), arXiv:2107.10975 (figur 1, trinene; Perseverance "could gather evidence
  // that reaches CoLD Level 3", prøver på Jorden "Level 6 or higher"; ALH84001 "could be argued to have identified" "Level 1 ... Level 2 ... Level 3", "the
  // present consensus is that the features ... are probably not indicative of life"). Trin 1: NASA's billedtekst 25. juli
  // 2024. Trin 3: Hurowitz til Planetary Society 1. okt. 2025. ALH84001: McKay m.fl., Science 273:924-930, annonceret 6.
  // aug. 1996 af et hold ledet af forskere fra NASA, Clintons tale, og Steele m.fl. 2022 ("serpentinization and carbonation",
  // Wikipedia "Allan Hills 84001", læst 18. november 2026). Fælderne: "muligt biospor", ikke "bevist" eller "modbevist".
  livSpor: {
    spørgsmål: 'Hvor sikkert er et spor?',
    svar: 'Forskerne har en skala med syv trin. På trin 1 har man målt noget, som liv kan lave. Højere oppe er forurening fra Jorden og de kendte veje uden liv udelukket, og øverst har nye målinger bekræftet det.\n\nNASA kaldte stenen Cheyava Falls på Mars trin 1 i 2024, og hovedforfatteren af artiklen om den mener selv, at den er på trin 3. Pletterne er et muligt biospor (et spor efter liv), ikke et bevis.',
    nørd: 'Skalaen hedder CoLD (Green og kolleger 2021). Trinene: 1 et signal, som liv kan give. 2 Det er ikke forurening. 3 Liv kunne lave signalet netop dér. 4 Ingen kendt vej uden liv passer dér. 5 Et andet spor, der ikke afhænger af det første. 6 Nye forklaringer, som andre kommer med bagefter, er også udelukket. 7 Nye målinger viser det, man forudsagde, at livet ville gøre. Skalaens forfattere regnede med, at Perseverance kan nå trin 3, og at en prøve på Jorden kan nå trin 6 eller højere. Et højt trin er ikke det samme som liv: I 1996 mente et hold med forskere fra NASA, at meteoritten ALH84001 fra Mars havde spor af liv, og USA\'s præsident holdt en tale om det. I dag mener de fleste, at sporene nok ikke er liv, og i 2022 kom en undersøgelse frem til, at det organiske stof i den blev lavet af vand og sten. Alligevel mener skalaens forfattere, at man kan sige, at ALH84001 nåede trin 1-3.',
  },
  // Liv L3, kort 1-3 (docs/drejebog-liv.md, afsnit 5). Kilder: docs/fakta-liv/dna-opskriften.md, afsnit 4 og 5.
  // Kort 1: Nature 171 (25. april 1953), Foto 51 (Gosling under Franklin, 2. maj 1952), Wilkins viste det til Watson uden
  // hendes viden, Cobb og Comfort 2023 ("an equal player", seks ugers modelbygning og MRC-rapporten), nobelprize.org (1962,
  // og reglen om døde fra 1974, før det to gange), Franklin død 16. april 1958, 37 år. Fælde 7 og 14.
  livStigen: {
    spørgsmål: 'Hvem fandt stigen?',
    svar: 'I 1953 byggede James Watson og Francis Crick modellen af stigen. De brugte Rosalind Franklins målinger uden at spørge hende. Hun var en ligeværdig del af arbejdet.\n\nWatson, Crick og Maurice Wilkins fik Nobelprisen i 1962. Franklin døde i 1958, kun 37 år.',
    nørd: 'I 1952 tog Franklins studerende Raymond Gosling et røntgenbillede af DNA, »Foto 51«. Wilkins viste det til Watson uden Franklins viden. Men billedet viste mest, at DNA er en spiral. Svaret kom af seks ugers modelbygning og især af en rapport med hendes målinger (Cobb og Comfort 2023). Hendes egen artikel stod i samme nummer af tidsskriftet Nature som Watsons og Cricks. Nobelprisen gives ikke til en, der er død. Reglen blev først skrevet ind i 1974, men før det var det kun sket to gange.',
  },
  // Kort 2: 46 kromosomer, 23 fra hver. Ca. 70 nye: Jónsson m.fl. 2017 (108.778 / 1.548 = 70,3, 1,51 flere pr. år fra
  // faren og 0,37 fra moren). Under 1 pr. 10⁹: 6,1 · 10⁹ · 10⁻⁹ ≈ 6 pr. kopi (fælden i E10). Antallet af delinger står kun
  // på Wikipedia ("Paternal age effect": ca. 23 om året efter puberteten, Malaspina m.fl. 2015, ikke åbnet), så uden tal.
  livForaeldre: {
    spørgsmål: 'Hvorfor ligner jeg mine forældre, men ikke helt?',
    svar: 'Af de 46 tråde (kromosomerne) i dine celler kom 23 fra din mor og 23 fra din far, så du har opskrifter fra dem begge. Hver af dem har selv to sæt og gav dig en ny blanding af dem. Derfor ligner søskende hinanden, men ikke helt.\n\nOg du har ca. 70 nye bogstaver, som ingen af dine forældre har.',
    nørd: 'Hvordan kan det blive til 70? Når cellen kopierer, bliver under 1 bogstav pr. milliard forkert, så én kopi af alle 6,1 milliarder giver kun nogle få. Men cellerne, der blev til sæd og æg, har delt sig mange gange, før du blev til, og jo ældre faren er, jo flere. Og nogle er skader, ikke kopifejl. For hvert år, faren er ældre, får barnet ca. 1,5 flere nye fra ham og ca. 0,4 fra moren (en undersøgelse af 1.548 islændinge og deres forældre, Jónsson og kolleger 2017).',
  },
  // Kort 3: Meselson og Stahl 1958, PNAS 44(7):671-682 (OpenStax 14-3: "one parental or old strand and one new strand").
  // ¹⁵N har 8 neutroner, ¹⁴N 7. Båndene i cæsiumklorid i en centrifuge.
  livKopi: {
    spørgsmål: 'Hvordan ved vi, at hver kopi har en gammel og en ny side?',
    svar: 'I 1958 gav Matthew Meselson og Franklin Stahl bakterier tungt nitrogen, så deres DNA blev tungt. Så fik de almindeligt nitrogen. Efter én deling var alt DNA midt imellem: én tung side og én let. Efter to delinger var halvdelen midt imellem og halvdelen let.\n\nSådan må det blive, når hver kopi får én gammel side og én ny.',
    nørd: 'Tungt nitrogen har en ekstra neutron i kernen (¹⁵N i stedet for ¹⁴N). DNA\'et blev slynget rundt i en centrifuge i en tung saltopløsning (cæsiumklorid), så det lagde sig i et bånd efter, hvor tungt det var. Var den gamle stige blevet hel og den nye helt ny, ville der efter én deling have været et tungt og et let bånd, men ingen midt imellem.',
  },
  // Hvordan ved vi det? Ved Saturns ringe (Opdagelserne H3, 17. november 2026). Kilder: docs/fakta-videnskabsfolk/huygens.md
  // afsnit 3 (s. 46: armene i én lige linje, s. 47: alle Saturns mærkelige former), Wikipedia "Rings of Saturn" (Maxwell
  // 1859, Keeler og Belopolsky 1895, Pioneer 11 september 1979, Voyager 1 november 1980, Voyager 2 august 1981, Cassini i
  // kredsløb juli 2004) og "James Edward Keeler" (Dopplerforskydningen efter banernes fart). Cassinis styrt 15. september
  // 2017 (fakta-solsystemet). Ikke "Huygens så, at ringen er is og sten": Han troede, den var fast (s. 48)
  saturnRing: {
    spørgsmål: 'Hvordan ved vi, at det er en ring?',
    svar: 'I 1655 så Christiaan Huygens, at Saturns "arme" nat efter nat stak ud i én lige linje. Han regnede ud, at en tynd, flad ring rundt om Saturn kunne forklare alle de mærkelige tegninger, også når armene forsvandt, fordi vi så ringen fra kanten. Han skrev det i 1659.\n\nHuygens troede, ringen var fast, men i 1859 viste James Clerk Maxwell, at den må bestå af utallige små stykker, der hver kredser for sig. Det blev målt i 1895, og siden 1979 har rumsonder fløjet helt tæt på.',
    nørd: 'I 1895 målte James Keeler, hvor meget lyset fra ringen var forskudt i farve (Dopplereffekten). Lyset fra den inderste del var forskudt mest, så den inderste del kom hurtigst rundt, ligesom små måner. En fast ring drejer som et hjul, og så går den yderste del hurtigst. Pioneer 11 fløj forbi i 1979, Voyager 1 og 2 i 1980 og 1981, og Cassini kredsede om Saturn fra 2004 til 2017.',
  },
  // Ild, laboratoriet "Bordet" (docs/drejebog-ild.md, afsnit 5). Kilder: docs/fakta-ild.md afsnit 3, 4 og 8 og
  // docs/fakta-ild/faktatjek-bordet.md. Ionerne: ca. 10¹⁰ pr. cm³ i en flamme af kulbrinter og luft (op til ca. 10¹²
  // de tætteste steder) mod ca. 4 · 10¹⁸ molekyler pr. cm³ ved 1.700 K. Solen: 26,7 MeV pr. helium mod ca. 8 eV pr. metan.
  // Stearinlyset 77 W (Hamins m.fl., NIST 2005), et menneske i ro ca. 100 W (2.000 kcal i døgnet er 97 W).
  ildPlasma: {
    spørgsmål: 'Er ild plasma?',
    svar: 'Nej, ikke flammen fra et stearinlys. Den er varm gas, der reagerer. Nogle få molekyler bliver til ioner i reaktionen, så en flamme kan lede en lillebitte smule strøm. Men typisk er kun ca. ét molekyle ud af en milliard en ion, og det er alt for få til at kalde det plasma.',
    nørd: 'Ionerne kommer fra kemien, ikke fra varmen: Når to stykker mødes i flammen, kan de smide en elektron (CH + O → CHO⁺ + e⁻). 1.400 °C er alt for koldt til, at varmen selv kan slå elektroner løs. Det kræver mange tusind grader, som i et lyn. Et stærkt elektrisk felt kan bøje en flamme, netop fordi den har nogle ioner.',
  },
  ildSolen: {
    spørgsmål: 'Brænder Solen?',
    svar: 'Ikke som ild. I ild bytter atomerne partnere, men det er de samme atomer bagefter. I Solen smelter atomkerner sammen og bliver til et nyt grundstof: Hydrogen bliver til helium. Det hedder fusion, og hver gang giver det millioner af gange mere energi, end når et molekyle brænder. Man kan prøve det i Stjerneovnen.',
    nørd: 'Når fire hydrogenkerner bliver til én heliumkerne i Solen, kommer der i alt ca. 27 MeV ud. Når ét molekyle metan brænder, kommer der ca. 8 eV ud. Det er over tre millioner gange mindre. Astronomer siger tit, at stjerner "brænder" hydrogen, men de mener fusion.',
  },
  // Vej 2 efter turen "Hvad brænder egentlig?" (til forløb 2 findes). Kilder: W "Candle", W "Flame", Faraday 1861.
  ildGul: {
    spørgsmål: 'Hvorfor er flammen gul?',
    svar: 'Det gule lys er glødende sod: bittesmå korn af kulstof inde i flammen, hvor der er for lidt oxygen til, at alt kan brænde helt. Kornene bliver så varme, at de lyser, som tråden i en gammel glødepære. Ude i kanten møder de oxygen og brænder til CO₂. Det blå lys forneden kommer fra selve reaktionen.',
    nørd: 'Prøv skeen i den gule del på bordet: Den bliver sort af sod. Og gasbrænderen brænder blåt med luft nok, fordi der slet ikke bliver dannet sod.',
  },
  ildVarmer: {
    spørgsmål: 'Varmer du som et lys?',
    svar: 'Lidt mere. Et stearinlys giver ca. 80 watt varme, og en person, der sidder stille, giver ca. 100 watt. Regnskabet er det samme: Brændstof og oxygen bliver til CO₂ og vand. Men i kroppen sker det i mange små trin ved 37 °C og uden flamme.',
    nørd: 'Maden i et døgn (ca. 2.000 kilokalorier) svarer til ca. 97 watt hele døgnet. Et stearinlys bruger ca. 0,1 gram stearin i minuttet. Det giver kun ca. 13 lumen lys, næsten hundrede gange mindre lys pr. watt end en gammel glødepære. Det meste er varme.',
  },
  // Hvornår er noget opdaget? (Gåderne G3, fælles for kortene). Kilder: docs/fakta-gaader.md, "Fælles for alle kortene".
  // 5σ ensidet: p = ½·erfc(5/√2) = 2,87 · 10⁻⁷, altså 1 ud af 3,49 millioner. log₂(3,49 · 10⁶) = 21,7, så ca. 22 gange
  // plat i træk (2²² = 4,19 millioner). 3σ: 1 ud af 741 (ca. 10 gange plat). LIGO: "greater than 5.1σ" (arXiv:1602.03837).
  // OPERA 2011: "six sigma", og "A link from a GPS receiver to the OPERA master clock was loose" (Wikipedia
  // "2011 OPERA faster-than-light neutrino anomaly"). LZ 2,6σ (arXiv:2609.02823), DMS 3σ (Madhusudhan 2025, ikke
  // bekræftet), DESI DR2 2,8-4,2σ (arXiv:2503.14738).
  opdaget: {
    spørgsmål: 'Hvornår er noget opdaget?',
    svar: 'Målinger svinger altid lidt tilfældigt, og et tilfældigt udsving kan ligne et fund. Derfor regner forskerne ud, hvor tit tilfældet alene ville give et signal, der er så stort. Det måles i sigma. Ved 3 sigma siger fysikerne kun »tegn på«, og først ved 5 sigma siger de »opdaget«. 5 sigma er lige så sjældent som at slå plat ca. 22 gange i træk med en ærlig mønt.\n\nLige nu er der flere spændende signaler under grænsen, fx den ene hændelse i LZ (2,6 sigma). De fleste små signaler forsvinder igen, når der bliver målt mere.',
    nørd: '5 sigma betyder, at tilfældet alene kun giver et så stort signal ca. 1 gang ud af 3,5 millioner. Det betyder ikke, at fundet er helt sikkert: En fejl i udstyret tæller ikke med. I 2011 målte forsøget OPERA neutrinoer, der så ud til at være hurtigere end lyset, med 6 sigma, men en forbindelse til forsøgets ur sad løst. Andre signaler under grænsen lige nu: gassen DMS på planeten K2-18b (3 sigma, ikke bekræftet) og mørk energi, der måske ændrer sig (2,8-4,2 sigma). Tyngdebølgerne i 2015 var over 5,1 sigma.',
  },
  // Kvantefysik, bænken med dobbeltspalten (20. november 2026). Kilder: docs/fakta-kvantefysik.md, afsnit 1 (Young,
  // de Broglie, Davisson-Germer og Thomson 1927, Jönsson 1961, Merli, Missiroli og Pozzi 1974, Tonomura m.fl. 1989, Bach
  // m.fl. 2013, Hackermüller m.fl. 2004 med C₇₀), afsnit 6 (dekohærens, SEP) og afsnit 7 (fælderne om bevidstheden og
  // usikkerhedsrelationen). C₇₀ er aflangt som en rugbybold (C₆₀ er fodbolden).
  // "To steder på én gang?" (22. november 2026, docs/plan-kvante-to-steder.md). Kilder i
  // docs/fakta-kvantefysik/faktatjek-to-steder.md: Grangier, Roger og Aspect (Europhys. Lett. 1, 173, 1986), Jacques m.fl.
  // med Aspect og Grangier (Eur. Phys. J. D 35, 561, 2005, arXiv:2011.12664: 23-32 sammenfald ud af ca. 100.000 fotoner,
  // fordi kilden en sjælden gang sendte mere end én), Winelands Nobelforelæsning (Monroe m.fl. 1996: 83 nm),
  // Nobelprisen 2012 (nobelprize.org), Kovachy m.fl. (Nature 528, 530, 2015: 54 cm) med kritikken fra Stamper-Kurn m.fl.
  // (arXiv:1607.01454, "consistent with, but does not prove") og Schrödinger (Naturwissenschaften 23, 807, 1935).
  kvanteToSteder: {
    spørgsmål: 'Er elektronen så to steder på én gang?',
    svar: 'Det siges tit, men ingen har nogensinde fundet en elektron to steder: Hver gang man kigger efter, finder man én hel elektron ét sted. Det, der går gennem begge sprækker, er bølgen, og den ses kun indirekte, på striberne. Fysikerne kalder det en superposition.\n\nI 1986 sendte tre forskere i Frankrig lys mod et halvgennemsigtigt spejl, én foton ad gangen og med en måler på hver vej. Målerne gav næsten aldrig udslag på samme tid, men de samme fotoner gav striber, når de to veje blev ført sammen igen.',
    nørd: 'I 2005 gentog Alain Aspect, Philippe Grangier og deres kolleger det med et glasprisme, der deler lyset i to veje næsten som to sprækker. Ud af ca. 100.000 fotoner gav begge målere kun udslag samtidig 23-32 gange, fordi lyskilden en sjælden gang sendte mere end én foton. Større ting kan også deles i to bølger: I 1996 delte David Winelands hold én ion i to bølger 83 nanometer fra hinanden, og Serge Haroches hold gjorde noget lignende med mikrobølger mellem to spejle. De fik Nobelprisen i 2012. I 2015 meldte Mark Kasevich\' hold, at atomer var delt i to bølger ca. 54 cm fra hinanden, men andre forskere mener ikke, at forsøget beviser det helt. I alle forsøgene ses superpositionen kun indirekte, som interferens, når de to dele mødes igen. Schrödingers kat, der skulle være både levende og død, fandt Erwin Schrödinger på i 1935 som en indvending, ikke som noget, han troede på.',
    næste: 'kvanteKigger',
    link: { tekst: 'Er den begge steder, før man kigger? Gåden ›', handling: () => import('../gaa.js').then((m) => m.åbnGåde('kvante')) },
  },
  kvanteKigger: {
    spørgsmål: 'Ved elektronen, at vi kigger?',
    svar: 'Nej. At måle betyder, at noget (lys, luft eller en måler) mærker, hvilken vej elektronen tog, også selvom intet menneske ser efter. Så er de mørke striber væk.\n\nI 2004 sendte forskere i Wien varme molekyler af 70 kulstofatomer gennem gitre med mange sprækker. Jo varmere molekylerne var, jo mere varmestråling sendte de ud, som røbede vejen, og jo svagere blev striberne.',
    nørd: 'Fysikerne kalder det dekohærens: Omgivelserne får hele tiden "besked" om, hvor store ting er, fra luften og lyset, der rammer dem. Derfor ser vi aldrig striber med en bold. Det forklarer, hvorfor hverdagen ser almindelig ud, men ikke helt, hvad der sker ved en måling. Det er der stadig flere bud på.',
  },
  kvanteHvordan: {
    spørgsmål: 'Hvordan ved vi det?',
    svar: 'I begyndelsen af 1800-tallet sendte Thomas Young lys gennem to sprækker og så striber. I 1924 foreslog Louis de Broglie, at også elektroner har en bølgelængde, og i 1927 blev det vist i forsøg.\n\nI 1974 sendte tre forskere i Bologna elektroner gennem en slags dobbeltspalte én ad gangen. I 1989 filmede Akira Tonomura og hans kolleger hos firmaet Hitachi, hvordan prikkerne blev til striber på ca. 20 minutter. Og i 2013 lukkede forskere i USA sprækkerne én ad gangen, ligesom du kan her.',
    nørd: 'Claus Jönsson i Tübingen sendte i 1961 elektroner gennem rigtige sprækker, mange ad gangen. I 1989 var "de to sprækker" en tråd, der var tyndere end en tusindedel af en millimeter: Elektronerne kunne gå på hver sin side af den. I 2013 var sprækkerne ca. 60 nanometer brede, ca. 1.000 gange smallere end et hår.',
  },
  kvanteUsikker: {
    spørgsmål: 'Hvorfor bliver bunken bredere, når sprækkerne er smallere?',
    svar: 'En bølge, der skal gennem en smal sprække, bliver klemt sammen på tværs. Så breder den sig mere bagefter. Jo mere præcist man ved, hvor elektronen gik igennem, jo mindre ved man om, hvilken retning den flyver. Det hedder usikkerhedsrelationen, og det skyldes ikke, at vi måler for groft: Ingen bølge kan både være samlet på ét sted og have én skarp retning.\n\nPrøv det: Gør sprækkerne smallere under "Flere indstillinger".',
    nørd: 'Werner Heisenberg skrev det i 1927: Usikkerheden på stedet gange usikkerheden på bevægelsesmængden er mindst ħ/2 (Δx · Δp ≥ ħ/2). Hans første forklaring var, at målingen skubber til partiklen. I dag ses det som en egenskab ved selve bølgen.',
  },
};
