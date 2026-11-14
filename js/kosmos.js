// Kosmos: animationer af vilde fænomener i rummet (sorte huller, supernovaer, tyngdebølger ...).
// Skallen (listen, panelet, knapperne, pausen og underteksterne) er fælles med Solsystemet (faenomenskaerm.js).

import { lavFænomenSkærm } from './faenomenskaerm.js';
import bigbang from './kosmos/bigbang.js';
import stjernefoedsel from './kosmos/stjernefoedsel.js';
import hviddvaerg from './kosmos/hviddvaerg.js';
import supernova from './kosmos/supernova.js';
import pulsar from './kosmos/pulsar.js';
import kilonova from './kosmos/kilonova.js';
import rumtid from './kosmos/rumtid.js';
import tid from './kosmos/tid.js';
import tidhvorfor from './kosmos/tidhvorfor.js';
import tyngdebolger from './kosmos/tyngdebolger.js';
import sorthul from './kosmos/sorthul.js';
import kvasar from './kosmos/kvasar.js';
import ormehul from './kosmos/ormehul.js';

// Fire grupper (Serie 1 nr. 4, plan-verdener.md), som Solsystemets grupper, men uden en klode for hver. Rækkefølgen
// fortæller stadig en historie: Big Bang, stjerner, der fødes og dør, rumtiden og til sidst sorte huller og ormehuller.
// Universet får senere Mørkt stof og Andromeda. Vores eget solsystem ligger i Solsystemet (solsystem.js).
const skærm = lavFænomenSkærm({
  skærm: 'kosmos',
  liste: [
    { navn: 'Universet', ikon: '🌌', under: [bigbang] },
    { navn: 'Stjernernes liv', ikon: '✴️', under: [stjernefoedsel, hviddvaerg, supernova, pulsar, kilonova] },
    { navn: 'Tid og rum', ikon: '🕰️', under: [rumtid, tid, tidhvorfor, tyngdebolger] },
    { navn: 'Sorte huller', ikon: '🕳️', under: [sorthul, kvasar, ormehul] },
  ],
});

export const FÆNOMENER = skærm.FÆNOMENER;
export const lavKosmos = skærm.lav;
export const startKosmos = skærm.start;
export const stopKosmos = skærm.stop;
export const testAdgang = skærm.testAdgang;

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavKosmos as lav, startKosmos as start, stopKosmos as stop };
