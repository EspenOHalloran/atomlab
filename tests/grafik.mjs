// Fuld grafik (glød og fuld opløsning): De andre tests tegner hurtigt uden glød (se tests/hjaelp.mjs).
// Denne test afprøver gløden på pc og tablet, også når skærmen skifter størrelse, og at der ikke kommer fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('grafik');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, opts] of [['pc', { viewport: { width: 1280, height: 800 } }], ['tablet', { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }]]) {
  const fejl = [];
  const page = await (await b.newContext(opts)).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 20000 });
  tjek(`${navn}: hurtig tegning er slået fra`, await page.evaluate(() => !globalThis.atomlabTestHurtig));
  // Supernovaen lyser meget, så gløden har noget at arbejde med
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('supernova'); k.tryk(0); k.spol(3); k.kameraFrem(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-supernova.png` });
  // Ny størrelse: lærredet og gløden skal følge med
  const [w, h] = [opts.viewport.height, opts.viewport.width];
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(1500);
  const lærred = await page.evaluate(() => { const c = document.getElementById('lærred'); return { w: c.clientWidth, h: c.clientHeight }; });
  tjek(`${navn}: lærredet følger med en ny størrelse`, lærred.w === w && lærred.h === h, JSON.stringify(lærred));
  await page.evaluate(() => { location.hash = '#vaerksted'; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-vaerksted.png` });
  tjek(`${navn}: ingen fejl i konsollen`, fejl.length === 0, fejl.join('\n'));
  await page.context().close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
