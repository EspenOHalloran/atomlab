// Billeder af Gale- og Jezero-stoppet på flybyen med fuld grafik, når detaljekortet er hentet (M8b: mellemlaget fra
// Stå på Mars som detalje i LOKALE). Kør: node tests/vaerktoejer/stop-detalje.mjs [gale jezero]
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('stop-detalje');
const steder = process.argv.slice(2).length ? process.argv.slice(2) : ['gale', 'jezero'];
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const fejl = [];
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text().slice(0, 300)); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort, null, { timeout: 120000 });
const f = (fn, a) => s.evaluate(fn, a);
await f(() => atomlabTest.paneler.skiftKunGrafik('solsystem', true));
for (const id of steder) {
  await f((x) => atomlabTest.solsystem.fænomen().besøgSted(x), id);
  await f(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000 });
  await s.waitForFunction((x) => atomlabTest.solsystem.fænomen().billeder().lokalt[x].detalje?.hentet, id, { timeout: 300000 });
  await s.waitForTimeout(3000);
  await s.screenshot({ path: `${UD}/${id}-stop.png`, timeout: 300000 });
  console.log(id, 'ok');
}
console.log(fejl.length ? fejl.join('\n') : 'ingen fejl');
await b.close();
