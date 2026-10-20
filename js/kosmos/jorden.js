// Jorden og Månen som kugler i Kosmos (Årstiderne og Formørkelser).
// Jorden: land og hav, dag og nat, hældning og omdrejning. Månen: grå med mørke "have".
// Begge kan få skygge: Månens skygge på Jorden (solformørkelse) og Jordens skygge på Månen (måneformørkelse).
// Skyggen regnes som i js/data/skygge.js: hvor stor en del af Solen der er dækket, set fra hvert punkt.

import * as THREE from 'three';
import { glød } from './faelles.js';
import { LANDKORT } from '../data/landkort.js';

const RAD = Math.PI / 180;

// Et punkt på Jordens overflade (samme retninger som kortet på kuglen: længde 0 peger mod +x, 90° øst mod -z)
export function overflade(bredde, længde, r) {
  const b = bredde * RAD, l = længde * RAD;
  return new THREE.Vector3(Math.cos(b) * Math.cos(l) * r, Math.sin(b) * r, -Math.cos(b) * Math.sin(l) * r);
}

// Kortet over land og hav som tekstur (hav blåt, land grønt og brunt, is ved polerne). Laves kun én gang.
let jordKort = null;
function jordTekstur() {
  if (jordKort) return jordKort;
  const { bredde: B, højde: H, data } = LANDKORT;
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const c = document.createElement('canvas');
  c.width = B;
  c.height = H;
  const g = c.getContext('2d');
  const billede = g.createImageData(B, H);
  for (let y = 0; y < H; y++) {
    const breddegrad = 90 - (y + 0.5) * (180 / H);
    for (let x = 0; x < B; x++) {
      const i = y * B + x;
      const land = (bytes[i >> 3] >> (7 - (i & 7))) & 1;
      let farve;
      if (land) farve = Math.abs(breddegrad) > 64 ? [228, 236, 242] : Math.abs(breddegrad) < 35 ? [118, 132, 70] : [70, 126, 62];
      else farve = Math.abs(breddegrad) > 78 ? [210, 225, 238] : [22, 66, 140];
      billede.data.set([...farve, 255], i * 4);
    }
  }
  g.putImageData(billede, 0, 0);
  // Tegnet fire gange større med udglatning, så kysterne ikke bliver kantede
  const stor = document.createElement('canvas');
  stor.width = B * 4;
  stor.height = H * 4;
  const sg = stor.getContext('2d');
  sg.imageSmoothingEnabled = true;
  sg.imageSmoothingQuality = 'high';
  sg.drawImage(c, 0, 0, stor.width, stor.height);
  jordKort = new THREE.CanvasTexture(stor);
  jordKort.colorSpace = THREE.SRGBColorSpace;
  return jordKort;
}

// Månens overflade: grå med mørke "have" (store sletter af størknet lava) på den side, der vender mod Jorden
let måneKort = null;
function måneTekstur() {
  if (måneKort) return måneKort;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#b8b8b4';
  g.fillRect(0, 0, 256, 128);
  // Havene (omtrent som på Månens forside, som vender mod Jorden: midten af kortet ved u = 0,25)
  g.fillStyle = 'rgba(70, 72, 78, 0.75)';
  for (const [x, y, r] of [[52, 46, 15], [70, 50, 9], [80, 60, 11], [92, 52, 7], [44, 64, 12], [36, 54, 10], [62, 70, 8], [86, 76, 6]]) {
    g.beginPath();
    g.ellipse(x, y, r * 1.3, r, 0, 0, Math.PI * 2);
    g.fill();
  }
  // Små kratere (faste, så Månen ser ens ud hver gang)
  let s = 7;
  const tilfældig = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    g.fillStyle = `rgba(90, 90, 92, ${0.15 + tilfældig() * 0.2})`;
    g.beginPath();
    g.arc(tilfældig() * 256, 10 + tilfældig() * 108, 1 + tilfældig() * 3, 0, Math.PI * 2);
    g.fill();
  }
  måneKort = new THREE.CanvasTexture(c);
  måneKort.colorSpace = THREE.SRGBColorSpace;
  return måneKort;
}

// Fælles GLSL: hvor stor en del af Solen er dækket af en kugle, set fra punktet p (samme som dækket() i skygge.js)
const SKYGGE_GLSL = `
  uniform vec3 solPos;
  uniform float solR;
  float overlapAreal(float a, float b, float c) {
    if (c >= a + b) return 0.0;
    if (c <= abs(a - b)) return 3.14159265 * min(a, b) * min(a, b);
    float x = acos(clamp((c * c + a * a - b * b) / (2.0 * c * a), -1.0, 1.0));
    float y = acos(clamp((c * c + b * b - a * a) / (2.0 * c * b), -1.0, 1.0));
    return a * a * x + b * b * y - 0.5 * sqrt(max(0.0, (-c + a + b) * (c + a - b) * (c - a + b) * (c + a + b)));
  }
  float daekket(vec3 p, vec3 pos, float r) {
    if (r <= 0.0) return 0.0;
    vec3 ds = solPos - p;
    vec3 dm = pos - p;
    float ls = length(ds), lm = length(dm);
    if (lm >= ls) return 0.0;
    float a = asin(min(1.0, solR / ls));
    float b = asin(min(1.0, r / lm));
    float c = atan(length(cross(ds, dm)), dot(ds, dm));
    return overlapAreal(a, b, c) / (3.14159265 * a * a);
  }`;

const VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 p = modelMatrix * vec4(position, 1.0);
    vPos = p.xyz;
    gl_Position = projectionMatrix * viewMatrix * p;
  }`;

// Jorden: dag og nat (grænsen er lidt blød, som tusmørke) og Månens skygge
const JORD_FRAGMENT = `
  uniform sampler2D kort;
  uniform vec3 maanePos;
  uniform float maaneR;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  ${SKYGGE_GLSL}
  void main() {
    vec3 c = texture2D(kort, vUv).rgb;
    float l = dot(normalize(vNormal), normalize(solPos - vPos));
    float dag = smoothstep(-0.06, 0.1, l) * (1.0 - daekket(vPos, maanePos, maaneR));
    vec3 lys = c * (0.35 + 0.65 * max(l, 0.0));
    vec3 nat = c * 0.06 + vec3(0.004, 0.008, 0.02);
    gl_FragColor = vec4(mix(nat, lys, dag), 1.0);
  }`;

// Månen: lyset fra Solen og Jordens skygge. Helt inde i skyggen bliver den mørk kobberrød (lys bøjet gennem Jordens luft).
const MÅNE_FRAGMENT = `
  uniform sampler2D kort;
  uniform vec3 jordPos;
  uniform float jordR;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  ${SKYGGE_GLSL}
  void main() {
    vec3 c = texture2D(kort, vUv).rgb;
    float l = dot(normalize(vNormal), normalize(solPos - vPos));
    float skygge = daekket(vPos, jordPos, jordR);
    float dag = smoothstep(-0.03, 0.06, l);
    vec3 lys = c * (0.2 + 0.8 * max(l, 0.0)) * dag * (1.0 - skygge);
    vec3 roed = vec3(0.42, 0.11, 0.04) * dot(c, vec3(0.33)) * smoothstep(0.8, 1.0, skygge) * (0.3 + 0.7 * dag);
    gl_FragColor = vec4(lys + roed + c * 0.015, 1.0);
  }`;

// Jorden. hældning i grader (aksen hælder mod +x). Giver grupper tilbage, så man kan flytte, dreje og sætte ting på kloden.
export function lavJorden(radius, { hældning = 23.44 } = {}) {
  const klode = new THREE.Group(); // flyttes rundt
  const hæld = new THREE.Group(); // aksen hælder og peger samme vej hele tiden
  hæld.rotation.z = -hældning * RAD;
  const omdrejning = new THREE.Group(); // drejer om aksen
  klode.add(hæld);
  hæld.add(omdrejning);
  const materiale = new THREE.ShaderMaterial({
    uniforms: {
      kort: { value: jordTekstur() },
      solPos: { value: new THREE.Vector3() },
      solR: { value: 1 },
      maanePos: { value: new THREE.Vector3() },
      maaneR: { value: 0 },
    },
    vertexShader: VERTEX,
    fragmentShader: JORD_FRAGMENT,
  });
  omdrejning.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 40), materiale));
  klode.add(glød(new THREE.Color(0.35, 0.6, 1.2), radius * 2.7, 0.28)); // luften om Jorden

  // En cirkel på Jorden ved en bestemt breddegrad (fx ækvator og polarcirklerne)
  function breddeCirkel(bredde, farve, opacitet) {
    const punkter = [];
    const r = radius * 1.004 * Math.cos(bredde * RAD);
    const y = radius * 1.004 * Math.sin(bredde * RAD);
    for (let i = 0; i <= 96; i++) punkter.push(new THREE.Vector3(Math.cos((i / 96) * Math.PI * 2) * r, y, Math.sin((i / 96) * Math.PI * 2) * r));
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(punkter), new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false }));
  }
  // Solen og (hvis der er en) Månen, som kaster skygge
  function sætLys(solPos, solR, maanePos = null, maaneR = 0) {
    materiale.uniforms.solPos.value.copy(solPos);
    materiale.uniforms.solR.value = solR;
    if (maanePos) materiale.uniforms.maanePos.value.copy(maanePos);
    materiale.uniforms.maaneR.value = maaneR;
  }
  return { klode, hældning: hæld, omdrejning, materiale, breddeCirkel, sætLys };
}

// Månen. Den samme side vender altid mod Jorden (kald vend(jordPos) hvert billede).
export function lavMånen(radius) {
  const gruppe = new THREE.Group();
  const materiale = new THREE.ShaderMaterial({
    uniforms: {
      kort: { value: måneTekstur() },
      solPos: { value: new THREE.Vector3() },
      solR: { value: 1 },
      jordPos: { value: new THREE.Vector3() },
      jordR: { value: 1 },
    },
    vertexShader: VERTEX,
    fragmentShader: MÅNE_FRAGMENT,
  });
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(radius, 40, 24), materiale);
  gruppe.add(kugle);
  function sætLys(solPos, solR, jordPos, jordR) {
    materiale.uniforms.solPos.value.copy(solPos);
    materiale.uniforms.solR.value = solR;
    materiale.uniforms.jordPos.value.copy(jordPos);
    materiale.uniforms.jordR.value = jordR;
  }
  // Forsiden (midt på kortet ved u = 0,25, altså retningen +z i kuglen) vender mod Jorden
  function vend(jordPos) {
    gruppe.lookAt(jordPos);
  }
  return { måne: gruppe, materiale, sætLys, vend };
}
