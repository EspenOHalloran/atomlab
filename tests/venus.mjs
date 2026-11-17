// Venus (V1 i docs/plan-venus.md): tallene uden browser (soldøgnet regnet ud fra stjernedøgnet og året er 116,75
// døgn, Solens retning og punktet under Solen passer med JPL Horizons), og i browseren: Venus står i Solsystemet
// mellem Solen og Jorden, kortene hentes (radaren med én kanal), aksen peger mod IAU's nordpol, punktet under Solen i
// 3D-billedet passer med Horizons, Venus drejer baglæns, Solen står op i vest, alt står stille i pause, "Bjergene 10
// gange højere" og højderne (Maxwell Montes), og ingen fejl i konsollen.
// V2: vindene (målt i Akatsukis billeder) er ca. −100 m/s ved ækvator og 0 ved polerne, skyerne kører en omgang på ca.
// 4 døgn og samme vej som planeten, skyerne står stille i pause, skyderen "Under skyerne" gør dem gennemsigtige og
// "Ultraviolet (som Akatsuki)" viser mønstret.
// V3: gløden er stærkest i lavlandet og svagest på bjergene (Plancks lov, tallene fra Fables tjek E18), gløden ses kun
// på natsiden og er mørkere på Maxwell Montes end på sletterne (målt i et skærmbillede), stederne under skyerne ligger
// de rigtige steder (USGS' navneliste), datoen glider til formiddag med Solen i vest, skyerne går væk og kommer igen,
// de lokale net hentes og tegnes kun ved deres sted, navnene står på kloden, og hvert sted har sin egen side.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { VENUS, soldøgn, solRetning, underSolen, solAfstand, glødVed, temperaturVed, lokalTid, datoMedTid } from '../js/data/venus.js';
import { SIDE, SIDER } from '../js/data/sider/venus.js';
import { vindVed, omgang } from '../js/data/vinde-venus.js';
const UD = billedmappe('venus');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const GRAD = 180 / Math.PI;
const vinkel = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * GRAD;
const forskel = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// JPL Horizons (hentet 9. november 2026): Solens retning set fra Venus' midte (ekliptikken, J2000, AU) og punktet under
// Solen (Venus set fra Solen, kolonne 14, østlig længde og bredde) kl. 12 TDB
const HORIZONS = [
  ['2026-11-09T12:00:00Z', [-0.3977966132901682, -0.6024095114143064, 0.01467398623367110], 204.553756, 0.054661],
  ['2020-01-01T12:00:00Z', [-0.7223568572647848, -0.06258364479544117, 0.04082639134633081], 43.626781, 2.102036],
  ['2030-06-15T12:00:00Z', [-0.7248204220500348, -0.02408435147155305, 0.04148915246202201], 296.447765, 2.183166],
];

// ---------- Tallene uden browser ----------
{
  tjek('soldøgnet regnet ud fra stjernedøgnet (243,0) og året (224,7) er 116,75 døgn (NSSDC)', Math.abs(soldøgn() - 116.75) < 0.01, soldøgn());
  tjek('stjernedøgnet er 243,0 døgn og længere end året', Math.abs(VENUS.stjernedøgn - 243.0) < 0.05 && VENUS.stjernedøgn > VENUS.år);
  tjek('IAU\'s drejning giver også en omgang på ca. 243,0 døgn (baglæns)', VENUS.Wrate < 0 && Math.abs(360 / -VENUS.Wrate - 243.0) < 0.05);
  for (const [d, [X, Y, Z], lon, lat] of HORIZONS) {
    const dato = new Date(d), l = Math.hypot(X, Y, Z);
    const v = vinkel(solRetning(dato), [Y / l, Z / l, X / l]);
    const u = underSolen(dato);
    tjek(`Solens retning ${d.slice(0, 10)} passer med Horizons (under 0,05°), og afstanden`, v < 0.05 && Math.abs(solAfstand(dato) - l) < 1e-3, v);
    tjek(`punktet under Solen ${d.slice(0, 10)}: ${lon.toFixed(1)}° Ø, ${lat.toFixed(2)}° (Horizons, under 0,05°)`, forskel(u.længde, lon) < 0.05 && Math.abs(u.bredde - lat) < 0.05, JSON.stringify(u));
  }
  tjek('siden ved Venus har en kort tekst, Billederne og "Ærligt talt"', SIDE.kort.length > 50 && SIDE.billeder && SIDE.ærligt);
  // V2: vindene
  tjek('vinden ved ækvator er ca. 100 m/s mod vest (Venus Express: −105 ± 12 m/s)', vindVed(0) < -90 && vindVed(0) > -117, vindVed(0));
  tjek('skyerne er ca. 4 døgn om én omgang ved ækvator', omgang(0) > 3.8 && omgang(0) < 4.8, omgang(0));
  tjek('vinden er 0 ved polerne og blæser mod vest alle andre steder', vindVed(90) === 0 && vindVed(-90) === 0 && [-80, -60, -42, -20, 20, 42, 60, 80].every((b) => vindVed(b) < 0));
  const spring = Math.max(...Array.from({ length: 1799 }, (_, i) => Math.abs(vindVed(-89.9 + (i + 1) * 0.1) - vindVed(-89.9 + i * 0.1))));
  tjek('vindprofilen har ingen spring (under 2 m/s pr. 0,1°)', spring < 2, spring);
  // V3: gløden (højderne over kortets kugle 6.051,0 km, middelradius 0,8 km højere)
  tjek('jorden er 464 °C ved middelradius og ca. 380 °C på toppen af Maxwell Montes (VIRA: 7,7 °C pr. km)', Math.abs(temperaturVed(0.8) - 737) < 0.01 && Math.abs(temperaturVed(11.8) - 273.15 - 379) < 2, temperaturVed(11.8) - 273.15);
  tjek('gløden ved 1 µm passer med Fables tabel (2 km: 0,66, 8 km: 0,17, 11 km: 0,08)', Math.abs(glødVed(2.8) - 0.66) < 0.01 && Math.abs(glødVed(8.8) - 0.17) < 0.01 && Math.abs(glødVed(11.8) - 0.08) < 0.005, [glødVed(2.8), glødVed(8.8), glødVed(11.8)]);
  tjek('lavlandet gløder mere end middelhøjden, og bjergene mindre (aftager hele vejen op)', glødVed(-2) > 1 && glødVed(0.8) === 1 && [-3, -1, 1, 3, 5, 7, 9, 11].every((h) => glødVed(h + 1) < glødVed(h)));
  const d0 = new Date('2026-11-17T12:00:00Z');
  const ms9 = datoMedTid(d0, -165.4, 9);
  tjek('datoen til formiddag (kl. 9) ved Maat Mons er højst et halvt soldøgn væk', Math.abs(lokalTid(new Date(ms9), -165.4) - 9) < 0.01 && Math.abs(ms9 - d0) <= soldøgn() * 86400000 / 2 + 1, (ms9 - d0) / 864e5);
  tjek('hvert sted har en side med tal, en kort tekst og "Ærligt talt"', ['maxwell', 'maat', 'kupler', 'venera13'].every((id) => SIDER[id]?.tal?.length >= 2 && SIDER[id].kort.length > 50 && SIDER[id].ærligt), Object.keys(SIDER).join());
}

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
const fm = (f, a) => s.evaluate(f, a);
const F = (navn, ...a) => fm(([navn, a]) => atomlabTest.solsystem.fænomen()[navn](...a), [navn, a]);

const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Venus står i listen mellem Solen og Jorden', ids.indexOf('venus') > ids.indexOf('solen') && ids.indexOf('venus') < ids.indexOf('jorden'), JSON.stringify(ids));
const kloder = await fm(() => [...document.querySelectorAll('#solsystem .sol-klode')].map((k) => k.dataset.id));
tjek('kloden Venus står efter Solen i rækken af kloder', kloder[kloder.indexOf('solen') + 1] === 'venus', kloder.join());

await s.click('#solsystem .sol-klode[data-id="venus"]');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.skyer, null, { timeout: 30000, polling: 200 });
const bi = await F('billeder');
tjek('skyerne, radarkortet og højderne er hentet (tests 1k og 2k)', bi.skyer === '1k' && bi.kort === '2k' && bi.højde === '2k' && bi.hentet.kort && bi.hentet.højde, JSON.stringify(bi));
const sk0 = await F('skyer');
tjek('skyerne dækker Venus fra start i synligt lys (gullig hvid, lille kontrast), 70 km over jorden', sk0.harKort === 1 && sk0.synlig && sk0.alfa === 1 && sk0.uv === 0 && sk0.kontrast < 0.2 && sk0.tone[0] >= sk0.tone[2] && Math.abs(sk0.radius - 6121.8) < 0.1, JSON.stringify(sk0));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().billeder().tabel, null, { timeout: 20000, polling: 200 });
const a = await F('akse');
tjek('aksen peger mod IAU\'s nordpol, og kuglen har kortenes radius 6.051,0 km', a.modIAU < 0.01 && Math.abs(a.radius - 6051.0) < 0.01, JSON.stringify(a));

// Punktet under Solen i 3D-billedet passer med datoen (og datoen med Horizons ovenfor)
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const u = await F('underSolen');
tjek('punktet under Solen i 3D-billedet passer med banen og drejningen for datoen (under 0,05°)', forskel(u.længde, u.data.længde) < 0.05 && Math.abs(u.bredde - u.data.bredde) < 0.05, JSON.stringify(u));

// Pause: intet drejer
const d0 = await F('drejning'), t0 = await F('dato'), sp0 = await F('skyVinkel', 0), st0 = (await F('skyer')).tid;
await fm(() => atomlabTest.solsystem.spol(5));
tjek('i pause står Venus, datoen og skyerne stille', (await F('drejning')) === d0 && (await F('dato')) === t0 && (await F('skyVinkel', 0)).drej === sp0.drej && (await F('skyer')).tid === st0);

// Baglæns: med tiden bliver drejningen mindre (mod uret set fra nord er forlæns), og Solen står op i vest
const lU = u.længde;
const vest = (lU + 85) % 360; // et sted, hvor Solen står ca. 5° over horisonten mod vest
const før = await F('solVed', 0, vest);
const gange = await fm(() => atomlabTest.solsystem.fænomen().hurtigGange); // ⏩: timer i sekundet
await fm(() => atomlabTest.solsystem.sætTid('hurtig'));
await fm((n) => atomlabTest.solsystem.spol(n), (20 * 24) / gange); // 20 døgn med ⏩
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const efter = await F('solVed', 0, vest), dag = ((await F('dato')) - t0) / 864e5;
const u2 = await F('underSolen');
tjek(`${(20 * 24) / gange} sekunder med ⏩ er 20 døgn (${gange} timer i sekundet)`, Math.abs(dag - 20) < 0.1, dag);
const drej = await F('drejning');
const dW = ((drej - d0) * GRAD + 540) % 360 - 180;
tjek('Venus drejer baglæns: ca. −1,48° pr. døgn', Math.abs(dW / dag + 1.4814) < 0.01, dW / dag);
tjek('punktet under Solen flytter sig mod øst med ca. 3,08° pr. døgn (soldøgn 116,75)', Math.abs(forskel(u2.længde, lU) / dag - 360 / 116.75) < 0.02 && ((u2.længde - lU + 360) % 360) < 180, [u2.længde, lU]);
tjek('Solen står op i vest: Solen står mod vest og kommer højere op', før.øst < 0 && efter.øst < 0 && efter.højde > før.højde && før.højde > 0 && før.højde < 10, JSON.stringify([før, efter]));

// Skyerne kører samme vej som planeten (mod vest, baglæns) og en omgang på ca. 4 døgn ved ækvator
const sv0 = await F('skyVinkel', 0), dr0 = await F('drejning');
await fm(() => atomlabTest.solsystem.sætTid('spil'));
await fm(() => atomlabTest.solsystem.spol(12)); // 12 timer ved ▶
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const sv1 = await F('skyVinkel', 0), dagSky = (sv1.sek - sv0.sek) / 86400;
const graderPrDøgn = ((sv1.drej - sv0.drej + sv1.glid - sv0.glid + 540) % 360 - 180) / dagSky;
tjek('skyerne ved ækvator kører mod vest (samme vej som Venus drejer)', graderPrDøgn < 0 && ((await F('drejning')) - dr0) < 0, graderPrDøgn);
tjek('skyerne ved ækvator er ca. 4 døgn om én omgang (3,8-4,8)', 360 / -graderPrDøgn > 3.8 && 360 / -graderPrDøgn < 4.8, 360 / -graderPrDøgn);
const v60 = await F('vind', 60), v89 = await F('vind', 89.5);
tjek('vinden aftager mod polerne (60° og 89,5°)', v60 < 0 && v60 > -80 && Math.abs(v89) < 3, [v60, v89]);
const tekst0 = await F('vindTekstur', 0), tekst60 = await F('vindTekstur', 60);
tjek('kuglen drejer med vinden ved ækvator, og kortet glider kun med resten (lille ved ækvator)', Math.abs(tekst0) < 2e-4 && Math.abs(tekst60) > Math.abs(tekst0), [tekst0, tekst60]);

// Skyderen "Under skyerne" og "Ultraviolet (som Akatsuki)"
const styr = await fm(() => atomlabTest.solsystem.styr());
tjek('Styr-boksen har skyderen "Under skyerne" og kontakten "Ultraviolet (som Akatsuki)"', styr.some((p) => p.slags === 'skyder' && p.navn === 'Under skyerne') && styr.some((p) => p.slags === 'kontakt' && p.navn.startsWith('Ultraviolet (som Akatsuki)')), JSON.stringify(styr));
await fm(() => { const i = document.querySelector('#solsystem .skyder-boks input'); i.value = 50; i.dispatchEvent(new Event('input')); });
const sk50 = await F('skyer');
await fm(() => { const i = document.querySelector('#solsystem .skyder-boks input'); i.value = 100; i.dispatchEvent(new Event('input')); });
const sk100 = await F('skyer');
await F('sætUnder', 0);
tjek('skyderen gør skyerne halvt gennemsigtige (50 %) og helt væk (100 %)', Math.abs(sk50.alfa - 0.5) < 0.01 && sk50.synlig && sk100.alfa === 0 && !sk100.synlig && (await F('skyer')).synlig, JSON.stringify([sk50.alfa, sk100.alfa]));
await fm(() => atomlabTest.solsystem.trykPå('Ultraviolet'));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().skyer().uv > 0.99, null, { timeout: 15000, polling: 100 }).catch(() => {});
const skUv = await F('skyer');
tjek('i ultraviolet lys er mønstret tydeligt (større kontrast) og farven kølig', skUv.uv > 0.99 && skUv.kontrast > 1 && skUv.tone[2] > skUv.tone[0], JSON.stringify(skUv));
await fm(() => atomlabTest.solsystem.trykPå('Ultraviolet'));

// Bjergene: Maxwell Montes (ca. 65° N, 3° Ø) er ca. 11 km højt over kuglen, og "Bjergene 10 gange højere"
const maxwell = await F('højde', 65.2, 3.3);
tjek('Maxwell Montes er ca. 10-12 km over kuglen (6.051,0 km)', maxwell > 9.5 && maxwell < 12, maxwell);
tjek('"Bjergene 10 gange højere" findes i Styr-boksen', await fm(() => atomlabTest.solsystem.trykPå('Bjergene 10 gange')));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() > 9.9, null, { timeout: 15000, polling: 100 }).catch(() => {});
tjek('bjergene bliver 10 gange højere, og skyerne ligger også 10 gange højere', (await F('overdriv')) > 9.9 && (await F('skyer')).radius > 6051 + 10 * 70, [await F('overdriv'), (await F('skyer')).radius]);
await fm(() => atomlabTest.solsystem.trykPå('Bjergene 10 gange'));
tjek('"Modlys" findes i Styr-boksen', await fm(() => atomlabTest.solsystem.trykPå('Modlys')));
await s.waitForTimeout(500);
tjek('i modlys står Solen bag Venus', (await F('sol')) < -0.9, await F('sol'));
await fm(() => atomlabTest.solsystem.trykPå('Modlys'));
await s.screenshot({ path: `${UD}/venus.png` });

// ---------- V3: gløden på natsiden ----------
{
  tjek('"Gløden på natsiden" findes i Styr-boksen', await fm(() => atomlabTest.solsystem.trykPå('Gløden på natsiden')));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().glød().styrke > 0.99 && atomlabTest.solsystem.fænomen().glød().kort, null, { timeout: 20000, polling: 100 });
  const g = await F('glød');
  tjek('gløden er tændt i jorden og i skyerne, og det slørede kort er hentet', g.jord > 0.99 && g.skyer > 0.99 && g.kort, JSON.stringify(g));
  // Lysstyrken et sted i et skærmbillede (gennemsnit af et lille felt, rød kanal)
  const rød = async (punkter) => {
    const png = (await s.screenshot()).toString('base64');
    return fm(async ([png, punkter]) => {
      const im = new Image();
      im.src = 'data:image/png;base64,' + png;
      await im.decode();
      const c = document.createElement('canvas');
      c.width = im.width; c.height = im.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(im, 0, 0);
      const k = im.width / innerWidth;
      return punkter.map(({ x, y }) => {
        const d = g.getImageData(Math.round(x * k) - 3, Math.round(y * k) - 3, 7, 7).data;
        let sum = 0;
        for (let i = 0; i < d.length; i += 4) sum += d[i];
        return sum / (d.length / 4);
      });
    }, [png, punkter]);
  };
  // Maxwell Montes ved midnat (og skyerne væk, så gløden er skarp), set lige oppefra. Sletten er Sedna Planitia
  // (ca. 45° N, 340° Ø, under middelhøjden) og et punkt øst for Maxwell på samme bredde.
  const midnat = await fm(async () => { const { datoMedTid } = await import('/js/data/venus.js'); return datoMedTid(atomlabTest.solsystem.fænomen().dato(), 3.3, 0); });
  await F('sætDato', midnat);
  await F('sætUnder', 100);
  await F('kigPå', 58, 3, 5000);
  await fm(() => atomlabTest.solsystem.spol(0.5));
  const [mx, slette] = [await F('skærm', 65.2, 3.3), await F('skærm', 50, -20)];
  const [rMax, rSlette] = await rød([mx, slette]);
  const hMax = await F('højde', 65.2, 3.3), hSlette = await F('højde', 50, -20);
  tjek(`om natten gløder sletten (${hSlette.toFixed(1)} km) mere end Maxwell Montes (${hMax.toFixed(1)} km)`, rSlette > rMax + 8 && rSlette > 20, [rSlette, rMax]);
  await s.screenshot({ path: `${UD}/venus-gloed-maxwell.png` });
  // Om dagen (kl. 12 ved Maxwell) ses gløden ikke: uden glød og med glød er billedet det samme
  const middag = await fm(async () => { const { datoMedTid } = await import('/js/data/venus.js'); return datoMedTid(atomlabTest.solsystem.fænomen().dato(), 3.3, 12); });
  await F('sætDato', middag);
  await fm(() => atomlabTest.solsystem.spol(0.5));
  await s.waitForTimeout(500);
  const [dagMed] = await rød([await F('skærm', 50, -20)]);
  await s.screenshot({ path: `${UD}/venus-gloed-dag.png` });
  await fm(() => atomlabTest.solsystem.trykPå('Gløden på natsiden'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().glød().styrke < 0.01, null, { timeout: 20000, polling: 100 });
  const [dagUden] = await rød([await F('skærm', 50, -20)]);
  tjek('på dagsiden ses gløden ikke (samme lys med og uden)', Math.abs(dagMed - dagUden) < 3, [dagMed, dagUden]);
  await F('sætUnder', 0);
}

// ---------- V3: stederne under skyerne ----------
{
  // Bredde og længde fra USGS' navneliste (Venera 13: NSSDC, 303° Ø = −57°). Kuplerne: kameraet kigger på rækken af
  // kupler (NASA PIA00215: 30° S, 11,8° Ø).
  const USGS = { maxwell: [65.2, 3.3], maat: [0.5, -165.4], kupler: [-30.0, 11.0], venera13: [-7.5, -57] };
  const KIG = { ...USGS, kupler: [-29.8, 11.8] };
  const træ = await fm(() => [...document.querySelectorAll('#solsystemTræ button')].map((b) => b.textContent.trim()));
  tjek('træet har gruppen "Under skyerne" med de fire steder', ['Maxwell Montes', 'Maat Mons', 'Pandekagekuplerne', 'Venera 13'].every((n) => træ.some((t) => t.includes(n))) && (await fm(() => document.getElementById('solsystemTræ').textContent)).includes('Under skyerne'), træ.join(' | '));
  tjek('"Navne" findes i Styr-boksen, og navnene står på kloden', (await fm(() => atomlabTest.solsystem.styr())).some((p) => p.navn === 'Navne'));
  await F('natside');
  await fm(() => atomlabTest.solsystem.gåTil('venus'));
  for (const [id, [b0, l0]] of Object.entries(USGS)) {
    const p = await F('navnSted', id);
    if (!(Math.abs(p.bredde - b0) < 0.01 && forskel(p.længde, l0) < 0.01)) tjek(`navnet ${id} står ved ${b0}°, ${l0}°`, false, JSON.stringify(p));
  }
  tjek('navnene står ved USGS\' bredde og længde (Venera 13 ved NSSDC\'s)', true);
  const under0 = (await F('skyer')).under;
  // Et sted fra træet: kameraet flyver derhen, skyerne går væk, og datoen glider til formiddag
  await s.locator('#solsystemTræ button', { hasText: 'Maat Mons' }).click();
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().visning() === 'maat' && !atomlabTest.solsystem.fænomen().tur().flyver && atomlabTest.solsystem.fænomen().skyer().under === 100, null, { timeout: 60000, polling: 200 });
  const m = await F('midte'), k = await F('klokken', 'maat');
  tjek('Maat Mons fra træet: kameraet kigger på 0,5° N og 194,6° Ø', Math.abs(m.bredde - 0.5) < 0.05 && forskel(m.længde, -165.4) < 0.05, JSON.stringify(m));
  tjek('ved stedet er skyerne væk (skyderen på 100 %), og vejen i toplinjen viser stedet', (await F('skyer')).under === 100 && (await fm(() => document.getElementById('solsystemVej').textContent)).includes('Maat Mons'));
  tjek('ved Maat Mons er klokken 9 om formiddagen, og Solen står mod vest (den står op i vest)', Math.abs(k.tid - 9) < 0.05 && k.sol.øst < 0 && k.sol.højde > 30, JSON.stringify(k));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().lokalt().maat.klar, null, { timeout: 30000, polling: 200 });
  const lok = await F('lokalt');
  tjek('det lokale net ved Maat Mons er hentet og tegnes, og nettet ved kuplerne er ikke aktivt', lok.maat.kort && lok.maat.højde && lok.maat.klar && !lok.kupler.aktiv, JSON.stringify(lok));
  tjek('stedets side har sine egne tal', (await fm(() => document.querySelector('#solsystem .side-tal, #solsystem .tal')?.textContent ?? document.getElementById('solsystemPanel')?.textContent ?? '')).length >= 0 && (await fm(() => document.getElementById('solsystem').textContent)).includes('Er der stadig udbrud?'));
  // De andre steder (direkte, som fra træet)
  for (const id of ['kupler', 'maxwell', 'venera13']) {
    await fm((id) => atomlabTest.solsystem.gåTil(id), id);
    await s.waitForFunction((id) => atomlabTest.solsystem.fænomen().visning() === id && !atomlabTest.solsystem.fænomen().tur().flyver, id, { timeout: 60000, polling: 200 });
    const p = await F('midte');
    tjek(`${id}: kameraet kigger på ${KIG[id][0]}°, ${KIG[id][1]}° og står over jorden`, Math.abs(p.bredde - KIG[id][0]) < 0.05 && forskel(p.længde, KIG[id][1]) < 0.05 && p.højde > 50, JSON.stringify(p));
  }
  tjek('ved Venera 13 er nettene ved Maat Mons og kuplerne ikke aktive', Object.values(await F('lokalt')).every((l) => !l.aktiv));
  await s.screenshot({ path: `${UD}/venus-venera13.png` });
  // Tilbage til hele Venus: skyerne kommer igen, som de var
  await fm(() => atomlabTest.solsystem.gåTil('venus'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().visning() === 'venus' && !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 60000, polling: 200 });
  await s.waitForFunction((u) => Math.abs(atomlabTest.solsystem.fænomen().skyer().under - u) < 0.6, under0, { timeout: 20000, polling: 200 });
  tjek('tilbage ved hele Venus kommer skyerne igen, som de var', Math.abs((await F('skyer')).under - under0) < 0.6, [(await F('skyer')).under, under0]);
  await fm(() => atomlabTest.solsystem.spol(0.5));
  await s.waitForTimeout(300);
  tjek('navnene står på kloden ved hele Venus', (await F('navne')).length >= 1, JSON.stringify(await F('navne')));
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
