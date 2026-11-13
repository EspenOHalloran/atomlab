// Teksturerne i grafikkortet (skøn fra måleren ?maal) på en tur gennem Solsystemet med fuld grafik:
// Mars, Stå på Mars ved Gale, tilbage op, Saturn, Jorden og menuen. Bruges til forslag G i docs/plan-grafik.md
// (frigiv billederne, når man forlader en planet eller et landskab). Kun til sammenligning før og efter: testbrowseren
// har intet grafikkort, men skønnet tæller de samme kort som på jeres pc.
// Brug: node tests/vaerktoejer/maal-hukommelse.mjs [pc|tablet]   (serveren startes ikke her, se tests/README.md)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const ENHEDER = { pc: { viewport: { width: 1280, height: 800 } }, tablet: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true } };
const enhed = process.argv[2] ?? 'pc';
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const ctx = await b.newContext(ENHEDER[enhed]);
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`${ADRESSE}/?test&maal#solsystem`);
await p.waitForFunction(() => window.atomlabTest && window.atomlabMålerTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 30000 });
const mb = async (navn) => {
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => atomlabMålerTest.tallene());
  console.log(`${navn.padEnd(34)} ${t.teksturMB.toFixed(0).padStart(5)} MB nu (højst ${t.teksturMBHøjst.toFixed(0)})`);
};
const vælg = (id) => p.evaluate((i) => document.querySelector(`#solsystem .kosmos-valg[data-id="${i}"]`).click(), id);
const vent = (f, arg, timeout = 90000) => p.waitForFunction(f, arg, { timeout, polling: 250 }).catch(() => console.log('  (ventede forgæves)'));
// Flyvningen og landingen springes over (som i tests/landskab.mjs), for med fuld grafik tegner testbrowseren langsomt
const fm = (f) => p.evaluate(f);
const hop = async () => { await fm(() => atomlabTest.solsystem.fænomen().hop()); await vent(() => !atomlabTest.solsystem.fænomen().tur().flyver); };
const stå = async (id) => {
  await p.evaluate((i) => atomlabTest.solsystem.fænomen().ståPå(i), id);
  await hop();
  await vent(() => atomlabTest.solsystem.fænomen().stå().står);
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await vent(() => !atomlabTest.solsystem.fænomen().stå().lander);
};
await mb('Solsystemet (første)');
await vælg('mars');
await vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde);
await p.waitForTimeout(4000);
await mb('Mars');
await stå('naukluft');
await vent(() => atomlabTest.solsystem.fænomen().stå().foto.synlig > 0, null, 30000);
await mb('Stå på Mars (Naukluft, med foto)');
await p.evaluate(() => atomlabTest.solsystem.fænomen().tilbageOp());
await vent(() => !atomlabTest.solsystem.fænomen().stå().står);
await mb('Tilbage op over Mars');
await stå('randen');
await p.waitForTimeout(5000);
await mb('Stå på Mars (Jezero, ved randen)');
await p.evaluate(() => atomlabTest.solsystem.fænomen().tilbageOp());
await vent(() => !atomlabTest.solsystem.fænomen().stå().står);
await mb('Tilbage op over Mars');
await vælg('saturn');
await vent(() => atomlabTest.solsystem.valgt() === 'saturn');
await p.waitForTimeout(20000);
await mb('Saturn');
await vælg('jorden');
await vent(() => atomlabTest.solsystem.valgt() === 'jorden');
await p.waitForTimeout(10000);
await mb('Jorden');
await p.evaluate(() => { location.hash = ''; });
await p.waitForTimeout(3000);
await mb('Menuen');
await p.evaluate(() => { location.hash = '#solsystem'; });
await p.waitForTimeout(1000);
await vælg('mars');
const t0 = Date.now();
await vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde);
console.log(`Mars igen: kortene klar efter ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await mb('Mars igen');
await b.close();
