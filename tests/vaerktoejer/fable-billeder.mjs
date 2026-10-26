// Billeder til Fables eftersyn (docs/plan-fable.md): alle skærme, de 15 fænomener i Kosmos og nogle forløb i træk.
// Brug: node tests/vaerktoejer/fable-billeder.mjs   (serveren skal køre, se tests/README.md)
// Billederne gemmes som JPG i docs/fable/billeder/ sammen med en liste (LISTE.md), der siger, hvad hvert billede viser.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const UD = fileURLToPath(new URL('../../docs/fable/billeder/', import.meta.url));
rmSync(UD, { recursive: true, force: true });
mkdirSync(UD, { recursive: true });
const STØRRELSER = { pc: [1280, 800, false], tablet: [768, 1024, true], tlf: [390, 844, true] };
const VENT = Number(process.env.VENT ?? 7000); // testbrowseren tegner langsomt, så kameraet skal have tid til at zoome færdigt
const liste = [];
const fejl = [];
let nr = 0;

const b = await chromium.launch({ args: ARGS, fuldGrafik: true }); // billederne skal se ud som i spillet

async function nySide(størrelse) {
  const [w, h, touch] = STØRRELSER[størrelse];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push(`${størrelse} pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push(`${størrelse} ${m.text()}`); });
  await page.goto(`${ADRESSE}/?test`);
  // Guiderne og rejsen ind i Solen er set, så de ikke dækker billedet
  await page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1 })));
  await page.reload();
  await page.waitForFunction(() => window.atomlabTest);
  page.størrelse = størrelse;
  return page;
}

async function gåTil(page, skærm) {
  await page.evaluate((s) => { location.hash = s; }, skærm);
  await page.waitForTimeout(1500);
}

async function skud(page, navn, tekst) {
  const fil = `${String(++nr).padStart(2, '0')}-${navn}-${page.størrelse}.jpg`;
  await page.screenshot({ path: UD + fil, type: 'jpeg', quality: 80 });
  liste.push(`| ${fil} | ${tekst} |`);
  console.log(fil);
}

// Byg et atom i værkstedet med tasterne P, N og E (først ryddes det gamle)
async function byg(page, p, n, e) {
  await page.click('#knapRyd');
  await page.evaluate(() => atomlabTest.vaerksted.spol(2));
  for (const [tast, antal] of [['p', p], ['n', n], ['e', e]]) for (let i = 0; i < antal; i++) await page.keyboard.press(tast);
  await page.evaluate(() => atomlabTest.vaerksted.spol(4));
}

// ---------- 1. Menuen og de seks skærme på pc og tablet på højkant, og nogle på telefon ----------
const SKÆRME = [
  ['menu', '', 'Menuen'],
  ['vaerksted', '#vaerksted', 'Atomværkstedet med carbon-12 (6 protoner, 6 neutroner, 6 elektroner)'],
  ['system', '#system', 'Det periodiske system: den buede væg'],
  ['fusion', '#fusion', 'Stjerneovnen, som den ser ud, når man kommer ind (guiden og rejsen ind i Solen er sprunget over)'],
  ['reaktor', '#reaktor', 'Reaktoren, del 1 "Spalt én kerne"'],
  ['batteri', '#batteri', 'Batteriet under opladning (ca. halvt opladet)'],
  ['solsystem', '#solsystem', 'Solsystemet med Årstiderne valgt'],
  ['kosmos', '#kosmos', 'Kosmos med Big Bang valgt'],
];
async function forbered(page, navn) {
  if (navn === 'vaerksted') await byg(page, 6, 6, 6);
  if (navn === 'batteri') await page.evaluate(() => { atomlabTest.batteri.tilstand('oplad'); atomlabTest.batteri.kør(7); });
  if (navn === 'solsystem') await page.evaluate(() => atomlabTest.solsystem.vælg('aarstider'));
  if (navn === 'kosmos') await page.evaluate(() => atomlabTest.kosmos.vælg('bigbang'));
}
for (const størrelse of ['pc', 'tablet', 'tlf']) {
  const page = await nySide(størrelse);
  for (const [navn, hash, tekst] of SKÆRME) {
    if (størrelse === 'tlf' && !['menu', 'vaerksted', 'fusion', 'solsystem', 'kosmos'].includes(navn)) continue;
    await gåTil(page, hash);
    await forbered(page, navn);
    await page.waitForTimeout(VENT);
    if (navn === 'kosmos' || navn === 'solsystem') { await page.evaluate((n) => atomlabTest[n].kameraFrem(), navn); await page.waitForTimeout(1000); }
    await skud(page, navn, tekst);
  }
  await page.context().close();
}

// ---------- 2. Fænomenerne i Kosmos og Solsystemet på pc ----------
// For hvert fænomen: knapper, der trykkes på (nummer i "Prøv selv"), og hvor mange sekunder der spoles frem
const FÆNOMENER = [
  ['bigbang', [0, 1, 1, 1, 1], 4, 'Big Bang efter fem trin med "Næste"'],
  ['stjernefoedsel', [1], 10, 'Stjernefødsel: skyen falder sammen'],
  ['aarstider', [], 2, 'Årstiderne, første trin'],
  ['formoerkelser', [0], 3, 'Formørkelser: solformørkelse'],
  ['solstorm', [0], 3, 'Solstorm på vej mod Jorden'],
  ['solensfremtid', [], 2, 'Solens fremtid, første trin'],
  ['hviddvaerg', [0], 6, 'Hvid dværg, der suger gas fra en nabo'],
  ['supernova', [1], 2, 'Supernova: Betelgeuse med lagene vist'],
  ['pulsar', [4], 2, 'Pulsar med magnetfeltet vist'],
  ['kilonova', [0], 4, 'Kilonova: to neutronstjerner støder sammen'],
  ['rumtid', [1, 2], 4, 'Rumtid: et sort hul i gummidugen og en planet'],
  ['tyngdebolger', [0], 4, 'Tyngdebølger: to sorte huller smelter sammen'],
  ['sorthul', [2], 2, 'Sort hul med navne vist'],
  ['kvasar', [], 2, 'Kvasar'],
  ['ormehul', [0], 3, 'Ormehul: kapløbet er i gang'],
];
{
  const page = await nySide('pc');
  for (const [id, knapper, sek, tekst] of FÆNOMENER) {
    // Vores eget solsystem ligger i Solsystemet, resten i Kosmos
    const sk = await page.evaluate((id) => (atomlabTest.solsystem.fænomener.includes(id) ? 'solsystem' : 'kosmos'), id);
    await gåTil(page, `#${sk}`);
    await page.evaluate(([id, sk]) => atomlabTest[sk].vælg(id), [id, sk]);
    await page.waitForTimeout(1000);
    for (const i of knapper) await page.evaluate(([i, sk]) => atomlabTest[sk].tryk(i), [i, sk]);
    await page.evaluate(([s, sk]) => { atomlabTest[sk].spol(s); atomlabTest[sk].kameraFrem(); }, [sek, sk]);
    await page.waitForTimeout(2500);
    await skud(page, `kosmos-${id}`, tekst);
  }
  await page.context().close();
}

// ---------- 3. Forløb i træk på pc ----------
{
  const page = await nySide('pc');

  // Et betahenfald: carbon-14 bliver til nitrogen-14
  await gåTil(page, '#vaerksted');
  await byg(page, 6, 8, 6);
  await page.waitForTimeout(3000);
  await skud(page, 'henfald-a', 'Henfald 1/4: carbon-14 før henfaldet');
  await page.keyboard.press('h');
  for (const [sek, del] of [[0.6, '2/4'], [0.8, '3/4'], [2.5, '4/4']]) {
    await page.evaluate((s) => atomlabTest.vaerksted.spol(s), sek);
    await page.waitForTimeout(1500);
    await skud(page, `henfald-${'bcd'[Number(del[0]) - 2]}`, `Henfald ${del}: ${sek} s senere`);
  }

  // En fusion med "Vis mig" i Stjerneovnen
  await gåTil(page, '#fusion');
  await page.waitForTimeout(3000);
  await page.evaluate(() => atomlabTest.fusion.visMig());
  for (const [sek, del] of [[1.5, '1/4'], [2, '2/4'], [0.7, '3/4'], [0.7, '4/4']]) {
    await page.evaluate((s) => atomlabTest.fusion.spolAlt(s), sek);
    await page.waitForTimeout(1500);
    await skud(page, `fusion-${'abcd'[Number(del[0]) - 1]}`, `"Vis mig" i Stjerneovnen ${del}`);
  }

  // En kædereaktion med "Vis mig" i Reaktoren
  await gåTil(page, '#reaktor');
  await page.click('.del-knap[data-del="kæde"]');
  await page.waitForTimeout(3000);
  await page.evaluate(() => atomlabTest.reaktor.visMig());
  for (const [sek, del] of [[2, '1/4'], [4, '2/4'], [6, '3/4'], [12, '4/4']]) {
    await page.evaluate((s) => atomlabTest.reaktor.spol(s), sek);
    await page.waitForTimeout(1500);
    await skud(page, `kaede-${'abcd'[Number(del[0]) - 1]}`, `Kædereaktion med "Vis mig" ${del}`);
  }

  // Supernova og Big Bang i Kosmos
  await gåTil(page, '#kosmos');
  for (const [id, sekvens, navn] of [
    ['supernova', [[1, 'Kernen falder sammen'], [2, 'Chokbølgen'], [4, 'Eksplosionen'], [12, 'Tågen og neutronstjernen']], 'Supernova'],
    ['bigbang', [[3, 'Starten'], [4, 'Næste trin'], [4, 'Næste trin'], [4, 'Næste trin']], 'Big Bang'],
  ]) {
    await page.evaluate((id) => { atomlabTest.kosmos.vælg(id); atomlabTest.kosmos.tryk(0); }, id);
    let i = 0;
    for (const [sek, tekst] of sekvens) {
      if (id === 'bigbang' && i > 0) await page.evaluate(() => atomlabTest.kosmos.tryk(1)); // Big Bang går frem med "Næste"
      await page.evaluate((s) => { atomlabTest.kosmos.spol(s); atomlabTest.kosmos.kameraFrem(); }, sek);
      await page.waitForTimeout(2000);
      await skud(page, `${id}-${'abcd'[i]}`, `${navn} ${++i}/4: ${tekst}`);
    }
  }
  await page.context().close();
}

await b.close();
writeFileSync(UD + 'LISTE.md', `# Skærmbilleder til Fable

Taget med \`tests/vaerktoejer/fable-billeder.mjs\` i testbrowseren, der ikke har et rigtigt grafikkort. Gløden og farverne kan derfor se lidt anderledes ud end på en rigtig skærm, og animationerne er spolet frem (de kører ikke i realtid). Størrelser: pc 1280 × 800, tablet på højkant 768 × 1024, telefon på højkant 390 × 844.

| Fil | Hvad billedet viser |
|---|---|
${liste.join('\n')}
`);
console.log(fejl.length ? `Konsolfejl:\n${fejl.join('\n')}` : 'Ingen konsolfejl');
