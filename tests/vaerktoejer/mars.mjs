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
// Olympus Mons (18,40° N, 226,0° Ø) ude ved højre kant (kanten ligger acos(R/afstand) fra midten af skiven)
await billede('2-olympus-kant', () => { saturnTest.kig([0, 0.25, 1], 3.39619 * 1.9); saturnTest.test.vend(-134 - 58); });
await billede('3-olympus-kant-x10', () => { saturnTest.tryk('Bjergene'); }, 3000);
await billede('4-mars-x10', () => { saturnTest.kig([0.12, 0.2, 1], 3.39619 * 2.9); saturnTest.test.vend(-100); });
await side.evaluate(() => saturnTest.tryk('Bjergene'));
// Valles Marineris tæt på grænsen mellem dag og nat (lav sol), og Hellas
await billede('5-valles-lav-sol', () => { saturnTest.kig([-0.35, -0.2, 1], 3.39619 * 1.6); saturnTest.test.vend(-160); }, 3000);
await billede('6-hellas', () => { saturnTest.kig([0.1, -0.6, 1], 3.39619 * 1.7); saturnTest.test.vend(70); });
// M3: skyerne over Tharsis om eftermiddagen (kameraet ca. 45° øst for middagsstedet), polerne, tusmørket og modlys
await billede('7-skyer-eftermiddag', () => { saturnTest.kig([0.97, 0.25, -0.22], 3.39619 * 2.2); saturnTest.test.vend(-118); });
await billede('8-skyer-taet', () => { saturnTest.kig([0.97, 0.35, -0.22], 3.39619 * 1.35); saturnTest.test.vend(-118); });
await billede('9-nordpol', () => { saturnTest.kig([0.4, 1, 0.3], 3.39619 * 2.2); saturnTest.test.vend(0); });
await billede('10-sydpol', () => { saturnTest.kig([0.4, -1, 0.3], 3.39619 * 2.2); saturnTest.test.vend(0); });
await billede('11-tusmoerke', () => { saturnTest.kig([-0.6, 0.2, 1], 3.39619 * 2.4); saturnTest.test.vend(-60); });
await billede('12-kant-dag', () => { saturnTest.kig([0.5, 0.3, 1], 3.39619 * 1.9); saturnTest.test.vend(-60); });
await billede('13-modlys', () => { saturnTest.tryk('Modlys'); saturnTest.kig([0.12, 0.2, 1], 3.39619 * 2.9); }, 2000);
await billede('14-modlys-langt', () => { saturnTest.kig([0.12, 0.1, 1], 3.39619 * 12); }, 2000);
await side.evaluate(() => saturnTest.tryk('Modlys'));
// M4c: flybyen ned til Olympus Mons (kameraet ser skråt mod horisonten), med bjergene 10 gange højere og i modlys
await billede('15-flyby-mars', () => { saturnTest.flyby.start(); saturnTest.flyby.hop(); }, 3000);
await billede('16-olympus-mons', () => { saturnTest.flyby.næste(); saturnTest.flyby.hop(); }, 4000);
await billede('17-olympus-x10', () => { saturnTest.tryk('Bjergene'); }, 4000);
await side.evaluate(() => saturnTest.tryk('Bjergene'));
await billede('18-olympus-modlys', () => { saturnTest.tryk('Modlys'); }, 3000);
await b.close();
console.log(fejl.length ? fejl.join('\n') : 'Ingen konsolfejl');
