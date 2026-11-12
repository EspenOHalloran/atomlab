// Liv L2, fra opskrift til protein: teksterne til hvert trin, opgaverne og hvad et skift af ét bogstav gør.
// Kun tal og tekst, kan testes i Node. Kilderne står i docs/fakta-liv/dna-opskriften.md (afsnit 3) og
// docs/fakta-liv.md ("Opus' egne opslag" og "L2"): OpenStax Biology 2e 3-4, 3-5, 15-1, 15-2, 15-4, 15-5, 19-2, 39-4 og 40-2.

import { KODE, STOP, AMINOSYRER, aminosyre, aaNavn, oversæt, kodoner, naboer, tilRNA } from './kode.js';
import { HBB, LÆS_KODONER, SEGL_KODON } from './gener.js';

export const ANTAL_AA = HBB.protein.length; // 147

// Trinene, når genet bliver læst. tal: [navn, værdi]. Værdier med {n} og {ord} skrives af js/liv-protein.js.
export const TRIN_PROTEIN = {
  aflæs: {
    titel: 'Aflæsningen',
    tekst: 'Et enzym (RNA-polymerase) åbner et lille stykke af stigen og læser den ene streng. Samtidig bygger det en kopi af genet: RNA. Det er en enkelt streng, og U står i stedet for T.',
    tal: [['Genet', 'HBB (hæmoglobin)'], ['Bogstaver i opskriften', '444'], ['Kopien', 'RNA (A, U, G og C)'], ['Bygget', '{n}']],
    ekstra: 'Baserne i RNA\'et passer til den streng, der bliver læst. Derfor har kopien de samme bogstaver som den anden streng, bare med U i stedet for T.',
  },
  ud: {
    titel: 'Ud af kernen',
    tekst: 'RNA-kopien bliver klippet til og sendt ud af kernen. Derude venter ribosomerne, der skal læse den. DNA\'et bliver i kernen.',
    tal: [['RNA\'et', '444 bogstaver i opskriften'], ['Ord på tre bogstaver', '148']],
    ekstra: 'Et enzym får en bestemt kemisk reaktion til at ske. Næsten alle enzymer er proteiner, og RNA-polymerasen er et af dem.',
  },
  oversæt: {
    titel: 'Ribosomet',
    tekst: 'Ribosomet læser RNA\'et tre bogstaver ad gangen. Hvert ord hedder et kodon. Små budbringere (tRNA) kommer med den aminosyre, der passer til ordet, og kæden vokser.',
    tal: [['Ordet nu', '{ord}'], ['Aminosyrer i kæden', '{n}'], ['I celler som dine', 'ca. 5-6 i sekundet']],
    ekstra: 'Bunden af hver budbringer har tre baser, der passer til ordet: A til U og G til C, ligesom i stigen.',
  },
  fold: {
    titel: 'Proteinet',
    tekst: 'Ved ordet "stop" slipper ribosomet kæden, og den folder sig til en bestemt form. De aminosyrer, der skyr vand (gule), gemmer sig inde i midten.',
    tal: [['Aminosyrer', '147'], ['Proteinet', 'β-kæden i hæmoglobin']],
    ekstra: 'Den første aminosyre klippes af bagefter, så kæden i blodet har 146. To β-kæder og to α-kæder bliver til ét hæmoglobin, der kan bære fire iltmolekyler (O₂).',
  },
  læs: {
    titel: 'Læs selv',
    tekst: 'Nu er du ribosomet. Find ordet i kodehjulet: det første bogstav i midten, det andet i næste ring og det tredje yderst. Vælg så den aminosyre, der passer.',
    tal: [['Ordet nu', '{ord}'], ['Læst', '{n} af 9']],
    ekstra: 'De fleste aminosyrer har flere ord. Leucin (L) har fx seks.',
  },
  ret: {
    titel: 'Skift et bogstav',
    tekst: 'Et skift af ét bogstav i DNA\'et er en mutation. Skift et bogstav i genet, og se, hvad der sker med proteinet.',
    tal: [['Kodonet', '{ord}'], ['Proteinet', '{n}']],
    ekstra: '',
    hvorfor: 'livSegl',
  },
};

export const OPGAVER_PROTEIN = [
  {
    id: 'liv-protein', titel: 'Se et gen blive til et protein', tip: 'Tryk "Se genet blive læst", og se det hele til ende (⏩ går hurtigere).',
    fakta: 'Ribosomet bygger en kæde på 147 aminosyrer. Den første klippes af bagefter, og resten er β-kæden i hæmoglobin. Et typisk protein i din krop har ca. 375 aminosyrer.',
  },
  {
    id: 'liv-læs', titel: 'Læs de første 9 ord i genet', tip: 'Tryk "Læs selv", og find hvert ord i kodehjulet.',
    fakta: 'De første 9 ord giver MVHLTPEEK. Koden er næsten den samme i alt liv, fra bakterier til dig.',
  },
  {
    id: 'liv-segl', titel: 'Lav den ændring, der giver seglcelleanæmi', tip: 'Tryk "Skift et bogstav". Kodon 7 er GAG (glutaminsyre). Lav det om til valin (V).',
    fakta: 'GAG → GTG gør glutaminsyre til valin. Har man ændringen fra både sin mor og sin far, klumper hæmoglobinet sammen i lange tråde, når det har afleveret ilten. Så bliver de røde blodlegemer krumme som en segl.',
  },
  {
    id: 'liv-tavs', titel: 'Find et skift, der ikke gør noget', tip: 'Skift det tredje bogstav i et ord. Mange aminosyrer har flere ord.',
    fakta: 'Mange mutationer gør ingenting, nogle skader, og nogle få hjælper. Dem, der hjælper, bliver oftere givet videre, fordi den, der har dem, får flere børn. Sådan udvikler livet sig over meget lang tid.',
  },
  {
    id: 'liv-stop', titel: 'Lav et stop for tidligt', tip: 'Der er tre stop-ord: TAA, TAG og TGA. Kan du lave et af dem med ét skift?',
    fakta: 'Et stop for tidligt giver et alt for kort protein, der ikke kan gøre sit arbejde.',
  },
  {
    id: 'liv-skriv', titel: 'Skriv LIV med aminosyrer', tip: 'Kodon 4 giver allerede L (leucin). Gør kodon 5 til I og kodon 6 til V.',
    fakta: 'Aminosyrerne har hver sit bogstav, men ikke alle bogstaver findes. Der er fx ingen B, J, O, U, X eller Z blandt de 20 almindelige, og slet ingen Æ, Ø eller Å.',
  },
];

// Starten af genet, som man kan læse og skifte bogstaver i
export const LÆS_START = HBB.dna.slice(0, 3 * LÆS_KODONER);
export const LÆS_ANTAL = 9; // så mange ord skal læses i "Læs selv"

// Fire svar at vælge mellem til et kodon: det rigtige og tre, man får ved at skifte et bogstav (eller tilfældige).
// tilfældig: en funktion, der giver tal i [0, 1). Giver aminosyrernes bogstaver i tilfældig rækkefølge.
export function svarFor(kodon, tilfældig = Math.random) {
  const rigtig = aminosyre(kodon);
  const andre = naboer(kodon);
  const alle = Object.keys(AMINOSYRER).filter((a) => a !== rigtig && !andre.includes(a));
  const bland = (l) => l.map((x) => [tilfældig(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const forkerte = [...bland(andre), ...bland(alle)].slice(0, 3);
  return bland([rigtig, ...forkerte]);
}

// Hvad et skift i kodon nr. i gør. før og nu: hele stykket (DNA), før er genet, som det var før skiftet.
// Giver { type, titel, tekst, protein, stop } tilbage. type: 'tilbage', 'tavs', 'stop', 'segl', 'skrevet' eller 'anden'.
export function vurderSkift(før, nu, i) {
  const ord0 = kodoner(før)[i];
  const ord1 = kodoner(nu)[i];
  const a0 = aminosyre(ord0);
  const a1 = aminosyre(ord1);
  const { protein, stop } = oversæt(nu);
  const nr = i + 1;
  const ud = { protein, stop, kodon: ord1, aa: a1 };
  const original = kodoner(LÆS_START)[i];
  if (ord1 === original) {
    return { ...ud, type: 'tilbage', titel: 'Som i genet igen', tekst: `Kodon ${nr} er ${ord1} igen: ${aaNavn(a1)}.` };
  }
  if (a1 === STOP) {
    return {
      ...ud, type: 'stop', titel: 'Stop for tidligt',
      tekst: `${ord1} er et stop-ord. Ribosomet slipper kæden efter ${stop} aminosyre${stop === 1 ? '' : 'r'}, men proteinet skal have ${ANTAL_AA}. Så kort et stykke kan ikke bære ilt.`,
    };
  }
  if (a1 === a0) {
    return {
      ...ud, type: 'tavs', titel: 'Samme aminosyre',
      tekst: `${ord0} → ${ord1}: Begge ord giver ${aaNavn(a1)}. Proteinet bliver det samme. Sådan et skift gør næsten altid ingenting.`,
    };
  }
  if (i === SEGL_KODON && a1 === 'V') {
    return {
      ...ud, type: 'segl', titel: 'Seglcelleanæmi',
      tekst: `${ord0} → ${ord1}: Glutaminsyre bliver til valin. Har man ændringen fra både mor og far, klumper hæmoglobinet sammen, og de røde blodlegemer bliver krumme som en segl.`,
    };
  }
  const skrevet = protein.includes('LIV');
  return {
    ...ud, type: skrevet ? 'skrevet' : 'anden',
    titel: skrevet ? 'Proteinet siger LIV' : `${aaNavn(a0)} → ${aaNavn(a1)}`.replace(/^./, (c) => c.toUpperCase()),
    tekst: skrevet
      ? `${ord0} → ${ord1}: Nu står der ${protein.slice(0, LÆS_KODONER)} i begyndelsen af proteinet. Kan du finde LIV?`
      : `${ord0} → ${ord1}: Kodon ${nr} giver nu ${aaNavn(a1)} i stedet for ${aaNavn(a0)}. Nogle af den slags skift betyder næsten intet, andre ødelægger proteinet.`,
  };
}

// Proteinets begyndelse til panelet, fx 'M V H L T P V E K S' med stop som ■ (og intet efter)
export function proteinTekst(dna) {
  const ord = kodoner(dna);
  const ud = [];
  for (const k of ord) {
    const aa = KODE[tilRNA(k)];
    if (aa === STOP) {
      ud.push('■');
      break;
    }
    ud.push(aa);
  }
  return ud;
}
