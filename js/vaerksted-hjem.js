// "Grundstoffet flyver hjem" (E20 fund 8, stilguiden C2): Når et nyt grundstof er opdaget i Værkstedet, flyver et lys fra atomet
// til dets felt i det lille periodiske system. Feltet tændes med en lille lyd, og tælleren går et op, først når lyset lander.
// Det sker også under en tur: Er feltet ikke fremme (turen, foldet sammen eller rullet væk), flyver lyset til tælleren eller
// til et lille mærke øverst i scenen med feltet, navnet og tælleren. Lyset og mærket kan ikke trykkes på og tager ikke fokus,
// og de ligger oven på alt (position: fixed og absolute), så Forløb-linjen ikke flytter sig. Med ROLIG tændes feltet uden flyvning.
import * as THREE from 'three';
import { verden, ROLIG } from './scene3d.js';
import { lyd } from './lyd.js';

const FLYVETID = 950; // ms fra atomet til feltet
const MÆRKE_TID = 2800; // så længe mærket står, efter lyset er landet
const BLINK_TID = 1400; // feltets og tællerens blink (samme tid som animationerne i style.css)

const iLuften = new Set(); // grundstoffer, hvis lys er på vej (feltet og tælleren venter på dem)
const flyvninger = new Set();
let mærke = null;
let mærkeTimer = 0;
let sidste = null; // den sidste flyvning, til testene
const hjælpV = new THREE.Vector3();

export const erILuften = (nr) => iLuften.has(nr);
export const antalILuften = () => iLuften.size;

// nr, symbol, navn og farve: grundstoffet. atom: Object3D'en, lyset starter i. vindue: scenens element (mærket står i dets lag).
// opdater(): tegner felterne og tælleren igen. antal(): antallet af opdagede grundstoffer (også dem i luften).
export function flyvHjem({ nr, symbol, navn, farve, atom, vindue, opdater, antal }) {
  const f = { nr, opdater, landet: false, el: null, timer: 0, mærke: false };
  iLuften.add(nr);
  flyvninger.add(f);
  opdater();
  // Hvor skal lyset hen? Feltet, ellers tælleren over tabellen, ellers mærket i scenen
  let mål = synligPå(document.querySelector(`#minitabel .felt[data-nr="${nr}"]`));
  let slags = 'felt';
  if (!mål) { mål = synligPå(document.getElementById('opdagetTæller')); slags = 'tæller'; }
  if (!mål) {
    visMærke({ symbol, navn, farve, antal: antal() - iLuften.size, vindue });
    mål = mærke ? synligPå(mærke.querySelector('.hjem-felt')) : null;
    slags = 'mærke';
    f.mærke = Boolean(mærke);
  }
  f.antal = antal;
  const start = skærmPos(atom);
  sidste = { nr, mål: mål ? slags : null, flyver: false, landet: false };
  if (ROLIG || !mål || !start) { land(f); return; }
  sidste.flyver = true;
  flyv(f, start, { x: mål.left + mål.width / 2, y: mål.top + mål.height / 2 }, farve);
}

// Lander alle lys med det samme (når man forlader Værkstedet eller nulstiller), uden lyd, og fjerner mærket
export function stopHjem() {
  for (const f of [...flyvninger]) land(f, false);
  fjernMærke();
}

export function hjemTest() {
  return {
    iLuften: () => [...iLuften],
    sidste: () => (sidste ? { ...sidste } : null),
    mærke: () => (mærke?.isConnected ? { tekst: mærke.textContent.replace(/\s+/g, ' ').trim(), boks: kasse(mærke) } : null),
    lys: () => document.querySelectorAll('.hjem-lys').length,
  };
}

// ---------- Flyvningen ----------
function flyv(f, start, mål, farve) {
  const el = document.createElement('div');
  el.className = 'hjem-lys';
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--farve', farve);
  document.body.append(el);
  f.el = el;
  // En bue over den lige linje: Kontrolpunktet ligger over midten
  const afstand = Math.hypot(mål.x - start.x, mål.y - start.y);
  const kx = (start.x + mål.x) / 2;
  const ky = Math.min(start.y, mål.y) - Math.min(140, Math.max(40, afstand * 0.25));
  const billeder = [];
  const N = 18;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const u = t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2; // langsomt i gang, hurtigt midtvejs, blødt ind
    const x = (1 - u) ** 2 * start.x + 2 * (1 - u) * u * kx + u * u * mål.x;
    const y = (1 - u) ** 2 * start.y + 2 * (1 - u) * u * ky + u * u * mål.y;
    billeder.push({ transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${(1.8 - 1.1 * u).toFixed(3)})`, opacity: i === 0 ? 0 : 1 });
  }
  const anim = el.animate(billeder, { duration: FLYVETID, easing: 'linear', fill: 'forwards' });
  anim.onfinish = () => land(f);
  f.timer = setTimeout(() => land(f), FLYVETID + 500); // hvis animationen ikke bliver færdig (fx en skjult fane)
}

function land(f, medLyd = true) {
  if (f.landet) return;
  f.landet = true;
  clearTimeout(f.timer);
  f.el?.remove();
  flyvninger.delete(f);
  iLuften.delete(f.nr);
  f.opdater();
  if (sidste?.nr === f.nr) sidste.landet = true;
  if (!medLyd) return;
  blink(document.querySelector(`#minitabel .felt[data-nr="${f.nr}"]`), 'tændt-nu');
  blink(document.getElementById('opdagetTæller'), 'tæller-puls');
  if (f.mærke && mærke?.isConnected) {
    mærke.querySelector('.hjem-tal').textContent = f.antal() - iLuften.size;
    blink(mærke.querySelector('.hjem-felt'), 'tændt-nu');
    mærke.classList.add('tændt');
    clearTimeout(mærkeTimer);
    mærkeTimer = setTimeout(fjernMærke, MÆRKE_TID);
  }
  lyd.tændes();
}

// ---------- Mærket i scenen (når tabellen ikke er fremme) ----------
function visMærke({ symbol, navn, farve, antal, vindue }) {
  const top = vindue?.querySelector(':scope > .vindue-lag .vindue-top');
  if (!top || !synligPå(vindue)) return;
  clearTimeout(mærkeTimer);
  if (!mærke) {
    mærke = document.createElement('div');
    mærke.className = 'hjem-mærke';
    mærke.setAttribute('role', 'status');
    mærke.innerHTML = '<span class="hjem-felt"></span><span class="hjem-tekst"><b class="hjem-navn"></b><small>Opdaget: <span class="hjem-tal"></span> af 118</small></span>';
  }
  mærke.classList.remove('tændt', 'væk');
  mærke.style.setProperty('--farve', farve);
  mærke.querySelector('.hjem-felt').textContent = symbol;
  mærke.querySelector('.hjem-navn').textContent = `Nyt grundstof: ${navn}`;
  mærke.querySelector('.hjem-tal').textContent = antal;
  top.append(mærke); // sidst i rækken: til venstre for pillerne og klokken (rækken står spejlvendt)
}

function fjernMærke() {
  clearTimeout(mærkeTimer);
  if (!mærke?.isConnected) return;
  const m = mærke;
  m.classList.add('væk');
  mærkeTimer = setTimeout(() => { if (m.classList.contains('væk')) m.remove(); }, ROLIG ? 0 : 400);
}

// ---------- Hjælpere ----------
// Elementets kasse, hvis det er fremme på skærmen (ikke skjult, foldet sammen eller rullet væk), ellers null
function synligPå(el) {
  if (!el || !el.getClientRects().length) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth) return null;
  return r;
}

// Hvor på skærmen atomets midte er (lærredet fylder hele vinduet, og kameraet er forskudt til scenens hul)
function skærmPos(obj) {
  if (!obj || !verden.kamera) return null;
  obj.updateWorldMatrix(true, false);
  hjælpV.setFromMatrixPosition(obj.matrixWorld).project(verden.kamera);
  if (!Number.isFinite(hjælpV.x) || Math.abs(hjælpV.z) > 1) return null;
  return { x: ((hjælpV.x + 1) / 2) * innerWidth, y: ((1 - hjælpV.y) / 2) * innerHeight };
}

function blink(el, klasse) {
  if (!el) return;
  el.classList.remove(klasse);
  void el.offsetWidth; // starter animationen forfra
  el.classList.add(klasse);
  setTimeout(() => el.classList.remove(klasse), BLINK_TID);
}

function kasse(el) {
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.left), y: Math.round(r.top), b: Math.round(r.width), h: Math.round(r.height) };
}
