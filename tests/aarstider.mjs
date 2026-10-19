// Årstiderne (Kosmos): formlerne for Solens bane mod kendte værdier, og fænomenet i browseren (trin, skyder, tabel og telefon)
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { dagIÅret, dagslængde, middagshøjde, afstand, deklination, timerTekst } from '../js/data/solbane.js';
const UD = billedmappe('aarstider');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: formlerne mod kendte værdier (oktober 2026) ----------
const KBH = 55.68, SYDNEY = -33.87, SINGAPORE = 1.35, ILULISSAT = 69.22;
const minutter = (b, m, d) => Math.round(dagslængde(b, dagIÅret(m, d)) * 60);
const omkring = (navn, b, m, d, t, min, kilde) => {
  const v = minutter(b, m, d);
  tjek(`${navn} ${d}/${m}: ${timerTekst(v / 60)} (kilde: ${t} t ${min} min, ${kilde})`, Math.abs(v - (t * 60 + min)) <= 3, v);
};
omkring('København', KBH, 3, 20, 12, 11, 'sunrisesunsettime.org 06:11-18:22');
omkring('København', KBH, 6, 21, 17, 32, 'timeanddate.com: 10 t 31 min længere end 21/12');
omkring('København', KBH, 12, 21, 7, 1, 'sunrisesunsettime.org 08:38-15:39');
omkring('Sydney', SYDNEY, 12, 22, 14, 24, 'sunrisesunset.io');
omkring('Singapore', SINGAPORE, 6, 21, 12, 12, 'sunrisesunset.io');
// Midnatssol og mørketid i Ilulissat (WeatherSpark: 19. maj-24. juli og 29. november-12. januar, andre kilder 1-3 dage senere)
const dage = Array.from({ length: 365 }, (_, i) => i + 1);
const sol = dage.filter((n) => dagslængde(ILULISSAT, n) >= 24);
const mørke = dage.filter((n) => dagslængde(ILULISSAT, n) <= 0);
tjek('Ilulissat: midnatssol starter 19.-22. maj', sol[0] >= dagIÅret(5, 19) && sol[0] <= dagIÅret(5, 22), sol[0]);
tjek('Ilulissat: midnatssol slutter 22.-25. juli', sol.at(-1) >= dagIÅret(7, 22) && sol.at(-1) <= dagIÅret(7, 25), sol.at(-1));
const mørkeSlut = Math.max(...mørke.filter((n) => n < 100)), mørkeStart = Math.min(...mørke.filter((n) => n > 300));
tjek('Ilulissat: mørketid starter 28. november-1. december', mørkeStart >= dagIÅret(11, 28) && mørkeStart <= dagIÅret(12, 1), mørkeStart);
tjek('Ilulissat: mørketid slutter 10.-14. januar', mørkeSlut >= 10 && mørkeSlut <= 14, mørkeSlut);
// Solens højde ved middag i København (90° - 55,68° ± 23,44°) og Jordens afstand (thesuntoday.org: 3/1 147,1 og 6/7 152,09 mio. km)
const hSommer = middagshøjde(KBH, dagIÅret(6, 21)), hVinter = middagshøjde(KBH, dagIÅret(12, 21));
tjek(`København: Solen ved middag ${hSommer.toFixed(1)}° om sommeren og ${hVinter.toFixed(1)}° om vinteren`, Math.abs(hSommer - 57.8) < 0.3 && Math.abs(hVinter - 10.9) < 0.3);
const afst = dage.map(afstand);
const nær = afst.indexOf(Math.min(...afst)) + 1, fjern = afst.indexOf(Math.max(...afst)) + 1;
tjek('Tættest på Solen 2.-4. januar, ca. 147,1 mio. km', nær >= 2 && nær <= 4 && Math.abs(Math.min(...afst) - 147.1) < 0.1, `${nær} ${Math.min(...afst)}`);
tjek('Længst væk 4.-7. juli, ca. 152,1 mio. km', fjern >= dagIÅret(7, 4) && fjern <= dagIÅret(7, 7) && Math.abs(Math.max(...afst) - 152.1) < 0.1, `${fjern} ${Math.max(...afst)}`);
const maksDekl = Math.max(...dage.map(deklination));
tjek('Solen står højst 23,4° nord for ækvator', Math.abs(maksDekl - 23.44) < 0.02, maksDekl);

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const side = async (opsætning) => {
  const page = await (await b.newContext(opsætning)).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test#kosmos`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#kosmos:not(.skjult)'), null, { timeout: 20000 });
  await page.evaluate(() => atomlabTest.kosmos.vælg('aarstider'));
  await page.waitForTimeout(300);
  return page;
};
const page = await side({ viewport: { width: 1280, height: 800 } });
const T = (f, a) => page.evaluate(f, a);
const kort = () => T(() => document.querySelector('#kosmosToplag .aarstid-kort')?.textContent ?? '');
const række = (sted) => T((sted) => [...document.querySelectorAll('#kosmosToplag tr')].find((r) => r.textContent.includes(sted))?.textContent ?? '', sted);
const undertekst = () => T(() => document.querySelector('#kosmosVindue .undertekst')?.textContent ?? '');
const næste = () => T(() => { const k = atomlabTest.kosmos; k.tryk(0); k.spol(2); });

tjek('fænomenet står efter "Ny stjerne"', (await T(() => atomlabTest.kosmos.fænomener)).join(',').includes('stjernefoedsel,aarstider'));
tjek('tabellen står i 3D-billedet med fire steder', (await T(() => document.querySelectorAll('#kosmosToplag tr').length)) === 5, await kort());
await næste();
tjek('trin 2: forår i nord', (await undertekst()).includes('Forår i nord'), await undertekst());
tjek('forår: 20. marts og ca. 12 timer i Danmark', (await kort()).includes('20. marts') && (await række('Danmark')).includes('12 t 11 min'), await række('Danmark'));
tjek('ordet "jævndøgn" kan trykkes på', await T(() => Boolean(document.querySelector('.fagord[data-ord="jaevndoegn"]'))));
await næste();
tjek('sommer: Danmark 17 t 32 min', (await række('Danmark')).includes('17 t 32 min'), await række('Danmark'));
tjek('sommer: midnatssol i Nordgrønland', (await række('Nordgrønland')).includes('midnatssol'), await række('Nordgrønland'));
tjek('sommer: kort dag i Australien', (await række('Australien')).includes('9 t 54 min'), await række('Australien'));
tjek('panelet siger vinter i Australien', (await page.textContent('#kosmosForklaring')).includes('Australien (Sydney) · vinter'));
await page.waitForTimeout(400);
await page.screenshot({ path: `${UD}/1-sommer.png` });
await næste();
await næste();
tjek('vinter: Danmark 7 t 01 min', (await række('Danmark')).includes('7 t 01 min'), await række('Danmark'));
tjek('vinter: mørketid i Nordgrønland', (await række('Nordgrønland')).includes('mørketid'), await række('Nordgrønland'));
tjek('vinter: ca. 12 timer ved ækvator', /12 t 0\d min/.test(await række('Ækvator')), await række('Ækvator'));
await page.screenshot({ path: `${UD}/2-vinter.png` });
await næste();
tjek('sidste trin: prøv selv, og "Næste" er slået fra', (await undertekst()).includes('Prøv selv') && (await T(() => document.querySelector('#kosmosStyring button').disabled)));
// Skyderen: vælg selv datoen
await T(() => { const i = document.querySelector('#kosmosStyring input[type=range]'); i.value = 172; i.dispatchEvent(new Event('input')); atomlabTest.kosmos.spol(2); });
tjek('skyderen: 21. juni giver 17 t 32 min', (await kort()).includes('21. juni') && (await række('Danmark')).includes('17 t 32 min'), await kort());
tjek('skyderen: underteksten siger, at man selv vælger', (await undertekst()).includes('Du vælger selv'), await undertekst());
// Til/fra-knapperne og Forfra
await page.click('#kosmosStyring button:has-text("Tæt på Jorden")');
await page.click('#kosmosStyring button:has-text("Jorden drejer")');
await T(() => atomlabTest.kosmos.spol(1));
await page.click('#kosmosStyring button:has-text("Forfra")');
tjek('Forfra går tilbage til første trin', (await undertekst()).includes('Jorden og Solen'), await undertekst());
await page.screenshot({ path: `${UD}/3-oversigt.png` });
// Skift fænomen: tabellen forsvinder
await T(() => atomlabTest.kosmos.vælg('solstorm'));
tjek('tabellen forsvinder, når man skifter fænomen', !(await T(() => document.querySelector('#kosmosToplag').children.length)));

// Telefon: tabellen i 3D-billedet er skjult, panelet viser de fire steder
const tlf = await side({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
tjek('telefon: tabellen i 3D-billedet er skjult', !(await tlf.isVisible('#kosmosToplag .aarstid-kort')));
tjek('telefon: panelet viser de fire steder', (await tlf.$$('#kosmosForklaring .sted-liste li')).length === 4);
await tlf.screenshot({ path: `${UD}/4-telefon.png`, fullPage: true });

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
