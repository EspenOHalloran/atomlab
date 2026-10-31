// Tidsknappen (⏸ ▶ og ⏩) og mellemrum i Stjerneovnen og Reaktoren (U4 i docs/plan-ux.md) og i Kosmos (U2), og de nye
// sammenligninger
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
  const iVindue = (sel, vindue) => T(([s, v]) => { const a = document.querySelector(s)?.getBoundingClientRect(), b = document.querySelector(v).getBoundingClientRect(); return Boolean(a?.width) && a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1; }, [sel, vindue]);
  tjek(`${navn}: Reaktoren har tidsknappen (⏸ og ▶, ingen ▷ og ⏩)`, await synlig('#reaktorTid [data-tid="pause"]') && await synlig('#reaktorTid [data-tid="spil"]') && !(await synlig('#reaktorTid [data-tid="hurtig"]')) && !(await synlig('#reaktorTid [data-tid="langsom"]')));
  tjek(`${navn}: tidsknappen står i 3D-billedet`, await iVindue('#reaktorTid', '#reaktorVindue'));
  tjek(`${navn}: den gamle pauseknap er væk`, !(await page.$('#reaktorPause')) && !(await page.$('.pause-mærke')));
  tjek(`${navn}: boksen "Hvor meget er 200 MeV?"`, /3 ton kul/.test(await tekst('#reaktor .højre-panel')));
  await page.locator('#reaktorTid [data-tid="pause"]').click();
  tjek(`${navn}: pause i Reaktoren`, await T(() => atomlabTest.reaktor.pause() && atomlabTest.reaktor.tidsknap() === 'pause'));
  tjek(`${navn}: ⏸ er valgt`, await T(() => document.querySelector('#reaktorTid [data-tid="pause"]').classList.contains('valgt')));
  await page.locator('#reaktorSkyd').click();
  await page.waitForTimeout(300);
  tjek(`${navn}: "Skyd neutron" slår pausen fra`, !(await T(() => atomlabTest.reaktor.pause())) && (await T(() => atomlabTest.reaktor.tidsknap())) === 'spil');
  // "Vis mig" lader tiden gå og kører stadig i slowmotion
  await T(() => atomlabTest.reaktor.spol(8));
  await page.locator('#reaktorTid [data-tid="pause"]').click();
  await T(() => atomlabTest.reaktor.visMig());
  const vis = await T(() => ({ pause: atomlabTest.reaktor.pause(), ...atomlabTest.reaktor.visning() }));
  tjek(`${navn}: "Vis mig" i Reaktoren slår pausen fra og kører i slowmotion`, !vis.pause && vis.tidsFaktor < 1, JSON.stringify(vis));
  await T(() => atomlabTest.reaktor.spol(15));
  // Vandet er en kontakt
  const vand = () => T(() => { const k = document.querySelector('#reaktorVand'); return { rolle: k.getAttribute('role'), til: k.getAttribute('aria-checked'), tekst: k.textContent.trim(), fyldt: k.classList.contains('til') }; });
  await page.screenshot({ path: `${UD}/${navn}-r1.png` });

  // ---------- Reaktoren: kædereaktion ----------
  await T(() => atomlabTest.reaktor.tilstand('kæde'));
  await page.waitForTimeout(800);
  const v1 = await vand();
  tjek(`${navn}: "Vand (moderator)" er en kontakt, der er tændt`, v1.rolle === 'switch' && v1.til === 'true' && v1.fyldt && v1.tekst === 'Vand (moderator)', JSON.stringify(v1));
  await page.locator('#reaktorVand').click();
  const v2 = await vand();
  tjek(`${navn}: vandet slukkes (samme navn, uden ✓)`, v2.til === 'false' && !v2.fyldt && v2.tekst === 'Vand (moderator)', JSON.stringify(v2));
  await page.locator('#reaktorVand').click();
  tjek(`${navn}: vandet tændes igen`, (await vand()).til === 'true');
  await page.locator('#reaktorStart').click();
  await T(() => atomlabTest.reaktor.spol(3));
  await page.locator('#reaktorTid [data-tid="pause"]').click();
  await page.locator('#reaktorTid [data-tid="spil"]').click();
  tjek(`${navn}: ▶ lader tiden gå igen`, !(await T(() => atomlabTest.reaktor.pause())));
  await page.locator('#reaktorTid [data-tid="pause"]').click();
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
  tjek(`${navn}: Kosmos har tidsknappen (⏸ og ▶, ingen ⏩ ved supernovaen)`, await synlig('#kosmosTid button[data-tid="pause"]') && await synlig('#kosmosTid button[data-tid="spil"]') && !(await synlig('#kosmosTid button[data-tid="hurtig"]')));
  tjek(`${navn}: ▶ er valgt fra start`, await T(() => document.querySelector('#kosmosTid button[data-tid="spil"]').classList.contains('valgt')));
  await page.locator('#kosmosTid button[data-tid="pause"]').click();
  const t1 = await T(() => atomlabTest.kosmos.tid());
  const s1 = await T(() => atomlabTest.kosmos.stjerneTid());
  await page.waitForTimeout(1200);
  const t2 = await T(() => atomlabTest.kosmos.tid());
  const s2 = await T(() => atomlabTest.kosmos.stjerneTid());
  tjek(`${navn}: Kosmos-uret står stille under pause`, t1 === t2, `${t1} ${t2}`);
  tjek(`${navn}: stjernens overflade står stille under pause`, s1 != null && s1 === s2, `${s1} ${s2}`);
  tjek(`${navn}: ⏸ er valgt i tidsknappen`, await T(() => document.querySelector('#kosmosTid button[data-tid="pause"]').classList.contains('valgt') && atomlabTest.kosmos.tidsknap() === 'pause'));
  await page.screenshot({ path: `${UD}/${navn}-k.png`, fullPage: true });
  const knapper = await T(() => atomlabTest.kosmos.knapper());
  if (knapper.some((k) => /eksplod/i.test(k))) {
    await page.locator('#kosmosBjælke button').filter({ hasText: /eksplod/i }).click();
    await page.waitForTimeout(300);
    tjek(`${navn}: "Lad stjernen eksplodere" slår pausen fra`, !(await T(() => atomlabTest.kosmos.pause())));
  } else tjek(`${navn}: fandt knappen "Eksplodér" i bjælken`, false, JSON.stringify(knapper));
  if (!m) {
    // Mellemrum skifter mellem ⏸ og ▶ (ikke når fokus står på en knap)
    await page.mouse.click(640, 400);
    await page.keyboard.press('Space');
    tjek(`${navn}: mellemrum sætter Kosmos på pause`, await T(() => atomlabTest.kosmos.tidsknap() === 'pause'));
    await page.keyboard.press('Space');
    tjek(`${navn}: mellemrum lader tiden gå igen`, await T(() => atomlabTest.kosmos.tidsknap() === 'spil'));
  }
  await page.locator('#kosmosTid button[data-tid="pause"]').click();
  await T(() => atomlabTest.kosmos.vælg('pulsar'));
  tjek(`${navn}: skift af fænomen slår pausen fra`, !(await T(() => atomlabTest.kosmos.pause())));
  const t3 = await T(() => atomlabTest.kosmos.tid());
  // Hold øje med uret i stedet for at vente en fast tid (når maskinen er travl, kan det første billede tage over 0,8 sekund)
  const gårIgen = await page.waitForFunction((t) => atomlabTest.kosmos.tid() > t, t3, { timeout: 8000 }).then(() => true, () => false);
  tjek(`${navn}: Kosmos-uret går igen`, gårIgen);

  // ---------- Stjerneovnen: tidsknappen med ⏸ ▷ ▶ ⏩ ----------
  await page.goto(`${ADRESSE}/?test#fusion`);
  await page.waitForFunction(() => window.atomlabTest?.fusion.partikler().length >= 38, null, { timeout: 20000 });
  await page.waitForTimeout(800);
  const F = () => T(() => ({ tid: atomlabTest.fusion.tidsknap(), tempo: atomlabTest.fusion.tempo(), pause: atomlabTest.fusion.pause() }));
  tjek(`${navn}: Stjerneovnen har tidsknappen med fire knapper`, (await T(() => [...document.querySelectorAll('#fusTid button')].filter((b) => !b.hidden).map((b) => b.dataset.tid).join(' '))) === 'pause langsom spil hurtig');
  tjek(`${navn}: tidsknappen står i 3D-billedet`, await iVindue('#fusTid', '#fusionVindue'));
  tjek(`${navn}: de gamle knapper er væk (Pause og Langsom, Normal og Hurtig)`, !(await page.$('#fusPause')) && !(await page.$('[data-fus-tempo]')));
  let f = await F();
  tjek(`${navn}: ▶ er normal (0,6) fra start`, f.tid === 'spil' && f.tempo === 0.6, JSON.stringify(f));
  await page.locator('#fusTid [data-tid="langsom"]').click();
  f = await F();
  tjek(`${navn}: ▷ er langsom (0,3)`, f.tid === 'langsom' && f.tempo === 0.3, JSON.stringify(f));
  await page.locator('#fusTid [data-tid="hurtig"]').click();
  f = await F();
  tjek(`${navn}: ⏩ er hurtig (3)`, f.tid === 'hurtig' && f.tempo === 3, JSON.stringify(f));
  await page.locator('#fusTid [data-tid="pause"]').click();
  f = await F();
  tjek(`${navn}: ⏸ stopper tiden og husker tempoet`, f.pause && f.tempo === 3, JSON.stringify(f));
  const pladser = () => T(() => JSON.stringify(atomlabTest.fusion.partikler().slice(0, 8).map((p) => p.pos)));
  const pos0 = await pladser();
  await page.waitForTimeout(800);
  tjek(`${navn}: kernerne står stille under pause`, pos0 === (await pladser()));
  if (!m) {
    await page.mouse.click(5, 790); // flyt fokus væk fra knapperne
    await page.keyboard.press('Space');
    f = await F();
    tjek(`${navn}: mellemrum går tilbage til ⏩`, f.tid === 'hurtig' && f.tempo === 3, JSON.stringify(f));
    await page.keyboard.press('Space');
    tjek(`${navn}: mellemrum sætter Stjerneovnen på pause`, (await F()).pause);
    await page.keyboard.press('Space');
  }
  await page.locator('#fusTid [data-tid="spil"]').click();
  // Et skud lader tiden gå igen
  await page.locator('#fusTid [data-tid="pause"]').click();
  await T(() => { const ps = atomlabTest.fusion.partikler().filter((p) => p.type === 'p' && !p.kastet); atomlabTest.fusion.skyd(ps[0].id, ps[1].id); });
  f = await F();
  tjek(`${navn}: et skud slår pausen fra i Stjerneovnen`, !f.pause && f.tid === 'spil', JSON.stringify(f));
  await T(() => atomlabTest.fusion.spolAlt(6));
  // "Vis mig" slår pausen fra, kører i slowmotion og går tilbage til det valgte tempo bagefter
  await page.locator('#fusTid [data-tid="langsom"]').click();
  await page.locator('#fusTid [data-tid="pause"]').click();
  await page.locator('#fusVisMig').click();
  await page.waitForTimeout(300);
  f = await F();
  tjek(`${navn}: "Vis mig" slår pausen fra i Stjerneovnen og kører i slowmotion`, !f.pause && f.tid === 'langsom' && f.tempo === 0.25 && (await T(() => atomlabTest.fusion.demo())), JSON.stringify(f));
  await page.locator('#fusTid [data-tid="hurtig"]').click();
  tjek(`${navn}: ⏩ under "Vis mig" venter, til den er færdig`, (await F()).tempo === 0.25);
  await page.waitForFunction(() => { atomlabTest.fusion.spolAlt(1); return !atomlabTest.fusion.demo(); }, null, { polling: 100, timeout: 15000 }).catch(() => {});
  f = await F();
  tjek(`${navn}: efter "Vis mig" er tempoet ⏩`, f.tempo === 3 && f.tid === 'hurtig', JSON.stringify(f));
  await page.screenshot({ path: `${UD}/${navn}-f.png` });

  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await ctx.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
await b.close();
process.exit(dårlig ? 1 : 0);
