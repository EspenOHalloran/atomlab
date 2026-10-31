// Saturns ringe: en shader, der tegner dem forfra og bagfra med Saturns skygge.
// Tallene (grænserne og tætheden) står i js/data/ringe.js.

import * as THREE from 'three';
import { RING_IND, RING_UD, TAU_N, ringProfil } from '../data/ringe.js';

export { RING_IND, RING_UD };

// Ringene som et billede på én linje: farve i rgb og τ i alfa (halve float, så den kan filtreres på alle grafikkort).
// 8.192 punkter med τ fra Cassinis måling (js/data/ringe.js).
export function ringTekstur(n = TAU_N) {
  const h = THREE.DataUtils.toHalfFloat;
  // Niveau 0 er punkterne fra målingen (ca. 9 km pr. punkt). De mindre niveauer er gennemsnit af to og to, så de
  // tynde ringe ikke flimrer, når en pixel dækker mange punkter (langt væk).
  let lag = new Float32Array(n * 4);
  ringProfil(n).forEach(({ tau, farve }, i) => lag.set([farve[0], farve[1], farve[2], tau], i * 4));
  const niveauer = [];
  for (let b = n; ; b >>= 1) {
    const data = new Uint16Array(b * 4);
    for (let i = 0; i < b * 4; i++) data[i] = h(lag[i]);
    niveauer.push({ data, width: b, height: 1 });
    if (b === 1) break;
    const mindre = new Float32Array((b >> 1) * 4);
    for (let i = 0; i < mindre.length; i++) mindre[i] = (lag[(i >> 2) * 8 + (i & 3)] + lag[(i >> 2) * 8 + 4 + (i & 3)]) / 2;
    lag = mindre;
  }
  const t = new THREE.DataTexture(niveauer[0].data, n, 1, THREE.RGBAFormat, THREE.HalfFloatType);
  t.mipmaps = niveauer;
  t.generateMipmaps = false;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

// Fælles GLSL: τ og farve for et punkt i ringenes plan (r i scene-enheder). Bruges også af planetens skygge.
export const RING_GLSL = /* glsl */ `
  uniform sampler2D tRing;
  uniform float uRingInd, uRingUd;
  vec4 ringData(float r) {
    float u = (r - uRingInd) / (uRingUd - uRingInd);
    if (u < 0.0 || u > 1.0) return vec4(0.0);
    return texture2D(tRing, vec2(u, 0.5));
  }
`;

// Ringene. skala: km pr. scene-enhed. planet: { midt (Vector3), radius, flad } til Saturns skygge på ringene.
export function lavRinge({ skala, tekstur, planetRadius, flad }) {
  const ind = RING_IND / skala;
  const ud = RING_UD / skala;
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      tRing: { value: tekstur },
      uRingInd: { value: ind },
      uRingUd: { value: ud },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uNormal: { value: new THREE.Vector3(0, 1, 0) },
      uPlanet: { value: new THREE.Vector3() },
      uPlanetR: { value: planetRadius / skala },
      uFlad: { value: flad },
      uLys: { value: 0.54 },
      tFarve: { value: null },
      uHarFarve: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLokal;
      varying vec3 vVerden;
      void main() {
        vLokal = position;
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: /* glsl */ `
      ${RING_GLSL}
      uniform vec3 uSol, uNormal, uPlanet;
      uniform float uPlanetR, uFlad, uLys, uHarFarve;
      uniform sampler2D tFarve;
      varying vec3 vLokal;
      varying vec3 vVerden;
      // Står punktet i Saturns skygge? Saturn er fladtrykt langs aksen (uNormal), så rummet strækkes langs aksen først.
      float planetSkygge(vec3 p) {
        vec3 d = p - uPlanet;
        float dn = dot(d, uNormal);
        vec3 d2 = d + (dn / uFlad - dn) * uNormal;
        float ln = dot(uSol, uNormal);
        vec3 l2 = uSol + (ln / uFlad - ln) * uNormal;
        float a = dot(l2, l2), b = dot(d2, l2), c = dot(d2, d2) - uPlanetR * uPlanetR;
        if (b > 0.0) return 1.0; // Saturn står ikke mellem punktet og Solen
        float disk = b * b - a * c;
        return 1.0 - smoothstep(-0.004, 0.004, disk / (a * uPlanetR * uPlanetR));
      }
      void main() {
        float r = length(vLokal.xy);
        // Gennemsnit over den bredde, én pixel dækker, så de tynde ringe ikke flimrer
        float dr = fwidth(r) * 0.5;
        vec4 ring = (ringData(r - dr) + ringData(r - dr * 0.5) + ringData(r) + ringData(r + dr * 0.5) + ringData(r + dr)) * 0.2;
        float tau = ring.a;
        if (tau <= 0.0) discard;
        vec3 V = normalize(cameraPosition - vVerden);
        float vn = dot(uNormal, V);
        float sn = dot(uNormal, uSol);
        float muV = max(abs(vn), 0.02);
        float muS = max(abs(sn), 0.02);
        float alfa = 1.0 - exp(-tau / muV);
        float lys;
        if (vn * sn > 0.0) {
          // Den belyste side: lyset kastes tilbage fra mange små isklumper
          lys = (1.0 - exp(-tau * (1.0 / muS + 1.0 / muV))) * muS / (muS + muV) * 2.0;
        } else {
          // Bagsiden: kun lys, der slipper igennem. Tætte ringe bliver mørke, tynde ringe lyser (mest i modlys)
          float k = abs(muS - muV) > 0.001 ? (exp(-tau / muS) - exp(-tau / muV)) * muS / (muS - muV) : tau / muV * exp(-tau / muV);
          float fremad = 0.6 + 6.0 * pow(max(dot(-V, uSol), 0.0), 8.0);
          // Der er mere fint støv, hvor ringene er tynde (C-ringen og Cassini-delingen), og støv spreder mest fremad
          lys = max(k, 0.0) * fremad * (0.4 + 2.0 * exp(-2.0 * tau));
        }
        // Farverne og de fine striber fra ringbilledet (Solar System Scope), lagt på de rigtige grænser
        vec3 rgb = uHarFarve > 0.5 ? texture2D(tFarve, vec2((r - uRingInd) / (uRingUd - uRingInd), 0.5)).rgb * 1.6 : ring.rgb;
        vec3 farve = rgb * lys * planetSkygge(vVerden) * uLys;
        gl_FragColor = vec4(farve / max(alfa, 0.001), alfa);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.RingGeometry(ind, ud, 256, 1), mat);
  mesh.rotation.x = -Math.PI / 2; // ringen ligger i Saturns ækvatorplan
  mesh.renderOrder = 2;
  const hjælpN = new THREE.Vector3();
  const hjælpS = new THREE.Vector3();
  return {
    mesh,
    sætFarve(t) { mat.uniforms.tFarve.value = t; mat.uniforms.uHarFarve.value = t ? 1 : 0; },
    // Kaldes hvert billede: Solens retning (verden), Saturns midte og akse.
    // Skyggen regnes i verdens enheder, så Saturns radius ganges med den samlede skala.
    sæt(solRetning, midte, akse) {
      mat.uniforms.uPlanetR.value = (planetRadius / skala) * mesh.getWorldScale(hjælpS).x;
      mat.uniforms.uSol.value.copy(solRetning);
      mat.uniforms.uPlanet.value.copy(midte);
      mat.uniforms.uNormal.value.copy(hjælpN.copy(akse).normalize());
    },
  };
}
