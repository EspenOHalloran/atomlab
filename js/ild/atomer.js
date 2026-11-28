// "Se atomerne" i Ild (luppen, drejebogen docs/drejebog-ild.md afsnit 3, trin 3): et lille stykke af en stearinkæde
// i flammens kant (to kulstof og fire hydrogen, ethen) og tre oxygenmolekyler. Man trækker O₂ hen til stykket ét ad
// gangen, som man trak hydrogen hen til oxygen i "Når atomer mødes". Ved det tredje bytter atomerne partnere og bliver
// til 2 CO₂ og 2 H₂O med et glimt af varme: C₂H₄ + 3 O₂ → 2 CO₂ + 2 H₂O. Ingen atomer forsvinder (12 før og 12 efter).
// Tegningen er MolekyleTegning fra js/molekyle3d.js (kemikernes farver og de delte elektronpar som i Molekyler).
// Molekylerne ligger i skærmens plan (z = 0) og drejer kun om z, så man altid ser dem forfra.

import * as THREE from 'three';
import { MolekyleTegning } from '../molekyle3d.js';
import { lavPrikTekstur, ROLIG } from '../scene3d.js';

const S = 3; // enheder pr. Å (som i "Del elektroner")
const R = 0.866; // sin 60°
// Skabelonerne: atomer (symbol og plads i Å · S), bindinger og frie elektronpar (retninger)
const SKABELON = {
  ethen: {
    atomer: [['C', -2.01, 0], ['C', 2.01, 0], ['H', -3.72, 2.79], ['H', -3.72, -2.79], ['H', 3.72, 2.79], ['H', 3.72, -2.79]],
    bånd: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]],
    frie: [],
  },
  o2: {
    atomer: [['O', -1.81, 0], ['O', 1.81, 0]],
    bånd: [[0, 1, 2]],
    frie: [[0, -0.5, R], [0, -0.5, -R], [1, 0.5, R], [1, 0.5, -R]],
  },
  co2: {
    atomer: [['O', -3.48, 0], ['C', 0, 0], ['O', 3.48, 0]],
    bånd: [[0, 1, 2], [1, 2, 2]],
    frie: [[0, -0.5, R], [0, -0.5, -R], [2, 0.5, R], [2, 0.5, -R]],
  },
  vand: {
    atomer: [['O', 0, 0], ['H', -2.28, -1.77], ['H', 2.28, -1.77]],
    bånd: [[0, 1, 1], [0, 2, 1]],
    frie: [[0, -0.55, 0.835], [0, 0.55, 0.835]],
  },
};
// Atomerne har faste numre: 0-5 ethen (C, C, H, H, H, H), 6-11 de tre O₂ (a, b og c, to O hver)
const O2_ATOMER = [[6, 7], [8, 9], [10, 11]];
const O2_START = [[-11.5, -5.6, 0.4], [11.2, -6.2, -0.5], [0.6, 10.6, 1.2]]; // x, y og vinkel
const PLADSER = [[-7.05, 4.35], [7.05, 4.35], [0, -6.75]]; // hvor de lægger sig ved stykket (oppe til venstre, oppe til højre, under)
const FANG = 11.25; // slippes O₂ så tæt på stykket (enheder), lægger det sig på en plads (et rundt mål)
const REAKTION_TID = ROLIG ? 0.6 : 1.5; // sekunder
// Navnene på molekylerne. Før reaktionen står de på stykket og på de frie O₂, mens man trækker (prøven 28. november 2026:
// sønnen vidste ikke, hvad oxygen og stearin var). Et O₂, der ligger på plads, mister sit navn, så der ikke er for mange.
export const NAVN = { ethen: 'Stearin fra lyset', o2: 'O₂: oxygen (ilt)', co2: 'CO₂', vand: 'H₂O (vand)' };
// Efter reaktionen: hvert produkt, dets atomer (numrene) i skabelonens rækkefølge, og hvor det ender
const PRODUKTER = [
  { slags: 'co2', navn: NAVN.co2, atomer: (o) => [o[0][0], 0, o[2][0]], plads: [-8.5, 4.2], ud: [-0.7, 0.35] },
  { slags: 'co2', navn: NAVN.co2, atomer: (o) => [o[1][1], 1, o[2][1]], plads: [8.5, 4.2], ud: [0.7, 0.35] },
  { slags: 'vand', navn: NAVN.vand, atomer: (o) => [o[0][1], 2, 3], plads: [-6, -6], ud: [-0.5, -0.5] },
  { slags: 'vand', navn: NAVN.vand, atomer: (o) => [o[1][0], 4, 5], plads: [6, -6], ud: [0.5, -0.5] },
];
export const ATOM_KASSE = [14.5, 12]; // halv bredde og højde (enheder), som scenen skal kunne ses i

const glat = (t) => t * t * (3 - 2 * t);

export function lavAtomScene() {
  const gruppe = new THREE.Group();
  const tegning = new MolekyleTegning();
  gruppe.add(tegning.gruppe);
  const atomer = Array.from({ length: 12 }, (_, i) => ({ symbol: i < 2 ? 'C' : i < 6 ? 'H' : 'O', p: new THREE.Vector3(), lys: 0, stor: false, q: 0 }));
  // Glimtet af varme midt i reaktionen
  const glimt = new THREE.Sprite(new THREE.SpriteMaterial({ map: lavPrikTekstur(true), color: new THREE.Color(2.6, 1.3, 0.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glimt.visible = false;
  glimt.renderOrder = 9;
  gruppe.add(glimt);

  // Molekylerne: { slags, idx (atomernes numre), pos, vinkel, drej, v }
  let molekyler = [];
  let o2 = []; // de tre O₂ (molekyler), og hvilken plads de har (-1 = fri)
  let fase = 'klar'; // 'klar' → 'reagerer' → 'færdig'
  let rt = 0; // tiden i reaktionen
  let tid = 0;
  let træk = null; // { m, forskyd } mens et O₂ trækkes
  let lagt = 0; // så mange O₂ ligger ved stykket
  const tegneBånd = [];
  const tegneRet = [];
  const fra = atomer.map(() => new THREE.Vector3());
  const til = atomer.map(() => new THREE.Vector3());
  const tV = new THREE.Vector3();
  const tV2 = new THREE.Vector3();
  const navne = [];
  const navnPos = [0, 1, 2, 3, 4].map(() => new THREE.Vector3());
  let produkter = [];

  const molekyle = (slags, idx, x, y, vinkel = 0) => ({ slags, idx, pos: new THREE.Vector3(x, y, 0), vinkel, drej: 0, v: new THREE.Vector3(), plads: -1, mål: null });

  function nulstil() {
    fase = 'klar';
    rt = 0;
    træk = null;
    lagt = 0;
    glimt.visible = false;
    const ethen = molekyle('ethen', [0, 1, 2, 3, 4, 5], 0, 0, 0);
    ethen.drej = 0;
    o2 = O2_ATOMER.map((idx, i) => {
      const m = molekyle('o2', idx, O2_START[i][0], O2_START[i][1], O2_START[i][2]);
      m.drej = (i % 2 ? -1 : 1) * 0.25;
      m.svæv = i * 2.1;
      return m;
    });
    molekyler = [ethen, ...o2];
    produkter = [];
    for (const a of atomer) a.lys = 0;
    placér();
  }

  // Atomernes pladser ud fra molekylernes plads og vinkel
  function placér() {
    for (const m of molekyler) {
      const sk = SKABELON[m.slags];
      const c = Math.cos(m.vinkel), s = Math.sin(m.vinkel);
      sk.atomer.forEach(([, x, y], k) => {
        atomer[m.idx[k]].p.set(m.pos.x + x * c - y * s, m.pos.y + x * s + y * c, m.pos.z);
      });
    }
  }

  function bindingerOgPar(liste) {
    tegneBånd.length = 0;
    tegneRet.length = 0;
    for (const m of liste) {
      const sk = SKABELON[m.slags];
      for (const [a, b, orden] of sk.bånd) tegneBånd.push({ a: m.idx[a], b: m.idx[b], orden });
      const c = Math.cos(m.vinkel), s = Math.sin(m.vinkel);
      for (const [k, x, y] of sk.frie) tegneRet.push({ atom: m.idx[k], v: [x * c - y * s, x * s + y * c, 0], slags: 'frit' });
    }
  }

  // Lægger et O₂ på den nærmeste ledige plads ved stykket
  function læg(m) {
    if (m.plads >= 0 || fase !== 'klar') return false;
    const fri = PLADSER.map((p, i) => i).filter((i) => !o2.some((x) => x.plads === i));
    if (!fri.length) return false;
    fri.sort((a, b) => Math.hypot(m.pos.x - PLADSER[a][0], m.pos.y - PLADSER[a][1]) - Math.hypot(m.pos.x - PLADSER[b][0], m.pos.y - PLADSER[b][1]));
    m.plads = fri[0];
    m.mål = new THREE.Vector3(PLADSER[m.plads][0], PLADSER[m.plads][1], 0);
    lagt++;
    return true;
  }

  function startReaktion() {
    fase = 'reagerer';
    rt = 0;
    for (const a of atomer) a.lys = 0;
    // O₂ efter pladsen (0 oppe til venstre, 1 oppe til højre, 2 under), så hvert O₂ bliver delt mellem to nye molekyler
    const efterPlads = [0, 1, 2].map((p) => o2.find((m) => m.plads === p).idx);
    produkter = PRODUKTER.map((pr) => {
      const m = molekyle(pr.slags, pr.atomer(efterPlads), pr.plads[0], pr.plads[1], 0);
      m.navn = pr.navn;
      m.v.set(pr.ud[0], pr.ud[1], 0);
      m.drej = (Math.random() - 0.5) * 0.5;
      return m;
    });
    atomer.forEach((a, i) => fra[i].copy(a.p));
    // Hvor atomerne ender
    for (const m of produkter) {
      const sk = SKABELON[m.slags];
      sk.atomer.forEach(([, x, y], k) => til[m.idx[k]].set(m.pos.x + x, m.pos.y + y, 0));
    }
  }

  function opdater(dt, kamera) {
    tid += dt;
    if (fase === 'klar') {
      for (const m of o2) {
        if (træk?.m === m) continue;
        if (m.mål) {
          // Glider på plads og lægger sig vandret
          m.pos.lerp(m.mål, 1 - Math.exp(-dt * 5));
          m.vinkel += (Math.round(m.vinkel / Math.PI) * Math.PI - m.vinkel) * (1 - Math.exp(-dt * 5));
        } else {
          // Svæver lidt og drejer langsomt
          m.svæv += dt;
          m.pos.y += Math.sin(m.svæv * 0.9) * 0.25 * dt;
          m.pos.x += Math.cos(m.svæv * 0.7) * 0.18 * dt;
          m.vinkel += m.drej * dt;
        }
      }
      // Alle tre er på plads: atomerne bytter partnere
      if (lagt === 3 && o2.every((m) => m.pos.distanceTo(m.mål) < 0.25)) startReaktion();
      placér();
      bindingerOgPar(molekyler);
    } else if (fase === 'reagerer') {
      rt += dt / REAKTION_TID;
      const t = glat(Math.min(1, rt));
      atomer.forEach((a, i) => {
        a.p.lerpVectors(fra[i], til[i], t);
        a.lys = Math.max(0, 1 - Math.abs(rt - 0.5) * 2.2);
      });
      bindingerOgPar(rt < 0.5 ? molekyler : produkter);
      glimt.visible = rt > 0.3 && rt < 0.95;
      const g = Math.max(0, 1 - Math.abs(rt - 0.55) / 0.3);
      glimt.scale.setScalar(4 + 14 * g);
      glimt.material.opacity = g;
      if (rt >= 1) {
        fase = 'færdig';
        molekyler = produkter;
        glimt.visible = false;
        for (const a of atomer) a.lys = 0;
      }
    } else {
      // De nye molekyler driver langsomt væk (de er varme) og bremser
      for (const m of molekyler) {
        m.pos.addScaledVector(m.v, dt);
        m.v.multiplyScalar(1 - dt * 0.25);
        m.vinkel += m.drej * dt;
      }
      placér();
      bindingerOgPar(molekyler);
    }
    // Ringen og stregen, mens man trækker: blå, når O₂ er tæt nok på til at lægge sig
    let linje = null;
    if (træk) {
      const nær = træk.m.pos.length() < FANG;
      linje = { fra: træk.m.pos, til: tV.set(0, 0, 0), ok: nær };
    }
    navne.length = 0;
    if (fase === 'færdig') molekyler.forEach((m, i) => navne.push({ tekst: m.navn, p: navnPos[i].copy(m.pos).add(tV2.set(0, m.slags === 'vand' ? 2.6 : 2.4, 0)) }));
    else if (fase === 'klar') {
      navne.push({ tekst: NAVN.ethen, p: navnPos[0].set(0, 4.3, 0) });
      o2.forEach((m, i) => {
        if (m.plads >= 0) return;
        // Over molekylet (under det, når det er højt oppe), så langt væk, at navnet går fri af det drejede O₂
        const af = Math.abs(Math.sin(m.vinkel)) * 1.81 + 2.3;
        navne.push({ tekst: NAVN.o2, p: navnPos[i + 1].copy(m.pos).add(tV2.set(0, m.pos.y > 6 ? -af : af, 0)) });
      });
    }
    tegning.tegn({ atomer, bånd: tegneBånd, retninger: tegneRet, linje, navne, kamera, tid, ladninger: false });
  }

  // ---------- Træk (skærmens punkt → et O₂) ----------
  // Det frie O₂ nærmest punktet på skærmen (px), hvis det er tæt nok på
  function vedSkærm(x, y, kamera, rect, finger) {
    if (fase !== 'klar') return null;
    let bedst = null, afstand = Infinity;
    for (const m of o2) {
      if (m.plads >= 0) continue;
      tV.copy(m.pos).project(kamera);
      const sx = rect.left + (tV.x + 1) / 2 * rect.width;
      const sy = rect.top + (1 - tV.y) / 2 * rect.height;
      const d = Math.hypot(sx - x, sy - y);
      // Molekylets halve længde på skærmen
      tV.copy(m.pos).add(tV2.set(3, 0, 0)).project(kamera);
      const r = Math.abs((tV.x + 1) / 2 * rect.width - sx);
      if (d < (finger ? 60 : 40) + r && d < afstand) { bedst = m; afstand = d; }
    }
    return bedst;
  }

  return {
    gruppe,
    opdater,
    nulstil,
    // Træk: start (punkt i planet z = 0), flyt og slip. Giver true, når et O₂ blev lagt på plads.
    tagFat(x, y, kamera, rect, finger, punkt) {
      const m = vedSkærm(x, y, kamera, rect, finger);
      if (!m) return false;
      træk = { m, forskyd: m.pos.clone().sub(punkt) };
      return true;
    },
    trækTil(punkt) {
      if (!træk) return;
      træk.m.pos.copy(punkt).add(træk.forskyd);
      træk.m.pos.z = 0;
    },
    slip() {
      if (!træk) return false;
      const m = træk.m;
      træk = null;
      return m.pos.length() < FANG && læg(m);
    },
    // "Vis mig": det næste frie O₂ lægger sig af sig selv
    lægNæste() {
      const m = o2.find((x) => x.plads < 0 && træk?.m !== x);
      return m ? læg(m) : false;
    },
    trækker: () => Boolean(træk),
    lagt: () => lagt,
    fase: () => fase,
    // Atomerne talt efter slags (før og efter er de samme 12)
    tal() {
      const tæl = { C: 0, H: 0, O: 0 };
      for (const a of atomer) tæl[a.symbol]++;
      return tæl;
    },
    molekyler: () => molekyler.map((m) => m.slags),
    navne: () => navne.map((n) => n.tekst), // navnene, der står lige nu
    spol(sek, kamera) {
      for (let t = 0; t < sek; t += 0.05) opdater(0.05, kamera);
    },
  };
}
