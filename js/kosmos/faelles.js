// Fælles byggeklodser til Kosmos-animationerne.

import * as THREE from 'three';
import { lavPrikTekstur, LAV_KVALITET } from '../scene3d.js';

export const KVALITET = LAV_KVALITET ? 0.5 : 1;

let blød = null;
let skarp = null;
export function blødTekstur() {
  return (blød ??= lavPrikTekstur(true));
}
export function prikTekstur() {
  return (skarp ??= lavPrikTekstur());
}

// En lysende glorie (fx om en stjerne)
export function glød(farve, størrelse, opacitet = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: blødTekstur(), color: farve, transparent: true, opacity: opacitet, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  s.scale.setScalar(størrelse);
  return s;
}

// Mange små lysende prikker (punkter), som man selv flytter rundt på
export function prikSky(antal, størrelse, farveFn) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(antal * 3), 3));
  const farver = new Float32Array(antal * 3);
  if (farveFn) {
    const c = new THREE.Color();
    for (let i = 0; i < antal; i++) {
      farveFn(i, c);
      farver.set([c.r, c.g, c.b], i * 3);
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(farver, 3));
  const punkter = new THREE.Points(geo, new THREE.PointsMaterial({
    size: størrelse, map: prikTekstur(), vertexColors: Boolean(farveFn), transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punkter.frustumCulled = false;
  return punkter;
}

// En glødende stjerne: en kugle med en kogende overflade (lavet med støj i en lille shader) og en glorie.
// lys og mørk er farverne på de varme og de køligere pletter. styrke > 1 gør den så lys, at den gløder.
const STJERNE_VERTEX = `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;
const STJERNE_FRAGMENT = `
  uniform vec3 farveLys;
  uniform vec3 farveMork;
  uniform float tid;
  uniform float skala;
  uniform float styrke;
  uniform float kant;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float stoej(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * stoej(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec3 p = normalize(vPos) * skala;
    float n = fbm(p + vec3(0.0, tid * 0.12, tid * 0.05));
    float g = fbm(p * 3.1 - vec3(tid * 0.2));
    float m = smoothstep(0.3, 0.7, n * 0.65 + g * 0.35);
    vec3 c = mix(farveMork, farveLys, m);
    float ndv = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    c *= mix(kant, 1.0, pow(ndv, 0.6)) * styrke;
    gl_FragColor = vec4(c, 1.0);
  }`;

export function stjerne(radius, lys, mørk, glødFarve, glødStørrelse = 3, { styrke = 1.6, skala = 3.2, kant = 0.35 } = {}) {
  const gruppe = new THREE.Group();
  const materiale = new THREE.ShaderMaterial({
    uniforms: {
      farveLys: { value: new THREE.Color(lys) },
      farveMork: { value: new THREE.Color(mørk) },
      tid: { value: 0 },
      skala: { value: skala },
      styrke: { value: styrke },
      kant: { value: kant },
    },
    vertexShader: STJERNE_VERTEX,
    fragmentShader: STJERNE_FRAGMENT,
  });
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(radius, 48 * KVALITET + 16, 32 * KVALITET + 12), materiale);
  kugle.onBeforeRender = () => { materiale.uniforms.tid.value = performance.now() / 1000; };
  const glorie = glød(glødFarve, radius * glødStørrelse, 0.85);
  gruppe.add(kugle, glorie);
  gruppe.userData.kugle = kugle;
  gruppe.userData.glorie = glorie;
  gruppe.userData.materiale = materiale;
  return gruppe;
}

// Et net af linjer (rumtidens "gummidug"), hvis højde kan ændres hvert billede
export function gitterDug(størrelse = 60, linjer = 41, punkterPrLinje = 120) {
  const pos = [];
  const halv = størrelse / 2;
  const skridt = størrelse / (linjer - 1);
  const del = størrelse / (punkterPrLinje - 1);
  // Linjer langs x og langs z, delt op i små stykker
  for (let i = 0; i < linjer; i++) {
    const fast = -halv + i * skridt;
    for (let j = 0; j < punkterPrLinje - 1; j++) {
      const a = -halv + j * del, b = a + del;
      pos.push(a, 0, fast, b, 0, fast);
      pos.push(fast, 0, a, fast, 0, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(pos);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(arr.length), 3));
  const mesh = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  mesh.frustumCulled = false;
  const grund = new THREE.Color(0.12, 0.38, 0.9);
  const dyb = new THREE.Color(0.75, 0.35, 1.6);
  const c = new THREE.Color();
  return {
    mesh,
    // højde(x, z) giver dugens højde (negativ = en fordybning)
    opdater(højde) {
      const p = geo.attributes.position.array;
      const f = geo.attributes.color.array;
      for (let i = 0; i < p.length; i += 3) {
        const y = højde(p[i], p[i + 2]);
        p[i + 1] = y;
        const kant = 1 - Math.min(1, Math.hypot(p[i], p[i + 2]) / halv) ** 2; // svagere ude ved kanten
        c.copy(grund).lerp(dyb, Math.min(1, Math.abs(y) / 6)).multiplyScalar(0.35 + 0.9 * kant);
        f[i] = c.r; f[i + 1] = c.g; f[i + 2] = c.b;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    },
  };
}

// Magnetfeltlinjer fra en dipol (som Jordens eller en pulsars)
export function dipolLinjer(størrelser = [2, 3, 4.5, 6.5], antalRundt = 8, farve = 0x6fb6ff, opacitet = 0.45) {
  const pos = [];
  for (const L of størrelser) {
    for (let k = 0; k < antalRundt; k++) {
      const φ = (k / antalRundt) * Math.PI * 2;
      let forrige = null;
      for (let i = 0; i <= 60; i++) {
        const θ = 0.12 + (i / 60) * (Math.PI - 0.24);
        const r = L * Math.sin(θ) ** 2;
        const p = new THREE.Vector3(r * Math.sin(θ) * Math.cos(φ), r * Math.cos(θ), r * Math.sin(θ) * Math.sin(φ));
        if (forrige) pos.push(forrige.x, forrige.y, forrige.z, p.x, p.y, p.z);
        forrige = p;
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false, blending: THREE.AdditiveBlending }));
}

// Et skilt med tekst, der altid vender mod kameraet
export function skilt(tekst, farve = '#ffffff', størrelse = 1) {
  const c = document.createElement('canvas');
  const font = '800 34px system-ui, sans-serif';
  let g = c.getContext('2d');
  g.font = font;
  // Lærredet bliver så bredt, som teksten kræver (mindst 256 punkter)
  c.width = Math.max(256, Math.ceil(g.measureText(tekst).width + 28));
  c.height = 64;
  g = c.getContext('2d');
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  // En mørk kant om bogstaverne, så teksten kan læses oven på lyse ting
  g.lineJoin = 'round';
  g.lineWidth = 7;
  g.strokeStyle = 'rgba(5,8,20,0.85)';
  g.strokeText(tekst, c.width / 2, 34);
  g.shadowColor = 'rgba(0,0,0,0.9)';
  g.shadowBlur = 6;
  g.fillStyle = farve;
  g.fillText(tekst, c.width / 2, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set((c.width / 64) * størrelse, størrelse, 1);
  return s;
}

// Rydder op: fjerner geometrier, materialer og teksturer i en gruppe
export function ryd(gruppe) {
  gruppe.traverse((o) => {
    o.geometry?.dispose();
    const m = o.material;
    if (m) {
      for (const mm of Array.isArray(m) ? m : [m]) {
        if (mm.map && mm.map !== blød && mm.map !== skarp && mm.map !== toning) mm.map.dispose();
        mm.dispose();
      }
    }
  });
  gruppe.clear();
}

// En lille graf, der ruller hen over skærmen (fx de blink, et radioteleskop måler).
// overlag er et HTML-element oven på 3D-billedet. Kald tilføj(værdi) hvert billede (værdi mellem -1 og 1).
export function rullendeGraf(overlag, tekst, farve = '#6ff3ff', { punkter = 240, midt = false } = {}) {
  const boks = document.createElement('div');
  boks.className = 'kosmos-graf';
  const navn = document.createElement('span');
  navn.textContent = tekst;
  const c = document.createElement('canvas');
  c.width = 420;
  c.height = 70;
  boks.append(navn, c);
  overlag.append(boks);
  const g = c.getContext('2d');
  const data = new Float32Array(punkter);
  return {
    tilføj(v) {
      data.copyWithin(0, 1);
      data[punkter - 1] = v;
    },
    tegn() {
      g.clearRect(0, 0, c.width, c.height);
      const nul = midt ? c.height / 2 : c.height - 6;
      const højde = midt ? c.height / 2 - 6 : c.height - 12;
      g.strokeStyle = 'rgba(255,255,255,0.12)';
      g.beginPath();
      g.moveTo(0, nul);
      g.lineTo(c.width, nul);
      g.stroke();
      g.strokeStyle = farve;
      g.lineWidth = 2;
      g.shadowColor = farve;
      g.shadowBlur = 6;
      g.beginPath();
      for (let i = 0; i < punkter; i++) {
        const x = (i / (punkter - 1)) * c.width;
        const y = nul - data[i] * højde;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
      g.shadowBlur = 0;
    },
    nulstil() {
      data.fill(0);
    },
  };
}

// En hale efter noget, der bevæger sig. Kald følg(position) hvert billede.
export function hale(antal = 100, farve = 0x9fd3ff, opacitet = 0.6) {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(antal * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const linje = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: farve, transparent: true, opacity: opacitet, depthWrite: false, blending: THREE.AdditiveBlending }));
  linje.frustumCulled = false;
  return {
    linje,
    følg(p) {
      arr.copyWithin(3, 0, (antal - 1) * 3);
      arr[0] = p.x; arr[1] = p.y; arr[2] = p.z;
      geo.attributes.position.needsUpdate = true;
    },
    nulstil(p) {
      for (let i = 0; i < antal; i++) arr.set([p.x, p.y, p.z], i * 3);
      geo.attributes.position.needsUpdate = true;
    },
  };
}

// Flade ringe, der breder sig ud i et plan (fx tyngdebølger set ovenfra)
export function ringPulje(forælder, antal = 14, farve = new THREE.Color(0.5, 0.75, 1.6)) {
  const geo = new THREE.RingGeometry(0.96, 1, 96);
  const ringe = [];
  for (let i = 0; i < antal; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: farve, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    m.visible = false;
    forælder.add(m);
    ringe.push({ m, alder: 0, styrke: 0 });
  }
  let næste = 0;
  return {
    send(styrke = 1, fart = 8, levetid = 2.2) {
      const r = ringe[næste];
      næste = (næste + 1) % antal;
      Object.assign(r, { alder: 0, styrke, fart, levetid });
      r.m.visible = true;
    },
    opdater(dt) {
      for (const r of ringe) {
        if (!r.m.visible) continue;
        r.alder += dt;
        const f = r.alder / r.levetid;
        if (f >= 1) { r.m.visible = false; continue; }
        r.m.scale.setScalar(0.5 + r.fart * r.alder);
        r.m.material.opacity = (1 - f) * 0.55 * r.styrke;
      }
    },
    skjul() {
      for (const r of ringe) r.m.visible = false;
    },
  };
}

// En toning fra hvid (forneden) til gennemsigtig (foroven), fx til lysstråler
let toning = null;
export function toningTekstur() {
  if (toning) return toning;
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 128, 0, 0);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  toning = new THREE.CanvasTexture(c);
  toning.colorSpace = THREE.SRGBColorSpace;
  return toning;
}
