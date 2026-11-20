// Kvantefysik, turen "Prikker bliver til striber" (PR 2, drejebogen i docs/drejebog-kvantefysik.md afsnit 3 med
// rettelserne i docs/fable/E7-kvantefysik-noter.md afsnit 3): teksterne holder budgettet (højst to sætninger), turen
// starter af sig selv første gang, trin 1 (kuglerne i to bunker, "Skyd" holdes nede i linjen), trin 2 (vandets bølger når
// bagvæggen), trin 3 (1.000 elektroner giver striber), trin 4 (ringen med "Her: n" ved det mørke sted, en sprække lukkes
// med et tryk, og programmet skyder lige så mange igen, så der kommer mange flere), trin 5 (begge åbne igen, måleren
// tændes, og de mørke striber er væk), "Det så du" med tre veje (fotonen i Ordbogen), ✓ som taget, "Næste ›" før
// handlingen fører hvert trin til Så, og et skærmskift rydder op.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { STRIBER } from '../js/data/forloeb/kvante.js';
import { FORLØB } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { mørktSted, RING_HALV } from '../js/data/kvante.js';
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne (Node) ----------
const sætninger = (s) => (s ?? '').match(/[.!?](\s|$)/g)?.length ?? 0;
const instrukser = STRIBER.trin.flatMap((t) => (t.gæt?.valg ?? [{ efter: '' }]).map((v) => `${v.efter} ${t.gør}`));
const lange = [...STRIBER.trin.flatMap((t) => [t.spørg, t.så, t.gør, ...(t.gæt?.valg ?? []).map((v) => v.svar)]), ...instrukser].filter((x) => sætninger(x) > 2);
const ider = new Set(ORDBOG.map((o) => o.id));
const mangler = STRIBER.trin.flatMap((t) => t.ord ?? []).filter((id) => !ider.has(id));
const så5 = STRIBER.trin[4].så;
tjek('teksterne: 5 trin og "Det så du", højst to sætninger i hver tekst (også gættets "efter" med instruksen), ordene står i Ordbogen, trin 5 siger "de mørke striber er væk" og ikke "som kuglerne", og vejenes kort og ord findes',
  STRIBER.trin.length === 5 && !lange.length && !mangler.length && /mørke striber væk/.test(så5) && !/kugle/i.test(så5)
  && sætninger(STRIBER.kernesætning) === 2 && FORLØB.includes(STRIBER) && HVORFOR.kvanteKigger?.svar && ider.has('foton'),
  JSON.stringify({ lange, mangler }));

// ---------- I browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);
const fase = (f) => page.waitForFunction((x) => atomlabTest.kvante.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const spol = (sek) => T((x) => atomlabTest.kvante.spol(x), sek);
const næste = () => page.click('#kvante .fl-næste');
const trin = (id) => page.waitForFunction((x) => atomlabTest.kvante.tur().trin === x, id, { timeout: 10000, polling: 100 });
// "Skyd" i turens linje holdes nede med musen, mens spillets tid spoles frem
async function holdSkyd(sek) {
  const r = await page.locator('#kvante .fl-handling[data-knap="skyd"]').boundingBox();
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  await page.mouse.down();
  await spol(sek);
  const holdt = await T(() => atomlabTest.kvante.holder());
  await page.mouse.up();
  return holdt;
}

await page.goto(`${ADRESSE}/?test&forloebstart#kvante`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.kvante?.forløb.kører() === 'striber', null, { timeout: 20000, polling: 100 });
const start = await T(() => ({
  paneler: [...document.querySelectorAll('#kvante .side-panel')].every((e) => getComputedStyle(e).display === 'none'),
  tur: Boolean(document.querySelector('#kvante .tur-knap')),
  trin: atomlabTest.kvante.tur().trin,
  slags: atomlabTest.kvante.valg().slags,
}));
tjek('turen starter af sig selv første gang uden panelerne, med "↻ Tur" i toplinjen og kuglerne i trin 1', start.paneler && start.tur && start.trin === 'kugler' && start.slags === 'kugler', JSON.stringify(start));

// Trin 1: "Skyd" holdes nede, til 40 kugler har ramt, og de lander i to bunker
await page.click('#kvante .fl-gæt >> nth=0');
const holdt1 = await holdSkyd(7);
await spol(2);
await fase('så');
const kug = await T(() => ({ n: atomlabTest.kvante.antal(), midt: atomlabTest.kvante.tæl(0, 0.3), holder: atomlabTest.kvante.holder(), linje: document.querySelector('#kvante .forløb-linje').textContent }));
tjek('trin 1: "Skyd" i linjen virker, mens den holdes nede, 40 kugler rammer i to bunker (ingen i midten), og slippet stopper skuddene',
  holdt1 && kug.n >= 40 && kug.midt === 0 && !kug.holder && /én bag hver sprække/.test(kug.linje), JSON.stringify({ holdt1, ...kug }));

// Trin 2: bølgerne starter med knappen og når bagvæggen
await næste();
await trin('boelger');
await page.click('#kvante .fl-handling[data-knap="boelger"]');
await spol(7);
await fase('så');
const vand = await T(() => ({ ...atomlabTest.kvante.vand(), linje: document.querySelector('#kvante .forløb-linje').innerHTML }));
tjek('trin 2: "Start bølgerne" sender vandets bølger helt til bagvæggen, og Så har ordet interferens', vand.tændt && vand.front > 8 && /data-ord="interferens"/.test(vand.linje), JSON.stringify({ tændt: vand.tændt, front: vand.front }));

// Trin 3: 1.000 elektroner giver mange striber
await næste();
await trin('elektroner');
await page.click('#kvante .fl-gæt >> nth=1');
await holdSkyd(7);
await spol(0.5);
await fase('så');
const m3 = await T(() => ({ n: atomlabTest.kvante.antal(), m: atomlabTest.kvante.mønster() }));
tjek('trin 3: Efter ca. 1.000 elektroner, holdt nede, står der mindst fem striber', m3.n >= 1000 && m3.m.toppe >= 5, JSON.stringify({ n: m3.n, toppe: m3.m.toppe }));

// Trin 4: ringen ved det mørke sted, et tryk på en sprække lukker den, og programmet skyder lige så mange igen
await næste();
await trin('luk');
await page.waitForTimeout(300);
const r4 = await T((h) => ({ tur: atomlabTest.kvante.tur(), top: atomlabTest.kvante.tæl(0, h), her: atomlabTest.kvante.herTekst() }), RING_HALV);
await page.click('#kvante .fl-gæt >> nth=1');
const p = await T(() => atomlabTest.kvante.sprækkePunkt(0));
await page.mouse.click(p.x, p.y);
let lukket = await T(() => atomlabTest.kvante.valg().sprækker);
if (lukket === 'begge') { await page.waitForTimeout(300); await page.mouse.click(p.x, p.y); lukket = await T(() => atomlabTest.kvante.valg().sprækker); }
await spol(5);
await fase('så');
const e4 = await T(() => ({ tur: atomlabTest.kvante.tur(), n: atomlabTest.kvante.antal(), her: atomlabTest.kvante.herTekst(), igen: atomlabTest.kvante.trykSprække(0) }));
tjek('trin 4: ringen står ved det mørke sted med "Her: n" og under 15 % af toppen, et tryk lukker en sprække, programmet skyder lige så mange igen, og nu lander mange flere i ringen (sprækken kan ikke åbnes igen i trinet)',
  r4.tur.vist && Math.abs(r4.tur.ring - mørktSted()) < 1e-9 && /^Her: \d+$/.test(r4.her) && r4.tur.her < 0.15 * r4.top
  && lukket === 'højre' && e4.n >= 1000 && e4.tur.før === r4.tur.her && e4.tur.her >= 4 * Math.max(1, e4.tur.før) && /før:/.test(e4.her) && e4.igen === undefined,
  JSON.stringify({ r4, lukket, e4 }));

// Trin 5: begge åbner igen, måleren tændes, og de mørke striber er væk
await næste();
await trin('maaler');
const f5 = await T(() => ({ sprækker: atomlabTest.kvante.valg().sprækker, ring: atomlabTest.kvante.tur().vist, her: atomlabTest.kvante.herTekst() }));
await page.click('#kvante .fl-gæt >> nth=0');
await page.click('#kvante .fl-handling[data-knap="maaler"]');
const lamper = await T(() => { const a = atomlabTest.kvante; let blink = 0; for (let i = 0; i < 40; i++) { a.spol(0.05); if (a.lamper().some((l) => l > 0.5)) blink++; } return blink; });
await spol(8);
await fase('så');
const m5 = await T(() => ({ v: atomlabTest.kvante.valg(), n: atomlabTest.kvante.antal(), m: atomlabTest.kvante.mønster(), linje: document.querySelector('#kvante .forløb-linje').textContent }));
tjek('trin 5: begge sprækker åbner af sig selv (ringen er væk), måleren tændes og blinker, og efter 1.000 elektroner er de mørke striber væk',
  f5.sprækker === 'begge' && !f5.ring && !f5.her && m5.v.måler && lamper > 0 && m5.n >= 1000 && m5.m.mørke === 0 && /de mørke striber væk/.test(m5.linje),
  JSON.stringify({ f5, lamper, n: m5.n, mørke: m5.m.mørke }));

// "Det så du" og vejen til fotonen i Ordbogen
await næste();
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('#kvante .forløb-linje').textContent, veje: [...document.querySelectorAll('#kvante .fl-vej')].map((e) => e.textContent) }));
await page.click('#kvante .fl-vej >> nth=1');
await page.waitForFunction(() => atomlabTest.aktiv() === 'ordbog', null, { timeout: 20000, polling: 100 });
await page.waitForFunction(() => document.getElementById('ord-foton')?.classList.contains('fremhævet'), null, { timeout: 5000, polling: 100 }).catch(() => {});
const ordbog = await T(async () => ({ foton: document.getElementById('ord-foton')?.classList.contains('fremhævet'), taget: (await import('./js/fremgang.js')).forløbTaget('striber') }));
tjek('"Det så du" har kernesætningen, Hitachi i 1989 og tre veje, vejen "Er lys en bølge …" åbner fotonen i Ordbogen, og turen er husket som taget',
  slut.tekst.includes('forsvinder striberne') && /1989/.test(slut.tekst) && slut.veje.length === 3 && /Leg frit/.test(slut.veje[0]) && ordbog.foton && ordbog.taget,
  JSON.stringify({ slut, ordbog }));

// "Næste ›" før handlingen fører hvert trin til Så
await T(() => { location.hash = '#kvante'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'kvante', null, { timeout: 20000, polling: 100 });
await T(() => atomlabTest.kvante.startTur());
const vist = [];
for (let i = 0; i < 5; i++) {
  await page.waitForFunction(() => ['gæt', 'gør'].includes(atomlabTest.kvante.forløb.fase()), null, { timeout: 10000, polling: 100 });
  await T(() => atomlabTest.kvante.forløb.visMigNu());
  for (let t = 0; t < 30 && (await T(() => atomlabTest.kvante.forløb.fase())) !== 'så'; t++) {
    await spol(0.5);
    await page.waitForTimeout(150);
  }
  vist.push(await T(() => atomlabTest.kvante.forløb.fase()));
  if (i < 4) await næste();
}
tjek('"Næste ›" før handlingen fører hvert af de fem trin helt til Så', vist.every((x) => x === 'så'), JSON.stringify(vist));

// Et skærmskift midt i turen rydder op
await T(() => atomlabTest.kvante.startTur());
await page.waitForFunction(() => atomlabTest.kvante.forløb.kører() === 'striber', null, { timeout: 10000, polling: 100 });
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000, polling: 100 });
const ryddet = await T(() => ({ tur: atomlabTest.kvante.tur(), synlig: atomlabTest.kvante.synlig(), opdateres: atomlabTest.kvante.opdateres(), linje: document.querySelectorAll('.forløb-linje').length }));
tjek('et skærmskift midt i turen rydder op (ingen linje, intet trin, ingen ring, bænken skjult og ikke opdateret)',
  !ryddet.tur.kører && !ryddet.tur.trin && !ryddet.tur.vist && !ryddet.tur.kø && !ryddet.synlig && !ryddet.opdateres && !ryddet.linje, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
