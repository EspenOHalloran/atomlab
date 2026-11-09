// Venus som tal (docs/plan-venus.md, V1): formen, døgnet, polens retning og banen, så Solens retning og punktet under
// Solen kan regnes for enhver dato. Uden Three.js, så det kan testes i Node (tests/venus.mjs).
// Tallene står i docs/fakta-solsystemet/del7-venus.md.
//
// - Radius: Magellans kort (USGS) er lavet til en kugle med radius 6.051,0 km, og højderne er regnet fra den. NSSDC
//   skriver 6.051,8 km (middelradius). Kuglen i programmet er kortets (fælde 13), og NSSDC's tal står i teksterne.
// - Døgnet: Venus drejer baglæns. Om IAU's nordpol (den, der vender mod ekliptikkens nordside) drejer den med uret.
//   Primærmeridianen W = 160,20° − 1,4813688° · d (IAU, d = døgn siden J2000), altså en omgang på 243,02 døgn, som
//   NSSDC's −5.832,6 timer (243,0 døgn). Soldøgnet regnes ud fra stjernedøgnet og året: 116,75 døgn (NSSDC).
// - Banen: JPL's korte formler ("Approximate Positions of the Planets", tabel 1, 1800-2050), som Uranus og Neptun
//   (js/data/isgiganter.js). Tjekket mod JPL Horizons (tests/venus.mjs).
// - Længdegrad: østlig (IAU og USGS' kort for Venus). Venera 13 landede ved 303° Ø.

import { plads, pol as polFor, knude as knudeFor, solRetning as solFor, århundreder } from './isgiganter.js';

const RAD = Math.PI / 180;

export const VENUS = {
  radius: 6051.0, // km: kuglen i Magellans kort (USGS)
  middelRadius: 6051.8, // km (NSSDC)
  stjernedøgn: 5832.6 / 24, // døgn (NSSDC: −5.832,6 timer, minus = baglæns)
  år: 224.701, // døgn (NSSDC)
  hældning: 177.36, // grader (NSSDC)
  pol: () => ({ ra: 272.76, dec: 67.16 }), // IAU's nordpol (NSSDC, J2000)
  W0: 160.20, // grader (IAU): primærmeridianens vinkel fra knuden ved J2000
  Wrate: -1.4813688, // grader pr. døgn (IAU): minus, for Venus drejer baglæns
  // a (AU), e, I, L, ϖ (længde af perihel), Ω (knude), og ændringen pr. århundrede (JPL, tabel 1)
  bane: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
  rate: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
};

// Soldøgnet (fra solopgang til solopgang) ud fra stjernedøgnet og året. Venus drejer baglæns, mens den går mod uret om
// Solen, så de to lægges sammen: 1 / (1/243,0 + 1/224,7) = 116,75 døgn. (En planet, der drejer forlæns, trækker fra.)
export function soldøgn(stjernedøgn = VENUS.stjernedøgn, år = VENUS.år, baglæns = true) {
  return 1 / (1 / stjernedøgn + (baglæns ? 1 : -1) / år);
}

// Døgn siden J2000 (1. januar 2000 kl. 12, regnet som UT: forskellen til TDB er ca. et minut og betyder intet her)
export const døgnSiden = (dato) => århundreder(dato) * 36525;

// Primærmeridianens vinkel W (grader, fra knuden målt mod øst langs ækvator). Den bliver mindre med tiden (baglæns).
export const meridian = (dato) => VENUS.W0 + VENUS.Wrate * døgnSiden(dato);

// IAU's nordpol, knuden og Solens retning i programmets retninger (ekliptikkens: y mod nord, z mod forårspunktet)
export const pol = (dato) => polFor(VENUS, dato);
export const knude = (dato) => knudeFor(VENUS, dato);
export const solRetning = (dato) => solFor(VENUS, dato);
export const solAfstand = (dato) => Math.hypot(...plads(VENUS, dato)); // AU

// Punktet under Solen: bredde og østlig længde (grader). Regnet i planetens egne retninger: x mod knuden, z mod polen.
export function underSolen(dato) {
  const s = solRetning(dato), p = pol(dato), q = knude(dato);
  const e2 = [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; // 90° øst for knuden
  const prik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const bredde = Math.asin(Math.max(-1, Math.min(1, prik(s, p)))) / RAD;
  const vinkel = Math.atan2(prik(s, e2), prik(s, q)) / RAD; // fra knuden mod øst
  return { bredde, længde: (((vinkel - meridian(dato)) % 360) + 360) % 360 };
}
