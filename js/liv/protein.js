// Liv L2, fra opskrift til protein, i 3D. Alt er tegnet forenklet (se "Ærligt talt" i index.html):
// - 'aflæs': RNA-polymerasen (en violet sky) åbner et stykke af DNA'et og bygger en RNA-kopi af genet.
//   Polymerasen står stille i midten, og DNA'et glider igennem den (det er det samme som at den kører hen ad det).
//   Den grå del af DNA'et er uden for den del af genet, der bliver til protein.
// - 'ud': DNA'et og polymerasen toner ud, RNA'et toner ind mellem ribosomets to dele.
// - 'oversæt': Ribosomet læser tre bogstaver ad gangen. En budbringer (tRNA) med den rigtige aminosyre kommer ind på
//   pladsen til højre (A), kæden flytter over på den, og RNA'et rykker et ord til venstre. Den tomme budbringer
//   flyver væk. Kæden vokser ud af toppen af ribosomet.
// - 'fold': Ved stop slipper ribosomet kæden, og den folder sig. Aminosyrerne, der skyr vand, gemmer sig inde i midten.
// - 'ret': "Skift et bogstav": begyndelsen af RNA'et ligger stille, og kæden står over den, én perle pr. ord.
// fart (sættes af js/liv-protein.js fra tidsknappen): 0 = pause, 1 = normal, 4 = hurtigere.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG } from '../scene3d.js';
import { hindeMateriale } from './celle.js';
import { BASE_FARVE } from './stige.js';
import { U_FARVE } from './kodehjul.js';
import { KODE, STOP, AMINOSYRER, SLAGS, tilRNA, kodoner } from '../data/liv/kode.js';

const D = 0.9; // afstand mellem to bogstaver
const R_RYG = 0.24; // rygradens kugler
const R_BASE = 0.17;
const L_BASE = 0.8;
const R_PERLE = 0.42; // aminosyrerne
const VINDUE = 20; // så mange bogstaver til hver side tegnes
const MAKS_DNA = 2 * (2 * VINDUE + 2);
const MAKS_RNA = 2 * VINDUE + 50;
const MAKS_AA = 160;
const HYBRID = 8; // så mange bogstaver af RNA'et sidder på DNA'et inde i polymerasen
const PR_OMGANG = 10.5;
const LYS = 0.72; // basernes farver dæmpes, så gløden ikke gør dem hvide
const GRÅ = new THREE.Color(0.32, 0.35, 0.45); // DNA uden for den kodende del
const RYG_DNA = new THREE.Color(0.25, 0.3, 0.55);
const RYG_RNA = new THREE.Color(0.55, 0.3, 0.5);
const TRNA_FARVE = new THREE.Color(0.75, 0.68, 0.95);
const A_TOP = new THREE.Vector3(1.35, 3.6, 0); // aminosyren på budbringeren i A-pladsen
const P_TOP = new THREE.Vector3(-1.35, 3.6, 0);
const STI_START = [[-1.3, 4.6, 0.15], [-1.0, 5.6, 0.3], [-0.7, 6.6, 0.4]]; // tunnelen op gennem ribosomet
const KÆDE_MIDT = new THREE.Vector3(-3, 11.5, 0);
const FOLD_MIDT = new THREE.Vector3(0, 7.5, 0);
const FOLD_R = 3.6;

const FARVE = {};
for (const [b, f] of Object.entries({ ...BASE_FARVE, U: U_FARVE })) FARVE[b] = new THREE.Color(f).multiplyScalar(LYS);
const AA_FARVE = {};
for (const [aa, a] of Object.entries(AMINOSYRER)) AA_FARVE[aa] = new THREE.Color(SLAGS[a.slags].farve).multiplyScalar(0.8);
const PARTNER_RNA = { A: 'U', U: 'A', G: 'C', C: 'G' };

const glat = (t) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const tM = new THREE.Matrix4();
const tQ = new THREE.Quaternion();
const tS = new THREE.Vector3();
const tA = new THREE.Vector3();
const tB = new THREE.Vector3();
const tD = new THREE.Vector3();
const OP = new THREE.Vector3(0, 1, 0);

function instanser(geo, mat, antal) {
  const m = new THREE.InstancedMesh(geo, mat, antal);
  m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  m.count = 0;
  m.frustumCulled = false;
  return m;
}
function pindMellem(mesh, i, a, b, r) {
  tD.subVectors(b, a);
  const l = tD.length();
  tQ.setFromUnitVectors(OP, tD.divideScalar(l || 1));
  tM.compose(tA.addVectors(a, b).multiplyScalar(0.5), tQ, tS.set(r, l, r));
  mesh.setMatrixAt(i, tM);
}
function kugleVed(mesh, i, p, r) {
  tM.compose(p, tQ.identity(), tS.set(r, r, r));
  mesh.setMatrixAt(i, tM);
}
function færdig(...meshes) {
  for (const m of meshes) {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }
}

// En lille tilfældighed, der giver det samme hver gang (så kæden og foldningen ser ens ud)
function frø(s) {
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Bogstaver som små skilte (kanvas). Én tekstur pr. tegn, to materialer (lys og svag).
const skilte = {};
function skiltMat(tegn, lys) {
  const nøgle = `${tegn}|${lys}`;
  if (skilte[nøgle]) return skilte[nøgle];
  const bred = tegn.length > 1;
  const c = document.createElement('canvas');
  c.width = bred ? 128 : 64;
  c.height = 64;
  const g = c.getContext('2d');
  g.font = `800 ${bred ? 38 : 46}px system-ui, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.lineWidth = 8;
  g.strokeStyle = 'rgba(6, 10, 26, 0.9)';
  g.strokeText(tegn, c.width / 2, 34);
  g.fillStyle = tegn === 'STOP' ? '#ff6b6b' : '#ffffff';
  g.fillText(tegn, c.width / 2, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false });
  m.userData.fuld = lys ? 1 : 0.42;
  skilte[nøgle] = m;
  return m;
}

// En budbringer (tRNA): en stilk med en arm, tre baser i bunden og aminosyren på toppen
function lavBudbringer() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: TRNA_FARVE, roughness: 0.5, transparent: true });
  const cyl = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
  const stilk = new THREE.Mesh(cyl, mat);
  stilk.scale.set(0.34, 2.1, 0.34);
  stilk.position.y = 2.15;
  const arm = new THREE.Mesh(cyl, mat);
  arm.scale.set(0.26, 1.7, 0.26);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0, 2.0, 0);
  const bund = new THREE.Mesh(cyl, mat);
  bund.scale.set(0.22, 2 * D + 0.4, 0.22);
  bund.rotation.z = Math.PI / 2;
  bund.position.y = 1.1;
  const baser = [];
  const baseMats = [];
  for (let i = 0; i < 3; i++) {
    const bm = new THREE.MeshStandardMaterial({ roughness: 0.45, transparent: true });
    const b = new THREE.Mesh(cyl, bm);
    b.scale.set(R_BASE, 0.62, R_BASE);
    b.position.set((i - 1) * D, 0.72, 0);
    baser.push(b);
    baseMats.push(bm);
  }
  const perleMat = new THREE.MeshStandardMaterial({ roughness: 0.35, transparent: true });
  const perle = new THREE.Mesh(new THREE.SphereGeometry(R_PERLE, 16, 12), perleMat);
  perle.position.y = A_TOP.y;
  g.add(stilk, arm, bund, ...baser, perle);
  g.visible = false;
  return { gruppe: g, mats: [mat, perleMat, ...baseMats], baseMats, perle, perleMat, alpha: 0 };
}

export class ProteinTegning {
  constructor() {
    this.gruppe = new THREE.Group();
    this.indhold = new THREE.Group();
    this.gruppe.add(this.indhold);
    this.synlighed = 1;
    this.radius = 14;
    const kugle = new THREE.SphereGeometry(1, LAV_KVALITET ? 8 : 12, LAV_KVALITET ? 6 : 8);
    const cyl = new THREE.CylinderGeometry(1, 1, 1, LAV_KVALITET ? 5 : 8, 1);
    const mat = () => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05, transparent: true });
    this.dnaMat = mat();
    this.rnaMat = mat();
    this.kædeMat = mat();
    this.dnaKugler = instanser(kugle, this.dnaMat, MAKS_DNA);
    this.dnaPinde = instanser(cyl, this.dnaMat, MAKS_DNA * 2);
    this.rnaKugler = instanser(kugle, this.rnaMat, MAKS_RNA);
    this.rnaPinde = instanser(cyl, this.rnaMat, MAKS_RNA * 2);
    this.perler = instanser(new THREE.SphereGeometry(1, LAV_KVALITET ? 10 : 16, LAV_KVALITET ? 8 : 12), this.kædeMat, MAKS_AA);
    this.kædePinde = instanser(cyl, this.kædeMat, MAKS_AA);
    for (const m of [this.dnaKugler, this.dnaPinde, this.rnaKugler, this.rnaPinde, this.perler, this.kædePinde]) {
      for (let i = 0; i < m.instanceMatrix.count; i++) m.setColorAt(i, GRÅ);
    }
    this.polymerase = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), hindeMateriale(0xc59cff, 1.3));
    this.polymerase.scale.set(5.6, 3.1, 3.1);
    this.polymerase.position.set(-3.1, 0.4, 0);
    this.lille = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), hindeMateriale(0x6fb6ff, 1.1));
    this.lille.scale.set(5.4, 1.8, 3.8);
    this.stor = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), hindeMateriale(0x9a8cff, 1.1));
    this.stor.scale.set(6.4, 3.3, 4.8);
    this.budbringere = [0, 1, 2].map(lavBudbringer); // P-pladsen (flyver væk fra E), A-pladsen og starten
    this.skiltPulje = [];
    this.indhold.add(this.dnaKugler, this.dnaPinde, this.rnaKugler, this.rnaPinde, this.perler, this.kædePinde,
      this.polymerase, this.lille, this.stor, ...this.budbringere.map((b) => b.gruppe));
    this.lavSti();
    this.fart = 1;
    this.påSkift = null; // kaldes, når tilstanden, ordet eller kæden skifter
    this.flyt = new THREE.Vector2(); // plads til kodehjulet (sættes af js/liv-protein.js)
    this.tøm();
  }

  // ---------- Tilstandene ----------
  tøm() {
    this.tilstand = 'tom';
    this.dna = '';
    this.rna = '';
    this.kæde = '';
    this.manuel = false;
    this.godkendt = new Set();
    this.venter = false;
    this.p = 0;
    this.t = 0;
    this.k = 0;
    this.u = 0;
    this.f = 3;
    this.ret = null;
    for (const b of this.budbringere) this.skjulBudbringer(b);
    this.tegn();
  }

  // Aflæsningen af et gen (DNA, streng I) fra starten
  startAflæs(dna) {
    this.tøm();
    this.sætGen(dna);
    this.tilstand = 'aflæs';
    this.tegn();
  }

  // Ribosomet med RNA'et fra genet. manuel: venter på godkend() ved hvert ord ("Læs selv").
  startOversæt(dna, { manuel = false } = {}) {
    this.tøm();
    this.sætGen(dna);
    this.manuel = manuel;
    this.tilstand = 'oversæt';
    this.k = 0;
    this.u = 0;
    this.tegn();
  }

  // "Skift et bogstav": RNA'et og kæden ligger stille. dna: stykket (fx 30 bogstaver), original: genet, valgt: kodonet
  visRet(dna, original, valgt = -1) {
    if (this.tilstand !== 'ret') {
      this.tøm();
      this.tilstand = 'ret';
    }
    this.sætGen(dna);
    this.ret = { original, valgt, ekstra: 2 };
    this.tegn();
  }

  sætGen(dna) {
    this.dna = dna;
    this.rna = tilRNA(dna);
    this.ord = kodoner(this.rna);
  }

  // Godkender ordet, ribosomet venter på ("Læs selv")
  godkend() {
    if (!this.venter) return;
    this.godkendt.add(this.k);
    this.venter = false;
  }

  // Ordet i A-pladsen (eller P-pladsen ved starten), som ribosomet læser lige nu
  get ordNu() {
    return this.tilstand === 'oversæt' ? this.ord[this.k] ?? null : null;
  }

  skift() {
    this.påSkift?.(this.tilstand);
  }

  // ---------- Tiden ----------
  opdater(dt) {
    this.dt = dt;
    const d = dt * this.fart;
    if (this.tilstand === 'aflæs') this.kørAflæs(d);
    else if (this.tilstand === 'ud') this.kørUd(d);
    else if (this.tilstand === 'oversæt') this.kørOversæt(d);
    else if (this.tilstand === 'fold') this.kørFold(d);
    else if (this.tilstand === 'færdig') this.indhold.rotation.y += ROLIG ? 0 : d * 0.15;
    if (this.tilstand !== 'tom') this.tegn();
  }

  kørAflæs(d) {
    const L = this.rna.length;
    const v = this.p < 30 ? 5 : Math.min(45, 5 + (this.p - 30) * 0.6); // de første 10 ord langsomt, så hurtigere
    this.p = Math.min(L, this.p + v * d);
    if (this.p >= L) {
      this.tilstand = 'ud';
      this.t = 0;
      this.skift();
    }
  }

  kørUd(d) {
    this.t = Math.min(1, this.t + d / 2.6);
    if (this.t >= 1) {
      this.tilstand = 'oversæt';
      this.k = 0;
      this.u = 0;
      this.skift();
    }
  }

  // Et ord pr. omgang. De første 10 langsomt, så hurtigere.
  omgangTid() {
    return this.k < 10 ? 1.7 : Math.max(0.24, 1.7 - (this.k - 10) * 0.07);
  }

  kørOversæt(d) {
    if (this.u === 0) {
      if (this.ord[this.k] == null || KODE[this.ord[this.k]] === STOP) {
        this.tilstand = 'fold';
        this.t = 0;
        this.foldFra = this.kædePladser();
        this.foldTil = this.lavFold(this.kæde);
        this.skift();
        return;
      }
      if (this.manuel && !this.godkendt.has(this.k)) {
        if (!this.venter) {
          this.venter = true;
          this.skift();
        }
        return;
      }
    }
    const førBinding = this.u < 0.42;
    this.u = Math.min(1, this.u + d / this.omgangTid());
    if (this.k === 0) {
      // Starten: budbringeren med methionin kommer ind på P-pladsen
      if (this.u >= 1) {
        this.kæde = KODE[this.ord[0]];
        this.k = 1;
        this.u = 0;
        this.skift();
      }
      return;
    }
    if (førBinding && this.u >= 0.42) {
      this.kæde += KODE[this.ord[this.k]];
      this.skift();
    }
    if (this.u >= 1) {
      this.k++;
      this.u = 0;
      this.skift();
    }
  }

  kørFold(d) {
    this.t = Math.min(1, this.t + d / 3.2);
    if (this.t >= 1) {
      this.tilstand = 'færdig';
      this.skift();
    }
  }

  // Hvor langt kæden er nået (til tests og panelet)
  get antal() {
    return this.kæde.length;
  }

  // ---------- Kæden ----------
  // Stien, kæden vokser ud ad: alder 0 er A-pladsen, 1 er P-pladsen, så tunnelen og en løs kurve over ribosomet
  lavSti() {
    const r = frø(7);
    const sti = [A_TOP.clone(), P_TOP.clone(), ...STI_START.map((p) => new THREE.Vector3(...p))];
    const ret = new THREE.Vector3(-0.3, 1, 0.25).normalize();
    const p = sti.at(-1).clone();
    while (sti.length < MAKS_AA + 4) {
      ret.x += (r() - 0.5) * 0.9;
      ret.y += (r() - 0.5) * 0.9;
      ret.z += (r() - 0.5) * 0.9;
      tD.subVectors(KÆDE_MIDT, p);
      if (tD.length() > 5.5) ret.addScaledVector(tD.normalize(), 0.35);
      if (p.y < 7.5) ret.y += 0.4;
      ret.normalize();
      p.addScaledVector(ret, 0.88);
      sti.push(p.clone());
    }
    this.sti = sti;
  }

  // Foldningen: aminosyrerne, der skyr vand, inderst, de ladede yderst. Retningen skifter langsomt langs kæden.
  lavFold(protein) {
    const orden = { skyr: 0, elsker: 1, plus: 2, minus: 2 };
    const rang = [...protein].map((aa, i) => [orden[AMINOSYRER[aa].slags] + i * 1e-4, i]).sort((a, b) => a[0] - b[0]);
    const rFor = new Array(protein.length);
    rang.forEach(([, i], n) => { rFor[i] = FOLD_R * Math.cbrt((n + 0.5) / protein.length); });
    const r = frø(11);
    const ret = new THREE.Vector3(1, 0.3, 0.2).normalize();
    return [...protein].map((_, i) => {
      ret.x += (r() - 0.5) * 0.9;
      ret.y += (r() - 0.5) * 0.9;
      ret.z += (r() - 0.5) * 0.9;
      ret.normalize();
      return FOLD_MIDT.clone().addScaledVector(ret, rFor[i] + 0.3);
    });
  }

  // Punktet på stien ved en alder (med brøkdele)
  påSti(alder, ud) {
    const i = Math.floor(alder);
    const a = this.sti[Math.min(i, this.sti.length - 1)];
    const b = this.sti[Math.min(i + 1, this.sti.length - 1)];
    return ud.lerpVectors(a, b, alder - i);
  }

  // Alderen af den nyeste perle i kæden (0 = A-pladsen, 1 = P-pladsen)
  nyesteAlder() {
    if (this.k === 0 || this.u < 0.42) return 1;
    if (this.u < 0.55) return 0;
    return glat((this.u - 0.55) / 0.4);
  }

  kædePladser() {
    const n = this.kæde.length;
    const a0 = this.nyesteAlder();
    const ud = [];
    for (let m = 0; m < n; m++) ud[n - 1 - m] = this.påSti(a0 + m, new THREE.Vector3());
    return ud;
  }

  // ---------- Tegningen ----------
  tegn() {
    let nd = 0, ndp = 0, nr = 0, nrp = 0, np = 0, nkp = 0;
    const skilte = [];
    const s = this.tilstand;
    const dnaA = s === 'aflæs' ? 1 : s === 'ud' ? 1 - glat(this.t * 2) : 0;
    const polA = dnaA;
    const riboA = s === 'oversæt' ? 1 : s === 'ud' ? glat(this.t * 2 - 1) : s === 'fold' ? 1 - glat(this.t * 1.6) : 0;
    let rnaA = s === 'aflæs' || s === 'oversæt' || s === 'ret' ? 1 : s === 'ud' ? Math.abs(1 - 2 * this.t) : s === 'fold' ? 1 - glat(this.t * 1.6) : 0;
    const kædeA = s === 'oversæt' || s === 'fold' || s === 'færdig' || s === 'ret' ? 1 : 0;
    const iUd = s === 'ud' && this.t > 0.5; // anden halvdel: RNA'et ligger i ribosomet

    // DNA'et og RNA'et under aflæsningen
    if (s === 'aflæs' || (s === 'ud' && !iUd)) {
      const p = s === 'aflæs' ? this.p : this.rna.length;
      const L = this.rna.length;
      const ryg = [{ p: new THREE.Vector3(), n: -1e9 }, { p: new THREE.Vector3(), n: -1e9 }];
      for (let n = Math.ceil(p) - VINDUE; n <= p + VINDUE; n++) {
        const x = (n - p) * D;
        const åben = glat((n - p + 11) / 2.5) * (1 - glat((n - p - 1) / 2.5)); // boblen fra ca. -10 til +2
        const θ = (n * 2 * Math.PI) / PR_OMGANG;
        const iGen = n >= 0 && n < L;
        const bI = iGen ? this.dna[n] : 'ATGC'[(n * 7 + 3) & 3];
        const bII = { A: 'T', T: 'A', G: 'C', C: 'G' }[bI];
        for (const [streng, base, vinkel, åbenY] of [[0, bI, θ, 2.5], [1, bII, θ + Math.PI, -1.3]]) {
          const forrige = ryg[streng];
          const cy = 1.05 * Math.cos(vinkel), cz = 1.05 * Math.sin(vinkel);
          tA.set(x, cy + (åbenY - cy) * åben, cz * (1 - åben));
          tD.set(0, -cy, -cz).normalize().lerp(tB.set(0, streng === 0 ? -1 : 1, 0), åben).normalize();
          tB.copy(tA).addScaledVector(tD, L_BASE);
          kugleVed(this.dnaKugler, nd, tA, R_RYG);
          this.dnaKugler.setColorAt(nd++, RYG_DNA);
          pindMellem(this.dnaPinde, ndp, tA, tB, R_BASE);
          this.dnaPinde.setColorAt(ndp++, iGen ? FARVE[base] : GRÅ);
          if (forrige.n === n - 1) {
            pindMellem(this.dnaPinde, ndp, forrige.p, tA, R_BASE * 0.7);
            this.dnaPinde.setColorAt(ndp++, RYG_DNA);
          }
          forrige.p.copy(tA);
          forrige.n = n;
        }
      }
      // RNA'et: de nyeste sidder på DNA'et, de ældre hænger ud af polymerasen
      const nyeste = Math.floor(p) - 1;
      let før = null;
      for (let n = nyeste; n >= Math.max(0, nyeste - 2 * VINDUE - 30); n--) {
        const a = p - 1 - n;
        this.rnaPose(n, a, p, tA, tD);
        tB.copy(tA).addScaledVector(tD, L_BASE);
        kugleVed(this.rnaKugler, nr, tA, R_RYG);
        this.rnaKugler.setColorAt(nr++, RYG_RNA);
        pindMellem(this.rnaPinde, nrp, tA, tB, R_BASE);
        this.rnaPinde.setColorAt(nrp++, FARVE[this.rna[n]]);
        if (før) {
          pindMellem(this.rnaPinde, nrp, før, tA, R_BASE * 0.7);
          this.rnaPinde.setColorAt(nrp++, RYG_RNA);
        }
        før = (før ?? new THREE.Vector3()).copy(tA);
        if (a < HYBRID + 2 && s === 'aflæs') skilte.push([this.rna[n], tB.x, tB.y - 0.9, 1.3, true]);
        if (nr >= MAKS_RNA - 1) break;
      }
    }

    // RNA'et i ribosomet (og i "Skift et bogstav")
    if (s === 'oversæt' || iUd || s === 'fold' || s === 'ret') {
      const ret = s === 'ret';
      let f = 3;
      if (s === 'oversæt' && this.k > 0) f = 3 * this.k + (this.u > 0.55 ? 3 * glat((this.u - 0.55) / 0.4) : 0);
      if (s === 'fold') f = 3 * this.k;
      const nMax = ret ? this.rna.length + 3 * this.ret.ekstra : this.rna.length;
      const fra = ret ? 0 : Math.max(0, Math.floor(f) - VINDUE);
      const til = ret ? nMax - 1 : Math.min(nMax - 1, Math.ceil(f) + VINDUE);
      let før = null;
      for (let n = fra; n <= til; n++) {
        const x = ret ? (n - (nMax - 1) / 2) * D : (n - f + 0.5) * D;
        const bølge = ret ? 0 : 0.5 * Math.sin(x * 0.3) * glat((Math.abs(x) - 6) / 5);
        tA.set(x, -0.6 + bølge, 0);
        tB.set(x, -0.6 + bølge + L_BASE, 0);
        const ekstra = n >= this.rna.length;
        const b = ekstra ? 'UCAG'[(n * 5 + 1) & 3] : this.rna[n];
        kugleVed(this.rnaKugler, nr, tA, R_RYG);
        this.rnaKugler.setColorAt(nr++, RYG_RNA);
        pindMellem(this.rnaPinde, nrp, tA, tB, R_BASE);
        this.rnaPinde.setColorAt(nrp++, ekstra ? GRÅ : FARVE[b]);
        if (før) {
          pindMellem(this.rnaPinde, nrp, før, tA, R_BASE * 0.7);
          this.rnaPinde.setColorAt(nrp++, RYG_RNA);
        }
        før = (før ?? new THREE.Vector3()).copy(tA);
        // Bogstaverne: lyse i ordet, der læses (eller er valgt), svage ellers
        const kodon = Math.floor(n / 3);
        if (ret) {
          const ændret = !ekstra && this.ret.original[n] !== this.dna[n];
          if (!ekstra) skilte.push([b, x, -1.55, 0.6, kodon === this.ret.valgt || ændret]);
        } else if (Math.abs(x) < 9.5 && s === 'oversæt') {
          const læses = kodon === this.k || (this.k === 0 && kodon === 0);
          skilte.push([b, x, -1.55, 0.6, læses]);
        }
      }
      if (iUd) rnaA = glat(this.t * 2 - 1);
    }

    // Kæden
    if (s === 'oversæt' || s === 'fold' || s === 'færdig') {
      const pladser = s === 'oversæt' ? this.kædePladser() : null;
      const ft = s === 'fold' ? glat(this.t) : 1;
      let før = null;
      for (let i = 0; i < this.kæde.length; i++) {
        if (pladser) tA.copy(pladser[i]);
        else tA.lerpVectors(this.foldFra[i], this.foldTil[i], ft);
        kugleVed(this.perler, np, tA, R_PERLE);
        this.perler.setColorAt(np++, AA_FARVE[this.kæde[i]]);
        if (før) {
          pindMellem(this.kædePinde, nkp, før, tA, 0.12);
          this.kædePinde.setColorAt(nkp++, TRNA_FARVE);
        }
        før = (før ?? new THREE.Vector3()).copy(tA);
        if (s === 'oversæt' && i >= this.kæde.length - 6) skilte.push([this.kæde[i], tA.x, tA.y, tA.z + 0.9, i === this.kæde.length - 1]);
      }
    } else if (s === 'ret') {
      const ord = this.ord;
      const nMax = this.rna.length + 3 * this.ret.ekstra;
      let før = null;
      for (let i = 0; i < ord.length; i++) {
        const x = (3 * i + 1 - (nMax - 1) / 2) * D;
        const aa = KODE[ord[i]];
        if (aa === STOP) {
          skilte.push(['STOP', x, 3.3, 0.6, true]);
          break;
        }
        tA.set(x, 3.3, 0);
        kugleVed(this.perler, np, tA, R_PERLE * 1.15);
        this.perler.setColorAt(np++, AA_FARVE[aa]);
        if (før) {
          pindMellem(this.kædePinde, nkp, før, tA, 0.12);
          this.kædePinde.setColorAt(nkp++, TRNA_FARVE);
        }
        før = (før ?? new THREE.Vector3()).copy(tA);
        const ændret = KODE[tilRNA(this.ret.original.slice(3 * i, 3 * i + 3))] !== aa;
        skilte.push([aa, x, 4.55, 0.6, i === this.ret.valgt || ændret]);
      }
    }

    for (const [m, n] of [[this.dnaKugler, nd], [this.dnaPinde, ndp], [this.rnaKugler, nr], [this.rnaPinde, nrp], [this.perler, np], [this.kædePinde, nkp]]) {
      m.count = n;
      færdig(m);
    }
    this.tegnBudbringere(riboA);
    this.tegnSkilte(skilte);

    // Polymerasen og ribosomet
    const syn = this.synlighed;
    this.polymerase.visible = polA * syn > 0.01;
    this.polymerase.material.uniforms.uOpacitet.value = polA * syn;
    const åbn = s === 'fold' ? glat(this.t * 1.6) * 4 : s === 'ud' ? (1 - riboA) * 5 : 0;
    this.lille.position.set(0, -1.7 - åbn, 0);
    this.stor.position.set(0, 2.9 + åbn, 0);
    for (const r of [this.lille, this.stor]) {
      r.visible = riboA * syn > 0.01;
      r.material.uniforms.uOpacitet.value = riboA * syn * 0.9;
    }
    this.sætAlpha(this.dnaMat, dnaA);
    this.sætAlpha(this.rnaMat, rnaA);
    this.sætAlpha(this.kædeMat, kædeA);
    // Billedet flytter sig, så kæden over ribosomet kan ses
    const k = ROLIG || s === 'ret' || s === 'aflæs' || s === 'tom' ? 1 : 1 - Math.exp(-(this.dt ?? 0) * 2.5);
    const k0 = ROLIG || s === 'tom' ? 1 : 1 - Math.exp(-(this.dt ?? 0.05) * 4);
    // Står kodehjulet fremme (øverst til højre), rykker tegningen lidt ned og til venstre
    this.indhold.position.x += (this.flyt.x - this.indhold.position.x) * k0;
    const mål = this.flyt.y + (s === 'oversæt' ? -2 - 4.5 * glat(this.kæde.length / 40) : s === 'fold' || s === 'færdig' ? -6.5 : s === 'ret' ? -1.4 : iUd ? -2 : 0);
    this.indhold.position.y += (mål - this.indhold.position.y) * k;
    if (s !== 'færdig') this.indhold.rotation.y = 0;
  }

  // Et bogstav i RNA'et under aflæsningen. a: alder (0 = det nyeste). p: hvor langt polymerasen er nået.
  rnaPose(n, a, p, pos, ret) {
    const x0 = (n - p) * D;
    if (a < HYBRID) {
      pos.set(x0, 0.45, 0);
      ret.set(0, -1, 0);
      return;
    }
    // Ud af polymerasen: skråt op og så i en bue tilbage over DNA'et
    const s = a - HYBRID;
    const xH = -HYBRID * D;
    if (s < 6) {
      pos.set(xH - s * D * 0.5, 0.45 + s * D * 0.85, 0.25 * s);
    } else {
      const t = s - 6;
      pos.set(xH - 3 * D - t * D * 0.92, 0.45 + 6 * D * 0.85 + 0.7 * Math.sin(t * 0.33), 1.5 + 0.9 * Math.sin(t * 0.21));
    }
    ret.set(0.3, -1, 0).normalize();
  }

  tegnBudbringere(riboA) {
    const [pB, aB, ind] = this.budbringere;
    for (const b of this.budbringere) b.ønsket = false;
    if (this.tilstand === 'oversæt' && riboA > 0.01) {
      const u = this.u;
      const flyt = this.k > 0 && u > 0.55 ? glat((u - 0.55) / 0.4) : 0; // translokationen
      const ankomst = ROLIG ? 1 : glat(u / 0.42);
      if (this.k === 0) {
        // Starten: methionin flyver ind på P-pladsen (i "Læs selv" først, når ordet er læst)
        if (!this.venter && u > 0) this.visBudbringer(ind, this.ord[0], -1.5 * D, ankomst, true, glat(u / 0.3));
      } else {
        // Den tomme på P-pladsen glider til E og flyver væk
        const væk = ROLIG ? 0 : glat((flyt - 0.5) / 0.5);
        this.visBudbringer(pB, this.ord[this.k - 1], -1.5 * D - 3 * D * flyt - væk * 4, 1, false, 1 - glat((flyt - 0.4) / 0.6), væk * 5);
        // Den nye kommer ind på A-pladsen og glider til P
        if (!this.venter && u > 0) {
          const x = 1.5 * D - 3 * D * flyt;
          this.visBudbringer(aB, this.ord[this.k], x, ankomst, u < 0.42, glat(u / 0.25));
        }
      }
    }
    for (const b of this.budbringere) if (!b.ønsket) this.skjulBudbringer(b);
  }

  // x: hvor budbringeren står. ankomst: 0 = langt væk, 1 = på plads. medPerle: bærer den stadig aminosyren?
  visBudbringer(b, kodon, x, ankomst, medPerle, alpha, op = 0) {
    b.ønsket = true;
    const g = b.gruppe;
    g.visible = alpha * this.synlighed > 0.01;
    const fraX = x + 7, fraY = 9, fraZ = 4;
    g.position.set(fraX + (x - fraX) * ankomst, fraY * (1 - ankomst) + op, fraZ * (1 - ankomst));
    for (let i = 0; i < 3; i++) b.baseMats[i].color.copy(FARVE[PARTNER_RNA[kodon[i]]]);
    b.perle.visible = medPerle;
    b.perleMat.color.copy(AA_FARVE[KODE[kodon]] ?? GRÅ);
    for (const m of b.mats) this.sætAlpha(m, alpha);
  }

  skjulBudbringer(b) {
    b.gruppe.visible = false;
  }

  tegnSkilte(liste) {
    while (this.skiltPulje.length < liste.length) {
      const sp = new THREE.Sprite(skiltMat('A', true));
      sp.renderOrder = 5;
      this.indhold.add(sp);
      this.skiltPulje.push(sp);
    }
    this.skiltPulje.forEach((sp, i) => {
      const s = liste[i];
      sp.visible = Boolean(s) && this.synlighed > 0.05;
      if (!s) return;
      const [tegn, x, y, z, lys] = s;
      sp.material = skiltMat(tegn, lys);
      sp.position.set(x, y, z);
      const str = tegn.length > 1 ? 1.1 : 0.85;
      sp.scale.set(str * (tegn.length > 1 ? 2 : 1), str, 1);
    });
    for (const m of Object.values(skilte)) m.opacity = m.userData.fuld * this.synlighed;
  }

  sætAlpha(m, a) {
    const v = a * this.synlighed;
    m.opacity = v;
    m.transparent = v < 0.99;
    m.depthWrite = v > 0.5;
  }

  sætSynlighed(a) {
    this.synlighed = a;
    this.gruppe.visible = a > 0.005;
    this.tegn();
  }

  // Kassen, kameraet skal se (halv bredde og højde), for hver tilstand
  halvMål() {
    if (this.tilstand === 'aflæs' || this.tilstand === 'ud') return [11, 5.5];
    if (this.tilstand === 'ret') return [15.5, 4.5];
    if (this.tilstand === 'fold' || this.tilstand === 'færdig') return [6.5, 6.5];
    return [11, 9.5];
  }
}
