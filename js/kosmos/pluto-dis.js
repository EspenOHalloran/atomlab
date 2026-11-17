// Plutos dis (MP3, docs/drejebog-merkur-pluto.md): en skal om Pluto, der lyser svagt blåt, mest når Solen står bag
// Pluto (modlys), som da New Horizons så sig tilbage 14. juli 2015.
//
// - Luften er meget tynd (ca. 10 mikrobar, 1/100.000 af Jordens), men små partikler af dis (tholiner) når mindst 150 km
//   op i ca. 20 tynde lag. Disen bliver tyndere opad med en skalahøjde på ca. 50 km i tegningen.
// - For hvert punkt regnes, hvor tæt strålen fra kameraet kommer på Pluto (som Titans dis i js/solsystem/atmosfaere.js).
//   Set hen over kanten kigger man gennem meget dis (ca. 12 gange så meget som lige op), så ringen lyser, mens himlen
//   set fra jorden næsten er sort.
// - De små partikler spreder mest lys fremad, og blåt mest, så disen er blå i modlys. Lagene er tegnet efter New
//   Horizons' billeder (afstande på 10-30 km), ikke målt lag for lag.
// Alt regnes i verdens enheder, så det virker, når systemet er skaleret (kameraets rejse).

import * as THREE from 'three';

const FRAGMENT = /* glsl */ `
  uniform vec3 uMidt, uSol;
  uniform float uR, uKm, uH, uStyrke;
  varying vec3 vPos;
  // Lagene: nogle få bølger med forskellig afstand (km), så de ikke ser for regelmæssige ud
  float lag(float hKm) {
    return 0.55 + 0.2 * sin(hKm * 0.31) + 0.15 * sin(hKm * 0.19 + 1.3) + 0.1 * sin(hKm * 0.53 + 2.1);
  }
  void main() {
    vec3 d = normalize(vPos - cameraPosition);
    vec3 tilMidt = uMidt - cameraPosition;
    float t = dot(tilMidt, d);
    vec3 q = cameraPosition + d * max(t, 0.0); // hvor strålen er tættest på Pluto (ikke bag kameraet)
    vec3 ud = q - uMidt;
    float p = length(ud);
    if (t > 0.0 && p < uR) discard; // bag Pluto selv er der ingen dis at se
    float h = p - uR;
    float tangent = sqrt(6.2831853 * uR * uH); // hvor meget dis man kigger igennem hen over kanten
    // Inde i disen (kameraet tæt på jorden) og strålen går opad: kun disen over kameraet
    float mu = dot(d, normalize(cameraPosition - uMidt));
    float del = t > 0.0 ? 1.0 : uH / max(mu * tangent, uH);
    float hKm = h * uKm;
    float taethed = exp(-h / uH) * lag(hKm) * del;
    // Belyst: Solen skal kunne nå punktet (lidt ind over natsiden, for disen står højt)
    float belyst = smoothstep(-0.25, 0.1, dot(ud / p, uSol));
    // Fremad: de små partikler spreder mest lys fremad (mod kameraet, når Solen er bag Pluto)
    float fremad = max(dot(d, uSol), 0.0);
    float lys = 0.035 + 0.5 * pow(fremad, 4.0) + 2.2 * pow(fremad, 24.0);
    vec3 farve = mix(vec3(0.55, 0.62, 0.8), vec3(0.3, 0.52, 1.0), smoothstep(0.3, 0.9, fremad));
    gl_FragColor = vec4(farve * taethed * belyst * lys * uStyrke, 1.0);
  }`;

// radius: Plutos radius i km, km: km pr. enhed (før systemet skaleres). top: hvor højt skallen når (km).
export function lavDis({ radius, km, H = 50, top = 320, styrke = 1 }) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMidt: { value: new THREE.Vector3() },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uR: { value: radius / km },
      uKm: { value: km },
      uH: { value: H / km },
      uStyrke: { value: styrke },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      void main() { vec4 p = modelMatrix * vec4(position, 1.0); vPos = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }`,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry((radius + top) / km, 96, 64), mat);
  mesh.renderOrder = 2;
  const u = mat.uniforms;
  const skala = new THREE.Vector3();
  return {
    mesh,
    // Solens retning i verden. Kaldes hvert billede, efter kameraets rejse har flyttet systemet.
    sæt(solRetning) {
      u.uSol.value.copy(solRetning);
      mesh.getWorldPosition(u.uMidt.value);
      const s = mesh.getWorldScale(skala).x;
      u.uR.value = (radius / km) * s;
      u.uH.value = (H / km) * s;
      u.uKm.value = km / s;
    },
    sætStyrke(v) { u.uStyrke.value = v; },
    get styrke() { return u.uStyrke.value; },
    stop() { mesh.geometry.dispose(); mat.dispose(); },
  };
}
