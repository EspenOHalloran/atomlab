// Liv L4: tegningen af pladen med bakterierne (turen "Fejlen, der hjalp" og "Leg frit: pladen"). Modellen står i
// js/data/liv/plade.js, og delen, der styrer den, i js/liv-fejlen.js.
// Pladen er set fra oven: feltet uden medicin til venstre og fire bånd med mere og mere antibiotika (et lærred).
// Bakterierne er prikker i én InstancedMesh, én pr. felt i gitteret (færre med LAV_KVALITET). Prikker med en fejl har en
// anden farve, også i feltet uden medicin (på den rigtige plade kunne man ikke se dem, "Ærligt talt" siger det).
// Over pladen står et skilt (et lærred): båndenes styrke eller tiden og antallet af bakterier.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG } from '../scene3d.js';
import { BÅND, OMRÅDER, LAG } from '../data/liv/plade.js';

export const PLADE_KOL = LAV_KVALITET ? 70 : 100; // søjler og rækker i gitteret
const SIDE = 20; // pladens side (enheder)
const STRIBE = 2.4; // skiltets højde over pladen
const MELLEM = 0.35;
const HØJDE = SIDE + MELLEM + STRIBE;
const PLADE_Y = -HØJDE / 2 + SIDE / 2; // pladens midte, så det hele står midt i billedet
const SKILT_Y = HØJDE / 2 - STRIBE / 2;
const VOKS_TID = ROLIG ? 0.01 : 0.35; // sekunder om at vokse frem
// Bakteriernes farver efter antal fejl (0-4), lysere uden at blive hvide af gløden
export const PRIK_FARVE = ['#9fbde3', '#ffd23c', '#ff8a3d', '#ff4f7b', '#c582ff'];
const FELT_FARVE = ['#33476e', '#262243', '#1f1a37', '#19132c', '#140e22']; // feltet uden medicin er lysest
const TEKST_PX = 1024;

const tV = new THREE.Vector3();
const tM = new THREE.Matrix4();
const tQ = new THREE.Quaternion();
const tS = new THREE.Vector3();
const tF = new THREE.Color();
const plan = new THREE.Plane();

// Lidt uro i prikkernes pladser (altid den samme for et felt)
const uro = (i, a) => {
  const x = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

const tal = (x) => x.toLocaleString('da-DK');

export function lavPladeTegning() {
  const gruppe = new THREE.Group();
  const kol = PLADE_KOL;
  const n = kol * kol;
  const c = SIDE / kol; // et felts side

  // Pladen (båndene) på et lærred
  const bånd = document.createElement('canvas');
  bånd.width = bånd.height = LAV_KVALITET ? 512 : 1024;
  const båndTekstur = new THREE.CanvasTexture(bånd);
  båndTekstur.colorSpace = THREE.SRGBColorSpace;
  const pladeMat = new THREE.MeshBasicMaterial({ map: båndTekstur, transparent: true });
  const plade = new THREE.Mesh(new THREE.PlaneGeometry(SIDE, SIDE), pladeMat);
  plade.position.y = PLADE_Y;
  // Kanten af skålen
  const kantMat = new THREE.LineBasicMaterial({ color: '#6c7fae', transparent: true });
  const kant = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(SIDE + 0.3, SIDE + 0.3)), kantMat);
  kant.position.set(0, PLADE_Y, 0.01);

  // Bakterierne
  const prikMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true });
  const prikker = new THREE.InstancedMesh(new THREE.CircleGeometry(c * 0.74, LAV_KVALITET ? 7 : 9), prikMat, n);
  prikker.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  prikker.position.set(0, PLADE_Y, 0.03);
  prikker.frustumCulled = false;
  for (let i = 0; i < n; i++) {
    prikker.setMatrixAt(i, tM.makeScale(0, 0, 0));
    prikker.setColorAt(i, tF.set(PRIK_FARVE[0]));
  }

  // Ringe om det, man har fundet
  const ringMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false });
  const ringGeo = new THREE.RingGeometry(0.72, 1, 48);
  const ringe = Array.from({ length: 6 }, () => {
    const r = new THREE.Mesh(ringGeo, ringMat);
    r.visible = false;
    r.position.z = 0.06;
    return r;
  });
  const ringGruppe = new THREE.Group();
  ringGruppe.position.y = PLADE_Y;
  ringGruppe.add(...ringe);

  // Skiltet over pladen
  const skilt = document.createElement('canvas');
  skilt.width = TEKST_PX;
  skilt.height = Math.round((TEKST_PX * STRIBE) / SIDE);
  const skiltTekstur = new THREE.CanvasTexture(skilt);
  skiltTekstur.colorSpace = THREE.SRGBColorSpace;
  const skiltMat = new THREE.MeshBasicMaterial({ map: skiltTekstur, transparent: true, depthWrite: false });
  const skiltFlade = new THREE.Mesh(new THREE.PlaneGeometry(SIDE, STRIBE), skiltMat);
  skiltFlade.position.y = SKILT_Y;

  gruppe.add(plade, kant, prikker, ringGruppe, skiltFlade);
  const mats = [pladeMat, kantMat, prikMat, ringMat, skiltMat];

  let model = null;
  let lag = null;
  let vokser = []; // [i, alder]
  let skiltNøgle = '';
  let synlighed = 0;
  let tid = 0;
  let puls = false; // trin 4: prikkerne med en fejl i feltet uden medicin pulserer
  let pulsere = []; // de felter, der pulserer
  let ringListe = []; // [{ k, j, r }]

  // Pladen: et felt uden medicin og bånd, der bliver mørkere, med en tynd streg mellem dem
  function tegnBånd(navn) {
    lag = navn;
    const niv = LAG[navn] ?? LAG.normal;
    const g = bånd.getContext('2d');
    const W = bånd.width;
    g.clearRect(0, 0, W, W);
    for (let o = 0; o < OMRÅDER; o++) {
      g.fillStyle = FELT_FARVE[niv[o]];
      g.fillRect((o * W) / OMRÅDER, 0, W / OMRÅDER + 1, W);
    }
    g.fillStyle = 'rgba(255, 255, 255, 0.10)';
    for (let o = 1; o < OMRÅDER; o++) if (niv[o] !== niv[o - 1]) g.fillRect((o * W) / OMRÅDER - 1, 0, 2, W);
    båndTekstur.needsUpdate = true;
  }

  // Skiltet: { bånd: true } giver båndenes styrke, { tekst } en linje midt over pladen
  function sætSkilt(info) {
    const nøgle = info?.bånd ? `bånd|${lag}` : info?.tekst ?? '';
    if (nøgle === skiltNøgle) return;
    skiltNøgle = nøgle;
    const g = skilt.getContext('2d');
    const W = skilt.width;
    const H = skilt.height;
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#c4cee6'; // ikke hvid, ellers gløder skiltet
    if (info?.bånd) {
      const niv = LAG[lag] ?? LAG.normal;
      // Områder med samme niveau ved siden af hinanden får ét navn
      for (let o = 0; o < OMRÅDER;) {
        let slut = o;
        while (slut + 1 < OMRÅDER && niv[slut + 1] === niv[o]) slut++;
        const x = (((o + slut + 1) / 2) * W) / OMRÅDER;
        if (niv[o] === 0) {
          g.font = `700 ${Math.round(H * 0.3)}px system-ui, sans-serif`;
          g.fillText('Ingen', x, H * 0.33);
          g.fillText('medicin', x, H * 0.7);
        } else {
          const t = `×${tal(BÅND[niv[o]])}`;
          g.font = `800 ${Math.round(H * (t.length > 4 ? 0.4 : 0.48))}px system-ui, sans-serif`;
          g.fillText(t, x, H * 0.52);
        }
        o = slut + 1;
      }
    } else if (info?.tekst) {
      g.font = `700 ${Math.round(H * 0.42)}px system-ui, sans-serif`;
      g.fillText(info.tekst, W / 2, H * 0.52);
    }
    skiltTekstur.needsUpdate = true;
  }

  function sted(i, skala) {
    const k = i % kol;
    const j = (i - k) / kol;
    tV.set(-SIDE / 2 + (k + 0.5 + uro(i, 1) * 0.35) * c, SIDE / 2 - (j + 0.5 + uro(i, 2) * 0.35) * c, 0);
    tS.setScalar(skala);
    return tM.compose(tV, tQ, tS);
  }

  const farve = (i) => tF.set(PRIK_FARVE[Math.max(0, model.r[i])]);

  // Viser en ny model (eller den samme igen, fx efter et spring i turen): alt, der allerede er vokset, står fremme
  function vis(m) {
    model = m;
    if (lag !== m.lag) tegnBånd(m.lag);
    for (let i = 0; i < n; i++) {
      const levende = m.r[i] >= 0;
      prikker.setMatrixAt(i, sted(i, levende ? 1 : 0));
      if (levende) prikker.setColorAt(i, farve(i));
    }
    m.tag();
    vokser = [];
    pulsere = [];
    prikker.instanceMatrix.needsUpdate = true;
    prikker.instanceColor.needsUpdate = true;
    prikker.visible = true;
  }

  function tøm() {
    model = null;
    vokser = [];
    pulsere = [];
    puls = false;
    sætRinge([]);
    for (let i = 0; i < n; i++) prikker.setMatrixAt(i, tM.makeScale(0, 0, 0));
    prikker.instanceMatrix.needsUpdate = true;
    sætSkilt(null);
  }

  // Ringe om felter: [{ k, j, r }] (r: radius i felter)
  function sætRinge(liste) {
    ringListe = liste.slice(0, ringe.length);
    ringe.forEach((ring, x) => {
      const info = ringListe[x];
      ring.visible = Boolean(info);
      if (!info) return;
      ring.position.set(-SIDE / 2 + (info.k + 0.5) * c, SIDE / 2 - (info.j + 0.5) * c, 0.06);
      ring.scale.setScalar((info.r ?? 3) * c);
    });
  }

  function sætPuls(til) {
    puls = til && !ROLIG;
    pulsere = [];
    if (puls && model) for (let i = 0; i < n; i++) if (model.niveau[i] === 0 && model.r[i] > 0) pulsere.push(i);
    if (!puls && model) {
      for (let i = 0; i < n; i++) if (model.niveau[i] === 0 && model.r[i] > 0) prikker.setMatrixAt(i, sted(i, 1));
      prikker.instanceMatrix.needsUpdate = true;
    }
  }

  function opdater(dt) {
    tid += dt;
    if (!model) return;
    let ændret = false;
    // Nye bakterier vokser frem
    const nye = model.tag();
    if (nye.length) {
      for (const i of nye) {
        prikker.setColorAt(i, farve(i));
        vokser.push([i, 0]);
      }
      prikker.instanceColor.needsUpdate = true;
    }
    if (vokser.length) {
      for (const v of vokser) {
        v[1] = Math.min(VOKS_TID, v[1] + dt);
        const t = v[1] / VOKS_TID;
        prikker.setMatrixAt(v[0], sted(v[0], t * (2 - t)));
      }
      vokser = vokser.filter((v) => v[1] < VOKS_TID);
      ændret = true;
    }
    if (puls && pulsere.length) {
      const s = 1.15 + 0.3 * Math.sin(tid * 6);
      for (const i of pulsere) prikker.setMatrixAt(i, sted(i, s));
      ændret = true;
    }
    if (ændret) prikker.instanceMatrix.needsUpdate = true;
    // Ringene blinker blødt
    if (ringListe.length) ringMat.opacity = synlighed * (ROLIG ? 0.9 : 0.65 + 0.3 * Math.sin(tid * 4));
  }

  function sætSynlighed(a) {
    synlighed = a;
    gruppe.visible = a > 0.005;
    for (const m of mats) m.opacity = a;
  }

  // Det felt (k, j som kommatal), en stråle rammer på pladen, eller null udenfor
  function feltVed(stråle) {
    plade.updateWorldMatrix(true, false);
    plan.setFromNormalAndCoplanarPoint(tV.set(0, 0, 1).transformDirection(plade.matrixWorld), plade.getWorldPosition(new THREE.Vector3()));
    const p = stråle.intersectPlane(plan, new THREE.Vector3());
    if (!p) return null;
    plade.worldToLocal(p);
    const k = (p.x + SIDE / 2) / c - 0.5;
    const j = (SIDE / 2 - p.y) / c - 0.5;
    if (k < -1 || j < -1 || k > kol || j > kol) return null;
    return { k, j };
  }

  // Et punkt i verden midt på felt (k, j)
  function punkt(k, j, ud = new THREE.Vector3()) {
    ud.set(-SIDE / 2 + (k + 0.5) * c, SIDE / 2 - (j + 0.5) * c, 0);
    return plade.localToWorld(ud);
  }

  tegnBånd('normal');
  sætSynlighed(0);
  return {
    gruppe,
    radius: HØJDE / 2,
    kol,
    halvMål: () => [SIDE / 2 + 0.5, HØJDE / 2 + 0.4],
    sætSynlighed,
    opdater,
    vis,
    tøm,
    sætSkilt,
    sætRinge,
    sætPuls,
    feltVed,
    punkt,
    model: () => model,
    skilt: () => skiltNøgle,
  };
}
