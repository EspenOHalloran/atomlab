// Liv: forløbet "Opskriften i dig" (Serie 1 nr. 2, forløb 1, drejebogen i docs/fable/E3-liv-drejebog.md): teksterne holder
// skabelonens grænser, det starter første gang med kun scenen og linjen, tryk i 3D på cellekernen og en tråd (springer
// kromosomet over), et tryk på et trin med A (og et uden), byggestigen med 3 tomme trin, kernesætningen til sidst,
// panelet og gruppen "Forløb" bagefter, "Spring over" og ✓ i "Din fremgang".
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { OPSKRIFTEN } from '../js/data/forloeb/opskriften.js';
import { ORDBOG } from '../js/data/ordbog.js';
const UD = billedmappe('liv-forloeb');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Teksterne holder skabelonens grænser (docs/fable/E3-forloeb.md), og fagordene står i Ordbogen
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const forLange = OPSKRIFTEN.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const ordbogIder = new Set(ORDBOG.map((o) => o.id));
const mangler = OPSKRIFTEN.trin.flatMap((t) => t.ord ?? []).filter((id) => !ordbogIder.has(id));
tjek('teksterne: 3-6 trin, Spørg ≤ ca. 15 ord, Så ≤ ca. 20 ord, højst to fagord, mindst to gæt, og fagordene står i Ordbogen',
  OPSKRIFTEN.trin.length >= 3 && OPSKRIFTEN.trin.length <= 6 && !forLange.length && OPSKRIFTEN.trin.filter((t) => t.gæt).length >= 2 && !mangler.length,
  JSON.stringify({ forLange: forLange.map((t) => t.id), mangler }));

const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
const L = () => T(() => { const l = atomlabTest.liv; return { kører: l.forløb.kører(), trin: l.forløb.trin(), fase: l.forløb.fase(), niveau: l.niveau(), synlige: l.synlige(), byg: l.byg() }; });
const fase = (f) => page.waitForFunction((x) => atomlabTest.liv.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const synlig = (sel) => T((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
// Venter, til overgangen og kameraet er færdige (så et tryk rammer det, man ser)
const stille = () => page.waitForFunction(() => atomlabTest.liv.stille(), null, { timeout: 20000, polling: 100 }).then(() => page.waitForTimeout(400));
// Et tryk med fingeren midt på noget i 3D (k: et trin på stigen, ellers det trinet venter på)
const tryk = async (k) => {
  const p = await T((x) => atomlabTest.liv.trykPunkt(x), k);
  await page.touchscreen.tap(p.x, p.y);
};

// ---------- Første gang: forløbet starter af sig selv ----------
await page.goto(`${ADRESSE}/?test&forloebstart#liv`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.liv?.forløb.kører() === 'opskriften', null, { timeout: 20000 });
const skjult = { venstre: await synlig('#liv .venstre-panel'), højre: await synlig('#liv .højre-panel'), linje: await synlig('#liv .forløb-linje') };
tjek('starter første gang i cellen, og kun scenen og linjen er fremme', !skjult.venstre && !skjult.højre && skjult.linje && (await L()).niveau === 'celle', JSON.stringify(skjult));

// ---------- Trin 1: et tryk på cellekernen ----------
await stille();
const prikker = () => T(() => [...document.querySelectorAll('#liv .fl-tekst .fagord')].map((k) => k.dataset.ord).join(' '));
let fagord = await prikker(); // "celle" står i spørgsmålet, "cellekerne" i Så
await tryk();
await fase('så');
fagord += ' ' + await prikker();
let l = await L();
tjek('trin 1: et tryk på den violette kugle zoomer ind til cellekernen, og "celle" og "cellekerne" har prikker',
  l.niveau === 'kerne' && fagord === 'celle cellekerne', JSON.stringify({ l, fagord }));

// ---------- Trin 2: gæt, og et tryk på en tråd går direkte til stigen ----------
await page.click('#liv .fl-næste');
const gætFørst = (await L()).fase === 'gæt' && (await T(() => document.querySelectorAll('#liv .fl-gæt').length)) === 3;
await page.click('#liv .fl-gæt >> nth=2');
await stille();
await tryk();
await fase('så');
l = await L();
const såTekst = await T(() => document.querySelector('#liv .fl-tekst').textContent);
tjek('trin 2: gættet først, og et tryk på en tråd går direkte til stigen (uden kromosomet). Så siger 2 meter i hver celle med en cellekerne',
  gætFørst && l.niveau === 'stige' && !l.synlige.includes('kromosom') && /2 meter, i hver celle med en cellekerne/.test(såTekst), JSON.stringify({ gætFørst, l, såTekst }));

// ---------- Trin 3: et trin uden A tæller ikke, et trin med A gør ----------
await page.click('#liv .fl-næste');
await page.click('#liv .fl-gæt >> nth=0');
await stille();
const sekvens = (await T(() => atomlabTest.liv.sekvens()));
// Et G–C-trin nær midten (dem i enderne kan være uden for billedet, når stigen står tæt på)
const midt = (sekvens.length - 1) / 2;
const udenA = [...sekvens].map((x, k) => k).filter((k) => /[GC]/.test(sekvens[k])).sort((a, b) => Math.abs(a - midt) - Math.abs(b - midt))[0];
await tryk(udenA);
await page.waitForTimeout(500);
const efterUdenA = { fase: (await L()).fase, valgt: await T(() => atomlabTest.liv.valgtTrin()) };
const medA = await T(() => atomlabTest.liv.trinMedA());
await tryk(medA);
await fase('så');
const valgt = await T(() => atomlabTest.liv.valgtTrin());
await page.screenshot({ path: `${UD}/trin3.png` });
tjek('trin 3: et tryk på G–C lyser op uden at gøre trinet, et tryk på et trin med A gør det',
  efterUdenA.fase === 'gør' && efterUdenA.valgt === udenA && valgt === medA && /[AT]/.test(sekvens[medA]), JSON.stringify({ efterUdenA, medA, valgt, b: sekvens[medA] }));

// ---------- Trin 4: byggestigen med 3 tomme trin, et forkert og tre rigtige ----------
await page.click('#liv .fl-næste');
l = await L();
const start4 = { bygget: l.byg?.bygget, knapper: await T(() => [...document.querySelectorAll('#liv .fl-handling')].map((k) => k.textContent.trim()).join('')) };
const PARTNER = { A: 'T', T: 'A', G: 'C', C: 'G' };
const forkert = { A: 'G', T: 'C', G: 'A', C: 'T' }[l.byg.streng[5]];
await page.click(`#liv .fl-handling.base-${forkert}`);
const efterForkert = (await L()).byg.bygget;
for (let i = 5; i < 8; i++) await page.click(`#liv .fl-handling.base-${PARTNER[l.byg.streng[i]]}`);
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('#liv .fl-tekst').textContent, lille: document.querySelector('#liv .fl-lille')?.textContent, veje: document.querySelectorAll('#liv .fl-vej').length }));
const ikkeByg = await T(() => !JSON.parse(localStorage.getItem('atomlabFremgang')).opgaver['liv-byg']);
await page.screenshot({ path: `${UD}/slut.png` });
tjek('trin 4: 5 af 8 trin er bygget, et forkert bogstav bygger ikke, tre rigtige gør stigen færdig, og "Byg en stige med 8 trin" er ikke løst',
  start4.bygget === 5 && start4.knapper === 'ATGC' && efterForkert === 5 && ikkeByg, JSON.stringify({ start4, efterForkert, ikkeByg }));
tjek('"Det så du": kernesætningen, kopien i en linje og tre veje videre',
  slut.tekst === OPSKRIFTEN.kernesætning && /kopierer cellen sit DNA/.test(slut.lille) && slut.veje === 3, JSON.stringify(slut));

// ---------- Bagefter: laboratoriet med gruppen "Forløb" (✓) ----------
await page.click('#liv .fl-vej.primær');
await page.waitForTimeout(300);
l = await L();
const lab = { venstre: await synlig('#liv .venstre-panel'), højre: await synlig('#liv .højre-panel'), forløb: await T(() => document.getElementById('livForløbOpskriften').textContent), knap: await T(() => document.querySelector('[data-liv-niveau="kerne"]').textContent), sekvens: await T(() => atomlabTest.liv.sekvens()) };
tjek('bagefter: panelerne er tilbage, "Forløb" har ✓, knappen hedder Cellekernen, og stigen er HBB igen',
  l.kører === null && l.byg === null && lab.venstre && lab.højre && /✓/.test(lab.forløb) && lab.knap === 'Cellekernen' && lab.sekvens.startsWith('ATGGTGCAT'), JSON.stringify({ l, lab }));

// ---------- Anden gang: starter ikke af sig selv, og ✓ i "Din fremgang" ----------
await page.reload();
await page.waitForFunction(() => atomlabTest.liv?.aktiv(), null, { timeout: 20000 });
await page.waitForTimeout(500);
const anden = (await L()).kører;
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
await page.click('.menu-fremgang-knap');
const flueben = await T(() => document.querySelector('.fremgang-forløb[data-forloeb="opskriften"]')?.classList.contains('færdig') ?? null);
// Et tryk i "Din fremgang" starter det igen i Liv
await page.click('.fremgang-forløb[data-forloeb="opskriften"] button');
await page.waitForFunction(() => atomlabTest.liv?.forløb.kører() === 'opskriften', null, { timeout: 20000 }).catch(() => {});
const igen = (await L()).kører;
tjek('det starter ikke igen af sig selv, ✓ i "Din fremgang", og et tryk dér starter det igen', anden === null && flueben === true && igen === 'opskriften', JSON.stringify({ anden, flueben, igen }));

// ---------- "Spring over" og oprydning ved skærmskift ----------
await page.click('#liv .fl-spring');
const sprunget = { kører: (await L()).kører, venstre: await synlig('#liv .venstre-panel') };
await page.click('#livForløbOpskriften');
await page.click('#liv .fl-handling'); // "Zoom ind ›"
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ kører: atomlabTest.liv.forløb.kører(), linje: document.querySelectorAll('.forløb-linje').length, klasse: document.getElementById('liv').classList.contains('i-forløb') }));
tjek('"Spring over" viser panelerne, og et skærmskift midt i forløbet rydder op', sprunget.kører === null && sprunget.venstre && ryddet.kører === null && !ryddet.linje && !ryddet.klasse, JSON.stringify({ sprunget, ryddet }));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
