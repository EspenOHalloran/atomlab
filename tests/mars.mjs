// Mars (M2, M3, M4c, M7a, M5a og M6a i docs/plan-mars.md): Mars står i Solsystemet før Saturn, billederne bliver hentet, højdekortet
// vender rigtigt (Olympus Mons, Hellas og Arsia Mons på de rigtige steder), Mars drejer mod øst, bjergene kan gøres
// 10 gange højere, skyerne over vulkanerne kommer om eftermiddagen, "Modlys" sætter Solen bag Mars, flybyen ned til
// Olympus Mons, calderaen og skrænten med det lokale kort og detaljekortet (M4c og M7a), Tharsis, Valles Marineris og Hellas (M5a, højst 2 net ad gangen og høje flyvninger mellem stederne), Phobos og Deimos (M6a: formen vender rigtigt, banerne, farten, navnene og et tryk på en måne), og kameraets indstillinger bliver sat tilbage, når man går videre.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('mars');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));

// Højdekortet: længdegrad 0° i midten og øst til højre (som i js/solsystem/klippeplanet.js), højder i meter
const højder = await s.evaluate(async () => {
  const { HØJDE_MIN, HØJDE_MAX } = await import('/js/kosmos/mars.js');
  const billede = new Image();
  billede.src = '/billeder/solsystem/mars-hoejde-2k.png';
  await billede.decode();
  const c = document.createElement('canvas');
  c.width = billede.width;
  c.height = billede.height;
  const g = c.getContext('2d');
  g.drawImage(billede, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  // Den højeste værdi i et lille felt omkring stedet (bredde, længde i grader øst)
  const ved = (bredde, længde, felt, fn = Math.max) => {
    const x0 = Math.round(((længde + 180) / 360) * c.width), y0 = Math.round(((90 - bredde) / 180) * c.height);
    const v = [];
    for (let y = y0 - felt; y <= y0 + felt; y++) {
      for (let x = x0 - felt; x <= x0 + felt; x++) {
        const i = (y * c.width + ((x + c.width) % c.width)) * 4;
        v.push(HØJDE_MIN + ((data[i] * 256 + data[i + 1]) / 65535) * (HØJDE_MAX - HØJDE_MIN));
      }
    }
    return fn(...v);
  };
  return {
    olympus: ved(18.4, -134, 3),
    arsia: ved(-8.3, -120.1, 3),
    hellas: ved(-42.4, 70.5, 30, Math.min), // bunden ligger i den vestlige del af bassinet
    elysium: ved(25, 147, 3),
  };
});
tjek('højdekortet: Olympus Mons (18,40° N, 134,0° V) er over 20 km', højder.olympus > 20000, JSON.stringify(højder));
tjek('højdekortet: Arsia Mons er over 15 km, og Elysium Mons over 10 km', højder.arsia > 15000 && højder.elysium > 10000);
tjek('højdekortet: bunden af Hellas er under −7 km', højder.hellas < -7000, højder.hellas);

// Mars står efter Jorden og før Saturn i Solsystemet
const ids = await s.evaluate(() => atomlabTest.solsystem.fænomener);
tjek('Mars står efter Formørkelser (Jorden) og før Saturn', ids.indexOf('mars') === ids.indexOf('formoerkelser') + 1 && ids.indexOf('saturn') === ids.indexOf('mars') + 1, JSON.stringify(ids));
// Del 1 (30. oktober 2026): "Start flyby" er grå, indtil kortene til første stop (Olympus Mons) er hentet på forhånd
const vedÅbning = await s.evaluate(() => {
  document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click();
  const k = [...document.querySelectorAll('#solsystemStyring button')].find((b) => b.textContent.includes('Start flyby'));
  return k && { tekst: k.textContent.trim(), grå: k.disabled };
});
tjek('lige efter åbning: "Start flyby" er grå med "henter kort"', vedÅbning?.grå && /henter kort/.test(vedÅbning.tekst), JSON.stringify(vedÅbning));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 30000 });
const billeder = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
tjek('billederne er hentet (2k i tests)', billeder.kort === '2k' && billeder.højde === '2k', JSON.stringify(billeder));
const knapper = await s.evaluate(() => [...document.querySelectorAll('#solsystemStyring button')].map((k) => k.textContent.trim()));
tjek('knapperne "Drej Mars", "Bjergene 10 gange højere" og "Modlys"', knapper.some((k) => k.includes('Drej Mars')) && knapper.some((k) => k.includes('Bjergene 10 gange højere')) && knapper.some((k) => k.includes('Modlys')), JSON.stringify(knapper));
tjek('sort himmel (ingen tågeskyer)', !(await s.evaluate(() => atomlabTest.solsystem.tåger())));
const tekst = await s.textContent('#solsystemTekst');
tjek('"Kort fortalt" fortæller om Olympus Mons og Valles Marineris', /Olympus Mons/.test(tekst) && /Valles Marineris/.test(tekst));
tjek('forklaringen: rigtige højder', /rigtige højde/.test(await s.textContent('#solsystemForklaring')));
const kamera = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return { near: verden.kamera.near }; });
tjek('kameraet kan komme helt tæt på overfladen', kamera.near <= 0.01, JSON.stringify(kamera));
// M6a: Phobos og Deimos. Formen og kortene hentes, når Mars' egne kort er hentet.
const måner = () => s.evaluate(() => atomlabTest.solsystem.fænomen().måner());
const klareMåner = await s.waitForFunction(() => atomlabTest.solsystem.fænomen().måner().every((m) => m.form && m.kort), null, { timeout: 30000 }).then(() => true, () => false);
tjek('månerne: formen og kortene er hentet', klareMåner, JSON.stringify(await måner()));
const m0 = await måner();
tjek('månerne: den rigtige afstand fra Mars\' midte (9.376 og 23.460 km) og største radius (ca. 14 og 8,7 km)', Math.abs(m0[0].afstand - 9376) < 1 && Math.abs(m0[1].afstand - 23460) < 1 && Math.abs(m0[0].radius - 14) < 0.3 && Math.abs(m0[1].radius - 8.7) < 0.2, JSON.stringify(m0.map((m) => [m.afstand, m.radius])));
tjek('månerne vender samme side mod Mars (længde 0°), og 90° V er forsiden i bevægelsens retning', m0.every((m) => m.modMars < 1 && m.forside < 1), JSON.stringify(m0.map((m) => [m.modMars, m.forside])));
// Formen vender rigtigt: Stickney (1° N, 311° Ø = 49° V) er en fordybning, og Deimos' formmodel er vendt fra vestlig
// til østlig længde (Thomas' fil: 6,62 km ved 0° N, 90° V og 5,78 km ved 270° V)
const form = await s.evaluate(() => {
  const f = atomlabTest.solsystem.fænomen();
  const skål = (l) => f.måneRadius('phobos', 1, l) - [0, 1, 2, 3, 4, 5, 6, 7].reduce((sum, i) => sum + f.måneRadius('phobos', 1 + 28 * Math.sin(i * Math.PI / 4), l + 28 * Math.cos(i * Math.PI / 4)), 0) / 8; // uden for kanten (Stickney er ca. 9 km bred, ca. 46° på Phobos)
  return { stickney: skål(-49), spejl: skål(49), deimosV: f.måneRadius('deimos', 0, -90), deimosØ: f.måneRadius('deimos', 0, 90) };
});
tjek('Phobos: Stickney er en fordybning (ikke spejlvendt), og Deimos er vendt til østlig længde', form.stickney < -0.2 && form.spejl > -0.1 && Math.abs(form.deimosV - 6.62) < 0.05 && Math.abs(form.deimosØ - 5.78) < 0.05, JSON.stringify(form));
// Farten: Månerne følger Mars' ur i det rigtige forhold (Mars' stjernedøgn / omløbstiden), og mod uret set fra nord.
// Phobos er hurtigere end Mars' overflade (står op i vest), Deimos langsommere.
const månerFør = await måner();
await s.waitForFunction((d0) => atomlabTest.solsystem.fænomen().måner()[0].drejning - d0 > 0.15, månerFør[0].drejning, { timeout: 30000, polling: 100 });
const månerEfter = await måner();
const dMars = månerEfter[0].drejning - månerFør[0].drejning;
const forhold = [0, 1].map((i) => (månerEfter[i].vinkel - månerFør[i].vinkel) / dMars);
tjek('farten: Phobos ca. 3,217 og Deimos ca. 0,813 gange Mars\' drejning, samme vej', Math.abs(forhold[0] - 1.025957 / 0.31891) < 0.01 && Math.abs(forhold[1] - 1.025957 / 1.26244) < 0.01 && dMars > 0, JSON.stringify({ forhold, dMars }));
tjek('Phobos står op i vest (hurtigere end Mars drejer), Deimos i øst', forhold[0] > 1 && forhold[1] < 1);
await s.waitForTimeout(1500);
await s.screenshot({ path: UD + '/1-mars.png' });

// Mars drejer mod øst (rotation.y vokser: mod uret set fra nord, ligesom Jorden)
const d0 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForFunction((d) => atomlabTest.solsystem.fænomen().drejning() > d + 0.01, d0, { timeout: 15000 }).catch(() => {});
const d1 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
tjek('Mars drejer mod øst (mod uret set fra nord)', d1 > d0, JSON.stringify([d0, d1]));
await s.click('#solsystemStyring button:has-text("Drej Mars")');
const d2 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForTimeout(800);
tjek('"Drej Mars" slået fra: Mars står stille', (await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning())) === d2);

// Bjergene 10 gange højere og tilbage igen
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 10, null, { timeout: 20000 }).catch(() => {});
tjek('bjergene bliver 10 gange højere', (await s.evaluate(() => atomlabTest.solsystem.fænomen().overdriv())) === 10);
tjek('forklaringen skifter til de høje bjerge', /10 gange højere/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/2-mars-x10.png' });
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 1, null, { timeout: 20000 }).catch(() => {});
tjek('og tilbage til de rigtige højder', (await s.evaluate(() => atomlabTest.solsystem.fænomen().overdriv())) === 1);

// M3: luften, skyerne og modlys
// Skyernes lokale tid: middag under Solen, aften 90° mod øst, morgen 90° mod vest. Skyerne kommer kun om eftermiddagen.
const ur = await s.evaluate(async () => {
  const { lokalTid, eftermiddag, retning } = await import('/js/solsystem/skyer.js');
  const sol = retning(0, 0);
  return {
    middag: lokalTid(retning(0, 0), sol), aften: lokalTid(retning(0, 90), sol), morgen: lokalTid(retning(0, -90), sol),
    kl8: eftermiddag(8), kl15: eftermiddag(15), kl2: eftermiddag(2),
  };
});
tjek('skyernes ur: middag under Solen, aften mod øst og morgen mod vest', Math.abs(ur.middag - 12) < 0.01 && Math.abs(ur.aften - 18) < 0.01 && Math.abs(ur.morgen - 6) < 0.01, JSON.stringify(ur));
tjek('skyerne kommer om eftermiddagen (kl. 15), ikke kl. 8 eller kl. 2 om natten', ur.kl15 > 0.9 && ur.kl8 === 0 && ur.kl2 === 0, JSON.stringify(ur));
const sky = await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer());
tjek('skyer ved Olympus Mons, Tharsis-vulkanerne, Alba Mons og Elysium Mons', sky.length === 6 && sky[0].navn === 'Olympus Mons', JSON.stringify(sky.map((x) => x.navn)));
// Drej Mars hele vejen rundt: Olympus Mons har sky om eftermiddagen og ingen om morgenen
const rundt = [];
for (let l = 0; l < 360; l += 30) {
  await s.evaluate((l) => atomlabTest.solsystem.fænomen().vend(l), l);
  await s.waitForTimeout(250);
  rundt.push((await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0]);
}
tjek('Olympus Mons: sky om eftermiddagen og ingen om morgenen',
  rundt.every((x) => (x.tid > 10.5 && x.tid < 21.5) || x.mængde === 0) && rundt.some((x) => x.mængde > 0.5) && rundt.some((x) => x.tid < 10 && x.mængde === 0),
  JSON.stringify(rundt.map((x) => [x.tid.toFixed(1), x.mængde.toFixed(2)])));
// Mars drejer mod øst, så klokken går fremad ved Olympus Mons
await s.click('#solsystemStyring button:has-text("Drej Mars")');
const t0 = (await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0].tid;
await s.waitForFunction((t0) => { const t = atomlabTest.solsystem.fænomen().skyer()[0].tid; return Math.abs(t - t0) > 0.05; }, t0, { timeout: 15000 }).catch(() => {});
const t1 = (await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0].tid;
tjek('klokken går fremad ved Olympus Mons, når Mars drejer', ((t1 - t0 + 24) % 24) > 0 && ((t1 - t0 + 24) % 24) < 6, JSON.stringify([t0, t1]));
await s.click('#solsystemStyring button:has-text("Drej Mars")');

// Modlys: Solen står bag Mars, set fra kameraet, og tilbage igen
tjek('dagslys: Solen står ikke bag Mars', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) > -0.5);
await s.click('#solsystemStyring button:has-text("Modlys")');
await s.waitForTimeout(300);
tjek('"Modlys": Solen står bag Mars', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) < -0.9);
tjek('forklaringen fortæller om modlys', /Modlys/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/3-modlys.png' });
await s.click('#solsystemStyring button:has-text("Modlys")');
await s.waitForTimeout(300);
tjek('"Modlys" slået fra: Solen er tilbage', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) > -0.5);
const tekster = (await s.textContent('#solsystemTekst'));
tjek('"Kort fortalt" fortæller om polkapperne og skyerne', /Polkapperne/.test(tekster) && /skyer af is/.test(tekster));

// M4c og M7a: flybyen ned til Olympus Mons, calderaen og skrænten. Kameraets rejse drejer Mars, så stedets lodrette
// retning peger lige op, kameraet ser skråt mod horisonten, og det kommer aldrig ind under bjergene (under flyvningen,
// når man selv drejer det ned, og med bjergene 10 gange højere). "Hele Mars" drejer systemet tilbage.
// M7a: Det lokale kort over Olympus Mons hentes først, når flybyen starter, og højderne er rigtige (toppen, calderaen,
// skrænten og overgangen til resten af Mars).
const fm = (u, a) => s.evaluate(u, a);
const ved = (id = 'olympus') => fm((id) => atomlabTest.solsystem.fænomen().vedSted(id), id);
const flyver = () => fm(() => atomlabTest.solsystem.fænomen().tur().flyver);
const ventFremme = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 100 });
const vinkelMellem = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180 / Math.PI;
const fase = () => fm(() => [document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin i').length]);
// Den laveste højde over jorden og det største skub op, målt i hvert billede
await fm(async () => {
  const { verden } = await import('/js/scene3d.js');
  window.marsMåling = { min: Infinity, skub: 0, net: 0 };
  verden.opdateringer.add(() => {
    const t = atomlabTest.solsystem.fænomen();
    if (!t?.vedSted) return;
    const over = t.vedSted('olympus').overJorden;
    window.marsMåling.min = Math.min(window.marsMåling.min, over);
    window.marsMåling.max = Math.max(window.marsMåling.max ?? 0, over);
    window.marsMåling.skub = Math.max(window.marsMåling.skub, t.tur().skubbet);
    window.marsMåling.net = Math.max(window.marsMåling.net, Object.values(t.billeder().lokalt).filter((l) => l.klar).length);
  });
});
const nulstilMåling = () => fm(() => { window.marsMåling = { min: Infinity, skub: 0, net: 0 }; });
const måling = () => fm(() => window.marsMåling);
const lokalt = () => fm(() => atomlabTest.solsystem.fænomen().billeder().lokalt.olympus);
await s.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 30000, polling: 200 });
const førFlyby = await lokalt();
tjek('"Start flyby" bliver aktiv, når kortene til Olympus Mons er hentet på forhånd (nettet tegnes ikke endnu, og detaljekortet venter)', førFlyby.hentet.højde && førFlyby.hentet.kort && !førFlyby.klar && !førFlyby.detalje.hentet, JSON.stringify(førFlyby));
await s.click('#solsystemStyring button:has-text("Start flyby")');
const fase0 = await fase();
tjek('flybyen: første stop "Mars" med ti prikker', fase0[0].includes('Mars') && fase0[1] === 10, JSON.stringify(fase0));
await ventFremme();
let v = await ved();
tjek('første stop: klokken er 7 ved Olympus Mons, og Mars står stille', Math.abs(v.tid - 7) < 0.05 && !(await fm(() => document.querySelector('#solsystemStyring button.til')?.textContent.includes('Drej Mars'))), JSON.stringify(v));
tjek('første stop: systemet er ikke drejet', vinkelMellem(await fm(() => atomlabTest.solsystem.fænomen().drejningSystem()), [0, 0, 0, 1]) < 0.01);
tjek('på flybyen står der ingen navne på kloden', (await fm(() => atomlabTest.solsystem.fænomen().navne())).length === 0);
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.olympus; return l.hentet.højde && l.hentet.kort && l.tabel && l.klar; }, null, { timeout: 30000, polling: 200 });
const lok = await lokalt();
tjek('flybyen henter det lokale kort over Olympus Mons (1k i tests) og laver højdetabellen', lok.højde === '1k' && lok.tabel && lok.net[0] === 128, JSON.stringify(lok));
tjek('detaljekortet over calderaen og skrænten er ikke hentet ved første stop', lok.detalje && !lok.detalje.hentet, JSON.stringify(lok));
// Højderne med det lokale kort (HRSC og MOLA): toppen, calderaen og skrænten
const højder2 = await fm(() => {
  const t = atomlabTest.solsystem.fænomen();
  const felt = (b0, l0, r, trin) => { const v = []; for (let b = b0 - r; b <= b0 + r; b += trin) for (let l = l0 - r; l <= l0 + r; l += trin) v.push(t.højde(b, l)); return v; };
  const omkring = felt(18.4, -133.3, 0.9, 0.02); // calderaen og kanten
  const indeni = felt(18.45, -133.25, 0.35, 0.02);
  // Ud fra midten mod nordvest (320°) hen over skrænten: det største fald på 25 km
  const profil = [];
  for (let r = 200; r <= 400; r += 0.5) {
    const a = 320 * Math.PI / 180, b = 18.4 + (r * Math.cos(a)) / 59.27;
    profil.push([r, t.højde(b, -134 + (r * Math.sin(a)) / (59.27 * Math.cos(b * Math.PI / 180)))]);
  }
  let fald = 0;
  for (const [r, h] of profil) for (const [r2, h2] of profil) if (r2 > r && r2 - r <= 25) fald = Math.max(fald, h - h2);
  // Overgangen til resten af Mars: lige inden for og uden for grænserne (27,5° N til 9,5° N og 143,5° V til 124,5° V)
  const kant = [];
  for (let x = 0; x <= 1; x += 0.05) {
    const b = 9.5 + 18 * x, l = -143.5 + 19 * x;
    kant.push(Math.abs(t.højde(27.5 - 0.01, l) - t.højde(27.5 + 0.01, l)), Math.abs(t.højde(9.5 + 0.01, l) - t.højde(9.5 - 0.01, l)),
      Math.abs(t.højde(b, -143.5 + 0.01) - t.højde(b, -143.5 - 0.01)), Math.abs(t.højde(b, -124.5 - 0.01) - t.højde(b, -124.5 + 0.01)));
  }
  return { top: Math.max(...felt(18, -133.5, 1.2, 0.03)), kant: Math.max(...omkring), bund: Math.min(...indeni), fald, overgang: Math.max(...kant) };
});
tjek('toppen af Olympus Mons er ca. 21 km over nulpunktet (MOLA: 21,2 km)', højder2.top > 20.7 && højder2.top < 21.6, JSON.stringify(højder2));
tjek('calderaens bund ligger ca. 3 km under kanten (Plescia: 3,2 km)', højder2.kant - højder2.bund > 2.5 && højder2.kant - højder2.bund < 3.8, JSON.stringify(højder2));
tjek('skrænten mod nordvest falder over 6 km på højst 25 km', højder2.fald > 6, højder2.fald);
tjek('overgangen til resten af Mars: under 100 m forskel lige over kanten', højder2.overgang < 0.1, højder2.overgang);
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Næste: Olympus Mons")');
const fase1 = await fase();
tjek('flybyen: andet stop "Olympus Mons" med ti prikker', fase1[0].includes('Olympus Mons') && fase1[1] === 10, JSON.stringify(fase1));
tjek('underteksten er kort (under 160 tegn)', fase1[0].length < 175, fase1[0].length);
tjek('kameraet flyver', await flyver());
await ventFremme();
let m = await måling();
tjek('under flyvningen: kameraet er højt over jorden og bliver aldrig skubbet op', m.min > 100 && m.skub === 0, JSON.stringify(m));
v = await ved();
tjek('ved Olympus Mons: stedets lodrette retning peger lige op (inden for 1°)', v.op > Math.cos(Math.PI / 180), v.op);
tjek('ved Olympus Mons: kameraet ser ned på stedet 10° over horisonten', Math.abs(v.vinkel - 10) < 0.5, v.vinkel);
tjek('ved Olympus Mons: horisonten er i billedet (over midten)', v.horisont > 0.5 && v.horisont < 10, v.horisont);
tjek('ved Olympus Mons: kameraet kigger på stedet, og klokken er 7', v.fokus < 1 && Math.abs(v.tid - 7) < 0.05, JSON.stringify(v));
const himmel = await fm(async () => { const { himmelDrejning } = await import('/js/scene3d.js'); return [himmelDrejning(), atomlabTest.solsystem.fænomen().drejningSystem()]; });
tjek('stjernehimlen er drejet med Mars', vinkelMellem(himmel[0], himmel[1]) < 0.01 && vinkelMellem(himmel[1], [0, 0, 0, 1]) > 10, JSON.stringify(himmel));
tjek('ved Olympus Mons: teksten om skjoldvulkanen', /skjoldvulkan/.test(await s.textContent('#solsystemForklaring')));
// Detaljekortet (ca. 0,22 km pr. pixel) hentes ved Olympus Mons, så det er klar ved calderaen og skrænten
await s.waitForFunction(() => { const d = atomlabTest.solsystem.fænomen().billeder().lokalt.olympus.detalje; return d.hentet && d.tabel; }, null, { timeout: 30000, polling: 200 });
const højder3 = await fm(() => {
  const t = atomlabTest.solsystem.fænomen();
  const felt = (b0, l0, r, trin) => { const v = []; for (let b = b0 - r; b <= b0 + r; b += trin) for (let l = l0 - r; l <= l0 + r; l += trin) v.push(t.højde(b, l)); return v; };
  // Overgangen fra detaljekortet (24° N til 16,5° N og 139,5° V til 131,5° V) til det lokale kort
  const kant = [];
  for (let x = 0; x <= 1; x += 0.05) {
    const b = 16.5 + 7.5 * x, l = -139.5 + 8 * x;
    // (0,001° er ca. 60 m: et spring ved kanten ville ses, men ikke skrænten, som kanten krydser mod vest)
    kant.push(Math.abs(t.højde(24 - 0.001, l) - t.højde(24 + 0.001, l)), Math.abs(t.højde(16.5 + 0.001, l) - t.højde(16.5 - 0.001, l)),
      Math.abs(t.højde(b, -139.5 + 0.001) - t.højde(b, -139.5 - 0.001)), Math.abs(t.højde(b, -131.5 - 0.001) - t.højde(b, -131.5 + 0.001)));
  }
  return { kant: Math.max(...felt(18.4, -133.3, 0.9, 0.02)), bund: Math.min(...felt(18.45, -133.25, 0.35, 0.02)), overgang: Math.max(...kant) };
});
tjek('med detaljekortet: calderaens bund ligger stadig ca. 3 km under kanten', højder3.kant - højder3.bund > 2.5 && højder3.kant - højder3.bund < 3.8, JSON.stringify(højder3));
tjek('overgangen fra detaljekortet: under 50 m forskel lige over kanten', højder3.overgang < 0.05, højder3.overgang);
await s.waitForTimeout(800);
await s.screenshot({ path: UD + '/4-olympus-mons.png' });
// Calderaen
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Næste: Calderaen")');
const fase2 = await fase();
tjek('flybyen: tredje stop "Calderaen" (under 160 tegn)', fase2[0].includes('Calderaen') && fase2[1] === 10 && fase2[0].length < 175, JSON.stringify(fase2));
await ventFremme();
m = await måling();
v = await ved('caldera');
tjek('ved calderaen: 30° over horisonten, klokken er 8, og kameraet kigger på kraterne', Math.abs(v.vinkel - 30) < 0.5 && Math.abs(v.tid - 8) < 0.05 && v.fokus < 1 && v.op > Math.cos(Math.PI / 180), JSON.stringify(v));
tjek('ved calderaen: aldrig skubbet op under flyvningen', m.skub === 0 && m.min > 2, JSON.stringify(m));
tjek('ved calderaen: teksten om de seks kratere', /mindst seks gange/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/5-calderaen.png' });
// Skrænten (sidste stop)
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Næste: Skrænten")');
await ventFremme();
m = await måling();
v = await ved('skraent');
tjek('ved skrænten: lavt (10° over horisonten) og over jorden', Math.abs(v.vinkel - 10) < 0.5 && v.overJorden > 2 && v.overJorden < 25 && v.fokus < 1, JSON.stringify(v));
tjek('ved skrænten: aldrig skubbet op under flyvningen', m.skub === 0 && m.min > 2, JSON.stringify(m));
tjek('ved skrænten: teksten om skrænten, og turen fortsætter til Tharsis', /Skrænten/.test(await s.textContent('#solsystemForklaring')) && (await fm(() => atomlabTest.solsystem.knapper())).some((k) => k.startsWith('Næste: Tharsis')));
tjek('ved skrænten: kun nettet over Olympus Mons tegnes, og Tharsis-kortet hentes i baggrunden', m.net <= 2 && (await fm(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt; return l.olympus.klar && !l.tharsis.klar && !l.valles.klar && l.tharsis.hentet.højde !== undefined; })), JSON.stringify(m));
await s.screenshot({ path: UD + '/6-skraenten.png' });
// Prøv at få kameraet ind under bjergene: under horisonten, lige ned og vandret ind i bjerget
const sætKamera = (grader, afstand) => fm(async ([grader, afstand]) => {
  const { verden } = await import('/js/scene3d.js');
  const { kamera, styring } = verden;
  const r = kamera.position.clone().sub(styring.target);
  r.y = 0;
  r.normalize().multiplyScalar(Math.cos(grader * Math.PI / 180));
  r.y = Math.sin(grader * Math.PI / 180);
  kamera.position.copy(styring.target).addScaledVector(r, afstand);
}, [grader, afstand]);
const efterTo = () => s.waitForFunction(() => { window.billeder = (window.billeder ?? 0) + 1; return window.billeder % 3 === 0; }, null, { polling: 'raf' });
await nulstilMåling();
for (const [grader, afstand] of [[-10, 1.9], [-30, 0.5], [-89, 0.02], [0, 0.3], [0, 0.01]]) {
  await sætKamera(grader, afstand);
  await efterTo();
}
m = await måling();
tjek('ved skrænten: kameraet kan ikke drejes eller zoomes ind under bjergene (mindst 2 km over jorden)', m.min > 1.99 && m.skub > 0 && (await ved()).overJorden > 1.99, JSON.stringify(m));
const nede = await fm(async () => { const { verden } = await import('/js/scene3d.js'); return [verden.styring.zoomSpeed, verden.styring.rotateSpeed]; });
tjek('helt nede ved jorden zoomer og drejer kameraet langsommere', nede[0] < 0.5 && nede[1] < 0.3, JSON.stringify(nede));
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 10, null, { timeout: 20000 }).catch(() => {});
await nulstilMåling();
for (const [grader, afstand] of [[-10, 1.9], [0, 0.3], [-60, 0.05]]) {
  await sætKamera(grader, afstand);
  await efterTo();
}
m = await måling();
v = await ved('skraent');
tjek('med bjergene 10 gange højere: stadig over jorden, og kameraet kigger på skrænten', m.min > 1.99 && v.fokus < 1, JSON.stringify([m, v.fokus]));
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 1, null, { timeout: 20000 }).catch(() => {});
// Modlys ved stedet: Solen står lige under horisonten foran kameraet (kameraet kigger skråt ned som ved stoppet)
await sætKamera(10, 0.04);
await s.click('#solsystemStyring button:has-text("Modlys")');
await efterTo();
tjek('modlys ved skrænten: Solen står bag stedet, set fra kameraet', (await fm(() => atomlabTest.solsystem.fænomen().sol())) < -0.5, await fm(() => atomlabTest.solsystem.fænomen().sol()));
await s.click('#solsystemStyring button:has-text("Modlys")');
// M5a: Tharsis, Valles Marineris og Hellas. Lange flyvninger mellem stederne går højt op og langs overfladen.
const højdeVed = (b, l, r, fn) => fm(([b, l, r, fn]) => {
  const t = atomlabTest.solsystem.fænomen();
  const v = [];
  for (let x = -r; x <= r; x += r / 20) for (let y = -r; y <= r; y += r / 20) v.push(t.højde(b + y, l + x));
  return fn === 'max' ? Math.max(...v) : Math.min(...v);
}, [b, l, r, fn]);
const stopTil = async (knap, id, navn) => {
  await nulstilMåling();
  await s.click(`#solsystemStyring button:has-text("Næste: ${knap}")`);
  const f = await fase();
  tjek(`flybyen: stop "${navn}" med ti prikker og en kort undertekst (under 160 tegn)`, f[0].includes(navn) && f[1] === 10 && f[0].length < 175, JSON.stringify(f));
  const t0 = Date.now();
  await ventFremme();
  const mm = await måling();
  // Flyvningen fra skrænten starter helt nede ved grænsen (2 km over jorden, fra tjekket før), så afrunding kan give et
  // skub på nogle få mm i første billede. Et rigtigt skub under flyvningen ville være meget større.
  tjek(`til ${navn}: højt over jorden og aldrig skubbet op (under 1 m), og højst 2 net tegnes`, mm.min > 1.999 && mm.skub < 0.001 && mm.net <= 2, JSON.stringify(mm));
  return { m: mm, v: await ved(id), sek: (Date.now() - t0) / 1000 };
};
let r5 = await stopTil('Tharsis', 'tharsis', 'Tharsis');
tjek('ved Tharsis: klokken er 7, kameraet kigger på Pavonis Mons, og stedets op peger op', Math.abs(r5.v.tid - 7) < 0.05 && r5.v.fokus < 1 && r5.v.op > Math.cos(Math.PI / 180), JSON.stringify(r5.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt; return l.tharsis.klar && l.tharsis.tabel && !l.olympus.klar; }, null, { timeout: 30000, polling: 200 });
const tharsis = { pavonis: await højdeVed(1.48, -112.96, 0.4, 'max'), ascraeus: await højdeVed(11.92, -104.08, 0.4, 'max'), arsia: await højdeVed(-8.26, -120.09, 0.5, 'max') };
tjek('Tharsis: Pavonis Mons ca. 14 km, Ascraeus og Arsia Mons ca. 18 km over nulpunktet (teksten)', tharsis.pavonis > 13 && tharsis.pavonis < 15 && tharsis.ascraeus > 17.5 && tharsis.ascraeus < 19 && tharsis.arsia > 17 && tharsis.arsia < 19, JSON.stringify(tharsis));
tjek('ved Tharsis: teksten om skjoldvulkanerne, og kun Tharsis-nettet tegnes', /Tre skjoldvulkaner/.test(await s.textContent('#solsystemForklaring')));
await s.waitForFunction(() => { const d = atomlabTest.solsystem.fænomen().billeder().lokalt.valles; return d.hentet.højde && d.detalje.hentet; }, null, { timeout: 30000, polling: 200 });
await s.screenshot({ path: UD + '/7-tharsis.png' });
const r6 = await stopTil('Valles Marineris', 'valles', 'Valles Marineris');
tjek('ved Valles Marineris: klokken er 9, og kameraet kigger på kløfterne', Math.abs(r6.v.tid - 9) < 0.05 && r6.v.fokus < 1, JSON.stringify(r6.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.valles; return l.klar && l.tabel && l.detalje.tabel; }, null, { timeout: 30000, polling: 200 });
const kløft = { bund: await højdeVed(-10, -72, 2, 'min'), kant: await højdeVed(-10, -72, 2, 'max') };
tjek('Valles Marineris: kløfterne i midten er mere end 7 km dybe (fra kanten til bunden)', kløft.kant - kløft.bund > 7 && kløft.kant - kløft.bund < 12, JSON.stringify(kløft));
tjek('ved Valles Marineris: teksten om sprækkedalen', /sprækkedal/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/8-valles.png' });
const r7 = await stopTil('Hellas', 'hellas', 'Hellas');
tjek('fra Valles Marineris til Hellas (ca. 130°): kameraet går over 2.000 km op, så begge steder kan ses fra toppen', r7.m.max > 2000, JSON.stringify(r7.m));
tjek('ved Hellas: klokken er 9, og ingen lokale net tegnes', Math.abs(r7.v.tid - 9) < 0.05 && r7.v.fokus < 1 && (await fm(() => Object.values(atomlabTest.solsystem.fænomen().billeder().lokalt).every((l) => !l.klar))), JSON.stringify(r7.v));
const hellas = await højdeVed(-42.4, 70.5, 6, 'min');
tjek('Hellas: bunden ligger mere end 7 km under nulpunktet', hellas < -7 && hellas > -8.6, hellas);
tjek('ved Hellas: teksten om nedslagskrateret', /nedslagskrater/.test(await s.textContent('#solsystemForklaring')));
// M5b: Gale, Jezero og Nordpolen
await s.screenshot({ path: UD + '/9-hellas.png' });
const r8 = await stopTil('Gale', 'gale', 'Gale og Curiosity');
tjek('ved Gale: klokken er 9, og kameraet kigger på krateret', Math.abs(r8.v.tid - 9) < 0.05 && r8.v.fokus < 1 && r8.v.op > Math.cos(Math.PI / 180), JSON.stringify(r8.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.gale; return l.klar && l.tabel; }, null, { timeout: 30000, polling: 200 });
// Mount Sharp (Aeolis Mons, 5,08° S, 137,85° Ø) og kraterbunden nord for bjerget (ved Bradbury Landing, 4,59° S, 137,44° Ø)
const gale = { top: await højdeVed(-5.08, 137.85, 0.25, 'max'), bund: await højdeVed(-4.6, 137.4, 0.1, 'min') };
tjek('Gale: Mount Sharp rejser sig ca. 5 km over kraterbunden (teksten)', gale.top - gale.bund > 4.5 && gale.top - gale.bund < 6, JSON.stringify(gale));
tjek('ved Gale: teksten om Curiosity', /Curiosity/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/10-gale.png' });
const r9 = await stopTil('Jezero', 'jezero', 'Jezero og Perseverance');
tjek('ved Jezero: klokken er 7½, og kameraet kigger på krateret', Math.abs(r9.v.tid - 7.5) < 0.05 && r9.v.fokus < 1, JSON.stringify(r9.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.jezero; return l.klar && l.tabel; }, null, { timeout: 30000, polling: 200 });
const jezero = { rand: await højdeVed(18.41, 77.69, 0.3, 'max'), bund: await højdeVed(18.41, 77.69, 0.15, 'min') };
tjek('Jezero: et krater, der er mellem 0,3 og 1,8 km dybt', jezero.rand - jezero.bund > 0.3 && jezero.rand - jezero.bund < 1.8, JSON.stringify(jezero));
tjek('ved Jezero: teksten om Perseverance og deltaet', /Perseverance/.test(await s.textContent('#solsystemForklaring')) && /delta/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/11-jezero.png' });
tjek('ved Jezero: aksen står som ved forårsjævndøgn (vinklen mellem nordpolen og Solen ca. 87°)', Math.abs((await fm(() => atomlabTest.solsystem.fænomen().polSol())) - 87.4) < 0.5, await fm(() => atomlabTest.solsystem.fænomen().polSol()));
const r10 = await stopTil('Nordpolen', 'nordpol', 'Nordpolen');
const polSol = await fm(() => atomlabTest.solsystem.fænomen().polSol());
tjek('ved Nordpolen: nordligt sommersolhverv (nordpolen står 90° − 25,19° fra Solen)', Math.abs(polSol - (90 - 25.19)) < 0.1, polSol);
tjek('ved Nordpolen: midnatssol, Solen står 22-28° over horisonten, og intet lokalt net tegnes', r10.v.solHøjde > 22 && r10.v.solHøjde < 28 && r10.v.fokus < 1 && (await fm(() => Object.values(atomlabTest.solsystem.fænomen().billeder().lokalt).every((l) => !l.klar))), JSON.stringify(r10.v));
// "Drej Mars": Solen går rundt, men går ikke ned
await s.click('#solsystemStyring button:has-text("Drej Mars")');
const solHøjder = [];
const polD0 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
for (let i = 0; i < 6; i++) {
  await efterTo();
  solHøjder.push((await ved('nordpol')).solHøjde);
}
const polD1 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
tjek('ved Nordpolen med "Drej Mars": Mars drejer, og Solen bliver over 22°', polD1 !== polD0 && solHøjder.every((h) => h > 22 && h < 28), JSON.stringify([polD0, polD1, solHøjder]));
await s.click('#solsystemStyring button:has-text("Drej Mars")');
tjek('efter turen: "Hele Mars", "▶ Start flyby", og teksten om nordpolen og midnatssolen', (await fm(() => atomlabTest.solsystem.knapper())).includes('Hele Mars') && /Turen er slut/.test(await s.textContent('#solsystemForklaring')) && /Midnatssol/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/12-nordpolen.png' });
// Tilbage til hele Mars: systemet drejes tilbage, og teksten om hele Mars kommer igen
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Hele Mars")');
await ventFremme();
m = await måling();
const tilbage = await fm(async () => { const { himmelDrejning } = await import('/js/scene3d.js'); return { ved: atomlabTest.solsystem.fænomen().ved(), drejning: atomlabTest.solsystem.fænomen().drejningSystem(), himmel: himmelDrejning() }; });
tjek('"Hele Mars": systemet og stjernehimlen er ikke drejet længere', tilbage.ved === 'mars' && vinkelMellem(tilbage.drejning, [0, 0, 0, 1]) < 0.01 && vinkelMellem(tilbage.himmel, [0, 0, 0, 1]) < 0.01, JSON.stringify(tilbage));
tjek('"Hele Mars": aksen står igen som ved forårsjævndøgn', Math.abs((await fm(() => atomlabTest.solsystem.fænomen().polSol())) - 87.4) < 0.5, await fm(() => atomlabTest.solsystem.fænomen().polSol()));
// M5b: Navnene på kloden. Et tryk på et navn flyver derhen, og navnene skjules på bagsiden.
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().navne().length > 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
await fm(() => atomlabTest.solsystem.fænomen().vend(137.8)); // Gale vender mod kameraet
await efterTo();
const navneNu = await fm(() => atomlabTest.solsystem.fænomen().navne());
tjek('navnene på kloden: Gale ses, og Valles Marineris og Tharsis på bagsiden er skjult', navneNu.includes('gale') && !navneNu.includes('valles') && !navneNu.includes('tharsis'), JSON.stringify(navneNu));
const galePlads = await fm(() => atomlabTest.solsystem.fænomen().navnPlads('gale'));
await s.mouse.click(galePlads.x, galePlads.y);
await s.waitForTimeout(200);
const valgt = await fm(() => [atomlabTest.solsystem.fænomen().ved(), atomlabTest.solsystem.fænomen().navne()]);
tjek('et tryk på "Gale" flyver derhen, viser teksten, og navnene forsvinder', valgt[0] === 'gale' && valgt[1].length === 0 && /Curiosity/.test(await s.textContent('#solsystemForklaring')) && (await fase())[0].includes('Gale'), JSON.stringify(valgt));
await ventFremme();
tjek('ved Gale (valgt med navnet): klokken er 9, og "Hele Mars" står i knapperne', Math.abs((await ved('gale')).tid - 9) < 0.05 && (await fm(() => atomlabTest.solsystem.knapper())).includes('Hele Mars'));
await s.click('#solsystemStyring button:has-text("Hele Mars")');
await ventFremme();
tjek('"Hele Mars" fjerner underteksten', !(await fm(() => document.querySelector('#solsystemVindue .undertekst.fase'))));
tjek('"Hele Mars": højt over jorden hele vejen, og teksten om hele Mars', m.skub === 0 && /rigtige højde/.test(await s.textContent('#solsystemForklaring')), JSON.stringify(m));
// Knappen "Navne" (js/solsystem/navne.js): slået fra skjules navnene, og et tryk på kloden flyver ingen steder hen
await fm(() => atomlabTest.solsystem.fænomen().vend(137.8));
await efterTo();
const navnePlads = await fm(() => [atomlabTest.solsystem.fænomen().navne(), atomlabTest.solsystem.fænomen().navnPlads('gale')]);
const navneKnap = '#solsystemStyring button:text-is("Navne")';
tjek('knappen "Navne" er slået til fra start, og Gale står på kloden', (await s.$eval(navneKnap, (k) => k.classList.contains('valgt'))) && navnePlads[0].includes('gale'), JSON.stringify(navnePlads[0]));
await s.click(navneKnap);
await efterTo();
tjek('"Navne" slået fra: navnene og prikkerne er væk, og valget er gemt', (await fm(() => atomlabTest.solsystem.fænomen().navne())).length === 0 && (await fm(() => localStorage.getItem('atomlabNavne'))) === 'fra' && !(await s.$eval(navneKnap, (k) => k.classList.contains('valgt'))));
await s.mouse.click(navnePlads[1].x, navnePlads[1].y);
await s.waitForTimeout(300);
tjek('"Navne" slået fra: et tryk, hvor Gale stod, flyver ingen steder hen, og teksten nævner ikke navnene', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'mars' && !(await fm(() => atomlabTest.solsystem.fænomen().tur().flyver)) && !/Tryk på et navn/.test(await s.textContent('#solsystemForklaring')));
// Fra bagsiden af Mars: Kameraet flyver i en bue hen over planeten og ikke gennem den
await s.click('#solsystemStyring button:has-text("Start flyby")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await fm(async () => { const { verden } = await import('/js/scene3d.js'); const k = verden.kamera.position; k.set(-k.x, -k.y * 0.3, -k.z); });
await efterTo();
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Næste: Olympus Mons")');
await ventFremme();
m = await måling();
tjek('fra bagsiden af Mars: højt over jorden hele vejen og aldrig skubbet op', m.min > 100 && m.skub === 0, JSON.stringify(m));
// "Stop flyby" midt i turen fjerner underteksten
await s.click('#solsystemStyring button:has-text("Stop flyby")');
const væk = await s.waitForFunction(() => !document.querySelector('#solsystemVindue .undertekst.fase'), null, { timeout: 5000, polling: 100 }).then(() => true, () => false);
tjek('"Stop flyby" fjerner underteksten', væk && (await fm(() => atomlabTest.solsystem.knapper())).includes('▶ Start flyby') && (await fm(() => atomlabTest.solsystem.knapper())).includes('Hele Mars'));
await s.click('#solsystemStyring button:has-text("Hele Mars")');
await ventFremme();

// M6a: "Månerne" viser begge baner med navnene, og et tryk på Phobos besøger den
if (!(await s.$eval(navneKnap, (k) => k.classList.contains('valgt')))) await s.click(navneKnap); // navnene til (de blev slået fra ovenfor)
await s.click('#solsystemStyring button:text-is("Månerne")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await efterTo();
const iMånerne = await måner();
tjek('"Månerne": begge navne ses, og teksten fortæller, at de er tegnet større', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'måner' && iMånerne.every((m) => m.navn && m.større > 1) && /tegnet større/.test(await s.textContent('#solsystemForklaring')), JSON.stringify(iMånerne.map((m) => [m.navn, m.større])));
await s.click(navneKnap);
await efterTo();
tjek('"Navne" slået fra: månernes navne er væk', (await måner()).every((m) => !m.navn));
const phobosPlads = await fm(() => atomlabTest.solsystem.fænomen().månePlads('phobos'));
await s.mouse.click(phobosPlads.x, phobosPlads.y);
await s.waitForTimeout(200);
await fm(() => atomlabTest.solsystem.fænomen().hop());
await efterTo();
const vedPhobos = await måner();
tjek('et tryk på Phobos (uden navne) besøger den: teksten om Stickney, og Phobos er i rigtig størrelse', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'phobos' && /Stickney/.test(await s.textContent('#solsystemForklaring')) && vedPhobos[0].større === 1, JSON.stringify(vedPhobos[0]));
await s.click('#solsystemStyring button:has-text("Hele Mars")');
await ventFremme();
tjek('"Hele Mars" fra Phobos', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'mars');

// Videre til et andet fænomen: kameraets indstillinger er sat tilbage
await s.click('#solsystem .kosmos-valg[data-id="aarstider"]');
await s.waitForTimeout(500);
const efter = await s.evaluate(async () => { const { verden, himmelDrejning } = await import('/js/scene3d.js'); return { near: verden.kamera.near, zoom: verden.styring.zoomSpeed, drej: verden.styring.rotateSpeed, styring: verden.styring.enabled, himmel: himmelDrejning() }; });
tjek('efter Mars: kameraets near, zoom, drejning og styring er sat tilbage, og himlen er ikke drejet', efter.near === 0.1 && efter.zoom === 1 && efter.drej === 1 && efter.styring && efter.himmel.join() === '0,0,0,1', JSON.stringify(efter));
// "Navne" huskes efter genindlæsning (stadig slået fra)
await s.reload();
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await efterTo();
tjek('efter genindlæsning: "Navne" er stadig slået fra, og der står ingen navne på kloden', !(await s.$eval(navneKnap, (k) => k.classList.contains('valgt'))) && (await fm(() => atomlabTest.solsystem.fænomen().navne())).length === 0);
await s.click(navneKnap);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().navne().length > 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
tjek('"Navne" slået til igen: navnene kommer tilbage', (await fm(() => atomlabTest.solsystem.fænomen().navne())).length > 0 && (await fm(() => localStorage.getItem('atomlabNavne'))) === 'til');

await s.context().close();

// Kan kortene til Olympus Mons ikke hentes, bliver "Start flyby" aktiv efter ca. 8 sekunder alligevel
{
  const s2 = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s2.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  await s2.route('**/mars-olympus-*', (r) => r.abort());
  await s2.goto(`${ADRESSE}/?test#solsystem`);
  await s2.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  await s2.click('#solsystem .kosmos-valg[data-id="mars"]');
  await s2.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 30000 });
  const t0 = Date.now();
  const aktiv = await s2.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 20000, polling: 200 }).then(() => true, () => false);
  const ventede = (Date.now() - t0) / 1000;
  tjek('uden kortene til Olympus Mons bliver "Start flyby" aktiv efter ca. 8 sekunder', aktiv && ventede < 12, ventede);
  await s2.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
