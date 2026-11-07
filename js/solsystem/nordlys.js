// Nordlyset om en gasplanet (Jupiter, J5 i docs/plan-jupiter.md): et tyndt lag lige over skyerne, der lyser selv.
// En ring om hver magnetisk pol og en lille plet, hvor magnetfeltets linjer fra en måne rammer planeten (Io's
// "fodspor"). Laget ligger i planetens egne retninger, så det drejer med planeten. Det lyser mest i kanten, hvor man
// ser skråt gennem laget.
//
// Jupiters nordlys lyser mest i ultraviolet og infrarødt lys, som øjet ikke kan se. Derfor vises det kun med kontakten
// "Ultraviolet", i en falsk farve (lilla, som NASA's billeder fra Hubble). Ringen er forenklet: en ring om magnetfeltets
// akse (som om feltet var en stangmagnet), ikke den rigtige, skæve form.
//
// R: radius (scene-enheder, som planetens kugle før den trykkes sammen). Laget lægges i planetens mesh, så det følger
// med, når planeten drejes og trykkes sammen.

import * as THREE from 'three';

export function lavNordlys({ R, segmenter = 96, højde = 0.006 }) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uStyrke: { value: 0 },
      uPolN: { value: new THREE.Vector3(0, 1, 0) }, // magnetfeltets nordpol (planetens egne retninger, enhedsvektor)
      uOval: { value: 0.28 }, // ringens vinkel fra den magnetiske pol (radianer)
      uFod: { value: [new THREE.Vector3(), new THREE.Vector3()] }, // Io's fodspor nord og syd (enhedsvektorer)
      uTid: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLokal;
      varying vec3 vNormal;
      varying vec3 vVerden;
      void main() {
        vLokal = normalize(position);
        vNormal = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
        vec4 v = modelMatrix * vec4(position, 1.0);
        vVerden = v.xyz;
        gl_Position = projectionMatrix * viewMatrix * v;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uStyrke, uOval, uTid;
      uniform vec3 uPolN;
      uniform vec3 uFod[2];
      varying vec3 vLokal;
      varying vec3 vNormal;
      varying vec3 vVerden;
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      float stoej(float x) { float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
      // Én pol: ringen (smal og ujævn langs ringen) og et svagt skær inden for den
      float ring(vec3 p, vec3 pol, float froe) {
        float v = acos(clamp(dot(p, pol), -1.0, 1.0)); // vinkel fra den magnetiske pol
        vec3 e = normalize(cross(pol, abs(pol.x) < 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0)));
        vec3 n = cross(pol, e);
        float az = atan(dot(p, n), dot(p, e));
        float bue = 0.6 + 0.4 * stoej(az * 3.0 + froe + uTid * 0.03) + 0.3 * stoej(az * 11.0 - froe - uTid * 0.07);
        float bred = 0.007 + 0.006 * stoej(az * 5.0 + froe * 2.0);
        float dv = v - uOval * (1.0 + 0.06 * sin(az * 2.0 + froe));
        float hoved = exp(-dv * dv / (bred * bred)) * bue;
        float indenfor = (1.0 - smoothstep(uOval * 0.6, uOval, v)) * 0.05 * (0.6 + 0.4 * stoej(az * 4.0 + uTid * 0.05));
        return hoved + indenfor;
      }
      void main() {
        vec3 p = normalize(vLokal);
        float lys = ring(p, uPolN, 1.3) + ring(p, -uPolN, 7.9);
        for (int i = 0; i < 2; i++) {
          float d = length(p - uFod[i]);
          lys += 0.9 * exp(-d * d / 0.00003);
        }
        // Skråt gennem laget i kanten lyser det mere
        vec3 V = normalize(cameraPosition - vVerden);
        float mu = max(abs(dot(normalize(vNormal), V)), 0.2);
        vec3 farve = vec3(0.72, 0.36, 1.0);
        gl_FragColor = vec4(farve * lys * uStyrke * 0.45 / mu, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(R * (1 + højde), segmenter, segmenter / 2), mat);
  mesh.renderOrder = 1;
  mesh.visible = false;
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  return {
    mesh,
    // Hvor kraftigt det lyser (0: skjult)
    sætStyrke(s) { mat.uniforms.uStyrke.value = s; mesh.visible = s > 0.001; },
    // Den magnetiske nordpol og ringens vinkel fra den (radianer)
    sætPol(retning, oval) { mat.uniforms.uPolN.value.copy(retning).normalize(); mat.uniforms.uOval.value = oval; },
    // Io's fodspor: månens retning (planetens egne retninger) og fodsporets vinkel fra hver magnetisk pol
    sætFod(måne, vinkel) {
      const pol = mat.uniforms.uPolN.value;
      mat.uniforms.uFod.value.forEach((f, i) => {
        p.copy(pol).multiplyScalar(i ? -1 : 1);
        t.copy(måne).addScaledVector(p, -måne.dot(p)).normalize();
        f.copy(p).multiplyScalar(Math.cos(vinkel)).addScaledVector(t, Math.sin(vinkel)).normalize();
      });
    },
    sætTid(tid) { mat.uniforms.uTid.value = tid; },
    fod: () => mat.uniforms.uFod.value,
  };
}
