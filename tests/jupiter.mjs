// Jupiter (J1 og J2 i docs/plan-jupiter.md): kloden står i Solsystemet mellem Mars og Saturn, kortet hentes og ligger
// rigtigt (pletten syd for ækvator, ingen søm, ingen sorte poler), Jupiter er fladtrykt, drejer mod uret set fra nord og
// står stille i pause. J2: vindene (målt i Hubbles to omgange, testes først uden browser), at skyerne glider den rigtige
// vej og står stille i pause, ⏩, kontakten "Vindene" og pletten (kameraet følger pletten, døgnet står stille, pletten
// drejer mod uret). J3: månerne (omløbstiderne og resonansen, mod uret, stille i pause, rigtig størrelse tæt på, tryk og
// besøg, kortene og skyggerne). J4: flybyen, siderne og citatet. J5: cyklonerne ved polerne, nordlyset (kun med
// kontakten "Ultraviolet", målt i billedet), ringene (næsten usynlige forfra og synlige i Jupiters skygge, målt i
// billedet) og stoppene ved sydpolen og i skyggen. Ingen fejl i konsollen.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { VIND, TRIN, PLET, vindVed } from '../js/data/vinde-jupiter.js';
import { POLER, cykloner as cyklonListe, omløb } from '../js/data/poler-jupiter.js';
import { RINGE, tauVed } from '../js/data/ringe-jupiter.js';
const UD = billedmappe('jupiter');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Vindene uden browser (js/data/vinde-jupiter.js) ----------
{
  tjek('vindene: fra 90° S til 90° N i trin på 0,25°', VIND.length === 721 && TRIN === 0.25, VIND.length);
  let maks = { v: -1e9 }, min = { v: 1e9 };
  for (let b = -70; b <= 70; b += 0.05) {
    const v = vindVed(b);
    if (v > maks.v) maks = { v, b };
    if (v < min.v) min = { v, b };
  }
  // Simon m.fl. 2015 (Hubble): 153 m/s ved 24° N. Cassini (2000): 138, Voyager (1979): 184 (fakta-solsystemet.md, del 5)
  tjek('vindene: den stærkeste jetstrøm blæser mod øst ved 23-25° N med 140-160 m/s', maks.b > 23 && maks.b < 25 && maks.v > 140 && maks.v < 160, JSON.stringify(maks));
  tjek('vindene: ved ækvator mod øst (50-100 m/s), og ved 7° N og 7° S over 100 m/s', vindVed(0) > 50 && vindVed(0) < 100 && vindVed(7) > 100 && vindVed(-7) > 100, [vindVed(0), vindVed(7), vindVed(-7)].join());
  tjek('vindene: den stærkeste vind mod vest er ved 18-21° S (nord for pletten), 40-80 m/s', min.b > -21 && min.b < -18 && min.v < -40 && min.v > -80, JSON.stringify(min));
  tjek('vindene: skiftevis mod øst og vest (mindst 10 skift mellem 60° S og 60° N)', (() => { let n = 0; for (let b = -60; b < 60; b += 0.25) if (Math.sign(vindVed(b)) !== Math.sign(vindVed(b + 0.25))) n++; return n >= 10; })());
  // Ved grænsen til det, der ikke er målt, toner vinden ned (ellers en søm, hvor skyerne glider). Jetstrømmens flanker
  // ved 24° N er stejle i virkeligheden (ca. 15 m/s pr. 0,25°), så kun grænsen tjekkes.
  const nærPol = VIND.map((v, i) => (i && Math.abs(-90 + i * TRIN) >= 55 ? Math.abs(v - VIND[i - 1]) : 0));
  tjek('vindene: 0 nær polerne (ikke målt), uden spring ved grænsen', vindVed(75) === 0 && vindVed(-75) === 0 && Math.max(...nærPol) < 4, Math.max(...nærPol));
  tjek('pletten i Hubbles kort: ved 21-25° S, bredere end høj, 10.000-16.000 km lang', PLET.bredde < -21 && PLET.bredde > -25 && PLET.halvLængde > PLET.halvBredde && PLET.halvLængde * 2 * 1162 > 10000 && PLET.halvLængde * 2 * 1162 < 16000, JSON.stringify(PLET));
}

// ---------- Polerne og ringene uden browser (J5) ----------
{
  const n = cyklonListe('nord'), sy = cyklonListe('syd');
  tjek('cyklonerne: 8 om 1 ved nordpolen og 5 om 1 ved sydpolen (Juno)', n.length === 9 && sy.length === 6 && n[0].bredde === 90 && sy[0].bredde === -90, JSON.stringify([n.length, sy.length]));
  tjek('cyklonerne: ringene ved ca. 84° N og S, lige langt imellem', n.slice(1).every((c) => c.bredde === 84) && sy.slice(1).every((c) => c.bredde === -84) && Math.abs(((n[2].længde - n[1].længde + 360) % 360) - 45) < 1e-9 && Math.abs(((sy[2].længde - sy[1].længde + 360) % 360) - 72) < 1e-9);
  tjek('cyklonerne: 4.000-7.000 km brede, størst ved sydpolen', [...n, ...sy].every((c) => c.bred >= 4000 && c.bred <= 7000) && sy[1].bred > n[1].bred);
  // Ringen af cykloner: Afstanden mellem to naboer (langs ringen ved 84°, ca. 1.250 km pr. grad nær polen) skal være
  // større end deres bredde, så de ikke overlapper
  const iRing = (p) => (2 * Math.PI * 6 * 1250) / p.antal;
  tjek('cyklonerne: naboerne i ringen overlapper ikke', iRing(POLER.nord) > POLER.nord.bred && iRing(POLER.syd) > POLER.syd.bred, [iRing(POLER.nord), iRing(POLER.syd)].join());
  tjek('cyklonerne: én omgang på ca. 15-30 timer (vinden ca. 80-85 m/s)', [POLER.nord, POLER.syd].every((p) => omløb(p) / 3600 > 15 && omløb(p) / 3600 < 30), [omløb(POLER.nord) / 3600, omløb(POLER.syd) / 3600].join());
  tjek('ringene (NSSDC): glorien, hovedringen, Amalthea- og Thebe-ringen', RINGE.map((r) => r.navn).join() === 'Glorien,Hovedringen,Amalthea-ringen,Thebe-ringen');
  tjek('ringene: τ ca. 5 · 10⁻⁶ i hovedringen, ca. 10⁻⁷ i de to yderste, og intet inden for glorien og uden for 280.000 km', Math.abs(tauVed(126000) - 5e-6) < 1e-7 && Math.abs(tauVed(150000) - 1e-7) < 1e-9 && Math.abs(tauVed(200000) - 1e-7) < 1e-9 && tauVed(89000) === 0 && tauVed(281000) === 0, [tauVed(126000), tauVed(150000), tauVed(200000)].join());
  tjek('ringene: hovedringen har en skarp ydre kant ved Adrastea (128.940 km)', tauVed(128500) > 4e-6 && tauVed(129300) < 2e-7, [tauVed(128500), tauVed(129300)].join());
}

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
const fm = (f, a) => s.evaluate(f, a);

// ---------- Listen ----------
const ids = await fm(() => atomlabTest.solsystem.fænomener);
tjek('Jupiter står i listen mellem Mars og Saturn', ids.indexOf('jupiter') === ids.indexOf('mars') + 1 && ids.indexOf('saturn') === ids.indexOf('jupiter') + 1, JSON.stringify(ids));
const kloder = await fm(() => [...document.querySelectorAll('#solsystem .sol-klode')].map((k) => { const r = k.getBoundingClientRect(); return { id: k.dataset.id ?? k.textContent.trim(), y: Math.round(r.top), synlig: r.width > 0 }; }));
tjek('kloderne står på én række: Sol, Jord, Mars, Jupiter og Saturn', kloder.length === 5 && new Set(kloder.map((k) => k.y)).size === 1 && kloder[3].id === 'jupiter' && kloder.every((k) => k.synlig), JSON.stringify(kloder));
await s.click('#solsystem .sol-klode[data-id="jupiter"]');
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'jupiter' && atomlabTest.solsystem.fænomen()?.hentet(), null, { timeout: 30000, polling: 200 }).catch(() => {});
tjek('Jupiter åbner, og kortet er hentet (1k i tests, i farver)', (await fm(() => atomlabTest.solsystem.fænomen().hentet())) && (await fm(() => atomlabTest.solsystem.fænomen().billeder()))['jupiter-1k.jpg'] === 'farver', JSON.stringify(await fm(() => atomlabTest.solsystem.fænomen().billeder())));
tjek('sort himmel (ingen tågeskyer)', !(await fm(() => atomlabTest.solsystem.tåger())));
const træ = await fm(() => atomlabTest.solsystem.træ());
tjek('træet: "▶ Flyby · 5 stop" øverst, så Jupiter, stederne (pletten, polerne og ringene), Månerne og de fire store måner', træ.map((p) => p.id).join() === 'tur,jupiter,plet,sydpol,nordpol,ringe,maaner,io,europa,ganymedes,callisto' && træ[0].navn.includes('Flyby · 5 stop') && træ[1].valgt, JSON.stringify(træ));
// "Start flyby" er grå, indtil månernes kort er hentet og lagt i grafikkortet (som ved Saturn)
const flybyKlar = await s.waitForFunction(() => atomlabTest.solsystem.knapper()[0] === '▶ Start flyby', null, { timeout: 30000, polling: 200 }).then(() => true, () => false);
tjek('"Start flyby" bliver aktiv, når månernes kort er hentet, og Styr-boksen har kontakterne Vindene, Modlys, Ultraviolet og Navne', flybyKlar && JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())) === JSON.stringify(['▶ Start flyby', 'Vindene', 'Modlys', 'Ultraviolet', 'Navne']), JSON.stringify(await fm(() => atomlabTest.solsystem.knapper())));
const citat = await fm(() => { const c = document.getElementById('solsystemCitat'); return { vist: c && !c.hidden, tekst: c?.textContent ?? '', latin: c?.querySelector('.citat-tekst')?.title ?? '' }; });
tjek('Jupiter viser citatet af Galilei med den latinske ordlyd fra 1610', citat.vist && citat.tekst.includes('Galileo Galilei') && citat.latin.startsWith('Die itaque septima'), JSON.stringify(citat));
const side = await fm(() => atomlabTest.solsystem.side());
tjek('siden: fladtrykt, båndene, det indre, "mislykket stjerne", kometerne, polerne, nordlyset, Billederne og "Ærligt talt" sidst', ['Hvorfor er Jupiter fladtrykt?', 'Hvorfor har Jupiter bånd?', 'Hvad er inden i?', 'Er Jupiter en mislykket stjerne?', 'Beskytter Jupiter Jorden?', 'Hvad er der ved polerne?', 'Har Jupiter nordlys?'].every((t) => side.bokse.includes(t)) && /fladtrykt/.test(side.tekst) && side.bokse.includes('Billederne') && side.sidst === 'Ærligt talt', JSON.stringify(side.bokse));

// ---------- Formen og drejningen ----------
const form = await fm(() => atomlabTest.solsystem.fænomen().form());
tjek('Jupiter er fladtrykt 6,5 % (66.854 / 71.492 km), og aksen hælder 3,13°', Math.abs(form.flad - 66854 / 71492) < 1e-6 && Math.abs(form.hældning * 180 / Math.PI - 3.13) < 1e-6, JSON.stringify(form));
tjek('tidsknappen: ▶ fra start', (await fm(() => atomlabTest.solsystem.tidsknap())) === 'spil');
// Et punkt på ækvator set fra nord (x mod højre, −z opad i billedet): vinklen atan2(−z, x) vokser, når Jupiter drejer mod uret
const vinkel = () => fm(() => { const p = atomlabTest.solsystem.fænomen().punkt(0); return { v: Math.atan2(-p[2], p[0]), d: atomlabTest.solsystem.fænomen().drejning() }; });
const v0 = await vinkel();
await s.waitForFunction((d0) => atomlabTest.solsystem.fænomen().drejning() > d0 + 0.05, v0.d, { timeout: 15000, polling: 100 }).catch(() => {});
const v1 = await vinkel();
const dv = Math.atan2(Math.sin(v1.v - v0.v), Math.cos(v1.v - v0.v));
tjek('Jupiter drejer mod uret set fra nord (mod øst)', v1.d > v0.d && dv > 0.04, JSON.stringify({ v0, v1, dv }));
await s.click('#solsystemTid button[data-tid="pause"]');
const p0 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForTimeout(1200);
const p1 = await fm(() => atomlabTest.solsystem.fænomen().drejning());
tjek('Jupiter står stille i pause', p0 === p1, JSON.stringify([p0, p1]));
await s.click('#solsystemTid button[data-tid="spil"]');

// ---------- Vindene i shaderen (J2) ----------
const J = (f, a) => fm(f, a);
const strøm = (b) => J((b) => atomlabTest.solsystem.fænomen().strøm(b), b);
const s24 = await strøm(24), s20 = await strøm(-20);
tjek('vindene i teksturen: ca. 149 m/s ved 24° N og mod vest ved 20° S (som dataene)', Math.abs(s24.ms - vindVed(24)) < 2 && Math.abs(s20.ms - vindVed(-20)) < 2 && s20.ms < -40, JSON.stringify([s24.ms, s20.ms]));
// Kortet forskydes mod øst ved 24° N og mod vest ved 20° S, mens tiden går (den fase, der ikke er startet forfra)
const flyt = async (b) => {
  const f0 = await strøm(b);
  const u0 = (await J(() => atomlabTest.solsystem.fænomen().ur())).vind;
  await s.waitForFunction((u0) => atomlabTest.solsystem.fænomen().ur().vind > u0 + 1.5, u0, { timeout: 15000, polling: 100 }).catch(() => {});
  const f1 = await strøm(b);
  const da = f1.a - f0.a, db = f1.b - f0.b;
  return Math.abs(da) < Math.abs(db) ? da : db;
};
const øst24 = await flyt(24), vest20 = await flyt(-20);
tjek('skyerne glider mod øst ved 24° N og mod vest ved 20° S', øst24 > 0.01 && vest20 < -0.005, JSON.stringify([øst24, vest20]));
await s.click('#solsystemTid button[data-tid="pause"]');
const pa = await strøm(24), pu = await J(() => atomlabTest.solsystem.fænomen().ur());
await s.waitForTimeout(1000);
const pb = await strøm(24), pv = await J(() => atomlabTest.solsystem.fænomen().ur());
tjek('vindene og pletten står stille i pause', pa.a === pb.a && pu.vind === pv.vind, JSON.stringify([pa, pb]));
// ⏩: tiden går HURTIG gange hurtigere (vindene og døgnet)
tjek('tidsknappen har ⏩ ved Jupiter', await J(() => !!document.querySelector('#solsystemTid button[data-tid="hurtig"]')?.offsetWidth));
await s.click('#solsystemTid button[data-tid="hurtig"]');
const h0 = await J(() => ({ ...atomlabTest.solsystem.fænomen().ur(), t: performance.now() }));
await s.waitForTimeout(1500);
const h1 = await J(() => ({ ...atomlabTest.solsystem.fænomen().ur(), t: performance.now() }));
const fart = (h1.vind - h0.vind) / ((h1.t - h0.t) / 1000);
tjek('⏩: vindenes ur går mindst 5 gange hurtigere end uret på væggen, og døgnet følger med', h1.hurtig && fart > 5 && Math.abs((h1.døgn - h0.døgn) / (h1.vind - h0.vind) - (2 * Math.PI) / 80) < 1e-6, JSON.stringify({ fart, h0, h1 }));
await s.click('#solsystemTid button[data-tid="spil"]');
// Kontakten "Vindene": pile over båndene, én række ved hver jetstrøm
await J(() => atomlabTest.solsystem.trykPå('Vindene'));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().pile().styrke === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
const pile = await J(() => atomlabTest.solsystem.fænomen().pile());
tjek('"Vindene": pilene toner frem, mindst 12 rækker, den længste ved 23-25° N mod øst', pile.styrke === 1 && pile.rækker.length >= 12 && pile.rækker[0].bredde > 23 && pile.rækker[0].bredde < 25 && pile.rækker[0].vind > 140 && pile.rækker.some((r) => r.vind < -40), JSON.stringify(pile));
await s.screenshot({ path: UD + '/2-vindene.png' });
await J(() => atomlabTest.solsystem.trykPå('Vindene'));
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().pile().styrke === 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
tjek('"Vindene" slået fra: pilene er væk', (await J(() => atomlabTest.solsystem.fænomen().pile().styrke)) === 0);

// ---------- Den Store Røde Plet (J2) ----------
await J(() => atomlabTest.solsystem.gåTil('plet'));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 10000, polling: 100 }).catch(() => {});
await s.waitForTimeout(300);
const q1 = await J(() => ({ ...atomlabTest.solsystem.fænomen().plet(), d: atomlabTest.solsystem.fænomen().drejning(), ur: atomlabTest.solsystem.fænomen().ur().vind }));
const fasePlet = await J(() => atomlabTest.solsystem.fase());
tjek('pletten: stedet er valgt, underteksten står (under 160 tegn), og stedet står lodret', q1.ved && (await J(() => atomlabTest.solsystem.sted())) === 'plet' && fasePlet?.titel === 'Den Store Røde Plet' && fasePlet.tekst.length < 160 && q1.lodret > 0.999, JSON.stringify({ q1, fasePlet }));
tjek('pletten: formiddag med Solen ca. 45° oppe i øst', Math.abs(q1.solHøjde - 45) < 2 && q1.øst, JSON.stringify(q1));
await s.waitForFunction((u0) => atomlabTest.solsystem.fænomen().ur().vind > u0 + 2, q1.ur, { timeout: 15000, polling: 100 }).catch(() => {});
const q2 = await J(() => ({ ...atomlabTest.solsystem.fænomen().plet(), d: atomlabTest.solsystem.fænomen().drejning(), ur: atomlabTest.solsystem.fænomen().ur().vind }));
// Pletten drejer mod uret (vinklen vokser) én gang på ca. 4,5 døgn: (2π / 870 s) pr. sekund i programmets ur
const dvPlet = (q2.vinkel - q1.vinkel) / (q2.ur - q1.ur);
tjek('pletten: Jupiters døgn står stille, men pletten drejer mod uret (én omgang på ca. 4½ døgn)', q2.d === q1.d && Math.abs(dvPlet / ((2 * Math.PI) / ((4.5 * 86400) / ((9.925 * 3600) / 80))) - 1) < 0.01 && Math.abs(q2.solHøjde - q1.solHøjde) < 0.01, JSON.stringify({ q1, q2, dvPlet }));
const sidePlet = await J(() => atomlabTest.solsystem.side());
tjek('pletten: egen side med tal og "Ærligt talt" sidst', sidePlet.nøgle === 'jupiter:plet' && sidePlet.sidst === 'Ærligt talt', JSON.stringify(sidePlet.nøgle));
await s.screenshot({ path: UD + '/3-pletten.png' });
await J(() => atomlabTest.solsystem.gåTil('jupiter'));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 10000, polling: 100 }).catch(() => {});
const d0 = await J(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForFunction((d0) => atomlabTest.solsystem.fænomen().drejning() > d0 + 0.02, d0, { timeout: 15000, polling: 100 }).catch(() => {});
tjek('tilbage til Jupiter: Jupiter drejer igen, og underteksten er væk', (await J(() => atomlabTest.solsystem.fænomen().drejning())) > d0 + 0.02 && !(await J(() => atomlabTest.solsystem.fase())) && !(await J(() => atomlabTest.solsystem.fænomen().plet().ved)));

// ---------- Månerne (J3) ----------
const Mf = () => J(() => atomlabTest.solsystem.fænomen().måner());
const SEK = (9.925 * 3600) / 80; // sekunder i virkeligheden pr. sekund i programmet
let mm = await Mf();
const ved = (id, l = mm) => l.find((m) => m.id === id);
tjek('månerne: Io, Europa, Ganymedes og Callisto', mm.map((m) => m.id).join() === 'io,europa,ganymedes,callisto', JSON.stringify(mm.map((m) => m.id)));
const P = Object.fromEntries(mm.map((m) => [m.id, m.døgn]));
tjek('månerne: omløbstiderne giver resonansen (Europa/Io 2,007, Ganymedes/Europa 2,015, Ganymedes/Io 4,04, NSSDC)', Math.abs(P.europa / P.io - 2.007) < 0.001 && Math.abs(P.ganymedes / P.europa - 2.015) < 0.001 && Math.abs(P.ganymedes / P.io - 4.044) < 0.001, JSON.stringify(P));
const laplace = (l) => ((((ved('io', l).vinkel - 3 * ved('europa', l).vinkel + 2 * ved('ganymedes', l).vinkel) % 360) + 360) % 360);
tjek('månerne: Laplace-relationen (Io − 3·Europa + 2·Ganymedes = 180°)', Math.abs(laplace(mm) - 180) < 0.5, laplace(mm));
// Mod uret set fra nord: vinklen vokser, og Io går ca. 4 gange så hurtigt som Ganymedes
await J(() => atomlabTest.solsystem.fænomen().sætMåneUr(0));
// Uret og pladserne læses i samme kald: Under belastning kan der ellers blive tegnet et billede imellem (fejlede én
// gang 7. november 2026, Io 2,5 % for hurtig)
const urOgMåner = () => J(() => ({ ur: atomlabTest.solsystem.fænomen().måneUr(), m: atomlabTest.solsystem.fænomen().måner() }));
const { ur: u0m, m: mA } = await urOgMåner();
await s.waitForFunction((u) => atomlabTest.solsystem.fænomen().måneUr() > u + 2, u0m, { timeout: 15000, polling: 100 }).catch(() => {});
const { ur: u1m, m: mB } = await urOgMåner();
const fartM = (id) => ((((ved(id, mB).vinkel - ved(id, mA).vinkel) % 360) + 540) % 360 - 180) / (u1m - u0m);
const forventet = (id) => (360 * SEK) / (P[id] * 86400);
tjek('månerne kredser mod uret set fra nord med den rigtige fart i forhold til Jupiters døgn', ['io', 'europa', 'ganymedes', 'callisto'].every((id) => fartM(id) > 0 && Math.abs(fartM(id) / forventet(id) - 1) < 0.02) && Math.abs(laplace(mB) - 180) < 0.5, JSON.stringify({ io: fartM('io'), forventet: forventet('io'), laplace: laplace(mB) }));
await s.click('#solsystemTid button[data-tid="pause"]');
const pm0 = await J(() => atomlabTest.solsystem.fænomen().måneUr());
await s.waitForTimeout(800);
tjek('månerne står stille i pause', pm0 === (await J(() => atomlabTest.solsystem.fænomen().måneUr())));
// Ved start står Io mellem Solen og Jupiter: dens skygge rammer skyerne, og den er sat i shaderen
await J(() => atomlabTest.solsystem.fænomen().sætMåneUr(0));
await s.waitForTimeout(200);
mm = await Mf();
tjek('Io\'s skygge rammer Jupiter ved start (og er sendt til shaderen), de andres ikke', ved('io').skyggePåJupiter && ved('io').skyggeSat && !ved('callisto').skyggePåJupiter, JSON.stringify(mm.map((m) => [m.id, m.skyggePåJupiter, m.skyggeSat])));
tjek('ved hele Jupiter: månerne tegnes større (mindst 0,25° i radius), så de kan ses', mm.every((m) => m.tegnet >= 0.25 && m.tegnet >= m.rigtig), JSON.stringify(mm.map((m) => [m.id, m.tegnet.toFixed(3), m.rigtig.toFixed(3)])));
await s.click('#solsystemTid button[data-tid="spil"]');
// Månerne og deres kort
await J(() => atomlabTest.solsystem.gåTil('maaner'));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => { const b = atomlabTest.solsystem.fænomen().billeder(); return ['io-2k.jpg', 'europa-2k.jpg', 'ganymedes-2k.jpg', 'callisto-2k.jpg', 'io-tone.jpg'].every((n) => b[n]); }, null, { timeout: 30000, polling: 200 }).catch(() => {});
const bm = await J(() => atomlabTest.solsystem.fænomen().billeder());
tjek('månernes kort er hentet (2k i tests, én kanal) og Io\'s tone', ['io', 'europa', 'ganymedes', 'callisto'].every((n) => bm[`${n}-2k.jpg`] === 'én kanal') && bm['io-tone.jpg'], JSON.stringify(bm));
tjek('oversigten: siden "Månerne" med tal', (await J(() => atomlabTest.solsystem.side())).nøgle === 'jupiter:maaner');
await s.waitForTimeout(400);
await s.screenshot({ path: UD + '/4-maanerne.png' });
// Tryk på Europa i oversigten
const ep = await J(() => atomlabTest.solsystem.fænomen().månePlads('Europa'));
await s.mouse.click(ep.x, ep.y);
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().visning() === 'europa', null, { timeout: 5000, polling: 100 }).catch(() => {});
tjek('tryk på Europa besøger den', (await J(() => atomlabTest.solsystem.fænomen().visning())) === 'europa', JSON.stringify(ep));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver && atomlabTest.solsystem.fænomen().nær() === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
const faseE = await J(() => atomlabTest.solsystem.fase());
const sideE = await J(() => atomlabTest.solsystem.side());
tjek('Europa: underteksten (under 160 tegn), egen side og stedet i træet', faseE?.titel === 'Europa' && faseE.tekst.length < 160 && sideE.nøgle === 'jupiter:europa' && sideE.sidst === 'Ærligt talt' && (await J(() => atomlabTest.solsystem.sted())) === 'europa', JSON.stringify({ faseE, n: sideE.nøgle }));
const ue0 = await J(() => atomlabTest.solsystem.fænomen().måneUr());
await s.waitForTimeout(700);
tjek('månerne står stille, mens man besøger en måne', ue0 === (await J(() => atomlabTest.solsystem.fænomen().måneUr())));
mm = await Mf();
// Ved en måne har de andre den rigtige størrelse (Io set fra Europa er op til 0,72° bred, fakta del 5, 7c)
const andre = mm.filter((m) => m.id !== 'europa');
tjek('ved Europa: de andre måner i den rigtige størrelse (højst 0,8 pixel større), og ingen navne', andre.every((m) => m.tegnet - m.rigtig < 0.02 && !m.navn) && ved('io').rigtig * 2 > 0.1 && ved('io').rigtig * 2 < 0.8, JSON.stringify(andre.map((m) => [m.id, m.tegnet.toFixed(4), m.rigtig.toFixed(4)])));
await s.screenshot({ path: UD + '/5-europa.png' });
// En måne i Jupiters skygge: Månernes ur spoles frem, så den er i sollys, når man kommer
const sol0 = ved('io', await (async () => { await J(() => atomlabTest.solsystem.fænomen().sætMåneUr(0)); return Mf(); })()).vinkel + 7;
await J(() => atomlabTest.solsystem.gåTil('maaner'));
await J(() => atomlabTest.solsystem.fænomen().hop());
await J((t) => atomlabTest.solsystem.fænomen().sætMåneUr(t), (176 / 360) * (P.io * 86400) / SEK);
await J(() => atomlabTest.solsystem.gåTil('io'));
mm = await Mf();
const fraSkygge = Math.abs((((ved('io').vinkel - sol0 - 180) % 360) + 540) % 360 - 180);
tjek('besøg ved Io, der står i Jupiters skygge: månerne spoles frem, så Io er i sollys', fraSkygge >= 13.9 && Math.abs(laplace(mm) - 180) < 0.5, JSON.stringify({ fraSkygge, l: laplace(mm) }));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 10000, polling: 100 }).catch(() => {});
await s.waitForTimeout(400);
await s.screenshot({ path: UD + '/6-io.png' });
await J(() => atomlabTest.solsystem.gåTil('jupiter'));
await J(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver && atomlabTest.solsystem.fænomen().nær() === 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
tjek('tilbage til Jupiter: månerne kredser igen, og underteksten er væk', !(await J(() => atomlabTest.solsystem.fase())) && (await J(() => atomlabTest.solsystem.fænomen().visning())) === 'jupiter');

// ---------- Flybyen (J4): oversigten, båndene og pletten ----------
{
  const stop = await J(() => atomlabTest.solsystem.fænomen().flybyStop());
  tjek('flybyen: 5 stop (oversigten, båndene, pletten, sydpolen og skyggen)', stop.map((t) => t.id).join() === 'maaner,jupiter,plet,sydpol,ringe', JSON.stringify(stop.map((t) => t.id)));
  tjek('flybyen: alle undertekster er under 160 tegn og slutter med et punktum', stop.every((t) => t.tekst.length < 160 && t.tekst.endsWith('.')), JSON.stringify(stop.map((t) => t.tekst.length)));
  await s.click('#solsystemTræ button[data-tur]');
  tjek('flybyen startes fra træet, og punktet lyser', (await J(() => atomlabTest.solsystem.træ()))[0].valgt && (await J(() => atomlabTest.solsystem.fænomen().tur().trin)) === 0);
  const set = [];
  for (let i = 0; i < 5; i++) {
    await J(() => atomlabTest.solsystem.fænomen().hop());
    await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 15000, polling: 100 }).catch(() => {});
    await s.waitForTimeout(400); // panelet opdateres fire gange i sekundet
    set.push(await J(() => ({
      fase: document.querySelector('#solsystemVindue .undertekst.fase')?.textContent ?? '', prikker: document.querySelectorAll('#solsystemVindue .undertekst.fase .ut-trin button').length,
      trin: atomlabTest.solsystem.fænomen().tur().trin, visning: atomlabTest.solsystem.fænomen().visning(), side: atomlabTest.solsystem.side().nøgle,
      lige: document.querySelector('#solsystemForklaring')?.textContent ?? '', knapper: [...document.querySelectorAll('#solsystemForklaring .side-knap')].map((k) => k.dataset.kontakt ?? k.dataset.tid),
      afstand: atomlabTest.solsystem.fænomen().tur().afstand,
    })));
    await s.screenshot({ path: `${UD}/7-flyby-${i + 1}.png` });
    if (i < 4) await s.click('#solsystemBjælke button:has-text("Næste")');
  }
  tjek('flybyen: stoppene i rækkefølge med 5 prikker, og panelet viser stedets side', set.every((x, i) => x.fase.includes(stop[i].titel) && x.prikker === 5 && x.visning === stop[i].id && x.side === (stop[i].id === 'jupiter' ? 'jupiter' : `jupiter:${stop[i].id}`)), JSON.stringify(set.map((x) => [x.fase.slice(0, 25), x.prikker, x.visning, x.side])));
  tjek('flybyen: oversigten langt ude, båndene ved hele Jupiter, pletten og sydpolen tæt på, skyggen længere ude', set[0].afstand > 150 && set[1].afstand > 10 && set[1].afstand < 60 && set[2].afstand < 8 && set[3].afstand < 8 && set[4].afstand > 30, JSON.stringify(set.map((x) => x.afstand)));
  tjek('flybyen: "Lige nu" ved båndene har Vindene og ⏩, ved pletten står døgnet stille, ved sydpolen og i skyggen kontakten Ultraviolet, og turen er slut i skyggen', set[1].knapper.join() === 'Vindene,hurtig' && /døgn stille/.test(set[2].lige) && set[3].knapper.includes('Ultraviolet') && set[4].knapper.includes('Ultraviolet') && set.slice(0, 4).every((x, i) => x.trin === i) && set[4].trin === null && /Turen er slut/.test(set[4].lige), JSON.stringify(set.map((x) => [x.trin, x.knapper, x.lige.slice(0, 40)])));
  tjek('flybyen: i skyggen er Solen skjult bag Jupiter', (await J(() => atomlabTest.solsystem.fænomen().solSkjult())).skjult, JSON.stringify(await J(() => atomlabTest.solsystem.fænomen().solSkjult())));
  // "‹" fra en ny tur og ✕ midt på turen
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await s.click('#solsystemBjælke button:has-text("Næste")');
  await s.click('#solsystemBjælke button:has-text("‹")');
  tjek('flybyen: "‹" går tilbage til oversigten', (await J(() => [atomlabTest.solsystem.fænomen().visning(), atomlabTest.solsystem.fænomen().tur().trin].join())) === 'maaner,0');
  // Et tryk på en måne under turen gør ingenting (som ved Saturn)
  await J(() => atomlabTest.solsystem.fænomen().hop());
  const tp = await J(() => atomlabTest.solsystem.fænomen().månePlads('Ganymedes'));
  await s.mouse.click(tp.x, tp.y);
  await s.waitForTimeout(300);
  tjek('flybyen: et tryk på en måne under turen afbryder den ikke', (await J(() => atomlabTest.solsystem.fænomen().visning())) === 'maaner' && (await J(() => atomlabTest.solsystem.fænomen().tur().trin)) === 0);
  await s.click('#solsystemBjælke button[aria-label="Stop flyby"]');
  await s.waitForTimeout(300);
  tjek('✕ stopper flybyen og fjerner underteksten', !(await J(() => document.querySelector('#solsystemVindue .undertekst.fase'))) && (await J(() => atomlabTest.solsystem.knapper()))[0] === '▶ Start flyby');
  // Et sted i træet midt på turen stopper turen
  await s.click('#solsystemBjælke button:has-text("Start flyby")');
  await s.click('#solsystemTræ button[data-sted="europa"]');
  tjek('et sted i træet midt på turen stopper turen og besøger stedet', (await J(() => atomlabTest.solsystem.fænomen().tur().trin)) === null && (await J(() => atomlabTest.solsystem.fase()))?.titel === 'Europa');
  await J(() => atomlabTest.solsystem.gåTil('jupiter'));
  await J(() => atomlabTest.solsystem.fænomen().hop());
}

// ---------- Polerne, nordlyset og ringene (J5) ----------
{
  // Billedet i 3D-området: summen af lyset og antallet af lilla pixel (nordlyset), målt i et skærmbillede
  const måleBillede = async (navn) => {
    const r = await J(() => { const k = document.getElementById('solsystemVindue').getBoundingClientRect(); return { x: k.left, y: k.top, w: k.width, h: k.height }; });
    const png = (await s.screenshot({ clip: { x: r.x, y: r.y + r.h * 0.3, width: r.w, height: r.h * 0.4 }, path: navn ? `${UD}/maal-${navn}.png` : undefined })).toString('base64');
    return J(async (png) => {
      const im = new Image();
      im.src = 'data:image/png;base64,' + png;
      await im.decode();
      const c = document.createElement('canvas');
      c.width = im.width; c.height = im.height;
      const g = c.getContext('2d');
      g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let lilla = 0, sum = 0;
      for (let i = 0; i < d.length; i += 4) {
        sum += d[i] + d[i + 1] + d[i + 2];
        if (d[i + 2] > d[i + 1] + 40 && d[i] > d[i + 1] + 15) lilla++;
      }
      return { lilla, sum: sum / (d.length / 4) };
    }, png);
  };
  // Hvor mange flere pixel i båndet om ringenes plan, der er tydeligt lysere (over 40 i r + g + b) med ringene end uden
  const båndBillede = async (navn) => {
    const r = await J(() => { const k = document.getElementById('solsystemVindue').getBoundingClientRect(); return { x: k.left, y: k.top, w: k.width, h: k.height }; });
    return (await s.screenshot({ clip: { x: r.x, y: r.y + r.h * 0.3, width: r.w, height: r.h * 0.4 }, path: `${UD}/maal-${navn}.png` })).toString('base64');
  };
  const forskel = (a, b) => J(async ([a, b]) => {
    const læs = async (png) => {
      const im = new Image();
      im.src = 'data:image/png;base64,' + png;
      await im.decode();
      const c = document.createElement('canvas');
      c.width = im.width; c.height = im.height;
      c.getContext('2d').drawImage(im, 0, 0);
      return c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    };
    const da = await læs(a), db = await læs(b);
    let n = 0;
    // Ringene lægger kun lys til: pixel, der bliver lysere, minus pixel, der bliver mørkere (fx stjerner, der flytter sig)
    for (let i = 0; i < da.length; i += 4) { const f = da[i] + da[i + 1] + da[i + 2] - db[i] - db[i + 1] - db[i + 2]; if (f > 40) n++; else if (f < -40) n--; }
    return n;
  }, [a, b]);
  const vent = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 15000, polling: 100 }).catch(() => {});
  const cyk = await J(() => atomlabTest.solsystem.fænomen().cykloner());
  tjek('cyklonerne er sendt til shaderen: 9 ved nordpolen og 6 ved sydpolen', cyk.filter((c) => c.pol === 'nord').length === 9 && cyk.filter((c) => c.pol === 'syd').length === 6 && (await J(() => atomlabTest.solsystem.fænomen().cyklonerSat())) === 15);
  // Cykloner drejer mod uret set fra oven på den nordlige halvkugle og med uret på den sydlige
  tjek('cyklonerne drejer mod uret ved nordpolen og med uret ved sydpolen', cyk.every((c) => (c.pol === 'nord' ? c.spin > 0 : c.spin < 0)), JSON.stringify(cyk.map((c) => c.spin)));
  // Sydpolen
  await J(() => atomlabTest.solsystem.gåTil('sydpol'));
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await vent();
  await s.waitForTimeout(400);
  const faseS = await J(() => atomlabTest.solsystem.fase());
  const sideS = await J(() => atomlabTest.solsystem.side());
  const solS = await J(() => atomlabTest.solsystem.fænomen().solVedPol('sydpol'));
  tjek('sydpolen: undertekst under 160 tegn, egen side, og Solen står lavt over polen (0-5°)', faseS?.titel === 'Sydpolen' && faseS.tekst.length < 160 && sideS.nøgle === 'jupiter:sydpol' && sideS.sidst === 'Ærligt talt' && solS > 0 && solS < 5, JSON.stringify({ faseS, n: sideS.nøgle, solS }));
  const dS = await J(() => atomlabTest.solsystem.fænomen().drejning());
  await s.waitForTimeout(800);
  tjek('sydpolen: Jupiters døgn står stille', dS === (await J(() => atomlabTest.solsystem.fænomen().drejning())));
  // Nordlyset ses kun med kontakten "Ultraviolet"
  const uden = await måleBillede();
  await J(() => atomlabTest.solsystem.trykPå('Ultraviolet'));
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().nordlys().styrke === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
  const med = await måleBillede();
  const nl = await J(() => atomlabTest.solsystem.fænomen().nordlys());
  tjek('nordlyset: ingen lilla pixel uden kontakten, mange med "Ultraviolet"', uden.lilla < 20 && med.lilla > 500 && nl.synlig, JSON.stringify({ uden: uden.lilla, med: med.lilla }));
  tjek('nordlyset: Io\'s fodspor på den nordlige og den sydlige halvkugle', nl.fod[0][1] > 0.5 && nl.fod[1][1] < -0.5, JSON.stringify(nl.fod));
  await s.screenshot({ path: UD + '/8-sydpol-uv.png' });
  await J(() => atomlabTest.solsystem.trykPå('Ultraviolet'));
  await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().nordlys().synlig, null, { timeout: 10000, polling: 100 }).catch(() => {});
  tjek('nordlyset: væk igen, når kontakten slås fra', !(await J(() => atomlabTest.solsystem.fænomen().nordlys().synlig)));
  // Ringene forfra (hele Jupiter): næsten usynlige
  await J(() => atomlabTest.solsystem.gåTil('jupiter'));
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await vent();
  await s.waitForFunction(() => atomlabTest.solsystem.fænomen().eksponering() === 1, null, { timeout: 10000, polling: 100 }).catch(() => {});
  await s.click('#solsystemTid button[data-tid="pause"]');
  await J(() => atomlabTest.solsystem.fænomen().drejSelv(false));
  await s.waitForTimeout(300);
  const forfraMed = await båndBillede('forfraMed');
  await J(() => atomlabTest.solsystem.fænomen().ringeSynlige(false));
  await s.waitForTimeout(300);
  const forfraUden = await båndBillede('forfraUden');
  await J(() => atomlabTest.solsystem.fænomen().ringeSynlige(true));
  await J(() => atomlabTest.solsystem.fænomen().drejSelv(true));
  // I Jupiters skygge: Solen er skjult, og ringene lyser op
  await J(() => atomlabTest.solsystem.gåTil('ringe'));
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await vent();
  await s.waitForTimeout(300);
  const bagMed = await båndBillede('bagMed');
  await J(() => atomlabTest.solsystem.fænomen().ringeSynlige(false));
  await s.waitForTimeout(300);
  const bagUden = await båndBillede('bagUden');
  await J(() => atomlabTest.solsystem.fænomen().ringeSynlige(true));
  const ændretForfra = await forskel(forfraMed, forfraUden), ændretBag = await forskel(bagMed, bagUden);
  tjek(`ringene: næsten usynlige forfra (${ændretForfra} pixel lysere), tydelige i Jupiters skygge (${ændretBag})`, ændretForfra < 50 && ændretBag > 1000, JSON.stringify({ ændretForfra, ændretBag }));
  await s.click('#solsystemTid button[data-tid="spil"]');
  const sk0 = await J(() => atomlabTest.solsystem.fænomen().solSkjult());
  await s.waitForTimeout(2500);
  const sk1 = await J(() => atomlabTest.solsystem.fænomen().solSkjult());
  const sideR = await J(() => atomlabTest.solsystem.side());
  tjek('skyggen: Solen bliver skjult (kameraet drejer ikke af sig selv), og siden "Ringene"', sk0.skjult && sk1.skjult && Math.abs(sk0.vinkel - sk1.vinkel) < 0.05 && sideR.nøgle === 'jupiter:ringe', JSON.stringify({ sk0, sk1, n: sideR.nøgle }));
  await s.screenshot({ path: UD + '/9-skyggen.png' });
  await J(() => atomlabTest.solsystem.gåTil('jupiter'));
  await J(() => atomlabTest.solsystem.fænomen().hop());
  await vent();
}

// ---------- Knapperne i teksterne (siden i lag) ----------
{
  const { SIDE, SIDER } = await import('../js/data/sider/jupiter.js');
  const alle = [SIDE, ...Object.values(SIDER)].map((x) => JSON.stringify(x)).join(' ');
  const steder = [...alle.matchAll(/data-sted=\\"([^"\\]+)/g)].map((m) => m[1]);
  const kontakter = [...alle.matchAll(/data-kontakt=\\"([^"\\]+)/g)].map((m) => m[1]);
  const iTræ = (await J(() => atomlabTest.solsystem.træ())).map((p) => p.id);
  const iStyr = await J(() => atomlabTest.solsystem.knapper());
  tjek('teksterne: alle steder i knapperne findes i træet', steder.length > 5 && steder.every((id) => iTræ.includes(id)), JSON.stringify([...new Set(steder)]));
  tjek('teksterne: alle kontakter i knapperne findes i Styr-boksen', kontakter.length >= 2 && kontakter.every((k) => iStyr.includes(k)), JSON.stringify([...new Set(kontakter)]));
  tjek('teksterne: alle sider har Ærligt talt, og der står intet om, at flybyen kommer senere', Object.values(SIDER).every((x) => x.ærligt) && !/flybyen kommer/i.test(SIDE.ærligt), SIDE.ærligt);
}

// ---------- Kortet (lavet af billeder/solsystem/lav_jupiter.py) ----------
const kort = await fm(async () => {
  const im = new Image();
  im.src = '/billeder/solsystem/jupiter-2k.jpg';
  await im.decode();
  const c = document.createElement('canvas');
  c.width = im.width; c.height = im.height;
  const g = c.getContext('2d');
  g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const px = (x, y) => { const i = (y * c.width + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  // Den rødeste plet (rød minus blå, glattet over 9 × 9 pixel) mellem 40° S og 40° N
  let bedst = { r: -1e9 };
  for (let y = Math.round(c.height * 0.28); y < c.height * 0.72; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      let r = 0;
      for (let dy = -4; dy <= 4; dy += 4) for (let dx = -4; dx <= 4; dx += 4) { const p = px((x + dx + c.width) % c.width, Math.min(c.height - 1, y + dy)); r += p[0] - p[2]; }
      if (r > bedst.r) bedst = { r, x, y };
    }
  }
  // Sømmen: springet mellem første og sidste søjle i forhold til springet ved JPEG's blokgrænser (hver 16. søjle).
  // Første og sidste søjle ligger i hver sin blok, så de kan ikke være mere ens end to blokke inde i billedet.
  const spring = (x0, x1) => { let sum = 0; for (let y = 0; y < c.height; y++) { const a = px(x0, y), z = px(x1, y); sum += Math.abs(a[0] - z[0]) + Math.abs(a[1] - z[1]) + Math.abs(a[2] - z[2]); } return sum / c.height; };
  const søm = spring(0, c.width - 1) * c.height;
  let nabo = 0;
  for (let x = 15; x < c.width - 1; x += 16) nabo += spring(x, x + 1);
  nabo *= c.height / ((c.width / 16) - 1);
  // Polerne: den mørkeste pixel i de øverste og nederste 2 % (OPAL er sort, hvor det mangler data)
  let mørkest = 255;
  for (const y of [...Array(Math.round(c.height * 0.02)).keys()].flatMap((i) => [i, c.height - 1 - i])) for (let x = 0; x < c.width; x += 4) mørkest = Math.min(mørkest, Math.max(...px(x, y)));
  return { b: im.width, h: im.height, beta: 90 - ((bedst.y + 0.5) / c.height) * 180, længde: ((bedst.x + 0.5) / c.width) * 360, søm: søm / c.height, nabo: nabo / c.height, mørkest };
});
// Pletten står ved ca. 22-23° S planetografisk (OPAL, december 2025). På kuglen svarer det til en parametrisk bredde
// på ca. 21° (tan β = (b/a) tan φ). Uden omregning ville den stå ved 22-23°.
const beta = (phi) => Math.atan((66854 / 71492) * Math.tan(phi * Math.PI / 180)) * 180 / Math.PI;
tjek('kortet: 2048 × 1024', kort.b === 2048 && kort.h === 1024, JSON.stringify(kort));
tjek(`kortet: pletten står ved den parametriske bredde for 21-24° S (${beta(-21).toFixed(1)} til ${beta(-24).toFixed(1)}°)`, kort.beta < beta(-21) && kort.beta > beta(-24), JSON.stringify(kort));
tjek('kortet: ingen søm, hvor kortet går rundt (ikke større end ved JPEG\'s blokgrænser)', kort.søm < kort.nabo * 1.4, JSON.stringify(kort));
tjek('kortet: ingen sorte huller ved polerne', kort.mørkest > 60, JSON.stringify(kort));

await s.screenshot({ path: UD + '/1-jupiter.png' });
await s.context().close();
await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
