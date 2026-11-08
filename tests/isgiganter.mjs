// Uranus og Neptun (UN1 i docs/plan-uranus-neptun.md): kloderne står i Solsystemet efter Saturn, kortene hentes, de er
// fladtrykte, aksen hælder 97,8° og 28,3° (regnet fra polens retning og banen), Solens retning passer med JPL Horizons,
// Uranus drejer med uret og Neptun mod uret set fra IAU's nordpol, de står stille i pause, og vindene blæser den
// rigtige vej (fælden ved Uranus: IAU's "vest" er med drejningen). Vindformlerne og Solens bredde testes først uden
// browser. Ingen fejl i konsollen. UN2: skyderen "År" (Solens bredde i 3D-billedet passer med Horizons i 1986, 2007 og
// 2026), kappen over polerne følger årstiden, ringene (NSSDC) og kontakten "Infrarødt". UN3 (Neptun): ringene og buerne
// (NSSDC, Wikipedia), pletterne fra 1989 kun med kontakten, skyerne og pletterne flytter sig den rigtige vej og står
// stille i pause, buerne kredser mod uret på ca. 10,5 timer, "Voyagers farver" og "Vindene". UN4 (Uranus' måner):
// tallene (NSSDC), omløbstiderne og retningen målt i 3D-billedet, den rigtige størrelse ved en måne, Cressida indhenter
// Desdemona hver ca. 22. døgn, kortene hentes, skyggerne er sat, en måne i Uranus' skygge spoles ud, og tryk på en måne.
// UN5: træet med stederne, flybyerne (Uranus 5 stop, hvor skyderen "År" kører tilbage til 1986, Neptun 4 stop),
// underteksterne under 160 tegn, Solen skjult i skyggen og ved ringbuerne, pletten i sollys, og "Infrarødt" ved Neptun.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PLANETER, solBredde, pol, baneNormal } from '../js/data/isgiganter.js';
import { vindVed, neptunRå, uranusRå } from '../js/data/vinde-isgiganter.js';
import { SIDE as URANUS_SIDE } from '../js/data/sider/uranus.js';
import { RINGE, YDRE, ANTAL, ringProfil, støvVed, RING_IND, RING_UD, ALBEDO } from '../js/data/ringe-uranus.js';
import { SIDE as NEPTUN_SIDE } from '../js/data/sider/neptun.js';
import * as RN from '../js/data/ringe-neptun.js';
import { PLETTER, BÅND, VOYAGER, pletFart, vindOmgang, pileBredder } from '../js/data/vejr-neptun.js';
import * as MU from '../js/data/maaner-uranus.js';
import { SIDER as URANUS_SIDER, MÅNE_STOP, SMÅ_STOP, TUR as URANUS_TUR, STED_STOP as URANUS_STED } from '../js/data/sider/uranus.js';
import { SIDER as NEPTUN_SIDER, TUR as NEPTUN_TUR, STED_STOP as NEPTUN_STED } from '../js/data/sider/neptun.js';
import { HVORFOR } from '../js/data/hvorfor.js';
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
  // UN4: Uranus' måner (NSSDC)
  const mu = Object.fromEntries([...MU.MÅNER, ...MU.SMÅ].map((m) => [m.id, m]));
  tjek('Uranus\' fem store måner: afstand, radius og omløb fra NSSDC (Miranda 129.900 km og 1,413 døgn, Titania størst med 788,9 km)', mu.miranda.afstand === 129900 && Math.abs(mu.miranda.døgn - 1.413479) < 1e-6 && mu.titania.r === 788.9 && mu.oberon.afstand === 583500 && MU.MÅNER.every((m) => m.r <= 788.9) && Math.abs(mu.miranda.hældning - 4.34) < 1e-9);
  tjek('Cressida indhenter Desdemona hver ca. 21,8 døgn (regnet fra omløbene)', Math.abs(MU.overhaling(mu.cressida, mu.desdemona) - 21.8) < 0.05, MU.overhaling(mu.cressida, mu.desdemona));
  tjek('set fra Uranus\' skyer er Ariel ca. 0,40° bred og Miranda 0,26°, og fra Miranda fylder Uranus ca. 22°', Math.abs(MU.synsvinkel(mu.ariel.r, mu.ariel.afstand - 25559) - 0.40) < 0.01 && Math.abs(MU.synsvinkel(mu.miranda.r, mu.miranda.afstand - 25559) - 0.26) < 0.01 && Math.abs(MU.synsvinkel(25559, mu.miranda.afstand) - 22.7) < 0.5);
  tjek('29 kendte måner med dato, og ved månerne er underteksterne under 160 tegn, og hver måne har en side', MU.ANTAL === 29 && MU.ANTAL_DATO && [...Object.values(MÅNE_STOP), SMÅ_STOP.tekst].every((t) => t.length < 160 && t.endsWith('.')) && [...MU.MÅNER.map((m) => m.id), 'maaner', 'smaa'].every((id) => URANUS_SIDER[id]?.kort && URANUS_SIDER[id].ærligt));
  // UN5: flybyerne og stederne
  const tekster = [...URANUS_TUR, ...NEPTUN_TUR, ...Object.values(URANUS_STED), ...Object.values(NEPTUN_STED)];
  tjek('flybyerne har 5 og 4 stop, og alle undertekster ved stop og steder er under 160 tegn og slutter med et punktum', URANUS_TUR.length === 5 && NEPTUN_TUR.length === 4 && tekster.every((t) => t.tekst.length < 160 && t.tekst.endsWith('.') && t.nu.startsWith('<p><b>Lige nu:</b>')), JSON.stringify(tekster.map((t) => t.tekst.length)));
  const harSide = (sider, rod) => (t) => ['skygge', rod].includes(t.visning ?? t.id) || sider[t.visning ?? t.id]; // Uranus' skygge viser planetens side
  tjek('hvert stop og sted har sin egen side (eller planetens), og "Hvorfor?"-kortene findes', URANUS_TUR.every(harSide(URANUS_SIDER, 'uranus')) && NEPTUN_TUR.every(harSide(NEPTUN_SIDER, 'neptun')) && Object.keys(URANUS_STED).every((id) => URANUS_SIDER[id]) && Object.keys(NEPTUN_STED).every((id) => NEPTUN_SIDER[id]) && [URANUS_SIDE, NEPTUN_SIDE].flatMap((x) => x.emner).flatMap((e) => e.hvorfor ?? []).every((id) => HVORFOR[id]));
  tjek('Uranus\' flyby: i dag, så tilbage til 1986, og resten i 1986 (Voyager 2)', URANUS_TUR.map((t) => t.år).join() === 'nu,tilbage,voyager,voyager,voyager');
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

// ---------- UN4: Uranus' måner ----------
async function uranusUN4() {
  const M = async () => Object.fromEntries((await F('måner')).map((m) => [m.id, m]));
  const træ = await fm(() => atomlabTest.solsystem.træ());
  tjek('træet har "Måner" med de fem store og "Små måner"', ['maaner', 'miranda', 'ariel', 'umbriel', 'titania', 'oberon', 'smaa'].every((id) => træ.some((t) => t.id === id)), JSON.stringify(træ.map((t) => t.id)));
  // Omløbstiden og retningen målt i geometrien: Vinklen falder (med uret set fra IAU's nordpol, som Uranus drejer)
  await F('sætMåneUr', 0);
  const m0 = await M();
  const dt = 40;
  await F('sætMåneUr', dt);
  const m1 = await M();
  const gr = (a) => ((a % 360) + 540) % 360 - 180;
  const fejlOmløb = Object.values(m0).map((m) => {
    const målt = gr(m1[m.id].vinkel - m.vinkel);
    const ventet = -(360 * dt * 450) / (m.døgn * 86400);
    return Math.abs(målt - gr(ventet));
  });
  tjek('månerne kredser med uret set fra IAU\'s nordpol (den vej, Uranus drejer), med NSSDC\'s omløbstider', fejlOmløb.every((f) => f < 0.01) && gr(m1.miranda.vinkel - m0.miranda.vinkel) < 0, JSON.stringify(fejlOmløb.map((f) => f.toFixed(4))));
  // Cressida indhenter Desdemona: forskellen i vinkel vokser med 360° på ca. 21,8 døgn
  const forskel = (m) => gr(m.desdemona.vinkel - m.cressida.vinkel);
  const t2 = 600; // forskellen vokser ca. 52° (under en halv omgang)
  await F('sætMåneUr', t2);
  const m2 = await M();
  const synodisk = (360 * t2 * 450) / 86400 / Math.abs(gr(forskel(m2) - forskel(m0)));
  tjek(`Cressida indhenter Desdemona hver ${synodisk.toFixed(1)}. døgn (målt i 3D-billedet)`, Math.abs(synodisk - 21.8) < 0.2 && Math.abs(m0.miranda.hældning - 4.34) < 1e-9);
  // Kortene og skyggerne
  await s.waitForFunction(() => Object.values(atomlabTest.solsystem.fænomen().måner()).filter((m) => !m.lille).every((m) => m.kort), null, { timeout: 30000, polling: 200 }).catch(() => {});
  const bm = await F('billeder');
  const mm = await M();
  tjek('månernes kort er hentet (Voyagers kort, én kanal)', ['miranda', 'ariel', 'umbriel', 'titania', 'oberon'].every((n) => mm[n].kort), JSON.stringify(Object.keys(bm)));
  tjek('skyggerne: de store måner kaster skygge på Uranus, og alle får Uranus\' skygge', Object.values(mm).every((m) => m.planetSkygge && (m.lille || m.skyggeSat)));
  // Oversigten: banerne ses, månerne er tegnet større (mindst 0,26° i radius), og siden "Månerne"
  await fm(() => atomlabTest.solsystem.gåTil('maaner'));
  await F('hop');
  await toBilleder();
  const mo = await M();
  tjek('oversigten: banerne ses, og de store måner er tegnet større end de er (mindst 0,26°)', ['miranda', 'oberon'].every((n) => mo[n].bane && mo[n].tegnet > 0.25 && mo[n].tegnet > mo[n].rigtig) && (await fm(() => atomlabTest.solsystem.side())).nøgle === 'uranus:maaner', JSON.stringify([mo.oberon, (await fm(() => atomlabTest.solsystem.side())).nøgle]));
  await s.waitForTimeout(300);
  await s.screenshot({ path: `${UD}/uranus-maaner.png` });
  // Tryk på Titania
  const tp = await F('månePlads', 'Titania');
  await s.mouse.click(tp.x, tp.y);
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().visning() === 'titania', null, { timeout: 5000, polling: 100 }).catch(() => {});
  tjek('tryk på Titania besøger den', (await F('visning')) === 'titania', JSON.stringify(tp));
  await F('hop');
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver && atomlabTest.solsystem.fænomen().nær() === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
  const fase = await fm(() => atomlabTest.solsystem.fase());
  const side = await fm(() => atomlabTest.solsystem.side());
  tjek('Titania: underteksten, egen side og stedet i træet', fase?.titel === 'Titania' && side.nøgle === 'uranus:titania' && side.sidst === 'Ærligt talt' && (await fm(() => atomlabTest.solsystem.sted())) === 'titania', JSON.stringify({ fase, n: side.nøgle }));
  const mt = await M();
  const andre = Object.values(mt).filter((m) => m.id !== 'titania' && !m.lille);
  tjek('ved Titania: de andre måner i den rigtige størrelse (højst 0,8 pixel større), og ingen navne', andre.every((m) => m.tegnet - m.rigtig < 0.02 && !m.navn), JSON.stringify(andre.map((m) => [m.id, m.tegnet.toFixed(4), m.rigtig.toFixed(4)])));
  const u0 = await F('måneUr');
  await s.waitForTimeout(600);
  tjek('månerne står stille, mens man besøger en måne', u0 === (await F('måneUr')));
  await s.waitForTimeout(300);
  await s.screenshot({ path: `${UD}/uranus-titania.png` });
  // En måne i Uranus' skygge (ved jævndøgn, 2007): månernes ur spoles frem, så den er i sollys, når man kommer
  await fm(() => atomlabTest.solsystem.gåTil('maaner'));
  await F('sætÅr', 2007.94);
  let fundet = false;
  for (let t = 0; t < 8000 && !fundet; t += 4) { await F('sætMåneUr', t); fundet = await F('iSkygge', 'ariel'); }
  await fm(() => atomlabTest.solsystem.gåTil('ariel'));
  tjek('besøg ved Ariel, der står i Uranus\' skygge (2007): månerne spoles frem, så Ariel er i sollys', fundet && !(await F('iSkygge', 'ariel')));
  await F('sætÅr', 2026.85);
  // De små måner: tegnet større med baner og navne, og de kredser videre
  await fm(() => atomlabTest.solsystem.gåTil('smaa'));
  await F('hop');
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 10000, polling: 100 }).catch(() => {});
  await s.waitForTimeout(1200);
  const ms = await M();
  const u1 = await F('måneUr');
  await s.waitForTimeout(400);
  tjek('"Små måner": de fire små er tegnet større med baner, og månerne kredser videre', ['cressida', 'desdemona', 'cupid', 'belinda'].every((n) => ms[n].bane && ms[n].tegnet > ms[n].rigtig * 2) && (await F('måneUr')) > u1 && (await fm(() => atomlabTest.solsystem.fase()))?.titel === 'Små måner, der kan støde sammen', JSON.stringify(ms.cressida));
  await s.screenshot({ path: `${UD}/uranus-smaa.png` });
  await fm(() => atomlabTest.solsystem.gåTil('uranus'));
  await F('hop');
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
  const v1 = await F('vejr');
  // Buerne og uret i samme kald (ellers kan et billede gå imellem)
  const [bu1, t1] = await fm(() => { const f = atomlabTest.solsystem.fænomen(); return [f.buer(), f.ur().vind]; });
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

// ---------- UN5: træet, stederne og flybyerne ----------
const J = (f) => s.evaluate(f);
const efterFlyvning = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 15000, polling: 100 }).catch(() => {});
async function flybyUN5(id) {
  const navn = id === 'uranus' ? 'Uranus' : 'Neptun';
  const træ = await J(() => atomlabTest.solsystem.træ());
  const ventet = id === 'uranus' ? 'tur,uranus,nordpol,ringe,maaner' : 'tur,neptun,plet,buer';
  tjek(`${navn}: træet har "▶ Flyby · ${id === 'uranus' ? 5 : 4} stop" øverst og Steder`, træ.map((p) => p.id).join().startsWith(ventet) && træ[0].navn.includes(`Flyby · ${id === 'uranus' ? 5 : 4} stop`), JSON.stringify(træ.map((p) => p.id)));
  const klar = await s.waitForFunction(() => atomlabTest.solsystem.fænomen().tur().klar, null, { timeout: 30000, polling: 200 }).then(() => true, () => false);
  tjek(`${navn}: "Start flyby" bliver aktiv, når kortene er hentet`, klar);
  const stop = await J(() => atomlabTest.solsystem.fænomen().flybyStop());
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  const set = [];
  for (let i = 0; i < stop.length; i++) {
    await J(() => atomlabTest.solsystem.fænomen().hop());
    await efterFlyvning();
    // Uranus' stop 2: skyderen kører af sig selv tilbage til 1986
    if (id === 'uranus' && i === 1) {
      const kører = await J(() => atomlabTest.solsystem.fænomen().tur().årTur);
      await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().årTur, null, { timeout: 30000, polling: 200 }).catch(() => {});
      tjek('Uranus\' stop 2: skyderen "År" kører af sig selv fra i dag til januar 1986 og viser 1986', kører && Math.abs((await F('år')) - 1986.07) < 0.01 && (await J(() => [...document.querySelectorAll('#solsystem .skyder-boks')].find((b) => b.textContent.includes('År'))?.querySelector('strong').textContent)) === '1986');
    }
    await s.waitForTimeout(400); // panelet opdateres fire gange i sekundet
    // Neptuns plet: døgnet står stille ved stoppet
    const stille = id === 'neptun' && stop[i].id === 'plet' ? await (async () => { const a = (await F('ur')).døgn; await s.waitForTimeout(500); return a === (await F('ur')).døgn; })() : null;
    set.push(await J(() => ({
      fase: document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', prikker: document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin button').length,
      trin: atomlabTest.solsystem.fænomen().tur().trin, visning: atomlabTest.solsystem.fænomen().visning(), side: atomlabTest.solsystem.side().nøgle,
      lige: document.querySelector('#solsystemForklaring')?.textContent ?? '', knapper: [...document.querySelectorAll('#solsystemForklaring .side-knap')].map((k) => k.dataset.kontakt ?? k.dataset.tid),
      afstand: atomlabTest.solsystem.fænomen().tur().afstand, år: atomlabTest.solsystem.fænomen().år(), skjult: atomlabTest.solsystem.fænomen().solSkjult().skjult,
      plet: atomlabTest.solsystem.fænomen().pletSol(), vejr: atomlabTest.solsystem.fænomen().vejr()?.år1989,
    })));
    set.at(-1).stille = stille;
    await s.screenshot({ path: `${UD}/${id}-flyby-${i + 1}.png` });
    if (i < stop.length - 1) await s.click('#solsystemBjælke button:has-text("Næste")');
  }
  tjek(`${navn}: flybyen går gennem alle stop i rækkefølge med ${stop.length} prikker, og panelet viser stedets side`, set.every((x, i) => x.fase.includes(stop[i].titel) && x.prikker === stop.length && x.visning === stop[i].visning && x.side === (stop[i].egenSide ? `${id}:${stop[i].visning}` : id)) && set.slice(0, -1).every((x, i) => x.trin === i) && set.at(-1).trin === null && /Turen er slut/.test(set.at(-1).lige), JSON.stringify(set.map((x) => [x.fase.slice(0, 20), x.prikker, x.visning, x.side, x.trin])));
  tjek(`${navn}: i det sidste stop står Solen bag planeten`, set.at(-1).skjult, JSON.stringify(set.map((x) => x.skjult)));
  if (id === 'uranus') {
    tjek('Uranus\' flyby: oversigten i dag, Miranda, ringene og skyggen i 1986, og kontakten "Infrarødt" ved ringene', Math.abs(set[0].år - 2026.85) < 0.3 && set.slice(2).every((x) => Math.abs(x.år - 1986.07) < 0.01) && set[3].knapper.includes('Infrarødt (som JWST)'), JSON.stringify(set.map((x) => [x.år, x.knapper])));
    tjek('Uranus\' flyby: oversigten langt ude, Miranda tæt på', set[0].afstand > 50 && set[2].afstand < 1, JSON.stringify(set.map((x) => x.afstand)));
  } else {
    tjek('Neptuns flyby: "Lige nu" ved vindene har Vindene og ⏩, og ved pletten er "Neptun i 1989" slået til', set[1].knapper.join() === 'Vindene,hurtig' && set[2].vejr > 0 && set[2].knapper.includes('Neptun i 1989'), JSON.stringify(set.map((x) => [x.knapper, x.vejr])));
    tjek('Neptuns flyby: pletten står i formiddagssol (ca. 45° over horisonten), og døgnet står stille dér', Math.abs(set[2].plet.højde - 45) < 6 && set[2].stille, JSON.stringify([set[2].plet, set[2].stille]));
  }
  // ✕ midt på turen, og et sted i træet midt på turen stopper turen
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await s.click('#solsystemBjælke button[aria-label="Stop flyby"]');
  await s.waitForTimeout(300);
  tjek(`${navn}: ✕ stopper flybyen og fjerner underteksten`, !(await J(() => document.querySelector('#solsystemVindue .undertekst.fase'))) && (await J(() => atomlabTest.solsystem.knapper()))[0] === '▶ Start flyby');
  const sted = id === 'uranus' ? 'nordpol' : 'buer';
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  await s.click(`#solsystemTræ button[data-sted="${sted}"]`);
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await efterFlyvning();
  await s.waitForTimeout(400);
  const ved = await J(() => ({ trin: atomlabTest.solsystem.fænomen().tur().trin, fase: atomlabTest.solsystem.fase()?.titel, side: atomlabTest.solsystem.side().nøgle, skjult: atomlabTest.solsystem.fænomen().solSkjult().skjult }));
  tjek(`${navn}: et sted i træet midt på turen stopper turen og viser stedet (${sted})`, ved.trin === null && ved.fase === (id === 'uranus' ? 'Nordpolen' : 'Ringbuerne i modlys') && ved.side === `${id}:${sted}` && (id === 'uranus' || ved.skjult), JSON.stringify(ved));
  await s.screenshot({ path: `${UD}/${id}-${sted}.png` });
  if (id === 'neptun') {
    // "Infrarødt (som JWST)" ved Neptun: ringene og buerne lysere, planeten mørkere
    const før = (await F('ringe')).lys;
    await fm(() => atomlabTest.solsystem.trykPå('Infrarødt'));
    await s.waitForFunction(() => atomlabTest.solsystem.fænomen().infrarødt() === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
    const efter = (await F('ringe')).lys, eks = await F('eksponering');
    const stadig = (await F('solSkjult')).skjult; // kameraet drejer ikke af sig selv ved buerne
    await s.screenshot({ path: `${UD}/neptun-buer-ir.png` });
    await fm(() => atomlabTest.solsystem.trykPå('Infrarødt'));
    tjek('Neptun: "Infrarødt" gør ringene 5 gange lysere og planeten mørkere, og Solen er stadig skjult bagefter', Math.abs(efter / før - 5) < 1e-6 && Math.abs(eks - 0.4) < 1e-6 && stadig, JSON.stringify([før, efter, eks, stadig]));
  }
  await J(() => atomlabTest.solsystem.gåTil(atomlabTest.solsystem.valgt()));
  await J(() => atomlabTest.solsystem.fænomen().hop());
}

for (const [id, navn, flad, hæld, kort] of [['uranus', 'Uranus', 24973 / 25559, 97.77, 'uranus-1k.jpg'], ['neptun', 'Neptun', 24341 / 24764, 28.32, 'neptun-1k.jpg']]) {
  await s.click(`#solsystem .sol-klode[data-id="${id}"]`);
  await s.waitForFunction((id) => atomlabTest.solsystem.valgt() === id && atomlabTest.solsystem.fænomen()?.hentet(), id, { timeout: 30000, polling: 200 }).catch(() => {});
  const billeder = await F('billeder');
  tjek(`${navn} åbner, og kortet er hentet (1k i tests, i farver)`, (await F('hentet')) && billeder[kort] === 'farver', JSON.stringify(billeder));
  tjek(`${navn}: sort himmel (ingen tågeskyer)`, !(await fm(() => atomlabTest.solsystem.tåger())));
  const styr = id === 'uranus' ? ['▶ Start flyby', 'År', 'Modlys', 'Infrarødt (som JWST)', 'Navne'] : ['▶ Start flyby', 'Vindene', 'Modlys', 'Neptun i 1989', 'Voyagers farver (1989)', 'Infrarødt (som JWST)'];
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
  if (id === 'uranus') { await uranusUN2(); await uranusUN4(); }
  if (id === 'neptun') await neptunUN3();
  await flybyUN5(id);
}

await s.context().close();
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
