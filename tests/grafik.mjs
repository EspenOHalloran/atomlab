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
  // Shaderen til Det sorte hul tegner langsomt i testbrowseren (ca. 1,5 billeder i sekundet på pc, langsommere, når to
  // tests kører samtidig), så et skærmbillede kan tage over 30 sekunder
  page.setDefaultTimeout(120000);
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 20000 });
  tjek(`${navn}: hurtig tegning er slået fra`, await page.evaluate(() => !globalThis.atomlabTestHurtig));
  // Supernovaen lyser meget, så gløden har noget at arbejde med
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('supernova'); k.trykPå('eksplodere'); k.spol(3); k.kameraFrem(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-supernova.png` });
  // Sort hul: skyggen skal være sort, også med glød (gløden bredte før lyset fra gassen ind over den, og gør det stadig,
  // når skiven lyser op)
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
  // Lysbøjningen (js/kosmos/linse.js): skyggens kant sidder ved √27 M, og den side af skiven, der kommer mod os, er lysere.
  // Kameraet står fast 31 enheder væk og 11,3° over skiven. Skiven drejer mod uret set ovenfra, så venstre side kommer mod os.
  await page.evaluate(() => atomlabTest.kosmos.fænomen().kamera(31, 11.3, 0));
  await page.waitForTimeout(2500);
  const sk = await page.evaluate(() => atomlabTest.kosmos.fænomen().skygge());
  const hel = await page.screenshot();
  const måling = await page.evaluate(async ([b64, sk]) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const g = new OffscreenCanvas(img.width, img.height).getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    const lys = (x, y) => { const i = (Math.round(y) * img.width + Math.round(x)) * 4; return (d[i] + d[i + 1] + d[i + 2]) / 3; };
    // Den første lyse pixel ud fra midten: op, op til venstre og op til højre (nedad går skiven hen foran skyggen)
    const kant = [90, 135, 45].map((v) => {
      const a = (v * Math.PI) / 180;
      for (let r = 0; r < sk.r * 1.5; r += 0.5) if (lys(sk.x + Math.cos(a) * r, sk.y - Math.sin(a) * r) > 12) return r / sk.r;
      return null;
    });
    const felt = (cx, cy) => { let s = 0, n = 0; for (let y = cy - 10; y <= cy + 10; y++) for (let x = cx - 10; x <= cx + 10; x++) { s += lys(x, y); n++; } return s / n; };
    return { kant, venstre: felt(sk.x - 1.7 * sk.r, sk.y), højre: felt(sk.x + 1.7 * sk.r, sk.y) };
  }, [hel.toString('base64'), sk]);
  tjek(`${navn}: skyggens kant sidder ved √27 M (± 5 %) op og skråt op`, måling.kant.every((k) => k !== null && Math.abs(k - 1) < 0.05), `${JSON.stringify(måling.kant)} radius ${sk.r.toFixed(1)}`);
  tjek(`${navn}: den side af skiven, der kommer mod os, er mindst 2 gange lysere`, måling.venstre > 2 * måling.højre, `${måling.venstre.toFixed(1)} mod ${måling.højre.toFixed(1)}`);
  // Dynamisk opløsning: testbrowseren er langsom, så opløsningen skal gå ned, når den er slået til
  const skala = await page.evaluate(() => atomlabTest.kosmos.fænomen().linseSkala());
  await page.evaluate(() => atomlabTest.kosmos.fænomen().dynamisk(true));
  await page.waitForFunction((s) => atomlabTest.kosmos.fænomen().linseSkala() < s, skala, { timeout: 60000, polling: 500 }).catch(() => {});
  tjek(`${navn}: den dynamiske opløsning går ned, når det går langsomt`, (await page.evaluate(() => atomlabTest.kosmos.fænomen().linseSkala())) < skala);
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
