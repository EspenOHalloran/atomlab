// Gåderne (#gaader, docs/plan-gaader.md): teksterne i Node (tre trin, korte spørgsmål, gæt med svar, dato, "Se det selv"
// og højst to fagord), og i browseren oversigten, et kort fra start til slut, ✓, "Se det selv", linket fra Sort hul og
// Ordbogen, og at telefonen ikke får en vandret rullebjælke.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { GÅDER, bygget } from '../js/data/gaader.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { LINKS } from '../js/data/ordbogliste.js';
import { FÆNOMEN_IDER } from '../js/data/faenomener.js';
import { SKÆRME } from '../js/skaerme.js';
import { SIDER as MARS } from '../js/data/sider/mars.js';
import { SIDER as SATURN } from '../js/data/sider/saturn.js';
import { TRIN_PROTEIN } from '../js/data/liv/protein.js';
import { HVORFOR } from '../js/data/hvorfor.js';
import { readFileSync } from 'node:fs';
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: teksterne ----------
const kort = GÅDER.filter(bygget);
tjek(`fem gåder i oversigten, de to om liv skilt ad, og alle fem er bygget (${kort.map((g) => g.id).join()})`,
  GÅDER.map((g) => g.id).join() === 'sorthul,liv,antistof,begyndelsen,moerktstof' && kort.length === 5);
const ord = (t) => t.split(/\s+/).filter(Boolean).length;
// "ca." og datoer som "12. november" slutter ikke en sætning
const sætninger = (t) => t.replace(/\bca\./g, 'ca').replace(/\b\d+\. (?=[a-zæøå])/g, '1 ').split(/[.!?](?:\s|$)/).filter((s) => s.trim()).length;
const fejlTekst = [];
for (const g of kort) {
  if (g.trin.length !== 3) fejlTekst.push(`${g.id}: ${g.trin.length} trin`);
  if (!/\b20\d\d\b/.test(g.dato ?? '')) fejlTekst.push(`${g.id}: ingen dato`);
  g.trin.forEach((t, i) => {
    if (ord(t.spørg) > 15) fejlTekst.push(`${g.id} trin ${i + 1}: Spørg har ${ord(t.spørg)} ord`);
    const v = t.gæt?.valg ?? [];
    if (v.length < 2 || v.length > 3 || !v.every((x) => x.tekst && x.efter)) fejlTekst.push(`${g.id} trin ${i + 1}: gættet`);
    if (sætninger(t.så) > 2) fejlTekst.push(`${g.id} trin ${i + 1}: Så har ${sætninger(t.så)} sætninger`);
    if (/\bsnart\b|om få år/i.test(t.så)) fejlTekst.push(`${g.id} trin ${i + 1}: "snart" uden årstal`);
  });
  const [skærm, id] = g.seDet[0].split(':');
  const [, , sted] = g.seDet[0].split(':');
  if (sted && !(skærm === 'solsystem' && id === 'mars' && MARS[sted])) fejlTekst.push(`${g.id}: stedet ${sted} findes ikke`);
  if (!(FÆNOMEN_IDER[skærm]?.includes(id) || g.seDet[0] === 'liv:protein' || (!id && SKÆRME.some((s) => s.id === skærm)))) fejlTekst.push(`${g.id}: "Se det selv" peger på ${g.seDet[0]}`);
  if (g.ord.length > 2 || !g.ord.every((o) => ORDBOG.some((x) => x.id === o))) fejlTekst.push(`${g.id}: fagordene ${g.ord.join()}`);
  for (const t of g.trin) if (t.hvorfor && !HVORFOR[t.hvorfor]) fejlTekst.push(`${g.id}: "Hvorfor?" ${t.hvorfor} findes ikke`);
}
tjek('hvert kort: tre trin, dato, Spørg højst 15 ord, 2-3 gæt med svar, Så højst to sætninger, "Se det selv" findes, højst to fagord fra Ordbogen', !fejlTekst.length, fejlTekst.join('; '));
const gåLiv = 'data-gaa="gaader:liv"';
tjek('"Se også": Jezero, Stå ved randen og Enceladus peger på gåden om liv, og Ribosomet i Liv på livets begyndelse',
  MARS.jezero.emner.some((e) => e.tekst.includes(gåLiv)) && MARS['stå-randen'].videre.some((v) => v.includes(gåLiv)) && MARS['stå-randen'].videre.length <= 3
  && SATURN.enceladus.emner.some((e) => e.tekst.includes(gåLiv)) && TRIN_PROTEIN.oversæt.gåde?.[0] === 'gaader:begyndelsen');
tjek('Ordbogen har "singularitet" med et link til gåden', ORDBOG.some((o) => o.id === 'singularitet') && LINKS.singularitet?.gaa?.[0] === 'gaader:sorthul');
// G3: "Se også" fra Big Bang (et af højst fire spørgsmål, "Gå videre" er fuld) og Rumtid, Ordbogen og "Hvornår er noget opdaget?"
// Fænomenerne bruger Three.js, så de læses som tekst i stedet for at blive importeret
const kilde = (fil) => readFileSync(new URL(`../js/kosmos/${fil}.js`, import.meta.url), 'utf8');
const bigbang = kilde('bigbang');
const rumtidLys = kilde('rumtid').split("titel: 'Bøjer lys også?'")[1]?.split('titel:')[0] ?? '';
tjek('"Se også": Big Bang (højst fire spørgsmål) peger på antistof og Rumtid (lysbøjningen) på mørkt stof',
  (bigbang.split('emner:')[1].split('videre:')[0].match(/titel: '/g) ?? []).length <= 4 && /titel: 'Hvor blev antistoffet af\?'[^}]*gaader:antistof/.test(bigbang)
  && rumtidLys.includes("gaader:moerktstof"));
tjek('Ordbogen: "mørkt stof" og "antistof" peger på gåderne, og "sigma" på "Hvornår er noget opdaget?"',
  ['moerktstof', 'sigma'].every((id) => ORDBOG.some((o) => o.id === id)) && LINKS.moerktstof?.gaa?.[0] === 'gaader:moerktstof'
  && LINKS.antistof?.gaa?.[0] === 'gaader:antistof' && LINKS.sigma?.hvorfor === 'opdaget');
tjek('"Hvornår er noget opdaget?" står på kortene om mørkt stof og liv',
  !!HVORFOR.opdaget && ['moerktstof', 'liv'].every((id) => GÅDER.find((g) => g.id === id).trin.some((t) => t.hvorfor === 'opdaget')));

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

{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, () => document.querySelector('#gaader:not(.skjult) .gaade-valg'));
  const oversigt = await T(() => ({
    antal: document.querySelectorAll('#gaaderListe .gaade-valg').length,
    lukkede: document.querySelectorAll('#gaaderListe .gaade-valg:disabled').length,
    start: document.querySelector('.gaade-mærke.start')?.closest('button').dataset.gaade,
  }));
  tjek('#gaader viser oversigten: fem gåder, ingen "Kommer senere", "Start her" på Sort hul', oversigt.antal === 5 && oversigt.lukkede === 0 && oversigt.start === 'sorthul', JSON.stringify(oversigt));

  // Et kort fra start til slut: gæt, svar, Næste
  await page.click('.gaade-valg[data-gaade="sorthul"]');
  const før = await T(() => ({ spm: document.querySelector('.gaade-spørgsmål')?.textContent, gæt: document.querySelectorAll('#gaadeTrin .fl-gæt').length, næste: !!document.querySelector('#gaadeTrin .fl-næste'), nørd: !!document.querySelector('.gaade-lag details[data-lag="gaade-nørd"]') }));
  tjek('kortet åbner på trin 1 med to gæt, uden "Næste" før man har gættet, og med "For nørder"', før.spm === 'Hvad er der inde i et sort hul?' && før.gæt === 2 && !før.næste && før.nørd, JSON.stringify(før));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  const svar = await T(() => ({ efter: document.querySelector('.gaade-efter')?.textContent, så: document.querySelector('#gaadeTrin .fl-så')?.textContent, låst: [...document.querySelectorAll('#gaadeTrin .fl-gæt')].every((k) => k.disabled) }));
  tjek('et gæt viser sit svar og det, der er målt, og knapperne låses', svar.efter === GÅDER[0].trin[0].gæt.valg[1].efter && svar.så === GÅDER[0].trin[0].så && svar.låst, JSON.stringify(svar));
  for (let i = 1; i < 3; i++) {
    await page.click('#gaadeTrin .fl-næste');
    await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  }
  const ord2 = await T(() => [...document.querySelectorAll('#gaadeTrin .fagord')].map((k) => k.dataset.ord));
  await page.click('#gaadeTrin .fl-næste');
  const slut = await T(() => ({ tekst: document.querySelector('#gaadeTrin .fl-så')?.textContent, seDet: document.querySelector('#gaadeTrin [data-gaa]')?.dataset.gaa, færdige: atomlabTest.gaader.færdige() }));
  tjek('"Det så du" med kernen og "Se det selv", og kortet huskes som færdigt', slut.tekst === GÅDER[0].slut && slut.seDet === 'kosmos:sorthul' && slut.færdige.includes('sorthul'), JSON.stringify(slut));
  tjek(`trin 3 markerer ikke andre fagord end kortets (${ord2.join() || 'ingen'})`, ord2.every((o) => GÅDER[0].ord.includes(o)));
  await page.click('#gaadeTrin [data-alle]');
  tjek('✓ i oversigten, og "Start her" er væk', await T(() => !!document.querySelector('.gaade-valg[data-gaade="sorthul"] .gaade-mærke.færdig') && !document.querySelector('.gaade-mærke.start')));
  await page.reload();
  await vent(page, () => window.atomlabTest && document.querySelector('#gaader:not(.skjult) .gaade-valg'));
  tjek('✓ huskes, når siden genindlæses', await T(() => !!document.querySelector('.gaade-valg[data-gaade="sorthul"] .gaade-mærke.færdig')));

  // "Se det selv" åbner Sort hul i Kosmos, og knappen i teksten dér åbner kortet igen
  await T(() => atomlabTest.gaader.visGåde('sorthul'));
  for (let i = 0; i < 3; i++) { await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); await page.click('#gaadeTrin .fl-næste'); }
  await page.click('#gaadeTrin [data-gaa="kosmos:sorthul"]');
  tjek('"Se det selv" åbner Sort hul i Kosmos', await vent(page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt() === 'sorthul', null, 20000));
  await T(() => document.querySelector('#kosmos [data-gaa="gaader:sorthul"]')?.click());
  tjek('knappen ved astronauten i Sort hul åbner gåden', await vent(page, () => location.hash === '#gaader' && atomlabTest.gaader.vist()?.id === 'sorthul' && atomlabTest.gaader.vist()?.trin === 0));
  await ctx.close();
}

// Livets begyndelse: "Se det selv" åbner Liv og starter "Se genet blive læst", og knappen ved Ribosomet går tilbage
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, () => document.querySelector('#gaader:not(.skjult) .gaade-valg'));
  await T(() => atomlabTest.gaader.visGåde('begyndelsen'));
  for (let i = 0; i < 3; i++) { await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); await page.click('#gaadeTrin .fl-næste'); }
  await page.click('#gaadeTrin [data-gaa="liv:protein"]');
  tjek('"Se det selv" åbner Liv og starter "Se genet blive læst"', await vent(page, () => location.hash === '#liv' && atomlabTest.liv?.protein().tilstand === 'genet', null, 20000));
  let trin = '';
  for (let i = 0; i < 40 && trin !== 'oversæt'; i++) trin = await T(() => { atomlabTest.liv.proteinSpol(2); return atomlabTest.liv.protein().trin; });
  await vent(page, () => !document.getElementById('livGaade').hidden);
  await T(() => document.querySelector('#livGaade [data-gaa]').click());
  tjek(`knappen ved Ribosomet åbner gåden om livets begyndelse (trin ${trin})`, await vent(page, () => location.hash === '#gaader' && atomlabTest.gaader.vist()?.id === 'begyndelsen'));
  await ctx.close();
}

// Mørkt stof: knappen "Hvornår er noget opdaget?" kommer under Så i trin 2 og åbner "Hvorfor?"-kortet, og "Se det selv" åbner Rumtid
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, () => document.querySelector('#gaader:not(.skjult) .gaade-valg'));
  await page.click('.gaade-valg[data-gaade="moerktstof"]');
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  const trin1 = await T(() => !!document.querySelector('#gaadeTrin button.hvorfor'));
  await page.click('#gaadeTrin .fl-næste');
  const før = await T(() => !!document.querySelector('#gaadeTrin button.hvorfor'));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  await page.click('#gaadeTrin button.hvorfor[data-hvorfor="opdaget"]');
  const kortet = await vent(page, () => !document.getElementById('hvorforKort')?.classList.contains('skjult') && document.querySelector('#hvorforKort .hk-titel').textContent === 'Hvornår er noget opdaget?');
  tjek('mørkt stof: "Hvornår er noget opdaget?" står først efter gættet i trin 2 og åbner "Hvorfor?"-kortet', !trin1 && !før && kortet, JSON.stringify({ trin1, før, kortet }));
  await page.keyboard.press('Escape');
  for (let i = 0; i < 2; i++) { await page.click('#gaadeTrin .fl-næste'); if (i === 0) await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); }
  await page.click('#gaadeTrin [data-gaa="kosmos:rumtid"]');
  tjek('"Se det selv" åbner Rumtid i Kosmos', await vent(page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt() === 'rumtid', null, 20000));
  await ctx.close();
}

// Ordbogen åbner gåden, før Gåderne er hentet (som den første skærm efter Ordbogen)
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#ordbog');
  await vent(page, () => document.querySelector('#ordbog:not(.skjult) #ord-singularitet'));
  const hentetFør = await page.evaluate(() => atomlabTest.hentet('gaader'));
  await page.click('#ord-singularitet [data-gaa]');
  tjek('Ordbogens "singularitet" henter Gåderne og åbner kortet Sort hul', !hentetFør && await vent(page, () => atomlabTest.gaader?.vist()?.id === 'sorthul'));
  await ctx.close();
}

// Telefon på højkant: ingen vandret rullebjælke, hverken i oversigten eller på kortet
{
  const { page, ctx } = await nySide({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, '#gaader');
  await vent(page, () => document.querySelector('#gaader:not(.skjult) .gaade-valg'));
  const bred = () => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.getElementById('gaaderPanel').scrollWidth) > window.innerWidth + 1);
  const o = await bred();
  await page.click('.gaade-valg[data-gaade="sorthul"]');
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  tjek('telefon: ingen vandret rullebjælke i oversigten og på kortet', !o && !(await bred()));
  await ctx.close();
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
