// Mars anden gang (docs/prompt-mars-anden-gang.md): rykkene, når Mars åbnes første og anden gang (efter Jupiter og
// efter menuen), og når man står samme sted i Stå på Mars igen, målt med ?maal og fuld grafik. Kun til sammenligning
// før og efter: testbrowseren har intet grafikkort, så tallene er større end på jeres pc og tablet.
// Brug: node tests/vaerktoejer/maal-anden-gang.mjs [pc|tablet] [stå]   (serveren startes ikke her, se tests/README.md)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const ENHEDER = { pc: { viewport: { width: 1280, height: 800 } }, tablet: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true } };
const enhed = process.argv[2] ?? 'tablet';
const medStå = process.argv.includes('stå');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const ctx = await b.newContext(ENHEDER[enhed]);
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`${ADRESSE}/?test&maal#solsystem`);
await p.waitForFunction(() => window.atomlabTest && window.atomlabMålerTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 30000 });
const fm = (f, a) => p.evaluate(f, a);
const vent = (f, arg, timeout = 120000) => p.waitForFunction(f, arg, { timeout, polling: 100 }).catch(() => console.log('  (ventede forgæves)'));
// De ryk i måleren, der er kommet siden sidst (med årsagen), og summen af tiden i dem
const klokken = () => fm(() => new Date().toLocaleTimeString('da-DK', { hour12: false }).replaceAll(':', '.'));
let fra = '';
async function ryk(navn, grænse = 50) {
  await p.waitForTimeout(1500);
  const t = await fm(() => atomlabMålerTest.tekst());
  const nye = t.split('\n').filter((l) => /^\d\d\.\d\d\.\d\d\s+\d+ ms/.test(l) && l.slice(0, 8) >= fra);
  fra = await klokken();
  const ms = (l) => Number(l.match(/\s(\d+) ms/)[1]);
  const store = nye.filter((l) => ms(l) >= grænse);
  const sum = store.reduce((s, l) => s + ms(l), 0);
  console.log(`\n${navn}: ${store.length} ryk over ${grænse} ms (i alt ${sum} ms), værst ${Math.max(0, ...nye.map(ms))} ms`);
  for (const l of store) console.log('  ' + l.slice(0, 300));
}
const vælg = (id) => fm((i) => document.querySelector(`#solsystem .kosmos-valg[data-id="${i}"]`).click(), id);
const klar = () => vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde);
async function mars(navn) {
  fra = await klokken();
  const t0 = Date.now();
  await vælg('mars');
  await klar();
  const s = ((Date.now() - t0) / 1000).toFixed(1);
  await p.waitForTimeout(4000);
  await ryk(`${navn} (kortene klar efter ${s} s)`);
}
await mars('Mars første gang');
await vælg('jupiter');
await vent(() => atomlabTest.solsystem.valgt() === 'jupiter');
await p.waitForTimeout(8000);
await mars('Mars anden gang (efter Jupiter)');
await fm(() => { location.hash = ''; });
await p.waitForTimeout(3000);
await fm(() => { location.hash = '#solsystem'; });
await p.waitForTimeout(2000);
await mars('Mars tredje gang (efter menuen)');
if (medStå) {
  async function stå(id) {
    await fm((i) => atomlabTest.solsystem.fænomen().ståPå(i), id);
    await fm(() => atomlabTest.solsystem.fænomen().hop());
    const t0 = Date.now();
    await vent(() => atomlabTest.solsystem.fænomen().stå().står);
    console.log(`  (fra flyvningen er slut, til landskabet vises: ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    await fm(() => atomlabTest.solsystem.fænomen().hop());
    await vent(() => !atomlabTest.solsystem.fænomen().stå().lander);
  }
  fra = await klokken();
  await stå('naukluft');
  await ryk('Stå på Mars ved Naukluft første gang');
  await fm(() => atomlabTest.solsystem.fænomen().tilbageOp());
  await vent(() => !atomlabTest.solsystem.fænomen().stå().står);
  await p.waitForTimeout(2000);
  fra = await klokken();
  await stå('naukluft');
  await ryk('Stå på Mars ved Naukluft anden gang');
}
const t = await fm(() => atomlabMålerTest.tekst());
console.log('\n' + t.split('\n').filter((l) => /^(Teksturer|Kort lagt|Shaderprogrammer|De dyreste)/.test(l)).join('\n'));
await b.close();
