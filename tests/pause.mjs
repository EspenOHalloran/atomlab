// Pause med mellemrum i Stjerneovnen, Reaktoren og Kosmos, og de nye sammenligninger
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('pause');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, [w, h, m]] of Object.entries({ pc: [1280, 800, false], tlf: [390, 844, true] })) {
  const fejl = [];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: m, isMobile: m });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (x) => { if (x.type() === 'error' || x.type() === 'warning') fejl.push(x.type() + ': ' + x.text()); });
  const T = (f, a) => page.evaluate(f, a);
  const synlig = (sel) => T((s) => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none'; }, sel);
  const tekst = (sel) => T((s) => document.querySelector(s)?.textContent ?? '', sel);
  await page.goto(`${ADRESSE}/?test#reaktor`);
  await T(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1, batteri: 1 })));
  await page.reload();
  await page.waitForTimeout(1500);

  // ---------- Reaktoren: del 1 ----------
  tjek(`${navn}: Reaktoren har en pauseknap`, (await tekst('#reaktorPause')) === '⏸ Pause');
  tjek(`${navn}: boksen "Hvor meget er 200 MeV?"`, /3 ton kul/.test(await tekst('#reaktor .højre-panel')));
  await page.locator('#reaktorPause').click();
  tjek(`${navn}: pause i Reaktoren`, await T(() => atomlabTest.reaktor.pause()));
  tjek(`${navn}: pausemærket vises i Reaktoren`, await synlig('#reaktorVindue .pause-mærke'));
  tjek(`${navn}: knappen hedder "Fortsæt"`, (await tekst('#reaktorPause')) === '▶ Fortsæt');
  await page.locator('#reaktorSkyd').click();
  await page.waitForTimeout(300);
  tjek(`${navn}: "Skyd neutron" slår pausen fra`, !(await T(() => atomlabTest.reaktor.pause())));
  await page.screenshot({ path: `${UD}/${navn}-r1.png` });

  // ---------- Reaktoren: kædereaktion ----------
  await T(() => atomlabTest.reaktor.tilstand('kæde'));
  await page.waitForTimeout(800);
  await page.locator('#reaktorStart').click();
  await T(() => atomlabTest.reaktor.spol(3));
  await page.locator('#reaktorPause').click();
  const før = await T(() => atomlabTest.reaktor.neutronPos());
  await page.waitForTimeout(1200);
  const efter = await T(() => atomlabTest.reaktor.neutronPos());
  tjek(`${navn}: neutronerne står stille under pause`, før.length > 0 && JSON.stringify(før) === JSON.stringify(efter), JSON.stringify([før, efter]));
  await T(() => { const s = document.querySelector('#reaktorStave'); s.value = 80; s.dispatchEvent(new Event('input')); });
  // Stavene glider billede for billede, og testbrowseren tegner kun få billeder i sekundet: hold øje i stedet for at vente en fast tid
  await page.waitForFunction(() => atomlabTest.reaktor.stavVist() > 0.65, null, { polling: 100, timeout: 6000 }).catch(() => {});
  tjek(`${navn}: stavene kan flyttes under pause`, (await T(() => atomlabTest.reaktor.stavVist())) > 0.65, await T(() => atomlabTest.reaktor.stavVist()));
  tjek(`${navn}: neutronerne står stadig stille`, JSON.stringify(efter) === JSON.stringify(await T(() => atomlabTest.reaktor.neutronPos())));
  tjek(`${navn}: boksen "En rigtig reaktor"`, /10\.000 ton kul/.test(await tekst('#reaktor .højre-panel')));
  await page.screenshot({ path: `${UD}/${navn}-r2.png`, fullPage: true });
  if (!m) {
    await page.mouse.click(5, 790); // flyt fokus væk fra knapperne
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    tjek(`${navn}: mellemrum slår pausen fra`, !(await T(() => atomlabTest.reaktor.pause())));
    const p1 = await T(() => atomlabTest.reaktor.neutronPos());
    await page.waitForTimeout(800);
    const p2 = await T(() => atomlabTest.reaktor.neutronPos());
    tjek(`${navn}: neutronerne bevæger sig igen`, JSON.stringify(p1) !== JSON.stringify(p2));
    await page.keyboard.press('Space');
    tjek(`${navn}: mellemrum sætter på pause`, await T(() => atomlabTest.reaktor.pause()));
  }
  await T(() => atomlabTest.reaktor.tilstand('kerne'));
  await page.waitForTimeout(300);
  tjek(`${navn}: skift til del 1 slår pausen fra`, !(await T(() => atomlabTest.reaktor.pause())));

  // ---------- Batteriet ----------
  await page.goto(`${ADRESSE}/?test#batteri`);
  await page.waitForTimeout(1500);
  tjek(`${navn}: Batteriet: mobil og elbil`, /3\.000-4\.000 mobilopladninger/.test(await tekst('#batteri .højre-panel')) && /30 gram kul/.test(await tekst('#batteri .højre-panel')));
  await page.screenshot({ path: `${UD}/${navn}-b.png`, fullPage: true });

  // ---------- Kosmos ----------
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForTimeout(1500);
  await T(() => atomlabTest.kosmos.vælg('supernova'));
  await page.waitForTimeout(800);
  tjek(`${navn}: Kosmos har en pauseknap`, (await tekst('#kosmosPause')) === '⏸ Pause');
  await page.locator('#kosmosPause').click();
  const t1 = await T(() => atomlabTest.kosmos.tid());
  const s1 = await T(() => atomlabTest.kosmos.stjerneTid());
  await page.waitForTimeout(1200);
  const t2 = await T(() => atomlabTest.kosmos.tid());
  const s2 = await T(() => atomlabTest.kosmos.stjerneTid());
  tjek(`${navn}: Kosmos-uret står stille under pause`, t1 === t2, `${t1} ${t2}`);
  tjek(`${navn}: stjernens overflade står stille under pause`, s1 != null && s1 === s2, `${s1} ${s2}`);
  tjek(`${navn}: pausemærket vises i Kosmos`, await synlig('#kosmosVindue .pause-mærke'));
  await page.screenshot({ path: `${UD}/${navn}-k.png`, fullPage: true });
  const knapper = await T(() => atomlabTest.kosmos.knapper());
  const i = knapper.findIndex((k) => /Eksplod/i.test(k ?? ''));
  if (i >= 0) {
    await page.locator('#kosmosStyring .kosmos-knap').filter({ hasText: /eksplod/i }).click();
    await page.waitForTimeout(300);
    tjek(`${navn}: "Lad stjernen eksplodere" slår pausen fra`, !(await T(() => atomlabTest.kosmos.pause())));
  } else tjek(`${navn}: fandt knappen "Eksplodér"`, false, JSON.stringify(knapper));
  await page.locator('#kosmosPause').click();
  await T(() => atomlabTest.kosmos.vælg('pulsar'));
  tjek(`${navn}: skift af fænomen slår pausen fra`, !(await T(() => atomlabTest.kosmos.pause())));
  const t3 = await T(() => atomlabTest.kosmos.tid());
  // Hold øje med uret i stedet for at vente en fast tid (når maskinen er travl, kan det første billede tage over 0,8 sekund)
  const gårIgen = await page.waitForFunction((t) => atomlabTest.kosmos.tid() > t, t3, { timeout: 8000 }).then(() => true, () => false);
  tjek(`${navn}: Kosmos-uret går igen`, gårIgen);

  // ---------- Stjerneovnen: "Vis mig" slår pausen fra ----------
  await page.goto(`${ADRESSE}/?test#fusion`);
  await page.waitForTimeout(1500);
  await page.locator('#fusPause').click();
  await page.locator('#fusVisMig').click();
  await page.waitForTimeout(300);
  tjek(`${navn}: "Vis mig" slår pausen fra i Stjerneovnen`, !(await T(() => atomlabTest.fusion.pause())));

  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await ctx.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
await b.close();
process.exit(dårlig ? 1 : 0);
