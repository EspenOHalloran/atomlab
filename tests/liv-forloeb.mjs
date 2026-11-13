// Liv: forløbet "Opskriften i dig" (Serie 1 nr. 2, forløb 1, drejebogen i docs/fable/E3-liv-drejebog.md): teksterne holder
// skabelonens grænser, det starter første gang med kun scenen og linjen, tryk i 3D på cellekernen og en tråd (springer
// kromosomet over), et tryk på et trin med A (og et uden), byggestigen med 3 tomme trin, kernesætningen til sidst,
// panelet og gruppen "Forløb" bagefter, "Spring over" og ✓ i "Din fremgang".
// Forløb 2, "Hvad står der i opskriften?" (startes fra forløb 1's første vej): DNA'et og ingen RNA, tryk på et ord, den
// lille ordbog, "Læs resten" (147 og foldningen), seglcellen i ord 7, et skift, man selv vælger, og vejene til sidst.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { OPSKRIFTEN } from '../js/data/forloeb/opskriften.js';
import { ORDENE, ORD_START, skiftIForløb } from '../js/data/forloeb/ordene.js';
import { ORDBOG } from '../js/data/ordbog.js';
const UD = billedmappe('liv-forloeb');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Teksterne holder skabelonens grænser (docs/fable/E3-forloeb.md), og fagordene står i Ordbogen
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
for (const F of [ORDENE]) {
  const lange = F.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
  const uden = F.trin.flatMap((t) => t.ord ?? []).filter((id) => !new Set(ORDBOG.map((o) => o.id)).has(id));
  const skift = (i, p, b) => ORD_START.slice(0, 3 * i + p) + b + ORD_START.slice(3 * i + p + 1);
  const typer = [skiftIForløb(ORD_START, skift(6, 1, 'T'), 6), skiftIForløb(ORD_START, skift(1, 2, 'C'), 1), skiftIForløb(ORD_START, skift(8, 0, 'T'), 8), skiftIForløb(ORD_START, skift(2, 1, 'C'), 2)].map((v) => v.type).join(' ');
  tjek('forløb 2, teksterne: skabelonens grænser, fagordene i Ordbogen, ord 7 er GAG, og skiftene giver segl, samme, stop og en anden',
    !lange.length && !uden.length && ORD_START.slice(18, 21) === 'GAG' && typer === 'segl tavs stop anden' && !/Hvert ord er én byggesten/.test(F.kernesætning),
    JSON.stringify({ lange: lange.map((t) => t.id), uden, typer }));
}
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
const førsteVej = await T(() => document.querySelector('#liv .fl-vej.primær').textContent);
tjek('"Det så du": kernesætningen, kopien i en linje og tre veje videre (den første er forløb 2)',
  slut.tekst === OPSKRIFTEN.kernesætning && /kopierer cellen sit DNA/.test(slut.lille) && slut.veje === 3 && /^Næste forløb: Hvad står der i opskriften/.test(førsteVej), JSON.stringify({ slut, førsteVej }));

// ---------- Forløb 2: "Hvad står der i opskriften?" ----------
await page.click('#liv .fl-vej.primær');
await page.waitForFunction(() => atomlabTest.liv.forløb.kører() === 'ordene', null, { timeout: 20000 });
const O = () => T(() => atomlabTest.liv.ordene());
const trykOrd = async (i) => {
  const p = await T((x) => atomlabTest.liv.ordPunkt(x), i);
  await page.touchscreen.tap(p.x, p.y);
};
// Trin 1: gæt, og et tryk på et ord i 3D
const gæt1 = await T(() => document.querySelectorAll('#liv .fl-gæt').length);
await page.click('#liv .fl-gæt >> nth=1');
await stille();
await trykOrd(3);
await fase('så');
let o = await O();
const så1 = await T(() => document.querySelector('#liv .fl-tekst').textContent);
const farver = await T(() => [...document.querySelectorAll('#livFarver li')].map((li) => li.textContent).join(''));
tjek('forløb 2, trin 1: DNA (ingen U, basernes farver), et tryk på ord 4 lyser det op, og Så siger 64 ord, 61 og 3 stop',
  gæt1 === 3 && o.tilstand === 'ord' && o.lys === 3 && o.læst === 0 && !o.dna.includes('U') && farver === 'ATGC' && /64 ord\. 61 af ordene/.test(så1), JSON.stringify({ gæt1, o, farver, så1 }));
// Trin 2: et forkert opslag tæller ikke, tre rigtige giver fire perler
await page.click('#liv .fl-næste');
await stille();
await page.click('#liv .fl-handling[data-knap="CAT"]');
const forkertOpslag = (await O()).opslag;
for (const ord of ['GTG', 'CAT', 'CTG']) await page.click(`#liv .fl-handling[data-knap="${ord}"]`);
await fase('så');
o = await O();
tjek('forløb 2, trin 2: ordbogen har fire ord, et forkert opslag tæller ikke, og tre rigtige giver fire byggesten (ATG + 3)',
  forkertOpslag === 0 && o.opslag === 3 && o.læst === 4 && (await T(() => document.querySelectorAll('#liv .fl-handling').length)) === 0, JSON.stringify({ forkertOpslag, o }));
// Trin 3: "Læs resten": kæden vokser og folder sig (tiden spoles frem)
await page.click('#liv .fl-næste');
await page.click('#liv .fl-gæt >> nth=1');
await page.click('#liv .fl-handling');
const vokser = await T(() => atomlabTest.liv.tilstandProtein());
await T(() => atomlabTest.liv.proteinSpol(8));
await fase('så');
const så3 = await T(() => ({ tekst: document.querySelector('#liv .fl-tekst').textContent, tilstand: atomlabTest.liv.tilstandProtein(), kæde: atomlabTest.liv.protein().kæde.length }));
await page.screenshot({ path: `${UD}/ordene-fold.png` });
tjek('forløb 2, trin 3: "Læs resten" giver en kæde på 147, der folder sig, og Så siger stop, protein og en af de fire kæder i hæmoglobin',
  vokser === 'vokser' && så3.tilstand === 'færdig' && så3.kæde === 147 && /^147, for det sidste ord betyder stop/.test(så3.tekst) && /en af de fire kæder i hæmoglobin/.test(så3.tekst), JSON.stringify({ vokser, så3 }));
// Trin 4: ord 7, G tæller ikke, T er seglcellen
await page.click('#liv .fl-næste');
await page.click('#liv .fl-gæt >> nth=1');
await stille();
await page.click('#liv .fl-handling.base-G');
const medG = { fase: (await L()).fase, ord: (await O()).dna.slice(18, 21) };
await page.click('#liv .fl-handling.base-T');
await fase('så');
o = await O();
const så4 = await T(() => document.querySelector('#liv .fl-tekst').textContent);
await page.screenshot({ path: `${UD}/ordene-segl.png` });
tjek('forløb 2, trin 4: GAG → GGG gør ikke trinet, GTG gør, og Så nævner både mor og far',
  medG.fase === 'gør' && medG.ord === 'GGG' && o.dna.slice(18, 21) === 'GTG' && /både sin mor og sin far/.test(så4), JSON.stringify({ medG, o, så4 }));
// Trin 5: ATG kan ikke vælges, et tryk på ord 9 giver dets bogstaver, og AAG → TAG er et stop
await page.click('#liv .fl-næste');
await stille();
await trykOrd(0);
await page.waitForTimeout(300);
const vedATG = await T(() => document.querySelectorAll('#liv .fl-handling').length);
await trykOrd(8);
await page.waitForFunction(() => document.querySelectorAll('#liv .fl-handling').length === 3, null, { timeout: 5000 }).catch(() => {});
const bogstaver = await T(() => [...document.querySelectorAll('#liv .fl-handling')].map((k) => k.textContent.trim()).join(''));
await page.click('#liv .fl-handling[data-knap="plads0"]');
await page.click('#liv .fl-handling[data-knap="tilT"]');
await fase('slut');
o = await O();
const slut2 = await T(() => ({ tekst: document.querySelector('#liv .fl-tekst').textContent, lille: document.querySelector('#liv .fl-lille')?.textContent, veje: [...document.querySelectorAll('#liv .fl-vej')].map((v) => v.textContent) }));
tjek('forløb 2, trin 5: ATG kan ikke skiftes, ord 9 giver A A G, TAG giver stop, og "Det så du" har kernesætningen, kopien og filmen først',
  vedATG === 0 && bogstaver === 'AAG' && o.dna.slice(24, 27) === 'TAG' && slut2.tekst === ORDENE.kernesætning && /laver først en kopi/.test(slut2.lille)
  && slut2.veje.length === 3 && /film/.test(slut2.veje[0]) && slut2.veje[1] === 'Leg frit', JSON.stringify({ vedATG, bogstaver, o, slut2 }));

// ---------- Bagefter: laboratoriet med gruppen "Forløb" (✓) ----------
await page.click('#liv .fl-vej >> text=Leg frit');
await page.waitForTimeout(300);
l = await L();
const lab = { venstre: await synlig('#liv .venstre-panel'), højre: await synlig('#liv .højre-panel'), forløb: await T(() => document.getElementById('livForløbOpskriften').textContent), forløb2: await T(() => document.getElementById('livForløbOrdene').textContent), tegning: await T(() => atomlabTest.liv.tilstandProtein()), knap: await T(() => document.querySelector('[data-liv-niveau="kerne"]').textContent), sekvens: await T(() => atomlabTest.liv.sekvens()) };
tjek('bagefter: panelerne er tilbage, begge forløb har ✓, tegningen er ryddet, knappen hedder Cellekernen, og stigen er HBB igen',
  l.kører === null && l.byg === null && lab.venstre && lab.højre && /✓/.test(lab.forløb) && /✓/.test(lab.forløb2) && lab.tegning === 'tom' && l.niveau === 'stige' && lab.knap === 'Cellekernen' && lab.sekvens.startsWith('ATGGTGCAT'), JSON.stringify({ l, lab }));

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
