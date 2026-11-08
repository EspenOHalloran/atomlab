// Et let atom til Molekyler ("Giv elektroner", det der hed Byttebørsen): en lille kerne, skallerne som ringe og
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

// ---------- Byg molekyler (M2, "Del elektroner"): hele molekylet i 3D (prøve A) ----------
// Kun de yderste elektroner vises. Et delt par er to prikker midt i bindingen med en svag blå sky, et frit par er to prikker
// på atomets frie side med en svag violet sky, og en elektron uden partner er én prik, der blinker. Kernerne er kugler i de
// farver, kemikere bruger, med symbolet på. Alle kerner er én InstancedMesh, alle pinde én og alle prikker én.
const MAX_KERNER = 12;
const MAX_PINDE = 80;
const MAX_PRIKKER = 160;
const MAX_SKYER = 110;
const MAX_NAVNE = 6;
const MAX_PILE = 24; // bindingernes pile (højst 11 bånd) og molekylernes pile (højst 6)
export const KERNE_R = { H: 0.5, C: 0.75, N: 0.72, O: 0.7, Cl: 0.95 }; // kuglernes radius (enheder)
const KERNE_FARVE = { // kemikernes farver (CPK), mørke nok til lyset i scenen
  H: new THREE.Color(0.6, 0.62, 0.68), C: new THREE.Color(0.26, 0.28, 0.32), N: new THREE.Color(0.12, 0.24, 0.85),
  O: new THREE.Color(0.78, 0.07, 0.05), Cl: new THREE.Color(0.16, 0.62, 0.13),
};
const PIND_FARVE = new THREE.Color(0.42, 0.52, 0.85);
const PIND_STRAKT = new THREE.Color(1.0, 0.32, 0.25);
const SKY_DELT = new THREE.Color(0.07, 0.17, 0.38);
const SKY_FRI = new THREE.Color(0.2, 0.09, 0.38);
const PRIK_LYS = 0.5; // prikkerne sidder tæt, så de gløder mindre end i Atom
const PRIK_AFSTAND = 0.17; // halv afstand mellem de to prikker i et par
const UDE = 0.5; // frie par og enlige elektroner står så langt uden for kuglen
// Ladningerne (M2b): svage glorier, blå for δ+ og røde for δ−, og et lille mærke ved atomet
const GLORIE_PLUS = new THREE.Color(0.08, 0.3, 1.0);
const GLORIE_MINUS = new THREE.Color(1.0, 0.16, 0.08);
const SKÆV = 0.32; // så stor en del af mellemrummet flytter parret mod det atom, der trækker hårdest (ved forskellen 1,24 eller mere)
const PIL_FARVE = new THREE.Color(1.0, 0.83, 0.23);
const SUM_FARVE = new THREE.Color(1.0, 0.55, 0.2);

const deltaTeksturer = {};
function deltaTekstur(tegn) {
  if (deltaTeksturer[tegn]) return deltaTeksturer[tegn];
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '800 66px system-ui, sans-serif';
  g.shadowColor = 'rgba(0,0,0,0.95)';
  g.shadowBlur = 12;
  g.fillStyle = tegn === '+' ? '#8fc0ff' : '#ff9a8a';
  g.fillText(tegn === '+' ? 'δ+' : 'δ−', 64, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  deltaTeksturer[tegn] = t;
  return t;
}

const symbolTeksturer = {};
function symbolTekstur(symbol) {
  if (symbolTeksturer[symbol]) return symbolTeksturer[symbol];
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `800 ${symbol.length > 1 ? 62 : 74}px system-ui, sans-serif`;
  g.fillStyle = symbol === 'H' ? '#1b2340' : '#ffffff';
  g.fillText(symbol, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  symbolTeksturer[symbol] = t;
  return t;
}

const tV1 = new THREE.Vector3();
const tV2 = new THREE.Vector3();
const tV3 = new THREE.Vector3();
const tSide = new THREE.Vector3();
const tSyn = new THREE.Vector3();
const tQ = new THREE.Quaternion();
const tS = new THREE.Vector3();
const tM = new THREE.Matrix4();
const tF = new THREE.Color();
const OP = new THREE.Vector3(0, 1, 0);
const tHøjre = new THREE.Vector3();
const tOp = new THREE.Vector3();

export class MolekyleTegning {
  constructor() {
    fælles();
    this.gruppe = new THREE.Group();
    // Kernerne
    this.kerner = new THREE.InstancedMesh(kerneGeo, new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.05 }), MAX_KERNER);
    this.kerner.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.kerner.frustumCulled = false;
    for (let i = 0; i < MAX_KERNER; i++) this.kerner.setColorAt(i, KERNE_FARVE.C);
    this.kerner.count = 0;
    // Pindene (bindingerne). Dobbelt- og tripelbindinger er to og tre pinde side om side.
    this.pindGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, LAV_KVALITET ? 6 : 10, 1);
    this.pinde = new THREE.InstancedMesh(this.pindGeo, new THREE.MeshStandardMaterial({ roughness: 0.5, transparent: true, opacity: 0.8 }), MAX_PINDE);
    this.pinde.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.pinde.frustumCulled = false;
    for (let i = 0; i < MAX_PINDE; i++) this.pinde.setColorAt(i, PIND_FARVE);
    this.pinde.count = 0;
    // Elektronerne som prikker (gløder som i Atom)
    this.prikker = new THREE.InstancedMesh(eGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX_PRIKKER);
    this.prikker.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.prikker.frustumCulled = false;
    for (let i = 0; i < MAX_PRIKKER; i++) this.prikker.setColorAt(i, ELEKTRON_FARVE);
    this.prikker.count = 0;
    // Skyerne om parrene (punkter med glød-tekstur)
    const skyGeo = new THREE.BufferGeometry();
    skyGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_SKYER * 3), 3));
    skyGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_SKYER * 3), 3));
    skyGeo.setDrawRange(0, 0);
    this.skyer = new THREE.Points(skyGeo, new THREE.PointsMaterial({
      size: 1.5, map: glødTekstur, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.skyer.frustumCulled = false;
    // Glorierne om atomer med ladning (δ+ blå, δ− rød) og mærkerne
    const glorieGeo = new THREE.BufferGeometry();
    glorieGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_KERNER * 3), 3));
    glorieGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_KERNER * 3), 3));
    glorieGeo.setDrawRange(0, 0);
    this.glorier = new THREE.Points(glorieGeo, new THREE.PointsMaterial({
      size: 4.4, map: glødTekstur, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.glorier.frustumCulled = false;
    this.deltaer = [];
    for (let i = 0; i < MAX_KERNER; i++) {
      const d = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
      d.visible = false;
      d.renderOrder = 6;
      this.deltaer.push(d);
    }
    // Pilene: hvilken vej bindingerne trækker (gule), og summen for hele molekylet (orange, ses gennem atomerne)
    this.pilGeo = new THREE.CylinderGeometry(1, 1, 1, LAV_KVALITET ? 6 : 10, 1);
    this.spidsGeo = new THREE.ConeGeometry(1, 1, LAV_KVALITET ? 8 : 14, 1);
    const pilMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92, depthTest: false });
    this.pile = new THREE.InstancedMesh(this.pilGeo, pilMat, MAX_PILE);
    this.spidser = new THREE.InstancedMesh(this.spidsGeo, pilMat, MAX_PILE);
    for (const m of [this.pile, this.spidser]) {
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.frustumCulled = false;
      m.renderOrder = 8;
      for (let i = 0; i < MAX_PILE; i++) m.setColorAt(i, PIL_FARVE);
      m.count = 0;
    }
    // Symbolerne på kernerne
    this.symboler = [];
    for (let i = 0; i < MAX_KERNER; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
      s.visible = false;
      s.renderOrder = 5;
      this.symboler.push(s);
    }
    // Ringen om det atom, bindingen vil gå til, og den stiplede streg
    this.ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: glødTekstur, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.ring.visible = false;
    const linjeGeo = new THREE.BufferGeometry();
    linjeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    this.linje = new THREE.Line(linjeGeo, new THREE.LineDashedMaterial({ color: 0x7ff7ff, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.9 }));
    this.linje.visible = false;
    this.linje.frustumCulled = false;
    // Navnene over de færdige molekyler
    this.navne = [];
    for (let i = 0; i < MAX_NAVNE; i++) {
      const lærred = document.createElement('canvas');
      lærred.width = 512;
      lærred.height = 96;
      const tekstur = new THREE.CanvasTexture(lærred);
      tekstur.colorSpace = THREE.SRGBColorSpace;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tekstur, transparent: true, depthTest: false }));
      s.renderOrder = 12;
      s.visible = false;
      s.scale.set(8, 1.5, 1);
      this.navne.push({ s, lærred, tekstur, tekst: '' });
    }
    this.gruppe.add(this.kerner, this.pinde, this.prikker, this.skyer, this.glorier, this.pile, this.spidser, this.ring, this.linje,
      ...this.symboler, ...this.deltaer, ...this.navne.map((n) => n.s));
  }

  // atomer: [{ symbol, p: Vector3 (enheder), lys (0-1), stor, q (ladning: plus = δ+, minus = δ−, 0 = ingen) }].
  // bånd: [{ a, b, orden, strakt, skæv (0-1 mod b, minus mod a: parret ligger tættest på det atom, der trækker hårdest) }].
  // retninger: [{ atom, v: [x, y, z], slags: 'frit' | 'enlig' }]. mål: { atom, ok } eller null. linje: { fra, til, ok } eller null.
  // navne: [{ tekst, p }]. pile: [{ fra, til (Vector3), tyk, sum }]. kamera: til prikkernes side og symbolerne. tid: til blinket.
  tegn({ atomer, bånd, retninger, mål = null, linje = null, navne = [], pile = [], kamera, tid = 0 }) {
    // Kernerne og symbolerne
    const n = Math.min(atomer.length, MAX_KERNER);
    for (let i = 0; i < MAX_KERNER; i++) this.symboler[i].visible = i < n;
    for (let i = 0; i < n; i++) {
      const a = atomer[i];
      const r = KERNE_R[a.symbol] * (a.stor ? 1.12 : 1);
      tM.compose(a.p, tQ.identity(), tS.setScalar(r));
      this.kerner.setMatrixAt(i, tM);
      this.kerner.setColorAt(i, tF.copy(KERNE_FARVE[a.symbol]).multiplyScalar(1 + (a.lys ?? 0) * 1.6));
      const s = this.symboler[i];
      if (s.material.map !== symbolTekstur(a.symbol)) {
        s.material.map = symbolTekstur(a.symbol);
        s.material.needsUpdate = true;
      }
      tSyn.copy(kamera.position).sub(a.p).normalize();
      s.position.copy(a.p).addScaledVector(tSyn, r * 1.02);
      s.scale.setScalar(r * 1.5);
    }
    this.kerner.count = n;
    this.kerner.instanceMatrix.needsUpdate = true;
    this.kerner.instanceColor.needsUpdate = true;

    // Ladningerne: en svag glorie og et mærke (δ+ eller δ−) oppe til højre for atomet på skærmen
    const gPos = this.glorier.geometry.attributes.position;
    const gFarve = this.glorier.geometry.attributes.color;
    tHøjre.setFromMatrixColumn(kamera.matrixWorld, 0).normalize();
    tOp.setFromMatrixColumn(kamera.matrixWorld, 1).normalize();
    let gi = 0;
    for (let i = 0; i < MAX_KERNER; i++) {
      const a = atomer[i];
      const d = this.deltaer[i];
      const q = i < n ? a.q ?? 0 : 0;
      d.visible = q !== 0;
      if (!q) continue;
      const styrke = 0.75 + 0.6 * Math.min(1, Math.abs(q) / 2.5);
      const f = q > 0 ? GLORIE_PLUS : GLORIE_MINUS;
      gPos.setXYZ(gi, a.p.x, a.p.y, a.p.z);
      gFarve.setXYZ(gi, f.r * styrke, f.g * styrke, f.b * styrke);
      gi++;
      const t = deltaTekstur(q > 0 ? '+' : '-');
      if (d.material.map !== t) {
        d.material.map = t;
        d.material.needsUpdate = true;
      }
      const r = KERNE_R[a.symbol];
      d.position.copy(a.p).addScaledVector(tHøjre, r * 0.95 + 0.3).addScaledVector(tOp, r * 0.95 + 0.2);
      d.scale.setScalar(1.05);
    }
    this.glorier.geometry.setDrawRange(0, gi);
    gPos.needsUpdate = true;
    gFarve.needsUpdate = true;

    let pi = 0; // pinde
    let ei = 0; // prikker
    let si = 0; // skyer
    const skyPos = this.skyer.geometry.attributes.position;
    const skyFarve = this.skyer.geometry.attributes.color;
    const prik = (p, lys = 1) => {
      if (ei >= MAX_PRIKKER) return;
      tM.makeTranslation(p.x, p.y, p.z);
      this.prikker.setMatrixAt(ei, tM);
      this.prikker.setColorAt(ei, tF.copy(ELEKTRON_FARVE).multiplyScalar(lys * PRIK_LYS));
      ei++;
    };
    const sky = (p, farve) => {
      if (si >= MAX_SKYER) return;
      skyPos.setXYZ(si, p.x, p.y, p.z);
      skyFarve.setXYZ(si, farve.r, farve.g, farve.b);
      si++;
    };
    // En retning på tværs af v, som vender mod kameraet (så prikkerne i et par ikke står bag hinanden)
    const tværs = (v, midt, ud) => {
      tSyn.copy(kamera.position).sub(midt).normalize();
      ud.crossVectors(v, tSyn);
      if (ud.lengthSq() < 1e-6) ud.crossVectors(v, OP);
      if (ud.lengthSq() < 1e-6) ud.set(1, 0, 0);
      return ud.normalize();
    };

    // Bindingerne: pinde og de delte par
    for (const b of bånd) {
      const pa = atomer[b.a].p;
      const pb = atomer[b.b].p;
      const ra = KERNE_R[atomer[b.a].symbol];
      const rb = KERNE_R[atomer[b.b].symbol];
      tV1.subVectors(pb, pa);
      const l = tV1.length();
      if (l < 1e-4) continue;
      tV1.divideScalar(l);
      tV2.addVectors(pa, pb).multiplyScalar(0.5);
      tværs(tV1, tV2, tSide);
      tQ.setFromUnitVectors(OP, tV1);
      for (let k = 0; k < b.orden && pi < MAX_PINDE; k++) {
        const off = (k - (b.orden - 1) / 2) * 0.3;
        tV3.copy(tV2).addScaledVector(tSide, off);
        tM.compose(tV3, tQ, tS.set(1, l, 1));
        this.pinde.setMatrixAt(pi, tM);
        this.pinde.setColorAt(pi, b.strakt ? PIND_STRAKT : PIND_FARVE);
        pi++;
      }
      // Parrene midt i mellemrummet mellem kuglerne (skubbet mod det atom, der trækker hårdest)
      const mellem = Math.max(0, l - ra - rb);
      const t = ra + mellem / 2 + (b.skæv ?? 0) * SKÆV * mellem;
      for (let k = 0; k < b.orden; k++) {
        tV3.copy(pa).addScaledVector(tV1, t);
        if (b.orden === 1) {
          sky(tV3, SKY_DELT);
          prik(tS.copy(tV3).addScaledVector(tSide, PRIK_AFSTAND));
          prik(tS.copy(tV3).addScaledVector(tSide, -PRIK_AFSTAND));
        } else {
          tV3.addScaledVector(tSide, (k - (b.orden - 1) / 2) * 0.5);
          sky(tV3, SKY_DELT);
          prik(tS.copy(tV3).addScaledVector(tV1, PRIK_AFSTAND));
          prik(tS.copy(tV3).addScaledVector(tV1, -PRIK_AFSTAND));
        }
      }
    }
    // Frie par og elektroner uden partner
    for (const x of retninger) {
      const a = atomer[x.atom];
      if (!a) continue;
      tV1.set(x.v[0], x.v[1], x.v[2]);
      tV3.copy(a.p).addScaledVector(tV1, KERNE_R[a.symbol] + UDE);
      if (x.slags === 'frit') {
        tværs(tV1, tV3, tSide);
        sky(tV3, SKY_FRI);
        prik(tS.copy(tV3).addScaledVector(tSide, PRIK_AFSTAND), 0.8);
        prik(tS.copy(tV3).addScaledVector(tSide, -PRIK_AFSTAND), 0.8);
      } else {
        // Blinker svagt (står stille med "reducer bevægelse")
        prik(tV3, ROLIG ? 1 : 0.45 + 0.75 * (0.5 + 0.5 * Math.sin(tid * 4.5 + x.atom * 1.7)));
      }
    }
    this.pinde.count = pi;
    this.pinde.instanceMatrix.needsUpdate = true;
    this.pinde.instanceColor.needsUpdate = true;
    this.prikker.count = ei;
    this.prikker.instanceMatrix.needsUpdate = true;
    this.prikker.instanceColor.needsUpdate = true;
    this.skyer.geometry.setDrawRange(0, si);
    skyPos.needsUpdate = true;
    skyFarve.needsUpdate = true;

    // Pilene: et skaft og en spids (spidsen peger mod det atom, der trækker hårdest)
    let ai = 0;
    for (const pil of pile) {
      if (ai >= MAX_PILE) break;
      tV1.subVectors(pil.til, pil.fra);
      const l = tV1.length();
      if (l < 1e-3) continue;
      tV1.divideScalar(l);
      const tyk = pil.tyk ?? 0.05;
      const spids = Math.min(l * 0.45, tyk * 7);
      tQ.setFromUnitVectors(OP, tV1);
      tV2.copy(pil.fra).addScaledVector(tV1, (l - spids) / 2);
      tM.compose(tV2, tQ, tS.set(tyk, l - spids, tyk));
      this.pile.setMatrixAt(ai, tM);
      tV2.copy(pil.til).addScaledVector(tV1, -spids / 2);
      tM.compose(tV2, tQ, tS.set(tyk * 3.2, spids, tyk * 3.2));
      this.spidser.setMatrixAt(ai, tM);
      const farve = pil.sum ? SUM_FARVE : PIL_FARVE;
      this.pile.setColorAt(ai, farve);
      this.spidser.setColorAt(ai, farve);
      ai++;
    }
    for (const m of [this.pile, this.spidser]) {
      m.count = ai;
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }

    // Ringen og den stiplede streg, mens man trækker
    this.ring.visible = Boolean(mål && atomer[mål.atom]);
    if (this.ring.visible) {
      this.ring.position.copy(atomer[mål.atom].p);
      this.ring.scale.setScalar(KERNE_R[atomer[mål.atom].symbol] * 5);
      this.ring.material.color.setRGB(...(mål.ok ? [0.4, 1.6, 2.0] : [2.2, 0.35, 0.3]));
    }
    this.linje.visible = Boolean(linje);
    if (linje) {
      const p = this.linje.geometry.attributes.position;
      p.setXYZ(0, linje.fra.x, linje.fra.y, linje.fra.z);
      p.setXYZ(1, linje.til.x, linje.til.y, linje.til.z);
      p.needsUpdate = true;
      this.linje.computeLineDistances();
      this.linje.material.color.set(linje.ok ? 0x7ff7ff : 0xff6b5b);
    }

    // Navnene
    for (let i = 0; i < MAX_NAVNE; i++) {
      const nv = this.navne[i];
      const x = navne[i];
      nv.s.visible = Boolean(x);
      if (!x) continue;
      if (nv.tekst !== x.tekst) {
        nv.tekst = x.tekst;
        const g = nv.lærred.getContext('2d');
        g.clearRect(0, 0, 512, 96);
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '700 46px system-ui, sans-serif';
        g.shadowColor = 'rgba(0,0,0,0.95)';
        g.shadowBlur = 10;
        g.fillStyle = '#ffe9a8';
        g.fillText(x.tekst, 256, 50);
        nv.tekstur.needsUpdate = true;
      }
      nv.s.position.copy(x.p);
    }
  }

  fjern() {
    this.pindGeo.dispose();
    this.pilGeo.dispose();
    this.spidsGeo.dispose();
    for (const m of [this.kerner.material, this.pinde.material, this.prikker.material, this.skyer.material, this.glorier.material, this.pile.material, this.ring.material, this.linje.material]) m.dispose();
    for (const d of this.deltaer) d.material.dispose();
    this.skyer.geometry.dispose();
    this.glorier.geometry.dispose();
    this.linje.geometry.dispose();
    for (const s of this.symboler) s.material.dispose();
    for (const n of this.navne) { n.tekstur.dispose(); n.s.material.dispose(); }
    this.kerner.dispose();
    this.pinde.dispose();
    this.prikker.dispose();
    this.pile.dispose();
    this.spidser.dispose();
    this.gruppe.removeFromParent();
  }
}
