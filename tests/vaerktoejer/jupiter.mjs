// Billeder af Jupiter med fuld grafik og billeder i sekundet (J2 i docs/plan-jupiter.md).
// Kør: node tests/vaerktoejer/jupiter.mjs [pc|tablet] [sted ...]  (billederne lægges i tests/billeder/jupiter-fuld/)
// Stederne: hel (hele Jupiter), plet (Den Store Røde Plet), vinde (hele Jupiter med kontakten "Vindene"),
// hurtig (hele Jupiter efter 40 sekunder med ⏩), modlys, skygge (hele Jupiter med Io's skygge, J3), maaner (oversigten)
// og månerne io, europa, ganymedes og callisto (besøg, venter på 8k-kortet på pc). Uden steder: hel og plet.
// Mål én browser ad gangen (to samtidig halverer tallene, tjekliste F).
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('jupiter-fuld');
const STØRRELSER = { pc: [1280, 800, false], tablet: [1180, 820, true] };
const navne = process.argv.slice(2).filter((a) => STØRRELSER[a]);
const steder = process.argv.slice(2).filter((a) => !STØRRELSER[a]);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
for (const navn of navne.length ? navne : Object.keys(STØRRELSER)) {
  const [w, h, touch] = STØRRELSER[navn];
  const s = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch })).newPage();
  const fejl = [];
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  await s.click('#solsystem .sol-klode[data-id="jupiter"]');
  await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'jupiter' && atomlabTest.solsystem.fænomen()?.hentet(), null, { timeout: 60000, polling: 200 });
  const f = (fn, a) => s.evaluate(fn, a);
  const måling = () => f(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const g = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(g); else r(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(g); }));
  const kontakt = (tekst) => f((t) => [...document.querySelectorAll('#solsystem .kontakt, #solsystem button')].find((k) => k.textContent.trim().startsWith(t))?.click(), tekst);
  for (const sted of steder.length ? steder : ['hel', 'plet']) {
    const MÅNER = ['io', 'europa', 'ganymedes', 'callisto'];
    if (sted === 'plet' || sted === 'maaner' || MÅNER.includes(sted)) await f((id) => atomlabTest.solsystem.gåTil(id), sted);
    else await f(() => atomlabTest.solsystem.gåTil('jupiter'));
    if (sted === 'skygge') await f(() => atomlabTest.solsystem.fænomen().sætMåneUr(0));
    await f(() => atomlabTest.solsystem.fænomen().hop());
    await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver);
    if (sted === 'vinde' || sted === 'modlys') await kontakt(sted === 'vinde' ? 'Vindene' : 'Modlys');
    if (sted === 'hurtig') {
      await s.click('#solsystemTid button[data-tid="hurtig"]');
      await s.waitForTimeout(40000);
    }
    if (MÅNER.includes(sted)) await s.waitForFunction((id) => Object.keys(atomlabTest.solsystem.fænomen().billeder()).some((n) => n.startsWith(id + '-') && !n.endsWith('-2k.jpg')), sted, { timeout: 60000, polling: 300 }).catch(() => console.log('kortet kom ikke'));
    if (sted === 'skygge') await s.click('#solsystemTid button[data-tid="pause"]');
    await s.waitForTimeout(1500);
    if (sted === 'skygge') await f(() => atomlabTest.solsystem.fænomen().sætMåneUr(0));
    const fps = await måling();
    console.log(navn, sted, 'billeder i sekundet:', fps.toFixed(1));
    await s.screenshot({ path: `${UD}/${navn}-${sted}.png` });
    if (sted === 'vinde' || sted === 'modlys') await kontakt(sted === 'vinde' ? 'Vindene' : 'Modlys');
    if (sted === 'hurtig' || sted === 'skygge') await s.click('#solsystemTid button[data-tid="spil"]');
  }
  console.log(fejl.length ? fejl.join('\n') : 'ingen fejl');
  await s.context().close();
}
await b.close();
