// Forløb-klodsen (js/forloeb.js) med "Dit første atom" i Værkstedet: starter første gang og ikke anden gang, panelerne er
// skjult imens, hvert trins handling, helium med to protoner uden neutroner, H og He opdaget, kernesætningen til sidst,
// "Udforsk selv ›", "‹", "Næste ›" før handlingen (viser den), ✓ i "Din fremgang", forløbets eget link, hydrogen, der flyver hjem, og stien
// (stilguiden B, E20): handling uden gæt, prikkerne, når turen er taget, knapperne under Så og toningen bagefter.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { FØRSTE_ATOM } from '../js/data/forloeb/foerste-atom.js';
const UD = billedmappe('forloeb');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Teksterne holder skabelonens grænser (docs/fable/E3-forloeb.md)
const ord = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
const forLange = FØRSTE_ATOM.trin.filter((t) => ord(t.spørg) > 16 || ord(t.så) > 22 || (t.ord ?? []).length > 2);
tjek('teksterne: 3-6 trin, Spørg ≤ ca. 15 ord, Så ≤ ca. 20 ord, højst to fagord, mindst to gæt',
  FØRSTE_ATOM.trin.length >= 3 && FØRSTE_ATOM.trin.length <= 6 && !forLange.length && FØRSTE_ATOM.trin.filter((t) => t.gæt).length >= 2,
  forLange.map((t) => t.id).join(', '));

const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const fejl = [];
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
const F = () => T(() => { const v = atomlabTest.vaerksted; return { kører: v.forløb.kører(), trin: v.forløb.trin(), fase: v.forløb.fase(), ...v.tilstand() }; });
const fase = (f) => page.waitForFunction((x) => atomlabTest.vaerksted.forløb.fase() === x, f, { timeout: 20000, polling: 100 });
const synlig = (sel) => T((s) => { const e = document.querySelector(s); return Boolean(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, sel);

// ---------- Første gang: forløbet starter af sig selv ----------
await page.goto(`${ADRESSE}/?test&forloebstart#vaerksted`);
await T(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 });
const skjult = { bygge: await synlig('#byggepanel'), info: await synlig('#infopanel'), opgave: await synlig('#opgavePille'), sky: await synlig('#knapVisning'), linje: await synlig('.forløb-linje') };
tjek('starter første gang, og kun scenen og linjen er fremme (paneler, opgaven og "Elektronsky" er skjult)',
  !skjult.bygge && !skjult.info && !skjult.opgave && !skjult.sky && skjult.linje, JSON.stringify(skjult));

// ---------- Trinene ----------
await page.click('.fl-handling'); // trin 1: + Proton
await fase('så');
let f = await F();
const trin1 = f.p === 1 && f.e === 0;
// "Næste ›" står der hele tiden: stille, før handlingen er gjort, og lyseblå under Så
const næsteStille = await T(() => document.querySelector('.fl-næste')?.classList.contains('stille') === false);
// Under Så står kun knapper, der stadig kan bruges (protonen er brugt: ingen døde knapper)
const knapUnderSå = await T(() => !document.querySelector('.fl-handling:disabled'));
await page.click('.fl-næste');
f = await F();
// Gættet er en invitation: Trinets knap står der også, og "Næste ›" er stille
const gætFørst = f.trin === 'elektron' && f.fase === 'gæt' && await synlig('.fl-gæt') && await synlig('.fl-handling')
  && await T(() => document.querySelector('.fl-næste')?.classList.contains('stille'));
await page.click('.fl-gæt >> nth=1');
// Efter gættet: Instruksen står hvidt, og spørgsmålet er tonet ned
const hvidt = await T(() => ({ spurgt: Boolean(document.querySelector('.fl-spurgt')), gør: document.querySelector('.fl-gør')?.textContent ?? '' }));
await page.click('.fl-handling'); // trin 2: + Elektron
// "Grundstoffet flyver hjem" (E20): Under turen er tabellen skjult, så lyset flyver til et mærke øverst i scenen. Mærket ligger i scenens lag,
// så Forløb-linjen ikke flytter sig, og det tager ikke fokus
const hjemFør = await T(() => ({ h: atomlabTest.vaerksted.hjem.sidste(), m: atomlabTest.vaerksted.hjem.mærke() }));
await page.waitForFunction(() => atomlabTest.vaerksted.hjem.sidste()?.landet, null, { timeout: 5000, polling: 100 });
await fase('så');
const hjem = await T(() => { const m = document.querySelector('.hjem-mærke'); return { m: atomlabTest.vaerksted.hjem.mærke(), iScenen: Boolean(m?.closest('#vaerkstedVindue .vindue-lag')),
  iMærket: Boolean(m?.contains(document.activeElement)), knapper: m?.querySelectorAll('button, a, [tabindex]').length ?? -1,
  linje: (() => { const l = () => JSON.stringify(document.querySelector('.forløb-linje').getBoundingClientRect()); const med = l(); m.style.display = 'none'; const uden = l(); m.style.display = ''; return med === uden; })() }; });
await page.screenshot({ path: `${UD}/trin2-mærke.png` });
tjek('under turen flyver hydrogen hjem til et mærke i scenen ("Nyt grundstof: Hydrogen", 0 → 1 af 118), linjen står stille, og fokus bliver',
  hjemFør.h?.nr === 1 && hjemFør.h.mål === 'mærke' && /0 af 118/.test(hjemFør.m?.tekst) && /Hydrogen/.test(hjem.m?.tekst) && /1 af 118/.test(hjem.m?.tekst)
  && hjem.iScenen && !hjem.iMærket && hjem.knapper === 0 && hjem.linje, JSON.stringify({ hjemFør, hjem }));
tjek('"Næste ›" står der i alle faser (stille før handlingen), under Så ingen døde knapper, gæt og knap står samtidig, og efter gættet står instruksen hvidt',
  næsteStille && knapUnderSå && gætFørst && hvidt.spurgt && /elektron/i.test(hvidt.gør), JSON.stringify({ næsteStille, knapUnderSå, gætFørst, hvidt }));
const fagord = await T(() => [...document.querySelectorAll('.fl-tekst .fagord')].map((k) => k.dataset.ord).join(' '));
f = await F();
const hydrogen = f.p === 1 && f.e === 1;
// "‹" fra trin 3 går tilbage til trin 2, og atomet er igen, som det var, da trin 2 begyndte
await page.click('.fl-næste');
await page.click('.fl-tilbage');
f = await F();
const tilbage = f.trin === 'elektron' && f.p === 1 && f.e === 0;
await page.click('.fl-gæt >> nth=1');
await page.click('.fl-handling');
await fase('så');
await page.click('.fl-næste');
// Trin 3 uden at gætte: Et tryk på handlingen lader gættet tone væk (fasen gør), og Så kommer som før
await page.click('.fl-handling'); // trin 3: + Proton
const udenGæt = { fase: (await F()).fase, gæt: await synlig('.fl-gæt') };
await fase('så');
f = await F();
const toProtoner = f.p === 2 && f.n === 0 && await T(() => JSON.parse(localStorage.getItem('atomlabFremgang')).opgaver['uden-lim'] > 0);
await page.screenshot({ path: `${UD}/trin3.png` });
tjek('hvert trin: handling → Så, man kan handle uden at gætte, "‹" sætter atomet tilbage, og trinets fagord har prikker',
  trin1 && hydrogen && tilbage && fagord === 'elektron grundstof' && (udenGæt.fase === 'gør' || udenGæt.fase === 'så') && !udenGæt.gæt, JSON.stringify({ trin1, hydrogen, tilbage, fagord, udenGæt }));

// Trin 4 med "Vis mig": Værkstedet bygger selv helium
await page.click('.fl-næste');
const knapper = await T(() => [...document.querySelectorAll('.fl-handling')].map((k) => k.textContent.trim()).join(' | '));
// To neutroner før elektronen: vinket siger, hvorfor elektronen skal med
await page.click('.fl-handling >> nth=0');
await page.click('.fl-handling >> nth=0');
const vink = await T(() => document.querySelector('.fl-vink')?.textContent ?? '');
// "Næste ›" før handlingen er gjort: Værkstedet bygger selv helium, og Så kommer, før man går videre (trinet skifter ikke)
await page.click('.fl-næste');
const viser = { trin: (await F()).trin, viser: await T(() => atomlabTest.vaerksted.forløb.viser()) };
await page.click('.fl-næste'); // et tryk mere, mens den viser: ingenting
await fase('så');
viser.efter = (await F()).trin;
f = await F();
const opdaget = await T(() => JSON.parse(localStorage.getItem('atomlabFremgang')).opdaget.sort().join(','));
tjek('trin 3 er helium uden neutroner ("to protoner" løst), trin 4 giver et vink efter to neutroner, og "Næste ›" før handlingen viser den og bliver på trinet til Så (hydrogen og helium er opdaget)',
  toProtoner && f.p === 2 && f.n === 2 && f.e === 2 && opdaget === '1,2' && /Neutron 0\/2/.test(knapper) && /elektron mere/.test(vink)
  && viser.trin === 'neutroner' && viser.viser && viser.efter === 'neutroner', JSON.stringify({ toProtoner, f, opdaget, knapper, vink, viser }));

// Trin 5: det lille periodiske system med H og He, og til sidst kernesætningen
await page.click('.fl-næste');
const tabel = await synlig('#minitabelPanel') && await T(() => document.querySelectorAll('#minitabel .forløb-mål').length === 2);
await page.click('#minitabel .felt[data-nr="1"]');
await fase('slut');
const slut = await T(() => ({ tekst: document.querySelector('.fl-tekst').textContent, veje: document.querySelectorAll('.fl-vej').length,
  spm: document.querySelector('.fl-vej.hvorfor')?.textContent ?? '', pil: [...document.querySelectorAll('.fl-vej')].filter((v) => v.textContent.includes('›')).length }));
await page.screenshot({ path: `${UD}/slut.png` });
tjek('trin 5 viser det periodiske system med H og He lyst op, og "Det så du" har kernesætningen og tre veje videre (spørgsmålet er en gul pille, vejen til Solen har "›")',
  tabel && slut.tekst === FØRSTE_ATOM.kernesætning && slut.veje === 3 && /kernen/.test(slut.spm) && slut.pil === 1, JSON.stringify({ tabel, slut }));
await page.click('.fl-vej.primær');
const toning = await T(() => document.getElementById('vaerksted').classList.contains('fra-forløb'));
const efter = { kører: (await F()).kører, bygge: await synlig('#byggepanel'), info: await synlig('#infopanel'), opgave: await T(() => document.getElementById('opgaveTekst').textContent) };

// ---------- Anden gang: starter ikke af sig selv. ✓ i "Din fremgang" ----------
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted, null, { timeout: 20000 });
await page.waitForTimeout(500);
const anden = (await F()).kører;
await T(() => { location.hash = '#'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'menu', null, { timeout: 20000 });
await page.click('.menu-fremgang-knap');
const flueben = await T(() => document.querySelector('.fremgang-forløb[data-forloeb="foerste-atom"]')?.classList.contains('færdig') ?? null);
// Menuens "?" (E20): hjælpen med "Om AtomLab", og "Din fremgang ›" åbner fremgangen
await T(() => document.getElementById('dinFremgang').classList.add('skjult'));
await page.click('#menuHjælpKnap');
const menuHjælp = { vist: await synlig('#menuHjælp .dialog'), om: /Three\.js/.test(await page.textContent('#menuHjælp')) };
await page.click('#menuHjælpFremgang');
menuHjælp.fremgang = await synlig('#dinFremgang .dialog') && !(await synlig('#menuHjælp .dialog'));
await T(() => document.getElementById('dinFremgang').classList.add('skjult'));
tjek('menuens "?" viser hjælpen med "Om AtomLab", og "Din fremgang ›" åbner fremgangen', menuHjælp.vist && menuHjælp.om && menuHjælp.fremgang, JSON.stringify(menuHjælp));
// "↻ Tur" i toplinjen: fremme i delen, skjult under turen, og et tryk starter turen igen
await T(() => { location.hash = '#vaerksted'; });
await page.waitForFunction(() => atomlabTest.aktiv() === 'vaerksted', null, { timeout: 20000, polling: 100 });
const tur = { før: await synlig('#vaerksted .tur-knap') };
await page.click('#vaerksted .tur-knap');
await page.waitForFunction(() => atomlabTest.vaerksted.forløb.kører() === 'foerste-atom', null, { timeout: 10000, polling: 100 });
tur.under = await synlig('#vaerksted .tur-knap');
tur.prikker = await T(() => document.querySelectorAll('.fl-prik').length);
await page.click('.fl-spring');
tur.besked = await T(() => [...document.querySelectorAll('.pille, .undertekst')].map((e) => e.textContent).join(' '));
tjek('"↻ Tur" står i Værkstedets toplinje, starter turen igen (prikkerne kan trykkes) og er skjult imens',
  tur.før && !tur.under && tur.prikker === FØRSTE_ATOM.trin.length, JSON.stringify(tur));
tjek('efter forløbet: panelerne toner ind og er tilbage, næste opgave er carbon (isotoperne kommer senere), det starter ikke igen, og ✓ i "Din fremgang"',
  toning && efter.kører === null && efter.bygge && efter.info && /carbon/i.test(efter.opgave) && anden === null && flueben === true, JSON.stringify({ toning, efter, anden, flueben }));

// ---------- Linket starter forløbet, også når det er taget, og forsvinder fra adressen ----------
await page.goto(`${ADRESSE}/?test&forloeb=foerste-atom#vaerksted`);
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 }).catch(() => {});
const link = { kører: (await F()).kører, adresse: await T(() => location.search) };
// Turen er taget før: Prikkerne kan trykkes, og et tryk på den tredje går direkte til trin 3 (stilguiden B7)
link.prikker = await T(() => document.querySelectorAll('.fl-prik').length);
await page.click('.fl-prik >> nth=2');
link.trin = (await F()).trin;
// "Spring over": panelerne er tilbage, og forløbet starter ikke af sig selv igen (her med ?forloebstart og ikke taget)
await T(() => localStorage.clear());
await page.goto(`${ADRESSE}/?test&forloebstart#vaerksted`);
await page.waitForFunction(() => atomlabTest.vaerksted?.forløb.kører() === 'foerste-atom', null, { timeout: 20000 });
const ingenPrikker = await T(() => document.querySelectorAll('.fl-prik').length === 0); // ikke taget: prikkerne er pynt
const udforsk = await T(() => document.querySelector('.fl-spring')?.textContent ?? '');
await page.click('.fl-spring');
const sprunget = { kører: (await F()).kører, bygge: await synlig('#byggepanel'), ingenPrikker, udforsk };
await page.reload();
await page.waitForFunction(() => atomlabTest.vaerksted, null, { timeout: 20000 });
await page.waitForTimeout(500);
sprunget.igen = (await F()).kører;
tjek('linket starter forløbet og fjernes fra adressen, og prikkerne vælger trin, når turen er taget; "Udforsk selv ›" viser panelerne, og forløbet starter ikke igen',
  link.kører === 'foerste-atom' && !/forloeb/.test(link.adresse) && link.prikker === FØRSTE_ATOM.trin.length && link.trin === FØRSTE_ATOM.trin[2].id
  && sprunget.ingenPrikker && /Udforsk selv/.test(sprunget.udforsk) && sprunget.kører === null && sprunget.bygge && sprunget.igen === null, JSON.stringify({ link, sprunget }));

tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
