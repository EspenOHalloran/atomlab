// Prototypen til Solsystemet: Saturns ringe (grænser, mellemrum og tæthed), og at Saturn og månerne kan vises i Solsystemet
// uden fejl, med flybyen hele vejen rundt.
// Himlen er sort (ingen farvede tågeskyer) ved Saturn og i de andre fænomener i vores solsystem.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { readdirSync } from 'node:fs';
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
// 8k-kort kun til de måner, hvor originalen er skarp nok (Saturns kilde er kun 4k)
const otteK = readdirSync(new URL('../billeder/solsystem/', import.meta.url)).filter((f) => f.endsWith('-8k.jpg') && !f.startsWith('mars')).sort();
tjek('8k-kort til Enceladus, Tethys, Dione og Rhea (ikke Saturn, Mimas og Titan)', otteK.join() === 'dione-8k.jpg,enceladus-8k.jpg,rhea-8k.jpg,tethys-8k.jpg', otteK.join());
tjek('Cassini-delingen er ca. 4.600 km bred', Math.abs(RINGE.find((r) => r.navn === 'Cassini-delingen').ud - RINGE.find((r) => r.navn === 'Cassini-delingen').ind - 4600) < 50);

const b = await chromium.launch({ args: ARGS });
const side = async (adresse) => {
  const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await s.goto(adresse);
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
  return s;
};

// Saturn står i Solsystemets liste efter Mars
{
  const s = await side(`${ADRESSE}/?test#solsystem`);
  const ids = await s.evaluate(() => atomlabTest.solsystem.fænomener);
  tjek('Saturn står i listen efter Mars', ids.indexOf('saturn') === ids.indexOf('mars') + 1 && Boolean(await s.$('#solsystem .kosmos-valg[data-id="saturn"]')), JSON.stringify(ids));
  // Citatet af Huygens (med den latinske ordlyd, når musen holdes over)
  await s.click('#solsystem .kosmos-valg[data-id="saturn"]');
  const citat = await s.evaluate(() => { const c = document.getElementById('solsystemCitat'); return { vist: c && !c.hidden, tekst: c?.textContent ?? '', latin: c?.querySelector('.citat-tekst')?.title ?? '' }; });
  tjek('Saturn viser citatet af Huygens med den latinske ordlyd', citat.vist && citat.tekst.includes('Christiaan Huygens') && citat.latin.startsWith('Annulo cingitur'), JSON.stringify(citat));
  // Tågeskyerne: væk i vores solsystem (fx Årstiderne), med i fx Big Bang og igen uden for Kosmos
  await s.click('#solsystem .sol-klode[data-id="jorden"]');
  await s.click('#solsystemTræ button[data-id="aarstider"]');
  const iÅrstiderne = await s.evaluate(() => atomlabTest.solsystem.tåger());
  await s.evaluate(() => { location.hash = '#kosmos'; });
  await s.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'));
  await s.click('#kosmos .kosmos-valg[data-id="bigbang"]');
  const iBigBang = await s.evaluate(() => atomlabTest.kosmos.tåger());
  tjek('tågeskyerne: væk i Årstiderne, med i Big Bang', !iÅrstiderne && iBigBang, JSON.stringify([iÅrstiderne, iBigBang]));
  await s.context().close();
}

// Visningerne, månerne, modlys og flybyen
{
  const s = await side(`${ADRESSE}/?test#solsystem`);
  // "Start flyby" er grå, indtil månernes kort er hentet på forhånd (før gav det et hak, når flybyen startede)
  const vedÅbning = await s.evaluate(() => {
    document.querySelector('#solsystem .kosmos-valg[data-id="saturn"]').click();
    const k = [...document.querySelectorAll('#solsystemBjælke button')].find((b) => b.textContent.includes('Start flyby'));
    return k && { tekst: k.textContent.trim(), grå: k.disabled };
  });
  tjek('lige efter åbning: "Start flyby" er grå med "henter kort"', vedÅbning?.grå && /henter kort/.test(vedÅbning.tekst), JSON.stringify(vedÅbning));
  const måneKort = ['mimas', 'enceladus', 'tethys', 'dione', 'rhea', 'titan'].map((m) => `${m}-2k.jpg`);
  const klar = await s.waitForFunction(() => [...document.querySelectorAll('#solsystemBjælke button')].some((b) => b.textContent.trim() === '▶ Start flyby' && !b.disabled), null, { timeout: 30000, polling: 200 }).then(() => true, () => false);
  const hentetFør = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
  tjek('"Start flyby" bliver aktiv, når alle seks månekort er hentet på forhånd', klar && måneKort.every((n) => n in hentetFør), JSON.stringify(hentetFør));
  const knapper = async () => s.evaluate(() => atomlabTest.solsystem.knapper());
  const knapperNu = await knapper();
  tjek('bjælken: "▶ Start flyby", og Styr-boksen: kontakterne Modlys og Navne (stederne står i træet)', JSON.stringify(knapperNu) === JSON.stringify(['▶ Start flyby', 'Modlys', 'Navne']) && JSON.stringify(await s.evaluate(() => atomlabTest.solsystem.styr().map((x) => x.slags))) === '["kontakt","kontakt"]', JSON.stringify(knapperNu));
  const træ = await s.evaluate(() => atomlabTest.solsystem.træ());
  tjek('træet: "▶ Flyby · 9 stop" øverst, så Saturn, Ringene, Måner og alle seks måner', træ.map((p) => p.id).join() === 'tur,saturn,ringe,maaner,mimas,enceladus,tethys,dione,rhea,titan' && træ[0].navn.includes('Flyby · 9 stop') && træ[1].valgt, JSON.stringify(træ.map((p) => p.id)));
  tjek('Saturn: teksten om skyggerne', /skyggen/.test(await s.textContent('#solsystemForklaring')));
  tjek('Saturn: sort himmel (ingen tågeskyer)', !(await s.evaluate(() => atomlabTest.solsystem.tåger())));
  tjek('panelet fortæller om alle tre', /Saturn/.test(await s.textContent('#solsystemTekst')) && /Huygens/.test(await s.textContent('#solsystemTekst')));
  await s.screenshot({ path: UD + '/1-saturn.png' });
  // Piletasterne drejer kameraet
  const før = await s.evaluate(() => atomlabTest.solsystem.kamera());
  await s.keyboard.down('ArrowLeft');
  await s.waitForTimeout(700);
  await s.keyboard.up('ArrowLeft');
  const efter = await s.evaluate(() => atomlabTest.solsystem.kamera());
  tjek('piletasterne drejer kameraet', Math.hypot(efter[0] - før[0], efter[2] - før[2]) > 0.5, JSON.stringify([før, efter]));
  // Månerne: de seks store, og et tryk på en måne
  const hop = async () => { await s.evaluate(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForTimeout(300); };
  await s.click('#solsystemTræ button[data-sted="maaner"]');
  await hop();
  tjek('Månerne: teksten om de seks store', /seks store/.test(await s.textContent('#solsystemForklaring')));
  await s.screenshot({ path: UD + '/2-maanerne.png' });
  // Knappen "Navne" (js/solsystem/navne.js): slået fra skjules navnene, men man kan stadig trykke på månerne
  const navne = () => s.evaluate(() => atomlabTest.solsystem.fænomen().navne());
  const navneKnap = '#solsystemStyr .kontakt:has-text("Navne")';
  tjek('Månerne: "Navne" er slået til, og navnene står over månerne', (await s.$eval(navneKnap, (k) => k.classList.contains('til'))) && (await navne()).length >= 5, JSON.stringify(await navne()));
  await s.click(navneKnap);
  await s.waitForTimeout(200);
  tjek('"Navne" slået fra: navnene er væk, og valget er gemt', (await navne()).length === 0 && (await s.evaluate(() => localStorage.getItem('atomlabNavne'))) === 'fra', JSON.stringify(await navne()));
  let p = await s.evaluate(() => atomlabTest.solsystem.fænomen().månePlads('Dione'));
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(400);
  tjek('et tryk på Dione flyver derhen og viser en kort tekst', /Dione:/.test(await s.textContent('#solsystemForklaring')) && (await s.evaluate(() => atomlabTest.solsystem.fænomen().visning())) === 'dione', await s.textContent('#solsystemForklaring'));
  await hop();
  await s.click('#solsystemTræ button[data-sted="maaner"]');
  await hop();
  p = await s.evaluate(() => atomlabTest.solsystem.fænomen().månePlads('Enceladus'));
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(400);
  tjek('et tryk på Enceladus flyver derhen', (await s.evaluate(() => atomlabTest.solsystem.fænomen().visning())) === 'enceladus');
  await hop();
  // Tæt på Enceladus er hele systemet gjort større (rejsen), og kameraet er få måneradier væk (252 km = 0,0252 enheder)
  const tæt = await s.evaluate(() => atomlabTest.solsystem.fænomen().tur());
  tjek('ved Enceladus: systemet er skaleret, og kameraet er tæt på', tæt.skala > 5 && tæt.afstand > 0.0252 && tæt.afstand < 0.0252 * 12, JSON.stringify(tæt));
  await s.screenshot({ path: UD + '/3-enceladus.png' });
  await s.click('#solsystemTræ button[data-sted="saturn"]');
  await hop();
  const ude = await s.evaluate(() => atomlabTest.solsystem.fænomen().tur());
  tjek('tilbage ved Saturn: ingen skalering', ude.skala === 1, JSON.stringify(ude));
  // Ringene fra træet: som stoppet på flybyen (kameraet glider udad over ringene)
  await s.click('#solsystemTræ button[data-sted="ringe"]');
  await hop();
  tjek('Ringene i træet: kameraet flyver hen over ringene, og panelet og underteksten viser dem', (await s.evaluate(() => atomlabTest.solsystem.fænomen().visning())) === 'ringe' && (await s.textContent('#solsystemNavn')) === 'Ringene' && /Cassini-delingen/.test(await s.textContent('#solsystemForklaring')));
  for (const [navn, ord] of [['Enceladus', /tigerstriber/], ['Titan', /dis/]]) {
    await s.click(`#solsystemTræ button[data-sted="${navn.toLowerCase()}"]`);
    await hop();
    tjek(`${navn}: teksten skifter`, ord.test(await s.textContent('#solsystemForklaring')));
    if (navn === 'Titan') tjek('Titan: knappen "Under disen"', (await knapper()).some((k) => k.startsWith('Under disen')));
    await s.click('#solsystemStyr .kontakt:has-text("Modlys")');
    await s.waitForTimeout(800);
    await s.screenshot({ path: `${UD}/${navn.toLowerCase()}-modlys.png` });
    await s.click('#solsystemStyr .kontakt:has-text("Modlys")');
  }

  // Under pause flyver kameraet stadig (rejsen kører uden for fænomenets ur, U2): et tryk på Mimas i træet
  await s.click('#solsystemTid button[data-tid="pause"]');
  await s.click('#solsystemTræ button[data-sted="mimas"]');
  const fløj = await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 30000, polling: 200 }).then(() => true, () => false);
  tjek('under pause flyver kameraet stadig hen til Mimas (uden at spole)', fløj && (await s.evaluate(() => atomlabTest.solsystem.fænomen().visning())) === 'mimas' && (await s.evaluate(() => atomlabTest.solsystem.pause())));
  await s.click('#solsystemTid button[data-tid="spil"]');

  // Flybyen: ni stop med en undertekst og prikker, og "Næste" hele vejen til Titan. Den startes fra træet.
  await s.click('#solsystemTræ button[data-sted="saturn"]');
  await hop();
  await s.click('#solsystemTræ button[data-tur]');
  tjek('flybyen startes fra træet, og punktet lyser', (await s.evaluate(() => atomlabTest.solsystem.træ()))[0].valgt && (await s.evaluate(() => atomlabTest.solsystem.fænomen().tur().trin)) === 0);
  const titler = [];
  for (let i = 0; i < 9; i++) {
    await hop();
    titler.push(await s.evaluate(() => [document.querySelector('.undertekst.fase')?.textContent ?? '', document.querySelectorAll('.undertekst.fase .ut-trin button').length, atomlabTest.solsystem.fænomen().tur().trin]));
    if (i === 2) await s.screenshot({ path: UD + '/4-flyby-ringene.png' });
    if (i === 3) {
      // "‹" går et stop tilbage (til ringene), og en prik springer frem igen
      await s.click('#solsystemBjælke button:has-text("‹")');
      await hop();
      tjek('flybyen: "‹" går tilbage til ringene', (await s.evaluate(() => [atomlabTest.solsystem.fænomen().visning(), atomlabTest.solsystem.fænomen().tur().trin].join())) === 'ringe,2');
      await s.click('#solsystemVindue .ut-trin button:nth-child(4)');
      await hop();
      tjek('flybyen: en prik springer til Mimas', (await s.evaluate(() => [atomlabTest.solsystem.fænomen().visning(), atomlabTest.solsystem.fænomen().tur().trin].join())) === 'mimas,3');
    }
    if (i < 8) await s.click('#solsystemBjælke button:has-text("Næste")');
  }
  const forventet = ['Saturn og de store måner', 'Saturn', 'Hen over ringene', 'Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan'];
  tjek('flybyen: ni stop i rækkefølge med prikker', titler.every(([t, prikker], i) => t.includes(forventet[i]) && prikker === 9), JSON.stringify(titler.map((x) => [x[0].slice(0, 30), x[1], x[2]])));
  tjek('flybyen: knapperne under turen', titler.slice(0, 8).every(([, , trin]) => trin !== null) && titler[8][2] === null, JSON.stringify(titler.map((x) => x[2])));
  await s.screenshot({ path: UD + '/5-flyby-titan.png' });
  // Billederne (S1 i docs/plan-saturn-kvalitet.md): tests henter 2k, og månernes gråtonekort har kun én kanal
  await s.waitForFunction((navne) => navne.every((n) => n in atomlabTest.solsystem.fænomen().billeder()), måneKort, { timeout: 30000 }).catch(() => {});
  const hentet = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
  tjek('billederne: 2k i tests, månerne med én kanal og Saturn i farver', måneKort.every((n) => hentet[n] === 'én kanal') && hentet['saturn-2k.jpg'] === 'farver', JSON.stringify(hentet));
  const slut = await knapper();
  tjek('efter flybyen: de almindelige knapper og "Under disen" ved Titan', slut.includes('▶ Start flyby') && slut.some((k) => k.startsWith('Under disen')) && /Turen er slut/.test(await s.textContent('#solsystemForklaring')), JSON.stringify(slut));
  // ✕ (stop flyby) midt i turen fjerner underteksten
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  await hop();
  await s.click('#solsystemBjælke button[aria-label="Stop flyby"]');
  await s.waitForTimeout(300);
  tjek('✕ stopper flybyen og fjerner underteksten', !(await s.evaluate(() => document.querySelector('.undertekst.fase'))) && (await knapper()).includes('▶ Start flyby'));
  tjek('"Navne" er stadig slået fra efter flybyen', (await navne()).length === 0);
  // Valget huskes efter genindlæsning, og navnene kommer igen, når knappen slås til
  await s.reload();
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)') && atomlabTest.solsystem.valgt() === 'saturn');
  await s.click('#solsystemTræ button[data-sted="maaner"]');
  await hop();
  tjek('efter genindlæsning: "Navne" er stadig slået fra', !(await s.$eval(navneKnap, (k) => k.classList.contains('til'))) && (await navne()).length === 0);
  await s.click(navneKnap);
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().navne().length >= 5, null, { timeout: 10000, polling: 100 }).catch(() => {});
  tjek('"Navne" slået til igen: navnene kommer tilbage', (await navne()).length >= 5 && (await s.evaluate(() => localStorage.getItem('atomlabNavne'))) === 'til', JSON.stringify(await navne()));
  await s.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
