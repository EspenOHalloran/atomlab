// Planeterne og Pluto som tal til overblikket (docs/drejebog-overblik.md): banerne, størrelserne, omløbstiderne og
// polerne. Uden Three.js, så det kan testes i Node (tests/planeter.mjs). Tallene står i drejebogens afsnit 4.
//
// - Banerne: JPL's korte formler ("Approximate Positions of the Planets", tabel 1, ssd.jpl.nasa.gov, hentet
//   15. november 2026). Tabellen gælder 1800-2050. Overblikket bruger den til 2100 (jeres svar 14. november 2026):
//   Fejlen vokser, men er i 2100 under ca. 0,5° (testen sammenligner med Horizons). "Jorden" er Jordens og Månens
//   fælles tyngdepunkt (EM Bary), højst ca. 4.700 km fra Jordens midte.
// - Pluto er fjernet fra JPL's tabel, så dens plads kommer fra en tabel med ét punkt om året fra Horizons
//   (js/data/pluto-bane.js).
// - Radierne er middelradier (NSSDC), så Jupiter er 11 gange så bred som Jorden. Omløbstiderne er NSSDC's.
// - Polerne og drejningen (W) er IAU's (2015). Bruges til kuglernes hældning i overblikket.
// - Retningerne: tabellerne giver ekliptikkens (X mod forårspunktet, Z mod ekliptikkens nordpol). Programmets er
//   (x, y, z) = (Y, Z, X) som i jordkloden.js og isgiganter.js.

import { JD0, DAG, XYZ } from './pluto-bane.js';

const RAD = Math.PI / 180;
const ε = 23.4392911 * RAD; // ekliptikkens hældning (J2000)
export const AU = 149597870.7; // km (IAU 2012)
export const LYS = 299792.458; // km/s

// Juliansk dato og julianske århundreder siden J2000 (regnet som UT: forskellen til TT er under et minut)
export const julianskDato = (dato) => dato.getTime() / 864e5 + 2440587.5;
export function århundreder(dato) {
  return (dato.getTime() - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525;
}

// Pladsen (AU, ekliptikkens retninger) ud fra JPL's elementer: [a, e, I, L, ϖ, Ω] og ændringen pr. århundrede
export function kepler(bane, rate, dato) {
  const T = århundreder(dato);
  const [a, e, I, L, ϖ, Ω] = bane.map((v, i) => v + rate[i] * T);
  const ω = (ϖ - Ω) * RAD;
  const M = ((L - ϖ) % 360) * RAD;
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cO = Math.cos(Ω * RAD), sO = Math.sin(Ω * RAD), cw = Math.cos(ω), sw = Math.sin(ω), cI = Math.cos(I * RAD), sI = Math.sin(I * RAD);
  return [
    (cw * cO - sw * sO * cI) * x + (-sw * cO - cw * sO * cI) * y,
    (cw * sO + sw * cO * cI) * x + (-sw * sO + cw * cO * cI) * y,
    sw * sI * x + cw * sI * y,
  ];
}

// Plutos plads (AU) lagt lineært mellem årets to punkter. Uden for tabellen bruges det nærmeste stykke.
function plutoPlads(dato) {
  const d = julianskDato(dato) - JD0;
  let lav = 0, høj = DAG.length - 1;
  if (d <= DAG[0]) høj = 1;
  else if (d >= DAG[høj]) lav = høj - 1;
  else {
    while (høj - lav > 1) {
      const m = (lav + høj) >> 1;
      if (DAG[m] <= d) lav = m; else høj = m;
    }
  }
  const t = (d - DAG[lav]) / (DAG[høj] - DAG[lav]);
  return [0, 1, 2].map((k) => XYZ[lav * 3 + k] + (XYZ[høj * 3 + k] - XYZ[lav * 3 + k]) * t);
}

// De otte planeter og Pluto efter afstanden til Solen. fænomen: id'et på planetens egen visning i Solsystemet (null:
// ikke bygget endnu, jeres ønske 13. november 2026: en lille kugle med et kort panel). kort: 1k-kortet i
// billeder/solsystem/ (null: en jævn farve). gråt: kortet er gråtoner. pol: IAU's nordpol (rektascension og deklination,
// J2000). w: IAU's W = w[0] + w[1] · døgn siden J2000 (grader, hvor kortets længde 0° står).
export const PLANETER = [
  {
    id: 'merkur', navn: 'Merkur', fænomen: 'merkur', radius: 2439.7, omløb: 87.969, farve: '#8f8a85', kort: 'merkur-1k.jpg', gråt: true,
    bane: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
    rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    pol: { ra: 281.0103, dec: 61.4155 }, w: [329.5988, 6.1385108],
  },
  {
    id: 'venus', navn: 'Venus', fænomen: 'venus', radius: 6051.8, omløb: 224.701, farve: '#e8dcbf', kort: null,
    bane: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
    rate: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    pol: { ra: 272.76, dec: 67.16 }, w: [160.20, -1.4813688],
  },
  {
    id: 'jorden', navn: 'Jorden', fænomen: 'jorden', radius: 6371.0, omløb: 365.256, farve: '#3f6fb0', kort: 'jorden-1k.jpg',
    bane: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
    rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    pol: { ra: 0, dec: 90 }, w: [190.147, 360.9856235],
  },
  {
    id: 'mars', navn: 'Mars', fænomen: 'mars', radius: 3389.5, omløb: 686.980, farve: '#b5643a', kort: 'mars-1k.jpg',
    bane: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    pol: { ra: 317.269, dec: 54.432 }, w: [176.049, 350.891983],
  },
  {
    id: 'jupiter', navn: 'Jupiter', fænomen: 'jupiter', radius: 69911, omløb: 4332.589, farve: '#c9a77f', kort: 'jupiter-1k.jpg',
    bane: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    pol: { ra: 268.057, dec: 64.495 }, w: [284.95, 870.536],
  },
  {
    id: 'saturn', navn: 'Saturn', fænomen: 'saturn', radius: 58232, omløb: 10759.22, farve: '#d8c08c', kort: 'saturn-1k.jpg',
    bane: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    rate: [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    pol: { ra: 40.589, dec: 83.537 }, w: [38.90, 810.7939024],
  },
  {
    id: 'uranus', navn: 'Uranus', fænomen: 'uranus', radius: 25362, omløb: 30685.4, farve: '#a9d8de', kort: 'uranus-1k.jpg',
    bane: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503],
    rate: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
    pol: { ra: 257.311, dec: -15.175 }, w: [203.81, -501.1600928],
  },
  {
    id: 'neptun', navn: 'Neptun', fænomen: 'neptun', radius: 24622, omløb: 60189, farve: '#4f6fd0', kort: 'neptun-1k.jpg',
    bane: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rate: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
    pol: { ra: 299.36, dec: 43.46 }, w: [249.978, 541.1397757],
  },
  {
    id: 'pluto', navn: 'Pluto', fænomen: null, radius: 1188.3, omløb: 90560, farve: '#c9b29a', kort: 'pluto-1k.jpg', dværg: true,
    pol: { ra: 132.993, dec: -6.163 }, w: [302.695, 56.3625225],
  },
];

export const SOLEN = { radius: 695700, pol: { ra: 286.13, dec: 63.87 } };

export const planet = (id) => PLANETER.find((p) => p.id === id);

// Planetens plads om Solen (AU) i ekliptikkens retninger (X, Y, Z)
export function plads(id, dato) {
  const p = typeof id === 'string' ? planet(id) : id;
  return p.id === 'pluto' ? plutoPlads(dato) : kepler(p.bane, p.rate, dato);
}

// Fra ekliptikkens retninger til programmets: (x, y, z) = (Y, Z, X)
export const tilProgram = ([X, Y, Z]) => [Y, Z, X];

// Afstanden til Solen (AU)
export const solAfstand = (id, dato) => Math.hypot(...plads(id, dato));

// En retning givet ved rektascension og deklination (grader) i programmets retninger (enhedsvektor)
export function fraÆkvator(ra, dec) {
  const x = Math.cos(dec * RAD) * Math.cos(ra * RAD), y = Math.cos(dec * RAD) * Math.sin(ra * RAD), z = Math.sin(dec * RAD);
  return tilProgram([x, Math.cos(ε) * y + Math.sin(ε) * z, -Math.sin(ε) * y + Math.cos(ε) * z]);
}

// Kuglens retninger i programmets retninger: nordpolen (op) og der, hvor kortets længde 0° står (nul). Længden 0°
// står W grader øst for knuden mellem planetens ækvator og Jordens ækvator (IAU).
export function kugleRetning(p, dato) {
  const op = fraÆkvator(p.pol.ra, p.pol.dec);
  const knude = fraÆkvator(p.pol.ra + 90, 0);
  const øst = [op[1] * knude[2] - op[2] * knude[1], op[2] * knude[0] - op[0] * knude[2], op[0] * knude[1] - op[1] * knude[0]];
  const d = julianskDato(dato) - 2451545.0;
  const W = ((p.w[0] + p.w[1] * d) % 360) * RAD;
  const nul = [0, 1, 2].map((k) => knude[k] * Math.cos(W) + øst[k] * Math.sin(W));
  return { op, nul };
}

// Lyset fra Solen til planeten (sekunder) på datoen
export const lysTid = (id, dato) => (solAfstand(id, dato) * AU) / LYS;

// Lysets tid som tekst ("45 s", "8 min 14 s", "4 t 8 min")
export function lysTekst(sek) {
  const s = Math.floor(sek);
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min ${s % 60} s`;
  return `${Math.floor(s / 3600)} t ${Math.floor((s % 3600) / 60)} min`;
}

// "Rejs med lyset" er spolet frem og går hurtigere og hurtigere: Efter w sekunder har lyset rejst A · w^P sekunder, så
// det når Jorden (494 s i middel) efter 8 s og Neptun (ca. 14.900 s) efter 30 s (jeres valg 15. november 2026)
const RP = Math.log(14900 / 494) / Math.log(30 / 8);
const RA = 494 / 8 ** RP;
export const lysRejseTid = (w) => RA * w ** RP;

// En afstand i km som tekst ("16,3 milliarder km", "148 millioner km", "19.400 km")
const komma = (x, d) => x.toFixed(d).replace('.', ',');
export function kmTekst(km) {
  if (km >= 1e9) return `${komma(km / 1e9, 1)} milliarder km`;
  if (km >= 1e7) return `${Math.round(km / 1e6)} millioner km`;
  if (km >= 1e6) return `${komma(km / 1e6, 1)} millioner km`;
  const n = km >= 1e5 ? Math.round(km / 1e3) * 1e3 : km >= 1e4 ? Math.round(km / 100) * 100 : Math.round(km / 10) * 10;
  return `${n.toLocaleString('da-DK')} km`;
}

// Den yderste dato, overblikket kan vise (jeres svar 14. november 2026: 1800-2100)
export const FØRSTE = Date.UTC(1800, 0, 5);
export const SIDSTE = Date.UTC(2100, 11, 31);
