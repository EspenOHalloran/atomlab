// Solsystemet: Solen, Jorden, Mars og Saturn i den rigtige størrelse (trin 1 i docs/plan-solsystemet.md og Mars M4).
// Skallen (listen, panelet, knapperne, pausen og underteksterne) er fælles med Kosmos (faenomenskaerm.js).

import { lavFænomenSkærm, NØGLER } from './faenomenskaerm.js';
import solen from './kosmos/solen.js';
import jordkloden from './kosmos/jordkloden.js';
import aarstider from './kosmos/aarstider.js';
import formoerkelser from './kosmos/formoerkelser.js';
import solstorm from './kosmos/solstorm.js';
import solensfremtid from './kosmos/solensfremtid.js';
import mars from './kosmos/mars.js';
import saturn from './kosmos/saturn.js';

// Efter afstanden til Solen. Solen og Jorden har deres egne visninger (M4b), og under dem står de fænomener, der hører til.
const skærm = lavFænomenSkærm({
  skærm: 'solsystem',
  liste: [
    { navn: 'Solen', ikon: '☀️', f: solen, under: [solstorm, solensfremtid] },
    { navn: 'Jorden', ikon: '🌍', f: jordkloden, under: [aarstider, formoerkelser] },
    mars,
    saturn,
  ],
});

export const FÆNOMENER = skærm.FÆNOMENER;
export const startSolsystem = skærm.start;
export const stopSolsystem = skærm.stop;
export const testAdgang = skærm.testAdgang;

// Fænomenerne lå i Kosmos før 26. oktober 2026. Det, man har set og sidst valgt, flytter med.
export function flytGemt() {
  const ider = new Set(FÆNOMENER.map((f) => f.id));
  try {
    const k = NØGLER.kosmos;
    const s = NØGLER.solsystem;
    const kosmosSet = JSON.parse(localStorage.getItem(k.set) || '[]');
    const flyttes = kosmosSet.filter((id) => ider.has(id));
    if (flyttes.length) {
      const solSet = new Set(JSON.parse(localStorage.getItem(s.set) || '[]'));
      for (const id of flyttes) solSet.add(id);
      localStorage.setItem(s.set, JSON.stringify([...solSet]));
      localStorage.setItem(k.set, JSON.stringify(kosmosSet.filter((id) => !ider.has(id))));
    }
    const sidst = localStorage.getItem(k.valgt);
    if (ider.has(sidst)) {
      if (!localStorage.getItem(s.valgt)) localStorage.setItem(s.valgt, sidst);
      localStorage.removeItem(k.valgt); // Kosmos starter så på Big Bang
    }
  } catch {
    // ingen lagring
  }
}

export function lavSolsystem() {
  flytGemt();
  skærm.lav();
}
