// En måne af is eller sten (Saturns Mimas, Tethys, Dione og Rhea og Jupiters fire store måner): et kort i gråtoner,
// lyst op af Solen. Kortet har længdegrad 0° (siden, der vender mod planeten) i midten og øst til højre.
// Indtil kortet er hentet (og når månen er langt væk), er den en jævn kugle i månens farve.
//
// Valgfrit (Jupiter, J3): en tone (et lille farvekort, der ganges på, Io) og planetens skygge: Står månen bag planeten
// set fra Solen, bliver den mørk. Skyggen er en cylinder bag den fladtrykte planet, og kanten er så blød som
// halvskyggen (Solens vinkel gange afstanden bag planeten).

import * as THREE from 'three';

const FRAGMENT = /* glsl */ `
  uniform vec3 uSol, uFarve, uPlanet, uAkse;
  uniform sampler2D tKort, tTone;
  uniform float uHarKort, uLys, uHarTone, uToneSkala, uPlanetR, uFlad, uSolVinkel;
  varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vec3 farve = uHarKort > 0.5 ? uFarve * texture2D(tKort, vUv).r * uLys : uFarve * 0.6;
    if (uHarTone > 0.5) farve *= texture2D(tTone, vUv).rgb * uToneSkala;
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = max(dot(N, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Isen kaster lyset tilbage næsten som Månen (Lommel-Seeliger blandet med Lambert)
    float lys = mix(i, 2.0 * i / (i + e + 0.001), 0.5);
    // Planetens skygge: afstanden fra linjen gennem planetens midte i Solens retning (kun bag planeten). Afstanden
    // langs aksen deles med fladtrykningen, så skyggen har planetens form.
    float skygge = 1.0;
    if (uPlanetR > 0.0) {
      vec3 d = vVerden - uPlanet;
      float bag = -dot(d, uSol);
      if (bag > 0.0) {
        vec3 q = d + bag * uSol;
        float a = dot(q, uAkse);
        float tvaers = length(q + uAkse * a * (1.0 / uFlad - 1.0));
        float b = bag * uSolVinkel + uPlanetR * 0.002;
        skygge = smoothstep(uPlanetR - b, uPlanetR + b, tvaers);
      }
    }
    gl_FragColor = vec4(farve * lys * skygge + farve * 0.012, 1.0);
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
// segmenter: felter rundt om kuglen.
export function lavIsmåne(radius, { farve = [1, 1, 1], lys = 1, segmenter = 96 } = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uFarve: { value: new THREE.Vector3(...farve) },
      tKort: { value: null },
      uHarKort: { value: 0 },
      uLys: { value: lys },
      tTone: { value: null },
      uHarTone: { value: 0 },
      uToneSkala: { value: 1 },
      uPlanet: { value: new THREE.Vector3() },
      uAkse: { value: new THREE.Vector3(0, 1, 0) },
      uPlanetR: { value: 0 }, // 0: ingen skygge (Saturns måner)
      uFlad: { value: 1 },
      uSolVinkel: { value: 0 },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const gruppe = new THREE.Group();
  gruppe.add(new THREE.Mesh(new THREE.SphereGeometry(radius, segmenter, Math.round(segmenter * 2 / 3)), mat));
  return {
    gruppe,
    sætKort(t) { mat.uniforms.tKort.value = t; mat.uniforms.uHarKort.value = t ? 1 : 0; },
    // Et lille farvekort, der ganges på (gemt delt med skala, så det ikke klippes)
    sætTone(t, skala = 1) { mat.uniforms.tTone.value = t; mat.uniforms.uHarTone.value = t ? 1 : 0; mat.uniforms.uToneSkala.value = skala; },
    sæt(solRetning) { mat.uniforms.uSol.value.copy(solRetning); },
    // Planetens skygge (alt i verden): midten, ækvatorradius, aksen, fladtrykningen og Solens vinkelradius (radianer)
    skygge(midt, r, akse, flad, solVinkel) {
      const u = mat.uniforms;
      u.uPlanet.value.copy(midt);
      u.uPlanetR.value = r;
      u.uAkse.value.copy(akse);
      u.uFlad.value = flad;
      u.uSolVinkel.value = solVinkel;
    },
  };
}
