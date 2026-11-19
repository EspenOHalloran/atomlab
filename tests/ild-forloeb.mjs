// Ild, turen "Hvad brænder egentlig?" (forløb 1, drejebogen i docs/drejebog-ild.md, afsnit 3): teksterne holder
// skabelonens grænser og ordene står i Ordbogen, turen starter første gang med linket til "Når atomer mødes", trin 1
// (lyset pustes ud, tændstikken i røgen tænder det gennem røgen, og et tryk på vægen giver et vink), trin 2 (skeen dugger),
// trin 3 (luppen: 12 atomer før og efter, tælleren), trin 4 (kredsløbet og pustet), "Det så du" med kernesætningen og
// tre veje, ✓ i "Din fremgang", "Næste ›" før handlingen fører hvert trin til Så, og et skærmskift rydder op.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { ILD_1 } from '../js/data/forloeb/ild.js';
import { FORLØB } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { HVORFOR } from '../js/data/hvorfor.js';
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne (Node) ----------
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const lange = ILD_1.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const ider = new Set(ORDBOG.map((o) => o.id));
const mangler = ILD_1.trin.flatMap((t) => t.ord ?? []).filter((id) => !ider.has(id));
tjek('teksterne: 4 trin og "Det så du", Spørg ≤ ca. 15 ord, Så ≤ ca. 20 ord, højst to fagord (i Ordbogen), gæt med svar, kernesætningen siger "bytter partnere", og kortet til vej 2 findes',
  ILD_1.trin.length === 4 && !lange.length && !mangler.length && ILD_1.trin.filter((t) => t.gæt?.valg.every((v) => v.svar)).length === 3
  && /bytter partnere/.test(ILD_1.kernesætning) && FORLØB.includes(ILD_1) && HVORFOR.ildGul?.svar && ILD_1.før?.id === 'molekyler',
  JSON.stringify({ lange: lange.map((t) => t.id), mangler }));

// ---------- I browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);
const fase = (f) => page.waitForFunction((x) => atomlabTest.ild.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const spol = (sek) => T((x) => atomlabTest.ild.spol(x), sek);
const næste = () => page.click('#ild .fl-næste');

await page.goto(`${ADRESSE}/?test&forloebstart#ild`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.ild?.forløb.kører() === 'ild', null, { timeout: 20000 });
const førLink = await T(() => Boolean(document.querySelector('#ild .fl-før')));
const paneler = await T(() => [...document.querySelectorAll('#ild .side-panel')].every((e) => e.offsetParent === null || getComputedStyle(e).display === 'none' || getComputedStyle(e).visibility === 'hidden'));
tjek('turen starter af sig selv første gang, med linket til "Når atomer mødes" og uden panelerne', førLink && paneler, JSON.stringify({ førLink, paneler }));

// Trin 1: lyset pustes ud, et tryk på vægen giver et vink, og tændstikken i røgen tænder lyset gennem røgen
await page.click('#ild .fl-gæt >> nth=1');
// Lyset bliver pustet ud efter ca. 1,8 s (en timer), og pustet spoles frem
await page.waitForFunction(() => atomlabTest.ild.tilstand().hændelse === 'pust', null, { timeout: 10000, polling: 100 });
await spol(1);
const pustet = await T(() => atomlabTest.ild.tilstand());
await T(() => { const a = atomlabTest.ild; const v = a.vægen(); a.flytVærktøj(v[0], v[1] + 0.05); a.spol(0.3); a.flytVærktøj(2.7, 1.4); });
const vink = await T(() => document.querySelector('#ild .fl-vink')?.textContent ?? '');
// Lyset pustes ud igen efter 1,4 s
await page.waitForFunction(() => !atomlabTest.ild.tilstand().lysBrænder || (atomlabTest.ild.spol(0.1), false), null, { timeout: 10000, polling: 200 });
await spol(0.6);
await T(() => { const a = atomlabTest.ild; const v = a.vægen(); a.flytVærktøj(v[0], v[1] + 1.6); a.spol(1.2); });
await fase('så');
const så1 = await T(() => ({ t: atomlabTest.ild.tilstand(), linje: document.querySelector('#ild .forløb-linje').textContent }));
tjek('trin 1: lyset pustes ud med røg, et tryk på vægen giver vinket, og tændstikken i røgen tænder lyset gennem røgen',
  !pustet.lysBrænder && pustet.røg > 3 && pustet.værktøj === 'tændstik' && /uden at røre vægen/.test(vink) && så1.t.lysBrænder && så1.t.hændelse === 'gennemRøgen' && /dampen, der brænder/.test(så1.linje),
  JSON.stringify({ pustet, vink, hændelse: så1.t.hændelse }));

// Trin 2: skeen dugger over flammen
await næste();
await page.waitForFunction(() => atomlabTest.ild.trin() === 'ske', null, { timeout: 10000 });
await page.click('#ild .fl-gæt >> nth=1');
await T(() => { const a = atomlabTest.ild; a.flytVærktøj(0, 3.6); a.spol(1.2); });
await fase('så');
const ske = await T(() => atomlabTest.ild.tilstand().ske);
tjek('trin 2: den kolde ske over flammen dugger', ske.dug > 0.6 && ske.zone === 'over', JSON.stringify(ske));

// Trin 3: luppen, tre O₂ og tælleren
await næste();
await page.waitForFunction(() => atomlabTest.ild.trin() === 'atomer' && atomlabTest.ild.tilstand().scene === 'atomer', null, { timeout: 10000 });
const førTæller = await T(() => atomlabTest.ild.tæller());
for (let i = 0; i < 3; i++) await T(() => { atomlabTest.ild.atomer.lægNæste(); atomlabTest.ild.spol(1); });
await spol(2.5);
await fase('så');
const efter = await T(() => ({ m: atomlabTest.ild.atomer.molekyler(), tæller: atomlabTest.ild.tæller(), ord: [...document.querySelectorAll('#ild .forløb-linje [data-ord], #ild .forløb-linje .ord')].length }));
tjek('trin 3: i luppen bliver det til 2 CO₂ og 2 H₂O, og tælleren viser 2 kulstof, 4 hydrogen og 6 oxygen før og efter',
  /Før: 2 kulstof · 4 hydrogen · 6 oxygen/.test(førTæller) && !/Efter/.test(førTæller) && efter.m.sort().join() === 'co2,co2,vand,vand' && (efter.tæller.match(/2 kulstof · 4 hydrogen · 6 oxygen/g) ?? []).length === 2,
  JSON.stringify({ førTæller, efter }));

// Trin 4: tilbage ved bordet med kredsløbet, og pustet slukker lyset
await næste();
await page.waitForFunction(() => atomlabTest.ild.trin() === 'pust' && atomlabTest.ild.tilstand().scene === 'bord', null, { timeout: 10000 });
await page.waitForTimeout(400);
const kreds = await T(() => ({ k: atomlabTest.ild.kredsløb(), lys: atomlabTest.ild.tilstand().lysBrænder }));
await page.click('#ild .fl-gæt >> nth=1');
await page.click('#ild .fl-handling[data-knap="pust"]');
await spol(1);
await fase('så');
const pust = await T(() => atomlabTest.ild.tilstand());
tjek('trin 4: kredsløbet vises ved et tændt lys, og pustet slukker lyset med røg', kreds.k && kreds.lys && !pust.lysBrænder && pust.røg > 3, JSON.stringify({ kreds, pust: { lys: pust.lysBrænder, røg: pust.røg } }));

// "Det så du"
await næste();
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('#ild .forløb-linje').textContent, veje: document.querySelectorAll('#ild .fl-vej').length }));
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const fremgang = await T(() => document.querySelector('#menu a[href="#ild"]')?.classList.contains('klaret'));
tjek('"Det så du" har kernesætningen, regnskabet og tre veje, og Ild får ✓ i menuen bagefter',
  slut.tekst.includes('bytter partnere') && /300 gram CO₂/.test(slut.tekst) && slut.veje === 3 && fremgang, JSON.stringify({ slut, fremgang }));

// "Næste ›" før handlingen fører hvert trin til Så
await T(() => { location.hash = '#ild'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'ild', null, { timeout: 20000 });
await T(() => atomlabTest.ild.startTur());
const vist = [];
for (let i = 0; i < 4; i++) {
  await page.waitForFunction(() => ['gæt', 'gør'].includes(atomlabTest.ild.forløb.fase()), null, { timeout: 10000 });
  await page.waitForTimeout(TONING_MS(i));
  await T(() => atomlabTest.ild.forløb.visMigNu());
  for (let t = 0; t < 16 && (await T(() => atomlabTest.ild.forløb.fase())) !== 'så'; t++) {
    await spol(0.5);
    await page.waitForTimeout(200);
  }
  vist.push(await T(() => atomlabTest.ild.forløb.fase()));
  if (i < 3) await næste();
}
function TONING_MS(i) { return i === 0 ? 2400 : 700; } // trin 1: lyset skal først pustes ud
tjek('"Næste ›" før handlingen fører hvert af de fire trin helt til Så', vist.every((x) => x === 'så'), JSON.stringify(vist));

// Et skærmskift midt i turen rydder op
await T(() => atomlabTest.ild.startTur());
await page.waitForFunction(() => atomlabTest.ild.forløb.kører() === 'ild', null, { timeout: 10000 });
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ kører: atomlabTest.ild.forløb.kører(), trin: atomlabTest.ild.trin(), synlig: atomlabTest.ild.tilstand().synlig, opdateres: atomlabTest.ild.opdateres(), linje: document.querySelectorAll('.forløb-linje').length }));
tjek('et skærmskift midt i turen rydder op (ingen linje, intet trin, bordet skjult og ikke opdateret)', !ryddet.kører && !ryddet.trin && !ryddet.synlig && !ryddet.opdateres && !ryddet.linje, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
