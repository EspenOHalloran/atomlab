// Jorden og Solen i Solsystemet (Mars M4b): formlerne for Solen og Månen mod kendte værdier (uden browser),
// og visningerne i browseren (lyset efter tidspunktet, Jordens drejning, Månens plads, knapperne og Solen).
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { dageSidenJ2000, solen, månen, solUnder, solHøjde, månefase, faseNavn } from '../js/data/himmel.js';
const UD = billedmappe('jorden');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const dag = (iso) => dageSidenJ2000(new Date(iso));
const vinkelForskel = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// ---------- Uden browser: Månen ----------
// Meeus, "Astronomical Algorithms", eksempel 47.a: 12. april 1992 kl. 0 (TD): λ = 133,163°, β = −3,229°, afstand 368.410 km
{
  const m = månen(dag('1992-04-12T00:00:00Z'));
  tjek(`Meeus 47.a: Månens længde ${m.længde.toFixed(2)}° (133,16°)`, vinkelForskel(m.længde, 133.163) < 0.3);
  tjek(`Meeus 47.a: Månens bredde ${m.bredde.toFixed(2)}° (−3,23°)`, Math.abs(m.bredde + 3.229) < 0.3);
  tjek(`Meeus 47.a: afstand ${Math.round(m.afstand)} km (368.410 km)`, Math.abs(m.afstand - 368410) < 1500);
}
// Formørkelserne i 2026 (NASA's formørkelsessider): ringformet solformørkelse 17/2 kl. 12:12, total måneformørkelse 3/3
// kl. 11:33, total solformørkelse 12/8 kl. 17:46 og delvis måneformørkelse 28/8 kl. 4:13 (verdenstid). Ved en formørkelse
// står Månen lige ved eller lige over for Solen og tæt på Jordens banes plan.
for (const [navn, tid, mål] of [
  ['ringformet solformørkelse 17. februar', '2026-02-17T12:12Z', 0], ['total måneformørkelse 3. marts', '2026-03-03T11:33Z', 180],
  ['total solformørkelse 12. august', '2026-08-12T17:46Z', 0], ['delvis måneformørkelse 28. august', '2026-08-28T04:13Z', 180],
]) {
  const d = dag(tid);
  const m = månen(d);
  const vinkel = (m.længde - solen(d).længde + 360) % 360;
  tjek(`${navn}: Månen ${vinkel.toFixed(1)}° fra Solen og ${m.bredde.toFixed(2)}° fra banens plan`, vinkelForskel(vinkel, mål) < 1.5 && Math.abs(m.bredde) < 1.6);
  tjek(`${navn}: ${faseNavn(månefase(d))}`, faseNavn(månefase(d)) === (mål ? 'fuldmåne' : 'nymåne'));
}
// Afstanden hele året (NSSDC: i snit 363.300-405.500 km, de yderste ca. 356.400-406.700 km), og tiden fra fuldmåne til fuldmåne
{
  const timer = Array.from({ length: 365 * 24 }, (_, i) => dag('2026-01-01T00:00Z') + i / 24);
  const afst = timer.map((d) => månen(d).afstand);
  tjek(`Månens afstand i 2026: ${Math.round(Math.min(...afst))}-${Math.round(Math.max(...afst))} km`, Math.min(...afst) > 355000 && Math.max(...afst) < 408000 && Math.min(...afst) < 362000 && Math.max(...afst) > 404000);
  const fulde = [];
  for (let i = 1; i < timer.length - 1; i++) {
    const b = (d) => månefase(d).belyst;
    if (b(timer[i]) > b(timer[i - 1]) && b(timer[i]) >= b(timer[i + 1])) fulde.push(timer[i]);
  }
  const snit = (fulde.at(-1) - fulde[0]) / (fulde.length - 1);
  tjek(`fra fuldmåne til fuldmåne i snit ${snit.toFixed(2)} døgn (NSSDC: 29,53)`, Math.abs(snit - 29.53) < 0.05, fulde.length);
}

// ---------- Uden browser: Solen og Jordens drejning ----------
{
  const juni = solUnder(dag('2026-06-21T12:00Z'));
  tjek(`21. juni kl. 12 (verdenstid): Solen står lodret over ${juni.bredde.toFixed(2)}° N, ${juni.længde.toFixed(2)}° Ø`, Math.abs(juni.bredde - 23.43) < 0.05 && Math.abs(juni.længde) < 1.5);
  // Tidsjævningen: I Greenwich står Solen højest ca. 16 min før kl. 12 den 3. november (så kl. 12 står den ca. 4,1° mod vest)
  // og ca. 14 min efter kl. 12 den 11. februar (kl. 12 står den ca. 3,6° mod øst)
  const nov = solUnder(dag('2026-11-03T12:00Z')), feb = solUnder(dag('2026-02-11T12:00Z'));
  tjek(`3. november kl. 12: Solen står over ${nov.længde.toFixed(2)}° (ca. −4,1°)`, nov.længde < -3.5 && nov.længde > -4.6);
  tjek(`11. februar kl. 12: Solen står over ${feb.længde.toFixed(2)}° (ca. 3,6°)`, feb.længde > 3.0 && feb.længde < 4.2);
  // København 21. december: solopgang kl. 8:38 dansk tid (sunrisesunsettime.org), altså 7:38 verdenstid
  const KBH = [55.68, 12.57];
  const op = Array.from({ length: 120 }, (_, i) => i).find((i) => solHøjde(dag('2026-12-21T07:00Z') + i / 1440, ...KBH) > -0.833);
  tjek(`København 21. december: Solen står op kl. ${7 + Math.floor(op / 60)}:${String(op % 60).padStart(2, '0')} verdenstid (7:38)`, Math.abs(op - 38) <= 3);
  const højst = Math.max(...Array.from({ length: 300 }, (_, i) => solHøjde(dag('2026-06-21T09:00Z') + i / 1440, ...KBH)));
  tjek(`København 21. juni: Solen står højst ${højst.toFixed(1)}° (57,8°)`, Math.abs(højst - 57.8) < 0.2);
}

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
async function side(vp, opt = {}) {
  const s = await (await b.newContext({ viewport: vp, ...opt })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await s.goto(`${ADRESSE}/?test#solsystem`);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  return s;
}
const f = (s, kode, arg) => s.evaluate(([k, a]) => new Function('f', 'a', `return (${k})`)(atomlabTest.solsystem.fænomen(), a), [kode, arg]);

const s = await side({ width: 1280, height: 800 });
// ---------- Solen ----------
tjek('Solsystemet åbner første gang på Solen', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'solen');
tjek('Solen: sort himmel', !(await s.evaluate(() => atomlabTest.solsystem.tåger())));
const solTekst = await s.textContent('#solsystemTekst');
tjek('Solen: tekst om fusion og 109 Jorder', /fusion/.test(solTekst) && /109 Jorder/.test(solTekst));
tjek('Solen: link til Stjerneovnen', (await s.getAttribute('#solsystemTekst a:has-text("Stjerneovnen")', 'href')) === '#fusion');
const radier = await f(s, 'f.radier()');
tjek(`Solen: Jorden er ${(radier.sol / radier.jorden).toFixed(1)} gange mindre (109,2)`, Math.abs(radier.sol / radier.jorden - 109.2) < 0.1);
await s.click('#solsystemStyr .kontakt:has-text("Jorden ved siden af")');
tjek('"Jorden ved siden af" viser Jorden', await f(s, 'f.jordenVist()'));
await s.waitForTimeout(2500);
await s.screenshot({ path: `${UD}/pc-solen-jorden.png` });
await s.click('#solsystemTekst a:has-text("Stjerneovnen")');
await s.waitForFunction(() => document.querySelector('#fusion:not(.skjult)'));
tjek('linket åbner Stjerneovnen', true);
await s.evaluate(() => { location.hash = '#solsystem'; });
await s.waitForFunction(() => document.querySelector('#solsystem:not(.skjult)'));

// ---------- Jorden ----------
await s.click('#solsystem .sol-klode[data-id="jorden"]');
tjek('et tryk på Jorden åbner Jorden', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'jorden');
const knapper = await s.evaluate(() => atomlabTest.solsystem.knapper());
tjek('ingen knapper i bjælken og Styr-boksen ("Drej Jorden" er ⏩, og Månen står i træet)', knapper.length === 0, JSON.stringify(knapper));
tjek('tidsknappen har ⏩ ved Jorden', await s.isVisible('#solsystemTid button[data-tid="hurtig"]'));
tjek('Jorden: sort himmel', !(await s.evaluate(() => atomlabTest.solsystem.tåger())));
const nu = await f(s, 'f.tid()');
tjek('tidspunktet er nu', Math.abs(nu - Date.now()) < 60000);
// Lyset passer med tidspunktet: punktet under Solen (regnet ud fra 3D-billedet) er det samme som i formlerne
for (const tid of ['2026-06-21T12:00Z', '2026-12-21T07:38Z', '2026-03-20T18:00Z']) {
  await f(s, 'f.sætTid(a)', Date.parse(tid));
  const vist = await f(s, 'f.solUnder()');
  const regnet = solUnder(dag(tid));
  tjek(`${tid}: Solen står over ${vist.bredde.toFixed(1)}°, ${vist.længde.toFixed(1)}° i 3D-billedet (formlen: ${regnet.bredde.toFixed(1)}°, ${regnet.længde.toFixed(1)}°)`,
    Math.abs(vist.bredde - regnet.bredde) < 0.2 && vinkelForskel(vist.længde, regnet.længde) < 0.3);
}
await f(s, 'f.sætTid(a)', Date.parse('2026-06-21T12:00Z'));
tjek('uret: 21. juni kl. 14 i Danmark, Solen er oppe', /søndag 21\. juni kl\. 14\.00\. Solen er oppe/.test((await f(s, 'f.ur()'))[0]), (await f(s, 'f.ur()'))[0]);
await f(s, 'f.sætTid(a)', Date.parse('2026-12-21T20:00Z'));
tjek('uret: 21. december kl. 21, Solen er nede', /Solen er nede/.test((await f(s, 'f.ur()'))[0]), (await f(s, 'f.ur()'))[0]);
await f(s, 'f.sætTid(a)', Date.parse('2026-03-03T11:33Z'));
tjek('uret: fuldmåne ved måneformørkelsen 3. marts', /Månen: fuldmåne, 100 % belyst/.test((await f(s, 'f.ur()'))[1]), (await f(s, 'f.ur()'))[1]);
// Månen: den rigtige afstand og størrelse (ca. 30 Jorder på række)
const m = await f(s, 'f.måne()');
const regnetM = månen(dag('2026-03-03T11:33Z'));
tjek(`Månen står ${Math.round(m.afstand)} km væk (formlen: ${Math.round(regnetM.afstand)} km)`, Math.abs(m.afstand - regnetM.afstand) < 1);
tjek(`Månens radius ${m.radius} km og Jordens ${m.jord} km (NSSDC)`, m.radius === 1737.4 && m.jord === 6371);
tjek(`ved fuldmåne står Månen lige over for Solen (${(Math.acos(-m.solRetning.reduce((t, v, i) => t + v * m.måneRetning[i], 0)) * 180 / Math.PI).toFixed(1)}°)`,
  m.solRetning.reduce((t, v, i) => t + v * m.måneRetning[i], 0) < -0.999);
// Nordpolen hælder mod Solen om sommeren: vinklen mellem aksen og Solen giver dagens deklination
await f(s, 'f.sætTid(a)', Date.parse('2026-06-21T12:00Z'));
const pol = await f(s, 'f.nordpol()');
const solR = (await f(s, 'f.måne()')).solRetning;
const dekl = Math.asin(pol.reduce((t, v, i) => t + v * solR[i], 0)) * 180 / Math.PI;
tjek(`21. juni: Solen står ${dekl.toFixed(2)}° nord for ækvator (23,43°)`, Math.abs(dekl - 23.43) < 0.1);

// ⏩ (før "Drej Jorden"): tiden går ca. 820 gange hurtigere, og Jorden drejer mod øst (Solen flytter sig mod vest hen
// over Jorden)
const før = await f(s, '[f.tid(), f.solUnder().længde]');
await s.click('#solsystemTid button[data-tid="hurtig"]');
tjek('⏩: teksten siger, at tiden går hurtigere', /800 gange hurtigere/.test(await s.textContent('#solsystemForklaring')));
await s.evaluate(() => atomlabTest.solsystem.spol(8)); // spoles frem (testbrowseren tegner kun få billeder i sekundet)
const efter = await f(s, '[f.tid(), f.solUnder().længde]');
const timer = (efter[0] - før[0]) / 3600000;
const vest = ((før[1] - efter[1]) % 360 + 360) % 360;
tjek(`⏩: tiden gik ${timer.toFixed(1)} timer frem`, timer > 1, JSON.stringify([før, efter]));
tjek(`Jorden drejer mod øst: Solen flyttede sig ${vest.toFixed(0)}° mod vest (ca. 15° i timen: ${(timer * 15.04 % 360).toFixed(0)}°)`, Math.abs(vest - (timer * 15.04) % 360) < 3);
// Pause: tiden står stille, og mellemrum går tilbage til ⏩ (det, tiden gik med før)
await s.click('#solsystemTid button[data-tid="pause"]');
const p0 = await f(s, 'f.tid()');
await s.waitForTimeout(600);
tjek('pause: tiden står stille', (await f(s, 'f.tid()')) === p0);
await s.mouse.click(640, 400);
await s.keyboard.press('Space');
tjek('mellemrum efter ⏩ og ⏸: tiden går hurtigt igen', (await s.evaluate(() => atomlabTest.solsystem.tidsknap())) === 'hurtig');
await s.click('#solsystemTid button[data-tid="spil"]');
tjek('▶: tiden går normalt, og teksten siger "Lige nu"', /Lige nu/.test(await s.textContent('#solsystemForklaring')));
// Under pause flyver kameraet stadig (flyvningen kører uden for fænomenets ur)
await s.click('#solsystemTid button[data-tid="pause"]');
const flyvFør = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return verden.kamera.position.toArray(); });
await s.click('#solsystemTræ button[data-sted="månen"]');
const fløj = await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().flyver(), null, { timeout: 30000, polling: 200 }).then(() => true, () => false);
const flyvEfter = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return verden.kamera.position.toArray(); });
tjek('under pause flyver kameraet stadig ud til Månen (uden at spole)', fløj && (await f(s, 'f.ved()')) === 'månen' && Math.hypot(...flyvFør.map((v, i) => v - flyvEfter[i])) > 1 && (await s.evaluate(() => atomlabTest.solsystem.pause())), JSON.stringify([flyvFør, flyvEfter]));
await s.click('#solsystemTræ button[data-sted="jorden"]');
await f(s, 'f.hop()');
await s.click('#solsystemTid button[data-tid="spil"]');

// "Månen": kameraet flyver ud til Månen og tilbage
await f(s, 'f.sætTid(a)', Date.now());
await s.waitForTimeout(1500);
await s.screenshot({ path: `${UD}/pc-jorden.png` });
await s.click('#solsystemTræ button[data-sted="månen"]');
await f(s, 'f.hop()');
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().flyver());
tjek('"Månen": kameraet er ved Månen', (await f(s, 'f.ved()')) === 'månen' && (await s.evaluate(() => atomlabTest.solsystem.side().nøgle)) === 'jorden:månen');
const kam = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return verden.kamera.position.length(); });
tjek(`kameraet er tæt på Månen (${kam.toFixed(1)} enheder fra midten, Månens radius 1,74)`, kam > 1.74 && kam < 20);
await s.waitForTimeout(1500);
await s.screenshot({ path: `${UD}/pc-maanen.png` });
await s.click('#solsystemTræ button[data-sted="jorden"]');
await f(s, 'f.hop()');
tjek('"Jorden" i træet: tilbage ved Jorden', (await f(s, 'f.ved()')) === 'jorden');
// Skift væk: Jordens ur forsvinder
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
tjek('Jordens ur er væk, når Mars vælges', (await s.$$('#solsystemOverlag .jord-ur')).length === 0);
await s.context().close();

// ---------- Telefon på højkant: uret kan ses ----------
{
  const t = await side({ width: 390, height: 844 }, { hasTouch: true, isMobile: true });
  await t.evaluate(() => atomlabTest.solsystem.vælg('jorden'));
  await t.waitForTimeout(1500);
  const ur = await t.evaluate(() => { const r = document.querySelector('#solsystemOverlag .jord-ur').getBoundingClientRect(); const v = document.getElementById('solsystemVindue').getBoundingClientRect(); return { inde: r.left >= v.left - 1 && r.right <= v.right + 1 && r.bottom <= v.bottom + 1 && r.top >= v.top, h: r.height }; });
  tjek('telefon: uret står inde i 3D-billedet', ur.inde && ur.h > 10, JSON.stringify(ur));
  await t.screenshot({ path: `${UD}/telefon-jorden.png` });
  await t.context().close();
}

console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0);
