// Henfald: tritium henfalder, ion lige efter henfald, stabilitetskortet og opgaverne
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('henfald');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
page.on('dialog', (d) => d.accept());
await page.goto(`${ADRESSE}/#vaerksted`);
await page.waitForTimeout(1000);
const info = () => page.textContent('#infopanel');
const tast = async (k, n) => { for (let i = 0; i < n; i++) await page.keyboard.press(k); };
const ventHenfald = async () => { await page.waitForFunction(() => !document.querySelector('.henfald-knap[disabled]'), null, { timeout: 60000 }); await page.waitForTimeout(200); };

// Tritium → helium-3
await tast('p', 1); await tast('n', 2); await tast('e', 1);
await page.waitForTimeout(500);
let t = await info();
tjek('tritium ustabil med knap', t.includes('Hydrogen-3 (tritium)') && t.includes('Henfald'), t);
tjek('kort-tekst', (await page.textContent('#stabkortTekst')).includes('1 proton og 2 neutroner (2 neutroner pr. proton)'), await page.textContent('#stabkortTekst'));
await page.click('.fane-knap[data-fane="kerne"]');
await page.waitForTimeout(300);
const kortTegnet = await page.evaluate(() => { const c = document.getElementById('stabilitetskort'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; });
tjek('stabilitetskort er tegnet', kortTegnet > 500, kortTegnet);
// Atomet er kun en ion i 1,6 sekunder efter henfaldet. Vi holder øje hele tiden i stedet for at kigge én gang.
const blevIon = page.waitForFunction(() => { const t = document.querySelector('#infopanel').textContent; return t.includes('positiv ion') && t.includes('Hvad er en ion?'); }, null, { timeout: 60000, polling: 50 }).then(() => true, () => false);
await page.click('.henfald-knap');
await page.waitForTimeout(400);
await page.screenshot({ path: UD + '/h1-tritium-ryster.png' });
await ventHenfald();
t = await info();
await page.screenshot({ path: UD + '/h2-tritium-henfaldet.png' });
tjek('blev til helium-3', t.includes('Helium-3') && t.includes('Stabil kerne'), t);
tjek('ion lige efter henfald', await blevIon);
await page.waitForTimeout(6000);
t = await info();
tjek('neutral igen bagefter', t.includes('neutralt atom'), t);
const fr = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('opgaver tritium + henfald løst', fr.opgaver.tritium && fr.opgaver.henfald, JSON.stringify(fr.opgaver));

// Hjælpelinks
await page.click('.fane-knap[data-fane="kerne"]');
tjek('sidste henfald står i Kerne-fanen', (await page.textContent('#sidsteHenfald')).includes('Hydrogen-3 (tritium) → Helium-3'), await page.textContent('#sidsteHenfald'));
tjek('ingen scrollbar i infopanelet', await page.evaluate(() => { const i = document.getElementById('infopanel'); return i.scrollHeight <= i.clientHeight + 1; }));
await page.screenshot({ path: UD + '/r1-kerne-fane.png' });
await page.click('#stabilitetskort');
await page.click('[data-hjælp="hjælpNeutroner"]');
await page.waitForTimeout(800);
tjek('hjælp åbner ved neutroner', await page.isVisible('#hjælpNeutroner'));
await page.screenshot({ path: UD + '/h3-hjælp-neutroner.png' });
await page.keyboard.press('Escape');

// Carbon-14 → nitrogen-14 med tasten H
await page.click('#knapRyd');
await tast('p', 6); await tast('n', 8); await tast('e', 6);
await page.waitForTimeout(300);
await page.keyboard.press('h');
await ventHenfald();
t = await info();
tjek('C-14 → N-14', t.includes('Nitrogen-14'), t);

// Uran-238-kæden til bly-206
await page.click('#knapRyd');
await tast('p', 92); await page.click('#knapStabil'); await page.click('#knapNeutral');
await page.waitForTimeout(1500);
tjek('uran-238 bygget', (await info()).includes('Uran-238'));
const rækkefølge = [];
for (let i = 0; i < 20; i++) {
  if (!(await page.$('.henfald-knap'))) break;
  await page.keyboard.press('h');
  await ventHenfald();
  rækkefølge.push((await page.textContent('#infoNavn')) + '-' + (Number(await page.textContent('#antalP')) + Number(await page.textContent('#antalN'))));
}
console.log('     ', rækkefølge.join(' → '));
t = await info();
tjek('endte som bly-206', t.includes('Bly-206') && t.includes('Stabil kerne'), t);
await page.waitForTimeout(500);
const fr2 = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('kæde-opgave løst', fr2.opgaver['uran-kaede'], JSON.stringify(fr2.opgaver));
await page.screenshot({ path: UD + '/h4-bly.png' });

// Alfahenfald-skærmbillede midt i
await page.click('#knapRyd');
await page.click('#minitabel .felt[data-nr="92"]');
await page.waitForTimeout(2500);
await page.keyboard.press('h');
await page.waitForTimeout(5200);
await page.screenshot({ path: UD + '/h5-alfa.png' });
await ventHenfald();

// Start opgaverne forfra
await page.click('#knapOpgaver');
await page.click('#knapOpgaverForfra');
await page.waitForTimeout(500);
const fr3 = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('opgaver nulstillet, grundstoffer beholdt', Object.keys(fr3.opgaver).length === 0 && fr3.opdaget.length > 5, JSON.stringify(fr3));
tjek('tæller 0/16', (await page.textContent('#opgaveTæller')) === '0/16', await page.textContent('#opgaveTæller'));
tjek('opgaveliste lukket', !(await page.isVisible('#opgaveliste')));

// Opgaven kan foldes sammen og huskes
await page.click('#knapOpgaveFold');
tjek('opgave foldet', await page.evaluate(() => document.getElementById('opgavePille').classList.contains('foldet') && localStorage.getItem('atomlabOpgaveFoldet') === 'ja'));
await page.click('#knapOpgaveFold');
// Fakta-fanen
await page.click('.fane-knap[data-fane="fakta"]');
await page.screenshot({ path: UD + '/r3-fakta-fane.png' });
// Ion-hjælp
await page.click('#knapRyd');
await tast('p', 11); await tast('n', 12); await tast('e', 10);
await page.waitForTimeout(300);
await page.click('.fane-knap[data-fane="atom"]');
await page.screenshot({ path: UD + '/r2-atom-fane-ion.png' });
await page.click('[data-hjælp="hjælpIoner"]');
await page.waitForTimeout(800);
tjek('ion-hjælp vises', await page.isVisible('#hjælpIoner'));
await page.screenshot({ path: UD + '/h6-ion-hjælp.png' });
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
