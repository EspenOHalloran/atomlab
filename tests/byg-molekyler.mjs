// Byg et molekyle → "Del elektroner" (Molekyler M2a) i Atomværkstedet: fanen og måderne, paletten (træk og tryk),
// træk et atom hen til et andet (bindingen), vand bliver færdigt og får sit navn, det ulovlige (atomet skubbes væk,
// og der står hvorfor), træk tilbage til paletten fjerner atomet, et træk et andet sted drejer kameraet, tidsknappen,
// "Næste skridt", foldeboksene uden rullebjælke, ingen konsolfejl, og tablet og telefon begge veje.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('byg-molekyler');
const URL = `${ADRESSE}/index.html?test#vaerksted`;
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
  await page.waitForFunction(() => window.atomlabTest?.vaerksted?.byg);
  return { ctx, page };
}
const G = (page, f, ...a) => page.evaluate(([f, a]) => window.atomlabTest.vaerksted.byg[f](...a), [f, a]);
const spol = (page, sek) => G(page, 'spol', sek);
// Formen falder på plads, og kameraet bliver færdigt med at zoome og følge molekylet (først så står atomerne stille på skærmen)
const stille = async (page) => {
  await spol(page, 1);
  await page.waitForFunction(() => atomlabTest.vaerksted.byg.kameraStille(), null, { timeout: 15000, polling: 100 }).catch(() => console.log('     (kameraet blev ikke stille)'));
};
const undertekst = (page) => page.evaluate(() => [...document.querySelectorAll('#vaerkstedVindue .undertekst')].map((e) => e.textContent).join(' '));

// Trækker med musen fra (x, y) til (tx, ty) i små skridt
async function træk(page, x, y, tx, ty) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move((x + tx) / 2, (y + ty) / 2, { steps: 6 });
  await page.mouse.move(tx, ty, { steps: 6 });
  await page.mouse.up();
}
// Et frit sted i 3D-billedet (midt i vinduet, lidt til venstre eller højre)
const vinduePunkt = (page, fx, fy) => page.evaluate(([fx, fy]) => {
  const r = document.getElementById('vaerkstedVindue').getBoundingClientRect();
  return { x: r.left + r.width * fx, y: r.top + r.height * fy };
}, [fx, fy]);

const { ctx, page } = await side({ viewport: { width: 1280, height: 800 } });

// Fanen og måderne
await page.click('[data-vaerksted-del="molekyle"]');
await page.waitForTimeout(400);
tjek('"Byg et molekyle" åbner med "Del elektroner"', await page.evaluate(() => atomlabTest.vaerksted.del()) === 'byg'
  && await page.evaluate(() => document.getElementById('vaerksted').classList.contains('del-elektroner'))
  && await page.getAttribute('#bygPanel [data-vaerksted-maade="byg"]', 'aria-pressed') === 'true');
tjek('byggepanel, infopanel, det lille periodiske system, opgavepillen og "Elektronsky" er skjult',
  !(await page.isVisible('#byggepanel')) && !(await page.isVisible('#infopanel')) && !(await page.isVisible('#minitabelPanel'))
  && !(await page.isVisible('#opgavePille')) && !(await page.isVisible('#knapVisning')));
tjek('paletten, højre panel, "Næste skridt" og tidsknappen vises', await page.isVisible('#bygPalet') && await page.isVisible('#bygInfo')
  && await page.isVisible('#bygMission') && await page.isVisible('#bygTid'));
tjek('paletten har H, C, N, O og Cl', (await page.$$eval('.palet-atom', (b) => b.map((x) => x.dataset.symbol))).join(' ') === 'H C N O Cl');
tjek('"Giv elektroner" er skjult', !(await page.isVisible('#byttePanel')) && !(await page.isVisible('#bytteMåler')));
tjek('Reaktorens del-knapper er ikke rørt (stadig to med data-del)', await page.evaluate(() => document.querySelectorAll('.del-knap[data-del]').length) === 2);
tjek('"Næste skridt": træk et atom ind', (await page.textContent('#bygMission .mission-tekst')).includes('Træk et atom'));
await page.click('#bygPanel [data-vaerksted-maade="bytte"]');
await page.waitForTimeout(300);
tjek('"Giv elektroner" skifter til Byttebørsens del', await page.evaluate(() => atomlabTest.vaerksted.del()) === 'bytte' && await page.isVisible('#byttePanel') && !(await page.isVisible('#bygPanel')));
await page.click('[data-vaerksted-del="atom"]');
await page.click('[data-vaerksted-del="molekyle"]');
tjek('fanen husker den sidste måde ("Giv elektroner")', await page.evaluate(() => atomlabTest.vaerksted.del()) === 'bytte');
await page.click('#byttePanel [data-vaerksted-maade="byg"]');
await page.waitForTimeout(400);
await stille(page);

// Træk et O fra paletten ind i billedet
const midt = await vinduePunkt(page, 0.5, 0.55);
const pO = await G(page, 'paletPå', 'O');
await træk(page, pO.x, pO.y, midt.x, midt.y);
tjek('et O er trukket ind fra paletten', JSON.stringify(await G(page, 'atomer')) === '["O"]' && !(await G(page, 'trækker')));
const o0 = await G(page, 'atomPå', 0);
tjek(`O står der, hvor det blev sluppet (${Math.round(o0.x)}, ${Math.round(o0.y)})`, nær(o0.x, midt.x, 6) && nær(o0.y, midt.y, 6));
tjek('et enligt O har to elektroner uden partner', (await G(page, 'grupper'))[0].uden === 2);
await page.waitForTimeout(400);
tjek('panelet: Oxygen (O) med to elektroner uden partner', (await page.textContent('#bygTitel')).includes('Oxygen') && (await page.textContent('#bygTekst')).includes('2 elektroner'));
tjek('"Næste skridt": træk et atom mere ind', (await page.textContent('#bygMission .mission-tekst')).includes('Træk et atom mere'));

// Træk et H hen til O: bindingen springer
await spol(page, 1);
await stille(page);
let o = await G(page, 'atomPå', 0);
const pH = await G(page, 'paletPå', 'H');
await træk(page, pH.x, pH.y, o.x + 25, o.y - 10);
tjek('H + O: en binding', JSON.stringify(await G(page, 'bånd')) === '[[1,0]]', JSON.stringify(await G(page, 'bånd')));
await spol(page, 1.5);
await stille(page);
tjek('HO er ikke færdigt (O har én elektron uden partner)', !(await G(page, 'grupper'))[0].færdig && (await G(page, 'grupper'))[0].uden === 1);
await page.waitForTimeout(400);
tjek('"Næste skridt": oxygen har en elektron uden partner', (await page.textContent('#bygMission .mission-tekst')).includes('Oxygen har 1 elektron'));
// Et tryk på H i paletten sætter det ved siden af molekylet. Så trækkes det hen til O.
await page.click('.palet-atom[data-symbol="H"]');
tjek('et tryk på paletten sætter et H ved siden af', (await G(page, 'atomer')).length === 3 && (await G(page, 'grupper')).length === 2);
await spol(page, 0.5);
await stille(page);
o = await G(page, 'atomPå', 0);
let h2 = await G(page, 'atomPå', 2);
await træk(page, h2.x, h2.y, o.x - 20, o.y + 15);
await spol(page, 3);
const grupper = await G(page, 'grupper');
tjek('vand er færdigt og hedder "Vand"', grupper.length === 1 && grupper[0].færdig && grupper[0].navn === 'Vand' && grupper[0].formel === 'H₂O', JSON.stringify(grupper));
tjek(`vand er bøjet: ${(await G(page, 'vinkel', 1, 0, 2)).toFixed(2)}° (målt 104,48°)`, nær(await G(page, 'vinkel', 1, 0, 2), 104.48, 1));
await page.waitForTimeout(500);
tjek('panelet: Vand (H₂O), færdigt', (await page.textContent('#bygTitel')) === 'Vand (H₂O)' && (await page.textContent('#bygTekst')).includes('Færdigt'));
tjek('underteksten siger Vand (H₂O)', (await undertekst(page)).includes('Vand (H₂O)'));
tjek('"Næste skridt": drej molekylet', (await page.textContent('#bygMission .mission-tekst')).includes('Drej'));
await stille(page);
await page.waitForTimeout(500);
await page.screenshot({ path: UD + '/1-vand.png' });

// Det ulovlige: et H mere på O i vand skubbes væk, og der står hvorfor
await page.click('.palet-atom[data-symbol="H"]');
await spol(page, 0.5);
await stille(page);
o = await G(page, 'atomPå', 0);
const h3 = await G(page, 'atomPå', 3);
await træk(page, h3.x, h3.y, o.x, o.y - 20);
tjek('et tredje H på O i vand: ingen binding', (await G(page, 'bånd')).length === 2);
tjek('der står hvorfor (Oxygen har allerede to bindinger)', (await undertekst(page)).includes('Oxygen har allerede to bindinger'));
await stille(page);
const o2 = await G(page, 'atomPå', 0);
const h3b = await G(page, 'atomPå', 3);
tjek(`H er skubbet væk fra O (${Math.round(Math.hypot(h3b.x - o2.x, h3b.y - o2.y))} px)`, Math.hypot(h3b.x - o2.x, h3b.y - o2.y) > 50);
// Et H på et H i vand: "Hydrogen har kun én elektron"
const h1 = await G(page, 'atomPå', 1);
await træk(page, h3b.x, h3b.y, h1.x + 5, h1.y + 5);
tjek('et H på et H i vand: ingen binding, og der står hvorfor', (await G(page, 'bånd')).length === 2 && (await undertekst(page)).includes('Hydrogen har kun én elektron'), await undertekst(page) + JSON.stringify([h3b, h1, await G(page, 'bånd')]));
await stille(page);

// Træk det løse H tilbage til paletten: det forsvinder
const h3c = await G(page, 'atomPå', 3);
await træk(page, h3c.x, h3c.y, pO.x, pO.y);
tjek('træk tilbage til paletten fjerner atomet', (await G(page, 'atomer')).length === 3 && (await G(page, 'grupper'))[0].navn === 'Vand');

// Et træk på et tomt sted drejer kameraet, ikke atomerne
const før = await G(page, 'atomPå', 1);
const tomt = await vinduePunkt(page, 0.2, 0.8);
await page.mouse.move(tomt.x, tomt.y);
await page.mouse.down();
await page.mouse.move(tomt.x + 80, tomt.y - 10, { steps: 5 });
tjek('mens man drejer, er kameraets styring slået til', await G(page, 'styring'));
await page.mouse.up();
const efter = await G(page, 'atomPå', 1);
tjek('et træk på et tomt sted drejer billedet (H flytter sig på skærmen) og flytter ikke atomerne', Math.hypot(efter.x - før.x, efter.y - før.y) > 3 && !(await G(page, 'trækker')) && (await G(page, 'bånd')).length === 2);

// Træk et H langt væk: bindingen går i stykker
await stille(page);
const hv = await G(page, 'atomPå', 1);
const langt = await vinduePunkt(page, 0.15, 0.2);
await page.mouse.move(hv.x, hv.y);
await page.mouse.down();
await page.mouse.move(langt.x, langt.y, { steps: 8 });
tjek('mens man trækker, er kameraets styring slået fra', !(await G(page, 'styring')) && await G(page, 'trækker'));
const tr = await G(page, 'træk');
tjek('trukket langt væk: bindingen vises som strakt (rød), før man slipper', tr?.atom === 1 && tr.strakte.includes(0), JSON.stringify(tr));
await page.mouse.up();
tjek('trukket langt væk: bindingen går i stykker', (await G(page, 'bånd')).length === 1 && (await G(page, 'grupper')).length === 2, JSON.stringify([hv, langt, await G(page, 'bånd'), await G(page, 'atomer')]));

// Tidsknappen: under pause står blinket stille, og et træk virker stadig
await page.click('#bygTid [data-tid="pause"]').catch(async () => page.click('#bygTid button:first-child'));
const t0 = await G(page, 'tid');
await spol(page, 1);
tjek('tidsknappen: pause stopper tiden', await G(page, 'tidsknap') === 'pause' && (await G(page, 'tid')) === t0, `${await G(page, 'tidsknap')} ${t0} ${await G(page, 'tid')}`);
await page.click('#bygTid [data-tid="spil"]').catch(async () => page.click('#bygTid button:last-child'));
await spol(page, 0.5);
tjek('tidsknappen: tiden går igen', (await G(page, 'tid')) > t0);

// Kendte molekyler bygget med testadgangen (reglerne er de samme som ved at slippe)
await page.click('#bygForfra');
tjek('"Forfra" rydder', (await G(page, 'atomer')).length === 0);
async function byg(tunge, bånd, h) {
  await G(page, 'ryd');
  for (const s of tunge) await G(page, 'tilføj', s);
  for (const [a, b] of bånd) await G(page, 'bind', a, b);
  for (let i = 0; i < h.length; i++) for (let k = 0; k < h[i]; k++) { await G(page, 'tilføj', 'H'); await G(page, 'bind', (await G(page, 'atomer')).length - 1, i); }
  await spol(page, 3);
  return G(page, 'grupper');
}
let g = await byg(['C'], [], [4]);
tjek(`metan: tetraeder (${(await G(page, 'vinkel', 1, 0, 2)).toFixed(1)}°) og navnet Metan`, g[0].navn === 'Metan' && nær(await G(page, 'vinkel', 1, 0, 2), 109.47, 1));
g = await byg(['C', 'O', 'O'], [[1, 0], [2, 0]], []);
tjek(`kuldioxid: lige (${(await G(page, 'vinkel', 1, 0, 2)).toFixed(1)}°), to dobbeltbindinger`, g[0].navn === 'Kuldioxid' && nær(await G(page, 'vinkel', 1, 0, 2), 180, 1) && (await G(page, 'ordener')).join('') === '22');
g = await byg(['N', 'N'], [[1, 0]], []);
tjek('nitrogen: tripelbinding', g[0].navn === 'Nitrogen' && (await G(page, 'ordener')).join('') === '3');
g = await byg(['C', 'O'], [[1, 0]], []);
await page.waitForTimeout(400);
tjek('kulilte: C≡O (O låner et par), og "Ærligt talt" siger det', g[0].navn === 'Kulilte' && (await G(page, 'ordener')).join('') === '3'
  && (await page.textContent('#bygÆrligtMolekyle')).includes('låner'));
g = await byg(['C', 'O', 'C'], [[1, 0], [2, 1]], [3, 0, 3]);
await page.waitForTimeout(400);
tjek(`dimethylether: reglerne passer, men ukendt (${g[0].formel})`, g[0].færdig && g[0].navn === null && (await page.textContent('#bygTekst')).includes('AtomLab kender ikke'));
g = await byg(['C', 'C', 'O'], [[0, 1], [1, 2]], [3, 2, 1]);
tjek('ethanol (9 atomer)', g[0].navn === 'Ethanol');
await stille(page);
await page.waitForTimeout(600);
await page.screenshot({ path: UD + '/2-ethanol.png' });
// Højst 12 atomer
for (let k = 0; k < 4; k++) await G(page, 'tilføj', 'H');
tjek('højst 12 atomer: paletten er slået fra', (await G(page, 'atomer')).length === 12 && await page.isDisabled('.palet-atom[data-symbol="C"]'));

// Panelet: ingen rullebjælke, heller ikke med en foldeboks åben (kun én ad gangen)
async function ingenRul(p, navn) {
  const rul = () => p.evaluate(() => ['bygInfo', 'bygPanel'].map((id) => { const el = document.getElementById(id); return el.scrollHeight <= el.clientHeight + 1 ? '' : `${id} ${el.scrollHeight}/${el.clientHeight}`; }).join(''));
  const r = [await rul()];
  for (const lag of ['byg-nørd', 'byg-ærligt']) {
    await p.click(`[data-lag="${lag}"] summary`);
    r.push(await rul());
  }
  await p.click('[data-lag="byg-ærligt"] summary');
  tjek(`${navn}: panelerne uden rullebjælke (også med en foldeboks åben)`, r.every((x) => !x), r.join(' | '));
}
await byg(['C', 'O'], [[1, 0]], []); // kulilte har den længste "Ærligt talt"
await ingenRul(page, 'pc');

// "Hvorfor?"-kortene findes
await page.click('[data-hvorfor="bygForm"]');
tjek('"Hvorfor er vand bøjet?" åbner et kort', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Hvorfor er vand bøjet?');
await page.keyboard.press('Escape');

// Oxygens elektroner: et O alene og O₂ får hver deres ekstra "Hvorfor?"-kort, og kortene hænger sammen med "Og hvorfor det?"
const ekstra = () => page.evaluate(() => { const b = document.getElementById('bygHvorforEkstra'); return b.hidden ? '' : `${b.dataset.hvorfor}|${b.textContent}`; });
await byg(['O'], [], []);
tjek('et O alene: knappen "Hvorfor to uden partner?"', (await ekstra()) === 'bygUdenPartner|Hvorfor to uden partner?', await ekstra());
await page.click('#bygHvorforEkstra');
const kæde = [await page.evaluate(() => atomlabTest.hvorfor.vist())];
for (let k = 0; k < 2; k++) { await page.click('.hk-næste'); kæde.push(await page.evaluate(() => atomlabTest.hvorfor.vist())); }
tjek('kortene om oxygen hænger sammen', kæde.join(' › ') === 'Hvorfor har oxygen to elektroner uden partner? › Har oxygen altid 6 elektroner yderst? › Hvad sker der med elektronerne i O₂?', kæde.join(' › '));
await page.keyboard.press('Escape');
await byg(['O', 'O'], [[0, 1]], []);
tjek('O₂: knappen "Hvad sker der i O₂?"', (await ekstra()) === 'bygO2|Hvad sker der i O₂?', await ekstra());
await ingenRul(page, 'pc, O₂');
await byg(['O'], [], [2]);
tjek('vand: ingen ekstra knap', (await ekstra()) === '', await ekstra());

// Skærmskift midt i et træk: styringen slås til igen
await G(page, 'ryd');
await G(page, 'tilføj', 'C');
await spol(page, 0.5);
await stille(page);
const c0 = await G(page, 'atomPå', 0);
await page.mouse.move(c0.x, c0.y);
await page.mouse.down();
await page.mouse.move(c0.x + 40, c0.y, { steps: 3 });
await page.evaluate(() => { location.hash = '#menu'; });
await page.waitForTimeout(500);
await page.mouse.up();
tjek('skærmskift midt i et træk: kameraets styring er slået til igen', await page.evaluate(() => atomlabTest.vaerksted.byg.styring()));
await page.evaluate(() => { location.hash = '#vaerksted'; });
await page.waitForTimeout(500);
tjek('tilbage i Værkstedet: stadig "Del elektroner" med atomet', await page.evaluate(() => atomlabTest.vaerksted.del()) === 'byg' && (await G(page, 'atomer')).length === 1);
await ctx.close();

// Tablet og telefon: fanerne, 3D-billedet øverst, paletten lige under, et træk med fingeren og ingen rullebjælke
for (const [navn, vp] of [['tablet-højkant', { width: 820, height: 1180 }], ['tablet-langs', { width: 1180, height: 820 }], ['tlf', { width: 390, height: 844 }], ['tlf-langs', { width: 844, height: 390 }]]) {
  const { ctx: c2, page: p } = await side({ viewport: vp, hasTouch: true, isMobile: navn.startsWith('tlf') });
  await p.click('[data-vaerksted-del="molekyle"]');
  await p.waitForTimeout(600);
  const vindue = await p.evaluate(() => document.getElementById('vaerkstedVindue').getBoundingClientRect().toJSON());
  tjek(`${navn}: 3D-billedet er stort nok (${Math.round(vindue.width)} × ${Math.round(vindue.height)})`, vindue.width > 300 && vindue.height > 170);
  tjek(`${navn}: ingen vandret rulning`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const faner = await p.evaluate(() => [...document.querySelectorAll('[data-vaerksted-del]')].map((b) => b.getBoundingClientRect()));
  tjek(`${navn}: fanerne er inde på skærmen og på én linje`, faner.every((r) => r.width > 0 && r.right <= vp.width + 1) && Math.abs(faner[0].top - faner[1].top) < 2);
  const maade = await p.evaluate(() => [...document.querySelectorAll('#bygPanel [data-vaerksted-maade]')].map((b) => b.getBoundingClientRect()));
  tjek(`${navn}: "Del elektroner | Giv elektroner" er på én linje`, maade.every((r) => r.width > 0 && r.right <= vp.width + 1) && Math.abs(maade[0].top - maade[1].top) < 2);
  // Byg vand med testadgangen og se, at navnet kommer
  for (const s of ['O', 'H', 'H']) await G(p, 'tilføj', s);
  await G(p, 'bind', 1, 0);
  await G(p, 'bind', 2, 0);
  await G(p, 'spol', 3);
  tjek(`${navn}: vand er færdigt`, (await G(p, 'grupper'))[0].navn === 'Vand');
  // Et træk med fingeren fra paletten ind i billedet (touch-hændelser via CDP)
  const fra = await G(p, 'paletPå', 'C');
  if (fra.y > 0 && fra.y < vp.height) {
    const til = await vinduePunkt(p, 0.25, 0.3);
    const cdp = await c2.newCDPSession(p);
    const tryk = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    await tryk('touchStart', fra.x, fra.y);
    for (let k = 1; k <= 8; k++) await tryk('touchMove', fra.x + (til.x - fra.x) * k / 8, fra.y + (til.y - fra.y) * k / 8);
    await tryk('touchEnd');
    tjek(`${navn}: et træk med fingeren fra paletten giver et C`, (await G(p, 'atomer')).includes('C'), JSON.stringify(await G(p, 'atomer')));
  } else {
    console.log(`     (${navn}: paletten er under skærmkanten, trækket med fingeren springes over)`);
  }
  if (vp.width > vp.height && vp.height > 500) await ingenRul(p, navn);
  await G(p, 'spol', 1);
  await p.waitForFunction(() => atomlabTest.vaerksted.byg.kameraStille(), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${UD}/3-${navn}.png` });
  await c2.close();
}

tjek('ingen konsolfejl', fejl.length === 0, fejl.join(' | '));
await browser.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
