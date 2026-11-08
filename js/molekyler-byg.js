// Byg et molekyle → "Del elektroner" (Molekyler M2a, docs/plan-molekyler.md afsnit 3 og "M2 i dag").
// Man trækker H, C, N, O og Cl fra paletten ind i 3D-billedet. Slipper man et atom tæt på et andet, og har begge en
// elektron uden partner, deler de et elektronpar (en binding). Dobbelt- og tripelbindingerne og formen regnes i
// js/data/molekyler-byg.js (uden Three.js). Tegningen er MolekyleTegning i js/molekyle3d.js.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, stopKamera, begrænsDrejning } from './scene3d.js';
import { MolekyleTegning, KERNE_R } from './molekyle3d.js';
import * as D from './data/molekyler-byg.js';
import { lyd } from './lyd.js';
import { visBesked, bundIVindue } from './beskeder.js';
import { lavTidsknap } from './pause.js';
import { lavNæsteSkridt, lavNæsteSkridtKort } from './lag.js';

const S = 3; // enheder i 3D pr. ångstrøm (Å). Bindingslængderne er i det rigtige forhold.
const SKRIDT_PR_SEKUND = 1800; // så mange skridt af formen pr. sekund (formen falder på plads på ca. 1 sekund)
const MAX_SKRIDT_PR_BILLEDE = 40;
const FANG_FINGER = 60; // px: slipper man så tæt på et atom, springer bindingen (finger)
const FANG_MUS = 40; // px (mus)
const BRYD_FINGER = 140; // px: trækkes et atom så meget længere væk end bindingens længde (på skærmen), går bindingen
const BRYD_MUS = 110; // i stykker, når man slipper. I px, så det ikke afhænger af, hvor tæt kameraet er på.
const SKUB_TID = 0.35; // sekunder: et atom, der ikke må binde, skubbes væk
const LYS_TID = 1.6; // sekunder: et færdigt molekyle lyser op

let aktiv = false;
let rod = null;
let tegning = null;
let pause = null;
let næste = null;
const atomer = []; // [{ symbol }]
let bånd = []; // [[i, j]] (hvem sidder sammen)
const form = D.lavForm();
let lys = []; // pr. atom: hvor meget det lyser (et færdigt molekyle lyser op)
let status = []; // pr. gruppe: D.status(...)
let færdigeFør = new Set(); // fingeraftryk af færdige grupper (så beskeden kun kommer, når et molekyle bliver færdigt)
let sidstRørt = -1; // det atom, man sidst har rørt (dets gruppe står i panelet)
let tid = 0; // til blinket (står stille under pause)
let sover = false; // formen ligger stille (så regnes der ikke)
let stille = 0;
let træk = null; // { id, i, plan, strakte, mål }
let venter = null; // et tryk på paletten, der måske bliver til et træk: { id, symbol, x, y }
let nyligTrukket = false;
let skub = null; // { i, fra, til, tid }
let panelTekst = '';
let panelTid = 0;
let sidsteRadius = 0;
const stråle = new THREE.Raycaster();
const plan = new THREE.Plane();
const hjælpV = new THREE.Vector3();
const hjælpV2 = new THREE.Vector3();
const midt = new THREE.Vector3();
const tegneAtomer = []; // genbruges hvert billede
const tegneBånd = [];
const tegneRet = [];
const tegneNavne = [];

const $ = (id) => document.getElementById(id);
const navn = (symbol) => D.STOFFER_BYG[symbol].navn;
const ental = (n, en, flere) => `${n} ${n === 1 ? en : flere}`;

export function lavBygMolekyler() {
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);
  tegning = new MolekyleTegning();
  rod.add(tegning.gruppe);
  for (let i = 0; i < D.MAX_ATOMER; i++) {
    tegneAtomer.push({ symbol: 'H', p: new THREE.Vector3(), lys: 0, stor: false });
  }
  lavPanel();
  lavTræk();
  ryd();
}

function lavPanel() {
  const vindue = $('vaerkstedVindue');
  const kort = lavNæsteSkridtKort(vindue, 'bygMission');
  kort.classList.add('byg-kun');
  næste = lavNæsteSkridt(kort);
  // Tidsknappen nederst til højre i 3D-billedet
  const række = document.createElement('div');
  række.className = 'bjælke-række byg-kun';
  række.id = 'bygBund';
  bundIVindue(vindue).append(række);
  pause = lavTidsknap({ holder: række, aktiv: () => aktiv });
  række.querySelector('.tidsknap').id = 'bygTid';

  // Paletten: et tryk sætter atomet ved siden af molekylet, et træk tager det med ind i billedet
  const palet = $('bygPalet');
  for (const symbol of D.PALET) {
    const s = D.STOFFER_BYG[symbol];
    const b = document.createElement('button');
    b.className = 'palet-atom';
    b.dataset.symbol = symbol;
    b.innerHTML = `<span class="pa-kugle pa-${symbol}">${symbol}</span><span class="pa-navn"></span><small class="pa-hænder"></small>`;
    b.querySelector('.pa-navn').textContent = s.navn;
    b.querySelector('.pa-hænder').textContent = ental(s.hænder, 'binding', 'bindinger');
    b.title = `${s.navn}: ${ental(s.hænder, 'elektron', 'elektroner')} uden partner, så ${s.hænder === 1 ? 'én binding' : `${s.hænder} bindinger`}. Træk det ind i billedet.`;
    b.addEventListener('pointerdown', (h) => {
      nyligTrukket = false; // (med musen kommer der intet klik efter et træk, så det nulstilles her)
      if (!aktiv || træk || (h.pointerType === 'mouse' && h.button !== 0)) return;
      venter = { id: h.pointerId, symbol, x: h.clientX, y: h.clientY };
    });
    b.addEventListener('click', () => {
      if (nyligTrukket) {
        nyligTrukket = false;
        return;
      }
      lyd.klik();
      tilføjVedSiden(symbol);
    });
    palet.append(b);
  }
  $('bygForfra').addEventListener('click', () => {
    lyd.klik();
    ryd();
  });
}

// ---------- Atomerne ----------
function plads() {
  return atomer.length < D.MAX_ATOMER;
}

function fuldBesked() {
  lyd.nej();
  visBesked({ titel: `Højst ${D.MAX_ATOMER} atomer`, tekst: 'Tryk "Forfra", eller træk et atom tilbage til paletten for at fjerne det.', type: 'info' });
}

let nyNr = 0;
const SKUB_IND = [[0, 0, 1], [0, 1, 0], [0, 0, -1], [0, -1, 0]]; // (højre, op, ind mod skærmen)
function nytAtom(symbol, pos) {
  atomer.push({ symbol });
  lys.push(0);
  // Lidt foran, over, bagved eller under (på skift), så atomerne ikke alle ligger i én flade (så kunne metan blive
  // hængende som et kvadrat), og formen hurtigt finder sin 3D-form
  const [, op, ind] = SKUB_IND[nyNr++ % 4];
  const k = verden.kamera.matrixWorld;
  const v = hjælpV2.setFromMatrixColumn(k, 1).multiplyScalar(op * 0.35);
  const f = new THREE.Vector3().setFromMatrixColumn(k, 2).multiplyScalar(-ind * 0.35);
  v.add(f);
  form.pos.push([pos[0] + v.x, pos[1] + v.y, pos[2] + v.z]);
  sidstRørt = atomer.length - 1;
  ændret();
  return atomer.length - 1;
}

function fjernAtom(i) {
  atomer.splice(i, 1);
  lys.splice(i, 1);
  form.pos.splice(i, 1);
  form.retninger.splice(i, 1);
  bånd = bånd.filter(([a, b]) => a !== i && b !== i).map(([a, b]) => [a > i ? a - 1 : a, b > i ? b - 1 : b]);
  if (sidstRørt === i) sidstRørt = atomer.length - 1;
  else if (sidstRørt > i) sidstRørt--;
  ændret();
}

// Et tryk på paletten: atomet står et ledigt sted ved siden af molekylet (til højre for det på skærmen)
function tilføjVedSiden(symbol) {
  if (!aktiv) return;
  if (!plads()) {
    fuldBesked();
    return;
  }
  const kamera = verden.kamera;
  const højre = hjælpV.setFromMatrixColumn(kamera.matrixWorld, 0).normalize();
  let p;
  if (!atomer.length) p = [0, 0, 0];
  else {
    const c = tyngdepunkt();
    let r = 0;
    for (const q of form.pos) r = Math.max(r, Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]));
    const d = r + 2.4;
    p = [c[0] + højre.x * d, c[1] + højre.y * d, c[2] + højre.z * d];
  }
  nytAtom(symbol, p);
  lyd.elektron();
}

function tyngdepunkt() {
  const c = [0, 0, 0];
  for (const q of form.pos) { c[0] += q[0]; c[1] += q[1]; c[2] += q[2]; }
  const n = Math.max(1, form.pos.length);
  return [c[0] / n, c[1] / n, c[2] / n];
}

// Atomerne eller båndene har ændret sig: formen, grupperne, navnene og panelet regnes igen
function ændret() {
  D.opdaterStruktur(form, atomer, bånd);
  sover = false;
  stille = 0;
  const grupper = D.grupper(atomer, bånd);
  status = grupper.map((liste) => D.status(atomer, bånd, liste));
  // Molekyler, der lige er blevet færdige: de lyser op, og navnet kommer
  const nu = new Set();
  for (const st of status) {
    if (!st.færdig) continue;
    const u = D.udsnit(atomer, bånd, st.atomer);
    const nøgle = D.fingeraftryk(u.atomer, u.bånd) + '@' + st.atomer.join(',');
    nu.add(nøgle);
    if (færdigeFør.has(nøgle)) continue;
    for (const i of st.atomer) lys[i] = 1;
    if (aktiv && st.atomer.includes(sidstRørt)) {
      lyd.opdaget();
      visBesked(st.kendt
        ? { titel: `${st.kendt.navn} (${st.kendt.formel})`, tekst: `Færdigt! Alle elektronerne har fået en partner. ${st.kendt.form}`, type: 'info' }
        : { titel: `${st.formel}: reglerne passer`, tekst: UKENDT, type: 'info' });
    }
  }
  færdigeFør = nu;
  zoomEfterBehov();
  panelTekst = '';
  opdaterPanel();
}

const UKENDT = 'Alle elektronerne har fået en partner, så reglerne passer. AtomLab kender ikke dette molekyle. Nogle af den slags findes, andre falder straks fra hinanden.';

function ryd() {
  atomer.length = 0;
  lys = [];
  bånd = [];
  form.pos.length = 0;
  form.retninger.length = 0;
  form.fast = -1;
  færdigeFør = new Set();
  sidstRørt = -1;
  træk = null;
  skub = null;
  ændret();
  if (aktiv) {
    verden.styring.target.set(0, 0, 0);
    sidsteRadius = -10;
    passerTil(3 * S);
  }
}

// ---------- Træk ----------
function skærmPos(v3) {
  hjælpV2.copy(v3).project(verden.kamera);
  return { x: ((hjælpV2.x + 1) / 2) * innerWidth, y: ((1 - hjælpV2.y) / 2) * innerHeight };
}

const pos3D = (i, ud) => ud.set(form.pos[i][0] * S, form.pos[i][1] * S, form.pos[i][2] * S);

// Kuglens radius på skærmen (px)
function skærmRadius(i) {
  const p = pos3D(i, hjælpV);
  const a = skærmPos(p);
  const højre = new THREE.Vector3().setFromMatrixColumn(verden.kamera.matrixWorld, 0).multiplyScalar(KERNE_R[atomer[i].symbol]);
  const b = skærmPos(p.add(højre));
  return Math.hypot(b.x - a.x, b.y - a.y);
}

// Det atom, fingeren eller musen er på (det nærmeste foran)
function atomVed(x, y, finger) {
  let bedst = -1;
  let bedstD = Infinity;
  for (let i = 0; i < atomer.length; i++) {
    const s = skærmPos(pos3D(i, hjælpV));
    const d = Math.hypot(s.x - x, s.y - y);
    if (d < Math.max(skærmRadius(i), finger ? 26 : 16) + (finger ? 8 : 2) && d < bedstD) {
      bedst = i;
      bedstD = d;
    }
  }
  return bedst;
}

// Punktet under fingeren i planet gennem p, parallelt med skærmen
function punktIPlan(x, y, p, ud) {
  const rect = verden.renderer.domElement.getBoundingClientRect();
  stråle.setFromCamera({ x: ((x - rect.left) / rect.width) * 2 - 1, y: -((y - rect.top) / rect.height) * 2 + 1 }, verden.kamera);
  verden.kamera.getWorldDirection(hjælpV2);
  plan.setFromNormalAndCoplanarPoint(hjælpV2, p);
  return stråle.ray.intersectPlane(plan, ud);
}

function lavTræk() {
  const lærred = verden.renderer.domElement;
  // Fanges før kameraets styring (capture), så et træk i et atom ikke drejer billedet
  lærred.addEventListener('pointerdown', (h) => {
    if (!aktiv || træk || skub) return;
    const i = atomVed(h.clientX, h.clientY, h.pointerType !== 'mouse');
    if (i < 0) return;
    h.stopImmediatePropagation();
    h.preventDefault();
    startTræk(i, h.pointerId, h.pointerType !== 'mouse');
    flytTil(h.clientX, h.clientY);
  }, { capture: true });
  addEventListener('pointermove', (h) => {
    // Et træk fra paletten: atomet kommer, når fingeren har flyttet sig lidt
    if (venter && venter.id === h.pointerId && Math.hypot(h.clientX - venter.x, h.clientY - venter.y) > 8) {
      const symbol = venter.symbol;
      venter = null;
      nyligTrukket = true;
      if (!plads()) {
        fuldBesked();
        return;
      }
      const c = tyngdepunkt();
      const p = punktIPlan(h.clientX, h.clientY, hjælpV.set(c[0] * S, c[1] * S, c[2] * S), new THREE.Vector3()) ?? new THREE.Vector3();
      const i = nytAtom(symbol, [p.x / S, p.y / S, p.z / S]);
      lyd.klik();
      startTræk(i, h.pointerId, h.pointerType !== 'mouse');
    }
    if (træk && træk.id === h.pointerId) {
      flytTil(h.clientX, h.clientY);
      return;
    }
    // Musen over et atom: en hånd viser, at det kan trækkes
    if (h.pointerType === 'mouse' && aktiv && h.target === lærred && !træk) {
      lærred.style.cursor = atomVed(h.clientX, h.clientY, false) >= 0 ? 'grab' : '';
    }
  });
  const slip = (h) => {
    if (venter && venter.id === h.pointerId) venter = null;
    if (!træk || træk.id !== h.pointerId) return;
    const t = træk;
    træk = null;
    verden.styring.enabled = true;
    lærred.style.cursor = '';
    slipAtom(t, h.clientX, h.clientY, h.type === 'pointercancel');
  };
  addEventListener('pointerup', slip);
  addEventListener('pointercancel', slip);
}

function startTræk(i, id, finger) {
  træk = { id, i, finger, strakte: [], mål: null, x: 0, y: 0 };
  form.fast = i;
  sidstRørt = i;
  sover = false;
  verden.styring.enabled = false;
  verden.renderer.domElement.style.cursor = 'grabbing';
}

function flytTil(x, y) {
  const i = træk.i;
  const p = punktIPlan(x, y, pos3D(i, hjælpV), hjælpV);
  træk.x = x;
  træk.y = y;
  if (p) form.pos[i] = [p.x / S, p.y / S, p.z / S];
  sover = false;
  // Bindinger, der er trukket så langt, at de går i stykker, når man slipper (målt på skærmen)
  træk.strakte = [];
  const pxPrÅ = (skærmRadius(i) / KERNE_R[atomer[i].symbol]) * S;
  for (const [a, b] of bånd) {
    if (a !== i && b !== i) continue;
    const j = a === i ? b : a;
    const d = Math.hypot(...form.pos[i].map((v, q) => v - form.pos[j][q]));
    const for_langt = d - D.længde(atomer[i].symbol, atomer[j].symbol);
    if (for_langt > 0.5 && for_langt * pxPrÅ > (træk.finger ? BRYD_FINGER : BRYD_MUS)) træk.strakte.push(j);
  }
  træk.mål = findMål(træk);
}

// Det atom, bindingen vil gå til, hvis man slipper nu (det nærmeste på skærmen inden for 60 px med finger og 40 px med mus)
function findMål(t) {
  const i = t.i;
  const s = skærmPos(pos3D(i, hjælpV));
  const nb = D.naboListe(atomer, bånd)[i];
  let bedst = -1;
  let bedstD = Infinity;
  for (let j = 0; j < atomer.length; j++) {
    if (j === i || nb.includes(j)) continue;
    const q = skærmPos(pos3D(j, hjælpV));
    const d = Math.hypot(q.x - s.x, q.y - s.y);
    if (d < (t.finger ? FANG_FINGER : FANG_MUS) + skærmRadius(j) && d < bedstD) {
      bedst = j;
      bedstD = d;
    }
  }
  if (bedst < 0) return null;
  // Uden de bindinger, der går i stykker, når man slipper
  const tilbage = bånd.filter(([a, b]) => !((a === i && t.strakte.includes(b)) || (b === i && t.strakte.includes(a))));
  return { atom: bedst, ...D.kanBinde(atomer, tilbage, i, bedst) };
}

// Hvorfor et atom ikke kan tage en binding mere (det, der står, når det skubbes væk)
function hvorforFuld(symbol) {
  switch (symbol) {
    case 'H': return 'Hydrogen har kun én elektron, og den er allerede i et par.';
    case 'Cl': return 'Chlor har kun én elektron uden partner, og den er allerede i et par. De seks andre er i frie par.';
    case 'O': return 'Oxygen har allerede to bindinger. Dets fire andre elektroner er i to frie par, som ikke binder.';
    case 'N': return 'Nitrogen har allerede tre bindinger. De to sidste elektroner er et frit par, som ikke binder.';
    default: return 'Kulstof har allerede fire bindinger. Alle dets fire yderste elektroner er i par.';
  }
}

function slipAtom(t, x, y, afbrudt) {
  const i = t.i;
  form.fast = -1;
  // Sluppet over paletten: atomet fjernes
  const under = !afbrudt && document.elementFromPoint(x, y);
  if (under && under.closest('#bygPanel')) {
    fjernAtom(i);
    lyd.fjern();
    return;
  }
  // Bindinger, der er trukket for langt, går i stykker
  if (t.strakte.length) {
    bånd = bånd.filter(([a, b]) => !((a === i && t.strakte.includes(b)) || (b === i && t.strakte.includes(a))));
    lyd.fjern();
  }
  const m = afbrudt ? null : t.mål;
  if (m && m.ok) {
    bånd.push([i, m.atom]);
    lyd.elektron();
  } else if (m && m.grund === 'fuld') {
    // Det ulovlige: atomet skubbes væk, og der står hvorfor
    const fuld = m.fuld;
    const væk = sub3(form.pos[i], form.pos[m.atom]);
    const l = Math.hypot(...væk) || 1;
    const afstand = D.længde(atomer[i].symbol, atomer[m.atom].symbol) + 2.2;
    skub = {
      i, tid: 0,
      fra: [...form.pos[i]],
      til: form.pos[m.atom].map((v, q) => v + (væk[q] / l) * afstand),
    };
    form.fast = i;
    lyd.nej();
    visBesked({ titel: `${navn(atomer[fuld].symbol)} kan ikke binde mere`, tekst: hvorforFuld(atomer[fuld].symbol), type: 'info' });
  }
  ændret();
}

const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

// ---------- Kameraet ----------
function zoomEfterBehov() {
  if (!aktiv || !atomer.length || træk) return;
  const c = tyngdepunkt();
  let r = 0;
  for (const q of form.pos) r = Math.max(r, Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]));
  r = Math.max(r, 1.6);
  // Kun når molekylet er blevet tydeligt større eller mindre (ellers ville det slås med ens egen zoom)
  if (Math.abs(r - sidsteRadius) < Math.max(0.5, sidsteRadius * 0.25)) return;
  sidsteRadius = r;
  passerTil((r + 1.4) * S);
}

// ---------- Hvert billede ----------
function opdater(dt) {
  if (!aktiv) return;
  const tiden = pause.til ? 0 : Math.min(dt, 0.05);
  tid += tiden;
  // Formen (også under pause, mens man trækker, så atomet følger fingeren)
  if (skub && !pause.til) {
    skub.tid += dt;
    const t = Math.min(1, skub.tid / SKUB_TID);
    const b = t * t * (3 - 2 * t);
    form.pos[skub.i] = skub.fra.map((v, q) => v + (skub.til[q] - v) * b);
    if (t >= 1) {
      form.fast = -1;
      skub = null;
    }
    sover = false;
  }
  if (!pause.til && !sover && form.struktur) {
    const n = Math.min(MAX_SKRIDT_PR_BILLEDE, Math.max(1, Math.round(tiden * SKRIDT_PR_SEKUND)));
    let størst = 0;
    for (let k = 0; k < n; k++) størst = Math.max(størst, D.skridt(form));
    stille = størst < 3e-4 && !træk && !skub ? stille + 1 : 0; // (den lille rystelse i formen er under 3e-4)
    if (stille > 30) sover = true;
  }
  for (let i = 0; i < lys.length; i++) lys[i] = Math.max(0, lys[i] - tiden / LYS_TID);
  // Kameraet følger molekylets midte blødt
  if (atomer.length && !træk) {
    const c = tyngdepunkt();
    midt.set(c[0] * S, c[1] * S, c[2] * S);
    const s = verden.styring;
    hjælpV.subVectors(midt, s.target).multiplyScalar(1 - Math.exp(-Math.min(dt, 0.1) * 2.5));
    s.target.add(hjælpV);
    verden.kamera.position.add(hjælpV);
  }
  tegn();
  if (træk) træk.mål = findMål(træk);
  panelTid += dt;
  if (panelTid > 0.25) {
    panelTid = 0;
    opdaterPanel();
    zoomEfterBehov(); // også når formen er faldet på plads
  }
}

function tegn() {
  const s = form.struktur;
  const n = atomer.length;
  const liste = tegneAtomer.slice(0, n);
  for (let i = 0; i < n; i++) {
    const a = liste[i];
    a.symbol = atomer[i].symbol;
    pos3D(i, a.p);
    a.lys = lys[i];
    a.stor = træk?.i === i;
  }
  tegneBånd.length = 0;
  if (s) {
    s.bånd.forEach(([a, b], k) => {
      const strakt = træk && ((a === træk.i && træk.strakte.includes(b)) || (b === træk.i && træk.strakte.includes(a)));
      tegneBånd.push({ a, b, orden: s.ordener[k], strakt });
    });
  }
  tegneRet.length = 0;
  form.retninger.forEach((liste2, i) => { for (const x of liste2 ?? []) tegneRet.push({ atom: i, v: x.v, slags: x.slags }); });
  // Navnene over de færdige molekyler (over det øverste atom på skærmen)
  tegneNavne.length = 0;
  const op = hjælpV2.setFromMatrixColumn(verden.kamera.matrixWorld, 1).normalize();
  for (const st of status) {
    if (!st.færdig || tegneNavne.length >= 6) continue;
    const c = [0, 0, 0];
    for (const i of st.atomer) for (let q = 0; q < 3; q++) c[q] += form.pos[i][q] / st.atomer.length;
    let top = 0;
    for (const i of st.atomer) top = Math.max(top, (form.pos[i][0] - c[0]) * op.x + (form.pos[i][1] - c[1]) * op.y + (form.pos[i][2] - c[2]) * op.z);
    const p = new THREE.Vector3(c[0] * S, c[1] * S, c[2] * S).addScaledVector(op, top * S + 2);
    tegneNavne.push({ tekst: st.kendt ? `${st.kendt.navn} (${st.kendt.formel})` : st.formel, p });
  }
  let mål = null;
  let linje = null;
  if (træk?.mål) {
    mål = { atom: træk.mål.atom, ok: træk.mål.ok };
    linje = { fra: liste[træk.i].p, til: liste[træk.mål.atom].p, ok: træk.mål.ok };
  }
  tegning.tegn({ atomer: liste, bånd: tegneBånd, retninger: tegneRet, mål, linje, navne: tegneNavne, kamera: verden.kamera, tid });
}

// ---------- Panelet ----------
// Den gruppe, der står i panelet: den med det atom, man sidst rørte
function aktivGruppe() {
  if (!status.length) return null;
  return status.find((st) => st.atomer.includes(sidstRørt)) ?? status[status.length - 1];
}

function bindingTal(st) {
  const s = form.struktur;
  const tæl = [0, 0, 0, 0];
  s.bånd.forEach(([a], k) => { if (st.atomer.includes(a)) tæl[s.ordener[k]]++; });
  const dele = [];
  if (tæl[1]) dele.push(`${tæl[1]} enkelt`);
  if (tæl[2]) dele.push(`${tæl[2]} dobbelt`);
  if (tæl[3]) dele.push(`${tæl[3]} tripel`);
  return dele.length ? dele.join(', ') : 'ingen';
}

function panelIndhold() {
  const st = aktivGruppe();
  if (!st) {
    return {
      titel: 'Byg et molekyle',
      tekst: 'Træk et atom fra paletten ind i billedet. Start fx med et O og to H.',
      næste: 'Træk et atom fra paletten ind i billedet. Start fx med et O og to H.',
      ærligt: '',
    };
  }
  const uden = (i) => form.struktur.e[i].uden;
  if (st.enligt) {
    const i = st.atomer[0];
    const a = atomer[i];
    const n = uden(i);
    return {
      titel: `${navn(a.symbol)} (${a.symbol})`,
      tekst: `${navn(a.symbol)} har ${ental(n, 'elektron', 'elektroner')} uden partner (${n === 1 ? 'den blinker' : 'de blinker'}). Hver af dem kan danne et par med en elektron fra et andet atom.`,
      hvorfor: ['bygUdenPartner', a.symbol === 'O' ? 'Hvorfor to uden partner?' : 'Hvorfor uden partner?'],
      næste: plads() ? `Træk et atom mere ind, og slip det tæt på ${navn(a.symbol).toLowerCase()}, så de kan dele et elektronpar.` : `Der er ${D.MAX_ATOMER} atomer, det højeste. Tryk "Forfra", eller træk et atom tilbage til paletten.`,
      ærligt: '',
    };
  }
  if (!st.færdig) {
    const mangler = st.atomer.filter((i) => uden(i) > 0);
    const hvem = mangler.length === 1 ? navn(atomer[mangler[0]].symbol) : null;
    return {
      titel: `${st.formel}: ikke færdigt endnu`,
      tekst: `${ental(st.uden, 'elektron', 'elektroner')} har ikke fået en partner endnu (${st.uden === 1 ? 'den blinker' : 'de blinker'}).`,
      næste: !plads() ? `Der er ${D.MAX_ATOMER} atomer, det højeste. Tryk "Forfra", eller træk et atom tilbage til paletten.`
        : hvem ? `${hvem} har ${ental(uden(mangler[0]), 'elektron', 'elektroner')} uden partner. Sæt ${uden(mangler[0]) === 1 ? 'et atom' : 'flere atomer'} mere på, fx H.`
          : `Der er stadig ${st.uden} elektroner uden partner. Sæt flere atomer på, fx H.`,
      ærligt: '',
    };
  }
  if (st.kendt) {
    return {
      titel: `${st.kendt.navn} (${st.kendt.formel})`,
      tekst: `Færdigt! Alle elektronerne har fået en partner. ${st.kendt.form}`,
      næste: 'Færdigt! Drej molekylet med fingeren eller musen, så du kan se formen. Prøv så et nyt.',
      ærligt: ÆRLIGT[st.kendt.id] ?? '',
      hvorfor: HVORFOR_EKSTRA[st.kendt.id] ?? null,
    };
  }
  return {
    titel: `${st.formel}: reglerne passer`,
    tekst: UKENDT,
    næste: 'Færdigt, men AtomLab kender det ikke. Prøv at bygge vand, metan eller ammoniak.',
    ærligt: 'At reglerne passer, betyder ikke altid, at molekylet findes. Det afgøres af energien, og den regner spillet ikke på.',
  };
}

// Et ekstra "Hvorfor?"-kort for nogle af de kendte molekyler: [id i HVORFOR, teksten på knappen]
const HVORFOR_EKSTRA = {
  o2: ['bygO2', 'Hvad sker der i O₂?'],
};

// Det, modellen snyder med, for nogle af de kendte molekyler (faktagrundlaget, afsnit 5)
const ÆRLIGT = {
  o2: 'Oxygen er lidt mærkelig: Det har i virkeligheden to elektroner uden makker, så flydende oxygen hænger fast på en magnet. Prik-modellen kan ikke se det (se "Hvad sker der i O₂?").',
  co: 'Prik-reglen kan ikke bygge kulilte. Her låner oxygen et af sine frie par ud, når C og O er alene, så det bliver en tripelbinding. I det rigtige kulilte kommer det ene af de tre par også helt fra oxygen.',
  h2o2: 'Den enkle model ville lægge brintoverilte fladt. Det rigtige molekyle er vredet som en halvt åben bog, så spillet drejer det med et ekstra led. Hvorfor, kræver kvantemekanik.',
};

function opdaterPanel() {
  if (!aktiv) return;
  const p = panelIndhold();
  const s = form.struktur;
  const st = aktivGruppe();
  const tal = [
    ['Atomer', `${atomer.length} af ${D.MAX_ATOMER}`],
    ['Bindinger', st && s ? bindingTal(st) : 'ingen'],
    ['Uden partner', st ? ental(st.uden, 'elektron', 'elektroner') : '–'],
  ];
  const nøgle = JSON.stringify([p, tal]);
  if (nøgle === panelTekst) return;
  panelTekst = nøgle;
  $('bygTitel').textContent = p.titel;
  $('bygTekst').textContent = p.tekst;
  $('bygTal').innerHTML = tal.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  const æ = $('bygÆrligtMolekyle');
  æ.textContent = p.ærligt;
  æ.hidden = !p.ærligt;
  const ekstra = $('bygHvorforEkstra');
  // Det ekstra kort tager pladsen fra "Hvorfor er vand bøjet?", så panelet ikke får en rullebjælke
  ekstra.hidden = !p.hvorfor;
  document.querySelector('#bygInfo [data-hvorfor="bygForm"]').hidden = !!p.hvorfor;
  if (p.hvorfor) [ekstra.dataset.hvorfor, ekstra.textContent] = p.hvorfor;
  else delete ekstra.dataset.hvorfor;
  næste.sæt({ tekst: p.næste });
  for (const b of document.querySelectorAll('.palet-atom')) b.disabled = !plads();
}

// ---------- Start og stop (fra Værkstedet) ----------
export function startBygMolekyler() {
  aktiv = true;
  rod.visible = true;
  verden.opdateringer.add(opdater);
  stopKamera();
  sætVindue($('vaerkstedVindue'));
  const k = verden.kamera;
  verden.styring.autoRotate = false;
  begrænsDrejning(null);
  if (atomer.length) {
    const c = tyngdepunkt();
    verden.styring.target.set(c[0] * S, c[1] * S, c[2] * S);
  } else verden.styring.target.set(0, 0, 0);
  k.position.copy(verden.styring.target).add(hjælpV.set(0, 3, 40));
  sidsteRadius = -10;
  zoomEfterBehov();
  if (!atomer.length) passerTil(3 * S);
  panelTekst = '';
  opdaterPanel();
}

export function stopBygMolekyler() {
  aktiv = false;
  rod.visible = false;
  verden.opdateringer.delete(opdater);
  verden.styring.autoRotate = true;
  verden.styring.target.set(0, 0, 0);
  if (træk) {
    // Et træk midt i et skærmskift: atomet bliver, hvor det er
    form.fast = -1;
    træk = null;
  }
  venter = null;
  if (skub) {
    form.pos[skub.i] = [...skub.til];
    form.fast = -1;
    skub = null;
  }
  verden.styring.enabled = true;
  verden.renderer.domElement.style.cursor = '';
  pause.sæt('spil');
}

// ---------- Kun til automatiske tests ----------
export function testAdgang() {
  return {
    atomer: () => atomer.map((a) => a.symbol),
    bånd: () => bånd.map((b) => [...b]),
    ordener: () => form.struktur?.ordener ?? [],
    grupper: () => status.map((st) => ({ atomer: [...st.atomer], færdig: st.færdig, uden: st.uden, navn: st.kendt?.navn ?? null, formel: st.formel })),
    tilføj: (symbol) => tilføjVedSiden(symbol),
    // Binder atom i og j efter reglerne (som at slippe i på j). Giver { ok, grund }.
    bind: (i, j) => {
      const k = D.kanBinde(atomer, bånd, i, j);
      if (k.ok) {
        bånd.push([i, j]);
        sidstRørt = i;
        ændret();
      }
      return k;
    },
    ryd: () => ryd(),
    vinkel: (a, c, b) => D.vinkel(form, a, c, b),
    atomPå: (i) => skærmPos(pos3D(i, new THREE.Vector3())),
    paletPå: (symbol) => {
      const r = document.querySelector(`.palet-atom[data-symbol="${symbol}"]`).getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    trækker: () => Boolean(træk),
    træk: () => (træk ? { atom: træk.i, strakte: [...træk.strakte], mål: træk.mål } : null),
    sover: () => sover,
    tidsknap: () => pause.tilstand,
    styring: () => verden.styring.enabled,
    // Kameraet er færdigt med at zoome og med at følge molekylets midte (så står atomerne stille på skærmen)
    kameraStille: () => {
      const c = tyngdepunkt();
      return verden.målAfstand == null && (!atomer.length || verden.styring.target.distanceTo(hjælpV.set(c[0] * S, c[1] * S, c[2] * S)) < 0.03);
    },
    tid: () => tid,
    // Spol frem i små skridt (som på en skærm med 60 billeder i sekundet)
    spol: (sek) => { for (let t = 0; t < sek; t += 1 / 60) opdater(1 / 60); },
  };
}
