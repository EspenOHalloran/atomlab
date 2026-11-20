// Kvantefysik (#kvante): en egen del i verdenen Atomer (docs/drejebog-kvantefysik.md med rettelserne i
// docs/fable/E7-kvantefysik-noter.md). Laboratoriet er bænken med dobbeltspalten: Skyd med kugler, bølger i vand,
// elektroner eller lys mod en væg med to sprækker, luk en sprække, og tænd måleren. Tegningen står i js/kvante/baenk.js,
// modellen og teksterne i js/data/kvante.js.
// "Skyd" virker, mens knappen holdes nede, og det går hurtigere og hurtigere. Et tryk på en sprække i billedet lukker
// eller åbner den.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { rydBeskeder } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import { lavKontakt } from './kontakt.js';
import { HVORFOR } from './data/hvorfor.js';
import {
  STANDARD, GRÆNSER, SLAGS, SPRÆKKER, STRIBE_Y, SPRÆKKE_HØJDE, kugleForstørrelse, PANEL, NAVN, PRIKKER, SKYDER, KVANTE_KORT,
  bølgelængde, nanometer, lysFarve, åbneSprækker, lavFordeling, tilfældig, histogram, toppe, mørkeStriber, panelNøgle, talTekst,
} from './data/kvante.js';
import { lavBænk, KILDE_Y } from './kvante/baenk.js';

const $ = (id) => document.getElementById(id);
const FARVE = { elektroner: [0.45, 0.9, 1.4], kugler: [1.1, 1.1, 1.15] };
const BØLGE_SKÆR = [0.3, 0.75, 1.0]; // "Vis bølgen" for elektroner og lys: et svagt skær
const HØJST_PR_SEK = 450; // elektroner pr. sekund, når knappen har været holdt nede længe
const FLYVETID = 0.12; // s fra kilden blinker, til prikken tændes (elektronen tegnes ikke på vej)

let bænk = null;
let aktiv = false;
const v = { slags: 'elektroner', sprækker: 'begge', måler: false, d: STANDARD.d, a: STANDARD.a, fart: STANDARD.fart, farve: STANDARD.farve, bølgen: false };
let fordeling = null; // tabellen, prikkerne trækkes fra (laves igen, når noget ændres)
let rng = tilfældig(1);
let holder = false; // "Skyd" holdes nede
let holdTid = 0;
let rest = 0; // brøkdelen af et skud, der er til gode
let kø = 0; // skud, programmet selv skyder (fx i turen)
let køFart = 60;
let påVej = []; // { tid, z, y, lampe }: elektroner, der lander om lidt
let målerKontakt = null;
let bølgeKontakt = null;
let panelTegnet = '';
let panelTid = 0;
let størrelse = '';
const stråle = new THREE.Raycaster();

export function lav() {
  bænk = lavBænk();
  bænk.gruppe.visible = false;
  verden.scene.add(bænk.gruppe);
  const tæller = document.createElement('p');
  tæller.className = 'kv-tæller';
  tæller.id = 'kvTæller';
  tæller.hidden = true;
  $('kvanteVindue').append(tæller);

  for (const b of document.querySelectorAll('[data-kv-slags]')) b.addEventListener('click', () => { lyd.klik(); vælgSlags(b.dataset.kvSlags); });
  for (const b of document.querySelectorAll('[data-kv-spraekker]')) b.addEventListener('click', () => { lyd.klik(); sætSprækker(b.dataset.kvSpraekker); });
  $('kvAfstand').addEventListener('input', (h) => sæt({ d: skala(h.target.value, GRÆNSER.d) }));
  $('kvBredde').addEventListener('input', (h) => sæt({ a: skala(h.target.value, GRÆNSER.a) }));
  $('kvFart').addEventListener('input', (h) => sæt(v.slags === 'lys' ? { farve: h.target.value / 100 } : { fart: h.target.value / 100 }));
  målerKontakt = lavKontakt($('kvMåler'));
  målerKontakt.knap.addEventListener('click', () => { lyd.klik(); sætMåler(!v.måler); });
  bølgeKontakt = lavKontakt($('kvBølgen'));
  bølgeKontakt.knap.addEventListener('click', () => { lyd.klik(); sæt({ bølgen: !v.bølgen }); });
  $('kvForfra').addEventListener('click', () => { lyd.klik(); forfra(); });
  lavSkydKnap($('kvSkyd'));
  $('kvanteHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpKvante').classList.remove('skjult'); });
  $('kvHvorfor').innerHTML = KVANTE_KORT.map((id) => `<button class="hvorfor" data-hvorfor="${id}">Hvorfor? ${HVORFOR[id].spørgsmål}</button>`).join('');
  lavTryk();
  // Når 3D-billedet får en ny størrelse (fx tabletten vendes), stilles kameraet igen
  new ResizeObserver(() => {
    const r = $('kvanteVindue').getBoundingClientRect();
    const ny = `${Math.round(r.width / 40)}x${Math.round(r.height / 40)}`;
    if (aktiv && ny !== størrelse) requestAnimationFrame(() => aktiv && kamera());
  }).observe($('kvanteVindue'));
}

export function start() {
  aktiv = true;
  sætVindue($('kvanteVindue'));
  verden.styring.autoRotate = false;
  begrænsDrejning({ vandret: 0.7, lodret: 1 });
  // Kameraet må ikke komme under bordet, men gerne se ned på vandet
  verden.styring.minPolarAngle = 0.32;
  verden.styring.maxPolarAngle = Math.PI / 2 - 0.06;
  verden.opdateringer.add(opdater);
  bænk.gruppe.visible = true;
  Object.assign(v, { slags: 'elektroner', sprækker: 'begge', måler: false, d: STANDARD.d, a: STANDARD.a, fart: STANDARD.fart, farve: STANDARD.farve, bølgen: false });
  forfra({ straks: true });
  kamera({ straks: true });
}

export function stop() {
  aktiv = false;
  holder = false;
  kø = 0;
  påVej = [];
  verden.opdateringer.delete(opdater);
  bænk.gruppe.visible = false;
  bænk.vand(false);
  begrænsDrejning(null);
  $('hjælpKvante').classList.add('skjult');
}

// En skyder fra 0 til 100 over grænserne [lav, høj]
const skala = (x, [lav, høj]) => lav + ((høj - lav) * Number(x)) / 100;
const tilSkyder = (x, [lav, høj]) => Math.round(((x - lav) / (høj - lav)) * 100);
const bredde = () => Math.min(v.a, 0.6 * v.d);
const λ = () => bølgelængde(v.slags, v);
const skyderSlags = () => v.slags === 'elektroner' || v.slags === 'lys';

// ---------- Valgene ----------
function vælgSlags(slags) {
  if (!SLAGS.includes(slags) || slags === v.slags) return;
  v.slags = slags;
  if (!skyderSlags()) { v.måler = false; v.bølgen = false; }
  forfra();
  kamera();
}

function sætSprækker(s) {
  if (!SPRÆKKER.includes(s) || s === v.sprækker) return;
  v.sprækker = s;
  ændret();
}

function sætMåler(til) {
  if (!skyderSlags()) return;
  v.måler = Boolean(til);
  if (v.måler) v.bølgen = false;
  ændret();
}

function sæt(nyt) {
  Object.assign(v, nyt);
  if (v.måler) v.bølgen = false;
  ændret();
}

// Noget er ændret: Bagvæggen ryddes, så mønstret passer til det nye (og vandet starter forfra)
function ændret({ straks = false } = {}) {
  fordeling = null;
  påVej = [];
  bænk.ryd();
  bænk.prikStørrelse(v.slags === 'kugler' ? 0.13 : 0.05);
  rng = tilfældig(1);
  bænk.sæt({ d: v.d, a: bredde(), sprækker: v.sprækker, λ: λ(), måler: v.måler, straks });
  // Vandet (eller bølgens skær for elektroner og lys) starter forfra med de nye sprækker
  const kører = bænk.vandTændt();
  bænk.vand(false);
  if (v.slags === 'boelger' && kører) startBølger();
  else if (v.bølgen && skyderSlags()) bænk.vand(true, 0.38, BØLGE_SKÆR);
  visStyring();
  panel(true);
}

function forfra({ straks = false } = {}) {
  holder = false;
  kø = 0;
  bænk.vand(false);
  ændret({ straks });
}

// ---------- Skuddene ----------
function lavSkydKnap(knap) {
  let fraFinger = false;
  knap.addEventListener('pointerdown', (h) => {
    if (h.button > 0) return;
    fraFinger = true;
    try { knap.setPointerCapture(h.pointerId); } catch { /* fx et kunstigt tryk */ }
    trykSkyd();
  });
  const slip = () => { holder = false; };
  for (const navn of ['pointerup', 'pointercancel', 'lostpointercapture']) knap.addEventListener(navn, slip);
  // Tastaturet (Enter og mellemrum) giver et klik uden finger: et lille salvo
  knap.addEventListener('click', () => {
    if (fraFinger) { fraFinger = false; return; }
    trykSkyd();
    holder = false;
    if (v.slags !== 'boelger') kø += 5;
  });
}

function trykSkyd() {
  if (!aktiv) return;
  if (v.slags === 'boelger') {
    lyd.klik();
    startBølger();
    return;
  }
  holder = true;
  holdTid = 0;
  rest = 0;
  skud();
}

function startBølger() {
  bænk.vand(false);
  bænk.vand(true, 1, [0.25, 0.55, 0.95]);
  visStyring();
}

// Ét skud. instant: prikken lander straks (testene og "Vis mig"), ellers flyver kuglen, og elektronen lander om lidt.
function skud(instant = false) {
  if (v.slags === 'boelger') return;
  if (v.slags === 'kugler') return kugle(instant);
  fordeling ??= lavFordeling({ slags: v.slags, sprækker: v.sprækker, måler: v.måler, d: v.d, a: bredde(), λ: λ() });
  const z = fordeling.træk(rng());
  const y = STRIBE_Y[0] + rng() * (STRIBE_Y[1] - STRIBE_Y[0]);
  // Måleren finder elektronen ved én sprække (med kun én åben altid den)
  const åbne = åbneSprækker(v.sprækker, v.d);
  const lampe = !v.måler ? -1 : åbne.length === 1 ? (åbne[0] < 0 ? 0 : 1) : rng() < 0.5 ? 0 : 1;
  if (instant) return land({ z, y, lampe });
  bænk.blink();
  påVej.push({ tid: FLYVETID, z, y, lampe });
}

function land({ z, y, lampe }) {
  if (lampe >= 0) bænk.lampe(lampe);
  const farve = v.slags === 'lys' ? lysFarve(nanometer(v.farve)).map((c) => c * 1.35) : FARVE.elektroner;
  bænk.prik(z, y, farve);
}

// En kugle sigter mest mod en åben sprække, ellers et sted på væggen. Den flyver lige: gennem en åben sprække lander
// den på bagvæggen på linjen fra kilden, ellers rammer den væggen og falder ned.
function kugle(instant) {
  const a = bredde();
  const åbne = åbneSprækker(v.sprækker, v.d);
  let z, y;
  if (rng() < 0.8) {
    z = åbne[Math.floor(rng() * åbne.length)] + (rng() - 0.5) * a * 0.96;
    y = 0.62 + rng() * 0.56;
  } else {
    z = (rng() * 2 - 1) * 1.8;
    y = 0.4 + rng();
  }
  const gennem = åbne.some((zs) => Math.abs(z - zs) < a / 2) && y > 0.2 && y < 0.2 + SPRÆKKE_HØJDE;
  const f = kugleForstørrelse();
  const mål = { z: z * f, y: KILDE_Y + (y - KILDE_Y) * f };
  if (gennem && (mål.y < 0.05 || mål.y > 1.75)) return; // går over eller under bagvæggens kant
  if (instant) {
    if (gennem) bænk.prik(mål.z, mål.y, FARVE.kugler);
    return;
  }
  lyd.klik();
  bænk.kast({ z, y, gennem, land: mål }, (m) => { if (aktiv) bænk.prik(m.z, m.y, FARVE.kugler); });
}

// ---------- Hvert billede ----------
function opdater(dt, tid) {
  // Holdes knappen nede, går det hurtigere og hurtigere (kuglerne flyver, så de går langsommere)
  if (holder && v.slags !== 'boelger') {
    holdTid += dt;
    const pr = v.slags === 'kugler' ? Math.min(14, 4 + holdTid * 2.5) : Math.min(HØJST_PR_SEK, 3 * 2 ** (holdTid / 0.75));
    rest += pr * dt;
  }
  if (kø > 0) {
    const n = Math.min(kø, køFart * dt + 0.5);
    rest += n;
    kø = Math.max(0, kø - n);
  }
  let n = Math.floor(rest);
  rest -= n;
  if (v.slags === 'kugler') n = Math.min(n, 4);
  while (n-- > 0) skud();
  for (const p of påVej) p.tid -= dt;
  while (påVej.length && påVej[0].tid <= 0) land(påVej.shift());
  bænk.opdater(dt, tid);
  tegnTæller();
  panelTid += dt;
  if (panelTid > 0.25) { panelTid = 0; panel(); }
}

// Tælleren øverst i billedet: hvor mange der er landet
let tællerTegnet = '';
function tegnTæller() {
  const el = $('kvTæller');
  const tekst = v.slags === 'boelger' ? '' : `${PRIKKER[v.slags]}: ${talTekst(bænk.antal())}`;
  if (tekst === tællerTegnet) return;
  tællerTegnet = tekst;
  el.hidden = !tekst;
  el.textContent = tekst;
}

// ---------- Kameraet ----------
// Bænken drejes, så kameraet ser den skråt fra siden (kilden til venstre, bagvæggen til højre). På et smalt billede
// ses den mere bagfra, så den fylder mindre i bredden. Vandet ses mere oppefra.
const tV = new THREE.Vector3();
function kamera({ straks = false } = {}) {
  const { kamera: k, styring } = verden;
  const r = $('kvanteVindue').getBoundingClientRect();
  størrelse = `${Math.round(r.width / 40)}x${Math.round(r.height / 40)}`;
  const forhold = r.height > 10 ? r.width / r.height : 1.5;
  const t = THREE.MathUtils.clamp((forhold - 0.7) / 0.9, 0, 1); // 0 smal, 1 bred
  const φ = THREE.MathUtils.degToRad(22 + 30 * t); // vinklen mellem strålen og retningen til kameraet
  const e = THREE.MathUtils.degToRad((36 - 12 * t) + (v.slags === 'boelger' ? 26 : 0));
  bænk.gruppe.rotation.y = Math.PI / 2 - φ;
  bænk.gruppe.updateMatrixWorld(true);
  const kasse = bænk.kasse();
  const midt = kasse.getCenter(new THREE.Vector3());
  midt.y = 0.75;
  bænk.gruppe.localToWorld(midt);
  const ret = new THREE.Vector3(0, Math.sin(e), Math.cos(e));
  const op = new THREE.Vector3(0, Math.cos(e), -Math.sin(e));
  let hb = 0, hh = 0;
  for (let i = 0; i < 8; i++) {
    tV.set(i & 1 ? kasse.max.x : kasse.min.x, i & 2 ? kasse.max.y : kasse.min.y, i & 4 ? kasse.max.z : kasse.min.z);
    bænk.gruppe.localToWorld(tV).sub(midt);
    hb = Math.max(hb, Math.abs(tV.x));
    hh = Math.max(hh, Math.abs(tV.dot(op)));
  }
  styring.target.copy(midt);
  const afstand = straks ? 14 : Math.max(k.position.distanceTo(midt), 6);
  k.position.copy(midt).addScaledVector(ret, afstand);
  styring.update();
  passerTilBoks(hb * 1.04, hh * 1.1);
  if (straks || ROLIG) {
    k.position.copy(midt).addScaledVector(ret, verden.målAfstand ?? afstand);
    verden.målAfstand = null;
    styring.update();
  }
}

// ---------- Tryk i 3D: en sprække lukker eller åbner, og i vandet starter bølgerne ----------
function lavTryk() {
  const lærred = verden.renderer.domElement;
  let ned = null;
  lærred.addEventListener('pointerdown', (h) => {
    ned = aktiv ? { id: h.pointerId, x: h.clientX, y: h.clientY, t: performance.now() } : null;
  });
  lærred.addEventListener('pointerup', (h) => {
    if (!ned || h.pointerId !== ned.id) return;
    const kort = performance.now() - ned.t < 600 && Math.hypot(h.clientX - ned.x, h.clientY - ned.y) < 12;
    ned = null;
    if (kort) tryk(h.clientX, h.clientY);
  });
}

function tryk(x, y) {
  if (!aktiv) return;
  const r = verden.renderer.domElement.getBoundingClientRect();
  stråle.setFromCamera({ x: ((x - r.left) / r.width) * 2 - 1, y: -((y - r.top) / r.height) * 2 + 1 }, verden.kamera);
  const ramt = stråle.intersectObjects(bænk.trykKasser, false)[0];
  if (ramt) return trykSprække(ramt.object.userData.sprække);
  if (v.slags === 'boelger') { lyd.klik(); startBølger(); }
}

// Sprække 0 er den venstre (z < 0), 1 den højre. Den sidste åbne kan ikke lukkes.
function trykSprække(i) {
  const navn = i === 0 ? 'venstre' : 'højre';
  const anden = i === 0 ? 'højre' : 'venstre';
  if (v.sprækker === 'begge') sætSprækker(anden);
  else if (v.sprækker === anden) sætSprækker('begge');
  else return lyd.nej();
  lyd.klik();
  return navn;
}

// ---------- Panelerne ----------
function visStyring() {
  for (const b of document.querySelectorAll('[data-kv-slags]')) {
    b.classList.toggle('valgt', b.dataset.kvSlags === v.slags);
    b.setAttribute('aria-pressed', String(b.dataset.kvSlags === v.slags));
  }
  for (const b of document.querySelectorAll('[data-kv-spraekker]')) {
    b.classList.toggle('valgt', b.dataset.kvSpraekker === v.sprækker);
    b.setAttribute('aria-pressed', String(b.dataset.kvSpraekker === v.sprækker));
  }
  $('kvAfstand').value = String(tilSkyder(v.d, GRÆNSER.d));
  $('kvBredde').value = String(tilSkyder(bredde(), GRÆNSER.a));
  const s = SKYDER[v.slags];
  $('kvFartGruppe').hidden = !s;
  if (s) {
    $('kvFartNavn').textContent = s.navn;
    $('kvFartEnder').innerHTML = s.ender.map((e) => `<span>${e}</span>`).join('');
    $('kvFart').setAttribute('aria-label', s.navn);
    $('kvFart').value = String(Math.round((v.slags === 'lys' ? v.farve : v.fart) * 100));
  }
  målerKontakt.sæt(v.måler);
  målerKontakt.knap.disabled = !skyderSlags();
  bølgeKontakt.sæt(v.bølgen);
  bølgeKontakt.knap.disabled = !skyderSlags() || v.måler;
  $('kvSkyd').textContent = v.slags === 'boelger' ? 'Start bølgerne' : 'Skyd';
  $('kvSkyd').title = v.slags === 'boelger' ? '' : 'Hold knappen nede';
}

function panel(straks = false) {
  const nøgle = panelNøgle(v);
  const p = PANEL[nøgle];
  const tal = v.slags === 'boelger' ? [] : [{ navn: `${PRIKKER[v.slags]} landet`, værdi: talTekst(bænk.antal()) }];
  const tegn = `${nøgle}|${tal.map((t) => t.værdi).join()}`;
  if (tegn === panelTegnet && !straks) return;
  panelTegnet = tegn;
  $('kvTitel').textContent = p.titel;
  $('kvTekst').textContent = p.tekst;
  const dl = $('kvTal');
  dl.hidden = !tal.length;
  dl.innerHTML = '';
  for (const t of tal) {
    const d = document.createElement('div');
    d.innerHTML = '<dt></dt><dd></dd>';
    d.querySelector('dt').textContent = t.navn;
    d.querySelector('dd').textContent = t.værdi;
    dl.append(d);
  }
}

// ---------- Til tests (?test) ----------
export function testAdgang() {
  return {
    synlig: () => bænk.gruppe.visible,
    opdateres: () => verden.opdateringer.has(opdater),
    valg: () => ({ ...v, a: bredde(), λ: λ() }),
    slags: (s) => vælgSlags(s),
    sprækker: (s) => sætSprækker(s),
    måler: (til) => sætMåler(til),
    sæt: (nyt) => sæt(nyt),
    forfra: () => forfra(),
    trykSprække: (i) => trykSprække(i),
    // Skyder n med det samme (fast frø fra sidste ændring), så mønstret kan regnes på
    skyd(n) {
      for (let i = 0; i < n; i++) skud(true);
      bænk.opdater(0, 0);
      tegnTæller();
      panel();
      return bænk.antal();
    },
    antal: () => bænk.antal(),
    iLuften: () => bænk.iLuften(),
    holder: () => holder,
    // Mønstret på bagvæggen: felterne, antal toppe og mørke striber
    mønster(felter = 60) {
      const h = histogram(bænk.zer(), felter);
      return { felter: h, toppe: toppe(h), mørke: mørkeStriber(h) };
    },
    // Prikker inden for ±r af z (fx ringen i turens trin 4)
    tæl: (z, r) => bænk.zer().filter((x) => Math.abs(x - z) < r).length,
    lamper: () => [...bænk.t.lampe],
    lukket: () => [...bænk.t.lukMål],
    vand: () => ({ tændt: bænk.vandTændt(), front: bænk.vandFront() }),
    panel: () => ({ titel: $('kvTitel').textContent, tekst: $('kvTekst').textContent, tal: $('kvTal').textContent }),
    tæller: () => ($('kvTæller').hidden ? '' : $('kvTæller').textContent),
    kamera: () => ({ drejet: bænk.gruppe.rotation.y, mål: verden.styring.target.toArray() }),
    // Skærmpunktet for en sprække (til at trykke på den i testen)
    sprækkePunkt(i) {
      const p = bænk.trykKasser[i].getWorldPosition(new THREE.Vector3()).project(verden.kamera);
      const r = verden.renderer.domElement.getBoundingClientRect();
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
    },
    spol(sek) {
      for (let t = 0; t < sek; t += 0.05) opdater(0.05, t);
    },
  };
}
