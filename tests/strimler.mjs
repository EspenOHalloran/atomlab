// Store kort i strimler (Mars anden gang, 18. november 2026): Kortkøen (js/solsystem/kortkoe.js) lægger et stort, vendt
// ImageBitmap ind i grafikkortet i strimler, én pr. billede, i stedet for hele kortet i ét billede. Testen laver et
// billede på 4096 × 2048 med et mønster (testene henter ellers kun kort på 2k, som er for små til strimler) og tjekker,
// at det lægges ind i flere billeder, at det er det samme som lagt ind på én gang (også ved kanterne mellem strimlerne,
// ingen søm), at færdig først kaldes til sidst, og at et kort, der glemmes midt i, ikke bliver kaldt færdig og slettes.
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

const r = await s.evaluate(async () => {
  const THREE = await import('three');
  const { verden } = await import('/js/scene3d.js');
  const { iGrafikkort, iKø, STRIMMEL_PX } = await import('/js/solsystem/kortkoe.js');
  const renderer = verden.renderer, gl = renderer.getContext();
  const B = 4096, H = 2048;
  // Et mønster, hvor hver række og søjle har sin egen farve (så en forskudt strimmel ses)
  async function billede() {
    const c = new OffscreenCanvas(B, H);
    const g = c.getContext('2d');
    const d = g.createImageData(B, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < B; x++) {
      const i = 4 * (y * B + x);
      d.data[i] = y & 255; d.data[i + 1] = y >> 8; d.data[i + 2] = x & 255; d.data[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    const bm = await createImageBitmap(c, { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
    bm.vendt = true;
    bm.dataset = { fil: 'proeve.png' };
    return bm;
  }
  const tekstur = async (format) => {
    const t = new THREE.Texture(await billede());
    t.flipY = false;
    t.colorSpace = THREE.NoColorSpace;
    t.format = format;
    t.needsUpdate = true;
    return t;
  };
  // Tæl strimlerne i hvert billede (texSubImage2D på niveau 0)
  const pr = [];
  let iDette = 0, kald = 0;
  const før = gl.texSubImage2D;
  gl.texSubImage2D = function (...a) { if (a[1] === 0 && a.length >= 9) { iDette += a[5]; kald++; } return før.apply(gl, a); };
  let tæl = true;
  const ur = () => { if (iDette) pr.push(iDette); iDette = 0; if (tæl) requestAnimationFrame(ur); };
  requestAnimationFrame(ur);
  // Læs pixlerne i nogle rækker (ved kanterne mellem strimlerne og i midten) fra grafikkortet
  function læs(t, rækker) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderer.properties.get(t).__webglTexture, 0);
    const ud = [];
    const p = new Uint8Array(4 * B);
    for (const y of rækker) {
      gl.readPixels(0, y, B, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
      ud.push(Array.from(p.subarray(0, 16)).join(',') + '|' + Array.from(p.subarray(4 * (B - 4))).join(','));
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    renderer.resetState();
    return ud;
  }
  // Hele kortet læst fra grafikkortet (til at sammenligne alle punkter)
  function alt(t) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderer.properties.get(t).__webglTexture, 0);
    const p = new Uint8Array(4 * B * H);
    gl.readPixels(0, 0, B, H, gl.RGBA, gl.UNSIGNED_BYTE, p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    renderer.resetState();
    return p;
  }
  const rækker = STRIMMEL_PX / B; // rækker i den første strimmel
  const tjekRækker = [0, rækker - 1, rækker, 3 * rækker - 1, 3 * rækker, H / 2, H - 1];
  // 1. I strimler (RGBA)
  const t1 = await tekstur(THREE.RGBAFormat);
  let færdigFør = -1;
  await new Promise((ok) => iGrafikkort(t1, () => { færdigFør = kald; ok(); }));
  const iStrimler = læs(t1, tjekRækker);
  // Det samme lagt ind på én gang (uden kortkøen)
  const t2 = await tekstur(THREE.RGBAFormat);
  renderer.initTexture(t2);
  const helt = læs(t2, tjekRækker);
  const a1 = alt(t1), a2 = alt(t2);
  let forskellige = 0;
  for (let i = 0; i < a1.length; i++) if (a1[i] !== a2[i]) forskellige++;
  // 2. To kanaler (RGFormat, som højdekortene)
  const t3 = await tekstur(THREE.RGFormat);
  await new Promise((ok) => iGrafikkort(t3, ok));
  const rg = læs(t3, [rækker, H - 1]);
  // 3. Glemt midt i: færdig kaldes ikke, køen bliver tom, og teksturen slettes fra grafikkortet
  const t4 = await tekstur(THREE.RGBAFormat);
  const før4 = renderer.info.memory.textures;
  let glemt = false, kaldt = false;
  iGrafikkort(t4, () => { kaldt = true; }, { glemt: () => glemt });
  for (let i = 0; i < 4; i++) await new Promise((r) => requestAnimationFrame(r));
  const under = renderer.info.memory.textures;
  glemt = true;
  for (let i = 0; i < 4; i++) await new Promise((r) => requestAnimationFrame(r));
  tæl = false;
  gl.texSubImage2D = før;
  return {
    antal: færdigFør, mest: Math.max(...pr), rækker, ens: JSON.stringify(iStrimler) === JSON.stringify(helt) && forskellige === 0, forskellige, H,
    første: iStrimler[2], rg, kaldt, kø: iKø(), før4, under, efter: renderer.info.memory.textures,
  };
});
console.log(JSON.stringify({ ...r, første: r.første.slice(0, 40), rg: r.rg.map((x) => x.slice(0, 30)) }));
tjek('et stort kort (4096 × 2048) lægges ind i flere strimler, før færdig kaldes', r.antal >= 2 && r.antal <= 8, JSON.stringify(r.antal));
tjek('højst én strimmel pr. billede, og aldrig hele kortet i ét billede', r.mest < r.H, JSON.stringify({ mest: r.mest, H: r.H }));
tjek('kortet i strimler er det samme som lagt ind på én gang, alle punkter (ingen søm ved kanterne)', r.ens, JSON.stringify(r.forskellige));
// (billedet er vendt: række y i grafikkortet er række H − 1 − y i mønsteret, så række 512 er 1535 = 5 · 256 + 255)
tjek('rækken ved kanten har det rigtige mønster', r.første.startsWith('255,5,0,255,255,5,1,255'), r.første.slice(0, 40));
tjek('to kanaler (RG) i strimler', r.rg[0].startsWith('255,5,0,255,255,5,0,255') && r.rg[1].startsWith('0,0,0,255'), JSON.stringify(r.rg));
tjek('glemt midt i: færdig kaldes ikke, og køen er tom', !r.kaldt && r.kø === 0, JSON.stringify(r));
tjek('glemt midt i: teksturen slettes fra grafikkortet', r.under === r.før4 + 1 && r.efter === r.før4, JSON.stringify(r));
tjek('ingen fejl i konsollen', !fejl.length, fejl.join(' | '));
await b.close();
console.log(`\n${ok} OK, ${dårlig} fejl`);
process.exit(dårlig ? 1 : 0);
