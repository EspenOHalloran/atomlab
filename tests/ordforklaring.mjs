// Ordforklaringer: Fagord bliver markeret én gang pr. tekst. Man kan trykke på dem (mus, tastatur og fingre), og forklaringen lukker igen.
import { readFileSync, readdirSync } from 'node:fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { ORDBOG } from '../js/data/ordbog.js';
const UD = billedmappe('ordforklaring');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: ordlisten ----------
const rod = new URL('..', import.meta.url).pathname;
const filer = ['index.html', ...readdirSync(rod + 'js').filter((f) => f.endsWith('.js')).map((f) => 'js/' + f),
  ...readdirSync(rod + 'js/kosmos').map((f) => 'js/kosmos/' + f), ...readdirSync(rod + 'js/data').filter((f) => f !== 'ordbog.js').map((f) => 'js/data/' + f)];
const tekst = filer.map((f) => readFileSync(rod + f, 'utf8')).join('\n').toLowerCase();
const former = new Set();
for (const o of ORDBOG) {
  tjek(`ordbog: "${o.id}" står et sted i teksterne`, o.former.some((f) => tekst.includes(f)), o.former.join(', '));
  tjek(`ordbog: "${o.id}" er kort (højst 260 tegn)`, o.tekst.length <= 260, o.tekst.length);
  for (const f of o.former) {
    tjek(`ordbog: formen "${f}" findes kun én gang`, !former.has(f));
    former.add(f);
  }
}

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const side = async (opsætning) => {
  const ctx = await b.newContext(opsætning);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  return { ctx, page };
};
const { ctx, page } = await side({ viewport: { width: 1280, height: 800 } });
const T = (f, a) => page.evaluate(f, a);
const vist = () => T(() => atomlabTest.ord.vist());

// Kosmos: neutrino i supernovaens nørd-tekst
await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForTimeout(1500);
await T(() => atomlabTest.kosmos.vælg('supernova'));
await page.click('[data-kosmos-fane="nørd"]');
// Hold øje med ordet i stedet for at vente en fast tid (testbrowseren tegner langsomt)
const markeret = await page.waitForSelector('#kosmosTekst .fagord[data-ord="neutrino"]', { timeout: 3000 }).then(() => true, () => false);
tjek('supernova: "neutrino" er markeret', markeret);
await page.click('#kosmosTekst .fagord[data-ord="neutrino"]');
await page.waitForTimeout(250);
tjek('klik viser forklaringen', (await vist()) === 'Neutrino', await vist());
const r = await T(() => { const e = document.getElementById('ordforklaring').getBoundingClientRect(); return [e.left, e.top, e.right, e.bottom]; });
tjek('forklaringen er inde på skærmen', r[0] >= 0 && r[1] >= 0 && r[2] <= 1280 && r[3] <= 800, JSON.stringify(r));
await page.screenshot({ path: `${UD}/1-neutrino.png` });
await page.click('#kosmosTekst .fagord[data-ord="neutrino"]');
await page.waitForTimeout(200);
tjek('klik igen lukker den', (await vist()) === null);
await page.click('#kosmosTekst .fagord[data-ord="neutrino"]');
await page.keyboard.press('Escape');
tjek('Esc lukker den', (await vist()) === null);
await page.click('#kosmosTekst .fagord[data-ord="neutrino"]');
await page.mouse.click(640, 400);
tjek('et klik et andet sted lukker den', (await vist()) === null);
// Med musen over ordet
await page.hover('#kosmosTekst .fagord[data-ord="bindingsenergi"]');
await page.waitForTimeout(600);
tjek('musen over ordet viser forklaringen', (await vist()) === 'Bindingsenergi', await vist());
await page.mouse.move(640, 400);
await page.waitForTimeout(300);
tjek('musen væk lukker den', (await vist()) === null);
// Med tastaturet
await page.focus('#kosmosTekst .fagord[data-ord="neutrino"]');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
tjek('Enter på ordet viser forklaringen', (await vist()) === 'Neutrino');
await page.keyboard.press('Escape');

// Ord bliver kun markeret én gang pr. tekst og aldrig i knapper, overskrifter og citater
const tjekMærker = async (sted) => {
  const res = await T(() => {
    const ZONER = '.hjælp-indhold, .forklaring-boks, .seneste-boks, .kosmos-tekst, .kosmos-forklaring, .fane, .system-kort, .ærligt, .ut-tekst, .pille-mere, #logListe li';
    let dobbelt = 0;
    for (const z of document.querySelectorAll(ZONER)) {
      const ord = [...z.querySelectorAll('.fagord')].filter((k) => k.parentElement.closest(ZONER) === z).map((k) => k.dataset.ord);
      dobbelt += ord.length - new Set(ord).size;
    }
    const forkert = [...document.querySelectorAll('.fagord')].filter((k) => k.parentElement.closest('button, a, h1, h2, h3, h4, strong, b, blockquote, summary')).length;
    return { dobbelt, forkert, antal: document.querySelectorAll('.fagord').length };
  });
  tjek(`${sted}: hvert ord højst én gang pr. tekst`, res.dobbelt === 0, JSON.stringify(res));
  tjek(`${sted}: ingen ord i knapper, overskrifter eller citater`, res.forkert === 0, JSON.stringify(res));
  return res.antal;
};
const antal = await tjekMærker('Kosmos');
tjek('der er markeret mange fagord i siden', antal > 40, antal);

// Hjælpen i Batteriet: Esc lukker først forklaringen og så hjælpen
await T(() => { location.hash = '#batteri'; });
await page.waitForTimeout(1200);
await page.click('#batteriHjælp');
await page.waitForTimeout(300);
tjek('batteri-hjælpen har "elektrolyt" markeret', await page.isVisible('#hjælpBatteri .fagord[data-ord="elektrolyt"]'));
await page.click('#hjælpBatteri .fagord[data-ord="elektrolyt"]');
await page.waitForTimeout(200);
tjek('forklaringen vises oven på hjælpen', (await vist()) === 'Elektrolyt');
await page.screenshot({ path: `${UD}/2-hjaelp.png` });
await page.keyboard.press('Escape');
tjek('første Esc lukker kun forklaringen', (await vist()) === null && (await page.isVisible('#hjælpBatteri')));
await page.keyboard.press('Escape');
tjek('anden Esc lukker hjælpen', !(await page.isVisible('#hjælpBatteri')));

// Nye tekster bliver også markeret: henfald i værkstedet (tritium → helium-3 med en antineutrino)
await T(() => { location.hash = '#vaerksted'; });
await page.waitForTimeout(1200);
await page.click('#knapRyd');
for (const k of ['p', 'n', 'n']) await page.keyboard.press(k);
await page.waitForTimeout(400);
await page.keyboard.press('h');
await T(() => atomlabTest.vaerksted.spol(1.5));
await page.waitForTimeout(800);
tjek('det seneste henfald har markerede ord', await T(() => Boolean(document.querySelector('#sidsteHenfald .fagord'))), await page.textContent('#sidsteHenfald'));
await tjekMærker('Værkstedet');
await ctx.close();

// Telefon: tryk på et ord i Stjerneovnens hjælp
const tlf = await side({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await tlf.page.goto(`${ADRESSE}/?test#fusion`);
await tlf.page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1 })));
await tlf.page.reload();
await tlf.page.waitForTimeout(1500);
await tlf.page.click('#fusHjælp');
await tlf.page.waitForTimeout(300);
const ord = tlf.page.locator('#hjælpFusion .fagord').first();
await ord.scrollIntoViewIfNeeded();
await ord.tap();
await tlf.page.waitForTimeout(300);
const tv = await tlf.page.evaluate(() => { const e = document.getElementById('ordforklaring'); const r = e.getBoundingClientRect(); return { vist: atomlabTest.ord.vist(), l: r.left, rr: r.right }; });
tjek('telefon: tryk viser forklaringen', tv.vist !== null, JSON.stringify(tv));
tjek('telefon: forklaringen er inde på skærmen', tv.l >= 0 && tv.rr <= 390, JSON.stringify(tv));
await tlf.page.screenshot({ path: `${UD}/3-telefon.png` });
await tlf.ctx.close();

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
