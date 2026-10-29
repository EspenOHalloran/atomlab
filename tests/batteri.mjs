// Batteriet: opladning (konstant strøm → konstant spænding), afladning, elektron-kæden, afbryderen, opgaver og kortslutning,
// guiden første gang, "Næste skridt" og "Vis mig" (slowmotion, tæller ikke som en opgave), og at gitrene er tegnet
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('batteri');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await page.goto(`${ADRESSE}/?test`);
await page.waitForTimeout(800);
await page.click('a.kort[href="#batteri"]');
// Guiden kommer første gang (vent på boblen, for under belastning kan skærmen være længe om at starte)
await page.waitForSelector('.guide-boble:not(.skjult)', { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(500);
const boble = () => page.evaluate(() => { const b = document.querySelector('.guide-boble:not(.skjult)'); return b ? b.querySelector('.guide-titel').textContent : null; });
tjek('guiden starter første gang', (await boble()) === 'Et batteri skåret igennem', await boble());
tjek('"Næste skridt" er skjult under guiden', await page.evaluate(() => getComputedStyle(document.getElementById('batteriMission')).visibility === 'hidden'));
await page.click('.guide-næste');
await page.waitForTimeout(300);
tjek('guiden peger på "Oplad"', (await boble()) === 'Lad det op');
await page.click('.guide-spring');
await page.waitForTimeout(300);
tjek('"Næste skridt": lad batteriet op', (await page.evaluate(() => atomlabTest.batteri.mission())).includes('Oplad'), await page.evaluate(() => atomlabTest.batteri.mission()));
tjek('opgaverne er foldet sammen', await page.evaluate(() => !document.querySelector('[data-lag="batteri-opgaver"]').open && /af 5 ★/.test(document.getElementById('batteriOpgaveTal').textContent)));
tjek('navnet: lithium-ion-batteri', /lithium-ion-batteri/.test(await page.textContent('#batteri .system-status')));
const fr = () => page.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver || {});
const kør = (s) => page.evaluate((s) => atomlabTest.batteri.kør(s), s);
const info = () => page.evaluate(() => atomlabTest.batteri.info());
const tekst = (id) => page.textContent(id);

// Pause: afbryderen er slukket, og kæden står stille
let i = await info();
tjek('pause: afbryder slukket, ingen lader', i.afbryder && !i.lader && !i.lampe, JSON.stringify(i));
tjek('pause: 0,0 A', (await tekst('#batteriStrøm')) === '0,0 A', await tekst('#batteriStrøm'));
const vej0 = i.kædeVej;
await kør(2);
tjek('pause: kæden står stille', (await info()).kædeVej === vej0);
await page.screenshot({ path: UD + '/b0-pause.png' });

// Opladning med konstant strøm
await page.click('[data-batteri-tilstand="oplad"]');
await kør(3);
i = await info();
tjek('oplad: lader synlig, afbryder væk', i.lader && !i.afbryder, JSON.stringify(i));
tjek('oplad: 1,0 A', Math.abs(i.ampere - 1) < 0.05 && (await tekst('#batteriStrøm')) === '1,0 A', `${i.ampere} ${await tekst('#batteriStrøm')}`);
tjek('oplad: kæden løber mod kobberet', i.kædeVej < vej0, `${vej0} → ${i.kædeVej}`);
tjek('oplad: fase "Konstant strøm (1,0 A)"', (await tekst('#batteriFase')) === 'Konstant strøm (1,0 A)', await tekst('#batteriFase'));
await page.waitForTimeout(2500);
await page.screenshot({ path: UD + '/b1-oplad.png' });

// Kør til laderen skifter til konstant spænding
let cvAndelNormal = null;
for (let s = 0; s < 40 && cvAndelNormal === null; s += 0.5) {
  await kør(0.5);
  i = await info();
  if (i.cv) cvAndelNormal = i.andel;
}
tjek('normal: konstant spænding omkring 85 %', cvAndelNormal !== null && cvAndelNormal > 0.8 && cvAndelNormal < 0.95, cvAndelNormal);
await kør(1.5);
const cv1 = await info();
await page.waitForTimeout(600);
tjek('konstant spænding: 4,20 V', (await tekst('#batteriSpænding')) === '4,20 V', await tekst('#batteriSpænding'));
tjek('konstant spænding: under 1 A', cv1.ampere < 0.95, cv1.ampere);
tjek('konstant spænding: fasetekst', (await tekst('#batteriFase')).startsWith('Konstant spænding'), await tekst('#batteriFase'));
await kør(2);
const cv2 = await info();
tjek('konstant spænding: strømmen falder', cv2.ampere < cv1.ampere || cv2.andel === 1, `${cv1.ampere} → ${cv2.ampere}`);
let r = await kør(30);
tjek('fuldt opladet', r.andel === 1, JSON.stringify(r));
await kør(3);
await page.waitForTimeout(500);
tjek('4,20 V', (await tekst('#batteriSpænding')) === '4,20 V', await tekst('#batteriSpænding'));
tjek('fuld: 0,0 A', (await tekst('#batteriStrøm')) === '0,0 A', await tekst('#batteriStrøm'));
tjek('opgave fuld', (await fr())['b-fuld']);

// Afladning: lampen, og kæden løber den anden vej
await page.click('[data-batteri-tilstand="aflad"]');
const vejFør = (await info()).kædeVej;
await kør(3);
i = await info();
tjek('aflad: lampe synlig, ingen lader eller afbryder', i.lampe && !i.lader && !i.afbryder, JSON.stringify(i));
tjek('aflad: kæden løber mod aluminiummet', i.kædeVej > vejFør, `${vejFør} → ${i.kædeVej}`);
tjek('aflad: spænding under 4,2 V', parseFloat((await tekst('#batteriSpænding')).replace(',', '.')) < 4.2, await tekst('#batteriSpænding'));
await kør(5);
await page.waitForTimeout(2500);
await page.screenshot({ path: UD + '/b2-lampe.png' });
tjek('opgave lampe', (await fr())['b-lampe']);
r = await kør(40);
tjek('tomt og beskyttelse', r.andel === 0 && (await tekst('#batteriFase')).length > 0, JSON.stringify(r));
await page.waitForTimeout(500);
tjek('opgave tom', (await fr())['b-tom']);
tjek('tom: afbryderen er slukket igen', (await info()).afbryder);

// Hurtig opladning: varmere, og laderen når 4,2 V tidligere
await page.click('[data-batteri-fart="2"]');
await page.click('[data-batteri-tilstand="oplad"]');
let cvAndelHurtig = null;
for (let s = 0; s < 12; s += 0.5) {
  await kør(0.5);
  i = await info();
  if (i.cv && cvAndelHurtig === null) cvAndelHurtig = i.andel;
}
tjek('hurtig: konstant spænding før normal', cvAndelHurtig !== null && cvAndelHurtig < cvAndelNormal, `${cvAndelHurtig} < ${cvAndelNormal}`);
await page.waitForTimeout(500);
tjek('opgave hurtig (varme)', (await fr())['b-hurtig']);

// Snydt lader: over 4,2 V, nåle og kortslutning
await page.click('#batteriSnyd');
r = await kør(40);
console.log('     snydt lader:', JSON.stringify(r));
tjek('kortslutning', r.død);
tjek('efter kortslutning: afbryderen er slukket', (await info()).afbryder);
await page.waitForTimeout(3000);
await page.screenshot({ path: UD + '/b3-kortslutning.png' });
tjek('opgave overlad', (await fr())['b-overlad']);
// "Start forfra" nederst i opgaverne: to tryk nulstiller kun Batteriets opgaver
await page.evaluate(() => { document.querySelector('[data-lag="batteri-opgaver"]').open = true; });
tjek('"Start forfra" står nederst i opgaverne', await page.isVisible('#batteriOpgaver li.forfra button'));
await page.click('#batteriOpgaver li.forfra button');
tjek('"Start forfra" spørger først', (await page.textContent('#batteriOpgaver li.forfra button')).includes('Sikker'));
await page.click('#batteriOpgaver li.forfra button');
await page.waitForTimeout(300);
tjek('"Start forfra" nulstiller Batteriets opgaver', Object.keys(await fr()).filter((id) => id.startsWith('b-')).length === 0 && /^0 af 5/.test(await page.textContent('#batteriOpgaveTal')), await page.textContent('#batteriOpgaveTal'));
await page.click('#batteriNyt');

await page.click('#batteriHjælp');
await page.waitForTimeout(400);
tjek('hjælp', await page.isVisible('#hjælpBatteri'));
tjek('hjælp: hvad løber i ledningen', (await tekst('#hjælpBatteri')).includes('Hvad løber i ledningen?'));
tjek('hjælp: LiPo eller Li-ion', (await tekst('#hjælpBatteri')).includes('LiPo eller Li-ion?'));
// Den første side lukkes, før den næste åbnes. Ellers tegner to batterier samtidig, og på en travl maskine tog det
// over 30 sekunder at indlæse den nye side (TimeoutError i page.goto).
await page.context().close();

// "Vis mig" i et nyt vindue (uden klarede opgaver): slowmotion, to ioner, og ingen opgave klares
{
  const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  await s.addInitScript(() => localStorage.setItem('atomlabGuide', JSON.stringify({ batteri: 1 })));
  // Vent på, at skærmen er klar, og ikke på sidens load-hændelse (som har en fast grænse på 30 sekunder)
  await s.goto(`${ADRESSE}/?test#batteri`, { waitUntil: 'commit' });
  await s.waitForFunction(() => window.atomlabTest && document.querySelector('#batteri:not(.skjult)'), null, { timeout: 120000, polling: 250 });
  tjek('ingen guide anden gang', !(await s.evaluate(() => document.querySelector('.guide-boble:not(.skjult)'))));
  tjek('grafitten er lag af sekskanter, og metaloxidet er en krystal', await s.evaluate(() => {
    let kugler = 0;
    window.atomlabTest.batteri.gitter().forEach((n) => { kugler += n; });
    return kugler > 500;
  }));
  const før = await s.evaluate(() => atomlabTest.batteri.info().andel);
  await s.click('#batteriVisMig');
  tjek('"Vis mig" kører', await s.evaluate(() => atomlabTest.batteri.demo()));
  const r = await s.evaluate(() => { const t = atomlabTest.batteri; for (let i = 0; i < 80 && t.demo(); i++) t.kør(0.5); return { demo: t.demo(), ...t.info() }; });
  tjek('"Vis mig" slutter efter to ioner', !r.demo && Math.abs(r.andel - før - 2 / 24) < 0.001, JSON.stringify(r));
  tjek('"Vis mig" klarer ingen opgaver', Object.keys(await s.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver || {})).length === 0);
  tjek('bagefter hviler batteriet', r.afbryder && !r.lader);
  await s.screenshot({ path: UD + '/b4-vis-mig.png' });
  await s.context().close();
}

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
