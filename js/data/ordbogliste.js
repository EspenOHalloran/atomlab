// Ordbogens liste: fagordene i alfabetisk rækkefølge (dansk: æ, ø og å til sidst), søgningen og links til steder,
// hvor ordene bruges. Uden Three.js, så det kan testes i Node (tests/ordbog.mjs).

import { ORDBOG } from './ordbog.js';

// Kun links, der er enkle og sikre: et "Hvorfor?"-kort, en skærm eller et fænomen, hvor ordet står i teksten.
// hvorfor: id i HVORFOR, skærm: [adresse, navn], gaa: [skærm:id eller skærm:id:sted, navn] (åbnes af knapper
// med data-gaa, også gaader:id til et kort i Gåderne).
export const LINKS = {
  tunneleffekt: { hvorfor: 'tunnel' },
  kernekraft: { hvorfor: 'kernen' },
  bindingsenergi: { hvorfor: 'binding' },
  'kovalent-binding': { hvorfor: 'bygBinder' },
  'frit-par': { hvorfor: 'bygForm' },
  fission: { skærm: ['reaktor', 'Reaktoren'] },
  moderator: { skærm: ['reaktor', 'Reaktoren'] },
  fusion: { skærm: ['fusion', 'Stjerneovnen'] },
  plasma: { skærm: ['fusion', 'Stjerneovnen'] },
  deuterium: { skærm: ['fusion', 'Stjerneovnen'] },
  elektrolyt: { skærm: ['batteri', 'Batteriet'] },
  dna: { skærm: ['liv', 'Liv'] },
  kromosom: { skærm: ['liv', 'Liv'] },
  basepar: { skærm: ['liv', 'Liv'] },
  hydrogenbinding: { skærm: ['liv', 'Liv'] },
  dendrit: { skærm: ['batteri', 'Batteriet'] },
  horisont: { gaa: ['kosmos:sorthul', 'Kosmos: Sort hul'] },
  singularitet: { gaa: ['gaader:sorthul', 'Gåden: Hvad er der inde i et sort hul?'] },
  antistof: { gaa: ['gaader:antistof', 'Gåden: Hvor blev antistoffet af?'] },
  moerktstof: { gaa: ['gaader:moerktstof', 'Gåden: Hvad er mørkt stof?'] },
  sigma: { hvorfor: 'opdaget' },
  fotonring: { gaa: ['kosmos:sorthul', 'Kosmos: Sort hul'] },
  doppler: { gaa: ['kosmos:sorthul', 'Kosmos: Sort hul'] },
  hviddvaerg: { gaa: ['kosmos:hviddvaerg', 'Kosmos: Hvid dværg'] },
  neutronstjerne: { gaa: ['kosmos:pulsar', 'Kosmos: Pulsar'] },
  brundvaerg: { gaa: ['kosmos:stjernefoedsel', 'Kosmos: Ny stjerne'] },
  baggrundsstraaling: { gaa: ['kosmos:bigbang', 'Kosmos: Big Bang'] },
  rproces: { gaa: ['kosmos:kilonova', 'Kosmos: Kilonova'] },
  tidsforlaengelse: { gaa: ['kosmos:tid', 'Kosmos: Rejsen i tid'] },
  laengdeforkortelse: { gaa: ['kosmos:tid', 'Kosmos: Rejsen i tid'] },
  samtidighed: { gaa: ['kosmos:tidhvorfor', 'Kosmos: Hvorfor går tiden langsommere?'] },
  egentid: { gaa: ['kosmos:tidhvorfor', 'Kosmos: Hvorfor går tiden langsommere?'] },
  myon: { gaa: ['kosmos:tid', 'Kosmos: Rejsen i tid'] },
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
  zone: { gaa: ['solsystem:jupiter', 'Solsystemet: Jupiter'] },
  baelte: { gaa: ['solsystem:jupiter', 'Solsystemet: Jupiter'] },
  jetstroem: { gaa: ['solsystem:jupiter', 'Solsystemet: Jupiter'] },
  antikyklon: { gaa: ['solsystem:jupiter:plet', 'Solsystemet: Den Store Røde Plet'] },
  resonans: { gaa: ['solsystem:jupiter:maaner', 'Solsystemet: Jupiters måner'] },
  nordlys: { gaa: ['solsystem:solstorm', 'Solsystemet: Solstorm'] },
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
  const iTekst = ORDNE.filter((o) => !iNavn.includes(o) && [o.tekst, ...(o.mere ?? []).flat()].join(' ').toLowerCase().includes(q));
  return [...iNavn, ...iTekst];
}

