// Billeder af flybyens stop ved månerne (M6b) med fuld grafik i den rigtige skærm (pc og tablet på højkant):
// Phobos, "Mars set fra Phobos" og Deimos. Skriver også kameraets højde over Phobos, hvor bred Mars ser ud, og om
// kameraet blev skubbet ud af en måne.
// Kør: node tests/vaerktoejer/maaner-flyby.mjs [pc|tablet]  (billederne lægges i tests/billeder/maaner-flyby/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('maaner-flyby');
const STØRRELSER = { pc: [1280, 800, false], tablet: [820, 1180, true] };
const valgt = process.argv[2] ? [process.argv[2]] : Object.keys(STØRRELSER);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
for (const navn of valgt) {
  const [w, h, touch] = STØRRELSER[navn];
  const s = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch })).newPage();
  const fejl = [];
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
  await s.waitForFunction(() => { const t = atomlabTest.solsystem.fænomen(); return t?.måner().every((m) => m.form && m.kort) && atomlabTest.solsystem.knapper().includes('▶ Start flyby'); }, null, { timeout: 60000 });
  const tryk = (tekst) => s.evaluate((t) => [...document.querySelectorAll('#solsystemStyring button')].find((k) => k.textContent.startsWith(t)).click(), tekst);
  const f = (fn, a) => s.evaluate(fn, a);
  await tryk('▶ Start flyby');
  for (let i = 0; i < 10; i++) { await f(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver); await tryk('Næste'); }
  // Nu på vej til Phobos
  for (const [fil, næste] of [['1-phobos', true], ['2-mars-set-fra-phobos', true], ['3-deimos', false]]) {
    await f(() => atomlabTest.solsystem.fænomen().hop());
    await s.waitForTimeout(2500);
    const t = await f(() => { const t = atomlabTest.solsystem.fænomen(); return { ved: t.ved(), phobos: t.måneHøjde('phobos').toFixed(3), deimos: t.måneHøjde('deimos').toFixed(2), mars: t.marsVinkel().toFixed(1), overHorisont: t.marsOverHorisont().toFixed(1), skygge: [t.iSkygge('phobos'), t.iSkygge('deimos')], stickneySol: t.solVinkel('phobos', -1, -49).toFixed(0) }; });
    console.log(navn, fil, JSON.stringify(t));
    await s.screenshot({ path: `${UD}/${navn}-${fil}.png` });
    if (næste) await tryk('Næste');
  }
  console.log(fejl.length ? fejl.join('\n') : 'ingen fejl');
  await s.context().close();
}
await b.close();
