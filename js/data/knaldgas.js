// Knaldgas (Molekyler M3, docs/plan-molekyler.md afsnit 4): 4 H₂ og 2 O₂ i en lukket boks. Uden Three.js, så det kan testes i Node.
// Molekylerne er kugler, der støder sammen. Uden gnist hopper de bare væk fra hinanden. Gnisten river ét H₂ over, og så
// laver de frie atomer og OH (radikaler) en kæde, der ender med 4 H₂O. Energien er bevaret: fart + indre rysten − bindinger.
// Tallene står med kilder i docs/fakta-molekyler/m3.md (NIST og OpenStax).

// ---------- Bindingerne (kJ/mol fra NIST, regnet om til eV pr. binding) ----------
export const KJ_PR_EV = 96.485; // 1 eV pr. molekyle = 96,485 kJ/mol
export const BINDING_KJ = {
  HH: 436.0, // H–H (2 · 218,00)
  OO: 498.4, // O=O (2 · 249,18)
  OH: 428.2, // O–H i OH-radikalet (249,18 + 218,00 − 38,99)
  HOH: 498.8, // det første H af vand: H₂O → OH + H (38,99 + 218,00 + 241,83)
};
export const BINDING = Object.fromEntries(Object.entries(BINDING_KJ).map(([k, v]) => [k, v / KJ_PR_EV]));

// ---------- Stofferne ----------
// m: masse i u. r: kuglens radius i 3D-enheder (S = 3 enheder pr. Å). bindinger: de bindinger, stoffet har.
// radikal: antal elektroner uden partner (O₂ tegnes som i lærebøgerne, med alle i par, se "Ærligt talt").
// atomer: [symbol, x, y, z] i Å om tyngdepunktet. bånd: [a, b, orden]. retninger: [atom, x, y, z, 'frit' | 'enlig'].
const S = 3;
const VAND_VINKEL = (104.5 * Math.PI) / 180;
const t3 = 1 / 3;
const t8 = Math.sqrt(8) / 3;
function tyngde(atomer) {
  const m = (s) => (s === 'H' ? 1.008 : 15.999);
  let M = 0;
  const c = [0, 0, 0];
  for (const [s, x, y, z] of atomer) { M += m(s); c[0] += m(s) * x; c[1] += m(s) * y; c[2] += m(s) * z; }
  return atomer.map(([s, x, y, z]) => [s, x - c[0] / M, y - c[1] / M, z - c[2] / M]);
}
const hx = Math.cos(VAND_VINKEL / 2) * 0.958;
const hy = Math.sin(VAND_VINKEL / 2) * 0.958;
export const STOFFER = {
  H2: { navn: 'H₂', m: 2.016, r: 1.55, bindinger: ['HH'], radikal: 0,
    atomer: tyngde([['H', -0.371, 0, 0], ['H', 0.371, 0, 0]]), bånd: [[0, 1, 1]], retninger: [] },
  O2: { navn: 'O₂', m: 31.998, r: 2.15, bindinger: ['OO'], radikal: 0,
    atomer: tyngde([['O', -0.604, 0, 0], ['O', 0.604, 0, 0]]), bånd: [[0, 1, 2]],
    retninger: [[0, -0.5, 0.866, 0, 'frit'], [0, -0.5, -0.866, 0, 'frit'], [1, 0.5, 0.866, 0, 'frit'], [1, 0.5, -0.866, 0, 'frit']] },
  H: { navn: 'H', m: 1.008, r: 1.0, bindinger: [], radikal: 1,
    atomer: [['H', 0, 0, 0]], bånd: [], retninger: [[0, 0, 1, 0, 'enlig']] },
  O: { navn: 'O', m: 15.999, r: 1.25, bindinger: [], radikal: 2,
    atomer: [['O', 0, 0, 0]], bånd: [],
    retninger: [[0, 1, 0, 0, 'frit'], [0, -t3, t8, 0, 'frit'], [0, -t3, -t8 / 2, 0.8165, 'enlig'], [0, -t3, -t8 / 2, -0.8165, 'enlig']] },
  OH: { navn: 'OH', m: 17.007, r: 1.6, bindinger: ['OH'], radikal: 1,
    atomer: tyngde([['O', 0, 0, 0], ['H', 0.970, 0, 0]]), bånd: [[1, 0, 1]],
    retninger: [[0, -t3, t8, 0, 'frit'], [0, -t3, -t8 / 2, 0.8165, 'frit'], [0, -t3, -t8 / 2, -0.8165, 'enlig']] },
  H2O: { navn: 'H₂O', m: 18.015, r: 1.75, bindinger: ['HOH', 'OH'], radikal: 0,
    atomer: tyngde([['O', 0, 0, 0], ['H', hx, hy, 0], ['H', hx, -hy, 0]]), bånd: [[1, 0, 1], [2, 0, 1]],
    retninger: [[0, -0.58, 0, 0.815, 'frit'], [0, -0.58, 0, -0.815, 'frit']] },
};
for (const s of Object.values(STOFFER)) {
  s.atomer = s.atomer.map(([sym, x, y, z]) => [sym, x * S, y * S, z * S]);
  s.energi = -s.bindinger.reduce((sum, b) => sum + BINDING[b], 0); // eV: bindingerne holder på energien (minus)
}

// ---------- Reaktionerne (kæden, forenklet) ----------
// Et stød mellem a og b bliver til produkterne, hvis stødet (farten ind mod hinanden) har mindst bakke eV.
// Bakkerne (aktiveringsenergien) er valgt tæt på de målte (fra min viden, se m3.md afsnit 4): H + O₂ ca. 0,75 eV,
// O + H₂ ca. 0,4 og OH + H₂ ca. 0,2. Radikaler, der mødes, har ingen bakke. To molekyler (H₂, O₂, H₂O) reagerer ikke.
// brudt og dannet: de bindinger, der brydes og laves (til måleren).
export const REAKTIONER = [
  { a: 'H', b: 'O2', til: ['OH', 'O'], bakke: 0.75, brudt: ['OO'], dannet: ['OH'], navn: 'H + O₂ → OH + O' },
  { a: 'O', b: 'H2', til: ['OH', 'H'], bakke: 0.4, brudt: ['HH'], dannet: ['OH'], navn: 'O + H₂ → OH + H' },
  { a: 'OH', b: 'H2', til: ['H2O', 'H'], bakke: 0.2, brudt: ['HH'], dannet: ['HOH'], navn: 'OH + H₂ → H₂O + H' },
  { a: 'OH', b: 'OH', til: ['H2O', 'O'], bakke: 0, brudt: ['OH'], dannet: ['HOH'], navn: 'OH + OH → H₂O + O' },
  { a: 'H', b: 'OH', til: ['H2O'], bakke: 0, brudt: [], dannet: ['HOH'], navn: 'H + OH → H₂O' },
  { a: 'H', b: 'O', til: ['OH'], bakke: 0, brudt: [], dannet: ['OH'], navn: 'H + O → OH' },
];
export function findReaktion(a, b) {
  return REAKTIONER.find((r) => (r.a === a && r.b === b) || (r.a === b && r.b === a)) ?? null;
}
// Hvad reaktionen koster (+) eller giver (−) i eV
export function reaktionsEnergi(r) {
  return r.brudt.reduce((s, b) => s + BINDING[b], 0) - r.dannet.reduce((s, b) => s + BINDING[b], 0);
}

// ---------- Boksen ----------
export const BOKS = 7; // halv sidelængde i enheder (boksen går fra −7 til 7)
export const K = 2e-4; // eV pr. u · (enheder/s)², ganget med ½: H₂ ved stuetemperatur flyver ca. 14 enheder pr. sekund
export const STUE = 0.0385; // eV: farten i gennemsnit ved 25 °C (3/2 · k · T)
export const GNIST_FART = 1.5; // eV fart til hvert af de to H-atomer fra gnisten (gnisten er en lille, meget varm sky)
export const MAX_SKRIDT = 0.004; // sekunder: højst så langt et skridt (de hurtigste H-atomer flyver ca. 0,3 enheder)
export const BLANDING = [['H2', 4], ['O2', 2]];

// Et lille tilfældighedsværktøj, der kan sås (så testene kan gentages)
export function lavTilfældig(frø = 1) {
  let s = frø >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
function gauss(tilf) {
  const u = Math.max(1e-12, tilf());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * tilf());
}
function enhedsvektor(tilf) {
  const z = 2 * tilf() - 1;
  const f = 2 * Math.PI * tilf();
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(f), r * Math.sin(f), z];
}

const kin = (p) => 0.5 * K * STOFFER[p.art].m * (p.v[0] ** 2 + p.v[1] ** 2 + p.v[2] ** 2);

// Lav en ny boks. tilf: tilfældighed (lavTilfældig). Molekylerne får farten fra stuetemperatur og en tilfældig retning.
export function lavBoks(tilf = Math.random) {
  const b = { partikler: [], tilf, tid: 0, gnist: 0, tændt: false, stød: 0, hårdeste: 0, brudt: 0, dannet: 0,
    reaktioner: 0, næsteId: 0, hændelser: [], energiStart: 0, færdig: false, sidste: null };
  const pladser = [];
  for (const [art, n] of BLANDING) for (let i = 0; i < n; i++) pladser.push(art);
  // Pladserne: et gitter, så ingen starter oven i hinanden
  const gitter = [];
  for (const x of [-3.6, 3.6]) for (const y of [-4.2, 0, 4.2]) for (const z of [-3, 3]) gitter.push([x, y, z]);
  for (let i = gitter.length - 1; i > 0; i--) {
    const j = Math.floor(tilf() * (i + 1));
    [gitter[i], gitter[j]] = [gitter[j], gitter[i]];
  }
  pladser.forEach((art, i) => {
    const m = STOFFER[art].m;
    const σ = Math.sqrt(STUE / 1.5 / (K * m)); // hver retning: ½·K·m·σ² = kT/2
    const p = nyPartikel(b, art, [...gitter[i]], [σ * gauss(tilf), σ * gauss(tilf), σ * gauss(tilf)]);
    b.partikler.push(p);
  });
  b.energiStart = energi(b);
  return b;
}

function nyPartikel(b, art, p, v, indre = 0) {
  const tilf = b.tilf;
  return { id: b.næsteId++, art, p, v, indre, akse: enhedsvektor(tilf), vinkel: tilf() * Math.PI * 2, drej: 1 + tilf() * 2 };
}

// Hele energien i eV: fart + indre rysten + bindingerne (minus). Gnisten lægger energi til.
export function energi(b) {
  let e = 0;
  for (const p of b.partikler) e += kin(p) + p.indre + STOFFER[p.art].energi;
  return e;
}
export function fartEnergi(b) {
  let e = 0;
  for (const p of b.partikler) e += kin(p) + p.indre;
  return e;
}
export function tæl(b) {
  const t = { H2: 0, O2: 0, H: 0, O: 0, OH: 0, H2O: 0 };
  for (const p of b.partikler) t[p.art]++;
  return t;
}
export function radikaler(b) {
  return b.partikler.filter((p) => STOFFER[p.art].radikal > 0).length;
}
// Atomerne i boksen (tælles i testene: der er altid 8 H og 4 O)
export function atomTal(b) {
  const t = { H: 0, O: 0 };
  for (const p of b.partikler) for (const [s] of STOFFER[p.art].atomer) t[s]++;
  return t;
}

// Gnisten: river det H₂ over, der er nærmest hjørnet (punkt), og giver de to H-atomer fart. Giver gnistens energi (eV).
export function gnist(b, punkt = [-BOKS, -BOKS, -BOKS]) {
  if (b.færdig) return 0;
  const h2 = b.partikler.filter((p) => p.art === 'H2');
  if (!h2.length) return 0;
  const afst = (p) => Math.hypot(p.p[0] - punkt[0], p.p[1] - punkt[1], p.p[2] - punkt[2]);
  h2.sort((x, y) => afst(x) - afst(y));
  const p = h2[0];
  const før = energi(b);
  const fart = Math.sqrt((2 * GNIST_FART) / (K * STOFFER.H.m));
  const d = 0.5 * STOFFER.H.r + 0.1;
  // De to H-atomer skyder ud mod hvert sit O₂ (gnisten er en lille, varm sky, så retningen er fri her)
  const o2 = b.partikler.filter((x) => x.art === 'O2');
  const mod = (x) => {
    if (!x) return enhedsvektor(b.tilf);
    const v = x.p.map((w, q) => w - p.p[q]);
    const l = Math.hypot(...v) || 1;
    return v.map((w) => w / l);
  };
  const ua = mod(o2[0]);
  const uc = o2[1] ? mod(o2[1]) : ua.map((w) => -w);
  const ny = (u) => nyPartikel(b, 'H', p.p.map((w, q) => w + u[q] * d), u.map((w) => w * fart));
  const a = ny(ua);
  const c = ny(uc);
  b.partikler.splice(b.partikler.indexOf(p), 1, a, c);
  b.brudt += BINDING.HH;
  const tilført = energi(b) - før;
  b.gnist += tilført;
  b.tændt = true;
  b.hændelser.push({ slags: 'gnist', p: [...p.p], tid: b.tid });
  return tilført;
}

// Må reaktionen ske? Kæden må ikke dø, før alt er vand (ellers ville der være H₂ og O₂ tilbage uden radikaler).
// I virkeligheden holder varmen ilden i gang. Her er det en regel.
function måSke(b, r, pa, pb) {
  const efter = radikaler(b) - (STOFFER[pa.art].radikal > 0) - (STOFFER[pb.art].radikal > 0) + r.til.filter((x) => STOFFER[x].radikal > 0).length;
  if (efter > 0) return true;
  const t = tæl(b);
  for (const x of [pa.art, pb.art]) t[x]--;
  for (const x of r.til) t[x]++;
  return t.H2 === 0 && t.O2 === 0;
}

function holdIBoks(p) {
  const r = STOFFER[p.art].r;
  for (let q = 0; q < 3; q++) p.p[q] = Math.max(-BOKS + r, Math.min(BOKS - r, p.p[q]));
}

// Et stød mellem pa og pb (de rører hinanden og nærmer sig). n: enhedsvektor fra pb mod pa.
function stød(b, pa, pb, n) {
  const ma = STOFFER[pa.art].m;
  const mb = STOFFER[pb.art].m;
  const M = ma + mb;
  const μ = (ma * mb) / M;
  const vr = [pa.v[0] - pb.v[0], pa.v[1] - pb.v[1], pa.v[2] - pb.v[2]];
  const vn = vr[0] * n[0] + vr[1] * n[1] + vr[2] * n[2]; // under 0: de nærmer sig
  const vc = [(ma * pa.v[0] + mb * pb.v[0]) / M, (ma * pa.v[1] + mb * pb.v[1]) / M, (ma * pa.v[2] + mb * pb.v[2]) / M];
  const hård = 0.5 * K * μ * vn * vn; // stødets styrke (farten ind mod hinanden), eV
  const relativ = 0.5 * K * μ * (vr[0] ** 2 + vr[1] ** 2 + vr[2] ** 2);
  const r = findReaktion(pa.art, pb.art);
  if (!b.tændt && !r) {
    b.stød++;
    b.hårdeste = Math.max(b.hårdeste, hård);
  }
  if (r && hård >= r.bakke && måSke(b, r, pa, pb)) {
    reager(b, r, pa, pb, vc, relativ);
    return;
  }
  // Elastisk stød. En indre rysten (fra en ny binding) bliver til fart nu.
  const ekstra = pa.indre + pb.indre;
  pa.indre = 0;
  pb.indre = 0;
  const vn2 = Math.sqrt(vn * vn + (2 * ekstra) / (K * μ));
  const nyVr = [vr[0] + (vn2 - vn) * n[0], vr[1] + (vn2 - vn) * n[1], vr[2] + (vn2 - vn) * n[2]];
  for (let q = 0; q < 3; q++) {
    pa.v[q] = vc[q] + (mb / M) * nyVr[q];
    pb.v[q] = vc[q] - (ma / M) * nyVr[q];
  }
}

function reager(b, r, pa, pb, vc, relativ) {
  const før = pa.indre + pb.indre + relativ; // energien, der er til rådighed i tyngdepunktets system
  const tilbage = før - reaktionsEnergi(r); // det, der er tilbage til fart og rysten
  const ma = STOFFER[pa.art].m;
  const mb = STOFFER[pb.art].m;
  const M = ma + mb;
  const c = [(ma * pa.p[0] + mb * pb.p[0]) / M, (ma * pa.p[1] + mb * pb.p[1]) / M, (ma * pa.p[2] + mb * pb.p[2]) / M];
  const nye = [];
  if (r.til.length === 1) {
    // To bliver til én: farten kan ikke tage hele energien (bevægelsesmængden skal passe), så resten bliver til rysten
    nye.push(nyPartikel(b, r.til[0], c, [...vc], tilbage));
  } else {
    const [x, y] = r.til;
    const mx = STOFFER[x].m;
    const my = STOFFER[y].m;
    const μ = (mx * my) / M;
    const u = enhedsvektor(b.tilf);
    const fart = Math.sqrt((2 * Math.max(0, tilbage)) / (K * μ));
    const sep = STOFFER[x].r + STOFFER[y].r + 0.05;
    nye.push(nyPartikel(b, x, c.map((v, q) => v + u[q] * sep * (my / M)), vc.map((v, q) => v + u[q] * fart * (my / M))));
    nye.push(nyPartikel(b, y, c.map((v, q) => v - u[q] * sep * (mx / M)), vc.map((v, q) => v - u[q] * fart * (mx / M))));
  }
  for (const p of nye) holdIBoks(p);
  const i = b.partikler.indexOf(pa);
  b.partikler.splice(i, 1, ...nye);
  b.partikler.splice(b.partikler.indexOf(pb), 1);
  b.brudt += r.brudt.reduce((s, x) => s + BINDING[x], 0);
  b.dannet += r.dannet.reduce((s, x) => s + BINDING[x], 0);
  b.reaktioner++;
  b.sidste = r.navn;
  b.hændelser.push({ slags: 'reaktion', navn: r.navn, p: c, tid: b.tid, energi: -reaktionsEnergi(r) });
  if (tæl(b).H2O === 4) b.færdig = true;
}

// Et skridt frem i tiden (sekunder). Deles i små skridt, så hurtige atomer ikke flyver igennem hinanden.
export function skridt(b, dt) {
  let fart = 0;
  for (const p of b.partikler) fart = Math.max(fart, Math.hypot(...p.v));
  const n = Math.max(1, Math.ceil(dt / MAX_SKRIDT), Math.ceil((fart * dt) / 0.3));
  const h = dt / n;
  for (let k = 0; k < n; k++) lilleSkridt(b, h);
}

function lilleSkridt(b, h) {
  b.tid += h;
  const ps = b.partikler;
  for (const p of ps) {
    const r = STOFFER[p.art].r;
    for (let q = 0; q < 3; q++) {
      p.p[q] += p.v[q] * h;
      // Væggen: hopper tilbage. En indre rysten bliver til fart her (væggen tager kun imod stødet).
      if ((p.p[q] > BOKS - r && p.v[q] > 0) || (p.p[q] < -BOKS + r && p.v[q] < 0)) {
        p.v[q] = -p.v[q];
        if (p.indre > 0) {
          const e = kin(p);
          const f = Math.sqrt((e + p.indre) / Math.max(e, 1e-12));
          for (let w = 0; w < 3; w++) p.v[w] *= f;
          p.indre = 0;
        }
      }
    }
    p.vinkel += p.drej * h * (0.6 + Math.min(4, Math.sqrt(kin(p) / STUE) * 0.5));
  }
  // Stød mellem to (kun når de nærmer sig hinanden)
  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i];
      const c = ps[j];
      const d = [a.p[0] - c.p[0], a.p[1] - c.p[1], a.p[2] - c.p[2]];
      const l = Math.hypot(...d);
      const rr = STOFFER[a.art].r + STOFFER[c.art].r;
      if (l >= rr || l < 1e-9) continue;
      const n = d.map((x) => x / l);
      const vn = (a.v[0] - c.v[0]) * n[0] + (a.v[1] - c.v[1]) * n[1] + (a.v[2] - c.v[2]) * n[2];
      if (vn >= 0) continue;
      const antal = ps.length;
      stød(b, a, c, n);
      if (ps.length !== antal || !ps.includes(a) || !ps.includes(c)) return; // listen er ændret: næste skridt tager resten
    }
  }
}

// Måleren: det, det har kostet at bryde bindinger, det, man har fået for nye, og forskellen (varmen). eV.
export function regnskab(b) {
  return { brudt: b.brudt, dannet: b.dannet, varme: b.dannet - b.brudt };
}

// Hvor varm er gassen? Gennemsnittet af fart og rysten pr. molekyle i forhold til stuetemperatur (1 = 25 °C)
export function varme(b) {
  return fartEnergi(b) / b.partikler.length / STUE;
}

// Hele reaktionen til sidst: 2 H₂ + O₂ → 2 H₂O to gange. Netto 4 · (HOH + OH) − 4 · HH − 2 · OO.
export const NETTO = 4 * (BINDING.HOH + BINDING.OH) - 4 * BINDING.HH - 2 * BINDING.OO;
