// Stå på Mars på tablet (G1 trin 3, forslag H i docs/plan-grafik.md): Kun de stykker af landskabets net, der ses, tegnes,
// og mens dagen går, regnes skyggerne groft (halv opløsning), og skarpt igen, når tiden står stille. Ved randen ved
// Jezero (intet foto). Pc'en tjekkes i landskab.mjs.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.type() + ': ' + m.text()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="mars"]').click());
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.kort, null, { timeout: 60000, polling: 200 });
const fm = (f, a) => s.evaluate(f, a);
const stå = () => fm(() => atomlabTest.solsystem.fænomen().stå());
const hop = async () => { await fm(() => atomlabTest.solsystem.fænomen().hop()); await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { polling: 100 }); };

await fm(() => atomlabTest.solsystem.fænomen().ståPå('randen'));
await hop();
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().står, null, { timeout: 60000, polling: 200 });
await fm(() => atomlabTest.solsystem.fænomen().hop());
await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().lander && atomlabTest.solsystem.fænomen().stå().skygger === 1, null, { timeout: 30000, polling: 100 }).catch(() => {});
let t = await stå();
tjek('tablet: står ved randen, og nettet er delt i 16 stykker (testene har et mindre net)', t.står && t.sted === 'randen' && t.stykker?.[1] === 16, JSON.stringify({ sted: t.sted, net: t.net, stykker: t.stykker }));

// Kun de stykker, der ses
const tegnet = async (k, v) => {
  await fm(([k, v]) => atomlabTest.solsystem.fænomen().kig(k, v), [k, v]);
  await s.waitForTimeout(400);
  return (await stå()).stykker[0];
};
const vandret = await tegnet(90, 0);
tjek('kigger man vandret, tegnes kun nogle af stykkerne (3-7 af 16)', vandret >= 3 && vandret <= 7, String(vandret));
const andenVej = await tegnet(270, 5);
tjek('også den anden vej', andenVej >= 3 && andenVej <= 7, String(andenVej));
const ned = await tegnet(90, -85);
tjek('kigger man lodret ned, tegnes alle 16', ned === 16, String(ned));

// Skyggerne, mens dagen går
await fm(() => atomlabTest.solsystem.fænomen().kig(90, 0));
tjek('før ▶: skyggerne er skarpe', (await stå()).groveSkygger === false);
await s.click('#solsystemTid button[data-tid="spil"]');
const grove = await s.waitForFunction(() => atomlabTest.solsystem.fænomen().stå().groveSkygger, null, { timeout: 20000, polling: 100 }).then(() => true).catch(() => false);
tjek('▶ (dagen går): skyggerne regnes groft', grove);
await s.click('#solsystemTid button[data-tid="pause"]');
const skarpe = await s.waitForFunction(() => !atomlabTest.solsystem.fænomen().stå().groveSkygger, null, { timeout: 20000, polling: 100 }).then(() => true).catch(() => false);
t = await stå();
tjek('⏸: skyggerne regnes skarpt igen', skarpe && t.skygger === 1, JSON.stringify({ grove: t.groveSkygger, skygger: t.skygger }));

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
