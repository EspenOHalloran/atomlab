// Billeder af Venus med fuld grafik og billeder i sekundet (V2 i docs/plan-venus.md).
// Kør: node tests/vaerktoejer/venus.mjs [pc|tablet|tablet-hoejkant|tlf-hoejkant|tlf-langs] [sted ...]
// (billederne lægges i tests/billeder/venus-fuld/). Stederne: hel (hele planeten fra start, synligt lys), uv
// (kontakten "Ultraviolet (som Akatsuki)"), under50 og under100 (skyderen "Under skyerne"), modlys (kontakten "Modlys"),
// tæt (lavt over skyerne ved grænsen mellem dag og nat) og hurtig (efter 10 sekunder med ⏩). V3: nat (natsiden),
// gloed og gloed100 (natsiden med "Gløden på natsiden", med skyerne og uden), navne (hele Venus med navnene) og
// stederne maxwell, maat, kupler og venera13 (flyver derhen fra træet). V5: stop1 til stop6 (flybyens stop) og ned (turen
// ned til Venera 13: billeder ved 66, 55, 35 og 12 km og efter landingen).
// Uden størrelse: pc og tablet. Uden steder: hel. Mål én browser ad gangen (tjekliste F).
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('venus-fuld');
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
  const kontakt = (tekst) => f((t) => atomlabTest.solsystem.trykPå(t), tekst);
  await f(() => atomlabTest.solsystem.vælg('venus'));
  await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'venus' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.skyer && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 240000, polling: 200 });
  for (const sted of steder.length ? steder : ['hel']) {
    if (sted === 'uv') await kontakt('Ultraviolet');
    if (sted === 'under50') await F('sætUnder', 50);
    if (sted === 'under100') await F('sætUnder', 100);
    if (sted === 'modlys') await kontakt('Modlys');
    if (sted === 'tæt') await F('tætPå');
    if (['nat', 'gloed', 'gloed100'].includes(sted)) await F('natside');
    if (sted.startsWith('gloed')) await kontakt('Gløden');
    if (sted === 'gloed100') await F('sætUnder', 100);
    if (['maxwell', 'maat', 'kupler', 'venera13'].includes(sted)) {
      await f((id) => atomlabTest.solsystem.gåTil(id), sted);
      await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 240000, polling: 200 });
      await s.waitForFunction(() => Object.values(atomlabTest.solsystem.fænomen().lokalt()).every((l) => !l.aktiv || (l.kort && l.højde)), null, { timeout: 240000, polling: 200 });
    }
    if (/^stop\d$/.test(sted)) {
      await F('flybyTil', Number(sted.slice(4)) - 1);
      if (sted !== 'stop6') {
        await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 240000, polling: 200 });
        await s.waitForFunction(() => Object.values(atomlabTest.solsystem.fænomen().lokalt()).every((l) => !l.aktiv || (l.kort && l.højde)), null, { timeout: 240000, polling: 200 });
      }
    }
    if (sted === 'ned' || sted === 'stop6') {
      if (sted === 'ned') await f(() => atomlabTest.solsystem.gåTil('ned'));
      for (const km of [66, 55, 35, 12]) {
        await s.waitForFunction((km) => atomlabTest.solsystem.fænomen().ned().hMiddel < km, km, { timeout: 400000, polling: 100 });
        await s.screenshot({ path: `${UD}/${navn}-venus-${sted}-${km}km.png` });
      }
      await s.waitForFunction(() => atomlabTest.solsystem.fænomen().ned().fase === 'landet', null, { timeout: 400000, polling: 200 });
    }
    if (sted === 'hurtig') {
      await s.click('#solsystemTid button[data-tid="hurtig"]');
      await s.waitForTimeout(10000);
      await s.click('#solsystemTid button[data-tid="spil"]');
    }
    await s.waitForTimeout(2000);
    const bps = await måling();
    await s.screenshot({ path: `${UD}/${navn}-venus-${sted}.png` });
    console.log(`${navn} venus ${sted}: ${bps.toFixed(1)} billeder i sekundet`);
    if (sted === 'uv') await kontakt('Ultraviolet');
    if (sted.startsWith('gloed')) await kontakt('Gløden');
    if (sted.startsWith('under') || sted === 'gloed100') await F('sætUnder', 0);
    if (['maxwell', 'maat', 'kupler', 'venera13'].includes(sted)) {
      await f(() => atomlabTest.solsystem.gåTil('venus'));
      await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 240000, polling: 200 });
    }
    if (sted === 'modlys') await kontakt('Modlys');
  }
  if (fejl.length) console.log('Konsol:', fejl.join('\n'));
  await s.context().close();
}
await b.close();
