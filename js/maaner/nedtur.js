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
// Tallene og tidsplanen står i js/data/maaner/landhuygens.js.

import * as THREE from 'three';
import { LAV_KVALITET, TEST_HURTIG, ROLIG, lavPrikTekstur } from '../scene3d.js';
import { TITAN, FALDSKÆRM_KM, SE_JORDEN_KM, STOP_KM, højdeVed, tidVed, fartVed, skærmVed, urTekst, billedeVed, BILLEDER, KREDIT, DATO } from '../data/maaner/landhuygens.js';

const MAPPE = new URL('../../billeder/solsystem/', import.meta.url);
const SIGT = 15.8; // km: jorden lige under Huygens anes 30 km oppe (e^(−30/15,8) ≈ 0,15) og ses klart under 5 km
const SØJLE_KM = FALDSKÆRM_KM; // søjlen går fra jorden til 160 km
const STOR = 1.5, LILLE = 0.55; // faldskærmens størrelse i tegningen (8,3 m og 3 m)
const KUPPEL_R = 600; // kuplens radius (kameraets far er 3000)

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
  const snore = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xd8d2c8, transparent: true, opacity: 0.8 }));
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
    // Himlen: lysere orange ved horisonten og mod Solen, mørkere opad. Lidt lysere højt oppe
    float hoej = clamp(uH / 160.0, 0.0, 1.0);
    vec3 horisont = mix(vec3(0.62, 0.38, 0.17), vec3(0.78, 0.5, 0.24), hoej);
    vec3 top = mix(vec3(0.3, 0.16, 0.07), vec3(0.42, 0.24, 0.1), hoej);
    vec3 c = mix(horisont, top, pow(clamp(d.y, 0.0, 1.0), 0.55));
    c += vec3(0.22, 0.14, 0.05) * pow(max(dot(d, uSol), 0.0), 8.0);
    if (d.y < 0.0) {
      // Jorden: hvor strålen rammer en flad jord uH km under Huygens (km mod øst og nord)
      float s = uH / max(-d.y, 0.015);
      vec2 p = vec2(d.x, -d.z) * s;
      float g = 0.42;
      if (uHarKort > 0.5) g = texture2D(uKort, uLand + p / uKmPrUv).r;
      // Små detaljer tegnet ovenpå (kortet har kun ca. 8 km pr. punkt)
      float n = 0.5 * stoej(p * 0.6) + 0.3 * stoej(p * 2.3) + 0.2 * stoej(p * 9.0);
      g = clamp((g - 0.45) * 1.8 + 0.45 + 0.4 * (n - 0.5), 0.0, 1.0);
      // Mørke sletter og lyse bakker (orange lys fra disen)
      vec3 jord = mix(vec3(0.13, 0.09, 0.06), vec3(0.72, 0.55, 0.36), g);
      vec3 dis = mix(horisont, vec3(0.5, 0.3, 0.13), clamp(-d.y * 1.4, 0.0, 1.0) * (1.0 - 0.4 * hoej));
      c = mix(dis, jord, exp(-s / uSigt));
    }
    gl_FragColor = vec4(c * uLys, 1.0);
  }`;

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
    depthTest: false,
    depthWrite: false,
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
  system.add(new THREE.Line(rem, new THREE.LineBasicMaterial({ color: 0xd8d2c8 })));
  gruppe.add(system);
  gruppe.add(new THREE.AmbientLight(0xffb878, 1.1));
  const sollys = new THREE.DirectionalLight(0xffd8a8, 1.0);
  sollys.position.copy(kuppelMat.uniforms.uSol.value);
  gruppe.add(sollys);

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
  const kornMat = new THREE.PointsMaterial({ size: 0.07, map: lavPrikTekstur(true), color: 0xffd9ae, transparent: true, opacity: 0.45, depthWrite: false });
  const kornP = new THREE.Points(kornGeo, kornMat);
  kornP.frustumCulled = false;
  gruppe.add(kornP);

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

  function tegnUr(nu = false) {
    const t = urTekst(s, jorden);
    const nøgle = t.navn + t.tal + t.under;
    if (!nu && nøgle === sidsteUr) return;
    sidsteUr = nøgle;
    ur.navn.textContent = t.navn;
    ur.tal.textContent = t.tal;
    ur.under.textContent = `${t.under} ⇄`;
  }
  function tegnUI() {
    højdeEl.textContent = h >= 10 ? `${Math.round(h)} km` : h >= 1 ? `${h.toFixed(1).replace('.', ',')} km` : `${Math.round(h * 1000)} m`;
    prik.style.top = `${(1 - Math.min(1, h / SØJLE_KM)) * 100}%`;
    tegnUr();
  }
  function visBillede() {
    const b = billedeVed(h);
    const vis = Boolean(b) && kameraTil && gruppe.visible;
    kam.hidden = !vis;
    if (!b || b === billede) return;
    billede = b;
    sete.add(b.km);
    img.src = billeder.get(b.fil)?.src ?? new URL(b.fil, MAPPE).href;
    kmEl.textContent = `· ${String(b.km).replace('.', ',')} km`;
    // Det første billede, hvor jorden kan ses (ca. 30 km), lyser lidt op
    kam.classList.toggle('jorden', b.km <= SE_JORDEN_KM + 1 && b.km >= SE_JORDEN_KM - 1);
  }

  return {
    gruppe,
    ui,
    get s() { return s; },
    get h() { return h; },
    get billede() { return billede; },
    get jorden() { return jorden; },
    get vist() { return gruppe.visible; },
    sætDato(tekst) { datoEl.textContent = `📅 ${tekst}`; },
    // Starter turen i faldskærmen (åbn: faldskærmen folder sig ud)
    start({ åbn = true, til = 0 } = {}) {
      hentBilleder();
      gruppe.visible = true;
      måler.hidden = false;
      this.sætDato(DATO.ned);
      åbner = åbn && !ROLIG ? 0 : 1;
      this.sæt(til);
    },
    skjul() {
      gruppe.visible = false;
      måler.hidden = true;
      kam.hidden = true;
      kam.classList.remove('stor');
    },
    sæt(sek) {
      s = Math.min(Math.max(0, sek), tidVed(STOP_KM)); // (M5a: turen stopper ved STOP_KM, landingen kommer i M5b)
      h = højdeVed(s);
      tegnUI();
      visBillede();
    },
    kontakt(til) { kameraTil = til; visBillede(); },
    // dt: sekunder på skærmen, spol: sekunder i virkeligheden, der er gået
    opdater(dt, spol) {
      if (!gruppe.visible) return;
      tid += dt;
      if (h > STOP_KM + 1e-6) this.sæt(s + spol);
      kuppelMat.uniforms.uH.value = h;
      kuppelMat.uniforms.uLys.value = 0.78 + 0.22 * Math.min(1, h / SØJLE_KM);
      // Faldskærmen folder sig ud og skiftes til den lille efter 15 min
      if (åbner < 1) åbner = Math.min(1, åbner + dt / 1.1);
      const mål = skærmVed(s) === 'stor' ? STOR : LILLE;
      const e = 1 - (1 - åbner) ** 3;
      const str = THREE.MathUtils.lerp(0.15, mål, e);
      skærm.scale.setScalar(str);
      skærm.scale.x = skærm.scale.z = str * (0.4 + 0.6 * e);
      // Huygens drejer langsomt og gynger lidt (mest højt oppe, hvor vinden er stærk)
      if (!ROLIG) {
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
      måler: !måler.hidden, højdeTekst: højdeEl.textContent, kort: kuppelMat.uniforms.uHarKort.value === 1,
    }),
    skiftUr: () => urKnap.click(),
    stop() {
      ui.remove();
      kam.remove();
      gruppe.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      kornMat.map?.dispose();
    },
  };
}
