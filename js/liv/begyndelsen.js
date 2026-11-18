// Liv L5: tegningerne til delen "Begyndelsen" (js/begyndelsen.js styrer dem, data i js/data/liv/begyndelsen.js).
// Fire scener i én gruppe, og kun én er synlig ad gangen:
// - kolbe: Millers kolbe med vand, der koger, gasserne som små molekyler (kemikernes farver fra js/molekyle3d.js), to
//   elektroder og et lyn. Vandet skifter farve, og prikker (aminosyrerne) kommer frem i det.
// - hinde: tæt på i vandet. Fedtstoffer (et hoved og en hale) drypper ned og samler sig selv til tre små bobler med et
//   dobbelt lag. Hovederne og halerne er to InstancedMesh.
// - rna: en kort RNA-kæde lige ud (kun én side), og en kopi, der bliver bygget et bogstav ad gangen nedenunder. En fejl
//   får en orange ring (som fejlene i Kopien i Liv).
// - trappe: fem trin fra byggesten til en celle. Hvert trin er fyldt så langt, som forskerne er nået. Det øverste kan man
//   prøve at nå: Det fyldes lidt og løber så tomt igen.
// Tal og tider bruger dt fra opdater (står stille under pause). Navnene i shaderkode er ikke brugt her.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG, lavPrikTekstur } from '../scene3d.js';
import { KERNE_FARVE } from '../molekyle3d.js';
import { TRAPPEN, VAND_FARVER, RNA_START } from '../data/liv/begyndelsen.js';

// Basernes farver som i resten af Liv (js/liv/stige.js og kodehjul.js), U lyserød
const BASE = { A: '#3ddc84', G: '#ffc93c', C: '#4ea8ff', U: '#ff8fc8' };
const FEJL_FARVE = '#ff9a3c';
const TEKST_FARVE = '#c4cee6'; // ikke hvid, ellers gløder teksten
const Y = new THREE.Vector3(0, 1, 0);
const tV = new THREE.Vector3();
const tV2 = new THREE.Vector3();
const tQ = new THREE.Quaternion();
const tM = new THREE.Matrix4();
const tS = new THREE.Vector3();
const tF = new THREE.Color();
const blød = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Fast tilfældighed (så scenerne ser ens ud hver gang)
function lavTilfældig(frø) {
  let s = frø >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Et skilt (sprite) med en eller flere linjer tekst. linjer: [[tekst, farve, størrelse]]
function lavSkilt(bredde, højde, skala) {
  const c = document.createElement('canvas');
  c.width = bredde;
  c.height = højde;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set(skala, (skala * højde) / bredde, 1);
  s.tegn = (linjer) => {
    const g = c.getContext('2d');
    g.clearRect(0, 0, bredde, højde);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.shadowColor = 'rgba(0,0,0,0.9)';
    g.shadowBlur = 8;
    const ialt = linjer.reduce((a, l) => a + l[2] * 1.2, 0);
    let y = højde / 2 - ialt / 2;
    for (const [tekst, farve, str] of linjer) {
      g.font = `700 ${str}px system-ui, sans-serif`;
      g.fillStyle = farve;
      g.fillText(tekst, bredde / 2, y + str * 0.6);
      y += str * 1.2;
    }
    t.needsUpdate = true;
  };
  return s;
}

// ---------- Kolben ----------
const R = 3; // kolbens radius
const VAND_Y = -0.9; // vandets overflade
const GAS = { // atomernes pladser i hvert molekyle (enheder) og bindingerne
  metan: { atomer: [['C', 0, 0, 0], ['H', 0.32, 0.32, 0.32], ['H', -0.32, -0.32, 0.32], ['H', -0.32, 0.32, -0.32], ['H', 0.32, -0.32, -0.32]], bånd: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  ammoniak: { atomer: [['N', 0, 0.1, 0], ['H', 0.46, -0.12, 0], ['H', -0.23, -0.12, 0.4], ['H', -0.23, -0.12, -0.4]], bånd: [[0, 1], [0, 2], [0, 3]] },
  hydrogen: { atomer: [['H', -0.19, 0, 0], ['H', 0.19, 0, 0]], bånd: [[0, 1]] },
  vand: { atomer: [['O', 0, 0, 0], ['H', 0.37, 0.29, 0], ['H', -0.37, 0.29, 0]], bånd: [[0, 1], [0, 2]] },
  kuldioxid: { atomer: [['C', 0, 0, 0], ['O', 0.5, 0, 0], ['O', -0.5, 0, 0]], bånd: [[0, 1], [0, 2]] },
  nitrogen: { atomer: [['N', -0.28, 0, 0], ['N', 0.28, 0, 0]], bånd: [[0, 1]] },
};
const ATOM_R = { H: 0.13, C: 0.21, N: 0.2, O: 0.2 };
const BLANDING = {
  miller: ['metan', 'metan', 'metan', 'ammoniak', 'ammoniak', 'ammoniak', 'hydrogen', 'hydrogen', 'hydrogen', 'vand', 'vand'],
  co2: ['kuldioxid', 'kuldioxid', 'kuldioxid', 'kuldioxid', 'nitrogen', 'nitrogen', 'nitrogen', 'nitrogen', 'vand', 'vand'],
};
const LYN_TID = 0.35; // sekunder, lynet lyser
const FARVE_FART = ROLIG ? 20 : 2.2; // så hurtigt skifter vandet farve
const PRIKKER = LAV_KVALITET ? 40 : 70;

function lavKolbe() {
  const g = new THREE.Group();
  g.position.y = -0.8; // kolben og halsen står midt i billedet
  const glasMat = new THREE.MeshStandardMaterial({ color: '#a9cbff', transparent: true, opacity: 0.13, roughness: 0.08, side: THREE.DoubleSide, depthWrite: false });
  const glas = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 28), glasMat);
  const hals = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.9, 24, 1, true), glasMat);
  hals.position.y = R + 0.55;
  const kant = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 8, 32), new THREE.MeshStandardMaterial({ color: '#7f94c8', roughness: 0.4 }));
  kant.rotation.x = Math.PI / 2;
  kant.position.y = R + 1.5;
  // Vandet: en kalot af en kugle og en flade ovenpå
  const r = R * 0.97;
  const θ0 = Math.acos(VAND_Y / r);
  const vandMat = new THREE.MeshStandardMaterial({ color: VAND_FARVER.miller[0], transparent: true, opacity: 0.72, roughness: 0.25, side: THREE.DoubleSide, depthWrite: false });
  const vand = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 16, 0, Math.PI * 2, θ0, Math.PI - θ0), vandMat);
  const flade = new THREE.Mesh(new THREE.CircleGeometry(r * Math.sin(θ0), 40), vandMat);
  flade.rotation.x = -Math.PI / 2;
  flade.position.y = VAND_Y;
  g.add(glas, hals, kant, vand, flade);

  // Bobler, der stiger op (vandet koger)
  const tilf = lavTilfældig(1953);
  const bobleMat = new THREE.MeshBasicMaterial({ color: '#dfe9ff', transparent: true, opacity: 0.35, depthWrite: false });
  const bobleGeo = new THREE.SphereGeometry(0.07, 8, 6);
  const bobler = [];
  for (let i = 0; i < 12; i++) {
    const b = new THREE.Mesh(bobleGeo, bobleMat);
    b.userData = { x: (tilf() - 0.5) * 3, z: (tilf() - 0.5) * 2.4, t: tilf(), fart: 0.25 + tilf() * 0.3 };
    bobler.push(b);
    g.add(b);
  }

  // Aminosyrerne: prikker i vandet, flere jo mere farvet det er
  const prikker = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe7a8' }), PRIKKER);
  const prikSted = [];
  for (let i = 0; i < PRIKKER; i++) {
    let p;
    do p = new THREE.Vector3((tilf() - 0.5) * 2 * r, VAND_Y - tilf() * (r + VAND_Y), (tilf() - 0.5) * 2 * r);
    while (p.length() > r - 0.2 || p.y > VAND_Y - 0.1);
    prikSted.push(p);
  }
  prikker.count = 0;
  g.add(prikker);

  // Kalken på bunden (Cleaves m.fl. 2008)
  const kalk = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), new THREE.MeshStandardMaterial({ color: '#e7e1d2', roughness: 0.8 }), 36);
  for (let i = 0; i < 36; i++) {
    const a = tilf() * Math.PI * 2;
    const d = Math.sqrt(tilf()) * 1.6;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    const y = -Math.sqrt(Math.max(0, (r - 0.08) ** 2 - x * x - z * z)) + 0.05;
    tM.compose(tV.set(x, y, z), tQ.setFromAxisAngle(Y, tilf() * 3), tS.set(1, 1, 1));
    kalk.setMatrixAt(i, tM);
  }
  kalk.visible = false;
  g.add(kalk);

  // Elektroderne og lynet
  const metal = new THREE.MeshStandardMaterial({ color: '#b8c0d6', metalness: 0.7, roughness: 0.3 });
  const spids = [new THREE.Vector3(-0.5, 1.2, 0), new THREE.Vector3(0.5, 1.2, 0)];
  for (const [i, s] of spids.entries()) {
    const fra = new THREE.Vector3(i ? 3.6 : -3.6, 2.2, 0);
    const længde = fra.distanceTo(s);
    const stang = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, længde, 8), metal);
    stang.position.copy(fra).add(s).multiplyScalar(0.5);
    stang.quaternion.setFromUnitVectors(Y, tV.copy(s).sub(fra).normalize());
    const kugle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), metal);
    kugle.position.copy(s);
    g.add(stang, kugle);
  }
  const LYN_PUNKTER = 12;
  const lynGeo = new THREE.BufferGeometry();
  lynGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(LYN_PUNKTER * 3), 3));
  const lynLinje = new THREE.Line(lynGeo, new THREE.LineBasicMaterial({ color: new THREE.Color(2.4, 2.6, 3.4), transparent: true }));
  const lynLys = new THREE.Sprite(new THREE.SpriteMaterial({ map: lavPrikTekstur(true), color: '#a9c8ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  lynLys.position.set(0, 1.2, 0);
  lynLys.scale.setScalar(3.4);
  lynLinje.visible = lynLys.visible = false;
  g.add(lynLinje, lynLys);
  const zigzag = () => {
    const a = lynGeo.attributes.position;
    for (let i = 0; i < LYN_PUNKTER; i++) {
      const t = i / (LYN_PUNKTER - 1);
      const kant = i === 0 || i === LYN_PUNKTER - 1 ? 0 : 1;
      a.setXYZ(i, -0.5 + t, 1.2 + kant * (Math.random() - 0.5) * 0.32, kant * (Math.random() - 0.5) * 0.2);
    }
    a.needsUpdate = true;
  };

  // Gasserne
  const atomGeo = new THREE.SphereGeometry(1, LAV_KVALITET ? 10 : 14, LAV_KVALITET ? 8 : 10);
  const båndGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 6);
  const atomMat = {};
  for (const el of ['H', 'C', 'N', 'O']) atomMat[el] = new THREE.MeshStandardMaterial({ color: KERNE_FARVE[el].clone().multiplyScalar(el === 'C' ? 1.6 : 1.15), roughness: 0.4 });
  const båndMat = new THREE.MeshStandardMaterial({ color: '#8d97b5', roughness: 0.5 });
  const gasGruppe = new THREE.Group();
  g.add(gasGruppe);
  let molekyler = [];
  function lavMolekyle(navn) {
    const m = new THREE.Group();
    const d = GAS[navn];
    for (const [el, x, y, z] of d.atomer) {
      const a = new THREE.Mesh(atomGeo, atomMat[el]);
      a.position.set(x, y, z);
      a.scale.setScalar(ATOM_R[el]);
      m.add(a);
    }
    for (const [i, j] of d.bånd) {
      const a = tV.set(...d.atomer[i].slice(1));
      const b = tV2.set(...d.atomer[j].slice(1));
      const s = new THREE.Mesh(båndGeo, båndMat);
      s.position.copy(a).add(b).multiplyScalar(0.5);
      s.scale.y = a.distanceTo(b);
      s.quaternion.setFromUnitVectors(Y, b.clone().sub(a).normalize());
      m.add(s);
    }
    return m;
  }
  function sætLuft(luft) {
    gasGruppe.clear();
    const t = lavTilfældig(luft === 'co2' ? 2008 : 1952);
    molekyler = BLANDING[luft].map((navn) => {
      const m = lavMolekyle(navn);
      let p;
      do p = new THREE.Vector3((t() - 0.5) * 4.4, VAND_Y + 0.5 + t() * 2.6, (t() - 0.5) * 3.4);
      while (p.length() > R - 0.55);
      m.position.copy(p);
      m.rotation.set(t() * 6, t() * 6, t() * 6);
      m.userData = { v: new THREE.Vector3(t() - 0.5, t() - 0.5, t() - 0.5).multiplyScalar(0.5), drej: new THREE.Vector3(t() - 0.5, t() - 0.5, t() - 0.5) };
      gasGruppe.add(m);
      return m;
    });
    luften = luft;
  }

  let luften = 'miller';
  let farve = 0; // vist farve (0-1)
  let mål = 0;
  let lynTid = 0;
  let zigTid = 0;
  sætLuft('miller');

  function sætVandFarve() {
    const [a, b, c] = VAND_FARVER[luften];
    const f = farve < 0.5 ? tF.set(a).lerp(new THREE.Color(b), farve * 2) : tF.set(b).lerp(new THREE.Color(c), (farve - 0.5) * 2);
    vandMat.color.copy(f);
    vandMat.opacity = 0.62 + farve * 0.25;
    prikker.count = Math.round(PRIKKER * farve);
  }

  function opdater(dt, tid) {
    // Gasserne svæver rundt i kolben, hurtigere lige efter et lyn
    const fart = 1 + (lynTid > 0 ? 4 : 0);
    for (const m of molekyler) {
      const u = m.userData;
      m.position.addScaledVector(u.v, dt * fart);
      if (m.position.length() > R - 0.5 || m.position.y < VAND_Y + 0.45) {
        // Spring tilbage fra glasset eller vandet (normalen peger ud af rummet)
        if (m.position.y < VAND_Y + 0.45) tV.set(0, -1, 0);
        else tV.copy(m.position).normalize();
        if (u.v.dot(tV) > 0) u.v.reflect(tV);
      }
      m.rotation.x += u.drej.x * dt;
      m.rotation.y += u.drej.y * dt;
    }
    for (const b of bobler) {
      const u = b.userData;
      u.t = (u.t + dt * u.fart) % 1;
      const bund = -Math.sqrt(Math.max(0, (r - 0.25) ** 2 - u.x * u.x - u.z * u.z));
      b.position.set(u.x + Math.sin(tid * 3 + u.t * 9) * 0.05, bund + (VAND_Y - bund) * u.t, u.z);
    }
    if (Math.abs(mål - farve) > 0.001) {
      farve += (mål - farve) * Math.min(1, dt * FARVE_FART);
      if (Math.abs(mål - farve) < 0.002) farve = mål;
      sætVandFarve();
    }
    if (lynTid > 0) {
      lynTid -= dt;
      zigTid -= dt;
      if (zigTid <= 0) {
        zigzag();
        zigTid = 0.05;
      }
      const lys = Math.max(0, lynTid / LYN_TID);
      lynLinje.material.opacity = 0.4 + 0.6 * lys;
      lynLys.material.opacity = lys * (ROLIG ? 0.4 : 0.9);
      if (lynTid <= 0) lynLinje.visible = lynLys.visible = false;
    }
  }

  return {
    gruppe: g,
    opdater,
    kasse: [3.9, 4.6],
    sætLuft,
    luft: () => luften,
    sætKalk: (til) => { kalk.visible = til; },
    kalk: () => kalk.visible,
    sætFarve(f, straks = false) {
      mål = f;
      if (straks) {
        farve = f;
        sætVandFarve();
      }
    },
    farve: () => farve,
    mål: () => mål,
    lyn() {
      lynTid = LYN_TID;
      zigTid = 0;
      lynLinje.visible = lynLys.visible = true;
    },
    lyser: () => lynTid > 0,
  };
}

// ---------- Hinden (bobler af fedtstof) ----------
const BOBLER = [
  { c: [-2.2, 0.7, 0], r: 1.35 },
  { c: [2.1, 0.3, 0.3], r: 1.05 },
  { c: [0.1, -1.7, -0.3], r: 0.85 },
];
const LAG = 0.32; // hovedet sidder så langt fra midten af det dobbelte lag
const AFSTAND = LAV_KVALITET ? 0.44 : 0.36; // mellem to hoveder
const HALE = 0.4;
const FALD = ROLIG ? 0.2 : 1.2; // sekunder om at dryppe ned
const SAML = ROLIG ? 0.4 : 3.0; // sekunder om at samle sig

// Punkter jævnt fordelt på en kugle (Fibonacci)
function kuglePunkter(n) {
  const ud = [];
  const gyldent = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    ud.push(new THREE.Vector3(Math.cos(gyldent * i) * r, y, Math.sin(gyldent * i) * r));
  }
  return ud;
}

function lavHinde() {
  const g = new THREE.Group();
  // Vandet omkring (man er tæt på, inde i vandet)
  const hav = new THREE.Mesh(new THREE.SphereGeometry(40, 24, 16), new THREE.MeshBasicMaterial({ color: '#0d2c55', transparent: true, opacity: 0.55, side: THREE.BackSide, depthWrite: false }));
  g.add(hav);
  // Hvert fedtstof: mål (hovedets plads og retning fra halen mod hovedet), start og tilfældig ventetid
  const tilf = lavTilfældig(1985);
  const stoffer = [];
  const indre = [];
  for (const b of BOBLER) {
    const c = new THREE.Vector3(...b.c);
    for (const [ud, rr] of [[1, b.r + LAG], [-1, b.r - LAG]]) {
      const n = Math.round((4 * Math.PI * rr * rr) / (AFSTAND * AFSTAND));
      for (const p of kuglePunkter(n)) {
        stoffer.push({
          mål: c.clone().addScaledVector(p, rr),
          retning: p.clone().multiplyScalar(ud),
          top: new THREE.Vector3((tilf() - 0.5) * 3, 5 + tilf() * 1.5, (tilf() - 0.5) * 2),
          spredt: new THREE.Vector3((tilf() - 0.5) * 9, (tilf() - 0.5) * 6, (tilf() - 0.5) * 3),
          start: new THREE.Vector3(tilf() - 0.5, tilf() - 0.5, tilf() - 0.5).normalize(),
          vent: tilf() * 0.35,
        });
      }
    }
    // Vandet inde i boblen
    const v = new THREE.Mesh(new THREE.SphereGeometry(b.r - LAG - 0.12, 20, 14), new THREE.MeshBasicMaterial({ color: '#3f86d8', transparent: true, opacity: 0, depthWrite: false }));
    v.position.copy(c);
    indre.push(v);
    g.add(v);
  }
  const N = stoffer.length;
  const hoveder = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshStandardMaterial({ color: '#79d3ff', roughness: 0.35 }), N);
  const haler = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, HALE, 5), new THREE.MeshStandardMaterial({ color: '#d9c58a', roughness: 0.6 }), N);
  hoveder.count = haler.count = 0;
  g.add(hoveder, haler);

  let fase = 'tom';
  let t = 0;
  const p = new THREE.Vector3();
  const r = new THREE.Vector3();
  function tegn() {
    for (let i = 0; i < N; i++) {
      const s = stoffer[i];
      if (t < FALD) {
        const a = blød(t / FALD);
        p.copy(s.top).lerp(s.spredt, a);
        r.copy(s.start);
      } else {
        const a = blød((t - FALD - s.vent * (SAML / 3)) / (SAML * 0.75));
        p.copy(s.spredt).lerp(s.mål, a);
        r.copy(s.start).lerp(s.retning, a).normalize();
      }
      tQ.setFromUnitVectors(Y, r);
      tM.compose(p, tQ, tS.set(1, 1, 1));
      hoveder.setMatrixAt(i, tM);
      tV.copy(p).addScaledVector(r, -(0.12 + HALE / 2));
      tM.compose(tV, tQ, tS);
      haler.setMatrixAt(i, tM);
    }
    hoveder.instanceMatrix.needsUpdate = haler.instanceMatrix.needsUpdate = true;
    const samlet = Math.max(0, Math.min(1, (t - FALD - SAML * 0.8) / 0.6));
    for (const v of indre) v.material.opacity = samlet * 0.28;
  }

  return {
    gruppe: g,
    kasse: [4.3, 3.6],
    antal: N,
    dryp() {
      if (fase !== 'tom') return false;
      fase = 'drypper';
      t = 0;
      hoveder.count = haler.count = N;
      tegn();
      return true;
    },
    nulstil() {
      fase = 'tom';
      t = 0;
      hoveder.count = haler.count = 0;
      for (const v of indre) v.material.opacity = 0;
    },
    fase: () => fase,
    opdater(dt) {
      if (fase === 'tom' || fase === 'samlet') return;
      t += dt;
      if (t >= FALD) fase = 'samler';
      if (t >= FALD + SAML + 0.6) {
        t = FALD + SAML + 0.6;
        fase = 'samlet';
      }
      tegn();
    },
  };
}

// ---------- RNA'et ----------
const RNA_D = 0.95; // mellem to bogstaver
const RYG_Y = 1.35; // rygraden på den gamle side (den nye i −RYG_Y)
const BYG_TID = ROLIG ? 0.08 : 0.42; // sekunder pr. bogstav

function lavRna() {
  const g = new THREE.Group();
  const n = RNA_START.length;
  const x = (i) => (i - (n - 1) / 2) * RNA_D;
  const kugleGeo = new THREE.SphereGeometry(1, 14, 10);
  const pindGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, 8);
  const rygMat = [new THREE.MeshStandardMaterial({ color: '#4c62b8', roughness: 0.4 }), new THREE.MeshStandardMaterial({ color: '#8ea2ff', roughness: 0.4 })];
  const baseMat = {};
  for (const [b, f] of Object.entries(BASE)) baseMat[b] = new THREE.MeshStandardMaterial({ color: new THREE.Color(f).multiplyScalar(0.72), roughness: 0.4 });
  // En side: rygrad, pinde, baser og bogstaver. side 0 er den gamle (øverst), 1 den nye (nederst)
  function lavSide(side) {
    const s = side ? -1 : 1;
    const dele = [];
    const ryg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, (n - 1) * RNA_D, 8), rygMat[side]);
    ryg.rotation.z = Math.PI / 2;
    ryg.position.y = s * RYG_Y;
    if (!side) g.add(ryg);
    for (let i = 0; i < n; i++) {
      const d = new THREE.Group();
      d.position.set(x(i), s * RYG_Y, 0);
      const k = new THREE.Mesh(kugleGeo, rygMat[side]);
      k.scale.setScalar(0.19);
      const pind = new THREE.Mesh(pindGeo, baseMat.A);
      pind.scale.y = 0.55;
      pind.position.y = -s * 0.3;
      const base = new THREE.Mesh(kugleGeo, baseMat.A);
      base.scale.setScalar(0.25);
      base.position.y = -s * 0.68;
      const skilt = lavSkilt(128, 128, 0.62);
      skilt.position.y = s * 0.62;
      d.add(k, pind, base, skilt);
      d.userData = { pind, base, skilt };
      dele.push(d);
      g.add(d);
    }
    // Den nye sides rygrad vokser med
    const nyRyg = side ? new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 8), rygMat[1]) : null;
    if (nyRyg) {
      nyRyg.rotation.z = Math.PI / 2;
      nyRyg.position.y = -RYG_Y;
      nyRyg.visible = false;
      g.add(nyRyg);
    }
    return { dele, nyRyg };
  }
  function sætBogstav(d, b, fejl = false) {
    d.userData.pind.material = baseMat[b];
    d.userData.base.material = baseMat[b];
    d.userData.skilt.tegn([[b, fejl ? FEJL_FARVE : BASE[b], 84]]);
  }
  const gammel = lavSide(0);
  const ny = lavSide(1);
  [...RNA_START].forEach((b, i) => sætBogstav(gammel.dele[i], b));
  // Ringen om en fejl
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 8, 32), new THREE.MeshBasicMaterial({ color: FEJL_FARVE, transparent: true }));
  ring.visible = false;
  g.add(ring);

  let kopi = null; // [{ b, fejl }]
  let bygget = 0; // så mange bogstaver er sat på
  let t = 0;
  let fart = 1;
  let ringTid = 0;
  const fejlNr = () => (kopi ? kopi.slice(0, bygget).findIndex((k) => k.fejl) : -1);

  function vis() {
    for (let i = 0; i < n; i++) {
      const d = ny.dele[i];
      d.visible = i < bygget;
      if (i < bygget) sætBogstav(d, kopi[i].b, kopi[i].fejl);
    }
    ny.nyRyg.visible = bygget > 1;
    if (bygget > 1) {
      ny.nyRyg.scale.y = (bygget - 1) * RNA_D;
      ny.nyRyg.position.x = (x(0) + x(bygget - 1)) / 2;
    }
    const f = fejlNr();
    ring.visible = f >= 0;
    if (f >= 0) ring.position.set(x(f), -RYG_Y + 0.62 - 0.06, 0.02);
  }

  return {
    gruppe: g,
    kasse: [6.3, 2.5],
    nulstil() {
      kopi = null;
      bygget = 0;
      t = 0;
      vis();
    },
    kopiér(nyKopi, hurtig = 1) {
      kopi = nyKopi;
      bygget = 0;
      t = 0;
      fart = hurtig;
      vis();
    },
    sætFart: (f) => { fart = f; },
    kopierer: () => Boolean(kopi) && bygget < n,
    færdig: () => Boolean(kopi) && bygget >= n,
    bygget: () => bygget,
    fejl: () => (kopi ? kopi.slice(0, bygget).filter((k) => k.fejl).length : 0),
    fejlNr,
    opdater(dt) {
      if (ring.visible) {
        ringTid += dt;
        ring.material.opacity = ROLIG ? 0.9 : 0.6 + 0.4 * Math.sin(ringTid * 5);
      }
      if (!kopi || bygget >= n) return;
      t += dt * fart;
      const nu = Math.min(n, Math.floor(t / BYG_TID));
      if (nu !== bygget) {
        bygget = nu;
        vis();
      }
    },
  };
}

// ---------- Trappen ----------
const TRIN_B = 1.9;
const TRIN_H = 0.72;
const TRIN_BUND = -2.3;
const TOP_TID = ROLIG ? 1 : 2.2; // sekunder: det øverste trin fyldes lidt og løber tomt igen

function lavTrappe() {
  const g = new THREE.Group();
  const skalGeo = new THREE.BoxGeometry(TRIN_B, 1, TRIN_B);
  const fyldGeo = new THREE.BoxGeometry(TRIN_B * 0.94, 1, TRIN_B * 0.94);
  fyldGeo.translate(0, 0.5, 0); // fyldet vokser op fra bunden
  const trin = TRAPPEN.map((d, i) => {
    const h = TRIN_H * (i + 1);
    const x = (i - (TRAPPEN.length - 1) / 2) * (TRIN_B + 0.12);
    const skalMat = new THREE.MeshStandardMaterial({ color: '#2a3558', roughness: 0.55, transparent: true, opacity: 0.55, depthWrite: false });
    const skal = new THREE.Mesh(skalGeo, skalMat);
    skal.scale.y = h;
    skal.position.set(x, TRIN_BUND + h / 2, 0);
    skal.userData.nr = i;
    const fyldMat = new THREE.MeshStandardMaterial({ color: '#2c84a8', emissive: '#5fe3ff', emissiveIntensity: 0.35, roughness: 0.4 });
    const fyld = new THREE.Mesh(fyldGeo, fyldMat);
    fyld.position.set(x, TRIN_BUND + 0.01, 0);
    const kant = new THREE.LineSegments(new THREE.EdgesGeometry(skalGeo), new THREE.LineBasicMaterial({ color: '#7f94c8', transparent: true, opacity: 0.6 }));
    kant.scale.y = h;
    kant.position.copy(skal.position);
    const skilt = lavSkilt(512, 200, 2.3);
    skilt.position.set(x, TRIN_BUND + h + 0.65, 0.2);
    g.add(fyld, skal, kant, skilt);
    return { d, h, skal, fyld, kant, skilt, fyldt: d.nået, puls: 0, vent: 0 };
  });
  const MÆRKE = (n) => (n >= 1 ? '✓' : n > 0 ? '½' : '?');
  function sætSkilt(tr, valgt) {
    tr.skilt.tegn([[tr.d.navn, valgt ? '#9ff0ff' : TEKST_FARVE, 64], [MÆRKE(tr.d.nået), tr.d.nået >= 1 ? '#5fe3ff' : tr.d.nået > 0 ? '#9fb3e0' : '#ffd23c', 70]]);
  }
  let valgt = -1;
  let topTid = 0;
  let forsøg = 0;
  function tegnTrin() {
    for (const tr of trin) {
      tr.fyld.scale.y = Math.max(0.001, tr.h * tr.fyldt);
      tr.fyld.visible = tr.fyldt > 0.002;
      tr.fyld.material.emissiveIntensity = 0.3 + tr.puls * 0.7 + (trin.indexOf(tr) === valgt ? 0.25 : 0);
      tr.kant.material.color.set(trin.indexOf(tr) === valgt ? '#9ff0ff' : '#7f94c8');
    }
  }
  trin.forEach((tr) => sætSkilt(tr, false));
  tegnTrin();
  const top = trin.at(-1);
  return {
    gruppe: g,
    kasse: [5.5, 3.3],
    meshes: trin.map((tr) => tr.skal),
    nulstil() {
      valgt = -1;
      topTid = 0;
      for (const tr of trin) {
        tr.fyldt = tr.d.nået;
        tr.puls = 0;
        tr.vent = 0;
        sætSkilt(tr, false);
      }
      tegnTrin();
    },
    // De trin, der er en del af turen, lyser kort op (en efter en)
    lysOp() {
      trin.forEach((tr, i) => { tr.vent = tr.d.tur ? 0.3 + i * 0.35 : 0; });
    },
    vælg(i) {
      valgt = i;
      trin.forEach((tr, j) => sætSkilt(tr, j === i));
      tegnTrin();
    },
    valgt: () => valgt,
    // Prøv at nå det øverste trin: Det fyldes lidt og løber så tomt igen. Det bliver aldrig nået.
    prøvTop() {
      if (topTid > 0) return false;
      topTid = TOP_TID;
      forsøg++;
      return true;
    },
    prøver: () => topTid > 0,
    forsøg: () => forsøg,
    topNået: () => top.fyldt >= 1,
    trinVed(stråle) {
      const ram = new THREE.Raycaster();
      ram.ray.copy(stråle);
      const hit = ram.intersectObjects(trin.map((tr) => tr.skal), false)[0];
      return hit ? hit.object.userData.nr : -1;
    },
    opdater(dt) {
      let ændret = false;
      for (const tr of trin) {
        if (tr.vent > 0) {
          tr.vent -= dt;
          if (tr.vent <= 0) tr.puls = 1;
        } else if (tr.puls > 0) {
          tr.puls = Math.max(0, tr.puls - dt * 0.9);
          ændret = true;
        }
      }
      if (topTid > 0) {
        topTid = Math.max(0, topTid - dt);
        const t = 1 - topTid / TOP_TID; // 0 → 1
        // Op til ca. 60 % på den første tredjedel, så flakker det og løber tomt
        top.fyldt = t < 0.35 ? blød(t / 0.35) * 0.6 : 0.6 * (1 - blød((t - 0.35) / 0.65)) * (ROLIG ? 1 : 0.85 + 0.15 * Math.sin(t * 60));
        if (topTid === 0) top.fyldt = 0;
        ændret = true;
      }
      if (ændret) tegnTrin();
    },
  };
}

// ---------- Det hele ----------
export function lavBegyndelsenTegning() {
  const gruppe = new THREE.Group();
  const scener = { kolbe: lavKolbe(), hinde: lavHinde(), rna: lavRna(), trappe: lavTrappe() };
  for (const s of Object.values(scener)) {
    s.gruppe.visible = false;
    gruppe.add(s.gruppe);
  }
  let vist = null;
  return {
    gruppe,
    ...scener,
    vis(id) {
      vist = id;
      for (const [k, s] of Object.entries(scener)) s.gruppe.visible = k === id;
    },
    vist: () => vist,
    kasse: (id) => scener[id].kasse,
    opdater(dt, tid) {
      if (vist) scener[vist].opdater(dt, tid);
    },
  };
}
