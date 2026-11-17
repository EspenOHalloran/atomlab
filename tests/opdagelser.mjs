// Opdagelserne (#opdagelser, docs/plan-videnskabsfolk.md, afsnit 7): listen over bøgerne i Node (test 1), og i browseren,
// at delen åbner fra menuen og som første skærm uden fejl (test 3), hylden med alle ti (en grå ryg giver kun én linje),
// forsiden og bladringen (knapper, piletaster, stryg og Esc), og at telefon og tablet på højkant ikke får noget, der
// ligger uden for skærmen (test 8). H1 16. november 2026. H2 (fortællingen som forløb, test 4 og 5) samme dag.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { BØGER, bogMed, byggede, kommerSenere } from '../js/data/opdagelser.js';
import { SKÆRME } from '../js/skaerme.js';
import { existsSync } from 'node:fs';
import { forløbMed, forløbI } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const PROJEKT = new URL('../', import.meta.url).pathname;

// ---------- Uden browser: listen (test 1) ----------
const fejlListe = [];
const år = BØGER.map((b) => b.år);
if (BØGER.length !== 10) fejlListe.push(`${BØGER.length} bøger`);
if (år.some((a, i) => i && a < år[i - 1])) fejlListe.push('ikke i årets rækkefølge');
if (new Set(BØGER.map((b) => b.id)).size !== 10) fejlListe.push('to bøger med samme id');
for (const b of BØGER) {
  if (!b.navn || !b.kort || !b.ejefald || !b.om || !(b.år > 1500 && b.år < 2000)) fejlListe.push(`${b.id}: felterne`);
  if (!kommerSenere(b).endsWith('kommer senere.')) fejlListe.push(`${b.id}: linjen`);
}
for (const b of byggede()) {
  if (!b.titel || !b.stil?.papir || !b.stil?.blæk || !b.stil?.skrift || !b.stil?.ryg) fejlListe.push(`${b.id}: stilen`);
  if (!existsSync(PROJEKT + b.portræt)) fejlListe.push(`${b.id}: portrættet findes ikke`);
  const t = await b.tekster();
  if (t.OPSLAG[0]?.slags !== 'forside' || !t.FORSIDE?.spørgsmål || !t.FORSIDE?.portrætAlt) fejlListe.push(`${b.id}: forsiden`);
  if (!t.OPSLAG.every((o) => ['forside', 'scene', 'tom'].includes(o.slags) && o.id)) fejlListe.push(`${b.id}: et opslag af ukendt slags`);
}
tjek('listen: ti bøger i årets rækkefølge med navn, år og linje, og en bygget bog har titel, stil, portræt og forside', !fejlListe.length, fejlListe.join('; '));
tjek('Huygens er den eneste byggede bog, og delen står i Biblioteket efter Gåderne med status prøve',
  byggede().map((b) => b.id).join() === 'huygens' && bogMed('huygens').år === 1656
  && SKÆRME.findIndex((s) => s.id === 'opdagelser') === SKÆRME.findIndex((s) => s.id === 'gaader') + 1
  && SKÆRME.find((s) => s.id === 'opdagelser')?.status === 'prøve' && SKÆRME.find((s) => s.id === 'opdagelser')?.verden === 'biblioteket');
// Fortællingens forløb (H2, test 4 i planen): tre trin med kapitel, gæt og korte tekster, og fagordene findes i Ordbogen
{
  const fl = forløbMed(bogMed('huygens').forløb);
  const ord = (t) => (t ?? '').split(/\s+/).filter(Boolean).length;
  const fejlFl = [];
  if (!fl || fl.del !== 'opdagelser' || forløbI('opdagelser').length !== 1) fejlFl.push('forløbet findes ikke i listen');
  else {
    if (fl.trin.map((t) => t.id).join() !== 'linse,naetter,kanten') fejlFl.push('trinene');
    for (const t of fl.trin) {
      if (!t.kapitel || ord(t.spørg) > 16 || ord(t.så) > 22 || (t.gæt?.valg.length ?? 0) < 2) fejlFl.push(`${t.id}: teksterne`);
      for (const o of t.ord ?? []) if (!ORDBOG.some((x) => x.id === o)) fejlFl.push(`${t.id}: ordet ${o} mangler i Ordbogen`);
    }
    if (!fl.kernesætning.includes('tynd, flad ring')) fejlFl.push('kernesætningen');
  }
  const t = await bogMed('huygens').tekster();
  if (t.OPSLAG.find((o) => o.id === 'fortaelling')?.slags !== 'scene' || !t.FRI?.igen) fejlFl.push('opslaget');
  tjek('fortællingen: forløbet "Saturns ører" har tre trin med kapitel, gæt og korte tekster, og "linse" står i Ordbogen', !fejlFl.length, fejlFl.join('; '));
}
tjek('skriften og licensen ligger i fonts/', existsSync(PROJEKT + 'fonts/atomlab-fell.woff2') && existsSync(PROJEKT + 'fonts/OFL.txt'));

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const nySide = async (opsætning, hash) => {
  const ctx = await b.newContext(opsætning);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push('error: ' + m.text()); });
  await page.goto(`${ADRESSE}/?test${hash}`);
  await page.waitForFunction(() => window.atomlabTest, null, { timeout: 20000 });
  return { page, ctx };
};
const vent = (page, f, a, ms = 8000) => page.waitForFunction(f, a, { timeout: ms }).then(() => true, () => false);
const påHylden = () => window.atomlabTest?.opdagelser && !document.getElementById('opdHyldeSide').hidden && document.querySelector('#opdagelser:not(.skjult)');

// Fra menuen: delen hentes først, når den åbnes, og hylden har alle ti
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '');
  const førHentet = await page.evaluate(() => atomlabTest.hentet('opdagelser'));
  await page.evaluate(() => { location.hash = '#opdagelser'; });
  const hylde = await vent(page, påHylden, null, 15000);
  const ryg = await page.evaluate(() => atomlabTest.opdagelser.hylde());
  tjek('fra menuen: hentes først, når delen åbnes, og hylden har ti bøger i årets rækkefølge (Huygens med omslaget frem)',
    !førHentet && hylde && ryg.length === 10 && ryg.filter((r) => r.bygget).map((r) => r.id).join() === 'huygens' && ryg[0].id === 'tycho' && ryg[9].id === 'lehmann', JSON.stringify(ryg));
  // En grå ryg åbner ingen bog, men viser én linje
  await page.click('#opdHylde [data-bog="roemer"]');
  const linje = await page.textContent('#opdLinje');
  tjek('en grå ryg viser kun linjen og åbner ingen bog', linje === kommerSenere(bogMed('roemer')) && (await page.evaluate(() => atomlabTest.opdagelser.vist())) === null, linje);
  // Huygens' omslag åbner forsiden
  await page.click('#opdHylde [data-bog="huygens"]');
  const åben = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const forside = await page.evaluate(() => ({
    titel: document.querySelector('#opdBog .bog-titel')?.textContent,
    portræt: document.querySelector('#opdBog .bog-portræt img')?.getAttribute('src'),
    begynd: !!document.querySelector('#opdBog .bog-begynd'),
    hylde: !document.getElementById('opdHyldeSide').hidden,
  }));
  tjek('omslaget åbner forsiden med spørgsmålet, portrættet og "Begynd", og hylden er væk (én ting ad gangen)',
    åben && forside.titel === 'Hvorfor havde Saturn ører?' && forside.portræt?.endsWith('huygens.webp') && forside.begynd && !forside.hylde, JSON.stringify(forside));
  // Bladringen: "Begynd", "›", "‹", piletasterne, grænserne og Esc
  await page.click('#opdBog .bog-begynd');
  const n1 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  await page.keyboard.press('ArrowRight');
  const n3 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  await page.keyboard.press('ArrowLeft');
  const n2 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  const antal = await page.evaluate(() => atomlabTest.opdagelser.vist().antal);
  for (let i = 0; i < antal + 2; i++) await page.evaluate(() => atomlabTest.opdagelser.bladr(1));
  const sidst = await page.evaluate(() => ({ nr: atomlabTest.opdagelser.vist().nr, næste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled, tal: document.querySelector('#opdBog .bog-sidetal').textContent }));
  await page.keyboard.press('Escape');
  const tilbage = await vent(page, påHylden);
  tjek('bladring: "Begynd", "›" og piletasterne går frem og tilbage, den sidste side stopper (› grå), og Esc går til hylden',
    n1 === 1 && n3 === 3 && n2 === 2 && sidst.nr === antal - 1 && sidst.næste && sidst.tal === `${antal} / ${antal}` && tilbage, JSON.stringify({ n1, n2, n3, sidst, tilbage }));
  await ctx.close();
}

// Fortællingen som forløb (H2): starter efter "Begynd" første gang, bladringen er låst imens, "Spring over" gør opslaget
// til et laboratorium, og næste gang starter det ikke af sig selv (test 4). Handlingerne i de tre trin gennem
// testadgangen: linsen, nætterne og ringen fra kanten med løftet (test 5).
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'saturns-oerer');
  await page.keyboard.press('ArrowRight');
  const første = await O(() => ({
    kører: atomlabTest.opdagelser.forløb.kører(), trin: atomlabTest.opdagelser.forløb.trin(), opslag: atomlabTest.opdagelser.vist().opslag,
    låst: atomlabTest.opdagelser.låst(), bund: getComputedStyle(document.querySelector('#opdBog .bog-bund')).display,
    kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent, scene: atomlabTest.opdagelser.scene()?.tilstand().trin,
  }));
  // "Spring over": opslaget bliver et laboratorium, og bladringen virker igen
  await page.click('.forløb-linje .fl-spring');
  await vent(page, () => !atomlabTest.opdagelser.forløb.kører());
  const sprunget = await O(() => ({ låst: atomlabTest.opdagelser.låst(), scene: atomlabTest.opdagelser.scene()?.tilstand().trin, igen: !!document.querySelector('#opdBog .hs-igen'), kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent }));
  // Næste gang bladrer "Begynd" bare til fortællingen
  await O(() => atomlabTest.opdagelser.hylden());
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await page.waitForTimeout(300);
  const anden = await O(() => ({ kører: atomlabTest.opdagelser.forløb.kører(), opslag: atomlabTest.opdagelser.vist().opslag, scene: atomlabTest.opdagelser.scene()?.tilstand().trin }));
  tjek('fortællingen starter efter "Begynd" første gang (låst bladring, kapitlet "Haag, 1655"), "Spring over" giver laboratoriet, og anden gang starter den ikke',
    første.kører === 'saturns-oerer' && første.trin === 'linse' && første.opslag === 'fortaelling' && første.låst && første.bund === 'none' && første.kapitel === 'Haag, 1655' && første.scene === 'linse'
    && !sprunget.låst && sprunget.scene === 'fri' && sprunget.igen && sprunget.kapitel === 'Saturns ører'
    && anden.kører === null && anden.opslag === 'fortaelling' && anden.scene === 'fri', JSON.stringify({ første, sprunget, anden }));

  // "Fortæl det igen" starter forløbet, og handlingerne kan gøres gennem testadgangen
  await page.click('#opdBog .hs-igen');
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'linse');
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 6000);
  const gæt = async () => { await page.click('.forløb-linje .fl-gæt >> nth=0'); return fase('gør'); };
  const S = (f, a) => O(f, a);
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().slib(0.5));
  const halv = await S(() => atomlabTest.opdagelser.scene().tilstand().skarp);
  await S(() => atomlabTest.opdagelser.scene().slib(1));
  const linse = (await fase('så')) && halv === 0.5;
  await page.click('.forløb-linje .fl-næste');
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().nat(15));
  await page.waitForTimeout(500);
  const ikkeEndnu = await S(() => atomlabTest.opdagelser.forløb.fase());
  await S(() => atomlabTest.opdagelser.scene().nat(16));
  const nætter = (await fase('så')) && ikkeEndnu === 'gør' && (await vent(page, () => atomlabTest.opdagelser.scene().tilstand().navn))
    && (await O(() => document.querySelector('#opdBog .hs-nat-tekst')?.textContent.startsWith('10. april 1655')));
  await page.click('.forløb-linje .fl-næste');
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().drej(8));
  await page.waitForTimeout(400);
  const lyser = await S(() => atomlabTest.opdagelser.scene().tilstand().lyser);
  await S(() => atomlabTest.opdagelser.scene().drej(20));
  await S(() => atomlabTest.opdagelser.scene().drej(-2)); // et hurtigt træk over kanten tæller som kanten
  const kanten = (await fase('så')) && lyser === 'hevelius' && (await S(() => atomlabTest.opdagelser.scene().tilstand().løft)) === 1;
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, vej: document.querySelector('.forløb-linje .fl-vej')?.textContent }));
  await page.click('.forløb-linje .fl-vej');
  await page.waitForTimeout(300);
  const videre = await O(() => ({ opslag: atomlabTest.opdagelser.vist().opslag, låst: atomlabTest.opdagelser.låst(), kører: atomlabTest.opdagelser.forløb.kører() }));
  tjek('trinene: linsen bliver skarp, Titan er tilbage efter 16 nætter (10. april 1655), og ringen løfter sig ved kanten efter tavlens tegninger',
    linse && nætter && kanten, JSON.stringify({ linse, halv, nætter, ikkeEndnu, kanten, lyser }));
  tjek('"Det så du" viser kernesætningen, og "Videre i bogen" bladrer videre med bladringen låst op',
    slut.tekst?.includes('tynd, flad ring') && slut.vej?.startsWith('Videre i bogen') && videre.opslag === 'gaaden' && !videre.låst && videre.kører === null, JSON.stringify({ slut, videre }));
  // Esc midt i forløbet går til hylden og stopper det
  await O(() => atomlabTest.opdagelser.bladr(-1));
  await page.click('#opdBog .hs-igen');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører());
  await page.keyboard.press('Escape');
  tjek('Esc midt i fortællingen går til hylden og stopper forløbet', (await vent(page, påHylden)) && (await O(() => atomlabTest.opdagelser.forløb.kører())) === null);
  await ctx.close();
}

// Telefon på højkant og på langs i fortællingen: lærredet har plads, skyderen og tavlens tegninger er inden for skærmen,
// og siden bliver ikke bredere end skærmen
for (const [navn, opsætning] of [
  ['telefon', { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['telefon på langs', { viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]) {
  const { page, ctx } = await nySide(opsætning, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  const mål = [];
  for (const trin of ['linse', 'naetter', 'kanten']) {
    await vent(page, (t) => atomlabTest.opdagelser.forløb.trin() === t, trin);
    await page.click('.forløb-linje .fl-gæt >> nth=0');
    await page.waitForTimeout(250);
    mål.push(await O(() => {
      const inde = (x) => x.left >= -0.5 && x.right <= innerWidth + 0.5 && x.top >= -0.5 && x.bottom <= innerHeight + 0.5;
      const c = document.querySelector('#opdBog canvas').getBoundingClientRect();
      const ting = [...document.querySelectorAll('#opdBog .hs-nat input, #opdBog .hs-tavle figure, .forløb-linje button')].map((e) => e.getBoundingClientRect());
      return { lærred: Math.round(Math.min(c.width, c.height)), inde: inde(c) && ting.every(inde), bred: document.documentElement.scrollWidth > innerWidth + 1 };
    }));
    if (trin !== 'kanten') { await O(() => atomlabTest.opdagelser.forløb.visMigNu()); await page.waitForSelector('.forløb-linje .fl-næste', { timeout: 6000 }); await page.click('.forløb-linje .fl-næste'); }
  }
  tjek(`${navn}: i fortællingen har lærredet plads (mindst 140 px), og lærredet, skyderen, tavlens tegninger og knapperne er inden for skærmen`,
    mål.length === 3 && mål.every((m) => m.lærred >= 140 && m.inde && !m.bred), JSON.stringify(mål));
  await ctx.close();
}

// Telefon og tablet på højkant som første skærm: forsiden kan ses uden at rulle (også "Begynd"), et stryg bladrer, og
// intet ligger uden for skærmen
for (const [navn, opsætning] of [
  ['telefon', { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['tablet på højkant', { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ['telefon på langs', { viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]) {
  const { page, ctx } = await nySide(opsætning, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  const hylde = await page.evaluate(() => {
    const r = [...document.querySelectorAll('#opdHylde [data-bog], #opdLinje')].map((e) => e.getBoundingClientRect());
    return r.every((x) => x.left >= 0 && x.right <= innerWidth + 0.5 && x.top >= 0 && x.bottom <= innerHeight + 0.5)
      && [...document.querySelectorAll('#opdHylde [data-bog]')].every((e) => e.getBoundingClientRect().width >= 44);
  });
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.waitForFunction(() => document.querySelector('#opdBog .bog-portræt img')?.complete, null, { timeout: 8000 }).catch(() => {});
  const bog = await page.evaluate(() => {
    const ramme = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect();
    const knap = document.querySelector('#opdBog .bog-begynd').getBoundingClientRect();
    const knapper = [...document.querySelectorAll('#opdBog .bog-bund button')].map((e) => e.getBoundingClientRect());
    const inde = (x) => x.left >= 0 && x.right <= innerWidth + 0.5 && x.bottom <= innerHeight + 0.5;
    return {
      begyndSes: knap.top >= ramme.top && knap.bottom <= ramme.bottom + 0.5,
      knapper: knapper.length === 3 && knapper.every((k) => inde(k) && k.height >= 44),
      overlap: knapper.some((a, i) => knapper.some((c, j) => i < j && a.right > c.left + 0.5 && c.right > a.left + 0.5 && a.bottom > c.top && c.bottom > a.top)),
      bred: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  // Et vandret stryg med fingeren bladrer frem
  const r = await page.evaluate(() => { const b = document.querySelector('#opdBog .bog-ramme').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  const cdp = await ctx.newCDPSession(page);
  const rør = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: r.y }] });
  await rør('touchStart', r.x + 100);
  for (let i = 1; i <= 5; i++) await rør('touchMove', r.x + 100 - i * 40);
  await rør('touchEnd');
  const strøget = await vent(page, () => atomlabTest.opdagelser.vist()?.nr === 1, null, 3000);
  tjek(`${navn}: hylden og bogens knapper er inden for skærmen (mindst 44 px), "Begynd" ses uden at rulle, og et stryg bladrer`,
    hylde && bog.begyndSes && bog.knapper && !bog.overlap && !bog.bred && strøget, JSON.stringify({ hylde, ...bog, strøget }));
  await ctx.close();
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
