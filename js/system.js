// Det periodiske system: en buet 3D-væg med alle 118 grundstoffer.
// Med mus: hold musen over et felt for at løfte det, og klik for at se grundstoffet som et atom i 3D.
// Med fingre: første tryk løfter feltet og viser navnet, andet tryk åbner det. Træk for at flytte væggen, og knib for at zoome.

import * as THREE from 'three';
import { verden, sætVindue, passerTil, passerTilBoks, begrænsDrejning, kameraSving, LAV_KVALITET } from './scene3d.js';
import { Atom } from './atom.js';
import { GRUNDSTOFFER, grundstof, KATEGORIER, TILSTANDE, faktaOm, skaller, placering } from './data/grundstoffer.js';
import { typiskeNeutroner, stabileIsotoper, stabilitet } from './data/isotoper.js';
import { FAKTA, opdagetTekst } from './data/fakta.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked } from './beskeder.js';

const AFSTAND = 1.07; // afstand mellem felterne
const BUE = 26; // radius på væggens bue
const VÆG_HALV_BREDDE = 9.6;
const VÆG_HALV_HØJDE = 5.9;
const MAKS_RESULTATER = 6; // så mange forslag viser søgningen

let væg = null;
let felter = []; // { nr, gruppe, front, start, løft, dæmp }
let atom = null;
let aktiv = false;
let valgt = null; // nr på det valgte grundstof (detaljevisning)
let svæver = null; // nr på det felt musen er over
let forhånd = null; // nr på det felt, man har trykket på én gang med en finger (det er løftet og vist med navn)
let filter = { kategori: null, tilstand: null, opdaget: false };
let søgning = ''; // teksten i søgefeltet (små bogstaver)
let fundne = new Set(); // de grundstoffer, der passer til søgningen
let vægTilbage = 0; // 0 = væggen fremme, 1 = væggen trukket tilbage (detaljevisning)
let tilVærksted = null; // funktion, der åbner et grundstof i værkstedet
let tipVist = false;
const stråle = new THREE.Raycaster();
const mus = new THREE.Vector2();
const hjælpV = new THREE.Vector3();
let trykStart = null;
let fingre = 0; // antal fingre på skærmen lige nu
let flereFingre = false; // var der mere end én finger med i denne berøring (fx et knib)?

function $(id) {
  return document.getElementById(id);
}

export function lavSystem({ åbnIVærksted }) {
  tilVærksted = åbnIVærksted;
  væg = new THREE.Group();
  væg.visible = false;
  verden.scene.add(væg);

  const krop = new THREE.BoxGeometry(0.94, 0.94, 0.16);
  const forside = new THREE.PlaneGeometry(0.9, 0.9);
  const kropMaterialer = {};
  for (const [navn, k] of Object.entries(KATEGORIER)) {
    kropMaterialer[navn] = new THREE.MeshStandardMaterial({ color: new THREE.Color(k.farve).multiplyScalar(0.55), roughness: 0.45, metalness: 0.25 });
  }

  for (const g of GRUNDSTOFFER) {
    const { række, kolonne } = placering(g.nr);
    const x = (kolonne - 9.5) * AFSTAND;
    const y = (5.5 - række) * AFSTAND - (række >= 9 ? 0.35 : 0);
    const vinkel = x / BUE;
    const gruppe = new THREE.Group();
    gruppe.position.set(BUE * Math.sin(vinkel), y, BUE * (1 - Math.cos(vinkel)));
    gruppe.rotation.y = -vinkel;
    const kropMesh = new THREE.Mesh(krop, kropMaterialer[g.kategori]);
    // Forsiden er ubelyst, så teksten altid er let at læse. Den lyser kun op, når man peger på den.
    const frontMat = new THREE.MeshBasicMaterial({ map: lavFeltTekstur(g) });
    const front = new THREE.Mesh(forside, frontMat);
    front.position.z = 0.081;
    gruppe.add(kropMesh, front);
    gruppe.userData.nr = g.nr;
    væg.add(gruppe);
    felter.push({ nr: g.nr, gruppe, front, start: gruppe.position.clone(), løft: 0, dæmp: 0 });
  }

  atom = new Atom();
  atom.gruppe.visible = false;
  verden.scene.add(atom.gruppe);

  lavFiltre();
  lavSøgning();
  lavKnapper();
  const lærred = verden.renderer.domElement;
  lærred.addEventListener('pointermove', vedMusFlyt);
  lærred.addEventListener('pointerdown', (h) => {
    // En ny berøring begynder altid med den første finger
    if (h.isPrimary) {
      fingre = 0;
      flereFingre = false;
    }
    fingre++;
    if (fingre > 1) flereFingre = true;
    trykStart = { x: h.clientX, y: h.clientY };
  });
  lærred.addEventListener('pointerup', (h) => {
    vedKlik(h);
    fingre = Math.max(0, fingre - 1);
  });
  lærred.addEventListener('pointercancel', () => { fingre = Math.max(0, fingre - 1); });
  lærred.addEventListener('pointerleave', (h) => {
    if (h.pointerType === 'touch') return;
    svæver = null;
    skjulEtiket();
  });
}

// Forsiden af et felt: nummer, symbol og navn tegnet på et lille lærred
function lavFeltTekstur(g, opdaget = fremgang.erOpdaget(g.nr)) {
  const c = document.createElement('canvas');
  c.width = c.height = LAV_KVALITET ? 128 : 192;
  const s = c.width / 128;
  const k = c.getContext('2d');
  const farve = KATEGORIER[g.kategori].farve;
  const grad = k.createLinearGradient(0, 0, 128 * s, 128 * s);
  grad.addColorStop(0, blandFarve(farve, 0.62));
  grad.addColorStop(1, '#070b18');
  k.fillStyle = grad;
  k.fillRect(0, 0, c.width, c.height);
  k.strokeStyle = 'rgba(255,255,255,0.35)';
  k.lineWidth = 3 * s;
  k.strokeRect(1.5 * s, 1.5 * s, 125 * s, 125 * s);
  k.fillStyle = '#ffffff';
  k.font = `700 ${18 * s}px system-ui, sans-serif`;
  k.textAlign = 'left';
  k.fillText(g.nr, 9 * s, 24 * s);
  if (opdaget) {
    k.textAlign = 'right';
    k.fillStyle = '#ffd43b';
    k.fillText('★', 120 * s, 24 * s);
  }
  k.fillStyle = '#ffffff';
  k.textAlign = 'center';
  k.font = `800 ${(g.symbol.length > 1 ? 50 : 56) * s}px system-ui, sans-serif`;
  k.fillText(g.symbol, 64 * s, 80 * s);
  k.font = `600 ${(g.navn.length > 10 ? 12 : 14) * s}px system-ui, sans-serif`;
  k.fillStyle = 'rgba(255,255,255,0.85)';
  k.fillText(g.navn, 64 * s, 110 * s, 118 * s);
  const tekstur = new THREE.CanvasTexture(c);
  tekstur.colorSpace = THREE.SRGBColorSpace;
  tekstur.anisotropy = 4;
  return tekstur;
}

// Gør en farve mørkere (faktor 0–1)
function blandFarve(hex, faktor) {
  const c = new THREE.Color(hex);
  return `rgb(${Math.round(c.r * 255 * faktor)}, ${Math.round(c.g * 255 * faktor)}, ${Math.round(c.b * 255 * faktor)})`;
}

// Tegn forsiderne igen (fx når nye grundstoffer er opdaget)
function opdaterFelter() {
  for (const f of felter) {
    const g = grundstof(f.nr);
    const opdaget = fremgang.erOpdaget(f.nr);
    if (f.opdaget === opdaget) continue;
    f.opdaget = opdaget;
    f.front.material.map.dispose();
    f.front.material.map = lavFeltTekstur(g, opdaget);
    f.front.material.needsUpdate = true;
  }
  $('systemOpdaget').textContent = `★ Opdaget: ${fremgang.antalOpdaget()} af 118`;
}

export function startSystem() {
  aktiv = true;
  væg.visible = true;
  verden.opdateringer.add(opdater);
  verden.styring.autoRotate = false;
  begrænsDrejning({ vandret: 0.55, lodret: 0.4 });
  opdaterFelter();
  if (valgt) {
    visDetalje(valgt, false);
  } else {
    vægStyring(true);
    sætVindue($('systemVindue'));
    const k = verden.kamera;
    k.position.set(0, 0.6, 60);
    verden.styring.target.set(0, 0, 0);
    passerTilBoks(VÆG_HALV_BREDDE, VÆG_HALV_HØJDE);
    // Første gang på en telefon eller tablet: sådan styrer man væggen
    if (LAV_KVALITET && !tipVist) {
      tipVist = true;
      visBesked({
        titel: 'Find et grundstof',
        tekst: 'Knib for at zoome, og træk med én finger for at flytte væggen. Tryk på et felt for at se navnet, og tryk igen for at åbne det.',
        log: false,
      });
    }
  }
}

export function stopSystem() {
  aktiv = false;
  væg.visible = false;
  atom.gruppe.visible = false;
  verden.opdateringer.delete(opdater);
  begrænsDrejning(null);
  vægStyring(false);
  sætForhånd(null);
  skjulEtiket();
  lukSøgeliste();
}

// På væggen kan man flytte rundt (træk med én finger eller højre musetast) og zoome tæt på.
// Ved atomet (og i resten af AtomLab) drejer man i stedet med én finger.
function vægStyring(til) {
  const s = verden.styring;
  s.enablePan = til;
  s.screenSpacePanning = true;
  s.touches.ONE = til ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
  s.minDistance = til ? 6 : 4;
}

// Man kan ikke trække væggen helt ud af billedet, og kameraet sigter altid på selve væggen (den er buet)
function holdPåVæggen() {
  const t = verden.styring.target;
  const x = THREE.MathUtils.clamp(t.x, -VÆG_HALV_BREDDE, VÆG_HALV_BREDDE);
  hjælpV.set(x, THREE.MathUtils.clamp(t.y, -VÆG_HALV_HØJDE, VÆG_HALV_HØJDE), BUE * (1 - Math.cos(x / BUE))).sub(t);
  if (hjælpV.lengthSq() > 1e-8) {
    t.add(hjælpV);
    verden.kamera.position.add(hjælpV);
  }
}

// ---------- Mus og fingre ----------
function feltUnderMusen(h) {
  mus.set((h.clientX / innerWidth) * 2 - 1, -(h.clientY / innerHeight) * 2 + 1);
  stråle.setFromCamera(mus, verden.kamera);
  const ramt = stråle.intersectObjects(væg.children, true)[0];
  return ramt ? ramt.object.parent.userData.nr : null;
}

// Hvor på skærmen et punkt på væggen er
function skærmPunkt(v) {
  hjælpV.copy(v).applyMatrix4(væg.matrixWorld).project(verden.kamera);
  return { x: ((hjælpV.x + 1) / 2) * innerWidth, y: ((1 - hjælpV.y) / 2) * innerHeight };
}

// Afstanden på skærmen mellem to nabofelter (jern og cobalt)
function feltStørrelse() {
  const a = skærmPunkt(felter[25].start);
  const b = skærmPunkt(felter[26].start);
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// En finger er bredere end et lille felt. Derfor vælges det felt, hvis midte er nærmest fingeren.
function nærmesteFelt(x, y) {
  let bedst = null;
  let bedstAfstand = Infinity;
  for (const f of felter) {
    if (!passerFilter(f.nr)) continue;
    const s = skærmPunkt(f.start);
    const d = Math.hypot(s.x - x, s.y - y);
    if (d < bedstAfstand) {
      bedstAfstand = d;
      bedst = f.nr;
    }
  }
  return bedstAfstand < Math.max(24, feltStørrelse() * 0.8) ? bedst : null;
}

function vedMusFlyt(h) {
  if (!aktiv || valgt || h.pointerType === 'touch') return;
  const nr = feltUnderMusen(h);
  if (nr !== svæver) {
    svæver = nr;
    if (nr) lyd.klik();
  }
  if (nr) visEtiket(nr, h.clientX, h.clientY);
  else skjulEtiket();
  verden.renderer.domElement.style.cursor = nr ? 'pointer' : '';
}

function vedKlik(h) {
  if (!aktiv || valgt || !trykStart || flereFingre) return;
  const flyttet = Math.hypot(h.clientX - trykStart.x, h.clientY - trykStart.y);
  trykStart = null;
  if (flyttet > 10) return; // det var et træk, ikke et klik
  lukSøgeliste();
  if (h.pointerType !== 'touch') {
    const nr = feltUnderMusen(h);
    if (nr && passerFilter(nr)) visDetalje(nr);
    return;
  }
  // Med fingre: første tryk viser navnet, andet tryk på samme felt åbner det
  const nr = nærmesteFelt(h.clientX, h.clientY);
  if (nr && nr === forhånd) {
    visDetalje(nr);
    return;
  }
  if (nr) lyd.klik();
  sætForhånd(nr);
}

function visEtiket(nr, x, y) {
  const g = grundstof(nr);
  const etiket = $('systemEtiket');
  etiket.innerHTML = `<strong>${g.nr}. ${g.navn}</strong><span>${KATEGORIER[g.kategori].navn}</span>`;
  etiket.style.transform = `translate(${Math.min(x + 16, innerWidth - 220)}px, ${y + 16}px)`;
  etiket.classList.remove('skjult');
}

function skjulEtiket() {
  $('systemEtiket')?.classList.add('skjult');
  if (verden.renderer) verden.renderer.domElement.style.cursor = '';
}

// Det felt, man har trykket på én gang: en stor etiket over feltet, som man også kan trykke på for at åbne
function sætForhånd(nr) {
  forhånd = nr;
  const el = $('systemForhånd');
  if (!nr) {
    el.classList.add('skjult');
    return;
  }
  const g = grundstof(nr);
  el.style.setProperty('--farve', KATEGORIER[g.kategori].farve);
  el.innerHTML = `<span class="sf-symbol">${g.symbol}</span><span class="sf-tekst"><strong>${g.nr}. ${g.navn}</strong><small>${KATEGORIER[g.kategori].navn}</small></span><span class="sf-åbn">Åbn ›</span>`;
  el.setAttribute('aria-label', `${g.navn}. Tryk for at åbne`);
  el.classList.remove('skjult');
  flytForhånd();
}

function flytForhånd() {
  const el = $('systemForhånd');
  const s = skærmPunkt(felter[forhånd - 1].gruppe.position);
  const halv = feltStørrelse() * 0.62;
  const { left, top, width, height } = verden.hul;
  const b = el.offsetWidth;
  const h = el.offsetHeight;
  let y = s.y - halv - h - 6;
  if (y < top + 4) y = s.y + halv + 6; // ingen plads over feltet: vis den under
  const x = THREE.MathUtils.clamp(s.x - b / 2, left + 4, left + width - b - 4);
  y = THREE.MathUtils.clamp(y, top + 4, top + height - h - 4);
  el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

// ---------- Søgning ----------
function lavSøgning() {
  const felt = $('systemSøg');
  const liste = $('systemResultater');
  felt.addEventListener('input', () => søg(felt.value));
  felt.addEventListener('focus', () => søg(felt.value));
  felt.addEventListener('keydown', (h) => {
    if (h.key === 'Enter') {
      const første = liste.querySelector('button');
      if (første) første.click();
    }
    if (h.key === 'Escape') {
      felt.value = '';
      søg('');
      felt.blur();
    }
    h.stopPropagation(); // pilene skal ikke skifte grundstof, mens man skriver
  });
  felt.addEventListener('blur', () => setTimeout(lukSøgeliste, 150));
  // Et tryk i listen må ikke tage fokus fra feltet, før valget er sket
  liste.addEventListener('pointerdown', (h) => h.preventDefault());
}

function find(q) {
  const tal = Number(q);
  const resultater = [];
  for (const g of GRUNDSTOFFER) {
    const navn = g.navn.toLowerCase();
    const kalde = g.kaldenavn.toLowerCase();
    let point = 0;
    if (Number.isInteger(tal) && g.nr === tal) point = 100;
    else if (g.symbol.toLowerCase() === q) point = 90;
    else if (navn.startsWith(q)) point = 80;
    else if (kalde.startsWith(q)) point = 70;
    else if (navn.includes(q) || kalde.includes(q)) point = 50;
    if (point) resultater.push({ nr: g.nr, point });
  }
  return resultater.sort((a, b) => b.point - a.point || a.nr - b.nr).map((r) => r.nr);
}

function søg(tekst) {
  søgning = tekst.trim().toLowerCase();
  const nr = søgning ? find(søgning) : [];
  fundne = new Set(nr);
  const liste = $('systemResultater');
  liste.innerHTML = '';
  if (søgning) {
    for (const n of nr.slice(0, MAKS_RESULTATER)) {
      const g = grundstof(n);
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.className = 'søg-valg';
      b.style.setProperty('--farve', KATEGORIER[g.kategori].farve);
      b.innerHTML = `<span class="sf-symbol">${g.symbol}</span><span>${g.navn}${g.kaldenavn ? ` <small>(${g.kaldenavn})</small>` : ''}</span><small class="søg-nr">nr. ${g.nr}</small>`;
      b.addEventListener('click', () => {
        lyd.klik();
        $('systemSøg').value = '';
        søg('');
        $('systemSøg').blur();
        visDetalje(n);
      });
      li.append(b);
      liste.append(li);
    }
    if (!nr.length) liste.innerHTML = '<li class="søg-ingen">Ingen grundstoffer passer</li>';
  }
  liste.classList.toggle('skjult', !søgning);
  opdaterFilterKnapper();
}

function lukSøgeliste() {
  $('systemResultater')?.classList.add('skjult');
}

// ---------- Filtre ----------
function lavFiltre() {
  const holder = $('systemChips');
  const knap = (tekst, type, værdi, farve) => {
    const b = document.createElement('button');
    b.className = 'chip filter';
    b.dataset.type = type;
    b.dataset.værdi = værdi;
    b.innerHTML = (farve ? `<span class="farveprik" style="background:${farve}"></span>` : '') + tekst;
    b.addEventListener('click', () => {
      lyd.klik();
      if (type === 'opdaget') filter.opdaget = !filter.opdaget;
      else filter[type] = filter[type] === værdi ? null : værdi;
      opdaterFilterKnapper();
    });
    return b;
  };
  for (const [navn, k] of Object.entries(KATEGORIER)) holder.append(knap(k.navn, 'kategori', navn, k.farve));
  holder.append(Object.assign(document.createElement('span'), { className: 'filter-skille' }));
  for (const [kode, navn] of [['f', 'Fast stof'], ['v', 'Væske'], ['g', 'Gas']]) holder.append(knap(navn, 'tilstand', kode));
  holder.append(Object.assign(document.createElement('span'), { className: 'filter-skille' }));
  holder.append(knap('★ Opdagede', 'opdaget', 'ja'));
  // På telefoner er filtrene foldet sammen bag én knap
  $('systemFilterKnap').addEventListener('click', () => {
    lyd.klik();
    const vis = $('systemFiltre').classList.toggle('vis-filtre');
    $('systemFilterKnap').setAttribute('aria-expanded', vis);
  });
  opdaterFilterKnapper();
}

function opdaterFilterKnapper() {
  for (const b of document.querySelectorAll('#systemChips .filter')) {
    const { type, værdi } = b.dataset;
    b.classList.toggle('valgt', type === 'opdaget' ? filter.opdaget : filter[type] === værdi);
  }
  const aktive = [filter.kategori, filter.tilstand, filter.opdaget || null].filter(Boolean).length;
  $('systemFilterKnap').textContent = aktive ? `Filtre (${aktive})` : 'Filtre';
  $('systemFilterKnap').classList.toggle('valgt', aktive > 0);
  const antal = GRUNDSTOFFER.filter((g) => passerFilter(g.nr)).length;
  $('systemAntal').textContent = antal === 118 ? '' : søgning ? `${antal} passer til søgningen` : `${antal} grundstoffer passer`;
  if (forhånd && !passerFilter(forhånd)) sætForhånd(null);
}

// Mens man søger, gælder kun søgningen. Ellers gælder filtrene.
function passerFilter(nr) {
  if (søgning) return fundne.has(nr);
  const g = grundstof(nr);
  if (filter.kategori && g.kategori !== filter.kategori) return false;
  if (filter.tilstand && g.tilstand !== filter.tilstand) return false;
  if (filter.opdaget && !fremgang.erOpdaget(nr)) return false;
  return true;
}

// ---------- Detaljevisning ----------
function lavKnapper() {
  $('systemLuk').addEventListener('click', () => lukDetalje());
  $('systemForrige').addEventListener('click', () => skift(-1));
  $('systemNæste').addEventListener('click', () => skift(1));
  $('systemByg').addEventListener('click', () => {
    if (valgt) tilVærksted(valgt);
  });
  $('systemForhånd').addEventListener('click', () => {
    if (forhånd) visDetalje(forhånd);
  });
  addEventListener('keydown', (h) => {
    if (!aktiv || !valgt || document.querySelector('.overlag:not(.skjult)')) return;
    if (h.key === 'Escape') lukDetalje();
    if (h.key === 'ArrowLeft') skift(-1);
    if (h.key === 'ArrowRight') skift(1);
  });
  // Telefonens tilbage-knap (eller -gestus) lukker kortet i stedet for at forlade det periodiske system
  addEventListener('popstate', () => {
    if (aktiv && valgt) lukDetalje(true);
  });
}

function skift(retning) {
  let nr = valgt;
  for (let i = 0; i < 118; i++) {
    nr = ((nr - 1 + retning + 118) % 118) + 1;
    if (passerFilter(nr)) break;
  }
  visDetalje(nr);
}

function visDetalje(nr, medLyd = true) {
  const forrige = valgt;
  valgt = nr;
  // Et trin i historikken, så tilbage-knappen lukker kortet
  if (!forrige && !history.state?.atomlabDetalje) history.pushState({ atomlabDetalje: true }, '');
  skjulEtiket();
  sætForhånd(null);
  lukSøgeliste();
  if (medLyd) lyd.opdaget();
  $('system').classList.add('detalje');
  sætVindue($('systemVindue'));
  begrænsDrejning(null);
  vægStyring(false);
  verden.styring.autoRotate = true;
  udfyldKort(nr);
  atom.sætStraks(nr, typiskeNeutroner(nr), nr);
  atom.sætStatus(stabilitet(nr, typiskeNeutroner(nr)).status);
  atom.gruppe.visible = true;
  verden.styring.target.set(0, 0, 0);
  passerTil(atom.størrelse());
  if (!forrige) kameraSving(0.8, 1.6);
}

// fraHistorik: kaldt, fordi man trykkede tilbage (så er historikken allerede gået et trin tilbage)
function lukDetalje(fraHistorik = false) {
  if (!valgt) return;
  if (!fraHistorik && history.state?.atomlabDetalje) {
    history.back(); // popstate lukker kortet bagefter
    return;
  }
  lyd.klik();
  valgt = null;
  $('system').classList.remove('detalje');
  atom.gruppe.visible = false;
  sætVindue($('systemVindue'));
  begrænsDrejning({ vandret: 0.55, lodret: 0.4 });
  vægStyring(true);
  verden.styring.autoRotate = false;
  // Kameraet flyver tilbage foran væggen
  const k = verden.kamera;
  const afstand = k.position.distanceTo(verden.styring.target);
  verden.styring.target.set(0, 0, 0);
  k.position.set(0, 0.6, afstand);
  passerTilBoks(VÆG_HALV_BREDDE, VÆG_HALV_HØJDE);
}

function udfyldKort(nr) {
  const g = grundstof(nr);
  const kat = KATEGORIER[g.kategori];
  const f = FAKTA[g.symbol] || {};
  const pl = placering(nr);
  $('systemKort').style.setProperty('--farve', kat.farve);
  $('sysNr').textContent = g.nr;
  $('sysSymbol').textContent = g.symbol;
  $('sysMasse').textContent = Number.isInteger(g.masse) ? `[${g.masse}]` : g.masse.toLocaleString('da-DK');
  $('sysNavn').innerHTML = g.navn + (g.kaldenavn ? ` <small>(${g.kaldenavn})</small>` : '');
  $('sysUndertitel').textContent = `${kat.navn} · ${TILSTANDE[g.tilstand]}` + (pl.gruppe ? ` · Gruppe ${pl.gruppe}, periode ${pl.periode}` : ` · Periode ${pl.periode}`);
  $('sysFakta').textContent = faktaOm(nr);
  const stabile = stabileIsotoper(nr);
  const isotopTekst = stabile.length
    ? stabile.map((a) => `${g.navn.toLowerCase()}-${a}`).join(', ')
    : 'Ingen. Alle isotoper er radioaktive.';
  const rækker = [
    ['Findes', f.findes],
    ['Bruges til', f.bruges],
    ['Opdaget', opdagetTekst(g.symbol)],
    ['Navnet', f.navn],
    ['Elektronskaller', skaller(nr).join(' · ')],
    ['Stabile isotoper', isotopTekst],
  ].filter(([, v]) => v);
  $('sysTal').innerHTML = rækker.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  const opdaget = fremgang.erOpdaget(nr);
  $('sysOpdaget').textContent = opdaget ? '★ Du har opdaget det i Atomværkstedet' : 'Ikke opdaget endnu. Byg det selv i Atomværkstedet!';
  $('sysOpdaget').classList.toggle('ja', opdaget);
  $('systemByg').textContent = opdaget ? 'Åbn i værkstedet' : 'Byg det i værkstedet';
  $('systemKort').scrollTop = 0;
}

// ---------- Hvert billede ----------
function opdater(dt) {
  const blød = 1 - Math.exp(-dt * 8);
  vægTilbage += ((valgt ? 1 : 0) - vægTilbage) * (1 - Math.exp(-dt * 4));
  væg.position.z = -45 * vægTilbage;
  væg.scale.setScalar(1 - 0.3 * vægTilbage);
  væg.visible = vægTilbage < 0.85; // væggen skjules bag atomet
  for (const f of felter) {
    const mål = {
      løft: valgt ? (f.nr === valgt ? 1 : 0) : f.nr === svæver || f.nr === forhånd ? 1 : 0,
      dæmp: passerFilter(f.nr) ? 0 : 1,
    };
    f.løft += (mål.løft - f.løft) * blød;
    f.dæmp += (mål.dæmp - f.dæmp) * blød;
    // Feltet løftes ud mod en (langs sin egen retning) og bliver lidt større
    const ud = 0.7 * f.løft - 0.5 * f.dæmp;
    f.gruppe.position.set(
      f.start.x + Math.sin(f.gruppe.rotation.y) * ud,
      f.start.y,
      f.start.z + Math.cos(f.gruppe.rotation.y) * ud,
    );
    f.gruppe.scale.setScalar(1 + 0.15 * f.løft - 0.12 * f.dæmp);
    f.front.material.color.setScalar((0.8 + 0.5 * f.løft) * (1 - 0.8 * f.dæmp));
  }
  if (!valgt) holdPåVæggen();
  if (forhånd && !valgt) flytForhånd();
  if (atom.gruppe.visible) atom.opdater(dt);
}

// Kun til automatiske tests
export function testAdgang() {
  return {
    // Hvor på skærmen et felt er, og hvor stort det er
    felt: (nr) => ({ ...skærmPunkt(felter[nr - 1].start), str: feltStørrelse() }),
    forhånd: () => forhånd,
    glemForhånd: () => sætForhånd(null),
    valgt: () => valgt,
    styring: () => ({ pan: verden.styring.enablePan, én: verden.styring.touches.ONE, mål: verden.styring.target.toArray().map((v) => Math.round(v * 100) / 100) }),
    flyt: (x, y) => { verden.styring.target.x += x; verden.styring.target.y += y; verden.kamera.position.x += x; verden.kamera.position.y += y; },
    søg: (tekst) => { $('systemSøg').value = tekst; søg(tekst); return [...$('systemResultater').querySelectorAll('.søg-valg')].map((b) => b.textContent); },
  };
}
