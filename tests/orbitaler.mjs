// Orbitalerne (js/data/orbitaler.js): formerne regnet som i hydrogen, og hvilke orbitaler et atom eller en ion har.
// Kører uden browser.
import { radialDel, middelRadius, prøver, underskaller, orbitaler, ORBITAL_NAVN } from '../js/data/orbitaler.js';
import { konfiguration } from '../js/data/grundstoffer.js';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Fast tilfældighed, så testen giver det samme hver gang
let frø = 12345;
const tilfældig = () => { frø = (frø * 1664525 + 1013904223) % 4294967296; return frø / 4294967296; };

// Radialdelen har n − l − 1 nulpunkter (knuder)
for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2], [4, 0], [4, 3], [5, 2], [7, 0]]) {
  let skift = 0;
  let før = radialDel(n, l, 1e-6);
  for (let r = 0.01; r < 3 * n * n + 14; r += 0.01) {
    const nu = radialDel(n, l, r);
    if (Math.sign(nu) !== Math.sign(før) && nu !== 0) skift++;
    før = nu;
  }
  tjek(`${n}${'spdf'[l]}: ${n - l - 1} knuder`, skift === n - l - 1, `fik ${skift}`);
}

// Middelafstanden i prøverne passer med formlen <r> = (3n² − l(l+1)) / 2 (1s: 1,5, 2p: 5, 3d: 10,5)
for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 2], [4, 3]]) {
  const p = prøver(n, l, 0, 6000, tilfældig);
  let sum = 0;
  for (let i = 0; i < 6000; i++) sum += Math.hypot(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
  const m = sum / 6000;
  tjek(`${n}${'spdf'[l]}: middelafstand ${m.toFixed(2)} ≈ ${middelRadius(n, l)}`, Math.abs(m / middelRadius(n, l) - 1) < 0.04);
}

// Formerne: p_z peger op og ned (y i Three.js), p_x til siden, d_z² mest op og ned
const middel = (p, f) => { let s = 0; for (let i = 0; i < p.length / 3; i++) s += f(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]); return s / (p.length / 3); };
const pz = prøver(2, 1, 1, 4000, tilfældig);
tjek('2p_z ligger langs aksen op og ned', middel(pz, (x, y) => Math.abs(y)) > 2 * middel(pz, (x) => Math.abs(x)));
const px = prøver(2, 1, 2, 4000, tilfældig);
tjek('2p_x ligger langs x-aksen', middel(px, (x, y) => Math.abs(x)) > 2 * middel(px, (x, y) => Math.abs(y)));
const s = prøver(1, 0, 0, 4000, tilfældig);
tjek('1s er rund', Math.abs(middel(s, (x) => x * x) / middel(s, (x, y) => y * y) - 1) < 0.15);
const dxy = prøver(3, 2, 0, 4000, tilfældig);
tjek('3d_xy ligger vandret med fire blade mellem akserne', middel(dxy, (x, y) => Math.abs(y)) < 0.6 * middel(dxy, (x) => Math.abs(x)) && middel(dxy, (x, y, z) => Math.abs(x * z)) > 1.5 * middel(dxy, (x, y) => Math.abs(x * y)));
tjek('navnene passer med antallet af orbitaler', ORBITAL_NAVN.every((liste, l) => liste.length === 2 * l + 1));

// Hvilke orbitaler: neutrale atomer følger konfigurationen, og elektronerne går op
const sum = (k) => Object.values(k).reduce((a, b) => a + b, 0);
let alleNeutrale = true;
let alleIoner = true;
for (let z = 1; z <= 118; z++) {
  if (JSON.stringify(underskaller(z, z)) !== JSON.stringify(konfiguration(z))) alleNeutrale = false;
  for (const e of [0, 1, z - 2, z - 1, z + 1, z + 2]) {
    if (e < 0) continue;
    const o = orbitaler(z, e);
    const ialt = o.reduce((a, b) => a + b.elektroner, 0);
    const forventet = Math.min(e, 118); // som skallerne
    if (ialt !== forventet || sum(underskaller(z, e)) !== forventet || o.some((x) => x.elektroner < 1 || x.elektroner > 2)) alleIoner = false;
  }
}
tjek('neutrale atomer: samme underskaller som konfigurationen (1-118)', alleNeutrale);
tjek('ioner: antallet af elektroner går op (højst 118), og højst 2 i hver orbital', alleIoner);
const vis = (k) => Object.entries(k).map(([n, a]) => n + a).join(' ');
tjek('carbon: 1s² 2s² 2p² med to halvfyldte p-orbitaler (Hunds regel)', vis(underskaller(6, 6)) === '1s2 2s2 2p2' && orbitaler(6, 6).filter((o) => o.l === 1).map((o) => o.elektroner).join() === '1,1');
tjek('neon: 5 fyldte orbitaler', orbitaler(10, 10).length === 5 && orbitaler(10, 10).every((o) => o.elektroner === 2));
tjek('Na⁺ har neons orbitaler', vis(underskaller(11, 10)) === '1s2 2s2 2p6');
tjek('Cl⁻ har en fyldt 3p', underskaller(17, 18)['3p'] === 6);
tjek('Fe²⁺ mister 4s før 3d', vis(underskaller(26, 24)).endsWith('3d6') && !('4s' in underskaller(26, 24)), vis(underskaller(26, 24)));
tjek('chrom: 4s¹ 3d⁵ (undtagelse)', underskaller(24, 24)['4s'] === 1 && underskaller(24, 24)['3d'] === 5);
tjek('H⁻: 1s²', vis(underskaller(1, 2)) === '1s2');

console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
