// Solen på Merkurs himmel (MP2 i docs/drejebog-merkur-pluto.md): hvor højt Solen står et sted, hvor stor den ser ud,
// og "Solen, der vender om". Regnes med den samme bane og drejning som kloden (js/data/merkur.js), så tegningen af
// Solen ved horisonten og 3D-billedet altid passer sammen. Uden Three.js, så det kan testes i Node (tests/merkur.mjs).
//
// Solen vender om: Tæt ved perihel (det sted i banen, der er nærmest Solen) løber Merkur hurtigere rundt om Solen
// (ca. 6,35° pr. døgn), end den drejer om sig selv (6,14° pr. døgn). Så går punktet under Solen baglæns mod øst i ca.
// 8 døgn og ca. 1,1° (docs/fakta-solsystemet/del8-merkur-og-pluto.md, afsnit 2). Står man på ækvator ca. 90° vest for
// punktet under Solen (dér, hvor Solen står op), kommer Solen et stykke op, synker ned igen og står så op for alvor.

import { underSolen, solAfstand, MERKUR } from './merkur.js';
import { århundreder } from './isgiganter.js';

const RAD = Math.PI / 180;
const DØGN = 864e5;
const SOL_KM = 695700; // Solens radius (IAU)
const AU_KM = 149597870.7;

// Solens skive set fra Merkur (grader, hele bredden). Fra Jorden er den ca. 0,53°.
export const solSkive = (dato) => (2 * Math.asin(SOL_KM / (solAfstand(dato) * AU_KM))) / RAD;

// Solens midte over horisonten (grader) et sted (bredde, østlig længde) på datoen. Kuglen er glat (ingen bjerge).
export function solHøjde(dato, længde, bredde = 0) {
  const u = underSolen(dato);
  const s = Math.sin(bredde * RAD) * Math.sin(u.bredde * RAD) + Math.cos(bredde * RAD) * Math.cos(u.bredde * RAD) * Math.cos((længde - u.længde) * RAD);
  return Math.asin(Math.max(-1, Math.min(1, s))) / RAD;
}

const omkring = (v) => ((((v + 180) % 360) + 360) % 360) - 180; // −180 til 180

// Timevinklen (grader) et sted: 0 = Solen står højest (middag), negativ = formiddag (Solen står mod øst, for Merkur
// drejer samme vej som Jorden), positiv = eftermiddag. Punktet under Solen flytter sig mod vest, så et sted vest for det
// har formiddag.
export const timevinkel = (dato, længde) => omkring(længde - underSolen(dato).længde);

// Den dato nærmest ms, hvor timevinklen ved stedet er h (grader). Søger et halvt soldøgn (88 døgn) til hver side. Tæt
// ved perihel kan det ske tre gange (Solen vender om), og så vælges det, der er nærmest.
export function datoMedTimevinkel(ms, længde, h) {
  const f = (t) => omkring(timevinkel(new Date(t), længde) - h);
  let bedst = null;
  let t0 = ms - 88 * DØGN, f0 = f(t0);
  for (let t = t0 + DØGN / 2; t <= ms + 88 * DØGN; t += DØGN / 2) {
    const f1 = f(t);
    // Et skift af fortegn (ikke springet ved ±180°)
    if ((f0 <= 0) !== (f1 <= 0) && Math.abs(f1 - f0) < 90) {
      let a = t0, b = t, fa = f0;
      for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2, fm = f(m);
        if ((fa <= 0) === (fm <= 0)) { a = m; fa = fm; } else b = m;
      }
      const tt = (a + b) / 2;
      if (!bedst || Math.abs(tt - ms) < Math.abs(bedst - ms)) bedst = tt;
    }
    t0 = t;
    f0 = f1;
  }
  return bedst ?? ms;
}

// Perihel nærmest datoen ms (ms): middelanomalien M = L − ϖ (JPL's korte formler) er 0, og så finjusteret til den
// mindste afstand til Solen.
export function perihel(ms) {
  const T = århundreder(new Date(ms));
  const [, , , L, ϖ] = MERKUR.bane, [, , , dL, dϖ] = MERKUR.rate;
  const M = L + dL * T - (ϖ + dϖ * T);
  const pr = (dL - dϖ) / 36525; // grader pr. døgn
  let t = ms - (omkring(M) / pr) * DØGN;
  let skridt = DØGN / 2;
  for (let i = 0; i < 30; i++) {
    const a = solAfstand(new Date(t - skridt)), b = solAfstand(new Date(t + skridt)), c = solAfstand(new Date(t));
    if (a < c) t -= skridt; else if (b < c) t += skridt; else skridt /= 2;
  }
  return t;
}

// Hvor langt Solen står over horisonten med sin øverste kant, når den står stille første gang (grader). Så kommer ca.
// halvdelen af skiven op, før den synker igen, og den når at forsvinde helt (den går ca. 1,1° baglæns).
export const TOP = 0.9;

// Den dobbelte solopgang ved perihel nærmest ms: stedet på ækvator (østlig længde), perihel, de to gange Solen står
// stille (stille1, stille2: punktet under Solen vender), og hvor langt den går baglæns (grader). start og slut er
// datoer til tegningen: lidt før Solens øverste kant kommer op og lidt efter, at hele skiven er oppe.
export function dobbeltSolopgang(ms) {
  const p = perihel(ms);
  const ls = (t) => underSolen(new Date(t)).længde;
  const ref = ls(p);
  const rel = (t) => omkring(ls(t) - ref);
  // Punktet under Solen går mod vest (længden falder), undtagen mens Solen vender: Find det mindste og det største
  let stille1 = p, stille2 = p, min = Infinity, max = -Infinity;
  for (let t = p - 8 * DØGN; t <= p + 8 * DØGN; t += DØGN / 48) {
    const v = rel(t);
    if (t < p && v < min) { min = v; stille1 = t; }
    if (t > p && v > max) { max = v; stille2 = t; }
  }
  // Stedet: Solens øverste kant står TOP over horisonten, når Solen står stille første gang. Solens midte står
  // (længde + 90° − punktet under Solen) over horisonten (ækvator, aksen står næsten lodret).
  const længde = (((ref + min - 90 + TOP - solSkive(new Date(stille1)) / 2) % 360) + 360) % 360;
  return {
    længde, perihel: p, stille1, stille2,
    baglæns: max - min, døgn: (stille2 - stille1) / DØGN,
    start: p - 10 * DØGN, slut: p + 12 * DØGN,
  };
}
