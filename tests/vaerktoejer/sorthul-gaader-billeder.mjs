// Skærmbilleder af det sorte hul i Kosmos og i Gåderne (trin 1 før og efter gættet) med fuld grafik, pc og telefon på langs.
// Brug: node tests/vaerktoejer/sorthul-gaader-billeder.mjs [mærke]   (mærke fx "foer" eller "efter" i filnavnet)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const mærke = process.argv[2] ?? 'nu';
const UD = process.env.UD ?? billedmappe('sorthul-gaader');
const STØRRELSER = { pc: [1280, 800, false], 'tlf-langs': [844, 390, true] };
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const fejl = [];
for (const [navn, [w, h, touch]] of Object.entries(STØRRELSER)) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push(`${navn} pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push(`${navn}: ${m.text()}`); });
  // Kosmos → Sort hul
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest?.kosmos, null, { timeout: 60000 });
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('sorthul'); k.kameraFrem(); });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: `${UD}/kosmos-${navn}-${mærke}.png` });
  // Gåderne → Sort hul, trin 1 før gættet
  await page.goto(`${ADRESSE}/?test#gaader`);
  await page.waitForFunction(() => window.atomlabTest?.gaader?.skinne?.()?.vist?.(), null, { timeout: 60000 });
  await page.evaluate(() => atomlabTest.gaader.visGåde('sorthul'));
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `${UD}/gaader-${navn}-${mærke}.png` });
  // Efter gættet (kurven under hullet)
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${UD}/gaader-gaet-${navn}-${mærke}.png` });
  // Dykket midtvejs
  await page.click('#gaadeTrin .fl-næste');
  await page.waitForTimeout(Number(process.env.DYK ?? 1500));
  await page.screenshot({ path: `${UD}/gaader-dyk-${navn}-${mærke}.png` });
  await ctx.close();
  console.log(navn, 'færdig');
}
await b.close();
console.log(fejl.length ? `Fejl:\n${fejl.join('\n')}` : 'Ingen fejl');
