// Billeder af Mars' måner (M6a) med fuld grafik: begge baner, Phobos og Deimos tæt på og Phobos i Mars' skygge.
// Kør: node tests/vaerktoejer/maaner.mjs [mappe]   (serveren skal køre: python -m http.server 8765)
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';
import { mkdirSync } from 'node:fs';
const UD = process.argv[2] ?? 'tests/billeder/maaner';
mkdirSync(UD, { recursive: true });
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => console.log('pageerror', e.message));
s.on('console', (m) => { if (m.type() === 'error') console.log('konsol', m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
const fm = (f, a) => s.evaluate(f, a);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.måner().every((m) => m.form && m.kort), null, { timeout: 120000 });
const vent = async () => { await fm(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForTimeout(1500); };
await s.click('#solsystemStyring button:text-is("Drej Mars")'); // står stille, så billederne kan sammenlignes
await s.click('#solsystemStyring button:text-is("Månerne")');
await vent();
await s.screenshot({ path: `${UD}/1-maanerne.png` });
for (const id of ['phobos', 'deimos']) {
  if (id !== 'phobos') {
    await s.click('#solsystemStyring button:text-is("Månerne")');
    await vent();
  }
  const p = await fm((id) => atomlabTest.solsystem.fænomen().månePlads(id), id);
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(300);
  await vent();
  await s.screenshot({ path: `${UD}/2-${id}.png` });
  if (process.env.UDEN_KORT) {
    await fm(async () => { const { verden } = await import('/js/scene3d.js'); verden.scene.traverse((o) => { if (o.material?.uniforms?.uHarKort) o.material.uniforms.uHarKort.value = 0; }); });
    await s.waitForTimeout(800);
    await s.screenshot({ path: `${UD}/2-${id}-uden-kort.png` });
    await fm(async () => { const { verden } = await import('/js/scene3d.js'); verden.scene.traverse((o) => { if (o.material?.uniforms?.uHarKort) o.material.uniforms.uHarKort.value = 1; }); });
  }
  await s.keyboard.down('ArrowLeft');
  await s.waitForTimeout(1500);
  await s.keyboard.up('ArrowLeft');
  await s.waitForTimeout(800);
  await s.screenshot({ path: `${UD}/3-${id}-drejet.png` });
}
console.log(JSON.stringify(await fm(() => atomlabTest.solsystem.fænomen().måner())));
await b.close();
