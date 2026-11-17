// Billeder af Merkur med fuld grafik og billeder i sekundet (MP1 i docs/drejebog-merkur-pluto.md).
// Kør: node tests/vaerktoejer/merkur.mjs [pc|tablet|tablet-hoejkant|tlf-hoejkant|tlf-langs] [sted ...]
// (billederne lægges i tests/billeder/merkur-fuld/). Stederne: hel (hele planeten fra start), hoej ("Bjergene 10 gange
// højere"), caloris (skråt over Caloris med lav sol fra vest), pol8 og pol16 (skråt ned over Prokofiev ved Nordpolen fra
// ca. 500 km med anisotropi 8 og 16 og Solen 30° oppe: målingen af polen i MP1), polen og polenuden (lige over
// Nordpolen med Solen 30° oppe, med polkortet og uden), sydpol
// (fra 76° S mod Sydpolen, så overgangen til polkortet ved 72-75° ses) og hurtig (efter 10 sekunder med ⏩).
// Uden størrelse: pc og tablet. Uden steder: hel. Mål én browser ad gangen (tjekliste F).
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('merkur-fuld');
const STØRRELSER = { pc: [1280, 800, false], tablet: [1180, 820, true], 'tablet-hoejkant': [768, 1024, true], 'tlf-hoejkant': [390, 844, true], 'tlf-langs': [844, 390, true] };
const arg = process.argv.slice(2);
const navne = arg.filter((a) => STØRRELSER[a]);
const steder = arg.filter((a) => !STØRRELSER[a]);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
for (const navn of navne.length ? navne : ['pc', 'tablet']) {
  const [w, h, touch] = STØRRELSER[navn];
  const s = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch })).newPage();
  const fejl = [];
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  const f = (fn, a) => s.evaluate(fn, a);
  const F = (n, ...a) => f(([n, a]) => atomlabTest.solsystem.fænomen()[n](...a), [n, a]);
  const måling = () => f(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const g = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(g); else r(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(g); }));
  await f(() => atomlabTest.solsystem.vælg('merkur'));
  await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'merkur' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde && Object.keys(atomlabTest.solsystem.fænomen().billeder().hentet.pol).length === 4, null, { timeout: 240000, polling: 200 });
  await s.waitForTimeout(1500);
  for (const sted of steder.length ? steder : ['hel']) {
    if (sted === 'hoej') await f(() => atomlabTest.solsystem.trykPå('Bjergene'));
    if (sted === 'polen' || sted === 'polenuden') {
      await f(() => atomlabTest.solsystem.sætTid('pause'));
      await F('udenPol', sted === 'polenuden');
      await F('solOver', 89, 60, 30, 200);
      await F('kigPå', 89.5, 60, 450, 45, 180);
    }
    if (sted === 'sydpol') {
      await f(() => atomlabTest.solsystem.sætTid('pause'));
      await F('solOver', -78, 0, 25, 30);
      await F('kigPå', -76, 0, 700, 30, 0);
    }
    if (['caloris', 'pol8', 'pol16'].includes(sted)) await f(() => atomlabTest.solsystem.sætTid('pause')); // (ellers sætter tiden Solen tilbage)
    if (sted === 'caloris') {
      await F('solOver', 31.6, 162, 12, 270);
      await F('kigPå', 31.6, 162, 1400, 50, 180);
    }
    if (sted === 'pol8' || sted === 'pol16') {
      await F('sætAnisotropi', sted === 'pol8' ? 8 : 16);
      // (Solen står 30° oppe, så skarpheden kan ses. Ved polen står den i virkeligheden altid ved horisonten.)
      await F('solOver', 85.8, 62.9, 30, 200);
      await F('kigPå', 85.8, 62.9, 500, 30, 180);
    }
    if (sted === 'hurtig') {
      await f(() => atomlabTest.solsystem.sætTid('hurtig'));
      await s.waitForTimeout(10000);
    }
    await s.waitForTimeout(2500);
    const bps = await måling();
    await s.screenshot({ path: `${UD}/${navn}-${sted}.png` });
    console.log(navn, sted, `${bps.toFixed(1)} billeder i sekundet`, JSON.stringify(await F('billeder')));
  }
  if (fejl.length) console.log('FEJL', fejl.slice(0, 5));
  await s.context().close();
}
await b.close();
