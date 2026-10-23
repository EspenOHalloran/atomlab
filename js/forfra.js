// "Start forfra": en knap nederst i listen med opgaver i hver del. Første tryk spørger ("Sikker? Tryk igen"),
// og andet tryk inden for 3 sekunder nulstiller delens opgaver. De opdagede grundstoffer beholder man.

import * as fremgang from './fremgang.js';
import { lyd } from './lyd.js';
import { visBesked } from './beskeder.js';

const TEKST = '↺ Start forfra';

// En knap, der kræver to tryk
export function toTrinsKnap(knap, handling, tekst = knap.textContent) {
  let spurgt = null;
  knap.addEventListener('click', (h) => {
    h.stopPropagation();
    lyd.klik();
    if (!spurgt) {
      knap.textContent = 'Sikker? Tryk igen';
      knap.classList.add('spørg');
      spurgt = setTimeout(() => {
        spurgt = null;
        knap.textContent = tekst;
        knap.classList.remove('spørg');
      }, 3000);
      return;
    }
    clearTimeout(spurgt);
    spurgt = null;
    knap.textContent = tekst;
    knap.classList.remove('spørg');
    handling();
  });
}

// Sætter knappen nederst i listen, hvis mindst én af delens opgaver er klaret.
// ider: delens opgaver. del: delens navn (fx "Stjerneovnen"). efter: tegn listen og "Næste skridt" igen.
export function forfraKnap(liste, { ider, del, efter }) {
  if (!ider.some((id) => fremgang.erLøst(id))) return;
  const li = document.createElement('li');
  li.className = 'forfra';
  const knap = document.createElement('button');
  knap.className = 'knap lille svag';
  knap.textContent = TEKST;
  toTrinsKnap(knap, () => {
    fremgang.nulstilDel(ider);
    visBesked({ titel: `${del} starter forfra`, tekst: 'Stjernerne her er nulstillet. God fornøjelse!' });
    efter();
  }, TEKST);
  li.append(knap);
  liste.append(li);
}
