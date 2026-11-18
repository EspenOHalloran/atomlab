// Hvad Nordpolen (M7b-pol) henter og fylder i grafikkortet (skøn fra måleren ?maal), på tablet eller pc:
// Mars åbnes, man flyver til Nordpolen og forlader Mars igen (til Saturn).
// Brug: node tests/vaerktoejer/maal-nordpol.mjs [tablet|pc]   (serveren startes ikke her, se tests/README.md)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';
const enhed = process.argv[2] ?? 'tablet';
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const ctx = await b.newContext(enhed === 'tablet' ? { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror:', e.message));
const hentet = new Map(); // fil → bytes
p.on('response', async (r) => {
  const u = new URL(r.url());
  if (!/\.(jpg|png|webp)$/.test(u.pathname) || !u.pathname.includes('/billeder/')) return;
  try { hentet.set(u.pathname.split('/').pop(), (await r.body()).length); } catch { /* sletten side */ }
});
const MB = (navne) => navne.reduce((s, n) => s + (hentet.get(n) ?? 0), 0) / 1e6;
await p.goto(`${ADRESSE}/?test&maal#solsystem`);
await p.waitForFunction(() => window.atomlabTest && window.atomlabMålerTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 30000 });
const tal = async (navn) => {
  await p.waitForTimeout(2000);
  const t = await p.evaluate(() => atomlabMålerTest.tallene());
  console.log(`${navn.padEnd(28)} teksturer ${t.teksturMB.toFixed(0).padStart(4)} MB (højst ${t.teksturMBHøjst.toFixed(0)})`);
};
const vent = (f, timeout = 120000) => p.waitForFunction(f, null, { timeout, polling: 250 });
const før = new Set();
await tal('Solsystemet');
for (const n of hentet.keys()) før.add(n);
await p.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
await vent(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde);
await vent(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'));
await tal('Mars åbnet');
const mars = [...hentet.keys()].filter((n) => !før.has(n));
console.log(`  Mars henter ${MB(mars).toFixed(1)} MB: ${mars.join(', ')}`);
await p.evaluate(() => atomlabTest.solsystem.gåTil('nordpol'));
await vent(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.nordpol; return l.hentet.højde && l.hentet.kort && l.tabel; });
await p.evaluate(() => atomlabTest.solsystem.fænomen().hop());
await vent(() => !atomlabTest.solsystem.fænomen().tur().flyver);
await tal('Ved Nordpolen');
const pol = [...hentet.keys()].filter((n) => n.includes('nordpol'));
console.log(`  Nordpolen henter ${MB(pol).toFixed(2)} MB: ${pol.join(', ')}`);
console.log(`  Mars i alt med Nordpolen ${(MB(mars) + MB(pol.filter((n) => !mars.includes(n)))).toFixed(1)} MB`);
await p.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="saturn"]').click());
await vent(() => atomlabTest.solsystem.valgt() === 'saturn');
await tal('Saturn (Mars forladt)');
await b.close();
