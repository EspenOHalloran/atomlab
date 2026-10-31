// Billeder af "Stå på Mars" (M8) med fuld grafik: landingen og udsigten fra stederne i flere retninger og på flere
// tidspunkter. Skriver også landskabets tal (Solens højde, månerne, skyggerne).
// Kør: node tests/vaerktoejer/landskab.mjs [pc|tablet] [sted] (billederne lægges i tests/billeder/landskab/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('landskab');
const STØRRELSER = { pc: [1280, 800, false], tablet: [820, 1180, true] };
const valgt = process.argv[2] ? [process.argv[2]] : ['pc'];
const sted = process.argv[3] ?? 'naukluft';
const BLIK = { naukluft: [[135, 1, 7.2], [0, 1, 8.5], [290, 6, 18.2], [100, -30, 8.5]], curiosity: [[10, 1, 9], [150, 3, 9]], randen: [[95, 1, 16.5], [95, -7, 16.5], [0, 1, 16.5]], landing: [[270, 1, 7.5], [285, 2, 16.5]] };
if (process.argv[4]) BLIK[sted] = BLIK[sted].slice(0, Number(process.argv[4]));
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
for (const navn of valgt) {
  const [w, h, touch] = STØRRELSER[navn];
  const s = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch })).newPage();
  const fejl = [];
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.text().slice(0, 400)); });
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort, null, { timeout: 60000 });
  const f = (fn, a) => s.evaluate(fn, a);
  await f((id) => atomlabTest.solsystem.fænomen().ståPå(id), sted);
  await s.waitForTimeout(500);
  await f(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 120000 });
  const t0 = Date.now();
  await s.waitForTimeout(800);
  await s.screenshot({ path: `${UD}/${navn}-${sted}-0-landing.png`, timeout: 300000 });
  await f(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander, null, { timeout: 120000 });
  console.log('landing', ((Date.now() - t0) / 1000).toFixed(1), 's');
  for (const [i, [kompas, vinkel, tid]] of BLIK[sted].entries()) {
    await f(([k, v, t]) => { const x = atomlabTest.solsystem.fænomen(); x.sætTid(t); x.kig(k, v); }, [kompas, vinkel, tid]);
    await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().skygger === 1, null, { timeout: 60000 });
    await s.waitForTimeout(2500);
    console.log(navn, i, JSON.stringify(await f(() => atomlabTest.solsystem.fænomen().stå())));
    await s.screenshot({ path: `${UD}/${navn}-${sted}-${i + 1}-${kompas}-${tid}.png`, timeout: 300000 });
  }
  console.log(fejl.length ? fejl.join('\n') : 'ingen fejl');
  await s.context().close();
}
await b.close();
