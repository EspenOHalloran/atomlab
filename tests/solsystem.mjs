// Solsystemet (Mars M4a og M4b): menukortet, listen med Solen, Jorden, Mars og Saturn (Solen og Jorden med egne visninger), flytningen af gemte data fra Kosmos,
// links til de flyttede fænomener og layoutet af menuen og listen på pc, tablet og telefon.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('solsystem');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const FLYTTET = ['solstorm', 'solensfremtid', 'aarstider', 'formoerkelser', 'mars', 'saturn'];
const ALLE = ['solen', 'solstorm', 'solensfremtid', 'jorden', 'aarstider', 'formoerkelser', 'mars', 'saturn'];

async function side(vp, gemt, opt = {}) {
  const s = await (await b.newContext({ viewport: vp, ...opt })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  if (gemt) await s.addInitScript((g) => { if (!sessionStorage.getItem('sat')) { sessionStorage.setItem('sat', '1'); for (const [k, v] of Object.entries(g)) localStorage.setItem(k, v); } }, gemt);
  await s.goto(`${ADRESSE}/?test`);
  await s.waitForFunction(() => window.atomlabTest);
  return s;
}
const vis = (s, skærm) => s.evaluate((sk) => { location.hash = `#${sk}`; }, skærm).then(() => s.waitForFunction((sk) => document.querySelector(`#${sk}:not(.skjult)`), skærm));

// ---------- Gemte data flytter med fra Kosmos ----------
{
  const s = await side({ width: 1280, height: 800 }, { atomlabKosmos: 'saturn', atomlabKosmosSet: JSON.stringify(['bigbang', 'mars', 'saturn']) });
  const kort = await s.evaluate(() => [...document.querySelectorAll('.menukort .kort')].map((k) => [k.getAttribute('href'), k.querySelector('.kort-fremgang')?.textContent]));
  const i = kort.findIndex(([h]) => h === '#solsystem');
  tjek('menuen: Solsystemet står lige før Kosmos', i >= 0 && kort[i + 1][0] === '#kosmos', JSON.stringify(kort));
  tjek('menuen: 2/8 set i Solsystemet og 1/11 i Kosmos', kort[i][1] === '2/8 set' && kort[i + 1][1] === '1/11 set', JSON.stringify(kort));
  await vis(s, 'solsystem');
  const sol = await s.evaluate(() => ({ valgt: atomlabTest.solsystem.valgt(), set: document.getElementById('solsystemSet').textContent, ider: atomlabTest.solsystem.fænomener }));
  tjek('det sidst valgte (Saturn) åbner i Solsystemet', sol.valgt === 'saturn', JSON.stringify(sol));
  tjek('Solsystemet: 2 af 8 set', sol.set === '2 af 8 set', sol.set);
  tjek('Solsystemet har Solen, Jorden og de seks flyttede fænomener i rækkefølge', sol.ider.join() === ALLE.join(), JSON.stringify(sol.ider));
  const prikker = await s.evaluate(() => [...document.querySelectorAll('#solsystem .kosmos-valg.ny')].map((k) => k.dataset.id));
  tjek('de sete (Mars og Saturn) har ingen prik', !prikker.includes('mars') && !prikker.includes('saturn') && prikker.includes('solstorm'), JSON.stringify(prikker));
  await vis(s, 'kosmos');
  const kos = await s.evaluate(() => ({ valgt: atomlabTest.kosmos.valgt(), set: document.getElementById('kosmosSet').textContent, gemt: JSON.parse(localStorage.getItem('atomlabKosmosSet')) }));
  tjek('Kosmos starter på Big Bang og har 1 af 11 set', kos.valgt === 'bigbang' && kos.set === '1 af 11 set', JSON.stringify(kos));
  tjek('de flyttede er væk fra Kosmos\' gemte liste', !kos.gemt.some((id) => FLYTTET.includes(id)), JSON.stringify(kos.gemt));
  // Linket under Kosmos-listen og linket i Hvid dværg
  tjek('Kosmos: linket til Solsystemet under listen', await s.isVisible('#kosmos .kosmos-videre'));
  await s.click('#kosmos .kosmos-videre');
  await s.waitForFunction(() => document.querySelector('#solsystem:not(.skjult)'));
  tjek('linket åbner Solsystemet', true);
  await vis(s, 'kosmos');
  await s.click('#kosmos .kosmos-valg[data-id="hviddvaerg"]');
  await s.click('#kosmosTekst [data-gaa="solsystem:solensfremtid"]');
  await s.waitForFunction(() => document.querySelector('#solsystem:not(.skjult)'));
  tjek('Hvid dværg: "Solens fremtid" åbner Solens fremtid i Solsystemet', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'solensfremtid');
  await s.context().close();
}

// ---------- Listen, hjælpen og grundstofkortets link (pc) ----------
{
  const s = await side({ width: 1280, height: 800 });
  await vis(s, 'solsystem');
  const liste = await s.evaluate(() => [...document.querySelectorAll('#solsystemListe .sol-gruppe')].map((g) => ({
    hoved: g.querySelector('.sol-hoved .kosmos-valg-navn').textContent,
    under: [...g.querySelectorAll('.sol-punkt')].map((k) => k.dataset.id),
  })));
  tjek('listen: Solen, Jorden, Mars og Saturn (efter afstanden til Solen)', liste.map((g) => g.hoved).join() === 'Solen,Jorden,Mars,Saturn', JSON.stringify(liste));
  tjek('under Solen: Solstorm og Solens fremtid', liste[0].under.join() === 'solstorm,solensfremtid');
  tjek('under Jorden: Årstiderne og Formørkelser', liste[1].under.join() === 'aarstider,formoerkelser');
  tjek('første gang åbner Solen', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'solen');
  await s.click('#solsystem .sol-gruppe[data-gruppe="1"] .sol-hoved');
  tjek('et tryk på Jorden åbner Jordens egen visning', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'jorden');
  tjek('Jordens gruppe er åben og markeret', await s.evaluate(() => { const g = document.querySelector('#solsystem .sol-gruppe[data-gruppe="1"]'); return g.classList.contains('åben') && g.querySelector('.sol-hoved').classList.contains('valgt'); }));
  tjek('underpunkterne står fremme på pc', await s.isVisible('#solsystem .sol-punkt[data-id="solstorm"]'));
  await s.click('#solsystem .kosmos-valg[data-id="mars"]');
  tjek('Mars kan vælges', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'mars' && (await s.textContent('#solsystemNavn')) === 'Mars');
  await s.screenshot({ path: `${UD}/pc-mars.png` });
  await s.click('#solsystemHjælp');
  tjek('hjælpen vises', await s.isVisible('#hjælpSolsystem'));
  await s.keyboard.press('Escape');
  // Pausen hører til skærmen
  await s.click('#solsystemPause');
  tjek('pause i Solsystemet', await s.evaluate(() => atomlabTest.solsystem.pause()));
  await s.click('#solsystemPause');
  // Grundstofkortet for carbon linker til Solens fremtid
  await vis(s, 'system');
  await s.evaluate(() => atomlabTest.system.åbn(6));
  await s.click('#sysMere summary').catch(() => {});
  await s.click('button:has-text("Solsystemet: Solens fremtid")');
  await s.waitForFunction(() => document.querySelector('#solsystem:not(.skjult)'));
  tjek('grundstofkortet: "Solsystemet: Solens fremtid" åbner det', (await s.evaluate(() => atomlabTest.solsystem.valgt())) === 'solensfremtid');
  // Tilbage til menuen rydder op
  await s.click('#solsystem a[href="#"]');
  await s.waitForFunction(() => document.querySelector('#menu:not(.skjult)'));
  tjek('Solsystemet ryddet', (await s.evaluate(() => atomlabTest.solsystem.antalObjekter())) === 1);
  await s.context().close();
}

// ---------- Menuen og listen i alle størrelser ----------
const STØRRELSER = [
  ['pc', { width: 1440, height: 900 }, 4],
  ['tablet-langs', { width: 1180, height: 820 }, 4],
  ['tablet-hoejkant', { width: 820, height: 1180 }, 2],
  ['telefon', { width: 390, height: 844 }, 1],
  ['telefon-langs', { width: 844, height: 390 }, 4],
];
for (const [navn, vp, kol] of STØRRELSER) {
  const s = await side(vp, null, navn === 'pc' ? {} : { hasTouch: true, isMobile: true });
  const kort = await s.evaluate(() => [...document.querySelectorAll('.menukort .kort')].map((k) => { const r = k.getBoundingClientRect(); return { x: r.left, y: Math.round(r.top), b: r.width }; }));
  const rækker = [...new Set(kort.map((k) => k.y))];
  const iFørste = kort.filter((k) => k.y === rækker[0]).length;
  tjek(`${navn}: menuen har ${kol} kolonner`, iFørste === kol, JSON.stringify(kort));
  // Den sidste række står i midten
  const sidste = kort.filter((k) => k.y === rækker.at(-1));
  const midt = (sidste[0].x + sidste.at(-1).x + sidste.at(-1).b) / 2;
  const alleMidt = (Math.min(...kort.map((k) => k.x)) + Math.max(...kort.map((k) => k.x + k.b))) / 2;
  tjek(`${navn}: den sidste række står i midten`, Math.abs(midt - alleMidt) < 3, `${midt} ${alleMidt}`);
  await s.screenshot({ path: `${UD}/${navn}-menu.png` });
  await vis(s, 'solsystem');
  await s.evaluate(() => atomlabTest.solsystem.vælg('formoerkelser'));
  await s.waitForTimeout(400);
  const hoveder = await s.evaluate(() => [...document.querySelectorAll('#solsystem .sol-hoved')].map((k) => { const r = k.getBoundingClientRect(); return { y: Math.round(r.top), x: Math.round(r.left), synlig: r.width > 0 }; }));
  if (navn === 'telefon') {
    tjek('telefon: de fire kloder står på én række', new Set(hoveder.map((h) => h.y)).size === 1 && hoveder.every((h) => h.synlig), JSON.stringify(hoveder));
    tjek('telefon: kun Jordens underpunkter vises', (await s.isVisible('#solsystem .sol-punkt[data-id="aarstider"]')) && !(await s.isVisible('#solsystem .sol-punkt[data-id="solstorm"]')));
  } else {
    tjek(`${navn}: kloderne står under hinanden, og alle underpunkter vises`, hoveder.every((h, i) => i === 0 || h.y > hoveder[i - 1].y) && (await s.isVisible('#solsystem .sol-punkt[data-id="solstorm"]')), JSON.stringify(hoveder));
  }
  const vindue = await s.evaluate(() => document.getElementById('solsystemVindue').getBoundingClientRect().height);
  tjek(`${navn}: 3D-billedet har plads`, vindue > 150, vindue);
  await s.screenshot({ path: `${UD}/${navn}-solsystem.png` });
  await s.context().close();
}

console.log(fejl.length ? 'Konsol: ' + fejl.join(' | ') : 'Konsol: ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0);
