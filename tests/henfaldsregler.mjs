// Henfaldsreglerne (js/data/isotoper.js) tjekket mod kendte kerner. Kører uden browser: node tests/henfaldsregler.mjs
// Henfaldsmåderne er den vigtigste (over 50 %) ifølge NUBASE/NNDC. 'beta+' dækker også elektronindfangning.
import { henfaldsmåde, stabilitet } from '../js/data/isotoper.js';
import { grundstof } from '../js/data/grundstoffer.js';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) ok++; else { dårlig++; console.log('FEJL', navn, ekstra); } };
const NR = {};
for (let z = 1; z <= 118; z++) NR[grundstof(z).symbol] = z;
const kerne = (navn) => { const [s, a] = navn.split('-'); const z = NR[s]; return [z, Number(a) - z]; };

// ---------- Kendte kerner og deres vigtigste henfaldsmåde ----------
const KENDTE = {
  'beta-': ['H-3', 'He-6', 'Li-8', 'Be-10', 'C-14', 'N-16', 'Na-24', 'P-32', 'S-35', 'Cl-36', 'Ar-39', 'K-40', 'Co-60', 'Ni-63',
    'Kr-85', 'Rb-87', 'Sr-90', 'Tc-99', 'Cd-113', 'In-115', 'I-131', 'Cs-134', 'Cs-137', 'Lu-176', 'Re-187', 'Au-198', 'Tl-204',
    'Kr-92', 'Sr-94', 'Zr-97', 'Te-137', 'Xe-140', 'Ba-141', 'Tl-207', 'Tl-208', 'Pb-210', 'Pb-211', 'Pb-212', 'Pb-214',
    'Bi-210', 'Bi-212', 'Bi-213', 'Bi-214', 'Fr-223', 'Ra-225', 'Ra-228', 'Ac-227', 'Ac-228', 'Th-231', 'Th-234', 'Pa-233',
    'Pa-234', 'U-237', 'U-239', 'Np-238', 'Np-239', 'Pu-241', 'Am-242'],
  'beta+': ['Be-7', 'B-8', 'C-11', 'N-13', 'O-15', 'F-18', 'Na-22', 'Al-26', 'Ca-41', 'V-50', 'Mn-54', 'Fe-55', 'Co-57', 'Co-58',
    'Zn-65', 'Ga-67', 'Rb-84', 'Nb-92', 'Rh-102', 'In-111', 'I-123', 'I-124', 'I-125', 'Ba-133', 'La-138', 'Eu-152', 'Tb-158',
    'Ta-180', 'Au-196', 'At-210'],
  alfa: ['Be-8', 'Sm-147', 'Bi-209', 'Bi-211', 'Po-210', 'Po-212', 'Po-214', 'Po-215', 'Po-216', 'Po-218', 'At-217', 'At-218',
    'At-219', 'Rn-219', 'Rn-220', 'Rn-222', 'Ra-223', 'Ra-224', 'Ra-226', 'Ac-225', 'Th-227', 'Th-228', 'Th-230', 'Th-232',
    'Pa-231', 'U-233', 'U-234', 'U-235', 'U-236', 'U-238', 'Np-237', 'Pu-238', 'Pu-239', 'Pu-244', 'Am-241', 'Am-243',
    'Cm-244', 'Cf-252'],
  'dobbeltbeta-': ['Ca-48', 'Ge-76', 'Se-82', 'Mo-100', 'Te-130', 'Xe-136', 'Nd-150'],
  'dobbeltbeta+': ['Kr-78', 'Xe-124', 'Ba-130'],
};
for (const [måde, liste] of Object.entries(KENDTE)) {
  for (const navn of liste) {
    const [z, n] = kerne(navn);
    const fik = henfaldsmåde(z, n);
    tjek(`${navn}: ${måde}`, fik === måde, `${navn} gav ${fik}, skulle være ${måde}`);
  }
}

// ---------- Lette kerner, der slet ikke kan hænge sammen ----------
const UBUNDNE = ['H-4', 'H-5', 'H-6', 'H-7', 'H-8', 'H-10', 'He-2', 'He-5', 'He-7', 'He-9', 'He-10', 'Li-4', 'Li-5', 'Li-10', 'Li-12',
  'Li-13', 'Be-6', 'Be-13', 'Be-15', 'Be-16', 'B-7', 'B-9', 'B-16', 'B-18', 'C-8', 'C-21', 'N-10', 'N-11', 'O-12', 'O-25', 'O-26',
  'F-14', 'F-15', 'F-16', 'F-28', 'F-30', 'Ne-16'];
for (const navn of UBUNDNE) {
  const [z, n] = kerne(navn);
  tjek(`${navn}: falder fra hinanden`, stabilitet(z, n).status === 'straks', `${navn}: ${stabilitet(z, n).status}`);
}
// … og nogle, der kan (de er radioaktive, men hænger sammen)
const BUNDNE = ['He-8', 'Li-9', 'Li-11', 'Be-11', 'Be-12', 'Be-14', 'B-12', 'B-17', 'B-19', 'C-9', 'C-15', 'C-22', 'N-12', 'N-23',
  'O-13', 'O-24', 'F-17', 'F-29', 'F-31', 'Ne-17', 'Ne-34'];
for (const navn of BUNDNE) {
  const [z, n] = kerne(navn);
  tjek(`${navn}: hænger sammen`, stabilitet(z, n).status !== 'straks', `${navn}: ${stabilitet(z, n).status}`);
}

// ---------- Alle kerner ender i en stabil kerne uden løkker ----------
const SKRIDT = {
  'beta-': [1, -1], 'beta+': [-1, 1], alfa: [-2, -2], 'dobbeltbeta-': [2, -2], 'dobbeltbeta+': [-2, 2], n: [0, -1], p: [-1, 0],
};
let kæder = 0;
for (let z = 1; z <= 118; z++) {
  for (let n = 0; n <= 180; n++) {
    let [zz, nn] = [z, n];
    const set = new Set();
    let slut = false;
    for (let i = 0; i < 200; i++) {
      const måde = henfaldsmåde(zz, nn);
      if (!måde) { slut = true; break; }
      const nøgle = `${zz},${nn}`;
      if (set.has(nøgle)) break;
      set.add(nøgle);
      const [dz, dn] = SKRIDT[måde];
      zz += dz; nn += dn;
      if (zz <= 0 || nn < 0) { slut = true; break; } // kun neutroner eller protoner tilbage
    }
    kæder++;
    tjek(`kæde fra ${z}p ${n}n ender stabilt`, slut, `stoppede ved ${zz}p ${nn}n`);
  }
}

// ---------- Uran-238 ender som bly-206 efter 8 alfa og 6 beta ----------
function kæde(navn) {
  let [z, n] = kerne(navn);
  const tæl = { alfa: 0, beta: 0 };
  const vej = [navn];
  for (let i = 0; i < 40; i++) {
    const måde = henfaldsmåde(z, n);
    if (!måde) break;
    if (måde === 'alfa') tæl.alfa++;
    else if (måde === 'beta-') tæl.beta++;
    const [dz, dn] = SKRIDT[måde];
    z += dz; n += dn;
    vej.push(`${grundstof(z).symbol}-${z + n}`);
  }
  return { ...tæl, vej, slut: vej[vej.length - 1] };
}
// Antallet af alfa og beta er givet af start og slut, så vejen gennem kæden tjekkes også (de rigtige naturlige kæder)
const RIGTIGE_KÆDER = {
  'U-238': 'U-238 Th-234 Pa-234 U-234 Th-230 Ra-226 Rn-222 Po-218 Pb-214 Bi-214 Po-214 Pb-210 Bi-210 Po-210 Pb-206',
  'U-235': 'U-235 Th-231 Pa-231 Ac-227 Th-227 Ra-223 Rn-219 Po-215 Pb-211 Bi-211 Tl-207 Pb-207',
  'Th-232': 'Th-232 Ra-228 Ac-228 Th-228 Ra-224 Rn-220 Po-216 Pb-212 Bi-212 Po-212 Pb-208',
};
for (const [start, rigtig] of Object.entries(RIGTIGE_KÆDER)) {
  const k = kæde(start);
  tjek(`${start}-kæden`, k.vej.join(' ') === rigtig, `\n  fik:     ${k.vej.join(' ')}\n  rigtigt: ${rigtig}`);
}
const u238 = kæde('U-238');
tjek('U-238 → Pb-206 (8 alfa, 6 beta)', u238.slut === 'Pb-206' && u238.alfa === 8 && u238.beta === 6, u238.vej.join(' → '));

console.log(`\nTjekket ${Object.values(KENDTE).flat().length} kendte henfald, ${UBUNDNE.length + BUNDNE.length} lette kerner og ${kæder} kæder.`);
console.log(`${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
