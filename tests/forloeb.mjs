// Forløb-klodsen (js/forloeb.js) med "Dit første atom" i Værkstedet: starter første gang og ikke anden gang, panelerne er
// skjult imens, hvert trins handling, helium med to protoner uden neutroner, H og He opdaget, kernesætningen til sidst,
// "Spring over", "‹", "Vis mig", ✓ i "Din fremgang" og forløbets eget link.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { FØRSTE_ATOM } from '../js/data/forloeb/foerste-atom.js';
const UD = billedmappe('forloeb');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Teksterne holder skabelonens grænser (docs/fable/E3-forloeb.md)
const ord = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const forLange = FØRSTE_ATOM.trin.filter((t) => ord(t.spørg) > 16 || ord(t.så) > 22 || (t.ord ?? []).length > 2);
tjek('teksterne: 3-6 trin, Spørg ≤ ca. 15 ord, Så ≤ ca. 20 ord, højst to fagord, mindst to gæt',
  FØRSTE_ATOM.trin.length >= 3 && FØRSTE_ATOM.trin.length <= 6 && !forLange.length && FØRSTE_ATOM.trin.filter((t) => t.gæt).length >= 2,
  forLange.map((t) => t.id).join(', '));

const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
const F = () => T(() => { const v = atomlabTest.vaerksted; return { kører: v.forløb.kører(), trin: v.forløb.trin(), fase: v.forløb.fase(), ...v.tilstand() }; });
const fase = (f) => page.waitForFunction((x) => atomlabTest.vaerksted.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const synlig = (sel) => T((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);

// ---------- Første gang: forløbet starter af sig selv ----------
await page.goto(`${ADRESSE}/?test&forloebstart#vaerksted`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 });
const skjult = { bygge: await synlig('#byggepanel'), info: await synlig('#infopanel'), opgave: await synlig('#opgavePille'), sky: await synlig('#knapVisning'), linje: await synlig('.forløb-linje') };
tjek('starter første gang, og kun scenen og linjen er fremme (paneler, opgaven og "Elektronsky" er skjult)',
  !skjult.bygge && !skjult.info && !skjult.opgave && !skjult.sky && skjult.linje, JSON.stringify(skjult));

// ---------- Trinene ----------
await page.click('.fl-handling'); // trin 1: + Proton
await fase('så');
let f = await F();
const trin1 = f.p === 1 && f.e === 0;
await page.click('.fl-næste');
f = await F();
const gætFørst = f.trin === 'elektron' && f.fase === 'gæt' && !(await synlig('.fl-handling'));
await page.click('.fl-gæt >> nth=1');
await page.click('.fl-handling'); // trin 2: + Elektron
await fase('så');
const fagord = await T(() => [...document.querySelectorAll('.fl-tekst .fagord')].map((k) => k.dataset.ord).join(' '));
f = await F();
const hydrogen = f.p === 1 && f.e === 1;
// "‹" fra trin 3 går tilbage til trin 2, og atomet er igen, som det var, da trin 2 begyndte
await page.click('.fl-næste');
await page.click('.fl-tilbage');
f = await F();
const tilbage = f.trin === 'elektron' && f.p === 1 && f.e === 0;
await page.click('.fl-gæt >> nth=1');
await page.click('.fl-handling');
await fase('så');
await page.click('.fl-næste');
await page.click('.fl-gæt >> nth=0');
await page.click('.fl-handling'); // trin 3: + Proton
await fase('så');
f = await F();
const toProtoner = f.p === 2 && f.n === 0 && await T(() => JSON.parse(localStorage.getItem('atomlabFremgang')).opgaver['uden-lim'] > 0);
await page.screenshot({ path: `${UD}/trin3.png` });
tjek('hvert trin: handling → Så, gættet kommer før handlingen, "‹" sætter atomet tilbage, og trinets fagord har prikker',
  trin1 && gætFørst && hydrogen && tilbage && fagord === 'elektron grundstof', JSON.stringify({ trin1, gætFørst, hydrogen, tilbage, fagord }));

// Trin 4 med "Vis mig": Værkstedet bygger selv helium
await page.click('.fl-næste');
const knapper = await T(() => [...document.querySelectorAll('.fl-handling')].map((k) => k.textContent.trim()).join(' | '));
await T(() => atomlabTest.vaerksted.forløb.visMigNu());
await page.click('.fl-vismig');
await fase('så');
f = await F();
const opdaget = await T(() => JSON.parse(localStorage.getItem('atomlabFremgang')).opdaget.sort().join(','));
tjek('trin 3 er helium uden neutroner ("to protoner" løst), og efter trin 4 ("Vis mig") er hydrogen og helium opdaget',
  toProtoner && f.p === 2 && f.n === 2 && f.e === 2 && opdaget === '1,2' && /Neutron 0\/2/.test(knapper), JSON.stringify({ toProtoner, f, opdaget, knapper }));

// Trin 5: det lille periodiske system med H og He, og til sidst kernesætningen
await page.click('.fl-næste');
const tabel = await synlig('#minitabelPanel') && await T(() => document.querySelectorAll('#minitabel .forløb-mål').length === 2);
await page.click('#minitabel .felt[data-nr="1"]');
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('.fl-tekst').textContent, veje: document.querySelectorAll('.fl-vej').length }));
await page.screenshot({ path: `${UD}/slut.png` });
tjek('trin 5 viser det periodiske system med H og He lyst op, og "Det så du" har kernesætningen og tre veje videre',
  tabel && slut.tekst === FØRSTE_ATOM.kernesætning && slut.veje === 3, JSON.stringify({ tabel, slut }));
await page.click('.fl-vej.primær');
const efter = { kører: (await F()).kører, bygge: await synlig('#byggepanel'), info: await synlig('#infopanel'), opgave: await T(() => document.getElementById('opgaveTekst').textContent) };

// ---------- Anden gang: starter ikke af sig selv. ✓ i "Din fremgang" ----------
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted, null, { timeout: 20000 });
await page.waitForTimeout(500);
const anden = (await F()).kører;
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
await page.click('.menu-fremgang-knap');
const flueben = await T(() => document.querySelector('.fremgang-forløb[data-forloeb="foerste-atom"]')?.classList.contains('færdig') ?? null);
tjek('efter forløbet: panelerne er tilbage, næste opgave er carbon (isotoperne kommer senere), det starter ikke igen, og ✓ i "Din fremgang"',
  efter.kører === null && efter.bygge && efter.info && /carbon/i.test(efter.opgave) && anden === null && flueben === true, JSON.stringify({ efter, anden, flueben }));

// ---------- Linket starter forløbet, også når det er taget, og forsvinder fra adressen ----------
await page.goto(`${ADRESSE}/?test&forloeb=foerste-atom#vaerksted`);
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 }).catch(() => {});
const link = { kører: (await F()).kører, adresse: await T(() => location.search) };
// "Spring over": panelerne er tilbage, og forløbet starter ikke af sig selv igen (her med ?forloebstart og ikke taget)
await T(() => localStorage.clear());
await page.goto(`${ADRESSE}/?test&forloebstart#vaerksted`);
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 });
await page.click('.fl-spring');
const sprunget = { kører: (await F()).kører, bygge: await synlig('#byggepanel') };
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted, null, { timeout: 20000 });
await page.waitForTimeout(500);
sprunget.igen = (await F()).kører;
tjek('linket starter forløbet og fjernes fra adressen; "Spring over" viser panelerne, og forløbet starter ikke igen',
  link.kører === 'foerste-atom' && !/forloeb/.test(link.adresse) && sprunget.kører === null && sprunget.bygge && sprunget.igen === null, JSON.stringify({ link, sprunget }));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
