// Rejsen i tid (js/kosmos/tid.js og js/data/tid.js): tallene mod tabellerne i docs/fakta-tid.md (uden browser), og
// fænomenet i Kosmos: åbner uden konsolfejl, skyderen ændrer urene, "Vis lysuret" virker, og en rejse spolet frem ender
// ved hjemkomsten med den rigtige tekst.
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
const sætFart = (v) => E((v) => { const i = document.querySelector('#kosmosStyr input[type=range]'); i.value = v; i.dispatchEvent(new Event('input')); }, v);

await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForFunction(() => window.atomlabTest?.kosmos);
const ids = await E(() => atomlabTest.kosmos.fænomener);
tjek('"Rejsen i tid" står lige efter Rumtid', ids[ids.indexOf('rumtid') + 1] === 'tid', ids.join(','));
await E(() => atomlabTest.kosmos.vælg('tid'));
await page.waitForFunction(() => atomlabTest.kosmos.fænomen()?.ure);
tjek('navnet er "Rejsen i tid"', (await page.textContent('#kosmosNavn')) === 'Rejsen i tid');
const styr = await E(() => atomlabTest.kosmos.styr());
tjek('Styr-boksen har skyderen "Fart" (99,99 % fra start)', styr.length === 1 && styr[0].slags === 'skyder' && styr[0].navn === 'Fart' && (await page.textContent('#kosmosStyr .skyder-top strong')) === '99,99 %', JSON.stringify(styr));
tjek('⏩ findes (tidsknappen)', await page.isVisible('#kosmosTid [data-tid="hurtig"]'));
let u = await ure();
tjek('før afgang: "0 dage 0 timer", år nu, begge er 13', u.vist && u.skib === '0 dage 0 timer' && u.jord === `år ${await E(() => atomlabTest.kosmos.fænomen().startÅr)}` && u.skibAlder === 'Du: 13 år' && u.jordAlder === 'Tvillingen: 13 år', JSON.stringify(u));
const side = await E(() => atomlabTest.kosmos.side());
tjek('siden: Kort, to emner, For nørder og Ærligt talt sidst', side.kort.length > 40 && side.emner.length === 2 && side.bokse.includes('For nørder') && side.sidst === 'Ærligt talt', JSON.stringify(side.bokse));
tjek('siden: knappen "Vis lysuret" i teksten virker', side.knapper.some((k) => k.tekst.includes('Vis lysuret') && k.findes), JSON.stringify(side.knapper));
tjek('"Lige nu" siger 45 dage og 8,7 år ved 99,99 %', /45 dage.*8,7 år/.test(await page.textContent('#kosmosForklaring')), await page.textContent('#kosmosForklaring'));

// Skyderen ændrer urene: forholdet mellem urene undervejs er 1/γ, og det følger skyderen
await E(() => { atomlabTest.kosmos.trykPå('Flyv til Alpha Centauri'); atomlabTest.kosmos.spol(3); });
u = await ure();
tjek('undervejs ved 99,99 %: Jordens ur går 70,7 gange hurtigere end dit', nær(u.jordÅr / u.skibÅr, T.gamma(4), 0.01), u.jordÅr / u.skibÅr);
tjek('undervejs: urene tæller op (fx "år 20xx" og dage)', /dage/.test(u.skib) && u.jordÅr > 0.5, JSON.stringify(u));
tjek('underteksten: "Afgang"', (await E(() => atomlabTest.kosmos.fase()))?.titel === 'Afgang');
tjek('"Flyv" er grå undervejs', (await E(() => atomlabTest.kosmos.bjælke())).some((k) => k.tekst.includes('Flyv') && k.slået));
const før = await ure();
await sætFart(1);
await E(() => atomlabTest.kosmos.spol(2));
u = await ure();
const forhold = (u.jordÅr - før.jordÅr) / (u.skibÅr - før.skibÅr);
tjek('skyderen på 90 % undervejs: nu går Jordens ur kun 2,29 gange hurtigere', nær(forhold, T.gamma(1), 0.01), forhold);
tjek('skyderen viser "90 %"', (await page.textContent('#kosmosStyr .skyder-top strong')) === '90 %');
await page.screenshot({ path: `${UD}/undervejs.png` });

// En hel rejse ved 99,99 %, spolet frem
await sætFart(4);
await E(() => { atomlabTest.kosmos.trykPå('Forfra'); atomlabTest.kosmos.trykPå('Flyv til Alpha Centauri'); atomlabTest.kosmos.spol(13); });
tjek('ved målet: "Ude ved Alpha Centauri" med ca. 22 dage og 4,3 år', /Ude ved Alpha Centauri/.test((await E(() => atomlabTest.kosmos.fase()))?.titel) && /22 dage.*4,3 år/.test((await E(() => atomlabTest.kosmos.fase()))?.tekst), JSON.stringify(await E(() => atomlabTest.kosmos.fase())));
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
const h1 = await ure();
await E(() => atomlabTest.kosmos.spol(0.5));
const h2 = await ure();
tjek('⏩: 6 gange hurtigere (0,5 s giver ca. 1,08 år på Jorden)', nær(h2.jordÅr - h1.jordÅr, 0.5 * 0.36 * 6, 0.12), h2.jordÅr - h1.jordÅr);
await E(() => atomlabTest.kosmos.sætTid('spil'));

// Lysuret
tjek('"Vis lysuret" i bjælken', await E(() => atomlabTest.kosmos.trykPå('Vis lysuret')));
await E(() => atomlabTest.kosmos.spol(3));
let l = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('lysuret vises, og urene er skjult', l.vist && !(await ure()).vist && l.bredde > 200, JSON.stringify(l));
tjek('lysuret: skibets ur tikker 70,7 gange så tit som det set fra Jorden', nær(l.skib / l.jord, T.gamma(4), 0.01) && l.skib > 1.5, JSON.stringify(l));
tjek('lysuret: spejlene farer forbi, og sporet tegnes', l.x > 100 && l.spor > 2, JSON.stringify(l));
tjek('rejsen står stille, mens lysuret vises', (await ure()).jordÅr === (await ure()).jordÅr && (await E(() => atomlabTest.kosmos.fænomen().tilstand())) !== 'færdig');
const rejseFør = (await ure()).jordÅr;
await E(() => atomlabTest.kosmos.spol(2));
tjek('rejsens ure går ikke, mens lysuret vises', (await ure()).jordÅr === rejseFør);
tjek('bjælken: "Tilbage til rejsen", ikke "Flyv"', (await E(() => atomlabTest.kosmos.bjælke())).map((k) => k.tekst).join('|') === '↩ Tilbage til rejsen', JSON.stringify(await E(() => atomlabTest.kosmos.bjælke())));
await sætFart(1);
const l1 = await E(() => atomlabTest.kosmos.fænomen().lysur());
await E(() => atomlabTest.kosmos.spol(2));
const l2 = await E(() => atomlabTest.kosmos.fænomen().lysur());
tjek('lysuret følger skyderen: ved 90 % tager et tik 2,29 gange så lang tid set fra Jorden', nær((l2.skib - l1.skib) / (l2.jord - l1.jord), T.gamma(1), 0.01));
await page.waitForTimeout(300);
await page.screenshot({ path: `${UD}/lysur-90.png` });
tjek('"Tilbage til rejsen"', await E(() => atomlabTest.kosmos.trykPå('Tilbage til rejsen')));
tjek('urene vises igen', (await ure()).vist && !(await E(() => atomlabTest.kosmos.fænomen().lysur())).vist);

// Skift til et andet fænomen og tilbage: urene er væk og kommer igen én gang
await E(() => atomlabTest.kosmos.vælg('rumtid'));
tjek('urene forsvinder med fænomenet', !(await page.$('#kosmosOverlag .tid-ure')));
await E(() => atomlabTest.kosmos.vælg('tid'));
tjek('ét sæt ure, når man kommer tilbage', (await page.$$('#kosmosOverlag .tid-ure')).length === 1);

console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
