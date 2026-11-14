// Molekyler (#molekyler): en egen del i verdenen Atomer. Indtil 14. november 2026 var det fanen "Byg et molekyle" i
// Atomværkstedet. To måder, valgt øverst i venstre panel: "Del elektroner" (js/molekyler-byg.js, med knaldgassen i
// js/knaldgas.js) og "Giv elektroner" (js/molekyler.js, det der hed Byttebørsen). Her står kun skiftet mellem dem,
// hjælpen og "Opgaver forfra".

import { lavByttebørs, startByttebørs, stopByttebørs, opdaterFremgang as opdaterGiv, testAdgang as bytteTest } from './molekyler.js';
import { lavBygMolekyler, startBygMolekyler, stopBygMolekyler, opdaterFremgang as opdaterDel, testAdgang as bygTest } from './molekyler-byg.js';
import { OPGAVER_BYTTE } from './data/molekyler.js';
import { OPGAVER_BYG } from './data/molekyler-byg.js';
import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked, rydBeskeder } from './beskeder.js';
import { lukHvorfor } from './lag.js';
import { toTrinsKnap } from './forfra.js';
import { hentetSkærm } from './skaerme.js';
import { tagVentMolekyler } from './gaa.js';

const $ = (id) => document.getElementById(id);

// 'byg' (Del elektroner) eller 'bytte' (Giv elektroner)
const MÅDER = ['byg', 'bytte'];
const START = { byg: () => startBygMolekyler(), bytte: () => startByttebørs() };
const STOP = { byg: () => stopBygMolekyler(), bytte: () => stopByttebørs() };
let måde = 'byg';
let aktiv = false;

export function lav() {
  // "Giv elektroner" kender det atom, man har bygget i Atomværkstedet (står der et neutralt natrium, nævnes det)
  lavByttebørs({ værkstedAtom: () => hentetSkærm('vaerksted')?.værkstedTilstand() ?? null });
  lavBygMolekyler();
  for (const b of document.querySelectorAll('[data-molekyle-maade]')) {
    b.addEventListener('click', () => {
      lyd.klik();
      sætMåde(b.dataset.molekyleMaade);
    });
  }
  $('molekylerHjælp').addEventListener('click', () => {
    lyd.klik();
    $('hjælpMolekyler').classList.remove('skjult');
  });
  // Starter kun Molekylers opgaver forfra (Værkstedet og de andre dele har deres egen knap)
  toTrinsKnap($('molekylerOpgaverForfra'), () => {
    fremgang.nulstilDel([...OPGAVER_BYG, ...OPGAVER_BYTTE].map((o) => o.id));
    opdaterFremgang();
    $('hjælpMolekyler').classList.add('skjult');
    visBesked({ titel: 'Molekyler starter forfra', tekst: 'Stjernerne her er nulstillet. God fornøjelse!' });
  });
  visMåde();
}

// Skifter måde: 'byg' eller 'bytte'
export function sætMåde(ny) {
  if (!MÅDER.includes(ny) || ny === måde) return;
  if (aktiv) {
    STOP[måde]();
    rydBeskeder(); // underteksterne og "Hvorfor?"-kortet hører til den måde, de blev vist i
    lukHvorfor();
  }
  måde = ny;
  visMåde();
  if (aktiv) START[måde]();
}

function visMåde() {
  $('molekyler').classList.toggle('bytte', måde === 'bytte');
  $('molekyler').classList.toggle('del-elektroner', måde === 'byg'); // ikke 'byg': den klasse har byggepanelet
  for (const b of document.querySelectorAll('[data-molekyle-maade]')) {
    b.classList.toggle('valgt', b.dataset.molekyleMaade === måde);
    b.setAttribute('aria-pressed', String(b.dataset.molekyleMaade === måde));
  }
}

export function start() {
  aktiv = true;
  const vent = tagVentMolekyler();
  if (MÅDER.includes(vent) && vent !== måde) {
    måde = vent;
    visMåde();
  }
  START[måde]();
}

export function stop() {
  aktiv = false;
  STOP[måde]();
}

// Stjernerne igen (fx efter "Nulstil al fremgang" i Værkstedets hjælp)
export function opdaterFremgang() {
  opdaterGiv();
  opdaterDel();
}

export function testAdgang() {
  return {
    måde: () => måde,
    sætMåde,
    bytte: bytteTest(),
    byg: bygTest(),
  };
}
