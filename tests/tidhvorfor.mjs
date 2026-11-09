// "Hvorfor går tiden langsommere?" (js/kosmos/tidhvorfor.js og det fælles lysur js/kosmos/lysur.js, T5a): farterne
// lægges sammen med Einsteins formel (uden browser), og i Kosmos: fænomenet åbner uden konsolfejl lige efter Rejsen i
// tid, bjælken har fem trin, og "Næste" går fra scene 1 til 2, kontakten Lygte skifter underteksten, 50 % + 50 %
// giver 80 %, trekanten stopper på toppen og viser γ = 2 ved 87 %, lærredet dækker ikke Styr-boksen eller
// underteksten (pc, tablet og telefon på højkant), Rejsen i tids lysur virker stadig, og knappen derfra åbner fænomenet.
import { læggesSammen } from '../js/data/tid.js';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const nær = (a, b, tol) => Math.abs(a - b) <= tol;

// ---------- Regningen (drejebogen, scene 1) ----------
tjek('50 % + 50 % giver 80 %, 50 % + 90 % giver 96,6 %, og lyset (100 %) giver altid 100 %', nær(læggesSammen(0.5, 0.5), 0.8, 1e-12) && nær(læggesSammen(0.5, 0.9), 0.9655, 1e-4) && nær(læggesSammen(1, 0.9), 1, 1e-12));

// ---------- I browseren ----------
const UD = billedmappe('tidhvorfor');
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const E = (f, a) => page.evaluate(f, a);
const sæt = (navn, v) => E(([navn, v]) => {
  const s = [...document.querySelectorAll('#kosmosStyr .skyder-boks')].find((x) => x.querySelector('.skyder-top > span').textContent === navn);
  const i = s.querySelector('input');
  i.value = v;
  i.dispatchEvent(new Event('input'));
}, [navn, v]);
const fase = () => E(() => atomlabTest.kosmos.fase());
// Lærredet må ikke dække Styr-boksen (når den er åben), underteksten eller bjælken
const dækker = () => E(() => {
  const l = document.querySelector('#kosmosOverlag .tidh canvas').getBoundingClientRect();
  const over = (e) => { if (!e || !e.offsetWidth) return false; const r = e.getBoundingClientRect(); return r.bottom > l.top + 1 && r.top < l.bottom - 1 && r.right > l.left + 1 && r.left < l.right - 1; };
  return ['#kosmosStyr', '#kosmosVindue .undertekst', '#kosmosBjælke'].filter((s) => over(document.querySelector(s)));
});

await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForFunction(() => window.atomlabTest?.kosmos);
const ids = await E(() => atomlabTest.kosmos.fænomener);
tjek('"Hvorfor går tiden langsommere?" står lige efter Rejsen i tid', ids[ids.indexOf('tid') + 1] === 'tidhvorfor', ids.join(','));
await E(() => atomlabTest.kosmos.vælg('tidhvorfor'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.scene);
tjek('navnet, ikonet og scene 1', (await page.textContent('#kosmosNavn')) === 'Hvorfor går tiden langsommere?' && (await page.textContent('#kosmosIkon')) === '🔦' && (await E(() => atomlabTest.kosmos.fænomen().scene())) === 0);
let t = await E(() => atomlabTest.kosmos.trin());
let bj = await E(() => atomlabTest.kosmos.bjælke());
tjek('bjælken har fem trin: ‹ (slået fra) og "Næste: Lysuret ›"', t?.ialt === 5 && t.nr === 0 && bj.map((x) => x.tekst).join('|') === '‹|Næste: Lysuret ›' && bj[0].slået, JSON.stringify([t, bj]));
let styr = await E(() => atomlabTest.kosmos.styr());
tjek('scene 1: kontakterne ⚾ Bold (tændt) og 🔦 Lygte og skyderen "Togets fart"', styr.map((s) => `${s.slags}:${s.navn}:${s.til ?? ''}`).join('|') === 'kontakt:⚾ Bold:true|kontakt:🔦 Lygte:false|skyder:Togets fart:', JSON.stringify(styr));
let f = await fase();
tjek('scene 1: underteksten om bolden (150 km/t) under 160 tegn', f?.titel === 'Den mærkelige regel' && /150 km\/t/.test(f.tekst) && f.tekst.length < 160, JSON.stringify(f));
await E(() => atomlabTest.kosmos.trykPå('🔦 Lygte'));
f = await fase();
styr = await E(() => atomlabTest.kosmos.styr());
tjek('kontakten Lygte skifter underteksten (lyset), og Bold slukker', /Togets fart lægges ikke til/.test(f?.tekst) && styr.filter((s) => s.til).map((s) => s.navn).join() === '🔦 Lygte' && !(await E(() => atomlabTest.kosmos.fænomen().scene1().bold)), JSON.stringify(f));
await E(() => atomlabTest.kosmos.trykPå('🔦 Lygte'));
tjek('et tryk på den valgte kontakt slukker den ikke', !(await E(() => atomlabTest.kosmos.fænomen().scene1().bold)));
await E(() => atomlabTest.kosmos.trykPå('⚾ Bold'));
await sæt('Togets fart', 1);
const s1 = await E(() => atomlabTest.kosmos.fænomen().scene1());
f = await fase();
tjek('50 % + 50 %: bolden flyver 80 % af lysets fart (ikke 100 %)', nær(s1.boldFart, 0.8, 1e-9) && /80 % af lysets fart, ikke 100 %/.test(f?.tekst), JSON.stringify([s1, f]));
await E(() => atomlabTest.kosmos.spol(2));
tjek('lærredet dækker ikke Styr-boksen, underteksten eller bjælken (pc)', (await dækker()).length === 0, JSON.stringify(await dækker()));
await page.screenshot({ path: `${UD}/scene1-pc.png` });

// Et tryk på en prik længere fremme går kun til den næste scene
await E(() => document.querySelectorAll('#kosmosVindue .undertekst .ut-trin button')[4]?.click());
tjek('prik 5 går kun til den næste scene (man kan ikke springe frem til en scene, man ikke har set)', (await E(() => atomlabTest.kosmos.fænomen().scene())) === 1);
await E(() => atomlabTest.kosmos.vælg('rumtid'));
await E(() => atomlabTest.kosmos.vælg('tidhvorfor'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.scene);
await E(() => atomlabTest.kosmos.trykPå('Næste: Lysuret'));
t = await E(() => atomlabTest.kosmos.trin());
styr = await E(() => atomlabTest.kosmos.styr());
tjek('"Næste" går fra scene 1 til 2: skyderen "Fart" (87 %) og kontakten "△ Vis trekanten"', t?.nr === 1 && styr.map((s) => `${s.slags}:${s.navn}`).join('|') === 'skyder:Fart|kontakt:△ Vis trekanten' && (await page.textContent('#kosmosStyr .skyder-boks strong')) === '87 %', JSON.stringify([t, styr]));
tjek('scene 2: underteksten om den skrå vej', /længere, skrå vej/.test((await fase())?.tekst));
await E(() => atomlabTest.kosmos.spol(3));
let s2 = await E(() => atomlabTest.kosmos.fænomen().scene2());
tjek('scene 2: uret i skibet tikker 2 gange så tit som set fra Jorden (87 %)', nær(s2.skib / s2.jord, 2, 1e-6) && s2.skib > 1, JSON.stringify(s2));
await E(() => atomlabTest.kosmos.trykPå('△ Vis trekanten'));
await E(() => atomlabTest.kosmos.spol(5));
s2 = await E(() => atomlabTest.kosmos.fænomen().scene2());
f = await fase();
tjek('trekanten stopper, når lyset set fra Jorden er oppe (et halvt tik), og viser γ = 2 og 1,73', s2.stille && nær(s2.jord % 1, 0.5, 1e-9) && nær(s2.tegnet?.gamma, 2, 1e-9) && nær(s2.tegnet?.vand, Math.sqrt(3), 1e-9) && /2 gange så lang som den lige/.test(f?.tekst), JSON.stringify([s2, f]));
const før = s2.jord;
await E(() => atomlabTest.kosmos.spol(2));
tjek('uret står stille, mens trekanten vises', (await E(() => atomlabTest.kosmos.fænomen().scene2())).jord === før);
tjek('lærredet dækker ikke Styr-boksen, underteksten eller bjælken (scene 2, pc)', (await dækker()).length === 0, JSON.stringify(await dækker()));
await page.screenshot({ path: `${UD}/scene2-trekant-pc.png` });
await E(() => atomlabTest.kosmos.trykPå('△ Vis trekanten'));
await E(() => atomlabTest.kosmos.spol(1));
tjek('slukket: uret går videre', (await E(() => atomlabTest.kosmos.fænomen().scene2())).jord > før);

// Tablet og telefon på højkant: lærredet dækker ikke Styr-boksen, underteksten eller bjælken, og scene 2 står over
// hinanden på telefonen (lærredet er højere end bredt)
for (const [navn, w, h] of [['tablet', 820, 1180], ['telefon', 390, 844]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(400);
  await E(() => atomlabTest.kosmos.spol(0.5));
  const l = await E(() => atomlabTest.kosmos.fænomen().lærred());
  tjek(`${navn}: lærredet dækker intet, og scene 2 ${navn === 'telefon' ? 'står over hinanden' : 'står ved siden af hinanden'}`, (await dækker()).length === 0 && (navn === 'telefon' ? l.højde > l.bredde : l.højde < l.bredde), JSON.stringify([l, await dækker()]));
  await page.screenshot({ path: `${UD}/scene2-${navn}.png` });
}
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(300);

// Rejsen i tids lysur virker stadig med det fælles lysur, og knappen derfra åbner det nye fænomen
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.lysur);
await E(() => atomlabTest.kosmos.trykPå('Vis lysuret'));
await E(() => atomlabTest.kosmos.spol(3));
const l = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('Rejsen i tid: lysuret tikker stadig 2 gange så tit i skibet ved 87 %, og billedet følger spejlene', l.vist && nær(l.skib / l.jord, 2, 0.001) && l.forskud > 0 && l.spor >= 3, JSON.stringify(l));
await E(() => atomlabTest.kosmos.trykPå('Tilbage til rejsen'));
const knap = (await E(() => atomlabTest.kosmos.side())).knapper.find((k) => k.tekst.includes('Se det trin for trin'));
tjek('Rejsen i tid: knappen "🔦 Hvorfor? Se det trin for trin" i teksten findes', knap?.findes, JSON.stringify(knap));
await E(() => atomlabTest.kosmos.trykISide('Se det trin for trin'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.scene, null, { timeout: 5000 }).catch(() => {});
tjek('knappen åbner "Hvorfor går tiden langsommere?"', (await page.textContent('#kosmosNavn')) === 'Hvorfor går tiden langsommere?');

console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
