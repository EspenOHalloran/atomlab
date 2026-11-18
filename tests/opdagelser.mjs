// Opdagelserne (#opdagelser, docs/plan-videnskabsfolk.md, afsnit 7): listen over bøgerne i Node (test 1, også siderne og "Om" fra H4), og i browseren,
// at delen åbner fra menuen og som første skærm uden fejl (test 3), hylden med Huygens og to grå rygge (et tryk stiller bogens spørgsmål),
// forsiden og bladringen (knapper, piletaster, stryg og Esc), og at telefon og tablet på højkant ikke får noget, der
// ligger uden for skærmen (test 8). H1 16. november 2026. H2 (fortællingen som forløb, test 4 og 5) samme dag.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { BØGER, bogMed, byggede, påHylden as hyldensBøger, rygLinje, KOMMENDE_PÅ_HYLDEN } from '../js/data/opdagelser.js';
import { SKÆRME } from '../js/skaerme.js';
import { existsSync } from 'node:fs';
import { forløbMed, forløbI } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { CITATER } from '../js/data/citater.js';
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
}
// Hylden (E20 fund 6): de byggede og højst to grå rygge, der hver stiller deres spørgsmål
const hylden = hyldensBøger();
if (hylden.filter((b) => !b.bygget).length > KOMMENDE_PÅ_HYLDEN || KOMMENDE_PÅ_HYLDEN > 2) fejlListe.push('for mange grå rygge');
for (const b of hylden.filter((x) => !x.bygget)) if (!b.spørgsmål?.endsWith('?') || /senere/i.test(rygLinje(b))) fejlListe.push(`${b.id}: spørgsmålet`);
for (const b of byggede()) {
  if (!b.titel || !b.stil?.papir || !b.stil?.blæk || !b.stil?.skrift || !b.stil?.ryg) fejlListe.push(`${b.id}: stilen`);
  if (!existsSync(PROJEKT + b.portræt)) fejlListe.push(`${b.id}: portrættet findes ikke`);
  const t = await b.tekster();
  if (t.OPSLAG[0]?.slags !== 'forside' || !t.FORSIDE?.spørgsmål || !t.FORSIDE?.portrætAlt) fejlListe.push(`${b.id}: forsiden`);
  if (!t.OPSLAG.every((o) => ['forside', 'scene', 'sider', 'om'].includes(o.slags) && o.id)) fejlListe.push(`${b.id}: et opslag af ukendt slags`);
  // "Om …" (H4): budgettet fra planen (højst to tal og fire spørgsmål, "Vil du vide mere?" og "Ærligt talt")
  if (t.OPSLAG.some((o) => o.slags === 'om') && (!t.OM?.navn || !t.OM.tal?.length || t.OM.tal.length > 2 || !t.OM.hvorfor?.length || t.OM.hvorfor.length > 4
    || t.OM.hvorfor.some((h) => !h.spørgsmål || !h.svar) || !t.OM.nørd?.punkter?.length || !t.OM.ærligt?.punkter?.length
    || (t.OM.sætninger.match(/[.!?](\s|$)/g) ?? []).length > 3)) fejlListe.push(`${b.id}: "Om" holder ikke budgettet`);
  if (t.OPSLAG.some((o) => o.slags === 'om') && t.OPSLAG.at(-1)?.slags !== 'om') fejlListe.push(`${b.id}: "Om" er ikke det sidste opslag`);
  // Bogen selv (H4): højst fire sider, der findes, og højst seks glødende steder, der ligger inden for siden
  if (t.OPSLAG.some((o) => o.slags === 'sider')) {
    const sider = t.BOGEN?.sider ?? [];
    const steder = sider.flatMap((s) => s.steder);
    if (!sider.length || sider.length > 4 || sider.some((s) => !existsSync(PROJEKT + s.fil) || !s.alt || !s.b || !s.h)) fejlListe.push(`${b.id}: siderne`);
    if (!steder.length || steder.length > 6 || steder.some((x) => !x.latin || !x.dansk || !x.felter.length
      || x.felter.some(([v, o, br, h]) => v < 0 || o < 0 || br <= 0 || h <= 0 || v + br > 100 || o + h > 100))) fejlListe.push(`${b.id}: de glødende steder`);
  }
}
tjek('listen: ti bøger i årets rækkefølge med navn og år, hylden har højst to grå rygge med et spørgsmål, og en bygget bog har titel, stil, portræt, forside og kun byggede opslag', !fejlListe.length, fejlListe.join('; '));
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
    if (fl.trin.map((t) => t.id).join() !== 'linse,naetter,kanten,annulo') fejlFl.push('trinene');
    for (const t of fl.trin) {
      if (!t.kapitel || ord(t.spørg) > 16 || ord(t.så) > 22 || (t.gæt?.valg.length ?? 0) < 2) fejlFl.push(`${t.id}: teksterne`);
      for (const o of t.ord ?? []) if (!ORDBOG.some((x) => x.id === o)) fejlFl.push(`${t.id}: ordet ${o} mangler i Ordbogen`);
    }
    if (!fl.kernesætning.includes('tynd, flad ring')) fejlFl.push('kernesætningen');
  }
  const t = await bogMed('huygens').tekster();
  if (t.OPSLAG.find((o) => o.id === 'fortaelling')?.slags !== 'scene' || !t.FRI?.igen) fejlFl.push('opslaget');
  // Introduktionen før gåden (fund 18. november 2026): højst fem sætninger, årstallet, de 62 bogstaver og ordet anagram,
  // og turens trin 4 siger, hvorfor han ikke bare fortalte det
  {
    const f = t.GÅDE.forord;
    const sætninger = (f?.tekst.match(/[.!?](\s|$)/g) ?? []).length;
    const trin4 = fl?.trin.find((x) => x.id === 'annulo');
    tjek('introduktionen til hemmeligheden: 1656, 62 bogstaver, anagram, højst fem sætninger og ingen alder på 25, og trin 4 siger, at ringen ikke ses lige nu',
      f && /1656/.test(f.sted) && /62/.test(f.tekst) && /anagram/.test(f.tekst) && sætninger <= 5 && !/\b25\b/.test(f.tekst) && /1659/.test(f.lille) && /ses ikke/.test(trin4?.spørg), JSON.stringify({ sætninger, spørg: trin4?.spørg }));
  }
  tjek('fortællingen: forløbet "Saturns ører" har fire trin med kapitel, gæt og korte tekster, og "linse" og "anagram" står i Ordbogen', !fejlFl.length, fejlFl.join('; '));
  // Test 2 (planen afsnit 7): Anagrammets 62 bogstaver passer præcist med sætningen, i 17 bunker, og ordene giver sætningen
  const A = t.ANAGRAM;
  const sorter = (x) => [...x].sort().join('');
  const iBunker = t.bunker(A.række);
  tjek('anagrammet: de 62 bogstaver i 17 bunker passer præcist med sætningen, og de otte ord giver sætningen (og den danske er den samme som citatet ved Saturn)',
    sorter(t.bogstaver(A.række)) === sorter(t.bogstaver(A.sætning)) && t.bogstaver(A.række).length === 62 && iBunker.length === 17
    && iBunker.reduce((n, [, k]) => n + k, 0) === 62 && A.ord.length === 8 && t.bogstaver(A.ord.map((o) => o.latin).join('')).join('') === t.bogstaver(A.sætning).join('')
    && A.ord.every((o) => o.dansk) && A.ord[0].latin === A.nøgle && A.dansk === CITATER.huygensSaturn.tekst, JSON.stringify(iBunker));
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
  tjek('fra menuen: hentes først, når delen åbnes, og hylden har Huygens med omslaget frem og kun to grå rygge (Tycho og Rømer)',
    !førHentet && hylde && ryg.map((r) => r.id).join() === 'tycho,huygens,roemer' && ryg.filter((r) => r.bygget).map((r) => r.id).join() === 'huygens', JSON.stringify(ryg));
  // En grå ryg åbner ingen bog, men stiller bogens spørgsmål
  await page.click('#opdHylde [data-bog="roemer"]');
  const linje = await page.textContent('#opdLinje');
  tjek('en grå ryg stiller sit spørgsmål og åbner ingen bog', linje === rygLinje(bogMed('roemer')) && linje.endsWith('?') && (await page.evaluate(() => atomlabTest.opdagelser.vist())) === null, linje);
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
  await page.keyboard.press('ArrowLeft');
  const n0 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  await page.keyboard.press('ArrowRight');
  const n2 = await page.evaluate(() => atomlabTest.opdagelser.vist().nr);
  const antal = await page.evaluate(() => atomlabTest.opdagelser.vist().antal);
  for (let i = 0; i < antal + 2; i++) await page.evaluate(() => atomlabTest.opdagelser.bladr(1));
  const sidst = await page.evaluate(() => ({ nr: atomlabTest.opdagelser.vist().nr, næste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled, tal: document.querySelector('#opdBog .bog-sidetal').textContent }));
  await page.keyboard.press('Escape');
  const tilbage = await vent(page, påHylden);
  tjek('bladring: "Begynd", "›" og piletasterne går frem og tilbage, den sidste side stopper (› grå), og Esc går til hylden',
    n1 === 1 && n0 === 0 && n2 === Math.min(2, antal - 1) && sidst.nr === antal - 1 && sidst.næste && sidst.tal === `${antal} / ${antal}` && tilbage, JSON.stringify({ n0, n1, n2, sidst, tilbage }));
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
    låst: atomlabTest.opdagelser.låst(), bund: [getComputedStyle(document.getElementById('opdTilHylden')).display, getComputedStyle(document.querySelector('#opdBog .bog-pil')).display].join(),
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
  tjek('fortællingen starter efter "Begynd" første gang (låst bladring, "‹ Hylden" fremme, kapitlet "Haag, 1655"), "Udforsk selv" giver laboratoriet, og anden gang starter den ikke',
    første.kører === 'saturns-oerer' && første.trin === 'linse' && første.opslag === 'fortaelling' && første.låst && /^(?!none).*,none$/.test(første.bund) && første.kapitel === 'Haag, 1655' && første.scene === 'linse'
    && !sprunget.låst && sprunget.scene === 'fri' && sprunget.igen && sprunget.kapitel === 'Saturns ører'
    && anden.kører === null && anden.opslag === 'fortaelling' && anden.scene === 'fri', JSON.stringify({ første, sprunget, anden }));

  // "Fortæl det igen" starter forløbet, og handlingerne kan gøres gennem testadgangen
  await page.click('#opdBog .hs-igen');
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'linse');
  const fase = (f) => vent(page, (f) => atomlabTest.opdagelser.forløb.fase() === f, f, 6000);
  const gæt = async () => { await page.click('.forløb-linje .fl-gæt >> nth=0'); return fase('gør'); };
  const S = (f, a) => O(f, a);
  // Trin 1: Glasset virker, mens man gætter (stilguiden B1 og B4): At gnide lader gættet tone væk
  await S(() => atomlabTest.opdagelser.scene().slib(0.5));
  const halv = await S(() => ({ skarp: atomlabTest.opdagelser.scene().tilstand().skarp, fase: atomlabTest.opdagelser.forløb.fase() }));
  await S(() => atomlabTest.opdagelser.scene().slib(1));
  const linse = (await fase('så')) && halv.skarp === 0.5 && halv.fase === 'gør';
  await page.click('.forløb-linje .fl-næste');
  // Trin 2: Hvert gæt får sit eget svar under Så. Forbi målet giver et vink med det samme, og nat 15 falder selv på 16
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().nat(19));
  const forbi = await O(() => document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '');
  await S(() => atomlabTest.opdagelser.scene().nat(14));
  await page.waitForTimeout(600);
  const ikkeEndnu = await S(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), vink: Boolean(document.querySelector('.forløb-linje .fl-vink')) }));
  await S(() => atomlabTest.opdagelser.scene().nat(15));
  const nætter = (await fase('så')) && ikkeEndnu.fase === 'gør' && !ikkeEndnu.vink && /16 nætter/.test(forbi)
    && (await S(() => atomlabTest.opdagelser.scene().tilstand().nat)) === 16 && (await vent(page, () => atomlabTest.opdagelser.scene().tilstand().navn))
    && (await O(() => document.querySelector('#opdBog .hs-nat-tekst')?.textContent.startsWith('10. april 1655')));
  const svar = await O(() => document.querySelector('.forløb-linje .fl-svar')?.textContent ?? '');
  // Under Så virker skyderen stadig (B1)
  await S(() => atomlabTest.opdagelser.scene().nat(5));
  const legVidere = (await S(() => atomlabTest.opdagelser.scene().tilstand().nat)) === 5;
  await page.click('.forløb-linje .fl-næste');
  // Trin 3: helt åben giver et vink, og tæt på kanten (2,5°) tæller. Bagefter kan den skarpe ring drejes under Så
  await gæt();
  await S(() => atomlabTest.opdagelser.scene().drej(8));
  await page.waitForTimeout(400);
  const lyser = await S(() => atomlabTest.opdagelser.scene().tilstand().lyser);
  await S(() => atomlabTest.opdagelser.scene().drej(40));
  const helt = await O(() => document.querySelector('.forløb-linje .fl-vink')?.textContent ?? '');
  await S(() => atomlabTest.opdagelser.scene().drej(2.5));
  const kanten = (await fase('så')) && lyser === 'hevelius' && /Mere åben/.test(helt) && (await S(() => atomlabTest.opdagelser.scene().tilstand().løft)) === 1;
  await vent(page, () => atomlabTest.opdagelser.scene().tilstand().løftet);
  await S(() => atomlabTest.opdagelser.scene().drej(-10));
  const drejet = (await S(() => atomlabTest.opdagelser.scene().tilstand().B)) === -10;
  tjek('stien i fortællingen: scenen virker, mens man gætter, og under Så, forbi målet giver et vink, tæt på tæller, og gættet får sit eget svar',
    linse && halv.fase === 'gør' && /følge med Saturn/.test(svar) && legVidere && drejet, JSON.stringify({ halv, svar, legVidere, drejet, forbi, helt }));
  await page.click('.forløb-linje .fl-næste');
  // Trin 4 (H3): bunkerne virker, mens man gætter. Et forkert bogstav tæller ikke, ANNULO lægges på plads, og resten af
  // sætningen flyver på plads, til alle 62 bogstaver er brugt
  await vent(page, () => atomlabTest.opdagelser.forløb.trin() === 'annulo');
  const forkert = await S(() => atomlabTest.opdagelser.scene().bogstav('c'));
  const efterForkert = await S(() => ({ fase: atomlabTest.opdagelser.forløb.fase(), ag: atomlabTest.opdagelser.scene().tilstand().anagram, kapitel: document.querySelector('#opdBog .bog-kapitel')?.textContent, bunker: document.querySelectorAll('#opdBog .ag-bunke').length, lærred: getComputedStyle(document.querySelector('#opdBog .hs-lærred')).display }));
  for (const b of 'annulo') await S((b) => atomlabTest.opdagelser.scene().bogstav(b), b);
  const annulo = await fase('så');
  const ag = await S(() => ({ ...atomlabTest.opdagelser.scene().tilstand().anagram, ord: [...document.querySelectorAll('#opdBog .ag-ord')].map((o) => o.querySelector('.ag-latin').textContent).join(' '), så: document.querySelector('.forløb-linje .fl-så')?.textContent }));
  tjek('trin 4: 17 bunker i stedet for lærredet, et forkert bogstav ryster bare, og efter ANNULO flyver resten på plads, til alle 62 er brugt',
    !forkert && efterForkert.fase === 'gør' && efterForkert.ag.tal === 62 && efterForkert.bunker === 17 && efterForkert.lærred === 'none' && efterForkert.kapitel === 'Hemmeligheden'
    && annulo && ag.hel && ag.tal === 0 && ag.fundet === 6 && ag.ord.startsWith('Annulo cingitur') && /anagram/i.test(ag.så), JSON.stringify({ forkert, efterForkert, ag }));
  await page.click('.forløb-linje .fl-næste');
  await fase('slut');
  const slut = await O(() => ({ tekst: document.querySelector('.forløb-linje .fl-så')?.textContent, lille: document.querySelector('.forløb-linje .fl-lille')?.textContent, veje: [...document.querySelectorAll('.forløb-linje .fl-vej')].map((v) => v.textContent), vej: [...document.querySelectorAll('.forløb-linje .fl-vej')].pop()?.textContent }));
  // Den tredje vej bladrer til "Bogen fra 1659" (H4), og tilbage i fortællingen står laboratoriet med ringen
  await page.click('.forløb-linje .fl-vej >> text=Bladr i bogen fra 1659');
  await page.waitForTimeout(300);
  const tilBogen = await O(() => ({ opslag: atomlabTest.opdagelser.vist().opslag, låst: atomlabTest.opdagelser.låst(), kører: atomlabTest.opdagelser.forløb.kører() }));
  await O(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'fortaelling' && v.bladr(-1)); });
  await page.waitForTimeout(200);
  const videre = { ...tilBogen, lab: await O(() => atomlabTest.opdagelser.scene()?.tilstand().lab) };
  // Laboratoriet har de tre kapitler: "Den lille prik" giver nætterne, og nat 16 viser navnet Titan
  const kapitler = await O(() => [...document.querySelectorAll('#opdBog .hs-kapitel')].map((k) => k.textContent));
  await page.click('#opdBog .hs-kapitel >> text=Den lille prik');
  await S(() => atomlabTest.opdagelser.scene().nat(16));
  const lab = await S(() => atomlabTest.opdagelser.scene().tilstand());
  tjek('laboratoriet: tre kapitler (Linsen, Den lille prik og Ringen), og "Den lille prik" giver nætterne med Titan',
    kapitler.join('|') === 'Linsen|Den lille prik|Ringen' && lab.trin === 'naetter' && lab.lab === 'naetter' && lab.navn, JSON.stringify({ kapitler, lab }));
  tjek('trinene: linsen bliver skarp, Titan er tilbage efter 16 nætter (10. april 1655), og ringen løfter sig ved kanten efter tavlens tegninger',
    linse && nætter && kanten, JSON.stringify({ linse, halv, nætter, ikkeEndnu, kanten, lyser }));
  tjek('"Det så du" viser kernesætningen, sætningen fra 1659 og tre veje, og "Bladr i bogen fra 1659" åbner bogen selv med bladringen låst op (tilbage i fortællingen står ringen)',
    slut.tekst?.includes('tynd, flad ring') && slut.lille?.startsWith('I 1659') && slut.veje.length === 3 && slut.veje[0].startsWith('Se ringen forsvinde ved Saturn') && slut.vej?.startsWith('Bladr i bogen fra 1659') && videre.opslag === 'bogen' && videre.lab === 'ringen' && !videre.låst && videre.kører === null, JSON.stringify({ slut, videre }));
  // Esc midt i forløbet går til hylden og stopper det
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
    if (trin !== 'kanten') { await O(() => atomlabTest.opdagelser.forløb.visMigNu()); await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 8000); await page.click('.forløb-linje .fl-næste'); }
  }
  tjek(`${navn}: i fortællingen har lærredet plads (mindst 140 px), og lærredet, skyderen, tavlens tegninger og knapperne er inden for skærmen`,
    mål.length === 3 && mål.every((m) => m.lærred >= 140 && m.inde && !m.bred), JSON.stringify(mål));
  await ctx.close();
}

// "Hemmeligheden" (H3 trin C): Hele anagrammet som otte brikker. En forkert brik tæller ikke, de rigtige tæller bunkerne
// ned til 0, løsningen huskes (✓), og "Lav dit eget anagram" sorterer bogstaverne som Huygens
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  const åbnGåden = async () => {
    await O(() => atomlabTest.opdagelser.åbn('huygens'));
    await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
    await O(() => { atomlabTest.opdagelser.bladr(1); atomlabTest.opdagelser.bladr(1); });
    return vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'gaaden' && atomlabTest.opdagelser.scene()?.tilstand);
  };
  await åbnGåden();
  const t = await bogMed('huygens').tekster();
  // Introduktionen før gåden (fund 18. november 2026): først bogteksten med "Prøv gåden ›", så gåden
  const forord = await O(() => ({ forord: atomlabTest.opdagelser.scene().tilstand().forord, skjult: document.querySelector('#opdBog .ag-udfordring').hidden, tekst: document.querySelector('#opdBog .ag-forord-tekst')?.textContent ?? '' }));
  await page.click('#opdBog .ag-forord-knap');
  const efterForord = await O(() => ({ forord: atomlabTest.opdagelser.scene().tilstand().forord, ses: getComputedStyle(document.querySelector('#opdBog .ag-udfordring')).display !== 'none' }));
  const start = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), brikker: document.querySelectorAll('#opdBog .ag-brik').length, bunker: document.querySelectorAll('#opdBog .ag-bunke').length, knapper: document.querySelectorAll('#opdBog button.ag-bunke').length }));
  await O(() => atomlabTest.opdagelser.scene().læg('tenui', 0));
  const forkert = await O(() => atomlabTest.opdagelser.scene().tilstand());
  for (const [i, o] of t.ANAGRAM.ord.entries()) await O(([l, n]) => atomlabTest.opdagelser.scene().læg(l, n), [o.latin, i]);
  const slut = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), status: document.querySelector('#opdBog .ag-status')?.textContent, gemt: localStorage.getItem('atomlabOpdagelserGaader'), eget: !!document.querySelector('#opdBog .ag-eget-knap') }));
  const eget = await O(() => atomlabTest.opdagelser.scene().eget('Saturn har en ring!'));
  await O(() => atomlabTest.opdagelser.hylden());
  await åbnGåden();
  const igen = await O(() => ({ ...atomlabTest.opdagelser.scene().tilstand(), status: document.querySelector('#opdBog .ag-status')?.textContent, eget: !!document.querySelector('#opdBog .ag-eget-knap') }));
  tjek('"Hemmeligheden": otte brikker og 17 bunker, der ikke er knapper, en forkert brik tæller ikke, og alle otte giver "Alle 62 er brugt"',
    start.brikker === 8 && start.bunker === 17 && start.knapper === 0 && start.tal === 62 && forkert.lagt === 0 && forkert.tal === 62
    && slut.lagt === 8 && slut.tal === 0 && slut.hel && slut.status === 'Alle 62 er brugt. Det passer.', JSON.stringify({ start, forkert, slut }));
  tjek('"Hemmeligheden" starter med introduktionen (Haag 1656, anagrammet og grunden), og "Prøv gåden" viser gåden',
    forord.forord && forord.skjult && /anagram/.test(forord.tekst) && /først/.test(forord.tekst) && !efterForord.forord && efterForord.ses, JSON.stringify({ forord, efterForord }));
  tjek('løsningen huskes (✓ næste gang), og "Lav dit eget anagram" sorterer bogstaverne som Huygens uden at gemme noget',
    /huygens/.test(slut.gemt ?? '') && slut.eget && eget === 'aa e g h i nnn rrr s t u (15)' && /✓/.test(igen.status) && igen.eget && igen.lagt === 0, JSON.stringify({ gemt: slut.gemt, eget, igen }));
  await ctx.close();
}

// Gør det selv (test 6, H3 trin D): "Se ringen forsvinde ved Saturn" fra "Det så du" åbner Solsystemet ved Saturn fra
// kanten med linjen og ringenes side (med "Hvordan ved vi det?"), og citatets knap "Læs Huygens' bog" fører tilbage
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '&forloebstart#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.click('#opdBog .bog-begynd');
  await vent(page, () => atomlabTest.opdagelser.forløb.kører() === 'saturns-oerer');
  for (let i = 0; i < 4; i++) {
    await O(() => atomlabTest.opdagelser.forløb.visMigNu());
    await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'så', null, 10000);
    await page.click('.forløb-linje .fl-næste');
  }
  await vent(page, () => atomlabTest.opdagelser.forløb.fase() === 'slut');
  await page.click('.forløb-linje .fl-vej >> text=Se ringen forsvinde ved Saturn');
  const fremme = await vent(page, () => location.hash === '#solsystem' && atomlabTest.solsystem?.sted?.() === 'kanten' && atomlabTest.solsystem.fase()?.titel, null, 40000);
  const ved = await O(() => ({ sted: atomlabTest.solsystem.sted(), fase: atomlabTest.solsystem.fase(), emner: atomlabTest.solsystem.side()?.emner.map((e) => e.titel), hvorfor: [...document.querySelectorAll('#solsystem button.hvorfor')].map((b) => b.dataset.hvorfor), bog: !!document.querySelector('#solsystem [data-gaa="opdagelser:huygens"]') }));
  tjek('Gør det selv: "Se ringen forsvinde ved Saturn" åbner Saturn fra kanten med linjen, ringenes side og "Hvordan ved vi, at det er en ring?"',
    fremme && ved.sted === 'kanten' && /kanten/.test(ved.fase?.tekst ?? '') && ved.emner?.includes('Hvor tynde er ringene?') && ved.hvorfor.includes('saturnRing') && ved.bog, JSON.stringify(ved));
  await page.click('#solsystem [data-gaa="opdagelser:huygens"]');
  const tilbage = await vent(page, () => location.hash === '#opdagelser' && atomlabTest.opdagelser?.vist()?.bog === 'huygens', null, 15000);
  tjek('citatets knap "Læs Huygens\' bog" åbner bogen i Opdagelserne', tilbage);
  await ctx.close();
}

// Bogen selv (test 7, H4): siderne hentes først, når opslaget "Bogen fra 1659" åbnes, et glødende sted på s. 47 viser
// latin og dansk, og "Om Huygens" er det sidste opslag med fire "Hvorfor?" og "Vil du vide mere?" og "Ærligt talt" lukkede
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#opdagelser');
  const O = (f, a) => page.evaluate(f, a);
  const sider = [];
  page.on('request', (r) => { const m = r.url().match(/huygens-(tavle|s\d+)\.webp/); if (m) sider.push(m[1]); });
  await vent(page, påHylden, null, 15000);
  await O(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  for (let i = 0; i < 2; i++) await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const førBogen = { opslag: await O(() => atomlabTest.opdagelser.vist().opslag), sider: sider.length };
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const hentet = await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'bogen' && atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const faner = await O(() => [...document.querySelectorAll('#opdBog .bs-fane')].map((f) => f.textContent));
  await page.click('#opdBog .bs-fane >> text=s. 47');
  await vent(page, () => atomlabTest.opdagelser.scene()?.side() === 's47' && atomlabTest.opdagelser.scene().hentet(), null, 15000);
  const glød = await O(() => [...document.querySelectorAll('#opdBog .bs-glød')].map((g) => g.dataset.sted));
  await page.click('#opdBog .bs-glød[data-sted="saetningen"] >> nth=1');
  const forklaring = await O(() => ({
    sted: atomlabTest.opdagelser.scene().sted(),
    latin: document.querySelector('#opdBog .bs-forklaring .bs-latin')?.textContent,
    dansk: document.querySelector('#opdBog .bs-forklaring .bs-dansk')?.textContent,
    lyser: [...document.querySelectorAll('#opdBog [data-sted="saetningen"]')].every((k) => k.getAttribute('aria-pressed') === 'true'),
    linjer: document.querySelectorAll('#opdBog .bs-linjer .bs-række').length,
    linjerÅben: document.querySelector('#opdBog .bs-linjer')?.open,
    knapper: [...document.querySelectorAll('#opdBog .bs-sted-knap')].every((k) => k.getBoundingClientRect().height >= 44),
  }));
  tjek('bogen selv: siderne hentes først ved opslaget "Bogen fra 1659" (fire faner), og et glødende sted på s. 47 viser latin og dansk med "Linje for linje" lukket',
    førBogen.opslag === 'gaaden' && førBogen.sider === 0 && hentet && faner.join('|') === 'Tavlen|s. 16|s. 47|s. 48' && glød.filter((g, i, a) => a.indexOf(g) === i).join() === 'dato,raekken,saetningen'
    && forklaring.sted === 'saetningen' && forklaring.latin?.includes('Annulo cingitur') && forklaring.dansk?.includes('tynd, flad ring') && forklaring.lyser
    && forklaring.linjer === 8 && forklaring.linjerÅben === false && forklaring.knapper, JSON.stringify({ førBogen, sider, faner, glød, forklaring }));
  // Bladrer man væk og tilbage, står s. 47 og stedet der stadig, og siden hentes ikke igen
  const antal = sider.length;
  await page.click('#opdBog .bog-pil[data-bladr="1"]');
  const om = await O(() => ({
    opslag: atomlabTest.opdagelser.vist().opslag, nr: atomlabTest.opdagelser.vist().nr, ialt: atomlabTest.opdagelser.vist().antal,
    næste: document.querySelector('#opdBog .bog-pil[data-bladr="1"]').disabled,
    tal: document.querySelectorAll('#opdBog .bo-tal b').length, hvorfor: document.querySelectorAll('#opdBog [data-bo-hvorfor]').length,
    lag: atomlabTest.opdagelser.scene().lag(),
  }));
  await page.click('#opdBog [data-bo-hvorfor="1"]');
  const kort = await O(() => document.querySelector('.hvorfor-kort:not(.skjult) .hk-titel')?.textContent);
  await page.click('#opdBog .bog-pil[data-bladr="-1"]');
  const tilbage = await O(() => ({ side: atomlabTest.opdagelser.scene()?.side(), sted: atomlabTest.opdagelser.scene()?.sted(), kort: !!document.querySelector('.hvorfor-kort:not(.skjult)') }));
  await page.waitForTimeout(300);
  tjek('"Om Huygens" er det sidste opslag: to tal, fire "Hvorfor?" (et kort åbner og lukker ved bladring), "Vil du vide mere?" og "Ærligt talt" lukkede, og bogen husker s. 47',
    om.opslag === 'om' && om.nr === om.ialt - 1 && om.næste && om.tal === 2 && om.hvorfor === 4 && om.lag.map((l) => l.titel).join() === 'Vil du vide mere?,Ærligt talt' && om.lag.every((l) => !l.åben)
    && kort === 'Hvorfor et anagram?' && tilbage.side === 's47' && tilbage.sted === 'saetningen' && !tilbage.kort && sider.length === antal, JSON.stringify({ om, kort, tilbage, antal, sider: sider.length }));
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
  // "Bogen fra 1659": fanerne og stederne er knapper på mindst 44 px inden for skærmen, og intet går ud til siden
  await page.evaluate(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'bogen' && v.bladr(1)); atomlabTest.opdagelser.scene().visSide(2); });
  await vent(page, () => atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
  const sider = await page.evaluate(() => {
    const k = [...document.querySelectorAll('#opdBog :is(.bs-fane, .bs-sted-knap)')].map((e) => e.getBoundingClientRect());
    const b = document.querySelector('#opdBog .bs-billede').getBoundingClientRect();
    return { knapper: k.length === 7 && k.every((x) => x.height >= 44 && x.left >= 0 && x.right <= innerWidth + 0.5), billede: b.width >= 120 && b.right <= innerWidth + 0.5, bred: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  tjek(`${navn}: i "Bogen fra 1659" er fanerne og stederne mindst 44 px og inden for skærmen, og siden går ikke ud til siden`, sider.knapper && sider.billede && !sider.bred, JSON.stringify(sider));
  await ctx.close();
}

// Brede og høje pc-skærme (fund 18. november 2026, ultrabred skærm): På tavlen fik panelet til højre 0 px, fordi siden
// fyldte bogens højde og kun var begrænset af skærmens bredde. Nu har panelet plads på alle fire sider, og intet går ud
// over bogens kant
for (const [w, h] of [[3440, 1440], [2560, 1080], [1920, 1080], [1280, 720]]) {
  const { page, ctx } = await nySide({ viewport: { width: w, height: h } }, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  await page.evaluate(() => { const v = atomlabTest.opdagelser; while (v.vist().opslag !== 'bogen' && v.bladr(1)); });
  const mål = [];
  for (let i = 0; i < 4; i++) {
    await page.evaluate((i) => atomlabTest.opdagelser.scene().visSide(i), i);
    await vent(page, () => atomlabTest.opdagelser.scene()?.hentet(), null, 15000);
    mål.push(await page.evaluate(() => {
      const r = (q) => document.querySelector(`#opdBog ${q}`).getBoundingClientRect();
      const ramme = r('.bog-ramme'), billede = r('.bs-billede'), tekst = r('.bs-tekst');
      return { side: atomlabTest.opdagelser.scene().side(), tekst: Math.round(tekst.width), inde: billede.right <= ramme.right && tekst.right <= ramme.right + 0.5 && billede.left >= ramme.left, forhold: +(billede.width / billede.height).toFixed(2) };
    }));
  }
  tjek(`${w}×${h}: i "Bogen fra 1659" har panelet ved siden af siden mindst 260 px på alle fire sider (også tavlen), og siden går ikke ud over bogen`,
    mål.every((m) => m.tekst >= 260 && m.inde) && Math.abs(mål[0].forhold - 1000 / 1069) < 0.02, JSON.stringify(mål));
  await ctx.close();
}

// Siden vendes om ryggen (18. november 2026): Et blad med det gamle opslag drejer væk og forsvinder igen, det nye opslag
// er der med det samme, og med reduceret bevægelse kommer der intet blad
for (const [navn, opsætning] of [['bladet', { viewport: { width: 1280, height: 800 } }], ['bladet med reduceret bevægelse', { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }]]) {
  const { page, ctx } = await nySide(opsætning, '#opdagelser');
  await vent(page, påHylden, null, 15000);
  await page.evaluate(() => atomlabTest.opdagelser.åbn('huygens'));
  await vent(page, () => atomlabTest.opdagelser.vist()?.opslag === 'forside');
  const under = await page.evaluate(() => {
    document.querySelector('#opdBog .bog-pil[data-bladr="1"]').click();
    const blad = document.querySelector('#opdBog .bog-blad');
    return { blad: Boolean(blad), portræt: Boolean(blad?.querySelector('.bog-portræt')), nyt: atomlabTest.opdagelser.vist().opslag, skjult: blad?.getAttribute('aria-hidden') === 'true' && blad.inert };
  });
  const væk = await vent(page, () => !document.querySelector('#opdBog .bog-blad'), null, 3000);
  const rolig = navn.includes('reduceret');
  tjek(`${navn}: ${rolig ? 'ingen side vendes, og det nye opslag står der med det samme' : 'et blad med forsiden vendes væk og forsvinder, og det nye opslag står der med det samme'}`,
    under.nyt === 'fortaelling' && væk && (rolig ? !under.blad : under.blad && under.portræt && under.skjult), JSON.stringify(under));
  await ctx.close();
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
