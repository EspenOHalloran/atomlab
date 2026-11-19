// Gåden "Hvad er mørkt stof?" i 3D (G4d, docs/plan-gaader-3d.md). Teksterne står i js/data/gaader.js (scene).
// Trin 1, før man har gættet: En spiralgalakse af prikker drejer med en flad rotationskurve (stjernerne yderst kredser
// lige så hurtigt som dem tættere på midten, så alle har lige lange spor). Kontakten "Kun det synlige trækker": Stjernerne
// beholder farten, men kun det synlige stof trækker, så de yderste er hurtigere end flugtfarten og flyver væk.
// Trin 1, efter gættet: et felt af små galakser bagved. Man trækker en usynlig klump, og galakserne bøjes i buer og ringe
// (linseligningen for en punktmasse, regnet på processoren). Klumpen tegnes ikke, kun en tynd ring om fingeren.
// Trin 2: LZ dybt nede (skakten, tanken, mørke og et ur, der løber). Efter gættet stemplet GÆT, en stiplet partikel
// (et bud), ét glimt (2026) og en måler: 2,6 sigma af de 5, der kræves.
// Trin 3 og det sidste billede: buerne i farve og et kort over det mørke stof stiplet ud fra dem, der toner ud mod kanten,
// og Euclid med årstallet fra kortet. Snyd (står i "Ærligt talt"): få stjerner, alt går meget hurtigere, klumpen bøjer
// meget mere end en rigtig, og skakten og tanken er ikke i samme skala.

import * as THREE from 'three';
import { verden, LAV_KVALITET } from '../scene3d.js';
import { glød, skilt, prikTekstur } from '../kosmos/faelles.js';
import { lyd } from '../lyd.js';
import { gådeMed } from '../data/gaader.js';
import { fuld, stiplet, stempel } from './streg.js';

const HB = 9; // den halve bredde og højde af det, kameraet skal se (planet z = 0)
const HH = 6;

// ---------- Galaksen ----------
const STJERNER = LAV_KVALITET ? 1100 : 2000;
const SPOR = 3; // punkter pr. stjerne: stjernen og to svagere bag den, så farten kan ses
const SPOR_TID = 0.32; // sekunder mellem punkterne i sporet
const RG = 7.2; // galaksens radius i skivens plan
const RD = 2.6; // skivens skalalængde (der er flest stjerner inde ved midten)
const V = 1.0; // farten i den flade del af rotationskurven (enheder pr. sekund): Yderst tager en omgang ca. 45 s
const R0 = 0.9; // inden for ca. R0 stiger farten op fra 0
const B = 1.4; // kernen i det synlige stof (en Plummer-kugle)
const FLUGT_R = 3.6; // her er flugtfarten fra det synlige stof lige præcis V: længere ude flyver stjernerne væk
const GM = (V * V * Math.hypot(FLUGT_R, B)) / 2;
const HÆLD = 0.98; // skiven vippes, så man ser den på skrå
const ARM_FART = 0.06; // armene er et mønster, der drejer langsommere end stjernerne (en tæthedsbølge)
const TILBAGE = 1.6; // sekunder om at komme tilbage i kredsløb, når kontakten slås fra

// ---------- Lysbøjningen ----------
const KILDER = LAV_KVALITET ? 46 : 72; // små galakser bagved
const PR_KILDE = LAV_KVALITET ? 40 : 64; // prikker pr. galakse
const EIN = 1.9; // Einstein-radius (enheder): en galakse lige bag klumpen bliver til en ring så stor

export function lavNær(ctx) {
  const { gruppe, linje, knapper, passer, ROLIG } = ctx;
  const T = gådeMed('moerktstof').scene;

  const galakse = lavGalakse(gruppe);
  const felt = lavFelt(gruppe, KILDER, PR_KILDE, [[0.25, 0.15, 0.42]]);
  felt.g.visible = false;
  // Ringen om fingeren, mens man trækker (klumpen selv tegnes ikke)
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.58, 48), new THREE.MeshBasicMaterial({ color: 0xe8eeff, transparent: true, opacity: 0, depthWrite: false }));
  ring.position.z = 0.2;
  ring.visible = false;
  gruppe.add(ring);

  let tilstand = null; // 'galakse' | 'buer' | 'lz' | 'kort'
  let gættet = false; // trin 1 efter gættet: lysbøjningen og galaksen kan vælges med knapperne
  let kunSynligt = false;
  let harSlået = false; // kontakten er slået til mindst én gang
  let trukket = false; // man har selv flyttet klumpen
  let trækker = false;
  let tLinse = 0;
  let tid0 = 0;
  const linse = new THREE.Vector2(0, 0);
  let lz = null;
  let kort = null;

  function stilKamera() {
    verden.styring.enabled = false;
    verden.styring.autoRotate = false;
    passer(HB, HH);
  }

  function visGalakseKnapper() {
    const kontakt = { tekst: T.kontakt, id: 'kunSynligt', kontakt: kunSynligt, gør: () => sætSynligt(!kunSynligt) };
    knapper(gættet ? [kontakt, { tekst: T.knapBuer, id: 'buer', gør: () => vis('buer') }] : [kontakt]);
  }

  function sætSynligt(til) {
    kunSynligt = til;
    galakse.synligt(til);
    if (til) harSlået = true;
    linje(til ? T.kunSynligt : harSlået ? T.igen : T.start);
    lyd.klik();
    visGalakseKnapper();
  }

  function vis(hvad) {
    tilstand = hvad;
    galakse.g.visible = hvad === 'galakse';
    felt.g.visible = hvad === 'buer';
    ring.visible = false;
    lz?.skjul();
    kort?.skjul();
    stilKamera();
    if (hvad === 'galakse') {
      linje(kunSynligt ? T.kunSynligt : harSlået ? T.igen : T.start);
      visGalakseKnapper();
    } else if (hvad === 'buer') {
      linje(trukket ? T.bøjet : T.bøj);
      knapper([{ tekst: T.knapGalakse, id: 'galakse', gør: () => vis('galakse') }]);
      felt.bøj(linse);
    }
  }

  function trin(n, valgt) {
    if (n === 0) {
      gættet = valgt !== null;
      vis(gættet ? 'buer' : 'galakse');
      return;
    }
    galakse.g.visible = felt.g.visible = ring.visible = false;
    if (n === 1) {
      kort?.skjul();
      if (tilstand !== 'lz') { tilstand = 'lz'; stilKamera(); }
      lz ??= lavLZ(gruppe, T, ROLIG);
      lz.vis(valgt, linje);
      knapper([]);
      return;
    }
    // Trin 3 og det sidste billede: kortet og "Sig det til en ven"
    lz?.skjul();
    if (tilstand !== 'kort') { tilstand = 'kort'; stilKamera(); }
    kort ??= lavKort(gruppe, T, ROLIG);
    kort.vis(linje, n >= 3 ? `Sig det til en ven: ${gådeMed('moerktstof').ven}` : null);
    knapper([]);
  }

  // Klumpen følger fingeren, så længe man trækker. Et tryk flytter den også.
  function flytLinse(p) {
    linse.set(THREE.MathUtils.clamp(p.x, -HB, HB), THREE.MathUtils.clamp(p.y, -HH, HH));
    felt.bøj(linse);
    ring.position.set(linse.x, linse.y, 0.2);
    if (!trukket) { trukket = true; linje(T.bøjet); }
  }

  function opdater(dt, tid) {
    tid0 = tid;
    if (tilstand === 'galakse') galakse.opdater(dt, tid);
    else if (tilstand === 'buer') {
      // Indtil man selv rører den, glider klumpen langsomt rundt, så buerne kan ses med det samme (ikke med ROLIG)
      if (!trukket && !ROLIG) {
        tLinse += dt;
        linse.set(2.4 * Math.sin(tLinse * 0.17), 1.4 * Math.sin(tLinse * 0.23));
        felt.bøj(linse);
      }
      ring.visible = trækker || ring.material.opacity > 0.01;
      ring.material.opacity = trækker ? Math.min(0.55, ring.material.opacity + dt * 4) : Math.max(0, ring.material.opacity - dt * 2);
    } else if (tilstand === 'lz') lz.opdater(dt, tid, linje);
    else if (tilstand === 'kort') kort.opdater(dt, tid, linje);
  }

  return {
    drejer: false,
    egetKamera: false,
    trin,
    opdater,
    ned: (p) => {
      if (tilstand !== 'buer') return false;
      trækker = true;
      flytLinse(p);
      return true;
    },
    træk: (p) => { if (trækker) flytLinse(p); },
    op: () => { trækker = false; },
    tryk: (p) => { if (tilstand === 'buer') { flytLinse(p); } },
    spol: (s) => { for (let i = 0; i < s * 30; i++) opdater(1 / 30, tid0 + i / 30); },
    test: () => ({
      tilstand, kunSynligt, trukket,
      linse: [linse.x, linse.y],
      galakse: galakse.test(),
      buer: felt.test(),
      lz: lz?.test() ?? null,
      kort: kort?.test() ?? null,
    }),
    fjern: () => {
      verden.styring.enabled = true;
      verden.styring.autoRotate = false;
    },
  };
}

// ---------- Galaksen ----------
// Stjernerne kredser med farten v(r) = V(1 - e^(-r/R0)): Udenfor den inderste del er farten den samme (målt af Rubin og
// Ford). Med kontakten trækker kun det synlige stof (en Plummer-kugle med GM), og stjernerne flyver frit fra der, hvor de
// var, med den fart, de havde. Slås kontakten fra, glider de tilbage i deres kredsløb (de, der var fløjet langt væk,
// toner ud og ind igen).
function lavGalakse(gruppe) {
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const skive = new THREE.Group(); // skivens plan er xy, vippet mod kameraet
  skive.rotation.x = -HÆLD;
  g.add(skive);
  const N = STJERNER;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * SPOR * 3);
  const farve = new Float32Array(N * SPOR * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const punkter = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.17, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punkter.frustumCulled = false;
  skive.add(punkter, glød(new THREE.Color(1, 0.86, 0.62), 1.7, 0.45));

  // Hver stjerne: kredsløbets radius, vinkel, plads og fart (i skivens plan) og farven
  const r0 = new Float32Array(N);
  const vinkel = new Float32Array(N);
  const x = new Float32Array(N), y = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  const fraX = new Float32Array(N), fraY = new Float32Array(N), langt = new Uint8Array(N);
  const z = new Float32Array(N);
  const basis = new Float32Array(N * 3);
  const c = new THREE.Color();
  const maks = 1 - Math.exp(-RG / RD);
  for (let i = 0; i < N; i++) {
    // Flest stjerner inde ved midten (en eksponentiel skive), ingen længere ude end RG
    const r = Math.max(0.12, -RD * Math.log(1 - Math.random() * maks));
    r0[i] = r;
    vinkel[i] = Math.random() * Math.PI * 2;
    z[i] = (Math.random() - 0.5) * 0.25 * Math.exp(-r / 3);
    c.setHSL(r < 1.4 ? 0.1 : 0.58 + Math.random() * 0.05, r < 1.4 ? 0.55 : 0.35, 0.62 + Math.random() * 0.2);
    basis.set([c.r, c.g, c.b], i * 3);
  }
  const fart = (r) => V * (1 - Math.exp(-r / R0));
  let tilstand = 'kreds'; // 'kreds' | 'fri' | 'tilbage'
  let tTilbage = 0;
  let armTid = 0;

  function kreds(i) {
    const r = r0[i];
    const v = fart(r);
    const ca = Math.cos(vinkel[i]), sa = Math.sin(vinkel[i]);
    x[i] = r * ca; y[i] = r * sa;
    vx[i] = -v * sa; vy[i] = v * ca;
  }
  for (let i = 0; i < N; i++) kreds(i);

  function tegn() {
    for (let i = 0; i < N; i++) {
      const r = Math.hypot(x[i], y[i]);
      // Armene: stjernerne lyser mere, når de er i en arm (et mønster, der drejer for sig selv)
      const a = Math.atan2(y[i], x[i]) - armTid * ARM_FART - 2.3 * Math.log(r + 0.4);
      const arm = Math.pow(Math.max(0, Math.cos(2 * a)), 3);
      let l = (0.25 + 1.0 * arm) * (r < 1.2 ? 1.4 : 1);
      // Langt ude toner de ud (de er fløjet væk), og på vej tilbage i kredsløb toner de, der var langt væk, ind igen
      if (r > RG * 1.6) l *= Math.max(0, 1 - (r - RG * 1.6) / (RG * 1.4));
      if (tilstand === 'tilbage' && langt[i]) l *= Math.abs(1 - 2 * Math.min(1, tTilbage / TILBAGE));
      for (let s = 0; s < SPOR; s++) {
        const j = (i * SPOR + s) * 3;
        const k = s * SPOR_TID;
        pos[j] = x[i] - vx[i] * k;
        pos[j + 1] = y[i] - vy[i] * k;
        pos[j + 2] = z[i];
        const ls = l * (s === 0 ? 1 : s === 1 ? 0.45 : 0.2);
        farve[j] = basis[i * 3] * ls; farve[j + 1] = basis[i * 3 + 1] * ls; farve[j + 2] = basis[i * 3 + 2] * ls;
      }
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }
  tegn();

  return {
    g,
    synligt(til) {
      if (til) {
        tilstand = 'fri';
      } else if (tilstand === 'fri') {
        tilstand = 'tilbage';
        tTilbage = 0;
        for (let i = 0; i < N; i++) { fraX[i] = x[i]; fraY[i] = y[i]; langt[i] = Math.hypot(x[i], y[i]) > RG * 1.3 ? 1 : 0; }
      }
    },
    opdater(dt) {
      armTid += dt;
      if (tilstand === 'fri') {
        // Kun det synlige stof trækker. To små skridt pr. billede, så de inderste baner holder.
        const h = dt / 2;
        for (let n = 0; n < 2; n++) {
          for (let i = 0; i < N; i++) {
            const r2 = x[i] * x[i] + y[i] * y[i];
            if (r2 > 900) continue; // langt væk: flyver bare videre ud af billedet
            const f = -GM / Math.pow(r2 + B * B, 1.5);
            vx[i] += f * x[i] * h; vy[i] += f * y[i] * h;
            x[i] += vx[i] * h; y[i] += vy[i] * h;
          }
        }
      } else {
        // I kredsløb: vinklen vokser med v/r (de inderste drejer flest gange rundt, men farten er den samme)
        for (let i = 0; i < N; i++) vinkel[i] += (fart(r0[i]) / r0[i]) * dt;
        if (tilstand === 'tilbage') {
          tTilbage += dt;
          const f = THREE.MathUtils.smoothstep(Math.min(1, tTilbage / TILBAGE), 0, 1);
          for (let i = 0; i < N; i++) {
            const ka = fraX[i], kb = fraY[i];
            kreds(i);
            // De, der var langt væk, springer tilbage, mens de er tonet ud (midt i toningen)
            const g = langt[i] ? (f < 0.5 ? 0 : 1) : f;
            x[i] = ka + (x[i] - ka) * g; y[i] = kb + (y[i] - kb) * g;
          }
          if (tTilbage >= TILBAGE) tilstand = 'kreds';
        } else for (let i = 0; i < N; i++) kreds(i);
      }
      tegn();
    },
    // Til tests: hvor mange stjerner er fløjet uden for galaksen, og har de yderste og de midterste samme fart?
    test() {
      let ude = 0;
      for (let i = 0; i < N; i++) if (Math.hypot(x[i], y[i]) > RG * 1.5) ude++;
      return { tilstand, ude, fartInde: fart(2.5), fartUde: fart(RG), flugtUde: Math.sqrt(2 * GM / Math.hypot(RG, B)) };
    },
  };
}

// ---------- Lysbøjningen ----------
// Små galakser bagved (prikker i en ellipse). For en punktmasse giver linseligningen to billeder af hvert punkt på
// samme linje gennem klumpen: θ± = (u ± √(u² + 4θE²)) / 2, hvor u er afstanden fra klumpen til punktet uden klump. Lyset
// forstærkes med μ± = (y² + 2) / (2y√(y² + 4)) ± 1/2 (y = u/θE). Det indre billede er spejlvendt og svagt. Kaldes kun, når
// klumpen flytter sig. linser: flere klumper [[x, y, θE]]: Hvert punkt bøjes kun af den nærmeste (snyd, der er godt nok,
// når klumperne står langt fra hinanden).
function lavFelt(gruppe, kilder, prKilde, særlige = [], { linser = null, halvB = HB + 1.2, halvH = HH + 0.6, z = 0 } = {}) {
  const g = new THREE.Group();
  gruppe.add(g);
  const N = kilder * prKilde;
  const bx = new Float32Array(N), by = new Float32Array(N);
  const basis = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 2 * 3);
  const farve = new Float32Array(N * 2 * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(farve, 3));
  const punkter = new THREE.Points(geo, new THREE.PointsMaterial({
    size: LAV_KVALITET ? 0.15 : 0.12, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  punkter.frustumCulled = false;
  g.add(punkter);
  const c = new THREE.Color();
  for (let k = 0; k < kilder; k++) {
    // Galaksens midte, størrelse, form og retning. De første kan være lagt et bestemt sted (fx lige bag klumpen).
    const [cx, cy, s0] = særlige[k] ?? [(Math.random() * 2 - 1) * halvB, (Math.random() * 2 - 1) * halvH, 0.16 + Math.random() * 0.3];
    const q = 0.35 + Math.random() * 0.65;
    const φ = Math.random() * Math.PI;
    const cφ = Math.cos(φ), sφ = Math.sin(φ);
    const gul = Math.random() < 0.4;
    for (let n = 0; n < prKilde; n++) {
      const i = k * prKilde + n;
      const a = Math.random() * Math.PI * 2;
      const r = s0 * Math.min(1.6, Math.sqrt(-Math.log(1 - Math.random() * 0.95)) * 0.7);
      const u = Math.cos(a) * r, v = Math.sin(a) * r * q;
      bx[i] = cx + u * cφ - v * sφ;
      by[i] = cy + u * sφ + v * cφ;
      const lys = 0.55 + 0.45 * (1 - r / (s0 * 1.6));
      c.setHSL(gul ? 0.09 + Math.random() * 0.04 : 0.6 + Math.random() * 0.04, gul ? 0.6 : 0.45, 0.6 * lys + 0.1);
      basis.set([c.r, c.g, c.b], i * 3);
    }
  }
  const enLinse = [[0, 0, EIN]];
  let største = 1; // den største forstærkning sidst (til tests)
  let buer = 0; // punkter, der er forstærket over 1,5 gange (dele af buer og ringe)

  function bøj(L) {
    const liste = linser ?? (enLinse[0][0] = L.x, enLinse[0][1] = L.y, enLinse);
    største = 0;
    buer = 0;
    for (let i = 0; i < N; i++) {
      // Den nærmeste klump
      let lx = 0, ly = 0, e = 0, d2 = Infinity;
      for (const [x, y, θE] of liste) {
        const d = (bx[i] - x) ** 2 + (by[i] - y) ** 2;
        if (d < d2) { d2 = d; lx = x; ly = y; e = θE; }
      }
      const dx = bx[i] - lx, dy = by[i] - ly;
      const u = Math.max(1e-4, Math.sqrt(d2));
      const rod = Math.sqrt(u * u + 4 * e * e);
      const tp = (u + rod) / 2;
      const tm = (u - rod) / 2; // negativ: på den anden side af klumpen
      const nx = dx / u, ny = dy / u;
      const yy = u / e;
      const μ = (yy * yy + 2) / (2 * yy * Math.sqrt(yy * yy + 4));
      const lp = Math.pow(Math.min(4, μ + 0.5), 0.8);
      const lm = Math.pow(Math.min(4, Math.max(0, μ - 0.5)), 0.8);
      if (μ + 0.5 > største) største = μ + 0.5;
      if (μ + 0.5 > 1.5) buer++;
      const j = i * 6;
      pos[j] = lx + nx * tp; pos[j + 1] = ly + ny * tp; pos[j + 2] = z;
      pos[j + 3] = lx + nx * tm; pos[j + 4] = ly + ny * tm; pos[j + 5] = z;
      const b = i * 3;
      farve[j] = basis[b] * lp; farve[j + 1] = basis[b + 1] * lp; farve[j + 2] = basis[b + 2] * lp;
      farve[j + 3] = basis[b] * lm; farve[j + 4] = basis[b + 1] * lm; farve[j + 5] = basis[b + 2] * lm;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }

  return { g, bøj, test: () => ({ største, buer, punkter: N * 2 }) };
}

// En cirkel (eller en lidt bulet ring) som en liste af punkter
function cirkel(cx, cy, r, { dele = 64, bule = 0, fase = 0, z = 0 } = {}) {
  const p = [];
  for (let i = 0; i <= dele; i++) {
    const a = (i / dele) * Math.PI * 2;
    const rr = r * (1 + bule * Math.sin(3 * a + fase) + bule * 0.6 * Math.cos(2 * a - fase));
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]);
  }
  return p;
}

// ---------- Trin 2: LZ ----------
// Overfladen, skakten (ca. 1,5 km), hulen og tanken i fuld farve (de findes og er målt), mørket og et ur, der løber.
// Efter gættet: stemplet GÆT, partiklen stiplet (et bud), ét glimt i tanken (det er målt) og måleren: 2,6 af 5 sigma.
const OVERFLADE = 4.4;
const TANK = new THREE.Vector3(-3.2, -2.95, 0);
const T_GLIMT = 3.2; // sekunder efter gættet
const T_MÅLER = 4.6;
const T_SIGMA = 6.2;
function lavLZ(gruppe, T, ROLIG) {
  const N = T.navne;
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  // Klippen under overfladen
  const klippe = new THREE.Mesh(new THREE.PlaneGeometry(2 * HB + 6, 14), new THREE.MeshBasicMaterial({ color: 0x120e0b }));
  klippe.position.set(0, OVERFLADE - 7, -0.3);
  g.add(klippe);
  const grå = new THREE.Color(0.5, 0.56, 0.64);
  g.add(fuld([[-HB - 3, OVERFLADE, 0], [HB + 3, OVERFLADE, 0]], new THREE.Color(0.45, 0.62, 0.36), { bredde: 2.5 }));
  const overflade = skilt(N.overflade, '#b9d6a8', 0.55);
  overflade.position.set(3.2, OVERFLADE + 0.45, 0.5);
  g.add(overflade);
  // Tårnet over skakten og skakten ned til hulen
  g.add(fuld([[-6.6, OVERFLADE, 0], [-6.3, OVERFLADE + 1.1, 0], [-5.7, OVERFLADE + 1.1, 0], [-5.4, OVERFLADE, 0]], grå, { bredde: 2 }));
  g.add(fuld([[-6.25, OVERFLADE, 0], [-6.25, -1.6, 0]], grå, { bredde: 2 }), fuld([[-5.75, OVERFLADE, 0], [-5.75, -1.6, 0]], grå, { bredde: 2 }));
  // Hulen: åben øverst, hvor skakten kommer ind
  g.add(fuld([[-6.25, -1.6, 0], [-6.6, -1.6, 0], [-6.6, -4.3, 0], [-0.4, -4.3, 0], [-0.4, -1.6, 0], [-5.75, -1.6, 0]], grå, { bredde: 2 }));
  // Målestokken for dybden
  g.add(fuld([[-7.4, OVERFLADE, 0], [-7.4, -1.6, 0]], new THREE.Color(0.6, 0.66, 0.75), { bredde: 1.5 }),
    fuld([[-7.6, OVERFLADE, 0], [-7.2, OVERFLADE, 0]], new THREE.Color(0.6, 0.66, 0.75), { bredde: 1.5 }),
    fuld([[-7.6, -1.6, 0], [-7.2, -1.6, 0]], new THREE.Color(0.6, 0.66, 0.75), { bredde: 1.5 }));
  const dybde = skilt(N.dybde, '#e8eeff', 0.55);
  dybde.position.set(-4.2, 1.4, 0.5);
  g.add(dybde, fuld([[-7.3, 1.4, 0], [-5.1, 1.4, 0]], new THREE.Color(0.4, 0.45, 0.55), { bredde: 1 }));
  // Tanken: en cylinder set forfra (to ellipser og to sider) med xenon og lysfølere øverst og nederst
  const tankFarve = new THREE.Color(0.37, 0.75, 0.95);
  const rx = 1.0, ry = 0.25, h = 2.1;
  const ellipse = (yc) => Array.from({ length: 49 }, (_, i) => [TANK.x + Math.cos(i / 48 * Math.PI * 2) * rx, yc + Math.sin(i / 48 * Math.PI * 2) * ry, 0]);
  g.add(fuld(ellipse(TANK.y + h / 2), tankFarve, { bredde: 2 }), fuld(ellipse(TANK.y - h / 2), tankFarve, { bredde: 2 }),
    fuld([[TANK.x - rx, TANK.y - h / 2, 0], [TANK.x - rx, TANK.y + h / 2, 0]], tankFarve, { bredde: 2 }),
    fuld([[TANK.x + rx, TANK.y - h / 2, 0], [TANK.x + rx, TANK.y + h / 2, 0]], tankFarve, { bredde: 2 }));
  const xenon = new THREE.Mesh(new THREE.PlaneGeometry(rx * 2, h), new THREE.MeshBasicMaterial({ color: 0x1a3a66, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
  xenon.position.set(TANK.x, TANK.y, -0.05);
  g.add(xenon);
  const FØLERE = 18;
  const fGeo = new THREE.BufferGeometry();
  const fPos = new Float32Array(FØLERE * 3);
  const fFarve = new Float32Array(FØLERE * 3);
  for (let i = 0; i < FØLERE; i++) {
    const række = i < FØLERE / 2 ? 1 : -1;
    const k = i % (FØLERE / 2);
    fPos.set([TANK.x - rx * 0.8 + (k / (FØLERE / 2 - 1)) * rx * 1.6, TANK.y + række * (h / 2 - 0.12), 0.05], i * 3);
  }
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
  fGeo.setAttribute('color', new THREE.BufferAttribute(fFarve, 3));
  const følere = new THREE.Points(fGeo, new THREE.PointsMaterial({ size: 0.22, map: prikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  følere.frustumCulled = false;
  g.add(følere);
  const tank = skilt(N.tank, '#cfe0ff', 0.55);
  tank.position.set(TANK.x, -4.85, 0.5);
  g.add(tank);
  // Uret, der løber: en skive med tolv streger og en viser
  const ur = new THREE.Group();
  ur.position.set(4.8, 1.8, 0);
  const urFarve = new THREE.Color(0.75, 0.8, 0.9);
  ur.add(fuld(cirkel(0, 0, 1.15), urFarve, { bredde: 2 }));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ur.add(fuld([[Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0], [Math.cos(a) * 1.08, Math.sin(a) * 1.08, 0]], urFarve, { bredde: 1.5 }));
  }
  const viser = new THREE.Group();
  viser.add(fuld([[0, 0, 0], [0, 0.85, 0]], new THREE.Color(1, 0.85, 0.45), { bredde: 2.5 }));
  ur.add(viser);
  const urNavn = skilt(N.ur, '#c8ccd6', 0.55);
  urNavn.position.set(0, -1.6, 0.5);
  ur.add(urNavn);
  g.add(ur);

  // Partiklen (stiplet, et bud), stemplet og glimtet
  const partikel = new THREE.Group();
  partikel.add(stiplet(cirkel(0, 0, 0.34, { dele: 32 }), { bredde: 2, streg: 0.12, mellem: 0.1 }));
  const partikelNavn = skilt(N.partikel, '#e8eeff', 0.48);
  partikelNavn.position.set(2.5, 0, 0.5);
  partikel.add(partikelNavn);
  partikel.visible = false;
  g.add(partikel);
  const st = stempel('GÆT', 1.1);
  st.sprite.position.set(-0.4, 2.9, 1);
  g.add(st.sprite);
  const glimt = glød(new THREE.Color(0.85, 0.95, 1.5), 3, 0);
  glimt.position.set(TANK.x + 0.2, TANK.y - 0.3, 0.1);
  g.add(glimt);
  const glimtNavn = skilt(N.glimt, '#e8f4ff', 0.55);
  glimtNavn.position.set(1.4, -2.4, 0.5);
  g.add(glimtNavn);
  // Måleren: 0-5 sigma. Det målte (2,6) i farve, grænsen for et fund (5) som en grå ramme.
  const måler = new THREE.Group();
  const M0 = 1.6, M1 = 7.0, MY = -4.6;
  const enhed = (M1 - M0) / 5;
  måler.add(fuld([[M0, MY - 0.22, 0], [M1, MY - 0.22, 0], [M1, MY + 0.22, 0], [M0, MY + 0.22, 0], [M0, MY - 0.22, 0]], new THREE.Color(0.45, 0.5, 0.6), { bredde: 1.5 }));
  const fyld = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.36), new THREE.MeshBasicMaterial({ color: 0x5fe3ff }));
  fyld.position.set(M0, MY, 0);
  måler.add(fyld);
  const sigma = skilt(N.sigma, '#8fe6ff', 0.55);
  sigma.position.set(M0 + 1.4, MY + 0.65, 0.5);
  const fem = skilt(N.fem, '#c8ccd6', 0.55);
  fem.position.set(M1 - 1.25, MY + 0.65, 0.5);
  måler.add(sigma, fem);
  måler.visible = false;
  g.add(måler);

  let t = -1; // tiden siden gættet
  let vent = 0; // tiden på trinet
  let gættet = false;
  const sætFyld = (f) => {
    const b = Math.max(0.001, f * 2.6 * enhed);
    fyld.scale.x = b;
    fyld.position.x = M0 + b / 2;
  };
  return {
    vis(valgt, linje) {
      g.visible = true;
      if (valgt === null) {
        gættet = false;
        t = -1;
        vent = 0;
        partikel.visible = false;
        glimt.material.opacity = 0;
        glimtNavn.visible = false;
        måler.visible = false;
        st.skjul();
        linje(T.lz);
        return;
      }
      if (!gættet) {
        gættet = true;
        t = 0;
        st.slå(ROLIG);
        partikel.visible = true;
        linje(T.glimt);
      }
    },
    skjul() { g.visible = false; },
    opdater(dt, tid, linje) {
      if (!g.visible) return;
      vent += dt;
      // Uret løber hurtigt: Én omgang er tænkt som mange dage
      viser.rotation.z = -vent * 1.6;
      if (!gættet && vent > 7 && vent - dt <= 7) linje(T.lzVent);
      let blink = 0;
      if (gættet) {
        t += dt;
        st.opdater(dt);
        // Partiklen falder gennem jorden og klippen ned i tanken (mørkt stof går gennem næsten alt)
        const f = THREE.MathUtils.clamp(t / T_GLIMT, 0, 1);
        partikel.position.set(TANK.x + 0.2, 7 + (TANK.y - 0.3 - 7) * f, 0.3);
        partikel.visible = f < 1;
        if (t >= T_GLIMT && t - dt < T_GLIMT) { lyd.tik(); glimtNavn.visible = true; }
        if (t >= T_GLIMT) {
          const a = t - T_GLIMT;
          // Glimtet: Uden ROLIG blinker det kort op. Med ROLIG toner det blødt ind og ud.
          blink = ROLIG ? Math.sin(Math.min(1, a / 2.4) * Math.PI) * 0.7 : Math.exp(-a * 2.2);
          glimt.material.opacity = 0.25 + blink;
          glimt.scale.setScalar(ROLIG ? 3 : 2 + blink * 2.5);
        }
        if (t >= T_MÅLER) {
          måler.visible = true;
          sætFyld(THREE.MathUtils.clamp((t - T_MÅLER) / (ROLIG ? 0.01 : 1.2), 0, 1));
        }
        if (t >= T_SIGMA && t - dt < T_SIGMA) linje(T.sigma);
      }
      // Lysfølerne lyser svagt, og stærkt et øjeblik ved glimtet
      for (let i = 0; i < FØLERE; i++) {
        const l = 0.22 + blink * 1.4;
        fFarve.set([0.5 * l + blink * 0.3, 0.6 * l + blink * 0.4, 0.8 * l + blink * 0.6], i * 3);
      }
      fGeo.attributes.color.needsUpdate = true;
    },
    test: () => ({ gættet, stempel: st.landet(), glimt: glimtNavn.visible, måler: måler.visible, fyld: fyld.scale.x / enhed, partikel: partikel.visible }),
  };
}

// ---------- Trin 3: kortet ----------
// Felter af små galakser med tre klumper: buerne i farve (det, man ser), og et kort over klumperne stiplet ud fra dem
// (et bud). Mod højre kant toner kortet ud: Dér er der ingen målinger, og intet er tegnet. Euclid med årstallet.
const KLUMPER = [[-3.6, 0.6, 1.5], [1.9, -0.6, 1.1], [4.9, 2.4, 0.8]];
function lavKort(gruppe, T, ROLIG) {
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const særlige = KLUMPER.map(([x, y]) => [x + 0.25, y - 0.2, 0.38]);
  const felt = lavFelt(g, LAV_KVALITET ? 40 : 60, PR_KILDE, særlige, { linser: KLUMPER });
  felt.bøj(null);
  // Kortet: tre ringe om hver klump, svagere jo længere ude og mod højre kant
  const kortGruppe = new THREE.Group();
  KLUMPER.forEach(([x, y, e], k) => {
    for (let n = 0; n < 3; n++) {
      const p = cirkel(x, y, e * (0.55 + n * 0.55), { dele: 72, bule: 0.08 + n * 0.03, fase: k * 1.7 + n });
      const lys = p.map(([px]) => (1 - n * 0.28) * THREE.MathUtils.clamp((6.6 - px) / 2.4, 0, 1));
      kortGruppe.add(stiplet(p, { lys, bredde: 2 }));
    }
  });
  kortGruppe.position.z = 0.1;
  g.add(kortGruppe);
  // Euclid: et lille rumteleskop (et rør bag et solskjold) med årstallet
  const euclid = new THREE.Group();
  euclid.position.set(-6.3, 4.4, 0.3);
  const ef = new THREE.Color(0.85, 0.88, 0.95);
  euclid.add(fuld([[-0.5, -0.35, 0], [0.5, -0.35, 0], [0.5, 0.35, 0], [-0.5, 0.35, 0], [-0.5, -0.35, 0]], ef, { bredde: 2 }),
    fuld([[0.5, -0.15, 0], [0.95, -0.15, 0], [0.95, 0.2, 0], [0.5, 0.2, 0]], ef, { bredde: 2 }),
    fuld([[-0.75, -0.6, 0], [-0.75, 0.75, 0]], new THREE.Color(0.95, 0.75, 0.35), { bredde: 3 }));
  const euclidNavn = skilt(T.navne.euclid, '#e8eeff', 0.55);
  euclidNavn.position.set(3.4, 0, 0.2);
  euclid.add(euclidNavn);
  g.add(euclid);
  let t = 0;
  let slut = null;
  let viste = false;
  return {
    vis(linje, ven) {
      g.visible = true;
      slut = ven;
      if (!viste) { viste = true; t = 0; }
      linje(ven ?? T.euclid);
    },
    skjul() { g.visible = false; },
    opdater(dt, tid, linje) {
      if (!g.visible) return;
      const før = t;
      t += dt;
      // Kortet tegnes ud fra buerne lidt efter (med ROLIG står det der med det samme)
      const f = ROLIG ? 1 : THREE.MathUtils.smoothstep(t, 0.8, 2.6);
      kortGruppe.scale.setScalar(0.85 + 0.15 * f);
      kortGruppe.visible = f > 0;
      for (const l of kortGruppe.children) l.material.opacity = f;
      if (!slut && før < 7 && t >= 7) linje(T.kort);
    },
    test: () => ({ buer: felt.test().buer, kort: kortGruppe.visible, euclid: euclid.visible, ringe: kortGruppe.children.length }),
  };
}

