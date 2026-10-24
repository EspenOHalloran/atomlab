// Prototypen til Solsystemet: Saturns ringe (grænser, mellemrum og tæthed), og at Saturn og månerne kan vises i Kosmos
// uden fejl, med flybyen hele vejen rundt.
// Himlen er sort (ingen farvede tågeskyer) ved Saturn og i de andre fænomener i vores solsystem.
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

// Saturn står i listen efter Solstorm (uden en særlig adresse)
{
  const s = await side(`${ADRESSE}/?test#kosmos`);
  const ids = await s.evaluate(() => atomlabTest.kosmos.fænomener);
  tjek('Saturn står i listen efter Solstorm', ids.indexOf('saturn') === ids.indexOf('solstorm') + 1 && Boolean(await s.$('.kosmos-valg[data-id="saturn"]')), JSON.stringify(ids));
  // Tågeskyerne: væk i vores solsystem (fx Årstiderne), med i fx Big Bang og igen uden for Kosmos
  await s.click('.kosmos-valg[data-id="aarstider"]');
  const iÅrstiderne = await s.evaluate(() => atomlabTest.kosmos.tåger());
  await s.click('.kosmos-valg[data-id="bigbang"]');
  const iBigBang = await s.evaluate(() => atomlabTest.kosmos.tåger());
  tjek('tågeskyerne: væk i Årstiderne, med i Big Bang', !iÅrstiderne && iBigBang, JSON.stringify([iÅrstiderne, iBigBang]));
  await s.context().close();
}

// Visningerne, månerne, modlys og flybyen
{
  const s = await side(`${ADRESSE}/?test#kosmos`);
  await s.click('.kosmos-valg[data-id="saturn"]');
  await s.waitForTimeout(1500);
  const knapper = async () => s.evaluate(() => [...document.querySelectorAll('#kosmosStyring button')].map((k) => k.textContent.trim()));
  const knapperNu = await knapper();
  tjek('knapperne Saturn, Månerne, Enceladus, Titan, Start flyby og Modlys', ['Saturn', 'Månerne', 'Enceladus', 'Titan', 'Start flyby', 'Modlys'].every((t) => knapperNu.some((k) => k.includes(t))), JSON.stringify(await knapper()));
  tjek('Saturn: teksten om skyggerne', /skyggen/.test(await s.textContent('#kosmosForklaring')));
  tjek('Saturn: sort himmel (ingen tågeskyer)', !(await s.evaluate(() => atomlabTest.kosmos.tåger())));
  tjek('panelet fortæller om alle tre', /Saturn/.test(await s.textContent('#kosmosTekst')) && /Huygens/.test(await s.textContent('#kosmosTekst')));
  await s.screenshot({ path: UD + '/1-saturn.png' });
  // Piletasterne drejer kameraet
  const før = await s.evaluate(() => atomlabTest.kosmos.kamera());
  await s.keyboard.down('ArrowLeft');
  await s.waitForTimeout(700);
  await s.keyboard.up('ArrowLeft');
  const efter = await s.evaluate(() => atomlabTest.kosmos.kamera());
  tjek('piletasterne drejer kameraet', Math.hypot(efter[0] - før[0], efter[2] - før[2]) > 0.5, JSON.stringify([før, efter]));
  // Månerne: de seks store, og et tryk på en måne
  const hop = async () => { await s.evaluate(() => atomlabTest.kosmos.fænomen().hop()); await s.waitForTimeout(300); };
  await s.click('#kosmosStyring button:text-is("Månerne")');
  await hop();
  tjek('Månerne: teksten om de seks store', /seks store/.test(await s.textContent('#kosmosForklaring')));
  await s.screenshot({ path: UD + '/2-maanerne.png' });
  let p = await s.evaluate(() => atomlabTest.kosmos.fænomen().månePlads('Dione'));
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(400);
  tjek('et tryk på Dione flyver derhen og viser en kort tekst', /Dione:/.test(await s.textContent('#kosmosForklaring')) && (await s.evaluate(() => atomlabTest.kosmos.fænomen().visning())) === 'dione', await s.textContent('#kosmosForklaring'));
  await hop();
  await s.click('#kosmosStyring button:text-is("Månerne")');
  await hop();
  p = await s.evaluate(() => atomlabTest.kosmos.fænomen().månePlads('Enceladus'));
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(400);
  tjek('et tryk på Enceladus flyver derhen', (await s.evaluate(() => atomlabTest.kosmos.fænomen().visning())) === 'enceladus');
  await hop();
  // Tæt på Enceladus er hele systemet gjort større (rejsen), og kameraet er få måneradier væk (252 km = 0,0252 enheder)
  const tæt = await s.evaluate(() => atomlabTest.kosmos.fænomen().tur());
  tjek('ved Enceladus: systemet er skaleret, og kameraet er tæt på', tæt.skala > 5 && tæt.afstand > 0.0252 && tæt.afstand < 0.0252 * 12, JSON.stringify(tæt));
  await s.screenshot({ path: UD + '/3-enceladus.png' });
  await s.click('#kosmosStyring button:text-is("Saturn")');
  await hop();
  const ude = await s.evaluate(() => atomlabTest.kosmos.fænomen().tur());
  tjek('tilbage ved Saturn: ingen skalering', ude.skala === 1, JSON.stringify(ude));
  for (const [navn, ord] of [['Enceladus', /tigerstriber/], ['Titan', /dis/]]) {
    await s.click(`#kosmosStyring button:text-is("${navn}")`);
    await hop();
    tjek(`${navn}: teksten skifter`, ord.test(await s.textContent('#kosmosForklaring')));
    if (navn === 'Titan') tjek('Titan: knappen "Under disen"', (await knapper()).some((k) => k.startsWith('Under disen')));
    await s.click('#kosmosStyring button:has-text("Modlys")');
    await s.waitForTimeout(800);
    await s.screenshot({ path: `${UD}/${navn.toLowerCase()}-modlys.png` });
    await s.click('#kosmosStyring button:has-text("Modlys")');
  }

  // Flybyen: ni stop med en undertekst og prikker, og "Næste" hele vejen til Titan
  await s.click('#kosmosStyring button:text-is("Saturn")');
  await hop();
  await s.click('#kosmosStyring button:has-text("Start flyby")');
  const titler = [];
  for (let i = 0; i < 9; i++) {
    await hop();
    titler.push(await s.evaluate(() => [document.querySelector('.undertekst.fase')?.textContent ?? '', document.querySelectorAll('.undertekst.fase .ut-trin i').length, atomlabTest.kosmos.fænomen().tur().trin]));
    if (i === 2) await s.screenshot({ path: UD + '/4-flyby-ringene.png' });
    if (i < 8) await s.click('#kosmosStyring button:has-text("Næste")');
  }
  const forventet = ['Saturn og de store måner', 'Saturn', 'Hen over ringene', 'Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan'];
  tjek('flybyen: ni stop i rækkefølge med prikker', titler.every(([t, prikker], i) => t.includes(forventet[i]) && prikker === 9), JSON.stringify(titler.map((x) => [x[0].slice(0, 30), x[1], x[2]])));
  tjek('flybyen: knapperne under turen', titler.slice(0, 8).every(([, , trin]) => trin !== null) && titler[8][2] === null, JSON.stringify(titler.map((x) => x[2])));
  await s.screenshot({ path: UD + '/5-flyby-titan.png' });
  const slut = await knapper();
  tjek('efter flybyen: de almindelige knapper og "Under disen" ved Titan', slut.includes('▶ Start flyby') && slut.some((k) => k.startsWith('Under disen')) && /Turen er slut/.test(await s.textContent('#kosmosForklaring')), JSON.stringify(slut));
  // "Stop flyby" midt i turen fjerner underteksten
  await s.click('#kosmosStyring button:has-text("Start flyby")');
  await hop();
  await s.click('#kosmosStyring button:has-text("Stop flyby")');
  await s.waitForTimeout(300);
  tjek('"Stop flyby" fjerner underteksten', !(await s.evaluate(() => document.querySelector('.undertekst.fase'))) && (await knapper()).includes('▶ Start flyby'));
  await s.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
