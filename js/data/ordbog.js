// Ordforklaringer: korte forklaringer af fagord. Første gang et ord står i en tekst, kan man trykke på det (se js/ordforklaring.js).
// ord: overskriften i forklaringen. former: alle de måder, ordet står på i teksterne (små bogstaver, mellemrum er tilladt).
// Hold teksterne korte (2-3 sætninger) og i et sprog, en 13-årig forstår. Tal skal være tjekket (se docs/erfaringer.md, tjekliste B).

export const ORDBOG = [
  {
    id: 'neutrino', ord: 'Neutrino',
    former: ['neutrino', 'neutrinoen', 'neutrinoer', 'neutrinoerne'],
    // Neutrinoer fra Solen: ca. 6,5·10¹⁰ pr. cm² pr. sekund ved Jorden
    tekst: 'En bittelille partikel uden ladning, som næsten ikke vejer noget. Den reagerer næsten aldrig med noget og flyver lige gennem hele Jorden. Hvert sekund suser ca. 65 milliarder neutrinoer fra Solen gennem et område på størrelse med din tommelfingernegl (1 cm²).',
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
  },
  {
    id: 'isotop', ord: 'Isotop',
    former: ['isotop', 'isotopen', 'isotoper', 'isotoperne'],
    tekst: 'Udgaver af det samme grundstof med forskelligt antal neutroner. Carbon-12 og carbon-14 er begge carbon (6 protoner), men de har 6 og 8 neutroner.',
  },
  {
    id: 'ion', ord: 'Ion',
    former: ['ion', 'ionen', 'ioner', 'ionerne'],
    tekst: 'Et atom med for få eller for mange elektroner. Så er det elektrisk ladet: plus, hvis der mangler elektroner, og minus, hvis der er for mange.',
  },
  {
    id: 'mev', ord: 'MeV',
    former: ['mev'],
    tekst: 'Mega-elektronvolt: en million elektronvolt. En elektronvolt er den energi, en elektron får, når den bliver skubbet gennem en spænding på 1 volt. En kemisk reaktion giver nogle få elektronvolt pr. atom, en kernereaktion millioner.',
  },
  {
    id: 'plasma', ord: 'Plasma',
    former: ['plasma', 'plasmaet'],
    tekst: 'Gas, der er så varm, at nogle af eller alle elektronerne er revet løs fra atomkernerne. Stjerner og lyn er plasma. Det kaldes stoffets fjerde tilstand (efter fast stof, væske og gas).',
  },
  {
    id: 'fusion', ord: 'Fusion',
    former: ['fusion', 'fusionen'],
    tekst: 'Når lette atomkerner smelter sammen til en tungere kerne. Det frigør energi og får Solen og de andre stjerner til at lyse det meste af deres liv.',
  },
  {
    id: 'fission', ord: 'Fission',
    former: ['fission', 'fissionen'],
    tekst: 'Når en tung atomkerne (fx uran-235) flækker i to mindre kerner. Det frigør energi og bruges i atomkraftværker. Det kaldes også spaltning.',
  },
  {
    id: 'halveringstid', ord: 'Halveringstid',
    former: ['halveringstid', 'halveringstiden', 'halveringstider'],
    tekst: 'Den tid, der går, før halvdelen af de radioaktive kerner af en slags er henfaldet. Hvornår netop én kerne henfalder, er helt tilfældigt.',
  },
  {
    id: 'radioaktiv', ord: 'Radioaktiv',
    former: ['radioaktiv', 'radioaktivt', 'radioaktive'],
    tekst: 'Et stof er radioaktivt, når dets atomkerner er ustabile og før eller siden henfalder. Når de henfalder, sender de stråling ud.',
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
    id: 'halvskygge', ord: 'Halvskygge',
    former: ['halvskygge', 'halvskyggen'],
    tekst: 'Den lysere del af en skygge i rummet, rundt om kerneskyggen. Herfra er kun en del af Solen dækket, så der er stadig lys, bare mindre.',
  },
  {
    id: 'toeris', ord: 'Tøris',
    former: ['tøris'],
    // CO₂ bliver til gas ved −78,5 °C ved 1 atm uden at smelte
    tekst: 'Frossen kuldioxid (CO₂). Her på Jorden er den ca. −78 °C kold, og den bliver til gas uden at smelte først. På Mars fryser en del af luften til tøris ved polerne om vinteren.',
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
  },
];
