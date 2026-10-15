// Stjerneovnen: etiket ved den valgte kerne. Reaktoren: nødstop som fast advarsel.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('beskeder-2');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, [w, h, mobil]] of Object.entries({ pc: [1280, 800, false], tlf: [390, 844, true] })) {
  const fejl = [];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobil, isMobile: mobil, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#fusion`);
  // Guiderne er set, så de ikke står i vejen
  await page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1 })));
  await page.reload();
  await page.waitForTimeout(6000);
  await page.evaluate(() => atomlabTest.fusion.temperatur(1));
  await page.waitForTimeout(1500);
  // Klik på en proton nær midten
  let valgt = null;
  for (let forsøg = 0; forsøg < 6 && !valgt; forsøg++) {
    const pos = await page.evaluate(() => {
      const ps = atomlabTest.fusion.partikler().filter((p) => p.type === 'p');
      let bedst = null, bedstD = Infinity;
      for (const p of ps) {
        const s = atomlabTest.fusion.skærmPos(p.id);
        const d = Math.hypot(s.x - innerWidth / 2, s.y - innerHeight * 0.35);
        if (d < bedstD) { bedstD = d; bedst = { id: p.id, ...s }; }
      }
      return bedst;
    });
    if (mobil) await page.touchscreen.tap(pos.x, pos.y); else await page.mouse.click(pos.x, pos.y);
    await page.waitForTimeout(700);
    valgt = await page.evaluate(() => atomlabTest.fusion.valgt());
  }
  tjek(`${navn}: en kerne er valgt`, valgt);
  await page.waitForTimeout(800);
  const etiket = await page.evaluate(() => { const e = document.getElementById('fusEtiket'); const r = e.getBoundingClientRect(); return { synlig: !e.classList.contains('skjult'), tekst: e.textContent, x: Math.round(r.left), y: Math.round(r.top), b: Math.round(r.width) }; });
  console.log(navn, 'etiket', JSON.stringify(etiket));
  tjek(`${navn}: etiketten vises ved kernen`, etiket.synlig && etiket.tekst.includes('Proton'));
  tjek(`${navn}: ingen "Valgt"-besked`, await page.evaluate(() => !document.querySelector('.undertekst')?.textContent.includes('Valgt')));
  await page.screenshot({ path: `${UD}/${navn}-10-fusion-valgt.png` });
  // Skyd den mod en anden proton
  const mål = await page.evaluate((id) => {
    const ps = atomlabTest.fusion.partikler().filter((p) => p.type === 'p' && p.id !== id);
    return atomlabTest.fusion.skærmPos(ps[0].id);
  }, valgt);
  if (mobil) await page.touchscreen.tap(mål.x, mål.y); else await page.mouse.click(mål.x, mål.y);
  await page.waitForTimeout(800);
  // Reaktoren: nødstop
  await page.evaluate(() => { location.hash = '#reaktor'; });
  await page.waitForTimeout(2500);
  await page.click('.del-knap[data-del="kæde"]');
  await page.waitForTimeout(800);
  await page.evaluate(() => { atomlabTest.reaktor.start(); for (let i = 0; i < 30 && !atomlabTest.reaktor.kør(1, 0).nødstop; i++); });
  await page.waitForTimeout(300);
  const straks = await page.evaluate(() => Boolean(document.querySelector('.undertekst.advarsel.fast')));
  await page.waitForTimeout(1500);
  const senere = await page.evaluate(() => { const u = document.querySelector('.undertekst.advarsel.fast'); return u && u.textContent; });
  tjek(`${navn}: nødstop kommer lidt efter`, !straks && senere?.includes('NØDSTOP'), `${straks} ${senere}`);
  // En almindelig besked venter, mens nødstoppet står
  await page.evaluate(() => { location.hash = '#reaktor'; document.getElementById('reaktorVand').click(); });
  await page.waitForTimeout(500);
  tjek(`${navn}: nødstop bliver stående`, await page.evaluate(() => document.querySelector('.undertekst')?.textContent.includes('NØDSTOP')));
  await page.screenshot({ path: `${UD}/${navn}-11-noedstop.png` });
  await page.click('.undertekst .ut-luk');
  await page.waitForTimeout(900);
  const efter = await page.evaluate(() => document.querySelector('.undertekst')?.textContent ?? '');
  console.log(navn, 'efter luk:', efter.slice(0, 60));
  tjek(`${navn}: ventende besked kommer bagefter`, efter.includes('vand'), efter);
  await ctx.close();
  console.log(navn, 'konsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
  if (fejl.length) dårlig++;
}
await b.close();
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
