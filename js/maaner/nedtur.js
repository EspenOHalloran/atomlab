// Huygens' tur ned gennem Titans dis ("Land med Huygens", spor Måner, M5a, docs/drejebog-maaner.md afsnit 8). Sporets
// egen fil efter mønstret fra Venus' tur ned (js/kosmos/venus-ned.js: tidsplanen, måleren med søjlen og bladringen), men
// uden Venus' klode og kameraets rejse: Her følger kameraet Huygens under faldskærmen, og verden udenom er en kuppel.
//
// - Kuplen (en kugle om kameraet, tegnet først): himlen er orange dis hele vejen ned (Tomasko m.fl. 2005: ingen klar luft
//   under disen). Under horisonten er jorden Cassinis kort af Titan (titan-2k.jpg, ca. 8 km pr. punkt) omkring
//   landingsstedet, med små detaljer tegnet ovenpå, set gennem disen: Lyset fra jorden svækkes med e^(−afstand / SIGT),
//   så jorden først kan anes ca. 30 km oppe (ESA). Tegnet, ikke målt.
// - Huygens (modulet, i rummet også varmeskjoldet og bagdækslet), faldskærmen (8,3 m og efter 15 min 3 m) og disens
//   korn, der suser opad (farten fra tidsplanen).
// - Måleren øverst i 3D-vinduet: datoen, søjlen fra jorden til 160 km, højden og uret ("I faldskærmen", et tryk skifter
//   til "Hørt på Jorden"). Huygens' kamera nederst til venstre: Huygens' egne billeder, det seneste for højden (ESA's
//   credit står under). Et tryk gør det større.
// - Landingen (M5b): 700 m oppe tændes lampen (et varmt skær under sonden), og under ca. 150 m kommer jorden frem under
//   Huygens som en flad jord med små sten (tegnet). Ved jorden laver Huygens et lille hul, hopper, glider 30-40 cm og
//   vipper (LANDING), og faldskærmen falder sammen ved siden af. Så siger nedturen til (påLandet), og landhuygens.js viser
//   ESA's billede fra jorden.
// Tallene og tidsplanen står i js/data/maaner/landhuygens.js.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, lavPrikTekstur, verden } from '../scene3d.js';
import { TITAN, FALDSKÆRM_KM, SE_JORDEN_KM, LAMPE_KM, NED_S, LANDING, højdeVed, tidVed, fartVed, skærmVed, urTekst, billedeVed, BILLEDER, KREDIT, DATO } from '../data/maaner/landhuygens.js';

const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const SIGT = 15.8; // km: jorden lige under Huygens anes 30 km oppe (e^(−30/15,8) ≈ 0,15) og ses klart under 5 km
const SØJLE_KM = FALDSKÆRM_KM; // søjlen går fra jorden til 160 km
const STOR = 1.5, LILLE = 0.55; // faldskærmens størrelse i tegningen (8,3 m og 3 m)
const KUPPEL_R = 600; // kuplens radius (kameraets far er 3000)
// Ved jorden: Huygens' modul er ca. 1,3 m bredt og 0,7 enheder i tegningen, så 1 enhed er ca. 1,86 m
const M_PR_ENHED = 1.86;
const JORD_KM = 0.15; // under denne højde kommer jorden under Huygens frem (den toner ind ned til 50 m)
const LAND_S = 2.8; // sekunder på skærmen fra stødet, til Huygens står stille (hul, hop, glid og vip)
// Lyset i disen (lineært). Et hvidt modul bliver dæmpet orange som disen over det (ESA: ved jorden ca. 1.000 gange
// svagere end sollys på Jorden, men tegningen er lysere, så man kan se noget). Snorene er belyst af det samme lys
const HIMMEL_LYS = 0.75, SOL_LYS = 0.3;
const SNOR = 0x8a6c52;

// Huygens: modulet (det, der landede) og varmeskjoldet og bagdækslet, som kun er med i rummet og på vej ind
export function lavHuygens() {
  const g = new THREE.Group();
  const hvid = new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 0.2, roughness: 0.55 });
  const guld = new THREE.MeshStandardMaterial({ color: 0xc9a04a, metalness: 0.55, roughness: 0.4 });
  const brun = new THREE.MeshStandardMaterial({ color: 0x8a6646, metalness: 0.1, roughness: 0.85 });
  const r = 0.35;
  const krop = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.94, r * 0.42, 28), guld);
  const top = new THREE.Mesh(new THREE.SphereGeometry(r * 0.92, 28, 8, 0, Math.PI * 2, 0, Math.PI / 2), hvid);
  top.scale.y = 0.42;
  top.position.y = r * 0.2;
  const bund = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r * 0.62, r * 0.22, 28), hvid);
  bund.position.y = -r * 0.32;
  // Varmeskjoldet (2,7 m bredt, forrest) og bagdækslet
  const skjold = new THREE.Mesh(new THREE.ConeGeometry(r * 2.05, r * 0.62, 36, 1, true), brun);
  skjold.rotation.x = Math.PI; // spidsen nedad (fremad på vej ind)
  skjold.position.y = -r * 0.55;
  const dæksel = new THREE.Mesh(new THREE.ConeGeometry(r * 1.6, r * 0.95, 36, 1, true), hvid);
  dæksel.position.y = r * 0.55;
  skjold.material.side = dæksel.material.side = THREE.DoubleSide;
  g.add(krop, top, bund, skjold, dæksel);
  return {
    gruppe: g,
    r,
    medSkjold(til) { skjold.visible = dæksel.visible = til; },
    stop() { g.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); }); },
  };
}

// Faldskærmen: en kalot med orange og hvide baner og linjerne ned til et punkt (origo), hvor den hænger i Huygens
function lavFaldskærm() {
  const g = new THREE.Group();
  const åbning = 1.15; // kalotten går fra toppen til 1,15 rad
  const LÆNGDE = 1.7; // fra linjernes samlingspunkt til kalottens midte (i kalottens radius)
  const geo = new THREE.SphereGeometry(1, 24, 7, 0, Math.PI * 2, 0, åbning);
  const farver = [];
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const vinkel = Math.atan2(p.getZ(i), p.getX(i)) + Math.PI;
    const bane = Math.floor((vinkel / (Math.PI * 2)) * 12 + 0.0001) % 2;
    if (bane) farver.push(0.95, 0.94, 0.9); else farver.push(0.95, 0.45, 0.12);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(farver, 3));
  const kalot = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85 }));
  kalot.position.y = LÆNGDE - Math.cos(åbning);
  const linjer = [];
  const kantY = LÆNGDE, kantR = Math.sin(åbning);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    linjer.push(0, 0, 0, Math.cos(a) * kantR, kantY, Math.sin(a) * kantR);
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(linjer, 3));
  const snore = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: SNOR, transparent: true, opacity: 0.8 }));
  g.add(kalot, snore);
  return g;
}

// Kuplen med disen og jorden (alt i verdens retninger: y er op, x er øst og −z er nord ved landingsstedet)
const KUPPEL_VERTEX = /* glsl */ `
  varying vec3 vRetning;
  void main() {
    vRetning = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }`;
const KUPPEL_FRAGMENT = /* glsl */ `
  uniform float uH, uSigt, uLys, uHarKort;
  uniform sampler2D uKort;
  uniform vec2 uLand, uKmPrUv;
  uniform vec3 uSol;
  varying vec3 vRetning;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    vec3 d = normalize(vRetning);
    // Himlen: lysere orange ved horisonten og mod Solen, mørkere opad. Lidt lysere højt oppe. Farverne er lineære
    // (komponisten lægger tonemapping og sRGB på bagefter, og i testene gør de to linjer nederst det samme)
    float hoej = clamp(uH / 160.0, 0.0, 1.0);
    vec3 horisont = mix(vec3(0.27, 0.109, 0.031), vec3(0.467, 0.164, 0.044), hoej);
    vec3 top = mix(vec3(0.088, 0.038, 0.014), vec3(0.14, 0.06, 0.019), hoej);
    vec3 c = mix(horisont, top, pow(clamp(d.y, 0.0, 1.0), 0.55));
    c += vec3(0.2, 0.07, 0.012) * pow(max(dot(d, uSol), 0.0), 8.0);
    if (d.y < 0.0) {
      // Jorden: hvor strålen rammer en flad jord uH km under Huygens (km mod øst og nord)
      float s = uH / max(-d.y, 0.015);
      vec2 p = vec2(d.x, -d.z) * s;
      float g = 0.42;
      if (uHarKort > 0.5) g = texture2D(uKort, uLand + p / uKmPrUv).r;
      // Kortet har kun ca. 8 km pr. punkt, så landskabet er tegnet ovenpå efter Huygens' billeder: lyse bakker med
      // mørke, forgrenede flodlejer, og en mørk slette, hvor Huygens landede (kysten lidt nord for den)
      // (kortets lyse og mørke egne regnes i forhold til landingsstedet, så det altid ligger på sletten)
      float g0 = uHarKort > 0.5 ? texture2D(uKort, uLand).r : 0.42;
      float bakker = 0.55 * stoej(p * 0.35) + 0.3 * stoej(p * 1.1 + 7.0) + 0.15 * stoej(p * 3.7);
      float kyst = smoothstep(0.3, 1.6, p.y + 0.6 * sin(p.x * 0.8) + 0.3 * sin(p.x * 2.1 + 1.0));
      float land = (g - g0) * 1.5 + (bakker - 0.5) * 1.6 + 0.5 + 0.6 * (kyst - 0.5);
      land = smoothstep(0.38, 0.62, land);
      // Flodlejerne: tynde, snoede linjer (hvor støjen krydser midten), kun i nogle af bakkerne. De toner ud, når de
      // bliver tyndere end en pixel (fwidth), ellers flimrer de
      vec2 q = p * 0.9 + 2.2 * vec2(stoej(p * 0.3 + 2.0), stoej(p * 0.3 + 9.0));
      float f = stoej(q) * 0.75 + stoej(q * 2.7) * 0.25 - 0.5;
      float b = max(fwidth(f), 1e-4);
      float flod = (1.0 - smoothstep(0.008, 0.026, abs(f))) * clamp(0.015 / b, 0.0, 1.0);
      flod *= smoothstep(0.42, 0.62, stoej(p * 0.22 + 11.0));
      land *= 1.0 - 0.7 * flod * smoothstep(0.2, 0.6, land);
      vec3 jord = mix(vec3(0.065, 0.035, 0.017), vec3(0.267, 0.147, 0.071), land);
      vec3 dis = mix(horisont, vec3(0.183, 0.079, 0.024), clamp(-d.y * 1.4, 0.0, 1.0) * (1.0 - 0.4 * hoej));
      c = mix(dis, jord, exp(-s / uSigt));
    }
    gl_FragColor = vec4(c * uLys, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

// Jorden lige under Huygens (de sidste ca. 150 m): sand og små sten (tegnet efter billedet fra jorden), lyset fra disen og
// lampens skær. Den toner ud mod kanten, så kuplens jord ses længere væk.
const JORD_VERTEX = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const JORD_FRAGMENT = /* glsl */ `
  uniform float uSynlig, uLampe, uLys;
  uniform vec2 uLampePos;
  varying vec2 vP;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float stoej(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  // Små runde sten: afstanden til den nærmeste sten i et gitter
  float sten(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float d = 1.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(hash(i + g), hash(i + g + 17.0));
      float r = hash(i + g + 9.0) < 0.55 ? 0.0001 : 0.15 + 0.2 * hash(i + g + 5.0); // (ikke en sten i hver rude)
      d = min(d, length(g + o - f) / r);
    }
    return d;
  }
  void main() {
    float n = 0.6 * stoej(vP * 0.8) + 0.4 * stoej(vP * 3.1);
    vec3 c = mix(vec3(0.055, 0.03, 0.015), vec3(0.1, 0.055, 0.026), n); // (lineært som kuplen, sletten ved Huygens)
    // Stenene er 4-15 cm (ca. 0,02-0,08 enheder), så de tegnes kun tæt på, ellers flimrer de
    float st = sten(vP * 9.0);
    float naer = 1.0 - smoothstep(2.0, 7.0, length(vP));
    c = mix(c, vec3(0.16, 0.09, 0.04), (1.0 - smoothstep(0.7, 1.0, st)) * 0.75 * naer);
    c *= uLys;
    // Lampen: et varmt skær lige under Huygens
    float l = exp(-dot(vP - uLampePos, vP - uLampePos) / 1.6) * uLampe;
    c += vec3(0.16, 0.09, 0.03) * l;
    float a = uSynlig * (1.0 - smoothstep(14.0, 40.0, length(vP)));
    gl_FragColor = vec4(c, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

// Scenens fælles lys (det hvide hovedlys, det blå kantlys og det svage lys alle steder) og spejlingen af et rum (scene.
// environment) gjorde Huygens og faldskærmen kridhvide og glødende i disen (brugerens skærmbilleder 22. november 2026).
// De slukkes, mens turen ned vises, og tændes igen bagefter. Styrken sættes til 0 i stedet for at skjule lysene, for
// et andet antal lys laver alle shaderne om (et ryk)
const slukket = new Map();
let miljøFør = null;
function fællesLys(sluk) {
  const sc = verden.scene;
  if (!sc) return;
  if (sluk) {
    if (slukket.size || miljøFør !== null) return;
    for (const o of sc.children) if (o.isLight) { slukket.set(o, o.intensity); o.intensity = 0; }
    miljøFør = sc.environmentIntensity;
    sc.environmentIntensity = 0;
  } else {
    for (const [o, styrke] of slukket) o.intensity = styrke;
    slukket.clear();
    if (miljøFør !== null) sc.environmentIntensity = miljøFør;
    miljøFør = null;
  }
}

export function lavNedtur({ vindue, kamera }) {
  const gruppe = new THREE.Group();
  gruppe.visible = false;

  // ---------- Kuplen ----------
  const kuppelMat = new THREE.ShaderMaterial({
    uniforms: {
      uH: { value: FALDSKÆRM_KM }, uSigt: { value: SIGT }, uLys: { value: 1 }, uHarKort: { value: 0 }, uKort: { value: null },
      uLand: { value: new THREE.Vector2(0.5 + TITAN.land.længde / 360, 0.5 + TITAN.land.bredde / 180) },
      // km pr. hele kortet: mod øst omkredsen ved landingsstedets bredde, mod nord en halv omkreds
      uKmPrUv: { value: new THREE.Vector2(2 * Math.PI * TITAN.r * Math.cos(THREE.MathUtils.degToRad(TITAN.land.bredde)), Math.PI * TITAN.r) },
      uSol: { value: new THREE.Vector3(-0.5, 0.45, -0.75).normalize() },
    },
    vertexShader: KUPPEL_VERTEX,
    fragmentShader: KUPPEL_FRAGMENT,
    side: THREE.BackSide,
    // Kuplen tegnes først og skriver altid sin dybde, så stjernerne bagved (700-1300 enheder ude) ikke lyser igennem
    // disen. (Uden dybdetest bliver dybden ikke skrevet, derfor AlwaysDepth)
    depthTest: true,
    depthFunc: THREE.AlwaysDepth,
    depthWrite: true,
  });
  const kuppel = new THREE.Mesh(new THREE.SphereGeometry(KUPPEL_R, TEST_HURTIG ? 32 : 64, TEST_HURTIG ? 16 : 32), kuppelMat);
  kuppel.renderOrder = -10;
  kuppel.frustumCulled = false;
  kuppel.onBeforeRender = (r, s, cam) => { kuppel.position.copy(cam.position); kuppel.updateMatrixWorld(); };
  gruppe.add(kuppel);

  // ---------- Huygens under faldskærmen, lyset i disen og disens korn ----------
  const huygens = lavHuygens();
  huygens.medSkjold(false);
  const system = new THREE.Group(); // Huygens og faldskærmen gynger sammen
  system.add(huygens.gruppe);
  const skærm = lavFaldskærm();
  skærm.position.y = 0.55;
  system.add(skærm);
  const rem = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, huygens.r * 0.3, 0), new THREE.Vector3(0, 0.55, 0)]);
  system.add(new THREE.Line(rem, new THREE.LineBasicMaterial({ color: SNOR })));
  gruppe.add(system);
  // Lyset kommer fra disen: orange fra oven og et svagt, brunt skær fra jorden nedenunder. Solen anes kun som et lidt
  // lysere sted i disen, så den giver kun en svag skygge. (Scenens fælles lys er slukket under turen, se fællesLys)
  const lin = (r, g, b) => new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
  const disLys = new THREE.HemisphereLight(lin(1, 0.46, 0.15), lin(0.3, 0.16, 0.07), HIMMEL_LYS);
  const sollys = new THREE.DirectionalLight(lin(1, 0.55, 0.22), SOL_LYS);
  sollys.position.copy(kuppelMat.uniforms.uSol.value);
  gruppe.add(disLys, sollys);

  const N = TEST_HURTIG ? 60 : LAV_KVALITET ? 140 : 280;
  const korn = new Float32Array(N * 3);
  const BOKS = 6;
  for (let i = 0; i < N; i++) {
    korn[i * 3] = (Math.random() - 0.5) * 2 * BOKS;
    korn[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOKS;
    korn[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOKS;
  }
  const kornGeo = new THREE.BufferGeometry();
  kornGeo.setAttribute('position', new THREE.BufferAttribute(korn, 3));
  const kornMat = new THREE.PointsMaterial({ size: 0.07, map: lavPrikTekstur(true), color: 0xd9a272, transparent: true, opacity: 0.45, depthWrite: false });
  const kornP = new THREE.Points(kornGeo, kornMat);
  kornP.frustumCulled = false;
  gruppe.add(kornP);

  // ---------- Jorden, lampen, hullet og støvet (M5b) ----------
  const BUND = -huygens.r * 0.43; // modulets bund (i system-gruppen)
  const jordMat = new THREE.ShaderMaterial({
    uniforms: { uSynlig: { value: 0 }, uLampe: { value: 0 }, uLys: { value: 1 }, uLampePos: { value: new THREE.Vector2() } },
    vertexShader: JORD_VERTEX,
    fragmentShader: JORD_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const jord = new THREE.Mesh(new THREE.CircleGeometry(40, 48), jordMat);
  jord.rotation.x = -Math.PI / 2;
  jord.renderOrder = -5;
  jord.visible = false;
  gruppe.add(jord);
  // Lampen: en lille lysende prik under bunden og en svag kegle af lys ned mod jorden
  const lampe = new THREE.Group();
  const pære = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff1c8 }));
  pære.position.y = BUND - 0.01;
  const keglGeo = new THREE.ConeGeometry(0.5, 1, 24, 1, true);
  keglGeo.translate(0, -0.5, 0); // spidsen i origo, keglen nedad
  const kegle = new THREE.Mesh(keglGeo, new THREE.MeshBasicMaterial({ color: 0xffc070, transparent: true, opacity: 0.035, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  kegle.position.y = BUND;
  lampe.add(pære, kegle);
  lampe.visible = false;
  system.add(lampe);
  // Hullet, Huygens lavede (12 cm dybt): en mørk plet på jorden, hvor den ramte
  const hulC = document.createElement('canvas');
  hulC.width = hulC.height = 64;
  const hg = hulC.getContext('2d');
  const hgrad = hg.createRadialGradient(32, 32, 0, 32, 32, 32);
  hgrad.addColorStop(0, 'rgba(25,12,4,0.85)');
  hgrad.addColorStop(0.55, 'rgba(40,20,8,0.6)');
  hgrad.addColorStop(0.8, 'rgba(150,100,60,0.25)');
  hgrad.addColorStop(1, 'rgba(150,100,60,0)');
  hg.fillStyle = hgrad;
  hg.fillRect(0, 0, 64, 64);
  const hulTekstur = new THREE.CanvasTexture(hulC);
  const hul = new THREE.Mesh(new THREE.CircleGeometry(huygens.r * 1.05, 32), new THREE.MeshBasicMaterial({ map: hulTekstur, transparent: true, depthWrite: false }));
  hul.rotation.x = -Math.PI / 2;
  hul.renderOrder = -4;
  hul.position.y = BUND + 0.004; // (på jorden, når Huygens er landet)
  hul.visible = false;
  gruppe.add(hul);
  // Støvet ved stødet: en ring af korn, der breder sig og falder til ro
  const STØV = TEST_HURTIG ? 24 : 60;
  const støvPos = new Float32Array(STØV * 3), støvFart = [];
  for (let i = 0; i < STØV; i++) {
    const a = (i / STØV) * Math.PI * 2 + Math.random() * 0.3;
    støvFart.push([Math.cos(a) * (0.6 + Math.random() * 0.6), 0.3 + Math.random() * 0.5, Math.sin(a) * (0.6 + Math.random() * 0.6)]);
  }
  const støvGeo = new THREE.BufferGeometry();
  støvGeo.setAttribute('position', new THREE.BufferAttribute(støvPos, 3));
  const støvMat = new THREE.PointsMaterial({ size: 0.09, map: lavPrikTekstur(true), color: 0xd9a46c, transparent: true, opacity: 0, depthWrite: false });
  const støv = new THREE.Points(støvGeo, støvMat);
  støv.frustumCulled = false;
  støv.visible = false;
  gruppe.add(støv);

  // ---------- Måleren og Huygens' kamera (HTML i 3D-vinduet) ----------
  const ui = document.createElement('div');
  ui.className = 'ui-huygens';
  ui.innerHTML = `<div class="lh-dato"></div>
    <div class="lh-maaler" hidden>
      <div class="lh-soejle" aria-hidden="true"><i class="lh-bar"></i><i class="lh-prik"></i><small>${SØJLE_KM} km</small><small class="lh-bund">jorden</small></div>
      <div class="lh-tal"><span>Højde</span><strong class="lh-hoejde"></strong></div>
      <button type="button" class="lh-tal lh-ur" aria-label="Uret. Tryk for at skifte mellem Titan og Jorden"><span class="lh-ur-navn"></span><strong class="lh-ur-tal"></strong><small class="lh-ur-under"></small></button>
    </div>`;
  vindue.append(ui);
  const datoEl = ui.querySelector('.lh-dato'), måler = ui.querySelector('.lh-maaler');
  const højdeEl = ui.querySelector('.lh-hoejde'), prik = ui.querySelector('.lh-prik');
  const urKnap = ui.querySelector('.lh-ur');
  const ur = { navn: ui.querySelector('.lh-ur-navn'), tal: ui.querySelector('.lh-ur-tal'), under: ui.querySelector('.lh-ur-under') };
  let jorden = false; // uret viser det, Jorden har hørt
  urKnap.addEventListener('click', () => { jorden = !jorden; urKnap.classList.toggle('jorden', jorden); tegnUr(true); });

  const kam = document.createElement('figure');
  kam.className = 'ui-huygens-kamera';
  kam.hidden = true;
  kam.innerHTML = `<button type="button" class="lh-billede" aria-label="Huygens' kamera. Tryk for at gøre billedet større"><img alt="Huygens' billede fra luften"></button>
    <figcaption><b>Huygens' kamera</b> <span class="lh-km"></span><small>${KREDIT}</small></figcaption>`;
  vindue.append(kam);
  const img = kam.querySelector('img'), kmEl = kam.querySelector('.lh-km');
  kam.querySelector('.lh-billede').addEventListener('click', () => kam.classList.toggle('stor'));
  // Billederne hentes, første gang turen ned starter (de er små: ca. 130 KB i alt)
  let hentet = false;
  const billeder = new Map();
  function hentBilleder() {
    if (hentet) return;
    hentet = true;
    for (const b of BILLEDER) {
      const i = new Image();
      i.decoding = 'async';
      i.src = new URL(b.fil, MAPPE).href;
      billeder.set(b.fil, i);
    }
  }

  // ---------- Tilstanden ----------
  let s = 0; // sekunder i faldskærmen
  let h = FALDSKÆRM_KM;
  let åbner = 1; // 0-1, mens faldskærmen folder sig ud
  let billede = null; // det billede, kameraet viser
  let kameraTil = true; // kontakten "Huygens' kamera"
  const sete = new Set(); // billeder, der er vist (testene)
  let tid = 0, uiTid = 0;
  let sidsteUr = '';
  let grænse = 0; // turen stopper i denne højde (km). Forløbets trin 2 holder ved VENT_KM, ellers lander Huygens
  let landet = false; // Huygens har ramt jorden
  let landTid = 0; // sekunder på skærmen siden stødet
  let stille = false; // landingen er slut (Huygens står stille, og billedet fra jorden kan vises)
  let fotoVist = false; // billedet fra jorden fylder scenen (så er Huygens' kamera skjult)
  let landFart = 1; // "Vis mig" lander hurtigere
  let påLandet = null;

  function tegnUr(nu = false) {
    const t = urTekst(s, jorden);
    const nøgle = t.navn + t.tal + t.under;
    if (!nu && nøgle === sidsteUr) return;
    sidsteUr = nøgle;
    ur.navn.textContent = t.navn;
    ur.tal.textContent = t.tal;
    ur.under.textContent = `${t.under} ⇄`;
  }
  // Det, der følger højden: disen og jorden i kuplen, lyset, jorden under Huygens og lampen (fra 700 m). Sættes, når
  // højden skifter (også på pause, fx når man blader mellem etaperne), ikke kun i opdater
  function tegnHøjde() {
    kuppelMat.uniforms.uH.value = Math.max(h, JORD_KM);
    const lys = 0.78 + 0.22 * Math.min(1, h / SØJLE_KM);
    kuppelMat.uniforms.uLys.value = lys;
    disLys.intensity = HIMMEL_LYS * lys;
    sollys.intensity = SOL_LYS * lys;
    const hM = (h * 1000) / M_PR_ENHED; // højden i tegningens enheder
    jord.visible = h < JORD_KM;
    jord.position.y = BUND - hM;
    jordMat.uniforms.uSynlig.value = THREE.MathUtils.smoothstep(JORD_KM - h, 0, JORD_KM - 0.05);
    jordMat.uniforms.uLys.value = lys;
    lampe.visible = h <= LAMPE_KM + 1e-9;
    jordMat.uniforms.uLampe.value = lampe.visible ? 1 : 0;
    kegle.scale.set(0.5, Math.min(hM + 0.02, 1.6), 0.5);
  }
  function tegnUI() {
    højdeEl.textContent = h >= 10 ? `${Math.round(h)} km` : h >= 1 ? `${h.toFixed(1).replace('.', ',')} km` : `${Math.round(h * 1000)} m`;
    prik.style.top = `${(1 - Math.min(1, h / SØJLE_KM)) * 100}%`;
    tegnUr();
  }
  function visBillede() {
    const b = billedeVed(h);
    // (på jorden er kortet skjult: Det sidste billede fra luften er forældet, og det dækkede underteksten på telefonen)
    const vis = Boolean(b) && kameraTil && gruppe.visible && !fotoVist && !stille;
    kam.hidden = !vis;
    if (!b || b === billede) return;
    billede = b;
    sete.add(b.km);
    img.src = billeder.get(b.fil)?.src ?? new URL(b.fil, MAPPE).href;
    kmEl.textContent = `· ${String(b.km).replace('.', ',')} km`;
    // Det første billede, hvor jorden kan ses (ca. 30 km), lyser lidt op
    kam.classList.toggle('jorden', b.km <= SE_JORDEN_KM + 1 && b.km >= SE_JORDEN_KM - 1);
  }

  // Huygens og faldskærmen, som de hænger i luften (før landingen, og når man går tilbage)
  function iLuften() {
    landet = stille = false;
    landTid = 0;
    system.position.set(0, 0, 0);
    system.rotation.set(0, 0, 0);
    skærm.rotation.set(0, 0, 0);
    skærm.position.set(0, 0.55, 0);
    hul.visible = støv.visible = false;
  }
  // Landingen: hul, hop, glid og vip (u: sekunder siden stødet). Til sidst står Huygens stille
  const HUL = (LANDING.hulCm / 100) / M_PR_ENHED, GLID = (LANDING.glidCm / 100) / M_PR_ENHED;
  function landingVed(u) {
    const hop = u < 0.12 ? -HUL * (u / 0.12) : u < 0.7 ? -HUL + (HUL + 0.11) * Math.sin(Math.PI * (u - 0.12) / 0.58) : 0;
    const glid = GLID * THREE.MathUtils.smoothstep(u, 0.12, 1.3);
    const vip = u > 0.6 ? 0.09 * Math.exp(-(u - 0.6) * 1.7) * Math.sin((u - 0.6) * 9) : 0;
    system.position.set(glid, Math.max(-HUL, hop), 0);
    system.rotation.set(0, 0, vip);
    // Faldskærmen lægger sig ned ved siden af og falder sammen
    const f = THREE.MathUtils.smoothstep(u, 0.1, LAND_S);
    skærm.rotation.z = -1.45 * f;
    skærm.position.set(0.25 * f, 0.55 - 0.45 * f, 0);
    skærm.scale.y *= 1 - 0.7 * f;
    // Støvet
    støv.visible = u < 1.8 && !ROLIG;
    støvMat.opacity = 0.7 * Math.max(0, 1 - u / 1.8);
    for (let i = 0; i < STØV; i++) {
      const [vx, vy, vz] = støvFart[i];
      støvPos[i * 3] = vx * u;
      støvPos[i * 3 + 1] = BUND + Math.max(0, vy * u - 0.5 * u * u);
      støvPos[i * 3 + 2] = vz * u;
    }
    støvGeo.attributes.position.needsUpdate = true;
  }

  return {
    gruppe,
    ui,
    get s() { return s; },
    get landet() { return landet; },
    get stille() { return stille; },
    set påLandet(f) { påLandet = f; },
    set landFart(x) { landFart = x; },
    // Turen stopper i højden km (0: Huygens lander)
    sætGrænse(km) { grænse = km; },
    // Billedet fra jorden fylder scenen (skjuler Huygens' kamera)
    foto(til) { fotoVist = til; ui.classList.toggle('foto', til); visBillede(); },
    // Direkte til Huygens på jorden (etapen "Landet" og forløbets trin 3-4, når man kommer tilbage)
    tilLandet() {
      grænse = 0;
      this.sæt(NED_S);
      landet = stille = true;
      landTid = LAND_S;
      landingVed(LAND_S);
      støv.visible = false;
      hul.visible = true;
      visBillede();
    },
    get h() { return h; },
    get billede() { return billede; },
    get jorden() { return jorden; },
    get vist() { return gruppe.visible; },
    sætDato(tekst) { datoEl.textContent = `📅 ${tekst}`; },
    // Starter turen i faldskærmen (åbn: faldskærmen folder sig ud)
    start({ åbn = true, til = 0 } = {}) {
      hentBilleder();
      gruppe.visible = true;
      fællesLys(true);
      måler.hidden = false;
      this.sætDato(DATO.ned);
      åbner = åbn && !ROLIG ? 0 : 1;
      this.sæt(til);
    },
    skjul() {
      gruppe.visible = false;
      fællesLys(false);
      måler.hidden = true;
      kam.hidden = true;
      kam.classList.remove('stor');
    },
    sæt(sek) {
      s = Math.min(Math.max(0, sek), grænse > 0 ? tidVed(grænse) : NED_S);
      h = højdeVed(s);
      if (s < NED_S && landet) iLuften();
      tegnHøjde();
      tegnUI();
      visBillede();
    },
    kontakt(til) { kameraTil = til; visBillede(); },
    // dt: sekunder på skærmen, spol: sekunder i virkeligheden, der er gået
    opdater(dt, spol) {
      if (!gruppe.visible) return;
      tid += dt;
      if (!landet && h > grænse + 1e-6) this.sæt(s + spol);
      // Stødet: Huygens rammer jorden
      if (!landet && s >= NED_S) {
        landet = true;
        landTid = 0;
        hul.visible = true;
      }
      // Faldskærmen folder sig ud og skiftes til den lille efter 15 min
      if (åbner < 1) åbner = Math.min(1, åbner + dt / 1.1);
      const mål = skærmVed(s) === 'stor' ? STOR : LILLE;
      const e = 1 - (1 - åbner) ** 3;
      const str = THREE.MathUtils.lerp(0.15, mål, e);
      skærm.scale.setScalar(str);
      skærm.scale.x = skærm.scale.z = str * (0.4 + 0.6 * e);
      if (landet) {
        if (!stille) {
          landTid += dt * landFart;
          if (landTid >= LAND_S || ROLIG) { landTid = LAND_S; stille = true; }
          landingVed(landTid);
          if (stille) { støv.visible = false; visBillede(); påLandet?.(); }
        } else landingVed(LAND_S);
        jordMat.uniforms.uLampePos.value.set(system.position.x, 0);
      }
      // Huygens drejer langsomt og gynger lidt (mest højt oppe, hvor vinden er stærk)
      if (!ROLIG && !landet) {
        huygens.gruppe.rotation.y += dt * 0.6;
        const gyng = 0.02 + 0.05 * Math.min(1, h / 120);
        system.rotation.z = gyng * Math.sin(tid * 1.3);
        system.rotation.x = gyng * 0.7 * Math.sin(tid * 0.9 + 1);
      }
      // Disens korn suser opad, hurtigere jo hurtigere Huygens falder (ikke under pause)
      if (!ROLIG && spol > 0) {
        const v = Math.min(5, 0.5 + 0.06 * fartVed(h)) * dt;
        for (let i = 0; i < N; i++) {
          let y = korn[i * 3 + 1] + v;
          if (y > BOKS) y -= 2 * BOKS;
          korn[i * 3 + 1] = y;
        }
        kornGeo.attributes.position.needsUpdate = true;
      }
      kornMat.opacity = 0.25 + 0.25 * Math.min(1, h / 60);
      kornP.position.copy(kamera.position); // (kornene følger kameraet)
      uiTid += dt;
      if (uiTid > 0.2) { uiTid = 0; tegnUI(); }
    },
    sætKort(t) { kuppelMat.uniforms.uKort.value = t; kuppelMat.uniforms.uHarKort.value = t ? 1 : 0; },
    test: () => ({
      vist: gruppe.visible, s, h, skærm: skærmVed(s), åbner, jorden, ur: urKnap.textContent.replace(/\s+/g, ' ').trim(),
      kamera: !kam.hidden, billede: billede?.km ?? null, stor: kam.classList.contains('stor'), set: [...sete], dato: datoEl.textContent,
      måler: !måler.hidden, højdeTekst: højdeEl.textContent, kort: kuppelMat.uniforms.uHarKort.value === 1, uH: kuppelMat.uniforms.uH.value,
      lampe: lampe.visible, jord: jord.visible, landet, stille, hul: hul.visible, grænse, foto: fotoVist,
      fællesLys: verden.scene ? verden.scene.children.filter((o) => o.isLight).reduce((sum, o) => sum + o.intensity, 0) + verden.scene.environmentIntensity : null,
    }),
    skiftUr: () => urKnap.click(),
    stop() {
      fællesLys(false);
      ui.remove();
      kam.remove();
      gruppe.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      kornMat.map?.dispose();
      støvMat.map?.dispose();
      hulTekstur.dispose();
    },
  };
}
