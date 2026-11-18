// Billeder af Nordpolen på Mars (M7b-pol) med fuld grafik: stoppet "Nordpolen" fra træet, lige ned over polen og
// kanten af polarnettet set fra siden (er der en kant?).
// Kør: node tests/vaerktoejer/nordpol.mjs [pc|tablet]  (billederne lægges i tests/billeder/nordpol/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('nordpol');
const tablet = process.argv[2] === 'tablet';
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const kontekst = await b.newContext(tablet
  ? { viewport: { width: 1340, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 }
  : { viewport: { width: 1280, height: 800 } });
const s = await kontekst.newPage();
const fejl = [];
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort, null, { timeout: 120000, polling: 200 });
const fm = (u, a) => s.evaluate(u, a);
const ventFremme = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 100 });
const navn = tablet ? 'tablet' : 'pc';
await fm(() => atomlabTest.solsystem.gåTil('nordpol'));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.nordpol; return l.hentet.højde && l.hentet.kort && l.tabel; }, null, { timeout: 120000, polling: 200 });
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await s.waitForTimeout(2500);
await s.screenshot({ path: `${UD}/${navn}-1-stoppet.png` });
console.log('stoppet', JSON.stringify(await fm(() => { const v = atomlabTest.solsystem.fænomen().vedSted('nordpol'); return { over: v.overJorden, sol: v.solHøjde }; })));
// Kun 3D-billedet (uden paneler) til at se nettet
const kig = async (fil, bredde, længde, km, vinkel, kompas) => {
  await fm(([b_, l_, k_, v_, c_]) => atomlabTest.solsystem.fænomen().kigPå?.(b_, l_, k_, v_, c_), [bredde, længde, km, vinkel, kompas]);
  await s.waitForTimeout(1500);
  await s.screenshot({ path: `${UD}/${navn}-${fil}.png` });
  console.log(fil);
};
if (await fm(() => typeof atomlabTest.solsystem.fænomen().kigPå === 'function')) {
  await kig('2-ovenfra', 90, 0, 1800, 89, 180);
  await kig('3-kanten', 78.3, 120, 60, 12, 0);
  await kig('4-chasma', 84, 315, 250, 25, 135);
}
await b.close();
console.log(fejl.length ? fejl.join('\n') : 'Ingen konsolfejl');
