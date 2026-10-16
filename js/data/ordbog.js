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
];
