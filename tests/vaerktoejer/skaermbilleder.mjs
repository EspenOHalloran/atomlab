// Skærmbilleder af én skærm på pc, tablet og telefon (begge veje), så layoutet kan tjekkes med øjnene.
// Brug: node tests/vaerktoejer/skaermbilleder.mjs fusion   (navnet efter # i adressen: vaerksted, system, fusion, reaktor, batteri, kosmos)
// Guiderne og rejsen ind i Solen markeres som set, så de ikke dækker billedet.
// Et bestemt fænomen i Kosmos: KOSMOS=mars node tests/vaerktoejer/skaermbilleder.mjs kosmos
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const skærm = process.argv[2] ?? 'vaerksted';
const UD = billedmappe('skaermbilleder');
const STØRRELSER = {
  pc: [1280, 800, false],
  'tablet-langs': [1024, 768, true],
  'tablet-hoejkant': [768, 1024, true],
  'tlf-hoejkant': [390, 844, true],
  'tlf-langs': [844, 390, true],
};
const b = await chromium.launch({ args: ARGS, fuldGrafik: true }); // billederne skal se ud som i spillet
const fejl = [];
for (const [navn, [w, h, touch]] of Object.entries(STØRRELSER)) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push(`${navn} pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(`${navn} ${m.type()}: ${m.text()}`); });
  await page.goto(`${ADRESSE}/?test#${skærm}`);
  await page.evaluate((fænomen) => {
    localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1, batteri: 1 }));
    if (fænomen) localStorage.setItem('atomlabKosmos', fænomen);
  }, process.env.KOSMOS ?? null);
  await page.reload();
  await page.waitForTimeout(Number(process.env.VENT ?? 7000)); // testbrowseren tegner langsomt, så kameraet skal have tid til at zoome færdigt
  const fil = `${UD}/${process.env.KOSMOS ?? skærm}-${navn}.png`;
  await page.screenshot({ path: fil });
  console.log(fil);
  await ctx.close();
}
await b.close();
console.log(fejl.length ? `Konsolfejl:\n${fejl.join('\n')}` : 'Ingen konsolfejl');
process.exit(fejl.length ? 1 : 0);
