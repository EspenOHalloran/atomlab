// Prøvebilleder af Det sorte hul med fuld grafik (glød) på pc og tablet: forfra, med navne, tæt på, ovenfra og fra siden.
// Brug: node tests/vaerktoejer/sorthul-billeder.mjs [pc|tablet] [fps]   (fps: mål billeder i sekundet i testbrowseren)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('sorthul');
const valg = process.argv.slice(2);
const STØRRELSER = { pc: { viewport: { width: 1280, height: 800 } }, tablet: { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true } };
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
for (const navn of Object.keys(STØRRELSER).filter((n) => !valg.some((v) => v in STØRRELSER) || valg.includes(n))) {
  const fejl = [];
  const page = await (await b.newContext(STØRRELSER[navn])).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 20000 });
  await page.evaluate(() => { const k = atomlabTest.kosmos; k.vælg('sorthul'); k.trykPå('Vis navne'); k.kameraFrem(); });
  // Kameraet: afstand og højde over skivens plan (grader). Drejer ikke af sig selv under billederne.
  const stil = (afstand, højde, vinkel = 0) => page.evaluate(([a, h, v]) => {
    atomlabTest.kosmos.fænomen().kamera(a, h, v);
  }, [afstand, højde, vinkel]);
  const billede = async (fil) => { await page.waitForTimeout(2500); await page.screenshot({ path: `${UD}/${navn}-${fil}.png` }); console.log(navn, fil); };
  await stil(31, 11.3);
  await billede('forfra');
  if (valg.includes('fps')) {
    const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 4000) requestAnimationFrame(f); else r(n / 4); }; requestAnimationFrame(f); }));
    console.log(navn, 'billeder i sekundet (testbrowser, uden grafikkort):', fps, 'skala', await page.evaluate(() => atomlabTest.kosmos.fænomen().linseSkala()));
  }
  await page.evaluate(() => atomlabTest.kosmos.fænomen().maske(false));
  await billede('uden-maske');
  await page.evaluate(() => atomlabTest.kosmos.fænomen().maske(true));
  await page.evaluate(() => atomlabTest.kosmos.trykPå('Vis navne'));
  await billede('navne');
  await page.evaluate(() => atomlabTest.kosmos.trykPå('Vis navne'));
  for (const [fil, a, h] of [['taet', 7.2, 8], ['ovenfra', 30, 50], ['siden', 30, 1.5], ['langt', 120, 11]]) {
    await stil(a, h);
    await billede(fil);
  }
  console.log(navn, 'fejl:', fejl.length ? fejl : 'ingen');
  await page.context().close();
}
await b.close();
