// Opdagelserne i Biblioteket (docs/plan-videnskabsfolk.md): de ti bøger om videnskabsfolk. Uden DOM og Three.js, så menuen,
// "Din fremgang" og testene i Node kan bruge listen. Bøgerne står på hylden i årets rækkefølge (en tidslinje).
//
// Hver bog: id, navn (fuldt), kort (navnet på ryggen), år (opdagelsen), om (bogens emne efter "bog om"), ejefald (navnet i
// ejefald), titel (på omslaget, kun byggede bøger), bygget (kun en bygget bog kan åbnes, de andre er en grå ryg) og
// spørgsmål (bogens spørgsmål, som en grå ryg stiller, når man trykker på den. Skal findes for bøgerne i påHylden()).
// En bygget bog har desuden:
//   portræt  stien til portrættet (billeder/biblioteket/, lavet af lav_portraet.py, kilden i KILDER.md)
//   stil     tidens udseende indeni den fælles ramme (js/bog.js): papir, blæk, ryggens farve og skriften til overskrifter
//   tekster  () => import(...) af bogens tekster i js/data/opdagelser/<id>.js (hentes først, når bogen åbnes)
//   forløb   id'et på fortællingens forløb (js/data/forloeb/), som starter efter "Begynd" første gang
//   scene    () => import(...) af bogens tegninger i js/bog/<id>.js (lavFortælling til opslaget af slags 'scene')
//
// Skrifterne er OFL og ligger i fonts/ (se fonts/KILDER.md). Bøgerne fra 1500- og 1600-tallet bruger 'AtomLab Fell' (IM Fell English),
// og bøgerne fra 1900-tallet 'AtomLab Old Standard' (Old Standard TT, også i kursiv). stil.rygTekst og stil.rygGlød er farven på omslagets
// titel og skæret om omslaget (guld, hvis de mangler), og stil.titelSkala gør forsidens titel mindre (en bred skrift).

const SKRIFT_1600 = "'AtomLab Fell', Georgia, 'Times New Roman', serif";
const SKRIFT_1900 = "'AtomLab Old Standard', Georgia, 'Times New Roman', serif";

export const BØGER = [
  {
    id: 'tycho', navn: 'Tycho Brahe', kort: 'Tycho', år: 1572, ejefald: 'Tycho Brahes', om: 'den nye stjerne', spørgsmål: 'Hvor kom den nye stjerne fra?',
    // kort er 'Tycho' (én linje på omslaget): "TYCHO BRAHE" på to linjer stod oven i årstallet på en telefon (T3)
    titel: 'Den nye stjerne', bygget: true,
    portræt: 'billeder/biblioteket/tycho.webp',
    // København 1573 (docs/drejebog-tycho.md afsnit 3): lyst, varmt papir, sort blæk og en nattehimmelblå ryg med guld
    stil: { papir: '#f2e8d2', papirMørk: '#dfd0ae', blæk: '#1e1a16', ryg: '#1c2a44', rygKant: '#c9a24a', skrift: SKRIFT_1600 },
    tekster: () => import('./opdagelser/tycho.js'),
    // Turen (T2): forløbet i js/data/forloeb/tycho.js og tegningerne i js/bog/tycho.js (hentes, når bogen åbnes)
    forløb: 'den-nye-stjerne',
    scene: () => import('../bog/tycho.js'),
  },
  { id: 'galilei', navn: 'Galileo Galilei', kort: 'Galilei', år: 1610, ejefald: 'Galileis', om: 'Jupiters måner' },
  {
    id: 'huygens', navn: 'Christiaan Huygens', kort: 'Huygens', år: 1656, ejefald: 'Huygens\'', om: 'Saturns ring', titel: 'Saturns ører', bygget: true,
    portræt: 'billeder/biblioteket/huygens.webp',
    stil: { papir: '#efe4cc', papirMørk: '#dccaa4', blæk: '#2b1f17', ryg: '#5b2a1e', rygKant: '#c9a24a', skrift: SKRIFT_1600 },
    tekster: () => import('./opdagelser/huygens.js'),
    // Fortællingen: forløbet i js/data/forloeb/huygens.js og tegningerne i js/bog/huygens.js (hentes, når bogen åbnes)
    forløb: 'saturns-oerer',
    scene: () => import('../bog/huygens.js'),
  },
  {
    id: 'roemer', navn: 'Ole Rømer', kort: 'Rømer', år: 1676, ejefald: 'Ole Rømers', om: 'lyset, der bruger tid', spørgsmål: 'Hvorfor kom Io for sent?',
    // Titlen er navnet på turen (drejebogen afsnit 2, opslag 2)
    titel: 'Himlens ur', bygget: true,
    portræt: 'billeder/biblioteket/roemer.webp',
    // Et videnskabeligt tidsskrift fra 1670'erne (docs/drejebog-roemer.md afsnit 3): lyst papir, lidt koldere end Tychos,
    // sort blæk og en mørk flaskegrøn ryg med guld, så den ikke ligner Huygens' røde eller Tychos blå. Fell-typerne er fra
    // Oxford i 1670'erne, altså fra samme år
    stil: { papir: '#f1ebdc', papirMørk: '#dcd3bd', blæk: '#161513', ryg: '#23402f', rygKant: '#c9a24a', skrift: SKRIFT_1600 },
    tekster: () => import('./opdagelser/roemer.js'),
    // Turen "Himlens ur" (forløb og scene) kommer i R2, som hos Tycho (T1 → T2)
  },
  { id: 'newton', navn: 'Isaac Newton', kort: 'Newton', år: 1687, ejefald: 'Isaac Newtons', om: 'tyngdeloven' },
  { id: 'oersted', navn: 'H.C. Ørsted', kort: 'Ørsted', år: 1820, ejefald: 'H.C. Ørsteds', om: 'strøm og magneter', spørgsmål: 'Hvorfor drejede kompasnålen?' },
  { id: 'curie', navn: 'Marie Curie', kort: 'Curie', år: 1898, ejefald: 'Marie Curies', om: 'stoffer, der stråler',
    // En grå ryg fra R1 (27. november 2026). Spørgsmålet er foreløbigt, til Curies drejebog er skrevet: I april 1898 fandt
    // hun, at to uranmineraler (bl.a. begblende) strålede mere end uranet selv (Comptes rendus, april 1898)
    spørgsmål: 'Hvorfor strålede stenen mere end rent uran?' },
  {
    id: 'einstein', navn: 'Albert Einstein', kort: 'Einstein', år: 1905, ejefald: 'Albert Einsteins', om: 'tiden, lyset og E = mc²',
    spørgsmål: 'Hvad sker der, når lyset er lige hurtigt for alle?',
    // Titlen er navnet på turen (drejebogen afsnit 2, opslag 2)
    titel: 'Lige hurtigt for alle', bygget: true,
    portræt: 'billeder/biblioteket/einstein.webp',
    // Et tysk tidsskrift fra 1905 (docs/drejebog-einstein.md afsnit 3): lyst, let gulnet papir, sort blæk og en mørk
    // bordeaux ryg med sølv, så den ikke ligner Huygens' røde, Tychos blå eller Rømers grønne
    stil: { papir: '#f3eee0', papirMørk: '#ddd4bd', blæk: '#17140f', ryg: '#4a1f2a', rygKant: '#b8b8b8', rygTekst: '#ece7dc', rygGlød: 'rgba(200, 206, 218, 0.35)', skrift: SKRIFT_1900, titelSkala: 0.84 },
    tekster: () => import('./opdagelser/einstein.js'),
    // Turen (E2): forløbet i js/data/forloeb/einstein.js og tegningerne i js/bog/einstein.js (hentes, når bogen åbnes)
    forløb: 'lige-hurtigt',
    scene: () => import('../bog/einstein.js'),
  },
  { id: 'bohr', navn: 'Niels Bohr', kort: 'Bohr', år: 1913, ejefald: 'Niels Bohrs', om: 'elektronernes skaller' },
  { id: 'lehmann', navn: 'Inge Lehmann', kort: 'Lehmann', år: 1936, ejefald: 'Inge Lehmanns', om: 'Jordens indre kerne' },
];

export const bogMed = (id) => BØGER.find((b) => b.id === id) ?? null;
export const byggede = () => BØGER.filter((b) => b.bygget);

// Rækkefølgen, bøgerne bygges i (planen afsnit 2): Huygens først, så de syv andre i tidens rækkefølge, Galilei og Newton
const BYGGES = ['huygens', 'tycho', 'roemer', 'oersted', 'curie', 'einstein', 'bohr', 'lehmann', 'galilei', 'newton'];
export const KOMMENDE_PÅ_HYLDEN = 2; // E20 fund 6 (stilguiden A9): kun det, der findes, og højst to grå rygge

// Bøgerne på hylden i årets rækkefølge: de byggede og de næste to, der skal bygges (grå rygge)
export function påHylden() {
  const kommende = BYGGES.map(bogMed).filter((b) => b && !b.bygget).slice(0, KOMMENDE_PÅ_HYLDEN);
  return [...byggede(), ...kommende].sort((a, b) => a.år - b.år);
}

// Linjen ved en grå ryg: bogens spørgsmål (ikke "kommer senere")
export const rygLinje = (b) => `${b.navn}, ${b.år}: ${b.spørgsmål}`;

// Linjen under hylden (delens kernesætning, docs/plan-videnskabsfolk.md afsnit 1)
export const HYLDE_LINJE = 'De gættede ikke bare. De så efter og målte. Tryk på en bog.';
