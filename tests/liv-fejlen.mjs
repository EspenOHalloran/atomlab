// Liv L4: turen "Fejlen, der hjalp" (drejebogen i docs/drejebog-liv.md, afsnit 3) og "Leg frit: pladen". Teksterne holder
// skabelonens grænser og lagenes budget, kort 4 og 5 og de to nye ord findes, modellen er den samme med samme frø og
// kommer aldrig igennem uden mellemtrin, turen starter fra listen, et tryk i båndet sætter ingen bakterie, et tryk ved
// kanten tæller (men ikke før nogen er igennem), grenene findes en ad gangen, fejlen findes i feltet uden medicin, "Det så
// du" har kernesætningen og tre veje, laboratoriet åbner med panelet, ★-opgaven klares uden mellemtrin, "Næste ›" før
// handlingen fører hvert trin til Så, et skærmskift rydder op, og panelet får ingen rullebjælke ved 1150, 820 og 560 px.
import { readFileSync } from 'node:fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { FEJLEN } from '../js/data/forloeb/fejlen.js';
import { lavPlade, PLADE_PANEL } from '../js/data/liv/plade.js';
import { OPGAVER_LIV } from '../js/data/liv/opskriften.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { FORLØB } from '../js/data/forloeb/liste.js';
const UD = billedmappe('liv-fejlen');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne og modellen (Node) ----------
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const sætninger = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;
const lange = FEJLEN.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const uden = FEJLEN.trin.flatMap((t) => t.ord ?? []).filter((id) => !ORDBOG.some((o) => o.id === id));
const kopienKilde = readFileSync(new URL('../js/liv-kopien.js', import.meta.url), 'utf8');
const kopienVeje = kopienKilde.slice(kopienKilde.indexOf('veje: ['), kopienKilde.indexOf('],', kopienKilde.indexOf('veje: [')));
tjek('teksterne: fire trin og skabelonens grænser, mindst to gæt med svar, panelet har højst to tal og tre sætninger, kort 4 og 5, livSegl linker til kort 4, ★-opgaven, turen står i listen, og tur 3 peger på tur 4 uden kortet om forældrene',
  FEJLEN.trin.length === 4 && !lange.length && !uden.length && FEJLEN.trin.filter((t) => t.gæt?.valg.every((v) => v.svar)).length >= 2
  && PLADE_PANEL.tal.length <= 2 && sætninger(PLADE_PANEL.tekst) <= 3 && HVORFOR.livMenneske?.svar && HVORFOR.livMaelk?.svar
  && HVORFOR.livSegl.næste === 'livMenneske' && !/Derfor er genet almindeligt/.test(HVORFOR.livSegl.nørd) && OPGAVER_LIV.some((o) => o.id === 'liv-spring')
  && FORLØB.includes(FEJLEN) && /Næste tur: Fejlen, der hjalp/.test(kopienVeje) && !/livForaeldre/.test(kopienVeje) && (kopienVeje.match(/tekst:/g) ?? []).length <= 3,
  JSON.stringify({ lange: lange.map((t) => t.id), uden }));

const kør = (lag, frø) => {
  const m = lavPlade({ kol: 70, rækker: 70, lag, frø });
  m.sæt(3, 35);
  m.kørTilRo();
  m.åbn(4);
  m.kørTilRo();
  return m;
};
const a = kør('normal', 5), a2 = kør('normal', 5), sp = kør('spring', 5);
tjek('modellen: samme frø giver samme plade, den når det sidste bånd, feltet uden medicin har bakterier med en fejl, og uden mellemtrin kommer ingen igennem',
  a.antal() === a2.antal() && a.grene.length === a2.grene.length && a.længst() === 4 && a.medFejlIFelt() > 0 && !sp.grene.length && sp.længst() < 3,
  JSON.stringify({ antal: [a.antal(), a2.antal()], længst: a.længst(), medFejl: a.medFejlIFelt(), spring: [sp.grene.length, sp.længst()] }));

// ---------- Turen i browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);
const F = () => T(() => atomlabTest.liv.fejlen());
const fase = (f) => page.waitForFunction((x) => atomlabTest.liv.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const stille = () => page.waitForFunction(() => atomlabTest.liv.stille() && !atomlabTest.liv.overgang(), null, { timeout: 20000, polling: 100 }).then(() => page.waitForTimeout(300));
const spol = (sek) => T((x) => atomlabTest.liv.fejlenSpol(x), sek);
const vink = () => T(() => document.querySelector('#liv .fl-vink')?.textContent ?? '');
const tryk = async (k, j) => {
  const p = await T(([x, y]) => atomlabTest.liv.pladePunkt(x, y), [k, j]);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForTimeout(200);
};

await page.goto(`${ADRESSE}/?test#liv`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.liv?.aktiv(), null, { timeout: 20000 });

// Trin 1: et tryk i et bånd sætter ingen bakterie, et tryk i feltet uden medicin gør
await page.click('#livForløbFejlen');
await page.waitForFunction(() => atomlabTest.liv.forløb.kører() === 'fejlen', null, { timeout: 20000 });
await page.click('#liv .fl-gæt >> nth=2');
await stille();
const søjler = await T(() => atomlabTest.liv.fejlenKol()); // 70 med LAV_KVALITET og 100 ellers: punkterne regnes i andele
await tryk(søjler * 0.5, søjler * 0.5);
const iBånd = { frø: (await F()).frø, vink: await vink() };
await tryk(søjler * 0.08, søjler * 0.5);
await spol(9);
await fase('så');
let f = await F();
await page.screenshot({ path: `${UD}/1-feltet.png` });
tjek('trin 1: et tryk i et bånd giver et vink, et tryk i feltet uden medicin sætter bakterien, feltet fyldes, og skiltet siger "over en milliard"',
  !iBånd.frø && /lyse felt/.test(iBånd.vink) && f.frø && f.andel >= 0.999 && /over en milliard/.test(f.skilt),
  JSON.stringify({ iBånd, frø: f.frø, andel: f.andel, skilt: f.skilt }));

// Trin 2: et tryk ved kanten, før nogen er igennem, tæller ikke. Bagefter tæller et tryk ved grenen (målet er rundt)
await page.click('#liv .fl-næste');
await page.waitForFunction(() => atomlabTest.liv.forløb.fase() === 'gæt', null, { timeout: 10000 });
await page.click('#liv .fl-gæt >> nth=2');
await page.waitForTimeout(300);
await tryk(søjler * 0.21, søjler * 0.5);
const før = { fundet: (await F()).fundet, vink: await vink() };
await spol(6);
f = await F();
const g1 = f.grene.find((g) => g.område === 1);
if (g1) await tryk(g1.k + 2, g1.j);
await fase('så').catch(() => {});
f = await F();
const svar2 = await T(() => document.querySelector('#liv .fl-svar')?.textContent ?? '');
tjek('trin 2: et tryk ved kanten, før nogen er igennem, giver et vink, en gren bryder ind i det første bånd, og et tryk ved den tæller (gættet får sit svar)',
  !før.fundet.length && /Vent lidt/.test(før.vink) && g1 && f.fundet.includes(1) && /efterkommere/.test(svar2), JSON.stringify({ før, g1, fundet: f.fundet, svar2 }));

// Trin 3: hver ny gren findes en ad gangen, til de når det sidste bånd
await page.click('#liv .fl-næste');
await page.waitForFunction(() => atomlabTest.liv.forløb.fase() === 'gør', null, { timeout: 10000 });
const fundne = [];
for (const o of [2, 3, 4]) {
  let g = null;
  for (let t = 0; t < 40 && !g; t++) {
    g = (await F()).grene.find((x) => x.område === o);
    if (!g) await spol(0.5);
  }
  await spol(0.6);
  if (g) await tryk(g.k + 2, g.j);
  fundne.push((await F()).fundet.length);
}
await fase('så').catch(() => {});
await page.screenshot({ path: `${UD}/2-grenene.png` });
tjek('trin 3: grenene ind i båndene med ×30, ×300 og ×3.000 findes en ad gangen, og så kommer Så', fundne.join() === '2,3,4' && (await T(() => atomlabTest.liv.forløb.fase())) === 'så', JSON.stringify(fundne));

// Trin 4: fejlen findes i feltet uden medicin. En prik uden fejl tæller ikke
await page.click('#liv .fl-næste');
await page.waitForFunction(() => atomlabTest.liv.forløb.fase() === 'gæt', null, { timeout: 10000 });
await page.click('#liv .fl-gæt >> nth=1');
await page.waitForTimeout(300);
f = await F();
if (f.udenFejlFelt) await tryk(f.udenFejlFelt.k, f.udenFejlFelt.j);
const forkert = { fejl: (await F()).fejl, vink: await vink() };
await tryk(f.medFejlFelt.k, f.medFejlFelt.j);
await fase('så').catch(() => {});
f = await F();
await page.screenshot({ path: `${UD}/3-fejlen.png` });
tjek('trin 4: feltet uden medicin har bakterier med en fejl, en prik uden fejl giver et vink, og et tryk på en med fejlen tæller',
  f.medFejl > 0 && f.udenFejlFelt && !forkert.fejl && /ingen fejl/.test(forkert.vink) && f.fejl, JSON.stringify({ medFejl: f.medFejl, forkert, fejl: f.fejl }));

// "Det så du" og laboratoriet
await page.click('#liv .fl-næste');
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('.forløb-linje').textContent, veje: [...document.querySelectorAll('#liv .fl-vej')].map((x) => x.textContent) }));
await page.click('#liv .fl-vej >> nth=1');
await page.waitForFunction(() => atomlabTest.liv.fejlen()?.lab, null, { timeout: 10000 });
await stille();
const synlig = (sel) => T((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
const panel = await T(() => ({
  titel: document.querySelector('#livTitel').textContent, tal: document.querySelectorAll('#livTal > div').length,
  hvorfor: [...document.querySelectorAll('#livHvorfor button')].map((x) => x.dataset.hvorfor).join(), ture: document.querySelector('#livForløbFejlen .flueben').textContent,
}));
const venstre = { plade: await synlig('#livPladeIGang'), byg: await synlig('#livByg') };
tjek('"Det så du" har kernesætningen og tre veje ("Næste: Begyndelsen", Leg frit og kort 4), og "Leg frit: pladen" åbner med panelet (to tal, kort 4 og 5) og knapperne til venstre',
  slut.tekst.includes(FEJLEN.kernesætning) && slut.veje.length === 3 && /Næste: Begyndelsen/.test(slut.veje[0]) && /Leg frit: pladen/.test(slut.veje[1]) && panel.titel === 'Pladen' && panel.tal === 2
  && panel.hvorfor === 'livMenneske,livMaelk' && panel.ture === '✓' && venstre.plade && !venstre.byg, JSON.stringify({ slut, panel, venstre }));

// ★-opgaven: uden mellemtrin kommer ingen igennem
await T(() => atomlabTest.liv.pladeSpring(true));
await tryk(søjler * 0.08, søjler * 0.5);
await spol(30);
f = await F();
await page.screenshot({ path: `${UD}/4-uden-mellemtrin.png` });
const stjerne = await T(() => [...document.querySelectorAll('#livOpgaver li')].some((li) => li.classList.contains('løst') && /båndene/.test(li.textContent)));
tjek('Leg frit: uden mellemtrin fylder bakterierne feltet, ingen gren kommer igennem, og ★-opgaven er klaret', f.spring && f.andel >= 0.999 && !f.grene.length && f.stjerne && stjerne, JSON.stringify({ spring: f.spring, andel: f.andel, grene: f.grene.length, stjerne }));
await T(() => atomlabTest.liv.pladeSpring(false));

// Ingen rullebjælke i panelerne ved 1150, 820 og 560 px (med Leg frit: pladen)
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await T(() => atomlabTest.liv.pladeLab());
  await page.waitForTimeout(700);
  const r = await T(() => [...document.querySelectorAll('#liv .side-panel')].map((p) => ({ mere: p.classList.contains('mere'), rul: p.scrollHeight > p.clientHeight + 2 && getComputedStyle(p).overflowY !== 'visible' })));
  rul.push({ w, r });
}
tjek('ingen rullebjælke i Livs paneler (uden klassen "mere") ved 1150, 820 og 560 px', rul.every((x) => x.r.every((p) => p.mere || !p.rul)), JSON.stringify(rul));

// "Næste ›" før handlingen (stilguiden B2) fører hvert trin til Så
await page.setViewportSize({ width: 1024, height: 768 });
await page.click('#livPladeStop');
await T(() => atomlabTest.liv.startFejlen());
const vist = [];
for (let i = 0; i < 4; i++) {
  await page.waitForFunction(() => ['gæt', 'gør'].includes(atomlabTest.liv.forløb.fase()), null, { timeout: 10000 });
  await T(() => atomlabTest.liv.forløb.visMigNu());
  for (let t = 0; t < 12 && (await T(() => atomlabTest.liv.forløb.fase())) !== 'så'; t++) {
    await spol(1);
    await page.waitForTimeout(150);
  }
  vist.push(await T(() => atomlabTest.liv.forløb.fase()));
  if (i < 3) await page.click('#liv .fl-næste');
}
tjek('"Næste ›" før handlingen fører hvert af de fire trin helt til Så', vist.every((x) => x === 'så'), JSON.stringify(vist));
await page.click('#liv .fl-spring');

// Et skærmskift midt i turen rydder op
await page.click('#livForløbFejlen');
await page.waitForFunction(() => atomlabTest.liv.forløb.kører() === 'fejlen', null, { timeout: 20000 });
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ kører: atomlabTest.liv.forløb.kører(), plade: atomlabTest.liv.fejlen(), linje: document.querySelectorAll('.forløb-linje').length }));
tjek('et skærmskift midt i turen rydder op (ingen linje og ingen plade)', ryddet.kører === null && ryddet.plade === null && !ryddet.linje, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
