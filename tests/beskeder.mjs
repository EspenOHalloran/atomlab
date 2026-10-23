// Det nye beskedsystem: undertekster, piller, log og advarsler på pc og telefon
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('beskeder');
const kun = process.argv[2]; // fx "pc" eller "tlf" for kun at køre én størrelse
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const enheder = { pc: [1280, 800, false], tlf: [390, 844, true], tlfL: [844, 390, true] };
for (const [navn, [w, h, mobil]] of Object.entries(enheder)) {
  if (kun && kun !== navn) continue;
  const fejl = [];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobil, isMobile: mobil, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#vaerksted`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#vaerksted:not(.skjult)'), null, { timeout: 20000 });
  await page.waitForTimeout(700);
  const dækning = () => page.evaluate(() => {
    // Hvor stor en del af 3D-billedet dækkes af beskeder?
    const v = document.querySelector('.skærm:not(.skjult) > .vindue').getBoundingClientRect();
    let areal = 0;
    for (const el of document.querySelectorAll('.undertekst, .pille, .logknap:not([hidden])')) {
      const r = el.getBoundingClientRect();
      const bx = Math.max(0, Math.min(r.right, v.right) - Math.max(r.left, v.left));
      const by = Math.max(0, Math.min(r.bottom, v.bottom) - Math.max(r.top, v.top));
      areal += bx * by;
    }
    return Math.round((100 * areal) / (v.width * v.height));
  });
  // Byg carbon-12: nyt grundstof og to opgaver på én gang
  await page.click('#vaerkstedVindue', { position: { x: 5, y: 5 }, force: true }).catch(() => {});
  for (const t of ['p', 'p', 'p', 'p', 'p', 'p', 'n', 'n', 'n', 'n', 'n', 'n', 'e', 'e', 'e', 'e', 'e', 'e']) { await page.keyboard.press(t); await page.waitForTimeout(60); }
  await page.waitForTimeout(1500);
  const antal = await page.evaluate(() => ({ p: document.getElementById('antalP').textContent, n: document.getElementById('antalN').textContent, e: document.getElementById('antalE').textContent }));
  console.log(navn, 'atom', JSON.stringify(antal));
  const piller = await page.$$eval('.pille', (l) => l.map((p) => p.textContent.trim()));
  console.log(navn, 'piller', JSON.stringify(piller));
  tjek(`${navn}: højst 2 piller ad gangen`, piller.length > 0 && piller.length <= 2, piller.length);
  tjek(`${navn}: pillerne er i 3D-billedet`, await page.evaluate(() => Boolean(document.querySelector('#vaerkstedVindue .pille'))));
  const d1 = await dækning();
  console.log(navn, 'dækning med piller', d1, '%');
  tjek(`${navn}: pillerne dækker under 15 %`, d1 < 15, d1);
  await page.screenshot({ path: `${UD}/${navn}-1-carbon.png` });
  tjek(`${navn}: klokken vises med tal`, await page.evaluate(() => { const k = document.querySelector('#vaerkstedVindue .logknap'); return k && !k.hidden && Number(k.querySelector('b').textContent) >= 2; }));
  // Tryk på en pille for at læse mere. En pille forsvinder efter 4,5 sekunder, og på en travl maskine kan den nå at
  // forsvinde, før testen trykker. Så prøves der igen på den næste pille (op til tre gange).
  let åbnet = false;
  for (let forsøg = 0; forsøg < 3 && !åbnet; forsøg++) {
    const knap = await page.$('#vaerkstedVindue .pille.vist:not(.åben) .pille-knap');
    if (!knap) { await page.waitForTimeout(500); continue; }
    await knap.click().catch(() => {});
    // Hold øje med pillen i stedet for at vente en fast tid (på en travl maskine tager det længere)
    åbnet = await page.waitForFunction(() => Boolean(document.querySelector('.pille.åben .pille-mere')?.offsetHeight), null, { timeout: 4000 }).then(() => true, () => false);
  }
  tjek(`${navn}: pillen kan åbnes`, åbnet);
  await page.screenshot({ path: `${UD}/${navn}-2-pille-aaben.png` });
  // Efter lidt tid er de andre piller væk, og den i køen er kommet
  await page.waitForTimeout(5500);
  // Loggen
  await page.click('#vaerkstedVindue .logknap');
  await page.waitForTimeout(400);
  const log = await page.$$eval('#logListe li', (l) => l.map((li) => li.querySelector('strong')?.textContent));
  console.log(navn, 'log', JSON.stringify(log));
  tjek(`${navn}: loggen viser beskederne`, log.length >= 3 && log.some((t) => t.includes('Carbon')));
  await page.screenshot({ path: `${UD}/${navn}-3-log.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  tjek(`${navn}: klokken nulstillet`, await page.evaluate(() => document.querySelector('#vaerkstedVindue .logknap b').textContent === ''));
  // En advarsel som undertekst
  await page.evaluate(() => document.getElementById('knapRyd').click());
  await page.waitForTimeout(600);
  await page.keyboard.press('e');
  await page.waitForTimeout(500);
  tjek(`${navn}: advarsel som undertekst`, await page.evaluate(() => document.querySelector('#vaerkstedVindue .undertekst.advarsel')?.textContent.includes('intet at kredse om')));
  await page.screenshot({ path: `${UD}/${navn}-4-advarsel.png` });
  // Skift skærm: beskederne ryddes
  await page.evaluate(() => { location.hash = '#kosmos'; });
  await page.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 10000 });
  await page.waitForTimeout(500);
  tjek(`${navn}: beskeder ryddet ved skærmskift`, await page.evaluate(() => !document.querySelector('#vaerkstedVindue .undertekst, #vaerkstedVindue .pille')));
  // Kosmos: supernova
  await page.evaluate(() => atomlabTest.kosmos.vælg('supernova'));
  await page.waitForTimeout(500);
  await page.evaluate(() => atomlabTest.kosmos.tryk(0));
  await page.waitForTimeout(500);
  await page.evaluate(() => atomlabTest.kosmos.spol(2));
  await page.waitForTimeout(500);
  const fase = await page.evaluate(() => { const u = document.querySelector('#kosmosVindue .undertekst.fase'); return u && { tekst: u.textContent, prikker: u.querySelectorAll('.ut-trin i').length, h: Math.round(u.getBoundingClientRect().height) }; });
  console.log(navn, 'fase', JSON.stringify(fase));
  tjek(`${navn}: kosmos-fase som undertekst med prikker`, fase && fase.prikker === 4);
  const d2 = await dækning();
  console.log(navn, 'dækning supernova', d2, '%');
  tjek(`${navn}: underteksten dækker under 22 %`, d2 < 22, d2);
  await page.screenshot({ path: `${UD}/${navn}-5-supernova.png` });
  await page.evaluate(() => atomlabTest.kosmos.spol(5));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${UD}/${navn}-6-supernova-senere.png` });
  // Mere-knappen (kun hvis teksten er skåret af)
  const mere = await page.evaluate(() => { const m = document.querySelector('#kosmosVindue .ut-mere'); return m && !m.hidden; });
  if (mere) {
    await page.click('#kosmosVindue .ut-mere');
    await page.waitForTimeout(400);
    tjek(`${navn}: Mere viser hele teksten`, await page.evaluate(() => { const t = document.querySelector('#kosmosVindue .ut-tekst'); return t.scrollHeight <= t.clientHeight + 2; }));
    await page.screenshot({ path: `${UD}/${navn}-7-mere.png` });
  }
  // Tyngdebølger: graf og undertekst sammen
  await page.evaluate(() => atomlabTest.kosmos.vælg('tyngdebolger'));
  await page.waitForTimeout(500);
  await page.evaluate(() => atomlabTest.kosmos.tryk(0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${UD}/${navn}-8-tyngdebolger.png` });
  console.log(navn, 'dækning tyngdebølger', await dækning(), '%');
  // Batteriet: kortslutning er en fast advarsel, der kommer lidt efter
  await page.evaluate(() => { location.hash = '#batteri'; });
  await page.waitForFunction(() => document.querySelector('#batteri:not(.skjult)'), null, { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => { const t = atomlabTest.batteri; t.tilstand('oplad'); t.hastighed(2); t.snyd(true); for (let i = 0; i < 20 && !t.kør(5).død; i++); });
  await page.waitForTimeout(400);
  const førAdvarsel = await page.evaluate(() => Boolean(document.querySelector('.undertekst.advarsel.fast')));
  await page.waitForTimeout(1500);
  const efterAdvarsel = await page.evaluate(() => Boolean(document.querySelector('.undertekst.advarsel.fast')));
  console.log(navn, 'kortslutning før/efter', førAdvarsel, efterAdvarsel);
  await page.screenshot({ path: `${UD}/${navn}-9-kortslutning.png` });
  await ctx.close();
  console.log(navn, 'konsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
  if (fejl.length) dårlig++;
}
await b.close();
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
