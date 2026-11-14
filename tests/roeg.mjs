// Røgtesten: et hurtigt tjek af, at intet er gået helt i stykker (ca. 1 minut). Den køres altid først af koer-alle.mjs --ændret.
// - Uden browser: alle datafiler i js/data/ (også siderne) kan indlæses (fanger fx en syntaksfejl i en tekst, Uranus UN1)
// - I browseren: hver skærm og hvert fænomen i Kosmos og Solsystemet åbner uden fejl i konsollen, og skærmen bliver vist
// Den tjekker ikke, at noget virker rigtigt. Det gør de andre tests.
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// 1. Datafilerne (de bruger ikke Three.js og kan indlæses i Node)
const DATA = fileURLToPath(new URL('../js/data/', import.meta.url));
for (const mappe of ['', 'sider/']) {
  for (const f of readdirSync(DATA + mappe).filter((f) => f.endsWith('.js'))) {
    try {
      await import(pathToFileURL(DATA + mappe + f).href);
      ok++;
    } catch (e) {
      tjek(`js/data/${mappe}${f} kan indlæses`, false, e.message);
    }
  }
}
console.log(`OK   ${ok} datafiler kan indlæses`);

// 2. Skærmene og fænomenerne
const b = await chromium.launch({ args: ARGS });
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
let fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const ingenFejl = (navn) => { tjek(`${navn}: ingen fejl i konsollen`, !fejl.length, fejl.slice(0, 3).join(' | ')); fejl = []; };
// To tegnede billeder, så skærmens første billede også er tegnet
const toBilleder = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

await page.goto(`${ADRESSE}/?test`);
const starter = await page.waitForFunction(() => window.atomlabTest, null, { timeout: 30000 }).then(() => true, () => false);
tjek('programmet starter', starter);
ingenFejl('menuen');
if (!starter) {
  await b.close();
  console.log(`\n${ok} OK, ${dårlig} FEJL`);
  process.exit(1);
}
for (const skærm of ['vaerksted', 'molekyler', 'system', 'fusion', 'reaktor', 'batteri', 'kosmos', 'solsystem', 'ordbog']) {
  await page.evaluate((s) => { location.hash = '#' + s; }, skærm);
  const vist = await page.waitForFunction((s) => !document.getElementById(s).classList.contains('skjult'), skærm, { timeout: 20000 }).then(() => true, () => false);
  await toBilleder();
  tjek(`#${skærm} bliver vist`, vist);
  ingenFejl(`#${skærm}`);
  if (skærm === 'kosmos' || skærm === 'solsystem') {
    const ids = await page.evaluate((s) => atomlabTest[s].alle, skærm); // også dem, der ikke står i listen (hørerTil)
    for (const id of ids) {
      const valgt = await page.evaluate(({ s, id }) => { atomlabTest[s].vælg(id); return atomlabTest[s].valgt(); }, { s: skærm, id });
      await toBilleder();
      if (valgt !== id) tjek(`${skærm}: ${id} kan vælges`, false, valgt);
      else ok++;
      if (fejl.length) ingenFejl(`${skærm}: ${id}`);
    }
    console.log(`OK   ${skærm}: ${ids.length} fænomener åbner`);
  }
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
