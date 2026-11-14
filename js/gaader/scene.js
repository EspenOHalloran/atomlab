// Scenen bag et kort i Gåderne (G4a, docs/plan-gaader-3d.md). js/gaader.js henter denne fil med import(), første gang
// et kort åbnes, og kalder vis(id, trin, valgt) hver gang kortet skifter trin. Hver gåde har sin egen fil med lavNær(ctx)
// (her kun antistof.js indtil videre). Kun én scene ad gangen: Den gamle ryddes (ryd), når man skifter kort eller går ud.
//
// ctx, som scenen får: gruppe (en THREE.Group i verden.scene), linje(tekst) (én linje nederst i billedet), knapper([{ tekst,
// gør, id }]) (højst to knapper under linjen), passer(halvBredde, halvHøjde) (kameraet ser lige ind på planet z = 0, så
// kassen passer i hullet), og punkt(hændelse, v) (hvor på planet z = 0 en finger eller mus er).
// Scenen kan have ned(p) (true = den tager trækket), træk(p), op(p), tryk(p), opdater(dt, tid) og fjern().

import * as THREE from 'three';
import { verden, passerTilBoks, centrerVindue, ROLIG } from '../scene3d.js';
import { ryd } from '../kosmos/faelles.js';

const SCENER = {
  antistof: () => import('./antistof.js'),
};

const $ = (id) => document.getElementById(id);
let aktiv = false;
let id = null; // gåden, scenen hører til
let nr = 0; // tælles op ved hvert skift, så en scene, der bliver hentet for sent, ikke vises
let nu = null; // den viste scene (det, lavNær gav)
let gruppe = null;
let kasse = null; // [halvBredde, halvHøjde], som kameraet skal se
let ventTrin = null; // [trin, valgt], hvis kortet skifter trin, mens scenen hentes
let lyttere = false;
let størrelse = null;

const stråle = new THREE.Raycaster();
const plan = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const ndc = new THREE.Vector2();

function punkt(h, v) {
  const r = verden.renderer.domElement.getBoundingClientRect();
  ndc.set(((h.clientX - r.left) / r.width) * 2 - 1, -((h.clientY - r.top) / r.height) * 2 + 1);
  stråle.setFromCamera(ndc, verden.kamera);
  return stråle.ray.intersectPlane(plan, v) ? v : null;
}

// ---------- Linjen og knapperne nederst i billedet ----------
let sidsteLinje = '';
let sidsteKnapper = '';
function linje(tekst) {
  if (tekst === sidsteLinje) return;
  sidsteLinje = tekst;
  const el = $('gaadeLinje');
  el.textContent = tekst ?? '';
  el.hidden = !tekst;
}
let knapGør = [];
function knapper(liste = []) {
  const nøgle = liste.map((k) => k.tekst).join('|');
  knapGør = liste.map((k) => k.gør);
  if (nøgle === sidsteKnapper) return;
  sidsteKnapper = nøgle;
  $('gaadeSceneKnapper').innerHTML = liste.map((k, i) => `<button class="knap lille" data-scene-knap="${i}"${k.id ? ` data-id="${k.id}"` : ''}>${k.tekst}</button>`).join('');
}

function passer(halvB, halvH) {
  kasse = [halvB, halvH];
  const { kamera, styring } = verden;
  styring.target.set(0, 0, 0);
  // Kameraet ser lige ind på planet, så det, man trykker på, er der, hvor fingeren er
  kamera.position.set(0, 0, Math.max(6, kamera.position.length()));
  passerTilBoks(halvB, halvH);
}

// ---------- Fingeren og musen ----------
// Et tryk, der ikke flytter sig (under 10 punkter), er et tryk. Ellers er det et træk, som scenen kan tage (ned giver true),
// eller som drejer kameraet (hvis scenen har slået drejningen til).
const p = new THREE.Vector3();
let ned = null; // { x, y, tager }
function påNed(h) {
  if (!nu || h.button > 0) return;
  const tager = Boolean(punkt(h, p) && nu.ned?.(p));
  ned = { x: h.clientX, y: h.clientY, tager, id: h.pointerId };
  if (tager) {
    verden.styring.enabled = false;
    h.stopImmediatePropagation();
  }
}
function påFlyt(h) {
  if (!ned || h.pointerId !== ned.id || !ned.tager) return;
  if (punkt(h, p)) nu?.træk?.(p);
}
function påOp(h) {
  if (!ned || h.pointerId !== ned.id) return;
  const { tager, x, y } = ned;
  ned = null;
  if (tager) {
    verden.styring.enabled = nu?.drejer ?? false;
    if (punkt(h, p)) nu?.op?.(p);
    return;
  }
  if (Math.hypot(h.clientX - x, h.clientY - y) < 10 && punkt(h, p)) nu?.tryk?.(p);
}

function lavLyttere() {
  if (lyttere) return;
  lyttere = true;
  const lærred = verden.renderer.domElement;
  lærred.addEventListener('pointerdown', påNed, { capture: true });
  addEventListener('pointermove', påFlyt);
  addEventListener('pointerup', påOp);
  addEventListener('pointercancel', påOp);
  $('gaadeSceneKnapper').addEventListener('click', (h) => {
    const b = h.target.closest('[data-scene-knap]');
    if (b) knapGør[Number(b.dataset.sceneKnap)]?.();
  });
  // Hullet ændrer størrelse (panelet forneden får mere tekst, eller skærmen drejes): kameraet skal passe igen
  størrelse = new ResizeObserver(() => {
    if (!aktiv) return;
    centrerVindue();
    if (kasse && !nu?.egetKamera) passerTilBoks(...kasse);
    nu?.tilpas?.();
  });
  størrelse.observe($('gaaderVindue'));
}

function opdater(dt, tid) {
  nu?.opdater?.(dt, tid);
}

const ctx = () => ({ gruppe, linje, knapper, passer, ROLIG });

// Viser scenen til en gåde og det trin, kortet står på. Kaldes igen ved hvert trin.
export async function vis(nytId, trin, valgt) {
  aktiv = true;
  lavLyttere();
  if (nytId === id && (nu || ventTrin)) {
    if (nu) nu.trin(trin, valgt);
    else ventTrin = [trin, valgt];
    return;
  }
  fjern();
  id = nytId;
  const mit = ++nr;
  ventTrin = [trin, valgt];
  verden.styring.autoRotate = false;
  verden.opdateringer.add(opdater);
  const hent = SCENER[nytId];
  if (!hent) { ventTrin = null; return; } // de andre gåder får deres lys i en senere delopgave
  const modul = await hent();
  if (mit !== nr || !aktiv) return;
  gruppe = new THREE.Group();
  verden.scene.add(gruppe);
  centrerVindue();
  nu = modul.lavNær(ctx());
  const [t, v] = ventTrin;
  ventTrin = null;
  nu.trin(t, v);
}

function fjern() {
  nr++;
  nu?.fjern?.();
  nu = null;
  if (gruppe) {
    ryd(gruppe);
    verden.scene.remove(gruppe);
    gruppe = null;
  }
  id = null;
  kasse = null;
  ned = null;
  ventTrin = null;
  linje('');
  knapper([]);
  verden.opdateringer.delete(opdater);
  verden.styring.enabled = true;
}

// Oversigten eller en anden skærm: scenen ryddes, og kameraet får sin styring igen
export function skjul() {
  fjern();
}

export function stop() {
  aktiv = false;
  fjern();
}

// Til tests
export function testAdgang() {
  return {
    id: () => id,
    klar: () => Boolean(nu),
    scene: () => nu?.test?.() ?? null,
    tryk: (x, y) => nu?.tryk?.(new THREE.Vector3(x, y, 0)),
    spol: (sek) => nu?.spol?.(sek),
  };
}
