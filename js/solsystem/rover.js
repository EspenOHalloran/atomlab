// Curiosity som 3D-model i Stå på Mars (M8c del 2, docs/plan-mars.md og docs/prompt-mars-ekstra.md afsnit 3): NASA's
// model (billeder/solsystem/landskab/curiosity.glb, gjort mindre af billeder/solsystem/lav_curiosity.py) står på
// roverens plads fra NASA's kortdata med den målte retning, hældning og krængning, og hjulene står på jorden fra
// højdekortet (lag 0 i js/solsystem/landskab.js).
//
// Lyset er det samme som jordens: Solen (sollys) med skygge, himlens lys og lidt lys fra jorden nedefra. Skyggen:
// Roveren tegnes set fra Solen i et lille dybdekort (kun når Solen har flyttet sig). Jorden læser det tæt ved roveren
// (uRover og tRover i landskab.js), og roveren bruger det til sin egen skygge. Bakkernes skygge (lag 0) falder også på
// roveren. Regningen sker i landskabets meter (vRel: øst, op, syd fra stedet), modellen er i meter, og verden i km.
//
// Hentes først ved stedet (ca. 2,9 MB) og frigives med Stå på Mars' billeder, når man letter (frigiv).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';
import { HIMMEL_GLSL } from './landskab.js';
import { MAPPE } from './hent.js';

const SKYGGE_STR = TEST_HURTIG ? 256 : LAV_KVALITET ? 512 : 1024; // pixel i roverens skyggekort
const HALV = 2.8; // m: skyggekortet dækker roveren (halvt så bredt), også med armen ude
const AFSTAND = 50; // m fra roveren mod Solen, hvor skyggekortets kamera står
// Hjulenes laveste punkter i modellen (m, x mod venstre, z fremad), målt i NASA's model
const HJUL = [[-1.06, -1.16], [-1.19, -0.09], [-1.06, 1.10], [1.06, -1.16], [1.19, -0.09], [1.06, 1.10]];
const RADIUS = 2.0; // m: ingen store sten (mellemlaget) så tæt på roverens midte

const VERTEX = /* glsl */ `
  uniform mat4 uMeter;      // fra verden (km) til landskabets meter (øst, op, syd fra stedet)
  varying vec2 vUv;
  varying vec3 vP;
  varying vec3 vNm;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vP = (uMeter * w).xyz;
    vNm = normalize(mat3(uMeter * modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D map, nMap;
  uniform float harMap, harN, nSkala, metal, ru, gennem;
  uniform vec4 farve;
  uniform vec2 uSted;
  uniform sampler2D tS0;    // bakkernes skygge i lag 0
  uniform vec4 bH0;
  uniform float uSkygger;
  uniform sampler2D tRover; // roverens egen skygge (dybden set fra Solen)
  uniform mat4 uRoverM;
  uniform float uRoverPx;
  uniform vec3 uKamM;       // kameraet (m)
  varying vec2 vUv;
  varying vec3 vP;
  varying vec3 vNm;
  ${HIMMEL_GLSL}
  // Normalkortet uden tangenter (afledte på skærmen, som Three.js' perturbNormal2Arb)
  vec3 knuder(vec3 n, vec3 m) {
    vec3 q0 = dFdx(vP), q1 = dFdy(vP);
    vec2 s0 = dFdx(vUv), s1 = dFdy(vUv);
    vec3 a = cross(q1, n), b = cross(n, q0);
    vec3 T = a * s0.x + b * s1.x, B = a * s0.y + b * s1.y;
    float d = max(dot(T, T), dot(B, B));
    float k = d == 0.0 ? 0.0 : inversesqrt(d);
    return normalize(T * (m.x * k) + B * (m.y * k) + n * m.z);
  }
  void main() {
    vec4 a = farve;
    if (harMap > 0.5) a *= texture2D(map, vUv);
    vec3 n = normalize(vNm);
    if (!gl_FrontFacing) n = -n;
    if (harN > 0.5) {
      vec3 m = texture2D(nMap, vUv).xyz * 2.0 - 1.0;
      m.xy *= nSkala;
      n = knuder(n, m);
    }
    vec3 V = normalize(uKamM - vP);
    float i = max(dot(n, uSol), 0.0);
    // Skyggen: roveren selv (4 opslag, flyttet lidt ud langs normalen) og bakkerne
    float sk = 1.0;
    vec3 l = (uRoverM * vec4(vP + n * 0.02, 1.0)).xyz * 0.5 + 0.5;
    if (all(greaterThan(l.xy, vec2(0.0))) && all(lessThan(l.xy, vec2(1.0))) && l.z < 1.0) {
      float o = 0.5 * uRoverPx, s = 0.0;
      s += step(l.z - 0.0002, texture2D(tRover, l.xy + vec2(-o, -o)).r);
      s += step(l.z - 0.0002, texture2D(tRover, l.xy + vec2(o, -o)).r);
      s += step(l.z - 0.0002, texture2D(tRover, l.xy + vec2(-o, o)).r);
      s += step(l.z - 0.0002, texture2D(tRover, l.xy + vec2(o, o)).r);
      sk = s * 0.25;
    }
    vec2 en = uSted + vec2(vP.x, -vP.z);
    sk *= mix(1.0, texture2D(tS0, (en - bH0.xy) * bH0.zw).r, uSkygger);
    // Mat maling og lidt glans på metallet (ingen spejling af omgivelserne, kun Solen og himlen)
    vec3 dif = a.rgb * (1.0 - 0.5 * metal);
    vec3 F0 = mix(vec3(0.04), a.rgb, metal);
    float r2 = max(ru * ru, 0.03);
    float sh = clamp(2.0 / (r2 * r2) - 2.0, 2.0, 400.0);
    float glans = pow(max(dot(n, normalize(uSol + V)), 0.0), sh) * (sh + 8.0) / 25.13;
    vec3 jord = vec3(0.18, 0.118, 0.078) * sollys() * max(uSol.y, 0.0) * (0.5 - 0.5 * n.y); // lys fra jorden nedefra
    vec3 ud = dif * (sollys() * i * sk + himmellys() * (0.55 + 0.45 * n.y) + jord)
      + F0 * (glans * sollys() * i * sk + metal * 0.5 * himmellys());
    gl_FragColor = vec4(ud, gennem > 0.5 ? a.a : 1.0);
  }`;

// land: landskabet fra lavLandskab (Solen, skyggerne og højderne). fil: modellen i billeder/solsystem/.
export function lavRover({ renderer, land, fil }) {
  const rod = new THREE.Group(); // i verden (km): skala 0,001 · roverens plads i meter
  rod.matrixAutoUpdate = false;
  rod.visible = false;
  land.gruppe.add(rod);
  const pose = new THREE.Matrix4(); // fra modellen (m) til landskabets meter
  const uMeter = { value: new THREE.Matrix4() };
  const uKamM = { value: new THREE.Vector3() };
  const { fælles, roverU } = land;
  // Skyggekortet: dybden set fra Solen (et ortografisk kamera i meter)
  const mål = new THREE.WebGLRenderTarget(SKYGGE_STR, SKYGGE_STR, { depthBuffer: true });
  mål.depthTexture = new THREE.DepthTexture(SKYGGE_STR, SKYGGE_STR);
  const lysKam = new THREE.OrthographicCamera(-HALV, HALV, HALV, -HALV, 1, AFSTAND + 70);
  const skyggeScene = new THREE.Scene();
  skyggeScene.overrideMaterial = new THREE.MeshDepthMaterial({ side: THREE.DoubleSide });
  const skyggeRod = new THREE.Group();
  skyggeRod.matrixAutoUpdate = false;
  skyggeScene.add(skyggeRod);
  const regnetSol = new THREE.Vector3(0, -1, 0);
  let model = null; // gltf.scene
  let henter = null; // [klar] mens den hentes
  let vist = false;
  let skyggeGange = 0; // (til tests)
  let plads = null; // til tests: retning, hældning, krængning, hjulene og afstanden

  // Roverens egne materialer (samme lys som jorden)
  function materiale(m) {
    const ny = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: m.map ?? land.tom }, harMap: { value: m.map ? 1 : 0 },
        nMap: { value: m.normalMap ?? land.tom }, harN: { value: m.normalMap ? 1 : 0 }, nSkala: { value: m.normalScale?.x ?? 1 },
        metal: { value: m.metalness ?? 0 }, gennem: { value: m.transparent ? 1 : 0 }, ru: { value: m.roughness ?? 0.6 },
        farve: { value: new THREE.Vector4(m.color.r, m.color.g, m.color.b, m.opacity) },
        uMeter, uKamM, ...fælles, ...roverU,
      },
      vertexShader: VERTEX, fragmentShader: FRAGMENT,
      transparent: m.transparent, depthWrite: !m.transparent,
    });
    ny.extensions = { derivatives: true };
    return ny;
  }

  // Hent modellen (én gang). klar(teksturer) kaldes, når den er klar, med teksturerne, så de kan lægges i grafikkortet.
  function hent(klar) {
    if (model) { klar([]); return; }
    if (henter) { henter.push(klar); return; }
    henter = [klar];
    new GLTFLoader().load(new URL(fil, MAPPE).href, (gltf) => {
      const venter = henter;
      henter = null;
      if (!venter) return; // (frigivet, mens den blev hentet)
      model = gltf.scene;
      const teksturer = new Set();
      model.traverse((o) => {
        if (!o.isMesh) return;
        const m = o.material;
        for (const t of [m.map, m.normalMap]) if (t) { t.anisotropy = 4; teksturer.add(t); }
        o.material = materiale(m);
        m.dispose();
        o.frustumCulled = false; // (skalaen 0,001 og kvantiseringen: den er lille, og der er kun én)
      });
      rod.add(model);
      skyggeRod.add(model.clone());
      for (const f of venter) f([...teksturer]);
    }, undefined, () => {
      const venter = henter;
      henter = null;
      for (const f of venter ?? []) f([]); // (uden model: landskabet vises alligevel)
    });
  }

  // Stil roveren på dens plads (r: bredde, længde, retning, hældning og krængning fra NASA's kortdata, grader).
  // Kaldes, når landskabet er skiftet til stedet (lag 0 og højden under stedet er klar).
  const d2r = THREE.MathUtils.degToRad;
  function stil(r, data) {
    if (!model) return;
    const [b0, l0] = data.ref;
    const øst = data.R * Math.cos(d2r(b0)) * d2r(r.længde - l0);
    const nord = data.R * d2r(r.bredde - b0);
    const s = land.stedEN;
    const dE = øst - s.x, dN = nord - s.y;
    // Fra roveren (x frem, y højre, z ned) til nord-øst-ned: drej om z (retningen), y (hældningen) og x (krængningen)
    const ψ = d2r(r.retning), θ = d2r(r.hældning), φ = d2r(r.krængning);
    const [cψ, sψ, cθ, sθ, cφ, sφ] = [Math.cos(ψ), Math.sin(ψ), Math.cos(θ), Math.sin(θ), Math.cos(φ), Math.sin(φ)];
    const frem = [cθ * cψ, cθ * sψ, -sθ];
    const højre = [sφ * sθ * cψ - cφ * sψ, sφ * sθ * sψ + cφ * cψ, sφ * cθ];
    const ned = [cφ * sθ * cψ + sφ * sψ, cφ * sθ * sψ - sφ * cψ, cφ * cθ];
    const tilM = ([n, e, d], k = 1) => new THREE.Vector3(e * k, -d * k, -n * k); // nord-øst-ned → øst, op, syd
    // Modellen: x mod venstre, y op, z frem
    pose.makeBasis(tilM(højre, -1), tilM(ned, -1), tilM(frem));
    // Hjulene på jorden: gennemsnittet af hjulenes afstand til jorden (højdekortet har 1 m mellem højderne)
    const v = new THREE.Vector3();
    const forskel = HJUL.map(([x, z]) => {
      v.set(x, 0, z).applyMatrix4(pose);
      return land.højdeVed(øst + v.x, nord - v.z) - land.højde - v.y;
    });
    const dz = forskel.reduce((a, b) => a + b, 0) / forskel.length;
    pose.setPosition(dE, dz, -dN);
    rod.matrix.makeScale(0.001, 0.001, 0.001).multiply(pose);
    rod.matrixWorldNeedsUpdate = true;
    skyggeRod.matrix.copy(pose);
    skyggeRod.matrixWorldNeedsUpdate = true;
    roverU.uRover.value.set(øst, nord, RADIUS, 1);
    roverU.uRoverPx.value = 1 / SKYGGE_STR;
    roverU.tRover.value = mål.depthTexture;
    regnetSol.set(0, -1, 0); // (skyggen regnes i næste billede)
    rod.visible = vist = true;
    // Til tests: retningen og hældningen, som de står i 3D, og hvor godt hjulene står på jorden
    const f = new THREE.Vector3(0, 0, 1).transformDirection(pose);
    const h = new THREE.Vector3(-1, 0, 0).transformDirection(pose);
    plads = {
      kompas: (THREE.MathUtils.radToDeg(Math.atan2(f.x, -f.z)) + 360) % 360,
      hældning: THREE.MathUtils.radToDeg(Math.asin(f.y)),
      krængning: THREE.MathUtils.radToDeg(Math.asin(-h.y)),
      hjul: Math.max(...forskel.map((x) => Math.abs(x - dz))),
      afstand: Math.hypot(dE, dN),
      midt: [dE, dz, -dN],
    };
  }

  function skjul() {
    rod.visible = vist = false;
    roverU.uRover.value.w = 0;
    roverU.tRover.value = land.tom;
  }

  const hjælp = new THREE.Matrix4();
  const midt = new THREE.Vector3();
  // Hvert billede, mens man står: meter-matricen, kameraet, og skyggekortet, når Solen har flyttet sig
  function opdater(kamera) {
    if (!vist) return;
    uMeter.value.makeScale(1000, 1000, 1000).multiply(hjælp.copy(land.gruppe.matrixWorld).invert());
    uKamM.value.setFromMatrixPosition(kamera.matrixWorld).applyMatrix4(uMeter.value);
    const sol = fælles.uSol.value;
    if (sol.y < -0.02 || regnetSol.angleTo(sol) < 0.002) return;
    regnetSol.copy(sol);
    midt.set(0, 1.0, 0).applyMatrix4(pose);
    lysKam.position.copy(midt).addScaledVector(sol, AFSTAND);
    lysKam.up.set(0, 1, 0);
    if (Math.abs(sol.y) > 0.99) lysKam.up.set(0, 0, -1);
    lysKam.lookAt(midt);
    lysKam.updateMatrixWorld();
    roverU.uRoverM.value.multiplyMatrices(lysKam.projectionMatrix, lysKam.matrixWorldInverse);
    skyggeScene.updateMatrixWorld();
    const før = renderer.getRenderTarget();
    renderer.setRenderTarget(mål);
    renderer.clear(true, true, false);
    renderer.render(skyggeScene, lysKam);
    renderer.setRenderTarget(før);
    skyggeGange++;
  }

  // Slip modellen (man letter): geometri, materialer og teksturer slettes fra grafikkortet. hent() henter den igen.
  function frigiv() {
    skjul();
    henter = null;
    if (!model) return;
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry.dispose();
      for (const n of ['map', 'nMap']) { const t = o.material.uniforms[n].value; if (t !== land.tom) t.dispose(); }
      o.material.dispose();
    });
    rod.remove(model);
    skyggeRod.clear();
    model = null;
    plads = null;
  }

  return {
    hent, stil, skjul, opdater, frigiv,
    get hentet() { return Boolean(model); },
    test: () => ({ hentet: Boolean(model), vist, skygger: skyggeGange, ...(plads ?? {}) }),
    stop() {
      frigiv();
      land.gruppe.remove(rod);
      mål.dispose();
      mål.depthTexture.dispose();
      skyggeScene.overrideMaterial.dispose();
    },
  };
}
