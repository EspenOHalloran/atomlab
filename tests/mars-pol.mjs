// Mars, Nordpolen tæt på (M7b-pol, docs/plan-mars.md): polarnettet over kappen. Kortene hentes først ved stedet, nettet
// glider over i kuglen ved kanten (78° N) uden spring i højderne, højdetabellen kender isen (kløfterne og Chasma Boreale),
// kameraet holdes over isen, Solen står over horisonten (midnatssol), og kortene frigives, når man forlader Mars.
import { chromium, ADRESSE, ARGS } from './hjaelp.mjs';
const fejl = []; let ok = 0, dårlig = 0;
const tjek = (navn, bet, ekstra = '') => { if (bet) { ok++; console.log('OK  ', navn); } else { dårlig++; console.log('FEJL', navn, ekstra); } };

const b = await chromium.launch({ args: ARGS });
const s = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
s.on('pageerror', (e) => fejl.push('pageerror: ' + e.message));
s.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fejl.push(m.type() + ': ' + m.text()); });
const hentede = [];
s.on('request', (r) => { if (r.url().includes('/billeder/')) hentede.push(r.url().split('/').pop()); });
await s.goto(`${ADRESSE}/?test#solsystem`);
await s.waitForFunction(() => window.atomlabTest && document.querySelector('#solsystem:not(.skjult)'));
await s.click('#solsystem .kosmos-valg[data-id="mars"]');
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'mars' && atomlabTest.solsystem.fænomen()?.billeder?.().hentet.højde && atomlabTest.solsystem.fænomen().billeder().hentet.kort, null, { timeout: 60000, polling: 200 });
await s.waitForFunction(() => atomlabTest.solsystem.knapper().includes('▶ Start flyby'), null, { timeout: 60000, polling: 200 });
const fm = (u, a) => s.evaluate(u, a);
const ventFremme = () => s.waitForFunction(() => !atomlabTest.solsystem.fænomen().tur().flyver, null, { timeout: 120000, polling: 100 });

tjek('Nordpolens kort hentes ikke, når Mars åbnes', !hentede.some((n) => n.includes('nordpol')), JSON.stringify(hentede.filter((n) => n.includes('nordpol'))));

await fm(() => atomlabTest.solsystem.gåTil('nordpol'));
await s.waitForFunction(() => { const l = atomlabTest.solsystem.fænomen().billeder().lokalt.nordpol; return l.hentet.højde && l.hentet.kort && l.tabel; }, null, { timeout: 60000, polling: 200 });
await fm(() => atomlabTest.solsystem.fænomen().hop());
await ventFremme();
await s.waitForTimeout(300);
const billeder = await fm(() => atomlabTest.solsystem.fænomen().billeder().lokalt);
const klare = Object.entries(billeder).filter(([, l]) => l.klar).map(([id]) => id);
tjek('ved Nordpolen: polarnettets kort er hentet (1k i testene), og kun polarnettet tegnes', klare.length === 1 && klare[0] === 'nordpol' && hentede.includes('mars-nordpol-hoejde-1k.webp') && hentede.includes('mars-nordpol-farve-1k.jpg'), JSON.stringify({ klare, hentede: hentede.filter((n) => n.includes('nordpol')) }));

// Højderne hen over nettets kant (78° N): Ved kanten bruges kuglens kort, og indenfor glider det over i polkortet uden spring.
// Trin på 0,02° (ca. 1,2 km) ved 12 længder.
const kant = await fm(() => {
  const t = atomlabTest.solsystem.fænomen();
  let spring = 0, ved = 0;
  for (let l = 0; l < 360; l += 30) {
    let før = t.højde(77.9, l);
    for (let bb = 77.92; bb <= 78.5; bb += 0.02) { const h = t.højde(bb, l); spring = Math.max(spring, Math.abs(h - før)); før = h; }
    ved = Math.max(ved, Math.abs(t.højde(78.0, l) - t.højde(77.97, l)));
  }
  return { spring, ved };
});
tjek('nettet slutter tæt til kuglen: ingen spring i højderne hen over kanten ved 78° N', kant.spring < 0.15 && kant.ved < 0.1, JSON.stringify(kant));

// Højdetabellen bruger polkortet: toppen ca. −2,6 km, sletten ved 79° N under −4 km, Chasma Boreale (84,1° N, 319° Ø)
// mindst 1,2 km under kappen ved siden af (målt i MOLA: ca. 1,8 km)
const h = await fm(() => { const t = atomlabTest.solsystem.fænomen(); return { top: t.højde(89.9, 0), slette: t.højde(79, 200), chasma: t.højde(84.1, 319.4), kappe: t.højde(84.1, 300) }; });
tjek('højdetabellen kender isen: toppen, sletten og Chasma Boreale', h.top > -2.8 && h.top < -2.3 && h.slette < -4 && h.kappe - h.chasma > 1.2, JSON.stringify(h));

const ved = await fm(() => atomlabTest.solsystem.fænomen().vedSted('nordpol'));
tjek('stoppet: kameraet står højt over isen og ser skråt ned (300-2.000 km, 20-45°)', ved.overJorden > 300 && ved.overJorden < 2000 && ved.vinkel > 20 && ved.vinkel < 45, JSON.stringify({ over: ved.overJorden, vinkel: ved.vinkel }));
tjek('midnatssol: Solen står 22-28° over horisonten', ved.solHøjde > 22 && ved.solHøjde < 28.5, String(ved.solHøjde));

// Helt ned i Chasma Boreale: Kameraet holdes mindst ca. 2 km over isen (bund), også når det bedes om 0,3 km
await fm(() => atomlabTest.solsystem.fænomen().kigPå(84.1, 319.4, 0.3, 5, 0));
await s.waitForTimeout(500);
const lavt = await fm(() => atomlabTest.solsystem.fænomen().vedSted('nordpol').overJorden);
tjek('kameraet holdes over isen i Chasma Boreale (mindst ca. 2 km)', lavt > 1.8, String(lavt));
await fm(() => atomlabTest.solsystem.fænomen().kigPå(89.5, 0, 0.3, 5, 0));
await s.waitForTimeout(500);
const lavtPol = await fm(() => atomlabTest.solsystem.fænomen().vedSted('nordpol').overJorden);
tjek('kameraet holdes over isen ved polen (mindst ca. 2 km)', lavtPol > 1.8, String(lavtPol));

// Mars forlades: Nordpolens kort er slettet fra lageret
await s.evaluate(() => document.querySelector('#solsystem .kosmos-valg[data-id="saturn"]').click());
await s.waitForFunction(() => atomlabTest.solsystem.valgt() === 'saturn', null, { timeout: 20000, polling: 100 });
await s.waitForTimeout(500);
const lager = await s.evaluate(async () => [...(await import('/js/solsystem/hent.js')).lager].filter(([, x]) => x.tekstur).map(([n]) => n));
tjek('Mars forladt: Nordpolens kort er frigivet', !lager.some((n) => n.includes('nordpol')), JSON.stringify(lager));

tjek('ingen fejl i konsollen', fejl.length === 0, fejl.join('\n'));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
