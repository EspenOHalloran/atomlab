// "Under isen" (spor Måner, M2-M4, docs/drejebog-maaner.md): tallene, magnetfeltets model og tavlens kort i Node, og i
// browseren fænomenet lige efter Saturn, forløbets trin 1 (et træk i Europa skærer snittet, og det glider selv det sidste
// stykke, lupen finder dybden), trin 2 (feltet vipper, havet laver et ekstra felt, der vender modsat, og uden hav er det
// væk), trin 3 (modlyset ved Enceladus og snittet, der åbner sig selv), trin 4 (M4: flyveturen gennem fontænen, hvor man
// styrer højden, og højt oppe flyver Cassini igennem igen, og tavlen: et kort på en forkert række glider selv hen til den
// rigtige), trin 5 (Liv), "Det så du" og "Leg frit" (laboratoriets kontakter og valget af
// måne i bjælken), og konsollen er uden fejl.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { EUROPA, ENCELADUS, FELT, lagVed, lagGrænser, isBundSyd, feltVed, ekstraFelt, SIDE } from '../js/data/maaner/underisen.js';
import { KORT, RÆKKER, FARVER, MÅNER, SELV, feltFarve, tavlensFarver, kortEfter } from '../js/data/maaner/tavle.js';
import { UNDER_ISEN } from '../js/data/forloeb/under-isen.js';
import { FLYVETUR, FUND, TEKST as FLYV, enTur, spoletFrem } from '../js/data/maaner/flyvetur.js';
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
  tjek('forløbet: fem trin, hver Så under 160 tegn, gæt med svar, og ordene (magnetfelt, fontæne) findes i Ordbogen', UNDER_ISEN.trin.length === 5
    && UNDER_ISEN.trin.every((t) => t.så.length <= 160 && t.gæt.valg.length === 3 && t.gæt.valg.every((v) => v.svar) && t.ord.every((o) => ord.has(o)))
    && ORDBOG.find((o) => o.id === 'fontaene')?.tekst.length <= 260, UNDER_ISEN.trin.map((t) => t.så.length).join());
  tjek('siden: Kort højst tre sætninger, højst fire spørgsmål og Ærligt talt', SIDE.kort.split(/\.\s/).length <= 3 && SIDE.emner.length <= 4 && /skøn/.test(SIDE.ærligt));
  const gE = lagGrænser(ENCELADUS);
  tjek('Enceladus: isen er tyndere ved sydpolen, havet under den og stenkernen ca. 185 km uden jern', gE[0] > gE[1] && isBundSyd(ENCELADUS) > gE[0] && Math.abs(gE[1] * ENCELADUS.r - 185) < 2 && gE[2] === 0, gE.join());
  // Tavlen: hvert kort har én måne, én række (ikke Liv) og én farve, og de fire fra Cassini er Enceladus' med et vink
  const rækker = new Set(RÆKKER.map((r) => r.id)), farver = new Set(FARVER.map((f) => f.id)), måner = new Set(MÅNER.map((m) => m.id));
  tjek('tavlen: hvert kort har én måne, én række og én farve, og de fire fra Cassini er Enceladus\' med et vink', KORT.every((k) => måner.has(k.måne) && rækker.has(k.række) && k.række !== 'liv' && farver.has(k.farve) && k.farve !== 'ukendt' && k.hvem && k.spørgsmål && k.svar)
    && new Set(KORT.map((k) => k.id)).size === KORT.length && SELV.length === 4 && SELV.every((k) => k.måne === 'enceladus' && k.forkert));
  const fuld = tavlensFarver(KORT), før = tavlensFarver(kortEfter('fontæner'));
  tjek('tavlen: Enceladus er grøn i vand, energi og stoffer, Europa gul i energi og stoffer, Liv grå for begge (det bedste kort vinder)', ['vand', 'energi', 'stoffer'].every((r) => fuld.enceladus[r] === 'målt') && fuld.europa.vand === 'målt'
    && fuld.europa.energi === 'regnet' && fuld.europa.stoffer === 'regnet' && fuld.europa.liv === 'ukendt' && fuld.enceladus.liv === 'ukendt'
    && før.enceladus.energi === 'ukendt' && feltFarve([{ farve: 'regnet' }, { farve: 'målt' }], 'vand') === 'målt', JSON.stringify(fuld));
  // Flyveturen (M4): én tur ved Cassinis dybeste dyk fylder begge målere, højt oppe skal der flere ture til (rundt mål)
  tjek('flyveturen: én tur i 49 km fylder begge målere, i 300 km ikke, og turen er spolet frem ca. 12 gange', enTur(49) >= 1 && enTur(49, 'gas') >= 1 && enTur(300) < 1 && enTur(300) > 0.3
    && FLYVETUR.højde.min === 49 && Math.abs(spoletFrem() - 12) < 1, `${enTur(49)} ${enTur(300)} ${spoletFrem()}`);
  tjek('flyveturen: de fire fund er de fire kort fra Cassini, og fosfatet siges at være fundet i E-ringen', FUND.length === 4 && SELV.every((k) => FUND.some((f) => f.kort === k.id)) && /E-ring/.test(FUND.find((f) => f.kort === 'enceladus-fosfat').tekst)
    && FUND.every((f) => f.ved > 0 && f.ved <= 1 && f.tekst));
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

  // Trin 3: Enceladus forfra (ingen modlys). Kameraet drejes om bag månen: Så lyser fontænerne, og snittet åbner sig selv.
  await vent((t) => t.trin() === 'fontæner');
  await f((t) => t.kameraFrem());
  const forfra = await f((t) => ({ m: t.modlys(), fokus: t.fokus(), europa: t.europaVist() }));
  await f((t) => t.drejKamera([-0.85, 0, 0.5])); // (kameraet ser ca. 20° fra Solens retning, inden for de 30°)
  await spol(1);
  await vent((t) => t.fase() === 'så');
  const modlys = await f((t) => t.modlys());
  tjek('trin 3: forfra er der ingen modlys, og Europa er skjult. Drejes kameraet om bag Enceladus, er trinet færdigt', forfra.fokus === 'enceladus' && !forfra.europa && forfra.m.cos < forfra.m.grænse && modlys.nået && modlys.cos > modlys.grænse, JSON.stringify([forfra, modlys]));
  await spol(5);
  await f((t) => t.kameraFrem());
  tjek('trin 3: bagefter åbner snittet sig selv gennem Enceladus, og lagene står forklaret (isen under 5 km ved sydpolen)', (await f((t) => t.snitE())) === 1 && (await f((t) => t.snitNVist())) && /under 5 km/.test(await f((t) => t.lagTekst())));
  await side.screenshot({ path: `${UD}/fontaener.png` });

  // Trin 4: Cassini i buen, kortene falder ud, og man lægger dem på tavlen
  await klik('.fl-næste');
  await vent((t) => t.trin() === 'tavle');
  tjek('trin 4: tavlen står under scenen med Europas magnetfelt og Enceladus\' fontæner og vugge', (await f((t) => t.tavle().vist && t.tavle().iForløb && t.tavle().lagte.length === 3)) && (await side.isVisible('#solsystem > .ui-tavle')));
  // Flyveturen (M4): kameraet sidder bag Cassini, man trækker op for at komme tættere på sydpolen
  await klik('.fl-handling[data-knap="cassini"]');
  await spol(0.3);
  const i_tur = await f((t) => t.flyvetur());
  const afstand = Math.hypot(...i_tur.kamera.map((v, i) => v - i_tur.cassini[i]));
  tjek('trin 4: "Flyv med Cassini" sætter kameraet tæt bag Cassini, og målerne står øverst i 3D-vinduet', i_tur.aktiv && afstand < 2 && (await side.isVisible('#solsystemVindue > .ui-flyvetur')), `${afstand} ${JSON.stringify(i_tur)}`);
  const lær = await side.locator('#solsystemVindue canvas').first().boundingBox();
  await side.mouse.move(lær.x + lær.width / 2, lær.y + lær.height * 0.6);
  await side.mouse.down();
  await side.mouse.move(lær.x + lær.width / 2, lær.y + lær.height * 0.4, { steps: 5 });
  await side.mouse.up();
  const styret = await f((t) => t.flyvetur().hMål);
  // Højt oppe er målerne ikke fulde efter én tur, så Cassini flyver igennem igen
  await f((t) => t.sætHøjde(300));
  await spol(FLYVETUR.varighed + 1);
  const højt = await f((t) => t.flyvetur());
  tjek('trin 4: et træk op bringer Cassini tættere på, og højt oppe flyver den igennem igen (målerne er ikke fulde)', styret < FLYVETUR.højde.start && højt.aktiv && højt.tur === 2 && højt.fundet.length < 4 && højt.målere.korn > 0.2
    && (await side.textContent('#solsystemVindue .uf-linje')) === FLYV.igen, `${styret} ${JSON.stringify(højt)}`);
  await f((t) => t.sætHøjde(49));
  await spol(FLYVETUR.varighed + 1);
  await f((t) => t.kameraFrem());
  const bunke = await f((t) => t.tavle().bunke);
  const efter = await f((t) => t.flyvetur());
  tjek('trin 4: lavt nede fyldes målerne, de fire kort falder ud, og kameraet er ude i modlyset igen', !efter.aktiv && bunke.length === 4 && (await f((t) => t.boks())) === 'modlys' && !(await side.isVisible('#solsystemVindue > .ui-flyvetur')), JSON.stringify(efter));
  const fra = await side.locator('#solsystem .tv-løs[data-kort="enceladus-brint"]').boundingBox();
  const til = await side.locator('#solsystem .tv-felt[data-raekke="stoffer"][data-maane="enceladus"]').boundingBox();
  await side.mouse.move(fra.x + fra.width / 2, fra.y + fra.height / 2);
  await side.mouse.down();
  await side.mouse.move(til.x + til.width / 2, til.y + til.height / 2, { steps: 8 });
  await side.mouse.up();
  await spol(0.2);
  const brint = await f((t) => t.tavle());
  tjek('trin 4: brint trukket til Stoffer glider selv til Energi med et vink', brint.lagte.includes('enceladus-brint') && brint.farver.enceladus.energi === 'målt' && brint.farver.enceladus.stoffer === 'ukendt'
    && (await side.textContent('#solsystem .forløb-linje .fl-vink'))?.includes('Energi'), JSON.stringify(brint.farver));
  await side.click('#solsystem .tv-løs[data-kort="enceladus-salt"]');
  await side.click('#solsystem .tv-række[data-raekke="stoffer"]');
  await f((t) => { t.læg('enceladus-kulstof'); t.læg('enceladus-fosfat'); });
  await spol(4);
  await vent((t) => t.fase() === 'så');
  const tavle = await f((t) => t.tavle());
  tjek('trin 4: med et tryk på kortet og så på rækken kommer salt på Stoffer, og Europas søjle fylder sig selv (gul)', tavle.lagte.length === KORT.length && tavle.farver.europa.energi === 'regnet' && tavle.farver.enceladus.stoffer === 'målt', JSON.stringify(tavle.farver));
  await side.screenshot({ path: `${UD}/tavle.png` });

  // Trin 5: et tryk på Liv
  await klik('.fl-næste');
  await vent((t) => t.trin() === 'liv');
  await side.click('#solsystem .tv-række[data-raekke="liv"]');
  await vent((t) => t.fase() === 'så');
  tjek('trin 5: Liv er grå for begge måner, og et tryk viser "Ikke fundet"', (await f((t) => t.tavle().liv && t.tavle().farver.europa.liv === 'ukendt' && t.tavle().farver.enceladus.liv === 'ukendt')) && /Ingen har endnu kunnet se efter/.test(await side.textContent('#solsystem .tv-linje')));
  await klik('.fl-næste');
  await vent((t) => t.fase() === 'slut');
  const veje = await side.$$eval('#solsystem .forløb-linje .fl-vej', (v) => v.map((b) => b.textContent));
  tjek('"Det så du": den valgte kernesætning og fire veje (Flyv gennem fontænen, fontænerne ved Saturn, Leg frit, Tag turen igen)', (await side.textContent('#solsystem .forløb-linje .fl-tekst')) === UNDER_ISEN.kernesætning && veje.length === 4 && veje[0].startsWith('Flyv gennem fontænen') && veje.some((v) => v.startsWith('Leg frit')), veje.join());
  await side.click('#solsystem .forløb-linje .fl-vej:has-text("Leg frit")');
  await vent((t) => !t.kører());
  await spol(1);
  const styr = await side.evaluate(() => window.atomlabTest.solsystem.styr().map((s) => s.navn));
  tjek('"Leg frit": skyderen "Snit", kontakterne "Magnetfelt", "Hav", "Modlys" og "Navne", begge måner og tavlen foldet ind', ['Snit', 'Magnetfelt', 'Hav', 'Modlys', 'Navne'].every((n) => styr.some((s) => s?.startsWith(n))) && (await f((t) => t.enceladusVist() && t.europaVist() && !t.felt().vist && t.tavle().foldet && !t.tavle().iForløb)), styr.join());
  await side.screenshot({ path: `${UD}/lab.png` });
  await side.click('#solsystem .bjælke-handling:has-text("Enceladus")');
  await f((t) => t.kameraFrem());
  tjek('laboratoriet: "Enceladus" i bjælken flyver til Enceladus i modlys, Europa skjules, og knappen er grå', (await f((t) => t.fokus() === 'enceladus' && !t.europaVist() && t.modlys().cos > t.modlys().grænse)) && (await side.isDisabled('#solsystem .bjælke-handling:has-text("Enceladus")')));
  // Laboratoriet: "Flyv gennem fontænen" i bjælken flyver turen igen. Kortene ligger allerede på tavlen.
  await side.click('#solsystem .bjælke-handling:has-text("Flyv gennem fontænen")');
  await spol(0.3);
  const lab = await f((t) => t.flyvetur());
  await f((t) => t.sætHøjde(49));
  await spol(FLYVETUR.varighed + 1);
  await f((t) => t.kameraFrem());
  tjek('laboratoriet: "Flyv gennem fontænen" flyver turen, og bagefter er alle kort stadig på tavlen og bunken tom', lab.aktiv && !(await f((t) => t.flyvetur().aktiv)) && (await f((t) => t.tavle().lagte.length === KORT.length && !t.tavle().bunke.length && t.boks() === 'modlys')), JSON.stringify(lab));
  tjek('konsollen er uden fejl', konsol.length === 0, konsol.join(' | '));
  await browser.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
