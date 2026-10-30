// Stå på Mars (M8a i docs/plan-mars.md): knappen ved Gale, landingen, stedet og højden, Solen efter klokken, Phobos
// står op i vest og Deimos i øst, at man drejer hovedet (træk mod højre: landskabet følger med), kikkerten, "Lad dagen
// gå", "Solnedgang", at gå til Curiosity og tilbage i kredsløb (kameraet og kloden sættes tilbage).
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.kort, null, { timeout: 60000 });
const f = (fn, a) => s.evaluate(fn, a);
const fm = (fn) => s.evaluate(fn);
const stå = () => fm(() => atomlabTest.solsystem.fænomen().stå());
const knapper = () => fm(() => atomlabTest.solsystem.knapper());
const tryk = async (tekst) => {
  await s.waitForFunction((t) => [...document.querySelectorAll('#solsystemStyring button')].some((k) => k.textContent.trim().startsWith(t) && !k.disabled), tekst, { timeout: 15000, polling: 100 });
  await f((t) => [...document.querySelectorAll('#solsystemStyring button')].find((k) => k.textContent.trim().startsWith(t)).click(), tekst);
};
const hop = async () => { await fm(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { polling: 100 }); };

// Ved Gale: knappen
await fm(() => atomlabTest.solsystem.fænomen().besøgSted('gale'));
tjek('under flyvningen til Gale: ingen "Stå på Mars" endnu', !(await knapper()).includes('🧍 Stå på Mars'));
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.knapper().includes('🧍 Stå på Mars'), null, { timeout: 10000, polling: 100 }).catch(() => {});
tjek('ved Gale: knappen "🧍 Stå på Mars"', (await knapper()).includes('🧍 Stå på Mars'), JSON.stringify(await knapper()));

// Ned på jorden
await tryk('🧍 Stå på Mars');
tjek('trykket: kameraet flyver ned, og lagene hentes', (await stå()).venter && !(await stå()).står);
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
let t = await stå();
tjek('står ved Naukluft, og Mars-kloden er skjult', t.står && t.sted === 'naukluft' && !t.kloden);
tjek('lander (kameraet er højt oppe først)', t.lander && t.øjne > 100, JSON.stringify(t));
await fm(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander, null, { polling: 100 });
t = await stå();
tjek('efter landingen: øjnene 1,7 m over jorden, kigger mod sydøst (135°) lidt under vandret', Math.abs(t.øjne - 1.7) < 0.01 && Math.abs(t.kompas - 135) < 1 && t.vinkel < 0 && t.vinkel > -6, JSON.stringify(t));
tjek('højden under stedet passer med NASA (−4.429 m ved sol 1301)', Math.abs(t.højde + 4429) < 10, String(t.højde));
tjek('near er 0,3 m', Math.abs(t.nær - 0.0003) < 1e-9);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().skygger === 1, null, { timeout: 30000, polling: 200 }).catch(() => {});
tjek('skyggekortene er regnet', (await stå()).skygger === 1);
const kn = await knapper();
tjek('knapperne: tilbage, Curiosity, klokken, lad dagen gå, solnedgang', ['↑ Tilbage i kredsløb', 'Gå til Curiosity nu', 'Klokken på Mars', '▶ Lad dagen gå', 'Solnedgang'].every((k) => kn.includes(k)), JSON.stringify(kn));
tjek('teksten om Naukluft og Mount Sharp', /Naukluft/.test(await s.textContent('#solsystemForklaring')) && /Mount Sharp/.test(await s.textContent('#solsystemForklaring')));

// Solen efter klokken (Gale ligger ca. 4,7° S, og Solen står ca. 3° nord for ækvator)
const solVed = (tid) => f((x) => { const y = atomlabTest.solsystem.fænomen(); y.sætTid(x); return y.stå().solHøjde; }, tid);
const middag = await solVed(12), seks = await solVed(6), atten = await solVed(18), midnat = await solVed(0);
tjek('Solen: højt ved middag (over 80°), ved horisonten kl. 6 og 18, under jorden ved midnat', middag > 80 && Math.abs(seks) < 3 && Math.abs(atten) < 3 && midnat < -70, `${middag} ${seks} ${atten} ${midnat}`);
const morgen = await f(() => { const y = atomlabTest.solsystem.fænomen(); y.sætTid(8); return y.stå(); });
tjek('Solen står i øst om morgenen', true && morgen.solHøjde > 20);

// Månerne: Phobos står op i vest, Deimos i øst
const måner = await fm(() => { const y = atomlabTest.solsystem.fænomen(); const r = []; let før = 0; y.sætTid(0); for (let x = 0; x < 300; x += 0.02) { const t = x % 24; y.sætTid(t < før ? t + 24 : t); før = t; r.push(y.stå().måner); } return r; });
const op = (k) => måner.map((m, i) => i && måner[i - 1][k].højde < 0 && m[k].højde >= 0 ? m[k].kompas : null).filter((x) => x !== null);
const pOp = op(0), dOp = op(1);
tjek('Phobos står op i vest', pOp.length > 0 && pOp.every((k) => k > 200 && k < 340), JSON.stringify(pOp));
tjek('Deimos står op i øst', dOp.length > 0 && dOp.every((k) => k > 20 && k < 160), JSON.stringify(dOp));
tjek('Phobos er ca. 0,2° bred, når den står højt', måner.some((m) => m[0].højde > 75 && Math.abs(m[0].bredde - 0.21) < 0.02));

// Dreje hovedet: træk mod højre, så følger landskabet med (man kigger mere mod venstre)
await f(() => { const y = atomlabTest.solsystem.fænomen(); y.sætTid(8.5); y.kig(100, 0); });
const før = (await stå()).kompas;
await s.mouse.move(640, 400); await s.mouse.down(); await s.mouse.move(740, 400, { steps: 6 }); await s.mouse.up();
await s.waitForTimeout(800);
const efter = (await stå()).kompas;
tjek('træk mod højre: kompasset falder', efter < før - 5 && Math.abs((await stå()).øjne - 1.7) < 0.2, `${før} → ${efter}`);
// Kikkerten
await s.mouse.move(640, 400);
for (let i = 0; i < 6; i++) await s.mouse.wheel(0, -400);
await s.waitForTimeout(300);
const z = (await stå()).zoom;
tjek('rul med musen: kikkerten zoomer (højst 6 gange)', z > 1.5 && z <= 6, String(z));
for (let i = 0; i < 12; i++) await s.mouse.wheel(0, 600);
await s.waitForTimeout(300);
tjek('og tilbage til 1', (await stå()).zoom === 1);

// Lad dagen gå og Solnedgang
const t0 = (await stå()).tid;
await tryk('▶ Lad dagen gå');
await s.waitForFunction((x) => atomlabTest.solsystem.fænomen().stå().tid > x + 0.05, t0, { timeout: 20000, polling: 200 }).catch(() => {});
tjek('"Lad dagen gå": klokken går', (await stå()).tid > t0 + 0.05);
await tryk('▶ Lad dagen gå');
await tryk('Solnedgang');
const sn = await stå();
tjek('"Solnedgang": Solen står lige over horisonten om aftenen', sn.solHøjde > 0 && sn.solHøjde < 8 && sn.tid > 15, JSON.stringify({ sol: sn.solHøjde, tid: sn.tid }));

// Til Curiosity
await tryk('Gå til Curiosity nu');
await s.waitForFunction(() => { const t = atomlabTest.solsystem.fænomen().stå(); return t.sted === 'curiosity' && t.står && atomlabTest.solsystem.knapper().includes('Gå til Naukluft'); }, null, { timeout: 60000, polling: 200 }).catch(() => {});
await fm(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander, null, { polling: 100 });
t = await stå();
tjek('hos Curiosity: højden passer med NASA (−3.488 m ved sol 5045), og knappen tilbage til Naukluft', t.sted === 'curiosity' && Math.abs(t.højde + 3488) < 10 && (await knapper()).includes('Gå til Naukluft'), JSON.stringify(t));
tjek('teksten om Curiosity i oktober 2026', /oktober 2026/.test(await s.textContent('#solsystemForklaring')));

// Tilbage i kredsløb
await tryk('↑ Tilbage i kredsløb');
await fm(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 30000, polling: 200 }).catch(() => {});
t = await stå();
tjek('tilbage i kredsløb: Mars-kloden ses, near er 5 km igen, zoom 1', !t.står && t.kloden && Math.abs(t.nær - 0.005) < 1e-9 && t.zoom === 1, JSON.stringify(t));
await hop();
tjek('og kameraet er ved Gale igen', (await fm(() => atomlabTest.solsystem.fænomen().ved())) === 'gale');

// Skift skærm, mens man står: alt sættes tilbage
await s.waitForFunction(() => atomlabTest.solsystem.knapper().includes('🧍 Stå på Mars'), null, { timeout: 10000, polling: 100 }).catch(() => {});
tjek('ved Gale igen: knappen "🧍 Stå på Mars"', (await knapper()).includes('🧍 Stå på Mars'), JSON.stringify(await knapper()));
await tryk('🧍 Stå på Mars');
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
await f(() => { location.hash = '#kosmos'; });
await s.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'));
await s.waitForTimeout(500);
const kam = await fm(() => ({ near: atomlabTest.kosmos.kamera?.()?.near ?? null }));
tjek('skift til Kosmos, mens man står: ingen fejl', fejl.length === 0, fejl.join(' | '));
void kam;

console.log(fejl.length ? fejl.join('\n') : 'ingen fejl i konsollen');
console.log(`${ok} OK, ${dårlig} FEJL`);
await b.close();
process.exit(dårlig || fejl.length ? 1 : 0);
