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
};
