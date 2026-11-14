// Skinnen i Gåderne (G4b, docs/plan-gaader-3d.md, "Oversigten: Frontlinjen"): de byggede gåder står langs en svag,
// glødende sti fra det mindste til det største, og én gåde er i fokus ad gangen. Man trækker, trykker på et lys eller
// bruger "‹ mindre · større ›" (og piletasterne), og kameraet glider til næste gåde. Ingen fri drejning her.
// Stien er en bue af en cirkel, så den kan lukkes til en ring, når der er mange gåder (LUKKES_VED). Lysene kommer fra
// js/gaader/lys.js, rækkefølgen fra påSkinnen() i js/data/gaader.js, og koden bruger ingen pladsnumre.
// js/gaader.js henter filen med import() og laver teksten og knapperne under lyset (påFokus).
//
// Flyvningen: Kameraets afstand til gåden i fokus styres af zoom (0 = på skinnen, 1 = tæt foran, første gang, 2 = helt
// inde i lyset). En tur er en række trin (zoom, glid, toning og et kald til sidst), som et tryk eller en tast springer
// over. Toningen er et mørkt lag over 3D-billedet (#gaaderToning), så skiftet til kortets scene ikke ses. Med ROLIG
// er der ingen flyvning, kun toningen.
// Første gang står kun det første lys tændt, tæt foran. Når man flyver ud igen, tændes de andre ét efter ét.
// (Kommer man første gang ind i et andet kort via en knap et andet sted, tændes de ud fra det kort.)

import * as THREE from 'three';
import { verden, ROLIG, stopKamera } from '../scene3d.js';
import { glød, skilt, ryd } from '../kosmos/faelles.js';
import { fuld } from './streg.js';
import { lavLys } from './lys.js';

const R = 30; // stiens radius: en svag bue, så naboerne glider lidt bagud, og de fjerne er uden for billedet
const SKRIDT = 0.27; // vinklen mellem to gåder på stien (radianer), ca. 8 enheder
const LUKKES_VED = 8; // fra så mange gåder bliver stien en lukket ring
const SKALA = 0.62; // lysene er bygget til at stå stort bag et kort, på stien er de mindre (mindst, se lysSkala)
const LYS_R = 3; // lysenes radius, som de er bygget i lys.js (ca.)
const FOKUS = 0.22; // gåden i fokus er så meget større end naboerne
const STI_Y = -2; // stien ligger under lysene
const HØJDE = 2.4; // kameraet står lidt over stien og ser ned langs den
const PLADS_NEDERST = 170; // punkter nederst i billedet til spørgsmålet og knapperne
const ENDE = 2; // lys uden navn i hver ende ("Flere gåder er på vej")
// Flyvningen (sekunder)
export const TID_IND = 1.3;
export const TID_UD = 1.4;
const TID_TONING = 0.22;
const TÆND_HVER = 0.4; // første gang: et nyt lys tændes så ofte
const TÆND_VARER = 0.6;

let gruppe = null;
let lys = []; // { id, holder, indre, lys, navn, ring }
let ekstra = []; // stien og lysene i enderne (tones ind, når skinnen tændes første gang)
const navne = []; // skiltene, som bliver større, når kameraet står langt væk
let række = []; // id'erne i rækkefølge
let lukket = false;
let skridt = SKRIDT;
let pos = 0; // hvor kameraet står (et kommatal, mens det glider)
let mål = 0; // gåden i fokus (et helt tal)
let zoom = 0; // 0 = skinnen, 1 = tæt foran (første gang), 2 = inde i lyset
let toning = 0; // 0 = intet, 1 = sort
let tur = []; // trinene i en flyvning
let turTid = 0;
let første = false; // kun det første lys er tændt
let tændTid = -1; // første gang: tiden, siden lysene begyndte at tænde (-1 = alle tændt)
let skala = SKALA;
let navneSkala = 1;
let aktiv = false;
let lyttere = false;
let påFokus = null; // kaldes med id'et, når en ny gåde kommer i fokus
let påVælg = null; // kaldes med id'et, når man trykker på gåden i fokus
let sidstFokus = null;
let træk = null;

const v = new THREE.Vector3();
const mid = new THREE.Vector3();
const blød = (f) => f * f * (3 - 2 * f);
const $ = (id) => document.getElementById(id);

const vinkel = (i) => i * skridt;
function punkt(i, ud, y = 0) {
  const a = vinkel(i);
  return ud.set(Math.sin(a) * R, y, Math.cos(a) * R);
}

// ---------- Opbygningen ----------
function byg(gåder) {
  gruppe = new THREE.Group();
  navne.length = 0;
  ekstra = [];
  skala = SKALA;
  navneSkala = 1;
  verden.scene.add(gruppe);
  række = gåder.map((g) => g.id);
  const n = række.length;
  lukket = n >= LUKKES_VED;
  skridt = lukket ? (Math.PI * 2) / n : SKRIDT;

  // Stien: en svag, glødende streg, der toner ud i begge ender (eller en ring)
  const fra = lukket ? 0 : -ENDE - 0.6;
  const til = lukket ? n : n - 1 + ENDE + 0.6;
  const punkter = [];
  const styrke = [];
  const DELE = 14;
  for (let k = 0; k <= Math.round((til - fra) * DELE); k++) {
    const i = fra + k / DELE;
    punkt(i, v, STI_Y);
    punkter.push([v.x, v.y, v.z]);
    const ude = lukket ? 0 : Math.max(0, -i, i - (n - 1));
    styrke.push(Math.max(0, 1 - ude / (ENDE + 0.6)) ** 1.5);
  }
  const sti = fuld(punkter, new THREE.Color(0.32, 0.5, 0.85), { bredde: 2.5, lys: styrke });
  // Ikke additiv: Ellers lyser stregen op, hvor to stykker mødes (prikker langs stien med gløden)
  sti.material.blending = THREE.NormalBlending;
  gruppe.add(sti);
  ekstra.push(sti);

  // Lysene
  lys = gåder.map((g, i) => {
    const holder = new THREE.Group();
    punkt(i, holder.position);
    holder.rotation.y = vinkel(i); // lyset vender ud mod kameraet
    const l = lavLys(g.id);
    const indre = new THREE.Group();
    indre.scale.setScalar(SKALA);
    if (l) indre.add(l.gruppe);
    holder.add(indre);
    // En lille sten på stien under lyset
    const sten = glød(new THREE.Color(0.45, 0.7, 1.2), 0.6, 0.5);
    sten.position.y = STI_Y;
    holder.add(sten);
    const navn = skilt(g.navn ?? g.id, '#d8ecff', 0.62);
    navn.position.y = STI_Y - 0.75;
    holder.add(navn);
    navne.push(navn);
    // En færdig gåde (✓) har en rolig ring om lyset
    const ring = new THREE.Mesh(new THREE.RingGeometry(3.3, 3.42, 72), new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.37, 0.89, 1), transparent: true, opacity: 0.55, depthWrite: false,
    }));
    ring.visible = false;
    indre.add(ring);
    gruppe.add(holder);
    return { id: g.id, holder, indre, lys: l, navn, ring };
  });

  // I begge ender svage lys uden navn og linjen "Flere gåder er på vej"
  if (!lukket) {
    for (const [i, side] of [[-1, -1], [n, 1]]) {
      for (let k = 0; k < ENDE; k++) {
        const g = glød(new THREE.Color(0.8, 0.85, 1), 1.3 - k * 0.3, 0.32 - k * 0.14);
        punkt(i + side * k, g.position);
        gruppe.add(g);
        ekstra.push(g);
      }
      const tekst = skilt('Flere gåder er på vej', '#9fb4d8', 0.6);
      punkt(i, tekst.position, STI_Y - 0.75);
      tekst.material.opacity = 0.8;
      gruppe.add(tekst);
      navne.push(tekst);
      ekstra.push(tekst);
    }
  }
  for (const n of navne) n.userData.skala = n.scale.clone();
  for (const e of ekstra) e.userData.opacitet = e.material.opacity;
}

// ---------- Kameraet ----------
const ty = () => (Math.tan(THREE.MathUtils.degToRad(20)) * verden.hul.height) / innerHeight;

// Afstanden på skinnen regnes ud fra hullet: Naboerne og deres navne skal kunne ses i siderne, og gåden i fokus står
// over spørgsmålet nederst.
function skinneAfstand() {
  const { hul } = verden;
  const tx = (Math.tan(THREE.MathUtils.degToRad(20)) * hul.width) / innerHeight;
  const L = R * Math.sin(SKRIDT);
  const D = R * (1 - Math.cos(SKRIDT));
  const k = hul.width > hul.height ? 0.8 : 0.75;
  const iBredden = L / (k * tx) - D;
  const iHøjden = (LYS_R * SKALA + 0.8) / (0.5 * ty()); // lyset og navnet fylder højst ca. halvdelen af den halve højde
  return THREE.MathUtils.clamp(Math.max(iBredden, iHøjden), 10, 55);
}

// På højkant står kameraet længere væk (naboerne skal kunne ses i siderne), så lysene bliver større, men aldrig så store,
// at de rører hinanden (højst ca. 0,4 af afstanden mellem dem)
function lysSkala(d) {
  const ønsket = (0.3 * d * ty()) / LYS_R; // lyset fylder ca. 30 % af den halve højde
  return THREE.MathUtils.clamp(ønsket, SKALA, (0.4 * 2 * R * Math.sin(SKRIDT / 2)) / LYS_R);
}

// Kameraets afstand til lyset ved en zoom: på skinnen, tæt foran (lyset fylder det meste af den frie højde) og
// inde i lyset. Imellem glider afstanden jævnt (i log).
function afstandVed(z, dSkinne) {
  const r = LYS_R * skala * (1 + FOKUS);
  const dFørst = Math.min(dSkinne, r / (0.7 * ty()));
  const dInde = r / (1.6 * ty());
  const [a, b, f] = z <= 1 ? [dSkinne, dFørst, z] : [dFørst, dInde, z - 1];
  return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * f);
}

function stilKamera() {
  const { kamera, styring, hul } = verden;
  const dSkinne = skinneAfstand();
  skala = lysSkala(dSkinne); // lysene får størrelsen i opdater
  // Navnene har nogenlunde samme størrelse på skærmen, også når kameraet står langt væk (højkant)
  const ns = THREE.MathUtils.clamp(dSkinne / 22, 1, 2.5);
  if (Math.abs(ns - navneSkala) > 0.001) {
    navneSkala = ns;
    for (const n of navne) {
      n.scale.copy(n.userData.skala).multiplyScalar(ns);
      n.position.y = STI_Y - 0.75 * ns; // under stien, også når skiltet bliver større
    }
  }
  const d = afstandVed(zoom, dSkinne);
  const a = vinkel(pos);
  // Spørgsmålet og knapperne nederst: lyset står midt i den frie del over dem
  const andel = Math.min(0.45, PLADS_NEDERST / Math.max(1, hul.height));
  const ned = andel * d * ty();
  punkt(pos, mid);
  styring.target.set(mid.x, mid.y - ned, mid.z);
  kamera.position.set(Math.sin(a) * (R + d), HØJDE * (d / dSkinne) - ned, Math.cos(a) * (R + d));
  kamera.lookAt(styring.target);
}

// ---------- Toningen ----------
let vistToning = -1;
function sætToning(t, blødt = false) {
  toning = t;
  const el = $('gaaderToning');
  if (!el || Math.abs(t - vistToning) < 0.004) return;
  vistToning = t;
  // blødt: CSS toner ud (når kortets scene overtager, og skinnen ikke længere tegner)
  el.style.transition = blødt ? 'opacity 0.35s ease-out' : 'none';
  el.style.opacity = String(t);
}

// ---------- Turen (flyvningen) ----------
function kørTur(dt) {
  const t = tur[0];
  if (!t) return;
  if (!t.start) {
    t.start = { zoom, pos, toning };
    turTid = 0;
  }
  turTid += dt;
  const f = t.varighed ? Math.min(1, turTid / t.varighed) : 1;
  anvend(t, f);
  if (f >= 1) {
    tur.shift();
    t.kald?.();
  }
}

function anvend(t, f) {
  const e = blød(f);
  const s = t.start ?? { zoom, pos, toning };
  if (t.zoom != null) zoom = s.zoom + (t.zoom - s.zoom) * e;
  if (t.glid != null) {
    mål = t.glid;
    pos = s.pos + (t.glid - s.pos) * e;
    meldFokus();
  }
  if (t.toning != null) sætToning(s.toning + (t.toning - s.toning) * f);
}

// Et tryk eller en tast springer flyvningen over: alle trin gøres færdige med det samme
export function spring() {
  while (tur.length) {
    const t = tur.shift();
    anvend(t, 1);
    t.kald?.();
  }
}

const flyver = () => tur.length > 0;

// ---------- Hvert billede ----------
function opdater(dt, tid) {
  if (!aktiv) return;
  if (flyver()) kørTur(dt);
  else if (!træk) {
    const før = pos;
    pos = ROLIG ? mål : pos + (mål - pos) * (1 - Math.exp(-dt * 5));
    if (Math.abs(mål - pos) < 0.001) pos = mål;
    if (før !== pos) meldFokus();
  }
  if (!aktiv) return; // turen kan have åbnet et kort
  if (tændTid >= 0) tændTid += dt;
  stilKamera();
  const tændt = tændTid < 0 ? 1 : Math.min(1, tændTid / (TÆND_HVER * lys.length + TÆND_VARER));
  for (const e of ekstra) {
    e.visible = !første;
    e.material.opacity = e.userData.opacitet * tændt;
  }
  for (let i = 0; i < lys.length; i++) {
    const l = lys[i];
    // Første gang står kun gåden i fokus tændt. Så tændes de andre ét efter ét ud fra den (med ROLIG toner de bare ind).
    const fra = Math.abs(i - mål);
    let synlig = 1;
    if (første) synlig = fra === 0 ? 1 : 0;
    else if (tændTid >= 0 && fra > 0) synlig = Math.min(1, Math.max(0, (tændTid - TÆND_HVER * (fra - 1)) / TÆND_VARER));
    l.holder.visible = synlig > 0;
    if (!l.holder.visible) continue;
    l.holder.scale.setScalar(ROLIG ? 1 : blød(synlig));
    l.lys?.opdater(dt, tid);
    // Navnet på gåden i fokus står i teksten nederst, så det toner ud i 3D
    const afst = Math.min(Math.abs(i - pos), lukket ? lys.length - Math.abs(i - pos) : Infinity);
    l.navn.material.opacity = Math.min(1, afst * 1.6) * 0.9 * (ROLIG ? synlig : 1);
    // Gåden i fokus står lidt større end naboerne (kun lyset, ikke stenen og navnet)
    l.indre.scale.setScalar(skala * (1 + FOKUS * Math.max(0, 1 - afst)));
    if (l.ring.visible) l.ring.lookAt(verden.kamera.position);
  }
  if (tændTid >= 0 && tændt >= 1) tændTid = -1;
}

// Teksten nederst følger målet med det samme (og kameraet, mens man trækker)
function meldFokus() {
  const n = række.length;
  if (!n) return;
  const i = ((Math.round(træk?.flyttet ? pos : mål) % n) + n) % n;
  const id = række[i];
  if (id === sidstFokus) return;
  sidstFokus = id;
  påFokus?.(id);
}

// ---------- Fingeren, musen og tastaturet ----------
function lærredPunkt(i, ud, y = 0) {
  punkt(i, ud, y);
  ud.project(verden.kamera);
  const r = verden.renderer.domElement.getBoundingClientRect();
  return { x: r.left + ((ud.x + 1) / 2) * r.width, y: r.top + ((1 - ud.y) / 2) * r.height };
}

// Hvor mange punkter på skærmen et skridt langs stien er (til trækket)
function punkterPrSkridt() {
  const a = lærredPunkt(mål, v);
  const b = lærredPunkt(mål + 1, mid);
  return Math.max(80, Math.hypot(b.x - a.x, b.y - a.y));
}

function påNed(h) {
  if (!aktiv || h.button > 0) return;
  if (flyver()) {
    træk = { id: h.pointerId, sprang: true };
    spring();
    return;
  }
  træk = { id: h.pointerId, x0: h.clientX, y0: h.clientY, pos0: pos, flyttet: false, skala: punkterPrSkridt(), prøver: [{ t: h.timeStamp, pos }] };
}
function påFlyt(h) {
  if (!træk || træk.sprang || første || h.pointerId !== træk.id) return;
  const dx = h.clientX - træk.x0;
  if (!træk.flyttet && Math.abs(dx) < 10) return;
  træk.flyttet = true;
  pos = grænse(træk.pos0 - dx / træk.skala, 0.35);
  træk.prøver.push({ t: h.timeStamp, pos });
  while (træk.prøver.length > 2 && h.timeStamp - træk.prøver[0].t > 100) træk.prøver.shift();
  meldFokus();
}
function påOp(h) {
  if (!træk || h.pointerId !== træk.id) return;
  const t = træk;
  træk = null;
  if (t.sprang || !aktiv) return;
  if (t.flyttet) {
    // Farten fra de sidste 100 ms giver et lille kast, som i menuen
    const nye = t.prøver.filter((p) => h.timeStamp - p.t <= 100);
    const [a, b] = [nye[0], nye[nye.length - 1]];
    const fart = nye.length > 1 && b.t > a.t ? ((b.pos - a.pos) / (b.t - a.t)) * 1000 : 0;
    gåTil(Math.round(pos + Math.max(-1.5, Math.min(1.5, fart * 0.15))));
    return;
  }
  if (h.type !== 'pointerup' || Math.hypot(h.clientX - t.x0, h.clientY - t.y0) > 10) return;
  // Et tryk: på gåden i fokus flyver man ind, på en anden glider kameraet derhen
  const i = lysVed(h.clientX, h.clientY);
  if (i == null) return;
  if (i === mål) påVælg?.(række[i]);
  else if (!første) gåTil(i);
}

// Lyset nærmest et punkt på skærmen (inden for lysets størrelse), eller null
function lysVed(x, y) {
  let bedst = null;
  let bedstAfst = Infinity;
  for (let i = 0; i < lys.length; i++) {
    if (!lys[i].holder.visible) continue;
    const c = lærredPunkt(i, v);
    const top = lærredPunkt(i, mid, LYS_R * 0.75 * skala * (1 + FOKUS)).y;
    const radius = Math.max(44, Math.abs(top - c.y));
    const afst = Math.hypot(x - c.x, y - c.y);
    if (afst < radius && afst < bedstAfst) {
      bedst = i;
      bedstAfst = afst;
    }
  }
  return bedst;
}

function grænse(p, ud = 0) {
  if (lukket) return p;
  return Math.max(-ud, Math.min(række.length - 1 + ud, p));
}

function gåTil(i) {
  const n = række.length;
  mål = lukket ? Math.round(i) : grænse(Math.round(i));
  if (ROLIG) pos = mål;
  if (lukket && n) {
    // Hold tallene små, så kommatallene ikke vokser
    const flyt = Math.floor(mål / n) * n;
    mål -= flyt;
    pos -= flyt;
  }
  meldFokus();
}

function påTast(h) {
  if (!aktiv) return;
  if (document.querySelector('.overlag:not(.skjult)') || h.target.closest?.('input, textarea, select')) return;
  if (flyver()) {
    if (['ArrowLeft', 'ArrowRight', 'Escape', ' ', 'Enter'].includes(h.key)) {
      h.preventDefault();
      spring();
    }
    return;
  }
  if (første || (h.key !== 'ArrowLeft' && h.key !== 'ArrowRight')) return;
  h.preventDefault();
  flyt(h.key === 'ArrowRight' ? 1 : -1);
}

function lavLyttere() {
  if (lyttere) return;
  lyttere = true;
  verden.renderer.domElement.addEventListener('pointerdown', påNed);
  addEventListener('pointermove', påFlyt);
  addEventListener('pointerup', påOp);
  addEventListener('pointercancel', påOp);
  addEventListener('keydown', påTast);
}

// ---------- Det, js/gaader.js bruger ----------
// Viser skinnen med gåden id i fokus. gåder: listen fra påSkinnen(), færdige: { id: tidspunkt }.
// valg: fokus(id) og vælg(id) (kaldes), første (kun det første lys, tæt foran), ud (kameraet trækker sig ud af lyset),
// tænd (første gang: lysene tændes ét efter ét efter flyvningen ud) og videre (efter flyvningen ud: glid så mange
// skridt og flyv ind i den gåde, så kaldes vælg).
export function vis(gåder, id, færdige, { fokus, vælg, første: kunFørste = false, ud = false, tænd = false, videre = 0 }) {
  påFokus = fokus;
  påVælg = vælg;
  const ider = gåder.map((g) => g.id).join();
  if (gruppe && ider !== række.join()) fjern();
  if (!gruppe) byg(gåder);
  for (const l of lys) l.ring.visible = Boolean(færdige[l.id]);
  gruppe.visible = true;
  lavLyttere();
  aktiv = true;
  træk = null;
  tur = [];
  første = kunFørste;
  tændTid = -1;
  const i = Math.max(0, række.indexOf(id));
  mål = pos = i;
  sidstFokus = null;
  stopKamera();
  const { styring } = verden;
  styring.enabled = false; // ingen fri drejning på skinnen
  styring.autoRotate = false;
  verden.opdateringer.add(opdater);
  zoom = første ? 1 : 0;
  sætToning(0);
  if (ud) {
    // Ud af lyset: Kortets scene er væk bag toningen, og kameraet trækker sig tilbage
    sætToning(1);
    zoom = 2;
    if (tænd) første = true;
    tur.push({ toning: 0, varighed: TID_TONING });
    tur.push({ zoom: 0, varighed: ROLIG ? 0 : TID_UD, kald: tænd ? () => { første = false; tændTid = ROLIG ? 1e3 : 0; } : null });
    const ny = grænse(i + videre);
    if (videre && ny !== i) {
      tur.push({ glid: ny, varighed: ROLIG ? 0 : 0.8 });
      tur.push(...indTur(() => påVælg?.(række[ny]), 0));
    }
  }
  stilKamera();
  meldFokus();
  opdater(0, 0); // synligheden (første gang) passer med det samme, ikke først i næste billede
}

// Ind i lyset: kameraet flyver ind, billedet tones mørkt, og så kaldes kald (kortet vises)
function indTur(kald, fra) {
  return [
    { zoom: 2, varighed: ROLIG ? 0 : TID_IND * (fra >= 1 ? 0.7 : 1) },
    { toning: 1, varighed: TID_TONING, kald },
  ];
}

// Flyv ind i gåden i fokus. kald kaldes, når billedet er mørkt (et tryk springer flyvningen over).
export function flyvInd(kald) {
  if (!aktiv || flyver()) return false;
  tur.push(...indTur(kald, zoom));
  return true;
}

// Et skridt langs stien (‹ mindre: -1, større ›: 1)
export function flyt(retning) {
  if (!aktiv || første || flyver()) return;
  gåTil(mål + retning);
}

export const fokus = () => række[((Math.round(mål) % række.length) + række.length) % række.length] ?? null;
export const ender = () => ({ første: !lukket && mål <= 0, sidste: !lukket && mål >= række.length - 1 });

// Et kort åbnes: skinnen skjules, men bliver liggende, så den er klar, når man kommer tilbage. Toningen går blødt væk,
// når kortets scene overtager.
export function skjul() {
  aktiv = false;
  træk = null;
  tur = [];
  tændTid = -1;
  første = false;
  if (gruppe) gruppe.visible = false;
  verden.opdateringer.delete(opdater);
  verden.styring.enabled = true;
  sætToning(0, true);
}

// Skærmen forlades: alt frigives
export function fjern() {
  skjul();
  sætToning(0);
  if (gruppe) {
    ryd(gruppe);
    verden.scene.remove(gruppe);
  }
  gruppe = null;
  lys = [];
  ekstra = [];
  række = [];
  sidstFokus = null;
}

// Til tests
export function testAdgang() {
  return {
    vist: () => aktiv && Boolean(gruppe?.visible),
    række: () => [...række],
    fokus,
    pos: () => pos,
    zoom: () => zoom,
    toning: () => toning,
    flyver,
    første: () => første,
    tændte: () => lys.filter((l) => l.holder.visible).map((l) => l.id),
    lukket: () => lukket,
    ringe: () => lys.filter((l) => l.ring.visible).map((l) => l.id),
    spring,
    // Lysets plads på skærmen (til tryk i testene)
    skærm: (id) => {
      const i = række.indexOf(id);
      return i < 0 ? null : lærredPunkt(i, new THREE.Vector3());
    },
  };
}
