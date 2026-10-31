// Skærmbilleder af ét fænomen i Kosmos eller Solsystemet. Brug: node tests/vaerktoejer/kosmos-billeder.mjs id [handlinger...]  (handling = "v3": vent 3 s, "f3": spol 3 s frem, "k": kameraet færdigt, "s": skærmbillede, ellers teksten på en knap i bjælken eller en kontakt i Styr-boksen, fx "Næste")
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const [id, ...trin] = process.argv.slice(2);
const UD = billedmappe('kosmos-billeder');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true }); // billederne skal se ud som i spillet
const fejl = [];
const vp = process.env.VP ? process.env.VP.split('x').map(Number) : [1280, 800];
const page = await (await b.newContext({ viewport: { width: vp[0], height: vp[1] } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test`);
await page.waitForTimeout(1500);
// Fænomenet ligger enten i Kosmos eller i Solsystemet
const sk = await page.evaluate((id) => (window.atomlabTest.solsystem.fænomener.includes(id) ? 'solsystem' : 'kosmos'), id);
await page.evaluate((sk) => { location.hash = `#${sk}`; }, sk);
await page.waitForTimeout(1500);
await page.evaluate(([id, sk]) => window.atomlabTest[sk].vælg(id), [id, sk]);
await page.waitForTimeout(1500);
await page.evaluate((sk) => window.atomlabTest[sk].kameraFrem(), sk);
await page.waitForTimeout(800);
let n = 0;
for (const t of trin) {
  if (t.startsWith('v')) await page.waitForTimeout(Number(t.slice(1)) * 1000);
  else if (t.startsWith('f')) { await page.evaluate(([s, sk]) => window.atomlabTest[sk].spol(s), [Number(t.slice(1)), sk]); await page.waitForTimeout(600); }
  else if (t === 'k') { await page.evaluate((sk) => window.atomlabTest[sk].kameraFrem(), sk); await page.waitForTimeout(800); }
  else if (t === 's') { await page.screenshot({ path: `${UD}/k-${id}-${n++}.png` }); }
  else if (!(await page.evaluate(([t, sk]) => window.atomlabTest[sk].trykPå(t), [t, sk]))) fejl.push(`fandt ikke knappen "${t}"`);
}
const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 2000) requestAnimationFrame(f); else r(n / 2); }; requestAnimationFrame(f); }));
console.log(id, 'knapper:', await page.evaluate((sk) => window.atomlabTest[sk].knapper(), sk), 'objekter:', await page.evaluate((sk) => window.atomlabTest[sk].antalObjekter(), sk), 'fps:', fps);
console.log('fejl:', fejl.length ? fejl : 'ingen');
await b.close();
