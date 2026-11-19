// Billeder af Månen med fuld grafik: skyggegrænsen med de skarpe højder (4k på pc) og "Lys på hele Månen".
// Kør: node tests/vaerktoejer/maanen-lys.mjs  (billederne lægges i tests/billeder/maanen-lys/)
import { chromium, ADRESSE, ARGS, billedmappe } from '../hjaelp.mjs';
const UD = billedmappe('maanen-lys');
const b = await chromium.launch({ args: ARGS, fuldGrafik: true });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const fejl = [];
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest?.solsystem);
await s.evaluate(() => atomlabTest.solsystem.vælg('jorden'));
await s.waitForTimeout(3000);
const f = (kode) => s.evaluate(`atomlabTest.solsystem.fænomen().${kode}`);
await f(`sætTid(${Date.parse('2026-11-17T18:00Z')})`); // ca. første kvarter: skyggegrænsen går midt over forsiden
await s.click('#solsystemTid button[data-tid="pause"]');
await s.click('#solsystemTræ button[data-sted="månen"]');
await f('hop()');
await s.waitForFunction(() => atomlabTest.solsystem.fænomen().ditLys().højde >= 4096, null, { timeout: 30000 }).catch(() => {});
console.log('højdekort', JSON.stringify(await f('ditLys()')));
await s.waitForTimeout(2500);
await s.screenshot({ path: `${UD}/1-maanen.png` });
// Drej kameraet, så skyggegrænsen ses fra siden
const træk = async (dx, dy) => { await s.mouse.move(640, 400); await s.mouse.down(); await s.mouse.move(640 + dx, 400 + dy, { steps: 20 }); await s.mouse.up(); await s.waitForTimeout(1500); };
await træk(-260, 0);
await s.screenshot({ path: `${UD}/2-skyggegraensen.png` });
await træk(-500, 0);
await s.screenshot({ path: `${UD}/3-natsiden.png` });
await s.click('#solsystemStyr .kontakt:has-text("Lys på hele Månen")');
await s.waitForTimeout(1200);
await s.screenshot({ path: `${UD}/4-lys-paa-hele.png` });
await træk(-600, 0);
await s.screenshot({ path: `${UD}/5-lys-andet-sted.png` });
console.log(fejl.length ? fejl.join(' | ') : 'ingen fejl');
await b.close();
