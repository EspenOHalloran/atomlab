// Det periodiske system på telefon og tablet: forhåndsvisning ved tryk, træk og knib, søgning og filtre
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('system-mobil');
const kun = process.argv[2]; // fx "pc" eller "tlf" for kun at køre én størrelse
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const enheder = { tlf: [390, 844, true], tlfL: [844, 390, true], tab: [768, 1024, true], pc: [1280, 800, false] };
for (const [navn, [w, h, mobil]] of Object.entries(enheder)) {
  if (kun && kun !== navn) continue;
  const fejl = [];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobil, isMobile: mobil, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#system`);
  await page.waitForTimeout(3500);
  const T = (f, a) => page.evaluate(f, a);
  // Kameraet springer straks derhen, hvor det er på vej hen
  const snap = () => T(async () => {
    const { verden } = await import('./js/scene3d.js');
    if (verden.målAfstand != null) {
      const retning = verden.kamera.position.clone().sub(verden.styring.target);
      verden.kamera.position.copy(verden.styring.target).add(retning.setLength(verden.målAfstand));
      verden.målAfstand = null;
    }
    verden.styring.update();
  });
  await snap();
  await page.waitForTimeout(800);
  const tip = await T(() => document.querySelector('#systemVindue .undertekst')?.textContent ?? '');
  tjek(`${navn}: tip om knib og tryk ${mobil ? 'vises' : 'vises ikke'}`, mobil ? tip.includes('Knib') : !tip, tip.slice(0, 40));
  await page.screenshot({ path: `${UD}/${navn}-1-vaeg.png` });
  const fe = await T(() => atomlabTest.system.felt(26));
  console.log(navn, `felt ${Math.round(fe.str)} px`);
  if (mobil) {
    tjek(`${navn}: én finger flytter væggen`, (await T(() => atomlabTest.system.styring())).én === 1);
    // 20 tryk omkring jern med en fingers spredning (ca. 16 punkter): hvor ofte bliver jern vist?
    let ramt = 0;
    const andre = {};
    for (let i = 0; i < 20; i++) {
      const v = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 16;
      await T(() => atomlabTest.system.glemForhånd());
      await page.touchscreen.tap(fe.x + Math.cos(v) * r, fe.y + Math.sin(v) * r);
      await page.waitForTimeout(200);
      const f = await T(() => atomlabTest.system.forhånd());
      if (f === 26) ramt++; else andre[f] = (andre[f] || 0) + 1;
      tjek(`${navn}: første tryk åbner ikke`, !(await T(() => atomlabTest.system.valgt())));
    }
    console.log(navn, `jern vist ${ramt}/20`, JSON.stringify(andre));
    // Tryk på jern, så etiketten vises
    await T(() => atomlabTest.system.glemForhånd());
    await page.touchscreen.tap(fe.x, fe.y);
    await page.waitForTimeout(150);
    if ((await T(() => atomlabTest.system.forhånd())) !== 26) await page.touchscreen.tap(fe.x, fe.y);
    await page.waitForTimeout(900);
    const etiket = await T(() => { const e = document.getElementById('systemForhånd'); const r = e.getBoundingClientRect(); return { synlig: !e.classList.contains('skjult'), tekst: e.textContent, top: Math.round(r.top), bund: Math.round(r.bottom) }; });
    console.log(navn, 'etiket', JSON.stringify(etiket), 'felt y', Math.round(fe.y));
    tjek(`${navn}: etiket med navn over feltet`, etiket.synlig && etiket.tekst.includes('Jern') && (etiket.bund <= fe.y || etiket.top >= fe.y));
    await page.screenshot({ path: `${UD}/${navn}-2-forhaand.png` });
    // Andet tryk åbner
    await page.touchscreen.tap(fe.x, fe.y);
    await page.waitForTimeout(1200);
    tjek(`${navn}: andet tryk åbner jern`, (await T(() => atomlabTest.system.valgt())) === 26);
    tjek(`${navn}: ved atomet drejer én finger`, (await T(() => atomlabTest.system.styring())).én === 0);
    await page.evaluate(() => document.getElementById('systemLuk').click());
    await page.waitForTimeout(1200);
    await snap();
    tjek(`${navn}: tilbage på væggen kan man flytte igen`, (await T(() => atomlabTest.system.styring())).pan);
    // Træk med én finger (rigtige berøringer)
    const cdp = await ctx.newCDPSession(page);
    const midt = await T(() => { const r = document.getElementById('systemVindue').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const før = (await T(() => atomlabTest.system.styring())).mål;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: midt.x, y: midt.y, id: 1 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: midt.x - i * 12, y: midt.y, id: 1 }] }); await page.waitForTimeout(40); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(1500);
    const efter = (await T(() => atomlabTest.system.styring())).mål;
    console.log(navn, 'træk', JSON.stringify(før), '→', JSON.stringify(efter));
    tjek(`${navn}: væggen flytter sig ved træk`, efter[0] > før[0] + 0.3, `${før[0]} → ${efter[0]}`);
    tjek(`${navn}: et træk viser ikke et felt`, !(await T(() => atomlabTest.system.forhånd())));
    // Knib for at zoome ind
    const afstand = () => T(async () => { const { verden } = await import('./js/scene3d.js'); return verden.kamera.position.distanceTo(verden.styring.target); });
    const a1 = await afstand();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: midt.x - 20, y: midt.y, id: 1 }, { x: midt.x + 20, y: midt.y, id: 2 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: midt.x - 20 - i * 10, y: midt.y, id: 1 }, { x: midt.x + 20 + i * 10, y: midt.y, id: 2 }] }); await page.waitForTimeout(40); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(1500);
    const a2 = await afstand();
    console.log(navn, 'knib', a1.toFixed(1), '→', a2.toFixed(1));
    tjek(`${navn}: knib zoomer ind`, a2 < a1 - 1);
    tjek(`${navn}: et knib viser ikke et felt`, !(await T(() => atomlabTest.system.forhånd())));
    await page.screenshot({ path: `${UD}/${navn}-3-zoom.png` });
    // Væggen kan ikke trækkes ud af billedet
    await T(() => atomlabTest.system.flyt(80, 40));
    await page.waitForTimeout(800);
    const mål = (await T(() => atomlabTest.system.styring())).mål;
    tjek(`${navn}: væggen bliver i billedet`, mål[0] <= 9.61 && mål[1] <= 5.91, JSON.stringify(mål));
  }
  // Søgning
  await page.evaluate(() => { document.getElementById('systemLuk').click(); });
  const forslag = await T(() => ({
    jern: atomlabTest.system.søg('jern'), fe: atomlabTest.system.søg('fe'), tal: atomlabTest.system.søg('26'), kul: atomlabTest.system.søg('kul'), ingen: atomlabTest.system.søg('xyz'),
  }));
  console.log(navn, 'søg', JSON.stringify(forslag));
  tjek(`${navn}: søg på navn`, forslag.jern[0]?.includes('Jern'));
  tjek(`${navn}: søg på symbol`, forslag.fe[0]?.includes('Jern'));
  tjek(`${navn}: søg på nummer`, forslag.tal[0]?.includes('Jern'));
  tjek(`${navn}: søg på kaldenavn`, forslag.kul.some((t) => t.includes('Carbon')));
  tjek(`${navn}: ingen forslag`, forslag.ingen.length === 0);
  await T(() => atomlabTest.system.søg(''));
  await page.click('#systemSøg');
  await page.keyboard.type('gu');
  await page.waitForTimeout(700);
  tjek(`${navn}: listen vises under feltet`, await page.isVisible('#systemResultater .søg-valg'));
  tjek(`${navn}: antal passer`, (await page.textContent('#systemAntal')).includes('passer'), await page.textContent('#systemAntal'));
  await page.screenshot({ path: `${UD}/${navn}-4-soeg.png` });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  const åbnet = await T(() => document.getElementById('sysNavn').textContent);
  tjek(`${navn}: Enter åbner det første forslag`, (await T(() => atomlabTest.system.valgt())) && åbnet.includes('Guld'), åbnet);
  tjek(`${navn}: søgningen er ryddet`, (await page.inputValue('#systemSøg')) === '');
  await page.evaluate(() => document.getElementById('systemLuk').click());
  await page.waitForTimeout(1200);
  // Filtre
  const chipsSynlige = await page.isVisible('#systemChips .filter');
  if (navn === 'tlf' || navn === 'tlfL') {
    tjek(`${navn}: filtrene er foldet sammen`, !chipsSynlige);
    await page.click('#systemFilterKnap');
    await page.waitForTimeout(400);
    tjek(`${navn}: knappen viser filtrene`, await page.isVisible('#systemChips .filter'));
    await page.click('#systemChips .filter[data-værdi="aedelgas"]');
    await page.waitForTimeout(600);
    tjek(`${navn}: knappen viser antal filtre`, (await page.textContent('#systemFilterKnap')).includes('(1)'));
    await page.screenshot({ path: `${UD}/${navn}-5-filtre.png` });
    await page.click('#systemChips .filter[data-værdi="aedelgas"]');
  } else {
    tjek(`${navn}: filtrene står frit`, chipsSynlige);
  }
  await ctx.close();
  console.log(navn, 'konsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
  if (fejl.length) dårlig++;
}
await b.close();
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
