// Mars (M2 og M3 i docs/plan-mars.md): Mars står i Solsystemet før Saturn, billederne bliver hentet, højdekortet
// vender rigtigt (Olympus Mons, Hellas og Arsia Mons på de rigtige steder), Mars drejer mod øst, bjergene kan gøres
// 10 gange højere, skyerne over vulkanerne kommer om eftermiddagen, "Modlys" sætter Solen bag Mars, og kameraets
// indstillinger bliver sat tilbage, når man går videre.
import { chromium, ADRESSE, ARGS, billedmappe } from './hjaelp.mjs';
const UD = billedmappe('mars');
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));

// Højdekortet: længdegrad 0° i midten og øst til højre (som i js/solsystem/klippeplanet.js), højder i meter
const højder = await s.evaluate(async () => {
  const { HØJDE_MIN, HØJDE_MAX } = await import('/js/kosmos/mars.js');
  const billede = new Image();
  billede.src = '/billeder/solsystem/mars-hoejde-2k.png';
  await billede.decode();
  const c = document.createElement('canvas');
  c.width = billede.width;
  c.height = billede.height;
  const g = c.getContext('2d');
  g.drawImage(billede, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  // Den højeste værdi i et lille felt omkring stedet (bredde, længde i grader øst)
  const ved = (bredde, længde, felt, fn = Math.max) => {
    const x0 = Math.round(((længde + 180) / 360) * c.width), y0 = Math.round(((90 - bredde) / 180) * c.height);
    const v = [];
    for (let y = y0 - felt; y <= y0 + felt; y++) {
      for (let x = x0 - felt; x <= x0 + felt; x++) {
        const i = (y * c.width + ((x + c.width) % c.width)) * 4;
        v.push(HØJDE_MIN + ((data[i] * 256 + data[i + 1]) / 65535) * (HØJDE_MAX - HØJDE_MIN));
      }
    }
    return fn(...v);
  };
  return {
    olympus: ved(18.65, -133.8, 3),
    arsia: ved(-8.3, -120.1, 3),
    hellas: ved(-42.4, 70.5, 30, Math.min), // bunden ligger i den vestlige del af bassinet
    elysium: ved(25, 147, 3),
  };
});
tjek('højdekortet: Olympus Mons (18,65° N, 133,8° V) er over 20 km', højder.olympus > 20000, JSON.stringify(højder));
tjek('højdekortet: Arsia Mons er over 15 km, og Elysium Mons over 10 km', højder.arsia > 15000 && højder.elysium > 10000);
tjek('højdekortet: bunden af Hellas er under −7 km', højder.hellas < -7000, højder.hellas);

// Mars står efter Jorden og før Saturn i Solsystemet
const ids = await s.evaluate(() => atomlabTest.solsystem.fænomener);
tjek('Mars står efter Formørkelser (Jorden) og før Saturn', ids.indexOf('mars') === ids.indexOf('formoerkelser') + 1 && ids.indexOf('saturn') === ids.indexOf('mars') + 1, JSON.stringify(ids));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen()?.billeder().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 30000 });
const billeder = await s.evaluate(() => atomlabTest.solsystem.fænomen().billeder());
tjek('billederne er hentet (2k i tests)', billeder.kort === '2k' && billeder.højde === '2k', JSON.stringify(billeder));
const knapper = await s.evaluate(() => [...document.querySelectorAll('#solsystemStyring button')].map((k) => k.textContent.trim()));
tjek('knapperne "Drej Mars", "Bjergene 10 gange højere" og "Modlys"', knapper.some((k) => k.includes('Drej Mars')) && knapper.some((k) => k.includes('Bjergene 10 gange højere')) && knapper.some((k) => k.includes('Modlys')), JSON.stringify(knapper));
tjek('sort himmel (ingen tågeskyer)', !(await s.evaluate(() => atomlabTest.solsystem.tåger())));
const tekst = await s.textContent('#solsystemTekst');
tjek('"Kort fortalt" fortæller om Olympus Mons og Valles Marineris', /Olympus Mons/.test(tekst) && /Valles Marineris/.test(tekst));
tjek('forklaringen: rigtige højder', /rigtige højde/.test(await s.textContent('#solsystemForklaring')));
const kamera = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return { near: verden.kamera.near }; });
tjek('kameraet kan komme helt tæt på overfladen', kamera.near <= 0.01, JSON.stringify(kamera));
await s.waitForTimeout(1500);
await s.screenshot({ path: UD + '/1-mars.png' });

// Mars drejer mod øst (rotation.y vokser: mod uret set fra nord, ligesom Jorden)
const d0 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForFunction((d) => atomlabTest.solsystem.fænomen().drejning() > d + 0.01, d0, { timeout: 15000 }).catch(() => {});
const d1 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
tjek('Mars drejer mod øst (mod uret set fra nord)', d1 > d0, JSON.stringify([d0, d1]));
await s.click('#solsystemStyring button:has-text("Drej Mars")');
const d2 = await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning());
await s.waitForTimeout(800);
tjek('"Drej Mars" slået fra: Mars står stille', (await s.evaluate(() => atomlabTest.solsystem.fænomen().drejning())) === d2);

// Bjergene 10 gange højere og tilbage igen
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 10, null, { timeout: 20000 }).catch(() => {});
tjek('bjergene bliver 10 gange højere', (await s.evaluate(() => atomlabTest.solsystem.fænomen().overdriv())) === 10);
tjek('forklaringen skifter til de høje bjerge', /10 gange højere/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/2-mars-x10.png' });
await s.click('#solsystemStyring button:has-text("Bjergene")');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().overdriv() === 1, null, { timeout: 20000 }).catch(() => {});
tjek('og tilbage til de rigtige højder', (await s.evaluate(() => atomlabTest.solsystem.fænomen().overdriv())) === 1);

// M3: luften, skyerne og modlys
// Skyernes lokale tid: middag under Solen, aften 90° mod øst, morgen 90° mod vest. Skyerne kommer kun om eftermiddagen.
const ur = await s.evaluate(async () => {
  const { lokalTid, eftermiddag, retning } = await import('/js/solsystem/skyer.js');
  const sol = retning(0, 0);
  return {
    middag: lokalTid(retning(0, 0), sol), aften: lokalTid(retning(0, 90), sol), morgen: lokalTid(retning(0, -90), sol),
    kl8: eftermiddag(8), kl15: eftermiddag(15), kl2: eftermiddag(2),
  };
});
tjek('skyernes ur: middag under Solen, aften mod øst og morgen mod vest', Math.abs(ur.middag - 12) < 0.01 && Math.abs(ur.aften - 18) < 0.01 && Math.abs(ur.morgen - 6) < 0.01, JSON.stringify(ur));
tjek('skyerne kommer om eftermiddagen (kl. 15), ikke kl. 8 eller kl. 2 om natten', ur.kl15 > 0.9 && ur.kl8 === 0 && ur.kl2 === 0, JSON.stringify(ur));
const sky = await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer());
tjek('skyer ved Olympus Mons, Tharsis-vulkanerne, Alba Mons og Elysium Mons', sky.length === 6 && sky[0].navn === 'Olympus Mons', JSON.stringify(sky.map((x) => x.navn)));
// Drej Mars hele vejen rundt: Olympus Mons har sky om eftermiddagen og ingen om morgenen
const rundt = [];
for (let l = 0; l < 360; l += 30) {
  await s.evaluate((l) => atomlabTest.solsystem.fænomen().vend(l), l);
  await s.waitForTimeout(250);
  rundt.push((await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0]);
}
tjek('Olympus Mons: sky om eftermiddagen og ingen om morgenen',
  rundt.every((x) => (x.tid > 10.5 && x.tid < 21.5) || x.mængde === 0) && rundt.some((x) => x.mængde > 0.5) && rundt.some((x) => x.tid < 10 && x.mængde === 0),
  JSON.stringify(rundt.map((x) => [x.tid.toFixed(1), x.mængde.toFixed(2)])));
// Mars drejer mod øst, så klokken går fremad ved Olympus Mons
await s.click('#solsystemStyring button:has-text("Drej Mars")');
const t0 = (await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0].tid;
await s.waitForFunction((t0) => { const t = atomlabTest.solsystem.fænomen().skyer()[0].tid; return Math.abs(t - t0) > 0.05; }, t0, { timeout: 15000 }).catch(() => {});
const t1 = (await s.evaluate(() => atomlabTest.solsystem.fænomen().skyer()))[0].tid;
tjek('klokken går fremad ved Olympus Mons, når Mars drejer', ((t1 - t0 + 24) % 24) > 0 && ((t1 - t0 + 24) % 24) < 6, JSON.stringify([t0, t1]));
await s.click('#solsystemStyring button:has-text("Drej Mars")');

// Modlys: Solen står bag Mars, set fra kameraet, og tilbage igen
tjek('dagslys: Solen står ikke bag Mars', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) > -0.5);
await s.click('#solsystemStyring button:has-text("Modlys")');
await s.waitForTimeout(300);
tjek('"Modlys": Solen står bag Mars', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) < -0.9);
tjek('forklaringen fortæller om modlys', /Modlys/.test(await s.textContent('#solsystemForklaring')));
await s.screenshot({ path: UD + '/3-modlys.png' });
await s.click('#solsystemStyring button:has-text("Modlys")');
await s.waitForTimeout(300);
tjek('"Modlys" slået fra: Solen er tilbage', (await s.evaluate(() => atomlabTest.solsystem.fænomen().sol())) > -0.5);
const tekster = (await s.textContent('#solsystemTekst'));
tjek('"Kort fortalt" fortæller om polkapperne og skyerne', /Polkapperne/.test(tekster) && /skyer af is/.test(tekster));

// Videre til et andet fænomen: kameraets indstillinger er sat tilbage
await s.click('#solsystem .kosmos-valg[data-id="aarstider"]');
await s.waitForTimeout(500);
const efter = await s.evaluate(async () => { const { verden } = await import('/js/scene3d.js'); return { near: verden.kamera.near, zoom: verden.styring.zoomSpeed, drej: verden.styring.rotateSpeed }; });
tjek('efter Mars: kameraets near, zoom og drejning er sat tilbage', efter.near === 0.1 && efter.zoom === 1 && efter.drej === 1, JSON.stringify(efter));

await b.close();
console.log('\nKonsol:', fejl.length ? fejl.join('\n') : 'ingen fejl');
console.log(`${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig || fejl.length ? 1 : 0);
