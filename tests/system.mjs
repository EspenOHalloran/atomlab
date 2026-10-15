// Det periodiske system på pc: væggen, etiketter, grundstofkort, filtre og opgaven "byg jern"
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('system');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/`);
await page.waitForTimeout(800);
await page.click('a.kort[href="#system"]');
await page.waitForTimeout(9000);
await page.screenshot({ path: UD + '/s1-væg.png' });
tjek('væggen vises', await page.isVisible('#system'));
// Find jern ved at føre musen hen over væggen
const hul = await page.evaluate(() => { const r = document.getElementById('systemVindue').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; });
let fundet = null;
for (const dx of [-81, -70, -90, -100, -60]) {
  await page.mouse.move(hul.x + dx, hul.y - 81 * hul.h / 630);
  await page.waitForTimeout(400);
  const t = await page.textContent('#systemEtiket');
  if (t.includes('Jern')) { fundet = dx; break; }
  console.log('     under musen:', t);
}
tjek('etiket ved jern', fundet !== null);
await page.waitForTimeout(1500);
await page.screenshot({ path: UD + '/s2-svæv.png' });
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(6000);
tjek('detaljevisning', await page.evaluate(() => document.getElementById('system').classList.contains('detalje')));
tjek('jern-kort', (await page.textContent('#sysNavn')).includes('Jern') && (await page.textContent('#sysTal')).includes('Findes'), await page.textContent('#systemKort'));
await page.screenshot({ path: UD + '/s3-jern.png' });
await page.click('#systemNæste');
await page.waitForTimeout(3000);
tjek('næste er cobalt', (await page.textContent('#sysNavn')).includes('Cobalt'));
await page.click('#systemLuk');
await page.waitForTimeout(3000);
await page.click('#systemFiltre .filter[data-værdi="aedelgas"]');
await page.waitForTimeout(2500);
tjek('filter ædelgasser', (await page.textContent('#systemAntal')).includes('6 grundstoffer'), await page.textContent('#systemAntal'));
await page.screenshot({ path: UD + '/s4-filter.png' });
await page.click('#systemFiltre .filter[data-værdi="aedelgas"]');
// Åbn uran (ikke opdaget) og send til værkstedet
await page.keyboard.press('Escape');
await page.evaluate(() => {});
// Klik på jern igen og gå til værkstedet
await page.mouse.move(hul.x + fundet, hul.y - 81 * hul.h / 630);
await page.waitForTimeout(500);
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(2500);
await page.click('#systemByg');
await page.waitForTimeout(2500);
tjek('værksted med opgave', location => true);
tjek('opgave: byg jern', (await page.textContent('#opgaveTekst')).includes('Byg Jern-56'), await page.textContent('#opgaveTekst'));
for (let i = 0; i < 26; i++) await page.keyboard.press('p');
await page.click('#knapStabil'); await page.click('#knapNeutral');
await page.waitForTimeout(1500);
const fr = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('jern opdaget', fr.opdaget.includes(26));
await page.goto(`${ADRESSE}/#system`);
await page.waitForTimeout(6000);
tjek('stjerne-tæller', (await page.textContent('#systemOpdaget')).includes('1 af 118'), await page.textContent('#systemOpdaget'));
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
