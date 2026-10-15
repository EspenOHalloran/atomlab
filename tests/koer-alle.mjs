// Kører testene efter hinanden (aldrig flere på én gang, så bliver de ustabile) og samler resultatet.
// Brug: node tests/koer-alle.mjs            (alle)
//       node tests/koer-alle.mjs pause guide (kun de nævnte)
// Kører der ikke allerede en server på ADRESSE, startes en med Python i projektmappen.
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ADRESSE = process.env.ADRESSE ?? 'http://localhost:8765'; // samme standard som i hjaelp.mjs
const MAPPE = fileURLToPath(new URL('.', import.meta.url));
const PROJEKT = fileURLToPath(new URL('..', import.meta.url));
const ALLE = [
  'vaerksted', 'henfald', 'system', 'system-mobil', 'stjerneovn', 'stjerneovn-mus', 'reaktor',
  'batteri', 'kosmos', 'beskeder', 'beskeder-2', 'guide', 'pause', 'fuldskaerm',
];
const valgte = process.argv.length > 2 ? process.argv.slice(2) : ALLE;

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

const start = Date.now();
const dumpede = [];
for (const navn of valgte) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [`${MAPPE}${navn}.mjs`], { encoding: 'utf8', timeout: 10 * 60 * 1000 });
  const ud = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const linjer = ud.split('\n');
  const tal = [...linjer].reverse().find((l) => /\d+ OK, \d+ (FEJL|fejl)/.test(l))?.trim() ?? '';
  const ok = r.status === 0;
  console.log(`${ok ? 'OK  ' : 'FEJL'} ${navn.padEnd(15)} ${tal.padEnd(16)} ${Math.round((Date.now() - t0) / 1000)} s`);
  if (!ok) {
    dumpede.push(navn);
    const fejl = linjer.filter((l) => /^FEJL|pageerror|error|Error/.test(l));
    console.log((fejl.length ? fejl : linjer.slice(-15)).slice(0, 15).map((l) => `     ${l}`).join('\n'));
  }
}
server?.kill();
const minutter = ((Date.now() - start) / 60000).toFixed(1);
console.log(dumpede.length ? `\n${dumpede.length} af ${valgte.length} fejlede: ${dumpede.join(', ')} (${minutter} min)` : `\nAlle ${valgte.length} bestod (${minutter} min)`);
process.exit(dumpede.length ? 1 : 0);
