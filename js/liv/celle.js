// Liv, zoom-rejsen: cellen, cellekernen og kromosomet i 3D (de tre trin før stigen). Alt er tegnet forenklet og
// meget tommere end i virkeligheden (en rigtig celle er proppet med proteiner og vand). Hver tegning er ca. 20
// enheder i radius og har sætSynlighed(a) til overtoningen mellem trinene og opdater(dt) til en langsom bevægelse.

import * as THREE from 'three';
import { LAV_KVALITET, lavPrikTekstur } from '../scene3d.js';

// En hinde (cellens eller kernens): gennemsigtig i midten og tydelig i kanten (som en sæbeboble)
export function hindeMateriale(farve, styrke = 1) {
  return new THREE.ShaderMaterial({
    uniforms: { uFarve: { value: new THREE.Color(farve) }, uOpacitet: { value: 1 }, uStyrke: { value: styrke } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uFarve;
      uniform float uOpacitet;
      uniform float uStyrke;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float kant = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        gl_FragColor = vec4(uFarve * (0.35 + 1.1 * kant), (0.05 + 0.75 * kant) * uOpacitet * uStyrke);
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

// Husker hvert materiales fulde opacitet, så hele tegningen kan tones ind og ud
function lavTone(gruppe) {
  const mats = [];
  gruppe.traverse((o) => {
    if (!o.material) return;
    for (const m of [o.material].flat()) {
      if (mats.some((x) => x.m === m)) continue;
      mats.push({ m, fuld: m.uniforms?.uOpacitet ? 1 : m.opacity });
      if (!m.uniforms?.uOpacitet) m.transparent = true;
    }
  });
  return (a) => {
    gruppe.visible = a > 0.005;
    for (const { m, fuld } of mats) {
      if (m.uniforms?.uOpacitet) m.uniforms.uOpacitet.value = a;
      else {
        m.opacity = fuld * a;
        m.depthWrite = a > 0.6 && fuld >= 1;
      }
    }
  };
}

function prikker(punkter, farve, størrelse, opacitet = 0.8) {
  const geo = new THREE.BufferGeometry().setFromPoints(punkter);
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: farve, size: størrelse, map: lavPrikTekstur(true), transparent: true, opacity: opacitet,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
}

// Et punkt et tilfældigt sted i en kugle (eller en skal mellem r0 og r1)
function iKugle(r1, r0 = 0, ud = new THREE.Vector3()) {
  ud.randomDirection();
  return ud.multiplyScalar(r0 + (r1 - r0) * Math.cbrt(Math.random()));
}

// ---------- Cellen ----------
export function lavCelle() {
  const g = new THREE.Group();
  const R = 20;
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), hindeMateriale(0xff8fb0, 0.9)));
  // Kernen (ca. 6 µm i en celle på ca. 15 µm) med kernelegemet (det mørke) og DNA'et som en violet tåge
  const kerne = new THREE.Group();
  kerne.add(new THREE.Mesh(new THREE.SphereGeometry(7, 40, 28), hindeMateriale(0xb48cff, 1.4)));
  kerne.add(new THREE.Mesh(new THREE.SphereGeometry(6.8, 32, 24), new THREE.MeshStandardMaterial({ color: 0x3a2470, roughness: 0.8, transparent: true, opacity: 0.55, emissive: 0x1d0f40 })));
  const kl = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 16), new THREE.MeshStandardMaterial({ color: 0x6a3fb0, roughness: 0.6, emissive: 0x2a1060 }));
  kl.position.set(1.6, 1.2, 2.4);
  kerne.add(kl);
  const tåge = [];
  for (let i = 0; i < (LAV_KVALITET ? 260 : 520); i++) tåge.push(iKugle(6.4));
  kerne.add(prikker(tåge, 0xc9a8ff, 0.9, 0.45));
  kerne.position.set(-2, 1, 0);
  g.add(kerne);
  // Mitokondrierne (cellens kraftværker) og små prikker (ribosomer og andet), meget færre end i virkeligheden
  const mitoMat = new THREE.MeshStandardMaterial({ color: 0xff9a4d, roughness: 0.55, emissive: 0x3a1500 });
  const mitoGeo = new THREE.CapsuleGeometry(0.9, 2.6, 6, 12);
  const op = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 11; i++) {
    const m = new THREE.Mesh(mitoGeo, mitoMat);
    for (;;) {
      iKugle(17, 10, m.position);
      if (m.position.distanceTo(kerne.position) > 10) break;
    }
    m.quaternion.setFromUnitVectors(op, new THREE.Vector3().randomDirection());
    g.add(m);
  }
  const små = [];
  for (let i = 0; i < (LAV_KVALITET ? 400 : 900); i++) {
    const p = iKugle(19);
    if (p.distanceTo(kerne.position) > 7.6) små.push(p);
  }
  g.add(prikker(små, 0x9fd8ff, 0.45, 0.5));
  const tone = lavTone(g);
  return {
    gruppe: g, radius: R,
    mål: kerne, målRadius: 7, // det, man trykker på i forløbet "Opskriften i dig": cellekernen
    sætSynlighed: tone,
    opdater(dt) { g.rotation.y += dt * 0.05; },
  };
}

// ---------- Kernen med de 46 kromosomer ----------
// Hvert kromosom er en filtret tråd i sit eget område. De to i et par har samme farve.
export function lavKerne() {
  const g = new THREE.Group();
  const R = 20;
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), hindeMateriale(0xb48cff, 1.1)));
  // Porerne i kernens hinde (prikker på overfladen)
  const porer = [];
  for (let i = 0; i < (LAV_KVALITET ? 160 : 320); i++) porer.push(new THREE.Vector3().randomDirection().multiplyScalar(R));
  g.add(prikker(porer, 0xe6d6ff, 0.55, 0.6));
  const trin = LAV_KVALITET ? 34 : 56;
  const p = new THREE.Vector3();
  const centre = [];
  for (let k = 0; k < 46; k++) {
    // Områderne skal ikke ligge oven i hinanden
    let c;
    for (let forsøg = 0; forsøg < 40; forsøg++) {
      c = iKugle(14);
      if (centre.every((x) => x.distanceTo(c) > 4.2)) break;
    }
    centre.push(c);
    const punkter = [c.clone()];
    p.copy(c);
    for (let i = 0; i < trin; i++) {
      p.add(new THREE.Vector3().randomDirection().multiplyScalar(1.1));
      // Bliv tæt på områdets midte og inde i kernen
      const væk = p.clone().sub(c);
      if (væk.length() > 3.6) p.addScaledVector(væk.normalize(), -0.9);
      if (p.length() > R - 2) p.multiplyScalar((R - 2) / p.length());
      punkter.push(p.clone());
    }
    const kurve = new THREE.CatmullRomCurve3(punkter);
    const farve = new THREE.Color().setHSL((Math.floor(k / 2) / 23) * 0.92, 0.7, 0.36); // mørke nok til, at gløden ikke gør dem hvide
    const geo = new THREE.TubeGeometry(kurve, trin * (LAV_KVALITET ? 3 : 4), 0.22, LAV_KVALITET ? 4 : 6, false);
    g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: farve, roughness: 0.5, emissive: farve.clone().multiplyScalar(0.06) })));
  }
  const tone = lavTone(g);
  return {
    gruppe: g, radius: R,
    mål: g, målRadius: R * 0.95, // trådene fylder kernen, så et tryk inde i den rammer en tråd (forløbet)
    sætSynlighed: tone,
    opdater(dt) { g.rotation.y += dt * 0.04; },
  };
}

// ---------- Kromosomet: DNA viklet om perler af protein (histoner), rullet op som en fjeder ----------
// Målestok: DNA-tråden er 2 nm og perlerne ca. 10 nm (OpenStax 10-1), så perlerne er ca. 5 gange så brede som tråden.
export function lavKromosom() {
  const g = new THREE.Group();
  const R_DNA = 0.32;
  const R_PERLE = 1.25;
  const R_VIKLING = R_PERLE + R_DNA; // DNA'et ligger uden på perlen
  const antal = LAV_KVALITET ? 22 : 34;
  const R_SPIRAL = 4.2;
  const VINKEL = (68 * Math.PI) / 180; // drejning pr. perle i fjederen
  const LØFT = 1.05; // højde pr. perle
  const perler = [];
  for (let i = 0; i < antal; i++) {
    const v = i * VINKEL;
    perler.push(new THREE.Vector3(R_SPIRAL * Math.cos(v), (i - (antal - 1) / 2) * LØFT, R_SPIRAL * Math.sin(v)));
  }
  const perleGeo = new THREE.SphereGeometry(1, 20, 14);
  const perleMat = new THREE.MeshStandardMaterial({ color: 0xf2a65a, roughness: 0.6, emissive: 0x3a1c05 });
  const perleMesh = new THREE.InstancedMesh(perleGeo, perleMat, antal);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3(R_PERLE, R_PERLE * 0.8, R_PERLE);
  perler.forEach((c, i) => perleMesh.setMatrixAt(i, m.compose(c, q, s)));
  g.add(perleMesh);
  // DNA'et: ca. 1,7 omgange om hver perle (aksen lodret), og et stykke imellem til den næste perle
  const punkter = [];
  const vinkelTil = (a, b) => Math.atan2(b.z - a.z, b.x - a.x);
  for (let i = 0; i < antal; i++) {
    const c = perler[i];
    const ind = i > 0 ? vinkelTil(c, perler[i - 1]) : vinkelTil(c, perler[1]) + Math.PI;
    let ud = i < antal - 1 ? vinkelTil(c, perler[i + 1]) : ind + Math.PI;
    while (ud < ind + 2 * Math.PI * 1.35) ud += 2 * Math.PI; // ca. 1,4-2,4 omgange: så mange, at det passer med vejen videre
    const n = 22;
    for (let j = 0; j <= n; j++) {
      const t = j / n;
      const v = ind + (ud - ind) * t;
      punkter.push(new THREE.Vector3(c.x + R_VIKLING * Math.cos(v), c.y - 0.55 + 1.1 * t, c.z + R_VIKLING * Math.sin(v)));
    }
  }
  const kurve = new THREE.CatmullRomCurve3(punkter);
  const dnaGeo = new THREE.TubeGeometry(kurve, punkter.length * (LAV_KVALITET ? 2 : 3), R_DNA, LAV_KVALITET ? 5 : 8, false);
  g.add(new THREE.Mesh(dnaGeo, new THREE.MeshStandardMaterial({ color: 0x7f9cff, roughness: 0.4, emissive: 0x101c50 })));
  g.rotation.z = 0.18;
  const tone = lavTone(g);
  return {
    gruppe: g, radius: Math.max(R_SPIRAL + R_VIKLING + 1, ((antal - 1) * LØFT) / 2 + 2),
    sætSynlighed: tone,
    opdater(dt) { g.rotation.y += dt * 0.12; },
  };
}
