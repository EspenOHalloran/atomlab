// Merkur (MP1 i docs/drejebog-merkur-pluto.md): tallene uden browser (soldøgnet regnet ud fra stjernedøgnet og året er
// 175,94 døgn, 3:2, Solens retning og punktet under Solen passer med JPL Horizons), og i browseren: Merkur står i
// Solsystemet mellem Solen og Venus, kortene og polkortene hentes, aksen peger mod IAU's nordpol, punktet under Solen
// i 3D-billedet passer med datoen, alt står stille i pause, Merkur drejer 6,14° pr. døgn, højderne (Rachmaninoff) og
// "Bjergene 10 gange højere", og ingen fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { MERKUR, soldøgn, solRetning, underSolen, solAfstand } from '../js/data/merkur.js';
import { SIDE } from '../js/data/sider/merkur.js';
const UD = billedmappe('merkur');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const GRAD = 180 / Math.PI;
const vinkel = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * GRAD;
const forskel = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// JPL Horizons (hentet 17. november 2026): Solens retning set fra Merkurs midte (ekliptikken, J2000, AU) og punktet
// under Solen (Merkur set fra Solen, kolonne 14). Horizons skriver Merkurs længde mod vest ("West-longitude positive"),
// så østlig længde er 360° minus den.
const HORIZONS = [
  ['2026-11-17T12:00:00Z', [0.1663507542773837, -0.2741381370993340, -0.03766078415973838], 179.896699, 0.034054],
  ['2020-01-01T12:00:00Z', [0.05219902305169877, 0.4618768609129090, 0.03295345121721140], 97.562751, -0.028187],
  ['2030-06-15T12:00:00Z', [-0.2518165950580794, -0.1972668907837342, 0.006971247597538350], 0.153808, 0.005867],
];

// ---------- Tallene uden browser ----------
{
  tjek('soldøgnet regnet ud fra stjernedøgnet (58,65) og året (87,97) er 175,94 døgn (NSSDC)', Math.abs(soldøgn() - 175.94) < 0.01, soldøgn());
  tjek('3:2: tre omgange om sig selv tager lige så lang tid som to år (under 0,05 døgn)', Math.abs(3 * MERKUR.stjernedøgn - 2 * MERKUR.år) < 0.05, 3 * MERKUR.stjernedøgn - 2 * MERKUR.år);
  tjek('soldøgnet er præcis to år (under 0,05 døgn)', Math.abs(soldøgn() - 2 * MERKUR.år) < 0.05);
  for (const [d, [X, Y, Z], vest, lat] of HORIZONS) {
    const dato = new Date(d), l = Math.hypot(X, Y, Z);
    const v = vinkel(solRetning(dato), [Y / l, Z / l, X / l]);
    const u = underSolen(dato);
    tjek(`Solens retning ${d.slice(0, 10)} passer med Horizons (under 0,05°), og afstanden`, v < 0.05 && Math.abs(solAfstand(dato) - l) < 1e-4, v);
    tjek(`punktet under Solen ${d.slice(0, 10)}: ${(360 - vest).toFixed(1)}° Ø, ${lat.toFixed(2)}° (Horizons, under 0,05°)`, forskel(u.længde, 360 - vest) < 0.05 && Math.abs(u.bredde - lat) < 0.05, JSON.stringify(u));
  }
  tjek('siden ved Merkur har en kort tekst, to emner, Billederne og "Ærligt talt"', SIDE.kort.length > 50 && SIDE.emner.length === 2 && SIDE.billeder && SIDE.ærligt);
  tjek('siden siger, hvilket døgn der er hvilket (fælde 3: 59 og 176 jorddøgn)', /59 jorddøgn/.test(SIDE.emner[0].tekst) && /176 jorddøgn/.test(SIDE.emner[0].tekst));
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

const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Merkur står i listen mellem Solen og Venus', ids.indexOf('merkur') > ids.indexOf('solen') && ids.indexOf('merkur') < ids.indexOf('venus'), JSON.stringify(ids));
const kloder = await fm(() => [...document.querySelectorAll('#solsystem .sol-klode')].map((k) => k.dataset.id));
tjek('kloden Merkur står mellem Solen og Venus i rækken af kloder', kloder[kloder.indexOf('solen') + 1] === 'merkur' && kloder[kloder.indexOf('merkur') + 1] === 'venus', kloder.join());

await s.click('#solsystem .sol-klode[data-id="merkur"]');
await s.waitForFunction(() => { const h = atomlabTest.solsystem.fænomen()?.billeder?.().hentet; return h?.kort && h.højde && Object.keys(h.pol).length === 4; }, null, { timeout: 30000, polling: 200 });
const bi = await F('billeder');
tjek('kortet, højderne og de fire polkort er hentet (tests 2k)', bi.kort === '2k' && bi.højde === '2k' && bi.hentet.kort && bi.hentet.højde && Object.values(bi.hentet.pol).every(Boolean), JSON.stringify(bi));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().billeder().tabel, null, { timeout: 20000, polling: 200 });
const a = await F('akse');
tjek('aksen peger mod IAU\'s nordpol, og kuglen har kortenes radius 2.439,4 km', a.modIAU < 0.01 && Math.abs(a.radius - 2439.4) < 0.01, JSON.stringify(a));

// Punktet under Solen i 3D-billedet passer med datoen (og datoen med Horizons ovenfor)
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const u = await F('underSolen');
tjek('punktet under Solen i 3D-billedet passer med banen og drejningen for datoen (under 0,05°)', forskel(u.længde, u.data.længde) < 0.05 && Math.abs(u.bredde - u.data.bredde) < 0.05, JSON.stringify(u));

// Pause: intet drejer
const d0 = await F('drejning'), t0 = await F('dato');
await fm(() => atomlabTest.solsystem.spol(5));
tjek('i pause står Merkur og datoen stille', (await F('drejning')) === d0 && (await F('dato')) === t0);

// ⏩: seks døgn i sekundet, Merkur drejer 6,14° pr. døgn (forlæns), og Solen følger med
await fm(() => atomlabTest.solsystem.sætTid('hurtig'));
await fm(() => atomlabTest.solsystem.spol(5)); // 5 programsekunder med ⏩ = 30 døgn
await fm(() => atomlabTest.solsystem.sætTid('pause'));
const dag = ((await F('dato')) - t0) / 864e5;
tjek('5 sekunder med ⏩ er ca. 30 døgn', Math.abs(dag - 30) < 0.5, dag);
const dW = ((((await F('drejning')) - d0) * GRAD % 360) + 360) % 360;
tjek('Merkur drejer forlæns: ca. 6,14° pr. døgn', forskel(dW, (6.1385108 * dag) % 360) < 0.5, [dW, dag]);
const u2 = await F('underSolen');
tjek('efter 30 døgn passer punktet under Solen stadig med datoen', forskel(u2.længde, u2.data.længde) < 0.05 && forskel(u2.længde, u.længde) > 1, JSON.stringify([u.længde, u2]));

// Højderne: Rachmaninoff (27,66° N, 57,37° Ø) har det laveste punkt (ca. 5,4 km under middel) og "Bjergene 10 gange højere"
const rach = await F('højde', 27.66, 57.37);
tjek('bunden af Rachmaninoff ligger mere end 3 km under kuglen (2.439,4 km)', rach < -3 && rach > -6, rach);
tjek('"Bjergene 10 gange højere" findes i Styr-boksen', await fm(() => atomlabTest.solsystem.trykPå('Bjergene 10 gange')));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() > 9.9, null, { timeout: 15000, polling: 100 }).catch(() => {});
tjek('bjergene bliver 10 gange højere', (await F('overdriv')) > 9.9, await F('overdriv'));
await fm(() => atomlabTest.solsystem.trykPå('Bjergene 10 gange'));
await s.screenshot({ path: `${UD}/merkur.png` });

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
