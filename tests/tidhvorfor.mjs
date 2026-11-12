// "Hvorfor går tiden langsommere?" (js/kosmos/tidhvorfor.js og det fælles lysur js/kosmos/lysur.js, T5a): farterne
// lægges sammen med Einsteins formel (uden browser), og i Kosmos: fænomenet åbner uden konsolfejl lige efter Rejsen i
// tid, bjælken har fem trin, og "Næste" går fra scene 1 til 2, kontakten Lygte skifter underteksten, 50 % + 50 %
// giver 80 %, trekanten stopper på toppen og viser γ = 2 ved 87 %, lærredet dækker ikke Styr-boksen eller
// underteksten (pc, tablet og telefon på højkant), Rejsen i tids lysur virker stadig, og knappen derfra åbner fænomenet.
// Scene 3 (T5b, med en fast byge): uden Einstein når ingen ned, med Einstein viser myonens ur ca. 1,32 µs ved ankomsten,
// "Set fra myonen" klemmer luften til ca. 396 m og giver de samme overlevende, og skyderen styrer γ og luftens længde.
// Scene 4 og 5 (T5c): lyset rammer enderne efter 0,25, 1,0 og 0,5 (L/c), den nye undertekst, vendepunktet (4, 5) giver
// 6 år og et tryk på (3, 5) 8 år, man kan ikke trække uden for lyset, springet i "nu" er 6,4 år, "Spil rejsen",
// layoutet på højkant, og knapperne mellem Rejsen i tid og det nye fænomen virker begge veje.
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
// Lærredet må ikke dække Styr-boksen (når den er åben), underteksten eller bjælken. Der ventes to billeder først:
// Lærredets størrelse rettes af en ResizeObserver, som først kører lige før det næste billede (under belastning
// kunne testen ellers måle mellem en ændring i bjælken og det næste billede, T5c)
const dækker = () => E(async () => {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
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

// ---------- Scene 3: myonernes kapløb (T5b) ----------
// En fast byge: levetiderne er 24 jævnt fordelte punkter i den eksponentielle fordeling (middel 2,197 µs). Den
// længste er ca. 8,5 µs (under turens 50 µs), og 13 lever længere end turens 1,32 µs på myonens ur ved γ ≈ 38.
const TAU = 2.1969811;
const BYGE = Array.from({ length: 24 }, (_, i) => -TAU * Math.log(1 - (i + 0.5) / 24));
const OVERLEVER = BYGE.map((_, i) => i).filter((i) => BYGE[i] > 15 / (0.99965 * 0.299792458) * Math.sqrt(1 - 0.99965 ** 2));
const s3 = () => E(() => atomlabTest.kosmos.fænomen().scene3());
await E(() => atomlabTest.kosmos.trykPå('Næste: Myonerne'));
t = await E(() => atomlabTest.kosmos.trin());
styr = await E(() => atomlabTest.kosmos.styr());
bj = await E(() => atomlabTest.kosmos.bjælke());
f = await fase();
tjek('scene 3: kontakterne (Med Einstein tændt), skyderen "Fart" på 99,97 %, "↻ Ny byge" i bjælken og den fælles sætning under 160 tegn',
  t?.nr === 2 && styr.map((s) => `${s.slags}:${s.navn}:${s.til ?? ''}`).join('|') === 'kontakt:Uden Einstein:false|kontakt:Med Einstein:true|kontakt:Set fra myonen:false|skyder:Fart:'
  && (await page.textContent('#kosmosStyr .skyder-boks strong')) === '99,97 % (typisk)' && bj.some((x) => x.tekst === '↻ Ny byge')
  && /^Myoner er små partikler/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([t, styr, bj, f]));
await E((liv) => atomlabTest.kosmos.fænomen().sætByge(liv), BYGE);

await E(() => atomlabTest.kosmos.trykPå('Uden Einstein'));
await E(() => atomlabTest.kosmos.spol(6.5));
let m = await s3();
f = await fase();
tjek('Uden Einstein: ingen af den faste byge når ned, og underteksten er kun kontaktens linje (1 ud af 8 milliarder)',
  m.færdig && m.levende.length === 0 && nær(m.myonUr, m.jordUr, 1e-9) && !m.fælles && /1 ud af 8 milliarder/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([m, f]));
await page.screenshot({ path: `${UD}/scene3-uden-pc.png` });

await E(() => atomlabTest.kosmos.trykPå('Med Einstein'));
await E(() => atomlabTest.kosmos.spol(6.5));
m = await s3();
f = await fase();
const medEinstein = m.levende;
tjek('Med Einstein (γ ≈ 38): myonens ur er ca. 1,32 µs ved ankomsten, Jordens ca. 50 µs, 13 af 24 når ned, og underteksten siger "ca. halvdelen"',
  m.færdig && nær(m.gamma, 37.8, 0.05) && nær(m.myonUr, 1.324, 0.002) && nær(m.jordUr, 50.05, 0.02) && medEinstein.join() === OVERLEVER.join() && OVERLEVER.length === 13
  && /ca\. 38 gange langsommere/.test(f?.tekst) && /ca\. halvdelen/.test(f.tekst) && f.tekst.length < 160, JSON.stringify([m, f]));
await page.screenshot({ path: `${UD}/scene3-med-pc.png` });

await E(() => atomlabTest.kosmos.trykPå('Set fra myonen'));
await E(() => atomlabTest.kosmos.spol(2));
m = await s3();
tjek('Set fra myonen: luften klemmes til ca. 396 m, og myonens ur står på 0, mens billedet zoomer', m.fase === 'zoom' && nær(m.luft, 396.8, 0.5) && m.myonUr === 0 && m.jordUr === null, JSON.stringify(m));
await E(() => atomlabTest.kosmos.spol(7));
m = await s3();
f = await fase();
tjek('Set fra myonen: samme ur ved ankomsten (ca. 1,32 µs) og de samme myoner når ned som "Med Einstein"',
  m.færdig && nær(m.myonUr, 1.324, 0.002) && m.levende.join() === medEinstein.join() && /presset sammen til ca\. 400 m/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([m, f]));
tjek('lærredet dækker ikke Styr-boksen, underteksten eller bjælken (scene 3, pc)', (await dækker()).length === 0, JSON.stringify(await dækker()));
await page.screenshot({ path: `${UD}/scene3-myon-pc.png` });

// Skyderen: γ og luftens længde følger farten (ca. 670 m ved 99,9 % og ca. 2,1 km ved 99 %)
await sæt('Fart', 1);
const ved999 = (await fase())?.tekst;
await sæt('Fart', 0);
const ved99 = (await fase())?.tekst;
await E(() => atomlabTest.kosmos.trykPå('Med Einstein'));
const med99 = (await fase())?.tekst;
tjek('skyderen: "ca. 670 m" ved 99,9 %, "ca. 2,1 km" ved 99 % og "ca. 7 gange" og "1 ud af 26" med Einstein ved 99 %',
  /ca\. 670 m/.test(ved999) && /ca\. 2,1 km/.test(ved99) && /ca\. 7 gange/.test(med99) && /1 ud af 26 ned/.test(med99), JSON.stringify([ved999, ved99, med99]));
await sæt('Fart', 2);
await E(() => atomlabTest.kosmos.trykPå('↻ Ny byge'));
m = await s3();
tjek('"↻ Ny byge" giver 24 nye levetider', m.liv.length === 24 && m.liv.join() !== BYGE.join() && m.liv.every((x) => x > 0), JSON.stringify(m.liv));

// Tablet på højkant: søjlen fylder højden, og lærredet dækker intet
await page.setViewportSize({ width: 820, height: 1180 });
await page.waitForTimeout(400);
for (const [k, fil] of [['Uden Einstein', 'uden'], ['Med Einstein', 'med'], ['Set fra myonen', 'myon']]) {
  await E((k) => atomlabTest.kosmos.trykPå(k), k);
  await E((k) => atomlabTest.kosmos.spol(k === 'Set fra myonen' ? 6 : 3.5), k);
  await page.screenshot({ path: `${UD}/scene3-${fil}-tablet.png` });
}
const l3 = await E(() => atomlabTest.kosmos.fænomen().lærred());
tjek('tablet på højkant: søjlen (60 % af bredden) er højere end bred, og lærredet dækker intet', l3.højde > 0.6 * l3.bredde * 1.1 && (await dækker()).length === 0, JSON.stringify([l3, await dækker()]));
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(300);

// ---------- Scene 4: "Nu" er ikke det samme for alle (T5c) ----------
const s4 = () => E(() => atomlabTest.kosmos.fænomen().scene4());
const næste = () => E(() => document.querySelector('#kosmosBjælke .bjælke-næste').click());
await næste();
styr = await E(() => atomlabTest.kosmos.styr());
bj = await E(() => atomlabTest.kosmos.bjælke());
f = await fase();
tjek('scene 4: kontakterne (60 % tændt), "💡 Blink igen" i bjælken og underteksten om lampen under 160 tegn',
  (await E(() => atomlabTest.kosmos.trin().nr)) === 3 && styr.map((s) => `${s.slags}:${s.navn}:${s.til ?? ''}`).join('|') === 'kontakt:Toget står stille:false|kontakt:Toget kører 60 % af lysets fart:true'
  && bj.some((x) => x.tekst === '💡 Blink igen') && /^Lampen midt i vognen blinker/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([styr, bj, f]));
let q = await s4();
tjek('scene 4 ved 60 %: lyset når bagenden efter 0,25 og forenden efter 1,0 (L/c), i toget begge efter 0,5, og vognen er 80 % så lang',
  nær(q.bag, 0.25, 1e-9) && nær(q.for, 1, 1e-9) && nær(q.tog, 0.5, 1e-9) && nær(q.vogn, 0.8, 1e-9), JSON.stringify(q));
await E(() => atomlabTest.kosmos.trykPå('Blink igen'));
await E(() => atomlabTest.kosmos.spol(0.6 * 3.2)); // 0,6 L/c efter blinket
q = await s4();
f = await fase();
tjek('scene 4 efter 0,6 L/c: begge ender ramt i toget, kun bagenden set fra perronen, og underteksten er stadig den første',
  q.ramt.tog && q.ramt.bag && !q.ramt.for && !q.efter && /^Lampen/.test(f?.tekst), JSON.stringify([q, f]));
await E(() => atomlabTest.kosmos.spol(0.5 * 3.2));
q = await s4();
f = await fase();
tjek('scene 4: når forenden er ramt, kommer den nye undertekst ("Om to ting sker "samtidig" …")',
  q.ramt.for && q.efter && /Om to ting sker "samtidig", kommer an på, hvem der kigger/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([q, f]));
await page.screenshot({ path: `${UD}/scene4-pc.png` });
await E(() => atomlabTest.kosmos.trykPå('Toget står stille'));
q = await s4();
f = await fase();
tjek('scene 4, toget står stille: lyset når begge ender efter 0,5 i begge billeder, og vognen er lige lang',
  q.fart === 0 && nær(q.bag, 0.5, 1e-9) && nær(q.for, 0.5, 1e-9) && nær(q.vogn, 1, 1e-9) && /to billeder ens/.test(f?.tekst), JSON.stringify([q, f]));
tjek('lærredet dækker ikke Styr-boksen, underteksten eller bjælken (scene 4, pc)', (await dækker()).length === 0, JSON.stringify(await dækker()));
await E(() => atomlabTest.kosmos.trykPå('Toget kører 60 % af lysets fart'));

// ---------- Scene 5: rumtidskortet (T5c) ----------
const s5 = () => E(() => atomlabTest.kosmos.fænomen().scene5());
const punkt = (x, t) => E(([x, t]) => atomlabTest.kosmos.fænomen().kortPunkt(x, t), [x, t]);
await næste();
styr = await E(() => atomlabTest.kosmos.styr());
bj = await E(() => atomlabTest.kosmos.bjælke());
f = await fase();
q = await s5();
tjek('scene 5: vendepunktet 4 lysår ude ved 5 år giver 6 år for den rejsende, "▶ Spil rejsen" i bjælken og kontakten "nu" i Styr',
  nær(q.x, 4, 1e-9) && nær(q.t, 5, 1e-9) && nær(q.egen, 6, 1e-9) && nær(q.v1, 0.8, 1e-9) && bj.some((x) => x.tekst === '▶ Spil rejsen')
  && styr.map((s) => s.navn).join() === "Vis den rejsendes 'nu'" && /^Op er tid, til siden er rum/.test(f?.tekst) && f.tekst.length < 160, JSON.stringify([q, bj, styr, f]));
// Et tryk med musen på kortet flytter vendepunktet derhen (3 lysår ude ved 5 år giver 8 år)
let p = await punkt(3, 5);
await page.mouse.click(p.x, p.y);
q = await s5();
tjek('et tryk på kortet (3 lysår, 5 år) flytter vendepunktet: den rejsende får 8 år (60 % af lysets fart)', nær(q.x, 3, 0.03) && nær(q.t, 5, 0.03) && nær(q.egen, 8, 0.06) && !q.træk, JSON.stringify(q));
// Træk uden for lyset: vendepunktet bliver ved 98 % af lysets fart, og advarslen kommer
p = await punkt(3, 5);
const p2 = await punkt(7, 5);
await page.mouse.move(p.x, p.y);
await page.mouse.down();
await page.mouse.move(p2.x, p2.y, { steps: 5 });
q = await s5();
await page.mouse.up();
tjek('trækker man uden for lyset, stopper vendepunktet ved 98 % af lysets fart, og "Hurtigere end lyset kan man ikke!" vises',
  q.træk && nær(q.x, 4.9, 1e-6) && q.advar && Math.abs(q.v1) <= 0.98 + 1e-9 && q.egen > 1.9 && q.egen < 2.1, JSON.stringify(q));
await E(() => atomlabTest.kosmos.trykPå('Vendepunkt 4 lysår ude'));
await E(() => atomlabTest.kosmos.trykPå("Vis den rejsendes 'nu'"));
q = await s5();
tjek('"nu"-linjerne: i vendingen springer "nu derhjemme" fra 1,8 til 8,2 år (6,4 år)', q.nu && nær(q.egen, 6, 1e-9) && nær(q.før, 1.8, 1e-9) && nær(q.efter, 8.2, 1e-9) && nær(q.spring, 6.4, 1e-9), JSON.stringify(q));
await E(() => atomlabTest.kosmos.trykPå('Spil rejsen'));
await E(() => atomlabTest.kosmos.spol(3.5));
q = await s5();
bj = await E(() => atomlabTest.kosmos.bjælke());
const halvvejs = q.spil && nær(q.T, 5, 0.1) && bj.some((x) => x.tekst === '■ Stop');
await page.screenshot({ path: `${UD}/scene5-pc.png` });
await E(() => atomlabTest.kosmos.spol(6.5));
q = await s5();
bj = await E(() => atomlabTest.kosmos.bjælke());
tjek('"▶ Spil rejsen" kører de 10 år (halvvejs efter 3,5 s) og stopper selv bagefter', halvvejs && !q.spil && bj.some((x) => x.tekst === '▶ Spil rejsen'), JSON.stringify([q, bj]));
tjek('lærredet dækker ikke Styr-boksen, underteksten eller bjælken (scene 5, pc)', (await dækker()).length === 0, JSON.stringify(await dækker()));

// Højkant: scene 4 over hinanden og scene 5 kvadratisk i hele bredden (tablet og telefon)
for (const [navn, vp] of [['tablet', { width: 820, height: 1180 }], ['telefon', { width: 390, height: 844 }]]) {
  await page.setViewportSize(vp);
  await page.waitForTimeout(400);
  const l5 = await E(() => atomlabTest.kosmos.fænomen().lærred());
  const ok5 = (await dækker()).length === 0 && l5.bredde >= Math.min(760, vp.width - 60) && l5.højde >= l5.bredde * 0.9;
  await page.screenshot({ path: `${UD}/scene5-${navn}.png` });
  await E(() => atomlabTest.kosmos.trykPå('‹'));
  await E(() => atomlabTest.kosmos.spol(1.2 * 3.2));
  const l4 = await E(() => atomlabTest.kosmos.fænomen().lærred());
  await page.screenshot({ path: `${UD}/scene4-${navn}.png` });
  tjek(`${navn}: scene 5 fylder bredden og er (næsten) kvadratisk, scene 4 står over hinanden, og lærredet dækker intet`, ok5 && l4.højde > 280 && (await dækker()).length === 0, JSON.stringify([l5, l4, await dækker()]));
  await næste();
}
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(300);

// Knappen "⏳ Rejsen i tid" i scene 5 åbner Rejsen i tid
tjek('scene 5: knappen "⏳ Rejsen i tid" findes i siden', (await E(() => atomlabTest.kosmos.side())).knapper.some((k) => k.tekst.includes('Rejsen i tid') && k.findes));
await E(() => atomlabTest.kosmos.trykISide('⏳ Rejsen i tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.lysur, null, { timeout: 5000 }).catch(() => {});
tjek('knappen åbner Rejsen i tid', (await page.textContent('#kosmosNavn')) === 'Rejsen i tid');

// Rejsen i tids lysur virker stadig med det fælles lysur, og knappen derfra åbner det nye fænomen
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.lysur);
await E(() => atomlabTest.kosmos.trykPå('Vis lysuret'));
await E(() => atomlabTest.kosmos.spol(3));
const l = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('Rejsen i tid: lysuret tikker stadig 2 gange så tit i skibet ved 87 %, og billedet følger spejlene', l.vist && nær(l.skib / l.jord, 2, 0.001) && l.forskud > 0 && l.spor >= 3, JSON.stringify(l));
// Lysurets sidste trin nævner det nye fænomen (med en knap i Lige nu)
for (let i = 0; i < 4; i++) await E(() => document.querySelector('#kosmosBjælke .bjælke-næste').click());
tjek('Rejsen i tid: lysurets sidste trin har knappen "🔦 Hvorfor går tiden langsommere?"', (await E(() => atomlabTest.kosmos.fænomen().lysur().trin)) === 4
  && (await E(() => [...document.querySelectorAll('#kosmosForklaring [data-gaa="kosmos:tidhvorfor"]')].length)) === 1);
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
