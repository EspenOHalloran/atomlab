// Ringene om en gasplanet: en shader, der tegner dem forfra og bagfra med planetens skygge.
// Saturn: tallene (grænserne og tætheden) står i js/data/ringe.js. Isklumperne kaster lyset tilbage forfra.
// Jupiter (J5): js/data/ringe-jupiter.js. Fint støv (støv: true), som næsten kun ses i modlys, fordi det spreder lyset
// fremad (Henyey-Greensteins formel).
// Neptun (UN3): buer (buer: højst så mange klumper i én ring, sat med sætBuer), som ikke kan stå i en tekstur med kun
// radius. De kredser med ringen (sætBueVinkel).

import * as THREE from 'three';
import { RING_IND, RING_UD, TAU_N, ringProfil } from '../data/ringe.js';

export { RING_IND, RING_UD };

// Ringene som et billede på én linje: farve i rgb og τ i alfa (halve float, så den kan filtreres på alle grafikkort).
// 8.192 punkter med τ fra Cassinis måling (js/data/ringe.js). profil: en anden planets ringe (punkter { tau, farve }).
export function ringTekstur(n = TAU_N, profil = ringProfil) {
  const h = THREE.DataUtils.toHalfFloat;
  // Niveau 0 er punkterne fra målingen (ca. 9 km pr. punkt). De mindre niveauer er gennemsnit af to og to, så de
  // tynde ringe ikke flimrer, når en pixel dækker mange punkter (langt væk).
  let lag = new Float32Array(n * 4);
  profil(n).forEach(({ tau, farve }, i) => lag.set([farve[0], farve[1], farve[2], tau], i * 4));
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

// Ringene. skala: km pr. scene-enhed. planetRadius og flad til planetens skygge på ringene. ind og ud: ringenes grænser
// (km, Saturns som standard). støv: fint støv (Jupiter), hvor τ i teksturen er ganget med 1/tauEnhed, og lys gør dem
// lysere end i virkeligheden, så de kan ses. tegnUd: hvor langt ud fladen tegnes (km), hvis de yderste ringe er for svage
// til at ses (så koster de ikke tid). buer: højst så mange buer (Neptun), standard ingen.
export function lavRinge({ skala, tekstur, planetRadius, flad, ind: indKm = RING_IND, ud: udKm = RING_UD, støv = false, tauEnhed = 1, lys = 0.54, tegnUd = udKm, buer = 0 }) {
  const ind = indKm / skala;
  const ud = udKm / skala;
  const defines = {};
  if (støv) defines.STOEV = '';
  if (buer) defines.BUER = buer;
  const mat = new THREE.ShaderMaterial({
    defines,
    ...(støv ? { blending: THREE.AdditiveBlending } : {}),
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
      uLys: { value: lys },
      uTauEnhed: { value: tauEnhed },
      tFarve: { value: null },
      uHarFarve: { value: 0 },
      uBue: { value: Array.from({ length: Math.max(1, buer) }, () => new THREE.Vector4()) },
      uBueTau: { value: new Array(Math.max(1, buer)).fill(0) },
      uBueVinkel: { value: 0 },
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
      uniform float uPlanetR, uFlad, uLys, uHarFarve, uTauEnhed;
      uniform sampler2D tFarve;
      varying vec3 vLokal;
      varying vec3 vVerden;
      #ifdef BUER
      uniform vec4 uBue[BUER]; // indre og ydre radius (scene-enheder), og hvor buen begynder og slutter (radianer)
      uniform float uBueTau[BUER];
      uniform float uBueVinkel; // hvor langt buerne er kredset (radianer, mod uret set fra planetens nordpol)
      float bueHash(float n) { return fract(sin(n) * 43758.5453); }
      // τ fra buerne. Radialt og langs ringen bredes en bue ud over mindst én pixel, så den samlede tæthed bevares og den
      // ikke flimrer. Buerne er klumpede (ca. 0,1-0,2° mellem klumperne, Voyager 2).
      float bueTau(float r, float vinkel) {
        float t = 0.0;
        float dr = fwidth(r);
        for (int i = 0; i < BUER; i++) {
          vec4 b = uBue[i];
          if (uBueTau[i] <= 0.0) continue;
          float midt = 0.5 * (b.x + b.y), halv = 0.5 * (b.y - b.x);
          float h = max(halv, dr);
          float rad = (1.0 - smoothstep(h * 0.7, h, abs(r - midt))) * halv / h;
          if (rad <= 0.0) continue;
          float a = mod(vinkel - uBueVinkel - b.z, 6.28318);
          float l = b.w - b.z;
          float kant = 0.004; // ca. 0,25°: buerne toner ud i enderne
          float langs = smoothstep(-kant, kant, a) * (1.0 - smoothstep(l - kant, l + kant, a));
          float k = a * 57.2958 / 0.15;
          float klump = 0.65 + 0.7 * mix(bueHash(floor(k) + float(i) * 17.0), bueHash(floor(k) + 1.0 + float(i) * 17.0), fract(k));
          t += uBueTau[i] * rad * langs * klump;
        }
        return t;
      }
      #endif
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
        #ifdef STOEV
        vec4 ring = ringData(r); // støvringene er jævne, så ét opslag er nok
        #else
        float dr = fwidth(r) * 0.5;
        vec4 ring = (ringData(r - dr) + ringData(r - dr * 0.5) + ringData(r) + ringData(r + dr * 0.5) + ringData(r + dr)) * 0.2;
        #endif
        float tau = ring.a * uTauEnhed;
        #ifdef BUER
        tau += bueTau(r, atan(vLokal.y, vLokal.x));
        #endif
        if (tau <= 0.0) discard;
        vec3 V = normalize(cameraPosition - vVerden);
        float vn = dot(uNormal, V);
        float sn = dot(uNormal, uSol);
        float muV = max(abs(vn), 0.02);
        float muS = max(abs(sn), 0.02);
        #ifdef STOEV
        // Fint støv, så tyndt at hvert korn kun rammes af lyset én gang: lyset er τ · albedo · P(vinkel) / (4 μ), og
        // P er størst, når lyset kun skal bøje lidt (Solen bag ringene, set fra kameraet). To led: fint støv, der
        // spreder kraftigt fremad, og lidt jævn spredning.
        float c = dot(-uSol, V); // cos til spredningsvinklen: 1, når kameraet ser lige mod Solen gennem ringene
        float g = 0.8;
        float hg = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * c, 1.5);
        float P = 0.9 * hg + 0.1;
        float sollys = planetSkygge(vVerden);
        vec3 farve = ring.rgb * (0.5 * tau * P / (4.0 * muV)) * sollys * uLys;
        gl_FragColor = vec4(farve, 1.0); // lyset lægges til (AdditiveBlending, støvet dækker næsten intet)
        #else
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
        #endif
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.RingGeometry(ind, tegnUd / skala, 256, 1), mat);
  mesh.rotation.x = -Math.PI / 2; // ringen ligger i Saturns ækvatorplan
  mesh.renderOrder = 2;
  const hjælpN = new THREE.Vector3();
  const hjælpS = new THREE.Vector3();
  return {
    mesh,
    // Buerne: [{ ind, ud (km), fra, til (radianer), tau }], højst buer
    sætBuer(liste) {
      mat.uniforms.uBue.value.forEach((v, i) => { const b = liste[i]; if (b) v.set(b.ind / skala, b.ud / skala, b.fra, b.til); else v.set(0, 0, 0, 0); });
      mat.uniforms.uBueTau.value = mat.uniforms.uBueTau.value.map((_, i) => liste[i]?.tau ?? 0);
    },
    sætBueVinkel(v) { mat.uniforms.uBueVinkel.value = v; },
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
