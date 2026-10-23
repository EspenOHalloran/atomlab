// Billeder af prototypen med Saturn, Enceladus og Titan (fuld grafik, med glød).
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
const billede = async (navn, fn) => {
  await side.evaluate(fn);
  await side.waitForTimeout(1500);
  await side.screenshot({ path: `${UD}/${navn}.png` });
  console.log(navn);
};
await billede('1-saturn', () => { saturnTest.frys(20); saturnTest.kig([0.55, 0.32, 1], 40); });
await billede('2-saturn-skraat', () => { saturnTest.kig([-0.3, 0.12, 1], 36); });
await billede('3-saturn-bagfra', () => { saturnTest.kig([-1, -0.25, -0.4], 40); });
await billede('3b-saturn-modlys', () => { saturnTest.tryk('Modlys'); saturnTest.kig([0.5, 0.2, 1], 42); });
await billede('3c-saturn', () => { saturnTest.tryk('Modlys'); });
await billede('4-enceladus', () => { saturnTest.tryk('Enceladus'); saturnTest.kig([0.25, -0.45, 1], 9); });
await billede('5-enceladus-modlys', () => { saturnTest.tryk('Modlys'); saturnTest.kig([0.25, -0.3, 1], 9); });
await billede('6-titan-modlys', () => { saturnTest.tryk('Titan'); saturnTest.kig([0.4, 0.15, 1], 12); });
await billede('7-titan', () => { saturnTest.tryk('Modlys'); saturnTest.kig([0.9, 0.15, 0.6], 12); });
await billede('8-titan-under-disen', () => { saturnTest.tryk('Under disen'); });
await b.close();
console.log(fejl.length ? fejl.join('\n') : 'Ingen konsolfejl');
