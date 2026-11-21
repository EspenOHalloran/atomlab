// "Land med Huygens" (spor Måner, M5a, docs/drejebog-maaner.md afsnit 7-8): tidsplanen, billederne, uret og teksterne i
// Node, og i browseren forløbets trin 1 (slip Huygens: Cassini, turen ind og faldskærmen), trin 2 (turen ned gennem
// disen med ⏩, højdemåleren, uret, der skifter til Jorden, og Huygens' kamera, der først ser jorden ca. 30 km oppe),
// "Det så du" og "Leg frit" (laboratoriets bladring og kontakten "Huygens' kamera"), og konsollen er uden fejl.
import { statSync, readFileSync } from 'node:fs';
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { FALDSKÆRM_KM, NED_S, LYSTID_S, SE_JORDEN_KM, STOP_KM, BILLEDER, KREDIT, ETAPER, SIDE, højdeVed, tidVed, billedeVed, urTekst, skærmVed } from '../js/data/maaner/landhuygens.js';
import { LAND_MED_HUYGENS } from '../js/data/forloeb/land-med-huygens.js';
import { FÆNOMEN_IDER } from '../js/data/faenomener.js';
import { forløbMed } from '../js/data/forloeb/liste.js';
const UD = billedmappe('maaner');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser ----------
{
  const ids = FÆNOMEN_IDER.solsystem;
  tjek('landhuygens står lige efter underisen i FÆNOMEN_IDER, og forløbet findes i listen', ids[ids.indexOf('underisen') + 1] === 'landhuygens' && forløbMed('land-med-huygens') === LAND_MED_HUYGENS && LAND_MED_HUYGENS.fænomen === 'landhuygens');
  // Tidsplanen: 160 km ved faldskærmen, jorden efter 2 t 27 min 50 s, altid nedad, og tidVed er det omvendte
  let nedad = true, før = Infinity;
  for (let s = 0; s <= NED_S; s += 30) { const h = højdeVed(s); if (h > før) nedad = false; før = h; }
  const rundt = [150, 125, 80, 50, 30, 10, 1, 0.3].every((h) => Math.abs(højdeVed(tidVed(h)) - h) < 1e-6);
  tjek('tidsplanen: 160 km ved faldskærmen, jorden efter 2 t 27 min 50 s, altid nedad, og tidVed er det omvendte', højdeVed(0) === FALDSKÆRM_KM && højdeVed(NED_S) === 0 && NED_S === 8870 && nedad && rundt
    && tidVed(SE_JORDEN_KM) > 50 * 60 && tidVed(SE_JORDEN_KM) < 70 * 60 && skærmVed(14 * 60) === 'stor' && skærmVed(16 * 60) === 'lille', String(tidVed(SE_JORDEN_KM) / 60));
  // Billederne: højden fra filmen, faldende, filerne findes, og de fylder under 1 MB tilsammen
  let bytes = 0, findes = true;
  for (const b of BILLEDER) { try { bytes += statSync(new URL(`../billeder/solsystem/${b.fil}`, import.meta.url)).size; } catch { findes = false; } }
  tjek('billederne fra luften: 15 med faldende højde fra 147,7 til 0,7 km, filerne findes og fylder under 1 MB', BILLEDER.length === 15 && BILLEDER.every((b, i) => i === 0 || b.km < BILLEDER[i - 1].km)
    && BILLEDER[0].km === 147.7 && BILLEDER.at(-1).km === 0.7 && findes && bytes < 1e6, `${bytes} ${findes}`);
  tjek('billedeVed: intet over det første billede, ellers det seneste (ved 26 km billedet fra 30,8 km)', billedeVed(150) === null && billedeVed(26).km === 30.8 && billedeVed(25.4).km === 25.4 && billedeVed(0.5).km === 0.7);
  // Uret: Jorden har intet hørt den første time (signalet er 67 min om det), og bagefter ligger det over en time bagud
  const u1 = urTekst(30 * 60, true), u2 = urTekst(100 * 60, true), u3 = urTekst(100 * 60);
  tjek('uret: Jorden har intet hørt efter 30 min, efter 100 min har Jorden hørt 0 t 33 min, ved Titan 1 t 40 min', LYSTID_S > 3600 && u1.tal === 'intet endnu' && u2.tal === '0 t 33 min' && u3.tal === '1 t 40 min', JSON.stringify([u1, u2, u3]));
  // Teksterne: to trin, gæt med svar, Så under 160 tegn, og fælden "kom ud af disen" står ingen steder
  const alt = JSON.stringify([LAND_MED_HUYGENS, SIDE, ETAPER]);
  tjek('forløbet: to trin (slip, disen), gæt med svar, Så under 160 tegn, og ingen siger "ud af disen"', LAND_MED_HUYGENS.trin.map((t) => t.id).join() === 'slip,disen'
    && LAND_MED_HUYGENS.trin.every((t) => t.så.length <= 160 && t.gæt.valg.length === 3 && t.gæt.valg.every((v) => v.svar)) && !/ud af disen/i.test(alt) && /30 km/.test(LAND_MED_HUYGENS.trin[1].så), LAND_MED_HUYGENS.trin.map((t) => t.så.length).join());
  tjek('siden: Kort højst tre sætninger, højst fire spørgsmål, ESA\'s credit under Billeder og Ærligt talt om spoling og tegning', SIDE.kort.split(/\.\s/).length <= 3 && SIDE.emner.length <= 4 && SIDE.billeder.includes(KREDIT) && /spolet/.test(SIDE.ærligt) && /tegnet af os/.test(SIDE.ærligt));
  tjek('KILDER.md har rækken for Huygens\' billeder med ESA\'s standardlicens', /huygens\/luft-1477\.webp[\s\S]*PIA07234[\s\S]*standardlicens/.test(readFileSync(new URL('../billeder/solsystem/KILDER.md', import.meta.url), 'utf8')));
}

// ---------- I browseren ----------
if (!process.argv.includes('--uden-browser')) {
  const browser = await chromium.launch({ args: ARGS });
  const side = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const konsol = [];
  side.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });
  side.on('pageerror', (e) => konsol.push(e.message));
  await side.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await side.goto(`${ADRESSE}?test&forloeb=land-med-huygens#solsystem`);
  await side.waitForFunction(() => window.atomlabTest?.solsystem?.fænomen?.()?.kører?.() === 'land-med-huygens', null, { timeout: 60000 });
  const f = (kode, a) => side.evaluate(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('t', 'a', `return (${k})(t, a)`)(t, a); }, [kode.toString(), a]);
  const vent = (kode, a, ms = 30000) => side.waitForFunction(([k, a]) => { const t = window.atomlabTest.solsystem.fænomen(); return new Function('t', 'a', `return (${k})(t, a)`)(t, a); }, [kode.toString(), a], { timeout: ms, polling: 100 });
  const klik = (sel) => side.click(`#solsystem .forløb-linje ${sel}`);
  const spol = (s) => side.evaluate((s) => window.atomlabTest.solsystem.spol(s), s);

  const træ = await side.evaluate(() => window.atomlabTest.solsystem.træ().map((b) => b.id));
  tjek('trin 1: forløbet starter ved Cassini 25. december 2004, og "Land med Huygens" står i listen lige efter "Under isen"', (await f((t) => t.trin() === 'slip' && t.scenen() === 'cassini' && t.huygens().vist && /25\. december 2004/.test(t.ned().dato) && !t.ned().måler))
    && træ.indexOf('landhuygens') > træ.indexOf('underisen') && træ.slice(træ.indexOf('underisen') + 1, træ.indexOf('landhuygens')).every((id) => id.startsWith('tur:')), træ.join());
  await spol(0.5);
  await side.screenshot({ path: `${UD}/huygens-cassini.png` });
  // Trin 1: "Slip Huygens" i linjen. Huygens glider fri, "Tre uger senere", turen ind med skæret, og faldskærmen
  await klik('.fl-handling[data-knap="slip"]');
  await spol(3.5);
  const ind = await f((t) => ({ fase: t.scenen(), skær: t.skær(), h: t.huygens().hIndgang }));
  await spol(2);
  const indMidt = await f((t) => ({ fase: t.scenen(), skær: t.skær(), h: t.huygens().hIndgang, dato: t.ned().dato }));
  await side.screenshot({ path: `${UD}/huygens-ind.png` });
  await spol(4);
  await vent((t) => t.fase() === 'så');
  const ned = await f((t) => ({ fase: t.scenen(), ...t.ned() }));
  tjek('trin 1: Huygens glider fri og suser ind i luften med et skær, datoen bliver 14. januar 2005, og faldskærmen kommer ud ved 160 km', ['rejse', 'ind'].includes(ind.fase) && indMidt.fase === 'ind' && indMidt.skær && indMidt.h < 1270 && /14\. januar 2005/.test(indMidt.dato)
    && ned.fase === 'ned' && ned.vist && ned.måler && ned.h > 150 && ned.h <= 160 && ned.skærm === 'stor' && !(await f((t) => t.rumVist())), JSON.stringify([ind, indMidt, ned]));

  // Trin 2: ⏩ slås til, og turen spoles. Højt oppe ser kameraet kun dis, og uret viser, at Jorden intet har hørt
  await klik('.fl-næste');
  await vent((t) => t.trin() === 'disen');
  tjek('trin 2: tidsknappen står på ⏩, og Huygens\' kamera viser billedet fra 147,7 km under 150 km', (await side.evaluate(() => window.atomlabTest.solsystem.tidsknap())) === 'hurtig' && (await f((t) => t.hurtig())));
  await klik('.fl-gæt');
  await spol(3); // (ca. 450 s i faldskærmen: under 147,7 km)
  const højt = await f((t) => t.ned());
  await f((t) => t.skiftUr());
  const urJ = await f((t) => t.ned().ur);
  await f((t) => t.skiftUr());
  tjek('trin 2: højt oppe viser kameraet billedet fra 147,7 km, og et tryk på uret viser, at Jorden intet har hørt endnu', højt.kamera && højt.billede === 147.7 && /Hørt på Jorden\s*intet endnu/.test(urJ), JSON.stringify([højt.billede, urJ]));
  // Ned til ca. 26 km: Billedet fra 30,8 km, hvor jorden kan ses, lyser op
  await spol((tidVed(26) - højt.s) / 150 + 0.2);
  const lavt = await f((t) => ({ ...t.ned(), jordenKlasse: document.querySelector('#solsystem .ui-huygens-kamera').classList.contains('jorden') }));
  await side.screenshot({ path: `${UD}/huygens-30km.png` });
  tjek('trin 2: ca. 26 km oppe viser kameraet billedet fra 30,8 km, som lyser op, og den lille faldskærm er ude', lavt.h < 27 && lavt.h > 24 && lavt.billede === 30.8 && lavt.jordenKlasse && lavt.skærm === 'lille' && lavt.set.includes(53.4), JSON.stringify(lavt));
  // Et tryk på kameraet gør det større, og et til gør det lille igen
  await side.click('#solsystem .lh-billede');
  const stor = await f((t) => t.ned().stor);
  await side.click('#solsystem .lh-billede');
  tjek('Huygens\' kamera: et tryk gør billedet større, et til gør det lille igen', stor && !(await f((t) => t.ned().stor)));
  await spol((tidVed(0.9) - lavt.s) / 150 + 0.5);
  await vent((t) => t.fase() === 'så');
  const bund = await f((t) => t.ned());
  tjek('trin 2: under 1 km er trinet færdigt, kameraet har vist billederne undervejs, og turen stopper ved 500 m (landingen er M5b)', bund.h <= 1 && bund.h >= STOP_KM - 1e-6 && bund.set.length >= 10 && bund.højdeTekst.endsWith(' m'), JSON.stringify(bund));
  await side.screenshot({ path: `${UD}/huygens-nede.png` });
  await klik('.fl-næste');
  await vent((t) => t.fase() === 'slut');
  const veje = await side.$$eval('#solsystem .forløb-linje .fl-vej', (v) => v.map((b) => b.textContent));
  tjek('"Det så du": kernesætningen og tre veje (Titan ved Saturn, Leg frit, Tag turen igen)', (await side.textContent('#solsystem .forløb-linje .fl-tekst')) === LAND_MED_HUYGENS.kernesætning && veje.length === 3 && veje.some((v) => v.startsWith('Leg frit')), veje.join());

  // Laboratoriet: bladring mellem etaperne, kontakten "Huygens' kamera" og "Slip Huygens" ved Cassini
  await side.click('#solsystem .forløb-linje .fl-vej:has-text("Leg frit")');
  await vent((t) => !t.kører());
  await spol(0.5);
  const styr = await side.evaluate(() => window.atomlabTest.solsystem.styr().map((s) => s.navn));
  await side.click('#solsystem .bjælke-tilbage');
  await spol(0.3);
  const tilbage = await f((t) => ({ etape: t.etape(), h: t.ned().h }));
  await f((t) => t.gåEtape(0));
  await spol(0.3);
  const knapper = await side.evaluate(() => window.atomlabTest.solsystem.knapper());
  tjek('laboratoriet: kontakten "Huygens\' kamera", "‹" går en etape tilbage (Jorden), og ved Cassini står "Slip Huygens" og "Næste: Faldskærmen"', styr.some((s) => s?.startsWith('Huygens')) && tilbage.etape === 2 && tilbage.h <= 31 && tilbage.h > 29
    && knapper.some((k) => k.includes('Slip Huygens')) && knapper.some((k) => k.includes('Næste: Faldskærmen')) && (await f((t) => t.scenen() === 'cassini')), JSON.stringify([styr, tilbage, knapper]));
  tjek('konsollen er uden fejl', konsol.length === 0, konsol.join(' | '));
  await browser.close();
}
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
