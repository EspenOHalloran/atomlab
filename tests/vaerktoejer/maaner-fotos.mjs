// Mars' måner i programmet set fra samme side som to fotos (HiRISE 2008 og 2009), til at tjekke, at de vender rigtigt.
// Retningerne er fundet ved at tilpasse formen til fotoet (docs/plan-mars.md, "Plan for M6"). Lyset er programmets.
// Kør: node tests/vaerktoejer/maaner-fotos.mjs [mappe]   (serveren skal køre: python -m http.server 8765)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';
import { mkdirSync } from 'node:fs';
const UD = process.argv[2] ?? 'tests/billeder/maaner';
mkdirSync(UD, { recursive: true });
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.måner().every((m) => m.form && m.kort), null, { timeout: 120000 });
await s.click('#solsystemStyring button:text-is("Drej Mars")');
// fra: månen står så mange grader fra stedet bag Mars (Solen bag kameraet, lidt til siden)
for (const [id, bredde, længde, fra] of [['phobos', 30, 0, 30], ['deimos', -10, -30, 25]]) {
  await s.evaluate(([id, b_, l, f]) => atomlabTest.solsystem.fænomen().kameraFra(id, b_, l, f), [id, bredde, længde, fra]);
  await s.evaluate(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForTimeout(1500);
  await s.screenshot({ path: `${UD}/foto-${id}.png`, clip: { x: 340, y: 100, width: 600, height: 600 } });
}
await b.close();
