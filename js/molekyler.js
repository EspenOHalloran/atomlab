// Molekyler → "Giv elektroner" (docs/plan-molekyler.md, M1: det der hed Byttebørsen). Indtil 14. november 2026 i Atomværkstedet.
// Man trækker metallets yderste elektron over til ikkemetallet. Måleren ("Regnskabet") viser ærligt, at det koster energi,
// og at gevinsten først kommer, når plus og minus trækker i hinanden: i et par (kun Na + Cl, med harpunen) og i krystallen.
// Parrene (M1b): Na + Cl, Li + F, Mg + O, Ca + 2 Cl og Na + Na (de bytter ikke). Hvert par er en opgave (fremgang.js).
// Tallene står i js/data/molekyler.js (kilderne i docs/fakta-molekyler.md). Alt bevægeligt bruger dt fra opdateringen,
// så tidsknappen kan stoppe det.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, stopKamera, LAV_KVALITET, ROLIG, lavPrikTekstur } from './scene3d.js';
import { MolekyleAtom } from './molekyle3d.js';
import {
  PAR, PAR_RÆKKE, OPGAVER_BYTTE, STOFFER, regnskab, harpunAfstand, ionparKraft, ionSkaller, tagEnergi, giveEnergi, flytEnergi,
  byttePris, iAltElektroner, gitterEnergi, krystalGevinst, ladningsTræk, målerSkala, krystalPladser, KJ_PR_EV,
} from './data/molekyler.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked, bundIVindue } from './beskeder.js';
import { lavTidsknap } from './pause.js';
import { lavNæsteSkridt, lavNæsteSkridtKort } from './lag.js';

const S = 2.4; // enheder i 3D pr. ångstrøm (Å): atomerne og afstanden mellem dem er i samme målestok
const R_START = 16; // Å mellem natrium og chlor fra start (langt nok til, at tiltrækningen er lille)
const R_ANDRE = 11; // Å mellem atomerne i de andre par (de mødes ikke som par, men går direkte til krystallen)
const VINKEL_TRE = 0.75; // radianer: Ca + 2 Cl står i en trekant (chloratomerne over og under)
const HARPUN_FART = 3; // Å pr. sekund, mens de neutrale atomer driver mod hinanden (harpunen)
const TRÆK_FAKTOR = 400; // hvor hurtigt ionerne suser sammen (tegnet langsomt, så man kan følge det)
const DÆMPNING = 5; // ionerne mister fart (i virkeligheden sendes energien væk som lys og varme)
const HOP_TID = 0.55; // sekunder for elektronens hop (harpunen)
const VIS_TID = 1.8; // sekunder for "Vis mig" (elektronen flyttes for en)
const AFVIST_TID = 1.6; // sekunder, elektronen bliver hos det andet natriumatom, før den flyver hjem (Na + Na)
const SKALA = 0.94; // ionernes ringe tegnes lidt mindre end Shannon-radierne, så parret ikke overlapper for meget
const KUGLE = 0.9; // ionernes kugler i krystallen tegnes lidt mindre end radierne, så mønstret kan ses
const KRYSTAL_N = 6; // terningen: 6 × 6 × 6 = 216 ioner
const MAX_IONER = 300; // pladser i krystallens InstancedMesh (rutil: 270)
const FLYVE_TID = 1.1; // sekunder for hver ion, der flyver ind til krystallen
const SPRED_TID = 1.7; // sekunder mellem den første og den sidste ion (de inderste kommer først)
const MIDT_TID = 0.9; // sekunder for atomerne fra parret, der glider ind på deres plads
const FARVE_PLUS = new THREE.Color(0.9, 0.4, 0.13); // plus-ionerne (orange som skiltet, mørkere, for lyset gør dem lysere)
const FARVE_MINUS = new THREE.Color(0.16, 0.48, 0.95); // minus-ionerne (blå)
const MASSE = { Li: 6.94, Na: 22.99, Mg: 24.305, Ca: 40.078, O: 15.999, F: 18.998, Cl: 35.45 };

// ---------- Tilstand ----------
let aktiv = false;
let rod = null;
let par = PAR.nacl;
let metal = STOFFER[par.metal];
let ikke = STOFFER[par.ikkemetal];
let giver = null; // metallets MolekyleAtom
let tagere = []; // ikkemetallernes MolekyleAtom (Ca + 2 Cl: to). Hver har .fik (elektroner, den har fået).
let atomer = [];
let elektronMesh = null; // den elektron, der flytter sig
let spor = null; // lysspor efter elektronen
let sporPunkter = [];
let pause = null;
let næste = null;
let hentVærkstedAtom = () => null;
let tilstand = 'start'; // start, trækker, tilbage, hopper, ioner, mødes, samlet, nærmer, afvist, hjem, bygger, krystal
let elektron = 'hjemme'; // hjemme, fri eller flyttet (til parret Na + Cl i gas)
let flyttet = 0; // så mange elektroner er landet hos ikkemetallerne
let r = R_START; // afstanden mellem kernerne (Å), kun Na + Cl
let v = 0; // hvor hurtigt afstanden ændrer sig (Å/s)
let harpun = false; // er det harpunen, man ser nu?
let mødtFør = false; // har man set ionerne mødes (så kan man se harpunen)
let harpunSet = false;
let iPlus = false; // er regnskabet gået over nul (beskeden kommer én gang pr. forsøg)
let hop = null; // { fra, mål, tid, varighed, færdig }
let afvistTid = 0;
let nanaPrøvet = false; // Na + Na: elektronen er fløjet hjem (så siger teksten hvorfor)
let trækId = null; // pointerId for den finger eller mus, der trækker
const ePos = new THREE.Vector3(); // den frie elektrons plads
let panelTid = 0;
let zoomTid = 0;
const hjælpV = new THREE.Vector3();
const hjælpV2 = new THREE.Vector3();
const hjælpM = new THREE.Matrix4();
const hjælpQ = new THREE.Quaternion();
const hjælpS = new THREE.Vector3();
const stråle = new THREE.Raycaster();
const plan = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// Krystallen
let krystalGruppe = null;
let krystalMesh = null;
let krystal = null; // { pladser, start, forsinkelse, midt, fraAtomer, tid, trækFør, andel, radius }

const $ = (id) => document.getElementById(id);
const komma = (x, d = 2) => x.toFixed(d).replace('.', ',');
const fmt = (x, d = 2) => `${x < 0 ? '−' : x > 0 ? '+' : ''}${komma(Math.abs(x), d)}`;
const lille = (symbol) => STOFFER[symbol].navn.toLowerCase();
const ionTegn = (q) => (q === 0 ? '' : `${Math.abs(q) > 1 ? '²' : ''}${q > 0 ? '⁺' : '⁻'}`);
const kortNavn = (p) => (p.id === 'cacl2' ? 'Ca + 2 Cl' : `${p.metal} + ${p.ikkemetal}`);

// ---------- Opbygning ----------
export function lavByttebørs({ værkstedAtom } = {}) {
  if (værkstedAtom) hentVærkstedAtom = værkstedAtom;
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);

  // Elektronen, der flytter sig, med et skær og et lysspor
  elektronMesh = new THREE.Group();
  const kugle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 3.4, 4.2) }));
  const skær = new THREE.Sprite(new THREE.SpriteMaterial({
    map: lavPrikTekstur(true), color: new THREE.Color(0.6, 1.6, 2.2), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  skær.scale.setScalar(1.6);
  elektronMesh.add(kugle, skær);
  elektronMesh.visible = false;
  const SPOR = LAV_KVALITET ? 16 : 28;
  const sporGeo = new THREE.BufferGeometry();
  sporGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPOR * 3), 3));
  sporGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(SPOR * 3), 3));
  spor = new THREE.Points(sporGeo, new THREE.PointsMaterial({
    size: 0.35, map: lavPrikTekstur(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  spor.frustumCulled = false;
  sporPunkter = Array.from({ length: SPOR }, () => new THREE.Vector3());
  rod.add(elektronMesh, spor);

  // Krystallen: én InstancedMesh med plads til alle ionerne (bygget én gang, kun antallet skifter)
  krystalGruppe = new THREE.Group();
  krystalGruppe.visible = false;
  const kugleGeo = new THREE.SphereGeometry(1, LAV_KVALITET ? 14 : 20, LAV_KVALITET ? 10 : 14);
  krystalMesh = new THREE.InstancedMesh(kugleGeo, new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0, emissive: 0x070b16 }), MAX_IONER);
  krystalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  krystalMesh.frustumCulled = false;
  for (let i = 0; i < MAX_IONER; i++) krystalMesh.setColorAt(i, FARVE_PLUS);
  krystalMesh.count = 0;
  krystalGruppe.add(krystalMesh);
  rod.add(krystalGruppe);

  lavPanel();
  lavTræk();
  byggAtomer();
  nulstil();
}

function lavPanel() {
  const vindue = $('molekylerVindue');
  // "Næste skridt" øverst til venstre (kun i Byttebørsen). Knappen i kortet gør det, der er det næste.
  const kort = lavNæsteSkridtKort(vindue, 'bytteMission');
  kort.classList.add('bytte-kun');
  næste = lavNæsteSkridt(kort, { visMig: () => handling() });
  // Regnskabet og tidsknappen nederst i 3D-billedet
  const række = document.createElement('div');
  række.className = 'bjælke-række bytte-kun';
  række.id = 'bytteBund';
  række.innerHTML = `<div class="bytte-måler" id="bytteMåler" role="meter" aria-label="Regnskabet i eV" aria-valuemin="-7" aria-valuemax="7">
      <div class="bm-top"><span class="bm-navn" id="bytteMålerNavn">Regnskabet</span><strong class="bm-tal" id="bytteMålerTal">0,00 eV</strong></div>
      <div class="bm-spor"><div class="bm-fyld" id="bytteMålerFyld"></div><div class="bm-nul"></div></div>
      <div class="bm-akse"><span>koster</span><span>0</span><span>gevinst</span></div>
    </div>`;
  bundIVindue(vindue).append(række);
  pause = lavTidsknap({ holder: række, aktiv: () => aktiv });
  række.querySelector('.tidsknap').id = 'bytteTid';

  // Knapperne til parrene (opgaverne). En ★ viser, at parret er klaret.
  const valg = $('bytteParValg');
  for (const id of PAR_RÆKKE) {
    const b = document.createElement('button');
    b.className = 'chip bytte-par';
    b.dataset.bytteParId = id;
    b.innerHTML = `<span class="bp-navn"></span> <span class="bp-stjerne" aria-hidden="true"></span>`;
    b.querySelector('.bp-navn').textContent = kortNavn(PAR[id]);
    b.addEventListener('click', () => { lyd.klik(); vælgPar(id); });
    valg.append(b);
  }
  opdaterStjerner();

  $('bytteMødes').addEventListener('click', () => { lyd.klik(); ladDemMødes(); });
  $('bytteKrystal').addEventListener('click', () => { lyd.klik(); bygKrystal(); });
  $('bytteForfra').addEventListener('click', () => { lyd.klik(); nulstil(); });
  $('bytteHarpun').addEventListener('click', () => { lyd.klik(); startHarpun(); });
}

// Atomerne for det valgte par (bygges forfra, når man skifter par)
function byggAtomer() {
  for (const a of atomer) a.fjern();
  giver = new MolekyleAtom({ symbol: par.metal, skaller: metal.skaller, radius: metal.radius / 100 * S });
  tagere = [];
  for (let i = 0; i < par.tagere; i++) {
    const t = new MolekyleAtom({ symbol: par.ikkemetal, skaller: ikke.skaller, radius: ikke.radius / 100 * S });
    t.fik = 0;
    tagere.push(t);
  }
  atomer = [giver, ...tagere];
  for (const a of atomer) {
    a.pos = { x: 0, y: 0 }; // pladsen i Å
    rod.add(a.gruppe);
  }
}

// Skifter par (knapperne i venstre panel og "Næste par"). Det samme par igen: forfra.
export function vælgPar(id) {
  if (!PAR[id]) return;
  if (id !== par.id) {
    par = PAR[id];
    metal = STOFFER[par.metal];
    ikke = STOFFER[par.ikkemetal];
    byggAtomer();
  }
  skrivParTekster();
  nulstil();
  if (aktiv) visDitAtom();
}

function opdaterStjerner() {
  for (const b of document.querySelectorAll('.bytte-par')) {
    const id = b.dataset.bytteParId;
    const løst = fremgang.erLøst(`bytte-${id}`);
    b.querySelector('.bp-stjerne').textContent = løst ? '★' : '☆';
    b.classList.toggle('klaret', løst);
    b.classList.toggle('valgt', id === par.id);
    b.setAttribute('aria-pressed', String(id === par.id));
    b.title = `${PAR[id].navn}${løst ? ' (klaret ★)' : ''}`;
  }
}

// Stjernerne og teksterne igen (fx efter "Opgaver forfra" i Molekylers hjælp)
export function opdaterFremgang() {
  opdaterStjerner();
  if (aktiv) opdaterAlt();
}

// ---------- Træk elektronen ----------
function skærmPos(v3) {
  hjælpV.copy(v3).project(verden.kamera);
  return { x: ((hjælpV.x + 1) / 2) * innerWidth, y: ((1 - hjælpV.y) / 2) * innerHeight };
}

// Punktet i atomernes plan (z = 0) under fingeren eller musen
function punktI3D(x, y, ud) {
  const rect = verden.renderer.domElement.getBoundingClientRect();
  stråle.setFromCamera({ x: ((x - rect.left) / rect.width) * 2 - 1, y: -((y - rect.top) / rect.height) * 2 + 1 }, verden.kamera);
  return stråle.ray.intersectPlane(plan, ud);
}

function kanTrække() {
  return aktiv && tilstand === 'start' && flyttet < iAltElektroner(par);
}

// Er fingeren eller musen tæt på metallets yderste elektron?
function vedElektronen(x, y, finger) {
  const s = skærmPos(giver.ydersteElektron(hjælpV2));
  return Math.hypot(s.x - x, s.y - y) < (finger ? 44 : 30);
}

function lavTræk() {
  const lærred = verden.renderer.domElement;
  // Fanges før kameraets styring (capture), så et træk i elektronen ikke drejer billedet
  lærred.addEventListener('pointerdown', (h) => {
    if (!kanTrække() || trækId !== null) return;
    if (!vedElektronen(h.clientX, h.clientY, h.pointerType !== 'mouse')) return;
    h.stopImmediatePropagation();
    h.preventDefault();
    trækId = h.pointerId;
    verden.styring.enabled = false;
    lærred.style.cursor = 'grabbing';
    startTræk();
    flytTil(h.clientX, h.clientY);
  }, { capture: true });
  addEventListener('pointermove', (h) => {
    if (trækId === h.pointerId) {
      flytTil(h.clientX, h.clientY);
      return;
    }
    // Musen over elektronen: en hånd viser, at den kan trækkes
    if (h.pointerType === 'mouse' && aktiv && h.target === lærred) {
      lærred.style.cursor = kanTrække() && vedElektronen(h.clientX, h.clientY, false) ? 'grab' : '';
    }
  });
  const slip = (h) => {
    if (trækId !== h.pointerId) return;
    trækId = null;
    verden.styring.enabled = true;
    lærred.style.cursor = '';
    slipElektron();
  };
  addEventListener('pointerup', slip);
  addEventListener('pointercancel', slip);
}

function startTræk() {
  tilstand = 'trækker';
  giver.skjulYderste = true;
  ePos.copy(giver.ydersteElektron(hjælpV2));
  elektronMesh.visible = true;
  nulstilSpor();
  lyd.klik();
  opdaterAlt();
}

function flytTil(x, y) {
  if (!punktI3D(x, y, hjælpV)) return;
  ePos.copy(hjælpV);
  // Elektronen er fri, når den er trukket et stykke uden for metallets yderste ring
  const ny = ePos.distanceTo(giver.gruppe.position) > giver.ydersteRadius() + 1.2 ? 'fri' : 'hjemme';
  if (ny !== elektron) {
    elektron = ny;
    if (ny === 'fri') lyd.elektron();
    opdaterAlt();
  }
}

// Det ikkemetal-atom, elektronen er sluppet ved (eller null)
function tagerVed(p) {
  let bedst = null;
  let afstand = Infinity;
  for (const t of tagere) {
    const d = p.distanceTo(t.gruppe.position);
    if (d < t.ydersteRadius() + 1.6 && d < afstand) {
      bedst = t;
      afstand = d;
    }
  }
  return bedst;
}

// Ved et ikkemetal med plads: elektronen bliver dér. Ellers flyver den tilbage til metallet.
function slipElektron() {
  if (tilstand !== 'trækker') return;
  const t = tagerVed(ePos);
  if (t && t.fik < par.hver) {
    startHop(t, 0.25, () => land(t));
    return;
  }
  sendHjem();
  if (t) {
    visBesked({ titel: 'Den er fuld', tekst: `${ikke.navn}ionen har allerede fyldt sin yderste skal. Giv elektronen til det andet ${lille(par.ikkemetal)}atom.`, varighed: 5000 });
  } else if (ePos.distanceTo(giver.gruppe.position) > giver.ydersteRadius() + 1.2) {
    visBesked({ titel: 'Elektronen fløj tilbage', tekst: `${metal.navn}s kerne trækker stadig i den. Slip den inde ved ${lille(par.ikkemetal)}.`, varighed: 5000 });
  }
  opdaterAlt();
}

// Elektronen flyver hjem til metallet (sluppet for langt væk)
function sendHjem() {
  tilstand = 'tilbage';
  elektron = 'hjemme';
  startHop(giver, 0.35, () => {
    giver.skjulYderste = false;
    elektronMesh.visible = false;
    tilstand = 'start';
    opdaterAlt();
  });
}

// Elektronen flyver hen til et atoms yderste ring (til metallet: dens gamle plads, til ikkemetallet: siden ind mod metallet)
function startHop(mål, varighed, færdig) {
  hop = { fra: ePos.clone(), mål, tid: 0, varighed, færdig };
  if (tilstand === 'trækker') tilstand = 'hopper';
}

function hopMål(mål, ud) {
  if (mål === giver) return giver.ydersteElektron(ud);
  // Den tomme plads på ringen, på siden ind mod metallet
  ud.subVectors(giver.gruppe.position, mål.gruppe.position).setZ(0);
  if (ud.lengthSq() < 1e-6) ud.set(-1, 0, 0);
  return ud.setLength(mål.ydersteRadius()).add(mål.gruppe.position);
}

// ---------- Forløbet ----------
// Den yderste rings radius for et atom, der har fået q elektroner (q < 0: givet væk)
function ringRadius(stof, q) {
  const atom = stof.radius / 100 * S;
  if (q === 0) return atom;
  if (q === -stof.ladning) return stof.ion / 100 * S * SKALA; // den færdige ion (Shannon)
  if (q < 0) return atom * 0.88; // Mg⁺ og Ca⁺: Der er stadig en elektron i den yderste skal
  if (stof.ladning > 0) return atom; // Na⁻ (Na + Na) har ingen målt radius og tegnes som atomet
  return atom + (stof.ion / 100 * S * SKALA - atom) * (q / -stof.ladning); // O⁻: et skøn mellem atomet og ionen
}

// En elektron er landet hos et ikkemetal
function land(t) {
  elektronMesh.visible = false;
  t.fik++;
  flyttet++;
  giver.skjulYderste = false;
  giver.sætSkaller(ionSkaller(par.metal, -flyttet), ringRadius(metal, -flyttet));
  giver.sætLadning(flyttet);
  t.sætSkaller(ionSkaller(par.ikkemetal, t.fik), ringRadius(ikke, t.fik));
  t.sætLadning(-t.fik);
  lyd.elektron();
  elektron = par.id === 'nacl' ? 'flyttet' : 'hjemme';
  if (par.bytter === false) {
    tilstand = 'afvist';
    afvistTid = 0;
    visBesked({ titel: 'Det kan ikke betale sig', tekst: 'Det andet natriumatom giver kun 0,55 eV tilbage. Så elektronen flyver hjem igen.', type: 'info' });
    opdaterAlt();
    return;
  }
  if (harpun) {
    visBesked({ titel: 'Harpunen!', tekst: `Elektronen hoppede ved ca. ${komma(harpunAfstand(par.metal, par.ikkemetal), 1)} Å. Nu trækker ionerne hinanden ind.`, type: 'fase', varighed: 6000 });
    ladDemMødes();
    return;
  }
  if (flyttet < iAltElektroner(par)) {
    tilstand = 'start';
    if (par.id === 'mgo') {
      visBesked({ titel: 'Én elektron er flyttet', tekst: 'Magnesium har én tilbage i den yderste skal. Oxygen mangler én for at fylde sin. Flyt den næste.', type: 'info' });
    } else {
      visBesked({ titel: 'Én elektron er flyttet', tekst: 'Calcium har én tilbage i den yderste skal. Giv den til det andet chloratom.', type: 'info' });
    }
    opdaterAlt();
    return;
  }
  tilstand = 'ioner';
  if (par.id === 'mgo') {
    visBesked({ titel: 'Den anden elektron kostede', tekst: 'O⁻ er allerede minus og skubber den nye elektron væk. Regnskabet er langt i minus.', type: 'info', hvorfor: 'bytteKoster' });
  } else {
    visBesked({ titel: 'Nu er de ioner', tekst: `${ionListe()}. Men regnskabet er i minus: Det kostede mere, end ${lille(par.ikkemetal)} gav tilbage.`, type: 'info', hvorfor: 'bytteKoster' });
  }
  opdaterAlt();
  zoom();
}

// Na + Na: Elektronen forlader det andet natriumatom og flyver hjem
function flyvHjemNaNa() {
  const t = tagere[0];
  hopMål(t, ePos);
  t.fik = 0;
  flyttet = 0;
  t.sætSkaller(ikke.skaller, ikke.radius / 100 * S);
  t.sætLadning(0);
  giver.sætSkaller(metal.skaller, metal.radius / 100 * S);
  giver.sætLadning(0);
  giver.skjulYderste = true;
  elektronMesh.visible = true;
  elektron = 'fri';
  nulstilSpor();
  tilstand = 'hjem';
  hop = {
    fra: ePos.clone(), mål: giver, tid: 0, varighed: 0.6, færdig: () => {
      giver.skjulYderste = false;
      elektronMesh.visible = false;
      elektron = 'hjemme';
      tilstand = 'start';
      nanaPrøvet = true;
      if (!klaret()) visBesked({ titel: 'De bytter ikke', tekst: 'To natriumatomer trækker lige hårdt i elektronerne. I stedet deler de dem: Fast natrium er et metal.', type: 'info', varighed: 7000 });
      opdaterAlt();
    },
  };
  opdaterAlt();
}

function ladDemMødes() {
  if (par.id !== 'nacl') return;
  if (tilstand !== 'ioner' && !(harpun && elektron === 'flyttet')) return;
  tilstand = 'mødes';
  iPlus = regnskab(par, 'flyttet', r).iAlt > 0;
  v = harpun ? -HARPUN_FART : 0;
  pause.fortsæt();
  opdaterAlt();
}

function startHarpun() {
  if (!mødtFør || par.id !== 'nacl') return;
  nulstil({ harpun: true });
  pause.fortsæt();
  visBesked({ titel: 'Sådan sker det i virkeligheden', tekst: 'Atomerne nærmer sig, mens elektronen bliver hjemme. Hold øje med regnskabet.', type: 'fase', varighed: 6000 });
}

// Forfra med neutrale atomer langt fra hinanden
function nulstil({ harpun: h = false } = {}) {
  harpun = h;
  tilstand = h ? 'nærmer' : 'start';
  elektron = 'hjemme';
  flyttet = 0;
  r = par.id === 'nacl' ? R_START : R_ANDRE;
  v = h ? -HARPUN_FART : 0;
  hop = null;
  iPlus = false;
  nanaPrøvet = false;
  if (trækId !== null) {
    trækId = null;
    verden.styring.enabled = true;
  }
  giver.sætSkaller(metal.skaller, metal.radius / 100 * S, true);
  giver.sætLadning(0);
  giver.skjulYderste = false;
  for (const t of tagere) {
    t.fik = 0;
    t.sætSkaller(ikke.skaller, ikke.radius / 100 * S, true);
    t.sætLadning(0);
  }
  for (const a of atomer) {
    a.gruppe.visible = true;
    a.gruppe.scale.setScalar(1);
  }
  fjernKrystal();
  elektronMesh.visible = false;
  nulstilSpor();
  placer();
  opdaterAlt();
  zoom();
}

// Den knap, der er det næste skridt
function handling() {
  if (tilstand === 'start') {
    if (par.bytter === false && nanaPrøvet) næstePar();
    else visMig();
  } else if (tilstand === 'ioner') {
    if (par.id === 'nacl') ladDemMødes();
    else bygKrystal();
  } else if (tilstand === 'samlet') bygKrystal();
  else if (tilstand === 'krystal') {
    if (par.id === 'nacl' && !harpunSet) startHarpun();
    else næstePar();
  }
}

// Det næste par, der ikke er klaret (ellers det næste i rækken)
function næsteParId() {
  const i = PAR_RÆKKE.indexOf(par.id);
  for (let k = 1; k <= PAR_RÆKKE.length; k++) {
    const id = PAR_RÆKKE[(i + k) % PAR_RÆKKE.length];
    if (!fremgang.erLøst(`bytte-${id}`)) return id;
  }
  return PAR_RÆKKE[(i + 1) % PAR_RÆKKE.length];
}

function næstePar() {
  vælgPar(næsteParId());
}

// "Vis mig": den næste elektron flyttes langsomt over til et ikkemetal med plads
function visMig() {
  if (tilstand !== 'start' || flyttet >= iAltElektroner(par)) return;
  const t = tagere.find((x) => x.fik < par.hver);
  pause.fortsæt();
  giver.skjulYderste = true;
  ePos.copy(giver.ydersteElektron(hjælpV2));
  elektronMesh.visible = true;
  nulstilSpor();
  elektron = 'fri';
  tilstand = 'hopper';
  hop = { fra: ePos.clone(), mål: t, tid: 0, varighed: VIS_TID, færdig: () => land(t) };
  opdaterAlt();
}

// Atomernes pladser. Na + Cl: tyngdepunktet står stille (chlor er tungere og flytter sig mindre).
// Ca + 2 Cl: en trekant med calcium til venstre. De andre: side om side.
function placer() {
  if (par.tagere === 2) {
    const dx = Math.cos(VINKEL_TRE) * r;
    const dy = Math.sin(VINKEL_TRE) * r;
    giver.pos.x = -dx / 2;
    giver.pos.y = 0;
    tagere[0].pos.x = dx / 2;
    tagere[0].pos.y = dy;
    tagere[1].pos.x = dx / 2;
    tagere[1].pos.y = -dy;
  } else {
    const mM = MASSE[par.metal];
    const mI = MASSE[par.ikkemetal];
    giver.pos.x = -r * mI / (mM + mI);
    giver.pos.y = 0;
    tagere[0].pos.x = r * mM / (mM + mI);
    tagere[0].pos.y = 0;
  }
  if (krystal) return; // under krystallen styrer den atomernes plads
  for (const a of atomer) a.gruppe.position.set(a.pos.x * S, a.pos.y * S, 0);
}

function zoom() {
  if (krystal) {
    // Krystallen drejer, så den kugle, der omslutter den, skal kunne være i billedet. Ekstra luft foroven og forneden,
    // for "Næste skridt", underteksterne og måleren ligger oven på 3D-billedet.
    const h = (krystal.radius + ikke.ion / 100) * S;
    passerTilBoks(h * 1.05, h * 1.4);
    return;
  }
  let bredde = 0;
  let højde = 0;
  for (const a of atomer) {
    bredde = Math.max(bredde, Math.abs(a.gruppe.position.x) + a.radius);
    højde = Math.max(højde, Math.abs(a.gruppe.position.y) + a.radius);
  }
  passerTilBoks(bredde + 1.5, højde + 3.6);
}

// ---------- Hvert billede ----------
function opdater(dt) {
  if (!aktiv) return;
  const tiden = pause.til ? 0 : dt;
  for (const a of atomer) a.opdater(tiden);
  if (!pause.til) {
    if (hop) opdaterHop(dt);
    if (tilstand === 'nærmer') opdaterNærmer(dt);
    else if (tilstand === 'mødes') opdaterMødes(dt);
    else if (tilstand === 'afvist') {
      afvistTid += dt;
      if (afvistTid >= AFVIST_TID) flyvHjemNaNa();
    }
    if (krystal) opdaterKrystal(dt);
  }
  // Mens man trækker, følger elektronen fingeren, også under pause
  if (elektronMesh.visible) elektronMesh.position.copy(ePos);
  opdaterSpor(elektronMesh.visible);
  panelTid += dt;
  if (panelTid > 0.25) {
    panelTid = 0;
    opdaterMåler();
  }
  zoomTid += dt;
  if (zoomTid > 0.3 && (tilstand === 'mødes' || tilstand === 'nærmer')) {
    zoomTid = 0;
    zoom();
  }
}

function opdaterHop(dt) {
  hop.tid += dt;
  const t = Math.min(1, hop.tid / hop.varighed);
  const blød = t * t * (3 - 2 * t);
  hopMål(hop.mål, hjælpV);
  ePos.lerpVectors(hop.fra, hjælpV, blød);
  ePos.y += Math.sin(Math.PI * blød) * (hop.mål === giver ? 0.5 : 1.6); // en lille bue
  // Undervejs er den fri (regnskabet viser, at det koster at tage den)
  if (hop.mål !== giver && elektron !== 'fri') {
    elektron = 'fri';
    opdaterAlt();
  }
  if (t >= 1) {
    const færdig = hop.færdig;
    hop = null;
    færdig();
  }
}

// Harpunen: de neutrale atomer driver mod hinanden, til tiltrækningen kan betale for hoppet
function opdaterNærmer(dt) {
  const rH = harpunAfstand(par.metal, par.ikkemetal);
  r = Math.max(rH, r - HARPUN_FART * dt);
  placer();
  if (r <= rH && !hop) {
    giver.skjulYderste = true;
    ePos.copy(giver.ydersteElektron(hjælpV2));
    elektronMesh.visible = true;
    nulstilSpor();
    elektron = 'fri';
    tilstand = 'hopper';
    const t = tagere[0];
    hop = { fra: ePos.clone(), mål: t, tid: 0, varighed: HOP_TID, færdig: () => land(t) };
    opdaterAlt();
  }
}

// Ionerne trækker i hinanden (Coulomb) og stopper, når skyerne skubber (Born-Mayer). Små skridt, for frastødningen er stejl.
function opdaterMødes(dt) {
  const skridt = Math.ceil(dt / 0.002);
  const h = dt / skridt;
  for (let i = 0; i < skridt; i++) {
    const a = -TRÆK_FAKTOR * ionparKraft(par, r) - DÆMPNING * v;
    v += a * h;
    r = Math.max(1.6, r + v * h);
  }
  placer();
  const nu = regnskab(par, 'flyttet', r).iAlt;
  if (!iPlus && nu > 0) {
    iPlus = true;
    visBesked({ titel: 'Nu er regnskabet i plus', tekst: 'Tiltrækningen mellem plus og minus har betalt for elektronen.', type: 'fase', varighed: 4000 });
  }
  if (Math.abs(r - par.r0) < 0.01 && Math.abs(v) < 0.05) {
    r = par.r0;
    v = 0;
    placer();
    samlet();
  }
}

function samlet() {
  tilstand = 'samlet';
  mødtFør = true;
  lyd.klaret();
  if (harpun) {
    harpunSet = true;
    visBesked({ titel: 'Sådan sker det i virkeligheden', tekst: 'Elektronen hopper langt ude, og så trækker ionerne hinanden ind. Kemikere kalder det harpunen.', type: 'info' });
  } else {
    visBesked({
      titel: 'En ionbinding', tekst: `Na⁺ og Cl⁻ holder sammen. Regnskabet: ${fmt(par.D)} eV.`, type: 'klaret',
    });
  }
  opdaterAlt();
  zoom();
}

// ---------- Krystallen ----------
function kanByggeKrystal() {
  if (!par.krystal) return false;
  return par.id === 'nacl' ? tilstand === 'samlet' : tilstand === 'ioner';
}

// Et fast tal mellem 0 og 1 for hver ion (så krystallen bygges ens hver gang, også i testen)
function tilfældig(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Flere ioner kommer til og lægger sig i mønstret. Atomerne fra parret glider ind på pladser i midten.
function bygKrystal() {
  if (!kanByggeKrystal()) return;
  const pladser = krystalPladser(par, KRYSTAL_N).slice(0, MAX_IONER);
  // Midten: den plus-ion, der står nærmest midten, og dens nærmeste minus-naboer
  const afst = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  let mi = -1;
  for (let i = 0; i < pladser.length; i++) {
    if (pladser[i].metal && (mi < 0 || Math.hypot(pladser[i].x, pladser[i].y, pladser[i].z) < Math.hypot(pladser[mi].x, pladser[mi].y, pladser[mi].z))) mi = i;
  }
  const naboer = pladser.map((p, i) => i).filter((i) => !pladser[i].metal).sort((a, b) => afst(pladser[a], pladser[mi]) - afst(pladser[b], pladser[mi]));
  let ti = [naboer[0]];
  if (par.tagere === 2) {
    // Den nabo, der står mest over for den første (Cl–Ca–Cl på en linje)
    const seks = naboer.slice(1, 6);
    seks.sort((a, b) => afst(pladser[b], pladser[naboer[0]]) - afst(pladser[a], pladser[naboer[0]]));
    ti = [naboer[0], seks[0]];
  }
  const midt = [mi, ...ti];
  // Krystallen drejes, så man ser den skråt (en terning ser ud som en terning), og parrets linje ligger vandret
  krystalGruppe.rotation.set(0.42, -0.62, 0);
  krystalGruppe.position.set(0, 0, 0);
  krystalGruppe.updateMatrixWorld(true);
  let maks = 0;
  for (const p of pladser) maks = Math.max(maks, Math.hypot(p.x, p.y, p.z));
  const start = [];
  const forsinkelse = [];
  for (let i = 0; i < pladser.length; i++) {
    const p = pladser[i];
    const afstand = Math.hypot(p.x, p.y, p.z);
    // Udefra i en tilfældig retning, de inderste først
    const u = tilfældig(i) * 2 - 1;
    const vinkel = tilfældig(i + 977) * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const ud = (maks * 2.2 + 6 + tilfældig(i + 31) * 8) * S;
    start.push(new THREE.Vector3(s * Math.cos(vinkel) * ud, u * ud, s * Math.sin(vinkel) * ud));
    forsinkelse.push((afstand / maks) * SPRED_TID * (ROLIG ? 0.4 : 1) + tilfældig(i + 7) * 0.15);
  }
  const fraAtomer = atomer.map((a) => a.gruppe.position.clone());
  // Tiltrækningen lige før krystallen (Na + Cl: parret, ellers ionerne langt fra hinanden)
  const trækFør = nuværende().træk;
  krystal = { pladser, start, forsinkelse, midt, fraAtomer, tid: 0, trækFør, andel: 0, radius: maks };
  krystalMesh.count = pladser.length;
  for (let i = 0; i < pladser.length; i++) krystalMesh.setColorAt(i, pladser[i].metal ? FARVE_PLUS : FARVE_MINUS);
  krystalMesh.instanceColor.needsUpdate = true;
  krystalGruppe.visible = true;
  tilstand = 'bygger';
  pause.fortsæt();
  opdaterKrystal(0);
  visBesked({ titel: 'Byg krystallen', tekst: 'Flere ioner kommer til. Hold øje med regnskabet.', type: 'fase', varighed: 5000 });
  opdaterAlt();
  zoom();
}

function opdaterKrystal(dt) {
  const k = krystal;
  k.tid += dt;
  if (!ROLIG && tilstand === 'krystal') krystalGruppe.rotation.y += dt * 0.12; // den drejer langsomt (står stille i pause)
  krystalGruppe.updateMatrixWorld(true);
  const radPlus = metal.ion / 100 * S * KUGLE;
  const radMinus = ikke.ion / 100 * S * KUGLE;
  let fremme = 0;
  for (let i = 0; i < k.pladser.length; i++) {
    const p = k.pladser[i];
    hjælpV.set(p.x * S, p.y * S, p.z * S);
    let skala = p.metal ? radPlus : radMinus;
    const j = k.midt.indexOf(i);
    let t;
    if (j >= 0) {
      // Atomet fra parret glider ind på sin plads og bliver til en kugle
      t = Math.min(1, k.tid / MIDT_TID);
      const blød = t * t * (3 - 2 * t);
      const a = atomer[j];
      hjælpV2.copy(hjælpV).applyMatrix4(krystalGruppe.matrixWorld);
      a.gruppe.position.lerpVectors(k.fraAtomer[j], hjælpV2, blød);
      const væk = Math.min(1, Math.max(0, (k.tid - MIDT_TID * 0.6) / (MIDT_TID * 0.6)));
      a.gruppe.scale.setScalar(Math.max(0.001, 1 - væk));
      a.gruppe.visible = væk < 1;
      skala *= væk;
    } else {
      t = Math.min(1, Math.max(0, (k.tid - k.forsinkelse[i]) / FLYVE_TID));
      const blød = 1 - (1 - t) ** 3; // hurtigt ind og blødt på plads
      hjælpV.lerpVectors(k.start[i], hjælpV, blød);
      if (t <= 0) skala = 0;
    }
    if (t >= 1) fremme++;
    hjælpQ.identity();
    hjælpS.setScalar(Math.max(0.0001, skala));
    hjælpM.compose(hjælpV, hjælpQ, hjælpS);
    krystalMesh.setMatrixAt(i, hjælpM);
  }
  krystalMesh.instanceMatrix.needsUpdate = true;
  // Regnskabet følger de ioner, der er kommet på plads
  const mål = fremme / k.pladser.length;
  k.andel = ROLIG ? mål : k.andel + (mål - k.andel) * Math.min(1, dt * 6);
  if (tilstand === 'bygger' && fremme === k.pladser.length) {
    k.andel = 1;
    færdigKrystal();
  }
}

function færdigKrystal() {
  tilstand = 'krystal';
  lyd.klaret();
  klaret();
  opdaterAlt();
  zoom();
}

function fjernKrystal() {
  krystal = null;
  if (krystalGruppe) {
    krystalGruppe.visible = false;
    krystalMesh.count = 0;
  }
}

// Opgaven for parret er klaret. Giver true, hvis den ikke var klaret før.
function klaret() {
  const o = OPGAVER_BYTTE.find((x) => x.par === par.id);
  const ny = Boolean(o && fremgang.løs(o.id));
  if (ny) {
    visBesked({ titel: `Opgave klaret: ${kortNavn(par)} ★`, tekst: o.fakta, type: 'klaret', varighed: 9000 });
  } else if (o && par.krystal) {
    visBesked({ titel: `En krystal af ${par.navn.toLowerCase()}`, tekst: o.fakta, type: 'klaret', varighed: 7000 });
  }
  opdaterStjerner();
  return ny;
}

// ---------- Lysspor ----------
function nulstilSpor() {
  for (const p of sporPunkter) p.copy(ePos);
}

function opdaterSpor(synlig) {
  spor.visible = synlig;
  if (!synlig) return;
  sporPunkter.unshift(sporPunkter.pop().copy(ePos));
  const pos = spor.geometry.attributes.position.array;
  const farve = spor.geometry.attributes.color.array;
  const n = sporPunkter.length;
  for (let i = 0; i < n; i++) {
    const p = sporPunkter[i];
    pos[i * 3] = p.x;
    pos[i * 3 + 1] = p.y;
    pos[i * 3 + 2] = p.z;
    const f = (1 - i / n) ** 1.6;
    farve[i * 3] = 0.4 * f;
    farve[i * 3 + 1] = 1.2 * f;
    farve[i * 3 + 2] = 1.6 * f;
  }
  spor.geometry.attributes.position.needsUpdate = true;
  spor.geometry.attributes.color.needsUpdate = true;
}

// ---------- Regnskabet ----------
// Plus og minus langt fra hinanden (punktladninger i atomernes pladser)
function ladningerNu() {
  return ladningsTræk(atomer.map((a) => ({ q: a.ladning, x: a.pos.x, y: a.pos.y })));
}

// Regnskabet lige nu: { tage, give, træk, iAlt, hvis }.
// Under harpunen, før hoppet: hvad hoppet ville give i denne afstand.
function nuværende() {
  if (par.id === 'nacl' && !krystal) {
    if (tilstand === 'nærmer') return { ...regnskab(par, 'flyttet', r), hvis: true };
    return { ...regnskab(par, elektron, r), hvis: false };
  }
  const fri = elektron === 'fri' && (tilstand === 'trækker' || tilstand === 'hopper' || tilstand === 'hjem');
  const { tage, give } = byttePris(par, flyttet, fri, tagere.map((t) => t.fik));
  let træk = krystal ? 0 : ladningerNu();
  if (krystal) træk = krystal.trækFør + (gitterEnergi(par) - krystal.trækFør) * krystal.andel;
  return { tage, give, træk, iAlt: tage + give + træk, hvis: false };
}

let målerVist = '';
let skalaVist = 0;
function opdaterMåler() {
  const rg = nuværende();
  const tal = `${fmt(rg.iAlt)} eV`;
  const skala = målerSkala(par);
  const nøgle = `${tal}|${rg.hvis}|${skala}`;
  skrivTal(rg);
  if (nøgle !== målerVist) {
    målerVist = nøgle;
    $('bytteMålerTal').textContent = tal;
    $('bytteMålerNavn').textContent = rg.hvis ? 'Hvis den hoppede nu' : 'Regnskabet';
    const fyld = $('bytteMålerFyld');
    const andel = Math.max(-1, Math.min(1, rg.iAlt / skala));
    fyld.style.left = `${50 + Math.min(0, andel) * 50}%`;
    fyld.style.width = `${Math.abs(andel) * 50}%`;
    fyld.classList.toggle('plus', rg.iAlt > 0.005);
    const m = $('bytteMåler');
    m.classList.toggle('hvis', rg.hvis);
    m.setAttribute('aria-valuenow', rg.iAlt.toFixed(2));
    if (skala !== skalaVist) {
      skalaVist = skala;
      m.setAttribute('aria-valuemin', String(-skala));
      m.setAttribute('aria-valuemax', String(skala));
    }
  }
}

let talVist = '';
function skrivTal(rg) {
  const to = iAltElektroner(par) > 1;
  const navnI = par.bytter === false ? 'Det andet natrium' : par.tagere === 2 ? 'Chloratomerne' : ikke.navn;
  const linjer = [
    [`Tage ${to ? 'elektronerne' : 'elektronen'} fra ${par.bytter === false ? 'det ene natrium' : lille(par.metal)}`, rg.tage, rg.tage !== 0 || rg.hvis],
    [`${navnI} tager ${to ? 'dem' : 'den'}`, rg.give, rg.give !== 0 || rg.hvis],
    [krystal ? 'Krystallen: plus og minus trækker' : 'Plus og minus trækker', rg.træk, Math.abs(rg.træk) > 0.0005 || rg.hvis],
  ];
  let html = linjer.map(([navn, x, med]) => `<div class="${med ? '' : 'svag'}"><dt>${navn}</dt><dd>${med ? fmt(x) : '0'} eV</dd></div>`).join('')
    + `<div class="i-alt"><dt>${rg.hvis ? 'Hvis den hoppede nu' : 'I alt'}</dt><dd>${fmt(rg.iAlt)} eV</dd></div>`;
  if (krystal) html += `<div class="afstand"><dt>Ioner i krystallen</dt><dd>${krystal.pladser.length}</dd></div>`;
  else html += `<div class="afstand"><dt>Afstand mellem kernerne</dt><dd>${komma(r, r < 5 ? 2 : 1)} Å</dd></div>`;
  if (html === talVist) return;
  talVist = html;
  $('bytteTal').innerHTML = html;
}

// Ionerne lige nu som tekst (fx "Mg²⁺ og O²⁻" eller "Ca²⁺ og to Cl⁻")
function ionListe() {
  const plus = `${par.metal}${ionTegn(giver.ladning)}`;
  if (par.tagere === 2) {
    const [a, b] = tagere;
    if (a.ladning === b.ladning) return `${plus} og to ${par.ikkemetal}${ionTegn(a.ladning)}`;
    return `${plus}, ${par.ikkemetal}${ionTegn(a.ladning)} og ${par.ikkemetal}${ionTegn(b.ladning)}`;
  }
  return `${plus} og ${par.ikkemetal}${ionTegn(tagere[0].ladning)}`;
}

// Teksterne for hvert trin (højre panel og "Næste skridt")
function trin() {
  const træk = LAV_KVALITET ? 'Træk' : 'Træk med musen';
  const m = lille(par.metal);
  const x = lille(par.ikkemetal);
  const n = iAltElektroner(par);
  switch (tilstand) {
    case 'start':
    case 'tilbage':
      if (par.bytter === false) {
        return nanaPrøvet
          ? {
            titel: 'De bytter ikke',
            tekst: 'To natriumatomer trækker lige hårdt i elektronerne, så de bytter ikke. I stedet deler de dem: Fast natrium er et metal, hvor de yderste elektroner kan bevæge sig mellem atomerne.',
            næste: `Prøv et andet par: ${kortNavn(PAR[næsteParId()])}.`, knap: '▶ Næste par',
          }
          : {
            titel: 'To natriumatomer',
            tekst: 'Begge har 1 elektron i den yderste skal, og begge trækker lige hårdt i elektronerne. Hvad sker der, hvis det ene giver sin elektron til det andet?',
            næste: `${træk} den lysende elektron fra det venstre natriumatom over til det højre.`, knap: '▶ Vis mig',
          };
      }
      if (flyttet > 0) {
        return par.id === 'mgo'
          ? {
            titel: `${ionListe()}`,
            tekst: 'Magnesium har givet én elektron, og oxygen har taget den. Magnesium har én tilbage i den yderste skal, og oxygen mangler én for at fylde sin.',
            næste: `${træk} den næste elektron over til oxygen.`, knap: '▶ Vis mig',
          }
          : {
            titel: `${ionListe()}`,
            tekst: 'Calcium har givet én elektron til det ene chloratom. Calcium har én tilbage i den yderste skal.',
            næste: `${træk} den anden elektron over til det andet chloratom.`, knap: '▶ Vis mig',
          };
      }
      return {
        titel: par.tagere === 2 ? 'Tre neutrale atomer' : 'To neutrale atomer',
        tekst: `${metal.navn} har ${metal.skaller.at(-1)} ${metal.skaller.at(-1) === 1 ? 'elektron' : 'elektroner'} i den yderste skal, og ${x} har ${ikke.skaller.at(-1)}. ${par.tagere === 2 ? 'Alle' : 'Begge'} har lige så mange elektroner som protoner.`,
        næste: n > 1
          ? `${træk} ${m}s yderste elektroner (de lyser) over til ${par.tagere === 2 ? 'chloratomerne, én til hver' : `${x}, én ad gangen`}.`
          : `${træk} ${m}s yderste elektron (den, der lyser) over til ${x}.`,
        knap: '▶ Vis mig',
      };
    case 'trækker':
    case 'hopper':
      if (elektron !== 'fri') {
        return { titel: 'Elektronen sidder fast', tekst: `Træk elektronen længere væk fra ${par.bytter === false ? 'natriumatomet' : m}.`, næste: `Træk elektronen over til ${par.bytter === false ? 'det andet natriumatom' : x}.` };
      }
      if (flyttet > 0) {
        return {
          titel: 'Den næste elektron er revet løs',
          tekst: `Den næste elektron koster ${komma(metal.ie[flyttet])} eV, for ${m} er allerede plusladet, så kernen holder hårdere på den.`,
          næste: `Slip elektronen inde ved ${par.tagere === 2 ? 'det andet chloratom' : x}.`,
        };
      }
      return {
        titel: 'Elektronen er revet løs',
        tekst: `Det koster ${komma(tagEnergi(par.metal))} eV at trække elektronen fri af ${par.bytter === false ? 'natrium' : m}, for kernen holder på den.`,
        næste: harpun ? 'Elektronen hopper over til chlor.' : `Slip elektronen inde ved ${par.bytter === false ? 'det andet natriumatom' : par.tagere === 2 ? 'et af chloratomerne' : x}.`,
      };
    case 'afvist':
    case 'hjem':
      return {
        titel: 'Det kan ikke betale sig',
        tekst: `Det koster ${komma(tagEnergi('Na'))} eV at tage elektronen, og det andet natriumatom giver kun ${komma(giveEnergi('Na'))} eV tilbage. Na⁺ og Na⁻ ville først kunne betale resten, når de var så tæt på, at skyerne overlapper. Så deler de i stedet.`,
        næste: 'Se elektronen flyve hjem.',
      };
    case 'ioner':
      if (par.id === 'nacl') {
        return {
          titel: 'Nu er de ioner',
          tekst: `Natrium har mistet en elektron og er blevet til Na⁺. Chlor har fået én og er blevet til Cl⁻. Chlor gav ${komma(giveEnergi(par.ikkemetal))} eV tilbage, men det er mindre, end det kostede. Regnskabet er i minus.`,
          næste: 'Na⁺ er plus og Cl⁻ er minus. Lad dem mødes.', knap: '▶ Lad dem mødes',
        };
      }
      {
        const { tage, give } = byttePris(par, n);
        let tekst = `${ionListe()}. Det kostede ${komma(-tage)} eV at tage ${n > 1 ? 'elektronerne' : 'elektronen'}, og ${par.tagere === 2 ? 'chloratomerne' : x} gav ${komma(give)} eV tilbage. Regnskabet er i minus.`;
        if (par.id === 'mgo') {
          tekst = `${ionListe()}. Den anden elektron kostede både hos magnesium (${komma(metal.ie[1])} eV) og hos oxygen (ca. ${komma(-ikke.ea[1], 1)} eV), for O⁻ er allerede minus og skubber den nye elektron væk. Regnskabet er langt i minus.`;
        }
        return { titel: 'Nu er de ioner', tekst, næste: 'Byg krystallen, og se, hvem der betaler.', knap: '▶ Byg krystallen' };
      }
    case 'nærmer':
      return {
        titel: 'Atomerne nærmer sig',
        tekst: 'Langt fra hinanden kan det ikke betale sig for elektronen at hoppe. Måleren viser, hvad et hop ville give lige nu.',
        næste: 'Hold øje med måleren.',
      };
    case 'mødes':
      return {
        titel: 'Plus og minus trækker',
        tekst: 'Jo tættere Na⁺ og Cl⁻ kommer, jo mere energi bliver frigjort.',
        næste: 'Se dem suse sammen.',
      };
    case 'samlet':
      return harpun
        ? {
          titel: 'Harpunen',
          tekst: `I virkeligheden hopper elektronen, allerede når atomerne er ca. ${komma(harpunAfstand(par.metal, par.ikkemetal), 1)} Å fra hinanden (fire gange afstanden i parret). Så betaler tiltrækningen for hoppet, og ionerne trækker hinanden ind.`,
          næste: 'Byg en krystal med mange par.', knap: '▶ Byg krystallen',
        }
        : {
          titel: 'En ionbinding',
          tekst: `Na⁺ og Cl⁻ stopper ${komma(par.r0)} Å fra hinanden, hvor elektronskyerne begynder at skubbe. Der er frigjort ${komma(par.D)} eV mere, end det kostede. Det er tiltrækningen mellem plus og minus, der betaler. Det kaldes en ionbinding.`,
          næste: 'Byg en krystal med mange par.', knap: '▶ Byg krystallen',
        };
    case 'bygger':
      return {
        titel: 'Et gitter af ioner',
        tekst: `Flere ioner kommer til og lægger sig i et fast mønster, et gitter. Hver ion trækker i naboerne med modsat ladning og skubber til dem med samme ladning, men tiltrækningen vinder. Orange kugler er ${par.metal}${ionTegn(metal.ladning)}, og blå er ${par.ikkemetal}${ionTegn(ikke.ladning)}.`,
        næste: 'Se krystallen vokse.',
      };
    case 'krystal': {
      const plus = `${par.metal}${ionTegn(metal.ladning)}`;
      const minus = `${par.ikkemetal}${ionTegn(ikke.ladning)}`;
      const mønster = par.krystal === 'rutil'
        ? `Hver ${plus} har seks ${minus} omkring sig, og hver ${minus} har tre ${plus}. Det er et andet mønster end i køkkensalt, for der er dobbelt så mange ${minus}.`
        : `Hver ${plus} har seks ${minus} omkring sig, og omvendt. Mønstret er terninger${par.id === 'nacl' ? ', og derfor er saltkorn små terninger' : ', som i køkkensalt'}.`;
      const pr = par.tagere === 2 ? 'pr. CaCl₂' : 'pr. par';
      const harpunNæst = par.id === 'nacl' && !harpunSet;
      return {
        titel: `En krystal af ${par.navn.toLowerCase()}`,
        tekst: `${mønster} Krystallen giver ${komma(gitterEnergi(par))} eV ${pr}, så regnskabet ender på ${fmt(krystalGevinst(par))} eV.`,
        næste: harpunNæst ? 'Se, hvordan elektronen hopper i virkeligheden.' : `Prøv næste par: ${kortNavn(PAR[næsteParId()])}.`,
        knap: harpunNæst ? '▶ Harpunen' : '▶ Næste par',
      };
    }
    default:
      return { titel: '', tekst: '', næste: '' };
  }
}

let trinVist = '';
function opdaterAlt() {
  const t = trin();
  const nøgle = `${t.titel}|${t.tekst}`;
  if (nøgle !== trinVist) {
    trinVist = nøgle;
    $('bytteTrinTitel').textContent = t.titel;
    $('bytteTrinTekst').textContent = t.tekst;
  }
  næste.sæt({ tekst: t.næste, kanVise: Boolean(t.knap) });
  const vis = $('bytteMission').querySelector('.mission-vis');
  if (t.knap && vis.textContent !== t.knap) vis.textContent = t.knap;
  const nacl = par.id === 'nacl';
  $('bytteMødes').hidden = !nacl;
  $('bytteHarpun').hidden = !nacl;
  $('bytteKrystal').hidden = !par.krystal;
  $('bytteMødes').disabled = tilstand !== 'ioner';
  $('bytteKrystal').disabled = !kanByggeKrystal();
  $('bytteHarpun').disabled = !mødtFør || ['nærmer', 'hopper', 'bygger'].includes(tilstand) || (harpun && tilstand === 'mødes');
  $('bytteHarpun').title = mødtFør ? 'Se harpunen: elektronen hopper, når atomerne er kommet tæt nok på' : 'Lad først ionerne mødes';
  opdaterMåler();
}

// Overskriften, vejledningen, "For nørder" og "Ærligt talt" for parret (skrives kun, når man skifter par)
function skrivParTekster() {
  $('bytteParTitel').textContent = par.bytter === false ? 'Natrium + natrium'
    : `${metal.navn} + ${par.tagere === 2 ? '2 ' : ''}${lille(par.ikkemetal)}${par.hverdag ? ` (${par.hverdag})` : ''}`;
  $('bytteTip').textContent = par.bytter === false
    ? 'Træk den lysende elektron fra det venstre natriumatom over til det højre. Træk et andet sted for at dreje billedet.'
    : `Træk ${iAltElektroner(par) > 1 ? 'de lysende elektroner én ad gangen' : 'den lysende elektron'} fra ${lille(par.metal)} over til ${par.tagere === 2 ? 'chloratomerne, én til hver,' : lille(par.ikkemetal)} med fingeren eller musen. Træk et andet sted for at dreje billedet.`;
  $('bytteNørd').innerHTML = nørdTekst();
  $('bytteÆrligtPar').textContent = ærligtTekst();
  opdaterStjerner();
}

function nørdTekst() {
  const kJ = (eV) => Math.round(eV * KJ_PR_EV).toLocaleString('da-DK');
  if (par.id === 'nacl') {
    return `<p>Natriums ioniseringsenergi er <b>5,14 eV</b>, og chlors elektronaffinitet er <b>3,61 eV</b>. Plus og minus trækker med 14,4 eV delt med afstanden i Å (ångstrøm, en tiendedel af en milliardtedel meter). Det betaler de 1,53 eV, når de er tættere end ca. <b>9,4 Å</b>.</p>
      <p>Frastødningen tæt på er en enkel formel, der er tilpasset, så parret stopper ved <b>2,36 Å</b> med 4,26 eV. I krystallen giver hvert par <b>8,15 eV</b> (gitterenergien, 786 kJ/mol). Størrelserne er målt: natrium 180 pm, Na⁺ 102 pm, chlor 100 pm og Cl⁻ 181 pm.</p>`;
  }
  if (par.bytter === false) {
    return `<p>Natriums ioniseringsenergi er <b>${komma(tagEnergi('Na'))} eV</b>, og natriums elektronaffinitet er kun <b>${komma(giveEnergi('Na'))} eV</b>. At flytte elektronen koster derfor <b>${komma(flytEnergi('Na', 'Na'))} eV</b>.</p>
      <p>Plus og minus trækker med 14,4 eV delt med afstanden i Å, så det kunne først betale sig tættere end ca. 3 Å. Så tæt på overlapper skyerne, og atomerne deler elektronerne i stedet. Begge har elektronegativiteten 0,93.</p>`;
  }
  const n = iAltElektroner(par);
  const ie = metal.ie.slice(0, n).map((x) => `${komma(x)} eV`).join(' og ');
  const ea = par.id === 'mgo'
    ? `<b>${komma(ikke.ea[0])} eV</b> for den første elektron (elektronaffiniteten). Den anden koster ca. <b>${komma(-ikke.ea[1], 1)} eV</b>, et tal, der ikke kan måles direkte.`
    : `<b>${komma(ikke.ea[0])} eV</b> (elektronaffiniteten).`;
  return `<p>Det koster <b>${ie}</b> at tage ${n > 1 ? 'elektronerne' : 'elektronen'} fra ${lille(par.metal)} (ioniseringsenergien), og ${lille(par.ikkemetal)} giver ${ea} I alt koster det <b>${komma(-(byttePris(par, n).tage + byttePris(par, n).give))} eV</b>.</p>
    <p>I krystallen giver plus og minus <b>${komma(gitterEnergi(par))} eV</b> pr. ${par.tagere === 2 ? 'CaCl₂' : 'par'} (gitterenergien, ${kJ(gitterEnergi(par))} kJ/mol). Størrelserne: ${lille(par.metal)} ${metal.radius} pm og ${par.metal}${ionTegn(metal.ladning)} ${metal.ion} pm, ${lille(par.ikkemetal)} ${ikke.radius} pm og ${par.ikkemetal}${ionTegn(ikke.ladning)} ${ikke.ion} pm.</p>`;
}

function ærligtTekst() {
  switch (par.id) {
    case 'nacl': return 'Enkelte par af natriumchlorid findes kun i damp. Et saltkorn er et kæmpe gitter, hvor hver ion har seks naboer med modsat ladning.';
    case 'lif': return 'Krystallen er tegnet med 216 ioner. Selv et lille korn har milliarder af milliarder.';
    case 'mgo': return 'Et frit O²⁻ kan ikke holde på den anden elektron. Det kan det kun inde i krystallen, hvor Mg²⁺-naboerne trækker. Spillet lader elektronen blive, så man kan se regnskabet.';
    case 'cacl2': return 'Krystallen er tegnet i den regelmæssige form, calciumchlorid har over 217 °C. Ved stuetemperatur er mønstret en lille smule skævt.';
    default: return 'Natriumatomer binder sig til hinanden ved at dele elektronerne, ikke ved at bytte. I natriumdamp findes der enkelte Na₂-molekyler.';
  }
}

// Står der et neutralt atom fra parret i Atomværkstedet, nævnes det
function visDitAtom() {
  const t = hentVærkstedAtom();
  const el = $('bytteDit');
  let tekst = '';
  if (t && t.p === t.e && (t.p === metal.nr || t.p === ikke.nr)) {
    const navn = lille(t.p === metal.nr ? par.metal : par.ikkemetal);
    tekst = `Dit ${navn}atom fra Atomværkstedet (${navn}-${t.p + t.n}) er med her.`;
  }
  el.hidden = !tekst;
  el.textContent = tekst;
}

// ---------- Start og stop (fra js/molekyler-skaerm.js) ----------
export function startByttebørs() {
  aktiv = true;
  rod.visible = true;
  verden.opdateringer.add(opdater);
  stopKamera(); // atomets sving i "Byg et atom" må ikke fortsætte her
  sætVindue($('molekylerVindue'));
  const k = verden.kamera;
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = false;
  k.position.set(0, 2, Math.max(k.position.length(), 40));
  begrænsDrejning({ vandret: 0.6, lodret: 0.45 });
  skrivParTekster();
  visDitAtom();
  opdaterAlt();
  zoom();
}

export function stopByttebørs() {
  aktiv = false;
  rod.visible = false;
  verden.opdateringer.delete(opdater);
  begrænsDrejning(null);
  verden.styring.autoRotate = true;
  if (trækId !== null) {
    trækId = null;
    // Et træk midt i et skærmskift: elektronen går hjem igen
    tilstand = 'start';
    elektron = 'hjemme';
    giver.skjulYderste = false;
    elektronMesh.visible = false;
  }
  verden.styring.enabled = true;
  verden.renderer.domElement.style.cursor = '';
  pause.sæt('spil');
}

// ---------- Kun til automatiske tests ----------
export function testAdgang() {
  return {
    tilstand: () => tilstand,
    elektron: () => elektron,
    afstand: () => r,
    regnskab: () => nuværende(),
    harpunAfstand: () => harpunAfstand(par.metal, par.ikkemetal),
    flytEnergi: () => flytEnergi(par.metal, par.ikkemetal),
    par: () => par.id,
    vælgPar: (id) => vælgPar(id),
    flyttet: () => flyttet,
    ladninger: () => atomer.map((a) => a.ladning),
    skala: () => målerSkala(par),
    krystal: () => (krystal ? { antal: krystal.pladser.length, andel: krystal.andel, synlig: krystalGruppe.visible, plus: krystal.pladser.filter((p) => p.metal).length } : null),
    byg: () => bygKrystal(),
    handling: () => handling(),
    ringe: () => ({ na: giver.ydersteRadius() / S, cl: tagere[0].ydersteRadius() / S, naSkaller: [...giver.skaller], clSkaller: [...tagere[0].skaller] }),
    // Hvor elektronen og atomerne står på skærmen (til at trække med musen i testen)
    elektronPå: () => skærmPos(giver.ydersteElektron(new THREE.Vector3())),
    chlorPå: () => skærmPos(tagere[0].gruppe.position),
    tagerPå: (i = 0) => skærmPos(tagere[i].gruppe.position),
    natriumPå: () => skærmPos(giver.gruppe.position),
    tidsknap: () => pause.tilstand,
    styring: () => verden.styring.enabled,
    kameraStille: () => verden.målAfstand == null, // kameraet er færdigt med at zoome
    // Spol frem i små skridt (som på en skærm med 60 billeder i sekundet)
    spol: (sek) => { for (let t = 0; t < sek; t += 1 / 60) opdater(1 / 60); },
  };
}
