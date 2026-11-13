// Alle forløb (js/forloeb.js). Ren data, så menuen kan vise ✓ i "Din fremgang" uden at hente delene.
import { FØRSTE_ATOM } from './foerste-atom.js';
import { OPSKRIFTEN } from './opskriften.js';

export const FORLØB = [FØRSTE_ATOM, OPSKRIFTEN];

export const forløbMed = (id) => FORLØB.find((f) => f.id === id) ?? null;
export const forløbI = (del) => FORLØB.filter((f) => f.del === del);
