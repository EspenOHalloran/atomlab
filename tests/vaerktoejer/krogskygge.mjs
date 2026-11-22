// Skygge i krogene (G4, ambient occlusion, 21. november 2026): billeder og måling med og uden skyggen med fuld grafik.
// Brug: node tests/vaerktoejer/krogskygge.mjs [navn] [enheder]  (billederne i tests/billeder/krogskygge/<navn>)
// enheder: pc,telefon (standard). Telefonen er sat til trinnet Høj (skyggen findes kun dér på touch).
// Viser jern (26) med kernen tæt på i Værkstedet, saltkrystallen i Molekyler og urankernen i Reaktoren (del 1).
// Tallene er fra testbrowseren uden grafikkort (måleren ?maal): kun til at sammenligne med og uden, ikke de rigtige tal.
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';

const navn = process.argv[2] ?? 'nu';
const valgte = (process.argv[3] ?? 'pc,telefon').split(',');
const kun = process.argv[4]; // fx vaerksted: kun Værkstedet
const UD = billedmappe(`krogskygge/${navn}`);
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const ENHEDER = {
  pc: { viewport: { width: 1280, height: 800 } },
  telefon: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
};
const resultat = {};
for (const enhed of valgte) {
  const ctx = await b.newContext(ENHEDER[enhed]);
  if (process.env.AO_SKALA) await ctx.addInitScript((v) => { globalThis.atomlabAOSkala = Number(v); }, process.env.AO_SKALA); // (kun til at prøve)
  const page = await ctx.newPage();
  page.setDefaultTimeout(180000);
  const fejl = [];
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.text()); });
  const mål = async () => {
    await page.waitForTimeout(3000);
    const t = [];
    for (let i = 0; i < 3; i++) { await page.waitForTimeout(1200); t.push(await page.evaluate(() => atomlabMålerTest.tallene())); }
    return { ms: Math.round(t.reduce((s, x) => s + x.prBillede, 0) / t.length), kald: t.at(-1).kald, MB: Math.round(t.at(-1).teksturMB) };
  };
  // Måler og tager et billede uden og med skyggen (det valg, skærmen selv har sat)
  const begge = async (id) => {
    const valg = await page.evaluate(async () => { const k = await import('/js/krogskygge.js'); const v = k.krogskygge(); globalThis._valg = k.valgtNu(); k.brugKrogskygge(null); return v; });
    const uden = await mål();
    await page.screenshot({ path: `${UD}/${enhed}-${id}-uden.png` });
    await page.evaluate(async () => (await import('/js/krogskygge.js')).brugKrogskygge(globalThis._valg));
    const med = await mål();
    const tilstand = await page.evaluate(async () => (await import('/js/krogskygge.js')).krogskygge());
    await page.screenshot({ path: `${UD}/${enhed}-${id}-med.png` });
    resultat[enhed][id] = { uden, med, tilstand, førValg: valg };
  };
  resultat[enhed] = {};
  await page.goto(`${ADRESSE}/?test&maal#vaerksted`);
  await page.waitForFunction(() => window.atomlabTest?.vaerksted && window.atomlabMålerTest, null, { timeout: 60000, polling: 200 });
  if (enhed === 'telefon') await page.evaluate(async () => (await import('/js/scene3d.js')).sætTrin('høj'));
  // Værkstedet: jern med ringe, kameraet fast og tæt på kernen
  await page.evaluate(async () => {
    const f = await import('/js/fremgang.js');
    const v = await import('/js/vaerksted.js');
    const s = await import('/js/scene3d.js');
    f.opdag(26);
    v.åbnGrundstof(26);
    atomlabTest.vaerksted.spol(3);
    s.verden.styring.autoRotate = false;
    s.verden.målAfstand = null;
    s.verden.styring.target.set(0, 0, 0);
    const a = s.LAV_KVALITET ? 15 : 9; s.verden.kamera.position.set(0, a * Math.sin(0.25), a * Math.cos(0.25));
    s.verden.styring.update();
  });
  await begge('vaerksted-kerne');
  if (kun === 'vaerksted') { resultat[enhed].fejl = fejl; await page.context().close(); continue; }
  // Molekyler: saltkrystallen ("Giv elektroner")
  await page.evaluate(() => { location.hash = '#molekyler'; });
  await page.waitForFunction(() => window.atomlabTest?.klar(), null, { timeout: 60000 });
  await page.evaluate(async () => {
    const m = atomlabTest.molekyler;
    m.sætMåde('bytte');
    m.bytte.handling(); m.bytte.spol(3); m.bytte.handling(); m.bytte.spol(7); // "Vis mig" og "Lad dem mødes": parret er samlet
    m.bytte.byg(); m.bytte.spol(12);
    (await import('/js/scene3d.js')).verden.styring.autoRotate = false;
  });
  await page.waitForTimeout(6000);
  await begge('molekyler-krystal');
  // Reaktoren: kædereaktionen (brændslet og stavene)
  await page.evaluate(() => { location.hash = '#reaktor'; });
  await page.waitForFunction(() => window.atomlabTest?.klar(), null, { timeout: 60000 });
  await page.evaluate(() => atomlabTest.reaktor.tilstand('kerne'));
  await page.waitForTimeout(4000);
  await begge('reaktor-kerne');
  resultat[enhed].fejl = fejl;
  await page.context().close();
}
await b.close();
console.log(JSON.stringify(resultat, null, 1));
