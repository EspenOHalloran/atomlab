// Billeder af prototypen med Saturn og månerne (fuld grafik, med glød), også hvert stop på flybyen.
// Kør: node tests/vaerktoejer/saturn.mjs  (billederne lægges i tests/billeder/saturn-vaerktoej/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('saturn-vaerktoej');
const b = await chromium.launch({ args: ARGS });
const side = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const fejl = [];
side.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
side.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await side.goto(`${ADRESSE}/tests/vaerktoejer/saturn.html`);
await side.waitForFunction(() => window.saturnTest);
await side.waitForTimeout(3000); // billederne skal nå at blive hentet
const billede = async (navn, fn, vent = 1500) => {
  await side.evaluate(fn);
  await side.waitForTimeout(vent);
  await side.screenshot({ path: `${UD}/${navn}.png` });
  console.log(navn);
};
await billede('1-saturn', () => { saturnTest.frys(20); saturnTest.kig([0.2, -0.32, 1], 40); });
await billede('2-saturn-skraat', () => { saturnTest.kig([-0.3, -0.12, 1], 36); });
await billede('3-saturn-bagfra', () => { saturnTest.kig([-1, 0.25, -0.4], 40); });
await billede('3b-saturn-modlys', () => { saturnTest.tryk('Modlys'); saturnTest.kig([0.5, -0.2, 1], 42); });
await billede('3c-saturn', () => { saturnTest.tryk('Modlys'); });
// Flybyen: hvert stop, når kameraet er fremme (billederne skal også nå at blive hentet)
await side.evaluate(() => { saturnTest.flyby.start(); saturnTest.flyby.hop(); });
await side.waitForTimeout(2500);
for (let i = 0; i < 9; i++) {
  await billede(`flyby-${i}`, () => saturnTest.flyby.hop(), i < 3 ? 800 : 1800);
  if (i === 4) await billede('flyby-4-modlys', () => { saturnTest.tryk('Modlys'); }, 800);
  if (i === 4) await side.evaluate(() => saturnTest.tryk('Modlys'));
  if (i < 8) await side.evaluate(() => { saturnTest.flyby.næste(); });
}
await billede('flyby-8-under-disen', () => { saturnTest.tryk('Under disen'); });
await b.close();
console.log(fejl.length ? fejl.join('\n') : 'Ingen konsolfejl');
