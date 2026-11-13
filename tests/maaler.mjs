// Måleren (?maal, js/maaler.js, G1 i docs/plan-grafik.md): den vises kun med ?maal (og hentes ikke uden), tallene
// opdateres, et ryk kommer i listen med det, der skete lige før, "Kopiér" giver teksten, og feltet står inden for
// skærmen på tablet. Selve billederne i sekundet kan testbrowseren ikke sige noget om (den har intet grafikkort).
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('maaler');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

for (const [navn, opts] of [['pc', { viewport: { width: 1280, height: 800 } }], ['tablet', { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }]]) {
  const ctx = await b.newContext(opts);
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: ADRESSE });
  const p = await ctx.newPage();
  const fejl = [];
  p.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });

  if (navn === 'pc') {
    // Uden ?maal: intet felt, og modulet hentes ikke
    await p.goto(`${ADRESSE}/?test`);
    await p.waitForTimeout(800);
    const uden = await p.evaluate(() => ({
      felt: !!document.querySelector('.maaler'),
      hentet: performance.getEntriesByType('resource').some((e) => e.name.includes('maaler.js')),
    }));
    tjek('pc: uden ?maal er der intet felt, og maaler.js hentes ikke', !uden.felt && !uden.hentet, JSON.stringify(uden));
  }

  await p.goto(`${ADRESSE}/?test&maal#solsystem`);
  await p.waitForFunction(() => window.atomlabMålerTest && document.querySelector('.maaler'));
  // Tallene opdateres (feltet skrives to gange i sekundet)
  await p.waitForFunction(() => /^\d+(,\d)? billeder\/s$/.test(document.querySelector('.maaler-fps').textContent) && atomlabMålerTest.tallene().fps > 0, null, { timeout: 15000 });
  const t = await p.evaluate(() => atomlabMålerTest.tallene());
  tjek(`${navn}: tallene opdateres (billeder i sekundet, kald, trekanter og lærredet)`, t.fps > 0 && t.prBillede > 0 && t.kald > 0 && t.trekanter > 0 && t.bredde > 0 && t.programmer > 0, JSON.stringify(t));
  // Kald for hele billedet (ikke kun det sidste trin) og skønnet over teksturerne i grafikkortet: en tekstur på
  // 512 × 512 (RGBA8, 10 niveauer) giver ca. 1,4 MB mere, og den forsvinder igen, når den slettes
  const mb = await p.evaluate(async () => {
    const gl = document.getElementById('lærred').getContext('webgl2');
    const før = atomlabMålerTest.tallene().teksturMB;
    const tx = gl.createTexture();
    const gammel = gl.getParameter(gl.TEXTURE_BINDING_2D);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texStorage2D(gl.TEXTURE_2D, 10, gl.RGBA8, 512, 512);
    gl.bindTexture(gl.TEXTURE_2D, gammel);
    const med = atomlabMålerTest.tallene().teksturMB;
    gl.deleteTexture(tx);
    return { før, med, efter: atomlabMålerTest.tallene().teksturMB };
  });
  tjek(`${navn}: kald for hele billedet, og teksturerne i grafikkortet tælles (MB)`, t.kald > 2 && t.trekanter > 100 && Math.abs(mb.med - mb.før - 1.398) < 0.01 && Math.abs(mb.efter - mb.før) < 1e-6, JSON.stringify({ kald: t.kald, trekanter: t.trekanter, mb }));

  // Et ryk: et billede, der tager ca. 150 ms, med en hændelse lige før. Det står i listen med hændelsen.
  const førRyk = await p.evaluate(() => atomlabMålerTest.antalRyk());
  await p.evaluate(() => new Promise((klar) => requestAnimationFrame(() => {
    atomlabMåler('prøve-hændelse');
    const t0 = performance.now();
    while (performance.now() - t0 < 150) { /* et langt billede */ }
    klar();
  })));
  await p.waitForTimeout(1500); // hændelserne tages med 1 sekund efter rykket
  const tekst = await p.evaluate(() => atomlabMålerTest.tekst());
  tjek(`${navn}: et langt billede kommer i listen over ryk med det, der skete lige før`, (await p.evaluate(() => atomlabMålerTest.antalRyk())) > førRyk && /ms \(opdater [\d,]+, tegn [\d,]+\): .*prøve-hændelse/.test(tekst), tekst.split('\n').slice(-5).join('\n'));

  // "Kopiér" lægger teksten i udklipsholderen
  await p.click('.maaler-kopier');
  await p.waitForFunction(() => document.querySelector('.maaler-kopier').textContent.includes('Kopieret'), null, { timeout: 5000 }).catch(() => {});
  const kopi = await p.evaluate(() => navigator.clipboard.readText()).catch((e) => 'fejl: ' + e.message);
  tjek(`${navn}: "Kopiér" giver teksten med grafikkortet, tallene og rykkene`, /^AtomLab-måler/.test(kopi) && /Grafikkort: /.test(kopi) && /Ryk \(de sidste/.test(kopi) && /prøve-hændelse/.test(kopi), kopi.slice(0, 300));

  // Feltet står inden for skærmen og kan foldes sammen og flyttes
  const plads = await p.evaluate(() => { const r = document.querySelector('.maaler').getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, B: innerWidth, H: innerHeight }; });
  await p.click('.maaler-fold');
  const lille = await p.evaluate(() => ({ lille: document.querySelector('.maaler').classList.contains('lille'), mere: getComputedStyle(document.querySelector('.maaler-mere')).display }));
  await p.click('.maaler-flyt');
  const flyttet = await p.evaluate(() => document.querySelector('.maaler').classList.contains('oppe-v'));
  tjek(`${navn}: feltet står inden for skærmen og kan foldes sammen og flyttes`, plads.l >= 0 && plads.t >= 0 && plads.r <= plads.B && plads.b <= plads.H && lille.lille && lille.mere === 'none' && flyttet, JSON.stringify({ plads, lille, flyttet }));
  await p.screenshot({ path: `${UD}/${navn}.png` });
  tjek(`${navn}: ingen konsolfejl`, fejl.length === 0, fejl.join('\n'));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
