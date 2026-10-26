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
import tyngdebolger from './kosmos/tyngdebolger.js';
import sorthul from './kosmos/sorthul.js';
import kvasar from './kosmos/kvasar.js';
import ormehul from './kosmos/ormehul.js';

// Rækkefølgen fortæller en historie: Big Bang, en stjerne bliver født, stjerner der dør, og til sidst sorte huller
// og ormehuller. Vores eget solsystem (Solen, Jorden, Mars og Saturn) ligger i Solsystemet (solsystem.js).
const skærm = lavFænomenSkærm({
  skærm: 'kosmos',
  liste: [bigbang, stjernefoedsel, hviddvaerg, supernova, pulsar, kilonova, rumtid, tyngdebolger, sorthul, kvasar, ormehul],
});

export const FÆNOMENER = skærm.FÆNOMENER;
export const lavKosmos = skærm.lav;
export const startKosmos = skærm.start;
export const stopKosmos = skærm.stop;
export const testAdgang = skærm.testAdgang;
