// "Under isen" (spor Måner, M2, docs/drejebog-maaner.md): tallene og magnetfeltets model i Node, og i browseren
// fænomenet lige efter Saturn, forløbets trin 1 (et træk i Europa skærer snittet, og det glider selv det sidste stykke,
// lupen finder dybden), trin 2 (feltet vipper, havet laver et ekstra felt, der vender modsat, og uden hav er det væk),
// "Det så du" og "Leg frit" (laboratoriets kontakter), og konsollen er uden fejl.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { EUROPA, FELT, lagVed, lagGrænser, feltVed, ekstraFelt, SIDE } from '../js/data/maaner/underisen.js';
import { UNDER_ISEN } from '../js/data/forloeb/under-isen.js';
import { FÆNOMEN_IDER } from '../js/data/faenomener.js';
import { forløbMed } from '../js/data/forloeb/liste.js';
import { ORDBOG } from '../js/data/ordbog.js';
const UD = billedmappe('maaner');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser ----------
{
  const ids = FÆNOMEN_IDER.solsystem;
  tjek('underisen står lige efter Saturn i FÆNOMEN_IDER, og forløbet findes i listen', ids[ids.indexOf('saturn') + 1] === 'underisen' && forløbMed('under-isen') === UNDER_ISEN);
  tjek('lagene: is øverst, så hav, sten og jern i midten', lagVed(EUROPA.r - 10) === 'is' && lagVed(EUROPA.r - 60) === 'hav' && lagVed(1000) === 'sten' && lagVed(100) === 'jern' && lagGrænser().every((g, i, a) => g > 0 && g < 1 && (i === 0 || g < a[i - 1])));
  const B = [0, 0];
  feltVed(0.3, 0.2, 0.4, true, B);
  const inde = [...B];
  feltVed(0.3, 0.2, 0.4, false, B);
  tjek('inde i havet er kun den faste del tilbage, uden hav går feltet lige igennem', inde[0] === 0 && inde[1] === -FELT.fast && B[0] === 0.4 && B[1] === -FELT.fast);
  const e1 = ekstraFelt(1.65, 0, 0.4, true, [0, 0]), e2 = ekstraFelt(1.65, 0, -0.4, true, [0, 0]), e0 = ekstraFelt(1.65, 0, 0.4, false, [0, 0]);
  tjek('det ekstra felt ved Galileo vender modsat Jupiters vippen og vender med den, uden hav er det 0', e1[0] < 0 && e2[0] > 0 && e0[0] === 0 && e0[1] === 0, `${e1} ${e2}`);
  const langt = ekstraFelt(20, 0, 0.4, true, [0, 0]);
  tjek('langt væk er Europas ekstra felt næsten væk (dipolen falder som 1/r³)', Math.abs(langt[0]) < 1e-4);
  const ord = new Set(ORDBOG.map((o) => o.id));
  tjek('forløbet: to trin, hver Så under 160 tegn, gæt med svar, og ordene findes i Ordbogen', UNDER_ISEN.trin.length === 2
    && UNDER_ISEN.trin.every((t) => t.så.length <= 160 && t.gæt.valg.length === 3 && t.gæt.valg.every((v) => v.svar) && t.ord.every((o) => ord.has(o))), UNDER_ISEN.trin.map((t) => t.så.length).join());
  tjek('siden: Kort højst tre sætninger, tre emner og Ærligt talt', SIDE.kort.split(/\.\s/).length <= 3 && SIDE.emner.length === 3 && /skøn/.test(SIDE.ærligt));
}

// ---------- I browseren ----------
if (!process.argv.includes('--uden-browser')) {
  const browser = await chromium.launch({ args: ARGS });
  const side = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const konsol = [];
  side.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });
  side.on('pageerror', (e) => konsol.push(e.message));
  await side.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await side.goto(`${ADRESSE}?test&forloeb=under-isen#solsystem`);
  await side.waitForFunction(() => window.atomlabTest?.solsystem?.fænomen?.()?.kører?.() === 'under-isen', null, { timeout: 60000 });
  const f = (kode, a) => side.evaluate(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('t', 'a', `return (${k})(t, a)`)(t, a); }, [kode.toString(), a]);
  const vent = (kode, a, ms = 30000) => side.waitForFunction(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('t', 'a', `return (${k})(t, a)`)(t, a); }, [kode.toString(), a], { timeout: ms, polling: 100 });
  const klik = (sel) => side.click(`#solsystem .forløb-linje ${sel}`);
  const spol = (s) => side.evaluate((s) => window.atomlabTest.solsystem.spol(s), s);

  const træ = await side.evaluate(() => window.atomlabTest.solsystem.træ().map((b) => b.id));
  tjek('forløbet starter fra ?forloeb, trin 1 er snittet, og "Under isen" står i listen efter Saturn', (await f((t) => t.trin())) === 'snit' && træ.indexOf('underisen') > træ.indexOf('saturn') && !træ.slice(træ.indexOf('saturn') + 1, træ.indexOf('underisen')).some((id) => ['uranus', 'neptun', 'pluto'].includes(id)), træ.join());
  await vent((t) => t.hentet().europa && !t.flyver());
  await f((t) => t.kameraFrem());
  // Et træk ned over 30 % af Europa: snittet følger fingeren og glider ikke selv
  const e = await f((t) => t.europaSkærm());
  await side.mouse.move(e.x, e.y - e.r * 0.8);
  await side.mouse.down();
  await side.mouse.move(e.x, e.y - e.r * 0.2, { steps: 5 });
  await side.mouse.up();
  const lidt = await f((t) => ({ snit: t.snit(), glider: t.glider() }));
  tjek('trin 1: et kort træk skærer et stykke, og snittet bliver stående (under halvvejs)', lidt.snit > 0.2 && lidt.snit < 0.45 && !lidt.glider, JSON.stringify(lidt));
  // Et længere træk over halvvejs: Snittet glider selv resten (et rundt mål)
  await side.mouse.move(e.x, e.y - e.r * 0.2);
  await side.mouse.down();
  await side.mouse.move(e.x, e.y + e.r * 0.5, { steps: 5 });
  await side.mouse.up();
  await spol(3);
  await vent((t) => t.fase() === 'så');
  tjek('trin 1: over halvvejs glider snittet helt igennem, og Så kommer', (await f((t) => t.snit())) === 1);
  await spol(0.2);
  const lupe = await f((t) => t.lupe());
  tjek('trin 1: lupen står ved snittets kant og finder havet under sig (20-120 km nede), og lagene står forklaret', lupe.vist && lupe.dybde > 20 && lupe.dybde < 120 && (await f((t) => t.lagVist())), JSON.stringify(lupe));
  await side.screenshot({ path: `${UD}/snit.png` });
  // Lupen flyttes ind mod midten: dybere ned
  await f((t) => { const e = t.europaSkærm(); const v = document.getElementById('solsystemVindue').getBoundingClientRect(); t.flytLupe(e.x - v.left + e.r * 0.25, e.y - v.top - e.r * 0.1); });
  await spol(0.1);
  const dybere = await f((t) => t.lupe().dybde);
  tjek('trin 1: lupen inde ved midten viser et punkt langt nede i stenen eller jernet', dybere > 600, String(dybere));

  // Trin 2: magnetfeltet
  await klik('.fl-næste');
  await vent((t) => t.trin() === 'felt');
  await klik('.fl-gæt');
  await f((t) => t.kameraFrem());
  await spol(2.5); // (Jupiters felt vipper ud til siden)
  const med = await f((t) => t.felt());
  tjek('trin 2: feltet vises, Enceladus er skjult, og med havet måler Galileo et ekstra felt, der vender modsat Jupiters', med.vist && !(await f((t) => t.enceladusVist())) && Math.abs(med.jupiter) > 0.3 && Math.sign(med.europa) === -Math.sign(med.jupiter) && Math.abs(med.europa) > 0.1, JSON.stringify(med));
  await side.screenshot({ path: `${UD}/felt-hav.png` });
  await klik('.fl-handling[data-knap="hav"]');
  await spol(0.5);
  const uden = await f((t) => ({ hav: t.hav(), ...t.felt() }));
  tjek('trin 2: kontakten "Hav" i linjen slår havet fra, og så måler Galileo intet ekstra felt', !uden.hav && uden.europa === 0, JSON.stringify(uden));
  // Uden hav går feltlinjen lige igennem (ret linje), med hav er den bøjet
  const ret = await f((t) => [t.linjePunkt(7, 0), t.linjePunkt(7, 90), t.linjePunkt(7, 180)]);
  const krum = (p) => Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[1][1] - p[0][1]) * (p[2][0] - p[0][0]));
  await spol(2.5);
  await klik('.fl-handling[data-knap="hav"]');
  // (feltet bøjer kun, mens Jupiters felt vipper ud til siden: vent, til vippen er tydelig)
  for (let i = 0; i < 40 && Math.abs((await f((t) => t.felt())).jupiter) < 0.6; i++) await spol(0.25);
  await spol(0.1);
  const bøjet = await f((t) => [t.linjePunkt(7, 0), t.linjePunkt(7, 90), t.linjePunkt(7, 180)]);
  tjek('trin 2: midterlinjen er ret uden hav og bøjet med hav', krum(ret) < 1e-3 && krum(bøjet) > 0.01, `${krum(ret)} ${krum(bøjet)}`);
  await spol(2.5);
  await vent((t) => t.fase() === 'så');
  tjek('trin 2: Så kommer, når feltet er set både med og uden hav', true);
  await klik('.fl-næste');
  await vent((t) => t.fase() === 'slut');
  tjek('"Det så du": kernesætningen og vejen "Leg frit"', (await side.textContent('#solsystem .forløb-linje .fl-tekst')) === UNDER_ISEN.kernesætning && (await side.$$('#solsystem .forløb-linje .fl-vej')).length === 1);
  await klik('.fl-vej');
  await vent((t) => !t.kører());
  await spol(1);
  const styr = await side.evaluate(() => window.atomlabTest.solsystem.styr().map((s) => s.navn));
  tjek('"Leg frit": laboratoriet har skyderen "Snit" og kontakterne "Magnetfelt", "Hav" og "Navne", og Enceladus er tilbage', ['Snit', 'Magnetfelt', 'Hav', 'Navne'].every((n) => styr.some((s) => s?.startsWith(n))) && (await f((t) => t.enceladusVist())) && !(await f((t) => t.felt().vist)), styr.join());
  await side.screenshot({ path: `${UD}/lab.png` });
  tjek('konsollen er uden fejl', konsol.length === 0, konsol.join(' | '));
  await browser.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
