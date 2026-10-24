// Kører testene, to ad gangen, og samler resultatet. Fejler en test, køres den igen alene bagefter, og det bliver skrevet
// tydeligt, så en sjælden fejl ikke bliver gemt væk (den kan være ægte, se docs/erfaringer.md).
// Brug: node tests/koer-alle.mjs            (alle)
//       node tests/koer-alle.mjs --samtidig=1 (én ad gangen, som før)
//       node tests/koer-alle.mjs pause guide (kun de nævnte)
//       node tests/koer-alle.mjs --ændret    (kun dem, de ændrede filer kan påvirke, se vælgÆndrede)
//       node tests/koer-alle.mjs --ændret --vis [filer]  (vis kun, hvilke tests der ville blive valgt, evt. for de nævnte filer)
// Kører der ikke allerede en server på ADRESSE, startes en med Python i projektmappen.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ADRESSE = process.env.ADRESSE ?? 'http://localhost:8765'; // samme standard som i hjaelp.mjs
const MAPPE = fileURLToPath(new URL('.', import.meta.url));
const PROJEKT = fileURLToPath(new URL('..', import.meta.url));
const ALLE = [
  'henfaldsregler', 'orbitaler', 'vaerksted', 'henfald', 'system', 'system-mobil', 'stjerneovn', 'stjerneovn-mus', 'reaktor',
  'batteri', 'kosmos', 'kosmos-nye', 'aarstider', 'formoerkelser', 'kategorier', 'ordforklaring', 'beskeder', 'beskeder-2', 'guide', 'lag', 'pause', 'fuldskaerm', 'grafik', 'saturn', 'mars',
];
const argumenter = process.argv.slice(2);
const filArg = argumenter.filter((a) => !a.startsWith('--') && (a.includes('/') || a.includes('.')));
const navne = argumenter.filter((a) => !a.startsWith('--'));
const valgte = argumenter.includes('--ændret') ? vælgÆndrede(filArg.length ? filArg : null) : navne.length ? navne : ALLE;
if (argumenter.includes('--vis')) process.exit(0);
if (!valgte.length) {
  console.log('Ingen ændrede filer, som testene afprøver.');
  process.exit(0);
}

// Finder de tests, som de ændrede filer (i forhold til GitHub, og nye filer) kan påvirke:
// - en ændret test køres selv
// - en ændret fil i js/ følges gennem import-linjerne op til skærmene (fx atom.js → vaerksted.js, system.js …),
//   og så køres de tests, der besøger skærmen (#vaerksted, #fusion …), og tests med samme navn som et fælles modul
// - index.html, style.css, main.js, scene3d.js, three.js og testhjælperen påvirker alt, så så køres alle
// Hele samlingen skal stadig køres, før et stykke arbejde er færdigt.
function vælgÆndrede(givne) {
  const git = (...a) => spawnSync('git', a, { cwd: PROJEKT, encoding: 'utf8' });
  const mod = git('rev-parse', '--verify', '--quiet', '@{upstream}').status === 0 ? '@{upstream}' : 'HEAD';
  const filer = givne ?? [...new Set([
    ...git('diff', '--name-only', mod).stdout.split('\n'),
    ...git('ls-files', '--others', '--exclude-standard').stdout.split('\n'),
  ].filter(Boolean))];
  const ALT = /^(index\.html|style\.css|js\/main\.js|js\/scene3d\.js|lib\/|tests\/hjaelp\.mjs|tests\/koer-alle\.mjs)/;
  const altFil = filer.find((f) => ALT.test(f));
  if (altFil) {
    console.log(`${altFil} er ændret og påvirker alt, så alle tests køres.`);
    return ALLE;
  }
  // Hvem importerer hvem (js/…)
  const jsFiler = ['js', 'js/data', 'js/kosmos', 'js/solsystem'].flatMap((m) => readdirSync(PROJEKT + m).filter((f) => f.endsWith('.js')).map((f) => `${m}/${f}`));
  const importører = new Map(jsFiler.map((f) => [f, []]));
  for (const f of jsFiler) {
    for (const [, sti] of readFileSync(PROJEKT + f, 'utf8').matchAll(/from '(\.[^']+)'/g)) {
      const mål = new URL(sti, `file:///${f}`).pathname.slice(1);
      importører.get(mål)?.push(f);
    }
  }
  const SKÆRME = { 'js/vaerksted.js': 'vaerksted', 'js/system.js': 'system', 'js/fusion.js': 'fusion', 'js/reaktor.js': 'reaktor', 'js/batteri.js': 'batteri', 'js/kosmos.js': 'kosmos' };
  const EGEN_TEST = {
    'js/beskeder.js': ['beskeder', 'beskeder-2'], 'js/guide.js': ['guide'], 'js/pause.js': ['pause'], 'js/fuldskaerm.js': ['fuldskaerm'],
    'js/ordforklaring.js': ['ordforklaring'], 'js/data/ordbog.js': ['ordforklaring'], 'js/data/isotoper.js': ['henfaldsregler'], 'js/data/orbitaler.js': ['orbitaler'], 'js/lag.js': ['lag'], 'js/paneler.js': ['lag'], 'js/data/hvorfor.js': ['lag'], 'js/data/kategorier.js': ['kategorier'], 'js/kosmos/saturn.js': ['saturn'], 'js/kosmos/mars.js': ['mars'],
  };
  const besøger = Object.fromEntries(ALLE.map((t) => [t, readFileSync(`${MAPPE}${t}.mjs`, 'utf8')]));
  const tests = new Set();
  for (const f of filer) {
    const test = f.match(/^tests\/([\w-]+)\.mjs$/)?.[1];
    if (ALLE.includes(test)) tests.add(test);
    if (!importører.has(f)) continue;
    // Filen selv og alle, der (gennem andre) importerer den
    const berørt = new Set([f]);
    for (const m of berørt) for (const i of importører.get(m) ?? []) if (i !== 'js/main.js') berørt.add(i);
    for (const m of berørt) {
      for (const t of EGEN_TEST[m] ?? []) tests.add(t);
      if (SKÆRME[m]) for (const t of ALLE) if (besøger[t].includes(`#${SKÆRME[m]}`)) tests.add(t);
    }
  }
  const valgt = ALLE.filter((t) => tests.has(t));
  console.log(`Ændrede filer: ${filer.join(', ') || 'ingen'}\nTests: ${valgt.join(', ') || 'ingen'}\n`);
  return valgt;
}

async function serverSvarer() {
  try {
    return (await fetch(ADRESSE)).ok;
  } catch {
    return false;
  }
}

let server = null;
if (!(await serverSvarer())) {
  const port = new URL(ADRESSE).port || '80';
  for (const python of ['python3', 'python']) {
    const p = spawn(python, ['-m', 'http.server', port], { cwd: PROJEKT, stdio: 'ignore' });
    p.on('error', () => {});
    for (let i = 0; i < 20 && !(await serverSvarer()); i++) await new Promise((r) => setTimeout(r, 250));
    if (await serverSvarer()) {
      server = p;
      break;
    }
    p.kill();
  }
  if (!server) {
    console.error(`Ingen server på ${ADRESSE}, og den kunne ikke startes. Start den selv: python -m http.server 8765`);
    process.exit(1);
  }
}

// Kør én test og vent på den (uden at stoppe de andre, hvis der køres flere ad gangen)
function kørTest(navn) {
  return new Promise((færdig) => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [`${MAPPE}${navn}.mjs`]);
    let ud = '';
    p.stdout.on('data', (d) => { ud += d; });
    p.stderr.on('data', (d) => { ud += d; });
    const stop = setTimeout(() => p.kill(), 10 * 60 * 1000);
    p.on('close', (kode) => {
      clearTimeout(stop);
      færdig({ navn, ok: kode === 0, linjer: ud.split('\n'), sek: Math.round((Date.now() - t0) / 1000) });
    });
  });
}

const start = Date.now();
const dumpede = [];
const samtidig = Number(argumenter.find((a) => a.startsWith('--samtidig='))?.split('=')[1] ?? 2);
const kø = [...valgte];
async function arbejder() {
  while (kø.length) {
    const { navn, ok, linjer, sek } = await kørTest(kø.shift());
    const tal = [...linjer].reverse().find((l) => /\d+ OK, \d+ (FEJL|fejl)/.test(l))?.trim() ?? '';
    console.log(`${ok ? 'OK  ' : 'FEJL'} ${navn.padEnd(15)} ${tal.padEnd(16)} ${sek} s`);
    if (!ok) {
      dumpede.push(navn);
      const fejl = linjer.filter((l) => /^FEJL|pageerror|error|Error/.test(l));
      console.log((fejl.length ? fejl : linjer.slice(-15)).slice(0, 15).map((l) => `     ${l}`).join('\n'));
    }
  }
}
await Promise.all(Array.from({ length: samtidig }, arbejder));
// Fejlede noget, mens to kørte samtidig, så kør det igen alene
const alene = [];
if (samtidig > 1 && dumpede.length) {
  console.log('\nKører de fejlede tests igen, én ad gangen:');
  for (const navn of [...dumpede]) {
    const { ok, linjer, sek } = await kørTest(navn);
    const tal = [...linjer].reverse().find((l) => /\d+ OK, \d+ (FEJL|fejl)/.test(l))?.trim() ?? '';
    console.log(`${ok ? 'OK  ' : 'FEJL'} ${navn.padEnd(15)} ${tal.padEnd(16)} ${sek} s (alene)`);
    if (ok) { alene.push(navn); dumpede.splice(dumpede.indexOf(navn), 1); }
  }
}
server?.kill();
const minutter = ((Date.now() - start) / 60000).toFixed(1);
console.log(dumpede.length ? `\n${dumpede.length} af ${valgte.length} fejlede: ${dumpede.join(', ')} (${minutter} min)` : `\nAlle ${valgte.length} bestod (${minutter} min)`);
if (alene.length) console.log(`OBS: ${alene.join(', ')} fejlede sammen med en anden test, men bestod alene. Undersøg det, før det kaldes ustabilt.`);
process.exit(dumpede.length ? 1 : 0);
