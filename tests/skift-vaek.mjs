// Skift hurtigt væk (Åbne punkter, 16. november 2026): Mars laver sin højdetabel i strimler med en pause imellem
// (lavTabel i js/solsystem/klippeplanet.js). Skifter man planet midt i, frigives Mars' billeder, og et ImageBitmap
// lukkes (smid i js/solsystem/hent.js). Den næste strimmel må ikke tegne det lukkede billede ("drawImage … The image
// source is detached", set i roeg ved jupiter 14. november 2026). Testen skifter fra Mars til Jupiter, mens tabellen
// laves, og igen tilbage til Mars, som skal få sin tabel.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const fejl = [];
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error') fejl.push(m.type() + ': ' + m.text()); });

await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest?.solsystem);
const forsøg = [];
for (let i = 0; i < 3; i++) {
  // Vælg Mars, vent (i små skridt mellem strimlerne) på, at højdekortet er hentet, og skift til Jupiter, før tabellen er
  // færdig. Alt i én evaluate, så siden ikke når at lave tabellen færdig imellem.
  const r = await s.evaluate(async () => {
    const t = atomlabTest.solsystem;
    t.vælg('mars');
    const slut = performance.now() + 60000;
    while (performance.now() < slut) {
      const bl = t.valgt() === 'mars' && t.fænomen()?.billeder?.();
      if (bl?.hentet.højde) {
        const midtI = !bl.tabel;
        t.vælg('jupiter');
        return { midtI };
      }
      await new Promise((r) => setTimeout(r, 0));
    }
    return { midtI: false, tid: true };
  });
  forsøg.push(r.midtI);
  // Vent et par sekunder i rigtig tid, så de strimler, der var tilbage, når at blive kørt
  await s.waitForTimeout(3000);
  await s.evaluate(() => { atomlabTest.solsystem.vælg('venus'); });
}
tjek('skiftet væk fra Mars, mens højdetabellen blev lavet (mindst én gang af tre)', forsøg.some(Boolean), JSON.stringify(forsøg));
tjek('ingen fejl i konsollen, når man skifter væk midt i højdetabellen', !fejl.length, fejl.slice(0, 3).join(' | '));

// Tilbage til Mars: højdekortet hentes igen, og tabellen bliver færdig
await s.evaluate(() => atomlabTest.solsystem.vælg('mars'));
const tabel = await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().tabel, null, { timeout: 120000, polling: 200 }).then(() => true, () => false);
tjek('Mars får sin højdetabel, når man kommer tilbage', tabel);
tjek('stadig ingen fejl i konsollen', !fejl.length, fejl.slice(0, 3).join(' | '));

await b.close();
console.log(`\n${ok} OK, ${dårlig} FEJL`);
process.exit(dårlig ? 1 : 0);
