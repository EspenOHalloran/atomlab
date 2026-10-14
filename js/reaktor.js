// Reaktoren: fission.
// Del 1: Skyd en neutron mod én urankerne og se den spalte.
// Del 2: En kædereaktion med brændsel, vand (moderator) og kontrolstave, der skal holdes stabil.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, passerTilBoks, begrænsDrejning, kameraSving, LAV_KVALITET, lavPrikTekstur } from './scene3d.js';
import { Atom } from './atom.js';
import { Effekter } from './effekter.js';
import { grundstof } from './data/grundstoffer.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked } from './beskeder.js';

// De tre måder, uran-235 spaltes på her (rigtige par; tæl efter: protoner 92, nukleoner 236)
const PAR = [
  { a: [56, 85], b: [36, 56], neutroner: 3 }, // barium-141 + krypton-92
  { a: [54, 86], b: [38, 56], neutroner: 2 }, // xenon-140 + strontium-94
  { a: [52, 85], b: [40, 57], neutroner: 2 }, // tellur-137 + zirconium-97
];

export const OPGAVER_REAKTOR = [
  {
    id: 'r-spalt', titel: 'Spalt en uran-235-kerne', tip: 'Vælg uran-235 og en langsom neutron, og tryk "Skyd neutron".',
    fakta: 'Når uran-235 spalter, frigøres ca. 200 MeV. Det er ca. 10 gange mere end en enkelt fusion i Solen, men pr. kilo brændsel giver fusion mere.',
  },
  {
    id: 'r-hurtig', titel: 'Skyd en hurtig neutron mod uran-235', tip: 'Vælg "Hurtig" neutron.',
    fakta: 'Hurtige neutroner preller oftest af. Derfor bremser man dem med vand i en reaktor. Vandet kaldes en moderator.',
  },
  {
    id: 'r-u238', titel: 'Skyd en neutron mod uran-238', tip: 'Vælg uran-238 og en langsom neutron.',
    fakta: 'Uran-238 fanger neutronen og bliver til uran-239. Efter to betahenfald er det blevet til plutonium-239, som også kan spaltes.',
  },
  {
    id: 'r-tre', titel: 'Find alle tre måder at spalte på', tip: 'Spalt uran-235 flere gange. Den spalter tilfældigt.',
    fakta: 'I virkeligheden kan uran-235 spalte på mere end hundrede forskellige måder. Stumperne har altid tilsammen 92 protoner.',
  },
  {
    id: 'r-start', titel: 'Start en kædereaktion', tip: 'Gå til "Kædereaktion", og tryk "Start reaktoren".',
    fakta: 'Hver spaltning giver 2-3 nye neutroner, som kan spalte nye kerner. Derfor kan det tage fart.',
  },
  {
    id: 'r-stabil', titel: 'Hold reaktoren stabil i 30 sekunder', tip: 'Brug kontrolstavene, så effekten bliver i det grønne felt.',
    fakta: 'I et atomkraftværk styrer man reaktoren præcis sådan: Kontrolstavene suger neutroner op, så hver spaltning i gennemsnit giver præcis én ny spaltning.',
  },
  {
    id: 'r-nødstop', titel: 'Få reaktoren til at lave nødstop', tip: 'Træk kontrolstavene helt op, og se hvad der sker.',
    fakta: 'Ved nødstop falder alle kontrolstavene ned på én gang, og kædereaktionen stopper på et øjeblik.',
  },
];

// ---------- Tilstand ----------
let tilstand = 'kerne'; // 'kerne' (spalt én) eller 'kæde' (kædereaktion)
let aktiv = false;
let rodKerne = null;
let rodKæde = null;
let rodEffekt = null;
let effekter = null;
let stumpAtomer = []; // to atomer, der genbruges til stumperne
let tid = 0;

// Del 1
let mål = null; // atomet, der skydes på
let stumper = []; // { atom, fart, etiket }
let neutron = null; // { mesh, fart, hale }
let valgtKerne = 'u235';
let langsom = true;
let forløb = null; // { fase, tid, par }
let sete = new Set(); // hvilke par man har set

// Del 2
const KOLONNER = 14;
const RÆKKER = 8;
const AFSTAND = 1.6;
const KERNE_B = (KOLONNER - 1) * AFSTAND;
const KERNE_H = (RÆKKER - 1) * AFSTAND;
const STAVE_X = [1, 3, 5, 7, 9, 11].map((k) => -KERNE_B / 2 + (k + 0.5) * AFSTAND);
const MAX_NEUTRONER = 420;
const HURTIG = 9;
const BRUGT_TID = 1.5; // sekunder, før en spaltet plads har frisk brændsel igen
const SPALT_LANGSOM = 0.7; // chancen for spaltning, når en langsom neutron rammer frisk uran-235
let spaltningerIalt = 0;
const FELT = [6, 16]; // det grønne felt (spaltninger pr. sekund)
const NØDSTOP_GRÆNSE = 28;
const MÅLER_MAX = 32;
const LANGSOM = 2.6;
let brændsel = []; // { x, y, brugt }
let neutroner = []; // { x, y, vx, vy, sidst }
let stavDybde = 0.55; // 0 = trukket op, 1 = helt nede
let stavVist = 0.55;
let vand = true;
let startet = false;
let nødstop = false;
let effekt = 0; // spaltninger pr. sekund (glidende gennemsnit)
let forHøjTid = 0;
let stabilTid = 0;
let spaltningerDetteBillede = 0;
let brændselMesh = null;
let neutronPunkter = null;
let staveMesh = [];
let tjerenkov = null;
let tikTæller = 0;

function $(id) {
  return document.getElementById(id);
}

// Er et forsøg midt i gang (neutronen flyver, eller kernen vrider sig)?
function optaget() {
  return Boolean(forløb && (forløb.fase === 'flyver' || forløb.fase === 'vrider'));
}

function forsøgFærdigt(fase = 'færdig') {
  forløb = { fase, tid: 0 };
  $('reaktorSkyd').disabled = false;
}

// En lille tekstskilt, der følger en stump
function lavEtiket(tekst, farve = '#ffffff') {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d');
  g.font = '700 30px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,0.9)';
  g.shadowBlur = 8;
  g.fillStyle = farve;
  g.fillText(tekst, 128, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
  s.scale.set(6, 1.5, 1);
  s.renderOrder = 10;
  return s;
}

function navnPå(z, n) {
  return `${grundstof(z).navn}-${z + n}`;
}

// ---------- Opbygning ----------
export function lavReaktor() {
  rodKerne = new THREE.Group();
  rodKæde = new THREE.Group();
  rodEffekt = new THREE.Group();
  rodKerne.visible = false;
  rodKæde.visible = false;
  rodEffekt.visible = false;
  verden.scene.add(rodKerne, rodKæde, rodEffekt);
  effekter = new Effekter(rodEffekt);

  // Del 1: målkernen
  mål = new Atom();
  rodKerne.add(mål.gruppe);
  stumpAtomer = [new Atom(), new Atom()];
  for (const a of stumpAtomer) {
    a.gruppe.visible = false;
    rodKerne.add(a.gruppe);
  }
  nulstilKerne();

  // Del 2: brændsel, stave, vand og neutroner
  const kugle = new THREE.SphereGeometry(0.34, LAV_KVALITET ? 10 : 16, LAV_KVALITET ? 8 : 12);
  brændselMesh = new THREE.InstancedMesh(kugle, new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.1 }), KOLONNER * RÆKKER);
  const m = new THREE.Matrix4();
  for (let r = 0; r < RÆKKER; r++) {
    for (let k = 0; k < KOLONNER; k++) {
      const x = -KERNE_B / 2 + k * AFSTAND;
      const y = -KERNE_H / 2 + r * AFSTAND;
      brændsel.push({ x, y, brugt: 0 });
      brændselMesh.setMatrixAt(brændsel.length - 1, m.makeTranslation(x, y, 0));
      brændselMesh.setColorAt(brændsel.length - 1, new THREE.Color(0x7fae22));
    }
  }
  rodKæde.add(brændselMesh);

  // Vandet: en blålig flade bag kernen, og et blåt skær (Tjerenkov-lys), når reaktoren kører
  const vandMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(KERNE_B + 4, KERNE_H + 4),
    new THREE.MeshBasicMaterial({ color: 0x0b3a6e, transparent: true, opacity: 0.45, depthWrite: false }),
  );
  vandMesh.position.z = -1;
  vandMesh.name = 'vand';
  tjerenkov = new THREE.Sprite(new THREE.SpriteMaterial({
    map: lavPrikTekstur(true), color: new THREE.Color(0.3, 0.6, 2.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  tjerenkov.scale.set(KERNE_B * 1.6, KERNE_H * 1.9, 1);
  tjerenkov.position.z = -0.5;
  rodKæde.add(vandMesh, tjerenkov);

  const stavMat = new THREE.MeshStandardMaterial({ color: 0x2c3240, roughness: 0.45, metalness: 0.6 });
  for (const x of STAVE_X) {
    const stav = new THREE.Mesh(new THREE.BoxGeometry(0.42, KERNE_H + 2, 0.42), stavMat);
    stav.position.x = x;
    rodKæde.add(stav);
    staveMesh.push(stav);
  }
  // En ramme om kernen
  const ramme = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(KERNE_B + 2, KERNE_H + 2, 1.2)),
    new THREE.LineBasicMaterial({ color: 0x5fe3ff, transparent: true, opacity: 0.35 }),
  );
  rodKæde.add(ramme);

  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_NEUTRONER * 3), 3));
  nGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_NEUTRONER * 3), 3));
  neutronPunkter = new THREE.Points(nGeo, new THREE.PointsMaterial({
    size: 0.45, map: lavPrikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  neutronPunkter.frustumCulled = false;
  rodKæde.add(neutronPunkter);

  lavPanel();
}

// ---------- Skærmen ----------
export function startReaktor() {
  aktiv = true;
  rodEffekt.visible = true;
  verden.opdateringer.add(opdater);
  verden.styring.autoRotate = false;
  sætTilstand(tilstand, true);
}

export function stopReaktor() {
  aktiv = false;
  rodKerne.visible = false;
  rodKæde.visible = false;
  rodEffekt.visible = false;
  verden.opdateringer.delete(opdater);
  begrænsDrejning(null);
  verden.styring.autoRotate = true;
}

function sætTilstand(ny, første = false) {
  tilstand = ny;
  rodKerne.visible = ny === 'kerne';
  rodKæde.visible = ny === 'kæde';
  for (const el of document.querySelectorAll('[data-reaktor-del]')) el.classList.toggle('skjult', el.dataset.reaktorDel !== ny);
  for (const b of document.querySelectorAll('.del-knap')) b.classList.toggle('valgt', b.dataset.del === ny);
  sætVindue($('reaktorVindue'));
  const k = verden.kamera;
  verden.styring.target.set(0, 0, 0);
  if (ny === 'kerne') {
    begrænsDrejning(null);
    verden.styring.autoRotate = true;
    if (første) k.position.setLength(Math.max(k.position.length(), 60));
    passerTil(13);
  } else {
    begrænsDrejning({ vandret: 0.6, lodret: 0.45 });
    verden.styring.autoRotate = false;
    k.position.set(0, -2, Math.max(k.position.length(), 40));
    passerTilBoks(KERNE_B / 2 + 1.5, KERNE_H / 2 + 1.5);
  }
}

// ---------- Panel ----------
function lavPanel() {
  for (const b of document.querySelectorAll('.del-knap')) {
    b.addEventListener('click', () => {
      lyd.klik();
      sætTilstand(b.dataset.del);
    });
  }
  for (const b of document.querySelectorAll('[data-kerne-valg]')) {
    b.addEventListener('click', () => {
      if (optaget()) return;
      valgtKerne = b.dataset.kerneValg;
      lyd.klik();
      nulstilKerne();
      opdaterValg();
    });
  }
  for (const b of document.querySelectorAll('[data-fart-valg]')) {
    b.addEventListener('click', () => {
      langsom = b.dataset.fartValg === 'langsom';
      lyd.klik();
      opdaterValg();
    });
  }
  $('reaktorSkyd').addEventListener('click', skydNeutron);
  $('reaktorIgen').addEventListener('click', () => { lyd.klik(); nulstilKerne(); });
  $('reaktorStart').addEventListener('click', startKæde);
  $('reaktorStave').addEventListener('input', (h) => {
    if (nødstop) return;
    stavDybde = Number(h.target.value) / 100;
    opdaterKædePanel();
  });
  $('reaktorVand').addEventListener('click', () => {
    vand = !vand;
    lyd.klik();
    rodKæde.getObjectByName('vand').visible = vand;
    $('reaktorVand').textContent = vand ? 'Vand (moderator): til' : 'Vand (moderator): fra';
    if (!vand) visBesked({ titel: 'Uden vand', tekst: 'Nu bliver neutronerne ikke bremset. Hurtige neutroner spalter sjældent uran-235, så kædereaktionen dør ud.', varighed: 7000 });
  });
  $('reaktorHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpReaktor').classList.remove('skjult'); });
  opdaterValg();
  lavOpgaveliste();
  opdaterKædePanel();
}

function opdaterValg() {
  for (const b of document.querySelectorAll('[data-kerne-valg]')) b.classList.toggle('valgt', b.dataset.kerneValg === valgtKerne);
  for (const b of document.querySelectorAll('[data-fart-valg]')) b.classList.toggle('valgt', (b.dataset.fartValg === 'langsom') === langsom);
}

function lavOpgaveliste() {
  const liste = $('reaktorOpgaver');
  liste.innerHTML = '';
  for (const o of OPGAVER_REAKTOR) {
    const li = document.createElement('li');
    const løst = fremgang.erLøst(o.id);
    li.className = løst ? 'løst' : '';
    li.innerHTML = `<span class="flueben">${løst ? '★' : '☆'}</span><span class="opgave-titel"></span>`;
    li.querySelector('.opgave-titel').textContent = o.titel;
    li.title = løst ? o.fakta : o.tip;
    li.addEventListener('click', () => visBesked({ titel: o.titel, tekst: løst ? o.fakta : `Tip: ${o.tip}`, varighed: 8000 }));
    liste.append(li);
  }
}

function løs(id) {
  const o = OPGAVER_REAKTOR.find((x) => x.id === id);
  if (!o || !fremgang.løs(id)) return;
  setTimeout(() => {
    lyd.klaret();
    visBesked({ titel: `Opgave klaret: ${o.titel} ★`, tekst: o.fakta, type: 'klaret', varighed: 8000 });
  }, 400);
  lavOpgaveliste();
}

function visForklaring(titel, html) {
  $('reaktorForklaring').innerHTML = `<strong>${titel}</strong>${html}`;
}

// ---------- Del 1: spalt én kerne ----------
function nulstilKerne() {
  for (const s of stumper) {
    s.atom.gruppe.visible = false;
    rodKerne.remove(s.etiket);
    s.etiket.material.map.dispose();
    s.etiket.material.dispose();
  }
  stumper = [];
  if (neutron) {
    rodKerne.remove(neutron.mesh);
    neutron = null;
  }
  forløb = null;
  const n = valgtKerne === 'u235' ? 143 : 146;
  mål.sætStraks(92, n, 0);
  mål.sætStatus('næsten');
  mål.gruppe.visible = true;
  mål.gruppe.scale.set(1, 1, 1);
  mål.gruppe.position.set(0, 0, 0);
  $('reaktorSkyd').disabled = false;
  visForklaring(navnPå(92, n), valgtKerne === 'u235'
    ? 'Uran-235 har 92 protoner og 143 neutroner. Den er så stor, at den næsten ikke kan holde sammen. Skyd en neutron mod den!'
    : 'Uran-238 har 92 protoner og 146 neutroner. Det er langt det mest almindelige uran i naturen (over 99 %). Hvad sker der, når den rammes?');
}

function skydNeutron() {
  if (optaget()) return;
  if (forløb) nulstilKerne(); // et nyt forsøg starter med en frisk kerne
  lyd.neutron();
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), new THREE.MeshStandardMaterial({ color: 0x98a8c8, emissive: 0x3060c0, emissiveIntensity: 0.6 }));
  const start = new THREE.Vector3(-18, 2, 0);
  mesh.position.copy(start);
  rodKerne.add(mesh);
  const fart = langsom ? 9 : 26;
  neutron = { mesh, fart: start.clone().negate().normalize().multiplyScalar(fart) };
  forløb = { fase: 'flyver', tid: 0 };
  $('reaktorSkyd').disabled = true;
}

function rammer() {
  rodKerne.remove(neutron.mesh);
  const v = neutron.fart.clone();
  neutron = null;
  const u235 = valgtKerne === 'u235';
  const r = Math.random();
  if (!langsom && r < (u235 ? 0.8 : 0.9)) {
    // Hurtig neutron: preller af
    effekter.skyd(new THREE.Vector3(-1, 0.5, 0).multiplyScalar(4), new THREE.Vector3(-1, 1.2, 0.4), 'neutron', 16, 1.4);
    effekter.glimt(new THREE.Vector3(-3, 0.5, 0), 2, new THREE.Color(1, 1.4, 2.2), 0.4);
    lyd.fjern();
    forsøgFærdigt();
    visForklaring('Neutronen prellede af', 'Hurtige neutroner farer forbi, før kernen når at "gribe" dem. Langsomme neutroner har meget lettere ved at blive fanget. Derfor bremser man neutronerne med vand i en reaktor.');
    if (u235) løs('r-hurtig');
    return;
  }
  if (!u235 && langsom) {
    // Uran-238 fanger neutronen og bliver til uran-239
    mål.sætStraks(92, 147, 0);
    mål.sætStatus('ustabil');
    effekter.glimt(new THREE.Vector3(), 6, new THREE.Color(3, 2.8, 1.6), 0.7);
    effekter.skyd(new THREE.Vector3(), new THREE.Vector3(0.3, 1, 0.2), 'gamma', 40);
    lyd.opdaget();
    forsøgFærdigt();
    visForklaring('Uran-238 + neutron → uran-239', 'Uran-238 spalter ikke. Den fanger neutronen og sender lidt gammastråling ud. Uran-239 laver to betahenfald og bliver til <b>plutonium-239</b>, som kan spaltes ligesom uran-235. Sådan laves plutonium i reaktorer.');
    løs('r-u238');
    return;
  }
  if (u235 && langsom && r > 0.86) {
    // Nogle gange bliver neutronen bare fanget
    mål.sætStraks(92, 144, 0);
    effekter.glimt(new THREE.Vector3(), 6, new THREE.Color(3, 2.8, 1.6), 0.7);
    effekter.skyd(new THREE.Vector3(), new THREE.Vector3(-0.2, 1, 0.3), 'gamma', 40);
    lyd.opdaget();
    forsøgFærdigt();
    visForklaring('Fanget uden at spalte', 'Ca. 1 ud af 7 gange bliver neutronen bare fanget, og kernen bliver til uran-236 og sender gammastråling ud i stedet for at spalte. Prøv igen!');
    return;
  }
  // Spaltning! Først vrider kernen sig som en dråbe
  const par = PAR[Math.floor(Math.random() * PAR.length)];
  mål.sætMål(92, 144, 0);
  mål.sætStatus('straks');
  forløb = { fase: 'vrider', tid: 0, par, retning: v.normalize() };
  lyd.opbygning();
  visForklaring('Uran-235 + neutron → uran-236', 'Neutronen er fanget, og kernen er nu uran-236. Den har fået så meget ekstra energi, at den begynder at vride sig som en vanddråbe …');
}

function spalt() {
  const { par } = forløb;
  mål.gruppe.visible = false;
  const lavStump = ([z, n], side) => {
    const a = stumpAtomer[side < 0 ? 0 : 1];
    a.sætStraks(z, n, 0);
    a.sætStatus('ustabil');
    a.gruppe.position.set(side * 1.8, 0, 0);
    a.gruppe.visible = true;
    const etiket = lavEtiket(navnPå(z, n), '#ffe8a3');
    rodKerne.add(etiket);
    stumper.push({ atom: a, fart: new THREE.Vector3(side * 6, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5), etiket });
  };
  lavStump(par.a, -1);
  lavStump(par.b, 1);
  for (let i = 0; i < par.neutroner; i++) {
    const retning = new THREE.Vector3().randomDirection();
    retning.x *= 0.4;
    effekter.skyd(new THREE.Vector3(), retning, 'neutron', 14, 1.6);
  }
  effekter.skyd(new THREE.Vector3(), new THREE.Vector3(0.2, 1, -0.3), 'gamma', 40);
  effekter.glimt(new THREE.Vector3(), 16, new THREE.Color(3.5, 3, 2), 0.9);
  effekter.bølge(new THREE.Vector3(), 30, new THREE.Color(2.6, 2.2, 1.5), 1.2);
  effekter.tekst(new THREE.Vector3(0, 3.5, 0), '+ ca. 200 MeV', '#ffd43b', 2.2, 2.5);
  kameraSving(0.35, 1.4);
  lyd.spaltning();
  const [za, na] = par.a;
  const [zb, nb] = par.b;
  visForklaring(`Uran-235 + n → ${navnPå(za, na)} + ${navnPå(zb, nb)} + ${par.neutroner} n`, `
    <span class="tæl">Protoner: ${za} + ${zb} = <b>92</b> ✓ · Nukleoner: ${za + na} + ${zb + nb} + ${par.neutroner} = <b>236</b> ✓</span>
    Kernen flækkede i to mellemstore kerner og ${par.neutroner} nye neutroner. Stumperne vejer tilsammen ca. 0,1 % mindre end uran-236. Den masse er blevet til ca. <b>200 MeV</b> energi (E = mc²).
    Stumperne har for mange neutroner, så de er radioaktive. Det er derfor, brugt brændsel er farligt.`);
  sete.add(PAR.indexOf(par));
  løs('r-spalt');
  if (sete.size === PAR.length) løs('r-tre');
  forsøgFærdigt('flyver ud');
}

function opdaterKerne(dt) {
  mål.opdater(dt);
  if (neutron) {
    neutron.mesh.position.addScaledVector(neutron.fart, dt);
    if (neutron.mesh.position.length() < 4.2) rammer();
  }
  if (forløb) {
    forløb.tid += dt;
    if (forløb.fase === 'vrider') {
      // Dråben strækker sig og vipper frem og tilbage, mere og mere
      const t = Math.min(1, forløb.tid / 1.3);
      const vrik = Math.sin(forløb.tid * 18) * 0.08 * t;
      mål.gruppe.scale.set(1 + 0.75 * t * t + vrik, 1 - 0.28 * t * t - vrik, 1 - 0.28 * t * t - vrik);
      if (forløb.tid >= 1.3) spalt();
    } else if (forløb.fase === 'flyver ud' && forløb.tid > 6) {
      forløb.fase = 'færdig';
    }
  }
  for (const s of stumper) {
    s.atom.opdater(dt);
    s.fart.multiplyScalar(Math.exp(-dt * 0.9));
    s.atom.gruppe.position.addScaledVector(s.fart, dt);
    s.etiket.position.copy(s.atom.gruppe.position).add(new THREE.Vector3(0, 5.5, 0));
  }
}

// ---------- Del 2: kædereaktion ----------
function startKæde() {
  lyd.klik();
  nødstop = false;
  $('reaktorStave').disabled = false;
  if (stavDybde > 0.95) {
    stavDybde = 0.55;
    $('reaktorStave').value = 55;
  }
  startet = true;
  for (let i = 0; i < 8; i++) {
    const vinkel = Math.random() * Math.PI * 2;
    neutroner.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, vx: Math.cos(vinkel) * LANGSOM, vy: Math.sin(vinkel) * LANGSOM, sidst: -1 });
  }
  løs('r-start');
  visBesked({ titel: 'Reaktoren er startet', tekst: 'En neutronkilde sender de første neutroner ind. Hold effekten i det grønne felt med kontrolstavene.', varighed: 6000 });
}

function lavNødstop(grund) {
  nødstop = true;
  stavDybde = 1;
  $('reaktorStave').value = 100;
  $('reaktorStave').disabled = true;
  lyd.alarm();
  visBesked({
    titel: 'NØDSTOP!', type: 'advarsel', varighed: 10000,
    tekst: `${grund} Alle kontrolstave falder ned, og kædereaktionen stopper. En rigtig reaktor kan ikke eksplodere som en atombombe, men den skal køles, ellers kan brændslet smelte.`,
  });
  løs('r-nødstop');
}

function nyNeutron(x, y) {
  if (neutroner.length >= MAX_NEUTRONER) return;
  const vinkel = Math.random() * Math.PI * 2;
  neutroner.push({ x, y, vx: Math.cos(vinkel) * HURTIG, vy: Math.sin(vinkel) * HURTIG, sidst: -1 });
}

// Simulerer kædereaktionen et lille skridt (h sekunder)
function kædeFysik(h) {
  stavVist += (stavDybde - stavVist) * Math.min(1, h * (nødstop ? 8 : 4));
  const stavBund = KERNE_H / 2 + 1 - stavVist * (KERNE_H + 2); // stavenes nederste kant
  const brugtTid = BRUGT_TID;
  for (const b of brændsel) if (b.brugt > 0) b.brugt = Math.max(0, b.brugt - h);

  const tilbage = [];
  for (const n of neutroner) {
    // Vandet bremser neutronerne (moderator)
    const fart = Math.hypot(n.vx, n.vy);
    if (vand && fart > LANGSOM) {
      const ny = Math.max(LANGSOM, fart * Math.exp(-h * 1.3));
      n.vx *= ny / fart;
      n.vy *= ny / fart;
    }
    n.x += n.vx * h;
    n.y += n.vy * h;
    // Ud af kernen: nogle bliver kastet tilbage af beholderen, resten forsvinder
    if (Math.abs(n.x) > KERNE_B / 2 + 1 || Math.abs(n.y) > KERNE_H / 2 + 1) {
      if (Math.random() < 0.45) {
        if (Math.abs(n.x) > KERNE_B / 2 + 1) n.vx = -n.vx;
        if (Math.abs(n.y) > KERNE_H / 2 + 1) n.vy = -n.vy;
        n.x = THREE.MathUtils.clamp(n.x, -KERNE_B / 2 - 1, KERNE_B / 2 + 1);
        n.y = THREE.MathUtils.clamp(n.y, -KERNE_H / 2 - 1, KERNE_H / 2 + 1);
      } else continue;
    }
    // Kontrolstavene suger neutroner op
    let opsuget = false;
    for (const sx of STAVE_X) {
      if (Math.abs(n.x - sx) < 0.3 && n.y > stavBund) { opsuget = true; break; }
    }
    if (opsuget) continue;
    // Vandet sluger nu og da en neutron
    if (vand && Math.random() < h * 0.05) continue;
    // Rammer den en urankerne?
    const k = Math.round((n.x + KERNE_B / 2) / AFSTAND);
    const r = Math.round((n.y + KERNE_H / 2) / AFSTAND);
    let væk = false;
    if (k >= 0 && k < KOLONNER && r >= 0 && r < RÆKKER) {
      const i = r * KOLONNER + k;
      const b = brændsel[i];
      const tæt = (n.x - b.x) ** 2 + (n.y - b.y) ** 2 < 0.4 * 0.4;
      if (tæt && n.sidst !== i) {
        n.sidst = i;
        const langsomNu = Math.hypot(n.vx, n.vy) < LANGSOM * 1.6;
        if (b.brugt === 0 && Math.random() < (langsomNu ? SPALT_LANGSOM : 0.07)) {
          b.brugt = brugtTid;
          væk = true;
          spaltningerDetteBillede++;
          spaltningerIalt++;
          nyNeutron(b.x, b.y);
          nyNeutron(b.x, b.y);
          if (Math.random() < 0.43) nyNeutron(b.x, b.y);
        } else if (Math.random() < 0.3) {
          const vinkel = Math.random() * Math.PI * 2;
          const f = Math.hypot(n.vx, n.vy);
          n.vx = Math.cos(vinkel) * f;
          n.vy = Math.sin(vinkel) * f;
        }
      } else if (!tæt && n.sidst === i) n.sidst = -1;
    }
    if (!væk) tilbage.push(n);
  }
  neutroner = tilbage;
}

function opdaterKæde(dt) {
  spaltningerDetteBillede = 0;
  const skridt = Math.min(10, Math.ceil(dt / 0.01));
  for (let i = 0; i < skridt; i++) kædeFysik(dt / skridt);
  // Effekten = spaltninger pr. sekund, udglattet
  effekt += (spaltningerDetteBillede / Math.max(dt, 0.001) - effekt) * Math.min(1, dt * 1.5);
  if (spaltningerDetteBillede && aktiv) {
    tikTæller += spaltningerDetteBillede;
    if (tikTæller >= 1) { lyd.tik(); tikTæller = 0; }
  }

  if (startet && !nødstop) {
    if (effekt > NØDSTOP_GRÆNSE || neutroner.length >= MAX_NEUTRONER) forHøjTid += dt;
    else forHøjTid = 0;
    if (forHøjTid > 2) lavNødstop('Effekten blev for høj.');
    const iFeltet = effekt >= FELT[0] && effekt <= FELT[1];
    stabilTid = iFeltet ? stabilTid + dt : Math.max(0, stabilTid - dt * 2);
    if (stabilTid >= 30) løs('r-stabil');
    if (neutroner.length === 0) {
      startet = false;
      visBesked({ titel: 'Kædereaktionen gik i stå', tekst: 'Der var ikke nok neutroner til at holde den i gang. Træk stavene lidt op, og start igen.', varighed: 6000 });
    }
  }
  if (nødstop && neutroner.length === 0) startet = false;
  tegnKæde();
  opdaterKædePanel();
}

function tegnKæde() {
  // Brændsel: frisk uran er gulgrønt, brugt er gråt
  const frisk = new THREE.Color(0x7fae22);
  const brugt = new THREE.Color(0x3a4050);
  const c = new THREE.Color();
  brændsel.forEach((b, i) => {
    c.copy(brugt).lerp(frisk, 1 - b.brugt / BRUGT_TID);
    if (b.brugt > BRUGT_TID - 0.35) c.setRGB(3, 2.6, 1.4); // lige spaltet: et glimt
    brændselMesh.setColorAt(i, c);
  });
  brændselMesh.instanceColor.needsUpdate = true;

  const pos = neutronPunkter.geometry.attributes.position.array;
  const farve = neutronPunkter.geometry.attributes.color.array;
  neutroner.forEach((n, i) => {
    pos[i * 3] = n.x; pos[i * 3 + 1] = n.y; pos[i * 3 + 2] = 0.4;
    const hurtig = Math.min(1, (Math.hypot(n.vx, n.vy) - LANGSOM) / (HURTIG - LANGSOM));
    farve[i * 3] = 0.6 + 1.6 * hurtig; farve[i * 3 + 1] = 1.4 + 1.2 * hurtig; farve[i * 3 + 2] = 2.6;
  });
  neutronPunkter.geometry.setDrawRange(0, neutroner.length);
  neutronPunkter.geometry.attributes.position.needsUpdate = true;
  neutronPunkter.geometry.attributes.color.needsUpdate = true;

  const stavBund = KERNE_H / 2 + 1 - stavVist * (KERNE_H + 2);
  for (const s of staveMesh) s.position.y = stavBund + (KERNE_H + 2) / 2;
  tjerenkov.material.opacity = Math.min(0.7, effekt / MÅLER_MAX);
}

function opdaterKædePanel() {
  $('reaktorStaveTal').textContent = `${Math.round(stavDybde * 100)} % nede`;
  const del = Math.min(1, effekt / MÅLER_MAX);
  $('reaktorMåler').style.setProperty('--niveau', `${del * 100}%`);
  $('reaktorMåler').style.setProperty('--felt-fra', `${(FELT[0] / MÅLER_MAX) * 100}%`);
  $('reaktorMåler').style.setProperty('--felt-bredde', `${((FELT[1] - FELT[0]) / MÅLER_MAX) * 100}%`);
  let tekst = 'Slukket';
  if (startet) tekst = effekt < FELT[0] ? 'For lav' : effekt <= FELT[1] ? 'Stabil' : 'For høj!';
  if (nødstop) tekst = 'Nødstop';
  $('reaktorEffektTekst').textContent = `${Math.round(effekt)} spaltninger pr. sekund · ${tekst}`;
  $('reaktorNeutroner').textContent = neutroner.length;
  $('reaktorStabil').style.setProperty('--niveau', `${Math.min(100, (stabilTid / 30) * 100)}%`);
  $('reaktorStabilTekst').textContent = fremgang.erLøst('r-stabil') ? 'Klaret ★' : `${Math.floor(stabilTid)} af 30 sekunder i det grønne felt`;
}

// ---------- Hvert billede ----------
function opdater(dt) {
  tid += dt;
  if (tilstand === 'kerne') opdaterKerne(dt);
  // Kædereaktionen kører videre i baggrunden, så den ikke "fryser", når man skifter
  opdaterKæde(dt);
  effekter.opdater(dt);
}

// Kun til automatiske tests
export function testAdgang() {
  return {
    kæde: (sek, dybde) => {
      if (dybde != null) { stavDybde = dybde; stavVist = dybde; }
      const før = spaltningerIalt;
      for (let t = 0; t < sek; t += 0.01) kædeFysik(0.01);
      return `${neutroner.length}n/${Math.round((spaltningerIalt - før) / sek)}s`;
    },
    start: () => startKæde(),
    // Kør kædereaktionen som om der gik så mange sekunder (med effektmåler og nødstop)
    kør: (sek, dybde) => {
      if (dybde != null) stavDybde = dybde;
      for (let t = 0; t < sek; t += 0.05) opdaterKæde(0.05);
      return { effekt, nødstop, neutroner: neutroner.length };
    },
    nulstil: () => { neutroner = []; for (const b of brændsel) b.brugt = 0; nødstop = false; startet = false; },
    vand: (til) => { vand = til; },
  };
}
