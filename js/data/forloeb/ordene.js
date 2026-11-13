// Forløbet "Hvad står der i opskriften?" i Liv (Serie 1, nr. 2, forløb 2 af 2). Ren data uden Three.js, så det kan testes
// i Node. Drejebogen står i docs/fable/E3-liv-drejebog.md (med rettelserne i docs/fable/E5-liv.md, afsnit 6) og skabelonen
// i docs/fable/E3-forloeb.md. Drejebogens trin 4 er delt i to (4: seglcelle-skiftet, 5: dit eget skift), så hvert trin har
// én handling, og drejebogens trin 5 er "Det så du". Det, der rører scenen, står i js/liv-ordene.js under samme trin-id.
// Scenen viser DNA (T, ikke U) og ingen RNA, ribosom eller kodehjul: Det er filmen bagefter ("Se genet blive læst").
// Fakta: docs/fakta-liv/ (64 ord, 444 bogstaver og 147 aminosyrer, stop, hæmoglobin og seglcellen i ord 7).

import { HBB, SEGL_KODON } from '../liv/gener.js';
import { AMINOSYRER, STOP, aminosyre, kodoner, oversæt } from '../liv/kode.js';

export const ORDENE = {
  id: 'ordene',
  del: 'liv',
  titel: 'Hvad står der i opskriften?',
  // Ikke drejebogens "Hvert ord er én byggesten": 3 af de 64 ord betyder stop (Fable E5, afsnit 6)
  kernesætning: 'Cellen læser bogstaverne tre ad gangen. Hvert ord betyder en byggesten eller stop, og kæden af byggesten er et protein. Ét forkert bogstav kan ændre proteinet.',
  trin: [
    {
      id: 'ord',
      spørg: 'Cellen læser tre bogstaver ad gangen: ét ord. Hvor mange ord kan fire bogstaver give?',
      gæt: {
        valg: [
          { tekst: '12', efter: 'Tryk på et ord i opskriften.' },
          { tekst: '64', efter: 'Tryk på et ord i opskriften.' },
          { tekst: '444', efter: 'Tryk på et ord i opskriften.' },
        ],
      },
      gør: 'Tryk på et ord i opskriften.',
      // 4 × 4 × 4 = 64. 61 betyder en aminosyre, og TAA, TAG og TGA betyder stop (Fable E5: ellers kommer stoppet som
      // en overraskelse i trin 3)
      så: '64 ord. 61 af ordene betyder en byggesten, og 3 betyder stop. Byggestenene hedder aminosyrer.',
      ord: ['aminosyre'],
    },
    {
      id: 'ordbog',
      // ATG er start-ordet og giver methionin, den første byggesten (den klippes af senere, det står under "For nørder")
      spørg: 'Nu er du cellen. ATG betyder start og den første byggesten. Slå de næste ord op.',
      gør: 'Find ordet, der lyser, i ordbogen.',
      så: 'Ord for ord bliver bogstaverne til en kæde af byggesten.',
      ord: [],
    },
    {
      id: 'resten',
      spørg: 'Hele opskriften her har 444 bogstaver. Hvor mange byggesten bliver det til?',
      gæt: {
        valg: [
          { tekst: '444', efter: 'Tryk "Læs resten", og se kæden.' },
          { tekst: 'Ca. 150', efter: 'Tryk "Læs resten", og se kæden.' },
          { tekst: '3', efter: 'Tryk "Læs resten", og se kæden.' },
        ],
      },
      gør: 'Tryk "Læs resten", og se kæden.',
      // 444 / 3 = 148 ord, og det sidste (TAA) er stop. "En af de fire kæder" (Fable E5): hæmoglobin har to α- og to
      // β-kæder, og HBB er opskriften på β-kæden. 147 er det, cellen bygger (den første M klippes af, så 146 i den færdige).
      så: '147, for det sidste ord betyder stop. Kæden er et protein, en af de fire kæder i hæmoglobin, der bærer ilt.',
      ord: ['protein'],
    },
    {
      id: 'segl',
      spørg: 'Ord 7 lyser. Hvad sker der, hvis ét af bogstaverne er forkert?',
      gæt: {
        valg: [
          { tekst: 'Ingenting', efter: 'Skift A\'et i midten til T.' },
          { tekst: 'Én byggesten bliver en anden', efter: 'Skift A\'et i midten til T.' },
          { tekst: 'Kæden bliver for kort', efter: 'Skift A\'et i midten til T.' },
        ],
      },
      gør: 'Skift A\'et i midten til T.',
      // "… hvis man har ændringen fra både sin mor og sin far" (Fable E5): med den fra kun den ene er man bærer og
      // bliver normalt ikke syg (genome.gov). Saglig og kort: et barn i klassen kan have sygdommen.
      så: 'Én byggesten ud af 147 blev en anden. Har man ændringen fra både sin mor og sin far, giver den sygdommen seglcelleanæmi.',
      ord: [],
    },
    {
      id: 'selv',
      spørg: 'Prøv selv: Tryk på et ord, og skift et bogstav. Hvad sker der?',
      gør: 'Tryk på et ord, vælg et bogstav, og skift det.',
      // De tre gæt fra trin 4: et skift, der giver samme aminosyre (næsten altid ingenting), en anden aminosyre, eller stop
      så: 'Alle tre gæt var rigtige: ingenting, en anden byggesten eller stop for tidligt. Sådan et skift er en mutation.',
      ord: ['mutation'],
    },
  ],
};

// Opskriften i forløbet: de første 10 ord i genet HBB (ATG GTG CAT CTG ACT CCT GAG GAG AAG TCT)
export const ORD_ANTAL = 10;
export const ORD_START = HBB.dna.slice(0, 3 * ORD_ANTAL);
export const ANTAL_BYGGESTEN = HBB.protein.length; // 147
// Den lille ordbog i trin 2 (tjekket mod kodetabellen af Fable, E5 afsnit 6): ordene 2-5 i genet. De tre første slås op.
export const ORDBOG = ['GTG', 'CAT', 'CTG', 'ACT'].map((ord) => ({ ord, aa: aminosyre(ord), navn: AMINOSYRER[aminosyre(ord)].navn }));
export const SLÅ_OP = [1, 2, 3]; // ordene (0-baseret), man slår op
export const SEGL = { ord: SEGL_KODON, plads: 1, til: 'T' }; // GAG → GTG

const stort = (s) => s.replace(/^./, (c) => c.toUpperCase());
export const byggestenNavn = (aa) => (aa === STOP ? 'stop' : AMINOSYRER[aa].navn);

// Hvad et skift gjorde, med forløbets ord (byggesten og ord, ikke kodon, ribosom og RNA).
// før og nu: DNA'et (30 bogstaver) før og efter, i: ordet (0-baseret). Giver { type, titel, tekst }.
// type: 'tilbage', 'tavs', 'stop', 'segl' eller 'anden' (som vurderSkift i js/data/liv/protein.js).
export function skiftIForløb(før, nu, i) {
  const ord0 = kodoner(før)[i];
  const ord1 = kodoner(nu)[i];
  const a0 = aminosyre(ord0);
  const a1 = aminosyre(ord1);
  const nr = i + 1;
  if (ord1 === kodoner(ORD_START)[i]) {
    return { type: 'tilbage', titel: 'Som i opskriften igen', tekst: `Ord ${nr} er ${ord1} igen: ${byggestenNavn(a1)}.` };
  }
  if (a1 === STOP) {
    const { stop } = oversæt(nu);
    return {
      type: 'stop', titel: 'Stop for tidligt',
      tekst: `${ord0} → ${ord1}: ${ord1} betyder stop. Kæden stopper efter ${stop} byggesten i stedet for ${ANTAL_BYGGESTEN}. Så kort et stykke kan ikke bære ilt.`,
    };
  }
  if (a1 === a0) {
    return {
      type: 'tavs', titel: 'Den samme byggesten',
      tekst: `${ord0} → ${ord1}: Begge ord betyder ${byggestenNavn(a1)}. Proteinet bliver det samme. Sådan et skift gør næsten altid ingenting.`,
    };
  }
  if (i === SEGL.ord && a1 === 'V') {
    return {
      type: 'segl', titel: 'Seglcelleanæmi',
      tekst: `${ord0} → ${ord1}: Glutaminsyre bliver til valin. Har man ændringen fra både sin mor og sin far, klumper hæmoglobinet sammen, og de røde blodlegemer bliver krumme som en segl.`,
    };
  }
  if (a0 === STOP) {
    return { type: 'anden', titel: 'Stoppet er væk', tekst: `${ord0} → ${ord1}: Ord ${nr} betyder nu ${byggestenNavn(a1)}, og kæden fortsætter.` };
  }
  return {
    type: 'anden', titel: 'En anden byggesten',
    tekst: `${ord0} → ${ord1}: ${stort(byggestenNavn(a0))} bliver til ${byggestenNavn(a1)}. Én byggesten er nu en anden.`,
  };
}
