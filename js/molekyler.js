// Molekyler i Atomværkstedet (docs/plan-molekyler.md). M1a: Byttebørsen med natrium og chlor.
// Man trækker natriums yderste elektron over til chlor. Måleren ("Regnskabet") viser ærligt, at det koster energi,
// og at gevinsten først kommer, når Na⁺ og Cl⁻ trækker i hinanden. Bagefter kan man se harpunen: I virkeligheden hopper
// elektronen først, når atomerne er kommet tæt nok på, til at tiltrækningen betaler for hoppet.
// Tallene står i js/data/molekyler.js (kilderne i docs/fakta-molekyler.md). Alt bevægeligt bruger dt fra opdateringen,
// så tidsknappen kan stoppe det.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, stopKamera, LAV_KVALITET, lavPrikTekstur } from './scene3d.js';
import { MolekyleAtom } from './molekyle3d.js';
import { PAR, STOFFER, regnskab, harpunAfstand, ionparKraft, ionSkaller, tagEnergi, giveEnergi, flytEnergi } from './data/molekyler.js';
import { lyd } from './lyd.js';
import { visBesked, bundIVindue } from './beskeder.js';
import { lavTidsknap } from './pause.js';
import { lavNæsteSkridt, lavNæsteSkridtKort } from './lag.js';

const S = 2.4; // enheder i 3D pr. ångstrøm (Å): atomerne og afstanden mellem dem er i samme målestok
const R_START = 16; // Å mellem atomerne fra start (langt nok til, at tiltrækningen er lille)
const HARPUN_FART = 3; // Å pr. sekund, mens de neutrale atomer driver mod hinanden (harpunen)
const TRÆK_FAKTOR = 400; // hvor hurtigt ionerne suser sammen (tegnet langsomt, så man kan følge det)
const DÆMPNING = 5; // ionerne mister fart (i virkeligheden sendes energien væk som lys og varme)
const HOP_TID = 0.55; // sekunder for elektronens hop (harpunen)
const VIS_TID = 1.8; // sekunder for "Vis mig" (elektronen flyttes for en)
const SKALA = 0.94; // ionernes ringe tegnes lidt mindre end Shannon-radierne, så parret ikke overlapper for meget

const par = PAR.nacl;
const metal = STOFFER[par.metal];
const ikke = STOFFER[par.ikkemetal];
const masseM = 22.99;
const masseI = 35.45;
const R_HARPUN = harpunAfstand(par.metal, par.ikkemetal);

// ---------- Tilstand ----------
let aktiv = false;
let rod = null;
let na = null;
let cl = null;
let elektronMesh = null; // den elektron, der flytter sig
let spor = null; // lysspor efter elektronen
let sporPunkter = [];
let pause = null;
let næste = null;
let hentVærkstedAtom = () => null;
let tilstand = 'start'; // start, trækker, tilbage, hopper, ioner, mødes, samlet, nærmer
let elektron = 'hjemme'; // hjemme, fri eller flyttet (til regnskabet)
let r = R_START; // afstanden mellem kernerne (Å)
let v = 0; // hvor hurtigt afstanden ændrer sig (Å/s)
let harpun = false; // er det harpunen, man ser nu?
let mødtFør = false; // har man set ionerne mødes (så kan man se harpunen)
let iPlus = false; // er regnskabet gået over nul (beskeden kommer én gang pr. forsøg)
let hop = null; // { fra, til, tid, varighed, færdig }
let trækId = null; // pointerId for den finger eller mus, der trækker
const ePos = new THREE.Vector3(); // den frie elektrons plads
let panelTid = 0;
let zoomTid = 0;
const hjælpV = new THREE.Vector3();
const hjælpV2 = new THREE.Vector3();
const stråle = new THREE.Raycaster();
const plan = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

const $ = (id) => document.getElementById(id);
const fmt = (x, d = 2) => `${x < 0 ? '−' : x > 0 ? '+' : ''}${Math.abs(x).toFixed(d).replace('.', ',')}`;

// ---------- Opbygning ----------
export function lavByttebørs({ værkstedAtom } = {}) {
  if (værkstedAtom) hentVærkstedAtom = værkstedAtom;
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);
  na = new MolekyleAtom({ symbol: 'Na', skaller: metal.skaller, radius: metal.radius / 100 * S });
  cl = new MolekyleAtom({ symbol: 'Cl', skaller: ikke.skaller, radius: ikke.radius / 100 * S });
  rod.add(na.gruppe, cl.gruppe);

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

  lavPanel();
  lavTræk();
  nulstil();
}

function lavPanel() {
  const vindue = $('vaerkstedVindue');
  // "Næste skridt" øverst til venstre (kun i Byttebørsen). Knappen i kortet gør det, der er det næste.
  const kort = lavNæsteSkridtKort(vindue, 'bytteMission');
  kort.classList.add('bytte-kun');
  næste = lavNæsteSkridt(kort, { visMig: () => handling() });
  // Regnskabet og tidsknappen nederst i 3D-billedet
  const række = document.createElement('div');
  række.className = 'bjælke-række bytte-kun';
  række.id = 'bytteBund';
  række.innerHTML = `<div class="bytte-måler" id="bytteMåler" role="meter" aria-label="Regnskabet i eV" aria-valuemin="-6" aria-valuemax="6">
      <div class="bm-top"><span class="bm-navn" id="bytteMålerNavn">Regnskabet</span><strong class="bm-tal" id="bytteMålerTal">0,00 eV</strong></div>
      <div class="bm-spor"><div class="bm-fyld" id="bytteMålerFyld"></div><div class="bm-nul"></div></div>
      <div class="bm-akse"><span>koster</span><span>0</span><span>gevinst</span></div>
    </div>`;
  bundIVindue(vindue).append(række);
  pause = lavTidsknap({ holder: række, aktiv: () => aktiv });
  række.querySelector('.tidsknap').id = 'bytteTid';

  $('bytteMødes').addEventListener('click', () => { lyd.klik(); ladDemMødes(); });
  $('bytteForfra').addEventListener('click', () => { lyd.klik(); nulstil(); });
  $('bytteHarpun').addEventListener('click', () => { lyd.klik(); startHarpun(); });
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
  return aktiv && tilstand === 'start';
}

// Er fingeren eller musen tæt på natriums yderste elektron?
function vedElektronen(x, y, finger) {
  const s = skærmPos(na.ydersteElektron(hjælpV2));
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
  na.skjulYderste = true;
  ePos.copy(na.ydersteElektron(hjælpV2));
  elektronMesh.visible = true;
  nulstilSpor();
  lyd.klik();
  opdaterAlt();
}

function flytTil(x, y) {
  if (!punktI3D(x, y, hjælpV)) return;
  ePos.copy(hjælpV);
  // Elektronen er fri, når den er trukket et stykke uden for natriums yderste ring
  const ny = ePos.distanceTo(na.gruppe.position) > na.ydersteRadius() + 1.2 ? 'fri' : 'hjemme';
  if (ny !== elektron) {
    elektron = ny;
    if (ny === 'fri') lyd.elektron();
    opdaterAlt();
  }
}

// Ved chlor: elektronen bliver hos chlor. Ellers flyver den tilbage til natrium.
function slipElektron() {
  if (tilstand !== 'trækker') return;
  const vedCl = ePos.distanceTo(cl.gruppe.position) < cl.ydersteRadius() + 1.6;
  if (vedCl) {
    startHop(cl, 0.25, () => blivIoner());
  } else {
    tilstand = 'tilbage';
    elektron = 'hjemme';
    startHop(na, 0.35, () => {
      na.skjulYderste = false;
      elektronMesh.visible = false;
      tilstand = 'start';
      opdaterAlt();
    });
    if (ePos.distanceTo(na.gruppe.position) > na.ydersteRadius() + 1.2) {
      visBesked({ titel: 'Elektronen fløj tilbage', tekst: 'Natriums kerne trækker stadig i den. Slip den inde ved chlor.', varighed: 5000 });
    }
    opdaterAlt();
  }
}

// Elektronen flyver hen til et atoms yderste ring (til natrium: dens gamle plads, til chlor: den tomme plads)
function startHop(mål, varighed, færdig) {
  hop = { fra: ePos.clone(), mål, tid: 0, varighed, færdig };
  if (tilstand === 'trækker') tilstand = 'hopper';
}

function hopMål(mål, ud) {
  if (mål === na) return na.ydersteElektron(ud);
  // Den 8. plads på chlors yderste ring: på siden ind mod natrium
  const radius = cl.ydersteRadius();
  return ud.set(cl.gruppe.position.x - radius, cl.gruppe.position.y + 0.0, 0);
}

// ---------- Forløbet ----------
function blivIoner() {
  elektron = 'flyttet';
  elektronMesh.visible = false;
  // Natrium mister den yderste skal og krymper. Chlor fylder sin op og vokser (Shannon-radierne).
  na.skjulYderste = false;
  na.sætSkaller(ionSkaller(par.metal), metal.ion / 100 * S * SKALA);
  na.sætLadning(metal.ladning);
  cl.sætSkaller(ionSkaller(par.ikkemetal), ikke.ion / 100 * S * SKALA);
  cl.sætLadning(ikke.ladning);
  lyd.elektron();
  if (harpun) {
    visBesked({ titel: 'Harpunen!', tekst: `Elektronen hoppede ved ca. ${R_HARPUN.toFixed(1).replace('.', ',')} Å. Nu trækker ionerne hinanden ind.`, type: 'fase', varighed: 6000 });
    ladDemMødes();
    return;
  }
  tilstand = 'ioner';
  visBesked({ titel: 'Nu er de ioner', tekst: 'Na⁺ og Cl⁻. Men regnskabet er i minus: Det kostede mere, end chlor gav tilbage.', type: 'info', hvorfor: 'bytteKoster' });
  opdaterAlt();
  zoom();
}

function ladDemMødes() {
  if (tilstand !== 'ioner' && !(harpun && elektron === 'flyttet')) return;
  tilstand = 'mødes';
  iPlus = regnskab(par, 'flyttet', r).iAlt > 0;
  v = harpun ? -HARPUN_FART : 0;
  pause.fortsæt();
  opdaterAlt();
}

function startHarpun() {
  if (!mødtFør) return;
  nulstil({ harpun: true });
  pause.fortsæt();
  visBesked({ titel: 'Sådan sker det i virkeligheden', tekst: 'Atomerne nærmer sig, mens elektronen bliver hjemme. Hold øje med regnskabet.', type: 'fase', varighed: 6000 });
}

// Forfra med to neutrale atomer langt fra hinanden
function nulstil({ harpun: h = false } = {}) {
  harpun = h;
  tilstand = h ? 'nærmer' : 'start';
  elektron = 'hjemme';
  r = R_START;
  v = h ? -HARPUN_FART : 0;
  hop = null;
  iPlus = false;
  if (trækId !== null) {
    trækId = null;
    verden.styring.enabled = true;
  }
  na.sætSkaller(metal.skaller, metal.radius / 100 * S, true);
  na.sætLadning(0);
  na.skjulYderste = false;
  cl.sætSkaller(ikke.skaller, ikke.radius / 100 * S, true);
  cl.sætLadning(0);
  elektronMesh.visible = false;
  nulstilSpor();
  placer();
  opdaterAlt();
  zoom();
}

// Den knap, der er det næste skridt
function handling() {
  if (tilstand === 'start') visMig();
  else if (tilstand === 'ioner') ladDemMødes();
  else if (tilstand === 'samlet') {
    if (harpun) nulstil();
    else startHarpun();
  }
}

// "Vis mig": elektronen flyttes langsomt over til chlor
function visMig() {
  if (tilstand !== 'start') return;
  pause.fortsæt();
  na.skjulYderste = true;
  ePos.copy(na.ydersteElektron(hjælpV2));
  elektronMesh.visible = true;
  nulstilSpor();
  elektron = 'fri';
  tilstand = 'hopper';
  hop = { fra: ePos.clone(), mål: cl, tid: 0, varighed: VIS_TID, færdig: () => blivIoner() };
  opdaterAlt();
}

// Kernerne står, så tyngdepunktet er i midten (chlor er tungere og flytter sig mindre)
function placer() {
  const m = masseM + masseI;
  na.gruppe.position.set(-r * S * masseI / m, 0, 0);
  cl.gruppe.position.set(r * S * masseM / m, 0, 0);
}

function zoom() {
  const bredde = Math.max(-na.gruppe.position.x + na.radius, cl.gruppe.position.x + cl.radius) + 1.5;
  const højde = Math.max(na.radius, cl.radius) + 3.6;
  passerTilBoks(bredde, højde);
}

// ---------- Hvert billede ----------
function opdater(dt) {
  if (!aktiv) return;
  const tiden = pause.til ? 0 : dt;
  na.opdater(tiden);
  cl.opdater(tiden);
  if (!pause.til) {
    if (hop) opdaterHop(dt);
    if (tilstand === 'nærmer') opdaterNærmer(dt);
    else if (tilstand === 'mødes') opdaterMødes(dt);
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
  ePos.y += Math.sin(Math.PI * blød) * (hop.mål === na ? 0.5 : 1.6); // en lille bue
  // Undervejs er den fri (regnskabet viser, at det koster at tage den)
  if (hop.mål === cl && elektron !== 'fri') {
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
  r = Math.max(R_HARPUN, r - HARPUN_FART * dt);
  placer();
  if (r <= R_HARPUN && !hop) {
    na.skjulYderste = true;
    ePos.copy(na.ydersteElektron(hjælpV2));
    elektronMesh.visible = true;
    nulstilSpor();
    elektron = 'fri';
    tilstand = 'hopper';
    hop = { fra: ePos.clone(), mål: cl, tid: 0, varighed: HOP_TID, færdig: () => blivIoner() };
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
    visBesked({ titel: 'Sådan sker det i virkeligheden', tekst: 'Elektronen hopper langt ude, og så trækker ionerne hinanden ind. Kemikere kalder det harpunen.', type: 'info' });
  } else {
    visBesked({
      titel: 'En ionbinding', tekst: `Na⁺ og Cl⁻ holder sammen. Regnskabet: ${fmt(par.D)} eV.`, type: 'klaret',
    });
  }
  opdaterAlt();
  zoom();
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

// ---------- Panelet og måleren ----------
// Regnskabet lige nu. Under harpunen, før hoppet: hvad hoppet ville give i denne afstand.
function nuværende() {
  if (tilstand === 'nærmer') return { ...regnskab(par, 'flyttet', r), hvis: true };
  return { ...regnskab(par, elektron, r), hvis: false };
}

let målerVist = '';
function opdaterMåler() {
  const rg = nuværende();
  const tal = `${fmt(rg.iAlt)} eV`;
  const nøgle = `${tal}|${rg.hvis}`;
  skrivTal(rg);
  if (nøgle !== målerVist) {
    målerVist = nøgle;
    $('bytteMålerTal').textContent = tal;
    $('bytteMålerNavn').textContent = rg.hvis ? 'Hvis den hoppede nu' : 'Regnskabet';
    const fyld = $('bytteMålerFyld');
    const andel = Math.max(-1, Math.min(1, rg.iAlt / 6));
    fyld.style.left = `${50 + Math.min(0, andel) * 50}%`;
    fyld.style.width = `${Math.abs(andel) * 50}%`;
    fyld.classList.toggle('plus', rg.iAlt > 0.005);
    $('bytteMåler').classList.toggle('hvis', rg.hvis);
    $('bytteMåler').setAttribute('aria-valuenow', rg.iAlt.toFixed(2));
  }
}

let talVist = '';
function skrivTal(rg) {
  const linjer = [
    ['Tage elektronen fra natrium', rg.tage, rg.tage !== 0 || rg.hvis],
    ['Chlor tager den', rg.give, rg.give !== 0 || rg.hvis],
    ['Plus og minus trækker', rg.træk, rg.træk !== 0 || rg.hvis],
  ];
  const html = linjer.map(([navn, x, med]) => `<div class="${med ? '' : 'svag'}"><dt>${navn}</dt><dd>${med ? fmt(x) : '0'} eV</dd></div>`).join('')
    + `<div class="i-alt"><dt>${rg.hvis ? 'Hvis den hoppede nu' : 'I alt'}</dt><dd>${fmt(rg.iAlt)} eV</dd></div>`
    + `<div class="afstand"><dt>Afstand mellem kernerne</dt><dd>${r.toFixed(r < 5 ? 2 : 1).replace('.', ',')} Å</dd></div>`;
  if (html === talVist) return;
  talVist = html;
  $('bytteTal').innerHTML = html;
}

// Teksterne for hvert trin (højre panel og "Næste skridt")
function trin() {
  switch (tilstand) {
    case 'start':
    case 'tilbage':
      return {
        titel: 'To neutrale atomer',
        tekst: 'Natrium har 1 elektron i den yderste skal, og chlor har 7. Begge har lige så mange elektroner som protoner.',
        næste: `${LAV_KVALITET ? 'Træk' : 'Træk med musen'} natriums yderste elektron (den, der lyser) over til chlor.`, knap: '▶ Vis mig',
      };
    case 'trækker':
    case 'hopper':
      return elektron === 'fri'
        ? { titel: 'Elektronen er revet løs', tekst: `Det koster ${fmt(tagEnergi(par.metal)).slice(1)} eV at trække elektronen fri af natrium, for kernen holder på den.`, næste: harpun ? 'Elektronen hopper over til chlor.' : 'Slip elektronen inde ved chlor.' }
        : { titel: 'To neutrale atomer', tekst: 'Træk elektronen længere væk fra natrium.', næste: 'Træk elektronen over til chlor.' };
    case 'ioner':
      return {
        titel: 'Nu er de ioner',
        tekst: `Natrium har mistet en elektron og er blevet til Na⁺. Chlor har fået én og er blevet til Cl⁻. Chlor gav ${fmt(giveEnergi(par.ikkemetal)).slice(1)} eV tilbage, men det er mindre, end det kostede. Regnskabet er i minus.`,
        næste: 'Na⁺ er plus og Cl⁻ er minus. Lad dem mødes.', knap: '▶ Lad dem mødes',
      };
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
          tekst: `I virkeligheden hopper elektronen, allerede når atomerne er ca. ${R_HARPUN.toFixed(1).replace('.', ',')} Å fra hinanden (fire gange afstanden i parret). Så betaler tiltrækningen for hoppet, og ionerne trækker hinanden ind.`,
          næste: 'Prøv selv igen.', knap: '↺ Forfra',
        }
        : {
          titel: 'En ionbinding',
          tekst: `Na⁺ og Cl⁻ stopper ${par.r0.toFixed(2).replace('.', ',')} Å fra hinanden, hvor elektronskyerne begynder at skubbe. Der er frigjort ${fmt(par.D).slice(1)} eV mere, end det kostede. Det er tiltrækningen mellem plus og minus, der betaler. Det kaldes en ionbinding.`,
          næste: 'Se, hvordan det sker i virkeligheden.', knap: '▶ Harpunen',
        };
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
  $('bytteMødes').disabled = tilstand !== 'ioner';
  $('bytteHarpun').disabled = !mødtFør || tilstand === 'nærmer' || tilstand === 'hopper' || (harpun && tilstand === 'mødes');
  $('bytteHarpun').title = mødtFør ? 'Se harpunen: elektronen hopper, når atomerne er kommet tæt nok på' : 'Lad først ionerne mødes';
  opdaterMåler();
}

// Står der et neutralt natrium- eller chloratom i "Byg et atom", nævnes det
function visDitAtom() {
  const t = hentVærkstedAtom();
  const el = $('bytteDit');
  let tekst = '';
  if (t && t.p === t.e && (t.p === metal.nr || t.p === ikke.nr)) {
    const navn = t.p === metal.nr ? 'natrium' : 'chlor';
    tekst = `Dit ${navn}atom fra "Byg et atom" (${navn}-${t.p + t.n}) er med her.`;
  }
  el.hidden = !tekst;
  el.textContent = tekst;
}

// ---------- Start og stop (fra Værkstedet) ----------
export function startByttebørs() {
  aktiv = true;
  rod.visible = true;
  verden.opdateringer.add(opdater);
  stopKamera(); // atomets sving i "Byg et atom" må ikke fortsætte her
  sætVindue($('vaerkstedVindue'));
  const k = verden.kamera;
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = false;
  k.position.set(0, 2, Math.max(k.position.length(), 40));
  begrænsDrejning({ vandret: 0.6, lodret: 0.45 });
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
    na.skjulYderste = false;
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
    harpunAfstand: () => R_HARPUN,
    flytEnergi: () => flytEnergi(par.metal, par.ikkemetal),
    ringe: () => ({ na: na.ydersteRadius() / S, cl: cl.ydersteRadius() / S, naSkaller: [...na.skaller], clSkaller: [...cl.skaller] }),
    // Hvor elektronen og chlor står på skærmen (til at trække med musen i testen)
    elektronPå: () => skærmPos(na.ydersteElektron(new THREE.Vector3())),
    chlorPå: () => skærmPos(cl.gruppe.position),
    natriumPå: () => skærmPos(na.gruppe.position),
    tidsknap: () => pause.tilstand,
    styring: () => verden.styring.enabled,
    // Spol frem i små skridt (som på en skærm med 60 billeder i sekundet)
    spol: (sek) => { for (let t = 0; t < sek; t += 1 / 60) opdater(1 / 60); },
  };
}
