// Tallene til Molekyler ("Giv elektroner", det der hed Byttebørsen): ioniseringsenergi, elektronaffinitet, radier og energien for et ionpar.
// Uden Three.js, så det kan testes i Node (tests/molekyler.mjs). Kilderne står i docs/fakta-molekyler.md (afsnit 1 og 7).

// e²/(4πε₀) i eV·Å: to ladninger på ±1 i afstanden r Å trækker med energien KE / r eV
export const KE = 14.3996;
// 1 eV pr. atom eller par = 96,485 kJ/mol
export const KJ_PR_EV = 96.485;

// Grundstofferne i Byttebørsen.
// ie: ioniseringsenergi for 1., 2. … elektron (eV, NIST Handbook of Basic Atomic Spectroscopic Data).
// ea: elektronaffinitet for 1. og 2. elektron (eV, Wikipedia "Electron affinity (data page)"). Negativ = den koster.
// en: elektronegativitet (Pauling). radius: atomets radius (pm, Slater 1964). ion: ionens radius (pm, Shannon 1976, seks naboer).
// ladning: ionens ladning. skaller: elektronerne i skallerne for det neutrale atom.
export const STOFFER = {
  Li: { nr: 3, navn: 'Lithium', ie: [5.391719, 75.6400], ea: [0.618049], en: 0.98, radius: 145, ion: 76, ladning: 1, skaller: [2, 1] },
  Na: { nr: 11, navn: 'Natrium', ie: [5.139076, 47.2864], ea: [0.547926], en: 0.93, radius: 180, ion: 102, ladning: 1, skaller: [2, 8, 1] },
  Mg: { nr: 12, navn: 'Magnesium', ie: [7.646235, 15.03527], ea: [-0.4], en: 1.31, radius: 150, ion: 72, ladning: 2, skaller: [2, 8, 2] },
  Ca: { nr: 20, navn: 'Calcium', ie: [6.11316, 11.87172], ea: [0.02455], en: 1.00, radius: 180, ion: 100, ladning: 2, skaller: [2, 8, 8, 2] },
  O: { nr: 8, navn: 'Oxygen', ie: [13.61805], ea: [1.46111297, -7.71], en: 3.44, radius: 60, ion: 140, ladning: -2, skaller: [2, 6] },
  F: { nr: 9, navn: 'Fluor', ie: [17.4228], ea: [3.4011898], en: 3.98, radius: 50, ion: 133, ladning: -1, skaller: [2, 7] },
  Cl: { nr: 17, navn: 'Chlor', ie: [12.96763], ea: [3.612725], en: 3.16, radius: 100, ion: 181, ladning: -1, skaller: [2, 8, 7] },
};

// Det koster at tage n elektroner fra et atom (eV)
export function tagEnergi(symbol, n = 1) {
  return STOFFER[symbol].ie.slice(0, n).reduce((a, b) => a + b, 0);
}

// Det giver (positivt) eller koster (negativt) at give et atom n elektroner (eV)
export function giveEnergi(symbol, n = 1) {
  const ea = STOFFER[symbol].ea;
  if (n > ea.length) throw new Error(`Ingen elektronaffinitet for elektron nr. ${n} til ${symbol}`);
  return ea.slice(0, n).reduce((a, b) => a + b, 0);
}

// Parrene i Byttebørsen (opgaverne i M1b). tagere: så mange ikkemetal-atomer. hver: så mange elektroner hvert af dem får.
// gitter: gitterenergien (kJ/mol, energien fra frie ioner til krystallen). Shriver & Atkins 5. udg. via Wikipedia
// "Lattice energy" (NaCl, LiF, MgO), CaCl₂ regnet med Born-Haber (docs/fakta-molekyler.md, afsnit 7).
// krystal: 'terning' (som køkkensalt: hver ion har seks naboer) eller 'rutil' (CaCl₂: Ca²⁺ har seks Cl⁻, Cl⁻ har tre Ca²⁺).
// Kun NaCl har et par i gas (mødet og harpunen): bindingslængde r0 (Å) og D, den energi, der skal til for at dele parret
// i to neutrale atomer (eV). OpenStax University Physics 3, §9.1 (0,236 nm og 4,26 eV). De andre går direkte til krystallen.
// Na + Na bytter ikke (bytter: false): Begge trækker lige hårdt, så elektronen flyver hjem igen.
export const PAR = {
  nacl: { id: 'nacl', metal: 'Na', ikkemetal: 'Cl', tagere: 1, hver: 1, navn: 'Natriumchlorid', formel: 'NaCl', hverdag: 'køkkensalt', gitter: 786, krystal: 'terning', r0: 2.36, D: 4.26 },
  lif: { id: 'lif', metal: 'Li', ikkemetal: 'F', tagere: 1, hver: 1, navn: 'Lithiumfluorid', formel: 'LiF', gitter: 1030, krystal: 'terning' },
  mgo: { id: 'mgo', metal: 'Mg', ikkemetal: 'O', tagere: 1, hver: 2, navn: 'Magnesiumoxid', formel: 'MgO', gitter: 3795, krystal: 'terning' },
  cacl2: { id: 'cacl2', metal: 'Ca', ikkemetal: 'Cl', tagere: 2, hver: 1, navn: 'Calciumchlorid', formel: 'CaCl₂', hverdag: 'vejsalt', gitter: 2255, krystal: 'rutil' },
  nana: { id: 'nana', metal: 'Na', ikkemetal: 'Na', tagere: 1, hver: 1, navn: 'Natrium og natrium', formel: 'Na + Na', bytter: false },
};
export const PAR_RÆKKE = ['nacl', 'lif', 'mgo', 'cacl2', 'nana'];

// Opgaverne i Byttebørsen (fremgang.js). Et par er klaret, når krystallen er bygget (Na + Na: når man har prøvet).
export const OPGAVER_BYTTE = [
  { id: 'bytte-nacl', par: 'nacl', titel: 'Giv elektroner: Byg en saltkrystal (Na + Cl)', tip: 'Flyt elektronen, lad ionerne mødes, og byg krystallen.', fakta: 'Køkkensalt er et gitter, hvor hver Na⁺ har seks Cl⁻ omkring sig. Derfor er kornene i fint salt små terninger.' },
  { id: 'bytte-lif', par: 'lif', titel: 'Giv elektroner: Lithium + fluor', tip: 'Flyt lithiums yderste elektron over til fluor, og byg krystallen.', fakta: 'Fluor er det grundstof, der trækker hårdest i elektronerne. Lithiumfluorid holder bedre sammen end salt, for ionerne er mindre og kommer tættere på hinanden.' },
  { id: 'bytte-mgo', par: 'mgo', titel: 'Giv elektroner: Magnesium + oxygen', tip: 'Flyt begge magnesiums yderste elektroner over til oxygen.', fakta: 'Mg²⁺ og O²⁻ har dobbelt så store ladninger som Na⁺ og Cl⁻, så de trækker fire gange så hårdt. Magnesiumoxid smelter først ved ca. 2.850 °C (salt ved 801 °C).' },
  { id: 'bytte-cacl2', par: 'cacl2', titel: 'Giv elektroner: Calcium + 2 chlor', tip: 'Calcium har to yderste elektroner. Giv én til hvert chloratom.', fakta: 'Calciumchlorid bruges til at smelte is på vejene. Det virker også, når det er så koldt, at almindeligt salt ikke kan følge med.' },
  { id: 'bytte-nana', par: 'nana', titel: 'Giv elektroner: Natrium + natrium', tip: 'Prøv at flytte en elektron fra det ene natriumatom til det andet.', fakta: 'To natriumatomer bytter ikke, for de trækker lige hårdt i elektronerne. I stedet deler de dem: Fast natrium er et metal.' },
];

// Hvor mange elektroner hvert ikkemetal-atom har, når `flyttet` elektroner er flyttet (de fyldes op ét atom ad gangen)
export function fordeling(par, flyttet) {
  const ud = [];
  let rest = flyttet;
  for (let i = 0; i < par.tagere; i++) {
    const k = Math.min(par.hver, rest);
    ud.push(k);
    rest -= k;
  }
  return ud;
}

// Så mange elektroner flytter sig i alt (Mg + O og Ca + 2 Cl: to)
export function iAltElektroner(par) {
  return par.tagere * par.hver;
}

// Prisen for at flytte elektronerne, mens atomerne er langt fra hinanden (eV).
// flyttet: elektroner, der er landet. fri: én elektron mere er revet løs, men ikke landet. fik: fordelingen (ellers fordeling()).
// Giver { tage, give }: tage ≤ 0 (det koster at tage dem fra metallet), give: det, ikkemetallerne giver tilbage
// (negativt for O²⁻: Den anden elektron koster, fælde 12).
export function byttePris(par, flyttet, fri = false, fik = fordeling(par, flyttet)) {
  const tagne = flyttet + (fri ? 1 : 0);
  const tage = tagne > 0 ? -tagEnergi(par.metal, tagne) : 0;
  const give = fik.reduce((sum, k) => sum + (k > 0 ? giveEnergi(par.ikkemetal, k) : 0), 0);
  return { tage, give };
}

// Gitterenergien pr. formelenhed (eV): det, krystallen giver, regnet fra frie ioner
export function gitterEnergi(par) {
  return par.gitter / KJ_PR_EV;
}

// Fra frie, neutrale atomer til krystallen (eV pr. formelenhed, positivt = gevinst)
export function krystalGevinst(par) {
  const { tage, give } = byttePris(par, iAltElektroner(par));
  return tage + give + gitterEnergi(par);
}

// Plus og minus langt fra hinanden: energien for punktladninger (eV, positiv = de trækker samlet set).
// ioner: [{ q, x, y, z }] med pladserne i Å. Ladninger med samme fortegn skubber (tæller negativt).
export function ladningsTræk(ioner) {
  let e = 0;
  for (let i = 0; i < ioner.length; i++) {
    for (let j = i + 1; j < ioner.length; j++) {
      const a = ioner[i];
      const b = ioner[j];
      if (!a.q || !b.q) continue;
      const r = Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
      e -= KE * a.q * b.q / r;
    }
  }
  return e;
}

// Hvor langt måleren skal gå til hver side (eV): det mest, det koster undervejs, og gevinsten i krystallen
export function målerSkala(par) {
  let mindst = 0;
  const n = iAltElektroner(par);
  for (let k = 0; k < n; k++) {
    const fri = byttePris(par, k, true);
    const landet = byttePris(par, k + 1);
    mindst = Math.min(mindst, fri.tage + fri.give, landet.tage + landet.give);
  }
  const størst = par.gitter ? krystalGevinst(par) : 0;
  return Math.ceil(Math.max(-mindst, størst) + 0.3);
}

// Ionernes pladser i krystallen (Å, midten i 0). Afstanden mellem naboer er summen af ionernes radier (Shannon).
// 'terning': n × n × n ioner, hver ion har seks naboer med modsat ladning (n lige, så der er lige mange af hver).
// 'rutil': CaCl₂ i den regelmæssige form over 217 °C (a = 6,379 Å, c = 4,193 Å, Müller 2006 via Wikipedia),
// her skaleret, så Ca–Cl passer med radierne. Giver [{ x, y, z, metal }] (metal: true for plus-ionen).
export function krystalPladser(par, n = 6) {
  const m = STOFFER[par.metal];
  const ik = STOFFER[par.ikkemetal];
  const d = (m.ion + ik.ion) / 100;
  const ud = [];
  if (par.krystal === 'terning') {
    const h = (n - 1) / 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
      ud.push({ x: (i - h) * d, y: (j - h) * d, z: (k - h) * d, metal: (i + j + k) % 2 === 0 });
    }
    return ud;
  }
  if (par.krystal === 'rutil') {
    const u = RUTIL_U;
    const celle = [
      [0, 0, 0, true], [0.5, 0.5, 0.5, true],
      [u, u, 0, false], [1 - u, 1 - u, 0, false], [0.5 + u, 0.5 - u, 0.5, false], [0.5 - u, 0.5 + u, 0.5, false],
    ];
    // Skaleret, så den korteste afstand Ca–Cl er d
    const a = d / RUTIL_KORTEST;
    const c = a * RUTIL_C_A;
    const nx = 3;
    const nz = Math.round(nx / RUTIL_C_A);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nx; j++) for (let k = 0; k < nz; k++) {
      for (const [fx, fy, fz, metal] of celle) ud.push({ x: (i + fx) * a, y: (j + fy) * a, z: (k + fz) * c, metal });
    }
    // Midten i 0
    const mid = ud.reduce((s, p) => [s[0] + p.x, s[1] + p.y, s[2] + p.z], [0, 0, 0]).map((v) => v / ud.length);
    for (const p of ud) { p.x -= mid[0]; p.y -= mid[1]; p.z -= mid[2]; }
    return ud;
  }
  return ud;
}
// Rutil: Cl⁻'s plads i cellen (u) og forholdet c/a. u = 0,30 som i rutil (TiO₂), c/a fra CaCl₂ (4,193 / 6,379).
const RUTIL_U = 0.30;
const RUTIL_C_A = 4.193 / 6.379;
// Den korteste afstand Ca–Cl i en celle med a = 1 (regnet én gang)
const RUTIL_KORTEST = (() => {
  const u = RUTIL_U;
  const c = RUTIL_C_A;
  let min = Infinity;
  const cl = [[u, u, 0], [1 - u, 1 - u, 0], [0.5 + u, 0.5 - u, 0.5], [0.5 - u, 0.5 + u, 0.5]];
  for (const [x, y, z] of cl) for (const dx of [-1, 0, 1]) for (const dy of [-1, 0, 1]) for (const dz of [-1, 0, 1]) {
    min = Math.min(min, Math.hypot(x + dx, y + dy, (z + dz) * c));
  }
  return min;
})();

// Det koster at flytte én elektron fra metallet til ikkemetallet, når de er langt fra hinanden (eV).
// Na → Cl: 5,14 − 3,61 = 1,53 eV
export function flytEnergi(metal, ikkemetal) {
  return tagEnergi(metal) - giveEnergi(ikkemetal);
}

// Så tæt skal to atomer være, før tiltrækningen mellem +1 og −1 betaler for at flytte elektronen (Å): "harpunen"
export function harpunAfstand(metal, ikkemetal) {
  return KE / flytEnergi(metal, ikkemetal);
}

// Frastødningen, når ionernes elektronskyer rører hinanden: A·e^(−r/ρ) (Born-Mayer).
// A og ρ vælges, så parret ligger stille ved r0, og bindingen er D (fra neutrale atomer). Giver { A, rho }.
export function frastødning(par) {
  const bund = par.D + flytEnergi(par.metal, par.ikkemetal); // energien fra frie ioner ned til parret
  const træk = KE / par.r0; // tiltrækningen ved r0
  // I bunden er kræfterne lige store: KE/r0² = (A/ρ)·e^(−r0/ρ), og energien er −KE/r0 + A·e^(−r0/ρ) = −bund
  const frastødVedR0 = træk - bund; // A·e^(−r0/ρ)
  const rho = frastødVedR0 * par.r0 * par.r0 / KE;
  return { A: frastødVedR0 * Math.exp(par.r0 / rho), rho };
}

// Energien for Na⁺ og Cl⁻ i afstanden r (Å) i forhold til de samme ioner langt fra hinanden (eV, negativ = bundet)
export function ionparEnergi(par, r) {
  const { A, rho } = frastødning(par);
  return -KE / r + A * Math.exp(-r / rho);
}

// Kraften mellem ionerne (eV/Å, positiv = de trækker i hinanden)
export function ionparKraft(par, r) {
  const { A, rho } = frastødning(par);
  return KE / (r * r) - (A / rho) * Math.exp(-r / rho);
}

// Regnskabet i Byttebørsen (eV, positivt = gevinst). elektron: 'hjemme' (hos metallet), 'fri' (trukket væk) eller
// 'flyttet' (hos ikkemetallet). r: afstanden mellem atomerne (Å).
// Giver { tage, give, træk, iAlt }: tage ≤ 0 (det koster at tage elektronen), give > 0 (ikkemetallet giver noget tilbage)
// og træk (plus og minus trækker i hinanden, og skyerne skubber helt tæt på).
// (Kun til parret i gas, NaCl. De andre par bruger byttePris og ladningsTræk.)
export function regnskab(par, elektron, r) {
  const tage = elektron === 'hjemme' ? 0 : -tagEnergi(par.metal);
  const give = elektron === 'flyttet' ? giveEnergi(par.ikkemetal) : 0;
  const træk = elektron === 'flyttet' ? -ionparEnergi(par, r) : 0;
  return { tage, give, træk, iAlt: tage + give + træk };
}

// Ionens radius i forhold til atomets (Na⁺ bliver ca. halvt så stor, Cl⁻ ca. dobbelt så stor)
export function størrelsesForhold(symbol) {
  const s = STOFFER[symbol];
  return s.ion / s.radius;
}

// Skallerne, når atomet har fået q elektroner mere (q < 0: givet elektroner væk). Uden q: den færdige ion.
// Metallet mister den yderste skal, ikkemetallet fylder den op.
export function ionSkaller(symbol, q = -STOFFER[symbol].ladning) {
  const skaller = [...STOFFER[symbol].skaller];
  skaller[skaller.length - 1] += q;
  if (skaller[skaller.length - 1] === 0) skaller.pop();
  return skaller;
}

// Bytter to atomer elektroner? Kun når det ene trækker meget hårdere i elektronerne (forskellen i elektronegativitet).
// Grænsen ca. 1,7 er en tommelfingerregel (fakta-molekyler.md, afsnit 2). Na + Na: forskellen er 0, så de bytter ikke.
export function bytter(a, b) {
  return Math.abs(STOFFER[a].en - STOFFER[b].en) >= 1.7;
}
