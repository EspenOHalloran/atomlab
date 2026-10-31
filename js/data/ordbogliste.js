// Ordbogens liste: fagordene i alfabetisk rækkefølge (dansk: æ, ø og å til sidst), søgningen og links til steder,
// hvor ordene bruges. Uden Three.js, så det kan testes i Node (tests/ordbog.mjs).

import { ORDBOG } from './ordbog.js';

// Kun links, der er enkle og sikre: et "Hvorfor?"-kort, en skærm eller et fænomen, hvor ordet står i teksten.
// hvorfor: id i HVORFOR, skærm: [adresse, navn], gaa: [skærm:id eller skærm:id:sted, navn] (åbnes af knapper
// med data-gaa).
export const LINKS = {
  tunneleffekt: { hvorfor: 'tunnel' },
  kernekraft: { hvorfor: 'kernen' },
  bindingsenergi: { hvorfor: 'binding' },
  fission: { skærm: ['reaktor', 'Reaktoren'] },
  moderator: { skærm: ['reaktor', 'Reaktoren'] },
  fusion: { skærm: ['fusion', 'Stjerneovnen'] },
  plasma: { skærm: ['fusion', 'Stjerneovnen'] },
  deuterium: { skærm: ['fusion', 'Stjerneovnen'] },
  elektrolyt: { skærm: ['batteri', 'Batteriet'] },
  dendrit: { skærm: ['batteri', 'Batteriet'] },
  horisont: { gaa: ['kosmos:sorthul', 'Kosmos: Sort hul'] },
  hviddvaerg: { gaa: ['kosmos:hviddvaerg', 'Kosmos: Hvid dværg'] },
  neutronstjerne: { gaa: ['kosmos:pulsar', 'Kosmos: Pulsar'] },
  brundvaerg: { gaa: ['kosmos:stjernefoedsel', 'Kosmos: Ny stjerne'] },
  baggrundsstraaling: { gaa: ['kosmos:bigbang', 'Kosmos: Big Bang'] },
  rproces: { gaa: ['kosmos:kilonova', 'Kosmos: Kilonova'] },
  roedkaempe: { gaa: ['solsystem:solensfremtid', 'Solsystemet: Solens fremtid'] },
  jaevndoegn: { gaa: ['solsystem:aarstider', 'Solsystemet: Årstiderne'] },
  solhverv: { gaa: ['solsystem:aarstider', 'Solsystemet: Årstiderne'] },
  polarcirkel: { gaa: ['solsystem:aarstider', 'Solsystemet: Årstiderne'] },
  midnatssol: { gaa: ['solsystem:aarstider', 'Solsystemet: Årstiderne'] },
  moerketid: { gaa: ['solsystem:aarstider', 'Solsystemet: Årstiderne'] },
  korona: { gaa: ['solsystem:formoerkelser', 'Solsystemet: Formørkelser'] },
  kerneskygge: { gaa: ['solsystem:formoerkelser', 'Solsystemet: Formørkelser'] },
  halvskygge: { gaa: ['solsystem:formoerkelser', 'Solsystemet: Formørkelser'] },
  toeris: { gaa: ['solsystem:mars', 'Solsystemet: Mars'] },
  skalahoejde: { gaa: ['solsystem:mars', 'Solsystemet: Mars'] },
  skjoldvulkan: { gaa: ['solsystem:mars:olympus', 'Solsystemet: Olympus Mons'] },
  caldera: { gaa: ['solsystem:mars:caldera', 'Solsystemet: Calderaen på Olympus Mons'] },
  optiskdybde: { gaa: ['solsystem:saturn:ringe', 'Solsystemet: Saturns ringe'] },
};

const sorter = new Intl.Collator('da', { sensitivity: 'base' });
// "Den stærke kernekraft" står under S, "Den kosmiske baggrundsstråling" under K
export const sorteringsnavn = (o) => o.ord.replace(/^Den /, '');
export const sorterOrd = (liste) => [...liste].sort((a, b) => sorter.compare(sorteringsnavn(a), sorteringsnavn(b)));
export const ORDNE = sorterOrd(ORDBOG);
export const forbogstav = (o) => sorteringsnavn(o)[0].toUpperCase();

// Søgning: ord, hvor navnet eller en bøjning passer, kommer først. Derefter ord, hvor teksten nævner det.
export function søgOrd(tekst) {
  const q = tekst.trim().toLowerCase();
  if (!q) return ORDNE;
  const iNavn = ORDNE.filter((o) => o.ord.toLowerCase().includes(q) || o.former.some((f) => f.includes(q)));
  const iTekst = ORDNE.filter((o) => !iNavn.includes(o) && o.tekst.toLowerCase().includes(q));
  return [...iNavn, ...iTekst];
}

