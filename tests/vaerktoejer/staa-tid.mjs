// Hvad koster et billede i Stå på Mars? (G1 trin 3, forslag H.) Tegner billedet med hånden med fuld grafik i
// testbrowseren ved Naukluft og måler tiden (med gl.readPixels, så grafikken er færdig) for nogle blik, opløsninger og
// skyggerne. Testbrowseren tegner uden grafikkort, så tallene er kun til at sammenligne før og efter og dele imellem,
// ikke billeder i sekundet på en rigtig tablet.
// Brug: node tests/vaerktoejer/staa-tid.mjs [tablet|pc]   (serveren startes ikke her, se tests/README.md)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const ENHEDER = {
  tablet: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1.5 },
  pc: { viewport: { width: 1280, height: 800 } },
};
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const p = await (await b.newContext(ENHEDER[process.argv[2] ?? 'tablet'])).newPage();
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`${ADRESSE}/?test#solsystem`);
await p.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 30000 });
await p.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
const vent = (f) => p.waitForFunction(f, null, { timeout: 300000, polling: 250 });
const fm = (f, a) => p.evaluate(f, a);
await vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort);
await fm(() => atomlabTest.paneler.skiftKunGrafik('solsystem', true));
await fm(() => atomlabTest.solsystem.fænomen().ståPå('naukluft'));
await p.waitForTimeout(500);
await fm(() => atomlabTest.solsystem.fænomen().hop());
await vent(() => atomlabTest.solsystem.fænomen().stå().står);
await fm(() => atomlabTest.solsystem.fænomen().hop());
await vent(() => !atomlabTest.solsystem.fænomen().stå().lander);
await vent(() => atomlabTest.solsystem.fænomen().stå().skygger === 1);
await p.waitForTimeout(3000);
await fm(() => atomlabTest.solsystem.fænomen().sætTid(15.7));
await p.waitForTimeout(2000);
console.log('Nettet:', JSON.stringify(await fm(() => atomlabTest.solsystem.fænomen().stå().net)));

// Tegner billedet med hånden (animationsløkken stoppes) og måler tiden. pr: en anden pixelRatio et øjeblik.
const mål = (navn, k, v, pr) => fm(async ([navn, k, v, pr]) => {
  const { verden } = await import('/js/scene3d.js');
  const r = verden.renderer, gl = r.getContext(), y = atomlabTest.solsystem.fænomen();
  r.setAnimationLoop(null);
  y.kig(k, v);
  verden.styring.update(0);
  const gem = r.getPixelRatio();
  const sæt = (x) => { r.setPixelRatio(x); verden.komponist.setPixelRatio(x); r.setSize(innerWidth, innerHeight); verden.komponist.setSize(innerWidth, innerHeight); };
  if (pr) sæt(pr);
  const px = new Uint8Array(4);
  let stykker = 0;
  const tegn = () => { y.stå(); verden.opdateringer.forEach(() => {}); const før = y.stå().stykker?.[0] ?? 0; verden.komponist.render(0.016); stykker = (y.stå().stykker?.[0] ?? 0) - før; gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); };
  tegn(); tegn();
  const n = 4, t0 = performance.now();
  for (let i = 0; i < n; i++) tegn();
  const ms = (performance.now() - t0) / n;
  const str = `${r.domElement.width}×${r.domElement.height}`;
  if (pr) sæt(gem);
  return `${navn.padEnd(36)} ${ms.toFixed(0).padStart(6)} ms  (lærred ${str}${y.stå().stykker ? `, stykker af nettet tegnet: ${stykker} af ${y.stå().stykker[1]}` : ''})`;
}, [navn, k, v, pr]);
console.log(await mål('Vandret mod nord (−8°)', 0, -8));
console.log(await mål('  pixelRatio 1,0', 0, -8, 1));
console.log(await mål('  pixelRatio 0,1 (næsten kun nettet)', 0, -8, 0.1));
console.log(await mål('Ned mod jorden (−40°)', 120, -40));
console.log(await mål('Lodret ned (−85°)', 120, -85));
console.log(await mål('Op mod himlen (+10°)', 250, 10));

// Skyggekortene: fire lag, når Solen har stået stille, og igen lige efter (mens Solen flytter sig)
console.log(await fm(async () => {
  const { verden } = await import('/js/scene3d.js');
  const gl = verden.renderer.getContext(), px = new Uint8Array(4), y = atomlabTest.solsystem.fænomen();
  const opdater = () => verden.opdateringer.forEach((f) => f(0, 0));
  const ud = [];
  for (let i = 0; i < 80; i++) opdater();
  for (const t of [8, 8.3]) {
    y.sætTid(t);
    const t0 = performance.now();
    for (let k = 0; k < 4; k++) { opdater(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
    ud.push(`Skyggekortene (4 lag) kl. ${t}: ${(performance.now() - t0).toFixed(0)} ms i alt${y.stå().groveSkygger ? ' (grove)' : ''}`);
  }
  for (let i = 0; i < 25; i++) opdater();
  ud.push(`  25 billeder senere: ${y.stå().groveSkygger ? 'stadig grove' : 'skarpe igen'}`);
  return ud.join('\n');
}));
await b.close();
