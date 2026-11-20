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
import { PLANETER_PR_ÅR, EXOPLANETER_I_ALT, EXOPLANETER_DATO, afstandeFor, planeterFor } from '../js/data/exoplaneter.js';
import { SMÅKLODER, periheliumRetning } from '../js/data/planet9.js';
import { SIDE as OVERBLIK } from '../js/data/sider/overblik.js';
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: teksterne ----------
const kort = GÅDER.filter(bygget);
tjek(`seks gåder i oversigten, de to om liv skilt ad, og alle seks er bygget (${kort.map((g) => g.id).join()})`,
  GÅDER.map((g) => g.id).join() === 'sorthul,liv,antistof,begyndelsen,moerktstof,planet9' && kort.length === 6);
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

// G4c: Sort huls scene (linsen fra Kosmos, tonen, de to kanter og LISA)
{
  const g = GÅDER.find((x) => x.id === 'sorthul');
  const sc = g.scene ?? {};
  const linjer = [sc.start, sc.efter, sc.ind, sc.inde, sc.svar, sc.lisa];
  const lange = linjer.filter((l) => !l || ord(l) > 28);
  tjek('G4c: Sort huls scene har alle linjer (højst 28 ord), "Sig det til en ven" er én sætning, og stregerne forklares i "Ærligt talt"',
    !lange.length && sætninger(g.ven ?? '') === 1 && sc.ærligt?.includes(STREG_FORKLARING) && /to oktaver/.test(sc.ærligt) && /ikke lyd/.test(sc.ærligt), JSON.stringify(lange));
  // Før gættet i trin 2 må linjerne ikke give svaret (at ingen kan måle derinde), og der står ikke "alt er sort"
  tjek('G4c: linjerne før gættet giver ikke svaret, og LISA har årstallet 2035', ![sc.ind, sc.inde].some((x) => /måle|gæt|teori/i.test(x)) && /2035/.test(sc.navne?.lisa) && /67 sekunder/.test(sc.navne?.tid67) && !/sort derinde|alt er sort/i.test(Object.values(sc).join('|')));
}

// G4d: Mørkt stofs scene
{
  const m = GÅDER.find((g) => g.id === 'moerktstof');
  const sc = m.scene ?? {};
  const linjer = [sc.start, sc.kunSynligt, sc.igen, sc.bøj, sc.bøjet, sc.lz, sc.lzVent, sc.glimt, sc.sigma, sc.euclid, sc.kort];
  const lange = linjer.filter((l) => !l || ord(l) > 28);
  tjek('G4d: Mørkt stofs scene har alle linjer (højst 28 ord), "Sig det til en ven" er én sætning, og stregerne forklares i "Ærligt talt"',
    !lange.length && sætninger(m.ven ?? '') === 1 && sc.ærligt?.includes(STREG_FORKLARING) && sc.navne?.sigma === '2,6 sigma' && /2027/.test(sc.navne?.euclid ?? ''), JSON.stringify(lange));
  // Kontakten må ikke give svaret, før man har gættet (stilguiden A6): Den siger ikke "mørkt stof"
  tjek('G4d: kontakten hedder "Kun det synlige trækker" og nævner ikke mørkt stof', sc.kontakt === 'Kun det synlige trækker' && !/mørk/i.test(sc.kontakt + sc.start + sc.kunSynligt + sc.igen));
}

// G4d: Liv andre steders scene og planeterne
{
  const l = GÅDER.find((g) => g.id === 'liv');
  const sc = l.scene ?? {};
  // Fund fra telefonen (19. november 2026): Fundet introduceres før skalaen, planeterne blev opdaget (de "kom" ikke), og
  // galaksen med 2.000 stjerner er den i animationen
  const nørd = l.nørd ?? '';
  const md = GÅDER.find((g) => g.id === 'moerktstof')?.scene?.ærligt ?? '';
  tjek('Fund: "Vil du vide mere?" fortæller om fundet af Cheyava Falls før CoLD-skalaen, 1992 "opdaget", og galaksens 2.000 er prikker i animationen',
    nørd.indexOf('<b>Fundet:</b>') > -1 && nørd.indexOf('<b>Fundet:</b>') < nørd.indexOf('CoLD') && /Perseverance/.test(nørd.slice(0, nørd.indexOf('CoLD')))
    && /opdaget/.test(sc.første) && !/\bkom\b/.test(sc.første) && /i animationen er tegnet med ca\. 2\.000 prikker/.test(md) && !/Galaksen har ca\. 2\.000 stjerner/.test(md));
  const linjer = [sc.start, sc.første, sc.alle, sc.efter, sc.sten, sc.stenSvar, sc.sonder];
  const lange = linjer.filter((x) => !x || ord(x) > 28);
  tjek('G4d: Liv andre steders scene har alle linjer (højst 28 ord), "Sig det til en ven" er én sætning, og stregerne forklares i "Ærligt talt"',
    !lange.length && sætninger(l.ven ?? '') === 1 && sc.ærligt?.includes(STREG_FORKLARING) && !/liv\?/.test(Object.values(sc.navne ?? {}).join('|')), JSON.stringify(lange));
  // Før gættet må linjerne ikke give svaret (at liv kun er fundet på Jorden)
  tjek('G4d: linjerne før gættet siger ikke, at liv kun er fundet på Jorden', ![sc.start, sc.første, sc.alle].some((x) => /kun|eneste/.test(x)));
  const år = PLANETER_PR_ÅR.map((r) => r[0]);
  const antal = PLANETER_PR_ÅR.reduce((s, r) => s + afstandeFor(r).length, 0);
  const år1992 = afstandeFor(PLANETER_PR_ÅR[0]);
  tjek('G4d: planeterne: 6.470 i alt (arkivet hos NASA 19. november 2026), ét år ad gangen fra 1992 til 2026, de to første om pulsaren (ca. 2.000 lysår)',
    antal === EXOPLANETER_I_ALT && EXOPLANETER_I_ALT === 6470 && år[0] === 1992 && år.at(-1) === 2026 && år.every((a, i) => i === 0 || a === år[i - 1] + 1)
    && år1992.length === 2 && år1992.every((d) => d > 1500 && d < 3500) && PLANETER_PR_ÅR.every((r) => afstandeFor(r).every((d) => Number.isInteger(d) && d >= 0)),
    JSON.stringify({ antal, første: år[0], sidste: år.at(-1), år1992 }));
  // De rigtige pladser fra NASA's arkiv: ra og dec i grader, og Keplers felt (Svanen og Lyren) er en tæt klump
  const alle = PLANETER_PR_ÅR.flatMap((r) => planeterFor(r));
  const kepler = alle.filter(([ra, dec]) => ra > 280 && ra < 302 && dec > 36 && dec < 53).length;
  const uden = alle.filter((p) => p[2] === 0).length;
  tjek('G4d: pladserne fra arkivet hos NASA (ra 0-359°, dec ±90°), over 2.000 i Keplers felt, under 50 uden afstand, og "Ærligt talt" siger, at retningen er rigtig',
    alle.every(([ra, dec]) => ra >= 0 && ra < 360 && dec >= -90 && dec <= 90) && kepler > 2000 && uden < 50 && EXOPLANETER_DATO === '19. november 2026'
    && /6\.470/.test(l.scene.ærligt) && /Retningen på himlen er rigtig/.test(l.scene.ærligt) && !/tilfældig|Wikipedia/.test(l.scene.ærligt), JSON.stringify({ kepler, uden }));
}

// G4e: Livets begyndelse har ingen egen scene, men en linje pr. trin med knappen til Begyndelsen i Liv
{
  const g = GÅDER.find((x) => x.id === 'begyndelsen');
  const prøv = g.scene?.prøv ?? [];
  tjek('G4e: Livets begyndelse har én linje pr. trin (højst 28 ord, om delen Begyndelsen, ikke "kopierer sig selv"), og knappen går til delen',
    prøv.length === g.trin.length && prøv.every((x) => x.startsWith('I Begyndelsen') && ord(x) <= 28 && sætninger(x) === 1 && !/sig selv/.test(x))
    && g.seDet[0] === 'begyndelsen' && SKÆRME.some((d) => d.id === 'begyndelsen'), JSON.stringify(prøv));
}

// G4b: skinnen
{
  const bang = GÅDER.find((g) => g.id === 'antistof').scene.bang;
  const t = bangTider(bang);
  const ord = bang.map((l) => læsetid(l));
  tjek(`Antistof: linjerne i udslettelsen står længe nok til at blive læst (1 s + 3 ord/s), i alt højst 20 s (${t.færdig.toFixed(1)} s)`,
    t.mødes >= ord[0] - 0.8 && t.korn - t.mødes >= ord[1] && t.ud - t.korn >= ord[2] && t.færdig - t.ud >= ord[3] && t.færdig <= 20, JSON.stringify(t));
}
// Planet 9 (20. november 2026): teksterne, banerne fra JPL og spørgsmålet i Solsystemets overblik
{
  const g = GÅDER.find((x) => x.id === 'planet9');
  const sc = g?.scene ?? {};
  const linjer = [sc.start, sc.samme, sc.efter, sc.flere, sc.flereSvar, sc.rubin];
  const lange = linjer.filter((x) => !x || ord(x) > 28);
  tjek('Planet 9: scenens linjer (højst 28 ord), "Sig det til en ven" er én sætning, stregerne forklares, og planeten har intet "?" (et bud)',
    !lange.length && sætninger(g.ven ?? '') === 1 && sc.ærligt?.includes(STREG_FORKLARING) && !/\?/.test(Object.values(sc.navne ?? {}).join('|')) && /et bud/.test(sc.navne?.planet), JSON.stringify(lange));
  const alt = JSON.stringify(g);
  tjek('Planet 9: begge sider er med (Batygin og Brown 2016, skønnet fra 2025, hvor man har ledt, 2017 OF201, Rubin 2026), navnet forklares, og Pluto er en dværgplanet',
    ['Batygin', '2016', '290', '4-5', 'ledt', '2017 OF201', 'Rubin', '30. juni 2026', 'Planet X', 'OSSOS'].every((x) => alt.includes(x))
    && /dværgplanet/.test(g.trin[0].gæt.valg[0].efter) && g.trin[0].gæt.rigtigt === 2 && g.trin[1].gæt.rigtigt === 1);
  tjek('Planet 9: linjerne før gættet siger ikke, at ingen har set planeten', ![sc.start, sc.samme].some((x) => /ingen|set den/i.test(x)));
  const seks = SMÅKLODER.filter((x) => x[7]);
  const v = (x) => periheliumRetning(x) * Math.PI / 180;
  const mx = Math.atan2(seks.reduce((s, x) => s + Math.sin(v(x)), 0), seks.reduce((s, x) => s + Math.cos(v(x)), 0));
  const afvig = (x) => Math.abs(((v(x) - mx + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) * 180 / Math.PI;
  const of = SMÅKLODER.find((x) => x[0] === '2017 OF201');
  tjek('Planet 9: banerne fra JPL (a > 250 AU, q > 30 AU), de seks fra 2016 er med og peger samme vej (inden for 70°), og 2017 OF201 peger en anden vej (over 90°)',
    SMÅKLODER.length >= 20 && SMÅKLODER.every((x) => x[1] > 250 && x[1] * (1 - x[2]) > 30) && seks.length === 6
    && ['Sedna', 'Alicanto', '2012 VP113', '2010 GB174', '2007 TG422', '2013 RF98'].every((n) => seks.some((x) => x[0] === n))
    && seks.every((x) => afvig(x) < 70) && of && afvig(of) > 90, JSON.stringify({ antal: SMÅKLODER.length, seks: seks.map(afvig).map(Math.round), of: of && Math.round(afvig(of)) }));
  const tomt = OVERBLIK.emner.find((e) => e.titel === 'Hvor tomt er her egentlig?')?.tekst ?? '';
  tjek('Planet 9: spørgsmålet "Er der en planet mere derude?" står i overblikket ("Hvor tomt er her egentlig?") med en knap til gåden',
    /Er der en planet mere derude\?/.test(tomt) && tomt.includes('gaader:planet9') && g.seDet[0] === 'solsystem:overblik');
}
tjek('G4b: skinnen har de byggede gåder fra det mindste til det største, hver med et kort navn',
  påSkinnen().map((g) => g.id).join() === 'antistof,begyndelsen,liv,planet9,sorthul,moerktstof' && påSkinnen().every((g) => g.navn && g.navn.length <= 20));

// E20: ord for skalaen, linjen første gang og den første gåde
{
  const ordene = påSkinnen().map((g) => skalaOrd(g.størrelse));
  tjek('E20: hver gåde på skinnen har et ord for skalaen (Antistof "mindre end et atom", Mørkt stof "galakser")',
    ordene.every(Boolean) && ordene[0] === 'mindre end et atom' && ordene.at(-1) === 'galakser' && skalaOrd(-8) === 'molekyler' && skalaOrd(7) === 'planeter', JSON.stringify(ordene));
  tjek('E20: linjen første gang tæller gåderne på skinnen ("den første af seks gåder"), og man starter ved Antistof',
    førsteLinje(påSkinnen().length) === 'Videnskaben er ikke færdig. Det her er den første af seks gåder.' && FØRSTE_GÅDE === 'antistof' && påSkinnen().some((g) => g.id === FØRSTE_GÅDE));
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
    først.første && først.tændte === 1 && først.fokus === 'antistof' && først.zoom === 1 && først.linje.endsWith('den første af seks gåder.') && !først.pile && først.spm === 'Hvor blev antistoffet af?', JSON.stringify(først));
  tjek('E20: pilene er rene pile med et navn til skærmlæseren, og knappen viser skalaen ("mindre end et atom")',
    først.pileTekst === '‹|Mindre gåde,›|Større gåde' && først.skala === 'mindre end et atom', JSON.stringify(først));
  await page.click('#gaaderInd');
  const flyver = await K();
  const ind = await vent(page, () => atomlabTest.gaader.vist()?.id === 'antistof');
  tjek('G4b: "Flyv ind" flyver ind i lyset og åbner kortet bagefter', flyver.flyver && !flyver.kort && ind, JSON.stringify(flyver));
  await page.keyboard.press('Escape');
  const ud = await K();
  const tændt = await vent(page, () => atomlabTest.gaader.skinne().tændte().length === 6 && !atomlabTest.gaader.skinne().flyver());
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
    nv.length === 8 && nv.every((n) => n.html && n.px >= 14) && navn('Livets begyndelse')?.synlig && navn('Planet 9')?.synlig
    && !navn('Liv andre steder')?.synlig, JSON.stringify(nv));
  // Et tryk på naboen (Planet 9) glider derhen. Så står Sort hul ved siden af, og dens lampe tegnes af linsen fra Kosmos
  // (lysbøjningen), i et lille lag efter lampens størrelse
  const nabo = await T(() => atomlabTest.gaader.skinne().skærm('planet9'));
  await page.mouse.click(nabo.x, nabo.y);
  const trykket = (await K()).fokus;
  await vent(page, () => Math.abs(atomlabTest.gaader.skinne().pos() - 3) < 0.02);
  const hul = await vent(page, () => (atomlabTest.gaader.skinne().lampe('sorthul')?.tegnet ?? 0) > 0, null, 10000) && await page.evaluate(() => atomlabTest.gaader.skinne().lampe('sorthul'));
  tjek('skarpere: lampen for det sorte hul bruger linsen fra Kosmos og et lag på højst 512 px', hul?.linse && hul.tegnet > 0 && hul.størrelse >= 96 && hul.størrelse <= 512, JSON.stringify(hul));
  await page.mouse.move(700, 300);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(700 - i * 50, 300);
  await page.mouse.up();
  const trukket = (await K()).fokus;
  tjek('G4b: et tryk på en nabo glider derhen, og et træk mod venstre går til en større gåde', trykket === 'planet9' && ['sorthul', 'moerktstof'].includes(trukket), JSON.stringify({ trykket, trukket }));

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
  tjek('✓ huskes, når siden genindlæses, og første gang er forbi', igen.ringe.includes('sorthul') && !igen.første && igen.tændte === 6, JSON.stringify(igen));

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
  // G4e: linjen og knappen nederst i billedet kommer først efter gættet, og ikke i "Det så du" (der står "Prøv det selv" i panelet)
  const bund = () => T(() => ({ linje: document.getElementById('gaadeLinje').hidden ? '' : document.getElementById('gaadeLinje').textContent,
    knap: document.querySelector('#gaadeSceneKnapper [data-gaa]')?.dataset.gaa ?? null, prøv: atomlabTest.gaader.scene().scene()?.prøv ?? null }));
  await vent(page, () => atomlabTest.gaader.scene()?.klar(), null, 15000);
  const trinene = [];
  for (let i = 0; i < 3; i++) {
    const før = await bund();
    await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
    trinene.push([før, await bund()]);
    await page.click('#gaadeTrin .fl-næste');
  }
  const slut = await bund();
  const prøv = GÅDER.find((x) => x.id === 'begyndelsen').scene.prøv;
  tjek('G4e: før gættet ingen linje og ingen knap i billedet, efter gættet trinets linje og knappen til Begyndelsen',
    trinene.every(([før, efter], i) => !før.linje && !før.knap && efter.linje === prøv[i] && efter.prøv === prøv[i] && efter.knap === 'begyndelsen'), JSON.stringify(trinene));
  tjek('G4e: i "Det så du" står knappen kun i panelet ("Prøv det selv"), ikke også i billedet', !slut.linje && !slut.knap, JSON.stringify(slut));
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
  // G4e: knappen i billedet åbner også Begyndelsen
  await vent(page, () => atomlabTest.gaader.scene()?.klar(), null, 15000);
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  await page.click('#gaadeSceneKnapper [data-gaa="begyndelsen"]');
  tjek('G4e: knappen i billedet åbner Begyndelsen i Liv', await vent(page, () => location.hash === '#begyndelsen' && atomlabTest.aktiv() === 'begyndelsen', null, 20000));
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
  await T(() => atomlabTest.gaader.visGåde('begyndelsen'));
  const lysKort = await vent(page, () => atomlabTest.gaader.scene()?.id() === 'begyndelsen' && atomlabTest.gaader.scene().scene()?.lys);
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
  const tændt = await vent(page, () => atomlabTest.gaader.skinne().tændte().length === 6);
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

// G4d: Mørkt stof i 3D: galaksen med kontakten, lysbøjningen, LZ og kortet
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('moerktstof'));
  const klar = await vent(page, () => atomlabTest.gaader.scene()?.scene()?.tilstand === 'galakse', null, 15000);
  const S = () => T(() => atomlabTest.gaader.scene().scene());
  const før = await S();
  // Den flade rotationskurve: de yderste har samme fart som dem halvvejs ude, og den er over flugtfarten fra det synlige
  const g0 = før?.galakse ?? {};
  tjek('G4d: Mørkt stof har sin egen scene: galaksen drejer med samme fart inde og ude, og den fart er over flugtfarten fra det synlige stof',
    klar && Math.abs(g0.fartUde - g0.fartInde) < 0.08 && g0.flugtUde < g0.fartUde && g0.ude === 0 && !før.lys, JSON.stringify(før));
  await page.click('#gaadeSceneKnapper [data-id="kunSynligt"]');
  const til = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(14); return { sc: s.scene(), tændt: document.querySelector('#gaadeSceneKnapper [data-id="kunSynligt"]').getAttribute('aria-checked'), linje: document.getElementById('gaadeLinje').textContent }; });
  await page.click('#gaadeSceneKnapper [data-id="kunSynligt"]');
  const fra = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(3); return { sc: s.scene(), linje: document.getElementById('gaadeLinje').textContent }; });
  tjek('G4d: kontakten "Kun det synlige trækker" får de yderste stjerner til at flyve væk, og slået fra kommer de tilbage',
    til.tændt === 'true' && til.sc.galakse.ude > 30 && /flyver væk/.test(til.linje) && fra.sc.galakse.ude === 0 && fra.sc.galakse.tilstand === 'kreds' && /holder sammen/.test(fra.linje),
    JSON.stringify({ til: til.sc.galakse, fra: fra.sc.galakse }));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  await vent(page, () => atomlabTest.gaader.scene().scene()?.tilstand === 'buer');
  // En klump lige foran den galakse, der står bag midten, giver en ring: mange prikker forstærket over 1,5 gange
  const bøjet = await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(0.25, 0.15); return { sc: s.scene(), linje: document.getElementById('gaadeLinje').textContent }; });
  const væk = await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(-8.8, 5.8); return s.scene(); });
  tjek('G4d: efter gættet bøjer den usynlige klump lyset fra galakserne bagved til en ring, hvor man trykker',
    bøjet.sc.trukket && bøjet.sc.buer.buer > 40 && bøjet.sc.buer.største > 5 && bøjet.linje === 'Du kan ikke se det. Du kan se, hvad det gør.' && væk.linse[0] < -8,
    JSON.stringify({ buer: bøjet.sc.buer, linse: væk.linse }));
  await page.click('#gaadeSceneKnapper [data-id="galakse"]');
  const tilbage = await S();
  await page.click('#gaadeSceneKnapper [data-id="buer"]');
  tjek('G4d: efter gættet kan man skifte mellem galaksen og lysbøjningen', tilbage.tilstand === 'galakse' && (await S()).tilstand === 'buer');
  await page.click('#gaadeTrin .fl-næste');
  const lzFør = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(2); return s.scene().lz; });
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); // "Målt" er forkert, men stemplet viser sandheden: GÆT
  const lz = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(8); return { lz: s.scene().lz, linje: document.getElementById('gaadeLinje').textContent }; });
  tjek('G4d trin 2: LZ venter uden glimt, og efter gættet lander GÆT, ét glimt kommer, og måleren står på 2,6 af 5 sigma',
    lzFør && !lzFør.gættet && !lzFør.glimt && !lzFør.måler && lz.lz.stempel && lz.lz.glimt && lz.lz.måler && Math.abs(lz.lz.fyld - 2.6) < 0.01 && /ikke nok/.test(lz.linje),
    JSON.stringify({ lzFør, lz }));
  await page.click('#gaadeTrin .fl-næste');
  const kort = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(3); return s.scene().kort; });
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  await page.click('#gaadeTrin .fl-næste');
  const ven = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('G4d trin 3: buerne og kortet over det mørke stof (stiplet) med Euclid, og til sidst "Sig det til en ven"',
    kort?.kort && kort.euclid && kort.buer > 40 && kort.ringe === 9 && ven.startsWith('Sig det til en ven: Der er ca. fem gange'), JSON.stringify({ kort, ven }));
  await page.click('#gaadeTrin [data-alle]');
  tjek('G4d: "Alle gåder" rydder scenen', await vent(page, () => atomlabTest.gaader.scene().id() === null && atomlabTest.gaader.skinne()?.vist()));
  await ctx.close();
}

// G4d: Liv andre steder i 3D: lysene år for år, Jorden, Mars og Enceladus i skala, Cheyava Falls og sonderne
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('liv'));
  const klar = await vent(page, () => atomlabTest.gaader.scene()?.scene()?.tilstand === 'lys', null, 15000);
  const S = () => T(() => atomlabTest.gaader.scene().scene());
  const undervejs = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(5); return s.scene().lys; });
  const sprang = await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(0, 0); s.spol(0.2); return { lys: s.scene().lys, linje: document.getElementById('gaadeLinje').textContent }; });
  tjek('G4d: lysene tændes år for år, og et tryk springer til 2026 med alle 6.470',
    klar && undervejs.tændt > 0 && undervejs.tændt < undervejs.i_alt && undervejs.år > 1992 && undervejs.år < 2026
    && sprang.lys.tændt === 6470 && sprang.lys.år === 2026 && /Er der liv på nogen af dem\?/.test(sprang.linje), JSON.stringify({ undervejs, sprang }));
  tjek('G4d: lysene står i deres rigtige retning: Keplers felt er en klump (over 30 % af lysene inden for 10°, tilfældigt ville give under 1 %)',
    sprang.lys.klump / sprang.lys.i_alt > 0.3, JSON.stringify({ klump: sprang.lys.klump, i_alt: sprang.lys.i_alt }));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  const skala = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(1); return s.scene(); });
  tjek('G4d: efter gættet dæmpes lysene, og Jorden, Mars og Enceladus står i samme skala (6.779 og 504 af 12.742 km)',
    skala.tilstand === 'skala' && skala.lys.dæmpet && skala.skala.vist && Math.abs(skala.skala.forhold[0] - 6779 / 12742) < 1e-6 && Math.abs(skala.skala.forhold[1] - 504 / 12742) < 1e-6,
    JSON.stringify(skala));
  await page.click('#gaadeTrin .fl-næste');
  const stenFør = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(1); return s.scene().sten; });
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); // "Målt" er forkert, men stemplet viser sandheden: GÆT
  const sten = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(2); return s.scene().sten; });
  tjek('G4d trin 2: Cheyava Falls uden forklaringer før gættet, og bagefter GÆT og de to stiplede forklaringer',
    stenFør && !stenFør.forklaringer && !stenFør.stempel && sten.stempel && sten.forklaringer && sten.kasser === 2, JSON.stringify({ stenFør, sten }));
  // Fund fra telefonen (19. november 2026): fotoet åbnes stort med knappen, hentes i fuld størrelse og kan zoomes. Esc
  // lukker kun fotoet, ikke kortet, og et tryk på fotoet i scenen åbner det igen
  await page.click('#gaadeSceneKnapper [data-id="storfoto"]');
  const stort = await vent(page, () => atomlabTest.gaader.scene().scene().storFoto?.stor, null, 10000) && await T(() => atomlabTest.gaader.scene().scene().storFoto);
  const boks = await page.locator('#gaader .gaade-storfoto-flade').boundingBox();
  await page.mouse.move(boks.x + boks.width / 2, boks.y + boks.height / 2);
  await page.mouse.wheel(0, -400);
  const zoomet = await T(() => atomlabTest.gaader.scene().scene().storFoto?.skala ?? 0);
  await page.keyboard.press('Escape');
  const lukket = await T(() => ({ foto: atomlabTest.gaader.scene().scene().storFoto, kort: atomlabTest.gaader.vist()?.id, boks: Boolean(document.querySelector('#gaader .gaade-storfoto')) }));
  const igen = await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(-3.2, 0.6); return Boolean(s.scene().storFoto); });
  await T(() => document.querySelector('#gaader .gaade-storfoto-luk').click());
  tjek('Fund: fotoet af Cheyava Falls åbnes stort (1608 punkter bredt), kan zoomes med hjulet, Esc lukker kun fotoet, og et tryk på fotoet åbner det',
    stort && stort.bredde === 1608 && zoomet > 1.2 && !lukket.foto && !lukket.boks && lukket.kort === 'liv' && igen, JSON.stringify({ stort, zoomet, lukket, igen }));
  await page.click('#gaadeTrin .fl-næste');
  const sonder = await T(() => { const s = atomlabTest.gaader.scene(); s.spol(2); return s.scene().sonder; });
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  await page.click('#gaadeTrin .fl-næste');
  const ven = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('G4d trin 3: sonderne med stiplede baner, og til sidst "Sig det til en ven"', sonder?.baner === 4 && ven.startsWith('Sig det til en ven: Forskerne kender'), JSON.stringify({ sonder, ven }));
  // Fotoet af stenen er hentet uden fejl (det står i KILDER.md)
  const foto = await T(async () => (await fetch('billeder/gaader/cheyava-falls.jpg')).ok);
  tjek('G4d: fotoet af Cheyava Falls findes og står i billeder/gaader/KILDER.md', foto && readFileSync(new URL('../billeder/gaader/KILDER.md', import.meta.url), 'utf8').includes('cheyava-falls.jpg') && readFileSync(new URL('../billeder/gaader/KILDER.md', import.meta.url), 'utf8').includes('PIA26368'));
  await ctx.close();
}

// Planet 9 i 3D: de seks baner tegnes, Planet 9 som stiplet bud, alle de godt målte baner og 2017 OF201, og Rubin
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('planet9'));
  const klar = await vent(page, () => atomlabTest.gaader.scene()?.scene()?.tilstand === 'seks', null, 15000);
  const S = (sek) => T((s) => { const sc = atomlabTest.gaader.scene(); sc.spol(s); return sc.scene(); }, sek);
  const undervejs = (await S(1)).kort;
  const sprang = await T(() => { const s = atomlabTest.gaader.scene(); s.tryk(0, 0); s.spol(0.5); return { kort: s.scene().kort, linje: document.getElementById('gaadeLinje').textContent }; });
  tjek('Planet 9: de seks baner tegnes én ad gangen, et tryk tegner dem færdige, og linjen siger "samme side"',
    klar && undervejs.seks < 6 && !undervejs.planet && sprang.kort.seks === 6 && sprang.kort.tegnet && /samme side/.test(sprang.linje), JSON.stringify({ undervejs, sprang }));
  tjek('Planet 9: småkloderne går mod uret set oppefra (som planeterne), og de seks kommer tættest på Solen til højre på kortet (inden for 70°)',
    sprang.kort.mod === 6 && sprang.kort.med === 0 && sprang.kort.år > 0 && sprang.kort.retning.every((r) => Math.abs(r) < 70), JSON.stringify(sprang.kort));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); // "Ja, Pluto"
  const bud = await T(() => ({ kort: atomlabTest.gaader.scene().scene().kort, linje: document.getElementById('gaadeLinje').textContent, efter: document.querySelector('.gaade-efter')?.textContent }));
  tjek('Planet 9: efter gættet står Planet 9 som stiplet bud (ca. 374 AU ude på det fjerneste), og "Ja, Pluto" får at vide, at Pluto er en dværgplanet',
    bud.kort.planet && bud.kort.fjernest[0] === 374 && bud.kort.fjernest[1] && /stiplede klode/.test(bud.linje) && /dværgplanet/.test(bud.efter), JSON.stringify(bud));
  await page.click('#gaadeTrin .fl-næste');
  const flere = (await S(1)).kort;
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); // "Målt" er forkert, men stemplet viser sandheden: GÆT
  const svar = (await S(2)).kort;
  tjek('Planet 9 trin 2: alle de godt målte baner og 2017 OF201 før gættet, og bagefter GÆT og de to stiplede forklaringer',
    flere.andre >= 14 && flere.of201 && !flere.stempel && !flere.forklaringer && svar.stempel && svar.forklaringer && svar.kasser === 2 && svar.mod === svar.andre + 6, JSON.stringify({ flere, svar }));
  await page.click('#gaadeTrin .fl-næste');
  const r1 = (await S(0.2)).rubin;
  const r2 = (await S(3)).rubin;
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  await page.click('#gaadeTrin .fl-næste');
  const ven = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('Planet 9 trin 3: Rubin fotograferer himlen felt for felt, og til sidst "Sig det til en ven"',
    r1?.felter > 30 && r2.fotograferet > r1.fotograferet && ven.startsWith('Sig det til en ven: Måske er der en planet mere'), JSON.stringify({ r1, r2, ven }));
  await ctx.close();
}

// Sort hul i 3D (G4c): linsen fra Kosmos, tonen og kurven efter gættet, flyvningen hen til horisonten, de to kanter og LISA
{
  const { page, ctx } = await nySide({ viewport: { width: 1280, height: 800 } }, '#gaader');
  const T = (f, a) => page.evaluate(f, a);
  await vent(page, påSkinne, null, 15000);
  await T(() => atomlabTest.gaader.visGåde('sorthul'));
  const klar = await vent(page, () => (atomlabTest.gaader.scene()?.scene()?.lampe?.tegnet ?? 0) > 0, null, 15000);
  const S = (sek) => T((s) => { const sc = atomlabTest.gaader.scene(); sc.spol(s); return sc.scene(); }, sek);
  const før = await S(0.2);
  tjek('G4c trin 1: hullet er linsen fra Kosmos, man kan flyve rundt om det, og kurven er skjult før gættet',
    klar && før.tilstand === 'hul' && før.drejer && før.lampe.linse && !før.bølge.ses, JSON.stringify(før));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]');
  const undervejs = (await S(0.3)).bølge;
  const tone = await S(1.2);
  const knap = await T(() => document.querySelector('#gaadeSceneKnapper button')?.textContent ?? '');
  tjek('G4c trin 1: efter gættet tegnes tyngdebølgen, mens tonen spiller (35 → 150 → 250 Hz), og der er en knap til at høre den igen',
    undervejs.ses && undervejs.tegnet < 1 && tone.bølge.tegnet === 1 && tone.bølge.fra === 35 && tone.bølge.top === 150 && tone.bølge.ring === 250
    && tone.bølge.svingninger >= 7 && tone.bølge.svingninger <= 12 && /Hør/.test(knap), JSON.stringify({ undervejs, tone: tone.bølge, knap }));
  await page.click('#gaadeTrin .fl-næste');
  const ind = await S(0.5);
  const inde = await S(3);
  const linjeInde = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('G4c trin 2: man flyver hen mod horisonten (ingen drejning), skærmen tones sort, og ringen står uden teorien før gættet',
    ind.tilstand === 'ind' && !ind.drejer && ind.sort < 1 && inde.tilstand === 'inde' && inde.sort === 1 && !inde.hulSes && inde.kanter.horisont
    && !inde.kanter.teori && !inde.kanter.stempel && /horisonten/.test(linjeInde), JSON.stringify({ ind, inde }));
  await page.click('#gaadeTrin .fl-gæt[data-gaet="0"]'); // "Målt" er forkert, men stemplet viser sandheden: GÆT
  const svar = (await S(2)).kanter;
  tjek('G4c trin 2: efter gættet GÆT og teorien som stiplet tekst (67 sekunder og "uendelig"), og stregen toner ud før midten (intet punkt)',
    svar.stempel && svar.teori && svar.tekster.length === 2 && svar.slut > 0.3 && svar.sidsteLys < 0.01, JSON.stringify(svar));
  await page.click('#gaadeTrin .fl-næste');
  const l1 = (await S(0.3)).lisa;
  const l2 = (await S(1)).lisa;
  await page.click('#gaadeTrin .fl-gæt[data-gaet="1"]');
  await page.click('#gaadeTrin .fl-næste');
  const ven = await T(() => document.getElementById('gaadeLinje').textContent);
  tjek('G4c trin 3: LISA er tre satellitter ca. 20° bag Jorden, armene bliver længere og kortere, og til sidst "Sig det til en ven"',
    l1?.ses && l1.sonder === 3 && l1.bag === 20 && l2.bølget > 0.02 && ven.startsWith('Sig det til en ven: Sorte huller er målt'), JSON.stringify({ l1, l2, ven }));
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
