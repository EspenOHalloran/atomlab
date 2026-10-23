// Titan: en måne gemt i tyk orange dis. I almindeligt lys ser man ikke overfladen, kun toppen af disen.
// Uden om ligger en skal af dis, der bliver tyndere opad (skalahøjde) og lyser som en ring i modlys,
// og længst ude et tyndt, blåligt lag (det "løse" dislag, som Cassini så ca. 500 km oppe).

import * as THREE from 'three';

const DIS_FRAGMENT = /* glsl */ `
  uniform vec3 uMidt, uSol;
  uniform float uR, uH, uStyrke, uLag;
  varying vec3 vPos;
  void main() {
    vec3 d = normalize(vPos - cameraPosition);
    vec3 q = cameraPosition + d * dot(uMidt - cameraPosition, d); // hvor strålen er tættest på Titan
    vec3 ud = q - uMidt;
    float p = length(ud);
    float h = max(p - uR, 0.0);
    float taethed = exp(-h / uH) + 0.35 * exp(-pow((h - uLag) / (uH * 0.35), 2.0)); // disen og det løse lag
    float vinkel = dot(ud / p, uSol);
    float belyst = smoothstep(-0.45, 0.15, vinkel);
    // Disen spreder lyset mest fremad, så den lyser kraftigt som en ring, når Solen står bag Titan
    float fremad = 0.7 + 5.0 * pow(max(dot(d, uSol), 0.0), 4.0);
    vec3 orange = vec3(1.0, 0.58, 0.22);
    vec3 blaa = vec3(0.45, 0.6, 1.0);
    vec3 farve = mix(orange, blaa, smoothstep(uLag * 0.6, uLag * 1.1, h));
    // Bag Titan selv er der ingen dis at se
    float bag = step(uR * 0.995, p);
    gl_FragColor = vec4(farve * taethed * belyst * fremad * uStyrke * bag, 1.0);
  }`;

const TITAN_FRAGMENT = /* glsl */ `
  uniform vec3 uSol;
  uniform sampler2D tKort;
  uniform float uHarKort, uIR;
  varying vec3 vLokal; varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float stoej(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  void main() {
    vec3 p = normalize(vLokal);
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = dot(N, uSol);
    float e = max(dot(N, V), 0.0);
    // Toppen af disen: orange, lidt mørkere mod nord (disen skifter med årstiden) og næsten uden detaljer
    float s = 0.6 * stoej(p * 4.0) + 0.4 * stoej(p * 11.0);
    vec3 farve = mix(vec3(0.78, 0.5, 0.22), vec3(0.62, 0.38, 0.17), smoothstep(0.2, 0.9, p.y)) * (0.94 + 0.06 * s);
    // Lyset spredes i disen, så skyggegrænsen er blød, og kanten er lidt lysere (ikke mørkere som på en klippe)
    float lys = smoothstep(-0.25, 0.6, i) * (0.75 + 0.35 * (1.0 - e));
    vec3 c = farve * lys * 0.92;
    // "Under disen": Cassinis kort i nær-infrarødt lys, hvor man kan se overfladen (mørke klitter, lyse højland)
    if (uHarKort > 0.5) {
      vec3 ir = vec3(texture2D(tKort, vUv).r) * vec3(1.05, 0.95, 0.82) * 0.9 * smoothstep(-0.1, 0.5, i);
      c = mix(c, ir, uIR);
    }
    gl_FragColor = vec4(c, 1.0);
  }`;

const VERTEX = /* glsl */ `
  varying vec3 vLokal; varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vUv = uv;
    vLokal = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 v = modelMatrix * vec4(position, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

// radius: Titans radius i scene-enheder (inkl. disens top). km: km pr. scene-enhed (til dislagets højde)
export function lavTitan(radius, km) {
  const gruppe = new THREE.Group();
  const kugle = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 96, 64),
    new THREE.ShaderMaterial({
      uniforms: { uSol: { value: new THREE.Vector3(1, 0, 0) }, tKort: { value: null }, uHarKort: { value: 0 }, uIR: { value: 0 } },
      vertexShader: VERTEX,
      fragmentShader: TITAN_FRAGMENT,
    }),
  );
  const disMat = new THREE.ShaderMaterial({
    uniforms: {
      uMidt: { value: new THREE.Vector3() },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uR: { value: radius },
      uH: { value: 60 / km }, // disen bliver tyndere opad med en skalahøjde på ca. 60 km i tegningen
      uLag: { value: 500 / km }, // det løse dislag ca. 500 km oppe
      uStyrke: { value: 0.9 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      void main() { vec4 p = modelMatrix * vec4(position, 1.0); vPos = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }`,
    fragmentShader: DIS_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  const dis = new THREE.Mesh(new THREE.SphereGeometry(radius + 700 / km, 96, 64), disMat);
  gruppe.add(kugle, dis);
  const midt = new THREE.Vector3();
  let ir = 0; // 0 = almindeligt lys, 1 = infrarødt (glider blødt imellem)
  let irMål = 0;
  return {
    gruppe,
    sætKort(t) { kugle.material.uniforms.tKort.value = t; kugle.material.uniforms.uHarKort.value = t ? 1 : 0; },
    sætIR(til) { irMål = til ? 1 : 0; },
    sæt(solRetning, dt = 0) {
      ir += (irMål - ir) * Math.min(1, dt * 3);
      kugle.material.uniforms.uIR.value = ir;
      disMat.uniforms.uStyrke.value = 0.9 * (1 - 0.6 * ir); // i infrarødt lys er disen mere gennemsigtig
      kugle.material.uniforms.uSol.value.copy(solRetning);
      disMat.uniforms.uSol.value.copy(solRetning);
      gruppe.getWorldPosition(midt);
      disMat.uniforms.uMidt.value.copy(midt);
    },
  };
}
