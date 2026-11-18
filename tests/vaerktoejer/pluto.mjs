// Billeder af Pluto og Charon med fuld grafik og billeder i sekundet (MP3 i docs/drejebog-merkur-pluto.md).
// Kør: node tests/vaerktoejer/pluto.mjs [pc|tablet|tablet-hoejkant|tlf-hoejkant|tlf-langs] [sted ...]
// (billederne lægges i tests/billeder/pluto-fuld/). Stederne: hel (hele Pluto fra start), ude (langt ude med navnene:
// dansen om tyngdepunktet), dans (som ude efter 3 sekunder med ⏩), modlys (kameraet bag Pluto: den blå ring),
// charon (Charon tæt på med Pluto bagved), hjertet (skråt over Sputnik Planitia fra 1.500 km), bjerge (lavt over
// Tenzing Montes), nord (skråt over Nordpolen), syd (hele Pluto set fra syd: det, ingen har set) og forside (hele
// Pluto med hjertet i midten, Solen fra siden). MP4: tur1-tur5 (flybyens stop), træ:<navn> (et sted i træet, fx
// "træ:Hjertet") og navne (navnene på kloden).
// Uden størrelse: pc og tablet. Uden steder: hel. Mål én browser ad gangen (tjekliste F).
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('pluto-fuld');
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
  const efterFlyvning = async () => {
    await s.waitForTimeout(300);
    await F('hop');
    await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 60000, polling: 200 });
  };
  await f(() => atomlabTest.solsystem.vælg('pluto'));
  await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'pluto' && Object.values(atomlabTest.solsystem.fænomen()?.billeder?.().hentet ?? {}).every(Boolean), null, { timeout: 240000, polling: 200 });
  await s.waitForTimeout(1500);
  for (const sted of steder.length ? steder : ['hel']) {
    await f(() => atomlabTest.solsystem.sætTid('pause'));
    if (sted === 'ude' || sted === 'dans') {
      await f(() => { if (!atomlabTest.solsystem.fænomen().navne().charon) atomlabTest.solsystem.trykPå('Navne'); });
      await F('helFra', 70, 90, 48);
      if (sted === 'dans') { await f(() => atomlabTest.solsystem.sætTid('hurtig')); await s.waitForTimeout(3000); await f(() => atomlabTest.solsystem.sætTid('pause')); }
    }
    if (sted === 'modlys') { await f(() => atomlabTest.solsystem.trykPå('Modlys')); await efterFlyvning(); }
    if (sted === 'charon') { await s.locator('#solsystemTræ button', { hasText: 'Charon' }).click(); await efterFlyvning(); }
    // MP4: flybyens stop (tur1-tur5) og stederne fra træet (træ:Hjertet, træ:Bjergene af vandis)
    if (/^tur\d$/.test(sted)) { await F('flybyTil', +sted.slice(3) - 1); await efterFlyvning(); }
    if (sted.startsWith('træ:')) { await s.locator('#solsystemTræ button', { hasText: sted.slice(4) }).click(); await efterFlyvning(); }
    if (sted === 'navne') { await f(() => { if (!atomlabTest.solsystem.fænomen().navne().length) atomlabTest.solsystem.trykPå('Navne'); }); await F('helFra', 15, 175, 2.2); }
    if (sted === 'hjertet') await F('kigPå', 19.5, 178.7, 1500, 40, 180);
    if (sted === 'bjerge') await F('kigPå', -15.6, 177.4, 400, 20, 0);
    if (sted === 'nord') await F('kigPå', 85, 180, 1600, 40, 180);
    if (sted === 'syd') await F('helFra', -45, 160, 3);
    if (sted === 'forside') await F('helFra', 15, 180, 3);
    await s.waitForTimeout(2500);
    const bps = await måling();
    await s.screenshot({ path: `${UD}/${navn}-${sted}.png` });
    console.log(navn, sted, `${bps.toFixed(1)} billeder i sekundet`, JSON.stringify(await F('billeder')));
  }
  if (fejl.length) console.log('FEJL', fejl.slice(0, 5));
  await s.context().close();
}
await b.close();
