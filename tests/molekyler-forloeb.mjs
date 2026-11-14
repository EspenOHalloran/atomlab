// Molekyler: forløbet "Når atomer mødes" (Serie 1 nr. 3, drejebogen i docs/drejebog-molekyler.md): teksterne holder
// skabelonens grænser, det starter første gang med kun scenen og linjen og linket til "Dit første atom", trin 1 med musen
// (H₂) og hånden, trin 2 (H kun på O med vinket, vandet drejet forfra, det tredje H skubbes væk), trin 3 (natrium trækkes
// hen til chlor, elektronen hopper langsomt med et blink), trin 4 (krystallen), "Det så du", opgaverne løst uden piller,
// vejen til knaldgassen, ✓ i "Din fremgang" og knappen i hjælpen. Skærmbilleder af trin 2-4 (pc og tablet på højkant).
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { MØDES } from '../js/data/forloeb/molekyler.js';
import { ORDBOG } from '../js/data/ordbog.js';
const UD = billedmappe('molekyler-forloeb');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne ----------
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const lange = MØDES.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const ider = new Set(ORDBOG.map((o) => o.id));
const mangler = MØDES.trin.flatMap((t) => t.ord ?? []).filter((id) => !ider.has(id));
tjek('teksterne: 4 trin med gæt, Spørg ≤ ca. 15 ord, Så ≤ ca. 20 ord, højst to fagord, de står i Ordbogen (også krystal), og kernesætningen siger "dele eller give"',
  MØDES.trin.length === 4 && MØDES.trin.every((t) => t.gæt) && !lange.length && !mangler.length && ider.has('krystal') && /dele eller give/.test(MØDES.kernesætning),
  JSON.stringify({ lange: lange.map((t) => t.id), mangler }));

async function side(vp, opts = {}) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const fejl = [];
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test&forloebstart#molekyler`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.atomlabTest?.molekyler?.forløb.kører() === 'molekyler', null, { timeout: 20000 });
  return { ctx, page, fejl };
}
const { ctx, page, fejl } = await side({ width: 1280, height: 800 });
const T = (f, a) => page.evaluate(f, a);
const F = () => T(() => { const f = atomlabTest.molekyler.forløb; return { kører: f.kører(), trin: f.trin(), fase: f.fase() }; });
const fase = (f, p = page) => p.waitForFunction((x) => atomlabTest.molekyler.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const synlig = (sel, p = page) => p.evaluate((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
const linje = (p = page) => p.evaluate(() => document.querySelector('#molekyler .forløb-linje')?.textContent ?? '');
const G = (f, ...a) => T(([f, a]) => atomlabTest.molekyler.byg[f](...a), [f, a]);
const B = (f, ...a) => T(([f, a]) => atomlabTest.molekyler.bytte[f](...a), [f, a]);
const stille = () => page.waitForFunction(() => atomlabTest.molekyler.byg.kameraStille(), null, { timeout: 15000, polling: 100 }).catch(() => {});
async function træk(fra, til) {
  await page.mouse.move(fra.x, fra.y);
  await page.mouse.down();
  await page.mouse.move((fra.x + til.x) / 2, (fra.y + til.y) / 2, { steps: 6 });
  await page.mouse.move(til.x, til.y, { steps: 6 });
  await page.mouse.up();
}
const gæt = async (i = 0) => { await page.click(`#molekyler .fl-gæt[data-gaet="${i}"]`); await fase('gør'); };

// ---------- Første gang: kun scenen og linjen, og linket til "Dit første atom" ----------
const start = { venstre: await synlig('#bygPanel'), højre: await synlig('#bygInfo'), linje: await synlig('#molekyler .forløb-linje'), før: await synlig('#molekyler .fl-før'), ...(await F()) };
tjek('starter første gang i "Del elektroner" med kun scenen og linjen, og linket "Tag \'Dit første atom\' først" står der',
  start.trin === 'h2' && start.fase === 'gæt' && !start.venstre && !start.højre && start.linje && start.før && await T(() => atomlabTest.molekyler.måde()) === 'byg', JSON.stringify(start));

// ---------- Trin 1: hånden, og træk det ene H hen til det andet ----------
await gæt(1);
await stille();
const hånd = await page.waitForFunction(() => atomlabTest.molekyler.hånd(), null, { timeout: 14000, polling: 250 }).then(() => true, () => false);
await træk(await G('atomPå', 1), await G('atomPå', 0));
await fase('så');
const t1 = { hånd, væk: !(await T(() => atomlabTest.molekyler.hånd())), grupper: await G('grupper'), linje: await linje() };
tjek('trin 1: hånden viser trækket efter ca. 8 s, et træk med musen giver H₂, hånden forsvinder, og Så siger "molekyle"',
  t1.hånd && t1.væk && t1.grupper.length === 1 && t1.grupper[0].navn === 'Hydrogen' && /molekyle: H₂/.test(t1.linje), JSON.stringify(t1));

// ---------- Trin 2: H kun på O, vandet drejet forfra, og det tredje H skubbes væk ----------
await page.click('#molekyler .fl-næste');
await gæt(1);
await G('spol', 1);
await stille();
await træk(await G('atomPå', 1), await G('atomPå', 2)); // H på H
await page.waitForTimeout(500);
const hh = { bånd: (await G('bånd')).length, linje: await linje() };
await T(() => atomlabTest.molekyler.forløb.visMigNu());
await page.click('#molekyler .fl-vismig');
await fase('så');
await page.waitForFunction(() => !atomlabTest.molekyler.byg.vandForfra || atomlabTest.molekyler.byg.vandForfra() > 0.97 && !atomlabTest.molekyler.byg.drejer?.(), null, { timeout: 10000, polling: 100 }).catch(() => {});
await page.waitForTimeout(600);
const forfra = await G('vandForfra');
await page.screenshot({ path: `${UD}/trin2-pc.png` });
await stille();
const fri = (await G('grupper')).find((g) => g.atomer.length === 1).atomer[0];
const o = (await G('atomer')).indexOf('O');
await træk(await G('atomPå', fri), await G('atomPå', o));
await page.waitForTimeout(600);
const t2 = { hh, forfra, linje: await linje(), vand: (await G('grupper')).some((g) => g.navn === 'Vand'), bånd: (await G('bånd')).length };
tjek('trin 2: H på H skubbes væk med "Prøv at sætte det på oxygen", vandet drejes forfra, og det tredje H skubbes væk med "ikke flere elektroner uden partner"',
  t2.hh.bånd === 0 && /sætte det på oxygen/.test(t2.hh.linje) && t2.forfra > 0.9 && /ikke flere elektroner uden partner/.test(t2.linje) && t2.vand && t2.bånd === 2,
  JSON.stringify(t2));

// ---------- Trin 3: træk natrium hen til chlor, elektronen hopper langsomt med et blink ----------
await page.click('#molekyler .fl-næste');
await page.waitForFunction(() => atomlabTest.molekyler.måde() === 'bytte' && atomlabTest.molekyler.bytte.tilstand() === 'nærmer', null, { timeout: 10000 });
await gæt(1);
await page.waitForFunction(() => atomlabTest.molekyler.bytte.kameraStille(), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(400);
const r0 = await B('afstand');
const na = await B('natriumPå');
const cl = await B('chlorPå');
await page.mouse.move(na.x, na.y);
await page.mouse.down();
await page.mouse.move(na.x + (cl.x - na.x) * 0.25, na.y, { steps: 5 });
const midt = { r: await B('afstand'), tilstand: await B('tilstand') };
await page.mouse.move(na.x + (cl.x - na.x) * 0.7, na.y, { steps: 8 });
await page.mouse.up();
const hop = await page.waitForFunction(() => atomlabTest.molekyler.bytte.tilstand() === 'hopper', null, { timeout: 5000, polling: 50 }).then(() => true, () => false);
await page.screenshot({ path: `${UD}/trin3-hop-pc.png` });
const blink = await page.waitForFunction(() => atomlabTest.molekyler.bytte.blink(), null, { timeout: 5000, polling: 50 }).then(() => true, () => false);
await fase('så');
await page.waitForTimeout(600);
await page.screenshot({ path: `${UD}/trin3-pc.png` });
const t3 = { r0, midt, hop, blink, ladninger: await B('ladninger'), linje: await linje(), måler: await synlig('#bytteMåler'), regnskab: await synlig('#bytteTal') };
tjek('trin 3: natrium kan trækkes nærmere (kun afstanden), elektronen hopper og blinker, Na⁺ og Cl⁻ samles, og måleren og panelet er skjult',
  t3.r0 > 15 && t3.midt.r < t3.r0 - 1 && t3.midt.tilstand === 'nærmer' && t3.hop && t3.blink && JSON.stringify(t3.ladninger) === '[1,-1]' && /Tæt på hoppede/.test(t3.linje) && !t3.måler && !t3.regnskab,
  JSON.stringify(t3));

// ---------- Trin 4: krystallen, og "Det så du" ----------
await page.click('#molekyler .fl-næste');
await gæt(0);
await page.click('#molekyler .fl-handling[data-knap="krystal"]');
await fase('så');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${UD}/trin4-pc.png` });
const t4linje = await linje();
await page.click('#molekyler .fl-næste');
await fase('slut');
const løst = await T(async () => { const f = await import('./js/fremgang.js'); return ['byg-h2', 'byg-vand', 'bytte-nacl'].map((id) => f.erLøst(id)).concat(f.forløbTaget('molekyler')); });
const slut = { linje: await linje(), veje: await T(() => document.querySelectorAll('#molekyler .fl-vej').length), piller: await T(() => [...document.querySelectorAll('.pille')].filter((p) => p.offsetParent).length), løst, krystal: await B('krystal') };
tjek('trin 4 og "Det så du": krystallen er bygget, Så siger "seks naboer", kernesætningen og tre veje, H₂, vand og salt er løst uden piller, og forløbet er taget',
  slut.krystal?.synlig && /seks naboer/.test(t4linje) && slut.linje.includes(MØDES.kernesætning) && slut.veje === 3 && slut.piller === 0 && løst.every(Boolean), JSON.stringify(slut));

// ---------- Vej 2 (knaldgassen), ✓ i "Din fremgang" og knappen i hjælpen ----------
await page.click('#molekyler .fl-vej[data-vej="1"]');
await page.waitForTimeout(500);
const vej = { kører: (await F()).kører, knald: await T(() => atomlabTest.molekyler.byg.knaldgas.aktiv()), panel: await synlig('#knaldPanel') };
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
await page.click('.menu-fremgang-knap');
const flueben = await T(() => document.querySelector('.fremgang-forløb[data-forloeb="molekyler"]')?.classList.contains('færdig') ?? null);
await page.keyboard.press('Escape');
await T(() => { location.hash = '#molekyler'; });
await page.waitForFunction(() => document.querySelector('#molekyler:not(.skjult)') && atomlabTest.molekyler, null, { timeout: 20000 });
await page.waitForTimeout(400);
const igenSelv = (await F()).kører;
await page.click('#molekylerHjælp');
await page.click('#hjælpMolekylerForløb');
const hjælp = { ...(await F()), måde: await T(() => atomlabTest.molekyler.måde()), før: await synlig('#molekyler .fl-før') };
await page.click('#molekyler .fl-spring');
await page.waitForTimeout(400);
const sprunget = { kører: (await F()).kører, panel: await synlig('#bygPanel') };
tjek('vej 2 åbner knaldgassen, ✓ i "Din fremgang", forløbet starter ikke selv igen, hjælpen starter det, og "Spring over" viser panelerne',
  vej.kører === null && vej.knald && vej.panel && flueben === true && igenSelv === null && hjælp.kører === 'molekyler' && hjælp.måde === 'byg' && hjælp.før && sprunget.kører === null && sprunget.panel,
  JSON.stringify({ vej, flueben, igenSelv, hjælp, sprunget }));
tjek('ingen fejl i konsollen (pc)', !fejl.length, fejl.join(' | '));
await ctx.close();

// ---------- Tablet på højkant: trin 2-4 med "Vis mig" (skærmbilleder) ----------
{
  const { ctx: c2, page: p, fejl: f2 } = await side({ width: 820, height: 1180 }, { hasTouch: true });
  const næste = async () => { await p.click('#molekyler .fl-næste'); };
  const svar = async (i) => { await p.click(`#molekyler .fl-gæt[data-gaet="${i}"]`); await fase('gør', p); };
  const visMig = async () => { await p.evaluate(() => atomlabTest.molekyler.forløb.visMigNu()); await p.click('#molekyler .fl-vismig'); await fase('så', p); };
  await svar(1);
  await visMig();
  await næste();
  await svar(1);
  await visMig();
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${UD}/trin2-tablet.png` });
  await næste();
  await p.waitForFunction(() => atomlabTest.molekyler.måde() === 'bytte', null, { timeout: 10000 });
  await svar(1);
  await visMig();
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${UD}/trin3-tablet.png` });
  await næste();
  await svar(0);
  await p.click('#molekyler .fl-handling[data-knap="krystal"]');
  await fase('så', p);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${UD}/trin4-tablet.png` });
  const linjeR = await p.evaluate(() => document.querySelector('#molekyler .forløb-linje').getBoundingClientRect().toJSON());
  const vindue = await p.evaluate(() => document.getElementById('molekylerVindue').getBoundingClientRect().toJSON());
  tjek('tablet på højkant: trinene kan klares med "Vis mig", linjen er inde på skærmen, og 3D-billedet er stort',
    linjeR.bottom <= 1181 && linjeR.right <= 821 && vindue.height > 400 && !f2.length, JSON.stringify({ linjeR, vindue: vindue.height, f2 }));
  await c2.close();
}

await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
