// Hentningen af store billeder (js/hentning.js): Mars og Jorden er mørke kugler, indtil kortet er hentet, og toner så
// ind (ikke den jævne rødbrune kugle eller det tegnede kort). Bjælken "Henter …" ses med langsomt net efter ca. et
// sekund, tæller MB og forsvinder igen. Mangler kortet, ses nødløsningen. Langsomt net: billederne forsinkes med route.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('hentning');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const vent = (ms) => new Promise((s) => setTimeout(s, ms));
const b = await chromium.launch({ args: ARGS });

async function side(forsink, { afvis = null, størrelse = { width: 1280, height: 800 }, start = null } = {}) {
  const fejl = [];
  const s = await (await b.newContext({ viewport: størrelse })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' && !(afvis && m.text().includes('Failed to load'))) fejl.push(m.text()); });
  // (start: fænomenet, Solsystemet åbner med. Solen viser Jorden, så Jordens test starter ved Saturn.)
  if (start) await s.addInitScript((id) => localStorage.setItem('atomlabSolsystem', id), start);
  await s.route(forsink, async (r) => { await vent(2500); await r.continue(); });
  if (afvis) await s.route(afvis, (r) => r.abort());
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  return { s, fejl };
}
const bjælke = (s) => s.evaluate(() => {
  const e = [...document.querySelectorAll('.hentebjaelke')].find((x) => x.classList.contains('vist'));
  return e ? e.textContent : null;
});

// Mars med langsomt net
{
  const { s, fejl } = await side('**/billeder/solsystem/mars-2k.jpg');
  await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder, null, { timeout: 20000 });
  const før = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
  tjek('Mars: kortet er ikke hentet endnu, og bjælken venter', !før.hentet.kort && før.bjælke.venter, JSON.stringify(før));
  await s.waitForFunction(() => [...document.querySelectorAll('.hentebjaelke.vist')].length > 0, null, { timeout: 5000, polling: 100 }).catch(() => {});
  const tekst = await bjælke(s);
  tjek(`Mars: bjælken ses efter ca. et sekund ("${tekst}")`, /Henter Mars/.test(tekst ?? ''));
  await s.screenshot({ path: `${UD}/mars-henter.png` });
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 20000 });
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().billeder().tone === 1, null, { timeout: 5000, polling: 50 }).catch(() => {});
  const efter = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
  tjek('Mars: kortet er tonet helt ind', efter.tone === 1, efter.tone);
  await s.waitForFunction(() => !document.querySelector('.hentebjaelke.vist'), null, { timeout: 3000 }).catch(() => {});
  tjek('Mars: bjælken er væk igen', !(await bjælke(s)) && !efter.bjælke.venter);

  // Stå på Mars: lagene forsinkes, og bjælken tæller MB
  await s.route('**/billeder/solsystem/landskab/**', async (r) => { await vent(2500); await r.continue(); });
  await s.evaluate(() => atomlabTest.solsystem.fænomen().ståPå('naukluft'));
  await s.waitForFunction(() => /Henter landskabet/.test(document.querySelector('.hentebjaelke.vist')?.textContent ?? ''), null, { timeout: 8000, polling: 100 }).catch(() => {});
  const land = await bjælke(s);
  tjek(`Stå på Mars: bjælken viser landskabet og MB ("${land}")`, /Henter landskabet .* af [\d,]+ MB/.test(land ?? ''));
  await s.screenshot({ path: `${UD}/landskab-henter.png` });
  await s.evaluate(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
  tjek('Stå på Mars: bjælken er væk, når man står', !(await bjælke(s)));
  // Skærmskift: Mars' bjælke fjernes (Jordens bjælke er fælles og bliver, skjult)
  const antal = await s.evaluate(() => document.querySelectorAll('.hentebjaelke').length);
  await s.evaluate(() => { location.hash = '#vaerksted'; });
  await s.waitForFunction(() => document.querySelector('#vaerksted:not(.skjult)'));
  tjek('skærmskift: Mars\' bjælke er fjernet', await s.evaluate((n) => document.querySelectorAll('.hentebjaelke').length === n - 1, antal));
  tjek('Mars: ingen konsolfejl', fejl.length === 0, fejl.join('\n'));
  await s.context().close();
}

// Mars uden kort (fx uden net): bjælken forsvinder, og kloden er ikke mørk
{
  const { s, fejl } = await side('**/ingen-forsinkelse', { afvis: '**/billeder/solsystem/mars-2k.jpg' });
  await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder && !atomlabTest.solsystem.fænomen().billeder().bjælke.venter, null, { timeout: 20000 }).catch(() => {});
  const m = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
  tjek('Mars uden kort: bjælken holder op med at vente, og kortet er ikke sat', !m.bjælke.venter && !m.hentet.kort, JSON.stringify(m));
  tjek('Mars uden kort: ingen andre konsolfejl', fejl.length === 0, fejl.join('\n'));
  await s.context().close();
}

// Jorden (Formørkelser) med langsomt net: mørk kugle, bjælken, og så kortet
{
  const { s, fejl } = await side('**/billeder/solsystem/jorden-dag-*', { start: 'saturn' });
  await s.evaluate(() => atomlabTest.solsystem.vælg('formoerkelser'));
  await s.waitForFunction(() => /Henter Jorden/.test(document.querySelector('.hentebjaelke.vist')?.textContent ?? ''), null, { timeout: 8000, polling: 100 }).catch(() => {});
  tjek(`Jorden: bjælken ses ("${await bjælke(s)}")`, /Henter Jorden/.test((await bjælke(s)) ?? ''));
  const mørk = await s.evaluate(async () => (await import('/js/kosmos/jorden.js')).synlighed());
  tjek('Jorden: kuglen er mørk, mens dagbillederne hentes (ikke det tegnede kort)', mørk.jorden.length > 0 && mørk.jorden.every((v) => v === 0), JSON.stringify(mørk));
  await s.screenshot({ path: `${UD}/jorden-henter.png` });
  await s.waitForFunction(async () => (await import('/js/kosmos/jorden.js')).synlighed().jorden.every((v) => v === 1), null, { timeout: 20000, polling: 200 }).catch(() => {});
  const lys = await s.evaluate(async () => (await import('/js/kosmos/jorden.js')).synlighed());
  tjek('Jorden: kortet er tonet ind', lys.jorden.every((v) => v === 1) && lys.måne.every((v) => v === 1), JSON.stringify(lys));
  tjek('Jorden: bjælken er væk igen', !(await bjælke(s)));
  // Anden gang ligger billederne klar: ingen toning og ingen bjælke
  await s.evaluate(() => atomlabTest.solsystem.vælg('aarstider'));
  await s.waitForTimeout(300);
  const igen = await s.evaluate(async () => (await import('/js/kosmos/jorden.js')).synlighed());
  tjek('Jorden anden gang: ses med det samme', igen.jorden.at(-1) === 1, JSON.stringify(igen));
  tjek('Jorden: ingen konsolfejl', fejl.length === 0, fejl.join('\n'));
  await s.context().close();
}

await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
