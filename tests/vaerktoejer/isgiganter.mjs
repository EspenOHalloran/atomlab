// Billeder af Uranus og Neptun med fuld grafik og billeder i sekundet (UN1 i docs/plan-uranus-neptun.md).
// Kør: node tests/vaerktoejer/isgiganter.mjs [pc|tablet|tablet-hoejkant|tlf-hoejkant|tlf-langs] [uranus|neptun] [sted ...]
// (billederne lægges i tests/billeder/isgiganter-fuld/). Stederne: hel (hele planeten fra start), modlys (kontakten
// "Modlys") og hurtig (efter 20 sekunder med ⏩). UN2 (Uranus): et årstal (fx 1986, 2007 eller 2030, skyderen "År"), ir
// (kontakten "Infrarødt (som JWST)"). Uden størrelse: pc og
// tablet. Uden planet: begge. Uden steder: hel.
// Mål én browser ad gangen (to samtidig halverer tallene, tjekliste F).
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('isgiganter-fuld');
const STØRRELSER = { pc: [1280, 800, false], tablet: [1180, 820, true], 'tablet-hoejkant': [768, 1024, true], 'tlf-hoejkant': [390, 844, true], 'tlf-langs': [844, 390, true] };
const arg = process.argv.slice(2);
const navne = arg.filter((a) => STØRRELSER[a]);
const planeter = arg.filter((a) => a === 'uranus' || a === 'neptun');
const steder = arg.filter((a) => !STØRRELSER[a] && !planeter.includes(a));
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
  const måling = () => f(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const g = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(g); else r(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(g); }));
  const kontakt = (tekst) => f((t) => [...document.querySelectorAll('#solsystem .kontakt, #solsystem button')].find((k) => k.textContent.trim().startsWith(t))?.click(), tekst);
  for (const planet of planeter.length ? planeter : ['uranus', 'neptun']) {
    await f((id) => atomlabTest.solsystem.vælg(id), planet);
    await s.waitForFunction((id) => atomlabTest.solsystem.valgt() === id && atomlabTest.solsystem.fænomen()?.hentet(), planet, { timeout: 60000, polling: 200 });
    for (const sted of steder.length ? steder : ['hel']) {
      if (sted === 'modlys') await kontakt('Modlys');
      if (sted === 'ir') await kontakt('Infrarødt');
      if (/^\d{4}$/.test(sted)) await f((v) => atomlabTest.solsystem.fænomen().sætÅr(v), Number(sted));
      if (sted === 'hurtig') {
        await s.click('#solsystemTid button[data-tid="hurtig"]');
        await s.waitForTimeout(20000);
        await s.click('#solsystemTid button[data-tid="spil"]');
      }
      await s.waitForTimeout(1500);
      const bps = await måling();
      await s.screenshot({ path: `${UD}/${navn}-${planet}-${sted}.png` });
      console.log(`${navn} ${planet} ${sted}: ${bps.toFixed(1)} billeder i sekundet`);
      if (sted === 'modlys') await kontakt('Modlys');
      if (sted === 'ir') await kontakt('Infrarødt');
    }
  }
  if (fejl.length) console.log('Konsol:', fejl.join('\n'));
  await s.context().close();
}
await b.close();
