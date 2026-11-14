// Molekyler → "Giv elektroner" (det, der hed Byttebørsen, Molekyler M1a og M1b, en egen del siden 14. november 2026): måderne,
// træk elektronen med musen, regnskabet (måleren), ionerne, mødet, harpunen, tidsknappen, panelet uden rullebjælke,
// Værkstedets taster, knappen i Værkstedets hjælp, M1b: krystallen, Li + F, Mg + O, Ca + 2 Cl, Na + Na og fremgangen (menuen),
// og tablet og telefon (begge veje) med "Vis mig".
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('byttebors');
const URL = `${ADRESSE}/index.html?test#molekyler`;
const browser = await chromium.launch({ args: ARGS });
const fejl = [];
let ok = 0, dårlig = 0;
function tjek(navn, betingelse, ekstra = '') { if (betingelse) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } }
const nær = (a, b, tol) => Math.abs(a - b) <= tol;

async function side(opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => fejl.push('requestfailed: ' + r.url()));
  await page.goto(URL);
  await page.waitForFunction(() => window.atomlabTest?.molekyler?.bytte);
  return { ctx, page };
}
const B = (page, f, ...a) => page.evaluate(([f, a]) => window.atomlabTest.molekyler.bytte[f](...a), [f, a]);
const spol = (page, sek) => B(page, 'spol', sek);

const { ctx, page } = await side({ viewport: { width: 1280, height: 800 } });

// Måderne: Molekyler er en egen del (14. november 2026), "Del elektroner | Giv elektroner" øverst i venstre panel
const måde = (p = page) => p.evaluate(() => atomlabTest.molekyler.måde());
tjek('Værkstedets fane "Byg et molekyle" findes ikke længere', await page.evaluate(() => !document.querySelector('[data-vaerksted-del], #værkstedDele')));
tjek('navnet Byttebørsen står ingen steder i programmet', !(await page.evaluate(() => document.body.innerText + [...document.querySelectorAll('[title],[aria-label]')].map((e) => e.title + e.getAttribute('aria-label')).join(' '))).toLowerCase().includes('byttebørs'));
tjek('Molekyler åbner med "Del elektroner", og "Giv elektroner" er skjult', await måde() === 'byg' && !(await page.isVisible('#byttePanel')) && !(await page.isVisible('#bytteMåler')));
await page.click('#bygPanel [data-molekyle-maade="bytte"]');
await page.waitForTimeout(600);
tjek('"Giv elektroner" er valgt', await måde() === 'bytte' && await page.getAttribute('#byttePanel [data-molekyle-maade="bytte"]', 'aria-pressed') === 'true'
  && await page.evaluate(() => document.getElementById('molekyler').classList.contains('bytte')));
tjek('Værkstedets paneler er ikke på skærmen', !(await page.isVisible('#byggepanel')) && !(await page.isVisible('#infopanel')) && !(await page.isVisible('#minitabelPanel')) && !(await page.isVisible('#opgavePille')));
tjek('Byttebørsens paneler, måleren, tidsknappen og "Næste skridt" vises', await page.isVisible('#byttePanel') && await page.isVisible('#bytteInfo')
  && await page.isVisible('#bytteMåler') && await page.isVisible('#bytteTid') && await page.isVisible('#bytteMission'));
tjek('Reaktorens del-knapper er ikke rørt (stadig to med data-del)', await page.evaluate(() => document.querySelectorAll('.del-knap[data-del]').length) === 2);
tjek('start: to neutrale atomer, regnskabet er 0', await B(page, 'tilstand') === 'start' && (await B(page, 'regnskab')).iAlt === 0);
tjek('"Lad dem mødes" og harpunen kan ikke trykkes endnu', await page.isDisabled('#bytteMødes') && await page.isDisabled('#bytteHarpun'));
tjek('måleren siger 0,00 eV', (await page.textContent('#bytteMålerTal')).includes('0,00 eV'));
await page.screenshot({ path: UD + '/1-start.png' });

// Træk elektronen et stykke væk og slip den: Den flyver tilbage
async function træk(tilX, tilY) {
  const e = await B(page, 'elektronPå');
  await page.mouse.move(e.x, e.y);
  await page.mouse.down();
  await page.mouse.move((e.x + tilX) / 2, (e.y + tilY) / 2 - 30, { steps: 6 });
  return e;
}
const n0 = await B(page, 'natriumPå');
const c0 = await B(page, 'chlorPå');
await træk(n0.x, n0.y - 200);
tjek('trækker: elektronen er fri', await B(page, 'tilstand') === 'trækker' && await B(page, 'elektron') === 'fri');
tjek('fri elektron: regnskabet −5,14 eV', nær((await B(page, 'regnskab')).iAlt, -5.139, 0.001));
await page.waitForTimeout(400);
tjek('måleren viser −5,14 eV, og tallene står i panelet', (await page.textContent('#bytteMålerTal')).includes('−5,14') && (await page.textContent('#bytteTal')).includes('−5,14'));
await page.mouse.move(n0.x, n0.y - 220, { steps: 3 });
await page.mouse.up();
await spol(page, 1);
tjek('slippet langt fra chlor: elektronen flyver hjem', await B(page, 'tilstand') === 'start' && await B(page, 'elektron') === 'hjemme' && (await B(page, 'regnskab')).iAlt === 0);

// Et træk et andet sted drejer kameraet (ikke elektronen)
await page.mouse.move(c0.x, c0.y - 150);
await page.mouse.down();
await page.mouse.move(c0.x + 60, c0.y - 150, { steps: 4 });
await page.mouse.up();
tjek('et træk et andet sted flytter ikke elektronen', await B(page, 'tilstand') === 'start');

// Træk elektronen over til chlor
await spol(page, 0.5);
const c = await B(page, 'chlorPå');
await træk(c.x, c.y);
await page.mouse.move(c.x - 15, c.y, { steps: 6 });
await page.mouse.up();
await spol(page, 1);
tjek('ved chlor: nu er de ioner', await B(page, 'tilstand') === 'ioner' && await B(page, 'elektron') === 'flyttet');
const ioner = await B(page, 'regnskab');
tjek(`ioner langt fra hinanden: regnskabet i minus (${ioner.iAlt.toFixed(2)})`, ioner.iAlt < 0 && ioner.iAlt > -1.53);
tjek('delene: −5,14, +3,61 og lidt tiltrækning', nær(ioner.tage, -5.139, 0.001) && nær(ioner.give, 3.613, 0.001) && ioner.træk > 0 && ioner.træk < 1.5);
const ringe = await B(page, 'ringe');
tjek(`Na⁺ har 2 · 8 og er krympet (${ringe.na.toFixed(2)} Å)`, JSON.stringify(ringe.naSkaller) === '[2,8]' && ringe.na < 1.1);
tjek(`Cl⁻ har 2 · 8 · 8 og er vokset (${ringe.cl.toFixed(2)} Å)`, JSON.stringify(ringe.clSkaller) === '[2,8,8]' && ringe.cl > 1.6);
tjek('"Lad dem mødes" kan trykkes', !(await page.isDisabled('#bytteMødes')));
await page.screenshot({ path: UD + '/2-ioner.png' });

// Tidsknappen: under pause står ionerne stille
await page.click('#bytteMødes');
await spol(page, 0.3);
await page.click('#bytteTid [data-tid="pause"]');
const rPause = await B(page, 'afstand');
await spol(page, 2);
tjek('pause: ionerne står stille', await B(page, 'afstand') === rPause && await B(page, 'tidsknap') === 'pause');
await page.click('#bytteTid [data-tid="spil"]');
await spol(page, 6);
const samlet = await B(page, 'regnskab');
tjek('mødet: et par ved 2,36 Å', await B(page, 'tilstand') === 'samlet' && nær(await B(page, 'afstand'), 2.36, 0.001));
tjek(`regnskabet ender på +4,26 eV (${samlet.iAlt.toFixed(3)})`, nær(samlet.iAlt, 4.26, 0.001));
await page.waitForTimeout(400);
tjek('måleren viser +4,26 eV og er grøn', (await page.textContent('#bytteMålerTal')).includes('+4,26') && await page.evaluate(() => document.getElementById('bytteMålerFyld').classList.contains('plus')));
tjek('panelet siger "ionbinding"', (await page.textContent('#bytteTrinTekst')).includes('ionbinding'));
tjek('nu kan man se harpunen', !(await page.isDisabled('#bytteHarpun')));
await page.screenshot({ path: UD + '/3-par.png' });

// Panelet har ingen rullebjælke (heller ikke med "For nørder" åben)
const ingenRul = () => page.evaluate(() => { const p = document.getElementById('bytteInfo'); return p.scrollHeight <= p.clientHeight + 1; });
tjek('højre panel uden rullebjælke', await ingenRul());
await page.click('[data-lag="bytte-nørd"] summary');
tjek('højre panel uden rullebjælke med "For nørder" åben', await ingenRul(), await page.evaluate(() => { const p = document.getElementById('bytteInfo'); return `${p.scrollHeight}/${p.clientHeight}`; }));
await page.click('[data-lag="bytte-ærligt"] summary');
tjek('"Ærligt talt" lukker "For nørder" (én ad gangen)', await page.evaluate(() => !document.querySelector('[data-lag="bytte-nørd"]').open && document.querySelector('[data-lag="bytte-ærligt"]').open));
tjek('højre panel uden rullebjælke med "Ærligt talt" åben', await ingenRul(), await page.evaluate(() => { const p = document.getElementById('bytteInfo'); return `${p.scrollHeight}/${p.clientHeight}`; }));
await page.click('[data-lag="bytte-ærligt"] summary');

// "Hvorfor?"-kortet
await page.click('button[data-hvorfor="bytteKoster"]');
tjek('"Hvorfor koster det?" åbner et kort', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Hvorfor koster det at flytte elektronen?');
await page.keyboard.press('Escape');

// Harpunen
await page.click('#bytteHarpun');
tjek('harpunen: neutrale atomer nærmer sig', await B(page, 'tilstand') === 'nærmer' && await B(page, 'elektron') === 'hjemme');
const hvis = await B(page, 'regnskab');
tjek(`langt ude: et hop ville koste (${hvis.iAlt.toFixed(2)})`, hvis.hvis && hvis.iAlt < 0);
await page.waitForTimeout(400);
tjek('måleren skriver "Hvis den hoppede nu"', (await page.textContent('#bytteMålerNavn')).includes('Hvis den hoppede nu'));
let hopVed = null;
for (let i = 0; i < 400 && !hopVed; i++) {
  await spol(page, 0.05);
  if ((await B(page, 'elektron')) !== 'hjemme') hopVed = await B(page, 'afstand');
}
tjek(`elektronen hopper ved ca. 9,4 Å (${hopVed?.toFixed(2)})`, hopVed !== null && nær(hopVed, await B(page, 'harpunAfstand'), 0.05) && nær(hopVed, 9.43, 0.1));
await spol(page, 8);
tjek('harpunen ender også i et par med +4,26 eV', await B(page, 'tilstand') === 'samlet' && nær((await B(page, 'regnskab')).iAlt, 4.26, 0.001));
await page.screenshot({ path: UD + '/4-harpun.png' });

// Forfra
await page.click('#bytteForfra');
tjek('Forfra: to neutrale atomer igen', await B(page, 'tilstand') === 'start' && nær(await B(page, 'afstand'), 16, 0.001) && JSON.stringify((await B(page, 'ringe')).naSkaller) === '[2,8,1]');

// Tasterne P, N og E bygger ikke i Molekyler, men i Værkstedet
await page.keyboard.press('p');
await page.evaluate(() => atomlabTest.molekyler.sætMåde('byg'));
await page.evaluate(() => { location.hash = '#vaerksted'; });
await page.waitForFunction(() => atomlabTest.vaerksted && document.querySelector('#vaerksted:not(.skjult)'));
await page.waitForTimeout(500);
tjek('tasten P byggede ikke i Molekyler', (await page.textContent('#antalP')) === '0');
tjek('Værkstedet: byggepanelet og infopanelet vises, ikke Molekylers paneler', await page.isVisible('#byggepanel') && await page.isVisible('#infopanel') && !(await page.isVisible('#byttePanel')) && !(await page.isVisible('#bygPanel')));
for (const k of ['p', 'p', 'n', 'n', 'e', 'e']) await page.keyboard.press(k);
await page.waitForTimeout(300);
tjek('tasterne bygger i Værkstedet', (await page.textContent('#antalP')) === '2');

// Knappen i Værkstedets hjælp ("Hvad er en ion?") fører til Molekyler med "Giv elektroner" valgt (det gamle link virker)
await page.click('#knapHjælp');
await page.click('#hjælpTilBytte');
await page.waitForFunction(() => document.querySelector('#molekyler:not(.skjult)'));
await page.waitForTimeout(400);
tjek('hjælpen: "Prøv det selv i Molekyler" åbner Molekyler med "Giv elektroner" og lukker hjælpen', await måde() === 'bytte' && await page.evaluate(() => location.hash) === '#molekyler' && !(await page.isVisible('#hjælp')));
tjek('hjælpen siger ikke længere, at atomer "vil" have en fyldt skal', !(await page.textContent('#hjælp')).includes('mest "tilfredse"'));

// Skærmskift midt i et træk: elektronen går hjem, og Byttebørsen er der stadig, når man kommer tilbage
const e2 = await B(page, 'elektronPå');
await page.mouse.move(e2.x, e2.y);
await page.mouse.down();
await page.mouse.move(e2.x + 40, e2.y - 40, { steps: 3 });
await page.evaluate(() => { location.hash = '#reaktor'; });
await page.waitForTimeout(500);
await page.mouse.up();
await page.evaluate(() => { location.hash = '#molekyler'; });
await page.waitForTimeout(600);
tjek('tilbage i Molekyler: stadig "Giv elektroner", elektronen hjemme', await måde() === 'bytte' && await B(page, 'tilstand') === 'start');
tjek('kameraets styring virker igen', await page.evaluate(() => atomlabTest.molekyler.bytte.styring()));

// ---------- M1b: krystallen, de andre par og fremgangen ----------
const rulInfo = () => page.evaluate(() => ['bytteInfo', 'byttePanel'].map((id) => { const el = document.getElementById(id); return el.scrollHeight <= el.clientHeight + 1 ? '' : `${id} ${el.scrollHeight}/${el.clientHeight}`; }).filter(Boolean).join(' '));
// Ingen rullebjælke i begge paneler, heller ikke med en foldeboks åben
async function ingenRulAlle(navn) {
  const res = [await rulInfo()];
  for (const lag of ['bytte-nørd', 'bytte-ærligt']) {
    await page.click(`[data-lag="${lag}"] summary`);
    res.push(await rulInfo());
    await page.click(`[data-lag="${lag}"] summary`);
  }
  tjek(`${navn}: ingen rullebjælke i panelerne (også med foldeboksene)`, res.every((x) => !x), res.join(' | '));
}
// Vælg et par, og vent, til kameraet har zoomet færdig (ellers står elektronen et andet sted, når musen trækker).
// Ikke en fast ventetid: Kører testene to ad gangen, tager zoomet længere tid.
async function vælg(id) {
  await page.click(`[data-bytte-par-id="${id}"]`);
  await page.waitForFunction(() => atomlabTest.molekyler.bytte.kameraStille(), null, { timeout: 15000 });
}
const stjerne = (id) => page.textContent(`[data-bytte-par-id="${id}"] .bp-stjerne`);
// Træk den næste elektron med musen hen til et sted på skærmen og slip
async function trækTil(mål) {
  const e = await B(page, 'elektronPå');
  await page.mouse.move(e.x, e.y);
  await page.mouse.down();
  await page.mouse.move((e.x + mål.x) / 2, (e.y + mål.y) / 2 - 20, { steps: 5 });
  await page.mouse.move(mål.x - 10, mål.y, { steps: 5 });
  await page.mouse.up();
  await spol(page, 1);
}
tjek('fem par-knapper i venstre panel, Na + Cl er valgt', await page.locator('.bytte-par').count() === 5
  && await page.getAttribute('[data-bytte-par-id="nacl"]', 'aria-pressed') === 'true' && (await stjerne('nacl')) === '☆');

// Na + Cl: par, så krystal
await B(page, 'handling'); // Vis mig
await spol(page, 3);
await B(page, 'handling'); // Lad dem mødes
await spol(page, 7);
tjek('Na + Cl: parret er samlet, og "Byg krystallen" kan trykkes', await B(page, 'tilstand') === 'samlet' && !(await page.isDisabled('#bytteKrystal')));
await page.click('#bytteKrystal');
tjek('krystallen bygges: 216 ioner, 108 Na⁺', await B(page, 'tilstand') === 'bygger' && (await B(page, 'krystal')).antal === 216 && (await B(page, 'krystal')).plus === 108);
await spol(page, 0.6);
await page.click('#bytteTid [data-tid="pause"]');
const andelPause = (await B(page, 'krystal')).andel;
await spol(page, 2);
tjek('pause: krystallen står stille', (await B(page, 'krystal')).andel === andelPause && await B(page, 'tilstand') === 'bygger');
await page.click('#bytteTid [data-tid="spil"]');
await spol(page, 5);
const kr = await B(page, 'regnskab');
tjek(`Na + Cl: krystallen er færdig, regnskabet +6,62 eV (${kr.iAlt.toFixed(2)})`, await B(page, 'tilstand') === 'krystal' && nær(kr.iAlt, 6.62, 0.01) && nær(kr.træk, 8.15, 0.01));
await page.waitForTimeout(400);
tjek('måleren viser +6,62 eV, panelet tæller ionerne', (await page.textContent('#bytteMålerTal')).includes('+6,62') && (await page.textContent('#bytteTal')).includes('216'));
tjek('Na + Cl er klaret: ★ på knappen og gemt', (await stjerne('nacl')) === '★' && await page.evaluate(() => Boolean(JSON.parse(localStorage.getItem('atomlabFremgang')).opgaver['bytte-nacl'])));
tjek('panelet siger "terninger"', (await page.textContent('#bytteTrinTekst')).includes('terninger'));
await ingenRulAlle('Na + Cl-krystal');
await page.screenshot({ path: UD + '/6-krystal-nacl.png' });

// Li + F: direkte til krystallen
await vælg('lif');
tjek('Li + F: to neutrale atomer, "Lad dem mødes" og harpunen er skjult', await B(page, 'par') === 'lif' && await B(page, 'tilstand') === 'start'
  && !(await page.isVisible('#bytteMødes')) && !(await page.isVisible('#bytteHarpun')) && await page.isVisible('#bytteKrystal'));
tjek('Li + F: overskriften skifter', (await page.textContent('#bytteParTitel')).includes('Lithium + fluor'));
await trækTil(await B(page, 'tagerPå', 0));
const lif = await B(page, 'regnskab');
tjek(`Li + F: Li⁺ og F⁻, −5,39 og +3,40 eV (${lif.tage.toFixed(2)}, ${lif.give.toFixed(2)})`, await B(page, 'tilstand') === 'ioner'
  && JSON.stringify(await B(page, 'ladninger')) === '[1,-1]' && nær(lif.tage, -5.392, 0.001) && nær(lif.give, 3.401, 0.001) && lif.iAlt < 0);
await page.click('#bytteKrystal');
await spol(page, 5);
tjek(`Li + F: krystallen ender på +8,68 eV (${(await B(page, 'regnskab')).iAlt.toFixed(2)})`, await B(page, 'tilstand') === 'krystal' && nær((await B(page, 'regnskab')).iAlt, 8.68, 0.01));
await ingenRulAlle('Li + F-krystal');

// Mg + O: to elektroner, og den anden koster hos oxygen
await vælg('mgo');
await B(page, 'handling'); // Vis mig: den første
await spol(page, 3);
const mg1 = await B(page, 'regnskab');
tjek('Mg + O: efter den første er det Mg⁺ og O⁻, og man kan trække igen', await B(page, 'tilstand') === 'start' && await B(page, 'flyttet') === 1
  && JSON.stringify(await B(page, 'ladninger')) === '[1,-1]' && nær(mg1.tage, -7.646, 0.001) && nær(mg1.give, 1.461, 0.001));
await trækTil(await B(page, 'tagerPå', 0));
const mg2 = await B(page, 'regnskab');
tjek(`Mg + O: Mg²⁺ og O²⁻, −22,68 og −6,25 eV (${mg2.tage.toFixed(2)}, ${mg2.give.toFixed(2)})`, await B(page, 'tilstand') === 'ioner'
  && JSON.stringify(await B(page, 'ladninger')) === '[2,-2]' && nær(mg2.tage, -22.68, 0.01) && nær(mg2.give, -6.25, 0.01));
tjek('Mg + O: panelet siger, at den anden elektron kostede hos oxygen', (await page.textContent('#bytteTrinTekst')).includes('O⁻ er allerede minus'));
tjek('Mg + O: måleren går til ±30 eV', await B(page, 'skala') === 30 && await page.getAttribute('#bytteMåler', 'aria-valuemin') === '-30');
await ingenRulAlle('Mg + O-ioner');
await page.screenshot({ path: UD + '/7-mgo-ioner.png' });
await B(page, 'handling'); // Byg krystallen
await spol(page, 5);
tjek(`Mg + O: krystallen ender på +10,40 eV (${(await B(page, 'regnskab')).iAlt.toFixed(2)})`, await B(page, 'tilstand') === 'krystal' && nær((await B(page, 'regnskab')).iAlt, 10.40, 0.01));

// Ca + 2 Cl: én elektron til hvert chloratom
await vælg('cacl2');
await B(page, 'handling'); // Vis mig: den første til det første chloratom
await spol(page, 3);
tjek('Ca + 2 Cl: Ca⁺, Cl⁻ og Cl', JSON.stringify(await B(page, 'ladninger')) === '[1,-1,0]' && await B(page, 'tilstand') === 'start');
await trækTil(await B(page, 'tagerPå', 0));
tjek('Ca + 2 Cl: Cl⁻ er fuld, så elektronen flyver hjem', await B(page, 'flyttet') === 1 && await B(page, 'tilstand') === 'start' && JSON.stringify(await B(page, 'ladninger')) === '[1,-1,0]');
await trækTil(await B(page, 'tagerPå', 1));
const ca = await B(page, 'regnskab');
tjek(`Ca + 2 Cl: Ca²⁺ og to Cl⁻, −17,98 og +7,23 eV (${ca.tage.toFixed(2)}, ${ca.give.toFixed(2)})`, await B(page, 'tilstand') === 'ioner'
  && JSON.stringify(await B(page, 'ladninger')) === '[2,-1,-1]' && nær(ca.tage, -17.98, 0.01) && nær(ca.give, 7.23, 0.01));
await page.click('#bytteKrystal');
await spol(page, 5);
const caK = await B(page, 'krystal');
tjek(`Ca + 2 Cl: krystallen har en Ca for hver to Cl (${caK.plus}/${caK.antal}) og ender på +12,61 eV`, await B(page, 'tilstand') === 'krystal'
  && caK.antal === 3 * caK.plus && nær((await B(page, 'regnskab')).iAlt, 12.61, 0.01));
tjek('Ca + 2 Cl: panelet siger, at mønstret er et andet end i køkkensalt', (await page.textContent('#bytteTrinTekst')).includes('andet mønster'));
await ingenRulAlle('Ca + 2 Cl-krystal');
await page.screenshot({ path: UD + '/8-krystal-cacl2.png' });

// Na + Na: elektronen flyver hjem igen
await vælg('nana');
tjek('Na + Na: ingen krystal-knap', !(await page.isVisible('#bytteKrystal')) && !(await page.isVisible('#bytteMødes')));
await trækTil(await B(page, 'tagerPå', 0));
const nana = await B(page, 'regnskab');
tjek(`Na + Na: Na⁺ og Na⁻ koster −5,14 + 0,55 eV (${nana.tage.toFixed(2)}, ${nana.give.toFixed(2)})`, await B(page, 'tilstand') === 'afvist'
  && nær(nana.tage, -5.139, 0.001) && nær(nana.give, 0.548, 0.001) && nana.iAlt < -3);
await spol(page, 3);
tjek('Na + Na: elektronen er fløjet hjem, begge er neutrale', await B(page, 'tilstand') === 'start' && JSON.stringify(await B(page, 'ladninger')) === '[0,0]' && (await B(page, 'regnskab')).iAlt === 0);
tjek('Na + Na: panelet siger "de bytter ikke", ikke "binder sig ikke"', (await page.textContent('#bytteTrinTekst')).includes('bytter ikke') && !(await page.textContent('#bytteInfo')).includes('binder sig ikke'));
tjek('alle fem par har ★', (await Promise.all(['nacl', 'lif', 'mgo', 'cacl2', 'nana'].map(stjerne))).every((x) => x === '★'));
await ingenRulAlle('Na + Na');

// Fremgangen: "Din fremgang" i menuen tæller Molekyler for sig, og Værkstedet tæller kun atom-opgaverne
const antalAtom = await page.evaluate(() => import('./js/data/opgaver.js').then((m) => m.OPGAVER.length));
await page.evaluate(() => { location.hash = '#menu'; });
await page.waitForTimeout(800);
await page.click('.menu-fremgang-knap');
const kortM = await page.textContent('#fremgangListe [data-del="molekyler"] .fremgang-tal');
const kortV = await page.textContent('#fremgangListe [data-del="vaerksted"] .fremgang-tal');
tjek(`"Din fremgang": Molekyler har sine 13 opgaver (${kortM.trim()}), Værkstedet sine ${antalAtom} (${kortV.trim()})`,
  /\b([5-9]|1[0-3]) af 13 opgaver/.test(kortM) && kortV.includes(`af ${antalAtom} opgaver`));
await page.keyboard.press('Escape');
await page.evaluate(() => { location.hash = '#vaerksted'; });
await page.waitForFunction(() => document.querySelector('#vaerksted:not(.skjult)'));
await page.click('#knapOpgaver');
const liste = await page.evaluate(() => [...document.querySelectorAll('#opgaver li')].map((li) => li.textContent).join(' / '));
tjek('Værkstedets opgaveliste har ikke længere molekylernes opgaver', !liste.includes('Giv elektroner') && !liste.includes('Del elektroner') && !liste.includes('Magnesium + oxygen'), liste);
await ctx.close();

// Tablet og telefon: del-knapperne, 3D-billedet øverst og "Vis mig"
for (const [navn, vp] of [['tablet-højkant', { width: 820, height: 1180 }], ['tablet-langs', { width: 1180, height: 820 }], ['tlf', { width: 390, height: 844 }], ['tlf-langs', { width: 844, height: 390 }]]) {
  const { ctx: c2, page: p } = await side({ viewport: vp, hasTouch: true, isMobile: navn.startsWith('tlf') });
  await p.click('#bygPanel [data-molekyle-maade="bytte"]');
  await p.waitForTimeout(800);
  const vindue = await p.evaluate(() => document.getElementById('molekylerVindue').getBoundingClientRect().toJSON());
  tjek(`${navn}: 3D-billedet er stort nok (${Math.round(vindue.width)} × ${Math.round(vindue.height)})`, vindue.width > 300 && vindue.height > 170);
  tjek(`${navn}: ingen vandret rulning`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const knapper = await p.evaluate(() => [...document.querySelectorAll('#byttePanel [data-molekyle-maade]')].map((b) => b.getBoundingClientRect()).every((r) => r.width > 0 && r.right <= innerWidth + 1));
  tjek(`${navn}: "Del | Giv elektroner" er inde på skærmen`, knapper);
  // Panelet ved siden af 3D-billedet (pc og tablet på langs): ingen rullebjælke, heller ikke med en foldeboks åben
  if (vp.width > vp.height && vp.height > 500) {
    const rul = () => p.evaluate(() => { const el = document.getElementById('bytteInfo'); return el.scrollHeight <= el.clientHeight + 1 ? '' : `${el.scrollHeight}/${el.clientHeight}`; });
    const fejlRul = [await rul()];
    for (const lag of ['bytte-nørd', 'bytte-ærligt']) {
      await p.click(`[data-lag="${lag}"] summary`);
      fejlRul.push(await rul());
      await p.click(`[data-lag="${lag}"] summary`);
    }
    tjek(`${navn}: højre panel uden rullebjælke`, fejlRul.every((x) => !x), fejlRul.join(' '));
  }
  await p.click('#bytteMission .mission-vis');
  await B(p, 'spol', 3);
  tjek(`${navn}: "Vis mig" flytter elektronen`, await B(p, 'tilstand') === 'ioner');
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${UD}/5-${navn}.png` });
  // Krystallen: Den skal være inde i 3D-billedet, og parrene står i venstre panel
  await B(p, 'handling');
  await B(p, 'spol', 7);
  await B(p, 'handling');
  await B(p, 'spol', 5);
  tjek(`${navn}: krystallen er bygget`, await B(p, 'tilstand') === 'krystal');
  tjek(`${navn}: parrenes knapper er inde på skærmen`, await p.evaluate(() => [...document.querySelectorAll('.bytte-par')].every((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.right <= innerWidth + 1; })));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${UD}/9-krystal-${navn}.png` });
  await c2.close();
}

tjek('ingen konsolfejl', fejl.length === 0, fejl.join('\n'));
await browser.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
