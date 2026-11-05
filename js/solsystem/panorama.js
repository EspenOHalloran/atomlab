// Rovernes foto (Mars M8c del 1 i docs/plan-mars.md): et 360°-panorama, som en rover har taget der, hvor man står i
// "Stå på Mars". Fotoet ligger på en kugle om kameraet, så man drejer og zoomer som i landskabet og ser i samme
// retning: Det er drejet, så horisonten (Mount Sharp, kraterets rand) står samme sted som i det tegnede landskab.
//
// Fotoene er ligevinklede cylindre (lige mange pixel pr. grad vandret og lodret, målt mod roverens skygge og
// kameraernes retninger). pano-<id>.json (billeder/solsystem/lav_panorama.py) giver retningen ved venstre kant, hvor
// mange grader over vandret den øverste kant er, og hvor mange grader fotoet dækker lodret. Landingsstedets foto følger
// roverens ramme, så det drejes også med roverens hældning (kvaternionen fra roverens ramme til nord-øst-ned).
// Over og under fotoet (og i hullerne mellem billederne) toner det ud til det tegnede landskab (masken).
//
// Farverne: Mens man står, tegnes alt med ACES-tonemapping og en eksponering, der følger lyset (js/scene3d.js og
// eksponering i landskab.js). Fotoet sendes derfor gennem den omvendte ACES-kurve, så det vises med sine egne farver.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG } from '../scene3d.js';

const VERTEX = /* glsl */ `
  varying vec3 vRet;
  void main() {
    vRet = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D tFoto, tMaske;
  uniform mat3 uTilFoto;   // fra verden (øst, op, syd) til fotoets ramme (nord, øst, ned)
  uniform vec3 uVinkel;    // venstre kant (rad fra nord mod øst), øverste kant over vandret (rad), højde (rad)
  uniform float uSynlig;   // 0-1, når fotoet toner ind og ud
  uniform float uEksp;     // eksponeringen (renderer.toneMappingExposure)
  uniform float uOmvendt;  // 1: send farven gennem den omvendte ACES-kurve (0 i tests, der tegner uden efterbehandling)
  varying vec3 vRet;
  // Den omvendte af three.js' ACESFilmicToneMapping (samme matricer og kurve), så fotoet kommer ud med sine egne farver
  vec3 omvendtACES(vec3 p) {
    // De omvendte af ACESInputMat og ACESOutputMat i three.js (regnet på forhånd med numpy)
    const mat3 indOmv = mat3(vec3(1.764741, -0.147028, -0.036337), vec3(-0.675778, 1.160252, -0.162436), vec3(-0.088963, -0.013224, 1.198773));
    const mat3 udOmv = mat3(vec3(0.643038, 0.059269, 0.005962), vec3(0.311187, 0.931436, 0.063929), vec3(0.045775, 0.009295, 0.930118));
    vec3 y = clamp(udOmv * min(p, vec3(0.985)), 0.0, 0.99);
    // y = (v² + 0,0245786 v − 0,000090537) / (0,983729 v² + 0,4329510 v + 0,238081), løst for v
    vec3 a = 0.983729 * y - 1.0;
    vec3 b = 0.4329510 * y - 0.0245786;
    vec3 c = 0.238081 * y + 0.000090537;
    vec3 v = (-b - sqrt(max(b * b - 4.0 * a * c, 0.0))) / (2.0 * a);
    return max(indOmv * v, 0.0) * 0.6 / uEksp;
  }
  void main() {
    vec3 d = normalize(vRet);
    vec3 f = uTilFoto * d;
    float az = atan(f.y, f.x);
    float el = asin(clamp(-f.z, -1.0, 1.0));
    float u = (az - uVinkel.x) / 6.2831853;
    float v = 1.0 - (uVinkel.y - el) / uVinkel.z;
    if (v < 0.0 || v > 1.0) discard;
    vec2 uv = vec2(fract(u), v);
    // Afledte uden spring ved sømmen, hvor fract springer (ellers en streg af det groveste mipmap-niveau)
    float u2 = fract(u + 0.5);
    vec2 dx = vec2(dFdx(uv.x), dFdx(v)), dy = vec2(dFdy(uv.x), dFdy(v));
    if (abs(dFdx(u2)) < abs(dx.x)) dx.x = dFdx(u2);
    if (abs(dFdy(u2)) < abs(dy.x)) dy.x = dFdy(u2);
    float a = textureGrad(tMaske, uv, dx, dy).r * uSynlig;
    if (a < 0.002) discard;
    vec3 c = textureGrad(tFoto, uv, dx, dy).rgb;
    gl_FragColor = vec4(uOmvendt > 0.5 ? omvendtACES(c) : c, a);
  }`;

const TONE_TID = 0.6; // sekunder, som fotoet toner ind og ud over

// hent(navn, færdig, valg) som i js/kosmos/mars.js (billederne bliver i grafikkortet). mappe: billeder/solsystem/.
export function lavPanorama({ renderer, hent, mappe }) {
  const maks = renderer.capabilities.maxTextureSize;
  const størrelse = TEST_HURTIG ? 'lille' : LAV_KVALITET || maks < 8192 ? '4k' : '8k';
  const anisotropi = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const u = {
    tFoto: { value: null }, tMaske: { value: null }, uTilFoto: { value: new THREE.Matrix3() },
    uVinkel: { value: new THREE.Vector3() }, uSynlig: { value: 0 }, uEksp: { value: 1 }, uOmvendt: { value: TEST_HURTIG ? 0 : 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: u, vertexShader: VERTEX, fragmentShader: FRAGMENT,
    side: THREE.BackSide, transparent: true, depthTest: false, depthWrite: false,
  });
  mat.extensions = { derivatives: true };
  // 400 km: inden for himlen (500 km) og uden for stjernerne er ikke nødvendigt, for fotoet tegnes til sidst uden dybde
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(400, 64, 32), mat);
  kugle.renderOrder = 20; // efter landskabet og himlen
  kugle.frustumCulled = false;
  kugle.visible = false;

  const data = {}; // id → JSON
  let vist = null; // id på det viste foto
  let mål = 0; // 1: fotoet skal vises, 0: skjules
  let hentId = 0;
  const q = new THREE.Quaternion();
  const m4 = new THREE.Matrix4();
  // Fra verden (x øst, y op, z syd) til nord-øst-ned
  const tilNØN = new THREE.Matrix3().set(0, 0, -1, 1, 0, 0, 0, -1, 0);

  function brug(id, d, foto, maske) {
    // Kvaternionen går fra fotoets ramme til nord-øst-ned. Shaderen skal den modsatte vej: fra verden til fotoets ramme
    const [w, x, y, z] = d.kvaternion;
    q.set(x, y, z, w).invert();
    u.uTilFoto.value.setFromMatrix4(m4.makeRotationFromQuaternion(q)).multiply(tilNØN);
    u.uVinkel.value.set(THREE.MathUtils.degToRad(d.venstre), THREE.MathUtils.degToRad(d.op), THREE.MathUtils.degToRad(d.højde));
    u.tFoto.value = foto;
    u.tMaske.value = maske;
    vist = id;
  }

  // Vis fotoet fra stedet id (hentes første gang). klar() kaldes, når det er hentet og begynder at tone ind.
  function vis(id, klar) {
    const mit = ++hentId;
    mål = 1;
    let foto = null, maske = null;
    const færdig = () => {
      if (mit !== hentId || !foto || !maske || !data[id]) return;
      brug(id, data[id], foto, maske);
      kugle.visible = true;
      klar?.();
    };
    if (!data[id]) {
      fetch(new URL(`landskab/pano-${id}.json`, mappe)).then((s) => s.json()).then((d) => { data[id] = d; færdig(); }).catch(() => {});
    }
    hent(`landskab/pano-${id}-${størrelse}.jpg`, (t) => { foto = t; færdig(); }, { anisotropi });
    hent(`landskab/pano-${id}-maske.png`, (t) => { maske = t; færdig(); }, { farve: false, kanaler: 1 });
  }
  // Skjul fotoet. straks: uden at tone ud (fx når man letter eller går til et andet sted)
  function skjul(straks = false) {
    hentId++;
    mål = 0;
    if (straks) {
      u.uSynlig.value = 0;
      kugle.visible = false;
      vist = null;
    }
  }

  return {
    kugle,
    vis,
    skjul,
    // Er fotoet slået til (også mens det hentes eller toner ind)?
    get til() { return mål === 1; },
    get vist() { return vist; },
    // Hvert billede: kuglen følger kameraet, toningen og eksponeringen
    opdater(kamera, dt, rolig) {
      kugle.position.copy(kamera.position);
      u.uEksp.value = renderer.toneMappingExposure;
      if (!kugle.visible) return;
      const s = u.uSynlig.value;
      u.uSynlig.value = rolig ? mål : THREE.MathUtils.clamp(s + Math.sign(mål - s) * (dt / TONE_TID), 0, 1);
      if (mål === 0 && u.uSynlig.value === 0) {
        kugle.visible = false;
        vist = null;
      }
    },
    // Retningen (kompas og grader over vandret) til et punkt i fotoet (u, v fra 0 til 1, v = 0 øverst). Kun til tests.
    retning(id, uu, vv) {
      const d = data[id];
      if (!d) return null;
      const az = THREE.MathUtils.degToRad(d.venstre + uu * 360), el = THREE.MathUtils.degToRad(d.op - vv * d.højde);
      const f = new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), -Math.sin(el)); // nord, øst, ned
      const [w, x, y, z] = d.kvaternion;
      f.applyQuaternion(new THREE.Quaternion(x, y, z, w));
      return { kompas: (THREE.MathUtils.radToDeg(Math.atan2(f.y, f.x)) + 360) % 360, vinkel: THREE.MathUtils.radToDeg(Math.asin(-f.z)) };
    },
    test: () => ({ vist, til: mål === 1, synlig: u.uSynlig.value, størrelse, foto: u.tFoto.value?.image?.src?.split('/').pop() ?? null }),
    stop() {
      kugle.geometry.dispose();
      mat.dispose();
    },
  };
}
