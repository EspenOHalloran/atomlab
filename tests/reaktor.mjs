// Reaktoren: spalt uran-235, uran-238, kædereaktion, nødstop og hjælpen
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('reaktor');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
page.on('dialog', (d) => d.accept());
await page.goto(`${ADRESSE}/?test`);
await page.waitForTimeout(600);
await page.click('a.kort[href="#reaktor"]');
await page.waitForTimeout(6000);
await page.screenshot({ path: UD + '/r1-uran.png' });
const forklaring = () => page.textContent('#reaktorForklaring');
const fr = () => page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver || {});
// Spalt uran-235 (prøv op til 4 gange, for 1 ud af 7 bliver bare fanget)
let spaltet = false;
for (let i = 0; i < 4 && !spaltet; i++) {
  await page.click('#reaktorIgen');
  await page.click('#reaktorSkyd');
  for (let j = 0; j < 30 && !spaltet; j++) {
    await page.waitForTimeout(1000);
    spaltet = (await forklaring()).includes('Protoner:');
    if ((await forklaring()).includes('Fanget uden at spalte')) break;
  }
}
tjek('uran-235 spaltet', spaltet, await forklaring());
tjek('protoner og nukleoner går op', (await forklaring()).includes('= 92') && (await forklaring()).includes('= 236'));
await page.waitForTimeout(2500);
await page.screenshot({ path: UD + '/r2-spaltet.png' });
tjek('opgave spalt', (await fr())['r-spalt']);
// Uran-238
await page.click('[data-kerne-valg="u238"]');
await page.click('#reaktorSkyd');
for (let j = 0; j < 30; j++) { await page.waitForTimeout(1000); if ((await forklaring()).includes('uran-239')) break; }
tjek('uran-238 fanger neutronen', (await forklaring()).includes('plutonium-239'), await forklaring());
// Kædereaktion
await page.click('.del-knap[data-del="kæde"]');
await page.waitForTimeout(4000);
await page.click('#reaktorStart');
await page.waitForTimeout(6000);
await page.screenshot({ path: UD + '/r3-kæde.png' });
tjek('opgave start', (await fr())['r-start']);
const r = await page.evaluate(() => atomlabTest.reaktor.kør(40, 0));
console.log('     stave 0 % i 40 s:', JSON.stringify(r));
tjek('nødstop ved stave helt oppe', r.nødstop);
await page.waitForTimeout(1500);
tjek('opgave nødstop', (await fr())['r-nødstop']);
await page.screenshot({ path: UD + '/r4-nødstop.png' });
await page.click('#reaktorHjælp');
await page.waitForTimeout(400);
tjek('hjælp vises', await page.isVisible('#hjælpReaktor'));
await page.keyboard.press('Escape');
// "Vis mig" i kædereaktionen: Den første neutron skal altid spalte (før blev den slugt af vandet i ca. 1,5 % af gangene).
// 200 forsøg fanger den gamle fejl ca. 95 % af gangene.
const døde = await page.evaluate(() => {
  const t = atomlabTest.reaktor;
  t.tilstand('kæde');
  let antal = 0;
  for (let i = 0; i < 200; i++) {
    t.nulstil(); t.spol(0.5);
    t.visMig();
    for (let tid = 0; tid < 4; tid += 0.05) { t.spol(0.05); if (!t.visning().kæde) break; }
    const v = t.visning();
    if (!(v.kæde && v.kæde.length >= 2)) antal++;
    t.spol(10);
  }
  return antal;
});
tjek('Vis mig: kædereaktionen kommer i gang 200 af 200 gange', døde === 0, `${døde} døde ud`);
// Kosmos har også knapper med klassen del-knap ("Kort fortalt" og "For nørder"). De må ikke ændre Reaktoren.
await page.evaluate(() => { location.hash = '#kosmos'; });
await page.waitForTimeout(1500);
await page.click('[data-kosmos-fane="nørd"]');
await page.evaluate(() => { location.hash = '#reaktor'; });
await page.waitForTimeout(1500);
const del = await page.evaluate(() => ({
  valgt: [...document.querySelectorAll('#reaktor .del-knap.valgt')].map((k) => k.dataset.del),
  synlige: [...document.querySelectorAll('[data-reaktor-del]')].filter((e) => !e.classList.contains('skjult')).length,
  nørdValgt: document.querySelector('[data-kosmos-fane="nørd"]').classList.contains('valgt'),
}));
tjek('Reaktoren har stadig en valgt del efter Kosmos', del.valgt.length === 1 && del.synlige >= 1, JSON.stringify(del));
tjek('Kosmos husker sin fane', del.nørdValgt, JSON.stringify(del));
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
