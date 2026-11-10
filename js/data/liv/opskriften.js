// Liv, fanen Opskriften (L1): zoom-rejsen fra cellen ind til atomerne, "Byg stigen" og opgaverne. Kun tal og tekst.
// Kilderne står i docs/fakta-liv/dna-stigen.md og docs/fakta-liv.md (kromosomet og perlerne: OpenStax 10-1).

import { PARTNER, STOR } from './stige.js';
import { HBB } from './gener.js';
import { OPGAVER_PROTEIN } from './protein.js';

// Begyndelsen af genet HBB (β-kæden i hæmoglobin), de første ti kodoner (NCBI RefSeq NM_000518.5, docs/fakta-liv.md).
// Det er streng I, læst fra 5' mod 3' (opad i stigen).
export const HBB_START = HBB.dna.slice(0, 30);

// Trinene på rejsen, udefra og ind. tal: [navn, værdi]. ekstra: en linje under tallene.
export const NIVEAUER = [
  {
    id: 'celle', knap: 'Cellen', titel: 'En af dine celler',
    tekst: 'Din krop er bygget af ca. 30 billioner celler. Cellen her har en kerne (den violette kugle), og i kernen ligger hele opskriften på dig: dit DNA. Zoom ind mod kernen.',
    tal: [['Celler i din krop', 'ca. 30 billioner'], ['Kernens bredde', 'ca. 6 µm']],
    ekstra: 'µm (mikrometer) er en tusindedel af en millimeter. Røde blodlegemer har ingen kerne, og de er ca. 84 % af dine celler.',
  },
  {
    id: 'kerne', knap: 'Kernen', titel: 'Cellekernen',
    tekst: 'Inde i kernen er DNA\'et delt i 46 lange tråde, kromosomerne. Du har 23 par: Det ene sæt har du fra din mor og det andet fra din far. Her har hvert par sin egen farve.',
    tal: [['Kromosomer', '46 (23 par)'], ['Basepar i alt', 'ca. 6,1 milliarder'], ['Trukket helt ud', 'ca. 2 m DNA']],
    ekstra: 'Var kernen en kugle på 10 cm, ville tråden være ca. 33 km lang og tyndere end et hår fra dit hoved.',
  },
  {
    id: 'kromosom', knap: 'Kromosomet', titel: 'Kromosomet',
    tekst: 'Et kromosom er én meget lang DNA-tråd. Den er viklet om små kugler af protein (histoner) som perler på en snor, og perlerne er rullet sammen igen og igen.',
    tal: [['Perlerne', 'ca. 10 nm brede'], ['DNA-tråden', 'ca. 2 nm bred'], ['Viklet om perlerne', 'ca. 7 gange kortere']],
    ekstra: 'nm (nanometer) er en milliontedel af en millimeter. Et kromosom ligner kun et X lige før cellen deler sig: Så er DNA\'et kopieret, og de to ens kopier hænger sammen ét sted.',
  },
  {
    id: 'stige', knap: 'Stigen', titel: 'Stigen (dobbeltspiralen)',
    tekst: 'DNA er en snoet stige. Siderne er sukker og fosfat. Hvert trin er to baser, der passer sammen: A med T og G med C. Stigen her er begyndelsen af et af generne for hæmoglobin, der bærer ilt rundt i dit blod.',
    tal: [['Trin pr. omgang', 'ca. 10,5'], ['Afstand mellem trin', 'ca. 0,34 nm'], ['Bredde', 'ca. 2 nm']],
    ekstra: 'A og G er store baser (to ringe), T og C små (én ring). Et trin er altid en stor og en lille, så stigen er lige bred hele vejen.',
    hvorfor: 'livSammen',
  },
  {
    id: 'atomer', knap: 'Atomerne', titel: 'Atomerne',
    tekst: 'Helt tæt på ser du hvert atom. DNA er lavet af kun fem slags: C, H, N, O og P. De gule streger er hydrogenbindinger: Et H, der er lidt plus (δ+), trækker i et N eller O i den anden base, der er lidt minus (δ−), ligesom i vand.',
    tal: [['A–T holder fast med', '2 hydrogenbindinger'], ['G–C holder fast med', '3 hydrogenbindinger'], ['Atomer i et trin', '63-64']],
    ekstra: 'Sluk for "Vis hydrogen" for at se, hvor få atomer der er tilbage: 41 i hvert trin.',
    hvorfor: 'livSammen',
  },
];
export const NIVEAU_IDER = NIVEAUER.map((n) => n.id);

export const OPGAVER_LIV = [
  {
    id: 'liv-rejse', titel: 'Rejs fra cellen helt ind til atomerne', tip: 'Zoom ind, eller tryk på knapperne fra Cellen til Atomerne.',
    fakta: 'Kernen er ca. 6 µm bred, og DNA-stigen er ca. 2 nm. Kernen er altså ca. 3.000 gange bredere end stigen.',
  },
  {
    id: 'liv-forkert', titel: 'Prøv et par, der ikke passer', tip: 'Tryk "Byg stigen", og vælg fx A over for A.',
    fakta: 'Et trin er altid en stor base (A eller G) og en lille (T eller C), og plus skal stå over for minus. Derfor passer kun A–T og G–C.',
  },
  {
    id: 'liv-byg', titel: 'Byg en stige med 8 trin', tip: 'Tryk "Byg stigen", og vælg partneren til hver base.',
    fakta: 'Fordi A altid passer til T og G til C, bestemmer den ene halvdel af stigen den anden. Det bruger cellen, når den kopierer sit DNA.',
  },
  ...OPGAVER_PROTEIN, // L2: fra opskrift til protein (js/data/liv/protein.js)
];

export const BYG_TRIN = 8;

// En ny streng at bygge på: BYG_TRIN baser, hvor alle fire er med (tilfældig: en funktion, der giver tal i [0, 1))
export function nyByggestreng(tilfældig = Math.random) {
  for (;;) {
    let s = '';
    for (let i = 0; i < BYG_TRIN; i++) s += 'ATGC'[Math.floor(tilfældig() * 4)];
    if ([...'ATGC'].every((b) => s.includes(b))) return s;
  }
}

// Hvorfor passer to baser ikke? 'passer', 'bred' (to store), 'smal' (to små) eller 'ladning' (en stor og en lille,
// men plus og minus står forkert: A–C og G–T)
export function parGrund(a, b) {
  if (PARTNER[a] === b) return 'passer';
  if (STOR[a] && STOR[b]) return 'bred';
  if (!STOR[a] && !STOR[b]) return 'smal';
  return 'ladning';
}

export const PAR_TEKST = {
  passer: (a, b) => ({
    titel: `${a}–${b} passer`,
    tekst: a === 'A' || a === 'T' ? 'A og T holder fast i hinanden med to hydrogenbindinger.' : 'G og C holder fast i hinanden med tre hydrogenbindinger.',
  }),
  bred: (a, b) => ({
    titel: `${a}–${b}: for bred`,
    tekst: 'A og G er begge store baser med to ringe. To store baser kan ikke være mellem siderne af stigen. Et trin er altid en stor og en lille base.',
  }),
  smal: (a, b) => ({
    titel: `${a}–${b}: for smal`,
    tekst: 'T og C er begge små baser med én ring. To små baser når ikke hinanden, så der bliver et hul i trinet.',
  }),
  ladning: (a, b) => ({
    titel: `${a}–${b} holder ikke`,
    tekst: 'Bredden passer, men plus og minus står forkert: Et H (δ+) står over for et H, og et N eller O (δ−) over for et N eller O. Så skubber de i stedet for at holde fast. Kun A–T og G–C får plus over for minus.',
  }),
};
