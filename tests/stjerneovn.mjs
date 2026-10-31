// Stjerneovnen: protoner, for koldt, fusion, energi, opgaver kun ved egne skud og hjælpen
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('stjerneovn');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test`);
// Rejsen ind i Solen og guiden afprøves i stjerneovn-mus og guide. Her springes de over.
await page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1 })));
await page.reload();
await page.waitForTimeout(600);
await page.click('a.kort[href="#fusion"]');
const T = (f) => page.evaluate(f);
// Vent, til ovnen er fyldt, og kameraet har zoomet på plads (til billedet)
await page.waitForFunction(() => window.atomlabTest?.fusion.partikler().length >= 38, null, { timeout: 20000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: UD + '/f1-ovn.png' });
// Ovnen starter med 40 protoner. To af dem kan nå at smelte sammen af sig selv, så vi tæller kernepartikler (nukleoner).
const nukleoner = await T(() => atomlabTest.fusion.partikler().reduce((sum, p) => sum + { p: 1, d: 2, he3: 3, he4: 4 }[p.type], 0));
tjek('40 protoner fra start (40 kernepartikler)', nukleoner === 40, nukleoner);
// For koldt: skyd proton mod proton ved 3 mio. grader
await T(() => atomlabTest.fusion.temperatur(3));
await page.click('#fusTid [data-tid="hurtig"]');
// Spol frem i stedet for at vente (testbrowseren tegner kun få billeder i sekundet)
const koldtLøst = () => Boolean(JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver?.['f-koldt']);
for (let forsøg = 0; forsøg < 2; forsøg++) {
  await T(() => { const ps = atomlabTest.fusion.partikler().filter((p) => p.type === 'p'); atomlabTest.fusion.skyd(ps[0].id, ps[1].id); });
  const løst = await page.evaluate(`(() => { const løst = ${koldtLøst}; for (let i = 0; i < 100 && !løst(); i++) atomlabTest.fusion.spolAlt(0.25); return løst(); })()`);
  if (løst) break;
}
await page.screenshot({ path: UD + '/f1b-koldt.png' });
await page.click('#fusTid [data-tid="spil"]');
let fr = await T(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}'));
tjek('opgave: for koldt', fr.opgaver?.['f-koldt'], JSON.stringify(fr));
// Varmt og hurtigt: lad reaktionerne ske af sig selv
await T(() => atomlabTest.fusion.temperatur(110));
await page.click('#fusTid [data-tid="hurtig"]');
// Før ventede testen 45 sekunder. Ved 4 billeder i sekundet svarede det til ca. 9 sekunder i ovnen.
await T(() => atomlabTest.fusion.spolAlt(15));
await page.waitForTimeout(500);
await page.screenshot({ path: UD + '/f2-varm.png' });
const energi = await T(() => atomlabTest.fusion.energi());
const typer = await T(() => { const t = {}; for (const p of atomlabTest.fusion.partikler()) t[p.type] = (t[p.type] || 0) + 1; return t; });
console.log('     energi', energi, 'kerner', JSON.stringify(typer));
tjek('der er sket fusion', energi > 0);
tjek('tempo: ⏩ er valgt (3)', await page.evaluate(() => document.querySelector('#fusTid [data-tid="hurtig"]').classList.contains('valgt') && atomlabTest.fusion.tempo() === 3));
tjek('panelet viser energi', (await page.textContent('#fusEnergi')) !== '0 MeV', await page.textContent('#fusEnergi'));
fr = await T(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}'));
tjek('tilfældige reaktioner løser ikke opgaven', !fr.opgaver?.['f-d']);
// Skyd selv protoner sammen, til der kommer deuterium
let skud = 0;
const udfald = {};
for (let forsøg = 0; forsøg < 20; forsøg++) {
  await T(() => { const ps = atomlabTest.fusion.partikler().filter((p) => p.type === 'p' && !p.kastet); if (ps.length > 1) atomlabTest.fusion.skyd(ps[0].id, ps[1].id); });
  skud++;
  await T(() => atomlabTest.fusion.spolAlt(1));
  await page.waitForTimeout(200);
  const u = await T(() => document.querySelector('.undertekst strong')?.textContent ?? '(ingen)');
  udfald[u] = (udfald[u] || 0) + 1;
  fr = await T(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}'));
  if (fr.opgaver?.['f-d']) break;
}
console.log('     skud:', skud, JSON.stringify(udfald));
tjek('opgave: deuterium (eget skud)', fr.opgaver?.['f-d']);
// Hjælpen
await page.click('#fusHjælp');
await page.waitForTimeout(400);
tjek('hjælp vises', await page.isVisible('#hjælpFusion'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
tjek('hjælp lukket med Esc', !(await page.isVisible('#hjælpFusion')));
// "Vis mig" lige efter et eget, langsomt skud: Den må ikke sigte på kernen, der stadig flyver (så stoppede den uden reaktion i ca. 2,5 % af gangene).
// 120 forsøg fanger den gamle fejl ca. 95 % af gangene.
const visMig = await page.evaluate(() => {
  const f = atomlabTest.fusion;
  let ingen = 0;
  for (let i = 0; i < 120; i++) {
    document.getElementById('fusRyd').click(); // start forfra med 40 protoner
    f.spolAlt(0.2);
    f.temperatur(1);
    const ps = f.partikler().filter((p) => p.type === 'p' && !(p.kastet > 0));
    f.skyd(ps[0].id, ps[1].id);
    f.temperatur(15);
    const før = f.energi();
    f.visMig();
    for (let t = 0; t < 30 && f.demo(); t += 0.5) f.spolAlt(0.5);
    if (f.energi() === før) ingen++;
  }
  return ingen;
});
tjek('Vis mig efter et eget skud laver en reaktion 120 af 120 gange', visMig === 0, `${visMig} uden reaktion`);
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
