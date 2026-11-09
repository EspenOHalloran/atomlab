// Liv, fanen Opskriften (L1): DNA-stigens tal (basepar pr. omgang, skridt, diameter, atomer og hydrogenbindinger),
// hvilke par der passer, zoom-rejsen (knapper og zoom ind og ud), opgaverne, "Byg stigen", oprydning ved skærmskift
// og at panelet ikke får en rullebjælke på pc.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { lavStige, målStige, passer } from '../js/data/liv/stige.js';
import { DNA_PAR } from '../js/data/liv/dna-atomer.js';
import { parGrund, NIVEAU_IDER, HBB_START, BYG_TRIN } from '../js/data/liv/opskriften.js';

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

// Skærmskift rydder op
await page.evaluate(() => { location.hash = '#'; });
await page.waitForTimeout(300);
tjek('menuen: ingen af tegningerne fra Liv er synlige', (await L('synlige')).length === 0, await L('synlige'));
tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
