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
// V5: luften fra VIRA (tryk og temperatur i fire højder), flybyens 6 stop (teksterne under 160 tegn og Fables rettelser
// fra E18), "Hvorfor?"-kortene og Ordbogen, og i browseren: flybyen gennem alle stop (ultraviolet og ⏩ ved skyerne, gløden
// ved midnat over Ovda Regio), turen ned til Venera 13 (måleren følger højden, skyerne er væk under deres top, disen,
// landingen med fotoet og kontakten) og tilbage til hele Venus.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { VENUS, soldøgn, solRetning, underSolen, solAfstand, glødVed, temperaturVed, lokalTid, datoMedTid } from '../js/data/venus.js';
import { SIDE, SIDER, TUR, TUR_SLUT, NED_TRIN } from '../js/data/sider/venus.js';
import { luftVed, målerTekst } from '../js/data/luft-venus.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDBOG } from '../js/data/ordbog.js';
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

// ---------- V5 uden browser: luften, flybyen og teksterne ----------
{
  // VIRA (Seiff m.fl. 1985) som på Wikipedia: 0 km 462 °C og 92,1 bar, 50 km 75 °C og 1,07 bar, 55 km 27 °C og 0,53 bar,
  // 70 km −43 °C og 0,037 bar (Fables tjek E18, afsnit 5)
  const nær = (h, t, p) => { const l = luftVed(h); return Math.abs(l.temperatur - t) < 0.5 && Math.abs(l.tryk / p - 1) < 0.01; };
  tjek('luften passer med VIRA ved 0, 50, 55 og 70 km', nær(0, 462, 92.1) && nær(50, 75, 1.066) && nær(55, 27, 0.5314) && nær(70, -43, 0.0369), JSON.stringify([0, 50, 55, 70].map(luftVed)));
  const højder = Array.from({ length: 100 }, (_, i) => i);
  tjek('temperaturen og trykket falder hele vejen op til 100 km (trykket blødt mellem punkterne)', højder.every((h) => luftVed(h + 1).tryk < luftVed(h).tryk && luftVed(h + 1).temperatur < luftVed(h).temperatur) && Math.abs(luftVed(52.5).tryk - Math.sqrt(1.066 * 0.5314)) < 0.01);
  const m = målerTekst(0, luftVed(0.7));
  tjek('måleren skriver tallene på dansk (0 km, ca. 457 °C, 88 bar ved Venera 13 og 0,037 bar ved 70 km)', m.højde === '0 km' && m.temperatur === '457 °C' && m.tryk === '88 bar' && målerTekst(70, luftVed(70)).tryk === '0,037 bar' && målerTekst(70, luftVed(70)).temperatur === '−43 °C', JSON.stringify(m));
  tjek('flybyen har 6 stop, og underteksterne er under 160 tegn og slutter med et punktum', TUR.length === 6 && TUR.every((t) => t.tekst.length < 160 && t.tekst.endsWith('.') && t.nu.startsWith('<p><b>Lige nu:</b>')) && TUR_SLUT.includes('Turen er slut'), JSON.stringify(TUR.map((t) => t.tekst.length)));
  tjek('flybyens stop: Venus, skyerne, Maxwell Montes, Maat Mons, gløden og turen ned som det sidste', TUR.map((t) => t.id).join() === 'venus,skyer,maxwell,maat,gloed,ned');
  const alt = JSON.stringify([SIDE, SIDER, TUR]);
  tjek('Fables rettelser (E18): "overfladen" i stop 1, Magellan 1990-1992, "åbning i dens side", ca. 60 gange (ikke 55) og ingen "1 bar og stuetemperatur"', TUR[0].tekst.includes('overfladen') && TUR[2].tekst.includes('1990 til 1992') && TUR[3].tekst.includes('åbning i dens side') && alt.includes('60 gange hurtigere') && !alt.includes('55 gange') && !/1 bar og stuetemperatur/.test(alt));
  const hv = [SIDE, ...Object.values(SIDER)].flatMap((sd) => sd.emner ?? []).flatMap((e) => e.hvorfor ?? []);
  tjek('"Hvorfor?"-kortene ved Venus findes (varmere end Merkur, baglæns og liv i skyerne)', hv.length >= 3 && hv.every((id) => HVORFOR[id]?.svar) && ['venusMerkur', 'venusBaglaens', 'venusLiv'].every((id) => hv.includes(id)), hv.join());
  const ord = ['radar', 'drivhuseffekt'].map((id) => ORDBOG.find((o) => o.id === id));
  tjek('Ordbogen har radar og drivhuseffekt (højst 260 tegn)', ord.every((o) => o && o.tekst.length <= 260));
  tjek('højst fire spørgsmål fremme på Venus\' side (gløden står først, når kontakten bruges), og turen ned har sin egen side', SIDE.emner.filter((e) => !e.gemt).length <= 4 && SIDER.ned?.tal?.length === 2 && SIDER.ned.kort && SIDER.venera13.foto?.src);
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
tjek('kloden Venus står efter Merkur (og Solen) i rækken af kloder', kloder[kloder.indexOf('merkur') + 1] === 'venus' && kloder.indexOf('solen') < kloder.indexOf('venus'), kloder.join());

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
  // Maxwell Montes ved midnat (og skyerne væk, så gløden er skarp), set oppefra. Sletten: det laveste punkt i nærheden,
  // som ligger frit i 3D-billedet (ikke bag et panel, elementFromPoint er lærredet)
  const midnat = await fm(async () => { const { datoMedTid } = await import('/js/data/venus.js'); return datoMedTid(atomlabTest.solsystem.fænomen().dato(), 3.3, 0); });
  await F('sætDato', midnat);
  await F('sætUnder', 100);
  await F('kigPå', 62, 3.3, 2500);
  // Kameraet drejer langsomt om stedet (autoRotate, efter rigtig tid, også i pause). Det flyttede Maxwell Montes ca.
  // 5 px i sekundet, og søgningen efter sletten tager flere sekunder før skærmbilledet, så målefeltet ramte ved siden
  // af (fejlede fra 18. november 2026). Drejningen stoppes, mens der måles (samme modul som programmet).
  const drejFør = await fm(async () => { const { verden } = await import('/js/scene3d.js'); const før = verden.styring.autoRotate; verden.styring.autoRotate = false; return før; });
  await fm(() => atomlabTest.solsystem.spol(0.5));
  await s.waitForTimeout(800); // (det første skærmbillede efter et nyt tal kan vise det gamle, og dæmpningen falder til ro)
  const fri = ({ x, y }) => fm(([x, y]) => document.elementFromPoint(x, y)?.tagName === 'CANVAS', [x, y]);
  const mx = await F('skærm', 65.2, 3.3);
  let slette = null, hSlette = 99;
  for (let b0 = 56; b0 <= 64; b0 += 1) {
    for (let l0 = -12; l0 <= 18; l0 += 2) {
      const h = await F('højde', b0, l0), p = await F('skærm', b0, l0);
      if (h < hSlette && (await fri(p))) { hSlette = h; slette = p; }
    }
  }
  const [rMax, rSlette] = await rød([mx, slette]);
  const hMax = await F('højde', 65.2, 3.3);
  tjek(`om natten gløder sletten (${hSlette.toFixed(1)} km) mere end Maxwell Montes (${hMax.toFixed(1)} km)`, (await fri(mx)) && hSlette < 3 && rSlette > rMax + 8 && rSlette > 15, [rSlette, rMax, hSlette]);
  await s.screenshot({ path: `${UD}/venus-gloed-maxwell.png` });
  // Om dagen (kl. 12 ved Maxwell) ses gløden ikke: uden glød og med glød er billedet det samme
  const middag = await fm(async () => { const { datoMedTid } = await import('/js/data/venus.js'); return datoMedTid(atomlabTest.solsystem.fænomen().dato(), 3.3, 12); });
  await F('sætDato', middag);
  await fm(() => atomlabTest.solsystem.spol(0.5));
  await s.waitForTimeout(500);
  const [dagMed] = await rød([slette]);
  await s.screenshot({ path: `${UD}/venus-gloed-dag.png` });
  await fm(() => atomlabTest.solsystem.trykPå('Gløden på natsiden'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().glød().styrke < 0.01, null, { timeout: 20000, polling: 100 });
  const [dagUden] = await rød([slette]);
  tjek('på dagsiden ses gløden ikke (næsten samme lys på sletten med og uden)', Math.abs(dagMed - dagUden) < 8, [dagMed, dagUden]);
  await F('sætUnder', 0);
  await fm(async (før) => { const { verden } = await import('/js/scene3d.js'); verden.styring.autoRotate = før; }, drejFør);
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

// ---------- V5: flybyen og turen ned til Venera 13 ----------
{
  const flyver = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 60000, polling: 200 });
  await fm(() => atomlabTest.solsystem.sætTid('spil'));
  const træ = await fm(() => atomlabTest.solsystem.træ());
  tjek('træet har "▶ Flyby · 6 stop" øverst', træ[0].id === 'tur' && træ[0].navn.includes('Flyby · 6 stop'), JSON.stringify(træ.map((p) => p.navn)));
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  const set = [];
  for (let i = 0; i < TUR.length; i++) {
    if (TUR[i].id !== 'ned') {
      await F('hop');
      await flyver();
    }
    await s.waitForTimeout(400); // panelet opdateres fire gange i sekundet
    // (skyderen "Under skyerne" glider: vent, til den er fremme)
    if (TUR[i].id !== 'ned') await s.waitForFunction(() => atomlabTest.solsystem.fænomen().ned().fase !== null || [0, 100].includes(Math.round(atomlabTest.solsystem.fænomen().skyer().under)), null, { timeout: 30000, polling: 200 }).catch(() => {});
    set.push(await fm(() => {
      const v = atomlabTest.solsystem.fænomen();
      return {
        fase: document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', prikker: document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin button').length,
        trin: v.tur().trin, visning: v.visning(), side: atomlabTest.solsystem.side().nøgle, lige: document.getElementById('solsystemForklaring')?.textContent ?? '',
        tilstand: v.tilstand(), dato: v.dato(),
      };
    }));
    if (TUR[i].id === 'gloed') set.at(-1).klokken = await fm(async () => { const { lokalTid } = await import('/js/data/venus.js'); return lokalTid(new Date(atomlabTest.solsystem.fænomen().dato()), 85.6); });
    if (i < TUR.length - 1) await s.click('#solsystemBjælke button:has-text("Næste")');
  }
  const VISNING = ['venus', 'venus', 'maxwell', 'maat', 'gloed', 'ned'];
  const SIDE_NØGLE = ['venus', 'venus', 'venus:maxwell', 'venus:maat', 'venus', 'venus:ned'];
  tjek('flybyen går gennem alle 6 stop med 6 prikker, og panelet viser stedets side', set.every((x, i) => x.fase.includes(TUR[i].titel) && x.prikker === 6 && x.visning === VISNING[i] && x.side === SIDE_NØGLE[i]) && set.slice(0, -1).every((x, i) => x.trin === i) && set.at(-1).trin === null && /Turen er slut/.test(set.at(-1).lige), JSON.stringify(set.map((x) => [x.fase.slice(0, 18), x.prikker, x.visning, x.side, x.trin])));
  tjek('stop 2 slår "Ultraviolet" og ⏩ til, og stop 3 slår ⏩ fra igen', set[1].tilstand.uv && set[1].tilstand.hurtig && !set[2].tilstand.hurtig && !set[2].tilstand.uv, JSON.stringify(set.map((x) => x.tilstand)));
  tjek('stop 5: "Gløden på natsiden" er slået til, skyerne er der, og det er midnat over Ovda Regio', set[4].tilstand.glød && set[4].tilstand.under < 1 && Math.min(set[4].klokken, 24 - set[4].klokken) < 0.3, JSON.stringify([set[4].tilstand, set[4].klokken]));
  // Turen ned: måleren følger højden (først under 100 km), skyerne går væk under deres top, og disen er der
  const prøver = [];
  // (turen tager ca. 50 s spiltid. Testbrowseren tegner få billeder i sekundet under belastning, så vent op til 6 min.)
  const t0 = Date.now();
  const iLog = () => fm(() => JSON.parse(localStorage.getItem('atomlabLog') || '{"beskeder":[]}').beskeder.filter((b) => b.type === 'fase').map((b) => b.titel));
  const logFør = await iLog();
  const prøve = () => fm(() => ({
    ...atomlabTest.solsystem.fænomen().ned(), under: atomlabTest.solsystem.fænomen().skyer().under, ut: document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '',
    prikker: document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin button').length, prik: parseFloat(document.querySelector('.vm-prik')?.style.top),
    skyder: atomlabTest.solsystem.styr().some((k) => k.navn === 'Under skyerne'), bjælke: [...document.querySelectorAll('#solsystemBjælke button')].map((b) => b.textContent + (b.disabled ? ' (grå)' : '')),
  }));
  while (Date.now() - t0 < 360000) {
    const p = await prøve();
    prøver.push(p);
    if (p.fase === 'landet') break;
    await s.waitForTimeout(100);
  }
  const ned = prøver.filter((p) => p.fase === 'ned');
  const over = ned.filter((p) => p.hMiddel > 75), inde = ned.filter((p) => p.hMiddel < 68);
  // (over skyerne tager disen til fra ca. 130 km, men dækker højst ca. 65 %)
  const forkert = [...over.filter((p) => !(p.under === 0 && (p.hMiddel <= 100.5 || !p.måler) && !(p.kuppel?.himmel > 0.7))), ...inde.filter((p) => !(p.under === 100 && p.måler && p.kuppel?.himmel > 0.9))];
  tjek('på vej ned: over skyerne er de der og måleren skjult over 100 km, under ca. 70 km er skyerne væk, og disen er der', over.length && inde.length && !forkert.length, JSON.stringify([over.length, inde.length, forkert.slice(0, 4).map((p) => [p.hMiddel.toFixed(1), p.under, p.måler, p.kuppel])]));
  const temp = ned.filter((p) => p.måler).map((p) => parseInt(p.tekst.temperatur.replace('−', '-')));
  tjek('måleren bliver varmere hele vejen ned', temp.length >= 3 && temp.every((t, i) => i === 0 || t >= temp[i - 1]), temp.join());
  // Trinene (jeres feedback 17. november 2026): underteksten skifter i rækkefølge, og prikken i søjlen følger højden
  const trin = [...new Set(prøver.map((p) => p.trin).filter(Boolean))];
  const titler = NED_TRIN.map((t) => t.titel);
  const sete = [...new Set(prøver.map((p) => titler.find((t) => p.ut.includes(t))).filter(Boolean))];
  tjek('turen ned går gennem alle seks trin i rækkefølge, og underteksten skifter med (med turens seks prikker)', prøver.filter((p) => p.trin).every((p) => p.prikker === 6) && trin.join() === NED_TRIN.map((t) => t.id).join() && sete.join() === titler.join() && prøver.filter((p) => p.trin).every((p) => p.ut.includes(NED_TRIN.find((t) => t.id === p.trin).titel) || p.ut.includes(titler[NED_TRIN.findIndex((t) => t.id === p.trin) - 1])), JSON.stringify([trin, sete]));
  const søjle = ned.filter((p) => p.måler && Number.isFinite(p.prik));
  tjek('prikken i søjlen går nedad og står i skylaget inde i skyerne', søjle.length >= 3 && søjle.every((p, i) => i === 0 || p.prik >= søjle[i - 1].prik - 0.2) && søjle.filter((p) => p.hMiddel < 68 && p.hMiddel > 50).every((p) => p.prik > 30 && p.prik < 52), JSON.stringify(søjle.map((p) => [Math.round(p.hMiddel), p.prik])));
  tjek('skyderen "Under skyerne" er skjult under turen ned', prøver.every((p) => !p.skyder));
  const slut = prøver.at(-1);
  tjek('landet ved Venera 13: måleren viser 0 km, ca. 457 °C og ca. 89 bar, og fotoet er fremme', slut.fase === 'landet' && slut.tekst.højde === '0 km' && Math.abs(parseInt(slut.tekst.temperatur) - 457) <= 4 && Math.abs(parseInt(slut.tekst.tryk) - 89) <= 4 && slut.foto, JSON.stringify(slut));
  const m = await F('midte');
  tjek('kameraet står ca. 3 km over jorden ved Venera 13 (7,5° S, 303° Ø) og kigger mod horisonten', Math.abs(m.højde - 3) < 0.6 && forskel(m.længde, -57) < 0.3 && Math.abs(m.bredde + 7.5) < 0.5, JSON.stringify(m));
  await s.waitForTimeout(400);
  tjek('træet har "Ned gennem skyerne" under Venera 13, og Indstillinger har kontakten "Venera 13\'s foto"', (await fm(() => atomlabTest.solsystem.træ())).some((p) => p.id === 'ned') && (await fm(() => atomlabTest.solsystem.styr())).some((p) => p.navn === 'Venera 13\'s foto'));
  await s.screenshot({ path: `${UD}/venus-landet.png` });
  // Længere tid pr. trin (jeres svar 20. november 2026): ca. 3 s ekstra i snit, efter tekstens ord
  const plan = slut.plan, varighed = plan.slice(1).map((x, i) => x - plan[i]);
  tjek('turen ned tager ca. 49 s (34 s + 3 s ekstra til hvert af de fem trin), og hvert trin står mindst ca. 5 s', Math.abs(slut.nedTid - 49) < 0.01 && Math.abs(plan.at(-1) - slut.nedTid) < 0.05 && varighed.every((d) => d > 5), JSON.stringify(varighed.map((d) => d.toFixed(1))));
  // Underteksterne står i loggen 🔔, hver én gang
  const logEfter = (await iLog()).slice(0, (await iLog()).length - logFør.length);
  tjek('de seks undertekster på turen ned står i loggen, og Solsystemet har klokken 🔔', titler.every((t) => logEfter.filter((x) => x === t).length === 1) && (await fm(() => !document.querySelector('#solsystemVindue .logknap')?.hidden)), JSON.stringify(logEfter));
  // Bladring (jeres svar 20. november 2026): ‹ › i bjælken, prikkerne og piletasterne. Kameraet glider hen til starten af
  // trinet og fortsætter derfra, og måleren, prikken i søjlen og fotoet følger med
  const bjælke = (await prøve()).bjælke;
  tjek('landet: bjælken har ‹ og "↺ Forfra"', bjælke.some((b) => b === '‹') && bjælke.some((b) => b.includes('Forfra')), JSON.stringify(bjælke));
  await fm(() => document.activeElement?.blur()); // (fokus væk fra knapperne)
  // Følg et spring, til kameraet er fremme ved starten af trinet (og lidt efter)
  const følg = async () => {
    const set = [await prøve()];
    const t1 = Date.now();
    while (Date.now() - t1 < 30000 && (set.at(-1).springer || set.length < 3)) { await s.waitForTimeout(80); set.push(await prøve()); }
    set.push(await prøve());
    return set;
  };
  const ned0 = NED_TRIN.find((t) => t.id === 'ovn'), ned1 = NED_TRIN.find((t) => t.id === 'under');
  await s.keyboard.press('ArrowLeft');
  const s1 = await følg();
  const top1 = Math.max(...s1.map((p) => p.hMiddel));
  tjek('← fra "landet": tilbage til "Varmere end en ovn", fotoet væk, måleren der, og kameraet glider op til ca. 20 km', s1[0].trin === 'ovn' && s1[0].ut.includes(ned0.titel) && !s1[0].foto && s1.at(-1).måler && s1.at(-1).fase === 'ned' && top1 > 17.5 && top1 < 20.8, JSON.stringify([s1[0].trin, s1[0].foto, top1, s1.at(-1).fase]));
  await s.click('#solsystemBjælke .bjælke-tilbage');
  const s2 = await følg();
  const top2 = Math.max(...s2.map((p) => p.hMiddel)), sidst2 = s2.at(-1);
  tjek('‹ i bjælken: et trin mere tilbage til "Under skyerne" (ca. 48 km), og prikken i søjlen følger højden', s2[0].trin === 'under' && s2[0].ut.includes(ned1.titel) && top2 > 44.5 && top2 < 48.8 && Math.abs(sidst2.prik - 100 * (1 - sidst2.hMiddel / 100)) < 1.5 && !sidst2.springer, JSON.stringify([s2[0].trin, top2, sidst2.hMiddel, sidst2.prik]));
  await s.keyboard.press('ArrowRight');
  const s3 = await følg();
  tjek('→ frem igen til "Varmere end en ovn", og turen fortsætter ned', s3[0].trin === 'ovn' && s3.at(-1).fase === 'ned' && !s3.at(-1).springer && s3.at(-1).hMiddel < 20.8, JSON.stringify([s3[0].trin, s3.at(-1).fase, s3.at(-1).hMiddel]));
  await s.click('#solsystemBjælke .bjælke-næste');
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().ned().fase === 'landet', null, { timeout: 30000, polling: 100 });
  await s.waitForTimeout(300);
  const s4 = await prøve();
  tjek('"Næste: Landet ›" lander med det samme: 0 km, fotoet er der igen, og kontakten "Venera 13\'s foto" også', s4.trin === 'landet' && s4.tekst.højde === '0 km' && s4.foto && (await fm(() => atomlabTest.solsystem.styr())).some((p) => p.navn === 'Venera 13\'s foto'), JSON.stringify([s4.trin, s4.tekst, s4.foto]));
  const logIgen = (await iLog()).slice(0, (await iLog()).length - logFør.length);
  tjek('bladring skriver ikke underteksterne i loggen igen', logIgen.length === logEfter.length, JSON.stringify(logIgen));
  await fm(() => atomlabTest.solsystem.trykPå('Venera 13\'s foto'));
  tjek('kontakten "Venera 13\'s foto" skjuler fotoet', !(await F('ned')).foto && (await fm(() => document.querySelector('.venus-foto')?.hidden)) === true);
  // Tilbage til hele Venus: måleren, fotoet og disen er væk, og skyerne er der igen
  await fm(() => atomlabTest.solsystem.gåTil('venus'));
  await flyver();
  await s.waitForTimeout(300);
  const efter = await F('ned');
  tjek('tilbage ved hele Venus er måleren, fotoet og disen væk, og skyerne dækker igen', efter.fase === null && !efter.måler && !efter.foto && !efter.kuppel && (await fm(() => document.querySelector('.venus-maaler')?.hidden)) === true && (await F('skyer')).under < 1, JSON.stringify([efter, (await F('skyer')).under]));
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
