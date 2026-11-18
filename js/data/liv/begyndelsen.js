// Delen "Begyndelsen" (L5): laboratoriets paneler, trappens fem trin og de små modeller bag scenerne. Ren data uden
// Three.js, så det kan testes i Node. Turens tekster står i js/data/forloeb/begyndelsen.js, tegningerne i
// js/liv/begyndelsen.js og det, der styrer dem, i js/begyndelsen.js. Kilderne står i docs/fakta-liv/begyndelsen.md.
// Hvert trin på trappen har ét rigtigt forsøg med årstal og hvem (jeres svar 14. november 2026: intet "bland
// ingredienserne"). Panelerne holder budgettet: højst to tal og tre sætninger.

// ---------- Kolben ----------
// Luften: 'miller' (metan, ammoniak og hydrogen over vand, 1953) eller 'co2' (kuldioxid og nitrogen). Kalk i vandet
// (calciumcarbonat som buffer) er Cleaves m.fl. 2008: Uden kalk gav CO₂ og N₂ kun få aminosyrer, med kalk "yields of amino
// acids greatly increased". LYN_FULD lyn giver den fulde farve (i forsøget gik der en uge).
export const LYN_FULD = 3;
export const LUFTEN = {
  miller: { navn: 'Millers luft', gasser: ['metan', 'ammoniak', 'hydrogen'] },
  co2: { navn: 'Kuldioxid og nitrogen', gasser: ['kuldioxid', 'nitrogen'] },
};

// Hvor farvet vandet er (0-1) efter så mange lyn. Uden kalk i den nye luft bliver det kun svagt.
export function kolbeFarve(luft, kalk, lyn) {
  const loft = luft === 'co2' && !kalk ? 0.22 : 1;
  return Math.min(1, lyn / LYN_FULD) * loft;
}

// Hvor mange aminosyrer, ord til panelet
export function aminosyrer(luft, kalk, lyn) {
  if (lyn <= 0) return 'Ingen endnu';
  const f = kolbeFarve(luft, kalk, lyn);
  if (f < 0.3) return 'Få';
  return lyn < LYN_FULD ? 'Nogle' : 'Mange';
}

// Vandets farve: klart blåt → lyserødt → mørkerødt (Millers kolbe, Wikipedia "Miller–Urey experiment": "pink" efter en
// dag og "deep red and turbid" efter en uge). Den nye luft med kalk: gulbrun (forsøgene beskriver ikke en farve, så
// den er kun tegnet anderledes, Ærligt talt siger det).
export const VAND_FARVER = {
  miller: ['#5f8fd6', '#d97aa0', '#9b1f2f'],
  co2: ['#5f8fd6', '#c9a866', '#9a6a2c'],
};

// ---------- RNA'et ----------
// En kort RNA-kæde på 12 bogstaver. QT45 har 45, men 12 kan ses på tablet på højkant (som Kopien i Liv). Bogstaverne er
// valgt af os, ikke QT45's.
export const RNA_START = 'GAUCCGAUAGCU';
export const RNA_PAR = { A: 'U', U: 'A', G: 'C', C: 'G' };
export const RNA_FEJL_TUR = 7; // i turen bliver bogstav 8 forkert (altid det samme, så testene er stabile)
export const RNA_RIGTIGE = 0.941; // QT45: 94,1 % rigtige bogstaver (PMC7618777)

// Den kopi, der bliver bygget: et bogstav pr. plads, og om det er forkert. tilfældig() giver et tal mellem 0 og 1.
export function lavRnaKopi(skabelon = RNA_START, { fejl = null, tilfældig = Math.random } = {}) {
  return [...skabelon].map((b, i) => {
    const forkert = fejl == null ? tilfældig() > RNA_RIGTIGE : i === fejl;
    if (!forkert) return { b: RNA_PAR[b], fejl: false };
    const andre = ['A', 'U', 'G', 'C'].filter((x) => x !== RNA_PAR[b]);
    return { b: andre[Math.floor(tilfældig() * andre.length) % andre.length], fejl: true };
  });
}

// ---------- Trappen ----------
// Fem trin fra stoffer uden liv til en celle (drejebogen: byggesten ✓, hinder ✓, kæder ½, en kopi ½ og en celle ✗).
// nået: 1 (nået), 0,5 (halvvejs) eller 0. tur: trinet er en del af turen (de tre, der lyser i turens trin 5).
// Forsøgene: Miller 1953 (Science 117:528), Deamer 1985 (Nature 317:792, fedtagtige stoffer fra Murchison), Ferris,
// Hill, Liu og Orgel 1996 (Nature 381:59, "oligomers up to 55 monomers long" på ler, med aktiverede byggesten og
// "successive feedings"), Gianni m.fl. 2026 (Science 391:1022, QT45).
export const TRAPPEN = [
  {
    id: 'byggesten', navn: 'Byggesten', nået: 1, tur: true,
    tekst: 'Aminosyrer kan laves af gas, vand og lyn. De findes også i sten fra rummet, fx i prøverne fra asteroiden Bennu.',
    tal: [{ navn: 'Forsøget', værdi: '1953' }, { navn: 'Hvem', værdi: 'Stanley Miller' }],
  },
  {
    id: 'hinder', navn: 'Hinder', nået: 1, tur: true,
    tekst: 'Fedtstoffer laver selv små bobler i vand. Det gjorde også fedtagtige stoffer fra en meteorit, der faldt i Australien i 1969.',
    tal: [{ navn: 'Forsøget', værdi: '1985' }, { navn: 'Hvem', værdi: 'David Deamer' }],
  },
  {
    id: 'kaeder', navn: 'Kæder', nået: 0.5, tur: false,
    tekst: 'Byggestenene skal sættes sammen i lange kæder, men i vand går kæderne let i stykker. På ler blev der kæder med op til 55 led, men kun med byggesten, som forskerne havde gjort klar.',
    tal: [{ navn: 'Forsøget', værdi: '1996' }, { navn: 'Hvem', værdi: 'James Ferris og kolleger' }],
  },
  {
    id: 'kopi', navn: 'En kopi', nået: 0.5, tur: true,
    tekst: 'Et lille RNA, QT45, byggede en kopi af sig selv. Det tog 72 dage i is, og forskerne gav det byggestykker af tre bogstaver.',
    tal: [{ navn: 'Forsøget', værdi: '2026' }, { navn: 'Hvem', værdi: 'Gianni og kolleger' }],
  },
  {
    id: 'celle', navn: 'En celle', nået: 0, tur: false, top: true,
    tekst: 'Noget, der kører af sig selv og kan udvikle sig. Ingen har lavet det af stoffer uden liv, og ingen ved, hvordan det skete første gang.',
    tal: [{ navn: 'Nået', værdi: 'Ingen endnu' }],
  },
];

// ---------- Panelerne ----------
// Kolben efter luften og kalken. Tallene (Forsøget og Aminosyrer) sættes ind af js/begyndelsen.js.
export const KOLBE_PANEL = {
  miller: {
    titel: 'Millers kolbe',
    tekst: 'Metan, ammoniak og hydrogen over kogende vand, og gnister som lyn. Efter en uge var vandet mørkerødt og fuldt af nye stoffer. Miller fandt fem slags aminosyrer.',
    forsøg: '1953, Stanley Miller',
  },
  co2: {
    titel: 'Ny luft',
    tekst: 'Kuldioxid og nitrogen gav kun få aminosyrer. Gnisterne laver også stoffer, der ødelægger dem. Prøv med kalk i vandet.',
    forsøg: '2008, Cleaves og kolleger',
  },
  kalk: {
    titel: 'Ny luft med kalk',
    // Wikipedia om Cleaves 2008: "added calcium carbonate to buffer the aqueous solution and ascorbic acid to inhibit
    // oxidation", og "seawater would likely still be buffered and ferrous iron could inhibit oxidation"
    tekst: 'Med kalk og lidt C-vitamin i vandet blev der mange flere aminosyrer. Forskerne mener, at havet kan have virket på samme måde.',
    forsøg: '2008, Cleaves og kolleger',
  },
};

export const BOBLE_PANEL = {
  titel: 'Bobler af fedtstof',
  tekst: 'Hvert fedtstof har et hoved, der kan lide vand, og en hale, der skyr det. Halerne gemmer sig inde i et dobbelt lag, og laget lukker sig til en boble.',
  tal: [{ navn: 'Forsøget', værdi: '1985' }, { navn: 'Hvem', værdi: 'David Deamer' }],
};

export const RNA_PANEL = {
  titel: 'Et RNA, der kopierer',
  tekst: 'RNA kan både bære en opskrift og arbejde som et værktøj. QT45 byggede en kopi af sig selv, men kun ca. hver femtende kopi var helt uden fejl.',
  tal: [{ navn: 'Forsøget', værdi: '2026' }, { navn: 'Rigtige bogstaver', værdi: 'Ca. 94 %' }],
};

export const TRAPPE_PANEL = {
  titel: 'Trappen',
  tekst: 'Fem trin fra stoffer uden liv til en celle. To har forskerne nået, to er de halvvejs med, og det øverste har ingen nået. Tryk på et trin.',
  tal: [],
};

// De fire "Hvorfor?"-kort (js/data/hvorfor.js), højst fire fremme ad gangen
export const BEG_KORT = ['begLavet', 'begRummet', 'begHvor', 'begHvornaar'];
