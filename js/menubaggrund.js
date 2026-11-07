// Baggrunden bag ringen i menuen (K2 i docs/plan-menu.md, kun med ?karrusel): Bag atomet toner et let motiv frem,
// der passer til kortet forrest (en stjerne ved Stjerneovnen, en galakse ved Kosmos osv.). Når ringen drejes,
// glider det ene motiv blødt over i det næste.
// Motiverne hænger i et lag, der følger kameraet langt bag atomet, så de fylder hele billedet, mens kameraet
// drejer om atomet. Laget måles i "billedhøjder": y går fra -0,5 til 0,5, og atomet står i (0, 0).
// Alt er pynt og forenklet (fx er planeternes afstande presset sammen). Billigt på tabletten: få prikker og korte shadere.

import * as THREE from 'three';
import { verden, LAV_KVALITET, ROLIG } from './scene3d.js';
import { GRUNDSTOFFER, KATEGORIER, placering } from './data/grundstoffer.js';
import { ORDBOG } from './data/ordbog.js';

const AFSTAND = 2.4; // laget står så mange gange kameraets afstand til atomet væk
const INDTONING = 1.2; // sekunder om at tone ind, når menuen vises
const L = LAV_KVALITET ? 0.45 : 1; // færre prikker på tabletten

let lag = null; // gruppen, der følger kameraet
let motiver = {}; // id → { gruppe, uniforms, opdater }
let dele = []; // delene i ringens rækkefølge
let hentPos = () => 0;
let tid = 0;
let tone = 0;
let kører = false;
const vægte = {};

// Fælles uniforms: tiden, billedets bredde/højde, pixel pr. "billedpixel" og lagets afstand
const fælles = {
  uTid: { value: 0 },
  uAspekt: { value: 1 },
  uPx: { value: 1 },
  uD: { value: 1 },
};

// ---------- Prikker ----------
// Hver prik har en størrelse i pixel (ved 1000 px billedhøjde) og en farve. Bevægelsen skrives i GLSL for hvert motiv.
const PRIK_FRAG = /* glsl */ `
  uniform float uVaegt;
  varying vec3 vFarve;
  varying float vLys;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.0, 1.0, d);
    a *= a;
    gl_FragColor = vec4(vFarve, a * vLys * uVaegt);
  }`;

function prikMateriale(bevægelse, ekstra = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { ...fælles, uVaegt: { value: 0 }, ...ekstra },
    vertexShader: /* glsl */ `
      uniform float uTid;
      uniform float uAspekt;
      uniform float uPx;
      uniform float uD;
      attribute float aStr;
      attribute vec3 aFarve;
      attribute vec4 aData;
      varying vec3 vFarve;
      varying float vLys;
      void main() {
        vec3 p = position;
        float lys = 1.0;
        ${bevægelse}
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aStr * uPx * (uD / max(-mv.z, 0.001));
        vFarve = aFarve;
        vLys = lys;
      }`,
    fragmentShader: PRIK_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// Laver prikker ud fra en liste af { p: [x,y,z], str, farve: THREE.Color, data: [a,b,c,d] }
function lavPrikker(liste, materiale) {
  const n = liste.length;
  const pos = new Float32Array(n * 3), str = new Float32Array(n), farve = new Float32Array(n * 3), data = new Float32Array(n * 4);
  liste.forEach((e, i) => {
    pos.set(e.p, i * 3);
    str[i] = e.str;
    farve.set([e.farve.r, e.farve.g, e.farve.b], i * 3);
    data.set(e.data ?? [0, 0, 0, 0], i * 4);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aStr', new THREE.BufferAttribute(str, 1));
  geo.setAttribute('aFarve', new THREE.BufferAttribute(farve, 3));
  geo.setAttribute('aData', new THREE.BufferAttribute(data, 4));
  const prikker = new THREE.Points(geo, materiale);
  prikker.frustumCulled = false;
  return prikker;
}

// En flade, der dækker hele billedet, med en shader (p er punktet i billedhøjder, atomet i (0, 0))
function lavFlade(frag, ekstra = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...fælles, uVaegt: { value: 0 }, ...ekstra },
    vertexShader: /* glsl */ `
      uniform float uAspekt;
      varying vec2 vP;
      void main() {
        vP = position.xy * vec2(uAspekt, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * vec2(uAspekt, 1.0), 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTid;
      uniform float uAspekt;
      uniform float uVaegt;
      varying vec2 vP;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float stoej(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float s = 0.0, a = 0.5;
        for (int i = 0; i < ${LAV_KVALITET ? 3 : 4}; i++) { s += a * stoej(p); p = p * 2.03 + 7.1; a *= 0.5; }
        return s;
      }
      ${frag}`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 1.02), mat);
  flade.frustumCulled = false;
  return flade;
}

const farve = (hex) => new THREE.Color(hex);
const tilfældig = (a, b) => a + Math.random() * (b - a);

// ---------- Stjerneovnen: kanten af en glødende stjerne, der bobler ----------
function stjerne() {
  const flade = lavFlade(/* glsl */ `
    void main() {
      vec2 c = vec2(0.0, -1.08);
      float R = 0.86;
      vec2 d = vP - c;
      float r = length(d);
      float t = uTid;
      vec3 col = vec3(0.0);
      // Skiven: moerkere mod kanten (randformoerkelse) og kornet af bobler (granulation). Stoejen regnes kun, hvor den ses.
      float inde = 1.0 - smoothstep(R - 0.003, R + 0.003, r);
      if (inde > 0.0) {
        float mu = sqrt(max(0.0, 1.0 - (r * r) / (R * R)));
        vec2 kugle = (d / R) / (0.35 + mu); // boblerne trykkes sammen mod kanten
        float korn = 0.75 + 0.6 * (fbm(kugle * 14.0 + vec2(t * 0.05, -t * 0.03)) - 0.5);
        ${LAV_KVALITET ? '' : 'korn += 0.25 * fbm(kugle * 40.0 - t * 0.08);'}
        float rand = 0.32 + 0.68 * pow(mu, 0.55);
        vec3 varm = mix(vec3(0.9, 0.26, 0.03), vec3(1.0, 0.74, 0.36), rand);
        col += inde * varm * rand * korn * 0.78;
      }
      // Koronaen og protuberanser (buer af gas) lige over kanten
      float h = max(r - R, 0.0);
      float glod = exp(-h * 9.0) * 0.32 + exp(-h * 2.6) * 0.1;
      col += (1.0 - inde) * vec3(1.0, 0.36, 0.08) * glod;
      if (h > 0.0 && h < 0.14) {
        float buer = fbm(vec2(atan(d.x, d.y) * 9.0, h * 10.0 - t * 0.06));
        col += (1.0 - inde) * vec3(1.0, 0.3, 0.12) * smoothstep(0.55, 0.85, buer) * exp(-h * 32.0) * 0.55;
      }
      gl_FragColor = vec4(col, uVaegt);
    }`);
  const g = new THREE.Group();
  g.add(flade);
  return { gruppe: g, uniforms: [flade.material.uniforms] };
}

// ---------- Reaktoren: ned i bassinet, hvor brændselsstavene lyser blåt (Tjerenkov-lys) ----------
function reaktor() {
  const flade = lavFlade(/* glsl */ `
    void main() {
      float h0 = 0.2; // horisonten i bassinet
      float t = uTid;
      vec3 col = vec3(0.0);
      float y = h0 - vP.y;
      if (y > 0.0) {
        float z = 0.6 / y; // afstanden ned i bassinet
        vec2 w = vec2(vP.x * z, z);
        // Vandets overflade boelger let og flytter billedet en smule
        w += 0.012 * vec2(stoej(w * 3.0 + t * 0.4), stoej(w * 3.0 - t * 0.35)) ;
        vec2 kerne = w - vec2(0.0, 2.0);
        float rk = length(kerne * vec2(1.0, 1.25));
        float celle = 0.1;
        vec2 cid = floor(kerne / celle);
        vec2 cf = fract(kerne / celle) - 0.5;
        float kant = max(abs(cf.x), abs(cf.y));
        float aa = fwidth(kant) * 1.5;
        float boks = 1.0 - smoothstep(0.36 - aa, 0.36 + aa, kant);
        float iKernen = 1.0 - smoothstep(0.45, 0.62, length(cid * celle * vec2(1.0, 1.25)));
        float styrke = 0.55 + 0.45 * hash(cid);
        styrke *= 0.85 + 0.15 * sin(t * 0.7 + hash(cid + 3.0) * 6.28);
        float glod = exp(-rk * 3.2);
        vec3 blaa = vec3(0.18, 0.5, 1.0);
        col += blaa * (boks * iKernen * styrke * 0.5 + glod * 0.26);
        col += vec3(0.75, 0.9, 1.0) * boks * iKernen * styrke * exp(-rk * 7.0) * 0.35;
        // Lyset fra kernen skinner op gennem vandet
        float sloer = smoothstep(0.0, 0.25, y);
        col *= sloer * (1.0 - smoothstep(3.5, 6.0, z) * 0.7);
      }
      // Et blaat skaer i vandet over kernen
      col += vec3(0.08, 0.25, 0.6) * exp(-length((vP - vec2(0.0, -0.2)) * vec2(0.8, 1.8)) * 3.5) * 0.22;
      gl_FragColor = vec4(col, uVaegt);
    }`);
  const g = new THREE.Group();
  g.add(flade);
  return { gruppe: g, uniforms: [flade.material.uniforms] };
}

// ---------- Atomværkstedet: elektronskyer (orbitaler) og partikler, der svæver ----------
function værksted() {
  const liste = [];
  // Svage p-orbitaler i tre retninger og en s-sky: prikker trukket efter, hvor elektronen tit er
  const akser = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const sky = farve(0x6fd8ff);
  const n = Math.round(2600 * L);
  for (let i = 0; i < n; i++) {
    const a = akser[i % 4] ?? null;
    let x, y, z;
    for (;;) {
      x = tilfældig(-1, 1); y = tilfældig(-1, 1); z = tilfældig(-1, 1);
      const r = Math.hypot(x, y, z);
      if (r > 1 || r < 0.02) continue;
      const tæthed = a ? ((x * a[0] + y * a[1] + z * a[2]) / r) ** 2 * (r * 6) ** 2 * Math.exp(-r * 6) / 0.54 : Math.exp(-r * 7);
      if (Math.random() < tæthed) break;
    }
    liste.push({ p: [x * 0.56, y * 0.56, z * 0.56], str: tilfældig(3.5, 6), farve: sky, data: [0, 0, 0, 0.3 + Math.random() * 0.3] });
  }
  // Protoner, neutroner og elektroner, der driver langsomt rundt
  const p = farve(0xff5a4f), nn = farve(0x9fb3c8), e = farve(0x9ff4ff);
  for (let i = 0; i < Math.round(70 * Math.max(L, 0.6)); i++) {
    const slags = i % 3;
    const v = new THREE.Vector3().randomDirection().multiplyScalar(tilfældig(0.3, 0.75));
    liste.push({
      p: [v.x * 1.4, v.y, v.z * 0.5],
      str: slags === 2 ? tilfældig(3, 4.5) : tilfældig(6, 9),
      farve: [p, nn, e][slags],
      data: [Math.random() * 6.28, tilfældig(0.15, 0.35), slags === 2 ? 0.04 : 0.025, slags === 2 ? 1.0 : 0.8],
    });
  }
  const mat = prikMateriale(/* glsl */ `
    // aData: fase, fart, udsving, lys
    float f = aData.x + uTid * aData.y;
    p += aData.z * vec3(sin(f), cos(f * 1.3), sin(f * 0.7));
    lys = aData.w;`);
  const prikker = lavPrikker(liste, mat);
  const g = new THREE.Group();
  g.add(prikker);
  g.rotation.set(0.35, 0, 0.2);
  return {
    gruppe: g,
    uniforms: [mat.uniforms],
    opdater: (dt) => { prikker.rotation.y += dt * 0.06; },
  };
}

// ---------- Det periodiske system: felterne svagt og langt væk, ét felt lyser op ad gangen ----------
function system() {
  const C = 96, KOL = 18, RÆK = 10, M = 8;
  const lærred = document.createElement('canvas');
  lærred.width = KOL * C + 2 * M;
  lærred.height = RÆK * C + 2 * M;
  const g2 = lærred.getContext('2d');
  g2.textAlign = 'center';
  g2.textBaseline = 'middle';
  for (const s of GRUNDSTOFFER) {
    const pl = placering(s.nr);
    const r = pl.række > 7 ? pl.række + 0.4 : pl.række; // f-blokken lidt for sig
    const x = M + (pl.kolonne - 1) * C, y = M + (r - 1) * C;
    const f = KATEGORIER[s.kategori]?.farve ?? '#adb5bd';
    g2.fillStyle = f + '30';
    g2.strokeStyle = f + 'c0';
    g2.lineWidth = 3;
    g2.beginPath();
    g2.roundRect(x + 5, y + 5, C - 10, C - 10, 10);
    g2.fill();
    g2.stroke();
    g2.fillStyle = f;
    g2.font = '600 38px system-ui, sans-serif';
    g2.fillText(s.symbol, x + C / 2, y + C / 2 + 4);
  }
  const tekstur = new THREE.CanvasTexture(lærred);
  tekstur.colorSpace = THREE.SRGBColorSpace;
  tekstur.anisotropy = 4;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uVaegt: { value: 0 }, uKort: { value: tekstur }, uFokus: { value: new THREE.Vector4(-1, -1, 0, 0) } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform sampler2D uKort;
      uniform float uVaegt;
      uniform vec4 uFokus; // felt (x, y) i laerredets broekdele, felt-stoerrelse og styrke
      varying vec2 vUv;
      void main() {
        vec4 k = texture2D(uKort, vUv);
        vec2 d = abs(vUv - uFokus.xy) / uFokus.z;
        float fokus = (1.0 - smoothstep(0.45, 0.6, max(d.x, d.y * ${(lærred.width / lærred.height).toFixed(4)}))) * uFokus.w;
        float kant = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x) * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
        gl_FragColor = vec4(k.rgb * k.a * (0.16 + 0.9 * fokus) * kant, uVaegt);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const B = 1.7;
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(B, (B * lærred.height) / lærred.width), mat);
  flade.position.set(0, 0.1, -0.55);
  flade.rotation.set(-0.72, 0, 0);
  const g = new THREE.Group();
  g.add(flade);
  let næste = 0;
  return {
    gruppe: g,
    uniforms: [mat.uniforms],
    opdater: (dt) => {
      // Et nyt grundstof lyser op hvert 1,6 sekund
      næste -= dt;
      const f = mat.uniforms.uFokus.value;
      if (næste <= 0) {
        næste = 1.6;
        const s = GRUNDSTOFFER[Math.floor(Math.random() * GRUNDSTOFFER.length)];
        const pl = placering(s.nr);
        const r = pl.række > 7 ? pl.række + 0.4 : pl.række;
        f.set((M + (pl.kolonne - 0.5) * C) / lærred.width, 1 - (M + (r - 0.5) * C) / lærred.height, C / lærred.width, 0);
      }
      const t = 1.6 - næste; // op på 0,4 s, ned over resten
      f.w = t < 0.4 ? t / 0.4 : Math.max(0, 1 - (t - 0.4) / 1.0);
      flade.rotation.y = Math.sin(tid * 0.12) * 0.12;
    },
  };
}

// ---------- Batteriet: ioner gennem midten og elektroner rundt i ledningen, samme vej ----------
// Når batteriet bruges (eller lades), går lithium-ionerne gennem elektrolytten og elektronerne gennem ledningen
// udenom fra den samme side til den samme side.
function batteri() {
  const liste = [];
  const ion = farve(0xff7a6b), elek = farve(0x7ff0ff), pol = farve(0x86e08e);
  for (let i = 0; i < Math.round(420 * Math.max(L, 0.6)); i++) {
    liste.push({ p: [0, 0, tilfældig(-0.1, 0.1)], str: tilfældig(4, 6.5), farve: elek, data: [Math.random(), tilfældig(-1, 1), 0, 0] });
  }
  for (let i = 0; i < Math.round(55 * Math.max(L, 0.7)); i++) {
    liste.push({ p: [0, 0, tilfældig(-0.15, 0.15)], str: tilfældig(9, 13), farve: ion, data: [Math.random(), tilfældig(-1, 1), 1, 0] });
  }
  // Polerne: to lodrette, svagt grønne bånd af prikker
  for (let i = 0; i < Math.round(160 * Math.max(L, 0.6)); i++) {
    liste.push({ p: [0, tilfældig(-0.16, -0.02), tilfældig(-0.03, 0.03)], str: tilfældig(3, 5), farve: pol, data: [i % 2 ? 1 : -1, tilfældig(0, 1), 2, 0] });
  }
  const mat = prikMateriale(/* glsl */ `
    float halv = 0.5 * min(uAspekt, 1.7) * 0.82; // polernes plads
    if (aData.z < 0.5) {
      // Elektron: i en bue over atomet (ledningen) fra den venstre pol til den hoejre
      float u = fract(aData.x + uTid * 0.07);
      p.x = -halv * cos(3.14159 * u);
      p.y = -0.09 + 0.33 * sin(3.14159 * u) + aData.y * 0.008;
      lys = 1.0;
    } else if (aData.z < 1.5) {
      // Ion: langsomt gennem midten, samme vej
      float u = fract(aData.x + uTid * 0.03);
      p.x = mix(-halv, halv, u);
      p.y = -0.09 + aData.y * 0.035 + 0.006 * sin(uTid + aData.x * 30.0);
      lys = 0.85 * smoothstep(0.0, 0.06, u) * smoothstep(1.0, 0.94, u);
    } else {
      p.x = aData.x * halv + (aData.y - 0.5) * 0.02;
      lys = 0.7;
    }`);
  const g = new THREE.Group();
  g.add(lavPrikker(liste, mat));
  return { gruppe: g, uniforms: [mat.uniforms] };
}

// ---------- Solsystemet: planetbaner med små planeter (afstandene presset sammen) ----------
// Planeterne går mod uret set fra nord, og de inderste går hurtigst (Keplers 3. lov med de rigtige omløbstider).
const PLANETER = [
  // radius i billedhøjder, omløbstid i år, farve, størrelse
  [0.16, 0.241, 0xb5a79a, 3.5], [0.21, 0.615, 0xf2d3a0, 4.5], [0.265, 1, 0x6fa8ff, 4.8], [0.32, 1.881, 0xe0754a, 4],
  [0.42, 11.86, 0xe8c79a, 8], [0.52, 29.46, 0xf0dca0, 7], [0.61, 84.0, 0x9fe6f0, 5.5], [0.69, 164.8, 0x5d84ff, 5.5],
];
const JORDÅR = 36; // sekunder om ét omløb for Jorden
function solsystem() {
  const g = new THREE.Group();
  const baneMat = new THREE.LineBasicMaterial({ color: 0x8fb8ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  for (const [r] of PLANETER) {
    const punkter = [];
    for (let i = 0; i < 128; i++) {
      const v = (i / 128) * Math.PI * 2;
      punkter.push(new THREE.Vector3(r * Math.cos(v), 0, -r * Math.sin(v)));
    }
    const bane = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(punkter), baneMat);
    bane.frustumCulled = false;
    g.add(bane);
  }
  const liste = PLANETER.map(([r, år, f, s]) => ({
    p: [0, 0, 0], str: s * 1.4, farve: farve(f), data: [r, (2 * Math.PI) / (år * JORDÅR), Math.random() * 6.28, 1],
  }));
  liste.push({ p: [0, 0, 0], str: 120, farve: farve(0xffb44a), data: [0, 0, 0, 0.45] }); // Solens skær bag atomet
  // Asteroidebæltet: svage prikker mellem Mars og Jupiter
  for (let i = 0; i < Math.round(240 * L); i++) {
    const r = tilfældig(0.355, 0.385);
    liste.push({ p: [0, 0, 0], str: tilfældig(1.2, 2), farve: farve(0xa89a8a), data: [r, (2 * Math.PI) / (Math.pow(r / 0.265, 1.5) * 3.2 * JORDÅR), Math.random() * 6.28, 0.35] });
  }
  const mat = prikMateriale(/* glsl */ `
    // aData: radius, vinkelfart, startvinkel, lys. Mod uret set fra nord (+y): x = r cos v, z = -r sin v.
    float v = aData.z + uTid * aData.y;
    p = vec3(aData.x * cos(v), 0.0, -aData.x * sin(v));
    lys = aData.w;`);
  g.add(lavPrikker(liste, mat));
  g.rotation.set(0.42, 0, -0.12); // set lidt fra oven
  return {
    gruppe: g,
    uniforms: [mat.uniforms],
    opdater: () => { baneMat.opacity = 0.2 * mat.uniforms.uVaegt.value; },
    baneMat,
  };
}

// ---------- Kosmos: en spiralgalakse, der drejer langsomt ----------
function kosmos() {
  const liste = [];
  const kerne = farve(0xffd9a0), arm = farve(0x9fbaff), ung = farve(0xff8fc8);
  const n = Math.round(7000 * L);
  for (let i = 0; i < n; i++) {
    const iKernen = Math.random() < 0.22;
    let r, v;
    if (iKernen) {
      r = Math.abs(THREE.MathUtils.randFloatSpread(1) * tilfældig(0, 1)) * 0.2;
      v = Math.random() * 6.28;
    } else {
      r = 0.05 + Math.pow(Math.random(), 0.8) * 0.78;
      const armNr = i % 2;
      v = Math.log(r / 0.05) / 0.32 + armNr * Math.PI + THREE.MathUtils.randFloatSpread(0.3 + 0.35 * r);
    }
    const tyk = (iKernen ? 0.035 : 0.012) * (Math.random() - 0.5);
    const lyserød = !iKernen && Math.random() < 0.05;
    liste.push({
      p: [0, tyk, 0],
      str: lyserød ? tilfældig(5, 8) : tilfældig(2.5, 5),
      farve: iKernen ? kerne : lyserød ? ung : arm,
      data: [r, v, 0, iKernen ? 0.45 : lyserød ? 0.9 : 0.6 + 0.35 * Math.random()],
    });
  }
  const mat = prikMateriale(/* glsl */ `
    // aData: radius, vinkel. Stjernerne gaar omtrent lige hurtigt, saa de inderste kommer hurtigst rundt.
    float v = aData.y + uTid * 0.02 / max(aData.x, 0.08);
    p.x = aData.x * cos(v);
    p.z = aData.x * sin(v);
    lys = aData.w;`);
  const g = new THREE.Group();
  g.add(lavPrikker(liste, mat));
  // Et blødt skær i kernen
  g.add(lavPrikker([{ p: [0, 0, 0], str: 150, farve: kerne, data: [0, 0, 0, 0.22] }], prikMateriale('lys = aData.w;')));
  g.rotation.set(1.05, 0.3, 0.35);
  g.position.set(0.04, 0.04, 0);
  return { gruppe: g, uniforms: g.children.map((c) => c.material.uniforms) };
}

// ---------- Ordbogen: ord fra Ordbogen, der svæver langsomt op og toner ud ----------
function ordbog() {
  const g = new THREE.Group();
  const uniforms = { uVaegt: { value: 0 } };
  const ordliste = ORDBOG.map((o) => o.ord.replace(/\s*\(.*\)$/, '')).sort(() => Math.random() - 0.5);
  const antal = LAV_KVALITET ? 12 : 18;
  const ord = [];
  for (let i = 0; i < antal; i++) {
    const tekst = ordliste[i % ordliste.length];
    const lærred = document.createElement('canvas');
    lærred.width = 512;
    lærred.height = 96;
    const c = lærred.getContext('2d');
    c.font = 'italic 56px Georgia, "Times New Roman", serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#d6e6ff';
    c.fillText(tekst, 256, 50, 500);
    const t = new THREE.CanvasTexture(lærred);
    t.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.06), mat);
    m.frustumCulled = false;
    g.add(m);
    ord.push({ m, alder: Math.random(), fart: tilfældig(0.035, 0.06), x: 0, z: 0, s: 1 });
  }
  const nyPlads = (o, aspekt) => {
    o.x = tilfældig(-0.45, 0.45) * Math.min(aspekt, 1.6);
    o.z = tilfældig(-0.35, 0.25);
    o.s = tilfældig(0.6, 1.25);
  };
  let klar = false;
  return {
    gruppe: g,
    uniforms: [uniforms],
    opdater: (dt) => {
      const aspekt = fælles.uAspekt.value;
      for (const o of ord) {
        if (!klar) nyPlads(o, aspekt);
        o.alder += dt * o.fart * (ROLIG ? 0 : 1);
        if (o.alder > 1) { o.alder -= 1; nyPlads(o, aspekt); }
        // Ordet stiger fra under atomet op over det og toner ind og ud
        o.m.position.set(o.x, -0.45 + o.alder * 0.75, o.z);
        o.m.scale.setScalar(o.s);
        o.m.material.opacity = Math.sin(Math.PI * o.alder) ** 2 * 0.3 * uniforms.uVaegt.value;
      }
      klar = true;
    },
  };
}

const BYGGERE = { fusion: stjerne, reaktor, vaerksted: værksted, system, batteri, solsystem, kosmos, ordbog };

// Laves én gang (fra lavKarrusel). dele: delene i ringens rækkefølge, pos: ringens drejning (i kort)
export function lavMenuBaggrund(delListe, pos) {
  dele = delListe;
  hentPos = pos;
  lag = new THREE.Group();
  lag.visible = false;
  lag.renderOrder = -1;
  for (const id of dele) {
    const byg = BYGGERE[id];
    if (!byg) continue;
    const m = byg();
    m.gruppe.visible = false;
    lag.add(m.gruppe);
    motiver[id] = m;
  }
  // Laget hænger i kameraet, så det altid står bag atomet og fylder billedet
  if (!verden.kamera.parent) verden.scene.add(verden.kamera);
  verden.kamera.add(lag);
}

export function startMenuBaggrund() {
  if (!lag || kører) return;
  kører = true;
  tone = ROLIG ? 1 : 0;
  lag.visible = true;
  verden.opdateringer.add(opdater);
  opdater(0);
}

export function stopMenuBaggrund() {
  if (!lag) return;
  kører = false;
  lag.visible = false;
  verden.opdateringer.delete(opdater);
}

function opdater(dt) {
  const { kamera, styring, renderer } = verden;
  if (!ROLIG) tid += dt;
  tone = Math.min(1, tone + dt / INDTONING);
  // Lagets plads og størrelse: langt bag atomet, så stort, at det fylder hele billedet (også uden for udsnittet)
  const D = Math.max(kamera.position.distanceTo(styring.target) * AFSTAND, 10);
  const H = 2 * D * Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2));
  // Atomet står i billedets midte (centrerVindue flytter kun udsnittet), så laget centreres på kameraets akse
  lag.position.set(0, 0, -D);
  lag.scale.setScalar(H);
  fælles.uTid.value = tid;
  fælles.uAspekt.value = kamera.aspect;
  fælles.uD.value = D;
  // Prikkernes størrelse er i pixel ved 1000 px billedhøjde (hele billedet, som kameraet tegner)
  const fuldH = kamera.view?.enabled ? kamera.view.fullHeight : innerHeight;
  fælles.uPx.value = (renderer.getPixelRatio() * fuldH) / 1000;
  // Vægtene: motivet for kortet forrest fylder helt, og mellem to kort deles der
  const p = hentPos();
  const N = dele.length;
  dele.forEach((id, i) => {
    const d = Math.abs(((((i - p + N / 2) % N) + N) % N) - N / 2);
    const v = Math.max(0, 1 - d) * tone;
    const blød = v * v * (3 - 2 * v);
    vægte[id] = blød;
    const m = motiver[id];
    if (!m) return;
    const synlig = blød > 0.002;
    m.gruppe.visible = synlig;
    if (!synlig) return;
    for (const u of m.uniforms) u.uVaegt.value = blød;
    m.opdater?.(dt);
  });
}

// Til testene: hvor meget hvert motiv fylder lige nu
export const baggrundTest = () => ({ vægte: { ...vægte }, synlig: Boolean(lag?.visible) });
