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
import { LAV_KVALITET, TEST_HURTIG, ROLIG, passerTil, drejHimmel, visRumstøv } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import { lavKlippeplanet } from '../solsystem/klippeplanet.js';
import { lavLuft } from '../solsystem/atmosfaere.js';
import { lavSkyer, lokalTid } from '../solsystem/skyer.js';
import { lavRejse } from '../solsystem/rejse.js';
import { lavFlyby } from '../solsystem/flyby.js';
import { navneTil, navneKnap } from '../solsystem/navne.js';
import { SIDE, SIDER } from '../data/sider/mars.js';
import { lavFormmåne } from '../solsystem/maane-form.js';
import { lavLandskab, ØJE } from '../solsystem/landskab.js';

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
// stop (M6b): stoppet på flybyen. sol: Solens længdegrad set fra månen (grader øst; 0° = mod Mars, −90° = forsiden i
// bevægelsens retning). Programmet stiller månen i banen, så Solen står dér. kamera: kameraets retning fra månens midte
// (bredde, længde), størrelse: hvor meget af 3D-billedet månen fylder (som i besøgMåne), og blik: hvor langt kameraet
// kigger ved siden af månen mod Mars (så Mars ses i baggrunden), i forhold til halvdelen af 3D-billedets højde eller bredde.
// Phobos: Solen fra −125° (forsiden og bagsiden), så Mars er mere end halvt belyst bag Phobos, og Stickney (ca. 1° S,
// 49° V) ude ved kanten ligger i lav sol (ca. 14° over horisonten). Mars ses ca. 27° fra Phobos. Står Solen mere mod
// Mars, ligger den side af Mars, der vender mod Phobos i billedet, i mørke. Deimos: Solen næsten bag kameraet (−165°),
// så Mars er næsten helt belyst.
const MÅNER = [
  { id: 'phobos', navn: 'Phobos', afstand: 9376, omløb: 0.31891, middel: 11.08, net: [512, 256], kort: true, farve: [0.16, 0.135, 0.11], vinkel: -35,
    stop: { sol: -125, kamera: [10, -155], størrelse: 2.2, blik: 0.65 } },
  { id: 'deimos', navn: 'Deimos', afstand: 23460, omløb: 1.26244, middel: 6.2, net: [256, 128], kort: true, farve: [0.17, 0.145, 0.12], vinkel: 70,
    stop: { sol: -165, kamera: [8, 168], størrelse: 2, blik: 0.55 } },
];
// "Mars set fra Phobos" (M6b): kameraet står OVERFLADE.højde km over Phobos på den side, der vender mod Mars (bredde
// og længde), og kigger mod Mars' midte. Herfra står Mars ca. 30° over horisonten og Solen (fra −125°) ca. 17° (lav sol).
// blik: hvor langt foran kameraet det punkt er, man drejer rundt om (km). min og max: hvor tæt på og langt væk man selv
// kan zoome fra det punkt.
const OVERFLADE = { id: 'phobos-mars', bredde: -30, længde: -55, højde: 0.3, blik: 0.05, min: 0.02, max: 0.15 };
const MÅNE_MARGEN = 0.05; // km: så tæt på en måne kan kameraet komme
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
  { id: 'mars', titel: 'Mars', tekst: 'Vi flyver ned til Olympus Mons, den største vulkan, vi kender i solsystemet.' },
  // Faktatjekket 29. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 2). Horisonten: √(2 · 3.396 km · 1,7 m) ≈ 3,4 km.
  // Arealet: ca. 300.000 km² (Wikipedia) / Danmark ca. 43.000 km² ≈ 7.
  { id: 'olympus', titel: 'Olympus Mons', tekst: 'Den største vulkan, vi kender i solsystemet. Den er ca. 600 km bred og rejser sig ca. 22 km over landet omkring den.' },
  // M7a, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 2). Kanten 19,4-21,1 km over
  // nulpunktet (USGS SIM 3470). Trykket: exp(−20,5 / 11) ≈ 13 % (skalahøjden 9,5-11 km giver 11-15 %).
  { id: 'caldera', titel: 'Calderaen', tekst: 'På toppen ligger seks kratere, der overlapper hinanden. Tilsammen er de ca. 65 × 80 km og op til ca. 3 km dybe.' },
  // Skrænten mod nordvest: ca. 7,8 km fald på ca. 20 km, målt i højdekortet. Mount Everest 8.849 m.
  { id: 'skraent', titel: 'Skrænten', tekst: 'Ved vulkanens kant falder landet her ca. 8 km ned til sletten på ca. 20 km. Det er næsten lige så højt som Mount Everest.' },
  // M5a, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, del 3, afsnit 3-5 og "Faktatjek M5a"). Afstande
  // mellem vulkanernes midter fra USGS' koordinater: 713 og 808 km. Olympus Mons-Pavonis Mons: ca. 1.600 km.
  { id: 'tharsis', titel: 'Tharsis', tekst: 'Tre kæmpevulkaner på en lige linje: Arsia, Pavonis og Ascraeus Mons. Der er ca. 700-800 km mellem dem.' },
  // Lissabon-Moskva ca. 3.900 km (storcirkel). Ækvatorens omkreds 21.339 km.
  { id: 'valles', titel: 'Valles Marineris', tekst: 'Et system af kløfter, ca. 4.000 km langt og op til ca. 10 km dybt. Her ser du midten, hvor kløfterne er bredest.' },
  { id: 'hellas', titel: 'Hellas', tekst: 'Et kæmpe krater fra et nedslag for ca. 4 mia. år siden. Det er ca. 2.300 km bredt, og bunden er mere end 7 km dyb.' },
  // M5b, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M5b"). Rovernes status er slået op samme
  // dag: Curiosity ca. 38 km (NASA's kortdata, sol 5045) og 1 km højere end landingsstedet (NASA 26. august 2026).
  // Perseverance 45,22 km (NASA 11. oktober 2026), 30 prøver (NASA's prøveside, juni 2026, og blogs til 19. oktober
  // 2026), Mars Sample Return står i datid på NASA's side (september 2026) og fik 0 dollar i 2026.
  // Deltaets kant: ca. 40 m (NASA-blog "Campaign 2: The Delta Front", 2022).
  { id: 'gale', titel: 'Gale og Curiosity', knap: 'Gale', tekst: 'Et 154 km bredt krater med et ca. 5 km højt bjerg i midten, Mount Sharp. Her har roveren Curiosity kørt rundt siden 2012.' },
  { id: 'jezero', titel: 'Jezero og Perseverance', knap: 'Jezero', tekst: 'Et ca. 45 km bredt krater, der engang var en sø. En flod lagde et delta ved vestkanten. Her landede roveren Perseverance i 2021.' },
  // Faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M5b"): NASA PIA13163 og PIA02800, UT Austin
  // (Smith & Holt og Holt m.fl., Nature 27. maj 2010), ASU "Planum Boreum", MSSS "Seasons on Mars" og NSSDC.
  // Solens højde ved sommersolhverv: 25,19° ± (90° − 87,3°) = 22,5°-27,9° (programmet stiller aksen på solhverv).
  { id: 'nordpol', titel: 'Nordpolen', tekst: 'En kappe af is, ca. 1.000 km bred og op til ca. 3 km tyk. Vi har spolet frem til sommer, så Solen går ikke ned her: midnatssol.' },
  // M6b, faktatjekket 30. oktober 2026 (docs/fakta-solsystemet.md, "Faktatjek M6b"): NASA, JAXA, ESA og Wikipedia læst
  // direkte. Mars set fra Phobos: 2 · arcsin(3.396 / 9.363) = 42,5°, Månen 0,52° (ca. 82 gange). Fra Deimos 16,6°.
  // MMX' status slået op samme dag hos JAXA (sund 21. oktober 2026, første signal nævnt 26. oktober).
  { id: 'phobos', titel: 'Phobos', tekst: 'Phobos er kun ca. 26 km lang og kredser ca. 6.000 km over Mars. Den runder Mars på 7 timer og 39 minutter, hurtigere end Mars drejer.' },
  { id: 'phobos-mars', titel: 'Mars set fra Phobos', tekst: 'Herfra er Mars ca. 42° bred på himlen, ca. 80 gange så bred som Månen på vores himmel. Phobos vender altid samme side mod Mars.' },
  { id: 'deimos', titel: 'Deimos', tekst: 'Deimos er kun ca. 16 km lang og kredser ca. 23.500 km fra Mars\' midte. Den ser glattere ud end Phobos, fordi støv har fyldt kraterne delvist op.' },
];

// Stå på Mars (M8a i docs/plan-mars.md, js/solsystem/landskab.js): de steder ved et krater, hvor man kan stå. Bredden
// og længden er roverens stop i NASA's kortdata (mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json) og skal
// være de samme som KRATERE i billeder/solsystem/lav_landskab.py. blik: den kompasretning, man kigger, når man lander
// (grader fra nord mod øst). tid: klokken på stedet, når man lander.
const LANDSKAB = {
  gale: [
    { id: 'naukluft', navn: 'Naukluft', knap: 'Gå til Naukluft', bredde: -4.67837549, længde: 137.3593593, blik: 135, tid: 8.5,
      titel: 'Naukluft i Gale-krateret', tekst: 'Du står, hvor Curiosity kørte i april 2016. Mod sydøst rejser Mount Sharp sig. Drej hovedet med fingeren eller musen.' },
    { id: 'curiosity', navn: 'Hos Curiosity', knap: 'Gå til Curiosity nu', bredde: -4.82466475, længde: 137.3876138, blik: 10, tid: 9,
      titel: 'Hos Curiosity, oktober 2026', tekst: 'Her stod Curiosity i midten af oktober 2026, ca. 1 km højere oppe end der, hvor den landede.' },
  ],
};
// Træet i listen til venstre (js/faenomenskaerm.js): stederne og månerne med flybyens navne, og under et sted det, der
// hører til (Calderaen og Skrænten under Olympus Mons, stederne, man kan stå, under Gale, og udsigten fra Phobos
// under Phobos)
const punkt = (id, under) => ({ id, navn: TUR.find((t) => t.id === id).titel, ...(under && { under: under.map((u) => punkt(u)) }) });
const TRÆ = {
  rod: 'mars',
  grupper: [
    { navn: 'Steder', punkter: [punkt('olympus', ['caldera', 'skraent']), ...['tharsis', 'valles', 'hellas', 'gale', 'jezero', 'nordpol'].map((id) => punkt(id))] },
    {
      navn: 'Måner', id: 'måner', titel: 'Månerne', undertitel: 'Phobos og Deimos i deres baner',
      punkter: [punkt('phobos', ['phobos-mars']), punkt('deimos')],
    },
  ],
};
TRÆ.grupper[1].punkter[0].under[0].undertitel = 'Udsigten fra Phobos';
for (const [krater, steder] of Object.entries(LANDSKAB)) {
  TRÆ.grupper[0].punkter.find((p) => p.id === krater).under = steder.map((sd) => ({ id: `stå-${sd.id}`, navn: `🧍 ${sd.navn}`, titel: sd.titel, undertitel: 'Stå på Mars', ikon: '🧍' }));
}

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
  træ: TRÆ,
  kamera: { retning: [0.12, 0.2, 1], radius: MARS_R / S, drej: false },
  tal: [
    ['Mars\' bredde', 'ca. 6.790 km'],
    ['Et døgn', '24 t 40 min'],
    ['Et år', '687 jorddøgn'],
    ['Tyngden', '38 % af Jordens'],
  ],
  side: SIDE, // teksten i højre panel (js/data/sider/mars.js)
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, forklaring, fase, verden, tiden }) {
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
    const rejse = lavRejse({ system, verden, bund, udenom });
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
      tiden('pause'); // ved et sted står tiden stille fra start (▶ lader lyset og skyggerne gå rundt)
    }
    // Hele Mars: kameraet kigger på midten fra retning (i systemets retninger)
    function flyvTilMars(retning, net = []) {
      aktivér([nuværendeNet(), ...net]);
      hældHen(HÆLD.jævndøgn);
      visning = 'mars';
      flyv({ fokus: () => nul, afstand: passer(R), retning, min: minOverblik(), max: R * 15, færdig: () => aktivér(net) });
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
      tiden('spil'); // hele Mars drejer igen
      flyvTilMars(kamPos.copy(kamera.position).sub(system.position).applyQuaternion(qHjælp.copy(rejse.drejning).invert()));
      forklaring('');
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
      ordnetVed = null;
      if (måneFlyt) { // en måne, der var på vej ud af skyggen, kommer helt frem
        måneFlyt.m.vinkel = måneFlyt.til;
        sætPlads(måneFlyt.m);
        måneFlyt = null;
      }
      // Står månen i Mars' skygge, flytter den sig frem i banen og ud af skyggen, mens kameraet flyver derhen. Ellers er
      // både månen og den side af Mars, man ser bag den, helt mørke (jeres opdagelse 30. oktober 2026).
      const fra = m.vinkel;
      const flyttet = udAfSkygge(m);
      const ud = måneFokus(m)().clone().normalize();
      const retning = ud.multiplyScalar(0.9).addScaledVector(sol, 0.8).addScaledVector(Y, 0.3).normalize();
      if (flyttet) {
        måneFlyt = { m, fra, til: m.vinkel };
        m.vinkel = fra;
        sætPlads(m);
      }
      flyv({ fokus: måneFokus(m), afstand: passer(m.form.radius * 1.15), retning, min: m.form.radius * 1.3, max: R * 15 });
      const t = TUR.find((x) => x.id === m.id);
      fase(t.titel, t.tekst);
      forklaring(flyttet ? skyggeTekst(m) : ''); // "Lige nu": hvis programmet har flyttet månen ud af skyggen
      lavKnapper();
    }
    // Begge baner set skråt oppefra
    function visMåner() {
      flyby.afslut();
      fase(null);
      aktivér([nuværendeNet()]);
      hældHen(HÆLD.jævndøgn);
      visning = 'måner';
      flyv({ fokus: () => nul, afstand: passer((MÅNER[1].afstand / S) * 1.08), retning: new THREE.Vector3(0.2, 0.75, 1).normalize(), min: minOverblik(), max: R * 30, færdig: () => aktivér([]) });
      forklaring('');
      lavKnapper();
    }
    // ---------- Månerne på flybyen og "Mars set fra Phobos" (M6b) ----------
    // Fra månens egne retninger (v i enheder) til systemets, med aksens hældning qH
    function iSystem(m, v, ud, qH = hæld.quaternion) {
      return ud.copy(v).applyQuaternion(m.krop.quaternion).add(m.plads.position).applyQuaternion(qH);
    }
    function retningISystem(m, v, ud, qH = hæld.quaternion) {
      return ud.copy(v).applyQuaternion(m.krop.quaternion).applyQuaternion(qH);
    }
    // Overfladens afstand fra månens midte (enheder) i retningen r (i systemets retninger)
    const tilKrop = new THREE.Quaternion();
    const rKrop = new THREE.Vector3();
    function overfladeR(m, r) {
      tilKrop.copy(hæld.quaternion).multiply(m.krop.quaternion).invert();
      rKrop.copy(r).applyQuaternion(tilKrop).normalize();
      const bredde = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(rKrop.y, -1, 1)));
      const længde = THREE.MathUtils.radToDeg(Math.atan2(-rKrop.z, rKrop.x));
      return m.form.radiusVed(bredde, længde) / S; // den rigtige størrelse (langt væk er månen tegnet større)
    }
    // Kameraet må ikke komme ind i en måne (p: kameraets plads i systemets retninger). Kaldes af rejsen hvert billede.
    const udHjælp = new THREE.Vector3();
    function udenom(p) {
      let flyttet = false;
      for (const m of måner) {
        const midt = måneFokus(m)();
        udHjælp.copy(p).sub(midt);
        const d = udHjælp.length();
        if (d > m.form.radius * 1.1 + MÅNE_MARGEN / S) continue;
        const r = overfladeR(m, udHjælp) + MÅNE_MARGEN / S;
        if (d < r) {
          p.copy(midt).addScaledVector(udHjælp, r / Math.max(d, 1e-12));
          flyttet = true;
        }
      }
      return flyttet;
    }
    // Står månen i Mars' skygge? (bag Mars set fra Solen og inden for Mars' radius fra linjen gennem Mars' midte)
    function iSkygge(m) {
      const p = måneFokus(m)();
      const bag = p.dot(sol);
      return bag < 0 && p.clone().addScaledVector(sol, -bag).length() < R;
    }
    // Faktatjekket (M6b): Phobos er i skygge på næsten hver omgang undtagen omkring solhverv (Solen mere end ca. 21° fra
    // ækvator), højst ca. 52 min (2 · 3.368 km / 2,14 km/s). Deimos kun omkring jævndøgn (inden for ca. 8°).
    const skyggeTekst = (m) => `<p><b>Ud af skyggen:</b> ${m.navn} stod i Mars' skygge, hvor sollyset ikke kan nå den, så den var helt mørk. Derfor har programmet flyttet den lidt frem i banen. Phobos kommer i skygge på næsten hver omgang, men ikke omkring solhverv, og er der i op til ca. 50 minutter. Deimos kommer kun i skygge omkring jævndøgn.</p>`;
    // Flyt månen frem i banen, til den er ude af skyggen (og 10° mere, så den ikke står i kanten af skyggen). Giver true,
    // hvis den blev flyttet.
    let måneFlyt = null; // { m, fra, til }: månen glider frem i banen, mens kameraet flyver derhen
    function udAfSkygge(m) {
      if (!iSkygge(m)) return false;
      for (let i = 0; i < 360 && iSkygge(m); i++) {
        m.vinkel += THREE.MathUtils.degToRad(1);
        sætPlads(m);
      }
      m.vinkel += THREE.MathUtils.degToRad(10);
      sætPlads(m);
      return true;
    }
    // Stil månerne op til turen: Solen står ved m.stop.sol set fra månen (ved jævndøgn). Solens længdegrad set fra månen
    // er Solens vinkel i banen minus månens vinkel minus 180° (længde 0° vender mod Mars).
    function stilMånerOp(kun = null) {
      måneFlyt = null;
      const solH = sol.clone().applyQuaternion(HÆLD.jævndøgn.clone().invert());
      const ψ = Math.atan2(-solH.z, solH.x);
      for (const m of kun ? [kun] : måner) {
        m.vinkel = ψ - Math.PI - THREE.MathUtils.degToRad(m.stop.sol);
        sætPlads(m);
      }
    }
    // En flyvning rundt om en lille måne (til og fra "Mars set fra Phobos"): Kameraet glider rundt om månens midte, og
    // højden over overfladen ændrer sig jævnt (i log), så det aldrig kommer ind i månen. Det, kameraet kigger på,
    // drejer jævnt fra det gamle mål til det nye. K1 og L1: kameraets plads og målet til sidst (i systemets retninger).
    function baneOmMåne(m, K1, L1) {
      const C = måneFokus(m)().clone();
      const K0 = rejse.kameraPunkt(), L0 = rejse.fokus.clone();
      const d0 = K0.clone().sub(C), d1 = K1.clone().sub(C);
      const h0 = Math.max(d0.length() - overfladeR(m, d0), 1e-7), h1 = Math.max(d1.length() - overfladeR(m, d1), 1e-7);
      d0.normalize();
      d1.normalize();
      const qD = new THREE.Quaternion().setFromUnitVectors(d0, d1);
      const l0 = L0.clone().sub(K0), l1 = L1.clone().sub(K1);
      const b0 = l0.length(), b1 = l1.length();
      l0.normalize();
      l1.normalize();
      const qL = new THREE.Quaternion().setFromUnitVectors(l0, l1);
      const q = new THREE.Quaternion(), r = new THREE.Vector3();
      const log = (a, b, e) => Math.exp(THREE.MathUtils.lerp(Math.log(a), Math.log(b), e));
      return (e, kam, mål) => {
        r.copy(d0).applyQuaternion(q.identity().slerp(qD, e));
        kam.copy(C).addScaledVector(r, overfladeR(m, r) + log(h0, h1, e));
        mål.copy(l0).applyQuaternion(q.identity().slerp(qL, e)).multiplyScalar(log(b0, b1, e)).add(kam);
      };
    }
    // Alle flyvninger går herigennem: Står kameraet på Phobos, flyver det først rundt om månen og væk (ikke gennem den)
    let fraOverflade = false;
    function flyv(p) {
      if (fraOverflade) {
        fraOverflade = false;
        const L1 = p.fokus().clone();
        const K1 = p.retning.clone().normalize().multiplyScalar(p.afstand).add(L1);
        p = { tid: 7, ...p, bane: baneOmMåne(måneMed('phobos'), K1, L1) };
      }
      rejse.flyv(p);
    }
    // Et stop ved en måne: set fra m.stop.kamera, og kameraet kigger ved siden af månen mod Mars (m.stop.blik gange
    // halvdelen af 3D-billedets mindste side, som i passerTil i scene3d.js)
    function flyvTilMåneStop(m, efter) {
      aktivér([nuværendeNet()]);
      hældHen(HÆLD.jævndøgn);
      visning = m.id;
      ordnetVed = m.id; // månen er stillet op (stilMånerOp), så Solen står ved m.stop.sol
      tiden('spil'); // Mars drejer videre, mens månen står stille
      const { kamera: [b, l], størrelse, blik } = m.stop;
      const c = retningISystem(m, m.form.retning(b, l), new THREE.Vector3(), HÆLD.jævndøgn);
      const u = retningISystem(m, new THREE.Vector3(1, 0, 0), new THREE.Vector3(), HÆLD.jævndøgn); // mod Mars
      const afstand = passer(m.form.radius * størrelse);
      const { hul } = verden;
      const halv = Math.tan(THREE.MathUtils.degToRad(20)) * Math.min(hul.width, hul.height) / innerHeight; // tan(halv vinkel)
      const forskyd = u.addScaledVector(c, -u.dot(c)).normalize().multiplyScalar(afstand * halv * blik);
      flyv({ fokus: () => måneFokus(m)().add(forskyd), afstand, retning: c, min: forskyd.length() + m.form.radius * 1.3, max: R * 15, færdig: () => { aktivér([]); efter?.(); } });
    }
    // Til flybyens stop ved en måne fra træet i listen: Månen glider hen, hvor flybyen stiller den (den korteste vej i
    // banen), mens kameraet flyver derhen (kameraet følger månen). efter kaldes, når kameraet er fremme.
    let ordnetVed = null; // den måne, der står, som flybyen stiller den
    function tilMåneStop(m, efter) {
      if (måneFlyt) { // en måne, der var på vej, kommer helt frem
        måneFlyt.m.vinkel = måneFlyt.til;
        sætPlads(måneFlyt.m);
      }
      const fra = m.vinkel;
      stilMånerOp(m);
      const til = fra + THREE.MathUtils.euclideanModulo(m.vinkel - fra + Math.PI, Math.PI * 2) - Math.PI;
      flyvTilMåneStop(m, efter); // regnes med månen, der hvor den ender
      m.vinkel = fra;
      sætPlads(m);
      måneFlyt = { m, fra, til };
    }
    // "Mars set fra Phobos": OVERFLADE.højde over Phobos på siden mod Mars. Man drejer rundt om et punkt lige foran
    // kameraet (som at dreje hovedet), og Phobos' lodrette retning peger op.
    function flyvTilOverflade() {
      const m = måneMed('phobos');
      aktivér([]);
      hældHen(HÆLD.jævndøgn);
      visning = OVERFLADE.id;
      tiden('spil');
      const r = m.form.retning(OVERFLADE.bredde, OVERFLADE.længde);
      const n = retningISystem(m, r, new THREE.Vector3());
      const K1 = iSystem(m, r.clone().multiplyScalar(m.form.radiusVed(OVERFLADE.bredde, OVERFLADE.længde) / S), new THREE.Vector3()).addScaledVector(n, OVERFLADE.højde / S);
      const mod = K1.clone().negate().normalize(); // mod Mars' midte
      const L1 = K1.clone().addScaledVector(mod, OVERFLADE.blik / S);
      const bane = baneOmMåne(m, K1, L1);
      fraOverflade = true; // næste flyvning starter herfra
      rejse.flyv({ fokus: () => L1, op: () => n, afstand: OVERFLADE.blik / S, retning: mod.clone().negate(), min: OVERFLADE.min / S, max: OVERFLADE.max / S, tid: 7, bane });
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
      const påSted = !(visning === 'mars' || visning === 'måner' || erMåne(visning)); // (også på Phobos' overflade)
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
      flyv({ fokus: fokusVed(st), op: opVed(st), afstand: passer(st.størrelse), retning: fraSted(st, drej, st.kompas, st.vinkel), min: 0.003, max: 3, færdig: () => { aktivér([st.lokalt]); if (LANDSKAB[st.id]) lavKnapper(); } });
    }

    // ---------- Flybyen (js/solsystem/flyby.js) ----------
    const flyby = lavFlyby({
      stop: TUR, fase, forklaring, skift: () => lavKnapper(),
      // hop: man springer med ‹ eller en prik. Så flyver kameraet derhen som fra træet (månerne glider på plads).
      flyvTil: (stop, nr, hop) => {
        gåNr++;
        if (stop.id === 'mars') flyvTilMarsMod(stedMed(TUR[1].id));
        else if (hop) flyvDirekte(stop.id);
        else if (stop.id === OVERFLADE.id) flyvTilOverflade();
        else if (erMåne(stop.id)) {
          if (stop.id === 'phobos') stilMånerOp(); // fra Nordpolen kan man ikke se Phobos, så den må gerne flytte sig
          flyvTilMåneStop(måneMed(stop.id));
        } else besøg(stedMed(stop.id));
      },
      slut: '<p><b>Turen er slut.</b> Drej selv rundt med fingeren eller musen, eller vælg et nyt sted i listen.</p>',
    });

    // ---------- Stå på Mars (M8a, js/solsystem/landskab.js) ----------
    // "Stå på Mars" ved Gale: Kameraet flyver ned mod stedet, billedet toner over i landskabet, og kameraet lander i
    // øjenhøjde. Landskabet er sin egen verden (Mars-kloden skjules imens), og kameraet drejer kun hovedet.
    const landskaber = new Map(); // krater → { data, land } (hentes første gang)
    let stående = null; // { krater, sd } mens man står på jorden
    let ståVent = null; // { krater, sd, fløjet, klar } mens kameraet flyver ned, og lagene hentes
    let landing = null; // kameraet lander (eller letter: op = true)
    let kikkert = 1; // kameraets zoom (som en kikkert)
    const gemt = { pos: new THREE.Vector3(), nær: 0 };
    const LANDING_HØJDE = 1.2; // km over stedet, hvor landingen starter
    const LANDING_TID = 4.5; // sekunder
    const DAG_TID = 150; // sekunder for et døgn, når dagen går
    const tæppe = document.createElement('div'); // tonen mellem kloden og landskabet
    tæppe.style.cssText = 'position:fixed;pointer-events:none;background:#8a6a52;opacity:0;transition:opacity 0.35s;z-index:1';
    document.body.appendChild(tæppe);
    function ton(midt) {
      const h = verden.hul;
      Object.assign(tæppe.style, { left: `${h.left}px`, top: `${h.top}px`, width: `${h.width}px`, height: `${h.height}px` });
      if (ROLIG) { midt(); return; }
      tæppe.style.opacity = '1';
      setTimeout(() => {
        if (!aktiv) return;
        midt();
        requestAnimationFrame(() => { tæppe.style.opacity = '0'; });
      }, 360);
    }
    // Lagene til krateret (JSON fra billeder/solsystem/lav_landskab.py). klar(l) kaldes, når de er hentet.
    function hentLandskab(krater, klar) {
      const l = landskaber.get(krater);
      if (l?.land) { klar(l); return; }
      if (l) { l.venter.push(klar); return; }
      const ny = { data: null, land: null, venter: [klar] };
      landskaber.set(krater, ny);
      fetch(new URL(`landskab/${krater}.json`, MAPPE)).then((s) => s.json()).then((data) => {
        if (!aktiv) return;
        // Solens deklination i programmet (ved "jævndøgn" står Solen lidt over Mars' ækvator, se HÆLD)
        const akse = new THREE.Vector3(0, 1, 0).applyQuaternion(HÆLD.jævndøgn);
        const dekl = 90 - THREE.MathUtils.radToDeg(akse.angleTo(sol));
        ny.data = data;
        ny.land = lavLandskab({ renderer: verden.renderer, data, hent, krater, deklination: dekl });
        ny.land.gruppe.visible = false;
        gruppe.add(ny.land.gruppe);
        for (const f of ny.venter) f(ny);
        ny.venter.length = 0;
      }).catch(() => {});
    }
    // Flyv ned til stedet sd ved krateret, og stå der, når lagene er hentet
    function ståPå(krater, sd) {
      const st = { ...sd, ramme: mars.sted(sd.bredde, sd.længde), lokalt: krater };
      const vent = { krater, sd, fløjet: false, klar: false };
      ståVent = vent;
      hentLokalt(st);
      const drej = drejningTil(st);
      drejHen(drej);
      hældHen(HÆLD.jævndøgn);
      aktivér([nuværendeNet(), krater]);
      visning = `stå-${sd.id}`;
      fase(sd.titel, 'Vi flyver ned og lander …');
      lavKnapper();
      // Kameraet står bag stedet og kigger i landingens retning, skråt ned
      flyv({ fokus: fokusVed(st), op: opVed(st), afstand: LANDING_HØJDE * 2.2 / S, retning: fraSted(st, drej, sd.blik + 180, 27), min: 0.003, max: 3,
        færdig: () => { vent.fløjet = true; land(vent); } });
      hentLandskab(krater, (l) => l.land.gåTil(sd.id, () => { vent.klar = true; land(vent); }));
    }
    function land(vent) {
      if (vent !== ståVent || !vent.fløjet || !vent.klar) return;
      ståVent = null;
      ton(() => visLandskab(vent.krater, vent.sd));
    }
    const kamRet = new THREE.Vector3();
    // Kameraet i landskabet: højde (km) og blik (kompas og vinkel over vandret, grader)
    function sætBlik(højde, kompas, vinkel) {
      const a = THREE.MathUtils.degToRad(kompas), v = THREE.MathUtils.degToRad(vinkel);
      kamRet.set(Math.sin(a) * Math.cos(v), Math.sin(v), -Math.cos(a) * Math.cos(v));
      kamera.position.set(0, højde, 0);
      orbit.target.copy(kamera.position).addScaledVector(kamRet, 1e-4);
      kamera.lookAt(orbit.target);
    }
    function visLandskab(krater, sd) {
      const l = landskaber.get(krater);
      if (!stående) {
        gemt.pos.copy(kamera.position);
        gemt.nær = kamera.near;
      }
      stående = { krater, sd, land: l.land };
      for (const [, x] of landskaber) if (x.land) x.land.gruppe.visible = x === l;
      system.visible = false;
      solKerne.visible = solGlød.visible = false;
      visRumstøv(false);
      opdaterNavne();
      kamera.near = 0.0003; // 0,3 m (1 enhed = 1 km i landskabet)
      kikkert = 1;
      kamera.zoom = 1;
      kamera.updateProjectionMatrix();
      orbit.minDistance = orbit.maxDistance = 1e-4; // man drejer om et punkt 10 cm foran kameraet (som at dreje hovedet)
      orbit.enableZoom = false;
      orbit.rotateSpeed = -0.35; // man "tager fat i" landskabet
      l.land.tid = sd.tid;
      landing = { t: 0, T: ROLIG ? 0 : LANDING_TID, sd };
      orbit.enabled = false;
      sætBlik(LANDING_HØJDE, sd.blik, -32);
      tiden('pause'); // klokken står stille, når man lander (▶ lader dagen gå)
      fase(sd.titel, sd.tekst);
      forklaring('');
      lavKnapper();
    }
    // Op i kredsløb igen: tilbage til kraterets stop
    function tilbageOp(til = stående?.krater) {
      if (!stående) return;
      landing = { t: 0, T: ROLIG ? 0 : 2.2, op: true, fra: kamera.position.y, færdig: () => ton(() => {
        forladLandskab();
        gåTil(til);
      }) };
      orbit.enabled = false;
      lavKnapper();
    }
    function forladLandskab() {
      if (!stående) return;
      stående.land.gruppe.visible = false;
      stående = null;
      landing = null;
      system.visible = true;
      solKerne.visible = solGlød.visible = true;
      visRumstøv(true);
      kamera.near = gemt.nær;
      kamera.zoom = 1;
      kamera.updateProjectionMatrix();
      orbit.target.set(0, 0, 0);
      kamera.position.copy(gemt.pos);
      orbit.minDistance = 0.001;
      orbit.maxDistance = 1e5;
      orbit.enableZoom = true;
      orbit.rotateSpeed = 1;
      orbit.enabled = true;
    }
    // Gå til et andet sted ved samme krater (et hop med en tone)
    function gåTilLandskab(sd) {
      const krater = stående.krater;
      const nr = gåNr; // vælges noget andet, mens lagene hentes eller billedet toner, lander man ikke her alligevel
      stående.land.gåTil(sd.id, () => { if (gåNr === nr) ton(() => { if (gåNr === nr) visLandskab(krater, sd); }); });
    }
    // Klokken som tekst (lokal soltid)
    const klokken = (t) => `${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 60)).padStart(2, '0')}`;
    let tidsSkyder = null;
    // Solnedgang: kort før Solen når horisonten (søges i landskabets egen sol)
    function solnedgang() {
      const land = stående.land;
      let t = 12;
      while (t < 24 && (land.tid = t, land.sol.y) > 0.02) t += 0.02;
      land.tid = t - 0.35;
      tidsSkyder?.sæt?.(land.tid);
    }
    // Hvert billede, mens man står: landingen, dagen, himlen og stjernerne
    const qPol = new THREE.Quaternion();
    const qDrej = new THREE.Quaternion();
    const polRet = new THREE.Vector3();
    function opdaterStående(dt) {
      const land = stående.land;
      if (landing) {
        landing.t = Math.min(landing.T, landing.t + dt);
        const e = landing.T ? landing.t / landing.T : 1;
        const g = 1 - Math.pow(1 - e, 3);
        if (landing.op) {
          kamRet.copy(orbit.target).sub(kamera.position).normalize();
          const kompas = THREE.MathUtils.radToDeg(Math.atan2(kamRet.x, -kamRet.z));
          sætBlik(landing.fra + (LANDING_HØJDE - landing.fra) * e * e, kompas, THREE.MathUtils.radToDeg(Math.asin(kamRet.y)) * (1 - e) - 32 * e);
        } else sætBlik(ØJE / 1000 + (LANDING_HØJDE - ØJE / 1000) * Math.pow(1 - g, 2), landing.sd.blik, -32 + 29 * g);
        if (landing.t >= landing.T) {
          const f = landing.færdig;
          landing = null;
          if (f) f();
          else {
            orbit.enabled = true;
            opdaterKnapper(); // knapperne er aktive igen
          }
        }
      }
      if (!stående) return;
      land.opdater(kamera);
      // Stjernerne: himlens nordpol står over den nordlige horisont i en vinkel lig med bredden, og himlen drejer om den
      const b = THREE.MathUtils.degToRad(stående.sd.bredde);
      polRet.set(0, Math.sin(b), -Math.cos(b));
      qPol.setFromUnitVectors(Y, polRet);
      qDrej.setFromAxisAngle(Y, -(land.tid / 24) * Math.PI * 2);
      drejHimmel(qPol.multiply(qDrej));
    }
    // Kikkerten: rul med musen eller knib med to fingre
    const fingre = new Map();
    let knibStart = null;
    function zoom(f) {
      kikkert = THREE.MathUtils.clamp(kikkert * f, 1, 6);
      kamera.zoom = kikkert;
      kamera.updateProjectionMatrix();
      orbit.rotateSpeed = -0.35 / kikkert;
    }
    const vedHjul = (h) => {
      if (!stående || landing) return;
      h.preventDefault();
      zoom(Math.exp(-h.deltaY * 0.0015));
    };
    const vedFingerNed = (h) => { fingre.set(h.pointerId, { x: h.clientX, y: h.clientY }); if (fingre.size === 2) knibStart = { d: knibAfstand(), z: kikkert }; };
    const vedFingerFlyt = (h) => {
      if (!fingre.has(h.pointerId)) return;
      fingre.set(h.pointerId, { x: h.clientX, y: h.clientY });
      if (stående && !landing && fingre.size === 2 && knibStart) zoom((knibStart.z * knibAfstand()) / knibStart.d / kikkert);
    };
    const vedFingerOp = (h) => { fingre.delete(h.pointerId); if (fingre.size < 2) knibStart = null; };
    function knibAfstand() {
      const [a, b] = [...fingre.values()];
      return Math.max(10, Math.hypot(a.x - b.x, a.y - b.y));
    }
    verden.renderer.domElement.addEventListener('wheel', vedHjul, { passive: false });
    verden.renderer.domElement.addEventListener('pointerdown', vedFingerNed);
    addEventListener('pointermove', vedFingerFlyt);
    addEventListener('pointerup', vedFingerOp);
    addEventListener('pointercancel', vedFingerOp);
    // Knapperne, mens man står på jorden: klokken i Styr-boksen og "Solnedgang" i bjælken. Dagen går med tidsknappen
    // (▶, et døgn på DAG_TID). Op i kredsløb og de andre steder ved krateret står i træet.
    function ståKnapper() {
      const { land } = stående;
      tidsSkyder = { skyder: true, navn: 'Klokken på Mars', min: 0, max: 24, trin: 0.05, værdi: land.tid, vis: klokken, ændring: (t) => { land.tid = t; } };
      return [
        tidsSkyder,
        { tekst: '🌅 Solnedgang', handling: solnedgang, deaktiv: () => !!landing },
      ];
    }

    // ---------- Knapperne ----------
    let høj = false;
    let modlys = false;
    const styring = [];
    function lavKnapper() {
      const knapper = [];
      if (stående) {
        styring.splice(0, styring.length, ...ståKnapper());
        opdaterKnapper();
        return;
      }
      // Stå på Mars ved et krater med et landskab (ikke under flyvningen derhen)
      const krater = LANDSKAB[visning] && !rejse.flyver ? visning : null;
      if (krater) knapper.push({ tekst: '🧍 Stå på Mars', handling: () => ståPå(krater, LANDSKAB[krater][0]) });
      // Flybyen står i træet og bjælken (tur og trin nedenfor), og tiden styres med tidsknappen
      knapper.push(
        { tekst: 'Bjergene 10 gange højere', til: høj, skift: (til) => { høj = til; } },
        { tekst: 'Modlys', til: modlys, skift: (til) => { modlys = til; } },
        navneKnap(() => { opdaterNavne(); opdaterMåner(rejse.skala); }),
      );
      styring.splice(0, styring.length, ...knapper);
      opdaterKnapper();
    }
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
    // Gå til et sted, en måne eller udsigten fra Phobos (fra træet i listen eller et navn på kloden): flyv derhen som
    // på flybyen, og vis stedets tekst (uden prikker). id: et stop på flybyen, 'mars' (hele Mars) eller 'måner'.
    // Det sted, man er ved (i landskabet: stå-naukluft, stå-curiosity)
    const stedNu = () => (stående ? `stå-${stående.sd.id}` : visning);
    let gåNr = 0; // så en flyvning i to dele kun fortsætter, hvis der ikke er valgt noget andet imens
    const landskabMed = (id) => Object.entries(LANDSKAB).map(([krater, l]) => ({ krater, sd: l.find((x) => `stå-${x.id}` === id) })).find((x) => x.sd);
    // Flyv direkte til et stop (en måne, udsigten fra Phobos eller et sted), fra hvor man end er (træet og flybyens spring)
    function flyvDirekte(id, nr = gåNr) {
      if (erMåne(id)) tilMåneStop(måneMed(id));
      else if (id === OVERFLADE.id) {
        // Udsigten fra Phobos kræver, at Phobos står som på flybyen. Ellers flyver kameraet først derhen.
        if (ordnetVed === 'phobos' && visning === 'phobos') flyvTilOverflade();
        else {
          tilMåneStop(måneMed('phobos'), () => { if (gåNr === nr) flyvTilOverflade(); });
          visning = OVERFLADE.id; // på vej derhen (månerne står stille)
        }
      } else besøg(stedMed(id));
    }
    function gåTil(id) {
      if (id === stedNu()) return;
      const nr = ++gåNr;
      const stå = landskabMed(id);
      // Fra landskabet: et andet sted ved krateret er et hop, og alt andet letter først (som "op i kredsløb")
      if (stående) return stå?.krater === stående.krater ? gåTilLandskab(stå.sd) : tilbageOp(id);
      ståVent = null;
      if (stå) {
        flyby.afslut();
        return ståPå(stå.krater, stå.sd);
      }
      if (id === 'mars') return tilbage();
      if (id === 'måner') return visMåner();
      const t = TUR.find((x) => x.id === id);
      if (!t) return;
      flyby.afslut();
      flyvDirekte(id, nr);
      opdaterNavne(); // navnene skjules med det samme (ikke først i næste billede)
      fase(t.titel, t.tekst);
      forklaring('');
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
        gåTil(n.st.id);
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
      if (stående) {
        opdaterStående(dt);
        return;
      }
      // Mars drejer hen til det rigtige tidspunkt (og årstiden) i takt med flyvningen (før rejsen finder stedet)
      if (drejTur) {
        omdrejning.rotation.y = THREE.MathUtils.lerp(drejTur.fra, drejTur.til, rejse.fremdrift);
        if (!rejse.flyver) drejTur = null;
      }
      if (hældTur) {
        hæld.quaternion.slerpQuaternions(hældTur.fra, hældTur.til, rejse.fremdrift);
        if (!rejse.flyver) hældTur = null;
      }
      if (måneFlyt) {
        måneFlyt.m.vinkel = THREE.MathUtils.lerp(måneFlyt.fra, måneFlyt.til, rejse.fremdrift);
        sætPlads(måneFlyt.m);
        if (!rejse.flyver) måneFlyt = null;
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
      gåTil, // træet i listen (js/faenomenskaerm.js)
      sted: () => stedNu(),
      // Flybyen: øverst i træet og i bjælken i 3D-billedet
      tur: { navn: 'Flyby', stop: TUR.length, klar: () => flybyKlar, kører: () => flyby.kører, start: () => flyby.start(), skjul: () => Boolean(stående || ståVent) }, // ikke mens man står på Mars
      trin: () => flyby.bjælke(),
      // Kaldes kun, når tiden går (tidsknappen). Mens man står på Mars, går dagen (et døgn på DAG_TID sekunder).
      opdater(dt, t) {
        tid = t;
        if (stående) {
          if (!landing) {
            stående.land.tid = (stående.land.tid + (dt * 24) / DAG_TID) % 24;
            tidsSkyder?.sæt?.(stående.land.tid);
          }
          return;
        }
        if (drejTur) return;
        // Helt tæt på hele Mars står Mars stille (ellers suser landskabet forbi). Ved et sted følger kameraet med,
        // så dagen går, og skyggerne flytter sig.
        const drej = dt * DREJ * (visning === 'mars' ? THREE.MathUtils.smoothstep(rejse.afstand / R, 1.05, 1.8) : 1);
        omdrejning.rotation.y += drej;
        // Månerne følger Mars' ur i det rigtige forhold, men står stille, mens man besøger en af dem
        if (!erMåne(visning) && visning !== OVERFLADE.id) {
          for (const m of måner) {
            m.vinkel += (drej * MARS_DØGN) / m.omløb;
            sætPlads(m);
          }
        }
      },
      stop() {
        aktiv = false;
        clearTimeout(forhåndUr);
        forladLandskab();
        ståVent = null;
        for (const [, l] of landskaber) if (l.land) { gruppe.remove(l.land.gruppe); l.land.stop(); }
        tæppe.remove();
        verden.renderer.domElement.removeEventListener('wheel', vedHjul);
        verden.renderer.domElement.removeEventListener('pointerdown', vedFingerNed);
        removeEventListener('pointermove', vedFingerFlyt);
        removeEventListener('pointerup', vedFingerOp);
        removeEventListener('pointercancel', vedFingerOp);
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
        // Stå på Mars (M8a): står man, hvor, hvilken retning man kigger (kompas og vinkel), og landskabets tal
        stå: () => {
          kamRet.copy(orbit.target).sub(kamera.position).normalize();
          return {
            står: !!stående, sted: stående?.sd.id ?? null, lander: !!landing, venter: !!ståVent, zoom: kamera.zoom,
            kompas: (THREE.MathUtils.radToDeg(Math.atan2(kamRet.x, -kamRet.z)) + 360) % 360, vinkel: THREE.MathUtils.radToDeg(Math.asin(kamRet.y)),
            øjne: kamera.position.y * 1000, kloden: system.visible, nær: kamera.near, ...(stående ? stående.land.test() : {}),
          };
        },
        ståPå: (id) => ståPå('gale', LANDSKAB.gale.find((x) => x.id === id)),
        besøgSted: (id) => gåTil(id),
        tilbageOp: () => tilbageOp(),
        // Sæt klokken og blikket (til billeder)
        sætTid: (t) => { stående.land.tid = t; tidsSkyder?.sæt?.(stående.land.tid); },
        kig: (kompas, vinkel) => sætBlik(ØJE / 1000, kompas, vinkel),
        nær: (km) => { kamera.near = km; kamera.updateProjectionMatrix(); }, // til at måle flimmer
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
          tiden('pause');
          kamPos.copy(kamera.position).sub(system.position).applyQuaternion(qHjælp.copy(rejse.drejning).multiply(hæld.quaternion).invert());
          const vinkel = Math.atan2(-kamPos.z, kamPos.x); // kameraets retning som længdegrad i hældningens retninger
          omdrejning.rotation.y = vinkel - THREE.MathUtils.degToRad(længde);
        },
        ved: () => visning,
        tur: () => ({ trin: flyby.trin, flyver: rejse.flyver, skala: rejse.skala, afstand: rejse.afstand, skubbet: rejse.skubbet }),
        hop: () => { if (landing) landing.t = landing.T; rejse.hop(); }, // gør den igangværende flyvning (eller landing) færdig
        vedSted,
        ordnet: () => ordnetVed,
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
        // M6b: kameraets højde over en måne (km), hvor bred Mars ser ud fra kameraet (grader), om en måne står i Mars'
        // skygge, vinklen mellem Solen og et sted på en måne (grader, under 90 = i sollys), om kameraet blev skubbet ud
        // af en måne, og hvor højt Mars står over Phobos' horisont set fra kameraet (grader)
        måneHøjde(id) {
          const m = måneMed(id);
          const d = rejse.kameraPunkt().sub(måneFokus(m)());
          return (d.length() - overfladeR(m, d)) * S;
        },
        marsVinkel: () => THREE.MathUtils.radToDeg(2 * Math.asin(Math.min(1, R / rejse.kameraPunkt().length()))),
        iSkygge: (id) => iSkygge(måneMed(id)),
        solVinkel(id, bredde, længde) {
          const m = måneMed(id);
          return THREE.MathUtils.radToDeg(retningISystem(m, m.form.retning(bredde, længde), new THREE.Vector3()).angleTo(sol));
        },
        skubbetUd: () => rejse.skubbetUd,
        // Hvor Mars' midte står på skærmen (pixels) og vinklen fra midten af billedet (grader)
        marsPåSkærm() {
          const frem = kamera.getWorldDirection(new THREE.Vector3());
          const til = system.position.clone().sub(kamera.position).normalize();
          const p = system.position.clone().project(kamera);
          const r = lærred.getBoundingClientRect();
          return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height, vinkel: THREE.MathUtils.radToDeg(frem.angleTo(til)) };
        },
        marsOverHorisont() {
          const m = måneMed('phobos');
          const k = rejse.kameraPunkt();
          const op = k.clone().sub(måneFokus(m)()).normalize();
          return 90 - THREE.MathUtils.radToDeg(op.angleTo(k.clone().negate()));
        },
        // Årstiden: vinklen mellem nordpolen og Solen (grader). 90 ved jævndøgn, ca. 65 om sommeren i nord.
        polSol() {
          const nordpol = new THREE.Vector3(0, 1, 0).applyQuaternion(hæld.quaternion);
          return THREE.MathUtils.radToDeg(nordpol.angleTo(sol));
        },
      },
    };
  },
};
