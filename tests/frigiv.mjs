// Billederne frigives (G1 trin 3, forslag G i docs/plan-grafik.md): Landskabets billeder slettes fra lageret, når man
// letter fra Stå på Mars, men Mars' egne kort bliver. Man kan stå samme sted igen (billederne hentes igen). Når man
// skifter planet, forsvinder den forriges billeder, og Jordens billeder hentes ikke igen mellem Jorden og Årstiderne.
// Når man forlader Solsystemet, er lageret tomt, og måleren (?maal) viser færre MB i grafikkortet.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.type() + ': ' + m.text()); });
const hentede = []; // billeder, browseren har hentet (også fra sin cache)
s.on('request', (r) => { if (r.url().includes('/billeder/')) hentede.push(r.url().split('/').pop()); });

await s.goto(`${ADRESSE}/?test&maal#solsystem`);
await s.waitForFunction(() => window.atomlabTest && window.atomlabMålerTest && document.querySelector('#solsystem:not(.skjult)'));
// Lageret i js/solsystem/hent.js (samme modul som programmets, for adressen er den samme)
const lager = () => s.evaluate(async () => [...(await import('/js/solsystem/hent.js')).lager].filter(([, x]) => x.tekstur).map(([n]) => n));
const mb = () => s.evaluate(() => atomlabMålerTest.tallene().teksturMB);
const vælg = async (id) => {
  await s.evaluate((i) => document.querySelector(`#solsystem button[data-id="${i}"]`).click(), id);
  await s.waitForFunction((i) => atomlabTest.solsystem.valgt() === i, id, { timeout: 20000, polling: 100 });
};
const fm = (f) => s.evaluate(f);
const stå = () => fm(() => atomlabTest.solsystem.fænomen().stå());
// Landingen springes over (som i landskab.mjs), og fotoet toner ind
const landet = async () => {
  await fm(() => atomlabTest.solsystem.fænomen().hop());
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander, null, { polling: 100 });
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().foto.synlig > 0, null, { timeout: 30000, polling: 100 }).catch(() => {});
};
const hop = async () => { await fm(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { polling: 100 }); };

await vælg('mars');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort && atomlabTest.solsystem.fænomen().billeder().hentet.højde, null, { timeout: 60000, polling: 200 });

// Stå på Mars ved Naukluft og op igen
await fm(() => atomlabTest.solsystem.fænomen().ståPå('naukluft'));
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
await landet();
const førsteFoto = (await stå()).foto.synlig > 0;
const iLandskab = await lager();
const mbStår = await mb();
await fm(() => atomlabTest.solsystem.fænomen().tilbageOp());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 30000, polling: 100 });
const oppe = await lager();
const mbOppe = await mb();
tjek('Naukluft første gang: man står med fotoet', førsteFoto);
tjek('op fra Stå på Mars: landskabets og fotoets billeder er slettet, Mars\' egne kort er der stadig',
  iLandskab.some((n) => n.startsWith('landskab/pano-')) && iLandskab.some((n) => n.startsWith('landskab/gale-'))
  && !oppe.some((n) => n.startsWith('landskab/')) && oppe.includes('mars-gale-farve.jpg') && oppe.some((n) => /^mars-\d+k\.jpg$/.test(n)),
  JSON.stringify({ iLandskab, oppe }));
tjek('op fra Stå på Mars: færre MB i grafikkortet (måleren)', mbOppe < mbStår - 1, JSON.stringify({ mbStår, mbOppe }));

// Samme sted igen: billederne hentes igen, og man står med fotoet
await fm(() => atomlabTest.solsystem.fænomen().ståPå('naukluft'));
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
await landet();
const igen = await stå();
tjek('Naukluft igen: man står, lagene og fotoet er hentet igen', igen.står && igen.sted === 'naukluft' && igen.foto.synlig > 0 && (await lager()).some((n) => n.startsWith('landskab/gale-')), JSON.stringify({ sted: igen.sted, foto: igen.foto }));

// En anden planet: Mars' billeder (også landskabets) forsvinder
await vælg('jorden');
await s.waitForTimeout(1000);
const efterMars = await lager();
tjek('skift til Jorden: Mars\' og landskabets billeder er slettet fra lageret', !efterMars.some((n) => n.startsWith('mars-') || n.startsWith('landskab/') || n.startsWith('phobos')), JSON.stringify(efterMars));

// Jorden → Årstiderne: Jordens billeder bliver (de hentes ikke igen)
await s.evaluate(() => import('/js/kosmos/jorden.js').then((m) => m.billederHentet()));
const førÅrstider = hentede.filter((n) => n.startsWith('jorden-')).length;
await vælg('aarstider');
await s.waitForTimeout(1500);
await s.evaluate(() => import('/js/kosmos/jorden.js').then((m) => m.billederHentet()));
const nyeJorden = hentede.filter((n) => n.startsWith('jorden-')).slice(førÅrstider);
tjek('Jorden → Årstiderne: Jordens billeder hentes ikke igen', førÅrstider > 0 && nyeJorden.length === 0, JSON.stringify({ førÅrstider, nyeJorden }));

// Ud af Solsystemet: lageret er tomt, og grafikkortet har færre MB
await vælg('saturn');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder?.() && Object.keys(atomlabTest.solsystem.fænomen().billeder()).length > 0, null, { timeout: 30000, polling: 200 }).catch(() => {});
await s.waitForTimeout(1000);
const mbSaturn = await mb();
const iSaturn = await lager();
await fm(() => { location.hash = ''; });
await s.waitForTimeout(1500);
const ude = await lager();
const mbUde = await mb();
tjek('ud af Solsystemet: lageret er tomt, og grafikkortet har færre MB', iSaturn.length > 0 && ude.length === 0 && mbUde < mbSaturn - 2, JSON.stringify({ iSaturn: iSaturn.length, ude, mbSaturn, mbUde }));

console.log(fejl.length ? fejl.join('\n') : 'ingen fejl i konsollen');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0);
