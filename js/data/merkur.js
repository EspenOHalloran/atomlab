// Merkur som tal (docs/drejebog-merkur-pluto.md, MP1): formen, døgnet, polens retning og banen, så Solens retning og
// punktet under Solen kan regnes for enhver dato. Uden Three.js, så det kan testes i Node (tests/merkur.mjs).
// Tallene står i docs/fakta-solsystemet/del8-merkur-og-pluto.md.
//
// - Radius: MESSENGERs kort (USGS) er lavet til en kugle med radius 2.439,4 km, og højderne er regnet fra den. NSSDC
//   skriver 2.439,7 km. Kuglen i programmet er kortenes (som Venus), og NSSDC's tal står i teksterne.
// - Døgnet: Merkur drejer tre gange om sig selv, mens den går to gange rundt om Solen (3:2). IAU's primærmeridian
//   W = 329,5988° + 6,1385108° · d (d = døgn siden J2000), altså en omgang på 58,646 døgn (NSSDC: 1.407,6 timer). IAU
//   lægger nogle små svingninger til (højst ca. 0,01°), dem springer vi over. Soldøgnet regnes ud fra stjernedøgnet og
//   året: 175,94 døgn (NSSDC), præcis to merkur-år.
// - Polen (IAU 2015): rektascension 281,0103° − 0,0328° · T og deklination 61,4155° − 0,0049° · T (T = julianske
//   århundreder siden J2000). Aksen står næsten lodret på banen (0,034°), så der er ingen årstider.
// - Banen: JPL's korte formler ("Approximate Positions of the Planets", tabel 1, 1800-2050), som Venus. Tjekket mod
//   JPL Horizons (tests/merkur.mjs).
// - Længdegrad: østlig (IAU og USGS' kort for Merkur). Horizons og USGS' navneliste skriver vestlig længde (fælde 7):
//   Caloris ligger ved 198,02° V = 161,98° Ø.

import { plads, pol as polFor, knude as knudeFor, solRetning as solFor, århundreder } from './isgiganter.js';

const RAD = Math.PI / 180;

export const MERKUR = {
  radius: 2439.4, // km: kuglen i MESSENGERs kort (USGS)
  middelRadius: 2439.7, // km (NSSDC)
  stjernedøgn: 360 / 6.1385108, // døgn: 58,646 (IAU's drejning. NSSDC skriver 1.407,6 timer = 58,65 døgn)
  år: 87.969, // døgn (NSSDC)
  hældning: 0.034, // grader (NSSDC)
  pol: (T) => ({ ra: 281.0103 - 0.0328 * T, dec: 61.4155 - 0.0049 * T }), // IAU's nordpol (2015)
  W0: 329.5988, // grader (IAU): primærmeridianens vinkel fra knuden ved J2000
  Wrate: 6.1385108, // grader pr. døgn (IAU)
  // a (AU), e, I, L, ϖ (længde af perihel), Ω (knude), og ændringen pr. århundrede (JPL, tabel 1)
  bane: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
  rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
};

// Soldøgnet (fra solopgang til solopgang) i middel ud fra stjernedøgnet og året. Merkur drejer samme vej, som den går
// rundt om Solen, så de trækkes fra hinanden: 1 / (1/58,646 − 1/87,969) = 175,94 døgn. (Fordi banen er aflang, går
// Solen ikke lige hurtigt over himlen. Det kommer i MP2: Solen, der vender om.)
export function soldøgn(stjernedøgn = MERKUR.stjernedøgn, år = MERKUR.år) {
  return 1 / (1 / stjernedøgn - 1 / år);
}

// Døgn siden J2000 (1. januar 2000 kl. 12, regnet som UT: forskellen til TDB er ca. et minut og betyder intet her)
export const døgnSiden = (dato) => århundreder(dato) * 36525;

// Primærmeridianens vinkel W (grader, fra knuden målt mod øst langs ækvator)
export const meridian = (dato) => MERKUR.W0 + MERKUR.Wrate * døgnSiden(dato);

// IAU's nordpol, knuden og Solens retning i programmets retninger (ekliptikkens: y mod nord, z mod forårspunktet)
export const pol = (dato) => polFor(MERKUR, dato);
export const knude = (dato) => knudeFor(MERKUR, dato);
export const solRetning = (dato) => solFor(MERKUR, dato);
export const solAfstand = (dato) => Math.hypot(...plads(MERKUR, dato)); // AU

// Punktet under Solen: bredde og østlig længde (grader). Regnet i planetens egne retninger: x mod knuden, z mod polen.
export function underSolen(dato) {
  const s = solRetning(dato), p = pol(dato), q = knude(dato);
  const e2 = [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; // 90° øst for knuden
  const prik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const bredde = Math.asin(Math.max(-1, Math.min(1, prik(s, p)))) / RAD;
  const vinkel = Math.atan2(prik(s, e2), prik(s, q)) / RAD; // fra knuden mod øst
  return { bredde, længde: (((vinkel - meridian(dato)) % 360) + 360) % 360 };
}
