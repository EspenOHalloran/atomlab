// Solsystemets overblik (docs/drejebog-overblik.md, trin 1-3 af byggeriet): banerne passer med JPL Horizons (også i
// 1850 og 2100 og Pluto fra tabellen), omløbstiderne og Merkurs fire omgange på et år, Pluto var tættere på Solen
// end Neptun 1979-1999, og Uranus' og Neptuns data er de samme som før (Kepler-regningen er flyttet til planeter.js).
// I browseren: overblikket er Solsystemets forside og den første klode, skalaen med to stillinger, spole-skyderen
// (et fuldt træk er et år, ⏪ ⏩ og "I dag"), datoen 1800-2100, et tryk vælger den nærmeste planet, flyvningen ind
// til en planet og tilbage, datoen følger med til Jorden, Merkur og Pluto som steder med et panel, og konsollen er
// uden fejl.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { PLANETER, plads, solAfstand, lysTid, FØRSTE, SIDSTE } from '../js/data/planeter.js';
import { plads as isPlads } from '../js/data/isgiganter.js';
const UD = billedmappe('overblik');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
const GRAD = 180 / Math.PI;
const vinkel = (a, b) => Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)))) * GRAD;
const jd = (j) => new Date((j - 2440587.5) * 864e5);

// ---------- Tallene uden browser ----------
{
  // JPL Horizons (500@10, ekliptikken J2000, AU), hentet 15. november 2026: 1850-01-01, 1979-06-01, 2026-11-14 og 2100-01-01
  const DATOER = [2396758.5, 2444025.5, 2461358.5, 2488069.5];
  const HORIZONS = {
    merkur: [[0.2567995726, -0.3372771758, -0.0511551348], [0.0475959196, 0.3032320608, 0.0203913676], [-0.0550616246, 0.3053255014, 0.0300025305], [0.2387416046, -0.3565573468, -0.0510253786]],
    venus: [[-0.2766106961, -0.6706343042, 0.0071122308], [0.7026793624, 0.1766565971, -0.0381677260], [0.3185965523, 0.6472413979, -0.0094880579], [0.6875297939, 0.2278299452, -0.0364514237]],
    jorden: [[-0.2109980549, 0.9603502646, 0.0003212720], [-0.3431237196, -0.9541744638, -0.0000460079], [0.6193724961, 0.7717063969, -0.0000514792], [-0.1574347093, 0.9706900210, -0.0002176448]],
    mars: [[-0.1410067704, 1.5770322621, 0.0364675820], [1.3118654364, 0.5405375874, -0.0209794194], [-0.4582101466, 1.5405465029, 0.0435194573], [0.6096557739, 1.3807522601, 0.0141235799]],
    jupiter: [[-5.2369532415, 1.3908618830, 0.1119970000], [-3.7291241781, 3.7914021462, 0.0679483842], [-3.7377775504, 3.7864968047, 0.0678987478], [-5.3737606252, -0.9084811840, 0.1238877217]],
    saturn: [[9.2957258080, 1.6195183044, -0.3968876738], [-8.9886860944, 2.5739477660, 0.3121503488], [9.1963795049, 2.0065628555, -0.4010179914], [-9.1530853370, -3.0789931543, 0.4182399744]],
    uranus: [[17.7019927763, 9.0949692885, -0.1964037158], [-12.1274300223, -14.2206610570, 0.1046355570], [8.7751432026, 17.3391884439, -0.0493830022], [18.8650711240, 6.5489110646, -0.2196578702]],
    neptun: [[27.4404296060, -12.0586863976, -0.3838282298], [-5.5945148893, -29.7517269037, 0.7415891102], [29.8297170209, 1.5188148147, -0.7186966157], [-29.0592300538, 8.2351730277, 0.5001941230]],
    pluto: [[40.3651525988, 23.4660995938, -14.1869199218], [-27.4124144632, -9.1753226445, 8.9092656368], [20.0820207721, -29.3231821871, -2.6704358256], [39.6753092282, 24.9047633086, -14.1432115164]],
  };
  let værst = { v: 0 };
  for (const [id, liste] of Object.entries(HORIZONS)) {
    liste.forEach((h, i) => {
      const v = vinkel(plads(id, jd(DATOER[i])), h);
      if (v > værst.v) værst = { v, id, i };
    });
  }
  tjek('alle ni passer med Horizons i 1850, 1979, 2026 og 2100 (højst 0,5° fra Solen set, tabel 1 brugt til 2100)', værst.v < 0.5, JSON.stringify(værst));
  tjek('i dag (14. november 2026) passer de inderste inden for 0,01°', ['merkur', 'venus', 'jorden', 'mars'].every((id) => vinkel(plads(id, jd(DATOER[2])), HORIZONS[id][2]) < 0.01));
  tjek('Pluto fra tabellen passer inden for 0,01° og 0,01 AU', DATOER.every((d, i) => vinkel(plads('pluto', jd(d)), HORIZONS.pluto[i]) < 0.01 && Math.abs(Math.hypot(...plads('pluto', jd(d))) - Math.hypot(...HORIZONS.pluto[i])) < 0.01));
  // Uranus og Neptun regnes stadig på samme måde (isgiganter.js bruger nu kepler fra planeter.js)
  const nu = new Date('2026-11-14');
  tjek('isgiganter.js giver de samme pladser som planeter.js', ['uranus', 'neptun'].every((id) => vinkel(isPlads(id, nu), plads(id, nu)) < 1e-4));
  // Omløbstiderne (NSSDC) og fakta 5: Merkur når over fire omgange på et år, Neptun flytter sig ca. 2°
  const år = 365.25 * 864e5;
  const vinkelPå = (id, fra, til) => { let s = 0; let f = plads(id, new Date(fra)); for (let t = fra + 864e5; t <= til; t += 864e5) { const p = plads(id, new Date(t)); s += vinkel(f, p); f = p; } return s; };
  const merkur = vinkelPå('merkur', Date.UTC(2026, 10, 14), Date.UTC(2026, 10, 14) + år) / 360;
  const neptun = vinkelPå('neptun', Date.UTC(2026, 10, 14), Date.UTC(2026, 10, 14) + år);
  tjek('på et år når Merkur over fire omgange og Neptun ca. 2°', merkur > 4.05 && merkur < 4.25 && neptun > 1.9 && neptun < 2.5, `${merkur.toFixed(2)} omgange, ${neptun.toFixed(2)}°`);
  tjek('omløbstiderne: Merkur 88 døgn, Jorden 365,3, Jupiter 11,9 år, Neptun 164 år, Pluto 248 år', Math.round(PLANETER[0].omløb) === 88 && Math.abs(PLANETER[2].omløb - 365.256) < 0.01 && Math.abs(PLANETER[4].omløb / 365.25 - 11.86) < 0.01 && Math.abs(PLANETER[7].omløb / 365.25 - 164.8) < 0.2 && Math.round(PLANETER[8].omløb / 365.25) === 248);
  // Pluto tættere på Solen end Neptun (udfordringen: 1979-1999)
  const tættere = (t) => solAfstand('pluto', new Date(t)) < solAfstand('neptun', new Date(t));
  tjek('Pluto var tættere på Solen end Neptun fra 1979 til 1999 og ikke i 1978, 2000 eller i dag', tættere(Date.UTC(1979, 5, 1)) && tættere(Date.UTC(1998, 11, 1)) && !tættere(Date.UTC(1978, 0, 1)) && !tættere(Date.UTC(2000, 0, 1)) && !tættere(Date.UTC(2026, 10, 14)));
  // Lyset: 8 min 14 s til Jorden og ca. 4 t 8 min til Neptun den 14. november 2026 (fakta 3)
  const lJ = lysTid('jorden', nu), lN = lysTid('neptun', nu);
  tjek('lyset er 8 min 14 s om at nå Jorden og ca. 4 t 8 min om at nå Neptun i dag', Math.abs(lJ - 494) < 3 && Math.abs(lN - (4 * 3600 + 8 * 60)) < 120, `${lJ.toFixed(0)} s, ${(lN / 60).toFixed(0)} min`);
  tjek('datoerne går fra 1800 til 2100', new Date(FØRSTE).getUTCFullYear() === 1800 && new Date(SIDSTE).getUTCFullYear() === 2100);
}

// ---------- I browseren ----------
if (!process.argv.includes('--uden-browser')) {
  const browser = await chromium.launch({ args: ARGS });
  const side = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const konsol = [];
  side.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });
  side.on('pageerror', (e) => konsol.push(e.message));
  await side.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await side.goto(`${ADRESSE}?test#solsystem`);
  await side.waitForFunction(() => window.atomlabTest?.solsystem?.valgt?.() === 'overblik', null, { timeout: 30000 });
  const sol = () => side.evaluate(() => window.atomlabTest.solsystem);
  const f = (kode, arg) => side.evaluate(([k, a]) => new Function('t', 'a', `return (${k})(t, a)`)(window.atomlabTest.solsystem.fænomen(), a), [kode.toString(), arg]);
  void sol;
  tjek('Solsystemet åbner på overblikket, og "Solsystemet" er den første klode', await side.evaluate(() => document.querySelector('#solsystemListe .sol-klode')?.dataset.id === 'overblik'));
  tjek('alle otte planeter og Solen er tegnet, og Pluto er med', await f((t) => t.kugler().length === 10 && t.kugler().includes('pluto')));
  await f((t) => t.sætDato(Date.UTC(2026, 10, 14, 12)));
  tjek('datolinjen viser datoen', (await f((t) => t.datoTekst())).includes('14. november 2026'));
  // Skalaen
  const før = await f((t) => t.radius('jorden'));
  await f((t) => t.sætSkala(1));
  const efter = await f((t) => t.radius('jorden'));
  tjek('"Rigtig størrelse og afstand" gør Jorden mange tusind gange mindre', før / efter > 1000, `${før} → ${efter}`);
  tjek('i den rigtige skala er afstandene lineære (Neptun 30 gange så langt ude som Jorden)', Math.abs((await f((t) => t.afstand('neptun') / t.afstand('jorden'))) - 29.8 / 0.99) < 1.5);
  await f((t) => t.sætSkala(0));
  tjek('"Pustet op" bruger kvadratroden (Neptun ca. 5,5 gange så langt ude som Jorden)', Math.abs((await f((t) => t.afstand('neptun') / t.afstand('jorden'))) - Math.sqrt(29.8 / 0.99)) < 0.2);
  tjek('samme forstørrelse for planeterne: Jupiter ca. 11 gange så bred som Jorden, og Solen er større end Jupiter', await f((t) => Math.abs(t.radius('jupiter') / t.radius('jorden') - 10.97) < 0.3 && t.radius('solen') > t.radius('jupiter')));
  // Spole-skyderen
  const d0 = await f((t) => t.dato());
  await f((t) => t.spol(1));
  const d1 = await f((t) => t.dato());
  tjek('et fuldt træk i spole-skyderen er ét år', Math.abs((d1 - d0) / 864e5 - 365.25) < 2, `${(d1 - d0) / 864e5} døgn`);
  await f((t) => t.tempo(3));
  await side.evaluate(() => window.atomlabTest.solsystem.spol(1));
  const d2 = await f((t) => t.dato());
  tjek('⏩ tre gange: ti år i sekundet', Math.abs((d2 - d1) / (365.25 * 864e5) - 10) < 1, `${(d2 - d1) / (365.25 * 864e5)} år`);
  await f((t) => t.tempo(0));
  await f((t) => t.sætDato(Date.UTC(2300, 0, 1)));
  tjek('datoen stopper ved 2100', new Date(await f((t) => t.dato())).getUTCFullYear() === 2100);
  await f((t) => t.iDag());
  tjek('"I dag" sætter datoen tilbage', Math.abs((await f((t) => t.dato())) - Date.now()) < 864e5);
  // Pauseknappen stopper tiden
  await side.evaluate(() => window.atomlabTest.solsystem.sætTid('pause'));
  await f((t) => t.tempo(2));
  const p0 = await f((t) => t.dato());
  await side.evaluate(() => window.atomlabTest.solsystem.spol(1));
  tjek('i pause står datoen stille, også med ⏩', (await f((t) => t.dato())) === p0);
  await f((t) => t.tempo(0));
  await side.evaluate(() => window.atomlabTest.solsystem.sætTid('spil'));
  // Planeterne kredser mod uret set fra nord
  tjek('planeterne kredser mod uret set fra ekliptikkens nordpol', await f((t) => t.modUret()));
  // Tryk: den nærmeste midte inden for 44 px
  tjek('et tryk lige ved Jupiter vælger Jupiter, og et tryk langt fra alt vælger intet', await f((t) => t.trykNær('jupiter', 10) === 'jupiter' && t.trykNær('jupiter', 200) === null));
  // Pluto er et sted med et panel (Merkur har sit eget besøg fra MP2)
  await side.evaluate(() => window.atomlabTest.solsystem.gåTil('pluto'));
  const sideP = await side.evaluate(() => window.atomlabTest.solsystem.side());
  tjek('Pluto: kameraet flyver ind, og panelet har to tal og en tekst om New Horizons', sideP.nøgle === 'overblik:pluto' && sideP.tal.length === 2 && /New Horizons/.test(sideP.tekst), JSON.stringify(sideP.tal));
  await side.evaluate(() => window.atomlabTest.solsystem.gåTil('overblik'));
  await side.screenshot({ path: `${UD}/overblik-pc.png` });
  // Merkur har sin egen visning: Et besøg flyver ind og skifter visning, og tidsskyderen forsvinder (fejl 17. november 2026,
  // klodegitteret går i testbrowseren gennem rejseskiltet, så det rigtige besøg testes her)
  await f((t) => t.besøg('merkur', true));
  await side.waitForFunction(() => window.atomlabTest.solsystem.valgt() === 'merkur', null, { timeout: 20000 });
  tjek('Merkur fra overblikket: Merkurs egen visning, uden overblikkets tidsskyder', await side.evaluate(() => !document.querySelector('#solsystem .ob-tid')));
  await side.evaluate(() => document.querySelector('#solsystem .sol-klode[data-id="overblik"]').click());
  await side.waitForFunction(() => window.atomlabTest.solsystem.valgt() === 'overblik', null, { timeout: 20000 });
  await side.waitForFunction(() => !window.atomlabTest.solsystem.fænomen().flyver(), null, { timeout: 20000, polling: 200 });
  // Ind til Jorden med datoen
  await f((t) => t.sætDato(Date.UTC(2030, 5, 21, 12)));
  await f((t) => t.sætSkala(1)); // (i den rigtige skala, som efter "Rejs med lyset")
  await f((t) => t.besøg('jorden', true));
  await side.waitForFunction(() => window.atomlabTest.solsystem.valgt() === 'jorden', null, { timeout: 20000 });
  const tidJ = await side.evaluate(() => window.atomlabTest.solsystem.fænomen().tid());
  tjek('Jorden får overblikkets dato (21. juni 2030)', Math.abs(tidJ - Date.UTC(2030, 5, 21, 12)) < 3 * 864e5, new Date(tidJ).toISOString());
  tjek('titlen "Solsystemet" i toplinjen er en knap tilbage, og vejen viser Jorden', await side.evaluate(() => document.querySelector('#solsystem .topbjælke h2 button.sol-hjem')?.textContent === 'Solsystemet' && document.getElementById('solsystemVej').textContent.includes('Jorden')));
  await side.evaluate(() => document.querySelector('#solsystem .topbjælke h2 button.sol-hjem').click());
  await side.waitForFunction(() => window.atomlabTest.solsystem.valgt() === 'overblik', null, { timeout: 20000 });
  tjek('tilbage i overblikket står datoen, som man forlod den', new Date(await f((t) => t.dato())).getUTCFullYear() === 2030);
  // Kameraet flyver ud fra Jorden til hjemblikket i "Pustet op", ikke tilbage til Jorden (feedback 16. november 2026)
  await side.waitForFunction(() => !window.atomlabTest.solsystem.fænomen().flyver(), null, { timeout: 20000, polling: 200 });
  const hjem = await f((t) => ({ ...t.kameraMål(), skala: t.skala() }));
  tjek('tilbage fra Jorden: hjemblikket i "Pustet op" (Solen i midten)', hjem.skala === 0 && hjem.mål < 1e-3 && Math.abs(hjem.afstand - hjem.hjem) < 0.05 * hjem.hjem, JSON.stringify(hjem));
  // Telefon
  await side.setViewportSize({ width: 390, height: 844 });
  await side.waitForTimeout(500);
  await side.screenshot({ path: `${UD}/overblik-telefon.png` });
  tjek('ingen fejl i konsollen', konsol.length === 0, konsol.join(' | '));
  await browser.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
