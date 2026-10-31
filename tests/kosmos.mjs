// Kosmos: alle fænomener kan vælges, alle knapper kan trykkes, og der kommer ingen fejl. Styringen står i 3D-billedet
// (U2 i docs/plan-ux.md): Styr-boksen har kun kontakter og skydere, og bjælken står der også med "Kun grafik".
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
tjek('8 kort i menuen', (await page.$$('.menukort .kort')).length === 8);
await page.click('a[href="#kosmos"]');
await page.waitForTimeout(1500);
tjek('kosmos vises', await page.isVisible('#kosmos'));
const ids = await page.evaluate(() => window.atomlabTest.kosmos.fænomener);
tjek('11 fænomener', ids.length === 11, ids);
tjek('vores eget solsystem er flyttet', !ids.some((id) => ['aarstider', 'formoerkelser', 'solstorm', 'solensfremtid', 'mars', 'saturn'].includes(id)), ids);
tjek('11 knapper i listen', (await page.$$('#kosmos .kosmos-valg')).length === 11);
const K = () => page.evaluate(() => window.atomlabTest.kosmos);
const objekter = {};
for (const id of ids) {
  await page.click(`.kosmos-valg[data-id="${id}"]`);
  await page.waitForTimeout(400);
  const navn = await page.textContent('#kosmosNavn');
  const tekst = await page.textContent('#kosmosTekst');
  tjek(`${id}: navn og tekst`, navn.length > 2 && tekst.length > 100, navn);
  const knapper = await page.evaluate(() => window.atomlabTest.kosmos.knapper());
  const styr = await page.evaluate(() => window.atomlabTest.kosmos.styr());
  tjek(`${id}: Styr-boksen har kun kontakter og skydere`, styr.every((x) => x.slags === 'kontakt' || x.slags === 'skyder'), JSON.stringify(styr));
  const bjælke = await page.evaluate(() => window.atomlabTest.kosmos.bjælke());
  tjek(`${id}: bjælken har en handling (fx "Start")`, bjælke.length > 0 && !bjælke[0].slået, JSON.stringify(bjælke));
  // tryk på alle knapper (efter teksten), og spol lidt frem efter hver
  for (const tekst of knapper) {
    await page.evaluate((t) => { const k = window.atomlabTest.kosmos; k.trykPå(t); k.spol(3); }, tekst);
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
tjek('"Prøv selv" og pauseknappen i panelet er væk', !(await page.$('#kosmosStyring')) && !(await page.$('#kosmosPause')));
// "Kun grafik": bjælken og tidsknappen står stadig i billedet (før stod "Næste ›" kun der i "Kun grafik")
await page.evaluate(() => window.atomlabTest.kosmos.vælg('supernova'));
await page.click('#kosmos .knap-kungrafik');
tjek('"Kun grafik": bjælken og tidsknappen ses', await page.isVisible('#kosmosBjælke button:has-text("eksplodere")') && await page.isVisible('#kosmosTid'));
await page.click('#kosmosBjælke button:has-text("eksplodere")');
tjek('"Kun grafik": et tryk i bjælken virker', (await page.evaluate(() => window.atomlabTest.kosmos.bjælke())).some((x) => x.tekst.includes('Ny stjerne')));
await page.click('#kosmos .knap-kungrafik');
// Styr-boksen: åben på pc, og en kontakt er fyldt med ✓, når den er tændt
await page.evaluate(() => window.atomlabTest.kosmos.vælg('kvasar'));
tjek('Styr-boksen er åben på pc', await page.evaluate(() => window.atomlabTest.kosmos.styrÅben()));
await page.click('#kosmosStyr .kontakt:has-text("Zoom ind")');
const kontakt = await page.evaluate(() => { const k = [...document.querySelectorAll('#kosmosStyr .kontakt')].find((x) => x.textContent.includes('Zoom ind')); return { til: k.getAttribute('aria-checked'), flueben: getComputedStyle(k.querySelector('.kontakt-boks'), '::after').content }; });
tjek('en tændt kontakt har ✓ og aria-checked', kontakt.til === 'true' && kontakt.flueben.includes('✓'), JSON.stringify(kontakt));
// Et nyt fænomen starter på "Kort fortalt", også når man stod på "For nørder"
await page.click('[data-kosmos-fane="nørd"]');
await page.click(`.kosmos-valg[data-id="${ids[0]}"]`);
tjek('nyt fænomen starter på "Kort fortalt"', await page.evaluate(() => document.querySelector('[data-kosmos-fane="kort"]').classList.contains('valgt') && !document.querySelector('[data-kosmos-fane="nørd"]').classList.contains('valgt')));
// Skift frem og tilbage: antallet af objekter må ikke vokse (ingen rester)
await page.evaluate(() => { const k = window.atomlabTest.kosmos; k.vælg('pulsar'); k.vælg('supernova'); k.vælg('pulsar'); });
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
  // Styr-boksen er foldet sammen til "Styr", og et tryk folder den ud
  const foldet = !(await side.evaluate(() => window.atomlabTest.kosmos.styrÅben()));
  await side.click('#kosmosStyr > summary');
  tjek(`${navn} på højkant: Styr-boksen er foldet sammen og kan foldes ud`, foldet && await side.evaluate(() => window.atomlabTest.kosmos.styrÅben()));
  await side.context().close();
}
console.log('objekter pr. fænomen', JSON.stringify(objekter));
console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
