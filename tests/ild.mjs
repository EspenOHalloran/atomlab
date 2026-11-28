// Ild (Kemi, PR 1): laboratoriet "Bordet" (docs/drejebog-ild.md, afsnit 2). Teksterne holder budgettet, delen og
// verdenen Kemi findes (med Molekyler), delen åbner fra Kemis kort i menuen, flammen står stille under pause, et pust
// slukker lyset og giver røg, tændstikken i røgen tænder lyset gennem røgen, skeen dugger over flammen og bliver sort i den
// gule del, gasbrænderen bliver blå med luft nok, rumstationen giver en halvkugle, glasset og CO₂ slukker, luppen bytter
// atomernes partnere uden at miste nogen, ingen rullebjælke ved 1150, 820 og 560 px, og et skærmskift rydder op.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { PANEL, ILD_KORT, skeZone } from '../js/data/ild.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { SKÆRME, VERDENER } from '../js/skaerme.js';
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne (Node) ----------
const sætninger = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;
const forLange = Object.entries(PANEL).filter(([, p]) => sætninger(p.tekst) > 3 || (p.tal ?? []).length > 2).map(([id]) => id);
const kemi = VERDENER.find((v) => v.id === 'kemi');
tjek('teksterne: panelerne har højst tre sætninger og to tal, de tre kort findes, Ild og Molekyler er i verdenen Kemi mellem Atomer og Liv, og skeens zoner passer',
  !forLange.length && ILD_KORT.length === 3 && ILD_KORT.every((id) => HVORFOR[id]?.svar) && SKÆRME.some((s) => s.id === 'ild' && s.verden === 'kemi')
  && kemi?.dele.join() === 'molekyler,ild' && VERDENER.map((v) => v.id).join().includes('atomer,kemi,liv')
  && skeZone(0, 1.5) === 'over' && skeZone(0, 0.55) === 'gul' && skeZone(0, 0.2) === 'kerne' && skeZone(0, 0.55, { sod: 0 }) === 'blå' && skeZone(3, 0.5) === 'ingen',
  JSON.stringify({ forLange, kemi: kemi?.dele }));

// ---------- I browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);
const I = (f, x) => page.evaluate(f, x); // kort navn til kald på atomlabTest.ild
const tilstand = () => T(() => atomlabTest.ild.tilstand());
const spol = (sek) => T((x) => atomlabTest.ild.spol(x), sek);

await page.goto(`${ADRESSE}/?test#`);
await page.waitForFunction(() => atomlabTest.aktiv?.() === 'menu', null, { timeout: 20000 });
const link = await T(() => Boolean(document.querySelector('.verden[data-verden="kemi"] a.verden-knap[href="#ild"]')));
for (let i = 0; i < 4 && (await T(() => location.hash)) !== '#ild'; i++) {
  await T(() => document.querySelector('a[href="#ild"]').click());
  await page.waitForTimeout(1500);
}
await page.waitForFunction(() => atomlabTest.aktiv() === 'ild' && atomlabTest.ild, null, { timeout: 20000 });
let s = await tilstand();
tjek('Ild er en knap i Kemis kort i menuen, åbner derfra, og et stearinlys brænder på bordet', link && s.synlig && s.flamme === 'lys' && s.lysBrænder && (await T(() => document.getElementById('ildTitel').textContent)) === PANEL.lys.titel, JSON.stringify(s));

// Pause: flammens egen tid står stille
await I(() => atomlabTest.ild.sætPause('pause'));
const t0 = (await T(() => atomlabTest.ild.lysFlamme())).tid;
await page.waitForTimeout(600);
const t1 = (await T(() => atomlabTest.ild.lysFlamme())).tid;
await I(() => atomlabTest.ild.sætPause('spil'));
await page.waitForTimeout(400);
const t2 = (await T(() => atomlabTest.ild.lysFlamme())).tid;
tjek('flammen står stille under pause og blafrer igen bagefter', t0 === t1 && t2 > t1, JSON.stringify([t0, t1, t2]));

// Pust, og tændstikken i røgen: flammen løber ned og tænder lyset
await I(() => { atomlabTest.ild.sætPause('pause'); atomlabTest.ild.sætPause('spil'); });
await I(() => { atomlabTest.ild.sluk('pust'); atomlabTest.ild.spol(1); });
const pust = await tilstand();
await I(() => { const a = atomlabTest.ild; a.vælgVærktøj('tændstik'); a.flytVærktøj(0, 2.4); a.spol(0.2); });
const løb = await tilstand();
await spol(1);
const tændt = await tilstand();
tjek('et pust slukker lyset og giver røg, og tændstikken i røgen over vægen tænder lyset gennem røgen', !pust.lysBrænder && pust.røg > 5 && løb.løber && tændt.lysBrænder && tændt.hændelse === 'gennemRøgen', JSON.stringify({ pust, løb: løb.løber, tændt: tændt.hændelse }));

// Skeen: dug over flammen (som forsvinder, når skeen bliver varm) og sod i den gule del
await I(() => { const a = atomlabTest.ild; a.vælgVærktøj('ske'); a.flytVærktøj(0, 3.5); a.spol(2.5); });
const dug = await tilstand();
const dugPanel = (await T(() => atomlabTest.ild.panel())).titel;
await spol(5);
const varm = await tilstand();
await I(() => { const a = atomlabTest.ild; a.flytVærktøj(0, 0.42 + 2.5 * 0.55); a.spol(1.5); });
const sod = await tilstand();
const sodPanel = await T(() => atomlabTest.ild.panel());
tjek('skeen dugger over flammen, dugget fordamper, når skeen bliver varm, og i den gule del bliver den sort af sod (med temperaturen)',
  dug.ske.zone === 'over' && dug.ske.dug > 0.8 && dugPanel === PANEL.dug.titel && varm.ske.dug < 0.1 && sod.ske.zone === 'gul' && sod.ske.sod > 0.8 && sodPanel.titel === PANEL.sod.titel && /1\.200/.test(JSON.stringify(sodPanel.tal)),
  JSON.stringify({ dug: dug.ske, varm: varm.ske, sod: sod.ske, sodPanel }));

// Rumstationen, glasset og CO₂
await I(() => { const a = atomlabTest.ild; a.vælgVærktøj('ske'); a.sætTyngde(0); a.spol(3); });
const rum = await T(() => ({ f: atomlabTest.ild.lysFlamme(), titel: atomlabTest.ild.panel().titel }));
await I(() => { const a = atomlabTest.ild; a.sætTyngde(1); a.sluk('glas'); a.spol(2); });
const underGlas = await tilstand();
await spol(12);
const glas = await tilstand();
await I(() => { const a = atomlabTest.ild; a.tændSelv(); a.spol(4); });
const igen = await tilstand();
await I(() => { const a = atomlabTest.ild; a.sluk('co2'); a.spol(2.5); });
const co2 = await tilstand();
tjek('rumstationen giver en halvkugle, glasset slukker lyset langsomt, "Tænd lyset" tænder det igen, og CO₂ slukker det',
  rum.f.tyngde < 0.05 && rum.titel === PANEL.rum.titel && underGlas.lysBrænder && underGlas.glas === 1 && !glas.lysBrænder && igen.lysBrænder && igen.glas === 0 && !co2.lysBrænder,
  JSON.stringify({ rum, underGlas: underGlas.lysBrænder, glas: glas.lysBrænder, igen: igen.lysBrænder, co2: co2.lysBrænder }));

// Gasbrænderen: gul med lidt luft, blå med meget, og gassen kan lukkes
await I(() => { const a = atomlabTest.ild; a.vælgFlamme('brænder'); a.spol(1); });
const gul = await T(() => ({ f: atomlabTest.ild.brænderFlamme(), titel: atomlabTest.ild.panel().titel }));
await I(() => { const a = atomlabTest.ild; a.sætLuft(1); a.spol(3); });
const blå = await T(() => ({ f: atomlabTest.ild.brænderFlamme(), titel: atomlabTest.ild.panel().titel }));
await I(() => { const a = atomlabTest.ild; a.sætGas(false); a.spol(1); });
const lukket = await tilstand();
tjek('gasbrænderen er gul med lidt luft, blå med luft nok, og den går ud, når gassen lukkes',
  gul.f.sod > 0.95 && gul.titel === PANEL.brænderLidt.titel && blå.f.sod < 0.05 && blå.titel === PANEL.brænderMeget.titel && !lukket.brænderBrænder,
  JSON.stringify({ gul, blå, lukket: lukket.brænderBrænder }));

// Luppen: tre O₂ til stykket af stearinen, og atomerne bytter partnere (12 atomer før og efter)
await I(() => { const a = atomlabTest.ild; a.vælgFlamme('lys'); a.vælgScene('atomer'); });
const før = await T(() => ({ tal: atomlabTest.ild.atomer.tal(), m: atomlabTest.ild.atomer.molekyler() }));
for (let i = 0; i < 3; i++) await I(() => { atomlabTest.ild.atomer.lægNæste(); atomlabTest.ild.spol(1); });
await spol(2.5);
const efter = await T(() => ({ fase: atomlabTest.ild.atomer.fase(), tal: atomlabTest.ild.atomer.tal(), m: atomlabTest.ild.atomer.molekyler(), titel: atomlabTest.ild.panel().titel }));
tjek('i luppen bliver ethen og tre O₂ til to CO₂ og to H₂O, og der er 2 C, 4 H og 6 O før og efter',
  før.m.join() === 'ethen,o2,o2,o2' && efter.fase === 'færdig' && efter.m.sort().join() === 'co2,co2,vand,vand' && JSON.stringify(før.tal) === JSON.stringify(efter.tal) && efter.tal.O === 6 && efter.titel === PANEL.atomerFærdig.titel,
  JSON.stringify({ før, efter }));
await I(() => atomlabTest.ild.vælgScene('bord'));

// Ingen rullebjælke i panelerne
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const fl of ['lys', 'brænder']) {
    await I((x) => atomlabTest.ild.vælgFlamme(x), fl);
    await page.waitForTimeout(500);
    const p = await T(() => [...document.querySelectorAll('#ild .side-panel')].map((e) => ({ mere: e.classList.contains('mere'), rul: e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible' })));
    rul.push({ w, fl, p });
  }
}
tjek('ingen rullebjælke i panelerne (uden klassen "mere") ved 1150, 820 og 560 px', rul.every((x) => x.p.every((p) => p.mere || !p.rul)), JSON.stringify(rul));

// Et skærmskift rydder op
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ synlig: atomlabTest.ild.tilstand().synlig, opdateres: atomlabTest.ild.opdateres() }));
tjek('et skærmskift rydder op (bordet skjult og ikke opdateret)', !ryddet.synlig && !ryddet.opdateres, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
