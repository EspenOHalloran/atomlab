// Gåderne (#gaader, docs/plan-gaader.md): teksterne i Node (tre trin, korte spørgsmål, gæt med svar, dato, "Se det selv"
// og højst to fagord), og i browseren skinnen (G4b: første gang, flyvningen ind og ud, Esc, pile, tryk, træk, "Næste
// gåde ›" og ROLIG), et kort fra start til slut, ✓, "Se det selv", linket fra Sort hul og Ordbogen, og at telefonen
// ikke får en vandret rullebjælke.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
import { GÅDER, bygget, STREG_FORKLARING, påSkinnen, skalaOrd, førsteLinje, FØRSTE_GÅDE, bangTider, læsetid } from '../js/data/gaader.js';
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

// G4a: scenen til Antistof og de nye felter
{
  const a = GÅDER.find((g) => g.id === 'antistof');
  const sc = a.scene ?? {};
  const linjer = [sc.start, sc.par, sc.lys, sc.kunStof, ...(sc.bang ?? []), sc.målt, sc.forLidt, sc.dune, sc.hk, sc.skiftevis, sc.tommel];
  const lange = linjer.filter((l) => !l || ord(l) > 28);
  tjek('G4a: Antistofs scene har alle linjer (højst 28 ord), "Sig det til en ven" er én sætning, og stregerne forklares i "Ærligt talt"',
    !lange.length && sc.bang?.length === 4 && sætninger(a.ven ?? '') === 1 && sc.ærligt?.includes(STREG_FORKLARING), JSON.stringify(lange));
  tjek('G4a: alle byggede kort har en størrelsesorden til skinnen, og nyt og løst har den rigtige form',
    kort.every((g) => Number.isFinite(g.størrelse)) && kort.every((g) => (g.nyt == null || (g.nyt.tekst && g.nyt.dato)) && (g.løst == null || typeof g.løst === 'string')));
}

// G4b: skinnen
{
  const bang = GÅDER.find((g) => g.id === 'antistof').scene.bang;
  const t = bangTider(bang);
  const ord = bang.map((l) => læsetid(l));
  tjek(`Antistof: linjerne i udslettelsen står længe nok til at blive læst (1 s + 3 ord/s), i alt højst 20 s (${t.færdig.toFixed(1)} s)`,
    t.mødes >= ord[0] - 0.8 && t.korn - t.mødes >= ord[1] && t.ud - t.korn >= ord[2] && t.færdig - t.ud >= ord[3] && t.færdig <= 20, JSON.stringify(t));
}
tjek('G4b: skinnen har de byggede gåder fra det mindste til det største, hver med et kort navn',
  påSkinnen().map((g) => g.id).join() === 'antistof,begyndelsen,liv,sorthul,moerktstof' && påSkinnen().every((g) => g.navn && g.navn.length <= 20));

// E20: ord for skalaen, linjen første gang og den første gåde
{
  const ordene = påSkinnen().map((g) => skalaOrd(g.størrelse));
  tjek('E20: hver gåde på skinnen har et ord for skalaen (Antistof "mindre end et atom", Mørkt stof "galakser")',
    ordene.every(Boolean) && ordene[0] === 'mindre end et atom' && ordene.at(-1) === 'galakser' && skalaOrd(-8) === 'molekyler' && skalaOrd(7) === 'planeter', JSON.stringify(ordene));
  tjek('E20: linjen første gang tæller gåderne på skinnen ("den første af fem gåder"), og man starter ved Antistof',
    førsteLinje(påSkinnen().length) === 'Videnskaben er ikke færdig. Det her er den første af fem gåder.' && FØRSTE_GÅDE === 'antistof' && påSkinnen().some((g) => g.id === FØRSTE_GÅDE));
}

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
const påSkinne = () => document.querySelector('#gaader:not(.skjult)') && window.atomlabTest?.gaader?.skinne()?.vist();

{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  const K = () => T(() => {
    const s = atomlabTest.gaader.skinne();
    const l = document.getElementById('gaaderFørste');
    return { fokus: s.fokus(), første: s.første(), tændte: s.tændte().length, ringe: s.ringe(), flyver: s.flyver(), zoom: s.zoom(), linje: l.hidden ? '' : l.textContent,
      pile: !document.querySelector('[data-skinne="1"]').hidden, skala: document.getElementById('gaaderFokusSkala').textContent,
      pileTekst: [...document.querySelectorAll('[data-skinne]')].map((p) => `${p.textContent}|${p.getAttribute('aria-label')}`).join(), spm: document.getElementById('gaaderFokusSpm').textContent, kort: atomlabTest.gaader.vist()?.id ?? null };
  });
  const først = await K();
  tjek('G4b første gang: kun Antistof er tændt, tæt foran, med linjen "Videnskaben er ikke færdig" og uden pilene',
    først.første && først.tændte === 1 && først.fokus === 'antistof' && først.zoom === 1 && først.linje.endsWith('den første af fem gåder.') && !først.pile && først.spm === 'Hvor blev antistoffet af?', JSON.stringify(først));
  tjek('E20: pilene er rene pile med et navn til skærmlæseren, og knappen viser skalaen ("mindre end et atom")',
    først.pileTekst === '‹|Mindre gåde,›|Større gåde' && først.skala === 'mindre end et atom', JSON.stringify(først));
  await page.click('#gaaderInd');
  const flyver = await K();
  const ind = await vent(page, () => atomlabTest.gaader.vist()?.id === 'antistof');
  tjek('G4b: "Flyv ind" flyver ind i lyset og åbner kortet bagefter', flyver.flyver && !flyver.kort && ind, JSON.stringify(flyver));
  await page.keyboard.press('Escape');
  const ud = await K();
  const tændt = await vent(page, () => atomlabTest.gaader.skinne().tændte().length === 5 && !atomlabTest.gaader.skinne().flyver());
  tjek('G4b: Esc går fra kortet til skinnen, kameraet trækker sig ud, og lysene tændes ("Der er flere.")',
    !ud.kort && ud.flyver && ud.tændte === 1 && ud.linje === 'Der er flere.' && tændt && await T(() => localStorage.getItem('atomlabGaaderSkinne') === '1'), JSON.stringify(ud));
  // Piletasten og knappen "større ›" flytter fokus op ad stien
  await page.keyboard.press('ArrowRight');
  await page.click('[data-skinne="1"]');
  const flyttet = await K();
  tjek('G4b: piletasten og "større ›" flytter til den næste større gåde, og linjen "Der er flere." går væk', flyttet.fokus === 'liv' && flyttet.spm === 'Er der liv andre steder?' && flyttet.linje === '', JSON.stringify(flyttet));
  // Et tryk på lyset ved siden af glider derhen, og et træk mod venstre går mod de større
  await vent(page, () => Math.abs(atomlabTest.gaader.skinne().pos() - 2) < 0.02);
  // Navnene er HTML-tekst (skarp), naboernes navne kan ses, og navnet på gåden i fokus er tonet ud (det står på knappen)
  const nv = await page.evaluate(() => atomlabTest.gaader.skinne().navne());
  const navn = (t) => nv.find((n) => n.tekst.startsWith(t));
  tjek('skarpere: navnene på skinnen er HTML-tekst på mindst 14 px, naboernes navne ses, og gåden i fokus har intet navn i 3D',
    nv.length === 7 && nv.every((n) => n.html && n.px >= 14) && navn('Livets begyndelse')?.synlig && navn('Sorte huller')?.synlig
    && !navn('Liv andre steder')?.synlig, JSON.stringify(nv));
  // Det sorte hul ved siden af tegnes af linsen fra Kosmos (lysbøjningen), i et lille lag efter lampens størrelse
  const hul = await vent(page, () => (atomlabTest.gaader.skinne().lampe('sorthul')?.tegnet ?? 0) > 0, null, 10000) && await page.evaluate(() => atomlabTest.gaader.skinne().lampe('sorthul'));
  tjek('skarpere: lampen for det sorte hul bruger linsen fra Kosmos og et lag på højst 512 px', hul?.linse && hul.tegnet > 0 && hul.størrelse >= 96 && hul.størrelse <= 512, JSON.stringify(hul));
  const nabo = await T(() => atomlabTest.gaader.skinne().skærm('sorthul'));
  await page.mouse.click(nabo.x, nabo.y);
  const trykket = (await K()).fokus;
  await vent(page, () => Math.abs(atomlabTest.gaader.skinne().pos() - 3) < 0.02);
  await page.mouse.move(700, 300);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(700 - i * 50, 300);
  await page.mouse.up();
  const trukket = (await K()).fokus;
  tjek('G4b: et tryk på en nabo glider derhen, og et træk mod venstre går til en større gåde', trykket === 'sorthul' && trukket === 'moerktstof', JSON.stringify({ trykket, trukket }));

  // Et kort fra start til slut: gæt, svar, Næste
  await T(() => atomlabTest.gaader.visGåde('sorthul'));
  const før = await T(() => ({ spm: document.querySelector('.gaade-spørgsmål')?.textContent, gæt: document.querySelectorAll('#gaadeTrin .fl-gæt').length, næste: !!document.querySelector('#gaadeTrin .fl-næste'), nørd: !!document.querySelector('.gaade-lag details[data-lag="gaade-nørd"]') }));
  tjek('kortet åbner på trin 1 med to gæt, uden "Næste" før man har gættet, og med "Vil du vide mere?"', før.spm === 'Hvad er der inde i et sort hul?' && før.gæt === 2 && !før.næste && før.nørd, JSON.stringify(før));
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
  await vent(page, () => !atomlabTest.gaader.skinne().flyver());
  const ring = await K();
  tjek('"Alle gåder" lander ved samme gåde på skinnen, og den har en ring (✓)', ring.fokus === 'sorthul' && ring.ringe.includes('sorthul') && ring.linje === '', JSON.stringify(ring));
  await page.reload();
  await vent(page, påSkinne, null, 15000);
  const igen = await K();
  tjek('✓ huskes, når siden genindlæses, og første gang er forbi', igen.ringe.includes('sorthul') && !igen.første && igen.tændte === 5, JSON.stringify(igen));

  // "Næste gåde ›" flyver ud, glider et skridt og ind i den næste større gåde
  await T(() => { const g = atomlabTest.gaader; g.visGåde('sorthul'); for (let i = 0; i < 3; i++) { g.gæt(0); g.næste(); } });
  await page.click('#gaadeTrin [data-naeste-gaade]');
  const næste = await vent(page, () => atomlabTest.gaader.vist()?.id === 'moerktstof', null, 15000);
  tjek('"Næste gåde ›" flyver ud og ind i den næste større gåde (mørkt stof)', næste);

  // "Se det selv" åbner Sort hul i Kosmos, og knappen i teksten dér åbner kortet igen
  await T(() => atomlabTest.gaader.visGåde('sorthul'));
  for (let i = 0; i < 3; i++) { await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); await page.click('#gaadeTrin .fl-næste'); }
  await page.click('#gaadeTrin [data-gaa="kosmos:sorthul"]');
  tjek('"Se det selv" åbner Sort hul i Kosmos', await vent(page, () => location.hash === '#kosmos' && atomlabTest.kosmos?.valgt() === 'sorthul', null, 20000));
  await T(() => document.querySelector('#kosmos [data-gaa="gaader:sorthul"]')?.click());
  tjek('knappen ved astronauten i Sort hul åbner gåden', await vent(page, () => location.hash === '#gaader' && atomlabTest.gaader.vist()?.id === 'sorthul' && atomlabTest.gaader.vist()?.trin === 0));
  // Efter "Se det selv" og tilbage til Gåderne står man ved samme gåde på skinnen
  for (let i = 0; i < 3; i++) { await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); await page.click('#gaadeTrin .fl-næste'); }
  await page.click('#gaadeTrin [data-gaa="kosmos:sorthul"]');
  await vent(page, () => location.hash === '#kosmos', null, 20000);
  await page.evaluate(() => { location.hash = '#gaader'; });
  tjek('efter "Se det selv" lander man ved samme gåde på skinnen', await vent(page, () => window.atomlabTest.gaader.skinne()?.vist() && atomlabTest.gaader.skinne().fokus() === 'sorthul', null, 15000));
  await ctx.close();
}

// Livets begyndelse: "Prøv det selv" åbner Begyndelsen i Liv (L5), og knappen ved Ribosomet i Liv går tilbage til gåden
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('begyndelsen'));
  for (let i = 0; i < 3; i++) { await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); await page.click('#gaadeTrin .fl-næste'); }
  await page.click('#gaadeTrin [data-gaa="begyndelsen"]');
  tjek('"Prøv det selv" åbner Begyndelsen', await vent(page, () => location.hash === '#begyndelsen' && atomlabTest.aktiv() === 'begyndelsen', null, 20000));
  // Liv med "Se genet blive læst" (som fra en knap data-gaa="liv:protein")
  await T(() => { const k = document.createElement('button'); k.dataset.gaa = 'liv:protein'; document.body.append(k); k.click(); k.remove(); });
  await vent(page, () => location.hash === '#liv' && atomlabTest.liv?.protein().tilstand === 'genet', null, 20000);
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
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('moerktstof'));
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

// G4a: Antistof i 3D på pc: panelet til højre, par, lys, "Lav kun stof", den store udslettelse, søjlerne og redskaberne
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('antistof'));
  const klar = await vent(page, () => atomlabTest.gaader.scene()?.klar(), null, 15000);
  const lay = await T(() => {
    const v = document.getElementById('gaaderVindue').getBoundingClientRect();
    const p = document.getElementById('gaaderPanel').getBoundingClientRect();
    return { påKort: document.getElementById('gaader').classList.contains('paa-kort'), vB: v.width, panelHøjre: p.left >= v.right - 1, pB: p.width };
  });
  tjek('G4a pc: kortet har en scene, og panelet (ca. 380 px) står til højre for den', klar && lay.påKort && lay.panelHøjre && Math.abs(lay.pB - 380) < 4 && lay.vB > 700, JSON.stringify(lay));
  const S = () => T(() => atomlabTest.gaader.scene().scene());
  await vent(page, () => atomlabTest.gaader.scene().stille()); // ellers kan partiklerne flytte sig på skærmen under trækket
  await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(-3, 0); s.spol(1.5); });
  const par = await S();
  // Træk stoffet hen på antistoffet med musen
  const [a, c] = par.skærm;
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + (c.x - a.x) * i / 8, a.y + (c.y - a.y) * i / 8);
  await page.mouse.up();
  const lys = await S();
  await page.click('#gaadeSceneKnapper [data-id="kunStof"]');
  await T(() => atomlabTest.gaader.scene().spol(1));
  const kun = await S();
  tjek('G4a: et tryk giver et par (én stof, én antistof), trukket sammen bliver de til lys, og "Lav kun stof" giver også et par',
    par.levende === 2 && par.stof === 1 && lys.levende === 0 && lys.skridt === 2 && kun.levende === 2 && kun.stof === 1 && kun.skridt === 3,
    JSON.stringify({ par, lys, kun }));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  const bang = await S();
  // Et tryk under udslettelsen springer til næste linje (den kommer først efter ca. 4 s)
  await T(() => atomlabTest.gaader.scene().tryk(0, 0));
  await T(() => atomlabTest.gaader.scene().spol(0.1));
  const sprang = await S();
  tjek('Antistof: et tryk under udslettelsen springer frem til næste linje', sprang.tilstand === 'bang' && sprang.t > 3.5, JSON.stringify({ t: sprang.t }));
  await T(() => atomlabTest.gaader.scene().spol(18));
  const rest = await S();
  tjek('G4a: gættet starter den store udslettelse, og den ender i resten med "Se det igen"', bang.tilstand === 'bang' && rest.tilstand === 'rest'
    && await T(() => !!document.querySelector('#gaadeSceneKnapper [data-id="igen"]')), JSON.stringify({ bang: bang.tilstand, rest: rest.tilstand }));
  await page.click('#gaadeTrin .fl-næste');
  const førStempel = await S();
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]'); // "Gæt" er forkert, men stemplet viser sandheden: MÅLT
  await T(() => atomlabTest.gaader.scene().spol(3));
  const søjler = (await S()).søjler;
  tjek('G4a trin 2: stemplet lander først efter gættet, og så vokser den stiplede søjle op', førStempel.søjler && !førStempel.søjler.stempel && !førStempel.søjler.stor && søjler.stempel && søjler.stor, JSON.stringify({ før: førStempel.søjler, søjler }));
  await page.click('#gaadeTrin .fl-næste');
  await page.click('#gaadeSceneKnapper [data-id="hk"]');
  const hk = (await S()).redskab;
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  await page.click('#gaadeTrin .fl-næste');
  const ven = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('G4a trin 3: knapperne skifter mellem DUNE og Hyper-K, og det sidste billede siger "Sig det til en ven"', hk?.vis === 'hk' && ven.startsWith('Sig det til en ven:'), JSON.stringify({ hk, ven }));
  await page.click('#gaadeTrin [data-alle]');
  const ud = await T(() => ({ scene: atomlabTest.gaader.scene().id(), påKort: document.getElementById('gaader').classList.contains('paa-kort'), skinne: atomlabTest.gaader.skinne()?.vist(), panel: getComputedStyle(document.getElementById('gaaderPanel')).display }));
  // De andre kort viser deres lys som scene
  await T(() => atomlabTest.gaader.visGåde('moerktstof'));
  const lysKort = await vent(page, () => atomlabTest.gaader.scene()?.id() === 'moerktstof' && atomlabTest.gaader.scene().scene()?.lys);
  tjek('G4a: "Alle gåder" rydder scenen og viser skinnen uden panel, og de andre kort har deres lys som scene', ud.scene === null && !ud.påKort && ud.skinne && ud.panel === 'none' && lysKort, JSON.stringify(ud));
  await ctx.close();
}

// G4a: tablet på højkant: panelet forneden (højst ca. 45 % af højden), og mens man gætter, kun spørgsmålet og valgene
{
  const { page, ctx } = await nySide({ viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('antistof'));
  await vent(page, () => atomlabTest.gaader.scene()?.klar(), null, 15000);
  const mål = () => T(() => {
    const v = document.getElementById('gaaderVindue').getBoundingClientRect();
    const p = document.getElementById('gaaderPanel').getBoundingClientRect();
    const synlig = (sel) => { const e = document.querySelector(sel); return !!e && e.getClientRects().length > 0; };
    return { under: p.top >= v.bottom - 1, andel: p.height / innerHeight, titel: synlig('.gaade-spørgsmål'), gæt: synlig('#gaadeTrin .fl-gæt') };
  });
  const før = await mål();
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  const efter = await mål();
  tjek('G4a højkant: panelet står under scenen og fylder højst ca. 45 %, og titlen er skjult, mens man gætter',
    før.under && før.andel < 0.46 && efter.andel < 0.46 && !før.titel && før.gæt && efter.titel, JSON.stringify({ før, efter }));
  await ctx.close();
}

// G4b: "Reducer bevægelse" (ROLIG): ingen flyvning, kun toningen, og lysene står tændt med det samme
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }, '#gaader');
  await vent(page, påSkinne, null, 15000);
  await page.click('#gaaderInd');
  const z = await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok(atomlabTest.gaader.skinne().zoom())))));
  const kort = await vent(page, () => atomlabTest.gaader.vist()?.id === 'antistof');
  await page.keyboard.press('Escape');
  const tændt = await vent(page, () => atomlabTest.gaader.skinne().tændte().length === 5);
  tjek('G4b ROLIG: kameraet hopper (ingen flyvning), kortet åbner efter toningen, og lysene står tændt med det samme', z === 2 && kort && tændt, JSON.stringify({ z, kort, tændt }));
  await ctx.close();
}

// Telefon på højkant: ingen vandret rullebjælke, hverken på skinnen eller på kortet
{
  const { page, ctx } = await nySide({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, '#gaader');
  await vent(page, påSkinne, null, 15000);
  const bred = () => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.getElementById('gaaderPanel').scrollWidth) > window.innerWidth + 1);
  const o = await bred();
  const nvT = await page.evaluate(() => atomlabTest.gaader.skinne().navne());
  tjek('telefon: navnene på skinnen er mindst 13 px', nvT.length > 0 && nvT.every((n) => n.px >= 13), JSON.stringify(nvT.map((n) => n.px)));
  await page.evaluate(() => atomlabTest.gaader.visGåde('sorthul'));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  tjek('telefon: ingen vandret rullebjælke på skinnen og på kortet', !o && !(await bred()));
  await ctx.close();
}

// Fuld grafik (med komponisten): kantudglatning kun i Gåderne, slået fra igen, når man går
{
  const fb = await chromium.launch({ args: ARGS, fuldGrafik: true });
  const page = await (await fb.newContext({ viewport: { width: 1024, height: 700 } })).newPage();
  page.on('pageerror', (e) => fejl.push('fuld grafik: ' + e.message));
  await page.goto(`${ADRESSE}/?test#gaader`);
  await page.waitForFunction(() => window.atomlabTest?.gaader?.skinne?.()?.vist?.(), null, { timeout: 60000 });
  const inde = await page.evaluate(() => atomlabTest.gaader.prøver());
  await page.evaluate(() => { location.hash = '#'; });
  await page.waitForFunction(() => document.querySelector('#gaader.skjult'), null, { timeout: 20000 });
  const ude = await page.evaluate(() => atomlabTest.gaader.prøver());
  tjek('skarpere: kantudglatning (4 prøver på pc) kun i Gåderne, væk igen i menuen', inde === 4 && ude === 0, JSON.stringify({ inde, ude }));
  await fb.close();
}

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
