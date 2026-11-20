// Kvantefysik, bænken med dobbeltspalten (PR 1, 20. november 2026, docs/drejebog-kvantefysik.md afsnit 3): teksterne
// holder budgettet, modellen giver mange striber med to sprækker og ingen mørke striber med én sprække eller måler
// (drejebogens "Tjek, der skal passe"), delen åbner fra Atomer i menuen, "Skyd" virker, mens den holdes nede, et tryk på
// en sprække lukker den, måleren blinker ved én sprække, kuglerne lander i to bunker, vandets bølger løber,
// panelerne har ingen rullebjælke, og et skærmskift rydder op.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PANEL, KVANTE_KORT, intensitet, mørktSted, lavFordeling, tilfældig, histogram, toppe, mørkeStriber, kugleForstørrelse, STANDARD } from '../js/data/kvante.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { SKÆRME } from '../js/skaerme.js';
const UD = billedmappe('kvante');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne og modellen (Node) ----------
const sætninger = (s) => (s.match(/[.!?](\s|$)/g) ?? []).length;
const lange = Object.entries(PANEL).filter(([, p]) => sætninger(p.tekst) > 3).map(([k]) => k);
const kort = KVANTE_KORT.filter((id) => !HVORFOR[id]?.svar || sætninger(HVORFOR[id].svar) > 6);
tjek('teksterne: panelerne har højst tre sætninger, de tre "Hvorfor?"-kort findes, de tre nye ord står i Ordbogen, og delen står i Atomer med status prøve',
  !lange.length && !kort.length && ['interferens', 'kvantefysik', 'boelgelaengde'].every((id) => ORDBOG.some((o) => o.id === id))
  && SKÆRME.some((s) => s.id === 'kvante' && s.verden === 'atomer' && s.status === 'prøve'), JSON.stringify({ lange, kort }));

const mønster = (valg, n = 4000) => {
  const f = lavFordeling(valg);
  const r = tilfældig(3);
  const z = Array.from({ length: n }, () => f.træk(r()));
  const h = histogram(z, 60);
  return { z, h, toppe: toppe(h), mørke: mørkeStriber(h) };
};
const to = mønster({ slags: 'elektroner' });
const ring = mørktSted();
const iRing = (m) => m.z.filter((x) => Math.abs(x - ring) < 0.06).length;
const iTop = (m) => m.z.filter((x) => Math.abs(x) < 0.06).length;
const én = mønster({ slags: 'elektroner', sprækker: 'venstre' });
const måler = mønster({ slags: 'elektroner', måler: true });
tjek('modellen: to sprækker giver mindst fem toppe, og ringen får under 15 % af toppen. Én sprække og måler giver ingen mørke striber, og ringen får mange flere',
  to.toppe >= 5 && iRing(to) < 0.15 * iTop(to) && én.mørke === 0 && måler.mørke === 0 && iRing(én) > 4 * iRing(to) && intensitet(ring) < 0.02,
  JSON.stringify({ toppe: to.toppe, ring: iRing(to), top: iTop(to), én: [én.mørke, iRing(én)], måler: måler.mørke }));
const zk = (STANDARD.d / 2) * kugleForstørrelse();
const kugler = mønster({ slags: 'kugler' });
tjek('modellen: kuglerne lander i to bunker bag sprækkerne og ingen i midten',
  kugler.z.filter((x) => Math.abs(x) < 0.3).length === 0 && kugler.z.filter((x) => Math.abs(x - zk) < 0.4).length > 1500 && kugler.z.filter((x) => Math.abs(x + zk) < 0.4).length > 1500);

// ---------- I browseren ----------
const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, x) => page.evaluate(f, x);

await page.goto(`${ADRESSE}/?test#`);
await page.waitForFunction(() => atomlabTest.aktiv?.() === 'menu', null, { timeout: 20000, polling: 100 });
const link = await T(() => Boolean(document.querySelector('.verden[data-verden="atomer"] a.verden-knap[href="#kvante"]')));
// Er Atomer ikke forrest i ringen, drejer det første tryk den frem, og det næste åbner delen
for (let i = 0; i < 4 && (await T(() => location.hash)) !== '#kvante'; i++) {
  await T(() => document.querySelector('a[href="#kvante"]').click());
  await page.waitForTimeout(1500);
}
await page.waitForFunction(() => atomlabTest.aktiv() === 'kvante' && atomlabTest.kvante?.synlig(), null, { timeout: 20000, polling: 100 });
tjek('delen er en knap i Atomers kort i menuen og åbner derfra', link);

// To sprækker: striber, og ringen ved det første mørke sted får næsten ingen
const r1 = await T((z) => {
  const k = atomlabTest.kvante;
  k.skyd(3000);
  return { m: k.mønster(), ring: k.tæl(z, 0.06), top: k.tæl(0, 0.06), tæller: k.tæller(), panel: k.panel() };
}, ring);
await page.waitForTimeout(800);
await page.screenshot({ path: `${UD}/1-striber.png` });
// Én sprække: bagvæggen ryddes, og mønstret er én bred bunke
const r2 = await T((z) => {
  const k = atomlabTest.kvante;
  k.sprækker('venstre');
  const ryddet = k.antal();
  k.skyd(3000);
  return { ryddet, m: k.mønster(), ring: k.tæl(z, 0.06), panel: k.panel(), lukket: k.lukket() };
}, ring);
tjek('elektroner: to sprækker giver striber (mindst fem toppe, under 15 % i ringen), én sprække rydder væggen og giver én bred bunke med mange flere i ringen',
  r1.m.toppe >= 5 && r1.ring < 0.15 * r1.top && r1.tæller === 'Elektroner: 3.000' && r1.panel.titel === 'Elektroner'
  && r2.ryddet === 0 && r2.m.mørke === 0 && r2.ring > 4 * r1.ring && r2.panel.titel === PANEL['elektroner-en'].titel && r2.lukket.join() === '0,1',
  JSON.stringify({ r1: { toppe: r1.m.toppe, ring: r1.ring, top: r1.top, t: r1.tæller }, r2: { m: r2.m.mørke, ring: r2.ring, l: r2.lukket } }));

// Måleren: begge sprækker åbne, en lampe blinker ved hver elektron, og de mørke striber er væk
const r3 = await T(() => {
  const k = atomlabTest.kvante;
  k.sprækker('begge');
  k.måler(true);
  k.skyd(1);
  const lamper = k.lamper();
  k.skyd(2999);
  return { lamper, m: k.mønster(), panel: k.panel() };
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${UD}/2-maaler.png` });
tjek('måleren: præcis én lampe blinker for en elektron, og med måler er der ingen mørke striber',
  r3.lamper.filter((x) => x > 0.5).length === 1 && r3.m.mørke === 0 && r3.panel.titel === PANEL['elektroner-måler'].titel, JSON.stringify({ l: r3.lamper, m: r3.m.mørke }));

// "Skyd" holdes nede: flere og flere, og det stopper, når knappen slippes
await T(() => { atomlabTest.kvante.måler(false); atomlabTest.kvante.forfra(); });
const knap = await page.locator('#kvSkyd').boundingBox();
await page.mouse.move(knap.x + knap.width / 2, knap.y + knap.height / 2);
await page.mouse.down();
const hold = await T(() => {
  const k = atomlabTest.kvante;
  k.spol(1);
  const ét = k.antal();
  k.spol(3);
  return { ét, fire: k.antal(), holder: k.holder() };
});
await page.mouse.up();
const efter = await T(() => { atomlabTest.kvante.spol(1); return { holder: atomlabTest.kvante.holder(), antal: atomlabTest.kvante.antal() }; });
tjek('"Skyd" virker, mens den holdes nede, det går hurtigere og hurtigere, og det stopper, når den slippes',
  hold.holder && hold.ét >= 2 && hold.fire > 8 * hold.ét && !efter.holder && efter.antal - hold.fire < 60, JSON.stringify({ hold, efter }));

// Et tryk på en sprække i billedet lukker den, og et tryk igen åbner den
await page.waitForTimeout(1500);
const punkt = await T(() => atomlabTest.kvante.sprækkePunkt(1));
await page.mouse.click(punkt.x, punkt.y);
const lukket = await T(() => atomlabTest.kvante.valg().sprækker);
await page.mouse.click(punkt.x, punkt.y);
const åben = await T(() => atomlabTest.kvante.valg().sprækker);
tjek('et tryk på den højre sprække i billedet lukker den, og et tryk igen åbner den', lukket === 'venstre' && åben === 'begge', JSON.stringify({ lukket, åben }));

// Kuglerne flyver og lander i to bunker, og vandets bølger løber ud fra kilden
const kug = await T((zk) => {
  const k = atomlabTest.kvante;
  k.slags('kugler');
  k.skyd(400);
  const z = k.mønster(100);
  return { midt: k.tæl(0, 0.3), højre: k.tæl(zk, 0.4), venstre: k.tæl(-zk, 0.4), antal: k.antal(), panel: k.panel().titel };
}, zk);
await T(() => atomlabTest.kvante.forfra());
await page.locator('#kvSkyd').click();
const flyver = await T(() => { atomlabTest.kvante.spol(0.2); return atomlabTest.kvante.iLuften(); });
await T(() => { atomlabTest.kvante.slags('boelger'); });
await page.click('#kvSkyd');
const vand = await T(() => { atomlabTest.kvante.spol(4); return atomlabTest.kvante.vand(); });
await page.waitForTimeout(800);
await page.screenshot({ path: `${UD}/3-vand.png` });
tjek('kuglerne flyver og lander i to bunker (ingen i midten), og "Start bølgerne" sender vandets bølger ud fra kilden',
  kug.midt === 0 && kug.højre > 100 && kug.venstre > 100 && kug.panel === 'Kugler' && flyver >= 1 && vand.tændt && vand.front > 4, JSON.stringify({ kug, flyver, vand }));

// Ingen rullebjælke i panelerne
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const s of ['elektroner', 'boelger']) {
    await T((x) => atomlabTest.kvante.slags(x), s);
    await page.waitForTimeout(500);
    const p = await T(() => [...document.querySelectorAll('#kvante .side-panel')].map((e) => ({ mere: e.classList.contains('mere'), rul: e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible' })));
    rul.push({ w, s, p });
  }
}
tjek('ingen rullebjælke i panelerne (uden klassen "mere") ved 1150, 820 og 560 px', rul.every((x) => x.p.every((p) => p.mere || !p.rul)), JSON.stringify(rul));

// Et skærmskift rydder op
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000, polling: 100 });
const ryddet = await T(() => ({ synlig: atomlabTest.kvante.synlig(), opdateres: atomlabTest.kvante.opdateres(), holder: atomlabTest.kvante.holder() }));
tjek('et skærmskift rydder op (bænken skjult og ikke opdateret)', !ryddet.synlig && !ryddet.opdateres && !ryddet.holder, JSON.stringify(ryddet));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
