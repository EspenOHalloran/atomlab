// Kosmos: forløbet "Rejsen i tid" (Serie 1 nr. 4, forløb A, drejebogen i docs/fable/E4-tid.md, afsnit 4): tallene i teksterne
// passer med regningen, det starter første gang med kun scenen, urene og linjen, figurerne følger alderen, A1 ender med 14 og
// 94, "Dit ur" i A2 holder rejsen stille, A3 kræver begge farter, Så kommer før "Det så du", vejene virker, og forløbet kan
// startes igen fra hjælpen og fra linket ?forloeb=rejsen-i-tid#kosmos.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { REJSEN_I_TID } from '../js/data/forloeb/tid.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import * as T from '../js/data/tid.js';
const UD = billedmappe('tid-forloeb');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne og tallene (uden browser) ----------
const ord = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const [A1, A2, A3] = REJSEN_I_TID.trin;
const ordbog = new Set(ORDBOG.map((o) => o.id));
tjek('teksterne: 3 trin med gæt, Spørg ≤ 25 ord (A1) og ellers ≤ 20, Så ≤ 23, fagordene i Ordbogen, kortet "Er det målt?" findes',
  REJSEN_I_TID.trin.length === 3 && REJSEN_I_TID.trin.every((t) => t.gæt && ord(t.så) <= 23 && ord(t.spørg) <= (t === A1 ? 25 : 20))
  && REJSEN_I_TID.trin.flatMap((t) => t.ord).every((id) => ordbog.has(id)) && Boolean(HVORFOR.tidMaalt));
const alder = (lysår, n) => { const r = T.rejse(lysår, n); return [Math.floor(T.START_ALDER + r.skibÅr), T.tvillingAlder(r.jordÅr)]; };
tjek('tallene: TRAPPIST-1 ved 99,99 % giver 14 og 94, Alpha Centauri ved 50 % 28 og 30 og ved 99,99 % 13 og 21',
  alder(T.MÅL.trappist.lysår, 4).join() === '14,94' && /14.*94/.test(A1.så) && alder(T.MÅL.alpha.lysår, 0).join() === '28,30' && alder(T.MÅL.alpha.lysår, 4).join() === '13,21' && /28.*30.*13.*21/.test(A3.så) && /41 lysår/.test(A1.spørg) && Math.round(T.MÅL.trappist.lysår) === 41,
  JSON.stringify([alder(T.MÅL.trappist.lysår, 4), alder(T.MÅL.alpha.lysår, 0), alder(T.MÅL.alpha.lysår, 4)]));
tjek('figurerne: 13 og 19 er unge, 20 og 59 voksne, 60 og 94 gamle, over 100 ingen', T.figurSlags(13) === 'ung' && T.figurSlags(19) === 'ung' && T.figurSlags(20) === 'voksen' && T.figurSlags(59) === 'voksen' && T.figurSlags(60) === 'gammel' && T.figurSlags(94) === 'gammel' && T.figurSlags(null) === null && T.figurSlags(101) === null);

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const page = await b.newPage({ viewport: { width: 1366, height: 768 } });
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') fejl.push(m.text()); });
const E = (f, a) => page.evaluate(f, a);
const F = () => E(() => { const f = atomlabTest.kosmos.fænomen(); return { kører: f.kørerForløb(), trin: f.forløb.trin(), fase: f.forløb.fase(), tilstand: f.tilstand(), figurer: f.figurer(), mitUr: f.mitUr(), mål: f.mål(), ni: f.ni() }; });
const fase = (x) => page.waitForFunction((x) => atomlabTest.kosmos.fænomen()?.forløb?.fase() === x, x, { timeout: 20000, polling: 100 });
const synlig = (sel) => E((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);
const knap = (id) => page.click(`#kosmos .forløb-linje [data-knap="${id}"]`);
const spol = (s) => E((s) => atomlabTest.kosmos.spol(s), s);
const tekst = () => page.textContent('#kosmos .forløb-linje .fl-tekst');

// Første gang: Rejsen i tid åbnes, og forløbet starter af sig selv
await page.goto(`${ADRESSE}/?test&forloebstart#kosmos`);
await E(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => window.atomlabTest?.kosmos);
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.kørerForløb?.() === 'rejsen-i-tid', null, { timeout: 15000 });
let f = await F();
const vist = { styr: await synlig('#kosmosStyr'), venstre: await synlig('#kosmos .venstre-panel'), højre: await synlig('#kosmos .højre-panel'), linje: await synlig('#kosmos .forløb-linje'), ure: await synlig('#kosmos .tid-ure') };
tjek('starter første gang: kun scenen, urene og linjen, TRAPPIST-1 ved 99,99 %, to 13-årige figurer, og A1 spørger først',
  !vist.styr && !vist.venstre && !vist.højre && vist.linje && vist.ure && f.mål === 'trappist' && f.ni === 4 && f.figurer.dig === 'ung' && f.figurer.tvilling === 'ung' && f.trin === 'flyv' && f.fase === 'gæt', JSON.stringify({ vist, f }));
await page.screenshot({ path: `${UD}/a1-gaet.png` });

// A1: gæt, flyv og land (spolet frem)
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=2');
await knap('flyv');
await spol(8);
f = await F();
tjek('A1 undervejs: tvillingen bliver ældre (figuren skifter), du er den samme', f.tilstand !== 'hjemme' && f.figurer.dig === 'ung' && f.figurer.tvilling !== 'ung', JSON.stringify(f));
await spol(20);
await fase('så');
f = await F();
tjek('A1 hjemme: du er 14 (ung), tvillingen 94 (gammel), Så siger 14 og 94', f.tilstand === 'færdig' && f.figurer.dig === 'ung' && f.figurer.tvilling === 'gammel' && /14.*94/.test(await tekst()), JSON.stringify(f));
await page.screenshot({ path: `${UD}/a1-saa.png` });

// A2: flyv igen og se "Dit ur" undervejs: rejsen holder pause imens
await page.click('#kosmos .forløb-linje [data-nav="næste"]');
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=1');
await knap('flyv');
await spol(3);
await knap('mitur');
const før = await E(() => atomlabTest.kosmos.fænomen().fart().pos);
await spol(3);
const efter = await E(() => atomlabTest.kosmos.fænomen().fart().pos);
f = await F();
tjek('A2: "Dit ur" vises stort, og rejsen står stille imens', f.mitUr.vist && f.mitUr.sek > 2.5 && før === efter && (await synlig('#kosmos .tid-mit-ur')), JSON.stringify({ før, efter, f }));
await page.screenshot({ path: `${UD}/a2-mit-ur.png` });
await knap('mitur');
await spol(28);
await fase('så');
tjek('A2: hjemme igen, og Så nævner tidsforlængelse', /tidsforlængelse/.test(await tekst()));

// A3: først 50 %, så 99,99 % til Alpha Centauri
await page.click('#kosmos .forløb-linje [data-nav="næste"]');
await page.click('#kosmos .forløb-linje .fl-gæt >> nth=0');
f = await F();
const låst = await page.isDisabled('#kosmos .forløb-linje [data-knap="naesten"]');
tjek('A3: Alpha Centauri ved 50 %, og 99,99 % er låst, til man har fløjet med 50 %', f.mål === 'alpha' && f.ni === 0 && låst, JSON.stringify(f));
await knap('halv');
tjek('A3: turen starter med ⏩', await E(() => atomlabTest.kosmos.fænomen().hurtig()));
await spol(15);
const halv = await E(() => atomlabTest.kosmos.fænomen().ure());
await page.waitForFunction(() => !document.querySelector('#kosmos .forløb-linje [data-knap="naesten"]')?.disabled);
await knap('naesten');
await spol(8);
await fase('så');
const næsten = await E(() => atomlabTest.kosmos.fænomen().ure());
tjek('A3: 50 % giver 28 og 30, 99,99 % giver 13 år og 45 dage og 21, og Så kommer før "Det så du"',
  halv.skibAlder.startsWith('Du: 28 år') && halv.jordAlder === 'Tvillingen: 30 år' && næsten.skibAlder === 'Du: 13 år og 45 dage' && næsten.jordAlder === 'Tvillingen: 21 år' && /28.*30.*13.*21/.test(await tekst()), JSON.stringify({ halv, næsten }));
await page.screenshot({ path: `${UD}/a3-saa.png` });

// "Det så du": kernesætningen, de tre veje, ✓ i fremgangen, "Er det målt?" og "Leg frit"
await page.click('#kosmos .forløb-linje [data-nav="næste"]');
await fase('slut');
const veje = await E(() => [...document.querySelectorAll('#kosmos .fl-vej')].map((x) => x.textContent));
const taget = await E(() => Boolean(JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').forløb?.['rejsen-i-tid']?.taget));
tjek('"Det så du": kernesætningen, vejene "Hvordan kan det ske?", "Leg frit" og "Er det målt?", og forløbet er taget',
  (await tekst()).startsWith('Flyver man næsten med lysets fart') && veje.join('|') === '🔦 Hvordan kan det ske?|Leg frit|Er det målt?' && taget, JSON.stringify({ veje, taget }));
await page.screenshot({ path: `${UD}/slut.png` });
await page.click('#kosmos .fl-vej >> nth=2');
tjek('"Er det målt?" viser kortet', (await E(() => atomlabTest.hvorfor.vist())) === HVORFOR.tidMaalt.spørgsmål);
await page.click('#kosmos .fl-vej >> nth=1');
await page.waitForTimeout(300);
tjek('"Leg frit": linjen er væk, og Styr og panelerne er tilbage', !(await synlig('#kosmos .forløb-linje')) && (await synlig('#kosmosStyr')) && (await synlig('#kosmos .højre-panel')) && !(await F()).kører);

// Fra hjælpen, og vejen til "Hvorfor går tiden langsommere?"
await E(() => atomlabTest.kosmos.vælg('bigbang'));
await page.click('#kosmosHjælp');
await page.click('#hjælpKosmos [data-forloeb="rejsen-i-tid"]');
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.kørerForløb?.() === 'rejsen-i-tid', null, { timeout: 10000 });
tjek('hjælpen starter forløbet igen i Rejsen i tid', (await page.textContent('#kosmosNavn')) === 'Rejsen i tid' && (await F()).trin === 'flyv');
await page.click('#kosmos .forløb-linje [data-nav="spring"]');

// Linket ?forloeb=rejsen-i-tid#kosmos vælger Rejsen i tid, også når et andet fænomen var valgt
await page.goto(`${ADRESSE}/?test&forloeb=rejsen-i-tid#kosmos`);
await page.waitForFunction(() => atomlabTest.kosmos?.fænomen()?.kørerForløb?.() === 'rejsen-i-tid', null, { timeout: 15000 });
tjek('linket starter forløbet i Rejsen i tid og fjernes fra adressen', (await page.textContent('#kosmosNavn')) === 'Rejsen i tid' && !page.url().includes('forloeb='), page.url());

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
