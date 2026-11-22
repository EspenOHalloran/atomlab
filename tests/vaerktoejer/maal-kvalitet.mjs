// Kvalitetstrinnet i de tunge skærme (21. november 2026): måler med fuld grafik på en tablet (devicePixelRatio 2)
// 1) nye shadere og ryk, når man trykker "Lad stjernen eksplodere" i Kosmos → Supernova, og
// 2) skiftet Basis → Høj (nye shadere og tiden for billederne lige efter skiftet) i Værkstedet og Kosmos.
// Brug: node tests/vaerktoejer/maal-kvalitet.mjs. Tallene er fra testbrowseren uden grafikkort: kun til at sammenligne
// før og efter (antallet af nye shadere er det vigtigste, for det er det samme på en rigtig tablet).
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const page = await (await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })).newPage();
page.setDefaultTimeout(180000);
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
const programmer = () => page.evaluate(() => atomlabMålerTest.tallene().programmer);
// Tiden for de næste n billeder (ms), målt med requestAnimationFrame i siden
const billeder = (n) => page.evaluate((n) => new Promise((ok) => {
  const t = [];
  let sidst = performance.now();
  const f = (nu) => { t.push(Math.round(nu - sidst)); sidst = nu; if (t.length < n) requestAnimationFrame(f); else ok(t); };
  requestAnimationFrame(f);
}), n);
const ud = {};

// 1) Supernova
await page.goto(`${ADRESSE}/?test&maal#kosmos`);
await page.waitForFunction(() => window.atomlabTest?.kosmos && window.atomlabMålerTest, null, { timeout: 60000, polling: 200 });
await page.evaluate(() => atomlabTest.kosmos.vælg('supernova'));
await page.waitForTimeout(8000); // shaderne til det, der ses, (og evt. dem, der laves på forhånd) bliver færdige
const før = await programmer();
const rykFør = await page.evaluate(() => atomlabMålerTest.antalRyk());
await page.evaluate(() => atomlabTest.kosmos.trykPå('eksplodere'));
const efterTryk = await billeder(4);
await page.waitForTimeout(6000); // stjernen sprænges efter 3 s
const efter = await programmer();
const rykListe = await page.evaluate((n) => atomlabMålerTest.tekst().split('\n').filter((l) => /shader/.test(l)).slice(-6), rykFør);
ud.supernova = { programmerFør: før, nyeShadereVedEksplosionen: efter - før, billederEfterTryk: efterTryk, shaderLinjer: rykListe };

// 2) Skiftet Basis → Høj (i Kosmos og i Værkstedet)
for (const skærm of ['kosmos', 'vaerksted']) {
  if (skærm !== 'kosmos') {
    await page.evaluate((s) => { location.hash = '#' + s; }, skærm);
    await page.waitForFunction(() => atomlabTest.klar(), null, { timeout: 60000 });
    await page.waitForTimeout(6000);
  }
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('basis'));
  await page.waitForTimeout(3000);
  const roligt = await billeder(6);
  const p0 = await programmer();
  await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('høj'));
  const skift = await billeder(4);
  ud[`skift-${skærm}`] = { roligt, skift, nyeShadere: (await programmer()) - p0 };
}
ud.fejl = fejl;
await b.close();
console.log(JSON.stringify(ud, null, 1));
