// Mars (M2 i docs/plan-mars.md): kloden med rigtige højder fra MOLA og farverne fra Viking. Står i Solsystemet efter
// Jorden og før Saturn (Mars er tættere på Solen). Tal fra docs/fakta-solsystemet.md (del 3) og NSSDC's faktaark.
// Grafikken ligger i js/solsystem/klippeplanet.js, så Solsystemet kan genbruge den.
//
// 1 enhed = 1.000 km. Mars drejer om sin akse, som hælder 25,19°. Solen står, som ved forårsjævndøgn på den nordlige
// halvkugle, så begge halvkugler får lige meget lys.
//
// M3: luften (skalahøjde 11 km, NSSDC), tusmørket, polkapperne, skyer af is over vulkanerne om eftermiddagen og "Modlys".
// M4c: Mars er et system, som kameraets rejse (js/solsystem/rejse.js) skalerer, flytter og drejer, og flybyen
// (js/solsystem/flyby.js) flyver ned til Olympus Mons, hvor kameraet ser skråt mod horisonten.
// M7a: Over Olympus Mons ligger et fint net med skarpere højder (LOKALE), og flybyen besøger også calderaen og skrænten.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavLuft } from '../solsystem/atmosfaere.js';
import { lavSkyer, lokalTid } from '../solsystem/skyer.js';
import { lavRejse } from '../solsystem/rejse.js';
import { lavFlyby } from '../solsystem/flyby.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { lavFormmåne } from '../solsystem/maane-form.js';

const S = 1000; // km pr. enhed
const MARS_R = 3396.19; // km ved ækvator (den kugle, kortene er lavet til)
const MARS_POL = 3376.2; // km ved polerne (NSSDC)
const HÆLDNING = THREE.MathUtils.degToRad(25.19); // aksens hældning (NSSDC)
// Højdekortets grænser i meter. Skal være de samme som i billeder/solsystem/lav_mars.py.
export const HØJDE_MIN = -8500;
export const HØJDE_MAX = 21500;
const OVERDRIV = 10; // "Bjergene 10 gange højere"
const DREJ = 0.06; // radianer i sekundet (en omgang på ca. 1¾ minut i stedet for 24 t 37 min)
const SKALAHØJDE = 11; // km (NSSDC: 11,0 km). Luften bliver ca. 2,7 gange tyndere for hver 11 km opad.
const TUSMØRKE = 10; // grader ind i natten, hvor støvet højt oppe stadig spreder lys (støv i ca. 50 km højde: R·(1/cos 10° − 1))
// Skyerne over vulkanerne (NASA PIA02049: "Clouds are common over the larger Tharsis volcanoes in mid-afternoon",
// og MSSS' vejrrapport fra MARCI 8. maj 2019, nordligt forår: "Orographic water ice clouds remained steadfast afternoon
// features over Elysium and the major volcanoes of Tharsis").
// Bredde og længde (grader øst) fra USGS' navneliste (Olympus Mons direkte derfra, de andre via Wikipedia).
// Radius: hvor langt ud skyen når (km, omtrentligt).
const SKY_STEDER = [
  { navn: 'Olympus Mons', bredde: 18.4, længde: -134, radius: 330 },
  { navn: 'Ascraeus Mons', bredde: 11.92, længde: -104.08, radius: 300 },
  { navn: 'Pavonis Mons', bredde: 1.48, længde: -112.96, radius: 240, styrke: 0.8 },
  { navn: 'Arsia Mons', bredde: -8.35, længde: -120.09, radius: 240, styrke: 0.7 },
  { navn: 'Alba Mons', bredde: 40.47, længde: -109.6, radius: 380, styrke: 0.7 },
  { navn: 'Elysium Mons', bredde: 25.02, længde: 147.21, radius: 260, styrke: 0.8 }, // MARCI: "over Elysium and the major volcanoes of Tharsis"
];
const SKY_HØJDE = 22; // km over kuglen, over vulkanernes toppe (ellers skærer toppene hårde huller i skyerne)
const MARGEN = 2; // km: så tæt på jorden må kameraet komme
// Mars' måner (M6a i docs/plan-mars.md). Afstand fra Mars' midte og middelradius i km og omløbstid i døgn
// (docs/fakta-solsystemet.md, del 3B, JPL). De kredser i Mars' ækvatorplan (de hælder kun ca. 1-2°) mod uret set fra
// nord og vender samme side mod Mars. vinkel: hvor i banen de starter (grader fra x-aksen, mod uret set fra nord).
// farve: mørk, støvet grå (de kaster kun ca. 7 % af lyset tilbage). Formen og kortene: billeder/solsystem/lav_maaner.py.
const MARS_DØGN = 1.025957; // Mars' stjernedøgn i jorddøgn (24 t 37 min)
const MÅNER = [
  { id: 'phobos', navn: 'Phobos', afstand: 9376, omløb: 0.31891, middel: 11.08, net: [512, 256], kort: true, farve: [0.16, 0.135, 0.11], vinkel: -35,
    tekst: '<p><b>Phobos</b> er den største af Mars\' to måner, men kun ca. 26 km lang og formet som en kartoffel. Det store krater Stickney er ca. 9 km bredt. Phobos kredser kun ca. 6.000 km over Mars og vender altid samme side mod Mars.</p>' },
  { id: 'deimos', navn: 'Deimos', afstand: 23460, omløb: 1.26244, middel: 6.2, net: [256, 128], kort: true, farve: [0.17, 0.145, 0.12], vinkel: 70,
    tekst: '<p><b>Deimos</b> er den mindste af Mars\' to måner, ca. 16 km lang. Den er glattere end Phobos, fordi løst støv har fyldt kraterne op. Deimos kredser ca. 23.500 km fra Mars\' midte og vender altid samme side mod Mars.</p>' },
];
const MÅNERNE_TEKST = '<p><b>Månerne:</b> Mars har to små måner. Phobos (inderst) runder Mars på 7 timer og 39 minutter, hurtigere end Mars drejer. Derfor står den op i vest og går ned i øst. Deimos (yderst) er ca. 30 timer om en omgang. Her går tiden lige så hurtigt for månerne som for Mars. Månerne er tegnet større, end de er, ellers kunne de ikke ses herfra. Tryk på en måne for at besøge den.</p>';
// Lokale kort (M7a): Over et sted ligger et fint net med sit eget højdekort (HRSC og MOLA, ca. 0,5 km pr. pixel) og
// farvekort (js/solsystem/klippeplanet.js, lokalt). Grænserne (grader, øst positiv) skal være de samme som STEDER i
// billeder/solsystem/lav_steder.py. Olympus Mons: ca. 1.000 × 1.000 km om vulkanen, skrænten og lavaen udenfor.
// detalje: et mindre område med et skarpere højdekort (ca. 0,22 km pr. pixel), som hentes, når flybyen nærmer sig et
// sted med detalje (DETALJER i lav_steder.py): ca. 445 × 445 km om calderaen og skrænten.
const LOKALE = [
  { id: 'olympus', nord: 27.5, syd: 9.5, vest: -143.5, øst: -124.5, detalje: { nord: 24, syd: 16.5, vest: -139.5, øst: -131.5 } },
  // M5a: Tharsis-vulkanerne (MOLA, ca. 0,9 km pr. pixel, ca. 1.840 × 1.600 km) og midten af Valles Marineris
  // (HRSC+MOLA, ca. 1.470 × 950 km, form: højden i forhold til bredden) med et detaljekort over Melas, Candor og Ophir.
  { id: 'tharsis', nord: 16, syd: -15, vest: -124, øst: -97 },
  { id: 'valles', nord: 0, syd: -16, vest: -80, øst: -55, form: 0.5, detalje: { nord: -3, syd: -12.5, vest: -77, øst: -67 } },
  // M5b: Gale og Jezero (HRSC+MOLA, ca. 356 × 356 km og ca. 0,17 km pr. pixel, lige så skarpt som kilden, så
  // intet detaljekort). Nordpolen har intet net (et net i bredde og længde virker ikke ved polen).
  { id: 'gale', nord: -2.4, syd: -8.4, vest: 134.8, øst: 140.8 },
  { id: 'jezero', nord: 21.4, syd: 15.4, vest: 74.5, øst: 80.9 },
];

// Steder, flybyen besøger. tid: klokken på stedet (lokal soltid), når man er der. kompas: hvorfra kameraet kigger
// (180° = fra syd). vinkel: kameraets vinkel over horisonten. størrelse: radius af det, der skal være i billedet
// (1 = 1.000 km, Olympus Mons er ca. 600 km bred). Om formiddagen er der ingen skyer over vulkanen, og skyggerne er lange.
// Midten af Olympus Mons fra USGS' navneliste (Gazetteer of Planetary Nomenclature, 18,40° N og 226,00° Ø).
const STEDER = [
  { id: 'olympus', navn: 'Olympus Mons', bredde: 18.4, længde: -134, tid: 7, kompas: 180, vinkel: 10, størrelse: 0.2, lokalt: 'olympus' },
  // Calderaen: midten af kraterne i højdekortet. Kameraet kigger skråt ned fra syd-sydvest.
  { id: 'caldera', navn: 'Calderaen', bredde: 18.4, længde: -133.3, tid: 8, kompas: 200, vinkel: 30, størrelse: 0.04, lokalt: 'olympus', detalje: true },
  // Skrænten mod nordvest, hvor den er højest i højdekortet (ca. 7,8 km fra kanten til foden på ca. 20 km).
  // Kameraet står vest for den, kigger mod øst (mod morgensolen), og skrænten ligger i skygge.
  { id: 'skraent', navn: 'Skrænten', bredde: 22.15, længde: -137.4, tid: 8, kompas: 270, vinkel: 10, størrelse: 0.018, lokalt: 'olympus', detalje: true },
  // M5a. Koordinaterne er fra USGS' navneliste (MDIM 2.1, passer med MOLA). Tharsis: Pavonis Mons i midten, set fra
  // sydvest langs rækken (Arsia forrest, Ascraeus bagerst), med morgensolen fra siden. Valles Marineris: mellem Melas (10,52° S, 72,54° V) og Candor Chasma
  // (6,53° S, 70,78° V). Hellas: midten (42,43° S, 70,50° Ø) fra højt oppe over nordranden.
  { id: 'tharsis', navn: 'Tharsis', bredde: 1.48, længde: -112.96, tid: 7, kompas: 220, vinkel: 18, størrelse: 0.6, lokalt: 'tharsis' },
  { id: 'valles', navn: 'Valles Marineris', bredde: -8.5, længde: -71.5, tid: 9, kompas: 180, vinkel: 25, størrelse: 0.35, lokalt: 'valles', detalje: true },
  { id: 'hellas', navn: 'Hellas', bredde: -42.43, længde: 70.5, tid: 9, kompas: 0, vinkel: 35, størrelse: 1.1 },
  // M5b. Midterne fra USGS' navneliste (MDIM 2.1): Gale 5,367° S, 137,811° Ø, Jezero 18,408° N, 77,687° Ø og
  // Planum Boreum (nordpolens iskappe) 87,32° N, 54,96° Ø. Gale ses fra nord (fra landingsstedets side) mod Mount
  // Sharp med morgensolen fra venstre. Jezero ses fra syd med den lave morgensol fra højre (kl. 7½: Krateret er så lavt,
  // at det først ses med lange skygger), så randen og deltaet mod vest får lys fra siden. sommer: Mars' akse drejes,
  // så det er nordligt sommersolhverv (midnatssol), mens man er ved stedet.
  { id: 'gale', navn: 'Gale', bredde: -5.367, længde: 137.811, tid: 9, kompas: 0, vinkel: 16, størrelse: 0.085, lokalt: 'gale' },
  { id: 'jezero', navn: 'Jezero', bredde: 18.408, længde: 77.687, tid: 7.5, kompas: 180, vinkel: 32, størrelse: 0.03, lokalt: 'jezero' },
  { id: 'nordpol', navn: 'Nordpolen', bredde: 87.32, længde: 54.96, tid: 12, kompas: 90, vinkel: 55, størrelse: 0.6, sommer: true },
];
// Flybyen (M5 giver flere steder)
const TUR = [
  { id: 'mars', titel: 'Mars', tekst: 'Vi flyver ned til Olympus Mons, den største vulkan, vi kender i solsystemet.',
    mere: '<p><b>Flyby:</b> Tryk "Næste" for at flyve videre. Når kameraet står stille, kan du selv dreje rundt.</p>' },
  // Faktatjekket 29. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 2). Horisonten: √(2 · 3.396 km · 1,7 m) ≈ 3,4 km.
  // Arealet: ca. 300.000 km² (Wikipedia) / Danmark ca. 43.000 km² ≈ 7.
  { id: 'olympus', titel: 'Olympus Mons', tekst: 'Den største vulkan, vi kender i solsystemet. Den er ca. 600 km bred og rejser sig ca. 22 km over landet omkring den.',
    mere: '<p><b>Olympus Mons</b> er en skjoldvulkan: Tusindvis af strømme af tynd lava er flydt ud lag på lag og har bygget et bredt, fladt bjerg, ligesom vulkanerne på Hawaii, bare meget større. Siderne skråner kun nogle få grader. Står man på toppen, kan man ikke se, at man står på et bjerg, for horisonten er kun ca. 3 km væk, og skråningen fortsætter langt bag den.</p>'
      + '<p><b>Herfra ser du hele vulkanen.</b> Den dækker ca. 300.000 km², ca. 7 gange så meget som Danmark. Kraterne på toppen og den stejle kant ved foden har deres egne stop på flybyen.</p>' },
  // M7a, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 2). Kanten 19,4-21,1 km over
  // nulpunktet (USGS SIM 3470). Trykket: exp(−20,5 / 11) ≈ 13 % (skalahøjden 9,5-11 km giver 11-15 %).
  { id: 'caldera', titel: 'Calderaen', tekst: 'På toppen ligger seks kratere, der overlapper hinanden. Tilsammen er de ca. 65 × 80 km og op til ca. 3 km dybe.',
    mere: '<p><b>Hvert krater</b> (en caldera) blev dannet, når et udbrud havde tømt meget af kammeret med smeltet sten under toppen. Så sank taget over kammeret ned. Det er sket mindst seks gange, og de yngste kratere skærer sig ind i de ældre. Ud fra hvor mange små kratere fra nedslag der er på bunden, er kraterne nogle hundrede millioner år gamle. Skønnene går fra ca. 100 til 400 millioner år.</p>'
      + '<p><b>Højt oppe:</b> Kanten ligger ca. 20-21 km over Mars\' nulpunkt. Her er lufttrykket kun ca. 10-15 % af trykket i snit ved Mars\' overflade.</p>'
      + '<p><b>Lyset:</b> Det er morgen, og Solen står lavt i øst. Derfor ligger de vægge, der vender mod vest, i skygge.</p>' },
  // Skrænten mod nordvest: ca. 7,8 km fald på ca. 20 km, målt i højdekortet. Mount Everest 8.849 m.
  { id: 'skraent', titel: 'Skrænten', tekst: 'Ved vulkanens kant falder landet her ca. 8 km ned til sletten på ca. 20 km. Det er næsten lige så højt som Mount Everest.',
    mere: '<p><b>Skrænten</b> går rundt om det meste af vulkanen og er nogle steder op til ca. 8 km høj. Her mod nordvest er den højest i kortet: Landet falder ca. 8 km på ca. 20 km. Mount Everest er 8,8 km over havet. Ingen af de andre skjoldvulkaner på Mars har sådan en kant.</p>'
      + '<p><b>Hvordan blev den dannet?</b> Det ved man ikke sikkert. Måske er vulkanen langsomt gledet ud til siderne under sin egen vægt, eller store stykker af kanten er styrtet ned i kæmpe jordskred. Det rillede landskab ude på sletten mod nordvest kan være rester af sådanne skred. Det når op til ca. 750 km ud.</p>'
      + '<p><b>Lyset:</b> Det er morgen, og Solen står lavt i øst bag skrænten. Derfor ligger skrænten i skygge, og den støvede luft lyser omkring Solen.</p>' },
  // M5a, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 3-5 og "Faktatjek M5a"). Afstande
  // mellem vulkanernes midter fra USGS' koordinater: 713 og 808 km. Olympus Mons-Pavonis Mons: ca. 1.600 km.
  { id: 'tharsis', titel: 'Tharsis', tekst: 'Tre kæmpevulkaner på en lige linje: Arsia, Pavonis og Ascraeus Mons. Der er ca. 700-800 km mellem dem.',
    mere: '<p><b>Tharsis</b> er en kæmpe bule i Mars\' skorpe, ca. 5.000 km bred og flere km høj. Den dækker op til en fjerdedel af Mars, omtrent lige så meget som Nordamerika. Olympus Mons ligger ca. 1.600 km mod nordvest.</p>'
      + '<p><b>Tre skjoldvulkaner:</b> Pavonis Mons i midten er lavest, ca. 14 km over Mars\' nulpunkt. Ascraeus Mons mod nordøst og Arsia Mons mod sydvest når ca. 18 km. Hver af dem er flere hundrede km bred. Herfra ser de flade ud, for siderne skråner kun nogle få grader. Prøv "Bjergene 10 gange højere".</p>'
      + '<p><b>Sover de bare?</b> Vulkanerne har været i udbrud nu og da i milliarder af år. De yngste lavastrømme er måske kun få millioner år gamle, så vulkanerne er måske bare i dvale. Alderen er regnet ud fra, hvor mange små kratere der er på lavaen.</p>'
      + '<p><b>Lyset:</b> Det er tidlig morgen. Om eftermiddagen samler der sig ofte skyer af is over toppene.</p>' },
  // Lissabon-Moskva ca. 3.900 km (storcirkel). Ækvatorens omkreds 21.339 km.
  { id: 'valles', titel: 'Valles Marineris', tekst: 'Et system af kløfter, ca. 4.000 km langt og op til ca. 10 km dybt. Her ser du midten, hvor kløfterne er bredest.',
    mere: '<p><b>Ca. 4.000 km lang:</b> knap en femtedel af vejen rundt om Mars, lige så langt som fra Lissabon til Moskva. Kløften er op til ca. 10 km dyb, mere end Mount Everest er høj, og ca. 10 gange længere og 5 gange dybere end Grand Canyon. Her i midten, hvor Melas, Candor og Ophir Chasma mødes, er den op til ca. 600 km bred. Chasma betyder kløft.</p>'
      + '<p><b>Ikke gravet af en flod:</b> Da Tharsis voksede op, blev skorpen omkring den strakt, så den revnede. For ca. 3,5 mia. år siden begyndte landet at synke ned mellem revnerne. Sådan en kløft kaldes en sprækkedal. Bagefter har jordskred og vand i jorden gjort den bredere.</p>'
      + '<p><b>Navnet:</b> Den er opkaldt efter rumsonden Mariner 9 og holdet bag den. Mariner 9 fandt kløften i 1971-72.</p>' },
  { id: 'hellas', titel: 'Hellas', tekst: 'Et kæmpe krater fra et nedslag for ca. 4 mia. år siden. Det er ca. 2.300 km bredt, og bunden er mere end 7 km dyb.',
    mere: '<p><b>Et af de største nedslagskratere i solsystemet:</b> For ca. 4 mia. år siden ramte en stor asteroide Mars og sprængte et krater, der er ca. 2.300 km bredt. Det laveste sted på Mars ligger herinde, ca. 8,2 km under Mars\' nulpunkt.</p>'
      + '<p><b>Mere luft:</b> Fordi bunden ligger så dybt, er lufttrykket op til ca. dobbelt så højt som ved nulpunktet. Det er nok til, at is i teorien kunne smelte et øjeblik på en varm dag. Men vandet fordamper så hurtigt, at det nok sjældent eller aldrig sker.</p>' },
  // M5b, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M5b"). Rovernes status er slået op samme
  // dag: Curiosity ca. 38 km (NASA's kortdata, sol 5045) og 1 km højere end landingsstedet (NASA 26. august 2026).
  // Perseverance 45,22 km (NASA 11. oktober 2026), 30 prøver (NASA's prøveside, juni 2026, og blogs til 19. oktober
  // 2026), Mars Sample Return står i datid på NASA's side (september 2026) og fik 0 dollar i 2026.
  // Deltaets kant: ca. 40 m (NASA-blog "Campaign 2: The Delta Front", 2022).
  { id: 'gale', titel: 'Gale og Curiosity', knap: 'Gale', tekst: 'Et 154 km bredt krater med et ca. 5 km højt bjerg i midten, Mount Sharp. Her har roveren Curiosity kørt rundt siden 2012.',
    mere: '<p><b>Gale</b> blev dannet af et nedslag for mere end 3 mia. år siden. Man tror, at krateret blev fyldt op med lag af mudder og sand, som vand og vind lagde. Siden har især vinden slidt meget af det væk igen, og i midten står et bjerg tilbage: Mount Sharp (Aeolis Mons), ca. 5 km højt over kraterbunden. Lagene i bjerget fortæller, hvordan Mars\' klima har ændret sig.</p>'
      + '<p><b>Curiosity</b> er en rover på størrelse med en bil, ca. 3 m lang. Den landede 6. august 2012 nordvest for bjerget. Den har boret i stenene og vist, at her engang lå søer med vand, som mikrober kunne have levet i, måske i en million år eller mere. Den har også fundet organiske stoffer (stoffer bygget af carbon og brint, som liv også er lavet af). Man ved ikke, om de kommer fra liv, eller om de er dannet uden liv. Liv har man ikke fundet.</p>'
      + '<p><b>Nu (oktober 2026):</b> Curiosity kører stadig efter mere end 14 år. Den er på vej op ad Mount Sharp og er nu ca. 1 km højere oppe end der, hvor den landede. Den har kørt ca. 38 km.</p>'
      + '<p><b>Lyset:</b> Det er morgen, og Solen står lavt i øst (til venstre).</p>' },
  { id: 'jezero', titel: 'Jezero og Perseverance', knap: 'Jezero', tekst: 'Et ca. 45 km bredt krater, der engang var en sø. En flod lagde et delta ved vestkanten. Her landede roveren Perseverance i 2021.',
    mere: '<p><b>En gammel sø:</b> For mere end 3½ mia. år siden var Jezero en sø. En flod løb ind gennem et hul i vestkanten og lagde sand og mudder i en vifte, et delta. Mudder i en sø kan gemme spor af liv i milliarder af år. Derfor landede Perseverance her 18. februar 2021.</p>'
      + '<p><b>Ingenuity:</b> Perseverance havde en lille helikopter med, Ingenuity, den første, der har fløjet på en anden planet. Den fløj 72 gange, selv om den kun skulle flyve 5. Ved landingen efter den sidste flyvning i januar 2024 gik et rotorblad i stykker.</p>'
      + '<p><b>Prøverne:</b> Indtil nu har Perseverance fyldt 30 rør med prøver: 27 stykker af sten, 2 med løs jord og 1 med luft fra Mars. I juli 2024 fandt den en sten (Cheyava Falls) med små pletter, der ligner en leopards. Pletterne er måske et biospor (et spor efter liv), men de kan også være lavet af kemi uden liv. Det har forskerne endnu ikke kunnet afgøre.</p>'
      + '<p><b>Nu (oktober 2026):</b> Perseverance er kørt op over kraterets vestrand og undersøger nogle af de ældste sten, den har set. Den har kørt over 45 km, længere end nogen anden rover. Prøverne skulle hentes til Jorden af en anden mission, Mars Sample Return. Men den plan er stoppet, og ingen ved, om eller hvornår prøverne kommer hjem.</p>'
      + '<p><b>Se godt efter:</b> Deltaets kant er kun ca. 40 m høj, så den kan næsten ikke ses i programmets kort. Det er tidlig morgen, og Solen står lavt i øst (til højre).</p>' },
  // Faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M5b"): NASA PIA13163 og PIA02800, UT Austin
  // (Smith & Holt og Holt m.fl., Nature 27. maj 2010), ASU "Planum Boreum", MSSS "Seasons on Mars" og NSSDC.
  // Solens højde ved sommersolhverv: 25,19° ± (90° − 87,3°) = 22,5°-27,9° (programmet stiller aksen på solhverv).
  { id: 'nordpol', titel: 'Nordpolen', tekst: 'En kappe af is, ca. 1.000 km bred og op til ca. 3 km tyk. Vi har spolet frem til sommer, så Solen går ikke ned her: midnatssol.',
    mere: '<p><b>Isen</b> er mest frossent vand (ikke tøris) med lidt støv. Kappen er ca. 1.000 km bred og op til ca. 3 km tyk, lag på lag af is og støv. Lagene fortæller om Mars\' klima, lidt ligesom årringe i et træ. Men et lag er ikke ét år. Lagene skifter nok, når Mars\' hældning langsomt ændrer sig over mange tusinde år.</p>'
      + '<p><b>Spiralen:</b> Kløfterne snor sig ud fra midten som en spiral. Radarmålinger har vist, at de er formet af kolde, tunge vinde, der falder ned ad isen og bliver bøjet til siden, fordi Mars drejer. Den store kløft Chasma Boreale er ca. 500 km lang og op til 2 km dyb.</p>'
      + '<p><b>Midnatssol:</b> Vi har spolet frem til midt på sommeren på den nordlige halvkugle. Nu hælder nordpolen ca. 25° mod Solen, så her står Solen ca. 22-28° over horisonten hele døgnet og går aldrig ned. Tryk "Drej Mars": Lyset og skyggerne går rundt, men det bliver aldrig nat.</p>'
      + '<p><b>Om vinteren</b> ligger der også et lag tøris på et par meter, langt ud over kappen. Hvert år fryser ca. en fjerdedel af Mars\' luft til tøris ved polerne, mest ved sydpolen. Om foråret bliver den til luft igen.</p>' },
];

// Billederne (se billeder/solsystem/KILDER.md). Farvekortet er 8k på pc og (indtil videre, som en prøve) på tablet,
// hvis grafikkortet kan klare så store billeder. Tests henter 2k. Højdekortet er 4k (2k i tests).
const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const henter = new THREE.TextureLoader();
const lager = new Map(); // filnavn → tekstur. De bliver i grafikkortet, så det går hurtigt at åbne Mars igen.
// Billedet afkodes, før det bruges (image.decode() sker uden for hovedtråden), så det ikke hakker, når det lægges i
// grafikkortet. fejl kaldes, hvis billedet ikke kan hentes.
function hent(navn, færdig, { farve = true, kanaler = 4, anisotropi = 1, rundt = true, fejl } = {}) {
  let b = lager.get(navn);
  if (!b) {
    b = { tekstur: null, fejlet: false, venter: [], fejlVenter: [] };
    lager.set(navn, b);
    henter.load(new URL(navn, MAPPE).href, (t) => {
      t.colorSpace = farve ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      if (kanaler === 2) t.format = THREE.RGFormat; // højden ligger i rød og grøn (sparer hukommelse)
      if (kanaler === 1) t.format = THREE.RedFormat; // gråtoner (månerne)
      if (rundt) t.wrapS = THREE.RepeatWrapping; // kortet går hele vejen rundt (de lokale kort gør ikke)
      t.anisotropy = anisotropi;
      (t.image.decode ? t.image.decode() : Promise.resolve()).catch(() => {}).then(() => {
        b.tekstur = t;
        for (const f of b.venter) f(t);
        b.venter.length = 0;
      });
    }, undefined, () => { // mangler billedet, bruges den jævne farve
      b.fejlet = true;
      for (const f of b.fejlVenter) f();
      b.fejlVenter.length = 0;
    });
  }
  if (b.tekstur) færdig(b.tekstur);
  else if (!b.fejlet) b.venter.push(færdig);
  if (fejl) {
    if (b.fejlet) fejl();
    else if (!b.tekstur) b.fejlVenter.push(fejl);
  }
}
const FORHÅND_TID = 8000; // ms: så længe venter "Start flyby" højst på kortene til første stop

export default {
  id: 'mars',
  navn: 'Mars',
  ikon: '🔴',
  tåger: false, // vores eget solsystem: sort himmel med stjerner
  undertitel: 'Den røde planet',
  kamera: { retning: [0.12, 0.2, 1], radius: MARS_R / S, drej: false },
  tal: [
    ['Mars\' bredde', 'ca. 6.790 km'],
    ['Et døgn', '24 t 40 min'],
    ['Et år', '687 jorddøgn'],
    ['Tyngden', '38 % af Jordens'],
  ],
  kort: `
    <p><b>Mars</b> er den fjerde planet fra Solen og ca. halvt så bred som Jorden. Den er rød, fordi støvet indeholder jernoxid, et stof der ligner rust. Drej kloden med fingeren, musen eller piletasterne, og zoom helt ind.</p>
    <p><b>Bjergene har den rigtige højde.</b> Olympus Mons er den største vulkan, vi kender i solsystemet. Den rejser sig ca. 22 km over landet omkring den, næsten 2½ gange så højt som Mount Everest. Ved siden af ligger tre andre store vulkaner på en række, og mod øst skærer kløften Valles Marineris sig ca. 4.000 km gennem landet, lige så langt som fra Lissabon til Moskva. Den er op til ca. 10 km dyb. Fra toppen af Olympus Mons til bunden af Hellas, det store krater i syd, er der ca. 30 km.</p>
    <p><b>Et døgn</b> på Mars varer 24 timer og ca. 40 minutter, næsten som hos os. Aksen hælder 25,2° (Jordens 23,4°), så Mars har årstider ligesom Jorden. Men et år varer 687 jorddøgn, så hver årstid er i snit næsten dobbelt så lang.</p>
    <p><b>Luften</b> er meget tynd, under 1 % af trykket på Jorden, og mest kuldioxid (CO₂). Den er fuld af fint, rødligt støv, og om eftermiddagen kommer der skyer af is over de store vulkaner. Det er koldt: i snit ca. −60 °C. Tyngden er 38 % af Jordens, så vejer du 45 kg, ville du føle dig som ca. 17 kg.</p>
    <p><b>Polkapperne</b> er hvide af is. Nordpolens kappe er ca. 1.000 km bred og mest frossent vand. Sydpolens er mindre, ca. 400 km, og har et tyndt lag tøris (frossen kuldioxid) ovenpå. Tryk "Modlys", og se den tynde luft lyse i kanten.</p>
    <p><b>Flyby:</b> Tryk "▶ Start flyby", og flyv ned til Olympus Mons, kraterne på toppen og den stejle kant ved foden, videre til de tre vulkaner på Tharsis, kløfterne i Valles Marineris, det kæmpe krater Hellas, kraterne Gale og Jezero, hvor roverne Curiosity og Perseverance landede, og til sidst nordpolen. Ved hvert stop kan du selv dreje rundt og zoome helt ned. Når du ser hele Mars, kan du også trykke på et navn på kloden og flyve direkte derhen.</p>`,
  nørd: `
    <p><b>Højderne</b> er målt med laser fra rumsonden Mars Global Surveyor (instrumentet MOLA, 1997-2001). Kuglen er et net, hvor hvert punkt er løftet eller sænket efter højdekortet, så bjergene rager op over kanten, når de står ude ved horisonten. Fra kredsløb ser Mars alligevel næsten glat ud, for selv Olympus Mons er kun ca. 0,6 % af Mars' radius. Tryk "Bjergene 10 gange højere" for at se landskabet tydeligere.</p>
    <p><b>Ved Olympus Mons</b> ligger et ekstra, fint net over et område på ca. 1.000 × 1.000 km. Her er højderne fra den europæiske rumsonde Mars Express (kameraet HRSC) lagt sammen med MOLA. HRSC tager billeder af det samme sted fra lidt forskellige vinkler, ligesom dine to øjne, og ud fra dem kan man regne højderne ud. I programmet er der ca. 0,5 km mellem højderne og ca. 2 km mellem nettets punkter (ca. 2,6 km på tablets). Omkring calderaen og skrænten er der ca. 0,2 km mellem højderne, næsten lige så tæt som i målingerne. Det kort hentes først, når flybyen nærmer sig. På resten af Mars er det ca. 5 km og ca. 21 km.</p>
    <p><b>Ved Tharsis og Valles Marineris</b> ligger også et fint net. Ved Tharsis er højderne fra MOLA (ca. 0,9 km mellem højderne), for her var HRSC ikke skarpere i programmets opløsning. Ved Valles Marineris er de fra HRSC og MOLA, og midt i kløfterne er der ca. 0,3 km mellem højderne. Ved Gale og Jezero er de fra HRSC og MOLA, med ca. 0,17 km mellem højderne over et område på ca. 356 × 356 km. Det er lige så tæt som i målingerne. Hellas og nordpolen ses fra højt oppe og klarer sig med Mars' almindelige net (et net i bredde og længde virker heller ikke ved polen, hvor alle længdegrader mødes). Kun nettene ved det sted, du er ved, og det sted, du flyver hen til, tegnes, for hvert net koster billeder i sekundet.</p>
    <p><b>Nulpunktet:</b> Mars har intet hav, så højderne er regnet fra en flade, hvor tyngden er lige stærk overalt (areoiden). Den er lidt fladere ved polerne, ligesom Mars selv: ca. 20 km fra pol til pol i forhold til ækvator.</p>
    <p><b>Farverne</b> er en mosaik af billeder fra de to Viking-sonder (1976-1980), lavet af USGS. Kortet har ca. 2,6 km pr. pixel på en pc og ca. 1 km pr. pixel ved Olympus Mons. Der findes en skarpere udgave, men billederne blev taget, mens Solen stod forskellige steder, så lys og skygge på skrænterne er med på dem. De ville passe dårligt med programmets eget lys, som regnes ud fra højderne.</p>
    <p><b>Luften</b> bliver ca. 2,7 gange tyndere for hver 11 km, man kommer op (skalahøjden er 11 km, på Jorden ca. 8,5 km). Set fra rummet er den derfor kun et tyndt, støvet lag i kanten. Støvet når så højt op, at det stadig er i sollys, når Solen er gået ned. Derfor varer tusmørket på Mars op til ca. 2 timer, og natsiden lyser svagt rødbrunt lige efter grænsen mellem dag og nat. Det fine støv sender blåt lys lettere lige igennem end rødt, så på Mars er himlen blå omkring Solen, når den går ned (Curiosity så det i 2015).</p>
    <p><b>Skyerne over vulkanerne:</b> Om eftermiddagen stiger varm luft op ad vulkanernes sider og bliver kold, så vanddampen fryser til iskrystaller. Skyerne kommer især om foråret og sommeren på den nordlige halvkugle. Før rumsonderne kunne man i kikkerter fra Jorden se en hvid sky formet som et "W" over Tharsis. Det var skyerne over fire af vulkanerne. Hvert år i det sydlige forår vokser der også en ca. 1.800 km lang sky ud fra Arsia Mons om morgenen. Den er ikke med her, for på tegningen er det forår i nord.</p>
    <p><b>Ærligt talt:</b> Mars drejer meget hurtigere end i virkeligheden (en omgang på under 2 minutter i stedet for 24 t 37 min), og den står stille, når du er helt tæt på. Solen er tegnet større, og den står som ved forårsjævndøgn på den nordlige halvkugle. Skyerne er tegnet af programmet, men de ligger, hvor skyerne plejer at være, og kommer om eftermiddagen. Polkapperne er vist, som de ser ud om sommeren. Om vinteren dækker et tyndt lag tøris et meget større område omkring polen. Hvor kraftigt luften og tusmørket lyser, er gættet ud fra billeder og ikke regnet. "Modlys" flytter Solen om bag kanten af Mars. På flybyen drejer programmet Mars, så det er tidlig morgen (ca. kl. 7) ved Olympus Mons: Så viser de lange skygger formen, og skyerne er ikke kommet endnu. Mars står stille, mens du er der, medmindre du trykker "Drej Mars". På flybyen er klokken også ca. 8 ved calderaen og skrænten, ca. 7 ved Tharsis og ca. 9 ved Valles Marineris, Hellas og Gale og ca. 7½ ved Jezero (lav sol, så det lave krater kan ses). Mellem to steder drejer programmet Mars hurtigt, så klokken passer, når du lander. Helt tæt på er landskabet stadig lidt blødt og uskarpt, for der er ca. 0,2 km mellem højderne og ca. 1 km mellem farverne. Den støvede himmel er tegnet ud fra skalahøjden, men farven er gættet. Programmet holder kameraet mindst 2 km over jorden. Ved nordpolen spoler programmet frem til midt på sommeren i nord, så du kan se midnatssolen, og tilbage til foråret, når du flyver videre. Roverne kan ikke ses, og deltaet i Jezero næsten heller ikke: Der er ca. 0,17 km mellem højderne og ca. 1 km mellem farverne. Månerne Phobos og Deimos er tegnet større, når de er langt væk, ellers kunne de ikke ses. De kredser i det rigtige forhold til Mars' døgn, men står stille, mens du besøger dem, og banerne ligger præcis i Mars' ækvatorplan (i virkeligheden hælder de 1-2°). Deimos' form er målt på billeder fra Viking-sonderne i 1970'erne og er grov. På Phobos' bagside er en smal stribe af overfladen fyldt ud, hvor kortet manglede.</p>`,

  lav(gruppe, { opdaterKnapper, forklaring, fase, verden }) {
    const { kamera } = verden;
    const orbit = verden.styring; // kameraets styring med mus og fingre
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, zoom: orbit.zoomSpeed, drej: orbit.rotateSpeed };
    orbit.minDistance = 0.001; // rejsen holder selv afstanden (i systemets enheder)
    orbit.maxDistance = 1e5;
    kamera.near = 0.005; // helt tæt på overfladen (5 km)
    kamera.updateProjectionMatrix();
    const maks = verden.renderer.capabilities.maxTextureSize;
    const anisotropi = Math.min(8, verden.renderer.capabilities.getMaxAnisotropy());

    // ---------- Mars ----------
    const net = TEST_HURTIG ? [256, 128] : LAV_KVALITET ? [768, 384] : [1024, 512]; // felter omkring og fra pol til pol
    const skyer = lavSkyer({ radius: MARS_R, polRadius: MARS_POL, højde: SKY_HØJDE, steder: SKY_STEDER, net: LAV_KVALITET ? [192, 96] : [256, 128] });
    const mars = lavKlippeplanet({
      skala: S, radius: MARS_R, polRadius: MARS_POL, højdeMin: HØJDE_MIN, højdeMax: HØJDE_MAX, net, farve: [0.55, 0.3, 0.17],
      luft: { tusmørke: TUSMØRKE, farve: [0.85, 0.55, 0.36], slør: 0.035, skalahøjde: SKALAHØJDE }, is: true, skyer,
    });
    mars.mesh.add(skyer.mesh); // skyerne drejer med Mars
    const luft = lavLuft({ skala: S, radius: MARS_R, polRadius: MARS_POL, H: SKALAHØJDE, hMin: -8, tusmørke: TUSMØRKE, styrke: 0.55 });
    const R = mars.radius;
    const sol = new THREE.Vector3(1, 0.06, 0.62).normalize(); // Solens retning i systemet (lyset kommer herfra)
    // Aksen hælder 25,19° på tværs af Solens retning (nordligt forårsjævndøgn: nordpolen lidt mod kameraet), og ved
    // nordpolen mod Solen (nordligt sommersolhverv, midnatssol). Om sommeren står nordpolen præcis 90° − 25,19° fra
    // Solen (Solen står lidt over vandret i systemet, så en drejning på 25,19° mod Solen ville give for meget).
    const Y0 = new THREE.Vector3(0, 1, 0);
    const vinkelret = Y0.clone().addScaledVector(sol, -Y0.dot(sol)).normalize(); // vinkelret på Solen, mod nord
    const polSommer = sol.clone().multiplyScalar(Math.sin(HÆLDNING)).addScaledVector(vinkelret, Math.cos(HÆLDNING));
    const HÆLD = {
      jævndøgn: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(sol.x, 0, sol.z).normalize(), HÆLDNING),
      sommer: new THREE.Quaternion().setFromUnitVectors(Y0, polSommer),
    };
    const hældFor = (st) => (st?.sommer ? HÆLD.sommer : HÆLD.jævndøgn);
    const hæld = new THREE.Group();
    hæld.quaternion.copy(HÆLD.jævndøgn);
    const omdrejning = new THREE.Group(); // drejer om aksen mod øst (mod uret set fra nord)
    omdrejning.rotation.y = THREE.MathUtils.degToRad(25); // Tharsis og Valles Marineris vender mod kameraet ved start
    omdrejning.add(mars.mesh);
    hæld.add(omdrejning, luft.mesh);
    const system = new THREE.Group(); // hele Mars, som kameraets rejse skalerer, flytter og drejer
    system.add(hæld);
    gruppe.add(system);

    const kortStr = TEST_HURTIG ? '2k' : maks >= 8192 ? '8k' : '4k';
    const højdeStr = TEST_HURTIG ? '2k' : '4k';
    const hentet = { kort: false, højde: false };
    // Når Mars' egne kort er hentet (eller ikke kunne hentes), hentes kortene til første stop på flybyen (forhånd)
    let egneMangler = 2;
    // (queueMicrotask: Er kortene allerede i lager, kommer svaret med det samme, før resten af lav() er kørt)
    const egetKort = () => { if (--egneMangler === 0) queueMicrotask(hentFørsteStop); };
    hent(`mars-${kortStr}.jpg`, (t) => { mars.sætKort(t); hentet.kort = true; egetKort(); }, { anisotropi, fejl: egetKort });
    hent(`mars-hoejde-${højdeStr}.png`, (t) => { mars.sætHøjde(t); hentet.højde = true; egetKort(); }, { farve: false, kanaler: 2, fejl: egetKort });

    // De lokale net. Kortene hentes først, når flybyen eller et besøg skal derhen (lokaltStr: højdekortet).
    const lokalNet = TEST_HURTIG ? [128, 128] : LAV_KVALITET ? [384, 384] : [512, 512];
    const lokaltStr = TEST_HURTIG ? '1k' : '2k';
    const lokale = new Map(LOKALE.map((l) => [l.id, { net: mars.lokalt({ ...l, net: [lokalNet[0], Math.round(lokalNet[1] * (l.form ?? 1))] }), henter: false, hentet: { kort: false, højde: false }, klar: false, vedKlar: [], detalje: l.detalje ? { henter: false, hentet: false } : null }]));
    // Kortene til stedet st (og detaljekortet, hvis st skal helt tæt på)
    // forhånd: kortene lægges i grafikkortet med det samme (ellers sker det, første gang nettet tegnes, og det hakker),
    // og klar() kaldes, når begge kort er klar eller ikke kunne hentes.
    function hentLokalt(st, { forhånd = false, klar } = {}) {
      const l = lokale.get(st?.lokalt);
      if (!l) return;
      const id = st.lokalt;
      if (klar) {
        if (l.klar) klar();
        else l.vedKlar.push(klar);
      }
      if (!l.henter) {
        l.henter = true;
        let mangler = 2;
        const ét = (t) => {
          if (t && forhånd && aktiv) verden.renderer.initTexture(t);
          if (--mangler > 0) return;
          l.klar = true;
          for (const f of l.vedKlar) f();
          l.vedKlar.length = 0;
        };
        hent(`mars-${id}-farve.jpg`, (t) => { l.net.sætKort(t); l.hentet.kort = true; ét(t); }, { anisotropi, rundt: false, fejl: ét });
        hent(`mars-${id}-hoejde-${lokaltStr}.png`, (t) => { l.net.sætHøjde(t); l.hentet.højde = true; ét(t); }, { farve: false, kanaler: 2, rundt: false, fejl: ét });
      }
      if (st.detalje && l.detalje && !l.detalje.henter) {
        l.detalje.henter = true;
        hent(`mars-${id}-detalje-hoejde-${lokaltStr}.png`, (t) => { l.net.sætDetalje(t); l.detalje.hentet = true; }, { farve: false, kanaler: 2, anisotropi, rundt: false });
      }
    }
    // Kun nettene ved stedet og det sted, man flyver hen til, tegnes (ids). De andre skjules, og kuglen tegnes dér.
    function aktivér(ids) {
      for (const [id, l] of lokale) l.net.aktiv = ids.includes(id);
    }
    aktivér([]); // ved hele Mars tegnes ingen lokale net (kortene til første stop hentes på forhånd, se nedenfor)
    const nuværendeNet = () => steder.find((s) => s.id === visning)?.lokalt;
    // Kortene til første stop på flybyen (Olympus Mons, ca. 2,9 MB) hentes på forhånd, når Mars' egne kort er hentet.
    // Indtil de er klar, er "Start flyby" grå. Fejler hentningen eller tager den for lang tid, bliver knappen aktiv
    // efter FORHÅND_TID alligevel.
    let aktiv = true;
    let flybyKlar = false;
    let forhåndUr = null;
    function flybyErKlar() {
      if (flybyKlar || !aktiv) return;
      flybyKlar = true;
      clearTimeout(forhåndUr);
      lavKnapper();
    }
    function hentFørsteStop() {
      if (!aktiv || forhåndUr) return;
      forhåndUr = setTimeout(flybyErKlar, FORHÅND_TID);
      hentLokalt(stedMed(TUR[1].id), { forhånd: true, klar: flybyErKlar });
      hentMåner();
    }
    // Ved et stop på flybyen hentes kortene til det næste stop, så de er klar, når man trykker "Næste"
    function hentNæste(st) {
      const i = TUR.findIndex((s) => s.id === st.id);
      if (i >= 0 && i + 1 < TUR.length) hentLokalt(stedMed(TUR[i + 1].id));
    }

    // Solen: en lille, skarp prik langt væk i lysets retning (fra Mars ser den ca. ⅔ så stor ud som fra Jorden)
    const solKerne = glød(new THREE.Color(3, 2.85, 2.5), LAV_KVALITET ? 0.02 : 0.016);
    const solGlød = glød(0xffe2b0, 0.16, 0.55);
    for (const s of [solKerne, solGlød]) {
      s.material.sizeAttenuation = false;
      s.renderOrder = -1;
      gruppe.add(s);
    }

    // ---------- Kameraets rejse (js/solsystem/rejse.js) ----------
    // Systemet skaleres, flyttes og drejes, så det, vi kigger på, står i midten. Ved et sted peger stedets lodrette
    // retning lige op, og kameraet kan ikke komme ind under bjergene (bund).
    const qPlanet = new THREE.Quaternion();
    const planetDrejning = (qH = hæld.quaternion) => qPlanet.copy(qH).multiply(omdrejning.quaternion); // kuglen → systemet
    const lokal = new THREE.Vector3();
    function bund(p) {
      lokal.copy(p).applyQuaternion(planetDrejning().invert()).divideScalar(R);
      return (mars.overflade(lokal) + MARGEN / MARS_R) * R;
    }
    const rejse = lavRejse({ system, verden, bund });
    let overdriv = 1; // glider mod 1 eller OVERDRIV
    const minOverblik = () => R * (1.012 + 0.0065 * overdriv); // over toppen af Olympus Mons
    rejse.grænser(minOverblik(), R * 15);
    const nul = new THREE.Vector3();
    // Afstanden, så en kugle med denne radius passer i 3D-billedet (mellem panelerne)
    function passer(radius) {
      passerTil(10);
      const f = (verden.målAfstand ?? 40) / 10;
      verden.målAfstand = null;
      return radius * f;
    }

    // ---------- Steder på Mars ----------
    const steder = STEDER.map((st) => ({ ...st, ramme: mars.sted(st.bredde, st.længde) }));
    const stedMed = (id) => steder.find((st) => st.id === id);
    const stedPunkt = new THREE.Vector3();
    const stedOp = new THREE.Vector3();
    const fokusVed = (st) => () => mars.punkt(st.ramme.retning, stedPunkt).multiplyScalar(R).applyQuaternion(planetDrejning());
    const opVed = (st) => () => stedOp.copy(st.ramme.op).applyQuaternion(planetDrejning());
    const solHjælp = new THREE.Vector3();
    // Omdrejningens vinkel, så klokken er st.tid på stedet (Mars drejer mod øst: vinklen vokser, og klokken går frem).
    // Vinklen ændres så lidt som muligt.
    // qH: aksens hældning ved stedet (årstiden)
    function drejningTil(st, qH = hældFor(st)) {
      solHjælp.copy(sol).applyQuaternion(planetDrejning(qH).invert());
      const timer = ((st.tid - lokalTid(st.ramme.retning, solHjælp) + 36) % 24) - 12;
      return omdrejning.rotation.y + (timer * Math.PI) / 12;
    }
    // Retningen fra et sted mod kameraet (i systemets retninger), når omdrejningen har vinklen drej.
    // kompas: hvorfra kameraet kigger (0° = fra nord, 90° = fra øst). vinkel: over horisonten.
    const Y = new THREE.Vector3(0, 1, 0);
    function fraSted(st, drej, kompas, vinkel, qH = hældFor(st)) {
      const { op, nord, øst } = st.ramme;
      const a = THREE.MathUtils.degToRad(kompas), v = THREE.MathUtils.degToRad(vinkel);
      const q = new THREE.Quaternion().setFromAxisAngle(Y, drej).premultiply(qH);
      return new THREE.Vector3()
        .addScaledVector(nord, Math.cos(v) * Math.cos(a))
        .addScaledVector(øst, Math.cos(v) * Math.sin(a))
        .addScaledVector(op, Math.sin(v))
        .applyQuaternion(q);
    }

    let visning = 'mars'; // 'mars' (hele planeten), 'måner' (begge baner), et sted eller en måne ('phobos', 'deimos')
    let drejTur = null; // Mars drejer hen til det rigtige tidspunkt på dagen, mens kameraet flyver
    let hældTur = null; // og aksen drejer hen til årstiden ved stedet (sommer ved nordpolen)
    function hældHen(q) {
      hældTur = hæld.quaternion.angleTo(q) > 1e-6 ? { fra: hæld.quaternion.clone(), til: q } : null;
    }
    function drejHen(til) {
      drejTur = { fra: omdrejning.rotation.y, til };
      if (drejer) {
        drejer = false; // Mars står stille ved stedet
        lavKnapper();
      }
    }
    // Hele Mars: kameraet kigger på midten fra retning (i systemets retninger)
    function flyvTilMars(retning, net = []) {
      aktivér([nuværendeNet(), ...net]);
      hældHen(HÆLD.jævndøgn);
      visning = 'mars';
      rejse.flyv({ fokus: () => nul, afstand: passer(R), retning, min: minOverblik(), max: R * 15, færdig: () => aktivér(net) });
    }
    // Hele Mars med stedet st lidt nord for midten, på det rigtige tidspunkt af dagen (første stop på turen)
    function flyvTilMarsMod(st) {
      hentLokalt(st);
      const drej = drejningTil(st);
      drejHen(drej);
      flyvTilMars(fraSted(st, drej, st.kompas, 65), [st.lokalt]); // nettet ved det første sted er klar
    }
    // Tilbage til hele Mars fra det sted, kameraet er nu
    function tilbage() {
      flyby.afslut();
      fase(null);
      flyvTilMars(kamPos.copy(kamera.position).sub(system.position).applyQuaternion(qHjælp.copy(rejse.drejning).invert()));
      vis();
      lavKnapper();
    }

    // ---------- Månerne Phobos og Deimos (M6a) ----------
    // De ligger i hæld (Mars' ækvatorplan), men ikke i omdrejningen, og kredser mod uret set fra nord i det rigtige
    // forhold til Mars' døgn: Phobos runder Mars ca. 3,2 gange, mens Mars drejer én gang (derfor står den op i vest), og
    // Deimos ca. 0,8 gange. Krop drejes, så længde 0° vender mod Mars. Langt væk tegnes de større, så de kan ses (som
    // Saturns måner), og navnene står over dem (knappen "Navne").
    const baneGruppe = new THREE.Group();
    hæld.add(baneGruppe);
    const måner = MÅNER.map((m) => {
      const form = lavFormmåne({ skala: S, net: TEST_HURTIG ? [m.net[0] / 2, m.net[1] / 2] : m.net, farve: m.farve, middel: m.middel });
      const krop = new THREE.Group();
      krop.add(form.gruppe);
      const plads = new THREE.Group();
      plads.add(krop);
      const a = m.afstand / S;
      const bane = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(Array.from({ length: 256 }, (_, j) => new THREE.Vector3(Math.cos((j / 256) * Math.PI * 2) * a, 0, Math.sin((j / 256) * Math.PI * 2) * a))),
        new THREE.LineBasicMaterial({ color: 0xd8b8a0, transparent: true, opacity: 0, depthWrite: false }),
      );
      const etiket = skilt(m.navn, '#ffe3c2', 1);
      baneGruppe.add(bane, plads, etiket);
      const måne = { ...m, form, krop, plads, bane, etiket, a, forhold: etiket.scale.x / etiket.scale.y, vinkel: THREE.MathUtils.degToRad(m.vinkel), hentet: { form: false, kort: false } };
      sætPlads(måne);
      return måne;
    });
    const måneMed = (id) => måner.find((m) => m.id === id);
    const erMåne = (id) => måner.some((m) => m.id === id);
    // Pladsen i banen (vinklen mod uret set fra nord, som omdrejningen), og længde 0° mod Mars
    function sætPlads(m) {
      m.plads.position.set(Math.cos(m.vinkel), 0, -Math.sin(m.vinkel)).multiplyScalar(m.a);
      m.krop.rotation.y = m.vinkel + Math.PI;
    }
    // Formen og kortene hentes, når Mars' egne kort er hentet (de er små). Kortene lægges i grafikkortet med det samme.
    const måneStr = TEST_HURTIG ? '2k' : '4k';
    function hentMåner() {
      for (const m of måner) {
        hent(`${m.id}-form.png`, (t) => { if (aktiv) { m.form.sætForm(t.image); m.hentet.form = true; } }, { farve: false, rundt: false });
        hent(`${m.id}-${m.id === 'phobos' ? måneStr : '2k'}.jpg`, (t) => {
          if (!aktiv) return;
          m.form.sætKort(t);
          verden.renderer.initTexture(t);
          m.hentet.kort = true;
        }, { farve: false, kanaler: 1, anisotropi });
      }
    }
    // Månens midte i systemets retninger
    const månePunkt = new THREE.Vector3();
    const måneFokus = (m) => () => månePunkt.copy(m.plads.position).applyQuaternion(hæld.quaternion);
    // Besøg en måne: Kameraet står på den side, der vender væk fra Mars (Mars ses bag månen), med Solen fra siden.
    // Månen står stille, mens man er der, men Mars drejer videre.
    function besøgMåne(m) {
      flyby.afslut();
      fase(null);
      aktivér([]);
      visning = m.id;
      const ud = måneFokus(m)().clone().normalize();
      const retning = ud.multiplyScalar(0.9).addScaledVector(sol, 0.8).addScaledVector(Y, 0.3).normalize();
      rejse.flyv({ fokus: måneFokus(m), afstand: passer(m.form.radius * 1.15), retning, min: m.form.radius * 1.3, max: R * 15 });
      forklaring(m.tekst);
      lavKnapper();
    }
    // Begge baner set skråt oppefra
    function visMåner() {
      flyby.afslut();
      fase(null);
      aktivér([nuværendeNet()]);
      hældHen(HÆLD.jævndøgn);
      visning = 'måner';
      rejse.flyv({ fokus: () => nul, afstand: passer((MÅNER[1].afstand / S) * 1.08), retning: new THREE.Vector3(0.2, 0.75, 1).normalize(), min: minOverblik(), max: R * 30, færdig: () => aktivér([]) });
      forklaring(MÅNERNE_TEKST);
      lavKnapper();
    }
    // Den måne, et tryk rammer (inden for et lille stykke, så de er lette at ramme med en finger). Ikke bag Mars.
    const stråle = new THREE.Raycaster();
    const peg = new THREE.Vector2();
    const måneHjælp = new THREE.Vector3();
    const måneSkala = new THREE.Vector3();
    const marsKugle = new THREE.Sphere();
    function måneVed(x, y) {
      const r = lærred.getBoundingClientRect();
      peg.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      stråle.setFromCamera(peg, kamera);
      marsKugle.set(system.position, R * rejse.skala);
      const tilMars = stråle.ray.intersectSphere(marsKugle, måneSkala) ? måneSkala.distanceTo(kamera.position) : Infinity;
      let bedst = null;
      for (const m of måner) {
        if (m.id === visning) continue;
        m.krop.getWorldPosition(måneHjælp);
        const langs = stråle.ray.direction.dot(måneHjælp.clone().sub(kamera.position));
        if (langs <= 0 || langs > tilMars) continue;
        const afstand = stråle.ray.distanceToPoint(måneHjælp);
        const grænse = Math.max(m.form.radius * m.krop.getWorldScale(måneSkala).x * 2.2, langs * 0.03);
        if (afstand < grænse && (!bedst || afstand < bedst.afstand)) bedst = { m, afstand };
      }
      return bedst?.m ?? null;
    }
    // Hvert billede: Solen og Mars' skygge, større langt væk, banerne og navnene
    const månePos = new THREE.Vector3();
    function opdaterMåner(k) {
      const påSted = !(visning === 'mars' || visning === 'måner' || erMåne(visning));
      const baneLys = påSted ? 0 : 0.3 * THREE.MathUtils.smoothstep(rejse.afstand / R, 2.2, 4.5);
      for (const m of måner) {
        m.bane.material.opacity = baneLys;
        m.bane.visible = baneLys > 0.005;
        m.plads.getWorldPosition(månePos);
        const afstand = månePos.distanceTo(kamera.position);
        const rVerden = m.form.radius * k;
        const større = Math.max(1, (afstand * 0.0045) / rVerden);
        m.krop.scale.setScalar(større);
        const str = (afstand * 0.02) / k;
        m.etiket.visible = navneTil() && !påSted && !rejse.flyver && m.id !== visning && (rVerden * større) / afstand < 0.03;
        m.etiket.scale.set(m.forhold * str, str, 1);
        m.etiket.position.copy(m.plads.position).add(månePos.set(0, m.form.radius * større + str * 0.8, 0));
        m.form.sæt(solNu, system.position, R * k);
      }
    }

    // Ned til et sted: Systemet drejes, så stedets lodrette retning peger op, og kameraet ser skråt mod horisonten
    function besøg(st) {
      hentLokalt(st);
      hentNæste(st);
      const drej = drejningTil(st);
      drejHen(drej);
      hældHen(hældFor(st));
      aktivér([nuværendeNet(), st.lokalt]);
      visning = st.id;
      rejse.flyv({ fokus: fokusVed(st), op: opVed(st), afstand: passer(st.størrelse), retning: fraSted(st, drej, st.kompas, st.vinkel), min: 0.003, max: 3, færdig: () => aktivér([st.lokalt]) });
    }

    // ---------- Flybyen (js/solsystem/flyby.js) ----------
    const flyby = lavFlyby({
      stop: TUR, fase, forklaring, skift: () => lavKnapper(),
      flyvTil: (stop) => (stop.id === 'mars' ? flyvTilMarsMod(stedMed(TUR[1].id)) : besøg(stedMed(stop.id))),
      slut: '<p><b>Turen er slut.</b> Drej selv rundt med fingeren eller musen, eller tryk "Hele Mars".</p>',
    });

    // ---------- Knapperne ----------
    let drejer = true;
    let høj = false;
    let modlys = false;
    const styring = [];
    function lavKnapper() {
      const knapper = [];
      if (flyby.kører) knapper.push(...flyby.knapper());
      else {
        if (visning !== 'mars') knapper.push({ tekst: 'Hele Mars', handling: tilbage });
        if (visning !== 'måner') knapper.push({ tekst: 'Månerne', handling: visMåner });
        knapper.push(flybyKlar
          ? { tekst: '▶ Start flyby', handling: () => flyby.start() }
          : { tekst: '▶ Start flyby (henter kort …)', handling: () => {}, deaktiv: () => !flybyKlar });
      }
      knapper.push(
        { tekst: 'Drej Mars', til: drejer, skift: (til) => { drejer = til; } },
        { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; vis(); } },
        { tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; vis(); } },
        navneKnap(() => { opdaterNavne(); opdaterMåner(rejse.skala); vis(); }),
      );
      styring.splice(0, styring.length, ...knapper);
      opdaterKnapper();
    }
    // Teksten i panelet, når man ser hele Mars (ved et sted står stedets tekst)
    function vis() {
      if (visning !== 'mars' || flyby.kører) return;
      if (modlys) {
        forklaring('<p><b>Modlys:</b> Nu står Solen lige bag kanten af Mars. Den tynde luft lyser som en smal bue, fordi støvet spreder lyset mest fremad. Tæt ved Solen er den lidt blå, som Curiosity har set det ved solnedgang på Mars. Zoom ud, så lyser buen hele vejen rundt.</p>');
        return;
      }
      forklaring(høj
        ? '<p><b>10 gange højere:</b> Nu kan du tydeligt se Olympus Mons og de tre vulkaner ved siden af, kløften Valles Marineris og det store krater Hellas. Det meste af den sydlige halvkugle er højland med mange kratere, flere km højere end det glatte lavland i nord.</p>'
        : `<p><b>Mars:</b> Bjergene har den rigtige højde. Selv Olympus Mons er kun ca. 0,6 % af Mars' radius, så set fra rummet er Mars næsten glat. Se skyggerne ved grænsen mellem dag og nat, og se skyerne af is komme over vulkanerne om eftermiddagen, mens Mars drejer.${navneTil() ? ' Tryk på et navn på kloden for at flyve derhen.' : ''}</p>`);
    }
    vis();
    lavKnapper();

    // ---------- Navnene på kloden (M5b) ----------
    // Når man ser hele Mars, står stederne med navn på kloden, og et tryk på et navn flyver derhen (som månerne ved
    // Saturn). Navnene skjules på bagsiden, tæt på, under flyvninger, på flybyen og med knappen "Navne" slået fra
    // (js/solsystem/navne.js). Så flyver et tryk på kloden ingen steder hen.
    const NAVNE = ['olympus', 'tharsis', 'valles', 'hellas', 'gale', 'jezero', 'nordpol'];
    const navne = NAVNE.map((id) => {
      const st = stedMed(id);
      const punkt = st.ramme.retning.clone().multiplyScalar(R * 1.003); // lige over kuglen (navnene ses gennem bjergene)
      const tekst = skilt(st.navn, '#ffe3c2', 1);
      tekst.center.set(0.5, -0.3); // teksten står lige over stedet
      const prik = glød(0xffd9a8, 1, 0.9);
      for (const o of [tekst, prik]) {
        o.material.depthTest = false;
        o.renderOrder = 5;
        o.position.copy(punkt);
        o.visible = false;
        omdrejning.add(o);
      }
      return { st, tekst, prik, forhold: tekst.scale.x / tekst.scale.y, str: 0 };
    });
    let navneVist = false;
    // Et sted valgt med et tryk: flyv derhen, og vis stedets tekst (som på flybyen, men uden prikker)
    function vælgSted(st) {
      const t = TUR.find((x) => x.id === st.id);
      besøg(st);
      opdaterNavne(); // navnene skjules med det samme (ikke først i næste billede)
      fase(t.titel, t.tekst);
      forklaring(t.mere);
      lavKnapper();
    }
    const navnHjælp = new THREE.Vector3();
    const navnOp = new THREE.Vector3();
    // Hvor et navn står på skærmen (pixels): stedet (x, y), tekstens højde h og bredde b
    function påSkærm(n) {
      const r = lærred.getBoundingClientRect();
      n.prik.getWorldPosition(navnHjælp);
      navnOp.set(0, 1, 0).applyQuaternion(kamera.quaternion).multiplyScalar(n.str).add(navnHjælp);
      navnHjælp.project(kamera);
      navnOp.project(kamera);
      const x = r.left + ((navnHjælp.x + 1) / 2) * r.width, y = r.top + ((1 - navnHjælp.y) / 2) * r.height;
      const h = Math.abs(navnOp.y - navnHjælp.y) / 2 * r.height;
      return { x, y, h, b: h * n.forhold };
    }
    // Navnet, et tryk ved (x, y) rammer: teksten (lige over stedet) eller prikken, med lidt luft til fingre
    function navnVed(x, y) {
      let bedst = null;
      for (const n of navne) {
        if (!n.tekst.visible || n.tekst.material.opacity < 0.5) continue;
        const p = påSkærm(n);
        const midtY = p.y - 0.8 * p.h; // tekstens midte (center.y = −0.3)
        const dx = Math.abs(x - p.x) - p.b / 2, dy = Math.abs(y - midtY) - 0.8 * p.h;
        const afstand = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
        if (afstand < 12 && (!bedst || afstand < bedst.afstand)) bedst = { n, afstand };
      }
      return bedst?.n ?? null;
    }
    const lærred = verden.renderer.domElement;
    let ned = null;
    const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
    // Et tryk på et navn på kloden flyver derhen, og et tryk på en måne besøger den (også uden navne). Ved et sted på
    // Mars, på flybyen og under flyvninger sker der intet.
    const vedOp = (h) => {
      if (!ned || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
      ned = null;
      if (flyby.kører || rejse.flyver) return;
      const n = navneVist ? navnVed(h.clientX, h.clientY) : null;
      if (n) {
        vælgSted(n.st);
        return;
      }
      const m = visning === 'mars' || visning === 'måner' || erMåne(visning) ? måneVed(h.clientX, h.clientY) : null;
      if (m) besøgMåne(m);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);
    const navnPos = new THREE.Vector3();
    const navnNormal = new THREE.Vector3();
    const tilKamera = new THREE.Vector3();
    function opdaterNavne() {
      navneVist = navneTil() && visning === 'mars' && !flyby.kører && !rejse.flyver;
      // Tæt på hele Mars fylder navnene for meget (og stederne kan have deres egne net)
      const langtVæk = THREE.MathUtils.smoothstep(rejse.afstand / R, 1.25, 1.6);
      for (const n of navne) {
        n.prik.getWorldPosition(navnPos);
        navnNormal.copy(navnPos).sub(system.position).normalize();
        const afstand = tilKamera.copy(kamera.position).sub(navnPos).length();
        const forside = THREE.MathUtils.smoothstep(navnNormal.dot(tilKamera.divideScalar(afstand)), 0.05, 0.25);
        const a = navneVist ? forside * langtVæk : 0;
        n.tekst.visible = n.prik.visible = a > 0.01;
        n.tekst.material.opacity = a;
        n.prik.material.opacity = 0.9 * a;
        // Samme størrelse på skærmen uanset afstanden
        n.str = afstand * 0.022;
        const k = rejse.skala;
        n.tekst.scale.set((n.forhold * n.str) / k, n.str / k, 1);
        n.prik.scale.setScalar((afstand * 0.012) / k);
      }
    }

    // ---------- Hvert billede: rejsen, lys, Solen og kameraets styring ----------
    const kamPos = new THREE.Vector3();
    const op = new THREE.Vector3(0, 1, 0);
    const opVinkelret = new THREE.Vector3();
    const solNu = new THREE.Vector3().copy(sol);
    const solObj = new THREE.Vector3();
    const hjælpQ = new THREE.Quaternion();
    const qHjælp = new THREE.Quaternion();
    let tid = 0;
    let minNu = minOverblik();
    function hvertBillede(dt) {
      // Mars drejer hen til det rigtige tidspunkt (og årstiden) i takt med flyvningen (før rejsen finder stedet)
      if (drejTur) {
        omdrejning.rotation.y = THREE.MathUtils.lerp(drejTur.fra, drejTur.til, rejse.fremdrift);
        if (!rejse.flyver) drejTur = null;
      }
      if (hældTur) {
        hæld.quaternion.slerpQuaternions(hældTur.fra, hældTur.til, rejse.fremdrift);
        if (!rejse.flyver) hældTur = null;
      }
      // Bjergene vokser og krymper blødt (med "reducer bevægelse" med det samme)
      const mål = høj ? OVERDRIV : 1;
      overdriv = ROLIG ? mål : mål + (overdriv - mål) * Math.exp(-dt * 3);
      if (Math.abs(overdriv - mål) < 0.01) overdriv = mål;
      mars.overdriv = overdriv;
      skyer.overdriv = overdriv;
      if (visning === 'mars' && minOverblik() !== minNu) {
        minNu = minOverblik();
        rejse.grænser(minNu, R * 15);
      }
      rejse.opdater(dt);
      opdaterNavne();
      const k = rejse.skala;
      // I modlys står Solen lige bag den øverste kant af Mars, set fra kameraet. Står den midt bag Mars, ligger
      // luften i kanten i Mars' skygge, når kameraet er tæt på, og så ses ringen ikke. Ved et sted er "øverst" den
      // vej, kameraet kigger, så Solen står lige under horisonten foran kameraet.
      if (modlys) {
        kamPos.copy(kamera.position).sub(system.position); // fra Mars' midte
        const afstand = kamPos.length();
        kamPos.divideScalar(afstand);
        const kantVinkel = Math.asin(Math.min(1, (R * k) / afstand)); // hvor stor Mars ser ud (halvdelen)
        const bag = Math.max(kantVinkel - 0.05, kantVinkel * 0.5); // ca. 3° inden for kanten
        opVinkelret.copy(op).addScaledVector(kamPos, -op.dot(kamPos));
        if (opVinkelret.lengthSq() < 1e-6) opVinkelret.set(1, 0, 0);
        opVinkelret.normalize();
        solNu.copy(kamPos).multiplyScalar(-Math.cos(bag)).addScaledVector(opVinkelret, Math.sin(bag));
      } else solNu.copy(sol).applyQuaternion(rejse.drejning);
      for (const s of [solKerne, solGlød]) s.position.copy(kamera.position).addScaledVector(solNu, 600);
      mars.sæt(solNu);
      luft.sæt(solNu);
      opdaterMåner(k);
      // Solens retning i Mars' egne retninger (til skyernes lokale tid)
      solObj.copy(solNu).applyQuaternion(omdrejning.getWorldQuaternion(hjælpQ).invert());
      skyer.sæt(solObj, solNu, tid);
      // Tæt på overfladen drejer og zoomer man langsommere, så man ikke suser hen over landskabet.
      // Ved et sted drejer man rundt om stedet, og helt nede ved jorden (under ca. 20 km) går det lidt langsommere.
      if (visning === 'mars') {
        const d = rejse.afstand;
        const højde = Math.max(d - R, 0) / d;
        orbit.zoomSpeed = THREE.MathUtils.clamp(højde * 2, 0.06, 1);
        orbit.rotateSpeed = THREE.MathUtils.clamp(højde * 2, 0.04, 1);
      } else {
        kamPos.copy(kamera.position).sub(system.position).applyQuaternion(qHjælp.copy(rejse.drejning).invert()).divideScalar(k);
        const nede = THREE.MathUtils.clamp(((kamPos.length() - bund(kamPos)) * S + MARGEN) / 20, 0.3, 1);
        orbit.zoomSpeed = nede;
        orbit.rotateSpeed = 0.6 * nede;
      }
    }
    verden.opdateringer.add(hvertBillede);

    // Kun til tests: hvor kameraet er i forhold til et sted
    const stedTest = new THREE.Vector3();
    function vedSted(id) {
      const st = stedMed(id);
      const k = rejse.skala;
      const qVerden = new THREE.Quaternion().copy(rejse.drejning).multiply(planetDrejning()); // kuglen → verden
      const opV = st.ramme.op.clone().applyQuaternion(qVerden);
      const midt = system.position.clone(); // Mars' midte i verden
      const stedV = mars.punkt(st.ramme.retning, stedTest).clone().multiplyScalar(R * k).applyQuaternion(qVerden).add(midt);
      const kam = kamera.position.clone();
      // Kameraets højde over jorden (km): i kuglens retninger og radier
      const iKugle = kam.clone().sub(midt).applyQuaternion(qVerden.clone().invert()).divideScalar(R * k);
      const overJorden = (iKugle.length() - mars.overflade(iKugle)) * MARS_R;
      // Kameraets vinkel over stedets horisont, og hvor horisonten står i billedet (grader over midten)
      const tilKamera = kam.clone().sub(stedV).normalize();
      const vinkel = THREE.MathUtils.radToDeg(Math.asin(tilKamera.dot(opV)));
      const kamOp = kam.clone().sub(midt).normalize();
      const frem = new THREE.Vector3();
      kamera.getWorldDirection(frem);
      const ned = Math.asin(THREE.MathUtils.clamp(-frem.dot(kamOp), -1, 1)); // hvor meget kameraet kigger ned
      const horisontNed = Math.acos(Math.min(1, (R * k) / kam.distanceTo(midt))); // horisonten under det vandrette
      solHjælp.copy(sol).applyQuaternion(planetDrejning().invert());
      return {
        op: opV.y, // 1, når stedets lodrette retning peger lige op i verden
        overJorden,
        vinkel,
        horisont: THREE.MathUtils.radToDeg(ned - horisontNed),
        afstand: (kam.distanceTo(stedV) / k) * S, // km fra stedet
        tid: lokalTid(st.ramme.retning, solHjælp),
        fokus: rejse.fokus.distanceTo(fokusVed(st)()) * S, // km fra stedet til det, kameraet kigger på
        solHøjde: 90 - THREE.MathUtils.radToDeg(opVed(st)().angleTo(sol)), // Solens højde over stedets horisont (grader)
      };
    }

    return {
      styring,
      opdater(dt, t) {
        tid = t;
        if (!drejer || drejTur) return;
        // Helt tæt på hele Mars står Mars stille (ellers suser landskabet forbi). Ved et sted følger kameraet med,
        // så dagen går, og skyggerne flytter sig.
        const drej = dt * DREJ * (visning === 'mars' ? THREE.MathUtils.smoothstep(rejse.afstand / R, 1.05, 1.8) : 1);
        omdrejning.rotation.y += drej;
        // Månerne følger Mars' ur i det rigtige forhold, men står stille, mens man besøger en af dem
        if (!erMåne(visning)) {
          for (const m of måner) {
            m.vinkel += (drej * MARS_DØGN) / m.omløb;
            sætPlads(m);
          }
        }
      },
      stop() {
        aktiv = false;
        clearTimeout(forhåndUr);
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
        for (const n of navne) {
          omdrejning.remove(n.tekst, n.prik);
          n.tekst.material.map.dispose();
          n.tekst.material.dispose();
          n.prik.material.dispose();
        }
        for (const m of måner) {
          m.form.stop();
          m.bane.geometry.dispose();
          m.bane.material.dispose();
          m.etiket.material.map.dispose();
          m.etiket.material.dispose();
        }
        hæld.remove(baneGruppe);
        verden.opdateringer.delete(hvertBillede);
        rejse.stop();
        mars.stop();
        skyer.stop();
        luft.stop();
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        orbit.zoomSpeed = gammelt.zoom;
        orbit.rotateSpeed = gammelt.drej;
        kamera.near = gammelt.nær;
        kamera.updateProjectionMatrix();
        fase(null);
      },
      // Kun til tests: omdrejningen, højderne, billedernes størrelse, rejsen og stederne
      test: {
        drejning: () => omdrejning.rotation.y,
        overdriv: () => overdriv,
        billeder: () => ({
          kort: kortStr, højde: højdeStr, net, hentet: { ...hentet }, tabel: mars.harTabel,
          lokalt: Object.fromEntries([...lokale].map(([id, l]) => [id, { højde: lokaltStr, net: lokalNet, hentet: { ...l.hentet }, tabel: l.net.harTabel, klar: l.net.klar, aktiv: l.net.aktiv, detalje: l.detalje && { hentet: l.detalje.hentet, tabel: l.net.harDetaljeTabel } }])),
        }),
        skyer: () => skyer.måling(),
        // Hvor står Solen i forhold til kameraet (−1 = lige bag Mars)
        sol: () => solNu.dot(kamPos.copy(kamera.position).sub(orbit.target).normalize()),
        // Drej Mars, så længdegraden (i grader øst) vender mod kameraet (når man ser hele Mars)
        vend(længde) {
          drejer = false;
          lavKnapper();
          kamPos.copy(kamera.position).sub(system.position).applyQuaternion(qHjælp.copy(rejse.drejning).multiply(hæld.quaternion).invert());
          const vinkel = Math.atan2(-kamPos.z, kamPos.x); // kameraets retning som længdegrad i hældningens retninger
          omdrejning.rotation.y = vinkel - THREE.MathUtils.degToRad(længde);
        },
        ved: () => visning,
        tur: () => ({ trin: flyby.trin, flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand, skubbet: rejse.skubbet }),
        hop: () => rejse.hop(), // gør den igangværende flyvning færdig
        vedSted,
        // Højden over nulpunktet (km, glat) et sted (bredde, længde i grader øst), også med det lokale kort
        højde(bredde, længde) {
          const r = mars.sted(bredde, længde).retning;
          return (mars.punkt(r, stedTest).length() - Math.hypot(r.x, (r.y * MARS_POL) / MARS_R, r.z)) * MARS_R;
        },
        drejningSystem: () => rejse.drejning.toArray(),
        // Navnene på kloden: de viste og hvor et navn står på skærmen (pixels)
        navne: () => navne.filter((n) => n.tekst.visible && n.tekst.material.opacity > 0.5).map((n) => n.st.id),
        navnPlads(id) {
          const n = navne.find((x) => x.st.id === id);
          const p = påSkærm(n);
          return { x: p.x, y: p.y - 0.8 * p.h };
        },
        // Månerne (M6a): vinklen i banen (radianer, mod uret set fra nord), omdrejningen, afstanden fra Mars' midte
        // (km), hvor mange grader længde 0° peger fra Mars, og hvor mange grader 90° V (forsiden) peger fra
        // bevægelsens retning, hvor meget større de er tegnet, om navnet ses, og om formen og kortet er hentet
        måner: () => måner.map((m) => {
          const midt = m.krop.getWorldPosition(new THREE.Vector3());
          const q = m.krop.getWorldQuaternion(new THREE.Quaternion());
          const lon0 = m.form.retning(0, 0).applyQuaternion(q);
          const forside = m.form.retning(0, -90).applyQuaternion(q);
          const tilMars = system.position.clone().sub(midt).normalize();
          const fart = new THREE.Vector3(-Math.sin(m.vinkel), 0, -Math.cos(m.vinkel)).applyQuaternion(hæld.getWorldQuaternion(new THREE.Quaternion()));
          return {
            id: m.id, vinkel: m.vinkel, drejning: omdrejning.rotation.y, afstand: (m.plads.position.length()) * S,
            modMars: THREE.MathUtils.radToDeg(lon0.angleTo(tilMars)), forside: THREE.MathUtils.radToDeg(forside.angleTo(fart)),
            større: m.krop.scale.x, navn: m.etiket.visible, ...m.hentet, radius: m.form.radius * S,
          };
        }),
        // Hvor en måne står på skærmen (pixels), så testen kan trykke på den
        månePlads(id) {
          const p = måneMed(id).krop.getWorldPosition(new THREE.Vector3()).project(kamera);
          const r = lærred.getBoundingClientRect();
          return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
        },
        // Se en måne fra (bredde, længde) i månens egne retninger (til billederne mod fotos). Månen står stille.
        // fra: hvor mange grader månen flyttes i banen fra stedet lige bag Mars set fra Solen (så siden mod Mars er lyst
        // op, som da fotoene blev taget, men uden for Mars' skygge).
        kameraFra(id, bredde, længde, fra = null) {
          const m = måneMed(id);
          if (fra !== null) {
            const solH = sol.clone().applyQuaternion(hæld.quaternion.clone().invert());
            m.vinkel = Math.atan2(-solH.z, solH.x) + Math.PI + THREE.MathUtils.degToRad(fra);
            sætPlads(m);
          }
          if (visning !== id) besøgMåne(m);
          const q = new THREE.Quaternion().copy(hæld.quaternion).multiply(m.krop.quaternion);
          rejse.flyv({ fokus: måneFokus(m), afstand: passer(m.form.radius * 1.15), retning: m.form.retning(bredde, længde).applyQuaternion(q), min: m.form.radius * 1.3, max: R * 15 });
        },
        // Radius (km) i formen et sted på en måne (bredde, længde i grader øst), fx i Stickney og ringen omkring
        måneRadius: (id, bredde, længde) => måneMed(id).form.radiusVed(bredde, længde),
        // Årstiden: vinklen mellem nordpolen og Solen (grader). 90 ved jævndøgn, ca. 65 om sommeren i nord.
        polSol() {
          const nordpol = new THREE.Vector3(0, 1, 0).applyQuaternion(hæld.quaternion);
          return THREE.MathUtils.radToDeg(nordpol.angleTo(sol));
        },
      },
    };
  },
};
