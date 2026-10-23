// Orbitaler: hvor en elektron sandsynligvis er. Formerne er regnet som i et hydrogenatom (bølgefunktionen ψ_nlm),
// og for større atomer er de en tilnærmelse. Bruges til elektronskyen i Atomværkstedet.
// Afstande er i Bohr-radier (hydrogenatomets størrelse, ca. 0,053 nm).

import { konfiguration, FYLDE_RÆKKEFØLGE } from './grundstoffer.js';

export const L_NAVN = ['s', 'p', 'd', 'f'];

// Navnene på de enkelte orbitaler (m = -l … l), i samme rækkefølge som VINKEL
export const ORBITAL_NAVN = [
  ['s'],
  ['p_y', 'p_z', 'p_x'],
  ['d_xy', 'd_yz', 'd_z²', 'd_xz', 'd_x²−y²'],
  ['f_y(3x²−y²)', 'f_xyz', 'f_yz²', 'f_z³', 'f_xz²', 'f_z(x²−y²)', 'f_x(x²−3y²)'],
];

// Vinkeldelen: de reelle kuglefunktioner uden normering (x, y, z er en retning med længden 1)
const VINKEL = [
  [() => 1],
  [(x, y) => y, (x, y, z) => z, (x) => x],
  [(x, y) => x * y, (x, y, z) => y * z, (x, y, z) => 3 * z * z - 1, (x, y, z) => x * z, (x, y) => x * x - y * y],
  [
    (x, y) => y * (3 * x * x - y * y),
    (x, y, z) => x * y * z,
    (x, y, z) => y * (5 * z * z - 1),
    (x, y, z) => z * (5 * z * z - 3),
    (x, y, z) => x * (5 * z * z - 1),
    (x, y, z) => z * (x * x - y * y),
    (x, y) => x * (x * x - 3 * y * y),
  ],
];

// Vinkeldelen for orbital (l, mi) i retningen (x, y, z), hvor z er orbitalens akse, og dens største værdi.
// Bruges til at tegne orbitalernes form som en overflade (som i fysikbøgerne).
export function vinkel(l, mi, x, y, z) {
  return VINKEL[l][mi](x, y, z);
}
export function størsteVinkel(l, mi) {
  return Math.sqrt(maxVinkel(l, mi, Math.random));
}

// Middelafstanden <r> fra kernen for en elektron i (n, l) i hydrogen
export function middelRadius(n, l) {
  return (3 * n * n - l * (l + 1)) / 2;
}

// Radialdelen R_nl(r) uden normering: ρ^l · e^(−ρ/2) · L(ρ), hvor ρ = 2r/n, og L er et Laguerre-polynomium
export function radialDel(n, l, r) {
  const ρ = (2 * r) / n;
  const k = n - l - 1;
  const α = 2 * l + 1;
  let forrige = 1;
  let nu = 1 + α - ρ;
  if (k === 0) nu = 1;
  for (let i = 1; i < k; i++) {
    const næste = ((2 * i + 1 + α - ρ) * nu - (i + α) * forrige) / (i + 1);
    forrige = nu;
    nu = næste;
  }
  return ρ ** l * Math.exp(-ρ / 2) * nu;
}

// Fordelingen af afstande (r² · R²) som en tabel, så man kan trække en tilfældig afstand
const radialTabeller = new Map();
function radialTabel(n, l) {
  const nøgle = `${n}${l}`;
  if (radialTabeller.has(nøgle)) return radialTabeller.get(nøgle);
  const trin = 1500;
  const rMax = 3 * n * n + 14;
  const r = new Float64Array(trin + 1);
  const sum = new Float64Array(trin + 1);
  for (let i = 1; i <= trin; i++) {
    r[i] = (rMax * i) / trin;
    const R = radialDel(n, l, r[i]);
    sum[i] = sum[i - 1] + r[i] * r[i] * R * R;
  }
  for (let i = 0; i <= trin; i++) sum[i] /= sum[trin];
  const tabel = { r, sum };
  radialTabeller.set(nøgle, tabel);
  return tabel;
}

// Afstanden, som en del q (0-1) af elektronens sandsynlighed ligger inden for (fx q = 0,85)
export function kvantilRadius(n, l, q) {
  return trækAfstand(radialTabel(n, l), q);
}

function trækAfstand(tabel, u) {
  const { r, sum } = tabel;
  let lav = 0;
  let høj = sum.length - 1;
  while (høj - lav > 1) {
    const midt = (lav + høj) >> 1;
    if (sum[midt] < u) lav = midt;
    else høj = midt;
  }
  const t = sum[høj] > sum[lav] ? (u - sum[lav]) / (sum[høj] - sum[lav]) : 0;
  return r[lav] + t * (r[høj] - r[lav]);
}

// Den største værdi af vinkeldelen i anden potens (fundet ved at prøve mange retninger)
const vinkelMax = new Map();
function maxVinkel(l, mi, tilfældig) {
  const nøgle = `${l}${mi}`;
  if (vinkelMax.has(nøgle)) return vinkelMax.get(nøgle);
  const f = VINKEL[l][mi];
  let max = 0;
  const v = [0, 0, 0];
  for (let i = 0; i < 6000; i++) {
    retning(v, tilfældig);
    max = Math.max(max, f(v[0], v[1], v[2]) ** 2);
  }
  max *= 1.05;
  vinkelMax.set(nøgle, max);
  return max;
}

// En tilfældig retning (ens fordelt på en kugle)
function retning(v, tilfældig) {
  const z = 2 * tilfældig() - 1;
  const φ = 2 * Math.PI * tilfældig();
  const s = Math.sqrt(1 - z * z);
  v[0] = s * Math.cos(φ);
  v[1] = s * Math.sin(φ);
  v[2] = z;
}

// Trækker tilfældige steder, hvor elektronen kan være, med sandsynligheden |ψ|² (i Bohr-radier).
// mi er nummeret på orbitalen (0 … 2l), som i ORBITAL_NAVN. hale < 1 skærer de yderste steder fra
// (fx 0,96: de 4 % længst ude kommer ikke med), så skyen ikke fylder hele billedet.
export function prøver(n, l, mi, antal, tilfældig = Math.random, hale = 1) {
  const ud = new Float32Array(antal * 3);
  const tabel = radialTabel(n, l);
  const f = VINKEL[l][mi];
  const max = maxVinkel(l, mi, tilfældig);
  const v = [0, 0, 0];
  for (let i = 0; i < antal; i++) {
    do retning(v, tilfældig); while (f(v[0], v[1], v[2]) ** 2 < tilfældig() * max);
    const r = trækAfstand(tabel, tilfældig() * hale);
    // I Three.js peger y opad. Orbitalens z-akse (fx p_z og d_z²) skal pege opad.
    ud[i * 3] = v[0] * r;
    ud[i * 3 + 1] = v[2] * r;
    ud[i * 3 + 2] = v[1] * r;
  }
  return ud;
}

// Underskallerne for et atom eller en ion: { '1s': 2, '2s': 2, '2p': 4, ... }
// Neutralt atom: den rigtige konfiguration (med de kendte undtagelser). Færre elektroner: De yderste (højeste n,
// og så højeste l) fjernes først, ligesom fx jern mister 4s før 3d. Flere elektroner: De næste pladser fyldes.
// Højst 118 elektroner, ligesom skallerne (skallerForIon).
export function underskaller(protoner, elektroner) {
  elektroner = Math.min(elektroner, 118);
  if (elektroner <= 0) return {};
  const k = protoner > 0 ? { ...konfiguration(protoner) } : {};
  let forskel = elektroner - Math.max(protoner, 0);
  const nl = (navn) => [parseInt(navn), L_NAVN.indexOf(navn.slice(-1))];
  while (forskel < 0) {
    const yderst = Object.keys(k).sort((a, b) => {
      const [na, la] = nl(a);
      const [nb, lb] = nl(b);
      return nb - na || lb - la;
    })[0];
    if (!yderst) break;
    k[yderst] -= 1;
    if (!k[yderst]) delete k[yderst];
    forskel += 1;
  }
  for (const [n, l] of FYLDE_RÆKKEFØLGE) {
    if (forskel <= 0) break;
    const navn = `${n}${L_NAVN[l]}`;
    const plads = 2 * (2 * l + 1) - (k[navn] || 0);
    const læg = Math.min(plads, forskel);
    if (læg > 0) k[navn] = (k[navn] || 0) + læg;
    forskel -= læg;
  }
  return k;
}

// De enkelte orbitaler med elektroner: [{ n, l, mi, navn, elektroner }].
// Elektronerne fordeles efter Hunds regel: først én i hver orbital, så to.
export function orbitaler(protoner, elektroner) {
  const ud = [];
  for (const [navn, antal] of Object.entries(underskaller(protoner, elektroner))) {
    const n = parseInt(navn);
    const l = L_NAVN.indexOf(navn.slice(-1));
    const pladser = 2 * l + 1;
    for (let mi = 0; mi < pladser; mi++) {
      const e = (antal > mi ? 1 : 0) + (antal > pladser + mi ? 1 : 0);
      if (e) ud.push({ n, l, mi, navn: `${n}${ORBITAL_NAVN[l][mi]}`, elektroner: e });
    }
  }
  return ud;
}
