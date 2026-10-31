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
const knapper = () => T((sk) => atomlabTest[sk].bjælke(), skærm); // knapperne i bjælken: { tekst, slået }
const har = async (tekst) => (await knapper()).some((k) => k.tekst.includes(tekst) && !k.slået);
// Tryk på en knap i bjælken (efter teksten) og spol frem
const tryk = (tekst, spol = 3) => T(([t, s, sk]) => { const k = atomlabTest[sk]; const ok = k.trykPå(t); k.spol(s); k.kameraFrem(); return ok; }, [tekst, spol, skærm]);
const sætSkyder = (v) => T((v) => { const i = document.querySelector('#kosmosStyr input[type=range]'); i.value = v; i.dispatchEvent(new Event('input')); }, v);

await page.goto(`${ADRESSE}/?test#kosmos`);
await page.waitForTimeout(1500);
tjek('Big Bang er det første fænomen i listen', (await T(() => atomlabTest.kosmos.fænomener[0])) === 'bigbang');

// ---------- Big Bang ----------
await T(() => atomlabTest.kosmos.vælg('bigbang'));
await page.waitForTimeout(300);
tjek('Big Bang: bjælken har "▶ Start universet"', await har('Start universet'), JSON.stringify(await knapper()));
await tryk('Start universet');
tjek('Big Bang: første trin vises', (await undertekst()).includes('Det første øjeblik'), await undertekst());
tjek('Big Bang: bjælken har "‹" (slået fra) og "Næste: protoner og neutroner ›"', JSON.stringify(await knapper()) === JSON.stringify([{ tekst: '‹', slået: true }, { tekst: 'Næste: protoner og neutroner ›', slået: false }]), JSON.stringify(await knapper()));
await tryk('Næste', 2); // protoner og neutroner
tjek('Big Bang: lige mange protoner og neutroner', (await panel()).includes('Frie protoner: 64') && (await panel()).includes('Frie neutroner: 64'), await panel());
await tryk('Næste', 6); // neutronerne bliver færre
tjek('Big Bang: 1 neutron for hver 7 protoner', (await panel()).includes('Frie protoner: 112') && (await panel()).includes('Frie neutroner: 16'), await panel());
await tryk('Næste', 5); // fusion
tjek('Big Bang: 25 % helium efter fusionen', (await panel()).includes('Helium: 25 %'), await panel());
await page.waitForTimeout(500);
await page.screenshot({ path: `${UD}/bigbang-fusion.png` });
for (let i = 0; i < 3; i++) await tryk('Næste', 4);
tjek('Big Bang: sidste trin er de første stjerner', (await undertekst()).includes('De første stjerner'), await undertekst());
tjek('Big Bang: til sidst står "↺ Forfra" i stedet for "Næste"', !(await har('Næste')) && (await har('Forfra')), JSON.stringify(await knapper()));
await page.screenshot({ path: `${UD}/bigbang-stjerner.png` });
// "‹" går et trin tilbage, og et tryk på en prik springer til trinet (universet bygges op igen)
await tryk('‹', 1);
tjek('Big Bang: "‹" går et trin tilbage', (await T(() => atomlabTest.kosmos.trin().nr)) === 5 && (await undertekst()).includes('atomer'), await undertekst());
await page.click('#kosmosVindue .ut-trin button:nth-child(2)');
await T(() => atomlabTest.kosmos.spol(2));
tjek('Big Bang: et tryk på den anden prik går til trin 2 (lige mange protoner og neutroner)', (await T(() => atomlabTest.kosmos.trin().nr)) === 1 && (await panel()).includes('Frie neutroner: 64'), await panel());
await page.click('#kosmosVindue .ut-trin button:nth-child(4)');
await T(() => atomlabTest.kosmos.spol(6));
tjek('Big Bang: en prik frem går til fusionen (25 % helium)', (await T(() => atomlabTest.kosmos.trin().nr)) === 3 && (await panel()).includes('Helium: 25 %'), await panel());
for (let i = 0; i < 3; i++) await tryk('Næste', 1);
await tryk('Forfra', 1);
tjek('Big Bang: forfra kan startes igen', await har('Start universet'));

// ---------- Ny stjerne ----------
await T(() => atomlabTest.kosmos.vælg('stjernefoedsel'));
await page.waitForTimeout(300);
for (const [nr, forventet] of [[1, 'brun dværg'], [5, 'stjerne som Solen'], [9, 'kæmpestjerne']]) {
  await sætSkyder(nr);
  await tryk('Lad skyen falde sammen', 20);
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
await tryk('Næste', 3);
await tryk('Næste', 6);
tjek('Solens fremtid: rød kæmpe', (await undertekst()).includes('rød kæmpe') && (await panel()).includes('over 200 gange'), await panel());
await page.screenshot({ path: `${UD}/sol-kaempe.png` });
await tryk('Næste', 3);
await tryk('Næste', 6);
await tryk('Næste', 6);
tjek('Solens fremtid: ender som hvid dværg, og bjælken har "↺ Forfra"', (await undertekst()).includes('hvid dværg') && !(await har('Næste')) && (await har('Forfra')), await undertekst());
await page.screenshot({ path: `${UD}/sol-dvaerg.png` });
// En prik fra start springer direkte til den hvide dværg: De sprungne trin spoles igennem, så Solen er væk
await tryk('Forfra', 1);
await page.click('#solsystemVindue .ut-trin button:last-child');
await T(() => atomlabTest.solsystem.spol(6));
tjek('Solens fremtid: en prik springer til den hvide dværg', (await undertekst()).includes('hvid dværg') && (await T(() => atomlabTest.solsystem.trin().nr)) === 5, await undertekst());

// ---------- Hvid dværg (type Ia) ----------
skærm = 'kosmos';
await T(() => { location.hash = '#kosmos'; });
await page.waitForFunction(() => document.querySelector('#kosmos:not(.skjult)'));
await T(() => atomlabTest.kosmos.vælg('hviddvaerg'));
await page.waitForTimeout(300);
tjek('Hvid dværg: starter ved 1,00 sol', (await panel()).includes('1,00 sole'), await panel());
await tryk('Lad den suge gas', 6);
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
