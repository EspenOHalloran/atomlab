// Bjælken "Henter AtomLab" på forsiden: den ses, mens JavaScript hentes, den forsvinder igen, og skønnet over antallet
// af filer (FORVENTET i index.html) passer stadig. Skærmbilleder af bjælken tages med langsomt net (forsinkede filer).
import { readFileSync } from 'node:fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('henter');
const FORVENTET = Number(readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(/const FORVENTET = (\d+)/)[1]);
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const STØRRELSER = [
  ['pc', { viewport: { width: 1280, height: 800 } }],
  ['tablet-højkant', { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true }],
  ['telefon', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }],
];
for (const [navn, opts] of STØRRELSER) {
  const fejl = [];
  const p = await (await b.newContext(opts)).newPage();
  p.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') fejl.push(m.type() + ': ' + m.text()); });
  // Langsomt net: hver JavaScript-fil forsinkes lidt, så bjælken kan ses og fotograferes undervejs
  await p.route('**/*.js', async (r) => { await new Promise((s) => setTimeout(s, 40)); await r.continue(); });
  await p.goto(`${ADRESSE}/`, { waitUntil: 'commit' });
  await p.waitForSelector('#henter', { state: 'visible', timeout: 10000 });
  await p.waitForFunction(() => window.atomlabHentet?.() > 15, null, { timeout: 20000 });
  tjek(`${navn}: bjælken ses, mens filerne hentes`, await p.isVisible('#henter'));
  const bredde = await p.evaluate(() => parseFloat(document.getElementById('henterFyld').style.width));
  tjek(`${navn}: bjælken er fyldt et stykke (${bredde} %)`, bredde > 10 && bredde <= 95, String(bredde));
  await p.screenshot({ path: `${UD}/${navn}.png` });
  await p.waitForSelector('#henter', { state: 'detached', timeout: 30000 });
  tjek(`${navn}: bjælken er væk, når siden er klar`, !(await p.$('#henter')));
  const hentet = await p.evaluate(() => window.atomlabHentet());
  tjek(`${navn}: skønnet passer (${hentet} filer, FORVENTET ${FORVENTET})`, hentet >= FORVENTET * 0.85 && hentet <= FORVENTET * 1.15, `ret FORVENTET i index.html til ca. ${hentet}`);
  await p.click('#menu .verden.midt a.verden-knap', { force: true }); // kortene svæver, så Playwright ellers venter på, at de står stille
  await p.waitForTimeout(500);
  tjek(`${navn}: en del i menuen kan trykkes på bagefter`, (await p.evaluate(() => location.hash)) !== '');
  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await p.context().close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
