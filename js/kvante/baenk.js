// Bænken i Kvantefysik (dobbeltspalten): kilden, væggen med de to sprækker (lukkerne og målerens to lamper), bagvæggen
// med prikkerne, kuglerne i luften og vandet med bølgerne (en shader). Modellen og målene står i js/data/kvante.js.
// Alt står i bænkens egne enheder i gruppen. js/kvante.js drejer gruppen, så kameraet ser bænken skråt fra siden.
// Elektronerne og fotonerne tegnes ikke på vej (jeres valg 13. november 2026): Kilden blinker, og en prik tændes.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG } from '../scene3d.js';
import { glød, prikTekstur, blødTekstur } from '../kosmos/faelles.js';
import { KILDE_X, KUGLE_X, L, BAG_HALV, VÆG_HALV, SPRÆKKE_HØJDE, STRIBE_Y, RING_HALV, åbneSprækker, BØLGE_START, PULS_FART, PULS_BREDDE } from '../data/kvante.js';

export const PRIKKER_HØJST = LAV_KVALITET ? 12000 : 30000;
export const KILDE_Y = 0.9; // midten af strålen
export const VÆG_HØJDE = 1.8;
const SPRÆKKE_BUND = 0.2;
const VÆG_TYK = 0.12;
const KUGLER_HØJST = 60;
const KUGLE_FART = 6; // enheder pr. sekund
const BØLGE_FART = 1.3; // vandets bølger, enheder pr. sekund
const TYNGDE = 9;
const VAND_LYS = new THREE.Color(0.45, 0.85, 1); // lyset på bagvæggen fra vandets bølger

// Vandet: plane bølger før væggen og ringe fra de åbne sprækker bagved. Højden h giver lys på toppene.
// Med uBredde > 0 er det en bølgepakke ("Vis bølgen" for elektroner og lys): kun et bånd med længden uBredde bag fronten.
// Navnene i shaderen er kun ASCII (CLAUDE.md).
const VAND_VERT = `
varying vec2 vP;
void main() {
  vP = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const VAND_FRAG = `
uniform float uTid;
uniform float uFront;
uniform float uK;
uniform float uOmega;
uniform vec2 uSpalte;
uniform vec2 uAaben;
uniform float uKilde;
uniform float uStyrke;
uniform vec3 uFarve;
uniform float uBredde;
uniform float uStille;
uniform float uKar;
varying vec2 vP;
float hylster(float r) {
  float t = 1.0 - smoothstep(uFront - 0.25, uFront, r);
  if (uBredde > 0.0) t *= smoothstep(uFront - uBredde - 0.35, uFront - uBredde, r);
  return t;
}
float bolge(float r) {
  return hylster(r) * cos(uK * r - uOmega * uTid);
}
void main() {
  float x = vP.x;
  float z = -vP.y;
  float h = 0.0;
  float synlig = 0.0;
  if (x < 0.0) {
    float r = x - uKilde;
    h = bolge(r) * (uBredde > 0.0 ? 0.75 : 1.0);
    synlig = hylster(r);
  } else {
    float n = 0.0;
    for (int i = 0; i < 2; i++) {
      float aaben = i == 0 ? uAaben.x : uAaben.y;
      if (aaben < 0.5) continue;
      float zs = i == 0 ? uSpalte.x : uSpalte.y;
      float r = length(vec2(x, z - zs));
      // Vejen fra kilden: frem til væggen (-uKilde) og r fra sprækken
      h += bolge(r - uKilde) / sqrt(1.0 + 1.6 * r);
      synlig = max(synlig, hylster(r - uKilde));
      n += 1.0;
    }
    h *= n > 1.5 ? 0.75 : 1.0;
    if (uBredde > 0.0) h *= 1.9; // bølgepakken: ringene bag sprækkerne skal ses lige så tydeligt som bølgen foran
  }
  float top = smoothstep(0.15, 0.95, h);
  float dal = 1.0 - smoothstep(-0.95, -0.15, h);
  vec3 farve = uFarve * (0.35 + 0.9 * top) + vec3(0.6, 0.85, 1.0) * top * top * 0.6;
  // Bølgepakken er usynlig uden for sit bånd. Vandet har et svagt skær over det hele.
  float flade = uBredde > 0.0 ? synlig : 0.25 + 0.75 * synlig;
  float alfa = uStyrke * (0.28 + 0.55 * top + 0.12 * dal) * flade;
  // Det stille vand i karret (bølger i vand, før og mens bølgerne løber): blåt med en svag, langsom glans, så man kan se,
  // hvor vandet er (rettelse 2 efter prøven 28. november 2026: "tryk på vandet. hvilket vand?")
  float glans = 0.5 + 0.5 * sin(x * 2.3 + z * 1.1 + uTid * 0.35) * sin(z * 1.9 - x * 0.7 - uTid * 0.25);
  float aStille = uStille * (0.4 + 0.1 * glans);
  vec3 cStille = uFarve * (0.5 + 0.22 * glans);
  float a = alfa + aStille * (1.0 - alfa);
  vec3 c = (farve * alfa + cStille * aStille * (1.0 - alfa)) / max(a, 0.0001);
  // Karret er lige så bredt som væggen med sprækkerne
  if (uKar > 0.5 && abs(z) > ${VÆG_HALV.toFixed(3)}) a = 0.0;
  gl_FragColor = vec4(c, a);
}`;

// Lyset på bagvæggen, hvor vandets bølger er høje (tidens gennemsnit af to bølger fra sprækkerne). For elektroner og
// lys (uA > 0) ganges med sprækkernes egen bunke (sinc², som js/data/kvante.js), så lyset passer med prikkerne. Med en
// bølgepakke (uBredde > 0) lyser hvert sted, når pakken når derhen, og toner ud bagefter.
const BAG_FRAG = `
uniform float uK;
uniform vec2 uSpalte;
uniform vec2 uAaben;
uniform float uL;
uniform float uStyrke;
uniform vec3 uFarve;
uniform float uA;
uniform float uFront;
uniform float uBredde;
uniform float uKilde;
varying vec2 vP;
void main() {
  float z = vP.x;
  vec2 a = vec2(0.0);
  float n = 0.0;
  float rMin = 100.0;
  for (int i = 0; i < 2; i++) {
    float aaben = i == 0 ? uAaben.x : uAaben.y;
    if (aaben < 0.5) continue;
    float zs = i == 0 ? uSpalte.x : uSpalte.y;
    float r = length(vec2(uL, z - zs));
    rMin = min(rMin, r);
    float f = uK * r;
    a += vec2(cos(f), sin(f)) / sqrt(r);
    n += 1.0;
  }
  float I = dot(a, a) / max(1.0, n * n) * uL;
  if (uA > 0.0) {
    float b = 0.5 * uK * uA * z / length(vec2(z, uL));
    float s = abs(b) < 0.0001 ? 1.0 : sin(b) / b;
    I *= s * s;
  }
  float tid = 1.0;
  if (uBredde > 0.0) {
    float r = rMin - uKilde;
    tid = smoothstep(r - 0.05, r + 0.3, uFront) * (1.0 - smoothstep(r + 0.6, r + uBredde + 0.9, uFront));
  }
  float kant = smoothstep(0.0, 0.25, vP.y + 0.6) * smoothstep(0.0, 0.25, 0.6 - vP.y);
  gl_FragColor = vec4(uFarve * I * 1.4, uStyrke * min(1.0, I) * kant * tid);
}`;

export function lavBænk() {
  const gruppe = new THREE.Group();
  const t = { blink: 0, lampe: [0, 0], lukket: [0, 0], lukMål: [0, 0], måler: 0, målerMål: 0, glimt: 0 };

  // Bordet
  const bordMat = new THREE.MeshStandardMaterial({ color: 0x1b2440, roughness: 0.85, metalness: 0.1 });
  const bord = new THREE.Mesh(new THREE.BoxGeometry(L - KILDE_X + 1.6, 0.16, 2 * BAG_HALV + 1.0), bordMat);
  bord.position.set((L + KILDE_X) / 2, -0.08, 0);
  gruppe.add(bord);
  const kant = new THREE.LineSegments(new THREE.EdgesGeometry(bord.geometry), new THREE.LineBasicMaterial({ color: 0x4f6aa8, transparent: true, opacity: 0.5 }));
  kant.position.copy(bord.position);
  gruppe.add(kant);

  // Kilden: en kasse med et rør, der peger mod væggen, og et lys, der blinker
  const metal = new THREE.MeshStandardMaterial({ color: 0x8ea0c8, roughness: 0.4, metalness: 0.6 });
  const kasse = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.62, 0.62), metal);
  kasse.position.set(KILDE_X - 0.2, KILDE_Y, 0);
  const rør = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.5, 20), metal);
  rør.rotation.z = -Math.PI / 2;
  rør.position.set(KILDE_X + 0.38, KILDE_Y, 0);
  const fod = new THREE.Mesh(new THREE.BoxGeometry(0.5, KILDE_Y - 0.31, 0.4), metal);
  fod.position.set(KILDE_X - 0.2, (KILDE_Y - 0.31) / 2, 0);
  gruppe.add(kasse, rør, fod);
  const blinkLys = glød(0x9fe8ff, 0.9, 0);
  blinkLys.position.set(KUGLE_X, KILDE_Y, 0);
  gruppe.add(blinkLys);

  // Væggen med sprækkerne (bygges igen, når afstanden eller bredden ændres)
  const vægMat = new THREE.MeshStandardMaterial({ color: 0x5a6789, roughness: 0.6, metalness: 0.25 });
  const væg = new THREE.Group();
  gruppe.add(væg);
  const lukMat = new THREE.MeshStandardMaterial({ color: 0xb06a3a, roughness: 0.5, metalness: 0.3, emissive: 0x2a1206 });
  const lukkere = [0, 1].map(() => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 1), lukMat);
    m.visible = false;
    gruppe.add(m);
    return m;
  });
  // Målerens lamper over hver sprække: en lille holder og et lys, der blinker, når elektronen bliver fundet dér
  const lampeMat = [0, 1].map(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.3, 0.35) }));
  const lamper = [0, 1].map((i) => {
    const g = new THREE.Group();
    const holder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), metal);
    const pære = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), lampeMat[i]);
    pære.position.y = 0.1;
    const skær = glød(0xffd25a, 0.7, 0);
    skær.position.y = 0.1;
    g.add(holder, pære, skær);
    g.userData.skær = skær;
    g.visible = false;
    gruppe.add(g);
    return g;
  });
  // Usynlige kasser foran sprækkerne, så et tryk let rammer dem (stråle mod gruppen)
  const trykMat = new THREE.MeshBasicMaterial({ visible: false });
  const trykKasser = [0, 1].map((i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.6, SPRÆKKE_HØJDE + 0.3, 0.5), trykMat);
    m.userData.sprække = i;
    gruppe.add(m);
    return m;
  });
  let mål = { d: 0, a: 0 };
  function bygVæg(d, a) {
    if (mål.d === d && mål.a === a) return;
    mål = { d, a };
    for (const c of [...væg.children]) { c.geometry.dispose(); væg.remove(c); }
    const stykke = (z0, z1, y0, y1) => {
      if (z1 - z0 < 0.001) return;
      const m = new THREE.Mesh(new THREE.BoxGeometry(VÆG_TYK, y1 - y0, z1 - z0), vægMat);
      m.position.set(0, (y0 + y1) / 2, (z0 + z1) / 2);
      væg.add(m);
    };
    const top = SPRÆKKE_BUND + SPRÆKKE_HØJDE;
    stykke(-VÆG_HALV, VÆG_HALV, 0, SPRÆKKE_BUND);
    stykke(-VÆG_HALV, VÆG_HALV, top, VÆG_HØJDE);
    stykke(-VÆG_HALV, -d / 2 - a / 2, SPRÆKKE_BUND, top);
    stykke(-d / 2 + a / 2, d / 2 - a / 2, SPRÆKKE_BUND, top);
    stykke(d / 2 + a / 2, VÆG_HALV, SPRÆKKE_BUND, top);
    const zs = [-d / 2, d / 2];
    for (let i = 0; i < 2; i++) {
      lukkere[i].scale.set(1, SPRÆKKE_HØJDE + 0.04, a + 0.06);
      lukkere[i].position.set(-VÆG_TYK / 2 - 0.03, 0, zs[i]);
      lamper[i].position.set(0, VÆG_HØJDE + 0.06, zs[i]);
      trykKasser[i].position.set(0, SPRÆKKE_BUND + SPRÆKKE_HØJDE / 2, zs[i]);
      trykKasser[i].scale.set(1, 1, Math.max(1, (a + 0.3) / 0.5));
    }
  }

  // Bagvæggen og lyset på den (vandets striber)
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x141a30, roughness: 0.95, metalness: 0 });
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.1, VÆG_HØJDE, 2 * BAG_HALV + 0.2), bagMat);
  bag.position.set(L + 0.05, VÆG_HØJDE / 2, 0);
  gruppe.add(bag);
  const bagLys = new THREE.ShaderMaterial({
    vertexShader: VAND_VERT, fragmentShader: BAG_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uK: { value: 30 }, uSpalte: { value: new THREE.Vector2(-0.5, 0.5) }, uAaben: { value: new THREE.Vector2(1, 1) }, uL: { value: L }, uStyrke: { value: 0 }, uFarve: { value: new THREE.Color(0.45, 0.85, 1) },
      uA: { value: 0 }, uFront: { value: 0 }, uBredde: { value: 0 }, uKilde: { value: BØLGE_START },
    },
  });
  // Fladen ligger i (z, y): x i geometrien er z på bagvæggen, y er højden målt fra midten af striberne
  const bagFlade = new THREE.Mesh(new THREE.PlaneGeometry(2 * BAG_HALV, 1.2), bagLys);
  bagFlade.rotation.y = -Math.PI / 2; // fladens x bliver bænkens z, og den vender mod kilden
  bagFlade.position.set(L - 0.006, 0.9, 0);
  gruppe.add(bagFlade);

  // Vandet: en flade over bordet fra kilden til bagvæggen
  const vandMat = new THREE.ShaderMaterial({
    vertexShader: VAND_VERT, fragmentShader: VAND_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uTid: { value: 0 }, uFront: { value: 0 }, uK: { value: 30 }, uOmega: { value: 30 }, uSpalte: { value: new THREE.Vector2(-0.5, 0.5) },
      uAaben: { value: new THREE.Vector2(1, 1) }, uKilde: { value: BØLGE_START }, uStyrke: { value: 0 }, uFarve: { value: new THREE.Color(0.25, 0.55, 0.95) },
      uBredde: { value: 0 }, uStille: { value: 0 }, uKar: { value: 0 },
    },
  });
  const vandBredde = L - (KILDE_X + 0.6);
  const vand = new THREE.Mesh(new THREE.PlaneGeometry(vandBredde, 2 * BAG_HALV), vandMat);
  vand.rotation.x = -Math.PI / 2; // fladens y peger mod -z
  vand.position.set(KILDE_X + 0.6 + vandBredde / 2, 0.36, 0);
  // Shaderen bruger bænkens x og z: flyt fladens egne koordinater, så vP.x er bænkens x
  vand.geometry.translate(KILDE_X + 0.6 + vandBredde / 2, 0, 0);
  vand.position.x = 0;
  vand.visible = false;
  gruppe.add(vand);

  // Karret med vandet (kun med bølger i vand): en lav kant af glas om vandet og en bølgemaskine (en stang, der vipper op og
  // ned i vandet og laver bølgerne) i stedet for kilden. Et tryk på vandet starter den.
  const kar = new THREE.Group();
  kar.visible = false;
  gruppe.add(kar);
  const glas = new THREE.MeshStandardMaterial({ color: 0x8cc4ff, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.32, depthWrite: false });
  const KAR_X0 = BØLGE_START - 0.08;
  const KAR_HØJDE = 0.46;
  const karKant = (bx, bz, x, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(bx, KAR_HØJDE, bz), glas);
    m.position.set(x, KAR_HØJDE / 2, z);
    m.renderOrder = 1;
    kar.add(m);
  };
  karKant(0.05, 2 * VÆG_HALV + 0.1, KAR_X0, 0);
  for (const side of [-1, 1]) karKant(L - KAR_X0, 0.05, (KAR_X0 + L) / 2, side * (VÆG_HALV + 0.05));
  const stang = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2 * VÆG_HALV - 0.1, 16), metal);
  stang.rotation.x = Math.PI / 2;
  stang.position.set(BØLGE_START + 0.04, 0.4, 0);
  const stangArme = [-1, 1].map((side) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), metal);
    arm.position.set(BØLGE_START + 0.04, 0.62, side * (VÆG_HALV - 0.2));
    return arm;
  });
  kar.add(stang, ...stangArme);
  const kilden = [kasse, rør, fod, blinkLys];

  // Ringen, der viser, hvor man skal trykke ("Tryk på vandet"): en flad ring på vandet foran væggen, der pulserer
  const MÆRKE = new THREE.Vector3(-1.9, 0.37, 0);
  const mærke = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.42, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.05, 0.35), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  mærke.rotation.x = -Math.PI / 2;
  mærke.position.copy(MÆRKE);
  mærke.renderOrder = 2;
  mærke.visible = false;
  gruppe.add(mærke);
  // bredde > 0: en bølgepakke ("Vis bølgen"), der slukker sig selv, når den er løbet forbi bagvæggen (PULS_SLUT)
  const vandT = { tændt: false, front: 0, styrke: 0, mål: 0, farve: new THREE.Color(0.25, 0.55, 0.95), bredde: 0, fart: BØLGE_FART, stille: 0 };
  const PULS_FORBI = -BØLGE_START + L + PULS_BREDDE + 0.9; // lyset på midten af bagvæggen er tonet ud (så må en ny pakke starte)
  const PULS_SLUT = -BØLGE_START + Math.hypot(L, BAG_HALV + 1) + PULS_BREDDE + 1; // også lyset på kanten er tonet ud

  // Et glimt, hvor elektronen med den tegnede bølgepakke lander ("Vis bølgen"), så man ser, at den findes ét sted
  // En flad skive på bagvæggens flade (en sprite ville blive skåret over af væggen)
  const glimt = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
    map: blødTekstur(), color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  glimt.rotation.y = -Math.PI / 2; // vender mod kilden som bagvæggen
  glimt.renderOrder = 3;
  glimt.visible = false;
  gruppe.add(glimt);

  // Prikkerne på bagvæggen
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(PRIKKER_HØJST * 3);
  const farver = new Float32Array(PRIKKER_HØJST * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(farver, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setDrawRange(0, 0);
  const prikMat = new THREE.PointsMaterial({ size: 0.05, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const prikker = new THREE.Points(geo, prikMat);
  prikker.frustumCulled = false;
  gruppe.add(prikker);
  let antal = 0; // så mange er landet i alt (de ældste tegnes over, når der er flere end PRIKKER_HØJST)
  const zer = []; // hvor de er landet (z), til testene og tælleren i turen
  let ændretFra = PRIKKER_HØJST;
  let ændretTil = -1;

  function prik(z, y, farve, størrelse = 1) {
    const i = antal % PRIKKER_HØJST;
    pos[i * 3] = L - 0.012;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    farver[i * 3] = farve[0] * størrelse;
    farver[i * 3 + 1] = farve[1] * størrelse;
    farver[i * 3 + 2] = farve[2] * størrelse;
    ændretFra = Math.min(ændretFra, i);
    ændretTil = Math.max(ændretTil, i);
    antal++;
    zer.push(z);
    geo.setDrawRange(0, Math.min(antal, PRIKKER_HØJST));
  }
  function ryd() {
    antal = 0;
    zer.length = 0;
    geo.setDrawRange(0, 0);
    for (const k of kugler) k.levende = false;
    kugleMesh.count = 0;
  }

  // Kuglerne i luften
  const kugleMat = new THREE.MeshStandardMaterial({ color: 0xd8dde8, roughness: 0.35, metalness: 0.7 });
  const kugleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 14, 10), kugleMat, KUGLER_HØJST);
  // Fodbolden ("Større …"): hvid med 12 sorte femkanter, tegnet som pletter i hjørnerne af et ikosaeder
  let boldMat = null;
  function lavBoldMat() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#f4f4f0';
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = '#16181d';
    const pletter = [[0, 90], [0, -90]];
    for (let i = 0; i < 5; i++) pletter.push([i * 72, 26.57], [i * 72 + 36, -26.57]);
    for (const [lon, lat] of pletter) {
      for (const dx of [-128, 0, 128]) {
        g.beginPath();
        g.ellipse(((lon + 180) / 360) * 128 + dx, ((90 - lat) / 180) * 64, 9 / Math.max(0.35, Math.cos((lat * Math.PI) / 180)), 7, 0, 0, Math.PI * 2);
        g.fill();
      }
    }
    const tekstur = new THREE.CanvasTexture(c);
    tekstur.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: tekstur, roughness: 0.75, metalness: 0 });
  }
  kugleMesh.count = 0;
  kugleMesh.frustumCulled = false;
  gruppe.add(kugleMesh);
  const kugler = Array.from({ length: KUGLER_HØJST }, () => ({ levende: false, p: new THREE.Vector3(), v: new THREE.Vector3(), gennem: false, mål: null, alder: 0 }));
  const m4 = new THREE.Matrix4();
  // Én kugle mod et punkt (z, y) i væggens plan. gennem: den flyver gennem en åben sprække og lander (z, y) · f bagved.
  function kast(sigte, landet) {
    const k = kugler.find((x) => !x.levende);
    if (!k) return false;
    k.levende = true;
    k.alder = 0;
    k.p.set(KUGLE_X, KILDE_Y, 0);
    k.v.set(-k.p.x, sigte.y - KILDE_Y, sigte.z).setLength(KUGLE_FART);
    k.gennem = sigte.gennem;
    k.mål = sigte.land;
    k.landet = landet;
    t.blink = Math.max(t.blink, 0.6);
    return true;
  }
  function flytKugler(dt) {
    let n = 0;
    for (const k of kugler) {
      if (!k.levende) continue;
      k.alder += dt;
      const førX = k.p.x;
      if (k.gennem || k.p.x < -VÆG_TYK / 2) k.p.addScaledVector(k.v, dt);
      else {
        k.v.y -= TYNGDE * dt;
        k.p.addScaledVector(k.v, dt);
      }
      // Rammer væggen (ikke en åben sprække): prelle af og falde ned
      if (!k.gennem && førX < -VÆG_TYK / 2 && k.p.x >= -VÆG_TYK / 2 && k.v.x > 0) {
        k.p.x = -VÆG_TYK / 2;
        k.v.set(-0.25 * k.v.x, 0.3, 0.15 * k.v.z);
      }
      if (k.p.y < 0.07) { k.p.y = 0.07; k.v.set(k.v.x * 0.6, Math.abs(k.v.y) * 0.3, k.v.z * 0.6); }
      if (k.gennem && k.p.x >= L - 0.08) {
        k.levende = false;
        k.landet?.(k.mål);
        continue;
      }
      if (!k.gennem && k.alder > 1.6) { k.levende = false; continue; }
      m4.makeTranslation(k.p.x, k.p.y, k.p.z);
      kugleMesh.setMatrixAt(n++, m4);
    }
    kugleMesh.count = n;
    kugleMesh.instanceMatrix.needsUpdate = true;
  }
  const iLuften = () => kugler.filter((k) => k.levende).length;

  // Ringen i turens trin 4: en aflang ring om et mørkt sted på bagvæggen (striberne står lodret, så den går hele vejen op)
  const ring = (() => {
    const yd = (STRIBE_Y[1] - STRIBE_Y[0]) / 2 + 0.1;
    const r = RING_HALV + 0.03;
    const form = (rr) => {
      const s = new THREE.Shape();
      s.absarc(0, yd - r, rr, 0, Math.PI, false);
      s.absarc(0, -yd + r, rr, Math.PI, 2 * Math.PI, false);
      s.closePath();
      return s;
    };
    const ydre = form(r);
    ydre.holes.push(new THREE.Path(form(r - 0.04).getPoints(48)));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(ydre, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.25, 0.35), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.y = -Math.PI / 2; // formens x bliver bænkens z, og fladen vender mod kilden
    m.position.set(L - 0.03, (STRIBE_Y[0] + STRIBE_Y[1]) / 2, 0);
    m.visible = false;
    m.renderOrder = 2;
    gruppe.add(m);
    return m;
  })();

  // ---------- Hvert billede ----------
  function opdater(dt, tid) {
    flytKugler(dt);
    // Lukkerne glider ned over sprækken (og op igen)
    for (let i = 0; i < 2; i++) {
      t.lukket[i] += (t.lukMål[i] - t.lukket[i]) * (ROLIG ? 1 : 1 - Math.exp(-dt * 10));
      const s = t.lukket[i];
      lukkere[i].visible = s > 0.01;
      lukkere[i].scale.y = Math.max(0.001, (SPRÆKKE_HØJDE + 0.04) * s);
      lukkere[i].position.y = SPRÆKKE_BUND + SPRÆKKE_HØJDE + 0.02 - lukkere[i].scale.y / 2;
    }
    // Målerens lamper
    t.måler += (t.målerMål - t.måler) * (1 - Math.exp(-dt * 8));
    for (let i = 0; i < 2; i++) {
      lamper[i].visible = t.måler > 0.02;
      lamper[i].scale.setScalar(Math.max(0.01, t.måler));
      t.lampe[i] = Math.max(0, t.lampe[i] - dt * (ROLIG ? 3 : 6));
      const l = t.lampe[i];
      lampeMat[i].color.setRGB(0.25 + 1.6 * l, 0.3 + 1.3 * l, 0.35 + 0.2 * l);
      lamper[i].userData.skær.material.opacity = l;
    }
    t.blink = Math.max(0, t.blink - dt * (ROLIG ? 3 : 7));
    blinkLys.material.opacity = t.blink;
    t.glimt = Math.max(0, t.glimt - dt * 0.9);
    glimt.visible = t.glimt > 0.01;
    glimt.material.opacity = Math.min(1, t.glimt * 1.6);
    glimt.scale.setScalar(0.3 + 0.6 * t.glimt);
    // Vandet (eller bølgepakken) og det stille vand i karret
    vandT.styrke += (vandT.mål - vandT.styrke) * (1 - Math.exp(-dt * (vandT.bredde ? 12 : 3)));
    vandT.stille += ((kar.visible ? 1 : 0) - vandT.stille) * (1 - Math.exp(-dt * 6));
    vand.visible = vandT.styrke > 0.01 || vandT.stille > 0.01;
    // Bølgemaskinen vipper op og ned, mens bølgerne løber (i takt med bølgerne)
    stang.position.y = 0.4 + (vandT.tændt && !vandT.bredde ? 0.035 * Math.sin(vandMat.uniforms.uK.value * vandT.fart * tid) : 0);
    for (const arm of stangArme) arm.position.y = stang.position.y + 0.22;
    if (mærke.visible) {
      const p = ROLIG ? 0.5 : 0.5 + 0.5 * Math.sin(tid * 4);
      mærke.scale.setScalar(1 + 0.18 * p);
      mærke.material.opacity = 0.55 + 0.45 * (1 - p);
    }
    if (vandT.tændt) vandT.front += vandT.fart * dt;
    if (vandT.tændt && vandT.bredde && vandT.front > PULS_SLUT) {
      vandT.tændt = false;
      vandT.mål = 0;
    }
    const u = vandMat.uniforms;
    u.uTid.value = tid;
    u.uFront.value = vandT.front;
    u.uStyrke.value = vandT.styrke;
    u.uFarve.value.copy(vandT.farve);
    u.uBredde.value = vandT.bredde;
    u.uStille.value = vandT.stille;
    u.uKar.value = kar.visible ? 1 : 0;
    u.uOmega.value = u.uK.value * vandT.fart; // bølgetoppene følger fronten
    // Bagvæggen lyser, når bølgerne er nået derhen (bølgepakken: hvert sted for sig, i shaderen)
    const b = bagLys.uniforms;
    b.uFront.value = vandT.front;
    b.uBredde.value = vandT.bredde;
    b.uFarve.value.copy(vandT.bredde ? vandT.farve : VAND_LYS);
    const nået = vandT.front + BØLGE_START - L - 0.5;
    b.uStyrke.value = vandT.bredde ? vandT.styrke : vandT.styrke * Math.min(1, Math.max(0, nået));
    if (ændretTil >= ændretFra) {
      for (const navn of ['position', 'color']) {
        const a = geo.attributes[navn];
        a.clearUpdateRanges();
        a.addUpdateRange(ændretFra * 3, (ændretTil - ændretFra + 1) * 3);
        a.needsUpdate = true;
      }
      ændretFra = PRIKKER_HØJST;
      ændretTil = -1;
    }
  }

  // Sprækkerne, vandets bølgelængde og hvilke sprækker der er åbne (fra delen). kuvert: sprækkernes bredde, så lyset på
  // bagvæggen får den samme brede bunke som prikkerne (elektroner og lys), eller 0 (vandet)
  function sæt({ d, a, sprækker, λ, måler, kuvert = 0, straks = false }) {
    bygVæg(d, a);
    const åbne = åbneSprækker(sprækker, d);
    t.lukMål = [åbne.includes(-d / 2) ? 0 : 1, åbne.includes(d / 2) ? 0 : 1];
    if (straks) t.lukket = [...t.lukMål];
    t.målerMål = måler ? 1 : 0;
    if (straks) t.måler = t.målerMål;
    for (const m of [vandMat, bagLys]) {
      m.uniforms.uK.value = (2 * Math.PI) / λ;
      m.uniforms.uSpalte.value.set(-d / 2, d / 2);
      m.uniforms.uAaben.value.set(1 - t.lukMål[0], 1 - t.lukMål[1]);
    }
    bagLys.uniforms.uA.value = kuvert;
  }

  return {
    gruppe,
    t,
    trykKasser,
    opdater,
    sæt,
    prik,
    ryd,
    kast,
    iLuften,
    // Kuglerne i luften ligner fodbolde (true) eller metalkugler (false)
    bold(ja) {
      if (ja) boldMat ??= lavBoldMat();
      kugleMesh.material = ja ? boldMat : kugleMat;
    },
    boldVist: () => kugleMesh.material === boldMat && boldMat != null,
    antal: () => antal,
    // Prikkernes størrelse (kuglernes mærker er større end elektronernes prikker)
    prikStørrelse: (x) => { prikMat.size = x; },
    zer: () => zer,
    blink: () => { t.blink = 1; },
    glimt: (z, y) => {
      glimt.position.set(L - 0.02, y, z);
      t.glimt = 1;
    },
    lampe: (i) => { t.lampe[i] = 1; },
    // Ringen om et mørkt sted (z) i turens trin 4, eller væk (null). Tallet i ringen står på skiltet (js/kvante/skilt.js).
    ring(z) {
      ring.visible = z != null;
      if (z != null) ring.position.z = z;
    },
    ringVist: () => ring.visible,
    // Vandet: tændt (bølgerne løber ud fra kilden og bliver ved), styrke og farve
    vand(tændt, styrke = 1, farve = null) {
      if (tændt && (!vandT.tændt || vandT.bredde)) vandT.front = 0;
      vandT.tændt = tændt;
      vandT.mål = tændt ? styrke : 0;
      vandT.bredde = 0;
      vandT.fart = BØLGE_FART;
      if (farve) vandT.farve.setRGB(...farve);
    },
    // Én elektrons bølgepakke ("Vis bølgen"): fra rørets munding, gennem sprækkerne og ud til bagvæggen
    puls(farve, styrke = 0.9) {
      vandT.tændt = true;
      vandT.front = 0;
      vandT.bredde = PULS_BREDDE;
      vandT.fart = PULS_FART;
      vandT.mål = styrke;
      vandT.farve.setRGB(...farve);
    },
    // En bølgepakke er på vej og er ikke nået forbi bagvæggen endnu (så venter den næste)
    pulsOptaget: () => vandT.tændt && vandT.bredde > 0 && vandT.front < PULS_FORBI,
    pulsKører: () => vandT.tændt && vandT.bredde > 0,
    vandFront: () => vandT.front,
    vandTændt: () => vandT.tændt,
    // Bølger i vand: karret med det stille vand og bølgemaskinen i stedet for kilden (true), eller kilden (false)
    kar(ja) {
      kar.visible = ja;
      for (const m of kilden) m.visible = !ja;
      if (!ja) mærke.visible = false;
    },
    karVist: () => kar.visible,
    // Ringen på vandet, der viser, hvor man trykker, og punktet over den (til skiltet "Tryk på vandet")
    mærke(ja) { mærke.visible = ja && kar.visible; },
    mærkeVist: () => mærke.visible,
    mærkeTop: (v) => gruppe.localToWorld(v.set(MÆRKE.x, MÆRKE.y + 0.12, MÆRKE.z)),
    // Til at stille kameraet: bænkens kasse i gruppens koordinater
    kasse: () => new THREE.Box3(new THREE.Vector3(KILDE_X - 0.6, 0, -BAG_HALV - 0.3), new THREE.Vector3(L + 0.2, VÆG_HØJDE + 0.25, BAG_HALV + 0.3)),
  };
}
