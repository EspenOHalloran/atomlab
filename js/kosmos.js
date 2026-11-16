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
import { lavOversigt } from './kosmos/oversigt.js';

// Fire grupper (Serie 1 nr. 4, plan-verdener.md), som Solsystemets grupper, men uden en klode for hver. Rækkefølgen
// fortæller stadig en historie: Big Bang, stjerner, der fødes og dør, rumtiden og til sidst sorte huller og ormehuller.
// Universet får senere Mørkt stof og Andromeda. Vores eget solsystem ligger i Solsystemet (solsystem.js).
const GRUPPER = [
  { navn: 'Universet', ikon: '🌌', tekst: 'Hvordan det hele begyndte, og hvor de første atomer kom fra.', under: [bigbang] },
  { navn: 'Stjernernes liv', ikon: '✴️', tekst: 'Stjerner, der fødes, brænder ud og eksploderer.', under: [stjernefoedsel, hviddvaerg, supernova, pulsar, kilonova] },
  { navn: 'Tid og rum', ikon: '🕰️', tekst: 'Rummet kan bøje, og tiden kan gå langsommere.', under: [rumtid, tid, tidhvorfor, tyngdebolger] },
  { navn: 'Sorte huller', ikon: '🕳️', tekst: 'Steder, hvor tyngden er så stærk, at intet slipper væk.', under: [sorthul, kvasar, ormehul] },
];
// Oversigten er forsiden (som Solsystemets overblik): Kosmos starter dér, medmindre et link eller et forløb har valgt et fænomen
const oversigt = lavOversigt(GRUPPER);
const skærm = lavFænomenSkærm({
  skærm: 'kosmos',
  forside: 'oversigt',
  liste: [oversigt, ...GRUPPER.map(({ tekst: _tekst, ...g }) => g)],
});

export const FÆNOMENER = skærm.FÆNOMENER;
export const lavKosmos = skærm.lav;
export const startKosmos = skærm.start;
export const stopKosmos = skærm.stop;
export const testAdgang = skærm.testAdgang;

// De fælles navne, som skærmlisten (js/skaerme.js) bruger
export { lavKosmos as lav, startKosmos as start, stopKosmos as stop };
