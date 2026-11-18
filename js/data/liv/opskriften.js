// Liv, fanen Opskriften (L1): zoom-rejsen fra cellen ind til atomerne, "Byg stigen" og opgaverne. Kun tal og tekst.
// Kilderne står i docs/fakta-liv/dna-stigen.md og docs/fakta-liv.md (kromosomet og perlerne: OpenStax 10-1).

import { PARTNER, STOR } from './stige.js';
import { HBB } from './gener.js';
import { OPGAVER_PROTEIN } from './protein.js';
import { OPGAVER_KOPI } from './kopien.js';

// Begyndelsen af genet HBB (β-kæden i hæmoglobin), de første ti kodoner (NCBI RefSeq NM_000518.5, docs/fakta-liv.md).
// Det er streng I, læst fra 5' mod 3' (opad i stigen).
export const HBB_START = HBB.dna.slice(0, 30);

// Trinene på rejsen, udefra og ind. tal: [navn, værdi], højst to (budgettet i docs/retning.md: højst to tal og tre
// sætninger fremme). nørd: { tal, tekst }, det, der står øverst i "For nørder" ved trinet. ekstra: en linje under tallene.
// hvorfor: et eller flere "Hvorfor?"-kort (id'er i js/data/hvorfor.js), højst fire spørgsmål i panelet.
export const NIVEAUER = [
  {
    id: 'celle', knap: 'Cellen', titel: 'En af dine celler',
    tekst: 'Du er bygget af billioner af celler, og det her er én af dem. I dens cellekerne (den violette kugle) ligger næsten hele opskriften på dig: dit DNA. Zoom ind mod cellekernen.',
    tal: [['Celler i en voksen', 'ca. 30 billioner'], ['Cellekernens bredde', 'ca. 0,006 mm']],
    nørd: { tekst: 'Et barn har færre celler end en voksen. Røde blodlegemer har ingen cellekerne, og de er langt de fleste af dine celler. 0,006 mm er 6 µm (mikrometer).' },
  },
  {
    id: 'kerne', knap: 'Cellekernen', titel: 'Cellekernen',
    tekst: 'Inde i cellekernen er DNA\'et delt i 46 lange tråde, kromosomerne. Du har dem i 23 par: et sæt fra din mor og et fra din far. Her har hvert par sin egen farve.',
    tal: [['Kromosomer', '46 (23 par)'], ['Trukket helt ud', 'ca. 2 m DNA']],
    nørd: {
      tal: [['Basepar i alt', 'ca. 6,1 milliarder']],
      tekst: 'Var cellekernen en kugle på 10 cm, ville tråden være ca. 33 km lang og tyndere end et hår fra dit hoved.',
    },
    hvorfor: ['livForaeldre'], // L3, kort 2
  },
  {
    id: 'kromosom', knap: 'Kromosomet', titel: 'Kromosomet',
    tekst: 'Et kromosom er én meget lang DNA-tråd. Den er viklet om små kugler af protein (histoner) som perler på en snor, og perlerne er rullet sammen igen og igen. Det ligner kun et X lige før cellen deler sig.',
    tal: [['DNA-tråden', 'ca. 2 nm bred'], ['Viklet om perlerne', 'ca. 7 gange kortere']],
    nørd: {
      tal: [['Perlerne', 'ca. 10 nm brede']],
      tekst: 'nm (nanometer) er en milliontedel af en millimeter. Før cellen deler sig, bliver DNA\'et kopieret, og de to ens kopier hænger sammen ét sted. Det er X\'et.',
    },
  },
  {
    id: 'stige', knap: 'Stigen', titel: 'Stigen (dobbeltspiralen)',
    tekst: 'DNA er en snoet stige. Siderne er sukker og fosfat, og hvert trin er to baser, der passer sammen: A med T og G med C. Stigen her er begyndelsen af et af generne for hæmoglobin, der bærer ilt rundt i dit blod.',
    tal: [['Trin pr. omgang', 'ca. 10,5'], ['Bredde', 'ca. 2 nm']],
    nørd: {
      tal: [['Afstand mellem trin', 'ca. 0,34 nm']],
      tekst: 'A og G er store baser (to ringe), T og C små (én ring). Et trin er altid en stor og en lille, så stigen er lige bred hele vejen.',
    },
    hvorfor: ['livSammen', 'livStigen'], // L3, kort 1: Hvem fandt stigen?
  },
  {
    id: 'atomer', knap: 'Atomerne', titel: 'Atomerne',
    tekst: 'Helt tæt på ser du hvert atom. DNA er lavet af kun fem slags: C, H, N, O og P. De gule streger er hydrogenbindinger: Et H, der er lidt plus (δ+), trækker i et N eller O i den anden base, der er lidt minus (δ−), ligesom i vand.',
    tal: [['A–T holder fast med', '2 hydrogenbindinger'], ['G–C holder fast med', '3 hydrogenbindinger']],
    nørd: {
      tal: [['Atomer i et trin', '63-64']],
      tekst: 'Sluk for "Vis hydrogen" for at se, hvor få atomer der er tilbage: 41 i hvert trin.',
    },
    hvorfor: 'livSammen',
  },
];
export const NIVEAU_IDER = NIVEAUER.map((n) => n.id);

export const OPGAVER_LIV = [
  {
    id: 'liv-rejse', titel: 'Rejs fra cellen helt ind til atomerne', tip: 'Zoom ind, eller tryk på knapperne fra Cellen til Atomerne.',
    fakta: 'Cellekernen er ca. 6 µm bred, og DNA-stigen er ca. 2 nm. Cellekernen er altså ca. 3.000 gange bredere end stigen.',
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
  ...OPGAVER_KOPI, // L3: "Leg frit: Kopien" (js/data/liv/kopien.js)
  // L4: "Leg frit: pladen" (js/liv-fejlen.js). Står her og ikke i js/data/liv/plade.js, så menuen ikke henter modellen.
  // Baym m.fl. 2016, fig. 2: "unable to adapt directly from zero to the highest concentration" (3.000 gange).
  {
    id: 'liv-spring', titel: 'Spring båndene over', tip: 'Slå "Uden mellemtrin" til i Leg frit: pladen, og se, om bakterierne kommer igennem.',
    fakta: 'I det rigtige forsøg kom bakterierne aldrig direkte fra ingen medicin til 3.000 gange så meget. De skulle bruge båndene imellem, én fejl ad gangen.',
  },
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
