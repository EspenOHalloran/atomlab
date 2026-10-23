// En gasplanet (til prototypen: Saturn): en fladtrykt kugle med skybånd, lys og skygge fra ringene.
// Har vi et kort (billede), bruges det. Ellers tegnes båndene af shaderen.

import * as THREE from 'three';
import { RING_GLSL } from './ringe.js';

// skala: km pr. scene-enhed. radius og polRadius i km. ringTekstur: fra ringe.js (til ringenes skygge).
export function lavGasplanet({ skala, radius, polRadius, ringTekstur, ringInd, ringUd, kort = null, segmenter = 128 }) {
  const R = radius / skala;
  const flad = polRadius / radius;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tKort: { value: kort },
      uHarKort: { value: kort ? 1 : 0 },
      tRing: { value: ringTekstur },
      uRingInd: { value: ringInd / skala },
      uRingUd: { value: ringUd / skala },
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uAkse: { value: new THREE.Vector3(0, 1, 0) },
      uMidt: { value: new THREE.Vector3() },
      uTid: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vVerden;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(transpose(inverse(mat3(modelMatrix))) * normal); // rigtig normal på en fladtrykt kugle
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: /* glsl */ `
      ${RING_GLSL}
      uniform sampler2D tKort;
      uniform float uHarKort, uTid;
      uniform vec3 uSol, uAkse, uMidt;
      varying vec3 vNormal;
      varying vec3 vVerden;
      varying vec2 vUv;
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      float stoej(float x) { float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
      // Skybånd uden billede: lyse zoner og mørkere bælter, der følger breddegraden
      vec3 baand(vec2 uv) {
        float b = uv.y * 2.0 - 1.0; // -1 (sydpol) til 1 (nordpol)
        float x = uv.x * 6.2832;
        float w = b * 9.0 + 0.08 * sin(x * 3.0 + b * 20.0) + 0.05 * sin(x * 7.0 - uTid * 0.02);
        float s = 0.55 * stoej(w * 2.3) + 0.3 * stoej(w * 5.1 + 7.0) + 0.15 * stoej(w * 11.0 + 3.0);
        vec3 lys = vec3(0.93, 0.84, 0.64);
        vec3 moerk = vec3(0.74, 0.61, 0.42);
        vec3 f = mix(moerk, lys, s);
        f = mix(f, vec3(0.62, 0.64, 0.66), smoothstep(0.78, 0.95, abs(b))); // gråblå ved polerne
        return f;
      }
      void main() {
        vec3 N = normalize(vNormal);
        vec3 farve = uHarKort > 0.5 ? texture2D(tKort, vUv).rgb : baand(vUv);
        float lys = max(dot(N, uSol), 0.0);
        // Blød overgang ved grænsen mellem dag og nat (lyset spredes i de øverste skyer)
        lys = smoothstep(-0.05, 0.35, dot(N, uSol)) * (0.35 + 0.65 * lys);
        // Ringenes skygge: hvor rammer strålen mod Solen ringenes plan?
        vec3 d = vVerden - uMidt;
        float sn = dot(uSol, uAkse);
        float t = -dot(d, uAkse) / sn;
        float skygge = 1.0;
        if (t > 0.0 && abs(sn) > 0.001) {
          vec3 q = d + t * uSol;
          vec4 ring = ringData(length(q));
          skygge = exp(-ring.a / abs(sn));
        }
        // Lidt mørkere mod kanten (randformørkelse)
        vec3 V = normalize(cameraPosition - vVerden);
        float rand = 0.75 + 0.25 * max(dot(N, V), 0.0);
        // I modlys lyser atmosfæren som en tynd ring i kanten (lyset spredes fremad i de øverste lag)
        float kant = pow(1.0 - max(dot(N, V), 0.0), 6.0) * pow(max(dot(-V, uSol), 0.0), 3.0);
        gl_FragColor = vec4(farve * lys * mix(0.12, 1.0, skygge) * rand * 1.15 + vec3(1.0, 0.85, 0.6) * kant * 0.9, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R, segmenter, segmenter / 2), mat);
  mesh.scale.y = flad;
  const akse = new THREE.Vector3();
  const midt = new THREE.Vector3();
  const hjælpS = new THREE.Vector3();
  return {
    mesh,
    radius: R,
    flad,
    sætKort(t) { mat.uniforms.tKort.value = t; mat.uniforms.uHarKort.value = t ? 1 : 0; },
    // Kaldes hvert billede med Solens retning (verden)
    sæt(solRetning, tid) {
      mesh.updateWorldMatrix(true, false);
      mesh.getWorldPosition(midt);
      // Ringenes skygge regnes i verdens enheder (Saturn i baggrunden er skaleret)
      const s = mesh.getWorldScale(hjælpS).x;
      mat.uniforms.uRingInd.value = (ringInd / skala) * s;
      mat.uniforms.uRingUd.value = (ringUd / skala) * s;
      akse.set(0, 1, 0).transformDirection(mesh.parent ? mesh.parent.matrixWorld : mesh.matrixWorld);
      mat.uniforms.uSol.value.copy(solRetning);
      mat.uniforms.uAkse.value.copy(akse);
      mat.uniforms.uMidt.value.copy(midt);
      mat.uniforms.uTid.value = tid;
      return { midt, akse };
    },
  };
}
