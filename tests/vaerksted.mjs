// Atomværkstedet: menu, byg atomer, stabile og ustabile kerner, tællere og fanerne
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('vaerksted');
const URL = `${ADRESSE}/index.html?test`;
const browser = await chromium.launch({ args: ARGS });
const fejl = [];
let ok = 0, dårlig = 0;
function tjek(navn, betingelse, ekstra = '') { if (betingelse) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } }

async function side(opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => fejl.push('requestfailed: ' + r.url()));
  return { ctx, page };
}

const { ctx, page } = await side({ viewport: { width: 1280, height: 800 } });
await page.goto(URL);
await page.waitForTimeout(2500);
await page.screenshot({ path: UD + '/1-menu.png' });
tjek('menu vises', await page.isVisible('#menu'));
const fps = await page.evaluate(() => new Promise((ok) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else ok(n / 2); }; requestAnimationFrame(f); }));
console.log('Billeder pr. sekund i testbrowseren:', fps);

await page.click('a.kort.åben');
await page.waitForTimeout(800);
tjek('værksted vises', await page.isVisible('#vaerksted'));
const info = () => page.textContent('#infopanel');
const tryk = async (sel) => { await page.dispatchEvent(sel, 'pointerdown', { pointerId: 1 }); await page.dispatchEvent(sel, 'pointerup', { pointerId: 1 }); };
for (const t of ['p', 'p', 'n', 'n', 'e', 'e']) await tryk(`.rund.plus[data-type="${t}"]`);
await page.waitForTimeout(1500);
let tekst = await info();
tjek('Helium-4', tekst.includes('Helium-4'), tekst);
tjek('stabil', tekst.includes('Stabil kerne'));
tjek('neutralt', tekst.includes('neutralt atom'));
tjek('tællere', (await page.textContent('#antalP')) === '2' && (await page.textContent('#antalE')) === '2');
await page.screenshot({ path: UD + '/2-helium.png' });

// Carbon-14 med tastaturet
await page.click('#knapRyd');
const tast = async (k, n) => { for (let i = 0; i < n; i++) await page.keyboard.press(k); };
await tast('p', 6); await tast('n', 8); await tast('e', 6);
await page.waitForTimeout(1500);
tekst = await info();
tjek('Carbon-14', tekst.includes('Carbon-14'), tekst);
tjek('ustabil 5.730 år', tekst.includes('Ustabil') && tekst.includes('5.730 år'), tekst);
await page.screenshot({ path: UD + '/3-carbon14.png' });

// Na+
await page.click('#knapRyd');
await tast('p', 11); await tast('n', 12); await tast('e', 11); await page.keyboard.press('Shift+E');
await page.waitForTimeout(2000);
tekst = await info();
tjek('Na⁺', tekst.includes('Na⁺'), tekst);
await page.screenshot({ path: UD + '/4-natrium-ion.png' });

// He-2 falder fra hinanden
await page.click('#knapRyd');
await tast('p', 2);
await page.waitForTimeout(300);
tekst = await info();
tjek('He-2 falder fra hinanden', tekst.includes('Falder fra hinanden'), tekst);

// Elektron uden proton
await page.click('#knapRyd');
await tast('e', 1);
tjek('elektron uden proton afvises', (await page.textContent('#antalE')) === '0');

// Opgaver løst
const løst = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('opgaver gemt (helium, carbon14, natrium-ion)', løst.opgaver.helium && løst.opgaver.carbon14 && løst.opgaver['natrium-ion'], JSON.stringify(løst));
tjek('opdaget He, C, Na', [2, 6, 11].every((z) => løst.opdaget.includes(z)), JSON.stringify(løst.opdaget));

// Genindlæs og hop til helium fra tabellen
await page.reload();
await page.waitForTimeout(1500);
await page.click('#minitabel .felt[data-nr="2"]');
await page.waitForTimeout(1200);
tekst = await info();
tjek('hop til helium efter genindlæsning', tekst.includes('Helium-4'), tekst);
tjek('opgavetæller', /^[3-9]\/16$/.test(await page.textContent('#opgaveTæller')), await page.textContent('#opgaveTæller'));

// Ikke-opdaget grundstof kan ikke vælges
await page.click('#minitabel .felt[data-nr="26"]');
await page.waitForTimeout(300);
tjek('jern låst', (await page.textContent('#antalP')) === '2');

// Uran via knapper (hold inde) – byg med tastatur for hastighed
await page.click('#knapRyd');
await tast('p', 92);
await page.click('#knapStabil');
await page.click('#knapNeutral');
await page.waitForTimeout(8000);
tekst = await info();
tjek('Uran-238', tekst.includes('Uran-238') && tekst.includes('Næsten stabil'), tekst);
await page.screenshot({ path: UD + '/5-uran.png' });
tjek('"Elektronsky" er en kontakt, der er slukket', (await page.getAttribute('#knapVisning', 'role')) === 'switch' && (await page.getAttribute('#knapVisning', 'aria-checked')) === 'false');
await page.click('#knapVisning');
tjek('"Elektronsky" tændes (samme navn, med ✓)', (await page.getAttribute('#knapVisning', 'aria-checked')) === 'true' && (await page.textContent('#knapVisning')).trim() === 'Elektronsky' && (await page.evaluate(() => getComputedStyle(document.querySelector('#knapVisning .kontakt-boks'), '::after').content)).includes('✓'));
await page.waitForTimeout(1200);
await page.screenshot({ path: UD + '/6-uran-sky.png' });

// "Ryd" og straks uran igen: Mens de gamle partikler flyver væk, er der mange flere kugler end normalt.
// Grafikken må ikke løbe tør for plads (det gav fejl i WebGL før).
await page.click('#knapVisning');
await page.click('#knapRyd');
await page.evaluate(() => atomlabTest.vaerksted.spol(0.4)); // nu er alle kuglerne på vej ud
await page.click('#minitabel .felt[data-nr="92"]'); // uran er opdaget nu, så man kan hoppe direkte til det
const kugler = await page.evaluate(() => { atomlabTest.vaerksted.spol(0.15); return atomlabTest.vaerksted.kugler(); }); // her er der flest (uden loftet op til ca. 180 protoner)
tjek('Ryd og straks uran: der er plads til alle kuglerne', kugler.p <= kugler.pladsP && kugler.n <= kugler.pladsN && kugler.e <= kugler.pladsE, JSON.stringify(kugler));
await page.waitForTimeout(800);
tjek('Ryd og straks uran igen giver ingen grafikfejl', !fejl.some((f) => /GL|WebGL/i.test(f)), fejl.join(' | '));

// Jern til fejring + opgaveliste
await page.click('#knapRyd');
await tast('p', 26); await tast('n', 30); await tast('e', 26);
await page.waitForTimeout(600);
await page.screenshot({ path: UD + '/7-jern-fejring.png' });
await page.click('#knapOpgaver');
await page.waitForTimeout(300);
await page.screenshot({ path: UD + '/8-opgaver.png' });
await page.keyboard.press('Escape');
await page.click('#knapHjælp');
await page.waitForTimeout(300);
await page.screenshot({ path: UD + '/9-hjælp.png' });
tjek('hjælpen har ophavsret og kilder', /© 2026 Espen O'Halloran/.test(await page.textContent('#hjælpOm + p')) && /Three\.js/.test(await page.textContent('#hjælp')));
await ctx.close();

// Tablet på langs og på højkant
for (const [navn, w, h] of [['10-tablet-langs', 1024, 768], ['11-tablet-højkant', 768, 1024]]) {
  const t = await side({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await t.page.goto(URL + '#vaerksted');
  await t.page.waitForTimeout(800);
  for (let i = 0; i < 6; i++) { await t.page.keyboard.press('p'); }
  await t.page.keyboard.press('n'); await t.page.click('#knapStabil'); await t.page.click('#knapNeutral');
  await t.page.waitForTimeout(2500);
  await t.page.screenshot({ path: `${UD}/${navn}.png` });
  await t.ctx.close();
}

// Udgaver af atomet (?udgaver): vælgeren, orbitalerne, og at B (formerne) er standard uden ?udgaver
{
  const u = await side({ viewport: { width: 1280, height: 800 } });
  await u.page.goto(URL + '#vaerksted');
  await u.page.waitForFunction(() => window.atomlabTest && document.querySelector('#vaerksted:not(.skjult)'));
  tjek('udgaver: vælgeren er skjult uden ?udgaver', await u.page.isHidden('#udgaveVælger'));
  await u.page.goto(`${ADRESSE}/index.html?test&udgaver#vaerksted`);
  await u.page.waitForFunction(() => window.atomlabTest && document.querySelector('#vaerksted:not(.skjult)'));
  tjek('udgaver: vælgeren vises med ?udgaver', await u.page.isVisible('#udgaveVælger'));
  for (const t of ['p', 'p', 'p', 'p', 'p', 'p', 'n', 'n', 'n', 'n', 'n', 'n', 'e', 'e', 'e', 'e', 'e', 'e']) await u.page.keyboard.press(t);
  await u.page.click('[data-udgave="prikker"]');
  tjek('udgaver: A viser elektronskyen', (await u.page.getAttribute('#knapVisning', 'aria-checked')) === 'true' && await u.page.evaluate(() => window.atomlabTest.vaerksted.udgave()) === 'prikker');
  let o = await u.page.evaluate(() => window.atomlabTest.vaerksted.orbitaler());
  tjek('udgaver: carbon har 4 orbitaler (1s, 2s og to 2p med én elektron)', o.length === 4 && o.filter((x) => x.navn.startsWith('2p')).every((x) => x.elektroner === 1), JSON.stringify(o));
  tjek('udgaver: teksten siger, at formerne er regnet som for hydrogen', /hydrogen/.test(await u.page.textContent('#infoModel')));
  await u.page.click('[data-udgave="former"]');
  o = await u.page.evaluate(() => window.atomlabTest.vaerksted.orbitaler());
  tjek('udgaver: B viser de yderste orbitaler (2s og to 2p)', o.length === 3, JSON.stringify(o));
  await u.page.evaluate(() => window.atomlabTest.vaerksted.spol(2));
  await u.page.screenshot({ path: UD + '/12-udgave-former.png' });
  await u.page.reload();
  await u.page.waitForFunction(() => window.atomlabTest && document.querySelector('#vaerksted:not(.skjult)'));
  tjek('udgaver: valget huskes', await u.page.evaluate(() => window.atomlabTest.vaerksted.udgave()) === 'former');
  await u.page.click('[data-udgave="nu"]');
  tjek('udgaver: "Nu" har ingen orbitaler', (await u.page.evaluate(() => window.atomlabTest.vaerksted.orbitaler())).length === 0);
  await u.page.goto(URL + '#vaerksted');
  await u.page.waitForFunction(() => window.atomlabTest && document.querySelector('#vaerksted:not(.skjult)'));
  tjek('udgaver: uden ?udgaver bruges B (formerne)', await u.page.evaluate(() => window.atomlabTest.vaerksted.udgave()) === 'former');
  await u.ctx.close();
}

await browser.close();
console.log('\nKonsol-fejl/advarsler:', fejl.length ? '\n' + fejl.join('\n') : 'ingen');
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
