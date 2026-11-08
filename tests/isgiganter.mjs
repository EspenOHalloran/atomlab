// Uranus og Neptun (UN1 i docs/plan-uranus-neptun.md): kloderne står i Solsystemet efter Saturn, kortene hentes, de er
// fladtrykte, aksen hælder 97,8° og 28,3° (regnet fra polens retning og banen), Solens retning passer med JPL Horizons,
// Uranus drejer med uret og Neptun mod uret set fra IAU's nordpol, de står stille i pause, og vindene blæser den
// rigtige vej (fælden ved Uranus: IAU's "vest" er med drejningen). Vindformlerne og Solens bredde testes først uden
// browser. Ingen fejl i konsollen. UN2: skyderen "År" (Solens bredde i 3D-billedet passer med Horizons i 1986, 2007 og
// 2026), kappen over polerne følger årstiden, ringene (NSSDC) og kontakten "Infrarødt".
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PLANETER, solBredde, pol, baneNormal } from '../js/data/isgiganter.js';
import { vindVed, neptunRå, uranusRå } from '../js/data/vinde-isgiganter.js';
import { SIDE as URANUS_SIDE } from '../js/data/sider/uranus.js';
import { RINGE, YDRE, ANTAL, ringProfil, støvVed, RING_IND, RING_UD, ALBEDO } from '../js/data/ringe-uranus.js';
import { SIDE as NEPTUN_SIDE } from '../js/data/sider/neptun.js';
const UD = billedmappe('isgiganter');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const GRAD = 180 / Math.PI;
const vinkel = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * GRAD;

// ---------- Tallene uden browser ----------
{
  // JPL Horizons, kolonne 15 (Solens bredde, planetografisk), regnet 7. november 2026 (fakta-solsystemet/del6, afsnit 2)
  const horizons = [
    ['uranus', '1986-01-24', -82.5], ['uranus', '2007-12-08', 0], ['uranus', '2026-11-07', 74.3],
    ['neptun', '2005-06-15', -29.2], ['neptun', '2026-11-07', -19.5], ['neptun', '2046-04-15', 0],
  ];
  for (const [n, d, h] of horizons) {
    const b = solBredde(n, new Date(d));
    tjek(`Solens bredde på ${n} ${d}: ${h}° (Horizons)`, Math.abs(b - h) < 0.2, b.toFixed(2));
  }
  let maks = { b: -99 };
  for (let t = Date.UTC(2027, 0, 1); t < Date.UTC(2034, 0, 1); t += 864e5 * 5) { const b = solBredde('uranus', new Date(t)); if (b > maks.b) maks = { b, år: new Date(t).getUTCFullYear() }; }
  tjek('Uranus\' solhverv i nord er i 2030, ikke 2028 (fælden)', maks.år === 2030 && Math.abs(maks.b - 82.6) < 0.2, JSON.stringify(maks));
  // Aksens hældning (NSSDC) er vinklen mellem banens normal og den akse, planeten drejer mod uret om. IAU's nordpol
  // ligger altid nord for banen, så for Uranus (der drejer med uret om den) er hældningen 180° minus vinklen til den.
  const nu = new Date('2026-11-07');
  const spinAkse = (n) => pol(n, nu).map((v) => v * PLANETER[n].retning);
  const hU = vinkel(spinAkse('uranus'), baneNormal('uranus', nu)), hN = vinkel(spinAkse('neptun'), baneNormal('neptun', nu));
  tjek('aksens hældning regnet fra polens retning og banen: Uranus 97,77° og Neptun 28,32° (NSSDC)', Math.abs(hU - 97.77) < 0.1 && Math.abs(hN - 28.32) < 0.1, [hU, hN].join());
  tjek('IAU\'s nordpol ligger nord for banen (også Uranus\')', vinkel(pol('uranus', nu), baneNormal('uranus', nu)) < 90 && vinkel(pol('neptun', nu), baneNormal('neptun', nu)) < 90);
  tjek('Uranus drejer med uret om IAU\'s nordpol, Neptun mod uret', PLANETER.uranus.retning === -1 && PLANETER.neptun.retning === 1);
  // Vindene (fakta-solsystemet/del6, afsnit 4)
  tjek('Neptuns vind: ca. 398 m/s mod drejningen (mod vest) ved ækvator, næsten stille ved ±50° og ca. 235 m/s med drejningen ved ±70°', Math.abs(vindVed('neptun', 0) + 398) < 1 && Math.abs(neptunRå(50)) < 10 && Math.abs(vindVed('neptun', 70) - 235) < 2 && Math.abs(vindVed('neptun', -70) - 235) < 2, [vindVed('neptun', 0), neptunRå(50), vindVed('neptun', 70)].join());
  tjek('Uranus\' vind: ca. 111 m/s mod drejningen ved ækvator og ca. 221 m/s med drejningen ved ±60°', Math.abs(vindVed('uranus', 0) + 111) < 1 && Math.abs(vindVed('uranus', 60) - 221) < 1 && Math.abs(vindVed('uranus', -60) - 221) < 1, [vindVed('uranus', 0), vindVed('uranus', 60)].join());
  // Siderne kan indlæses (en apostrof i en tekst med enkelte anførselstegn stoppede engang hele programmet)
  tjek('siderne ved Uranus og Neptun har en kort tekst, Billederne og "Ærligt talt"', [URANUS_SIDE, NEPTUN_SIDE].every((x) => x.kort.length > 50 && x.billeder && x.ærligt));
  // Ringene (NSSDC, fakta-solsystemet/del6, afsnit 6)
  const eps = RINGE.find((g) => g.navn === 'Epsilon');
  tjek('ringene: 13 kendte, epsilon ved 51.149 km med τ 0,5-2,3, ring 6 ved 41.837 km, de to ydre ved 67.300 og 97.700 km', ANTAL === 13 && eps.r === 51149 && eps.tau >= 0.5 && eps.tau <= 2.3 && RINGE[0].r === 41837 && YDRE.map((g) => g.r).join() === '67300,97700');
  const d = (RING_UD - RING_IND) / 2048;
  const sumP = ringProfil(2048).reduce((s, x) => s + x.tau * d, 0), sumR = RINGE.reduce((s, g) => s + g.tau * g.bred, 0);
  tjek('ringene: teksturen bevarer hver rings samlede tæthed (τ gange bredde), også når den er smallere end et punkt', Math.abs(sumP - sumR) < 0.01, [sumP, sumR].join());
  tjek('ringene: mørke som kul (albedo ca. 0,015), og støvet kun mellem 38.000 og 51.600 km', Math.abs(ALBEDO - 0.015) < 1e-9 && støvVed(45000) > 0 && støvVed(37000) === 0 && støvVed(52000) === 0);
  tjek('vindene dæmpes til 0 ved polerne (ikke målt), men ikke før 75°', vindVed('uranus', 90) === 0 && vindVed('neptun', -90) === 0 && vindVed('uranus', 75) === uranusRå(75) && vindVed('neptun', 75) === neptunRå(75));
}

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
const fm = (f, a) => s.evaluate(f, a);
const F = (navn, ...a) => fm(([navn, a]) => atomlabTest.solsystem.fænomen()[navn](...a), [navn, a]);

const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Uranus og Neptun står i listen efter Saturn', ids.indexOf('uranus') === ids.indexOf('saturn') + 1 && ids.indexOf('neptun') === ids.indexOf('uranus') + 1, JSON.stringify(ids));

// ---------- UN2: skyderen "År", kappen og ringene (Uranus) ----------
const årTilDato = (år) => new Date(Date.UTC(2000, 0, 1, 12) + (år - 2000) * 365.25 * 864e5);
const toBilleder = () => s.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function uranusUN2() {
  // Skyderen "År": Solens bredde i 3D-billedet (fra midten) passer med banen, og omregnet til planetografisk med Horizons
  const Rf = (24973 / 25559) ** -2;
  for (const [år, h, kappe] of [[1986.07, -82.5, [0, 1]], [2007.94, 0, [0, 0]], [2026.85, 74.3, [1, 0]]]) {
    await F('sætÅr', år);
    await toBilleder();
    const sol = await F('sol'), p = await F('pol');
    const c = 90 - vinkel(sol, p);
    const g = Math.atan(Rf * Math.tan(c / GRAD)) * GRAD;
    tjek(`skyderen "År" ${Math.floor(år)}: Solen står ${h}° over Uranus' ækvator (Horizons)`, Math.abs(c - solBredde('uranus', årTilDato(år), false)) < 0.05 && Math.abs(g - h) < 0.3, [c, g].join());
    const k = await F('kapper');
    tjek(`kappen over polerne ${Math.floor(år)}: nord ${kappe[0]}, syd ${kappe[1]}`, Math.abs(k[0] - kappe[0]) < 0.02 && Math.abs(k[1] - kappe[1]) < 0.02, JSON.stringify(k));
  }
  const ui = await fm(() => { const s = [...document.querySelectorAll('#solsystem .skyder-boks')].find((b) => b.textContent.includes('År')); const i = s?.querySelector('input'); return i ? { min: i.min, max: i.max, vis: s.querySelector('strong').textContent } : null; });
  tjek('skyderen "År" går fra 1986 til 2070 og viser årstallet', ui && ui.min === '1986' && ui.max === '2070' && ui.vis === '2026', JSON.stringify(ui));
  const r = await F('ringe');
  tjek(`ringene: ${r?.punkter} punkter i tests, fra 38.000 til 52.000 km, med albedoen som lysstyrke`, r && r.punkter === 2048 && r.ind === 38000 && r.ud === 52000 && Math.abs(r.lys - 0.015) < 1e-9, JSON.stringify(r));
  // "Infrarødt": ringene 40 gange lysere og planeten mørkere (metan opsuger infrarødt lys), væk igen bagefter.
  // Hvordan ringene ser ud forfra, i modlys og med kontakten, tjekkes med billedværktøjet og på tabletten (DESIGN.md).
  await fm(() => atomlabTest.solsystem.trykPå('Infrarødt'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().infrarødt() === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
  const irR = await F('ringe'), irEks = await F('eksponering');
  await fm(() => atomlabTest.solsystem.trykPå('Infrarødt'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().infrarødt() === 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
  const efter = await F('ringe');
  tjek('"Infrarødt": ringene 40 gange lysere og planeten mørkere, og bagefter som før', irR.synlige && Math.abs(irR.lys / 0.015 - 40) < 1e-6 && Math.abs(irEks - 0.4) < 1e-6 && Math.abs(efter.lys - 0.015) < 1e-9 && Math.abs((await F('eksponering')) - 1) < 1e-6, JSON.stringify({ irR, irEks, efter }));
}

for (const [id, navn, flad, hæld, kort] of [['uranus', 'Uranus', 24973 / 25559, 97.77, 'uranus-1k.jpg'], ['neptun', 'Neptun', 24341 / 24764, 28.32, 'neptun-1k.jpg']]) {
  await s.click(`#solsystem .sol-klode[data-id="${id}"]`);
  await s.waitForFunction((id) => atomlabTest.solsystem.valgt() === id && atomlabTest.solsystem.fænomen()?.hentet(), id, { timeout: 30000, polling: 200 }).catch(() => {});
  const billeder = await F('billeder');
  tjek(`${navn} åbner, og kortet er hentet (1k i tests, i farver)`, (await F('hentet')) && billeder[kort] === 'farver', JSON.stringify(billeder));
  tjek(`${navn}: sort himmel (ingen tågeskyer)`, !(await fm(() => atomlabTest.solsystem.tåger())));
  const styr = id === 'uranus' ? ['År', 'Modlys', 'Infrarødt (som JWST)'] : ['Modlys'];
  tjek(`${navn}: Styr-boksen har ${styr.join(', ')}`, JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())) === JSON.stringify(styr), JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())));
  const form = await F('form');
  tjek(`${navn} er fladtrykt (NSSDC), og aksen hælder ${hæld}° mod banen`, Math.abs(form.flad - flad) < 1e-6 && Math.abs(form.hældning - hæld) < 0.15, JSON.stringify(form));
  // Solens bredde i 3D-billedet (planetocentrisk) passer med tallene for i dag
  const sol = await F('sol'), p = await F('pol');
  const iBilledet = 90 - vinkel(sol, p);
  const regnet = solBredde(id, new Date(), false);
  tjek(`${navn}: Solen står ${regnet.toFixed(1)}° over ækvator i 3D-billedet (som banen giver for i dag)`, Math.abs(iBilledet - regnet) < 0.3, iBilledet.toFixed(2));
  // Drejningen: et punkt på ækvator flytter sig om aksen. Fortegnet af (p0 × p1) · nordpol er + mod uret set fra nord.
  const d0 = await F('drejning'), p0 = await F('punkt', 0), m = await F('midt');
  await s.waitForFunction((d0) => Math.abs(atomlabTest.solsystem.fænomen().drejning() - d0) > 0.05, d0, { timeout: 15000, polling: 100 }).catch(() => {});
  const p1 = await F('punkt', 0);
  const a = p0.map((v, i) => v - m[i]), c = p1.map((v, i) => v - m[i]);
  const kryds = [a[1] * c[2] - a[2] * c[1], a[2] * c[0] - a[0] * c[2], a[0] * c[1] - a[1] * c[0]];
  const om = kryds[0] * p[0] + kryds[1] * p[1] + kryds[2] * p[2];
  tjek(`${navn} drejer ${id === 'uranus' ? 'med uret ("baglæns")' : 'mod uret'} set fra IAU's nordpol`, id === 'uranus' ? om < 0 : om > 0, om);
  tjek(`${navn}: ét døgn er ${PLANETER[id].døgnTimer} t i virkeligheden (programmets ur går 450 gange hurtigere)`, Math.abs((await fm(() => atomlabTest.solsystem.fænomen().døgnTid)) * 450 / 3600 - PLANETER[id].døgnTimer) < 1e-9);
  // Pause
  await s.click('#solsystemTid button[data-tid="pause"]');
  const q0 = await F('drejning'), u0 = (await F('ur')).vind;
  await s.waitForTimeout(1000);
  const q1 = await F('drejning'), u1 = (await F('ur')).vind;
  tjek(`${navn} står stille i pause (døgnet og vindene)`, q0 === q1 && u0 === u1, JSON.stringify([q0, q1, u0, u1]));
  await s.click('#solsystemTid button[data-tid="spil"]');
  // Vindene i teksturen: farten med drejningen (m/s) og retningen i kortet (uv: + er mod øst)
  const ækv = await F('strøm', 0), b60 = await F('strøm', id === 'uranus' ? 60 : 70);
  tjek(`${navn}: vindene i teksturen passer med formlen (ækvator og ${id === 'uranus' ? 60 : 70}°)`, Math.abs(ækv.ms - vindVed(id, 0)) < 3 && Math.abs(b60.ms - vindVed(id, id === 'uranus' ? 60 : 70)) < 3, JSON.stringify([ækv, b60]));
  // Ved ækvator blæser det mod drejningen på begge planeter. Neptun drejer mod øst, så vinden går mod vest (uv < 0).
  // Uranus drejer mod vest (IAU), så vinden mod drejningen går mod øst (uv > 0).
  tjek(`${navn}: vinden ved ækvator går mod ${id === 'uranus' ? 'øst' : 'vest'} i kortet (mod drejningen)`, id === 'uranus' ? ækv.uv > 0 : ækv.uv < 0, ækv.uv);
  tjek(`${navn}: tidsknappen har ⏩`, await fm(() => !!document.querySelector('#solsystemTid button[data-tid="hurtig"]')?.offsetWidth));
  const side = await fm(() => atomlabTest.solsystem.side());
  tjek(`${navn}: siden har Billederne og "Ærligt talt" sidst`, side.bokse.includes('Billederne') && side.sidst === 'Ærligt talt', JSON.stringify(side.bokse));
  await s.waitForTimeout(300);
  await s.screenshot({ path: `${UD}/${id}.png` });
  if (id === 'uranus') await uranusUN2();
}

await s.context().close();
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
