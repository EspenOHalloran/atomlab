// Skærmbilleder af ét Kosmos-fænomen. Brug: node tests/vaerktoejer/kosmos-billeder.mjs id [handlinger...]  (handling = tal: tryk på knap nr. i, eller "v3" = vent 3 s, "s" = skærmbillede)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const [id, ...trin] = process.argv.slice(2);
const UD = billedmappe('kosmos-billeder');
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const vp = process.env.VP ? process.env.VP.split('x').map(Number) : [1280, 800];
const page = await (await b.newContext({ viewport: { width: vp[0], height: vp[1] } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForTimeout(1500);
await page.evaluate((id) => window.atomlabTest.kosmos.vælg(id), id);
await page.waitForTimeout(1500);
await page.evaluate(() => window.atomlabTest.kosmos.kameraFrem());
await page.waitForTimeout(800);
let n = 0;
for (const t of trin) {
  if (t.startsWith('v')) await page.waitForTimeout(Number(t.slice(1)) * 1000);
  else if (t.startsWith('f')) { await page.evaluate((s) => window.atomlabTest.kosmos.spol(s), Number(t.slice(1))); await page.waitForTimeout(600); }
  else if (t === 'k') { await page.evaluate(() => window.atomlabTest.kosmos.kameraFrem()); await page.waitForTimeout(800); }
  else if (t === 's') { await page.screenshot({ path: `${UD}/k-${id}-${n++}.png` }); }
  else await page.evaluate((i) => window.atomlabTest.kosmos.tryk(i), Number(t));
}
const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 2000) requestAnimationFrame(f); else r(n / 2); }; requestAnimationFrame(f); }));
console.log(id, 'knapper:', await page.evaluate(() => window.atomlabTest.kosmos.knapper()), 'objekter:', await page.evaluate(() => window.atomlabTest.kosmos.antalObjekter()), 'fps:', fps);
console.log('fejl:', fejl.length ? fejl : 'ingen');
await b.close();
