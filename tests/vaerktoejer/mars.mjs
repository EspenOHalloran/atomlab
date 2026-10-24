// Billeder af Mars med fuld grafik (glød og 8k-kort): hele kloden, Olympus Mons ude ved kanten, landskabet ved
// grænsen mellem dag og nat og bjergene 10 gange højere.
// Kør: node tests/vaerktoejer/mars.mjs  (billederne lægges i tests/billeder/mars-vaerktoej/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('mars-vaerktoej');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const side = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const fejl = [];
side.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
side.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await side.goto(`${ADRESSE}/tests/vaerktoejer/saturn.html?f=mars`);
await side.waitForFunction(() => window.saturnTest);
await side.waitForTimeout(6000); // billederne skal nå at blive hentet
const billede = async (navn, fn, vent = 1500) => {
  await side.evaluate(fn);
  await side.waitForTimeout(vent);
  await side.screenshot({ path: `${UD}/${navn}.png` });
  console.log(navn);
};
// Kameraet kigger fra +z. vend(l) drejer længdegraden l (grader øst) mod kameraet.
await billede('1-mars', () => { saturnTest.kig([0.12, 0.2, 1], 3.39619 * 2.9); saturnTest.test.vend(-100); });
// Olympus Mons (18,65° N, 226,2° Ø) ude ved højre kant (kanten ligger acos(R/afstand) fra midten af skiven)
await billede('2-olympus-kant', () => { saturnTest.kig([0, 0.25, 1], 3.39619 * 1.9); saturnTest.test.vend(-133.8 - 58); });
await billede('3-olympus-kant-x10', () => { saturnTest.tryk('Bjergene'); }, 3000);
await billede('4-mars-x10', () => { saturnTest.kig([0.12, 0.2, 1], 3.39619 * 2.9); saturnTest.test.vend(-100); });
await side.evaluate(() => saturnTest.tryk('Bjergene'));
// Valles Marineris tæt på grænsen mellem dag og nat (lav sol), og Hellas
await billede('5-valles-lav-sol', () => { saturnTest.kig([-0.35, -0.2, 1], 3.39619 * 1.6); saturnTest.test.vend(-160); }, 3000);
await billede('6-hellas', () => { saturnTest.kig([0.1, -0.6, 1], 3.39619 * 1.7); saturnTest.test.vend(70); });
await b.close();
console.log(fejl.length ? fejl.join('\n') : 'Ingen konsolfejl');
