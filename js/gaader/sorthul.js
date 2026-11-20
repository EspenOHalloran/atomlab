// Gåden "Hvad er der inde i et sort hul?" i 3D (G4c, docs/plan-gaader-3d.md). Teksterne står i js/data/gaader.js (scene).
// Linsen fra Kosmos bruges, som den er (lampen fra js/gaader/lys.js, js/kosmos/linse.js), og kun det nye lægges til:
// Trin 1: hullet med lysbøjningen, som man kan flyve rundt om (træk). Efter gættet tyngdebølgen fra 14. september 2015 som
// en tone og en kurve, der tegnes, mens den spiller (målt, i farve).
// Trin 2: de to kanter. Man flyver hen mod horisonten, og skærmen tones sort. Ringen er horisonten, hvor målingerne stopper.
// Efter gættet stemplet GÆT og Einsteins teori som stiplet: en streg ind mod midten, der toner ud, "højst ca. 67 sekunder
// til midten" og "uendelig: her virker teorien ikke". Intet punkt i midten, og ingen flyvning gennem horisonten.
// Trin 3 og det sidste billede: LISA, tre satellitter i en trekant bag Jorden, hvor armene bliver længere og kortere, når
// en tyngdebølge går forbi (voldsomt overdrevet).

import * as THREE from 'three';
import { verden } from '../scene3d.js';
import { glød, skilt } from '../kosmos/faelles.js';
import { lyd } from '../lyd.js';
import { gådeMed } from '../data/gaader.js';
import { lavLys } from './lys.js';
import { fuld, stiplet, stempel } from './streg.js';

// ---------- Tyngdebølgen fra 2015 (GW150914, arXiv:1602.03837) ----------
// Signalet stiger fra 35 Hz, når ca. 150 Hz på ca. 0,2 s (ca. 8 svingninger) og ringer ud ved ca. 250 Hz. Kurven er en
// enkel formel (frekvensen vokser som (tc - t)^(-3/8) og styrken som f^(2/3), så ringer det nye hul ud på ca. 4 ms), ikke
// de rigtige måledata. Tonen lægges to oktaver op og spilles fire gange så langsomt (se "Ærligt talt").
export const BØLGE = { fra: 35, top: 150, ring: 250, ind: 0.2, ringTid: 0.004, slut: 0.225, oktaver: 2, langsommere: 4 };
const TAU0 = BØLGE.ind / (1 - (BØLGE.fra / BØLGE.top) ** (8 / 3)); // så frekvensen er præcis "top" efter "ind" sekunder
export function frekvens(t) {
  if (t <= BØLGE.ind) return BØLGE.fra * ((TAU0 - t) / TAU0) ** (-3 / 8);
  return BØLGE.top + (BØLGE.ring - BØLGE.top) * (1 - Math.exp(-(t - BØLGE.ind) / 0.003));
}
function styrke(t) {
  if (t <= BØLGE.ind) return (frekvens(t) / BØLGE.top) ** (2 / 3);
  return Math.exp(-(t - BØLGE.ind) / BØLGE.ringTid);
}
const SPILLETID = BØLGE.slut * BØLGE.langsommere; // ca. 0,9 s
function spilTonen() {
  const n = 256;
  const f = [], s = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * BØLGE.slut;
    f.push(frekvens(t) * 2 ** BØLGE.oktaver);
    s.push(styrke(t));
  }
  lyd.tyngdebølge(f, s, SPILLETID);
}

// ---------- Pladserne (planet z = 0) ----------
const HB1 = 6.2, HH1 = 4.6; // trin 1: hullet foroven og kurven forneden
const HUL_Y = 1.1; // hullet, når kurven står under det
const HUL_SKALA = 1.35; // lampen er ±3,2 enheder, her ±4,3
const STOR_SKALA = 1.8; // før gættet står hullet alene, større og midt i billedet
const BØLGE_Y = -3.35;
const BØLGE_B = 5.3; // den halve bredde af kurven
const BØLGE_H = 0.62; // den største udsving
const HB2 = 7.0, HH2 = 4.8; // trin 2: horisonten
const R = 3.9; // horisonten
const MIDT2 = new THREE.Vector3(0, 0.1, 0);
const DYK = 2.6; // sekunder om at flyve hen til horisonten
const HB3 = 8.2, HH3 = 5.2; // trin 3: LISA
const SOL = new THREE.Vector3(-6.4, -3.1, 0);
const BANE_R = 9.2;
const JORD_V = 32 * (Math.PI / 180);
const LISA_V = 12 * (Math.PI / 180); // LISA følger ca. 20° efter Jorden
const ARM = 2.4; // tegnet ca. 15 gange større end 2,5 millioner km
const CYAN = new THREE.Color(0.37, 0.89, 1.0);
const VARM = new THREE.Color(1.0, 0.55, 0.2);
const ORDEN = 50; // trin 2 tegnes oven på det sorte

const glat = (x) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };

export function lavNær(ctx) {
  const { gruppe, linje, knapper, passer, ROLIG } = ctx;
  const T = gådeMed('sorthul').scene;
  const N = T.navne;
  const { kamera, styring } = verden;

  // Hullet: lampen med linsen fra Kosmos
  const lampe = lavLys('sorthul');
  const hul = lampe.gruppe;
  hul.position.set(0, HUL_Y, 0);
  hul.scale.setScalar(HUL_SKALA);
  gruppe.add(hul);

  const bølge = lavBølge(gruppe, N, ROLIG);
  const sort = lavSort(gruppe);
  const kanter = lavKanter(gruppe, N, ROLIG);
  let lisa = null;

  let tilstand = null; // 'hul' | 'tone' | 'ind' | 'inde' | 'svar' | 'lisa'
  let tDyk = 0;
  let tid0 = 0;
  const hulMål = { y: 0, skala: STOR_SKALA }; // hvor hullet glider hen i trin 1
  const hulNu = { y: 0, skala: STOR_SKALA }; // hvor det er nu

  function sætHul(y, skala) {
    hulNu.y = y;
    hulNu.skala = skala;
    hul.position.set(0, y, 0);
    hul.scale.setScalar(skala);
  }
  function stilHul() {
    hul.visible = true;
    sætHul(hulMål.y, hulMål.skala);
    sort.sæt(0);
    kanter.g.visible = false;
    lisa?.skjul();
    passer(HB1, HH1);
    styring.enabled = true;
    styring.autoRotate = !ROLIG;
    styring.autoRotateSpeed = 0.4;
  }
  function stilFlad(hb, hh) {
    styring.enabled = false;
    styring.autoRotate = false;
    passer(hb, hh);
  }
  // Fra dykket til tegningen af horisonten: Hullet skjules (det er sort nu), og kameraet stilles lige foran tegningen
  function inde() {
    tilstand = 'inde';
    hul.visible = false;
    sætHul(hulMål.y, hulMål.skala);
    sort.sæt(1);
    stilFlad(HB2, HH2);
    kanter.vis(false);
    linje(T.inde);
  }

  function trin(n, valgt) {
    if (n === 0) {
      // Før gættet står hullet stort i midten. Efter gættet glider det op og bliver mindre, så kurven kan stå under det
      hulMål.y = valgt === null ? 0 : HUL_Y;
      hulMål.skala = valgt === null ? STOR_SKALA : HUL_SKALA;
      if (tilstand !== 'hul' && tilstand !== 'tone') stilHul();
      bølge.g.visible = valgt !== null;
      knapper(valgt !== null ? [{ tekst: N.igen, gør: () => { bølge.tegn(); spilTonen(); } }] : []);
      if (valgt === null) {
        tilstand = 'hul';
        linje(T.start);
      } else if (tilstand !== 'tone') {
        tilstand = 'tone';
        linje(T.efter);
        bølge.tegn();
        spilTonen();
      }
      return;
    }
    bølge.g.visible = false;
    knapper([]);
    if (n === 1) {
      if (valgt === null) {
        if (tilstand === 'ind' || tilstand === 'inde') return;
        tilstand = 'ind';
        tDyk = 0;
        styring.enabled = false;
        styring.autoRotate = false;
        lisa?.skjul();
        hul.visible = true;
        linje(T.ind);
        return;
      }
      if (tilstand !== 'inde' && tilstand !== 'svar') inde();
      if (tilstand !== 'svar') {
        tilstand = 'svar';
        kanter.vis(true);
        linje(T.svar);
      }
      return;
    }
    // Trin 3 og det sidste billede
    if (tilstand !== 'lisa') {
      tilstand = 'lisa';
      hul.visible = false;
      sort.sæt(0);
      kanter.g.visible = false;
      stilFlad(HB3, HH3);
    }
    lisa ??= lavLisa(gruppe, N, ROLIG);
    lisa.vis();
    linje(n >= 3 ? `Sig det til en ven: ${gådeMed('sorthul').ven}` : T.lisa);
  }

  const p = new THREE.Vector3();
  function opdater(dt, tid) {
    tid0 = tid;
    if (tilstand === 'hul' || tilstand === 'tone') {
      const k = ROLIG ? 1 : 1 - Math.exp(-dt * 2.5);
      sætHul(hulNu.y + (hulMål.y - hulNu.y) * k, hulNu.skala + (hulMål.skala - hulNu.skala) * k);
    }
    lampe.opdater(dt, tid);
    if (tilstand === 'tone') bølge.opdater(dt, hul.position);
    if (tilstand === 'ind') {
      tDyk += dt;
      if (ROLIG) {
        sort.sæt(tDyk / 0.8);
        if (tDyk > 0.9) inde();
      } else {
        // Hullet vokser og glider ind midt i billedet, som om kameraet flyver derhen (linsen regner for et kamera, der står
        // stille uden for horisonten, så kameraet selv flytter sig ikke)
        const f = glat(tDyk / DYK);
        hul.scale.setScalar(hulNu.skala * (1 + 3.5 * f * f));
        p.set(0, hulNu.y, 0).lerp(styring.target, f);
        hul.position.copy(p);
        sort.sæt(glat((tDyk / DYK - 0.45) / 0.55));
        if (tDyk > DYK + 0.3) inde();
      }
    }
    if (tilstand === 'inde' || tilstand === 'svar') kanter.opdater(dt);
    if (tilstand === 'lisa') lisa.opdater(dt);
    sort.følg(kamera);
  }

  return {
    get drejer() { return tilstand === 'hul' || tilstand === 'tone'; },
    egetKamera: false,
    trin,
    opdater,
    // Et tryk under flyvningen hen mod horisonten springer den over
    tryk: () => { if (tilstand === 'ind') inde(); },
    spol: (s) => { for (let i = 0; i < s * 30; i++) opdater(1 / 30, tid0 + i / 30); },
    test: () => ({
      tilstand, drejer: tilstand === 'hul' || tilstand === 'tone', lampe: lampe.test(), hulSes: hul.visible,
      bølge: bølge.test(), sort: sort.test(), kanter: kanter.test(), lisa: lisa?.test() ?? null,
    }),
    fjern: () => {
      lampe.fjern();
      styring.enabled = true;
      styring.autoRotate = false;
    },
  };
}

// ---------- Trin 1: kurven for tyngdebølgen ----------
// Kurven står under hullet og vender altid mod kameraet (man kan flyve rundt om hullet imens). Den tegnes, mens tonen spiller.
function lavBølge(gruppe, N, ROLIG) {
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const n = 900;
  const punkter = [];
  let fase = 0;
  const dt = BØLGE.slut / n;
  for (let i = 0; i <= n; i++) {
    const t = i * dt;
    punkter.push([-BØLGE_B + (2 * BØLGE_B * t) / BØLGE.slut, BØLGE_H * styrke(t) * Math.cos(fase), 0]);
    fase += 2 * Math.PI * frekvens(t) * dt;
  }
  const kurve = fuld(punkter, CYAN, { bredde: 2.2 });
  kurve.frustumCulled = false;
  const hoved = glød(new THREE.Color(0.8, 1.3, 1.5), 0.7, 0.9);
  const titel = skilt(N.ligo, '#9feaff', 0.44);
  titel.position.set(0, 1.05, 0.1);
  const tid = skilt(N.tid, '#9fb4cc', 0.36);
  tid.position.set(BØLGE_B - 1.0, -0.95, 0.1);
  // En lille streg under kurven, der viser de 0,2 sekunder (fra start til toppen)
  const x1 = -BØLGE_B + (2 * BØLGE_B * BØLGE.ind) / BØLGE.slut;
  const skala = fuld([[-BØLGE_B, -0.7, 0], [x1, -0.7, 0]], new THREE.Color(0.45, 0.55, 0.68), { bredde: 1.4 });
  tid.position.x = (x1 - BØLGE_B) / 2 + 0.2;
  g.add(kurve, hoved, titel, tid, skala);
  const segmenter = kurve.geometry.attributes.instanceStart.count;
  let t = -1;
  function stil() {
    const f = ROLIG ? 1 : Math.min(1, t / SPILLETID);
    kurve.geometry.instanceCount = Math.max(1, Math.round(segmenter * f));
    const [x, y] = punkter[Math.min(n, Math.round(n * f))];
    hoved.position.set(x, y, 0.05);
    hoved.visible = f < 1;
  }
  return {
    g,
    tegn() { t = 0; stil(); },
    opdater(dt, hulPos) {
      if (!g.visible) return;
      const { kamera } = verden;
      g.quaternion.copy(kamera.quaternion);
      g.position.set(0, BØLGE_Y - HUL_Y, 0).applyQuaternion(kamera.quaternion).add(hulPos);
      if (t >= 0 && t <= SPILLETID + 0.1) { t += dt; stil(); }
    },
    test: () => ({
      ses: g.visible, tegnet: segmenter ? kurve.geometry.instanceCount / segmenter : 0,
      fra: Math.round(frekvens(0)), top: Math.round(frekvens(BØLGE.ind)), ring: Math.round(frekvens(BØLGE.slut)),
      svingninger: Math.round(svingninger(0, BØLGE.ind)), spilletid: SPILLETID,
    }),
  };
}
// Antal svingninger fra t0 til t1 (til testen: ca. 8 fra 35 til 150 Hz i artiklen)
function svingninger(t0, t1) {
  let s = 0;
  const n = 2000;
  for (let i = 0; i < n; i++) s += frekvens(t0 + ((i + 0.5) / n) * (t1 - t0)) * ((t1 - t0) / n);
  return s;
}

// ---------- Det sorte lag ----------
// En sort flade lige foran kameraet, som toner billedet sort, når man når horisonten. Tegningen af horisonten ligger ovenpå.
function lavSort(gruppe) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const flade = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  flade.renderOrder = ORDEN - 1;
  flade.frustumCulled = false;
  flade.visible = false;
  flade.scale.setScalar(10);
  gruppe.add(flade);
  const frem = new THREE.Vector3();
  return {
    sæt(a) {
      mat.opacity = Math.min(1, Math.max(0, a));
      flade.visible = mat.opacity > 0;
    },
    følg(kamera) {
      if (!flade.visible) return;
      // Fladen står 0,5 foran kameraet (i gruppens rum, som er verdens)
      frem.set(0, 0, -0.5).applyQuaternion(kamera.quaternion);
      flade.position.copy(kamera.position).add(frem);
      flade.quaternion.copy(kamera.quaternion);
    },
    test: () => Math.round(mat.opacity * 100) / 100,
  };
}

// ---------- Trin 2: de to kanter ----------
// Ringen er horisonten (fuld farve: Udenfor passer alle målinger med teorien), og udenfor lyser det svagt. Indenfor er der
// kun Einsteins teori (stiplet), og den toner ud før midten, hvor teorien holder op med at virke. Intet punkt i midten.
function lavKanter(gruppe, N, ROLIG) {
  const g = new THREE.Group();
  g.visible = false;
  g.position.copy(MIDT2);
  gruppe.add(g);
  const orden = (o) => { o.renderOrder = ORDEN; if (o.material) o.material.depthTest = false; return o; };

  const cirkel = [];
  for (let k = 0; k <= 128; k++) { const a = (k / 128) * Math.PI * 2; cirkel.push([Math.cos(a) * R, Math.sin(a) * R, 0]); }
  const ring = orden(fuld(cirkel, VARM, { bredde: 3 }));
  // Skæret udenfor: en flad ring, der er varm ved horisonten og bliver mørk udad
  const skærGeo = new THREE.RingGeometry(R, R + 0.9, 128, 1);
  const pos = skærGeo.attributes.position;
  const farver = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i));
    const f = r < R + 0.01 ? 0.16 : 0;
    farver.set([VARM.r * f, VARM.g * f, VARM.b * f], i * 3);
  }
  skærGeo.setAttribute('color', new THREE.BufferAttribute(farver, 3));
  const skær = orden(new THREE.Mesh(skærGeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  const navn = orden(skilt(N.horisont, '#ffc58a', 0.46));
  navn.position.set(0, R + 0.5, 0.1);
  g.add(skær, ring, navn);

  // Efter gættet: "her stopper målingerne", GÆT og teorien som stiplet
  const efter = new THREE.Group();
  const stop = orden(skilt(N.stopper, '#ffc58a', 0.38));
  stop.position.set(0, -R - 0.5, 0.1);
  // Stregen ind mod midten: fuld lys de første 55 %, så toner den ud og slutter før midten
  const ind = [], lys = [];
  const x0 = -R, x1 = -0.55;
  for (let i = 0; i <= 30; i++) {
    const f = i / 30;
    ind.push([x0 + (x1 - x0) * f, 0, 0]);
    lys.push(f < 0.55 ? 1 : Math.max(0, 1 - (f - 0.55) / 0.45));
  }
  const streg = orden(stiplet(ind, { bredde: 2.2, lys, streg: 0.22, mellem: 0.16 }));
  const tid = orden(skilt(N.tid67, '#e8eeff', 0.42));
  tid.position.set(-1.25, 1.15, 0.1);
  const mælkevej = orden(skilt(N.mælkevej, '#c9d3ea', 0.34));
  mælkevej.position.set(-1.25, 0.7, 0.1);
  const uendelig = orden(skilt(N.uendelig, '#e8eeff', 0.42));
  uendelig.position.set(0, -1.05, 0.1);
  efter.add(stop, streg, tid, mælkevej, uendelig);
  efter.visible = false;
  g.add(efter);
  const st = stempel('GÆT', 0.85);
  st.sprite.position.set(R + 1.6, R * 0.55, 0.2);
  st.sprite.renderOrder = ORDEN + 2;
  g.add(st.sprite);

  let tInd = 0; // ringen toner ind
  let tSvar = -1;
  const lysende = [ring, skær, navn];
  const sætLys = (liste, f) => { for (const o of liste) o.traverse((x) => { if (x.material) x.material.opacity = f; }); };
  return {
    g,
    vis(svar) {
      g.visible = true;
      if (!svar) { tInd = ROLIG ? 1 : 0; tSvar = -1; efter.visible = false; st.skjul(); sætLys(lysende, tInd); return; }
      tInd = 1;
      sætLys(lysende, 1);
      tSvar = 0;
      st.slå(ROLIG);
      efter.visible = true;
      sætLys([efter], 0);
    },
    opdater(dt) {
      if (!g.visible) return;
      if (tInd < 1) { tInd = Math.min(1, tInd + dt / 0.8); sætLys(lysende, tInd); }
      if (tSvar >= 0) {
        tSvar += dt;
        st.opdater(dt);
        sætLys([efter], ROLIG ? 1 : glat((tSvar - 0.35) / 0.7));
      }
    },
    test: () => ({
      ses: g.visible, horisont: ring.visible && g.visible, stempel: st.landet(), teori: efter.visible,
      tekster: efter.visible ? [N.tid67, N.uendelig] : [],
      // Den stiplede streg slutter før midten og er helt udtonet dér (intet punkt i midten)
      slut: Math.round(Math.abs(x1) * 100) / 100, sidsteLys: lys[lys.length - 1],
    }),
  };
}

// ---------- Trin 3: LISA ----------
// Solen, Jordens bane og LISA ca. 20° bag Jorden: tre satellitter i en trekant med laserstråler imellem. Trekanten er tegnet
// mange gange større, og armene bliver voldsomt overdrevet længere og kortere, når en tyngdebølge går forbi.
function lavLisa(gruppe, N, ROLIG) {
  const g = new THREE.Group();
  g.visible = false;
  gruppe.add(g);
  const sol = glød(new THREE.Color(1.5, 1.2, 0.7), 2.2, 1);
  sol.position.copy(SOL);
  const bane = []; // Jordens bane (et stykke af den)
  for (let k = 0; k <= 80; k++) { const a = -0.35 + (k / 80) * 1.75; bane.push([SOL.x + Math.cos(a) * BANE_R, SOL.y + Math.sin(a) * BANE_R, 0]); }
  const jord = glød(new THREE.Color(0.35, 0.65, 1.5), 0.75, 1);
  jord.position.set(SOL.x + Math.cos(JORD_V) * BANE_R, SOL.y + Math.sin(JORD_V) * BANE_R, 0);
  const midt = new THREE.Vector3(SOL.x + Math.cos(LISA_V) * BANE_R, SOL.y + Math.sin(LISA_V) * BANE_R, 0);
  const solNavn = skilt(N.solen, '#ffe2a8', 0.46);
  solNavn.position.set(SOL.x + 0.4, SOL.y + 1.6, 0.1);
  const jordNavn = skilt(N.jorden, '#9fc4ff', 0.46);
  jordNavn.position.set(jord.position.x + 1.25, jord.position.y + 0.25, 0.1);
  const baneLinje = fuld(bane, new THREE.Color(0.35, 0.55, 1.0), { bredde: 1.6 });
  baneLinje.material.opacity = 0.55;
  g.add(sol, baneLinje, jord, solNavn, jordNavn);

  // Trekanten: tre hjørner om midten, og laserstrålerne som en lukket streg med fire punkter
  const hjørner = [0, 1, 2].map((i) => {
    const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
    return new THREE.Vector2(Math.cos(a), Math.sin(a)).multiplyScalar(ARM / Math.sqrt(3));
  });
  const laser = fuld([...hjørner, hjørner[0]].map((h) => [midt.x + h.x, midt.y + h.y, 0]), new THREE.Color(1.0, 0.35, 0.3), { bredde: 1.8 });
  laser.frustumCulled = false;
  const sonder = hjørner.map(() => glød(new THREE.Color(1.5, 1.2, 0.6), 0.55, 1));
  const lisaNavn = skilt(N.lisa, '#ffd58a', 0.46);
  lisaNavn.position.set(midt.x + 2.9, midt.y + 0.4, 0.1);
  const arm = skilt(N.arm, '#d6deef', 0.38);
  arm.position.set(midt.x, midt.y - ARM / (2 * Math.sqrt(3)) - 0.45, 0.1);
  g.add(laser, ...sonder, lisaNavn, arm);
  const buf = laser.geometry.attributes.instanceStart.data;
  let t = 0;
  let bølget = 0; // største ændring af en arm (til testen)
  const p = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
  function stil() {
    // En tyngdebølge, der kommer lige mod os (vinkelret på billedet): strækker den ene led og trykker den anden, og så omvendt
    const e = ROLIG ? 0 : 0.07 * Math.sin(t * Math.PI * 2 * 0.6);
    hjørner.forEach((h, i) => p[i].set(h.x * (1 + e), h.y * (1 - e)));
    p.forEach((q, i) => sonder[i].position.set(midt.x + q.x, midt.y + q.y, 0.05));
    // Hver laserstreg: start (x, y, z) og slut (x, y, z) efter hinanden
    for (let i = 0; i < 3; i++) {
      const a = p[i], b = p[(i + 1) % 3];
      buf.array.set([midt.x + a.x, midt.y + a.y, 0, midt.x + b.x, midt.y + b.y, 0], i * 6);
    }
    buf.needsUpdate = true;
    bølget = Math.max(bølget, Math.abs(p[0].distanceTo(p[1]) / ARM - 1));
  }
  stil();
  return {
    vis() { g.visible = true; },
    skjul() { g.visible = false; },
    opdater(dt) { if (!g.visible) return; t += dt; stil(); },
    test: () => ({
      ses: g.visible, sonder: sonder.length, bag: Math.round(((JORD_V - LISA_V) * 180) / Math.PI), bølget: Math.round(bølget * 100) / 100,
    }),
  };
}
