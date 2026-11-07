// Molekyler (js/data/molekyler.js): Byttebørsens regnestykke, ladningerne for alle par, ionernes størrelse og
// energien for ionparret. Kører uden browser. Tallene står med kilder i docs/fakta-molekyler.md (afsnit 1 og 7).
import * as M from '../js/data/molekyler.js';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const nær = (a, b, tol) => Math.abs(a - b) <= tol;
const nacl = M.PAR.nacl;

// Tallene fra kilderne
tjek('Na: ioniseringsenergi 5,14 eV', nær(M.tagEnergi('Na'), 5.139, 0.001));
tjek('Cl: elektronaffinitet 3,61 eV', nær(M.giveEnergi('Cl'), 3.613, 0.001));
tjek('Mg²⁺ koster 22,68 eV (7,65 + 15,04)', nær(M.tagEnergi('Mg', 2), 22.68, 0.01));
tjek('Ca²⁺ koster 17,98 eV (6,11 + 11,87)', nær(M.tagEnergi('Ca', 2), 17.98, 0.01));
tjek('O²⁻: den 2. elektron koster (fælde 12)', M.STOFFER.O.ea[1] < 0 && M.giveEnergi('O', 2) < 0);
tjek('Li og Na: den 2. elektron koster mindst 9 gange mere end den 1.', ['Li', 'Na'].every((s) => M.STOFFER[s].ie[1] > 9 * M.STOFFER[s].ie[0]));

// Regnestykket: det koster ved Na → Cl, og der er gevinst, når ionerne mødes
const fri = M.regnskab(nacl, 'fri', 20);
const flyttetLangt = M.regnskab(nacl, 'flyttet', 1e6);
const mødt = M.regnskab(nacl, 'flyttet', nacl.r0);
tjek('hjemme: regnskabet er 0', M.regnskab(nacl, 'hjemme', 20).iAlt === 0);
tjek(`fri elektron: det koster 5,14 eV (${fri.iAlt.toFixed(2)})`, nær(fri.iAlt, -5.139, 0.001) && fri.give === 0);
tjek(`Na → Cl langt fra hinanden: koster 1,53 eV (${flyttetLangt.iAlt.toFixed(3)})`, nær(flyttetLangt.iAlt, -1.53, 0.01));
tjek(`Na⁺ og Cl⁻ mødt: gevinst 4,26 eV fra atomerne (OpenStax) (${mødt.iAlt.toFixed(3)})`, nær(mødt.iAlt, 4.26, 0.001));
tjek(`tiltrækningen ved mødet: ca. 5,8 eV (${mødt.træk.toFixed(2)})`, nær(mødt.træk, 5.79, 0.01));
tjek('delene lægger sammen', nær(mødt.tage + mødt.give + mødt.træk, mødt.iAlt, 1e-12));

// Harpunen: regnskabet går over nul ved ca. 9,4 Å
const h = M.harpunAfstand('Na', 'Cl');
tjek(`harpunen ved ca. 9,4 Å (${h.toFixed(2)})`, nær(h, 9.43, 0.05));
tjek('lige uden for harpunen: i minus, lige inden for: i plus',
  M.regnskab(nacl, 'flyttet', h + 0.2).iAlt < 0 && M.regnskab(nacl, 'flyttet', h - 0.2).iAlt > 0);

// Ionparret: bunden ligger ved r0, kraften er nul dér, de trækker længere ude og skubber længere inde
let bund = null;
for (let r = 1.8; r < 6; r += 0.0005) { const e = M.ionparEnergi(nacl, r); if (!bund || e < bund[1]) bund = [r, e]; }
tjek(`bunden ligger ved 2,36 Å (${bund[0].toFixed(3)})`, nær(bund[0], 2.36, 0.002));
tjek('kraften er nul ved r0', nær(M.ionparKraft(nacl, nacl.r0), 0, 1e-9));
tjek('de trækker i hinanden længere ude', [2.6, 4, 9.4, 20].every((r) => M.ionparKraft(nacl, r) > 0));
tjek('de skubber tæt på', [2.0, 2.2, 2.3].every((r) => M.ionparKraft(nacl, r) < 0));
tjek('kraften (træk) er hældningen af energien', [2.2, 2.5, 4, 9].every((r) => nær((M.ionparEnergi(nacl, r + 1e-5) - M.ionparEnergi(nacl, r - 1e-5)) / 2e-5, M.ionparKraft(nacl, r), 1e-4 + 1e-5 * Math.abs(M.ionparKraft(nacl, r)))));

// Ladningerne for alle par (M1b): summen er 0
const PARRENE = [['Na', 'Cl', 1], ['Li', 'F', 1], ['Mg', 'O', 1], ['Ca', 'Cl', 2]];
for (const [metal, ikke, n] of PARRENE) {
  const q = M.STOFFER[metal].ladning + n * M.STOFFER[ikke].ladning;
  tjek(`${metal} + ${n > 1 ? n + ' ' : ''}${ikke}: ladningerne går lige op`, q === 0);
  tjek(`${metal} og ${ikke} bytter elektroner`, M.bytter(metal, ikke));
}
tjek('Na + Na bytter ikke', !M.bytter('Na', 'Na'));
tjek('Na + Na koster 4,59 eV at flytte en elektron', nær(M.tagEnergi('Na') - M.giveEnergi('Na'), 4.59, 0.01));

// Skallerne: metallet mister den yderste skal, ikkemetallet fylder den op (som en ædelgas)
const ens = (a, b) => JSON.stringify(a) === JSON.stringify(b);
tjek('Na⁺ har 2 · 8', ens(M.ionSkaller('Na'), [2, 8]));
tjek('Cl⁻ har 2 · 8 · 8', ens(M.ionSkaller('Cl'), [2, 8, 8]));
tjek('Mg²⁺ og O²⁻ har 2 · 8', ens(M.ionSkaller('Mg'), [2, 8]) && ens(M.ionSkaller('O'), [2, 8]));
tjek('Li⁺ har 2, F⁻ har 2 · 8, Ca²⁺ har 2 · 8 · 8', ens(M.ionSkaller('Li'), [2]) && ens(M.ionSkaller('F'), [2, 8]) && ens(M.ionSkaller('Ca'), [2, 8, 8]));
for (const s of Object.keys(M.STOFFER)) {
  const sum = M.ionSkaller(s).reduce((a, b) => a + b, 0);
  tjek(`${s}: ionen har ${M.STOFFER[s].nr - M.STOFFER[s].ladning} elektroner`, sum === M.STOFFER[s].nr - M.STOFFER[s].ladning);
}

// Størrelsen: metallerne krymper til ca. halvdelen, ikkemetallerne vokser
for (const s of ['Li', 'Na', 'Mg', 'Ca']) tjek(`${s} krymper (${M.størrelsesForhold(s).toFixed(2)})`, M.størrelsesForhold(s) > 0.4 && M.størrelsesForhold(s) < 0.65);
for (const s of ['F', 'Cl', 'O']) tjek(`${s} vokser (${M.størrelsesForhold(s).toFixed(2)})`, M.størrelsesForhold(s) > 1.5);
tjek('Na⁺ + Cl⁻ = afstanden i saltkrystallen (282 pm)', nær(M.STOFFER.Na.ion + M.STOFFER.Cl.ion, 282, 2));

// ---------- M1b: de andre par, krystallen og opgaverne ----------
// Prisen for at flytte elektronerne langt fra hinanden (ioniseringsenergi minus elektronaffinitet, afsnit 7)
const pris = (id) => { const p = M.PAR[id]; const b = M.byttePris(p, M.iAltElektroner(p)); return b.tage + b.give; };
for (const [id, forventet] of [['nacl', -1.53], ['lif', -1.99], ['mgo', -28.93], ['cacl2', -10.76], ['nana', -4.59]]) {
  tjek(`${id}: at flytte elektronerne koster ${-forventet} eV (${pris(id).toFixed(2)})`, nær(pris(id), forventet, 0.01));
}
tjek('Na → Cl: byttePris passer med flytEnergi', nær(-pris('nacl'), M.flytEnergi('Na', 'Cl'), 1e-12));
// Gitterenergierne (Shriver & Atkins, CaCl₂ med Born-Haber) og vejen fra frie atomer til krystallen
for (const [id, gitter, gevinst] of [['nacl', 8.15, 6.6], ['lif', 10.7, 8.9], ['mgo', 39.3, 10.3], ['cacl2', 23.4, 12.6]]) {
  const p = M.PAR[id];
  tjek(`${id}: gitterenergien er ca. ${gitter} eV (${M.gitterEnergi(p).toFixed(2)})`, nær(M.gitterEnergi(p), gitter, 0.06));
  // Afsnit 7 regner "fra atomer til krystal" med Born-Haber (enthalpier). Gitter minus prisen må højst afvige ca. 2,5 %.
  tjek(`${id}: fra atomer til krystal ca. +${gevinst} eV (${M.krystalGevinst(p).toFixed(2)})`, M.krystalGevinst(p) > 0 && Math.abs(M.krystalGevinst(p) - gevinst) <= 0.025 * gevinst + 0.01);
}
tjek('Mg + O koster mest, men giver også mest i krystallen', pris('mgo') < pris('cacl2') && M.gitterEnergi(M.PAR.mgo) > M.gitterEnergi(M.PAR.cacl2));
// O²⁻: Den anden elektron koster, når den lander (fælde 12)
{
  const p = M.PAR.mgo;
  const fri = M.byttePris(p, 1, true);
  const landet = M.byttePris(p, 2);
  tjek('Mg + O: regnskabet falder, når den 2. elektron lander hos O⁻', landet.tage + landet.give < fri.tage + fri.give);
  tjek('Mg + O: den første elektron giver noget tilbage (+1,46 eV)', nær(M.byttePris(p, 1).give, 1.461, 0.001));
}
// Ladningerne går op: metallet giver lige så mange elektroner, som ikkemetallerne tager
for (const id of M.PAR_RÆKKE) {
  const p = M.PAR[id];
  const n = M.iAltElektroner(p);
  if (p.bytter === false) {
    tjek('Na + Na: én elektron (ingen ionbinding, de bytter ikke)', n === 1 && !p.gitter && !p.krystal && !M.bytter('Na', 'Na'));
    continue;
  }
  tjek(`${id}: metallet giver ${n} (ladning +${M.STOFFER[p.metal].ladning}), hvert ikkemetal tager ${p.hver}`,
    M.STOFFER[p.metal].ladning === n && -M.STOFFER[p.ikkemetal].ladning === p.hver && M.bytter(p.metal, p.ikkemetal));
  tjek(`${id}: fordelingen fylder ét atom ad gangen`, ens(M.fordeling(p, n), Array(p.tagere).fill(p.hver)) && M.fordeling(p, 0).every((k) => k === 0));
}
tjek('Ca + 2 Cl: den første elektron til det første chloratom', ens(M.fordeling(M.PAR.cacl2, 1), [1, 0]));
tjek('ionSkaller undervejs: Mg⁺ 2 · 8 · 1, O⁻ 2 · 7, Na⁻ 2 · 8 · 2', ens(M.ionSkaller('Mg', -1), [2, 8, 1]) && ens(M.ionSkaller('O', 1), [2, 7]) && ens(M.ionSkaller('Na', 1), [2, 8, 2]));
// Plus og minus langt fra hinanden (punktladninger)
tjek('ladningsTræk: +1 og −1 i 2,36 Å trækker med 6,10 eV', nær(M.ladningsTræk([{ q: 1, x: 0, y: 0 }, { q: -1, x: 2.36, y: 0 }]), 6.10, 0.01));
tjek('ladningsTræk: +2 og −2 trækker fire gange så hårdt', nær(M.ladningsTræk([{ q: 2, x: 0, y: 0 }, { q: -2, x: 5, y: 0 }]), 4 * M.KE / 5, 1e-9));
tjek('ladningsTræk: ens ladninger skubber, neutrale tæller ikke', M.ladningsTræk([{ q: -1, x: 0, y: 0 }, { q: -1, x: 3, y: 0 }]) < 0 && M.ladningsTræk([{ q: 0, x: 0, y: 0 }, { q: -1, x: 3, y: 0 }]) === 0);
// Måleren kan vise alt, hvad der sker undervejs
for (const id of M.PAR_RÆKKE) {
  const p = M.PAR[id];
  const sk = M.målerSkala(p);
  const værdier = [];
  for (let k = 0; k < M.iAltElektroner(p); k++) for (const [n, fri] of [[k, true], [k + 1, false]]) { const b = M.byttePris(p, n, fri); værdier.push(b.tage + b.give); }
  if (p.gitter) værdier.push(M.krystalGevinst(p));
  tjek(`${id}: måleren går til ±${sk} eV og kan vise alt`, værdier.every((x) => Math.abs(x) <= sk) && sk <= 31);
}
// Krystallerne: terningemønstret (seks naboer med modsat ladning) og rutil (CaCl₂: 6 og 3)
const naboer = (pladser, p, d) => pladser.filter((q) => q !== p && Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z) < d * 1.08);
for (const id of ['nacl', 'lif', 'mgo']) {
  const p = M.PAR[id];
  const pl = M.krystalPladser(p, 6);
  const d = (M.STOFFER[p.metal].ion + M.STOFFER[p.ikkemetal].ion) / 100;
  const inde = pl.filter((q) => Math.max(Math.abs(q.x), Math.abs(q.y), Math.abs(q.z)) < d * 2);
  tjek(`${id}: 216 ioner, lige mange af hver`, pl.length === 216 && pl.filter((q) => q.metal).length === 108);
  tjek(`${id}: hver ion inde i krystallen har seks naboer med modsat ladning`, inde.length > 0 && inde.every((q) => { const n = naboer(pl, q, d); return n.length === 6 && n.every((x) => x.metal !== q.metal); }));
}
{
  const p = M.PAR.cacl2;
  const pl = M.krystalPladser(p);
  const d = (M.STOFFER.Ca.ion + M.STOFFER.Cl.ion) / 100;
  const ca = pl.filter((q) => q.metal);
  tjek(`cacl2: ${pl.length} ioner, en Ca for hver to Cl`, pl.length <= 300 && 2 * ca.length === pl.length - ca.length);
  const inde = pl.filter((q) => Math.hypot(q.x, q.y, q.z) < 4);
  tjek('cacl2: Ca²⁺ inde i krystallen har seks Cl⁻', inde.filter((q) => q.metal).length > 0 && inde.filter((q) => q.metal).every((q) => naboer(pl, q, d).filter((x) => !x.metal).length === 6));
  tjek('cacl2: Cl⁻ inde i krystallen har tre Ca²⁺', inde.filter((q) => !q.metal).length > 0 && inde.filter((q) => !q.metal).every((q) => naboer(pl, q, d).filter((x) => x.metal).length === 3));
  let mindst = Infinity;
  for (const a of pl) for (const b of pl) if (a !== b && !a.metal && !b.metal) mindst = Math.min(mindst, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
  tjek(`cacl2: Cl⁻-ionerne overlapper ikke (${mindst.toFixed(2)} Å)`, mindst >= 2 * M.STOFFER.Cl.ion / 100);
  const mid = pl.reduce((s, q) => s + q.x + q.y + q.z, 0) / pl.length;
  tjek('cacl2: krystallen står i midten', nær(mid, 0, 1e-9));
}
// Opgaverne: én for hvert par
tjek('fem opgaver, én for hvert par', M.OPGAVER_BYTTE.length === M.PAR_RÆKKE.length && M.PAR_RÆKKE.every((id) => M.OPGAVER_BYTTE.some((o) => o.par === id && o.id === `bytte-${id}`)));
tjek('opgaverne har titel, tip og fakta', M.OPGAVER_BYTTE.every((o) => o.titel && o.tip && o.fakta));

console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
