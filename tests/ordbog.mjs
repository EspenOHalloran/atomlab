// Ordbogen (#ordbog): dansk sortering, søgning, links til steder, hvor ordene bruges, menukortet, hjælpen og layoutet
import { readFileSync } from 'fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { ORDBOG } from '../js/data/ordbog.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDNE, LINKS, søgOrd, sorterOrd } from '../js/data/ordbogliste.js';
const UD = billedmappe('ordbog');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: sortering, søgning og links ----------
const navne = (l) => l.map((o) => o.ord);
const prøve = sorterOrd(['Åkande', 'Zebra', 'Ørn', 'Ære', 'abe', 'Den stærke kernekraft', 'Stjerne'].map((ord) => ({ ord })));
tjek('dansk sortering: æ, ø og å til sidst (også inde i ordet), "Den …" står under ordet efter', navne(prøve).join() === 'abe,Stjerne,Den stærke kernekraft,Zebra,Ære,Ørn,Åkande', navne(prøve).join());
tjek(`alle ${ORDBOG.length} fagord er med én gang`, ORDNE.length === ORDBOG.length && new Set(ORDNE.map((o) => o.id)).size === ORDBOG.length);
tjek('ordbogens egne ord står i rækkefølge ("Tunneleffekt" før "Tøris", "Moderator" før "Mørk energi")',
  navne(ORDNE).indexOf('Tunneleffekt') < navne(ORDNE).indexOf('Tøris') && navne(ORDNE).indexOf('Moderator') < navne(ORDNE).indexOf('Mørk energi'));
tjek('fotonen fra Stjerneovnen er med', navne(ORDNE).includes('Foton'));
const s1 = navne(søgOrd('neutr'));
tjek('søgning: ord, hvor navnet passer, kommer først', s1.slice(0, 3).join() === 'Antineutrino,Neutrino,Neutronstjerne', s1.join());
tjek('søgning: store og små bogstaver er lige gode', navne(søgOrd('KVARK'))[0] === 'Kvark');
tjek('søgning: bøjninger findes ("fotonerne" → Foton)', navne(søgOrd('fotonerne'))[0] === 'Foton');
tjek('søgning: et ord, der ikke findes, giver ingenting', søgOrd('zzqx').length === 0);
tjek('tom søgning viser alle', søgOrd('  ').length === ORDBOG.length);
// Hvert link peger på et sted, hvor ordet faktisk står
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sektion = (id) => { const i = html.indexOf(`<section id="${id}"`); return html.slice(i, html.indexOf('</section>', i)); };
const forkerte = [];
for (const [id, l] of Object.entries(LINKS)) {
  const o = ORDBOG.find((x) => x.id === id);
  const har = (t) => Boolean(o) && o.former.some((f) => t.toLowerCase().includes(f));
  if (l.hvorfor && !(HVORFOR[l.hvorfor] && har(HVORFOR[l.hvorfor].spørgsmål + HVORFOR[l.hvorfor].svar + (HVORFOR[l.hvorfor].nørd ?? '')))) forkerte.push(`${id} → ${l.hvorfor}`);
  if (l.skærm && !har(sektion(l.skærm[0]) + html.slice(html.indexOf(`aria-label="Hjælp til`)))) forkerte.push(`${id} → #${l.skærm[0]}`);
  if (l.gaa) {
    // Teksten står i fænomenets fil eller (Mars, Saturn og Jorden) i js/data/sider/
    const navn = l.gaa[0].split(':')[1];
    let tekst = '';
    for (const sti of [`../js/kosmos/${navn}.js`, `../js/data/sider/${navn === 'jordkloden' ? 'jorden' : navn}.js`]) {
      try { tekst += readFileSync(new URL(sti, import.meta.url), 'utf8'); } catch { /* mangler */ }
    }
    if (!har(tekst)) forkerte.push(`${id} → ${l.gaa[0]}`);
  }
}
tjek(`alle ${Object.keys(LINKS).length} links peger på et sted, hvor ordet står`, !forkerte.length, forkerte.join(', '));

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const side = async (opsætning, hash = '') => {
  const page = await (await b.newContext(opsætning)).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test${hash}`);
  await page.waitForFunction(() => window.atomlabTest, null, { timeout: 20000 });
  return page;
};
const page = await side({ viewport: { width: 1280, height: 800 } });
const T = (f, a) => page.evaluate(f, a);

// Menuen: 8 kort i to hele rækker, og Ordbogen viser antallet af fagord
const menu = await T(() => {
  const kort = [...document.querySelectorAll('.menukort .kort')];
  return { antal: kort.length, rækker: new Set(kort.map((k) => Math.round(k.getBoundingClientRect().top))).size, mærke: document.querySelector('.menukort a[href="#ordbog"] .kort-fremgang')?.textContent };
});
tjek(`pc: 8 kort i menuen i 2 rækker, og Ordbogen viser "${menu.mærke}"`, menu.antal === 8 && menu.rækker === 2 && menu.mærke === `${ORDBOG.length} fagord`, JSON.stringify(menu));
await page.click('.menukort a[href="#ordbog"]');
await page.waitForFunction(() => document.querySelector('#ordbog:not(.skjult)'), null, { timeout: 5000 });
const start = await T(() => ({ ord: document.querySelectorAll('#ordbogListe li').length, fokus: document.activeElement?.id, første: document.querySelector('#ordbogListe h3')?.textContent }));
tjek('kortet åbner Ordbogen med alle ordene, og søgefeltet har fokus (pc)', start.ord === ORDBOG.length && start.fokus === 'ordbogSøg' && start.første === ORDNE[0].ord, JSON.stringify(start));
tjek('rækkefølgen på siden er den samme som i listen', JSON.stringify(await T(() => [...document.querySelectorAll('#ordbogListe h3')].map((h) => h.textContent))) === JSON.stringify(navne(ORDNE)));
tjek('ingen ordforklaringer (prikkede ord) inde i Ordbogen', (await T(() => document.querySelectorAll('#ordbog .fagord').length)) === 0);

// Søgning med tastaturet, ingen resultater og Esc
await page.keyboard.type('neutr');
const søgt = await T(() => ({ h: [...document.querySelectorAll('#ordbogListe h3')].map((h) => h.textContent), antal: document.getElementById('ordbogAntal').textContent }));
tjek(`søgning "neutr" viser ${søgt.h.length} ord med Antineutrino, Neutrino og Neutronstjerne først (${søgt.antal})`, søgt.h.slice(0, 3).join() === 'Antineutrino,Neutrino,Neutronstjerne' && søgt.antal.startsWith(`${søgt.h.length} af`), søgt.h.join());
await page.fill('#ordbogSøg', 'zzqx');
tjek('ingen resultater: "Ingen fagord passer"', (await page.isVisible('#ordbogIngen')) && (await T(() => document.querySelectorAll('#ordbogListe li').length)) === 0);
await page.focus('#ordbogSøg');
await page.keyboard.press('Escape');
tjek('Esc tømmer søgningen, og alle ord er tilbage', (await page.inputValue('#ordbogSøg')) === '' && (await T(() => document.querySelectorAll('#ordbogListe li').length)) === ORDBOG.length && (await T(() => location.hash)) === '#ordbog');

// Bogstaverne hopper til det første ord med bogstavet
await page.click('#ordbogBogstaver button[data-bogstav="K"]');
await page.waitForFunction(() => {
  const li = document.querySelector('#ordbogListe li[data-bogstav="K"]');
  const liste = document.getElementById('ordbogListe');
  return Math.abs(li.getBoundingClientRect().top - liste.getBoundingClientRect().top) < 12;
}, null, { timeout: 5000 }).then(() => tjek('bogstavet K ruller til "Kerneskygge"', true), () => tjek('bogstavet K ruller til "Kerneskygge"', false));

// Links: "Hvorfor?"-kort, en skærm og et fænomen
await page.click('#ord-tunneleffekt button.hvorfor');
tjek('tunneleffekt: "Hvorfor?"-kortet åbner', (await T(() => atomlabTest.hvorfor.vist())) === HVORFOR.tunnel.spørgsmål);
await page.keyboard.press('Escape');
tjek('Esc lukker kortet, og man er stadig i Ordbogen', (await T(() => atomlabTest.hvorfor.vist())) === null && (await T(() => location.hash)) === '#ordbog');
await page.click('#ord-elektrolyt a[href="#batteri"]');
await page.waitForFunction(() => location.hash === '#batteri' && document.querySelector('#batteri:not(.skjult)'), null, { timeout: 8000 }).then(() => true, () => false).then((v) => tjek('elektrolyt: linket åbner Batteriet', v));
await T(() => { location.hash = '#ordbog'; });
await page.waitForFunction(() => document.querySelector('#ordbog:not(.skjult)'), null, { timeout: 5000 });
await page.click('#ord-hviddvaerg [data-gaa]');
await page.waitForFunction(() => location.hash === '#kosmos' && atomlabTest.kosmos.valgt() === 'hviddvaerg', null, { timeout: 8000 }).then(() => true, () => false).then((v) => tjek('hvid dværg: linket åbner fænomenet i Kosmos', v));

// Hjælpen i værkstedet har et link, og hjælpen lukker, når Ordbogen åbner
await T(() => { location.hash = '#vaerksted'; });
await page.waitForFunction(() => document.querySelector('#vaerksted:not(.skjult)'), null, { timeout: 8000 });
await page.click('#knapHjælp');
await page.click('#hjælp a[href="#ordbog"]');
await page.waitForFunction(() => document.querySelector('#ordbog:not(.skjult)'), null, { timeout: 5000 }).catch(() => {});
tjek('hjælpen: linket åbner Ordbogen og lukker hjælpen', (await T(() => location.hash)) === '#ordbog' && (await T(() => document.getElementById('hjælp').classList.contains('skjult'))));

// Layout: listen kan ses og rulles, og siden ruller ikke til siden
const størrelser = [
  ['tablet-langs', { viewport: { width: 1180, height: 820 }, hasTouch: true }, 2],
  ['tablet-højkant', { viewport: { width: 820, height: 1180 }, hasTouch: true }, 4],
  ['tlf-højkant', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, 8],
  ['tlf-langs', { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }, 2],
];
for (const [navn, opsætning, rækker] of størrelser) {
  const p = await side(opsætning);
  const m = await p.evaluate(() => new Set([...document.querySelectorAll('.menukort .kort')].map((k) => Math.round(k.getBoundingClientRect().top))).size);
  tjek(`${navn}: menuen har ${rækker} rækker kort`, m === rækker, m);
  await p.evaluate(() => { location.hash = '#ordbog'; });
  await p.waitForFunction(() => document.querySelector('#ordbog:not(.skjult)'), null, { timeout: 5000 });
  const l = await p.evaluate(() => {
    const liste = document.getElementById('ordbogListe').getBoundingClientRect();
    return { højde: Math.round(liste.height), bund: Math.round(liste.bottom), vindue: innerHeight, bredde: document.documentElement.scrollWidth, ind: innerWidth, fokus: document.activeElement?.id ?? null };
  });
  tjek(`${navn}: listen kan ses (${l.højde} px), og intet stikker ud til siden`, l.højde > 150 && l.bund <= l.vindue + 1 && l.bredde <= l.ind, JSON.stringify(l));
  tjek(`${navn}: søgefeltet får ikke fokus (tastaturet dækker ikke skærmen)`, l.fokus !== 'ordbogSøg', l.fokus);
  await p.screenshot({ path: `${UD}/${navn}.png` });
  await p.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
