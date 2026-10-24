// Det periodiske system på pc: væggen, etiketter, grundstofkort, filtre og opgaven "byg jern"
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('system');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/`);
await page.waitForTimeout(800);
await page.click('a.kort[href="#system"]');
await page.waitForTimeout(9000);
await page.screenshot({ path: UD + '/s1-væg.png' });
tjek('væggen vises', await page.isVisible('#system'));
// Find jern ved at føre musen hen over væggen
const hul = await page.evaluate(() => { const r = document.getElementById('systemVindue').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; });
let fundet = null;
for (const dx of [-81, -70, -90, -100, -60]) {
  await page.mouse.move(hul.x + dx, hul.y - 81 * hul.h / 630);
  await page.waitForTimeout(400);
  const t = await page.textContent('#systemEtiket');
  if (t.includes('Jern')) { fundet = dx; break; }
  console.log('     under musen:', t);
}
tjek('etiket ved jern', fundet !== null);
await page.waitForTimeout(1500);
await page.screenshot({ path: UD + '/s2-svæv.png' });
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(6000);
tjek('detaljevisning', await page.evaluate(() => document.getElementById('system').classList.contains('detalje')));
tjek('jern-kort', (await page.textContent('#sysNavn')).includes('Jern') && (await page.textContent('#sysTal')).includes('Findes'), await page.textContent('#systemKort'));
await page.screenshot({ path: UD + '/s3-jern.png' });
// Ringe eller elektronsky: samme knap som i værkstedet, og valget huskes
tjek('kortet: knappen "Elektronsky" (atomet har ringe)', (await page.textContent('#systemVisning')) === 'Elektronsky');
await page.click('#systemVisning');
tjek('kortet: "Elektronsky" skifter og huskes', (await page.evaluate(() => localStorage.getItem('atomlabVisning'))) === 'sky' && (await page.textContent('#systemVisning')) === 'Ringe');
await page.click('#systemNæste');
await page.waitForTimeout(3000);
tjek('næste er cobalt', (await page.textContent('#sysNavn')).includes('Cobalt'));
tjek('cobalt: stadig elektronsky', (await page.textContent('#systemVisning')) === 'Ringe');
await page.click('#systemLuk');
await page.waitForTimeout(3000);
await page.click('#systemFiltre .filter[data-værdi="aedelgas"]');
await page.waitForTimeout(2500);
tjek('filter ædelgasser', (await page.textContent('#systemAntal')).includes('6 grundstoffer'), await page.textContent('#systemAntal'));
await page.screenshot({ path: UD + '/s4-filter.png' });
await page.click('#systemFiltre .filter[data-værdi="aedelgas"]');
// Åbn uran (ikke opdaget) og send til værkstedet
await page.keyboard.press('Escape');
await page.evaluate(() => {});
// Klik på jern igen og gå til værkstedet
await page.mouse.move(hul.x + fundet, hul.y - 81 * hul.h / 630);
await page.waitForTimeout(500);
await page.mouse.down(); await page.mouse.up();
await page.waitForTimeout(2500);
await page.click('#systemByg');
await page.waitForTimeout(2500);
tjek('værksted med opgave', location => true);
tjek('opgave: byg jern', (await page.textContent('#opgaveTekst')).includes('Byg Jern-56'), await page.textContent('#opgaveTekst'));
tjek('værkstedet: også elektronsky (knappen siger "Ringe")', (await page.textContent('#knapVisning')) === 'Ringe');
for (let i = 0; i < 26; i++) await page.keyboard.press('p');
await page.click('#knapStabil'); await page.click('#knapNeutral');
await page.waitForTimeout(1500);
const fr = await page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang')));
tjek('jern opdaget', fr.opdaget.includes(26));
await page.goto(`${ADRESSE}/#system`);
await page.waitForTimeout(6000);
tjek('stjerne-tæller', (await page.textContent('#systemOpdaget')).includes('1 af 118'), await page.textContent('#systemOpdaget'));

// Grundstofkortet i lag: tre linjer fremme, og "Mere" med eksempler, "Vidste du?", links og tallene
{
  const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error') fejl.push('error: ' + m.text()); });
  await s.goto(`${ADRESSE}/?test#system`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#system:not(.skjult)'));
  await s.evaluate(() => atomlabTest.system.åbn(3));
  await s.waitForTimeout(800);
  tjek('ny bruger: atomet på kortet har ringe', (await s.evaluate(() => atomlabTest.system.visning())) === 'ringe');
  const li = await s.evaluate(() => ({
    linjer: [...document.querySelectorAll('#sysLag li')].map((l) => l.textContent),
    lagVist: !document.getElementById('sysLag').hidden,
    mereÅben: document.getElementById('sysMere').open,
    talIMere: Boolean(document.querySelector('#sysMere #sysTal')),
    vidste: document.getElementById('sysVidste').textContent,
    links: [...document.querySelectorAll('#sysSe button')].map((k) => k.textContent),
  }));
  tjek('lithium: tre linjer fremme', li.lagVist && li.linjer.length === 3 && /I din hverdag/.test(li.linjer[0]) && /I din krop/.test(li.linjer[1]) && /I universet/.test(li.linjer[2]), JSON.stringify(li));
  tjek('lithium: "Mere" er foldet sammen, og tallene står i den', !li.mereÅben && li.talIMere);
  tjek('lithium: "Vidste du?" og link til Batteriet', /Vidste du\?/.test(li.vidste) && li.links.includes('Batteriet ›'), JSON.stringify(li.links));
  await s.evaluate(() => atomlabTest.system.åbn(4));
  await s.waitForTimeout(400);
  tjek('beryllium: "kosmisk stråling" er et fagord', await s.evaluate(() => Boolean(document.querySelector('#sysLag .fagord[data-ord="kosmiskstraaling"]'))));
  await s.evaluate(() => atomlabTest.system.åbn(60));
  await s.waitForTimeout(400);
  const nd = await s.evaluate(() => ({ lag: document.getElementById('sysLag').hidden, mere: document.getElementById('sysMere').hidden, talUde: !document.querySelector('#sysMere #sysTal') }));
  tjek('neodym (uden lag): tallene står fremme som før', nd.lag && nd.mere && nd.talUde, JSON.stringify(nd));
  await s.evaluate(() => atomlabTest.system.åbn(3));
  await s.waitForTimeout(400);
  await s.evaluate(() => { document.getElementById('sysMere').open = true; });
  await s.screenshot({ path: UD + '/s4-lag.png' });
  await s.click('#sysSe button:text("Batteriet ›")');
  await s.waitForTimeout(600);
  tjek('linket åbner Batteriet', await s.evaluate(() => location.hash === '#batteri'));
  await s.context().close();
}

// Menuen: fremgang på hvert kort og "Næste eventyr", når en del er klaret
{
  const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  await s.addInitScript(() => {
    const opgaver = {};
    for (const id of ['b-fuld', 'b-lampe', 'b-tom', 'b-hurtig', 'b-overlad']) opgaver[id] = 1;
    localStorage.setItem('atomlabFremgang', JSON.stringify({ opgaver, opdaget: [1, 26] }));
    localStorage.setItem('atomlabKosmosSet', JSON.stringify(['bigbang', 'sorthul']));
  });
  await s.goto(`${ADRESSE}/?test`);
  await s.waitForTimeout(1500);
  const m = await s.evaluate(() => Object.fromEntries([...document.querySelectorAll('.menukort .kort')].map((k) => [k.getAttribute('href'), { tal: k.querySelector('.kort-fremgang')?.textContent, færdig: k.querySelector('.kort-fremgang')?.classList.contains('færdig'), næste: k.classList.contains('næste-eventyr') }])));
  tjek('menuen: Batteriet er klaret', m['#batteri'].færdig && m['#batteri'].tal === '✓ 5/5 ★', JSON.stringify(m['#batteri']));
  tjek('menuen: opdagede grundstoffer og sete fænomener', m['#system'].tal === '2/118 opdaget' && /^2\/\d+ set$/.test(m['#kosmos'].tal), JSON.stringify(m));
  tjek('menuen: næste eventyr er Værkstedet', m['#vaerksted'].næste && !m['#batteri'].næste && m['#vaerksted'].tal.endsWith('★'), JSON.stringify(m));
  await s.screenshot({ path: UD + '/s5-menu.png' });
  await s.context().close();
}
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
