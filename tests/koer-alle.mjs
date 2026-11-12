// Kører testene, to ad gangen, og samler resultatet. Fejler en test, køres den igen alene bagefter, og det bliver skrevet
// tydeligt, så en sjælden fejl ikke bliver gemt væk (den kan være ægte, se docs/erfaringer.md).
// Brug: node tests/koer-alle.mjs            (alle)
//       node tests/koer-alle.mjs --samtidig=1 (én ad gangen, som før)
//       node tests/koer-alle.mjs pause guide (kun de nævnte)
//       node tests/koer-alle.mjs --ændret    (røgtesten og de tests, de ændrede filer kan påvirke, se vælgÆndrede)
//       node tests/koer-alle.mjs --ændret --vis [filer]  (vis kun, hvilke tests der ville blive valgt, evt. for de nævnte filer)
// Kører der ikke allerede en server på ADRESSE, startes en med Python i projektmappen.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ADRESSE = process.env.ADRESSE ?? 'http://localhost:8765'; // samme standard som i hjaelp.mjs
const MAPPE = fileURLToPath(new URL('.', import.meta.url));
const PROJEKT = fileURLToPath(new URL('..', import.meta.url));
const ALLE = [
  'roeg', 'henfaldsregler', 'orbitaler', 'sorthul', 'molekyler', 'vaerksted', 'byttebors', 'byg-molekyler', 'henfald', 'system', 'system-mobil', 'stjerneovn', 'stjerneovn-mus', 'reaktor',
  'batteri', 'liv', 'kosmos', 'kosmos-nye', 'aarstider', 'formoerkelser', 'kategorier', 'ordforklaring', 'ordbog', 'beskeder', 'beskeder-2', 'guide', 'lag', 'pause', 'fuldskaerm', 'grafik', 'saturn', 'jupiter', 'isgiganter', 'venus', 'mars', 'landskab', 'solsystem', 'jorden', 'henter', 'karrusel', 'tid', 'tidhvorfor', 'skaermliste', 'forloeb',
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

// Finder de tests, som de ændrede filer (i forhold til main, og nye filer) kan påvirke. Røgtesten køres altid.
// - en ændret test køres selv
// - en ændret fil i js/ følges gennem import-linjerne op til skærmene (fx atom.js → vaerksted.js, system.js …),
//   og så køres de tests, der besøger skærmen (#vaerksted, #fusion …), og tests med samme navn som et fælles modul
// - index.html og style.css: kun de skærme, de ændrede linjer hører til (se skærmeForLinjer). Kan en linje ikke
//   føres tilbage til én eller få skærme (fx <head>, en dialog eller en regel for .knap), køres alle
// - main.js, scene3d.js, three.js og testhjælperen påvirker alt, så så køres alle
// Hele samlingen køres kun som afslutning på en serie, og når fælles moduler eller data er ændret (CLAUDE.md).
function vælgÆndrede(givne) {
  const git = (...a) => spawnSync('git', a, { cwd: PROJEKT, encoding: 'utf8' });
  // Sammenlign med det sted, grenen gik ud fra main (også når grenen er pushet eller ikke har nogen upstream)
  const base = git('merge-base', 'HEAD', 'origin/main');
  const mod = base.status === 0 ? base.stdout.trim()
    : git('rev-parse', '--verify', '--quiet', '@{upstream}').status === 0 ? '@{upstream}' : 'HEAD';
  const filer = givne ?? [...new Set([
    ...git('diff', '--name-only', mod).stdout.split('\n'),
    ...git('ls-files', '--others', '--exclude-standard').stdout.split('\n'),
  ].filter(Boolean))];
  const ALT = /^(js\/main\.js|js\/scene3d\.js|lib\/|tests\/hjaelp\.mjs)/;
  const altFil = filer.find((f) => ALT.test(f));
  if (altFil) {
    console.log(`${altFil} er ændret og påvirker alt, så alle tests køres.`);
    return ALLE;
  }
  // Kun dokumenter ændret: ingen tests
  if (!filer.some((f) => /^(js\/|tests\/|lib\/|billeder\/|index\.html|style\.css)/.test(f))) {
    console.log(`Ændrede filer: ${filer.join(', ') || 'ingen'}\nIngen af dem er kode.`);
    return [];
  }
  // Hvem importerer hvem (js/…)
  const jsFiler = ['js', 'js/data', 'js/kosmos', 'js/solsystem', 'js/liv', 'js/data/liv', 'js/data/forloeb'].flatMap((m) => readdirSync(PROJEKT + m).filter((f) => f.endsWith('.js')).map((f) => `${m}/${f}`));
  const importører = new Map(jsFiler.map((f) => [f, []]));
  for (const f of jsFiler) {
    for (const [, sti] of readFileSync(PROJEKT + f, 'utf8').matchAll(/from '(\.[^']+)'/g)) {
      const mål = new URL(sti, `file:///${f}`).pathname.slice(1);
      importører.get(mål)?.push(f);
    }
  }
  const SKÆRME = { 'js/vaerksted.js': 'vaerksted', 'js/system.js': 'system', 'js/fusion.js': 'fusion', 'js/reaktor.js': 'reaktor', 'js/batteri.js': 'batteri', 'js/liv.js': 'liv', 'js/kosmos.js': 'kosmos', 'js/solsystem.js': 'solsystem' };
  const EGEN_TEST = {
    'js/skaerme.js': ['skaermliste', 'karrusel', 'henter'], 'js/forloeb.js': ['forloeb'], 'js/fremgang.js': ['forloeb', 'karrusel'], 'js/gaa.js': ['skaermliste', 'ordbog'], 'js/data/faenomener.js': ['skaermliste', 'karrusel'], 'js/data/opgaver.js': ['karrusel'],
    'js/beskeder.js': ['beskeder', 'beskeder-2'], 'js/guide.js': ['guide'], 'js/pause.js': ['pause'], 'js/fuldskaerm.js': ['fuldskaerm'],
    'js/ordforklaring.js': ['ordforklaring'], 'js/data/ordbog.js': ['ordforklaring', 'ordbog'], 'js/data/ordbogliste.js': ['ordbog'], 'js/ordbog.js': ['ordbog'], 'js/data/isotoper.js': ['henfaldsregler'], 'js/data/orbitaler.js': ['orbitaler'], 'js/data/sorthul.js': ['sorthul'], 'js/data/molekyler.js': ['molekyler', 'byttebors'], 'js/molekyle3d.js': ['byttebors', 'byg-molekyler'], 'js/data/molekyler-byg.js': ['molekyler', 'byg-molekyler'], 'js/molekyler-byg.js': ['byg-molekyler'], 'js/lag.js': ['lag'], 'js/paneler.js': ['lag'], 'js/data/hvorfor.js': ['lag'], 'js/data/kategorier.js': ['kategorier'], 'js/kosmos/saturn.js': ['saturn'], 'js/kosmos/jupiter.js': ['jupiter'], 'js/data/sider/jupiter.js': ['jupiter'], 'js/solsystem/isgigant.js': ['isgiganter'], 'js/kosmos/uranus.js': ['isgiganter'], 'js/kosmos/neptun.js': ['isgiganter'], 'js/data/isgiganter.js': ['isgiganter', 'venus'], 'js/kosmos/venus.js': ['venus'], 'js/data/venus.js': ['venus'], 'js/data/sider/venus.js': ['venus'], 'js/solsystem/klippeplanet.js': ['mars', 'landskab', 'venus'], 'js/data/vinde-isgiganter.js': ['isgiganter'], 'js/data/ringe-uranus.js': ['isgiganter'], 'js/data/sider/uranus.js': ['isgiganter'], 'js/data/sider/neptun.js': ['isgiganter'], 'js/solsystem/planet.js': ['saturn', 'jupiter', 'isgiganter'], 'js/solsystem/hent.js': ['saturn', 'jupiter', 'isgiganter', 'venus', 'mars', 'landskab'], 'js/kosmos/mars.js': ['mars', 'landskab'], 'js/solsystem/landskab.js': ['landskab'], 'js/kosmos/jordkloden.js': ['jorden'], 'js/kosmos/solen.js': ['jorden'], 'js/data/himmel.js': ['jorden'], 'js/kosmos/tid.js': ['tid', 'tidhvorfor'], 'js/data/tid.js': ['tid', 'tidhvorfor'], 'js/kosmos/tidhvorfor.js': ['tidhvorfor'], 'js/kosmos/lysur.js': ['tid', 'tidhvorfor'],
  };
  const besøger = Object.fromEntries(ALLE.map((t) => [t, readFileSync(`${MAPPE}${t}.mjs`, 'utf8')]));
  const tests = new Set(['roeg']);
  const testsForSkærm = (s) => {
    for (const t of ALLE) if (besøger[t].includes(`#${s}`)) tests.add(t);
    for (const t of { menu: ['karrusel'], ordbog: ['ordbog'] }[s] ?? []) tests.add(t);
  };
  for (const f of filer.filter((f) => f === 'index.html' || f === 'style.css')) {
    const skærme = skærmeForLinjer(f, mod, git, jsFiler, importører, SKÆRME);
    if (!skærme) {
      console.log(`${f}: en ændret linje hører ikke til én skærm, så alle tests køres.`);
      return ALLE;
    }
    console.log(`${f}: ændret på ${[...skærme].map((s) => '#' + s).join(', ') || 'ingen skærm'}`);
    for (const s of skærme) testsForSkærm(s);
  }
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

// Hvilke skærme de ændrede linjer i index.html eller style.css hører til (et Set), eller null, hvis det ikke kan afgøres
// for alle linjerne. Både den nye og den gamle udgave af filen ses efter, så også slettede linjer tæller.
// - index.html: linjen står inde i en <section id="…" class="skærm …">
// - style.css: reglen, linjen står i, har et #id, der hører til en skærm (fx #reaktor .del-vælger), eller en klasse,
//   der kun bruges på én eller få skærme (i index.html eller i de js-filer, skærmene bygges af). En regel for noget,
//   der også bruges uden for skærmene eller ikke kan findes (.knap, button, :root), giver null.
function skærmeForLinjer(fil, mod, git, jsFiler, importører, SKÆRME) {
  const ny = readFileSync(PROJEKT + fil, 'utf8').split('\n');
  const gammel = git('show', `${mod}:${fil}`).stdout.split('\n');
  const nyeLinjer = [], gamleLinjer = [];
  for (const [, a, b, c, d] of git('diff', '-U0', mod, '--', fil).stdout.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
    for (let i = 0; i < Number(b ?? 1); i++) gamleLinjer.push(Number(a) - 1 + i);
    for (let i = 0; i < Number(d ?? 1); i++) nyeLinjer.push(Number(c) - 1 + i);
  }
  // Skærmene i index.html (linjenumre fra start til </section>)
  const skærmIHtml = (linjer) => {
    const ud = new Array(linjer.length).fill(null);
    let nu = null;
    linjer.forEach((l, i) => {
      const start = l.match(/^\s*<section id="([\w-]+)" class="skærm/);
      if (start) nu = start[1];
      ud[i] = nu;
      if (nu && /^  <\/section>/.test(l)) nu = null;
    });
    return ud;
  };
  const html = readFileSync(PROJEKT + 'index.html', 'utf8').split('\n');
  const htmlSkærm = skærmIHtml(html);
  if (fil === 'index.html') {
    const gSkærm = skærmIHtml(gammel);
    const skærme = [...nyeLinjer.map((i) => htmlSkærm[i]), ...gamleLinjer.map((i) => gSkærm[i])];
    return skærme.every(Boolean) ? new Set(skærme) : null;
  }
  // style.css: hvor id'er og klasser bruges
  const jsSkærme = new Map();
  for (const f of jsFiler) {
    const nåede = new Set([f]);
    for (const m of nåede) for (const i of importører.get(m) ?? []) if (i !== 'js/main.js') nåede.add(i);
    const s = new Set([...nåede].map((m) => SKÆRME[m]).filter(Boolean));
    if (f === 'js/main.js' || !s.size) s.add('*'); // bruges også uden for skærmene
    jsSkærme.set(f, s);
  }
  const jsTekst = new Map(jsFiler.map((f) => [f, readFileSync(PROJEKT + f, 'utf8')]));
  const huskBrug = new Map();
  const brugtPå = (navn) => {
    if (huskBrug.has(navn)) return huskBrug.get(navn);
    const ord = new RegExp(`(?<![\\w-])${navn.replace(/[-]/g, '\\-')}(?![\\w-])`);
    const s = new Set();
    html.forEach((l, i) => { if (/(id|class)="/.test(l) && ord.test(l)) s.add(htmlSkærm[i] ?? '*'); });
    for (const [f, t] of jsTekst) if (ord.test(t)) for (const x of jsSkærme.get(f)) s.add(x);
    if (SKÆRME_ID.has(navn)) { s.clear(); s.add(navn); }
    huskBrug.set(navn, s);
    return s;
  };
  // Selektorerne, som hver linje står inde i (også en linje med selektoren selv)
  const selektorer = (linjer) => {
    const ud = [];
    const stak = [];
    let kommentar = false;
    for (const rå of linjer) {
      let l = rå;
      if (kommentar) { const e = l.indexOf('*/'); if (e < 0) { ud.push(stak.slice()); continue; } l = l.slice(e + 2); kommentar = false; }
      l = l.replace(/\/\*.*?\*\//g, '');
      if (l.includes('/*')) { l = l.slice(0, l.indexOf('/*')); kommentar = true; }
      const her = stak.slice();
      let rest = l;
      for (let k; (k = rest.search(/[{}]/)) >= 0; rest = rest.slice(k + 1)) {
        if (rest[k] === '{') { stak.push(rest.slice(0, k).trim()); her.push(stak.at(-1)); } else stak.pop();
      }
      ud.push(her);
    }
    return ud;
  };
  const SKÆRME_ID = new Set(Object.values(SKÆRME).concat(['menu', 'ordbog']));
  const skærmeForSelektor = (sel) => {
    let alle = new Set();
    for (const del of sel.split(',')) {
      if (del.trim().startsWith('@') || !del.trim()) continue;
      const navne = [...del.matchAll(/[#.]([\w\u00c0-\u024f-]+)/g)].map((m) => m[1]);
      // Snit af de skærme, navnene bruges på (et navn, der også bruges uden for skærmene, begrænser intet)
      let snit = null;
      for (const n of navne) {
        const s = brugtPå(n);
        if (!s.size || s.has('*')) continue;
        snit = snit ? new Set([...snit].filter((x) => s.has(x))) : new Set(s);
      }
      if (!snit || !snit.size) return null;
      for (const x of snit) alle.add(x);
    }
    return alle;
  };
  const skærme = new Set();
  for (const [linjer, numre] of [[ny, nyeLinjer], [gammel, gamleLinjer]]) {
    const sel = selektorer(linjer);
    for (const i of numre) {
      if (!linjer[i]?.trim()) continue; // tomme linjer
      const regler = (sel[i] ?? []).filter((r) => !r.startsWith('@'));
      if (!regler.length) return null;
      // Den inderste regel afgør, hvad linjen gælder for
      const s = skærmeForSelektor(regler.at(-1));
      if (!s) return null;
      for (const x of s) skærme.add(x);
    }
  }
  return skærme;
}

async function serverSvarer() {
  try {
    // Svaret læses færdigt: Ellers går Node 22.23's fetch ned (assert(!this.paused) i undici), når Pythons server lukker forbindelsen
    const svar = await fetch(ADRESSE);
    await svar.arrayBuffer();
    return svar.ok;
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
    // Højst 15 minutter pr. test. mars tog 591 af 600 s, da grænsen var 10 minutter (M8b, oktober 2026), og fejlede, når
    // tunge beregninger kørte ved siden af
    const stop = setTimeout(() => p.kill(), 15 * 60 * 1000);
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
