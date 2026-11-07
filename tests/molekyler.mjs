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

console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
