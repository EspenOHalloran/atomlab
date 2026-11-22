// Kvantefysik, bænken med dobbeltspalten (PR 1, 20. november 2026, docs/drejebog-kvantefysik.md afsnit 3): teksterne
// holder budgettet, modellen giver mange striber med to sprækker og ingen mørke striber med én sprække eller måler
// (drejebogens "Tjek, der skal passe"), delen åbner fra Atomer i menuen, "Skyd" virker, mens den holdes nede, et tryk på
// en sprække lukker den, måleren blinker ved én sprække, kuglerne lander i to bunker, vandets bølger løber,
// panelerne har ingen rullebjælke, og et skærmskift rydder op.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PANEL, KVANTE_KORT, intensitet, mørktSted, lavFordeling, tilfældig, histogram, toppe, mørkeStriber, kugleForstørrelse, STANDARD, SLAGS, SPRÆKKER, panelNøgle, bølgelængde, PRIKKER, pulsTid, målerTekst } from '../js/data/kvante.js';
import { LINKS } from '../js/data/ordbogliste.js';
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
tjek('teksterne: panelerne har højst tre sætninger, de fire "Hvorfor?"-kort findes (højst seks sætninger), de tre nye ord står i Ordbogen, og delen står i Atomer med status prøve',
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

// "Større …" (PR 3): molekylet og klumpen giver striber, der ligger tættere end elektronernes, fodbolden to bunker som
// kuglerne, og hver kombination af slags, sprækker og måler har en tekst i panelet
const molekyle = mønster({ slags: 'molekyle' });
const klump = mønster({ slags: 'klump' });
const fodbold = mønster({ slags: 'fodbold' });
const nøgler = SLAGS.flatMap((slags) => SPRÆKKER.flatMap((sprækker) => [false, true].map((m) => panelNøgle({ slags, sprækker, måler: m }))));
tjek('Større …: molekylet og klumpen giver striber (klumpens tættest), fodbolden lander i to bunker uden striber, og alle valg har en tekst og et navn',
  molekyle.toppe >= 5 && molekyle.mørke > 0 && klump.toppe >= 5 && klump.mørke > 0
  && bølgelængde('klump') < bølgelængde('molekyle') && bølgelængde('molekyle') < bølgelængde('elektroner')
  && fodbold.z.filter((x) => Math.abs(x) < 0.3).length === 0 && fodbold.z.filter((x) => Math.abs(x - zk) < 0.4).length > 1500 && fodbold.mørke === 0
  && nøgler.every((n) => PANEL[n]?.titel && PANEL[n]?.tekst) && SLAGS.filter((x) => x !== 'boelger').every((x) => PRIKKER[x])
  && /januar 2026/.test(PANEL.klump.tekst) && /7\.000/.test(PANEL.klump.tekst) && /2\.000/.test(PANEL.molekyle.tekst) && /to bunker/.test(PANEL.fodbold.tekst),
  JSON.stringify({ molekyle: [molekyle.toppe, molekyle.mørke], klump: [klump.toppe, klump.mørke], fodbold: fodbold.toppe, mangler: nøgler.filter((n) => !PANEL[n]) }));
tjek('links: "Er elektronerne virkelig små kugler?" har "Se det selv", og fotonen i Ordbogen går til bænken med lys',
  /Se det selv/.test(HVORFOR.orbitaler.link?.tekst ?? '') && typeof HVORFOR.orbitaler.link?.handling === 'function' && LINKS.foton?.gaa?.[0] === 'kvante:lys');

// "Er elektronen to steder på én gang?" (22. november 2026, docs/plan-kvante-to-steder.md): kortet står først (højst
// fire spørgsmål), siger "ingen har nogensinde fundet" og "superposition", går videre til "Ved elektronen, at vi kigger?"
// og til Gåden. Ordet superposition står i Ordbogen og peger på kortet. Bølgepakken når midten før kanten, og med én
// sprække er vejen kortest bag den. Tælleren tæller aldrig begge.
const ts = HVORFOR.kvanteToSteder;
tjek('to steder: kortet står først i panelet (fire i alt), siger "ingen har nogensinde fundet" og "superposition", fortsætter til kvanteKigger og Gåden, og ordet superposition peger på det',
  KVANTE_KORT.length === 4 && KVANTE_KORT[0] === 'kvanteToSteder' && /ingen har nogensinde fundet/.test(ts.svar) && /superposition/.test(ts.svar)
  && /1986/.test(ts.svar) && /2012/.test(ts.nørd) && /54 cm/.test(ts.nørd) && /ikke.*beviser/.test(ts.nørd) && /1935/.test(ts.nørd)
  && ts.næste === 'kvanteKigger' && typeof ts.link?.handling === 'function'
  && ORDBOG.some((o) => o.id === 'superposition' && /én af mulighederne/.test(o.tekst)) && LINKS.superposition?.hvorfor === 'kvanteToSteder',
  JSON.stringify({ kort: KVANTE_KORT }));
const tMidt = pulsTid(0), tKant = pulsTid(2.5), tVenstre = pulsTid(-0.5, { sprækker: 'venstre' }), tHøjre = pulsTid(-0.5, { sprækker: 'højre' });
tjek('bølgepakken: når midten af bagvæggen på ca. 1,5 s og kanten senere, og med kun den venstre åben når den først bag den venstre; tælleren siger "Begge på én gang: 0"',
  tMidt > 1.3 && tMidt < 1.8 && tKant > tMidt && tVenstre < tHøjre && målerTekst([1234, 5]).linje === 'Venstre: 1.234 · Højre: 5' && målerTekst([1, 1]).begge === 'Begge på én gang: 0',
  JSON.stringify({ tMidt, tKant, tVenstre, tHøjre }));

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
  k.spol(0.05);
  return { lamper, m: k.mønster(), panel: k.panel(), målt: k.målt() };
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${UD}/2-maaler.png` });
tjek('måleren: præcis én lampe blinker for en elektron, tælleren over væggen har alle 3.000 ved én sprække ("Begge på én gang: 0"), og med måler er der ingen mørke striber',
  r3.lamper.filter((x) => x > 0.5).length === 1 && r3.m.mørke === 0 && r3.panel.titel === PANEL['elektroner-måler'].titel
  && r3.målt.tal[0] + r3.målt.tal[1] === 3000 && Math.min(...r3.målt.tal) > 1300 && /Venstre: [\d.]+ · Højre: [\d.]+Begge på én gang: 0/.test(r3.målt.tekst),
  JSON.stringify({ l: r3.lamper, m: r3.m.mørke, målt: r3.målt }));

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

// "Vis bølgen": Slået til skyder den én elektron, hvis bølgepakke går gennem begge sprækker, og prikken lander først, når
// pakken når frem. "Skyd én" to gange: Den anden venter, til pakken foran er forbi. Med måler er der ingen bølge.
const udenMåler = await T(() => atomlabTest.kvante.målt().tekst);
await T(() => { atomlabTest.kvante.forfra(); document.querySelector('#kvante .kv-mere').open = true; });
await page.click('#kvBølgen');
const b1 = await T(() => {
  const k = atomlabTest.kvante;
  const før = k.puls();
  k.spol(0.6);
  const midt = { n: k.antal(), puls: k.puls() };
  k.spol(1.6);
  return { før, midt, efter: k.antal(), bølgen: k.valg().bølgen };
});
const b2 = await T(() => {
  const k = atomlabTest.kvante;
  k.spol(2.5);
  k.skydÉn();
  k.skydÉn();
  const kø = k.puls();
  k.spol(6);
  return { kø, n: k.antal(), serie: k.puls().serie };
});
const b3 = await T(() => {
  const k = atomlabTest.kvante;
  k.måler(true);
  return { bølgen: k.valg().bølgen, slået: document.querySelector('#kvBølgen').disabled, puls: k.puls().påVej };
});
await T(() => { atomlabTest.kvante.måler(false); atomlabTest.kvante.forfra(); });
tjek('"Vis bølgen" skyder én elektron, hvis pakke er på vej, og prikken lander først, når pakken når frem; "Skyd én" to gange venter på pakken foran; med måler er bølgen slået fra; uden måler er tælleren væk',
  !udenMåler && b1.bølgen && b1.før.kører && b1.før.påVej === 1 && b1.midt.n === 0 && b1.midt.puls.front > 2 && b1.efter === 1
  && b2.kø.serie === 1 && b2.kø.påVej === 1 && b2.n === 3 && b2.serie === 0 && !b3.bølgen && b3.slået,
  JSON.stringify({ udenMåler, b1, b2, b3 }));

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

// "Større …": knappen viser de tre valg, klumpen giver striber, fodbolden to bunker, og knappen husker det sidste valg
await T(() => atomlabTest.kvante.slags('elektroner'));
await page.click('#kvStørre');
const stor1 = await T(() => ({ ...atomlabTest.kvante.større(), slags: atomlabTest.kvante.valg().slags, titel: atomlabTest.kvante.panel().titel }));
await page.click('#kvStørreValg [data-kv-slags="klump"]');
const klumpen = await T(() => {
  const k = atomlabTest.kvante;
  k.skyd(3000);
  const m = k.mønster(60);
  k.måler(true);
  k.skyd(3000);
  const mm = k.mønster(60);
  return { toppe: m.toppe, mørke: m.mørke, målerMørke: mm.mørke, tæller: k.tæller(), titel: k.panel().titel };
});
await page.click('#kvStørreValg [data-kv-slags="fodbold"]');
const bolden = await T((zk) => {
  const k = atomlabTest.kvante;
  k.skyd(400);
  return { midt: k.tæl(0, 0.3), højre: k.tæl(zk, 0.4), venstre: k.tæl(-zk, 0.4), titel: k.panel().titel, bold: k.større().bold, måler: document.querySelector('#kvMåler').disabled };
}, zk);
await page.click('#kvStørreValg [data-kv-slags="fodbold"]');
await page.waitForTimeout(300);
await page.screenshot({ path: `${UD}/5-fodbold.png` });
await page.click('[data-kv-slags="elektroner"]');
const væk = await T(() => atomlabTest.kvante.større());
await page.click('#kvStørre');
const husket = await T(() => atomlabTest.kvante.valg().slags);
tjek('Større …: knappen viser Molekyle, Klump og Fodbold (molekylet først), klumpen giver striber, og måleren fjerner dem',
  stor1.knap && stor1.valg && stor1.slags === 'molekyle' && stor1.titel === 'Molekyler med 2.000 atomer'
  && klumpen.toppe >= 5 && klumpen.mørke > 0 && klumpen.målerMørke === 0 && /^Klumper: /.test(klumpen.tæller), JSON.stringify({ stor1, klumpen }));
tjek('Større …: fodbolden lander i to bunker som kuglerne (ingen i midten) og ligner en fodbold, uden måler, og knappen husker det sidste valg',
  bolden.midt === 0 && bolden.højre > 100 && bolden.venstre > 100 && bolden.titel === 'En fodbold' && bolden.bold && bolden.måler
  && !væk.knap && !væk.valg && !væk.bold && husket === 'fodbold', JSON.stringify({ bolden, væk, husket }));

// Links til bænken: data-gaa="kvante:stor" (gåden "Hvor stopper kvanteverdenen?"), fotonen i Ordbogen og "Se det selv"
// under "Er elektronerne virkelig små kugler?" (starter turen)
const tilKvante = () => page.waitForFunction(() => atomlabTest.aktiv() === 'kvante' && atomlabTest.kvante?.synlig(), null, { timeout: 20000, polling: 100 });
await T(() => { location.hash = '#ordbog'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'ordbog' && document.querySelector('#ord-foton [data-gaa]'), null, { timeout: 20000, polling: 100 });
await T(() => document.querySelector('#ord-foton [data-gaa]').click());
await tilKvante();
const fraOrdbog = await T(() => ({ slags: atomlabTest.kvante.valg().slags, tur: atomlabTest.kvante.tur().kører }));
await T(() => { const k = document.createElement('button'); k.dataset.gaa = 'kvante:stor'; k.id = 'prøveLink'; document.body.append(k); k.click(); k.remove(); });
const herStor = await T(() => atomlabTest.kvante.valg().slags);
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000, polling: 100 });
await T(() => import('/js/data/hvorfor.js').then((m) => m.HVORFOR.orbitaler.link.handling()));
await tilKvante();
const turStart = await page.waitForFunction(() => atomlabTest.kvante.tur().kører === 'striber', null, { timeout: 10000, polling: 100 }).then(() => true, () => false);
await T(() => { const k = document.createElement('button'); k.dataset.gaa = 'kvante:stor'; document.body.append(k); k.click(); k.remove(); });
const fraTur = await T(() => ({ slags: atomlabTest.kvante.valg().slags, tur: atomlabTest.kvante.tur().kører }));
tjek('links: fotonen i Ordbogen åbner bænken med lys (uden turen), "kvante:stor" vælger "Større …", og "Se det selv" i Værkstedets kort starter turen',
  fraOrdbog.slags === 'lys' && !fraOrdbog.tur && herStor === 'fodbold' && turStart && fraTur.slags === 'fodbold' && !fraTur.tur, JSON.stringify({ fraOrdbog, herStor, turStart, fraTur }));

// Ingen rullebjælke i panelerne
const rul = [];
for (const [w, h] of [[1150, 800], [820, 1180], [560, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const s of ['elektroner', 'boelger', 'molekyle']) {
    await T((x) => { atomlabTest.kvante.slags(x); for (const e of document.querySelectorAll('#kvante .side-panel')) e.scrollTop = 0; }, s);
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
