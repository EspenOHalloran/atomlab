// DNA-stigen i 3D (Liv, fanen Opskriften). To udgaver, der toner over i hinanden, når man zoomer:
// - Tæt på: hvert atom som en kugle i kemikernes farver (som i "Del elektroner"), bindingerne som pinde og
//   hydrogenbindingerne mellem baserne som gule streger. Atomernes pladser er målt (1BNA, js/data/liv/dna-atomer.js).
// - Længere væk: rygraden som to bånd og trinene som pinde i basernes farver (A grøn, T rød, G gul og C blå).
// Alle kugler er én InstancedMesh, alle pinde én, stregerne én og trinene én. Akserne: stigen står lodret (y).

import * as THREE from 'three';
import { LAV_KVALITET } from '../scene3d.js';
import { KERNE_FARVE } from '../molekyle3d.js';
import { lavStige } from '../data/liv/stige.js';

export const S = 0.5; // enheder pr. Å
export const MAKS_ATOM_TRIN = LAV_KVALITET ? 12 : 24; // så mange basepar vises med atomer (på tabletten halvdelen)
const MAKS_TRIN = 400; // så mange basepar kan stigen have længere væk fra
const MAKS_ATOMER = MAKS_ATOM_TRIN * 64;
const MAKS_PINDE = MAKS_ATOM_TRIN * 70;
const STREG_DELE = 4; // hver hydrogenbinding er en stiplet streg med så mange stykker
const R_ATOM = { H: 0.27, C: 0.4, N: 0.38, O: 0.37, P: 0.5 }; // kuglernes radius i Å
const R_PIND = 0.11;
const R_STREG = 0.06;
const R_BÅND = 1.1; // rygradens bånd (Å)
const R_TRIN = 0.85;
export const BASE_FARVE = { A: '#3ddc84', T: '#ff5a5f', G: '#ffc93c', C: '#4ea8ff' };
const PIND_FARVE = new THREE.Color(0.5, 0.56, 0.72);
const STREG_FARVE = new THREE.Color(2.2, 1.9, 0.5); // over 1, så de gløder lidt
const RYG_FARVE = [new THREE.Color(0.2, 0.27, 0.5), new THREE.Color(0.3, 0.22, 0.48)]; // mørke, så gløden ikke gør dem hvide
const TRIN_LYS = 0.62; // basernes farver dæmpes lidt af samme grund
const H_LYS = 0.8; // de mange små H-kugler gløder ellers som en hvid tåge

const tM = new THREE.Matrix4();
const tQ = new THREE.Quaternion();
const tS = new THREE.Vector3();
const tA = new THREE.Vector3();
const tB = new THREE.Vector3();
const tD = new THREE.Vector3();
const OP = new THREE.Vector3(0, 1, 0);
const tF = new THREE.Color();

// Sætter en cylinder (højde 1 langs y) mellem to punkter
function pindMellem(mesh, i, a, b, r) {
  tD.subVectors(b, a);
  const l = tD.length();
  tQ.setFromUnitVectors(OP, tD.divideScalar(l || 1));
  tM.compose(tA.addVectors(a, b).multiplyScalar(0.5), tQ, tS.set(r, l, r));
  mesh.setMatrixAt(i, tM);
}

// Fra stigens Å-koordinater (z er aksen) til enheder i gruppen (y er aksen)
const iVerden = (p, ud = new THREE.Vector3()) => ud.set(p[0] * S, p[2] * S, -p[1] * S);

function instanser(geo, mat, antal) {
  const m = new THREE.InstancedMesh(geo, mat, antal);
  m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  m.frustumCulled = false;
  m.count = 0;
  return m;
}

export class DnaStige {
  constructor() {
    this.gruppe = new THREE.Group();
    this.visH = true;
    this.blanding = 0; // 0 = atomerne, 1 = stigen længere væk fra
    // Tæt på
    const kugle = new THREE.SphereGeometry(1, LAV_KVALITET ? 8 : 14, LAV_KVALITET ? 6 : 10);
    const cylinder = new THREE.CylinderGeometry(1, 1, 1, LAV_KVALITET ? 5 : 8, 1);
    this.atomMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.05, transparent: true });
    this.pindMat = new THREE.MeshStandardMaterial({ color: PIND_FARVE, roughness: 0.5, transparent: true });
    this.stregMat = new THREE.MeshBasicMaterial({ color: STREG_FARVE, transparent: true });
    this.kugler = instanser(kugle, this.atomMat, MAKS_ATOMER);
    this.pinde = instanser(cylinder, this.pindMat, MAKS_PINDE);
    this.streger = instanser(cylinder, this.stregMat, MAKS_ATOM_TRIN * 3 * STREG_DELE);
    for (let i = 0; i < MAKS_ATOMER; i++) this.kugler.setColorAt(i, KERNE_FARVE.C);
    this.nær = new THREE.Group();
    this.nær.add(this.kugler, this.pinde, this.streger);
    // Længere væk
    this.trinMat = new THREE.MeshStandardMaterial({ roughness: 0.45, transparent: true });
    this.trinene = instanser(new THREE.CylinderGeometry(1, 1, 1, LAV_KVALITET ? 6 : 10, 1), this.trinMat, MAKS_TRIN * 2);
    for (let i = 0; i < MAKS_TRIN * 2; i++) this.trinene.setColorAt(i, PIND_FARVE);
    this.båndMat = RYG_FARVE.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.05, transparent: true }));
    this.bånd = [null, null];
    this.fjern = new THREE.Group();
    this.fjern.add(this.trinene);
    this.gruppe.add(this.nær, this.fjern);
    this.sekvens = '';
  }

  // sekvens: streng I (fx 'ATGC…'). Atomerne vises for de midterste MAKS_ATOM_TRIN trin, stigen for dem alle.
  sætSekvens(sekvens) {
    this.sekvens = sekvens.slice(0, MAKS_TRIN);
    this.stige = lavStige(this.sekvens);
    const n = this.sekvens.length;
    const fra = Math.max(0, Math.floor((n - MAKS_ATOM_TRIN) / 2));
    this.atomTrin = [fra, Math.min(n, fra + MAKS_ATOM_TRIN)];
    this.byggAtomer();
    this.byggStige();
  }

  sætVisH(til) {
    this.visH = til;
    this.byggAtomer();
  }

  byggAtomer() {
    const { atomer, bånd, hbånd } = this.stige;
    const [fra, til] = this.atomTrin;
    const med = (a) => a.trin >= fra && a.trin < til && (this.visH || a.symbol !== 'H');
    const pos = atomer.map((a) => iVerden(a.p));
    let i = 0;
    atomer.forEach((a, k) => {
      if (!med(a)) return;
      tM.compose(pos[k], tQ.identity(), tS.setScalar(R_ATOM[a.symbol] * S));
      this.kugler.setMatrixAt(i, tM);
      this.kugler.setColorAt(i, a.symbol === 'H' ? tF.copy(KERNE_FARVE.H).multiplyScalar(H_LYS) : KERNE_FARVE[a.symbol]);
      i++;
    });
    this.kugler.count = i;
    i = 0;
    for (const [a, b] of bånd) {
      if (!med(atomer[a]) || !med(atomer[b])) continue;
      pindMellem(this.pinde, i++, pos[a], pos[b], R_PIND * S);
    }
    this.pinde.count = i;
    // Hydrogenbindingerne: stiplet fra H'et til atomet i den anden base (vises også uden H, så fra donoratomet)
    i = 0;
    for (const [h, m, k] of hbånd) {
      if (k < fra || k >= til) continue;
      let start = pos[h];
      if (!this.visH) {
        const donor = bånd.find(([x, y]) => x === h || y === h);
        start = pos[donor[0] === h ? donor[1] : donor[0]];
      }
      const slut = pos[m];
      for (let d = 0; d < STREG_DELE; d++) {
        const t0 = (d + 0.2) / STREG_DELE;
        const t1 = (d + 0.8) / STREG_DELE;
        pindMellem(this.streger, i++, tB.lerpVectors(start, slut, t0).clone(), tB.lerpVectors(start, slut, t1).clone(), R_STREG * S);
      }
    }
    this.streger.count = i;
    for (const m of [this.kugler, this.pinde, this.streger]) {
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
  }

  byggStige() {
    const { trin, ryg } = this.stige;
    let i = 0;
    const midt = new THREE.Vector3();
    const a = new THREE.Vector3();
    for (const t of trin) {
      iVerden(t.midt, midt);
      pindMellem(this.trinene, i, iVerden(t.sukkerI, a), midt, R_TRIN * S);
      this.trinene.setColorAt(i++, tF.set(BASE_FARVE[t.base]).multiplyScalar(TRIN_LYS));
      pindMellem(this.trinene, i, midt, iVerden(t.sukkerII, a), R_TRIN * S);
      this.trinene.setColorAt(i++, tF.set(BASE_FARVE[t.partner]).multiplyScalar(TRIN_LYS));
    }
    this.trinene.count = i;
    this.trinene.instanceMatrix.needsUpdate = true;
    this.trinene.instanceColor.needsUpdate = true;
    // Rygraden: et rør gennem fosfaterne og sukkerringene (skiftevis) for hver streng
    for (const s of [0, 1]) {
      if (this.bånd[s]) {
        this.fjern.remove(this.bånd[s]);
        this.bånd[s].geometry.dispose();
      }
      const kurve = new THREE.CatmullRomCurve3(ryg[s].map((p) => iVerden(p)));
      const geo = new THREE.TubeGeometry(kurve, ryg[s].length * (LAV_KVALITET ? 3 : 5), R_BÅND * S, LAV_KVALITET ? 6 : 10, false);
      this.bånd[s] = new THREE.Mesh(geo, this.båndMat[s]);
      this.fjern.add(this.bånd[s]);
    }
  }

  // Stigens halve højde i enheder (til kameraet)
  halvHøjde() {
    return ((this.sekvens.length - 1) * 3.38 * S) / 2 + 10 * S;
  }

  // blanding: 0 = kun atomerne, 1 = kun stigen. Imellem toner de over i hinanden.
  sætBlanding(b) {
    this.blanding = THREE.MathUtils.clamp(b, 0, 1);
    const nær = 1 - this.blanding;
    const fjern = this.blanding;
    this.nær.visible = nær > 0.01;
    this.fjern.visible = fjern > 0.01;
    for (const m of [this.atomMat, this.pindMat, this.stregMat]) {
      m.opacity = nær;
      m.transparent = nær < 0.99;
      m.depthWrite = nær > 0.5;
    }
    for (const m of [this.trinMat, ...this.båndMat]) {
      m.opacity = fjern;
      m.transparent = fjern < 0.99;
      m.depthWrite = fjern > 0.5;
    }
  }
}
