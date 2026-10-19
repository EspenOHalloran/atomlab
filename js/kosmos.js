// Kosmos: animationer af vilde fænomener i rummet (sorte huller, supernovaer, tyngdebølger ...).
// Hvert fænomen ligger i sin egen fil i js/kosmos/ og har samme opbygning (se fx rumtid.js):
// { id, navn, ikon, undertitel, citat, kamera, tal, kort, nørd, lav(gruppe, ctx) → { styring, opdater(dt, tid), stop() } }

import * as THREE from 'three';
import { verden, sætVindue, passerTil, ROLIG } from './scene3d.js';
import { Effekter } from './effekter.js';
import { lyd } from './lyd.js';
import { citatHTML } from './data/citater.js';
import { visBesked, skjulUndertekst } from './beskeder.js';
import { ryd, stjerneUr } from './kosmos/faelles.js';
import { lavPause } from './pause.js';
import bigbang from './kosmos/bigbang.js';
import stjernefoedsel from './kosmos/stjernefoedsel.js';
import aarstider from './kosmos/aarstider.js';
import solstorm from './kosmos/solstorm.js';
import solensfremtid from './kosmos/solensfremtid.js';
import hviddvaerg from './kosmos/hviddvaerg.js';
import supernova from './kosmos/supernova.js';
import pulsar from './kosmos/pulsar.js';
import kilonova from './kosmos/kilonova.js';
import rumtid from './kosmos/rumtid.js';
import tyngdebolger from './kosmos/tyngdebolger.js';
import sorthul from './kosmos/sorthul.js';
import kvasar from './kosmos/kvasar.js';
import ormehul from './kosmos/ormehul.js';

// Rækkefølgen fortæller en historie: fra Big Bang og vores egen Sol, over stjerner der dør, til sorte huller og ormehuller
export const FÆNOMENER = [bigbang, stjernefoedsel, aarstider, solstorm, solensfremtid, hviddvaerg, supernova, pulsar, kilonova, rumtid, tyngdebolger, sorthul, kvasar, ormehul];

const NØGLE = 'atomlabKosmos'; // det sidst valgte fænomen
const NØGLE_SET = 'atomlabKosmosSet'; // de fænomener, man har kigget på
let set = new Set();

let rod = null;
let gruppe = null;
let effekter = null;
let aktiv = false;
let valgt = null;
let kørende = null; // det, fænomenets lav() gav tilbage
let fane = 'kort';
let tjekTid = 0;
let pause = null; // pausen (pause.til er true, mens tiden står stille)
let kosmosTid = 0; // Kosmos' eget ur, som står stille under pause
let forklaringVist = ''; // teksten i panelet lige nu (fra fænomenets forklaring())

function $(id) {
  return document.getElementById(id);
}

export function lavKosmos() {
  rod = new THREE.Group();
  rod.visible = false;
  verden.scene.add(rod);
  gruppe = new THREE.Group();
  rod.add(gruppe);
  effekter = new Effekter(rod);

  const liste = $('kosmosListe');
  for (const f of FÆNOMENER) {
    const b = document.createElement('button');
    b.className = 'kosmos-valg';
    b.dataset.id = f.id;
    b.title = f.undertitel;
    b.innerHTML = `<span class="kosmos-valg-ikon">${f.ikon}</span><span class="kosmos-valg-navn">${f.navn}</span>`;
    b.addEventListener('click', () => {
      if (valgt === f) return;
      lyd.klik();
      vælg(f.id);
    });
    liste.append(b);
  }
  for (const b of document.querySelectorAll('[data-kosmos-fane]')) {
    b.addEventListener('click', () => {
      fane = b.dataset.kosmosFane;
      lyd.klik();
      visTekst();
    });
  }
  $('kosmosHjælp').addEventListener('click', () => { lyd.klik(); $('hjælpKosmos').classList.remove('skjult'); });
  pause = lavPause({ knap: $('kosmosPause'), vindue: $('kosmosVindue'), aktiv: () => aktiv });
}

export function startKosmos() {
  aktiv = true;
  rod.visible = true;
  verden.opdateringer.add(opdater);
  sætVindue($('kosmosVindue'));
  let id = null;
  try {
    id = localStorage.getItem(NØGLE);
    set = new Set(JSON.parse(localStorage.getItem(NØGLE_SET) || '[]')); // læses igen, hvis fremgangen er nulstillet
  } catch {
    // ingen lagring
  }
  vælg(id);
}

export function stopKosmos() {
  aktiv = false;
  rod.visible = false;
  verden.opdateringer.delete(opdater);
  pause.sæt(false);
  luk();
  stjerneUr.tid = null;
  verden.styring.target.set(0, 0, 0);
  verden.styring.autoRotate = true;
  verden.styring.autoRotateSpeed = 0.5;
}

// Rydder det nuværende fænomen helt væk (så det ikke bruger grafikkortet, når man er et andet sted)
function luk() {
  kameraTur = null;
  kørende?.stop?.();
  kørende = null;
  effekter.opdater(1e6); // alle effekter bliver færdige med det samme
  ryd(gruppe);
  $('kosmosOverlag').innerHTML = '';
  $('kosmosToplag').innerHTML = '';
  valgt = null;
}

function vælg(id) {
  const f = FÆNOMENER.find((x) => x.id === id) ?? FÆNOMENER[0];
  pause.sæt(false);
  luk();
  valgt = f;
  set.add(f.id);
  try {
    localStorage.setItem(NØGLE, f.id);
    localStorage.setItem(NØGLE_SET, JSON.stringify([...set]));
  } catch {
    // ingen lagring
  }
  visFase(null);
  $('kosmosForklaring').innerHTML = '';
  forklaringVist = '';
  $('kosmosOverlag').innerHTML = '';
  $('kosmosToplag').innerHTML = '';
  kørende = f.lav(gruppe, {
    effekter,
    lyd,
    verden,
    fase: visFase,
    kamera: stilKamera,
    opdaterKnapper: lavStyring,
    // Skrives kun om, når teksten ændrer sig (ellers forsvinder ordforklaringerne hver gang)
    forklaring: (html) => {
      if (html === forklaringVist) return;
      forklaringVist = html;
      $('kosmosForklaring').innerHTML = html;
    },
    // Et sted oven på 3D-billedet, hvor fænomenet kan vise fx en graf
    overlag: () => $('kosmosOverlag'),
    // Et sted øverst til venstre i 3D-billedet (fx en lille tabel)
    toplag: () => $('kosmosToplag'),
  });
  for (const b of document.querySelectorAll('.kosmos-valg')) {
    b.classList.toggle('valgt', b.dataset.id === f.id);
    b.classList.toggle('ny', !set.has(b.dataset.id));
  }
  // Er listen en vandret række (på telefoner), rulles det valgte fænomen frem
  const liste = $('kosmosListe');
  if (liste.scrollWidth > liste.clientWidth + 4) {
    const b = liste.querySelector('.valgt').getBoundingClientRect();
    const l = liste.getBoundingClientRect();
    liste.scrollTo({ left: liste.scrollLeft + (b.left - l.left) - (l.width - b.width) / 2, behavior: ROLIG ? 'auto' : 'smooth' });
  }
  $('kosmosSet').textContent = set.size < FÆNOMENER.length ? `${set.size} af ${FÆNOMENER.length} set` : 'Alle set ★';
  $('kosmosIkon').textContent = f.ikon;
  $('kosmosNavn').textContent = f.navn;
  $('kosmosUndertitel').textContent = f.undertitel;
  $('kosmosTal').innerHTML = (f.tal ?? []).map(([navn, værdi]) => `<div><dt>${navn}</dt><dd>${værdi}</dd></div>`).join('');
  $('kosmosCitat').innerHTML = f.citat ? citatHTML(f.citat) : '';
  $('kosmosCitat').hidden = !f.citat;
  visTekst();
  lavStyring();
  stilKamera(f.kamera);
}

function visTekst() {
  for (const b of document.querySelectorAll('[data-kosmos-fane]')) b.classList.toggle('valgt', b.dataset.kosmosFane === fane);
  $('kosmosTekst').innerHTML = valgt ? valgt[fane] : '';
  $('kosmosTekst').scrollTop = 0;
}

// En undertekst nederst i 3D-billedet, der fortæller, hvad der sker lige nu (fx "Jernkernen falder sammen").
// Den bliver stående, til den næste fase kommer. trin = [nr, ialt] viser prikker. titel = null fjerner den.
function visFase(titel, tekst = '', trin = null) {
  if (!titel) {
    skjulUndertekst('fase');
    return;
  }
  visBesked({ titel, tekst, type: 'fase', varighed: 0, trin, log: false });
}

// Kameraet: retning (hvorfra vi kigger), radius (hvor stort det, vi skal se, er) og mål (midten).
// flyv: true = kameraet flyver ind langt udefra. false = det glider blødt fra, hvor det er nu.
let kameraTur = null;
function stilKamera({ retning, radius = 16, mål = [0, 0, 0], drej = true, flyv = true } = {}) {
  const s = verden.styring;
  const k = verden.kamera;
  s.autoRotate = drej;
  s.autoRotateSpeed = 0.35;
  const nu = k.position.clone().sub(s.target);
  if (flyv) {
    s.target.set(...mål);
    k.position.copy(s.target).addScaledVector(new THREE.Vector3(...(retning ?? [0, 0.4, 1])).normalize(), radius * 7);
    kameraTur = null;
    passerTil(radius);
    return;
  }
  passerTil(radius);
  kameraTur = {
    t: 0,
    fraMål: s.target.clone(),
    tilMål: new THREE.Vector3(...mål),
    fraRetning: nu.clone().normalize(),
    tilRetning: retning ? new THREE.Vector3(...retning).normalize() : nu.clone().normalize(),
    fraAfstand: nu.length(),
    tilAfstand: verden.målAfstand ?? nu.length(),
  };
  verden.målAfstand = null; // vi styrer selv afstanden under turen
}

function kørKameraTur(dt) {
  if (!kameraTur) return;
  const tur = kameraTur;
  tur.t = ROLIG ? 1 : Math.min(1, tur.t + dt / 1.3); // "reducer bevægelse": hop straks på plads
  const e = tur.t * tur.t * (3 - 2 * tur.t); // blød start og slutning
  const s = verden.styring;
  s.target.lerpVectors(tur.fraMål, tur.tilMål, e);
  const retning = tur.fraRetning.clone().lerp(tur.tilRetning, e).normalize();
  verden.kamera.position.copy(s.target).addScaledVector(retning, tur.fraAfstand + (tur.tilAfstand - tur.fraAfstand) * e);
  if (tur.t >= 1) kameraTur = null;
}

// Knapperne under "Prøv selv". Et punkt kan være en knap, en til/fra-knap eller en skyder.
function lavStyring() {
  const boks = $('kosmosStyring');
  boks.innerHTML = '';
  for (const s of kørende?.styring ?? []) {
    if (s.skyder) {
      const div = document.createElement('label');
      div.className = 'skyder-boks';
      div.innerHTML = `<span class="skyder-top"><span></span><strong></strong></span><input type="range">`;
      div.querySelector('.skyder-top span').textContent = s.navn;
      const vis = div.querySelector('strong');
      const input = div.querySelector('input');
      Object.assign(input, { min: s.min, max: s.max, step: s.trin ?? 1, value: s.værdi });
      vis.textContent = s.vis ? s.vis(s.værdi) : s.værdi;
      input.addEventListener('input', () => {
        s.værdi = Number(input.value);
        vis.textContent = s.vis ? s.vis(s.værdi) : s.værdi;
        s.ændring(s.værdi);
      });
      boks.append(div);
      continue;
    }
    const b = document.createElement('button');
    b.textContent = s.tekst;
    if (s.til !== undefined) {
      b.className = 'chip filter kosmos-til';
      b.classList.toggle('valgt', s.til);
      b.addEventListener('click', () => {
        s.til = !s.til;
        b.classList.toggle('valgt', s.til);
        lyd.klik();
        s.skift(s.til);
      });
    } else {
      b.className = 'knap lille kosmos-knap';
      b.addEventListener('click', () => {
        if (b.disabled) return;
        lyd.klik();
        pause.sæt(false); // en handling (fx "Lad stjernen eksplodere") skal kunne ses
        s.handling();
        tjekKnapper();
      });
    }
    s.knap = b;
    boks.append(b);
  }
  tjekKnapper();
}

// Nogle knapper kan ikke bruges hele tiden (fx "Eksplodér", når stjernen allerede er eksploderet)
function tjekKnapper() {
  for (const s of kørende?.styring ?? []) {
    if (s.knap && s.deaktiv) s.knap.disabled = s.deaktiv();
  }
}

function opdater(dt) {
  if (!aktiv || !kørende) return;
  kørKameraTur(dt); // kameraet kan stadig flyve under pause
  if (!pause.til) {
    kosmosTid += dt;
    stjerneUr.tid = kosmosTid; // stjernernes overflade står også stille under pause
    kørende.opdater(dt, kosmosTid);
    effekter.opdater(dt);
  }
  tjekTid += dt;
  if (tjekTid > 0.25) {
    tjekTid = 0;
    tjekKnapper();
  }
}

// Adgang for automatiske tests
export function testAdgang() {
  return {
    fænomener: FÆNOMENER.map((f) => f.id),
    vælg: (id) => vælg(id),
    valgt: () => valgt?.id,
    knapper: () => (kørende?.styring ?? []).map((s) => s.tekst ?? s.navn),
    tryk: (i) => {
      const s = kørende.styring[i];
      if (s.handling) s.handling();
      else if (s.skift) { s.til = !s.til; s.skift(s.til); }
      lavStyring();
    },
    pause: () => pause.til,
    tid: () => kosmosTid,
    stjerneTid: () => stjerneUr.tid,
    antalObjekter: () => { let n = 0; gruppe.traverse(() => n++); return n; },
    // Spoler tiden frem (testbrowseren tegner kun få billeder i sekundet)
    spol: (sekunder) => {
      for (let t = 0; t < sekunder; t += 0.05) opdater(0.05);
    },
    // Kameraet springer straks derhen, hvor det er på vej hen
    kameraFrem: () => {
      kørKameraTur(10);
      const { kamera, styring, målAfstand } = verden;
      const retning = kamera.position.clone().sub(styring.target);
      if (målAfstand != null) kamera.position.copy(styring.target).add(retning.setLength(målAfstand));
      verden.målAfstand = null;
    },
  };
}
