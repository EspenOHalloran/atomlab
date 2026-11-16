// Mars, del 2 (delt fra mars.mjs 16. november 2026, så hver del er under ca. 300 s under belastning): navnene på kloden
// (et tryk på et navn flyver derhen, knappen "Navne" skjuler dem og huskes efter genindlæsning), flyvningen fra bagsiden,
// "Stop flyby", "Månerne" og et tryk på Phobos, fra Phobos' overflade til hele Mars, en måne i Mars' skygge, træet i
// listen (U1), "‹" og prikkerne på flybyen, kameraets indstillinger efter Mars, "Start flyby" uden kortene til Olympus
// Mons og tabletrunden (ingen hop i afstanden, når en flyvning stopper).
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
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
tjek('et tryk på "Gale" flyver derhen, viser teksten, og navnene forsvinder', valgt[0] === 'gale' && valgt[1].length === 0 && /Curiosity/.test(await s.textContent('#solsystemTekst')) && (await fase())[0].includes('Gale'), JSON.stringify(valgt));
await ventFremme();
tjek('ved Gale (valgt med navnet): klokken er 9, og Gale er markeret i træet', Math.abs((await ved('gale')).tid - 9) < 0.05 && (await træ()).find((p) => p.id === 'gale')?.valgt);
await nulstilMåling();
await s.click('#solsystemTræ button[data-sted="mars"]');
await ventFremme();
m = await måling();
tjek('"Hele Mars" fjerner underteksten', !(await fm(() => document.querySelector('#solsystemVindue .undertekst.fase'))));
tjek('"Hele Mars" fra Gale: aldrig skubbet op, og teksten om hele Mars', m.skub === 0 && /rigtige højde/.test(await s.textContent('#solsystemTekst')), JSON.stringify(m));
// Knappen "Navne" (js/solsystem/navne.js): slået fra skjules navnene, og et tryk på kloden flyver ingen steder hen
await fm(() => atomlabTest.solsystem.fænomen().vend(137.8));
await efterTo();
const navnePlads = await fm(() => [atomlabTest.solsystem.fænomen().navne(), atomlabTest.solsystem.fænomen().navnPlads('gale')]);
const navneKnap = '#solsystemStyr .kontakt:has-text("Navne")';
tjek('knappen "Navne" er slået til fra start, og Gale står på kloden', (await s.$eval(navneKnap, (k) => k.classList.contains('til'))) && navnePlads[0].includes('gale'), JSON.stringify(navnePlads[0]));
await s.click(navneKnap);
await efterTo();
tjek('"Navne" slået fra: navnene og prikkerne er væk, og valget er gemt', (await fm(() => atomlabTest.solsystem.fænomen().navne())).length === 0 && (await fm(() => localStorage.getItem('atomlabNavne'))) === 'fra' && !(await s.$eval(navneKnap, (k) => k.classList.contains('til'))));
await s.mouse.click(navnePlads[1].x, navnePlads[1].y);
await s.waitForTimeout(300);
tjek('"Navne" slået fra: et tryk, hvor Gale stod, flyver ingen steder hen, og teksten nævner ikke navnene', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'mars' && !(await fm(() => atomlabTest.solsystem.fænomen().tur().flyver)) && !/Tryk på et navn/.test(await s.textContent('#solsystemTekst')));
// Fra bagsiden af Mars: Kameraet flyver i en bue hen over planeten og ikke gennem den
await s.click('#solsystemBjælke button:has-text("Start flyby")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await fm(async () => { const { verden } = await import('/js/scene3d.js'); const k = verden.kamera.position; k.set(-k.x, -k.y * 0.3, -k.z); });
await efterTo();
await nulstilMåling();
await s.click('#solsystemBjælke button:has-text("Næste: Olympus Mons")');
await ventFremme();
m = await måling();
tjek('fra bagsiden af Mars: højt over jorden hele vejen og aldrig skubbet op', m.min > 100 && m.skub === 0, JSON.stringify(m));
// "Stop flyby" midt i turen fjerner underteksten
await s.click('#solsystemBjælke button[aria-label="Stop flyby"]');
const væk = await s.waitForFunction(() => !document.querySelector('#solsystemVindue .undertekst.fase'), null, { timeout: 5000, polling: 100 }).then(() => true, () => false);
tjek('"Stop flyby" fjerner underteksten', væk && (await fm(() => atomlabTest.solsystem.knapper())).includes('▶ Start flyby') && !(await fm(() => atomlabTest.solsystem.knapper())).includes('Hele Mars'));
await s.click('#solsystemTræ button[data-sted="mars"]');
await ventFremme();

// M6a: "Månerne" viser begge baner med navnene, og et tryk på Phobos besøger den
if (!(await s.$eval(navneKnap, (k) => k.classList.contains('til')))) await s.click(navneKnap); // navnene til (de blev slået fra ovenfor)
await s.click('#solsystemTræ button[data-sted="måner"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await efterTo();
const iMånerne = await måner();
tjek('"Månerne": begge navne ses, og teksten fortæller, at de er tegnet større', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'måner' && iMånerne.every((m) => m.navn && m.større > 1) && /tegnet større/.test(await s.textContent('#solsystemTekst')), JSON.stringify(iMånerne.map((m) => [m.navn, m.større])));
await s.click(navneKnap);
await efterTo();
tjek('"Navne" slået fra: månernes navne er væk', (await måner()).every((m) => !m.navn));
const phobosPlads = await fm(() => atomlabTest.solsystem.fænomen().månePlads('phobos'));
await s.mouse.click(phobosPlads.x, phobosPlads.y);
await s.waitForTimeout(200);
await fm(() => atomlabTest.solsystem.fænomen().hop());
await efterTo();
const vedPhobos = await måner();
tjek('et tryk på Phobos (uden navne) besøger den: teksten om Stickney, og Phobos er i rigtig størrelse', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'phobos' && /Stickney/.test(await s.textContent('#solsystemTekst')) && vedPhobos[0].større === 1, JSON.stringify(vedPhobos[0]));
await s.click('#solsystemTræ button[data-sted="mars"]');
await ventFremme();
tjek('"Hele Mars" fra Phobos', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'mars');

// M6b: Fra "Mars set fra Phobos" tilbage til hele Mars går kameraet rundt om Phobos og ikke gennem den
await s.click('#solsystemBjælke button:has-text("Start flyby")');
for (let i = 0; i < 11; i++) {
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await ventFremme(); // (hop gør flyvningen færdig i næste billede)
  await s.click('#solsystemBjælke button:has-text("Næste")');
}
await ventFremme();
tjek('flybyen igen: ved "Mars set fra Phobos"', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'phobos-mars');
await s.click('#solsystemBjælke button[aria-label="Stop flyby"]');
await nulstilMåling();
await s.click('#solsystemTræ button[data-sted="mars"]');
await ventFremme();
m = await måling();
tjek('fra Phobos\' overflade til hele Mars: kameraet kommer aldrig ind i Phobos og bliver aldrig skubbet ud', m.måne > 0.25 && !m.ud && (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'mars', JSON.stringify(m));
// Står en måne i Mars' skygge ved et besøg, flytter den sig ud af skyggen, mens kameraet flyver derhen, og teksten
// siger det (før var både Phobos og Mars bag den helt mørke). kameraFra stiller Phobos lige bag Mars set fra Solen.
await fm(() => atomlabTest.solsystem.fænomen().kameraFra('phobos', 0, 180, 0));
await ventFremme();
await efterTo();
tjek('et besøg ved Phobos i Mars\' skygge: månen er flyttet ud af skyggen, og teksten siger det', !(await fm(() => atomlabTest.solsystem.fænomen().iSkygge('phobos'))) && /Ud af skyggen/.test(await s.textContent('#solsystemForklaring')) && (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'phobos');

// U1 (docs/plan-ux.md): træet i listen har alle steder og måner, og et tryk flyver derhen
await s.click('#solsystemTræ button[data-sted="mars"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
let t = await træ();
tjek('træet ved hele Mars: Flyby, Mars, de syv steder, Måner, Phobos og Deimos (Calderaen og udsigten fra Phobos står kun under deres sted)',
  t.map((p) => p.id).join() === 'tur,mars,olympus,tharsis,valles,hellas,gale,jezero,nordpol,måner,phobos,deimos' && t[1].valgt, JSON.stringify(t.map((p) => p.id)));
tjek('bjælken og Styr-boksen har ingen knapper til at gå steder hen', !(await fm(() => atomlabTest.solsystem.knapper())).some((k) => ['Hele Mars', 'Månerne'].includes(k)));
await s.click('#solsystemTræ button[data-sted="olympus"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
t = await træ();
tjek('ved Olympus Mons: markeret, og Calderaen og Skrænten står under den', t.find((p) => p.id === 'olympus').valgt && t.filter((p) => p.niveau === 2).map((p) => p.id).join() === 'caldera,skraent');
await s.click('#solsystemTræ button[data-sted="caldera"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
const vedCaldera = await fm(() => ({ ved: atomlabTest.solsystem.fænomen().ved(), navn: solsystemNavn.textContent, vej: solsystemVej.textContent }));
tjek('Calderaen kan nås direkte fra træet (før kun på flybyen): panelet og vejen viser den', vedCaldera.ved === 'caldera' && vedCaldera.navn === 'Calderaen' && vedCaldera.vej === '› Mars › Calderaen' && /seks gange/.test(await forklaring()), JSON.stringify(vedCaldera));
await s.click('#solsystemTræ button[data-sted="phobos"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await efterTo();
tjek('Phobos fra træet: stillet op som på flybyen (ikke i Mars\' skygge), og udsigten står under den', (await fm(() => atomlabTest.solsystem.fænomen().ordnet())) === 'phobos' && !(await fm(() => atomlabTest.solsystem.fænomen().iSkygge('phobos'))) && (await træ()).some((p) => p.id === 'phobos-mars' && p.niveau === 2));
await s.click('#solsystemTræ button[data-sted="mars"]');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await fm(() => atomlabTest.solsystem.gåTil('phobos-mars')); // fra hele Mars: først til Phobos, så ned på overfladen
for (let i = 0; i < 2; i++) {
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await ventFremme();
  await efterTo();
}
tjek('"Mars set fra Phobos" direkte fra hele Mars: kameraet ender ca. 300 m over Phobos', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'phobos-mars' && Math.abs((await fm(() => atomlabTest.solsystem.fænomen().måneHøjde('phobos'))) - 0.3) < 0.05);
// Flybyen markerer stedet i træet
await s.click('#solsystemBjælke button:has-text("Start flyby")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await s.click('#solsystemBjælke button:has-text("Næste")');
await efterTo();
tjek('på flybyen: Olympus Mons og flybyen er markeret i træet', (await træ()).find((p) => p.id === 'olympus')?.valgt && (await træ())[0].valgt);
// Bjælken: "‹" går et stop tilbage, og en prik springer (her til Phobos, som glider på plads som fra træet)
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await s.click('#solsystemBjælke button:has-text("Næste: Calderaen")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await s.click('#solsystemBjælke button:has-text("‹")');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
tjek('flybyen: "‹" går tilbage fra Calderaen til Olympus Mons', (await fm(() => [atomlabTest.solsystem.fænomen().ved(), atomlabTest.solsystem.fænomen().tur().trin].join())) === 'olympus,1');
await s.click('#solsystemVindue .ut-trin button:nth-child(11)');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
tjek('flybyen: en prik springer til Phobos, som står som på flybyen (ikke i skygge)', (await fm(() => [atomlabTest.solsystem.fænomen().ved(), atomlabTest.solsystem.fænomen().tur().trin, atomlabTest.solsystem.fænomen().ordnet()].join())) === 'phobos,10,phobos' && !(await fm(() => atomlabTest.solsystem.fænomen().iSkygge('phobos'))));
tjek('flybyen ved Phobos: bjælken har "Næste: Mars set fra Phobos ›"', (await fm(() => atomlabTest.solsystem.knapper())).some((k) => k.startsWith('Næste: Mars set fra Phobos')), JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())));
await s.click('#solsystemTræ button[data-sted="hellas"]');
tjek('et tryk i træet stopper flybyen og flyver til Hellas', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'hellas' && (await fm(() => atomlabTest.solsystem.fænomen().tur().trin)) === null);
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();

// Videre til et andet fænomen: kameraets indstillinger er sat tilbage
await s.click('#solsystem .sol-klode[data-id="jorden"]');
await s.click('#solsystemTræ button[data-id="aarstider"]');
await s.waitForTimeout(500);
const efter = await s.evaluate(async () => { const { verden, himmelDrejning } = await import('/js/scene3d.js'); return { near: verden.kamera.near, zoom: verden.styring.zoomSpeed, drej: verden.styring.rotateSpeed, styring: verden.styring.enabled, himmel: himmelDrejning() }; });
tjek('efter Mars: kameraets near, zoom, drejning og styring er sat tilbage, og himlen er ikke drejet', efter.near === 0.1 && efter.zoom === 1 && efter.drej === 1 && efter.styring && efter.himmel.join() === '0,0,0,1', JSON.stringify(efter));
// "Navne" huskes efter genindlæsning (stadig slået fra)
await s.reload();
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await efterTo();
tjek('efter genindlæsning: "Navne" er stadig slået fra, og der står ingen navne på kloden', !(await s.$eval(navneKnap, (k) => k.classList.contains('til'))) && (await fm(() => atomlabTest.solsystem.fænomen().navne())).length === 0);
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
  await s2.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder?.().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 30000 });
  const t0 = Date.now();
  const aktiv = await s2.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 20000, polling: 200 }).then(() => true, () => false);
  const ventede = (Date.now() - t0) / 1000;
  tjek('uden kortene til Olympus Mons bliver "Start flyby" aktiv efter ca. 8 sekunder', aktiv && ventede < 12, ventede);
  await s2.context().close();
}

// Tabletrunden (fund 1, 6. november 2026): Kameraet hoppede tættere på, når flyvningen stoppede ved Tharsis, Hellas og
// Nordpolen. Stoppets afstand (passer) er større på en smal skærm, men grænsen for zoom var fast (max 3), så første
// billede efter flyvningen klippede afstanden. Målt på tablet på højkant, hvor afstandene er størst: Afstanden og
// zoom (fov) i billedet, hvor flyvningen slutter, og de næste fire billeder må højst ændre sig 0,5 %.
{
  const s3 = await (await b.newContext({ viewport: { width: 820, height: 1180 } })).newPage();
  s3.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  await s3.goto(`${ADRESSE}/?test#solsystem`);
  await s3.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  await s3.click('#solsystem .kosmos-valg[data-id="mars"]');
  await s3.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 60000, polling: 200 });
  await s3.evaluate(async () => {
    const { verden } = await import('/js/scene3d.js');
    window.hopLog = [];
    verden.opdateringer.add(() => {
      const t = atomlabTest.solsystem.fænomen()?.tur?.();
      if (t) window.hopLog.push({ flyver: t.flyver, D: t.afstand, fov: verden.kamera.fov });
    });
  });
  // Spring flyvningen over (hop), og mål de første 5 billeder, efter den er slut
  const målStop = async () => {
    await s3.evaluate(() => atomlabTest.solsystem.fænomen().hop());
    await s3.waitForFunction(() => { const l = window.hopLog; const i = l.findIndex((x) => !x.flyver); return i >= 0 && l.length - i >= 5; }, null, { timeout: 60000, polling: 50 });
    return s3.evaluate(() => {
      const l = window.hopLog, i = l.findIndex((x) => !x.flyver), efter = l.slice(i, i + 5);
      const spring = Math.max(...efter.map((x) => Math.abs(x.D - efter[0].D) / Math.max(efter[0].D, 1e-9)));
      return { stop: atomlabTest.solsystem.fase().titel, D: efter.map((x) => +x.D.toFixed(4)), fov: Math.max(...efter.map((x) => x.fov)) - Math.min(...efter.map((x) => x.fov)), spring };
    });
  };
  const hop = [];
  await s3.evaluate(() => { window.hopLog.length = 0; atomlabTest.solsystem.trykPå('Start flyby'); });
  hop.push(await målStop());
  for (let nr = 1; nr < 13; nr++) {
    await s3.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 60000, polling: 50 });
    await s3.evaluate(() => { window.hopLog.length = 0; atomlabTest.solsystem.trykPå('Næste'); });
    hop.push(await målStop());
  }
  const dårlige = hop.filter((x) => !(x.spring < 0.005 && x.fov < 1e-6));
  tjek('tablet på højkant: ingen hop i afstanden eller zoom, når flyvningen stopper, ved alle 13 stop på flybyen', hop.length === 13 && dårlige.length === 0, JSON.stringify(dårlige.length ? dårlige : hop.map((x) => x.stop)));
  const hellas = hop.find((x) => /Hellas/.test(x.stop));
  tjek('tablet på højkant: Hellas står længere væk end den gamle grænse (3.000 km), og afstanden holder', hellas && hellas.D[0] > 3 && hellas.D[4] > 3, JSON.stringify(hellas));
  await s3.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
