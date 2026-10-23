// Et atom i 3D: en kerne af protoner og neutroner og elektroner i skaller rundt om.
// Man sætter, hvor mange af hver der skal være, og så flyver partiklerne selv ind eller ud.

import * as THREE from 'three';
import { skallerForIon } from './data/grundstoffer.js';
import { orbitaler, kvantilRadius, prøver, vinkel, størsteVinkel } from './data/orbitaler.js';
import { LAV_KVALITET, ROLIG, lavPrikTekstur } from './scene3d.js';

const R = 0.5; // radius på en proton eller neutron
const MAX_P = 118;
const MAX_N = 200;
const MAX_E = 125;
// Så mange kugler af hver slags kan tegnes (plads til nogle, der er på vej ud)
const PLADS_P = MAX_P + 40;
const PLADS_N = MAX_N + 40;
const PLADS_E = MAX_E + 40;

// Hvor stor kernen er med a partikler (de pakker sig som kugler i en pose)
export function kerneRadius(a) {
  if (a <= 0) return 0;
  if (a === 1) return R;
  return R * 1.22 * Math.cbrt(a) + 0.15;
}

// Radius for elektronskal nr. n
export function skalRadius(a, n) {
  return kerneRadius(Math.max(a, 1)) + 1.4 + n * 1.75;
}

const hjælpMatrix = new THREE.Matrix4();
const hjælpQ = new THREE.Quaternion();
const hjælpS = new THREE.Vector3();
const hjælpV = new THREE.Vector3();
const ryst = new THREE.Vector3();

const HALE_LÆNGDE = LAV_KVALITET ? 9 : 16; // så mange punkter er der i en elektrons hale
const MAX_LIM = 2400; // højst så mange lyspunkter for kernekraften

// Udgaver af atomet, som man kan prøve med ?udgaver i adressen (se vaerksted.js):
// 'nu' (som før), 'prikker' (orbitalerne som en sky af prikker, der viser, hvor elektronen sandsynligvis er)
// og 'former' (orbitalernes form som glødende overflader, som i fysikbøgerne).
// De to nye har også skygge i kernen og en glidende overgang mellem ringe og sky.
// Besluttet 24. oktober 2026: 'former' er standard. De andre kan stadig vælges med ?udgaver i adressen.
export const UDGAVER = ['nu', 'prikker', 'former'];
let udgave = 'former';
const alleAtomer = new Set();
export function sætUdgave(ny) {
  udgave = UDGAVER.includes(ny) ? ny : 'former';
  for (const a of alleAtomer) a.skiftUdgave();
}
export function hentUdgave() {
  return udgave;
}

// Farven på orbitalerne: s er blå, p er lyserød, d er grøn og f er orange. Hver orbital har sin egen nuance.
const ORBITAL_FARVE = [0.57, 0.93, 0.33, 0.08];
function orbitalFarve(o) {
  return new THREE.Color().setHSL((ORBITAL_FARVE[o.l] + (o.mi - o.l) * 0.045 + 1) % 1, 0.95, 0.6);
}

// Steder, hvor elektronen kan være, for hver orbital (i Bohr-radier). De trækkes én gang og genbruges.
// De 4 % længst ude kommer ikke med, så skyen ikke fylder hele billedet.
const PULJE = 1500;
const puljer = new Map();
function pulje(n, l, mi) {
  const nøgle = `${n}${l}${mi}`;
  if (!puljer.has(nøgle)) puljer.set(nøgle, prøver(n, l, mi, PULJE, Math.random, 0.96));
  return puljer.get(nøgle);
}

// Giver kuglerne et lysende kantlys og lader dem pulsere svagt (hver kugle i sin egen takt).
// Det gøres ved at tilføje lidt kode til Three.js' almindelige materiale.
// skygge = { styrke, radius } (uniforms) gør kuglerne mørkere dybt inde i kernen, så revnerne mellem dem får skygge.
export function tilføjKantlys(materiale, kantFarve, pulsFarve, tid, skygge = null) {
  // Uden sin egen nøgle ville Three.js genbruge det samme program til kugler med og uden skygge
  materiale.customProgramCacheKey = () => (skygge ? 'kantlys-skygge' : 'kantlys');
  materiale.onBeforeCompile = (shader) => {
    shader.uniforms.uKant = { value: kantFarve };
    shader.uniforms.uPuls = { value: pulsFarve };
    shader.uniforms.uTid = tid;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTid;\nvarying float vPuls;\nvarying float vDybde;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 dybdePos = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          vPuls = 0.5 + 0.5 * sin(uTid * 2.2 + float(gl_InstanceID) * 2.39);
          dybdePos = instanceMatrix * dybdePos;
        #else
          vPuls = 0.5;
        #endif
        vDybde = length(dybdePos.xyz);`);
    let fragment = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uKant;\nuniform vec3 uPuls;\nvarying float vPuls;\nvarying float vDybde;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float kant = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.5);
        totalEmissiveRadiance += uKant * kant + uPuls * vPuls;`);
    if (skygge) {
      shader.uniforms.uSkygge = skygge.styrke;
      shader.uniforms.uKerneR = skygge.radius;
      // Jo dybere inde i kernen (tættere på midten end kernens kant), jo mørkere
      fragment = fragment
        .replace('#include <common>', '#include <common>\nuniform float uSkygge;\nuniform float uKerneR;')
        .replace('#include <color_fragment>', `#include <color_fragment>
          float skyg = mix(1.0, 0.2 + 0.8 * smoothstep(uKerneR - 1.3, uKerneR + 0.1, vDybde), uSkygge);
          diffuseColor.rgb *= skyg;`)
        .replace('totalEmissiveRadiance += uKant * kant + uPuls * vPuls;', 'totalEmissiveRadiance += (uKant * kant + uPuls * vPuls) * skyg;')
        .replace('#include <aomap_fragment>', `#include <aomap_fragment>
          reflectedLight.indirectDiffuse *= skyg;
          reflectedLight.indirectSpecular *= skyg;`);
    }
    shader.fragmentShader = fragment;
  };
}

// En lysende ring (til chokbølgen ved henfald)
function lavRingTekstur() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.68, 'rgba(255,255,255,0)');
  grad.addColorStop(0.86, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Atom {
  constructor() {
    this.gruppe = new THREE.Group();
    alleAtomer.add(this);

    const [b, h] = LAV_KVALITET ? [14, 10] : [26, 18];
    const kugle = new THREE.SphereGeometry(R, b, h);
    this.tidUniform = { value: 0 };
    this.protonMat = new THREE.MeshStandardMaterial({
      color: 0xd81414, roughness: 0.38, metalness: 0.05, emissive: 0x4a0303,
    });
    this.neutronMat = new THREE.MeshStandardMaterial({
      color: 0x98a8c8, roughness: 0.42, metalness: 0.05, emissive: 0x0c1424,
    });
    this.skygge = { styrke: { value: 0 }, radius: { value: 1 } };
    tilføjKantlys(this.protonMat, new THREE.Color(1.1, 0.12, 0.08), new THREE.Color(0.28, 0.02, 0.01), this.tidUniform, this.skygge);
    tilføjKantlys(this.neutronMat, new THREE.Color(0.16, 0.3, 0.85), new THREE.Color(0.0, 0.0, 0.0), this.tidUniform, this.skygge);
    this.pMesh = new THREE.InstancedMesh(kugle, this.protonMat, PLADS_P);
    this.nMesh = new THREE.InstancedMesh(kugle, this.neutronMat, PLADS_N);

    // Elektronerne lyser så stærkt (farver over 1), at de får glød
    const eGeo = new THREE.SphereGeometry(0.2, 14, 10);
    this.eMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 3.4, 4.2) });
    this.eMesh = new THREE.InstancedMesh(eGeo, this.eMat, PLADS_E);
    this.eGeo = eGeo;

    for (const m of [this.pMesh, this.nMesh, this.eMesh]) {
      m.count = 0;
      m.frustumCulled = false;
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }

    this.ringGruppe = new THREE.Group();
    this.skyGruppe = new THREE.Group();
    this.skyGruppe.visible = false;
    this.prik = lavPrikTekstur();
    this.blødPrik = lavPrikTekstur(true);
    this.overgang = 0; // 0 = ringe, 1 = sky (glider i de nye udgaver)

    // Et svagt skær omkring kernen. Det skifter farve, når kernen er ustabil.
    this.skær = new THREE.Sprite(new THREE.SpriteMaterial({
      map: lavPrikTekstur(true), color: 0xffc890, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));

    // Et kort lysglimt (gammastråling), når kernen henfalder
    this.glimt = new THREE.Sprite(new THREE.SpriteMaterial({
      map: lavPrikTekstur(true), color: new THREE.Color(3, 2.6, 1.6), transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));

    // Elektron-haler: hver elektron trækker en stribe af lysende prikker efter sig
    const haleGeo = new THREE.BufferGeometry();
    haleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PLADS_E * HALE_LÆNGDE * 3), 3));
    haleGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(PLADS_E * HALE_LÆNGDE * 3), 3));
    this.haler = new THREE.Points(haleGeo, new THREE.PointsMaterial({
      size: 0.3, map: this.prik, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.haler.frustumCulled = false;

    // "Lim": små gyldne lyspunkter, hvor naboer i kernen rører hinanden (en tegning af kernekraften)
    const limGeo = new THREE.BufferGeometry();
    limGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_LIM * 3), 3));
    limGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_LIM * 3), 3));
    this.lim = new THREE.Points(limGeo, new THREE.PointsMaterial({
      size: 0.5, map: this.prik, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.lim.frustumCulled = false;

    // Chokbølge ved henfald
    this.bølge = new THREE.Sprite(new THREE.SpriteMaterial({
      map: lavRingTekstur(), color: new THREE.Color(2.2, 1.8, 1.2), transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.bølgeTid = 0;

    this.gruppe.add(this.pMesh, this.nMesh, this.eMesh, this.ringGruppe, this.skyGruppe, this.skær, this.glimt,
      this.haler, this.lim, this.bølge);

    this.nukleoner = []; // { type: 'p'|'n', pos, fart, ud, liv, vækst }
    this.elektroner = []; // { pos, ud, liv, vækst, fart }
    this.mål = { p: 0, n: 0, e: 0 };
    this.visning = 'ringe';
    this.status = 'tom';
    this.ringe = [];
    this.pladser = [];
    this.skyer = [];
    this.fester = [];
    this.skud = []; // partikler, der skydes ud ved henfald (elektron, positron, neutrino)
    this.henfaldVenter = null;
    this.glimtTid = 0;
    this.tid = 0;
    if (udgave !== 'nu') this.skiftUdgave(); // et atom, der laves, efter at en udgave er valgt
  }

  // Sæt hvor mange protoner, neutroner og elektroner atomet skal have
  sætMål(p, n, e) {
    const ændret = p !== this.mål.p || n !== this.mål.n || e !== this.mål.e;
    this.mål = { p, n, e };
    if (ændret) this.beregnSkaller();
  }

  // Sæt antallet med det samme (uden at partiklerne flyver ind)
  sætStraks(p, n, e) {
    this.nukleoner = [];
    this.elektroner = [];
    this.sætMål(p, n, e);
    const typer = [...Array(p).fill('p'), ...Array(n).fill('n')];
    // Bland protoner og neutroner
    for (let i = typer.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [typer[i], typer[j]] = [typer[j], typer[i]];
    }
    const rk = kerneRadius(p + n);
    for (const type of typer) {
      const pos = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * rk);
      this.nukleoner.push({ type, pos, fart: new THREE.Vector3(), ud: false, liv: 1, vækst: 1 });
    }
    for (let i = 0; i < e; i++) {
      this.elektroner.push({ pos: new THREE.Vector3(), ud: false, liv: 1, vækst: 1, fart: new THREE.Vector3(), ny: true });
    }
    for (let i = 0; i < 40; i++) this.kernefysik(1 / 60);
  }

  sætVisning(visning) {
    this.visning = visning;
    // I de nye udgaver glider ringene over i skyen (se opdaterOvergang). Ellers skifter det med det samme.
    if (udgave !== 'nu' && !ROLIG) return;
    this.overgang = visning === 'sky' ? 1 : 0;
    this.visOvergang();
  }

  // Ringene og elektronerne toner ud, mens skyen toner frem (og omvendt)
  opdaterOvergang(dt) {
    const mål = this.visning === 'sky' ? 1 : 0;
    if (this.overgang === mål) return;
    const skridt = dt / 0.8;
    this.overgang = mål > this.overgang ? Math.min(mål, this.overgang + skridt) : Math.max(mål, this.overgang - skridt);
    this.visOvergang();
  }

  visOvergang() {
    const o = this.overgang;
    const glidende = udgave !== 'nu';
    this.skyGruppe.visible = o > 0;
    this.ringGruppe.visible = o < 1;
    this.eMesh.visible = o < 1;
    this.haler.visible = o < 1;
    if (!glidende) return;
    if (this.ringMat) this.ringMat.opacity = this.ringStyrke * (1 - o);
    this.eMat.opacity = 1 - o;
    this.haler.material.opacity = 1 - o;
    for (const sky of this.skyer) {
      if (sky.form) sky.punkter.material.uniforms.uStyrke.value = sky.styrke * o;
      else sky.punkter.material.opacity = sky.styrke * o;
    }
  }

  // Skifter mellem udgaverne (se sætUdgave)
  skiftUdgave() {
    const ny = udgave !== 'nu';
    this.eMat.transparent = ny;
    this.eMat.opacity = 1;
    this.eMat.needsUpdate = true;
    this.haler.material.opacity = 1;
    this.protonMat.roughness = ny ? 0.28 : 0.38;
    this.neutronMat.roughness = ny ? 0.32 : 0.42;
    this.beregnSkaller();
    this.overgang = this.visning === 'sky' ? 1 : 0;
    this.visOvergang();
  }

  // 'stabil', 'næsten', 'ustabil', 'meget', 'straks' eller 'tom'
  sætStatus(status) {
    this.status = status;
  }

  // Hvor stort atomet er (bruges til at zoome kameraet)
  størrelse() {
    const a = this.mål.p + this.mål.n;
    const antalSkaller = this.ringe.length ? Math.max(...this.ringe.map((r) => r.nr)) : 0;
    if (antalSkaller) return skalRadius(a, antalSkaller) + 0.6;
    return Math.max(2.2, kerneRadius(a) + 1.2);
  }

  // ---------- Elektronskaller ----------
  beregnSkaller() {
    const { p, n, e } = this.mål;
    const a = p + n;
    const skaller = p > 0 ? skallerForIon(p, e) : [];
    this.ringe = [];
    skaller.forEach((antal, i) => {
      if (!antal) return;
      const nr = i + 1;
      const radius = skalRadius(a, nr);
      // Mange elektroner i en skal fordeles på flere ringe, så de ikke klumper
      const antalRinge = Math.max(1, Math.ceil(antal / 8));
      for (let k = 0; k < antalRinge; k++) {
        const iRing = Math.floor(antal / antalRinge) + (k < antal % antalRinge ? 1 : 0);
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(
          0.5 + nr * 0.9 + (k * Math.PI) / antalRinge,
          nr * 1.7 + k * 0.8,
          nr * 0.35 + k * 0.5,
        ));
        this.ringe.push({ nr, radius, q, antal: iRing, fart: 1.5 / Math.pow(nr, 0.65), fase: nr * 0.7 + k * 1.3 });
      }
    });
    this.pladser = [];
    this.ringe.forEach((r, ri) => {
      for (let j = 0; j < r.antal; j++) this.pladser.push({ ri, j });
    });
    this.byggRinge();
    this.byggSky(skaller, a);
  }

  byggRinge() {
    for (const barn of [...this.ringGruppe.children]) {
      barn.geometry.dispose();
      this.ringGruppe.remove(barn);
    }
    if (!this.ringMat) {
      this.ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.25, 0.65, 1.2), transparent: true, opacity: 0.35,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
    }
    this.ringStyrke = Math.max(0.14, 0.4 - this.ringe.length * 0.018);
    this.ringMat.opacity = this.ringStyrke * (udgave === 'nu' ? 1 : 1 - this.overgang);
    for (const r of this.ringe) {
      const geo = new THREE.TorusGeometry(r.radius, 0.03, 6, LAV_KVALITET ? 90 : 160);
      geo.rotateX(Math.PI / 2); // ringen skal ligge fladt (i x-z-planen)
      const ring = new THREE.Mesh(geo, this.ringMat);
      ring.quaternion.copy(r.q);
      this.ringGruppe.add(ring);
    }
  }

  // Elektronskyen: mange små prikker, der viser, hvor elektronerne sandsynligvis er
  byggSky(skaller, a) {
    for (const barn of [...this.skyGruppe.children]) {
      barn.geometry.dispose();
      barn.material.dispose();
      this.skyGruppe.remove(barn);
    }
    this.skyer = [];
    if (udgave !== 'nu') {
      this.byggOrbitaler(a);
      return;
    }
    skaller.forEach((antal, i) => {
      if (!antal) return;
      const nr = i + 1;
      const radius = skalRadius(a, nr);
      const prikker = Math.min(LAV_KVALITET ? 700 : 1400, 150 + antal * (LAV_KVALITET ? 30 : 60));
      const pos = new Float32Array(prikker * 3);
      const sky = { radius, pos, antal: prikker, nr };
      for (let j = 0; j < prikker; j++) this.nyPrik(sky, j);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const farve = new THREE.Color().setHSL(0.53 + nr * 0.03, 0.9, 0.6);
      const mat = new THREE.PointsMaterial({
        size: 0.32, map: this.prik, color: farve, transparent: true, opacity: 0.75,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      sky.punkter = new THREE.Points(geo, mat);
      this.skyGruppe.add(sky.punkter);
      this.skyer.push(sky);
    });
  }

  // Orbitalerne: én sky for hver orbital med elektroner (formen regnet som i hydrogen, se data/orbitaler.js).
  // Hver orbital er gjort så stor, at 85 % af elektronens sandsynlighed ligger inden for ringen for samme skal.
  // De yderste orbitaler (dem, der bestemmer kemien) lyser mest. De inderste er dæmpet, ellers bliver det bare tåge.
  byggOrbitaler(a) {
    const liste = orbitaler(this.mål.p, this.mål.e);
    if (!liste.length) return;
    // Yderst: den højeste skal og underskaller, der ikke er fyldt (fx 3d i jern)
    const maxN = Math.max(...liste.map((o) => o.n));
    const fyldt = {};
    for (const o of liste) fyldt[`${o.n}${o.l}`] = (fyldt[`${o.n}${o.l}`] ?? 0) + o.elektroner;
    const yderst = (o) => o.n === maxN || fyldt[`${o.n}${o.l}`] < 2 * (2 * o.l + 1);
    const antal = Math.max(70, Math.min(500, Math.round((LAV_KVALITET ? 2400 : 5200) / liste.length)));
    const former = udgave === 'former';
    for (const o of liste) {
      // Formerne: kun de yderste, for de inderste sidder inden i og ville gøre det hele hvidt
      if (former && !yderst(o)) continue;
      // Halvfyldte orbitaler (1 elektron) er svagere end fyldte (2 elektroner), og de inderste er dæmpet
      const styrke = (o.elektroner === 2 ? 1 : 0.65) * (yderst(o) ? 1 : 0.15);
      const sky = former ? this.orbitalForm(o, a, styrke) : this.orbitalPrikker(o, a, styrke, antal);
      sky.orbital = o;
      sky.nr = o.n;
      this.skyGruppe.add(sky.punkter);
      this.skyer.push(sky);
    }
  }

  // Prikker, der viser, hvor elektronen sandsynligvis er
  orbitalPrikker(o, a, styrke, antal) {
    const pos = new Float32Array(antal * 3);
    const sky = { pos, antal, skala: skalRadius(a, o.n) / kvantilRadius(o.n, o.l, 0.85), kilde: pulje(o.n, o.l, o.mi), styrke: 0.85 * styrke };
    for (let j = 0; j < antal; j++) this.nyOrbitalPrik(sky, j);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sky.punkter = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.32, map: this.prik, color: orbitalFarve(o).multiplyScalar(1.8),
      transparent: true, opacity: sky.styrke * this.overgang, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    return sky;
  }

  // Orbitalens form som en glødende overflade: Afstanden i hver retning viser, hvor meget af elektronen der er
  // i den retning (vinkeldelen af bølgefunktionen). Lysest ved kanten, så man kan se ind gennem den.
  orbitalForm(o, a, styrke) {
    const [b, h] = LAV_KVALITET ? [40, 28] : [72, 48];
    const geo = new THREE.SphereGeometry(1, b, h);
    const p = geo.attributes.position;
    const max = størsteVinkel(o.l, o.mi);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      // Three.js har y opad, og orbitalens akse (z) skal pege opad
      const r = Math.min(1, Math.abs(vinkel(o.l, o.mi, x, z, y)) / max) ** 1.4;
      p.setXYZ(i, x * r, y * r, z * r);
    }
    geo.computeVertexNormals();
    const sky = { styrke: (o.l === 0 ? 0.25 : 0.5) * styrke };
    const materiale = new THREE.ShaderMaterial({
      uniforms: { uFarve: { value: orbitalFarve(o) }, uStyrke: { value: sky.styrke * this.overgang } },
      // Formen toner ud tæt på kernen (vR er afstanden fra midten), ellers bliver midten helt hvid, hvor alle formerne mødes
      vertexShader: `varying vec3 vNormal; varying vec3 vVis; varying float vR;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vVis = normalize(-mv.xyz); vR = length(position); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uFarve; uniform float uStyrke; varying vec3 vNormal; varying vec3 vVis; varying float vR;
        void main() { float kant = pow(1.0 - abs(dot(normalize(vNormal), vVis)), 2.0); gl_FragColor = vec4(uFarve * (0.12 + 0.88 * kant) * uStyrke * smoothstep(0.1, 0.45, vR), 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    sky.punkter = new THREE.Mesh(geo, materiale);
    sky.punkter.scale.setScalar(skalRadius(a, o.n) * (o.l === 0 ? 0.9 : 1.1));
    sky.form = true;
    return sky;
  }

  nyOrbitalPrik(sky, j) {
    const k = Math.floor(Math.random() * PULJE) * 3;
    sky.pos[j * 3] = sky.kilde[k] * sky.skala;
    sky.pos[j * 3 + 1] = sky.kilde[k + 1] * sky.skala;
    sky.pos[j * 3 + 2] = sky.kilde[k + 2] * sky.skala;
  }

  // Orbitalerne i atomet lige nu (til tests): navn og antal elektroner
  orbitalListe() {
    return this.skyer.filter((s) => s.orbital).map((s) => ({ navn: s.orbital.navn, elektroner: s.orbital.elektroner }));
  }

  nyPrik(sky, j) {
    // Tilfældig retning og en afstand, der oftest er tæt på skallens radius
    hjælpV.randomDirection();
    const spredning = (Math.random() + Math.random() + Math.random() - 1.5) * 1.1;
    const r = Math.max(0.3, sky.radius + spredning);
    sky.pos[j * 3] = hjælpV.x * r;
    sky.pos[j * 3 + 1] = hjælpV.y * r;
    sky.pos[j * 3 + 2] = hjælpV.z * r;
  }

  pladsPosition(indeks, ud) {
    const plads = this.pladser[indeks];
    const r = this.ringe[plads.ri];
    const vinkel = r.fase + this.tid * r.fart + (Math.PI * 2 * plads.j) / r.antal;
    return ud.set(Math.cos(vinkel) * r.radius, 0, Math.sin(vinkel) * r.radius).applyQuaternion(r.q);
  }

  // ---------- Partikler ind og ud ----------
  aktive(type) {
    return this.nukleoner.filter((k) => !k.ud && k.type === type);
  }

  nærmerSigMål() {
    for (const type of ['p', 'n']) {
      const aktive = this.aktive(type);
      const forskel = this.mål[type] - aktive.length;
      const skridt = Math.max(1, Math.ceil(Math.abs(forskel) / 6));
      if (forskel > 0) {
        for (let i = 0; i < Math.min(forskel, skridt); i++) this.nyNukleon(type);
      } else if (forskel < 0) {
        // De yderste forlader kernen først
        aktive.sort((x, y) => y.pos.lengthSq() - x.pos.lengthSq());
        for (let i = 0; i < Math.min(-forskel, skridt); i++) this.sendUd(aktive[i], 16);
      }
    }
    const aktiveE = this.elektroner.filter((e) => !e.ud);
    const forskel = this.mål.e - aktiveE.length;
    const skridt = Math.max(1, Math.ceil(Math.abs(forskel) / 6));
    if (forskel > 0) {
      for (let i = 0; i < Math.min(forskel, skridt); i++) {
        const start = new THREE.Vector3().randomDirection().multiplyScalar(this.størrelse() + 12);
        this.elektroner.push({ pos: start, ud: false, liv: 1, vækst: 0.2, fart: new THREE.Vector3() });
      }
    } else if (forskel < 0) {
      for (let i = 0; i < Math.min(-forskel, skridt); i++) this.sendUd(aktiveE[aktiveE.length - 1 - i], 14);
    }
  }

  nyNukleon(type) {
    const a = this.mål.p + this.mål.n;
    const retning = new THREE.Vector3().randomDirection();
    const pos = retning.clone().multiplyScalar(kerneRadius(a) + 12);
    const fart = retning.clone().multiplyScalar(-30);
    // 'påVej' = flyver mod kernen uden at blive bremset
    this.nukleoner.push({ type, pos, fart, ud: false, liv: 1, vækst: 0.3, påVej: true });
  }

  sendUd(partikel, fart) {
    partikel.ud = true;
    const retning = partikel.pos.lengthSq() > 0.01 ? partikel.pos.clone().normalize() : new THREE.Vector3().randomDirection();
    partikel.fart = retning.multiplyScalar(fart);
  }

  // ---------- Henfald ----------
  // Kernen ryster voldsomt et øjeblik, og så sker henfaldet. færdig({ p, n, e }) kaldes bagefter.
  henfald(måde, færdig) {
    this.henfaldVenter = { måde, tid: 0.8, færdig };
  }

  // Gør et ventende henfald færdigt med det samme (fx når man forlader værkstedet midt i det)
  afslutHenfald() {
    const v = this.henfaldVenter;
    if (!v) return;
    this.henfaldVenter = null;
    v.færdig?.(this.udførHenfald(v.måde));
  }

  udførHenfald(måde) {
    let { p, n, e } = this.mål;
    // De yderste partikler af en slags (dem, der er på plads i kernen)
    const yderste = (type) => this.nukleoner
      .filter((k) => !k.ud && k.type === type)
      .sort((a, b) => ((a.påVej ? 1 : 0) - (b.påVej ? 1 : 0)) || (b.pos.lengthSq() - a.pos.lengthSq()));
    const skift = (fra, til, antal, lepton) => {
      const kandidater = yderste(fra);
      for (let i = 0; i < antal; i++) {
        const k = kandidater[i];
        if (!k) break;
        k.type = til;
        k.puls = 1;
        if (lepton) this.skyd(lepton, k.pos); // uden lepton: elektronindfangning (kun en neutrino flyver ud)
        this.skyd(lepton === 'elektron' ? 'antineutrino' : 'neutrino', k.pos);
      }
    };
    const skydUd = (k, retning, fart) => {
      k.ud = true;
      k.langsom = true;
      k.liv = 2.2;
      k.fart = retning.clone().multiplyScalar(fart);
    };

    if (måde === 'beta-') { skift('n', 'p', 1, 'elektron'); p += 1; n -= 1; }
    if (måde === 'dobbeltbeta-') { skift('n', 'p', 2, 'elektron'); p += 2; n -= 2; }
    if (måde === 'beta+') { skift('p', 'n', 1, 'positron'); p -= 1; n += 1; }
    // Dobbelt elektronindfangning: kernen fanger to af atomets egne elektroner
    if (måde === 'dobbeltbeta+') { skift('p', 'n', 2, null); p -= 2; n += 2; e = Math.max(0, e - 2); }
    if (måde === 'n' || måde === 'p') {
      const k = yderste(måde)[0];
      if (k) skydUd(k, k.pos.lengthSq() > 0.01 ? k.pos.clone().normalize() : new THREE.Vector3().randomDirection(), 22);
      if (måde === 'n') n -= 1; else p -= 1;
    }
    if (måde === 'alfa') {
      // 2 protoner og 2 neutroner tæt ved et sted på overfladen flyver ud sammen
      const retning = new THREE.Vector3().randomDirection();
      const punkt = retning.clone().multiplyScalar(kerneRadius(p + n));
      for (const type of ['p', 'n']) {
        const nærmeste = this.nukleoner
          .filter((k) => !k.ud && k.type === type)
          .sort((a, b) => a.pos.distanceToSquared(punkt) - b.pos.distanceToSquared(punkt))
          .slice(0, 2);
        for (const k of nærmeste) { skydUd(k, retning, 11); k.puls = 1; }
      }
      p -= 2; n -= 2;
    }
    this.mål = { p, n, e };
    this.beregnSkaller();
    this.glimtTid = 0.6;
    this.bølgeTid = 1;
    return { p, n, e };
  }

  // Skyder en lille partikel ud med en lysende hale
  skyd(slags, fra) {
    const farver = {
      elektron: new THREE.Color(1.3, 3.4, 4.2),
      positron: new THREE.Color(4.2, 1.0, 3.4),
      neutrino: new THREE.Color(0.9, 0.9, 1.0),
      antineutrino: new THREE.Color(0.9, 0.9, 1.0),
    };
    const farve = farver[slags];
    const spøgelse = slags.endsWith('neutrino');
    const ud = fra.lengthSq() > 0.01 ? fra.clone().normalize() : new THREE.Vector3().randomDirection();
    const retning = ud.add(new THREE.Vector3().randomDirection().multiplyScalar(0.6)).normalize();
    const kugle = new THREE.Mesh(this.eGeo, new THREE.MeshBasicMaterial({ color: farve, transparent: true }));
    kugle.scale.setScalar(spøgelse ? 0.45 : 1.2);
    kugle.position.copy(fra);
    const halePunkter = 18;
    const haleGeo = new THREE.BufferGeometry();
    haleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(halePunkter * 3), 3));
    const hale = new THREE.Line(haleGeo, new THREE.LineBasicMaterial({
      color: farve, transparent: true, opacity: spøgelse ? 0.25 : 0.8, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    hale.frustumCulled = false;
    const historik = Array.from({ length: halePunkter }, () => fra.clone());
    this.gruppe.add(kugle, hale);
    this.skud.push({ kugle, hale, historik, fart: retning.multiplyScalar(spøgelse ? 46 : 30), liv: 1.8 });
  }

  // ---------- Kernen trækker sammen, og partiklerne skubber hinanden væk ----------
  kernefysik(dt) {
    const aktive = this.nukleoner.filter((k) => !k.ud);
    const dæmp = Math.exp(-dt * 5);
    const kanten = kerneRadius(this.mål.p + this.mål.n) + 0.6;
    for (const k of aktive) {
      const l = k.pos.length();
      if (k.påVej && l < kanten) k.påVej = false;
      if (l > 0.0001) k.fart.addScaledVector(k.pos, (-34 * dt) / l);
      if (!k.påVej) k.fart.multiplyScalar(dæmp);
      k.pos.addScaledVector(k.fart, dt);
    }
    // Overlap rettes ved at skubbe dem lidt fra hinanden (to gange for at det bliver pænt)
    const d = 2 * R * 0.97;
    const d2 = d * d;
    for (let gang = 0; gang < 2; gang++) {
      for (let i = 0; i < aktive.length; i++) {
        const a = aktive[i].pos;
        for (let j = i + 1; j < aktive.length; j++) {
          const b = aktive[j].pos;
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const l2 = dx * dx + dy * dy + dz * dz;
          if (l2 >= d2 || aktive[i].påVej || aktive[j].påVej) continue;
          if (l2 < 1e-8) {
            a.x += (Math.random() - 0.5) * 0.1;
            continue;
          }
          const l = Math.sqrt(l2);
          const skub = ((d - l) / l) * 0.4;
          a.x += dx * skub; a.y += dy * skub; a.z += dz * skub;
          b.x -= dx * skub; b.y -= dy * skub; b.z -= dz * skub;
        }
      }
    }
  }

  // Et lille festfyrværkeri, når en opgave er klaret
  fejr(farve = 0xffd43b) {
    const antal = LAV_KVALITET ? 160 : 320;
    const pos = new Float32Array(antal * 3);
    const farter = [];
    for (let i = 0; i < antal; i++) {
      farter.push(new THREE.Vector3().randomDirection().multiplyScalar(6 + Math.random() * 14));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.5, map: this.prik, color: new THREE.Color(farve).multiplyScalar(2.5), transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const punkter = new THREE.Points(geo, mat);
    this.gruppe.add(punkter);
    this.fester.push({ punkter, farter, liv: 1.6 });
  }

  // ---------- Hvert billede ----------
  opdater(dt) {
    this.tid += dt;
    this.tidUniform.value = this.tid;
    let ekstraRyst = 0;
    if (this.henfaldVenter) {
      const v = this.henfaldVenter;
      v.tid -= dt;
      ekstraRyst = 0.25 * (1 - Math.max(0, v.tid) / 0.8);
      if (v.tid <= 0) {
        this.henfaldVenter = null;
        const ny = this.udførHenfald(v.måde);
        v.færdig?.(ny);
      }
    }
    this.nærmerSigMål();
    this.kernefysik(dt);

    // Ustabile kerner ryster
    const rystStyrke = ({ ustabil: 0.05, meget: 0.1, straks: 0.16, næsten: 0.015 }[this.status] || 0) + ekstraRyst;

    // Er der flere kugler, end der er plads til (fx "Ryd" og så straks et tungt grundstof),
    // forsvinder dem, der er på vej ud, med det samme
    let antalP = 0;
    for (const k of this.nukleoner) if (k.type === 'p') antalP++;
    if (antalP > PLADS_P || this.nukleoner.length - antalP > PLADS_N) this.nukleoner = this.nukleoner.filter((k) => !k.ud);
    if (this.elektroner.length > PLADS_E) this.elektroner = this.elektroner.filter((e) => !e.ud);
    let ip = 0, iN = 0;
    for (const k of this.nukleoner) {
      if (k.ud) {
        k.pos.addScaledVector(k.fart, dt);
        k.liv -= dt * (k.langsom ? 1 : 1.4);
      } else if (k.vækst < 1) {
        k.vækst = Math.min(1, k.vækst + dt * 3);
      }
      let s = k.ud ? Math.max(0.001, Math.min(1, k.liv)) : k.vækst;
      if (k.puls > 0) {
        s *= 1 + 0.7 * k.puls;
        k.puls = Math.max(0, k.puls - dt * 1.5);
      }
      ryst.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(rystStyrke * 2);
      hjælpV.copy(k.pos).add(ryst);
      hjælpMatrix.compose(hjælpV, hjælpQ, hjælpS.setScalar(s));
      if (k.type === 'p') { if (ip < PLADS_P) this.pMesh.setMatrixAt(ip++, hjælpMatrix); }
      else if (iN < PLADS_N) this.nMesh.setMatrixAt(iN++, hjælpMatrix);
    }
    this.nukleoner = this.nukleoner.filter((k) => !k.ud || k.liv > 0);
    this.pMesh.count = ip;
    this.nMesh.count = iN;
    this.pMesh.instanceMatrix.needsUpdate = true;
    this.nMesh.instanceMatrix.needsUpdate = true;

    // Elektronerne svæver hen til deres plads i ringen
    let ie = 0;
    let plads = 0;
    const blød = 1 - Math.exp(-dt * 6);
    for (const e of this.elektroner) {
      if (e.ud) {
        e.pos.addScaledVector(e.fart, dt);
        e.liv -= dt * 1.5;
      } else {
        if (plads < this.pladser.length) {
          this.pladsPosition(plads, hjælpV);
          if (e.ny) { e.pos.copy(hjælpV); e.ny = false; }
          e.pos.lerp(hjælpV, blød);
        }
        plads++;
        if (e.vækst < 1) e.vækst = Math.min(1, e.vækst + dt * 2.5);
      }
      const s = e.ud ? Math.max(0.001, e.liv) : e.vækst;
      hjælpMatrix.compose(e.pos, hjælpQ, hjælpS.setScalar(s));
      if (ie < PLADS_E) this.eMesh.setMatrixAt(ie++, hjælpMatrix);
    }
    // Halerne: gem elektronens seneste positioner og tegn dem som prikker, der bliver svagere
    const halePos = this.haler.geometry.attributes.position.array;
    const haleFarve = this.haler.geometry.attributes.color.array;
    let ih = 0;
    for (const e of this.elektroner) {
      if (ih + HALE_LÆNGDE > PLADS_E * HALE_LÆNGDE) break;
      if (!e.hale) e.hale = Array.from({ length: HALE_LÆNGDE }, () => e.pos.clone());
      const sidste = e.hale.pop();
      e.hale.unshift(sidste.copy(e.pos));
      const styrke = e.ud ? Math.max(0, e.liv) : e.vækst;
      for (let j = 1; j < HALE_LÆNGDE; j++) {
        const v = e.hale[j];
        const f = Math.pow(1 - j / HALE_LÆNGDE, 1.6) * styrke * 0.9;
        halePos[ih * 3] = v.x; halePos[ih * 3 + 1] = v.y; halePos[ih * 3 + 2] = v.z;
        haleFarve[ih * 3] = 0.45 * f; haleFarve[ih * 3 + 1] = 1.5 * f; haleFarve[ih * 3 + 2] = 2.0 * f;
        ih++;
      }
    }
    this.haler.geometry.setDrawRange(0, ih);
    this.haler.geometry.attributes.position.needsUpdate = true;
    this.haler.geometry.attributes.color.needsUpdate = true;

    this.elektroner = this.elektroner.filter((e) => !e.ud || e.liv > 0);
    this.eMesh.count = ie;
    this.eMesh.instanceMatrix.needsUpdate = true;

    // Elektronskyen flimrer: nogle prikker flytter sig hele tiden. Orbitalerne drejer ikke, for deres form har en retning.
    this.opdaterOvergang(dt);
    if (this.skyGruppe.visible) {
      for (const sky of this.skyer) {
        if (sky.orbital) {
          if (sky.form) continue; // formerne står stille
          const flyt = Math.ceil(sky.antal * 0.05);
          for (let i = 0; i < flyt; i++) this.nyOrbitalPrik(sky, Math.floor(Math.random() * sky.antal));
        } else {
          const flyt = Math.ceil(sky.antal * 0.05);
          for (let i = 0; i < flyt; i++) this.nyPrik(sky, Math.floor(Math.random() * sky.antal));
          sky.punkter.rotation.y += dt * 0.2 / sky.nr;
        }
        sky.punkter.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Skæret om kernen
    const a = this.mål.p + this.mål.n;
    const kerneR = kerneRadius(a);
    // Skyggen i kernen (kun i de nye udgaver, og først når der er nogle kugler, der kan skygge for hinanden)
    this.skygge.radius.value = kerneR;
    this.skygge.styrke.value = udgave === 'nu' ? 0 : Math.min(1, Math.max(0, (a - 2) / 10));
    const mat = this.skær.material;
    let opacitet = a > 0 ? 0.1 : 0;
    if (this.status === 'stabil' || this.status === 'næsten') mat.color.setHex(0xffc890);
    else if (this.status === 'straks') {
      mat.color.setHex(0xff4040);
      opacitet = 0.35 + 0.25 * Math.sin(this.tid * 22);
    } else if (a > 0) {
      mat.color.setHex(0x8dff5a);
      opacitet = 0.3 + 0.18 * Math.sin(this.tid * 7);
    }
    mat.opacity += (opacitet - mat.opacity) * Math.min(1, dt * 6);
    const skærStørrelse = kerneR * 4.2 + 1.5;
    this.skær.scale.setScalar(this.skær.scale.x + (skærStørrelse - this.skær.scale.x) * Math.min(1, dt * 4));

    // Partikler fra henfald flyver ud og trækker en hale efter sig
    for (const skud of this.skud) {
      skud.liv -= dt;
      skud.kugle.position.addScaledVector(skud.fart, dt);
      skud.historik.pop();
      skud.historik.unshift(skud.kugle.position.clone());
      const arr = skud.hale.geometry.attributes.position.array;
      skud.historik.forEach((v, i) => { arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z; });
      skud.hale.geometry.attributes.position.needsUpdate = true;
      const synlig = Math.min(1, skud.liv / 0.6);
      skud.kugle.material.opacity = synlig;
      skud.hale.material.opacity = Math.min(skud.hale.material.opacity, synlig);
      if (skud.liv <= 0) {
        this.gruppe.remove(skud.kugle, skud.hale);
        skud.kugle.material.dispose();
        skud.hale.geometry.dispose();
        skud.hale.material.dispose();
      }
    }
    this.skud = this.skud.filter((s) => s.liv > 0);

    // Kernekraftens "lim": lyspunkter midt mellem naboer, der rører hinanden. De blinker svagt.
    const limPos = this.lim.geometry.attributes.position.array;
    const limFarve = this.lim.geometry.attributes.color.array;
    const faste = this.nukleoner.filter((k) => !k.ud && !k.påVej);
    const nabo2 = (2 * R * 1.12) ** 2;
    const uro = this.status === 'straks' ? 0.5 + 0.5 * Math.sin(this.tid * 30) : 1;
    let il = 0;
    for (let i = 0; i < faste.length && il < MAX_LIM; i++) {
      const a = faste[i].pos;
      for (let j = i + 1; j < faste.length && il < MAX_LIM; j++) {
        const b = faste[j].pos;
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        if (dx * dx + dy * dy + dz * dz > nabo2) continue;
        limPos[il * 3] = (a.x + b.x) / 2; limPos[il * 3 + 1] = (a.y + b.y) / 2; limPos[il * 3 + 2] = (a.z + b.z) / 2;
        const f = (0.3 + 0.7 * Math.max(0, Math.sin(this.tid * 4 + il * 1.7)) ** 2) * uro;
        limFarve[il * 3] = 2.0 * f; limFarve[il * 3 + 1] = 1.45 * f; limFarve[il * 3 + 2] = 0.5 * f;
        il++;
      }
    }
    this.lim.geometry.setDrawRange(0, il);
    this.lim.geometry.attributes.position.needsUpdate = true;
    this.lim.geometry.attributes.color.needsUpdate = true;

    // Chokbølge
    if (this.bølgeTid > 0) this.bølgeTid = Math.max(0, this.bølgeTid - dt * 1.1);
    this.bølge.material.opacity = this.bølgeTid * 0.9;
    this.bølge.scale.setScalar(kerneR * 2 + (1 - this.bølgeTid) * (this.størrelse() * 2.4 + 6));

    // Gammaglimt
    if (this.glimtTid > 0) this.glimtTid = Math.max(0, this.glimtTid - dt);
    this.glimt.material.opacity = Math.min(ROLIG ? 0.35 : 0.85, this.glimtTid * 2); // dæmpet ved "reducer bevægelse"
    this.glimt.scale.setScalar(kerneR * 3 + 1.5 + (0.6 - this.glimtTid) * (kerneR * 8 + 4));

    // Festfyrværkeri
    for (const fest of this.fester) {
      fest.liv -= dt;
      const p = fest.punkter.geometry.attributes.position;
      fest.farter.forEach((v, i) => {
        v.multiplyScalar(Math.exp(-dt * 1.2));
        p.array[i * 3] += v.x * dt;
        p.array[i * 3 + 1] += v.y * dt;
        p.array[i * 3 + 2] += v.z * dt;
      });
      p.needsUpdate = true;
      fest.punkter.material.opacity = Math.max(0, fest.liv / 1.6);
      if (fest.liv <= 0) {
        this.gruppe.remove(fest.punkter);
        fest.punkter.geometry.dispose();
        fest.punkter.material.dispose();
      }
    }
    this.fester = this.fester.filter((f) => f.liv > 0);
  }
}
