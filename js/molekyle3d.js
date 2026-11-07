// Et let atom til Molekyler (Byttebørsen nu, Byg molekyler senere): en lille kerne, skallerne som ringe og
// elektronerne som prikker på ringene. Den yderste skal er tydelig, de inderste er svage. Kernen ændrer sig ikke
// (det er kemi, ikke kernefysik), så den er en enkel kugle med glød, ikke Atom-klassens protoner og neutroner.
// Ringene ligger fladt mod kameraet (x-y-planen), så man kan trække elektroner med fingeren i samme plan.
// Farverne er de samme som i Atom (protonens rød og elektronernes blå glød).

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG, lavPrikTekstur } from './scene3d.js';

const MAX_ELEKTRONER = 24; // højst så mange prikker pr. atom (calcium har 20)
const ELEKTRON_FARVE = new THREE.Color(1.3, 3.4, 4.2); // som i Atom: over 1, så de gløder
const INDRE = 0.22; // de inderste skallers elektroner er svagere
const hjælpM = new THREE.Matrix4();
const hjælpV = new THREE.Vector3();
const hjælpF = new THREE.Color();

// Fælles geometri og tekstur til alle atomer (bygges én gang)
let eGeo = null;
let kerneGeo = null;
let glødTekstur = null;
function fælles() {
  if (eGeo) return;
  eGeo = new THREE.SphereGeometry(0.17, LAV_KVALITET ? 10 : 14, LAV_KVALITET ? 8 : 10);
  kerneGeo = new THREE.SphereGeometry(1, LAV_KVALITET ? 16 : 24, LAV_KVALITET ? 12 : 18);
  glødTekstur = lavPrikTekstur(true);
}

// Et lille skilt med tekst (navn og ladning) under atomet
function tegnSkilt(c, linjer) {
  const g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,0.9)';
  g.shadowBlur = 8;
  linjer.forEach(([tekst, farve, størrelse], i) => {
    g.font = `700 ${størrelse}px system-ui, sans-serif`;
    g.fillStyle = farve;
    g.fillText(tekst, c.width / 2, 40 + i * 52);
  });
}

export class MolekyleAtom {
  // symbol: fx 'Na'. skaller: elektronerne i hver skal (fx [2, 8, 1]). radius: den yderste rings radius (enheder).
  // farve: kernens farve (CSS-farve eller tal).
  constructor({ symbol, skaller, radius, farve = 0xd81414 }) {
    fælles();
    this.symbol = symbol;
    this.gruppe = new THREE.Group();
    this.tid = 0;
    this.spin = ROLIG ? 0 : 0.35; // elektronerne glider langsomt rundt på ringene
    this.ladning = 0;

    // Kernen: en lille rød kugle med et skær
    this.kerneMat = new THREE.MeshStandardMaterial({ color: farve, roughness: 0.4, emissive: 0x4a0303 });
    this.kerne = new THREE.Mesh(kerneGeo, this.kerneMat);
    this.kerne.scale.setScalar(0.42);
    this.skær = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glødTekstur, color: new THREE.Color(1.6, 0.5, 0.3), transparent: true, opacity: 0.55,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.skær.scale.setScalar(2.2);

    // Ringene (én pr. skal). Den yderste er tydeligst.
    this.ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.25, 0.65, 1.2), transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.indreRingMat = this.ringMat.clone();
    this.indreRingMat.opacity = 0.12;
    this.ringe = []; // { mesh, radius, mål, antal, synlig }
    this.ringGruppe = new THREE.Group();

    // Elektronerne som prikker (én InstancedMesh, de inderste svagere med instanceColor)
    this.eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.eMesh = new THREE.InstancedMesh(eGeo, this.eMat, MAX_ELEKTRONER);
    this.eMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.eMesh.frustumCulled = false;
    for (let i = 0; i < MAX_ELEKTRONER; i++) this.eMesh.setColorAt(i, ELEKTRON_FARVE);
    this.eMesh.count = 0;

    // Skiltet under atomet
    this.skiltLærred = document.createElement('canvas');
    this.skiltLærred.width = 256;
    this.skiltLærred.height = 128;
    this.skiltTekstur = new THREE.CanvasTexture(this.skiltLærred);
    this.skiltTekstur.colorSpace = THREE.SRGBColorSpace;
    this.skilt = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.skiltTekstur, transparent: true, depthTest: false }));
    this.skilt.renderOrder = 10;
    this.skilt.scale.set(6.4, 3.2, 1);
    this.skiltTekst = '';

    this.gruppe.add(this.kerne, this.skær, this.ringGruppe, this.eMesh, this.skilt);
    this.sætSkaller(skaller, radius, true);
  }

  // Skallerne og den yderste rings radius. Ringene glider til den nye størrelse (straks = med det samme).
  // De inderste ringe har radius i forhold til den yderste (skal nr. k af n: k/n af radius).
  sætSkaller(skaller, radius, straks = false) {
    this.skaller = [...skaller];
    this.radius = radius;
    const n = skaller.length;
    for (let k = 0; k < Math.max(n, this.ringe.length); k++) {
      let ring = this.ringe[k];
      if (!ring && k < n) {
        const geo = new THREE.TorusGeometry(1, 0.035, 6, LAV_KVALITET ? 72 : 128);
        ring = { mesh: new THREE.Mesh(geo, this.ringMat), radius: 0, mål: 0, synlig: 0 };
        this.ringe.push(ring);
        this.ringGruppe.add(ring.mesh);
      }
      if (!ring) continue;
      ring.mål = k < n ? radius * (k + 1) / n : ring.mål; // en skal, der forsvinder, beholder sin størrelse og toner ud
      ring.findes = k < n;
      ring.antal = k < n ? skaller[k] : 0;
      ring.mesh.material = k === n - 1 ? this.ringMat : this.indreRingMat;
      if (straks || ring.radius === 0) ring.radius = ring.mål;
      if (straks) ring.synlig = ring.findes ? 1 : 0;
    }
    this.skiltStørrelse();
    this.tegnElektroner();
  }

  // Ladningen står på skiltet (Na, Na⁺, Cl⁻)
  sætLadning(q) {
    this.ladning = q;
    this.skiltStørrelse();
  }

  sætSkilt(linjer) {
    const nøgle = JSON.stringify(linjer);
    if (nøgle === this.skiltTekst) return;
    this.skiltTekst = nøgle;
    tegnSkilt(this.skiltLærred, linjer);
    this.skiltTekstur.needsUpdate = true;
  }

  skiltStørrelse() {
    const tegn = this.ladning === 0 ? '' : `${Math.abs(this.ladning) > 1 ? Math.abs(this.ladning) : ''}${this.ladning > 0 ? '⁺' : '⁻'}`
      .replace('2', '²').replace('3', '³');
    const yderst = this.skaller[this.skaller.length - 1];
    const farve = this.ladning > 0 ? '#ffb38a' : this.ladning < 0 ? '#9fd8ff' : '#ffffff';
    this.sætSkilt([[`${this.symbol}${tegn}`, farve, 40], [`${yderst} yderst`, '#c8d4f0', 26]]);
  }

  // Den yderste rings radius lige nu (mens den glider)
  ydersteRadius() {
    const n = this.skaller.length;
    return this.ringe[n - 1]?.radius ?? this.radius;
  }

  // Hvor elektron nr. j i skal nr. k står (lokalt i atomet)
  elektronPos(k, j, ud = hjælpV) {
    const ring = this.ringe[k];
    const antal = Math.max(1, ring.antal);
    const v = this.tid * this.spin * (k % 2 ? -1 : 1) / (k + 1) + j * Math.PI * 2 / antal + k * 0.4;
    return ud.set(Math.cos(v) * ring.radius, Math.sin(v) * ring.radius, 0);
  }

  // Den yderste elektron (den sidste i den yderste skal) i verdens-koordinater
  ydersteElektron(ud = new THREE.Vector3()) {
    const k = this.skaller.length - 1;
    this.elektronPos(k, this.ringe[k].antal - 1, ud);
    return this.gruppe.localToWorld(ud);
  }

  tegnElektroner() {
    let i = 0;
    const n = this.skaller.length;
    for (let k = 0; k < this.ringe.length; k++) {
      const ring = this.ringe[k];
      const lys = (k === n - 1 ? 1 : INDRE) * ring.synlig;
      for (let j = 0; j < ring.antal && i < MAX_ELEKTRONER; j++) {
        this.elektronPos(k, j);
        hjælpM.makeTranslation(hjælpV.x, hjælpV.y, hjælpV.z);
        // Den skjulte elektron (den, man trækker i) står ikke på ringen
        if (k === n - 1 && j === ring.antal - 1 && this.skjulYderste) hjælpM.makeScale(0, 0, 0);
        this.eMesh.setMatrixAt(i, hjælpM);
        this.eMesh.setColorAt(i, hjælpF.copy(ELEKTRON_FARVE).multiplyScalar(Math.max(0.02, lys)));
        i++;
      }
    }
    this.eMesh.count = i;
    this.eMesh.instanceMatrix.needsUpdate = true;
    if (this.eMesh.instanceColor) this.eMesh.instanceColor.needsUpdate = true;
  }

  opdater(dt) {
    this.tid += dt;
    const glid = Math.min(1, dt * 3);
    for (const ring of this.ringe) {
      ring.radius += (ring.mål - ring.radius) * (ROLIG ? 1 : glid);
      ring.synlig += ((ring.findes ? 1 : 0) - ring.synlig) * (ROLIG ? 1 : glid);
      ring.mesh.scale.setScalar(Math.max(0.001, ring.radius));
      ring.mesh.visible = ring.synlig > 0.02;
    }
    this.skilt.position.set(0, -this.ydersteRadius() - 2.2, 0);
    this.tegnElektroner();
  }

  fjern() {
    for (const ring of this.ringe) ring.mesh.geometry.dispose();
    for (const m of [this.kerneMat, this.ringMat, this.indreRingMat, this.eMat, this.skær.material, this.skilt.material]) m.dispose();
    this.skiltTekstur.dispose();
    this.eMesh.dispose();
    this.gruppe.removeFromParent();
  }
}
