// Snittet gennem en ismåne og lupen ("Under isen", trin 1, docs/drejebog-maaner.md afsnit 5).
//
// lavSnitMåne(radius, { grænser, km }): en kugle med månens kort, hvor den forreste kvart (z > |x| i månens retninger,
// mod kameraet) skæres væk oppefra og ned. Snittet er 0-1: Snitfladen går fra toppen (0) til bunden (1). De tre flader
// i snittet (to halve skiver gennem aksen og låget, der hvor snittet er nået til) får farve efter afstanden fra
// midten: is, hav (lyser svagt), sten og jern i den rigtige skala (grænserne fra js/data/maaner/underisen.js).
// Overfladens shader er sporets egen (efter lavIsmåne i js/solsystem/maane.js), for den har ingen klippeplaner.
//
// lavLupe(vindue, { måne, km, data }): en rund lup (et lærred), der kan trækkes. Den finder punktet under sin midte på
// snittets flader (en stråle fra kameraet) og tegner lagene forstørret omkring den dybde, med Jordens dybeste sted
// (ca. 11 km) som en lille søjle ved siden af havet (drejebogens "noget, man selv finder").

import * as THREE from 'three';
import { verden } from '../scene3d.js';

const OVERFLADE_VERTEX = /* glsl */ `
  varying vec3 vLokal; varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    vUv = uv;
    vLokal = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 v = modelMatrix * vec4(position, 1.0);
    vVerden = v.xyz;
    gl_Position = projectionMatrix * viewMatrix * v;
  }`;

// Lyset som på Jupiters og Saturns ismåner (Lommel-Seeliger blandet med Lambert)
const OVERFLADE_FRAGMENT = /* glsl */ `
  uniform vec3 uSol, uFarve;
  uniform sampler2D tKort;
  uniform float uHarKort, uLys, uSnitY, uSynlig;
  varying vec3 vLokal; varying vec3 vNormal; varying vec3 vVerden; varying vec2 vUv;
  void main() {
    if (vLokal.z > abs(vLokal.x) && vLokal.y > uSnitY) discard;
    vec3 farve = uHarKort > 0.5 ? uFarve * texture2D(tKort, vUv).r * uLys : uFarve * 0.6;
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vVerden);
    float i = max(dot(N, uSol), 0.0);
    float e = max(dot(N, V), 0.0);
    float lys = mix(i, 2.0 * i / (i + e + 0.001), 0.5);
    gl_FragColor = vec4((farve * lys + farve * 0.012) * uSynlig, 1.0);
  }`;

const FLADE_VERTEX = /* glsl */ `
  uniform mat4 uTilMaane;
  varying vec3 vLokal; varying vec3 vNormal;
  void main() {
    vLokal = (uTilMaane * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }`;

// Lagene efter afstanden fra midten (r i brøkdel af radius). uGraenser: isens bund, havets bund, kernens kant.
const FLADE_FRAGMENT = /* glsl */ `
  uniform vec3 uSol, uGraenser;
  uniform float uR, uSnitY, uKlip, uSynlig, uTid;
  varying vec3 vLokal; varying vec3 vNormal;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    if (uKlip > 0.5 && vLokal.y < uSnitY) discard;
    float r = length(vLokal) / uR;
    vec3 farve;
    float glod = 0.0;
    if (r > uGraenser.x) farve = vec3(0.93, 0.96, 1.0);
    else if (r > uGraenser.y) {
      // Havet: blåt og lidt lysende, lysest øverst under isen
      float t = (r - uGraenser.y) / max(uGraenser.x - uGraenser.y, 1e-4);
      farve = mix(vec3(0.10, 0.36, 0.78), vec3(0.22, 0.58, 0.98), t);
      glod = 0.55 + 0.08 * sin(uTid * 1.3 + r * 40.0);
    } else if (r > uGraenser.z) {
      float s = hash(floor(vLokal.xy * 6.0 / uR * 8.0));
      farve = mix(vec3(0.42, 0.31, 0.22), vec3(0.56, 0.42, 0.30), r) * (0.92 + 0.12 * s);
    } else farve = vec3(0.56, 0.58, 0.62) * (0.9 + 0.2 * r / uGraenser.z);
    // En tynd, mørk streg mellem lagene, så de kan skelnes
    float kant = min(min(abs(r - uGraenser.y), abs(r - uGraenser.z)), abs(r - uGraenser.x) * 3.0);
    farve *= mix(0.72, 1.0, smoothstep(0.0, 0.004, kant));
    vec3 N = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    float lys = 0.62 + 0.38 * max(dot(N, uSol), 0.0);
    gl_FragColor = vec4((farve * lys + farve * glod * 0.5) * uSynlig, 1.0);
  }`;

const KVART = Math.PI / 4;

// radius i scene-enheder. grænser: [isens bund, havets bund, kernens kant] i brøkdel af radius.
// lys: hvor lyst kortet tegnes. segmenter: felter rundt om kuglen.
export function lavSnitMåne(radius, { grænser, lys = 1, farve = [1, 0.98, 0.94], segmenter = 96 } = {}) {
  const gruppe = new THREE.Group();
  const overflade = new THREE.ShaderMaterial({
    uniforms: {
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uFarve: { value: new THREE.Vector3(...farve) },
      tKort: { value: null },
      uHarKort: { value: 0 },
      uLys: { value: lys },
      uSnitY: { value: radius * 2 },
      uSynlig: { value: 1 },
    },
    vertexShader: OVERFLADE_VERTEX,
    fragmentShader: OVERFLADE_FRAGMENT,
  });
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(radius, segmenter, Math.round((segmenter * 2) / 3)), overflade);
  gruppe.add(kugle);

  // Fladerne i snittet: samme materiale (hver sin kopi, fordi uTilMaane er fladens egen placering i månen)
  const fladeUniforms = () => ({
    uSol: { value: overflade.uniforms.uSol.value }, // (samme vektor som overfladen)
    uGraenser: { value: new THREE.Vector3(...grænser) },
    uR: { value: radius },
    uSnitY: { value: radius * 2 },
    uKlip: { value: 1 },
    uSynlig: { value: 1 },
    uTid: { value: 0 },
    uTilMaane: { value: new THREE.Matrix4() },
  });
  const fladeMat = (klip) => {
    const m = new THREE.ShaderMaterial({ uniforms: fladeUniforms(), vertexShader: FLADE_VERTEX, fragmentShader: FLADE_FRAGMENT, side: THREE.DoubleSide });
    m.uniforms.uKlip.value = klip ? 1 : 0;
    return m;
  };
  // De to halve skiver gennem aksen ved ±45° (en halv skive i xy-planet med x ≥ 0, drejet om y)
  const halv = new THREE.CircleGeometry(radius, 96, -Math.PI / 2, Math.PI);
  const flader = [-KVART, -3 * KVART].map((vinkel) => {
    const f = new THREE.Mesh(halv, fladeMat(true));
    f.rotation.y = vinkel;
    f.visible = false;
    gruppe.add(f);
    return f;
  });
  // Låget: et kvart cirkelstykke i xz-planet, der hvor snittet er nået til (radius √(R² − y²))
  const låg = new THREE.Mesh(new THREE.CircleGeometry(1, 48, -3 * KVART, Math.PI / 2), fladeMat(false));
  låg.rotation.x = -Math.PI / 2;
  låg.visible = false;
  gruppe.add(låg);
  const alle = [...flader, låg];

  let snit = 0;
  function sætSnit(s) {
    snit = THREE.MathUtils.clamp(s, 0, 1);
    const y = radius * (1 - 2 * snit);
    overflade.uniforms.uSnitY.value = snit > 0 ? y : radius * 2;
    for (const f of flader) {
      f.material.uniforms.uSnitY.value = y;
      f.visible = snit > 0;
    }
    const r = Math.sqrt(Math.max(0, radius * radius - y * y));
    låg.visible = snit > 0 && snit < 1 && r > radius * 0.01;
    låg.position.y = y;
    låg.scale.set(r || 1e-4, r || 1e-4, 1);
    for (const f of alle) {
      f.updateMatrix();
      f.material.uniforms.uTilMaane.value.copy(f.matrix);
    }
  }
  sætSnit(0);

  return {
    gruppe,
    kugle,
    radius,
    flader: alle,
    get snit() { return snit; },
    sætSnit,
    sætKort(t) { overflade.uniforms.tKort.value = t; overflade.uniforms.uHarKort.value = t ? 1 : 0; },
    sætSynlig(v) {
      overflade.uniforms.uSynlig.value = v;
      for (const f of alle) f.material.uniforms.uSynlig.value = v;
    },
    sæt(solRetning, tid) {
      overflade.uniforms.uSol.value.copy(solRetning);
      for (const f of alle) f.material.uniforms.uTid.value = tid;
    },
    // Et punkt på snittets flader i månens egne retninger (til lupen og testene): [x, y, z] eller null
    punktPåFlade(raycaster) {
      const hit = raycaster.intersectObjects(alle.filter((f) => f.visible), false);
      for (const h of hit) {
        const p = gruppe.worldToLocal(h.point.clone());
        if (h.object !== låg && p.y < radius * (1 - 2 * snit) - 1e-3) continue; // (den del af fladen er ikke skåret fri)
        return p;
      }
      return null;
    },
    // Et punkt i månens retninger på den højre halve skive (vinkel ud fra aksen, afstand fra midten i brøkdel af radius)
    punktPåSkive(r, højde) {
      const y = højde * r * radius;
      const s = Math.sqrt(Math.max(0, (r * radius) ** 2 - y * y));
      return new THREE.Vector3(Math.sin(KVART) * s, y, Math.cos(KVART) * s);
    },
    stop() {
      kugle.geometry.dispose();
      overflade.dispose();
      halv.dispose();
      låg.geometry.dispose();
      for (const f of alle) f.material.dispose();
    },
  };
}

// ---------- Lupen ----------
const LUPE_PX = 150; // lupens bredde i CSS-pixel (på pc og tablet)
const VINDUE_KM = 230; // så mange km er der fra top til bund i lupen

// vindue: elementet over 3D-billedet, lupen ligger i (position: relative). måne: lavSnitMåne. data: { r, is, hav,
// havSpænd, kerne, dybeste } i km.
export function lavLupe(vindue, måne, data) {
  const boks = document.createElement('div');
  boks.className = 'ui-lupe';
  boks.hidden = true;
  boks.setAttribute('role', 'img');
  boks.setAttribute('aria-label', 'Lupen: lagene i Europa forstørret, med Jordens dybeste sted ved siden af');
  boks.title = 'Træk lupen hen over snittet';
  const lærred = document.createElement('canvas');
  boks.append(lærred);
  vindue.append(boks);
  const g = lærred.getContext('2d');
  let dpr = 0;
  let W = LUPE_PX; // lupens bredde i CSS-pixel (mindre på telefoner, style.css)
  const bredde = () => boks.offsetWidth || LUPE_PX;

  const plads = { x: 0, y: 0 }; // lupens midte i pixel fra vinduets øverste venstre hjørne
  let sat = false; // har lupen fået sin første plads?
  let trukket = false; // har brugeren selv flyttet den?
  let dybde = null; // dybden under lupens midte (km) eller null
  let sidstTegnet = '';

  // Træk i lupen (den ligger over lærredet, så OrbitControls får ikke trækket)
  let træk = null;
  boks.addEventListener('pointerdown', (h) => {
    h.preventDefault();
    h.stopPropagation();
    boks.setPointerCapture(h.pointerId);
    træk = { id: h.pointerId, dx: h.clientX - plads.x, dy: h.clientY - plads.y };
    boks.classList.add('trækkes');
  });
  boks.addEventListener('pointermove', (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    flyt(h.clientX - træk.dx, h.clientY - træk.dy);
    trukket = true;
  });
  const slip = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    træk = null;
    boks.classList.remove('trækkes');
  };
  boks.addEventListener('pointerup', slip);
  boks.addEventListener('pointercancel', slip);

  function flyt(x, y) {
    const b = vindue.getBoundingClientRect();
    const m = bredde() / 2;
    plads.x = THREE.MathUtils.clamp(x, m, Math.max(m, b.width - m));
    plads.y = THREE.MathUtils.clamp(y, m, Math.max(m, b.height - m));
    boks.style.transform = `translate(${plads.x - m}px, ${plads.y - m}px)`;
  }

  // Lupens plads ved et punkt i månens retninger (vist ved snittets kant, første gang)
  const v = new THREE.Vector3();
  function vedPunkt(lokal) {
    v.copy(lokal);
    måne.gruppe.localToWorld(v);
    v.project(verden.kamera);
    const b = vindue.getBoundingClientRect();
    const c = verden.renderer.domElement.getBoundingClientRect();
    flyt((v.x * 0.5 + 0.5) * c.width + c.left - b.left, (-v.y * 0.5 + 0.5) * c.height + c.top - b.top);
  }

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function find() {
    const b = vindue.getBoundingClientRect();
    const c = verden.renderer.domElement.getBoundingClientRect();
    ndc.set(((plads.x + b.left - c.left) / c.width) * 2 - 1, -((plads.y + b.top - c.top) / c.height) * 2 + 1);
    ray.setFromCamera(ndc, verden.kamera);
    const p = måne.punktPåFlade(ray);
    dybde = p ? data.r - (p.length() / måne.radius) * data.r : null;
  }

  function tegn() {
    const nyDpr = Math.min(2, devicePixelRatio || 1);
    const nyW = bredde();
    if (nyDpr !== dpr || nyW !== W) {
      dpr = nyDpr;
      W = nyW;
      lærred.width = lærred.height = Math.round(W * dpr);
      sidstTegnet = '';
    }
    const nøgle = dybde == null ? 'ingen' : Math.round(dybde * 2) / 2;
    if (nøgle === sidstTegnet) return;
    sidstTegnet = nøgle;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, W);
    g.save();
    g.beginPath();
    g.arc(W / 2, W / 2, W / 2 - 2, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = '#05070d';
    g.fillRect(0, 0, W, W);
    if (dybde == null) {
      g.fillStyle = 'rgba(220, 230, 255, 0.85)';
      g.font = '600 13px system-ui, sans-serif';
      g.textAlign = 'center';
      g.fillText('Træk mig hen', W / 2, W / 2 - 4);
      g.fillText('over snittet', W / 2, W / 2 + 13);
      g.restore();
      ring(W);
      return;
    }
    // Lodret: dybden i km. Toppen af lupen er dybde − VINDUE_KM/2, men aldrig mere end 25 km over overfladen.
    const top = Math.max(-25, dybde - VINDUE_KM / 2);
    const y = (km) => ((km - top) / VINDUE_KM) * W;
    const isBund = data.is, havBund = data.is + data.hav;
    const [lav, høj] = data.havSpænd;
    // Rummet, isen, havet, stenen og jernet
    bånd(y(0), y(isBund), '#eef4ff');
    bånd(y(isBund), y(isBund + lav), '#2f86e8');
    // Havets bund er ikke målt: Havet toner over i stenen mellem 60 og 150 km under isen
    const gr = g.createLinearGradient(0, y(isBund + lav), 0, y(isBund + høj));
    gr.addColorStop(0, '#2f86e8');
    gr.addColorStop(1, '#8a6a4c');
    g.fillStyle = gr;
    g.fillRect(0, y(isBund + lav), W, y(isBund + høj) - y(isBund + lav));
    bånd(y(isBund + høj), y(data.r - data.kerne), '#8a6a4c');
    bånd(y(data.r - data.kerne), y(data.r), '#9aa0a8');
    // Jordens dybeste sted (ca. 11 km) som en søjle fra havets top, til højre
    const sx = W * 0.66, sb = 14;
    g.fillStyle = '#0b2f66';
    g.fillRect(sx, y(isBund), sb, y(isBund + data.dybeste) - y(isBund));
    g.strokeStyle = '#ffd36b';
    g.lineWidth = 1.5;
    g.strokeRect(sx, y(isBund), sb, y(isBund + data.dybeste) - y(isBund));
    // Mærkerne
    g.font = '600 12px system-ui, sans-serif';
    g.textAlign = 'left';
    const mærke = (tekst, km, farve = '#ffffff') => {
      const yy = y(km);
      if (yy < 12 || yy > W - 6) return;
      if (farve === '#ffffff') {
        g.fillStyle = 'rgba(0, 0, 0, 0.55)';
        g.fillRect(14, yy - 11, g.measureText(tekst).width + 8, 15);
      }
      g.fillStyle = farve;
      g.fillText(tekst, 18, yy);
    };
    mærke('Is', isBund / 2 + 4, '#1b2440');
    mærke(`Hav ${lav}-${høj} km`, isBund + lav / 2 + 4);
    mærke('Sten', isBund + høj + 22);
    g.fillStyle = '#ffd36b';
    g.font = '600 11px system-ui, sans-serif';
    g.textAlign = 'right';
    const jy = y(isBund + data.dybeste) + 13;
    if (jy > 12 && jy < W - 4) {
      g.fillText('Jordens', W - 8, jy);
      g.fillText('dybeste: 11 km', W - 8, jy + 12);
    }
    g.restore();
    ring(W);
  }
  function bånd(y0, y1, farve) {
    g.fillStyle = farve;
    g.fillRect(0, y0, W, y1 - y0);
  }
  function ring(W) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.beginPath();
    g.arc(W / 2, W / 2, W / 2 - 2, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(230, 240, 255, 0.9)';
    g.lineWidth = 3;
    g.stroke();
  }

  return {
    get vist() { return !boks.hidden; },
    get dybde() { return dybde; },
    get trukket() { return trukket; },
    vis(til) {
      if (boks.hidden === !til) return;
      boks.hidden = !til;
      if (til && !sat) {
        sat = true;
        vedPunkt(måne.punktPåSkive(1 - (data.is + 50) / data.r, 0.42)); // i havet, ved snittets højre kant
      }
    },
    // Lupen flytter sig ikke med kameraet, men lagene under den findes igen hvert billede
    opdater() {
      if (boks.hidden) return;
      find();
      tegn();
    },
    flytTil: (x, y) => { flyt(x, y); trukket = true; }, // til tests
    plads: () => ({ ...plads }),
    stop() { boks.remove(); },
  };
}
