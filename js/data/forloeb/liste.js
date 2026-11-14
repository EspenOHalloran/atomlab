// Alle forløb (js/forloeb.js). Ren data, så menuen kan vise ✓ i "Din fremgang" uden at hente delene.
import { FØRSTE_ATOM } from './foerste-atom.js';
import { MØDES } from './molekyler.js';
import { OPSKRIFTEN } from './opskriften.js';
import { ORDENE } from './ordene.js';
import { REJSEN_I_TID, HVORDAN_KAN_DET_SKE } from './tid.js';

export const FORLØB = [FØRSTE_ATOM, MØDES, OPSKRIFTEN, ORDENE, REJSEN_I_TID, HVORDAN_KAN_DET_SKE];

export const forløbMed = (id) => FORLØB.find((f) => f.id === id) ?? null;
export const forløbI = (del) => FORLØB.filter((f) => f.del === del);
