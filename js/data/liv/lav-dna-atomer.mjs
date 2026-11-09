// Laver js/data/liv/dna-atomer.js ud fra den målte struktur 1BNA (Drew m.fl. 1981, Protein Data Bank, CC0).
// Kør: node js/data/liv/lav-dna-atomer.mjs
//
// Hvad værktøjet gør:
// 1. Tager fire basepar fra midten af 1BNA (A–T, T–A, G–C og C–G), hver med begge nukleotider (base, sukker og fosfat).
// 2. Regner H-atomerne ud (røntgen kan ikke se dem): plane H'er på baserne, tetraedriske på sukkeret og methylgruppen.
//    Fosfatet har ingen H (som i cellen, hvor det er minusladet).
// 3. Flytter hvert par over i baseparrets eget koordinatsystem (som i 3DNA, Olson m.fl. 2001): z langs spiralens akse
//    (strengen I's retning 5'→3'), y mod streng I's C1', x mod den store fure. Så kan stigen bygges af parrene
//    med en ideel drejning og et ideelt skridt (1BNA selv er bøjet og har 9,8 basepar pr. omgang).
// 4. Finder bindingerne (afstande) og hydrogenbindingerne mellem baserne.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const her = dirname(fileURLToPath(import.meta.url));
const linjer = readFileSync(join(her, '1BNA.pdb'), 'utf8').split('\n').filter((l) => l.startsWith('ATOM'));
const rester = new Map(); // nummer → { navn, atomer: Map(navn → [x, y, z]) }
for (const l of linjer) {
  const navn = l.slice(12, 16).trim();
  const rest = l.slice(17, 20).trim();
  const nr = Number(l.slice(22, 26));
  const p = [Number(l.slice(30, 38)), Number(l.slice(38, 46)), Number(l.slice(46, 54))];
  if (!rester.has(nr)) rester.set(nr, { navn: rest, atomer: new Map() });
  rester.get(nr).atomer.set(navn, p);
}

// ---------- Små vektorregler ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const kryds = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const længde = (a) => Math.sqrt(dot(a, a));
const enhed = (a) => mul(a, 1 / længde(a));
const afstand = (a, b) => længde(sub(a, b));

// ---------- Bindingerne i ét nukleotid (navne fra PDB) ----------
const SUKKER = [['P', 'OP1'], ['P', 'OP2'], ['P', "O5'"], ["O5'", "C5'"], ["C5'", "C4'"], ["C4'", "O4'"], ["C4'", "C3'"],
  ["C3'", "O3'"], ["C3'", "C2'"], ["C2'", "C1'"], ["C1'", "O4'"]];
const BASE = {
  DA: [["C1'", 'N9'], ['N9', 'C8'], ['C8', 'N7'], ['N7', 'C5'], ['C5', 'C6'], ['C6', 'N6'], ['C6', 'N1'], ['N1', 'C2'], ['C2', 'N3'], ['N3', 'C4'], ['C4', 'C5'], ['C4', 'N9']],
  DG: [["C1'", 'N9'], ['N9', 'C8'], ['C8', 'N7'], ['N7', 'C5'], ['C5', 'C6'], ['C6', 'O6'], ['C6', 'N1'], ['N1', 'C2'], ['C2', 'N2'], ['C2', 'N3'], ['N3', 'C4'], ['C4', 'C5'], ['C4', 'N9']],
  DC: [["C1'", 'N1'], ['N1', 'C2'], ['C2', 'O2'], ['C2', 'N3'], ['N3', 'C4'], ['C4', 'N4'], ['C4', 'C5'], ['C5', 'C6'], ['C6', 'N1']],
  DT: [["C1'", 'N1'], ['N1', 'C2'], ['C2', 'O2'], ['C2', 'N3'], ['N3', 'C4'], ['C4', 'O4'], ['C4', 'C5'], ['C5', 'C7'], ['C5', 'C6'], ['C6', 'N1']],
};
// Hvor mange H hvert atom har, og hvordan de sidder: 'plan' (sp2, i basens plan), 'tetra' (sp3) eller 'methyl'
const H_REGLER = {
  fælles: { "C1'": [1, 'tetra'], "C2'": [2, 'tetra'], "C3'": [1, 'tetra'], "C4'": [1, 'tetra'], "C5'": [2, 'tetra'] },
  DA: { C8: [1, 'plan'], C2: [1, 'plan'], N6: [2, 'plan'] },
  DG: { C8: [1, 'plan'], N1: [1, 'plan'], N2: [2, 'plan'] },
  DC: { C5: [1, 'plan'], C6: [1, 'plan'], N4: [2, 'plan'] },
  DT: { C6: [1, 'plan'], N3: [1, 'plan'], C7: [3, 'methyl'] },
};
const H_LÆNGDE = { C: 1.09, N: 1.01 };
const H_NAVN = { "C1'": ["H1'"], "C2'": ["H2'", "H2''"], "C3'": ["H3'"], "C4'": ["H4'"], "C5'": ["H5'", "H5''"],
  C8: ['H8'], C2: ['H2'], N6: ['H61', 'H62'], N1: ['H1'], N2: ['H21', 'H22'], C5: ['H5'], C6: ['H6'], N4: ['H41', 'H42'],
  N3: ['H3'], C7: ['H71', 'H72', 'H73'] };
const DEL = (navn) => (['P', 'OP1', 'OP2', "O5'", "O3'"].includes(navn) ? 'fosfat' : navn.includes("'") ? 'sukker' : 'base');

// Et nukleotid med H: [{ navn, symbol, p, del }] og bindingerne som par af navne
function nukleotid(nr) {
  const r = rester.get(nr);
  const atomer = [...r.atomer].map(([navn, p]) => ({ navn, symbol: navn[0], p, del: DEL(navn) }));
  const bånd = [...SUKKER, ...BASE[r.navn]];
  const pos = (n) => r.atomer.get(n);
  const naboer = (n) => bånd.filter((b) => b.includes(n)).map((b) => (b[0] === n ? b[1] : b[0]));
  const regler = { ...H_REGLER.fælles, ...H_REGLER[r.navn] };
  for (const [navn, [antal, slags]] of Object.entries(regler)) {
    const c = pos(navn);
    const nb = naboer(navn).map(pos);
    const L = H_LÆNGDE[navn[0]];
    const retninger = [];
    if (slags === 'plan' && antal === 1) {
      // Modsat summen af retningerne til de to naboer
      retninger.push(mul(enhed(add(enhed(sub(nb[0], c)), enhed(sub(nb[1], c)))), -1));
    } else if (slags === 'plan' && antal === 2) {
      // Amino: N–H er parallelle med bindingerne fra naboatomet til dets to andre naboer (som i en bikube)
      const x = naboer(navn)[0];
      const andre = naboer(x).filter((n) => n !== navn).map(pos);
      for (const a of andre) retninger.push(enhed(sub(pos(x), a)));
    } else if (slags === 'tetra' && antal === 1) {
      retninger.push(mul(enhed(nb.map((p) => enhed(sub(p, c))).reduce(add)), -1));
    } else if (slags === 'tetra' && antal === 2) {
      const ua = enhed(sub(nb[0], c));
      const ub = enhed(sub(nb[1], c));
      const bis = mul(enhed(add(ua, ub)), -1);
      const n = enhed(kryds(ua, ub));
      const v = (54.75 * Math.PI) / 180;
      retninger.push(add(mul(bis, Math.cos(v)), mul(n, Math.sin(v))), add(mul(bis, Math.cos(v)), mul(n, -Math.sin(v))));
    } else if (slags === 'methyl') {
      const u = enhed(sub(c, nb[0])); // væk fra C5
      const ring = pos('C4');
      const v0 = enhed(sub(sub(ring, nb[0]), mul(u, dot(sub(ring, nb[0]), u)))); // vinkelret på u, i ringens plan
      const w = kryds(u, v0);
      const cosA = Math.cos((70.5 * Math.PI) / 180);
      const sinA = Math.sin((70.5 * Math.PI) / 180);
      for (let k = 0; k < 3; k++) {
        const t = (k * 2 * Math.PI) / 3 + Math.PI; // ét H peger væk fra C4
        retninger.push(add(mul(u, cosA), add(mul(v0, sinA * Math.cos(t)), mul(w, sinA * Math.sin(t)))));
      }
    }
    retninger.forEach((d, i) => {
      const hNavn = H_NAVN[navn][i];
      atomer.push({ navn: hNavn, symbol: 'H', p: add(c, mul(d, L)), del: DEL(navn) });
      bånd.push([navn, hNavn]);
    });
  }
  return { navn: r.navn, atomer, bånd };
}

// ---------- Baseparrets koordinatsystem ----------
const RING = { DA: ['N9', 'C8', 'N7', 'C5', 'C6', 'N1', 'C2', 'N3', 'C4'], DG: ['N9', 'C8', 'N7', 'C5', 'C6', 'N1', 'C2', 'N3', 'C4'],
  DC: ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'], DT: ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'] };
function normal(nr) {
  const r = rester.get(nr);
  const ps = RING[r.navn].map((n) => r.atomer.get(n));
  const m = mul(ps.reduce(add), 1 / ps.length);
  let n = [0, 0, 0];
  for (let i = 0; i < ps.length; i++) n = add(n, kryds(sub(ps[i], m), sub(ps[(i + 1) % ps.length], m)));
  return enhed(n);
}

function ramme(i, j) {
  const c1 = rester.get(i).atomer.get("C1'");
  const c2 = rester.get(j).atomer.get("C1'");
  let n1 = normal(i);
  let n2 = normal(j);
  if (dot(n1, n2) < 0) n2 = mul(n2, -1);
  let z = enhed(add(n1, n2));
  // z peger langs streng I fra 5' mod 3'
  const frem = sub(rester.get(i + 1).atomer.get("C1'"), rester.get(i - 1).atomer.get("C1'"));
  if (dot(z, frem) < 0) z = mul(z, -1);
  const yr = sub(c1, c2);
  const y = enhed(sub(yr, mul(z, dot(yr, z))));
  const x = kryds(y, z);
  // C1'-atomerne sidder ved x = −2,48 Å i 3DNA's standardbaser, så midten af stigen er 2,48 Å mod den store fure
  const o = add(mul(add(c1, c2), 0.5), mul(x, 2.48));
  return { o, x, y, z };
}

const iRamme = (f, p) => { const d = sub(p, f.o); return [dot(d, f.x), dot(d, f.y), dot(d, f.z)]; };

// Alle nukleotider i i rammen for deres eget par, vendt som streng I (streng II drejes 180° om x-aksen, baseparrets
// symmetriakse). dyade: (x, y, z) → (x, −y, −z).
const dyade = (p) => [p[0], -p[1], -p[2]];
function iStrengI(nr) {
  const i = nr <= 12 ? nr : 25 - nr;
  const f = ramme(i, 25 - i);
  const nt = nukleotid(nr);
  for (const a of nt.atomer) a.p = nr <= 12 ? iRamme(f, a.p) : dyade(iRamme(f, a.p));
  return nt;
}

// Rygraden (fosfat og sukker med H): den samme målte rygrad bruges til alle nukleotider, så kæden er jævn i den ideelle
// stige. Vi vælger den fra midten af 1BNA, hvor bindingen O3'–P til næste nukleotid bliver tættest på 1,61 Å.
const DREJ = (34.3 * Math.PI) / 180;
const SKRIDT = 3.38;
const næste = (p) => [p[0] * Math.cos(DREJ) - p[1] * Math.sin(DREJ), p[0] * Math.sin(DREJ) + p[1] * Math.cos(DREJ), p[2] + SKRIDT];
let rygrad = null;
let bedst = Infinity;
for (const nr of [4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21]) {
  const nt = iStrengI(nr);
  const a = (n) => nt.atomer.find((x) => x.navn === n).p;
  const fejl = Math.abs(afstand(a("O3'"), næste(a('P'))) - 1.61);
  if (fejl < bedst) { bedst = fejl; rygrad = { nr, nt }; }
}
const RYG = rygrad.nt.atomer.filter((a) => a.del !== 'base');
const RYG_C1 = RYG.find((a) => a.navn === "C1'").p;
console.log(`Rygraden fra rest ${rygrad.nr} (${rester.get(rygrad.nr).navn}), O3'–P til næste: ${(1.61 + bedst).toFixed(2)} eller ${(1.61 - bedst).toFixed(2)} Å`);

// Baserne fra fire par i midten af 1BNA, flyttet en lille smule, så deres C1' sidder på rygradens C1'
const PAR = { AT: [5, 20], TA: [8, 17], GC: [10, 15], CG: [9, 16] };
const ud = {};
for (const [navn, [i, j]] of Object.entries(PAR)) {
  const atomer = [];
  const båndUd = [];
  for (const [streng, nr] of [[0, i], [1, j]]) {
    const nt = iStrengI(nr);
    const egenC1 = nt.atomer.find((a) => a.navn === "C1'").p;
    const flyt = sub(RYG_C1, egenC1);
    const liste = [...RYG.map((a) => ({ ...a })), ...nt.atomer.filter((a) => a.del === 'base').map((a) => ({ ...a, p: add(a.p, flyt) }))];
    const start = atomer.length;
    const indeks = new Map(liste.map((a, k) => [a.navn, start + k]));
    for (const a of liste) atomer.push({ ...a, streng, p: streng === 0 ? a.p : dyade(a.p) });
    for (const [a, b] of nt.bånd) båndUd.push([indeks.get(a), indeks.get(b)]);
  }
  // Hydrogenbindingerne (H → atomet, der er lidt minus) og de stablede atomer
  const find = (streng, n) => atomer.findIndex((a) => a.streng === streng && a.navn === n);
  const base = (s) => rester.get(s === 0 ? i : j).navn;
  const par = [];
  const hb = (sD, d, h1, h2, sA, a) => {
    // Det af aminogruppens to H'er, der er tættest på modtageren
    const kandidater = [h1, h2].filter(Boolean).map((h) => find(sD, h));
    const mod = find(sA, a);
    const h = kandidater.sort((p, q) => afstand(atomer[p].p, atomer[mod].p) - afstand(atomer[q].p, atomer[mod].p))[0];
    par.push([h, mod]);
  };
  const [sA, sT] = base(0) === 'DA' || base(0) === 'DG' ? [0, 1] : [1, 0]; // purinen og pyrimidinen
  if (base(sA) === 'DA') {
    hb(sA, 'N6', 'H61', 'H62', sT, 'O4');
    hb(sT, 'N3', 'H3', null, sA, 'N1');
  } else {
    hb(sT, 'N4', 'H41', 'H42', sA, 'O6');
    hb(sA, 'N1', 'H1', null, sT, 'N3');
    hb(sA, 'N2', 'H21', 'H22', sT, 'O2');
  }
  ud[navn] = {
    atomer: atomer.map((a) => [a.symbol, ...a.p.map((v) => Math.round(v * 100) / 100), a.streng, a.del, a.navn]),
    bånd: båndUd,
    hbånd: par,
    // Til bindingen mellem parrene: O3' i streng I bindes til P i næste par, og P i streng II til O3' i næste par
    o3: [find(0, "O3'"), find(1, "O3'")],
    p: [find(0, 'P'), find(1, 'P')],
    c1: [find(0, "C1'"), find(1, "C1'")],
  };
}

// Tjek: atomer, H-bindingernes længder og bindingen mellem parrene i den ideelle stige
for (const [navn, d] of Object.entries(ud)) {
  const xyz = (k) => d.atomer[k].slice(1, 4);
  const h = d.atomer.filter((a) => a[0] === 'H').length;
  const hbl = d.hbånd.map(([a, b]) => afstand(xyz(a), xyz(b)).toFixed(2)).join(', ');
  const kæde = [];
  for (const andet of Object.values(ud)) {
    const p2 = (k) => næste(andet.atomer[k].slice(1, 4));
    kæde.push(afstand(xyz(d.o3[0]), p2(andet.p[0])).toFixed(2), afstand(xyz(d.p[1]), p2(andet.o3[1])).toFixed(2));
  }
  console.log(`${navn}: ${d.atomer.length} atomer (${h} H, ${d.atomer.length - h} uden H), H···modtager ${hbl} Å, O3'–P til næste par ${kæde.join(' ')} Å`);
}

const kilde = `// Atomernes pladser i fire basepar af DNA (B-form). Lavet af lav-dna-atomer.mjs ud fra den målte struktur 1BNA
// (Drew, Wing, Takano, Broka, Tanaka, Itakura og Dickerson 1981, PNAS 78:2179-2183, Protein Data Bank, data under CC0).
// H-atomerne er regnet ud (røntgen kan ikke se dem), og fosfatet har ingen H (som i cellen, hvor det er minusladet).
// Koordinaterne er i Å i baseparrets eget system: z langs spiralens akse (streng I fra 5' mod 3'), y mod streng I's C1'
// og x mod den store fure. Ret ikke i hånden: kør værktøjet igen.
// atomer: [symbol, x, y, z, streng (0 = I, 1 = II), del ('base', 'sukker' eller 'fosfat'), navn i PDB]
// bånd: par af indeks. hbånd: [H, modtager] (hydrogenbindingerne mellem baserne).
// o3 og p: [streng I, streng II] til bindingen mellem et par og det næste. c1: C1' i hver streng.
export const DNA_PAR = ${JSON.stringify(ud)};
`;
writeFileSync(join(her, 'dna-atomer.js'), kilde);
console.log('Skrev dna-atomer.js', (kilde.length / 1024).toFixed(1), 'KB');
