// Grafik G3 (Værkstedet): billeder og måling af atomet med fuld grafik på pc og tablet.
// Brug: node tests/vaerktoejer/vaerksted-grafik.mjs [navn]  (billederne lægges i tests/billeder/vaerksted-grafik/<navn>)
// Viser jern (26 protoner, 30 neutroner) med ringe, kernen tæt på og elektronskyen, og ilt med elektronsky.
// Tallene er fra testbrowseren uden grafikkort (måleren ?maal): kun til at sammenligne før og efter, ikke de rigtige tal.
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';

const navn = process.argv[2] ?? 'nu';
const UD = billedmappe(`vaerksted-grafik/${navn}`);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
// Med "layout" som andet ord: telefon og tablet på højkant i stedet (kun billeder, tallene er ikke til at sammenligne)
const enheder = process.argv[3] === 'layout' ? [
  ['telefon', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }],
  ['tablet-hoejkant', { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true }],
] : [
  ['pc', { viewport: { width: 1280, height: 800 } }],
  ['tablet', { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }],
];
const resultat = {};
for (const [enhed, opts] of enheder) {
  const page = await (await b.newContext(opts)).newPage();
  page.setDefaultTimeout(120000);
  const fejl = [];
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
  await page.goto(`${ADRESSE}/?test&maal#vaerksted`);
  await page.waitForFunction(() => window.atomlabTest?.vaerksted && window.atomlabMålerTest, null, { timeout: 60000, polling: 200 });
  // Et atom med kamera på en fast plads, uden den automatiske drejning
  const vis = async (nr, sky, afstand, højde = 0.25) => page.evaluate(async ([nr, sky, afstand, højde]) => {
    const f = await import('/js/fremgang.js');
    const v = await import('/js/vaerksted.js');
    const s = await import('/js/scene3d.js');
    f.opdag(nr);
    v.åbnGrundstof(nr);
    const knap = document.getElementById('knapVisning');
    const erSky = knap.getAttribute('aria-checked') === 'true' || knap.classList.contains('til');
    if (sky !== erSky) knap.click();
    atomlabTest.vaerksted.spol(3);
    s.verden.styring.autoRotate = false;
    s.verden.målAfstand = null;
    s.verden.styring.target.set(0, 0, 0);
    s.verden.kamera.position.set(0, afstand * Math.sin(højde), afstand * Math.cos(højde));
    s.verden.styring.update();
  }, [nr, sky, afstand, højde]);
  const mål = async () => {
    await page.waitForTimeout(4000);
    const t = [];
    for (let i = 0; i < 4; i++) { await page.waitForTimeout(1200); t.push(await page.evaluate(() => atomlabMålerTest.tallene())); }
    const ms = t.reduce((s, x) => s + x.prBillede, 0) / t.length;
    return { ms: Math.round(ms), trekanter: t.at(-1).trekanter, kald: t.at(-1).kald, MB: Math.round(t.at(-1).teksturMB) };
  };
  resultat[enhed] = {};
  for (const [id, nr, sky, afstand] of [['jern-ringe', 26, false, 30], ['jern-kerne', 26, false, 9], ['jern-sky', 26, true, 30], ['ilt-sky', 8, true, 22]]) {
    await vis(nr, sky, afstand);
    resultat[enhed][id] = await mål();
    await page.screenshot({ path: `${UD}/${enhed}-${id}.png` });
  }
  resultat[enhed].fejl = fejl;
  await page.context().close();
}
await b.close();
console.log(JSON.stringify(resultat, null, 1));
