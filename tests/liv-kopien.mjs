// Liv L3: turen "Kopien" (drejebogen i docs/drejebog-liv.md, afsnit 2) og "Leg frit: Kopien". Teksterne holder
// skabelonens grænser og lagenes budget, turen starter fra listen, lynlåsen trækkes med en finger, ét bogstav på hver
// halvdel (et forkert tæller ikke), de to nye stiger passer A–T og G–C, en fejl findes og rettes, fejlen bliver siddende
// tredje gang, "Det så du" har kernesætningen, "Vis mig" gør hvert trin helt, ★-opgaven kan klares i Leg frit, et skærmskift rydder op, og panelet får
// ingen rullebjælke ved 1150, 820 og 560 px.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { KOPIEN } from '../js/data/forloeb/kopien.js';
import { KOPI_PANEL, KOPI_START, FEJL_KOPIER, labFejl } from '../js/data/liv/kopien.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { FORLØB } from '../js/data/forloeb/liste.js';
const UD = billedmappe('liv-kopien');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne (Node) ----------
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const sætninger = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;
const lange = KOPIEN.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const uden = KOPIEN.trin.flatMap((t) => t.ord ?? []).filter((id) => !ORDBOG.some((o) => o.id === id));
const kort = ['livStigen', 'livForaeldre', 'livKopi'].filter((id) => !HVORFOR[id]?.svar);
// Fejlene: tredje kopi bliver, og laboratoriet giver altid en, der bliver, efter tre kopier uden
let tilfældig = 0.99;
const tvunget = labFejl(KOPI_START, () => (tilfældig = (tilfældig * 7.31) % 1), 3);
tjek('teksterne: fire trin og skabelonens grænser, mindst to gæt, panelet har højst to tal og tre sætninger, kort 1-3 findes, turen står i listen',
  KOPIEN.trin.length === 4 && !lange.length && !uden.length && KOPIEN.trin.filter((t) => t.gæt).length >= 2
  && KOPI_PANEL.tal.length <= 2 && sætninger(KOPI_PANEL.tekst) <= 3 && !kort.length && FORLØB.includes(KOPIEN)
  && FEJL_KOPIER.findIndex((f) => f.bliver) === 2 && tvunget.some((f) => f.bliver) && /Franklin/.test(HVORFOR.livStigen.svar) && !/aldrig efter døden/.test(HVORFOR.livStigen.nørd),
  JSON.stringify({ lange: lange.map((t) => t.id), uden, kort, tvunget }));

const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
const K = () => T(() => atomlabTest.liv.kopien());
const fase = (f) => page.waitForFunction((x) => atomlabTest.liv.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const stille = () => page.waitForFunction(() => atomlabTest.liv.stille(), null, { timeout: 20000, polling: 100 }).then(() => page.waitForTimeout(300));
const synlig = (sel) => T((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
const spol = (sek) => T((x) => atomlabTest.liv.kopiSpol(x), sek);
const trykPar = async (h, k) => {
  const p = await T(([a, c]) => atomlabTest.liv.kopiPunkt(a, c), [h, k]);
  await page.touchscreen.tap(p.x, p.y);
};

await page.goto(`${ADRESSE}/?test#liv`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.liv?.aktiv(), null, { timeout: 20000 });

// ---------- Trin 1: lynlåsen trækkes med en finger ----------
await page.click('#livForløbKopien');
await page.waitForFunction(() => atomlabTest.liv.forløb.kører() === 'kopien', null, { timeout: 20000 });
await page.click('#liv .fl-gæt >> nth=1');
await stille();
let k = await K();
const lukket = k.z === 0 && k.ny.every((s) => s === '............') && k.lynlås && !k.skilt;
// Et træk med musen fra lynlåsen et stykke over halvvejs: resten kører den selv (målet er rundt)
const fra = await T(() => atomlabTest.liv.kopiPunkt());
const til = await T(() => atomlabTest.liv.kopiSkærm(2.5));
await page.mouse.move(fra.x, fra.y);
await page.mouse.down();
for (let i = 1; i <= 8; i++) await page.mouse.move(fra.x + ((til.x - fra.x) * i) / 8, fra.y, { steps: 2 });
const underTræk = { trækker: await T(() => atomlabTest.liv.trækker()), styring: await T(() => atomlabTest.liv.styring()) };
await page.mouse.up();
const zSlip = (await K()).z;
await spol(3);
await fase('så');
k = await K();
await page.screenshot({ path: `${UD}/1-aaben.png` });
tjek('trin 1: stigen er lukket, et træk lynlåsen over halvvejs åbner resten af sig selv, og Så kommer',
  lukket && underTræk.trækker && underTræk.styring === false && zSlip > 6 && zSlip < k.luk && k.z >= k.luk, JSON.stringify({ lukket, underTræk, zSlip, z: k.z }));

// ---------- Trin 2: ét bogstav på hver halvdel, cellen bygger resten ----------
await page.click('#liv .fl-næste');
await stille();
k = await K();
const hul0 = k.hul;
await page.click('#liv .fl-handling.base-G'); // A (I[0]) skal have T: G tæller ikke
const forkert = { ny: (await K()).ny[0], vink: await T(() => document.querySelector('#liv .fl-vink')?.textContent ?? '') };
await page.click('#liv .fl-handling.base-T');
const hul1 = (await K()).hul;
await page.click('#liv .fl-handling.base-A'); // halvdel 1: II[0] er T, så det nye er A
await spol(4);
await fase('så');
k = await K();
const PAR = { A: 'T', T: 'A', G: 'C', C: 'G' };
const passer = [0, 1].every((h) => [...k.ny[h]].every((x, i) => PAR[x] === k.gammel[h][i]));
await page.screenshot({ path: `${UD}/2-to-stiger.png` });
tjek('trin 2: et forkert bogstav tæller ikke (vink), og efter ét på hver halvdel passer begge nye sider A–T og G–C, og de to stiger er ens',
  hul0?.h === 0 && hul1?.h === 1 && forkert.ny === '............' && /passer ikke/.test(forkert.vink) && passer && k.ny[1] === KOPI_START,
  JSON.stringify({ hul0, hul1, forkert, k }));

// ---------- Trin 3: et forkert bogstav, man selv finder ----------
await page.click('#liv .fl-næste');
await page.click('#liv .fl-gæt >> nth=1');
await spol(4);
await stille();
k = await K();
const før3 = { forkert: k.forkert, skilt: k.skilt };
await trykPar(0, 2); // et par, der passer
await page.waitForTimeout(200);
const vink3 = await T(() => document.querySelector('#liv .fl-vink')?.textContent ?? '');
await trykPar(0, 7); // C over for A
await spol(2);
await fase('så');
k = await K();
const så3 = await T(() => document.querySelector('#liv .fl-tekst').textContent);
tjek('trin 3: skiltet står fremme, ét forkert bogstav (C over for A), et tryk på et rigtigt par giver et vink, og et tryk på fejlen retter den',
  før3.skilt && før3.forkert.join() === '0:7' && /passer/.test(vink3) && !k.forkert.length && k.ny[0][7] === 'T' && /klipper bogstavet af/.test(så3),
  JSON.stringify({ før3, vink3, k, så3 }));

// ---------- Trin 4: kopiér igen, til en fejl bliver siddende ----------
await page.click('#liv .fl-næste');
await page.click('#liv .fl-gæt >> nth=2');
const kopi = [];
for (let i = 0; i < 3; i++) {
  await page.click('#liv .fl-handling[data-knap="kopier"]');
  await spol(5);
  await page.waitForTimeout(200);
  k = await K();
  kopi.push({ nr: k.kopier, mutation: Boolean(k.mutation), forkert: k.forkert.join(), fase: await T(() => atomlabTest.liv.forløb.fase()) });
}
await fase('så');
await page.screenshot({ path: `${UD}/4-mutation.png` });
const så4 = await T(() => document.querySelector('#liv .fl-tekst').textContent);
tjek('trin 4: de to første fejl bliver rettet, den tredje bliver siddende (en mutation), og Så siger under 1 pr. milliard og ca. 70',
  !kopi[0].mutation && !kopi[1].mutation && kopi[2].mutation && kopi[2].forkert === '1:5' && kopi[0].fase === 'gør' && /milliard/.test(så4) && /70/.test(så4),
  JSON.stringify({ kopi, så4 }));
await page.click('#liv .fl-næste');
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('#liv .fl-tekst').textContent, lille: document.querySelector('#liv .fl-lille')?.textContent, veje: [...document.querySelectorAll('#liv .fl-vej')].map((v) => v.textContent) }));
tjek('"Det så du": kernesætningen, de 70, og vejene Leg frit og to "Hvorfor?"-kort',
  slut.tekst === KOPIEN.kernesætning && /70 gør ingenting/.test(slut.lille) && slut.veje.length === 3 && slut.veje[0] === 'Leg frit: Kopien', JSON.stringify(slut));

// ---------- Leg frit: Kopien, og ★-opgaven ----------
await page.click('#liv .fl-vej.primær');
await page.waitForFunction(() => atomlabTest.liv.kopien()?.lab, null, { timeout: 10000, polling: 100 });
await stille();
const panel = { titel: await T(() => document.getElementById('livTitel').textContent), tal: await T(() => document.querySelectorAll('#livTal > div').length), hvorfor: await T(() => [...document.querySelectorAll('#livHvorfor button')].map((x) => x.dataset.hvorfor).join()), venstre: await synlig('#livKopiIGang'), byg: await synlig('#livByg'), ture: await T(() => document.getElementById('livForløbKopien').textContent) };
let fundet = null;
for (let i = 0; i < 6 && !fundet; i++) {
  await T(() => atomlabTest.liv.kopiLyn());
  await spol(6);
  k = await K();
  if (k.mutation) {
    await stille();
    await trykPar(k.mutation.h, k.mutation.k);
    await page.waitForTimeout(300);
    fundet = (await K()).fundet;
  } else await T(() => atomlabTest.liv.kopiIgen());
}
const stjerne = await T(() => [...document.querySelectorAll('#livOpgaver li')].some((li) => li.classList.contains('løst') && /mutation/.test(li.textContent)));
await page.screenshot({ path: `${UD}/5-leg-frit.png` });
tjek('Leg frit: panelet "Kopien" med to tal og kortet om Meselson og Stahl, knapperne til venstre, ✓ ved turen, og ★-opgaven klares ved at trykke på mutationen',
  panel.titel === 'Kopien' && panel.tal === 2 && panel.hvorfor === 'livKopi' && panel.venstre && !panel.byg && /✓/.test(panel.ture) && fundet && stjerne,
  JSON.stringify({ panel, fundet, stjerne }));

// "Stop" går tilbage til stigen, og Stigen har to "Hvorfor?"-kort
await page.click('#livKopiStop');
await page.waitForTimeout(400);
const efter = { tegning: await T(() => atomlabTest.liv.tilstandProtein()), niveau: await T(() => atomlabTest.liv.niveau()), byg: await synlig('#livByg'), hvorfor: await T(() => [...document.querySelectorAll('#livHvorfor button')].map((x) => x.dataset.hvorfor).join()) };
tjek('"Stop" rydder kopien og går tilbage til stigen, der har kortene "Hvad holder stigen sammen?" og "Hvem fandt stigen?"',
  efter.tegning === 'tom' && efter.niveau === 'stige' && efter.byg && efter.hvorfor === 'livSammen,livStigen', JSON.stringify(efter));

// ---------- Ingen rullebjælke i panelerne ved 1150, 820 og 560 px (med Leg frit: Kopien) ----------
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await T(() => atomlabTest.liv.kopiLab());
  await page.waitForTimeout(600);
  const r = await T(() => [...document.querySelectorAll('#liv .side-panel')].map((p) => ({ mere: p.classList.contains('mere'), rul: p.scrollHeight > p.clientHeight + 2 && getComputedStyle(p).overflowY !== 'visible' })));
  rul.push({ w, r });
  if (w === 820) await page.screenshot({ path: `${UD}/6-tablet-hoejkant.png` });
}
tjek('ingen rullebjælke i Livs paneler (uden klassen "mere") ved 1150, 820 og 560 px', rul.every((x) => x.r.every((p) => p.mere || !p.rul)), JSON.stringify(rul));

// ---------- "Vis mig" gør hele trinet (så stilguidens "Næste ›" kan bruge den) ----------
await page.setViewportSize({ width: 1024, height: 768 });
await T(() => atomlabTest.liv.startKopien());
const vist = [];
for (let i = 0; i < 4; i++) {
  if (await T(() => atomlabTest.liv.forløb.fase() === 'gæt')) await page.click('#liv .fl-gæt >> nth=0');
  await T(() => atomlabTest.liv.forløb.visMigNu()); // som "Næste ›" før handlingen (E20)
  await spol(6);
  await page.waitForFunction(() => atomlabTest.liv.forløb.fase() === 'så', null, { timeout: 10000, polling: 100 }).catch(() => {});
  vist.push(await T(() => atomlabTest.liv.forløb.fase()));
  if (i < 3) await page.click('#liv .fl-næste');
}
k = await K();
tjek('"Vis mig" fører hvert af de fire trin helt til Så (også begge bogstaver i trin 2 og fejlen, der bliver, i trin 4)',
  vist.every((f) => f === 'så') && Boolean(k.mutation), JSON.stringify({ vist, k }));
await page.click('#liv .fl-spring');

// ---------- Et skærmskift midt i turen rydder op ----------
await page.click('#livForløbKopien');
await page.waitForFunction(() => atomlabTest.liv.forløb.kører() === 'kopien', null, { timeout: 20000 });
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ kører: atomlabTest.liv.forløb.kører(), kopi: atomlabTest.liv.kopien(), linje: document.querySelectorAll('.forløb-linje').length, styring: atomlabTest.liv.styring() }));
tjek('et skærmskift midt i turen rydder op (ingen linje, ingen kopi, kameraets styring er til)', ryddet.kører === null && ryddet.kopi === null && !ryddet.linje && ryddet.styring === true, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
