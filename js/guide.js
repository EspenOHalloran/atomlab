// Kom i gang-guide: korte trin med en lysende ring om det, man skal kigge på eller trykke på.
// startGuide(id, trin) viser trinene første gang (bagefter kun, hvis man beder om det).
// Et trin: { mål, titel, tekst, knap, vent, start }
//   mål: en CSS-vælger, eller en funktion, der giver { x, y, r } på skærmen (fx en kerne i 3D). Uden mål står boblen øverst i 3D-billedet.
//   knap: teksten på knappen (fx 'Næste'). Uden knap går guiden videre, når vent() giver true (tjekkes hvert billede).
//   start: kaldes, når trinet begynder (fx for at vælge, hvilken kerne ringen skal sidde om).
// Mens guiden kører, venter belønningspillerne (holdPiller), så der ikke sker for meget på én gang.

import { lyd } from './lyd.js';
import { holdPiller } from './beskeder.js';

const NØGLE = 'atomlabGuide';
let kører = null; // { id, trin, nr, ventet }
let ring = null;
let boble = null;
let løkkeNr = 0; // så der kun kører én løkke ad gangen

function hentSet() {
  try {
    return JSON.parse(localStorage.getItem(NØGLE)) || {};
  } catch {
    return {};
  }
}

export function harSetGuide(id) {
  return Boolean(hentSet()[id]);
}

// Husk, at man har set noget, der kun skal vises første gang (fx rejsen ind i Solen)
export function markérSet(id) {
  gemSet(id);
}

function gemSet(id) {
  const set = hentSet();
  set[id] = Date.now();
  try {
    localStorage.setItem(NØGLE, JSON.stringify(set));
  } catch {
    // ingen lagring
  }
}

// Viser guiden. Har man set den før, sker der intet, medmindre igen er true.
export function startGuide(id, trin, { igen = false } = {}) {
  if (!igen && harSetGuide(id)) return false;
  stopGuide();
  lavElementer();
  holdPiller(true);
  kører = { id, trin, nr: -1 };
  næsteTrin();
  const nr = ++løkkeNr;
  requestAnimationFrame(() => løkke(nr));
  return true;
}

// Stopper guiden. gem = husk, at man har set den.
export function stopGuide(gem = false) {
  if (!kører) return;
  if (gem) gemSet(kører.id);
  kører = null;
  ring?.classList.add('skjult');
  boble?.classList.add('skjult');
  holdPiller(false);
}

export function guideKører(id) {
  return kører?.id === id;
}

function lavElementer() {
  if (ring) return;
  ring = document.createElement('div');
  ring.className = 'guide-ring skjult';
  boble = document.createElement('div');
  boble.className = 'guide-boble skjult';
  boble.setAttribute('role', 'dialog');
  boble.innerHTML = '<div class="guide-trin"></div><strong class="guide-titel"></strong><p class="guide-tekst"></p><div class="guide-knapper"><button class="knap lille svag guide-spring">Spring over</button><button class="knap lille guide-næste"></button></div>';
  document.body.append(ring, boble);
  // Esc springer guiden over
  addEventListener('keydown', (h) => {
    if (h.key === 'Escape' && kører && !document.querySelector('.overlag:not(.skjult)')) stopGuide(true);
  }, true);
  boble.querySelector('.guide-spring').addEventListener('click', () => {
    lyd.klik();
    stopGuide(true);
  });
  boble.querySelector('.guide-næste').addEventListener('click', () => {
    lyd.klik();
    næsteTrin();
  });
}

function næsteTrin() {
  if (!kører) return;
  kører.nr++;
  const t = kører.trin[kører.nr];
  if (!t) {
    stopGuide(true);
    return;
  }
  kører.ventet = 0;
  const sidste = kører.nr === kører.trin.length - 1;
  boble.querySelector('.guide-trin').innerHTML = kører.trin.map((_, i) => `<i class="${i <= kører.nr ? 'ja' : ''}"></i>`).join('');
  boble.querySelector('.guide-titel').textContent = t.titel;
  boble.querySelector('.guide-tekst').textContent = t.tekst;
  const næste = boble.querySelector('.guide-næste');
  næste.hidden = !t.knap;
  næste.textContent = t.knap ?? '';
  boble.querySelector('.guide-spring').textContent = sidste ? 'Luk' : 'Spring over';
  boble.querySelector('.guide-spring').hidden = sidste && Boolean(t.knap);
  boble.classList.remove('skjult');
  boble.classList.remove('vist');
  requestAnimationFrame(() => boble.classList.add('vist'));
  // Er målet rullet ud af syne (fx på en telefon), rulles det frem
  if (typeof t.mål === 'string') document.querySelector(t.mål)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  t.start?.();
}

// Hvor er målet på skærmen? Giver et rektangel eller null.
function målRekt(t) {
  if (!t.mål) return null;
  if (typeof t.mål === 'function') {
    const p = t.mål();
    if (!p) return null;
    return { left: p.x - p.r, top: p.y - p.r, width: 2 * p.r, height: 2 * p.r, rund: true };
  }
  const el = document.querySelector(t.mål);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  return { left: r.left - 6, top: r.top - 6, width: r.width + 12, height: r.height + 12 };
}

function løkke(nr) {
  if (!kører || nr !== løkkeNr) return;
  const t = kører.trin[kører.nr];
  if (t.vent && t.vent()) {
    kører.ventet += 1;
    // Et øjeblik, så man når at se, hvad der skete
    const k = kører;
    const trinNr = k.nr;
    if (k.ventet === 1) setTimeout(() => { if (kører === k && k.nr === trinNr) næsteTrin(); }, 500);
  }
  const r = målRekt(t);
  ring.classList.toggle('skjult', !r);
  ring.classList.toggle('rund', Boolean(r?.rund));
  if (r) {
    ring.style.transform = `translate(${Math.round(r.left)}px, ${Math.round(r.top)}px)`;
    ring.style.width = `${Math.round(r.width)}px`;
    ring.style.height = `${Math.round(r.height)}px`;
  }
  placerBoble(r);
  requestAnimationFrame(() => løkke(nr));
}

// Boblen står under eller over målet (der hvor der er mest plads), men altid inde på skærmen
function placerBoble(r) {
  const b = boble.offsetWidth;
  const h = boble.offsetHeight;
  let x, y;
  if (!r) {
    const v = document.querySelector('.skærm:not(.skjult) > .vindue')?.getBoundingClientRect();
    x = v ? v.left + v.width / 2 - b / 2 : innerWidth / 2 - b / 2;
    y = v ? Math.max(v.top + 12, v.top + v.height * 0.12) : 80;
  } else {
    x = r.left + r.width / 2 - b / 2;
    const under = innerHeight - (r.top + r.height);
    y = under >= h + 16 || under > r.top ? r.top + r.height + 10 : r.top - h - 10;
  }
  x = Math.min(Math.max(8, x), innerWidth - b - 8);
  y = Math.min(Math.max(8, y), innerHeight - h - 8);
  boble.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}
