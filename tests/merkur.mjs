// Merkur (MP1 i docs/drejebog-merkur-pluto.md): tallene uden browser (soldøgnet regnet ud fra stjernedøgnet og året er
// 175,94 døgn, 3:2, Solens retning og punktet under Solen passer med JPL Horizons), og i browseren: Merkur står i
// Solsystemet mellem Solen og Venus, kortene og polkortene hentes, aksen peger mod IAU's nordpol, punktet under Solen
// i 3D-billedet passer med datoen, alt står stille i pause, Merkur drejer 6,14° pr. døgn, højderne (Rachmaninoff) og
// "Bjergene 10 gange højere", og ingen fejl i konsollen. MP2: Solen, der vender om (baglæns i ca. 8 døgn og 1,1°, og
// den dobbelte solopgang), timevinklen, teksterne (fire spørgsmål, seks stop under 160 tegn), stederne på den rigtige
// bredde og længde med Solen fra den rigtige side, isen, tegningen af Solen og flybyen til isen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { MERKUR, soldøgn, solRetning, underSolen, solAfstand } from '../js/data/merkur.js';
import { SIDE, SIDER, TUR } from '../js/data/sider/merkur.js';
import { dobbeltSolopgang, solHøjde, solSkive, timevinkel, datoMedTimevinkel } from '../js/data/merkur-sol.js';
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
  tjek('siden ved Merkur har en kort tekst, fire spørgsmål, Billederne og "Ærligt talt"', SIDE.kort.length > 50 && SIDE.emner.length === 4 && SIDE.billeder && SIDE.ærligt);
  tjek('siden siger, hvilket døgn der er hvilket (fælde 3: 59 og 176 jorddøgn)', SIDE.emner.some((e) => /59 jorddøgn/.test(e.tekst) && /176 jorddøgn/.test(e.tekst)));
  // MP2: Solen, der vender om (del 8, afsnit 2: baglæns i ca. 8,1 døgn og 1,1°, skiven 1,73° ved perihel)
  const D = 864e5;
  const d = dobbeltSolopgang(Date.parse('2026-11-17T12:00:00Z'));
  tjek('Solen går baglæns i ca. 8 døgn og ca. 1,1° ved perihel', d.døgn > 7.8 && d.døgn < 8.4 && d.baglæns > 1.05 && d.baglæns < 1.2, JSON.stringify([d.døgn, d.baglæns]));
  tjek('Solens skive er ca. 1,73° bred ved perihel (3,25 gange så bred som fra Jorden)', Math.abs(solSkive(new Date(d.perihel)) - 1.73) < 0.01);
  // Solens øverste kant ved stedet: op, ned under horisonten igen og op for alvor
  const ø = (t) => solHøjde(new Date(t), d.længde) + solSkive(new Date(t)) / 2;
  const skift = [];
  for (let t = d.start, før = ø(t) > 0; t <= d.slut; t += D / 24) { const op = ø(t) > 0; if (op !== før) skift.push(op ? 'op' : 'ned'); før = op; }
  tjek('den dobbelte solopgang: Solen kommer et stykke op, går ned igen og står op for alvor (højst to tredjedele af skiven)', skift.join() === 'op,ned,op' && ø(d.stille1) < (2 / 3) * solSkive(new Date(d.stille1)) && Math.abs(Math.abs(((d.længde - 0) % 180)) - 90) < 2, skift.join() + ' ' + d.længde);
  const t9 = datoMedTimevinkel(Date.parse('2026-11-17T12:00:00Z'), 161.98, -72);
  tjek('datoMedTimevinkel finder formiddag ved Caloris (timevinkel −72°) under et halvt soldøgn væk', Math.abs(timevinkel(new Date(t9), 161.98) + 72) < 0.01 && Math.abs(t9 - Date.parse('2026-11-17T12:00:00Z')) < 88.5 * D);
  tjek('flybyen har 6 stop, og underteksterne er under 160 tegn', TUR.length === 6 && TUR.every((t) => t.tekst.length < 160), TUR.map((t) => t.tekst.length).join());
  tjek('stederne har egne sider (Caloris, de lyse huller med MESSENGERs foto, isen og Solen, der vender om)', ['caloris', 'huller', 'is', 'solen'].every((id) => SIDER[id]?.kort) && SIDER.huller.foto?.src);
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
// ⏩, spoling og pause i ét kald, så testbrowserens egne billeder ikke lægger tid til imellem (Åbne punkter 18. november 2026)
await fm((n) => { const t = atomlabTest.solsystem; t.sætTid('hurtig'); t.spol(n); t.sætTid('pause'); }, 5); // 5 programsekunder med ⏩ = 30 døgn
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

// ---------- MP2: stederne, isen, tegningen af Solen og flybyen ----------
const træ = await fm(() => atomlabTest.solsystem.træ().map((p) => p.id));
tjek('træet: flybyen, Merkur, de tre steder og Solen, der vender om', træ.join() === 'tur,merkur,caloris,huller,is,solen', træ.join());
const flyvFærdig = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 200 });
const STEDER = { caloris: [31.65, 161.98], huller: [27.15, 119.06], is: [85.77, 62.92] };
const kl = {};
for (const [id, [b0, l0]] of Object.entries(STEDER)) {
  await fm((id) => atomlabTest.solsystem.gåTil(id), id);
  await flyvFærdig();
  await s.waitForTimeout(300);
  const m = await F('midte');
  kl[id] = await F('klokken', id);
  tjek(`${id}: kameraet kigger på stedet (${b0}° N, ${l0}° Ø), og panelet viser stedets side`, Math.abs(m.bredde - b0) < 0.3 && forskel(m.længde, l0) < (id === 'is' ? 3 : 0.3) && (await fm(() => atomlabTest.solsystem.side().nøgle)) === `merkur:${id}`, JSON.stringify(m));
}
tjek('Solen står fra samme side som i fotoene: lavt i øst ved Caloris og i vest i Raditladi, og 3D-billedet passer med tallene', kl.caloris.sol.øst > 0.8 && kl.caloris.sol.højde > 5 && kl.caloris.sol.højde < 25 && kl.huller.sol.øst < -0.8 && Math.abs(kl.caloris.sol.højde - kl.caloris.data) < 0.05, JSON.stringify([kl.caloris, kl.huller]));
tjek('ved Prokofiev står Solen kun ca. 4° oppe (middag)', kl.is.sol.højde > 3.5 && kl.is.sol.højde < 4.6, JSON.stringify(kl.is));
tjek('ved et sted står tiden stille', (await fm(() => atomlabTest.solsystem.tidsknap())) === 'pause');
await fm(() => atomlabTest.solsystem.trykPå('Isen (set med radar)'));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().is().styrke > 0.99, null, { timeout: 15000, polling: 100 }).catch(() => {});
const is = await F('is');
tjek('"Isen (set med radar)": radarens kort er hentet og toner ind i shaderen', is.til && is.hentet && is.shader > 0.85, JSON.stringify(is));
await fm(() => atomlabTest.solsystem.trykPå('Isen (set med radar)'));
await s.screenshot({ path: `${UD}/merkur-is.png` });

// Flybyen: stop 4 (Solen, der vender om) viser tegningen, og Solen står stille ved det første vendepunkt
await F('flybyTil', 3);
await flyvFærdig();
await s.waitForTimeout(600);
let st = await F('solTegning');
tjek('stop 4: tegningen af Solen er fremme, datoen er ca. 10 døgn før perihel, og tiden går (▶)', st.vist && Math.abs((await F('dato')) - st.solopgang.start) < 2 * 864e5 && /Solen/.test(st.status) && (await fm(() => atomlabTest.solsystem.tidsknap())) === 'spil', JSON.stringify(st.status));
await fm(() => atomlabTest.solsystem.sætTid('pause'));
await F('sætDato', st.solopgang.stille1);
await s.waitForTimeout(600);
st = await F('solTegning');
tjek('ved det første vendepunkt står Solen stille med en del af skiven over horisonten', /står stille/.test(st.status) && st.y < 104, JSON.stringify(st));
await s.screenshot({ path: `${UD}/merkur-solen.png` });
await F('flybyTil', 5);
await flyvFærdig();
await s.waitForTimeout(600);
tjek('flybyens sidste stop er isen ved Nordpolen, og isen slås til', (await F('visning')) === 'is' && (await F('is')).til && !(await F('solTegning')).vist);

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
