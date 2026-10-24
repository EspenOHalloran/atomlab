// En klippeplanet med rigtige højder (først Mars). Kuglen er et fint net, der løftes efter højdekortet i
// vertex-shaderen, så bjergene rager op over horisonten, og kløfter og kratere ligger lavere. Lyset regnes med
// bjergenes skrå sider (ud fra det samme højdekort), så de kaster lys og skygge, når Solen står lavt.
//
// Kortene ligger som Jordens: længdegrad 0° i midten (retningen +x i kuglen), øst til højre (mod −z) og nord opad (+y).
// Højdekortet har 16 bit i rød og grøn (se billeder/solsystem/lav_mars.py).
// Radier og højder regnes i kuglens egne enheder (1 = radius ved ækvator), så det virker, når systemet er skaleret.

import * as THREE from 'three';

const VERTEX = /* glsl */ `
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform float hMin;      // laveste højde i kortet (i radier)
  uniform float hSpan;     // fra laveste til højeste (i radier)
  uniform float overdriv;  // 1 = rigtige højder
  uniform float flad;      // polradius / radius ved ækvator
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vVerden;
  float hoejdeVed(vec2 uv) {
    vec2 v = texture2D(hoejde, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  void main() {
    vUv = uv;
    vec3 n = normalize(position);
    vObjN = n;
    float h = harHoejde > 0.5 ? (hMin + hSpan * hoejdeVed(uv)) * overdriv : 0.0;
    vec3 p = n * vec3(1.0, flad, 1.0) + n * h;
    vec4 v = modelMatrix * vec4(p, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D kort;
  uniform float harKort;
  uniform vec3 farve;      // farven, indtil kortet er hentet
  uniform sampler2D hoejde;
  uniform float harHoejde;
  uniform vec2 texel;      // en pixel i højdekortet (u, v)
  uniform float hSpan;
  uniform float overdriv;
  uniform mat3 rot;        // kuglens drejning (fra dens egne retninger til verdens)
  uniform vec3 uSol;       // retningen mod Solen (i verden)
  varying vec2 vUv;
  varying vec3 vObjN;
  varying vec3 vVerden;
  const float OMGANG = 6.2831853;
  float hoejdeVed(vec2 uv) {
    vec2 v = texture2D(hoejde, uv).rg;
    return v.x * (65280.0 / 65535.0) + v.y * (255.0 / 65535.0);
  }
  void main() {
    vec3 n0 = normalize(vObjN);
    // Retningerne øst og nord på kuglen
    vec3 oest = vec3(n0.z, 0.0, -n0.x);
    float cosB = length(oest);
    oest = cosB > 1e-4 ? oest / cosB : vec3(0.0, 0.0, -1.0);
    vec3 nord = cross(n0, oest);
    // Bjergenes skrå sider: hvor meget højden ændrer sig pr. strækning mod øst og nord (begge i radier)
    vec3 nr = n0;
    if (harHoejde > 0.5) {
      float dO = hoejdeVed(vUv + vec2(texel.x, 0.0)) - hoejdeVed(vUv - vec2(texel.x, 0.0));
      float dN = hoejdeVed(vUv + vec2(0.0, texel.y)) - hoejdeVed(vUv - vec2(0.0, texel.y));
      float s = hSpan * overdriv;
      dO *= s / (2.0 * texel.x * OMGANG * max(cosB, 0.02));
      dN *= s / (texel.y * OMGANG); // 1 i v er en halv omgang, så 2 · texel.y i v er texel.y · OMGANG radianer
      nr = normalize(n0 - dO * oest - dN * nord);
    }
    vec3 N = normalize(rot * n0);
    vec3 Nr = normalize(rot * nr);
    vec3 V = normalize(cameraPosition - vVerden);
    vec3 c = harKort > 0.5 ? texture2D(kort, vUv).rgb : farve;
    float i = max(dot(Nr, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    // Støv og sten: mest som en mat flade (Lambert), lidt som Månen (Lommel-Seeliger), så kanten ikke bliver for mørk
    float lys = mix(i, 2.0 * i / (i + e + 0.05), 0.3);
    // Ved grænsen mellem dag og nat slukker lyset blødt. Bjergsider, der vender mod Solen, lyser lidt længere ind i natten.
    lys *= smoothstep(-0.02, 0.04, dot(mix(N, Nr, 0.6), uSol));
    gl_FragColor = vec4(c * lys + c * 0.006, 1.0);
  }`;

// radius og polRadius i km, skala i km pr. enhed. højdeMin og højdeMax i meter (de samme som i billedværktøjet).
// net: [omkring, fra pol til pol] (hvor fint nettet er)
export function lavKlippeplanet({ skala, radius, polRadius = radius, højdeMin, højdeMax, net = [1024, 512], farve = [0.6, 0.35, 0.2] }) {
  const R = radius / skala;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      kort: { value: null },
      harKort: { value: 0 },
      farve: { value: new THREE.Vector3(...farve) },
      hoejde: { value: null },
      harHoejde: { value: 0 },
      texel: { value: new THREE.Vector2(1, 1) },
      hMin: { value: højdeMin / 1000 / radius },
      hSpan: { value: (højdeMax - højdeMin) / 1000 / radius },
      overdriv: { value: 1 },
      flad: { value: polRadius / radius },
      rot: { value: new THREE.Matrix3() },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const u = mat.uniforms;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, net[0], net[1]), mat);
  mesh.scale.setScalar(R);
  // Bjergene kan rage ud over kuglen (også når de er gjort højere), så den må ikke skæres fra for tidligt
  mesh.geometry.computeBoundingSphere();
  mesh.geometry.boundingSphere.radius = 1.1;
  mesh.onBeforeRender = () => u.rot.value.setFromMatrix4(mesh.matrixWorld);
  return {
    mesh,
    radius: R,
    get overdriv() { return u.overdriv.value; },
    set overdriv(v) { u.overdriv.value = v; },
    sætKort(t) { u.kort.value = t; u.harKort.value = t ? 1 : 0; },
    sætHøjde(t) {
      u.hoejde.value = t;
      u.harHoejde.value = t ? 1 : 0;
      if (t) u.texel.value.set(1 / t.image.width, 1 / t.image.height);
    },
    sæt(solRetning) { u.uSol.value.copy(solRetning); },
    stop() { mesh.geometry.dispose(); mat.dispose(); },
  };
}
