// DNA-stigen som tal (uden Three.js, så den kan testes i Node): atomernes pladser for en hel stige, bygget af de målte
// basepar i dna-atomer.js med en ideel drejning og et ideelt skridt for hvert trin (B-DNA i vand).
// Koordinaterne er i Å. Spiralens akse er z, og stigen er centreret om z = 0.

import { DNA_PAR } from './dna-atomer.js';

export const SKRIDT = 3.38; // Å pr. basepar (ca. 0,34 nm, OpenStax 14-2)
export const DREJ = 34.3; // grader pr. basepar, så der er ca. 10,5 basepar pr. omgang (Wang 1979: 10,4-10,5 i vand)
export const PAR_PR_OMGANG = 360 / DREJ;
export const PARTNER = { A: 'T', T: 'A', G: 'C', C: 'G' };
export const STOR = { A: true, G: true, C: false, T: false }; // puriner (to ringe) og pyrimidiner (én ring)

// Flytter et punkt i baseparrets system op til trin k (drejet k · DREJ om z og løftet k · SKRIDT)
function iTrin(p, k, z0) {
  const v = (k * DREJ * Math.PI) / 180;
  const c = Math.cos(v);
  const s = Math.sin(v);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2] + k * SKRIDT - z0];
}

// En hel stige ud fra den ene streng (fx 'ATGCGT'). Streng II er partnerne.
// Giver { atomer: [{ symbol, p, streng, del, navn, trin }], bånd: [[a, b]], hbånd: [[h, modtager, trin]], ryg: [[...], [...]],
//   trin: [{ base, partner, c1: [p I, p II], midt }] }. ryg er punkterne langs hver streng (fosfat og sukker skiftevis),
// til båndene, man ser længere væk fra.
export function lavStige(sekvens) {
  const n = sekvens.length;
  const z0 = ((n - 1) * SKRIDT) / 2;
  const atomer = [];
  const bånd = [];
  const hbånd = [];
  const trin = [];
  const ryg = [[], []];
  let forrige = null;
  for (let k = 0; k < n; k++) {
    const base = sekvens[k];
    const par = DNA_PAR[base + PARTNER[base]];
    const start = atomer.length;
    for (const [symbol, x, y, z, streng, del, navn] of par.atomer) {
      atomer.push({ symbol, p: iTrin([x, y, z], k, z0), streng, del, navn, trin: k });
    }
    for (const [a, b] of par.bånd) bånd.push([start + a, start + b]);
    for (const [h, m] of par.hbånd) hbånd.push([start + h, start + m, k]);
    // Kæden: O3' i streng I til P i næste trin, og P i streng II til O3' i næste trin (streng II løber den anden vej)
    if (forrige) {
      bånd.push([forrige.start + forrige.par.o3[0], start + par.p[0]]);
      bånd.push([forrige.start + forrige.par.p[1], start + par.o3[1]]);
    }
    forrige = { start, par };
    const c1 = par.c1.map((i) => atomer[start + i].p);
    trin.push({ base, partner: PARTNER[base], c1, midt: iTrin([0, 0, 0], k, z0) });
    // Rygraden: fosfatet og sukkerringens midte skiftevis
    for (const s of [0, 1]) {
      const egne = atomer.slice(start).filter((a) => a.streng === s);
      const fosfor = egne.find((a) => a.navn === 'P').p;
      const ring = egne.filter((a) => ["C1'", "C2'", "C3'", "C4'", "O4'"].includes(a.navn));
      const m = [0, 1, 2].map((i) => ring.reduce((sum, a) => sum + a.p[i], 0) / ring.length);
      // Streng I: P kommer før sukkeret (5' → 3' opad). Streng II løber nedad, så dér ligger P over sukkeret.
      ryg[s].push(s === 0 ? fosfor : m, s === 0 ? m : fosfor);
      trin[k][s === 0 ? 'sukkerI' : 'sukkerII'] = m;
    }
  }
  return { atomer, bånd, hbånd, trin, ryg };
}

// Mål på stigen (til tests og panelet): basepar pr. omgang, skridt pr. trin og diameteren (de yderste atomer)
export function målStige(stige) {
  let r = 0;
  for (const a of stige.atomer) r = Math.max(r, Math.hypot(a.p[0], a.p[1]));
  const c = stige.trin.map((t) => t.c1[0]);
  const vinkel = Math.atan2(c[1][1], c[1][0]) - Math.atan2(c[0][1], c[0][0]);
  const grader = ((((vinkel * 180) / Math.PI) % 360) + 360) % 360;
  return { parPrOmgang: 360 / grader, skridt: c[1][2] - c[0][2], diameter: 2 * r };
}

// Passer de to baser sammen? Kun A–T og G–C (de andre er for brede, for smalle, eller plus og minus står forkert)
export function passer(a, b) {
  return PARTNER[a] === b;
}
