// "Land med Huygens" (spor Måner, M5a og M5b, docs/drejebog-maaner.md afsnit 7-8 og 13): tallene for Titan og Huygens'
// nedstigning, tidsplanen (højden efter tiden), billederne fra Huygens' kamera, billedet fra jorden med de to sten,
// kanal A og B og teksten i højre panel. Ren data uden Three.js, så det kan testes i Node (tests/maaner-huygens.mjs).
//
// Kilderne (docs/fakta-maaner-liv.md afsnit 3-4, drejebogens afsnit 16, og faktatjekket i M5a 21. november 2026):
// - ESA, sci.esa.int 36280 "Titan Surface Landing" (åbnet 21. november 2026): Huygens nåede 1.270 km kl. 09.06 UTC ved
//   Titan. Tidsplanen fra før landingen ("pre-mission"): pilotskærm (2,6 m) og hovedskærm (8,3 m) ved 160-190 km kl.
//   09.09-09.10, den lille skærm (3 m) ved 110-140 km kl. 09.25, 60 km kl. 09.42 og 50 km kl. 09.49. Nedstigningen tog
//   2 t 27 min 50 s (planen var 2 t 21 min). Kameraet kunne se jorden fra ca. 30 km, halvt så højt som ventet (50-70 km).
//   Lampen tændtes 700 m oppe. Disen er der hele vejen ned (Tomasko m.fl. 2005, fælden i fakta-faelder-liv.md).
// - Tiden på Jorden: Wikipedia (efter ESA) skriver indgangen kl. 10.13 og landingen ca. 12.43 i "SCET", som er tiden,
//   signalet nåede Jorden. ESA's 09.06 er ved Titan. 10.13 − 09.06 = 67 min, og Saturn stod i opposition 13. januar 2005
//   ca. 8 AU (ca. 1,2 milliarder km) fra Jorden: 67 lysminutter. Teksterne siger kun "over en time".
// - Billederne: NASA Photojournal PIA07234 "Descent Through Clouds to Surface" (credit NASA/JPL/ESA/University of
//   Arizona), Huygens' egne billeder med højden skrevet på hvert billede (lavet med billeder/solsystem/lav_huygens.py).

import { gå, kontakt } from '../../sideknap.js';

export const KM_PR_ENHED = 100; // i rummet: 1 enhed = 100 km (Titan bliver ca. 25,7 enheder i radius)

export const TITAN = {
  r: 2574.7, // km (NSSDC, fakta-maaner-liv.md afsnit 3)
  // Landingsstedet 10,573° S, 192,335° V (Kazeminejad m.fl. 2011, via Wikipedia, RS): 167,665° Ø
  land: { bredde: -10.573, længde: 360 - 192.335 },
};

export const START_KM = 1270; // her begyndte Huygens' tur gennem luften (ESA)
export const FALDSKÆRM_KM = 160; // hovedskærmen kom ud ca. 160-180 km oppe (ESA's plan). Tegningen bruger 160
export const NED_S = 2 * 3600 + 27 * 60 + 50; // 2 t 27 min 50 s i faldskærm (ESA, målt)
export const LYSTID_S = 67 * 60; // signalet var ca. 67 min om at nå Jorden (regnet, se øverst)
export const SE_JORDEN_KM = 30; // herfra kunne kameraet se jorden (ESA: "about 30 km")
export const LAMPE_KM = 0.7; // lampen tændtes 700 m oppe (ESA). Den målte jordens farve, den lyste ikke op
export const VENT_KM = 0.8; // forløbets trin 2 holder her, så trin 3 kan spørge om lampen, før den tændes

// Tempoet (tidsknappen): ▶ og ⏩ i forhold til virkeligheden. Hele turen i faldskærm tager ca. 1 minut med ⏩
export const SPOL = { spil: 30, hurtig: 150 };

// ---------- Tidsplanen: højden (km) efter sekunder i faldskærmen ----------
// Øverst ESA's tidsplan fra før landingen (lige linjer mellem punkterne). Under 50 km falder Huygens langsommere og
// langsommere, jo tykkere luften bliver: farten er a · e^(h/H) med H = 25,2 km, og a er valgt, så landingen kommer
// efter de rigtige 2 t 27 min 50 s (farten ved 50 km bliver ca. 24 m/s og ved jorden ca. 3 m/s: tegnet, ikke målt).
const PLAN = [[0, FALDSKÆRM_KM], [15 * 60, 125], [32 * 60, 60], [39 * 60, 50]];
const H = 25.2; // km
const [T50, H50] = PLAN[PLAN.length - 1];
const E50 = Math.exp(-H50 / H);
const K = NED_S - T50; // sekunder fra 50 km til jorden: t(h) = T50 + K · (e^(−h/H) − e^(−50/H)) / (1 − e^(−50/H))

export function højdeVed(s) {
  if (s <= 0) return FALDSKÆRM_KM;
  if (s >= NED_S) return 0;
  if (s < T50) {
    for (let i = 1; i < PLAN.length; i++) {
      const [t1, h1] = PLAN[i], [t0, h0] = PLAN[i - 1];
      if (s <= t1) return h0 + ((h1 - h0) * (s - t0)) / (t1 - t0);
    }
  }
  // (det omvendte af tidVed)
  const e = E50 + ((s - T50) / K) * (1 - E50);
  return Math.max(0, -H * Math.log(Math.min(1, e)));
}

// Sekunder i faldskærmen, når Huygens er i højden h (det omvendte af højdeVed)
export function tidVed(h) {
  if (h >= FALDSKÆRM_KM) return 0;
  if (h <= 0) return NED_S;
  if (h > H50) {
    for (let i = 1; i < PLAN.length; i++) {
      const [t1, h1] = PLAN[i], [t0, h0] = PLAN[i - 1];
      if (h >= h1) return t0 + ((t1 - t0) * (h0 - h)) / (h0 - h1);
    }
  }
  return T50 + (K * (Math.exp(-h / H) - E50)) / (1 - E50);
}

// Farten nedad (m/s) i højden h, regnet af tidsplanen
export function fartVed(h) {
  const s = tidVed(h);
  return ((højdeVed(Math.max(0, s - 5)) - højdeVed(Math.min(NED_S, s + 5))) * 1000) / 10;
}

// Faldskærmen: hovedskærmen (8,3 m), og efter 15 min den lille (3 m) for at nå ned, før batterierne slap op
export const skærmVed = (s) => (s < 15 * 60 ? 'stor' : 'lille');

// ---------- Uret ----------
const tt = (sek) => {
  const m = Math.floor(Math.max(0, sek) / 60);
  return `${Math.floor(m / 60)} t ${String(m % 60).padStart(2, '0')} min`;
};
// Uret i måleren: ved Titan (tiden i faldskærmen) eller på Jorden (det, Jorden har hørt indtil nu: signalet var over en
// time om at nå frem). Et tryk skifter. Det er det, man selv finder (drejebogens afsnit 1), så ingen tekst forklarer det.
export function urTekst(s, jorden = false) {
  if (!jorden) return { navn: 'I faldskærmen', tal: tt(s), under: 'ved Titan' };
  const hørt = s - LYSTID_S;
  return { navn: 'Hørt på Jorden', tal: hørt < 0 ? 'intet endnu' : tt(hørt), under: 'på Jorden' };
}

// ---------- Huygens' kamera: billederne fra luften (højden står på hvert billede i PIA07234) ----------
export const BILLEDER = [147.7, 113.6, 75.6, 53.4, 39.1, 30.8, 25.4, 21.9, 17.9, 15.7, 13.3, 7.8, 2.8, 1.5, 0.7]
  .map((km) => ({ km, fil: `huygens/luft-${String(Math.round(km * 10)).padStart(4, '0')}.webp` }));
// Det seneste billede, kameraet har taget i højden h (null før det første)
export function billedeVed(h) {
  let b = null;
  for (const x of BILLEDER) if (x.km >= h - 1e-9) b = x;
  return b;
}
export const KREDIT = 'ESA/NASA/JPL/University of Arizona';

// ---------- Landingen og billedet fra jorden (M5b) ----------
// Landingen (Wikipedia "Huygens (spacecraft)" efter NASA/JPL 2012 "Bounce, Skid, Wobble", RS): Huygens lavede et hul på
// ca. 12 cm, hoppede, gled 30-40 cm og vippede frem og tilbage. Stødet var som at tabe en bold fra ca. 1 m på Jorden.
export const LANDING = { hulCm: 12, glidCm: 35 };
// Billedet fra jorden: NASA Photojournal PIA07232 "First Color View of Titan's Surface" (credit NASA/JPL/ESA/University
// of Arizona, åbnet 21. november 2026), lavet af billeder/solsystem/lav_huygens.py (316 × 628 punkter, den hvide kant
// skåret væk). Teksten dér og hos ESA ("Raw image of Titan's surface with scale", åbnet): "The two rock-like objects
// just below the middle of the image are about 15 centimeters (left) and 4 centimeters (center) across respectively, at
// a distance of about 85 centimeters from Huygens". Farverne er lagt på bagefter ud fra Huygens' måling af lyset.
// Stenene (i procent af billedet, målt i billedet 21. november 2026): Den venstre er den flade sten under midten (ca. 125
// punkter bred). Den på 4 cm er den lille sten lige bag den runde sten, til højre for den (ca. 34 punkter): Stenene er lige
// langt væk, så 15 cm og 4 cm skal fylde ca. 125 og 33 punkter. Den runde sten er ca. 70 punkter (ca. 8 cm) og altså ikke
// den på 4 cm. ESA's udgave med målestokken kunne ikke åbnes i miljøet (media.esa.int), se docs/ikke-afproevet.md.
export const JORDEN = {
  fil: 'huygens/jorden.webp',
  bredde: 316,
  højde: 628,
  afstandCm: 85,
  sten: [
    { id: 'stor', cm: 15, x: 10.1, y: 58.1, b: 39.6, h: 8.0 },
    { id: 'lille', cm: 4, x: 63.9, y: 58.0, b: 10.8, h: 2.6 },
  ],
};

// ---------- Kanal A og B (M5b) ----------
// Huygens sendte på to radiokanaler til Cassini. Der skulle komme ca. 700 billeder, ca. 350 på hver. Cassini lyttede aldrig
// på kanal A på grund af en fejl i kommandoerne, så kun ca. 350 kom frem (Wikipedia "Huygens (spacecraft)", ESA indrømmede
// fejlen, fakta-maaner-liv.md afsnit 4, RS).
export const KANALER = { planlagt: 700, kom: 350 };
// Strimlen i trin 4: billederne fra trin 2 og 3, og et tomt felt mellem hvert (tegnet: den viser kun, at halvdelen
// manglede, ikke hvilke billeder)
export const STRIMMEL = [147.7, 53.4, 30.8, 21.9, 13.3, 7.8, 1.5].map((km) => BILLEDER.find((b) => b.km === km).fil).concat('huygens/jorden.webp');

// ---------- Etaperne i laboratoriet (bladring som Venus' tur ned) og underteksterne ----------
export const ETAPER = [
  { id: 'cassini', knap: 'Cassini', titel: 'Huygens sidder på Cassini', tekst: '25. december 2004. Cassini slipper rumsonden Huygens, som flyver alene mod Titan i tre uger.' },
  { id: 'faldskaerm', km: FALDSKÆRM_KM, knap: 'Faldskærmen', titel: 'I faldskærm', tekst: '14. januar 2005. Huygens har bremset i luften og hænger i faldskærm højt oppe. Kameraet ser kun dis.' },
  { id: 'jorden', km: 31, knap: 'Jorden', titel: 'Kameraet kan se jorden', tekst: 'Ca. 30 km oppe kan kameraet se jorden gennem disen: lyse bakker med mørke spor, der ligner flodlejer.' },
  { id: 'slette', km: 9, knap: 'Sletten', titel: 'Ned mod den mørke slette', tekst: 'Huygens driver ned mod en flad, mørk slette. Det er der, den skal lande.' },
  { id: 'landet', km: 0, knap: 'Landet', titel: 'Landet på Titan', tekst: 'Huygens står i et tørt flodleje med små sten af is. Tryk på de to sten foran den.' },
];
export const DATO = { slip: '25. december 2004', ned: '14. januar 2005' };

export const TAL = [
  ['Turen i faldskærm', '2 t 27 min 50 s'],
  ['Kameraet så jorden fra', 'ca. 30 km'],
];

// ---------- Siden i højre panel (højst tre sætninger i Kort og højst fire spørgsmål, drejebogens afsnit 10) ----------
// Faktatjekket 21. november 2026 (M5a): trykket ca. 1,5 gange Jordens (Fulchignoni m.fl. 2005), disen af organiske
// støvkorn (fakta-maaner-liv.md afsnit 3), ESA's 30 km og 50-70 km, faldskærmene og batterierne (153 min, Wikipedia),
// vinden over 400 km/t ved 150 km (Wikipedia efter Bird m.fl. 2005) og ca. 1 m/s de nederste 5 km (Bird m.fl. 2005).
// M5b: lampen og farverne (ESA, fakta-maaner-liv.md afsnit 4: "processed with reflection spectra data"), lyset som i
// tusmørket (ESA: ca. 1.000 gange svagere end sollys på Jorden), kanal A og vinden målt fra Jorden (Wikipedia efter ESA,
// RS), bolden fra ca. 1 m og hul, hop, glid og vip (Wikipedia efter NASA/JPL 2012, RS), jorden som våd sand eller let
// sammenpresset sne (Zarnecki m.fl. 2005) og "over en time" på jorden (ESA 1 t 10 min, andre 71-72 eller ca. 90 min).
export const SIDE = {
  kort: 'Titan er Saturns største måne og er pakket ind i en tyk, orange dis. I januar 2005 dalede rumsonden Huygens ned gennem disen i faldskærm og landede i et tørt flodleje. Det er stadig den eneste landing så langt ude i solsystemet.',
  emner: [
    {
      titel: 'Hvorfor tog turen ned over to timer?',
      tekst: '<p>Luften på Titan er tyk, og tyngdekraften er svag (ca. en syvendedel af Jordens). Ved jorden er lufttrykket ca. 1,5 gange Jordens, så faldskærmen falder langsomt. Turen i faldskærm tog 2 timer, 27 minutter og 50 sekunder, ca. 7 minutter længere end planlagt.</p>',
    },
    {
      titel: 'Hvornår kunne kameraet se jorden?',
      tekst: `<p>Disen er der hele vejen ned. Men fra ca. 30 km over jorden kunne Huygens' kamera se jorden gennem den. Forskerne havde ventet 50-70 km. ${kontakt('Huygens\' kamera')}</p>`,
      kontakt: 'Huygens\' kamera',
    },
    {
      // (M5b, drejebogens afsnit 9: "Hvordan ved vi det?")
      titel: 'Hvordan ved vi, hvilken farve jorden har?',
      tekst: '<p>Huygens\' kamera tog sort-hvide billeder. 700 m over jorden tændte Huygens en lampe og målte, hvordan jorden kastede lyset tilbage. Ud fra det er farverne lagt på billedet fra jorden bagefter. Lyset dernede er svagt, som i tusmørket lidt efter solnedgang.</p>',
    },
    {
      titel: 'Hvorfor kom der kun 350 billeder?',
      tekst: '<p>Huygens sendte på to radiokanaler, A og B, til Cassini, som sendte det hele videre til Jorden. Der skulle komme ca. 700 billeder. Men på grund af en fejl i kommandoerne lyttede Cassini aldrig på kanal A, så kun ca. 350 kom frem. Cassinis måling af vinden gik også tabt. I stedet lyttede radioteleskoper på Jorden selv til Huygens\' svage signal og målte vinden ud fra det, men ikke så nøjagtigt.</p>',
    },
  ],
  videre: [gå('solsystem:saturn:titan', 'Se Titan ved Saturn'), gå('solsystem:underisen', 'Under isen på Europa og Enceladus')],
  nørd: '<p><b>Faldskærmene:</b> En lille pilotskærm (2,6 m) trak hovedskærmen (8,3 m) ud ca. 160-180 km oppe. Efter ca. 15 minutter skiftede Huygens til en mindre skærm (3 m), så den faldt hurtigere og nåede ned, før batterierne slap op. Tallene er ESA\'s plan fra før landingen.</p><p><b>Vinden:</b> Ca. 150 km oppe blæste vinden Huygens østpå med over 400 km i timen. De nederste 5 km var der næsten vindstille, ca. 1 meter i sekundet.</p><p><b>Rejsen:</b> Huygens fløj med Cassini i over syv år og blev sluppet 25. december 2004, tre uger før landingen. Den 14. januar 2005 nåede den Titans luft ca. 1.270 km oppe og bremsede i få minutter, før faldskærmen kom ud.</p><p><b>Billederne fra luften:</b> Lyse bakker med mørke, forgrenede spor, der ligner flodlejer på Jorden. De løber ned mod en flad, mørk slette, og det var der, Huygens landede. Disen er orange, fordi sollyset højt oppe laver et smog af bittesmå støvkorn af stoffer med carbon.</p><p><b>Landingen:</b> Huygens ramte jorden lige så hårdt, som når man taber en bold fra ca. 1 m ned på gulvet. Den lavede et hul på ca. 12 cm, hoppede, gled 30-40 cm og vippede frem og tilbage. Jorden er blød, men fast, som våd sand eller let sammenpresset sne. Bagefter sendte Huygens i over en time, til Cassini forsvandt under horisonten.</p>',
  billeder: `<p>Billederne i Huygens' kamera er Huygens' egne sort-hvide billeder fra kameraet DISR, 14. januar 2005, med højden fra NASA's film af nedstigningen (PIA07234). Billedet fra jorden er det første farvebillede fra Titans jord (PIA07232), og farverne er lagt på bagefter. Credit: ${KREDIT}. ESA's standardlicens tillader brug i undervisning med credit. Titans kort under disen er fra Cassini (NASA/JPL-Caltech/Space Science Institute).</p>`,
  ærligt: `<p>Turen i faldskærm er spolet frem ca. ${SPOL.hurtig} gange (med ⏩), og turen fra Cassini til faldskærmen går meget hurtigere. Huygens, faldskærmene, Cassini og disen er tegnet af os. I rummet er Huygens og Cassini tegnet meget større, end de var, og Cassini står meget tættere på Titan. Jorden under disen er Cassinis kort, som kun viser lyse og mørke egne (ca. 8 km pr. punkt i kortet, vi bruger), med bakker, flodlejer og sletten tegnet ovenpå efter Huygens' billeder. Lyset ved jorden er ca. 1.000 gange svagere end sollys på Jorden, som i tusmørket lidt efter solnedgang, og det kommer gennem den orange dis. Tegningen er lysere, så man kan se Huygens og jorden. Billederne i kameraet er Huygens' egne. Tidsplanen mellem højderne er ESA's plan fra før landingen, strakt, så den passer med den rigtige tid, og uret ved Titan er omtrentligt. Landingen og jorden under Huygens er tegnet efter målingerne. Billedet fra jorden er Huygens' eget, men farverne er lagt på bagefter. Strimlen med de tomme felter viser kun, at halvdelen af billederne manglede, ikke hvilke.</p>`,
};

// Korte tekster i scenen
export const TEKST = {
  rejse: 'Tre uger senere …',
  slip: '🪂 Slip Huygens',
  kamera: 'Huygens\' kamera',
  land: '🪂 Land',
  foto: '📷 Billedet fra jorden',
};
