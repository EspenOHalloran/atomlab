// Den fælles 3D-verden: renderer, kamera, lys, stjernehimmel og glød (bloom).
// Alle dele af AtomLab tegner i den samme verden.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Tablets og telefoner (fingre i stedet for mus) får lidt færre effekter, så det kører glat
export const LAV_KVALITET = matchMedia('(pointer: coarse)').matches;
// Har man slået "reducer bevægelse" til i sit styresystem, drejer kameraet ikke af sig selv, og lysglimt dæmpes
export const ROLIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Kun i automatiske tests: tegn hurtigt (uden glød og i lav opløsning), så animationerne ikke kører i slowmotion i
// testbrowseren. Sættes af tests/hjaelp.mjs, før siden starter. Spillet selv bruger det aldrig.
export const TEST_HURTIG = Boolean(globalThis.atomlabTestHurtig);

const SYNSVINKEL = 40; // kameraets synsvinkel i grader (lodret)

export const verden = {
  renderer: null,
  scene: null,
  kamera: null,
  styring: null,
  komponist: null,
  glød: null,
  vindue: null, // det HTML-element, som 3D-billedet skal centreres i
  hul: { left: 0, top: 0, width: 1, height: 1 },
  målAfstand: null,
  opdateringer: new Set(), // funktioner, der kaldes hvert billede: f(dt, tid)
};

export function lavVerden(lærred) {
  let renderer;
  try {
    // Ingen kantudglatning på selve lærredet: Gløden (komponisten) tegner uden om den, så den kostede kun hukommelse.
    renderer = new THREE.WebGLRenderer({
      canvas: lærred,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch (fejl) {
    return false;
  }
  renderer.setPixelRatio(TEST_HURTIG ? 0.5 : Math.min(devicePixelRatio, LAV_KVALITET ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03040c);

  // Bløde refleksioner på kuglerne
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;

  const kamera = new THREE.PerspectiveCamera(SYNSVINKEL, innerWidth / innerHeight, 0.1, 3000);
  kamera.position.set(0, 6, 34);

  // Lys: et hovedlys, et blåligt kantlys bagfra og lidt lys alle steder
  const hovedlys = new THREE.DirectionalLight(0xffffff, 1.9);
  hovedlys.position.set(6, 10, 12);
  const kantlys = new THREE.DirectionalLight(0x6f8cff, 1.4);
  kantlys.position.set(-10, -4, -12);
  scene.add(hovedlys, kantlys, new THREE.AmbientLight(0x404a70, 0.6));

  lavStjernehimmel(scene);
  lavPiletaster();
  lavRumstøv(scene);

  const styring = new OrbitControls(kamera, renderer.domElement);
  styring.enableDamping = true;
  styring.dampingFactor = 0.08;
  styring.enablePan = false;
  styring.minDistance = 4;
  styring.maxDistance = 250;
  styring.autoRotate = true;
  styring.autoRotateSpeed = 0.5;
  // Når man selv zoomer, stopper den automatiske zoom
  styring.addEventListener('start', () => { verden.målAfstand = null; });

  // Glød: alt, der er lysere end en grænse, får en glorie
  // Kantudglatning kunne slås til her med new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
  // som andet argument til EffectComposer. Den er slået fra, fordi den kostede ca. 40 % af billederne i testbrowseren.
  const komponist = new EffectComposer(renderer);
  komponist.addPass(new RenderPass(scene, kamera));
  const glød = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.9, 0.55, 0.82);
  komponist.addPass(glød);
  komponist.addPass(new OutputPass());

  Object.assign(verden, { renderer, scene, kamera, styring, komponist, glød });

  addEventListener('resize', tilpasStørrelse);
  // Mobiler ændrer størrelse lidt efter, at skærmen drejes
  addEventListener('orientationchange', () => setTimeout(tilpasStørrelse, 300));
  tilpasStørrelse();

  let sidst = performance.now();
  renderer.setAnimationLoop((nu) => {
    const dt = Math.min(0.05, (nu - sidst) / 1000);
    sidst = nu;
    const tid = nu / 1000;
    for (const f of verden.opdateringer) f(dt, tid);
    zoomMod(dt);
    svingKamera(dt);
    if (ROLIG) styring.autoRotate = false;
    styring.update(dt);
    if (TEST_HURTIG) renderer.render(scene, kamera);
    else komponist.render(dt);
  });
  return true;
}

// De farvede tågeskyer er pynt. I vores eget solsystem (fx ved Saturn) er himlen sort med stjerner, så der slås de fra.
const tågeSkyer = [];
export function visTåger(til) {
  for (const t of tågeSkyer) t.visible = til;
}
export const tågerVist = () => tågeSkyer.some((t) => t.visible);

// Stjerner i tre størrelser og nogle farvede tågeskyer langt væk
function lavStjernehimmel(scene) {
  const himmel = new THREE.Group();
  const antal = LAV_KVALITET ? [900, 300, 60] : [1800, 600, 120];
  const størrelser = [1.4, 2.4, 4.0];
  const prik = lavPrikTekstur();
  antal.forEach((n, lag) => {
    const pos = new Float32Array(n * 3);
    const farver = new Float32Array(n * 3);
    const farve = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(700 + Math.random() * 600);
      pos.set([v.x, v.y, v.z], i * 3);
      // Stjerner er hvide, blålige eller gullige
      farve.setHSL(Math.random() < 0.5 ? 0.6 : 0.12, 0.6, 0.75 + Math.random() * 0.25);
      farver.set([farve.r, farve.g, farve.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(farver, 3));
    const mat = new THREE.PointsMaterial({
      size: størrelser[lag], map: prik, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false,
    });
    himmel.add(new THREE.Points(geo, mat));
  });

  const tåger = [
    [0x5b2bff, new THREE.Vector3(-600, 200, -900), 1100],
    [0x0fa3c9, new THREE.Vector3(700, -150, -800), 900],
    [0xc12e8a, new THREE.Vector3(200, 500, 900), 1000],
    [0x2b4bff, new THREE.Vector3(-500, -400, 700), 900],
  ];
  const tågeTekstur = lavPrikTekstur(true);
  for (const [farve, sted, str] of tåger) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tågeTekstur, color: farve, transparent: true, opacity: 0.22,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    sprite.position.copy(sted);
    sprite.scale.setScalar(str);
    himmel.add(sprite);
    tågeSkyer.push(sprite);
  }
  scene.add(himmel);
  verden.opdateringer.add((dt) => { himmel.rotation.y += dt * 0.004; });
}

// Rumstøv: svage prikker, der driver langsomt forbi tæt på atomet og giver dybde
function lavRumstøv(scene) {
  const antal = LAV_KVALITET ? 160 : 360;
  const pos = new Float32Array(antal * 3);
  const farter = new Float32Array(antal * 3);
  for (let i = 0; i < antal; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(22 + Math.random() * 70);
    pos.set([v.x, v.y, v.z], i * 3);
    const f = new THREE.Vector3().randomDirection().multiplyScalar(0.3 + Math.random() * 0.6);
    farter.set([f.x, f.y, f.z], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const støv = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.35, map: lavPrikTekstur(), color: 0x8fb4ff, transparent: true, opacity: 0.45,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  støv.frustumCulled = false;
  scene.add(støv);
  verden.opdateringer.add((dt) => {
    for (let i = 0; i < antal * 3; i++) pos[i] += farter[i] * dt;
    // Støv, der driver for langt væk, kommer ind fra den anden side
    for (let i = 0; i < antal; i++) {
      const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      if (x * x + y * y + z * z > 95 * 95) { pos[i * 3] = -x * 0.9; pos[i * 3 + 1] = -y * 0.9; pos[i * 3 + 2] = -z * 0.9; }
    }
    geo.attributes.position.needsUpdate = true;
  });
}

// En rund, blød prik (eller en stor blød sky) tegnet på et lille lærred
export function lavPrikTekstur(blød = false) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (blød) {
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  } else {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.15)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Fortæller, hvilket HTML-element 3D-billedet skal centreres i
export function sætVindue(element) {
  verden.vindue = element;
  tilpasStørrelse();
}

export function tilpasStørrelse() {
  const { renderer, komponist } = verden;
  if (!renderer) return;
  renderer.setSize(innerWidth, innerHeight);
  komponist.setSize(innerWidth, innerHeight);
  // Gløden regner selv i halv opløsning. På telefoner og tablets halverer vi den en gang til (den er sløret alligevel).
  if (LAV_KVALITET) {
    const pr = renderer.getPixelRatio();
    verden.glød.setSize(innerWidth * pr * 0.5, innerHeight * pr * 0.5);
  }
  centrerVindue();
}

// Flytter 3D-billedet, så det står midt i "hullet" (kaldes også, når en skærm bliver rullet)
export function centrerVindue() {
  const { kamera } = verden;
  if (!kamera) return;
  const B = innerWidth, H = innerHeight;

  // Midten af "hullet" mellem panelerne skal være midten af billedet.
  // Vi tegner et større billede og viser kun et udsnit af det (setViewOffset).
  let r = { left: 0, top: 0, width: B, height: H };
  if (verden.vindue) {
    const b = verden.vindue.getBoundingClientRect();
    if (b.width > 10 && b.height > 10) r = b;
  }
  verden.hul = r;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const FB = B + 2 * Math.abs(B / 2 - cx);
  const FH = H + 2 * Math.abs(H / 2 - cy);
  kamera.aspect = FB / FH;
  kamera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2)) * FH / H));
  kamera.setViewOffset(FB, FH, FB / 2 - cx, FH / 2 - cy, B, H);
  kamera.updateProjectionMatrix();
}

// Zoomer kameraet, så en kugle med denne radius passer i hullet
export function passerTil(radius) {
  const { hul } = verden;
  const halv = Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2));
  const mindste = Math.min(hul.width, hul.height) / innerHeight;
  verden.målAfstand = THREE.MathUtils.clamp((radius * 1.18) / (halv * mindste), 6, 240);
}

// Kameraet svinger blødt et stykke rundt om atomet (fx når man skifter grundstof)
let sving = null;
export function kameraSving(vinkel = 0.6, varighed = 1.4) {
  if (ROLIG) return;
  sving = { vinkel, varighed, tid: 0, sidst: 0 };
}

// Stopper sving og automatisk zoom (fx når man skifter skærm)
export function stopKamera() {
  sving = null;
  verden.målAfstand = null;
}

// Kameraet starter langt væk og flyver ind (fx når man åbner en del)
export function flyInd(radius, faktor = 3) {
  const { kamera, styring } = verden;
  const retning = kamera.position.clone().sub(styring.target);
  if (ROLIG) {
    // "Reducer bevægelse": ingen flyvetur, kameraet står bare det rigtige sted (zoomMod hopper derhen)
    passerTil(radius);
    return;
  }
  kamera.position.copy(styring.target).add(retning.setLength(Math.max(retning.length(), radius * 4) * faktor));
  passerTil(radius);
  kameraSving(0.9, 2);
}

function svingKamera(dt) {
  if (!sving) return;
  sving.tid = Math.min(sving.varighed, sving.tid + dt);
  const t = sving.tid / sving.varighed;
  const blød = t * t * (3 - 2 * t); // langsom start og slutning
  const skridt = (blød - sving.sidst) * sving.vinkel;
  sving.sidst = blød;
  const { kamera, styring } = verden;
  kamera.position.sub(styring.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), skridt).add(styring.target);
  if (t >= 1) sving = null;
}

// Zoomer, så en kasse med denne halve bredde og højde passer i hullet (fx det periodiske system)
export function passerTilBoks(halvBredde, halvHøjde) {
  const { hul } = verden;
  const t = Math.tan(THREE.MathUtils.degToRad(SYNSVINKEL / 2));
  const H = innerHeight;
  const d = Math.max(halvBredde / (t * hul.width / H), halvHøjde / (t * hul.height / H)) * 1.06;
  verden.målAfstand = THREE.MathUtils.clamp(d, 6, 240);
}

// Fælles nulstilling, når man skifter skærm: Hver skærm starter fra de samme indstillinger,
// også hvis den forrige har flyttet kameraets mål eller slået flytning (pan) til (fx væggen i Det periodiske system)
export function nulstilStyring() {
  const s = verden.styring;
  s.target.set(0, 0, 0);
  s.enablePan = false;
  s.touches.ONE = THREE.TOUCH.ROTATE;
  s.minDistance = 4;
  s.maxDistance = 250;
  s.autoRotate = true;
  s.autoRotateSpeed = 0.5;
  begrænsDrejning(null);
}

// Piletasterne drejer kameraet rundt om målet: venstre og højre rundt, op og ned over og under.
// Den skærm, der vil bruge dem, slår dem til (Kosmos). Ikke i Det periodiske system, hvor pilene skifter grundstof.
const pile = { til: false, nede: new Set() };
export function piletaster(til) {
  pile.til = til;
  if (!til) pile.nede.clear();
}
function lavPiletaster() {
  addEventListener('keydown', (h) => {
    if (!pile.til || !h.key.startsWith('Arrow')) return;
    if (h.target.closest?.('input, textarea, select, [contenteditable]')) return; // fx en skyder, der har fokus
    pile.nede.add(h.key);
    h.preventDefault();
  });
  addEventListener('keyup', (h) => pile.nede.delete(h.key));
  addEventListener('blur', () => pile.nede.clear());
  const v = new THREE.Vector3();
  const kugle = new THREE.Spherical();
  verden.opdateringer.add((dt) => {
    if (!pile.til || !pile.nede.size) return;
    const s = verden.styring;
    v.subVectors(verden.kamera.position, s.target);
    kugle.setFromVector3(v);
    const fart = 1.2 * dt;
    if (pile.nede.has('ArrowLeft')) kugle.theta -= fart;
    if (pile.nede.has('ArrowRight')) kugle.theta += fart;
    if (pile.nede.has('ArrowUp')) kugle.phi -= fart * 0.8;
    if (pile.nede.has('ArrowDown')) kugle.phi += fart * 0.8;
    kugle.phi = THREE.MathUtils.clamp(kugle.phi, Math.max(0.05, s.minPolarAngle), Math.min(Math.PI - 0.05, s.maxPolarAngle));
    if (Number.isFinite(s.minAzimuthAngle) && Number.isFinite(s.maxAzimuthAngle)) kugle.theta = THREE.MathUtils.clamp(kugle.theta, s.minAzimuthAngle, s.maxAzimuthAngle);
    v.setFromSpherical(kugle);
    verden.kamera.position.copy(s.target).add(v);
    s.update();
  });
}

// Begrænser, hvor meget man kan dreje (null = frit)
export function begrænsDrejning(grænser) {
  const s = verden.styring;
  if (grænser) {
    s.minAzimuthAngle = -grænser.vandret;
    s.maxAzimuthAngle = grænser.vandret;
    s.minPolarAngle = Math.PI / 2 - grænser.lodret;
    s.maxPolarAngle = Math.PI / 2 + grænser.lodret;
  } else {
    s.minAzimuthAngle = -Infinity;
    s.maxAzimuthAngle = Infinity;
    s.minPolarAngle = 0;
    s.maxPolarAngle = Math.PI;
  }
}

function zoomMod(dt) {
  if (verden.målAfstand == null) return;
  const { kamera, styring } = verden;
  const retning = kamera.position.clone().sub(styring.target);
  const nu = retning.length();
  // Med "reducer bevægelse" hopper kameraet straks på plads i stedet for at glide
  const ny = ROLIG ? verden.målAfstand : nu + (verden.målAfstand - nu) * (1 - Math.exp(-dt * 3));
  kamera.position.copy(styring.target).add(retning.setLength(ny));
  if (Math.abs(ny - verden.målAfstand) < 0.02) verden.målAfstand = null;
}
