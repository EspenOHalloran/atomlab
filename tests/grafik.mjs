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
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('supernova'); k.trykPå('eksplodere'); k.spol(3); k.kameraFrem(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-supernova.png` });
  // Sort hul: skyggen skal være sort, også med glød (gløden bredte før lyset fra gassen ind over den)
  const trin = await page.evaluate(() => atomlabTest.kosmos.efterbehandling());
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('sorthul'); k.trykPå('Vis navne'); k.kameraFrem(); }); // uden navne
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${UD}/${navn}-sorthul.png` });
  const r = await page.evaluate(() => { const b = document.getElementById('kosmosVindue').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  // Lidt over midten, så gassen foran skyggen ikke er med
  // Lysstyrken i et lille felt lidt over midten (så gassen foran skyggen ikke er med). Billedet læses i siden.
  const felt = await page.screenshot({ clip: { x: r.x - 8, y: r.y - 38, width: 16, height: 16 } });
  const lys = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const g = new OffscreenCanvas(img.width, img.height).getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    return sum / (d.length / 4);
  }, felt.toString('base64'));
  tjek(`${navn}: det sorte hul er sort i midten med glød`, lys < 20, `lysstyrke ${lys.toFixed(1)}`);
  tjek(`${navn}: sort hul lægger to trin til efterbehandlingen`, (await page.evaluate(() => atomlabTest.kosmos.efterbehandling())) === trin + 2);
  await page.evaluate(() => atomlabTest.kosmos.vælg('supernova'));
  tjek(`${navn}: trinnene fjernes igen, når man skifter fænomen`, (await page.evaluate(() => atomlabTest.kosmos.efterbehandling())) === trin);
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
