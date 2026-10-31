// Formørkelser (Kosmos): skyggens geometri (js/data/skygge.js) med rigtige tal, og fænomenet i browseren
// (trinene, himlen set fra Jorden, skyderne i "Prøv selv" og telefon)
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { overlap, dækket, påHimlen } from '../js/data/skygge.js';
const UD = billedmappe('formoerkelser');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: geometrien ----------
const nær = (a, b, tol = 1e-9) => Math.abs(a - b) < tol;
tjek('to ens cirkler oven på hinanden overlapper helt', nær(overlap(1, 1, 0), Math.PI));
tjek('cirkler, der lige rører hinanden, overlapper ikke', overlap(1, 1, 2) === 0);
tjek('en lille cirkel inden i en stor', nær(overlap(1, 0.5, 0.2), Math.PI * 0.25));
tjek('to cirkler med afstanden 1: 2π/3 - √3/2', nær(overlap(1, 1, 1), (2 * Math.PI) / 3 - Math.sqrt(3) / 2));
// Rigtige tal (km): Solen 149,6 mio. km væk med radius 696.000 km, Månen 1.737 km og Jorden 6.371 km
const SOL = [-149.6e6, 0, 0], SOL_R = 696000, MÅNE_R = 1737.4, JORD_R = 6371;
const fraJorden = (afstand) => {
  const p = [-JORD_R, 0, 0], m = [-afstand, 0, 0]; // under Månen på Jordens overflade
  return { d: dækket(p, SOL, SOL_R, m, MÅNE_R), h: påHimlen(p, SOL, SOL_R, m, MÅNE_R) };
};
const tæt = fraJorden(363300), langt = fraJorden(405500);
tjek('Månen tæt på (363.300 km) ser større ud end Solen: total', tæt.d > 0.999 && tæt.h.kugle > tæt.h.sol);
tjek(`Månen langt væk (405.500 km) dækker ${Math.round(langt.d * 100)} %: ring`, langt.d > 0.85 && langt.d < 0.9 && langt.h.kugle < langt.h.sol, langt.d);
tjek('Solen og Månen er ca. en halv grad på himlen', [tæt.h.sol, tæt.h.kugle].every((v) => Math.abs((2 * v) / (Math.PI / 180) - 0.53) < 0.04));
tjek('Månen bag Jorden er helt i Jordens skygge', dækket([384400, 0, 0], SOL, SOL_R, [0, 0, 0], JORD_R) === 1);
tjek('Månen 12° over linjen er ikke i skygge', dækket([384400 * Math.cos(0.21), 384400 * Math.sin(0.21), 0], SOL, SOL_R, [0, 0, 0], JORD_R) === 0);
tjek('en kugle bag punktet kan ikke dække Solen', dækket([0, 0, 0], SOL, SOL_R, [400000, 0, 0], MÅNE_R) === 0);

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const side = async (opsætning) => {
  const page = await (await b.newContext(opsætning)).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#solsystem`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'), null, { timeout: 20000 });
  await page.evaluate(() => atomlabTest.solsystem.vælg('formoerkelser'));
  await page.waitForTimeout(300);
  return page;
};
const page = await side({ viewport: { width: 1280, height: 800 } });
const T = (f, a) => page.evaluate(f, a);
const hvad = () => T(() => document.querySelector('#solsystemForklaring [data-formoerkelse]')?.dataset.formoerkelse);
const panel = () => T(() => document.querySelector('#solsystemForklaring').textContent);
const undertekst = () => T(() => document.querySelector('#solsystemVindue .undertekst')?.textContent ?? '');
const himmelTekst = () => T(() => document.querySelector('#solsystemToplag .himmel-kort span')?.textContent ?? '');
const himmelHvad = () => T(() => document.querySelector('#solsystemToplag .himmel-kort strong')?.textContent ?? '');
// Kameraets afstand til det, det kigger på
const kameraAfstand = () => T(async () => { const { verden } = await import('/js/scene3d.js'); return verden.kamera.position.distanceTo(verden.styring.target); });
const næste = () => T(() => { const k = atomlabTest.solsystem; k.trykPå('Næste'); k.spol(2); });
// Farven midt på himlen og et stykke ude (koronaen)
// (læses fra en kopi, så browseren ikke advarer om mange aflæsninger fra det samme lærred)
const farve = (x, y) => T(([x, y]) => {
  const kopi = document.createElement('canvas');
  kopi.width = kopi.height = 300;
  const g = kopi.getContext('2d');
  g.drawImage(document.querySelector('#solsystemToplag canvas'), 0, 0);
  return [...g.getImageData(x, y, 1, 1).data].slice(0, 3);
}, [x, y]);
// Skyderne i "Prøv selv": 0 = Månens fase (dage), 1 = tid på året (dag), 2 = Månens afstand (km)
const skyder = (i, v) => T(([i, v]) => {
  const s = document.querySelectorAll('#solsystemStyr input[type=range]')[i];
  s.value = v;
  s.dispatchEvent(new Event('input'));
  atomlabTest.solsystem.spol(0.5);
}, [i, v]);

tjek('fænomenet står efter Årstiderne', (await T(() => atomlabTest.solsystem.fænomener)).join(',').includes('aarstider,formoerkelser'));
tjek('første trin: Sol, Jord og Måne', (await undertekst()).includes('Sol, Jord og Måne'), await undertekst());
// Månen kredser mod uret set fra nord, ligesom Jorden drejer (y-delen af r(0) × r(10°) er positiv)
const omløb = await T(async () => {
  const { månePlads } = await import('/js/kosmos/formoerkelser.js');
  const a = månePlads(0, 0, 5, 6), b = månePlads(10, 0, 5, 6);
  return a.z * b.x - a.x * b.z;
});
tjek('Månen kredser den rigtige vej (mod uret set fra nord)', omløb > 0, omløb);
tjek('himlen set fra Jorden står i 3D-billedet', await T(() => Boolean(document.querySelector('#solsystemToplag .himmel-kort canvas'))));
await næste();
tjek('trin 2: total solformørkelse', (await hvad()) === 'total' && (await panel()).includes('total solformørkelse'), await panel());
tjek('himlen viser Solen og skriver resultatet', (await himmelTekst()) === 'Solen set fra Jorden' && (await himmelHvad()) === 'Total solformørkelse!', await himmelHvad());
const midt = await farve(150, 150), korona = await farve(150, 90);
tjek('Månen dækker Solen (mørk midte) og koronaen lyser omkring', Math.max(...midt) < 50 && Math.min(...korona) > 120, `${midt} ${korona}`);
tjek('ordet "kerneskygge" kan trykkes på', await T(() => Boolean(document.querySelector('.fagord[data-ord="kerneskygge"]'))));
await page.screenshot({ path: `${UD}/1-total.png` });
// "Næste" til et trin med samme kamera: Kameraet glider og hopper ikke langt væk først
await T(() => atomlabTest.solsystem.kameraFrem());
const før = await kameraAfstand();
await T(() => atomlabTest.solsystem.trykPå('Næste'));
const lige = await kameraAfstand();
tjek(`kameraet hopper ikke ved "Næste" (${før.toFixed(1)} → ${lige.toFixed(1)})`, Math.abs(lige - før) < 0.2 * før, `${før} ${lige}`);
await T(() => atomlabTest.solsystem.spol(2));
const ring = (await panel()).match(/(\d+) % dækket/)?.[1];
tjek(`trin 3: ringformørkelse (${ring} % dækket)`, (await hvad()) === 'ring' && ring >= 80 && ring <= 95 && (await himmelHvad()) === 'Ringformørkelse!', await panel());
await næste();
tjek('trin 4: total måneformørkelse', (await hvad()) === 'total' && (await panel()).includes('total måneformørkelse'), await panel());
tjek('himlen viser Månen og skriver resultatet', (await himmelTekst()) === 'Månen set fra Jorden' && (await himmelHvad()) === 'Total måneformørkelse!', await himmelHvad());
const rød = await farve(150, 150);
tjek('Månen er kobberrød', rød[0] > 110 && rød[0] > 2 * rød[1] && rød[0] > 2 * rød[2], rød);
await page.screenshot({ path: `${UD}/2-maaneformoerkelse.png` });
await næste();
tjek('trin 5: hvorfor ikke hver måned? Ingen formørkelse, Månen går over eller under', (await hvad()) === 'ingen' && (await panel()).includes('over eller under'), await panel());
const kant = await farve(150, 18);
tjek('himlen viser Månen ude ved kanten over Solen', Math.max(...kant) < 70, kant);
await næste();
tjek('sidste trin: Prøv selv, og bjælken har "↺ Forfra" i stedet for "Næste"', (await undertekst()).includes('Prøv selv') && JSON.stringify(await T(() => atomlabTest.solsystem.bjælke().map((k) => k.tekst))) === JSON.stringify(['‹', '↺ Forfra']));
tjek('tre skydere og kontakten "Uden hældning" i Styr-boksen', (await T(() => document.querySelectorAll('#solsystemStyr input[type=range]').length)) === 3 && (await page.isVisible('#solsystemStyr .kontakt:has-text("Uden hældning")')));

// Prøv selv: nymåne i april (uden for formørkelsesperioden) giver ingen formørkelse, men uden hældning sker det hver måned
await skyder(0, 0);
await skyder(1, 115);
await skyder(2, 384000);
tjek('nymåne i april: ingen formørkelse (også på himlen)', (await hvad()) === 'ingen' && (await himmelHvad()) === 'Ingen formørkelse', await panel());
await page.click('#solsystemStyr .kontakt:has-text("Uden hældning")');
await T(() => atomlabTest.solsystem.spol(0.5));
tjek('uden hældning: ringformørkelse ved middelafstand', (await hvad()) === 'ring', await panel());
await skyder(2, 360000);
tjek('uden hældning og Månen tæt på: total', (await hvad()) === 'total', await panel());
await skyder(0, 14.5);
tjek('uden hældning og fuldmåne: total måneformørkelse', (await hvad()) === 'total' && (await panel()).includes('måneformørkelse'), await panel());
await page.click('#solsystemStyr .kontakt:has-text("Uden hældning")');
await T(() => atomlabTest.solsystem.spol(0.5));
tjek('med hældning igen: ingen formørkelse i april', (await hvad()) === 'ingen', await panel());
// I formørkelsesperioden (sidst i februar) sker det også med hældning, og skyderen siger det
const tidTekst = () => T(() => document.querySelectorAll('#solsystemStyr .skyder-boks strong')[1].textContent);
tjek('april er ikke en formørkelsesperiode', !(await tidTekst()).includes('formørkelsesperiode'), await tidTekst());
await skyder(1, 55);
await skyder(0, 0);
tjek('nymåne sidst i februar: solformørkelse', (await hvad()) === 'total', await panel());
tjek('skyderen siger "formørkelsesperiode" sidst i februar', (await tidTekst()).includes('formørkelsesperiode'), await tidTekst());
await page.screenshot({ path: `${UD}/3-proev-selv.png` });
// Delvis måneformørkelse: Find en dag, hvor fuldmånen kun delvis går ind i Jordens kerneskygge.
// Så er en del af Månen kobberrød og resten grå på himlen.
const delvisDag = await T(() => {
  const [fase, tid] = document.querySelectorAll('#solsystemStyr input[type=range]');
  fase.value = 14.75;
  fase.dispatchEvent(new Event('input'));
  for (let d = 56; d < 120; d++) {
    tid.value = d;
    tid.dispatchEvent(new Event('input'));
    if (document.querySelector('#solsystemForklaring [data-formoerkelse]').dataset.formoerkelse === 'delvis') return d;
  }
  return null;
});
const måneFarver = await T(() => {
  const kopi = document.createElement('canvas');
  kopi.width = kopi.height = 300;
  const g = kopi.getContext('2d');
  g.drawImage(document.querySelector('#solsystemToplag canvas'), 0, 0);
  const data = g.getImageData(0, 0, 300, 300).data; // læses én gang
  let rød = 0, grå = 0;
  for (let y = 75; y <= 225; y += 3) {
    for (let x = 75; x <= 225; x += 3) {
      const i = (y * 300 + x) * 4;
      const [r, gr, b] = [data[i], data[i + 1], data[i + 2]];
      if (r > 100 && r > 2 * gr) rød++;
      else if (r > 150 && Math.abs(r - gr) < 20 && Math.abs(r - b) < 25) grå++;
    }
  }
  return { rød, grå };
});
tjek(`delvis måneformørkelse (dag ${delvisDag}): Månen er delvis kobberrød og delvis grå`, delvisDag && måneFarver.rød > 20 && måneFarver.grå > 20, JSON.stringify(måneFarver));
await page.click('#solsystemBjælke button:has-text("Forfra")');
tjek('Forfra går tilbage til første trin', (await undertekst()).includes('Sol, Jord og Måne'), await undertekst());
tjek('skyderne forsvinder med Forfra', (await T(() => document.querySelectorAll('#solsystemStyr input[type=range]').length)) === 0);
await T(() => atomlabTest.solsystem.vælg('solstorm'));
tjek('himlen forsvinder, når man skifter fænomen', !(await T(() => document.querySelector('#solsystemToplag').children.length)));

// Telefon: en lille udgave af himlen på højkant, ingen på langs (der er ikke plads)
const tlf = await side({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const kortBredde = await tlf.evaluate(() => document.querySelector('#solsystemToplag .himmel-kort')?.getBoundingClientRect().width ?? 0);
tjek(`telefon på højkant: lille himmel (${Math.round(kortBredde)} px bred)`, kortBredde > 60 && kortBredde < 130, kortBredde);
await tlf.screenshot({ path: `${UD}/4-telefon.png` });
const langs = await side({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
tjek('telefon på langs: himlen er skjult', !(await langs.isVisible('#solsystemToplag .himmel-kort')));

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
