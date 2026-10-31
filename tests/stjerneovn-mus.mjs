// Stjerneovnen: lettere at ramme, find kernerne, pause, graf og rejsen ind i Solen
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('stjerneovn-mus');
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const fejl = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
const venTil = async (f, ms = 15000) => { const slut = Date.now() + ms; while (Date.now() < slut) { if (await f()) return true; await page.waitForTimeout(250); } return false; };
const boble = () => T(() => { const e = document.querySelector('.guide-boble'); return e && !e.classList.contains('skjult') ? e.querySelector('.guide-titel').textContent : null; });
const undertekst = () => T(() => [...document.querySelectorAll('#fusionVindue .vindue-bund *')].map((e) => e.textContent).join(' ').slice(0, 200));
const synlig = (sel) => T((s) => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden'; }, sel);

// ---------- Rejsen ind i Solen (første gang) ----------
await page.goto(`${ADRESSE}/?test#fusion`);
await T(() => localStorage.clear());
await page.reload();
tjek('rejsen starter første gang', await venTil(async () => (await T(() => atomlabTest.fusion.rejse())) === 0, 5000));
tjek('"Spring over" vises', await synlig('#fusRejseSpring'));
tjek('næste skridt skjult under rejsen', !(await synlig('#fusMission')));
tjek('tidsknappen skjult under rejsen', !(await synlig('#fusTid')));
// Rejsen styres af uret (rigtig tid). På en travl maskine kan testen komme for sent, så vi fryser rejsen på bestemte tidspunkter.
await T(() => atomlabTest.fusion.rejseTid(1));
await page.waitForTimeout(800);
tjek('undertekst om Solen', /Solen/.test(await undertekst()), await undertekst());
await page.screenshot({ path: `${UD}/r1-solen.png` });
await T(() => atomlabTest.fusion.rejseTid(4.5));
tjek('rejsen når fase 2', await venTil(async () => (await T(() => atomlabTest.fusion.rejse())) === 1, 4000));
await page.waitForTimeout(800);
await page.screenshot({ path: `${UD}/r2-ind.png` });
await T(() => atomlabTest.fusion.rejseTid(7.5));
tjek('rejsen når kernen', await venTil(async () => (await T(() => atomlabTest.fusion.rejse())) === 2, 4000));
await page.waitForTimeout(600);
await page.screenshot({ path: `${UD}/r3-kernen.png` });
await T(() => atomlabTest.fusion.rejseTid(null)); // nu løber tiden igen
tjek('rejsen slutter af sig selv', await venTil(async () => (await T(() => atomlabTest.fusion.rejse())) === null, 12000));
tjek('guiden starter efter rejsen', await venTil(async () => (await boble()) === 'Du er inde i Solens kerne', 6000), await boble());
tjek('rejsen er husket', await T(() => 'fusion-rejse' in JSON.parse(localStorage.getItem('atomlabGuide') || '{}')));
await page.screenshot({ path: `${UD}/r4-guide.png` });

// Anden gang: ingen rejse
await page.reload();
await page.waitForTimeout(2500);
tjek('ingen rejse anden gang', (await T(() => atomlabTest.fusion.rejse())) === null);
// Spring over midt i rejsen (fra hjælpen)
await page.click('.guide-spring').catch(() => {});
await page.click('#fusHjælp');
await page.click('#fusRejseIgen');
tjek('rejsen kan ses igen fra hjælpen', await venTil(async () => (await T(() => atomlabTest.fusion.rejse())) !== null, 3000));
await page.waitForTimeout(800);
await page.click('#fusRejseSpring');
await page.waitForTimeout(300);
tjek('"Spring over" stopper rejsen', (await T(() => atomlabTest.fusion.rejse())) === null);
tjek('styringen virker igen', await T(() => !document.querySelector('#fusion').classList.contains('rejse')));
await page.waitForTimeout(1500);
await page.click('.guide-spring').catch(() => {});
await page.waitForTimeout(500);

// ---------- Ramme-statistik (regnet inde i siden, så tiden står stille imens) ----------
await T(() => { atomlabTest.fusion.temperatur(15); });
const stat = await T(() => {
  const f = atomlabTest.fusion;
  const res = { første: 0, anden: 0, n: 0, flyt: [], flytSigt: [] };
  for (let i = 0; i < 40; i++) {
    const ps = f.partikler().filter((p) => p.type === 'p' && !(p.kastet > 0));
    const p = ps[Math.floor(Math.random() * ps.length)];
    const før = f.skærmPos(p.id);
    f.spolAlt(0.25); // som en menneskelig reaktionstid
    if (!f.partikler().some((x) => x.id === p.id)) continue;
    const efter = f.skærmPos(p.id);
    res.flyt.push(Math.hypot(efter.x - før.x, efter.y - før.y));
    if (f.kerneVed(før.x, før.y) === p.id) res.første++;
    // Andet klik: med en valgt kerne går tiden langsomt
    const q = f.partikler().filter((x) => x.type === 'p' && x.id !== p.id && !(x.kastet > 0))[0];
    f.vælg(p.id);
    f.spolAlt(1); // tempoet når at falde
    res.sigteFaktor = Math.max(res.sigteFaktor ?? 0, f.sigteFaktor());
    const før2 = f.skærmPos(q.id);
    f.spolAlt(0.25);
    if (!f.partikler().some((x) => x.id === q.id)) { f.vælg(null); continue; }
    const efter2 = f.skærmPos(q.id);
    res.flytSigt.push(Math.hypot(efter2.x - før2.x, efter2.y - før2.y));
    if (f.kerneVed(før2.x, før2.y) === q.id) res.anden++;
    res.n++;
    f.vælg(null);
    f.spolAlt(1); // tempoet når op igen
  }
  const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  res.medianFlyt = median(res.flyt);
  res.medianFlytSigt = median(res.flytSigt);
  res.under13 = res.flyt.filter((d) => d < 13).length / res.flyt.length;
  return res;
}).catch((e) => ({ fejl: e.message }));
console.log('Statistik:', JSON.stringify({ n: stat.n, første: stat.første, anden: stat.anden, medianFlyt: stat.medianFlyt?.toFixed(1), medianFlytSigt: stat.medianFlytSigt?.toFixed(1), gammelRamt: stat.under13?.toFixed(2), sigteFaktor: stat.sigteFaktor?.toFixed(2) }));
tjek('tiden går langsomt, mens man sigter', stat.sigteFaktor < 0.25, stat.sigteFaktor);
tjek('første klik rammer oftere end før', stat.første / stat.n > stat.under13, `${stat.første}/${stat.n} mod ${stat.under13}`);
tjek('andet klik rammer næsten altid', stat.anden / stat.n >= 0.85, `${stat.anden}/${stat.n}`);
await T(() => { const f = atomlabTest.fusion; if (f.valgt()) f.vælg(null); });

// ---------- Mus over en kerne: ring, navn og hånd ----------
await page.keyboard.press('Escape');
await page.click('#fusTid [data-tid="pause"]');
tjek('pause med tidsknappen', await T(() => atomlabTest.fusion.pause()));
tjek('⏸ er valgt i tidsknappen', await T(() => document.querySelector('#fusTid [data-tid="pause"]').classList.contains('valgt')));
const p0 = await T(() => { const f = atomlabTest.fusion; const alle = f.partikler().map((p) => ({ ...p, ...f.skærmPos(p.id) })); // en proton uden naboer tæt på
  return alle.filter((p) => p.type === 'p' && p.x > 400 && p.x < 900 && p.y > 150 && p.y < 650).find((p) => alle.every((q) => q.id === p.id || Math.hypot(q.x - p.x, q.y - p.y) > 45)); });
const pos0 = await T((id) => atomlabTest.fusion.skærmPos(id), p0.id);
await page.waitForTimeout(800);
const pos1 = await T((id) => atomlabTest.fusion.skærmPos(id), p0.id);
tjek('kernerne står stille i pause', Math.hypot(pos1.x - pos0.x, pos1.y - pos0.y) < 3, JSON.stringify([pos0, pos1]));
await page.mouse.move(pos1.x + 12, pos1.y + 8);
await page.waitForTimeout(700);
tjek('musen finder kernen (12 px ved siden af)', (await T(() => atomlabTest.fusion.sigte())) === p0.id, await T(() => atomlabTest.fusion.sigte()));
tjek('navnet vises ved musen', /Proton/.test(await T(() => document.querySelector('#fusSigte').textContent)) && (await synlig('#fusSigte')));
tjek('markøren er en hånd', (await T(() => document.querySelector('#fusionVindue canvas, canvas')?.style.cursor || document.body.style.cursor)) === 'pointer' || (await T(() => [...document.querySelectorAll('*')].some((e) => e.style.cursor === 'pointer'))));
await page.screenshot({ path: `${UD}/m1-peg.png` });
await page.mouse.click(pos1.x + 12, pos1.y + 8);
await page.waitForTimeout(400);
tjek('klik ved siden af vælger kernen', (await T(() => atomlabTest.fusion.valgt())) === p0.id);
// Peg på en anden proton: sigtelinje og "Klik for at skyde hertil"
const p1 = await T((id) => { const f = atomlabTest.fusion; const a = f.skærmPos(id); return f.partikler().filter((p) => p.type === 'p' && p.id !== id).map((p) => ({ id: p.id, ...f.skærmPos(p.id) })).filter((p) => p.x > 400 && p.x < 880 && p.y > 230 && p.y < 650 && Math.hypot(p.x - a.x, p.y - a.y) > 50).sort((x, y) => Math.hypot(x.x - a.x, x.y - a.y) - Math.hypot(y.x - a.x, y.y - a.y))[0]; }, p0.id);
await page.mouse.move(p1.x + 5, p1.y - 5);
await page.waitForTimeout(700);
tjek('sigtet peger på den anden proton', (await T(() => atomlabTest.fusion.sigte())) !== null);
tjek('"Klik for at skyde hertil"', /skyde hertil/.test(await T(() => document.querySelector('#fusSigte').textContent)), await T(() => document.querySelector('#fusSigte').textContent));
await page.screenshot({ path: `${UD}/m2-sigte.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
tjek('Esc fortryder valget', (await T(() => atomlabTest.fusion.valgt())) === null);
await page.keyboard.press('Space');
await page.waitForTimeout(300);
tjek('mellemrum slår pausen fra', !(await T(() => atomlabTest.fusion.pause())));
tjek('▶ er valgt igen', await T(() => atomlabTest.fusion.tidsknap() === 'spil'));

// ---------- Find kernerne ----------
await page.mouse.move(5, 5);
await T(() => atomlabTest.fusion.partikler().filter((p) => p.type === 'd').length === 0);
const harD = await T(() => atomlabTest.fusion.partikler().some((p) => p.type === 'd'));
if (!harD) {
  await page.click('#fusKerner li[data-type="d"]');
  await page.waitForTimeout(400);
  tjek('besked, når der ingen deuterium er', /ingen deuterium/i.test(await undertekst()), await undertekst());
}
await T(() => atomlabTest.fusion.tilføj('d', 1));
await page.waitForTimeout(500);
await page.click('#fusKerner li[data-type="d"]');
await page.waitForTimeout(300);
const valgtType = await T(() => { const f = atomlabTest.fusion; const id = f.valgt(); return f.partikler().find((p) => p.id === id)?.type; });
tjek('klik i listen vælger en deuterium', valgtType === 'd', valgtType);
await page.screenshot({ path: `${UD}/m3-liste.png` });
await page.keyboard.press('Escape');
await page.click('#fusOpskrift li[data-trin="0"]');
await page.waitForTimeout(300);
const valgtType2 = await T(() => { const f = atomlabTest.fusion; const id = f.valgt(); return f.partikler().find((p) => p.id === id)?.type; });
tjek('klik i opskriften vælger en proton', valgtType2 === 'p', valgtType2);
await page.keyboard.press('Escape');

// ---------- Grafen ----------
const graf = async (t) => { await T((t) => atomlabTest.fusion.temperatur(t), t); return T(() => document.querySelector('#fusGrafTekst').textContent); };
const g15 = await graf(15), g3 = await graf(3), g100 = await graf(100);
console.log(' ', g3, '|', g15, '|', g100);
tjek('grafen: 15 mio. °C ca. 26 %', /ca\. 26 %/.test(g15), g15);
tjek('grafen: 3 mio. °C under 1 %', /under 1 %/.test(g3), g3);
tjek('grafen: 100 mio. °C ca. 90 %', /ca\. 90 %/.test(g100), g100);
await graf(15);
await page.screenshot({ path: `${UD}/m4-graf.png` });
await page.locator('#fusion .venstre-panel').screenshot({ path: `${UD}/m5-venstre.png` });
await page.locator('#fusion .højre-panel').screenshot({ path: `${UD}/m6-hoejre.png` }).catch(() => {});

tjek('ingen konsolfejl', fejl.length === 0, fejl.join('\n'));
console.log(`\n${ok} OK, ${dårlig} fejl`);
await b.close();
process.exit(dårlig ? 1 : 0);
