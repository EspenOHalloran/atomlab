// Solsystemets overblik, forløbet "Rundt om Solen" (docs/drejebog-overblik.md, afsnit 2) og "Rejs med lyset" (afsnit 3):
// teksternes grænser og ord, fodboldens tal, tallene for afstanden og lysets tid, starter første gang med panelerne skjult,
// trin 1 (de fire inderste store med en ring og de ydre dæmpet, et forkert tryk giver en linje, og Jorden blinker), trin 2 (Merkur over fire omgange), trin 3 (skalaen glider),
// trin 4 (kun Jordens ring, et tryk ved siden af giver en linje, dykket med tælleren ned til Jorden fra den belyste side),
// "Det så du" med ✓ i "Din fremgang" og skalaen tilbage, vejen "Besøg en planet" (Merkur mat, Pluto skjult), "Rejs med
// lyset" (tiderne ved planeterne passer med lysTid, uret siger "spolet frem") og konsollen uden fejl.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { OVERBLIK } from '../js/data/forloeb/overblik.js';
import { ORDBOG } from '../js/data/ordbog.js';
import { AU, SOLEN, PLANETER, lysTid, lysTekst, lysRejseTid, kmTekst } from '../js/data/planeter.js';
const UD = billedmappe('overblik-forloeb');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Teksterne og tallene (uden browser) ----------
{
  const ord = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;
  const ordbog = new Set(ORDBOG.map((o) => o.id));
  tjek('teksterne: 4 trin, Spørg ≤ 18 ord, Så ≤ 22 ord, højst to fagord pr. trin, og de står i Ordbogen',
    OVERBLIK.trin.length === 4 && OVERBLIK.trin.every((t) => ord(t.spørg) <= 18 && ord(t.så) <= 22 && t.ord.length <= 2 && t.ord.every((id) => ordbog.has(id))));
  // Fodbolden (22 cm) er Solen: Jorden 2,0 mm og 23,7 m væk (drejebogens afsnit 4)
  const jordenMm = (220 * PLANETER.find((p) => p.id === 'jorden').radius) / SOLEN.radius;
  const meter = (0.22 * AU) / (2 * SOLEN.radius);
  tjek('fodbolden: Jorden er et knappenålshoved (ca. 2 mm) 24 meter væk', Math.abs(jordenMm - 2.0) < 0.1 && Math.round(meter) === 24 && /knappenålshoved, 24 meter/.test(OVERBLIK.trin[2].så), `${jordenMm.toFixed(2)} mm, ${meter.toFixed(1)} m`);
  tjek('trin 1 og 4 siger, hvad man skal trykke på (de har ingen knapper, og klodsen viser ikke gør)', /Tryk på den\.$/.test(OVERBLIK.trin[0].spørg) && /tryk på ringen\.$/.test(OVERBLIK.trin[3].spørg));
  tjek('afstanden som tekst', kmTekst(1.14e10) === '11,4 milliarder km' && kmTekst(1.84e8) === '184 millioner km' && kmTekst(2.29e4) === '22.900 km' && kmTekst(3.2e6) === '3,2 millioner km');
  tjek('lysets tid som tekst, og rejsen når Jorden efter 8 s og Neptun efter 30 s', lysTekst(45.7) === '45 s' && lysTekst(494) === '8 min 14 s' && lysTekst(14880) === '4 t 8 min'
    && Math.abs(lysRejseTid(8) - 494) < 1 && Math.abs(lysRejseTid(30) - 14900) < 5);
}

// ---------- I browseren ----------
if (!process.argv.includes('--uden-browser')) {
  const browser = await chromium.launch({ args: ARGS });
  const side = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const konsol = [];
  side.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });
  side.on('pageerror', (e) => konsol.push(e.message));
  await side.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await side.goto(`${ADRESSE}?test&forloebstart#solsystem`);
  await side.waitForFunction(() => window.atomlabTest?.solsystem?.fænomen?.()?.forløb?.()?.kører?.() === 'overblik', null, { timeout: 30000 });
  // f(fl, t, l, a): forløbets, overblikkets og rejsens testadgang
  const f = (kode, a) => side.evaluate(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('fl', 't', 'l', 'a', `return (${k})(fl, t, l, a)`)(t.forløb(), t, t.lys(), a); }, [kode.toString(), a]);
  const vent = (kode, a, ms = 30000) => side.waitForFunction(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('fl', 't', 'l', 'a', `return (${k})(fl, t, l, a)`)(t.forløb(), t, t.lys(), a); }, [kode.toString(), a], { timeout: ms, polling: 100 });
  const klik = (sel) => side.click(`#solsystem .forløb-linje ${sel}`);

  tjek('forløbet starter første gang, panelerne er skjult, og trin 1 er "Find Jorden"', await side.evaluate(() => document.getElementById('solsystem').classList.contains('i-forløb')) && (await f((fl) => fl.trin())) === 'jorden');
  // Trin 1
  const inderst = await f((fl, t) => ['merkur', 'venus', 'jorden', 'mars', 'jupiter', 'saturn'].map((id) => ({ id, ...t.kugleInfo(id) })));
  const navne1 = (await f((fl, t) => t.navne())).join();
  tjek('trin 1: de fire inderste er mindst 14 px brede med en ring, og de ydre er dæmpet', (await f((fl) => fl.inderst()))
    && inderst.slice(0, 4).every((k) => k.px >= 6.9 && k.lys === 1) && inderst.slice(4).every((k) => k.lys < 1) && navne1 === 'merkur,venus,jorden,mars',
    `${inderst.map((k) => `${k.id} ${k.px.toFixed(1)} px, lys ${k.lys}`).join('; ')} · ringe: ${navne1}`);
  await f((fl) => fl.tryk('venus'));
  tjek('trin 1: et tryk på Venus giver en linje, og Jordens ring blinker', /Det er Venus/.test(await side.textContent('#solsystem .fl-vink')) && (await f((fl) => fl.fremhævet())) === 'jorden');
  await f((fl) => fl.tryk('jorden'));
  await vent((fl) => fl.fase() === 'så');
  tjek('trin 1: når Jorden er fundet, er alle planeterne som før', !(await f((fl) => fl.inderst())) && (await f((fl, t) => t.kugleInfo('saturn').lys)) === 1);
  await klik('.fl-næste');
  // Trin 2
  await klik('.fl-gæt');
  await f((fl) => fl.visMigNu());
  await klik('.fl-vismig');
  await vent((fl) => fl.fase() === 'så');
  tjek('trin 2: et år frem, Merkur over fire omgange og Jorden én, og alle otte har en hale', (await f((fl) => fl.omgange('merkur'))) === 4 && (await f((fl) => fl.omgange('jorden'))) === 1 && (await f((fl) => fl.haler())) === 8);
  await klik('.fl-næste');
  // Trin 3
  await klik('.fl-gæt');
  await klik('.fl-handling');
  const tMidt = await f((fl, t) => t.skala());
  await vent((fl) => fl.fase() === 'så');
  tjek('trin 3: "Rigtig størrelse og afstand" glider (ikke et spring) og ender i den rigtige skala', tMidt < 0.9 && (await f((fl, t) => t.skala())) === 1, String(tMidt));
  await klik('.fl-næste');
  // Trin 4
  await vent((fl, t) => !t.flyver());
  const j = await f((fl, t) => t.kugleInfo('jorden'));
  tjek('trin 4: den rigtige skala, og kun Jordens ring vises', (await f((fl, t) => t.skala())) === 1 && (await f((fl) => fl.ringKun())) === 'jorden' && (await f((fl, t) => t.navne())).join() === 'jorden');
  await f((fl, t, l, a) => fl.tryk(null, a.x + 150, a.y + 120), j);
  tjek('trin 4: et tryk langt fra Jorden giver en linje', /lille ring/.test(await side.textContent('#solsystem .fl-vink')));
  await f((fl, t, l, a) => fl.tryk('solen', a.x + 10, a.y), j); // Solen er nærmest, men trykket er tæt på Jorden
  await vent((fl) => /km/.test(fl.afstand() ?? ''));
  const start = await f((fl) => fl.afstand());
  await side.screenshot({ path: `${UD}/dyk-start.png` });
  await f((fl, t) => t.hop());
  await vent((fl) => fl.dyk() === 'nede');
  const nede = await f((fl, t) => ({ ...t.kugleInfo('jorden'), afstand: fl.afstand() }));
  tjek('trin 4: dykket starter langt ude med tælleren og ender ved Jorden fra den belyste side', /milliarder km/.test(start) && /^Til Jorden: [\d.]+ km$/.test(nede.afstand) && nede.dagside > 0.3 && nede.harKort === 1, `${start} → ${nede.afstand}, dagside ${nede.dagside}`);
  await vent((fl) => fl.fase() === 'så');
  await side.screenshot({ path: `${UD}/dyk-nede.png` });
  await klik('.fl-næste');
  await vent((fl) => fl.fase() === 'slut');
  await f((fl, t) => t.hop());
  await vent((fl, t) => t.skala() === 0);
  const fremgang = await side.evaluate(() => JSON.parse(localStorage.getItem('atomlabFremgang') ?? '{}'));
  tjek('"Det så du": kernesætningen og tre veje, ✓ i "Din fremgang", og skalaen er tilbage i "Pustet op"', (await side.textContent('#solsystem .forløb-linje .fl-tekst')) === OVERBLIK.kernesætning
    && (await side.$$('#solsystem .forløb-linje .fl-vej')).length === 3 && Boolean(fremgang.forløb?.overblik?.taget));
  // Vejen "Besøg en planet"
  await klik('.fl-vej.primær');
  await vent((fl, t) => t.flyver()); // (kameraet flyver hjem, når panelerne er tilbage)
  await vent((fl, t) => !t.flyver());
  const m = await f((fl, t) => (fl.kører(), t.kugleInfo('merkur')));
  await side.mouse.click(m.x, m.y);
  await side.waitForTimeout(300);
  tjek('"Besøg en planet": panelerne er tilbage, navnene tændt, Pluto skjult, og Merkur siger "senere" uden at flyve', !(await side.evaluate(() => document.getElementById('solsystem').classList.contains('i-forløb')))
    && (await f((fl) => fl.besøg())) === OVERBLIK.merkurSenere && !(await f((fl, t) => t.flyver())) && !(await f((fl, t) => t.navne())).includes('pluto') && (await f((fl, t) => t.navne())).includes('jupiter'));
  await side.screenshot({ path: `${UD}/besoeg.png` });
  // Rejs med lyset (handlingen i bjælken)
  await side.click('#solsystem .bjælke-handling:has-text("Rejs med lyset")');
  await vent((fl, t, l) => l.fase() === 'lys');
  await f((fl, t, l) => l.spol(8.3)); // (Mars efter ca. 10 s)
  const dato = new Date(await f((fl, t) => t.dato()));
  const tider = await f((fl, t, l) => l.tider());
  tjek('"Rejs med lyset": efter godt 8 s har lyset nået Jorden, og Jordens tid passer med afstanden i dag', Object.keys(tider).join() === 'merkur,venus,jorden'
    && tider.jorden === `Jorden: ${lysTekst(lysTid('jorden', dato))}` && /spolet frem/.test(await f((fl, t, l) => l.ur())), JSON.stringify(tider));
  await f((fl, t, l) => l.spol(27));
  tjek('"Rejs med lyset": til sidst siger uret, hvornår lyset nåede den yderste, og Neptun har sin tid', /^Lyset nåede Pluto efter \d+ t \d+ min · spolet frem$/.test(await f((fl, t, l) => l.ur())) && (await f((fl, t, l) => l.tider().neptun)) === `Neptun: ${lysTekst(lysTid('neptun', dato))}`);
  await side.screenshot({ path: `${UD}/lyset.png` });
  const bjælke = () => side.evaluate(() => window.atomlabTest.solsystem.bjælke().map((b) => b.tekst));
  tjek('"Rejs med lyset": knappen hedder "✕ Stop lyset", mens rejsen kører', (await bjælke()).includes('✕ Stop lyset'));
  await f((fl, t, l) => l.spol(11));
  tjek('"Rejs med lyset" rydder op bagefter', (await f((fl, t, l) => l.fase())) === null && (await side.$$('#solsystem .ob-lystid')).length === 0);
  // Bagefter flyver kameraet selv hjem, og skalaen går til "Pustet op" (feedback 16. november 2026)
  await vent((fl, t) => !t.flyver() && t.skala() === 0);
  const hjem1 = await f((fl, t) => t.kameraMål());
  tjek('"Rejs med lyset": bagefter er kameraet hjemme i "Pustet op", og knappen hedder "Rejs med lyset" igen', hjem1.mål < 1e-3 && Math.abs(hjem1.afstand - hjem1.hjem) < 0.05 * hjem1.hjem
    && (await bjælke()).includes('💡 Rejs med lyset'), JSON.stringify(hjem1));
  // Esc (og "✕ Stop lyset") stopper rejsen undervejs og flyver hjem
  await side.click('#solsystem .bjælke-handling:has-text("Rejs med lyset")');
  await vent((fl, t, l) => l.fase() === 'lys');
  await f((fl, t, l) => l.spol(5));
  await side.keyboard.press('Escape');
  await vent((fl, t) => !t.flyver() && t.skala() === 0);
  const hjem2 = await f((fl, t) => t.kameraMål());
  tjek('"Rejs med lyset": Esc stopper rejsen, og kameraet flyver hjem til "Pustet op"', (await f((fl, t, l) => l.fase())) === null && hjem2.mål < 1e-3 && Math.abs(hjem2.afstand - hjem2.hjem) < 0.05 * hjem2.hjem, JSON.stringify(hjem2));
  await side.click('#solsystem .bjælke-handling:has-text("Rejs med lyset")');
  await vent((fl, t, l) => l.fase() === 'lys');
  await side.click('#solsystem .bjælke-handling:has-text("Stop lyset")');
  await vent((fl, t) => !t.flyver() && t.skala() === 0);
  tjek('"Rejs med lyset": "✕ Stop lyset" stopper rejsen og flyver hjem', (await f((fl, t, l) => l.fase())) === null && (await f((fl, t) => t.kameraMål())).mål < 1e-3);
  tjek('ingen fejl i konsollen', konsol.length === 0, konsol.join(' | '));
  await browser.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
