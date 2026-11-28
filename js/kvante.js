// Kvantefysik (#kvante): en egen del i verdenen Atomer (docs/drejebog-kvantefysik.md med rettelserne i
// docs/fable/E7-kvantefysik-noter.md). Laboratoriet er bænken med dobbeltspalten: Skyd med kugler, bølger i vand,
// elektroner eller lys mod en væg med to sprækker, luk en sprække, og tænd måleren. Tegningen står i js/kvante/baenk.js,
// modellen og teksterne i js/data/kvante.js.
// "Skyd" virker, mens knappen holdes nede, og det går hurtigere og hurtigere. Et tryk på en sprække i billedet lukker
// eller åbner den. Turen "Prikker bliver til striber" (Forløb-klodsen, teksterne i js/data/forloeb/kvante.js) starter
// af sig selv første gang.

import * as THREE from 'three';
import { verden, sætVindue, passerTilBoks, begrænsDrejning, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';
import { lavKontakt } from './kontakt.js';
import { HVORFOR } from './data/hvorfor.js';
import { tagVentForløb, tagVentKvante } from './gaa.js';
import { startForløb, stopForløb, starterSelv, forløbVenter, forløbRørt, forløbTest, lavTurKnap, kørerForløb } from './forloeb.js';
import { sætOrdTilOrdbog } from './ordforklaring.js';
import { lukHvorfor } from './lag.js';
import { STRIBER } from './data/forloeb/kvante.js';
import {
  STANDARD, GRÆNSER, SLAGS, SPRÆKKER, STRIBE_Y, SPRÆKKE_HØJDE, kugleForstørrelse, PANEL, PRIKKER, SKYDER, KVANTE_KORT,
  bølgelængde, nanometer, lysFarve, åbneSprækker, lavFordeling, tilfældig, histogram, toppe, mørkeStriber, panelNøgle, talTekst,
  mørktSted, RING_HALV, STØRRE, kugleSlags, kvanteSlags, pulsTid, målerTekst, skiltTekst, tælTekst, ringTekst, stilleSted, FORKLAR, visning, L, BAG_HALV,
} from './data/kvante.js';
import { lavBænk, KILDE_Y, VÆG_HØJDE } from './kvante/baenk.js';
import { lavSkilt } from './kvante/skilt.js';

const $ = (id) => document.getElementById(id);
const FARVE = { elektroner: [0.45, 0.9, 1.4], kugler: [1.1, 1.1, 1.15], molekyle: [1.4, 0.75, 0.3], klump: [1.45, 1.2, 0.35], fodbold: [1.15, 1.15, 1.15] };
const SET_FARVE = [1.55, 1.2, 0.42]; // "Målerens lys" skruet ned: prikkerne, måleren så, får lampens farve
const BØLGE_SKÆR = [0.3, 0.75, 1.0]; // "Vis bølgen": bølgepakkens farve for elektroner, molekyler og klumper (lys har sin egen farve)
const HØJST_PR_SEK = 450; // elektroner pr. sekund, når knappen har været holdt nede længe
const FLYVETID = 0.12; // s fra kilden blinker, til prikken tændes (elektronen tegnes ikke på vej)

let bænk = null;
let skilt = null; // skiltet øverst i midten af scenen: hvad der sendes nu, og hvor mange der er landet
let aktiv = false;
const v = { slags: 'elektroner', sprækker: 'begge', måler: false, d: STANDARD.d, a: STANDARD.a, fart: STANDARD.fart, farve: STANDARD.farve, bølgen: false, syn: STANDARD.syn };
let fordeling = null; // tabellen, prikkerne trækkes fra uden måler (laves igen, når noget ændres)
let fordelingSet = null; // og for elektroner, måleren så (ingen striber)
let rng = tilfældig(1);
let holder = false; // "Skyd" holdes nede
let holdTid = 0;
let rest = 0; // brøkdelen af et skud, der er til gode
let kø = 0; // skud, programmet selv skyder (fx i turen)
let køFart = 60;
let selvMål = 0; // programmet holder selv "Skyd" nede, til så mange er landet (turen og "Vis mig")
let fingerHolder = false; // "Skyd" i turens linje holdes nede med en finger eller musen
let påVej = []; // { tid, z, y, lampe }: elektroner, der lander om lidt
let målerKontakt = null;
let bølgeKontakt = null;
let panelTegnet = '';
let panelTid = 0;
let størrelse = '';
let lysNu = [1, 1, 1]; // fotonernes farve (regnes, når farven ændres)
let størst = 'molekyle'; // den sidste valgte under "Større …" (knappen vælger den igen)
let målt = [0, 0]; // elektroner, måleren fandt ved den venstre og den højre sprække (tælleren over væggen)
let ikkeSet = 0; // elektroner, måleren ikke så (når "Målerens lys" er skruet ned)
let sete = []; // for hver landet prik: så måleren den? (til testen, i samme rækkefølge som bænk.zer())
let serie = 0; // skud, der venter på, at bølgepakken foran er nået forbi bagvæggen ("Skyd én" i turens trin 6)
const stråle = new THREE.Raycaster();

export function lav() {
  bænk = lavBænk();
  bænk.gruppe.visible = false;
  verden.scene.add(bænk.gruppe);
  skilt = lavSkilt($('kvanteVindue'));
  // "Tryk på vandet" over ringen på vandet (bølger i vand, før bølgerne er startet)
  const peg = document.createElement('p');
  peg.className = 'kv-peg';
  peg.id = 'kvPeg';
  peg.hidden = true;
  peg.textContent = 'Tryk på vandet';
  $('kvanteVindue').append(peg);
  // Bølge eller prik: to mærker langs bænkens forkant, under vejen og under bagvæggen (rettelse 7 efter prøven)
  for (const hvor of ['vej', 'bag']) {
    const el = document.createElement('p');
    el.className = `kv-vis ${hvor}`;
    el.dataset.vis = hvor;
    el.hidden = true;
    el.innerHTML = '<i aria-hidden="true"></i><span></span>';
    $('kvanteVindue').append(el);
  }
  // De to skilte på vandet, når bølgerne er nået bagvæggen: "Top møder top" og "Top møder dal" (rettelse 3 efter prøven)
  for (const f of FORKLAR) {
    const el = document.createElement('p');
    el.className = `kv-forklar ${f.id}`;
    el.dataset.forklar = f.id;
    el.hidden = true;
    el.innerHTML = '<b></b><small></small>';
    el.querySelector('b').textContent = f.titel;
    el.querySelector('small').textContent = f.tekst;
    $('kvanteVindue').append(el);
  }
  const måltSkilt = document.createElement('p');
  måltSkilt.className = 'kv-målt';
  måltSkilt.id = 'kvMålt';
  måltSkilt.hidden = true;
  måltSkilt.innerHTML = '<span></span><strong></strong>';
  $('kvanteVindue').append(måltSkilt);

  for (const b of document.querySelectorAll('[data-kv-slags]')) b.addEventListener('click', () => { lyd.klik(); vælgSlags(b.dataset.kvSlags); });
  $('kvStørre').addEventListener('click', () => { lyd.klik(); vælgSlags(størst); });
  for (const b of document.querySelectorAll('[data-kv-spraekker]')) b.addEventListener('click', () => { lyd.klik(); sætSprækker(b.dataset.kvSpraekker); });
  $('kvAfstand').addEventListener('input', (h) => sæt({ d: skala(h.target.value, GRÆNSER.d) }));
  $('kvBredde').addEventListener('input', (h) => sæt({ a: skala(h.target.value, GRÆNSER.a) }));
  $('kvFart').addEventListener('input', (h) => sæt(v.slags === 'lys' ? { farve: h.target.value / 100 } : { fart: h.target.value / 100 }));
  $('kvLys').addEventListener('input', (h) => sæt({ syn: h.target.value / 100 }));
  målerKontakt = lavKontakt($('kvMåler'));
  målerKontakt.knap.addEventListener('click', () => { lyd.klik(); sætMåler(!v.måler); });
  bølgeKontakt = lavKontakt($('kvBølgen'));
  bølgeKontakt.knap.addEventListener('click', () => {
    lyd.klik();
    sæt({ bølgen: !v.bølgen });
    if (v.bølgen) skud(); // man ser bølgen med det samme
  });
  $('kvForfra').addEventListener('click', () => { lyd.klik(); forfra(); });
  lavSkydKnap($('kvSkyd'));
  $('kvanteHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpKvante').classList.remove('skjult'); });
  $('kvHvorfor').innerHTML = KVANTE_KORT.map((id) => `<button class="hvorfor" data-hvorfor="${id}">Hvorfor? ${HVORFOR[id].spørgsmål}</button>`).join('');
  lavTryk();
  lavTurSkyd();
  lavTurKnap($('kvante'), [STRIBER], () => startTur());
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
  Object.assign(v, { slags: 'elektroner', sprækker: 'begge', måler: false, d: STANDARD.d, a: STANDARD.a, fart: STANDARD.fart, farve: STANDARD.farve, bølgen: false, syn: STANDARD.syn });
  forfra({ straks: true });
  kamera({ straks: true });
  // Et link med en slags (fx "Se det selv" i Gåderne eller fotonen i Ordbogen) åbner bænken med den, uden turen.
  // Ellers starter turen af sig selv første gang, og når man kommer fra "Din fremgang" eller turens link.
  const slags = tagVentKvante();
  if (tagVentForløb([STRIBER.id]) || (!slags && starterSelv(STRIBER))) startTur();
  else if (slags) vis(slags);
}

// Bænken med en slags fra et link (data-gaa="kvante:lys" eller "kvante:stor", js/gaa.js): 'stor' er "Større …"
export function vis(slags) {
  if (!aktiv) return;
  if (kørerForløb()) stopForløb();
  vælgSlags(slags === 'stor' ? størst : slags);
}

export function stop() {
  stopForløb(); // kalder DEL.slut
  aktiv = false;
  holder = false;
  fingerHolder = false;
  selvMål = 0;
  kø = 0;
  serie = 0;
  påVej = [];
  verden.opdateringer.delete(opdater);
  bænk.gruppe.visible = false;
  bænk.vand(false);
  skilt.stop();
  $('kvPeg').hidden = true;
  for (const el of document.querySelectorAll('#kvanteVindue .kv-forklar, #kvanteVindue .kv-vis')) el.hidden = true;
  begrænsDrejning(null);
  $('hjælpKvante').classList.add('skjult');
}

// En skyder fra 0 til 100 over grænserne [lav, høj]
const skala = (x, [lav, høj]) => lav + ((høj - lav) * Number(x)) / 100;
const tilSkyder = (x, [lav, høj]) => Math.round(((x - lav) / (høj - lav)) * 100);
const bredde = () => Math.min(v.a, 0.6 * v.d);
const λ = () => bølgelængde(v.slags, v);
const kvanteNu = () => kvanteSlags(v.slags); // striber, måler og "Vis bølgen"

// ---------- Valgene ----------
function vælgSlags(slags) {
  if (!SLAGS.includes(slags) || slags === v.slags) return;
  v.slags = slags;
  if (STØRRE.includes(slags)) størst = slags;
  if (!kvanteNu()) { v.måler = false; v.bølgen = false; }
  forfra();
  kamera();
}

function sætSprækker(s) {
  if (!SPRÆKKER.includes(s) || s === v.sprækker) return;
  v.sprækker = s;
  ændret();
}

function sætMåler(til) {
  if (!kvanteNu()) return;
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
  fordelingSet = null;
  påVej = [];
  bænk.ryd();
  bænk.kar(v.slags === 'boelger');
  bænk.prikStørrelse(kugleSlags(v.slags) ? 0.13 : 0.05);
  bænk.bold(v.slags === 'fodbold');
  lysNu = lysFarve(nanometer(v.farve)).map((c) => c * 1.35);
  rng = tilfældig(1);
  ringTal = 0;
  målt = [0, 0];
  ikkeSet = 0;
  sete = [];
  serie = 0;
  bænk.sæt({ d: v.d, a: bredde(), sprækker: v.sprækker, λ: λ(), måler: v.måler, kuvert: kvanteNu() ? bredde() : 0, straks });
  // Vandet starter forfra med de nye sprækker. Bølgepakkerne ("Vis bølgen") kommer først med det næste skud.
  const kører = bænk.vandTændt() && !bænk.pulsKører();
  bænk.vand(false);
  if (v.slags === 'boelger' && kører) startBølger();
  visStyring();
  panel(true);
  tegnSkilt(); // med det samme, ikke først i næste billede (tjekliste E)
}

function forfra({ straks = false } = {}) {
  holder = false;
  selvMål = 0;
  kø = 0;
  serie = 0;
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
  if (kugleSlags(v.slags)) return kugle(instant);
  // Måleren ser elektronen (med svagt lys kun med chancen v.syn, Feynmans tankeforsøg). En elektron, den så, lander uden
  // striber, en, den ikke så, med striber. Med fuldt lys trækkes der ikke et ekstra tal (testene bruger det faste frø).
  const set = v.måler && (v.syn >= 1 || rng() < v.syn);
  const valg = { slags: v.slags, sprækker: v.sprækker, d: v.d, a: bredde(), λ: λ() };
  const f = set ? (fordelingSet ??= lavFordeling({ ...valg, måler: true })) : (fordeling ??= lavFordeling({ ...valg, måler: false }));
  const z = f.træk(rng());
  const y = STRIBE_Y[0] + rng() * (STRIBE_Y[1] - STRIBE_Y[0]);
  // Måleren finder elektronen ved én sprække (med kun én åben altid den)
  const åbne = åbneSprækker(v.sprækker, v.d);
  const lampe = !set ? -1 : åbne.length === 1 ? (åbne[0] < 0 ? 0 : 1) : rng() < 0.5 ? 0 : 1;
  if (instant) return land({ z, y, lampe, ikke: v.måler && !set });
  bænk.blink();
  // "Vis bølgen": Elektronen lander, når dens bølgepakke når stedet. Der tegnes én pakke ad gangen (skydes der flere,
  // mens en pakke er på vej, lander de også først, når deres egen, usynlige pakke når frem).
  if (bølgeNu()) {
    const tegnet = !bænk.pulsOptaget(); // denne elektron får den tegnede pakke (og et glimt, når den lander)
    if (tegnet) bænk.puls(v.slags === 'lys' ? lysFarve(nanometer(v.farve)) : BØLGE_SKÆR);
    påVej.push({ tid: pulsTid(z, { sprækker: v.sprækker, d: v.d }), z, y, lampe, glimt: tegnet });
    return;
  }
  påVej.push({ tid: FLYVETID, z, y, lampe, ikke: v.måler && !set });
}

// Bølgepakkerne vises for elektroner og lys uden måler (hvad en måling gør ved bølgen, er fortolkning)
const bølgeNu = () => v.bølgen && kvanteNu() && !v.måler;

// "Skyd én" (turens trin 6): Er en bølgepakke på vej, venter skuddet, til den er forbi, så hver elektron ses for sig
function skydÉn() {
  if (!aktiv) return;
  if (bølgeNu() && (bænk.pulsOptaget() || serie > 0)) serie++;
  else skud();
}

function land({ z, y, lampe, glimt = false, ikke = false }) {
  if (ringZ != null && Math.abs(z - ringZ) < RING_HALV) ringTal++;
  if (glimt) bænk.glimt(z, y);
  if (lampe >= 0) {
    bænk.lampe(lampe);
    målt[lampe]++;
  }
  if (ikke) ikkeSet++;
  sete.push(lampe >= 0);
  // Med svagt lys får prikkerne, måleren så, lampens farve, så man kan se de to mønstre hver for sig
  const egen = v.slags === 'lys' ? lysNu : FARVE[v.slags] ?? FARVE.elektroner;
  bænk.prik(z, y, lampe >= 0 && v.syn < 1 ? SET_FARVE : egen);
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
    if (gennem) bænk.prik(mål.z, mål.y, FARVE[v.slags]);
    return;
  }
  lyd.klik();
  const farve = FARVE[v.slags];
  bænk.kast({ z, y, gennem, land: mål }, (m) => { if (aktiv) bænk.prik(m.z, m.y, farve); });
}

// ---------- Hvert billede ----------
function opdater(dt, tid) {
  // Holdes knappen nede, går det hurtigere og hurtigere (kuglerne flyver, så de går langsommere)
  if (holder && v.slags !== 'boelger') {
    holdTid += dt;
    const pr = kugleSlags(v.slags) ? Math.min(14, 4 + holdTid * 2.5) : Math.min(HØJST_PR_SEK, 3 * 2 ** (holdTid / 0.75));
    rest += pr * dt;
  }
  // Programmet holder selv knappen nede, til målet er nået
  if (selvMål && bænk.antal() + påVej.length >= selvMål) {
    selvMål = 0;
    if (!fingerHolder) holder = false;
  }
  if (kø > 0) {
    const n = Math.min(kø, køFart * dt + 0.5);
    rest += n;
    kø = Math.max(0, kø - n);
  }
  let n = Math.floor(rest);
  rest -= n;
  if (kugleSlags(v.slags)) n = Math.min(n, 4);
  while (n-- > 0) skud();
  if (serie > 0 && (!bølgeNu() || !bænk.pulsOptaget())) {
    serie--;
    skud();
  }
  // Med bølgepakker lander de ikke i den rækkefølge, de blev skudt (kanten af bagvæggen er længere væk end midten)
  let landet = false;
  for (const p of påVej) {
    p.tid -= dt;
    if (p.tid <= 0) landet = true;
  }
  if (landet) {
    const nu = påVej.filter((p) => p.tid <= 0);
    påVej = påVej.filter((p) => p.tid > 0);
    for (const p of nu) land(p);
  }
  bænk.opdater(dt, tid);
  tegnSkilt();
  tegnPeg();
  tegnForklar();
  tegnVisning();
  tegnMålt();
  panelTid += dt;
  if (panelTid > 0.25) { panelTid = 0; panel(); }
}

// Skiltet øverst i midten af scenen: hvad der sendes nu, hvor mange der er landet, og i turens trin 4 tallet i den gule
// ring (før og efter lukningen). Skiltet skriver selv kun det, der er ændret.
function tegnSkilt() {
  if (!aktiv) return;
  skilt.sæt({
    ...skiltTekst(v),
    tal: tælTekst(v.slags, bænk.antal()),
    ring: ringZ == null ? null : ringTekst(ringTal, ringFør),
  });
}

// "Tryk på vandet": ringen på vandet og teksten over den, så længe bølgerne ikke er startet (rettelse 2 efter prøven)
const tPeg = new THREE.Vector3();
function tegnPeg() {
  const el = $('kvPeg');
  const vis = aktiv && v.slags === 'boelger' && !bænk.vandTændt();
  if (bænk.mærkeVist() !== vis) bænk.mærke(vis);
  if (el.hidden === vis) el.hidden = !vis;
  if (!vis) return;
  bænk.mærkeTop(tPeg).project(verden.kamera);
  const r = $('kvanteVindue').getBoundingClientRect();
  const c = verden.renderer.domElement.getBoundingClientRect();
  el.style.left = `${c.left - r.left + ((tPeg.x + 1) / 2) * c.width}px`;
  el.style.top = `${c.top - r.top + ((1 - tPeg.y) / 2) * c.height}px`;
}

// "Top møder top" midt imellem og "Top møder dal" på den første stille linje: to skilte med en prik på vandet, når
// bølgerne er nået bagvæggen (bølger i vand med begge sprækker åbne)
const tForklar = new THREE.Vector3();
function tegnForklar() {
  const vis = aktiv && v.slags === 'boelger' && v.sprækker === 'begge' && bænk.forklaret() > 0.5;
  const r = vis ? $('kvanteVindue').getBoundingClientRect() : null;
  const c = vis ? verden.renderer.domElement.getBoundingClientRect() : null;
  for (const el of document.querySelectorAll('#kvanteVindue .kv-forklar')) {
    if (el.hidden === vis) el.hidden = !vis;
    if (!vis) continue;
    const x = el.dataset.forklar === 'høj' ? 1.0 : 3.0;
    const z = el.dataset.forklar === 'høj' ? 0 : stilleSted(x, { d: v.d, λ: λ() });
    bænk.gruppe.localToWorld(tForklar.set(x, 0.37, z)).project(verden.kamera);
    el.style.left = `${c.left - r.left + ((tForklar.x + 1) / 2) * c.width}px`;
    el.style.top = `${c.top - r.top + ((1 - tForklar.y) / 2) * c.height}px`;
  }
}

// Bølge eller prik: to mærker langs den kant af bordet, der vender mod kameraet. Under vejen (væggen med sprækkerne, x = 0)
// og under bagvæggen (x = L). Teksten og ikonet skrives kun, når de ændrer sig.
const IKON = {
  bølge: '<svg viewBox="0 0 26 12"><path d="M1 6 Q4.25 0 7.5 6 T14 6 T20.5 6 T27 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  prik: '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.6" fill="currentColor"/></svg>',
  kugle: '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor"/><circle cx="4.4" cy="4.2" r="1.6" fill="#fff" opacity="0.7"/></svg>',
};
const tVis = new THREE.Vector3();
const visTegnet = {};
function tegnVisning() {
  const tekster = aktiv ? visning({ ...v, bølgen: bølgeNu() }) : null;
  const r = $('kvanteVindue').getBoundingClientRect();
  const c = verden.renderer.domElement.getBoundingClientRect();
  // Den side af bordet (z), der vender mod kameraet
  const nær = Math.sign(bænk.gruppe.worldToLocal(tVis.copy(verden.kamera.position)).z || 1) * (BAG_HALV + 0.62);
  for (const el of document.querySelectorAll('#kvanteVindue .kv-vis')) {
    const t = tekster?.[el.dataset.vis];
    if (el.hidden !== !t) el.hidden = !t;
    if (!t) continue;
    const nøgle = `${t.ikon}|${t.tekst}`;
    if (visTegnet[el.dataset.vis] !== nøgle) {
      visTegnet[el.dataset.vis] = nøgle;
      el.className = `kv-vis ${el.dataset.vis} ${t.ikon === 'bølge' ? 'bølge' : 'prik'}`;
      el.querySelector('i').innerHTML = IKON[t.ikon];
      el.querySelector('span').textContent = t.tekst;
    }
    bænk.gruppe.localToWorld(tVis.set(el.dataset.vis === 'vej' ? 0 : L, 0, nær)).project(verden.kamera);
    // Inden for scenen (på en telefon står bagvæggens mærke ellers ud over kanten)
    const halv = el.offsetWidth / 2 + 6;
    el.style.left = `${Math.min(r.width - halv, Math.max(halv, c.left - r.left + ((tVis.x + 1) / 2) * c.width))}px`;
    el.style.top = `${c.top - r.top + ((1 - tVis.y) / 2) * c.height}px`;
  }
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
  // Bølger i vand ses mere fra siden og højt oppefra, så væggen med sprækkerne ikke skjuler ringene bagved (rettelse 3)
  const vand = v.slags === 'boelger';
  const φ = THREE.MathUtils.degToRad(vand ? 58 + 25 * t : 22 + 30 * t); // vinklen mellem strålen og retningen til kameraet
  const e = THREE.MathUtils.degToRad(vand ? 60 - 6 * t : 36 - 12 * t);
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
  // Plads øverst til skiltet (js/kvante/skilt.js): Bænken står lidt lavere i billedet
  midt.addScaledVector(op, hh * 0.1);
  styring.target.copy(midt);
  const afstand = straks ? 14 : Math.max(k.position.distanceTo(midt), 6);
  k.position.copy(midt).addScaledVector(ret, afstand);
  styring.update();
  passerTilBoks(hb * 1.04, hh * 1.22);
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
  if (v.slags === 'boelger') {
    lyd.klik();
    startBølger();
    if (turTrin === 'boelger' && forløbVenter()) forløbRørt();
  }
}

// Sprække 0 er den venstre (z < 0), 1 den højre. Den sidste åbne kan ikke lukkes.
// I turen kan sprækkerne kun trykkes i trin 4, og kun én gang: Så skyder programmet lige så mange elektroner som før.
function trykSprække(i) {
  const navn = i === 0 ? 'venstre' : 'højre';
  const anden = i === 0 ? 'højre' : 'venstre';
  if (turTrin && (turTrin !== 'luk' || v.sprækker !== 'begge')) return lyd.nej();
  const før = { antal: bænk.antal() + påVej.length + kø, ring: ringTal };
  if (v.sprækker === 'begge') sætSprækker(anden);
  else if (v.sprækker === anden) sætSprækker('begge');
  else return lyd.nej();
  lyd.klik();
  if (turTrin === 'luk') lukket(før);
  return navn;
}

// ---------- Panelerne ----------
function visStyring() {
  for (const b of document.querySelectorAll('[data-kv-slags]')) {
    b.classList.toggle('valgt', b.dataset.kvSlags === v.slags);
    b.setAttribute('aria-pressed', String(b.dataset.kvSlags === v.slags));
  }
  // "Større …" er valgt, når et af de tre er, og så står de tre under "Skyd med"
  const stor = STØRRE.includes(v.slags);
  $('kvStørre').classList.toggle('valgt', stor);
  $('kvStørre').setAttribute('aria-pressed', String(stor));
  $('kvStørreValg').hidden = !stor;
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
  målerKontakt.knap.disabled = !kvanteNu();
  $('kvLys').value = String(Math.round(v.syn * 100));
  $('kvLys').disabled = !v.måler || !kvanteNu();
  bølgeKontakt.sæt(v.bølgen);
  bølgeKontakt.knap.disabled = !kvanteNu() || v.måler;
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

// ---------- Turen "Prikker bliver til striber" ----------
let turTrin = null; // trinet i turen, der kører (eller null)
let ringZ = null; // ringen om det mørke sted i trin 4 (z på bagvæggen), og hvor mange der er landet i den
let ringTal = 0;
let ringFør = null; // tallet i ringen, før sprækken blev lukket
const SKYD_MÅL = { kugler: 40, elektroner: 1000, maaler: 1000, boelgen: 3 };

function startTur() {
  if (!aktiv) return;
  lukHvorfor();
  startForløb(STRIBER, DEL);
}

// Bænken til et trin: slags, begge sprækker åbne, måleren slukket og standardmålene. Bagvæggen ryddes.
function opstil(slags, { måler = false, bølgen = false } = {}) {
  const ny = slags !== v.slags;
  Object.assign(v, { slags, sprækker: 'begge', måler, d: STANDARD.d, a: STANDARD.a, fart: STANDARD.fart, farve: STANDARD.farve, bølgen, syn: STANDARD.syn });
  forfra();
  if (ny) kamera();
}

// Et trin starter: ringen væk, og intet skydes, før trinet selv siger det
function trinStart(id) {
  turTrin = id;
  holder = fingerHolder = false;
  selvMål = 0;
  kø = 0;
  serie = 0;
  ringZ = null;
  ringFør = null;
  bænk.ring(null);
  bænk.lamperFremme(false);
}

// Programmet holder selv "Skyd" nede (det går hurtigere og hurtigere), til mål er landet
function holdSelv(mål) {
  if (!aktiv || v.slags === 'boelger') return;
  selvMål = mål;
  if (holder) return;
  holder = true;
  holdTid = 0;
  rest = 0;
  skud();
}

// Bagvæggen har ikke elektronernes striber (fx når man hopper direkte til trin 4): De skydes hurtigt frem igen
function sikrStriber(n) {
  const klar = v.slags === 'elektroner' && v.sprækker === 'begge' && !v.måler && v.d === STANDARD.d && v.a === STANDARD.a && v.fart === STANDARD.fart;
  if (klar && bænk.antal() + påVej.length >= n * 0.5) return;
  opstil('elektroner');
  kø = n;
  køFart = 500;
}

// Trin 4: En sprække er lukket, og bagvæggen er ryddet. Programmet skyder lige så mange elektroner som før (ca. 4 s).
function lukket(før) {
  ringFør = før.ring;
  kø = Math.max(200, før.antal);
  køFart = kø / 4;
  if (forløbVenter()) forløbRørt();
}

// Tælleren ved måleren: et skilt over midten af væggen, så længe måleren er tændt (lab og turens trin 5)
const tMålt = new THREE.Vector3();
let måltTegnet = '';
function tegnMålt() {
  const el = $('kvMålt');
  const vis = v.måler && kvanteNu();
  // Turens trin 5, før måleren tændes: skiltet siger, at måleren er der, men er slukket
  const t = vis ? målerTekst(målt, 0, v.syn < 1 ? ikkeSet : null) : turTrin === 'maaler' ? { linje: 'Måleren er slukket', begge: '' } : null;
  const tekst = t ? `${t.linje}|${t.begge}` : '';
  if (tekst !== måltTegnet) {
    måltTegnet = tekst;
    el.hidden = !t;
    if (t) {
      el.querySelector('span').textContent = t.linje;
      el.querySelector('strong').textContent = t.begge;
    }
  }
  if (!t) return;
  bænk.gruppe.localToWorld(tMålt.set(0, VÆG_HØJDE + 0.32, 0)).project(verden.kamera);
  const r = $('kvanteVindue').getBoundingClientRect();
  const c = verden.renderer.domElement.getBoundingClientRect();
  // Under skiltet øverst i midten, hvis væggen står så højt i billedet (fx på en telefon)
  const s = skilt.el.getBoundingClientRect();
  const under = s.height && !skilt.el.classList.contains('midt') ? s.bottom - r.top + 6 + el.offsetHeight : 0;
  el.style.left = `${c.left - r.left + ((tMålt.x + 1) / 2) * c.width}px`;
  el.style.top = `${Math.max(under, c.top - r.top + ((1 - tMålt.y) / 2) * c.height)}px`;
}

// "Skyd" i turens linje holdes nede som knappen i panelet. Linjen tegnes om efter hvert klik, så lytterne sidder på
// skærmen. Klikket fra en finger eller musen gør ingenting (trykket startede skuddene), men Enter og mellemrum (et klik
// uden finger) holder knappen nede for en, til trinets mål er nået.
let klikFraTastatur = false;
function lavTurSkyd() {
  const skærm = $('kvante');
  skærm.addEventListener('pointerdown', (h) => {
    const b = h.target.closest?.('.forløb-linje [data-knap="skyd"]');
    if (!b || b.disabled || h.button > 0) return;
    fingerHolder = true;
    trykSkyd();
  });
  skærm.addEventListener('click', (h) => {
    if (h.target.closest?.('.forløb-linje [data-knap="skyd"]')) klikFraTastatur = h.detail === 0;
  }, { capture: true });
  const slip = () => {
    if (!fingerHolder) return;
    fingerHolder = false;
    if (!selvMål) holder = false;
  };
  for (const navn of ['pointerup', 'pointercancel']) window.addEventListener(navn, slip);
}

const skydKnap = (mål) => ({
  id: 'skyd',
  tekst: 'Skyd',
  gør: () => {
    if (!klikFraTastatur) return;
    klikFraTastatur = false;
    holdSelv(mål);
  },
});

const DEL = {
  trin: {
    kugler: {
      start: () => { trinStart('kugler'); opstil('kugler'); },
      knapper: [skydKnap(SKYD_MÅL.kugler)],
      færdig: () => v.slags === 'kugler' && bænk.antal() >= SKYD_MÅL.kugler,
      visMig: () => holdSelv(SKYD_MÅL.kugler),
    },
    boelger: {
      start: () => { trinStart('boelger'); opstil('boelger'); },
      knapper: [{ id: 'boelger', tekst: 'Start bølgerne', gør: () => { lyd.klik(); startBølger(); } }],
      // Bølgerne er nået bagvæggen, og den lyser
      færdig: () => v.slags === 'boelger' && bænk.vandTændt() && bænk.vandFront() > 8,
      visMig: () => startBølger(),
    },
    elektroner: {
      start: () => { trinStart('elektroner'); opstil('elektroner'); },
      knapper: [skydKnap(SKYD_MÅL.elektroner)],
      færdig: () => v.slags === 'elektroner' && bænk.antal() >= SKYD_MÅL.elektroner,
      visMig: () => holdSelv(SKYD_MÅL.elektroner),
    },
    luk: {
      // Ringen om det første mørke sted til højre for midten. Elektronernes striber står der fra trin 3.
      start: () => {
        trinStart('luk');
        sikrStriber(SKYD_MÅL.elektroner);
        ringZ = mørktSted({ d: v.d, λ: λ() });
        ringTal = bænk.zer().filter((z) => Math.abs(z - ringZ) < RING_HALV).length;
        bænk.ring(ringZ);
      },
      færdig: () => v.sprækker !== 'begge' && ringFør != null && kø === 0 && !påVej.length,
      visMig: () => { if (v.sprækker === 'begge') trykSprække(0); },
    },
    maaler: {
      // Begge sprækker åbner af sig selv, og striberne fra trin 3 står der igen med det samme, så scenen er stille, mens man
      // gætter. Målerens lamper står fremme, men slukket (rettelse 6 efter prøven 28. november 2026: "spørgsmålet er for
      // nemt at overse").
      start: () => {
        trinStart('maaler');
        opstil('elektroner');
        for (let i = 0; i < SKYD_MÅL.elektroner; i++) skud(true);
        bænk.lamperFremme(true);
      },
      get knapper() {
        return [{ id: 'maaler', tekst: 'Tænd måleren', gør: () => tændMåler(), aktiv: () => !v.måler }];
      },
      færdig: () => v.måler && bænk.antal() >= SKYD_MÅL.maaler,
      visMig: () => tændMåler(),
    },
    boelgen: {
      // Trin 6 (22. november 2026, docs/plan-kvante-to-steder.md): Måleren slukkes, bagvæggen ryddes, og bølgen vises.
      // Hver elektron får sin bølgepakke, der går gennem begge sprækker, og så tændes én prik.
      start: () => {
        trinStart('boelgen');
        opstil('elektroner', { bølgen: true });
      },
      knapper: [{ id: 'skydEn', tekst: 'Skyd én', gør: () => { lyd.klik(); skydÉn(); } }],
      færdig: () => v.bølgen && !v.måler && bænk.antal() >= SKYD_MÅL.boelgen,
      // Skyder de manglende én ad gangen (hver venter på, at pakken foran er forbi)
      visMig: () => {
        const mangler = SKYD_MÅL.boelgen - bænk.antal() - påVej.length - serie;
        for (let i = 0; i < mangler; i++) skydÉn();
      },
    },
  },
  layout: () => kamera(),
  // Tonomura m.fl. (Hitachi, 1989): én elektron ad gangen, ca. 20 minutter (docs/erfaringer/fakta-faelder.md)
  slutTekst: () => 'I 1989 så forskere hos Hitachi de samme striber komme frem af rigtige elektroner, én ad gangen. Det tog ca. 20 minutter.',
  veje: [
    { tekst: 'Leg frit med bænken', primær: true, her: true, gør: () => requestAnimationFrame(() => kamera()) },
    { tekst: HVORFOR.kvanteToSteder.spørgsmål, hvorfor: 'kvanteToSteder' },
    { tekst: 'Er lys en bølge eller en partikel?', gør: () => { sætOrdTilOrdbog('foton'); location.hash = '#ordbog'; } },
  ],
  slut: () => {
    turTrin = null;
    ringZ = null;
    ringFør = null;
    selvMål = 0;
    bænk.ring(null);
    bænk.lamperFremme(false);
    tegnSkilt();
    tegnMålt();
    visStyring();
    panel(true);
  },
};

// Trin 5: Måleren tændes, bagvæggen ryddes, og elektronerne fortsætter, langsomt først, så hver lampe kan ses blinke
function tændMåler() {
  if (v.måler) return;
  lyd.klik();
  kø = 0;
  sætMåler(true);
  holder = false;
  holdSelv(SKYD_MÅL.maaler);
}

// ---------- Til tests (?test) ----------
export function testAdgang() {
  return {
    forløb: forløbTest(),
    startTur: () => startTur(),
    tur: () => ({ kører: kørerForløb(), trin: turTrin, ring: ringZ, her: ringTal, før: ringFør, kø, selvMål, vist: bænk.ringVist() }),
    // Skiltet øverst i midten: titlen, linjen om det ændrede, tallet og den gule ring (trin 4)
    skilt: () => skilt.læs(),
    herTekst: () => skilt.læs().ring,
    synlig: () => bænk.gruppe.visible,
    opdateres: () => verden.opdateringer.has(opdater),
    valg: () => ({ ...v, a: bredde(), λ: λ() }),
    slags: (s) => vælgSlags(s),
    vis: (s) => vis(s), // som et link (data-gaa="kvante:stor")
    større: () => ({ knap: $('kvStørre').classList.contains('valgt'), valg: !$('kvStørreValg').hidden, størst, bold: bænk.boldVist() }),
    sprækker: (s) => sætSprækker(s),
    måler: (til) => sætMåler(til),
    sæt: (nyt) => sæt(nyt),
    forfra: () => forfra(),
    trykSprække: (i) => trykSprække(i),
    // Skyder n med det samme (fast frø fra sidste ændring), så mønstret kan regnes på
    skyd(n) {
      for (let i = 0; i < n; i++) skud(true);
      bænk.opdater(0, 0);
      tegnSkilt();
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
    // Tælleren ved måleren ("Venstre: n · Højre: m" og "Begge på én gang: 0"), som den står på skærmen
    målt: () => ({ tal: [...målt], ikkeSet, tekst: $('kvMålt').hidden ? '' : $('kvMålt').textContent, lamper: bænk.t.måler }),
    // "Målerens lys": mønstret af de prikker, måleren så, og af dem, den ikke så
    delt(felter = 60) {
      const zer = bænk.zer();
      const del = (b) => { const h = histogram(zer.filter((_, i) => sete[i] === b), felter); return { antal: h.reduce((a, x) => a + x, 0), toppe: toppe(h), mørke: mørkeStriber(h) }; };
      return { set: del(true), ikke: del(false) };
    },
    lysSkyder: () => ({ værdi: Number($('kvLys').value), slået: $('kvLys').disabled }),
    // Bølgepakken ("Vis bølgen"): på vej, fronten, og elektroner, der venter på at lande eller blive skudt
    puls: () => ({ kører: bænk.pulsKører(), optaget: bænk.pulsOptaget(), front: bænk.vandFront(), påVej: påVej.length, serie }),
    skydÉn: () => skydÉn(),
    bølgeKnap: () => $('kvBølgen').click(),
    lukket: () => [...bænk.t.lukMål],
    // Bølge eller prik: de to mærker langs bordets forkant, som de står på skærmen
    visning: () => [...document.querySelectorAll('#kvanteVindue .kv-vis')].map((e) => (e.hidden ? '' : e.textContent)),
    vand: () => ({
      tændt: bænk.vandTændt(), front: bænk.vandFront(), kar: bænk.karVist(), mærke: bænk.mærkeVist(), peg: !$('kvPeg').hidden,
      forklaret: bænk.forklaret(), skilte: [...document.querySelectorAll('#kvanteVindue .kv-forklar')].filter((e) => !e.hidden).map((e) => e.textContent),
    }),
    // Skærmpunktet midt i ringen på vandet (til at trykke på vandet i testen)
    vandPunkt() {
      const p = bænk.mærkeTop(new THREE.Vector3()).project(verden.kamera);
      const r = verden.renderer.domElement.getBoundingClientRect();
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height + 4 };
    },
    panel: () => ({ titel: $('kvTitel').textContent, tekst: $('kvTekst').textContent, tal: $('kvTal').textContent }),
    tæller: () => skilt.læs().tal,
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
