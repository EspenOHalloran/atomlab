// Pluto og Charon (MP3 i docs/drejebog-merkur-pluto.md): tallene uden browser (punktet under Solen passer med JPL
// Horizons, tyngdepunktet ligger ca. 940 km over overfladen, Charon er ca. 3,8° bred på Plutos himmel), og i browseren:
// Pluto står sidst i Solsystemet efter Neptun, kortene hentes, aksen peger mod IAU's pol, og kortets midte er 180°,
// punktet under Solen i 3D-billedet passer med datoen, Charon står over længde 0° og vender længde 0° mod Pluto (også
// efter en omgang), tyngdepunktet, alt står stille i pause, højderne (Sputnik Planitia lavt, Tenzing Montes højt, og
// bagsiden glat), langt ude kigger kameraet på tyngdepunktet (dansen), "Modlys" sætter Solen bag Pluto, Charon i træet,
// og ingen fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PLUTO, TYNGDEPUNKT, underSolen, charonPåHimlen, lysTimer } from '../js/data/pluto.js';
import { SIDE, SIDER } from '../js/data/sider/pluto.js';
const UD = billedmappe('pluto');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const GRAD = 180 / Math.PI;
const forskel = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// JPL Horizons (hentet 17. november 2026, Pluto 999 set fra Charons midte, kolonne 15: punktet under Solen, østlig længde)
const HORIZONS = [
  ['2015-07-14T11:49:00Z', 127.844335, 51.553861],
  ['2026-11-17T00:00:00Z', 194.027847, 60.085091],
  ['2031-05-10T18:00:00Z', 143.962747, 60.253044],
];

// ---------- Tallene uden browser ----------
{
  for (const [d, l, b] of HORIZONS) {
    const u = underSolen(new Date(d));
    // (0,05°: forskellen mellem UT og TDB er ca. et minut, og Pluto drejer 0,04° på et minut)
    tjek(`punktet under Solen ${d.slice(0, 10)}: ${l.toFixed(1)}° Ø, ${b.toFixed(1)}° N (Horizons, under 0,1°)`, forskel(u.længde, l) < 0.1 && Math.abs(u.bredde - b) < 0.05, JSON.stringify(u));
  }
  tjek('tyngdepunktet ligger ca. 2.126 km fra Plutos midte, ca. 940 km over overfladen', Math.abs(TYNGDEPUNKT - 2126) < 2 && Math.abs(TYNGDEPUNKT - PLUTO.radius - 938) < 3, TYNGDEPUNKT);
  tjek('Charon er ca. 3,8° bred på Plutos himmel', Math.abs(charonPåHimlen() - 3.8) < 0.05, charonPåHimlen());
  tjek('sollyset er ca. 5 timer om at nå Pluto i 2026', Math.abs(lysTimer(new Date('2026-11-17')) - 4.94) < 0.05, lysTimer(new Date('2026-11-17')));
  tjek('siden ved Pluto har en kort tekst, to emner, "For nørder", Billederne og "Ærligt talt", og Charon har sin egen side', SIDE.kort.length > 50 && SIDE.emner.length === 2 && SIDE.nørd && SIDE.billeder && SIDE.ærligt && SIDER.charon?.kort && SIDER.charon.emner.length === 1);
}

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
const fm = (f, a) => s.evaluate(f, a);
const F = (navn, ...a) => fm(([navn, a]) => atomlabTest.solsystem.fænomen()[navn](...a), [navn, a]);
const flyvFærdig = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 200 });

const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Pluto står sidst i listen, efter Neptun', ids.at(-1) === 'pluto' && ids.at(-2) === 'neptun', JSON.stringify(ids));
await s.click('#solsystem .sol-klode[data-id="pluto"]');
await s.waitForFunction(() => { const h = atomlabTest.solsystem.fænomen()?.billeder?.().hentet; return h && Object.values(h).every(Boolean); }, null, { timeout: 30000, polling: 200 });
const bi = await F('billeder');
tjek('kortet, højderne og Charons kort og farve er hentet (tests 2k)', bi.kort === '2k' && bi.højde === '2k', JSON.stringify(bi));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().billeder().tabel, null, { timeout: 20000, polling: 200 });
const a = await F('akse');
tjek('aksen peger mod IAU\'s pol, kuglen har radius 1.188,3 km, og kortets midte er længde 180°', a.modIAU < 0.01 && Math.abs(a.radius - 1188.3) < 0.01 && forskel(a.kortetsMidte, 180) < 0.01, JSON.stringify(a));

await fm(() => atomlabTest.solsystem.sætTid('pause'));
const u = await F('underSolen');
tjek('punktet under Solen i 3D-billedet passer med banen og drejningen for datoen (under 0,05°)', forskel(u.længde, u.data.længde) < 0.05 && Math.abs(u.bredde - u.data.bredde) < 0.05, JSON.stringify(u));
const c = await F('charon');
tjek('Charon står over længde 0° på Pluto, 19.596 km væk, og vender selv længde 0° mod Pluto', Math.abs(c.underCharon.længde) < 0.01 && Math.abs(c.underCharon.bredde) < 0.01 && Math.abs(c.afstand - 19596) < 1 && Math.abs(c.charonModPluto.længde) < 0.01, JSON.stringify(c));
tjek('tyngdepunktet ligger uden for Pluto, ca. 940 km over overfladen', Math.abs(c.overOverfladen - 938) < 3, c.overOverfladen);

// Pause: intet drejer
const d0 = await F('drejning'), t0 = await F('dato');
await fm(() => atomlabTest.solsystem.spol(5));
tjek('i pause står Pluto og datoen stille', (await F('drejning')) === d0 && (await F('dato')) === t0);
// ⏩: et døgn i sekundet. Efter ca. en hel omgang står Charon stadig over længde 0°
await fm(() => atomlabTest.solsystem.sætTid('hurtig'));
await fm(() => atomlabTest.solsystem.spol(6.4));
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const dag = ((await F('dato')) - t0) / 864e5;
const dW = ((((await F('drejning')) - d0) * GRAD % 360) + 360) % 360;
const c2 = await F('charon');
const u2 = await F('underSolen');
tjek('6,4 sekunder med ⏩ er ca. 6,4 døgn, og Pluto er drejet ca. en omgang (56,36° pr. døgn)', Math.abs(dag - 6.4) < 0.1 && forskel(dW, (56.3625225 * dag) % 360) < 0.5, [dag, dW]);
tjek('efter en omgang står Charon stadig over længde 0°, og punktet under Solen passer med datoen', Math.abs(c2.underCharon.længde) < 0.01 && forskel(u2.længde, u2.data.længde) < 0.05, JSON.stringify([c2.underCharon, u2]));

// Højderne: Sputnik Planitia er en lav slette, Tenzing Montes høje bjerge, og bagsiden er glat (0)
// (i tests er højderne 2k, ca. 3,6 km pr. pixel, så toppene er lavere end i kilden: Tenzing Montes når ca. 3,9 km)
const højst = async (b0, l0) => { let m = -1e9; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) m = Math.max(m, await F('højde', b0 + i * 0.4, l0 + j * 0.4)); return m; };
const sputnik = await F('højde', 19.5, 178.7), tenzing = await højst(-15.6, 177.4), bag = await F('højde', -10, 0);
tjek('Sputnik Planitia ligger lavt (under −0,5 km), bjergene ved Tenzing Montes rager over 1 km højere op, og bagsiden er glat', sputnik < -0.5 && tenzing > sputnik + 1 && Math.abs(bag) < 0.3, JSON.stringify([sputnik, tenzing, bag]));

// Langt ude kigger kameraet på tyngdepunktet (dansen), tæt på på Plutos midte
await F('helFra', 70, 90, 40);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().fokus().fraMidte > 2100, null, { timeout: 10000, polling: 100 }).catch(() => {});
const fUd = await F('fokus');
await F('helFra', 20, 180, 2);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().fokus().fraMidte < 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
const fInd = await F('fokus');
tjek('langt ude står tyngdepunktet i midten (2.126 km fra Plutos midte), tæt på Plutos midte', Math.abs(fUd.fraMidte - 2126) < 5 && fInd.fraMidte < 1, JSON.stringify([fUd.fraMidte, fInd.fraMidte]));

// Modlys: kameraet bag Pluto, Solen lige bag kanten
tjek('"Modlys" findes i Styr-boksen', await fm(() => atomlabTest.solsystem.trykPå('Modlys')));
await F('hop');
await flyvFærdig();
await s.waitForTimeout(300);
const sb = await F('solBag');
tjek('i modlys står Solen bag Pluto (inden for Plutos kant set fra kameraet)', sb.vinkel < sb.plutoRadius && sb.vinkel > 1, JSON.stringify(sb));
await s.screenshot({ path: `${UD}/pluto-modlys.png` });
await fm(() => atomlabTest.solsystem.trykPå('Modlys'));

// Charon i træet: kameraet flyver ud til Charon, tiden står stille, og panelet viser Charons side
const træ = await fm(() => atomlabTest.solsystem.træ().map((p) => p.id));
tjek('træet: Pluto og Charon', træ.join() === 'pluto,charon', træ.join());
await fm(() => atomlabTest.solsystem.gåTil('charon'));
await F('hop');
await flyvFærdig();
await s.waitForTimeout(300);
const fC = await F('fokus'), cc = await F('charon');
tjek('ved Charon kigger kameraet på Charon, tiden står stille, og panelet viser Charons side', Math.abs(fC.fraMidte - cc.afstand) < 1 && (await fm(() => atomlabTest.solsystem.tidsknap())) === 'pause' && (await fm(() => atomlabTest.solsystem.side().nøgle)) === 'pluto:charon', JSON.stringify([fC.fraMidte, cc.afstand]));
await s.screenshot({ path: `${UD}/pluto-charon.png` });

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
