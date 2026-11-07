// Menuen som en karrusel (prototype med ?karrusel, js/karrusel.js og docs/plan-menu.md):
// rækkefølgen efter størrelse, kortet i midten (pile, ikoner, rul, tryk på et kort ved siden af, tastatur og musehjul),
// start på den del, man sidst var i, ✓ på en klaret del, "Din fremgang", og at den almindelige menu er uændret.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('karrusel');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const RÆKKEFØLGE = ['fusion', 'reaktor', 'vaerksted', 'system', 'batteri', 'solsystem', 'kosmos', 'ordbog'];
const størrelser = [
  ['pc', { viewport: { width: 1280, height: 800 } }],
  ['tablet', { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true }],
  ['tlf', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }],
];
for (const [navn, opts] of størrelser) {
  const fejl = [];
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  const midt = () => p.evaluate(() => document.getElementById('menu').dataset.midt);
  const venMidt = async (id) => {
    try { await p.waitForFunction((i) => document.getElementById('menu').dataset.midt === i, id, { timeout: 6000 }); } catch { /* tjekket nedenfor */ }
    return midt();
  };

  // Ny bruger
  await p.goto(`${ADRESSE}/?test&karrusel#`);
  await p.waitForFunction(() => document.getElementById('menu').dataset.midt);
  const start = await p.evaluate(() => {
    const menu = document.getElementById('menu');
    const vist = (el) => el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
    return {
      tilstand: menu.classList.contains('karrusel-tilstand'),
      orden: [...menu.querySelectorAll('.menukort a.kort')].map((k) => k.getAttribute('href').slice(1)),
      startHer: menu.querySelector('a[href="#vaerksted"]').classList.contains('start-her'),
      piller: [...menu.querySelectorAll('.kort-fremgang')].filter(vist).length,
      status: vist(document.getElementById('menuStatus')),
      ikoner: menu.querySelectorAll('.menu-ikon').length,
      sideBredde: document.documentElement.scrollWidth - innerWidth,
      rul: menu.scrollHeight - menu.clientHeight,
    };
  });
  tjek(`${navn}: karrusellen er slået til`, start.tilstand);
  tjek(`${navn}: kortene står efter størrelse`, start.orden.join() === RÆKKEFØLGE.join(), start.orden.join());
  tjek(`${navn}: en ny bruger starter på Atomværkstedet med "Start her"`, (await midt()) === 'vaerksted' && start.startHer);
  tjek(`${navn}: ingen gule piller og ingen linje med tal`, start.piller === 0 && !start.status, JSON.stringify(start));
  tjek(`${navn}: ikonrækken har 8 ikoner`, start.ikoner === 8, start.ikoner);
  tjek(`${navn}: siden er ikke bredere end skærmen`, start.sideBredde <= 0, start.sideBredde);
  tjek(`${navn}: menuen skal ikke rulles`, start.rul <= 1, start.rul);
  await p.screenshot({ path: `${UD}/${navn}-start.png` });

  await p.click('.karrusel-pil.højre');
  tjek(`${navn}: pilen › flytter til Det periodiske system`, (await venMidt('system')) === 'system', await midt());
  await p.click('.menu-ikon[data-del="kosmos"]');
  tjek(`${navn}: ikonet for Kosmos flytter Kosmos ind i midten`, (await venMidt('kosmos')) === 'kosmos', await midt());
  // Rul (som et stryg) hen til det første kort
  await p.evaluate(() => {
    const bane = document.querySelector('#menu .menukort');
    const k = bane.querySelector('a[href="#fusion"]');
    bane.scrollTo({ left: k.offsetLeft + k.offsetWidth / 2 - bane.clientWidth / 2 });
  });
  tjek(`${navn}: rul hen til Stjerneovnen gør den til kortet i midten`, (await venMidt('fusion')) === 'fusion', await midt());
  tjek(`${navn}: pilen ‹ er slået fra ved det første kort`, await p.isDisabled('.karrusel-pil.venstre'));
  // Et kort ved siden af åbner ikke delen, men kommer ind i midten
  await p.click('#menu a[href="#reaktor"]');
  tjek(`${navn}: tryk på Reaktoren ved siden af flytter den ind i midten`, (await venMidt('reaktor')) === 'reaktor', await midt());
  tjek(`${navn}: … og åbner den ikke`, (await p.evaluate(() => location.hash)) === '');
  await p.click('#menu a[href="#reaktor"]');
  let åbnet = true;
  try { await p.waitForFunction(() => location.hash === '#reaktor' && !document.getElementById('reaktor').classList.contains('skjult'), null, { timeout: 8000 }); } catch { åbnet = false; }
  tjek(`${navn}: tryk på kortet i midten åbner Reaktoren`, åbnet);
  await p.evaluate(() => { location.hash = ''; });
  await p.waitForFunction(() => !document.getElementById('menu').classList.contains('skjult'));
  tjek(`${navn}: tilbage i menuen står Reaktoren i midten`, (await venMidt('reaktor')) === 'reaktor', await midt());
  tjek(`${navn}: den sidste del er gemt`, (await p.evaluate(() => localStorage.getItem('atomlabSidsteDel'))) === 'reaktor');

  if (navn === 'pc') {
    await p.keyboard.press('ArrowRight');
    tjek('pc: piletasten → flytter til Atomværkstedet', (await venMidt('vaerksted')) === 'vaerksted', await midt());
    const boks = await p.locator('#menu .menukort').boundingBox();
    await p.mouse.move(boks.x + boks.width / 2, boks.y + boks.height / 2);
    await p.mouse.wheel(0, 120);
    tjek('pc: musehjulet flytter ét kort (Det periodiske system)', (await venMidt('system')) === 'system', await midt());
  }

  // En klaret del får ✓, og "Din fremgang" viser tallene
  await p.evaluate(async () => {
    const { OPGAVER_BATTERI } = await import('./js/batteri.js');
    const opgaver = Object.fromEntries(OPGAVER_BATTERI.map((o) => [o.id, 1]));
    localStorage.setItem('atomlabFremgang', JSON.stringify({ opgaver, opdaget: [1, 2] }));
  });
  await p.reload();
  await p.waitForFunction(() => document.getElementById('menu').dataset.midt && !document.getElementById('henter'));
  const klaret = await p.evaluate(() => {
    const kort = (id) => document.querySelector(`#menu a[href="#${id}"]`);
    const flueben = (id) => getComputedStyle(kort(id).querySelector('.kort-tekst strong'), '::after').content;
    return { batteri: kort('batteri').classList.contains('klaret'), fusion: kort('fusion').classList.contains('klaret'), tegn: flueben('batteri'), fusionTegn: flueben('fusion') };
  });
  tjek(`${navn}: Batteriet er klaret og har ✓`, klaret.batteri && klaret.tegn.includes('✓'), JSON.stringify(klaret));
  tjek(`${navn}: Stjerneovnen er ikke klaret og har intet ✓`, !klaret.fusion && !klaret.fusionTegn.includes('✓'), JSON.stringify(klaret));
  await p.click('.menu-fremgang-knap');
  const dialog = await p.evaluate(() => {
    const linje = (id) => document.querySelector(`#fremgangListe [data-del="${id}"]`);
    return {
      vist: !document.getElementById('dinFremgang').classList.contains('skjult'),
      linjer: [...document.querySelectorAll('#fremgangListe li')].map((l) => l.dataset.del),
      batteri: linje('batteri').textContent,
      batteriFærdig: linje('batteri').classList.contains('færdig'),
      system: linje('system').textContent,
      kosmos: linje('kosmos').textContent,
      ialt: document.getElementById('fremgangIalt').textContent,
    };
  });
  tjek(`${navn}: "Din fremgang" åbner`, dialog.vist);
  tjek(`${navn}: … med alle dele undtagen Ordbogen, efter størrelse`, dialog.linjer.join() === RÆKKEFØLGE.slice(0, 7).join(), dialog.linjer.join());
  tjek(`${navn}: … Batteriet er færdigt`, dialog.batteriFærdig && /✓ (\d+) af \1 opgaver/.test(dialog.batteri), dialog.batteri);
  tjek(`${navn}: … grundstofferne og Kosmos`, dialog.system.includes('2 af 118 opdaget') && /0 af \d+ besøgt/.test(dialog.kosmos), `${dialog.system} | ${dialog.kosmos}`);
  tjek(`${navn}: … og opgaverne i alt`, /^I alt \d+ af \d+ opgaver klaret/.test(dialog.ialt), dialog.ialt);
  await p.screenshot({ path: `${UD}/${navn}-fremgang.png` });
  await p.keyboard.press('Escape');
  tjek(`${navn}: Esc lukker "Din fremgang"`, await p.evaluate(() => document.getElementById('dinFremgang').classList.contains('skjult')));

  // Uden ?karrusel er menuen den samme som før
  await p.goto(`${ADRESSE}/?test#`);
  await p.waitForFunction(() => document.querySelector('#menu .kort-fremgang'));
  const gammel = await p.evaluate(() => ({
    tilstand: document.getElementById('menu').classList.contains('karrusel-tilstand'),
    første: document.querySelector('#menu .menukort a.kort').getAttribute('href'),
    under: Boolean(document.querySelector('.menu-under')),
  }));
  tjek(`${navn}: uden ?karrusel er menuen uændret`, !gammel.tilstand && gammel.første === '#vaerksted' && !gammel.under, JSON.stringify(gammel));
  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
