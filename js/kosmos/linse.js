// Lysbøjningen om det sorte hul: en shader, der for hver pixel følger lysets bane baglæns fra kameraet rundt om et
// sort hul, der ikke drejer (Schwarzschild). Banen ligger i et plan, så den regnes som u = 1/r ud fra vinklen φ i planet
// (d²u/dφ² = 3Mu² − u, med RK4). Undervejs krydser den skivens plan, og til sidst falder den ind eller slipper væk og
// viser stjernehimlen i den retning, den ender i. Fysikken og tallene står i js/data/sorthul.js og testes i Node.
//
// Billedet tegnes i et lag for sig (evt. i lavere opløsning på tabletten) og lægges ind i scenen som en flade, der
// dækker hele skærmen. Fladen skriver også dybden (afstanden til skiven eller hullet), så astronauten og stjernen
// forsvinder bag skiven og i skyggen, men tegnes oven på resten. De bliver selv ikke bøjet.
// Navne i shaderkoden har kun ASCII-tegn.

import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { LAV_KVALITET, ROLIG } from '../scene3d.js';
import { M, ISCO, SKIVE_YDERST, FARVER, LOG_T, farvetabel } from '../data/sorthul.js';

// Kvaliteten: pc og tablet. skala = opløsningen af billedet i forhold til skærmen.
export const LINSE_KVALITET = LAV_KVALITET
  ? { skala: 0.5, maks: 110, kort: 0.085, langt: 0.3, oktaver: 2, stjernelag: 2 }
  : { skala: 1, maks: 170, kort: 0.06, langt: 0.24, oktaver: 4, stjernelag: 3 };

const TIDSSKALA = ROLIG ? 3.5 : 14; // tidsenheder (M = 1 → lyset går 0,75 enhed) pr. sekund: inderkanten går rundt på ca. 5 s
const T_INDERST = 6000; // farvetemperaturen (kelvin), hvor skiven er varmest, før rødforskydningen (se "Ærligt talt")
const INGEN_DYBDE = 400; // dybden, hvor der kun er stjernehimmel: bag alt i fænomenet og foran stjernerne i scene3d.js

// Tågeskyerne fra stjernehimlen i scene3d.js (samme retning, størrelse og farve), så de også bliver bøjet
const TÅGER = [
  [0x5b2bff, [-600, 200, -900], 1100],
  [0x0fa3c9, [700, -150, -800], 900],
  [0xc12e8a, [200, 500, 900], 1000],
  [0x2b4bff, [-500, -400, 700], 900],
];

const VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

const FRAGMENT = /* glsl */ `
precision highp float;
#define PI 3.141592653589793
uniform mat4 uKameraVerden;
uniform mat4 uProjInv;
uniform vec3 uKamPos;
uniform float uM;
uniform float uRind;
uniform float uRud;
uniform float uTid;
uniform float uLys;
uniform float uPix;
uniform float uKamG;
uniform vec3 uFarver[FARVER];
uniform vec3 uTaageRet[4];
uniform vec3 uTaageFarve[4];
uniform float uTaageTan[4];
uniform vec3 uBund;
uniform vec2 uTexel;
varying vec2 vUv;

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

// Skridtet i vinklen: kort tæt på hullet, langt langt væk (samme regel som skridt() i js/data/sorthul.js)
float skridt(float u) {
  return mix(LANGT, KORT, smoothstep(0.03, 0.2, u * uM));
}

// Et RK4-skridt for u'' = 3Mu^2 - u (u = 1/r, v = du/dphi)
void rk4(inout float u, inout float v, float h) {
  float k1u = v;
  float k1v = 3.0 * uM * u * u - u;
  float a = u + 0.5 * h * k1u;
  float k2u = v + 0.5 * h * k1v;
  float k2v = 3.0 * uM * a * a - a;
  a = u + 0.5 * h * k2u;
  float k3u = v + 0.5 * h * k2v;
  float k3v = 3.0 * uM * a * a - a;
  a = u + h * k3u;
  float k4u = v + h * k3v;
  float k4v = 3.0 * uM * a * a - a;
  u += h / 6.0 * (k1u + 2.0 * k2u + 2.0 * k3u + k4u);
  v += h / 6.0 * (k1v + 2.0 * k2v + 2.0 * k3v + k4v);
}

// Farven på et sortlegeme ved temperaturen T (kelvin), lineær sRGB med lysstyrken 1 (tabellen fra js/data/sorthul.js)
vec3 sortlegeme(float T) {
  float x = (log(max(T, 1.0)) / log(10.0) - LOG_T0) / (LOG_T1 - LOG_T0) * float(FARVER - 1);
  x = clamp(x, 0.0, float(FARVER - 1) - 0.001);
  int i = int(floor(x));
  return mix(uFarver[i], uFarver[i + 1], fract(x));
}

// Skivens mønster: striber, der følger gassen rundt (vinklen ac er i gassens ramme)
float moenster(float lr, float ac, float froe) {
  vec3 p = vec3(cos(ac) * 3.2, sin(ac) * 3.2, lr * 14.0 + froe);
  float n = 0.0;
  float amp = 0.55;
  for (int o = 0; o < OKTAVER; o++) {
    n += amp * stoej(p);
    p = p * vec3(2.1, 2.1, 1.9) + 3.7;
    amp *= 0.5;
  }
  return n;
}

// Lyset fra skiven, hvor strålen krydser den i punktet x (afstand r fra midten).
// lambda = fotonens drejeimpuls om skivens akse delt med energien. Giver farven (allerede ganget med opaciteten) og opaciteten.
vec4 skive(vec3 x, float r, float lambda, float glat) {
  float xr = r / uRind;
  // Temperaturen (Shakura og Sunyaev): 0 ved inderkanten, varmest ved 49/36 af den. 0.48804 er formlens største værdi.
  float T = pow(xr, -0.75) * pow(max(0.0, 1.0 - sqrt(1.0 / xr)), 0.25) / 0.48804;
  // Rødforskydningen: tyngdekraften og farten (sqrt(1 - 3M/r)) og dopplereffekten (1 / (1 - Omega lambda))
  float om = sqrt(uM / (r * r * r));
  float g = sqrt(1.0 - 3.0 * uM / r) / (1.0 - om * lambda) * uKamG;
  // Gassen kredser mod uret set ovenfra, så vinklen er atan(-z, x). Mønsteret drejer med Omega(r) (hurtigst inderst).
  // To lag, der skiftes ud på skift, så striberne ikke bliver viklet uendeligt tæt (og flimrer) med tiden.
  float a = atan(-x.z, x.x);
  float lr = log(r);
  float P = 9.0 * 14.0; // et lags levetid i tidsenheder (ca. 9 s)
  float t1 = mod(uTid, P);
  float t2 = mod(uTid + 0.5 * P, P);
  float n1 = moenster(lr, a - om * t1, floor(uTid / P) * 13.1);
  float n2 = moenster(lr, a - om * t2, floor((uTid + 0.5 * P) / P) * 13.1 + 6.3);
  float w = sin(PI * t1 / P);
  w *= w;
  float n = mix(mix(n2, n1, w), 0.55, glat);
  float taet = smoothstep(0.25, 0.85, n);
  // Gassen tynder ud yderst og ved inderkanten
  float kant = smoothstep(uRind, uRind * 1.12, r) * (1.0 - smoothstep(uRud * 0.5, uRud, r));
  float alfa = (1.0 - exp(-(0.8 + 3.0 * taet) * 1.2)) * kant;
  // Lysstyrken: alle farver samlet går som T^4 (Stefan-Boltzmann). Rødforskydningen ganger T med g, så lyset ganges
  // med g^4 (I_nu / nu^3 er den samme for alle, og summen over alle frekvenser giver en faktor g mere). Farven er et
  // sortlegeme ved den temperatur, kameraet ser: g * T.
  float gT = g * T;
  float I = LYSSTYRKE * gT * gT * gT * gT * (1.0 + uLys) * (0.45 + 0.75 * taet);
  return vec4(sortlegeme(T_INDERST * gT) * I * alfa, alfa);
}

// Et lag stjerner: en stjerne i nogle af cellerne i et gitter på en terning om himlen
vec3 stjernelag(vec3 d, float N, float p, float str, float lys, float fod, float froe) {
  vec3 a = abs(d);
  vec2 uv;
  float side;
  if (a.x >= a.y && a.x >= a.z) { uv = d.yz / a.x; side = d.x > 0.0 ? 0.0 : 1.0; }
  else if (a.y >= a.z) { uv = d.xz / a.y; side = d.y > 0.0 ? 2.0 : 3.0; }
  else { uv = d.xy / a.z; side = d.z > 0.0 ? 4.0 : 5.0; }
  vec2 c = floor((uv * 0.5 + 0.5) * N);
  float h = hash(vec3(c, side + froe));
  if (h > p) return vec3(0.0);
  vec2 s = (c + 0.2 + 0.6 * vec2(hash(vec3(c, side + froe + 11.0)), hash(vec3(c, side + froe + 23.0)))) / N * 2.0 - 1.0;
  vec3 sd;
  if (side < 1.5) sd = vec3(side < 0.5 ? 1.0 : -1.0, s.x, s.y);
  else if (side < 3.5) sd = vec3(s.x, side < 2.5 ? 1.0 : -1.0, s.y);
  else sd = vec3(s.x, s.y, side < 4.5 ? 1.0 : -1.0);
  float th = length(d - normalize(sd));
  // Stjernens størrelse er nogle få pixel. Bliver én pixel større end stjernen (der hvor lyset presses sammen
  // tæt på skyggen), bredes stjernen ud over pixlen med samme samlede lys, så den ikke flimrer.
  float sigma = str * uPix;
  float se = max(sigma, fod);
  float i = exp(-th * th / (se * se)) * (sigma * sigma) / (se * se);
  float f = hash(vec3(c, side + froe + 37.0));
  vec3 farve = f < 0.5 ? vec3(0.75, 0.85, 1.0) : vec3(1.0, 0.9, 0.7);
  return farve * i * lys * (0.6 + 0.8 * hash(vec3(c, side + froe + 51.0)));
}

// Stjernehimlen og tågeskyerne i retningen d. fod = hvor stor en vinkel én pixel dækker på himlen.
vec3 himmel(vec3 d, float fod) {
  vec3 s = uBund;
  s += stjernelag(d, 30.0, 0.32, 0.45, 0.9, fod, 0.0);
  s += stjernelag(d, 15.0, 0.42, 0.75, 1.2, fod, 100.0);
#if STJERNELAG > 2
  s += stjernelag(d, 7.0, 0.4, 1.1, 1.6, fod, 200.0);
#endif
  for (int k = 0; k < 4; k++) {
    float c = dot(d, uTaageRet[k]);
    if (c <= 0.0) continue;
    float t = sqrt(max(0.0, 1.0 - c * c)) / c / uTaageTan[k];
    float p = t < 0.4 ? mix(0.9, 0.35, t / 0.4) : mix(0.35, 0.0, clamp((t - 0.4) / 0.6, 0.0, 1.0));
    s += uTaageFarve[k] * 0.22 * p;
  }
  return s;
}

// Strålen gennem punktet q på skærmen (-1..1)
vec3 straale(vec2 q) {
  vec4 p = uProjInv * vec4(q, 1.0, 1.0);
  return normalize((uKameraVerden * vec4(normalize(p.xyz / p.w), 0.0)).xyz);
}

// Stoedparameteren b for strålen rd (hvor tæt den ville komme forbi uden tyngdekraft)
float stoed(vec3 rd) {
  float r0 = length(uKamPos);
  return r0 * length(cross(uKamPos / r0, rd)) / sqrt(1.0 - 2.0 * uM / r0);
}

// Følger strålen rd baglæns fra kameraet. Giver lyset fra skiven, hvor meget skiven dækker, dybden (afstanden til
// det første, der dækker), retningen ud mod himlen og fri = 1, hvis strålen slap væk.
void spor(vec3 rd, out vec3 farve, out float daekket, out float dybde, out vec3 ud, out float fri) {
  float r0 = length(uKamPos);
  vec3 e1 = uKamPos / r0;
  vec3 n = cross(e1, rd);
  float sinpsi = length(n);
  float cospsi = dot(e1, rd);
  vec3 e3 = sinpsi > 1e-7 ? n / sinpsi : normalize(cross(e1, abs(e1.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 e2 = cross(e3, e1);
  // Planet, strålen bevæger sig i: punktet ved vinklen phi er r * (cos(phi) e1 + sin(phi) e2)
  float f0 = 1.0 - 2.0 * uM / r0;
  float u = 1.0 / r0;
  float v = -u * sqrt(f0) * cospsi / max(sinpsi, 1e-7);
  float b = r0 * sinpsi / sqrt(f0); // stoedparameteren
  float lambda = -b * e3.y; // fotonen kører den modsatte vej af strålen, vi følger
  // Skivens plan (y = 0) krydses ved phi = phic + k * pi
  float naeste = 1e9;
  if (abs(e1.y) + abs(e2.y) > 1e-6) {
    naeste = atan(-e1.y, e2.y);
    if (naeste < 0.0) naeste += PI;
    if (naeste < 1e-5) naeste += PI;
  }
  farve = vec3(0.0);
  daekket = 0.0;
  dybde = INGEN_DYBDE;
  fri = 0.0;
  float phi = 0.0;
  float k = 0.0; // antal krydsninger med skiven indtil nu
  float slut = 0.0;
  for (int i = 0; i < MAKS_SKRIDT; i++) {
    float h = skridt(u);
    bool plan = phi + h >= naeste;
    if (plan) h = naeste - phi;
    float u2 = u;
    float v2 = v;
    rk4(u2, v2, h);
    if (u2 >= 0.5 / uM) {
      dybde = min(dybde, max(0.0, -cospsi * r0)); // faldt ind: dybden er hullets
      break;
    }
    if (u2 <= 0.0) {
      slut = phi + h * u / (u - u2); // sluppet vaek: vinklen, hvor u = 0
      fri = 1.0;
      break;
    }
    u = u2;
    v = v2;
    phi += h;
    if (plan) {
      float r = 1.0 / u;
      if (r > uRind && r < uRud) {
        vec3 x = r * (cos(phi) * e1 + sin(phi) * e2);
        // Billeder af skiven, der er gået halvt eller helt rundt om hullet, er presset sammen til tynde ringe.
        // Der bliver mønsteret glattet ud, så det ikke flimrer (det er mindre end en pixel alligevel).
        float glat = k > 0.5 ? 1.0 - smoothstep(0.0, 0.12, abs(b / BC - 1.0)) : 0.0;
        vec4 s = skive(x, r, lambda, glat);
        k += 1.0;
        farve += (1.0 - daekket) * s.rgb;
        if (s.a > 0.4 && dybde == INGEN_DYBDE) dybde = distance(x, uKamPos);
        daekket += (1.0 - daekket) * s.a;
        if (daekket > 0.995) break;
      }
      naeste += PI;
    }
  }
  ud = cos(slut) * e1 + sin(slut) * e2;
}

void main() {
  vec2 q = vUv * 2.0 - 1.0;
  vec3 rd = straale(q);
  vec3 farve;
  float daekket, dybde, fri;
  vec3 ud;
  spor(rd, farve, daekket, dybde, ud, fri);
  // Stjernehimlen i den retning, strålen slap væk i (fod måles mellem nabopixel, så det sker for alle pixel)
  float fod = max(length(dFdx(ud)), length(dFdy(ud)));
  float b = stoed(rd);
  float db = max(abs(dFdx(b)), abs(dFdy(b)));
  farve += (1.0 - daekket) * fri * himmel(ud, fod);
  // Lige ved skyggens kant er fotonringen og de tynde billeder af skiven smallere end en pixel. Der følges tre
  // stråler mere gennem pixlen, og lyset lægges sammen, så ringen ikke bliver stiplet.
  if (abs(b - BC) < 2.5 * db + 0.002) {
    vec3 sum = farve;
    for (int j = 0; j < 3; j++) {
      vec2 forskyd = (j == 0 ? vec2(0.33, 0.17) : j == 1 ? vec2(-0.17, 0.33) : vec2(-0.25, -0.3)) * uTexel * 2.0;
      vec3 f2, ud2;
      float d2, dy2, fri2;
      spor(straale(q + forskyd), f2, d2, dy2, ud2, fri2);
      sum += f2 + (1.0 - d2) * fri2 * himmel(ud2, fod);
    }
    farve = sum * 0.25;
  }
  gl_FragColor = vec4(farve, dybde);
}`;

// Fladen i scenen: lægger billedet ind og skriver dybden
const FLADE_FRAGMENT = /* glsl */ `
uniform sampler2D tLinse;
uniform mat4 uProjInv;
uniform mat4 uProj;
varying vec2 vUv;
void main() {
  vec4 l = texture2D(tLinse, vUv);
  vec4 p = uProjInv * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec4 c = uProj * vec4(normalize(p.xyz / p.w) * max(l.a, 0.2), 1.0);
  gl_FragDepth = clamp(c.z / c.w * 0.5 + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(l.rgb, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// Laver lysbøjningen. Giver { flade (læg den i scenen), opdater(tid, lysere), skalaNu(), fjern() }.
export function lavLinse({ lysstyrke = 0.2 } = {}) {
  const q = LINSE_KVALITET;
  const lag = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
  lag.texture.minFilter = lag.texture.magFilter = THREE.LinearFilter;
  const tabel = farvetabel().map((c) => new THREE.Vector3(...c));
  const linseMat = new THREE.ShaderMaterial({
    defines: {
      FARVER, LOG_T0: LOG_T[0].toFixed(3), LOG_T1: LOG_T[1].toFixed(3), MAKS_SKRIDT: q.maks, KORT: q.kort.toFixed(4), LANGT: q.langt.toFixed(4),
      OKTAVER: q.oktaver, STJERNELAG: q.stjernelag, LYSSTYRKE: lysstyrke.toFixed(4), T_INDERST: T_INDERST.toFixed(1), INGEN_DYBDE: INGEN_DYBDE.toFixed(1), BC: (Math.sqrt(27) * M).toFixed(5),
    },
    uniforms: {
      uKameraVerden: { value: new THREE.Matrix4() }, uProjInv: { value: new THREE.Matrix4() }, uKamPos: { value: new THREE.Vector3() },
      uM: { value: M }, uRind: { value: ISCO }, uRud: { value: SKIVE_YDERST }, uTid: { value: 0 }, uLys: { value: 0 }, uPix: { value: 0.001 }, uKamG: { value: 1 },
      uFarver: { value: tabel },
      uTaageRet: { value: TÅGER.map(([, p]) => new THREE.Vector3(...p).normalize()) },
      uTaageFarve: { value: TÅGER.map(([c]) => { const f = new THREE.Color(c); return new THREE.Vector3(f.r, f.g, f.b); }) },
      uTaageTan: { value: TÅGER.map(([, p, s]) => (s / 2) / new THREE.Vector3(...p).length()) },
      uTexel: { value: new THREE.Vector2(1, 1) },
      uBund: { value: (() => { const f = new THREE.Color(0x03040c); return new THREE.Vector3(f.r, f.g, f.b); })() },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });
  const linse = new FullScreenQuad(linseMat);

  const fladeMat = new THREE.ShaderMaterial({
    uniforms: { tLinse: { value: lag.texture }, uProjInv: linseMat.uniforms.uProjInv, uProj: { value: new THREE.Matrix4() } },
    vertexShader: VERTEX,
    fragmentShader: FLADE_FRAGMENT,
    depthTest: true,
    depthFunc: THREE.AlwaysDepth, // dybden skrives altid (uden dybdetest bliver den ikke skrevet)
    depthWrite: true,
  });
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fladeMat);
  flade.frustumCulled = false;
  flade.renderOrder = -1000; // først, så stjernehimlen og fænomenets ting bliver tegnet bagefter og dybdetestet mod den
  const størrelse = new THREE.Vector2();
  const midt = new THREE.Vector3();
  let skala = q.skala;

  flade.onBeforeRender = (renderer, scene, kamera) => {
    // Billedet tegnes i et lag for sig, i den opløsning, der passer til skærmen og kvaliteten
    const mål = renderer.getRenderTarget();
    if (mål) størrelse.set(mål.width, mål.height);
    else renderer.getDrawingBufferSize(størrelse);
    const b = Math.max(1, Math.round(størrelse.x * skala));
    const h = Math.max(1, Math.round(størrelse.y * skala));
    if (lag.width !== b || lag.height !== h) {
      lag.setSize(b, h);
      linseMat.uniforms.uTexel.value.set(1 / b, 1 / h);
    }
    const u = linseMat.uniforms;
    u.uKameraVerden.value.copy(kamera.matrixWorld);
    u.uProjInv.value.copy(kamera.projectionMatrixInverse);
    fladeMat.uniforms.uProj.value.copy(kamera.projectionMatrix);
    flade.parent.getWorldPosition(midt);
    u.uKamPos.value.copy(kamera.position).sub(midt);
    const r0 = u.uKamPos.value.length();
    u.uKamG.value = 1 / Math.sqrt(Math.max(0.05, 1 - (2 * M) / r0));
    // Vinklen pr. punkt (CSS-pixel) midt i billedet: stjernernes størrelse
    u.uPix.value = 2 / (kamera.projectionMatrix.elements[5] * (størrelse.y / renderer.getPixelRatio()));
    renderer.setRenderTarget(lag);
    linse.render(renderer);
    renderer.setRenderTarget(mål);
  };

  return {
    flade,
    // tid: fænomenets ur (står stille under pause). lysere: skiven lyser op, når den får mad.
    opdater(tid, lysere) {
      linseMat.uniforms.uTid.value = tid * TIDSSKALA;
      linseMat.uniforms.uLys.value = lysere;
    },
    sætSkala(s) { skala = s; },
    skala: () => skala,
    fjern() {
      lag.dispose();
      linseMat.dispose();
      fladeMat.dispose();
      flade.geometry.dispose();
    },
  };
}
