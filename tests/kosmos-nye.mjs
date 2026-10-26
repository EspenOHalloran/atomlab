// Fire fænomener med trin: Big Bang, Ny stjerne og Hvid dværg (type Ia-supernova) i Kosmos og Solens fremtid i Solsystemet
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('kosmos-nye');
const b = await chromium.launch({ args: ARGS });
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const T = (f, a) => page.evaluate(f, a);
let skærm = 'kosmos'; // Solens fremtid ligger i Solsystemet
const panel = () => page.textContent(`#${skærm}Forklaring`);
const undertekst = () => T((s) => document.querySelector(`#${s}Vindue .undertekst`)?.textContent ?? '', skærm);
const knapper = () => T((s) => [...document.querySelectorAll(`#${s}Styring button`)].map((k) => ({ tekst: k.textContent, slået: k.disabled })), skærm);
// Tryk på en knap (via testadgangen) og spol frem
const tryk = (i, spol = 3) => T(([i, s, sk]) => { const k = atomlabTest[sk]; k.tryk(i); k.spol(s); k.kameraFrem(); }, [i, spol, skærm]);
const sætSkyder = (v) => T((v) => { const i = document.querySelector('#kosmosStyring input[type=range]'); i.value = v; i.dispatchEvent(new Event('input')); }, v);

await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForTimeout(1500);
tjek('Big Bang er det første fænomen i listen', (await T(() => atomlabTest.kosmos.fænomener[0])) === 'bigbang');

// ---------- Big Bang ----------
await T(() => atomlabTest.kosmos.vælg('bigbang'));
await page.waitForTimeout(300);
await tryk(0); // start
tjek('Big Bang: første trin vises', (await undertekst()).includes('Det første øjeblik'), await undertekst());
await tryk(1, 2); // protoner og neutroner
tjek('Big Bang: lige mange protoner og neutroner', (await panel()).includes('Frie protoner: 64') && (await panel()).includes('Frie neutroner: 64'), await panel());
await tryk(1, 6); // neutronerne bliver færre
tjek('Big Bang: 1 neutron for hver 7 protoner', (await panel()).includes('Frie protoner: 112') && (await panel()).includes('Frie neutroner: 16'), await panel());
await tryk(1, 5); // fusion
tjek('Big Bang: 25 % helium efter fusionen', (await panel()).includes('Helium: 25 %'), await panel());
await page.waitForTimeout(500);
await page.screenshot({ path: `${UD}/bigbang-fusion.png` });
for (let i = 0; i < 3; i++) await tryk(1, 4);
tjek('Big Bang: sidste trin er de første stjerner', (await undertekst()).includes('De første stjerner'), await undertekst());
tjek('Big Bang: "Næste" er slået fra til sidst', (await knapper())[1].slået, JSON.stringify(await knapper()));
await page.screenshot({ path: `${UD}/bigbang-stjerner.png` });
await tryk(2, 1); // forfra
tjek('Big Bang: forfra kan startes igen', !(await knapper())[0].slået);

// ---------- Ny stjerne ----------
await T(() => atomlabTest.kosmos.vælg('stjernefoedsel'));
await page.waitForTimeout(300);
for (const [nr, forventet] of [[1, 'brun dværg'], [5, 'stjerne som Solen'], [9, 'kæmpestjerne']]) {
  await sætSkyder(nr);
  await tryk(1, 20);
  const tekst = await panel();
  tjek(`Ny stjerne: masse nr. ${nr} giver ${forventet}`, tekst.toLowerCase().includes(forventet.toLowerCase()), tekst);
  if (nr === 5) await page.screenshot({ path: `${UD}/stjerne-sol.png` });
}

// ---------- Solens fremtid ----------
skærm = 'solsystem';
await T(() => { location.hash = '#solsystem'; });
await page.waitForFunction(() => document.querySelector('#solsystem:not(.skjult)'));
await T(() => atomlabTest.solsystem.vælg('solensfremtid'));
await page.waitForTimeout(300);
tjek('Solens fremtid: starter med Solen i dag', (await undertekst()).includes('Solen i dag'), await undertekst());
await tryk(0, 3);
await tryk(0, 6);
tjek('Solens fremtid: rød kæmpe', (await undertekst()).includes('rød kæmpe') && (await panel()).includes('over 200 gange'), await panel());
await page.screenshot({ path: `${UD}/sol-kaempe.png` });
await tryk(0, 3);
await tryk(0, 6);
await tryk(0, 6);
tjek('Solens fremtid: ender som hvid dværg', (await undertekst()).includes('hvid dværg') && (await knapper())[0].slået, await undertekst());
await page.screenshot({ path: `${UD}/sol-dvaerg.png` });

// ---------- Hvid dværg (type Ia) ----------
skærm = 'kosmos';
await T(() => { location.hash = '#kosmos'; });
await page.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'));
await T(() => atomlabTest.kosmos.vælg('hviddvaerg'));
await page.waitForTimeout(300);
tjek('Hvid dværg: starter ved 1,00 sol', (await panel()).includes('1,00 sole'), await panel());
await tryk(0, 6);
const masse = Number((await panel()).match(/masse:\s*([\d,]+)/)?.[1].replace(',', '.'));
tjek('Hvid dværg: bliver tungere', masse > 1.1 && masse < 1.4, masse);
await T(() => atomlabTest.kosmos.spol(9)); // eksplosionen sker efter ca. 13,5 sekunder
tjek('Hvid dværg: eksploderer', (await panel()).includes('Dage efter eksplosionen'), await panel());
// 100 dage efter eksplosionen: nikkel-56 er væk, ca. 44 % cobalt-56 og 56 % jern-56 (halveringstider 6,1 og 77,2 dage)
const før = await T(() => Number(document.querySelector('#kosmosForklaring').textContent.match(/eksplosionen:\s*(\d+)/)[1]));
await T((s) => atomlabTest.kosmos.spol(s), (100 - før) / 10);
const tekst = await panel();
tjek('Hvid dværg: henfaldene passer efter ca. 100 dage', /Nikkel-56: 0 %/.test(tekst) && /Cobalt-56: 4[3-5] %/.test(tekst) && /Jern-56: 5[5-7] %/.test(tekst), tekst);
await page.waitForTimeout(500);
await page.screenshot({ path: `${UD}/hvid-dvaerg.png` });

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
