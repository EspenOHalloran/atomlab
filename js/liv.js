// Liv (verdenen "Ild og liv", docs/plan-liv.md): fanen Opskriften med DNA-stigen i 3D.
// L1, første skridt: stigen tæt på (atomerne) og længere væk fra (båndene og trinene), der toner over i hinanden,
// når man zoomer. Zoom-rejsen (cellen, kernen og kromosomet), tallene og "Byg stigen" kommer bagefter.

import { verden, sætVindue, passerTilBoks } from './scene3d.js';
import { lavKontakt } from './kontakt.js';
import { lyd } from './lyd.js';
import { DnaStige, S } from './liv/stige.js';

const $ = (id) => document.getElementById(id);
// En stige med alle fire slags par (streng I). Atomerne vises for de midterste 24 basepar, stigen for alle 60.
const SEKVENS = 'GATTACACGTTAGCCATGGCATGCGTACGATCGGATCCTAGCATTGCAATCGGCTAGTCA';
const BLAND_FRA = 55; // kameraets afstand (enheder), hvor atomerne begynder at tone over i stigen
const BLAND_TIL = 95; // og hvor kun stigen er tilbage

let stige = null;
let aktiv = false;
let visH = null;

export function lavLiv() {
  stige = new DnaStige();
  stige.gruppe.visible = false;
  stige.sætSekvens(SEKVENS);
  verden.scene.add(stige.gruppe);
  for (const b of document.querySelectorAll('[data-liv-zoom]')) {
    b.addEventListener('click', () => {
      lyd.klik();
      zoom(b.dataset.livZoom);
    });
  }
  visH = lavKontakt($('livVisH'));
  visH.sæt(true);
  visH.knap.addEventListener('click', () => {
    visH.sæt(!visH.til);
    stige.sætVisH(visH.til);
    lyd.klik();
  });
}

function zoom(hvad) {
  if (hvad === 'atomer') passerTilBoks(11 * S, 3 * 3.38 * S);
  else passerTilBoks(14 * S, stige.halvHøjde() * 1.05);
}

function opdater() {
  const d = verden.kamera.position.distanceTo(verden.styring.target);
  const t = Math.min(1, Math.max(0, (d - BLAND_FRA) / (BLAND_TIL - BLAND_FRA)));
  stige.sætBlanding(t * t * (3 - 2 * t));
  for (const b of document.querySelectorAll('[data-liv-zoom]')) b.classList.toggle('valgt', (b.dataset.livZoom === 'stigen') === (t > 0.5));
}

export function startLiv() {
  aktiv = true;
  stige.gruppe.visible = true;
  sætVindue($('livVindue'));
  verden.styring.autoRotate = true;
  verden.styring.autoRotateSpeed = 0.35;
  verden.styring.maxDistance = 400;
  verden.opdateringer.add(opdater);
  zoom('atomer');
}

export function stopLiv() {
  aktiv = false;
  stige.gruppe.visible = false;
  verden.opdateringer.delete(opdater);
}

// Til tests (med ?test i adressen)
export function testAdgang() {
  return {
    aktiv: () => aktiv,
    blanding: () => stige.blanding,
    antal: () => ({ kugler: stige.kugler.count, pinde: stige.pinde.count, streger: stige.streger.count, trin: stige.trinene.count }),
    zoom,
  };
}
