// Prototypen til Solsystemet: Saturns ringe (grænser, mellemrum og tæthed), og at Saturn, Enceladus og Titan
// kan vises i Kosmos med ?saturn uden fejl. Uden ?saturn er prototypen ikke med.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { ringVed, RINGE, MELLEMRUM } from '../js/data/ringe.js';
const UD = billedmappe('saturn');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// Ringene (km fra Saturns centrum, docs/fakta-solsystemet.md)
const tau = (r) => ringVed(r).tau;
tjek('B-ringen er tættest (τ over 1 midt i)', tau(105000) > 1 && tau(105000) > tau(128000) && tau(105000) > tau(85000), tau(105000));
tjek('C-ringen og Cassini-delingen er tynde, men ikke tomme', tau(80000) > 0 && tau(80000) < 0.3 && tau(119800) > 0 && tau(119800) < 0.3, [tau(80000), tau(119800)]);
tjek('Encke- og Keeler-mellemrummet er tomme', tau(133584) === 0 && tau(136506) === 0);
tjek('mellem A- og F-ringen og uden for F-ringen er der intet', tau(138500) === 0 && tau(141500) === 0 && tau(66000) === 0);
tjek('D-ringen er næsten gennemsigtig', tau(70000) > 0 && tau(70000) < 0.02, tau(70000));
tjek('ringene ligger i rækkefølge uden overlap', RINGE.every((r, i) => r.ind < r.ud && (i === 0 || RINGE[i - 1].ud <= r.ind)) && MELLEMRUM.every((m) => m.ind > 122170 && m.ud < 136775));
tjek('Cassini-delingen er ca. 4.600 km bred', Math.abs(RINGE.find((r) => r.navn === 'Cassini-delingen').ud - RINGE.find((r) => r.navn === 'Cassini-delingen').ind - 4600) < 50);

const b = await chromium.launch({ args: ARGS });
const side = async (adresse) => {
  const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await s.goto(adresse);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'));
  return s;
};

// Uden ?saturn er prototypen ikke i listen
{
  const s = await side(`${ADRESSE}/?test#kosmos`);
  tjek('uden ?saturn: ikke i listen', !(await s.evaluate(() => document.querySelector('.kosmos-valg[data-id="saturn"]'))));
  await s.context().close();
}

// Med ?saturn: alle tre visninger og modlys
{
  const s = await side(`${ADRESSE}/?test&saturn#kosmos`);
  await s.click('.kosmos-valg[data-id="saturn"]');
  await s.waitForTimeout(1500);
  const knapper = async () => s.evaluate(() => [...document.querySelectorAll('#kosmosStyring button')].map((k) => k.textContent.trim()));
  const knapperNu = await knapper();
  tjek('med ?saturn: knapperne Saturn, Enceladus, Titan og Modlys', ['Saturn', 'Enceladus', 'Titan', 'Modlys'].every((t) => knapperNu.some((k) => k.includes(t))), JSON.stringify(await knapper()));
  tjek('Saturn: teksten om skyggerne', /skyggen/.test(await s.textContent('#kosmosForklaring')));
  tjek('panelet fortæller om alle tre', /Saturn/.test(await s.textContent('#kosmosTekst')) && /Huygens/.test(await s.textContent('#kosmosTekst')));
  await s.screenshot({ path: UD + '/1-saturn.png' });
  for (const [navn, ord] of [['Enceladus', /tigerstriber/], ['Titan', /dis/]]) {
    await s.click(`#kosmosStyring button:text-is("${navn}")`);
    await s.waitForTimeout(1200);
    tjek(`${navn}: teksten skifter`, ord.test(await s.textContent('#kosmosForklaring')));
    await s.click('#kosmosStyring button:has-text("Modlys")');
    await s.waitForTimeout(800);
    await s.screenshot({ path: `${UD}/${navn.toLowerCase()}-modlys.png` });
    await s.click('#kosmosStyring button:has-text("Modlys")');
  }
  await s.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
