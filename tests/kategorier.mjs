// Kategorierne i Det periodiske system: kortet med "hvorfor", forsøget, medlemmerne og links, på pc og telefon
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
import { KATEGORI_INFO } from '../js/data/kategorier.js';
import { GRUNDSTOFFER } from '../js/data/grundstoffer.js';
const UD = billedmappe('kategorier');
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

// ---------- Uden browser: dataene ----------
const kategorier = [...new Set(GRUNDSTOFFER.map((g) => g.kategori))];
tjek('alle kategorier har et kort', kategorier.every((k) => KATEGORI_INFO[k]), kategorier.filter((k) => !KATEGORI_INFO[k]));
for (const [k, info] of Object.entries(KATEGORI_INFO)) {
  const forkerte = info.medlemmer.filter((nr) => GRUNDSTOFFER[nr - 1].kategori !== k);
  tjek(`${k}: medlemmerne hører til kategorien, og eksemplet passer`, !forkerte.length && GRUNDSTOFFER[info.eksempel - 1].kategori === k, forkerte);
}

// ---------- I browseren ----------
const b = await chromium.launch({ args: ARGS });
const fejl = [];
const side = async (opsætning, hash = '#system') => {
  const page = await (await b.newContext(opsætning)).newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  await page.goto(`${ADRESSE}/?test${hash}`);
  await page.waitForFunction(() => window.atomlabTest && document.querySelector('#system:not(.skjult)'), null, { timeout: 20000 });
  return page;
};
const page = await side({ viewport: { width: 1280, height: 800 } });
const T = (f, a) => page.evaluate(f, a);
const vælg = (k) => page.click(`#systemChips .filter[data-værdi="${k}"]`);
const kortVist = () => page.isVisible('#systemKategori');
// Er der tegnet noget på lærredet (ikke kun baggrund)?
const tegnet = (id) => T((id) => {
  const c = document.getElementById(id);
  // Læses fra en kopi, så browseren ikke advarer om mange aflæsninger fra det samme lærred
  const kopi = document.createElement('canvas');
  kopi.width = c.width;
  kopi.height = c.height;
  const g = kopi.getContext('2d');
  g.drawImage(c, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let n = 0;
  for (let i = 3; i < d.length; i += 16) if (d[i] > 0) n++;
  return n;
}, id);

const bredFør = await T(() => document.getElementById('systemVindue').getBoundingClientRect().width);
for (const k of kategorier) {
  await vælg(k);
  await T(() => atomlabTest.system.kategoriSpol(2));
  const navn = await page.textContent('#katNavn');
  tjek(`${k}: kortet vises med "${navn}", atom og forsøg`, (await kortVist()) && navn === KATEGORI_INFO[k].flertal && (await tegnet('katAtom')) > 50 && (await tegnet('katForsøg')) > 50);
}
await page.screenshot({ path: `${UD}/1-pc.png` });
tjek('væggen bliver smallere, så kortet er ved siden af', (await T(() => document.getElementById('systemVindue').getBoundingClientRect().width)) < bredFør - 200);

// Valg i forsøget (alkalimetal i vand)
await vælg('alkali');
await page.click('#katForsøgValg button:has-text("Cs")');
await T(() => atomlabTest.system.kategoriSpol(1));
tjek('forsøget kan skifte metal (cæsium)', await T(() => document.querySelector('#katForsøgValg .valgt')?.textContent === 'Cs'));
// Et medlem åbner grundstoffet, og kortet kommer igen, når det lukkes
await page.click('#katMedlemmer .kat-medlem:has-text("Na")');
await page.waitForTimeout(300);
tjek('et medlem åbner grundstoffet (natrium), og kategorikortet skjules', (await T(() => atomlabTest.system.valgt())) === 11 && !(await kortVist()));
await page.click('#systemLuk');
await page.waitForFunction(() => !atomlabTest.system.valgt(), null, { timeout: 5000 });
tjek('kortet kommer igen, når grundstoffet lukkes', await kortVist());
// Søgning skjuler kortet
await page.fill('#systemSøg', 'jern');
await page.dispatchEvent('#systemSøg', 'input');
tjek('kortet skjules, mens man søger', !(await kortVist()));
await page.fill('#systemSøg', '');
await page.dispatchEvent('#systemSøg', 'input');
tjek('kortet kommer igen, når søgningen tømmes', await kortVist());
// Luk-knappen fjerner filteret
await page.click('#katLuk');
tjek('✕ lukker kortet og viser alle grundstoffer', !(await kortVist()) && !(await T(() => document.querySelector('#systemChips .filter.valgt'))));
// Ordforklaringer virker i kortet (fx "radioaktiv" hos actiniderne)
await vælg('actinid');
tjek('fagord kan trykkes på i kortet', await T(() => Boolean(document.querySelector('#systemKategori .fagord'))));
// Links: Reaktoren og Kosmos
await page.click('#katLinks button:has-text("Reaktoren")');
await page.waitForFunction(() => location.hash === '#reaktor', null, { timeout: 5000 }).catch(() => {});
tjek('link til Reaktoren', await T(() => location.hash === '#reaktor'));
await T(() => { location.hash = '#system'; });
await page.waitForFunction(() => document.querySelector('#system:not(.skjult)'), null, { timeout: 5000 });
await vælg('lanthanid');
await page.click('#katLinks button:has-text("Kosmos")');
await page.waitForFunction(() => location.hash === '#kosmos' && atomlabTest.kosmos.valgt() === 'kilonova', null, { timeout: 8000 }).then(() => true, () => false)
  .then((v) => tjek('link til Kosmos åbner kilonovaen', v));

// Telefon på højkant: filtrene folder sig sammen, og der er stadig plads til væggen
const tlf = await side({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await tlf.click('#systemFilterKnap');
await tlf.click('#systemChips .filter[data-værdi="aedelgas"]');
await tlf.waitForTimeout(400);
const plads = await tlf.evaluate(() => ({ vindue: document.getElementById('systemVindue').getBoundingClientRect().height, foldet: !document.getElementById('systemFiltre').classList.contains('vis-filtre') }));
tjek(`telefon: filtrene folder sig sammen, og væggen har plads (${Math.round(plads.vindue)} px)`, plads.foldet && plads.vindue > 250 && (await tlf.isVisible('#systemKategori')), JSON.stringify(plads));
await tlf.screenshot({ path: `${UD}/2-telefon.png` });

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0); // konsolfejl tæller også som fejl
