// Bordet i Ild (docs/drejebog-ild.md, afsnit 2): et stearinlys på et underlag, der ikke kan brænde, en gasbrænder med
// en luftring, værktøjerne (tændstik og ske) og det, man slukker med (glas, lysslukker og en sky af CO₂), og røgen.
// Kun tegningen og bevægelserne står her. Hvad der sker (tænd, sluk, dug og sod), styrer js/ild.js.
// Flammerne er den fælles flamme fra js/flamme.js. Alt bevæger sig med dt, så det står stille under pause.

import * as THREE from 'three';
import { LAV_KVALITET, ROLIG, verden, lavPrikTekstur } from '../scene3d.js';
import { lavFlamme } from '../flamme.js';

export const BORD_Y = -3.4; // bordpladen
export const LYS_TOP = 0.2; // stearinlysets top
export const VÆGE = new THREE.Vector3(0, 0.62, 0); // vægens spids
export const FOD = 0.42; // flammens fod (vægen står inde i den mørke kegle)
export const LYS_FLAMME = { bredde: 0.48, højde: 2.5 }; // ca. 3 cm høj, når lyset er ca. 2 cm bredt
export const BRÆNDER_TOP = 0.6; // gasbrænderens rør
export const BRÆNDER_FLAMME = { bredde: 0.34, højde: 3.0 };
export const HVILE = { tændstik: new THREE.Vector3(2.7, 1.4, 0.4), ske: new THREE.Vector3(2.8, 3.9, 0.4) }; // værktøjernes plads, når de tages frem
const RØG_MAX = LAV_KVALITET ? 70 : 120;
const CO2_MAX = LAV_KVALITET ? 50 : 90;

// ---------- Partikler (røg og CO₂): punkter med en størrelse i verdensenheder og en alfa pr. punkt ----------
function lavPartikler(max, farve, blanding = THREE.NormalBlending) {
  const pos = new Float32Array(max * 3);
  const alfa = new Float32Array(max);
  const str = new Float32Array(max);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAlfa', new THREE.BufferAttribute(alfa, 1));
  geo.setAttribute('aStr', new THREE.BufferAttribute(str, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uFarve: { value: new THREE.Color(farve) }, uH: { value: 800 } },
    vertexShader: /* glsl */ `
      uniform float uH;
      attribute float aAlfa;
      attribute float aStr;
      varying float vAlfa;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aStr * projectionMatrix[1][1] * uH * 0.5 / max(-mv.z, 0.1);
        vAlfa = aAlfa;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uFarve;
      varying float vAlfa;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = 1.0 - smoothstep(0.2, 1.0, d);
        gl_FragColor = vec4(uFarve, a * a * vAlfa);
      }`,
    transparent: true,
    depthWrite: false,
    blending: blanding,
  });
  const punkter = new THREE.Points(geo, mat);
  punkter.frustumCulled = false;
  punkter.renderOrder = 6;
  // Hver partikel: plads, fart, alder, liv, størrelse fra og til, og et tal til svajet
  const ps = Array.from({ length: max }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), alder: 0, liv: 0, fra: 0, til: 0, frø: 0, lys: 0 }));
  let næste = 0;
  return {
    punkter,
    ps,
    ny(p, v, liv, fra, til, lys) {
      const x = ps[næste];
      næste = (næste + 1) % max;
      x.p.copy(p);
      x.v.copy(v);
      x.alder = 0;
      x.liv = liv;
      x.fra = fra;
      x.til = til;
      x.lys = lys;
      x.frø = Math.random() * 6.28;
    },
    // flyt(x, dt): partiklens egen bevægelse
    opdater(dt, flyt) {
      for (let i = 0; i < max; i++) {
        const x = ps[i];
        if (x.alder < x.liv) {
          x.alder += dt;
          flyt(x, dt);
        }
        const t = Math.min(1, x.alder / Math.max(x.liv, 1e-3));
        const levende = x.alder < x.liv;
        alfa[i] = levende ? x.lys * (1 - t) * Math.min(1, x.alder / 0.18) : 0;
        str[i] = x.fra + (x.til - x.fra) * Math.sqrt(t);
        pos[i * 3] = x.p.x;
        pos[i * 3 + 1] = x.p.y;
        pos[i * 3 + 2] = x.p.z;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aAlfa.needsUpdate = true;
      geo.attributes.aStr.needsUpdate = true;
      mat.uniforms.uH.value = verden.renderer.getDrawingBufferSize(tPx).y;
    },
    ryd() {
      for (const x of ps) x.alder = x.liv = 0;
    },
    levende: () => ps.filter((x) => x.alder < x.liv).length,
    frigiv() {
      geo.dispose();
      mat.dispose();
    },
  };
}
const tPx = new THREE.Vector2();

// ---------- Selve bordet ----------
export function lavBord() {
  const gruppe = new THREE.Group();
  const geoer = [];
  const mater = [];
  const net = (geo, mat) => {
    geoer.push(geo);
    if (!mater.includes(mat)) mater.push(mat);
    return new THREE.Mesh(geo, mat);
  };

  // Bordpladen: mørkt træ
  const træ = new THREE.MeshStandardMaterial({ color: 0x24170f, roughness: 0.85, metalness: 0 });
  const plade = net(new THREE.BoxGeometry(26, 0.6, 12), træ);
  plade.position.set(0, BORD_Y - 0.3, -1.5);
  gruppe.add(plade);

  // Stearinlyset på et underlag af metal (et underlag, der ikke kan brænde)
  const lys = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x6f727a, roughness: 0.45, metalness: 0.8, envMapIntensity: 0.5 });
  const underlag = net(new THREE.CylinderGeometry(1.25, 1.35, 0.14, LAV_KVALITET ? 32 : 48), metal);
  underlag.position.y = BORD_Y + 0.07;
  const stearin = new THREE.MeshStandardMaterial({ color: 0x9c9480, roughness: 0.55, metalness: 0, emissive: 0x2a1404, emissiveIntensity: 0 });
  const H = LYS_TOP - (BORD_Y + 0.14);
  const krop = net(new THREE.CylinderGeometry(0.85, 0.85, H, LAV_KVALITET ? 32 : 48), stearin);
  krop.position.y = BORD_Y + 0.14 + H / 2;
  // Den smeltede stearin øverst: en lidt blankere skive
  const sø = net(new THREE.CircleGeometry(0.7, 32), new THREE.MeshStandardMaterial({ color: 0xb9ae94, roughness: 0.15, metalness: 0, transparent: true, opacity: 0 }));
  sø.rotation.x = -Math.PI / 2;
  sø.position.y = LYS_TOP + 0.005;
  // Vægen: en tynd, mørk tråd med en spids, der gløder
  const vægeMat = new THREE.MeshStandardMaterial({ color: 0x1c1712, roughness: 0.9 });
  const væge = net(new THREE.CylinderGeometry(0.035, 0.045, VÆGE.y - LYS_TOP, 8), vægeMat);
  væge.position.y = (VÆGE.y + LYS_TOP) / 2;
  væge.rotation.z = -0.06;
  const glødMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 0.7, 0.15), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const glød = net(new THREE.SphereGeometry(0.06, 10, 8), glødMat);
  glød.position.copy(VÆGE).add(new THREE.Vector3(0.012, -0.02, 0));
  lys.add(underlag, krop, sø, væge, glød);
  const lysFlamme = lavFlamme({ ...LYS_FLAMME, lys: true });
  lysFlamme.gruppe.position.set(0, FOD, 0);
  lys.add(lysFlamme.gruppe);
  gruppe.add(lys);

  // Gasbrænderen: fod, rør, en luftring med to huller og en slange
  const brænder = new THREE.Group();
  const stål = new THREE.MeshStandardMaterial({ color: 0x6f747b, roughness: 0.45, metalness: 0.8, envMapIntensity: 0.5 });
  const fod = net(new THREE.CylinderGeometry(0.85, 1.05, 0.32, 40), stål);
  fod.position.y = BORD_Y + 0.16;
  const rørL = BRÆNDER_TOP - (BORD_Y + 0.32);
  const rør = net(new THREE.CylinderGeometry(0.3, 0.3, rørL, 28, 1, true), stål);
  rør.position.y = BORD_Y + 0.32 + rørL / 2;
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xb08a3a, roughness: 0.35, metalness: 0.9 });
  const luftring = new THREE.Group();
  const ring = net(new THREE.CylinderGeometry(0.36, 0.36, 0.55, 28), ringMat);
  luftring.add(ring);
  const hulMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const huller = [];
  for (const v of [0, Math.PI]) {
    const hul = net(new THREE.BoxGeometry(0.2, 0.3, 0.02), hulMat);
    hul.position.set(Math.sin(v) * 0.365, 0, Math.cos(v) * 0.365);
    hul.rotation.y = v;
    luftring.add(hul);
    huller.push(hul);
  }
  luftring.position.y = BORD_Y + 0.85;
  const slange = net(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.7, BORD_Y + 0.18, 0), new THREE.Vector3(-2.2, BORD_Y + 0.2, -0.4), new THREE.Vector3(-5, BORD_Y + 0.2, -1.6), new THREE.Vector3(-9, BORD_Y + 0.2, -3),
  ]), 30, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xb4471f, roughness: 0.6 }));
  brænder.add(fod, rør, luftring, slange);
  const brænderFlamme = lavFlamme({ ...BRÆNDER_FLAMME, lys: true });
  brænderFlamme.gruppe.position.set(0, BRÆNDER_TOP + 0.02, 0);
  brænder.add(brænderFlamme.gruppe);
  gruppe.add(brænder);

  // Tændstikken: hovedet står i gruppens (0, 0, 0), pinden går ned mod højre. Flammen er den fælles flamme.
  const tændstik = new THREE.Group();
  const pind = net(new THREE.BoxGeometry(0.09, 2.3, 0.09), new THREE.MeshStandardMaterial({ color: 0xc9a46a, roughness: 0.8 }));
  pind.position.set(0, -1.15, 0);
  const hovedMat = new THREE.MeshStandardMaterial({ color: 0x8a1a10, roughness: 0.7 });
  const hoved = net(new THREE.SphereGeometry(0.1, 12, 10), hovedMat);
  hoved.scale.set(1, 1.4, 1);
  const pindGruppe = new THREE.Group();
  pindGruppe.add(pind, hoved);
  pindGruppe.rotation.z = 0.42;
  tændstik.add(pindGruppe);
  const tændstikFlamme = lavFlamme({ bredde: 0.15, højde: 0.65 });
  tændstikFlamme.gruppe.position.set(0, -0.05, 0);
  tændstik.add(tændstikFlamme.gruppe);
  tændstik.visible = false;
  gruppe.add(tændstik);

  // Skeen: skålen står i gruppens (0, 0, 0) med bunden nedad, skaftet går op mod højre
  const ske = new THREE.Group();
  const skeMat = new THREE.MeshStandardMaterial({ color: 0xa9adb4, roughness: 0.3, metalness: 0.9, envMapIntensity: 0.6 });
  const skål = net(new THREE.SphereGeometry(0.5, 24, 12), skeMat);
  skål.scale.set(1, 0.24, 0.72);
  const skaft = net(new THREE.BoxGeometry(2.6, 0.07, 0.16), skeMat);
  skaft.position.set(1.65, 0.32, 0);
  skaft.rotation.z = 0.25;
  ske.add(skål, skaft);
  ske.visible = false;
  gruppe.add(ske);
  const SKE_REN = new THREE.Color(0xa9adb4);
  const SKE_DUG = new THREE.Color(0x9aa3ad);
  const SKE_SOD = new THREE.Color(0x0b0b0c);

  // Glasset (vendt på hovedet over lyset)
  const glasMat = new THREE.MeshStandardMaterial({ color: 0x9fc4ee, roughness: 0.35, metalness: 0, envMapIntensity: 0.25, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const glasH = 5.2;
  const glas = new THREE.Group();
  glas.add(net(new THREE.CylinderGeometry(1.32, 1.22, glasH, 40, 1, true), glasMat));
  const bund = net(new THREE.CircleGeometry(1.32, 40), glasMat);
  bund.rotation.x = -Math.PI / 2;
  bund.position.y = glasH / 2;
  glas.add(bund);
  glas.visible = false;
  gruppe.add(glas);
  const GLAS_NEDE = BORD_Y + 0.14 + glasH / 2;
  const GLAS_OPPE = GLAS_NEDE + 6.5;

  // Lysslukkeren: en lille kegle på et langt skaft
  const slukker = new THREE.Group();
  const kegle = net(new THREE.ConeGeometry(0.5, 0.85, 24, 1, true), metal);
  const skaft2 = net(new THREE.BoxGeometry(3.2, 0.07, 0.07), metal);
  skaft2.position.set(1.7, 0.05, 0);
  skaft2.rotation.z = 0.12;
  slukker.add(kegle, skaft2);
  slukker.visible = false;
  gruppe.add(slukker);
  const SLUKKER_NEDE = new THREE.Vector3(0, FOD + 0.55, 0);
  const SLUKKER_OPPE = new THREE.Vector3(1.2, FOD + 4.2, 0.3);

  // Røgen og skyen af CO₂
  const røg = lavPartikler(RØG_MAX, 0xd8dde4);
  const co2 = lavPartikler(CO2_MAX, 0xdfe9ff);
  gruppe.add(røg.punkter, co2.punkter);

  // Kredsløbet i flammen (turens trin 4): varme ned fra flammen (orange), stearinen smelter og kravler op i vægen (lys),
  // og øverst fordamper den ind i flammen (blå). Prikker, der løber rundt på begge sider af vægen.
  const KREDS = [
    [0.32, FOD + 1.0, 'v'], [0.62, LYS_TOP + 0.35, 'v'], [0.42, LYS_TOP + 0.03, 's'], [0.06, LYS_TOP + 0.03, 's'],
    [0.05, VÆGE.y - 0.04, 'd'], [0.12, FOD + 0.55, 'd'],
  ];
  const KREDS_FARVE = { v: new THREE.Color(2.2, 0.9, 0.25), s: new THREE.Color(1.5, 1.4, 1.1), d: new THREE.Color(0.5, 0.9, 2.2) };
  const kredsLængder = KREDS.map((p, i) => { const q = KREDS[(i + 1) % KREDS.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
  const kredsIalt = kredsLængder.reduce((a, b) => a + b, 0);
  const KREDS_N = 14; // prikker pr. side
  const kredsGeo = new THREE.BufferGeometry();
  kredsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(KREDS_N * 2 * 3), 3));
  kredsGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(KREDS_N * 2 * 3), 3));
  const kredsMat = new THREE.PointsMaterial({ size: 0.16, map: lavPrikTekstur(true), vertexColors: true, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const kreds = new THREE.Points(kredsGeo, kredsMat);
  kreds.frustumCulled = false;
  kreds.renderOrder = 8;
  kreds.visible = false;
  geoer.push(kredsGeo);
  mater.push(kredsMat);
  lys.add(kreds);
  let kredsTid = 0;
  function tegnKreds(dt) {
    kredsTid += dt * (ROLIG ? 0.08 : 0.18);
    const pos = kredsGeo.attributes.position;
    const farve = kredsGeo.attributes.color;
    for (let i = 0; i < KREDS_N; i++) {
      let s = (((i / KREDS_N + kredsTid) % 1) + 1) % 1 * kredsIalt;
      let k = 0;
      while (s > kredsLængder[k]) { s -= kredsLængder[k]; k = (k + 1) % KREDS.length; }
      const a = KREDS[k], b = KREDS[(k + 1) % KREDS.length];
      const u = s / kredsLængder[k];
      const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
      const f = KREDS_FARVE[a[2]];
      for (const [j, side] of [[i, 1], [i + KREDS_N, -1]]) {
        pos.setXYZ(j, x * side, y, 0.05);
        farve.setXYZ(j, f.r, f.g, f.b);
      }
    }
    pos.needsUpdate = true;
    farve.needsUpdate = true;
  }

  // ---------- Tilstanden for tegningen (sættes af js/ild.js) ----------
  const t = {
    flamme: 'lys', // 'lys' eller 'brænder'
    luft: 0, // luftringen: 0 lukket … 1 åben
    tyngde: 1,
    gløder: 0, // vægens spids gløder lidt, efter at lyset er slukket
    glas: 0, glasMål: 0, // 0 oppe … 1 nede
    slukker: 0, slukkerMål: 0,
    røgKilde: 0, // sekunder, røgen stadig stiger fra vægen
    co2Kilde: 0,
    dug: 0, sod: 0, // skeens skål
    kredsløb: false, // prikkerne, der viser kredsløbet (turens trin 4)
  };
  const tV = new THREE.Vector3();
  const tV2 = new THREE.Vector3();
  let røgTæller = 0;
  let co2Tæller = 0;

  function visFlamme(hvilken) {
    t.flamme = hvilken;
    lys.visible = hvilken === 'lys';
    brænder.visible = hvilken === 'brænder';
  }
  visFlamme('lys');

  function opdater(dt, kamera) {
    kreds.visible = t.kredsløb && t.flamme === 'lys';
    if (kreds.visible) tegnKreds(dt);
    // Flammerne
    lysFlamme.opdater(dt, kamera);
    brænderFlamme.opdater(dt, kamera);
    tændstikFlamme.opdater(dt, kamera);
    // Den smeltede stearin og vægens spids
    const brænderNu = lysFlamme.nu.lys;
    sø.material.opacity = Math.min(1, brænderNu * 1.4) * 0.85;
    stearin.emissiveIntensity = brænderNu * 0.9;
    t.gløder = Math.max(0, t.gløder - dt * 0.4);
    glødMat.opacity = Math.max(brænderNu * 0.9, t.gløder);
    // Luftringen drejer, så hullerne åbner sig
    luftring.rotation.y = t.luft * Math.PI * 0.5;
    for (const h of huller) h.scale.x = 0.15 + 0.85 * t.luft;
    // Glasset og lysslukkeren glider op og ned
    const glid = (nu, mål, fart) => nu + (mål - nu) * (1 - Math.exp(-dt * fart));
    t.glas = glid(t.glas, t.glasMål, ROLIG ? 20 : 4.5);
    glas.visible = t.glas > 0.01 || t.glasMål > 0;
    glas.position.y = GLAS_OPPE + (GLAS_NEDE - GLAS_OPPE) * t.glas;
    glasMat.opacity = 0.14 * Math.min(1, t.glas * 3);
    t.slukker = glid(t.slukker, t.slukkerMål, ROLIG ? 20 : 5);
    slukker.visible = t.slukker > 0.01 || t.slukkerMål > 0;
    slukker.position.lerpVectors(SLUKKER_OPPE, SLUKKER_NEDE, t.slukker);
    // Skeen: dug (lys og mat) og sod (sort)
    skeMat.color.copy(SKE_REN).lerp(SKE_DUG, t.dug * (1 - t.sod)).lerp(SKE_SOD, t.sod);
    skeMat.roughness = 0.3 + 0.6 * Math.max(t.dug, t.sod);
    skeMat.metalness = 0.92 * (1 - 0.75 * Math.max(t.dug * 0.8, t.sod));

    // Røgen stiger fra vægen (i vægtløshed bliver den hængende om vægen)
    if (t.røgKilde > 0) {
      const tæt = t.røgKilde > 2.6 ? 34 : 34 * (t.røgKilde / 2.6);
      røgTæller += dt * tæt * (LAV_KVALITET ? 0.7 : 1);
      t.røgKilde = Math.max(0, t.røgKilde - dt);
      while (røgTæller > 1) {
        røgTæller -= 1;
        tV.copy(VÆGE).add(tV2.set((Math.random() - 0.5) * 0.05, 0.02, (Math.random() - 0.5) * 0.05));
        if (t.tyngde > 0.5) røg.ny(tV, tV2.set((Math.random() - 0.5) * 0.08, 1.25 + Math.random() * 0.3, (Math.random() - 0.5) * 0.08), 3.2, 0.12, 0.85, 0.42);
        else røg.ny(tV, tV2.randomDirection().multiplyScalar(0.06 + Math.random() * 0.1), 7, 0.15, 0.9, 0.28);
      }
    }
    røg.opdater(dt, (x, d) => {
      x.p.addScaledVector(x.v, d);
      // Røgen svajer lidt, og jo højere den kommer, jo mere (på Jorden)
      if (t.tyngde > 0.5) x.p.x += Math.sin(x.alder * 2.2 + x.frø) * 0.12 * d * (0.4 + x.alder);
      x.v.multiplyScalar(1 - d * 0.15);
      // Under glasset bliver røgen inde i glasset
      if (t.glas > 0.9) {
        const loft = GLAS_NEDE + glasH / 2 - 0.35;
        if (x.p.y > loft) { x.p.y = loft; x.v.y = 0; x.v.x += (Math.random() - 0.5) * d * 2; }
        x.p.x = THREE.MathUtils.clamp(x.p.x, -1.05, 1.05);
        x.alder = Math.min(x.alder, x.liv * 0.6); // den bliver hængende
      }
    });
    // CO₂ strømmer ind fra venstre og synker ned over lyset
    if (t.co2Kilde > 0) {
      co2Tæller += dt * 55 * (LAV_KVALITET ? 0.7 : 1);
      t.co2Kilde = Math.max(0, t.co2Kilde - dt);
      while (co2Tæller > 1) {
        co2Tæller -= 1;
        tV.set(-4.6, 2.6 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.6);
        co2.ny(tV, tV2.set(2.6 + Math.random() * 0.6, -0.9 - Math.random() * 0.4, (Math.random() - 0.5) * 0.3), 2.8, 0.4, 1.5, 0.2);
      }
    }
    co2.opdater(dt, (x, d) => {
      x.p.addScaledVector(x.v, d);
      // Tungere end luft: den bremser og synker, og den breder sig langs bordet
      x.v.x *= 1 - d * 0.5;
      if (x.p.y < BORD_Y + 0.4) { x.p.y = BORD_Y + 0.4; x.v.y = 0; x.v.x += (Math.random() - 0.3) * d; }
    });
  }

  // Hvor mange røgpartikler (fra et lys, der lige er slukket) der er tæt på punktet p
  function røgVed(p, r = 0.5) {
    let n = 0;
    for (const x of røg.ps) if (x.alder < x.liv && x.alder < 2.4 && x.p.distanceTo(p) < r + x.fra + (x.til - x.fra) * 0.5 * Math.min(1, x.alder)) n++;
    return n;
  }

  return {
    gruppe,
    t,
    lysFlamme,
    brænderFlamme,
    tændstik,
    tændstikFlamme,
    ske,
    visFlamme,
    røg,
    co2,
    røgVed,
    opdater,
    // Røg fra vægen i sek sekunder (lyset er lige slukket)
    røgFra(sek = 3.4) {
      t.røgKilde = Math.max(t.røgKilde, sek);
      t.gløder = 1;
    },
    co2Sky(sek = 1.1) { t.co2Kilde = sek; },
    nulstil() {
      røg.ryd();
      co2.ryd();
      Object.assign(t, { gløder: 0, glas: 0, glasMål: 0, slukker: 0, slukkerMål: 0, røgKilde: 0, co2Kilde: 0, dug: 0, sod: 0, kredsløb: false });
      glas.visible = false;
      slukker.visible = false;
    },
    frigiv() {
      for (const g of geoer) g.dispose();
      for (const m of mater) m.dispose();
      lysFlamme.frigiv();
      brænderFlamme.frigiv();
      tændstikFlamme.frigiv();
      røg.frigiv();
      co2.frigiv();
      gruppe.removeFromParent();
    },
  };
}
