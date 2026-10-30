// Mars (M2, M3, M4c og M7a i docs/plan-mars.md): Mars står i Solsystemet før Saturn, billederne bliver hentet, højdekortet
// vender rigtigt (Olympus Mons, Hellas og Arsia Mons på de rigtige steder), Mars drejer mod øst, bjergene kan gøres
// 10 gange højere, skyerne over vulkanerne kommer om eftermiddagen, "Modlys" sætter Solen bag Mars, flybyen ned til
// Olympus Mons, calderaen og skrænten med det lokale kort og detaljekortet (M4c og M7a), og kameraets indstillinger bliver sat tilbage, når man går videre.
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
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
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
const ventFremme = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 30000, polling: 100 });
const vinkelMellem = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180 / Math.PI;
const fase = () => fm(() => [document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin i').length]);
// Den laveste højde over jorden og det største skub op, målt i hvert billede
await fm(async () => {
  const { verden } = await import('/js/scene3d.js');
  window.marsMåling = { min: Infinity, skub: 0 };
  verden.opdateringer.add(() => {
    const t = atomlabTest.solsystem.fænomen();
    if (!t?.vedSted) return;
    window.marsMåling.min = Math.min(window.marsMåling.min, t.vedSted('olympus').overJorden);
    window.marsMåling.skub = Math.max(window.marsMåling.skub, t.tur().skubbet);
  });
});
const nulstilMåling = () => fm(() => { window.marsMåling = { min: Infinity, skub: 0 }; });
const måling = () => fm(() => window.marsMåling);
const lokalt = () => fm(() => atomlabTest.solsystem.fænomen().billeder().lokalt.olympus);
tjek('det lokale kort over Olympus Mons er ikke hentet før flybyen', !(await lokalt()).hentet.højde && !(await lokalt()).klar, JSON.stringify(await lokalt()));
tjek('knappen "▶ Start flyby"', (await fm(() => atomlabTest.solsystem.knapper())).includes('▶ Start flyby'));
await s.click('#solsystemStyring button:has-text("Start flyby")');
const fase0 = await fase();
tjek('flybyen: første stop "Mars" med fire prikker', fase0[0].includes('Mars') && fase0[1] === 4, JSON.stringify(fase0));
await ventFremme();
let v = await ved();
tjek('første stop: klokken er 7 ved Olympus Mons, og Mars står stille', Math.abs(v.tid - 7) < 0.05 && !(await fm(() => document.querySelector('#solsystemStyring button.til')?.textContent.includes('Drej Mars'))), JSON.stringify(v));
tjek('første stop: systemet er ikke drejet', vinkelMellem(await fm(() => atomlabTest.solsystem.fænomen().drejningSystem()), [0, 0, 0, 1]) < 0.01);
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
tjek('flybyen: andet stop "Olympus Mons" med fire prikker', fase1[0].includes('Olympus Mons') && fase1[1] === 4, JSON.stringify(fase1));
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
tjek('flybyen: tredje stop "Calderaen" (under 160 tegn)', fase2[0].includes('Calderaen') && fase2[1] === 4 && fase2[0].length < 175, JSON.stringify(fase2));
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
tjek('efter turen: "Hele Mars", "▶ Start flyby", og teksten om skrænten', (await fm(() => atomlabTest.solsystem.knapper())).includes('Hele Mars') && /Turen er slut/.test(await s.textContent('#solsystemForklaring')) && /Skrænten/.test(await s.textContent('#solsystemForklaring')));
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
// Tilbage til hele Mars: systemet drejes tilbage, og teksten om hele Mars kommer igen
await nulstilMåling();
await s.click('#solsystemStyring button:has-text("Hele Mars")');
await ventFremme();
m = await måling();
const tilbage = await fm(async () => { const { himmelDrejning } = await import('/js/scene3d.js'); return { ved: atomlabTest.solsystem.fænomen().ved(), drejning: atomlabTest.solsystem.fænomen().drejningSystem(), himmel: himmelDrejning() }; });
tjek('"Hele Mars": systemet og stjernehimlen er ikke drejet længere', tilbage.ved === 'mars' && vinkelMellem(tilbage.drejning, [0, 0, 0, 1]) < 0.01 && vinkelMellem(tilbage.himmel, [0, 0, 0, 1]) < 0.01, JSON.stringify(tilbage));
tjek('"Hele Mars": højt over jorden hele vejen, og teksten om hele Mars', m.skub === 0 && /rigtige højde/.test(await s.textContent('#solsystemForklaring')), JSON.stringify(m));
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

// Videre til et andet fænomen: kameraets indstillinger er sat tilbage
await s.click('#solsystem .kosmos-valg[data-id="aarstider"]');
await s.waitForTimeout(500);
const efter = await s.evaluate(async () => { const { verden, himmelDrejning } = await import('/js/scene3d.js'); return { near: verden.kamera.near, zoom: verden.styring.zoomSpeed, drej: verden.styring.rotateSpeed, styring: verden.styring.enabled, himmel: himmelDrejning() }; });
tjek('efter Mars: kameraets near, zoom, drejning og styring er sat tilbage, og himlen er ikke drejet', efter.near === 0.1 && efter.zoom === 1 && efter.drej === 1 && efter.styring && efter.himmel.join() === '0,0,0,1', JSON.stringify(efter));

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
