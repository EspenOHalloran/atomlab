// Dybde i lag (docs/plan-lag.md): panelerne kan skjules ("Kun grafik", fanerne og tasterne G og Esc),
// foldeboksene, "Hvorfor?"-kortene, den korte undertekst med "Hvorfor?", og at "Næste skridt" er skjult under guiden.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('lag');
const b = await chromium.launch({ args: ARGS });
const fejl = [];
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const SET = { fusion: 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1, 'fusion-rejse': 1, batteri: 1 };

async function side(opts, guider = SET) {
  const ctx = await b.newContext(opts);
  await ctx.addInitScript((g) => { if (!sessionStorage.getItem('klar')) { localStorage.setItem('atomlabGuide', JSON.stringify(g)); sessionStorage.setItem('klar', '1'); } }, guider);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  return page;
}
const vent = (page, h) => page.waitForFunction(() => window.atomlabTest && document.querySelector(location.hash + ':not(.skjult)'), null, { timeout: 20000 }).then(() => page.waitForTimeout(h ?? 300));
const bredde = (page, sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().width, sel);
const synlig = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetWidth && getComputedStyle(e).visibility !== 'hidden'); }, sel);

// ---------- pc: panelerne i Stjerneovnen ----------
{
  const page = await side({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${ADRESSE}/?test#fusion`);
  await vent(page);
  const før = await bredde(page, '#fusionVindue');
  tjek('pc: fanerne på kanten vises', await synlig(page, '#fusionVindue .panel-fane.venstre') && await synlig(page, '#fusionVindue .panel-fane.højre'));
  await page.click('#fusionVindue .panel-fane.venstre');
  await page.waitForTimeout(200);
  const efterVenstre = await bredde(page, '#fusionVindue');
  tjek('pc: venstre panel kan skjules, og 3D-billedet bliver bredere', !(await synlig(page, '#fusion .venstre-panel')) && efterVenstre > før + 150, `${før} → ${efterVenstre}`);
  await page.click('#fusionVindue .panel-fane.venstre');
  await page.waitForTimeout(200);
  tjek('pc: og hentes igen', await synlig(page, '#fusion .venstre-panel') && Math.abs((await bredde(page, '#fusionVindue')) - før) < 2);
  await page.keyboard.press('g');
  await page.waitForTimeout(200);
  tjek('pc: G giver "Kun grafik" (begge paneler væk, 3D-billedet fylder bredden)', !(await synlig(page, '#fusion .venstre-panel')) && !(await synlig(page, '#fusion .højre-panel')) && (await bredde(page, '#fusionVindue')) > 1200);
  tjek('pc: "Næste skridt" er der stadig', await synlig(page, '#fusMission'));
  await page.screenshot({ path: `${UD}/pc-fusion-kun-grafik.png` });
  await page.reload();
  await vent(page);
  tjek('pc: "Kun grafik" huskes', await page.evaluate(() => document.getElementById('fusion').classList.contains('kun-grafik')));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  tjek('pc: Esc henter panelerne', await synlig(page, '#fusion .venstre-panel') && await synlig(page, '#fusion .højre-panel'));
  await page.click('#fusion .knap-kungrafik');
  await page.waitForTimeout(200);
  tjek('pc: knappen "Kun grafik" virker også', await page.evaluate(() => document.getElementById('fusion').classList.contains('kun-grafik')));
  await page.click('#fusion .knap-kungrafik');

  // Opgaverne er foldet sammen til én linje
  tjek('pc: opgaverne er foldet sammen', await page.evaluate(() => !document.querySelector('[data-lag="fus-opgaver"]').open && /af 7 ★/.test(document.getElementById('fusOpgaveTal').textContent)));

  // Undertekst og panel: Vis mig laver en reaktion. Underteksten er kort, og forklaringen står i panelet.
  await page.click('#fusVisMig');
  await page.evaluate(() => atomlabTest.fusion.spolAlt(16));
  await page.waitForFunction(() => !atomlabTest.fusion.demo() && document.querySelector('.undertekst.reaktion'), null, { timeout: 15000 }).catch(() => {});
  const ut = await page.evaluate(() => document.querySelector('.undertekst.reaktion .ut-tekst')?.textContent ?? '');
  const panel = await page.evaluate(() => document.getElementById('fusSeneste').textContent);
  tjek('pc: underteksten er kort (højst ca. 90 tegn)', ut.length > 0 && ut.length <= 95, `${ut.length}: ${ut}`);
  tjek('pc: forklaringen står i panelet og ikke i underteksten', panel.length > 60 && !ut.includes(panel.slice(0, 40)), panel.slice(0, 60));
  tjek('pc: den seneste reaktion er foldet ud i panelet', await page.evaluate(() => document.getElementById('fusSenesteBoks').open));
  await page.click('.undertekst.reaktion button.hvorfor');
  await page.waitForTimeout(200);
  const kort = await page.evaluate(() => atomlabTest.hvorfor.vist());
  tjek('pc: "Hvorfor?" i underteksten åbner forklaringen', kort && ut.startsWith(kort.slice(0, 10)), `${kort} / ${ut}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  tjek('pc: Esc lukker kortet (og ikke andet)', !(await page.evaluate(() => atomlabTest.hvorfor.vist())) && await synlig(page, '#fusion .venstre-panel'));
  await page.context().close();
}

// ---------- pc: "Hvorfor?"-kortene i Reaktoren ----------
{
  const page = await side({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${ADRESSE}/?test#reaktor`);
  await vent(page);
  tjek('pc: Reaktoren viser kun kernens tal i den øverste boks (ikke guidens tekst)', await page.evaluate(() => !document.getElementById('reaktorForklaring').open && /92 protoner/.test(document.getElementById('reaktorForklaringKort').textContent)));
  await page.click('#reaktor button.hvorfor[data-hvorfor="farligt"]');
  await page.waitForTimeout(200);
  tjek('pc: kortet "Er det farligt?" åbner ved knappen', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Er det farligt?');
  await page.screenshot({ path: `${UD}/pc-hvorfor.png` });
  await page.click('.hvorfor-kort .hk-næste');
  tjek('pc: "Og hvorfor det?" går et lag dybere', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Hvad gør strålingen ved DNA\'et?');
  await page.click('.hvorfor-kort .hk-næste');
  tjek('pc: og et lag mere', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Hvor meget skal der til?');
  tjek('pc: det dybeste lag har "Vil du vide mere?"', await synlig(page, '.hvorfor-kort .hk-nørd'));
  await page.click('.hvorfor-kort .hk-tilbage');
  tjek('pc: "‹ Tilbage" går tilbage', (await page.evaluate(() => atomlabTest.hvorfor.vist())) === 'Hvad gør strålingen ved DNA\'et?');
  await page.mouse.click(640, 400);
  await page.waitForTimeout(150);
  tjek('pc: et tryk udenfor lukker kortet', !(await page.evaluate(() => atomlabTest.hvorfor.vist())));
  // En foldeboks, man selv åbner, huskes
  await page.click('[data-lag="reaktor-200"] > summary');
  await page.waitForTimeout(300); // "toggle" kommer lidt efter klikket
  await page.reload();
  await vent(page);
  tjek('pc: en foldeboks, man selv åbner, huskes', await page.evaluate(() => document.querySelector('[data-lag="reaktor-200"]').open));
  // Siden i lag i Kosmos (U3): "Vil du vide mere?" huskes for alle sider, men emnerne starter altid foldet sammen
  await page.evaluate(() => { location.hash = '#kosmos'; });
  await page.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'));
  await page.evaluate(() => atomlabTest.kosmos.vælg('bigbang'));
  await page.click('#kosmosTekst details[data-lag="side-nørd"] > summary');
  await page.click('#kosmosTekst details.side-emne > summary');
  await page.waitForTimeout(300);
  await page.evaluate(() => atomlabTest.kosmos.vælg('pulsar'));
  const kos = await page.evaluate(() => ({ nørd: document.querySelector('#kosmosTekst details[data-lag="side-nørd"]').open, emner: atomlabTest.kosmos.side().emner.some((e) => e.åben) }));
  tjek('pc: Kosmos husker "Vil du vide mere?" på det næste fænomen, og emnerne er foldet sammen', kos.nørd && !kos.emner, JSON.stringify(kos));
  await page.context().close();
}

// ---------- "Næste skridt" er skjult, mens guiden kører ----------
{
  const page = await side({ viewport: { width: 1280, height: 800 } }, { 'fusion-rejse': 1 });
  await page.goto(`${ADRESSE}/?test#fusion`);
  await vent(page, 1500);
  await page.waitForFunction(() => document.querySelector('.guide-boble:not(.skjult)'), null, { timeout: 10000 }).catch(() => {});
  tjek('guide: "Næste skridt" er skjult, mens guiden kører', !(await synlig(page, '#fusMission')));
  await page.click('.guide-spring');
  await page.waitForTimeout(200);
  tjek('guide: og kommer frem, når guiden er færdig', await synlig(page, '#fusMission'));
  await page.context().close();
}

// ---------- tablet og telefon på højkant: ingen faner, og "Kun grafik" fylder skærmen ----------
for (const [navn, vp] of [['tablet', { width: 800, height: 1280 }], ['telefon', { width: 390, height: 844 }]]) {
  const page = await side({ viewport: vp, hasTouch: true, isMobile: true });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await vent(page);
  await page.evaluate(() => atomlabTest.kosmos.vælg('bigbang'));
  tjek(`${navn}: ingen faner på kanten på højkant`, !(await synlig(page, '#kosmosVindue .panel-fane.venstre')));
  await page.click('#kosmos .knap-kungrafik');
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => document.getElementById('kosmosVindue').getBoundingClientRect().height);
  tjek(`${navn}: "Kun grafik" viser 3D-billedet på næsten hele skærmen`, h > vp.height * 0.8, `${h} af ${vp.height}`);
  tjek(`${navn}: bjælken ("▶ Start universet") og tidsknappen står i 3D-billedet med "Kun grafik"`, await synlig(page, '#kosmosBjælke button') && await synlig(page, '#kosmosTid'));
  await page.click('#kosmosBjælke button:has-text("Start universet")');
  await page.waitForTimeout(300);
  tjek(`${navn}: og knappen virker (nu står "Næste" i bjælken)`, (await page.textContent('#kosmosBjælke')).includes('Næste'));
  await page.screenshot({ path: `${UD}/${navn}-kosmos-kun-grafik.png` });
  await page.click('#kosmos .knap-kungrafik');
  await page.goto(`${ADRESSE}/?test#reaktor`);
  await vent(page);
  await page.click('#reaktor button.hvorfor[data-hvorfor="farligt"]');
  await page.waitForTimeout(200);
  const ark = await page.evaluate(() => document.getElementById('hvorforKort').classList.contains('ark'));
  tjek(`${navn}: kortet kommer op nedefra på telefon (ikke på tablet)`, navn === 'telefon' ? ark : !ark);
  await page.screenshot({ path: `${UD}/${navn}-hvorfor.png` });
  await page.context().close();
}

// ---------- telefon på højkant: panelerne kan swipes ned, og greb-stregen henter dem (jeres ønske 19. november 2026) ----------
{
  const page = await side({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const cdp = await page.context().newCDPSession(page);
  // Et rigtigt træk med fingeren (touchstart, flere touchmove og touchend), så browseren også selv ruller
  const swipe = async (x, y, dx, dy) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 8, y: y + dy * i / 8 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(500);
  };
  const midt = (sel) => page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 60), bund: r.bottom }; }, sel);
  const nede = () => page.evaluate(() => atomlabTest.paneler.valg('solsystem').kunGrafik);
  await page.goto(`${ADRESSE}/?test#solsystem`);
  await vent(page, 800);
  tjek('telefon: greb-stregen står mellem scenen og panelerne', await synlig(page, '#solsystem .panel-greb') && await page.evaluate(() => atomlabTest.paneler.telefon()));
  let m = await midt('#solsystem .venstre-panel');
  await swipe(m.x, m.y, 0, 160);
  tjek('telefon: swipe ned på panelet skjuler panelerne', await nede() && !(await synlig(page, '#solsystem .venstre-panel')));
  const h = await page.evaluate(() => document.getElementById('solsystemVindue').getBoundingClientRect().height);
  tjek('telefon: og scenen fylder skærmen', h > 844 * 0.8, `${h}`);
  m = await midt('#solsystem .panel-greb');
  tjek('telefon: stregen står nederst på skærmen', m.bund > 844 - 20, `${m.bund}`);
  await swipe(m.x, m.y, 0, -150);
  tjek('telefon: swipe op på stregen henter panelerne', !(await nede()) && await synlig(page, '#solsystem .venstre-panel'));
  await page.tap('#solsystem .panel-greb');
  await page.waitForTimeout(500);
  tjek('telefon: et tryk på stregen skjuler dem', await nede());
  await page.tap('#solsystem .panel-greb');
  await page.waitForTimeout(500);
  tjek('telefon: og et tryk mere henter dem', !(await nede()));
  m = await midt('#solsystemVindue');
  await swipe(m.x, m.y + 40, 0, 160);
  tjek('telefon: et træk ned i scenen (drej) skjuler ikke panelerne', !(await nede()));
  m = await midt('#solsystem .venstre-panel');
  await swipe(m.x - 120, m.y, 260, 70);
  tjek('telefon: et vandret træk på panelet skjuler dem ikke', !(await nede()));
  await page.evaluate(() => { document.getElementById('solsystem').scrollTop = 300; });
  m = await midt('#solsystem .højre-panel');
  await swipe(m.x, Math.max(m.y, 200), 0, 160);
  const top = await page.evaluate(() => document.getElementById('solsystem').scrollTop);
  tjek('telefon: rullet ned ruller et swipe ned bare op (panelerne bliver)', !(await nede()) && top < 300, `scrollTop ${top}`);
  await page.screenshot({ path: `${UD}/telefon-greb.png` });
  await page.context().close();
}
{
  const page = await side({ viewport: { width: 800, height: 1280 }, hasTouch: true, isMobile: true });
  await page.goto(`${ADRESSE}/?test#solsystem`);
  await vent(page);
  tjek('tablet: ingen greb-streg (kun på telefonen)', !(await synlig(page, '#solsystem .panel-greb')));
  await page.context().close();
}

await b.close();
console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
