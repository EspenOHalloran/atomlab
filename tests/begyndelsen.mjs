// Liv L5: delen "Begyndelsen" (drejebogen i docs/drejebog-liv.md, afsnit 4). Teksterne holder skabelonens grænser og
// lagenes budget, de fire kort og de to ord findes, gåden og tur 4 peger hertil, delen åbner fra menuen, turen starter
// første gang, lynet giver vandet farve, den nye luft får kalk, boblerne samler sig, kopien får en fejl, det øverste trin
// kan ikke nås, "Det så du" har kernesætningen og tre veje, laboratoriet virker bagefter, "Næste ›" før handlingen fører
// hvert trin til Så, et skærmskift rydder op, og panelerne får ingen rullebjælke ved 1150, 820 og 560 px.
import { readFileSync } from 'node:fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { BEGYNDELSEN } from '../js/data/forloeb/begyndelsen.js';
import { TRAPPEN, KOLBE_PANEL, BOBLE_PANEL, RNA_PANEL, TRAPPE_PANEL, BEG_KORT, kolbeFarve, lavRnaKopi } from '../js/data/liv/begyndelsen.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { FORLØB } from '../js/data/forloeb/liste.js';
import { GÅDER } from '../js/data/gaader.js';
import { SKÆRME } from '../js/skaerme.js';
const UD = billedmappe('begyndelsen');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne (Node) ----------
const antalOrd = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const sætninger = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;
const lange = BEGYNDELSEN.trin.filter((t) => antalOrd(t.spørg) > 16 || antalOrd(t.så) > 22 || (t.ord ?? []).length > 2);
const uden = BEGYNDELSEN.trin.flatMap((t) => t.ord ?? []).filter((id) => !ORDBOG.some((o) => o.id === id));
const paneler = [...Object.values(KOLBE_PANEL), BOBLE_PANEL, RNA_PANEL, TRAPPE_PANEL, ...TRAPPEN];
const forLange = paneler.filter((p) => sætninger(p.tekst) > 3 || (p.tal ?? []).length > 2);
const fejlenKilde = readFileSync(new URL('../js/liv-fejlen.js', import.meta.url), 'utf8');
const fejlenVeje = fejlenKilde.slice(fejlenKilde.indexOf('veje: ['), fejlenKilde.indexOf('],', fejlenKilde.indexOf('veje: [')));
tjek('teksterne: fem trin inden for skabelonens grænser, mindst to gæt med svar, panelerne har højst to tal og tre sætninger, de fire kort, hinde og RNA i Ordbogen, turen i listen, delen i SKÆRME, og gåden og tur 4 peger hertil',
  BEGYNDELSEN.trin.length === 5 && !lange.length && !uden.length && BEGYNDELSEN.trin.filter((t) => t.gæt?.valg.every((v) => v.svar)).length >= 2
  && !forLange.length && BEG_KORT.length <= 4 && BEG_KORT.every((id) => HVORFOR[id]?.svar) && ORDBOG.some((o) => o.id === 'hinde') && ORDBOG.some((o) => o.id === 'rna')
  && FORLØB.includes(BEGYNDELSEN) && SKÆRME.some((s) => s.id === 'begyndelsen' && s.verden === 'liv')
  && GÅDER.find((g) => g.id === 'begyndelsen').seDet[0] === 'begyndelsen' && /Næste: Begyndelsen/.test(fejlenVeje) && (fejlenVeje.match(/tekst:/g) ?? []).length <= 3,
  JSON.stringify({ lange: lange.map((t) => t.id), uden, forLange: forLange.map((p) => p.titel ?? p.navn) }));
const kopi = lavRnaKopi(undefined, { fejl: 7 });
tjek('modellen: uden kalk giver den nye luft kun svag farve, med kalk fuld, og turens kopi har præcis én fejl (bogstav 8)',
  kolbeFarve('co2', false, 3) < 0.3 && kolbeFarve('co2', true, 3) === 1 && kolbeFarve('miller', false, 3) === 1 && kopi.filter((k) => k.fejl).length === 1 && kopi[7].fejl);

// ---------- I browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);
const B = () => T(() => atomlabTest.begyndelsen);
const fase = (f) => page.waitForFunction((x) => atomlabTest.begyndelsen.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const spol = (sek) => T((x) => atomlabTest.begyndelsen.spol(x), sek);
const næste = () => page.click('#begyndelsen .fl-næste');

await page.goto(`${ADRESSE}/?test&forloebstart#`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.aktiv?.() === 'menu', null, { timeout: 20000 });
const link = await T(() => Boolean(document.querySelector('.verden[data-verden="liv"] a.verden-knap[href="#begyndelsen"]')));
// Er Liv ikke forrest i ringen, drejer det første tryk den frem, og det næste åbner delen
for (let i = 0; i < 4 && (await T(() => location.hash)) !== '#begyndelsen'; i++) {
  await T(() => document.querySelector('a[href="#begyndelsen"]').click());
  await page.waitForTimeout(1500);
}
await page.waitForFunction(() => atomlabTest.aktiv() === 'begyndelsen' && atomlabTest.begyndelsen, null, { timeout: 20000 });
await page.waitForFunction(() => atomlabTest.begyndelsen.forløb.kører() === 'begyndelsen', null, { timeout: 20000 });
tjek('delen er en knap i Livs kort i menuen, åbner derfra, og turen starter af sig selv første gang', link && (await T(() => atomlabTest.begyndelsen.synlig() && atomlabTest.begyndelsen.vist() === 'kolbe')));

// Trin 1: tre lyn giver vandet farve
await page.click('#begyndelsen .fl-gæt >> nth=2');
for (let i = 0; i < 3; i++) await page.click('#begyndelsen .fl-handling[data-knap="lyn"]');
await spol(2);
await fase('så');
let k = await T(() => atomlabTest.begyndelsen.kolbe());
const svar1 = await T(() => document.querySelector('#begyndelsen .fl-svar')?.textContent ?? '');
await page.screenshot({ path: `${UD}/1-kolben.png` });
tjek('trin 1: tre lyn giver vandet farve, og gættet får sit svar', k.lyn === 3 && k.farve > 0.9 && k.luft === 'miller' && /nye måder/.test(svar1), JSON.stringify({ k, svar1 }));

// Trin 2: den nye luft med kalk
await næste();
await page.waitForFunction(() => ['gæt', 'gør'].includes(atomlabTest.begyndelsen.forløb.fase()), null, { timeout: 10000 });
const førSkift = await T(() => document.querySelector('#begyndelsen .fl-handling[data-knap="lyn"]').disabled);
await page.click('#begyndelsen .fl-handling[data-knap="luft"]');
for (let i = 0; i < 3; i++) await page.click('#begyndelsen .fl-handling[data-knap="lyn"]');
await spol(2);
await fase('så');
k = await T(() => atomlabTest.begyndelsen.kolbe());
tjek('trin 2: lynet venter, til luften er skiftet, og den nye luft med kalk giver farve', førSkift && k.luft === 'co2' && k.kalk && k.kalkVist && k.farve > 0.9, JSON.stringify({ førSkift, k }));

// Trin 3: boblerne
await næste();
await page.waitForFunction(() => atomlabTest.begyndelsen.vist() === 'hinde', null, { timeout: 10000 });
await page.click('#begyndelsen .fl-handling[data-knap="dryp"]');
await spol(6);
await fase('så');
await page.screenshot({ path: `${UD}/2-boblerne.png` });
tjek('trin 3: fedtstoffet samler sig til bobler', (await T(() => atomlabTest.begyndelsen.hinde().fase)) === 'samlet');

// Trin 4: RNA'et kopierer med én fejl
await næste();
await page.waitForFunction(() => atomlabTest.begyndelsen.vist() === 'rna', null, { timeout: 10000 });
await page.click('#begyndelsen .fl-handling[data-knap="kopier"]');
await spol(3.6);
await page.waitForTimeout(400);
const vink4 = await T(() => document.querySelector('#begyndelsen .fl-vink')?.textContent ?? '');
await spol(5);
await fase('så');
const r = await T(() => atomlabTest.begyndelsen.rna());
await page.screenshot({ path: `${UD}/3-rna.png` });
tjek('trin 4: kopien bliver bygget med én fejl, og linjen siger, hvilket bogstav der er forkert', r.færdig && r.bygget === 12 && r.fejl === 1 && /Bogstav 8/.test(vink4), JSON.stringify({ r, vink4 }));

// Trin 5: det øverste trin kan ikke nås
await næste();
await page.waitForFunction(() => atomlabTest.begyndelsen.vist() === 'trappe', null, { timeout: 10000 });
await page.click('#begyndelsen .fl-handling[data-knap="top"]');
await spol(1);
const undervejs = await T(() => atomlabTest.begyndelsen.trappe());
await spol(3);
await fase('så');
const tr = await T(() => atomlabTest.begyndelsen.trappe());
await page.screenshot({ path: `${UD}/4-trappen.png` });
tjek('trin 5: det øverste trin bliver prøvet, men aldrig nået', undervejs.prøver && !undervejs.topNået && tr.forsøg === 1 && !tr.prøver && !tr.topNået, JSON.stringify({ undervejs, tr }));

// "Det så du" og laboratoriet
await næste();
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('.forløb-linje').textContent, veje: [...document.querySelectorAll('#begyndelsen .fl-vej')].map((x) => x.textContent) }));
await page.click('#begyndelsen .fl-vej >> nth=0');
await page.waitForFunction(() => !atomlabTest.begyndelsen.forløb.kører(), null, { timeout: 10000 });
await page.waitForTimeout(1300);
await T(() => atomlabTest.begyndelsen.vælgScene('kolbe'));
await page.click('[data-beg-luft="miller"]'); // (Millers luft har ingen kalk)
await page.click('[data-beg-luft="co2"]');
for (let i = 0; i < 3; i++) await page.click('#begLyn');
await spol(2);
const udenKalk = await T(() => atomlabTest.begyndelsen.kolbe());
await page.click('#begKalk');
for (let i = 0; i < 3; i++) await page.click('#begLyn');
await spol(2);
const medKalk = await T(() => atomlabTest.begyndelsen.kolbe());
const panel = await T(() => ({ titel: document.getElementById('begTitel').textContent, tal: document.querySelectorAll('#begTal > div').length, kort: [...document.querySelectorAll('#begHvorfor button')].map((x) => x.dataset.hvorfor).join() }));
await page.screenshot({ path: `${UD}/5-laboratoriet.png` });
tjek('"Det så du" har kernesætningen og tre veje, og i laboratoriet giver den nye luft kun svag farve uden kalk og fuld med (panelet har to tal og de fire kort)',
  slut.tekst.includes(BEGYNDELSEN.kernesætning) && slut.veje.length === 3 && /Leg frit/.test(slut.veje[0]) && udenKalk.farve < 0.3 && medKalk.kalk && medKalk.farve > 0.9
  && panel.titel === KOLBE_PANEL.kalk.titel && panel.tal === 2 && panel.kort === BEG_KORT.join(), JSON.stringify({ slut, udenKalk, medKalk, panel }));

// Trappen i laboratoriet: et trin viser sit forsøg
await page.click('[data-beg-scene="trappe"]');
await page.waitForFunction(() => atomlabTest.begyndelsen.vist() === 'trappe', null, { timeout: 10000 });
await T(() => atomlabTest.begyndelsen.vælgTrin(2));
const trinPanel = await T(() => ({ titel: document.getElementById('begTitel').textContent, tal: document.getElementById('begTal').textContent }));
tjek('på trappen viser et trin sit forsøg med årstal og hvem', trinPanel.titel === 'Kæder' && /1996/.test(trinPanel.tal) && /Ferris/.test(trinPanel.tal), JSON.stringify(trinPanel));

// Ingen rullebjælke i panelerne
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const s of ['kolbe', 'trappe']) {
    await T((x) => atomlabTest.begyndelsen.vælgScene(x), s);
    await page.waitForTimeout(500);
    const p = await T(() => [...document.querySelectorAll('#begyndelsen .side-panel')].map((e) => ({ mere: e.classList.contains('mere'), rul: e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible' })));
    rul.push({ w, s, p });
  }
}
tjek('ingen rullebjælke i panelerne (uden klassen "mere") ved 1150, 820 og 560 px', rul.every((x) => x.p.every((p) => p.mere || !p.rul)), JSON.stringify(rul));

// "Næste ›" før handlingen fører hvert trin til Så
await page.setViewportSize({ width: 1024, height: 768 });
await T(() => atomlabTest.begyndelsen.startTur());
const vist = [];
for (let i = 0; i < 5; i++) {
  await page.waitForFunction(() => ['gæt', 'gør'].includes(atomlabTest.begyndelsen.forløb.fase()), null, { timeout: 10000 });
  await page.waitForTimeout(400);
  await T(() => atomlabTest.begyndelsen.forløb.visMigNu());
  for (let t = 0; t < 14 && (await T(() => atomlabTest.begyndelsen.forløb.fase())) !== 'så'; t++) {
    await spol(1);
    await page.waitForTimeout(200);
  }
  vist.push(await T(() => atomlabTest.begyndelsen.forløb.fase()));
  if (i < 4) await næste();
}
tjek('"Næste ›" før handlingen fører hvert af de fem trin helt til Så', vist.every((x) => x === 'så'), JSON.stringify(vist));

// Et skærmskift midt i turen rydder op
await T(() => atomlabTest.begyndelsen.startTur());
await page.waitForFunction(() => atomlabTest.begyndelsen.forløb.kører() === 'begyndelsen', null, { timeout: 10000 });
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
const ryddet = await T(() => ({ kører: atomlabTest.begyndelsen.forløb.kører(), synlig: atomlabTest.begyndelsen.synlig(), opdateres: atomlabTest.begyndelsen.opdateres(), linje: document.querySelectorAll('.forløb-linje').length }));
tjek('et skærmskift midt i turen rydder op (ingen linje, scenen skjult og ikke opdateret)', !ryddet.kører && !ryddet.synlig && !ryddet.opdateres && !ryddet.linje, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
