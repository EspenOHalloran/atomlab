// Kosmos: forløbet "Hvordan kan det ske?" (Serie 1 nr. 4, forløb B, drejebogen i docs/fable/E4-tid.md, afsnit 4) og
// oprydningen (jeres valg 13. november 2026): "Tid" er ét punkt i listen, og "Hvordan kan det ske?" (tidhvorfor) står ikke
// i den. Forløbet starter første gang med kun scenen og linjen, scene 1 venter på "Kast", lysuret på "Send uret
// forbi", målebåndet viser "dobbelt så lang", ca. halvdelen af myonerne når ned med Einstein, og vejene virker.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { HVORDAN_KAN_DET_SKE } from '../js/data/forloeb/tid.js';
import { ORDBOG } from '../js/data/ordbog.js';
import * as T from '../js/data/tid.js';
const UD = billedmappe('tid-forloeb2');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne og tallene (uden browser) ----------
const ord = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const B = HVORDAN_KAN_DET_SKE.trin;
const ordbog = new Set(ORDBOG.map((o) => o.id));
tjek('teksterne: 5 trin (B4 uden gæt), Spørg ≤ 25 ord, Så ≤ 23, fagordene (lysets fart, lysur, myon) i Ordbogen',
  B.length === 5 && B.filter((t) => !t.gæt).map((t) => t.id).join() === 'maal' && B.every((t) => ord(t.spørg) <= 25 && ord(t.så) <= 23)
  && B.flatMap((t) => t.ord).join() === 'lysetsfart,lysur,myon' && B.flatMap((t) => t.ord).every((id) => ordbog.has(id)));
const myonGamma = T.lysurGamma(0.99965), andel = Math.exp(-15 / (0.99965 * 0.299792458 * 2.1969811 * myonGamma));
tjek('tallene: 87 % giver γ = 2 (dobbelt så lang), myonerne γ ≈ 38 og ca. halvdelen (0,45-0,65)',
  Math.abs(T.lysurGamma(T.LYSUR_FARTER[T.LYSUR_START]) - 2) < 1e-9 && /Dobbelt/.test(B[3].så) && Math.round(myonGamma) === 38 && /38/.test(B[4].så) && andel > 0.45 && andel < 0.65 && /halvdelen/.test(B[4].så),
  JSON.stringify({ myonGamma, andel }));

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const page = await b.newPage({ viewport: { width: 1366, height: 768 } });
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
const E = (f, a) => page.evaluate(f, a);
const F = () => E(() => { const f = atomlabTest.kosmos.fænomen(); return { kører: f.kørerForløb(), trin: f.forløb.trin(), fase: f.forløb.fase(), scene: f.scene(), s: f.forløbsscene(), s1: f.scene1(), s2: f.scene2() }; });
const fase = (x) => page.waitForFunction((x) => atomlabTest.kosmos.fænomen()?.forløb?.fase() === x, x, { timeout: 20000, polling: 100 });
const synlig = (sel) => E((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
const knap = (id) => page.click(`#kosmos .forløb-linje [data-knap="${id}"]`);
const spol = (s) => E((s) => atomlabTest.kosmos.spol(s), s);
const tekst = () => page.textContent('#kosmos .forløb-linje .fl-tekst');
const næste = () => page.click('#kosmos .forløb-linje [data-nav="næste"]');

await page.goto(`${ADRESSE}/?test&forloebstart#kosmos`);
await E(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => window.atomlabTest?.kosmos);

// Listen: ét punkt "Tid", og "Hvordan kan det ske?" står ikke i den, men markerer "Tid", når det er åbent
const liste = await E(() => [...document.querySelectorAll('#kosmosListe .kosmos-valg')].map((x) => x.dataset.id));
await E(() => atomlabTest.kosmos.vælg('tidhvorfor'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.kørerForløb?.() === 'hvordan-kan-det-ske', null, { timeout: 15000 });
const valgt = await E(() => [...document.querySelectorAll('#kosmosListe .kosmos-valg.valgt')].map((x) => x.dataset.id));
tjek('listen: "Tid" står der, "Hvordan kan det ske?" ikke, og "Tid" er valgt, mens det er åbent, og tælles ikke med',
  liste.includes('tid') && !liste.includes('tidhvorfor') && valgt.join() === 'tid' && (await page.textContent('#kosmosNavn')) === 'Hvordan kan det ske?'
  && /af 12 set/.test(await page.textContent('#kosmosSet')), JSON.stringify({ liste, valgt }));

// B1: kun scenen og linjen, scene 1 venter på "Kast"
let f = await F();
const vist = { styr: await synlig('#kosmosStyr'), højre: await synlig('#kosmos .højre-panel'), linje: await synlig('#kosmos .forløb-linje'), lærred: await synlig('#kosmos .tidh') };
tjek('B1: starter første gang med kun scenen og linjen, bolden ved 100 km/t står stille, til man kaster',
  !vist.styr && !vist.højre && vist.linje && vist.lærred && f.trin === 'kast' && f.fase === 'gæt' && f.scene === 0 && f.s1.bold && f.s1.fart === 0 && f.s.vent1, JSON.stringify({ vist, f }));
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=2');
await spol(3);
tjek('B1: uden "Kast" sker der intet', (await F()).s.t1 === 0);
await knap('kast');
await spol(3);
await fase('så');
tjek('B1: efter "Kast" kommer Så med 150 km/t', /150 km\/t/.test(await tekst()));
await page.screenshot({ path: `${UD}/b1-saa.png` });

// B2: lygten ved 50 %
await næste();
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=1');
f = await F();
const b2 = f.s1;
await knap('lygte');
await spol(3);
await fase('så');
tjek('B2: lygten ved 50 %, og Så siger "Lysets fart, ikke mere"', !b2.bold && b2.fart === 0.5 && /Lysets fart, ikke mere/.test(await tekst()), JSON.stringify(b2));

// B3: lysuret ved 87 % venter på "Send uret forbi"
await næste();
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=1');
await spol(2);
f = await F();
tjek('B3: lysuret ved 87 % står stille, til det sendes forbi', f.scene === 1 && Math.abs(f.s2.fart - Math.sqrt(3) / 2) < 1e-9 && f.s.vent2 && f.s2.jord === 0, JSON.stringify(f));
await knap('send');
await spol(5);
await fase('så');
tjek('B3: Så siger "På skrå" og "lysur"', /På skrå.*lysur/.test(await tekst()));
await page.screenshot({ path: `${UD}/b3-saa.png` });

// B4: intet gæt, målebåndet
await næste();
f = await F();
tjek('B4: intet gæt, knappen "Mål"', f.trin === 'maal' && f.fase === 'gør' && !f.s.måler);
await knap('maal');
await spol(4);
await page.screenshot({ path: `${UD}/b4-maal.png` });
await fase('så');
f = await F();
tjek('B4: uret står på toppen, målebåndet er lagt (målT ≥ 3,8), og Så siger "Dobbelt så lang"', f.s2.stille && f.s.måler && f.s.målT >= 3.8 && /Dobbelt så lang/.test(await tekst()), JSON.stringify(f.s));

// B5: myonerne, først uden og så med Einstein
await næste();
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=0');
const uden = await E(() => atomlabTest.kosmos.fænomen().scene3());
await spol(8);
const udenNede = await E(() => atomlabTest.kosmos.fænomen().scene3().levende.length);
await knap('med');
await spol(6.2);
const med = await E(() => atomlabTest.kosmos.fænomen().scene3());
await fase('så');
tjek('B5: uden Einstein når ingen ned, med Einstein når 11-15 af 24 ned (ca. halvdelen), og Så siger "Ca. halvdelen"',
  uden.tilstand === 'Uden Einstein' && udenNede === 0 && med.tilstand === 'Med Einstein' && med.færdig && med.levende.length >= 11 && med.levende.length <= 15 && /Ca\. halvdelen/.test(await tekst()),
  JSON.stringify({ udenNede, levende: med.levende.length, færdig: med.færdig }));
await page.screenshot({ path: `${UD}/b5-saa.png` });

// "Det så du": kernesætningen, vejene og ✓ i fremgangen
await næste();
await fase('slut');
const veje = await E(() => [...document.querySelectorAll('#kosmos .fl-vej')].map((x) => x.textContent));
const taget = await E(() => Boolean(JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').forløb?.['hvordan-kan-det-ske']?.taget));
tjek('"Det så du": kernesætningen, de tre veje, og forløbet er taget',
  (await tekst()).startsWith('Lyset har den samme fart for alle') && veje.join('|') === '⏳ Prøv rejsen igen|Hvorfor ikke omvendt?|Set fra myonen' && taget, JSON.stringify({ veje, taget }));
await page.click('#kosmos .fl-vej >> nth=2');
await page.waitForTimeout(300);
const myonen = await E(() => atomlabTest.kosmos.fænomen().scene3().tilstand);
tjek('"Set fra myonen": scene 3 med kontakten tændt, og Styr og panelerne er tilbage',
  !(await synlig('#kosmos .forløb-linje')) && (await synlig('#kosmosStyr')) && (await synlig('#kosmos .højre-panel')) && (await E(() => atomlabTest.kosmos.fænomen().scene())) === 2 && myonen === 'Set fra myonen', myonen);

// Siden: knappen "Se rumtidskortet" går til scene 5
await page.click('#kosmos .højre-panel summary:has-text("Hvorfor ikke omvendt?")');
await page.click('#kosmos .højre-panel [data-gaa="kosmos:tidhvorfor:rumtid"]');
tjek('knappen i siden går til rumtidskortet (scene 5) uden "nu"-linjerne', (await E(() => atomlabTest.kosmos.fænomen().scene())) === 4 && !(await E(() => atomlabTest.kosmos.fænomen().scene5().nu)));

// Fra hjælpen
await page.click('#kosmosHjælp');
await page.click('#hjælpKosmos [data-forloeb="hvordan-kan-det-ske"]');
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.kørerForløb?.() === 'hvordan-kan-det-ske', null, { timeout: 10000 });
tjek('hjælpen starter forløbet igen fra B1', (await F()).trin === 'kast');
await page.click('#kosmos .forløb-linje [data-nav="spring"]');

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
