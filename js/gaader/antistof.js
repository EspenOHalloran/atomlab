// Gåden "Hvor blev antistoffet af?" i 3D (G4a, docs/plan-gaader-3d.md). Teksterne står i js/data/gaader.js (scene).
// Trin 1, før man har gættet: "Du kan kun lave par". Et tryk i mørket sender lys ind, og lyset bliver til to partikler,
// altid én stof (gylden) og én antistof (turkis). Antistof tegnes som stof: lige så lyst, kun en anden farve (fælde om
// billeder). Trækkes de sammen, bliver de til lys igen. "Lav kun stof" giver også et par.
// Trin 1, efter gættet: den store udslettelse. 1.000 par og én partikel stof i overskud. Parrene bliver til lys, så
// hele skærmen lyser, ét korn er tilbage, og kameraet trækker ud til en himmel af stjerner: "Alt, du kan se, er resten."
// Snyd (står i "Ærligt talt"): tusind par i stedet for en milliard, og partiklerne er elektroner og positroner.

import * as THREE from 'three';
import { verden, LAV_KVALITET } from '../scene3d.js';
import { glød, skilt, prikTekstur } from '../kosmos/faelles.js';
import { lyd } from '../lyd.js';
import { gådeMed, STREG_FORKLARING } from '../data/gaader.js';
import { fuld, stiplet, tonUd, stempel } from './streg.js';

const HB = 9; // den halve bredde og højde af det, kameraet skal se (planet z = 0)
const HH = 6;
const MAKS_PAR = 10; // partikler, man selv har lavet
const R = 0.42;
const PAR = 1000; // par i den store udslettelse (i virkeligheden ca. en milliard pr. partikel, der blev tilovers)
const STJERNER = LAV_KVALITET ? 1200 : 2000;
const FARVE = { stof: new THREE.Color(1.0, 0.7, 0.25), anti: new THREE.Color(0.32, 0.85, 1.0) };
// Tiderne i den store udslettelse (sekunder)
const T_MØDES = 1.6;
const T_KORN = 4.2;
const T_UD = 6.8;
const T_FÆRDIG = 9.5;

export function lavNær(ctx) {
  const { gruppe, linje, knapper, passer, ROLIG } = ctx;
  const T = gådeMed('antistof').scene;

  // ---------- Partiklerne, man selv laver ----------
  const kugleGeo = new THREE.SphereGeometry(R, 24, 16);
  const mat = {
    stof: new THREE.MeshStandardMaterial({ color: FARVE.stof, emissive: FARVE.stof, emissiveIntensity: 0.75, roughness: 0.35 }),
    anti: new THREE.MeshStandardMaterial({ color: FARVE.anti, emissive: FARVE.anti, emissiveIntensity: 0.75, roughness: 0.35 }),
  };
  const partikler = [];
  for (let i = 0; i < MAKS_PAR * 2; i++) {
    const type = i % 2 ? 'anti' : 'stof';
    const g = new THREE.Group();
    g.add(new THREE.Mesh(kugleGeo, mat[type]), glød(FARVE[type], 2.2, 0.3));
    g.visible = false;
    gruppe.add(g);
    partikler.push({ g, type, pos: g.position, fart: new THREE.Vector3(), levende: false, alder: 0, født: 0 });
  }
  // Navnene står kun under det første par
  const navne = { stof: skilt('stof', '#ffd27a', 0.6), anti: skilt('antistof', '#8fe6ff', 0.6) };
  const navneSom = { stof: null, anti: null };
  for (const s of Object.values(navne)) { s.visible = false; gruppe.add(s); }

  // Lys (fotoner): små klare prikker, der flyver. Glimt: et lys, der vokser og toner ud.
  const fotoner = [];
  for (let i = 0; i < 24; i++) {
    const s = glød(new THREE.Color(1.6, 1.5, 1.25), 1.1, 1);
    s.visible = false;
    gruppe.add(s);
    fotoner.push({ s, fart: new THREE.Vector3(), mål: null, liv: 0, levetid: 1 });
  }
  const glimt = [];
  for (let i = 0; i < 6; i++) {
    const s = glød(new THREE.Color(1.5, 1.4, 1.2), 1, 1);
    s.visible = false;
    gruppe.add(s);
    glimt.push({ s, liv: 0, levetid: 0.6 });
  }
  let næsteFoton = 0;
  let næsteGlimt = 0;

  // ---------- Den store udslettelse ----------
  const sky = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({
    size: 0.34, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  const N = PAR * 2 + 1; // den sidste er partiklen i overskud
  const skyPos = new Float32Array(N * 3);
  const skyFarve = new Float32Array(N * 3);
  const base = new Float32Array(N * 3);
  const fase = new Float32Array(N); // til at partiklerne dirrer
  const tMødes = new Float32Array(PAR);
  sky.geometry.setAttribute('position', new THREE.BufferAttribute(skyPos, 3));
  sky.geometry.setAttribute('color', new THREE.BufferAttribute(skyFarve, 3));
  sky.frustumCulled = false;
  sky.visible = false;
  gruppe.add(sky);
  function lavSky() {
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.96;
      base.set(i === N - 1 ? [0, 0, 0] : [Math.cos(a) * r * HB, Math.sin(a) * r * HH, (Math.random() - 0.5) * 3], i * 3);
      fase[i] = Math.random() * 100;
    }
    // Flere og flere par mødes, indtil næsten alle er væk (flest til sidst)
    for (let k = 0; k < PAR; k++) tMødes[k] = T_MØDES + 1.0 + 1.6 * Math.sqrt(Math.random());
  }
  const skær = glød(new THREE.Color(1, 0.97, 0.9), 160, 0); // lyset, der fylder hele skærmen
  skær.visible = false;
  gruppe.add(skær);
  const korn = new THREE.Group();
  korn.add(new THREE.Mesh(kugleGeo, mat.stof), glød(FARVE.stof, 3, 0.5));
  korn.visible = false;
  gruppe.add(korn);

  // Resten: stjerner i klumper (galakser), som kameraet trækker ud til
  const rest = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({
    size: 0.9, map: prikTekstur(), vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  {
    const pos = new Float32Array(STJERNER * 3);
    const farve = new Float32Array(STJERNER * 3);
    const midter = Array.from({ length: 36 }, () => new THREE.Vector3().randomDirection().multiplyScalar(18 + Math.random() * 80));
    const c = new THREE.Color();
    const v = new THREE.Vector3();
    for (let i = 0; i < STJERNER; i++) {
      const m = midter[i % midter.length];
      v.randomDirection().multiplyScalar(Math.random() * Math.random() * 9);
      v.y *= 0.35; // galakserne er flade
      pos.set([m.x + v.x, m.y + v.y, m.z + v.z], i * 3);
      c.setHSL(0.08 + Math.random() * 0.5 * Math.random(), 0.45, 0.55 + Math.random() * 0.35);
      farve.set([c.r, c.g, c.b], i * 3);
    }
    rest.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    rest.geometry.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  }
  rest.frustumCulled = false;
  rest.visible = false;
  gruppe.add(rest);

  // ---------- Tilstanden ----------
  let tilstand = null; // 'leg' | 'bang' | 'rest'
  let skridt = 0; // i 'leg': 0 start, 1 har lavet et par, 2 har set et par blive til lys, 3 har prøvet "kun stof"
  let t = 0; // tiden i den store udslettelse
  let holdt = null; // partiklen, man trækker i
  let tid0 = 0;
  const obj = {
    drejer: false,
    egetKamera: false,
    trin,
    opdater,
    ned: (p) => {
      if (tilstand !== 'leg') return false;
      holdt = nærmeste(p, LAV_KVALITET ? 1.5 : 1.15);
      return Boolean(holdt);
    },
    træk: (p) => {
      if (!holdt?.levende) return;
      holdt.pos.set(THREE.MathUtils.clamp(p.x, -HB, HB), THREE.MathUtils.clamp(p.y, -HH, HH), 0);
      holdt.fart.set(0, 0, 0);
      tjekMøder(holdt);
    },
    op: () => { holdt = null; },
    tryk: (p) => {
      if (tilstand === 'leg') sendLys(p, false);
    },
    spol: (s) => { for (let i = 0; i < s * 30; i++) opdater(1 / 30, tid0 + i / 30); },
    test: () => ({
      tilstand, skridt, t,
      søjler: søjler?.test() ?? null,
      redskab: redskab?.test() ?? null,
      levende: partikler.filter((x) => x.levende).length,
      stof: partikler.filter((x) => x.levende && x.type === 'stof').length,
      // Hvor de levende partikler står på skærmen (punkter fra øverste venstre hjørne), så en test kan trække i dem
      skærm: partikler.filter((x) => x.levende).map((x) => {
        const q = x.pos.clone().project(verden.kamera);
        return { type: x.type, x: (q.x + 1) / 2 * innerWidth, y: (1 - q.y) / 2 * innerHeight };
      }),
    }),
    fjern: () => {
      verden.styring.enabled = true;
      verden.styring.autoRotate = false;
    },
  };

  function nærmeste(p, maks) {
    let bedst = null;
    let d = maks;
    for (const x of partikler) {
      if (!x.levende) continue;
      const a = x.pos.distanceTo(p);
      if (a < d) { d = a; bedst = x; }
    }
    return bedst;
  }

  function nyFoton(fra, fart, levetid, mål = null) {
    const f = fotoner[næsteFoton];
    næsteFoton = (næsteFoton + 1) % fotoner.length;
    f.s.position.copy(fra);
    f.fart.copy(fart);
    f.mål = mål;
    f.liv = 0;
    f.levetid = levetid;
    f.s.visible = true;
    f.s.material.opacity = 1;
    return f;
  }

  function nytGlimt(p, størrelse = 5) {
    const g = glimt[næsteGlimt];
    næsteGlimt = (næsteGlimt + 1) % glimt.length;
    g.s.position.copy(p);
    g.liv = 0;
    g.levetid = ROLIG ? 0.9 : 0.6;
    g.størrelse = størrelse;
    g.s.visible = true;
  }

  // Lys kommer ind udefra og bliver til et par, der hvor man trykkede
  const v = new THREE.Vector3();
  function sendLys(p, kunStof) {
    const vinkel = Math.random() * Math.PI * 2;
    v.set(Math.cos(vinkel), Math.sin(vinkel), 0);
    const fra = p.clone().addScaledVector(v, 9);
    const varighed = 0.35;
    nyFoton(fra, v.clone().multiplyScalar(-9 / varighed), varighed, { p: p.clone(), kunStof });
  }

  function lavPar(p, kunStof) {
    // Er der fuldt, bliver det ældste par til lys først
    let fri = partikler.filter((x) => !x.levende);
    if (fri.length < 2) {
      const ældst = (type) => partikler.filter((x) => x.levende && x.type === type).sort((a, b) => a.født - b.født)[0];
      udslet(ældst('stof'), ældst('anti'), false);
      fri = partikler.filter((x) => !x.levende);
    }
    const a = fri.find((x) => x.type === 'stof');
    const b = fri.find((x) => x.type === 'anti');
    const vinkel = Math.random() * Math.PI * 2;
    v.set(Math.cos(vinkel), Math.sin(vinkel), 0);
    for (const [x, fortegn] of [[a, 1], [b, -1]]) {
      x.levende = true;
      x.alder = 0;
      x.født = tid0;
      x.pos.copy(p).addScaledVector(v, 0.15 * fortegn);
      x.pos.z = 0;
      x.fart.copy(v).multiplyScalar(3.4 * fortegn);
      x.g.visible = true;
      x.g.scale.setScalar(0.01);
    }
    nytGlimt(p, 3.5);
    lyd.elektron();
    if (!navneSom.stof && skridt < 2) { navneSom.stof = a; navneSom.anti = b; } // navnene står kun, til man har set et par blive til lys
    if (kunStof) {
      skridt = Math.max(skridt, 3);
    } else if (skridt === 0) skridt = 1;
    visLeg();
  }

  function udslet(a, b, tæl = true) {
    if (!a || !b) return;
    const m = a.pos.clone().add(b.pos).multiplyScalar(0.5);
    // To lysglimt flyver ud til hver sin side, vinkelret på den vej, de kom fra
    v.subVectors(b.pos, a.pos).set(-v.y, v.x, 0);
    if (v.lengthSq() < 1e-6) v.set(1, 0, 0);
    v.normalize().multiplyScalar(16);
    nyFoton(m, v, 0.8);
    nyFoton(m, v.clone().negate(), 0.8);
    nytGlimt(m, 6);
    for (const x of [a, b]) {
      x.levende = false;
      x.g.visible = false;
    }
    if ([a, b].includes(navneSom.stof) || [a, b].includes(navneSom.anti)) {
      navneSom.stof = navneSom.anti = null;
      navne.stof.visible = navne.anti.visible = false;
    }
    if (holdt === a || holdt === b) holdt = null;
    lyd.fusion(0);
    if (tæl && skridt < 2) skridt = 2;
    visLeg();
  }

  function tjekMøder(x) {
    if (x.alder < 0.6) return;
    for (const y of partikler) {
      if (!y.levende || y.type === x.type || y.alder < 0.6) continue;
      if (x.pos.distanceTo(y.pos) < R * 2.2) { udslet(x.type === 'stof' ? x : y, x.type === 'stof' ? y : x); return; }
    }
  }

  function visLeg() {
    if (tilstand !== 'leg') return;
    const tekst = [T.start, T.par, T.lys, T.kunStof][skridt];
    linje(tekst);
    knapper(skridt >= 2 ? [{ tekst: 'Lav kun stof', id: 'kunStof', gør: () => sendLys(new THREE.Vector3((Math.random() - 0.5) * HB, (Math.random() - 0.5) * HH, 0), true) }] : []);
  }

  // ---------- Trinene ----------
  function rydLeg() {
    for (const x of partikler) { x.levende = false; x.g.visible = false; }
    navneSom.stof = navneSom.anti = null;
    navne.stof.visible = navne.anti.visible = false;
    holdt = null;
    for (const f of fotoner) f.s.visible = false;
    for (const g of glimt) g.s.visible = false;
  }

  function startLeg() {
    tilstand = 'leg';
    rydLeg();
    sky.visible = skær.visible = korn.visible = rest.visible = false;
    obj.drejer = false;
    obj.egetKamera = false;
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
    visLeg();
  }

  function startBang() {
    tilstand = 'bang';
    t = 0;
    rydLeg();
    lavSky();
    obj.drejer = false;
    obj.egetKamera = false;
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
    sky.visible = true;
    korn.visible = false;
    rest.visible = false;
    rest.material.opacity = 0;
    skær.visible = true;
    skær.material.opacity = 0;
    knapper([]);
    linje(T.bang[0]);
    lyd.eksplosion();
    tegnSky(0);
  }

  // Trin 2 og 3 (og det sidste billede, n = 3) bygges først, når man kommer dertil
  let søjler = null;
  let redskab = null;
  function skjulBang() {
    rydLeg();
    sky.visible = skær.visible = korn.visible = rest.visible = false;
  }
  function stilKamera() {
    obj.drejer = false;
    obj.egetKamera = false;
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
  }

  function trin(n, valgt) {
    if (n !== 1) søjler?.skjul();
    if (n < 2) redskab?.skjul();
    if (n === 0 && valgt === null) { if (tilstand !== 'leg') startLeg(); return; }
    if (n === 0) { if (tilstand === 'leg' || tilstand === null) startBang(); return; }
    if (n === 1) {
      if (tilstand !== 'søjler') { tilstand = 'søjler'; skjulBang(); stilKamera(); knapper([]); }
      søjler ??= lavSøjler(gruppe, T, ROLIG);
      søjler.vis(valgt, linje);
      return;
    }
    // Trin 3 og det sidste billede: redskaberne og "Sig det til en ven"
    if (tilstand !== 'redskab') { tilstand = 'redskab'; skjulBang(); stilKamera(); }
    redskab ??= lavRedskab(gruppe, T, ROLIG);
    redskab.vis(linje, knapper, n >= 3, `Sig det til en ven: ${gådeMed('antistof').ven}`);
  }

  // ---------- Hvert billede ----------
  function tegnSky(tid) {
    for (let i = 0; i < N; i++) {
      const k = i >> 1;
      const ekstra = i === N - 1;
      const alder = ekstra ? -1 : t - tMødes[k];
      const j = i * 3;
      const ryst = 0.12;
      let x = base[j] + Math.sin(tid * 2.3 + fase[i]) * ryst;
      let y = base[j + 1] + Math.cos(tid * 1.9 + fase[i] * 1.3) * ryst;
      const z = base[j + 2];
      const c = i % 2 ? FARVE.anti : FARVE.stof;
      if (alder < 0) {
        // Før de mødes: fuld farve, og de lyser lidt op, mens udslettelsen nærmer sig
        const s = ekstra && t > T_KORN - 0.3 ? 0 : 1;
        skyFarve[j] = c.r * s; skyFarve[j + 1] = c.g * s; skyFarve[j + 2] = c.b * s;
      } else if (alder < 0.35) {
        // De mødes og bliver til lys, der flyver ud
        const f = 1 - alder / 0.35;
        const hvid = ROLIG ? 0.8 * f : 1.7 * f;
        skyFarve[j] = skyFarve[j + 1] = skyFarve[j + 2] = hvid;
        const ud = alder * (ROLIG ? 2 : 10);
        const l = Math.hypot(x, y) || 1;
        x += (x / l) * ud;
        y += (y / l) * ud;
      } else {
        skyFarve[j] = skyFarve[j + 1] = skyFarve[j + 2] = 0;
      }
      skyPos[j] = x; skyPos[j + 1] = y; skyPos[j + 2] = z;
    }
    sky.geometry.attributes.position.needsUpdate = true;
    sky.geometry.attributes.color.needsUpdate = true;
  }

  function opdaterBang(dt, tid) {
    const før = t;
    t += dt;
    const passerer = (x) => før < x && t >= x;
    tegnSky(tid);
    // Lyset fylder hele skærmen, når de fleste par mødes
    const top = ROLIG ? 0.55 : 0.95;
    const op = THREE.MathUtils.smoothstep(t, T_MØDES + 1.2, T_MØDES + 2.4);
    const ned = 1 - THREE.MathUtils.smoothstep(t, T_KORN - 0.4, T_KORN + 0.9);
    skær.material.opacity = top * op * ned;
    if (passerer(T_MØDES)) linje(T.bang[1]);
    if (passerer(T_MØDES + 1.0)) lyd.sus(2.2);
    if (passerer(T_KORN - 0.3)) { korn.visible = true; sky.visible = t < T_KORN + 1; }
    if (passerer(T_KORN)) { linje(T.bang[2]); lyd.opdaget(); }
    if (korn.visible) korn.scale.setScalar(1 + (ROLIG ? 0 : 0.12 * Math.sin(tid * 3)));
    if (passerer(T_UD)) {
      linje(T.bang[3]);
      rest.visible = true;
      obj.egetKamera = true;
      verden.målAfstand = 150;
      knapper([{ tekst: '↺ Se det igen', id: 'igen', gør: startBang }]);
    }
    if (t > T_UD) rest.material.opacity = Math.min(1, (t - T_UD) / 2.2);
    if (t >= T_FÆRDIG) {
      tilstand = 'rest';
      sky.visible = false;
      skær.visible = false;
      obj.drejer = true;
      verden.styring.enabled = true;
      verden.styring.autoRotate = !ROLIG;
      verden.styring.autoRotateSpeed = 0.25;
    }
  }

  function opdater(dt, tid) {
    tid0 = tid;
    // Lys og glimt
    for (const f of fotoner) {
      if (!f.s.visible) continue;
      f.liv += dt;
      f.s.position.addScaledVector(f.fart, dt);
      if (f.mål) {
        if (f.liv >= f.levetid) {
          f.s.visible = false;
          if (tilstand === 'leg') lavPar(f.mål.p, f.mål.kunStof);
        }
      } else {
        f.s.material.opacity = Math.max(0, 1 - f.liv / f.levetid);
        if (f.liv >= f.levetid) f.s.visible = false;
      }
    }
    for (const g of glimt) {
      if (!g.s.visible) continue;
      g.liv += dt;
      const f = g.liv / g.levetid;
      if (f >= 1) { g.s.visible = false; continue; }
      g.s.scale.setScalar(g.størrelse * (ROLIG ? 0.8 : 0.4 + f));
      g.s.material.opacity = ROLIG ? Math.sin(f * Math.PI) * 0.7 : 1 - f;
    }
    if (tilstand === 'bang') { opdaterBang(dt, tid); return; }
    if (tilstand === 'søjler') { søjler.opdater(dt, linje); return; }
    if (tilstand === 'redskab') { redskab.opdater(dt, linje); return; }
    if (tilstand !== 'leg') return;
    // Partiklerne driver langsomt og holder sig inden for kassen
    const dæmp = Math.exp(-dt * 1.8);
    for (const x of partikler) {
      if (!x.levende) continue;
      x.alder += dt;
      x.g.scale.setScalar(Math.min(1, x.alder * 5));
      if (x === holdt) continue;
      x.fart.multiplyScalar(dæmp);
      x.fart.x += (Math.random() - 0.5) * 1.2 * dt;
      x.fart.y += (Math.random() - 0.5) * 1.2 * dt;
      x.pos.addScaledVector(x.fart, dt);
      if (Math.abs(x.pos.x) > HB - R) { x.pos.x = Math.sign(x.pos.x) * (HB - R); x.fart.x *= -1; }
      if (Math.abs(x.pos.y) > HH - R) { x.pos.y = Math.sign(x.pos.y) * (HH - R); x.fart.y *= -1; }
      tjekMøder(x);
    }
    for (const type of ['stof', 'anti']) {
      const x = navneSom[type];
      navne[type].visible = Boolean(x?.levende);
      if (x?.levende) navne[type].position.set(x.pos.x, x.pos.y - 0.95, 0.5);
    }
  }

  return obj;
}

// ---------- Trin 2: de to søjler ----------
// Den målte forskel (lille, i farve, når stemplet MÅLT er landet) og det, der skal til (hvid stiplet, ud over skærmen,
// hvor den toner ud: Ingen ved, hvor høj den er). Før gættet er den lille søjle grå.
const BUND = -4.2;
function lavSøjler(gruppe, T, ROLIG) {
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const grå = new THREE.Color(0.35, 0.37, 0.42);
  const målt = new THREE.Color(0.37, 0.89, 1);
  g.add(fuld([[-8, BUND, 0], [8, BUND, 0]], new THREE.Color(0.4, 0.45, 0.55), { bredde: 2 }));
  const lille = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ color: grå }));
  lille.position.set(-3, BUND + 0.275, 0);
  g.add(lille);
  // Den stiplede søjle: to sider og bunden. Siderne vokser op ud over skærmen og toner ud.
  const højde = 13;
  const siderV = tonUd(1.9, BUND, BUND + højde, 0, { fra: 0.4 });
  const siderH = tonUd(4.1, BUND, BUND + højde, 0, { fra: 0.4 });
  const stor = new THREE.Group();
  stor.add(stiplet(siderV.punkter, { lys: siderV.lys }), stiplet(siderH.punkter, { lys: siderH.lys }), stiplet([[1.9, BUND, 0], [4.1, BUND, 0]]));
  g.add(stor);
  const navn = T.søjler.map((tekst, i) => {
    const s = skilt(tekst, i ? '#e8eeff' : '#8fe6ff', 0.62);
    s.position.set(i ? 3 : -3, BUND - 0.75, 0.5);
    g.add(s);
    return s;
  });
  const førNavn = skilt(T.førSøjle, '#c8ccd6', 0.62);
  førNavn.position.copy(navn[0].position);
  g.add(førNavn);
  const st = stempel('MÅLT', 1.25);
  st.sprite.position.set(-3, BUND + 2.2, 1);
  g.add(st.sprite);
  let t = -1; // tiden siden gættet
  return {
    g,
    vis(valgt, linje) {
      g.visible = true;
      førNavn.visible = valgt === null;
      navn[0].visible = valgt !== null;
      if (valgt === null) {
        navn[1].visible = false;
        t = -1;
        lille.material.color.copy(grå);
        stor.visible = false;
        st.skjul();
        linje(T.målt);
        return;
      }
      if (t < 0) {
        t = 0;
        st.slå(ROLIG);
        linje(STREG_FORKLARING);
      }
    },
    skjul() { g.visible = false; },
    opdater(dt, linje) {
      if (!g.visible || t < 0) return;
      t += dt;
      st.opdater(dt);
      if (st.landet()) lille.material.color.lerp(målt, Math.min(1, dt * 6));
      // Den stiplede søjle vokser op, når stemplet er landet
      const f = THREE.MathUtils.clamp((t - 0.8) / (ROLIG ? 0.01 : 1.4), 0, 1);
      stor.visible = f > 0;
      navn[1].visible = stor.visible;
      stor.scale.y = Math.max(0.001, f);
      stor.position.y = BUND * (1 - stor.scale.y);
      if (t > 4.5 && t - dt <= 4.5) linje(T.forLidt);
    },
    test: () => ({ stempel: st.landet(), farve: lille.material.color.getHexString(), stor: stor.visible }),
  };
}

// ---------- Trin 3: redskaberne ----------
// DUNE: et snit gennem Jorden i rigtig skala (1.300 km), og strålen af neutrinoer i en lige linje gennem jorden.
// Hyper-Kamiokande: tanken (68 × 71 m) med lysfølere på væggen. En neutrino, der rammer, giver en ring af lys (Cherenkov).
// Strålen skifter mellem neutrinoer (gylden, som stof) og antineutrinoer (turkis, som antistof) hvert 4. sekund.
const SKIFT = 4;
function lavRedskab(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);

  // DUNE: 1.300 km = 14 enheder
  const dune = new THREE.Group();
  const km = 14 / 1300;
  const R = 6371 * km;
  const top = 1.2;
  const midte = new THREE.Vector3(0, top - R, 0);
  const bue = [];
  for (let i = 0; i <= 64; i++) {
    const a = -0.16 + 0.32 * (i / 64);
    bue.push([midte.x + Math.sin(a) * R, midte.y + Math.cos(a) * R, 0]);
  }
  const jord = new THREE.Mesh(new THREE.CircleGeometry(R, 256, Math.PI / 2 - 0.16, 0.32), new THREE.MeshBasicMaterial({ color: 0x1a140f }));
  jord.position.copy(midte);
  dune.add(jord, fuld(bue, new THREE.Color(0.45, 0.75, 0.4), { bredde: 2.5 }));
  const yKant = midte.y + Math.sqrt(R * R - 49);
  const fra = new THREE.Vector3(-7, yKant, 0);
  const til = new THREE.Vector3(7, yKant, 0);
  for (const [p, navn] of [[fra, N.fermilab], [til, N.sanford]]) {
    const hus = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.3), new THREE.MeshBasicMaterial({ color: 0x9fb4d8 }));
    hus.position.set(p.x, p.y + 0.15, 0);
    const s = skilt(navn, '#cfe0ff', 0.55);
    s.position.set(p.x, p.y + 0.8, 0.5);
    dune.add(hus, s);
  }
  const afstand = skilt(N.km, '#e8eeff', 0.6);
  afstand.position.set(0, top + 2.35, 0.5);
  dune.add(afstand, fuld([[-7, top + 1.8, 0], [-7, top + 1.6, 0], [7, top + 1.6, 0], [7, top + 1.8, 0]], new THREE.Color(0.55, 0.6, 0.7), { bredde: 1.5 }));
  g.add(dune);

  // Strålen: prikker, der flyver fra Fermilab til Sanford Lab i en lige linje gennem jorden
  const STRÅLE = 48;
  const stråle = prikSkyEnkel(STRÅLE, 0.32);
  dune.add(stråle.punkter);
  const strålenavn = { neutrino: skilt(N.neutrino, '#ffd27a', 0.55), anti: skilt(N.anti, '#8fe6ff', 0.55) };
  for (const s of Object.values(strålenavn)) { s.position.set(0, yKant - 1.1, 0.5); dune.add(s); }

  // Hyper-Kamiokande: 68 × 71 m = 6,8 × 7,1 enheder, vippet lidt mod kameraet, så man ser ind i tanken
  const hk = new THREE.Group();
  hk.rotation.x = 0.32;
  hk.scale.setScalar(0.85);
  hk.position.y = 0.5;
  const r = 3.4;
  const h = 7.1;
  const ring = (y) => Array.from({ length: 65 }, (_, i) => [Math.cos(i / 64 * Math.PI * 2) * r, y, Math.sin(i / 64 * Math.PI * 2) * r]);
  const tankFarve = new THREE.Color(0.37, 0.75, 0.95);
  hk.add(fuld(ring(-h / 2), tankFarve, { bredde: 2 }), fuld(ring(h / 2), tankFarve, { bredde: 2 }));
  for (const x of [-r, r]) hk.add(fuld([[x, -h / 2, 0], [x, h / 2, 0]], tankFarve, { bredde: 2 }));
  // Lysfølerne på væggen
  const FØLERE = LAV_KVALITET ? 700 : 1100;
  const følere = prikSkyEnkel(FØLERE, 0.2);
  const fPos = følere.pos;
  for (let i = 0; i < FØLERE; i++) {
    const a = Math.random() * Math.PI * 2;
    fPos.set([Math.cos(a) * r * 0.98, (Math.random() - 0.5) * h * 0.97, Math.sin(a) * r * 0.98], i * 3);
  }
  følere.punkter.geometry.attributes.position.needsUpdate = true;
  const fLys = new Float32Array(FØLERE); // hvor meget hver føler lyser lige nu (ringen)
  hk.add(følere.punkter);
  const bred = skilt(N.bred, '#cfe0ff', 0.55);
  bred.position.set(0, h / 2 + 0.9, 0);
  const høj = skilt(N.høj, '#cfe0ff', 0.55);
  høj.position.set(r + 1.1, 0, 0);
  hk.add(bred, høj);
  // Neutrinoerne kommer ind fra venstre (fra J-PARC, 295 km væk)
  const ind = prikSkyEnkel(16, 0.3);
  hk.add(ind.punkter);
  g.add(hk);

  let vis = 'dune';
  let t = 0;
  let nesteRing = 1.5;
  let linjeTid = 0;
  const v = new THREE.Vector3();
  const retning = new THREE.Vector3();
  const COS42 = Math.cos(THREE.MathUtils.degToRad(42));

  function lysRing() {
    // En neutrino rammer et sted i tanken, og den hurtige partikel, den skubber til, giver en kegle af lys (ca. 42° i vand),
    // der rammer væggen som en ring
    const start = v.set(-r * 0.5, (Math.random() - 0.5) * h * 0.5, (Math.random() - 0.5) * r * 0.6);
    retning.set(1, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3).normalize();
    for (let i = 0; i < FØLERE; i++) {
      const dx = fPos[i * 3] - start.x, dy = fPos[i * 3 + 1] - start.y, dz = fPos[i * 3 + 2] - start.z;
      const l = Math.hypot(dx, dy, dz) || 1;
      const cos = (dx * retning.x + dy * retning.y + dz * retning.z) / l;
      if (Math.abs(cos - COS42) < 0.06) fLys[i] = 1;
    }
  }

  const strålefarve = () => (Math.floor(t / SKIFT) % 2 ? FARVE.anti : FARVE.stof);

  return {
    g,
    vis(linje, knapper, slut, ven) {
      g.visible = true;
      dune.visible = vis === 'dune';
      hk.visible = vis === 'hk';
      linjeTid = 0;
      linje(slut ? ven : T[vis]);
      knapper([
        { tekst: 'DUNE (USA)', id: 'dune', aktiv: vis === 'dune', gør: () => { vis = 'dune'; this.vis(linje, knapper, slut, ven); } },
        { tekst: 'Hyper-K (Japan)', id: 'hk', aktiv: vis === 'hk', gør: () => { vis = 'hk'; this.vis(linje, knapper, slut, ven); } },
      ]);
      this.slut = slut;
    },
    skjul() { g.visible = false; },
    opdater(dt, linje) {
      if (!g.visible) return;
      t += dt;
      linjeTid += dt;
      // Efter et stykke tid: hvor mange neutrinoer der er (kun mens trinet står på, ikke på det sidste billede)
      if (!this.slut && linjeTid > 7 && linjeTid - dt <= 7) linje(T.skiftevis);
      if (!this.slut && linjeTid > 13 && linjeTid - dt <= 13) linje(T.tommel);
      const farve = strålefarve();
      const anti = farve === FARVE.anti;
      if (dune.visible) {
        strålenavn.neutrino.visible = !anti;
        strålenavn.anti.visible = anti;
        for (let i = 0; i < STRÅLE; i++) {
          const f = ((i / STRÅLE) + t * 0.18) % 1;
          const l = ROLIG ? 0.8 : 0.6 + 0.4 * Math.sin(f * Math.PI);
          sæt(stråle.pos, i, fra.x + (til.x - fra.x) * f, yKant - 0.12, 0);
          sæt(stråle.farve, i, farve.r * l, farve.g * l, farve.b * l);
        }
        stråle.opdateret();
      }
      if (hk.visible) {
        for (let i = 0; i < 16; i++) {
          const f = ((i / 16) + t * 0.35) % 1;
          sæt(ind.pos, i, -12 + f * 9, Math.sin(i * 7.1) * 0.8, Math.cos(i * 3.3) * 0.8);
          sæt(ind.farve, i, farve.r, farve.g, farve.b);
        }
        ind.opdateret();
        if (t > nesteRing) { lysRing(); nesteRing = t + 2.2 + Math.random(); }
        const dæmp = Math.exp(-dt * (ROLIG ? 1.5 : 2.5));
        for (let i = 0; i < FØLERE; i++) {
          fLys[i] *= dæmp;
          const l = 0.25 + fLys[i] * 1.6;
          sæt(følere.farve, i, 0.55 * l + fLys[i] * 0.4, 0.62 * l + fLys[i] * 0.5, 0.75 * l + fLys[i] * 0.8);
        }
        følere.opdateret();
      }
    },
    test: () => ({ vis, anti: strålefarve() === FARVE.anti }),
  };
}

// Skriver tre tal ind på plads i i en liste (uden at lave en ny liste hvert billede)
function sæt(liste, i, a, b, c) {
  liste[i * 3] = a;
  liste[i * 3 + 1] = b;
  liste[i * 3 + 2] = c;
}

// Prikker med egen farve pr. prik, som flyttes hvert billede
function prikSkyEnkel(antal, størrelse) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(antal * 3);
  const farve = new Float32Array(antal * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const punkter = new THREE.Points(geo, new THREE.PointsMaterial({
    size: størrelse, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punkter.frustumCulled = false;
  return {
    punkter, pos, farve,
    opdateret() { geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; },
  };
}
