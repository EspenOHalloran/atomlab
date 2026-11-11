// Billeder til det store eftersyn (E0 i docs/plan-fable-eftersyn.md): menuen med hver verden forrest, alle dele, et udvalg
// af fænomenerne, forløb i træk og lagene ("Hvorfor?" og "For nørder"). Afløser fable-billeder.mjs (F0), hvis billeder
// bliver liggende i docs/fable/billeder/.
// Brug: node tests/vaerktoejer/eftersyn-billeder.mjs [mappe]   (standard: docs/fable/eftersyn/billeder/, ca. 25 minutter)
//       KUN=menu,dele,faenomener,forloeb,lag vælger afsnit. VENT=5000 er ventetiden, før et billede tages (ms).
// Billederne gemmes som JPG med en liste (LISTE.md), der siger, hvad hvert billede viser. Mappen tømmes først.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, ADRESSE, ARGS } from '../hjaelp.mjs';

const UD = resolve(process.argv[2] ?? fileURLToPath(new URL('../../docs/fable/eftersyn/billeder/', import.meta.url))) + '/';
rmSync(UD, { recursive: true, force: true });
mkdirSync(UD, { recursive: true });
// [bredde, højde, touch]. Touch giver LAV_KVALITET som på en rigtig tablet
const STØRRELSER = { pc: [1440, 900, false], tablangs: [1280, 800, true], tabhoej: [800, 1280, true], tlf: [390, 844, true] };
const NAVN = { pc: 'pc 1440 × 900', tablangs: 'tablet på langs 1280 × 800', tabhoej: 'tablet på højkant 800 × 1280', tlf: 'telefon 390 × 844' };
const VENT = Number(process.env.VENT ?? 5000);
const KUN = process.env.KUN?.split(',');
const med = (afsnit) => !KUN || KUN.includes(afsnit);
const liste = [];
const fejl = [];
const mangler = [];
let nr = 0;
let afsnit = '';

const b = await chromium.launch({ args: ARGS, fuldGrafik: true }); // billederne skal se ud som i spillet

async function nySide(størrelse, { guider = false } = {}) {
  const [w, h, touch] = STØRRELSER[størrelse];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push(`${størrelse} pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') fejl.push(`${størrelse} ${m.text()}`); });
  await page.goto(`${ADRESSE}/?test`);
  // Guiderne og rejsen ind i Solen er set, så de ikke dækker billedet (undtagen når guider er sand)
  if (!guider) {
    await page.evaluate(() => localStorage.setItem('atomlabGuide', JSON.stringify({ fusion: 1, 'fusion-rejse': 1, 'reaktor-kerne': 1, 'reaktor-kæde': 1, batteri: 1 })));
    await page.reload();
  }
  await page.waitForFunction(() => window.atomlabTest);
  page.størrelse = størrelse;
  return page;
}

async function gåTil(page, skærm) {
  await page.evaluate((s) => { location.hash = s; }, skærm);
  await page.waitForTimeout(1500);
}

async function skud(page, navn, tekst) {
  const fil = `${String(++nr).padStart(3, '0')}-${navn}-${page.størrelse}.jpg`;
  await page.screenshot({ path: UD + fil, type: 'jpeg', quality: 75, timeout: 180000 }); // Stå på Mars tegner langsomt
  liste.push(`| ${fil} | ${NAVN[page.størrelse]} | ${tekst} |`);
  console.log(fil);
}

// Kører et skridt, og skriver det i listen, hvis det ikke kunne lade sig gøre (så resten kan fortsætte)
async function prøv(hvad, f) {
  try { await f(); } catch (e) { mangler.push(`- ${hvad}: ${e.message.split('\n')[0]}`); console.log('MANGLER', hvad, e.message.split('\n')[0]); }
}

const sk = (page, id) => page.evaluate((id) => (atomlabTest.solsystem.fænomener.includes(id) ? 'solsystem' : 'kosmos'), id);
async function vælg(page, id) {
  const s = await sk(page, id);
  if (!(await page.evaluate(() => location.hash))?.includes(s)) await gåTil(page, `#${s}`);
  await page.evaluate(([id, s]) => atomlabTest[s].vælg(id), [id, s]);
  return s;
}

// ---------- 1. Menuen: hver verden forrest ----------
if (med('menu')) {
  for (const størrelse of ['pc', 'tabhoej', 'tablangs', 'tlf']) {
    const page = await nySide(størrelse);
    await page.waitForTimeout(VENT);
    const verdener = await page.evaluate(() => atomlabTest.karrusel.verdener().map((v) => v.id));
    // På pc og tablet på højkant alle verdener, ellers kun den første og Rummet
    const valgte = ['pc', 'tabhoej'].includes(størrelse) ? verdener : ['atomer', 'rummet'];
    for (const id of valgte) {
      await prøv(`menuen med ${id} forrest (${størrelse})`, async () => {
        await page.click(`.menu-ikon[data-verden="${id}"]`);
        await page.waitForFunction(() => atomlabTest.karrusel.stille(), null, { timeout: 10000 });
        await page.waitForTimeout(1500);
        await skud(page, `menu-${id}`, `Menuen (ringen) med verdenen "${id}" forrest`);
      });
    }
    await page.context().close();
  }
}

// ---------- 2. Delene ----------
const DELE = [
  ['vaerksted', '#vaerksted', 'Atomværkstedet, "Byg et atom", med carbon-12 (6 p, 6 n, 6 e)'],
  ['molekyle', '#vaerksted', 'Atomværkstedet, "Byg et molekyle" (Del elektroner), som man møder det'],
  ['system', '#system', 'Det periodiske system: den buede væg'],
  ['fusion', '#fusion', 'Stjerneovnen, når man kommer ind (guiden og rejsen ind i Solen er sprunget over)'],
  ['reaktor', '#reaktor', 'Reaktoren, del 1 "Spalt én kerne"'],
  ['batteri', '#batteri', 'Batteriet under opladning (ca. halvt), guiden sprunget over'],
  ['liv', '#liv', 'Liv, som man møder det (cellen)'],
  ['solsystem', '#solsystem', 'Solsystemet, som man møder det'],
  ['kosmos', '#kosmos', 'Kosmos, som man møder det'],
  ['ordbog', '#ordbog', 'Ordbogen (Biblioteket)'],
];
async function byg(page, p, n, e) {
  await page.click('#knapRyd');
  await page.evaluate(() => atomlabTest.vaerksted.spol(2));
  for (const [tast, antal] of [['p', p], ['n', n], ['e', e]]) for (let i = 0; i < antal; i++) await page.keyboard.press(tast);
  await page.evaluate(() => atomlabTest.vaerksted.spol(4));
}
async function forbered(page, navn) {
  if (navn === 'vaerksted') await byg(page, 6, 6, 6);
  if (navn === 'molekyle') await page.click('[data-vaerksted-del="molekyle"]');
  if (navn === 'batteri') await page.evaluate(() => { atomlabTest.batteri.tilstand('oplad'); atomlabTest.batteri.kør(7); });
}
if (med('dele')) {
  for (const størrelse of ['pc', 'tabhoej', 'tablangs', 'tlf']) {
    const page = await nySide(størrelse);
    for (const [navn, hash, tekst] of DELE) {
      // Alle dele på pc og tablet på højkant, de vigtigste også på tablet på langs og telefon
      if (['tablangs', 'tlf'].includes(størrelse) && !['vaerksted', 'molekyle', 'fusion', 'liv', 'solsystem', 'kosmos'].includes(navn)) continue;
      await prøv(`${navn} (${størrelse})`, async () => {
        await gåTil(page, hash);
        await forbered(page, navn);
        await page.waitForTimeout(VENT);
        await skud(page, navn, tekst);
      });
      if (navn === 'molekyle') await page.click('[data-vaerksted-del="atom"]').catch(() => {});
    }
    await page.context().close();
  }
  // Første besøg som ny bruger: Stjerneovnen med guiden og rejsen ind i Solen, og Batteriet med guiden
  const ny = await nySide('pc', { guider: true });
  await prøv('Stjerneovnen første gang', async () => {
    await gåTil(ny, '#fusion');
    await ny.waitForTimeout(2500);
    await skud(ny, 'fusion-foerste-gang-a', 'Stjerneovnen første gang: rejsen ind i Solen');
    await ny.waitForTimeout(9000);
    await skud(ny, 'fusion-foerste-gang-b', 'Stjerneovnen første gang: lidt senere (guiden)');
  });
  await prøv('Batteriet første gang', async () => {
    await gåTil(ny, '#batteri');
    await ny.waitForTimeout(VENT);
    await skud(ny, 'batteri-foerste-gang', 'Batteriet første gang (med guiden)');
  });
  await ny.context().close();
}

// ---------- 3. Fænomenerne i Solsystemet og Kosmos på pc ----------
// [id, knapper i bjælken, sekunder der spoles, tekst]
const FÆNOMENER = [
  ['solen', [], 2, 'Solsystemet: Solen'],
  ['venus', [], 2, 'Solsystemet: Venus'],
  ['jorden', [], 2, 'Solsystemet: Jorden'],
  ['aarstider', [], 2, 'Solsystemet: Årstiderne (under Jorden)'],
  ['formoerkelser', ['Næste'], 3, 'Solsystemet: Formørkelser (under Jorden), solformørkelse'],
  ['mars', [], 2, 'Solsystemet: Mars'],
  ['jupiter', [], 2, 'Solsystemet: Jupiter'],
  ['saturn', [], 2, 'Solsystemet: Saturn'],
  ['uranus', [], 2, 'Solsystemet: Uranus'],
  ['neptun', [], 2, 'Solsystemet: Neptun'],
  ['bigbang', ['Start universet', 'Næste', 'Næste', 'Næste'], 4, 'Kosmos: Big Bang efter nogle trin med "Næste"'],
  ['stjernefoedsel', [], 3, 'Kosmos: Ny stjerne'],
  ['supernova', ['Vis lagene'], 2, 'Kosmos: Supernova med lagene vist'],
  ['kilonova', ['Lad dem støde sammen'], 4, 'Kosmos: Kilonova'],
  ['rumtid', ['Læg et sort hul', 'Skyd en planet ind'], 4, 'Kosmos: Rumtid (gummidugen)'],
  ['sorthul', [], 2, 'Kosmos: Sort hul (lysbøjningen)'],
  ['kvasar', [], 2, 'Kosmos: Kvasar'],
  ['tid', [], 2, 'Kosmos: Rejsen i tid (før afgang)'],
  ['tidhvorfor', [], 2, 'Kosmos: "Hvorfor går tiden langsommere?", scene 1 (toget)'],
];
if (med('faenomener')) {
  const page = await nySide('pc');
  for (const [id, knapper, sek, tekst] of FÆNOMENER) {
    await prøv(`fænomenet ${id}`, async () => {
      const s = await vælg(page, id);
      await page.waitForTimeout(VENT);
      for (const t of knapper) await page.evaluate(([t, s]) => atomlabTest[s].trykPå(t), [t, s]);
      await page.evaluate(([sek, s]) => { atomlabTest[s].spol(sek); atomlabTest[s].kameraFrem?.(); }, [sek, s]);
      await page.waitForTimeout(2500);
      await skud(page, `faen-${id}`, tekst);
    });
  }
  // Stå på Mars ved Gale (Naukluft)
  await prøv('Stå på Mars', async () => {
    await vælg(page, 'mars');
    await page.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort, null, { timeout: 60000 });
    await page.evaluate(() => atomlabTest.solsystem.fænomen().besøgSted('gale'));
    await page.evaluate(() => atomlabTest.solsystem.fænomen().hop());
    await page.waitForFunction(() => atomlabTest.solsystem.knapper().includes('🧍 Stå på Mars'), null, { timeout: 20000 });
    await page.evaluate(() => [...document.querySelectorAll('#solsystemBjælke button')].find((k) => k.textContent.trim().startsWith('🧍 Stå på Mars')).click());
    await page.evaluate(() => atomlabTest.solsystem.fænomen().hop());
    await page.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 90000, polling: 200 });
    await page.evaluate(() => atomlabTest.solsystem.fænomen().hop());
    await page.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander, null, { timeout: 30000, polling: 200 });
    await page.waitForTimeout(VENT + 3000);
    await skud(page, 'staa-paa-mars', 'Solsystemet: Stå på Mars ved Gale (Naukluft), efter landingen');
  });
  await page.context().close();
}

// ---------- 4. Forløb i træk på pc ----------
if (med('forloeb')) {
  const page = await nySide('pc');

  await prøv('fusion med "Vis mig"', async () => {
    await gåTil(page, '#fusion');
    await page.waitForTimeout(3000);
    await page.evaluate(() => atomlabTest.fusion.visMig());
    for (const [sek, del] of [[1.5, 1], [2.7, 2], [1.4, 3]]) {
      await page.evaluate((s) => atomlabTest.fusion.spolAlt(s), sek);
      await page.waitForTimeout(1500);
      await skud(page, `forl-fusion-${del}`, `Stjerneovnen, "Vis mig" ${del}/3`);
    }
  });

  await prøv('kædereaktion med "Vis mig"', async () => {
    await gåTil(page, '#reaktor');
    await page.click('.del-knap[data-del="kæde"]');
    await page.waitForTimeout(3000);
    await page.evaluate(() => atomlabTest.reaktor.visMig());
    for (const [sek, del] of [[2, 1], [8, 2], [14, 3]]) {
      await page.evaluate((s) => atomlabTest.reaktor.spol(s), sek);
      await page.waitForTimeout(1500);
      await skud(page, `forl-kaede-${del}`, `Reaktoren, Kædereaktion med "Vis mig" ${del}/3`);
    }
  });

  await prøv('knaldgassen', async () => {
    await gåTil(page, '#vaerksted');
    await page.click('[data-vaerksted-del="molekyle"]');
    await page.click('#bygKnaldgas');
    await page.waitForTimeout(VENT);
    const KG = (f, ...a) => page.evaluate(([f, a]) => atomlabTest.vaerksted.byg.knaldgas[f](...a), [f, a]);
    await KG('spol', 6);
    await skud(page, 'forl-knaldgas-1', 'Knaldgassen 1/3: 4 H₂ og 2 O₂ i boksen, intet sker uden gnist');
    await page.click('#knaldMission .mission-vis').catch(() => page.click('#knaldGnist'));
    await KG('spol', 1.5);
    await page.waitForTimeout(1500);
    await skud(page, 'forl-knaldgas-2', 'Knaldgassen 2/3: gnisten har startet kæden');
    await KG('spol', 40);
    await page.waitForTimeout(1500);
    await skud(page, 'forl-knaldgas-3', 'Knaldgassen 3/3: kæden er færdig, 4 H₂O');
    await page.click('[data-vaerksted-del="atom"]').catch(() => {});
  });

  await prøv('flybyen ved Jupiter', async () => {
    await vælg(page, 'jupiter');
    await page.waitForFunction(() => atomlabTest.solsystem.knapper()[0] === '▶ Start flyby', null, { timeout: 60000, polling: 200 });
    await page.click('#solsystemTræ button[data-tur]');
    for (let i = 1; i <= 3; i++) {
      await page.evaluate(() => atomlabTest.solsystem.fænomen().hop());
      await page.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 15000, polling: 100 });
      await page.waitForTimeout(VENT);
      await skud(page, `forl-flyby-${i}`, `Flybyen ved Jupiter, stop ${i} af 5`);
      if (i < 3) await page.click('#solsystemBjælke button:has-text("Næste")');
    }
  });

  await prøv('"Hvorfor går tiden langsommere?", scene 2 og 5', async () => {
    await vælg(page, 'tidhvorfor');
    await page.waitForTimeout(3000);
    const næste = () => page.evaluate(() => atomlabTest.kosmos.trykPå('Næste'));
    const scene = () => page.evaluate(() => atomlabTest.kosmos.fænomen().scene());
    await næste();
    await page.waitForTimeout(VENT);
    await skud(page, 'forl-tid-1', `"Hvorfor går tiden langsommere?": scene ${(await scene()) + 1} (lysuret)`);
    await page.evaluate(() => atomlabTest.kosmos.spol(4));
    await page.waitForTimeout(2000);
    await skud(page, 'forl-tid-2', `"Hvorfor går tiden langsommere?": scene ${(await scene()) + 1}, 4 sekunder senere`);
    // Scenerne skal ses i rækkefølge: spol hver scene lidt frem, før "Næste"
    for (let i = 0; i < 3; i++) { await page.evaluate(() => atomlabTest.kosmos.spol(10)); await næste(); await page.waitForTimeout(800); }
    await page.waitForTimeout(VENT);
    await skud(page, 'forl-tid-3', `"Hvorfor går tiden langsommere?": scene ${(await scene()) + 1} (rumtidskortet)`);
  });
  await page.context().close();
}

// ---------- 5. Lagene: et åbent "Hvorfor?"-kort og "For nørder" ----------
if (med('lag')) {
  for (const størrelse of ['pc', 'tabhoej']) {
    const page = await nySide(størrelse);
    await prøv(`"Hvorfor?"-kort (${størrelse})`, async () => {
      await vælg(page, 'solstorm');
      await page.waitForTimeout(VENT);
      await page.evaluate(() => {
        const knap = document.querySelector('#solsystem .side-emne button.hvorfor');
        knap.closest('details').open = true;
        knap.scrollIntoView({ block: 'center' });
        knap.click();
      });
      await page.waitForTimeout(1500);
      await skud(page, 'lag-hvorfor', `Lag 2: et åbent "Hvorfor?"-kort (${await page.evaluate(() => atomlabTest.hvorfor.vist()?.slice(0, 40) ?? '')}) i Solstorm`);
      await page.keyboard.press('Escape');
    });
    await prøv(`"For nørder" (${størrelse})`, async () => {
      await vælg(page, 'sorthul');
      await page.waitForTimeout(VENT);
      await page.evaluate(() => {
        const d = document.querySelector('#kosmos details[data-lag="side-nørd"]');
        d.open = true;
        d.scrollIntoView({ block: 'start' });
      });
      await page.waitForTimeout(1500);
      await skud(page, 'lag-noerd', 'Lag 3: "For nørder" foldet ud ved Sort hul');
    });
    await page.context().close();
  }
}

await b.close();
writeFileSync(UD + 'LISTE.md', `# Skærmbilleder til eftersynet (E0)

Taget ${new Date().toISOString().slice(0, 10)} med \`tests/vaerktoejer/eftersyn-billeder.mjs\` i testbrowseren, der ikke har et grafikkort (den tegner med CPU'en). Gløden og farverne kan derfor se lidt anderledes ud end på en rigtig skærm, og animationerne er spolet frem (de kører ikke i realtid). Guiderne er sprunget over, undtagen på billederne "første gang". Touch-størrelserne kører med \`LAV_KVALITET\` som en rigtig tablet. Farens billeder fra en rigtig tablet ligger i [../tablet/](../tablet/LISTE.md).

| Fil | Størrelse | Hvad billedet viser |
|---|---|---|
${liste.join('\n')}

## Kunne ikke fotograferes
${mangler.length ? mangler.join('\n') : 'Intet.'}
`);
console.log(fejl.length ? `Konsolfejl:\n${[...new Set(fejl)].join('\n')}` : 'Ingen konsolfejl');
console.log(`${nr} billeder, ${mangler.length} mangler`);
