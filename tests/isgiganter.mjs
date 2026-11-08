// Uranus og Neptun (UN1 i docs/plan-uranus-neptun.md): kloderne står i Solsystemet efter Saturn, kortene hentes, de er
// fladtrykte, aksen hælder 97,8° og 28,3° (regnet fra polens retning og banen), Solens retning passer med JPL Horizons,
// Uranus drejer med uret og Neptun mod uret set fra IAU's nordpol, de står stille i pause, og vindene blæser den
// rigtige vej (fælden ved Uranus: IAU's "vest" er med drejningen). Vindformlerne og Solens bredde testes først uden
// browser. Ingen fejl i konsollen. UN2: skyderen "År" (Solens bredde i 3D-billedet passer med Horizons i 1986, 2007 og
// 2026), kappen over polerne følger årstiden, ringene (NSSDC) og kontakten "Infrarødt". UN3 (Neptun): ringene og buerne
// (NSSDC, Wikipedia), pletterne fra 1989 kun med kontakten, skyerne og pletterne flytter sig den rigtige vej og står
// stille i pause, buerne kredser mod uret på ca. 10,5 timer, "Voyagers farver" og "Vindene".
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PLANETER, solBredde, pol, baneNormal } from '../js/data/isgiganter.js';
import { vindVed, neptunRå, uranusRå } from '../js/data/vinde-isgiganter.js';
import { SIDE as URANUS_SIDE } from '../js/data/sider/uranus.js';
import { RINGE, YDRE, ANTAL, ringProfil, støvVed, RING_IND, RING_UD, ALBEDO } from '../js/data/ringe-uranus.js';
import { SIDE as NEPTUN_SIDE } from '../js/data/sider/neptun.js';
import * as RN from '../js/data/ringe-neptun.js';
import { PLETTER, BÅND, VOYAGER, pletFart, vindOmgang, pileBredder } from '../js/data/vejr-neptun.js';
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
  // Neptuns ringe og buer (NSSDC og Wikipedias "Rings of Neptune")
  const buer = Object.fromEntries(RN.BUER_1989.map((x) => [x.navn, [x.fra, x.til]]));
  tjek('Neptuns buer i 1989: Fraternité 247-257°, Egalité 1 261-264°, Egalité 2 265-266°, Liberté 276-280°, Courage 284,5-285,5°', JSON.stringify(buer) === JSON.stringify({ Fraternité: [247, 257], 'Egalité 1': [261, 264], 'Egalité 2': [265, 266], Liberté: [276, 280], Courage: [284.5, 285.5] }), JSON.stringify(buer));
  const nuC = RN.BUER_NU.find((x) => x.navn === 'Courage'), nuL = RN.BUER_NU.find((x) => x.navn === 'Liberté');
  tjek('buerne nu (2003): Courage sprunget 8-9° frem til ca. 294°, Liberté næsten væk', Math.abs((nuC.fra + nuC.til) / 2 - 294) < 0.6 && nuL.tau < RN.BUER_1989.find((x) => x.navn === 'Liberté').tau * 0.2, JSON.stringify([nuC, nuL]));
  tjek('Adams-ringen ved 62.933 km med τ 0,011, buerne τ 0,03-0,09, og buerne kommer rundt på ca. 10,54 timer (820,1° pr. døgn)', RN.ADAMS.r === 62933 && Math.abs(RN.ADAMS.tau - 0.011) < 1e-9 && RN.BUER_1989.every((x) => x.tau >= 0.03 && x.tau <= 0.09) && Math.abs(RN.ADAMS_OMLØB / 3600 - 360 / 820.1185 * 24) < 0.02, RN.ADAMS_OMLØB / 3600);
  const dN = (RN.RING_UD - RN.RING_IND) / 2048;
  const sumN = RN.ringProfil(2048).reduce((a, x) => a + x.tau * RN.TAU_ENHED * dN, 0), sumNR = RN.RINGE.reduce((a, g) => a + g.tau * g.bred, 0);
  tjek('Neptuns ringe: teksturen bevarer τ gange bredde (Galle, Le Verrier, Lassell, Arago og Adams)', Math.abs(sumN / sumNR - 1) < 0.01, [sumN, sumNR].join());
  // Neptuns vejr (Voyager 2, Photojournal)
  const gds = PLETTER[0], d2 = PLETTER[2], sc = PLETTER[1];
  tjek('Den Store Mørke Plet: 22° S, 13.000 × 6.600 km, rundt på 18,3 timer, og D2 ved 54° S på 16,1 timer (Voyager 2)', gds.bredde === -22 && gds.km.join() === '13000,6600' && gds.omgang === 18.3 && d2.bredde === -54 && d2.omgang === 16.1);
  tjek('pletterne følger nogenlunde vinden: vindformlen giver pletten og Scooter inden for 3 % af de målte omgange', Math.abs(vindOmgang(gds) / gds.omgang - 1) < 0.03 && Math.abs(vindOmgang(sc) / sc.omgang - 1) < 0.03, [vindOmgang(gds), vindOmgang(sc)].join());
  tjek('pletten driver mod vest i forhold til Neptuns døgn, Scooter vinder ca. 30° mod øst pr. omgang i forhold til pletten', pletFart(gds) < 0 && Math.abs((pletFart(sc) - pletFart(gds)) * gds.omgang * 360 - 30) < 3, (pletFart(sc) - pletFart(gds)) * gds.omgang * 360);
  tjek('flere høje skyer i 1989 end i 2025 (de forsvandt næsten i 2019)', BÅND.every((b) => b.år1989 > b.nu));
  tjek('"Voyagers farver" er meget blåere (blå/rød over 3 gange vores)', VOYAGER.gain[2] / VOYAGER.gain[0] > 3);
  tjek('pilene: ingen ved ±50° (næsten stille) og den længste ved ækvator (mod vest)', pileBredder().every((r) => Math.abs(r.bredde) !== 50) && pileBredder().find((r) => r.bredde === 0).vind < -390);
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

// ---------- UN3: Neptuns vejr og ringbuer ----------
const venteKontakt = (navn, felt, mål) => s.waitForFunction(([felt, mål]) => atomlabTest.solsystem.fænomen().vejr()[felt] === mål, [felt, mål], { timeout: 10000, polling: 100 }).catch(() => {});
const uDiff = (a, b) => { let d = b - a; d -= Math.round(d); return d; }; // forskel i u, der går hele vejen rundt
async function neptunUN3() {
  const v0 = await F('vejr');
  tjek('Neptun: pletterne fra 1989 er slukket fra start', v0.år1989 === 0 && v0.voyager === 0 && v0.pile === 0, JSON.stringify([v0.år1989, v0.voyager, v0.pile]));
  const b0 = await F('buer');
  tjek('Neptun: de senest kendte buer vises fra start (Courage ved ca. 294°), dem fra 1989 ikke', b0.tau.slice(0, 5).every((t) => t > 0) && b0.tau.slice(5).every((t) => t === 0) && Math.abs(b0.fra[4] - 293.5) < 1e-6, JSON.stringify(b0));
  const r = await F('ringe');
  tjek('Neptun: ringene fra 40.000 til 64.000 km', r && r.synlige && r.ind === 40000 && r.ud === 64000, JSON.stringify(r));
  // Skyerne og pletterne flytter sig med vinden: ved 27° N mod vest, ved 70° S mod øst, pletten mod vest
  await s.waitForTimeout(1500);
  const v1 = await F('vejr'), bu1 = await F('buer'), t1 = (await F('ur')).vind;
  const nord = (v) => v.bånd.find((b) => b.bredde === 27).u, syd = (v) => v.bånd.find((b) => b.bredde === -70).u, plet = (v) => v.pletter[0].u;
  tjek('Neptun: skyerne ved 27° N flytter sig mod vest og ved 70° S mod øst, og pletten mod vest', uDiff(nord(v0), nord(v1)) < 0 && uDiff(syd(v0), syd(v1)) > 0 && uDiff(plet(v0), plet(v1)) < 0, JSON.stringify([uDiff(nord(v0), nord(v1)), uDiff(syd(v0), syd(v1)), uDiff(plet(v0), plet(v1))]));
  tjek('Neptun: buerne kredser mod uret set fra nordpolen og kommer rundt på ca. 10,5 timer', bu1.vinkel > b0.vinkel && Math.abs(bu1.vinkel - (((t1 * 450) / b0.omløb) % 1) * 2 * Math.PI) < 1e-3 && Math.abs(b0.omløb / 3600 - 10.54) < 0.02, JSON.stringify([b0.vinkel, bu1.vinkel, b0.omløb]));
  await s.click('#solsystemTid button[data-tid="pause"]');
  const p0 = await F('vejr'), pb0 = await F('buer');
  await s.waitForTimeout(800);
  const p1 = await F('vejr'), pb1 = await F('buer');
  tjek('Neptun: skyerne, pletterne og buerne står stille i pause', JSON.stringify(p0.bånd) === JSON.stringify(p1.bånd) && JSON.stringify(p0.pletter) === JSON.stringify(p1.pletter) && pb0.vinkel === pb1.vinkel);
  await s.click('#solsystemTid button[data-tid="spil"]');
  // "Neptun i 1989": pletterne, flere skyer og buerne fra 1989
  await fm(() => atomlabTest.solsystem.trykPå('Neptun i 1989'));
  await venteKontakt('Neptun i 1989', 'år1989', 1);
  const v89 = await F('vejr'), b89 = await F('buer');
  tjek('"Neptun i 1989": pletterne kommer frem, skyerne bliver flere, og buerne er dem fra 1989 (Courage ved 285°)', v89.år1989 === 1 && v89.bånd.every((b, i) => Math.abs(b.dækning - BÅND[i].år1989) < 1e-9) && b89.tau.slice(0, 5).every((t) => t === 0) && Math.abs(b89.fra[9] - 284.5) < 1e-6 && b89.tau[5] > 0, JSON.stringify({ d: v89.bånd.map((b) => b.dækning), t: b89.tau }));
  await fm(() => atomlabTest.solsystem.trykPå('Neptun i 1989'));
  await venteKontakt('Neptun i 1989', 'år1989', 0);
  tjek('"Neptun i 1989" slået fra: pletterne er væk igen', (await F('vejr')).år1989 === 0);
  // "Voyagers farver" og "Vindene"
  await fm(() => atomlabTest.solsystem.trykPå('Voyagers farver'));
  await fm(() => atomlabTest.solsystem.trykPå('Vindene'));
  await venteKontakt('', 'voyager', 1);
  await venteKontakt('', 'pile', 1);
  const vk = await F('vejr');
  tjek('"Voyagers farver (1989)" og "Vindene" toner ind (pilene ved ækvator mod vest)', vk.voyager === 1 && vk.pile === 1 && vk.pileRækker.find((x) => x.bredde === 0).vind < 0, JSON.stringify([vk.voyager, vk.pile]));
  await s.screenshot({ path: `${UD}/neptun-voyager-vinde.png` });
  await fm(() => atomlabTest.solsystem.trykPå('Voyagers farver'));
  await fm(() => atomlabTest.solsystem.trykPå('Vindene'));
}

for (const [id, navn, flad, hæld, kort] of [['uranus', 'Uranus', 24973 / 25559, 97.77, 'uranus-1k.jpg'], ['neptun', 'Neptun', 24341 / 24764, 28.32, 'neptun-1k.jpg']]) {
  await s.click(`#solsystem .sol-klode[data-id="${id}"]`);
  await s.waitForFunction((id) => atomlabTest.solsystem.valgt() === id && atomlabTest.solsystem.fænomen()?.hentet(), id, { timeout: 30000, polling: 200 }).catch(() => {});
  const billeder = await F('billeder');
  tjek(`${navn} åbner, og kortet er hentet (1k i tests, i farver)`, (await F('hentet')) && billeder[kort] === 'farver', JSON.stringify(billeder));
  tjek(`${navn}: sort himmel (ingen tågeskyer)`, !(await fm(() => atomlabTest.solsystem.tåger())));
  const styr = id === 'uranus' ? ['År', 'Modlys', 'Infrarødt (som JWST)'] : ['Vindene', 'Modlys', 'Neptun i 1989', 'Voyagers farver (1989)'];
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
  if (id === 'neptun') await neptunUN3();
}

await s.context().close();
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
