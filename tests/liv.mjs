// Liv, fanen Opskriften (L1): DNA-stigens tal (basepar pr. omgang, skridt, diameter, atomer og hydrogenbindinger),
// hvilke par der passer, zoom-rejsen (knapper og zoom ind og ud), opgaverne, "Byg stigen", oprydning ved skærmskift
// og at panelet ikke får en rullebjælke på pc.
// L2 (fra opskrift til protein): koden (64 ord, 3 stop, AUG), HBB (MVHLTPEEK, hele kæden som hos NCBI, seglcellen),
// hvad et skift gør, "Se genet blive læst" til ende, "Læs selv", "Skift et bogstav" og oprydningen.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { lavStige, målStige, passer } from '../js/data/liv/stige.js';
import { DNA_PAR } from '../js/data/liv/dna-atomer.js';
import { parGrund, NIVEAU_IDER, HBB_START, BYG_TRIN } from '../js/data/liv/opskriften.js';
import { KODE, oversæt, aminosyre } from '../js/data/liv/kode.js';
import { HBB } from '../js/data/liv/gener.js';
import { vurderSkift, LÆS_START } from '../js/data/liv/protein.js';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const afst = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// ---------- Tallene (uden browser) ----------
const st = lavStige('ATGCGTACGATCGGATCCTA');
const m = målStige(st);
tjek('ca. 10,5 basepar pr. omgang', Math.abs(m.parPrOmgang - 10.5) < 0.1, m.parPrOmgang);
tjek('ca. 0,34 nm pr. trin', Math.abs(m.skridt - 3.4) < 0.1, m.skridt);
tjek('diameter ca. 2 nm', m.diameter > 19 && m.diameter < 21, m.diameter);
const tæl = (p) => [p.atomer.length, p.atomer.filter((a) => a[0] !== 'H').length, p.hbånd.length];
tjek('A–T: 64 atomer, 41 uden H, 2 hydrogenbindinger', String(tæl(DNA_PAR.AT)) === '64,41,2' && String(tæl(DNA_PAR.TA)) === '64,41,2', tæl(DNA_PAR.AT));
tjek('G–C: 63 atomer, 41 uden H, 3 hydrogenbindinger', String(tæl(DNA_PAR.GC)) === '63,41,3' && String(tæl(DNA_PAR.CG)) === '63,41,3', tæl(DNA_PAR.GC));
const hb = st.hbånd.map(([h, a]) => afst(st.atomer[h].p, st.atomer[a].p));
tjek('hydrogenbindingerne er 1,6-2,2 Å', hb.every((d) => d > 1.6 && d < 2.2), `${Math.min(...hb)}-${Math.max(...hb)}`);
const bl = st.bånd.map(([a, b]) => afst(st.atomer[a].p, st.atomer[b].p));
tjek('alle bindinger er 0,9-1,7 Å (også mellem trinene)', bl.every((d) => d > 0.9 && d < 1.7), `${Math.min(...bl)}-${Math.max(...bl)}`);
const par = [...'ATGC'].flatMap((a) => [...'ATGC'].map((b) => a + b));
tjek('kun A–T, T–A, G–C og C–G passer', par.filter((p) => passer(p[0], p[1])).join() === 'AT,TA,GC,CG');
const grunde = Object.fromEntries(par.map((p) => [p, parGrund(p[0], p[1])]));
tjek('grundene: to store er for brede, to små for smalle, A–C og G–T har plus mod plus',
  ['AA', 'AG', 'GA', 'GG'].every((p) => grunde[p] === 'bred') && ['TT', 'TC', 'CT', 'CC'].every((p) => grunde[p] === 'smal')
  && ['AC', 'CA', 'GT', 'TG'].every((p) => grunde[p] === 'ladning'), JSON.stringify(grunde));
tjek('stigen er begyndelsen af HBB (ATG GTG CAT …)', HBB_START.length === 30 && HBB_START.startsWith('ATGGTGCAT'));

// L2: koden og genet
const kv = Object.values(KODE);
tjek('koden: 64 ord, 3 stop (UAA, UAG, UGA), 20 aminosyrer, AUG er methionin',
  kv.length === 64 && ['UAA', 'UAG', 'UGA'].every((k) => KODE[k] === '*') && kv.filter((a) => a === '*').length === 3
  && new Set(kv.filter((a) => a !== '*')).size === 20 && KODE.AUG === 'M');
tjek('HBB: de 9 første ord giver MVHLTPEEK', oversæt(HBB.dna.slice(0, 27)).protein === 'MVHLTPEEK');
const hel = oversæt(HBB.dna);
tjek('HBB: hele genet giver NCBI\'s 147 aminosyrer og slutter med stop', hel.protein === HBB.protein && hel.protein.length === 147 && hel.stop === 147 && HBB.dna.length === 444);
const ret = (i, ord) => LÆS_START.slice(0, 3 * i) + ord + LÆS_START.slice(3 * i + 3);
const segl = vurderSkift(LÆS_START, ret(6, 'GTG'), 6);
tjek('GAG → GTG i kodon 7 giver valin (seglcellen)', aminosyre('GTG') === 'V' && segl.type === 'segl' && segl.protein.slice(0, 10) === 'MVHLTPVEKS', segl.type);
tjek('skiftene: GAG → GAA gør ingenting, GAG → TAG er et stop efter 6, ACT → ATT og CCT → GTT skriver LIV',
  vurderSkift(LÆS_START, ret(6, 'GAA'), 6).type === 'tavs' && vurderSkift(LÆS_START, ret(6, 'TAG'), 6).stop === 6
  && vurderSkift(ret(4, 'ATT'), ret(4, 'ATT').slice(0, 15) + 'GTT' + LÆS_START.slice(18), 5).protein.includes('LIV'));

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test`);
await page.evaluate(() => localStorage.clear());
await page.evaluate(() => { location.hash = '#liv'; });
await page.waitForFunction(() => window.atomlabTest?.liv?.aktiv());
const L = (f, ...a) => page.evaluate(([f, a]) => window.atomlabTest.liv[f](...a), [f, a]);
const færdig = () => page.waitForFunction(() => !window.atomlabTest.liv.overgang(), null, { timeout: 30000 });
const fr = () => page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver || {});
await færdig();
tjek('starter ved cellen', (await L('niveau')) === 'celle' && (await page.textContent('#livTitel')) === 'En af dine celler');

// Zoom ind og ud: forbi grænsen kommer næste eller forrige trin
await L('zoomTil', 0.45);
await page.waitForFunction(() => window.atomlabTest.liv.niveau() === 'kerne', null, { timeout: 20000 }).catch(() => {});
tjek('zoom ind fra cellen giver kernen', (await L('niveau')) === 'kerne', await L('niveau'));
await færdig();
await L('zoomTil', 2.05);
await page.waitForFunction(() => window.atomlabTest.liv.niveau() === 'celle', null, { timeout: 20000 }).catch(() => {});
tjek('zoom ud fra kernen giver cellen', (await L('niveau')) === 'celle', await L('niveau'));

// Knapperne: alle fem trin, og stigen toner over i atomerne
for (const id of NIVEAU_IDER) {
  await page.click(`[data-liv-niveau="${id}"]`);
  await færdig();
}
await page.waitForFunction(() => window.atomlabTest.liv.blanding() < 0.1, null, { timeout: 30000 }).catch(() => {});
tjek('Atomerne: kun atomerne vises', (await L('blanding')) < 0.1 && (await L('antal')).kugler > 500, JSON.stringify(await L('antal')));
tjek('hele rejsen klarer opgaven liv-rejse', Boolean((await fr())['liv-rejse']));
await page.click('[data-liv-niveau="stige"]');
await page.waitForFunction(() => window.atomlabTest.liv.blanding() > 0.9, null, { timeout: 30000 }).catch(() => {});
tjek('Stigen: kun båndene og trinene vises', (await L('blanding')) > 0.9, await L('blanding'));
tjek('farverne A, T, G og C står i vinduet', (await page.textContent('#livFarver')).replace(/\s/g, '') === 'ATGC');

// Panelet får ingen rullebjælke på pc (1280 og 1150 px bredt)
for (const w of [1280, 1150]) {
  await page.setViewportSize({ width: w, height: 800 });
  let værst = 0;
  for (const id of NIVEAU_IDER) {
    await L('gåTil', id);
    await page.waitForTimeout(100);
    værst = Math.max(værst, await page.evaluate(() => Math.max(...[...document.querySelectorAll('#liv .side-panel')].map((p) => p.scrollHeight - p.clientHeight))));
  }
  tjek(`ingen rullebjælke i panelerne ved ${w} px`, værst <= 1, værst);
}
await page.setViewportSize({ width: 1280, height: 800 });

// Byg stigen: et forkert par vises rødt og klarer liv-forkert, otte rigtige klarer liv-byg
await page.click('#livBygStart');
const streng = (await L('byg')).streng;
tjek('byggestrengen har 8 baser med alle fire', streng.length === BYG_TRIN && [...'ATGC'].every((x) => streng.includes(x)), streng);
const forkert = { A: 'A', T: 'T', G: 'A', C: 'T' }[streng[0]];
await page.click(`[data-liv-base="${forkert}"]`);
tjek('et forkert par: rødt stykke, ingen nyt trin og opgaven liv-forkert', (await L('markører')) >= 2 && (await L('byg')).bygget === 0 && Boolean((await fr())['liv-forkert']));
const P = { A: 'T', T: 'A', G: 'C', C: 'G' };
for (const x of streng) await page.click(`[data-liv-base="${P[x]}"]`);
tjek('otte rigtige par klarer liv-byg', (await L('byg')).bygget === BYG_TRIN && Boolean((await fr())['liv-byg']));
await page.click('#livBygStop');
tjek('Stop giver HBB-stigen tilbage', (await L('sekvens')) === HBB_START && (await L('byg')) === null);

// L2: "Se genet blive læst" til ende (spolet frem): 147 aminosyrer, foldet, og opgaven liv-protein
const Pr = () => L('protein');
// "Fra opskrift til protein" er en foldeboks i venstre panel (forløb 2, 13. november 2026): foldet sammen første gang
const foldet = !(await page.isVisible('[data-liv-protein="genet"]'));
await page.click('#livProtein > summary');
tjek('"Fra opskrift til protein" er foldet sammen første gang og kan foldes ud', foldet && await page.isVisible('[data-liv-protein="genet"]'));
await page.click('[data-liv-protein="genet"]');
tjek('"Se genet blive læst": aflæsningen, panelet og tidsknappen', (await Pr()).tegning === 'aflæs' && (await page.textContent('#livTitel')) === 'Aflæsningen' && await page.isVisible('#livTid') && !(await page.isVisible('#livByg')));
await L('proteinSpol', 200);
await page.waitForFunction(() => window.atomlabTest.liv.protein().tegning === 'færdig', null, { timeout: 20000 }).catch(() => {});
const p1 = await Pr();
tjek('genet bliver til 147 aminosyrer, der folder sig, og klarer liv-protein', p1.tegning === 'færdig' && p1.kæde === HBB.protein && Boolean((await fr())['liv-protein']), `${p1.tegning} ${p1.kæde.length}`);
await page.click('#livProteinStop');

// "Læs selv": et forkert svar giver ingen aminosyre, ni rigtige klarer liv-læs
await page.click('[data-liv-protein="læs"]');
await page.waitForFunction(() => window.atomlabTest.liv.protein().svar.length === 4, null, { timeout: 20000 });
const p2 = await Pr();
tjek('"Læs selv": kodehjulet er fremme, og der er fire svar med det rigtige (M)', p2.hjul && p2.svar.includes('M') && await page.isVisible('#livHjul'), JSON.stringify(p2.svar));
await L('proteinSvar', p2.svar.find((a) => a !== 'M'));
await L('proteinSpol', 2);
tjek('et forkert svar: kæden er stadig tom, og hjulet viser vejen til AUG', (await Pr()).kæde === '' && (await Pr()).fremhævet === 'AUG');
for (let i = 0; i < 9; i++) {
  await page.waitForFunction((i) => { const p = window.atomlabTest.liv.protein(); return p.venter && p.k === i && p.svar.length === 4; }, i, { timeout: 20000 });
  await L('proteinSvar', 'MVHLTPEEK'[i]);
  await L('proteinSpol', 2);
}
await page.waitForFunction(() => window.atomlabTest.liv.protein().k === 9, null, { timeout: 20000 }).catch(() => {});
tjek('ni rigtige ord giver MVHLTPEEK og klarer liv-læs', (await Pr()).kæde === 'MVHLTPEEK' && Boolean((await fr())['liv-læs']), (await Pr()).kæde);
await page.click('#livProteinStop');

// "Skift et bogstav": seglcellen, et skift, der ikke gør noget, et stop for tidligt og LIV
await page.click('[data-liv-protein="ret"]');
tjek('"Skift et bogstav": 10 ord, start-ordet kan ikke skiftes, ingen tidsknap', (await page.locator('[data-liv-kodon]').count()) === 10 && await page.isDisabled('[data-liv-kodon="0"]') && !(await page.isVisible('#livTid')));
await L('proteinSkift', 6, 1, 'T');
await L('proteinSkift', 6, 1, 'A');
await L('proteinSkift', 6, 2, 'A');
await L('proteinSkift', 6, 0, 'T');
await L('proteinSkift', 4, 1, 'T');
await L('proteinSkift', 5, 0, 'G');
await L('proteinSkift', 5, 1, 'T');
const o = await fr();
tjek('skiftene klarer liv-segl, liv-tavs, liv-stop og liv-skriv', ['liv-segl', 'liv-tavs', 'liv-stop', 'liv-skriv'].every((id) => o[id]), JSON.stringify(Object.keys(o)));
await page.waitForFunction(() => document.getElementById('livTal').textContent.includes('■'), null, { timeout: 5000 }).catch(() => {});
tjek('panelet viser proteinet med stop (■)', (await page.textContent('#livTal')).includes('■'), await page.textContent('#livTal'));
await page.click('#livProteinNulstil');
tjek('"Som i genet" sætter alle bogstaverne tilbage', (await Pr()).dna === LÆS_START);
await page.setViewportSize({ width: 1150, height: 800 });
await page.waitForTimeout(150);
const rul = await page.evaluate(() => Math.max(...[...document.querySelectorAll('#liv .side-panel')].map((p) => p.scrollHeight - p.clientHeight)));
tjek('ingen rullebjælke i panelerne i "Skift et bogstav" ved 1150 px', rul <= 1, rul);
await page.setViewportSize({ width: 1280, height: 800 });
// Et trin i zoom-rejsen stopper L2 og rydder op
await page.click('[data-liv-niveau="stige"]');
await page.waitForTimeout(200);
tjek('en knap i zoom-rejsen stopper L2: hjulet og tidsknappen er væk, Byg stigen er tilbage', (await Pr()).tilstand === null && !(await page.isVisible('#livHjul')) && !(await page.isVisible('#livTid')) && await page.isVisible('#livBygStart'));

// Skærmskift rydder op
await page.click('[data-liv-protein="genet"]');
await page.evaluate(() => { location.hash = '#'; });
await page.waitForTimeout(300);
tjek('menuen: ingen af tegningerne fra Liv er synlige', (await L('synlige')).length === 0, await L('synlige'));
tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
