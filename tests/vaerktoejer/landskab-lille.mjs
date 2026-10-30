// Hurtige prøvebilleder af "Stå på Mars" med fuld grafik i et lille vindue og uden paneler (til at justere lys og
// farver). Kør: node tests/vaerktoejer/landskab-lille.mjs <sted> <kompas,vinkel,tid> [...]
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('landskab');
const [sted, ...blik] = process.argv.slice(2);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const s = await (await b.newContext({ viewport: { width: 900, height: 560 } })).newPage();
const fejl = [];
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text().slice(0, 400)); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort, null, { timeout: 60000 });
const f = (fn, a) => s.evaluate(fn, a);
await f(() => atomlabTest.paneler.skiftKunGrafik('solsystem', true));
await f((id) => atomlabTest.solsystem.fænomen().ståPå(id), sted);
await s.waitForTimeout(500);
await f(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 300000 });
await f(() => atomlabTest.solsystem.fænomen().hop());
for (const x of blik) {
  const [k, v, t] = x.split(',').map(Number);
  await f(([k, v, t]) => { const y = atomlabTest.solsystem.fænomen(); y.sætTid(t); y.kig(k, v); }, [k, v, t]);
  await s.waitForTimeout(1500);
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().skygger === 1, null, { timeout: 300000 });
  await s.waitForTimeout(2000);
  await s.screenshot({ path: `${UD}/lille-${sted}-${k}-${v}-${t}.png`, timeout: 300000 });
  console.log(x, JSON.stringify(await f(() => { const t = atomlabTest.solsystem.fænomen().stå(); return { sol: t.solHøjde?.toFixed(1), måner: t.måner }; })));
}
// Træk med musen 200 px mod højre: Kompasset skal falde (man tager fat i landskabet og trækker det med)
const før = await f(() => atomlabTest.solsystem.fænomen().stå().kompas);
await s.mouse.move(450, 300); await s.mouse.down(); await s.mouse.move(550, 300, { steps: 5 }); await s.mouse.move(650, 300, { steps: 5 }); await s.mouse.up();
await s.waitForTimeout(3000);
console.log('træk mod højre: kompas', før.toFixed(1), '→', (await f(() => atomlabTest.solsystem.fænomen().stå().kompas)).toFixed(1));
// Billeder i sekundet i 10 sekunder
const bps = await f(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const l = () => { n++; if (performance.now() - t0 < 10000) requestAnimationFrame(l); else r(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(l); }));
console.log('billeder i sekundet', bps.toFixed(2));
console.log(fejl.length ? fejl.join('\n') : 'ingen fejl');
await b.close();
