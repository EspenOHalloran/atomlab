// Knaldgassen i Ild (Molekyler M3 og M4, flyttet fra "Del elektroner" til Ild 19. november 2026, PR 3): linket i
// Molekyler åbner den i Ild, ingenting sker uden gnist, gnisten og kæden, måleren og energien, tidsknappen, de to opgaver
// (★), kortet om Jordens vand med linket til Kosmos, "Tilbage til bordet", luppens knap og turens vej, panelerne uden
// rullebjælke på pc og tablet, og måleren inde på skærmen på tablet og telefon.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
const browser = await chromium.launch({ args: ARGS });
const fejl = [];
let ok = 0, dårlig = 0;
function tjek(navn, betingelse, ekstra = '') { if (betingelse) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } }
const nær = (a, b, tol) => Math.abs(a - b) <= tol;

async function side(opts, adresse = `${ADRESSE}/index.html?test#molekyler`) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => fejl.push('requestfailed: ' + r.url()));
  await page.goto(adresse);
  return { ctx, page };
}
async function ingenRul(p, navn, ider = ['knaldInfo', 'knaldPanel'], lagene = ['knald-nørd', 'knald-ærligt']) {
  const rul = () => p.evaluate((ider) => ider.map((id) => { const el = document.getElementById(id); return el.scrollHeight <= el.clientHeight + 1 ? '' : `${id} ${el.scrollHeight}/${el.clientHeight}`; }).join(''), ider);
  const r = [await rul()];
  for (const lag of lagene) {
    await p.click(`[data-lag="${lag}"] summary`);
    r.push(await rul());
  }
  await p.click(`[data-lag="${lagene[1]}"] summary`);
  tjek(`${navn}: panelerne uden rullebjælke (også med en foldeboks åben)`, r.every((x) => !x), r.join(' | '));
}

// ---------- pc: fra Molekyler til Ild ----------
const { ctx, page } = await side({ viewport: { width: 1280, height: 800 } });
await page.waitForFunction(() => window.atomlabTest?.molekyler?.byg, null, { timeout: 20000 });
await page.evaluate(async () => { (await import('./js/fremgang.js')).nulstilFremgang(); });
const KG = (f, ...a) => page.evaluate(([f, a]) => window.atomlabTest.ild.knaldgas[f](...a), [f, a]);
const synlig = (...sel) => Promise.all(sel.map((x) => page.isVisible(x))).then((l) => l.every(Boolean));
const løst = (id) => page.evaluate(async (id) => (await import('./js/fremgang.js')).erLøst(id), id);
const stjerne = (id) => page.textContent(`#knaldOpgaver .byg-opgave[data-byg-opgave="${id}"] .bo-stjerne`);

await page.click('#bygKnaldgas');
await page.waitForFunction(() => location.hash === '#ild' && window.atomlabTest?.ild?.knaldgas?.aktiv(), null, { timeout: 20000 });
await page.waitForTimeout(300);
tjek('"Knaldgas i Ild ›" i Molekyler åbner knaldgassen i Ild med boksen, måleren og dens paneler i stedet for bordets',
  await KG('aktiv') && await synlig('#knaldPanel', '#knaldInfo', '#knaldMåler', '#knaldTid', '#knaldMission')
  && !(await page.isVisible('#ild-bord')) && !(await page.isVisible('#ildTitel')) && !(await page.isVisible('#ildTid')) && !(await page.evaluate(() => atomlabTest.ild.tilstand().synlig)));
await KG('forfra', 11);
let k = await KG('boks');
tjek('boksen: 4 H₂ og 2 O₂ (8 H og 4 O), måleren står på 0', k.tæl.H2 === 4 && k.tæl.O2 === 2 && k.atomer.H === 8 && k.atomer.O === 4 && k.brudt === 0 && (await page.textContent('#knaldForskel')) === '0,0 eV');
await KG('spol', 12);
k = await KG('boks');
tjek(`uden gnist: ${k.stød} stød, ingen reaktioner, stadig 4 H₂ og 2 O₂, energien bevaret`, k.stød >= 20 && k.reaktioner === 0 && k.tæl.H2 === 4 && k.tæl.O2 === 2 && Math.abs(k.energi - k.forventet) < 1e-9);
tjek('opgaven "Intet sker uden gnist" er klaret (★), og panelet siger det', await løst('byg-uden-gnist') && (await stjerne('byg-uden-gnist')) === '★'
  && (await page.textContent('#knaldTitel')).includes('ingenting') && await page.isVisible('#knaldMission .mission-vis'));
await page.click('#knaldTid [data-tid="pause"]');
await page.click('#knaldMission .mission-vis'); // "Vis mig" giver gnisten
k = await KG('boks');
const tPause = await KG('tid');
await KG('spol', 1);
tjek('"Vis mig" giver en gnist (to frie H, "Gnist" slået fra), og under pause står kæden stille', k.tændt && k.tæl.H === 2 && k.tæl.H2 === 3 && await page.isDisabled('#knaldGnist') && (await KG('tid')) === tPause && (await KG('boks')).reaktioner === k.reaktioner);
await page.click('#knaldTid [data-tid="spil"]');
await KG('spol', 40);
await page.waitForTimeout(400);
k = await KG('boks');
tjek(`kæden ender med 4 H₂O og intet tilbage, måleren viser +10,0 eV, og energien er bevaret`, k.færdig && k.tæl.H2O === 4 && k.radikaler === 0 && nær(k.forskel, 10.024, 1e-3)
  && (await page.textContent('#knaldForskel')) === '+10,0 eV' && Math.abs(k.energi - k.forventet) < 1e-9 && k.varme > 50);
tjek('opgaven "Tænd knaldgassen" er klaret, tælleren viser 2/2', await løst('byg-knaldgas') && (await page.textContent('#knaldOpgaveTæller')) === '2/2');
tjek('M4: knappen "Hvor kom Jordens vand fra?" vises, når alt er vand', await page.isVisible('#knaldJordensVand') && !(await page.isVisible('#knaldInfo [data-hvorfor="knaldBakke"]')));
await ingenRul(page, 'pc, knaldgassen');
await page.click('#knaldTilbage');
await page.waitForTimeout(500);
tjek('"‹ Tilbage til bordet" viser bordet med stearinlyset og dets paneler igen', !(await KG('aktiv')) && (await page.evaluate(() => atomlabTest.ild.scene())) === 'bord' && await page.isVisible('#ild-bord') && !(await page.isVisible('#knaldPanel')) && (await page.evaluate(() => atomlabTest.ild.tilstand().synlig)));
// Luppens knap åbner knaldgassen, og linket i kortet om Jordens vand åbner "Ny stjerne" i Kosmos
await page.evaluate(() => atomlabTest.ild.vælgScene('atomer'));
await page.click('#ildKnaldgas');
await page.waitForFunction(() => atomlabTest.ild.knaldgas.aktiv(), null, { timeout: 10000 });
await KG('forfra', 4);
await KG('gnist');
await KG('spol', 30);
await page.click('#knaldJordensVand');
await page.click('#hvorforKort .hk-link');
await page.waitForFunction(() => location.hash === '#kosmos' && window.atomlabTest?.kosmos?.valgt() === 'stjernefoedsel', null, { timeout: 15000 }).catch(() => {});
tjek('"Hydrogen: knaldgassen ›" i luppen åbner den, og linket om Jordens vand åbner "Ny stjerne" i Kosmos og stopper knaldgassen',
  await page.evaluate(() => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt() === 'stjernefoedsel') && !(await KG('aktiv')));
// "Din fremgang": Molekyler har 11 opgaver, Ild knaldgassens 2
await page.evaluate(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
await page.click('.menu-fremgang-knap');
await page.waitForTimeout(400);
const linjer = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.fremgang-linje')].map((l) => [l.dataset.del, l.querySelector('.fremgang-tal').textContent])));
tjek('"Din fremgang": Molekyler har 11 opgaver, og Ild har knaldgassens 2 (begge klaret)', /af 11 opgaver/.test(linjer.molekyler ?? '') && /✓ 2 af 2 opgaver/.test(linjer.ild ?? ''), JSON.stringify(linjer));
await ctx.close();

// ---------- Tablet og telefon: måleren og knapperne kan ses ----------
for (const [navn, vp] of [['tablet-højkant', { width: 820, height: 1180 }], ['tablet-langs', { width: 1180, height: 820 }], ['tlf', { width: 390, height: 844 }], ['tlf-langs', { width: 844, height: 390 }]]) {
  const { ctx: c2, page: p } = await side({ viewport: vp, hasTouch: true, isMobile: navn.startsWith('tlf') }, `${ADRESSE}/index.html?test#ild`);
  await p.waitForFunction(() => window.atomlabTest?.ild, null, { timeout: 20000 });
  await p.evaluate(() => atomlabTest.ild.vis('knaldgas'));
  await p.evaluate(() => { const k = atomlabTest.ild.knaldgas; k.forfra(4); k.gnist(); k.spol(30); });
  await p.waitForTimeout(500);
  const mR = await p.evaluate(() => document.getElementById('knaldMåler').getBoundingClientRect().toJSON());
  tjek(`${navn}: knaldgassen er færdig, og måleren er inde på skærmen`, await p.evaluate(() => atomlabTest.ild.knaldgas.boks().færdig) && mR.width > 150 && mR.right <= vp.width + 1 && await p.isVisible('#knaldGnist'));
  if (vp.width > vp.height && vp.height > 500) await ingenRul(p, `${navn}, knaldgassen`);
  await c2.close();
}

tjek('ingen konsolfejl', fejl.length === 0, fejl.join(' | '));
await browser.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
