// Byg molekyler (Molekyler M2, "Del elektroner"): reglerne, bindingerne, genkendelsen af kendte molekyler og formen.
// Ingen Three.js, så det hele kan testes i Node (tests/molekyler.mjs). Tallene står med kilder i
// docs/fakta-molekyler/m2.md (elektronegativiteten i afsnit 1, reglerne i afsnit 2, længderne i afsnit 3 og formen i afsnit 4).
//
// Et molekyle gemmes kun som "hvem sidder sammen" (naboer). Dobbelt- og tripelbindingerne regnes ud bagefter, så så mange
// elektroner som muligt får en partner. Formen kommer af en enkel model: Bindingerne er fjedre, og om hvert atom skubber
// retningerne (bindinger, frie par og elektroner uden partner) hinanden væk. Det er ikke en kvanteudregning.

export const MAX_ATOMER = 12;

// hænder: bindinger, når atomet er færdigt (= elektroner uden partner i Lewis-symbolet). yderst: elektroner i yderste skal.
// en: elektronegativitet (Pauling). r1: halv enkeltbinding i Å (kun til tegningen, se længde()).
export const STOFFER_BYG = {
  H: { symbol: 'H', navn: 'Hydrogen', hænder: 1, yderst: 1, en: 2.20, r1: 0.37 },
  C: { symbol: 'C', navn: 'Kulstof', hænder: 4, yderst: 4, en: 2.55, r1: 0.77 },
  N: { symbol: 'N', navn: 'Nitrogen', hænder: 3, yderst: 5, en: 3.04, r1: 0.72 },
  O: { symbol: 'O', navn: 'Oxygen', hænder: 2, yderst: 6, en: 3.44, r1: 0.73 },
  Cl: { symbol: 'Cl', navn: 'Chlor', hænder: 1, yderst: 7, en: 3.16, r1: 0.99 },
};
export const PALET = ['H', 'C', 'N', 'O', 'Cl'];

// Målte bindingslængder i Å (CCCBDB, faktagrundlaget afsnit 3). Nøgle: symbolerne i alfabetisk orden og ordenen.
const LÆNGDER = {
  'H-H-1': 0.741, 'O-O-2': 1.208, 'N-N-3': 1.098, 'Cl-Cl-1': 1.988, 'Cl-H-1': 1.275, 'H-O-1': 0.958, 'O-O-1': 1.475,
  'C-O-2': 1.162, 'C-O-3': 1.128, 'C-H-1': 1.087, 'H-N-1': 1.012, 'C-C-1': 1.536, 'C-C-2': 1.339, 'C-C-3': 1.203,
  'C-O-1': 1.427, 'C-N-3': 1.156,
};
const KORTERE = [1, 1, 0.87, 0.78]; // dobbelt- og tripelbindinger er kortere (kun til par, der ikke er målt)

// Bindingens længde i Å. Par, der ikke er målt (fx C–Cl og N–O), får summen af de halve enkeltbindinger (kun til tegningen).
export function længde(a, b, orden = 1) {
  const [x, y] = [a, b].sort();
  return LÆNGDER[`${x}-${y}-${orden}`] ?? (STOFFER_BYG[a].r1 + STOFFER_BYG[b].r1) * KORTERE[orden];
}

// ---------- Grafen ----------
// atomer: [{ symbol }], bånd: [[i, j], …] (hvem sidder sammen). Giver naboerne for hvert atom.
export function naboListe(atomer, bånd) {
  const nb = atomer.map(() => []);
  for (const [i, j] of bånd) {
    nb[i].push(j);
    nb[j].push(i);
  }
  return nb;
}

// Kan atom i få en nabo mere? (færre naboer end hænder)
export function harPlads(atomer, bånd, i) {
  let n = 0;
  for (const [a, b] of bånd) if (a === i || b === i) n++;
  return n < STOFFER_BYG[atomer[i].symbol].hænder;
}

// Må i og j binde? Giver { ok, grund } (grund: 'fuld' med hvem, 'samme', 'allerede').
export function kanBinde(atomer, bånd, i, j) {
  if (i === j) return { ok: false, grund: 'samme' };
  if (bånd.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) return { ok: false, grund: 'allerede' };
  if (!harPlads(atomer, bånd, j)) return { ok: false, grund: 'fuld', fuld: j };
  if (!harPlads(atomer, bånd, i)) return { ok: false, grund: 'fuld', fuld: i };
  return { ok: true };
}

// Grupperne af atomer, der hænger sammen (hvert er et molekyle eller et enligt atom)
export function grupper(atomer, bånd) {
  const nb = naboListe(atomer, bånd);
  const gruppe = atomer.map(() => -1);
  const ud = [];
  for (let s = 0; s < atomer.length; s++) {
    if (gruppe[s] >= 0) continue;
    const liste = [s];
    gruppe[s] = ud.length;
    for (let k = 0; k < liste.length; k++) {
      for (const n of nb[liste[k]]) if (gruppe[n] < 0) { gruppe[n] = ud.length; liste.push(n); }
    }
    ud.push(liste.sort((a, b) => a - b));
  }
  return ud;
}

// ---------- Bindingerne ----------
// Regner ordenen (1, 2 eller 3) for hvert bånd ud, så så mange elektroner som muligt får en partner. Prøver alle
// muligheder med et loft (højst 12 atomer, så det går hurtigt). Giver { ordener, dativ } (dativ: bånd nr., kun kulilte).
export function bindinger(atomer, bånd) {
  const rest = atomer.map((a, i) => STOFFER_BYG[a.symbol].hænder - bånd.filter(([x, y]) => x === i || y === i).length);
  const ekstra = bånd.map(() => 0);
  let bedst = { sum: -1, ekstra: [...ekstra] };
  // Loftet: hvert ekstra par bruger én fra hver ende
  const loft = (k) => {
    let s = 0;
    for (let e = k; e < bånd.length; e++) s += Math.min(2, rest[bånd[e][0]], rest[bånd[e][1]]);
    return s;
  };
  let tæller = 0;
  const prøv = (k, sum) => {
    if (++tæller > 200000) return; // sikkerhed (sker ikke med 12 atomer)
    if (k === bånd.length) {
      if (sum > bedst.sum) bedst = { sum, ekstra: [...ekstra] };
      return;
    }
    if (sum + loft(k) <= bedst.sum) return;
    const [i, j] = bånd[k];
    for (let x = Math.min(2, rest[i], rest[j]); x >= 0; x--) {
      rest[i] -= x; rest[j] -= x; ekstra[k] = x;
      prøv(k + 1, sum + x);
      rest[i] += x; rest[j] += x; ekstra[k] = 0;
    }
  };
  prøv(0, 0);
  const ordener = bedst.ekstra.map((x) => 1 + x);
  let dativ = -1;
  // Kulilte (fælde 1): C=O alene har to elektroner tilbage på C. Oxygen låner et af sine frie par ud, så det bliver C≡O.
  if (atomer.length === 2 && bånd.length === 1 && ordener[0] === 2 && [atomer[0].symbol, atomer[1].symbol].sort().join('') === 'CO') {
    ordener[0] = 3;
    dativ = 0;
  }
  return { ordener, dativ };
}

// Elektronerne om hvert atom: { uden (elektroner uden partner), frie (frie par), bindinger (sum af ordener) }.
// Kulilte: O giver begge elektroner til det ene par (dativ), så C får et frit par i stedet for to enlige elektroner.
export function elektroner(atomer, bånd, { ordener, dativ }) {
  return atomer.map((a, i) => {
    const s = STOFFER_BYG[a.symbol];
    let sum = 0;
    bånd.forEach(([x, y], k) => { if (x === i || y === i) sum += ordener[k]; });
    if (dativ >= 0) return { uden: 0, frie: 1, bindinger: sum }; // kulilte: et frit par på både C og O
    return { uden: Math.max(0, s.hænder - sum), frie: (s.yderst - s.hænder) / 2, bindinger: sum };
  });
}

// ---------- Kendte molekyler ----------
// tunge: atomerne uden H, bånd mellem dem, h: antal H på hvert. Navn og formel som de skrives i spillet. form: kort tekst
// om formen (faktagrundlaget afsnit 3 og 4).
const KENDTE_LISTE = [
  { id: 'h2', navn: 'Hydrogen', formel: 'H₂', tunge: ['H'], bånd: [], h: [1], form: 'To atomer ligger altid på en lige linje.',
    polær: false, kort: 'Den letteste gas. Flydende hydrogen og flydende oxygen var brændstoffet i rumfærgens hovedmotorer.',
    ladning: 'De to atomer trækker lige hårdt, så parret ligger midt imellem. Molekylet er ikke polært.' },
  { id: 'o2', navn: 'Oxygen', formel: 'O₂', tunge: ['O', 'O'], bånd: [[0, 1]], h: [0, 0], form: 'To atomer ligger altid på en lige linje. Her deler de to par (en dobbeltbinding).',
    polær: false, kort: 'Ca. 21 % af luften. Du ånder den ind, og planterne laver den, når de bruger sollys (fotosyntese).',
    ladning: 'De to atomer trækker lige hårdt, så molekylet er ikke polært.' },
  { id: 'n2', navn: 'Nitrogen', formel: 'N₂', tunge: ['N', 'N'], bånd: [[0, 1]], h: [0, 0], form: 'To atomer ligger altid på en lige linje. Her deler de tre par (en tripelbinding).',
    polær: false, kort: 'Ca. 78 % af luften. Tripelbindingen er så stærk, at nitrogen næsten ikke reagerer ved stuetemperatur. Derfor bruges den i madpakninger i stedet for luft.',
    ladning: 'De to atomer trækker lige hårdt, så molekylet er ikke polært.' },
  { id: 'cl2', navn: 'Chlor', formel: 'Cl₂', tunge: ['Cl', 'Cl'], bånd: [[0, 1]], h: [0, 0], form: 'To atomer ligger altid på en lige linje.',
    polær: false, kort: 'En gulgrøn gas, der er farlig at indånde. Chlor bruges til at lave plastikken PVC og til at dræbe bakterier i vand.',
    ladning: 'De to atomer trækker lige hårdt, så molekylet er ikke polært.' },
  { id: 'hcl', navn: 'Hydrogenchlorid', formel: 'HCl', tunge: ['Cl'], bånd: [], h: [1], form: 'To atomer ligger altid på en lige linje.',
    polær: true, kort: 'Opløst i vand hedder det saltsyre. Din mavesyre er mest saltsyre, og den hjælper med at fordøje maden.',
    ladning: 'Chlor trækker hårdere end hydrogen, så Cl-enden er lidt minus (δ−), og H-enden er lidt plus (δ+). Molekylet er polært.' },
  { id: 'vand', navn: 'Vand', formel: 'H₂O', tunge: ['O'], bånd: [], h: [2], form: 'Det er bøjet (ca. 104,5°), fordi oxygens to frie par skubber de to bindinger lidt sammen.',
    polær: true, kort: 'Dækker ca. 71 % af Jordens overflade. Fordi vand har en plus-ende og en minus-ende, kan det opløse salt.',
    ladning: 'Oxygen trækker hårdest i de delte par, så O-enden er lidt minus (δ−), og H-enderne er lidt plus (δ+). Fordi vand er bøjet, ophæver de to træk ikke hinanden: Vand er polært.' },
  { id: 'h2o2', navn: 'Brintoverilte', formel: 'H₂O₂', tunge: ['O', 'O'], bånd: [[0, 1]], h: [1, 1], form: 'Det er vredet som en halvt åben bog.',
    polær: true, kort: 'Fortyndet brintoverilte bruges til at blege hår og til at dræbe bakterier.',
    ladning: 'Oxygen trækker hårdere end hydrogen, så H-enderne er lidt plus (δ+). Fordi molekylet er vredet, ophæver trækkene ikke hinanden: Det er polært.' },
  { id: 'co2', navn: 'Kuldioxid', formel: 'CO₂', tunge: ['C', 'O', 'O'], bånd: [[0, 1], [0, 2]], h: [0, 0, 0], form: 'Det er lige, for kulstof har ingen frie par. De to dobbeltbindinger skubber hinanden ud til hver sin side.',
    polær: false, kort: 'Du ånder den ud, og planterne tager den op. Den giver boblerne i sodavand. Ca. 0,04 % af luften.',
    ladning: 'Hver binding er polær: Oxygen trækker hårdere end kulstof. Men de to træk er lige store og peger hver sin vej, så de ophæver hinanden. CO₂ er ikke polært.' },
  { id: 'co', navn: 'Kulilte', formel: 'CO', tunge: ['C', 'O'], bånd: [[0, 1]], h: [0, 0], form: 'To atomer ligger altid på en lige linje. Her deler de tre par (en tripelbinding).',
    polær: false, kort: 'Dannes, når noget brænder uden nok luft. Den er giftig, fordi den sætter sig over 200 gange fastere i blodet end oxygen, og man kan hverken se eller lugte den. Derfor findes der kulilte-alarmer.',
    ladning: 'Kulilte er kun en lille smule polært, og på en mærkelig måde (se "Ærligt talt"). Spillet viser ingen δ her.' },
  { id: 'metan', navn: 'Metan', formel: 'CH₄', tunge: ['C'], bånd: [], h: [4], form: 'De fire H sidder i hjørnerne af en tetraeder (en pyramide med trekanter på alle sider), så vinklerne er 109,5°.',
    polær: false, kort: 'Det meste af naturgassen. Den dannes også i moser og i maven på køer, som bøvser den ud.',
    ladning: 'C–H-bindingerne er næsten ikke skæve, og de fire peger i hver sin retning. Metan er ikke polært.' },
  { id: 'ammoniak', navn: 'Ammoniak', formel: 'NH₃', tunge: ['N'], bånd: [], h: [3], form: 'Det er en lav pyramide. Det frie par på nitrogen skubber de tre H lidt sammen (ca. 107°).',
    polær: true, kort: 'En gas med en skarp lugt. Ca. 70 % af den bruges til at lave kunstgødning. Den findes også i nogle rengøringsmidler.',
    ladning: 'Nitrogen trækker hårdere end hydrogen, så N-enden er lidt minus (δ−). Fordi molekylet er en pyramide, ophæver trækkene ikke hinanden: Ammoniak er polært.' },
  { id: 'ethan', navn: 'Ethan', formel: 'C₂H₆', tunge: ['C', 'C'], bånd: [[0, 1]], h: [3, 3], form: 'To tetraedre, hvor H\'erne står forskudt, så de er så langt fra hinanden som muligt.',
    polær: false, kort: 'Den næststørste del af naturgassen. På Saturns måne Titan er der søer, som nok er flydende metan og ethan.',
    ladning: 'Der er kun C–C og C–H, som næsten ikke er skæve. Ethan er ikke polært.' },
  { id: 'ethen', navn: 'Ethen', formel: 'C₂H₄', tunge: ['C', 'C'], bånd: [[0, 1]], h: [2, 2], form: 'Det er fladt. Dobbeltbindingen holder de to ender i samme plan.',
    polær: false, kort: 'Et plantehormon, der får frugt til at modne. Den bruges også til at lave plastikken polyethylen.',
    ladning: 'Der er kun C=C og C–H, som næsten ikke er skæve. Ethen er ikke polært.' },
  { id: 'ethyn', navn: 'Ethyn', formel: 'C₂H₂', tunge: ['C', 'C'], bånd: [[0, 1]], h: [1, 1], form: 'Det er lige. Tripelbindingen og de to H ligger på én linje.',
    polær: false, kort: 'Brænder den med ren oxygen, bliver flammen over 3.300 °C. Den bruges til at svejse og skære i metal.',
    ladning: 'Der er kun C≡C og C–H, som næsten ikke er skæve. Ethyn er ikke polært.' },
  { id: 'methanol', navn: 'Methanol', formel: 'CH₃OH', tunge: ['C', 'O'], bånd: [[0, 1]], h: [3, 1], form: 'Kulstof er en tetraeder, og molekylet er bøjet ved oxygen.',
    polær: true, kort: 'Ligner ethanol, men er giftig at drikke og kan gøre en blind. Den bruges i industrien og som brændstof.',
    ladning: 'Oxygen trækker hårdest, så O-enden er lidt minus (δ−). Molekylet er polært.' },
  { id: 'ethanol', navn: 'Ethanol', formel: 'C₂H₅OH', tunge: ['C', 'C', 'O'], bånd: [[0, 1], [1, 2]], h: [3, 2, 1], form: 'En kæde med to kulstof, der er bøjet ved oxygen.',
    polær: true, kort: 'Alkoholen i øl og vin. Den bruges også i håndsprit og som brændstof i biler.',
    ladning: 'Oxygen trækker hårdest, så O-enden er lidt minus (δ−). Molekylet er polært.' },
  { id: 'hcn', navn: 'Hydrogencyanid', formel: 'HCN', tunge: ['C', 'N'], bånd: [[0, 1]], h: [1, 0], form: 'Det er lige: H, C og N ligger på én linje.',
    polær: true, kort: 'Meget giftig. Den findes også i rummet, fx i luften på Saturns måne Titan, og den kan have været en af byggestenene til livets første molekyler.',
    ladning: 'Nitrogen trækker hårdere end kulstof, så N-enden er lidt minus (δ−). Molekylet er polært.' },
];

// Bygger et kendt molekyle som atomer og bånd (H'erne til sidst). Bruges af genkendelsen og testene.
export function bygKendt(k) {
  const atomer = k.tunge.map((symbol) => ({ symbol }));
  const bånd = k.bånd.map((b) => [...b]);
  k.h.forEach((antal, i) => {
    for (let n = 0; n < antal; n++) {
      atomer.push({ symbol: 'H' });
      bånd.push([i, atomer.length - 1]);
    }
  });
  return { atomer, bånd };
}

// Et fingeraftryk af en gruppe: grundstofferne og hvem der sidder sammen, uafhængigt af rækkefølgen (farve-forfining).
// For træer (alle de kendte molekyler) er fingeraftrykket entydigt, så et andet molekyle kan ikke få det samme navn.
const NAVNE = new Map(); // fælles ordbog: hver tekst får et fast nummer (det samme for alle grupper)
const kortNavn = (t) => {
  if (!NAVNE.has(t)) NAVNE.set(t, NAVNE.size);
  return NAVNE.get(t);
};
export function fingeraftryk(atomer, bånd) {
  const nb = naboListe(atomer, bånd);
  let farve = atomer.map((a) => kortNavn(a.symbol));
  for (let runde = 0; runde < atomer.length; runde++) {
    farve = farve.map((f, i) => kortNavn(`${f}(${nb[i].map((n) => farve[n]).sort((x, y) => x - y).join(',')})`));
  }
  return `${atomer.length}|${bånd.length}|${[...farve].sort((x, y) => x - y).join(',')}`;
}

const AFTRYK = new Map();
for (const k of KENDTE_LISTE) {
  const { atomer, bånd } = bygKendt(k);
  AFTRYK.set(fingeraftryk(atomer, bånd), k);
}
export const KENDTE = Object.fromEntries(KENDTE_LISTE.map((k) => [k.id, k]));
export const KENDTE_RÆKKE = KENDTE_LISTE.map((k) => k.id);

const SÆNKET = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const sænk = (n) => (n === 1 ? '' : String(n).replace(/\d/g, (c) => SÆNKET[c]));

// Formlen for et ukendt molekyle: C først, så H, så resten alfabetisk (Hill-systemet). Uden C: alfabetisk.
export function formelHill(atomer) {
  const antal = {};
  for (const a of atomer) antal[a.symbol] = (antal[a.symbol] ?? 0) + 1;
  const navne = Object.keys(antal).sort();
  const orden = antal.C ? ['C', ...(antal.H ? ['H'] : []), ...navne.filter((s) => s !== 'C' && s !== 'H')] : navne;
  return orden.map((s) => s + sænk(antal[s])).join('');
}

// Giver det kendte molekyle for en gruppe (eller null)
export function genkend(atomer, bånd) {
  return AFTRYK.get(fingeraftryk(atomer, bånd)) ?? null;
}

// Udsnit: atomerne og båndene i én gruppe (med nye numre)
export function udsnit(atomer, bånd, liste) {
  const ny = new Map(liste.map((i, k) => [i, k]));
  return {
    atomer: liste.map((i) => atomer[i]),
    bånd: bånd.filter(([a, b]) => ny.has(a) && ny.has(b)).map(([a, b]) => [ny.get(a), ny.get(b)]),
  };
}

// Status for én gruppe: { atomer (numre), færdig, uden, kendt, formel, enligt }
export function status(atomer, bånd, liste) {
  const u = udsnit(atomer, bånd, liste);
  const b = bindinger(u.atomer, u.bånd);
  const e = elektroner(u.atomer, u.bånd, b);
  const uden = e.reduce((s, x) => s + x.uden, 0);
  const enligt = liste.length === 1;
  const færdig = !enligt && uden === 0;
  const kendt = færdig ? genkend(u.atomer, u.bånd) : null;
  return { atomer: liste, færdig, uden, kendt, formel: kendt ? kendt.formel : formelHill(u.atomer), enligt };
}

// ---------- Ladningerne (M2b) ----------
// Trækker det ene atom hårdere i et delt par (højere elektronegativitet), bliver det lidt minus (δ−) og det andet lidt plus
// (δ+). Kun når forskellen er mindst 0,4 (faktagrundlaget afsnit 1 og fælde 4: C–H med 0,35 regnes som upolær).
export const POLÆR_GRÆNSE = 0.4;
export const forskel = (a, b) => Math.round(Math.abs(STOFFER_BYG[a].en - STOFFER_BYG[b].en) * 100) / 100;

// Er bindingen mellem a og b polær? Giver { delta, minus } (minus: symbolet, der er δ−) eller null.
export function polærBinding(a, b) {
  const delta = forskel(a, b);
  if (delta < POLÆR_GRÆNSE) return null;
  return { delta, minus: STOFFER_BYG[a].en > STOFFER_BYG[b].en ? a : b };
}

// Ladningen på hvert atom som et tal: plus er δ+, minus er δ−, 0 er ingen (summen af forskellene på de polære bindinger).
// Kulilte (dativ) får ingen: Dipolen peger den "forkerte" vej, og prik-reglen kan ikke se det (fælde 1).
export function ladninger(atomer, bånd, { dativ }) {
  const q = atomer.map(() => 0);
  if (dativ >= 0) return q;
  for (const [i, j] of bånd) {
    const p = polærBinding(atomer[i].symbol, atomer[j].symbol);
    if (!p) continue;
    const minus = atomer[i].symbol === p.minus ? i : j;
    q[minus] -= p.delta;
    q[minus === i ? j : i] += p.delta;
  }
  return q.map((x) => Math.round(x * 100) / 100);
}

// Bindingernes træk som pile (OpenStax 7.6: fra det atom, der trækker mindst, mod det, der trækker mest, og så lange som
// forskellen). Giver { pile: [{ fra, til, delta }], sum: [x, y, z] } for atomerne i liste (pladserne fra formen).
// Er summen 0, ophæver trækkene hinanden, og molekylet er ikke polært (fælde 5).
export function træk(form, liste) {
  const s = form.struktur;
  const pile = [];
  const sum = [0, 0, 0];
  if (!s || s.dativ >= 0) return { pile, sum };
  const med = new Set(liste);
  for (const [i, j] of s.bånd) {
    if (!med.has(i)) continue;
    const p = polærBinding(s.atomer[i].symbol, s.atomer[j].symbol);
    if (!p) continue;
    const [fra, til] = s.atomer[i].symbol === p.minus ? [j, i] : [i, j];
    const v = norm(sub(form.pos[til], form.pos[fra]));
    pile.push({ fra, til, delta: p.delta });
    for (let q = 0; q < 3; q++) sum[q] += v[q] * p.delta;
  }
  return { pile, sum };
}
export const POLÆR_SUM = 0.2; // en sum over dette (i elektronegativitet) betyder polær

// Er molekylet polært ud fra formen? (Kendte molekyler har deres eget flag, som testene sammenligner med.)
export function polærForm(form, liste) {
  return len(træk(form, liste).sum) > POLÆR_SUM;
}

// ---------- Opgaverne (M2b) ----------
// Tæller med på Værkstedets kort i menuen og i Værkstedets "Opgaver forfra". Id'erne har byg- foran (fremgang.js).
// hvad: hvornår den er klaret (molekyler-byg.js tjekker det): et kendt molekyle, med pilene tændt, drejet eller en tripelbinding.
export const OPGAVER_BYG = [
  { id: 'byg-h2', kendt: 'h2', titel: 'Del elektroner: Byg H₂', kort: 'Byg H₂',
    tip: 'Træk to H ind, og slip det ene tæt på det andet.',
    fakta: 'Hydrogen (H₂) er det enkleste molekyle: to protoner, der deler ét elektronpar.' },
  { id: 'byg-vand', kendt: 'vand', titel: 'Del elektroner: Byg vand, og se, at det er bøjet', kort: 'Byg vand',
    tip: 'Sæt to H på et O. Drej molekylet bagefter, så du kan se vinklen.',
    fakta: 'Vand er bøjet (ca. 104,5°), fordi oxygens to frie par skubber de to H lidt sammen.' },
  { id: 'byg-co2', kendt: 'co2', pile: true, titel: 'Del elektroner: Hvorfor er CO₂ ikke polært?', kort: 'CO₂ uden plus og minus',
    tip: 'Byg CO₂ (et C med et O på hver side), og slå "Pile" til. Se, hvilken vej bindingerne trækker.',
    fakta: 'Begge bindinger er polære, men de trækker lige hårdt hver sin vej. Trækkene ophæver hinanden, så CO₂ har ingen plus- og minus-ende.' },
  { id: 'byg-metan', kendt: 'metan', drej: true, titel: 'Del elektroner: Byg metan, og drej den', kort: 'Metan og tetraederen',
    tip: 'Sæt fire H på et C. Drej molekylet med fingeren eller musen, til du ser tetraederen.',
    fakta: 'Metan er en tetraeder: De fire H sidder så langt fra hinanden som muligt, med 109,5° mellem hver binding.' },
  { id: 'byg-tripel', tripel: true, titel: 'Del elektroner: Byg et molekyle med en tripelbinding', kort: 'En tripelbinding',
    tip: 'To atomer, der deler tre par. Prøv to N.',
    fakta: 'Nitrogen (N₂) har en tripelbinding og er ca. 78 % af luften. Bindingen er så stærk, at nitrogen næsten ikke reagerer ved stuetemperatur.' },
  { id: 'byg-ethanol', kendt: 'ethanol', titel: 'Del elektroner: Byg ethanol', kort: 'Byg ethanol',
    tip: 'C–C–O som en kæde. Fyld så op med H, til ingen elektroner blinker.',
    fakta: 'Ethanol (C₂H₅OH) er alkoholen i øl og vin. De samme atomer kan også sættes sammen som dimethylether, som er en gas (drivgas i spraydåser).' },
];
export const DREJ_GRADER = 90; // metan: så meget skal molekylet drejes (kameraet), efter at det er færdigt

// Er opgaven klaret? { kendte: ids af færdige kendte molekyler, tripel: om et færdigt molekyle har en tripelbinding,
// pile: om pilene er tændt, drejet: grader, metan er drejet, efter at den blev færdig }
export function opgaveKlaret(o, { kendte, tripel, pile, drejet }) {
  if (o.tripel) return tripel;
  if (!kendte.includes(o.kendt)) return false;
  if (o.pile && !pile) return false;
  if (o.drej && drejet < DREJ_GRADER) return false;
  return true;
}

// ---------- Formen ----------
// Vægten for en retning om et atom (faktagrundlaget afsnit 4): binding 1, dobbelt 1,1, tripel 1,2, frit par 1,245.
export const VÆGT = { 1: 1, 2: 1.1, 3: 1.2, frit: 1.245, enlig: 1 };
const FJEDER = 60; // hvor stift bindingerne holder længden
const VINKEL = 3; // hvor hårdt retningerne skubber
const FJERN = 0.15000000000000002; // svag frastødning mellem atomer med mindst to atomer imellem (gør ethan forskudt)
const ANDRE = 3; // frastødning mellem atomer, der ikke hænger sammen (så de ikke ligger oven i hinanden)
const VRID_OO = 1.7999999999999998; // H₂O₂: X–O–O–X drejes til ca. 112° (fælde 3)
const VRID_FLAD = 0.36; // dobbeltbindinger holder X–A=B–Y fladt (svagt, ellers kan formen gå i hak)
const VRID_FORSKUDT = 0.27; // enkeltbindinger mellem to tetraedre (fx ethan) står forskudt (bunden ved 60°, 180° og 300°)
const VRID_MÅL = Math.cos(112 * Math.PI / 180);
const PUF = 0.08; // Å
export const MAX_SKRIDT = 0.004; // modellens tidsskridt (stabilt med fjedrene ovenfor)

// Laver modellen for formen. Hvert atom har en plads (Å) og retninger for frie par og elektroner uden partner.
// Pladserne ændres af skridt(), og man kan flytte et atom selv (fast = det atom, man trækker i).
export function lavForm() {
  return { pos: [], retninger: [], struktur: null, fast: -1, rystelse: 1 };
}

// Hvad der skal regnes på, efter at atomerne eller båndene har ændret sig
export function opdaterStruktur(form, atomer, bånd) {
  const { ordener, dativ } = bindinger(atomer, bånd);
  const e = elektroner(atomer, bånd, { ordener, dativ });
  const nb = naboListe(atomer, bånd);
  const g = grupper(atomer, bånd);
  const gruppe = atomer.map(() => 0);
  g.forEach((liste, k) => { for (const i of liste) gruppe[i] = k; });
  // Afstand i grafen (antal bånd) mellem atomer i samme gruppe
  const n = atomer.length;
  const afst = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  for (let s = 0; s < n; s++) {
    afst[s][s] = 0;
    const kø = [s];
    for (let k = 0; k < kø.length; k++) for (const m of nb[kø[k]]) if (afst[s][m] === Infinity) { afst[s][m] = afst[s][kø[k]] + 1; kø.push(m); }
  }
  // Retninger uden nabo: frie par og elektroner uden partner. De gamle beholdes, så de ikke hopper.
  for (let i = 0; i < n; i++) {
    const behov = [...new Array(e[i].frie).fill('frit'), ...new Array(e[i].uden).fill('enlig')];
    const gamle = form.retninger[i] ?? [];
    form.retninger[i] = behov.map((slags, k) => ({ slags, v: gamle[k]?.v ?? tilfældigRetning(i * 7 + k) }));
    if (!form.pos[i]) form.pos[i] = [0, 0, 0];
  }
  form.retninger.length = n;
  form.pos.length = n;
  // Et lille puf til alle atomer (faste "tilfældige" tal), når noget har ændret sig. Ellers kan formen blive hængende
  // i en symmetrisk, flad form (fx metan som et kvadrat med 90°), hvis alle atomer er trukket ind i samme plan.
  for (let i = 0; i < n; i++) {
    if (i === form.fast) continue;
    const v = tilfældigRetning(form.puf = (form.puf ?? 0) + 1);
    for (let q = 0; q < 3; q++) form.pos[i][q] += v[q] * PUF;
  }
  // Vrid: H₂O₂ (O–O-enkeltbinding) og flade dobbeltbindinger
  const vrid = [];
  const fire = (i) => nb[i].length + e[i].frie + e[i].uden === 4; // fire retninger (tetraeder)
  bånd.forEach(([a, b], k) => {
    const oo = ordener[k] === 1 && atomer[a].symbol === 'O' && atomer[b].symbol === 'O';
    const dobbelt = ordener[k] === 2;
    const forskudt = !oo && ordener[k] === 1 && fire(a) && fire(b);
    if (!oo && !dobbelt && !forskudt) return;
    for (const x of nb[a]) {
      if (x === b) continue;
      for (const y of nb[b]) {
        if (y === a || y === x) continue;
        // Forskudt: ét par er nok, for cos 3φ er det samme for alle tre naboer, når de står med 120° imellem
        if (forskudt && vrid.some((v) => v.a === a && v.b === b)) continue;
        vrid.push({ x, a, b, y, slags: oo ? 'oo' : dobbelt ? 'flad' : 'forskudt' });
      }
    }
  });
  // Naboerne med vægten for bindingen (så skridt() ikke skal lede efter den)
  const vægte = atomer.map(() => []);
  bånd.forEach(([a, b], k) => {
    vægte[a].push({ m: b, w: VÆGT[ordener[k]] });
    vægte[b].push({ m: a, w: VÆGT[ordener[k]] });
  });
  form.struktur = { atomer, bånd, ordener, dativ, e, nb, gruppe, afst, vrid, vægte, q: ladninger(atomer, bånd, { dativ }) };
}

// Faste "tilfældige" retninger (så testene altid giver det samme)
function tilfældigRetning(frø) {
  const a = Math.sin(frø * 12.9898 + 1.7) * 43758.5453;
  const b = Math.sin(frø * 78.233 + 0.3) * 12345.6789;
  const u = a - Math.floor(a);
  const w = b - Math.floor(b);
  const z = 2 * u - 1;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(2 * Math.PI * w), r * Math.sin(2 * Math.PI * w), z];
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const kryds = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// sin² af vinklen ved b mellem a og c
function sinKvadrat(a, b, c) {
  const u = sub(a, b), v = sub(c, b);
  const k = dot(u, v) ** 2 / (dot(u, u) * dot(v, v) || 1);
  return 1 - k;
}

// Vinklen (radianer) om bindingen a–b mellem x–a og b–y
export function vridVinkel(px, pa, pb, py) {
  const b1 = sub(pa, px), b2 = sub(pb, pa), b3 = sub(py, pb);
  const n1 = kryds(b1, b2), n2 = kryds(b2, b3);
  const m = kryds(n1, norm(b2));
  return Math.atan2(dot(m, n2), dot(n1, n2));
}

// Ét skridt af modellen (h = modellens tid). Giver den største flytning (til at se, om formen ligger stille).
export function skridt(form, h = MAX_SKRIDT) {
  const s = form.struktur;
  if (!s) return 0;
  const { atomer, bånd, ordener, gruppe, afst, vrid, vægte } = s;
  const n = atomer.length;
  const p = form.pos;
  const F = p.map(() => [0, 0, 0]);
  const add = (i, v, f) => { F[i][0] += v[0] * f; F[i][1] += v[1] * f; F[i][2] += v[2] * f; };

  // 1. Fjedrene. Det atom, man trækker i, trækker ikke resten med (så kan bindingen strækkes og gå i stykker).
  bånd.forEach(([a, b], k) => {
    if (a === form.fast || b === form.fast) return;
    const d = sub(p[b], p[a]);
    const r = len(d) || 1e-6;
    const L = længde(atomer[a].symbol, atomer[b].symbol, ordener[k]);
    const f = FJEDER * (r - L) / r;
    add(a, d, f);
    add(b, d, -f);
  });

  // 2. Retningerne om hvert atom skubber hinanden (energi w₁·w₂/d, d = afstanden mellem enhedsvektorerne)
  for (let c = 0; c < n; c++) {
    const ret = []; // { u, w, nabo, r }
    for (const { m, w } of vægte[c]) {
      const d = sub(p[m], p[c]);
      const r = len(d) || 1e-6;
      ret.push({ u: [d[0] / r, d[1] / r, d[2] / r], w, nabo: m, r });
    }
    for (const x of form.retninger[c]) ret.push({ u: x.v, w: VÆGT[x.slags], fri: x });
    if (ret.length < 2) continue;
    const g = ret.map(() => [0, 0, 0]); // −dE/du for hver retning
    for (let i = 0; i < ret.length; i++) {
      for (let j = i + 1; j < ret.length; j++) {
        const d = sub(ret[i].u, ret[j].u);
        const l = Math.max(len(d), 0.05);
        const f = VINKEL * ret[i].w * ret[j].w / (l * l * l);
        for (let q = 0; q < 3; q++) { g[i][q] += d[q] * f; g[j][q] -= d[q] * f; }
      }
    }
    ret.forEach((x, i) => {
      // Kun den del, der er vinkelret på retningen, drejer den
      const t = dot(g[i], x.u);
      const tv = [g[i][0] - t * x.u[0], g[i][1] - t * x.u[1], g[i][2] - t * x.u[2]];
      if (x.fri) {
        const v = x.fri.v;
        x.fri.v = norm([v[0] + tv[0] * h * 8, v[1] + tv[1] * h * 8, v[2] + tv[2] * h * 8]);
      } else {
        // En nabo flyttes på tværs (kraften / afstanden), og atomet i midten den modsatte vej
        add(x.nabo, tv, 1 / x.r);
        add(c, tv, -1 / x.r);
      }
    });
  }

  // 3. Atomer, der ikke er naboer: svag frastødning med mindst to atomer imellem, og atomer i hver sin gruppe holdes fra hinanden
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const samme = gruppe[i] === gruppe[j];
      if (samme && afst[i][j] < 3) continue;
      if (!samme && (i === form.fast || j === form.fast)) continue; // det atom, man trækker, skubber ikke de andre væk
      const d = sub(p[j], p[i]);
      const r = Math.max(len(d), 0.3);
      let f;
      if (samme) f = FJERN / (r * r * r);
      else {
        if (r > 3.2) continue;
        f = ANDRE * (3.2 - r) / r;
      }
      add(i, d, -f);
      add(j, d, f);
    }
  }

  // 4. Vrid (regnet med en lille numerisk afledt, der er højst nogle få)
  for (const v of vrid) {
    const E = (q) => {
      const phi = vridVinkel(q[0], q[1], q[2], q[3]);
      const c = Math.cos(phi);
      // Ganget med sin² af de to vinkler, så leddet forsvinder, når tre atomer står på linje (dér er vridet ikke defineret,
      // og formen kunne gå i hak). Ved målet er leddet nul, så det flytter ikke vinklerne.
      const s1 = sinKvadrat(q[0], q[1], q[2]);
      const s2 = sinKvadrat(q[1], q[2], q[3]);
      if (v.slags === 'forskudt') return s1 * s2 * VRID_FORSKUDT * (1 + Math.cos(3 * phi));
      return s1 * s2 * (v.slags === 'oo' ? VRID_OO * (c - VRID_MÅL) ** 2 : VRID_FLAD * (1 - c * c));
    };
    const idx = [v.x, v.a, v.b, v.y];
    const q = idx.map((i) => [...p[i]]);
    const e0 = E(q);
    const eps = 1e-4;
    idx.forEach((i, k) => {
      for (let akse = 0; akse < 3; akse++) {
        q[k][akse] += eps;
        const d = (E(q) - e0) / eps;
        q[k][akse] -= eps;
        F[i][akse] -= d;
      }
    });
  }

  // Flyt (overdæmpet: farten følger kraften). Det atom, man trækker i, står fast.
  // En bitte lille rystelse (faste "tilfældige" tal), så formen ikke bliver hængende i en flad form, når alle atomer
  // er trukket ind i samme plan (fx metan som et kvadrat med 90°). Den er for lille til at flytte vinklerne.
  let størst = 0;
  for (let i = 0; i < n; i++) {
    if (i === form.fast) continue;
    let dx = F[i][0] * h, dy = F[i][1] * h, dz = F[i][2] * h;
    const l = Math.hypot(dx, dy, dz);
    const MAX = 0.05; // højst 0,05 Å pr. skridt (så intet skyder af sted)
    if (l > MAX) { dx *= MAX / l; dy *= MAX / l; dz *= MAX / l; }
    størst = Math.max(størst, Math.min(l, MAX));
    form.rystelse = (form.rystelse * 16807 + 11) % 2147483647 || 1;
    const ryst = (q) => ((((form.rystelse >> (q * 7)) & 127) / 127) - 0.5) * 2e-4;
    p[i][0] += dx + ryst(0); p[i][1] += dy + ryst(1); p[i][2] += dz + ryst(2);
  }
  return størst;
}

// Vinklen (grader) mellem a–c og b–c (c i midten)
export function vinkel(form, a, c, b) {
  const u = sub(form.pos[a], form.pos[c]);
  const v = sub(form.pos[b], form.pos[c]);
  return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (len(u) * len(v))))) * 180 / Math.PI;
}

// Til testene: bygger et molekyle, lægger atomerne lidt spredt og lader formen falde på plads
export function formAf(atomer, bånd, skridtAntal = 6000) {
  const form = lavForm();
  atomer.forEach((_, i) => { form.pos[i] = tilfældigRetning(i * 3 + 1).map((x) => x * 1.2); });
  opdaterStruktur(form, atomer, bånd);
  for (let k = 0; k < skridtAntal; k++) skridt(form);
  return form;
}
