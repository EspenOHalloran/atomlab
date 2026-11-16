// Opdagelserne i Biblioteket (docs/plan-videnskabsfolk.md): de ti bøger om videnskabsfolk. Uden DOM og Three.js, så menuen,
// "Din fremgang" og testene i Node kan bruge listen. Bøgerne står på hylden i årets rækkefølge (en tidslinje).
//
// Hver bog: id, navn (fuldt), kort (navnet på ryggen), år (opdagelsen), om (bogens emne efter "bog om"), ejefald (navnet i
// ejefald), titel (på omslaget, kun byggede bøger), bygget (kun en bygget bog kan åbnes, de andre er en grå ryg). En bygget bog har desuden:
//   portræt  stien til portrættet (billeder/biblioteket/, lavet af lav_portraet.py, kilden i KILDER.md)
//   stil     tidens udseende indeni den fælles ramme (js/bog.js): papir, blæk, ryggens farve og skriften til overskrifter
//   tekster  () => import(...) af bogens tekster i js/data/opdagelser/<id>.js (hentes først, når bogen åbnes)
//
// Skrifterne er OFL og ligger i fonts/ (se fonts/KILDER.md). 1600-tallets bøger bruger 'AtomLab Fell' (IM Fell English).

const SKRIFT_1600 = "'AtomLab Fell', Georgia, 'Times New Roman', serif";

export const BØGER = [
  { id: 'tycho', navn: 'Tycho Brahe', kort: 'Tycho Brahe', år: 1572, ejefald: 'Tycho Brahes', om: 'den nye stjerne' },
  { id: 'galilei', navn: 'Galileo Galilei', kort: 'Galilei', år: 1610, ejefald: 'Galileis', om: 'Jupiters måner' },
  {
    id: 'huygens', navn: 'Christiaan Huygens', kort: 'Huygens', år: 1656, ejefald: 'Huygens\'', om: 'Saturns ring', titel: 'Saturns ører', bygget: true,
    portræt: 'billeder/biblioteket/huygens.webp',
    stil: { papir: '#efe4cc', papirMørk: '#dccaa4', blæk: '#2b1f17', ryg: '#5b2a1e', rygKant: '#c9a24a', skrift: SKRIFT_1600 },
    tekster: () => import('./opdagelser/huygens.js'),
  },
  { id: 'roemer', navn: 'Ole Rømer', kort: 'Rømer', år: 1676, ejefald: 'Ole Rømers', om: 'lyset, der bruger tid' },
  { id: 'newton', navn: 'Isaac Newton', kort: 'Newton', år: 1687, ejefald: 'Isaac Newtons', om: 'tyngdeloven' },
  { id: 'oersted', navn: 'H.C. Ørsted', kort: 'Ørsted', år: 1820, ejefald: 'H.C. Ørsteds', om: 'strøm og magneter' },
  { id: 'curie', navn: 'Marie Curie', kort: 'Curie', år: 1898, ejefald: 'Marie Curies', om: 'stoffer, der stråler' },
  { id: 'einstein', navn: 'Albert Einstein', kort: 'Einstein', år: 1905, ejefald: 'Albert Einsteins', om: 'energi og masse' },
  { id: 'bohr', navn: 'Niels Bohr', kort: 'Bohr', år: 1913, ejefald: 'Niels Bohrs', om: 'elektronernes skaller' },
  { id: 'lehmann', navn: 'Inge Lehmann', kort: 'Lehmann', år: 1936, ejefald: 'Inge Lehmanns', om: 'Jordens indre kerne' },
];

export const bogMed = (id) => BØGER.find((b) => b.id === id) ?? null;
export const byggede = () => BØGER.filter((b) => b.bygget);

// Linjen ved en grå ryg (en bog, der ikke er skrevet endnu)
export const kommerSenere = (b) => `${b.ejefald} bog om ${b.om} kommer senere.`;

// Linjen under hylden (delens kernesætning, docs/plan-videnskabsfolk.md afsnit 1)
export const HYLDE_LINJE = 'De gættede ikke bare. De så efter og målte. Tryk på en bog.';
