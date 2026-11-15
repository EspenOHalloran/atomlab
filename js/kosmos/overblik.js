// Solsystemets overblik (docs/drejebog-overblik.md, trin 2 og 3 af byggeriet): Solen, de otte planeter og Pluto i
// deres rigtige baner, som de står på datoen, som Solsystemets forside og første klode.
//
// - Skalaen (skyderen "Skala" i Styr, glider selv i mål): "Pustet op og rykket sammen" (t = 0) tegner afstanden fra
//   Solen som kvadratroden af den rigtige (Neptun NEPTUN_U enheder ude) og forstørrer alle planeterne lige meget
//   (Jupiter JUPITER_R), mens Solen tegnes som SOL_R, altid større end Jupiter. "Rigtig størrelse og afstand" (t = 1)
//   har alt i samme skala. Imellem glider både afstande og størrelser geometrisk (a^(1-t) · b^t).
//   Kuglerne er mindst MIN_PX pixel (pustet op) og får i den rigtige skala en ring med navnet (HTML).
// - Datoen: 1800-2100 (js/data/planeter.js). Tiden går i virkeligheden (▶), og tidsskyderen nederst spoler: et fuldt
//   træk er et år, og den falder tilbage til midten, når man slipper. ⏪ og ⏩ har tre tempi (en måned, et år og ti år
//   i sekundet), og "I dag" stiller tilbage. Alt står stille i pause (opdater kaldes kun, når tiden går).
// - Bælterne: asteroidebæltet og Kuiperbæltet som prikker, der kredser i shaderen (Keplers ligning), så det koster
//   intet at spole. De tones næsten væk i den rigtige skala.
// - Tryk: den klode, hvis midte er nærmest (inden for TRYK_PX), vælges. Kameraet flyver ind (van Wijk og Nuijs vej,
//   glatVej i rejse.js), til kuglen fylder ca. en tredjedel af billedet, og billedet toner gennem mørke over i planetens
//   egen visning. Merkur og Pluto er ikke bygget: De er steder i overblikket med et kort panel.
// - Tilbage: Overblikket husker dato, skala og kamera (husk), og flyver ud fra den klode, man kom fra.
// - Forløbet "Rundt om Solen" (drejebogens afsnit 2) står i js/solsystem/overblik-forloeb.js. Det styrer scenen gennem
//   api'et nedenfor og flaget vis (navnene, ringene, Pluto, bælterne og tidsknapperne er skjult imens).
// - "Rejs med lyset" (handlingen i bjælken) står i js/solsystem/overblik-lys.js.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG } from '../scene3d.js';
import { glød, stjerne } from './faelles.js';
import { glatVej } from '../solsystem/rejse.js';
import { hent } from '../solsystem/hent.js';
import { navneKnap, navneTil as navneTilFra } from '../solsystem/navne.js';
import { lavShadereFørst } from '../solsystem/shadere.js';
import { sætOverblikDato } from '../solsystem/dato.js';
import { PLANETER, SOLEN, plads, tilProgram, kugleRetning, AU, FØRSTE, SIDSTE } from '../data/planeter.js';
import { ringProfil, RING_IND, RING_UD } from '../data/ringe.js';
import { SIDE, SIDER, TAL } from '../data/sider/overblik.js';
import { lavOverblikForløb } from '../solsystem/overblik-forloeb.js';
import { lavLysRejse } from '../solsystem/overblik-lys.js';

const NEPTUN_A = 30.07; // AU
export const NEPTUN_U = 20; // enheder: Neptuns afstand i begge skalaer
const JUPITER_R = 0.8; // Jupiters radius i "Pustet op" (ca. 40 px bred på pc)
const SOL_R = 1.0; // Solens radius i "Pustet op" (større end Jupiter, under Merkurs bane ved 2,0)
const F = JUPITER_R / 69911; // enheder pr. km for planeterne i "Pustet op"
const RIGTIG = NEPTUN_U / NEPTUN_A / AU; // enheder pr. km i den rigtige skala
const MIN_PX = 1.6; // mindste radius i pixel i "Pustet op"
// Jordens luft i overblikket (lineære farver): Uden den er Jorden en mørk, brunlig prik langt væk, for kortets hav er
// mørkt. Set fra rummet er Jorden blålig af luften og skyerne ("Pale Blue Dot")
const LUFT_JORDEN = [0.05, 0.1, 0.28];
const TRYK_PX = 44;
const ÅR = 365.25 * 864e5;
const TEMPI = [30.44 * 864e5, ÅR, 10 * ÅR]; // ⏩ én, to og tre gange: en måned, et år og ti år i sekundet
const GRAD = Math.PI / 180;
const HJEM = { retning: [0, 0.62, 1], radius: 15.5 }; // kameraet skråt oppefra, så Neptuns bane fylder billedet
// Prioriteten for navnene: Ligger to oven i hinanden, vises det første (de andre beholder prikken og ringen)
const NAVNE_ORDEN = ['solen', 'jorden', 'jupiter', 'saturn', 'mars', 'venus', 'uranus', 'neptun', 'merkur', 'pluto'];

// Det, overblikket husker, når man er inde ved en planet (står, som man forlod det)
const husk = { dato: null, t: 0, kamera: null, tempo: 0 };

const afstandVed = (rAU, t) => {
  const p = NEPTUN_U * Math.sqrt(rAU / NEPTUN_A), r = NEPTUN_U * rAU / NEPTUN_A;
  return p ** (1 - t) * r ** t;
};
const radiusVed = (p, t) => (p ? (p.radius * F) ** (1 - t) * (p.radius * RIGTIG) ** t : SOL_R ** (1 - t) * (SOLEN.radius * RIGTIG) ** t);
const glat = (t) => t * t * t * (t * (t * 6 - 15) + 10);

const MÅNEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
function datoTekst(ms) {
  const d = new Date(ms);
  const tekst = `${d.getDate()}. ${MÅNEDER[d.getMonth()]} ${d.getFullYear()}`;
  return new Date().toDateString() === d.toDateString() ? `${tekst}, i dag` : tekst;
}

// ---------- Shaderne ----------
// Kuglerne og ringen regnes i kameraets retninger (modelViewMatrix regnes i JS med 64 bit): Pluto er i den rigtige
// skala ca. 5 · 10⁻⁶ enheder bred og 23 enheder ude, og så er 32-bit tal i verdens retninger for grove. uSol er Solens
// plads i kameraets retninger (sat i onBeforeRender).
const KUGLE_V = /* glsl */ `
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
void main() {
  vUv = uv;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const KUGLE_F = /* glsl */ `
uniform sampler2D uKort; uniform float uHarKort; uniform float uGraa; uniform vec3 uFarve; uniform vec3 uSol; uniform vec3 uLuft;
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
void main() {
  vec3 c = uFarve;
  if (uHarKort > 0.5) {
    vec4 t = texture2D(uKort, vUv);
    c = uGraa > 0.5 ? vec3(t.r) * uFarve * 2.2 : t.rgb;
  }
  vec3 n = normalize(vN);
  float sol = dot(n, normalize(uSol - vP));
  float lys = max(sol, 0.0);
  // Jordens luft: et blåt skær over dagsiden, stærkest ved kanten (derfor ser Jorden blå ud langt væk)
  float kant = 1.0 - max(dot(n, normalize(-vP)), 0.0);
  vec3 luft = uLuft * (0.35 + 1.2 * kant * kant) * smoothstep(-0.25, 0.4, sol);
  gl_FragColor = vec4(c * (0.03 + 1.1 * lys) + luft, 1.0);
}`;
const RING_V = /* glsl */ `
varying float vR; varying vec3 vP;
void main() {
  vR = length(position.xy);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const RING_F = /* glsl */ `
uniform sampler2D uTau; uniform float uInd; uniform float uUd; uniform vec3 uSol; uniform vec3 uMidt; uniform float uR;
varying float vR; varying vec3 vP;
void main() {
  float x = (vR - uInd) / (uUd - uInd);
  if (x < 0.0 || x > 1.0) discard;
  vec4 p = texture2D(uTau, vec2(x, 0.5));
  float a = 1.0 - exp(-p.a * 2.5);
  // Saturns skygge på ringene (bag planeten set fra Solen)
  vec3 s = normalize(uSol - uMidt);
  vec3 d = vP - uMidt;
  float bag = dot(d, s);
  float vinkelret = length(d - bag * s);
  float skygge = (bag < 0.0 && vinkelret < uR) ? 0.15 : 1.0;
  gl_FragColor = vec4(p.rgb * 0.75 * skygge, a * 0.9);
}`;
const BÆLTE_V = /* glsl */ `
attribute vec4 el1; attribute vec4 el2;
uniform float uDag; uniform float uT; uniform float uPx;
void main() {
  float a = el1.x, e = el1.y, I = el1.z, O = el1.w, w = el2.x;
  float M = mod(el2.y + el2.z * uDag, 6.2831853);
  float E = M + e * sin(M);
  E = E - (E - e * sin(E) - M) / (1.0 - e * cos(E));
  float x = a * (cos(E) - e), y = a * sqrt(1.0 - e * e) * sin(E);
  float cO = cos(O), sO = sin(O), cw = cos(w), sw = sin(w), cI = cos(I), sI = sin(I);
  vec3 X = vec3((cw * cO - sw * sO * cI) * x + (-sw * cO - cw * sO * cI) * y,
                (cw * sO + sw * cO * cI) * x + (-sw * sO + cw * cO * cI) * y,
                sw * sI * x + cw * sI * y);
  float r = length(X);
  float rp = ${NEPTUN_U.toFixed(1)} * sqrt(r / ${NEPTUN_A.toFixed(2)});
  float rr = ${NEPTUN_U.toFixed(1)} * r / ${NEPTUN_A.toFixed(2)};
  vec3 P = X.yzx / r * pow(rp, 1.0 - uT) * pow(rr, uT);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
  gl_PointSize = uPx;
}`;
const BÆLTE_F = /* glsl */ `
uniform vec3 uFarve; uniform float uAlfa;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  gl_FragColor = vec4(uFarve, uAlfa * (1.0 - d * 3.0));
}`;

// Et bælte af små kloder: a (AU) mellem fra og til, excentricitet op til eMaks og hældning op til iMaks (grader)
function lavBælte(antal, fra, til, eMaks, iMaks, farve, frø) {
  let s = frø;
  const tilfældig = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const el1 = new Float32Array(antal * 4), el2 = new Float32Array(antal * 4);
  for (let i = 0; i < antal; i++) {
    const a = fra + (til - fra) * tilfældig();
    el1.set([a, eMaks * tilfældig(), iMaks * GRAD * tilfældig() ** 2, Math.PI * 2 * tilfældig()], i * 4);
    el2.set([Math.PI * 2 * tilfældig(), Math.PI * 2 * tilfældig(), (Math.PI * 2) / (365.256 * a ** 1.5), 0], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(antal * 3), 3));
  geo.setAttribute('el1', new THREE.BufferAttribute(el1, 4));
  geo.setAttribute('el2', new THREE.BufferAttribute(el2, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uDag: { value: 0 }, uT: { value: 0 }, uPx: { value: 1.5 }, uFarve: { value: new THREE.Color(farve) }, uAlfa: { value: 0.5 } },
    vertexShader: BÆLTE_V, fragmentShader: BÆLTE_F, transparent: true, depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

export default {
  id: 'overblik',
  navn: 'Solsystemet',
  ikon: '🪐',
  tåger: false,
  undertitel: 'Solen og planeterne, som de står i dag',
  træ: {
    rod: 'overblik',
    grupper: [{
      navn: 'Kort besøg',
      punkter: [
        { id: 'merkur', navn: 'Merkur', ikon: '⚫', undertitel: 'Den inderste planet' },
        { id: 'pluto', navn: 'Pluto', ikon: '⚪', undertitel: 'En dværgplanet' },
      ],
    }],
  },
  kamera: { retning: HJEM.retning, radius: 21, drej: false },
  tal: TAL,
  side: SIDE,
  sider: SIDER,

  lav(gruppe, { opdaterKnapper, verden, overlag, vælgFænomen, forrige, sætKontakt }) {
    void sætKontakt;
    const { kamera } = verden;
    const orbit = verden.styring;
    const gammelt = { min: orbit.minDistance, max: orbit.maxDistance, nær: kamera.near, fjern: kamera.far, zoom: orbit.zoomSpeed };
    orbit.minDistance = 0.0005;
    orbit.maxDistance = 150;
    kamera.far = 4000;
    let aktiv = true;
    let dato = husk.dato ?? Date.now();
    let t = husk.t; // skalaen 0-1
    let tMål = t;
    let glidTid = 1.2; // sekunder, skalaen glider fra den ene ende til den anden (forløbets trin 3: ca. 3 s)
    let tempo = husk.tempo; // -3 til 3 (⏪ og ⏩)
    let spolet = husk.dato != null;
    let flyvning = null; // { slags: 'ind' | 'sted' | 'ud', ... }
    let fokus = null; // kloden, kameraet følger (Merkur eller Pluto), eller null (Solen i midten)
    let stedNu = 'overblik';
    let fokusR = 0; // klodens radius sidste billede (fokus)
    const lærred = verden.renderer.domElement;
    const vindue = document.getElementById('solsystemVindue');
    // Det, forløbet slår til og fra (js/solsystem/overblik-forloeb.js): forløb skjuler navnene, ringene, Pluto, bælterne
    // og tidsknapperne. ringKun: kun den klodes ring vises. fremhæv: den klodes ring og navn blinker. besøg: vejen
    // "Besøg en planet" efter forløbet (navnene er tændt, Pluto skjult og Merkur mat).
    const vis = { forløb: false, ringKun: null, fremhæv: null, besøg: false };

    // ---------- Solen ----------
    const sol = stjerne(1, 0xfff1c4, 0xff8a1c, 0xffb347, 2.6, { styrke: 1.3 });
    gruppe.add(sol);
    const solLys = glød(0xffd27a, 1, 0.9); // lyset i den rigtige skala (en lysprik med glorie)
    gruppe.add(solLys);

    // ---------- Kloderne ----------
    // (64 × 32: Jorden fylder billedet efter dykket i forløbets trin 4)
    const kugleGeo = new THREE.SphereGeometry(1, TEST_HURTIG ? 24 : 64, TEST_HURTIG ? 12 : 32);
    const kloder = PLANETER.map((p) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uKort: { value: null }, uHarKort: { value: 0 }, uGraa: { value: p.gråt ? 1 : 0 },
          uFarve: { value: new THREE.Color(p.gråt ? '#7c7976' : p.farve) }, uSol: { value: new THREE.Vector3() },
          uLuft: { value: new THREE.Vector3(...(p.id === 'jorden' ? LUFT_JORDEN : [0, 0, 0])) },
        },
        vertexShader: KUGLE_V, fragmentShader: KUGLE_F,
      });
      const holder = new THREE.Group(); // pladsen
      const drej = new THREE.Group(); // aksen og kortets længde 0° (IAU)
      const { op, nul } = kugleRetning(p, new Date(dato));
      const o = new THREE.Vector3(...op), n = new THREE.Vector3(...nul);
      const øst = new THREE.Vector3().crossVectors(o, n);
      drej.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(n, o, øst.negate()));
      const kugle = new THREE.Mesh(kugleGeo, mat);
      kugle.onBeforeRender = (r, s, kam) => { mat.uniforms.uSol.value.setFromMatrixPosition(kam.matrixWorldInverse); };
      drej.add(kugle);
      holder.add(drej);
      gruppe.add(holder);
      if (p.kort) hent(p.kort, (tekstur) => { mat.uniforms.uKort.value = tekstur; mat.uniforms.uHarKort.value = 1; }, { farve: !p.gråt, kanaler: p.gråt ? 1 : 4 });
      return { p, holder, drej, kugle, mat, pos: new THREE.Vector3(), r: 0, skærm: { x: 0, y: 0, synlig: false } };
    });
    const klode = (id) => kloder.find((k) => k.p.id === id);

    // Saturns ringe (Cassinis τ som i ringe.js, i Saturns radier)
    const saturn = klode('saturn');
    const profil = ringProfil(512);
    const tauData = new Uint8Array(512 * 4);
    profil.forEach((x, i) => tauData.set([x.farve[0] * 255, x.farve[1] * 255, x.farve[2] * 255, Math.min(255, x.tau * 120)], i * 4));
    const tauTekstur = new THREE.DataTexture(tauData, 512, 1, THREE.RGBAFormat);
    tauTekstur.minFilter = tauTekstur.magFilter = THREE.LinearFilter;
    tauTekstur.needsUpdate = true;
    const R_SAT = saturn.p.radius;
    const ringMat = new THREE.ShaderMaterial({
      uniforms: { uTau: { value: tauTekstur }, uInd: { value: RING_IND / R_SAT }, uUd: { value: RING_UD / R_SAT }, uSol: { value: new THREE.Vector3() }, uMidt: { value: new THREE.Vector3() }, uR: { value: 1 } },
      vertexShader: RING_V, fragmentShader: RING_F, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(RING_IND / R_SAT, RING_UD / R_SAT, 96, 1), ringMat);
    ring.rotation.x = -Math.PI / 2; // ringens plan er kuglens ækvator (xz)
    ring.onBeforeRender = (r, s, kam) => {
      ringMat.uniforms.uSol.value.setFromMatrixPosition(kam.matrixWorldInverse);
      ringMat.uniforms.uMidt.value.copy(saturn.pos).applyMatrix4(kam.matrixWorldInverse);
    };
    saturn.drej.add(ring);

    // ---------- Banerne ----------
    const N_BANE = 256;
    const baner = kloder.map((k) => {
      const p = k.p;
      // Én omgang omkring datoen (Pluto: 1801-2049 i tabellen)
      const fra = p.id === 'pluto' ? Date.UTC(1801, 0, 1) : dato - (p.omløb * 864e5) / 2;
      const au = [];
      for (let i = 0; i < N_BANE; i++) au.push(plads(p, new Date(fra + (i / N_BANE) * p.omløb * 864e5)));
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N_BANE * 3), 3));
      const mat = new THREE.LineBasicMaterial({ color: p.id === 'jorden' ? 0x6fa8ff : p.dværg ? 0x8a7f74 : 0x7d8fb8, transparent: true, opacity: p.dværg ? 0.35 : 0.5, depthWrite: false });
      const linje = new THREE.LineLoop(geo, mat);
      gruppe.add(linje);
      return { au, linje, geo, opacitet: mat.opacity };
    });
    function tegnBaner() {
      for (const b of baner) {
        const a = b.geo.attributes.position.array;
        b.au.forEach((x, i) => {
          const r = Math.hypot(...x);
          const s = afstandVed(r, t) / r;
          const [px, py, pz] = tilProgram(x);
          a[i * 3] = px * s; a[i * 3 + 1] = py * s; a[i * 3 + 2] = pz * s;
        });
        b.geo.attributes.position.needsUpdate = true;
        b.geo.computeBoundingSphere();
      }
    }

    // ---------- Bælterne ----------
    const asteroider = lavBælte(LAV_KVALITET || TEST_HURTIG ? 2000 : 5000, 2.1, 3.3, 0.2, 15, 0xb8a58c, 12345);
    const kuiper = lavBælte(LAV_KVALITET || TEST_HURTIG ? 2000 : 5000, 39, 48, 0.15, 20, 0x9fb3c8, 54321);
    gruppe.add(asteroider, kuiper);

    // ---------- Navnene og ringene (HTML oven på 3D-billedet) ----------
    const navneLag = document.createElement('div');
    navneLag.className = 'ob-navne';
    vindue.append(navneLag);
    const mærke = (tekst) => {
      const e = document.createElement('div');
      e.className = 'ob-navn';
      e.innerHTML = '<span class="ob-ring"></span><span class="ob-tekst"></span>';
      e.lastChild.textContent = tekst;
      navneLag.append(e);
      return e;
    };
    for (const k of kloder) k.mærke = mærke(k.p.navn);
    const solMærke = mærke('Solen');
    const indersteMærke = mærke('De fire inderste');
    let navneTil = navneTilFra(); // kontakten "Navne"

    // ---------- Tidsskyderen og datoen (nederst i 3D-billedet) ----------
    const tidLag = document.createElement('div');
    tidLag.className = 'ob-tid';
    tidLag.innerHTML = '<div class="ob-dato"></div><div class="ob-tid-række">'
      + '<button class="knap lille ob-spol" data-retning="-1" aria-label="Spol tilbage">⏪</button>'
      + '<input class="ob-skyder" type="range" min="-1" max="1" step="0.001" value="0" aria-label="Træk for at spole tiden">'
      + '<button class="knap lille ob-spol" data-retning="1" aria-label="Spol frem">⏩</button>'
      + '<button class="knap lille ob-idag">I dag</button></div>';
    overlag().append(tidLag);
    const datoLinje = tidLag.querySelector('.ob-dato');
    const skyder = tidLag.querySelector('.ob-skyder');
    let trækFra = null; // datoen, da trækket startede
    // Forløbets trin 2: Skyderen går fra 0 til ét år frem fra årFra (årLængde ms), uden at falde tilbage, når man slipper
    let årFra = null, årLængde = ÅR;
    skyder.addEventListener('input', () => {
      lys.stop();
      if (årFra != null) { sætDato(årFra + Number(skyder.value) * årLængde); return; }
      if (trækFra == null) trækFra = dato;
      sætDato(trækFra + Number(skyder.value) * ÅR);
    });
    const slip = () => {
      if (årFra != null) return;
      trækFra = null;
      skyder.value = 0;
    };
    function skyderÅr(fra, længde = ÅR) {
      årFra = fra;
      årLængde = længde;
      trækFra = null;
      skyder.min = fra == null ? -1 : 0;
      skyder.value = 0;
    }
    skyder.addEventListener('change', slip);
    skyder.addEventListener('pointerup', slip);
    for (const b of tidLag.querySelectorAll('.ob-spol')) {
      b.addEventListener('click', () => {
        const r = Number(b.dataset.retning);
        sætTempo(Math.sign(tempo) === r ? Math.min(3, Math.abs(tempo) + 1) * r : r);
      });
    }
    tidLag.querySelector('.ob-idag').addEventListener('click', iDag);
    let datoVist = '';
    function visDato() {
      const tekst = datoTekst(dato) + (tempo ? ` · ${['en måned', 'et år', 'ti år'][Math.abs(tempo) - 1]} i sekundet ${tempo < 0 ? 'tilbage' : 'frem'}` : '');
      if (tekst !== datoVist) {
        datoVist = tekst;
        datoLinje.textContent = tekst;
      }
      for (const b of tidLag.querySelectorAll('.ob-spol')) b.classList.toggle('til', Math.sign(tempo) === Number(b.dataset.retning));
    }
    function sætDato(ms) {
      dato = Math.min(SIDSTE, Math.max(FØRSTE, ms));
      if ((dato === SIDSTE && tempo > 0) || (dato === FØRSTE && tempo < 0)) tempo = 0;
      spolet = true;
      sætOverblikDato(dato);
    }
    function sætTempo(ny) {
      if (ny) lys.stop();
      tempo = ny;
      if (ny) spolet = true;
      visDato();
    }
    function iDag() {
      tempo = 0;
      dato = Date.now();
      spolet = false;
      sætOverblikDato(null);
      visDato();
    }

    // ---------- Pladserne hvert billede ----------
    const v = new THREE.Vector3();
    const hjælp = new THREE.Vector3();
    const pxPr = (afstand) => (2 * afstand * Math.tan(20 * GRAD)) / innerHeight; // enheder pr. skærmpixel
    // Afstanden, hvor hele overblikket (HJEM.radius) passer i hullet mellem panelerne (som passerTil i scene3d.js)
    const hjemAfstand = () => {
      const { hul } = verden;
      return Math.min(140, (HJEM.radius * 1.18) / (Math.tan(20 * GRAD) * (Math.min(hul.width, hul.height) / innerHeight)));
    };
    function placer() {
      const d = new Date(dato);
      const minPx = MIN_PX * (1 - t) + 0.6 * t;
      for (const k of kloder) {
        const x = plads(k.p, d);
        const r = Math.hypot(...x);
        const s = afstandVed(r, t) / r;
        const [px, py, pz] = tilProgram(x);
        k.pos.set(px * s, py * s, pz * s);
        k.holder.position.copy(k.pos);
        k.r = radiusVed(k.p, t);
        const vis = Math.max(k.r, minPx * pxPr(kamera.position.distanceTo(k.pos)));
        k.drej.scale.setScalar(vis);
      }
      ringMat.uniforms.uR.value = saturn.drej.scale.x;
      // I forløbet er Pluto (og dens bane) og bælterne skjult (drejebogen, afsnit 2). På vejen "Besøg en planet" også Pluto.
      const pluto = klode('pluto');
      pluto.holder.visible = !vis.forløb && !vis.besøg;
      baner[kloder.indexOf(pluto)].linje.visible = pluto.holder.visible;
      asteroider.visible = kuiper.visible = !vis.forløb;
      // Solen: kuglen i "Pustet op", lyset i den rigtige skala
      const sr = radiusVed(null, t);
      sol.scale.setScalar(Math.max(sr, 0.6 * pxPr(kamera.position.length())));
      sol.visible = t < 0.98;
      const lysPx = 14 + 10 * (1 - t);
      solLys.scale.setScalar(Math.max(sr * 3, lysPx * pxPr(kamera.position.length())));
      solLys.material.opacity = 0.35 + 0.55 * t;
      const dag = (dato - Date.UTC(2000, 0, 1, 12)) / 864e5;
      for (const b of [asteroider, kuiper]) {
        b.material.uniforms.uDag.value = dag;
        b.material.uniforms.uT.value = t;
        b.material.uniforms.uAlfa.value = (b === kuiper ? 0.3 : 0.55) * (1 - t) + 0.05 * t;
        b.material.uniforms.uPx.value = (LAV_KVALITET ? 1.5 : 1.8) * verden.renderer.getPixelRatio();
      }
    }

    // Skærmens punkter (pixel i vinduet) og navnene
    const vR = () => vindue.getBoundingClientRect();
    function skærmPunkt(p, ud) {
      v.copy(p).project(kamera);
      ud.x = ((v.x + 1) / 2) * innerWidth;
      ud.y = ((1 - v.y) / 2) * innerHeight;
      ud.synlig = v.z < 1 && v.z > -1;
      return ud;
    }
    const solSkærm = { x: 0, y: 0, synlig: false };
    function tegnNavne() {
      const r = vR();
      for (const k of kloder) skærmPunkt(k.pos, k.skærm);
      skærmPunkt(hjælp.set(0, 0, 0), solSkærm);
      const ma = klode('mars').skærm;
      const iFl = vis.forløb;
      const samlet = Math.hypot(ma.x - solSkærm.x, ma.y - solSkærm.y) < 26 && !fokus && !iFl;
      const ringe = t > 0.5 && !iFl;
      const navne = (navneTil || vis.besøg) && !iFl;
      const pladser = []; // navnene, der allerede står (så de ikke ligger oven i hinanden)
      const ledig = (p, tekst) => {
        const b = tekst.length * 7 + 22, x = p.x, y = p.y;
        if (pladser.some((q) => x < q.x + q.b && q.x < x + b && Math.abs(q.y - y) < 15)) return false;
        pladser.push({ x, y, b });
        return true;
      };
      const sæt = (e, p, vis, ringVis) => {
        e.hidden = !vis;
        if (!vis) return;
        e.style.transform = `translate(${(p.x - r.left).toFixed(1)}px, ${(p.y - r.top).toFixed(1)}px)`;
        e.classList.toggle('med-ring', ringVis);
      };
      const solVis = solSkærm.synlig && navne && !samlet && !flyvning?.skjulNavne;
      sæt(solMærke, solSkærm, solVis, false);
      if (solVis) ledig(solSkærm, 'Solen');
      if (samlet) ledig(solSkærm, 'De fire inderste');
      for (const id of NAVNE_ORDEN.slice(1)) {
        const k = klode(id);
        const inderst = ['merkur', 'venus', 'jorden', 'mars'].includes(id);
        const fremhæv = vis.fremhæv === id, ringKun = vis.ringKun === id;
        const synlig = k.skærm.synlig && k.holder.visible && !(samlet && inderst) && (navne || ringe || fremhæv || ringKun) && !flyvning?.skjulNavne && k !== fokus
          && !(iFl && id === 'pluto');
        sæt(k.mærke, k.skærm, synlig, ringe || fremhæv || ringKun);
        k.mærke.classList.toggle('uden-tekst', !(navne || fremhæv) || !synlig || !ledig(k.skærm, k.p.navn));
        k.mærke.classList.toggle('puls', fremhæv);
        k.mærke.classList.toggle('mat', vis.besøg && !k.p.fænomen);
      }
      sæt(indersteMærke, solSkærm, solSkærm.synlig && samlet && (navne || ringe) && !flyvning?.skjulNavne, ringe);
      indersteMærke.classList.toggle('uden-tekst', !navne);
    }

    // ---------- Tryk på en klode ----------
    // Den klode (eller Solen), hvis midte er nærmest punktet (inden for TRYK_PX), eller null
    function nærmest(x, y) {
      let bedst = null;
      const prøv = (id, p) => {
        if (!p.synlig) return;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < TRYK_PX && (!bedst || d < bedst.d)) bedst = { id, d };
      };
      for (const k of kloder) if (k.holder.visible) prøv(k.p.id, k.skærm);
      prøv('solen', solSkærm);
      return bedst?.id ?? null;
    }
    let ned = null;
    const vedNed = (h) => { ned = { x: h.clientX, y: h.clientY }; };
    const vedOp = (h) => {
      if (!ned || flyvning || Math.hypot(h.clientX - ned.x, h.clientY - ned.y) > 8) return;
      ned = null;
      // Forløbet tager trykket (det flyver ikke ind til planeten)
      if (forløb.kører()) { forløb.tryk(nærmest(h.clientX, h.clientY), h.clientX, h.clientY); return; }
      // I den rigtige skala ligger de fire inderste oven i Solen: Et tryk dér zoomer ind til dem
      const ma = klode('mars').skærm;
      if (t > 0.5 && Math.hypot(ma.x - solSkærm.x, ma.y - solSkærm.y) < 26 && Math.hypot(h.clientX - solSkærm.x, h.clientY - solSkærm.y) < TRYK_PX) {
        flyvTil({ mål: () => hjælp.set(0, 0, 0), afstand: afstandVed(1.8, t) * 3.2, slags: 'zoom' });
        return;
      }
      const id = nærmest(h.clientX, h.clientY);
      if (id && vis.besøg && forløb.besøgTryk(id)) return; // Merkur er mat på vejen "Besøg en planet"
      if (id) besøg(id);
    };
    lærred.addEventListener('pointerdown', vedNed);
    lærred.addEventListener('pointerup', vedOp);

    // ---------- Kameraets flyvning ----------
    // Kameraet flyver, til mål() står i midten i afstanden afstand. retning: hvorfra man ser (fra målet). færdig()
    // kaldes, når det er fremme.
    const tilMål = new THREE.Vector3();
    function flyvTil({ mål, afstand, retning = null, slags, færdig = null, varighed = null, skjulNavne = false }) {
      const fra = orbit.target.clone();
      const w0 = kamera.position.distanceTo(fra);
      const r0 = kamera.position.clone().sub(fra).normalize();
      tilMål.copy(mål());
      const vej = glatVej(fra.distanceTo(tilMål), w0, afstand);
      flyvning = {
        slags, mål, fra, r0, r1: retning ? retning.clone().normalize() : r0.clone(), vej, tid: 0,
        T: ROLIG ? 0 : varighed ?? THREE.MathUtils.clamp(vej.S * 0.55, 1.6, 3), færdig, skjulNavne, d: Math.max(fra.distanceTo(tilMål), 1e-9),
      };
      orbit.enabled = false;
      verden.målAfstand = null;
    }
    function flyv(dt) {
      const f = flyvning;
      if (!f) return;
      f.tid += dt;
      const e = f.T ? glat(Math.min(1, f.tid / f.T)) : 1;
      const s = e * f.vej.S;
      tilMål.copy(f.mål());
      const u = f.vej.u(s) / f.d;
      orbit.target.lerpVectors(f.fra, tilMål, Math.min(1, u));
      const retning = hjælp.copy(f.r0).lerp(f.r1, e).normalize();
      kamera.position.copy(orbit.target).addScaledVector(retning, f.vej.w(s));
      if (e >= 1) {
        flyvning = null;
        orbit.enabled = true;
        f.færdig?.();
      }
    }

    // Retningen, man ser en klode fra, når man flyver ind: fra den belyste side, lidt skråt (ved Saturn fra syd, som
    // visningen starter, drejebogens betingelse 1)
    function indRetning(k) {
      const solRet = k.pos.clone().negate().normalize();
      const op = new THREE.Vector3(0, 1, 0);
      const side = new THREE.Vector3().crossVectors(solRet, op).normalize();
      const nu = kamera.position.clone().sub(k.pos);
      if (side.dot(nu) < 0) side.negate();
      return solRet.multiplyScalar(Math.cos(50 * GRAD)).addScaledVector(side, Math.sin(50 * GRAD)).addScaledVector(op, k.p.id === 'saturn' ? -0.35 : 0.3).normalize();
    }

    // Besøg en klode: Merkur og Pluto er steder i overblikket, de andre (og Solen) har deres egen visning
    function besøg(id, hop = false) {
      if (flyvning?.slags === 'ind') return;
      lys.stop();
      flyvning = null; // en anden flyvning (fx hjem fra Pluto) afbrydes
      const k = klode(id);
      if (k && !k.p.fænomen) { gåTil(id); return; }
      const f = id === 'solen' ? 'solen' : k?.p.fænomen;
      if (!f) return;
      gem();
      const mål = k ? () => k.pos : () => hjælp.set(0, 0, 0);
      const r = k ? k.r : radiusVed(null, t); // klodens egen størrelse (uden mindste antal pixel)
      const retning = k ? indRetning(k) : kamera.position.clone().normalize();
      fokus = null;
      flyvTil({
        mål, afstand: r * 8.2, retning, slags: 'ind', skjulNavne: true, varighed: hop ? 0.0001 : null,
        færdig: () => tonOver(() => vælgFænomen(f), hop),
      });
    }

    // Toningen gennem mørke: kameraet glider langsomt videre ind (aldrig et stillestående billede), billedet bliver
    // sort, planetens visning bygges, dens shadere laves, og så toner billedet frem igen.
    function tonOver(skift, hop) {
      const mørke = document.createElement('div');
      mørke.className = 'ob-mørke';
      vindue.append(mørke);
      let tid = 0;
      const ind = ROLIG || hop ? 0.0001 : 0.5;
      const glid = (dt) => {
        if (!aktiv) { // skærmen blev forladt midt i toningen
          verden.opdateringer.delete(glid);
          mørke.remove();
          return;
        }
        tid += dt;
        mørke.style.opacity = String(Math.min(1, tid / ind));
        kamera.position.lerp(orbit.target, Math.min(0.5, dt * 0.25));
        if (tid < ind) return;
        verden.opdateringer.delete(glid);
        skift();
        let klar = false;
        lavShadereFørst(gruppe, () => true, { færdig: () => { klar = true; } });
        let ud = 0;
        const frem = (dt2) => {
          ud += dt2;
          if (!klar && ud < 1.5) return; // højst 1,5 s i mørke
          const o = Number(mørke.style.opacity) - dt2 / (ROLIG ? 0.01 : 0.5);
          mørke.style.opacity = String(Math.max(0, o));
          if (o <= 0) {
            verden.opdateringer.delete(frem);
            mørke.remove();
          }
        };
        verden.opdateringer.add(frem);
      };
      verden.opdateringer.add(glid);
    }

    // Merkur og Pluto (og tilbage til hele overblikket)
    function gåTil(id) {
      if (flyvning?.slags === 'ind' || forløb.kører()) return;
      if (id === 'overblik') {
        fokus = null;
        stedNu = 'overblik';
        flyvTil({ mål: () => hjælp.set(0, 0, 0), afstand: hjemAfstand(), retning: new THREE.Vector3(...HJEM.retning), slags: 'hjem' });
        return;
      }
      const k = klode(id);
      if (!k) return;
      lys.stop();
      stedNu = id;
      fokus = k;
      flyvTil({ mål: () => k.pos, afstand: k.r * 6, retning: indRetning(k), slags: 'sted', skjulNavne: true });
    }

    function gem() {
      husk.dato = spolet ? dato : null;
      husk.t = t;
      husk.tempo = tempo;
      if (!flyvning) husk.kamera = { mål: orbit.target.clone(), retning: kamera.position.clone().sub(orbit.target).normalize(), afstand: kamera.position.distanceTo(orbit.target) };
    }

    // ---------- Styr-boksen ----------
    const skala = {
      skyder: true, navn: 'Skala', min: 0, max: 100, trin: 1, værdi: Math.round(t * 100),
      vis: (x) => (x < 50 ? 'Pustet op og rykket sammen' : 'Rigtig størrelse og afstand'),
      ændring: (x) => { lys.stop(); t = tMål = x / 100; tegnBaner(); },
      slip: (x) => { tMål = x < 50 ? 0 : 1; glidTid = 1.2; },
    };
    const styring = [skala, navneKnap((til) => { navneTil = til; }), { tekst: '💡 Rejs med lyset', handling: () => { forløb.visBesøg(false); lys.start(); } }];
    void opdaterKnapper;

    // ---------- Start: hjemme, eller ud fra den klode, man kom fra ----------
    tegnBaner();
    placer();
    let første = true;
    function startKamera() {
      const k = forrige ? (forrige === 'solen' ? null : kloder.find((x) => x.p.fænomen === forrige)) : undefined;
      const hjemme = husk.kamera ?? { mål: new THREE.Vector3(), retning: new THREE.Vector3(...HJEM.retning).normalize(), afstand: hjemAfstand() };
      verden.målAfstand = null; // skallens passerTil skal ikke trække i kameraet
      if (k === undefined) {
        // Første gang (eller fra en anden skærm): skråt oppefra, lidt længere væk, og glider ind
        orbit.target.copy(hjemme.mål);
        kamera.position.copy(hjemme.mål).addScaledVector(hjemme.retning, hjemme.afstand * (ROLIG ? 1 : 1.6));
        if (!ROLIG) flyvTil({ mål: () => hjemme.mål, afstand: hjemme.afstand, slags: 'hjem', varighed: 2.2 });
        return;
      }
      // Ud fra kloden (eller Solen): kameraet starter tæt på og trækker sig tilbage
      const p = k ? k.pos : new THREE.Vector3();
      const r = k ? k.r : radiusVed(null, t);
      orbit.target.copy(p);
      kamera.position.copy(p).addScaledVector(k ? indRetning(k) : hjemme.retning, r * 8.2);
      flyvTil({ mål: () => hjemme.mål, afstand: hjemme.afstand, retning: hjemme.retning, slags: 'ud', varighed: ROLIG ? 0.0001 : 2.8 });
    }

    function hvertBillede(dt) {
      if (!aktiv) return;
      if (første) {
        første = false;
        if (!flyvning) startKamera(); // (er man allerede på vej ind til en klode, bliver kameraet, hvor det er)
        else verden.målAfstand = null;
      }
      // Skalaen glider selv i mål, når man har sluppet skyderen
      if (t !== tMål) {
        t = ROLIG ? tMål : t + Math.sign(tMål - t) * Math.min(Math.abs(tMål - t), dt / glidTid);
        skala.sæt?.(Math.round(t * 100));
        tegnBaner();
      }
      flyv(dt);
      if (fokus && !flyvning) {
        // Følg kloden (Merkur eller Pluto), mens man drejer rundt om den. Skifter skalaen, følger afstanden med
        // klodens størrelse, så kameraet ikke havner inde i kuglen.
        hjælp.copy(fokus.pos).sub(orbit.target);
        orbit.target.add(hjælp);
        kamera.position.add(hjælp);
        if (fokusR && fokus.r !== fokusR) {
          hjælp.copy(kamera.position).sub(orbit.target).multiplyScalar(fokus.r / fokusR);
          kamera.position.copy(orbit.target).add(hjælp);
        }
        fokusR = fokus.r;
      } else fokusR = 0;
      const afstand = kamera.position.distanceTo(orbit.target);
      kamera.near = THREE.MathUtils.clamp(afstand * 0.01, 1e-7, 0.1);
      // Styringen holder altid afstanden mellem minDistance og maxDistance (også under en flyvning). Ved Merkur og Pluto
      // må man ikke zoome ind i kuglen, og i den rigtige skala er de meget små.
      orbit.minDistance = flyvning ? 1e-7 : fokus ? fokus.r * 1.3 : 0.05;
      // Banelinjerne tones ned tæt på en klode (Merkur og Pluto). I den rigtige skala ligger en banelinje (256 punkter)
      // op til ca. to jordradier ved siden af planeten mellem to punkter, så den tones helt ud tæt på planeten (ca. 20-80
      // radier, dykket i forløbets trin 4)
      const svag = fokus && !flyvning ? 0.3 : 1;
      kloder.forEach((k, i) => {
        const nær = t > 0.5 ? THREE.MathUtils.clamp((kamera.position.distanceTo(k.pos) / k.r - 20) / 60, 0, 1) : 1;
        baner[i].linje.material.opacity = baner[i].opacitet * svag * nær;
      });
      kamera.updateProjectionMatrix();
      orbit.zoomSpeed = 1;
      placer();
      tegnNavne();
      forløb.hvertBillede(dt);
      lys.hvertBillede(dt);
      visDato();
    }
    verden.opdateringer.add(hvertBillede);
    visDato();

    // ---------- Forløbet "Rundt om Solen" (js/solsystem/overblik-forloeb.js) ----------
    // Afstanden, hvor en kugle med radius r (enheder, om Solen) passer i hullet mellem panelerne (som hjemAfstand)
    const afstandFor = (r) => {
      const { hul } = verden;
      return Math.min(140, (r * 1.18) / (Math.tan(20 * GRAD) * (Math.min(hul.width, hul.height) / innerHeight)));
    };
    // Afstanden, hvor en kasse (halv bredde og halv højde i enheder, set skråt oppefra) passer i hullet (som passerTilBoks)
    const afstandForBoks = (hb, hh) => {
      const { hul } = verden;
      const t20 = Math.tan(20 * GRAD);
      return Math.min(140, Math.max(hb / (t20 * hul.width / innerHeight), hh / (t20 * hul.height / innerHeight)) * 1.06);
    };
    const punkt = (p, ms, ud) => {
      const x = plads(p, new Date(ms));
      const r = Math.hypot(...x);
      const sk = afstandVed(r, t) / r;
      const [px, py, pz] = tilProgram(x);
      return ud.set(px * sk, py * sk, pz * sk);
    };
    // Banerne regnes om, så én omgang ligger omkring ms (et af de 256 punkter står præcis på planeten, så Jordens bane
    // går gennem Jorden under dykket i forløbets trin 4)
    function banerOm(ms) {
      kloder.forEach((k, i) => {
        if (k.p.id === 'pluto') return;
        const fra = ms - (k.p.omløb * 864e5) / 2;
        baner[i].au = baner[i].au.map((_, j) => plads(k.p, new Date(fra + (j / N_BANE) * k.p.omløb * 864e5)));
      });
      tegnBaner();
    }
    const lys = lavLysRejse({
      kamera, orbit, vindue, gruppe, kloder, HJEM, tidLag, radiusVed, afstandFor, flyvTil,
      dato: () => dato, t: () => t, flyver: () => Boolean(flyvning), stopTempo: () => sætTempo(0),
      sætSkala: (x, glid, sek) => { tMål = x; glidTid = sek; if (!glid) { t = x; skala.sæt?.(Math.round(x * 100)); tegnBaner(); } },
      stopFlyvning: () => { flyvning = null; orbit.enabled = true; },
    });
    const forløb = lavOverblikForløb({
      verden, kamera, orbit, vindue, gruppe, kloder, klode, vis, HJEM, tidLag, skyder, solSkærm,
      dato: () => dato, sætDato: (ms) => { sætDato(ms); visDato(); }, iDag, skyderÅr,
      t: () => t,
      // glid: skalaen glider på sek sekunder (ellers springer den)
      sætSkala: (x, glid, sek = 1.2) => { tMål = x; glidTid = sek; if (!glid) { t = x; skala.sæt?.(Math.round(x * 100)); tegnBaner(); } },
      punkt, afstandFor, afstandForBoks, afstandVed, radiusVed, flyvTil, flyver: () => flyvning, besøg, vælgFænomen,
      vælgKamera: () => { første = false; verden.målAfstand = null; },
      banerOm, indRetning, pxPr, overlag: overlag(), lys, sætFokus: (k) => { fokus = k; fokusR = 0; },
      stopFlyvning: () => { flyvning = null; orbit.enabled = true; },
    });

    return {
      styring,
      gåTil,
      besøg,
      sted: () => stedNu,
      opdater(dt) {
        lys.opdater(dt);
        if (flyvning?.slags === 'ind' || forløb.kører()) return;
        if (trækFra != null) return; // man trækker selv i skyderen
        if (tempo) sætDato(dato + Math.sign(tempo) * TEMPI[Math.abs(tempo) - 1] * dt);
        else dato = Math.min(SIDSTE, dato + dt * 1000);
      },
      stop() {
        forløb.stop();
        lys.fjern();
        gem();
        aktiv = false;
        verden.opdateringer.delete(hvertBillede);
        lærred.removeEventListener('pointerdown', vedNed);
        lærred.removeEventListener('pointerup', vedOp);
        navneLag.remove();
        orbit.enabled = true;
        orbit.minDistance = gammelt.min;
        orbit.maxDistance = gammelt.max;
        orbit.zoomSpeed = gammelt.zoom;
        kamera.near = gammelt.nær;
        kamera.far = gammelt.fjern;
        kamera.updateProjectionMatrix();
        kugleGeo.dispose();
        for (const k of kloder) k.mat.dispose();
        for (const b of baner) { b.geo.dispose(); b.linje.material.dispose(); }
        for (const b of [asteroider, kuiper]) { b.geometry.dispose(); b.material.dispose(); }
        ring.geometry.dispose();
        ringMat.dispose();
        tauTekstur.dispose();
        solLys.material.dispose();
      },
      test: {
        kugler: () => ['solen', ...kloder.map((k) => k.p.id)],
        dato: () => dato,
        sætDato: (ms) => { sætDato(ms); placer(); visDato(); },
        datoTekst: () => datoLinje.textContent,
        sætSkala: (x) => { t = tMål = x; skala.sæt?.(Math.round(x * 100)); tegnBaner(); placer(); },
        skala: () => t,
        radius: (id) => (id === 'solen' ? radiusVed(null, t) : radiusVed(klode(id).p, t)),
        afstand: (id) => klode(id).pos.length(),
        spol: (brøk) => { trækFra = dato; skyder.value = brøk; skyder.dispatchEvent(new Event('input')); slip(); },
        tempo: (n) => sætTempo(n),
        iDag,
        // Planeterne kredser mod uret set fra ekliptikkens nordpol (+y): Pladsen nu og et døgn senere
        modUret: () => kloder.every((k) => {
          const a = new THREE.Vector3(...tilProgram(plads(k.p, new Date(dato))));
          const b = new THREE.Vector3(...tilProgram(plads(k.p, new Date(dato + 864e5 * 5))));
          return new THREE.Vector3().crossVectors(a, b).y > 0;
        }),
        // Hvad et tryk px pixel ved siden af klodens midte ville vælge
        trykNær: (id, px) => { placer(); tegnNavne(); const p = id === 'solen' ? solSkærm : klode(id).skærm; return nærmest(p.x + px, p.y); },
        besøg: (id, hop) => besøg(id, hop),
        flyver: () => Boolean(flyvning),
        hop: () => { if (flyvning) { flyvning.tid = flyvning.T; flyv(0); } },
        navne: () => kloder.filter((k) => !k.mærke.hidden).map((k) => k.p.id),
        forløb: () => forløb.test,
        lys: () => lys.test,
        lysStart: () => lys.start(),
        // Kuglens kort, og hvor meget af den belyste side kameraet ser (1 fuld, 0 halv, -1 nat)
        kugleInfo: (id) => {
          const k = klode(id), u = k.mat.uniforms;
          const tilSol = k.pos.clone().negate().normalize(), tilKamera = kamera.position.clone().sub(k.pos).normalize();
          return { harKort: u.uHarKort.value, bredde: u.uKort.value?.image?.width ?? null, dagside: tilSol.dot(tilKamera), skala: k.drej.scale.x, x: k.skærm.x, y: k.skærm.y };
        },
      },
    };
  },
};
