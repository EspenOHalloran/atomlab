// Ordforklaringer: korte forklaringer af fagord. Første gang et ord står i en tekst, kan man trykke på det (se js/ordforklaring.js).
// ord: overskriften i forklaringen. former: alle de måder, ordet står på i teksterne (små bogstaver, mellemrum er tilladt).
// Hold teksterne korte (2-3 sætninger) og i et sprog, en 13-årig forstår. Tal skal være tjekket (se docs/erfaringer.md, tjekliste B).
// mere: [[spørgsmål, svar], ...] står kun i Ordbogen ("Hvorfor?" og "Hvordan?", brugerens ønske 7. november 2026), ikke i boblerne.
// Boblen viser så et link "Mere i Ordbogen ›". Kilderne til mere står i docs/fakta-ordbog.md (PR B, 20 ord).
// tegning: en lille tegning i Ordbogen (se TEGNINGER i js/ordbog.js).

export const ORDBOG = [
  {
    id: 'neutrino', ord: 'Neutrino',
    former: ['neutrino', 'neutrinoen', 'neutrinoer', 'neutrinoerne'],
    // Neutrinoer fra Solen: ca. 6,5·10¹⁰ pr. cm² pr. sekund ved Jorden
    tekst: 'En bittelille partikel uden ladning, som næsten ikke vejer noget. Den reagerer næsten aldrig med noget og flyver lige gennem hele Jorden. Hvert sekund suser ca. 65 milliarder neutrinoer fra Solen gennem et område på størrelse med din tommelfingernegl (1 cm²).',
    // Kilder: docs/fakta-ordbog.md, "Neutrino"
    mere: [
      ['Hvordan kan man opdage noget, der flyver gennem alt?', 'Man bygger kæmpestore detektorer og venter. I Japan står Super-Kamiokande, en tank med 50.000 ton rent vand ca. 1 km nede i en mine. En sjælden gang rammer en neutrino en partikel i vandet, og så kommer der et svagt blåt lysglimt, som tusindvis af lysmålere ser. Dybt under jorden er detektoren skærmet mod den anden stråling fra rummet.'],
      ['Hvor kommer neutrinoerne fra?', 'De fleste, der rammer os, kommer fra fusionen i Solens midte: Hver gang fire protoner ender som en heliumkerne, flyver to neutrinoer ud. Atomkraftværker og radioaktive stoffer i Jorden sender antineutrinoer ud, og højt oppe i luften laver den kosmiske stråling neutrinoer. I 1987 fangede detektorerne ca. 25 neutrinoer fra en stjerne, der eksploderede i en nabogalakse.'],
    ],
  },
  {
    id: 'antineutrino', ord: 'Antineutrino',
    former: ['antineutrino', 'antineutrinoen', 'antineutrinoer', 'antineutrinoerne'],
    tekst: 'Neutrinoens antistof-tvilling. Den bliver skudt ud ved betahenfald, når en neutron bliver til en proton.',
  },
  {
    id: 'positron', ord: 'Positron',
    former: ['positron', 'positronen', 'positroner', 'positronerne'],
    tekst: 'Elektronens antistof-tvilling: lige så let som en elektron, men plusladet. Møder den en elektron, forsvinder de begge i et glimt af gammastråling.',
  },
  {
    id: 'antistof', ord: 'Antistof',
    former: ['antistof', 'antistoffet'],
    tekst: 'Stof lavet af antipartikler: tvillinger til de almindelige partikler med samme masse, men modsat ladning (fx positronen, en plusladet elektron). Også neutronen og neutrinoen har en antitvilling. Mødes stof og antistof, bliver begge til stråling.',
    // Kilder: docs/fakta-ordbog.md, "Antistof"
    mere: [
      ['Hvorfor er der næsten ikke noget antistof?', 'Det er et af fysikkens store ubesvarede spørgsmål. Big Bang burde have lavet lige meget stof og antistof, og så ville de have udslettet hinanden og kun efterladt stråling. Men af en grund, man ikke kender, var der en lille smule mere stof, ca. én ekstra partikel for hver milliard par. Alt det, vi og stjernerne er lavet af, er den lille rest.'],
      ['Kan man lave det?', 'Ja, men kun i bittesmå mængder. På CERN ved Genève skyder man protoner ind i en metalklods, så der dannes antiprotoner, og siden 2010 har man kunnet fange hele antihydrogenatomer i magnetiske fælder. Alt det antistof, man nogensinde har lavet, vejer langt under et gram, så det kan ikke bruges som brændstof.'],
      ['Bruger man det til noget?', 'Ja, på hospitalerne. Ved en PET-skanning får man et stof, der sender positroner ud. Hver positron møder hurtigt en elektron, og de forsvinder i to fotoner af gammastråling, der flyver hver sin vej. Skanneren fanger dem og regner ud, hvor i kroppen de kom fra, så lægerne fx kan se en kræftsvulst, der bruger meget sukker.'],
    ],
  },
  {
    id: 'isotop', ord: 'Isotop',
    former: ['isotop', 'isotopen', 'isotoper', 'isotoperne'],
    tekst: 'Udgaver af det samme grundstof med forskelligt antal neutroner. Carbon-12 og carbon-14 er begge carbon (6 protoner), men de har 6 og 8 neutroner.',
    // Kilder: docs/fakta-ordbog.md, "Isotop"
    mere: [
      ['Hvorfor er nogle isotoper radioaktive?', 'En kerne skal have den rigtige blanding af protoner og neutroner. Neutronerne hjælper med at holde sammen på kernen uden at skubbe fra sig, men med for mange eller for få bliver kernen ustabil. Carbon-14 har for mange neutroner, så før eller siden bliver en af dem til en proton, og atomet bliver til nitrogen-14.'],
      ['Hvordan skiller man isotoper ad, når de er kemisk ens?', 'Isotoperne har lige mange elektroner, så de opfører sig næsten helt ens i kemien. Den eneste forskel er, at de vejer lidt forskelligt. Uran skilles fx ad ved at lave det til en gas og slynge den rundt i centrifuger, der drejer meget hurtigt. Den lidt tungere uran-238 bliver presset mest ud mod væggen, men forskellen er så lille, at gassen skal gennem mange centrifuger efter hinanden.'],
      ['Hvad bruger man dem til?', 'Carbon-14 bruges til at finde ud af, hvor gamle ting fra levende væsner er, fx knogler og træ, op til ca. 50.000 år gamle. På hospitaler sprøjter man en lille smule af en radioaktiv isotop ind i kroppen og følger strålingen for at se, hvordan fx hjertet eller knoglerne har det. Og i atomkraftværker er det især uran-235, der spaltes. Naturligt uran har kun ca. 0,7 % af den, så brændslet har typisk 3-5 %.'],
    ],
  },
  {
    id: 'ion', ord: 'Ion',
    former: ['ion', 'ionen', 'ioner', 'ionerne'],
    tekst: 'Et atom med for få eller for mange elektroner. Så er det elektrisk ladet: plus, hvis der mangler elektroner, og minus, hvis der er for mange.',
    // Kilder: docs/fakta-ordbog.md, "Ion"
    mere: [
      ['Hvorfor bliver et atom til en ion?', 'Elektroner kan rives løs, når atomet bliver ramt hårdt nok, fx af stærk varme eller af stråling med meget energi. Derfor kaldes den slags stråling ioniserende. Atomer kan også bytte elektroner: Natrium holder løst på sin yderste elektron, og chlor trækker hårdt i en ekstra. Selve byttet koster lidt energi, men bagefter trækker plus og minus i hinanden, og det giver mere energi tilbage.'],
      ['Hvor møder jeg ioner i hverdagen?', 'Når salt opløses i vand, går det i stykker i Na⁺- og Cl⁻-ioner, og derfor kan saltvand lede strøm, som rent vand næsten ikke kan. Dine nerver sender signaler ved at lukke natrium- og kaliumioner ind og ud gennem cellernes væg. Og i et batteri vandrer ioner gennem elektrolytten, mens elektronerne løber gennem ledningen.'],
      ['Kan et atom miste alle sine elektroner?', 'Ja, så er der kun den nøgne kerne tilbage. I midten af Solen er det så varmt, at næsten alle hydrogen- og heliumatomer har mistet deres elektroner. Hos de tunge atomer sidder de inderste elektroner meget fastere, men i store partikelacceleratorer har man revet alle 92 elektroner af uran.'],
    ],
  },
  {
    id: 'ionbinding', ord: 'Ionbinding',
    former: ['ionbinding', 'ionbindingen', 'ionbindinger'],
    tekst: 'Når et atom har givet en elektron til et andet, og de to ioner (plus og minus) holder sammen, fordi de trækker i hinanden. Køkkensalt (Na⁺ og Cl⁻) er holdt sammen af ionbindinger.',
  },
  // Byg et molekyle → "Del elektroner" (Molekyler M2a). Kilder: docs/fakta-molekyler/m2.md, afsnit 2 og 4.
  {
    id: 'molekyle', ord: 'Molekyle',
    former: ['molekyle', 'molekylet', 'molekyler', 'molekylerne', 'molekylets'],
    tekst: 'To eller flere atomer, der holder sammen, fordi de deler elektroner. Vand (H₂O) er et molekyle af ét oxygenatom og to hydrogenatomer.',
  },
  {
    id: 'kovalent-binding', ord: 'Kovalent binding',
    former: ['kovalent binding', 'kovalente bindinger', 'kovalent'],
    tekst: 'En binding, hvor to atomer deler et par elektroner. Parret sidder mellem de to kerner, og begge kerner trækker i det. Sådan holder atomerne i et molekyle sammen.',
  },
  {
    id: 'elektronpar', ord: 'Elektronpar',
    former: ['elektronpar', 'elektronparret', 'elektronparrene'],
    tekst: 'To elektroner, der hører sammen. Et delt par sidder mellem to atomer og er en binding. Et frit par hører kun til ét atom.',
  },
  {
    id: 'frit-par', ord: 'Frit elektronpar',
    former: ['frit elektronpar', 'frie elektronpar', 'frit par', 'frie par'],
    tekst: 'Et elektronpar, der kun hører til ét atom og ikke binder. Oxygen i vand har to frie par. De skubber til bindingerne, så vandmolekylet bliver bøjet.',
  },
  {
    id: 'dobbeltbinding', ord: 'Dobbeltbinding',
    former: ['dobbeltbinding', 'dobbeltbindingen', 'dobbeltbindinger', 'dobbeltbindingerne'],
    tekst: 'Når to atomer deler to elektronpar i stedet for ét. I kuldioxid (CO₂) har kulstof en dobbeltbinding til hvert oxygen.',
  },
  {
    id: 'tripelbinding', ord: 'Tripelbinding',
    former: ['tripelbinding', 'tripelbindingen', 'tripelbindinger'],
    tekst: 'Når to atomer deler tre elektronpar. Nitrogen i luften (N₂) holdes sammen af en tripelbinding, som er så stærk, at nitrogen næsten ikke reagerer med noget ved stuetemperatur.',
  },
  // Molekyler M2b (ladningerne). Kilder: docs/fakta-molekyler/m2.md, afsnit 1 og fælde 4 og 5.
  {
    id: 'elektronegativitet', ord: 'Elektronegativitet',
    former: ['elektronegativitet', 'elektronegativiteten'],
    tekst: 'Hvor hårdt et atom trækker i de elektroner, det deler med et andet atom. Oxygen trækker hårdere end hydrogen. Derfor ligger de delte par i vand tættest på oxygen.',
  },
  {
    id: 'polaer', ord: 'Polær',
    former: ['polær', 'polært', 'polære', 'upolær', 'upolært', 'upolære'],
    tekst: 'Et molekyle er polært, når det har en ende, der er lidt plus, og en, der er lidt minus. Vand er polært. CO₂ er ikke: Dets to bindinger trækker lige hårdt hver sin vej, så de ophæver hinanden.',
  },
  {
    id: 'delta-ladning', ord: 'δ+ og δ− (delta plus og minus)',
    former: ['δ+ og δ−', 'δ+', 'δ−'],
    tekst: 'Betyder "lidt plus" og "lidt minus" (δ er det græske bogstav delta). Atomet, der trækker hårdest i de delte elektroner, bliver lidt minus, og det andet bliver lidt plus. Det er meget mindre end en hel ladning, som en ion har.',
  },
  // Molekyler M3 (knaldgas). Kilder: docs/fakta-molekyler/m3.md og docs/fakta-molekyler.md, afsnit 4.
  // Liv L1 (9. november 2026). Kilder: docs/fakta-liv/dna-stigen.md (OpenStax 2-1, 3-5 og 14-2, genome.gov) og docs/fakta-liv.md (OpenStax 10-1)
  {
    id: 'dna', ord: 'DNA',
    former: ['dna', "dna'et", "dna'ets"],
    tekst: 'Det stof, opskriften på et levende væsen er skrevet i. Det er en lang, snoet stige, og trinene er lavet af fire slags baser: A, T, G og C. DNA står for deoxyribonukleinsyre.',
  },
  {
    id: 'kromosom', ord: 'Kromosom',
    former: ['kromosom', 'kromosomet', 'kromosomer', 'kromosomerne'],
    tekst: 'Et af de lange stykker DNA i cellekernen, viklet om små kugler af protein. Mennesker har 46 kromosomer i 23 par: et sæt fra mor og et fra far.',
  },
  {
    id: 'basepar', ord: 'Basepar',
    former: ['basepar', 'baseparret', 'baseparrene'],
    tekst: 'Et trin i DNA-stigen: to baser, der passer sammen. A passer til T, og G passer til C. Der er ca. 6,1 milliarder basepar i én af dine celler.',
  },
  {
    id: 'hydrogenbinding', ord: 'Hydrogenbinding',
    former: ['hydrogenbinding', 'hydrogenbindingen', 'hydrogenbindinger', 'hydrogenbindingerne'],
    tekst: 'Et svagt træk mellem et H, der er lidt plus (δ+), og et atom i et andet molekyle, der er lidt minus (δ−), typisk et O eller N. Hydrogenbindinger holder A til T og G til C i DNA.',
  },
  {
    id: 'aktiveringsenergi', ord: 'Aktiveringsenergi',
    former: ['aktiveringsenergi', 'aktiveringsenergien'],
    tekst: 'Den energi, der skal til for at få en reaktion i gang, fordi nogle bindinger først skal i stykker. Den er som en bakke, man skal op over, før man kan trille ned på den anden side. Derfor brænder knaldgas ikke af sig selv, men en lille gnist er nok.',
  },
  {
    id: 'radikal', ord: 'Radikal',
    former: ['radikal', 'radikaler', 'radikalet', 'radikalerne'],
    tekst: 'Et atom eller molekyle med en elektron uden partner, fx et frit H-atom eller OH. Radikaler er meget ivrige efter at binde sig og river let andre molekyler over.',
  },
  {
    id: 'kaedereaktion', ord: 'Kædereaktion',
    former: ['kædereaktion', 'kædereaktionen', 'kædereaktioner'],
    tekst: 'En reaktion, hvor hvert trin selv starter et eller flere nye, så den kører videre af sig selv. I Reaktoren er det neutroner, der flækker nye urankerner. I knaldgas er det radikaler, der river nye molekyler over.',
  },
  {
    id: 'ioniseringsenergi', ord: 'Ioniseringsenergi',
    former: ['ioniseringsenergi', 'ioniseringsenergien'],
    tekst: 'Den energi, det koster at rive en elektron løs fra et atom. For natriums yderste elektron er det ca. 5,1 eV. Den næste elektron sidder længere inde og koster langt mere.',
  },
  {
    id: 'elektronaffinitet', ord: 'Elektronaffinitet',
    former: ['elektronaffinitet', 'elektronaffiniteten'],
    tekst: 'Den energi, et atom giver fra sig, når det får en ekstra elektron. Chlor giver ca. 3,6 eV. En ekstra elektron nr. to koster altid energi, for så er atomet allerede minusladet.',
  },
  {
    id: 'gitter', ord: 'Gitter (krystalgitter)',
    former: ['gitter', 'gitteret', 'krystalgitter', 'krystalgitteret'],
    tekst: 'Et fast mønster, som ionerne eller atomerne i en krystal ligger i. Mønstret gentager sig igen og igen. I køkkensalt har hver Na⁺ seks Cl⁻ omkring sig, og hver Cl⁻ har seks Na⁺.',
  },
  {
    id: 'gitterenergi', ord: 'Gitterenergi',
    former: ['gitterenergi', 'gitterenergien'],
    tekst: 'Den energi, der bliver frigjort, når frie plus- og minus-ioner samler sig til en krystal. For køkkensalt er det ca. 8,2 eV for hvert par Na⁺ og Cl⁻. Det er den, der betaler for at flytte elektronerne.',
  },
  {
    id: 'elektronvolt', ord: 'Elektronvolt (eV)',
    former: ['elektronvolt', 'ev'],
    tekst: 'En lille energienhed, der passer til atomer: den energi, en elektron får, når den bliver skubbet gennem en spænding på 1 volt. Synligt lys har ca. 2-3 eV pr. foton.',
  },
  {
    id: 'mev', ord: 'MeV',
    former: ['mev'],
    tekst: 'Mega-elektronvolt: en million elektronvolt. En elektronvolt er den energi, en elektron får, når den bliver skubbet gennem en spænding på 1 volt. En kemisk reaktion giver nogle få elektronvolt pr. atom, en kernereaktion millioner.',
  },
  {
    id: 'plasma', ord: 'Plasma',
    former: ['plasma', 'plasmaet'],
    tekst: 'Gas, hvor mange af atomerne har mistet elektroner, fx fordi gassen er meget varm. Elektronerne og ionerne farer rundt hver for sig. Stjerner, lyn og neonrør er plasma. Det kaldes stoffets fjerde tilstand (efter fast stof, væske og gas).',
    // Kilder: en.wikipedia.org "Plasma (physics)" og "Plasma display" (tjekket 7. november 2026)
    mere: [
      ['Er det ikke bare ioner?', 'Jo, hvert atom, der har mistet elektroner, er en ion. Men plasma er en hel gas, hvor så mange atomer har mistet elektroner, at elektronerne og ionerne farer rundt hver for sig. Tilsammen er der lige meget plus og minus. Fordi de ladede partikler kan bevæge sig frit, leder plasma strøm og kan styres af magneter. Det kan en almindelig gas ikke, og derfor kaldes plasma en tilstand for sig.'],
      ['Hvordan bliver en gas til plasma?', 'Med varme eller med strøm. Bliver en gas mange tusind grader varm, støder atomerne så hårdt sammen, at elektroner bliver slået løs. I et lyn eller et neonrør trækker en stærk spænding i de få frie elektroner, der altid er. De suser af sted og slår flere elektroner løs, som slår endnu flere løs, som en lavine.'],
      ['Hvorfor lyser plasma?', 'Elektronerne støder ind i atomerne og giver dem ekstra energi, eller de bliver fanget af en ion igen. Bagefter sender atomet energien ud som lys. Hvert stof har sine egne farver: Neon lyser rødorange.'],
      ['Hvad har det med plasmaskærme at gøre?', 'En plasmaskærm har millioner af bittesmå rum med neon og xenon. Når der går strøm gennem et rum, bliver gassen til plasma og sender usynligt ultraviolet lys ud. Det rammer et selvlysende lag, der lyser rødt, grønt eller blåt, og tre rum giver tilsammen én prik i billedet. De sidste plasmaskærme blev lavet omkring 2014-2016, for LCD- og OLED-skærme blev bedre og billigere.'],
      ['Hvor findes plasma?', 'Stjernerne er næsten rene kugler af plasma, og over 99 % af det almindelige stof, man kan se i universet, er plasma. På Jorden er det sjældent: lyn, gnister, neonrør, den tynde luft højt oppe, hvor nordlyset lyser, og fusionsforsøg, hvor magneter holder plasmaet svævende.'],
    ],
    tegning: 'plasma',
  },
  {
    id: 'fusion', ord: 'Fusion',
    former: ['fusion', 'fusionen'],
    tekst: 'Når lette atomkerner smelter sammen til en tungere kerne. Det frigør energi og får Solen og de andre stjerner til at lyse det meste af deres liv.',
    // Kilder: docs/fakta-ordbog.md, "Fusion". 4 · 1,007825 u = 4,0313 u mod 4,0026 u: 0,71 % forsvinder. 3,83·10²⁶ W / c² ≈ 4,3 mio. ton i sekundet.
    mere: [
      ['Hvorfor skal det være så varmt?', 'Atomkerner er plusladede, så de skubber kraftigt fra hinanden. Kun når de støder sammen med vild fart, kommer de tæt nok på til, at den stærke kernekraft kan tage over, og varme er det samme som fart for atomerne. I Solens midte er der ca. 15 millioner grader, og selv dér lykkes det kun takket være tunneleffekten.'],
      ['Hvor kommer energien fra?', 'Den nye kerne vejer en lille smule mindre end de kerner, den blev lavet af. Den manglende masse bliver til energi, som Einstein viste med E = mc². Når fire protoner i Solen ender som én heliumkerne, forsvinder ca. 0,7 % af massen. Det lyder ikke af meget, men Solen laver ca. 4 millioner ton masse om til energi hvert sekund.'],
      ['Hvorfor har vi ikke fusionskraftværker endnu?', 'På Jorden kan man ikke lave Solens kæmpe tryk, så plasmaet skal i stedet være over 100 millioner grader, og det må ikke røre væggene. De fleste forsøg holder det svævende med stærke magneter, men det er svært at holde det varmt og roligt længe nok. I 2022 fik et forsøg med lasere i USA for første gang mere energi ud af brændslet, end laserne sendte ind, men laserne brugte selv langt mere strøm.'],
    ],
  },
  {
    id: 'fission', ord: 'Fission',
    former: ['fission', 'fissionen'],
    tekst: 'Når en tung atomkerne (fx uran-235) flækker i to mindre kerner. Det frigør energi og bruges i atomkraftværker. Det kaldes også spaltning.',
    // Kilder: docs/fakta-ordbog.md, "Fission"
    mere: [
      ['Hvorfor flækker uran, men ikke jern?', 'Store kerner som uran er på grænsen af, hvad der kan hænge sammen: 92 protoner skubber fra hinanden, og den stærke kernekraft rækker kun til de nærmeste naboer. Når uran-235 fanger en neutron, kommer kernen til at dirre som en vanddråbe og flækker. Stykkerne sidder fastere sammen end uran, og derfor slipper der energi ud. Jern sidder allerede næsten fastest af alle, så det ville koste energi at dele det.'],
      ['Hvad er en kædereaktion?', 'Hver gang en uran-235-kerne flækker, flyver der to eller tre nye neutroner ud. Rammer de andre urankerner, flækker de også, og sådan kan det fortsætte af sig selv. I et atomkraftværk sluger kontrolstavene lige akkurat så mange neutroner, at hver spaltning i gennemsnit kun giver én ny. Så holder reaktionen et jævnt tempo i stedet for at vokse.'],
      ['Hvorfor er affaldet farligt så længe?', 'Stykkerne fra spaltningen har for mange neutroner og er stærkt radioaktive. Nogle henfalder på få dage, mens fx cæsium-137 har en halveringstid på ca. 30 år. Samtidig bliver noget af uran-238 i brændslet til plutonium, som har en halveringstid på ca. 24.000 år. Derfor skal brugt brændsel gemmes sikkert i meget lang tid, fx dybt nede i fast klippe, som Finland har bygget et lager til.'],
    ],
  },
  {
    id: 'halveringstid', ord: 'Halveringstid',
    former: ['halveringstid', 'halveringstiden', 'halveringstider'],
    tekst: 'Den tid, der går, før halvdelen af de radioaktive kerner af en slags er henfaldet. Hvornår netop én kerne henfalder, er helt tilfældigt.',
    // Kilder: docs/fakta-ordbog.md, "Halveringstid". (1/2)¹⁰ = 1/1024.
    mere: [
      ['Hvordan kan man vide det, når det er tilfældigt?', 'Det er ligesom med terninger. Man kan ikke vide, hvad én terning viser, men kaster man en million terninger, viser ca. en sjettedel af dem en sekser hver gang. Selv et lille gran af et radioaktivt stof har milliarder af milliarder af kerner. Så selvom hver enkelt kerne er tilfældig, er halvdelen af dem henfaldet efter præcis samme tid hver gang.'],
      ['Hvordan måler man en halveringstid på milliarder af år?', 'Man venter ikke, til halvdelen er væk. I stedet tæller man, hvor mange kerner der henfalder hvert sekund i en klump, hvor man ved, hvor mange kerner der er. Jo færre der henfalder pr. sekund, jo længere er halveringstiden. Sådan ved man, at uran-238 har en halveringstid på ca. 4,5 milliarder år, næsten lige så lang tid, som Jorden har eksisteret.'],
      ['Bliver stoffet nogensinde helt væk?', 'Efter én halveringstid er der halvdelen tilbage, efter to en fjerdedel, og efter ti halveringstider er der ca. en tusindedel tilbage. Til sidst er der kun ganske få kerner tilbage, og så er det tilfældigt, hvornår den allersidste henfalder. Det, kernerne er blevet til, er der stadig: De er bare blevet til et andet stof.'],
    ],
    tegning: 'halveringstid',
  },
  {
    id: 'radioaktiv', ord: 'Radioaktiv',
    former: ['radioaktiv', 'radioaktivt', 'radioaktive'],
    tekst: 'Et stof er radioaktivt, når dets atomkerner er ustabile og før eller siden henfalder. Når de henfalder, sender de stråling ud.',
    // Kilder: docs/fakta-ordbog.md, "Radioaktiv"
    mere: [
      ['Hvorfor er strålingen farlig?', 'Strålingen har så meget energi, at den kan rive elektroner løs fra atomerne i kroppens celler, og så kan den knække DNA\'et, cellernes byggevejledning. Kroppen reparerer selv det meste. Men får man meget på én gang, dør så mange celler, at man bliver syg, og man regner med, at selv små doser øger risikoen for kræft en lille smule. Alfastråling stoppes af et stykke papir, men den er farlig, hvis man ånder et radioaktivt stof ind.'],
      ['Er der radioaktivitet omkring mig?', 'Ja, hele tiden. Din krop indeholder kalium, og en lille del af det er radioaktivt kalium-40, så i en voksen henfalder der ca. 4.000 kerner hvert sekund. Fra jorden siver den radioaktive gas radon op, og fra rummet kommer kosmisk stråling. Det er naturligt, og alt liv på Jorden har altid levet med det.'],
      ['Bliver man selv radioaktiv af stråling?', 'Nej, ikke af alfa-, beta- eller gammastråling eller af røntgen. Strålingen afleverer sin energi og er så væk, ligesom lys. Det, der kan gøre noget radioaktivt, er neutroner, som kan sætte sig fast i kernerne, og det sker næsten kun inde i en reaktor. Det farlige ved et uheld er radioaktivt støv, der lander på en eller kommer ind i kroppen, for det bliver ved med at stråle.'],
    ],
  },
  {
    id: 'alfapartikel', ord: 'Alfapartikel',
    former: ['alfapartikel', 'alfapartiklen', 'alfapartikler', 'alfapartiklerne'],
    tekst: 'En heliumkerne: 2 protoner og 2 neutroner, der sidder tæt sammen. Tunge kerner kan skyde den ud (alfahenfald). Et stykke papir kan stoppe den.',
  },
  {
    id: 'gammastraaling', ord: 'Gammastråling',
    former: ['gammastråling', 'gammastrålingen', 'gammastråler', 'gammastrålerne'],
    tekst: 'Lys med ekstremt meget energi, som regel endnu mere end røntgenstråler. Man kan ikke se det med øjnene. Det kommer fx fra atomkerner.',
  },
  {
    id: 'foton', ord: 'Foton',
    former: ['foton', 'fotonen', 'fotoner', 'fotonerne'],
    // D + p → ³He giver 5,49 MeV. Synligt lys er ca. 1,6-3,1 eV pr. foton, så 1,8-3,4 mio. gange mere.
    tekst: 'En lyspartikel. Lys kommer i bittesmå portioner af energi, som kaldes fotoner. De vejer ingenting og flyver med lysets fart. En foton af gammastråling fra Solens kerne har over en million gange mere energi end en foton af synligt lys.',
    // Kilder: docs/fakta-ordbog.md, "Foton"
    mere: [
      ['Hvordan kan noget, der intet vejer, have energi?', 'Energi kræver ikke masse. En fotons energi afhænger af bølgelængden: Blåt lys har mere energi pr. foton end rødt, og ultraviolet lys og røntgen har endnu mere. Derfor kan ultraviolet lys give solskoldning, mens rødt lys ikke kan, uanset hvor meget der er. Fotoner kan også skubbe: Sollys giver et bittelille tryk, og det har man brugt til at sejle med solsejl i rummet.'],
      ['Er lys en bølge eller en partikel?', 'Begge dele, og egentlig ingen af dem. Sender man lys gennem to smalle sprækker, laver det et stribet mønster, som kun bølger kan lave. Men skruer man ned, så der kun kommer én foton ad gangen, rammer hver foton skærmen som en enkelt prik, ligesom en partikel. Efter mange fotoner danner prikkerne alligevel det stribede mønster. Fotonen er en kvanteting, der hverken ligner bølger eller kugler fra hverdagen.'],
    ],
  },
  {
    id: 'deuterium', ord: 'Deuterium',
    former: ['deuterium'],
    // D/H i havvand: ca. 156 ppm, altså ca. 1 ud af 6.400
    tekst: '"Tung brint": en hydrogenkerne med 1 proton og 1 neutron. Omkring 1 ud af 6.400 hydrogenatomer i havvand er deuterium.',
  },
  {
    id: 'nukleon', ord: 'Nukleon',
    former: ['nukleon', 'nukleonen', 'nukleoner', 'nukleonerne'],
    tekst: 'Fællesnavn for protoner og neutroner, altså de partikler, en atomkerne er bygget af.',
  },
  {
    id: 'kvark', ord: 'Kvark',
    former: ['kvark', 'kvarken', 'kvarker', 'kvarkerne'],
    tekst: 'De bittesmå partikler, som protoner og neutroner er bygget af. Der er tre kvarker i hver proton og hver neutron.',
    // Kilder: docs/fakta-ordbog.md, "Kvark"
    mere: [
      ['Hvorfor kan man ikke få en kvark ud alene?', 'Kraften mellem kvarkerne bliver ikke svagere, når man trækker dem fra hinanden, som tyngdekraften og magneter gør. Den er snarere som et elastik, der bliver ved med at trække. Trækker man hårdt nok, er der så meget energi i "elastikken", at den bliver til et nyt par kvarker. Så får man to nye partikler i stedet for en løs kvark.'],
      ['Hvordan ved man, at de findes?', 'I 1968 skød forskere i Californien elektroner med meget høj fart ind i protoner. Flere af elektronerne blev slynget af i store vinkler, end man havde ventet, som om de ramte små, hårde punkter inde i protonen, ligesom Rutherford i 1911 fandt atomkernen. Siden er alle seks slags kvarker fundet, den sidste i 1995. Protonen har to op-kvarker og én ned-kvark, og neutronen har én op og to ned.'],
    ],
  },
  {
    id: 'kernekraft', ord: 'Den stærke kernekraft',
    // Pas på: "kernekraft" betyder også atomkraft. Bruges ordet om kraftværker, skal formen "kernekraften" fjernes her.
    former: ['stærke kernekraft', 'stærk kernekraft', 'kernekraften'],
    tekst: 'Den kraft, der holder protoner og neutroner sammen i atomkernen. Den er meget stærkere end frastødningen mellem protonerne, men den virker kun over meget korte afstande.',
  },
  {
    id: 'bindingsenergi', ord: 'Bindingsenergi',
    former: ['bindingsenergi', 'bindingsenergien'],
    tekst: 'Den energi, der skal til for at rive en atomkerne helt fra hinanden i protoner og neutroner. Jo mere bindingsenergi pr. nukleon, jo fastere sidder kernen sammen. Jern og nikkel har mest.',
    // Kilder: docs/fakta-ordbog.md, "Bindingsenergi"
    mere: [
      ['Hvorfor har jern mest?', 'To kræfter trækker hver sin vej. Den stærke kernekraft holder kun fat i de nærmeste naboer, og i en lille kerne sidder mange af partiklerne ude i kanten med få naboer. Den elektriske frastødning virker derimod mellem alle protonerne, og i en stor kerne bliver den meget stor. Midt imellem, omkring jern og nikkel, passer de to bedst sammen.'],
      ['Hvorfor giver både fusion og fission energi?', 'Begge dele ender tættere på jern. Når lette kerner smelter sammen, eller en tung kerne flækker, sidder partiklerne bagefter fastere sammen, og forskellen i bindingsenergi slipper ud som energi. Det er også derfor, en stor stjerne ikke kan få energi ud af at lave noget tungere end jern. Når dens midte er fyldt med jern, er der ikke mere at hente, og den falder sammen.'],
    ],
  },
  {
    id: 'elektronindfangning', ord: 'Elektronindfangning',
    former: ['elektronindfangning', 'elektronindfangningen'],
    tekst: 'En slags henfald, hvor kernen fanger en af atomets egne elektroner. En proton bliver så til en neutron, og en neutrino flyver ud.',
  },
  {
    id: 'tunneleffekt', ord: 'Tunneleffekt',
    former: ['tunneleffekt', 'tunneleffekten'],
    tekst: 'En kvanteeffekt (noget, der kun sker for de allermindste ting): En partikel kan en sjælden gang slippe igennem en forhindring, som den egentlig ikke har energi nok til at komme over. Uden den kunne Solen ikke lyse.',
    // Kilder: docs/fakta-ordbog.md, "Tunneleffekt". kT ved 15,7 mio. K ≈ 1,4 keV, frastødningen ved ca. 2,6 fm ≈ 0,55 MeV: ca. 400 gange.
    mere: [
      ['Hvorfor kunne Solen ikke lyse uden den?', 'Selv ved 15 millioner grader har protonerne i Solens midte flere hundrede gange for lidt energi til at komme helt hen til hinanden. Uden tunneleffekten ville de bare prelle af. Men en gang imellem slipper en proton igennem forhindringen og kommer tæt nok på, til at fusionen kan ske. Det sker sjældent for hver proton, men der er så mange, at det er nok til at holde Solen lysende i milliarder af år.'],
      ['Hvorfor kan jeg så ikke gå gennem en væg?', 'Chancen for at slippe igennem falder vildt hurtigt, jo tungere tingen er, og jo tykkere forhindringen er. En proton er bittelille og skal kun en bittelille afstand. Du er lavet af milliarder af milliarder af milliarder atomer, som alle skulle slippe igennem på én gang. Chancen er så lille, at det aldrig ville ske, heller ikke hvis du prøvede hvert sekund siden Big Bang.'],
    ],
  },
  {
    id: 'moderator', ord: 'Moderator',
    former: ['moderator', 'moderatoren', 'moderatorer'],
    tekst: 'Et stof (fx vand eller grafit), der bremser neutronerne i en reaktor. Langsomme neutroner spalter lettere uran-235.',
  },
  {
    id: 'elektrolyt', ord: 'Elektrolyt',
    former: ['elektrolyt', 'elektrolytten'],
    tekst: 'Stoffet mellem plus og minus i et batteri. Det lukker ioner igennem, men ikke elektroner.',
  },
  {
    id: 'dendrit', ord: 'Dendrit',
    former: ['dendrit', 'dendritter', 'dendritterne'],
    tekst: 'Tynde nåle af lithium-metal, der kan vokse inde i et batteri, hvis det bliver overladet eller ladet for hurtigt. De kan stikke hul på skillevæggen og give kortslutning.',
  },
  {
    id: 'lysaar', ord: 'Lysår',
    former: ['lysår', 'lysåret'],
    // 9,46·10¹² km
    tekst: 'Den afstand, lyset når på et år: ca. 9.500 milliarder km. Det er altså en afstand, ikke en tid.',
    // Kilder: docs/fakta-ordbog.md, "Lysår". 4,25 · 9,461·10¹² km ≈ 4,0·10¹³ km. 90.000 · 9,461·10¹² km ≈ 8,5·10¹⁷ km (18 cifre).
    mere: [
      ['Hvorfor bruger man ikke bare km?', 'Tallene bliver alt for store. Den nærmeste stjerne efter Solen, Proxima Centauri, er ca. 40.000 milliarder km væk, men kun ca. 4,2 lysår. Mælkevejen er ca. 90.000 lysår bred, og i km ville det være et tal med 18 cifre. Lysår fortæller også noget mere: hvor længe lyset har været undervejs.'],
      ['Ser vi stjernerne, som de ser ud lige nu?', 'Nej, vi ser dem, som de så ud, da lyset forlod dem. Solen ser vi, som den var for ca. 8 minutter siden, og Sirius, den klareste stjerne på nattehimlen, som den var for ca. 8½ år siden. Andromedagalaksen, som man lige kan se med det blotte øje, ser vi, som den var for ca. 2,5 millioner år siden. Jo længere ud man kigger, jo længere tilbage i tiden ser man.'],
    ],
  },
  {
    id: 'tidsforlaengelse', ord: 'Tidsforlængelse',
    former: ['tidsforlængelse', 'tidsforlængelsen'],
    // docs/fakta-tid.md, afsnit 2, 3 og 10
    tekst: 'Når et ur går langsommere set fra os, fordi det farer forbi næsten med lysets fart. Den, der rejser, mærker intet, for alt om bord følger med. Ure tæt på noget tungt, som en planet, går også langsommere.',
    // Kilder: docs/fakta-ordbog.md, "Tidsforlængelse". c · 2,2 µs ≈ 660 m. GPS: 3,87 km/s ≈ 14.000 km/t.
    mere: [
      ['Hvordan ved man, at det er sandt?', 'Det er målt mange gange. Myoner er partikler, der dannes mange km oppe i luften, når kosmisk stråling rammer den, og de lever i gennemsnit kun ca. 2 milliontedele af et sekund. Selv med næsten lysets fart ville de på så kort tid kun nå nogle hundrede meter. Alligevel når masser af dem ned til jorden, fordi deres ure set fra os går langsommere. Man har også fløjet atomure jorden rundt i fly og målt forskellen.'],
      ['Hvorfor skal GPS tage højde for det?', 'GPS-satellitterne har atomure om bord, og din mobil finder sin plads ud fra, hvor lang tid signalerne er om at nå frem. Fordi satellitterne farer af sted med ca. 14.000 km/t, går deres ure lidt langsommere. Men fordi de er langt fra Jordens tyngde, går de endnu mere hurtigere. Til sammen vinder de ca. 38 milliontedele af et sekund om dagen, og uden en rettelse ville GPS\'en tage ca. 10 km mere fejl for hver dag.'],
    ],
  },
  {
    id: 'laengdeforkortelse', ord: 'Længdeforkortelse',
    former: ['længdeforkortelse', 'længdeforkortelsen'],
    // docs/fakta-tid.md, afsnit 7: d/γ, γ = 70,7 ved 99,99 %
    tekst: 'Når en afstand langs farten er kortere set fra den, der farer af sted. Ved 99,99 % af lysets fart er vejen til Alpha Centauri ca. 71 gange kortere set fra skibet end set fra Jorden.',
  },
  {
    id: 'roedkaempe', ord: 'Rød kæmpe',
    former: ['rød kæmpe', 'røde kæmpe', 'røde kæmper'],
    // Solen er størst om ca. 7,6 mia. år (Schröder & Smith 2008)
    tekst: 'En stjerne sidst i sit liv, når hydrogenet i midten er brugt op. Den svulmer op til mange gange sin størrelse og bliver køligere udenpå og derfor rød. Solen begynder at blive en rød kæmpe om ca. 5 milliarder år.',
  },
  {
    id: 'hviddvaerg', ord: 'Hvid dværg',
    former: ['hvid dværg', 'hvide dværg', 'hvide dværge'],
    // Typisk ca. 0,6 solmasser. Tæthed ca. 10⁶ g/cm³, så 5 cm³ vejer ca. 5 ton.
    tekst: 'Den glødende rest af en stjerne som Solen: på størrelse med Jorden, men med lidt over halvdelen af Solens masse. En teskefuld vejer flere ton.',
  },
  {
    id: 'brundvaerg', ord: 'Brun dværg',
    former: ['brun dværg', 'brune dværg', 'brune dværge'],
    tekst: 'En "mislykket stjerne": Den vejer under ca. 8 % af Solen, så midten bliver aldrig varm nok til, at almindelig hydrogen kan smelte sammen. Den gløder svagt og bliver langsomt koldere.',
  },
  {
    id: 'neutronstjerne', ord: 'Neutronstjerne',
    former: ['neutronstjerne', 'neutronstjernen', 'neutronstjerner', 'neutronstjernerne'],
    tekst: 'Det, der kan blive tilbage i midten, når en stor stjerne eksploderer: en kugle, der kun er ca. 20 km bred, men vejer mere end Solen og næsten kun består af neutroner.',
    // Kilder: docs/fakta-ordbog.md, "Neutronstjerne"
    mere: [
      ['Hvordan bliver protoner og elektroner til neutroner?', 'Når midten af den store stjerne falder sammen, bliver trykket så enormt, at elektronerne bliver presset ind i protonerne. En proton og en elektron bliver til en neutron og en neutrino. Det kaldes elektronindfangning. Neutronerne skubber ikke elektrisk fra hinanden, så de kan pakkes helt tæt. En teskefuld af en neutronstjerne vejer milliarder af ton.'],
      ['Hvorfor drejer de så hurtigt rundt?', 'Det er ligesom en skøjteløber, der trækker armene ind og snurrer hurtigere. Stjernens midte drejer langsomt, men når den skrumper til en kugle på ca. 20 km, må den dreje vildt hurtigt. Nogle neutronstjerner drejer flere hundrede gange i sekundet, den hurtigste kendte 716 gange. De sender stråler ud som et fyrtårn, og rammer strålen Jorden, ser vi et blink for hver omgang. Så kaldes de pulsarer.'],
    ],
  },
  {
    id: 'fotonring', ord: 'Fotonring',
    former: ['fotonring', 'fotonringen'],
    tekst: 'En tynd, lys ring lige uden for skyggen af et sort hul. Den er lavet af lys, der er gået mindst en halv tur rundt om hullet, før det slap væk.',
  },
  {
    id: 'doppler', ord: 'Dopplereffekt',
    former: ['dopplereffekt', 'dopplereffekten'],
    tekst: 'Lys og lyd fra noget, der kommer mod os, får kortere bølger (lyset bliver mere blåt, tonen lysere). Fra noget, der fjerner sig, bliver bølgerne længere (mere rødt, dybere tone). Man hører det, når en ambulance kører forbi: Sirenens tone falder.',
  },
  {
    id: 'horisont', ord: 'Begivenhedshorisont',
    former: ['begivenhedshorisont', 'begivenhedshorisonten'],
    tekst: 'Grænsen omkring et sort hul. Indenfor kan intet slippe ud igen, ikke engang lys.',
  },
  {
    id: 'baggrundsstraaling', ord: 'Den kosmiske baggrundsstråling',
    former: ['baggrundsstråling', 'baggrundsstrålingen'],
    // 2,725 K = ca. −270 °C
    tekst: 'Det ældste lys, vi kan se. Det blev sendt af sted, da universet var ca. 380.000 år gammelt. I dag kommer det som svage mikrobølger fra alle retninger og svarer til ca. −270 °C.',
    // Kilder: docs/fakta-ordbog.md, "Baggrundsstrålingen". 3.000 K / 1.100 ≈ 2,7 K.
    mere: [
      ['Hvorfor kan vi ikke se længere tilbage?', 'Før da var hele universet et glødende plasma, og lyset blev hele tiden kastet rundt af de løse elektroner, ligesom lys i tæt tåge. Da universet var kølet ned til ca. 2.700 °C, kunne elektronerne sætte sig fast på kernerne, så der blev hele atomer. Så kunne lyset pludselig flyve frit, og det er det lys, vi ser nu. Længere tilbage kan man ikke se med lys, kun regne sig frem.'],
      ['Hvorfor er det mikrobølger, når det var varmt lys?', 'Universet er blevet ca. 1.100 gange større siden, og lysbølgerne er blevet strakt lige så meget. Det, der begyndte som et gulligt-orange skær ligesom fra en gammeldags glødepære, er nu så langbølget, at det er mikrobølger. Derfor svarer det i dag kun til ca. 2,7 grader over det absolutte nulpunkt (det koldeste, noget kan blive).'],
      ['Hvordan blev den opdaget?', 'I 1964 arbejdede Arno Penzias og Robert Wilson med en stor antenne i USA og fandt en svag støj, der kom fra alle retninger, dag og nat. De ledte efter fejl og fjernede bl.a. duer og deres klatter fra antennen, men støjen blev. Andre forskere havde netop regnet ud, at der burde være sådan et efterskær fra Big Bang, og i 1978 fik Penzias og Wilson nobelprisen for opdagelsen.'],
    ],
  },
  {
    id: 'moerkenergi', ord: 'Mørk energi',
    former: ['mørk energi', 'mørke energi'],
    tekst: 'Navnet på det ukendte, der får universet til at udvide sig hurtigere og hurtigere. Ingen ved endnu, hvad det er.',
  },
  {
    id: 'jaevndoegn', ord: 'Jævndøgn',
    former: ['jævndøgn', 'jævndøgnet', 'forårsjævndøgn', 'efterårsjævndøgn'],
    tekst: 'De to dage om året (ca. 20. marts og 23. september), hvor Solen står lige over ækvator. Så er dag og nat næsten lige lange overalt på Jorden.',
  },
  {
    id: 'solhverv', ord: 'Solhverv',
    former: ['solhverv', 'solhvervet', 'sommersolhverv', 'vintersolhverv'],
    tekst: 'De to dage om året, hvor Solen står længst mod nord (ca. 21. juni) eller længst mod syd (ca. 21. december). I Danmark er det årets længste og korteste dag.',
  },
  {
    id: 'polarcirkel', ord: 'Polarcirkel',
    former: ['polarcirkel', 'polarcirklen', 'polarcirklerne'],
    // 90° minus Jordaksens hældning (23,44°) = 66,56°
    tekst: 'En tænkt cirkel på Jorden ca. 66,6° nord (eller syd) for ækvator. Mellem den og polen er der mindst én dag om året, hvor Solen ikke går ned, og én, hvor den ikke står op.',
  },
  {
    id: 'midnatssol', ord: 'Midnatssol',
    former: ['midnatssol', 'midnatssolen'],
    tekst: 'Når Solen ikke går ned om natten. Det sker om sommeren nord for polarcirklen, fx i Ilulissat i Grønland og i Nordnorge. I Antarktis sker det omkring december og januar, og på selve Sydpolen er Solen oppe i et halvt år.',
  },
  {
    id: 'moerketid', ord: 'Mørketid',
    former: ['mørketid', 'mørketiden'],
    tekst: 'Når Solen slet ikke kommer over horisonten, hele døgnet. Det sker om vinteren nord for polarcirklen. Tæt på polarcirklen er der tusmørke midt på dagen, men tæt på polen er det mørkt i flere måneder.',
  },
  {
    id: 'baneplan', ord: 'Baneplan',
    former: ['baneplan', 'baneplanet'],
    tekst: 'Den flade skive, som en bane ligger i. Jorden kredser om Solen i ét plan. Månens bane ligger i et andet plan, der hælder ca. 5° i forhold til Jordens.',
  },
  {
    id: 'korona', ord: 'Korona',
    former: ['korona', 'koronaen'],
    tekst: 'Solens yderste lag: tynd gas på over en million grader, som stråler langt ud i rummet. Den er så svag i forhold til Solen, at man kun kan se den med det blotte øje, når Månen dækker hele Solen.',
  },
  {
    id: 'optiskdybde', ord: 'Optisk dybde',
    former: ['optisk dybde', 'optiske dybde'],
    // e^-1 ≈ 37 %, e^-5 ≈ 0,7 % (lyset, der går lige igennem)
    tekst: 'Et tal (τ) for, hvor meget noget skygger for lyset. Ved τ = 1 slipper ca. 37 % af lyset lige igennem, og ved τ = 5 under 1 %. Saturns C-ring har τ ca. 0,1, og midt i B-ringen er τ mange steder over 5.',
  },
  {
    id: 'kerneskygge', ord: 'Kerneskygge',
    former: ['kerneskygge', 'kerneskyggen'],
    tekst: 'Den mørkeste del af en skygge i rummet. Inde i Månens kerneskygge er hele Solen dækket (total solformørkelse). Er hele Månen inde i Jordens kerneskygge, er det total måneformørkelse.',
  },
  {
    id: 'rproces', ord: 'r-processen',
    former: ['r-processen'],
    tekst: 'Den hurtige måde at lave tunge grundstoffer på (r for "rapid", hurtig). Atomkerner bliver ramt af så mange neutroner, at de fanger dem hurtigere, end de når at henfalde. Det sker nok mest, når neutronstjerner støder sammen.',
  },
  {
    id: 'sproces', ord: 's-processen',
    former: ['s-processen'],
    tekst: 'Den langsomme måde at lave tunge grundstoffer på (s for "slow", langsom). Inde i døende røde kæmpestjerner fanger atomkerner én neutron ad gangen og når at henfalde imellem. Sådan er fx det meste bly blevet lavet.',
  },
  {
    id: 'kosmiskstraaling', ord: 'Kosmisk stråling',
    former: ['kosmisk stråling', 'kosmiske stråling'],
    tekst: 'Atomkerner (mest protoner), der suser gennem rummet med næsten lysets fart. Rammer de en anden atomkerne, kan de slå den i stykker. Sådan er det meste beryllium og bor blevet lavet. Det er ikke det samme som den kosmiske baggrundsstråling.',
  },
  {
    id: 'myon', ord: 'Myon',
    former: ['myon', 'myonen', 'myoner', 'myonerne'],
    // docs/fakta-tid.md, afsnit 10: 105,66 MeV (elektronen 0,511 MeV, ca. 207 gange), levetid 2,197 µs, ca. 15 km oppe
    tekst: 'En tung fætter til elektronen: minusladet som den, men ca. 200 gange tungere. En myon lever i gennemsnit kun ca. 2 milliontedele sekund. Myoner bliver lavet højt oppe i luften, når den kosmiske stråling rammer den.',
  },
  {
    id: 'halvskygge', ord: 'Halvskygge',
    former: ['halvskygge', 'halvskyggen'],
    tekst: 'Den lysere del af en skygge i rummet, rundt om kerneskyggen. Herfra er kun en del af Solen dækket, så der er stadig lys, bare mindre.',
  },
  {
    id: 'toeris', ord: 'Tøris',
    former: ['tøris'],
    // CO₂ bliver til gas ved −78,5 °C ved 1 atm uden at smelte
    tekst: 'Frossen kuldioxid (CO₂). Her på Jorden er den ca. −78 °C kold, og den bliver til gas uden at smelte først. På Mars fryser en del af luften til tøris ved polerne om vinteren.',
    // Kilder: docs/fakta-ordbog.md, "Tøris"
    mere: [
      ['Hvorfor bliver den ikke flydende?', 'Kuldioxid kan kun være flydende, når trykket er over ca. 5 gange luftens tryk her ved jorden. Ved almindeligt tryk springer den direkte fra fast stof til gas. Det kaldes sublimation. Inde i en trykflaske, fx kulsyreflasken til en sodavandsmaskine, er trykket højt nok, og dér er kuldioxiden faktisk flydende.'],
      ['Hvad er den hvide røg?', 'Det er ikke kuldioxid, for den er usynlig som gas. Det er bittesmå vanddråber, ligesom din ånde en kold vinterdag. Den tykke tåge kommer, når man lægger tøris i vand: Vandet fordamper, og den iskolde gas køler dampen, så den bliver til dråber. Tågen bliver liggende ved gulvet, fordi den kolde kuldioxid er tungere end luften.'],
      ['Hvordan laver man tøris?', 'Man presser kuldioxid sammen, til den bliver flydende, og lukker den så hurtigt ud. Når den udvider sig, bliver den så kold, at en del af den fryser til en slags sne, som man presser sammen til klodser eller små stænger. Kuldioxiden er ofte et restprodukt fra fabrikker, fx dem, der laver ammoniak til gødning.'],
    ],
  },
  {
    id: 'skalahoejde', ord: 'Skalahøjde',
    former: ['skalahøjde', 'skalahøjden'],
    // Tætheden falder med faktoren e ≈ 2,718 pr. skalahøjde. NSSDC: Mars 11,0 km, Jorden 8,5 km
    tekst: 'Så højt skal man op, før luften bliver ca. 2,7 gange tyndere. Kommer man en skalahøjde højere op, bliver den 2,7 gange tyndere igen. På Mars er den ca. 11 km og på Jorden ca. 8,5 km.',
  },
  {
    id: 'skjoldvulkan', ord: 'Skjoldvulkan',
    former: ['skjoldvulkan', 'skjoldvulkanen', 'skjoldvulkaner'],
    tekst: 'En bred vulkan med meget flade sider. Den er bygget af tynd lava, der er flydt langt ud, lag på lag, så den ligner et skjold, der ligger på jorden. Vulkanerne på Hawaii og Olympus Mons på Mars er skjoldvulkaner.',
  },
  {
    id: 'caldera', ord: 'Caldera',
    former: ['caldera', 'calderaen', 'calderaer'],
    tekst: 'Et stort krater på toppen af en vulkan. Det er ikke lavet af et nedslag: Når et udbrud tømmer kammeret med smeltet sten under toppen, synker jorden ned og efterlader et stort hul.',
  },  {
    id: 'nedslagskrater', ord: 'Nedslagskrater',
    former: ['nedslagskrater', 'nedslagskrateret', 'nedslagskratere', 'nedslagskraterne', 'nedslagsbassin', 'nedslagsbassinet', 'nedslagsbassiner'],
    tekst: 'Et krater, der blev sprængt ud, da en sten fra rummet ramte med meget høj fart. De allerstørste, der er flere hundrede km brede, kaldes nedslagsbassiner. På Mars og Månen ses mange, for der er ingen regn, der slider dem væk.',
  },
  {
    id: 'spraekkedal', ord: 'Sprækkedal',
    former: ['sprækkedal', 'sprækkedalen', 'sprækkedale'],
    tekst: 'En lang dal, der opstår, når jordskorpen bliver strakt og revner. Landet mellem revnerne synker ned. Valles Marineris på Mars er en kæmpe sprækkedal. På Jorden er riftdalen i Østafrika et eksempel.',
  },
  // M5b (Mars: Gale og Jezero), faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M5b")
  {
    id: 'rover', ord: 'Rover',
    former: ['rover', 'roveren', 'rovere', 'roverne', 'roverens'],
    tekst: 'En robotbil, der kører rundt på en anden planet eller måne og undersøger den. Den styres fra Jorden, men signalerne er minutter om at nå frem, så den skal klare meget selv. Curiosity og Perseverance er rovere på Mars.',
  },
  {
    id: 'delta', ord: 'Delta',
    former: ['delta', 'deltaet', 'deltaets', 'deltaer'],
    tekst: 'En vifte af sand og mudder, som en flod lægger, hvor den løber ud i en sø eller et hav og mister farten. Navnet kommer fra det græske bogstav Δ (delta), for Nilens delta er trekantet. Mange andre deltaer har en anden form.',
  },
  {
    id: 'biospor', ord: 'Biospor',
    former: ['biospor', 'biosporet', 'biosignatur', 'biosignaturer'],
    tekst: 'Et spor, som kun liv eller næsten kun liv kan lave, fx bestemte stoffer, mønstre eller fossiler. Det kaldes også en biosignatur. Et muligt biospor kan også være lavet uden liv, så forskerne skal udelukke det, før de kan sige, at de har fundet liv.',
  },
  // M6b (Phobos og Deimos), faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M6b")
  {
    id: 'bundet-rotation', ord: 'Bundet rotation',
    former: ['bundet rotation', 'bundne rotation'],
    tekst: 'Når en måne drejer én gang om sig selv, mens den runder sin planet én gang. Så vender den altid samme side mod planeten. Vores Måne, Phobos og Deimos har bundet rotation. Tidevandskraften har bremset deres drejning.',
  },
  {
    id: 'regolit', ord: 'Regolit',
    former: ['regolit', 'regolitten'],
    tekst: 'Løst støv, grus og sten, som dækker overfladen på Månen, Mars, asteroider og små måner. Det meste er knust af nedslag fra meteoritter gennem meget lang tid. På Mars har vind og vejr også været med.',
  },
  {
    id: 'tidevandskraft', ord: 'Tidevandskraft',
    former: ['tidevandskraft', 'tidevandskraften', 'tidevandskræfter', 'tidevandskræfterne'],
    // Solen giver ca. en tredjedel af tidevandet på Jorden
    tekst: 'Forskellen i tyngdekraften fra et andet legeme på den nære og den fjerne side. Den strækker legemet lidt. Sådan giver Månen og Solen ebbe og flod på Jorden. Tidevandskraften kan også bremse en måne eller rive den i stykker, hvis den kommer for tæt på.',
    // Kilder: docs/fakta-ordbog.md, "Tidevandskraft". Solens træk / Månens ≈ (27,1·10⁶) · (1/389)² ≈ 180. Tidevand ∝ M/d³: Solens er ca. 0,46 af Månens.
    mere: [
      ['Hvorfor er der også flod på den side, der vender væk fra Månen?', 'Månen trækker hårdest i det vand, der er tættest på den, lidt svagere i Jordens midte og svagest i vandet på den fjerne side. Så Jorden bliver strakt en lille smule i begge retninger: Vandet på den nære side trækkes mod Månen, og vandet på den fjerne side bliver så at sige hængende. Derfor er der to buler af vand, og fordi Jorden drejer, har de fleste steder flod to gange i døgnet.'],
      ['Hvorfor giver Månen mere tidevand end Solen, når Solen trækker hårdere?', 'Det, der tæller, er ikke, hvor hårdt der trækkes, men forskellen mellem Jordens to sider. Solen er ca. 390 gange længere væk end Månen, så set fra Solen er Jordens to sider næsten lige langt væk, og forskellen bliver lille. Solens tidevand er derfor kun knap halvt så stort som Månens. Ved nymåne og fuldmåne trækker de i samme retning, og så bliver tidevandet ekstra stort.'],
    ],
  },
  // Jupiter J4, faktatjekket 7. november 2026 (docs/fakta-solsystemet.md, "Faktatjek J4")
  {
    id: 'zone', ord: 'Zone',
    former: ['zone', 'zonen', 'zoner', 'zonerne'],
    tekst: 'Et lyst bånd af skyer, der går hele vejen rundt om Jupiter eller Saturn. Mellem de lyse zoner ligger mørkere bånd, der kaldes bælter. Mellem båndene blæser jetstrømme skiftevis mod øst og mod vest.',
  },
  {
    id: 'baelte', ord: 'Bælte',
    former: ['bælte', 'bæltet', 'bælter', 'bælterne'],
    tekst: 'Et mørkere bånd af skyer, der går hele vejen rundt om Jupiter eller Saturn, mellem to lyse zoner. På Jupiter er bælterne mørkt orange.',
  },
  {
    id: 'jetstroem', ord: 'Jetstrøm',
    former: ['jetstrøm', 'jetstrømmen', 'jetstrømme', 'jetstrømmene'],
    // Vores måling i Hubbles kort: ca. 149 m/s ved 24° N (js/data/vinde-jupiter.js). NASA: "over a dozen prevailing winds"
    tekst: 'En smal flod af meget hurtig vind højt oppe i luften. Jorden har også jetstrømme, og fly kan få medvind af dem. På Jupiter blæser over et dusin jetstrømme skiftevis mod øst og mod vest, den hurtigste med ca. 150 meter i sekundet.',
  },
  {
    id: 'antikyklon', ord: 'Antikyklon',
    former: ['antikyklon', 'antikyklonen', 'antikykloner', 'antikyklonerne'],
    tekst: 'Et højtryk, som vinden drejer rundt om. Den drejer den modsatte vej af en cyklon: med uret på den nordlige halvkugle og mod uret på den sydlige. Den Store Røde Plet på Jupiter er en antikyklon.',
  },
  {
    id: 'cyklon', ord: 'Cyklon',
    former: ['cyklon', 'cyklonen', 'cykloner', 'cyklonerne'],
    tekst: 'Et lavtryk, som vinden drejer rundt om: mod uret på den nordlige halvkugle og med uret på den sydlige. Orkaner er kraftige cykloner. Ved Jupiters poler står kæmpestore cykloner i en ring om en cyklon i midten.',
  },
  {
    id: 'resonans', ord: 'Resonans',
    former: ['resonans', 'resonansen', 'resonanser'],
    tekst: 'Når ting svinger eller kredser i et fast talforhold og giver hinanden et lille skub igen og igen på samme sted, som når man skubber en gynge i takt. Io, Europa og Ganymedes er i resonans: Io går fire omgange, mens Ganymedes går én.',
  },
  {
    id: 'isgigant', ord: 'Isgigant',
    former: ['isgigant', 'isgiganten', 'isgiganter', 'isgiganterne'],
    // UN5. Kilder: fakta-solsystemet/del6, fælde 2 ("is" er varme væsker), og Wikipedia "Neptune" (kappen af vand, ammoniak og metan)
    tekst: 'En stor planet som Uranus og Neptun. Yderst er der luft af brint og helium, men inde i dem er der mest vand, ammoniak og metan. Astronomer kalder dem "is", men inde i planeten er de varme, tætte væsker.',
  },
  {
    id: 'ringbue', ord: 'Ringbue',
    former: ['ringbue', 'ringbuen', 'ringbuer', 'ringbuerne'],
    // UN5. Neptuns Adams-ring (NSSDC, Wikipedia "Rings of Neptune")
    tekst: 'Et stykke af en planetring, hvor støvet er samlet i en klump i stedet for at være spredt hele vejen rundt. Neptuns yderste ring har buer. Voyager 2 så fem i 1989.',
  },
  {
    id: 'nordlys', ord: 'Nordlys',
    former: ['nordlys', 'nordlyset'],
    // Jupiter: "hundreds of times brighter than those seen on Earth" (Webb 2025, Hubble 2016), fakta del 5, A7
    tekst: 'Lys højt oppe i luften nær polerne. Ladede partikler bliver ført ned mod polerne af planetens magnetfelt og rammer luften, så den lyser. På Jorden kommer partiklerne fra Solen. Jupiters nordlys er hundredvis af gange kraftigere end Jordens.',
    // Kilder: docs/fakta-ordbog.md, "Nordlys"
    mere: [
      ['Hvorfor er det grønt og rødt?', 'Hvert stof i luften lyser med sine egne farver. Det grønne, som er det mest almindelige, kommer fra oxygenatomer over 100 km oppe. Oxygen kan også lyse rødt, men så skal atomet være i fred længe, før det sender lyset ud, og det er det kun højere oppe, hvor luften er meget tynd. Længere nede støder det ind i andre atomer først. Nitrogen giver blå og violette kanter forneden.'],
      ['Hvorfor kun nær polerne?', 'Jordens magnetfelt er et skjold, der leder de ladede partikler uden om Jorden. Men ved polerne går magnetfeltets linjer ned i Jorden, og partiklerne kan følge dem ned. Derfor lyser nordlyset typisk i en ring rundt om hver af de magnetiske poler, fx over Nordnorge og Island. Ved kraftige solstorme bliver ringen større, og så kan man se nordlys i Danmark, som i maj 2024.'],
    ],
  },
  {
    id: 'ultraviolet', ord: 'Ultraviolet lys',
    former: ['ultraviolet', 'ultraviolette', 'uv-lys'],
    // J5 (Jupiters nordlys). Bølgelængden ca. 10-400 nm, kortere end violet lys (ca. 380-400 nm)
    tekst: 'Lys med kortere bølgelængde end det violette lys, vi kan se. Vores øjne kan ikke se det, men det er det, der giver solskoldning. Rumteleskopet Hubble kan se det, og Jupiters nordlys lyser kraftigt i ultraviolet lys.',
  },
];
