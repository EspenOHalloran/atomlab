// Kosmos: alle fænomener kan vælges, alle knapper kan trykkes, og der kommer ingen fejl
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('kosmos');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test`);
await page.waitForTimeout(1200);
tjek('6 kort i menuen', (await page.$$('.menukort .kort')).length === 6);
await page.click('a[href="#kosmos"]');
await page.waitForTimeout(1500);
tjek('kosmos vises', await page.isVisible('#kosmos'));
const ids = await page.evaluate(() => window.atomlabTest.kosmos.fænomener);
tjek('17 fænomener', ids.length === 17, ids);
tjek('17 knapper i listen', (await page.$$('.kosmos-valg')).length === 17);
const K = () => page.evaluate(() => window.atomlabTest.kosmos);
const objekter = {};
for (const id of ids) {
  await page.click(`.kosmos-valg[data-id="${id}"]`);
  await page.waitForTimeout(400);
  const navn = await page.textContent('#kosmosNavn');
  const tekst = await page.textContent('#kosmosTekst');
  tjek(`${id}: navn og tekst`, navn.length > 2 && tekst.length > 100, navn);
  const knapper = await page.evaluate(() => window.atomlabTest.kosmos.knapper());
  // tryk på alle knapper, og spol lidt frem efter hver
  for (let i = 0; i < knapper.length; i++) {
    await page.evaluate((i) => { const k = window.atomlabTest.kosmos; k.tryk(i); k.spol(3); }, i);
  }
  await page.evaluate(() => window.atomlabTest.kosmos.spol(12));
  await page.evaluate(() => window.atomlabTest.kosmos.kameraFrem());
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${UD}/k7-${id}.png` });
  await page.click('[data-kosmos-fane="nørd"]');
  tjek(`${id}: nørd-tekst`, (await page.textContent('#kosmosTekst')).length > 200);
  await page.click('[data-kosmos-fane="kort"]');
  objekter[id] = await page.evaluate(() => window.atomlabTest.kosmos.antalObjekter());
}
// Et nyt fænomen starter på "Kort fortalt", også når man stod på "For nørder"
await page.click('[data-kosmos-fane="nørd"]');
await page.click(`.kosmos-valg[data-id="${ids[0]}"]`);
tjek('nyt fænomen starter på "Kort fortalt"', await page.evaluate(() => document.querySelector('[data-kosmos-fane="kort"]').classList.contains('valgt') && !document.querySelector('[data-kosmos-fane="nørd"]').classList.contains('valgt')));
// Skift frem og tilbage: antallet af objekter må ikke vokse (ingen rester)
await page.evaluate(() => { const k = window.atomlabTest.kosmos; k.vælg('solstorm'); k.vælg('supernova'); k.vælg('solstorm'); });
const igen = await page.evaluate(() => window.atomlabTest.kosmos.antalObjekter());
tjek('ingen rester efter skift', igen <= 30, igen);
// Det valgte fænomen huskes
await page.click('.kosmos-valg[data-id="pulsar"]');
await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForTimeout(1500);
tjek('husker sidste fænomen', (await page.textContent('#kosmosNavn')) === 'Pulsar');
// Hjælp
await page.click('#kosmosHjælp');
await page.waitForTimeout(300);
tjek('hjælp vises', await page.isVisible('#hjælpKosmos'));
await page.keyboard.press('Escape');
// Tilbage til menuen rydder op
await page.click('#kosmos a[href="#"]');
await page.waitForTimeout(800);
tjek('menu igen', await page.isVisible('#menu'));
tjek('kosmos ryddet', (await page.evaluate(() => window.atomlabTest.kosmos.antalObjekter())) === 1);
// Tablet og telefon på højkant: "Kort fortalt / For nørder" står lige over teksten (ikke nederst under citatet)
for (const [navn, vp] of [['tablet', { width: 800, height: 1280 }], ['telefon', { width: 390, height: 844 }]]) {
  const side = await (await b.newContext({ viewport: vp, hasTouch: true, isMobile: true })).newPage();
  side.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  await side.goto(`${ADRESSE}/?test#kosmos`);
  await side.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'));
  await side.evaluate(() => window.atomlabTest.kosmos.vælg('sorthul'));
  const y = await side.evaluate(() => ['#kosmos .del-vælger', '#kosmosTekst', '#kosmosCitat'].map((v) => document.querySelector(v).getBoundingClientRect().top));
  tjek(`${navn} på højkant: "For nørder" står over teksten og citatet`, y[0] < y[1] && y[1] < y[2], JSON.stringify(y));
  await side.context().close();
}
console.log('objekter pr. fænomen', JSON.stringify(objekter));
console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
