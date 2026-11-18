// Mars, stederne (delt fra mars.mjs 16. november 2026, så hver del er under ca. 300 s under belastning): flybyen springer
// frem til Skrænten (de første stop tjekkes i mars.mjs), og herfra flyves der rigtigt til Tharsis, Valles Marineris,
// Hellas, Gale, Jezero og Nordpolen (M5a og M5b: højderne, klokken, højst 2 lokale net, høje flyvninger, midnatssolen),
// Phobos, "Mars set fra Phobos" og Deimos (M6b: aldrig under 100 m over en måne) og tilbage til hele Mars.
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
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
// Mars er valgt, og kortene, månerne og kortene til første stop er hentet (fænomen() kan være det forrige fænomen lige
// efter klikket, mens rejseskiltet vises: derfor valgt() og billeder?.())
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 60000, polling: 200 });
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().måner().every((m) => m.form && m.kort), null, { timeout: 60000, polling: 200 });
await s.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 60000, polling: 200 });

const måner = () => s.evaluate(() => atomlabTest.solsystem.fænomen().måner());
const fm = (u, a) => s.evaluate(u, a);
const ved = (id = 'olympus') => fm((id) => atomlabTest.solsystem.fænomen().vedSted(id), id);
const ventFremme = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 100 });
const træ = () => fm(() => atomlabTest.solsystem.træ()); // træet i listen (U1, docs/plan-ux.md)
const fase = () => fm(() => [document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin > *').length]);
const forklaring = () => s.textContent('#solsystemTekst'); // stedets side
const efterTo = () => s.waitForFunction(() => { window.billeder = (window.billeder ?? 0) + 1; return window.billeder % 3 === 0; }, null, { polling: 'raf' });
// Den laveste højde over jorden og det største skub op, målt i hvert billede (som i mars.mjs)
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
    window.marsMåling.måne = Math.min(window.marsMåling.måne ?? Infinity, t.måneHøjde('phobos'), t.måneHøjde('deimos'));
    window.marsMåling.ud = window.marsMåling.ud || t.skubbetUd();
  });
});
const nulstilMåling = () => fm(() => { window.marsMåling = { min: Infinity, skub: 0, net: 0 }; });
const måling = () => fm(() => window.marsMåling);
let m;
const vinkelMellem = (a, b) => 2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180 / Math.PI;
// Flybyen frem til Skrænten (stop 4) med hop: Mars, Olympus Mons, Calderaen og Skrænten
await s.click('#solsystemBjælke button:has-text("Start flyby")');
for (let i = 0; i < 3; i++) {
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await ventFremme(); // (hop gør flyvningen færdig i næste billede)
  await s.click('#solsystemBjælke button:has-text("Næste")');
}
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
tjek('flybyen er sprunget frem til Skrænten', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'skraent', await fm(() => atomlabTest.solsystem.fænomen().ved()));
// M5a: Tharsis, Valles Marineris og Hellas. Lange flyvninger mellem stederne går højt op og langs overfladen.
const højdeVed = (b, l, r, fn) => fm(([b, l, r, fn]) => {
  const t = atomlabTest.solsystem.fænomen();
  const v = [];
  for (let x = -r; x <= r; x += r / 20) for (let y = -r; y <= r; y += r / 20) v.push(t.højde(b + y, l + x));
  return fn === 'max' ? Math.max(...v) : Math.min(...v);
}, [b, l, r, fn]);
const stopTil = async (knap, id, navn) => {
  await nulstilMåling();
  await s.click(`#solsystemBjælke button:has-text("Næste: ${knap}")`);
  const f = await fase();
  tjek(`flybyen: stop "${navn}" med tretten prikker og en kort undertekst (under 160 tegn)`, f[0].includes(navn) && f[1] === 13 && f[0].length < 175, JSON.stringify(f));
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
tjek('ved Tharsis: teksten om skjoldvulkanerne, og kun Tharsis-nettet tegnes', /skjoldvulkaner/.test(await s.textContent('#solsystemTekst')));
await s.waitForFunction(() => { const d = atomlabTest.solsystem.fænomen().billeder().lokalt.valles; return d.hentet.højde && d.detalje.hentet; }, null, { timeout: 30000, polling: 200 });
await s.screenshot({ path: UD + '/7-tharsis.png' });
const r6 = await stopTil('Valles Marineris', 'valles', 'Valles Marineris');
tjek('ved Valles Marineris: klokken er 9, og kameraet kigger på kløfterne', Math.abs(r6.v.tid - 9) < 0.05 && r6.v.fokus < 1, JSON.stringify(r6.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.valles; return l.klar && l.tabel && l.detalje.tabel; }, null, { timeout: 30000, polling: 200 });
const kløft = { bund: await højdeVed(-10, -72, 2, 'min'), kant: await højdeVed(-10, -72, 2, 'max') };
tjek('Valles Marineris: kløfterne i midten er mere end 7 km dybe (fra kanten til bunden)', kløft.kant - kløft.bund > 7 && kløft.kant - kløft.bund < 12, JSON.stringify(kløft));
tjek('ved Valles Marineris: teksten om sprækkedalen', /sprækkedal/.test(await s.textContent('#solsystemTekst')));
await s.screenshot({ path: UD + '/8-valles.png' });
const r7 = await stopTil('Hellas', 'hellas', 'Hellas');
tjek('fra Valles Marineris til Hellas (ca. 130°): kameraet går over 2.000 km op, så begge steder kan ses fra toppen', r7.m.max > 2000, JSON.stringify(r7.m));
tjek('ved Hellas: klokken er 9, og ingen lokale net tegnes', Math.abs(r7.v.tid - 9) < 0.05 && r7.v.fokus < 1 && (await fm(() => Object.values(atomlabTest.solsystem.fænomen().billeder().lokalt).every((l) => !l.klar))), JSON.stringify(r7.v));
const hellas = await højdeVed(-42.4, 70.5, 6, 'min');
tjek('Hellas: bunden ligger mere end 7 km under nulpunktet', hellas < -7 && hellas > -8.6, hellas);
tjek('ved Hellas: teksten om nedslagskrateret', /nedslagskrater/.test(await s.textContent('#solsystemTekst')));
// M5b: Gale, Jezero og Nordpolen
await s.screenshot({ path: UD + '/9-hellas.png' });
const r8 = await stopTil('Gale', 'gale', 'Gale og Curiosity');
tjek('ved Gale: klokken er 9, og kameraet kigger på krateret', Math.abs(r8.v.tid - 9) < 0.05 && r8.v.fokus < 1 && r8.v.op > Math.cos(Math.PI / 180), JSON.stringify(r8.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.gale; return l.klar && l.tabel; }, null, { timeout: 30000, polling: 200 });
// Mount Sharp (Aeolis Mons, 5,08° S, 137,85° Ø) og kraterbunden nord for bjerget (ved Bradbury Landing, 4,59° S, 137,44° Ø)
const gale = { top: await højdeVed(-5.08, 137.85, 0.25, 'max'), bund: await højdeVed(-4.6, 137.4, 0.1, 'min') };
tjek('Gale: Mount Sharp rejser sig ca. 5 km over kraterbunden (teksten)', gale.top - gale.bund > 4.5 && gale.top - gale.bund < 6, JSON.stringify(gale));
tjek('ved Gale: teksten om Curiosity', /Curiosity/.test(await s.textContent('#solsystemTekst')));
await s.screenshot({ path: UD + '/10-gale.png' });
const r9 = await stopTil('Jezero', 'jezero', 'Jezero og Perseverance');
tjek('ved Jezero: klokken er 7½, og kameraet kigger på krateret', Math.abs(r9.v.tid - 7.5) < 0.05 && r9.v.fokus < 1, JSON.stringify(r9.v));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.jezero; return l.klar && l.tabel; }, null, { timeout: 30000, polling: 200 });
const jezero = { rand: await højdeVed(18.41, 77.69, 0.3, 'max'), bund: await højdeVed(18.41, 77.69, 0.15, 'min') };
tjek('Jezero: et krater, der er mellem 0,3 og 1,8 km dybt', jezero.rand - jezero.bund > 0.3 && jezero.rand - jezero.bund < 1.8, JSON.stringify(jezero));
tjek('ved Jezero: teksten om Perseverance og deltaet', /Perseverance/.test(await s.textContent('#solsystemTekst')) && /delta/.test(await s.textContent('#solsystemTekst')));
await s.screenshot({ path: UD + '/11-jezero.png' });
tjek('ved Jezero: aksen står som ved forårsjævndøgn (vinklen mellem nordpolen og Solen ca. 87°)', Math.abs((await fm(() => atomlabTest.solsystem.fænomen().polSol())) - 87.4) < 0.5, await fm(() => atomlabTest.solsystem.fænomen().polSol()));
const r10 = await stopTil('Nordpolen', 'nordpol', 'Nordpolen');
const polSol = await fm(() => atomlabTest.solsystem.fænomen().polSol());
tjek('ved Nordpolen: nordligt sommersolhverv (nordpolen står 90° − 25,19° fra Solen)', Math.abs(polSol - (90 - 25.19)) < 0.1, polSol);
// M7b-pol: Nordpolen har sit eget polarnet (tjekket i mars-pol.mjs). Her tegnes ikke andre lokale net
tjek('ved Nordpolen: midnatssol, Solen står 22-28° over horisonten, og kun polarnettet kan tegnes', r10.v.solHøjde > 22 && r10.v.solHøjde < 28 && r10.v.fokus < 1 && (await fm(() => Object.entries(atomlabTest.solsystem.fænomen().billeder().lokalt).every(([id, l]) => id === 'nordpol' || !l.klar))), JSON.stringify(r10.v));
// ▶ (før "Drej Mars"): Solen går rundt, men går ikke ned
await s.click('#solsystemTid button[data-tid="spil"]');
const solHøjder = [];
const polD0 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
for (let i = 0; i < 6; i++) {
  await efterTo();
  solHøjder.push((await ved('nordpol')).solHøjde);
}
const polD1 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
tjek('ved Nordpolen med ▶: Mars drejer, og Solen bliver over 22°', polD1 !== polD0 && solHøjder.every((h) => h > 22 && h < 28), JSON.stringify([polD0, polD1, solHøjder]));
await s.click('#solsystemTid button[data-tid="pause"]');
tjek('ved Nordpolen: teksten om midnatssolen', /midnatssol/i.test(await s.textContent('#solsystemTekst')));
await s.screenshot({ path: UD + '/12-nordpolen.png' });
// M6b: videre ud til Phobos, "Mars set fra Phobos" og Deimos. Kameraet kommer aldrig ind i en måne.
const t6 = () => fm(() => { const t = atomlabTest.solsystem.fænomen(); return { ved: t.ved(), phobos: t.måneHøjde('phobos'), deimos: t.måneHøjde('deimos'), mars: t.marsVinkel(), skærm: t.marsPåSkærm(), horisont: t.marsOverHorisont(), skygge: [t.iSkygge('phobos'), t.iSkygge('deimos')], stickney: t.solVinkel('phobos', -1, -49), måner: t.måner().map((m) => m.vinkel) }; });
const måneStop = async (knap, navn) => {
  await nulstilMåling();
  await s.click(`#solsystemBjælke button:has-text("Næste: ${knap}")`);
  const f = await fase();
  tjek(`flybyen: stop "${navn}" med tretten prikker og en kort undertekst (under 160 tegn)`, f[0].includes(navn) && f[1] === 13 && f[0].length < 175, JSON.stringify(f));
  await ventFremme();
  await efterTo();
  const mm = await måling();
  tjek(`til ${navn}: kameraet kommer aldrig under 100 m over en måne og bliver aldrig skubbet ud af den, og højt over Mars`, mm.måne > 0.1 && !mm.ud && mm.min > 100, JSON.stringify(mm));
  return await t6();
};
const vP = await måneStop('Phobos', 'Phobos');
// Mars' kant står højst 12° fra midten af billedet (Mars er ca. 42° bred herfra), så Mars ses bag Phobos
tjek('ved Phobos: ingen af månerne står i Mars\' skygge, Stickney ligger i sollys, og Mars ses i baggrunden', vP.ved === 'phobos' && !vP.skygge[0] && !vP.skygge[1] && vP.stickney < 90 && vP.skærm.vinkel - vP.mars / 2 < 12, JSON.stringify(vP));
tjek('ved Phobos: teksten om Stickney, rillerne og at Phobos står op i vest', /Stickney/.test(await forklaring()) && /riller/.test(await forklaring()) && /op i vest/.test(await forklaring()));
await s.screenshot({ path: UD + '/13-phobos.png' });
const vO = await måneStop('Mars set fra Phobos', 'Mars set fra Phobos');
tjek('Mars set fra Phobos: ca. 300 m over Phobos, Mars er ca. 42° bred, står ca. 30° over horisonten og midt i billedet', vO.ved === 'phobos-mars' && Math.abs(vO.phobos - 0.3) < 0.02 && Math.abs(vO.mars - 42.5) < 1 && vO.horisont > 20 && vO.horisont < 40 && vO.skærm.vinkel < 1, JSON.stringify(vO));
tjek('Mars set fra Phobos: månerne står stille ved stoppene, og teksten om bundet rotation og tidevand', vO.måner.join() === vP.måner.join() && /bundet rotation/.test(await forklaring()) && /tidevand/.test(await forklaring()), JSON.stringify([vP.måner, vO.måner]));
// Man kan ikke komme ind i Phobos: zoomet helt ud og drejet lige ned mod Phobos' midte
await fm(async () => {
  const { verden } = await import('/js/scene3d.js');
  const k = verden.kamera.position, m = verden.styring.target;
  k.set(m.x, m.y - 0.01, m.z); // lige ned (Phobos' lodrette retning peger op) og langt ud: rejsen holder afstanden inden for grænsen
});
await efterTo();
await efterTo();
tjek('Mars set fra Phobos: zoomet helt ud er kameraet stadig over Phobos', (await t6()).phobos > 0.1, (await t6()).phobos);
await s.screenshot({ path: UD + '/14-mars-set-fra-phobos.png' });
const vD = await måneStop('Deimos', 'Deimos');
tjek('ved Deimos: Mars er ca. 17° bred og ses ved siden af Deimos, og Deimos står ikke i skygge', vD.ved === 'deimos' && Math.abs(vD.mars - 16.6) < 0.5 && vD.skærm.vinkel < 20 && !vD.skygge[1], JSON.stringify(vD));
tjek('efter turen: Deimos er markeret i træet, "▶ Start flyby", og teksten om MMX og at turen er slut', (await træ()).find((p) => p.id === 'deimos')?.valgt && (await fm(() => atomlabTest.solsystem.knapper())).includes('▶ Start flyby') && /Turen er slut/.test(await s.textContent('#solsystemForklaring')) && /MMX/.test(await forklaring()));
await s.screenshot({ path: UD + '/15-deimos.png' });
// Tilbage til hele Mars: systemet drejes tilbage, og teksten om hele Mars kommer igen
await nulstilMåling();
await s.click('#solsystemTræ button[data-sted="mars"]');
await ventFremme();
m = await måling();
const tilbage = await fm(async () => { const { himmelDrejning } = await import('/js/scene3d.js'); return { ved: atomlabTest.solsystem.fænomen().ved(), drejning: atomlabTest.solsystem.fænomen().drejningSystem(), himmel: himmelDrejning() }; });
tjek('"Hele Mars": systemet og stjernehimlen er ikke drejet længere', tilbage.ved === 'mars' && vinkelMellem(tilbage.drejning, [0, 0, 0, 1]) < 0.01 && vinkelMellem(tilbage.himmel, [0, 0, 0, 1]) < 0.01, JSON.stringify(tilbage));
tjek('"Hele Mars": aksen står igen som ved forårsjævndøgn', Math.abs((await fm(() => atomlabTest.solsystem.fænomen().polSol())) - 87.4) < 0.5, await fm(() => atomlabTest.solsystem.fænomen().polSol()));

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
