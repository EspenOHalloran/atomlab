// Teksterne i højre panel ved Mars (siden i lag, U3 i docs/plan-ux.md): Mars' egen side (SIDE) og en side for hvert sted
// og hver måne i træet (SIDER). Underteksten på stedet (bjælkens linje) står i TUR i js/kosmos/mars.js og må ikke stå
// igen her. Faktatjekket i docs/fakta-solsystemet.md (del 3, "Faktatjek M5a", "M5b", "M6b", "M8a", "M8b" og "Faktatjek U3").
// Uden Three.js, så teksterne kan testes i Node.

import { sted, kontakt, handling, tur, tid } from '../../sideknap.js';

const BJERGE = 'Bjergene 10 gange højere';
const TIDEN = tid('spil', '▶ Lad tiden gå');
// Klokken på flybyen, stedets lys og at Mars står stille: det samme ved alle stederne
const klokken = (kl, lys) => `<p>På flybyen drejer programmet Mars, så klokken er ca. ${kl} her. ${lys} Mars står stille, mens du er her. Tryk ${TIDEN}, så går lyset og skyggerne rundt. Mellem to steder drejer programmet Mars hurtigt, så klokken passer, når du lander.</p>`;
const UTYDELIG = '<p>Helt tæt på er landskabet lidt blødt og uskarpt, og programmet holder kameraet mindst 2 km over jorden.</p>';
const HRSC = 'HRSC er et kamera på den europæiske rumsonde Mars Express. Det tager billeder af det samme sted fra lidt forskellige vinkler, ligesom dine to øjne, og ud fra dem kan man regne højderne ud.';

export const SIDE = {
  kort: 'Mars er den fjerde planet fra Solen og ca. halvt så bred som Jorden. Den er rød, fordi støvet indeholder jernoxid, et stof der ligner rust. Bjergene har den rigtige højde.',
  emner: [
    {
      titel: 'Hvorfor ser Mars så glat ud?', kontakt: BJERGE,
      tekst: `<p>Selv Olympus Mons, den største vulkan, vi kender i solsystemet, er kun ca. 0,6 % af Mars' radius. Fra rummet ser Mars derfor næsten glat ud. Alligevel er der ca. 30 km fra toppen af Olympus Mons til bunden af det store krater Hellas.</p>
        <p>Slå ${kontakt(BJERGE)} til, så kan du tydeligt se Olympus Mons og de tre vulkaner ved siden af, kløften Valles Marineris og Hellas. Det meste af den sydlige halvkugle er højland med mange kratere, flere km højere end det glatte lavland i nord.</p>`,
    },
    {
      titel: 'Hvor langt er et døgn og et år?',
      tekst: '<p>Et døgn på Mars varer 24 timer og ca. 40 minutter, næsten som hos os. Aksen hælder 25,2° (Jordens 23,4°), så Mars har årstider ligesom Jorden. Men et år varer 687 jorddøgn, så hver årstid er i snit næsten dobbelt så lang.</p>',
    },
    {
      titel: 'Kan man trække vejret på Mars?',
      tekst: '<p>Nej. Luften er meget tynd, under 1 % af trykket på Jorden, og mest kuldioxid (CO₂). Den er fuld af fint, rødligt støv. Det er koldt: i snit ca. −60 °C. Tyngden er 38 % af Jordens, så vejer du 45 kg, ville du føle dig som ca. 17 kg.</p>',
    },
    {
      titel: 'Hvorfor lyser kanten i modlys?', kontakt: 'Modlys',
      tekst: `<p>Slå ${kontakt('Modlys')} til, så står Solen lige bag kanten af Mars. Den tynde luft lyser som en smal bue, fordi støvet spreder lyset mest fremad. Tæt ved Solen er den lidt blå. Zoom ud, så lyser buen hele vejen rundt.</p>
        <p>Støvet når så højt op, at det stadig er i sollys, når Solen er gået ned. Derfor varer tusmørket på Mars op til ca. 2 timer, og natsiden lyser svagt rødbrunt lige efter grænsen mellem dag og nat. Det fine støv sender blåt lys lettere lige igennem end rødt, så på Mars er himlen blå omkring Solen, når den går ned. Curiosity så det i 2015.</p>`,
    },
    {
      titel: 'Hvad er de hvide pletter ved polerne?',
      tekst: '<p>Polkapperne er hvide af is. Nordpolens kappe er ca. 1.000 km bred og mest frossent vand. Sydpolens er mindre, ca. 400 km, og har et tyndt lag tøris (frossen kuldioxid) ovenpå.</p>',
    },
    {
      titel: 'Hvor kommer skyerne fra?',
      tekst: '<p>Om eftermiddagen stiger varm luft op ad vulkanernes sider og bliver kold, så vanddampen fryser til iskrystaller. Skyerne kommer især om foråret og sommeren på den nordlige halvkugle. Før rumsonderne kunne man i kikkerter fra Jorden se en hvid sky formet som et "W" over Tharsis. Det var skyerne over fire af vulkanerne.</p>',
    },
  ],
  videre: [sted('olympus', 'Olympus Mons'), sted('valles', 'Valles Marineris'), sted('gale', 'Gale og Curiosity'), sted('måner', 'Månerne'), tur('▶ Start flybyen')],
  nørd: `<p><b>Nulpunktet:</b> Mars har intet hav, så højderne er regnet fra en flade, hvor tyngden er lige stærk overalt (areoiden). Den er lidt fladere ved polerne, ligesom Mars selv: ca. 20 km fra pol til pol i forhold til ækvator.</p>
    <p><b>Luften</b> bliver ca. 2,7 gange tyndere for hver 11 km, man kommer op (skalahøjden er 11 km, på Jorden ca. 8,5 km). Set fra rummet er den derfor kun et tyndt, støvet lag i kanten.</p>
    <p><b>Skyen ved Arsia Mons:</b> Hvert år i det sydlige forår vokser der en ca. 1.800 km lang sky ud fra vulkanen Arsia Mons om morgenen. Den er ikke med her, for på tegningen er det forår i nord.</p>`,
  billeder: `<p><b>Højderne</b> er målt med laser fra rumsonden Mars Global Surveyor (instrumentet MOLA, 1997-2001). Kuglen er et net, hvor hvert punkt er løftet eller sænket efter højdekortet, så bjergene rager op over kanten, når de står ude ved horisonten. På det meste af Mars er der ca. 5 km mellem højderne og ca. 21 km mellem nettets punkter. Ved stederne ligger finere net (se Billederne ved hvert sted). Kun nettene ved det sted, du er ved, og det sted, du flyver hen til, tegnes, for hvert net koster billeder i sekundet.</p>
    <p><b>Farverne</b> er en mosaik af billeder fra de to Viking-sonder (1976-1980), lavet af USGS. Kortet har ca. 2,6 km pr. pixel på en pc. Der findes en skarpere udgave, men billederne blev taget, mens Solen stod forskellige steder, så lys og skygge på skrænterne er med på dem. De ville passe dårligt med programmets eget lys, som regnes ud fra højderne.</p>`,
  ærligt: `<p>Mars drejer meget hurtigere end i virkeligheden (en omgang på under 2 minutter i stedet for 24 t 37 min), og den står stille, når du er helt tæt på. Solen er tegnet større, og den står som ved forårsjævndøgn på den nordlige halvkugle.</p>
    <p>Skyerne er tegnet af programmet, men de ligger, hvor skyerne plejer at være, og kommer om eftermiddagen. Polkapperne er vist, som de ser ud om sommeren. Om vinteren dækker et tyndt lag tøris et meget større område omkring polen. Hvor kraftigt luften og tusmørket lyser, er gættet ud fra billeder og ikke regnet. Den støvede himmel er tegnet ud fra skalahøjden, men farven er gættet. "Modlys" flytter Solen om bag kanten af Mars.</p>
    <p>Månerne Phobos og Deimos er tegnet større, når de er langt væk, ellers kunne de ikke ses.</p>`,
};

export const SIDER = {
  olympus: {
    tal: [['Højde', 'ca. 22 km over landet omkring'], ['Bredde', 'ca. 600 km'], ['Areal', 'ca. 7 × Danmark']],
    kort: 'Olympus Mons er ca. 2½ gange så høj som Mount Everest og dækker ca. 300.000 km². Herfra ser du hele vulkanen.',
    emner: [
      {
        titel: 'Hvordan blev den så stor?',
        tekst: '<p>Olympus Mons er en skjoldvulkan: Tusindvis af strømme af tynd lava er flydt ud lag på lag og har bygget et bredt, fladt bjerg, ligesom vulkanerne på Hawaii, bare meget større.</p>',
      },
      {
        titel: 'Kan man se, at man står på et bjerg?',
        tekst: '<p>Nej. Siderne skråner kun nogle få grader. Står man på toppen, kan man ikke se, at man står på et bjerg, for horisonten er kun ca. 3 km væk, og skråningen fortsætter langt bag den.</p>',
      },
      {
        titel: 'Hvorfor ser den så flad ud herfra?', kontakt: BJERGE,
        tekst: `<p>Vulkanen er ca. 27 gange bredere, end den er høj, og siderne skråner kun nogle få grader. Slå ${kontakt(BJERGE)} til, så ser du formen tydeligere.</p>`,
      },
    ],
    videre: [sted('caldera', 'Calderaen'), sted('skraent', 'Skrænten'), sted('tharsis', 'Tharsis')],
    billeder: `<p>Ved Olympus Mons ligger et ekstra, fint net over et område på ca. 1.000 × 1.000 km. Her er højderne fra HRSC lagt sammen med MOLA. ${HRSC} I programmet er der ca. 0,5 km mellem højderne og ca. 2 km mellem nettets punkter (ca. 2,6 km på tablets). Farverne har ca. 1 km pr. pixel her.</p>`,
    ærligt: klokken('7 om morgenen', 'Så viser de lange skygger formen, og skyerne er ikke kommet endnu.') + UTYDELIG,
  },
  caldera: {
    tal: [['Størrelse', 'ca. 65 × 80 km'], ['Dybde', 'op til ca. 3 km'], ['Kratere', 'mindst 6'], ['Alder', 'ca. 100-400 mio. år']],
    kort: 'Kraterne på toppen af Olympus Mons er ikke lavet af nedslag. De opstod, da taget over vulkanens kammer med smeltet sten sank ned, igen og igen.',
    emner: [
      {
        titel: 'Hvordan blev kraterne dannet?',
        tekst: '<p>Hvert krater (en caldera) blev dannet, når et udbrud havde tømt meget af kammeret med smeltet sten under toppen. Så sank taget over kammeret ned. Det er sket mindst seks gange, og de yngste kratere skærer sig ind i de ældre.</p>',
      },
      {
        titel: 'Hvor gamle er de?',
        tekst: '<p>Ud fra hvor mange små kratere fra nedslag der er på bunden, er kraterne nogle hundrede millioner år gamle. Skønnene går fra ca. 100 til 400 millioner år.</p>',
      },
      {
        titel: 'Hvor højt oppe er vi?',
        tekst: '<p>Kanten ligger ca. 20-21 km over Mars\' nulpunkt. Her er lufttrykket kun ca. 10-15 % af trykket i snit ved Mars\' overflade.</p>',
      },
      {
        titel: 'Hvorfor er nogle vægge mørke?',
        tekst: '<p>Det er morgen, og Solen står lavt i øst. Derfor ligger de vægge, der vender mod vest, i skygge.</p>',
      },
    ],
    videre: [sted('olympus', 'Hele Olympus Mons'), sted('skraent', 'Skrænten')],
    billeder: '<p>Omkring calderaen og skrænten ligger et detaljekort med ca. 0,2 km mellem højderne (fra HRSC), næsten lige så tæt som i målingerne. Det kort hentes først, når du nærmer dig.</p>',
    ærligt: klokken('8 om morgenen', '') + '<p>Helt tæt på er landskabet stadig lidt blødt og uskarpt, for der er ca. 0,2 km mellem højderne og ca. 1 km mellem farverne. Programmet holder kameraet mindst 2 km over jorden.</p>',
  },
  skraent: {
    tal: [['Højde', 'op til ca. 8 km'], ['Her', 'ca. 8 km ned på ca. 20 km'], ['Skredene', 'op til ca. 750 km ud']],
    kort: 'Skrænten går rundt om det meste af Olympus Mons. Ingen af de andre skjoldvulkaner på Mars har sådan en kant.',
    emner: [
      {
        titel: 'Hvor høj er den?',
        tekst: '<p>Skrænten er nogle steder op til ca. 8 km høj. Her mod nordvest er den højest i programmets kort. Mount Everest er 8,8 km over havet.</p>',
      },
      {
        titel: 'Hvordan blev den dannet?',
        tekst: '<p>Det ved man ikke sikkert. Måske er vulkanen langsomt gledet ud til siderne under sin egen vægt, eller store stykker af kanten er styrtet ned i kæmpe jordskred. Det rillede landskab ude på sletten mod nordvest kan være rester af sådanne skred. Det når op til ca. 750 km ud.</p>',
      },
      {
        titel: 'Hvorfor ligger skrænten i skygge?',
        tekst: '<p>Det er morgen, og Solen står lavt i øst bag skrænten. Derfor ligger skrænten i skygge, og den støvede luft lyser omkring Solen.</p>',
      },
    ],
    videre: [sted('olympus', 'Hele Olympus Mons'), sted('caldera', 'Calderaen')],
    billeder: '<p>Omkring calderaen og skrænten ligger et detaljekort med ca. 0,2 km mellem højderne (fra HRSC), næsten lige så tæt som i målingerne.</p>',
    ærligt: '<p>"Ca. 8 km ned på ca. 20 km" er målt i programmets højdekort, ikke slået op i en artikel.</p>'
      + klokken('8 om morgenen', '') + UTYDELIG,
  },
  tharsis: {
    tal: [['Bulen', 'ca. 5.000 km bred'], ['Vulkanerne', 'ca. 14-18 km over nulpunktet'], ['Mellem dem', 'ca. 700-800 km'], ['Til Olympus Mons', 'ca. 1.600 km']],
    kort: 'Tharsis er en kæmpe bule i Mars\' skorpe, flere km høj og omtrent lige så stor som Nordamerika. Den dækker op til en fjerdedel af Mars.',
    emner: [
      {
        titel: 'Hvor høje er vulkanerne?', kontakt: BJERGE,
        tekst: `<p>Pavonis Mons i midten er lavest, ca. 14 km over Mars' nulpunkt. Ascraeus Mons mod nordøst og Arsia Mons mod sydvest når ca. 18 km. De er skjoldvulkaner, og hver af dem er flere hundrede km bred. Herfra ser de flade ud, for siderne skråner kun nogle få grader. Prøv ${kontakt(BJERGE)}.</p>`,
      },
      {
        titel: 'Sover vulkanerne bare?',
        tekst: '<p>Vulkanerne har været i udbrud nu og da i milliarder af år. De yngste lavastrømme er måske kun få millioner år gamle, så vulkanerne er måske bare i dvale. Alderen er regnet ud fra, hvor mange små kratere der er på lavaen.</p>',
      },
      {
        titel: 'Kommer der skyer?',
        tekst: '<p>Det er tidlig morgen. Om eftermiddagen samler der sig ofte skyer af is over toppene.</p>',
      },
    ],
    videre: [sted('olympus', 'Olympus Mons'), sted('valles', 'Valles Marineris')],
    billeder: '<p>Ved Tharsis ligger et fint net med højder fra MOLA (ca. 0,9 km mellem højderne), for her var kameraet HRSC ikke skarpere i programmets opløsning.</p>',
    ærligt: klokken('7 om morgenen', 'Så viser de lange skygger formen.') + UTYDELIG,
  },
  valles: {
    tal: [['Længde', 'ca. 4.000 km'], ['Dybde', 'op til ca. 10 km'], ['Bredde i midten', 'op til ca. 600 km'], ['Alder', 'ca. 3,5 mia. år']],
    kort: 'Valles Marineris er lige så lang som fra Lissabon til Moskva og ca. 10 gange længere end Grand Canyon.',
    emner: [
      {
        titel: 'Hvor stor er den?',
        tekst: '<p>Kløften går knap en femtedel af vejen rundt om Mars. Den er op til ca. 10 km dyb, mere end Mount Everest er høj, og ca. 5 gange dybere end Grand Canyon. Her i midten, hvor Melas, Candor og Ophir Chasma mødes, er den op til ca. 600 km bred. Chasma betyder kløft.</p>',
      },
      {
        titel: 'Er den gravet af en flod?',
        tekst: '<p>Nej. Da Tharsis voksede op, blev skorpen omkring den strakt, så den revnede. For ca. 3,5 mia. år siden begyndte landet at synke ned mellem revnerne. Sådan en kløft kaldes en sprækkedal. Bagefter har jordskred og vand i jorden gjort den bredere.</p>',
      },
      {
        titel: 'Hvorfor hedder den Valles Marineris?',
        tekst: '<p>Den er opkaldt efter rumsonden Mariner 9 og holdet bag den. Mariner 9 fandt kløften i 1971-72.</p>',
      },
    ],
    videre: [sted('tharsis', 'Tharsis'), sted('hellas', 'Hellas')],
    billeder: `<p>Ved Valles Marineris ligger et fint net med højder fra HRSC og MOLA. ${HRSC} Midt i kløfterne er der ca. 0,3 km mellem højderne.</p>`,
    ærligt: klokken('9 om morgenen', '') + UTYDELIG,
  },
  hellas: {
    tal: [['Bredde', 'ca. 2.300 km'], ['Laveste sted', 'ca. 8,2 km under nulpunktet'], ['Lufttryk', 'op til ca. 2 × nulpunktets'], ['Alder', 'ca. 4 mia. år']],
    kort: 'Hellas er et af de største nedslagskratere i solsystemet. Det laveste sted på Mars ligger herinde.',
    emner: [
      {
        titel: 'Hvordan blev det dannet?',
        tekst: '<p>For ca. 4 mia. år siden ramte en stor asteroide Mars og sprængte et krater, der er ca. 2.300 km bredt. Det laveste sted ligger ca. 8,2 km under Mars\' nulpunkt. Mars har intet hav, så højderne måles fra et nulpunkt i stedet for fra havet.</p>',
      },
      {
        titel: 'Kunne der være vand her?',
        tekst: '<p>Fordi bunden ligger så dybt, er lufttrykket op til ca. dobbelt så højt som ved nulpunktet. Det er nok til, at is i teorien kunne smelte et øjeblik på en varm dag. Men vandet fordamper så hurtigt, at det nok sjældent eller aldrig sker.</p>',
      },
    ],
    videre: [sted('valles', 'Valles Marineris'), sted('gale', 'Gale og Curiosity')],
    billeder: '<p>Hellas ses fra højt oppe og klarer sig med Mars\' almindelige net (ca. 5 km mellem højderne fra MOLA).</p>',
    ærligt: klokken('9 om morgenen', ''),
  },
  gale: {
    tal: [['Bredde', '154 km'], ['Mount Sharp', 'ca. 5 km over bunden'], ['Curiosity landede', '6. august 2012'], ['Curiosity har kørt', 'ca. 38 km']],
    kort: 'Krateret blev dannet af et nedslag for mere end 3 mia. år siden. Lagene i bjerget i midten fortæller, hvordan Mars\' klima har ændret sig.',
    emner: [
      {
        titel: 'Hvorfor står der et bjerg i krateret?',
        tekst: '<p>Man tror, at krateret blev fyldt op med lag af mudder og sand, som vand og vind lagde. Siden har især vinden slidt meget af det væk igen, og i midten står et bjerg tilbage: Mount Sharp (Aeolis Mons), ca. 5 km højt over kraterbunden.</p>',
      },
      {
        titel: 'Hvad har Curiosity fundet?',
        tekst: '<p>Curiosity er en rover på størrelse med en bil, ca. 3 m lang. Den landede 6. august 2012 nordvest for bjerget. Den har boret i stenene og vist, at her engang lå søer med vand, som mikrober kunne have levet i, måske i en million år eller mere. Den har også fundet organiske stoffer (stoffer bygget af carbon og brint, som liv også er lavet af). Man ved ikke, om de kommer fra liv, eller om de er dannet uden liv. Liv har man ikke fundet.</p>',
      },
      {
        titel: 'Hvor er Curiosity nu?',
        tekst: `<p>I oktober 2026 kører Curiosity stadig efter mere end 14 år. Den er på vej op ad Mount Sharp og er nu ca. 1 km højere oppe end der, hvor den landede. Den har kørt ca. 38 km. Se, hvor den står: ${sted('stå-curiosity', '🧍 Hos Curiosity')}</p>`,
      },
    ],
    videre: [handling('Stå på Mars', '🧍 Stå på Mars'), sted('stå-naukluft', '🧍 Naukluft'), sted('jezero', 'Jezero')],
    billeder: `<p>Ved Gale ligger et fint net med højder fra HRSC og MOLA. ${HRSC} Der er ca. 0,17 km mellem højderne over et område på ca. 356 × 356 km. Det er lige så tæt som i målingerne. Over landingsstedet, Curiositys vej og foden af Mount Sharp ligger et skarpere kort med ca. 32 m mellem højderne (det samme, som bruges, når du står på Mars).</p>`,
    ærligt: klokken('9 om morgenen', 'Solen står lavt i øst (til venstre).') + '<p>Roveren kan ikke ses: Der er ca. 0,17 km mellem højderne og ca. 1 km mellem farverne.</p>',
  },
  jezero: {
    tal: [['Bredde', 'ca. 45 km'], ['En sø', 'for over 3½ mia. år siden'], ['Perseverance har kørt', 'over 45 km'], ['Prøver', '30 rør']],
    kort: 'Mudder i en sø kan gemme spor af liv i milliarder af år. Derfor landede roveren Perseverance her 18. februar 2021.',
    emner: [
      {
        titel: 'Hvordan var søen?',
        tekst: '<p>For mere end 3½ mia. år siden var Jezero en sø. En flod løb ind gennem et hul i vestkanten og lagde sand og mudder i en vifte, et delta.</p>',
      },
      {
        titel: 'Har Perseverance fundet liv?',
        tekst: '<p>Indtil nu har Perseverance fyldt 30 rør med prøver: 27 stykker af sten, 2 med løs jord og 1 med luft fra Mars. I juli 2024 fandt den en sten (Cheyava Falls) med små pletter, der ligner en leopards. Pletterne er måske et biospor (et spor efter liv), men de kan også være lavet af kemi uden liv. Det har forskerne endnu ikke kunnet afgøre.</p>',
      },
      {
        titel: 'Hvad lavede helikopteren Ingenuity?',
        tekst: '<p>Perseverance havde en lille helikopter med, Ingenuity, den første, der har fløjet på en anden planet. Den fløj 72 gange, selv om den kun skulle flyve 5. Ved landingen efter den sidste flyvning i januar 2024 gik et rotorblad i stykker.</p>',
      },
      {
        titel: 'Hvor er Perseverance nu?',
        tekst: '<p>I oktober 2026 er Perseverance kørt op over kraterets vestrand og undersøger nogle af de ældste sten, den har set. Den har kørt over 45 km, længere end nogen anden rover. Prøverne skulle hentes til Jorden af en anden mission, Mars Sample Return. Men den plan er stoppet, og ingen ved, om eller hvornår prøverne kommer hjem.</p>',
      },
    ],
    videre: [handling('Stå på Mars', '🧍 Stå på Mars'), sted('stå-landing', '🧍 Landingsstedet'), sted('gale', 'Gale og Curiosity'), sted('nordpol', 'Nordpolen')],
    billeder: `<p>Ved Jezero ligger et fint net med højder fra HRSC og MOLA, med ca. 0,17 km mellem højderne. ${HRSC} Over krateret og deltaet ligger et skarpere kort med ca. 32 m mellem højderne. Det er lavet af kortene til Perseverances landing (HiRISE og CTX). Kortet over hele krateret er sat sammen af striber, og hvor to striber mødes, kan du se svage, lige streger hen over kraterbunden.</p>`,
    ærligt: '<p>Deltaets kant er kun ca. 40 m høj. Herfra kan du lige ane den, og roveren kan slet ikke ses: Der er ca. 32 m mellem højderne og ca. 1 km mellem farverne. Stå på Mars ved landingsstedet, så ser du kanten tæt på.</p>'
      + klokken('7½ om morgenen', 'Krateret er så lavt, at det først ses med lange skygger. Solen står lavt i øst (til højre).'),
  },
  nordpol: {
    tal: [['Iskappen', 'ca. 1.000 km bred'], ['Tykkelse', 'op til ca. 3 km'], ['Mest', 'frossent vand'], ['Solen om sommeren', 'ca. 22-28° oppe']],
    kort: 'Isen ligger lag på lag med støv imellem, og kløfterne snor sig ud fra midten som en spiral.',
    emner: [
      {
        titel: 'Hvad er isen lavet af?',
        tekst: '<p>Isen er mest frossent vand (ikke tøris) med lidt støv, lag på lag. Lagene fortæller om Mars\' klima, lidt ligesom årringe i et træ. Men et lag er ikke ét år. Lagene skifter nok, når Mars\' hældning langsomt ændrer sig over mange tusinde år.</p>',
      },
      {
        titel: 'Hvorfor snor kløfterne sig som en spiral?',
        tekst: '<p>Radarmålinger har vist, at kløfterne er formet af kolde, tunge vinde, der falder ned ad isen og bliver bøjet til siden, fordi Mars drejer. Den store kløft Chasma Boreale er ca. 500 km lang og op til 2 km dyb.</p>',
      },
      {
        titel: 'Hvorfor går Solen ikke ned?',
        tekst: `<p>Vi har spolet frem til midt på sommeren på den nordlige halvkugle. Nu hælder nordpolen ca. 25° mod Solen, så her står Solen ca. 22-28° over horisonten hele døgnet og går aldrig ned. Det kaldes midnatssol. Tryk ${TIDEN}: Lyset og skyggerne går rundt, men det bliver aldrig nat.</p>`,
      },
      {
        titel: 'Hvad sker der om vinteren?',
        tekst: '<p>Om vinteren ligger der også et lag tøris på et par meter, langt ud over kappen. Hvert år fryser ca. en fjerdedel af Mars\' luft til tøris ved polerne, mest ved sydpolen. Om foråret bliver den til luft igen.</p>',
      },
    ],
    videre: [sted('jezero', 'Jezero'), sted('måner', 'Månerne')],
    billeder: '<p>Nordpolen ses fra højt oppe og klarer sig med Mars\' almindelige net. Et net i bredde og længde virker heller ikke ved polen, hvor alle længdegrader mødes.</p>',
    ærligt: '<p>Her spoler programmet frem til midt på sommeren i nord, så du kan se midnatssolen, og tilbage til foråret, når du flyver videre. Polkappen er vist, som den ser ud om sommeren.</p>',
  },
  måner: {
    tal: [['Phobos rundt', '7 t 39 min'], ['Deimos rundt', 'ca. 30 timer'], ['Opdaget', '1877']],
    kort: 'Mars har to små måner, Phobos og Deimos. Begge er kun nogle få titals km lange og kredser tæt på Mars, lige over ækvator. Tryk på en måne for at besøge den.',
    emner: [
      {
        titel: 'Hvorfor står Phobos op i vest?',
        tekst: '<p>Phobos (inderst) runder Mars hurtigere, end Mars drejer. Derfor står den op i vest og går ned i øst. Deimos (yderst) er lidt langsommere end Mars og står op i øst. Her går tiden lige så hurtigt for månerne som for Mars.</p>',
      },
      {
        titel: 'Hvem fandt dem?',
        tekst: '<p>Den amerikanske astronom Asaph Hall fandt Deimos i august 1877 og Phobos seks dage senere. Han brugte dengang verdens største linsekikkert (66 cm). Navnene er fra græsk mytologi: Phobos og Deimos er sønner af krigsguden Ares (romernes Mars). Phobos betyder frygt, og Deimos betyder rædsel.</p>',
      },
      {
        titel: 'Hvor kommer de fra?',
        tekst: '<p>Det ved man ikke endnu. Måske er de asteroider, som Mars har fanget. Men så ville banerne nok være aflange og hælde. I stedet er banerne næsten runde og ligger lige over Mars\' ækvator. Måske er månerne samlet af stumper, der blev slynget ud, da noget stort ramte Mars.</p>',
      },
      {
        titel: 'Hvad er de lavet af?',
        tekst: '<p>Almindelig sten vejer ca. 3 g pr. cm³, men Phobos kun ca. 1,9 og Deimos ca. 1,5. Derfor er de nok fulde af hulrum (porøse), måske som en bunke løse sten. De er mørke som asfalt: Kun ca. 7 % af lyset kastes tilbage.</p>',
      },
    ],
    videre: [sted('phobos', 'Phobos'), sted('deimos', 'Deimos')],
    nørd: '<p><b>Hvorfor kommer Phobos nærmere?</b> Phobos kredser inden for den afstand (ca. 20.400 km fra Mars\' midte), hvor en måne ville runde Mars på samme tid, som Mars drejer én gang om sig selv (24 t 37 min). Derfor bremses den og kommer nærmere. Deimos er uden for og fjerner sig meget langsomt.</p>',
    ærligt: '<p>Månerne er tegnet større, end de er, ellers kunne de ikke ses herfra. De kredser i det rigtige forhold til Mars\' døgn, men banerne ligger præcis i Mars\' ækvatorplan (i virkeligheden hælder de 1-2°).</p>',
  },
  phobos: {
    tal: [['Længde', 'ca. 26 km'], ['Over Mars', 'ca. 6.000 km'], ['En omgang', '7 t 39 min'], ['Stickney', 'ca. 9 km']],
    kort: 'Phobos ligner en mørk, grå kartoffel fuld af kratere og lange, lige riller. Den er den største af Mars\' to måner.',
    emner: [
      {
        titel: 'Hvorfor har Phobos så stort et krater?',
        tekst: '<p>Stickney, det store krater, er ca. 9 km bredt, og Phobos er kun ca. 26 km lang. Forskerne regner med, at nedslaget næsten slog Phobos i stykker. Krateret er opkaldt efter matematikeren Angeline Stickney Hall. Hun var gift med Asaph Hall, som fandt månerne, og hun opmuntrede ham til at blive ved med at lede.</p>',
      },
      {
        titel: 'Hvorfor er Phobos fuld af riller?',
        tekst: '<p>Forskerne er ikke enige om, hvorfor rillerne er der. Måske er de spor efter sten, der rullede og hoppede væk fra Stickney. Måske er de revner, fordi Mars\' tidevandskraft strækker Phobos. Eller måske er de kæder af små kratere fra stumper, der blev slynget op ved nedslag på Mars.</p>',
      },
      {
        titel: 'Hvordan ser den ud fra Mars?',
        tekst: '<p>Phobos runder Mars hurtigere, end Mars drejer. Set fra Mars står den derfor op i vest og går ned i øst, som regel to gange om dagen (ca. hver 11. time). Tæt ved polerne (over ca. 70° nord eller syd) kan den slet ikke ses. Den kredser så tæt på Mars og over ækvator, at Mars\' runding skjuler den.</p>',
      },
      {
        titel: 'Hvor står Solen?',
        tekst: '<p>Solen skinner fra siden og lidt bagfra. Så er Mars i baggrunden mere end halvt belyst, og Stickney ude ved kanten ligger i lav sol.</p>',
      },
    ],
    videre: [sted('phobos-mars', 'Mars set fra Phobos'), sted('deimos', 'Deimos'), sted('måner', 'Begge måner')],
    billeder: '<p>Phobos\' form er et højdekort lavet ud fra billeder fra den europæiske rumsonde Mars Express (og Viking, hvor der manglede billeder), med ca. 100 m mellem højderne. Overfladen er en mosaik af billeder fra Mars Express og Viking.</p>',
    ærligt: '<p>Når du besøger Phobos, står den stille i banen, mens Mars drejer. Kameraet kigger lidt ved siden af månen, så Mars kan ses i baggrunden. På flybyen flytter programmet månen hen, hvor Solen skinner på den fra siden, så den ikke står i Mars\' skygge. Står den i skyggen, når du trykker på den, flytter programmet den også lidt frem i banen. På Phobos\' bagside er en smal stribe af overfladen fyldt ud, hvor kortet manglede.</p>',
  },
  'phobos-mars': {
    tal: [['Mars på himlen', 'ca. 42° bred'], ['Mod Månen hos os', 'ca. 80 gange bredere'], ['Vi står', 'ca. 300 m over Phobos']],
    kort: 'Vi står lige over Phobos på den side, der vender mod Mars, og kigger op. Drej selv rundt, og kig ned på Phobos\' grå overflade og de lange skygger.',
    emner: [
      {
        titel: 'Hvorfor står Mars stille på himlen?',
        tekst: '<p>Phobos drejer én gang om sig selv, mens den runder Mars én gang. Det kaldes bundet rotation. Derfor vender Phobos altid samme side mod Mars, og Mars står næsten stille på Phobos\' himmel.</p>',
      },
      {
        titel: 'Kommer Phobos nærmere?',
        tekst: '<p>Ja. Phobos løfter Mars\' overflade en lille smule, ligesom Månen giver tidevand på Jorden. Bulen kommer lidt for sent, og fordi Phobos runder Mars hurtigere, end Mars drejer, halter den bagefter Phobos og bremser den. Så kommer Phobos nogle få centimeter nærmere Mars hvert år. Om nogle titals millioner år bliver den nok revet i stykker af tidevandskraften til en ring om Mars, eller den styrter ned.</p>',
      },
      {
        titel: 'Hvordan ser Phobos ud fra Mars?',
        tekst: '<p>Set fra Mars er Phobos ca. en tredjedel så bred som fuldmånen hos os. Når den går hen foran Solen, dækker den kun en del af Solen. Perseverance filmede det 2. april 2022, og det varede lidt over 40 sekunder.</p>',
      },
      {
        titel: 'Hvor står Solen?',
        tekst: '<p>Solen står lavt på Phobos\' himmel, og Mars er mere end halvt belyst.</p>',
      },
    ],
    videre: [sted('phobos', 'Phobos udefra'), sted('deimos', 'Deimos')],
    ærligt: '<p>Her står Phobos stille, mens Mars drejer. I virkeligheden runder Phobos Mars hurtigere, end Mars drejer, så fra Phobos ville Mars se ud til at dreje den anden vej, én gang på ca. 11 timer. Højden på ca. 300 m over overfladen er programmets valg.</p>',
  },
  deimos: {
    tal: [['Længde', 'ca. 16 km'], ['Fra Mars\' midte', 'ca. 23.500 km'], ['En omgang', 'ca. 30 timer'], ['Mars på himlen', 'ca. 17°']],
    kort: 'Deimos er den mindste og yderste af Mars\' to måner. Herfra er Mars ca. 17° bred på himlen.',
    emner: [
      {
        titel: 'Hvorfor ser Deimos glattere ud end Phobos?',
        tekst: '<p>Et tykt lag løst støv og grus (regolit) har delvist fyldt kraterne op. Phobos har skarpere kratere og lange riller.</p>',
      },
      {
        titel: 'Hvem har kraterne navn efter?',
        tekst: '<p>Kun to kratere på Deimos har navne: Swift og Voltaire. De er opkaldt efter to forfattere, der i 1700-tallet skrev om to måner om Mars, længe før de blev fundet. Det var et heldigt gæt.</p>',
      },
      {
        titel: 'Hvordan ser den ud fra Mars?',
        tekst: '<p>Deimos runder Mars på ca. 30 timer, lidt langsommere end Mars drejer. Set fra Mars\' ækvator står den op i øst og bevæger sig meget langsomt mod vest: Den er oppe i ca. 2½ døgn ad gangen. Den ligner en klar stjerne, ikke en måne.</p>',
      },
      {
        titel: 'Hvad skal rumsonden MMX?',
        tekst: '<p>Den japanske rumsonde MMX (Martian Moons eXploration) blev sendt op i oktober 2026. Sidst i oktober 2026 var den sund og på vej mod Mars, som den skal nå i 2027. Først skal en lille robotbil, IDEFIX, fra Frankrig og Tyskland lande på Phobos. Så lander MMX selv og henter mindst 10 g af overfladen. Til sidst skal den prøve at flyve forbi Deimos og tage billeder. I 2031 skal prøven lande på Jorden. Så kan forskerne måske afgøre, hvor månerne kommer fra.</p>',
      },
      {
        titel: 'Hvor står Solen?',
        tekst: '<p>Solen står næsten bag dig, så Mars er næsten helt belyst.</p>',
      },
    ],
    videre: [sted('phobos', 'Phobos'), sted('måner', 'Begge måner')],
    billeder: '<p>Deimos\' form er målt af Peter Thomas på billeder fra Viking-sonderne fra 1970\'erne (ca. ½ km mellem punkterne).</p>',
    ærligt: '<p>Deimos\' form er grov, for billederne fra Viking-sonderne var ikke så skarpe. Når du besøger Deimos, står den stille i banen, mens Mars drejer. Kameraet kigger lidt ved siden af månen, så Mars kan ses i baggrunden.</p>',
  },
};

// Stå på Mars (M8a): det samme om billederne og lyset ved begge steder
const LANDSKAB_BILLEDER = '<p>Landskabet er bygget af målinger fra kredsløb. Højdekortet er sat sammen af forskere ved NASA\'s JPL og udgivet af USGS. Tæt på Curiositys vej er højderne regnet ud fra billeder af det samme sted fra to vinkler, taget af kameraet HiRISE på rumsonden Mars Reconnaissance Orbiter. Længere væk er de regnet ud fra kameraerne CTX og HRSC. Der er 1 m mellem højderne. Tæt på dig ligger HiRISE\' billeder (25 cm pr. pixel), længere væk billeder fra CTX (ca. 6 m pr. pixel) og helt ude kortet fra Mars Express. Kortet over hele krateret er sat sammen af striber, og hvor to striber mødes, kan der i det fjerne ses svage, lige streger. Landskabet ligger i fire lag, der glider over i hinanden, og Mars\' krumning er regnet med.</p>';
const LANDSKAB_ÆRLIGT = '<p>Billederne fra kredsløb er grå, og farverne er sat på af programmet ud fra lysstyrken og Viking-kortet. Sten og sand, der er mindre end nogle få meter, er ikke med i højderne, og de små ujævnheder helt tæt på dine fødder er tegnet af programmet. I billederne fra kredsløb skinnede Solen fra en anden retning. Programmet har fjernet det meste af den skygge, men lidt er tilbage i de små ting. Himlens farve, disen og tusmørket er en enkel model. Dine øjne er 1,7 m over jorden (rovernes kameraer sidder ca. 2 m oppe). Phobos og Deimos bevæger sig rigtigt hen over himlen og har den rigtige størrelse, men deres plads er ikke slået op for i dag. Roveren er ikke med.</p>';
const SOLNEDGANG = {
  titel: 'Hvordan går Solen ned på Mars?',
  tekst: `<p>Skub "Klokken på Mars" under Styr, tryk ${TIDEN}, eller tryk ${handling('Solnedgang', '🌅 Solnedgang')}. Så ser du skyggerne vokse og Solen gå ned. Støvet i luften gør det fjerne landskab blegt, og jo mere luft der er imellem, jo blegere. Efter solnedgangen kommer en blå glød, og så stjernerne. Phobos står op i vest og Deimos i øst. Knib eller rul for at zoome som med en kikkert.</p>`,
};
SIDER['stå-naukluft'] = {
  tal: [['Til toppen af Mount Sharp', 'ca. 50 km'], ['Horisonten', 'ca. 3,4 km væk (fladt land)'], ['Curiosity var her', 'april 2016']],
  kort: 'Naukluft er et plateau på Mount Sharps nederste skråninger inde i Gale-krateret. Klipperne er sandsten af sand, som vinden engang blæste sammen til klitter.',
  emner: [
    {
      titel: 'Hvad kan jeg se?',
      tekst: '<p>Mod sydøst ligger Mount Sharp, et bjerg af lag på lag af gammelt mudder og sand, ca. 5 km højt over kraterbunden. Mod nord ser du ud over kraterbunden mod kraterets rand i disen. Curiosity kørte over plateauet i foråret 2016 og tog et billede hele vejen rundt herfra.</p>',
    },
    {
      titel: 'Hvorfor er horisonten så tæt på?',
      tekst: '<p>Mars er mindre end Jorden, så den krummer mere. På fladt land er horisonten kun ca. 3,4 km væk, når dine øjne er 1,7 m over jorden. Programmet regner krumningen med.</p>',
    },
    SOLNEDGANG,
  ],
  videre: [sted('stå-curiosity', '🧍 Hos Curiosity'), sted('gale', 'Op i kredsløb over Gale')],
  billeder: LANDSKAB_BILLEDER,
  ærligt: LANDSKAB_ÆRLIGT,
};
SIDER['stå-curiosity'] = {
  tal: [['Curiosity har kørt', 'ca. 38 km'], ['Højere end landingen', 'ca. 1 km'], ['På Mars siden', 'august 2012']],
  kort: 'Bakkerne omkring skjuler toppen af Mount Sharp. Mod nord er der et hul i bakkerne med udsigt ud over kraterbunden til randen langt væk.',
  emner: [
    {
      titel: 'Hvor langt er Curiosity kommet?',
      tekst: '<p>Roveren landede i 2012 nordvest for bjerget. Siden har den kørt ca. 38 km og er nu på Mount Sharps skråninger, ca. 1 km højere oppe end der, hvor den landede.</p>',
    },
    SOLNEDGANG,
  ],
  videre: [sted('stå-naukluft', '🧍 Naukluft'), sted('gale', 'Op i kredsløb over Gale')],
  billeder: LANDSKAB_BILLEDER,
  ærligt: LANDSKAB_ÆRLIGT,
};

// Stå på Mars ved Jezero (M8b). Tallene er målt i kortene og Perseverances kortdata
// (mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json) og faktatjekket (docs/fakta-solsystemet.md, "Faktatjek M8b").
const JEZERO_BILLEDER = '<p>De skarpeste højder og fotos er lavet af USGS til Perseverances landing. Ud fra dem blev kortet over farlige steder tegnet. Højderne er regnet ud fra billeder af det samme sted fra to vinkler, taget af kameraet HiRISE på rumsonden Mars Reconnaissance Orbiter. Der er 1 m mellem højderne, og HiRISE\' billeder har 25 cm pr. pixel. Længere væk bruges et højdekort over hele krateret fra kameraet CTX (20 m mellem højderne), som holdet bag Perseverance lavede bagefter, og helt ude kortet fra Mars Express. Kortet over hele krateret er sat sammen af striber, og hvor to striber mødes, kan der i det fjerne ses svage, lige streger. Landskabet ligger i fire lag, der glider over i hinanden, og Mars\' krumning er regnet med.</p>';
SIDER['stå-randen'] = {
  tal: [['Højere end landingsstedet', 'ca. 500 m'], ['Til randen på den anden side', 'ca. 45 km'], ['Perseverance var her', 'oktober 2024']],
  kort: 'Du står på indersiden af Jezeros vestrand. Herfra ser du ud over deltaet og den gamle søbund til randen på den anden side af krateret.',
  emner: [
    {
      titel: 'Hvad kan jeg se?',
      tekst: '<p>Mod øst ligger deltaet: lag af sand og mudder, som en flod lagde, da den løb ud i søen for mere end 3½ mia. år siden. Bag det ligger den flade bund af krateret. Perseverance landede dernede, ca. 9 km herfra. Randen på den anden side er lav og slidt og ligger lavere end dig. Helt ude i disen ser du landet bag den.</p>',
    },
    {
      titel: 'Hvorfor kørte Perseverance herop?',
      tekst: '<p>Randen blev rejst, da et stort nedslag lavede krateret. Meget af stenen her blev slået op dybt nedefra, ved dette nedslag og måske også ved ældre nedslag. Perseverance var her i oktober 2024 på vej op. Turen op tog ca. 3½ måned og gik ca. 500 m opad, og i december 2024 nåede den toppen. På den anden side fandt den nogle af de ældste sten, den har set: sandsynligvis mindst 3,9 mia. år gamle.</p>',
    },
    {
      titel: 'Hvor fandt Perseverance Cheyava Falls?',
      tekst: '<p>Knap 2 km mod nord ligger en gammel floddal, Neretva Vallis, hvor vandet løb ind i krateret. Dér fandt Perseverance i juli 2024 stenen Cheyava Falls med små pletter, der ligner en leopards. Pletterne er måske et biospor (et spor efter liv), men de kan også være lavet af kemi uden liv.</p>',
    },
    SOLNEDGANG,
  ],
  videre: [sted('stå-landing', '🧍 Landingsstedet'), sted('jezero', 'Op i kredsløb over Jezero')],
  billeder: JEZERO_BILLEDER,
  ærligt: LANDSKAB_ÆRLIGT,
};
SIDER['stå-landing'] = {
  tal: [['Perseverance landede', '18. februar 2021'], ['Til deltaets front', 'ca. 2-3 km'], ['Ingenuity fløj første gang', '19. april 2021']],
  kort: 'Her på den flade bund af krateret landede Perseverance. Holdet bag roveren kaldte stedet Octavia E. Butler Landing efter en amerikansk forfatter, der skrev science fiction.',
  emner: [
    {
      titel: 'Hvad kan jeg se?',
      tekst: '<p>Mod vest ligger deltaets front: en lav kant, hvor floden engang løb ud i søen. Bag den rejser kraterets rand sig. Omkring dig er den flade søbund med sten og sand. Zoom ind på kanten som med en kikkert.</p>',
    },
    {
      titel: 'Hvordan landede Perseverance?',
      tekst: '<p>Et varmeskjold og en faldskærm bremsede den. Til sidst dalede en slags kran med raketmotorer langsomt ned og sænkede roveren ca. 7 m ned i tre nylonreb. Undervejs tog roveren billeder af jorden under sig og sammenlignede dem med et kort fra kredsløb, så den vidste præcis, hvor den var. Med et kort over farlige steder, lavet på forhånd, valgte den selv et sikkert sted at lande. Kortene, der blev lavet til landingen, er også brugt til landskabet her.</p>',
    },
    {
      titel: 'Hvor fløj Ingenuity første gang?',
      tekst: '<p>Tæt ved landingsstedet fløj helikopteren Ingenuity første gang 19. april 2021. Den steg ca. 3 m op, svævede i 30 sekunder og landede igen. Det var første gang, noget fløj med motor og styring på en anden planet.</p>',
    },
    SOLNEDGANG,
  ],
  videre: [sted('stå-randen', '🧍 Ved randen'), sted('jezero', 'Op i kredsløb over Jezero')],
  billeder: JEZERO_BILLEDER,
  ærligt: LANDSKAB_ÆRLIGT,
};
