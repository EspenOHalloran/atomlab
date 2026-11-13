// Måleren (?maal i adressen, G1 i docs/plan-grafik.md): et lille felt i et hjørne med billeder i sekundet, tid pr.
// billede, det værste billede, ryk og renderer.info. Den vigtigste del er listen over ryk (billeder over 50 ms) med det,
// der skete lige før: nye shadere, kort lagt i grafikkortet, billeder hentet færdigt, en kamerarejse, et tryk, en lang
// opgave eller oprydning i hukommelsen. "Kopiér" giver en tekst, der kan sættes ind i chatten.
// Hentes kun med ?maal (main.js), så starten ikke bliver større. Hænger sig på verden (scene3d.js) udefra: et punkt
// forrest i verden.opdateringer, en indpakning af komponist.render og renderer.render og af nogle få kald på
// WebGL-konteksten (teksturer og shadere). Den virker også under pause, for billederne tegnes stadig.
import { verden, LAV_KVALITET } from './scene3d.js';

const RYK = 50; // ms: et billede, der tager længere, er et ryk
const VINDUE = 5000; // ms: "det værste billede" ses over de sidste 5 sekunder
const FØR = 200; // ms: hændelser så længe før et ryk regnes med til "hvad skete lige før" (hver kun til ét ryk)
const MAKS_RYK = 100; // ryk i listen (de ældste smides ud)
const MAKS_HIST = 250; // ms: billeder længere end det tælles i den sidste spand
const SPROG = 'da-DK';

const nu = () => performance.now();
const ms = (x) => (x < 10 ? x.toFixed(1) : Math.round(x).toString()).replace('.', ',');
const tal = (x) => Math.round(x).toLocaleString(SPROG);
const ur = (t) => new Date(performance.timeOrigin + t).toLocaleTimeString(SPROG, { hour12: false });

// Tilstanden
const billeder = []; // de sidste 5 sekunder: { t, interval }
const ryk = []; // { t, interval, opdater, tegn, årsager: [] }
const hændelser = []; // de sidste par sekunder: { t, tekst }
const hist = new Uint32Array(MAKS_HIST + 1); // antal billeder pr. ms (til median og 95 %/99 %)
const total = { billeder: 0, tid: 0, ryk: 0, upload: 0, uploads: 0, shader: 0, shadere: 0, start: nu() };
const shaderListe = []; // hvert shaderprogram: { navn, ms, t } (ms: den tid, der blev ventet på det)
const kortListe = []; // hvert kort lagt i grafikkortet (over 2 ms): { navn, dt, forhånd, t }
let gpu = null; // måling af tiden på grafikkortet (kun hvis browseren kan: EXT_disjoint_timer_query_webgl2)

// Det, der sker i det billede, der tegnes nu (nulstilles, når et nyt billede starter)
let akt = nytBillede(0);
function nytBillede(t) {
  return { start: t, slut: t, tegn: 0, upload: 0, uploads: [], shader: 0, programmer: [], mipmap: 0 };
}
let forrigeStart = 0;
let skjult = false; // fanen var skjult: billedet efter tæller ikke
let sidsteHeap = 0;
let iTegning = 0; // dybden af render-kald (komponisten kalder selv renderer.render)
let iForhånd = false; // inde i renderer.initTexture

function hændelse(tekst, t = nu()) {
  hændelser.push({ t, tekst });
  while (hændelser.length && nu() - hændelser[0].t > 5000) hændelser.shift();
}

export function start() {
  if (!verden.renderer || globalThis.atomlabMåler) return;
  globalThis.atomlabMåler = hændelse; // andre moduler kan melde noget (fx en kamerarejse): atomlabMåler?.('…')
  hægtPå();
  lytTil();
  lavFelt();
  if (new URLSearchParams(location.search).has('test')) globalThis.atomlabMålerTest = testAdgang();
}

// --- Målingen ---

function hægtPå() {
  const { renderer, komponist } = verden;
  // Et punkt forrest i opdateringerne: her starter et billede. Sættet bygges om, så punktet står først
  // (de samme funktioner, så skærmenes delete virker som før).
  const gamle = [...verden.opdateringer];
  verden.opdateringer.clear();
  verden.opdateringer.add(billedStart);
  for (const f of gamle) verden.opdateringer.add(f);

  // Tegningen: tiden i komponist.render (eller renderer.render i testene og ved tegning af andre billeder undervejs)
  const pakInd = (obj, navn) => {
    const før = obj[navn].bind(obj);
    obj[navn] = (...a) => {
      if (iTegning) return før(...a);
      iTegning++;
      const t0 = nu();
      try { return før(...a); } finally {
        iTegning--;
        akt.slut = nu();
        akt.tegn += akt.slut - t0;
      }
    };
  };
  pakInd(komponist, 'render');
  pakInd(renderer, 'render');

  // Kort lagt i grafikkortet på forhånd (initTexture, fx i mars.js)
  const init = renderer.initTexture.bind(renderer);
  renderer.initTexture = (tekstur) => {
    iForhånd = true;
    try { return init(tekstur); } finally { iForhånd = false; }
  };

  const gl = renderer.getContext();
  // Teksturer: tiden for at lægge et billede i grafikkortet (pakkes billedet først ud her, er det med i tiden)
  for (const navn of ['texImage2D', 'texSubImage2D', 'texImage3D', 'texSubImage3D', 'compressedTexImage2D', 'compressedTexSubImage2D']) {
    const før = gl[navn];
    if (!før) continue;
    gl[navn] = function (...a) {
      const t0 = nu();
      try { return før.apply(gl, a); } finally {
        const dt = nu() - t0;
        akt.upload += dt;
        total.upload += dt;
        if (a[1] === 0) { // kun niveau 0 (mipmaps er små)
          total.uploads++;
          const u = { dt, navn: teksturNavn(navn, a), forhånd: iForhånd, t: t0 };
          akt.uploads.push(u);
          if (dt > 2) læg(kortListe, u);
        }
      }
    };
  }
  const mip = gl.generateMipmap;
  gl.generateMipmap = function (...a) {
    const t0 = nu();
    try { return mip.apply(gl, a); } finally { akt.mipmap += nu() - t0; }
  };
  // Shadere: oversættelsen kan vente på grafikdriveren (især første gang, et program bruges). Tiden regnes til
  // programmet (shaderProgram: shader → program, programmer: program → { navn, ms }).
  const typer = new WeakMap(); // shader → VERTEX_SHADER eller FRAGMENT_SHADER
  const kilder = new WeakMap(); // shader → kilde
  const shaderProgram = new WeakMap();
  const programmer = new WeakMap();
  for (const navn of ['compileShader', 'linkProgram', 'getProgramParameter', 'getShaderParameter', 'getProgramInfoLog', 'getShaderInfoLog']) {
    const før = gl[navn];
    gl[navn] = function (...a) {
      const t0 = nu();
      try { return før.apply(gl, a); } finally {
        const dt = nu() - t0;
        akt.shader += dt;
        total.shader += dt;
        const rec = programmer.get(a[0]) ?? programmer.get(shaderProgram.get(a[0]));
        if (rec) rec.ms += dt;
      }
    };
  }
  // Hvilken shader: navnet findes i fragment-shaderens kilde (se shaderNavn)
  const lav = gl.createShader;
  gl.createShader = function (type) { const sh = lav.call(gl, type); typer.set(sh, type); return sh; };
  const kilde = gl.shaderSource;
  gl.shaderSource = function (sh, k) { kilder.set(sh, k); return kilde.call(gl, sh, k); };
  const sæt = gl.attachShader;
  gl.attachShader = function (pr, sh) {
    shaderProgram.set(sh, pr);
    if (!programmer.has(pr)) programmer.set(pr, { navn: '', ms: 0, t: nu() });
    if (typer.get(sh) === gl.FRAGMENT_SHADER) programmer.get(pr).navn = shaderNavn(kilder.get(sh) ?? '');
    return sæt.call(gl, pr, sh);
  };
  const link = gl.linkProgram;
  gl.linkProgram = function (pr) {
    const rec = programmer.get(pr) ?? { navn: '', ms: 0, t: nu() };
    rec.navn ||= 'uden navn';
    akt.programmer.push(rec);
    læg(shaderListe, rec);
    total.shadere++;
    return link.call(gl, pr);
  };

  // Tiden på grafikkortet (kun nogle browsere, fx Chrome på pc)
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if (ext) gpu = { gl, ext, venter: [], aktiv: null, sidste: [] };
}

// Lægger noget i en af listerne (højst 200, de ældste smides ud)
function læg(liste, x) {
  liste.push(x);
  if (liste.length > 200) liste.shift();
}

// Et genkendeligt navn for en shader: materialets navn, Three.js' egne materialer, eller de første af shaderens egne
// uniforms (fx "kort, hoejde, sol"), som kan findes med grep i koden
const INDBYGGET = { STANDARD: 'MeshStandard', PHYSICAL: 'MeshPhysical', PHONG: 'MeshPhong', LAMBERT: 'MeshLambert', TOON: 'MeshToon', MATCAP: 'MeshMatcap' };
const FÆLLES = new Set(['viewMatrix', 'cameraPosition', 'isOrthographic', 'toneMappingExposure', 'modelMatrix', 'modelViewMatrix', 'projectionMatrix', 'normalMatrix']);
function shaderNavn(k) {
  const navn = /#define SHADER_NAME (\S+)/.exec(k)?.[1];
  if (navn) return navn;
  for (const [def, n] of Object.entries(INDBYGGET)) if (k.includes(`#define ${def}\n`)) return n;
  const egne = [...k.matchAll(/^\s*uniform\s+(?:(?:highp|mediump|lowp)\s+)?\w+\s+(\w+)/gm)].map((m) => m[1]).filter((u) => !FÆLLES.has(u));
  if (/gl_PointCoord/.test(k) && !egne.length) return 'punkter';
  return egne.length ? egne.slice(0, 3).join(', ') : 'uden navn';
}

// Navnet på et billede, der lægges i grafikkortet: bredde × højde og filnavnet, hvis det kendes
function teksturNavn(kald, a) {
  const kilde = a.find((x) => x && typeof x === 'object' && 'width' in x && !ArrayBuffer.isView(x));
  let b, h, fil = '';
  if (kilde) {
    b = kilde.width; h = kilde.height;
    fil = kilde.dataset?.fil ?? (kilde instanceof HTMLCanvasElement ? 'tegnet' : '');
  } else if (/Sub/.test(kald)) { b = a[4]; h = a[5]; } // texSubImage2D(mål, niveau, x, y, bredde, højde, …)
  else { b = a[3]; h = a[4]; } // texImage2D(mål, niveau, format, bredde, højde, …)
  return `${b}×${h}${fil ? ' ' + fil : ''}`;
}

function gpuStart() {
  if (!gpu) return;
  const { gl, ext } = gpu;
  // Færdige målinger fra tidligere billeder
  while (gpu.venter.length) {
    const q = gpu.venter[0];
    if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
    gpu.venter.shift();
    const forstyrret = gl.getParameter(ext.GPU_DISJOINT_EXT);
    const ns = gl.getQueryParameter(q, gl.QUERY_RESULT);
    gl.deleteQuery(q);
    if (!forstyrret) {
      gpu.sidste.push(ns / 1e6);
      if (gpu.sidste.length > 60) gpu.sidste.shift();
    }
  }
  if (gpu.aktiv || gpu.venter.length > 8) return;
  gpu.aktiv = gl.createQuery();
  gl.beginQuery(ext.TIME_ELAPSED_EXT, gpu.aktiv);
}
function gpuSlut() {
  if (!gpu?.aktiv) return;
  gpu.gl.endQuery(gpu.ext.TIME_ELAPSED_EXT);
  gpu.venter.push(gpu.aktiv);
  gpu.aktiv = null;
}

// Et nyt billede starter: det forrige gøres op
function billedStart() {
  const t = nu();
  gpuSlut(); // grafikkortets tid måles fra et billede starter til det næste
  if (forrigeStart && !skjult) gørOp(t);
  gørRykFærdige(t);
  skjult = false;
  forrigeStart = t;
  akt = nytBillede(t);
  // Oprydning i hukommelsen (kun Chrome kan se det): heapen falder pludselig
  const heap = performance.memory?.usedJSHeapSize;
  if (heap) {
    if (sidsteHeap - heap > 4e6) hændelse(`oprydning i hukommelsen (−${tal((sidsteHeap - heap) / 1e6)} MB)`);
    sidsteHeap = heap;
  }
  gpuStart();
}

function gørOp(t) {
  const interval = t - forrigeStart;
  billeder.push({ t, interval });
  while (billeder.length && t - billeder[0].t > VINDUE) billeder.shift();
  total.billeder++;
  total.tid += interval;
  hist[Math.min(MAKS_HIST, Math.round(interval))]++;
  if (interval < RYK) return;
  total.ryk++;
  const opdater = Math.max(0, akt.slut - akt.start - akt.tegn);
  ryk.push({ t: forrigeStart, til: t, interval, opdater, tegn: akt.tegn, årsager: årsager(akt), færdig: false });
  if (ryk.length > MAKS_RYK) {
    // Fuld liste: et ryk uden kendt årsag smides ud før et med (så de vigtige bliver, også når alt er langsomt)
    const i = ryk.findIndex((r) => r.færdig && !r.årsager.length);
    ryk.splice(Math.max(0, i), 1);
  }
}

// Hentninger og lange opgaver meldes lidt efter, at de skete. Derfor tages hændelserne med 1 sekund efter rykket.
function gørRykFærdige(t) {
  for (const r of ryk) {
    if (r.færdig || t - r.til < 1000) continue;
    for (const h of hændelser) {
      if (h.brugt || h.t < r.t - FØR || h.t >= r.til) continue;
      r.årsager.push(h.tekst);
      h.brugt = true;
    }
    r.færdig = true;
  }
}

// Hvad skete der i billedet og lige før? (de største først)
function årsager(b) {
  const ud = [];
  if (b.programmer.length) {
    const n = b.programmer.length;
    ud.push(`${n === 1 ? 'ny shader' : `${n} nye shadere`} ${ms(b.shader)} ms (${b.programmer.slice(0, 4).map((p) => p.navn).join(' | ')}${n > 4 ? ' …' : ''})`);
  }
  else if (b.shader > 5) ud.push(`shadere ${ms(b.shader)} ms`);
  if (b.uploads.length) {
    const store = b.uploads.filter((u) => u.dt > 2).sort((x, y) => y.dt - x.dt).slice(0, 3);
    const resten = b.uploads.length - store.length;
    const navne = store.map((u) => `${u.navn}${u.forhånd ? ' på forhånd' : ''} ${ms(u.dt)} ms`);
    if (resten) navne.push(`${resten} små`);
    ud.push(`kort i grafikkortet ${ms(b.upload)} ms: ${navne.join(', ')}`);
  }
  if (b.mipmap > 2) ud.push(`mipmaps ${ms(b.mipmap)} ms`);
  return ud;
}

function lytTil() {
  addEventListener('visibilitychange', () => {
    if (document.hidden) skjult = true;
    else hændelse('fanen vises igen');
  });
  addEventListener('hashchange', () => hændelse(`skærm ${location.hash || '#menu'}`));
  // Tryk på knapper og navne (det, man gjorde lige før et ryk)
  addEventListener('click', (h) => {
    const el = h.target.closest?.('button, a, summary, label, [role="button"], li');
    if (!el || el.closest('.maaler')) return;
    const tekst = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    hændelse(`tryk: ${tekst || el.tagName.toLowerCase()}`);
  }, true);
  let sidstZoom = 0;
  addEventListener('wheel', () => {
    if (nu() - sidstZoom > 1000) hændelse('zoom med hjulet');
    sidstZoom = nu();
  }, { capture: true, passive: true });
  try {
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) {
        if (e.initiatorType === 'fetch' || e.initiatorType === 'img') {
          const fil = decodeURIComponent(e.name.split('/').pop().split('?')[0]);
          const mb = e.encodedBodySize ? ` (${ms(e.encodedBodySize / 1e6)} MB)` : '';
          hændelse(`hentet ${fil}${mb}`, e.responseEnd);
        }
      }
    }).observe({ type: 'resource' });
  } catch { /* browseren kan ikke */ }
  try {
    // Lange opgaver (over 50 ms) på hovedtråden, også uden for tegningen (kun Chrome)
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) hændelse(`lang opgave ${ms(e.duration)} ms`, e.startTime + e.duration / 2); // (midten: i det billede, den hører til)
    }).observe({ type: 'longtask' });
  } catch { /* browseren kan ikke */ }
}

// --- Tallene ---

function tallene() {
  const sidste = billeder.filter((b) => b.t > nu() - 1000);
  const sum = sidste.reduce((s, b) => s + b.interval, 0);
  const værst = billeder.reduce((m, b) => Math.max(m, b.interval), 0);
  const info = verden.renderer.info;
  const lærred = verden.renderer.domElement;
  const gpuMs = gpu?.sidste.length ? gpu.sidste.reduce((s, x) => s + x, 0) / gpu.sidste.length : null;
  return {
    fps: sum ? (sidste.length * 1000) / sum : 0,
    prBillede: sidste.length ? sum / sidste.length : 0,
    værst,
    ryk: total.ryk,
    kald: info.render.calls,
    trekanter: info.render.triangles,
    geometrier: info.memory.geometries,
    teksturer: info.memory.textures,
    programmer: info.programs?.length ?? 0,
    bredde: lærred.width,
    højde: lærred.height,
    pixelRatio: verden.renderer.getPixelRatio(),
    gpu: gpuMs,
  };
}

// Den del af billederne (0-1), der tog højst så mange ms
function percentil(p) {
  let n = 0;
  const mål = p * total.billeder;
  for (let i = 0; i <= MAKS_HIST; i++) {
    n += hist[i];
    if (n >= mål) return i;
  }
  return MAKS_HIST;
}

function grafikkort() {
  try {
    const gl = verden.renderer.getContext();
    const e = gl.getExtension('WEBGL_debug_renderer_info');
    return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  } catch { return 'ukendt'; }
}

// Teksten til "Kopiér"
export function tekst() {
  gørRykFærdige(Infinity);
  const t = tallene();
  const sek = (nu() - total.start) / 1000;
  const linjer = [
    `AtomLab-måler ${new Date().toLocaleString(SPROG)}, skærm ${location.hash || '#menu'}`,
    `Browser: ${navigator.userAgent}`,
    `Grafikkort: ${grafikkort()}`,
    `Skærm ${screen.width}×${screen.height}, vindue ${innerWidth}×${innerHeight}, devicePixelRatio ${devicePixelRatio}, touch (LAV_KVALITET): ${LAV_KVALITET ? 'ja' : 'nej'}`,
    `Lærred ${t.bredde}×${t.højde} (pixelRatio ${t.pixelRatio})`,
    '',
    `Nu: ${ms(t.fps)} billeder/s, ${ms(t.prBillede)} ms pr. billede, værst (5 s) ${ms(t.værst)} ms${t.gpu != null ? `, grafikkortet ${ms(t.gpu)} ms pr. billede` : ''}`,
    `Kald ${t.kald}, trekanter ${tal(t.trekanter)}, geometrier ${t.geometrier}, teksturer ${t.teksturer}, shaderprogrammer ${t.programmer}`,
    `Siden start (${tal(sek)} s): ${tal(total.billeder)} billeder, gennemsnit ${ms(total.billeder ? (total.billeder * 1000) / total.tid : 0)} billeder/s, median ${percentil(0.5)} ms, 95 % under ${percentil(0.95)} ms, 99 % under ${percentil(0.99)} ms, ryk over ${RYK} ms: ${total.ryk}`,
    `Kort lagt i grafikkortet: ${total.uploads} (${tal(total.upload)} ms i alt). Shaderprogrammer lavet: ${total.shadere} (${tal(total.shader)} ms i alt)`,
    `De dyreste shadere: ${dyreste(shaderListe, (p) => p.ms, (p) => `${p.navn} ${ms(p.ms)} ms (${ur(p.t)})`)}`,
    `De dyreste kort: ${dyreste(kortListe, (k) => k.dt, (k) => `${k.navn}${k.forhånd ? ' på forhånd' : ''} ${ms(k.dt)} ms (${ur(k.t)})`)}`,
    '',
    `Ryk (de sidste ${Math.min(ryk.length, MAKS_RYK)}): klokken, længden, tid i opdater og tegn, og hvad der skete lige før`,
  ];
  for (const r of ryk) linjer.push(rykLinje(r));
  if (!ryk.length) linjer.push('(ingen)');
  return linjer.join('\n');
}

// De otte største i en liste
function dyreste(liste, mål, tekst) {
  if (!liste.length) return '(ingen)';
  return [...liste].sort((a, b) => mål(b) - mål(a)).slice(0, 8).map(tekst).join('; ');
}

function rykLinje(r) {
  const hvad = r.årsager.length ? r.årsager.join('; ') : 'ingen kendt årsag (måske grafikkortet eller browseren)';
  return `${ur(r.t)}  ${ms(r.interval)} ms (opdater ${ms(r.opdater)}, tegn ${ms(r.tegn)}): ${hvad}`;
}

// --- Feltet ---

const HJØRNER = ['nede-v', 'oppe-v', 'oppe-h', 'nede-h'];
const CSS = `
.maaler { position: fixed; z-index: 9999; max-width: min(340px, calc(100vw - 16px)); padding: 6px 8px; border-radius: 8px;
  background: rgba(5, 8, 20, 0.82); border: 1px solid rgba(140, 170, 255, 0.35); color: #dfe7ff;
  font: 11px/1.35 ui-monospace, Menlo, Consolas, monospace; pointer-events: auto; user-select: text; }
.maaler.nede-v { left: 8px; bottom: 8px; } .maaler.oppe-v { left: 8px; top: 8px; }
.maaler.oppe-h { right: 8px; top: 8px; } .maaler.nede-h { right: 8px; bottom: 8px; }
.maaler-top { display: flex; gap: 4px; align-items: center; }
.maaler-top strong { flex: 1; font-size: 12px; }
.maaler button { font: inherit; padding: 1px 6px; border-radius: 5px; border: 1px solid rgba(140, 170, 255, 0.5);
  background: rgba(40, 60, 120, 0.6); color: inherit; cursor: pointer; }
.maaler .maaler-ryk { max-height: 7.5em; overflow-y: auto; margin-top: 3px; color: #ffd28a; }
.maaler.lille .maaler-mere { display: none; }
.maaler-dårlig { color: #ff9a8a; }
`;

function lavFelt() {
  const stil = document.createElement('style');
  stil.textContent = CSS;
  document.head.appendChild(stil);
  const felt = document.createElement('div');
  felt.className = 'maaler nede-v';
  felt.setAttribute('aria-label', 'Måler for billeder i sekundet');
  felt.innerHTML = `<div class="maaler-top"><strong class="maaler-fps">… billeder/s</strong>
      <button type="button" class="maaler-kopier">Kopiér</button>
      <button type="button" class="maaler-flyt" title="Flyt til et andet hjørne" aria-label="Flyt måleren">⇲</button>
      <button type="button" class="maaler-fold" title="Fold sammen" aria-label="Fold måleren sammen">–</button></div>
    <div class="maaler-mere"><div class="maaler-tal"></div><div class="maaler-ryk"></div>
      <button type="button" class="maaler-nulstil">Nulstil</button></div>`;
  document.body.appendChild(felt);
  const $ = (s) => felt.querySelector(s);
  let hjørne = 0;
  $('.maaler-flyt').addEventListener('click', () => {
    felt.classList.remove(HJØRNER[hjørne]);
    hjørne = (hjørne + 1) % HJØRNER.length;
    felt.classList.add(HJØRNER[hjørne]);
  });
  $('.maaler-fold').addEventListener('click', () => {
    const lille = felt.classList.toggle('lille');
    $('.maaler-fold').textContent = lille ? '+' : '–';
  });
  $('.maaler-nulstil').addEventListener('click', () => {
    ryk.length = 0;
    shaderListe.length = 0;
    kortListe.length = 0;
    hist.fill(0);
    Object.assign(total, { billeder: 0, tid: 0, ryk: 0, upload: 0, uploads: 0, shader: 0, shadere: 0, start: nu() });
  });
  $('.maaler-kopier').addEventListener('click', () => kopiér($('.maaler-kopier')));
  // Feltet må ikke dreje kameraet eller lukke noget, når man trykker i det
  for (const h of ['pointerdown', 'wheel', 'touchstart']) felt.addEventListener(h, (e) => e.stopPropagation(), { passive: true });

  const vis = () => {
    const t = tallene();
    $('.maaler-fps').textContent = `${ms(t.fps)} billeder/s`;
    $('.maaler-fps').classList.toggle('maaler-dårlig', t.fps > 0 && t.fps < 45);
    $('.maaler-tal').innerHTML =
      `${ms(t.prBillede)} ms pr. billede · værst (5 s) <span class="${t.værst >= RYK ? 'maaler-dårlig' : ''}">${ms(t.værst)} ms</span><br>` +
      `Ryk over ${RYK} ms: ${t.ryk}${t.gpu != null ? ` · grafikkort ${ms(t.gpu)} ms` : ''}<br>` +
      `Kald ${t.kald} · trekanter ${tal(t.trekanter)}<br>` +
      `Geometrier ${t.geometrier} · teksturer ${t.teksturer} · shadere ${t.programmer}<br>` +
      `Lærred ${t.bredde}×${t.højde} · pixelRatio ${t.pixelRatio}`;
    const kasse = $('.maaler-ryk');
    kasse.textContent = '';
    for (const r of ryk.slice(-8).reverse()) {
      const linje = document.createElement('div');
      linje.textContent = `${ur(r.t)} ${ms(r.interval)} ms: ${r.årsager.join('; ') || 'ukendt årsag'}`; // (kort, alt står i "Kopiér")
      kasse.appendChild(linje);
    }
  };
  vis();
  setInterval(vis, 500);
}

async function kopiér(knap) {
  const t = tekst();
  let ok = false;
  try {
    await navigator.clipboard.writeText(t);
    ok = true;
  } catch {
    // Uden adgang til udklipsholderen: marker teksten i et felt, så den kan kopieres med hånden
    const felt = document.createElement('textarea');
    felt.value = t;
    Object.assign(felt.style, { position: 'fixed', left: '8px', top: '8px', width: 'calc(100vw - 16px)', height: '50vh', zIndex: 10000 });
    document.body.appendChild(felt);
    felt.select();
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    if (ok) felt.remove();
    else felt.addEventListener('blur', () => felt.remove());
  }
  knap.textContent = ok ? 'Kopieret ✓' : 'Kopiér selv';
  setTimeout(() => { knap.textContent = 'Kopiér'; }, 2000);
}

// Til tests (?test&maal)
export const testAdgang = () => ({ tekst, tallene, antalRyk: () => ryk.length, hændelse });
