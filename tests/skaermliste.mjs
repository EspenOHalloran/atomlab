// Skærmlisten og hentning efter behov (10a, docs/arkiv/plan-skaermliste.md): menuen henter ingen skærme, fremgangen og ✓
// passer uden dem, hver skærm hentes første gang, den åbnes, og knapper, der springer mellem skærmene, virker, også
// før målet er hentet. Desuden "Henter …", tilbage under hentningen og en hentning, der fejler.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';

const b = await chromium.launch({ args: ARGS, ventPåSkærme: false }); // testen ser selv hentningen undervejs
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const SKÆRMMODULER = /\/js\/(vaerksted|system|fusion|reaktor|batteri|liv|kosmos|solsystem|ordbog|gaader|faenomenskaerm)\.js$/;

async function nySide(før) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const fejl = [];
  const hentet = [];
  p.on('pageerror', (e) => fejl.push(e.message));
  p.on('request', (r) => { if (SKÆRMMODULER.test(r.url())) hentet.push(r.url().split('/js/')[1]); });
  if (før) await før(p);
  return { p, fejl, hentet, luk: () => ctx.close() };
}
const vent = (p, f, a, ms = 60000) => p.waitForFunction(f, a, { timeout: ms, polling: 100 });
const vist = (p, id) => vent(p, (id) => window.atomlabTest?.aktiv() === id && document.querySelector(`#${id}:not(.skjult)`), id);

// 1. Menuen henter ingen skærme, men ✓ på Solsystemet passer (alle fænomenerne er set) ud fra js/data/
{
  const { p, fejl, hentet, luk } = await nySide(async (p) => {
    await p.addInitScript(async () => {
      if (sessionStorage.getItem('sat')) return;
      sessionStorage.setItem('sat', '1');
      const { FÆNOMEN_IDER } = await import('/js/data/faenomener.js');
      localStorage.setItem('atomlabSolsystemSet', JSON.stringify(FÆNOMEN_IDER.solsystem));
    });
  });
  await p.goto(`${ADRESSE}/?test`);
  await vent(p, () => window.atomlabTest && document.getElementById('menu').dataset.midt);
  tjek('menuen henter ingen skærmmoduler', hentet.length === 0, hentet.join(', '));
  tjek('ingen skærm er bygget i menuen', await p.evaluate(() => ['vaerksted', 'molekyler', 'system', 'fusion', 'reaktor', 'batteri', 'liv', 'kosmos', 'solsystem', 'ordbog', 'gaader'].every((id) => !atomlabTest.hentet(id))));
  tjek('✓ på Solsystemet uden at hente det', await p.evaluate(() => document.querySelector('#menu a[href="#solsystem"]').classList.contains('klaret')));

  // 2. Listerne over fænomener i js/data/faenomener.js passer med skærmenes egne
  await p.evaluate(() => Promise.all([atomlabTest.hent('kosmos'), atomlabTest.hent('solsystem')]));
  const lister = await p.evaluate(async () => {
    const { FÆNOMEN_IDER } = await import('/js/data/faenomener.js');
    return { data: FÆNOMEN_IDER, kosmos: atomlabTest.kosmos.fænomener, solsystem: atomlabTest.solsystem.fænomener };
  });
  tjek('fænomenerne i js/data/ passer med Kosmos og Solsystemet', JSON.stringify(lister.data.kosmos) === JSON.stringify(lister.kosmos) && JSON.stringify(lister.data.solsystem) === JSON.stringify(lister.solsystem), JSON.stringify(lister));
  tjek('ingen sidefejl i menuen', fejl.length === 0, fejl.join('\n'));
  await luk();
}

// 3. Knapper mellem skærmene, før målet er hentet: Det periodiske system → Værkstedet og en knap med data-gaa til et
// grundstof (system:55) og til et sted i Solsystemet (Olympus Mons)
{
  const { p, fejl, hentet, luk } = await nySide();
  await p.goto(`${ADRESSE}/?test#system`);
  await vist(p, 'system');
  tjek('Det periodiske system åbner som første skærm uden Værkstedet', !hentet.includes('vaerksted.js'), hentet.join(', '));
  await p.evaluate(() => atomlabTest.system.åbn(8));
  await p.click('#systemByg');
  await vist(p, 'vaerksted');
  tjek('"Byg i værkstedet" henter Værkstedet og sætter oxygen som opgave', await p.evaluate(() => document.getElementById('opgaveTekst').textContent.includes('Byg Oxygen')));

  await p.evaluate(() => {
    location.hash = '#menu';
    const knap = document.createElement('button');
    knap.dataset.gaa = 'system:55';
    knap.id = 'prøveknap';
    document.getElementById('menu').append(knap);
  });
  await vist(p, 'menu');
  await p.evaluate(() => document.getElementById('prøveknap').click());
  await vist(p, 'system');
  await vent(p, () => !document.getElementById('systemDetalje')?.classList.contains('skjult') && document.getElementById('system').textContent.includes('Cæsium'), null, 10000).catch(() => {});
  tjek('data-gaa="system:55" åbner cæsium', await p.evaluate(() => document.getElementById('system').textContent.includes('Cæsium')));

  await p.evaluate(() => {
    location.hash = '#menu';
    document.getElementById('prøveknap').dataset.gaa = 'solsystem:mars:olympus';
  });
  await vist(p, 'menu');
  await p.evaluate(() => document.getElementById('prøveknap').click());
  await vist(p, 'solsystem');
  await vent(p, () => atomlabTest.solsystem.sted?.() === 'olympus', null, 30000).catch(() => {});
  tjek('data-gaa="solsystem:mars:olympus" henter Solsystemet og går til Olympus Mons', await p.evaluate(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.sted?.() === 'olympus'), await p.evaluate(() => `${atomlabTest.solsystem.valgt()} ${atomlabTest.solsystem.sted?.()}`));
  tjek('ingen sidefejl ved springene', fejl.length === 0, fejl.join('\n'));
  await luk();
}

// 4. "Henter …" ved en langsom hentning, tilbage under hentningen og en hentning, der fejler
{
  let slip;
  let fejlHentning = true;
  const { p, fejl, luk } = await nySide(async (p) => {
    await p.route('**/js/kosmos.js', async (r) => { await new Promise((s) => { slip = s; }); await r.continue(); });
    await p.route('**/js/batteri.js', (r) => (fejlHentning ? r.abort() : r.continue()));
  });
  await p.goto(`${ADRESSE}/?test`);
  await vent(p, () => window.atomlabTest);
  await p.evaluate(() => { location.hash = '#kosmos'; });
  await vent(p, () => document.querySelector('.hentebjaelke.vist')?.textContent.includes('Henter Kosmos'), null, 20000).catch(() => {});
  tjek('"Henter Kosmos …" vises, mens Kosmos hentes', await p.evaluate(() => !!document.querySelector('.hentebjaelke.vist')));
  tjek('menuen står, mens Kosmos hentes', await p.evaluate(() => atomlabTest.aktiv() === 'menu' && !document.getElementById('menu').classList.contains('skjult')));
  await p.evaluate(() => { location.hash = '#reaktor'; }); // man går videre, før Kosmos er hentet
  await vist(p, 'reaktor');
  slip();
  await vent(p, () => atomlabTest.hentet('kosmos'));
  await p.waitForTimeout(300);
  tjek('Kosmos, der blev hentet for sent, vises ikke', await p.evaluate(() => atomlabTest.aktiv() === 'reaktor' && document.getElementById('kosmos').classList.contains('skjult') && !document.querySelector('.hentebjaelke.vist')));

  await p.evaluate(() => { location.hash = '#batteri'; });
  await vent(p, () => document.body.textContent.includes('kunne ikke hentes'), null, 15000).catch(() => {});
  tjek('en hentning, der fejler, siger det og bliver på Reaktoren', await p.evaluate(() => document.body.textContent.includes('kunne ikke hentes') && atomlabTest.aktiv() === 'reaktor' && location.hash === '#reaktor'));
  // Chrome husker en mislykket import() på siden, så beskeden beder om at genindlæse siden
  fejlHentning = false;
  await p.goto(`${ADRESSE}/?test&igen#batteri`); // en ny side (kun et nyt # ville blive på den gamle)
  await vist(p, 'batteri');
  tjek('Batteriet kan hentes, når siden er genindlæst', true);
  tjek('ingen sidefejl ud over den afbrudte hentning', fejl.every((f) => /batteri\.js|dynamically imported module/i.test(f)), fejl.join('\n'));
  await luk();
}

// 5. Hver skærm kan åbnes som den første (et link direkte til skærmen)
{
  const { p, fejl, luk } = await nySide();
  for (const id of ['vaerksted', 'fusion', 'reaktor', 'batteri', 'liv', 'kosmos', 'ordbog', 'gaader']) {
    await p.goto(`${ADRESSE}/?test#${id}`);
    await vist(p, id);
  }
  tjek('hver skærm åbner som den første uden sidefejl', fejl.length === 0, fejl.join('\n'));
  await luk();
}

await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
