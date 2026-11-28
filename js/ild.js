// Ild (#ild): en egen del i verdenen Kemi (docs/drejebog-ild.md med rettelserne i docs/fable/E17-ild-noter.md).
// Laboratoriet "Bordet": et stearinlys eller en gasbrænder, luften (gasbrænderen), vægtløshed (stearinlyset),
// værktøjerne (tændstik, ske og lup) og det, man slukker med (pust, glas, lysslukker, CO₂ og vand).
// Tegningen står i js/ild/bord.js, luppens atomer i js/ild/atomer.js, flammen i js/flamme.js og teksterne i js/data/ild.js.
// Et værktøj følger fingeren eller musen i 3D-billedet (det kan også flyttes, mens tiden står stille). Uden værktøj
// drejer et træk kameraet lidt.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, LAV_KVALITET, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { rydBeskeder, bundIVindue } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import { lavKontakt } from './kontakt.js';
import { lavTidsknap } from './pause.js';
import { tagVentForløb, tagVentIld } from './gaa.js';
import { lavKnaldgas, startKnaldgas, stopKnaldgas, testAdgang as knaldTest } from './knaldgas.js';
import { startForløb, stopForløb, starterSelv, forløbVenter, forløbRørt, forløbVink, forløbTest, lavTurKnap } from './forloeb.js';
import { ILD_1 } from './data/forloeb/ild.js';
import { HVORFOR } from './data/hvorfor.js';
import { PANEL, ZONER, ILD_KORT, ATOM_GØR, TÆLLER, skeZone, skeSkridt } from './data/ild.js';
import { lavBord, VÆGE, FOD, LYS_FLAMME, BRÆNDER_TOP, BRÆNDER_FLAMME, HVILE } from './ild/bord.js';
import { lavAtomScene, ATOM_KASSE } from './ild/atomer.js';
import { lavFlamme } from './flamme.js';

const $ = (id) => document.getElementById(id);
const TONING = 260; // ms for hver halvdel af toningen mellem bordet og atomerne (stilguiden A10)
const BORD_KASSE = [5.4, 4.9];
const BORD_MIDT = new THREE.Vector3(0, 0.9, 0);
const LØB_TID = ROLIG ? 0.3 : 0.55; // sekunder om at løbe ned gennem røgen
const FINGER_OP = 70; // px: med en finger står værktøjets spids så meget over fingeren, så den kan ses
const PUST_EFTER = 1800; // ms: i turens trin 1 brænder lyset så længe, før det bliver pustet ud
const VIS_O2 = ROLIG ? 300 : 800; // ms mellem O₂, når "Næste ›" viser trin 3

let bord = null;
let atomScene = null;
let løberFlamme = null;
let aktiv = false;
let scene = 'bord'; // 'bord', 'atomer' eller 'knaldgas' (boksen med 4 H₂ og 2 O₂, js/knaldgas.js)
let flamme = 'lys'; // 'lys' eller 'brænder'
let værktøj = null; // null, 'tændstik' eller 'ske'
let tyngde = 1; // 1 Jorden, 0 rumstationen
let luft = 0; // gasbrænderens luftring 0-1
let gas = true;
let tændstikTændt = true;
let hændelse = null; // den sidste ting, der skete (en nøgle i PANEL), til noget andet sker
let løber = null; // { fra, t }: flammen løber ned gennem røgen
let slukning = null; // { slags, t, sket }
let autoTænd = false; // "Tænd lyset": tændstikken går selv hen til vægen
let pause = null;
let rumKontakt = null;
let gasKontakt = null;
let panelTegnet = '';
let styringTegnet = '';
let toningTimer = null;
let skiftNr = 0;
let træk = null; // { id, finger }
let trin = null; // turens trin, mens den kører
let timere = [];
let genTimer = false; // trin 1: lyset tændes og pustes ud igen, når røgen er væk
let sodVinket = false;
let tællerTegnet = '';
const ske = { varme: 0, dug: 0, sod: 0, zone: 'ingen' };
const værktøjMål = new THREE.Vector3();
const stråle = new THREE.Raycaster();
const plan = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.4); // værktøjerne flyttes i planet z = 0,4
const atomPlan = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const tV = new THREE.Vector3();
const tV2 = new THREE.Vector3();

const vent = (ms, f) => timere.push(setTimeout(() => { if (aktiv) f(); }, ms));
function rydTimere() {
  for (const t of timere) clearTimeout(t);
  timere = [];
  genTimer = false;
}
const lysBrænder = () => bord.lysFlamme.brænder();
const brænderBrænder = () => bord.brænderFlamme.brænder();

export function lav() {
  bord = lavBord();
  bord.gruppe.visible = false;
  verden.scene.add(bord.gruppe);
  løberFlamme = lavFlamme({ bredde: 0.16, højde: 0.6 });
  bord.gruppe.add(løberFlamme.gruppe);
  atomScene = lavAtomScene();
  atomScene.gruppe.visible = false;
  verden.scene.add(atomScene.gruppe);

  lavTurKnap($('ild'), [ILD_1], () => startTur());
  const vindue = $('ildVindue');
  const tæller = document.createElement('p');
  tæller.className = 'ild-tæller';
  tæller.id = 'ildTæller';
  tæller.hidden = true;
  vindue.append(tæller);
  const toning = document.createElement('div');
  toning.className = 'fl-toning';
  toning.id = 'ildToning';
  vindue.append(toning);
  const række = document.createElement('div');
  række.className = 'bjælke-række ild-kun';
  bundIVindue(vindue).append(række);
  pause = lavTidsknap({ holder: række, aktiv: () => aktiv && scene !== 'knaldgas' });
  række.querySelector('.tidsknap').id = 'ildTid';

  for (const b of document.querySelectorAll('[data-ild-flamme]')) b.addEventListener('click', () => { lyd.klik(); vælgFlamme(b.dataset.ildFlamme); });
  for (const b of document.querySelectorAll('[data-ild-vaerktoej]')) b.addEventListener('click', () => { lyd.klik(); vælgVærktøj(b.dataset.ildVaerktoej); });
  for (const b of document.querySelectorAll('[data-ild-sluk]')) b.addEventListener('click', () => sluk(b.dataset.ildSluk));
  $('ildLuft').addEventListener('input', (h) => sætLuft(Number(h.target.value) / 100));
  rumKontakt = lavKontakt($('ildRum'));
  rumKontakt.knap.addEventListener('click', () => { lyd.klik(); sætTyngde(tyngde > 0.5 ? 0 : 1); });
  gasKontakt = lavKontakt($('ildGas'));
  gasKontakt.knap.addEventListener('click', () => { lyd.klik(); sætGas(!gas); });
  $('ildTænd').addEventListener('click', () => { lyd.klik(); tændSelv(); });
  $('ildTilbage').addEventListener('click', () => { lyd.klik(); vælgScene('bord'); });
  $('ildKnaldgas').addEventListener('click', () => { lyd.klik(); vælgScene('knaldgas'); });
  // Knaldgassen (flyttet fra Molekyler): "‹ Tilbage til bordet" i dens panel
  lavKnaldgas({ tilbage: () => vælgScene('bord'), vært: 'ild', vindue: 'ildVindue' });
  $('ildAtomIgen').addEventListener('click', () => { lyd.klik(); atomScene.nulstil(); visStyring(); });
  $('ildHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpIld').classList.remove('skjult'); });
  $('ildHjælpTur').addEventListener('click', () => {
    lyd.klik();
    $('hjælpIld').classList.add('skjult');
    startTur();
  });
  $('ildHvorfor').innerHTML = ILD_KORT.map((id) => `<button class="hvorfor" data-hvorfor="${id}">${HVORFOR[id].spørgsmål}</button>`).join('');
  lavTræk();
}

export function start() {
  aktiv = true;
  sætVindue($('ildVindue'));
  verden.styring.autoRotate = false;
  begrænsDrejning({ vandret: 0.6, lodret: 0.28 });
  verden.opdateringer.add(opdater);
  nulstilBord();
  vælgScene('bord', { straks: true });
  pause.sæt('spil');
  // Fra "Knaldgas i Ild ›" i Molekyler åbner knaldgassen. Ellers starter turen af sig selv første gang, og når man kommer
  // fra dens link eller "Din fremgang".
  if (tagVentIld() === 'knaldgas') vis('knaldgas');
  else if (tagVentForløb([ILD_1.id]) || starterSelv(ILD_1)) startTur();
}

export function stop() {
  stopForløb(); // kalder DEL.slut
  stopKnaldgas();
  scene = 'bord';
  $('ild').classList.remove('knaldgas');
  aktiv = false;
  rydTimere();
  slipTræk();
  clearTimeout(toningTimer);
  $('ildToning').classList.remove('mørk');
  verden.opdateringer.delete(opdater);
  bord.gruppe.visible = false;
  atomScene.gruppe.visible = false;
  begrænsDrejning(null);
  $('hjælpIld').classList.add('skjult');
}

// Et link fra en anden skærm (js/gaa.js): 'knaldgas' åbner boksen med 4 H₂ og 2 O₂
export function vis(id) {
  if (!aktiv) return;
  if (id === 'knaldgas') {
    stopForløb();
    vælgScene('knaldgas', { straks: true });
  }
}

// Bordet som det står, når man kommer: et stearinlys, der brænder, og ingen værktøjer
function nulstilBord() {
  flamme = 'lys';
  værktøj = null;
  tyngde = 1;
  luft = 0;
  gas = true;
  tændstikTændt = true;
  hændelse = null;
  løber = null;
  slukning = null;
  autoTænd = false;
  Object.assign(ske, { varme: 0, dug: 0, sod: 0, zone: 'ingen' });
  bord.nulstil();
  bord.visFlamme('lys');
  bord.t.tyngde = 1;
  bord.t.luft = 0;
  bord.lysFlamme.straks({ lys: 1, sod: 1, tyngde: 1, bøj: 0 });
  bord.brænderFlamme.straks({ lys: 1, sod: 1, tyngde: 1, bøj: 0 });
  bord.brænderFlamme.gruppe.scale.y = 1.45;
  bord.tændstikFlamme.straks({ lys: 1, sod: 1, tyngde: 1 });
  løberFlamme.straks({ lys: 0 });
  bord.tændstik.visible = false;
  bord.ske.visible = false;
  $('ildLuft').value = '0';
  atomScene.nulstil();
  visStyring();
  panel();
}

// ---------- Hvert billede ----------
function opdater(dt, tid) {
  // Værktøjet følger fingeren, også under pause
  const v = værktøj === 'tændstik' ? bord.tændstik : værktøj === 'ske' ? bord.ske : null;
  if (v) v.position.lerp(værktøjMål, 1 - Math.exp(-dt * (ROLIG ? 40 : 16)));
  const d = pause.til ? 0 : dt;
  if (scene === 'knaldgas') return; // knaldgassen har sin egen opdatering og sine egne paneler
  if (scene === 'atomer') {
    atomScene.opdater(d, verden.kamera);
  } else {
    bord.opdater(d, verden.kamera);
    løberFlamme.opdater(d, verden.kamera);
    if (d > 0) {
      tændstik(d);
      skeen(d);
      røgLøb(d);
      slukningen(d);
    }
  }
  if (trin === 'roeg' && d > 0) røgIgen();
  tegnTæller();
  const s = styringNøgle();
  if (s !== styringTegnet) visStyring();
  panel();
}

// Tælleren i luppen: atomerne før, og efter reaktionen de samme igen
function tegnTæller() {
  const el = $('ildTæller');
  const f = scene === 'atomer' ? atomScene.fase() : '';
  if (f === tællerTegnet) return;
  tællerTegnet = f;
  el.hidden = scene !== 'atomer';
  if (el.hidden) return;
  const t = TÆLLER(atomScene.tal());
  el.innerHTML = `<span>Før: ${t}</span>${f === 'færdig' ? `<span>Efter: ${t}</span>` : ''}`;
}

// Trin 1: Er røgen væk, før tændstikken nåede den, tændes lyset og pustes ud igen
function røgIgen() {
  if (genTimer || lysBrænder() || løber || slukning || bord.t.røgKilde > 0 || bord.røg.levende() > 2) return;
  genTimer = true;
  vent(600, () => {
    if (trin !== 'roeg' || lysBrænder()) { genTimer = false; return; }
    bord.lysFlamme.sæt({ lys: 1 }, { lys: 3 });
    vent(PUST_EFTER * 0.8, () => { genTimer = false; if (trin === 'roeg') blæsUd(); });
  });
}

// Lyset bliver pustet ud (med lyd og et vindstød)
function blæsUd() {
  if (!lysBrænder()) return;
  sluk('pust');
}

// Tændstikken tænder lyset ved vægen eller gennem røgen, og den tændes igen i en flamme
function tændstik(d) {
  if (værktøj !== 'tændstik') return;
  if (autoTænd && lysBrænder()) {
    autoTænd = false;
    værktøjMål.copy(HVILE.tændstik);
  }
  const H = bord.tændstik.position;
  if (tændstikTændt) {
    if (flamme !== 'lys' || lysBrænder() || løber || bord.t.glas > 0.1) return;
    if (H.distanceTo(VÆGE) < 0.6) tænd('tændstik');
    else if (H.y > VÆGE.y + 0.35 && bord.røgVed(H, 0.3) >= 2) {
      løber = { fra: H.clone(), t: 0 };
      løberFlamme.straks({ lys: 1, tyngde: tyngde });
    }
  } else {
    // En slukket tændstik i en flamme tændes igen
    const f = flamme === 'lys' ? bord.lysFlamme : bord.brænderFlamme;
    const fod = flamme === 'lys' ? FOD : BRÆNDER_TOP;
    const h = (flamme === 'lys' ? LYS_FLAMME.højde : BRÆNDER_FLAMME.højde * bord.brænderFlamme.gruppe.scale.y) * (tyngde > 0.5 ? 1 : 0.25);
    if (f.brænder() && Math.abs(H.x) < 0.5 && H.y > fod && H.y < fod + h) {
      tændstikTændt = true;
      bord.tændstikFlamme.sæt({ lys: 1 });
      lyd.tændes();
    }
  }
}

// Flammen løber ned gennem røgen til vægen
function røgLøb(d) {
  if (!løber) return;
  løber.t = Math.min(1, løber.t + d / LØB_TID);
  løberFlamme.gruppe.position.lerpVectors(løber.fra, VÆGE, løber.t);
  if (løber.t >= 1) {
    løber = null;
    løberFlamme.straks({ lys: 0 });
    bord.røg.ryd();
    tænd('gennemRøgen');
  }
}

function tænd(hvorfor) {
  bord.lysFlamme.sæt({ lys: 1, bøj: 0 }, { lys: 2.5 });
  bord.t.røgKilde = 0;
  slukning = null;
  hændelse = hvorfor;
  lyd.tændes();
  // Trin 1: Tændstikken rørte vægen. Lyset pustes ud igen, så man kan prøve røgen.
  if (trin === 'roeg' && hvorfor === 'tændstik') {
    forløbVink('Prøv igen, uden at røre vægen.');
    vent(1400, () => { if (trin === 'roeg') blæsUd(); });
  }
  if (trin === 'roeg' && hvorfor === 'gennemRøgen') forløbVink('');
}

// Skeens skål i forhold til flammen: dug over flammen, sod i den gule del
function skeen(d) {
  if (værktøj !== 'ske') return;
  const B = bord.ske.position;
  let zone = 'ingen';
  let sodNu = 1;
  if (flamme === 'lys' && lysBrænder()) {
    const f = bord.lysFlamme.nu;
    sodNu = f.sod;
    zone = skeZone(B.x / LYS_FLAMME.bredde, (B.y - FOD) / LYS_FLAMME.højde, { sod: f.sod, tyngde: f.tyngde, højdeForhold: LYS_FLAMME.højde / LYS_FLAMME.bredde });
  } else if (flamme === 'brænder' && brænderBrænder()) {
    const f = bord.brænderFlamme.nu;
    sodNu = f.sod;
    const h = BRÆNDER_FLAMME.højde * bord.brænderFlamme.gruppe.scale.y;
    zone = skeZone(B.x / BRÆNDER_FLAMME.bredde, (B.y - BRÆNDER_TOP) / h, { sod: f.sod, tyngde: 1, højdeForhold: h / BRÆNDER_FLAMME.bredde });
  }
  ske.zone = zone;
  // I turen køler skeen hurtigt igen, så dugget kan komme, selv om man først har holdt den i flammen
  skeSkridt(ske, zone, d, sodNu, trin === 'ske' ? 0.35 : 0.1);
  if (trin === 'ske' && ske.sod > 0.3 && !sodVinket) {
    sodVinket = true;
    forløbVink('Det er sod. Det vender vi tilbage til. Hold skeen over flammen.');
  }
  bord.t.dug = ske.dug;
  bord.t.sod = ske.sod;
}

// ---------- Slukke ----------
function sluk(slags) {
  if (flamme !== 'lys') return;
  if (slags === 'vand') {
    if (værktøj === 'tændstik' && tændstikTændt) {
      tændstikTændt = false;
      bord.tændstikFlamme.sæt({ lys: 0 }, { lys: 10 });
      hændelse = 'vandTændstik';
      lyd.fjern();
    } else {
      hændelse = 'vandLys';
      lyd.nej();
    }
    return;
  }
  if (slags === 'glas' && bord.t.glasMål > 0) {
    // Glasset løftes igen
    lyd.klik();
    bord.t.glasMål = 0;
    if (slukning?.slags === 'glas') slukning = null;
    return;
  }
  if (!lysBrænder() && slags !== 'glas') return;
  lyd.klik();
  autoTænd = false;
  slukning = { slags, t: 0, sket: false };
  if (slags === 'glas') bord.t.glasMål = 1;
  else if (slags === 'slukker') bord.t.slukkerMål = 1;
  else if (slags === 'co2') bord.co2Sky(1.1);
  else if (slags === 'pust') bord.lysFlamme.sæt({ bøj: 1 }, { bøj: 10 });
  hændelse = slags === 'slukker' ? 'slukker' : slags;
}

function slukningen(d) {
  if (!slukning) return;
  const s = slukning;
  s.t += d;
  const f = bord.lysFlamme;
  const ud = (fart, røg) => {
    s.sket = true;
    f.sæt({ lys: 0, bøj: 0 }, { lys: fart, bøj: 4 });
    if (røg) bord.røgFra(røg);
  };
  if (s.slags === 'pust') {
    if (!s.sket && s.t > 0.3) { ud(14, 3.4); lyd.fjern(); }
    if (s.t > 0.8) slukning = null;
  } else if (s.slags === 'glas') {
    // Under glasset bliver flammen mindre og går ud, når oxygenet ikke kan komme ind (tiden er valgt, se "Ærligt talt")
    if (!s.sket && lysBrænder() && bord.t.glas > 0.95) { s.sket = true; f.sæt({ lys: 0 }, { lys: 0.32 }); }
    if (s.sket && f.nu.lys < 0.05 && !s.røg) { s.røg = true; f.straks({ lys: 0 }); bord.røgFra(2.2); }
    if (s.røg) slukning = null;
  } else if (s.slags === 'slukker') {
    if (!s.sket && bord.t.slukker > 0.9) ud(16, 1.2);
    if (s.t > 1.4) { bord.t.slukkerMål = 0; slukning = null; }
  } else if (s.slags === 'co2') {
    if (!s.sket && s.t > 0.9) ud(6, 2);
    if (s.t > 1.5) slukning = null;
  }
}

// "Tænd lyset": en ny tændstik, der selv går hen til vægen (også for tastatur og "reducer bevægelse")
function tændSelv() {
  if (flamme !== 'lys' || lysBrænder()) return;
  if (bord.t.glasMål > 0) bord.t.glasMål = 0;
  if (værktøj !== 'tændstik') vælgVærktøj('tændstik');
  if (!tændstikTændt) { tændstikTændt = true; bord.tændstikFlamme.straks({ lys: 1 }); }
  autoTænd = true;
  værktøjMål.copy(VÆGE).add(tV.set(0.12, 0.1, 0));
}

// ---------- Valgene til venstre ----------
function vælgFlamme(id) {
  if (id === flamme || !['lys', 'brænder'].includes(id)) return;
  flamme = id;
  hændelse = null;
  slukning = null;
  løber = null;
  løberFlamme.straks({ lys: 0 });
  bord.nulstil();
  bord.t.tyngde = tyngde = 1;
  bord.t.luft = luft;
  bord.lysFlamme.straks({ tyngde: 1, lys: 1, bøj: 0 });
  bord.tændstikFlamme.straks({ tyngde: 1 });
  rumKontakt.sæt(false);
  bord.visFlamme(id);
  Object.assign(ske, { varme: 0, dug: 0, sod: 0, zone: 'ingen' });
  visStyring();
}

function vælgVærktøj(id) {
  if (id === 'lup') return vælgScene('atomer');
  if (id === værktøj) {
    // Et tryk igen lægger værktøjet væk
    værktøj = null;
    bord.tændstik.visible = bord.ske.visible = false;
    autoTænd = false;
    visStyring();
    return;
  }
  værktøj = id;
  bord.tændstik.visible = id === 'tændstik';
  bord.ske.visible = id === 'ske';
  // Værktøjet kommer frem fra højre (en ny tændstik er tændt, en ny ske er ren og kold)
  const v = id === 'tændstik' ? bord.tændstik : bord.ske;
  værktøjMål.copy(HVILE[id]);
  v.position.copy(HVILE[id]).add(tV.set(3, -1, 0));
  if (id === 'tændstik') {
    tændstikTændt = true;
    bord.tændstikFlamme.straks({ lys: 1, tyngde });
  } else Object.assign(ske, { varme: 0, dug: 0, sod: 0, zone: 'ingen' });
  visStyring();
}

function sætLuft(x) {
  luft = Math.min(1, Math.max(0, x));
  bord.t.luft = luft;
  // Med luft nok bliver der ingen sod: Flammen bliver blå, kortere og roligere
  const sod = Math.min(1, Math.max(0, 1 - luft * 1.25));
  bord.brænderFlamme.sæt({ sod });
  bord.brænderFlamme.gruppe.scale.y = 1.45 - 0.45 * luft;
  if (hændelse) hændelse = null;
}

function sætTyngde(t) {
  if (flamme !== 'lys') return;
  tyngde = t;
  bord.t.tyngde = t;
  bord.lysFlamme.sæt({ tyngde: t });
  bord.tændstikFlamme.sæt({ tyngde: t });
  hændelse = null;
  rumKontakt.sæt(t < 0.5);
}

function sætGas(til) {
  gas = til;
  bord.brænderFlamme.sæt({ lys: til ? 1 : 0 }, { lys: til ? 3 : 12 });
  if (til) lyd.tændes();
  gasKontakt.sæt(til);
  hændelse = null;
}

// ---------- Bordet og atomerne ----------
function vælgScene(id, { straks = false } = {}) {
  const nr = ++skiftNr;
  clearTimeout(toningTimer);
  const toning = $('ildToning');
  slipTræk();
  const gør = () => {
    const fra = scene;
    scene = id;
    bord.gruppe.visible = id === 'bord';
    atomScene.gruppe.visible = id === 'atomer';
    if (id === 'atomer') atomScene.nulstil();
    rydBeskeder();
    lukHvorfor();
    if (id === 'knaldgas') startKnaldgas(); // sætter selv kameraet og klassen knaldgas
    else {
      if (fra === 'knaldgas') {
        stopKnaldgas();
        begrænsDrejning({ vandret: 0.6, lodret: 0.28 });
        verden.styring.autoRotate = false;
      }
      kamera();
    }
    visStyring();
    toning.classList.remove('mørk');
  };
  if (straks || ROLIG || id === scene) return gør();
  // Til atomerne dykker kameraet først ind i flammens kant
  if (id === 'atomer') {
    verden.styring.target.set(0.35, FOD + 1, 0);
    verden.målAfstand = 6;
  }
  toning.classList.add('mørk');
  toningTimer = setTimeout(() => { if (nr === skiftNr && aktiv) gør(); }, id === 'atomer' ? TONING + 200 : TONING);
}

// Kameraet står forfra og lidt over, og bordet (eller atomerne) passer i billedet
function kamera() {
  const { kamera: k, styring } = verden;
  const [b, h] = scene === 'atomer' ? ATOM_KASSE : BORD_KASSE;
  const d = Math.max(k.position.distanceTo(styring.target), 18);
  styring.target.copy(scene === 'atomer' ? tV.set(0, 0, 0) : BORD_MIDT);
  k.position.set(0, styring.target.y + d * 0.12, d);
  passerTilBoks(b, h);
}

// ---------- Træk i 3D ----------
function punktI(x, y, p, ud) {
  const r = verden.renderer.domElement.getBoundingClientRect();
  stråle.setFromCamera({ x: ((x - r.left) / r.width) * 2 - 1, y: -((y - r.top) / r.height) * 2 + 1 }, verden.kamera);
  return stråle.ray.intersectPlane(p, ud);
}

function lavTræk() {
  const lærred = verden.renderer.domElement;
  lærred.addEventListener('pointerdown', (h) => {
    if (!aktiv || træk) return;
    const finger = h.pointerType === 'touch' || (h.pointerType !== 'mouse' && LAV_KVALITET);
    if (scene === 'atomer') {
      if (!punktI(h.clientX, h.clientY, atomPlan, tV)) return;
      if (!atomScene.tagFat(h.clientX, h.clientY, verden.kamera, lærred.getBoundingClientRect(), finger, tV)) return;
    } else if (scene !== 'bord' || !værktøj) return;
    træk = { id: h.pointerId, finger };
    verden.styring.enabled = false;
    lærred.setPointerCapture?.(h.pointerId);
    h.stopImmediatePropagation();
    h.preventDefault();
    flytTil(h.clientX, h.clientY);
  }, { capture: true });
  lærred.addEventListener('pointermove', (h) => {
    if (træk && h.pointerId === træk.id) flytTil(h.clientX, h.clientY);
  });
  const slip = (h) => {
    if (!træk || h.pointerId !== træk.id) return;
    if (scene === 'atomer' && atomScene.slip()) lyd.proton();
    slipTræk();
  };
  lærred.addEventListener('pointerup', slip);
  lærred.addEventListener('pointercancel', slip);
  // Trin 4: et kort tryk i scenen puster også til flammen
  let ned = null;
  lærred.addEventListener('pointerdown', (h) => { ned = aktiv && trin === 'pust' ? { id: h.pointerId, x: h.clientX, y: h.clientY, t: performance.now() } : null; });
  lærred.addEventListener('pointerup', (h) => {
    if (!ned || h.pointerId !== ned.id) return;
    const kort = performance.now() - ned.t < 600 && Math.hypot(h.clientX - ned.x, h.clientY - ned.y) < 12;
    ned = null;
    if (kort && trin === 'pust' && forløbVenter() && lysBrænder()) {
      forløbRørt();
      sluk('pust');
    }
  });
}

function flytTil(x, y) {
  if (scene === 'atomer') {
    if (punktI(x, y, atomPlan, tV)) atomScene.trækTil(tV);
    return;
  }
  if (punktI(x, træk.finger ? y - FINGER_OP : y, plan, tV2)) {
    autoTænd = false;
    værktøjMål.copy(tV2);
    // Ikke ned i bordet og ikke langt ud til siden
    værktøjMål.x = THREE.MathUtils.clamp(værktøjMål.x, -6, 7);
    værktøjMål.y = THREE.MathUtils.clamp(værktøjMål.y, FOD - 0.4, 8);
  }
}

function slipTræk() {
  if (!træk) return;
  træk = null;
  verden.styring.enabled = true;
  if (atomScene.trækker()) atomScene.slip();
}

// ---------- Panelerne ----------
const styringNøgle = () => `${scene}${flamme}${værktøj}${lysBrænder()}${bord.t.glasMål}${tyngde}${gas}${atomScene.fase()}`;

function visStyring() {
  styringTegnet = styringNøgle();
  $('ild-bord').hidden = scene !== 'bord';
  $('ild-atomer').hidden = scene !== 'atomer';
  const valgt = (b, ja) => { b.classList.toggle('valgt', ja); b.setAttribute('aria-pressed', String(ja)); };
  for (const b of document.querySelectorAll('[data-ild-flamme]')) valgt(b, b.dataset.ildFlamme === flamme);
  for (const b of document.querySelectorAll('[data-ild-vaerktoej]')) valgt(b, b.dataset.ildVaerktoej === værktøj);
  const lys = flamme === 'lys';
  $('ildLuftGruppe').hidden = lys;
  $('ildRumGruppe').hidden = !lys;
  $('ildSlukLys').hidden = !lys;
  $('ildSlukBrænder').hidden = lys;
  rumKontakt.sæt(tyngde < 0.5);
  gasKontakt.sæt(gas);
  const brænder = lysBrænder();
  for (const b of document.querySelectorAll('[data-ild-sluk]')) {
    const s = b.dataset.ildSluk;
    b.disabled = s === 'glas' ? !brænder && bord.t.glasMål === 0 : s !== 'vand' && !brænder;
  }
  $('ildGlasTekst').textContent = bord.t.glasMål > 0 ? 'Løft glasset' : 'Glas';
  $('ildTænd').hidden = !lys || brænder;
  $('ildAtomTekst').textContent = atomScene.fase() === 'færdig' ? ATOM_GØR.færdig : ATOM_GØR.klar;
  $('ildAtomIgen').hidden = atomScene.fase() !== 'færdig';
}

// Hvad højre panel skal vise lige nu
function panelIndhold() {
  if (scene === 'atomer') return PANEL[atomScene.fase() === 'færdig' ? 'atomerFærdig' : 'atomer'];
  // Skeen i eller over flammen
  if (værktøj === 'ske' && ske.zone !== 'ingen') {
    const z = ZONER[ske.zone];
    const tal = [['Skeen er', z.navn]];
    if (z.temp) tal.push(['Temperaturen dér', z.temp]);
    let nøgle = ske.zone === 'blå' ? 'blåSke' : ske.zone === 'kuppel' ? 'rum' : ske.zone;
    if (ske.zone === 'over') nøgle = ske.dug > 0.15 || ske.varme < 0.5 ? 'dug' : hændelse ?? (flamme === 'lys' ? 'lys' : 'brænderLidt');
    if (ske.zone === 'gul' && ske.sod > 0.3) nøgle = 'sod';
    return { ...PANEL[nøgle], tal };
  }
  if (hændelse) return PANEL[hændelse];
  if (flamme === 'brænder') return PANEL[!gas ? 'brænderLukket' : luft < 0.35 ? 'brænderLidt' : luft < 0.75 ? 'brænderNoget' : 'brænderMeget'];
  if (!lysBrænder()) return PANEL.slukket;
  return PANEL[tyngde < 0.5 ? 'rum' : 'lys'];
}

function panel() {
  const p = panelIndhold();
  const tal = p.tal ?? [];
  const nøgle = `${p.titel}|${tal.map((t) => t.join(':')).join(';')}`;
  if (nøgle === panelTegnet) return;
  panelTegnet = nøgle;
  $('ildTitel').textContent = p.titel;
  $('ildTekst').textContent = p.tekst;
  const dl = $('ildTal');
  dl.innerHTML = '';
  for (const [navn, værdi] of tal) {
    const d = document.createElement('div');
    d.innerHTML = '<dt></dt><dd></dd>';
    d.querySelector('dt').textContent = navn;
    d.querySelector('dd').textContent = værdi;
    dl.append(d);
  }
  dl.hidden = !tal.length;
}

// ---------- Turen "Hvad brænder egentlig?" ----------
function startTur() {
  if (!aktiv) return;
  lukHvorfor();
  startForløb(ILD_1, DEL);
}

// Et trin starter: rydder vink og timere fra det forrige og stiller bordet op med et stearinlys, der brænder
function trinStart(id, opsæt) {
  rydTimere();
  rydBeskeder();
  trin = id;
  sodVinket = false;
  const gør = () => {
    if (flamme !== 'lys') vælgFlamme('lys');
    if (tyngde < 0.5) sætTyngde(1);
    bord.t.glasMål = bord.t.slukkerMål = 0;
    bord.t.kredsløb = false;
    slukning = null;
    løber = null;
    løberFlamme.straks({ lys: 0 });
    hændelse = null;
    if (!lysBrænder()) bord.lysFlamme.straks({ lys: 1, bøj: 0 });
    opsæt();
  };
  if (scene !== 'bord' && id !== 'atomer') {
    vælgScene('bord');
    vent(ROLIG ? 0 : TONING + 20, gør);
  } else gør();
}

// Værktøjet til trinet (eller intet), frisk fra højre
function tagVærktøj(id) {
  if (værktøj === id) værktøj = null;
  if (id) vælgVærktøj(id);
  else if (værktøj) vælgVærktøj(værktøj);
}

const DEL = {
  trin: {
    roeg: {
      // Lyset brænder i to sekunder og bliver pustet ud. Tændstikken ligger klar.
      start: () => trinStart('roeg', () => {
        tagVærktøj('tændstik');
        vent(PUST_EFTER, () => blæsUd());
      }),
      færdig: () => hændelse === 'gennemRøgen' && lysBrænder(),
      visMig: () => {
        autoTænd = false;
        const ind = () => værktøjMål.copy(VÆGE).add(tV.set(0, 1.5, 0.4 - VÆGE.z));
        if (værktøj !== 'tændstik') tagVærktøj('tændstik');
        if (lysBrænder()) { blæsUd(); vent(500, ind); } else ind();
      },
    },
    ske: {
      start: () => trinStart('ske', () => tagVærktøj('ske')),
      færdig: () => ske.dug > 0.6,
      // En ny, kold ske over flammen
      visMig: () => {
        tagVærktøj('ske');
        værktøjMål.set(0, FOD + LYS_FLAMME.højde * 1.35, 0.4);
      },
    },
    atomer: {
      start: () => trinStart('atomer', () => {
        tagVærktøj(null);
        if (scene === 'atomer') atomScene.nulstil();
        else vælgScene('atomer');
      }),
      færdig: () => scene === 'atomer' && atomScene.fase() === 'færdig',
      visMig: () => {
        for (let i = 0; i < 3; i++) vent(i * VIS_O2, () => { if (atomScene.lægNæste()) lyd.proton(); });
      },
    },
    pust: {
      // Prikkerne viser kredsløbet, mens man gætter: varmen ned, stearinen op i vægen og dampen ind i flammen
      start: () => trinStart('pust', () => {
        tagVærktøj(null);
        bord.t.kredsløb = true;
      }),
      get knapper() {
        return [{ id: 'pust', tekst: 'Pust', gør: () => sluk('pust'), aktiv: () => lysBrænder() && !slukning }];
      },
      færdig: () => {
        const ok = hændelse === 'pust' && !lysBrænder();
        if (ok) bord.t.kredsløb = false;
        return ok;
      },
      visMig: () => sluk('pust'),
    },
  },
  layout: () => kamera(),
  // Stearinsyre: 100 g giver ca. 280 g CO₂ og 115 g vand, paraffin ca. 310 g og 135 g (docs/fakta-ild.md, afsnit 3)
  slutTekst: () => 'Et lys på 100 gram bliver til ca. 300 gram CO₂ og over 100 gram vand. Resten af vægten kom fra oxygenet i luften.',
  veje: [
    { tekst: 'Leg med flammen', primær: true, her: true, gør: () => requestAnimationFrame(() => kamera()) },
    { tekst: 'Hvorfor er flammen gul?', hvorfor: 'ildGul' },
    // Til forløb 4 findes: knaldgassen med måleren (brudt og dannet)
    { tekst: 'Se, hvor varmen kommer fra', gør: () => vælgScene('knaldgas') },
  ],
  slut: () => {
    trin = null;
    rydTimere();
    bord.t.kredsløb = false;
    visStyring();
    panelTegnet = '';
    panel();
  },
};

// ---------- Til tests (?test) ----------
export function testAdgang() {
  return {
    forløb: forløbTest(),
    startTur: () => startTur(),
    knaldgas: knaldTest(),
    vis: (id) => vis(id),
    scene: () => scene,
    trin: () => trin,
    kredsløb: () => bord.t.kredsløb,
    tæller: () => ($('ildTæller').hidden ? '' : $('ildTæller').textContent),
    tilstand: () => ({
      scene, flamme, værktøj, tyngde, luft, gas, tændstikTændt, hændelse,
      lysBrænder: lysBrænder(), brænderBrænder: brænderBrænder(), løber: Boolean(løber), glas: bord.t.glasMål,
      ske: { ...ske }, røg: bord.røg.levende(), co2: bord.co2.levende(), synlig: bord.gruppe.visible,
    }),
    lysFlamme: () => bord.lysFlamme.tilstand(),
    brænderFlamme: () => bord.brænderFlamme.tilstand(),
    panel: () => ({ titel: $('ildTitel').textContent, tekst: $('ildTekst').textContent, tal: [...$('ildTal').querySelectorAll('div')].map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]) }),
    vælgFlamme: (id) => vælgFlamme(id),
    vælgVærktøj: (id) => vælgVærktøj(id),
    vælgScene: (id) => vælgScene(id, { straks: true }),
    sluk: (s) => sluk(s),
    tændSelv: () => tændSelv(),
    sætLuft: (x) => sætLuft(x),
    sætTyngde: (t) => sætTyngde(t),
    sætGas: (g) => sætGas(g),
    // Flytter værktøjet straks (uden at glide)
    flytVærktøj(x, y, z = 0.4) {
      værktøjMål.set(x, y, z);
      (værktøj === 'tændstik' ? bord.tændstik : bord.ske).position.copy(værktøjMål);
    },
    vægen: () => VÆGE.toArray(),
    atomer: {
      lægNæste: () => atomScene.lægNæste(),
      fase: () => atomScene.fase(),
      lagt: () => atomScene.lagt(),
      tal: () => atomScene.tal(),
      molekyler: () => atomScene.molekyler(),
      navne: () => atomScene.navne(),
    },
    pause: () => pause.tilstand,
    sætPause: (t) => pause.sæt(t),
    opdateres: () => verden.opdateringer.has(opdater),
    // Spoler tiden frem i små skridt (som på en skærm med 20 billeder i sekundet)
    spol(sek) {
      for (let t = 0; t < sek; t += 0.05) opdater(0.05, 0);
    },
  };
}
