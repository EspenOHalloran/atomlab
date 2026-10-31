// Enceladus: en kugle af is med kratere mod nord og de fire "tigerstriber" ved sydpolen,
// og fontænerne af vand og is, der sprøjter op fra striberne. De lyser mest i modlys (lyset spredes fremad).
// Tal fra docs/fakta-solsystemet.md: radius 252 km, 4 striber på ca. 130 km (Wikipedia, "Faktatjek U3"), ca. 35 km imellem, 101 gejsere (Porco 2014).

import * as THREE from 'three';
import { LAV_KVALITET } from '../scene3d.js';

const STRIBER = 4;
const STRIBE_LÆNGDE = 130; // km
const STRIBE_AFSTAND = 35; // km
const RADIUS_KM = 252;
// Striberne ligger skråt over sydpolen, ca. langs længdegraderne 144° og 324° øst (målt på Cassinis kort).
// På kuglen svarer det til at dreje dem 36° om aksen (længdegrad 0° vender mod +x, mod Saturn).
const STRIBE_VINKEL = THREE.MathUtils.degToRad(36);

// Et punkt på stribe k (0-3) ved s (-1 til 1 langs striben), som retning fra månens midte (sydpolen er -y)
function stribePunkt(k, s, mål = new THREE.Vector3()) {
  const x = (s * STRIBE_LÆNGDE) / 2 / RADIUS_KM;
  const z = ((k - (STRIBER - 1) / 2) * STRIBE_AFSTAND) / RADIUS_KM + 0.012 * Math.sin(s * 3 + k);
  const c = Math.cos(STRIBE_VINKEL), si = Math.sin(STRIBE_VINKEL);
  return mål.set(x * c - z * si, -1, x * si + z * c).normalize();
}

const OVERFLADE_FRAGMENT = /* glsl */ `
  uniform vec3 uSol;
  uniform sampler2D tKort;
  uniform float uHarKort;
  varying vec2 vUv;
  varying vec3 vLokal;
  varying vec3 vNormal;
  varying vec3 vVerden;
  float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float stoej(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  // Kratere: lyse kanter og lidt mørkere bund, kun på den gamle overflade mod nord
  float kratere(vec3 p) {
    float k = 0.0;
    for (int i = 0; i < 3; i++) {
      vec3 q = p * (5.0 + float(i) * 6.0);
      vec3 c = floor(q) + 0.5 + (vec3(hash3(floor(q)), hash3(floor(q) + 3.1), hash3(floor(q) + 7.7)) - 0.5) * 0.6;
      float d = length(q - c);
      float r = 0.25 + 0.2 * hash3(floor(q) + 1.3);
      k += (smoothstep(r, r * 0.6, d) * -0.5 + smoothstep(r * 1.3, r, d) * smoothstep(r * 0.8, r, d) * 0.6) * (1.0 - float(i) * 0.25);
    }
    return k;
  }
  void main() {
    vec3 p = normalize(vLokal);
    float nord = smoothstep(-0.6, -0.2, p.y); // den glatte, unge sydpol har ingen kratere
    float k = kratere(p) * nord;
    float s = 0.5 * stoej(p * 9.0) + 0.3 * stoej(p * 23.0) + 0.2 * stoej(p * 61.0);
    vec3 farve = vec3(0.93, 0.95, 0.98) * (0.88 + 0.12 * s) + k * 0.1;
    // Revner over hele månen (svagt blålige)
    float revne = smoothstep(0.03, 0.0, abs(stoej(p * 7.0 + 2.0) - 0.5)) * 0.25;
    // Tigerstriberne ved sydpolen: fire lange, blålige sprækker
    vec2 sp0 = p.xz / max(-p.y, 0.01);
    vec2 sp = vec2(sp0.x * ${Math.cos(STRIBE_VINKEL).toFixed(5)} + sp0.y * ${Math.sin(STRIBE_VINKEL).toFixed(5)}, -sp0.x * ${Math.sin(STRIBE_VINKEL).toFixed(5)} + sp0.y * ${Math.cos(STRIBE_VINKEL).toFixed(5)});
    float sydpol = smoothstep(-0.8, -0.9, p.y);
    float stribe = 0.0;
    for (int i = 0; i < ${STRIBER}; i++) {
      float ss = clamp(sp.x / ${(STRIBE_LÆNGDE / 2 / RADIUS_KM).toFixed(4)}, -1.0, 1.0);
      float z = (float(i) - ${((STRIBER - 1) / 2).toFixed(1)}) * ${(STRIBE_AFSTAND / RADIUS_KM).toFixed(4)} + 0.012 * sin(ss * 3.0 + float(i));
      float laengs = smoothstep(1.05, 0.9, abs(sp.x / ${(STRIBE_LÆNGDE / 2 / RADIUS_KM).toFixed(4)}));
      stribe = max(stribe, smoothstep(0.018, 0.004, abs(sp.y - z)) * laengs);
    }
    stribe *= sydpol;
    farve = mix(farve, vec3(0.55, 0.72, 0.8), max(revne * nord, stribe * 0.75));
    // Med Cassinis kort bruges det i stedet (det er gråt, så isen får et svagt blåt skær).
    // Dæmpet lidt (S1), så de lyse egne ikke bliver helt hvide med glød, og detaljerne kan ses.
    if (uHarKort > 0.5) farve = vec3(0.94, 0.97, 1.0) * min(texture2D(tKort, vUv).r * 1.5, 1.0);
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = max(dot(N, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Isen kaster lyset tilbage næsten som Månen (Lommel-Seeliger blandet med Lambert)
    float lys = mix(i, 2.0 * i / (i + e + 0.001), 0.5);
    gl_FragColor = vec4(farve * lys + farve * 0.012, 1.0);
  }`;

const FONTÆNE_VERTEX = /* glsl */ `
  attribute vec3 aKilde;
  attribute vec3 aRetning;
  attribute float aFase;
  attribute float aFart;
  uniform float uTid, uR, uRVerden, uStr;
  uniform vec3 uSol, uMidt;
  varying float vLys;
  void main() {
    float t = fract(uTid * 0.05 + aFase);           // hvor langt partiklen er på sin tur
    vec3 p = aKilde * uR + aRetning * (aFart * t * uR * 2.2);
    vec4 v = modelMatrix * vec4(p, 1.0);
    vec3 D = normalize(v.xyz - cameraPosition);
    // Lyset spredes fremad af de små iskorn: kraftigst, når Solen står bag fontænerne
    float fremad = 0.12 + 3.6 * pow(max(dot(D, uSol), 0.0), 5.0);
    // I månens skygge er der intet lys
    vec3 d = v.xyz - uMidt;
    float b = dot(d, uSol);
    float skygge = (b < 0.0 && length(d - b * uSol) < uRVerden) ? 0.0 : 1.0;
    vLys = fremad * skygge * (1.0 - t) * smoothstep(0.0, 0.05, t);
    vec4 mv = viewMatrix * v;
    gl_PointSize = uStr * (1.0 + 2.0 * t) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;
const FONTÆNE_FRAGMENT = /* glsl */ `
  varying float vLys;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.85, 0.92, 1.0) * vLys * a * a * 0.045, 1.0);
  }`;

// radius: Enceladus' radius i scene-enheder
export function lavEnceladus(radius) {
  const gruppe = new THREE.Group();
  const overflade = new THREE.ShaderMaterial({
    uniforms: { uSol: { value: new THREE.Vector3(1, 0, 0) }, tKort: { value: null }, uHarKort: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vLokal; varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
      void main() {
        vUv = uv;
        vLokal = position;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: OVERFLADE_FRAGMENT,
  });
  const måne = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), overflade);
  gruppe.add(måne);

  // Fontænerne: 101 gejsere langs de fire striber og mange partikler fra hver
  const gejsere = [];
  let frø = 7;
  const tilf = () => { frø = (frø * 16807) % 2147483647; return frø / 2147483647; };
  for (let i = 0; i < 101; i++) gejsere.push(stribePunkt(i % STRIBER, tilf() * 2 - 1));
  const N = LAV_KVALITET ? 6000 : 16000;
  const kilde = new Float32Array(N * 3);
  const retning = new Float32Array(N * 3);
  const fase = new Float32Array(N);
  const fart = new Float32Array(N);
  const v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const g = gejsere[i % gejsere.length];
    kilde.set([g.x, g.y, g.z], i * 3);
    // Strålerne står næsten lodret op, lidt spredt (ca. 15°)
    v.copy(g).add(new THREE.Vector3(tilf() - 0.5, tilf() - 0.5, tilf() - 0.5).multiplyScalar(0.22)).normalize();
    retning.set([v.x, v.y, v.z], i * 3);
    fase[i] = tilf();
    fart[i] = 0.6 + tilf() * 0.9;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute('aKilde', new THREE.BufferAttribute(kilde, 3));
  geo.setAttribute('aRetning', new THREE.BufferAttribute(retning, 3));
  geo.setAttribute('aFase', new THREE.BufferAttribute(fase, 1));
  geo.setAttribute('aFart', new THREE.BufferAttribute(fart, 1));
  const fontæneMat = new THREE.ShaderMaterial({
    uniforms: {
      uTid: { value: 0 }, uR: { value: radius }, uRVerden: { value: radius }, uStr: { value: radius * 26 },
      uSol: { value: new THREE.Vector3(1, 0, 0) }, uMidt: { value: new THREE.Vector3() },
    },
    vertexShader: FONTÆNE_VERTEX,
    fragmentShader: FONTÆNE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const fontæner = new THREE.Points(geo, fontæneMat);
  fontæner.frustumCulled = false;
  gruppe.add(fontæner);

  const midt = new THREE.Vector3();
  const skala = new THREE.Vector3();
  return {
    gruppe,
    måne,
    fontæner,
    sætKort(t) { overflade.uniforms.tKort.value = t; overflade.uniforms.uHarKort.value = t ? 1 : 0; },
    sæt(solRetning, tid) {
      overflade.uniforms.uSol.value.copy(solRetning);
      fontæneMat.uniforms.uSol.value.copy(solRetning);
      fontæneMat.uniforms.uTid.value = tid;
      gruppe.getWorldPosition(midt);
      fontæneMat.uniforms.uMidt.value.copy(midt);
      // Skyggen og partiklernes størrelse regnes i verdens enheder (Saturn-systemet kan være skaleret)
      const s = gruppe.getWorldScale(skala).x;
      fontæneMat.uniforms.uRVerden.value = radius * s;
      fontæneMat.uniforms.uStr.value = radius * 26 * s;
    },
  };
}
