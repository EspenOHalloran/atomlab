// Solsystemet: Solen, Venus, Jorden, Mars, Jupiter, Saturn, Uranus og Neptun i den rigtige størrelse (trin 1 i docs/plan-solsystemet.md og Mars M4).
// Skallen (listen, panelet, knapperne, pausen og underteksterne) er fælles med Kosmos (faenomenskaerm.js).

import { lavFænomenSkærm } from './faenomenskaerm.js';
import solen from './kosmos/solen.js';
import jordkloden from './kosmos/jordkloden.js';
import aarstider from './kosmos/aarstider.js';
import formoerkelser from './kosmos/formoerkelser.js';
import solstorm from './kosmos/solstorm.js';
import solensfremtid from './kosmos/solensfremtid.js';
import venus from './kosmos/venus.js';
import mars from './kosmos/mars.js';
import jupiter from './kosmos/jupiter.js';
import saturn from './kosmos/saturn.js';
import uranus from './kosmos/uranus.js';
import neptun from './kosmos/neptun.js';

// Efter afstanden til Solen. Solen og Jorden har deres egne visninger (M4b), og under dem står de fænomener, der hører til.
const skærm = lavFænomenSkærm({
  skærm: 'solsystem',
  liste: [
    { navn: 'Solen', ikon: '☀️', f: solen, under: [solstorm, solensfremtid] },
    venus,
    { navn: 'Jorden', ikon: '🌍', f: jordkloden, under: [aarstider, formoerkelser] },
    mars,
    jupiter,
    saturn,
    uranus,
    neptun,
  ],
});

export const FÆNOMENER = skærm.FÆNOMENER;
export const startSolsystem = skærm.start;
export const stopSolsystem = skærm.stop;
export const testAdgang = skærm.testAdgang;

// Det gemte fra før 26. oktober 2026 (da fænomenerne lå i Kosmos) flyttes ved start i main.js (flytGemt i js/data/faenomener.js).
export const lavSolsystem = skærm.lav;

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavSolsystem as lav, startSolsystem as start, stopSolsystem as stop };
