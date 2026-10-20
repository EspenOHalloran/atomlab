// Billeder af Jorden og Månen tæt på i forskelligt lys (fuld grafik), så grafikken kan tjekkes med øjnene.
// Brug: node tests/vaerktoejer/kloder.mjs   (billederne lægges i tests/billeder/kloder/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('kloder');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const page = await (await b.newContext({ viewport: { width: 900, height: 900 } })).newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(`${m.type()}: ${m.text()}`); });
await page.goto(`${ADRESSE}/tests/vaerktoejer/kloder.html`);
await page.waitForFunction(() => window.kloder);
await page.evaluate(() => kloder.billederHentet());
// [navn, solens vinkel og højde, Jordens drejning, hvad, kameraets retning, afstand, punktet der kigges på (forskudt)]
// Kortets længde 0 peger mod +x, så drejning d viser længde -d mod +x. Europa og Afrika: 0, Amerika: 90.
const BILLEDER = [
  ['dag-europa', [20, 15], 0, 'jorden', [1, 0.6, 0.2], 3.3],
  ['dag-glimt-amerika', [5, 10], 90, 'jorden', [1, 0.25, 0.15], 3.3],
  ['tusmoerke', [80, 8], 0, 'jorden', [1, 0.4, -0.2], 3.0],
  ['nat-europa', [150, 15], 0, 'jorden', [1, 0.6, -0.1], 3.0],
  ['modlys', [180, 2], 0, 'jorden', [1, 0.1, 0], 4.2],
  ['bjerge-tusmoerke', [95, 20], -10, 'jorden', [0.8, 0.9, -0.3], 1.0, [0.55, 0.7, -0.35]],
  ['kant-naer', [30, 10], 0, 'jorden', [1, 0.15, 0.3], 0.9, [0.1, 0.25, -0.95]],
  ['maane-fuld', [90, 35], 0, 'månen', [0, 0.05, -1], 1.1],
  ['maane-halv', [180, 0], 0, 'månen', [0, 0.05, -1], 1.1],
];
for (const [navn, [v, h], drej, hvad, retning, afstand, forskyd] of BILLEDER) {
  await page.evaluate(([v, h, drej, hvad, retning, afstand, forskyd]) => { kloder.sætSol(v, h); kloder.drej(drej); kloder.kig(hvad, retning, afstand, forskyd); }, [v, h, drej, hvad, retning, afstand, forskyd]);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${UD}/${navn}.png` });
  console.log(`${UD}/${navn}.png`);
}
await b.close();
console.log(fejl.length ? `Konsolfejl:\n${fejl.join('\n')}` : 'Ingen konsolfejl');
process.exit(fejl.length ? 1 : 0);
