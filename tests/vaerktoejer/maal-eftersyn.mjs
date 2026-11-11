// Målinger til det store eftersyn (E0 i docs/plan-fable-eftersyn.md), så de kan køres igen senere og sammenlignes.
// For starten og hver skærm (og nogle tunge fænomener), på pc og på tablet (touch, så LAV_KVALITET er slået til):
// - hvad der hentes ved første besøg (MB og antal filer, delt i Three.js, egen kode, billeder og andet)
// - renderer.info for ét billede (kald, trekanter), geometrier og teksturer, og et skøn over teksturernes hukommelse
// - JS-heap (efter oprydning) i menuen før besøget, på skærmen og i menuen igen bagefter (frigives det?)
// - tiden, til alt er hentet (lokal server, ingen grafikkort, så kun til sammenligning)
// Brug: node tests/vaerktoejer/maal-eftersyn.mjs [pc|tablet] [id …]   (serveren startes ikke her, se tests/README.md)
// Skriver en tabel i Markdown på skærmen og gemmer rådata i docs/fable/eftersyn/maalinger.json (JSON=sti ændrer stedet).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const ENHEDER = { pc: { viewport: { width: 1440, height: 900 } }, tablet: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true } };
// [id, hvordan man kommer dertil, tekst]. 'hash' = skift skærm, ellers vælges fænomenet i sin skærm
const MÅL = [
  ['start', null, 'Starten (menuen)'],
  ['vaerksted', '#vaerksted', 'Atomværkstedet'],
  ['molekyle', '#vaerksted', 'Byg et molekyle'],
  ['system', '#system', 'Det periodiske system'],
  ['fusion', '#fusion', 'Stjerneovnen'],
  ['reaktor', '#reaktor', 'Reaktoren'],
  ['batteri', '#batteri', 'Batteriet'],
  ['liv', '#liv', 'Liv'],
  ['ordbog', '#ordbog', 'Ordbogen'],
  ['solsystem', '#solsystem', 'Solsystemet (første fænomen)'],
  ['kosmos', '#kosmos', 'Kosmos (første fænomen)'],
  ['mars', 'solsystem', 'Mars'],
  ['jupiter', 'solsystem', 'Jupiter'],
  ['saturn', 'solsystem', 'Saturn'],
  ['venus', 'solsystem', 'Venus'],
  ['jorden', 'solsystem', 'Jorden'],
  ['sorthul', 'kosmos', 'Sort hul'],
  ['tidhvorfor', 'kosmos', 'Hvorfor går tiden langsommere?'],
];
const args = process.argv.slice(2);
const enheder = args.filter((a) => ENHEDER[a]).length ? args.filter((a) => ENHEDER[a]) : ['pc', 'tablet'];
const valgte = args.filter((a) => !ENHEDER[a]);
const mål = valgte.length ? MÅL.filter(([id]) => id === 'start' || valgte.includes(id)) : MÅL;
const JSON_STI = process.env.JSON ?? fileURLToPath(new URL('../../docs/fable/eftersyn/maalinger.json', import.meta.url));

const b = await chromium.launch({ args: [...ARGS, '--enable-precise-memory-info'], fuldGrafik: true });

const slags = (url) => {
  const sti = new URL(url).pathname;
  if (sti.startsWith('/lib/three/')) return 'three';
  if (sti.startsWith('/js/')) return 'kode';
  if (sti.startsWith('/billeder/')) return 'billeder';
  return 'andet';
};

// Holder øje med nettet: hvad der hentes, og hvornår der sidst skete noget
function net(page) {
  const n = { igang: 0, sidst: Date.now(), filer: [] };
  page.on('request', () => { n.igang++; n.sidst = Date.now(); });
  const færdig = async (r, ok) => {
    n.igang--;
    n.sidst = Date.now();
    if (!ok) return;
    let str = 0;
    try { str = Math.max(0, (await r.sizes()).responseBodySize); } catch { /* siden er lukket */ }
    n.filer.push({ url: r.url(), slags: slags(r.url()), str });
  };
  page.on('requestfinished', (r) => færdig(r, true));
  page.on('requestfailed', (r) => færdig(r, false));
  n.nulstil = () => { n.filer = []; };
  // Stille i 2,5 sekunder (højst 120 sekunder)
  n.stille = async () => {
    const start = Date.now();
    while (Date.now() - start < 120000) {
      await page.waitForTimeout(250);
      if (n.igang <= 0 && Date.now() - n.sidst > 2500) return (n.sidst - start) / 1000;
    }
    return null;
  };
  n.sum = () => {
    const s = { three: 0, kode: 0, billeder: 0, andet: 0, filer: n.filer.length };
    for (const f of n.filer) s[f.slags] += f.str;
    s.ialt = s.three + s.kode + s.billeder + s.andet;
    return s;
  };
  return n;
}

async function heap(page, cdp) {
  await cdp.send('HeapProfiler.collectGarbage');
  await page.waitForTimeout(300);
  await cdp.send('HeapProfiler.collectGarbage');
  return (await cdp.send('Runtime.getHeapUsage')).usedSize;
}

// renderer.info for ét helt billede (med alle gløde-trin) og et skøn over teksturerne i scenen
async function grafik(page) {
  return page.evaluate(async () => {
    const { verden, LAV_KVALITET } = await import('/js/scene3d.js');
    const r = verden.renderer;
    if (!r) return null;
    r.info.autoReset = false;
    await new Promise((f) => requestAnimationFrame(() => { r.info.reset(); requestAnimationFrame(f); }));
    const render = { kald: r.info.render.calls, trekanter: r.info.render.triangles, punkter: r.info.render.points, linjer: r.info.render.lines };
    r.info.autoReset = true;
    const set = new Set();
    const tag = (v) => { if (v?.isTexture) set.add(v); };
    verden.scene.traverse((o) => {
      for (const m of [o.material].flat().filter(Boolean)) {
        for (const v of Object.values(m)) tag(v);
        for (const u of Object.values(m.uniforms ?? {})) [u?.value].flat().forEach(tag);
      }
    });
    tag(verden.scene.background);
    tag(verden.scene.environment);
    let bytes = 0;
    for (const t of set) {
      const billede = t.image ?? t.source?.data;
      const w = billede?.width ?? 0;
      const h = billede?.height ?? 0;
      const d = billede?.depth ?? 1;
      bytes += w * h * d * 4 * (t.generateMipmaps && t.minFilter > 1006 ? 4 / 3 : 1) * (t.isCubeTexture ? 6 : 1);
    }
    return {
      lav: LAV_KVALITET, pixelforhold: r.getPixelRatio(), ...render,
      geometrier: r.info.memory.geometries, teksturer: r.info.memory.textures, programmer: r.info.programs?.length ?? 0,
      teksturerIScenen: set.size, teksturMB: bytes / 1048576,
    };
  });
}

const resultater = [];
for (const enhed of enheder) {
  for (const [id, hvor, tekst] of mål) {
    const ctx = await b.newContext(ENHEDER[enhed]); // ny kontekst = tom cache = første besøg
    const page = await ctx.newPage();
    const fejl = [];
    page.on('pageerror', (e) => fejl.push(e.message));
    const n = net(page);
    const cdp = await ctx.newCDPSession(page);
    const t0 = Date.now();
    await page.goto(`${ADRESSE}/?test`);
    await page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1, batteri: 1 })));
    await page.waitForFunction(() => window.atomlabTest && !document.querySelector('#menu.skjult'), null, { timeout: 60000 });
    const klar = (Date.now() - t0) / 1000;
    await n.stille();
    const r = { enhed, id, tekst, fejl };
    if (id === 'start') {
      Object.assign(r, { hentet: n.sum(), sek: klar, heapMB: (await heap(page, cdp)) / 1048576, grafik: await grafik(page) });
      const nav = await page.evaluate(() => { const e = performance.getEntriesByType('navigation')[0]; return { dcl: e.domContentLoadedEventEnd / 1000, load: e.loadEventEnd / 1000 }; });
      Object.assign(r, nav);
    } else {
      const før = await heap(page, cdp);
      n.nulstil();
      const t1 = Date.now();
      if (hvor.startsWith('#')) {
        await page.evaluate((h) => { location.hash = h; }, hvor);
        if (id === 'molekyle') { await page.waitForTimeout(800); await page.click('[data-vaerksted-del="molekyle"]'); }
      } else {
        await page.evaluate((h) => { location.hash = '#' + h; }, hvor);
        await page.waitForFunction((h) => window.atomlabTest?.[h]?.vælg, hvor);
        await page.waitForTimeout(500);
        await page.evaluate(([h, id]) => atomlabTest[h].vælg(id), [hvor, id]);
      }
      const sek = await n.stille();
      // Tiden fra skiftet, til det sidste blev hentet (0, hvis intet blev hentet)
      r.sek = sek === null ? null : n.filer.length ? Math.max(0, n.sidst - t1) / 1000 : 0;
      r.hentet = n.sum();
      r.grafik = await grafik(page);
      const på = await heap(page, cdp);
      await page.evaluate(() => { location.hash = ''; });
      await page.waitForTimeout(3000);
      const efter = await heap(page, cdp);
      const grafikEfter = await grafik(page);
      Object.assign(r, { heapFørMB: før / 1048576, heapPåMB: på / 1048576, heapEfterMB: efter / 1048576, efter: { geometrier: grafikEfter?.geometrier, teksturer: grafikEfter?.teksturer } });
    }
    resultater.push(r);
    console.error(enhed, id, JSON.stringify({ sek: r.sek, MB: (r.hentet.ialt / 1048576).toFixed(1), kald: r.grafik?.kald }));
    await ctx.close();
  }
}
await b.close();
writeFileSync(JSON_STI, JSON.stringify({ dato: new Date().toISOString(), adresse: ADRESSE, resultater }, null, 1));

// Tabellerne i Markdown
const mb = (x) => (x / 1048576).toFixed(1).replace('.', ',');
const tal = (x, d = 0) => (x === null || x === undefined ? '–' : Number(x).toFixed(d).replace('.', ','));
for (const enhed of enheder) {
  console.log(`\n### ${enhed === 'pc' ? 'Pc (1440 × 900)' : 'Tablet (1280 × 800, touch, LAV_KVALITET)'}\n`);
  console.log('| Skærm | Hentet MB (Three/kode/billeder/andet) | Filer | Sek. til alt er hentet | Kald pr. billede | Trekanter / punkter | Geometrier / teksturer | Teksturer i scenen, MB (skøn) | Heap MB før → på → efter | Geometrier / teksturer efter |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of resultater.filter((x) => x.enhed === enhed)) {
    const h = r.hentet;
    const g = r.grafik ?? {};
    const heapTekst = r.id === 'start' ? tal(r.heapMB, 1) : `${tal(r.heapFørMB, 1)} → ${tal(r.heapPåMB, 1)} → ${tal(r.heapEfterMB, 1)}`;
    console.log(`| ${r.tekst} | ${mb(h.ialt)} (${mb(h.three)}/${mb(h.kode)}/${mb(h.billeder)}/${mb(h.andet)}) | ${h.filer} | ${tal(r.sek, 1)} | ${tal(g.kald)} | ${tal(g.trekanter)} / ${tal(g.punkter)} | ${tal(g.geometrier)} / ${tal(g.teksturer)} | ${tal(g.teksturMB, 0)} | ${heapTekst} | ${r.efter ? `${tal(r.efter.geometrier)} / ${tal(r.efter.teksturer)}` : ''} |${r.fejl.length ? ' FEJL: ' + r.fejl.join('; ') : ''}`);
  }
}
