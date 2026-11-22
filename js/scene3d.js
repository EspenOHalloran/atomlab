// Den fælles 3D-verden: renderer, kamera, lys, stjernehimmel og glød (bloom).
// Alle dele af AtomLab tegner i den samme verden.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
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
  kanter: null, // kantudglatningen efter gløden (SMAA på pc, FXAA på touch)
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
  renderer.setPixelRatio(skarphed());
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
  // MSAA (samples: 4 i komponistens lag) kostede ca. 40 % af billederne i testbrowseren, så kun Gåderne bruger den
  // (js/gaader/kanter.js). Alle andre steder udglattes kanterne bagefter (G2, se nedenfor).
  const komponist = new EffectComposer(renderer);
  komponist.addPass(new RenderPass(scene, kamera));
  const glød = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.9, 0.55, 0.82);
  blødGlød(glød);
  komponist.addPass(glød);
  komponist.addPass(new OutputPass());
  // Kantudglatning (G2, 20. november 2026): efter tonemappingen, for begge virker på det færdige billede. Pc'en får SMAA
  // (tre trin, finder kanterne og blander langs dem, pænest), touch FXAA (ét trin, billigst, lidt blødere billede).
  const kanter = LAV_KVALITET ? (gemteKanter.FXAA = new FXAAPass()) : lavSMAA();
  komponist.addPass(kanter);

  Object.assign(verden, { renderer, scene, kamera, styring, komponist, glød, kanter });

  if (LAV_KVALITET && !TEST_HURTIG) setTimeout(forvarmSMAA, 2500); // (når den første skærm er i gang)

  addEventListener('resize', tilpasStørrelse);
  // Mobiler ændrer størrelse lidt efter, at skærmen drejes
  addEventListener('orientationchange', () => setTimeout(tilpasStørrelse, 300));
  tilpasStørrelse();

  let sidst = performance.now();
  renderer.setAnimationLoop((nu) => {
    noterBillede(nu - sidst);
    const dt = Math.min(0.05, (nu - sidst) / 1000);
    sidst = nu;
    const tid = nu / 1000;
    for (const f of verden.opdateringer) f(dt, tid);
    zoomMod(dt);
    svingKamera(dt);
    if (ROLIG) styring.autoRotate = false;
    styring.update(dt);
    if (TEST_HURTIG) renderer.render(scene, kamera);
    else { komponist.render(dt); vogtKanter(nu); vogtTrin(nu); }
    noterShadere(nu);
  });
  return true;
}

// Skærmens loft og nye shadere (rettelser efter målingen på Tab A11, 22. november 2026, docs/maalinger/): Værnene måler
// billeder i sekundet. Men (1) skærmen sætter et loft (Tab A11: ca. 90 med fingre på skærmen og 60 uden), så en fast
// grænse som 100 billeder/s kan aldrig nås dér, og (2) mens nye shadere laves, hakker det kort, også på et hurtigt
// grafikkort. Derfor husker billedløkken tiden mellem de seneste billeder (til loftet) og tidspunktet for den seneste nye
// shader, og værnene ser bort fra billederne lige efter (SHADER_RO).
const SENESTE = new Float32Array(120); // tiden mellem de seneste billeder (ms), ca. 1-2 s
let senesteI = 0, senesteN = 0;
function noterBillede(ms) {
  if (!(ms > 0 && ms < 500)) return; // (et ryk eller en skjult fane siger intet om loftet)
  SENESTE[senesteI] = ms;
  senesteI = (senesteI + 1) % SENESTE.length;
  senesteN = Math.min(senesteN + 1, SENESTE.length);
}
// De almindelige lofter for skærme (billeder/s). Under 60 findes de ikke, så et langsommere billede er grafikkortet.
export const LOFTER = [60, 72, 75, 90, 100, 120, 144, 165, 240];
// Skærmens loft ud fra tiden mellem billederne (ms): Billederne kommer altid ved et skift af skærmen, så de korteste
// (den nederste fjerdedel) er skærmens takt, også når grafikkortet ikke når hvert skift (fx 40 billeder/s på en skærm
// med 60: skiftevis 16,7 og 33,3 ms). Afrundet til det nærmeste almindelige loft.
export function loftAf(tider) {
  if (!tider.length) return 60;
  const s = Array.from(tider).sort((a, b) => a - b);
  const takt = 1000 / s[Math.floor(s.length / 4)];
  return LOFTER.reduce((b, l) => (Math.abs(l - takt) < Math.abs(b - takt) ? l : b));
}
export const skærmLoft = () => loftAf(SENESTE.subarray(0, senesteN));
// Shadere: Billedløkken ser efter hvert billede (og nyeShadere hver gang), om antallet af shaderprogrammer har ændret
// sig. nyeShadere(nu) er sand i SHADER_RO sekunder efter (målt på Tab A11: ca. 3 s med ryk på 50-164 ms, efter at
// Sort hul havde lavet tre shadere).
export const SHADER_RO = 3;
let shaderTid = -Infinity, programAntal = -1;
function noterShadere(nu) {
  const n = verden.renderer.info.programs?.length ?? 0;
  if (n !== programAntal) { if (programAntal >= 0) shaderTid = nu; programAntal = n; }
}
export function nyeShadere(nu = performance.now()) {
  noterShadere(nu); // (også shadere, der er lavet efter sidste billede, fx med renderer.compile)
  return nu - shaderTid < SHADER_RO * 1000;
}

// En blødere glød (G2): Three.js' glød lægger fem slørede udgaver af det lyse oven i billedet, fra den skarpeste (tæt om
// det lysende) til den bredeste (langt ud). Før vejede de næsten lige meget (0,56-0,64 med radius 0,55), og grænsen var
// hård (lysstyrke 0,82 til 0,83), så gløden sprang til og fra, når noget blev lidt lysere. Nu vejer den skarpeste mere
// (en lysere kerne), de mellemste lidt mindre og de brede lidt mere (længere, blødere haler), og grænsen går blødt fra
// 0,74 til 0,90 (halv glød ved 0,82 som før). Summen er næsten den samme (3,0 → 3,05), så de skærme, der er stillet
// efter gløden, ser ud som før, bare blødere.
export const GLØD_VÆGTE = [0.8, 0.55, 0.5, 0.55, 0.65];
const GLØD_GRÆNSE = 0.74;
const GLØD_BLØD = 0.16;
function blødGlød(glød) {
  glød.radius = 0; // vægtene herover bruges, som de står (radius blander dem ellers med deres spejlbillede)
  glød.threshold = GLØD_GRÆNSE;
  glød.compositeMaterial.uniforms.bloomFactors.value = GLØD_VÆGTE;
  glød.highPassUniforms.smoothWidth.value = GLØD_BLØD;
}

// SMAA's to mellemlag (kanterne og vægtene) er tal mellem 0 og 1, så 8 bit er nok (som i den oprindelige SMAA).
// Three.js laver dem i 16 bit, så de fyldte det dobbelte (16 MB mere ved 1280 × 800, 64 MB ved 2560 × 1600).
function lavSMAA() {
  const smaa = new SMAAPass();
  for (const lag of [smaa._edgesRT, smaa._weightsRT]) lag.texture.type = THREE.UnsignedByteType; // før første tegning
  return smaa;
}

// Værn på pc (som i js/gaader/kanter.js): Er der under 40 billeder i sekundet i 4 sekunder med SMAA, skiftes der til
// den billigere FXAA resten af besøget. Ikke med ?test, hvor testbrowseren altid er langsom.
const KANT_VÆRN = !LAV_KVALITET && !new URLSearchParams(location.search).has('test');
const kantMåling = { tid: 0, billeder: 0, sidst: 0 };
function vogtKanter(nu) {
  if (!KANT_VÆRN || !(verden.kanter instanceof SMAAPass) || !verden.kanter.enabled) return;
  const dt = (nu - kantMåling.sidst) / 1000;
  kantMåling.sidst = nu;
  if (dt > 0.5) { kantMåling.tid = kantMåling.billeder = 0; return; } // et ryk eller en skjult fane tæller ikke
  kantMåling.tid += dt;
  kantMåling.billeder++;
  if (kantMåling.tid < 4) return;
  const fps = kantMåling.billeder / kantMåling.tid;
  kantMåling.tid = kantMåling.billeder = 0;
  if (fps < 40) {
    skiftKanter('FXAA');
    globalThis.atomlabMåler?.(`Kantudglatning: SMAA → FXAA (${fps.toFixed(0)} billeder/s)`);
  }
}

// Skifter kantudglatningen ('SMAA', 'FXAA' eller null = ingen). Bruges af værnet, kvalitetstrinnet og testene.
// På touch skifter kvalitetstrinnet frem og tilbage mellem de to, så begge gemmes og genbruges (gemteKanter): Deres
// shadere laves kun én gang (SMAA på forhånd, forvarmSMAA), og et skift laver ingen nye. På pc frigives den gamle.
const gemteKanter = {};
export function skiftKanter(slags) {
  const { komponist, kanter } = verden;
  if (!komponist || kanterSlags() === slags) return;
  const lav = () => (slags === 'SMAA' ? lavSMAA() : slags === 'FXAA' ? new FXAAPass() : null);
  const ny = LAV_KVALITET && slags ? (gemteKanter[slags] ??= lav()) : lav();
  const i = komponist.passes.indexOf(kanter);
  if (kanter) { komponist.removePass(kanter); if (!LAV_KVALITET) kanter.dispose(); }
  if (ny) {
    ny.enabled = kanter?.enabled ?? true; // holder Gåderne pause (MSAA), gør den nye det også
    komponist.insertPass(ny, i < 0 ? komponist.passes.length : i);
  }
  verden.kanter = ny;
}

// SMAA's tre shadere laves på forhånd på touch, så skiftet til Høj ikke venter på dem (telefonen A56 havde et ryk på
// 114 ms ved skiftet, 21. november 2026, og testbrowseren lavede 2-3 nye shadere). Når dens to opslagsbilleder er
// pakket ud, tegnes den én gang i et lille billede (4 × 4) lige før komponisten tegner, med det sidste trin på skærmen
// som i brug (ellers bliver det en anden udgave af shaderen). Komponisten tegner hele skærmen igen bagefter.
function forvarmSMAA() {
  const smaa = (gemteKanter.SMAA ??= lavSMAA());
  if (verden.kanter === smaa) return;
  const varm = () => {
    if (!smaa._areaTexture.version || !smaa._searchTexture.version) return; // (billederne er ikke klar endnu)
    verden.opdateringer.delete(varm);
    if (verden.kanter === smaa) return;
    const { renderer } = verden;
    const før = renderer.getRenderTarget();
    const læs = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
    smaa.setSize(4, 4);
    smaa.renderToScreen = true;
    try { smaa.render(renderer, null, læs); } finally {
      renderer.setRenderTarget(før);
      læs.dispose();
    }
  };
  verden.opdateringer.add(varm);
}
// Kvalitetstrin på touch (G1 del 2, 20. november 2026, docs/plan-kvalitetstrin.md): Telefoner og tablets har to trin.
// Basis er som før (skarphed højst 1,5, FXAA og gløden i en fjerdedel af opløsningen). Høj er som på pc (skarphed højst 2,
// SMAA og gløden i halv opløsning). Hver skærm vælger selv, om den må få Høj (høj: true i SKÆRME i js/skaerme.js, og
// menuen). Er der mindst 92 % af skærmens loft (dog højst 58 billeder/s krævet) i 3 sekunder, skiftes der til Høj. Falder det
// under 45 i 2 sekunder, skiftes der tilbage, og så bliver skærmen i Basis resten af besøget (ingen vippen frem og tilbage,
// og det dækker også en tablet, der bliver varm). Partikler, kuglernes felter og teksturer følger stadig LAV_KVALITET,
// for de bygges ved start.
// ryk: billeder over så mange sekunder (en skjult fane, et ryk) tæller ikke. Testene sætter den højere (testbrowseren er langsom).
export const TRIN_GRÆNSER = { opAndel: 0.92, opFps: 58, opTid: 3, nedFps: 45, nedTid: 2, ro: 1.5, ryk: 0.5 };
// De tunge skærme (høj: 'tung' i SKÆRME: Solsystemet, Kosmos og Begyndelsen, 21. november 2026) går kun op, når billedet
// følger skærmens loft (mindst 92 % i 4 s), og falder tilbage under 75 % af loftet (dog mindst 45) i 2 s. Før var det
// faste tal (op ved 100, ned under 70), men Tab A11's skærm går højst til 90 (med fingre) og 60 (uden), så Kosmos stod i
// Basis med tydelig luft (88 billeder/s, målingen 22. november 2026). Med loftet 90: op ved 83, ned under 68. Med 60: op
// ved 55, ned under 45. Med 120 (telefonen A56): op ved 110, ned under 90. Valgt af sessionen, kan ændres af jer.
export const TRIN_GRÆNSER_TUNG = { opAndel: 0.92, opTid: 4, nedAndel: 0.75, nedFps: 45, nedTid: 2 };
// Grænserne for et trinskift ved et givet loft: { op, ned } i billeder/s
export function trinGrænser(tung, loft) {
  if (tung) {
    const g = TRIN_GRÆNSER_TUNG;
    return { op: g.opAndel * loft, ned: Math.max(g.nedFps, g.nedAndel * loft) };
  }
  const g = TRIN_GRÆNSER;
  return { op: Math.min(g.opFps, g.opAndel * loft), ned: g.nedFps };
}
let trinAuto = LAV_KVALITET && !new URLSearchParams(location.search).has('test'); // ikke i testene, medmindre de slår det til
// tung: skærmen er tung (strengere grænser). tungHøj: Høj er nået på en tung skærm (så må den beholdes på en anden tung).
const trin = { navn: 'basis', tilladt: false, tung: false, tungHøj: false, id: null, låst: false, tid: 0, billeder: 0, sidst: 0, fra: 0 };
// Skærme, hvor Høj er faldet tilbage i dette besøg af AtomLab (til siden lukkes): De prøver ikke igen, når man kommer
// tilbage (ingen vippen frem og tilbage, heller ikke mellem skærmene, og en varm tablet får ro).
const faldet = new Set();
export const kvalitetstrin = () => trin.navn;
export const trinTilstand = () => ({ navn: trin.navn, tung: trin.tung, låst: trin.låst }); // (til testene)
const grænse = (navn) => (trin.tung ? TRIN_GRÆNSER_TUNG : TRIN_GRÆNSER)[navn];

function skarphed() {
  if (TEST_HURTIG) return 0.5;
  return Math.min(devicePixelRatio, LAV_KVALITET && trin.navn !== 'høj' ? 1.5 : 2);
}

// Skifter trinnet ('basis' eller 'høj'). Kun på touch: Pc'en har altid det, der svarer til Høj.
export function sætTrin(navn) {
  if (!LAV_KVALITET || trin.navn === navn) return;
  trin.navn = navn;
  trin.tungHøj = navn === 'høj' && trin.tung;
  nulstilTrinMåling();
  const { renderer, komponist } = verden;
  if (!renderer) return;
  const pr = skarphed();
  renderer.setPixelRatio(pr);
  komponist.setPixelRatio(pr);
  tilpasStørrelse();
  skiftKanter(navn === 'høj' ? 'SMAA' : 'FXAA');
}

// Kaldes ved hvert skærmskift (main.js), før skærmen starter. tilladt: false, true eller 'tung' (høj i SKÆRME), id: skærmen.
// Måtte den forrige skærm få Høj, og må den nye også, beholdes trinnet (så billedet ikke springer). En tung skærm beholder
// det kun, hvis det er nået på en tung skærm (ellers kunne Tab A11 tage Høj med fra Værkstedet til Solsystemet). Er Høj
// faldet tilbage på den nye skærm før, bliver den i Basis.
export function vælgKvalitet(tilladt, id = null) {
  trin.tilladt = !!tilladt;
  trin.tung = tilladt === 'tung';
  trin.id = id;
  trin.låst = faldet.has(id);
  if (!tilladt || trin.låst || (trin.tung && !trin.tungHøj)) sætTrin('basis');
  nulstilTrinMåling();
}

// Kun til testene: slår den automatiske måling til eller fra
export function autoTrin(til) { trinAuto = LAV_KVALITET && til; faldet.clear(); trin.låst = false; nulstilTrinMåling(); }

function nulstilTrinMåling() {
  trin.tid = trin.billeder = 0;
  trin.sidst = 0;
  trin.fra = performance.now() + TRIN_GRÆNSER.ro * 1000; // de første billeder efter et skift (nye lag, en skærm, der bygges) tæller ikke
}

function vogtTrin(nu) {
  if (!trinAuto || !trin.tilladt || trin.låst) return;
  const dt = (nu - trin.sidst) / 1000;
  trin.sidst = nu;
  // Et ryk, en skjult fane og billederne lige efter nye shadere tæller ikke (de siger intet om, hvad grafikkortet kan)
  if (nu < trin.fra || dt > TRIN_GRÆNSER.ryk || nyeShadere(nu)) { trin.tid = trin.billeder = 0; return; }
  trin.tid += dt;
  trin.billeder++;
  const høj = trin.navn === 'høj';
  if (trin.tid < grænse(høj ? 'nedTid' : 'opTid')) return;
  const fps = trin.billeder / trin.tid;
  trin.tid = trin.billeder = 0;
  const loft = skærmLoft();
  const { op, ned } = trinGrænser(trin.tung, loft);
  if (!høj && fps >= op) {
    sætTrin('høj');
    globalThis.atomlabMåler?.(`Kvalitet: Basis → Høj (${fps.toFixed(0)} billeder/s, loft ${loft}${trin.tung ? ', tung skærm' : ''})`);
  } else if (høj && fps < ned) {
    sætTrin('basis');
    trin.låst = true;
    if (trin.id) faldet.add(trin.id);
    globalThis.atomlabMåler?.(`Kvalitet: Høj → Basis på denne skærm, til siden lukkes (${fps.toFixed(0)} billeder/s, loft ${loft})`);
  }
}

export const kanterSlags = () => verden.kanter instanceof SMAAPass ? 'SMAA' : verden.kanter instanceof FXAAPass ? 'FXAA' : null;

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
  himmelDrejet.add(himmel);
  scene.add(himmelDrejet);
  verden.opdateringer.add((dt) => { himmel.rotation.y += dt * 0.004; });
}

// Stjernehimlen kan drejes med et planetsystem (js/solsystem/rejse.js drejer systemet, når kameraet er ved et sted
// på en planet), så stjernerne står fast i forhold til planeten. null = ingen drejning.
const himmelDrejet = new THREE.Group();
export function drejHimmel(q) {
  if (q) himmelDrejet.quaternion.copy(q);
  else himmelDrejet.quaternion.identity();
}
export const himmelDrejning = () => himmelDrejet.quaternion.toArray(); // kun til tests

// Rumstøv: svage prikker, der driver langsomt forbi tæt på atomet og giver dybde. Skjules i fænomenerne fra vores
// eget solsystem (tåger: false, hele Solsystemet-skærmen), hvor de lignede prikker på himlen.
let støv = null;
export function visRumstøv(til) {
  if (støv) støv.visible = til;
}
export const rumstøvVist = () => støv?.visible ?? false; // kun til tests
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
  støv = new THREE.Points(geo, new THREE.PointsMaterial({
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
  // Gløden regner selv i halv opløsning. På telefoner og tablets halverer vi den en gang til (den er sløret alligevel),
  // undtagen i kvalitetstrinnet Høj.
  if (LAV_KVALITET && trin.navn !== 'høj') {
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
  drejHimmel(null);
  visRumstøv(true);
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
