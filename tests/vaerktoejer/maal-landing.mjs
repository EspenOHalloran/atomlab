// Rykkene, når Mars åbnes, og ved landingen i Stå på Mars (Naukluft og Ved randen), målt med ?maal og fuld grafik.
// Bruges til G1 trin 3, del 3 (forslag A og F i docs/plan-grafik.md): kortene pakkes ud uden for hovedtråden (vendt), og
// landskabet gøres klar, mens kameraet står stille over stedet. Kun til sammenligning før og efter: testbrowseren har
// intet grafikkort, så tallene er større end på jeres pc og tablet.
// Brug: node tests/vaerktoejer/maal-landing.mjs [pc|tablet] [saturn]   (serveren startes ikke her, se tests/README.md)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const ENHEDER = { pc: { viewport: { width: 1280, height: 800 } }, tablet: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true } };
const enhed = process.argv[2] ?? 'pc';
const medSaturn = process.argv.includes('saturn');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const ctx = await b.newContext(ENHEDER[enhed]);
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`${ADRESSE}/?test&maal#solsystem`);
await p.waitForFunction(() => window.atomlabTest && window.atomlabMålerTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 30000 });
const fm = (f, a) => p.evaluate(f, a);
const vent = (f, arg, timeout = 120000) => p.waitForFunction(f, arg, { timeout, polling: 100 }).catch(() => console.log('  (ventede forgæves)'));
// De ryk i måleren, der er kommet siden sidst (kun dem over grænsen, med årsagen). Måleren husker de sidste 100, så de
// nye findes efter klokken.
const klokken = () => fm(() => new Date().toLocaleTimeString('da-DK', { hour12: false }).replaceAll(':', '.'));
let fra = '';
async function ryk(navn, grænse = 100) {
  await p.waitForTimeout(1500);
  const t = await fm(() => atomlabMålerTest.tekst());
  const nye = t.split('\n').filter((l) => /^\d\d\.\d\d\.\d\d\s+\d+ ms/.test(l) && l.slice(0, 8) >= fra);
  fra = await klokken();
  const ms = (l) => Number(l.match(/\s(\d+) ms/)[1]);
  const store = nye.filter((l) => ms(l) >= grænse);
  console.log(`\n${navn}: ${nye.length} ryk, værst ${Math.max(0, ...nye.map(ms))} ms, ${store.length} over ${grænse} ms`);
  for (const l of store) if (/kort i grafikkortet|shader/.test(l)) console.log('  ' + l.slice(0, 260));
}
const vælg = (id) => fm((i) => document.querySelector(`#solsystem .kosmos-valg[data-id="${i}"]`).click(), id);
await ryk('Start');
await vælg('mars');
await vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde);
await p.waitForTimeout(3000);
await ryk('Mars åbnes');
// Flyvningen springes over (fuld grafik tegner langsomt), men landingen ses: tæppet og det første billede af landskabet
async function stå(id) {
  await fm((i) => atomlabTest.solsystem.fænomen().ståPå(i), id);
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  const t0 = Date.now();
  await vent(() => atomlabTest.solsystem.fænomen().stå().står);
  console.log(`  (fra flyvningen er slut, til landskabet vises: ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await vent(() => !atomlabTest.solsystem.fænomen().stå().lander);
}
await stå('naukluft');
await ryk('Stå på Mars ved Naukluft (landingen)');
await fm(() => atomlabTest.solsystem.fænomen().tilbageOp());
await vent(() => !atomlabTest.solsystem.fænomen().stå().står);
await p.waitForTimeout(2000);
await ryk('Tilbage op');
await stå('randen');
await ryk('Stå på Mars ved Randen (Jezero)');
await fm(() => atomlabTest.solsystem.fænomen().besøgSted('stå-landing'));
await vent(() => atomlabTest.solsystem.fænomen().stå().sted === 'landing' && !atomlabTest.solsystem.fænomen().stå().lander);
await ryk('Hop til Landingsstedet');
if (medSaturn) {
  await vælg('saturn');
  await vent(() => atomlabTest.solsystem.valgt() === 'saturn');
  await p.waitForTimeout(20000); // (månernes kort hentes og lægges i grafikkortet på forhånd)
  await ryk('Saturn åbnes (månerne på forhånd)');
}
const t = await fm(() => atomlabMålerTest.tekst());
console.log('\n' + t.split('\n').filter((l) => /^(Kort lagt|Shaderprogrammer|De dyreste kort)/.test(l)).join('\n'));
await b.close();
