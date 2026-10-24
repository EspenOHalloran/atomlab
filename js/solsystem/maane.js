// En måne af is (fx Mimas, Tethys, Dione og Rhea): Cassinis kort i gråtoner, lyst op af Solen.
// Kortet har længdegrad 0° (siden, der vender mod planeten) i midten og øst til højre, ligesom Enceladus.
// Indtil kortet er hentet (og når månen er langt væk), er den en jævn kugle i månens farve.

import * as THREE from 'three';

const FRAGMENT = /* glsl */ `
  uniform vec3 uSol, uFarve;
  uniform sampler2D tKort;
  uniform float uHarKort, uLys;
  varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vec3 farve = uHarKort > 0.5 ? uFarve * texture2D(tKort, vUv).r * uLys : uFarve * 0.6;
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = max(dot(N, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Isen kaster lyset tilbage næsten som Månen (Lommel-Seeliger blandet med Lambert)
    float lys = mix(i, 2.0 * i / (i + e + 0.001), 0.5);
    gl_FragColor = vec4(farve * lys + farve * 0.012, 1.0);
  }`;

const VERTEX = /* glsl */ `
  varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 v = modelMatrix * vec4(position, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

// radius i scene-enheder. farve: et svagt skær (rgb). lys: ganges på kortet, så månerne får den rigtige lysstyrke i forhold til hinanden.
export function lavIsmåne(radius, { farve = [1, 1, 1], lys = 1 } = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uFarve: { value: new THREE.Vector3(...farve) },
      tKort: { value: null },
      uHarKort: { value: 0 },
      uLys: { value: lys },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const gruppe = new THREE.Group();
  gruppe.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), mat));
  return {
    gruppe,
    sætKort(t) { mat.uniforms.tKort.value = t; mat.uniforms.uHarKort.value = t ? 1 : 0; },
    sæt(solRetning) { mat.uniforms.uSol.value.copy(solRetning); },
  };
}
