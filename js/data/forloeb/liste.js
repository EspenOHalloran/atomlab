// Alle forløb (js/forloeb.js). Ren data, så menuen kan vise ✓ i "Din fremgang" uden at hente delene.
import { BEGYNDELSEN } from './begyndelsen.js';
import { LIGE_HURTIGT } from './einstein.js';
import { FØRSTE_ATOM } from './foerste-atom.js';
import { ILD_1 } from './ild.js';
import { SATURNS_ØRER } from './huygens.js';
import { FEJLEN } from './fejlen.js';
import { KOPIEN } from './kopien.js';
import { STRIBER } from './kvante.js';
import { LAND_MED_HUYGENS } from './land-med-huygens.js';
import { MØDES } from './molekyler.js';
import { OPSKRIFTEN } from './opskriften.js';
import { ORDENE } from './ordene.js';
import { OVERBLIK } from './overblik.js';
import { HIMLENS_UR } from './roemer.js';
import { REJSEN_I_TID, HVORDAN_KAN_DET_SKE } from './tid.js';
import { DEN_NYE_STJERNE } from './tycho.js';
import { UNDER_ISEN } from './under-isen.js';

export const FORLØB = [FØRSTE_ATOM, STRIBER, MØDES, ILD_1, OPSKRIFTEN, ORDENE, KOPIEN, FEJLEN, BEGYNDELSEN, REJSEN_I_TID, HVORDAN_KAN_DET_SKE, OVERBLIK, SATURNS_ØRER, DEN_NYE_STJERNE, HIMLENS_UR, LIGE_HURTIGT, UNDER_ISEN, LAND_MED_HUYGENS];

export const forløbMed = (id) => FORLØB.find((f) => f.id === id) ?? null;
export const forløbI = (del) => FORLØB.filter((f) => f.del === del);
