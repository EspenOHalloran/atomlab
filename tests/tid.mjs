// Rejsen i tid (js/kosmos/tid.js og js/data/tid.js): tallene mod tabellerne i docs/fakta-tid.md (uden browser), og
// fænomenet i Kosmos: åbner uden konsolfejl, skyderen ændrer urene, "Vis lysuret" virker, en rejse spolet frem ender
// ved hjemkomsten med den rigtige tekst, og (T2) målene, "1 g hele vejen" og "Set fra skibet".
import * as T from '../js/data/tid.js';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';

let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const nær = (a, b, tol) => Math.abs(a - b) <= tol;

// ---------- Regningen (fakta-tid.md, afsnit 2) ----------
const GAMMA = [[1, '90 %', 2.294], [2, '99 %', 7.089], [3, '99,9 %', 22.37], [4, '99,99 %', 70.71], [5, '99,999 %', 223.6], [6, '99,9999 %', 707.1], [12, null, 707107]];
for (const [n, tekst, g] of GAMMA) {
  tjek(`γ ved ${n} ni-taller = ${g}`, nær(T.gamma(n), g, g * 5e-4), T.gamma(n));
  if (tekst) tjek(`farten ${n} som tekst: ${tekst}`, T.fartTekst(n) === tekst, T.fartTekst(n));
  // γ fra ni-tallene passer med den almindelige formel (hvor den er præcis nok)
  if (n <= 6) tjek(`γ ved ${n} ni-taller passer med 1/√(1 − v²)`, nær(T.gamma(n), 1 / Math.sqrt(1 - T.fart(n) ** 2), 1e-6 * T.gamma(n)));
}
tjek('γ som tekst: 2,294 og 70,71 og 707,1', T.gammaTekst(T.gamma(1)) === '2,294' && T.gammaTekst(T.gamma(4)) === '70,71' && T.gammaTekst(T.gamma(6)) === '707,1');
tjek('14 ni-taller giver γ ≈ 7,1 mio. (ikke uendelig)', nær(T.gamma(14), 7.07e6, 0.01e6), T.gamma(14));
tjek('Alpha Centauri er 4,344 lysår væk (ikke 4,37 eller 4,4)', T.MÅL.alpha.lysår === 4.344);
tjek('Mælkevejens centrum 26.996 lysår, Andromeda 2,5 mio. lysår (som i regn.py)', T.MÅL.centrum.lysår === 26996 && T.MÅL.andromeda.lysår === 2.5e6 && T.MÅL_RÆKKE.join() === 'alpha,centrum,andromeda');
tjek('skyderen går op til 14 ni-taller', T.FLEST_NI === 14 && T.MINDST_NI === 1);
tjek('farten over 6 ni-taller: "99,9…9 % (12 ni-taller)"', T.fartTekst(12) === '99,9…9 % (12 ni-taller)' && T.fartTekst(6) === '99,9999 %', T.fartTekst(12));

// ---------- Rejsen med fast fart (fakta-tid.md, afsnit 5) ----------
// [ni-taller, år på Jorden, tid i skibet som tekst, afstand set fra skibet]
const REJSE = [[1, 9.7, '4,2 år', 1.9], [2, 8.8, '1,2 år', 0.61], [3, 8.7, '142 dage', 0.19], [4, 8.7, '45 dage', 0.061], [5, 8.7, '14 dage', 0.019], [6, 8.7, '4,5 dage', 0.0061]];
for (const [n, jord, skib, afstand] of REJSE) {
  const r = T.rejse(4.344, n);
  tjek(`${T.fartTekst(n)}: ${jord} år på Jorden og ${skib} i skibet (ud og hjem)`, nær(r.jordÅr, jord, 0.05) && T.varighed(r.skibÅr) === skib, `${r.jordÅr} ${T.varighed(r.skibÅr)}`);
  tjek(`${T.fartTekst(n)}: afstanden set fra skibet er ${afstand} lysår`, nær(r.afstandFraSkibet, afstand, afstand * 0.04), r.afstandFraSkibet);
}
const r4 = T.rejse(4.344, 4);
tjek('én vej ved 99,99 %: ca. 22 dage i skibet og ca. 4,3 år på Jorden', T.varighed(r4.ud.skibÅr) === '22 dage' && T.varighed(r4.ud.jordÅr) === '4,3 år');
tjek('99 % i skibet er ca. 452 dage', nær(T.rejse(4.344, 2).skibÅr * T.DAGE_PR_ÅR, 452, 1));
// De nye mål (fakta-tid.md, afsnit 5): [lysår, ni-taller, år på Jorden (tolerance), år i skibet (tolerance), afstand set fra skibet]
const STORE = [
  [26996, 2, 54500, 100, 7700, 10, 3800], [26996, 6, 54000, 100, 76, 0.5, 38], [26996, 12, 54000, 100, 28 / 365.25, 0.5 / 365.25, 0.038],
  [2.5e6, 6, 5.0e6, 0.01e6, 7071, 1, 3536], [2.5e6, 12, 5.0e6, 0.01e6, 7.1, 0.05, 3.5],
];
for (const [d, n, jord, tj, skib, ts, afst] of STORE) {
  const r = T.rejse(d, n);
  tjek(`${T.tal(d)} lysår ved ${n} ni-taller: ${T.tal(jord)} år på Jorden og ${T.varighed(skib)} i skibet`, nær(r.jordÅr, jord, tj) && nær(r.skibÅr, skib, ts), `${r.jordÅr} ${r.skibÅr}`);
  tjek(`${T.tal(d)} lysår ved ${n} ni-taller: ${afst} lysår set fra skibet`, nær(r.afstandFraSkibet, afst, afst * 0.02), r.afstandFraSkibet);
}
tjek('14 ni-taller til Mælkevejens centrum og hjem: ca. 3 dage (2,8) mod ca. 54.000 år', T.varighed(T.rejse(26996, 14).skibÅr) === '2,8 dage' && T.varighed(T.rejse(26996, 14).jordÅr) === '54.000 år', T.varighed(T.rejse(26996, 14).skibÅr));
tjek('store tider: "54.500 år", "5,0 mio. år", "7.693 år"', T.varighed(T.rejse(26996, 2).jordÅr) === '54.500 år' && T.varighed(5.0e6) === '5,0 mio. år' && T.varighed(T.rejse(26996, 2).skibÅr) === '7.693 år');
tjek('korte tider: 14 ni-taller til Alpha Centauri er 39 sekunder, 12 ni-taller 6 minutter', T.varighed(T.rejse(4.344, 14).skibÅr) === '39 sekunder' && T.varighed(T.rejse(4.344, 12).skibÅr) === '6 minutter', `${T.varighed(T.rejse(4.344, 14).skibÅr)} | ${T.varighed(T.rejse(4.344, 12).skibÅr)}`);
tjek('afstande som tekst: 0,061 lysår, 1,9 lysår, 3.536 lysår, 5,8 mio. km', T.lysårTekst(0.06143) === '0,061 lysår' && T.lysårTekst(1.894) === '1,9 lysår' && T.lysårTekst(3536) === '3.536 lysår' && T.lysårTekst(T.rejse(4.344, 14).afstandFraSkibet) === '5,8 mio. km', `${T.lysårTekst(0.06143)} | ${T.lysårTekst(T.rejse(4.344, 14).afstandFraSkibet)}`);
tjek('pr. dag i skibet: "2,3 dage", "707 dage", "6,1 år" og "19.400 år" (14 ni-taller)', T.prDagTekst(T.gamma(1)) === '2,3 dage' && T.prDagTekst(T.gamma(6)) === '707 dage' && T.prDagTekst(T.gamma(7)) === '6,1 år' && T.prDagTekst(T.gamma(14)) === '19.400 år');

// ---------- "1 g hele vejen" (fakta-tid.md, afsnit 6) ----------
tjek('c/a med 1 g er 0,9687 år', nær(T.K, 0.9687, 0.0001), T.K);
// [lysår, i skibet én vej, på Jorden én vej (tolerance), største γ (tolerance)]
const ENG = [[4.344, 3.574, 5.975, 0.01, 3.242, 0.001], [26996, 19.83, 26998, 1, 13935, 5], [2.5e6, 28.60, 2.5e6 + 1.9, 1, 1.29e6, 0.001e6]];
for (const [d, skib, jord, tj, g, tg] of ENG) {
  const r = T.enG(d);
  tjek(`1 g til ${T.tal(d)} lysår: ${skib} år i skibet, ${T.tal(jord)} år på Jorden, γ ${g} midtvejs`, nær(r.skibÅr, skib, 0.005) && nær(r.jordÅr, jord, tj) && nær(r.gamma, g, tg), JSON.stringify(r));
  const start = T.enGUndervejs(d, 0), midt = T.enGUndervejs(d, r.skibÅr / 2), slut = T.enGUndervejs(d, r.skibÅr);
  tjek(`1 g til ${T.tal(d)} lysår undervejs: står stille ved start og mål, midtvejs halvvejs med største γ`, start.pos === 0 && start.gamma === 1 && nær(slut.pos, d, d * 1e-9) && nær(slut.jordÅr, r.jordÅr, r.jordÅr * 1e-9) && nær(midt.pos, d / 2, d * 1e-9) && nær(midt.jordÅr, r.jordÅr / 2, r.jordÅr * 1e-9) && nær(midt.gamma, r.gamma, r.gamma * 1e-9), JSON.stringify({ start, midt, slut }));
  // Bremsningen er speedningen baglæns: samme γ et stykke før og efter midtvejs
  tjek(`1 g til ${T.tal(d)} lysår: bremsningen spejler speedningen`, nær(T.enGUndervejs(d, r.skibÅr * 0.3).gamma, T.enGUndervejs(d, r.skibÅr * 0.7).gamma, 1e-6 * r.gamma));
}
tjek('1 g: Alpha Centauri ud og hjem 7,1 år mod 12 år, Andromeda 57 år', T.varighed(2 * T.enG(4.344).skibÅr) === '7,1 år' && T.varighed(2 * T.enG(4.344).jordÅr) === '12 år' && T.varighed(2 * T.enG(2.5e6).skibÅr) === '57 år');
tjek('største fart: "95 %" til Alpha Centauri, 8 ni-taller til Mælkevejens centrum, 12 til Andromeda', T.fartFraGamma(T.enG(4.344).gamma) === '95 %' && T.fartFraGamma(T.enG(26996).gamma) === T.fartTekst(8) && T.fartFraGamma(T.enG(2.5e6).gamma) === T.fartTekst(12), `${T.fartFraGamma(T.enG(4.344).gamma)} ${T.fartFraGamma(T.enG(26996).gamma)}`);
tjek('fart fra γ passer med ni-tallene (lidt over γ ved 4 ni-taller giver "99,99 %")', [2, 3, 4, 6, 10, 14].every((n) => T.fartFraGamma(T.gamma(n) * 1.0001) === T.fartTekst(n)));

// ---------- Teksterne ----------
const hjem4 = T.hjemkomst(r4.skibÅr, r4.jordÅr, 2026);
tjek('hjemkomsten ved 99,99 %: 45 dage, 8,7 år, "13 år og 45 dage", tvillingen er 21', hjem4.includes('45 dage') && hjem4.includes('8,7 år') && hjem4.includes('Du er 13 år og 45 dage') && hjem4.includes('Din tvilling er 21'), hjem4);
const hjem1 = T.hjemkomst(T.rejse(4.344, 1).skibÅr, T.rejse(4.344, 1).jordÅr, 2026);
tjek('hjemkomsten ved 90 %: du er 17 år, tvillingen 22', hjem1.includes('Du er 17 år') && hjem1.includes('Din tvilling er 22'), hjem1);
for (let n = 1; n <= 6; n++) {
  const r = T.rejse(4.344, n);
  const t = T.hjemkomst(r.skibÅr, r.jordÅr, 2026);
  tjek(`hjemkomsten ved ${T.fartTekst(n)} er under 160 tegn (${t.length})`, t.length < 160, t);
}
// Sammenligningerne med fortiden (fakta-tid.md, afsnit 13)
tjek('fortiden: 54.000 år er længere end siden neandertalerne, 5 mio. år end siden Lucy, 500 år ingen', /neandertalere/.test(T.fortiden(54000)) && /Lucy/.test(T.fortiden(5e6)) && T.fortiden(500) === null && /Jellingsten/.test(T.fortiden(1100)) && /istid/.test(T.fortiden(12000)));
tjek('fortiden står i rækkefølge (ældst sidst)', T.FORTIDEN.every(([år], i) => i === 0 || år > T.FORTIDEN[i - 1][0]));
tjek('årstal: "2026" uden punktum, "56.018" og "5.002.026" med', T.årstalTekst(2026) === '2026' && T.årstalTekst(56018) === '56.018' && T.årstalTekst(5002026) === '5.002.026');
tjek('"Dit ur" over 1.000 år uden dage, og timer og minutter på en kort tur', T.ditUr(2421783.4) === '2.421.783 år' && T.ditUr(12.5 / 24 / 365.25, true) === '12 timer 30 min', `${T.ditUr(2421783.4)} | ${T.ditUr(12.5 / 24 / 365.25, true)}`);
// Alle hjemkomster (alle mål, alle farter og 1 g) er under 160 tegn og siger det rigtige
for (const id of T.MÅL_RÆKKE) {
  const d = T.MÅL[id].lysår;
  const ture = [...Array.from({ length: T.FLEST_NI }, (_, i) => [T.fartTekst(i + 1), T.rejse(d, i + 1)]), ['1 g', { skibÅr: 2 * T.enG(d).skibÅr, jordÅr: 2 * T.enG(d).jordÅr }]];
  const lange = ture.map(([navn, r]) => [navn, T.hjemkomst(r.skibÅr, r.jordÅr, 2026)]).filter(([, t]) => t.length >= 160);
  tjek(`hjemkomsterne til ${T.MÅL[id].navn} er under 160 tegn`, !lange.length, JSON.stringify(lange.map(([n, t]) => `${n}: ${t.length}`)));
  const forkert = ture.filter(([, r]) => {
    const t = T.hjemkomst(r.skibÅr, r.jordÅr, 2026);
    if (T.forGammel(r.skibÅr)) return !t.includes('ingen leve');
    if (r.jordÅr < 87) return !/Din tvilling er \d+\./.test(t);
    return !t.includes(`år ${T.årstalTekst(T.jordÅrstal(2026, r.jordÅr))}`) || !t.includes('langt liv') || !t.includes(T.fortiden(r.jordÅr));
  });
  tjek(`hjemkomsterne til ${T.MÅL[id].navn}: tvillingens alder, årstallet med fortiden, eller "ingen kan leve så længe"`, !forkert.length, JSON.stringify(forkert.map(([n]) => n)));
}
tjek('for gammel: 99,9999 % til Andromeda tager 7.071 år for dig, men ikke 76 år til Mælkevejens centrum', T.forGammel(T.rejse(2.5e6, 6).skibÅr) && !T.forGammel(T.rejse(26996, 6).skibÅr));
// Over ca. 100 år (fra T2): årstallet og en rolig linje om tvillingen, ingen alder
const lang = T.hjemkomst(3 / 365.25, 54000, 2026);
tjek('over 100 år: årstallet og "levede et langt liv", ingen alder', lang.includes('år 56.026') && lang.includes('levede et langt liv') && !lang.includes('tvilling er'), lang);
tjek('tvillingens alder op til 100 år, så null', T.tvillingAlder(87) === 100 && T.tvillingAlder(88) === null);
tjek('alderen: "13 år og 45 dage", "13 år og 1 dag", "14 år"', T.alderTekst(13 + 45 / 365.25) === '13 år og 45 dage' && T.alderTekst(13 + 1 / 365.25) === '13 år og 1 dag' && T.alderTekst(14) === '14 år');
tjek('"Dit ur": "0 dage 0 timer", "1 dag 1 time" og "4 år 75 dage"', T.ditUr(0) === '0 dage 0 timer' && T.ditUr(25 / 24 / 365.25) === '1 dag 1 time' && T.ditUr(4 + 75.5 / 365.25) === '4 år 75 dage', `${T.ditUr(0)} | ${T.ditUr(25 / 24 / 365.25)} | ${T.ditUr(4 + 75.5 / 365.25)}`);
tjek('danske tal: 2.294,5 og 54.000', T.tal(2294.5, 1) === '2.294,5' && T.tal(54000) === '54.000');
tjek('dage på Jorden pr. dag i skibet: 2,3, 71 og 707', T.dagePåJorden(1) === '2,3' && T.dagePåJorden(4) === '71' && T.dagePåJorden(6) === '707');

// ---------- I browseren ----------
const UD = billedmappe('tid');
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const E = (f, a) => page.evaluate(f, a);
const K = 'atomlabTest.kosmos';
const ure = () => E(() => atomlabTest.kosmos.fænomen().ure());
// En skyder i Styr-boksen ud fra navnet ("Mål" eller "Fart"): sæt værdien, eller læs teksten, den viser
const sæt = (navn, v) => E(([navn, v]) => {
  const b = [...document.querySelectorAll('#kosmosStyr .skyder-boks')].find((x) => x.querySelector('.skyder-top > span').textContent === navn);
  const i = b.querySelector('input');
  i.value = v;
  i.dispatchEvent(new Event('input'));
}, [navn, v]);
const vist = (navn) => E((navn) => [...document.querySelectorAll('#kosmosStyr .skyder-boks')].find((x) => x.querySelector('.skyder-top > span').textContent === navn)?.querySelector('strong').textContent ?? null, navn);
const sætFart = (v) => sæt('Fast fart', v);
// Målet vælges med tre kontakter, hvor præcis én er tændt (8. november 2026)
const vælgMål = (navn) => E((navn) => atomlabTest.kosmos.trykPå(`🎯 ${navn}`), navn);
const målTændt = async () => (await E(() => atomlabTest.kosmos.styr())).filter((s) => s.navn.startsWith('🎯') && s.til).map((s) => s.navn.slice(3)).join('|');

await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForFunction(() => window.atomlabTest?.kosmos);
const ids = await E(() => atomlabTest.kosmos.fænomener);
tjek('"Rejsen i tid" står lige efter Rumtid', ids[ids.indexOf('rumtid') + 1] === 'tid', ids.join(','));
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.ure);
tjek('navnet er "Rejsen i tid"', (await page.textContent('#kosmosNavn')) === 'Rejsen i tid');
const styr = await E(() => atomlabTest.kosmos.styr());
tjek('Styr-boksen: tre mål (Alpha Centauri tændt), skyderen "Fast fart" (99,99 %) og kontakterne "1 g hele vejen" og "Set fra skibet"', styr.map((s) => `${s.slags}:${s.navn}`).join('|') === 'kontakt:🎯 Alpha Centauri|kontakt:🎯 Mælkevejens centrum|kontakt:🎯 Andromeda|skyder:Fast fart|kontakt:1 g hele vejen|kontakt:Set fra skibet' && (await målTændt()) === 'Alpha Centauri' && (await vist('Fast fart')) === '99,99 %', JSON.stringify(styr));
tjek('et tryk på det valgte mål slukker det ikke', (await vælgMål('Alpha Centauri')) && (await målTændt()) === 'Alpha Centauri');
tjek('⏩ findes (tidsknappen)', await page.isVisible('#kosmosTid [data-tid="hurtig"]'));
let u = await ure();
tjek('før afgang: "0 dage 0 timer", år nu, begge er 13', u.vist && u.skib === '0 dage 0 timer' && u.jord === `år ${await E(() => atomlabTest.kosmos.fænomen().startÅr)}` && u.skibAlder === 'Du: 13 år' && u.jordAlder === 'Tvillingen: 13 år', JSON.stringify(u));
const side = await E(() => atomlabTest.kosmos.side());
const EMNER = ['Hurtigere end lyset? Nej!', 'Hvorfor går Jordens ur så hurtigt?', 'Hvad gør farten?', 'Fast fart eller 1 g?', 'Hvorfor ikke omvendt?', 'Set fra skibet', 'Er det målt?', 'Kunne man?'];
tjek('siden: Kort, de otte emner (T3 og 8. november 2026), For nørder og Ærligt talt sidst', side.kort.length > 40 && side.emner.map((e) => e.titel).join('|') === EMNER.join('|') && side.bokse.includes('For nørder') && side.sidst === 'Ærligt talt', JSON.stringify(side.emner.map((e) => e.titel)));
tjek('siden: emnerne starter foldet sammen, og to hører til en kontakt', side.emner.every((e) => !e.åben) && side.emner.filter((e) => e.kontakt).map((e) => `${e.titel}:${e.kontakt}`).join('|') === 'Fast fart eller 1 g?:1 g hele vejen|Set fra skibet:Set fra skibet', JSON.stringify(side.emner));
tjek('siden: knappen "Vis lysuret" i teksten virker', side.knapper.some((k) => k.tekst.includes('Vis lysuret') && k.findes), JSON.stringify(side.knapper));
tjek('"Lige nu" siger 45 dage og 8,7 år ved 99,99 %', /45 dage.*8,7 år/.test(await page.textContent('#kosmosForklaring')), await page.textContent('#kosmosForklaring'));
tjek('"Lige nu" forklarer fast fart og "Hurtigere end lyset? Nej" (22 dage, 4,3 år, lysglimtet 4 timer før)', /Fast fart:.*snyder/.test(await page.textContent('#kosmosForklaring')) && /Hurtigere end lyset\? Nej\. At nå ca\. 4,3 lysår på 22 dage.*4,3 år én vej.*kun komme 4 timer før dig/.test(await page.textContent('#kosmosForklaring')), await page.textContent('#kosmosForklaring'));
tjek('forspringet: knap 4 timer ved 99,99 %, under et sekund ved 14 ni-taller, 1,6 år med 1 g', T.forspringTekst(4.344, T.rejse(4.344, 4).ud.jordÅr) === '4 timer' && T.forspringTekst(4.344, T.rejse(4.344, 14).ud.jordÅr) === 'under et sekund' && T.forspringTekst(4.344, T.enG(4.344).jordÅr) === '1,6 år');

// Skyderen ændrer urene: forholdet mellem urene undervejs er 1/γ, og det følger skyderen
await E(() => { atomlabTest.kosmos.trykPå('Flyv til Alpha Centauri'); atomlabTest.kosmos.spol(3); });
u = await ure();
tjek('undervejs ved 99,99 %: Jordens ur går 70,7 gange hurtigere end dit', nær(u.jordÅr / u.skibÅr, T.gamma(4), 0.01), u.jordÅr / u.skibÅr);
tjek('undervejs: urene tæller op (fx "år 20xx" og dage)', /dage/.test(u.skib) && u.jordÅr > 0.5, JSON.stringify(u));
tjek('underteksten: "Afgang"', (await E(() => atomlabTest.kosmos.fase()))?.titel === 'Afgang');
tjek('"Flyv" er grå undervejs', (await E(() => atomlabTest.kosmos.bjælke())).some((k) => k.tekst.includes('Flyv') && k.slået));
// Skyderen flyttes og urene læses i samme skridt: Siden tegner videre i rigtig tid imellem, og ellers kommer der
// billeder med den gamle fart med i målingen (forholdet blev 2,31 i stedet for 2,29)
const før = await E(() => {
  const b = [...document.querySelectorAll('#kosmosStyr .skyder-boks')].find((x) => x.querySelector('.skyder-top > span').textContent === 'Fast fart');
  const i = b.querySelector('input');
  i.value = 1;
  i.dispatchEvent(new Event('input'));
  return atomlabTest.kosmos.fænomen().ure();
});
await E(() => atomlabTest.kosmos.spol(2));
u = await ure();
const forhold = (u.jordÅr - før.jordÅr) / (u.skibÅr - før.skibÅr);
tjek('skyderen på 90 % undervejs: nu går Jordens ur kun 2,29 gange hurtigere', nær(forhold, T.gamma(1), 0.01), forhold);
tjek('skyderen viser "90 %"', (await vist('Fast fart')) === '90 %');
await page.screenshot({ path: `${UD}/undervejs.png` });

// En hel rejse ved 99,99 %, spolet frem
await sætFart(4);
const vedMålet = await E(() => { atomlabTest.kosmos.trykPå('Forfra'); atomlabTest.kosmos.trykPå('Flyv til Alpha Centauri'); atomlabTest.kosmos.spol(13); return atomlabTest.kosmos.fase(); });
tjek('ved målet: "Ude ved Alpha Centauri" med ca. 22 dage og 4,3 år', /Ude ved Alpha Centauri/.test(vedMålet?.titel) && /22 dage.*4,3 år/.test(vedMålet?.tekst), JSON.stringify(vedMålet));
await E(() => atomlabTest.kosmos.spol(20));
tjek('rejsen er slut', (await E(() => atomlabTest.kosmos.fænomen().tilstand())) === 'færdig');
const fase = await E(() => atomlabTest.kosmos.fase());
tjek('hjemkomsten: "Hjemme igen" med den rigtige tekst', fase?.titel === 'Hjemme igen' && fase.tekst === T.hjemkomst(T.rejse(4.344, 4).skibÅr, T.rejse(4.344, 4).jordÅr, 2026), JSON.stringify(fase));
u = await ure();
tjek('urene ved hjemkomsten: ca. 45 dage og 8,69 år, tvillingen er 21', nær(u.skibÅr * 365.25, 44.9, 0.1) && nær(u.jordÅr, 8.689, 0.002) && u.jordAlder === 'Tvillingen: 21 år' && u.skibAlder === 'Du: 13 år og 45 dage', JSON.stringify(u));
tjek('underteksten står ikke på siden', !(await E(() => atomlabTest.kosmos.side())).tekst.includes(fase.tekst));
await page.screenshot({ path: `${UD}/hjemme.png` });

// Pausen: urene står stille
await E(() => { atomlabTest.kosmos.trykPå('Flyv til Alpha Centauri'); atomlabTest.kosmos.spol(2); atomlabTest.kosmos.sætTid('pause'); });
const pause1 = await ure();
await E(() => atomlabTest.kosmos.spol(3));
tjek('under pause står urene stille', (await ure()).jordÅr === pause1.jordÅr);
// ⏩: Jordens ur går 6 gange hurtigere pr. sekund
await E(() => atomlabTest.kosmos.sætTid('hurtig'));
// Læses i samme skridt som spolingen (ellers kommer billeder i rigtig tid med imellem)
const [h1, h2] = await E(() => { const f = atomlabTest.kosmos.fænomen(); const a = f.ure(); atomlabTest.kosmos.spol(0.5); return [a, f.ure()]; });
// Hver vej tager 12,5 sekunder på skærmen: til Alpha Centauri går Jordens ur 4,344/12,5 år pr. sekund
tjek('⏩: 4 gange hurtigere (0,5 s giver ca. 0,70 år på Jorden)', nær(h2.jordÅr - h1.jordÅr, 0.5 * (4.344 / 12.5) * 4, 0.08), h2.jordÅr - h1.jordÅr);
await E(() => atomlabTest.kosmos.sætTid('spil'));

// Lysuret
tjek('"Vis lysuret" i bjælken', await E(() => atomlabTest.kosmos.trykPå('Vis lysuret')));
await E(() => atomlabTest.kosmos.spol(3));
let l = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('lysuret vises, og urene er skjult', l.vist && !(await ure()).vist && l.bredde > 200, JSON.stringify(l));
tjek('lysuret starter i trin 1 ved 87 %: skibets ur tikker 2 gange så tit som det set fra Jorden', l.trin === 0 && nær(l.fart, Math.sqrt(3) / 2, 1e-9) && nær(l.skib / l.jord, 2, 0.001) && l.skib > 1.5, JSON.stringify(l));
tjek('lysuret: spejlene farer forbi, og billedet følger med dem', l.x > 100 && l.forskud > 0 && l.spor >= 3, JSON.stringify(l));
tjek('rejsen står stille, mens lysuret vises', (await ure()).jordÅr === (await ure()).jordÅr && (await E(() => atomlabTest.kosmos.fænomen().tilstand())) !== 'færdig');
const rejseFør = (await ure()).jordÅr;
await E(() => atomlabTest.kosmos.spol(2));
tjek('rejsens ure går ikke, mens lysuret vises', (await ure()).jordÅr === rejseFør);
tjek('bjælken: ‹, "Næste: Set fra Jorden" og "Tilbage til rejsen", ikke "Flyv"', (await E(() => atomlabTest.kosmos.bjælke())).map((k) => k.tekst).join('|') === '‹|Næste: Set fra Jorden ›|↩ Tilbage til rejsen', JSON.stringify(await E(() => atomlabTest.kosmos.bjælke())));
tjek('lysuret: ingen skyder i de første trin (Styr-boksen er tom)', (await E(() => atomlabTest.kosmos.styr())).length === 0);
await E(() => { atomlabTest.kosmos.trykPå('Næste'); atomlabTest.kosmos.trykPå('Næste'); atomlabTest.kosmos.spol(5); });
l = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('trin 3 "Den skrå vej er længere": står stille med lyset oppe set fra Jorden (et halvt tik) og et helt tik i skibet', l.trin === 2 && l.stille && l.jord === 0.5 && nær(l.skib, 1, 1e-9) && (await E(() => atomlabTest.kosmos.fase()))?.titel === 'Den skrå vej er længere', JSON.stringify(l));
await page.waitForTimeout(300);
await page.screenshot({ path: `${UD}/lysur-skraa-vej.png` });
await E(() => { atomlabTest.kosmos.trykPå('Næste'); atomlabTest.kosmos.trykPå('Næste'); });
tjek('sidste trin: skyderen "Fart i lysuret" (87 %), og ingen "Næste"', (await vist('Fart i lysuret')) === '87 %' && !(await E(() => atomlabTest.kosmos.bjælke())).some((k) => k.tekst.startsWith('Næste')));
await sæt('Fart i lysuret', 4);
const l1 = await E(() => atomlabTest.kosmos.fænomen().lysur());
await E(() => atomlabTest.kosmos.spol(2));
const l2 = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('lysuret følger sin skyder: ved 99 % tager et tik 7,09 gange så lang tid set fra Jorden', nær((l2.skib - l1.skib) / (l2.jord - l1.jord), T.lysurGamma(0.99), 0.01) && /7,1 gange/.test(await page.textContent('#kosmosForklaring')));
await page.waitForTimeout(300);
await page.screenshot({ path: `${UD}/lysur-99.png` });
tjek('"Tilbage til rejsen"', await E(() => atomlabTest.kosmos.trykPå('Tilbage til rejsen')));
tjek('urene vises igen', (await ure()).vist && !(await E(() => atomlabTest.kosmos.fænomen().lysur())).vist);

// ---------- T2: målene ----------
await sætFart(14);
await vælgMål('Mælkevejens centrum');
tjek('målet: Mælkevejens centrum (og kun det er tændt)', (await målTændt()) === 'Mælkevejens centrum' && (await E(() => atomlabTest.kosmos.fænomen().mål())) === 'centrum');
tjek('scenen viser kun Mælkevejens centrum, og knappen hedder "Flyv til Mælkevejens centrum"', (await E(() => atomlabTest.kosmos.fænomen().scene())).synlige.join() === 'centrum' && (await E(() => atomlabTest.kosmos.bjælke())).some((k) => k.tekst === '🚀 Flyv til Mælkevejens centrum'));
tjek('farten viser "99,9…9 % (14 ni-taller)"', (await vist('Fast fart')) === '99,9…9 % (14 ni-taller)');
const centrumVed = await E(() => {
  atomlabTest.kosmos.trykPå('Forfra');
  atomlabTest.kosmos.trykPå('Flyv til Mælkevejens centrum');
  atomlabTest.kosmos.spol(6);
  const u = atomlabTest.kosmos.fænomen().ure();
  atomlabTest.kosmos.spol(7);
  return { u, ved: atomlabTest.kosmos.fase(), lige: document.querySelector('#kosmosForklaring').textContent };
});
tjek('undervejs til Mælkevejens centrum løber Jordens ur løbsk (skiven gløder)', centrumVed.u.løbsk && centrumVed.u.jordÅr > 10000, JSON.stringify(centrumVed.u));
tjek('ved Mælkevejens centrum: 1,4 dage for dig og 27.000 år på Jorden', /Ude ved Mælkevejens centrum/.test(centrumVed.ved?.titel) && /1,4 dage.*27\.000 år/.test(centrumVed.ved?.tekst), JSON.stringify(centrumVed.ved));
tjek('"Lige nu" ved målet: to afstande og "En radiobesked hjem tager 27.000 år"', /set fra Jorden, men kun .* set fra skibet/.test(centrumVed.lige) && /En radiobesked hjem tager 27\.000 år/.test(centrumVed.lige), centrumVed.lige);
await E(() => atomlabTest.kosmos.spol(15));
const centrumHjem = await E(() => ({ fase: atomlabTest.kosmos.fase(), u: atomlabTest.kosmos.fænomen().ure(), år: atomlabTest.kosmos.fænomen().startÅr }));
const rC = T.rejse(26996, 14);
tjek('hjemme fra Mælkevejens centrum: årstallet, neandertalerne og tvillingen', centrumHjem.fase?.titel === 'Hjemme igen' && centrumHjem.fase.tekst === T.hjemkomst(rC.skibÅr, rC.jordÅr, centrumHjem.år) && /neandertalere/.test(centrumHjem.fase.tekst), JSON.stringify(centrumHjem.fase));
tjek('Jordens ur viser fx "år 56.018" (med punktum), og urskiven gløder ikke længere', centrumHjem.u.jord === `år ${T.årstalTekst(T.jordÅrstal(centrumHjem.år, rC.jordÅr))}` && !centrumHjem.u.løbsk && centrumHjem.u.jordAlder === 'Tvillingen levede et langt liv', JSON.stringify(centrumHjem.u));
await page.screenshot({ path: `${UD}/centrum-hjemme.png` });

// ---------- T2: "1 g hele vejen" og "Set fra skibet" ----------
await vælgMål('Andromeda');
tjek('"1 g hele vejen"', await E(() => atomlabTest.kosmos.trykPå('1 g hele vejen')));
const s2 = await E(() => atomlabTest.kosmos.styr());
tjek('med 1 g er skyderen "Fart" væk, og kontakten er tændt', s2.map((s) => s.navn).join('|') === '🎯 Alpha Centauri|🎯 Mælkevejens centrum|🎯 Andromeda|1 g hele vejen|Set fra skibet' && s2[3].til, JSON.stringify(s2));
tjek('"Lige nu" med 1 g: ca. 57 år for dig, ca. 5,0 mio. år på Jorden og den største fart', /Med 1 g hele vejen.*57 år for dig.*5,0 mio\. år på Jorden.*størst midtvejs: 99,9…9 % \(12 ni-taller\)/.test(await page.textContent('#kosmosForklaring')), await page.textContent('#kosmosForklaring'));
await E(() => atomlabTest.kosmos.trykPå('Set fra skibet'));
const midt = await E(() => { atomlabTest.kosmos.trykPå('Flyv til Andromeda'); atomlabTest.kosmos.spol(6.25); const f = atomlabTest.kosmos.fænomen(); return { ...f.fart(), ...f.scene(), u: f.ure() }; });
tjek('1 g midtvejs til Andromeda: γ over 100.000, skibet halvvejs på skærmen', midt.gamma > 1e5 && nær(midt.andel, 0.5, 0.05), JSON.stringify(midt));
tjek('Set fra skibet: scenen er trykket sammen, og Jorden og Andromeda er rykket ind mod skibet', midt.klem < 0.1 && midt.mål - midt.skib < 5 && midt.skib - midt.jord < 4, JSON.stringify(midt));
tjek('1 g midtvejs: dit ur har gået ca. 14 år, Jordens over 0,5 mio. år', nær(midt.u.skibÅr, 14.3, 0.6) && midt.u.jordÅr > 0.5e6, JSON.stringify(midt.u));
await page.screenshot({ path: `${UD}/andromeda-1g-midtvejs.png` });
await E(() => atomlabTest.kosmos.spol(20));
const g1 = await E(() => ({ tilstand: atomlabTest.kosmos.fænomen().tilstand(), u: atomlabTest.kosmos.fænomen().ure(), fase: atomlabTest.kosmos.fase(), år: atomlabTest.kosmos.fænomen().startÅr }));
const rG = T.enG(2.5e6);
tjek('1 g hjem fra Andromeda: 57,2 år for dig og ca. 5,0 mio. år på Jorden', g1.tilstand === 'færdig' && nær(g1.u.skibÅr, 2 * rG.skibÅr, 1e-6) && nær(g1.u.jordÅr, 2 * rG.jordÅr, 1e-3) && g1.u.skibAlder === `Du: ${T.alderTekst(13 + 2 * rG.skibÅr)}`, JSON.stringify(g1.u));
tjek('1 g hjem fra Andromeda: teksten nævner Lucy', g1.fase?.tekst === T.hjemkomst(2 * rG.skibÅr, 2 * rG.jordÅr, g1.år) && /Lucy/.test(g1.fase.tekst), JSON.stringify(g1.fase));
await E(() => atomlabTest.kosmos.spol(2));
tjek('hjemme står skibet stille, og scenen er ikke trykket sammen', nær((await E(() => atomlabTest.kosmos.fænomen().scene())).klem, 1, 0.02));
// Et skift af mål undervejs starter forfra
await E(() => { atomlabTest.kosmos.trykPå('Flyv til Andromeda'); atomlabTest.kosmos.spol(2); });
await vælgMål('Alpha Centauri');
tjek('skift af mål undervejs: tilbage ved Jorden med Alpha Centauri', (await E(() => atomlabTest.kosmos.fænomen().tilstand())) === 'hjemme' && (await E(() => atomlabTest.kosmos.fænomen().scene())).synlige.join() === 'alpha' && (await ure()).jordÅr === 0);
// Lysuret med 1 g: ingen skyder i første trin, og bagefter er "Fast fart" stadig væk
await E(() => atomlabTest.kosmos.trykPå('Vis lysuret'));
tjek('lysuret med 1 g: tom Styr-boks i første trin', (await E(() => atomlabTest.kosmos.styr())).length === 0);
await E(() => atomlabTest.kosmos.trykPå('Tilbage til rejsen'));
tjek('tilbage fra lysuret med 1 g: ingen "Fart"', (await E(() => atomlabTest.kosmos.styr())).map((s) => s.navn).join('|') === '🎯 Alpha Centauri|🎯 Mælkevejens centrum|🎯 Andromeda|1 g hele vejen|Set fra skibet');
await E(() => atomlabTest.kosmos.trykPå('1 g hele vejen'));
tjek('1 g slået fra: skyderen "Fast fart" er tilbage', (await E(() => atomlabTest.kosmos.styr())).map((s) => s.navn).join('|') === '🎯 Alpha Centauri|🎯 Mælkevejens centrum|🎯 Andromeda|Fast fart|1 g hele vejen|Set fra skibet');

// ---------- T3: lagene og teksterne ----------
await E(() => atomlabTest.kosmos.vælg('rumtid'));
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.ure);
let s3 = await E(() => atomlabTest.kosmos.side());
const tekst3 = s3.tekst.toLowerCase();
// Ét eksempel fra hvert lag (tallene er tjekket mod fakta-tid.md, og de skal stå der)
for (const [navn, bid] of [
  ['tvillingeparadokset: den lige vej giver den længste tid', 'den lige vej, at blive hjemme, giver den længste tid'],
  ['længdeforkortelsen: ca. 0,061 lysår set fra skibet', 'ca. 0,061 lysår væk set fra skibet'],
  ['1 g: ca. 11.500 g for 2 dage mod 2.000 år', 'ca. 11.500 g'],
  ['myonerne: ca. 660 m uden tidsforlængelse, og de fleste når ned', 'de fleste nåede ned'],
  ['Hafele og Keating: mod vest vandt urene ca. 273', 'urene mod vest vandt ca. 273'],
  ['Kononenko: 1.111 døgn og ca. 27 tusindedele sekund', 'ca. 27 tusindedele sekund yngre'],
  ['energien: over 50.000 års energi for hele verden', 'over 50.000 år'],
  ['For nørder: rumtidens minus', 'τ² = t² − (x/c)²'],
  ['For nørder: reglen om √10', 'ca. √10 ≈ 3,16 gange større'],
  ['For nørder: samtidighed', '"nu" er ikke det samme for alle'],
  ['For nørder: sekundet er 9.192.631.770 svingninger', '9.192.631.770 svingninger'],
  ['Ærligt talt: lyset har ikke sit eget ur', 'lyset har ikke sit eget ur'],
  ['Ærligt talt: Interstellar', 'interstellar'],
]) tjek(`teksten: ${navn}`, tekst3.includes(bid.toLowerCase()));
tjek('teksten: ingen "tungere" uden forbehold (fælden om massen står kun i "Hvorfor?"-kortet)', !/bliver tungere/.test(tekst3));
tjek('teksten: brændstoffet og 11.500 g står kun ét sted', (tekst3.match(/780 millioner/g) ?? []).length === 1 && (tekst3.match(/11\.500 g/g) ?? []).length === 1);
// Knapperne i teksten
const k3 = (fn) => s3.knapper.find(fn);
tjek('knap: "Set fra skibet" i teksten er en kontakt, der findes', k3((k) => k.slags === 'kontakt' && k.mål === 'Set fra skibet')?.findes === true, JSON.stringify(s3.knapper));
tjek('knap: "1 g hele vejen" i teksten', k3((k) => k.slags === 'kontakt' && k.mål === '1 g hele vejen')?.findes === true);
tjek('knap: Rumtid i "Er det målt?" og cæsium i For nørder', Boolean(k3((k) => k.slags === 'gaa' && k.mål === 'kosmos:rumtid')) && k3((k) => k.slags === 'gaa' && k.mål === 'system:55')?.findes === true, JSON.stringify(s3.knapper.filter((k) => k.slags === 'gaa')));
tjek('ordene: tidsforlængelse, længdeforkortelse og myon kan trykkes på', await E(() => ['tidsforlaengelse', 'laengdeforkortelse', 'myon'].every((id) => document.querySelector(`#kosmosTekst .fagord[data-ord="${id}"]`))));
// Emnet "Set fra skibet" folder sig ud, når kontakten slås til (også fra knappen i teksten)
await E(() => atomlabTest.kosmos.trykPå('Set fra skibet'));
s3 = await E(() => atomlabTest.kosmos.side());
tjek('kontakten "Set fra skibet" folder emnet ud (og kun det)', s3.emner.filter((e) => e.åben).map((e) => e.titel).join() === 'Set fra skibet', JSON.stringify(s3.emner));
tjek('knappen "Set fra skibet" i teksten viser, at den er tændt', s3.knapper.find((k) => k.mål === 'Set fra skibet')?.til === true);
await E(() => atomlabTest.kosmos.trykISide('1 g hele vejen'));
s3 = await E(() => atomlabTest.kosmos.side());
tjek('knappen "1 g hele vejen" i teksten slår 1 g til og folder emnet om 1 g ud (og "Set fra skibet" sammen)', (await E(() => atomlabTest.kosmos.fænomen().enG())) && s3.emner.filter((e) => e.åben).map((e) => e.titel).join() === 'Fast fart eller 1 g?', JSON.stringify(s3.emner));
await E(() => { atomlabTest.kosmos.trykPå('1 g hele vejen'); atomlabTest.kosmos.trykPå('Set fra skibet'); });
tjek('begge kontakter er slået fra igen', (await E(() => atomlabTest.kosmos.styr())).filter((x) => x.slags === 'kontakt' && !x.navn.startsWith('🎯')).every((x) => !x.til));
// "Hvorfor?"-kortet ved "Hvad gør farten?"
await E(() => [...document.querySelectorAll('#kosmosTekst details.side-emne')].find((d) => d.querySelector('summary').textContent.includes('Hvad gør farten?')).open = true);
await page.click('#kosmosTekst button.hvorfor[data-hvorfor="lysfart"]');
tjek('"Hvorfor?"-kortet: "Hvorfor kan et rumskib aldrig nå lysets fart?"', (await E(() => atomlabTest.hvorfor.vist())) === 'Hvorfor kan et rumskib aldrig nå lysets fart?');
await page.keyboard.press('Escape');

// Skift til et andet fænomen og tilbage: urene er væk og kommer igen én gang
await E(() => atomlabTest.kosmos.vælg('rumtid'));
tjek('urene forsvinder med fænomenet', !(await page.$('#kosmosOverlag .tid-ure')));
await E(() => atomlabTest.kosmos.vælg('tid'));
tjek('ét sæt ure, når man kommer tilbage', (await page.$$('#kosmosOverlag .tid-ure')).length === 1);

// Knappen til cæsium åbner cæsiums kort i Det periodiske system (sidst, for den forlader Kosmos)
tjek('knappen "Cæsium" i For nørder kan trykkes på', await E(() => atomlabTest.kosmos.trykISide('Cæsium')));
await page.waitForFunction(() => document.querySelector('#system:not(.skjult)') && atomlabTest.system.valgt() === 55, null, { timeout: 15000 }).catch(() => {});
tjek('knappen "Cæsium" åbner grundstof nr. 55 i Det periodiske system', (await E(() => atomlabTest.system.valgt())) === 55 && /cæsium/i.test(await page.textContent('#system')));
await page.screenshot({ path: `${UD}/caesium.png` });

console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
