// Kom i gang-guiden, "Næste skridt" og "Vis mig" i Stjerneovnen og Reaktoren
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('guide');
const kun = process.argv[2]; // fx "pc" eller "tlf" for kun at køre én størrelse
const b = await chromium.launch({ args: ARGS });
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };
for (const [navn, [w, h, mobil]] of Object.entries({ pc: [1280, 800, false], tlf: [390, 844, true] })) {
  if (kun && kun !== navn) continue;
  const fejl = [];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobil, isMobile: mobil, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
  const T = (f, a) => page.evaluate(f, a);
  const boble = () => T(() => { const e = document.querySelector('.guide-boble'); return e && !e.classList.contains('skjult') ? e.querySelector('.guide-titel').textContent : null; });
  const ring = () => T(() => { const e = document.querySelector('.guide-ring'); if (!e || e.classList.contains('skjult')) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, b: r.width }; });
  const tryk = async (x, y) => { if (mobil) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); };
  const venTil = async (f, ms = 15000) => { const slut = Date.now() + ms; while (Date.now() < slut) { if (await f()) return true; await page.waitForTimeout(300); } return false; };
  const næste = () => page.click('.guide-næste');
  const fr = () => T(() => JSON.parse(localStorage.getItem('atomlabFremgang') || '{}').opgaver || {});

  // ---------- Stjerneovnen ----------
  await page.goto(`${ADRESSE}/?test#fusion`);
  await T(() => { localStorage.clear(); localStorage.setItem('atomlabGuide', JSON.stringify({ 'fusion-rejse': 1 })); }); // rejsen ind i Solen testes i stjerneovn-mus.mjs
  await page.reload();
  tjek(`${navn}: guiden starter i Stjerneovnen`, await venTil(async () => (await boble()) === 'Du er inde i Solens kerne', 12000), await boble());
  await page.screenshot({ path: `${UD}/${navn}-f1-velkommen.png` });
  await næste();
  await page.waitForTimeout(800);
  tjek(`${navn}: trin 2 vælg en proton`, (await boble()) === 'Vælg en proton', await boble());
  let r = await ring();
  tjek(`${navn}: ring om en proton`, r && r.b < 120, JSON.stringify(r));
  await page.screenshot({ path: `${UD}/${navn}-f2-vaelg.png` });
  await T(() => atomlabTest.fusion.temperatur(1)); // så står kernerne næsten stille, mens testen trykker
  await page.waitForTimeout(500);
  // Protonen kan nå at flytte sig mellem målingen og trykket (især på en travl maskine), så prøv op til tre gange
  for (let forsøg = 0; forsøg < 3 && (await boble()) === 'Vælg en proton'; forsøg++) {
    r = await ring();
    if (r) await tryk(r.x, r.y);
    await venTil(async () => (await boble()) !== 'Vælg en proton', 2500);
  }
  tjek(`${navn}: trin 3 skyd`, await venTil(async () => (await boble()) === 'Skyd den mod en anden', 5000), await boble());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${UD}/${navn}-f3-skyd.png` });
  for (let forsøg = 0; forsøg < 3 && (await boble()) === 'Skyd den mod en anden'; forsøg++) {
    r = await ring();
    if (r) await tryk(r.x, r.y);
    await venTil(async () => (await boble()) !== 'Skyd den mod en anden', 2500);
  }
  tjek(`${navn}: trin 4 varmen`, await venTil(async () => (await boble()) === 'Varmen er vigtig', 6000), await boble());
  await T(() => atomlabTest.fusion.temperatur(15));
  await page.waitForTimeout(800);
  r = await ring();
  tjek(`${navn}: ring om temperaturen`, r !== null);
  await page.screenshot({ path: `${UD}/${navn}-f4-varme.png` });
  await næste();
  await page.waitForTimeout(800);
  tjek(`${navn}: trin 5 næste skridt`, (await boble()) === 'Dit næste skridt');
  await page.screenshot({ path: `${UD}/${navn}-f5-mission.png` });
  await næste();
  await page.waitForTimeout(500);
  tjek(`${navn}: guiden er færdig`, (await boble()) === null);
  tjek(`${navn}: guiden er husket`, await T(() => Boolean(JSON.parse(localStorage.getItem('atomlabGuide') || '{}').fusion)));
  // Næste skridt og Vis mig
  const mission = await T(() => atomlabTest.fusion.mission());
  console.log(navn, 'mission:', mission);
  tjek(`${navn}: næste skridt er p + p`, mission.includes('p + p') || mission.includes('helium'), mission);
  const førEnergi = await T(() => atomlabTest.fusion.energi());
  await page.click('#fusVisMig');
  await page.waitForTimeout(600);
  tjek(`${navn}: Vis mig kører`, await T(() => atomlabTest.fusion.demo()));
  await T(() => atomlabTest.fusion.spolAlt(2.2));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${UD}/${navn}-f6-vismig.png` });
  await T(() => atomlabTest.fusion.spolAlt(14));
  tjek(`${navn}: Vis mig bliver færdig`, await venTil(async () => !(await T(() => atomlabTest.fusion.demo())), 5000));
  const efterEnergi = await T(() => atomlabTest.fusion.energi());
  tjek(`${navn}: Vis mig lavede en reaktion`, efterEnergi > førEnergi, `${førEnergi} → ${efterEnergi}`);
  const opgaver = await fr();
  console.log(navn, 'opgaver efter Vis mig:', Object.keys(opgaver).join(', '));
  await page.screenshot({ path: `${UD}/${navn}-f7-efter.png` });
  // Ingen guide anden gang
  await page.reload();
  await page.waitForTimeout(4000);
  tjek(`${navn}: ingen guide anden gang`, (await boble()) === null);

  // ---------- Reaktoren, del 1 ----------
  await T(() => { location.hash = '#reaktor'; });
  tjek(`${navn}: guiden starter i Reaktoren`, await venTil(async () => (await boble()) === 'En uran-235-kerne', 8000), await boble());
  await page.screenshot({ path: `${UD}/${navn}-r1-kerne.png` });
  await næste();
  await page.waitForTimeout(700);
  tjek(`${navn}: trin skyd neutron`, (await boble()) === 'Skyd en neutron');
  r = await ring();
  tjek(`${navn}: ring om knappen`, r !== null);
  await page.screenshot({ path: `${UD}/${navn}-r2-skyd.png` });
  await page.click('#reaktorSkyd');
  tjek(`${navn}: trin se godt efter`, await venTil(async () => (await boble()) === 'Se godt efter', 4000), await boble());
  await T(() => atomlabTest.reaktor.spol(4));
  tjek(`${navn}: kernen spalter`, await venTil(async () => (await boble()) === 'Kædereaktion', 15000), await boble());
  tjek(`${navn}: opgaven spalt er klaret`, (await fr())['r-spalt']);
  await page.screenshot({ path: `${UD}/${navn}-r3-kaede.png` });
  await næste();
  await page.waitForTimeout(400);
  const m1 = await T(() => atomlabTest.reaktor.mission());
  console.log(navn, 'reaktor mission:', m1);
  tjek(`${navn}: næste skridt er hurtig neutron`, m1.includes('hurtig'), m1);
  await T(() => atomlabTest.reaktor.spol(6));
  await page.click('#reaktorVisMig');
  await page.waitForTimeout(500);
  tjek(`${navn}: Vis mig i del 1 kører`, (await T(() => atomlabTest.reaktor.visning())).del1);
  await T(() => atomlabTest.reaktor.spol(1.5));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${UD}/${navn}-r4-vismig.png` });
  await T(() => atomlabTest.reaktor.spol(12));
  tjek(`${navn}: Vis mig i del 1 bliver færdig`, await venTil(async () => !(await T(() => atomlabTest.reaktor.visning())).del1, 5000));

  // ---------- Reaktoren, del 2 ----------
  await page.click('.del-knap[data-del="kæde"]');
  tjek(`${navn}: guiden starter i kædereaktionen`, await venTil(async () => (await boble()) === 'Start reaktoren', 6000), await boble());
  await page.screenshot({ path: `${UD}/${navn}-r5-start.png` });
  await page.click('#reaktorStart');
  tjek(`${navn}: trin effekten`, await venTil(async () => (await boble()) === 'Effekten', 4000), await boble());
  await T(() => atomlabTest.reaktor.spol(4));
  await page.waitForTimeout(1500);
  tjek(`${navn}: måleren i 3D-billedet`, await page.isVisible('#reaktorHud'));
  await page.screenshot({ path: `${UD}/${navn}-r6-effekt.png` });
  await næste();
  await page.waitForTimeout(600);
  tjek(`${navn}: trin kontrolstave`, (await boble()) === 'Kontrolstavene');
  await page.screenshot({ path: `${UD}/${navn}-r7-stave.png` });
  await næste();
  await T(() => atomlabTest.reaktor.spol(4));
  await page.waitForTimeout(1500);
  const tip = await page.textContent('#reaktorHudTip');
  console.log(navn, 'tip:', tip, '·', await T(() => atomlabTest.reaktor.mission()));
  tjek(`${navn}: levende tip`, tip.length > 5);
  await page.screenshot({ path: `${UD}/${navn}-r8-hud.png` });
  // Vis en kædereaktion
  await T(() => { atomlabTest.reaktor.nulstil(); atomlabTest.reaktor.spol(0.5); });
  await page.waitForTimeout(700);
  tjek(`${navn}: knappen Vis en kædereaktion`, (await page.isVisible('#reaktorVisMig')) && (await page.textContent('#reaktorVisMig')).includes('kædereaktion'));
  await page.click('#reaktorVisMig');
  await page.waitForTimeout(500);
  await T(() => atomlabTest.reaktor.spol(4));
  await page.waitForTimeout(1000);
  const v = await T(() => atomlabTest.reaktor.visning());
  console.log(navn, 'generationer:', JSON.stringify(v));
  tjek(`${navn}: slowmotion med generationer`, v.kæde && v.kæde.length >= 2 && v.tidsFaktor < 1, JSON.stringify(v));
  await page.screenshot({ path: `${UD}/${navn}-r9-generationer.png` });
  await T(() => atomlabTest.reaktor.spol(8));
  tjek(`${navn}: kædereaktionen i slowmotion slutter`, await venTil(async () => !(await T(() => atomlabTest.reaktor.visning())).kæde, 5000));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${UD}/${navn}-r10-efter.png` });
  const efter = await T(() => [...document.querySelectorAll('#reaktorVindue .undertekst, #beskeder .undertekst')].map((e) => e.textContent).join(' | '));
  tjek(`${navn}: forklaring bagefter`, efter.includes('vokser'), efter);
  await ctx.close();
  console.log(navn, 'konsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
  if (fejl.length) dårlig++;
}
await b.close();
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
