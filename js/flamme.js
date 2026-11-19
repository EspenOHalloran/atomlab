// Én fælles flamme (Ild, drejebogen docs/drejebog-ild.md afsnit 11, og senere Lys). Tegnet med en shader på en flade,
// der altid vender mod kameraet (flammen er rund om sin akse). Den kan tre ting:
//   sod:    1 = gul (glødende sod, et stearinlys eller en gasbrænder med lidt luft), 0 = blå (gas med luft nok)
//   tyngde: 1 = spids (varm gas stiger op), 0 = en lille blå halvkugle (vægtløshed, som stearinlysene på Mir)
//   salt:   en farve fra et salt (Lys, "Farv flammen"), saltM 0-1 for hvor meget
// og desuden lys (0 = slukket, 1 = brænder) og bøj (blæst til siden, når man puster).
// Værdierne glider mod deres mål med dt, så flammen står stille under pause (dt = 0). Tiden i shaderen er flammens
// egen og går kun, når opdater(dt) får dt. LAV_KVALITET regner støjen med færre lag.
// Flammens fod (vægens spids) er gruppens (0, 0, 0). Mål i verdensenheder: bredde er den halve bredde, højde hele højden.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG } from './scene3d.js';

const FART = { sod: 2.5, tyngde: 1.6, lys: 4, bøj: 7, saltM: 3 }; // hvor hurtigt hver værdi glider (pr. sekund)
const KANT_X = 1.3; // fladen er 2 · 1,3 halve bredder bred …
const UNDER = 0.25; // … og går 0,25 højder under foden og 1,25 over

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const FRAGMENT = /* glsl */ `
  uniform float uTid;
  uniform float uSod;
  uniform float uTyngde;
  uniform float uLys;
  uniform float uBoej;
  uniform float uSaltM;
  uniform vec3 uSalt;
  uniform vec2 uMaal;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < ${LAV_KVALITET ? 2 : 4}; i++) { s += a * stoej(p); p = p * 2.03 + 7.1; a *= 0.5; }
    return s;
  }
  void main() {
    // x i halve bredder, y i højder (0 ved foden, 1 i spidsen)
    vec2 p = vec2((vUv.x - 0.5) * 2.0 * ${KANT_X.toFixed(2)}, vUv.y * (1.0 + ${UNDER.toFixed(2)} * 2.0) - ${UNDER.toFixed(2)});
    float t = uTid;
    float y = p.y;
    // Flammen blafrer mest foroven, og en gul flamme mere end en blå
    float flak = (fbm(vec2(y * 3.0 - t * 2.6, t * 0.9)) - 0.5) * 0.5 * smoothstep(0.1, 1.0, y) * (0.45 + 0.55 * uSod);
    float x = p.x - uBoej * y * y * 2.4 - flak;
    float h = 1.0 + 0.045 * sin(t * 6.3) + 0.035 * sin(t * 11.7 + 1.3);
    float yy = y / h;
    float w = 0.95 * sqrt(clamp((yy + 0.1) / 0.42, 0.0, 1.0)) * pow(clamp((1.0 - yy) / 0.68, 0.0, 1.0), 0.75);
    float d = abs(x) / max(w, 0.001);
    float krop = (1.0 - smoothstep(0.55, 1.0, d)) * smoothstep(-0.1, -0.04, yy) * (1.0 - smoothstep(0.9, 1.0, yy));

    // Stearinlyset (gult): den mørke kegle om vægen, den blå bund og den gule, lysende del
    float kerne = (1.0 - smoothstep(0.25, 0.62, d)) * (1.0 - smoothstep(0.12, 0.42, yy));
    float blaaBund = exp(-pow((yy + 0.01) / 0.09, 2.0)) * smoothstep(0.3, 0.85, d) * (1.0 - smoothstep(0.95, 1.2, d));
    float gul = krop * smoothstep(0.03, 0.24, yy) * (1.0 - 0.88 * kerne);
    vec3 gulF = mix(vec3(1.9, 1.3, 0.5), vec3(1.35, 0.42, 0.06), smoothstep(0.2, 0.95, d * 0.55 + yy * 0.6));
    float kappe = (1.0 - smoothstep(0.95, 1.35, d)) * smoothstep(-0.1, 0.0, yy) * (1.0 - smoothstep(0.8, 1.05, yy));
    vec3 gulFlamme = gulF * gul + vec3(0.25, 0.45, 1.8) * blaaBund + vec3(0.08, 0.1, 0.4) * krop * kerne * 0.5 + vec3(0.1, 0.12, 0.45) * kappe * 0.25;

    // Gas med luft nok (blå): en lys indre kegle og en svag, blålilla kappe uden sod
    float yi = yy / 0.42;
    float wi = 0.62 * (1.0 - clamp(yi, 0.0, 1.0)) * smoothstep(-0.25, 0.1, yi);
    float di = abs(x) / max(wi, 0.001);
    float indre = smoothstep(-0.12, -0.02, yy) * (1.0 - smoothstep(0.85, 1.0, yi)) * smoothstep(0.35, 0.9, di) * (1.0 - smoothstep(0.95, 1.25, di));
    vec3 blaaFlamme = vec3(0.2, 0.55, 2.0) * indre + vec3(0.16, 0.18, 0.95) * krop * (0.25 + 0.2 * (1.0 - yy));

    vec3 farve = mix(blaaFlamme, gulFlamme, uSod);

    // Vægtløshed: en svag, blå halvkugle om vægen (stearinlyset selv skygger forneden)
    vec2 pw = vec2(p.x * uMaal.x, p.y * uMaal.y);
    float R = uMaal.x * 1.2;
    float r = length(pw - vec2(0.0, R * 0.1)) / R;
    float skal = exp(-pow((r - 0.82) / 0.15, 2.0)) * smoothstep(-0.45, 0.0, pw.y / R);
    float inde = (1.0 - smoothstep(0.55, 0.92, r)) * smoothstep(-0.3, 0.05, pw.y / R) * 0.18;
    vec3 kuppel = vec3(0.3, 0.52, 1.75) * (skal * 0.85 + inde);
    farve = mix(kuppel, farve, smoothstep(0.06, 1.0, uTyngde));

    // Et salt farver flammen (Lys)
    float lum = dot(farve, vec3(0.3, 0.45, 0.25));
    farve = mix(farve, uSalt * lum * 1.7, uSaltM);
    gl_FragColor = vec4(farve * uLys, 1.0);
  }`;

export function lavFlamme({ bredde = 0.55, højde = 2.8, lys = false } = {}) {
  const gruppe = new THREE.Group();
  const uniforms = {
    uTid: { value: Math.random() * 50 },
    uSod: { value: 1 },
    uTyngde: { value: 1 },
    uLys: { value: 0 },
    uBoej: { value: 0 },
    uSaltM: { value: 0 },
    uSalt: { value: new THREE.Color(1, 1, 1) },
    uMaal: { value: new THREE.Vector2(bredde, højde) },
  };
  const materiale = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const fladeH = højde * (1 + 2 * UNDER);
  const geo = new THREE.PlaneGeometry(2 * KANT_X * bredde, fladeH);
  geo.translate(0, fladeH / 2 - UNDER * højde, 0);
  const flade = new THREE.Mesh(geo, materiale);
  flade.renderOrder = 5;
  gruppe.add(flade);
  // Et varmt lys på bordet og lyset (kun den store flamme). Svagere, når flammen er blå eller en halvkugle.
  const lampe = lys ? new THREE.PointLight(0xffa860, 0, 14, 1.6) : null;
  if (lampe) {
    lampe.position.set(0, højde * 0.4, 0);
    gruppe.add(lampe);
  }

  const nu = { sod: 1, tyngde: 1, lys: 0, bøj: 0, saltM: 0 };
  const mål = { ...nu };
  const fart = { ...FART };
  const tV = new THREE.Vector3();

  function sætSalt(farve) {
    if (farve == null) mål.saltM = 0;
    else {
      uniforms.uSalt.value.set(farve);
      mål.saltM = 1;
    }
  }

  return {
    gruppe,
    nu,
    // Nye mål. f: en fart for nogle af dem (fx { lys: 0.3 }, når flammen langsomt kvæles under et glas)
    sæt(ny, f = {}) {
      for (const k of Object.keys(FART)) {
        if (k in ny) mål[k] = ny[k];
        fart[k] = f[k] ?? FART[k];
      }
      if ('salt' in ny) sætSalt(ny.salt);
    },
    // Straks, uden at glide (fx når scenen sættes op)
    straks(ny) {
      if ('salt' in ny) sætSalt(ny.salt);
      for (const k of Object.keys(FART)) {
        if (k in ny) mål[k] = ny[k];
        nu[k] = mål[k];
      }
    },
    mål: () => ({ ...mål }),
    brænder: () => mål.lys > 0.05 || nu.lys > 0.08, // brænder stadig, mens den langsomt går ud
    opdater(dt, kamera) {
      for (const k of Object.keys(FART)) nu[k] += (mål[k] - nu[k]) * (1 - Math.exp(-dt * fart[k]));
      // Med "reducer bevægelse" blafrer flammen langsomt
      uniforms.uTid.value += dt * (ROLIG ? 0.3 : 1);
      uniforms.uSod.value = nu.sod;
      uniforms.uTyngde.value = nu.tyngde;
      uniforms.uLys.value = nu.lys;
      uniforms.uBoej.value = nu.bøj;
      uniforms.uSaltM.value = nu.saltM;
      flade.visible = nu.lys > 0.004;
      // Fladen vender mod kameraet om sin lodrette akse
      gruppe.getWorldPosition(tV);
      flade.rotation.y = Math.atan2(kamera.position.x - tV.x, kamera.position.z - tV.z);
      // Flammen vokser, når den tændes, og er lidt mindre, når den er ved at gå ud
      const s = 0.3 + 0.7 * Math.min(1, nu.lys);
      flade.scale.set(s, s, 1);
      if (lampe) lampe.intensity = nu.lys * 2.2 * (0.35 + 0.65 * nu.sod) * (0.3 + 0.7 * nu.tyngde);
    },
    // Til tests: om flammen tegnes, og dens værdier lige nu
    tilstand: () => ({ ...nu, synlig: flade.visible, tid: uniforms.uTid.value }),
    frigiv() {
      geo.dispose();
      materiale.dispose();
      lampe?.dispose();
      gruppe.removeFromParent();
    },
  };
}
