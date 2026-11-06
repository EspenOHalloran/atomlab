// Jupiter (J1 i docs/plan-jupiter.md): kloden står i Solsystemet mellem Mars og Saturn, kortet hentes og ligger rigtigt
// (pletten syd for ækvator, ingen søm, ingen sorte poler), Jupiter er fladtrykt, drejer mod uret set fra nord og står
// stille i pause. Ingen fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('jupiter');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
const fm = (f, a) => s.evaluate(f, a);

// ---------- Listen ----------
const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Jupiter står i listen mellem Mars og Saturn', ids.indexOf('jupiter') === ids.indexOf('mars') + 1 && ids.indexOf('saturn') === ids.indexOf('jupiter') + 1, JSON.stringify(ids));
const kloder = await fm(() => [...document.querySelectorAll('#solsystem .sol-klode')].map((k) => { const r = k.getBoundingClientRect(); return { id: k.dataset.id ?? k.textContent.trim(), y: Math.round(r.top), synlig: r.width > 0 }; }));
tjek('kloderne står på én række: Sol, Jord, Mars, Jupiter og Saturn', kloder.length === 5 && new Set(kloder.map((k) => k.y)).size === 1 && kloder[3].id === 'jupiter' && kloder.every((k) => k.synlig), JSON.stringify(kloder));
await s.click('#solsystem .sol-klode[data-id="jupiter"]');
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'jupiter' && atomlabTest.solsystem.fænomen()?.hentet(), null, { timeout: 30000, polling: 200 }).catch(() => {});
tjek('Jupiter åbner, og kortet er hentet (1k i tests, i farver)', (await fm(() => atomlabTest.solsystem.fænomen().hentet())) && (await fm(() => atomlabTest.solsystem.fænomen().billeder()))['jupiter-1k.jpg'] === 'farver', JSON.stringify(await fm(() => atomlabTest.solsystem.fænomen().billeder())));
tjek('sort himmel (ingen tågeskyer)', !(await fm(() => atomlabTest.solsystem.tåger())));
const træ = await fm(() => atomlabTest.solsystem.træ());
tjek('træet: kun Jupiter (stederne og månerne kommer i J3 og J4)', træ.map((p) => p.id).join() === 'jupiter' && træ[0].valgt, JSON.stringify(træ));
tjek('Styr-boksen: kontakten Modlys', JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())) === JSON.stringify(['Modlys']), JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())));
const side = await fm(() => atomlabTest.solsystem.side());
tjek('siden: fladtrykt, Billederne og "Ærligt talt" sidst', /fladtrykt/.test(side.tekst) && side.bokse.includes('Billederne') && side.sidst === 'Ærligt talt', JSON.stringify(side.bokse));

// ---------- Formen og drejningen ----------
const form = await fm(() => atomlabTest.solsystem.fænomen().form());
tjek('Jupiter er fladtrykt 6,5 % (66.854 / 71.492 km), og aksen hælder 3,13°', Math.abs(form.flad - 66854 / 71492) < 1e-6 && Math.abs(form.hældning * 180 / Math.PI - 3.13) < 1e-6, JSON.stringify(form));
tjek('tidsknappen: ▶ fra start', (await fm(() => atomlabTest.solsystem.tidsknap())) === 'spil');
// Et punkt på ækvator set fra nord (x mod højre, −z opad i billedet): vinklen atan2(−z, x) vokser, når Jupiter drejer mod uret
const vinkel = () => fm(() => { const p = atomlabTest.solsystem.fænomen().punkt(0); return { v: Math.atan2(-p[2], p[0]), d: atomlabTest.solsystem.fænomen().drejning() }; });
const v0 = await vinkel();
await s.waitForFunction((d0) => atomlabTest.solsystem.fænomen().drejning() > d0 + 0.05, v0.d, { timeout: 15000, polling: 100 }).catch(() => {});
const v1 = await vinkel();
const dv = Math.atan2(Math.sin(v1.v - v0.v), Math.cos(v1.v - v0.v));
tjek('Jupiter drejer mod uret set fra nord (mod øst)', v1.d > v0.d && dv > 0.04, JSON.stringify({ v0, v1, dv }));
await s.click('#solsystemTid button[data-tid="pause"]');
const p0 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForTimeout(1200);
const p1 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
tjek('Jupiter står stille i pause', p0 === p1, JSON.stringify([p0, p1]));
await s.click('#solsystemTid button[data-tid="spil"]');

// ---------- Kortet (lavet af billeder/solsystem/lav_jupiter.py) ----------
const kort = await fm(async () => {
  const im = new Image();
  im.src = '/billeder/solsystem/jupiter-2k.jpg';
  await im.decode();
  const c = document.createElement('canvas');
  c.width = im.width; c.height = im.height;
  const g = c.getContext('2d');
  g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const px = (x, y) => { const i = (y * c.width + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  // Den rødeste plet (rød minus blå, glattet over 9 × 9 pixel) mellem 40° S og 40° N
  let bedst = { r: -1e9 };
  for (let y = Math.round(c.height * 0.28); y < c.height * 0.72; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      let r = 0;
      for (let dy = -4; dy <= 4; dy += 4) for (let dx = -4; dx <= 4; dx += 4) { const p = px((x + dx + c.width) % c.width, Math.min(c.height - 1, y + dy)); r += p[0] - p[2]; }
      if (r > bedst.r) bedst = { r, x, y };
    }
  }
  // Sømmen: springet mellem første og sidste søjle i forhold til springet ved JPEG's blokgrænser (hver 16. søjle).
  // Første og sidste søjle ligger i hver sin blok, så de kan ikke være mere ens end to blokke inde i billedet.
  const spring = (x0, x1) => { let sum = 0; for (let y = 0; y < c.height; y++) { const a = px(x0, y), z = px(x1, y); sum += Math.abs(a[0] - z[0]) + Math.abs(a[1] - z[1]) + Math.abs(a[2] - z[2]); } return sum / c.height; };
  const søm = spring(0, c.width - 1) * c.height;
  let nabo = 0;
  for (let x = 15; x < c.width - 1; x += 16) nabo += spring(x, x + 1);
  nabo *= c.height / ((c.width / 16) - 1);
  // Polerne: den mørkeste pixel i de øverste og nederste 2 % (OPAL er sort, hvor det mangler data)
  let mørkest = 255;
  for (const y of [...Array(Math.round(c.height * 0.02)).keys()].flatMap((i) => [i, c.height - 1 - i])) for (let x = 0; x < c.width; x += 4) mørkest = Math.min(mørkest, Math.max(...px(x, y)));
  return { b: im.width, h: im.height, beta: 90 - ((bedst.y + 0.5) / c.height) * 180, længde: ((bedst.x + 0.5) / c.width) * 360, søm: søm / c.height, nabo: nabo / c.height, mørkest };
});
// Pletten står ved ca. 22-23° S planetografisk (OPAL, december 2025). På kuglen svarer det til en parametrisk bredde
// på ca. 21° (tan β = (b/a) tan φ). Uden omregning ville den stå ved 22-23°.
const beta = (phi) => Math.atan((66854 / 71492) * Math.tan(phi * Math.PI / 180)) * 180 / Math.PI;
tjek('kortet: 2048 × 1024', kort.b === 2048 && kort.h === 1024, JSON.stringify(kort));
tjek(`kortet: pletten står ved den parametriske bredde for 21-24° S (${beta(-21).toFixed(1)} til ${beta(-24).toFixed(1)}°)`, kort.beta < beta(-21) && kort.beta > beta(-24), JSON.stringify(kort));
tjek('kortet: ingen søm, hvor kortet går rundt (ikke større end ved JPEG\'s blokgrænser)', kort.søm < kort.nabo * 1.4, JSON.stringify(kort));
tjek('kortet: ingen sorte huller ved polerne', kort.mørkest > 60, JSON.stringify(kort));

await s.screenshot({ path: UD + '/1-jupiter.png' });
await s.context().close();
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
