// Pluto og Charon som tal (docs/drejebog-merkur-pluto.md, MP3): formen, døgnet, polens retning, banen og dansen om det
// fælles tyngdepunkt, så Solens retning og punktet under Solen kan regnes for enhver dato. Uden Three.js, så det kan
// testes i Node (tests/pluto.mjs). Tallene står i docs/fakta-solsystemet/del8-merkur-og-pluto.md.
//
// - Radius: New Horizons' kort (USGS) er lavet til en kugle med radius 1.188,3 km (Pluto) og 606 km (Charon), som NSSDC.
// - Døgnet: Pluto drejer én gang på 6,387 døgn, og Charon går rundt på præcis samme tid (bundet begge veje). IAU's
//   primærmeridian W = 302,695° + 56,3625225° · d (d = døgn siden J2000) om den "positive" pol (højrehåndsreglen, som
//   New Horizons' kort). Den pol peger syd for ekliptikken (rektascension 132,993°, deklination −6,163°), så Pluto ligger
//   næsten ned og drejer "baglæns" set fra ekliptikkens nordpol (aksen hælder ca. 120°).
// - Længdegrad: østlig, og længde 0° er det punkt, der vender mod Charon (USGS' navneliste). JPL Horizons (PLU060)
//   giver punktet under Charon ved ca. 1,5° Ø i 2015-2031, og punktet under Solen inden for ca. 0,1° af IAU's formel.
// - Charon: samme pol, og W for Charon er 180° mindre, så Charons længde 0° vender mod Pluto. Banen er rund og ligger
//   i Plutos ækvator (NSSDC: excentricitet 0,0).
// - Banen om Solen: JPL Horizons med ét punkt om året (js/data/pluto-bane.js, også brugt af overblikket).

import { plads as planetPlads, århundreder, AU } from './planeter.js';

const RAD = Math.PI / 180;
const ε = 23.4392911 * RAD; // ekliptikkens hældning (J2000)

export const PLUTO = {
  radius: 1188.3, // km (NSSDC og kortene)
  masse: 1.303e22, // kg (NSSDC)
  stjernedøgn: 360 / 56.3625225, // døgn: 6,387 (IAU. NSSDC: 153,29 timer)
  år: 90560, // døgn (NSSDC): 247,9 jordår
  pol: { ra: 132.993, dec: -6.163 }, // IAU (2015), den positive pol
  W0: 302.695, // grader (IAU)
  Wrate: 56.3625225, // grader pr. døgn (IAU)
};

export const CHARON = {
  radius: 606, // km (NSSDC og kortet)
  masse: 1.586e21, // kg (NSSDC)
  afstand: 19596, // km fra Plutos midte til Charons (NSSDC)
};

// Det fælles tyngdepunkt: afstanden fra Plutos midte (km) mod Charon. 19.596 · 1,586 / (13,03 + 1,586) = 2.126 km,
// altså ca. 940 km over Plutos overflade.
export const TYNGDEPUNKT = (CHARON.afstand * CHARON.masse) / (PLUTO.masse + CHARON.masse);

// Døgn siden J2000 (regnet som UT: forskellen til TDB er ca. et minut, og Pluto drejer kun 0,04° på et minut)
export const døgnSiden = (dato) => århundreder(dato) * 36525;

// Primærmeridianens vinkel W (grader, fra knuden målt mod øst langs ækvator)
export const meridian = (dato) => PLUTO.W0 + PLUTO.Wrate * døgnSiden(dato);

// Fra ekliptikkens retninger (X mod forårspunktet, Z mod nordpolen) til programmets (x, y, z) = (Y, Z, X)
const tilProgram = ([X, Y, Z]) => [Y, Z, X];
function fraÆkvator(ra, dec) {
  const x = Math.cos(dec * RAD) * Math.cos(ra * RAD), y = Math.cos(dec * RAD) * Math.sin(ra * RAD), z = Math.sin(dec * RAD);
  return [x, Math.cos(ε) * y + Math.sin(ε) * z, -Math.sin(ε) * y + Math.cos(ε) * z];
}

// Polen og knuden (mellem Plutos ækvator og Jordens ækvator) i programmets retninger. Polen flytter sig ikke i IAU's
// formel, så datoen bruges ikke.
export const pol = () => tilProgram(fraÆkvator(PLUTO.pol.ra, PLUTO.pol.dec));
export const knude = () => tilProgram(fraÆkvator(PLUTO.pol.ra + 90, 0));

// Plutos plads om Solen (AU, ekliptikkens retninger) og Solens retning set fra Pluto (programmets retninger)
export const plads = (dato) => planetPlads('pluto', dato);
export function solRetning(dato) {
  const [X, Y, Z] = plads(dato);
  const l = Math.hypot(X, Y, Z);
  return tilProgram([-X / l, -Y / l, -Z / l]);
}
export const solAfstand = (dato) => Math.hypot(...plads(dato)); // AU
// Hvor mange timer sollyset er om at nå Pluto
export const lysTimer = (dato) => (solAfstand(dato) * AU) / 299792.458 / 3600;

// Punktet under Solen: bredde og østlig længde (grader). Regnet i Plutos egne retninger: x mod knuden, z mod polen.
export function underSolen(dato) {
  const s = solRetning(dato), p = pol(), q = knude();
  const e2 = [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; // 90° øst for knuden
  const prik = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const bredde = Math.asin(Math.max(-1, Math.min(1, prik(s, p)))) / RAD;
  const vinkel = Math.atan2(prik(s, e2), prik(s, q)) / RAD; // fra knuden mod øst
  return { bredde, længde: (((vinkel - meridian(dato)) % 360) + 360) % 360 };
}

// Charons størrelse på Plutos himmel (grader) set fra punktet under Charon, og Plutos set fra Charon
export const charonPåHimlen = () => (2 * Math.atan(CHARON.radius / (CHARON.afstand - PLUTO.radius))) / RAD;
export const plutoPåHimlen = () => (2 * Math.atan(PLUTO.radius / (CHARON.afstand - CHARON.radius))) / RAD;

// Den dato (ms) nærmest ms, hvor Solen står lige over længden (grader øst). Pluto drejer baglæns, så punktet under Solen
// flytter sig ca. 56,4° mod vest pr. døgn. Højst en halv omgang (ca. 3,2 døgn) frem eller tilbage (MP4: stederne).
export function datoMedSolOver(ms, længde) {
  const prDøgn = 360 / PLUTO.stjernedøgn; // (omtrent: Solen flytter sig næsten ikke på et døgn)
  let t = ms;
  for (let i = 0; i < 3; i++) {
    const f = ((underSolen(new Date(t)).længde - længde + 540) % 360) - 180; // så langt øst for målet (grader)
    t += (f / prDøgn) * 86400000;
  }
  return t;
}
