// Fuld skærm: knappen findes, skifter til fuld skærm, titlen skifter, og man bliver i fuld skærm, når man skifter del
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('fuldskaerm');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, opts] of [['pc', { viewport: { width: 1280, height: 800 } }], ['tablet', { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }]]) {
  const fejl = [];
  const p = await (await b.newContext(opts)).newPage();
  p.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  const titel = (sel) => p.getAttribute(sel, 'title');
  // Titlen skifter, når browseren melder skiftet. Testbrowseren er langsom, så vi venter på den.
  const venTitel = async (sel, ønsket) => { for (let i = 0; i < 20 && (await titel(sel)) !== ønsket; i++) await p.waitForTimeout(250); return titel(sel); };
  await p.goto(`${ADRESSE}/`);
  await p.waitForTimeout(1200);
  tjek(`${navn}: knappen vises i menuen`, await p.isVisible('#menu .knap-fuldskaerm'));
  await p.click('#menu .knap-fuldskaerm');
  await p.waitForTimeout(500);
  tjek(`${navn}: fuld skærm efter klik`, await p.evaluate(() => Boolean(document.fullscreenElement)));
  const t = await venTitel('#menu .knap-fuldskaerm', 'Forlad fuld skærm');
  tjek(`${navn}: titlen skifter til "Forlad fuld skærm"`, t === 'Forlad fuld skærm', t);
  await p.click('a.kort.åben');
  await p.waitForTimeout(800);
  tjek(`${navn}: stadig fuld skærm i værkstedet`, await p.evaluate(() => Boolean(document.fullscreenElement)));
  await p.screenshot({ path: `${UD}/${navn}.png` });
  await p.click('#vaerksted .knap-fuldskaerm');
  await p.waitForTimeout(500);
  tjek(`${navn}: ud af fuld skærm igen`, await p.evaluate(() => !document.fullscreenElement));
  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
