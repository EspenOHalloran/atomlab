// Betelgeuse set fra Jorden (kontakten "🌃 Betelgeuse set fra Jorden" i Supernova): Man står på en mark i Danmark
// en vinternat og kigger mod Orion. Når Betelgeuse eksploderer, blusser den op til omtrent en halvmåne, lyser
// landskabet op og kaster skarpe skygger, og så falmer den over nogle år, til Orion har mistet sin skulder.
// Stjernerne står, hvor de rigtigt står (js/data/betelgeuse.js), men tiden er skruet sammen, og lyskurven er et skøn.
// Skyggerne regnes i shaderen (en stråle fra hvert punkt på jorden mod lyset), så der skal ingen skyggekort til.

import * as THREE from 'three';
import { ROLIG, LAV_KVALITET, visTåger, visRumstøv, centrerVindue } from '../scene3d.js';
import { glød, skilt } from './faelles.js';
import {
  STJERNER, STREGER, SOLEN_I_MARTS, GALAKSENS_POL, retning, højdeOgKompas, størrelsesklasse, farve,
  dageFraSkyder, tidTekst, sammenlign, SKYDER, DAG_GRÆNSE, ØJE_GRÆNSE,
} from '../data/betelgeuse.js';

const R_HIMMEL = 600; // himlens kugle (den skjuler stjernehimlen fra scene3d.js, der ligger længere ude)
const R_STJERNE = 560;
const R_BAKKE = 380; // bakkerne i horisonten
const ØJE = 1.7; // øjnene er 1,7 m over jorden (1 enhed = 1 m)
const SYN = 60; // synsvinklen (lodret) i hullet mellem panelerne i grader, så både horisonten og Betelgeuse er med
const SYD_BLIK = [166, 18]; // kompasretning og højde (grader), når man kigger på Orion
const NORD_BLIK = [342, -26]; // når man har vendt sig om og kigger på sin egen skygge
const AFSPIL_TID = 30; // sekunder, eksplosionen tager at spille fra start til slut

const RAD = Math.PI / 180;
const vek = (a) => new THREE.Vector3(...a);
const retningAf = (kompas, højde) => new THREE.Vector3(
  -Math.sin(kompas * RAD) * Math.cos(højde * RAD), Math.sin(højde * RAD), Math.cos(kompas * RAD) * Math.cos(højde * RAD));

// Himlen: nattens mørkeblå, lidt lys fra byerne i horisonten, et svagt Mælkevejsbånd, skæret om supernovaen og
// en blå dag med Solen lavt i vest
const HIMMEL_VERTEX = `
  varying vec3 vRetning;
  void main() {
    vRetning = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const HIMMEL_FRAGMENT = `
  uniform vec3 snRetning;
  uniform vec3 snFarve;
  uniform float snLys;
  uniform float dag;
  uniform vec3 solRetning;
  uniform vec3 galPol;
  varying vec3 vRetning;
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float stoej(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  void main() {
    vec3 r = normalize(vRetning);
    float h = max(r.y, 0.0);
    // Natten
    vec3 nat = mix(vec3(0.012, 0.016, 0.032), vec3(0.002, 0.003, 0.009), smoothstep(0.0, 0.7, h));
    nat += vec3(0.030, 0.020, 0.012) * exp(-h * 14.0); // lys fra byerne langt væk
    float b = dot(r, galPol);
    float mv = exp(-b * b / 0.018) * (0.45 + 0.55 * stoej(r * 7.0)) * (0.6 + 0.4 * stoej(r * 23.0));
    nat += vec3(0.011, 0.012, 0.016) * mv / (1.0 + snLys * 6.0);
    // Supernovaen lyser himlen op (luften spreder lyset, så hele himlen bliver lidt blålig)
    float c = max(dot(r, snRetning), 0.0);
    vec3 sn = snFarve * snLys * (0.05 * exp((c - 1.0) * 900.0) + 0.012 * exp((c - 1.0) * 40.0) + 0.003 * exp((c - 1.0) * 4.0));
    sn += vec3(0.30, 0.42, 0.75) * snLys * 0.010 * (1.0 - 0.5 * h);
    // Dagen
    vec3 dagHimmel = mix(vec3(0.42, 0.52, 0.68), vec3(0.05, 0.15, 0.46), pow(h, 0.5));
    float s = max(dot(r, solRetning), 0.0);
    dagHimmel += vec3(1.0, 0.62, 0.32) * (0.18 * exp((s - 1.0) * 9.0) + 0.35 * exp((s - 1.0) * 150.0));
    vec3 farve = mix(nat + sn, dagHimmel + sn * 0.3, dag);
    gl_FragColor = vec4(farve, 1.0);
  }`;

// Stjernerne: punkter i en fast størrelse på skærmen. Svage stjerner forsvinder, når himlen bliver lys (grænse).
const STJERNE_VERTEX = `
  attribute float mag;
  attribute vec3 farve;
  uniform float skala;
  uniform float graense;
  uniform float tid;
  uniform float blink;
  varying vec3 vFarve;
  varying float vStyrke;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    float synlig = smoothstep(graense + 0.6, graense - 0.6, mag);
    float hoejde = normalize(position).y;
    float h = fract(sin(dot(position.xz, vec2(12.9898, 78.233))) * 43758.5453);
    float glimt = 1.0 + blink * (0.10 + 0.25 * (1.0 - smoothstep(0.0, 0.35, hoejde))) * sin(tid * (6.0 + h * 9.0) + h * 40.0);
    float s = 1.4 + 2.4 * pow(max(0.0, 4.6 - mag), 0.8);
    gl_PointSize = min(s, 30.0) * skala;
    vStyrke = synlig * glimt * (0.22 + 0.78 * clamp((6.3 - mag) / 5.0, 0.0, 1.8));
    vFarve = farve;
  }`;
const STJERNE_FRAGMENT = `
  varying vec3 vFarve;
  varying float vStyrke;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float k = exp(-dot(p, p) * 5.0);
    gl_FragColor = vec4(vFarve * vStyrke * k * 1.4, 1.0);
  }`;

// Landskabet: lys fra supernovaen og Solen og skygger fra kapsler (træer, pæle og dig selv) og kasser (huset).
// SKYGGER er kun slået til på jorden. Farven står i hvert punkt (color).
const ANTAL_K = 17;
const ANTAL_B = 4;
const LAND_VERTEX = `
  varying vec3 vVerden;
  varying vec3 vNormal;
  varying vec3 vFarve;
  void main() {
    vec4 p = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      p = instanceMatrix * p;
      n = mat3(instanceMatrix) * n;
    #endif
    vec4 v = modelMatrix * p;
    vVerden = v.xyz;
    vNormal = normalize(mat3(modelMatrix) * n);
    vFarve = color;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;
const LAND_FRAGMENT = `
  uniform vec3 snRetning;
  uniform vec3 snLys;
  uniform vec3 solRetning;
  uniform vec3 solLys;
  uniform vec3 himmelLys;
  uniform vec4 kapselA[${ANTAL_K}];
  uniform vec3 kapselB[${ANTAL_K}];
  uniform vec3 kasseMin[${ANTAL_B}];
  uniform vec3 kasseMax[${ANTAL_B}];
  varying vec3 vVerden;
  varying vec3 vNormal;
  varying vec3 vFarve;
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej2(vec2 x) {
    vec2 i = floor(x); vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y);
  }
  #ifdef SKYGGER
  // Hvor tæt kommer strålen p + t*l (t > 0) på stykket fra a til b?
  float afstand(vec3 p, vec3 l, vec3 a, vec3 b) {
    vec3 d = b - a;
    vec3 w = p - a;
    float bb = dot(l, d), cc = dot(d, d), dd = dot(l, w), ee = dot(d, w);
    float t = cc > 1e-6 ? clamp((ee - bb * dd) / max(cc - bb * bb, 1e-5), 0.0, 1.0) : 0.0;
    float s = max(0.0, dot(l, a + d * t - p));
    if (cc > 1e-6) t = clamp(dot(p + l * s - a, d) / cc, 0.0, 1.0);
    return length(p + l * s - (a + d * t));
  }
  float lysVed(vec3 p, vec3 l) {
    if (l.y <= 0.01) return 0.0;
    float lys = 1.0;
    for (int i = 0; i < ${ANTAL_K}; i++) {
      float r = kapselA[i].w;
      if (r <= 0.0) continue;
      lys *= smoothstep(r * 0.92, r * 1.08, afstand(p, l, kapselA[i].xyz, kapselB[i]));
    }
    for (int i = 0; i < ${ANTAL_B}; i++) {
      vec3 t1 = (kasseMin[i] - p) / l;
      vec3 t2 = (kasseMax[i] - p) / l;
      vec3 tn = min(t1, t2), tf = max(t1, t2);
      float ind = max(max(tn.x, tn.y), tn.z), ud = min(min(tf.x, tf.y), tf.z);
      if (ud > max(ind, 0.0)) lys = 0.0;
    }
    return lys;
  }
  #endif
  void main() {
    vec3 n = normalize(vNormal);
    vec3 albedo = vFarve;
    float sn = max(dot(n, snRetning), 0.0);
    float sol = max(dot(n, solRetning), 0.0);
    #ifdef SKYGGER
      vec3 p = vVerden + vec3(0.0, 0.01, 0.0);
      // Rimfrost på græsset: pletter i to størrelser
      albedo *= 0.75 + 0.35 * stoej2(p.xz * 0.35) + 0.15 * stoej2(p.xz * 3.1);
      if (dot(snLys, snLys) > 1e-7) sn *= lysVed(p, snRetning);
      if (dot(solLys, solLys) > 1e-7) sol *= lysVed(p, solRetning);
    #endif
    vec3 lys = himmelLys * (0.6 + 0.4 * n.y) + snLys * sn + solLys * sol;
    gl_FragColor = vec4(albedo * lys, 1.0);
  }`;

// Et stjerneglimt med stråler (som øjet ser en meget klar lyskilde)
function strålerTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.globalCompositeOperation = 'lighter';
  const midt = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  midt.addColorStop(0, 'rgba(255,255,255,1)');
  midt.addColorStop(0.06, 'rgba(255,255,255,0.8)');
  midt.addColorStop(0.2, 'rgba(255,255,255,0.12)');
  midt.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = midt;
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6; i++) {
    g.save();
    g.translate(128, 128);
    g.rotate((i * Math.PI) / 3 + 0.3);
    const lang = i % 2 ? 0.7 : 1;
    const str = g.createLinearGradient(0, 0, 128 * lang, 0);
    str.addColorStop(0, 'rgba(255,255,255,0.75)');
    str.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = str;
    g.beginPath();
    g.moveTo(0, -2.2);
    g.lineTo(128 * lang, 0);
    g.lineTo(0, 2.2);
    g.fill();
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Giver en geometri én farve i alle punkter (landskabets shader læser farven fra color)
function farvet(geo, farve) {
  const c = new THREE.Color(farve);
  const n = geo.attributes.position.count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return geo;
}

// Et saddeltag: b bred (x), d dyb (z), h højt, med underkanten i y = 0
function lavTag(b, d, h) {
  const x = b / 2, z = d / 2;
  const p = [
    // to skrå flader
    -x, 0, z, x, 0, z, x, h, 0, -x, 0, z, x, h, 0, -x, h, 0,
    x, 0, -z, -x, 0, -z, -x, h, 0, x, 0, -z, -x, h, 0, x, h, 0,
    // gavlene
    x, 0, z, x, 0, -z, x, h, 0, -x, 0, -z, -x, 0, z, -x, h, 0,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(p), 3));
  geo.computeVertexNormals();
  return geo;
}

export function lavBetelgeuse(forælder, { verden, kamera, fase, forklaring, opdaterKnapper }, himmelKontakt) {
  const gruppe = new THREE.Group();
  gruppe.visible = false;
  forælder.add(gruppe);

  const navn = Object.fromEntries(STJERNER.map((s, i) => [s[0], i]));
  const BI = navn.Betelgeuse;
  const snRetning = vek(retning(STJERNER[BI][1], STJERNER[BI][2]));
  const solRetning = vek(retning(...SOLEN_I_MARTS));
  const fælles = {
    snRetning: { value: snRetning },
    snFarve: { value: new THREE.Color() },
    solRetning: { value: solRetning },
  };

  // Himlen
  const himmelMat = new THREE.ShaderMaterial({
    vertexShader: HIMMEL_VERTEX, fragmentShader: HIMMEL_FRAGMENT, side: THREE.BackSide, depthWrite: true,
    uniforms: { ...fælles, snLys: { value: 0 }, dag: { value: 0 }, galPol: { value: vek(retning(...GALAKSENS_POL)) } },
  });
  gruppe.add(new THREE.Mesh(new THREE.SphereGeometry(R_HIMMEL, 48, 24), himmelMat));

  // Stjernerne: de rigtige omkring Orion og mange svage, tilfældige bagved
  const ANTAL_SVAGE = LAV_KVALITET ? 900 : 1800;
  const n = STJERNER.length + ANTAL_SVAGE;
  const pos = new Float32Array(n * 3), mag = new Float32Array(n), farver = new Float32Array(n * 3);
  const c = new THREE.Color();
  STJERNER.forEach(([, ra, dec, m, f], i) => {
    pos.set(vek(retning(ra, dec)).multiplyScalar(R_STJERNE).toArray(), i * 3);
    mag[i] = m;
    farver.set(c.set(f).toArray(), i * 3);
  });
  const v = new THREE.Vector3();
  for (let i = STJERNER.length; i < n; i++) {
    do v.randomDirection(); while (v.y < -0.05);
    pos.set(v.multiplyScalar(R_STJERNE).toArray(), i * 3);
    mag[i] = 6.4 - 3 * Math.random() ** 2.5;
    c.setHSL(Math.random() < 0.6 ? 0.6 : 0.1, 0.35, 0.85);
    farver.set(c.toArray(), i * 3);
  }
  const stjerneGeo = new THREE.BufferGeometry();
  stjerneGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  stjerneGeo.setAttribute('mag', new THREE.BufferAttribute(mag, 1));
  stjerneGeo.setAttribute('farve', new THREE.BufferAttribute(farver, 3));
  const stjerneMat = new THREE.ShaderMaterial({
    vertexShader: STJERNE_VERTEX, fragmentShader: STJERNE_FRAGMENT,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { skala: { value: 1 }, graense: { value: 6.2 }, tid: { value: 0 }, blink: { value: ROLIG ? 0 : 1 } },
  });
  const stjerner = new THREE.Points(stjerneGeo, stjerneMat);
  stjerner.frustumCulled = false;
  gruppe.add(stjerner);

  // Supernovaen: en glorie og stråler oven på punktet
  const snSted = snRetning.clone().multiplyScalar(R_STJERNE * 0.99);
  const snGlød = glød(new THREE.Color(), 10, 0);
  snGlød.position.copy(snSted);
  const snStråler = new THREE.Sprite(new THREE.SpriteMaterial({
    map: strålerTekstur(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
  }));
  snStråler.position.copy(snSted);
  gruppe.add(snGlød, snStråler);

  // Solen (kun om dagen)
  const solSted = solRetning.clone().multiplyScalar(R_STJERNE * 0.99);
  const solGlød = glød(new THREE.Color(1.6, 1.2, 0.7), 45, 0);
  const solKerne = glød(new THREE.Color(8, 7, 5.5), 16, 0);
  solGlød.position.copy(solSted);
  solKerne.position.copy(solSted);
  gruppe.add(solGlød, solKerne);

  // Stregerne i Orion og navnene
  const navne = new THREE.Group();
  const linjer = [];
  for (const [a, b] of STREGER) {
    const pa = vek(retning(STJERNER[navn[a]][1], STJERNER[navn[a]][2]));
    const pb = vek(retning(STJERNER[navn[b]][1], STJERNER[navn[b]][2]));
    const fra = pa.clone().lerp(pb, 0.1).normalize().multiplyScalar(R_STJERNE * 0.995);
    const til = pa.clone().lerp(pb, 0.9).normalize().multiplyScalar(R_STJERNE * 0.995);
    linjer.push(...fra.toArray(), ...til.toArray());
  }
  const linjeGeo = new THREE.BufferGeometry();
  linjeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linjer), 3));
  const linjeMat = new THREE.LineBasicMaterial({ color: new THREE.Color(0.35, 0.5, 0.85), transparent: true, opacity: 0.35, depthWrite: false });
  navne.add(new THREE.LineSegments(linjeGeo, linjeMat));
  const mærke = (tekst, retn, farve, størrelse, ned = 1.6) => {
    const s = skilt(tekst, farve, størrelse);
    s.material.depthTest = false;
    s.renderOrder = 10;
    s.position.copy(retn).multiplyScalar(R_STJERNE * 0.98);
    s.position.y -= ned * størrelse; // lidt under stjernen
    navne.add(s);
    return s;
  };
  const stjerneNavn = (n2, f = '#cfe0ff') => mærke(n2, vek(retning(STJERNER[navn[n2]][1], STJERNER[navn[n2]][2])), f, 13);
  const betelgeuseNavn = stjerneNavn('Betelgeuse', '#ffbe85');
  const navneHøjde = betelgeuseNavn.position.y;
  for (const s of ['Rigel', 'Sirius', 'Aldebaran', 'Procyon']) stjerneNavn(s);
  mærke('ORION', vek(retning(5.05, -12)), '#8fb4ff', 16, 0);
  for (const [tekst, kompas] of [['Syd', 180], ['Sydøst', 135], ['Øst', 90], ['Nord', 0], ['Vest', 270], ['Sydvest', 225]]) {
    mærke(tekst, retningAf(kompas, 4), '#9aa6c0', 11, 0);
  }
  gruppe.add(navne);

  // Landskabet
  const kapselA = Array.from({ length: ANTAL_K }, () => new THREE.Vector4(0, 0, 0, 0));
  const kapselB = Array.from({ length: ANTAL_K }, () => new THREE.Vector3());
  const kasseMin = Array.from({ length: ANTAL_B }, () => new THREE.Vector3(1e5, 1e5, 1e5)); // ubrugte kasser ligger langt væk
  const kasseMax = Array.from({ length: ANTAL_B }, () => new THREE.Vector3(1e5, 1e5, 1e5));
  let nk = 0, nb = 0;
  const kapsel = (a, b, r) => { kapselA[nk].set(...a, r); kapselB[nk].set(...b); nk++; };
  const kasse = (a, b) => { kasseMin[nb].set(...a); kasseMax[nb].set(...b); nb++; };
  const landUniforms = {
    ...fælles,
    snLys: { value: new THREE.Color(0, 0, 0) },
    solLys: { value: new THREE.Color(0, 0, 0) },
    himmelLys: { value: new THREE.Color(0, 0, 0) },
    kapselA: { value: kapselA }, kapselB: { value: kapselB }, kasseMin: { value: kasseMin }, kasseMax: { value: kasseMax },
  };
  const jordMat = new THREE.ShaderMaterial({ vertexShader: LAND_VERTEX, fragmentShader: LAND_FRAGMENT, vertexColors: true, defines: { SKYGGER: '' }, uniforms: landUniforms });
  const tingMat = new THREE.ShaderMaterial({ vertexShader: LAND_VERTEX, fragmentShader: LAND_FRAGMENT, vertexColors: true, uniforms: landUniforms });
  const land = new THREE.Group();
  gruppe.add(land);
  const ting = (geo, farve, x, y, z) => {
    const m = new THREE.Mesh(farvet(geo, farve), tingMat);
    m.position.set(x, y, z);
    land.add(m);
    return m;
  };

  // Marken (rimfrost på græsset)
  const jord = new THREE.Mesh(farvet(new THREE.CircleGeometry(R_STJERNE, 72).rotateX(-Math.PI / 2), '#7f8c80'), jordMat);
  land.add(jord);

  // Bakkerne i horisonten (lave mod syd, så Sirius kan ses)
  const N = 180;
  const bakkePos = [];
  const højde = (k) => {
    const sydligt = Math.exp(-(((k - 160) / 40) ** 2));
    const g = 1.4 + 0.7 * Math.sin(k * RAD * 3 + 1) + 0.45 * Math.sin(k * RAD * 7 + 2) + 0.25 * Math.sin(k * RAD * 17);
    return R_BAKKE * Math.tan(Math.max(0.35, g * (1 - 0.6 * sydligt)) * RAD);
  };
  for (let i = 0; i < N; i++) {
    const k0 = (i / N) * 360, k1 = ((i + 1) / N) * 360;
    const a0 = retningAf(k0, 0), a1 = retningAf(k1, 0);
    const ind0 = a0.clone().multiplyScalar(R_BAKKE * 0.86), ind1 = a1.clone().multiplyScalar(R_BAKKE * 0.86);
    const top0 = a0.clone().multiplyScalar(R_BAKKE).setY(højde(k0)), top1 = a1.clone().multiplyScalar(R_BAKKE).setY(højde(k1));
    const ud0 = a0.clone().multiplyScalar(R_BAKKE * 1.2).setY(-2), ud1 = a1.clone().multiplyScalar(R_BAKKE * 1.2).setY(-2);
    // (rækkefølgen vender, så forsiden ses indefra)
    bakkePos.push(...ind0.toArray(), ...top1.toArray(), ...top0.toArray(), ...ind0.toArray(), ...ind1.toArray(), ...top1.toArray());
    bakkePos.push(...top0.toArray(), ...ud1.toArray(), ...ud0.toArray(), ...top0.toArray(), ...top1.toArray(), ...ud1.toArray());
  }
  const bakkeGeo = new THREE.BufferGeometry();
  bakkeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bakkePos), 3));
  bakkeGeo.computeVertexNormals();
  land.add(new THREE.Mesh(farvet(bakkeGeo, '#3c4a3a'), tingMat));

  // Træer på bakkerne (silhuetter)
  const kroneGeo = farvet(new THREE.IcosahedronGeometry(1, 1), '#2a3527');
  const ANTAL_TRÆER = 46;
  const træer = new THREE.InstancedMesh(kroneGeo, tingMat, ANTAL_TRÆER);
  const mx = new THREE.Matrix4(), q = new THREE.Quaternion(), sk = new THREE.Vector3(), st = new THREE.Vector3();
  for (let i = 0; i < ANTAL_TRÆER; i++) {
    const klynge = Math.floor(i / 6);
    const k = klynge * 47 + 20 + (i % 6) * 1.1 + Math.sin(i * 7.3) * 0.6;
    const r = R_BAKKE * (0.97 + 0.02 * Math.sin(i * 3.1));
    const str = 5 + 3 * Math.abs(Math.sin(i * 2.3));
    st.copy(retningAf(k, 0)).multiplyScalar(r).setY(højde(k) + str * 0.7);
    sk.set(str * 0.8, str, str * 0.8);
    træer.setMatrixAt(i, mx.compose(st, q, sk));
  }
  land.add(træer);

  // En gård langt væk mod sydvest med et tændt vindue
  const gårdRetning = retningAf(196, 0).multiplyScalar(290);
  ting(new THREE.BoxGeometry(14, 5, 8), '#3a3a40', gårdRetning.x, 2.5, gårdRetning.z);
  ting(lavTag(14, 8, 3.5), '#26262b', gårdRetning.x, 5, gårdRetning.z);
  const gårdVindue = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 2.0, 0.8) }));
  gårdVindue.position.set(gårdRetning.x, 2.4, gårdRetning.z + 4.05);
  land.add(gårdVindue);

  // Et træ foran til venstre (silhuet mod den lysende himmel, skyggen falder mod dig)
  const lavTræ = (x, z, s) => {
    ting(new THREE.CylinderGeometry(0.18 * s, 0.28 * s, 4 * s, 8), '#4a3a2c', x, 2 * s, z);
    kapsel([x, 0, z], [x, 4 * s, z], 0.26 * s);
    for (const [dx, dy, dz, r] of [[0, 5.2, 0, 2.4], [1.3, 4.4, 0.5, 1.7], [-1.2, 4.6, -0.4, 1.8]]) {
      const kugle = ting(new THREE.IcosahedronGeometry(r * s, 2), '#3d5236', x + dx * s, dy * s, z + dz * s);
      kugle.scale.y = 0.9;
      kapsel([x + dx * s, dy * s, z + dz * s], [x + dx * s, dy * s, z + dz * s], r * s * 0.92);
    }
  };
  lavTræ(-15, -60, 1.5); // under Orion
  lavTræ(7.5, 20.7, 1.1); // bag dig

  // Dig selv (kun skyggen)
  kapsel([0, 0.1, 0], [0, 1.42, 0], 0.2);
  kapsel([0, 1.62, 0], [0, 1.62, 0], 0.12);

  // Et stakit bag dig
  for (let i = 0; i < 7; i++) {
    const x = -7.5 + i * 2.5;
    ting(new THREE.CylinderGeometry(0.07, 0.08, 1.25, 6), '#6b5a48', x, 0.62, 6);
    kapsel([x, 0, 6], [x, 1.25, 6], 0.08);
  }
  for (const y of [0.55, 1.0]) {
    ting(new THREE.BoxGeometry(15.4, 0.1, 0.05), '#6b5a48', 0, y, 6.08);
    kasse([-7.7, y - 0.05, 6.05], [7.7, y + 0.05, 6.11]);
  }

  // Et hvidt hus bag dig til venstre med rødt tegltag og et tændt vindue
  const hus = [-9, 34];
  ting(new THREE.BoxGeometry(10, 3.2, 7), '#d8d4cc', hus[0], 1.6, hus[1]);
  ting(lavTag(10.6, 7.6, 3), '#7a2a1c', hus[0], 3.2, hus[1]);
  kasse([hus[0] - 5, 0, hus[1] - 3.5], [hus[0] + 5, 3.2, hus[1] + 3.5]);
  kasse([hus[0] - 5.3, 3.2, hus[1] - 1.9], [hus[0] + 5.3, 4.7, hus[1] + 1.9]);
  for (const dx of [-2.6, 2.6]) {
    const vindue = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.7, 0.7) }));
    vindue.position.set(hus[0] + dx, 1.7, hus[1] - 3.52);
    vindue.rotation.y = Math.PI;
    land.add(vindue);
  }

  // Tilstanden
  let aktiv = false;
  let værdi = 0; // skyderens værdi
  let afspiller = false;
  let dag = 0, dagMål = 0;
  let gemt = null;
  let vend = null; // { t, fra: [kompas, højde], til: [kompas, højde] }
  let faseNu = '';
  let visNavne = true;

  const dage = () => dageFraSkyder(værdi);

  function sætBlik(kompas, højde) {
    const s = verden.styring;
    s.target.set(0, ØJE, 0);
    verden.kamera.position.copy(s.target).addScaledVector(retningAf(kompas, højde), -1e-4);
    s.update();
  }
  function blikNu() {
    const d = verden.styring.target.clone().sub(verden.kamera.position).normalize();
    const h = højdeOgKompas(d.toArray());
    return [h.kompas, h.højde];
  }

  // Synsvinklen regnes efter hullet mellem panelerne (på højkant er det kun den øverste del af skærmen), så himlen
  // fra horisonten til Betelgeuse altid er med. Kaldes hvert billede, også under pause (fx når skærmen drejes).
  function tilpasSyn() {
    const k = verden.kamera, r = verden.hul, H = innerHeight;
    if (!r || r.height < 10) return;
    const FH = H + 2 * Math.abs(H / 2 - (r.top + r.height / 2));
    const syn = (2 * Math.atan(Math.tan((SYN / 2) * RAD) * FH / r.height)) / RAD;
    if (Math.abs(k.fov - syn) < 0.01) return;
    k.fov = syn;
    k.updateProjectionMatrix();
  }

  function vis() {
    if (aktiv) return;
    aktiv = true;
    gruppe.visible = true;
    const s = verden.styring, k = verden.kamera;
    // Kameraet skal stå på jorden, så den fælles kameraflyvning stoppes først
    kamera({ retning: [0, 0, 1], radius: 1, mål: [0, ØJE, 0], drej: false, flyv: true });
    verden.målAfstand = null;
    gemt = {
      min: s.minDistance, max: s.maxDistance, zoom: s.enableZoom, drej: s.rotateSpeed,
      polMin: s.minPolarAngle, polMax: s.maxPolarAngle, nær: k.near, auto: s.autoRotate,
    };
    s.autoRotate = false;
    s.minDistance = s.maxDistance = 1e-4; // man drejer om et punkt lige foran øjnene (som at dreje hovedet)
    s.enableZoom = false;
    s.rotateSpeed = -0.35; // man "tager fat i" himlen
    s.minPolarAngle = 62 * RAD; // man kan kigge 28° ned
    s.maxPolarAngle = 172 * RAD; // og 82° op
    k.near = 0.05;
    verden.opdateringer.add(tilpasSyn);
    tilpasSyn();
    sætBlik(...SYD_BLIK);
    visTåger(false);
    visRumstøv(false);
    faseNu = '';
    opdaterTilstand(true);
  }

  function skjul() {
    if (!aktiv) return;
    aktiv = false;
    afspiller = false;
    vend = null;
    gruppe.visible = false;
    const s = verden.styring, k = verden.kamera;
    Object.assign(s, { minDistance: gemt.min, maxDistance: gemt.max, enableZoom: gemt.zoom, rotateSpeed: gemt.drej, minPolarAngle: gemt.polMin, maxPolarAngle: gemt.polMax, autoRotate: gemt.auto });
    k.near = gemt.nær;
    verden.opdateringer.delete(tilpasSyn);
    centrerVindue(); // synsvinklen som før
    visTåger(true);
    visRumstøv(true);
    fase(null);
    forklaring('');
  }

  // Undertekst og "Lige nu" efter, hvor langt man er
  function opdaterTilstand(tving = false) {
    const d = dage();
    const m = størrelsesklasse(d);
    let ny;
    if (d < 0) ny = ['En vinternat i Danmark', 'Du står på en mark og kigger mod syd. Den røde stjerne øverst til venstre i Orion er Betelgeuse. Træk i himlen for at se dig omkring.'];
    else if (d < 1) ny = ['Neutrinoerne kommer først', 'Detektorer dybt under jorden fanger en storm af neutrinoer fra Betelgeuse. Men på himlen kan man ikke se noget endnu.'];
    else if (d < 10) ny = ['Lyset bryder ud', 'Ca. et døgn senere når chokbølgen ud til stjernens overflade. Betelgeuse blusser op og bliver klarere end alle stjerner og planeter.'];
    else if (d < 110) ny = ['Klar som en halvmåne', 'I ca. tre måneder lyser den omtrent som en halvmåne. Om natten kaster den skygger. Vend dig om og se din egen!'];
    else if (m <= DAG_GRÆNSE) ny = ['Den falmer', 'Nu bliver den svagere og mere rød. Om dagen kan man stadig se den, hvis man ved, hvor man skal kigge.'];
    else if (m <= ØJE_GRÆNSE) ny = ['Kun om natten', 'Nu kan den kun ses om natten, og den bliver svagere år for år.'];
    else ny = ['Orion har mistet en skulder', 'Efter ca. fire år kan man ikke længere se den uden kikkert. Tilbage er en neutronstjerne og en sky af gas, der langsomt bliver til en tåge.'];
    if (tving || ny[0] !== faseNu) {
      faseNu = ny[0];
      fase(...ny);
    }
    const dagTekst = dag > 0.5 ? (m <= DAG_GRÆNSE ? ' Den kan ses om dagen.' : ' Om dagen kan den ikke ses.') : '';
    forklaring(d < 0 ? '<p>Betelgeuse er en rød kæmpestjerne ca. 550 lysår væk.</p>'
      : `<p><b>${tidTekst(d)}</b> efter neutrinoerne. Betelgeuse lyser ${sammenlign(m)}.${dagTekst}</p>`);
  }

  function sætVærdi(v, fraSkyder = false) {
    værdi = Math.max(0, Math.min(SKYDER.max, v));
    if (!fraSkyder) skyder.sæt?.(Math.round(værdi));
    opdaterTilstand();
  }

  const skyder = {
    skyder: true, navn: 'Tid efter eksplosionen', min: 0, max: SKYDER.max, værdi: 0,
    vis: (x) => tidTekst(dageFraSkyder(x)),
    ændring: (x) => { afspiller = false; sætVærdi(x, true); },
  };

  const styring = [
    himmelKontakt,
    { tekst: '☀️ Om dagen', til: false, skift: (til) => { dagMål = til ? 1 : 0; if (ROLIG) dag = dagMål; opdaterTilstand(true); } },
    { tekst: '✨ Navne og streger', til: true, skift: (til) => { visNavne = til; } },
    skyder,
    {
      tekst: '💥 Lad Betelgeuse eksplodere', handling: () => {
        sætVærdi(SKYDER.før);
        afspiller = true;
        opdaterKnapper();
      }, skjul: () => afspiller || værdi >= SKYDER.før,
    },
    {
      tekst: '↻ Vend dig om', handling: () => {
        const nu = blikNu();
        const modSyd = Math.abs(((nu[0] - 180 + 540) % 360) - 180) < 90;
        const til = modSyd ? NORD_BLIK : SYD_BLIK;
        vend = { t: ROLIG ? 1 : 0, fra: nu, til };
        if (ROLIG) sætBlik(...til);
      },
    },
    { tekst: '↺ Forfra', handling: () => { afspiller = false; sætVærdi(0); opdaterKnapper(); }, skjul: () => værdi < SKYDER.før },
  ];

  const lys = new THREE.Color();
  function opdater(dt, tid) {
    if (!aktiv) return;
    if (afspiller) {
      // De første timer går langsomt, så man ser neutrinoerne komme før lyset
      const fart = værdi < SKYDER.døgn ? (SKYDER.døgn - SKYDER.før) / 7 : (SKYDER.max - SKYDER.døgn) / (AFSPIL_TID - 7);
      sætVærdi(værdi + fart * dt);
      if (værdi >= SKYDER.max) { afspiller = false; opdaterKnapper(); }
    }
    dag += (dagMål - dag) * Math.min(1, dt * 2.5);

    const d = dage();
    const m = størrelsesklasse(d);
    const styrke = 10 ** (-0.4 * (m + 10)); // 1 = en halvmåne
    const f = farve(d);
    fælles.snFarve.value.setRGB(...f);
    // Betelgeuse i punkterne: farven følger supernovaen, og den forsvinder til sidst
    if (mag[BI] !== m) {
      mag[BI] = m;
      farver.set(f, BI * 3);
      stjerneGeo.attributes.mag.needsUpdate = true;
      stjerneGeo.attributes.farve.needsUpdate = true;
    }
    // Glorien og strålerne, når den er klarere end Sirius
    const glans = THREE.MathUtils.smoothstep(-m, 1, 5);
    const dagDæmp = 1 - 0.7 * dag;
    snGlød.material.color.setRGB(...f).multiplyScalar((0.6 + 2.2 * Math.min(styrke, 3) ** 0.5) * glans * dagDæmp);
    snGlød.material.opacity = glans;
    snGlød.scale.setScalar(6 + 26 * Math.min(styrke, 3) ** 0.35);
    snStråler.material.color.setRGB(...f).multiplyScalar(1.6 * dagDæmp);
    snStråler.material.opacity = glans * Math.min(1, 0.3 + styrke);
    snStråler.scale.setScalar(18 + 70 * Math.min(styrke, 3) ** 0.4);
    snStråler.material.rotation = ROLIG ? 0 : 0.02 * Math.sin(tid * 0.7);
    // Himlen og landskabet
    himmelMat.uniforms.snLys.value = Math.min(styrke, 3);
    himmelMat.uniforms.dag.value = dag;
    const nat = 1 - dag;
    stjerneMat.uniforms.graense.value = (6.2 - 1.8 * Math.min(1, styrke) ** 0.5) * nat + -4.6 * dag;
    stjerneMat.uniforms.tid.value = tid;
    stjerneMat.uniforms.skala.value = verden.renderer.getPixelRatio() * THREE.MathUtils.clamp(innerHeight / 900, 0.75, 1.3);
    landUniforms.snLys.value.setRGB(...f).multiplyScalar(0.45 * Math.min(styrke, 3) ** 0.75 * (1 - 0.85 * dag));
    landUniforms.solLys.value.setRGB(1.8, 1.45, 1.05).multiplyScalar(dag);
    lys.setRGB(0.010, 0.013, 0.022).multiplyScalar(nat).add(c.setRGB(0.30, 0.36, 0.48).multiplyScalar(dag));
    landUniforms.himmelLys.value.copy(lys);
    solGlød.material.opacity = dag * 0.8;
    solKerne.material.opacity = dag;
    navne.visible = visNavne;
    betelgeuseNavn.material.opacity = m > ØJE_GRÆNSE ? 0.45 : 1;
    betelgeuseNavn.position.y = navneHøjde - snStråler.scale.x * 0.12 * glans; // under glorien
    // At vende sig om
    if (vend) {
      vend.t = Math.min(1, vend.t + dt / 2.2);
      const e = vend.t * vend.t * (3 - 2 * vend.t);
      const dk = ((vend.til[0] - vend.fra[0] + 540) % 360) - 180;
      sætBlik(vend.fra[0] + dk * e, vend.fra[1] + (vend.til[1] - vend.fra[1]) * e);
      if (vend.t >= 1) vend = null;
    }
  }

  return {
    styring,
    vis,
    skjul,
    opdater,
    aktiv: () => aktiv,
    test: {
      dage, størrelse: () => størrelsesklasse(dage()), sæt: (v) => { afspiller = false; sætVærdi(v); },
      betelgeuse: () => højdeOgKompas(snRetning.toArray()),
      blik: () => blikNu(),
      afspiller: () => afspiller,
    },
  };
}
